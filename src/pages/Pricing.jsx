import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Lock, Gift, Flame, Clock, ChevronDown, ChevronUp, Zap, BookOpen, Wrench, Database, Shield } from "lucide-react";
import { base44 } from "@/api/base44Client";

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

// Real Stripe price IDs (subscription mode)
const PRICE_IDS = {
  explorer:   { monthly: "price_1TXTFLBkbCWuj2nHKPYdnfH0", annual: "price_1TXTFLBkbCWuj2nHlkPxvXC8" },
  research:   { monthly: "price_1TXTFLBkbCWuj2nHbK0MpT7x", annual: "price_1TXTFLBkbCWuj2nH9LC0ABm0" },
  pro:        { monthly: "price_1TXTFLBkbCWuj2nHHKfUYuoV", annual: "price_1TXTFLBkbCWuj2nHXEZn1hEc" },
  enterprise: { monthly: "price_1TXTFLBkbCWuj2nHw8pspGy0", annual: "price_1TXTFLBkbCWuj2nHXyPYdCol" },
};

// ── Add-on dossier pricing for standalone credits ────────────────────────────
const DOSSIER_PACKS = [
  { name: "Starter Pack", forge: 5, patent: 5, multiplier: "1×", price: 49, color: "#06b6d4" },
  { name: "Builder Pack", forge: 25, patent: 25, multiplier: "5×", price: 197, color: "#a855f7", popular: true },
  { name: "Power Pack",   forge: 50, patent: 50, multiplier: "10×", price: 349, color: "#f97316" },
  { name: "Unlimited",   forge: "∞", patent: "∞", multiplier: "∞", price: 799, color: "#fbbf24" },
];

const TIERS = [
  {
    id: "explorer",
    name: "Explorer",
    monthly: 29,
    annual: 24,
    color: "#06b6d4",
    badge: "STARTER",
    desc: "Research archive & concept library — no build plans",
    valueNote: null,
    features: [
      { icon: <Database size={14} />, text: "Interactive electromagnetic concept graph — 100+ nodes" },
      { icon: <BookOpen size={14} />, text: "Prior Art Archive — 200+ documented entries" },
      { icon: <Check size={14} />, text: "Engineering glossary & reference library" },
      { icon: <Check size={14} />, text: "Community forum read access" },
    ],
    locked: ["Build plan library (build plans locked)", "Structured courses", "Invention Forge", "AI Patent Suite"],
  },
  {
    id: "research",
    name: "Research Lab",
    monthly: 49,
    annual: 39,
    color: "#a855f7",
    badge: "MOST POPULAR",
    desc: "All courses · purchase up to 10 build plans · Forge & Patent credits",
    highlight: true,
    valueNote: "$717+ retail value / mo",
    valueBreakdown: [
      { label: "40+ courses access", retail: "$197" },
      { label: "Up to 10 build plans", retail: "$490" },
      { label: "2 Forge + 1 Patent credit", retail: "$30" },
    ],
    features: [
      { icon: <BookOpen size={14} />, text: "All 40+ structured engineering courses — full access" },
      { icon: <Wrench size={14} />, text: "Purchase up to 10 build plans / month (BOM, schematics, assembly)" },
      { icon: <Zap size={14} />, text: "2 Invention Forge credits / month (AI hybrid IP generation)" },
      { icon: <Shield size={14} />, text: "1 AI Patent Suite credit / month (drafting + analysis)" },
      { icon: <Check size={14} />, text: "Full community forum access" },
      { icon: <Check size={14} />, text: "Prior Art Archive — 200+ entries" },
    ],
    locked: [],
  },
  {
    id: "pro",
    name: "Pro Builder",
    monthly: 149,
    annual: 119,
    color: "#f97316",
    badge: "BEST VALUE",
    desc: "All courses · unlimited build plan purchases · 10 Forge + 10 Patent credits",
    valueNote: "$1,373+ retail value / mo",
    valueBreakdown: [
      { label: "40+ courses access", retail: "$197" },
      { label: "Unlimited build plans (~20 avg)", retail: "$980" },
      { label: "10 Forge + 10 Patent credits", retail: "$196" },
    ],
    features: [
      { icon: <BookOpen size={14} />, text: "All 40+ courses — full rotating access" },
      { icon: <Wrench size={14} />, text: "Unlimited build plan purchases — full catalogue unlocked" },
      { icon: <Zap size={14} />, text: "10 Invention Forge credits / month" },
      { icon: <Shield size={14} />, text: "10 AI Patent Suite credits / month (drafting research, FTO, monitoring — not legal advice)" },
      { icon: <Check size={14} />, text: "Priority support & expert forum access" },
      { icon: <Check size={14} />, text: "Early access to all new content drops" },
    ],
    locked: [],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: 497,
    annual: 397,
    color: "#fbbf24",
    badge: "INSTITUTIONAL",
    desc: "White-label, multi-seat, VDR, unlimited credits",
    valueNote: "Unlimited everything",
    features: [
      { icon: <Shield size={14} />, text: "Everything in Pro Builder" },
      { icon: <Check size={14} />, text: "Up to 10 team seats" },
      { icon: <Check size={14} />, text: "White-label build documentation" },
      { icon: <Check size={14} />, text: "Virtual Data Room (VDR) access" },
      { icon: <Check size={14} />, text: "Institutional licensing inquiry support" },
      { icon: <Zap size={14} />, text: "Unlimited Invention Forge & Patent Suite credits" },
      { icon: <Check size={14} />, text: "Dedicated account manager" },
    ],
    locked: [],
  },
];

