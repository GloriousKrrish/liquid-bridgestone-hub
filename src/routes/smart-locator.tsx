import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Search, MapPin, Store, Navigation, Star, ExternalLink, Phone, Globe, ShieldAlert } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useLanguage } from "@/lib/LanguageContext";
import { useModals } from "@/lib/ModalContext";
import { discoverRealTimeDealers, type RealDealer } from "@/lib/api/dealer.functions";

export const Route = createFileRoute("/smart-locator")({
  head: () => ({
    meta: [
      { title: "Real-Time Dealer Discovery — Bridgestone India" },
      { name: "description", content: "Discover certified Bridgestone fitment centres near you with live Google Places ratings, navigation, and appointment booking." },
      { property: "og:title", content: "Real-Time Dealer Discovery — Bridgestone India" },
      { property: "og:description", content: "Discover certified Bridgestone fitment centres near you with live Google Places ratings, navigation, and appointment booking." },
    ],
  }),
  component: SmartLocatorPage,
});

function SmartLocatorPage() {
  const { t } = useLanguage();
  const { openBooking } = useModals();
  const [query, setQuery] = useState("");
  const [dealers, setDealers] = useState<RealDealer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchSummary, setSearchSummary] = useState<string>("Pune, Maharashtra, India");

  const performDiscovery = useCallback(async (locationStr?: string, lat?: number, lng?: number) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const result = await discoverRealTimeDealers({
        data: {
          locationQuery: locationStr || "Pune, Maharashtra, India",
          latitude: lat,
          longitude: lng,
        },
      });

      if (result.success && result.dealers) {
        setDealers(result.dealers);
        setSearchSummary(result.searchLocation || locationStr || "Search location");
      } else {
        setDealers([]);
        setErrorMsg(result.message || "No dealers found in this location.");
      }
    } catch (err: any) {
      console.error("[Smart Locator] Discovery error:", err);
      setErrorMsg("Failed to query real-time dealer network. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial discovery on mount
  useEffect(() => {
    performDiscovery("Pune, Maharashtra, India");
  }, [performDiscovery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    performDiscovery(query.trim());
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        performDiscovery("Current Location", pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.warn("[Geolocation] Error:", err);
        setErrorMsg("Unable to access current position. Please type your city or area manually.");
        setIsLoading(false);
      }
    );
  };

  return (
    <PageShell>
      <section className="max-w-5xl mx-auto px-6 pt-6 pb-16 relative z-10">
        <span className="text-[10px] uppercase tracking-widest text-[#D71920] font-semibold bg-[#F8EDEE] px-3 py-1 rounded-full border border-[#EFE6E8]">
          Real-Time Dealer Discovery
        </span>
        <h1 className="text-4xl md:text-6xl text-[#2D2D2D] mt-4 mb-4 font-light" style={{ fontFamily: "'Instrument Serif', serif" }}>
          {t("locator_title")} <em className="italic">{t("nearest_fitment_italic")}</em> {t("elements").replace(".", "")}.
        </h1>
        <p className="text-[#707070] text-sm max-w-2xl mb-8">
          Powered by live Google Geocoding and Places API. Find official Bridgestone Select stores and authorized retailers near your exact location.
        </p>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="bg-[#FFFFFF] rounded-full pl-6 pr-2 py-2 flex items-center gap-3 w-full max-w-2xl mb-10 focus-within:ring-2 focus-within:ring-[#D71920] transition-all border border-[#EFE6E8] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <Search size={18} className="text-[#707070]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type city, area, pincode (e.g. Wakad Pune, Indiranagar Bangalore, Connaught Place)..."
            className="text-[#2D2D2D] placeholder:text-[#707070]/60 text-sm flex-1 bg-transparent border-none outline-none focus:outline-none"
          />
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            title="Use My Current Location"
            aria-label="Use current location"
            className="bg-[#FAF5F6] hover:bg-[#F8EDEE] border border-[#EFE6E8] text-[#D71920] rounded-full p-2.5 transition-all cursor-pointer"
          >
            <Navigation size={18} />
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#D71920] hover:bg-[#B5141A] rounded-full px-6 py-2.5 text-white uppercase tracking-widest text-[10px] font-bold transition-all cursor-pointer shadow-md shadow-[#D71920]/20 disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Active Search Summary */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#EFE6E8]">
          <h2 className="text-sm font-semibold text-[#2D2D2D] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D71920]" />
            Showing real-time results for: <span className="text-[#D71920]">{searchSummary}</span>
          </h2>
          <span className="text-xs text-[#707070]">{dealers.length} Dealers Found</span>
        </div>

        {/* Error Banner if any */}
        {errorMsg && (
          <div className="bg-[#FFF8F8] border border-[#EFE6E8] rounded-2xl p-4 mb-6 flex items-center gap-3 text-xs text-[#D71920]">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Dealer Cards Grid */}
        <div className="grid gap-4">
          {isLoading && (
            <div className="bg-[#FFFFFF] border border-[#EFE6E8] rounded-3xl p-8 text-center text-[#707070] text-sm shadow-xs animate-pulse">
              Querying Google Places API for verified Bridgestone stores near {searchSummary}...
            </div>
          )}

          {!isLoading && dealers.length === 0 && !errorMsg && (
            <div className="bg-[#FFFFFF] border border-[#EFE6E8] rounded-3xl p-8 text-center text-[#707070] text-sm shadow-xs">
              No store results returned from Google Places API for this area. Try searching for a neighboring city or pincode.
            </div>
          )}

          {!isLoading && dealers.map((d) => (
            <div key={d.id} className="bg-[#FFFFFF] border border-[#EFE6E8] hover:border-[#D71920]/40 rounded-3xl p-6 flex flex-col md:flex-row md:items-center gap-5 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(215,25,32,0.06)]">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-[#F8EDEE] border border-[#EFE6E8] flex items-center justify-center shrink-0">
                  <Store size={22} className="text-[#D71920]" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-semibold text-[#2D2D2D]">{d.name}</span>
                    {d.isBridgestone ? (
                      <span className="text-[10px] bg-[#F8EDEE] text-[#D71920] font-semibold px-2.5 py-0.5 rounded-full border border-[#EFE6E8]">
                        Bridgestone Authorized
                      </span>
                    ) : (
                      <span className="text-[10px] bg-[#FAF5F6] text-[#707070] font-semibold px-2.5 py-0.5 rounded-full border border-[#EFE6E8]">
                        Non-Bridgestone Retailer
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#707070] flex items-center gap-1.5 leading-relaxed">
                    <MapPin size={13} className="shrink-0 text-[#D71920]" /> {d.address} · <span className="font-semibold text-[#2D2D2D]">{d.distance}</span>
                  </div>
                  <div className="flex items-center gap-3 pt-1 text-xs text-[#707070]">
                    <span className="flex items-center gap-1 font-semibold text-[#2D2D2D]">
                      <Star className="w-3.5 h-3.5 fill-[#D71920] text-[#D71920]" /> {d.rating} ({d.userRatingsTotal} reviews)
                    </span>
                    <span>·</span>
                    <span className={`font-semibold ${d.openNow ? "text-[#2E8B57]" : "text-red-500"}`}>
                      {d.openNow ? "Open Now" : "Closed"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs shrink-0">
                {d.phoneNumber && (
                  <a
                    href={`tel:${d.phoneNumber}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF5F6] hover:bg-[#F8EDEE] text-[#2D2D2D] border border-[#EFE6E8] font-medium transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#D71920]" /> Call
                  </a>
                )}
                {d.mapsUrl && (
                  <a
                    href={d.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF5F6] hover:bg-[#F8EDEE] text-[#2D2D2D] border border-[#EFE6E8] font-medium transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#D71920]" /> Google Maps
                  </a>
                )}
                <button
                  onClick={() => openBooking({ dealerName: d.name })}
                  className="bg-[#D71920] hover:bg-[#B5141A] rounded-full px-5 py-2.5 text-white uppercase tracking-widest text-[10px] font-bold transition-all cursor-pointer shadow-sm shadow-[#D71920]/20"
                >
                  {t("book_slot")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
