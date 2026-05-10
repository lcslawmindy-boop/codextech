import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Zap, Network, Shield, Database, FileText, Target, Activity,
  Radio, FlaskConical, Cpu, Globe, TrendingUp, AlertTriangle,
  ArrowRight, CheckCircle2, Clock, Lock, Eye, BarChart3,
  Wrench, BookOpen, ChevronRight, Layers, Search, Crosshair,
  Radar, GitBranch, Microscope, Brain, Map
} from "lucide-react";
import { base44 } from "@/api/base44Client";

// ── Module Definitions ────────────────────────────────────────────────────────

const MODULES = [
  {
    id: "research",
    icon: <Database size={18} className="text-cyan-400" />,
    label: "Research Archive",
    sub: "200+ patent-sourced entries",
    color: "#06b6d4",
    href: "/prior-art",
    status: "live",
    desc: "Historical patent analysis · EM theory library · Prior art cross-reference database",
    metrics: [{ label: "Entries", val: "200+" }, { label: "Domains", val: "8" }, { label: "Citations", val: "40+" }],
  },
  {
    id: "invention-forge",
    icon: <Zap size={18} className="text-yellow-400" />,
    label: "Invention Forge",
    sub: "AI hybrid concept engine",
    color: "#fbbf24",
    href: "/invention-forge",
    status: "live",
    desc: "Hybrid concept synthesis · IP valuation · Patent claim generation · Commercialization roadmap",
    metrics: [{ label: "Concepts", val: "∞" }, { label: "Domains", val: "Cross" }, { label: "Output", val: "Patent-ready" }],
  },
  {
    id: "patent-suite",
    icon: <FileText size={18} className="text-purple-400" />,
    label: "Patent Intelligence Suite",
    sub: "AI-assisted IP analysis",
    color: "#a855f7",
    href: "/patent-hub",
    status: "live",
    desc: "USPTO drafting wizard · Novelty analysis · FTO research · Threat monitoring · Attorney AI chat",
    metrics: [{ label: "Tools", val: "5" }, { label: "Format", val: "USPTO" }, { label: "Analysis", val: "AI-grade" }],
  },
  {
    id: "build-plans",
    icon: <Wrench size={18} className="text-orange-400" />,
    label: "Build Plan Library",
    sub: "Engineering-grade documentation",
    color: "#f97316",
    href: "/device-catalogue",
    status: "live",
    desc: "Full BOMs · Circuit schematics · Step-by-step assembly · Verified supplier sourcing",
    metrics: [{ label: "Plans", val: "40+" }, { label: "Categories", val: "8" }, { label: "Avg BOM", val: "24 parts" }],
  },
  {
    id: "courses",
    icon: <BookOpen size={18} className="text-green-400" />,
    label: "Engineering Course Library",
    sub: "Structured technical learning",
    color: "#22c55e",
    href: "/course-catalogue",
    status: "live",
    desc: "RF systems · Resonance engineering · EM instrumentation · Signal analysis · FPGA & embedded",
    metrics: [{ label: "Courses", val: "40+" }, { label: "Tracks", val: "8" }, { label: "Level", val: "Beg–Adv" }],
  },
  {
    id: "ip-network",
    icon: <Network size={18} className="text-blue-400" />,
    label: "IP Network Graph",
    sub: "Concept relationship mapping",
    color: "#3b82f6",
    href: "/ip-network",
    status: "live",
    desc: "Patent relationship visualization · Concept cluster analysis · Technology graph navigation",
    metrics: [{ label: "Nodes", val: "100+" }, { label: "Links", val: "300+" }, { label: "Clusters", val: "12" }],
  },
  {
    id: "monitoring",
    icon: <Radar size={18} className="text-red-400" />,
    label: "Threat & Opportunity Monitor",
    sub: "Automated IP intelligence",
    color: "#ef4444",
    href: "/monitoring",
    status: "live",
    desc: "Patent filing alerts · Competitive landscape tracking · Risk scoring · Keyword watchlists",
    metrics: [{ label: "Alert Types", val: "6" }, { label: "Scan Freq", val: "Daily" }, { label: "Risk Levels", val: "4" }],
  },
  {
    id: "project-planner",
    icon: <Target size={18} className="text-teal-400" />,
    label: "R&D Project Planner",
    sub: "AI milestone generation",
    color: "#14b8a6",
    href: "/project-planner",
    status: "live",
    desc: "AI-generated R&D milestones · Build project tracking · Progress dashboards · Parts management",
    metrics: [{ label: "Templates", val: "AI" }, { label: "Phases", val: "5" }, { label: "Output", val: "Actionable" }],
  },
];

