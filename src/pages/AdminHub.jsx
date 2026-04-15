import { Link } from "react-router-dom";
import {
  Shield, Download, Video, FileText, Users, BarChart2,
  TrendingUp, Database, Settings, ArrowRight, Star, Zap, Target, ShoppingCart, Flame, ShieldCheck,
  Scale, Briefcase, Building2, Code, Wrench
} from "lucide-react";

const ADMIN_SECTIONS = [
  {
    category: "Member Management",
    color: "#3b82f6",
    items: [
      { path: "/admin-beta", icon: <Users size={20} />, label: "Beta Applications", desc: "Review, approve & invite applicants", badge: "Members" },
      { path: "/vdr-admin", icon: <Shield size={20} />, label: "VDR Admin", desc: "Manage investor data room sessions & access tokens", badge: "Investors" },
      { path: "/vdr-audit-log", icon: <BarChart2 size={20} />, label: "VDR Audit Log", desc: "Document engagement heatmap, time-on-page & due diligence heat scores", badge: "NEW" },
      { path: "/member-portal", icon: <Star size={20} />, label: "Member Portal", desc: "View member dashboard and access status", badge: null },
    ]
  },
  {
    category: "Content & Downloads",
    color: "#f59e0b",
    items: [
      { path: "/admin-downloads", icon: <Download size={20} />, label: "Download Center", desc: "Generate & manage branded PDFs, build plans, investor docs", badge: "Admin" },
      { path: "/admin-videos", icon: <Video size={20} />, label: "Build Videos", desc: "Manage saved invention build video guides", badge: "Admin" },
    ]
  },
  {
    category: "Growth & Marketing",
    color: "#22c55e",
    items: [
      { path: "/social-command", icon: <TrendingUp size={20} />, label: "Social Media Command", desc: "AI content generation, 1000-member strategy center", badge: "AI" },
      { path: "/social-agent", icon: <Zap size={20} />, label: "Growth Agent", desc: "AI agent with calendar, analytics & member growth log", badge: "AI" },
      { path: "/marketing", icon: <BarChart2 size={20} />, label: "Marketing Plan", desc: "16-week growth roadmap & 30-day content calendar", badge: null },
    ]
  },
  {
    category: "Finance & IP",
    color: "#a855f7",
    items: [
      { path: "/fto-analysis", icon: <ShieldCheck size={20} />, label: "FTO Analysis Tool", desc: "AI Freedom-to-Operate reports — replaces $5K–$15K attorney analysis", badge: "NEW" },
      { path: "/patent-attorney-chat", icon: <Scale size={20} />, label: "AI Patent Attorney Chat", desc: "USPTO-trained AI attorney — replaces $400/hr consultations", badge: "NEW" },
      { path: "/ip-marketplace", icon: <Briefcase size={20} />, label: "IP Marketplace", desc: "Private brokered IP exchange — 5% commission on executed deals", badge: "NEW" },
      { path: "/co-inventor-matching", icon: <Users size={20} />, label: "Co-Inventor Matching", desc: "AI-matched inventor introductions — AngelList for inventors", badge: "NEW" },
      { path: "/white-label-saas", icon: <Building2 size={20} />, label: "White-Label SaaS", desc: "License the full IP platform to law firms — $10K–$50K/yr per seat", badge: "NEW" },
      { path: "/sbir-pipeline", icon: <Target size={20} />, label: "SBIR/STTR Grant Pipeline", desc: "AI maps inventions to open solicitations & auto-fills proposals", badge: "NEW" },
      { path: "/collab-patent-draft", icon: <Users size={20} />, label: "Collaborative Patent Draft", desc: "Multi-user editing, comment threads, version history, role-based access", badge: "NEW" },
      { path: "/ip-portfolio-health", icon: <ShieldCheck size={20} />, label: "IP Portfolio Health Score", desc: "Live scoring, renewal alerts, weekly digest emails — re-engagement driver", badge: "NEW" },
      { path: "/build-milestone-ai", icon: <Wrench size={20} />, label: "Build Milestone AI", desc: "AI flags failure points, suggests components, estimates completion", badge: "NEW" },
      { path: "/valuation-api", icon: <Code size={20} />, label: "Valuation API", desc: "$0.50–$2.00/call programmatic IP valuation for VCs, law firms, R&D teams", badge: "NEW" },
      { path: "/valuation", icon: <BarChart2 size={20} />, label: "Valuation Dashboard", desc: "IP portfolio valuation & financial projections", badge: null },
      { path: "/acquisition-crm", icon: <Target size={20} />, label: "Acquisition CRM", desc: "Institutional buyer pipeline & deal tracking", badge: "CRM" },
      { path: "/investor-crm", icon: <Database size={20} />, label: "Investor CRM", desc: "Investor relationship management & communications", badge: "CRM" },
      { path: "/opportunity-monitor", icon: <Shield size={20} />, label: "Opportunity Monitor", desc: "Patent filings, competitive intelligence & alerts", badge: "Monitor" },
      { path: "/monitoring", icon: <Settings size={20} />, label: "Monitoring Dashboard", desc: "Suppression pattern detection & risk alerts", badge: "Monitor" },
    ]
  },
  {
    category: "Build Operations",
    color: "#ec4899",
    items: [
      { path: "/build-tracker", icon: <Settings size={20} />, label: "Build Tracker", desc: "Track invention build projects, parts & milestones", badge: "Ops" },
      { path: "/material-sourcing", icon: <ShoppingCart size={20} />, label: "Material Sourcing", desc: "Order parts from all BOMs with vendor links & 10% commission tracking", badge: "NEW" },
      { path: "/trz-patent", icon: <FileText size={20} />, label: "TRZ Patent PPA", desc: "Provisional patent application management & figures", badge: "Patent" },
      { path: "/provisional-patent", icon: <FileText size={20} />, label: "Provisional Patent Tool", desc: "Draft provisional patent applications with AI", badge: "Patent" },
      { path: "/pitch-script", icon: <FileText size={20} />, label: "Pitch Script", desc: "8-minute investor pitch, Q&A matrix & exit playbook", badge: "Pitch" },
      { path: "/vision-fund-pitch", icon: <Zap size={20} />, label: "Vision Fund Pitch Deck", desc: "11-slide SoftBank-style pitch deck — AI OS for global R&D", badge: "NEW" },
      { path: "/term-sheet", icon: <FileText size={20} />, label: "Seller Term Sheet", desc: "Draft acquisition, licensing & investor term sheets", badge: "Legal" },
    ]
  },
];

