import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { VEHICLES, OEM_SPECIFICATIONS, type Vehicle, type OemSpec } from "./bridgestone-data";
import { vehicleSearchCache } from "./cache/multi-tier-cache";
import { lookupVehicleAlias } from "./search/alias-dictionary";
import { calculateStringSimilarity, normalizeVehicleQuery } from "./search/fuzzy-engine";

// Phase 1 - Normalized Database Specification
export interface VehicleRecord {
  id: string; // normalized slug, e.g. "hyundai-creta-2023-sx"
  manufacturer: string;
  model: string;
  variant: string;
  year: string;
  vehicle_type: string; // Hatchback, Sedan, SUV, MPV, Pickup Truck, Heavy Truck, Bus, Tractor, Electric Vehicle, etc.
  vehicle_category: "Car" | "SUV" | "Truck/Bus";
  fuel_type: string;
  gross_weight: string; // e.g. "1680 kg"
  rim_size: string; // e.g. "16"
  oem_tyre_size: string; // e.g. "205/65 R16"
  load_index: string; // e.g. "95"
  speed_rating: string; // e.g. "H"
  drive_type: string; // FWD, RWD, AWD
  confidence: number; // Gemini confidence score (0.0 to 1.0)
  isDiscovered: boolean;
  discoveredAt?: string;
  searchCount?: number;
}

export interface SearchAuditLog {
  query: string;
  timestamp: string;
  resolvedTo: string | null;
  method: "static" | "learned" | "gemini_discovered" | "not_found";
  confidenceScore: number;
}

export interface AdminMetrics {
  totalVehiclesStored: number;
  newVehiclesLearned: number;
  mostSearchedVehicles: { name: string; count: number }[];
  recommendationCounts: number;
  geminiDiscoverySuccessRate: number; // out of 100
  geminiCallsCount: number;
  geminiSuccessesCount: number;
}

// In-Memory fallback store for read-only Vercel filesystems
let inMemoryVehicles: VehicleRecord[] = [];
let inMemoryAuditLogs: SearchAuditLog[] = [];
let inMemoryMetrics: AdminMetrics = {
  totalVehiclesStored: 0,
  newVehiclesLearned: 0,
  mostSearchedVehicles: [],
  recommendationCounts: 0,
  geminiDiscoverySuccessRate: 100,
  geminiCallsCount: 0,
  geminiSuccessesCount: 0,
};

const DB_DIR = path.join(process.cwd(), "data");
const VEHICLES_FILE = path.join(DB_DIR, "vehicles.json");
const AUDITS_FILE = path.join(DB_DIR, "audits.json");
const METRICS_FILE = path.join(DB_DIR, "metrics.json");

// Helper to ensure database directory exists
function ensureDbDir() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  } catch (e) {
    // Silent fail in read-only environment
  }
}

