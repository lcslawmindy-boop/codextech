import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ScalarWaveWatermark from "@/components/ScalarWaveWatermark";
import CodextechVaultBackground from "@/components/CodextechVaultBackground";
import {
  Lock, Check, Flame, Clock, Star, ChevronDown, ChevronUp,
  Award, Zap, Shield, BookOpen, Wrench, TrendingUp, Eye, AlertTriangle, X,
  Loader2
} from "lucide-react";

// ── Sticky 48h countdown ──────────────────────────────────────────────────────
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
  return { str: `${pad(h)}:${pad(m)}:${pad(s)}`, h, m, s };
}

// ── Live activity feed (simulated) ────────────────────────────────────────────
const ACTIVITIES = [
  "Marcus T. (Austin, TX) just joined Pro",
  "Someone from London unlocked the MEG build plan",
  "A.S. downloaded the Scalar Wave Interferometer PDF",
  "New member from Toronto joined Elite",
  "R.K. from San Diego just joined Starter",
  "Someone from Berlin is viewing the FTO Analysis tool",
  "David M. upgraded from Starter → Pro",
  "New member from Sydney joined 4 minutes ago",
];

function LivePulse() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % ACTIVITIES.length); setVisible(true); }, 400);
    }, 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className={`transition-opacity duration-400 ${visible ? "opacity-100" : "opacity-0"} flex items-center gap-2 text-xs text-gray-400`}>
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
      {ACTIVITIES[idx]}
    </div>
  );
}

// ── Tiers ─────────────────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "courses",
    name: "Courses",
    price: 99,
    anchor: null,
    color: "#06b6d4",
    badge: null,
    headline: "Full course library — unlimited access",
    description: "All 40+ courses · AI patent tools · Research archive",
    cta: "Get Courses Access",
    ctaSub: "Cancel anytime",
    popular: false,
    features: [
      "All 40+ courses — full curriculum access",
      "200+ Prior Art Research Archive",
      "AI Patent Drafting Tool",
      "FTO Analysis & Patent Intelligence",
      "EM Lab simulators & visualizations",
      "Private engineering community forum",
      "My Learning dashboard & progress tracking",
    ],
    locked: ["Build plans & BOMs"],
  },
  {
    id: "builds",
    name: "Builds",
    price: 99,
    anchor: null,
    color: "#f59e0b",
    badge: "🔧 FOR HANDS-ON BUILDERS",
    headline: "50% off all build plans & full BOM access",
    description: "50% off 40+ build plans · Full BOM access · Assembly guides",
    cta: "Get Builds Access",
    ctaSub: "Cancel anytime",
    popular: false,
    features: [
      "50% off all 40+ build plans (BOM, schematics, assembly steps)",
      "Full Bill of Materials for every device",
      "Verified supplier sourcing links",
      "Step-by-step assembly guides",
      "Build tracker & milestone tools",
      "Private engineering community forum",

    ],
    locked: ["Full course library", "AI patent suite"],
  },
  {
    id: "all_access",
    name: "All Access",
    price: 150,
    anchor: 298,
    color: "#8b5cf6",
    badge: "⚡ BEST VALUE — COURSES + BUILDS",
    headline: "All courses + 50% off builds & kits + full AI suite",
    description: "All 40+ courses · 50% off all builds · Every AI tool included",
    cta: "Get All Access — $150/mo",
    ctaSub: "Best value · Cancel anytime",
    popular: false,
    features: [
      "All 40+ courses — full unlimited curriculum access",
      "50% off all 40+ build plans (BOM, schematics, assembly steps)",
      "Full AI suite: Patent Drafting, FTO Analysis, Claims Generator, Patent Intelligence",
      "AI Patent Attorney Chat & IP Portfolio Health Dashboard",
      "200+ Prior Art Research Archive",
      "Full EM lab simulators & visualizations",
      "Investor CRM, pitch decks & VDR access",
      "Build video generator",
      "Private engineering community (priority access)",
      "Early access to new courses & build plans",
    ],
    locked: ["PDF downloads of build plans"],
  },
  {
    id: "all_access_pdf",
    name: "All Access + PDF",
    price: 199,
    anchor: 350,
    color: "#10b981",
    badge: "🏆 PREMIUM — INCLUDES PDF DOWNLOADS",
    headline: "Everything in All Access + PDF downloads for every build plan",
    description: "All courses · 50% off builds · Full AI suite · PDF downloads of all build plans",
    cta: "Get All Access + PDF — $199/mo",
    ctaSub: "Full access · Cancel anytime",
    popular: true,
    features: [
      "Everything in All Access",
      "PDF download for every build plan — all 40+",
      "All 40+ courses — full unlimited curriculum access",
      "50% off all 40+ build plans (BOM, schematics, assembly steps)",
      "Full AI suite: Patent Drafting, FTO Analysis, Claims Generator, Patent Intelligence",
      "AI Patent Attorney Chat & IP Portfolio Health Dashboard",
      "200+ Prior Art Research Archive",
      "Full EM lab simulators & visualizations",
      "Investor CRM, pitch decks & VDR access",
      "Private engineering community (priority access)",
      "Early access to new courses & build plans",
    ],
    locked: [],
  },
];

