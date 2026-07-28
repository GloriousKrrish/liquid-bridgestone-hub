// Types and Interfaces

export interface Vehicle {
  id: string;
  manufacturer: string;
  model: string;
  category: "Car" | "SUV" | "Truck/Bus";
  segment: "Hatchback" | "Sedan" | "Compact SUV" | "Full-Size SUV" | "EV CUV" | "Off-Road 4x4" | "Light Commercial Truck" | "Heavy Commercial Truck" | "Luxury Coach Bus";
  weightClass: "Lightweight" | "Medium" | "Heavy Duty";
}

export interface OemSpec {
  vehicleId: string;
  year: string;
  variant: string;
  oemTyreSize: string; // e.g. "215/60 R17"
  rimSize: string; // e.g. "17"
  loadIndex: string; // e.g. "96" or "146/143"
  speedRating: string; // e.g. "V" or "K"
}

export interface TyreSKU {
  productId: string;
  size: string; // e.g. "215/60 R17"
  rimSize: string; // e.g. "17"
  loadIndex: number; // e.g. 96
  speedRating: string; // e.g. "V"
  price: number;
}

export interface Product {
  id: string;
  name: string;
  vehicleCategory: "Car" | "SUV" | "Truck/Bus";
  segmentSuitability: string[];
  usageSuitability: string[];
  description: string;
  treadPatternType: "touring" | "all-terrain" | "durable" | "eco" | "sport" | "rib-commercial" | "tipper-block";
  keyFeatures: string[];

  // Backwards-compatibility fields for ProductGrid
  subSegment: string;
  price: string;
  vehicleTypes: string[];
  terrain: string;
  rimSizes: string;
  specs: Record<string, string>;
}

export interface Dealer {
  id: string;
  name: string;
  address: string;
  distance: string;
  stock: string;
  nextSlot: string;
  wait: string;
}

// 1. Structured Vehicle Master Database
export const VEHICLES: Vehicle[] = [
  { id: "maruti-alto", manufacturer: "Maruti Suzuki", model: "Alto", category: "Car", segment: "Hatchback", weightClass: "Lightweight" },
  { id: "hyundai-creta", manufacturer: "Hyundai", model: "Creta", category: "SUV", segment: "Compact SUV", weightClass: "Medium" },
  { id: "tata-nexon-ev", manufacturer: "Tata", model: "Nexon EV", category: "Car", segment: "EV CUV", weightClass: "Medium" },
  { id: "mahindra-thar", manufacturer: "Mahindra", model: "Thar", category: "SUV", segment: "Off-Road 4x4", weightClass: "Medium" },
  { id: "toyota-fortuner", manufacturer: "Toyota", model: "Fortuner", category: "SUV", segment: "Full-Size SUV", weightClass: "Heavy Duty" },
  { id: "honda-city", manufacturer: "Honda", model: "City", category: "Car", segment: "Sedan", weightClass: "Medium" },
  { id: "maruti-swift", manufacturer: "Maruti Suzuki", model: "Swift", category: "Car", segment: "Hatchback", weightClass: "Lightweight" },
  { id: "tata-signa", manufacturer: "Tata", model: "Signa Cargo", category: "Truck/Bus", segment: "Heavy Commercial Truck", weightClass: "Heavy Duty" },
  { id: "bharatbenz-tipper", manufacturer: "BharatBenz", model: "Tipper 2828C", category: "Truck/Bus", segment: "Heavy Commercial Truck", weightClass: "Heavy Duty" },
  { id: "eicher-pro", manufacturer: "Eicher", model: "Pro 2049", category: "Truck/Bus", segment: "Light Commercial Truck", weightClass: "Medium" },
  { id: "volvo-coach", manufacturer: "Volvo", model: "9600 Multi-Axle", category: "Truck/Bus", segment: "Luxury Coach Bus", weightClass: "Heavy Duty" },
];

