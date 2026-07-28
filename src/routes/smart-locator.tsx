import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, MapPin, Clock, Package, Store, Navigation } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { DEALER_LOCATOR } from "@/lib/bridgestone-data";
import { useLanguage } from "@/lib/LanguageContext";
import { useModals } from "@/lib/ModalContext";

export const Route = createFileRoute("/smart-locator")({
  head: () => ({
    meta: [
      { title: "Smart Locator — Bridgestone India" },
      { name: "description", content: "Locate authorised Bridgestone fitment centres near you with real-time stock and booking slots." },
      { property: "og:title", content: "Smart Locator — Bridgestone India" },
      { property: "og:description", content: "Locate authorised Bridgestone fitment centres near you with real-time stock and booking slots." },
    ],
  }),
  component: SmartLocatorPage,
});

function SmartLocatorPage() {
  const { t } = useLanguage();
  const { openBooking } = useModals();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DEALER_LOCATOR;
    return DEALER_LOCATOR.filter((d) => d.name.toLowerCase().includes(q) || d.address.toLowerCase().includes(q));
  }, [query]);

  return (
    <PageShell>
      <section className="max-w-5xl mx-auto px-6 pt-6 pb-16 relative z-10">
        <span className="text-[10px] uppercase tracking-widest text-white/40">{t("smart_locator")}</span>
        <h1 className="text-4xl md:text-6xl text-white mt-2 mb-4 font-light" style={{ fontFamily: "'Instrument Serif', serif" }}>
          {t("locator_title")} <em className="italic">{t("nearest_fitment_italic")}</em> {t("elements").replace(".", "")}.
        </h1>
        <p className="text-white/60 text-sm max-w-2xl mb-8">{t("locator_intro")}</p>

        <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3 w-full max-w-2xl mb-10 focus-within:ring-2 focus-within:ring-[#D71920] focus-within:outline-none transition-all border border-white/10 bg-slate-950/40 backdrop-blur-xl">
          <Search size={18} className="text-white/40" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("locator_placeholder")}
            className="text-white placeholder:text-white/40 text-sm flex-1 bg-transparent border-none outline-none focus:outline-none" />
          <button aria-label="Use current location" className="bg-[#D71920] rounded-full p-3 hover:bg-[#B5141A] transition-all transform hover:scale-105 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none">
            <Navigation size={18} className="text-white" />
          </button>
        </div>

        <div className="grid gap-4">
          {results.length === 0 && <div className="liquid-glass rounded-3xl p-6 text-white/40 text-sm border border-white/10 bg-slate-950/40 backdrop-blur-xl">{t("locator_fallback")}</div>}
          {results.map((d) => (
            <div key={d.id} className="liquid-glass rounded-3xl p-6 flex flex-col md:flex-row md:items-center gap-4 animate-in fade-in duration-300 border border-white/10 bg-slate-950/40 backdrop-blur-xl">
              <div className="flex items-start gap-3 flex-1">
                <div className="liquid-glass rounded-full p-3 bg-white/5 border border-white/10"><Store size={18} className="text-white/60" /></div>
                <div>
                  <div className="text-white text-base font-semibold">{d.name}</div>
                  <div className="text-white/40 text-xs flex items-center gap-1.5 mt-0.5"><MapPin size={12} /> {d.address} · {d.distance}</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-white/60"><Package size={13} /> {t("in_stock")} ({d.stock.match(/\d+/)?.[0] || 10} {t("units")})</div>
                <div className="flex items-center gap-1.5 text-white/60"><Clock size={13} /> {d.nextSlot.includes("Today") ? t("today") : t("tomorrow")}, {d.nextSlot.split(", ")[1]} · {d.wait.replace("mins", t("mins"))} {t("wait")}</div>
                <button onClick={() => openBooking({ dealerName: d.name })}
                  className="bg-[#D71920] hover:bg-[#B5141A] rounded-full px-5 py-2 text-white uppercase tracking-widest text-[10px] font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none shadow-[0_4px_15px_rgba(204,0,0,0.15)]">
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
