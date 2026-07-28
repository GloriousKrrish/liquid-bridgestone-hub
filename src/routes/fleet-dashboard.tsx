import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Activity, AlertTriangle, ArrowRight, BarChart3,
  CheckCircle2, Gauge, Heart, Shield, Thermometer,
  TrendingDown, TrendingUp, Truck, Wrench, Zap,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadialBarChart, RadialBar,
  Cell, PieChart, Pie,
} from "recharts";

export const Route = createFileRoute("/fleet-dashboard")({
  component: FleetDashboardPage,
  head: () => ({
    meta: [
      { title: "Fleet Intelligence Dashboard — Bridgestone India" },
      { name: "description", content: "Real-time fleet operations monitoring — tyre health, pressure analytics, tread life forecasts, and service intelligence." },
    ],
  }),
});

// Simulated fleet telemetry data
const FLEET_HEALTH_SCORE = 87;
const WEAR_TREND = [
  { month: "Jan", wear: 92 }, { month: "Feb", wear: 89 },
  { month: "Mar", wear: 85 }, { month: "Apr", wear: 83 },
  { month: "May", wear: 79 }, { month: "Jun", wear: 76 },
];
const PRESSURE_DATA = [
  { hour: "00:00", avg: 34.2, min: 32.1, max: 36.0 },
  { hour: "04:00", avg: 34.0, min: 31.8, max: 35.8 },
  { hour: "08:00", avg: 35.1, min: 33.2, max: 37.0 },
  { hour: "12:00", avg: 35.8, min: 33.8, max: 37.5 },
  { hour: "16:00", avg: 35.4, min: 33.0, max: 37.2 },
  { hour: "20:00", avg: 34.6, min: 32.5, max: 36.4 },
];
const TEMP_DATA = [
  { zone: "Front Left", temp: 42 }, { zone: "Front Right", temp: 44 },
  { zone: "Rear Left", temp: 39 }, { zone: "Rear Right", temp: 41 },
];
const TREAD_LIFE = [
  { vehicle: "MH-12-AB-1234", remaining: 68, status: "good" },
  { vehicle: "MH-12-CD-5678", remaining: 42, status: "warning" },
  { vehicle: "MH-14-EF-9012", remaining: 85, status: "good" },
  { vehicle: "MH-14-GH-3456", remaining: 22, status: "critical" },
  { vehicle: "MH-12-IJ-7890", remaining: 55, status: "good" },
  { vehicle: "KA-01-KL-2345", remaining: 31, status: "warning" },
];
const SERVICE_ALERTS = [
  { id: 1, type: "critical", vehicle: "MH-14-GH-3456", message: "Tread depth below 2mm — immediate replacement required", time: "12 min ago" },
  { id: 2, type: "warning", vehicle: "MH-12-CD-5678", message: "Pressure deviation >8% on rear axle", time: "45 min ago" },
  { id: 3, type: "info", vehicle: "MH-12-AB-1234", message: "Rotation due at 42,000 km (current: 41,200 km)", time: "2 hrs ago" },
  { id: 4, type: "warning", vehicle: "KA-01-KL-2345", message: "Temperature spike detected — recommend inspection", time: "3 hrs ago" },
];

function MetricCard({ icon, label, value, sub, trend }: {
  icon: React.ReactNode; label: string; value: string; sub: string; trend?: "up" | "down";
}) {
  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#D71920]/20 transition-colors duration-150">
      <div className="flex items-center gap-2 text-[#B3B3B3] mb-3">
        {icon}
        <span className="text-[10px] uppercase tracking-widest font-semibold">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white leading-none">{value}</span>
        {trend && (
          <span className={`text-[10px] font-bold flex items-center gap-0.5 ${trend === "up" ? "text-emerald-400" : "text-[#D71920]"}`}>
            {trend === "up" ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend === "up" ? "+2.3%" : "-1.8%"}
          </span>
        )}
      </div>
      <span className="text-[11px] text-[#B3B3B3] mt-1 block">{sub}</span>
    </div>
  );
}