// 2. OEM Specifications Database
export const OEM_SPECIFICATIONS: OemSpec[] = [
  // Alto
  { vehicleId: "maruti-alto", year: "2021", variant: "LXi", oemTyreSize: "145/80 R12", rimSize: "12", loadIndex: "74", speedRating: "T" },
  { vehicleId: "maruti-alto", year: "2021", variant: "VXi", oemTyreSize: "145/80 R12", rimSize: "12", loadIndex: "74", speedRating: "T" },
  { vehicleId: "maruti-alto", year: "2022", variant: "LXi", oemTyreSize: "145/80 R12", rimSize: "12", loadIndex: "74", speedRating: "T" },
  { vehicleId: "maruti-alto", year: "2022", variant: "VXi", oemTyreSize: "145/80 R12", rimSize: "12", loadIndex: "74", speedRating: "T" },
  { vehicleId: "maruti-alto", year: "2023", variant: "LXi / VXi / K10", oemTyreSize: "145/80 R12", rimSize: "12", loadIndex: "74", speedRating: "T" },
  { vehicleId: "maruti-alto", year: "2024", variant: "LXi / VXi / K10", oemTyreSize: "145/80 R12", rimSize: "12", loadIndex: "74", speedRating: "T" },

  // Hyundai Creta
  { vehicleId: "hyundai-creta", year: "2021", variant: "E / EX (1.5 Petrol)", oemTyreSize: "205/65 R16", rimSize: "16", loadIndex: "95", speedRating: "H" },
  { vehicleId: "hyundai-creta", year: "2021", variant: "S / SX", oemTyreSize: "215/60 R17", rimSize: "17", loadIndex: "96", speedRating: "V" },
  { vehicleId: "hyundai-creta", year: "2021", variant: "SX(O)", oemTyreSize: "215/55 R18", rimSize: "18", loadIndex: "95", speedRating: "V" },
  { vehicleId: "hyundai-creta", year: "2022", variant: "E / EX (1.5 Petrol)", oemTyreSize: "205/65 R16", rimSize: "16", loadIndex: "95", speedRating: "H" },
  { vehicleId: "hyundai-creta", year: "2022", variant: "S / SX", oemTyreSize: "215/60 R17", rimSize: "17", loadIndex: "96", speedRating: "V" },
  { vehicleId: "hyundai-creta", year: "2022", variant: "SX(O)", oemTyreSize: "215/55 R18", rimSize: "18", loadIndex: "95", speedRating: "V" },
  { vehicleId: "hyundai-creta", year: "2023", variant: "E / EX (1.5 Petrol)", oemTyreSize: "205/65 R16", rimSize: "16", loadIndex: "95", speedRating: "H" },
  { vehicleId: "hyundai-creta", year: "2023", variant: "S / SX", oemTyreSize: "215/60 R17", rimSize: "17", loadIndex: "96", speedRating: "V" },
  { vehicleId: "hyundai-creta", year: "2023", variant: "SX(O)", oemTyreSize: "215/55 R18", rimSize: "18", loadIndex: "95", speedRating: "V" },
  { vehicleId: "hyundai-creta", year: "2024", variant: "E / EX (1.5 Petrol)", oemTyreSize: "205/65 R16", rimSize: "16", loadIndex: "95", speedRating: "H" },
  { vehicleId: "hyundai-creta", year: "2024", variant: "S / SX / SX Tech", oemTyreSize: "215/60 R17", rimSize: "17", loadIndex: "96", speedRating: "V" },
  { vehicleId: "hyundai-creta", year: "2024", variant: "SX(O)", oemTyreSize: "215/55 R18", rimSize: "18", loadIndex: "95", speedRating: "V" },

  // Toyota Fortuner
  { vehicleId: "toyota-fortuner", year: "2021", variant: "Standard 2.7 Petrol / 2.8 Diesel", oemTyreSize: "265/65 R17", rimSize: "17", loadIndex: "112", speedRating: "S" },
  { vehicleId: "toyota-fortuner", year: "2021", variant: "Sigma4 / Legender", oemTyreSize: "265/60 R18", rimSize: "18", loadIndex: "110", speedRating: "H" },
  { vehicleId: "toyota-fortuner", year: "2022", variant: "Standard 2.7 Petrol / 2.8 Diesel", oemTyreSize: "265/65 R17", rimSize: "17", loadIndex: "112", speedRating: "S" },
  { vehicleId: "toyota-fortuner", year: "2022", variant: "Sigma4 / Legender", oemTyreSize: "265/60 R18", rimSize: "18", loadIndex: "110", speedRating: "H" },
  { vehicleId: "toyota-fortuner", year: "2023", variant: "Standard 2.7 Petrol / 2.8 Diesel", oemTyreSize: "265/65 R17", rimSize: "17", loadIndex: "112", speedRating: "S" },
  { vehicleId: "toyota-fortuner", year: "2023", variant: "Sigma4 / Legender", oemTyreSize: "265/60 R18", rimSize: "18", loadIndex: "110", speedRating: "H" },
  { vehicleId: "toyota-fortuner", year: "2024", variant: "Standard 2.7 Petrol / 2.8 Diesel", oemTyreSize: "265/65 R17", rimSize: "17", loadIndex: "112", speedRating: "S" },
  { vehicleId: "toyota-fortuner", year: "2024", variant: "Sigma4 / Legender", oemTyreSize: "265/60 R18", rimSize: "18", loadIndex: "110", speedRating: "H" },

  // Tata Nexon EV
  { vehicleId: "tata-nexon-ev", year: "2022", variant: "Creative+ MR", oemTyreSize: "215/60 R16", rimSize: "16", loadIndex: "95", speedRating: "H" },
  { vehicleId: "tata-nexon-ev", year: "2022", variant: "Empowered+ LR", oemTyreSize: "215/60 R16", rimSize: "16", loadIndex: "95", speedRating: "H" },
  { vehicleId: "tata-nexon-ev", year: "2023", variant: "Creative+ MR", oemTyreSize: "215/60 R16", rimSize: "16", loadIndex: "95", speedRating: "H" },
  { vehicleId: "tata-nexon-ev", year: "2023", variant: "Empowered+ LR", oemTyreSize: "215/60 R16", rimSize: "16", loadIndex: "95", speedRating: "H" },
  { vehicleId: "tata-nexon-ev", year: "2024", variant: "Creative+ MR", oemTyreSize: "215/60 R16", rimSize: "16", loadIndex: "95", speedRating: "H" },
  { vehicleId: "tata-nexon-ev", year: "2024", variant: "Empowered+ LR", oemTyreSize: "215/60 R16", rimSize: "16", loadIndex: "95", speedRating: "H" },

  // Mahindra Thar
  { vehicleId: "mahindra-thar", year: "2021", variant: "AX Opt (Convertible/Hard Top)", oemTyreSize: "245/75 R16", rimSize: "16", loadIndex: "111", speedRating: "S" },
  { vehicleId: "mahindra-thar", year: "2021", variant: "LX (Hard Top)", oemTyreSize: "255/65 R18", rimSize: "18", loadIndex: "111", speedRating: "T" },
  { vehicleId: "mahindra-thar", year: "2022", variant: "AX Opt (Convertible/Hard Top)", oemTyreSize: "245/75 R16", rimSize: "16", loadIndex: "111", speedRating: "S" },
  { vehicleId: "mahindra-thar", year: "2022", variant: "LX (Hard Top)", oemTyreSize: "255/65 R18", rimSize: "18", loadIndex: "111", speedRating: "T" },
  { vehicleId: "mahindra-thar", year: "2023", variant: "AX Opt (Convertible/Hard Top)", oemTyreSize: "245/75 R16", rimSize: "16", loadIndex: "111", speedRating: "S" },
  { vehicleId: "mahindra-thar", year: "2023", variant: "LX (Hard Top)", oemTyreSize: "255/65 R18", rimSize: "18", loadIndex: "111", speedRating: "T" },
  { vehicleId: "mahindra-thar", year: "2024", variant: "AX Opt (Convertible/Hard Top)", oemTyreSize: "245/75 R16", rimSize: "16", loadIndex: "111", speedRating: "S" },
  { vehicleId: "mahindra-thar", year: "2024", variant: "LX (Hard Top)", oemTyreSize: "255/65 R18", rimSize: "18", loadIndex: "111", speedRating: "T" },

  // Honda City
  { vehicleId: "honda-city", year: "2022", variant: "V / VX", oemTyreSize: "185/60 R15", rimSize: "15", loadIndex: "84", speedRating: "H" },
  { vehicleId: "honda-city", year: "2022", variant: "ZX / e:HEV Hybrid", oemTyreSize: "185/55 R16", rimSize: "16", loadIndex: "83", speedRating: "V" },
  { vehicleId: "honda-city", year: "2023", variant: "V / VX", oemTyreSize: "185/60 R15", rimSize: "15", loadIndex: "84", speedRating: "H" },
  { vehicleId: "honda-city", year: "2023", variant: "ZX / e:HEV Hybrid", oemTyreSize: "185/55 R16", rimSize: "16", loadIndex: "83", speedRating: "V" },
  { vehicleId: "honda-city", year: "2024", variant: "V / VX", oemTyreSize: "185/60 R15", rimSize: "15", loadIndex: "84", speedRating: "H" },
  { vehicleId: "honda-city", year: "2024", variant: "ZX / e:HEV Hybrid", oemTyreSize: "185/55 R16", rimSize: "16", loadIndex: "83", speedRating: "V" },

  // Swift
  { vehicleId: "maruti-swift", year: "2022", variant: "LXi / VXi", oemTyreSize: "165/80 R14", rimSize: "14", loadIndex: "85", speedRating: "T" },
  { vehicleId: "maruti-swift", year: "2022", variant: "ZXi / ZXi+", oemTyreSize: "185/65 R15", rimSize: "15", loadIndex: "88", speedRating: "H" },
  { vehicleId: "maruti-swift", year: "2023", variant: "LXi / VXi", oemTyreSize: "165/80 R14", rimSize: "14", loadIndex: "85", speedRating: "T" },
  { vehicleId: "maruti-swift", year: "2023", variant: "ZXi / ZXi+", oemTyreSize: "185/65 R15", rimSize: "15", loadIndex: "88", speedRating: "H" },
  { vehicleId: "maruti-swift", year: "2024", variant: "LXi / VXi", oemTyreSize: "165/80 R14", rimSize: "14", loadIndex: "85", speedRating: "T" },
  { vehicleId: "maruti-swift", year: "2024", variant: "ZXi / ZXi+", oemTyreSize: "185/65 R15", rimSize: "15", loadIndex: "88", speedRating: "H" },

  // Tata Signa Cargo
  { vehicleId: "tata-signa", year: "2022", variant: "2823.C (6x2 haulage)", oemTyreSize: "295/90 R20", rimSize: "20", loadIndex: "146", speedRating: "K" },
  { vehicleId: "tata-signa", year: "2023", variant: "2823.C (6x2 haulage)", oemTyreSize: "295/90 R20", rimSize: "20", loadIndex: "146", speedRating: "K" },
  { vehicleId: "tata-signa", year: "2024", variant: "2823.C (6x2 haulage)", oemTyreSize: "295/90 R20", rimSize: "20", loadIndex: "146", speedRating: "K" },

  // BharatBenz Tipper
  { vehicleId: "bharatbenz-tipper", year: "2022", variant: "2828C (6x4 mining)", oemTyreSize: "11.00 R20", rimSize: "20", loadIndex: "150", speedRating: "J" },
  { vehicleId: "bharatbenz-tipper", year: "2023", variant: "2828C (6x4 mining)", oemTyreSize: "11.00 R20", rimSize: "20", loadIndex: "150", speedRating: "J" },
  { vehicleId: "bharatbenz-tipper", year: "2024", variant: "2828C (6x4 mining)", oemTyreSize: "11.00 R20", rimSize: "20", loadIndex: "150", speedRating: "J" },

  // Eicher Pro 2049
  { vehicleId: "eicher-pro", year: "2023", variant: "Pro 2049 City Cargo", oemTyreSize: "8.25 R16", rimSize: "16", loadIndex: "128", speedRating: "L" },
  { vehicleId: "eicher-pro", year: "2024", variant: "Pro 2049 City Cargo", oemTyreSize: "8.25 R16", rimSize: "16", loadIndex: "128", speedRating: "L" },

  // Volvo Coach Bus
  { vehicleId: "volvo-coach", year: "2023", variant: "9600 Luxury Sleeper (6x2)", oemTyreSize: "295/80 R22.5", rimSize: "22.5", loadIndex: "152", speedRating: "M" },
  { vehicleId: "volvo-coach", year: "2024", variant: "9600 Luxury Sleeper (6x2)", oemTyreSize: "295/80 R22.5", rimSize: "22.5", loadIndex: "152", speedRating: "M" },
];

