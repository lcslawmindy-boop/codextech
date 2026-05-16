import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield, FileText, TrendingUp, Users, Lock, BarChart2, ChevronRight,
  CheckCircle, ArrowRight, Star, Zap, Globe, DollarSign, Briefcase,
  Award, Search, Database, Scale, Eye, Mail, Phone
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const PORTFOLIO_STATS = [
  { val: "40+", label: "Patent-Backed Inventions", color: "#06b6d4", icon: <FileText size={18} /> },
  { val: "$2M–$50M", label: "Estimated Portfolio Range", color: "#22c55e", icon: <DollarSign size={18} /> },
  { val: "3–15", label: "Active / Pending Patents", color: "#a855f7", icon: <Shield size={18} /> },
  { val: "8+", label: "Addressable Market Sectors", color: "#f97316", icon: <Globe size={18} /> },
];

const IP_CATEGORIES = [
  {
    color: "#06b6d4",
    icon: "⚡",
    title: "Advanced Energy Systems",
    patents: "4–6 patents",
    valuation: "$3M–$12M",
    stage: "Prototype Validated",
    desc: "Motionless electromagnetic generator technology, vacuum energy extraction, and zero-point field devices. Cite US Patent 6,362,718 (Bearden et al.). Off-grid power and defense applications.",
    markets: ["Off-Grid Power", "Defense", "Edge Computing", "Aerospace"],
    highlights: ["NTP-backed scientific foundation", "No moving parts — low maintenance CAPEX", "Compatible with existing grid infrastructure"],
  },
  {
    color: "#a855f7",
    icon: "🧬",
    title: "Bioelectromagnetic Therapeutics",
    patents: "3–5 patents",
    valuation: "$5M–$18M",
    stage: "Patent Pending",
    desc: "EM frequency therapy systems for cellular regeneration, immune modulation, and oncological applications. Based on Prioré-type rotating magnetic field tech — French government peer-reviewed (1970s). Clinical applications in $520B global therapeutics market.",
    markets: ["Oncology", "Neurology", "Anti-Aging", "Veterinary"],
    highlights: ["French Academy of Sciences validated core effect", "DDS synthesizer implementation — fully reproducible", "Regulatory pathway: Class II medical device"],
  },
  {
    color: "#22c55e",
    icon: "📡",
    title: "Scalar EM Communication",
    patents: "2–4 patents",
    valuation: "$4M–$15M",
    stage: "Prototype Validated",
    desc: "Longitudinal scalar wave communication technology — transmits information without conventional transverse RF emissions. Non-interceptable by standard SIGINT. Strategic value for defense, secure banking, and critical infrastructure.",
    markets: ["Defense / SIGINT", "Banking Security", "IoT Infrastructure", "Space Comms"],
    highlights: ["Zero ambient RF signature", "Theoretical basis: Tesla longitudinal EM (1899)", "EMP-resistant signal transmission"],
  },
  {
    color: "#f97316",
    icon: "🔬",
    title: "EMF Detection & Instrumentation",
    patents: "2–3 patents",
    valuation: "$1M–$5M",
    stage: "Patent Granted",
    desc: "ELF carrier detection systems, scalar field mapping instruments, and bioelectromagnetic monitoring hardware. Growing regulatory demand for independent RF testing. B2G and B2B channel opportunities.",
    markets: ["Regulatory Testing", "Defense", "Environmental Monitoring", "Research Institutions"],
    highlights: ["Dual RTL-SDR + GPS-disciplined OCXO design", "Software-defined — firmware upgradeable", "FCC compliance testing market: $2.4B"],
  },
  {
    color: "#ec4899",
    icon: "🌊",
    title: "Hydromagnetic Propulsion",
    patents: "2–3 patents",
    valuation: "$2M–$8M",
    stage: "Concept + Prototype",
    desc: "MHD (magnetohydrodynamic) propulsion systems for submarine, marine, and deep-space applications. No moving mechanical parts. Silent operation. Strategic value for naval defense and deep-sea exploration.",
    markets: ["Naval Defense", "Deep Sea", "Space Propulsion", "Industrial Pumping"],
    highlights: ["No rotating machinery — acoustic stealth", "Applicable to liquid metal cooling in reactors", "Defense procurement pathway established"],
  },
  {
    color: "#fbbf24",
    icon: "🧲",
    title: "Resonance Energy Transfer",
    patents: "3–4 patents",
    valuation: "$2M–$9M",
    stage: "Patent Pending",
    desc: "Near-field resonant inductive coupling systems operating at high-Q factors. Wireless power transfer at efficiency levels exceeding conventional inductive systems. EV charging, medical implant power, and industrial IoT applications.",
    markets: ["EV Charging", "Medical Devices", "Industrial IoT", "Consumer Electronics"],
    highlights: ["Q-factor exceeding 2,000 in bench tests", "Operates at non-standard resonant frequencies", "License-ready implementation specs"],
  },
];

