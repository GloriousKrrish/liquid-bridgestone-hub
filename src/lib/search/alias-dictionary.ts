/**
 * Automotive Alias & Brand Synonym Dictionary
 * Maps common user search inputs, colloquial names, misspellings, and trim designations
 * to standardized vehicle representations for the Indian & Global markets.
 */

export interface VehicleAliasEntry {
  alias: string;
  manufacturer: string;
  model: string;
  defaultVariant?: string;
  defaultYear?: string;
  category?: "Car" | "SUV" | "Truck/Bus";
}

export const AUTOMOTIVE_ALIAS_MAP: Record<string, VehicleAliasEntry> = {
  // Maruti Suzuki Family
  "grand vitara": { alias: "grand vitara", manufacturer: "Maruti Suzuki", model: "Grand Vitara", defaultVariant: "Alpha / Zeta", defaultYear: "2024", category: "SUV" },
  "vitara": { alias: "vitara", manufacturer: "Maruti Suzuki", model: "Grand Vitara", defaultVariant: "Smart Hybrid", defaultYear: "2024", category: "SUV" },
  "maruti grand vitara": { alias: "maruti grand vitara", manufacturer: "Maruti Suzuki", model: "Grand Vitara", defaultVariant: "Alpha AWD", defaultYear: "2024", category: "SUV" },
  "grand vitara sigma": { alias: "grand vitara sigma", manufacturer: "Maruti Suzuki", model: "Grand Vitara", defaultVariant: "Sigma 1.5", defaultYear: "2024", category: "SUV" },
  "swift": { alias: "swift", manufacturer: "Maruti Suzuki", model: "Swift", defaultVariant: "VXI / ZXI", defaultYear: "2024", category: "Car" },
  "swift vxi": { alias: "swift vxi", manufacturer: "Maruti Suzuki", model: "Swift", defaultVariant: "VXI 1.2", defaultYear: "2024", category: "Car" },
  "baleno": { alias: "baleno", manufacturer: "Maruti Suzuki", model: "Baleno", defaultVariant: "Zeta / Alpha", defaultYear: "2024", category: "Car" },
  "brezza": { alias: "brezza", manufacturer: "Maruti Suzuki", model: "Brezza", defaultVariant: "ZXI+", defaultYear: "2024", category: "SUV" },
  "vitara brezza": { alias: "vitara brezza", manufacturer: "Maruti Suzuki", model: "Brezza", defaultVariant: "VXI", defaultYear: "2023", category: "SUV" },
  "alto": { alias: "alto", manufacturer: "Maruti Suzuki", model: "Alto K10", defaultVariant: "VXI+", defaultYear: "2024", category: "Car" },
  "wagonr": { alias: "wagonr", manufacturer: "Maruti Suzuki", model: "Wagon R", defaultVariant: "ZXI 1.2", defaultYear: "2024", category: "Car" },
  "wagon r": { alias: "wagon r", manufacturer: "Maruti Suzuki", model: "Wagon R", defaultVariant: "ZXI 1.2", defaultYear: "2024", category: "Car" },
  "ertiga": { alias: "ertiga", manufacturer: "Maruti Suzuki", model: "Ertiga", defaultVariant: "ZXI AT", defaultYear: "2024", category: "SUV" },
  "xl6": { alias: "xl6", manufacturer: "Maruti Suzuki", model: "XL6", defaultVariant: "Alpha+", defaultYear: "2024", category: "SUV" },

  // Toyota Family
  "hyryder": { alias: "hyryder", manufacturer: "Toyota", model: "Urban Cruiser Hyryder", defaultVariant: "V Hybrid", defaultYear: "2024", category: "SUV" },
  "toyota hyryder": { alias: "toyota hyryder", manufacturer: "Toyota", model: "Urban Cruiser Hyryder", defaultVariant: "G Hybrid", defaultYear: "2024", category: "SUV" },
  "fortuner": { alias: "fortuner", manufacturer: "Toyota", model: "Fortuner", defaultVariant: "4x4 AT", defaultYear: "2024", category: "SUV" },
  "fortuner legender": { alias: "fortuner legender", manufacturer: "Toyota", model: "Fortuner", defaultVariant: "Legender 4x4", defaultYear: "2024", category: "SUV" },
  "legender": { alias: "legender", manufacturer: "Toyota", model: "Fortuner", defaultVariant: "Legender 4x2 / 4x4", defaultYear: "2024", category: "SUV" },
  "innova": { alias: "innova", manufacturer: "Toyota", model: "Innova Crysta", defaultVariant: "ZX Diesel", defaultYear: "2023", category: "SUV" },
  "innova hycross": { alias: "innova hycross", manufacturer: "Toyota", model: "Innova Hycross", defaultVariant: "ZX (O) Hybrid", defaultYear: "2024", category: "SUV" },
  "hycross": { alias: "hycross", manufacturer: "Toyota", model: "Innova Hycross", defaultVariant: "VX Hybrid", defaultYear: "2024", category: "SUV" },
  "camry": { alias: "camry", manufacturer: "Toyota", model: "Camry", defaultVariant: "2.5 Hybrid", defaultYear: "2024", category: "Car" },

  // Hyundai Family
  "creta": { alias: "creta", manufacturer: "Hyundai", model: "Creta", defaultVariant: "SX (O)", defaultYear: "2024", category: "SUV" },
  "cretta": { alias: "cretta", manufacturer: "Hyundai", model: "Creta", defaultVariant: "SX Tech", defaultYear: "2024", category: "SUV" },
  "venue": { alias: "venue", manufacturer: "Hyundai", model: "Venue", defaultVariant: "SX (O) Turbo", defaultYear: "2024", category: "SUV" },
  "verna": { alias: "verna", manufacturer: "Hyundai", model: "Verna", defaultVariant: "1.5 Turbo SX(O)", defaultYear: "2024", category: "Car" },
  "i20": { alias: "i20", manufacturer: "Hyundai", model: "i20", defaultVariant: "Asta (O)", defaultYear: "2024", category: "Car" },
  "tucson": { alias: "tucson", manufacturer: "Hyundai", model: "Tucson", defaultVariant: "Signature AWD", defaultYear: "2024", category: "SUV" },

  // Mahindra Family
  "scorpio": { alias: "scorpio", manufacturer: "Mahindra", model: "Scorpio Classic", defaultVariant: "S11", defaultYear: "2024", category: "SUV" },
  "scropio": { alias: "scropio", manufacturer: "Mahindra", model: "Scorpio Classic", defaultVariant: "S11", defaultYear: "2024", category: "SUV" },
  "scorpion": { alias: "scorpion", manufacturer: "Mahindra", model: "Scorpio-N", defaultVariant: "Z8 L 4x4", defaultYear: "2024", category: "SUV" },
  "scorpio n": { alias: "scorpio n", manufacturer: "Mahindra", model: "Scorpio-N", defaultVariant: "Z8 Select", defaultYear: "2024", category: "SUV" },
  "scorpio-n": { alias: "scorpio-n", manufacturer: "Mahindra", model: "Scorpio-N", defaultVariant: "Z8 L AT", defaultYear: "2024", category: "SUV" },
  "xuv700": { alias: "xuv700", manufacturer: "Mahindra", model: "XUV700", defaultVariant: "AX7 L AWD", defaultYear: "2024", category: "SUV" },
  "xuv 700": { alias: "xuv 700", manufacturer: "Mahindra", model: "XUV700", defaultVariant: "AX7 Diesel", defaultYear: "2024", category: "SUV" },
  "thar": { alias: "thar", manufacturer: "Mahindra", model: "Thar", defaultVariant: "LX 4x4 Hard Top", defaultYear: "2024", category: "SUV" },
  "thar roxxe": { alias: "thar roxxe", manufacturer: "Mahindra", model: "Thar Roxx", defaultVariant: "AX7L 4x4", defaultYear: "2024", category: "SUV" },
  "thar roxx": { alias: "thar roxx", manufacturer: "Mahindra", model: "Thar Roxx", defaultVariant: "AX5L Diesel", defaultYear: "2024", category: "SUV" },
  "be 6": { alias: "be 6", manufacturer: "Mahindra", model: "BE 6e", defaultVariant: "Pack ONE / TWO", defaultYear: "2025", category: "SUV" },
  "be6": { alias: "be6", manufacturer: "Mahindra", model: "BE 6e", defaultVariant: "Pack TWO", defaultYear: "2025", category: "SUV" },

  // Honda Family
  "city": { alias: "city", manufacturer: "Honda", model: "City", defaultVariant: "ZX", defaultYear: "2024", category: "Car" },
  "honda city zx cvt": { alias: "honda city zx cvt", manufacturer: "Honda", model: "City", defaultVariant: "ZX CVT", defaultYear: "2024", category: "Car" },
  "honda city zx": { alias: "honda city zx", manufacturer: "Honda", model: "City", defaultVariant: "ZX i-VTEC", defaultYear: "2024", category: "Car" },
  "elevate": { alias: "elevate", manufacturer: "Honda", model: "Elevate", defaultVariant: "ZX CVT", defaultYear: "2024", category: "SUV" },

  // Tata Family
  "nexon": { alias: "nexon", manufacturer: "Tata", model: "Nexon", defaultVariant: "Fearless+ S", defaultYear: "2024", category: "SUV" },
  "nexon ev": { alias: "nexon ev", manufacturer: "Tata", model: "Nexon EV", defaultVariant: "Empowered+ Long Range", defaultYear: "2024", category: "SUV" },
  "harrier": { alias: "harrier", manufacturer: "Tata", model: "Harrier", defaultVariant: "Fearless+ Dark Edition", defaultYear: "2024", category: "SUV" },
  "safari": { alias: "safari", manufacturer: "Tata", model: "Safari", defaultVariant: "Accomplished+ 6S", defaultYear: "2024", category: "SUV" },
  "punch": { alias: "punch", manufacturer: "Tata", model: "Punch", defaultVariant: "Creative Flagship", defaultYear: "2024", category: "SUV" },
  "curvv": { alias: "curvv", manufacturer: "Tata", model: "Curvv", defaultVariant: "Accomplished+ S", defaultYear: "2024", category: "SUV" },

  // Luxury & Global Brands
  "bmw x1": { alias: "bmw x1", manufacturer: "BMW", model: "X1", defaultVariant: "sDrive18i / sDrive20d", defaultYear: "2024", category: "SUV" },
  "x1": { alias: "x1", manufacturer: "BMW", model: "X1", defaultVariant: "sDrive20d M Sport", defaultYear: "2024", category: "SUV" },
  "bmw 3 series": { alias: "bmw 3 series", manufacturer: "BMW", model: "3 Series Gran Limousine", defaultVariant: "330Li M Sport", defaultYear: "2024", category: "Car" },
  "audi a4": { alias: "audi a4", manufacturer: "Audi", model: "A4", defaultVariant: "40 TFSI Technology", defaultYear: "2024", category: "Car" },
  "audi q5": { alias: "audi q5", manufacturer: "Audi", model: "Q5", defaultVariant: "45 TFSI Technology", defaultYear: "2024", category: "SUV" },
  "mercedes c class": { alias: "mercedes c class", manufacturer: "Mercedes-Benz", model: "C-Class", defaultVariant: "C 200 / C 220d", defaultYear: "2024", category: "Car" },
  "mercedes glc": { alias: "mercedes glc", manufacturer: "Mercedes-Benz", model: "GLC", defaultVariant: "GLC 300 4MATIC", defaultYear: "2024", category: "SUV" },
  "range rover": { alias: "range rover", manufacturer: "Land Rover", model: "Range Rover", defaultVariant: "Autobiography", defaultYear: "2024", category: "SUV" },
  "defender": { alias: "defender", manufacturer: "Land Rover", model: "Defender 110", defaultVariant: "SE D300", defaultYear: "2024", category: "SUV" },
  "tesla model y": { alias: "tesla model y", manufacturer: "Tesla", model: "Model Y", defaultVariant: "Long Range AWD", defaultYear: "2024", category: "SUV" },
  "tesla model 3": { alias: "tesla model 3", manufacturer: "Tesla", model: "Model 3", defaultVariant: "Highland Performance", defaultYear: "2024", category: "Car" },
};

/**
 * Checks if a string query matches an alias dictionary record
 */
export function lookupVehicleAlias(query: string): VehicleAliasEntry | null {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;

  // Direct key lookup
  if (AUTOMOTIVE_ALIAS_MAP[clean]) {
    return AUTOMOTIVE_ALIAS_MAP[clean];
  }

  // Token-based substring match
  for (const [key, entry] of Object.entries(AUTOMOTIVE_ALIAS_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return entry;
    }
  }

  return null;
}
