import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Shield, Users, BarChart2, Download, Video, TrendingUp, Target, DollarSign, Eye, FileText, Zap, Radio, Settings, ArrowLeft } from "lucide-react";

const ADMIN_SECTIONS = [
  {
    category: "📣 Marketing & Growth",
    color: "#ec4899",
    tools: [
      { label: "Social Media Command Center", desc: "AI content generator, video scripts, outreach channels, monetization matrix", icon: "🚀", path: "/social-command" },
      { label: "AI Growth Agent", desc: "16-week plan chat agent, calendar, analytics", icon: "🤖", path: "/social-agent" },
      { label: "Marketing Plan", desc: "30-day AI content calendar + 1000-member roadmap", icon: "📅", path: "/marketing" },
    ]
  },
  {
    category: "💰 Investor & Business",
    color: "#f59e0b",
    tools: [
      { label: "Investor Package", desc: "Full due diligence pack, NDA templates, acquisition letter", icon: "💼", path: "/investor-package" },
      { label: "Investor CRM", desc: "Pipeline management, communication logs, meetings", icon: "📊", path: "/investor-crm" },
      { label: "Acquisition CRM", desc: "Institutional buyer pipeline, deal stages", icon: "🎯", path: "/acquisition-crm" },
      { label: "Valuation Dashboard", desc: "IP portfolio valuation, $3.9M–$11.5M assessment", icon: "📈", path: "/valuation" },
      { label: "Business Models", desc: "Revenue streams, business model explorer", icon: "💡", path: "/business" },
      { label: "Market Deck", desc: "Market research and competitive analysis", icon: "📋", path: "/market-deck" },
      { label: "Pitch Builder", desc: "AI pitch deck generator + IP valuation dossier", icon: "🎯", path: "/pitch" },
      { label: "Timeline Pitch Deck", desc: "Invention development timeline for investors", icon: "📊", path: "/timeline-pitch" },
    ]
  },
  {
    category: "🔒 VDR & Access Control",
    color: "#6366f1",
    tools: [
      { label: "VDR Admin", desc: "Virtual data room session management, access logs", icon: "🔐", path: "/vdr-admin" },
      { label: "Beta Applications", desc: "Review, approve, and manage beta applicants", icon: "👥", path: "/admin-beta" },
    ]
  },
  {
    category: "🛡️ Monitoring & IP",
    color: "#22c55e",
    tools: [
      { label: "Monitoring Dashboard", desc: "Patent landscape, legal challenges, competitor activity", icon: "🛡", path: "/monitoring" },
      { label: "Opportunity Monitor", desc: "AI-scanned market trends, prior art updates, alerts", icon: "🔔", path: "/opportunity-monitor" },
      { label: "TRZ Patent PPA", desc: "Time-reversal zone patent provisional application", icon: "📋", path: "/trz-patent" },
      { label: "Patent Landscape Graph", desc: "Visual IP landscape and competitive patent mapping", icon: "🗺️", path: "/patent-landscape" },
      { label: "Invention Dev Timeline", desc: "Development status across all 21 inventions", icon: "📈", path: "/invention-timeline" },
      { label: "Dark vs Light Timeline", desc: "Internal research suppression narrative", icon: "🌍", path: "/dark-timeline" },
    ]
  },
  {
    category: "🔧 Build & Operations",
    color: "#06b6d4",
    tools: [
      { label: "Invention Build Tracker", desc: "Track physical build progress for each invention", icon: "🔧", path: "/build-tracker" },
      { label: "Admin Videos", desc: "Manage and export build video records", icon: "🎬", path: "/admin-videos" },
      { label: "Admin Download Center", desc: "Generate branded PDFs — acquisition letters, catalogs", icon: "⬇", path: "/admin-downloads" },
      { label: "Device Knowledge Graph", desc: "Interconnected device relationship visualization", icon: "🕸️", path: "/device-graph" },
      { label: "Brand Architecture", desc: "Brand identity and visual design system", icon: "🎨", path: "/brand" },
      { label: "Zenith Apex Overview", desc: "Platform overview and strategy document", icon: "⚡", path: "/zenith-apex" },
    ]
  },
];

function ToolCard({ tool }) {
  return (
    <Link to={tool.path}
      className="flex items-start gap-3 bg-gray-800/60 hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 rounded-xl p-4 transition-all group">
      <span className="text-2xl flex-shrink-0">{tool.icon}</span>
      <div>
        <p className="text-white font-semibold text-sm group-hover:text-white leading-snug">{tool.label}</p>
        <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{tool.desc}</p>
      </div>
    </Link>
  );
}

export default function AdminPanel() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return (
      <div className="w-screen h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Shield size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-white font-bold text-xl mb-2">Access Denied</h1>
          <p className="text-gray-400 text-sm mb-4">This area is restricted to administrators only.</p>
          <Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">← Return to Platform</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-red-900/30 bg-gray-900/80 px-6 py-4 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
          <ArrowLeft size={14} /> Back to Platform
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-900/40 border border-red-700 flex items-center justify-center">
            <Shield size={15} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-white font-black text-lg">Admin Panel</h1>
            <p className="text-gray-500 text-xs">Internal tools — not visible to customers</p>
          </div>
        </div>
        <div className="ml-auto">
          <span className="text-xs px-3 py-1.5 rounded-full bg-red-900/40 border border-red-800 text-red-300 font-bold">
            🔴 ADMIN ONLY
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Quick stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/admin-beta" className="bg-gray-900 border border-gray-800 hover:border-yellow-700 rounded-xl p-4 transition-all group">
            <div className="flex items-center gap-2 mb-1"><Users size={13} className="text-yellow-400" /><span className="text-gray-400 text-xs font-semibold uppercase">Beta Applicants</span></div>
            <p className="text-white font-black text-xl">→ Review</p>
          </Link>
          <Link to="/social-command" className="bg-gray-900 border border-gray-800 hover:border-pink-700 rounded-xl p-4 transition-all">
            <div className="flex items-center gap-2 mb-1"><TrendingUp size={13} className="text-pink-400" /><span className="text-gray-400 text-xs font-semibold uppercase">Growth</span></div>
            <p className="text-white font-black text-xl">→ Command</p>
          </Link>
          <Link to="/vdr-admin" className="bg-gray-900 border border-gray-800 hover:border-purple-700 rounded-xl p-4 transition-all">
            <div className="flex items-center gap-2 mb-1"><Eye size={13} className="text-purple-400" /><span className="text-gray-400 text-xs font-semibold uppercase">VDR Sessions</span></div>
            <p className="text-white font-black text-xl">→ Monitor</p>
          </Link>
          <Link to="/monitoring" className="bg-gray-900 border border-gray-800 hover:border-green-700 rounded-xl p-4 transition-all">
            <div className="flex items-center gap-2 mb-1"><Shield size={13} className="text-green-400" /><span className="text-gray-400 text-xs font-semibold uppercase">IP Monitor</span></div>
            <p className="text-white font-black text-xl">→ Alerts</p>
          </Link>
        </div>

        {/* Admin sections */}
        {ADMIN_SECTIONS.map((section, si) => (
          <div key={si}>
            <h2 className="text-white font-black text-base mb-3 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full" style={{ backgroundColor: section.color }} />
              {section.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {section.tools.map((tool, ti) => <ToolCard key={ti} tool={tool} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}