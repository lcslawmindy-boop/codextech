import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Download, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";

const BRAND = "Zenith Apex Research Portfolio (ZARP)";
const BRAND_SHORT = "ZARP";
const TAGLINE = "AI Operating System for Global R&D and Intellectual Property Creation";

const SLIDES = [
  {
    id: 1,
    label: "Cover",
    color: "#d4af37",
    content: () => (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-900/40 border border-yellow-700 text-yellow-400 text-xs font-black mb-8 uppercase tracking-widest">
          Vision Fund Pitch · Confidential
        </div>
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-3">{BRAND}</p>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">ZARP</h1>
        <p className="text-xl md:text-2xl font-bold text-yellow-400 mb-3 max-w-2xl">AI Operating System for Global R&D and Intellectual Property Creation</p>
        <p className="text-gray-500 text-base">Transforming a $2T Industry</p>
        <div className="mt-10 w-24 h-1 bg-yellow-400 rounded-full" />
      </div>
    ),
  },
  {
    id: 2,
    label: "The Problem",
    color: "#ef4444",
    content: () => (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="text-red-400 text-sm font-black uppercase tracking-widest mb-3">Slide 2 — The Problem</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Global R&D is broken.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { stat: "$2.4T", label: "Spent annually on R&D globally" },
            { stat: "Months–Years", label: "Time to develop a single invention" },
            { stat: "$15K–$50K", label: "Cost per patent application" },
            { stat: "Zero", label: "Scalable infrastructure for innovation" },
          ].map((item, i) => (
            <div key={i} className="bg-red-950/30 border border-red-900/50 rounded-2xl p-5">
              <p className="text-red-400 font-black text-2xl md:text-3xl mb-1">{item.stat}</p>
              <p className="text-gray-400 text-sm">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl px-6 py-4">
          <p className="text-white font-black text-lg">👉 Innovation has no infrastructure layer.</p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    label: "The Opportunity",
    color: "#f59e0b",
    content: () => (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="text-yellow-400 text-sm font-black uppercase tracking-widest mb-3">Slide 3 — The Opportunity</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Digitizing global innovation.</h2>
        <div className="space-y-4 mb-8">
          {[
            { num: "3.5M+", label: "Patents filed annually — and growing" },
            { num: "Millions", label: "Ideas that never reach commercialization" },
            { num: "Massive", label: "Inefficiency in R&D pipelines across every industry" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-5 bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4">
              <p className="text-yellow-400 font-black text-2xl w-28 flex-shrink-0">{item.num}</p>
              <p className="text-gray-300 text-base">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-yellow-950/30 border border-yellow-800/50 rounded-2xl px-6 py-4">
          <p className="text-white font-black text-lg">👉 The largest untapped optimization in the knowledge economy.</p>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    label: "The Solution",
    color: "#22c55e",
    content: () => (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="text-green-400 text-sm font-black uppercase tracking-widest mb-3">Slide 4 — The Solution</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-2">ZARP =</h2>
        <h2 className="text-3xl md:text-4xl font-black text-green-400 mb-8">AI Operating System for Global R&D and IP Creation</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { icon: "⚡", action: "Generates", what: "inventions" },
            { icon: "📋", action: "Drafts", what: "patents" },
            { icon: "📊", action: "Validates", what: "markets" },
            { icon: "🚀", action: "Builds", what: "commercialization pathways" },
          ].map((item, i) => (
            <div key={i} className="bg-green-950/20 border border-green-900/40 rounded-2xl p-5 flex items-center gap-4">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="text-green-400 font-black text-sm uppercase">{item.action}</p>
                <p className="text-white font-bold text-base">{item.what}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl px-6 py-4">
          <p className="text-white font-black text-lg">👉 End-to-end automation of R&D.</p>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    label: "The Breakthrough",
    color: "#a855f7",
    content: () => (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="text-purple-400 text-sm font-black uppercase tracking-widest mb-3">Slide 5 — The Breakthrough (10x–1000x)</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Not incremental.<br /><span className="text-purple-400">Exponential.</span></h2>
        <div className="overflow-hidden rounded-2xl border border-gray-700 mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-800">
                <th className="text-left px-6 py-3 text-gray-400 font-black uppercase tracking-wider">Metric</th>
                <th className="text-left px-6 py-3 text-gray-400 font-black uppercase tracking-wider">Before</th>
                <th className="text-left px-6 py-3 text-purple-400 font-black uppercase tracking-wider">ZARP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {[
                { metric: "Cost per Invention", before: "$50,000", after: "<$1" },
                { metric: "Time to Patent Draft", before: "Months", after: "Minutes" },
                { metric: "Scale of Output", before: "Limited (human)", after: "Unlimited (AI)" },
              ].map((row, i) => (
                <tr key={i} className="bg-gray-900">
                  <td className="px-6 py-4 text-gray-300 font-bold">{row.metric}</td>
                  <td className="px-6 py-4 text-red-400 font-bold">{row.before}</td>
                  <td className="px-6 py-4 text-purple-400 font-black text-base">{row.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-purple-950/30 border border-purple-800/50 rounded-2xl px-6 py-4">
          <p className="text-white font-black text-lg">👉 This is not incremental — it's exponential.</p>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    label: "Product",
    color: "#3b82f6",
    content: () => (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="text-blue-400 text-sm font-black uppercase tracking-widest mb-3">Slide 6 — Product (Platform, Not Tool)</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Full-stack innovation system.</h2>
        <div className="space-y-3 mb-8">
          {[
            { icon: "🧠", label: "AI Invention Engine", desc: "Concept-to-dossier in minutes, with IP valuation and GTM strategy" },
            { icon: "📋", label: "Patent Generation Suite", desc: "USPTO-compliant drafting, novelty analysis, claim structuring" },
            { icon: "📊", label: "Market Intelligence", desc: "Competitive landscape, FTO analysis, licensing opportunity maps" },
            { icon: "⚙️", label: "Engineering Simulation", desc: "Interactive lab tools, build plans, BOM generation" },
            { icon: "💼", label: "Investor Output Layer", desc: "VDR portal, pitch decks, acquisition CRM, due diligence packages" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-gray-900 border border-gray-800 hover:border-blue-800/50 rounded-xl px-5 py-3 transition-all">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-white font-black text-sm">{item.label}</p>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-blue-950/30 border border-blue-800/50 rounded-2xl px-6 py-4">
          <p className="text-white font-black text-lg">👉 One system replaces 5+ industries.</p>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    label: "Platform Flywheel",
    color: "#d4af37",
    content: () => (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="text-yellow-400 text-sm font-black uppercase tracking-widest mb-3">Slide 7 — Platform Flywheel (Critical)</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-10">Every invention improves the system.</h2>
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {["Users", "Inventions", "Data", "Better AI", "More Users"].map((step, i, arr) => (
            <div key={i} className="flex items-center gap-2">
              <div className="bg-yellow-900/40 border border-yellow-700 rounded-xl px-5 py-3 text-yellow-300 font-black text-base">
                {step}
              </div>
              {i < arr.length - 1 && <span className="text-yellow-600 font-black text-xl">→</span>}
            </div>
          ))}
        </div>
        <div className="bg-yellow-950/30 border border-yellow-800 rounded-2xl px-8 py-6 text-center">
          <p className="text-yellow-400 font-black text-2xl mb-2">"Every invention improves the system."</p>
          <p className="text-gray-500 text-sm">Say this in the room.</p>
        </div>
        <p className="text-gray-600 text-sm text-center mt-4">Compounding data moat → exponential defensibility over time</p>
      </div>
    ),
  },
  {
    id: 8,
    label: "Why Now",
    color: "#06b6d4",
    content: () => (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="text-cyan-400 text-sm font-black uppercase tracking-widest mb-3">Slide 8 — Why Now</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Perfect inflection point.</h2>
        <div className="space-y-4 mb-8">
          {[
            { icon: "📉", headline: "AI compute costs collapsed 99%", sub: "What cost $50K now costs pennies — enabling the ZARP model" },
            { icon: "🏢", headline: "Enterprise AI adoption accelerating", sub: "Fortune 500s are actively building AI-native R&D workflows" },
            { icon: "🏛", headline: "Governments funding innovation pipelines", sub: "National IP infrastructure is a strategic priority globally" },
            { icon: "📈", headline: "IP demand increasing globally", sub: "Patent filings up 4% YoY — yet the tools haven't scaled" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-white font-black text-sm">{item.headline}</p>
                <p className="text-gray-500 text-xs mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-cyan-950/30 border border-cyan-800/50 rounded-2xl px-6 py-4">
          <p className="text-white font-black text-lg">👉 Timing = perfect inflection point.</p>
        </div>
      </div>
    ),
  },
  {
    id: 9,
    label: "Market",
    color: "#22c55e",
    content: () => (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="text-green-400 text-sm font-black uppercase tracking-widest mb-3">Slide 9 — Market (Go Big)</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-8">We are not entering a market.<br /><span className="text-green-400">We are transforming one.</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { size: "$2.4T", label: "Global R&D Spend", sub: "Annual — all industries" },
            { size: "$500B+", label: "Enterprise Innovation", sub: "Software + services" },
            { size: "$30B+", label: "IP + Patent Tools", sub: "Current addressable" },
          ].map((item, i) => (
            <div key={i} className="bg-green-950/20 border border-green-900/40 rounded-2xl p-6 text-center">
              <p className="text-green-400 font-black text-4xl mb-2">{item.size}</p>
              <p className="text-white font-bold text-sm mb-1">{item.label}</p>
              <p className="text-gray-600 text-xs">{item.sub}</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl px-6 py-4">
          <p className="text-white font-black text-lg">👉 Infrastructure plays capture the entire stack — not just one layer.</p>
        </div>
      </div>
    ),
  },
  {
    id: 10,
    label: "Business Model",
    color: "#a855f7",
    content: () => (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="text-purple-400 text-sm font-black uppercase tracking-widest mb-3">Slide 10 — Business Model</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Software margins.<br /><span className="text-purple-400">Platform scale.</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { icon: "💳", model: "SaaS Subscriptions", desc: "Individual and team plans — recurring, global, instant access" },
            { icon: "🏢", model: "Enterprise Licensing", desc: "White-label AI Patent Suite + VDR Portal for IP firms and law practices" },
            { icon: "🔌", model: "API / Platform Access", desc: "Embedding ZARP into enterprise R&D workflows via API" },
            { icon: "🏛", model: "IP Marketplace (Future)", desc: "Connecting invention supply to institutional capital demand" },
          ].map((item, i) => (
            <div key={i} className="bg-purple-950/20 border border-purple-900/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-white font-black text-sm">{item.model}</p>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-purple-950/30 border border-purple-800/50 rounded-2xl px-6 py-4">
          <p className="text-white font-black text-lg">👉 Software margins + platform scale.</p>
        </div>
      </div>
    ),
  },
  {
    id: 11,
    label: "Revenue Path",
    color: "#d4af37",
    content: () => (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="text-yellow-400 text-sm font-black uppercase tracking-widest mb-3">Slide 11 — Revenue Expansion Path</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Built for massive scale.</h2>
        <div className="space-y-4 mb-8">
          {[
            { phase: "Phase 1", model: "SaaS", range: "$10M – $50M", color: "#d4af37", bar: "25%" },
            { phase: "Phase 2", model: "Enterprise", range: "$50M – $200M", color: "#f59e0b", bar: "50%" },
            { phase: "Phase 3", model: "Platform", range: "$200M – $1B", color: "#22c55e", bar: "75%" },
            { phase: "Phase 4", model: "IP Marketplace", range: "$1B+", color: "#a855f7", bar: "100%" },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-xs font-bold w-16">{item.phase}</span>
                  <span className="text-white font-bold text-sm">{item.model}</span>
                </div>
                <span className="font-black text-sm" style={{ color: item.color }}>{item.range}</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: item.bar, backgroundColor: item.color }} />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-yellow-950/30 border border-yellow-800 rounded-2xl px-6 py-5 text-center">
          <p className="text-yellow-400 font-black text-xl mb-1">ZARP becomes the infrastructure layer</p>
          <p className="text-gray-400 text-sm">for how the world creates intellectual property.</p>
        </div>
      </div>
    ),
  },
  {
    id: 12,
    label: "Competition",
    color: "#f97316",
    content: () => (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="text-orange-400 text-sm font-black uppercase tracking-widest mb-3">Slide 12 — Competitive Positioning</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Everyone else is partial.<br /><span className="text-orange-400">ZARP is full-stack.</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Legal AI Tools", scope: "Partial solution", detail: "Document review only. No invention generation. No market validation.", icon: "⚖️", bad: true },
            { label: "Patent Tools", scope: "Limited scope", detail: "Filing assistance only. No AI invention engine. No commercialization layer.", icon: "📄", bad: true },
            { label: "Research Tools", scope: "Non-generative", detail: "Passive search and retrieval. Cannot create, draft, or commercialize IP.", icon: "🔍", bad: true },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <span className="text-3xl block mb-2">{item.icon}</span>
              <p className="text-white font-black text-sm mb-1">{item.label}</p>
              <p className="text-red-400 text-xs font-bold mb-2">{item.scope}</p>
              <p className="text-gray-600 text-xs leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="bg-orange-950/30 border border-orange-800/50 rounded-2xl px-6 py-4 flex items-center gap-4">
          <span className="text-3xl">🟣</span>
          <div>
            <p className="text-orange-400 font-black text-sm uppercase tracking-wider mb-0.5">Zenith Apex Research Portfolio (ZARP)</p>
            <p className="text-white font-black text-lg">Full-stack innovation engine — generation to commercialization.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 13,
    label: "Moat",
    color: "#8b5cf6",
    content: () => (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="text-violet-400 text-sm font-black uppercase tracking-widest mb-3">Slide 13 — Moat</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Compounding defensibility.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {[
            { icon: "🗄️", label: "Proprietary Dataset", desc: "Curated, cross-referenced IP and research data that competitors cannot easily replicate", color: "#8b5cf6" },
            { icon: "🔁", label: "AI Feedback Loop", desc: "Every invention and patent drafted makes the model smarter — self-reinforcing improvement", color: "#a855f7" },
            { icon: "⛓️", label: "Integrated Pipeline", desc: "End-to-end workflow lock-in: users cannot replace one piece without losing the whole system", color: "#c084fc" },
            { icon: "🥇", label: "First-Mover Advantage", desc: "Building the data moat now — when AI R&D infrastructure is in its formative window", color: "#d4af37" },
          ].map((item, i) => (
            <div key={i} className="bg-violet-950/20 border border-violet-900/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{item.icon}</span>
                <p className="font-black text-sm" style={{ color: item.color }}>{item.label}</p>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-violet-950/30 border border-violet-800/50 rounded-2xl px-6 py-4">
          <p className="text-white font-black text-lg">👉 Compounding defensibility — the moat widens every day.</p>
        </div>
      </div>
    ),
  },
  {
    id: 14,
    label: "Traction",
    color: "#10b981",
    content: () => (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="text-emerald-400 text-sm font-black uppercase tracking-widest mb-3">Slide 14 — Traction (Early Signal)</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-3">Early signal.</h2>
        <h2 className="text-4xl md:text-5xl font-black text-emerald-400 mb-8">Not endpoint.</h2>
        <div className="space-y-4 mb-8">
          {[
            { stat: "200+", label: "Early users on platform", sub: "Researchers, inventors, IP attorneys, engineers — active across all 7 modules" },
            { stat: "✅", label: "Government funding validation", sub: "Aligned with DoD SBIR and federal innovation mandates — positioned for institutional adoption" },
            { stat: "23+", label: "Multi-domain IP portfolio", sub: "Bioelectromagnetics, energy, defense, communications — cross-domain invention pipeline active" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-6 bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4">
              <p className="text-emerald-400 font-black text-3xl w-16 flex-shrink-0 text-center">{item.stat}</p>
              <div>
                <p className="text-white font-black text-sm">{item.label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-2xl px-6 py-4">
          <p className="text-white font-black text-lg">👉 This is traction at the infrastructure layer — not a consumer product.</p>
        </div>
      </div>
    ),
  },
  {
    id: 15,
    label: "Strategic Position",
    color: "#f43f5e",
    content: () => (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="text-rose-400 text-sm font-black uppercase tracking-widest mb-3">Slide 15 — Strategic Positioning</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Infrastructure-level asset.</h2>
        <p className="text-gray-400 text-base mb-8">ZARP is not a feature — it is a platform layer. The same category as what these acquirers buy.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { name: "SoftBank Group", role: "Vision Fund — global technology platform investor", icon: "🇯🇵" },
            { name: "Google", role: "AI + IP infrastructure acquisition target", icon: "🔍" },
            { name: "Microsoft", role: "Enterprise AI + IP workflow integration", icon: "🪟" },
            { name: "Defense Primes", role: "Classified device documentation + SBIR alignment", icon: "🛡️" },
          ].map((item, i) => (
            <div key={i} className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-5 text-center">
              <span className="text-3xl block mb-2">{item.icon}</span>
              <p className="text-white font-black text-sm mb-1">{item.name}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{item.role}</p>
            </div>
          ))}
        </div>
        <div className="bg-rose-950/30 border border-rose-800/50 rounded-2xl px-6 py-4">
          <p className="text-white font-black text-lg">👉 We are building to be acquired or to dominate. Both paths win.</p>
        </div>
      </div>
    ),
  },
  {
    id: 16,
    label: "Vision",
    color: "#d4af37",
    content: () => (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 md:px-20">
        <p className="text-yellow-400 text-sm font-black uppercase tracking-widest mb-10">Slide 16 — Vision</p>
        <div className="mb-8">
          <div className="w-16 h-1 bg-yellow-400 rounded-full mx-auto mb-8" />
          <blockquote className="text-3xl md:text-4xl font-black text-white leading-tight mb-6">
            "We believe Zenith Apex Research Portfolio becomes the infrastructure layer for how the world creates intellectual property."
          </blockquote>
          <div className="w-16 h-1 bg-yellow-400 rounded-full mx-auto" />
        </div>
        <p className="text-gray-500 text-base max-w-xl leading-relaxed">
          Not a tool. Not a database. Not a search engine.<br />
          <span className="text-white font-bold">The operating system for global innovation.</span>
        </p>
        <div className="mt-10 grid grid-cols-3 gap-6 text-center">
          {[
            { label: "Scale", icon: "📡" },
            { label: "Inevitability", icon: "⚡" },
            { label: "Dominance", icon: "🏆" },
          ].map((item, i) => (
            <div key={i}>
              <span className="text-4xl block mb-2">{item.icon}</span>
              <p className="text-yellow-400 font-black text-lg">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 17,
    label: "The Ask",
    color: "#22c55e",
    content: () => (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="text-green-400 text-sm font-black uppercase tracking-widest mb-3">Slide 17 — The Ask</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Partner with us to<br /><span className="text-green-400">redefine innovation.</span></h2>
        <div className="space-y-4 mb-8">
          {[
            { icon: "💰", label: "Strategic Capital", desc: "To accelerate platform scaling, patent filings, and enterprise sales" },
            { icon: "🌐", label: "Platform Scaling", desc: "Engineering, AI infrastructure, and enterprise-grade deployments" },
            { icon: "🗺️", label: "Global Deployment", desc: "Expanding ZARP into international markets — EU, Asia-Pacific, Middle East R&D corridors" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-5 bg-green-950/20 border border-green-900/40 rounded-2xl px-6 py-5">
              <span className="text-3xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-white font-black text-base">{item.label}</p>
                <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-green-950/40 border border-green-700 rounded-2xl px-8 py-6 text-center">
          <p className="text-green-400 font-black text-2xl mb-2">Zenith Apex Research Portfolio (ZARP)</p>
          <p className="text-white font-black text-lg mb-1">AI Operating System for Global R&D and IP Creation</p>
          <p className="text-gray-500 text-sm">Confidential · Vision Fund · {new Date().getFullYear()}</p>
        </div>
      </div>
    ),
  },
];

function exportPDF() {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297, H = 210, margin = 16;

  SLIDES.forEach((slide, i) => {
    if (i > 0) doc.addPage();
    doc.setFillColor(10, 10, 20);
    doc.rect(0, 0, W, H, "F");
    const [r, g, b] = hexToRgb(slide.color);
    doc.setFillColor(r, g, b);
    doc.rect(0, 0, W, 5, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 100);
    doc.text(`${slide.id} / ${SLIDES.length}`, W - margin, H - 8, { align: "right" });
    doc.text(`ZARP — ${BRAND} · VISION FUND · CONFIDENTIAL`, margin, H - 8);
    doc.setFontSize(8);
    doc.setTextColor(r, g, b);
    doc.text(`SLIDE ${slide.id} — ${slide.label.toUpperCase()}`, margin, 14);
  });

  doc.save("ZARP_VisionFund_PitchDeck.pdf");
}

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : [200, 160, 0];
}

export default function VisionFundPitch() {
  const [current, setCurrent] = useState(0);
  const [exporting, setExporting] = useState(false);
  const slide = SLIDES[current];

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(SLIDES.length - 1, c + 1));

  const handleExport = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 50));
    exportPDF();
    setExporting(false);
  };

  return (
    <div className="w-screen h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-900/90 flex-shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Admin
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <p className="text-white font-black text-sm">ZARP — Vision Fund Pitch Deck</p>
            <p className="text-gray-500 text-xs">Zenith Apex Research Portfolio · Confidential · {SLIDES.length} Slides</p>
          </div>
        </div>
        <button onClick={handleExport} disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-800 hover:bg-yellow-700 text-black font-black text-xs transition-all disabled:opacity-60">
          {exporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
          {exporting ? "Exporting…" : "Export PDF"}
        </button>
      </div>

      {/* Slide tab nav */}
      <div className="flex gap-1 px-4 py-2 border-b border-gray-800 bg-gray-900/60 overflow-x-auto flex-shrink-0">
        {SLIDES.map((s, i) => (
          <button key={s.id} onClick={() => setCurrent(i)}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={i === current
              ? { backgroundColor: s.color + "25", color: s.color }
              : { color: "#4b5563" }}>
            {s.id}. {s.label}
          </button>
        ))}
      </div>

      {/* Slide content */}
      <div className="flex-1 relative overflow-hidden" style={{ borderTop: `3px solid ${slide.color}` }}>
        <div className="absolute inset-0 overflow-y-auto">
          <div className="min-h-full flex flex-col py-6">
            {slide.content()}
          </div>
        </div>
        <button onClick={prev} disabled={current === 0}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-800/80 hover:bg-gray-700 border border-gray-700 flex items-center justify-center text-gray-400 disabled:opacity-20 transition-all z-10">
          <ArrowLeft size={16} />
        </button>
        <button onClick={next} disabled={current === SLIDES.length - 1}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-800/80 hover:bg-gray-700 border border-gray-700 flex items-center justify-center text-gray-400 disabled:opacity-20 transition-all z-10">
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Footer progress */}
      <div className="flex-shrink-0 px-5 py-2 border-t border-gray-800 bg-gray-900/80 flex items-center gap-3">
        <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / SLIDES.length) * 100}%`, backgroundColor: slide.color }} />
        </div>
        <p className="text-gray-600 text-xs font-bold flex-shrink-0">{current + 1} / {SLIDES.length}</p>
      </div>
    </div>
  );
}