function FleetDashboardPage() {
  const healthData = useMemo(() => [{ name: "Health", value: FLEET_HEALTH_SCORE, fill: "#D71920" }], []);

  return (
    <PageShell>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-20 relative z-10">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#B3B3B3]">Fleet Intelligence</span>
            <h1 className="text-fluid-h2 font-bold text-white mt-1 tracking-tight">
              Operations Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] text-[#B3B3B3] uppercase tracking-widest font-semibold">Live Telemetry</span>
          </div>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <MetricCard icon={<Heart size={14} />} label="Fleet Health" value={`${FLEET_HEALTH_SCORE}%`} sub="Across 120 vehicles" trend="up" />
          <MetricCard icon={<Gauge size={14} />} label="Avg. Tyre Wear" value="76%" sub="Remaining tread life" trend="down" />
          <MetricCard icon={<Activity size={14} />} label="Pressure Stability" value="34.8 PSI" sub="Fleet average ±1.2" trend="up" />
          <MetricCard icon={<Zap size={14} />} label="Operational Efficiency" value="94.2%" sub="vs 91.8% last month" trend="up" />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-3 mb-6">
          {/* Fleet Health Score Gauge */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
            <h3 className="text-[10px] uppercase tracking-widest text-[#B3B3B3] font-bold mb-3">Fleet Health Score</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={healthData} startAngle={180} endAngle={0}>
                  <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "#2A2A2A" }} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center -mt-16 relative z-10">
              <span className="text-4xl font-bold text-white">{FLEET_HEALTH_SCORE}</span>
              <span className="text-[#B3B3B3] text-sm block mt-0.5">/ 100</span>
            </div>
          </div>

          {/* Tyre Wear Trend */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 lg:col-span-2">
            <h3 className="text-[10px] uppercase tracking-widest text-[#B3B3B3] font-bold mb-3">Average Tyre Wear Trend</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WEAR_TREND}>
                  <defs>
                    <linearGradient id="wearGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D71920" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D71920" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                  <XAxis dataKey="month" tick={{ fill: "#B3B3B3", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fill: "#B3B3B3", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="wear" stroke="#D71920" strokeWidth={2} fill="url(#wearGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pressure + Temperature Row */}
        <div className="grid lg:grid-cols-2 gap-3 mb-6">
          {/* Pressure Stability */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
            <h3 className="text-[10px] uppercase tracking-widest text-[#B3B3B3] font-bold mb-3">Pressure Monitoring (24h)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PRESSURE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                  <XAxis dataKey="hour" tick={{ fill: "#B3B3B3", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[28, 40]} tick={{ fill: "#B3B3B3", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="avg" fill="#D71920" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Temperature Grid */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
            <h3 className="text-[10px] uppercase tracking-widest text-[#B3B3B3] font-bold mb-3">Temperature Monitoring</h3>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {TEMP_DATA.map((zone) => (
                <div
                  key={zone.zone}
                  className={`p-4 rounded-lg border text-center ${
                    zone.temp > 43
                      ? "bg-[#D71920]/10 border-[#D71920]/30"
                      : "bg-[#1A1A1A] border-[#2A2A2A]"
                  }`}
                >
                  <Thermometer size={16} className={zone.temp > 43 ? "text-[#D71920] mx-auto mb-2" : "text-[#B3B3B3] mx-auto mb-2"} />
                  <div className="text-2xl font-bold text-white">{zone.temp}°C</div>
                  <div className="text-[10px] text-[#B3B3B3] uppercase tracking-wider mt-1">{zone.zone}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tread Life + Service Alerts Row */}
        <div className="grid lg:grid-cols-2 gap-3">
          {/* Remaining Tread Life */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
            <h3 className="text-[10px] uppercase tracking-widest text-[#B3B3B3] font-bold mb-4">Remaining Tread Life</h3>
            <div className="space-y-3">
              {TREAD_LIFE.map((v) => (
                <div key={v.vehicle} className="flex items-center gap-3">
                  <span className="text-xs text-white font-mono w-32 shrink-0">{v.vehicle}</span>
                  <div className="flex-1 h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        v.status === "critical" ? "bg-[#E10600]" :
                        v.status === "warning" ? "bg-[#FFD100]" : "bg-emerald-500"
                      }`}
                      style={{ width: `${v.remaining}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold w-10 text-right ${
                    v.status === "critical" ? "text-[#E10600]" :
                    v.status === "warning" ? "text-[#FFD100]" : "text-emerald-400"
                  }`}>
                    {v.remaining}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Alerts */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] uppercase tracking-widest text-[#B3B3B3] font-bold">Service Alerts</h3>
              <span className="text-[9px] uppercase tracking-widest text-[#D71920] font-bold bg-[#D71920]/10 px-2 py-0.5 rounded-full border border-[#D71920]/20">
                {SERVICE_ALERTS.length} Active
              </span>
            </div>
            <div className="space-y-2">
              {SERVICE_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border text-sm ${
                    alert.type === "critical"
                      ? "bg-[#E10600]/5 border-[#E10600]/20"
                      : alert.type === "warning"
                      ? "bg-[#FFD100]/5 border-[#FFD100]/20"
                      : "bg-[#1A1A1A] border-[#2A2A2A]"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {alert.type === "critical" ? (
                      <AlertTriangle size={14} className="text-[#E10600] mt-0.5 shrink-0" />
                    ) : alert.type === "warning" ? (
                      <AlertTriangle size={14} className="text-[#FFD100] mt-0.5 shrink-0" />
                    ) : (
                      <Wrench size={14} className="text-[#B3B3B3] mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-white font-mono font-bold">{alert.vehicle}</span>
                      <p className="text-[11px] text-[#B3B3B3] mt-0.5 leading-snug">{alert.message}</p>
                    </div>
                    <span className="text-[9px] text-[#B3B3B3] shrink-0">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
