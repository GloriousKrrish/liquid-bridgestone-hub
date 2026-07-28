import { discoverRealTimeDealers, type RealDealer } from "./dealer.functions";

/**
 * Bridy AI — Enterprise Chat Server Function
 */
let serverRequestCount = 0;

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

    let systemPrompt = getSystemPrompt();
    let realDealersFound: RealDealer[] = [];

    // Check if query is about dealer / store discovery
    const isDealerQuery = data.message.toLowerCase().match(/dealer|store|shop|near me|locate|location|where.*buy|address|appointment/);
    if (isDealerQuery) {
      // Extract location hint or default
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

    // Limit history to last 20 messages to control token usage
    const trimmedHistory = data.history.slice(-20);

    try {
      let responseText = "";

      // ── Multi-Tier Fallback Cascade: 3.5-flash → 2.5-flash → 1.5-flash ──
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
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents,
                systemInstruction: {
                  parts: [{ text: systemPrompt }],
                },
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 4096,
                },
              }),
            }
          );

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
          console.warn(`[Gemini Model ${modelName} Network Error]:`, err);
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

      return {
        success: true,
        text: responseText,
        detectedIntent,
        suggestedPrompts,
        realDealers: realDealersFound,
      };
    } catch (error: any) {
      console.error("[Bridy AI] Server error:", error);
      return {
        success: false,
        error: "API_ERROR",
        message: error.message || "Failed to process your request",
      };
    }
  });

/**
 * Intent Detection — Classify the conversation topic
 */
function detectIntent(
  userMessage: string,
  _aiResponse: string
): string | undefined {
  const msg = userMessage.toLowerCase();

  if (
    msg.match(
      /recommend|suggest|best tyre|which tyre|tyre for|tyres for|my car|my vehicle|driving/
    )
  )
    return "tyre_recommendation";

  if (msg.match(/dealer|store|shop|near me|locate|location|where.*buy/))
    return "dealer_search";

  if (msg.match(/fleet|commercial|truck|bus|logistics|tco|cost/))
    return "fleet_consultation";

  if (msg.match(/warranty|claim|defect|replace|guarantee|coverage/))
    return "warranty_support";

  if (
    msg.match(
      /price|spec|specification|compare|feature|turanza|dueler|potenza|ecopia|alenza|sturdo/
    )
  )
    return "product_inquiry";

  if (msg.match(/buy|purchase|order|need tyre|want tyre|get tyre/))
    return "lead_generation";

  if (
    msg.match(
      /bridgestone.*company|sustainability|factory|manufacturing|history|about/
    )
  )
    return "corporate_info";

  return "general_support";
}

/**
 * Generate contextual follow-up suggestions based on detected intent
 */
function generateSuggestions(
  intent: string | undefined,
  _userMessage: string
): string[] {
  switch (intent) {
    case "tyre_recommendation":
      return [
        "Compare this with alternatives",
        "Where can I buy this near me?",
        "What's the expected lifespan?",
        "Is it good for monsoon driving?",
      ];
    case "dealer_search":
      return [
        "Show directions to the nearest dealer",
        "Do they have my tyre in stock?",
        "Can I book an appointment?",
        "What are the service charges?",
      ];
    case "fleet_consultation":
      return [
        "Calculate fleet TCO savings",
        "Recommend a maintenance schedule",
        "Compare retreading vs new tyres",
        "What fleet tools does Bridgestone offer?",
      ];
    case "warranty_support":
      return [
        "What does the warranty cover?",
        "How do I file a warranty claim?",
        "What documents do I need?",
        "How long does the claim process take?",
      ];
    case "product_inquiry":
      return [
        "Compare with competitor products",
        "Which vehicle is this best for?",
        "Find a dealer with this in stock",
        "What's the installation cost?",
      ];
    case "lead_generation":
      return [
        "Connect me with a dealer",
        "Schedule a callback",
        "Check availability in my area",
        "Any current offers or discounts?",
      ];
    default:
      return [
        "Tell me about Bridgestone products",
        "Help me find the right tyre",
        "Find dealers near me",
        "What makes Bridgestone tyres special?",
      ];
  }
}
