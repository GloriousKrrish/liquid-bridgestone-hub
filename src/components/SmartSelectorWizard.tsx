import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Search,
  Sparkles,
  Store,
  Clock,
  Package,
  Activity,
  Award,
  Shield,
  Zap,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Info,
  Compass,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useModals } from "@/lib/ModalContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useSearch, useNavigate } from "@tanstack/react-router";
import {
  type TyreSKU,
  type Product
} from "@/lib/bridgestone-data";
import { searchVehicle, getRecommendations, getAllVehicles } from "@/lib/api/vehicle.functions";
import type { VehicleRecord } from "@/lib/vehicle-db";

// Type definition for rendering compatibility
interface MappedTyreProfile {
  submodel: string;
  seriesName: string;
  sizeString: string;
  dimensions: {
    width: number;
    aspectRatio: number;
    rimDiameter: number;
  };
  priceINR: number;
  userRating: number;
  confidenceScore: number;
  engineCapacityCC: number;
  reasoning: string;
  displayScore: number;
  product?: Product;
  sku?: TyreSKU;
  explanations?: any;
}

export function SmartSelectorWizard({
  initialVehicle = "",
}: {
  initialVehicle?: string;
}) {
  const { t } = useLanguage();
  const { openBooking } = useModals();

  const searchParams = useSearch({ strict: false }) as any;
  const navigate = useNavigate();

  const [allVehicles, setAllVehicles] = useState<VehicleRecord[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRecord | null>(null);
  const [recommendationList, setRecommendationList] = useState<MappedTyreProfile[]>([]);
  
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // Active inputs state
  const [searchQuery, setSearchQuery] = useState(initialVehicle);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedYear = searchParams.year || (selectedVehicle ? selectedVehicle.year : "2024");
  const selectedSubmodel = searchParams.variant || (selectedVehicle ? selectedVehicle.variant : "");
  const selectedRimSize = searchParams.rimSize || (selectedVehicle ? selectedVehicle.rim_size : "");
  
  const terrain = searchParams.terrain || "Highway";
  const roadCondition = searchParams.roadCondition || "Smooth";
  const loadRequirement = searchParams.loadRequirement || "Standard";
  const priority = searchParams.priority || "Comfort";

  const updateParams = (updates: any) => {
    navigate({
      search: (prev: any) => {
        const next = { ...prev, ...updates };
        // Clean up undefined / empty values
        Object.keys(next).forEach(k => {
          if (next[k] === undefined || next[k] === "") {
            delete next[k];
          }
        });
        return next;
      },
      replace: true,
    } as any);
  };

  // Fetch all vehicles for autocomplete
  const fetchVehiclesList = async () => {
    try {
      const records = await getAllVehicles();
      setAllVehicles(records);
    } catch (e) {
      console.error("[Wizard] Failed to fetch vehicle database", e);
    }
  };

  useEffect(() => {
    fetchVehiclesList();
  }, []);

  // Sync searchQuery with selectedVehicle change
  useEffect(() => {
    if (selectedVehicle) {
      setSearchQuery(`${selectedVehicle.manufacturer} ${selectedVehicle.model}`);
    }
  }, [selectedVehicle]);

  // Click outside listener for autocomplete dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter vehicle suggestions based on query
  const vehicleSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.trim().toLowerCase();
    const queryParts = query.split(/\s+/);

    return allVehicles
      .filter((v) => {
        const fullName = `${v.manufacturer} ${v.model}`.toLowerCase();
        return queryParts.every((part) => fullName.includes(part) || v.id.includes(part));
      })
      .map((v) => ({
        key: `${v.manufacturer} ${v.model}`,
        category: v.vehicle_category,
        record: v
      }))
      // Deduplicate suggestions by manufacturer + model name
      .filter((value, index, self) => self.findIndex(t => t.key === value.key) === index)
      .slice(0, 8);
  }, [searchQuery, allVehicles]);

  // Handle vehicle selection
  const handleSelectVehicleRecord = (vehicle: VehicleRecord) => {
    setSelectedVehicle(vehicle);
    setSearchQuery(`${vehicle.manufacturer} ${vehicle.model}`);
    setShowSearchDropdown(false);
    setFocusedSuggestionIndex(-1);

    // Auto-adjust priority factor based on segment and vehicle name
    const typeLower = vehicle.vehicle_type.toLowerCase();
    const modelLower = vehicle.model.toLowerCase();
    const mfgLower = vehicle.manufacturer.toLowerCase();
    const catLower = vehicle.vehicle_category.toLowerCase();

    let autoPriority = "Comfort";
    let autoTerrain = "Highway";
    let autoLoad = "Standard";
    let autoRoad = "Smooth";

    if (typeLower.includes("construction") || typeLower.includes("mining") || modelLower.includes("excavator") || modelLower.includes("loader") || modelLower.includes("backhoe") || modelLower.includes("bulldozer") || mfgLower.includes("cat") || mfgLower.includes("caterpillar") || mfgLower.includes("jcb") || mfgLower.includes("komatsu")) {
      autoPriority = "Commercial";
      autoTerrain = "Off-Road";
      autoLoad = "Heavy";
      autoRoad = "Rough";
    } else if (typeLower.includes("tractor") || typeLower.includes("agricultur") || mfgLower.includes("john deere") || mfgLower.includes("swaraj") || mfgLower.includes("sonalika") || mfgLower.includes("mahindra tractor")) {
      autoPriority = "Commercial";
      autoTerrain = "Off-Road";
      autoLoad = "Heavy";
      autoRoad = "Rough";
    } else if (typeLower.includes("truck") || typeLower.includes("commercial") || typeLower.includes("tipper") || modelLower.includes("signa") || modelLower.includes("actros") || modelLower.includes("fh16") || mfgLower.includes("bharatbenz")) {
      autoPriority = "Commercial";
      autoTerrain = "Highway";
      autoLoad = "Heavy";
      autoRoad = "Broken";
    } else if (typeLower.includes("bus") || typeLower.includes("coach") || modelLower.includes("coach") || modelLower.includes("9600")) {
      autoPriority = "Commercial";
      autoTerrain = "Highway";
      autoLoad = "Heavy";
      autoRoad = "Smooth";
    } else if (typeLower.includes("pickup") || modelLower.includes("hilux") || modelLower.includes("isuzu") || modelLower.includes("d-max")) {
      autoPriority = "Toughness";
      autoTerrain = "Off-Road";
      autoLoad = "Heavy";
      autoRoad = "Rough";
    } else if (typeLower.includes("off-road") || typeLower.includes("4x4") || modelLower.includes("thar") || modelLower.includes("fortuner") || modelLower.includes("defender") || modelLower.includes("wrangler")) {
      autoPriority = "Toughness";
      autoTerrain = "Off-Road";
      autoRoad = "Rough";
    } else if (typeLower.includes("luxury") || mfgLower.includes("mercedes") || mfgLower.includes("bmw") || mfgLower.includes("audi") || mfgLower.includes("range rover") || mfgLower.includes("land rover") || mfgLower.includes("porsche") || mfgLower.includes("jaguar") || mfgLower.includes("bentley") || mfgLower.includes("volvo") || modelLower.includes("range rover")) {
      autoPriority = "Sport";
      autoTerrain = "Highway";
      autoRoad = "Smooth";
    } else if (typeLower.includes("electric") || typeLower.includes("ev") || modelLower.includes("nexon ev") || modelLower.includes("model y") || modelLower.includes("model 3") || modelLower.includes("model s") || modelLower.includes("model x") || mfgLower.includes("tesla") || modelLower.includes("be 6") || modelLower.includes("be 9")) {
      autoPriority = "Efficiency";
      autoTerrain = "Urban";
    } else if (catLower === "suv" || typeLower.includes("suv")) {
      autoPriority = "Comfort";
      autoTerrain = "Highway";
      autoRoad = "Smooth";
    }

    updateParams({
      vehicleId: vehicle.id,
      vehicle: `${vehicle.manufacturer} ${vehicle.model}`,
      year: vehicle.year,
      variant: vehicle.variant,
      rimSize: vehicle.rim_size,
      terrain: autoTerrain,
      roadCondition: autoRoad,
      loadRequirement: autoLoad,
      priority: autoPriority,
    });
  };

  const handleSearchSubmit = async (queryStr: string) => {
    if (!queryStr.trim()) return;
    setLoadingSearch(true);
    setShowSearchDropdown(false);
    try {
      const res = await searchVehicle({ data: { query: queryStr } });
      if (res.success && res.vehicles && res.vehicles.length > 0) {
        const bestMatch = res.vehicles[0];
        handleSelectVehicleRecord(bestMatch);
        // Refresh autocomplete cache
        await fetchVehiclesList();
      } else {
        alert("Vehicle specifications could not be resolved. Please try another search query.");
      }
    } catch (e) {
      console.error("[Search Submit] Error:", e);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Trigger search if route parameter is loaded
  useEffect(() => {
    if (searchParams.vehicleId && allVehicles.length > 0) {
      // Try matching by full ID first
      let found = allVehicles.find((v) => v.id === searchParams.vehicleId);
      
      // If no exact ID match, try fuzzy match on the slug (e.g. "range-rover" matches "range-rover-2024-...")
      if (!found) {
        const slugParts = searchParams.vehicleId.split("-");
        found = allVehicles.find((v) => {
          const vSlug = `${v.manufacturer} ${v.model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return vSlug === searchParams.vehicleId || vSlug.startsWith(searchParams.vehicleId);
        });
      }

      if (found) {
        setSelectedVehicle(found);
      } else {
        // Not found in cache, run discovery using original human-readable query if available
        const queryText = searchParams.vehicle || searchParams.vehicleId.replace(/-/g, " ");
        handleSearchSubmit(queryText);
      }
    }
  }, [searchParams.vehicleId, allVehicles]);

  // Fetch recommendations from server when configuration updates
  useEffect(() => {
    if (!selectedVehicle) {
      setRecommendationList([]);
      return;
    }

    const fetchRecommendationsList = async () => {
      setLoadingRecs(true);
      try {
        const res = await getRecommendations({
          data: {
            vehicleId: selectedVehicle.id,
            terrain: terrain as any,
            roadCondition: roadCondition as any,
            loadRequirement: loadRequirement as any,
            priority: priority as any,
          }
        });

        if (res.success && res.recommendations) {
          const mapped = res.recommendations.map((r: any) => {
            const width = parseInt(r.sku.size.split("/")[0], 10) || 215;
            const aspectRatio = parseInt(r.sku.size.split("/")[1]?.split(" ")[0] || "60", 10) || 60;
            const rimDiameter = parseFloat(r.sku.size.split("R")[1] || "17") || 17;

            return {
              submodel: selectedVehicle.variant,
              seriesName: r.product.name,
              sizeString: r.sku.size,
              dimensions: {
                width,
                aspectRatio,
                rimDiameter,
              },
              priceINR: r.sku.price,
              userRating: r.product.specs.comfort ? parseFloat(r.product.specs.comfort) || 4.8 : 4.8,
              confidenceScore: r.score,
              engineCapacityCC: selectedVehicle.gross_weight.toLowerCase().includes("heavy") ? 5600 : selectedVehicle.fuel_type.toLowerCase().includes("electric") ? 0 : 1500,
              reasoning: r.explanations.whyThisTyre,
              displayScore: r.score,
              product: r.product,
              sku: r.sku,
              explanations: r.explanations,
            };
          });
          setRecommendationList(mapped);
        }
      } catch (e) {
        console.error("[Recommendations] Fetch failed", e);
      } finally {
        setLoadingRecs(false);
      }
    };

    fetchRecommendationsList();
  }, [selectedVehicle, terrain, roadCondition, loadRequirement, priority]);

  // Handle keyboard inputs inside autocomplete
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSearchDropdown || vehicleSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedSuggestionIndex((prev) =>
        prev < vehicleSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedSuggestionIndex((prev) =>
        prev > 0 ? prev - 1 : vehicleSuggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedSuggestionIndex >= 0 && focusedSuggestionIndex < vehicleSuggestions.length) {
        handleSelectVehicleRecord(vehicleSuggestions[focusedSuggestionIndex].record);
      } else {
        handleSearchSubmit(searchQuery);
      }
    } else if (e.key === "Escape") {
      setShowSearchDropdown(false);
      setFocusedSuggestionIndex(-1);
    }
  };

  // Get unique attributes for variations lookup
  const availableYears = useMemo(() => {
    if (!selectedVehicle) return ["2024", "2023", "2022", "2021"];
    const matches = allVehicles.filter(
      (v) => v.manufacturer.toLowerCase() === selectedVehicle.manufacturer.toLowerCase() &&
             v.model.toLowerCase() === selectedVehicle.model.toLowerCase()
    );
    return Array.from(new Set(matches.map((v) => v.year))).sort().reverse();
  }, [selectedVehicle, allVehicles]);

  const availableSubmodels = useMemo(() => {
    if (!selectedVehicle) return [];
    const matches = allVehicles.filter(
      (v) => v.manufacturer.toLowerCase() === selectedVehicle.manufacturer.toLowerCase() &&
             v.model.toLowerCase() === selectedVehicle.model.toLowerCase() &&
             v.year === selectedYear
    );
    return Array.from(new Set(matches.map((v) => v.variant)));
  }, [selectedVehicle, selectedYear, allVehicles]);

  const availableRimSizes = useMemo(() => {
    if (!selectedVehicle) return [];
    const matches = allVehicles.filter(
      (v) => v.manufacturer.toLowerCase() === selectedVehicle.manufacturer.toLowerCase() &&
             v.model.toLowerCase() === selectedVehicle.model.toLowerCase() &&
             v.year === selectedYear &&
             v.variant === selectedSubmodel
    );
    return Array.from(new Set(matches.map((v) => v.rim_size))).sort();
  }, [selectedVehicle, selectedYear, selectedSubmodel, allVehicles]);

  const handleSubmodelChange = (submod: string) => {
    if (!selectedVehicle) return;
    const match = allVehicles.find(
      (v) => v.manufacturer.toLowerCase() === selectedVehicle.manufacturer.toLowerCase() &&
             v.model.toLowerCase() === selectedVehicle.model.toLowerCase() &&
             v.year === selectedYear &&
             v.variant === submod
    );
    if (match) {
      handleSelectVehicleRecord(match);
    } else {
      updateParams({ variant: submod });
    }
  };

  const handleYearChange = (yr: string) => {
    if (!selectedVehicle) return;
    const match = allVehicles.find(
      (v) => v.manufacturer.toLowerCase() === selectedVehicle.manufacturer.toLowerCase() &&
             v.model.toLowerCase() === selectedVehicle.model.toLowerCase() &&
             v.year === yr
    );
    if (match) {
      handleSelectVehicleRecord(match);
    } else {
      updateParams({ year: yr });
    }
  };

  const handleRimChange = (rim: string) => {
    if (!selectedVehicle) return;
    const match = allVehicles.find(
      (v) => v.manufacturer.toLowerCase() === selectedVehicle.manufacturer.toLowerCase() &&
             v.model.toLowerCase() === selectedVehicle.model.toLowerCase() &&
             v.year === selectedYear &&
             v.variant === selectedSubmodel &&
             v.rim_size === rim
    );
    if (match) {
      handleSelectVehicleRecord(match);
    } else {
      updateParams({ rimSize: rim });
    }
  };

  // Availability lookup helper
  const getAvailability = (seriesName: string) => {
    const hash = seriesName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const stockCount = (hash % 15) + 3;
    const status = stockCount > 5 ? "In Stock" : "Low Stock";
    const locations = [
      "Bridgestone Select - Wakad Pune",
      "Bridgestone Select - Baner Pune",
      "Bridgestone Select - Kothrud Pune",
      "Bridgestone Select - Hadapsar Pune"
    ];
    const nearestLocation = locations[hash % locations.length];
    return { status, stockCount, nearestLocation };
  };

  const getTreadPatternType = (seriesName: string): "touring" | "all-terrain" | "durable" | "eco" | "sport" | "rib-commercial" | "tipper-block" => {
    const name = seriesName.toLowerCase();
    if (name.includes("turanza")) return "touring";
    if (name.includes("dueler")) return "all-terrain";
    if (name.includes("sturdo")) return "durable";
    if (name.includes("ecopia")) return "eco";
    if (name.includes("potenza") || name.includes("alenza")) return "sport";
    if (name.includes("g611") || name.includes("tipper")) return "tipper-block";
    if (name.includes("v-steel") || name.includes("commercial")) return "rib-commercial";
    return "touring";
  };

  const handleReset = () => {
    setSelectedVehicle(null);
    setSearchQuery("");
    setShowSearchDropdown(false);
    setFocusedSuggestionIndex(-1);
    updateParams({
      vehicleId: undefined,
      year: undefined,
      variant: undefined,
      rimSize: undefined,
    });
  };

  return (
    <div className="w-full text-white font-sans" ref={containerRef}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Configurator panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div 
            className="rounded-[24px] border border-[#C4A67A]/30 p-6 relative overflow-hidden shadow-[0_10px_30px_rgba(170,145,110,0.12)] transition-all duration-300 hover:border-[#C8A165]"
            style={{
              background: "rgba(255, 255, 255, 0.94)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid #E9E1D6",
            }}
          >
            <div className="absolute -left-20 -top-20 w-40 h-40 bg-[#E8C8CF]/30 blur-[50px] rounded-full pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#9B6B43] font-extrabold flex items-center gap-1.5">
                <SlidersHorizontal size={12} />
                Global Vehicle Intelligence
              </span>
              {selectedVehicle && (
                <button
                  onClick={handleReset}
                  className="text-[#8C8C8C] hover:text-[#2A2A2A] text-[9px] uppercase tracking-wider font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw size={10} /> Reset Selection
                </button>
              )}
            </div>

            {/* Vehicle Search Box */}
            <div className="relative mb-4" ref={dropdownRef}>
              <label className="text-[9px] uppercase tracking-widest text-[#8C8C8C] font-bold block mb-1.5">
                Search ANY Vehicle Worldwide (AI Discovery Enabled)
              </label>
              <div className="relative flex items-center bg-[#F5EFE6] border border-[#C4A67A]/25 rounded-xl px-3.5 py-2.5 focus-within:border-[#C8A165] focus-within:ring-2 focus-within:ring-[#C8A165]/15 transition-all">
                {loadingSearch ? (
                  <Loader2 className="animate-spin text-[#E60012] mr-2.5" size={16} />
                ) : (
                  <Search size={16} className="text-[#8C8C8C] mr-2.5" />
                )}
                <input
                  type="text"
                  placeholder="Type make/model (e.g. Tesla Model Y, Creta, Signa)..."
                  value={searchQuery}
                  onFocus={() => setShowSearchDropdown(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                    setFocusedSuggestionIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent text-xs text-[#2A2A2A] border-none outline-none w-full placeholder:text-[#8C8C8C] focus:outline-none focus:ring-0 font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleSearchSubmit(searchQuery)}
                  className="text-[#E60012] text-[10px] font-bold uppercase tracking-wider hover:text-[#C8A165] transition-colors cursor-pointer"
                >
                  Find
                </button>
              </div>

              {/* Autocomplete Suggestions Box */}
              {showSearchDropdown && vehicleSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 z-50 shadow-[0_12px_40px_rgba(170,145,110,0.25)] bg-white/98 backdrop-blur-2xl border border-[#C4A67A]/30 rounded-2xl p-2 max-h-60 overflow-y-auto suggestions-list">
                  {vehicleSuggestions.map((v, index) => (
                    <button
                      key={v.record.id}
                      onClick={() => handleSelectVehicleRecord(v.record)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between text-xs cursor-pointer ${
                        index === focusedSuggestionIndex
                          ? "bg-[#E60012] text-white"
                          : "text-[#2A2A2A] hover:bg-[#F5EFE6]"
                      }`}
                    >
                      <div>
                        <span className="font-bold">{v.key}</span>
                        <span className="text-[9px] text-[#666666] block font-medium">OEM Spec Size: {v.record.oem_tyre_size}</span>
                      </div>
                      <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded ${
                        index === focusedSuggestionIndex
                          ? "bg-white/20 text-white"
                          : "text-[#9B6B43] bg-[#9B6B43]/15 border border-[#9B6B43]/20"
                      }`}>
                        {v.record.vehicle_category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Inline selectors (only visible if vehicle is selected) */}
            {selectedVehicle ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-[#8C8C8C] font-bold block mb-1.5">
                      Model Year
                    </label>
                    <div className="relative">
                      <select
                        value={selectedYear}
                        onChange={(e) => handleYearChange(e.target.value)}
                        className="w-full bg-[#F5EFE6] border border-[#C4A67A]/30 rounded-xl px-2.5 py-2.5 text-xs text-[#2A2A2A] font-semibold outline-none cursor-pointer hover:border-[#C8A165] transition-colors appearance-none"
                      >
                        {availableYears.map((yr) => (
                          <option key={yr} value={yr} className="bg-white text-[#2A2A2A]">
                            {yr}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-3.5 text-[#9B6B43] pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-[#8C8C8C] font-bold block mb-1.5">
                      Variant / Trim
                    </label>
                    <div className="relative">
                      <select
                        value={selectedSubmodel}
                        onChange={(e) => handleSubmodelChange(e.target.value)}
                        className="w-full bg-[#F5EFE6] border border-[#C4A67A]/30 rounded-xl px-2.5 py-2.5 text-xs text-[#2A2A2A] font-semibold outline-none cursor-pointer hover:border-[#C8A165] transition-colors appearance-none"
                      >
                        {availableSubmodels.map((submod) => (
                          <option key={submod} value={submod} className="bg-white text-[#2A2A2A]">
                            {submod}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-3.5 text-[#9B6B43] pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-[#8C8C8C] font-bold block mb-1.5">
                      Rim Size
                    </label>
                    <div className="relative">
                      <select
                        value={selectedRimSize}
                        onChange={(e) => handleRimChange(e.target.value)}
                        className="w-full bg-[#F5EFE6] border border-[#C4A67A]/30 rounded-xl px-2.5 py-2.5 text-xs text-[#2A2A2A] font-semibold outline-none cursor-pointer hover:border-[#C8A165] transition-colors appearance-none"
                      >
                        {availableRimSizes.map((rim) => (
                          <option key={rim} value={rim} className="bg-white text-[#2A2A2A]">
                            {rim}" OEM
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-3.5 text-[#9B6B43] pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Detected OEM Specifications Metadata */}
                <div className="bg-[#FAF7F2] border border-[#E9E1D6] rounded-2xl p-4 flex flex-col gap-2.5 mt-2 shadow-xs">
                  <span className="text-[10px] uppercase tracking-widest text-[#9B6B43] font-black flex items-center gap-1.5">
                    <Info size={13} className="text-[#C9A35D]" /> Live Specifications Panel
                  </span>
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-[11px] text-[#555555]">
                    <div>Vehicle Name: <span className="text-[#1C1917] font-bold block">{selectedVehicle.manufacturer} {selectedVehicle.model}</span></div>
                    <div>Category: <span className="text-[#1C1917] font-bold block">{selectedVehicle.vehicle_type}</span></div>
                    <div>Factory Tyre Size: <span className="text-[#1C1917] font-bold block">{selectedVehicle.oem_tyre_size}</span></div>
                    <div>Approved Rim Diameter: <span className="text-[#1C1917] font-bold block">{selectedRimSize || selectedVehicle.rim_size}"</span></div>
                    <div>OEM Load Index: <span className="text-[#1C1917] font-bold block">{selectedVehicle.load_index}</span></div>
                    <div>OEM Speed Rating: <span className="text-[#1C1917] font-bold block">{selectedVehicle.speed_rating}</span></div>
                    <div>Fuel / Drive Mode: <span className="text-[#1C1917] font-bold block">{selectedVehicle.fuel_type} ({selectedVehicle.drive_type})</span></div>
                    <div>Gross Weight: <span className="text-[#1C1917] font-bold block">{selectedVehicle.gross_weight}</span></div>
                    
                    <div className="col-span-2 pt-2 border-t border-[#E9E1D6] flex items-center justify-between">
                      <span className="font-semibold text-[#555555]">AI Discovery Status:</span>
                      <span className={`font-bold px-2.5 py-1 rounded-full text-[10px] ${
                        selectedVehicle.isDiscovered 
                          ? "bg-[#C9A35D]/15 text-[#9B6B43] border border-[#C9A35D]/30"
                          : "bg-[#5B8C5A]/15 text-[#3B663A] border border-[#5B8C5A]/30"
                      }`}>
                        {selectedVehicle.isDiscovered 
                          ? `AI Learned (${Math.round(selectedVehicle.confidence * 100)}% Confidence)`
                          : "Verified OEM Base"
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 border border-[#C4A67A]/20 bg-[#F5EFE6]/50 rounded-2xl text-[#8C8C8C] text-xs font-medium">
                Select a vehicle to unlock year, variant and load parameters.
              </div>
            )}
          </div>

          {/* factor customizers */}
          {selectedVehicle && (
            <div 
              className="rounded-[24px] border border-[#C4A67A]/30 p-6 shadow-[0_10px_30px_rgba(170,145,110,0.12)] space-y-5 animate-in slide-in-from-bottom-5 duration-300"
              style={{
                background: "rgba(255, 250, 245, 0.82)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            >
              <span className="text-[10px] uppercase tracking-widest text-[#9B6B43] font-extrabold flex items-center gap-1.5">
                <SlidersHorizontal size={12} />
                Usage & Priority Factors
              </span>

              {/* Usage Terrain Profile */}
              <div>
                <label className="text-[9px] uppercase tracking-widest text-[#8C8C8C] font-bold block mb-2">
                  Usage Type / Terrain
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#F5EFE6] rounded-xl border border-[#C4A67A]/25">
                  {(["Urban", "Highway", "Off-Road"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => updateParams({ terrain: t })}
                      className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                        terrain === t
                          ? "bg-[#E60012] text-white shadow-sm"
                          : "text-[#666666] hover:text-[#2A2A2A] hover:bg-white/80"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Road Conditions */}
              <div>
                <label className="text-[9px] uppercase tracking-widest text-[#8C8C8C] font-bold block mb-2">
                  Primary Road Conditions
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#F5EFE6] rounded-xl border border-[#C4A67A]/25">
                  {[
                    { val: "Smooth", label: "Smooth" },
                    { val: "Broken", label: "Potholes" },
                    { val: "Rough", label: "Rough Trails" },
                  ].map((rc) => (
                    <button
                      key={rc.val}
                      onClick={() => updateParams({ roadCondition: rc.val as any })}
                      className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                        roadCondition === rc.val
                          ? "bg-[#E60012] text-white shadow-sm"
                          : "text-[#666666] hover:text-[#2A2A2A] hover:bg-white/80"
                      }`}
                    >
                      {rc.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Load Requirements */}
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block mb-2">
                    Load Requirements
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10">
                    {[
                      { val: "Standard", label: "Passenger" },
                      { val: "Heavy", label: "Cargo/Towing" },
                    ].map((l) => (
                      <button
                        key={l.val}
                        onClick={() => updateParams({ loadRequirement: l.val as any })}
                        className={`py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                          loadRequirement === l.val
                            ? "bg-[#E60012] text-white shadow-sm"
                            : "text-[#666666] hover:text-[#2A2A2A] hover:bg-white/80"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Performance Priorities */}
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-[#8C8C8C] font-bold block mb-2">
                    Performance Priority
                  </label>
                  <div className="relative">
                    <select
                      value={priority}
                      onChange={(e) => updateParams({ priority: e.target.value as any })}
                      className="w-full bg-[#F5EFE6] border border-[#C4A67A]/30 rounded-xl px-3 py-2 text-[10px] text-[#2A2A2A] font-bold uppercase tracking-wider outline-none cursor-pointer hover:border-[#C8A165] transition-colors appearance-none"
                    >
                      <option value="Comfort" className="bg-white text-[#2A2A2A]">Comfort & Silence</option>
                      <option value="Toughness" className="bg-white text-[#2A2A2A]">Durability</option>
                      <option value="Efficiency" className="bg-white text-[#2A2A2A]">EV / Fuel Eco</option>
                      <option value="Sport" className="bg-white text-[#2A2A2A]">Sport Cornering</option>
                      <option value="Commercial" className="bg-white text-[#2A2A2A]">Heavy Load Fleet</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-2.5 text-[#9B6B43] pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Live recommendations (renders top 3 options) */}
        <div className="lg:col-span-7">
          {loadingRecs ? (
            <div 
              className="h-full min-h-[300px] rounded-[24px] border border-[#C4A67A]/30 p-8 flex flex-col items-center justify-center text-center shadow-[0_10px_30px_rgba(170,145,110,0.12)]"
              style={{
                background: "rgba(255, 250, 245, 0.82)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            >
              <Loader2 className="animate-spin text-[#E60012] mb-4" size={44} strokeWidth={1.75} />
              <h3 className="text-lg font-bold text-[#2A2A2A] mb-2">Analyzing Tyre Compatibility Vectors...</h3>
              <p className="text-xs max-w-sm leading-relaxed text-[#666666] font-medium">
                Evaluating load index ratings, width profiles, speed ratings, and compound durability mapping.
              </p>
            </div>
          ) : selectedVehicle ? (
            recommendationList.length > 0 ? (
              <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                
                {/* Primary match: Rank 1 */}
                {(() => {
                  const primary = recommendationList[0];
                  const availability = getAvailability(primary.seriesName);
                  const patternType = getTreadPatternType(primary.seriesName);
                  return (
                    <div 
                      className="rounded-[24px] border border-[#C4A67A]/30 p-6 md:p-8 relative overflow-hidden shadow-[0_10px_30px_rgba(170,145,110,0.12)] hover:shadow-[0_15px_35px_rgba(170,145,110,0.22)] hover:border-[#C8A165] hover:scale-[1.005] transition-all duration-250 ease-out group"
                      style={{
                        background: "rgba(255, 250, 245, 0.82)",
                        backdropFilter: "blur(18px)",
                        WebkitBackdropFilter: "blur(18px)",
                      }}
                    >
                      <div className="absolute -right-20 -top-20 w-44 h-44 bg-gradient-to-tr from-[#E8C8CF]/30 to-[#C8A165]/20 blur-[60px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                      
                      <div className="flex items-center justify-between mb-5">
                        <span className="bg-[#C8A165]/15 border border-[#C8A165]/35 text-[#9B6B43] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                          <Sparkles size={11} className="text-[#9B6B43]" /> Primary Fitment Recommendation
                        </span>
                        <span className="bg-[#5B8C5A]/15 border border-[#5B8C5A]/35 text-[#3B663A] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                          {primary.displayScore}% Compatibility Score
                        </span>
                      </div>

                      <div className="grid md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-8 space-y-4">
                          <div>
                            <h3 className="text-3xl font-extrabold text-[#2A2A2A] tracking-tight">
                              {primary.seriesName}
                            </h3>
                            <span className="text-[10px] uppercase tracking-widest text-[#9B6B43] font-bold block mt-1">
                              {primary.sizeString} • Width {primary.dimensions.width} • Aspect {primary.dimensions.aspectRatio}% • Rim {primary.dimensions.rimDiameter}"
                            </span>
                          </div>

                          {/* Structured explanations bulleted list */}
                          <div className="bg-[#F5EFE6]/70 border border-[#C4A67A]/25 rounded-xl p-4 space-y-3">
                            <span className="text-[9px] uppercase tracking-widest text-[#8C8C8C] font-extrabold block">
                              Recommendation Rationale
                            </span>
                            <ul className="space-y-2 text-[11px] text-[#666666] list-none pl-0">
                              <li className="flex items-start gap-2">
                                <span className="text-[#C8A165] font-bold">✓</span>
                                <div>
                                  <span className="font-bold text-[#2A2A2A]">Compound Fitment: </span>
                                  {primary.reasoning}
                                </div>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#C8A165] font-bold">✓</span>
                                <div>
                                  <span className="font-bold text-[#2A2A2A]">Size Compatibility: </span>
                                  {primary.explanations?.size || "Exact match for factory radial specifications."}
                                </div>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#C8A165] font-bold">✓</span>
                                <div>
                                  <span className="font-bold text-[#2A2A2A]">Safety Parameters: </span>
                                  {primary.explanations?.load || "Meets load rating requirements."} • {primary.explanations?.speed || "Meets speed index."}
                                </div>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#C8A165] font-bold">✓</span>
                                <div>
                                  <span className="font-bold text-[#2A2A2A]">Performance Target: </span>
                                  {primary.explanations?.preference || "Optimized for your usage profile."}
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Right part: vector tread illustration and price */}
                        <div className="md:col-span-4 flex flex-col items-center justify-center text-center gap-4 bg-[#F5EFE6]/70 border border-[#C4A67A]/25 rounded-2xl p-4">
                          <TyreTreadIllustration type={patternType} />
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-[#8C8C8C] font-bold block">
                              Estimated Price
                            </span>
                            <span className="text-[#2A2A2A] font-black text-2xl">
                              ₹{primary.priceINR.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[8px] text-[#8C8C8C] block mt-0.5 font-medium">
                              *Inclusive of GST per unit
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <div className="rounded-xl p-2 bg-white/5 border border-white/10 flex items-center justify-center">
                            {availability.status === "In Stock" ? (
                              <Package size={16} className="text-green-400" />
                            ) : (
                              <Clock size={16} className="text-yellow-400" />
                            )}
                          </div>
                          <div className="text-left">
                            <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold block">
                              Availability Status
                            </span>
                            <span className="text-xs font-bold text-white">
                              {availability.status} ({availability.stockCount} Units)
                            </span>
                            <span className="text-[9px] text-slate-400 block">
                              {availability.nearestLocation}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (openBooking) {
                              openBooking({
                                dealerName: availability.nearestLocation,
                                tyreName: primary.seriesName,
                                price: `₹${primary.priceINR.toLocaleString('en-IN')}`,
                              });
                            }
                          }}
                          className="w-full sm:w-auto bg-[#D71920] hover:bg-[#B5141A] rounded-full px-6 py-2.5 text-white uppercase tracking-widest text-[10px] font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_4px_15px_rgba(204,0,0,0.15)]"
                        >
                          Instant Booking Slots <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Alternative Recommendations Rank 2 & Rank 3 */}
                {recommendationList.length > 1 && (
                  <div 
                    className="rounded-[24px] border border-[#C4A67A]/30 p-6 shadow-[0_10px_30px_rgba(170,145,110,0.12)]"
                    style={{
                      background: "rgba(255, 250, 245, 0.82)",
                      backdropFilter: "blur(18px)",
                      WebkitBackdropFilter: "blur(18px)",
                    }}
                  >
                    <span className="text-[10px] uppercase tracking-widest text-[#9B6B43] font-extrabold block mb-4">
                      Other OEM Compatible Alternative Options
                    </span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendationList.slice(1, 4).map((alt, index) => {
                        const availability = getAvailability(alt.seriesName);
                        return (
                          <div
                            key={alt.seriesName + alt.sizeString}
                            className="bg-[#F5EFE6]/80 border border-[#C4A67A]/28 hover:border-[#C8A165] hover:shadow-[0_10px_25px_rgba(170,145,110,0.15)] rounded-2xl p-4 flex flex-col justify-between transition-all duration-250 animate-in fade-in"
                          >
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[8px] uppercase font-bold text-[#9B6B43] bg-[#C8A165]/15 border border-[#C8A165]/30 px-2 py-0.5 rounded">
                                  Rank #{index + 2} Alternative
                                </span>
                                <span className="text-[9px] font-bold text-[#3B663A] bg-[#5B8C5A]/15 px-2 py-0.5 rounded">
                                  {alt.displayScore}% Score
                                </span>
                              </div>

                              <div>
                                <h4 className="text-sm font-bold text-[#2A2A2A] truncate">{alt.seriesName}</h4>
                                <span className="text-[9px] text-[#9B6B43] font-bold block mt-0.5">
                                  {alt.sizeString}
                                </span>
                              </div>

                              <p className="text-[10px] text-[#666666] leading-relaxed line-clamp-2">
                                {alt.reasoning}
                              </p>

                              <div className="text-[9px] text-[#8C8C8C] space-y-1 pt-1.5 border-t border-[#C4A67A]/20">
                                <div><span className="text-[#2A2A2A] font-medium">Width:</span> {alt.dimensions.width} mm</div>
                                <div><span className="text-[#2A2A2A] font-medium">Profile:</span> {alt.dimensions.aspectRatio}%</div>
                                <div><span className="text-[#2A2A2A] font-medium">Rim:</span> {alt.dimensions.rimDiameter}"</div>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#C4A67A]/20 flex items-center justify-between">
                              <div>
                                <span className="text-[8px] text-[#8C8C8C] block">Estimated Price</span>
                                <span className="text-[#2A2A2A] text-xs font-extrabold">₹{alt.priceINR.toLocaleString('en-IN')}</span>
                              </div>
                              
                              <button
                                onClick={() => {
                                  if (openBooking) {
                                    openBooking({
                                      dealerName: availability.nearestLocation,
                                      tyreName: alt.seriesName,
                                      price: `₹${alt.priceINR.toLocaleString('en-IN')}`,
                                    });
                                  }
                                }}
                                className="bg-[#E60012] hover:bg-[#C8A165] rounded-xl px-4 py-1.5 text-white uppercase text-[8px] font-extrabold transition-all cursor-pointer shadow-sm"
                              >
                                Book Slots
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div 
                className="h-full min-h-[300px] border border-[#C4A67A]/30 rounded-[24px] p-8 flex flex-col items-center justify-center text-center shadow-[0_10px_30px_rgba(170,145,110,0.12)]"
                style={{
                  background: "rgba(255, 250, 245, 0.82)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                }}
              >
                <Loader2 className="animate-spin text-[#E60012] mb-4" size={48} strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-[#2A2A2A] mb-2">Generating Live Recommendations...</h3>
                <p className="text-xs max-w-sm leading-relaxed text-[#666666]">
                  Retrieving compatibility scoring vectors and final alternative fitments.
                </p>
              </div>
            )
          ) : (
            <div 
              className="h-full min-h-[300px] border border-[#C4A67A]/30 rounded-[24px] p-8 flex flex-col items-center justify-center text-center shadow-[0_10px_30px_rgba(170,145,110,0.12)]"
              style={{
                background: "rgba(255, 250, 245, 0.82)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            >
              <Compass size={48} className="text-[#8C8C8C]/40 mb-4 animate-pulse" />
              <h3 className="text-lg font-bold text-[#2A2A2A] mb-2">No Active Recommendation</h3>
              <p className="text-xs max-w-sm leading-relaxed text-[#666666]">
                Please search and select your vehicle from the configurator panel to generate live tyre fitting recommendations instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Custom SVG Tread Pattern Illustrations to replace tyre images dynamically
function TyreTreadIllustration({ type }: { type: string }) {
  return (
    <div className="w-20 h-28 relative rounded-xl border border-white/10 bg-[#08080C] overflow-hidden shadow-inner group">
      <div className="absolute inset-y-0 left-0 w-1 bg-[#1A1A24] z-10" />
      <div className="absolute inset-y-0 right-0 w-1 bg-[#1A1A24] z-10" />

      <div className="w-full h-full flex flex-col justify-around py-2 animate-[pulse_3s_infinite]">
        {type === "touring" && (
          <svg className="w-full h-full px-2" viewBox="0 0 100 120" fill="none" stroke="currentColor">
            <line x1="20" y1="0" x2="20" y2="120" strokeWidth="4" className="text-white/30" />
            <line x1="40" y1="0" x2="40" y2="120" strokeWidth="2" className="text-[#D71920]/40" />
            <line x1="60" y1="0" x2="60" y2="120" strokeWidth="2" className="text-[#D71920]/40" />
            <line x1="80" y1="0" x2="80" y2="120" strokeWidth="4" className="text-white/30" />
            {[10, 30, 50, 70, 90, 110].map((y) => (
              <path key={y} d={`M 20 ${y} Q 30 ${y - 5} 40 ${y} M 60 ${y} Q 70 ${y + 5} 80 ${y}`} strokeWidth="2" className="text-white/20" />
            ))}
          </svg>
        )}

        {type === "all-terrain" && (
          <svg className="w-full h-full px-1.5" viewBox="0 0 100 120" fill="none">
            {[10, 35, 60, 85, 110].map((y, idx) => (
              <g key={y} className="text-slate-400/30">
                <rect x={idx % 2 === 0 ? "10" : "25"} y={y} width="25" height="15" rx="3" fill="currentColor" />
                <rect x={idx % 2 === 0 ? "65" : "50"} y={y} width="25" height="15" rx="3" fill="currentColor" />
                <rect x={idx % 2 === 0 ? "42" : "15"} y={y + 8} width="16" height="5" rx="1" fill="#D71920/40" />
              </g>
            ))}
          </svg>
        )}

        {type === "durable" && (
          <svg className="w-full h-full px-2" viewBox="0 0 100 120" fill="none" stroke="currentColor">
            <line x1="30" y1="0" x2="30" y2="120" strokeWidth="5" className="text-white/40" />
            <line x1="70" y1="0" x2="70" y2="120" strokeWidth="5" className="text-white/40" />
            {[15, 40, 65, 90, 115].map((y) => (
              <line key={y} x1="30" y1={y} x2="70" y2={y} strokeWidth="3" className="text-[#D71920]/40" />
            ))}
          </svg>
        )}

        {type === "eco" && (
          <svg className="w-full h-full px-2" viewBox="0 0 100 120" fill="none" stroke="currentColor">
            <line x1="15" y1="0" x2="15" y2="120" strokeWidth="2" className="text-white/20" />
            <line x1="50" y1="0" x2="50" y2="120" strokeWidth="3.5" className="text-[#D71920]/30" strokeDasharray="6 4" />
            <line x1="85" y1="0" x2="85" y2="120" strokeWidth="2" className="text-white/20" />
            {[20, 50, 80, 110].map((y) => (
              <path key={y} d={`M 15 ${y} Q 32.5 ${y + 5} 50 ${y} Q 67.5 ${y - 5} 85 ${y}`} strokeWidth="1.5" className="text-green-400/20" />
            ))}
          </svg>
        )}

        {type === "sport" && (
          <svg className="w-full h-full px-2" viewBox="0 0 100 120" fill="none" stroke="currentColor">
            <line x1="50" y1="0" x2="50" y2="120" strokeWidth="3" className="text-[#D71920]/40" />
            {[10, 25, 40, 55, 70, 85, 100, 115].map((y) => (
              <g key={y} className="text-white/25">
                <line x1="15" y1={y} x2="40" y2={y + 10} strokeWidth="2.5" />
                <line x1="85" y1={y} x2="60" y2={y + 10} strokeWidth="2.5" />
              </g>
            ))}
          </svg>
        )}

        {type === "rib-commercial" && (
          <svg className="w-full h-full px-2" viewBox="0 0 100 120" fill="none" stroke="currentColor">
            <line x1="18" y1="0" x2="18" y2="120" strokeWidth="6" className="text-white/30" />
            <line x1="38" y1="0" x2="38" y2="120" strokeWidth="5" className="text-white/25" />
            <line x1="62" y1="0" x2="62" y2="120" strokeWidth="5" className="text-white/25" />
            <line x1="82" y1="0" x2="82" y2="120" strokeWidth="6" className="text-white/30" />
          </svg>
        )}

        {type === "tipper-block" && (
          <svg className="w-full h-full px-1" viewBox="0 0 100 120" fill="none">
            {[5, 30, 55, 80, 105].map((y, idx) => (
              <g key={y} className="text-slate-500/40">
                <rect x={idx % 2 === 0 ? "5" : "20"} y={y} width="30" height="20" rx="4" fill="currentColor" />
                <rect x={idx % 2 === 0 ? "65" : "50"} y={y} width="30" height="20" rx="4" fill="currentColor" />
                <rect x={idx % 2 === 0 ? "40" : "10"} y={y + 6} width="20" height="8" rx="2" fill="#D71920" fillOpacity="0.25" />
              </g>
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}