const BROKER_FEATURES = [
  {
    icon: <Database size={20} />,
    color: "#06b6d4",
    title: "Full Due Diligence Package",
    desc: "Complete IP valuation report, patent landscape analysis, freedom-to-operate study, competitive threat assessment, and financial modeling — auto-generated and ready for buyer review.",
  },
  {
    icon: <Lock size={20} />,
    color: "#a855f7",
    title: "NDA-Gated Virtual Data Room",
    desc: "Secure VDR with time-limited access tokens, DocuSign NDA integration, page-level view tracking, and instant revocation. Full audit trail for every document interaction.",
  },
  {
    icon: <BarChart2 size={20} />,
    color: "#22c55e",
    title: "Real-Time IP Valuation Engine",
    desc: "Dynamic IP valuation calculator using R&D spend, patent count, claim strength, and market size inputs. Generates investor-grade PDF valuation reports on demand.",
  },
  {
    icon: <Scale size={20} />,
    color: "#f97316",
    title: "Term Sheet Generator",
    desc: "Automated acquisition and licensing term sheet generation with customizable deal structures: outright acquisition, exclusive license, field-of-use license, or royalty arrangements.",
  },
  {
    icon: <Search size={20} />,
    color: "#ec4899",
    title: "Patent Landscape & FTO Reports",
    desc: "Comprehensive prior art analysis, freedom-to-operate research across USPTO, EPO, and WIPO databases. Identifies white space and claim differentiation opportunities.",
  },
  {
    icon: <Eye size={20} />,
    color: "#fbbf24",
    title: "Buyer Engagement Analytics",
    desc: "Track exactly which documents buyers view, how long they spend on each page, and which sections they revisit. Real-time signals to optimize negotiation timing.",
  },
];

const DEAL_STRUCTURES = [
  { type: "Outright Acquisition", range: "$500K – $50M", desc: "Full IP transfer including patents, trade secrets, know-how, and inventor assignment. Clean exit with no ongoing obligations.", color: "#22c55e" },
  { type: "Exclusive License", range: "$250K – $5M upfront + royalties", desc: "Exclusive field-of-use or geographic license. Licensor retains ownership; licensee gains exclusive commercial rights.", color: "#06b6d4" },
  { type: "Non-Exclusive License", range: "$50K – $500K per licensee", desc: "Multiple licensees in non-competing fields. Portfolio generates recurring royalty income from parallel commercialization.", color: "#a855f7" },
  { type: "Joint Venture / Co-Development", range: "Equity-based", desc: "Inventor retains stake in commercialization entity. Suitable for technologies requiring significant development capital.", color: "#f97316" },
];

const TRUST_SIGNALS = [
  "All patents cite granted USPTO filings or PCT applications",
  "Inventor identity verification completed",
  "NTP & IARC-backed scientific foundation for EM portfolio",
  "Full BOM and prototype documentation available in VDR",
  "Independent IP valuation methodology (DCF + comparable transactions)",
  "NDA-protected — zero public disclosure before signed agreement",
];

