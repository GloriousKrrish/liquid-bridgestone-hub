import { useState, useMemo, useRef, useCallback, memo, useDeferredValue } from "react";
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
  Compass,
  ArrowRight,
  Sparkle
} from "lucide-react";
import { PRODUCT_CATALOG, type Product } from "@/lib/bridgestone-data";
import { PremiumTyrePreview } from "./PremiumTyrePreview";

const PRODUCT_METADATA: Record<
  string,
  {
    icon: any;
    tagline: string;
    accent: string;
    image: string;
    badgeStyle: { bg: string; text: string; border: string };
  }
> = {
  "turanza-6i": {
    icon: Gauge,
    tagline: "Premium Comfort & Quietude",
    accent: "#C9A35D",
    image: "/passenger_car_showcase.png",
    badgeStyle: { bg: "rgba(201, 163, 93, 0.12)", text: "#9B6B43", border: "rgba(201, 163, 93, 0.3)" }
  },
  "dueler-at002": {
    icon: Mountain,
    tagline: "All-Terrain Mastery",
    accent: "#9B6B43",
    image: "/all_terrain_adventure.png",
    badgeStyle: { bg: "rgba(155, 107, 67, 0.12)", text: "#9B6B43", border: "rgba(155, 107, 67, 0.3)" }
  },
  "sturdo": {
    icon: Shield,
    tagline: "Reinforced Durability Special",
    accent: "#E8B4B8",
    image: "/passenger_car_showcase.png",
    badgeStyle: { bg: "rgba(232, 180, 184, 0.25)", text: "#8C4A57", border: "rgba(232, 180, 184, 0.5)" }
  },
  "ecopia-ep150": {
    icon: Zap,
    tagline: "Eco-Friendly Efficiency",
    accent: "#5B8C5A",
    image: "/passenger_car_showcase.png",
    badgeStyle: { bg: "rgba(91, 140, 90, 0.12)", text: "#3B663A", border: "rgba(91, 140, 90, 0.3)" }
  },
  "alenza-001": {
    icon: Award,
    tagline: "Flagship Luxury SUV",
    accent: "#C9A35D",
    image: "/all_terrain_adventure.png",
    badgeStyle: { bg: "rgba(201, 163, 93, 0.15)", text: "#9B6B43", border: "rgba(201, 163, 93, 0.35)" }
  },
  "v-steel-mix-m721": {
    icon: Truck,
    tagline: "Heavy-Duty Commercial Radial",
    accent: "#9B6B43",
    image: "/wholesale_logistics_fleet.png",
    badgeStyle: { bg: "rgba(155, 107, 67, 0.12)", text: "#9B6B43", border: "rgba(155, 107, 67, 0.3)" }
  },
  "g611-tipper": {
    icon: Truck,
    tagline: "Heavy Structural Tipper Special",
    accent: "#E8B4B8",
    image: "/wholesale_logistics_fleet.png",
    badgeStyle: { bg: "rgba(232, 180, 184, 0.25)", text: "#8C4A57", border: "rgba(232, 180, 184, 0.5)" }
  }
};

const CLINIC_DATA = [
  { feature: "Structural Safety", tubeless: "Superior — no inner tube to fail", tube: "Moderate — tube rupture risk" },
  { feature: "Fuel Efficiency", tubeless: "Higher — lower rolling resistance", tube: "Standard efficiency" },
  { feature: "Puncture Convenience", tubeless: "Slow deflation, driveable", tube: "Instant flat, immediate stop" },
  { feature: "Heat Dissipation", tubeless: "Excellent — direct rim contact", tube: "Poor — trapped heat in tube" },
  { feature: "Weight", tubeless: "Lighter — no tube weight", tube: "Heavier assembly" },
];