export const PRODUCT_CATALOG: Product[] = [
  {
    id: "turanza-6i",
    name: "Bridgestone Turanza 6i",
    vehicleCategory: "Car",
    segmentSuitability: ["Hatchback", "Sedan", "Compact SUV", "EV CUV", "Electric Vehicle", "Luxury Sedan", "MPV"],
    usageSuitability: ["Urban", "Highway"],
    description: "Premium comfort tyre with extreme noise isolation. Best suited for smooth asphalt commuting, premium sedans and comfortable hatchbacks.",
    treadPatternType: "touring",
    keyFeatures: ["High Quietude Technology", "Extreme Cabin Silence", "Plush Ride Quality"],
    subSegment: "Premium Luxury Comfort",
    price: "Starts at ₹5,900",
    vehicleTypes: ["Sedans", "Premium Hatchbacks", "Compact SUVs"],
    terrain: "100% Smooth Asphalt / Highways",
    rimSizes: "15\" - 18\"",
    specs: { loadIndex: "88-96", speedRating: "H-V", comfort: "10/10", wetGrip: "A" }
  },
  {
    id: "sturdo",
    name: "Bridgestone Sturdo",
    vehicleCategory: "Car",
    segmentSuitability: ["Hatchback", "Sedan", "Compact SUV"],
    usageSuitability: ["Urban", "Highway"],
    description: "Highly durable passenger radial with up to 29% longer tread life. Engineered for broken city pavements, gravel patches, and severe potholes.",
    treadPatternType: "durable",
    keyFeatures: ["Deep Tread Depth Casing", "Reinforced Side Walls", "29% Longer Lifespan"],
    subSegment: "Indian Road Durability",
    price: "Starts at ₹3,200",
    vehicleTypes: ["Hatchbacks", "Sedans", "Entry-level SUVs"],
    terrain: "80% City Pavements, 20% Highway",
    rimSizes: "12\" - 16\"",
    specs: { loadIndex: "74-95", speedRating: "T-H", wearLife: "10/10", comfort: "8/10" }
  },
  {
    id: "ecopia-ep150",
    name: "Bridgestone Ecopia EP150",
    vehicleCategory: "Car",
    segmentSuitability: ["Hatchback", "Sedan", "EV CUV", "Electric Vehicle", "MPV"],
    usageSuitability: ["Urban"],
    description: "Eco-friendly low rolling resistance commuter tyre. Ideal for electric vehicles and fuel-saving daily commuters.",
    treadPatternType: "eco",
    keyFeatures: ["NanoPro-Tech Compound", "Lower Energy Depletion", "EV Custom Optimized"],
    subSegment: "Eco-Friendly Efficiency",
    price: "Starts at ₹3,100",
    vehicleTypes: ["Hatchbacks", "Sedans", "EV CUVs"],
    terrain: "90% Urban Commute, 10% Highway",
    rimSizes: "12\" - 16\"",
    specs: { loadIndex: "74-95", speedRating: "S-H", rollingResistance: "Lowest", fuelEco: "9.5/10" }
  },
  {
    id: "dueler-at002",
    name: "Bridgestone Dueler A/T002",
    vehicleCategory: "SUV",
    segmentSuitability: ["Off-Road 4x4", "Full-Size SUV", "Compact SUV", "Pickup Truck", "SUV"],
    usageSuitability: ["Off-Road", "Highway"],
    description: "Aggressive all-terrain tyre with severe block construction. Maximum grip in mud, sand, gravel, and unpaved mountain pathways.",
    treadPatternType: "all-terrain",
    keyFeatures: ["Multi-Directional Mud Shoulder Blocks", "Anti-Chip Tread Rubber", "M+S All Weather Certification"],
    subSegment: "All-Terrain SUV",
    price: "Starts at ₹9,800",
    vehicleTypes: ["4x4 Off-Roaders", "Full-Size SUVs", "Rugged Utility Crossovers"],
    terrain: "50% Off-Road Trails, 50% Highway",
    rimSizes: "16\" - 18\"",
    specs: { loadIndex: "110-112", speedRating: "S-H", mudTraction: "9/10", punctureRes: "Excellent" }
  },
  {
    id: "alenza-001",
    name: "Bridgestone Alenza 001",
    vehicleCategory: "SUV",
    segmentSuitability: ["Full-Size SUV", "Compact SUV", "Luxury Sedan", "Electric Vehicle", "SUV"],
    usageSuitability: ["Highway"],
    description: "Flagship luxury sport utility performance tyre. Engineered for absolute high-speed stability, cornering feedback, and safety.",
    treadPatternType: "sport",
    keyFeatures: ["Sport Compound Contact Patch", "Premium High-Speed Steering Tracking", "Monsoon Hydro-Grip Ribs"],
    subSegment: "Premium Luxury Sport SUV",
    price: "Starts at ₹11,500",
    vehicleTypes: ["Luxury SUVs", "Premium Crossovers"],
    terrain: "95% Highway Speedways, 5% Dirt Roads",
    rimSizes: "17\" - 18\"",
    specs: { loadIndex: "95-110", speedRating: "V", handling: "10/10", highSpeedStability: "Elite" }
  },
  {
    id: "v-steel-mix-m721",
    name: "Bridgestone V-Steel Mix M721",
    vehicleCategory: "Truck/Bus",
    segmentSuitability: ["Heavy Commercial Truck", "Light Commercial Truck", "Luxury Coach Bus", "Bus", "Agricultural Tractor", "Construction Equipment"],
    usageSuitability: ["Highway", "Urban"],
    description: "Premium heavy-duty commercial radial for long haul cargo transport and regional logistics coaches.",
    treadPatternType: "rib-commercial",
    keyFeatures: ["Multi-Steel Belt Casing Structure", "Elite Multiple Retreadability Index", "Low Heat Generation Base Layer"],
    subSegment: "Heavy Duty Commercial Cargo",
    price: "Starts at ₹14,500",
    vehicleTypes: ["Heavy Cargo Trucks", "Light Commercial Fleets", "Regional Coach Buses"],
    terrain: "100% Regional/National Highway Haulage",
    rimSizes: "16\" - 22.5\"",
    specs: { loadIndex: "128-152", speedRating: "K-M", retreadability: "Elite", heatDispersion: "9/10" }
  },
  {
    id: "g611-tipper",
    name: "Bridgestone G611 Tipper",
    vehicleCategory: "Truck/Bus",
    segmentSuitability: ["Heavy Commercial Truck", "Construction Equipment", "Agricultural Tractor", "Off-Road 4x4"],
    usageSuitability: ["Off-Road"],
    description: "Industrial mining tipper radial. Engineered to withstand heavy tipping weight on muddy construction sites.",
    treadPatternType: "tipper-block",
    keyFeatures: ["Specialized Cut-Resistant Compound", "Footprint Uniform Pressure", "Off-Road Mud Traction Blocks"],
    subSegment: "Heavy Duty Industrial Mining",
    price: "Starts at ₹28,500",
    vehicleTypes: ["Mining Tippers", "Heavy Construction Site Vehicles"],
    terrain: "90% Mud/Construction Sites, 10% Regional Roads",
    rimSizes: "20\"",
    specs: { loadIndex: "146-150", speedRating: "J", cutResistance: "Extreme", loadSupport: "10/10" }
  }
];

