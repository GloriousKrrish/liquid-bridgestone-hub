import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Truck, Gauge, IndianRupee, ShieldCheck, ArrowRight, TrendingDown } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useLanguage } from "@/lib/LanguageContext";
import { useModals } from "@/lib/ModalContext";

export const Route = createFileRoute("/fleet-portal")({
  head: () => ({
    meta: [
      { title: "Fleet Portal — Bridgestone India" },
      { name: "description", content: "Estimate fleet-wide tyre lifecycle savings, uptime, and CO₂ reductions with Bridgestone's enterprise portal." },
      { property: "og:title", content: "Fleet Portal — Bridgestone India" },
      { property: "og:description", content: "Enterprise tyre lifecycle, uptime and CO₂ projections for Indian fleets." },
    ],
  }),
  component: FleetPortalPage,
});

function FleetPortalPage() {
  const { t } = useLanguage();
  const { openFleetDesk } = useModals();
  const [vehicles, setVehicles] = useState(120);
  const [kmPerMonth, setKmPerMonth] = useState(8500);

  const summary = useMemo(() => {
    const tyresPerVehicle = 6;
    const tyreLifeKm = 95000;
    const replacementsPerYear = (vehicles * tyresPerVehicle * (kmPerMonth * 12)) / tyreLifeKm;
    const savingsInr = Math.round(replacementsPerYear * 1850);
    const uptimeGainHrs = Math.round(vehicles * 11.4);
    const co2TonsSaved = Math.round((vehicles * kmPerMonth * 12 * 0.0042) / 1000);
    return { replacements: Math.round(replacementsPerYear), savingsInr, uptimeGainHrs, co2TonsSaved };
  }, [vehicles, kmPerMonth]);

  const fmtInr = (n: number) => n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(1)} L` : `₹${n.toLocaleString("en-IN")}`;

  return (
    <PageShell>
      <section className="max-w-5xl mx-auto px-6 pt-6 pb-16 relative z-10">
        <span className="text-[10px] uppercase tracking-widest text-white/40">{t("fleet_portal")} · Demo</span>
        <h1 className="text-4xl md:text-6xl text-white mt-2 mb-4 font-light" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {t("fleet_title")} <em className="italic">{t("fleet_italic")}</em>.
        </h1>
        <p className="text-white/60 text-sm max-w-2xl mb-8">{t("fleet_desc")}</p>

        <div className="liquid-glass rounded-3xl p-6 md:p-8 grid md:grid-cols-2 gap-6 mb-8 border border-white/10 bg-slate-950/40 backdrop-blur-xl">
          <FleetInput label={t("fleet_size")} suffix={t("vehicles")} value={vehicles} min={5} max={2000} step={5} onChange={setVehicles} icon={<Truck size={16} />} />
          <FleetInput label={t("avg_monthly_run")} suffix={t("km_vehicle")} value={kmPerMonth} min={500} max={25000} step={250} onChange={setKmPerMonth} icon={<Gauge size={16} />} />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard icon={<IndianRupee size={16} />} label={t("projected_saving")} value={fmtInr(summary.savingsInr)} sub={t("vs_benchmark")} />
          <SummaryCard icon={<TrendingDown size={16} />} label={t("tyre_replacements")} value={summary.replacements.toLocaleString("en-IN")} sub={t("optimized_rotation")} />
          <SummaryCard icon={<ShieldCheck size={16} />} label={t("uptime_gained")} value={`${summary.uptimeGainHrs.toLocaleString("en-IN")} hrs`} sub={t("fewer_roadside")} />
          <SummaryCard icon={<Gauge size={16} />} label={t("co2_avoided")} value={`${summary.co2TonsSaved.toLocaleString("en-IN")} t`} sub={t("lower_rolling")} />
        </div>

        <div className="liquid-glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-white/10 bg-slate-950/40 backdrop-blur-xl">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#D71920] font-bold mb-1">{t("enterprise_onboarding")}</div>
            <div className="text-2xl md:text-3xl text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{t("activate_toteline")}</div>
            <div className="text-white/40 text-xs mt-2 max-w-md">{t("toteline_intro")}</div>
          </div>
          <button onClick={openFleetDesk}
            className="bg-[#D71920] hover:bg-[#B5141A] rounded-full px-6 py-3 text-white uppercase tracking-widest text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-[0_4px_15px_rgba(204,0,0,0.15)] focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none">
            {t("talk_to_fleet")} <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </PageShell>
  );
}

interface FleetInputProps {
  label: string;
  suffix: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  icon: React.ReactNode;
}

function FleetInput({ label, suffix, value, min, max, step, onChange, icon }: FleetInputProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-white/40">{icon}</span>
        <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">{label}</span>
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <input type="number" value={value} min={min} max={max} onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
          className="bg-transparent border-none outline-none text-white text-4xl font-light w-32 focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none rounded"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }} />
        <span className="text-white/40 text-xs uppercase tracking-widest font-semibold">{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#D71920] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none rounded" />
    </div>
  );
}

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}

function SummaryCard({ icon, label, value, sub }: SummaryCardProps) {
  return (
    <div className="liquid-glass rounded-3xl p-5 border border-white/10 bg-slate-950/40 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-3 text-white/40">{icon}<span className="text-[10px] uppercase tracking-widest font-semibold">{label}</span></div>
      <div className="text-3xl text-white leading-none mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
      <div className="text-white/40 text-[11px]">{sub}</div>
    </div>
  );
}