const RESEARCH_DOMAINS = [
  { icon: <Radio size={14} />, label: "RF & Signal Systems", color: "#06b6d4" },
  { icon: <Activity size={14} />, label: "Resonance Engineering", color: "#a855f7" },
  { icon: <FlaskConical size={14} />, label: "EM Instrumentation", color: "#22c55e" },
  { icon: <Cpu size={14} />, label: "FPGA & Embedded", color: "#f97316" },
  { icon: <Shield size={14} />, label: "EMI Shielding", color: "#eab308" },
  { icon: <Database size={14} />, label: "Patent Research", color: "#ec4899" },
  { icon: <Microscope size={14} />, label: "Sensor & Measurement", color: "#8b5cf6" },
  { icon: <Globe size={14} />, label: "Bioelectromagnetics", color: "#14b8a6" },
];

const WORKFLOW_STEPS = [
  { step: "01", title: "Discover", desc: "Browse the research archive — 200+ patent-sourced entries across 8 domains", icon: <Search size={16} />, color: "#06b6d4", href: "/prior-art" },
  { step: "02", title: "Synthesize", desc: "Run the Invention Forge — AI generates hybrid concepts with IP valuations", icon: <Zap size={16} />, color: "#fbbf24", href: "/invention-forge" },
  { step: "03", title: "Protect", desc: "Draft a provisional patent with the AI Patent Suite — USPTO-formatted output", icon: <FileText size={16} />, color: "#a855f7", href: "/patent-hub" },
  { step: "04", title: "Build", desc: "Access engineering build plans with full BOMs and step-by-step assembly", icon: <Wrench size={16} />, color: "#f97316", href: "/device-catalogue" },
  { step: "05", title: "Monitor", desc: "Set automated alerts for competitive threats and patent filing activity", icon: <Radar size={16} />, color: "#ef4444", href: "/monitoring" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function ModuleCard({ mod, expanded, onToggle }) {
  return (
    <div
      className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all cursor-pointer hover:border-slate-600"
      style={expanded ? { borderColor: mod.color + "60", boxShadow: `0 0 24px ${mod.color}15` } : {}}
      onClick={onToggle}
    >
      {/* Top accent line */}
      <div className="h-0.5 w-full" style={{ backgroundColor: mod.color }} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: mod.color + "15" }}>
              {mod.icon}
            </div>
            <div>
              <p className="text-white font-black text-sm leading-tight">{mod.label}</p>
              <p className="text-slate-500 text-[10px]">{mod.sub}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] text-green-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> LIVE
            </span>
            <ChevronRight size={13} className={`text-slate-600 transition-transform ${expanded ? "rotate-90" : ""}`} />
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 space-y-3">
            <p className="text-slate-400 text-xs leading-relaxed">{mod.desc}</p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2">
              {mod.metrics.map((m, i) => (
                <div key={i} className="bg-slate-800/60 rounded-lg p-2 text-center">
                  <p className="font-black text-sm" style={{ color: mod.color }}>{m.val}</p>
                  <p className="text-slate-600 text-[10px]">{m.label}</p>
                </div>
              ))}
            </div>

            <Link
              to={mod.href}
              onClick={e => e.stopPropagation()}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-black text-white transition-all"
              style={{ backgroundColor: mod.color + "25", border: `1px solid ${mod.color}50`, color: mod.color }}
            >
              Open Module <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function SystemStatusPanel({ stats, loading }) {
  const statItems = [
    { label: "Hybrid Inventions", value: stats.totalInventions, icon: "🧬", color: "#06b6d4", href: "/hybrid-portfolio" },
    { label: "Active R&D Projects", value: stats.activeProjects, icon: "🔧", color: "#a855f7", href: "/build-tracker" },
    { label: "Live IP Alerts", value: stats.ipAlerts, icon: "⚠️", color: "#ef4444", href: "/monitoring" },
    { label: "Opportunity Cards", value: stats.patents, icon: "📜", color: "#22c55e", href: "/ip-marketplace" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {statItems.map((s, i) => (
        <Link key={i} to={s.href} className="group bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-4 relative overflow-hidden transition-all">
          <div className="absolute bottom-0 left-0 h-0.5 w-full opacity-60" style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{s.label}</p>
            <span className="text-lg">{s.icon}</span>
          </div>
          <p className="text-3xl font-black" style={{ color: s.color }}>{loading ? "—" : s.value}</p>
          <ArrowRight size={10} className="text-slate-700 mt-1 group-hover:text-slate-400 transition-colors" />
        </Link>
      ))}
    </div>
  );
}

function WorkflowPanel() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <GitBranch size={16} className="text-cyan-400" />
        <h3 className="text-white font-black text-sm">Standard R&D Workflow</h3>
        <span className="ml-auto text-[10px] text-slate-500 font-bold uppercase tracking-wider">From concept to patent</span>
      </div>
      <div className="space-y-2">
        {WORKFLOW_STEPS.map((step, i) => (
          <Link key={i} to={step.href}
            className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-slate-600 transition-all group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black text-white" style={{ backgroundColor: step.color + "30", color: step.color }}>
              {step.step}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-xs">{step.title}</p>
              <p className="text-slate-500 text-[10px] truncate">{step.desc}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0" style={{ color: step.color }}>
              {step.icon}
              <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function DomainGrid() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Map size={16} className="text-purple-400" />
        <h3 className="text-white font-black text-sm">Research Domains</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {RESEARCH_DOMAINS.map((d, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
            <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: d.color + "20", color: d.color }}>
              {d.icon}
            </div>
            <p className="text-slate-300 text-[10px] font-semibold leading-tight">{d.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommandBar() {
  const quickLinks = [
    { label: "Concept Graph", href: "/", icon: <Network size={12} /> },
    { label: "IP Network", href: "/ip-network", icon: <Globe size={12} /> },
    { label: "Prior Art Archive", href: "/prior-art", icon: <Database size={12} /> },
    { label: "Invention Forge", href: "/invention-forge", icon: <Zap size={12} /> },
    { label: "Patent Suite", href: "/patent-hub", icon: <FileText size={12} /> },
    { label: "Build Plans", href: "/device-catalogue", icon: <Wrench size={12} /> },
    { label: "Courses", href: "/course-catalogue", icon: <BookOpen size={12} /> },
    { label: "IP Marketplace", href: "/ip-marketplace", icon: <TrendingUp size={12} /> },
    { label: "FTO Analysis", href: "/fto-analysis", icon: <Crosshair size={12} /> },
    { label: "Project Planner", href: "/project-planner", icon: <Target size={12} /> },
    { label: "Hybrid Portfolio", href: "/hybrid-portfolio", icon: <Layers size={12} /> },
    { label: "Monitoring", href: "/monitoring", icon: <Radar size={12} /> },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={16} className="text-yellow-400" />
        <h3 className="text-white font-black text-sm">Platform Command Links</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {quickLinks.map((l, i) => (
          <Link key={i} to={l.href}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-700/50 text-slate-300 hover:text-white transition-all text-xs font-semibold">
            <span className="text-cyan-400">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AIOperatingSystem() {
  const [expandedModule, setExpandedModule] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({ totalInventions: 0, activeProjects: 0, ipAlerts: 0, patents: 0 });
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u?.role === "admin") setIsAdmin(true);
    }).catch(() => {});

    Promise.all([
      base44.entities.HybridInvention.list().then(d => d?.length || 0),
      base44.entities.InventionBuildProject.list().then(d => d?.filter(p => p.status !== "Completed").length || 0),
      base44.entities.MonitoringAlert.list().then(d => d?.filter(a => a.status === "new").length || 0),
      base44.entities.OpportunityCard.list().then(d => d?.length || 0),
    ]).then(([inv, proj, alerts, opp]) => {
      setStats({ totalInventions: inv, activeProjects: proj, ipAlerts: alerts, patents: opp });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const VIEWS = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 size={13} /> },
    { id: "modules", label: "Modules", icon: <Layers size={13} /> },
    { id: "workflow", label: "Workflow", icon: <GitBranch size={13} /> },
    { id: "domains", label: "Domains", icon: <Map size={13} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">

      {/* ── Top Command Bar ── */}
      <div className="sticky top-0 z-50 bg-slate-950/98 backdrop-blur border-b border-slate-800">
        {/* Brand header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800/50">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bce328987_a6e3bd669_logo.png"
                alt="Aethon Apex IP"
                className="h-8 w-8 object-contain"
              />
              <div>
                <p className="text-white font-black text-sm leading-none tracking-tight">Aethon Apex IP</p>
                <p className="text-slate-600 text-[9px] uppercase tracking-widest">AI Operating System</p>
              </div>
            </Link>

            <div className="h-5 w-px bg-slate-800 hidden md:block" />

            {/* System status indicators */}
            <div className="hidden md:flex items-center gap-4 text-[10px]">
              {[
                { label: "Data Ingestion", ok: true },
                { label: "AI Processing", ok: true },
                { label: "Patent Analysis", ok: true },
                { label: "Threat Detection", ok: true },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-slate-500">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link to="/admin" className="px-3 py-1.5 rounded-lg bg-emerald-900/40 border border-emerald-700 text-emerald-300 text-xs font-bold">
                Admin Hub
              </Link>
            )}
            <Link to="/pricing" className="px-3 py-1.5 rounded-lg text-xs font-black text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
              Upgrade Plan
            </Link>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between px-6 py-3">
          <div>
            <h1 className="text-white font-black text-xl tracking-tight flex items-center gap-2">
              <Zap size={20} className="text-cyan-400" />
              AI Operating System
              <span className="text-slate-600 font-normal text-sm">/ Global R&D & IP Creation</span>
            </h1>
            <p className="text-slate-500 text-xs">Palantir-model · Patent-sourced · Engineering-grade · Experimental research platform</p>
          </div>

          {/* View switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 gap-0.5">
            {VIEWS.map(v => (
              <button key={v.id} onClick={() => setActiveView(v.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  activeView === v.id
                    ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                    : "text-slate-500 hover:text-slate-300"
                }`}>
                {v.icon} {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 p-6 max-w-[1400px] mx-auto w-full">

        {/* Stats always visible */}
        <SystemStatusPanel stats={stats} loading={loading} />

        {/* Dashboard View */}
        {activeView === "dashboard" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Left: Modules Grid (2 cols) */}
            <div className="xl:col-span-2 space-y-5">

              {/* Quick-access module grid */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-5">
                  <Layers size={16} className="text-cyan-400" />
                  <h3 className="text-white font-black text-sm">Platform Modules</h3>
                  <span className="ml-auto text-[10px] text-green-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> All Systems Operational
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {MODULES.map((mod) => (
                    <Link key={mod.id} to={mod.href}
                      className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-all text-center"
                      style={{ "--hover-color": mod.color }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                        style={{ backgroundColor: mod.color + "20" }}>
                        {mod.icon}
                      </div>
                      <p className="text-white text-[10px] font-bold leading-snug">{mod.label}</p>
                      <p className="text-slate-600 text-[9px]">{mod.sub}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Workflow */}
              <WorkflowPanel />
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-5">
              <DomainGrid />
              <CommandBar />

              {/* Disclaimer */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-[10px] text-slate-600 leading-relaxed">
                <strong className="text-slate-500">Research & Educational Use Only.</strong> All content is derived from granted patents, peer-reviewed publications, and declassified government documents. No regulatory approvals for commercial, medical, or consumer use. Experimenters are responsible for compliance with local safety standards.
              </div>
            </div>
          </div>
        )}

        {/* Modules View */}
        {activeView === "modules" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {MODULES.map((mod) => (
              <ModuleCard
                key={mod.id}
                mod={mod}
                expanded={expandedModule === mod.id}
                onToggle={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
              />
            ))}
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
              <p className="text-slate-400 text-sm mb-6">A structured pipeline from initial research discovery to filed patent and built prototype.</p>
              <div className="space-y-3">
                {WORKFLOW_STEPS.map((step, i) => (
                  <Link key={i} to={step.href}
                    className="flex items-start gap-5 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 transition-all group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm" style={{ backgroundColor: step.color + "25", color: step.color }}>
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-black text-base flex items-center gap-2">
                        {step.title} <span style={{ color: step.color }}>{step.icon}</span>
                      </p>
                      <p className="text-slate-400 text-sm leading-relaxed mt-1">{step.desc}</p>
                    </div>
                    <ArrowRight size={16} className="text-slate-700 group-hover:text-white transition-colors flex-shrink-0 mt-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Domains View */}
        {activeView === "domains" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { icon: <Radio size={22} />, name: "RF & Signal Systems", color: "#06b6d4", courses: 6, builds: 5, desc: "Transmission line theory, antenna design, oscillator circuits, signal propagation and measurement." },
              { icon: <Activity size={22} />, name: "Resonance Engineering", color: "#a855f7", courses: 5, builds: 6, desc: "LC tank circuits, tuned amplifiers, mechanical resonance, parametric oscillation, cavity resonators." },
              { icon: <FlaskConical size={22} />, name: "EM Instrumentation", color: "#22c55e", courses: 7, builds: 8, desc: "Measurement methodology, field probes, calibration standards, spectrum analyzers, vector network analysis." },
              { icon: <Cpu size={22} />, name: "FPGA & Embedded", color: "#f97316", courses: 5, builds: 4, desc: "Verilog, VHDL, Arduino, STM32, signal processing pipelines, real-time control systems." },
              { icon: <Shield size={22} />, name: "EMI & Shielding", color: "#eab308", courses: 4, builds: 5, desc: "Faraday cage design, filtering, grounding, EMC compliance testing, RF shielding materials." },
              { icon: <Database size={22} />, name: "Patent Research", color: "#ec4899", courses: 8, builds: 0, desc: "Prior art analysis, claim interpretation, historical patent reconstruction, FTO methodology." },
              { icon: <Microscope size={22} />, name: "Sensor & Measurement", color: "#8b5cf6", courses: 5, builds: 6, desc: "Transducer design, ADC/DAC systems, precision measurement, noise analysis, calibration protocols." },
              { icon: <Globe size={22} />, name: "Bioelectromagnetics", color: "#14b8a6", courses: 4, builds: 3, desc: "Biological field interactions (research only), UV biophoton studies, historical research documentation." },
            ].map((d, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                <div className="h-1 w-full" style={{ backgroundColor: d.color }} />
                <div className="p-5 flex-1">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: d.color + "20", color: d.color }}>
                    {d.icon}
                  </div>
                  <p className="text-white font-black text-sm mb-2">{d.name}</p>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">{d.desc}</p>
                  <div className="flex gap-3 text-[10px]">
                    <span className="text-slate-500">{d.courses} courses</span>
                    {d.builds > 0 && <span className="text-slate-500">{d.builds} builds</span>}
                  </div>
                </div>
                <div className="px-5 pb-4">
                  <Link to="/course-catalogue"
                    className="flex items-center gap-1 text-xs font-bold transition-colors hover:opacity-80"
                    style={{ color: d.color }}>
                    Explore <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom Nav ── */}
      <div className="border-t border-slate-800 bg-slate-950 px-6 py-3 flex items-center gap-3 overflow-x-auto flex-shrink-0">
        {[
          { label: "Concept Graph", href: "/", icon: <Network size={11} /> },
          { label: "IP Network", href: "/ip-network", icon: <Globe size={11} /> },
          { label: "Prior Art", href: "/prior-art", icon: <Database size={11} /> },
          { label: "Invention Forge", href: "/invention-forge", icon: <Zap size={11} /> },
          { label: "Patent Suite", href: "/patent-hub", icon: <FileText size={11} /> },
          { label: "Monitoring", href: "/monitoring", icon: <Radar size={11} /> },
          { label: "Pricing", href: "/pricing", icon: <TrendingUp size={11} /> },
        ].map((l, i) => (
          <Link key={i} to={l.href}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-all whitespace-nowrap">
            {l.icon} {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}