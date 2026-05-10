import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Check, ChevronDown, ChevronUp, Zap, BookOpen, Wrench,
  Shield, Database, Star, Users, Lock, Flame, FlaskConical, Radio,
  Cpu, Activity, FileText, Award, Play, Globe, Mail
} from "lucide-react";
import { base44 } from "@/api/base44Client";

// ── Countdown ──────────────────────────────────────────────────────────────────
const DEADLINE_KEY = "apex_founding_deadline";
function getDeadline() {
  let d = localStorage.getItem(DEADLINE_KEY);
  if (!d) { d = (Date.now() + 48 * 3600 * 1000).toString(); localStorage.setItem(DEADLINE_KEY, d); }
  return parseInt(d);
}
function useCountdown() {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    const dl = getDeadline();
    const tick = () => setLeft(Math.max(0, dl - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = n => String(n).padStart(2, "0");
  const h = Math.floor(left / 3600000), m = Math.floor((left % 3600000) / 60000), s = Math.floor((left % 60000) / 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const RESEARCH_DOMAINS = [
  { icon: <Radio size={20} />, label: "RF & Signal Systems", color: "#06b6d4" },
  { icon: <Activity size={20} />, label: "Resonance Engineering", color: "#a855f7" },
  { icon: <FlaskConical size={20} />, label: "EM Instrumentation", color: "#22c55e" },
  { icon: <Cpu size={20} />, label: "FPGA & Embedded Systems", color: "#f97316" },
  { icon: <Shield size={20} />, label: "EMI Shielding & Analysis", color: "#eab308" },
  { icon: <Database size={20} />, label: "Historical Patent Research", color: "#ec4899" },
  { icon: <FileText size={20} />, label: "Sensor & Measurement", color: "#8b5cf6" },
  { icon: <Globe size={20} />, label: "Bioelectromagnetics", color: "#14b8a6" },
];

const MEMBERSHIP_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 9.99,
    color: "#06b6d4",
    badge: "ENTRY",
    desc: "Research archive & concept library",
    features: [
      "Interactive electromagnetic concept graph",
      "Historical patent research archive (200+ entries)",
      "Prior art analysis library",
      "Engineering glossary & reference docs",
    ],
    locked: ["Build plan library", "Video training series", "AI patent tools"],
  },
  {
    id: "research",
    name: "Research Lab",
    price: 49,
    color: "#a855f7",
    badge: "POPULAR",
    desc: "5 courses + 5 build plans, rotating monthly",
    features: [
      "5 structured engineering courses (monthly rotation)",
      "5 complete build plans with full BOM & schematics",
      "25% discount on additional content",
      "Monthly course & build drops",
      "Community forum access",
    ],
    locked: ["AI Patent Suite", "Unlimited forges"],
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro Lab",
    price: 99,
    color: "#22c55e",
    badge: "BEST VALUE",
    desc: "Full platform: 10 courses + patent tools + forge",
    features: [
      "10 structured engineering courses (rotating)",
      "10 build plans with full BOM, schematics & sourcing",
      "AI Patent Suite — drafting, analysis, threat monitoring",
      "5 Invention Forge sessions/month",
      "Priority forum & expert support",
      "Early access to new content drops",
    ],
    locked: [],
  },
];

const STATS = [
  { val: "200+", label: "Research Entries", sub: "Patent-sourced & peer-reviewed" },
  { val: "40+", label: "Build Plans", sub: "Full BOM & assembly guides" },
  { val: "40+", label: "Structured Courses", sub: "Beginner to advanced" },
  { val: "5", label: "AI Patent Tools", sub: "Professional-grade analysis" },
];

const TRUST_PILLARS = [
  {
    icon: <Award size={22} className="text-cyan-400" />,
    title: "Patent-Sourced Content",
    desc: "Every build plan and research entry is traceable to a granted US patent, peer-reviewed publication, or declassified government document. Sources are cited inline.",
  },
  {
    icon: <FlaskConical size={22} className="text-purple-400" />,
    title: "Engineering Methodology",
    desc: "All documentation follows standard engineering practices: calibrated specifications, measurement methodology, standardized BOM formatting, and safety protocols.",
  },
  {
    icon: <Shield size={22} className="text-green-400" />,
    title: "Educational Framework",
    desc: "This is a research and educational platform. Content is designed for learning, experimentation, and academic study — not commercial deployment or medical application.",
  },
  {
    icon: <Users size={22} className="text-yellow-400" />,
    title: "Maker & Researcher Community",
    desc: "Built for engineers, students, experimenters, and researchers who want access to advanced technical content not available in mainstream curricula.",
  },
];

const COURSE_CATEGORIES = [
  { emoji: "📡", name: "RF & Signal Systems", count: 6 },
  { emoji: "🔬", name: "Resonance Engineering", count: 5 },
  { emoji: "⚡", name: "EM Instrumentation", count: 7 },
  { emoji: "🛡️", name: "EMI & Shielding", count: 4 },
  { emoji: "💾", name: "FPGA & Embedded", count: 5 },
  { emoji: "🧬", name: "Bioelectromagnetic Research", count: 4 },
  { emoji: "📊", name: "Signal Analysis", count: 5 },
  { emoji: "📁", name: "Historical Patent Archive", count: 8 },
];

const FAQS = [
  {
    q: "What exactly is in the research archive?",
    a: "The archive contains 200+ research entries, each sourced from granted US patents, peer-reviewed scientific publications, or declassified government documents. Every entry includes the original source citation, technical analysis, key claims, and engineering notes.",
  },
  {
    q: "Who is this platform designed for?",
    a: "Advanced electronics hobbyists, RF experimenters, makers, engineering students, independent researchers, instrumentation enthusiasts, FPGA builders, signal analysis enthusiasts, and anyone serious about experimental electromagnetics.",
  },
  {
    q: "Are these real, buildable devices?",
    a: "Yes. Every build plan includes a complete Bill of Materials with part numbers, exact specifications, supplier recommendations, and step-by-step assembly instructions. Parts are sourced from standard electronics suppliers (Digikey, Mouser, Amazon).",
  },
  {
    q: "What's the difference between tiers?",
    a: "Starter gives you archive access. Research Lab adds 5 rotating courses + 5 build plans monthly. Pro Lab includes 10 courses, 10 builds, the full AI Patent Suite, and Invention Forge sessions.",
  },
  {
    q: "Is there a free option to explore first?",
    a: "Yes — the Free Vault gives you 1 complete build plan, 1 free course module, and access to the electromagnetic concept graph with no payment required.",
  },
  {
    q: "What does the AI Patent Suite include?",
    a: "The AI Patent Suite includes an attorney-grade patent drafting wizard, novelty analysis, freedom-to-operate research, competitive landscape mapping, prior art cross-reference, and automated patent threat monitoring.",
  },
];

// ── Components ─────────────────────────────────────────────────────────────────

function PlanCard({ plan, isAnnual }) {
  const [loading, setLoading] = useState(false);
  const displayPrice = isAnnual ? Math.round(plan.price * 0.8) : plan.price;

  const handleCheckout = async () => {
    if (window.self !== window.top) {
      alert("Checkout only works from the published app.");
      return;
    }
    setLoading(true);
    try {
      const priceInCents = isAnnual
        ? Math.round(plan.price * 0.8 * 12 * 100)
        : Math.round(plan.price * 100);
      const res = await base44.functions.invoke("createCheckoutSession", {
        title: `Aethon Apex IP — ${plan.name} Membership`,
        priceInCents,
        description: plan.desc,
        category: "membership",
        successUrl: `${window.location.origin}/member-dashboard`,
        cancelUrl: `${window.location.origin}/start`,
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden transition-all ${plan.highlight ? "ring-2 shadow-2xl scale-[1.02]" : "border border-gray-800"}`}
      style={plan.highlight ? { ringColor: plan.color, boxShadow: `0 0 50px ${plan.color}25` } : {}}
    >
      <div className="py-2 text-center text-xs font-black tracking-widest text-white" style={{ backgroundColor: plan.color }}>
        {plan.badge}
      </div>
      <div className="p-6 bg-gray-900 flex flex-col flex-1">
        <h3 className="text-white font-black text-xl mb-1">{plan.name}</h3>
        <p className="text-gray-400 text-xs mb-5">{plan.desc}</p>

        <div className="flex items-end gap-1 mb-1">
          <span className="text-5xl font-black" style={{ color: plan.color }}>${displayPrice}</span>
          <span className="text-gray-500 mb-2 text-sm">/mo</span>
        </div>
        {isAnnual && <p className="text-green-400 text-xs font-bold mb-1">Save 20% — billed annually</p>}
        <p className="text-gray-600 text-xs mb-6">{isAnnual ? `$${Math.round(displayPrice * 12)}/year` : "Monthly billing"}</p>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-3 rounded-xl font-black text-white text-sm transition-all hover:opacity-90 mb-5"
          style={{ backgroundColor: plan.color }}
        >
          {loading ? "Processing..." : `Get ${plan.name} →`}
        </button>

        <div className="space-y-2.5 flex-1">
          {plan.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-200">
              <Check size={12} className="flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
              {f}
            </div>
          ))}
          {plan.locked.length > 0 && (
            <>
              <div className="border-t border-gray-800 my-2" />
              {plan.locked.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <Lock size={12} className="flex-shrink-0 mt-0.5" />
                  {f}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FaqItem({ f, i, open, setOpen }) {
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(open === i ? null : i)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-900/60 transition-colors"
      >
        <span className="text-white font-semibold text-sm">{f.q}</span>
        {open === i
          ? <ChevronUp size={15} className="text-cyan-400 flex-shrink-0 ml-3" />
          : <ChevronDown size={15} className="text-gray-500 flex-shrink-0 ml-3" />}
      </button>
      {open === i && (
        <div className="px-5 pb-4 text-gray-300 text-sm leading-relaxed border-t border-gray-800 pt-3">
          {f.a}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function FunnelHome() {
  const countdown = useCountdown();
  const [isAnnual, setIsAnnual] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!email) return;
    await base44.entities.NewsletterSubscriber.create({
      email: email.toLowerCase().trim(),
      source: "funnel_home_v2",
      status: "active",
    });
    setSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── URGENCY BAR ── */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 px-4 py-2 flex flex-wrap items-center justify-center gap-2 text-sm">
        <Flame size={12} className="text-orange-400 flex-shrink-0" />
        <span className="text-gray-300 text-xs">Founding member rate locks in <span className="font-black text-white font-mono">{countdown}</span> — price increases after 1,000 members</span>
      </div>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bce328987_a6e3bd669_logo.png"
            alt="Aethon Apex IP"
            className="h-9 w-9 object-contain"
          />
          <div>
            <div className="text-white font-black text-base tracking-tight leading-none">Aethon Apex IP</div>
            <div className="text-gray-500 text-[10px] tracking-widest uppercase">Experimental Engineering Research</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/free-vault" className="text-gray-400 hover:text-white text-xs font-semibold px-3 py-2 transition-colors hidden sm:block">
            Free Vault
          </Link>
          <Link to="/prior-art" className="text-gray-400 hover:text-white text-xs font-semibold px-3 py-2 transition-colors hidden sm:block">
            Archive
          </Link>
          <a href="#pricing" className="px-4 py-2 rounded-lg text-xs font-black text-white transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
            Join Platform
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative px-6 pt-24 pb-20 text-center overflow-hidden">
        {/* bg glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cyan-900/8 blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-900/8 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-xs font-bold mb-8 uppercase tracking-widest">
            <Star size={10} className="text-yellow-400" /> Patent-Sourced · Peer-Reviewed · Engineering-Grade
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6">
            The Research Vault for<br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Serious Engineers
            </span>
          </h1>

          <p className="text-gray-300 text-xl leading-relaxed max-w-2xl mx-auto mb-4">
            A structured, citation-backed research platform for advanced electronics, RF systems, resonance engineering, and electromagnetic instrumentation — built for experimenters who demand rigor.
          </p>
          <p className="text-gray-500 text-sm max-w-xl mx-auto mb-10">
            200+ research archive entries · 40+ documented build plans · 40+ structured courses · AI patent analysis suite
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <Link
              to="/free-vault"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-cyan-700 text-cyan-300 hover:bg-cyan-900/20 font-bold text-sm transition-all"
            >
              <Database size={15} /> Explore Free Archive
            </Link>
            <a
              href="#pricing"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-white text-sm transition-all shadow-lg"
              style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 6px 30px rgba(124,58,237,0.35)" }}
            >
              View Membership Plans <ArrowRight size={15} />
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
            {["Patent-sourced documentation", "Calibrated engineering specs", "Full BOM with part numbers", "Active researcher community"].map((t, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <Check size={11} className="text-green-400" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-y border-gray-800 bg-gray-900/40 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-black text-white mb-1">{s.val}</div>
              <div className="text-gray-200 font-bold text-sm">{s.label}</div>
              <div className="text-gray-600 text-xs mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── RESEARCH DOMAINS ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Research Coverage</p>
          <h2 className="text-3xl font-black text-white mb-3">8 Core Engineering Domains</h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Structured content across the most underserved areas of advanced experimental electronics and electromagnetic research.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {RESEARCH_DOMAINS.map((d, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 flex flex-col items-center text-center gap-2 transition-all cursor-default"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: d.color + "20", color: d.color }}>
                {d.icon}
              </div>
              <p className="text-white text-xs font-bold leading-snug">{d.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="border-y border-gray-800 bg-gray-900/20 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Platform Contents</p>
            <h2 className="text-3xl font-black text-white mb-3">Everything Inside the Platform</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">A complete research-to-build ecosystem, from archive access to hands-on engineering documentation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <Database size={22} className="text-cyan-400" />,
                title: "Research Archive",
                tag: "FREE",
                tagColor: "bg-cyan-900/40 border-cyan-800 text-cyan-300",
                items: [
                  "200+ research entries with inline citations",
                  "Historical patent analysis library",
                  "Prior art cross-reference database",
                  "Interactive electromagnetic concept graph",
                  "Engineering glossary & reference docs",
                ],
              },
              {
                icon: <Wrench size={22} className="text-orange-400" />,
                title: "Build Plan Library",
                tag: "MEMBER",
                tagColor: "bg-orange-900/40 border-orange-800 text-orange-300",
                items: [
                  "40+ complete device build plans",
                  "Calibrated BOM with exact part numbers",
                  "Verified supplier links & cost estimates",
                  "Step-by-step assembly instructions",
                  "Circuit schematics & wiring diagrams",
                ],
              },
              {
                icon: <BookOpen size={22} className="text-purple-400" />,
                title: "Course Library",
                tag: "MEMBER",
                tagColor: "bg-purple-900/40 border-purple-800 text-purple-300",
                items: [
                  "40+ structured engineering courses",
                  "RF systems, resonance, EM instrumentation",
                  "FPGA, Arduino & embedded labs",
                  "Signal analysis & measurement methodology",
                  "Patent strategy & IP protection modules",
                ],
              },
              {
                icon: <Zap size={22} className="text-yellow-400" />,
                title: "AI Patent Suite",
                tag: "PRO",
                tagColor: "bg-yellow-900/40 border-yellow-800 text-yellow-300",
                items: [
                  "USPTO-formatted patent drafting wizard",
                  "AI patent attorney consultation",
                  "Novelty & freedom-to-operate analysis",
                  "Competitive landscape mapping",
                  "Automated patent threat monitoring",
                ],
              },
              {
                icon: <FlaskConical size={22} className="text-green-400" />,
                title: "Invention Forge",
                tag: "PRO",
                tagColor: "bg-green-900/40 border-green-800 text-green-300",
                items: [
                  "Hybrid concept generation engine",
                  "IP valuation estimation tool",
                  "Patent claim generation",
                  "Commercialization roadmap",
                  "Investor pitch deck export",
                ],
              },
              {
                icon: <Users size={22} className="text-blue-400" />,
                title: "Researcher Community",
                tag: "MEMBER",
                tagColor: "bg-blue-900/40 border-blue-800 text-blue-300",
                items: [
                  "Active forum for experimenters",
                  "Build troubleshooting threads",
                  "Patent discussion & analysis",
                  "Monthly community challenges",
                  "Expert researcher Q&A sessions",
                ],
              },
            ].map((block, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  {block.icon}
                  <div>
                    <p className="text-white font-black text-base">{block.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${block.tagColor}`}>{block.tag}</span>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-300">
                      <Check size={11} className="flex-shrink-0 text-gray-500 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSE CATEGORIES ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Course Library</p>
          <h2 className="text-3xl font-black text-white mb-3">Structured Learning Tracks</h2>
          <p className="text-gray-400 text-sm">From RF fundamentals to advanced electromagnetic instrumentation — each track builds toward practical experimentation skills.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COURSE_CATEGORIES.map((c, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 flex flex-col gap-2 transition-all">
              <span className="text-2xl">{c.emoji}</span>
              <p className="text-white font-bold text-sm leading-snug">{c.name}</p>
              <p className="text-gray-600 text-xs">{c.count} courses</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/course-catalogue" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 text-sm font-semibold transition-all">
            Browse Full Course Catalogue <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── TRUST PILLARS ── */}
      <section className="border-y border-gray-800 bg-gray-900/20 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Why Trust This Platform</p>
            <h2 className="text-3xl font-black text-white mb-3">Built on Engineering Rigor</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TRUST_PILLARS.map((p, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                  {p.icon}
                </div>
                <div>
                  <p className="text-white font-black text-base mb-1">{p.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Disclaimer */}
          <div className="mt-6 bg-gray-900/60 border border-gray-800 rounded-xl px-5 py-4 text-xs text-gray-500 leading-relaxed text-center">
            All content is provided for research, educational, and experimental purposes only. No device or system described on this platform has been approved by any regulatory authority for medical, therapeutic, or commercial application. Experimenters are responsible for compliance with local regulations and safety standards.
          </div>
        </div>
      </section>

      {/* ── BUILD PLANS PREVIEW ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Build Plan Library</p>
          <h2 className="text-3xl font-black text-white mb-3">Engineering-Grade Build Plans</h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Every plan includes a calibrated BOM, verified specifications, circuit schematics, and step-by-step assembly instructions — sourced from granted patents and technical research.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { emoji: "🔌", name: "MEG Replication Device", tag: "Electromagnetic Induction", specs: "23 components · Toroidal core geometry · 12V regulated" },
            { emoji: "📡", name: "Scalar EM Lab System", tag: "RF Instrumentation", specs: "18 components · Phase conjugation · Signal generator req." },
            { emoji: "🧲", name: "Resonance Test Bench", tag: "Resonance Engineering", specs: "31 components · Variable inductance · Oscilloscope req." },
          ].map((b, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="text-3xl mb-3">{b.emoji}</div>
              <p className="text-white font-black text-sm mb-1">{b.name}</p>
              <p className="text-cyan-400 text-xs font-bold mb-2">{b.tag}</p>
              <p className="text-gray-500 text-xs">{b.specs}</p>
              <div className="mt-3 pt-3 border-t border-gray-800">
                <Link to="/invention-plans" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors font-semibold">
                  <Lock size={10} /> Member access required
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/free-vault" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 text-sm font-semibold transition-all">
            View Sample Build Plan (Free) <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="border-y border-gray-800 bg-gray-900/30 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-950/50 border border-yellow-800/50 text-yellow-300 text-xs font-bold mb-4 uppercase tracking-wider">
              <Flame size={10} /> Founding Rate · {countdown} remaining
            </div>
            <h2 className="text-4xl font-black mb-3">Choose Your Access Level</h2>
            <p className="text-gray-400 max-w-lg mx-auto text-sm">Start free. Upgrade when you're ready to go deeper.</p>
            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className={`text-sm font-semibold ${!isAnnual ? "text-white" : "text-gray-500"}`}>Monthly</span>
              <button
                onClick={() => setIsAnnual(a => !a)}
                className={`w-12 h-6 rounded-full relative transition-colors ${isAnnual ? "bg-purple-600" : "bg-gray-700"}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isAnnual ? "translate-x-7" : "translate-x-1"}`} />
              </button>
              <span className={`text-sm font-semibold ${isAnnual ? "text-white" : "text-gray-500"}`}>
                Annual <span className="text-green-400 font-black">— Save 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {MEMBERSHIP_PLANS.map((plan) => <PlanCard key={plan.id} plan={plan} isAnnual={isAnnual} />)}
          </div>

          {/* One-time forge */}
          <div className="mt-5 bg-gray-900 border border-yellow-800/50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-900/30 border border-yellow-800 flex items-center justify-center">
                <Zap size={22} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-black text-lg">Single Invention Forge — One-Time</p>
                <p className="text-gray-400 text-sm">Generate 1 hybrid invention concept with IP valuation, patent claims & market analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="text-4xl font-black text-yellow-400">$29</span>
              <Link
                to="/invention-forge"
                className="px-5 py-2.5 rounded-xl font-black text-sm text-black transition-all whitespace-nowrap"
                style={{ backgroundColor: "#fbbf24" }}
              >
                Buy One Run →
              </Link>
            </div>
          </div>

          <p className="text-center text-gray-600 text-xs mt-6">🔒 Secured by Stripe · Cancel anytime · Instant access</p>
        </div>
      </section>

      {/* ── FOUNDER STORY ── */}
      <section className="px-6 py-20 max-w-3xl mx-auto text-center">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-700 to-purple-700 flex items-center justify-center text-2xl mx-auto mb-5">
            🔬
          </div>
          <h2 className="text-2xl font-black mb-4">Why This Platform Exists</h2>
          <p className="text-gray-300 text-base leading-relaxed mb-4">
            After years of navigating fragmented research libraries, scattered patents, and inaccessible technical documentation — we built the platform we wished existed.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Aethon Apex IP is a structured knowledge vault for experimental engineering. Every resource is citation-backed, every build plan is calibrated to engineering standards, and every course is built to take you from concept to working prototype.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Whether you're replicating a historical patent, studying electromagnetic instrumentation, or developing original IP — this platform gives you the research infrastructure to move fast and work with precision.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-8">Common Questions</h2>
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <FaqItem key={i} f={f} i={i} open={faqOpen} setOpen={setFaqOpen} />
          ))}
        </div>
      </section>

      {/* ── EMAIL CAPTURE ── */}
      <section className="border-t border-gray-800 bg-gray-900/30 px-6 py-16">
        <div className="max-w-xl mx-auto text-center">
          <Mail size={28} className="text-cyan-400 mx-auto mb-4" />
          <h3 className="text-2xl font-black mb-2">Get a Free Course Module</h3>
          <p className="text-gray-400 text-sm mb-6">Weekly engineering research breakdowns + a free introductory course module — no credit card required.</p>
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-green-400 font-bold">
              <Check size={18} /> You're in — check your inbox.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSubscribe}
                className="px-5 py-3 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-black text-sm whitespace-nowrap transition-all"
              >
                Get Free Module
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-6 py-20 max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-black mb-4">Start Your Research Today</h2>
        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
          Free access to the archive. No credit card required. Upgrade when you're ready to build.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/free-vault"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-bold text-sm transition-all">
            <Database size={15} /> Enter Free Vault
          </Link>
          <a href="#pricing"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-white text-sm transition-all shadow-lg"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 4px 24px rgba(124,58,237,0.4)" }}>
            View Membership Plans <ArrowRight size={15} />
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-800 px-6 py-10 text-center text-gray-600 text-xs">
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bce328987_a6e3bd669_logo.png" alt="" className="h-6 w-6 object-contain" />
          <span className="text-gray-500 font-bold">Aethon Apex IP · Zenith Apex LLC</span>
        </div>
        <p className="mb-4">All content is for research and educational purposes only. Not legal, medical, or regulatory advice.</p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
          <Link to="/refund-policy" className="hover:text-gray-400 transition-colors">Refund Policy</Link>
          <Link to="/research-disclaimer" className="hover:text-gray-400 transition-colors">Research Disclaimer</Link>
          <Link to="/free-vault" className="hover:text-gray-400 transition-colors">Free Vault</Link>
          <Link to="/prior-art" className="hover:text-gray-400 transition-colors">Archive</Link>
          <Link to="/pricing" className="hover:text-gray-400 transition-colors">Pricing</Link>
        </div>
      </footer>
    </div>
  );
}