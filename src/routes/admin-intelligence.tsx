import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  Database, 
  Brain, 
  Search, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  Loader2,
  Calendar,
  Layers,
  ArrowLeft
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { getAdminMetrics } from "@/lib/api/vehicle.functions";

export const Route = createFileRoute("/admin-intelligence")({
  head: () => ({
    meta: [
      { title: "Admin Intelligence Panel — Bridgestone India" },
      { name: "description", content: "Real-time AI discovery telemetry and database audit logs." },
    ],
  }),
  component: AdminIntelligencePage,
});

interface MetricsState {
  totalStoredCount: number;
  discoveredCount: number;
  geminiCallsCount: number;
  geminiSuccessesCount: number;
  mostSearched: Array<{ id: string; name: string; searchCount: number }>;
  auditLogs: Array<{
    query: string;
    timestamp: string;
    resolvedTo: string | null;
    method: string;
    confidenceScore: number;
  }>;
}

function AdminIntelligencePage() {
  const [metrics, setMetrics] = useState<MetricsState | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await getAdminMetrics();
      setMetrics(data as any);
    } catch (e) {
      console.error("Failed to load admin metrics:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const successRate = metrics 
    ? metrics.geminiCallsCount > 0 
      ? Math.round((metrics.geminiSuccessesCount / metrics.geminiCallsCount) * 100) 
      : 100 
    : 100;

  return (
    <PageShell>
      <section className="max-w-6xl mx-auto px-6 pt-6 pb-16 relative z-10 text-white font-sans">
        
        {/* Back Link */}
        <div className="mb-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Search Hub
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#D71920] font-extrabold flex items-center gap-1.5">
              <Brain size={12} /> System Telemetry
            </span>
            <h1 className="text-4xl md:text-5xl font-light text-white mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Admin <em className="italic text-[#D71920]">Intelligence</em> Panel.
            </h1>
            <p className="text-white/60 text-xs mt-1.5 max-w-xl">
              Real-time monitoring of vehicle specs database size, AI search resolution rates, and self-learning pipelines.
            </p>
          </div>
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-5 py-2 text-xs uppercase tracking-wider font-extrabold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : null}
            Refresh Metrics
          </button>
        </div>

        {loading && !metrics ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="animate-spin text-[#D71920]" size={48} strokeWidth={1.5} />
            <p className="text-white/60 text-sm font-light uppercase tracking-widest">Compiling Database Metrics...</p>
          </div>
        ) : metrics ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="liquid-glass rounded-3xl p-5 border border-white/10 bg-slate-950/40 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-3 text-white/40">
                  <Database size={16} className="text-[#D71920]" />
                  <span className="text-[10px] uppercase tracking-widest font-extrabold">Total Stored</span>
                </div>
                <div className="text-4xl text-white font-light mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {metrics.totalStoredCount}
                </div>
                <div className="text-white/40 text-[10px]">
                  Total vehicle specifications stored
                </div>
              </div>

              <div className="liquid-glass rounded-3xl p-5 border border-white/10 bg-slate-950/40 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-3 text-white/40">
                  <Brain size={16} className="text-purple-400" />
                  <span className="text-[10px] uppercase tracking-widest font-extrabold">AI Learned</span>
                </div>
                <div className="text-4xl text-white font-light mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {metrics.discoveredCount}
                </div>
                <div className="text-white/40 text-[10px]">
                  Dynamically resolved by Gemini API
                </div>
              </div>

              <div className="liquid-glass rounded-3xl p-5 border border-white/10 bg-slate-950/40 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-3 text-white/40">
                  <Search size={16} className="text-cyan-400" />
                  <span className="text-[10px] uppercase tracking-widest font-extrabold">AI Discovery Calls</span>
                </div>
                <div className="text-4xl text-white font-light mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {metrics.geminiCallsCount}
                </div>
                <div className="text-white/40 text-[10px]">
                  API requests triggered on query misses
                </div>
              </div>

              <div className="liquid-glass rounded-3xl p-5 border border-white/10 bg-slate-950/40 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-3 text-white/40">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-[10px] uppercase tracking-widest font-extrabold">Gemini Success Rate</span>
                </div>
                <div className="text-4xl text-white font-light mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {successRate}%
                </div>
                <div className="text-white/40 text-[10px]">
                  Structured JSON extraction parsing rate
                </div>
              </div>

            </div>

            {/* Middle Content Row: Most Searched + Discovery Audit Log */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Most Searched Vehicles */}
              <div className="lg:col-span-4 liquid-glass rounded-3xl p-6 border border-white/10 bg-slate-950/40 backdrop-blur-xl">
                <span className="text-[10px] uppercase tracking-widest text-[#D71920] font-extrabold flex items-center gap-1.5 mb-4">
                  <TrendingUp size={12} /> Popular Searches
                </span>
                
                {metrics.mostSearched.length === 0 ? (
                  <div className="text-center py-12 text-xs text-white/30">
                    No search telemetry records logged yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {metrics.mostSearched.slice(0, 10).map((v, index) => (
                      <div 
                        key={v.id} 
                        className="bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-3 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[10px] text-white/30 font-bold w-4">
                            #{index + 1}
                          </span>
                          <div>
                            <span className="font-bold text-white block capitalize">
                              {v.name}
                            </span>
                            <span className="text-[9px] text-white/40 font-mono">
                              ID: {v.id}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="bg-[#D71920]/15 text-[#D71920] border border-[#D71920]/20 font-bold px-2 py-0.5 rounded text-[10px]">
                            {v.searchCount} hits
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Real-Time Audit Log */}
              <div className="lg:col-span-8 liquid-glass rounded-3xl p-6 border border-white/10 bg-slate-950/40 backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D71920] font-extrabold flex items-center gap-1.5 mb-4">
                    <Activity size={12} /> Real-Time Search Resolution Audit Log
                  </span>

                  {metrics.auditLogs.length === 0 ? (
                    <div className="text-center py-24 text-xs text-white/30">
                      No search logs recorded. Submit a vehicle search to generate live audits.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-white/40 uppercase tracking-wider text-[9px] font-bold">
                            <th className="py-2.5 px-3">Query</th>
                            <th className="py-2.5 px-3">Resolved To</th>
                            <th className="py-2.5 px-3 text-center">Method</th>
                            <th className="py-2.5 px-3 text-center">Confidence</th>
                            <th className="py-2.5 px-3 text-right">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-white/80">
                          {metrics.auditLogs.slice(0, 12).map((log, index) => {
                            const date = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                            return (
                              <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-3 px-3 font-semibold text-white">"{log.query}"</td>
                                <td className="py-3 px-3 font-mono text-[10px] text-white/60">
                                  {log.resolvedTo || <span className="text-red-400">UNRESOLVED</span>}
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                    log.method === "gemini_discovered"
                                      ? "bg-purple-500/20 text-purple-400 border border-purple-500/20"
                                      : log.method === "static"
                                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                                      : log.method === "learned"
                                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/20"
                                      : "bg-red-500/20 text-red-400 border border-red-500/20"
                                  }`}>
                                    {log.method.toUpperCase()}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-center font-bold font-mono">
                                  {log.confidenceScore > 0 ? `${Math.round(log.confidenceScore * 100)}%` : "—"}
                                </td>
                                <td className="py-3 px-3 text-right text-white/40">{date}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {metrics.auditLogs.length > 0 && (
                  <div className="text-[10px] text-white/40 text-right mt-4 pt-3 border-t border-white/5">
                    Showing latest {Math.min(12, metrics.auditLogs.length)} queries. Database updates written to data/vehicles.json.
                  </div>
                )}
              </div>

            </div>

          </div>
        ) : (
          <div className="text-center py-24 text-white/40 text-xs">
            Metrics not available. Ensure server database files are writable.
          </div>
        )}

      </section>
    </PageShell>
  );
}
