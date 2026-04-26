import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Lock, Gift, Flame, Clock, Star, ChevronDown, ChevronUp, Zap, Shield, BookOpen, Wrench, TrendingUp, ShieldAlert } from "lucide-react";
import { base44 } from "@/api/base44Client";

// ── Countdown (48h sticky deadline) ──────────────────────────────────────────
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

// ── Tiers ─────────────────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    color: "#06b6d4",
    badge: "CONSUMPTION-BASED",
    description: "Perfect for trying out. Access to 5 builds.",
    cta: "Start Free",
    popular: false,
    features: [
      "5 build plans included",
      "Complete execution workflows (BOM, steps, schematics)",
      "10 foundational courses",
      "Basic AI patent framework",
      "Prior Art Archive — 50 entries",
      "EM Lab simulator",
      "20% off hardware kits",
      "Cancel anytime",
    ],
    locked: [
      "Unlimited vault access",
      "Video assembly guides",
      "Supplier sourcing links",
      "Investor & capital toolkit",
      "Elite expanded vault (25 builds)",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    color: "#8b5cf6",
    badge: "UNLIMITED VAULT",
    description: "Complete execution system: 10 builds, workflows, frameworks",
    cta: "Go Pro",
    popular: true,
    features: [
      "10 complete build execution workflows",
      "BOM, schematics, step-by-step assembly for each",
      "20 structured courses with frameworks",
      "Full AI execution toolkit: Patent, FTO, Investor Package",
      "Prior Art Archive — 100+ documented systems",
      "3–12 hour video assembly guides per build",
      "Verified supplier links & real-time pricing",
      "Private community & troubleshooting forum",
      "Complete EM lab simulation environment",
      "50% off hardware kits & components",
      "Cancel anytime",
    ],
    locked: [
      "Defense-restricted technology systems",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: 149,
    color: "#f59e0b",
    badge: "FULL VAULT — ADVISORY",
    description: "Everything in Pro + expanded civilian vault + 1-on-1 patent strategy",
    cta: "Go Elite",
    popular: false,
    features: [
      "25 build plans — expanded civilian vault",
      "26 structured courses",
      "Everything in Pro included",
      "Advanced EM research systems (non-restricted)",
      "MEG, VPO, Scalar Interferometer, Anenergy Pump & more",
      "Prior Art Archive — 200+ documented systems",
      "1-on-1 monthly patent strategy session",
      "Institutional licensing prioritized",
      "Early access to new build plans",
      "Priority email + phone support",
      "Co-inventor matching priority queue",
      "60% off all à la carte purchases",
    ],
    locked: [
      "Directed energy & defense-classified systems (GOV only)",
      "Declassified DoD/DARPA archive (GOV only)",
      "Secure NDA-gated defense document room (GOV only)",
    ],
  },
  {
    id: "gov",
    name: "GOV / Defense",
    price: 999,
    color: "#22c55e",
    badge: "U.S. GOVERNMENT ONLY",
    description: "Restricted defense-adjacent EM systems — vetted U.S. government & contractor access only",
    cta: "Request Access",
    popular: false,
    govOnly: true,
    features: [
      "Full Elite tier access included",
      "Classified defense-adjacent EM technology systems",
      "Scalar interferometry & directed energy build plans",
      "Declassified DoD & DARPA prior art archive",
      "EM countermeasure & shielding architectures",
      "Secure VDR — NDA-gated document room",
      "Direct engineering team access for custom R&D",
      "Institutional licensing & IP transfer frameworks",
      "Dedicated account manager",
      "Clearance-level vetting required prior to access",
    ],
    locked: [],
  },
];

