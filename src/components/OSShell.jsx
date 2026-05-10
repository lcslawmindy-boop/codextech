import { useState, useEffect, useRef } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  Network, Database, FileText, Wrench, BookOpen, Radar, Target,
  Zap, TrendingUp, Shield, BarChart3, Search, Bell, Settings,
  ChevronRight, X, Command, Globe, Layers, Brain, GitBranch,
  Activity, FlaskConical, Cpu, Radio, Microscope, Map, Menu
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const NAV_ITEMS = [
  { icon: BarChart3, label: "OS Dashboard", href: "/ai-os", color: "#06b6d4", group: "core" },
  { icon: Network, label: "Concept Graph", href: "/", color: "#06b6d4", group: "core" },
  { icon: Globe, label: "IP Network", href: "/ip-network", color: "#3b82f6", group: "core" },
  { icon: Database, label: "Research Archive", href: "/prior-art", color: "#a855f7", group: "research" },
  { icon: Zap, label: "Invention Forge", href: "/invention-forge", color: "#fbbf24", group: "research" },
  { icon: FlaskConical, label: "Hybrid Portfolio", href: "/hybrid-portfolio", color: "#22c55e", group: "research" },
  { icon: FileText, label: "Patent Suite", href: "/patent-hub", color: "#a855f7", group: "ip" },
  { icon: Shield, label: "FTO Analysis", href: "/fto-analysis", color: "#ec4899", group: "ip" },
  { icon: Brain, label: "Patent Attorney AI", href: "/patent-attorney-chat", color: "#8b5cf6", group: "ip" },
  { icon: Wrench, label: "Build Plans", href: "/device-catalogue", color: "#f97316", group: "build" },
  { icon: Target, label: "Project Planner", href: "/project-planner", color: "#14b8a6", group: "build" },
  { icon: BookOpen, label: "Courses", href: "/course-catalogue", color: "#22c55e", group: "build" },
  { icon: Radar, label: "Threat Monitor", href: "/monitoring", color: "#ef4444", group: "intel" },
  { icon: TrendingUp, label: "IP Marketplace", href: "/ip-marketplace", color: "#06b6d4", group: "intel" },
  { icon: Activity, label: "Opportunity Monitor", href: "/opportunity-monitor", color: "#f59e0b", group: "intel" },
  { icon: Brain, label: "Intelligence Layer", href: "/intelligence", color: "#a855f7", group: "intel" },
];

const GROUP_LABELS = {
  core: "CORE",
  research: "RESEARCH",
  ip: "IP SUITE",
  build: "BUILD",
  intel: "INTELLIGENCE",
};

