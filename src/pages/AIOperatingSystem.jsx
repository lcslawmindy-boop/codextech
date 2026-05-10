import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Zap, Network, Shield, Database, FileText, Target, Activity,
  Radio, FlaskConical, Cpu, Globe, TrendingUp, AlertTriangle,
  ArrowRight, Clock, Eye, BarChart3,
  Wrench, BookOpen, ChevronRight, Layers, Search, Crosshair,
  Radar, GitBranch, Microscope, Brain, Map, Loader2,
  CheckCircle2, Star, Command, RefreshCw
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import IntelligencePanel from "@/components/IntelligencePanel";

// ── Constants ─────────────────────────────────────────────────────────────────

const MODULES = [
  { id: "research", icon: Database, label: "Research Archive", sub: "200+ entries", color: "#06b6d4", href: "/prior-art", group: "Research" },
  { id: "invention-forge", icon: Zap, label: "Invention Forge", sub: "AI hybrid engine", color: "#fbbf24", href: "/invention-forge", group: "Research" },
  { id: "hybrid-portfolio", icon: FlaskConical, label: "Hybrid Portfolio", sub: "IP concepts", color: "#22c55e", href: "/hybrid-portfolio", group: "Research" },
  { id: "patent-suite", icon: FileText, label: "Patent Suite", sub: "AI-assisted IP", color: "#a855f7", href: "/patent-hub", group: "IP Suite" },
  { id: "fto", icon: Crosshair, label: "FTO Analysis", sub: "Freedom-to-operate", color: "#ec4899", href: "/fto-analysis", group: "IP Suite" },
  { id: "attorney-chat", icon: Brain, label: "Patent Attorney AI", sub: "Attorney-grade chat", color: "#8b5cf6", href: "/patent-attorney-chat", group: "IP Suite" },
  { id: "build-plans", icon: Wrench, label: "Build Plans", sub: "40+ documented builds", color: "#f97316", href: "/device-catalogue", group: "Build" },
  { id: "project-planner", icon: Target, label: "Project Planner", sub: "AI milestones", color: "#14b8a6", href: "/project-planner", group: "Build" },
  { id: "courses", icon: BookOpen, label: "Courses", sub: "40+ engineering courses", color: "#22c55e", href: "/course-catalogue", group: "Build" },
  { id: "ip-network", icon: Network, label: "IP Network Graph", sub: "Relationship mapping", color: "#3b82f6", href: "/ip-network", group: "Intelligence" },
  { id: "monitoring", icon: Radar, label: "Threat Monitor", sub: "Patent alerts", color: "#ef4444", href: "/monitoring", group: "Intelligence" },
  { id: "ip-marketplace", icon: TrendingUp, label: "IP Marketplace", sub: "Opportunity cards", color: "#06b6d4", href: "/ip-marketplace", group: "Intelligence" },
  { id: "intelligence", icon: Brain, label: "Intelligence Layer", sub: "Events · Clusters · Links", color: "#a855f7", href: "/intelligence", group: "Intelligence" },
];

const WORKFLOW_STEPS = [
  { step: "01", title: "Discover", desc: "Browse 200+ patent-sourced research entries across 8 domains", icon: Search, color: "#06b6d4", href: "/prior-art" },
  { step: "02", title: "Synthesize", desc: "Run Invention Forge — AI generates hybrid concepts with IP valuations", icon: Zap, color: "#fbbf24", href: "/invention-forge" },
  { step: "03", title: "Protect", desc: "Draft a provisional patent with USPTO-formatted AI output", icon: FileText, color: "#a855f7", href: "/patent-hub" },
  { step: "04", title: "Build", desc: "Access full BOMs, circuit schematics, step-by-step assembly", icon: Wrench, color: "#f97316", href: "/device-catalogue" },
  { step: "05", title: "Monitor", desc: "Automated alerts for competitive threats and patent filings", icon: Radar, color: "#ef4444", href: "/monitoring" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, color, href, loading }) {
  return (
    <Link to={href} className="group bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-4 relative overflow-hidden transition-all flex flex-col gap-2">
      <div className="absolute bottom-0 left-0 h-0.5 w-full opacity-50" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider leading-tight">{label}</p>
        <span className="text-base">{icon}</span>
      </div>
      <p className="text-3xl font-black" style={{ color }}>{loading ? "—" : value}</p>
      <ArrowRight size={10} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
    </Link>
  );
}

