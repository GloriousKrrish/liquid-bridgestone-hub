/**
 * Automotive Fuzzy Search & Typo Correction Engine
 * Implements Levenshtein distance, n-gram token similarity,
 * and variant normalization for automotive vehicle queries.
 */

/**
 * Calculates Levenshtein distance between two strings
 */
export function calculateLevenshteinDistance(a: string, b: string): number {
  const str1 = a.toLowerCase();
  const str2 = b.toLowerCase();
  const matrix: number[][] = [];

  for (let i = 0; i <= str1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[str1.length][str2.length];
}

/**
 * Normalized string similarity score (0.0 to 1.0) based on Levenshtein distance
 */
export function calculateStringSimilarity(a: string, b: string): number {
  const distance = calculateLevenshteinDistance(a, b);
  const maxLength = Math.max(a.length, b.length);
  if (maxLength === 0) return 1.0;
  return 1.0 - distance / maxLength;
}

/**
 * Trim & Variant Normalizer
 * Extracts recognized trim levels (e.g. "VXI", "ZX CVT", "Sigma", "Legender", "Alpha", "ZXI+")
 */
export interface NormalizedQueryComponents {
  cleanedQuery: string;
  detectedBrand?: string;
  detectedModel?: string;
  detectedVariant?: string;
  detectedYear?: string;
}

const COMMON_VARIANTS = [
  "sigma", "delta", "zeta", "alpha", "vxi", "zxi", "lxi", "vdi", "zdi",
  "sx", "sx (o)", "sx(o)", "tech", "asta", "asta (o)", "zx", "zx cvt", "vx",
  "legender", "crysta", "hycross", "dark", "fearless", "accomplished",
  "ax7", "ax7 l", "ax5", "z8", "z8 l", "z4", "lx", "s11", "pack one", "pack two"
];

const KNOWN_BRANDS = [
  "maruti", "maruti suzuki", "suzuki", "toyota", "hyundai", "mahindra",
  "tata", "honda", "bmw", "audi", "mercedes", "mercedes-benz", "tesla",
  "kia", "mg", "volkswagen", "skoda", "nissan", "renault", "land rover", "caterpillar", "jcb", "john deere"
];

export function normalizeVehicleQuery(rawQuery: string): NormalizedQueryComponents {
  const query = rawQuery.trim().toLowerCase();
  let cleaned = query;
  let detectedBrand: string | undefined;
  let detectedVariant: string | undefined;
  let detectedYear: string | undefined;

  // Extract year if present (e.g. 2020-2026)
  const yearMatch = query.match(/\b(20[0-2][0-9])\b/);
  if (yearMatch) {
    detectedYear = yearMatch[1];
    cleaned = cleaned.replace(yearMatch[0], "").trim();
  }

  // Extract brand if present
  for (const brand of KNOWN_BRANDS) {
    if (cleaned.includes(brand)) {
      detectedBrand = brand;
      cleaned = cleaned.replace(brand, "").trim();
      break;
    }
  }

  // Extract variant if present
  for (const variant of COMMON_VARIANTS) {
    if (cleaned.includes(variant)) {
      detectedVariant = variant;
      cleaned = cleaned.replace(variant, "").trim();
      break;
    }
  }

  return {
    cleanedQuery: cleaned.replace(/\s+/g, " ").trim(),
    detectedBrand,
    detectedVariant,
    detectedYear,
  };
}