// Load database
export function loadVehicleDatabase(): VehicleRecord[] {
  // First, initialize in-memory list from static data if empty
  if (inMemoryVehicles.length === 0) {
    const staticRecords: VehicleRecord[] = [];
    
    // Convert VEHICLES and OEM_SPECIFICATIONS into VehicleRecord format
    for (const spec of OEM_SPECIFICATIONS) {
      const v = VEHICLES.find((x) => x.id === spec.vehicleId);
      if (v) {
        staticRecords.push({
          id: `${v.manufacturer.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${v.model.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${spec.year}-${spec.variant.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          manufacturer: v.manufacturer,
          model: v.model,
          variant: spec.variant,
          year: spec.year,
          vehicle_type: v.segment,
          vehicle_category: v.category,
          fuel_type: spec.vehicleId.includes("ev") ? "Electric" : "Petrol/Diesel",
          gross_weight: v.weightClass === "Lightweight" ? "1000 kg" : v.weightClass === "Medium" ? "1600 kg" : "3000 kg",
          rim_size: spec.rimSize,
          oem_tyre_size: spec.oemTyreSize,
          load_index: spec.loadIndex,
          speed_rating: spec.speedRating,
          drive_type: v.segment === "Off-Road 4x4" ? "4WD" : "FWD",
          confidence: 1.0,
          isDiscovered: false,
          searchCount: 0,
        });
      }
    }
    inMemoryVehicles = staticRecords;
  }

  // Next, try loading from disk if available
  try {
    if (fs.existsSync(VEHICLES_FILE)) {
      const fileContent = fs.readFileSync(VEHICLES_FILE, "utf-8");
      const diskRecords: VehicleRecord[] = JSON.parse(fileContent);
      
      // Merge disk records with in-memory records (disk overrides static to keep search counts and confidence)
      for (const diskRec of diskRecords) {
        const index = inMemoryVehicles.findIndex((x) => x.id === diskRec.id);
        if (index > -1) {
          inMemoryVehicles[index] = diskRec;
        } else {
          inMemoryVehicles.push(diskRec);
        }
      }
    }
  } catch (e) {
    console.warn("[VehicleDB] File-read skipped or failed (Vercel/Read-only):", e);
  }

  return inMemoryVehicles;
}

// Save database
export function saveVehicleDatabase(records: VehicleRecord[]) {
  inMemoryVehicles = records;
  try {
    ensureDbDir();
    fs.writeFileSync(VEHICLES_FILE, JSON.stringify(records, null, 2), "utf-8");
  } catch (e) {
    console.warn("[VehicleDB] File-write skipped or failed (Vercel/Read-only):", e);
  }
}

// Load and Save Audit Logs
export function loadAuditLogs(): SearchAuditLog[] {
  try {
    if (fs.existsSync(AUDITS_FILE)) {
      const fileContent = fs.readFileSync(AUDITS_FILE, "utf-8");
      inMemoryAuditLogs = JSON.parse(fileContent);
    }
  } catch (e) {
    // Fallback to in-memory
  }
  return inMemoryAuditLogs;
}

export function saveAuditLog(log: SearchAuditLog) {
  const logs = loadAuditLogs();
  logs.push(log);
  inMemoryAuditLogs = logs;
  try {
    ensureDbDir();
    fs.writeFileSync(AUDITS_FILE, JSON.stringify(logs, null, 2), "utf-8");
  } catch (e) {
    // Fallback to in-memory
  }
}

// Load and Save Metrics
export function loadAdminMetrics(): AdminMetrics {
  const vehicles = loadVehicleDatabase();
  const logs = loadAuditLogs();
  
  // Calculate dynamically from loaded state
  const discoveredCount = vehicles.filter((v) => v.isDiscovered).length;
  
  // Most searched vehicles
  const sortedBySearch = [...vehicles]
    .filter((v) => (v.searchCount ?? 0) > 0)
    .sort((a, b) => (b.searchCount ?? 0) - (a.searchCount ?? 0))
    .slice(0, 5)
    .map((v) => ({ name: `${v.manufacturer} ${v.model} (${v.year})`, count: v.searchCount ?? 0 }));

  try {
    if (fs.existsSync(METRICS_FILE)) {
      const fileContent = fs.readFileSync(METRICS_FILE, "utf-8");
      const diskMetrics = JSON.parse(fileContent);
      inMemoryMetrics = {
        ...inMemoryMetrics,
        ...diskMetrics,
        totalVehiclesStored: vehicles.length,
        newVehiclesLearned: discoveredCount,
        mostSearchedVehicles: sortedBySearch,
        recommendationCounts: logs.length,
      };
    } else {
      inMemoryMetrics = {
        ...inMemoryMetrics,
        totalVehiclesStored: vehicles.length,
        newVehiclesLearned: discoveredCount,
        mostSearchedVehicles: sortedBySearch,
        recommendationCounts: logs.length,
      };
    }
  } catch (e) {
    inMemoryMetrics = {
      ...inMemoryMetrics,
      totalVehiclesStored: vehicles.length,
      newVehiclesLearned: discoveredCount,
      mostSearchedVehicles: sortedBySearch,
      recommendationCounts: logs.length,
    };
  }

  // Calculate Success Rate
  if (inMemoryMetrics.geminiCallsCount > 0) {
    inMemoryMetrics.geminiDiscoverySuccessRate = Math.round(
      (inMemoryMetrics.geminiSuccessesCount / inMemoryMetrics.geminiCallsCount) * 100
    );
  }

  return inMemoryMetrics;
}

export function saveAdminMetrics(metrics: Partial<AdminMetrics>) {
  const current = loadAdminMetrics();
  const updated = { ...current, ...metrics };
  inMemoryMetrics = updated;
  try {
    ensureDbDir();
    fs.writeFileSync(METRICS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (e) {
    // Fallback to in-memory
  }
}

// Increment search count for a vehicle
export function incrementSearchCount(vehicleId: string) {
  const db = loadVehicleDatabase();
  const vehicle = db.find((v) => v.id === vehicleId);
  if (vehicle) {
    vehicle.searchCount = (vehicle.searchCount ?? 0) + 1;
    saveVehicleDatabase(db);
  }
}

// Phase 6 - Fuzzy Search & Alias Resolver Engine
const VEHICLE_ALIASES: Record<string, string[]> = {
  "range rover": ["land rover range rover"],
  "defender": ["land rover defender"],
  "discovery": ["land rover discovery"],
  "swift": ["maruti suzuki swift"],
  "alto": ["maruti suzuki alto"],
  "baleno": ["maruti suzuki baleno"],
  "brezza": ["maruti suzuki brezza", "maruti suzuki vitara brezza"],
  "xuv700": ["mahindra xuv700", "mahindra xuv 700"],
  "xuv 700": ["mahindra xuv700", "mahindra xuv 700"],
  "be 6": ["mahindra be 6"],
  "be6": ["mahindra be 6"],
  "be 9": ["mahindra be 9"],
  "be9": ["mahindra be 9"],
  "xe 6": ["mahindra be 6"],
  "nexon": ["tata nexon"],
  "nexon ev": ["tata nexon ev"],
  "harrier": ["tata harrier"],
  "safari": ["tata safari"],
  "model y": ["tesla model y"],
  "model 3": ["tesla model 3"],
  "model s": ["tesla model s"],
  "actros": ["mercedes-benz actros", "mercedes actros"],
  "fh16": ["volvo fh16", "volvo fh 16"],
  "fh 16": ["volvo fh16", "volvo fh 16"],
  "excavator": ["caterpillar 320 excavator", "cat excavator"],
  "cat excavator": ["caterpillar 320 excavator"],
  "jcb": ["jcb 3dx backhoe loader"],
  "backhoe": ["jcb 3dx backhoe loader"],
  "john deere": ["john deere 5310 tractor"],
  "tractor": ["john deere 5310 tractor"],
  "bharatbenz": ["bharatbenz tipper 2828c"],
  "bharatbenz truck": ["bharatbenz tipper 2828c"],
  "bharatbenz trucks": ["bharatbenz tipper 2828c"],
};

function containsWord(source: string, word: string): boolean {
  if (word.length <= 2) {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    return regex.test(source);
  }
  return source.includes(word);
}

export function resolveVehicleSearch(query: string): VehicleRecord[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  // Stage 11 & Stage 1: Check LRU Cache for sub-10ms response
  const cachedResult = vehicleSearchCache.get(cleanQuery);
  if (cachedResult) {
    return cachedResult;
  }

  const db = loadVehicleDatabase();

  // Stage 3 & Stage 5: Lookup Automotive Alias & Normalize Query
  const aliasMatch = lookupVehicleAlias(cleanQuery);
  const normalized = normalizeVehicleQuery(cleanQuery);

  let expandedQueries = [cleanQuery];
  if (aliasMatch) {
    expandedQueries.push(`${aliasMatch.manufacturer} ${aliasMatch.model}`.toLowerCase());
  }

  // Include legacy alias dictionary
  for (const [alias, targets] of Object.entries(VEHICLE_ALIASES)) {
    if (cleanQuery.includes(alias) || alias.includes(cleanQuery)) {
      expandedQueries.push(...targets.map(t => t.toLowerCase()));
    }
  }

  // Stage 2, 4, 6: Multi-Stage Fuzzy & Token Matching Pipeline
  const scoredMatches = db.map((vehicle) => {
    let score = 0;
    const manufacturer = vehicle.manufacturer.toLowerCase();
    const model = vehicle.model.toLowerCase();
    const variant = vehicle.variant.toLowerCase();
    const year = vehicle.year.toLowerCase();
    const type = vehicle.vehicle_type.toLowerCase();
    const fullName = `${manufacturer} ${model}`.trim();
    const fullSpecsName = `${manufacturer} ${model} ${variant}`.trim();

    // 1. Alias Direct Match Bonus
    if (aliasMatch) {
      if (manufacturer === aliasMatch.manufacturer.toLowerCase() && model === aliasMatch.model.toLowerCase()) {
        score += 80;
      }
    }

    // 2. Levenshtein Distance & String Similarity Check for Typos (e.g. "Cretta" -> "Creta", "Scropio" -> "Scorpio")
    const modelSim = calculateStringSimilarity(cleanQuery, model);
    const fullNameSim = calculateStringSimilarity(cleanQuery, fullName);
    if (modelSim >= 0.75) score += Math.round(modelSim * 50);
    if (fullNameSim >= 0.75) score += Math.round(fullNameSim * 60);

    // 3. Multi-Query Token Match
    for (const eq of expandedQueries) {
      const eqTokens = eq.split(/\s+/).filter(Boolean);
      let eqScore = 0;

      for (const token of eqTokens) {
        if (containsWord(manufacturer, token)) eqScore += 12;
        if (containsWord(model, token)) eqScore += 18;
        if (model === token) eqScore += 15;
        if (containsWord(variant, token)) eqScore += 10;
        if (year === token) eqScore += 5;
        if (containsWord(type, token)) eqScore += 3;
      }

      if (fullName.includes(eq) || eq.includes(fullName)) {
        eqScore += 30;
      }

      if (fullSpecsName.includes(eq)) {
        eqScore += 35;
      }

      score = Math.max(score, eqScore);
    }

    return { vehicle, score };
  });

  // Filter with minimum threshold of 25 to catch fuzzy matches while maintaining high quality
  const results = scoredMatches
    .filter((m) => m.score >= 25)
    .sort((a, b) => b.score - a.score)
    .map((m) => m.vehicle);

  // Store in LRU cache for instant future lookups
  if (results.length > 0) {
    vehicleSearchCache.set(cleanQuery, results);
  }

  return results;
}