function ContactForm() {
  const [form, setForm] = useState({ name: "", org: "", email: "", interest: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await base44.entities.NewsletterSubscriber.create({
      email: form.email,
      name: form.name,
      source: `ip_broker_inquiry:${form.interest}`,
      status: "active",
      description: `Org: ${form.org} | Interest: ${form.interest} | Message: ${form.message}`,
    });
    setSent(true);
  };

  return sent ? (
    <div className="text-center py-10">
      <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
      <p className="text-white font-black text-xl mb-1">Inquiry Received</p>
      <p className="text-slate-400 text-sm">We'll send NDA documentation to {form.email} within 24 hours.</p>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-slate-400 text-xs font-bold mb-1 block">Full Name *</label>
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
            placeholder="John Smith" />
        </div>
        <div>
          <label className="text-slate-400 text-xs font-bold mb-1 block">Organization *</label>
          <input required value={form.org} onChange={e => setForm({ ...form, org: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
            placeholder="Firm / Fund / Company" />
        </div>
      </div>
      <div>
        <label className="text-slate-400 text-xs font-bold mb-1 block">Email *</label>
        <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
          placeholder="you@firm.com" />
      </div>
      <div>
        <label className="text-slate-400 text-xs font-bold mb-1 block">Primary Interest</label>
        <select value={form.interest} onChange={e => setForm({ ...form, interest: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500">
          <option value="">Select category...</option>
          <option value="energy">Advanced Energy Systems</option>
          <option value="bioem">Bioelectromagnetic Therapeutics</option>
          <option value="scalar-comms">Scalar EM Communication</option>
          <option value="instruments">Detection & Instrumentation</option>
          <option value="propulsion">Hydromagnetic Propulsion</option>
          <option value="full-portfolio">Full Portfolio Acquisition</option>
        </select>
      </div>
      <div>
        <label className="text-slate-400 text-xs font-bold mb-1 block">Message</label>
        <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
          placeholder="Deal structure preference, budget range, timeline..." />
      </div>
      <button type="submit"
        className="w-full py-4 rounded-xl font-black text-white text-base transition-all hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}>
        Request NDA & Due Diligence Package →
      </button>
      <p className="text-slate-600 text-xs text-center">NDA sent within 24 hours · Confidential · No public disclosure</p>
    </form>
  );
}

export default function IPBrokerLanding() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── Top Nav ── */}
      <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bce328987_a6e3bd669_logo.png" alt="Aethon Apex IP" className="h-8 w-8 object-contain" />
          <div>
            <div className="text-white font-black text-sm leading-none">Aethon Apex IP</div>
            <div className="text-slate-500 text-[10px] uppercase tracking-widest">IP Brokerage & Licensing</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="#portfolio" className="text-slate-400 hover:text-white text-xs font-semibold px-3 py-2 hidden sm:block">Portfolio</a>
          <a href="#deal-structures" className="text-slate-400 hover:text-white text-xs font-semibold px-3 py-2 hidden sm:block">Deal Structures</a>
          <a href="#contact" className="px-5 py-2.5 rounded-xl text-xs font-black text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}>
            Request NDA Package
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative px-6 py-24 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-purple-900/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-cyan-900/10 blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs font-bold mb-6 uppercase tracking-widest">
            <Briefcase size={11} /> Confidential IP Portfolio — Acquisition & Licensing
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6">
            <span className="text-white">Patent-Backed IP</span><br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
              Ready for Acquisition
            </span>
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
            A curated portfolio of 40+ defensible inventions across energy, bioelectromagnetics, communications, and propulsion — with full due diligence infrastructure ready for institutional review.
          </p>
          <p className="text-slate-500 text-sm mb-10">
            Estimated portfolio value: $2M – $50M · NDA required · VDR access granted within 24 hours
          </p>

          {/* Stat row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
            {PORTFOLIO_STATS.map((s, i) => (
              <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 text-center">
                <div className="flex justify-center mb-2" style={{ color: s.color }}>{s.icon}</div>
                <div className="text-2xl font-black mb-1" style={{ color: s.color }}>{s.val}</div>
                <div className="text-slate-400 text-xs leading-snug">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#contact"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-black text-white text-base transition-all hover:opacity-90 shadow-lg"
              style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)", boxShadow: "0 4px 30px rgba(124,58,237,0.35)" }}>
              Request NDA & Due Diligence Package <ArrowRight size={16} />
            </a>
            <a href="#portfolio"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-bold text-base transition-all">
              Browse IP Portfolio
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust Signals ── */}
      <div className="border-y border-slate-800 bg-slate-900/40 py-4 px-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-center gap-5">
          {TRUST_SIGNALS.map((s, i) => (
            <span key={i} className="flex items-center gap-2 text-xs text-slate-400 whitespace-nowrap">
              <CheckCircle size={11} className="text-green-400 flex-shrink-0" /> {s}
            </span>
          ))}
        </div>
      </div>

      {/* ── Broker Tools / Features ── */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Due Diligence Infrastructure</p>
          <h2 className="text-3xl font-black text-white mb-3">Everything a Broker Needs</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">Full deal infrastructure built in — from initial NDA to signed term sheet. No waiting for documents to be assembled.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BROKER_FEATURES.map((f, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5" style={{ borderTopColor: f.color, borderTopWidth: 2 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: f.color + "20", color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="text-white font-black text-sm">{f.title}</h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── IP Portfolio ── */}
      <section id="portfolio" className="border-t border-slate-800 bg-slate-900/20 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">IP Portfolio</p>
            <h2 className="text-3xl font-black text-white mb-3">Patent Categories Available</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">Six distinct technology clusters — each with independent patent claims, scientific validation, and addressable commercial markets.</p>
          </div>

          {/* Tab nav */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {IP_CATEGORIES.map((cat, i) => (
              <button key={i} onClick={() => setActiveCategory(i)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  activeCategory === i
                    ? "text-white border-transparent"
                    : "border-slate-700 text-slate-500 hover:text-slate-300"
                }`}
                style={activeCategory === i ? { backgroundColor: cat.color, borderColor: cat.color } : {}}>
                {cat.icon} {cat.title}
              </button>
            ))}
          </div>

          {/* Active category card */}
          {(() => {
            const cat = IP_CATEGORIES[activeCategory];
            return (
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: cat.color + "40" }}>
                <div className="px-6 py-4 border-b flex items-center justify-between flex-wrap gap-3" style={{ backgroundColor: cat.color + "12", borderColor: cat.color + "30" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cat.icon}</span>
                    <div>
                      <h3 className="text-white font-black text-lg">{cat.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: cat.color + "25", color: cat.color }}>{cat.patents}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-green-900/40 text-green-300 border border-green-800">{cat.stage}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Est. Valuation Range</p>
                    <p className="font-black text-xl" style={{ color: cat.color }}>{cat.valuation}</p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900">
                  <div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">{cat.desc}</p>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Key Highlights</p>
                      <ul className="space-y-2">
                        {cat.highlights.map((h, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-slate-300">
                            <CheckCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: cat.color }} />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">Addressable Markets</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {cat.markets.map((m, j) => (
                        <span key={j} className="text-xs px-3 py-1.5 rounded-full border font-semibold" style={{ borderColor: cat.color + "50", color: cat.color, background: cat.color + "10" }}>{m}</span>
                      ))}
                    </div>
                    <a href="#contact"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-black text-white text-sm transition-all hover:opacity-90"
                      style={{ background: `linear-gradient(135deg, ${cat.color}, ${cat.color}99)` }}>
                      Request Due Diligence for This Category <ChevronRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* All category grid summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {IP_CATEGORIES.map((cat, i) => (
              <button key={i} onClick={() => setActiveCategory(i)}
                className="text-left bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-4 transition-all"
                style={{ borderLeftColor: cat.color, borderLeftWidth: 3 }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-bold text-sm">{cat.icon} {cat.title}</span>
                  <span className="text-xs font-black" style={{ color: cat.color }}>{cat.valuation}</span>
                </div>
                <p className="text-slate-500 text-xs">{cat.patents} · {cat.stage}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Deal Structures ── */}
      <section id="deal-structures" className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Transaction Structures</p>
          <h2 className="text-3xl font-black text-white mb-3">Flexible Deal Architecture</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">Multiple transaction models available depending on buyer strategy, budget, and market deployment plans.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {DEAL_STRUCTURES.map((d, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-black text-base">{d.type}</h3>
                <span className="text-xs font-black px-3 py-1 rounded-full ml-2 flex-shrink-0" style={{ background: d.color + "20", color: d.color, border: `1px solid ${d.color}40` }}>{d.range}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VDR Process ── */}
      <section className="border-y border-slate-800 bg-slate-900/30 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Process</p>
          <h2 className="text-3xl font-black text-white mb-10">From NDA to Term Sheet in 5 Steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[
              { n: "01", label: "Submit Inquiry", desc: "Complete contact form with your organization and interest area" },
              { n: "02", label: "NDA Execution", desc: "DocuSign NDA delivered within 24 hours — mutual or one-way" },
              { n: "03", label: "VDR Access Granted", desc: "Time-limited access token to secure virtual data room" },
              { n: "04", label: "Due Diligence Review", desc: "Patents, prototypes, valuation, financials — all in one room" },
              { n: "05", label: "Term Sheet & Close", desc: "Auto-generated term sheet aligned to your deal structure preference" },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center h-full">
                  <div className="text-3xl font-black mb-2" style={{ color: "#7c3aed" }}>{step.n}</div>
                  <p className="text-white font-black text-sm mb-1">{step.label}</p>
                  <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
                {i < 4 && <div className="hidden sm:block absolute top-1/2 -right-2 z-10 text-slate-700 font-black text-lg">›</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact / Request Form ── */}
      <section id="contact" className="px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs font-bold mb-4 uppercase tracking-widest">
              <Lock size={11} /> Confidential Inquiry
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Request Due Diligence Access</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Qualified brokers, M&A advisors, strategic acquirers, and institutional licensees. NDA + VDR access granted within 24 hours of qualified inquiry.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 px-6 py-10 text-center text-slate-600 text-xs">
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bce328987_a6e3bd669_logo.png" alt="" className="h-5 w-5 object-contain" />
          <span className="text-slate-500 font-bold">Aethon Apex IP — Patent-Backed Portfolio for Acquisition & Licensing</span>
        </div>
        <p className="mb-4">All IP is for educational and research purposes. Licensing and acquisition inquiries subject to NDA. Not investment advice.</p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/investor-package-builder" className="hover:text-slate-400">Valuation Tools</Link>
          <Link to="/vdr-admin" className="hover:text-slate-400">VDR Admin</Link>
          <Link to="/terms" className="hover:text-slate-400">Terms</Link>
          <Link to="/pricing" className="hover:text-slate-400">Membership</Link>
        </div>
      </footer>
    </div>
  );
}