import { useState, useMemo } from "react";
import {
  Shield,
  Gauge,
  Mountain,
  Zap,
  CheckCircle2,
  Truck,
  Award,
  Search,
  Sparkles,
  SlidersHorizontal,
  Compass
} from "lucide-react";
import { PRODUCT_CATALOG, type Product } from "@/lib/bridgestone-data";

const PRODUCT_METADATA: Record<
  string,
  {
    icon: any;
    tagline: string;
    accent: string;
    glow: string;
    border: string;
    bgGrad: string;
  }
> = {
  "turanza-6i": {
    icon: Gauge,
    tagline: "Premium Comfort & Quietude",
    accent: "#D71920",
    glow: "hover:shadow-[0_15px_30px_rgba(204,0,0,0.08)]",
    border: "hover:border-[#D71920]/30",
    bgGrad: "from-[#D71920]/5 via-transparent to-transparent"
  },
  "dueler-at002": {
    icon: Mountain,
    tagline: "All-Terrain Mastery",
    accent: "#008B9B",
    glow: "hover:shadow-[0_15px_30px_rgba(0,139,155,0.08)]",
    border: "hover:border-[#008B9B]/30",
    bgGrad: "from-[#008B9B]/5 via-transparent to-transparent"
  },
  "sturdo": {
    icon: Shield,
    tagline: "Reinforced Durability Special",
    accent: "#D60062",
    glow: "hover:shadow-[0_15px_30px_rgba(214,0,98,0.08)]",
    border: "hover:border-[#D60062]/30",
    bgGrad: "from-[#D60062]/5 via-transparent to-transparent"
  },
  "ecopia-ep150": {
    icon: Zap,
    tagline: "Eco-Friendly Efficiency",
    accent: "#0891B2",
    glow: "hover:shadow-[0_15px_30px_rgba(8,145,178,0.08)]",
    border: "hover:border-[#0891B2]/30",
    bgGrad: "from-[#0891B2]/5 via-transparent to-transparent"
  },
  "alenza-001": {
    icon: Award,
    tagline: "Flagship Luxury SUV",
    accent: "#D97706",
    glow: "hover:shadow-[0_15px_30px_rgba(217,119,6,0.08)]",
    border: "hover:border-[#D97706]/30",
    bgGrad: "from-[#D97706]/5 via-transparent to-transparent"
  },
  "v-steel-mix-m721": {
    icon: Truck,
    tagline: "Heavy-Duty Commercial Radial",
    accent: "#4F46E5",
    glow: "hover:shadow-[0_15px_30px_rgba(79,70,229,0.08)]",
    border: "hover:border-[#4F46E5]/30",
    bgGrad: "from-[#4F46E5]/5 via-transparent to-transparent"
  },
  "g611-tipper": {
    icon: Truck,
    tagline: "Heavy Structural Tipper Special",
    accent: "#DB2777",
    glow: "hover:shadow-[0_15px_30px_rgba(219,39,119,0.08)]",
    border: "hover:border-[#DB2777]/30",
    bgGrad: "from-[#DB2777]/5 via-transparent to-transparent"
  }
};

const CLINIC_DATA = [
  { feature: "Structural Safety", tubeless: "Superior — no inner tube to fail", tube: "Moderate — tube rupture risk" },
  { feature: "Fuel Efficiency", tubeless: "Higher — lower rolling resistance", tube: "Standard efficiency" },
  { feature: "Puncture Convenience", tubeless: "Slow deflation, driveable", tube: "Instant flat, immediate stop" },
  { feature: "Heat Dissipation", tubeless: "Excellent — direct rim contact", tube: "Poor — trapped heat in tube" },
  { feature: "Weight", tubeless: "Lighter — no tube weight", tube: "Heavier assembly" },
];

