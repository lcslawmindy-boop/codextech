import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Lock, Check, Flame, Clock, ArrowRight, Star, ChevronDown, ChevronUp, Award, Zap, Shield, BookOpen, Wrench, TrendingUp } from "lucide-react";

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
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// ── Tiers ─────────────────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "starter", name: "Starter", price: 29, color: "#06b6d4",
    description: "Core vault — 15 builds, 15 courses, AI patent tool",
    cta: "Start with Starter",
    popular: false,
    features: ["15 build plans (BOM + PDF)", "15 courses", "AI Patent Tool", "Prior Art — 50 entries", "20% off à la carte"],
  },
  {
    id: "pro", name: "Pro", price: 79, color: "#8b5cf6",
    description: "Full vault + all AI tools + investor system",
    cta: "Get Pro — Best Value",
    popular: true,
    features: ["All 40+ builds + videos", "All 40+ courses", "Full AI suite (patent, FTO, investor)", "Prior Art — 200+ entries", "EM lab simulators", "50% off à la carte"],
  },
  {
    id: "elite", name: "Elite", price: 149, color: "#f59e0b",
    description: "Everything + restricted systems + monthly strategy call",
    cta: "Go Elite",
    popular: false,
    features: ["Everything in Pro", "Restricted / defense systems", "Monthly 1-on-1 strategy session", "Priority support", "60% off à la carte"],
  },
];

const VALUE_STACK = [
  { icon: <Wrench size={16} className="text-orange-400" />, label: "40+ Full Build Plans", value: "$8,000+" },
  { icon: <BookOpen size={16} className="text-blue-400" />, label: "40+ Advanced Courses", value: "$12,000+" },
  { icon: <Shield size={16} className="text-green-400" />, label: "AI Patent Suite", value: "$3,000+" },
  { icon: <TrendingUp size={16} className="text-purple-400" />, label: "Investor Toolkit", value: "$2,500+" },
  { icon: <Star size={16} className="text-yellow-400" />, label: "Prior Art Archive", value: "$1,500+" },
  { icon: <Zap size={16} className="text-cyan-400" />, label: "EM Lab Simulators", value: "$800+" },
];

const OBJECTIONS = [
  { q: "Is this real engineering or pseudoscience?", a: "Every build plan cites granted US patents, peer-reviewed journals, and declassified government documents. The MEG (US Patent 6,362,718) was co-authored by a PhD physicist and published in Foundations of Physics Letters." },
  { q: "Can I really build these devices?", a: "Yes. Every plan includes a full BOM with exact part numbers, specifications, and supplier links from Digikey, Amazon, and KJ Magnetics." },
  { q: "What if I don't like it?", a: "Cancel any time. No contracts, no fees. Most members tell us the MEG build plan alone was worth more than 6 months of membership." },
  { q: "Why is Pro the best value?", a: "Pro gives you full vault access — all 40+ builds, all 40+ courses, the complete AI patent suite, and the investor toolkit. At $79/mo that's less than $2.70/day for what would cost $27,000+ à la carte." },
];

const TESTIMONIALS = [
  { quote: "The MEG build plans alone are worth 10x the membership. Nothing like this exists anywhere else.", name: "R.K.", role: "Electrical Engineer" },
  { quote: "Generated my full provisional patent in one session. My attorney called it the best pre-draft she'd ever seen.", name: "A.S.", role: "Independent Inventor" },
  { quote: "I've studied scalar EM for 20 years. ZARP is the only platform that teaches you to actually build.", name: "M.T.", role: "Independent Researcher" },
];

function ObjectionAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-2">
      {OBJECTIONS.map((item, i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-800/40 transition-colors">
            <span className="text-white font-semibold text-sm">{item.q}</span>
            {open === i ? <ChevronUp size={15} className="text-cyan-400 flex-shrink-0 ml-3" /> : <ChevronDown size={15} className="text-gray-500 flex-shrink-0 ml-3" />}
          </button>
          {open === i && <div className="px-5 pb-4 text-gray-300 text-sm leading-relaxed">{item.a}</div>}
        </div>
      ))}
    </div>
  );
}