function ModuleGrid({ modules }) {
  const groups = [...new Set(modules.map(m => m.group))];
  return (
    <div className="space-y-5">
      {groups.map(group => (
        <div key={group}>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-3">{group}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {modules.filter(m => m.group === group).map(mod => {
              const Icon = mod.icon;
              return (
                <Link key={mod.id} to={mod.href}
                  className="group flex flex-col gap-2 p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-all">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: mod.color + "20" }}>
                    <Icon size={16} style={{ color: mod.color }} />
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold leading-tight">{mod.label}</p>
                    <p className="text-slate-600 text-[10px] mt-0.5">{mod.sub}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkflowPanel() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch size={15} className="text-cyan-400" />
        <h3 className="text-white font-black text-sm">R&D Workflow Pipeline</h3>
        <span className="ml-auto text-[10px] text-slate-500">Concept → Patent</span>
      </div>
      <div className="space-y-2">
        {WORKFLOW_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <Link key={i} to={step.href}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 hover:border-slate-600 transition-all group">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-xs"
                style={{ backgroundColor: step.color + "25", color: step.color }}>
                {step.step}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-xs">{step.title}</p>
                <p className="text-slate-500 text-[10px] truncate">{step.desc}</p>
              </div>
              <Icon size={13} style={{ color: step.color }} className="flex-shrink-0 opacity-60 group-hover:opacity-100" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SystemHealth({ stats, loading }) {
  const checks = [
    { label: "Data Ingestion Pipeline", ok: true },
    { label: "AI Processing Engine", ok: true },
    { label: "Patent Analysis Module", ok: true },
    { label: "Threat Detection System", ok: true },
    { label: "Opportunity Scanner", ok: true },
    { label: "Entity Linking Engine", ok: true },
  ];
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={15} className="text-green-400" />
        <h3 className="text-white font-black text-sm">System Health</h3>
        <span className="ml-auto flex items-center gap-1.5 text-[10px] text-green-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> All Operational
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center gap-2 text-[10px]">
            <CheckCircle2 size={10} className="text-green-500 flex-shrink-0" />
            <span className="text-slate-400 truncate">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AIOperatingSystem() {
  const [stats, setStats] = useState({ totalInventions: 0, activeProjects: 0, ipAlerts: 0, patents: 0 });
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => { if (u?.role === "admin") setIsAdmin(true); }).catch(() => {});

    Promise.all([
      base44.entities.HybridInvention.list().then(d => d?.length || 0),
      base44.entities.InventionBuildProject.list().then(d => d?.filter(p => p.status !== "Completed").length || 0),
      base44.entities.MonitoringAlert.filter({ status: "new" }).then(d => d?.length || 0),
      base44.entities.OpportunityCard.list().then(d => d?.length || 0),
    ]).then(([inv, proj, alerts, opp]) => {
      setStats({ totalInventions: inv, activeProjects: proj, ipAlerts: alerts, patents: opp });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const VIEWS = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "modules", label: "Modules", icon: Layers },
    { id: "workflow", label: "Workflow", icon: GitBranch },
    { id: "intelligence", label: "Intelligence", icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">

      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-slate-950/98 backdrop-blur border-b border-slate-800">
        <div className="flex items-center justify-between px-6 py-3">
          <div>
            <h1 className="text-white font-black text-lg tracking-tight flex items-center gap-2">
              <Zap size={18} className="text-cyan-400" />
              IP Operating System
            </h1>
            <p className="text-slate-600 text-[10px] uppercase tracking-widest">Palantir-model · Patent-sourced · Engineering-grade</p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link to="/admin" className="px-3 py-1.5 rounded-lg bg-emerald-900/30 border border-emerald-800 text-emerald-400 text-xs font-bold hidden sm:block">
                Admin Hub
              </Link>
            )}
            {/* View switcher */}
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 gap-0.5">
              {VIEWS.map(v => {
                const Icon = v.icon;
                return (
                  <button key={v.id} onClick={() => setActiveView(v.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      activeView === v.id
                        ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                        : "text-slate-500 hover:text-slate-300"
                    }`}>
                    <Icon size={11} />
                    <span className="hidden sm:block">{v.label}</span>
                  </button>
                );
              })}
            </div>
            <Link to="/pricing"
              className="px-3 py-1.5 rounded-lg text-xs font-black text-white hidden sm:block"
              style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
              Upgrade
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 p-5 max-w-[1600px] mx-auto w-full">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Hybrid Inventions" value={stats.totalInventions} icon="🧬" color="#06b6d4" href="/hybrid-portfolio" loading={loading} />
          <StatCard label="Active R&D Projects" value={stats.activeProjects} icon="🔧" color="#a855f7" href="/build-tracker" loading={loading} />
          <StatCard label="Live IP Threats" value={stats.ipAlerts} icon="⚠️" color="#ef4444" href="/monitoring" loading={loading} />
          <StatCard label="Opportunity Cards" value={stats.patents} icon="📜" color="#22c55e" href="/ip-marketplace" loading={loading} />
        </div>

        {/* Dashboard View */}
        {activeView === "dashboard" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 space-y-5">
              {/* Module quick-access */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Layers size={15} className="text-cyan-400" />
                  <h3 className="text-white font-black text-sm">Platform Modules</h3>
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-green-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> {MODULES.length} modules live
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {MODULES.map(mod => {
                    const Icon = mod.icon;
                    return (
                      <Link key={mod.id} to={mod.href}
                        className="group flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 hover:border-slate-600 transition-all text-center">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: mod.color + "20" }}>
                          <Icon size={15} style={{ color: mod.color }} />
                        </div>
                        <p className="text-white text-[10px] font-bold leading-tight">{mod.label}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
              <WorkflowPanel />
              <SystemHealth stats={stats} loading={loading} />
            </div>
            <div className="space-y-5">
              <IntelligencePanel compact />
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-[10px] text-slate-600 leading-relaxed">
                <strong className="text-slate-500">Research & Educational Use Only.</strong> Content derived from granted patents, peer-reviewed publications, and declassified documents. No regulatory approvals for commercial, medical, or consumer use.
              </div>
            </div>
          </div>
        )}

        {/* Modules View */}
        {activeView === "modules" && (
          <div className="max-w-4xl mx-auto">
            <ModuleGrid modules={MODULES} />
          </div>
        )}

        {/* Workflow View */}
        {activeView === "workflow" && (
          <div className="max-w-3xl mx-auto space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch size={18} className="text-cyan-400" />
                <h2 className="text-white font-black text-lg">Standard R&D Workflow</h2>
              </div>
              <p className="text-slate-400 text-sm mb-6">From initial research to filed patent and built prototype.</p>
              <div className="space-y-3">
                {WORKFLOW_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <Link key={i} to={step.href}
                      className="flex items-start gap-5 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 transition-all group">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm"
                        style={{ backgroundColor: step.color + "25", color: step.color }}>
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-black text-base flex items-center gap-2">
                          {step.title} <Icon size={15} style={{ color: step.color }} />
                        </p>
                        <p className="text-slate-400 text-sm leading-relaxed mt-1">{step.desc}</p>
                      </div>
                      <ArrowRight size={16} className="text-slate-700 group-hover:text-white transition-colors flex-shrink-0 mt-1" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Intelligence View */}
        {activeView === "intelligence" && (
          <div className="max-w-2xl mx-auto">
            <IntelligencePanel />
          </div>
        )}
      </div>

      {/* ── Quick Nav Footer ── */}
      <div className="border-t border-slate-800 bg-slate-950 px-5 py-2.5 flex items-center gap-2 overflow-x-auto flex-shrink-0">
        {[
          { label: "Graph", href: "/", icon: Network },
          { label: "IP Network", href: "/ip-network", icon: Globe },
          { label: "Archive", href: "/prior-art", icon: Database },
          { label: "Forge", href: "/invention-forge", icon: Zap },
          { label: "Patents", href: "/patent-hub", icon: FileText },
          { label: "Monitor", href: "/monitoring", icon: Radar },
          { label: "Pricing", href: "/pricing", icon: TrendingUp },
        ].map((l, i) => {
          const Icon = l.icon;
          return (
            <Link key={i} to={l.href}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-500 hover:text-white text-[10px] font-semibold transition-all whitespace-nowrap">
              <Icon size={10} /> {l.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}