// 4. SKU Catalogue — comprehensive global size coverage for all vehicle categories
export const SKU_CATALOG: TyreSKU[] = [
  // ═══════════════════════════════════════════════════════════════
  // Sturdo — Durable passenger radial (R12 to R18)
  // ═══════════════════════════════════════════════════════════════
  { productId: "sturdo", size: "145/80 R12", rimSize: "12", loadIndex: 74, speedRating: "T", price: 3200 },
  { productId: "sturdo", size: "155/65 R13", rimSize: "13", loadIndex: 73, speedRating: "T", price: 3500 },
  { productId: "sturdo", size: "155/80 R13", rimSize: "13", loadIndex: 79, speedRating: "T", price: 3400 },
  { productId: "sturdo", size: "165/80 R14", rimSize: "14", loadIndex: 85, speedRating: "T", price: 4950 },
  { productId: "sturdo", size: "175/65 R14", rimSize: "14", loadIndex: 82, speedRating: "T", price: 4600 },
  { productId: "sturdo", size: "185/65 R15", rimSize: "15", loadIndex: 88, speedRating: "H", price: 5800 },
  { productId: "sturdo", size: "185/60 R15", rimSize: "15", loadIndex: 84, speedRating: "H", price: 5600 },
  { productId: "sturdo", size: "195/55 R16", rimSize: "16", loadIndex: 87, speedRating: "H", price: 6200 },
  { productId: "sturdo", size: "195/60 R16", rimSize: "16", loadIndex: 89, speedRating: "H", price: 6400 },
  { productId: "sturdo", size: "205/55 R16", rimSize: "16", loadIndex: 91, speedRating: "V", price: 6600 },
  { productId: "sturdo", size: "205/65 R16", rimSize: "16", loadIndex: 95, speedRating: "H", price: 6800 },
  { productId: "sturdo", size: "215/60 R16", rimSize: "16", loadIndex: 95, speedRating: "H", price: 7000 },
  { productId: "sturdo", size: "215/55 R17", rimSize: "17", loadIndex: 94, speedRating: "V", price: 7800 },
  { productId: "sturdo", size: "215/60 R17", rimSize: "17", loadIndex: 96, speedRating: "H", price: 8000 },
  { productId: "sturdo", size: "225/50 R17", rimSize: "17", loadIndex: 94, speedRating: "V", price: 8200 },
  { productId: "sturdo", size: "225/55 R18", rimSize: "18", loadIndex: 98, speedRating: "V", price: 9500 },

  // ═══════════════════════════════════════════════════════════════
  // Turanza 6i — Premium touring comfort (R15 to R21)
  // ═══════════════════════════════════════════════════════════════
  { productId: "turanza-6i", size: "185/65 R15", rimSize: "15", loadIndex: 88, speedRating: "H", price: 5900 },
  { productId: "turanza-6i", size: "185/55 R16", rimSize: "16", loadIndex: 83, speedRating: "V", price: 6800 },
  { productId: "turanza-6i", size: "195/55 R16", rimSize: "16", loadIndex: 87, speedRating: "V", price: 7000 },
  { productId: "turanza-6i", size: "205/55 R16", rimSize: "16", loadIndex: 91, speedRating: "V", price: 7200 },
  { productId: "turanza-6i", size: "205/65 R16", rimSize: "16", loadIndex: 95, speedRating: "H", price: 7200 },
  { productId: "turanza-6i", size: "215/60 R16", rimSize: "16", loadIndex: 95, speedRating: "H", price: 7500 },
  { productId: "turanza-6i", size: "215/55 R17", rimSize: "17", loadIndex: 94, speedRating: "W", price: 8200 },
  { productId: "turanza-6i", size: "215/60 R17", rimSize: "17", loadIndex: 96, speedRating: "V", price: 8450 },
  { productId: "turanza-6i", size: "225/45 R17", rimSize: "17", loadIndex: 91, speedRating: "W", price: 8800 },
  { productId: "turanza-6i", size: "225/50 R17", rimSize: "17", loadIndex: 94, speedRating: "W", price: 8600 },
  { productId: "turanza-6i", size: "225/55 R17", rimSize: "17", loadIndex: 97, speedRating: "W", price: 9000 },
  { productId: "turanza-6i", size: "215/55 R18", rimSize: "18", loadIndex: 95, speedRating: "V", price: 11200 },
  { productId: "turanza-6i", size: "225/45 R18", rimSize: "18", loadIndex: 91, speedRating: "W", price: 10800 },
  { productId: "turanza-6i", size: "225/55 R18", rimSize: "18", loadIndex: 98, speedRating: "V", price: 11000 },
  { productId: "turanza-6i", size: "235/45 R18", rimSize: "18", loadIndex: 94, speedRating: "W", price: 11500 },
  { productId: "turanza-6i", size: "235/55 R18", rimSize: "18", loadIndex: 100, speedRating: "V", price: 11800 },
  { productId: "turanza-6i", size: "245/45 R18", rimSize: "18", loadIndex: 96, speedRating: "W", price: 12000 },
  { productId: "turanza-6i", size: "235/40 R19", rimSize: "19", loadIndex: 96, speedRating: "Y", price: 13200 },
  { productId: "turanza-6i", size: "235/55 R19", rimSize: "19", loadIndex: 101, speedRating: "V", price: 13500 },
  { productId: "turanza-6i", size: "245/40 R19", rimSize: "19", loadIndex: 98, speedRating: "Y", price: 13800 },
  { productId: "turanza-6i", size: "255/45 R19", rimSize: "19", loadIndex: 100, speedRating: "W", price: 14200 },
  { productId: "turanza-6i", size: "255/40 R20", rimSize: "20", loadIndex: 101, speedRating: "W", price: 15500 },
  { productId: "turanza-6i", size: "255/50 R20", rimSize: "20", loadIndex: 109, speedRating: "V", price: 15800 },
  { productId: "turanza-6i", size: "275/35 R21", rimSize: "21", loadIndex: 103, speedRating: "Y", price: 18500 },
  { productId: "turanza-6i", size: "275/40 R21", rimSize: "21", loadIndex: 107, speedRating: "W", price: 18200 },
  { productId: "turanza-6i", size: "275/45 R21", rimSize: "21", loadIndex: 110, speedRating: "V", price: 18800 },
  { productId: "turanza-6i", size: "285/40 R22", rimSize: "22", loadIndex: 110, speedRating: "W", price: 21000 },

  // ═══════════════════════════════════════════════════════════════
  // Ecopia EP150 — Eco / EV optimized (R12 to R20)
  // ═══════════════════════════════════════════════════════════════
  { productId: "ecopia-ep150", size: "145/80 R12", rimSize: "12", loadIndex: 74, speedRating: "S", price: 3100 },
  { productId: "ecopia-ep150", size: "155/80 R13", rimSize: "13", loadIndex: 79, speedRating: "T", price: 3500 },
  { productId: "ecopia-ep150", size: "165/80 R14", rimSize: "14", loadIndex: 85, speedRating: "T", price: 4200 },
  { productId: "ecopia-ep150", size: "175/65 R14", rimSize: "14", loadIndex: 82, speedRating: "T", price: 4000 },
  { productId: "ecopia-ep150", size: "185/65 R15", rimSize: "15", loadIndex: 88, speedRating: "H", price: 4950 },
  { productId: "ecopia-ep150", size: "185/55 R16", rimSize: "16", loadIndex: 83, speedRating: "V", price: 5500 },
  { productId: "ecopia-ep150", size: "195/55 R16", rimSize: "16", loadIndex: 87, speedRating: "V", price: 5600 },
  { productId: "ecopia-ep150", size: "205/55 R16", rimSize: "16", loadIndex: 91, speedRating: "V", price: 5700 },
  { productId: "ecopia-ep150", size: "215/60 R16", rimSize: "16", loadIndex: 95, speedRating: "H", price: 5800 },
  { productId: "ecopia-ep150", size: "215/55 R17", rimSize: "17", loadIndex: 94, speedRating: "V", price: 6800 },
  { productId: "ecopia-ep150", size: "215/60 R17", rimSize: "17", loadIndex: 96, speedRating: "H", price: 7000 },
  { productId: "ecopia-ep150", size: "225/50 R17", rimSize: "17", loadIndex: 94, speedRating: "V", price: 7200 },
  { productId: "ecopia-ep150", size: "225/55 R18", rimSize: "18", loadIndex: 98, speedRating: "V", price: 9200 },
  { productId: "ecopia-ep150", size: "235/55 R18", rimSize: "18", loadIndex: 100, speedRating: "V", price: 9800 },
  { productId: "ecopia-ep150", size: "235/55 R19", rimSize: "19", loadIndex: 101, speedRating: "V", price: 11000 },
  { productId: "ecopia-ep150", size: "255/45 R19", rimSize: "19", loadIndex: 100, speedRating: "V", price: 11500 },
  { productId: "ecopia-ep150", size: "255/50 R20", rimSize: "20", loadIndex: 109, speedRating: "V", price: 13000 },

  // ═══════════════════════════════════════════════════════════════
  // Dueler A/T002 — All-terrain SUV / Off-road (R15 to R22)
  // ═══════════════════════════════════════════════════════════════
  { productId: "dueler-at002", size: "205/70 R15", rimSize: "15", loadIndex: 96, speedRating: "H", price: 8200 },
  { productId: "dueler-at002", size: "215/70 R16", rimSize: "16", loadIndex: 100, speedRating: "H", price: 9000 },
  { productId: "dueler-at002", size: "225/65 R17", rimSize: "17", loadIndex: 102, speedRating: "H", price: 9500 },
  { productId: "dueler-at002", size: "235/65 R17", rimSize: "17", loadIndex: 108, speedRating: "H", price: 10200 },
  { productId: "dueler-at002", size: "245/65 R17", rimSize: "17", loadIndex: 111, speedRating: "H", price: 10800 },
  { productId: "dueler-at002", size: "245/75 R16", rimSize: "16", loadIndex: 111, speedRating: "S", price: 9800 },
  { productId: "dueler-at002", size: "255/70 R16", rimSize: "16", loadIndex: 111, speedRating: "S", price: 10200 },
  { productId: "dueler-at002", size: "265/65 R17", rimSize: "17", loadIndex: 112, speedRating: "S", price: 11200 },
  { productId: "dueler-at002", size: "255/65 R18", rimSize: "18", loadIndex: 111, speedRating: "T", price: 12200 },
  { productId: "dueler-at002", size: "265/60 R18", rimSize: "18", loadIndex: 110, speedRating: "H", price: 12500 },
  { productId: "dueler-at002", size: "235/55 R19", rimSize: "19", loadIndex: 101, speedRating: "V", price: 12800 },
  { productId: "dueler-at002", size: "255/50 R19", rimSize: "19", loadIndex: 107, speedRating: "V", price: 13200 },
  { productId: "dueler-at002", size: "255/55 R19", rimSize: "19", loadIndex: 111, speedRating: "V", price: 13500 },
  { productId: "dueler-at002", size: "255/50 R20", rimSize: "20", loadIndex: 109, speedRating: "V", price: 14200 },
  { productId: "dueler-at002", size: "275/55 R20", rimSize: "20", loadIndex: 117, speedRating: "H", price: 15000 },
  { productId: "dueler-at002", size: "275/45 R21", rimSize: "21", loadIndex: 110, speedRating: "V", price: 16500 },
  { productId: "dueler-at002", size: "275/40 R22", rimSize: "22", loadIndex: 108, speedRating: "V", price: 18000 },

  // ═══════════════════════════════════════════════════════════════
  // Alenza 001 — Premium / Luxury Sport SUV (R17 to R22)
  // ═══════════════════════════════════════════════════════════════
  { productId: "alenza-001", size: "215/60 R17", rimSize: "17", loadIndex: 96, speedRating: "V", price: 11500 },
  { productId: "alenza-001", size: "225/65 R17", rimSize: "17", loadIndex: 102, speedRating: "V", price: 11800 },
  { productId: "alenza-001", size: "235/55 R18", rimSize: "18", loadIndex: 100, speedRating: "W", price: 12800 },
  { productId: "alenza-001", size: "215/55 R18", rimSize: "18", loadIndex: 95, speedRating: "V", price: 13200 },
  { productId: "alenza-001", size: "235/60 R18", rimSize: "18", loadIndex: 103, speedRating: "V", price: 13400 },
  { productId: "alenza-001", size: "255/55 R18", rimSize: "18", loadIndex: 109, speedRating: "V", price: 13800 },
  { productId: "alenza-001", size: "265/60 R18", rimSize: "18", loadIndex: 110, speedRating: "V", price: 14800 },
  { productId: "alenza-001", size: "235/55 R19", rimSize: "19", loadIndex: 101, speedRating: "W", price: 14500 },
  { productId: "alenza-001", size: "245/45 R19", rimSize: "19", loadIndex: 98, speedRating: "W", price: 14800 },
  { productId: "alenza-001", size: "255/45 R19", rimSize: "19", loadIndex: 100, speedRating: "W", price: 15200 },
  { productId: "alenza-001", size: "255/50 R19", rimSize: "19", loadIndex: 107, speedRating: "W", price: 15500 },
  { productId: "alenza-001", size: "255/55 R19", rimSize: "19", loadIndex: 111, speedRating: "V", price: 15800 },
  { productId: "alenza-001", size: "255/50 R20", rimSize: "20", loadIndex: 109, speedRating: "W", price: 17200 },
  { productId: "alenza-001", size: "265/45 R20", rimSize: "20", loadIndex: 108, speedRating: "Y", price: 17500 },
  { productId: "alenza-001", size: "275/40 R20", rimSize: "20", loadIndex: 106, speedRating: "Y", price: 17800 },
  { productId: "alenza-001", size: "275/45 R20", rimSize: "20", loadIndex: 110, speedRating: "V", price: 18000 },
  { productId: "alenza-001", size: "275/35 R21", rimSize: "21", loadIndex: 103, speedRating: "Y", price: 19500 },
  { productId: "alenza-001", size: "275/40 R21", rimSize: "21", loadIndex: 107, speedRating: "W", price: 19800 },
  { productId: "alenza-001", size: "275/45 R21", rimSize: "21", loadIndex: 110, speedRating: "V", price: 20200 },
  { productId: "alenza-001", size: "285/40 R22", rimSize: "22", loadIndex: 110, speedRating: "W", price: 22500 },
  { productId: "alenza-001", size: "285/45 R22", rimSize: "22", loadIndex: 114, speedRating: "V", price: 23000 },

  // ═══════════════════════════════════════════════════════════════
  // V-Steel Mix M721 — Heavy-duty commercial (R16 to R22.5)
  // ═══════════════════════════════════════════════════════════════
  { productId: "v-steel-mix-m721", size: "7.50 R16", rimSize: "16", loadIndex: 122, speedRating: "L", price: 12500 },
  { productId: "v-steel-mix-m721", size: "8.25 R16", rimSize: "16", loadIndex: 128, speedRating: "L", price: 14500 },
  { productId: "v-steel-mix-m721", size: "9.00 R20", rimSize: "20", loadIndex: 141, speedRating: "K", price: 18500 },
  { productId: "v-steel-mix-m721", size: "10.00 R20", rimSize: "20", loadIndex: 146, speedRating: "K", price: 21000 },
  { productId: "v-steel-mix-m721", size: "11.00 R20", rimSize: "20", loadIndex: 150, speedRating: "K", price: 23500 },
  { productId: "v-steel-mix-m721", size: "12.00 R20", rimSize: "20", loadIndex: 154, speedRating: "K", price: 26000 },
  { productId: "v-steel-mix-m721", size: "295/90 R20", rimSize: "20", loadIndex: 146, speedRating: "K", price: 24800 },
  { productId: "v-steel-mix-m721", size: "275/70 R22.5", rimSize: "22.5", loadIndex: 148, speedRating: "M", price: 28000 },
  { productId: "v-steel-mix-m721", size: "295/80 R22.5", rimSize: "22.5", loadIndex: 152, speedRating: "M", price: 32500 },
  { productId: "v-steel-mix-m721", size: "315/80 R22.5", rimSize: "22.5", loadIndex: 156, speedRating: "L", price: 35000 },
  { productId: "v-steel-mix-m721", size: "385/65 R22.5", rimSize: "22.5", loadIndex: 160, speedRating: "K", price: 38000 },
  // Agricultural / Construction - larger formats
  { productId: "v-steel-mix-m721", size: "14.00 R20", rimSize: "20", loadIndex: 160, speedRating: "J", price: 32000 },
  { productId: "v-steel-mix-m721", size: "16.00 R20", rimSize: "20", loadIndex: 170, speedRating: "J", price: 38000 },

  // ═══════════════════════════════════════════════════════════════
  // G611 Tipper — Industrial / Mining / Construction (R20 to R24)
  // ═══════════════════════════════════════════════════════════════
  { productId: "g611-tipper", size: "10.00 R20", rimSize: "20", loadIndex: 146, speedRating: "J", price: 24000 },
  { productId: "g611-tipper", size: "11.00 R20", rimSize: "20", loadIndex: 150, speedRating: "J", price: 28500 },
  { productId: "g611-tipper", size: "12.00 R20", rimSize: "20", loadIndex: 154, speedRating: "J", price: 31000 },
  { productId: "g611-tipper", size: "295/90 R20", rimSize: "20", loadIndex: 146, speedRating: "J", price: 29500 },
  { productId: "g611-tipper", size: "14.00 R20", rimSize: "20", loadIndex: 160, speedRating: "J", price: 35000 },
  { productId: "g611-tipper", size: "14.00 R24", rimSize: "24", loadIndex: 164, speedRating: "J", price: 42000 },
  { productId: "g611-tipper", size: "16.00 R24", rimSize: "24", loadIndex: 170, speedRating: "J", price: 48000 },
  { productId: "g611-tipper", size: "18.00 R25", rimSize: "25", loadIndex: 180, speedRating: "J", price: 65000 },
  { productId: "g611-tipper", size: "23.5 R25", rimSize: "25", loadIndex: 185, speedRating: "J", price: 85000 },
  { productId: "g611-tipper", size: "26.5 R25", rimSize: "25", loadIndex: 190, speedRating: "J", price: 110000 },
];