export default function AdminHub() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-yellow-900/40 bg-gray-900/60 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-900/40 border border-yellow-700 flex items-center justify-center">
              <Shield size={20} className="text-yellow-400" />
            </div>
            <div>
              <h1 className="text-white font-black text-xl">Admin Control Panel</h1>
              <p className="text-gray-500 text-xs">Internal tools — not visible to members</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-sm hover:bg-gray-700 transition-colors">
              ← Member View
            </Link>
            <span className="text-xs px-3 py-1.5 rounded-full bg-yellow-900/40 border border-yellow-700 text-yellow-400 font-bold">
              🔒 ADMIN ONLY
            </span>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-2 grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Admin Sections", value: ADMIN_SECTIONS.reduce((s, c) => s + c.items.length, 0), color: "#f59e0b" },
          { label: "Member Tools", value: "Live", color: "#22c55e" },
          { label: "AI Agents", value: 2, color: "#a855f7" },
          { label: "CRM Pipelines", value: 2, color: "#3b82f6" },
        ].map((s, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div className="max-w-6xl mx-auto px-6 pb-12 space-y-8">
        {ADMIN_SECTIONS.map((section, si) => (
          <div key={si}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: section.color }} />
              <h2 className="text-white font-bold text-sm uppercase tracking-wider">{section.category}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.items.map((item, ii) => (
                <Link key={ii} to={item.path}
                  className="group flex items-start gap-4 bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition-all hover:bg-gray-900/80">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: section.color + "20", border: `1px solid ${section.color}40`, color: section.color }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-white font-bold text-sm group-hover:text-white transition-colors">{item.label}</p>
                      {item.badge && (
                        <span className="text-xs px-1.5 py-0.5 rounded font-semibold"
                          style={{ backgroundColor: section.color + "20", color: section.color }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs leading-snug">{item.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-700 group-hover:text-gray-400 transition-colors flex-shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}