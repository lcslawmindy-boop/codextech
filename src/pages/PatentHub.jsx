import { Link } from "react-router-dom";
import { ArrowLeft, Scale, Brain, Search, Shield, FileText, Sparkles, ChevronRight, Gavel, Map, Eye } from "lucide-react";

const TOOLS = [
  {
    icon: <Scale size={28} className="text-indigo-400" />,
    title: "AI Patent Attorney",
    subtitle: "Chat · Strategy · Prosecution",
    description: "Attorney-grade Q&A on claim drafting, filing strategy, office action responses, FTO, PCT, and USPTO procedure. Powered by Claude Sonnet — replaces $400/hr consultations.",
    badges: ["Claim Drafting", "Filing Strategy", "Office Actions", "FTO", "PCT"],
    color: "indigo",
    link: "/patent-attorney-chat",
    cta: "Open Chat",
    highlight: true,
  },
  {
    icon: <Brain size={28} className="text-purple-400" />,
    title: "Patent Intelligence",
    subtitle: "Claim Summarizer · Novelty · Landscape · Strategy",
    description: "AI-powered claim analysis, novelty & FTO gaps, competitive patent landscape mapping, and full provisional drafting strategy generation. Export to PDF or send to Wizard.",
    badges: ["Claim Analysis", "Novelty Gaps", "Competitive Landscape", "Drafting Strategy"],
    color: "purple",
    link: "/patent-intelligence",
    cta: "Open Intelligence",
  },
  {
    icon: <FileText size={28} className="text-green-400" />,
    title: "Patent Drafting Wizard",
    subtitle: "Full USPTO Application Draft",
    description: "Step-by-step wizard generating a complete USPTO-formatted patent application: title, abstract, background, detailed description, claims, and drawings. Real-time validation + PDF export.",
    badges: ["USPTO Format", "AI Assist", "Real-time Validation", "PDF Export", "Collaborative"],
    color: "green",
    link: "/patent-drafting-wizard",
    cta: "Start Drafting",
  },
  {
    icon: <Search size={28} className="text-yellow-400" />,
    title: "Prior Art Archive & Cross-Reference",
    subtitle: "76+ Documented Inventions · AI Rejection Risk",
    description: "Cross-reference your invention against 76+ historical scalar EM, vacuum energy, and bioelectromagnetic patents. AI scores rejection risk (0–100), identifies overlaps, and recommends claim language changes.",
    badges: ["76+ Entries", "§102/§103 Risk", "Claim Differentiation", "Jurisdiction Advice"],
    color: "yellow",
    link: "/prior-art",
    cta: "Search Archive",
  },
  {
    icon: <Shield size={28} className="text-blue-400" />,
    title: "Patent Threat Monitor",
    subtitle: "Automated Scanning · Real-time Alerts",
    description: "Automated scans for patent filings, legal challenges, and suppression patterns across 8 technology categories. Configurable email alerts with risk scoring (critical/high/medium/low).",
    badges: ["Auto-Scan", "Email Alerts", "8 Categories", "Suppression Detection"],
    color: "blue",
    link: "/monitoring",
    cta: "View Monitor",
  },
];

const WORKFLOW = [
  { step: 1, label: "Prior Art Check", icon: <Search size={14} />, link: "/prior-art", desc: "Check if your idea conflicts with existing patents" },
  { step: 2, label: "Novelty Analysis", icon: <Eye size={14} />, link: "/patent-intelligence", desc: "Identify what's truly novel and where the gaps are" },
  { step: 3, label: "Attorney Q&A", icon: <Scale size={14} />, link: "/patent-attorney-chat", desc: "Get claim strategy and filing advice" },
  { step: 4, label: "Draft Application", icon: <FileText size={14} />, link: "/patent-drafting-wizard", desc: "Generate full USPTO-formatted patent application" },
  { step: 5, label: "Monitor Threats", icon: <Shield size={14} />, link: "/monitoring", desc: "Track competitor filings and suppression patterns" },
];