// Helper database of dealer entries
export const DEALER_LOCATOR: Dealer[] = [
  {
    id: "pune-1",
    name: "Bridgestone Select - Premium Tyres Pune",
    address: "Wakad, Pune, MH 411057",
    distance: "1.2 km",
    stock: "In Stock",
    nextSlot: "Today, 4:30 PM",
    wait: "15 mins"
  },
  {
    id: "pune-2",
    name: "Bridgestone Select - Kothrud Hub",
    address: "Kothrud, Pune, MH 411038",
    distance: "4.6 km",
    stock: "In Stock",
    nextSlot: "Tomorrow, 10:00 AM",
    wait: "5 mins"
  }
];

// Speed Rating Ordering List (J lowest to Y highest)
const SPEED_RATINGS_ORDER = ["J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "H", "V", "W", "Y"];

export function isSpeedRatingCompatible(tyreRating: string, oemRating: string): boolean {
  const tIndex = SPEED_RATINGS_ORDER.indexOf(tyreRating.toUpperCase());
  const oIndex = SPEED_RATINGS_ORDER.indexOf(oemRating.toUpperCase());
  if (tIndex === -1 || oIndex === -1) return true; // fallback
  return tIndex >= oIndex;
}

// 5. Size Compatibility upsizing/downsizing calculation engine
export interface SizeMatchResult {
  compatible: boolean;
  percentage: number;
  explanation: string;
}

export function calculateSizeCompatibility(tyreSize: string, oemSize: string): SizeMatchResult {
  // exact string match
  if (tyreSize.replace(/\s+/g, "") === oemSize.replace(/\s+/g, "")) {
    return {
      compatible: true,
      percentage: 100,
      explanation: "Exact OEM Size Match"
    };
  }

  // Parse Passenger style sizes (e.g. 215/60 R17)
  const passRegex = /^(\d+)\/(\d+)\s*R([\d.]+)$/;
  // Parse Commercial style sizes (e.g. 8.25 R16 or 11.00 R20)
  const commRegex = /^([\d.]+)\s*R([\d.]+)$/;

  const mTyrePass = tyreSize.match(passRegex);
  const mOemPass = oemSize.match(passRegex);

  // If both are standard passenger sizes
  if (mTyrePass && mOemPass) {
    const wTyre = parseInt(mTyrePass[1], 10);
    const aTyre = parseInt(mTyrePass[2], 10);
    const rTyre = parseFloat(mTyrePass[3]);

    const wOem = parseInt(mOemPass[1], 10);
    const aOem = parseInt(mOemPass[2], 10);
    const rOem = parseFloat(mOemPass[3]);

    // Rim size must be identical
    if (rTyre !== rOem) {
      return { compatible: false, percentage: 0, explanation: `Rim Mismatch (${rTyre}" vs ${rOem}")` };
    }

    const widthDiff = Math.abs(wTyre - wOem); // in mm
    const aspectDiff = Math.abs(aTyre - aOem); // in %

    // Upsizing Rules: width diff <= 10mm, aspect diff <= 5%
    if (widthDiff <= 10 && aspectDiff <= 5) {
      let penalty = (widthDiff * 1.5) + (aspectDiff * 3);
      let percentage = Math.max(70, Math.round(100 - penalty));
      const upsizingText = wTyre > wOem ? "Plus-Sized Alternative (Wider Footprint)" : "Minus-Sized Alternative";
      return {
        compatible: true,
        percentage,
        explanation: `${upsizingText} (Rim matches, Width diff ${widthDiff}mm, Aspect diff ${aspectDiff}%)`
      };
    }

    return {
      compatible: false,
      percentage: 0,
      explanation: `Incompatible sizing (Width/Aspect ratio difference exceeds limits)`
    };
  }

  // If both are commercial radial sizes (e.g. 8.25 R16 or 11.00 R20)
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
    if (widthDiff === 0) {
      return { compatible: true, percentage: 100, explanation: "Exact Commercial Profile Match" };
    }
    if (widthDiff <= 1.0) {
      let percentage = Math.round(100 - (widthDiff * 20));
      return {
        compatible: true,
        percentage,
        explanation: `Compatible Commercial Profile (Rim matches, width difference ${widthDiff} inches)`
      };
    }
  }

  return {
    compatible: false,
    percentage: 0,
    explanation: "Incompatible tyre classification (Commercial vs Passenger)"
  };
}