const FAQS = [
  { q: "Is this real engineering documentation?", a: "Every build plan cites granted US patents, peer-reviewed journals, or declassified government documents. The MEG (US Patent 6,362,718) was co-authored by a PhD physicist and published in Foundations of Physics Letters." },
  { q: "Can I actually build these devices?", a: "Yes. Every plan includes a full BOM with exact part numbers, specifications, and verified supplier links. Parts source from standard suppliers like Digikey, Mouser, and Amazon." },
  { q: "What is the Invention Forge?", a: "The Invention Forge is an AI-powered tool that generates hybrid invention concepts from the research archive — complete with IP valuations, patent claims, and commercialization roadmaps." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel anytime from your account settings. No contracts. Access continues until the end of your billing period." },
  { q: "Is there a free option?", a: "Yes — the Free Vault gives you access to 1 full build plan and sample prior art entries with no payment required." },
];

function FaqItem({ f, i, open, setOpen }) {
  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(open === i ? null : i)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/40 transition-colors">
        <span className="text-white font-semibold text-sm">{f.q}</span>
        {open === i
          ? <ChevronUp size={15} className="text-purple-400 flex-shrink-0 ml-3" />
          : <ChevronDown size={15} className="text-slate-500 flex-shrink-0 ml-3" />}
      </button>
      {open === i && <div className="px-5 pb-4 text-slate-300 text-sm leading-relaxed border-t border-slate-800 pt-3">{f.a}</div>}
    </div>
  );
}

