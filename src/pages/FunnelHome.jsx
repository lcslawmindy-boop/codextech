import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Check, ChevronDown, ChevronUp, Zap, BookOpen, Wrench,
  Shield, Database, Star, Lock, Flame, FlaskConical, Radio,
  Cpu, Activity, FileText, Mail, Play, Users, Award, Microscope
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import ResearchSlideStrip from "../components/ResearchSlideStrip";
import DocumentSlideStrip from "../components/DocumentSlideStrip";

const HERO_BG_IMAGES = [
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fee7eab82_sleek-mri-scanner-room-enhanced-holographic-displays-brain-scans-other-medical-data-embodying-cutting-edge-314416241.webp",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/e034601cd_modern-office-space-with-empty-bookshelves-and-clean-decor-generated-by-ai-photo.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/102b5679d_IMG_8294-Copy-Copy.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4cdb09bb8_IMG_8295.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a9bd6b186_mri-machine-medical-interior-design-with-lights_932514-2211.jpg",
];

// ── Countdown ──────────────────────────────────────────────────────────────────
const DEADLINE_KEY = "apex_founding_deadline_v3";
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

// ── Membership Tiers ──────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "explorer",
    name: "Explorer",
    monthly: 29,
    annual: 24,
    color: "#06b6d4",
    badge: "STARTER",
    desc: "Research archive & concept library access",
    features: [
      "Interactive electromagnetic concept graph (100+ nodes)",
      "Prior Art Archive — 200+ patent-sourced entries",
      "Engineering glossary & reference library",
      "Community forum read access",
    ],
    locked: ["Build plan library", "Structured courses", "AI patent tools"],
  },
  {
    id: "research",
    name: "Research Lab",
    monthly: 49,
    annual: 39,
    color: "#a855f7",
    badge: "MOST POPULAR",
    desc: "3 courses + 3 build plans + AI Patent Suite + 5 Forge sessions",
    features: [
      "3 structured engineering courses (rotating monthly)",
      "3 complete build plans with BOM & schematics",
      "AI Patent Suite — drafting, analysis & monitoring",
      "5 Invention Forge sessions per month",
      "Community forum full access",
    ],
    locked: [],
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro Builder",
    monthly: 149,
    annual: 119,
    color: "#f97316",
    badge: "BEST VALUE",
    desc: "6 courses + 6 build plans + AI Patent Suite + 20 Forge sessions",
    features: [
      "6 structured engineering courses (rotating)",
      "6 full build plans with BOM, schematics & sourcing",
      "AI Patent Suite — drafting, analysis & threat monitoring",
      "20 Invention Forge sessions per month",
      "Priority support & expert forum access",
      "Early access to all new content drops",
    ],
    locked: [],
  },
];

const STATS = [
  { val: "200+", label: "Research Archive Entries", sub: "Patent-sourced & peer-reviewed" },
  { val: "40+", label: "Engineering Build Plans", sub: "Full BOM & assembly guides" },
  { val: "40+", label: "Structured Courses", sub: "Beginner to advanced tracks" },
  { val: "5", label: "AI Patent Tools", sub: "Attorney-grade analysis" },
];

const RESEARCH_DOMAINS = [
  { icon: <Radio size={18} />, label: "RF & Signal Systems", color: "#06b6d4" },
  { icon: <Activity size={18} />, label: "Resonance Engineering", color: "#a855f7" },
  { icon: <FlaskConical size={18} />, label: "EM Instrumentation", color: "#22c55e" },
  { icon: <Cpu size={18} />, label: "FPGA & Embedded Systems", color: "#f97316" },
  { icon: <Shield size={18} />, label: "EMI Shielding & Analysis", color: "#eab308" },
  { icon: <Database size={18} />, label: "Historical Patent Research", color: "#ec4899" },
  { icon: <Microscope size={18} />, label: "Sensor & Measurement", color: "#8b5cf6" },
  { icon: <Activity size={18} />, label: "Bioelectromagnetics", color: "#14b8a6" },
];