const VALUE_STACK = [
  { icon: <Wrench size={15} className="text-orange-400" />, label: "40+ Full Build Plans", retail: "$8,000+", color: "#f97316" },
  { icon: <BookOpen size={15} className="text-blue-400" />, label: "40+ Advanced Courses", retail: "$12,000+", color: "#3b82f6" },
  { icon: <Shield size={15} className="text-green-400" />, label: "AI Patent Suite", retail: "$3,000+", color: "#22c55e" },
  { icon: <TrendingUp size={15} className="text-purple-400" />, label: "Investor Toolkit", retail: "$2,500+", color: "#a855f7" },
  { icon: <Star size={15} className="text-yellow-400" />, label: "Prior Art Archive", retail: "$1,500+", color: "#eab308" },
  { icon: <Zap size={15} className="text-cyan-400" />, label: "EM Lab Simulators", retail: "$800+", color: "#06b6d4" },
];

const TESTIMONIALS = [
  { quote: "The MEG build plans alone are worth 10x the membership. Nothing like this exists anywhere else.", name: "R.K.", role: "Electrical Engineer, Austin TX", stars: 5 },
  { quote: "Generated my full provisional patent in one session. My attorney called it the best pre-draft she'd ever seen.", name: "A.S.", role: "Independent Inventor", stars: 5 },
  { quote: "I've studied scalar EM for 20 years. ZARP is the only platform that actually teaches you to build.", name: "M.T.", role: "Independent Researcher", stars: 5 },
];

const OBJECTIONS = [
  {
    q: "Is this real engineering or pseudoscience?",
    a: "Every build plan cites granted US patents, peer-reviewed journals, and declassified government documents. The MEG (US Patent 6,362,718) was co-authored by a PhD physicist and published in Foundations of Physics Letters. We show you the original sources — you draw your own conclusions."
  },
  {
    q: "Can I actually build these devices?",
    a: "Yes. Every plan includes a full Bill of Materials with exact part numbers, specs, and supplier links (Digikey, Amazon, KJ Magnetics). Simpler devices cost under $150 in parts. Advanced systems require basic machining or coil winding skills."
  },
  {
    q: "What if I don't like it — can I really cancel?",
    a: "Cancel any time from your account settings. No contracts, no cancellation fees, no questions asked. Most members tell us the MEG build plan alone was worth more than 6 months of Starter."
  },
  {
    q: "Why is Pro highlighted?",
    a: "Pro gives you everything — all 40+ builds, all 40+ courses, the full AI patent suite, and the investor toolkit. At $79/month that's less than $2.65/day for what would cost $27,800+ à la carte. It's the obvious choice for anyone serious about building."
  },
  {
    q: "Is there any free option?",
    a: "Yes — the Free Vault gives you 1 complete build plan and 5 prior art entries with zero payment required. Enough to validate the quality before you commit."
  },
];

function ObjectionAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-2">
      {OBJECTIONS.map((item, i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-800/40 transition-colors min-h-0">
            <span className="text-white font-semibold text-sm leading-snug">{item.q}</span>
            <span className="flex-shrink-0 ml-4">
              {open === i
                ? <ChevronUp size={15} className="text-cyan-400" />
                : <ChevronDown size={15} className="text-gray-500" />}
            </span>
          </button>
          {open === i && (
            <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed border-t border-gray-800 pt-4">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TierCard({ tier, onCheckout }) {
  return (
    <div className={`relative flex flex-col rounded-2xl overflow-hidden transition-all
      ${tier.popular
        ? "border-2 shadow-2xl"
        : "border border-gray-700"
      } bg-gray-900`}
      style={{
        borderColor: tier.popular ? tier.color : undefined,
        boxShadow: tier.popular ? `0 0 60px ${tier.color}20, 0 8px 32px rgba(0,0,0,0.4)` : undefined,
      }}>

      {/* Badge */}
      {tier.badge && (
        <div className="py-2.5 text-center text-xs font-black tracking-wide text-white"
          style={{ backgroundColor: tier.color }}>
          {tier.badge}
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Name + headline */}
        <h3 className="font-black text-2xl text-white mb-0.5">{tier.name}</h3>
        <p className="text-xs mb-4" style={{ color: tier.color }}>{tier.headline}</p>

        {/* Price + anchor */}
        <div className="mb-1">
          {tier.anchor && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-600 line-through text-sm">${tier.anchor}/mo retail</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-black text-white" style={{ backgroundColor: tier.color }}>
                {Math.round((1 - tier.price / tier.anchor) * 100)}% OFF
              </span>
            </div>
          )}
          <div className="flex items-end gap-1">
            <span className="text-5xl font-black" style={{ color: tier.color }}>${tier.price}</span>
            <span className="text-gray-400 mb-1.5">/month</span>
          </div>
        </div>

        <p className="text-gray-500 text-xs mb-1">{tier.description}</p>
        <p className="text-gray-700 text-xs mb-6">Billed monthly · Cancel anytime</p>

        {/* Features */}
        <div className="space-y-2.5 mb-5 flex-1">
          {tier.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
              <span className="text-gray-200 text-sm">{f}</span>
            </div>
          ))}
          {tier.locked?.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5 opacity-30">
              <Lock size={13} className="flex-shrink-0 mt-0.5 text-gray-600" />
              <span className="text-gray-500 text-sm line-through">{f}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button onClick={() => onCheckout(tier)}
          className="w-full py-4 rounded-xl font-black text-base text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: tier.color, boxShadow: `0 4px 20px ${tier.color}50` }}>
          {tier.cta}
        </button>
        <p className="text-center text-gray-600 text-xs mt-2">{tier.ctaSub}</p>
      </div>
    </div>
  );
}

// ── Exit intent banner ────────────────────────────────────────────────────────
function ExitBanner({ onDismiss, onCheckout }) {
  const allAccessTier = TIERS.find(t => t.id === "all_access");
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-purple-600 rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
        <button onClick={onDismiss} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X size={18} />
        </button>
        <div className="text-center">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="text-white font-black text-xl mb-2">Wait — One Last Thing</h3>
          <p className="text-gray-400 text-sm mb-5 leading-relaxed">
            The MEG Replication Kit alone retails for $847. All Access gives you that <em className="text-white">plus</em> 39 other build plans + all 40 courses for $150/month. Most members recoup the cost in the first week.
          </p>
          <button onClick={() => { onDismiss(); onCheckout(allAccessTier); }}
            className="w-full py-4 rounded-xl font-black text-white text-base mb-3 transition-all hover:opacity-90"
            style={{ backgroundColor: allAccessTier.color, boxShadow: `0 4px 20px ${allAccessTier.color}50` }}>
            {allAccessTier.cta}
          </button>
          <button onClick={onDismiss} className="text-gray-600 text-xs hover:text-gray-400 transition-colors">
            No thanks, I'll pass on this
          </button>
        </div>
      </div>
    </div>
  );
}

// ── $97 One-Time Vault Access Card ───────────────────────────────────────────
function OneTimeAccessCard({ onCheckout, loading }) {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-yellow-500 rounded-2xl overflow-hidden shadow-2xl shadow-yellow-900/30 max-w-2xl mx-auto mb-10">
      <div className="py-2.5 text-center text-xs font-black text-black bg-yellow-500 tracking-widest">
        ⚡ FASTEST PATH IN — ONE-TIME, NO SUBSCRIPTION
      </div>
      <div className="p-7">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex-1">
            <h3 className="text-white font-black text-2xl mb-1">Vault Access Pass</h3>
            <p className="text-yellow-300 text-sm font-bold mb-3">Pay once · Access for 90 days · No recurring charge</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {[
                "All 40+ build plans (BOM, steps, PDF)",
                "All 40+ courses from the archive",
                "Full AI patent suite",
                "Prior Art Archive — 200+ entries",
                "EM lab simulators & tools",
                "Investor toolkit & VDR access",

              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-200">
                  <Check size={12} className="text-yellow-400 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-xs">No subscription. No auto-renew. One payment, 90 days access.</p>
          </div>
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <div className="text-center">
              <div className="text-gray-500 line-through text-base">$237 equivalent</div>
              <div className="text-6xl font-black text-yellow-400">$97</div>
              <div className="text-gray-400 text-sm">one-time</div>
            </div>
            <button
              onClick={() => onCheckout("one_time")}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-base text-black transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 whitespace-nowrap"
              style={{ backgroundColor: "#eab308", boxShadow: "0 4px 24px rgba(234,179,8,0.4)" }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
              {loading ? "Loading…" : "Get Access — $97 →"}
            </button>
            <p className="text-gray-600 text-xs text-center">🔒 Stripe · SSL · Instant access</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PaywallPage() {
  const { str: countdown } = useCountdown();
  const [showExit, setShowExit] = useState(false);
  const [exitShown, setExitShown] = useState(false);
  const [oneTimeLoading, setOneTimeLoading] = useState(false);

  // Exit intent on mouse leave
  useEffect(() => {
    const handleLeave = (e) => {
      if (e.clientY <= 0 && !exitShown) {
        setShowExit(true);
        setExitShown(true);
      }
    };
    document.addEventListener("mouseleave", handleLeave);
    return () => document.removeEventListener("mouseleave", handleLeave);
  }, [exitShown]);

  const handleCheckout = async (tier) => {
    if (window !== window.top) {
      alert("Checkout only works from the published app. Please open the app directly.");
      return;
    }
    const baseUrl = window.location.origin;

    // One-time $97 vault pass
    if (tier === "one_time") {
      setOneTimeLoading(true);
      const response = await base44.functions.invoke("createCheckoutSession", {
        title: "ZARP 90-Day Vault Access Pass",
        priceInCents: 9700,
        description: "Full vault access for 90 days — all 40+ builds, courses, AI tools, and investor toolkit. No subscription.",
        category: "vault_pass",
        mode: "payment",
        successUrl: `${baseUrl}/checkout?success=true&product=vault_pass`,
        cancelUrl: `${baseUrl}/paywall`,
        customerEmail: null,
      });
      if (response.data?.url) window.location.href = response.data.url;
      setOneTimeLoading(false);
      return;
    }

    const response = await base44.functions.invoke("createCheckoutSession", {
      title: `ZARP ${tier.name} Membership`,
      priceInCents: tier.price * 100,
      description: tier.description,
      category: "membership",
      mode: "subscription",
      interval: "month",
      successUrl: `${baseUrl}/checkout?success=true&product=${encodeURIComponent(tier.name)}`,
      cancelUrl: `${baseUrl}/paywall`,
      customerEmail: null,
    });
    if (response.data?.url) window.location.href = response.data.url;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
      <CodextechVaultBackground className="fixed inset-0 pointer-events-none z-0 opacity-20" />
      <ScalarWaveWatermark />

      {showExit && (
        <ExitBanner onDismiss={() => setShowExit(false)} onCheckout={handleCheckout} />
      )}

      {/* ── Urgency bar ── */}
      <div className="bg-gradient-to-r from-red-950 to-orange-950 border-b border-red-900 px-4 py-2.5 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <Flame size={13} className="text-orange-400 animate-pulse" />
          <span className="text-orange-200 font-semibold">Founding rates expire in</span>
          <span className="font-black text-white bg-black/50 px-3 py-0.5 rounded-lg font-mono tracking-widest text-base">{countdown}</span>
          <span className="text-orange-300 text-xs">— locks in forever at this price after checkout</span>
        </div>
      </div>

      {/* ── Nav ── */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-5 py-4 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-3">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png" alt="C.O.D.E.X.T.E.C.H." className="h-11 w-11 object-contain" />
          <span className="font-black text-lg">C.O.D.E.X.T.E.C.H.</span>
          <span className="text-gray-600 text-xs hidden sm:inline">The Engineering Platform</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/free-vault" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Browse Free First</Link>
          <Link to="/pricing" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Full Pricing →</Link>
        </div>
      </div>

      {/* ── Live activity ── */}
      <div className="bg-gray-900/50 border-b border-gray-800 px-5 py-2.5 flex items-center justify-center">
        <LivePulse />
      </div>

      {/* ── Hero ── */}
      <div className="text-center px-5 pt-12 pb-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/60 border border-red-800 text-red-300 text-xs font-black mb-5 uppercase tracking-widest">
          <Lock size={10} /> Members Only — Founding Rate Active
        </div>

        {/* Hero headline — "you're only seeing the preview" */}
        <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
          Full Vault<br />
          Requires<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
            Membership.
          </span>
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
          C.O.D.E.X.T.E.C.H. membership unlocks 40+ complete build systems, 26 structured courses, execution frameworks, and AI tools.
        </p>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mb-8">
          26 structured courses + complete build vault with BOMs, execution frameworks, and real engineering systems. Learn advanced concepts. Apply them immediately through guided builds.
        </p>

        {/* Anchor / value statement */}
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-yellow-950/30 border border-yellow-800/50 mb-10">
          <Award size={18} className="text-yellow-400 flex-shrink-0" />
          <span className="text-yellow-200 text-sm font-bold">
            Most users only see ~20% of the system. Builders go deeper.
          </span>
        </div>
      </div>

      {/* ── $97 One-Time Card ── */}
      <div className="px-5 pb-2 max-w-5xl mx-auto">
        <OneTimeAccessCard onCheckout={handleCheckout} loading={oneTimeLoading} />
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">or choose a monthly plan below</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>
      </div>

      {/* ── Value Stack ── */}
      <div className="px-5 pb-12 max-w-4xl mx-auto">
        <p className="text-center text-gray-500 text-xs uppercase tracking-widest font-bold mb-5">What you unlock with membership</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {VALUE_STACK.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5 bg-gray-900 border border-gray-800 rounded-xl">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}40` }}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-bold leading-snug">{item.label}</p>
                <p className="text-green-400 text-xs font-black">{item.retail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tier Cards ── */}
      <div className="px-5 pb-4 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black mb-2">Choose Your Builder Access</h2>
          <p className="text-gray-500 text-sm">Full courses + complete builds unlock with Pro · Instant access after checkout</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
          {TIERS.map(tier => (
            <TierCard key={tier.id} tier={tier} onCheckout={handleCheckout} />
          ))}
        </div>
        <p className="text-center text-gray-700 text-xs mt-5">
          🔒 Secured by Stripe · SSL encrypted · Cancel from account settings anytime
        </p>
      </div>

      {/* ── Scarcity nudge ── */}
      <div className="px-5 py-8 max-w-4xl mx-auto">
        <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-400 flex-shrink-0 animate-pulse" />
            <div>
              <p className="text-white font-black text-sm">Only 847 founding spots remaining</p>
              <p className="text-gray-400 text-xs">After 1,000 members, all prices increase. Lock in your rate now.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm flex-shrink-0">
            <Eye size={14} className="text-cyan-400" />
            <span className="text-gray-400 text-xs">153 people viewing this page right now</span>
          </div>
        </div>
      </div>



      {/* ── Social proof ── */}
      <div className="px-5 pb-14 max-w-4xl mx-auto">
        <h2 className="text-xl font-black text-center mb-6">What Builders Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex gap-1 mb-3">
                {[...Array(t.stars)].map((_, j) => <Star key={j} size={11} className="text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-gray-200 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
              <div>
                <p className="text-white font-bold text-sm">{t.name}</p>
                <p className="text-gray-500 text-xs">{t.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust logos / stats row */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { n: "40+", label: "Engineering Systems" },
            { n: "200+", label: "Prior Art Entries" },
            { n: "100%", label: "Source-Cited Content" },
          ].map((s, i) => (
            <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-xl py-4">
              <div className="text-2xl font-black text-cyan-400">{s.n}</div>
              <div className="text-gray-400 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Objection handling ── */}
      <div className="px-5 pb-14 max-w-3xl mx-auto">
        <h2 className="text-xl font-black text-center mb-6">Questions Before You Join</h2>
        <ObjectionAccordion />
      </div>

      {/* ── Final CTA ── */}
      <div className="px-5 pb-20 max-w-4xl mx-auto">
        <div className="text-center bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Clock size={14} className="text-orange-400" />
            <span className="text-orange-300 font-bold text-sm font-mono">{countdown} remaining at founding rates</span>
          </div>
          <h2 className="text-3xl font-black mb-2">Join the Builder Community.</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8 text-sm">
            Unlock full access to 26 structured courses + complete build systems. Learn. Apply. Build real prototypes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            {TIERS.map(tier => (
              <button key={tier.id} onClick={() => handleCheckout(tier)}
                className={`px-6 rounded-xl font-black text-white transition-all hover:opacity-90 active:scale-[0.98] ${tier.popular ? "py-5 text-base sm:px-8" : "py-4 text-sm"}`}
                style={{ backgroundColor: tier.color, boxShadow: `0 4px 24px ${tier.color}40` }}>
                {tier.name} — ${tier.price}/mo
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-gray-600">
            <span>🔒 Stripe · SSL</span>
            <span>↩️ Cancel anytime</span>
            <span>⚡ Instant access</span>
            <span>📋 No contracts</span>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <Link to="/free-vault" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Not ready? Browse the free vault first →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p>© 2026 Zenith Apex LLC · C.O.D.E.X.T.E.C.H. · Engineering execution platform</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link to="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
          <Link to="/refund-policy" className="hover:text-gray-400 transition-colors">Refund Policy</Link>
          <Link to="/pricing" className="hover:text-gray-400 transition-colors">Full Pricing</Link>
          <Link to="/free-vault" className="hover:text-gray-400 transition-colors">Free Vault</Link>
        </div>
      </footer>
    </div>
  );
}