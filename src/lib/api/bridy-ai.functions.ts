import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import process from "node:process";
import { getSystemPrompt } from "../../lib/bridy-ai/system-prompt";
import { discoverRealTimeDealers, type RealDealer } from "./dealer.functions";

/**
 * Bridy AI — Enterprise Chat Server Function
 */
let serverRequestCount = 0;

// In-Memory AI Cache (5-minute TTL to reduce repetitive LLM calls)
interface AICachedResponse {
  timestamp: number;
  data: any;
}
const aiResponseCache = new Map<string, AICachedResponse>();
const AI_CACHE_TTL_MS = 5 * 60 * 1000;

export const bridyAIChat = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      message: z.string().min(1).max(4000),
      conversationId: z.string(),
      history: z.array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })
      ),
    })
  )
  .handler(async ({ data }) => {
    serverRequestCount++;
    const apiKey = process.env.VITE_LLM_API_KEY || "";

    if (!apiKey) {
      console.warn(`[Gemini API Request #${serverRequestCount}] Failed: VITE_LLM_API_KEY not configured.`);
      return {
        success: false,
        error: "NO_API_KEY",
        message:
          "VITE_LLM_API_KEY is not configured. Please set this environment variable to connect Bridy AI to a live LLM provider.",
      };
    }

    // Check Cache for exact repeat queries without long history
    const cacheKey = `${data.message.trim().toLowerCase()}_hist${data.history.length}`;
    const cached = aiResponseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < AI_CACHE_TTL_MS) {
      console.log(`[AI Response Cache HIT] Returning cached response for query: "${data.message}"`);
      return cached.data;
    }

    let systemPrompt = getSystemPrompt();
    let realDealersFound: RealDealer[] = [];

    // Check if query is about dealer / store discovery
    const isDealerQuery = data.message.toLowerCase().match(/dealer|store|shop|near me|locate|location|where.*buy|address|appointment/);
    if (isDealerQuery) {
      let locationHint = data.message.replace(/find|search|dealer|store|shop|near|me|locate|bridgestone|tyre|buy|where|show|for|in|at/gi, "").trim();
      if (!locationHint || locationHint.length < 3) {
        locationHint = "Pune, Maharashtra, India";
      }

      console.log(`[Bridy Chat UI] Real-time dealer search triggered for: "${locationHint}"`);
      try {
        const dealerResult = await discoverRealTimeDealers({
          data: { locationQuery: locationHint },
        });

        if (dealerResult.success && dealerResult.dealers.length > 0) {
          realDealersFound = dealerResult.dealers;
          systemPrompt += `\n\nREAL GOOGLE PLACES API DEALER DATA:\nLocation Requested: ${dealerResult.searchLocation}\nRadius Searched: ${dealerResult.radiusKm} km\nBridgestone Exclusivity: ${dealerResult.isBridgestoneOnly ? "Bridgestone Stores Found" : "General Tyre Retailer Fallback"}\n\nReal Dealers:\n${JSON.stringify(dealerResult.dealers, null, 2)}\n\nCRITICAL INSTRUCTION: Do NOT invent or hallucinate any fake dealer names, addresses, or phone numbers. Use ONLY the real dealer data listed above to answer the user.`;
        }
      } catch (err) {
        console.error("[Bridy Chat UI] Dealer discovery failed:", err);
      }
    }

    // Limit history to last 16 messages to reduce payload size and token overhead
    const trimmedHistory = data.history.slice(-16);

    try {
      let responseText = "";

      // Multi-Tier Fallback Cascade: 3.5-flash → 2.5-flash → 1.5-flash
      const MODEL_FALLBACK_CASCADE = [
        process.env.GEMINI_MODEL || "gemini-3.5-flash",
        "gemini-2.5-flash",
        "gemini-1.5-flash",
      ];

      const contents = [
        ...trimmedHistory.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
        {
          role: "user",
          parts: [{ text: data.message }],
        },
      ];

      let lastError: Error | null = null;
      let usedModel = "";

      for (const modelName of MODEL_FALLBACK_CASCADE) {
        try {
          console.log(`[Gemini API Request #${serverRequestCount}] Attempting model: ${modelName}`);

          // Timeout AbortController after 15 seconds to prevent hanging requests
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: controller.signal,
              body: JSON.stringify({
                contents,
                systemInstruction: {
                  parts: [{ text: systemPrompt }],
                },
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 2048,
                },
              }),
            }
          );
          clearTimeout(timeoutId);

          console.log(`[Gemini API Response #${serverRequestCount}] model ${modelName} status: ${response.status}`);

          if (response.ok) {
            const resData = await response.json();
            responseText = resData.candidates?.[0]?.content?.parts?.[0]?.text || "";
            usedModel = modelName;
            console.log(`[Gemini API Success #${serverRequestCount}] Succeeded with ${usedModel}`);
            break;
          } else {
            const errBody = await response.text();
            console.warn(`[Gemini Model ${modelName} Failed] status: ${response.status}, error: ${errBody}`);
            lastError = new Error(`Model ${modelName} error (${response.status}): ${errBody}`);
          }
        } catch (err: any) {
          console.warn(`[Gemini Model ${modelName} Network Error/Timeout]:`, err);
          lastError = err;
        }
      }

      if (!responseText && lastError) {
        throw lastError;
      }

      // Detect intent from the response
      const detectedIntent = detectIntent(data.message, responseText);

      // Generate contextual follow-up suggestions
      const suggestedPrompts = generateSuggestions(detectedIntent, data.message);

      const finalResult = {
        success: true,
        text: responseText,
        detectedIntent,
        suggestedPrompts,
        realDealers: realDealersFound,
      };

      // Store in AI response cache
      aiResponseCache.set(cacheKey, { timestamp: Date.now(), data: finalResult });

      return finalResult;
    } catch (error: any) {
      console.error(`[Gemini API Error #${serverRequestCount}]:`, error);
      return {
        success: false,
        error: "API_ERROR",
        message:
          error.message || "Failed to generate AI response. Please verify your connection or try again.",
      };
    }
  });

