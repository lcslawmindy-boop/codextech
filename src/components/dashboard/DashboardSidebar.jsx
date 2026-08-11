import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home, Database, Cpu, FileText, Download, Rss, FolderKanban,
  Briefcase, GraduationCap, Settings, ChevronLeft, ChevronRight,
  Zap, Plus, Search, ArrowRight, Lock
} from "lucide-react";

const NAV_SECTIONS = [
  { icon: <Home size={16} />, label: "Home Dashboard", path: "/" },
  { icon: <Database size={16} />, label: "Research Graph", path: "/research-explorer" },
  { icon: <Cpu size={16} />, label: "Device Builder", path: "/invention-forge" },
  { icon: <FileText size={16} />, label: "IP Drafting Suite", path: "/patent-tool" },
  { icon: <Download size={16} />, label: "Export Center", path: "/download-center" },
  { icon: <Rss size={16} />, label: "Innovation Feed", path: "/opportunity-monitor" },
  { icon: <FolderKanban size={16} />, label: "My Collections", path: "/my-research" },
  { icon: <Briefcase size={16} />, label: "Licensing Hub", path: "/licensing-hub" },
  { icon: <GraduationCap size={16} />, label: "Research Academy", path: "/research-academy" },
  { icon: <Settings size={16} />, label: "Settings", path: "/account" },
];

export default function DashboardSidebar({ user, collapsed, onToggle }) {
  const planBadge = user?.role === "admin" ? "ENTERPRISE" : "PRO";
  const badgeColor = planBadge === "ENTERPRISE" ? "hsl(var(--zarp-violet))" : "hsl(var(--zarp-gold))";

  return (
    <aside className={`fixed left-0 top-0 h-full bg-zarp-card border-r border-zarp-border transition-all duration-300 z-40 ${collapsed ? "w-16" : "w-60"}`}>
      {/* User header */}
      <div className="p-4 border-b border-zarp-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zarp-gold to-zarp-blue flex items-center justify-center text-zarp-bg font-bold text-sm flex-shrink-0">
            {(user?.full_name || "U")[0]}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-zarp-text text-sm font-semibold truncate">{user?.full_name || "Researcher"}</p>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider" style={{ backgroundColor: badgeColor + '20', color: badgeColor }}>
                {planBadge}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="p-2 space-y-0.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {NAV_SECTIONS.map(item => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              collapsed ? "justify-center" : ""
            } text-zarp-muted hover:text-zarp-text hover:bg-zarp-elevated`}
            title={collapsed ? item.label : ""}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Upgrade prompt */}
      {!collapsed && planBadge !== "ENTERPRISE" && (
        <div className="absolute bottom-16 left-2 right-2 p-3 rounded-xl border border-zarp-violet/30 bg-zarp-violet/5">
          <div className="flex items-center gap-2 mb-1">
            <Lock size={12} className="text-zarp-violet" />
            <span className="text-zarp-violet text-[10px] font-bold uppercase tracking-wider">Upgrade</span>
          </div>
          <p className="text-zarp-muted text-[10px] leading-relaxed mb-2">Unlock Multi-System Integration Analysis and white-label exports.</p>
          <Link to="/pricing" className="block w-full text-center px-2 py-1.5 rounded-lg text-[10px] font-bold text-zarp-bg" style={{ backgroundColor: 'hsl(var(--zarp-violet))' }}>
            Go Enterprise
          </Link>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-zarp-elevated border border-zarp-border flex items-center justify-center text-zarp-muted hover:text-zarp-text"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}