export function ProductGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | "Car" | "SUV" | "Truck/Bus">("All");

  const filteredProducts = useMemo(() => {
    return PRODUCT_CATALOG.filter((product) => {
      // Category filter
      const matchesCategory =
        activeCategory === "All" || product.vehicleCategory === activeCategory;

      // Text search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchLower) ||
        product.subSegment.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.terrain.toLowerCase().includes(searchLower) ||
        product.vehicleTypes.some((v) => v.toLowerCase().includes(searchLower)) ||
        product.keyFeatures.some((f) => f.toLowerCase().includes(searchLower)) ||
        product.rimSizes.toLowerCase().includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <section className="w-full px-0 py-16 relative z-10">
      {/* Section Header */}
      <div className="text-center mb-12 animate-in fade-in duration-700">
        <span className="text-[10px] uppercase tracking-widest text-[#D71920] font-bold bg-[#D71920]/10 px-3 py-1 rounded-full border border-[#D71920]/20">
          Bridgestone India Tyre Catalog
        </span>
        <h2
          className="text-white font-medium tracking-tight text-3xl md:text-5xl mt-4 leading-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Engineered for every <em className="italic text-white/95">Indian road</em>.
        </h2>
        <p className="text-white/60 text-sm max-w-2xl mx-auto mt-3">
          Explore our real-world premium tire catalog. Filter by vehicle category or search attributes dynamically to find the ideal match.
        </p>
      </div>

      {/* Database Search & Filter Panel */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 mb-8 w-full shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:max-w-xs flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2.5 focus-within:border-[#D71920]/50 transition-all">
            <Search size={16} className="text-white/40 mr-2" />
            <input
              type="text"
              placeholder="Search specs, vehicles, rims..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white border-none outline-none w-full placeholder:text-white/40 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-white/40 hover:text-white/60 text-xs px-1"
              >
                ×
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-white/5 p-1 rounded-full border border-white/10 w-full md:w-auto justify-center">
            {(["All", "Car", "SUV", "Truck/Bus"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#D71920] text-white shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat === "All" ? "Show All" : cat === "Truck/Bus" ? "Truck & Bus" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Small search stats */}
        <div className="mt-4 flex items-center justify-between text-[10px] text-white/40 uppercase tracking-wider px-2">
          <div className="flex items-center gap-1">
            <SlidersHorizontal size={10} />
            Showing {filteredProducts.length} of {PRODUCT_CATALOG.length} tyres
          </div>
          {searchQuery && (
            <div>
              Query: <span className="text-[#D71920] font-semibold">{searchQuery}</span>
            </div>
          )}
        </div>
      </div>

      {/* Masonry Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="w-full max-w-[92vw] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {filteredProducts.map((product) => {
            const meta = PRODUCT_METADATA[product.id] || {
              icon: Award,
              tagline: "Bridgestone Premium Radial",
              accent: "#D71920",
              glow: "hover:shadow-[0_15px_30px_rgba(204,0,0,0.08)]",
              border: "hover:border-[#D71920]/30",
              bgGrad: "from-[#D71920]/5 via-transparent to-transparent"
            };
            const Icon = meta.icon;

            return (
              <div
                key={product.id}
                className="bg-gradient-to-br from-[#0c1020]/95 via-[#060813]/95 to-[#120a1a]/95 rounded-2xl border border-white/10 p-6 relative overflow-hidden shadow-2xl hover:border-[#D71920]/40 transition-all duration-300 group flex flex-col justify-between h-full hover:-translate-y-2"
              >
                {/* Subtle multi-color ambient blur glow spot */}
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-tr from-[#00E5FF]/20 to-[#FF007A]/20 blur-[50px] rounded-full group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

                {/* Subtle sheen reflection overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000" />

                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl p-2.5 border border-white/10 bg-white/5 transition-colors duration-300">
                        <Icon
                          size={18}
                          style={{
                            color: meta.accent,
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl text-white font-bold tracking-tight">
                          {product.name}
                        </h3>
                        <span className="text-[9px] uppercase tracking-widest text-slate-400 block mt-0.5">
                          {product.subSegment}
                        </span>
                      </div>
                    </div>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full border transition-all duration-300"
                      style={{
                        backgroundColor: `${meta.accent}20`,
                        borderColor: `${meta.accent}40`,
                        color: "#FFFFFF",
                      }}
                    >
                      {product.price}
                    </span>
                  </div>

                  {/* Taglines and Target Vehicles */}
                  <div className="mb-4 relative z-10">
                    <span
                      className="text-[10px] uppercase tracking-wider font-extrabold block mb-1.5"
                      style={{ color: meta.accent }}
                    >
                      {meta.tagline}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.vehicleTypes.map((vehicle) => (
                        <span
                          key={vehicle}
                          className="bg-white/5 text-[9px] text-slate-300 px-2.5 py-0.5 rounded-full border border-white/10"
                        >
                          {vehicle}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-200 font-medium leading-relaxed mb-5 relative z-10">
                    {product.description}
                  </p>

                  {/* Key Features Bullet List */}
                  <div className="mb-5 space-y-1.5 border-t border-white/10 pt-3 relative z-10">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block mb-2">
                      Key Highlights
                    </span>
                    {product.keyFeatures.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="mt-1 font-bold" style={{ color: meta.accent }}>
                          •
                        </span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Ideal Terrain */}
                  <div className="mb-5 bg-white/5 rounded-2xl p-3 border border-white/10 relative z-10">
                    <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                      Ideal Topography
                    </span>
                    <span className="text-xs text-white leading-snug block">
                      {product.terrain}
                    </span>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4 mt-auto relative z-10">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                    <div className="text-[8px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                      Rim Range
                    </div>
                    <div className="text-white text-xs font-bold truncate">{product.rimSizes}</div>
                  </div>
                  {Object.entries(product.specs).slice(0, 3).map(([key, val]) => (
                    <div
                      key={key}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5"
                    >
                      <div className="text-[8px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                        {key.replace(/([A-Z])/g, " $1")}
                      </div>
                      <div className="text-white text-xs font-bold truncate">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl max-w-md mx-auto mb-16 text-white">
          <Compass size={40} className="mx-auto text-white/30 mb-3 animate-pulse" />
          <h3 className="text-lg text-white font-medium mb-1">No Tyres Found</h3>
          <p className="text-white/60 text-xs px-6">
            We couldn't find any tyres matching "{searchQuery}" in the selected category. Try checking your spelling or clearing filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
            }}
            className="mt-4 bg-[#D71920] hover:bg-[#B5141A] text-white text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Passenger Clinic Section */}
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 shadow-sm animate-in fade-in duration-750">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
            <Sparkles size={18} className="text-[#D71920]" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#D71920] font-bold block">
              Bridgestone Passenger Clinic
            </span>
            <h3
              className="text-2xl text-white font-light"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Tubeless vs Tube-Type Tyres
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  Feature
                </th>
                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-[#D71920] font-bold">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} />
                    Tubeless
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  Tube-Type
                </th>
              </tr>
            </thead>
            <tbody>
              {CLINIC_DATA.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/5" : ""}`}
                >
                  <td className="py-3 px-4 font-semibold text-slate-300">{row.feature}</td>
                  <td className="py-3 px-4 text-white font-medium">{row.tubeless}</td>
                  <td className="py-3 px-4 text-white/50">{row.tube}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