export default function OSShell({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");
  const [alerts, setAlerts] = useState(0);
  const [sideOpen, setSideOpen] = useState(false);
  const cmdRef = useRef(null);

  useEffect(() => {
    base44.entities.MonitoringAlert.filter({ status: "new" })
      .then(d => setAlerts(d?.length || 0))
      .catch(() => {});
  }, []);

  // Cmd+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(o => !o);
        setCmdQuery("");
      }
      if (e.key === "Escape") setCmdOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (cmdOpen) setTimeout(() => cmdRef.current?.focus(), 50);
  }, [cmdOpen]);

  const filteredNav = cmdQuery
    ? NAV_ITEMS.filter(n => n.label.toLowerCase().includes(cmdQuery.toLowerCase()))
    : NAV_ITEMS;

  const groups = [...new Set(NAV_ITEMS.map(n => n.group))];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden">

      {/* ── Left Sidebar ── */}
      <aside className={`
        flex-shrink-0 flex flex-col bg-slate-950 border-r border-slate-800 transition-all duration-200
        ${collapsed ? "w-14" : "w-56"}
        hidden md:flex
      `}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 py-3 border-b border-slate-800 flex-shrink-0">
          <img
            src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bce328987_a6e3bd669_logo.png"
            alt="logo" className="w-8 h-8 object-contain flex-shrink-0"
          />
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white font-black text-xs leading-none truncate">Aethon Apex IP</p>
              <p className="text-slate-600 text-[9px] uppercase tracking-widest">OS v2</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="ml-auto text-slate-600 hover:text-slate-300 transition-colors flex-shrink-0"
          >
            <Menu size={13} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-0.5 px-1.5">
          {groups.map(group => (
            <div key={group}>
              {!collapsed && (
                <p className="text-slate-700 text-[9px] font-black uppercase tracking-widest px-2 pt-3 pb-1">
                  {GROUP_LABELS[group]}
                </p>
              )}
              {NAV_ITEMS.filter(n => n.group === group).map(item => {
                const Icon = item.icon;
                const active = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all group relative ${
                      active
                        ? "bg-slate-800 text-white"
                        : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                    style={active ? { borderLeft: `2px solid ${item.color}`, paddingLeft: 6 } : {}}
                  >
                    <Icon size={14} style={{ color: active ? item.color : undefined }} className="flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {active && !collapsed && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        {!collapsed && (
          <div className="px-3 py-3 border-t border-slate-800 flex-shrink-0">
            <Link to="/pricing"
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-black text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
              <Zap size={11} /> Upgrade Plan
            </Link>
          </div>
        )}
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Top Command Bar ── */}
        <header className="flex-shrink-0 h-12 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/98 backdrop-blur z-40">
          {/* Mobile menu */}
          <button className="md:hidden text-slate-500 hover:text-slate-200 mr-2" onClick={() => setSideOpen(true)}>
            <Menu size={16} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 min-w-0">
            <span className="text-slate-600 hidden sm:block">Aethon Apex</span>
            <ChevronRight size={10} className="text-slate-700 hidden sm:block" />
            <span className="text-slate-300 font-semibold truncate">
              {NAV_ITEMS.find(n => n.href === location.pathname)?.label || "Platform"}
            </span>
          </div>

          {/* Center: Cmd K hint */}
          <button
            onClick={() => { setCmdOpen(true); setCmdQuery(""); }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300 transition-all text-xs"
          >
            <Search size={11} />
            <span>Search platform...</span>
            <kbd className="flex items-center gap-0.5 text-[10px] text-slate-600 bg-slate-800 px-1 rounded">
              <Command size={9} /> K
            </kbd>
          </button>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link to="/monitoring" className="relative p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
              <Bell size={14} className="text-slate-500" />
              {alerts > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center">
                  {alerts > 9 ? "9+" : alerts}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-1">
              {[
                { label: "AI", ok: true },
                { label: "Patents", ok: true },
                { label: "Monitor", ok: true },
              ].map((s, i) => (
                <span key={i} className="hidden lg:flex items-center gap-1 text-[9px] text-slate-600">
                  <span className="w-1 h-1 rounded-full bg-green-500" />
                  {s.label}
                </span>
              ))}
            </div>
            <Link to="/account" className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
              <Settings size={14} className="text-slate-500" />
            </Link>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>

      {/* ── Command Palette ── */}
      {cmdOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          onClick={() => setCmdOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-xl mx-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}>
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
              <Search size={15} className="text-slate-500 flex-shrink-0" />
              <input
                ref={cmdRef}
                value={cmdQuery}
                onChange={e => setCmdQuery(e.target.value)}
                placeholder="Search platform modules..."
                className="flex-1 bg-transparent text-white text-sm placeholder-slate-600 outline-none"
              />
              <button onClick={() => setCmdOpen(false)}>
                <X size={14} className="text-slate-600 hover:text-slate-300" />
              </button>
            </div>
            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2">
              {filteredNav.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setCmdOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: item.color + "20" }}>
                      <Icon size={13} style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{item.label}</p>
                      <p className="text-slate-600 text-[10px] uppercase tracking-wider">{GROUP_LABELS[item.group]}</p>
                    </div>
                    <ChevronRight size={12} className="text-slate-700 group-hover:text-slate-400" />
                  </Link>
                );
              })}
              {filteredNav.length === 0 && (
                <p className="text-slate-600 text-sm text-center py-8">No results for "{cmdQuery}"</p>
              )}
            </div>
            <div className="px-4 py-2 border-t border-slate-800 flex items-center gap-3 text-[10px] text-slate-600">
              <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-1 rounded">↑↓</kbd> navigate</span>
              <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-1 rounded">↵</kbd> open</span>
              <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-1 rounded">esc</kbd> close</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Slide-over ── */}
      {sideOpen && (
        <div className="fixed inset-0 z-[90] flex md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSideOpen(false)} />
          <aside className="relative w-64 bg-slate-950 border-r border-slate-800 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bce328987_a6e3bd669_logo.png"
                  alt="logo" className="w-7 h-7 object-contain" />
                <p className="text-white font-black text-xs">Aethon Apex IP</p>
              </div>
              <button onClick={() => setSideOpen(false)}>
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            <nav className="flex-1 py-2 px-2 space-y-0.5">
              {groups.map(group => (
                <div key={group}>
                  <p className="text-slate-700 text-[9px] font-black uppercase tracking-widest px-2 pt-3 pb-1">{GROUP_LABELS[group]}</p>
                  {NAV_ITEMS.filter(n => n.group === group).map(item => {
                    const Icon = item.icon;
                    const active = location.pathname === item.href;
                    return (
                      <Link key={item.href} to={item.href} onClick={() => setSideOpen(false)}
                        className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                          active ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"
                        }`}>
                        <Icon size={14} style={{ color: active ? item.color : undefined }} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}