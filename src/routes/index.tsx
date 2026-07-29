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

// 2. Premium 3D Tyre Container with Value Labels & Orbital Rings
interface Tyre3DContainerProps {
  TyreComponent: React.ComponentType | null;
  scrollY: number;
}

// Bridgestone core values — positioned snugly around the tyre with golden-brown-pink palette
const BRAND_VALUES = [
  {
    label: "TRUST",
    color: "#E60012",
    cardStyle: { top: "2%", left: "-12%" } as React.CSSProperties,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
  },
  {
    label: "INTEGRITY",
    color: "#C9A35D",
    cardStyle: { top: "18%", right: "-14%" } as React.CSSProperties,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M12 3 2 7l10 4 10-4-10-4z"/>
        <path d="m2 17 10 4 10-4"/>
        <path d="m2 12 10 4 10-4"/>
      </svg>
    ),
  },
  {
    label: "TRACE",
    color: "#9C6B3F",
    cardStyle: { top: "48%", left: "-18%" } as React.CSSProperties,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      </svg>
    ),
  },
  {
    label: "QUALITY",
    color: "#C9A35D",
    cardStyle: { top: "62%", right: "-12%" } as React.CSSProperties,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
  {
    label: "TEAMWORK",
    color: "#D4838F",
    cardStyle: { bottom: "-2%", left: "22%" } as React.CSSProperties,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

const Tyre3DContainer = React.memo(function Tyre3DContainer({
  TyreComponent,
  scrollY,
}: Tyre3DContainerProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const tireOpacity = Math.max(0, 1 - scrollY / 300);
  const tireScale = Math.max(0.68, 1 - (scrollY / 300) * 0.32);

  return (
    <section
      className="absolute bottom-[1%] right-[3%] z-20 w-[20%] h-[30%] min-w-[210px] min-h-[230px] flex flex-col items-center justify-center pointer-events-auto"
      style={{
        opacity: tireOpacity,
        transform: `scale(${tireScale})`,
        pointerEvents: tireOpacity > 0.1 ? "auto" : "none",
        transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
      }}
    >
      {/* ─── 3D Perspective Orbital Rings ─── */}
      <div
        className="absolute inset-[5%] rounded-full pointer-events-none"
        style={{
          border: "1.5px solid rgba(230,0,18,0.3)",
          transform: "perspective(500px) rotateX(68deg) rotateZ(-15deg)",
          boxShadow: "0 0 20px rgba(230,0,18,0.12)",
        }}
      />
      <div
        className="absolute inset-[10%] rounded-full pointer-events-none"
        style={{
          border: "1.5px solid rgba(201,163,93,0.35)",
          transform: "perspective(500px) rotateX(65deg) rotateZ(12deg)",
          boxShadow: "0 0 16px rgba(201,163,93,0.15)",
        }}
      />
      <div
        className="absolute inset-[0%] rounded-full pointer-events-none"
        style={{
          border: "1px solid rgba(156,107,63,0.3)",
          transform: "perspective(500px) rotateX(72deg) rotateZ(28deg)",
          boxShadow: "0 0 14px rgba(156,107,63,0.12)",
        }}
      />
      <div
        className="absolute inset-[14%] rounded-full pointer-events-none"
        style={{
          border: "1px solid rgba(244,215,217,0.4)",
          transform: "perspective(500px) rotateX(60deg) rotateZ(-8deg)",
          boxShadow: "0 0 12px rgba(244,215,217,0.15)",
        }}
      />

      {/* ─── Core Soft Glow ─── */}
      <div className="absolute inset-[15%] rounded-full bg-gradient-to-tr from-[#C9A35D]/15 via-transparent to-[#F4D7D9]/15 blur-[45px] pointer-events-none" />

      {/* ─── Curved SVG Connector Lines ─── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-15"
        viewBox="0 0 380 400"
      >
        <defs>
          <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path d="M 65 30 Q 110 30 145 65" stroke="#E60012" strokeWidth="1.5" fill="none" opacity="0.75" filter="url(#glow-line)" />
        <path d="M 315 85 Q 275 90 240 120" stroke="#C9A35D" strokeWidth="1.5" fill="none" opacity="0.75" filter="url(#glow-line)" />
        <path d="M 45 190 Q 100 190 140 190" stroke="#9C6B3F" strokeWidth="1.5" fill="none" opacity="0.75" filter="url(#glow-line)" />
        <path d="M 325 245 Q 275 245 235 220" stroke="#C9A35D" strokeWidth="1.5" fill="none" opacity="0.75" filter="url(#glow-line)" />
        <path d="M 190 355 Q 190 315 190 270" stroke="#D4838F" strokeWidth="1.5" fill="none" opacity="0.75" filter="url(#glow-line)" />
      </svg>

      {/* ─── Corporate Value Badge Cards with Imperial Blue Background ─── */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {BRAND_VALUES.map((val, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={val.label}
              className="absolute pointer-events-auto"
              style={val.cardStyle}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Glassmorphism label card with Imperial Blue Background */}
              <div
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 border cursor-pointer select-none whitespace-nowrap shadow-md"
                style={{
                  background: "rgba(0, 35, 102, 0.92)", // Imperial Blue BG
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  borderColor: isHovered ? "#C8A165" : "rgba(200, 161, 101, 0.4)",
                  boxShadow: isHovered
                    ? `0 0 20px rgba(0, 35, 102, 0.6), 0 4px 16px rgba(0,0,0,0.3)`
                    : `0 2px 10px rgba(0, 35, 102, 0.25)`,
                  transform: `scale(${isHovered ? 1.08 : 1})`,
                  transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <span
                  className="flex items-center justify-center rounded p-1"
                  style={{ color: "#FFFFFF", background: "rgba(255, 255, 255, 0.15)" }}
                >
                  {val.icon}
                </span>
                <span
                  className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white"
                >
                  {val.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── 3D Tyre Canvas ─── */}
      <div className="w-full h-full z-10 flex items-center justify-center">
        {TyreComponent ? (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-[#E60012]" size={32} />
              </div>
            }
          >
            <TyreComponent />
          </Suspense>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-[#E60012]" size={32} />
          </div>
        )}
      </div>
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
          className="relative flex items-center"
        >
          <div className="relative w-full flex items-center bg-[rgba(255,250,245,0.88)] backdrop-blur-xl border border-[#C4A67A]/30 rounded-2xl shadow-[0_10px_30px_rgba(170,145,110,0.12)] focus-within:border-[#C8A165] focus-within:ring-2 focus-within:ring-[#C8A165]/20 transition-all duration-200">
            <Search className="absolute left-4 text-[#9B6B43]" size={18} />
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search vehicle model (e.g. Creta, Fortuner, Nexon EV)..."
              className="w-full pl-11 pr-24 py-3.5 bg-transparent border-none outline-none text-sm text-[#2A2A2A] placeholder:text-[#8C8C8C] font-semibold"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-[#E60012] hover:bg-[#C8A165] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 shadow-xs cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {showDropdown && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-2xl border border-[#C4A67A]/30 rounded-2xl shadow-[0_12px_40px_rgba(170,145,110,0.2)] overflow-hidden z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#8C8C8C] font-bold">
              Suggested Vehicles
            </div>
            {filteredSuggestions.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => handleSelect(item.name)}
                className="w-full text-left px-3 py-2.5 hover:bg-[#F5EFE6] rounded-xl transition-colors flex items-center justify-between text-xs text-[#2A2A2A] cursor-pointer font-semibold"
              >
                <span className="font-bold">{item.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#9B6B43] font-extrabold bg-[#9B6B43]/15 px-2 py-0.5 rounded border border-[#9B6B43]/20">
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
    let rafId: number | null = null;
    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
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

  const handleCategoryNavigation = (category: string, url: string) => {
    console.log(`[Analytics] Category Navigation Clicked - Category: ${category}, Target URL: ${url}`);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Intersection Observer single-trigger scroll reveal engine
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const targets = document.querySelectorAll(".scroll-reveal");
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [wizardOpen]);

  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#1C1917] overflow-x-hidden relative font-sans selection:bg-[#E60012] selection:text-white flex flex-col">
      {/* Ambient Luxury Warm Radial Mesh Spotlight */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(1200px_circle_at_50%_0%,rgba(201,163,93,0.08),transparent_60%)]" />
      
      {/* Bridgestone Corporate Navigation Header */}
      <BridgestoneNav />

      {/* 1. IMMERSIVE HERO SHOWCASE WRAPPER */}
      <div className="fixed inset-0 w-full h-full z-0 bg-[#FCFAF6] overflow-hidden pointer-events-none">
        <video 
          src="/hero-background.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover mix-blend-normal opacity-90 filter-none"
        />
        
        {/* Subtle Contrast Light Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/50 pointer-events-none" />

        {/* 2. 3D INTERACTIVE TIRE */}
        <Tyre3DContainer TyreComponent={TyreComponent} scrollY={scrollY} />
      </div>

      {/* Scrolling Hero Header Area */}
      <div className="relative w-full z-10 pointer-events-none select-none">
        <div className="h-[85vh] flex flex-col justify-center items-center px-6 md:px-12 lg:px-16 text-center pt-24 relative">
          <span className="text-xs uppercase tracking-[0.25em] text-[#E60012] font-bold mb-2">
            Bridgestone Solutions For Your Journey
          </span>
          <h1 className="font-heading text-fluid-h1 font-bold text-[#222222] tracking-tight leading-[1.1]">
            Engineered to <span className="italic font-light text-[#444444]">control</span> the elements.
          </h1>
          <p className="text-[#666666] font-sans text-fluid-small leading-relaxed max-w-xl mx-auto mt-3 hidden sm:block font-medium">
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
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#8A8A8A] group-hover:text-[#222222] transition-colors font-bold">
              Scroll Explore
            </span>
            <div className="w-5 h-9 rounded-full border border-[#E9E1D6] p-1 flex justify-center group-hover:border-[#C9A35D] transition-all duration-300 bg-white/80 backdrop-blur">
              <div className="w-1.5 h-1.5 bg-[#E60012] rounded-full animate-bounce" />
            </div>
          </button>
        </div>
      </div>

      {/* 3. LIGHT LUXURY PEARL WHITE CONTENT DRAWER WITH TRANSLUCENT GLASS */}
      <main 
        className="relative w-full min-h-screen bg-[#FCFAF6]/70 backdrop-blur-2xl text-[#222222] z-10 rounded-t-[48px] border-t border-[#E9E1D6] shadow-[0_-20px_50px_rgba(0,0,0,0.06)] px-6 md:px-16 py-20 mt-[85vh] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu will-change-transform"
        style={{ backfaceVisibility: "hidden" }}
      >
        
        {/* AI Vehicle Search */}
        <section className="max-w-2xl w-full mx-auto space-y-4 mb-16">
          <VehicleSearchForm initialValue={vehicle} onSearchSubmit={handleSearchSubmit} />

          <div className="flex justify-center relative z-20">
            <button
              type="button"
              onClick={() => setWizardOpen((v) => !v)}
              aria-expanded={wizardOpen}
              aria-label="Toggle Live Recommendation Dashboard"
              className="rounded-full px-8 py-3 text-xs text-[#2A2A2A] bg-[rgba(255,250,245,0.92)] hover:bg-white tracking-widest uppercase font-extrabold text-center mx-auto block max-w-sm mt-4 border border-[#C4A67A]/35 hover:border-[#C8A165] shadow-[0_4px_16px_rgba(170,145,110,0.12)] hover:shadow-[0_8px_24px_rgba(170,145,110,0.2)] hover:scale-[1.01] transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#E60012] focus-visible:outline-none"
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

        {/* AUTOMOTIVE SHOWCASE LAYOUT (LUXURY PEARL WHITE CARDS) */}
        <section className="w-full mt-20 border-t border-[#E9E1D6] pt-16 scroll-reveal">
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase tracking-widest text-[#E60012] font-bold bg-[#E60012]/10 px-3.5 py-1.5 rounded-full border border-[#E60012]/20">
              Showcase & Services
            </span>
            <h2 className="text-[#1C1917] font-bold tracking-tight text-3xl md:text-4xl mt-3 leading-tight">
              Tailored Solutions for <em className="italic text-[#666666] font-normal">Every Journey</em>.
            </h2>
            <p className="text-[#666666] text-xs md:text-sm max-w-xl mx-auto mt-2 font-medium">
              From personal luxury sedans to enterprise truck fleets and emergency assistance.
            </p>
          </div>

          <div className="w-full max-w-[94vw] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mt-12">
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
                className="product-card-3d rounded-[20px] overflow-hidden border border-[#E9E1D6] hover:border-[#C9A35D]/60 flex flex-col justify-between group relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60012] select-none"
                style={{
                  background: "rgba(255, 255, 255, 0.94)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <div className="shine-effect" />
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#C9A35D]/15 blur-[50px] rounded-full group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
                <div className="w-full h-52 bg-[#FAF7F2] relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.alt}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.05]"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between relative z-10">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[#2A2A2A] mb-2 group-hover:text-[#9B6B43] transition-colors">{category.title}</h3>
                    <p className="text-[#666666] text-xs leading-relaxed font-normal">
                      {category.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    tabIndex={-1}
                    className="mt-4 pt-4 border-t border-[#C4A67A]/20 flex items-center justify-between text-xs font-bold text-[#E60012] group-hover:text-[#C8A165] w-full text-left bg-transparent cursor-pointer transition-colors"
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
