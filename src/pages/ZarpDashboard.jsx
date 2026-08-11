import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Search, FileText, Download, ArrowRight, Database,
  Cpu, Rss, FolderKanban, TrendingUp, Clock, Bell, Network, Sparkles
} from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const QUICK_ACTIONS = [
  { label: "New Device Build Plan", icon: <Plus size={18} />, color: "gold", path: "/invention-forge" },
  { label: "Explore Research Graph", icon: <Search size={18} />, color: "blue", path: "/research-explorer" },
  { label: "Generate IP Draft", icon: <FileText size={18} />, color: "violet", path: "/patent-tool" },
  { label: "Create Export Package", icon: <Download size={18} />, color: "green", path: "/download-center" },
];

const STATS = [
  { label: "Nodes Explored", value: "127", icon: <Database size={14} /> },
  { label: "Connections Mapped", value: "43", icon: <TrendingUp size={14} /> },
  { label: "Device Plans Created", value: "6", icon: <Cpu size={14} /> },
  { label: "Exports Generated", value: "12", icon: <Download size={14} /> },
  { label: "Research Collections", value: "4", icon: <FolderKanban size={14} /> },
];

const ACTIVE_PROJECTS = [
  { name: "ZARP Neurocognitive Coherence Helmet", nodes: 7, modified: "2 hours ago", status: "Export Ready", color: "#06b6d4" },
  { name: "Scalar Biophoton Bed", nodes: 7, modified: "1 day ago", status: "In Review", color: "#ec4899" },
  { name: "Acoustic Cymatics Regeneration Chamber", nodes: 6, modified: "3 days ago", status: "Draft", color: "#a855f7" },
];

const FEED_ITEMS = [
  { type: "Research Drop", title: "New declassified document: Puharich ELF effects (1953)", time: "2h ago", color: "#C9A84C" },
  { type: "Connection Alert", title: "New edge discovered: Rife MOR ↔ Popp Biophoton", time: "5h ago", color: "#1D6FA4" },
  { type: "Community", title: "Innovator built Pediatric Biofield Harmonizer", time: "1d ago", color: "#10B981" },
  { type: "Grant Deadline", title: "NIH SBIR Phase I — 12 days remaining", time: "2d ago", color: "#F59E0B" },
  { type: "Licensing Opp", title: "Medical device company seeking scalar EM IP", time: "3d ago", color: "#9B30FF" },
];

const RECOMMENDED_NODES = [
  { name: "Schumann Resonance (7.83 Hz)", domain: "Scalar EM", connections: 8, status: "Mainstream", color: "#06b6d4" },
  { name: "Prioré Multiwave Oscillator", domain: "Bioelectromagnetics", connections: 12, status: "Suppressed", color: "#ec4899" },
  { name: "Persinger God Helmet", domain: "Neurostimulation", connections: 6, status: "Peer-Reviewed", color: "#3b82f6" },
];

const RECENT_EXPORTS = [
  { name: "Investor Package — Neurocognitive Helmet", type: "Investor PDF", date: "Aug 10, 2026" },
  { name: "SBIR Section — Scalar Biophoton Bed", type: "Grant DOCX", date: "Aug 9, 2026" },
  { name: "Licensing Brief — Cymatics Chamber", type: "1-Page PDF", date: "Aug 8, 2026" },
];

const colorMap = {
  gold: { bg: 'hsl(var(--zarp-gold) / 0.15)', text: 'hsl(var(--zarp-gold))', border: 'hsl(var(--zarp-gold) / 0.3)' },
  blue: { bg: 'hsl(var(--zarp-blue) / 0.15)', text: 'hsl(var(--zarp-blue))', border: 'hsl(var(--zarp-blue) / 0.3)' },
  violet: { bg: 'hsl(var(--zarp-violet) / 0.15)', text: 'hsl(var(--zarp-violet))', border: 'hsl(var(--zarp-violet) / 0.3)' },
  green: { bg: 'hsl(var(--zarp-green) / 0.15)', text: 'hsl(var(--zarp-green))', border: 'hsl(var(--zarp-green) / 0.3)' },
};