const FAQS = [
  {
    q: "Is this real engineering documentation or theoretical speculation?",
    a: "Every build plan cites granted US patents, peer-reviewed journals, or declassified government documents. Sources are cited inline. The MEG device (US Patent 6,362,718) was published in Foundations of Physics Letters by a PhD physicist. All content is presented for educational and research purposes.",
  },
  {
    q: "Can I actually build these devices?",
    a: "Yes. Every build plan includes a calibrated Bill of Materials with exact part numbers, verified supplier links, and step-by-step assembly instructions. Most components are available from Digikey, Mouser, or Amazon.",
  },
  {
    q: "Who is this platform for?",
    a: "Advanced electronics hobbyists, RF experimenters, engineering students, independent researchers, FPGA builders, instrumentation enthusiasts, and anyone serious about experimental electromagnetic systems.",
  },
  {
    q: "What's included in the AI Patent Suite?",
    a: "The suite includes a USPTO-formatted patent drafting wizard, novelty analysis, freedom-to-operate research, competitive landscape mapping, prior art cross-reference, and automated patent threat monitoring.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime from your account settings. No long-term contracts. Access continues to the end of your billing period.",
  },
  {
    q: "Is there a free way to explore first?",
    a: "Yes — the Free Vault gives you 1 complete build plan, 1 course module, and access to the research graph with no payment required.",
  },
];

// ── Components ────────────────────────────────────────────────────────────────