// 6. Pricing & Availability Engines
export function getPriceForRim(productId: string, rimSize: string): number {
  const skus = SKU_CATALOG.filter((s) => s.productId === productId && s.rimSize === rimSize);
  if (skus.length > 0) return skus[0].price;
  // fallback first matching price
  const fbSkus = SKU_CATALOG.filter((s) => s.productId === productId);
  return fbSkus[0]?.price || 0;
}

export function formatINR(price: number): string {
  if (price === 0) return "TBD";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);
}

export function getFormattedPrice(productId: string, rimSize: string): string {
  return formatINR(getPriceForRim(productId, rimSize));
}

export interface AvailabilityInfo {
  status: "In Stock" | "Available to Order" | "Out of Stock";
  stockCount: number;
  nearestLocation: string;
  deliveryDays: number;
  freeFitment: boolean;
}

export function getAvailability(productId: string, rimSize: string): AvailabilityInfo {
  const seed = (productId.charCodeAt(0) + rimSize.charCodeAt(0)) % 10;
  if (seed === 0) {
    return { status: "Out of Stock", stockCount: 0, nearestLocation: "Pune Warehouse", deliveryDays: 4, freeFitment: false };
  }
  if (seed < 3) {
    return { status: "Available to Order", stockCount: 4, nearestLocation: "Mumbai Logistics Hub", deliveryDays: 2, freeFitment: true };
  }
  return { status: "In Stock", stockCount: 10 + seed, nearestLocation: "Wakad, Pune (1.2 km away)", deliveryDays: 0, freeFitment: true };
}