export default function ZarpDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState({ full_name: "Researcher", role: "admin" });

  const statusColors = {
    "Export Ready": "#10B981",
    "In Review": "#F59E0B",
    "Draft": "#8B9AB0",
  };

  return (
    <div className="min-h-screen bg-zarp-bg text-zarp-text" style={{ fontFamily: 'Inter, sans-serif' }}>
      <DashboardSidebar user={user} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main content */}
      <div className={`transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-zarp-bg/80 backdrop-blur-xl border-b border-zarp-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-sm tracking-wider" style={{ fontFamily: 'Orbitron, sans-serif' }}>ZARP</span>
            <span className="text-zarp-muted text-xs">/ Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-zarp-elevated transition-colors">
              <Bell size={16} className="text-zarp-muted" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-zarp-gold" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zarp-gold to-zarp-blue flex items-center justify-center text-zarp-bg font-bold text-xs">
              {user.full_name[0]}
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Greeting */}
          <div>
            <h1 className="text-2xl font-black text-zarp-text mb-1" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Good morning, {user.full_name}.
            </h1>
            <p className="text-zarp-muted text-sm">
              You have <span className="text-zarp-gold font-semibold">3 new connection discoveries</span> and{" "}
              <span className="text-zarp-amber font-semibold">1 grant deadline</span> this week.
            </p>
          </div>

          {/* Showcase video */}
          <div className="relative rounded-2xl overflow-hidden border border-zarp-gold/20" style={{ boxShadow: '0 0 60px hsl(var(--zarp-violet) / 0.15)' }}>
            <video
              src="https://media.base44.com/videos/public/69ccefebfea78b23498c66a8/0bb7a01b0_aethonapexipvideo.MOV"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-cover"
              style={{ maxHeight: '420px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zarp-bg/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zarp-gold animate-pulse" />
              <span className="text-zarp-gold text-[10px] font-bold tracking-wider uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Aethon Apex IP — Platform Showcase
              </span>
            </div>
          </div>

          {/* Featured: 3D Research Graph hero */}
          <Link to="/research-explorer" className="group relative block overflow-hidden rounded-2xl border border-zarp-blue/30 bg-gradient-to-br from-zarp-card via-zarp-elevated to-zarp-card p-5 hover:border-zarp-blue/60 transition-all">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle at 80% 50%, hsl(var(--zarp-blue) / 0.4), transparent 60%)" }} />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-zarp-blue/20 border border-zarp-blue/40 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Network size={26} className="text-zarp-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={12} className="text-zarp-gold" />
                  <span className="text-zarp-gold text-[10px] font-black uppercase tracking-wider">Featured · Interactive</span>
                </div>
                <h2 className="text-zarp-text font-black text-lg leading-tight" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  3D Research Graph Explorer
                </h2>
                <p className="text-zarp-muted text-xs mt-0.5 leading-relaxed">
                  549 research nodes · 2,400 connections · 12 domains — rotate, hover, and watch linked edges light up in 3D
                </p>
              </div>
              <div className="flex items-center gap-2 text-zarp-blue font-bold text-sm flex-shrink-0 group-hover:gap-3 transition-all">
                Launch <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          {/* Quick actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map(action => {
              const c = colorMap[action.color];
              return (
                <Link
                  key={action.label}
                  to={action.path}
                  className="group bg-zarp-card border rounded-xl p-4 hover:scale-[1.02] transition-all"
                  style={{ borderColor: c.border }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: c.bg, color: c.text }}>
                    {action.icon}
                  </div>
                  <p className="text-zarp-text text-sm font-semibold leading-tight">{action.label}</p>
                </Link>
              );
            })}
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {STATS.map(stat => (
              <div key={stat.label} className="bg-zarp-card border border-zarp-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-zarp-muted">{stat.icon}</span>
                  <span className="text-zarp-muted text-[10px] uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-zarp-text text-2xl font-black" style={{ fontFamily: 'Orbitron, sans-serif' }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Two column layout */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Active projects */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-zarp-text font-bold text-base">Active Projects</h2>
                <Link to="/invention-forge" className="text-zarp-gold text-xs font-semibold hover:underline">View All →</Link>
              </div>
              <div className="space-y-3">
                {ACTIVE_PROJECTS.map(project => (
                  <div key={project.name} className="bg-zarp-card border border-zarp-border rounded-xl p-4 hover:border-zarp-gold/30 transition-all">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-zarp-text text-sm font-semibold leading-tight">{project.name}</h3>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-zarp-muted text-[10px]">{project.nodes} nodes integrated</span>
                          <span className="text-zarp-muted text-[10px]">·</span>
                          <span className="text-zarp-muted text-[10px] flex items-center gap-1"><Clock size={9} /> {project.modified}</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded text-[9px] font-bold flex-shrink-0" style={{ backgroundColor: statusColors[project.status] + '20', color: statusColors[project.status] }}>
                        {project.status}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-zarp-bg" style={{ backgroundColor: 'hsl(var(--zarp-gold))' }}>Continue</button>
                      <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold border border-zarp-border text-zarp-muted hover:text-zarp-text">Export</button>
                      <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold border border-zarp-border text-zarp-muted hover:text-zarp-text">Share</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Innovation feed */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-zarp-text font-bold text-base">Innovation Feed</h2>
                <Link to="/opportunity-monitor" className="text-zarp-blue text-xs font-semibold hover:underline">View Full Feed →</Link>
              </div>
              <div className="space-y-2">
                {FEED_ITEMS.map((item, i) => (
                  <div key={i} className="bg-zarp-card border border-zarp-border rounded-lg p-3 hover:border-zarp-blue/30 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ backgroundColor: item.color + '20', color: item.color }}>{item.type}</span>
                      <span className="text-zarp-muted text-[9px]">{item.time}</span>
                    </div>
                    <p className="text-zarp-text text-xs leading-tight">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended nodes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-zarp-text font-bold text-base">Recommended For You</h2>
              <span className="text-zarp-muted text-xs">Based on your collections and build plans</span>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {RECOMMENDED_NODES.map(node => (
                <div key={node.name} className="bg-zarp-card border border-zarp-border rounded-xl p-4 hover:border-zarp-gold/30 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-zarp-text text-sm font-semibold leading-tight">{node.name}</h3>
                    <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: node.color, boxShadow: `0 0 6px ${node.color}` }} />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ backgroundColor: node.color + '20', color: node.color }}>{node.domain}</span>
                    <span className="text-zarp-muted text-[10px]">{node.connections} connections</span>
                    <span className="text-zarp-muted text-[10px]">· {node.status}</span>
                  </div>
                  <button className="w-full px-3 py-1.5 rounded-lg text-[10px] font-bold border border-zarp-border text-zarp-muted hover:text-zarp-gold hover:border-zarp-gold/30 transition-all">
                    + Add to Collection
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent exports */}
          <div>
            <h2 className="text-zarp-text font-bold text-base mb-3">Recent Exports</h2>
            <div className="bg-zarp-card border border-zarp-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zarp-border">
                    <th className="text-left px-4 py-2 text-zarp-muted text-[10px] font-bold uppercase tracking-wider">Export Name</th>
                    <th className="text-left px-4 py-2 text-zarp-muted text-[10px] font-bold uppercase tracking-wider hidden md:table-cell">Type</th>
                    <th className="text-left px-4 py-2 text-zarp-muted text-[10px] font-bold uppercase tracking-wider hidden md:table-cell">Date</th>
                    <th className="text-right px-4 py-2 text-zarp-muted text-[10px] font-bold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_EXPORTS.map((exp, i) => (
                    <tr key={i} className="border-b border-zarp-border last:border-0 hover:bg-zarp-elevated/50">
                      <td className="px-4 py-3 text-zarp-text text-xs font-semibold">{exp.name}</td>
                      <td className="px-4 py-3 text-zarp-muted text-xs hidden md:table-cell">{exp.type}</td>
                      <td className="px-4 py-3 text-zarp-muted text-xs hidden md:table-cell">{exp.date}</td>
                      <td className="px-4 py-3 text-right">
                        <button className="px-2 py-1 rounded text-[10px] font-bold text-zarp-gold hover:bg-zarp-gold/10 mr-1">Download</button>
                        <button className="px-2 py-1 rounded text-[10px] font-bold text-zarp-blue hover:bg-zarp-blue/10">Share</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upgrade banner */}
          <div className="bg-gradient-to-r from-zarp-violet/10 to-zarp-blue/10 border border-zarp-violet/30 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zarp-violet/20 flex items-center justify-center">
                <ArrowRight size={18} className="text-zarp-violet" />
              </div>
              <div>
                <p className="text-zarp-text text-sm font-semibold">Unlock Multi-System Integration Analysis and white-label exports</p>
                <p className="text-zarp-muted text-xs">Upgrade to Enterprise for unlimited AI-generated analysis reports</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/pricing" className="px-4 py-2 rounded-lg text-xs font-bold text-zarp-bg" style={{ backgroundColor: 'hsl(var(--zarp-violet))' }}>Upgrade Now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}