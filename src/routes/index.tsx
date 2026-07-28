import { createFileRoute } from "@tanstack/react-router";
import React, { Suspense, useEffect, useState, useMemo } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { BridgestoneNav } from "@/components/BridgestoneNav";
import { BridgestoneFooter } from "@/components/BridgestoneFooter";
import { SmartSelectorWizard } from "@/components/SmartSelectorWizard";
import { ProductGrid } from "@/components/ProductGrid";
import { z } from "zod";
import { getAllVehicles } from "@/lib/api/vehicle.functions";
import type { VehicleRecord } from "@/lib/vehicle-db";

const indexSearchSchema = z.object({
  vehicleId: z.string().optional(),
  year: z.string().optional(),
  variant: z.string().optional(),
  rimSize: z.string().optional(),
  terrain: z.enum(["Urban", "Highway", "Off-Road"]).optional(),
  roadCondition: z.enum(["Smooth", "Broken", "Rough"]).optional(),
  loadRequirement: z.enum(["Standard", "Heavy"]).optional(),
  priority: z.enum(["Comfort", "Toughness", "Efficiency", "Sport", "Commercial"]).optional(),
  step: z.string().optional(),
  vehicle: z.string().optional(),
  make: z.string().optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: (search) => indexSearchSchema.parse(search),
  component: Index,
});

// 2. Decoupled and Isolated 3D Canvas Container Wrapper
interface Tyre3DContainerProps {
  TyreComponent: React.ComponentType | null;
  scrollY: number;
}

