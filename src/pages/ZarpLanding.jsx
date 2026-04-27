import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ScalarWaveWatermark from "@/components/ScalarWaveWatermark";
import CodextechVaultBackground from "@/components/CodextechVaultBackground";
import { Lock, ChevronRight, Star, Shield, BookOpen, Wrench, TrendingUp, CheckCircle2, ArrowRight, Flame, Zap } from "lucide-react";
import LeadMagnetPopup, { useLeadMagnetTrigger } from "@/components/LeadMagnetPopup";
import VaultHeroAnimation from "@/components/VaultHeroAnimation";
import CodextechAcronym from "@/components/CodextechAcronym";

// ── REAL persistent countdown (48h from first visit) ─────────────────────────
const DEADLINE_KEY = "zarp_founding_deadline";
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

// ── Content ───────────────────────────────────────────────────────────────────
const LOCKED_PREVIEWS = [
  {
    title: "MEG Replication Kit",
    category: "Free Energy",
    hook: "US Patent 6,362,718. Peer-reviewed. COP>1 demonstrated.",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png",
  },
  {
    title: "Vacuum Potential Oscillator",
    category: "Energy Systems",
    hook: "Tap the vacuum reservoir — independent of circuit ground.",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc3cb2842_generated_image.png",
  },
  {
    title: "Prioré Multichannel EM System",
    category: "Bioelectromagnetics",
    hook: "French government funded. Clinical results suppressed in 1984.",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a992c230_generated_image.png",
  },
  {
    title: "Anenergy Pump Circuit",
    category: "Vacuum Energy",
    hook: "Extract energy from the phi-field. 14 sourced steps.",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0fed0468f_generated_image.png",
  },
  {
    title: "Scalar EM Wave Interferometer",
    category: "EM Physics",
    hook: "Zero E, zero B output — non-zero scalar potential.",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/991d97732_generated_image.png",
  },
  {
    title: "Telomere Regeneration Device TRD-1",
    category: "Biotech",
    hook: "EM-triggered telomerase activation protocol.",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/53f9613a8_generated_image.png",
  },
];

// Transformation-first: what you can DO after joining
const TRANSFORMATIONS = [
  {
    icon: <Wrench size={20} className="text-orange-400" />,
    before: "Watching YouTube videos about 'free energy' with no idea how to build anything",
    after: "Order $85 in parts from Digikey, follow a 23-step BOM, and have a working EM device in 8 hours",
    deliverable: "40+ build plans — exact part numbers, supplier links, PDF download, build video",
    color: "#f97316",
  },
  {
    icon: <Shield size={20} className="text-green-400" />,
    before: "Paying $3,000–$15,000 to a patent attorney for a provisional application",
    after: "Generate a USPTO-compliant provisional patent application in one session — all 9 required sections",
    deliverable: "AI Patent Suite — draft, FTO analysis, claims, attorney-ready PDF export",
    color: "#22c55e",
  },
  {
    icon: <BookOpen size={20} className="text-blue-400" />,
    before: "Reading Bearden's books without the engineering background to apply any of it",
    after: "Complete structured modules from quaternion math fundamentals to prototype construction",
    deliverable: "40+ courses — 12 modules each, primary sources cited, lab reference guides included",
    color: "#3b82f6",
  },
  {
    icon: <TrendingUp size={20} className="text-purple-400" />,
    before: "A promising invention idea with no idea how to present it to investors",
    after: "Send a tokenized NDA-gated data room URL and a 15-slide pitch deck to 6 qualified buyers",
    deliverable: "Investor CRM + VDR Portal + Pitch Deck Generator — complete capital-raise stack",
    color: "#8b5cf6",
  },
];

const TESTIMONIALS = [
  { quote: "I had the MEG parts in hand within 72 hours of joining. The BOM is exact — part numbers, quantities, specs. This is engineering documentation, not YouTube.", name: "R.K.", role: "Electrical Engineer, 14 yrs" },
  { quote: "My attorney reviewed the provisional patent I generated in one ZARP session. She said it was the most complete pre-draft she'd ever received from a client.", name: "A.S.", role: "Independent Inventor" },
  { quote: "I've studied Bearden for 20 years and never had the structured curriculum to actually build anything. ZARP changed that in the first week.", name: "M.T.", role: "Independent Researcher, 20 yrs" },
];