const colorMap = {
  indigo: { border: "border-indigo-800/50", bg: "bg-indigo-950/20", badge: "bg-indigo-950/40 border-indigo-800 text-indigo-300", cta: "bg-indigo-700 hover:bg-indigo-600" },
  purple: { border: "border-purple-800/50", bg: "bg-purple-950/20", badge: "bg-purple-950/40 border-purple-800 text-purple-300", cta: "bg-purple-700 hover:bg-purple-600" },
  green:  { border: "border-green-800/50",  bg: "bg-green-950/20",  badge: "bg-green-950/40 border-green-800 text-green-300",   cta: "bg-green-700 hover:bg-green-600" },
  yellow: { border: "border-yellow-800/50", bg: "bg-yellow-950/20", badge: "bg-yellow-950/40 border-yellow-800 text-yellow-300", cta: "bg-yellow-700 hover:bg-yellow-600" },
  blue:   { border: "border-blue-800/50",   bg: "bg-blue-950/20",   badge: "bg-blue-950/40 border-blue-800 text-blue-300",     cta: "bg-blue-700 hover:bg-blue-600" },
};

export default function PatentHub() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-950/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-lg flex items-center gap-2">
              <Gavel size={17} className="text-indigo-400" /> Patent & IP Hub
            </h1>
            <p className="text-gray-500 text-xs">AI Attorney · Drafting · Prior Art · Monitoring — all in one place</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
          <Sparkles size={12} className="text-yellow-400" />
          <span>5 integrated AI patent tools</span>
        </div>
      </div>

      {/* Hero */}
      <div className="px-6 py-10 max-w-5xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/50 border border-indigo-800/60 text-indigo-300 text-xs font-bold mb-5 uppercase tracking-wider">
          <Sparkles size={11} className="text-yellow-400" /> AI-Powered IP Suite — USPTO Grade
        </div>
        <h2 className="text-4xl font-black text-white mb-3 leading-tight">Your Complete Patent Toolkit</h2>
        <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
          From prior art search to full application drafting, from attorney Q&A to automated threat monitoring — everything you need to protect and commercialize your IP.
        </p>
      </div>

      {/* Recommended workflow */}
      <div className="px-6 pb-8 max-w-5xl mx-auto w-full">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4 text-center">Recommended Filing Workflow</p>
        <div className="flex flex-wrap justify-center gap-2">
          {WORKFLOW.map((w, i) => (
            <Link key={i} to={w.link}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-600 text-xs transition-all group">
              <div className="w-5 h-5 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-black text-indigo-400 flex-shrink-0">
                {w.step}
              </div>
              <span className="text-gray-300 font-semibold group-hover:text-white">{w.label}</span>
              <span className="text-gray-600 hidden md:inline">— {w.desc}</span>
              <ChevronRight size={11} className="text-gray-600 group-hover:text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* Tool cards */}
      <div className="px-6 pb-12 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TOOLS.map((tool, i) => {
            const c = colorMap[tool.color];
            return (
              <div key={i}
                className={`border rounded-2xl p-6 flex flex-col gap-4 transition-all hover:border-opacity-80 ${c.border} ${c.bg} ${tool.highlight ? "md:col-span-2" : ""}`}>
                <div className={`flex items-start gap-4 ${tool.highlight ? "flex-row" : "flex-col sm:flex-row"}`}>
                  <div className="w-14 h-14 rounded-2xl bg-gray-900/60 border border-gray-700 flex items-center justify-center flex-shrink-0">
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-white font-black text-lg leading-tight">{tool.title}</h3>
                        <p className="text-gray-400 text-xs mt-0.5 font-semibold">{tool.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mt-2">{tool.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {tool.badges.map((b, j) => (
                    <span key={j} className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${c.badge}`}>{b}</span>
                  ))}
                </div>

                <Link to={tool.link}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black text-white transition-all ${c.cta}`}>
                  {tool.cta} <ChevronRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom disclaimer */}
      <div className="border-t border-gray-800 px-6 py-4 text-center">
        <p className="text-gray-700 text-xs">All AI outputs are for research and drafting assistance only. Consult a registered USPTO patent attorney or agent before filing. Not legal advice.</p>
      </div>
    </div>
  );
}