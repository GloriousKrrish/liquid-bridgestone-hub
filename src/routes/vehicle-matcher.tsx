import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Car, Truck, Mountain, Crown, Factory, Users,
  Gauge, Shield, Fuel, Timer, ArrowRight, ChevronRight,
  CheckCircle2, BarChart3,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/vehicle-matcher")({
  component: VehicleMatcherPage,
  head: () => ({
    meta: [
      { title: "Vehicle Specification Matcher — Bridgestone India" },
      { name: "description", content: "Identify the ideal Bridgestone tyre for your vehicle type, load requirements, and operating conditions." },
    ],
  }),
});

type VehicleCategory = "passenger" | "suv" | "luxury" | "truck" | "otr" | "fleet";

interface TyreSpec {
  category: string;
  model: string;
  loadIndex: string;
  speedRating: string;
  recommendedPressure: string;
  usageProfile: string;
  durability: number;
  performance: number;
  comfort: number;
  fuelEfficiency: number;
  wetGrip: string;
  sizes: string;
  price: string;
}

const VEHICLE_CATEGORIES: { id: VehicleCategory; label: string; description: string; icon: React.ReactNode }[] = [
  { id: "passenger", label: "Passenger Vehicles", description: "Sedans, hatchbacks, compact cars", icon: <Car size={22} /> },
  { id: "suv", label: "SUVs & Crossovers", description: "Mid-size and full-size SUVs, CUVs", icon: <Mountain size={22} /> },
  { id: "luxury", label: "Luxury Sedans", description: "Premium executive and flagship sedans", icon: <Crown size={22} /> },
  { id: "truck", label: "Trucks & Buses", description: "Commercial haulers, inter-city buses", icon: <Truck size={22} /> },
  { id: "otr", label: "Off-The-Road Equipment", description: "Mining, construction, industrial", icon: <Factory size={22} /> },
  { id: "fleet", label: "Fleet Operations", description: "Logistics fleets, last-mile delivery", icon: <Users size={22} /> },
];

const TYRE_SPECS: Record<VehicleCategory, TyreSpec> = {
  passenger: {
    category: "Passenger Car Radial",
    model: "Bridgestone Turanza 6i",
    loadIndex: "82–94",
    speedRating: "H (210 km/h)",
    recommendedPressure: "32–35 PSI",
    usageProfile: "Urban commuting, highway cruising, daily driving",
    durability: 9,
    performance: 8,
    comfort: 10,
    fuelEfficiency: 8,
    wetGrip: "A",
    sizes: "175/65R14 to 225/45R18",
    price: "₹4,950 – ₹8,450",
  },
  suv: {
    category: "SUV All-Terrain",
    model: "Bridgestone Dueler A/T 002",
    loadIndex: "100–116",
    speedRating: "S (180 km/h)",
    recommendedPressure: "34–38 PSI",
    usageProfile: "Mixed terrain, off-road trails, highway transitions",
    durability: 10,
    performance: 9,
    comfort: 7,
    fuelEfficiency: 7,
    wetGrip: "A",
    sizes: "215/70R16 to 265/65R18",
    price: "₹9,800 – ₹12,200",
  },
  luxury: {
    category: "Premium Performance",
    model: "Bridgestone Alenza 001",
    loadIndex: "98–114",
    speedRating: "W (270 km/h)",
    recommendedPressure: "36–40 PSI",
    usageProfile: "High-speed expressways, executive comfort, prestige driving",
    durability: 9,
    performance: 10,
    comfort: 9,
    fuelEfficiency: 7,
    wetGrip: "A",
    sizes: "225/55R17 to 285/40R21",
    price: "₹12,500 – ₹16,500",
  },
  truck: {
    category: "Commercial Radial",
    model: "Bridgestone V-Steel Mix M721",
    loadIndex: "154/150",
    speedRating: "L (120 km/h)",
    recommendedPressure: "100–120 PSI",
    usageProfile: "Freight corridors, national highway logistics, heavy payloads",
    durability: 10,
    performance: 8,
    comfort: 5,
    fuelEfficiency: 9,
    wetGrip: "B+",
    sizes: "295/80R22.5, 11R22.5, 12R22.5",
    price: "₹18,500 – ₹24,800",
  },
  otr: {
    category: "Off-The-Road Industrial",
    model: "Bridgestone G611 Tipper",
    loadIndex: "Heavy-Duty Industrial",
    speedRating: "E (70 km/h)",
    recommendedPressure: "80–110 PSI",
    usageProfile: "Mining sites, construction zones, earth-moving operations",
    durability: 10,
    performance: 8,
    comfort: 3,
    fuelEfficiency: 6,
    wetGrip: "B",
    sizes: "12.00R20, 13R22.5 Industrial",
    price: "₹24,000 – ₹28,500",
  },
  fleet: {
    category: "Fleet-Optimized Radial",
    model: "Bridgestone Ecopia EP150",
    loadIndex: "82–98",
    speedRating: "T (190 km/h)",
    recommendedPressure: "33–36 PSI",
    usageProfile: "Stop-and-go urban delivery, fuel economy optimization, EV fleets",
    durability: 8,
    performance: 7,
    comfort: 8,
    fuelEfficiency: 10,
    wetGrip: "B",
    sizes: "155/65R14 to 205/55R16",
    price: "₹3,800 – ₹4,950",
  },
};