export default function PaywallPage() {
  const countdown = useCountdown();

  const handleCheckout = async (tier) => {
    if (window !== window.top) {
      alert("Checkout only works from the published app. Please open the app directly.");
      return;
    }
    const baseUrl = window.location.origin;
    const response = await base44.functions.invoke("createCheckoutSession", {
      title: `ZARP ${tier.name} Membership`,
      priceInCents: tier.price * 100,
      description: tier.description,
      category: "membership",
      mode: "subscription",
      interval: "month",
      successUrl: `${baseUrl}/checkout?success=true&product=${tier.id}`,
      cancelUrl: `${baseUrl}/paywall`,
    });
    if (response.data?.url) window.location.href = response.data.url;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Urgency bar */}
      <div className="bg-gradient-to-r from-red-900 to-orange-900 border-b border-red-800 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Flame size={13} className="text-orange-300 animate-pulse" />
          <span className="text-orange-100 font-semibold">Founding rates expire in</span>
        </div>
        <span className="font-black text-white bg-black/50 px-3 py-0.5 rounded-lg font-mono tracking-widest">{countdown}</span>
        <span className="text-orange-200 text-xs">— price increases permanently after 1,000 members</span>
      </div>

      {/* Nav */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png" alt="ZARP" className="h-8 w-8 object-contain" />
          <span className="font-black text-lg">ZARP</span>
        </Link>
        <Link to="/free-vault" className="text-gray-400 hover:text-white text-sm transition-colors">Browse Free First</Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/40 border border-red-700 text-red-300 text-xs font-black mb-5 uppercase tracking-widest">
            <Lock size={11} /> Membership Required
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            The Engineering Knowledge<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">They Don't Teach Anywhere</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-6">
            40+ build plans. 40+ courses. AI patent tools. The world's only scalar EM engineering platform built from primary sources.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-900/30 border border-yellow-700">
            <Award size={15} className="text-yellow-400" />
            <span className="text-yellow-300 text-sm font-bold">Total à la carte value: <span className="text-white">$27,800+</span> — from $29/month</span>
          </div>
        </div>

        {/* Value Stack */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-14">
          {VALUE_STACK.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5 bg-gray-900 border border-gray-800 rounded-xl">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">{item.icon}</div>
              <div className="min-w-0">
                <p className="text-white text-xs font-bold truncate">{item.label}</p>
                <p className="text-green-400 text-xs font-black">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
          {TIERS.map(tier => (
            <div key={tier.id} className={`relative flex flex-col rounded-2xl overflow-hidden bg-gray-900
              ${tier.popular ? "border-2 shadow-xl" : "border border-gray-700"}
            `} style={{ borderColor: tier.popular ? tier.color : undefined, boxShadow: tier.popular ? `0 0 40px ${tier.color}25` : undefined }}>
              {tier.popular && (
                <div className="py-2 text-center text-xs font-black tracking-widest text-white" style={{ backgroundColor: tier.color }}>
                  MOST POPULAR
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-white font-black text-xl mb-1">{tier.name}</h3>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">{tier.description}</p>
                <div className="flex items-end gap-1 mb-5">
                  <span className="text-4xl font-black" style={{ color: tier.color }}>${tier.price}</span>
                  <span className="text-gray-500 mb-1">/mo</span>
                </div>
                <div className="space-y-2 mb-6 flex-1">
                  {tier.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check size={12} className="flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
                      <span className="text-gray-300 text-xs">{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleCheckout(tier)}
                  className="w-full py-3.5 rounded-xl font-black text-sm text-white transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: tier.color, boxShadow: `0 4px 16px ${tier.color}40` }}>
                  {tier.cta}
                </button>
                <p className="text-center text-gray-700 text-xs mt-2">Cancel anytime</p>
              </div>
            </div>
          ))}
        </div>

        {/* Or browse à la carte */}
        <div className="text-center mb-14">
          <p className="text-gray-500 text-sm mb-3">Not ready for membership?</p>
          <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all text-sm font-bold">
            Browse À La Carte Plans <ArrowRight size={14} />
          </Link>
        </div>

        {/* Testimonials */}
        <div className="mb-14">
          <h2 className="text-2xl font-black text-center mb-8">From the Vault Builders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex gap-1 mb-3">{[...Array(5)].map((_, j) => <Star key={j} size={11} className="text-yellow-400 fill-yellow-400" />)}</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-14 bg-gray-900/50 border border-gray-800 rounded-2xl p-6 grid grid-cols-3 gap-4 text-center">
          <div><div className="text-3xl font-black text-cyan-400">847</div><div className="text-gray-400 text-xs mt-1">founding spots left</div></div>
          <div><div className="text-3xl font-black text-green-400">153</div><div className="text-gray-400 text-xs mt-1">members this month</div></div>
          <div><div className="text-3xl font-black text-yellow-400">$29</div><div className="text-gray-400 text-xs mt-1">starts here</div></div>
        </div>

        {/* Objections */}
        <div className="mb-14">
          <h2 className="text-2xl font-black text-center mb-8">Questions Before You Join</h2>
          <ObjectionAccordion />
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-b from-cyan-950/30 to-transparent border border-cyan-900/30 rounded-2xl p-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock size={15} className="text-orange-400" />
            <span className="text-orange-300 font-bold text-sm">Founding rates expire: {countdown}</span>
          </div>
          <h2 className="text-3xl font-black mb-3">Ready to Build?</h2>
          <p className="text-gray-400 mb-8">Start with any tier. Upgrade anytime. Cancel anytime.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {TIERS.map(tier => (
              <button key={tier.id} onClick={() => handleCheckout(tier)}
                className={`px-6 py-3.5 rounded-xl font-black text-sm text-white transition-all hover:opacity-90 ${tier.popular ? "text-base px-8 py-4" : ""}`}
                style={{ backgroundColor: tier.color, boxShadow: `0 4px 20px ${tier.color}40` }}>
                {tier.name} — ${tier.price}/mo
              </button>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-5">🔒 Secured by Stripe · Cancel anytime · Instant access</p>
        </div>
      </div>

      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-600 text-xs">
        <p>© 2026 Zenith Apex LLC · Educational research platform · Not financial or medical advice</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link to="/terms" className="hover:text-gray-400">Terms</Link>
          <Link to="/refund-policy" className="hover:text-gray-400">Refund Policy</Link>
          <Link to="/pricing" className="hover:text-gray-400">Full Pricing</Link>
        </div>
      </footer>
    </div>
  );
}