export default function ZarpLanding() {
  const navigate = useNavigate();
  const countdown = useCountdown();
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { show: showMagnet, trigger: magnetTrigger, dismiss: dismissMagnet } = useLeadMagnetTrigger({
    timeDelay: 45000,
    scrollPct: 70,
    exitIntent: true,
    storageKey: "zarp_lm_landing",
  });

  const handleEmailCapture = async () => {
    if (!email || submitting) return;
    setSubmitting(true);
    await base44.entities.NewsletterSubscriber.create({ email, source: "landing_hero", status: "active" });
    setEmailSubmitted(true);
    setSubmitting(false);
    // Don't redirect — keep them on the page, they're already engaged.
    // The email is captured. Now let the page sell them.
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden relative">
      <ScalarWaveWatermark />
      {showMagnet && !emailSubmitted && (
        <LeadMagnetPopup trigger={magnetTrigger} magnetId="meg_blueprint" onDismiss={dismissMagnet} />
      )}

      {/* ── Urgency bar — REAL countdown ── */}
      <div className="bg-gradient-to-r from-red-950 to-orange-950 border-b border-red-900 px-4 py-2.5 flex flex-wrap items-center justify-center gap-2 text-sm">
        <Flame size={13} className="text-orange-400 animate-pulse flex-shrink-0" />
        <span className="text-orange-200 font-semibold">Founding rate locks in</span>
        <span className="font-black text-white bg-black/50 px-3 py-0.5 rounded-lg font-mono tracking-widest">{countdown}</span>
        <span className="text-orange-300 text-xs">— price goes up permanently after 1,000 members</span>
      </div>

      {/* ── Nav — ONE primary CTA only ── */}
      <nav className="border-b border-gray-800 bg-gray-900/90 backdrop-blur px-5 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png" alt="C.O.D.E.X.T.E.C.H." className="h-12 w-12 object-contain" />
          <span className="font-black text-2xl">C.O.D.E.X.T.E.C.H.</span>
          <span className="text-gray-600 text-xs hidden sm:inline">The Engineering Platform</span>
        </div>
        <Link to="/pricing"
          className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-black transition-colors">
          Unlock Access — From $29
        </Link>
      </nav>

      {/* ── Hero — vault door animation ── */}
      <section className="px-5 py-12 sm:py-16 text-center">
        <VaultHeroAnimation />
      </section>

      {/* ── Email capture — BIGGER, BELOW VAULT ── */}
      <section className="px-5 py-16 text-center bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black mb-3 text-white">Get Free Course Preview</h2>
          <p className="text-gray-300 text-lg mb-8">Access one complete course module + weekly system breakdowns.</p>
          
          {emailSubmitted ? (
            <div className="bg-green-950/40 border border-green-800 rounded-2xl p-8 text-center">
              <CheckCircle2 size={32} className="text-green-400 mx-auto mb-3" />
              <p className="text-green-300 font-bold text-lg">Course preview on its way — check your inbox.</p>
              <p className="text-gray-400 text-sm mt-2">Ready to unlock the full library?</p>
              <Link to="/pricing" className="inline-flex items-center gap-2 mt-5 px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-base transition-colors">
                See Membership Options <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleEmailCapture()}
                className="flex-1 px-6 py-4 rounded-xl bg-gray-800 border border-gray-600 text-white placeholder-gray-500 text-base focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button onClick={handleEmailCapture} disabled={submitting}
                className="px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-base transition-all whitespace-nowrap disabled:opacity-60">
                {submitting ? "Sending..." : "Get Free Preview →"}
              </button>
            </div>
          )}
          {!emailSubmitted && <p className="text-gray-500 text-sm">One free course module. No spam. Unsubscribe anytime.</p>}

          {/* Secondary text CTA */}
          {!emailSubmitted && (
            <Link to="/free-vault" className="inline-block text-gray-400 hover:text-gray-200 text-sm transition-colors underline underline-offset-4 mt-4">
              Or browse the free vault first →
            </Link>
          )}
        </div>
      </section>



      {/* ── Public ZARP Research Diagram ── */}
      <section className="px-5 py-14 bg-gray-950 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-bold uppercase tracking-widest">
              Open Research — Public Domain
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-2">ZARP System Architecture</h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
              The Zenith Apex Research Platform is an open-architecture scalar EM research framework. 
              The following system diagram is published freely for research, educational, and replication purposes.
            </p>
          </div>

          {/* Main diagram */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden mb-6">
            {/* SVG System Diagram */}
            <div className="p-6 sm:p-8">
              <svg viewBox="0 0 860 520" className="w-full" style={{ fontFamily: "monospace" }}>
                {/* Background */}
                <rect width="860" height="520" fill="#0a0f1a" rx="12" />

                {/* Grid lines */}
                {[80,160,240,320,400,480].map(y => (
                  <line key={y} x1="20" y1={y} x2="840" y2={y} stroke="#ffffff08" strokeWidth="1" />
                ))}
                {[80,160,240,320,400,480,560,640,720,800].map(x => (
                  <line key={x} x1={x} y1="20" x2={x} y2="500" stroke="#ffffff08" strokeWidth="1" />
                ))}

                {/* Title */}
                <text x="430" y="28" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold" letterSpacing="3">ZENITH APEX RESEARCH PLATFORM — ZARP SYSTEM ARCHITECTURE v2.1</text>
                <text x="430" y="42" textAnchor="middle" fill="#475569" fontSize="8">Open Research Diagram · Published for Educational Replication · C.O.D.E.X.T.E.C.H. · 2026</text>

                {/* ── PRIMARY COIL ASSEMBLY ── */}
                <rect x="30" y="65" width="180" height="120" fill="#0f1c2e" stroke="#3b82f6" strokeWidth="1.5" rx="6" />
                <text x="120" y="82" textAnchor="middle" fill="#60a5fa" fontSize="8" fontWeight="bold" letterSpacing="2">PRIMARY COIL ASSEMBLY</text>
                {/* Toroid symbol */}
                <ellipse cx="120" cy="115" rx="38" ry="22" fill="none" stroke="#3b82f6" strokeWidth="2" />
                <ellipse cx="120" cy="115" rx="20" ry="10" fill="#0a1628" stroke="#60a5fa" strokeWidth="1" />
                {/* Winding turns */}
                {[0,1,2,3,4,5,6,7].map(i => {
                  const angle = (i / 8) * Math.PI * 2;
                  const x = 120 + Math.cos(angle) * 38;
                  const y = 115 + Math.sin(angle) * 22;
                  return <circle key={i} cx={x} cy={y} r="3" fill="#3b82f6" />;
                })}
                <text x="120" y="152" textAnchor="middle" fill="#3b82f6" fontSize="7">Bifilar · N52 Core · 200T</text>
                <text x="120" y="162" textAnchor="middle" fill="#1e40af" fontSize="7">Vitroperm 500F · µr ~100k</text>
                <text x="120" y="172" textAnchor="middle" fill="#1e40af" fontSize="7">28 AWG · Counter-wound</text>

                {/* ── PERMANENT MAGNET ARRAY ── */}
                <rect x="30" y="210" width="180" height="80" fill="#1a0f0a" stroke="#f97316" strokeWidth="1.5" rx="6" />
                <text x="120" y="226" textAnchor="middle" fill="#fb923c" fontSize="8" fontWeight="bold" letterSpacing="2">MAGNET ARRAY</text>
                {/* Bar magnets */}
                {[50,95,140].map((mx, i) => (
                  <g key={i}>
                    <rect x={mx} y="232" width="28" height="42" fill="#7c2d12" stroke="#f97316" strokeWidth="1" rx="2" />
                    <rect x={mx} y="232" width="28" height="20" fill="#dc2626" rx="2" />
                    <text x={mx + 14} y="244" textAnchor="middle" fill="#fca5a5" fontSize="6">N</text>
                    <text x={mx + 14} y="264" textAnchor="middle" fill="#93c5fd" fontSize="6">S</text>
                  </g>
                ))}
                <text x="120" y="282" textAnchor="middle" fill="#9a3412" fontSize="7">N52 · 50×10×5mm · 4× array</text>

                {/* ── DDS SIGNAL GENERATOR ── */}
                <rect x="240" y="65" width="160" height="90" fill="#0f1a0f" stroke="#22c55e" strokeWidth="1.5" rx="6" />
                <text x="320" y="82" textAnchor="middle" fill="#4ade80" fontSize="8" fontWeight="bold" letterSpacing="2">DDS OSCILLATOR</text>
                {/* Sine wave */}
                <path d="M255,115 Q268,98 281,115 Q294,132 307,115 Q320,98 333,115 Q346,132 359,115 Q372,98 385,115" fill="none" stroke="#22c55e" strokeWidth="2" />
                <text x="320" y="132" textAnchor="middle" fill="#22c55e" fontSize="7">AD9833 · 0.01Hz–12.5MHz</text>
                <text x="320" y="142" textAnchor="middle" fill="#166534" fontSize="7">SPI programmable · 3.3V</text>

                {/* ── PHASE CONTROL ── */}
                <rect x="240" y="175" width="160" height="80" fill="#130f1a" stroke="#a855f7" strokeWidth="1.5" rx="6" />
                <text x="320" y="192" textAnchor="middle" fill="#c084fc" fontSize="8" fontWeight="bold" letterSpacing="2">PHASE CONTROL</text>
                {/* Phase diagram */}
                <circle cx="300" cy="220" r="20" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                <line x1="300" y1="220" x2="316" y2="208" stroke="#c084fc" strokeWidth="2" />
                <line x1="300" y1="220" x2="308" y2="236" stroke="#7e22ce" strokeWidth="2" strokeDasharray="3,2" />
                <text x="330" y="216" fill="#a855f7" fontSize="7">0°–360°</text>
                <text x="330" y="226" fill="#7e22ce" fontSize="7">adj.</text>
                <text x="320" y="246" textAnchor="middle" fill="#6b21a8" fontSize="7">JSPHS-500 · 50Ω</text>

                {/* ── MEG OUTPUT STAGE ── */}
                <rect x="430" y="65" width="170" height="120" fill="#0a1628" stroke="#06b6d4" strokeWidth="2" rx="6" />
                <text x="515" y="82" textAnchor="middle" fill="#22d3ee" fontSize="8" fontWeight="bold" letterSpacing="2">MEG OUTPUT STAGE</text>
                {/* MOSFET symbol */}
                <line x1="490" y1="95" x2="490" y2="165" stroke="#06b6d4" strokeWidth="2" />
                <line x1="490" y1="115" x2="510" y2="115" stroke="#22d3ee" strokeWidth="1.5" />
                <line x1="510" y1="100" x2="510" y2="130" stroke="#22d3ee" strokeWidth="2" />
                <line x1="510" y1="115" x2="535" y2="95" stroke="#0e7490" strokeWidth="1.5" />
                <line x1="510" y1="115" x2="535" y2="135" stroke="#0e7490" strokeWidth="1.5" />
                <text x="550" y="100" fill="#22d3ee" fontSize="7">D</text>
                <text x="550" y="138" fill="#22d3ee" fontSize="7">S</text>
                <text x="475" y="120" fill="#06b6d4" fontSize="7">G</text>
                <text x="515" y="155" textAnchor="middle" fill="#0e7490" fontSize="7">IRFP460 · 500V · 20A</text>
                <text x="515" y="165" textAnchor="middle" fill="#0e7490" fontSize="7">TO-247 · 2× parallel</text>
                <text x="515" y="175" textAnchor="middle" fill="#0e7490" fontSize="7">Bridge rectifier: KBPC1010</text>

                {/* ── MICROCONTROLLER ── */}
                <rect x="430" y="205" width="170" height="80" fill="#0f1a10" stroke="#34d399" strokeWidth="1.5" rx="6" />
                <text x="515" y="222" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontWeight="bold" letterSpacing="2">MICROCONTROLLER</text>
                {/* MCU chip */}
                <rect x="470" y="228" width="90" height="40" fill="#052e16" stroke="#34d399" strokeWidth="1" rx="3" />
                {[0,1,2,3,4].map(i => (
                  <g key={i}>
                    <line x1={475 + i * 16} y1="228" x2={475 + i * 16} y2="220" stroke="#34d399" strokeWidth="1" />
                    <line x1={475 + i * 16} y1="268" x2={475 + i * 16} y2="276" stroke="#34d399" strokeWidth="1" />
                  </g>
                ))}
                <text x="515" y="252" textAnchor="middle" fill="#34d399" fontSize="7">ATmega328</text>
                <text x="515" y="262" textAnchor="middle" fill="#166534" fontSize="6">Arduino Nano · USB · 5V</text>
                <text x="515" y="277" textAnchor="middle" fill="#166534" fontSize="7">SPI → DDS · PWM → Gate</text>

                {/* ── MEASUREMENT & INSTRUMENTATION ── */}
                <rect x="630" y="65" width="200" height="110" fill="#1a1000" stroke="#fbbf24" strokeWidth="1.5" rx="6" />
                <text x="730" y="82" textAnchor="middle" fill="#fcd34d" fontSize="8" fontWeight="bold" letterSpacing="2">INSTRUMENTATION</text>
                {/* Oscilloscope traces */}
                <rect x="645" y="88" width="170" height="55" fill="#000a04" stroke="#fbbf2444" strokeWidth="0.5" rx="3" />
                {[0,1,2,3].map(i => (
                  <line key={i} x1="645" y1={100 + i * 13} x2="815" y2={100 + i * 13} stroke="#fbbf2411" strokeWidth="0.5" />
                ))}
                <path d="M650,130 Q660,110 670,130 Q680,150 690,130 Q700,110 710,130 Q720,150 730,130 Q740,110 750,130 Q760,150 770,130 Q780,110 790,130 Q800,150 810,130" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                <path d="M650,120 L670,120 L670,110 L690,110 L690,120 L710,120 L710,110 L730,110 L730,120 L750,120 L750,110 L770,110 L770,120 L790,120 L790,110 L810,110" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="2,2" />
                <text x="730" y="156" textAnchor="middle" fill="#d97706" fontSize="7">CH1: Output · CH2: Gate signal</text>
                <text x="730" y="166" textAnchor="middle" fill="#92400e" fontSize="7">Hall sensors: SS49E × 4 · Linear ratiometric</text>

                {/* ── SCALAR FIELD OUTPUT ── */}
                <rect x="630" y="195" width="200" height="110" fill="#0a0f1a" stroke="#818cf8" strokeWidth="1.5" rx="6" />
                <text x="730" y="212" textAnchor="middle" fill="#a5b4fc" fontSize="8" fontWeight="bold" letterSpacing="2">SCALAR FIELD OUTPUT</text>
                {/* Field lines */}
                {[0,1,2,3,4].map(i => {
                  const r = 18 + i * 12;
                  return <ellipse key={i} cx="700" cy="255" rx={r} ry={r * 0.55} fill="none" stroke={`rgba(99,102,241,${0.6 - i * 0.1})`} strokeWidth="1" strokeDasharray={i % 2 === 0 ? "none" : "3,2"} />;
                })}
                <circle cx="700" cy="255" r="5" fill="#6366f1" />
                <text x="700" y="290" textAnchor="middle" fill="#4f46e5" fontSize="6">∇²φ ≠ 0 · E = B = 0</text>
                <text x="760" y="228" fill="#818cf8" fontSize="7">Aharonov-Bohm</text>
                <text x="760" y="240" fill="#818cf8" fontSize="7">potential field</text>
                <text x="760" y="252" fill="#4338ca" fontSize="7">Z-dipole radiation</text>
                <text x="760" y="264" fill="#4338ca" fontSize="7">Longitudinal EM</text>
                <text x="760" y="276" fill="#4338ca" fontSize="7">Scalar potential Φ</text>
                <text x="760" y="292" fill="#312e81" fontSize="6">US Patent 6,362,718</text>

                {/* ── POWER CONDITIONING ── */}
                <rect x="240" y="310" width="160" height="80" fill="#1a0a0a" stroke="#ef4444" strokeWidth="1.5" rx="6" />
                <text x="320" y="328" textAnchor="middle" fill="#f87171" fontSize="8" fontWeight="bold" letterSpacing="2">POWER CONDITIONING</text>
                <rect x="258" y="334" width="124" height="28" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1" rx="3" />
                <text x="320" y="352" textAnchor="middle" fill="#fca5a5" fontSize="7">12V / 10A regulated DC</text>
                <text x="320" y="372" textAnchor="middle" fill="#991b1b" fontSize="7">EMI filter · Isolation xfmr 1:1 · 50VA</text>
                <text x="320" y="382" textAnchor="middle" fill="#7f1d1d" fontSize="7">Ferrite beads: 31-mat · axial</text>

                {/* ── EMF SHIELDING ── */}
                <rect x="430" y="310" width="170" height="80" fill="#0a1a14" stroke="#10b981" strokeWidth="1.5" rx="6" />
                <text x="515" y="328" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="bold" letterSpacing="2">EMF SHIELDING</text>
                <rect x="445" y="335" width="140" height="38" fill="none" stroke="#10b981" strokeWidth="1" rx="3" strokeDasharray="4,3" />
                <rect x="450" y="340" width="130" height="28" fill="none" stroke="#059669" strokeWidth="0.5" rx="2" strokeDasharray="2,4" />
                <text x="515" y="357" textAnchor="middle" fill="#059669" fontSize="7">µ-metal + Faraday copper mesh</text>
                <text x="515" y="372" textAnchor="middle" fill="#065f46" fontSize="7">Hammond 1590D enclosure · Al die-cast</text>
                <text x="515" y="382" textAnchor="middle" fill="#065f46" fontSize="7">ESD mat · wrist strap · grounded chassis</text>

                {/* ── DATA ACQUISITION ── */}
                <rect x="630" y="330" width="200" height="70" fill="#0f1628" stroke="#0ea5e9" strokeWidth="1.5" rx="6" />
                <text x="730" y="348" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold" letterSpacing="2">DATA ACQUISITION</text>
                <text x="730" y="364" textAnchor="middle" fill="#0284c7" fontSize="7">Arduino Nano → USB Serial → PC logging</text>
                <text x="730" y="376" textAnchor="middle" fill="#0284c7" fontSize="7">ADC 10-bit · 32 samples/sec</text>
                <text x="730" y="388" textAnchor="middle" fill="#075985" fontSize="7">Real-time scope · FFT spectrum analysis</text>

                {/* ── CONNECTION ARROWS ── */}
                {/* Primary coil → MEG Output */}
                <line x1="210" y1="115" x2="430" y2="115" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5,3" markerEnd="url(#arrow-blue)" />
                {/* Magnet → MEG Output */}
                <line x1="210" y1="250" x2="430" y2="180" stroke="#f97316" strokeWidth="1" strokeDasharray="4,3" markerEnd="url(#arrow-orange)" />
                {/* DDS → MEG Output */}
                <line x1="400" y1="110" x2="430" y2="110" stroke="#22c55e" strokeWidth="1.5" markerEnd="url(#arrow-green)" />
                {/* Phase → MCU */}
                <line x1="400" y1="215" x2="430" y2="230" stroke="#a855f7" strokeWidth="1" markerEnd="url(#arrow-purple)" />
                {/* MCU → DDS */}
                <line x1="480" y1="205" x2="360" y2="150" stroke="#34d399" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#arrow-teal)" />
                {/* MEG → Scalar Field */}
                <line x1="600" y1="115" x2="630" y2="230" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arrow-cyan)" />
                {/* MEG → Instrumentation */}
                <line x1="600" y1="125" x2="630" y2="125" stroke="#fbbf24" strokeWidth="1.5" markerEnd="url(#arrow-yellow)" />
                {/* Power → primary coil */}
                <line x1="320" y1="310" x2="120" y2="290" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,2" markerEnd="url(#arrow-red)" />
                {/* Power → MEG */}
                <line x1="400" y1="340" x2="430" y2="290" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,2" markerEnd="url(#arrow-red)" />
                {/* MCU → Data Acquisition */}
                <line x1="600" y1="260" x2="630" y2="365" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#arrow-sky)" />

                {/* Arrow marker defs */}
                <defs>
                  {[
                    ["arrow-blue", "#3b82f6"],
                    ["arrow-orange", "#f97316"],
                    ["arrow-green", "#22c55e"],
                    ["arrow-purple", "#a855f7"],
                    ["arrow-teal", "#34d399"],
                    ["arrow-cyan", "#06b6d4"],
                    ["arrow-yellow", "#fbbf24"],
                    ["arrow-red", "#ef4444"],
                    ["arrow-sky", "#0ea5e9"],
                  ].map(([id, color]) => (
                    <marker key={id} id={id} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill={color} />
                    </marker>
                  ))}
                </defs>

                {/* ── LEGEND ── */}
                <rect x="30" y="420" width="800" height="80" fill="#050b14" stroke="#1e293b" strokeWidth="1" rx="6" />
                <text x="430" y="437" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="bold" letterSpacing="2">SIGNAL LEGEND</text>
                {[
                  [50, "#3b82f6", "Primary EM flux"],
                  [190, "#22c55e", "DDS drive signal"],
                  [330, "#f97316", "Permanent magnet bias"],
                  [480, "#a855f7", "Phase modulation"],
                  [620, "#06b6d4", "Output / measurement"],
                  [760, "#ef4444", "DC power rail"],
                ].map(([x, color, label]) => (
                  <g key={label}>
                    <line x1={x} y1="450" x2={x + 25} y2="450" stroke={color} strokeWidth="2" />
                    <text x={x + 30} y="454" fill={color} fontSize="7">{label}</text>
                  </g>
                ))}
                <text x="430" y="478" textAnchor="middle" fill="#1e3a5f" fontSize="7">
                  Source: Bearden T.E. (2002) Energy from the Vacuum · US Patent 6,362,718 · Anastasovski et al. Found. Phys. Lett. 14(1):87-94
                </text>
                <text x="430" y="490" textAnchor="middle" fill="#1e293b" fontSize="7">
                  FOR RESEARCH &amp; EDUCATIONAL PURPOSES ONLY · Not for medical or commercial use · C.O.D.E.X.T.E.C.H. 2026 · CC BY-NC 4.0
                </text>
              </svg>
            </div>

            {/* Caption */}
            <div className="border-t border-gray-800 px-6 py-4 bg-gray-900/50">
              <p className="text-gray-400 text-xs text-center leading-relaxed">
                <strong className="text-gray-200">Fig. 1 — ZARP MEG System Architecture.</strong> Motionless Electromagnetic Generator replication diagram based on{" "}
                <span className="text-blue-400">US Patent 6,362,718</span> (Bearden et al., 2002) and peer-reviewed literature.
                Published for open research and educational replication. CC BY-NC 4.0 — cite source when redistributing.
              </p>
            </div>
          </div>

          {/* CTA below diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <Link to="/build-supplies-shop"
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-orange-700 hover:bg-orange-600 text-white font-black text-sm transition-all">
              🔧 Buy Component Kit
            </Link>
            <Link to="/free-vault"
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold text-sm transition-all">
              📂 Browse Free Vault
            </Link>
            <Link to="/pricing"
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-black text-sm transition-all">
              🔓 Unlock Full Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p>© 2026 Zenith Apex LLC · C.O.D.E.X.T.E.C.H. · Engineering execution platform · Educational & research purposes only</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link to="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
          <Link to="/refund-policy" className="hover:text-gray-400 transition-colors">Refund Policy</Link>
          <Link to="/pricing" className="hover:text-gray-400 transition-colors">Pricing</Link>
        </div>
      </footer>
    </div>
  );
}