const Tyre3DContainer = React.memo(function Tyre3DContainer({
  TyreComponent,
  scrollY,
}: Tyre3DContainerProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const tireOpacity = Math.max(0, 1 - scrollY / 300);
  const tireScale = Math.max(0.68, 1 - (scrollY / 300) * 0.32);

  return (
    <section 
      className="absolute bottom-[2%] right-[4.5%] z-20 w-[22%] h-[35%] flex flex-col items-center justify-center pointer-events-auto"
      style={{
        opacity: tireOpacity,
        transform: `scale(${tireScale}) translate3d(${mousePos.x * 0.15}px, ${mousePos.y * 0.15}px, 0)`,
        pointerEvents: tireOpacity > 0.1 ? "auto" : "none",
        transition: "opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1), transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Internal core ring highlights */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D71920]/10 via-[#D71920]/5 to-transparent blur-[70px] pointer-events-none transition-transform duration-300 ease-out"
        style={{ transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)` }}
      />

      {/* 3D Tire Interactive Floating Projection Indicators */}
      {/* 1. Structural Safety Indicator */}
      <div className="absolute -left-4 top-[15%] z-30 flex items-center gap-2">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CC0000]"></span>
        </div>
        <div className="bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-lg px-2 py-1 shadow-xl flex flex-col text-left">
          <span className="text-[7px] uppercase tracking-wider text-[#D71920] font-bold">Indicator 01</span>
          <span className="text-[9px] text-white font-bold whitespace-nowrap">Steel Belt</span>
        </div>
      </div>

      {/* 2. Wet-Grip Performance Indicator */}
      <div className="absolute -right-4 top-[40%] z-30 flex items-center gap-2">
        <div className="bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-lg px-2 py-1 shadow-xl flex flex-col text-right order-first">
          <span className="text-[7px] uppercase tracking-wider text-[#B3B3B3] font-bold">Indicator 02</span>
          <span className="text-[9px] text-white font-bold whitespace-nowrap">Hydro-Channels</span>
        </div>
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/40 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B3B3B3]"></span>
        </div>
      </div>

      {/* 3. Nanotech Compound Indicator */}
      <div className="absolute left-0 bottom-[15%] z-30 flex items-center gap-2">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD100] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD100]"></span>
        </div>
        <div className="bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-lg px-2 py-1 shadow-xl flex flex-col text-left">
          <span className="text-[7px] uppercase tracking-wider text-[#FFD100] font-bold">Indicator 03</span>
          <span className="text-[9px] text-white font-bold whitespace-nowrap">Silica Comp.</span>
        </div>
      </div>

      {TyreComponent ? (
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-[#D71920]" size={32} />
            </div>
          }
        >
          <TyreComponent />
        </Suspense>
      ) : (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin text-[#D71920]" size={32} />
        </div>
      )}
    </section>
  );
});

// 3. Controlled Search Input Form using dynamic database list
interface VehicleSearchFormProps {
  initialValue: string;
  onSearchSubmit: (val: string) => void;
}

const VehicleSearchForm = React.memo(function VehicleSearchForm({
  initialValue,
  onSearchSubmit,
}: VehicleSearchFormProps) {
  const [value, setValue] = useState(initialValue);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allVehicles, setAllVehicles] = useState<VehicleRecord[]>([]);

  // Load database list for suggestions
  useEffect(() => {
    getAllVehicles().then((records) => {
      setAllVehicles(records);
    }).catch(e => console.error("[VehicleSearchForm] Load error:", e));
  }, []);

  // Sync value if initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const filteredSuggestions = useMemo(() => {
    const defaultSuggestions = [
      { name: "Tesla Model Y", category: "Electric Vehicle" },
      { name: "Hyundai Creta", category: "SUV" },
      { name: "Toyota Fortuner", category: "SUV" },
      { name: "Tata Nexon EV", category: "Electric Vehicle" },
      { name: "Mahindra Thar", category: "SUV" }
    ];

    if (!value.trim()) return defaultSuggestions;
    const query = value.toLowerCase();
    const queryParts = query.split(/\s+/);

    return allVehicles
      .filter(v => {
        const fullName = `${v.manufacturer} ${v.model}`.toLowerCase();
        return queryParts.every(part => fullName.includes(part));
      })
      .map(v => ({
        name: `${v.manufacturer} ${v.model}`,
        category: v.vehicle_type
      }))
      .filter((v, index, self) => self.findIndex(t => t.name === v.name) === index)
      .slice(0, 6);
  }, [value, allVehicles]);

  const handleSelect = (name: string) => {
    setValue(name);
    setShowDropdown(false);
    onSearchSubmit(name);
  };

  return (
    <div className="relative w-full z-40">
      {showDropdown && (
        <div 
          className="fixed inset-0 z-30 bg-transparent cursor-default pointer-events-auto"
          onClick={() => setShowDropdown(false)}
        />
      )}

      <div className="relative z-40 w-full max-w-xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowDropdown(false);
            onSearchSubmit(value);
          }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full pl-6 pr-2 py-2 flex items-center gap-3 w-full group focus-within:border-[#D71920]/60 focus-within:shadow-[0_0_25px_rgba(215,25,32,0.15)] transition-all relative z-40 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
        >
          <Search size={18} className="text-slate-400" />
          <input
            value={value}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => {
              setValue(e.target.value);
              setShowDropdown(true);
            }}
            placeholder="Enter vehicle model (e.g., Creta, Fortuner...)"
            className="text-white placeholder:text-white/40 text-sm flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            aria-label="Search tyres"
            className="bg-[#D71920] p-3 rounded-full hover:bg-[#B5141A] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none"
          >
            <ArrowRight size={20} className="text-white" />
          </button>
        </form>

        {showDropdown && filteredSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 w-full z-[100] shadow-[0_16px_48px_rgba(0,0,0,0.4)] bg-[#121212]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 pointer-events-auto divide-y divide-white/5">
            <div className="px-3 py-1.5 text-[9px] uppercase tracking-widest text-white/40 font-bold">
              Select Vehicle Suggestions
            </div>
            {filteredSuggestions.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => handleSelect(item.name)}
                className="w-full text-left px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors flex items-center justify-between text-xs text-white/70 hover:text-white cursor-pointer"
              >
                <span className="font-semibold">{item.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#D71920] font-bold bg-[#D71920]/10 px-2 py-0.5 rounded border border-[#D71920]/10">
                  {item.category}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

// 4. Showcase Categories Configuration
interface ShowcaseCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  url: string;
  buttonText: string;
}

const SHOWCASE_CATEGORIES: ShowcaseCategory[] = [
  {
    id: "passenger-luxury",
    title: "Passenger Luxury",
    description: "Experience ultra-quiet ride comfort and high-speed stability optimized for premium sedans and performance crossovers on sweeping highway corridors.",
    image: "/passenger_car_showcase.png",
    alt: "Passenger Car Showcase",
    url: "https://www.bridgestone.co.in/passenger-tyres",
    buttonText: "Explore Passenger Range"
  },
  {
    id: "wholesale-logistics-fleet",
    title: "Wholesale Logistics Fleet",
    description: "Maximize uptime and load-bearing efficiency with Bridgestone's advanced distribution transport truck radial tyre architecture.",
    image: "/wholesale_logistics_fleet.png",
    alt: "Wholesale Logistics Fleet",
    url: "https://www.bridgestone.co.in/truck-and-bus",
    buttonText: "Calculate Fleet Savings"
  },
  {
    id: "all-terrain-adventure",
    title: "All-Terrain Adventure",
    description: "Command control over severe off-road topography tracks and loose gravel with rugged 4x4 tyre compounding and block structures.",
    image: "/all_terrain_adventure.png",
    alt: "All-Terrain Adventure",
    url: "https://www.bridgestone.co.in/off-the-road",
    buttonText: "View Dueler Series"
  },
  {
    id: "roadside-support",
    title: "Roadside Support",
    description: "Prompt emergency customer support vehicles operating along urban networks to get you back on your journey with zero friction.",
    image: "/roadside_assistance.png",
    alt: "Roadside Support",
    url: "https://www.bridgestone.co.in/our-company/sustainability1",
    buttonText: "Get Immediate Help"
  }
];

// 5. Main Page Component
function Index() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [wizardOpen, setWizardOpen] = useState(true);
  const [TyreComponent, setTyreComponent] = useState<React.ComponentType | null>(null);

  // Parallax scroll coordination state
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load 3D tyre component client side once
  useEffect(() => {
    import("@/components/InteractiveTyre3D").then((mod) => {
      setTyreComponent(() => mod.InteractiveTyre3D);
    });
  }, []);

  // Recover search state from query params
  const vehicle = useMemo(() => {
    return search.vehicleId || search.vehicle || search.make || "";
  }, [search]);

  // Keep wizard open if search parameter is present
  useEffect(() => {
    if (vehicle || search.step) {
      setWizardOpen(true);
    }
  }, [vehicle, search.step]);

  const handleSearchSubmit = (value: string) => {
    const norm = value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    navigate({
      search: (prev) => ({
        ...prev,
        vehicleId: norm,
        vehicle: value.trim(),
        make: undefined,
      }),
      replace: true,
    });
    setWizardOpen(true);
  };

  // Click handler for category navigation (with analytics hooks)
  const handleCategoryNavigation = (category: string, url: string) => {
    console.log(`[Analytics] Category Navigation Clicked - Category: ${category}, Target URL: ${url}`);
    
    // Future integrations can hook into:
    // window.gtag?.('event', 'click', { 'event_category': 'showcase_navigation', 'event_label': category });
    // window.clarity?.('event', 'showcase_navigation_clicked');
    
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white overflow-x-hidden relative font-sans selection:bg-[#D71920] selection:text-white flex flex-col">
      
      {/* Bridgestone Corporate Navigation Header */}
      <BridgestoneNav />

      {/* 1. IMMERSIVE NATIVE ASPECT-RATIO VIDEO & SHOWCASE WRAPPER (z-0 / z-20) */}
      <div className="fixed inset-0 w-full h-full z-0 bg-[#121212] overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="relative aspect-[16/9] w-full max-w-full max-h-full">
          <video 
            src="/hero-background.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover mix-blend-normal opacity-100 filter-none"
          />
          
          {/* Reconstruct background: Seamless Gemini Watermark Removal Patch */}
          <div 
            className="absolute bottom-[11.2%] right-[8.6%] w-[4.2%] h-[6.5%] bg-[#b8bcc4] blur-[5px] rounded-full opacity-95 mix-blend-normal"
            style={{
              boxShadow: '0 0 10px 5px #b8bcc4',
            }}
          />

          {/* 2. THE FLOATING HERO BRIDGING ENGINE (3D INTERACTIVE TIRE FLOATING OVER THE PATCH AREA - z-20) */}
          <Tyre3DContainer TyreComponent={TyreComponent} scrollY={scrollY} />
        </div>
      </div>

      {/* Scrolling Hero Header Area (z-10) */}
      <div className="relative w-full z-10 pointer-events-none select-none">
        <div className="h-[85vh] flex flex-col justify-center items-center px-6 md:px-12 lg:px-16 text-center pt-24 relative">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D71920] font-bold mb-2">
            Bridgestone Solution To Your Journey
          </span>
          <h1 className="font-heading text-fluid-h1 font-bold text-white tracking-tight leading-[1.1]">
            Engineered to <span className="italic font-light text-white/90">control</span> the elements.
          </h1>
          <p className="text-[#B3B3B3] font-sans text-fluid-small leading-relaxed max-w-xl mx-auto mt-3 hidden sm:block">
            India's most advanced tyre intelligence platform — built for monsoon highways, urban grids, and untamed terrain.
          </p>
          
          {/* Subtle scroll down indicator */}
          <button
            type="button"
            onClick={() => {
              document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-2 group cursor-pointer"
            aria-label="Scroll down to explore products"
          >
            <span className="text-[9px] uppercase tracking-[0.25em] text-white/40 group-hover:text-white/80 transition-colors">
              Scroll Explore
            </span>
            <div className="w-5 h-9 rounded-full border border-white/20 p-1 flex justify-center group-hover:border-white/40 transition-all duration-300">
              <div className="w-1.5 h-1.5 bg-[#D71920] rounded-full animate-bounce" />
            </div>
          </button>
        </div>
      </div>

      {/* 3. THE TRANSPARENT SLIDING PREMIUM GLASS CONTENT DRAWER (z-10) */}
      <main 
        className="relative w-full min-h-screen bg-[#121212]/95 backdrop-blur-md text-white z-10 rounded-t-[48px] border-t border-[#2A2A2A] shadow-[0_-30px_60px_rgba(0,0,0,0.5)] px-6 md:px-16 py-20 mt-[85vh] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-transform"
        style={{ backfaceVisibility: "hidden" }}
      >
        
        {/* AI Vehicle Pill Gateway */}
        <section className="max-w-2xl w-full mx-auto space-y-4 mb-16">
          <VehicleSearchForm initialValue={vehicle} onSearchSubmit={handleSearchSubmit} />

          <div className="flex justify-center relative z-20">
            <button
              type="button"
              onClick={() => setWizardOpen((v) => !v)}
              aria-expanded={wizardOpen}
              aria-label="Toggle Live Recommendation Dashboard"
              className="rounded-full px-8 py-3 text-xs text-white bg-[#1A1A1A] hover:bg-[#222222] tracking-widest uppercase font-bold text-center mx-auto block max-w-sm mt-4 border border-[#2A2A2A] shadow transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none"
            >
              {wizardOpen ? "Hide Live Recommendation Dashboard" : "Show Live Recommendation Dashboard"}
            </button>
          </div>
        </section>

        {/* 5-Step Smart Selector Wizard */}
        {wizardOpen && (
          <div className="relative z-10 w-full max-w-[92vw] mx-auto mb-16">
            <SmartSelectorWizard initialVehicle={vehicle} />
          </div>
        )}

        {/* Below-The-Fold Masonry Grids */}
        <ProductGrid />

        {/* AUTOMOTIVE SHOWCASE LAYOUT (PREMIUM IMAGE HOLDERS) */}
        <section className="w-full mt-20 border-t border-white/10 pt-16">
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase tracking-widest text-[#D71920] font-bold bg-[#D71920]/10 px-3 py-1 rounded-full border border-[#D71920]/20">
              Showcase & Services
            </span>
            <h2 className="text-white font-bold tracking-tight text-3xl md:text-4xl mt-3 leading-tight">
              Tailored Solutions for <em className="italic text-slate-300 font-normal">Every Journey</em>.
            </h2>
            <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto mt-2">
              From personal luxury sedans to enterprise truck fleets and emergency assistance.
            </p>
          </div>

          <div className="w-full max-w-[92vw] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mt-12">
            {SHOWCASE_CATEGORIES.map((category) => (
              <div
                key={category.id}
                role="button"
                tabIndex={0}
                onClick={() => handleCategoryNavigation(category.title, category.url)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCategoryNavigation(category.title, category.url);
                  }
                }}
                aria-label={`Explore ${category.title} range`}
                className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-2xl hover:border-[#D71920]/40 transition-all duration-200 flex flex-col justify-between group relative cursor-pointer hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D71920] select-none"
              >
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#D71920]/5 blur-[50px] rounded-full group-hover:scale-110 transition-transform duration-300 pointer-events-none" />
                <div className="w-full h-48 bg-slate-800 relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.alt}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between relative z-10">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-white mb-2">{category.title}</h3>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="mt-4 pt-4 border-t border-[#2A2A2A] flex items-center justify-between text-xs font-bold text-[#D71920] w-full text-left bg-transparent cursor-pointer"
                  >
                    <span>{category.buttonText}</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <BridgestoneFooter />
    </div>
  );
}