function detectIntent(userMessage: string, aiResponse: string): string {
  const query = (userMessage + " " + aiResponse).toLowerCase();
  if (query.includes("dealer") || query.includes("store") || query.includes("location") || query.includes("pincode")) {
    return "dealer_search";
  }
  if (query.includes("turanza") || query.includes("dueler") || query.includes("ecopia") || query.includes("potenza") || query.includes("recommend")) {
    return "tyre_recommendation";
  }
  if (query.includes("pressure") || query.includes("alignment") || query.includes("maintenance") || query.includes("rotation")) {
    return "maintenance_advice";
  }
  if (query.includes("appointment") || query.includes("booking") || query.includes("slot")) {
    return "appointment_booking";
  }
  return "general_inquiry";
}

function generateSuggestions(intent: string, userMessage: string): string[] {
  switch (intent) {
    case "dealer_search":
      return [
        "Book an appointment slot at nearest store",
        "Check stock for Turanza 6i",
        "Show store phone numbers & operating hours",
      ];
    case "tyre_recommendation":
      return [
        "Where can I buy these tyres near me?",
        "Compare Turanza 6i vs Ecopia EP150",
        "What is the warranty period for this tyre?",
      ];
    case "maintenance_advice":
      return [
        "How often should I balance and align my tyres?",
        "Find an authorized Bridgestone service center",
        "What is the recommended PSI for electric vehicles?",
      ];
    case "appointment_booking":
      return [
        "Confirm booking for tomorrow",
        "Which stores have Sunday availability?",
        "What services are included in fitment?",
      ];
    default:
      return [
        "Find Bridgestone Select stores near Pune",
        "Recommend tyres for my SUV",
        "What is the Bridgestone warranty policy?",
      ];
  }
}