// 7. Structured Recommendation Engine Output Details
export interface ScoredRecommendation {
  product: Product;
  sku: TyreSKU;
  score: number; // overall calculated score (0 to 100)
  sizeScore: number;
  loadScore: number;
  speedScore: number;
  segmentScore: number;
  preferenceScore: number;
  explanations: {
    whyThisTyre: string;
    size: string;
    load: string;
    speed: string;
    segment: string;
    preference: string;
  };
}

export interface RecommendationInput {
  vehicleId: string;
  year: string;
  variant: string;
  terrain: "Urban" | "Highway" | "Off-Road" | "";
  roadCondition: "Smooth" | "Broken" | "Rough" | "";
  loadRequirement: "Standard" | "Heavy" | "";
  priority: "Comfort" | "Toughness" | "Efficiency" | "Sport" | "Commercial" | "";
}

// 8. The Recommendation Engine
export function recommendTyres(input: RecommendationInput): ScoredRecommendation[] {
  const { vehicleId, year, variant, terrain, roadCondition, loadRequirement, priority } = input;

  // Find vehicle and specification
  const vehicle = VEHICLES.find((v) => v.id === vehicleId);
  const spec = OEM_SPECIFICATIONS.find((s) => s.vehicleId === vehicleId && s.year === year && s.variant === variant);

  if (!vehicle || !spec) return [];

  const oemLoad = parseInt(spec.loadIndex, 10);
  const oemSpeed = spec.speedRating.toUpperCase();

  const results: ScoredRecommendation[] = [];

  // Iterate all products
  for (const product of PRODUCT_CATALOG) {
    // Find matching SKU for the product with closest matching tyre size on the same rim diameter
    const productSkus = SKU_CATALOG.filter((s) => s.productId === product.id);
    let bestSku: TyreSKU | null = null;
    let bestSizeMatch: SizeMatchResult = { compatible: false, percentage: 0, explanation: "" };

    for (const sku of productSkus) {
      const sizeMatch = calculateSizeCompatibility(sku.size, spec.oemTyreSize);
      if (sizeMatch.compatible && sizeMatch.percentage > bestSizeMatch.percentage) {
        bestSizeMatch = sizeMatch;
        bestSku = sku;
      }
    }

    // Skip product if it has no compatible tyre sizes for the vehicle
    if (!bestSku || !bestSizeMatch.compatible) continue;

    // STEP 3: Match Load Index
    let loadScore = 100;
    let loadExplanation = `Load Rating Match (${bestSku.loadIndex} matches/exceeds OEM ${oemLoad})`;
    if (bestSku.loadIndex < oemLoad) {
      const diff = oemLoad - bestSku.loadIndex;
      loadScore = Math.max(0, 100 - (diff * 20)); // severe penalty
      loadExplanation = `Insufficient Load Rating: ${bestSku.loadIndex} is below OEM ${oemLoad}`;
    }

    // STEP 4: Match Speed Rating
    let speedScore = 100;
    let speedExplanation = `Speed Rating Match (${bestSku.speedRating} rated up to ${getSpeedLimit(bestSku.speedRating)} km/h matches/exceeds OEM ${oemSpeed})`;
    if (!isSpeedRatingCompatible(bestSku.speedRating, oemSpeed)) {
      speedScore = 60; // penalty
      speedExplanation = `Speed Rating Mismatch: ${bestSku.speedRating} (${getSpeedLimit(bestSku.speedRating)} km/h) is below OEM ${oemSpeed} (${getSpeedLimit(oemSpeed)} km/h)`;
    }

    // STEP 5: Match Vehicle Segment suitability
    let segmentScore = 100;
    let segmentExplanation = `Optimal Segment Match (${vehicle.segment} optimized)`;
    if (!product.segmentSuitability.includes(vehicle.segment)) {
      segmentScore = 50; // penalty
      segmentExplanation = `Compromised Segment Match: designed for ${product.segmentSuitability.join("/")}, not optimized for ${vehicle.segment}`;
    }

    // STEP 6: Apply Usage & Performance Preference Alignment
    let preferenceScore = 70; // baseline
    const matchingReasons: string[] = [];

    // Terrain match
    if (terrain) {
      if (product.usageSuitability.includes(terrain)) {
        preferenceScore += 10;
        matchingReasons.push(`${terrain} Terrain Optimized`);
      } else {
        preferenceScore -= 10;
      }
    }

    // Road Condition match
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

    // Load requirement match
    if (loadRequirement === "Heavy" && (product.treadPatternType === "rib-commercial" || product.treadPatternType === "tipper-block" || product.treadPatternType === "all-terrain")) {
      preferenceScore += 5;
      matchingReasons.push("Heavy Cargo Load Support");
    }

    // Priority match
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

    // Overall calculated compatibility score
    const sizeWeight = 0.40;
    const loadWeight = 0.20;
    const speedWeight = 0.15;
    const segmentWeight = 0.15;
    const preferenceWeight = 0.10;

    let overallScore = Math.round(
      (bestSizeMatch.percentage * sizeWeight) +
      (loadScore * loadWeight) +
      (speedScore * speedWeight) +
      (segmentScore * segmentWeight) +
      (preferenceScore * preferenceWeight)
    );

    // If size compatibility is 0, or load index is severely unsafe (< 75), overall is 0
    if (bestSizeMatch.percentage === 0 || loadScore < 60) {
      overallScore = 0;
    }

    // Generate specific text rationale for "Why this tyre?"
    const rationales: string[] = [];
    if (bestSizeMatch.percentage === 100) {
      rationales.push("an exact OEM size match");
    } else {
      rationales.push(`a compatible size alternative (${bestSku.size})`);
    }
    if (loadScore === 100) rationales.push("meets the load rating requirements");
    if (speedScore === 100) rationales.push("meets speed rating indices");
    if (segmentScore === 100) rationales.push("matches the vehicle's segment profile");
    if (matchingReasons.length > 0) rationales.push(`aligns perfectly with your ${priority || "comfort"} preference`);

    const whyThisTyreText = `This product is recommended because it is ${rationales.join(", ")}.`;

    results.push({
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
        preference: preferenceExplanation
      }
    });
  }

  // Sort by calculated overall score descending
  results.sort((a, b) => b.score - a.score);

  // Return only compatible recommendations (score > 0)
  return results.filter((r) => r.score > 0);
}

// Helper to translate speed rating character into km/h speed limit
function getSpeedLimit(rating: string): string {
  const index = SPEED_RATINGS_ORDER.indexOf(rating.toUpperCase());
  if (index === -1) return "TBD";
  const limits = ["100", "110", "120", "130", "140", "150", "160", "170", "180", "190", "200", "210", "240", "270", "300"];
  return limits[index] || "TBD";
}
