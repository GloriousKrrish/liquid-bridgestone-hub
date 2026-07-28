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
    badgeStyle: { bg: string; text: string; border: string };
  }
> = {
  "turanza-6i": {
    icon: Gauge,
    tagline: "Premium Comfort & Quietude",
    accent: "#C8A165",
    badgeStyle: { bg: "rgba(200, 161, 101, 0.12)", text: "#9B6B43", border: "rgba(200, 161, 101, 0.3)" }
  },
  "dueler-at002": {
    icon: Mountain,
    tagline: "All-Terrain Mastery",
    accent: "#9B6B43",
    badgeStyle: { bg: "rgba(155, 107, 67, 0.12)", text: "#9B6B43", border: "rgba(155, 107, 67, 0.3)" }
  },
  "sturdo": {
    icon: Shield,
    tagline: "Reinforced Durability Special",
    accent: "#E8C8CF",
    badgeStyle: { bg: "rgba(232, 200, 207, 0.25)", text: "#8C4A57", border: "rgba(232, 200, 207, 0.5)" }
  },
  "ecopia-ep150": {
    icon: Zap,
    tagline: "Eco-Friendly Efficiency",
    accent: "#5B8C5A",
    badgeStyle: { bg: "rgba(91, 140, 90, 0.12)", text: "#3B663A", border: "rgba(91, 140, 90, 0.3)" }
  },
  "alenza-001": {
    icon: Award,
    tagline: "Flagship Luxury SUV",
    accent: "#C8A165",
    badgeStyle: { bg: "rgba(200, 161, 101, 0.15)", text: "#9B6B43", border: "rgba(200, 161, 101, 0.35)" }
  },
  "v-steel-mix-m721": {
    icon: Truck,
    tagline: "Heavy-Duty Commercial Radial",
    accent: "#9B6B43",
    badgeStyle: { bg: "rgba(155, 107, 67, 0.12)", text: "#9B6B43", border: "rgba(155, 107, 67, 0.3)" }
  },
  "g611-tipper": {
    icon: Truck,
    tagline: "Heavy Structural Tipper Special",
    accent: "#E8C8CF",
    badgeStyle: { bg: "rgba(232, 200, 207, 0.25)", text: "#8C4A57", border: "rgba(232, 200, 207, 0.5)" }
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
      const matchesCategory =
        activeCategory === "All" || product.vehicleCategory === activeCategory;

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
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#9B6B43] font-bold bg-[#C8A165]/15 px-3.5 py-1 rounded-full border border-[#C8A165]/30 shadow-xs">
          Bridgestone India Tyre Catalog
        </span>
        <h2
          className="text-[#2A2A2A] font-medium tracking-tight text-3xl md:text-5xl mt-4 leading-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Engineered for every <em className="italic text-[#666666] font-normal">Indian road</em>.
        </h2>
        <p className="text-[#666666] text-sm max-w-2xl mx-auto mt-3 font-medium">
          Explore our real-world premium tire catalog. Filter by vehicle category or search attributes dynamically to find the ideal match.
        </p>
      </div>

      {/* Database Search & Filter Panel */}
      <div 
        className="rounded-[24px] border border-[#C4A67A]/30 p-6 mb-8 w-full shadow-[0_10px_30px_rgba(170,145,110,0.12)]"
        style={{
          background: "rgba(255, 250, 245, 0.82)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:max-w-xs flex items-center bg-[#F5EFE6] border border-[#C4A67A]/25 rounded-full px-4 py-2.5 focus-within:border-[#C8A165] focus-within:ring-2 focus-within:ring-[#C8A165]/15 transition-all">
            <Search size={16} className="text-[#8C8C8C] mr-2" />
            <input
              type="text"
              placeholder="Search specs, vehicles, rims..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-[#2A2A2A] border-none outline-none w-full placeholder:text-[#8C8C8C] focus:outline-none font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[#8C8C8C] hover:text-[#2A2A2A] text-xs px-1 cursor-pointer"
              >
                ×
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-[#F5EFE6] p-1 rounded-full border border-[#C4A67A]/25 w-full md:w-auto justify-center">
            {(["All", "Car", "SUV", "Truck/Bus"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#E60012] text-white shadow-sm"
                    : "text-[#666666] hover:text-[#2A2A2A] hover:bg-white/80"
                }`}
              >
                {cat === "All" ? "Show All" : cat === "Truck/Bus" ? "Truck & Bus" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Small search stats */}
        <div className="mt-4 flex items-center justify-between text-[10px] text-[#8C8C8C] uppercase tracking-wider px-2 font-bold">
          <div className="flex items-center gap-1">
            <SlidersHorizontal size={10} />
            Showing {filteredProducts.length} of {PRODUCT_CATALOG.length} tyres
          </div>
          {searchQuery && (
            <div>
              Query: <span className="text-[#E60012] font-bold">{searchQuery}</span>
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
              accent: "#C8A165",
              badgeStyle: { bg: "rgba(200, 161, 101, 0.12)", text: "#9B6B43", border: "rgba(200, 161, 101, 0.3)" }
            };
            const Icon = meta.icon;

            return (
              <div
                key={product.id}
                className="rounded-[20px] border border-[#C4A67A]/28 p-6 relative overflow-hidden shadow-[0_10px_30px_rgba(170,145,110,0.12)] hover:shadow-[0_15px_35px_rgba(170,145,110,0.22)] hover:border-[#C8A165] hover:scale-[1.01] transition-all duration-250 ease-out group flex flex-col justify-between h-full"
                style={{
                  background: "rgba(255, 250, 245, 0.82)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                }}
              >
                {/* Subtle soft gold ambient blur glow spot */}
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-tr from-[#E8C8CF]/30 to-[#C8A165]/20 blur-[50px] rounded-full group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl p-2.5 border border-[#C4A67A]/30 bg-[#F5EFE6] transition-colors duration-300">
                        <Icon
                          size={18}
                          style={{
                            color: meta.accent,
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl text-[#2A2A2A] font-bold tracking-tight">
                          {product.name}
                        </h3>
                        <span className="text-[10px] uppercase tracking-widest text-[#9B6B43] block mt-0.5 font-bold">
                          {product.subSegment}
                        </span>
                      </div>
                    </div>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full border transition-all duration-300"
                      style={{
                        backgroundColor: "rgba(245, 239, 230, 0.9)",
                        borderColor: "rgba(196, 166, 122, 0.35)",
                        color: "#2A2A2A",
                      }}
                    >
                      {product.price}
                    </span>
                  </div>

                  {/* Taglines and Target Vehicles */}
                  <div className="mb-4 relative z-10">
                    <span
                      className="text-[10px] uppercase tracking-wider font-extrabold inline-block px-2.5 py-0.5 rounded-full mb-2"
                      style={{
                        backgroundColor: meta.badgeStyle.bg,
                        color: meta.badgeStyle.text,
                        border: `1px solid ${meta.badgeStyle.border}`,
                      }}
                    >
                      {meta.tagline}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.vehicleTypes.map((vehicle) => (
                        <span
                          key={vehicle}
                          className="bg-[#F5EFE6] text-[9px] text-[#666666] px-2.5 py-0.5 rounded-full border border-[#C4A67A]/20 font-medium"
                        >
                          {vehicle}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#666666] font-normal leading-relaxed mb-5 relative z-10">
                    {product.description}
                  </p>

                  {/* Key Features Bullet List */}
                  <div className="mb-5 space-y-1.5 border-t border-[#C4A67A]/20 pt-3 relative z-10">
                    <span className="text-[9px] uppercase tracking-widest text-[#8C8C8C] font-bold block mb-2">
                      Key Highlights
                    </span>
                    {product.keyFeatures.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#666666] font-medium">
                        <span className="mt-1 font-bold" style={{ color: meta.accent }}>
                          •
                        </span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Ideal Terrain */}
                  <div className="mb-5 bg-[#F5EFE6]/70 rounded-2xl p-3 border border-[#C4A67A]/25 relative z-10">
                    <span className="text-[8px] uppercase tracking-widest text-[#8C8C8C] font-bold block mb-1">
                      Ideal Topography
                    </span>
                    <span className="text-xs text-[#2A2A2A] font-semibold leading-snug block">
                      {product.terrain}
                    </span>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 border-t border-[#C4A67A]/20 pt-4 mt-auto relative z-10">
                  <div className="bg-[#F5EFE6]/70 border border-[#C4A67A]/25 rounded-xl px-3 py-1.5">
                    <div className="text-[8px] uppercase tracking-wider text-[#8C8C8C] font-bold mb-0.5">
                      Rim Range
                    </div>
                    <div className="text-[#2A2A2A] text-xs font-bold truncate">{product.rimSizes}</div>
                  </div>
                  {Object.entries(product.specs).slice(0, 3).map(([key, val]) => (
                    <div
                      key={key}
                      className="bg-[#F5EFE6]/70 border border-[#C4A67A]/25 rounded-xl px-3 py-1.5"
                    >
                      <div className="text-[8px] uppercase tracking-wider text-[#8C8C8C] font-bold mb-0.5">
                        {key.replace(/([A-Z])/g, " $1")}
                      </div>
                      <div className="text-[#2A2A2A] text-xs font-bold truncate">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-[#E9E1D6] rounded-3xl p-12 text-center max-w-xl mx-auto my-12 shadow-sm">
          <Compass size={32} className="mx-auto text-[#8A8A8A] mb-3" />
          <h3 className="text-[#222222] font-bold text-lg">No matching tyres found</h3>
          <p className="text-[#666666] text-xs mt-1">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
            }}
            className="mt-4 text-xs text-[#E60012] font-bold hover:underline"
          >
            Clear Search Filters
          </button>
        </div>
      )}

      {/* Tubeless vs Tube Comparison Clinic Table */}
      <div className="w-full max-w-[92vw] mx-auto bg-white border border-[#E9E1D6] rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-widest text-[#E60012] font-bold bg-[#E60012]/10 px-3 py-1 rounded-full border border-[#E60012]/15">
            Technical Knowledge Clinic
          </span>
          <h3 className="text-[#222222] font-bold tracking-tight text-2xl mt-3">
            Tubeless vs Tube-Type Tyres: Why Upgrading Matters
          </h3>
          <p className="text-[#666666] text-xs max-w-xl mx-auto mt-1 font-medium">
            Understand the safety, thermal efficiency, and structural advantages of modern Bridgestone tubeless radials.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E9E1D6] bg-[#F5F1EB]">
                <th className="py-3 px-4 text-[#222222] font-bold uppercase tracking-wider text-[10px]">Technical Dimension</th>
                <th className="py-3 px-4 text-[#E60012] font-bold uppercase tracking-wider text-[10px]">Bridgestone Tubeless Radial</th>
                <th className="py-3 px-4 text-[#666666] font-bold uppercase tracking-wider text-[10px]">Legacy Tube-Type Assembly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E1D6]">
              {CLINIC_DATA.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F5F1EB]/50 transition-colors">
                  <td className="py-3 px-4 text-[#222222] font-bold">{row.feature}</td>
                  <td className="py-3 px-4 text-[#222222] font-medium">
                    <span className="inline-flex items-center gap-1.5 text-[#E60012]">
                      <CheckCircle2 size={12} />
                      {row.tubeless}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#666666]">{row.tube}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
