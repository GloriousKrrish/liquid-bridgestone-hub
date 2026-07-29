import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { VehicleRecord } from "../vehicle-db";
import { PRODUCT_CATALOG, SKU_CATALOG, type Product, type TyreSKU } from "../bridgestone-data";
import { GeminiService } from "../ai/gemini-service";

// Schema for Gemini Discovery response validation
const discoveredVehicleSchema = z.object({
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

// Speed ratings helper
const SPEED_RATINGS_ORDER = ["J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "H", "V", "W", "Y"];

function isSpeedRatingCompatible(tyreRating: string, oemRating: string): boolean {
  const tIndex = SPEED_RATINGS_ORDER.indexOf(tyreRating.toUpperCase());
  const oIndex = SPEED_RATINGS_ORDER.indexOf(oemRating.toUpperCase());
  if (tIndex === -1 || oIndex === -1) return true;
  return tIndex >= oIndex;
}

// Size compatibility calculator — expanded tolerance for global coverage
function calculateSizeCompatibility(tyreSize: string, oemSize: string) {
  if (tyreSize.replace(/\s+/g, "") === oemSize.replace(/\s+/g, "")) {
    return { compatible: true, percentage: 100, explanation: "Exact OEM Size Match" };
  }

  const passRegex = /^(\d+)\/(\d+)\s*R([\d.]+)$/;
  const commRegex = /^([\d.]+)\s*R([\d.]+)$/;

  const mTyrePass = tyreSize.match(passRegex);
  const mOemPass = oemSize.match(passRegex);

  if (mTyrePass && mOemPass) {
    const wTyre = parseInt(mTyrePass[1], 10);
    const aTyre = parseInt(mTyrePass[2], 10);
    const rTyre = parseFloat(mTyrePass[3]);

    const wOem = parseInt(mOemPass[1], 10);
    const aOem = parseInt(mOemPass[2], 10);
    const rOem = parseFloat(mOemPass[3]);

    if (rTyre !== rOem) {
      return { compatible: false, percentage: 0, explanation: `Rim Mismatch (${rTyre}" vs ${rOem}")` };
    }

    const widthDiff = Math.abs(wTyre - wOem);
    const aspectDiff = Math.abs(aTyre - aOem);

    // Tier 1: Tight match (±10mm width, ±5% aspect) → 85-100%
    if (widthDiff <= 10 && aspectDiff <= 5) {
      const penalty = widthDiff * 1.5 + aspectDiff * 3;
      const percentage = Math.max(85, Math.round(100 - penalty));
      const label = widthDiff === 0 && aspectDiff === 0 ? "Exact OEM Size Match" : wTyre > wOem ? "Plus-Sized Alternative" : "Near-OEM Alternative";
      return { compatible: true, percentage, explanation: `${label} (Rim matches, Width diff ${widthDiff}mm, Aspect diff ${aspectDiff}%)` };
    }

    // Tier 2: Moderate match (±20mm width, ±10% aspect) → 65-84%
    if (widthDiff <= 20 && aspectDiff <= 10) {
      const penalty = widthDiff * 1.0 + aspectDiff * 2;
      const percentage = Math.max(65, Math.round(90 - penalty));
      return { compatible: true, percentage, explanation: `Compatible Alternative (Width diff ${widthDiff}mm, Aspect diff ${aspectDiff}%)` };
    }

    // Tier 3: Same rim, wider tolerance (±30mm, ±15%) → 55-64%
    if (widthDiff <= 30 && aspectDiff <= 15) {
      const percentage = Math.max(55, Math.round(75 - widthDiff * 0.5 - aspectDiff * 1.0));
      return { compatible: true, percentage, explanation: `Acceptable Fitment (Width diff ${widthDiff}mm, Aspect diff ${aspectDiff}%)` };
    }
  }

  const mTyreComm = tyreSize.match(commRegex);
  const mOemComm = oemSize.match(commRegex);

  if (mTyreComm && mOemComm) {
    const wTyre = parseFloat(mTyreComm[1]);
    const rTyre = parseFloat(mTyreComm[2]);
    const wOem = parseFloat(mOemComm[1]);
    const rOem = parseFloat(mOemComm[2]);

    if (rTyre !== rOem) {
      return { compatible: false, percentage: 0, explanation: `Rim Mismatch (${rTyre}" vs ${rOem}")` };
    }

    const widthDiff = Math.abs(wTyre - wOem);
    if (widthDiff <= 3.0) {
      const percentage = Math.max(60, Math.round(100 - widthDiff * 12));
      return {
        compatible: true,
        percentage,
        explanation: widthDiff === 0 ? "Exact Commercial Profile Match" : `Compatible Commercial Profile (width diff ${widthDiff}")`,
      };
    }
  }

  // Cross-format: if OEM is commercial (e.g. 14.00 R20) and SKU is metric (295/90 R20), check rim match
  const mTyrePassCross = tyreSize.match(passRegex);
  const mOemCommCross = oemSize.match(commRegex);
  if (mTyrePassCross && mOemCommCross) {
    const rTyre = parseFloat(mTyrePassCross[3]);
    const rOem = parseFloat(mOemCommCross[2]);
    if (rTyre === rOem) {
      return { compatible: true, percentage: 65, explanation: `Cross-Format Rim Match (Metric on ${rOem}" commercial rim)` };
    }
  }
  const mTyreCommCross = tyreSize.match(commRegex);
  const mOemPassCross = oemSize.match(passRegex);
  if (mTyreCommCross && mOemPassCross) {
    const rTyre = parseFloat(mTyreCommCross[2]);
    const rOem = parseFloat(mOemPassCross[3]);
    if (rTyre === rOem) {
      return { compatible: true, percentage: 65, explanation: `Cross-Format Rim Match (Commercial on ${rOem}" passenger rim)` };
    }
  }

  return { compatible: false, percentage: 0, explanation: "Incompatible sizing profile" };
}

// 1. SEARCH VEHICLE SERVER FUNCTION
export const searchVehicle = createServerFn({ method: "POST" })
  .inputValidator(z.object({ query: z.string() }))
  .handler(async ({ data }) => {
    const query = data.query.trim();
    if (!query) return { success: false, error: "Empty query", vehicles: [] };

    console.log(`[Vehicle Search] Query: "${query}"`);

    // Dynamically load database manager to bypass client evaluation errors
    const { 
      resolveVehicleSearch, 
      incrementSearchCount, 
      saveAuditLog, 
      loadAdminMetrics, 
      saveAdminMetrics, 
      loadVehicleDatabase, 
      saveVehicleDatabase 
    } = await import("../vehicle-db");

    // Step 1: Search internal database (Static + Discovered)
    const matches = resolveVehicleSearch(query);

    if (matches.length > 0) {
      console.log(`[Vehicle Search] Found ${matches.length} matching vehicles in database.`);
      
      // Increment search count for the best match
      incrementSearchCount(matches[0].id);

      // Save log
      saveAuditLog({
        query,
        timestamp: new Date().toISOString(),
        resolvedTo: matches[0].id,
        method: matches[0].isDiscovered ? "learned" : "static",
        confidenceScore: matches[0].confidence,
      });

      return {
        success: true,
        method: matches[0].isDiscovered ? "learned" : "static",
        vehicles: matches.slice(0, 5),
      };
    }

    // Step 2: Not Found -> Trigger Gemini Vehicle Discovery Engine via centralized GeminiService
    console.log(`[Vehicle Search] Vehicle not found in local DB. Triggering Gemini AI Discovery for "${query}"...`);
    
    // Increment metrics calls count
    const metrics = loadAdminMetrics();
    saveAdminMetrics({ geminiCallsCount: (metrics.geminiCallsCount || 0) + 1 });

    try {
      const { data: validatedData, meta } = await GeminiService.discoverVehicleSpec(query);

      if (!validatedData) {
        console.warn("[Vehicle Search] Gemini discovery failed or returned empty result.");
        saveAuditLog({
          query,
          timestamp: new Date().toISOString(),
          resolvedTo: null,
          method: "not_found",
          confidenceScore: 0,
        });
        return {
          success: false,
          error: "AI_DISCOVERY_FAILED",
          message: "Unable to resolve vehicle specifications.",
          vehicles: [],
        };
      }

      // Save success metric
      const freshMetrics = loadAdminMetrics();
      saveAdminMetrics({ geminiSuccessesCount: (freshMetrics.geminiSuccessesCount || 0) + 1 });

      // Build vehicle record
      const id = `${validatedData.manufacturer.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${validatedData.model.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${validatedData.year}-${validatedData.variant.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      
      const newRecord: VehicleRecord = {
        id,
        ...validatedData,
        isDiscovered: true,
        discoveredAt: new Date().toISOString(),
        searchCount: 1,
      };

      // Add to database
      const db = loadVehicleDatabase();
      
      // Duplicate prevention check
      const existsIndex = db.findIndex((x) => x.id === id);
      if (existsIndex === -1) {
        db.push(newRecord);
        saveVehicleDatabase(db);
        console.log(`[Vehicle Search] Successfully saved discovered vehicle "${newRecord.manufacturer} ${newRecord.model}" to database (Model used: ${meta.modelUsed}, Latency: ${meta.latencyMs}ms).`);
      } else {
        db[existsIndex].searchCount = (db[existsIndex].searchCount ?? 0) + 1;
        saveVehicleDatabase(db);
      }

      saveAuditLog({
        query,
        timestamp: new Date().toISOString(),
        resolvedTo: id,
        method: "gemini_discovered",
        confidenceScore: validatedData.confidence,
      });

      return {
        success: true,
        method: "gemini_discovered",
        vehicles: [newRecord],
      };
    } catch (e: any) {
      console.error(`[Gemini Discovery] Failed:`, e);
      saveAuditLog({
        query,
        timestamp: new Date().toISOString(),
        resolvedTo: null,
        method: "not_found",
        confidenceScore: 0,
      });
      return {
        success: false,
        error: "DISCOVERY_FAILED",
        message: e.message || "Failed to parse vehicle specifications from AI.",
        vehicles: [],
      };
    }
  });

// 2. DETERMINISTIC TYRE RECOMMENDATION SERVER FUNCTION
export const getRecommendations = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      vehicleId: z.string(),
      terrain: z.enum(["Urban", "Highway", "Off-Road", ""]),
      roadCondition: z.enum(["Smooth", "Broken", "Rough", ""]),
      loadRequirement: z.enum(["Standard", "Heavy", ""]),
      priority: z.enum(["Comfort", "Toughness", "Efficiency", "Sport", "Commercial", ""]),
    })
  )
  .handler(async ({ data }) => {
    const { vehicleId, terrain, roadCondition, loadRequirement, priority } = data;
    
    // Dynamically load database manager
    const { loadVehicleDatabase } = await import("../vehicle-db");
    const db = loadVehicleDatabase();
    const vehicle = db.find((v) => v.id === vehicleId);

    if (!vehicle) {
      return { success: false, error: "VEHICLE_NOT_FOUND", recommendations: [] };
    }

    const oemLoad = parseInt(vehicle.load_index, 10) || 88;
    const oemSpeed = vehicle.speed_rating.toUpperCase() || "H";

    const scoredRecs = [];

    // Loop through our Bridgestone catalog
    for (const product of PRODUCT_CATALOG) {
      const productSkus = SKU_CATALOG.filter((s) => s.productId === product.id);
      let bestSku: TyreSKU | null = null;
      let bestSizeMatch = { compatible: false, percentage: 0, explanation: "" };

      for (const sku of productSkus) {
        const sizeMatch = calculateSizeCompatibility(sku.size, vehicle.oem_tyre_size);
        if (sizeMatch.compatible && sizeMatch.percentage > bestSizeMatch.percentage) {
          bestSizeMatch = sizeMatch;
          bestSku = sku;
        }
      }

      if (!bestSku || !bestSizeMatch.compatible) continue;

      // Match Load Index (Safety critical)
      let loadScore = 100;
      let loadExplanation = `Load Rating Match (${bestSku.loadIndex} matches/exceeds OEM ${oemLoad})`;
      if (bestSku.loadIndex < oemLoad) {
        const diff = oemLoad - bestSku.loadIndex;
        loadScore = Math.max(0, 100 - diff * 20);
        loadExplanation = `Insufficient Load Rating: ${bestSku.loadIndex} is below OEM ${oemLoad}`;
      }

      // Match Speed Rating
      let speedScore = 100;
      let speedExplanation = `Speed Rating Match (${bestSku.speedRating} matches/exceeds OEM ${oemSpeed})`;
      if (!isSpeedRatingCompatible(bestSku.speedRating, oemSpeed)) {
        speedScore = 60;
        speedExplanation = `Speed Rating Mismatch: ${bestSku.speedRating} is below OEM ${oemSpeed}`;
      }

      // Match Segment Suitability
      let segmentScore = 100;
      let segmentExplanation = `Optimal Segment Match (${vehicle.vehicle_type} optimized)`;
      // Check if product suitability covers vehicle type (case-insensitive fuzzy check)
      const matchesSegment = product.segmentSuitability.some((seg) =>
        vehicle.vehicle_type.toLowerCase().includes(seg.toLowerCase()) ||
        seg.toLowerCase().includes(vehicle.vehicle_type.toLowerCase())
      );
      if (!matchesSegment && product.vehicleCategory !== vehicle.vehicle_category) {
        segmentScore = 50;
        segmentExplanation = `Compromised Segment Match: designed for ${product.segmentSuitability.join("/")}`;
      }

      // Apply Usage Preferences
      let preferenceScore = 70;
      const matchingReasons: string[] = [];

      if (terrain) {
        if (product.usageSuitability.includes(terrain)) {
          preferenceScore += 10;
          matchingReasons.push(`${terrain} Terrain Optimized`);
        } else {
          preferenceScore -= 10;
        }
      }

      if (roadCondition === "Rough") {
        if (product.treadPatternType === "all-terrain" || product.treadPatternType === "tipper-block") {
          preferenceScore += 10;
          matchingReasons.push("Rough Trails Grip Pattern");
        }
      } else if (roadCondition === "Broken") {
        if (product.treadPatternType === "durable" || product.treadPatternType === "rib-commercial") {
          preferenceScore += 10;
          matchingReasons.push("Pothole & Durability Compounding");
        }
      } else if (roadCondition === "Smooth") {
        if (product.treadPatternType === "touring" || product.treadPatternType === "sport" || product.treadPatternType === "eco") {
          preferenceScore += 10;
          matchingReasons.push("Low-Vibration Comfort Design");
        }
      }

      if (loadRequirement === "Heavy" && (product.treadPatternType === "rib-commercial" || product.treadPatternType === "tipper-block" || product.treadPatternType === "all-terrain")) {
        preferenceScore += 5;
        matchingReasons.push("Heavy Load Structural Support");
      }

      if (priority === "Comfort" && product.treadPatternType === "touring") {
        preferenceScore += 15;
        matchingReasons.push("Superior Touring Silent Comfort");
      } else if (priority === "Toughness" && product.treadPatternType === "durable") {
        preferenceScore += 15;
        matchingReasons.push("Harsh Road Casing Durability");
      } else if (priority === "Efficiency" && product.treadPatternType === "eco") {
        preferenceScore += 15;
        matchingReasons.push("Rolling Resistance Efficiency Range");
      } else if (priority === "Sport" && product.treadPatternType === "sport") {
        preferenceScore += 15;
        matchingReasons.push("High-Speed Sport Cornering");
      } else if (priority === "Commercial" && (product.treadPatternType === "rib-commercial" || product.treadPatternType === "tipper-block")) {
        preferenceScore += 15;
        matchingReasons.push("Heavy Commercial Fleet retreadability");
      }

      preferenceScore = Math.max(50, Math.min(100, preferenceScore));
      const preferenceExplanation = matchingReasons.length > 0 ? matchingReasons.join(", ") : "Standard operational usage compatibility";

      // Score Weights
      const sizeWeight = 0.4;
      const loadWeight = 0.2;
      const speedWeight = 0.15;
      const segmentWeight = 0.15;
      const preferenceWeight = 0.1;

      let overallScore = Math.round(
        bestSizeMatch.percentage * sizeWeight +
          loadScore * loadWeight +
          speedScore * speedWeight +
          segmentScore * segmentWeight +
          preferenceScore * preferenceWeight
      );

      if (bestSizeMatch.percentage === 0 || loadScore < 60) {
        overallScore = 0;
      }

      const rationales = [];
      if (bestSizeMatch.percentage === 100) {
        rationales.push("an exact OEM size match");
      } else {
        rationales.push(`a compatible size alternative (${bestSku.size})`);
      }
      if (loadScore === 100) rationales.push("meets the load rating requirements");
      if (speedScore === 100) rationales.push("meets speed rating indices");
      if (matchingReasons.length > 0) rationales.push(`aligns perfectly with your ${priority || "comfort"} preference`);

      const whyThisTyreText = `This product is recommended because it is ${rationales.join(", ")}.`;

      scoredRecs.push({
        product,
        sku: bestSku,
        score: overallScore,
        sizeScore: bestSizeMatch.percentage,
        loadScore,
        speedScore,
        segmentScore,
        preferenceScore,
        explanations: {
          whyThisTyre: whyThisTyreText,
          size: bestSizeMatch.explanation,
          load: loadExplanation,
          speed: speedExplanation,
          segment: segmentExplanation,
          preference: preferenceExplanation,
        },
      });
    }

    scoredRecs.sort((a, b) => b.score - a.score);
    let validRecs = scoredRecs.filter((r) => r.score > 0);

    // ── FALLBACK: If zero size-matched recommendations, generate category-based fallback ──
    // This handles exotic sizes (construction equipment, agricultural vehicles, luxury EVs)
    // where no SKU in our catalog has a compatible size.
    if (validRecs.length === 0) {
      console.log(`[Recommendations] No size-matched recs for ${vehicleId}. Generating category fallback...`);
      
      const categoryProducts = PRODUCT_CATALOG.filter(
        (p) => p.vehicleCategory === vehicle.vehicle_category
      );
      
      // If no category match (very rare), fall back to all products
      const fallbackProducts = categoryProducts.length > 0 ? categoryProducts : PRODUCT_CATALOG;

      for (const product of fallbackProducts) {
        const productSkus = SKU_CATALOG.filter((s) => s.productId === product.id);
        if (productSkus.length === 0) continue;

        // Pick the SKU with the closest rim size to the vehicle's OEM
        const oemRimNum = parseFloat(vehicle.rim_size) || 17;
        let bestFallbackSku = productSkus[0];
        let bestRimDiff = Math.abs(parseFloat(productSkus[0].rimSize) - oemRimNum);

        for (const sku of productSkus) {
          const rimDiff = Math.abs(parseFloat(sku.rimSize) - oemRimNum);
          if (rimDiff < bestRimDiff) {
            bestRimDiff = rimDiff;
            bestFallbackSku = sku;
          }
        }

        // Calculate a fallback score based on category match and rim proximity
        let fallbackScore = 60; // base score for category match
        if (bestRimDiff === 0) fallbackScore += 15; // exact rim match
        else if (bestRimDiff <= 1) fallbackScore += 10;
        else if (bestRimDiff <= 2) fallbackScore += 5;

        // Segment suitability boost
        const matchesSegment = product.segmentSuitability.some((seg) =>
          vehicle.vehicle_type.toLowerCase().includes(seg.toLowerCase()) ||
          seg.toLowerCase().includes(vehicle.vehicle_type.toLowerCase())
        );
        if (matchesSegment) fallbackScore += 10;

        const fallbackExplanation = bestRimDiff === 0
          ? `Closest Available Match (${bestFallbackSku.size} on matching ${bestFallbackSku.rimSize}" rim)`
          : `Category-Based Recommendation (nearest available: ${bestFallbackSku.size})`;

        validRecs.push({
          product,
          sku: bestFallbackSku,
          score: Math.min(fallbackScore, 90),
          sizeScore: bestRimDiff === 0 ? 70 : 50,
          loadScore: bestFallbackSku.loadIndex >= oemLoad ? 100 : 60,
          speedScore: 80,
          segmentScore: matchesSegment ? 100 : 60,
          preferenceScore: 70,
          explanations: {
            whyThisTyre: `This ${product.name} is recommended as the best available option for your ${vehicle.vehicle_type}. ${matchesSegment ? "It is specifically designed for your vehicle segment." : "It provides reliable performance across usage conditions."}`,
            size: fallbackExplanation,
            load: bestFallbackSku.loadIndex >= oemLoad ? `Load Rating Match (${bestFallbackSku.loadIndex} meets/exceeds OEM ${oemLoad})` : `Nearest Load Rating Available (${bestFallbackSku.loadIndex})`,
            speed: `Speed Rating: ${bestFallbackSku.speedRating}`,
            segment: matchesSegment ? `Optimized for ${vehicle.vehicle_type}` : `Cross-Category: designed for ${product.segmentSuitability.join("/")}`,
            preference: "Category-matched recommendation",
          },
        });
      }

      // Sort fallback results
      validRecs.sort((a, b) => b.score - a.score);
    }

    // Ensure we always have exactly 4 recommendations. If validRecs has fewer than 4,
    // fill it with other products from PRODUCT_CATALOG.
    if (validRecs.length < 4) {
      console.log(`[Recommendations] Only ${validRecs.length} recommendations generated. Filling up to 4...`);
      for (const product of PRODUCT_CATALOG) {
        if (validRecs.length >= 4) break;
        // Check if product is already recommended
        const alreadyRecommended = validRecs.some((r) => r.product.id === product.id);
        if (alreadyRecommended) continue;

        const productSkus = SKU_CATALOG.filter((s) => s.productId === product.id);
        if (productSkus.length === 0) continue;

        // Find closest SKU by rim size
        const oemRimNum = parseFloat(vehicle.rim_size) || 17;
        let bestFallbackSku = productSkus[0];
        let bestRimDiff = Math.abs(parseFloat(productSkus[0].rimSize) - oemRimNum);

        for (const sku of productSkus) {
          const rimDiff = Math.abs(parseFloat(sku.rimSize) - oemRimNum);
          if (rimDiff < bestRimDiff) {
            bestRimDiff = rimDiff;
            bestFallbackSku = sku;
          }
        }

        // Set low score since it's a cross-category fallback filler
        let fillerScore = 40;
        
        validRecs.push({
          product,
          sku: bestFallbackSku,
          score: fillerScore,
          sizeScore: 50,
          loadScore: 60,
          speedScore: 60,
          segmentScore: 50,
          preferenceScore: 50,
          explanations: {
            whyThisTyre: `This ${product.name} is provided as an alternative fitment option for consideration.`,
            size: `Alternative Fitment (${bestFallbackSku.size})`,
            load: `Load Rating: ${bestFallbackSku.loadIndex}`,
            speed: `Speed Rating: ${bestFallbackSku.speedRating}`,
            segment: `Alternative category suitability`,
            preference: "Alternative fitment option",
          },
        });
      }
    }

    // Cap at top 4 recommendations
    validRecs = validRecs.slice(0, 4);

    return {
      success: true,
      recommendations: validRecs,
    };
  });

// 3. GET ADMIN METRICS SERVER FUNCTION
export const getAdminMetrics = createServerFn({ method: "GET" }).handler(async () => {
  const { loadAdminMetrics, loadAuditLogs } = await import("../vehicle-db");
  const metrics = loadAdminMetrics();
  const auditLogs = loadAuditLogs();

  return {
    totalStoredCount: metrics.totalVehiclesStored,
    discoveredCount: metrics.newVehiclesLearned,
    geminiCallsCount: metrics.geminiCallsCount,
    geminiSuccessesCount: metrics.geminiSuccessesCount,
    mostSearched: metrics.mostSearchedVehicles.map((v) => ({
      id: v.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: v.name,
      searchCount: v.count,
    })),
    auditLogs: [...auditLogs].reverse(), // Show newest logs first
  };
});

// 4. GET ALL VEHICLES SERVER FUNCTION
export const getAllVehicles = createServerFn({ method: "GET" }).handler(async () => {
  const { loadVehicleDatabase } = await import("../vehicle-db");
  return loadVehicleDatabase();
});