function RatingBar({ value, label, max = 10 }: { value: number; label: string; max?: number }) {
  const pct = (value / max) * 100;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-[#B3B3B3] font-semibold">{label}</span>
        <span className="text-xs font-bold text-white">{value}/{max}</span>
      </div>
      <div className="h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#D71920] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function VehicleMatcherPage() {
  const [selected, setSelected] = useState<VehicleCategory | null>(null);
  const spec = selected ? TYRE_SPECS[selected] : null;
  const category = VEHICLE_CATEGORIES.find((c) => c.id === selected);

  return (
    <PageShell>
      <section className="max-w-6xl mx-auto px-6 pt-6 pb-20 relative z-10">
        <span className="text-[10px] uppercase tracking-widest text-[#B3B3B3]">
          Vehicle Specification Matcher
        </span>
        <h1 className="text-fluid-h1 font-bold text-white mt-2 mb-2 tracking-tight">
          Find Your <span className="text-[#D71920]">Engineering Match</span>
        </h1>
        <p className="text-[#B3B3B3] text-fluid-small max-w-2xl mb-10">
          Select your vehicle category to receive a precision-engineered tyre recommendation with full technical specifications.
        </p>

        {/* Category Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
          {VEHICLE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelected(cat.id)}
              className={`text-left p-5 rounded-xl border transition-all duration-150 cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none ${
                selected === cat.id
                  ? "bg-[#D71920]/10 border-[#D71920]/50 ring-1 ring-[#D71920]/30"
                  : "bg-[#1A1A1A] border-[#2A2A2A] hover:border-[#D71920]/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg border transition-colors ${
                  selected === cat.id
                    ? "bg-[#D71920]/20 border-[#D71920]/30 text-[#D71920]"
                    : "bg-[#1A1A1A] border-[#2A2A2A] text-[#B3B3B3] group-hover:text-white"
                }`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{cat.label}</h3>
                  <p className="text-[11px] text-[#B3B3B3] mt-0.5">{cat.description}</p>
                  {selected === cat.id && (
                    <span className="text-[9px] uppercase tracking-widest text-[#D71920] font-bold mt-1 block">
                      Selected
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Specification Result */}
        {spec && category && (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-[#2A2A2A]">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-[#D71920]/15 border border-[#D71920]/25">
                  <CheckCircle2 size={18} className="text-[#D71920]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D71920] font-bold block">
                    {spec.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{spec.model}</h2>
                </div>
              </div>
              <p className="text-[#B3B3B3] text-sm mt-2 max-w-xl">{spec.usageProfile}</p>
            </div>

            {/* Specs Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2A2A2A]">
              {[
                { label: "Load Index", value: spec.loadIndex, icon: <Shield size={14} /> },
                { label: "Speed Rating", value: spec.speedRating, icon: <Gauge size={14} /> },
                { label: "Rec. Pressure", value: spec.recommendedPressure, icon: <BarChart3 size={14} /> },
                { label: "Wet Grip", value: spec.wetGrip, icon: <Timer size={14} /> },
              ].map((item) => (
                <div key={item.label} className="bg-[#1A1A1A] p-5">
                  <div className="flex items-center gap-2 text-[#B3B3B3] mb-2">
                    {item.icon}
                    <span className="text-[10px] uppercase tracking-widest font-semibold">{item.label}</span>
                  </div>
                  <div className="text-white text-lg font-bold">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Performance Ratings */}
            <div className="p-6 md:p-8">
              <h3 className="text-[10px] uppercase tracking-widest text-[#B3B3B3] font-bold mb-4">
                Performance Profile
              </h3>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                <RatingBar value={spec.durability} label="Durability" />
                <RatingBar value={spec.performance} label="Performance" />
                <RatingBar value={spec.comfort} label="Comfort" />
                <RatingBar value={spec.fuelEfficiency} label="Fuel Efficiency" />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 md:px-8 pb-6 md:pb-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#2A2A2A] pt-5">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#B3B3B3] font-semibold">Available Sizes</div>
                <div className="text-white text-sm font-bold mt-0.5">{spec.sizes}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-[#B3B3B3] font-semibold">Price Range</div>
                <div className="text-white text-xl font-bold mt-0.5">{spec.price}</div>
              </div>
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}