export default function Pricing() {
  const countdown = useCountdown();
  const [billingMode, setBillingMode] = useState("annual");
  const [faqOpen, setFaqOpen] = useState(null);
  const [email, setEmail] = useState("");
  const [emailDone, setEmailDone] = useState(false);

  useEffect(() => {
    base44.analytics.track({ eventName: "pricing_page_viewed", properties: { billing: "annual" } });
  }, []);

  const handleCheckout = async (tier) => {
    if (window.self !== window.top) {
      alert("Checkout only works from the published app.");
      return;
    }
    // Conversion tracking
    base44.analytics.track({
      eventName: "pricing_checkout_clicked",
      properties: { tier: tier.id, billing: billingMode, monthly_price: tier.monthly }
    });

    const isAnnual = billingMode === "annual";
    const price = isAnnual ? tier.annual : tier.monthly;
    const priceId = PRICE_IDS[tier.id]?.[isAnnual ? "annual" : "monthly"];

    // Fire GA4 conversion event
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: price,
        items: [{ item_id: tier.id, item_name: tier.name, price }],
      });
    }

    const res = await base44.functions.invoke("createCheckoutSession", {
      title: `Aethon Apex IP — ${tier.name}`,
      priceId,
      mode: "subscription",
      category: "membership",
      successUrl: `${window.location.origin}/member-dashboard?checkout=success`,
      cancelUrl: `${window.location.origin}/pricing`,
    });
    if (res.data?.url) window.location.href = res.data.url;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Urgency bar */}
      <div className="bg-gradient-to-r from-orange-950 to-red-950 border-b border-orange-900/50 px-4 py-2 flex flex-wrap items-center justify-center gap-2">
        <Flame size={13} className="text-orange-300 animate-pulse flex-shrink-0" />
        <span className="text-orange-100 font-semibold text-sm">Founding rate expires in</span>
        <span className="font-black text-white bg-black/40 px-3 py-0.5 rounded-lg font-mono tracking-widest text-sm">{countdown}</span>
        <span className="text-orange-200 text-xs">— price increases after 1,000 members</span>
      </div>

      {/* Nav */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/start" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-slate-700" />
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bce328987_a6e3bd669_logo.png" alt="Aethon Apex IP" className="h-8 w-8 object-contain" />
            <h1 className="text-white font-black text-base">Membership Plans</h1>
          </div>
        </div>
        <Link to="/referrals" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-900/40 border border-green-700 text-green-300 hover:bg-green-900/60 text-xs font-bold transition-all">
          <Gift size={13} /> Earn Credits
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center px-5 pt-14 pb-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-900/40 border border-yellow-700 text-yellow-300 text-xs font-black mb-6 uppercase tracking-widest">
          <Clock size={12} /> Founding Member Rate — First 1,000 Only
        </div>
        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
          Choose Your Membership.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Start Building Today.</span>
        </h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          Four tiers for every level of researcher — from archive access to full build catalogue + AI patent tooling.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-slate-900 border border-slate-800">
          <button
            onClick={() => setBillingMode("monthly")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              billingMode === "monthly" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingMode("annual")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 ${
              billingMode === "annual" ? "bg-green-900/60 border border-green-700 text-green-300" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Annual
            {billingMode === "annual" && <span className="text-xs bg-green-700 px-2 py-0.5 rounded-full">Save ~20%</span>}
          </button>
        </div>
      </div>

      {/* Tiers */}
      <div className="px-5 pb-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {TIERS.map((tier) => {
            const isAnnual = billingMode === "annual";
            const price = isAnnual ? tier.annual : tier.monthly;
            return (
              <div
                key={tier.id}
                className="relative flex flex-col rounded-2xl overflow-hidden transition-all"
                style={{
                  border: `2px solid ${tier.highlight ? tier.color : tier.color + "40"}`,
                  boxShadow: tier.highlight ? `0 0 40px ${tier.color}20` : "none",
                  transform: tier.highlight ? "scale(1.02)" : "none",
                }}
              >
                <div className="py-2 text-center text-xs font-black tracking-widest text-white" style={{ backgroundColor: tier.color }}>
                  {tier.badge}
                </div>
                <div className="p-6 bg-slate-900 flex flex-col flex-1">
                  <h3 className="text-white font-black text-xl mb-1">{tier.name}</h3>
                  <p className="text-slate-400 text-xs mb-2">{tier.desc}</p>
                  {tier.valueNote && (
                    <div className="mb-3">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black mb-2 self-start" style={{ background: tier.color + "20", color: tier.color, border: `1px solid ${tier.color}40` }}>
                        ✦ {tier.valueNote}
                      </div>
                      {tier.valueBreakdown && (
                        <div className="rounded-lg overflow-hidden border mb-1" style={{ borderColor: tier.color + "25", background: tier.color + "08" }}>
                          {tier.valueBreakdown.map((row, ri) => (
                            <div key={ri} className="flex items-center justify-between px-2.5 py-1 border-b last:border-0" style={{ borderColor: tier.color + "15" }}>
                              <span className="text-[10px] text-slate-400">{row.label}</span>
                              <span className="text-[10px] font-black line-through text-slate-600 mr-1">{row.retail}</span>
                            </div>
                          ))}
                          <div className="flex items-center justify-between px-2.5 py-1.5 bg-black/20">
                            <span className="text-[10px] font-black text-slate-300">Est. retail value</span>
                            <span className="text-[11px] font-black" style={{ color: tier.color }}>{tier.valueNote.split(" ")[0]}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-black text-5xl" style={{ color: tier.color }}>${price}</span>
                    <span className="text-slate-500 mb-1 text-sm">/mo</span>
                  </div>
                  {isAnnual && <p className="text-green-400 text-xs font-bold mb-1">Save ${(tier.monthly - tier.annual) * 12}/year</p>}
                  <p className="text-slate-600 text-xs mb-5">{isAnnual ? `$${tier.annual * 12} billed annually` : "Monthly billing"}</p>

                  <button
                    onClick={() => handleCheckout(tier)}
                    className="w-full py-3 rounded-xl font-black text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] mb-3"
                    style={{ backgroundColor: tier.color }}
                  >
                    Get {tier.name} →
                  </button>
                  <p className="text-center text-slate-500 text-xs mb-4">🔒 Cancel anytime</p>

                  <div className="space-y-2.5 flex-1">
                    {tier.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span style={{ color: tier.color }} className="flex-shrink-0 mt-0.5">{f.icon}</span>
                        <span className="text-slate-200 text-xs leading-relaxed">{f.text}</span>
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
          })}
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Build plans are only accessible to Research Lab and above.{" "}
          <Link to="/free-vault" className="text-cyan-400 hover:underline">Explore the free vault →</Link>
        </p>
      </div>

      {/* ── Add-on Dossier Credit Packs ── */}
      <div className="px-5 pb-16 max-w-5xl mx-auto">
        <div className="text-center mb-8 mt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-black uppercase tracking-widest mb-3">
            <Zap size={11} className="text-yellow-400" /> Add-On Credit Packs
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Invention Forge & AI Patent Suite</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">Purchase standalone credit bundles for Invention Forge sessions and AI Patent Suite dossiers. Each pack includes equal credits for both tools.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs text-slate-500">
            <span>⚡ Forge credit = 1 AI hybrid IP generation session</span>
            <span>📜 Patent credit = 1 full patent draft + FTO analysis</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {DOSSIER_PACKS.map((pack) => (
            <div key={pack.name}
              className="relative rounded-2xl overflow-hidden flex flex-col"
              style={{ border: `1px solid ${pack.color}50`, background: "linear-gradient(160deg,#0d1526,#0a1020)", boxShadow: pack.popular ? `0 0 30px ${pack.color}20` : "none" }}
            >
              {pack.popular && (
                <div className="py-1.5 text-center text-[10px] font-black tracking-widest text-white" style={{ backgroundColor: pack.color }}>
                  BEST VALUE
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: pack.color }}>{pack.multiplier} Credits</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-mono">{pack.name}</span>
                </div>
                <div className="text-4xl font-black mb-1" style={{ color: pack.color }}>${pack.price}</div>
                <p className="text-slate-500 text-xs mb-4">one-time purchase</p>
                <div className="space-y-2 mb-5 flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span style={{ color: pack.color }}>⚡</span>
                    <span>{pack.forge === "∞" ? "Unlimited" : pack.forge} Invention Forge sessions</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span style={{ color: pack.color }}>📜</span>
                    <span>{pack.patent === "∞" ? "Unlimited" : pack.patent} AI Patent Suite credits</span>
                  </div>
                  {pack.multiplier !== "1×" && (
                    <div className="flex items-center gap-2 text-xs text-green-400 font-bold mt-2">
                      <span>✦</span>
                      <span>Save vs individual @ ${Math.round(pack.price / (typeof pack.forge === "number" ? pack.forge : 1))}/credit</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => alert("Add-on packs coming soon — contact us to purchase.")}
                  className="w-full py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90"
                  style={{ background: `linear-gradient(135deg, ${pack.color}, ${pack.color}99)` }}
                >
                  Get {pack.name} →
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-600 text-xs mt-4">Credits never expire · Stack with any membership tier</p>
      </div>

      {/* Email Capture */}
      <div className="px-5 pb-16 max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-900/30 rounded-2xl p-8 text-center mb-12">
          <h3 className="text-white font-black text-xl mb-2">Not Ready Yet? Get a Free Module</h3>
          <p className="text-slate-400 text-sm mb-6">Weekly engineering research breakdowns + a free intro course module.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input type="email" placeholder="your@email.com" value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500" />
            <button onClick={async () => {
              if (!email) return;
              await base44.entities.NewsletterSubscriber.create({ email, source: "pricing_v3", status: "active" });
              setEmailDone(true);
            }} className="px-6 py-3 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-sm whitespace-nowrap transition-all">
              {emailDone ? "✓ Sent!" : "Send My Module"}
            </button>
          </div>
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-black text-center mb-6">Questions</h2>
        <div className="space-y-2 mb-12">
          {FAQS.map((f, i) => (
            <FaqItem key={i} f={f} i={i} open={faqOpen} setOpen={setFaqOpen} />
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center bg-slate-900 border border-purple-800/40 rounded-2xl p-10">
          <h2 className="text-3xl font-black mb-3">Ready to Start?</h2>
          <p className="text-slate-400 mb-8">Choose a plan above or explore the free vault first.</p>
          <Link to="/free-vault"
            className="inline-flex items-center justify-center px-10 py-4 rounded-xl font-black text-lg text-white transition-all hover:opacity-90 shadow-lg"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 4px 24px rgba(139,92,246,0.4)" }}>
            Explore Free Vault →
          </Link>
          <p className="text-slate-600 text-xs mt-4">🔒 Secured by Stripe · Cancel anytime</p>
        </div>
      </div>

      {/* Legal compliance notice */}
      <div className="bg-amber-950/20 border-t border-amber-900/30 px-6 py-4">
        <p className="text-center text-amber-200/60 text-[11px] leading-relaxed max-w-3xl mx-auto">
          <strong className="text-amber-300/80">Research & Educational Platform Only.</strong> All content is for educational and experimental study. No device described on this platform is approved by the FDA, FCC, or any regulatory authority. AI patent tools are research aids — consult a licensed USPTO patent attorney before filing. Nothing on this platform constitutes medical, legal, or investment advice. Results from experimental devices described in source literature cannot be guaranteed to be reproducible.
        </p>
      </div>

      <footer className="border-t border-slate-800 px-6 py-8 text-center text-slate-600 text-xs">
        <p>© 2026 Zenith Apex LLC · Aethon Apex IP</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link to="/terms" className="hover:text-slate-400">Terms</Link>
          <Link to="/refund-policy" className="hover:text-slate-400">Refund Policy</Link>
          <Link to="/free-vault" className="hover:text-slate-400">Free Vault</Link>
        </div>
      </footer>
    </div>
  );
}