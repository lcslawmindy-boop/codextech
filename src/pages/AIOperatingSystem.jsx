import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Network, TrendingUp, Lock, AlertCircle, CheckCircle2, Clock, BarChart3, Target, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AIOperatingSystem() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalInventions: 0,
    activeProjects: 0,
    ipAlerts: 0,
    patents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u?.role === 'admin') setIsAdmin(true);
    }).catch(() => {});

    // Load stats
    Promise.all([
      base44.entities.HybridInvention.list().then(d => d?.length || 0),
      base44.entities.InventionBuildProject.list().then(d => d?.filter(p => p.status !== 'Completed').length || 0),
      base44.entities.MonitoringAlert.list().then(d => d?.filter(a => a.status === 'new').length || 0),
      base44.entities.OpportunityCard.list().then(d => d?.length || 0),
    ]).then(([inv, proj, alerts, opp]) => {
      setStats({ totalInventions: inv, activeProjects: proj, ipAlerts: alerts, patents: opp });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-slate-700" />
          <div>
            <h1 className="text-white font-black text-lg tracking-tight flex items-center gap-2">
              <Zap size={18} className="text-cyan-400" /> ZARP AI Operating System
            </h1>
            <p className="text-slate-400 text-xs">Global R&D & Intellectual Property Creation</p>
          </div>
        </div>
        {isAdmin && <span className="text-xs px-3 py-1 rounded-full bg-emerald-900/40 border border-emerald-700 text-emerald-300">Admin</span>}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 bg-slate-950/40 px-6 py-3 flex items-center gap-1">
        {[
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "projects", label: "R&D Projects", icon: "🔬" },
          { id: "ip", label: "IP Portfolio", icon: "🏛️" },
          { id: "monitoring", label: "Threat Monitor", icon: "🛡️" },
          { id: "ai-insights", label: "AI Insights", icon: "⚡" }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === t.id
                ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-300"
                : "text-slate-400 hover:bg-slate-800/50 border border-transparent"
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Inventions", value: stats.totalInventions, icon: "🧬", color: "cyan" },
            { label: "Active Projects", value: stats.activeProjects, icon: "🔧", color: "purple" },
            { label: "IP Alerts", value: stats.ipAlerts, icon: "⚠️", color: "orange" },
            { label: "Patent Opportunities", value: stats.patents, icon: "📜", color: "green" }
          ].map((s, i) => (
            <div key={i} className={`bg-slate-900/60 border border-slate-800 rounded-lg p-4 relative overflow-hidden group`}>
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity`} 
                style={{background: s.color === "cyan" ? "#06b6d4" : s.color === "purple" ? "#a855f7" : s.color === "orange" ? "#f97316" : "#10b981"}} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{s.label}</p>
                  <span className="text-xl">{s.icon}</span>
                </div>
                <p className={`text-3xl font-black tracking-tight ${
                  s.color === "cyan" ? "text-cyan-400" :
                  s.color === "purple" ? "text-purple-400" :
                  s.color === "orange" ? "text-orange-400" : "text-green-400"
                }`}>
                  {loading ? "—" : s.value}
                </p>
              </div>
              <div className={`absolute bottom-0 left-0 h-0.5 w-full ${
                s.color === "cyan" ? "bg-gradient-to-r from-cyan-500 to-transparent" :
                s.color === "purple" ? "bg-gradient-to-r from-purple-500 to-transparent" :
                s.color === "orange" ? "bg-gradient-to-r from-orange-500 to-transparent" : "bg-gradient-to-r from-green-500 to-transparent"
              }`} />
            </div>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-6">
              <h2 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                <Network size={18} className="text-cyan-400" /> System Status
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {[
                  { label: "Data Ingestion", status: "active", color: "green" },
                  { label: "AI Processing", status: "active", color: "green" },
                  { label: "Patent Analysis", status: "optimizing", color: "yellow" },
                  { label: "Threat Detection", status: "active", color: "green" }
                ].map((s, i) => (
                  <div key={i} className="bg-slate-800/40 rounded p-3 border border-slate-700">
                    <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">{s.label}</p>
                    <p className={`text-sm font-bold flex items-center gap-1 ${
                      s.color === "green" ? "text-green-400" : "text-yellow-400"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${s.color === "green" ? "bg-green-500" : "bg-yellow-500"} animate-pulse`} />
                      {s.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-6">
              <h2 className="text-white font-black text-lg mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Create Invention", href: "/invention-forge", icon: "🧬" },
                  { label: "File Patent", href: "/patent-drafting-wizard", icon: "📜" },
                  { label: "IP Analysis", href: "/patent-intelligence", icon: "🔍" },
                  { label: "Build Tracker", href: "/build-tracker", icon: "🔧" }
                ].map((a, i) => (
                  <Link key={i} to={a.href}
                    className="bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50 rounded-lg p-3 text-center transition-all">
                    <p className="text-xl mb-1">{a.icon}</p>
                    <p className="text-xs font-bold text-slate-300">{a.label}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-6">
            <h2 className="text-white font-black text-lg mb-4 flex items-center gap-2">
              <Target size={18} className="text-purple-400" /> Active R&D Projects
            </h2>
            <p className="text-slate-400 text-sm">Project tracking and milestone management coming soon.</p>
          </div>
        )}

        {activeTab === "ip" && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-6">
            <h2 className="text-white font-black text-lg mb-4 flex items-center gap-2">
              <FileText size={18} className="text-emerald-400" /> IP Portfolio
            </h2>
            <p className="text-slate-400 text-sm">Patent landscape, prior art analysis, and valuation dashboard.</p>
          </div>
        )}

        {activeTab === "monitoring" && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-6">
            <h2 className="text-white font-black text-lg mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-400" /> Threat Monitoring
            </h2>
            <p className="text-slate-400 text-sm">Real-time suppression patterns, competing patents, and market threats.</p>
          </div>
        )}

        {activeTab === "ai-insights" && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-6">
            <h2 className="text-white font-black text-lg mb-4 flex items-center gap-2">
              <Zap size={18} className="text-cyan-400" /> AI Insights
            </h2>
            <p className="text-slate-400 text-sm">Machine learning recommendations for R&D prioritization and market gaps.</p>
          </div>
        )}
      </div>
    </div>
  );
}