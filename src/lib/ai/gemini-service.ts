import { z } from "zod";
import { geminiDiscoveryCache } from "../cache/multi-tier-cache";

/**
 * Centralized Gemini AI Service
 * Manages model fallback execution (gemini-3.5-flash -> gemini-2.5-flash -> gemini-1.5-flash),
 * Zod schema validation, response caching, and telemetry metrics.
 */

// Zod Schema for Vehicle AI Reasoning & Specification Output
export const DiscoveredVehicleSchema = z.object({
  manufacturer: z.string().min(1),
  model: z.string().min(1),
  variant: z.string().min(1),
  year: z.string().min(4).max(4),
  vehicle_type: z.string(),
  vehicle_category: z.enum(["Car", "SUV", "Truck/Bus"]),
  fuel_type: z.string(),
  gross_weight: z.string(),
  rim_size: z.string(),
  oem_tyre_size: z.string(),
  load_index: z.string(),
  speed_rating: z.string(),
  drive_type: z.string(),
  confidence: z.number().min(0.0).max(1.0),
});

export type DiscoveredVehicleData = z.infer<typeof DiscoveredVehicleSchema>;

export interface GeminiResponseMeta {
  modelUsed: string;
  latencyMs: number;
  fromCache: boolean;
}

export class GeminiService {
  private static PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
  private static FALLBACK_MODEL_1 = "gemini-2.5-flash";
  private static FALLBACK_MODEL_2 = "gemini-1.5-flash";

  /**
   * Discovers and extracts OEM vehicle specifications using Gemini Automotive Reasoning Engine.
   */
  static async discoverVehicleSpec(query: string): Promise<{ data: DiscoveredVehicleData | null; meta: GeminiResponseMeta }> {
    const cleanQuery = query.trim().toLowerCase();
    const startTime = Date.now();

    // 1. Check AI Cache
    const cachedData = geminiDiscoveryCache.get(cleanQuery);
    if (cachedData) {
      console.log(`[GeminiService] AI Cache HIT for query: "${cleanQuery}"`);
      return {
        data: cachedData,
        meta: {
          modelUsed: "cache",
          latencyMs: Date.now() - startTime,
          fromCache: true,
        },
      };
    }

    const apiKey = process.env.VITE_LLM_API_KEY || process.env.LLM_API_KEY || "";

    if (!apiKey) {
      console.warn("[GeminiService] Gemini API key not configured.");
      return {
        data: null,
        meta: { modelUsed: "none", latencyMs: Date.now() - startTime, fromCache: false },
      };
    }

    const systemPrompt = `You are an Automotive Specification & Reasoning Engine with encyclopedic knowledge of vehicles worldwide.
Your task is to identify the vehicle from the query: "${query}" and return its OEM specifications as strict JSON.

Rules:
1. Resolve fuzzy/abbreviated vehicle queries to exact official manufacturer and model names.
   Examples:
   - "Grand Vitara" / "Vitara" → Maruti Suzuki Grand Vitara
   - "Hyryder" → Toyota Urban Cruiser Hyryder
   - "Fortuner Legender" → Toyota Fortuner Legender
   - "ScorpioN" / "Scropio" → Mahindra Scorpio-N
   - "Cretta" → Hyundai Creta
   - "Honda City ZX CVT" → Honda City ZX
   - "Swift VXI" → Maruti Suzuki Swift VXI
   - "BMW X1" → BMW X1
2. Category Rules:
   - Cars, Sedans, Hatchbacks, EVs → "Car"
   - SUVs, Crossovers, Off-Roaders → "SUV"
   - Trucks, Buses, Tractors, Tippers → "Truck/Bus"

Schema:
{
  "manufacturer": "Official Manufacturer Name (e.g. Toyota, Maruti Suzuki, Hyundai, BMW, Mahindra)",
  "model": "Official Model Name (e.g. Fortuner, Grand Vitara, Creta, X1, Scorpio-N)",
  "variant": "Trim level or variant (e.g. Legender 4x4, Alpha 1.5, SX (O), sDrive20d, Z8 L)",
  "year": "Model year or representative year (e.g. 2024)",
  "vehicle_type": "SUV, Sedan, Hatchback, Heavy Truck, etc.",
  "vehicle_category": "Car, SUV, or Truck/Bus",
  "fuel_type": "Petrol, Diesel, Electric, Hybrid, or CNG",
  "gross_weight": "Estimated gross weight (e.g. 2100 kg)",
  "rim_size": "Standard rim diameter in inches (e.g. 17, 18, 19)",
  "oem_tyre_size": "Standard tyre sizing code (e.g. 265/60 R18, 215/60 R17, 225/55 R18)",
  "load_index": "Load index number (e.g. 110, 96, 98)",
  "speed_rating": "Speed rating letter (e.g. V, H, W)",
  "drive_type": "FWD, RWD, AWD, or 4WD",
  "confidence": 0.95
}`;

    const modelsToTry = [
      this.PRIMARY_MODEL,
      this.FALLBACK_MODEL_1,
      this.FALLBACK_MODEL_2,
    ];

    for (const targetModel of modelsToTry) {
      try {
        console.log(`[GeminiService] Invoking model: ${targetModel} for query: "${query}"...`);
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: `Extract OEM specifications for vehicle query: "${query}"` }] }],
              systemInstruction: { parts: [{ text: systemPrompt }] },
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.1,
              },
            }),
          }
        );

        if (!response.ok) {
          console.warn(`[GeminiService] Model ${targetModel} returned HTTP ${response.status}. Retrying fallback...`);
          continue;
        }

        const resData = await response.json();
        let rawJsonText = resData.candidates?.[0]?.content?.parts?.[0]?.text || "";

        rawJsonText = rawJsonText.trim();
        if (rawJsonText.startsWith("```")) {
          rawJsonText = rawJsonText.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
        }

        const parsedJson = JSON.parse(rawJsonText);
        const validated = DiscoveredVehicleSchema.parse(parsedJson);

        // Cache successful response
        geminiDiscoveryCache.set(cleanQuery, validated);

        return {
          data: validated,
          meta: {
            modelUsed: targetModel,
            latencyMs: Date.now() - startTime,
            fromCache: false,
          },
        };
      } catch (err) {
        console.warn(`[GeminiService] Execution failed on model ${targetModel}:`, err);
      }
    }

    // Return null data gracefully on total failure without crashing application
    return {
      data: null,
      meta: {
        modelUsed: "failed",
        latencyMs: Date.now() - startTime,
        fromCache: false,
      },
    };
  }
}