function HeroSection() {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % HERO_BG_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative px-6 pt-20 pb-16 text-center overflow-hidden min-h-[600px] flex items-center">
      {/* Rotating background carousel */}
      {HERO_BG_IMAGES.map((img, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-1500"
          style={{ opacity: idx === bgIndex ? 1 : 0 }}
        >
          <img src={img} alt="research background" className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/60 to-slate-950/75" />
      
      {/* Accent glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-cyan-900/10 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 backdrop-blur border border-cyan-700/50 text-cyan-300 text-xs font-bold mb-8 uppercase tracking-widest">
          <Star size={10} className="text-yellow-400" /> Patent-Sourced · Peer-Reviewed · Engineering-Grade
        </div>

        <h1 className="text-5xl md:text-6xl font-black leading-none tracking-tight mb-6">
          The Research Platform for<br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Serious Engineers
          </span>
        </h1>

        <p className="text-slate-200 text-xl leading-relaxed max-w-2xl mx-auto mb-3">
          A structured, citation-backed research platform for advanced electronics, RF systems, resonance engineering, and electromagnetic instrumentation.
        </p>
        <p className="text-slate-400 text-sm max-w-xl mx-auto mb-10">
          200+ research entries · 40+ documented build plans · 40+ structured courses · AI patent suite
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <Link to="/free-vault"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-slate-600 text-slate-200 hover:bg-slate-800/50 font-bold text-sm transition-all backdrop-blur">
            <Database size={15} /> Explore Free Archive
          </Link>
          <a href="#pricing"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-white text-sm transition-all shadow-lg backdrop-blur"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.9), rgba(37,99,235,0.9))", boxShadow: "0 6px 30px rgba(124,58,237,0.35)" }}>
            View Membership Plans <ArrowRight size={15} />
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          {["Patent-sourced documentation", "Calibrated engineering specs", "Full BOM with part numbers", "Active researcher community"].map((t, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <Check size={11} className="text-green-400" /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function TierCard({ tier, isAnnual }) {
  const [loading, setLoading] = useState(false);
  const price = isAnnual ? tier.annual : tier.monthly;

  const PRICE_IDS = {
    explorer:   { monthly: "price_1TXTFLBkbCWuj2nHKPYdnfH0", annual: "price_1TXTFLBkbCWuj2nHlkPxvXC8" },
    research:   { monthly: "price_1TXTFLBkbCWuj2nHbK0MpT7x", annual: "price_1TXTFLBkbCWuj2nH9LC0ABm0" },
    pro:        { monthly: "price_1TXTFLBkbCWuj2nHHKfUYuoV", annual: "price_1TXTFLBkbCWuj2nHXEZn1hEc" },
  };

  const handleCheckout = async () => {
    if (window.self !== window.top) { alert("Checkout only works from the published app."); return; }
    setLoading(true);
    try {
      const priceId = PRICE_IDS[tier.id]?.[isAnnual ? "annual" : "monthly"];
      const res = await base44.functions.invoke("createCheckoutSession", {
        title: `Aethon Apex IP — ${tier.name}`,
        priceId,
        mode: "subscription",
        category: "membership",
        successUrl: `${window.location.origin}/member-dashboard?checkout=success`,
        cancelUrl: `${window.location.origin}/start`,
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-hidden border transition-all ${
        tier.highlight ? "shadow-2xl scale-[1.02]" : "border-slate-800"
      }`}
      style={tier.highlight ? { borderColor: tier.color, boxShadow: `0 0 40px ${tier.color}20` } : {}}
    >
      <div className="py-2 text-center text-xs font-black tracking-widest text-white" style={{ backgroundColor: tier.color }}>
        {tier.badge}
      </div>
      <div className="p-6 bg-slate-900 flex flex-col flex-1">
        <h3 className="text-white font-black text-xl mb-1">{tier.name}</h3>
        <p className="text-slate-400 text-xs mb-5">{tier.desc}</p>

        <div className="flex items-end gap-1 mb-1">
          <span className="text-5xl font-black" style={{ color: tier.color }}>${price}</span>
          <span className="text-slate-500 mb-2 text-sm">/mo</span>
        </div>
        {isAnnual && <p className="text-green-400 text-xs font-bold mb-1">Save ${(tier.monthly - tier.annual) * 12}/year — billed annually</p>}
        <p className="text-slate-600 text-xs mb-6">{isAnnual ? `$${tier.annual * 12}/year` : "Monthly billing, cancel anytime"}</p>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-3 rounded-xl font-black text-white text-sm transition-all hover:opacity-90 mb-5"
          style={{ backgroundColor: tier.color }}
        >
          {loading ? "Processing..." : `Start ${tier.name} →`}
        </button>

        <div className="space-y-2.5 flex-1">
          {tier.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
              <Check size={12} className="flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
              {f}
            </div>
          ))}
          {tier.locked.length > 0 && (
            <>
              <div className="border-t border-slate-800 my-2" />
              {tier.locked.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
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
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(open === i ? null : i)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-900/60 transition-colors"
      >
        <span className="text-white font-semibold text-sm">{f.q}</span>
        {open === i
          ? <ChevronUp size={15} className="text-cyan-400 flex-shrink-0 ml-3" />
          : <ChevronDown size={15} className="text-slate-500 flex-shrink-0 ml-3" />}
      </button>
      {open === i && (
        <div className="px-5 pb-4 text-slate-300 text-sm leading-relaxed border-t border-slate-800 pt-3">
          {f.a}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FunnelHome() {
  const countdown = useCountdown();
  const [isAnnual, setIsAnnual] = useState(true);
  const [faqOpen, setFaqOpen] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!email) return;
    await base44.entities.NewsletterSubscriber.create({
      email: email.toLowerCase().trim(),
      source: "home_v3",
      status: "active",
    });
    setSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <ResearchSlideStrip />

      <div className="flex-1 min-w-0">
      {/* ── Urgency Bar ── */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-center gap-2">
        <Flame size={12} className="text-orange-400" />
        <span className="text-slate-400 text-xs">Founding member rate expires in</span>
        <span className="font-black text-white font-mono text-xs">{countdown}</span>
        <span className="text-slate-500 text-xs">— price increases after 1,000 members</span>
      </div>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-slate-950/98 backdrop-blur border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bce328987_a6e3bd669_logo.png"
            alt="Aethon Apex IP"
            className="h-8 w-8 object-contain"
          />
          <div>
            <div className="text-white font-black text-sm leading-none">Aethon Apex IP</div>
            <div className="text-slate-500 text-[10px] tracking-widest uppercase">Experimental Engineering Research</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/free-vault" className="text-slate-400 hover:text-white text-xs font-semibold px-3 py-2 hidden sm:block transition-colors">
            Free Vault
          </Link>
          <Link to="/prior-art" className="text-slate-400 hover:text-white text-xs font-semibold px-3 py-2 hidden sm:block transition-colors">
            Archive
          </Link>
          <a href="#pricing"
            className="px-4 py-2 rounded-lg text-xs font-black text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
            Join Platform
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <HeroSection />



      {/* ── Stats Bar ── */}
      <section className="border-y border-slate-800 bg-slate-900/40 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-black text-white mb-1">{s.val}</div>
              <div className="text-slate-200 font-bold text-sm">{s.label}</div>
              <div className="text-slate-600 text-xs mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Research Domains ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Coverage</p>
          <h2 className="text-3xl font-black text-white mb-3">8 Core Engineering Domains</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Structured content across the most underserved areas of advanced experimental electronics research.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {RESEARCH_DOMAINS.map((d, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-4 flex flex-col items-center text-center gap-2 transition-all">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: d.color + "20", color: d.color }}>
                {d.icon}
              </div>
              <p className="text-white text-xs font-bold leading-snug">{d.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What You Get ── */}
      <section className="border-y border-slate-800 bg-slate-900/20 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Platform Contents</p>
            <h2 className="text-3xl font-black text-white mb-3">Everything Inside</h2>
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
                  "Circuit schematics & wiring diagrams",
                  "Step-by-step assembly instructions",
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
                  "Expert researcher Q&A",
                ],
              },
            ].map((block, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  {block.icon}
                  <div>
                    <p className="text-white font-black text-base">{block.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${block.tagColor}`}>{block.tag}</span>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check size={11} className="flex-shrink-0 text-slate-500 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Pillars ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Why Trust This Platform</p>
          <h2 className="text-3xl font-black text-white mb-3">Built on Engineering Rigor</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { icon: <Award size={22} className="text-cyan-400" />, title: "Patent-Sourced Content", desc: "Every build plan and research entry is traceable to a granted US patent, peer-reviewed publication, or declassified government document. Sources are cited inline." },
            { icon: <FlaskConical size={22} className="text-purple-400" />, title: "Engineering Methodology", desc: "All documentation follows standard engineering practices: calibrated specifications, measurement methodology, standardized BOM formatting, and safety protocols." },
            { icon: <Shield size={22} className="text-green-400" />, title: "Educational Framework", desc: "This is a research and educational platform. Content is designed for learning, experimentation, and academic study — not commercial deployment or medical application." },
            { icon: <Users size={22} className="text-yellow-400" />, title: "Maker & Researcher Community", desc: "Built for engineers, students, experimenters, and researchers who want access to advanced technical content not available in mainstream curricula." },
          ].map((p, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                {p.icon}
              </div>
              <div>
                <p className="text-white font-black text-base mb-1">{p.title}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-slate-900/60 border border-slate-800 rounded-xl px-5 py-4 text-xs text-slate-500 leading-relaxed text-center">
          All content is provided for research, educational, and experimental purposes only. No device described on this platform has been approved by any regulatory authority for medical, therapeutic, or commercial application.
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="border-y border-slate-800 bg-slate-900/30 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-950/50 border border-yellow-800/50 text-yellow-300 text-xs font-bold mb-4 uppercase tracking-wider">
              <Flame size={10} /> Founding Rate · {countdown} remaining
            </div>
            <h2 className="text-4xl font-black mb-3">Choose Your Access Level</h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm">Start free. Upgrade when you're ready to build.</p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className={`text-sm font-semibold ${!isAnnual ? "text-white" : "text-slate-500"}`}>Monthly</span>
              <button
                onClick={() => setIsAnnual(a => !a)}
                className={`w-12 h-6 rounded-full relative transition-colors ${isAnnual ? "bg-purple-600" : "bg-slate-700"}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isAnnual ? "translate-x-7" : "translate-x-1"}`} />
              </button>
              <span className={`text-sm font-semibold ${isAnnual ? "text-white" : "text-slate-500"}`}>
                Annual <span className="text-green-400 font-black">— Best Value</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {TIERS.map((tier) => <TierCard key={tier.id} tier={tier} isAnnual={isAnnual} />)}
          </div>

          <p className="text-center text-slate-600 text-xs mt-6">🔒 Secured by Stripe · Cancel anytime · Instant access</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-8">Common Questions</h2>
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <FaqItem key={i} f={f} i={i} open={faqOpen} setOpen={setFaqOpen} />
          ))}
        </div>
      </section>

      {/* ── Email Capture ── */}
      <section className="border-t border-slate-800 bg-slate-900/30 px-6 py-16">
        <div className="max-w-xl mx-auto text-center">
          <Mail size={28} className="text-cyan-400 mx-auto mb-4" />
          <h3 className="text-2xl font-black mb-2">Get a Free Course Module</h3>
          <p className="text-slate-400 text-sm mb-6">Weekly engineering research breakdowns + a free introductory course module. No credit card required.</p>
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
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500"
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

      {/* ── Final CTA ── */}
      <section className="px-6 py-20 max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-black mb-4">Start Your Research Today</h2>
        <p className="text-slate-400 text-lg mb-8">
          Free archive access. No credit card required. Upgrade when you're ready to build.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/free-vault"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-bold text-sm transition-all">
            <Database size={15} /> Enter Free Vault
          </Link>
          <a href="#pricing"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-white text-sm transition-all shadow-lg"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 4px 24px rgba(124,58,237,0.4)" }}>
            View Membership Plans <ArrowRight size={15} />
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 px-6 py-10 text-center text-slate-600 text-xs">
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bce328987_a6e3bd669_logo.png" alt="" className="h-6 w-6 object-contain" />
          <span className="text-slate-500 font-bold">Aethon Apex IP · Zenith Apex LLC</span>
        </div>
        <p className="mb-4">All content for research and educational purposes only. Not legal, medical, or regulatory advice.</p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/terms" className="hover:text-slate-400">Terms</Link>
          <Link to="/refund-policy" className="hover:text-slate-400">Refund Policy</Link>
          <Link to="/research-disclaimer" className="hover:text-slate-400">Research Disclaimer</Link>
          <Link to="/free-vault" className="hover:text-slate-400">Free Vault</Link>
          <Link to="/prior-art" className="hover:text-slate-400">Archive</Link>
          <Link to="/pricing" className="hover:text-slate-400">Pricing</Link>
        </div>
      </footer>
      </div>
      <DocumentSlideStrip />
    </div>
  );
}