const FAQS = [
  { q: "Is this real engineering or pseudoscience?", a: "Every build plan cites granted U.S. patents, peer-reviewed journals, and declassified government documents. The MEG (U.S. Patent 6,362,718) was co-authored by a PhD physicist and published in Foundations of Physics Letters." },
  { q: "Can I really build these devices?", a: "Yes. Every plan includes a full BOM with exact part numbers, specifications, and supplier links. Simpler devices use off-the-shelf Digikey / Amazon components. Advanced systems require standard machining or coil winding." },
  { q: "What if I want to cancel?", a: "Cancel any time from your account settings. No contracts, no fees. Most members tell us the MEG build plan alone was worth more than 6 months of the Starter tier." },
  { q: "Can I upgrade or downgrade?", a: "Yes — upgrades take effect immediately and you're only charged the prorated difference. Downgrades take effect at the next billing cycle." },
  { q: "Is there a free trial?", a: "The Free Vault gives you access to 1 full build plan and 5 prior art entries with no payment required. That's enough to validate the quality before committing." },
];

// restricted: "elite" = Elite & GOV only | "gov" = GOV/Defense only | undefined = all civilians
const INDIVIDUAL_BUILDS = [
  { name: "Vacuum Potential Oscillator (VPO) Circuit Kit", price: 189, icon: "🔧" },
  { name: "Open-System Magnetic Generator (Prototype Plans)", price: 179, icon: "⚙️" },
  { name: "Woodpecker Grid Standing Wave Detector", price: 249, icon: "📻", restricted: "gov" },
  { name: "Phi-River Gradient Sensor", price: 349, icon: "🌊" },
  { name: "Anenergy Pump Demonstration Circuit", price: 297, icon: "🔋" },
  { name: "Scalar Energy Bottle Interferometer", price: 449, icon: "🎯", restricted: "gov" },
  { name: "Quantum Potential EMI Detector", price: 497, icon: "📡" },
  { name: "EM Trigger Window Therapy Device", price: 599, icon: "💊", restricted: "elite" },
  { name: "Bedini Environmental EM Signal Conditioner", price: 697, icon: "🎛️" },
  { name: "Morphogenetic Field Coherence Monitor", price: 799, icon: "🌿" },
  { name: "Whittaker Wave Phase Conjugate Mirror System", price: 849, icon: "🔭", restricted: "gov" },
  { name: "Prioré-Type Multichannel EM Therapy System", price: 697, icon: "🏥", restricted: "elite" },
  { name: "MEG Replication Kit", price: 847, icon: "🔮", restricted: "elite" },
  { name: "Asymmetric Regauging Overunity Generator", price: 897, icon: "⚡", restricted: "gov" },
  { name: "MorphoYield TRZ-Agri Array", price: 697, icon: "🌾" },
];

const INDIVIDUAL_COURSES = [
  { name: "Scalar Electromagnetics Fundamentals", price: 297, icon: "📚" },
  { name: "Bearden Energy from the Vacuum Theory", price: 397, icon: "📖" },
  { name: "Building EM Device Prototypes", price: 397, icon: "🔬" },
  { name: "Patent Strategy for Energy Inventors", price: 397, icon: "⚖️" },
  { name: "Quantum Field Theory Essentials", price: 297, icon: "🌌" },
  { name: "Bioelectromagnetics & Health", price: 347, icon: "💊" },
  { name: "Prior Art Research & Analysis", price: 297, icon: "🔍" },
  { name: "Investor Pitch Fundamentals", price: 297, icon: "💼" },
];

const BUILD_BUNDLES = [
  {
    name: "Electromagnetic Systems Starter Bundle",
    description: "Historical EM research documented in U.S. patents & peer-reviewed journals",
    builds: ["MEG Replication Kit", "Vacuum Potential Oscillator", "Anenergy Pump Circuit"],
    regularPrice: 2543,
    bundlePrice: 1999,
    savings: 544,
    icon: "⚡",
  },
  {
    name: "Bioelectromagnetic Research Bundle",
    description: "Designs from historical research institutions & published studies",
    builds: ["Prioré-Type Multichannel EM System", "TRD-1 Telomere Device", "EM Trigger Window Therapy"],
    regularPrice: 2143,
    bundlePrice: 1699,
    savings: 444,
    icon: "💊",
  },
  {
    name: "Advanced Engineering Studies Bundle",
    description: "5 documented experimental prototypes from academic sources",
    builds: ["Scalar Interferometer", "Whittaker Phase Mirror", "Morphogenetic Monitor", "Bedini Conditioner", "Quantum Potential Detector"],
    regularPrice: 4088,
    bundlePrice: 2999,
    savings: 1089,
    icon: "🔬",
  },
];

function FaqAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-2">
      {FAQS.map((f, i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-800/40 transition-colors">
            <span className="text-white font-semibold text-sm">{f.q}</span>
            {open === i ? <ChevronUp size={15} className="text-cyan-400 flex-shrink-0 ml-3" /> : <ChevronDown size={15} className="text-gray-500 flex-shrink-0 ml-3" />}
          </button>
          {open === i && <div className="px-5 pb-4 text-gray-300 text-sm leading-relaxed">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

function TierCard({ tier, onCheckout, billingAnnual, getPrice, getAnnualTotal }) {
  const isStarter = tier.id === "starter";
  const isPro = tier.id === "pro";
  const isElite = tier.id === "elite";
  const isGov = tier.id === "gov";
  const displayPrice = isGov ? tier.price : getPrice(tier.price);
  const annualTotal = getAnnualTotal(tier.price);

  return (
    <div className={`relative flex flex-col rounded-2xl overflow-hidden transition-all
      ${isPro
        ? "border-2 border-purple-500 shadow-2xl shadow-purple-900/40 scale-[1.03] z-10"
        : isElite
        ? "border border-yellow-800/60 bg-gradient-to-b from-gray-900 to-gray-950"
        : isGov
        ? "border-2 border-green-700 bg-gradient-to-b from-green-950/30 to-gray-950 shadow-xl shadow-green-900/20"
        : "border border-gray-800 opacity-90"
      } bg-gray-900`}>

      {/* Badge bar */}
      {isPro && (
        <div className="py-3 text-center text-xs font-black tracking-widest text-white bg-purple-600">
          ⚡ MOST POPULAR — BEST VALUE
        </div>
      )}
      {isElite && (
        <div className="py-3 text-center text-xs font-black tracking-widest text-yellow-300 bg-yellow-900/40 border-b border-yellow-800/50">
          🔐 FULL VAULT ACCESS — CIVILIAN TIER
        </div>
      )}
      {isStarter && (
        <div className="py-2.5 text-center text-xs font-semibold tracking-wide text-gray-500 border-b border-gray-800">
          Entry level — limited vault
        </div>
      )}
      {isGov && (
        <div className="py-3 text-center text-xs font-black tracking-widest text-green-300 bg-green-950/80 border-b border-green-800">
          🇺🇸 U.S. GOVERNMENT & VETTED CONTRACTORS ONLY
        </div>
      )}

      <div className={`flex flex-col flex-1 ${isPro ? "p-7" : "p-6"}`}>
        {/* Name */}
        <h3 className={`font-black mb-1 ${isPro ? "text-white text-2xl" : isElite ? "text-yellow-300 text-xl" : isGov ? "text-green-300 text-xl" : "text-gray-400 text-xl"}`}>
          {tier.name}
        </h3>
        <p className={`text-sm mb-5 ${isPro ? "text-gray-300" : isGov ? "text-green-200/70" : "text-gray-500"}`}>{tier.description}</p>

        {/* Price */}
        <div className="flex items-end gap-1 mb-1">
          {tier.id === "pro" && !billingAnnual && (
            <span className="text-gray-600 line-through text-base mb-1.5 mr-1">$199</span>
          )}
          <span className={`font-black ${isPro ? "text-5xl" : "text-4xl"}`} style={{ color: tier.color }}>${displayPrice}</span>
          <span className="text-gray-500 mb-1.5">/mo</span>
        </div>
        {billingAnnual && !isGov && (
          <p className="text-green-400 text-xs font-bold mb-1">Billed ${annualTotal}/yr — 3 months free 🎉</p>
        )}
        {isGov && <p className="text-green-400 text-xs font-bold mb-1">Annual contracts available — contact for pricing</p>}
        {!billingAnnual && isPro && <p className="text-purple-400 text-xs font-bold mb-1">Founding rate — saves $120/mo vs retail</p>}
        <p className="text-gray-700 text-xs mb-6">{isGov ? "Vetting required · NDA enforced · Secure access" : "Cancel anytime · Instant access · Stripe"}</p>

        {/* Features */}
        <div className="space-y-2.5 mb-6 flex-1">
          {tier.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: isPro ? "#a78bfa" : tier.color }} />
              <span className={`text-sm ${isPro ? "text-gray-200 font-medium" : isElite ? "text-gray-300" : isGov ? "text-green-100/80" : "text-gray-500"}`}>{f}</span>
            </div>
          ))}
          {tier.locked?.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5 opacity-30">
              <Lock size={13} className="flex-shrink-0 mt-0.5 text-gray-600" />
              <span className="text-gray-600 text-sm line-through">{f}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        {isPro ? (
          <button onClick={() => onCheckout(tier)}
            className="w-full py-4 rounded-xl font-black text-lg text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 6px 28px rgba(139,92,246,0.50)" }}>
            {tier.cta} — ${displayPrice}/mo →
          </button>
        ) : isElite ? (
          <button onClick={() => onCheckout(tier)}
            className="w-full py-3.5 rounded-xl font-black text-sm text-gray-900 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "#f59e0b" }}>
            {tier.cta}
          </button>
        ) : isGov ? (
          <a href="mailto:gov@codextech.io?subject=GOV%2FDefense%20Tier%20Access%20Request"
            className="w-full py-3.5 rounded-xl font-black text-sm text-black text-center block transition-all hover:opacity-90"
            style={{ backgroundColor: "#22c55e" }}>
            🇺🇸 Request Vetting & Access
          </a>
        ) : (
          <button onClick={() => onCheckout(tier)}
            className="w-full py-3 rounded-xl font-semibold text-sm text-gray-400 border border-gray-700 hover:bg-gray-800 transition-all">
            {tier.cta}
          </button>
        )}

        {isPro && <p className="text-center text-purple-400/60 text-xs mt-2">🔒 Stripe · SSL · Cancel anytime</p>}
        {isElite && <p className="text-center text-gray-600 text-xs mt-2">Optional upgrade from Pro at any time</p>}
        {isStarter && <p className="text-center text-gray-700 text-xs mt-2">Upgrade to Pro anytime — same price locked</p>}
        {isGov && <p className="text-center text-green-900 text-xs mt-2">Identity & clearance verification required</p>}
      </div>
    </div>
  );
}