/* 3D Tilt Card Component */
const LuxuryProductCard = memo(({ product }: { product: Product }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const meta = PRODUCT_METADATA[product.id] || {
    icon: Award,
    tagline: "Bridgestone Premium Radial",
    accent: "#C9A35D",
    image: "/passenger_car_showcase.png",
    badgeStyle: { bg: "rgba(201, 163, 93, 0.12)", text: "#9B6B43", border: "rgba(201, 163, 93, 0.3)" }
  };
  const Icon = meta.icon;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation angles (max 6deg)
    const rotateX = ((y / rect.height) - 0.5) * -12;
    const rotateY = ((x / rect.width) - 0.5) * 12;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      cardRef.current.style.setProperty("--mouse-x", `${x}px`);
      cardRef.current.style.setProperty("--mouse-y", `${y}px`);
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(0, -6px, 0)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)`;
  }, []);

  return (
    <div className="product-card-container h-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="product-card-3d p-6 relative overflow-hidden group flex flex-col justify-between h-full border border-[#E9E1D6] hover:border-[#C9A35D]/60 rounded-[20px]"
        style={{
          background: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Sweep Shine Effect */}
        <div className="shine-effect" />

        {/* Ambient Gold/Ivory Soft Glow Spot */}
        <div className="absolute -right-16 -top-16 w-36 h-36 bg-gradient-to-tr from-[#E8B4B8]/20 via-[#C9A35D]/15 to-transparent blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

        <div>
          {/* Card Header & Product Image Float */}
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl p-2.5 border border-[#E9E1D6] bg-[#FAF7F2] group-hover:bg-[#F5F1EB] group-hover:border-[#C9A35D]/40 transition-colors duration-300 shadow-xs">
                <Icon size={20} style={{ color: meta.accent }} />
              </div>
              <div>
                <h3 className="text-xl text-[#1C1917] font-bold tracking-tight group-hover:text-[#E60012] transition-colors duration-300">
                  {product.name}
                </h3>
                <span className="text-[10px] uppercase tracking-widest text-[#9B6B43] block mt-0.5 font-bold">
                  {product.subSegment}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full border border-[#E9E1D6] bg-[#FAF7F2] text-[#1C1917] shadow-xs group-hover:border-[#C9A35D]/40 transition-all">
              {product.price}
            </span>
          </div>

          {/* Floating Premium Animated Tyre Preview */}
          <div className="relative my-4 py-2 flex items-center justify-center">
            <PremiumTyrePreview variant="compact" seriesName={product.name} />
          </div>

          {/* Taglines and Target Vehicles */}
          <div className="mb-4 relative z-10">
            <span
              className="text-[10px] uppercase tracking-wider font-extrabold inline-flex items-center gap-1 px-3 py-1 rounded-full mb-2"
              style={{
                backgroundColor: meta.badgeStyle.bg,
                color: meta.badgeStyle.text,
                border: `1px solid ${meta.badgeStyle.border}`,
              }}
            >
              <Sparkles size={11} />
              {meta.tagline}
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {product.vehicleTypes.map((vehicle) => (
                <span
                  key={vehicle}
                  className="bg-[#FAF7F2] text-[9px] text-[#666666] px-2.5 py-0.5 rounded-full border border-[#E9E1D6] font-medium group-hover:border-[#C9A35D]/30 transition-colors"
                >
                  {vehicle}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-[#555555] font-normal leading-relaxed mb-4 relative z-10">
            {product.description}
          </p>

          {/* Key Features Bullet List */}
          <div className="mb-4 space-y-1.5 border-t border-[#E9E1D6]/80 pt-3 relative z-10">
            <span className="text-[9px] uppercase tracking-widest text-[#8A8A8A] font-bold block mb-2">
              Key Engineering Highlights
            </span>
            {product.keyFeatures.map((feature, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[#444444] font-medium transition-transform group-hover:translate-x-1 duration-200">
                <span className="mt-0.5 font-bold" style={{ color: meta.accent }}>
                  •
                </span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Ideal Terrain */}
          <div className="mb-4 bg-[#FAF7F2]/80 rounded-2xl p-3 border border-[#E9E1D6] relative z-10 group-hover:border-[#C9A35D]/40 transition-colors">
            <span className="text-[8px] uppercase tracking-widest text-[#8A8A8A] font-bold block mb-1">
              Ideal Topography
            </span>
            <span className="text-xs text-[#1C1917] font-semibold leading-snug block">
              {product.terrain}
            </span>
          </div>
        </div>

        {/* Specs Grid & Smooth CTA Button */}
        <div>
          <div className="grid grid-cols-2 gap-2 border-t border-[#E9E1D6]/80 pt-4 relative z-10">
            <div className="bg-[#FAF7F2] border border-[#E9E1D6] rounded-xl px-3 py-1.5">
              <div className="text-[8px] uppercase tracking-wider text-[#8A8A8A] font-bold mb-0.5">
                Rim Range
              </div>
              <div className="text-[#1C1917] text-xs font-bold truncate">{product.rimSizes}</div>
            </div>
            {Object.entries(product.specs).slice(0, 3).map(([key, val]) => (
              <div
                key={key}
                className="bg-[#FAF7F2] border border-[#E9E1D6] rounded-xl px-3 py-1.5"
              >
                <div className="text-[8px] uppercase tracking-wider text-[#8A8A8A] font-bold mb-0.5">
                  {key.replace(/([A-Z])/g, " $1")}
                </div>
                <div className="text-[#1C1917] text-xs font-bold truncate">{val}</div>
              </div>
            ))}
          </div>

          {/* CTA Action Button */}
          <button className="w-full mt-4 py-2.5 rounded-xl bg-[#E60012] text-white text-xs font-bold tracking-wide shadow-md hover:bg-[#C9A35D] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group/btn">
            <span>Explore Full Specifications</span>
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
});

export function ProductGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [activeCategory, setActiveCategory] = useState<"All" | "Car" | "SUV" | "Truck/Bus">("All");

  const filteredProducts = useMemo(() => {
    return PRODUCT_CATALOG.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.vehicleCategory === activeCategory;

      const searchLower = deferredSearchQuery.toLowerCase();
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
  }, [deferredSearchQuery, activeCategory]);

  return (
    <section className="w-full px-0 py-16 relative z-10 scroll-reveal">
      {/* Section Header */}
      <div className="text-center mb-12 animate-in fade-in duration-700">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#9B6B43] font-bold bg-[#C9A35D]/15 px-4 py-1.5 rounded-full border border-[#C9A35D]/30 shadow-xs inline-flex items-center gap-1.5">
          <Sparkle size={12} className="text-[#C9A35D]" />
          Bridgestone Premium Automotive Catalog
        </span>
        <h2
          className="text-[#1C1917] font-medium tracking-tight text-3xl md:text-5xl mt-4 leading-tight"
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
        className="rounded-[24px] border border-[#E9E1D6] p-6 mb-10 w-full shadow-[0_12px_36px_rgba(0,0,0,0.04)]"
        style={{
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md flex items-center bg-[#FAF7F2] border border-[#E9E1D6] rounded-full px-4 py-3 focus-within:border-[#C9A35D] focus-within:ring-2 focus-within:ring-[#C9A35D]/20 transition-all shadow-inner">
            <Search size={18} className="text-[#8A8A8A] mr-2.5" />
            <input
              type="text"
              placeholder="Search by model, vehicle (e.g. Creta, Fortuner), or rim size..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-[#1C1917] border-none outline-none w-full placeholder:text-[#8A8A8A] focus:outline-none font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[#8A8A8A] hover:text-[#1C1917] text-xs px-2 cursor-pointer font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-[#FAF7F2] p-1.5 rounded-full border border-[#E9E1D6] w-full md:w-auto justify-center shadow-inner">
            {(["All", "Car", "SUV", "Truck/Bus"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#E60012] text-white shadow-md scale-102"
                    : "text-[#666666] hover:text-[#1C1917] hover:bg-white/80"
                }`}
              >
                {cat === "All" ? "Show All" : cat === "Truck/Bus" ? "Truck & Bus" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Small search stats */}
        <div className="mt-4 flex items-center justify-between text-[10px] text-[#8A8A8A] uppercase tracking-wider px-2 font-bold">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={11} className="text-[#C9A35D]" />
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
        <div className="w-full max-w-[94vw] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {filteredProducts.map((product) => (
            <LuxuryProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#E9E1D6] rounded-3xl p-12 text-center max-w-xl mx-auto my-12 shadow-sm">
          <Compass size={36} className="mx-auto text-[#C9A35D] mb-3 animate-bounce" />
          <h3 className="text-[#1C1917] font-bold text-lg">No matching tyres found</h3>
          <p className="text-[#666666] text-xs mt-1">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
            }}
            className="mt-4 px-6 py-2 rounded-full bg-[#E60012] text-white text-xs font-bold hover:bg-[#C9A35D] transition-colors"
          >
            Clear Search Filters
          </button>
        </div>
      )}

      {/* Tubeless vs Tube Comparison Clinic Table */}
      <div className="w-full max-w-[94vw] mx-auto bg-white border border-[#E9E1D6] rounded-[24px] p-8 shadow-lg">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-widest text-[#E60012] font-bold bg-[#E60012]/10 px-3.5 py-1.5 rounded-full border border-[#E60012]/20">
            Technical Knowledge Clinic
          </span>
          <h3 className="text-[#1C1917] font-bold tracking-tight text-2xl md:text-3xl mt-3">
            Tubeless vs Tube-Type Tyres: Why Upgrading Matters
          </h3>
          <p className="text-[#666666] text-xs max-w-xl mx-auto mt-1.5 font-medium">
            Understand the safety, thermal efficiency, and structural advantages of modern Bridgestone tubeless radials.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E9E1D6] bg-[#FAF7F2]">
                <th className="py-3.5 px-4 text-[#1C1917] font-bold uppercase tracking-wider text-[10px]">Technical Dimension</th>
                <th className="py-3.5 px-4 text-[#E60012] font-bold uppercase tracking-wider text-[10px]">Bridgestone Tubeless Radial</th>
                <th className="py-3.5 px-4 text-[#666666] font-bold uppercase tracking-wider text-[10px]">Legacy Tube-Type Assembly</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E1D6]">
              {CLINIC_DATA.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-4 text-[#1C1917] font-bold">{row.feature}</td>
                  <td className="py-3.5 px-4 text-[#1C1917] font-medium">
                    <span className="inline-flex items-center gap-1.5 text-[#E60012] font-semibold">
                      <CheckCircle2 size={13} />
                      {row.tubeless}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#666666]">{row.tube}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