function AlaCarteItem({ item, onCheckout }) {
  const isGovOnly = item.restricted === "gov";
  const isEliteOnly = item.restricted === "elite";
  const isRestricted = isGovOnly || isEliteOnly;

  return (
    <div className={`rounded-xl p-4 flex items-center justify-between gap-3 transition-colors border ${
      isGovOnly
        ? "bg-green-950/20 border-green-900/50 hover:border-green-800"
        : isEliteOnly
        ? "bg-yellow-950/20 border-yellow-900/50 hover:border-yellow-800"
        : "bg-gray-900 border-gray-800 hover:border-gray-600"
    }`}>
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xl flex-shrink-0">{item.icon}</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`text-sm font-semibold truncate ${isRestricted ? "text-gray-400" : "text-white"}`}>{item.name}</p>
            {isGovOnly && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/60 border border-green-700 text-green-300 font-bold whitespace-nowrap flex items-center gap-1">
                <Lock size={9} /> GOV / Defense Only
              </span>
            )}
            {isEliteOnly && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900/60 border border-yellow-700 text-yellow-300 font-bold whitespace-nowrap flex items-center gap-1">
                <Lock size={9} /> Elite+ Only
              </span>
            )}
          </div>
          <p className="text-gray-500 text-xs">
            {isGovOnly ? "Available to vetted U.S. government & defense accounts" : isEliteOnly ? "Available on Elite or GOV/Defense membership" : "One-time purchase"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`font-black ${isRestricted ? "text-gray-500" : "text-white"}`}>${item.price}</span>
        {isRestricted ? (
          <a
            href={isGovOnly ? "mailto:gov@codextech.io?subject=GOV+Defense+Build+Plan+Inquiry" : "/pricing#elite"}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              isGovOnly
                ? "bg-green-900/40 border border-green-700 text-green-300 hover:bg-green-900/60"
                : "bg-yellow-900/40 border border-yellow-700 text-yellow-300 hover:bg-yellow-900/60"
            }`}
          >
            {isGovOnly ? "🇺🇸 Contact" : "Upgrade"}
          </a>
        ) : (
          <button onClick={() => onCheckout(item)}
            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold transition-colors">
            Buy
          </button>
        )}
      </div>
    </div>
  );
}

export default function Pricing() {
  const countdown = useCountdown();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [showAlaCarteBuilds, setShowAlaCarteBuilds] = useState(false);
  const [showAlaCCarteCourses, setShowAlaCCarteCourses] = useState(false);
  const [billingAnnual, setBillingAnnual] = useState(false);

  const getPrice = (monthlyPrice) => billingAnnual ? Math.floor(monthlyPrice * 9 / 12) : monthlyPrice;
  const getAnnualTotal = (monthlyPrice) => monthlyPrice * 9;

  const handleMembershipCheckout = async (tier) => {
    if (window !== window.top) {
      alert("Checkout only works from the published app. Please open the app directly.");
      return;
    }
    const baseUrl = window.location.origin;
    const effectivePrice = getPrice(tier.price);
    const response = await base44.functions.invoke("createCheckoutSession", {
      title: `ZARP ${tier.name} Membership${billingAnnual ? " (Annual)" : ""}`,
      priceInCents: billingAnnual ? getAnnualTotal(tier.price) * 100 : tier.price * 100,
      description: tier.description,
      category: "membership",
      mode: billingAnnual ? "payment" : "subscription",
      interval: billingAnnual ? undefined : "month",
      successUrl: `${baseUrl}/checkout?success=true&product=${tier.id}`,
      cancelUrl: `${baseUrl}/pricing`,
      customerEmail: null,
    });
    if (response.data?.url) window.location.href = response.data.url;
  };

  const handleAlaCarteCheckout = async (item) => {
    if (window !== window.top) {
      alert("Checkout only works from the published app. Please open the app directly.");
      return;
    }
    const baseUrl = window.location.origin;
    const response = await base44.functions.invoke("createCheckoutSession", {
      title: item.name,
      priceInCents: item.price * 100,
      description: "Build plan or course — one-time purchase",
      category: "one_time",
      mode: "payment",
      successUrl: `${baseUrl}/checkout?success=true&product=${encodeURIComponent(item.name)}`,
      cancelUrl: `${baseUrl}/pricing`,
      customerEmail: null,
    });
    if (response.data?.url) window.location.href = response.data.url;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
      <div className="relative z-10">
      {/* Urgency bar */}
      <div className="bg-gradient-to-r from-red-900 to-orange-900 border-b border-red-800 px-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Flame size={13} className="text-orange-300 animate-pulse" />
          <span className="text-orange-100 font-semibold">Founding rate expires in</span>
        </div>
        <span className="font-black text-white bg-black/40 px-3 py-0.5 rounded-lg font-mono tracking-widest">{countdown}</span>
        <span className="text-orange-200 text-xs">— price increases permanently after 1,000 members</span>
      </div>

      {/* Nav */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png" alt="C.O.D.E.X.T.E.C.H." className="h-11 w-11 object-contain" />
            <h1 className="text-white font-black text-lg">C.O.D.E.X.T.E.C.H. Membership</h1>
          </div>
        </div>
        <Link to="/referrals" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-900/40 border border-green-700 text-green-300 hover:bg-green-900/60 text-xs font-bold transition-all">
          <Gift size={13} /> Earn Credits
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center px-5 pt-16 pb-12 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-900/40 border border-yellow-700 text-yellow-300 text-xs font-black mb-6 uppercase tracking-widest">
          <Clock size={12} /> Founding Member Rate — First 1,000 Only
        </div>
        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
          The Complete Engineering<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Execution Platform.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-3">
          C.O.D.E.X.T.E.C.H. provides complete execution frameworks: 40+ builds, 26 courses, BOMs, schematics, video guides, AI patent tools, FTO analysis, investor toolkit, and verified sourcing. Everything to build, patent, and fund.
        </p>
        <p className="text-sm text-green-400 flex items-center justify-center gap-1">
          <Gift size={13} /> Refer a friend → earn $50 credit per referral
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center items-center gap-4 mb-10">
        <span className={`text-sm font-bold ${!billingAnnual ? "text-white" : "text-gray-500"}`}>Monthly</span>
        <button
          onClick={() => setBillingAnnual(b => !b)}
          className={`relative w-14 h-7 rounded-full transition-colors ${billingAnnual ? "bg-green-500" : "bg-gray-700"}`}
        >
          <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${billingAnnual ? "translate-x-8" : "translate-x-1"}`} />
        </button>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${billingAnnual ? "text-white" : "text-gray-500"}`}>Annual</span>
          <span className="text-xs font-black px-2 py-0.5 rounded-full bg-green-900 text-green-300">3 MONTHS FREE</span>
        </div>
      </div>

      {/* Tier Cards */}
      <div className="px-5 pb-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {TIERS.map(tier => (
            <TierCard key={tier.id} tier={tier} onCheckout={handleMembershipCheckout} billingAnnual={billingAnnual} getPrice={getPrice} getAnnualTotal={getAnnualTotal} />
          ))}
        </div>

        {/* Compare note */}
        <p className="text-center text-gray-500 text-xs mt-6">
          All plans include instant access · No setup fees · Upgrade/downgrade anytime · Annual billing = 3 months free
        </p>
      </div>

      {/* Value comparison bar */}
      <div className="border-y border-gray-800 bg-gray-900/40 px-6 py-10 mb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-black text-center mb-8">What's included at each tier</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-500 text-xs font-bold uppercase py-3 pr-6 w-44">Feature</th>
                  <th className="text-center py-3 px-3 font-black" style={{ color: "#06b6d4" }}>Starter</th>
                  <th className="text-center py-3 px-3 font-black bg-purple-950/40 rounded-t-lg" style={{ color: "#8b5cf6" }}>Pro ⚡</th>
                  <th className="text-center py-3 px-3 font-black" style={{ color: "#f59e0b" }}>Elite</th>
                  <th className="text-center py-3 px-3 font-black" style={{ color: "#22c55e" }}>GOV / Defense 🇺🇸</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {[
                  ["Build Plans Access", "5 builds", "10 builds", "25 builds", "Unlimited + Classified"],
                  ["Courses", "10 courses", "20 courses", "26 courses", "Unlimited (40+)"],
                  ["PDF Downloads", "—", "—", "✓ 26 builds", "✓ All builds"],
                  ["Video Assembly Guides", "—", "✓ 10 builds", "✓ 26 builds", "✓ All builds"],
                  ["Supplier Links & Pricing", "—", "✓ Verified", "✓ Verified", "✓ Verified"],
                  ["AI Patent Tool", "Basic", "Full Suite", "Full Suite", "Full Suite"],
                  ["FTO Analysis", "—", "✓", "✓", "✓"],
                  ["Prior Art Archive", "50 entries", "100+ entries", "200+ entries", "DoD/DARPA Declassified"],
                  ["Private Forum", "—", "✓", "✓", "✓"],
                  ["À la carte discount", "20% off", "50% off", "60% off", "60% off"],
                  ["Restricted Systems", "—", "—", "✓", "✓ + Defense-Classified"],
                  ["Monthly Strategy Session", "—", "—", "✓", "✓"],
                  ["Defense-Adjacent Tech Systems", "—", "—", "—", "✓"],
                  ["Dedicated Account Manager", "—", "—", "—", "✓"],
                  ["Secure VDR Access", "—", "—", "—", "✓"],
                ].map(([label, starter, pro, elite, gov], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-900/20" : ""}>
                    <td className="py-2.5 pr-6 text-gray-300 text-xs font-medium">{label}</td>
                    <td className="py-2.5 px-4 text-center text-xs text-gray-400">{starter}</td>
                    <td className="py-2.5 px-4 text-center text-xs text-purple-300 font-semibold">{pro}</td>
                    <td className="py-2.5 px-4 text-center text-xs text-yellow-300">{elite}</td>
                    <td className="py-2.5 px-4 text-center text-xs text-green-300 font-semibold">{gov}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="px-5 pb-16 max-w-5xl mx-auto">

        {/* Newsletter */}
        <div className="mb-16 max-w-2xl mx-auto bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-900/30 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h3 className="text-white font-black text-xl mb-2">Want a Free Course Preview?</h3>
              <p className="text-gray-400 text-sm">Get a free course module + weekly system breakdowns in your inbox.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="email" placeholder="your@email.com" value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500" />
            <button onClick={async () => {
              if (!newsletterEmail) return;
              await base44.entities.NewsletterSubscriber.create({ email: newsletterEmail, source: "pricing_page", status: "active" });
              setNewsletterStatus("success"); setNewsletterEmail("");
              setTimeout(() => setNewsletterStatus(null), 3000);
            }} className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm whitespace-nowrap transition-all">
              {newsletterStatus === "success" ? "✓ Subscribed!" : "Get Free Course Preview"}
            </button>
          </div>
        </div>

        {/* À la carte — Build Plans */}
        <div className="mb-8">
          <button onClick={() => setShowAlaCarteBuilds(b => !b)}
            className="w-full flex items-center justify-between p-5 bg-gray-900 border border-gray-800 rounded-2xl hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <Wrench size={20} className="text-orange-400" />
              <div className="text-left">
                <p className="text-white font-black">À La Carte Build Plans</p>
                <p className="text-gray-500 text-xs">Buy individual plans — includes BOM, steps, PDF, build video</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-xs">{INDIVIDUAL_BUILDS.length} plans</span>
              {showAlaCarteBuilds ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
            </div>
          </button>
          {showAlaCarteBuilds && (
            <div className="mt-3 space-y-2">
              {INDIVIDUAL_BUILDS.map((item, i) => (
                <AlaCarteItem key={i} item={item} onCheckout={handleAlaCarteCheckout} />
              ))}
            </div>
          )}
        </div>

        {/* À la carte — Courses */}
        <div className="mb-16">
          <button onClick={() => setShowAlaCCarteCourses(b => !b)}
            className="w-full flex items-center justify-between p-5 bg-gray-900 border border-gray-800 rounded-2xl hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <BookOpen size={20} className="text-blue-400" />
              <div className="text-left">
                <p className="text-white font-black">À La Carte Courses</p>
                <p className="text-gray-500 text-xs">Buy individual courses — lifetime access</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-xs">{INDIVIDUAL_COURSES.length} courses</span>
              {showAlaCCarteCourses ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
            </div>
          </button>
          {showAlaCCarteCourses && (
            <div className="mt-3 space-y-2">
              {INDIVIDUAL_COURSES.map((item, i) => (
                <AlaCarteItem key={i} item={item} onCheckout={handleAlaCarteCheckout} />
              ))}
            </div>
          )}
        </div>

        {/* Build Bundles */}
        <div className="mb-16">
          <div className="text-center mb-8">
           <h2 className="text-2xl font-black mb-2">Build Bundles — Save 20%</h2>
           <p className="text-gray-500 text-sm">Curated packages of related systems. Perfect for focused learners.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BUILD_BUNDLES.map((bundle, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-700 transition-all">
                <div className="bg-gradient-to-r from-purple-950 to-blue-950 border-b border-purple-800/50 px-5 py-4 flex items-start justify-between">
                  <div>
                    <span className="text-2xl block mb-1">{bundle.icon}</span>
                    <p className="text-white font-black text-sm">{bundle.name}</p>
                    <p className="text-gray-400 text-xs mt-1">{bundle.description}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-green-900 text-green-300 font-bold flex-shrink-0 whitespace-nowrap">Save ${bundle.savings}</span>
                </div>
                <div className="p-5">
                  <div className="space-y-1 mb-4 pb-4 border-b border-gray-800">
                    {bundle.builds.map((b, j) => (
                      <p key={j} className="text-gray-400 text-xs">✓ {b}</p>
                    ))}
                  </div>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-gray-600 line-through text-sm">${bundle.regularPrice}</span>
                    <span className="text-2xl font-black text-purple-400">${bundle.bundlePrice}</span>
                  </div>
                  <button onClick={() => handleAlaCarteCheckout({ name: bundle.name, price: bundle.bundlePrice })}
                    className="w-full py-2.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-sm font-bold transition-colors">
                    Add Bundle to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliate Program */}
        <div className="mb-16 bg-gradient-to-br from-green-950/50 to-emerald-950/30 border border-green-800/40 rounded-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-green-800/30 flex items-center gap-3">
            <span className="text-2xl">🤝</span>
            <div>
              <h2 className="text-xl font-black text-white">Affiliate Program — Earn 20% Recurring</h2>
              <p className="text-green-400 text-sm font-semibold">Share your link. Earn every month they stay subscribed.</p>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: "💸", label: "Commission Rate", value: "20% recurring", sub: "Every billing cycle they stay" },
                { icon: "🔗", label: "Cookie Duration", value: "90 days", sub: "Long attribution window" },
                { icon: "💳", label: "Payout Threshold", value: "$50 minimum", sub: "Monthly payouts via Stripe" },
              ].map((item, i) => (
                <div key={i} className="bg-gray-900/60 border border-green-800/20 rounded-xl p-5 text-center">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                  <p className="text-white font-black text-lg">{item.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-900/60 border border-green-800/20 rounded-xl p-5 mb-6">
              <p className="text-white font-black mb-3">How it works</p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {["Apply with your email below", "Get your unique referral link", "Share it anywhere — blog, YouTube, social", "Earn 20% every month they stay subscribed"].map((step, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-700 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-gray-300 text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com — apply to become an affiliate"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-900 border border-green-800/40 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-green-500"
                id="affiliate-email"
              />
              <button
                onClick={async () => {
                  const emailInput = document.getElementById("affiliate-email");
                  if (!emailInput?.value) return;
                  await base44.entities.NewsletterSubscriber.create({ email: emailInput.value, source: "affiliate_program", status: "active" });
                  emailInput.value = "";
                  alert("✅ Application received! We'll email you your affiliate link within 24 hours.");
                }}
                className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-black text-sm whitespace-nowrap transition-all"
              >
                Apply to Affiliate Program →
              </button>
            </div>
            <p className="text-gray-600 text-xs mt-3">No minimum audience required. Open to all members and non-members. Payouts via Stripe Connect.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-center mb-8">Questions Before You Join</h2>
          <FaqAccordion />
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-10">
          <h2 className="text-3xl font-black mb-3">Join the Execution Community.</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Get access to the complete execution system: builds, workflows, frameworks, and tools. Everything you need to prototype, patent, and fund your research — not just documentation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {TIERS.filter(t => t.popular).map(tier => (
              <button key={tier.id} onClick={() => handleMembershipCheckout(tier)}
                className="px-10 py-4 rounded-xl font-black text-lg text-white transition-all hover:opacity-90 shadow-lg"
                style={{ backgroundColor: tier.color, boxShadow: `0 4px 24px ${tier.color}50` }}>
                {tier.cta} — ${tier.price}/mo
              </button>
            ))}
            <Link to="/free-vault" className="px-8 py-4 rounded-xl font-bold text-lg text-gray-300 bg-gray-800 hover:bg-gray-700 transition-all border border-gray-700">
              Browse Free First
            </Link>
          </div>
          <p className="text-gray-600 text-xs mt-5">🔒 Secured by Stripe · Cancel anytime · Instant access</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-600 text-xs">
        <p>© 2026 Zenith Apex LLC · C.O.D.E.X.T.E.C.H. · Engineering execution platform</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link to="/terms" className="hover:text-gray-400">Terms</Link>
          <Link to="/refund-policy" className="hover:text-gray-400">Refund Policy</Link>
          <Link to="/free-vault" className="hover:text-gray-400">Free Vault</Link>
        </div>
      </footer>
      </div>
    </div>
  );
}