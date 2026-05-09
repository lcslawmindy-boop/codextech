import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Lock, Gift, Flame, Clock, ChevronDown, ChevronUp, Wrench, BookOpen, Play, Package, Eye, ExternalLink, Zap } from "lucide-react";
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

const TIERS = [
  {
    id: "research",
    name: "Research Access",
    price: 9.99,
    color: "#06b6d4",
    badge: "STARTER",
    description: "Bearden concept graph & prior art database",
    features: [
      { icon: <Eye size={15} />, text: "Interactive Bearden concept graph — 100+ nodes" },
      { icon: <Package size={15} />, text: "Prior Art Archive — 200+ documented inventions" },
      { icon: <Check size={15} />, text: "Historical patents & suppression patterns" },
      { icon: <Check size={15} />, text: "Research library access" },
    ],
  },
  {
    id: "builder",
    name: "Builder",
    price: 49,
    color: "#f97316",
    badge: "POPULAR",
    description: "5 rotating courses + 5 rotating builds",
    features: [
      { icon: <BookOpen size={15} />, text: "5 curated courses (rotate monthly)" },
      { icon: <Wrench size={15} />, text: "5 build plans with full BOM & specs (rotate monthly)" },
      { icon: <Check size={15} />, text: "25% off all additional courses & build plans" },
      { icon: <Check size={15} />, text: "1 new course + 1 new build monthly drop" },
      { icon: <Check size={15} />, text: "Build forum & community support" },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 99,
    color: "#a855f7",
    badge: "BEST VALUE",
    description: "10 courses + 10 builds + patent suite",
    features: [
      { icon: <BookOpen size={15} />, text: "10 curated courses (rotating access)" },
      { icon: <Wrench size={15} />, text: "10 build plans with full BOM & specs (rotating)" },
      { icon: <Zap size={15} />, text: "5 Invention Forges per month" },
      { icon: <Check size={15} />, text: "25% off all additional courses & build plans" },
      { icon: <Check size={15} />, text: "1 new course + 1 new build monthly drop" },
      { icon: <Check size={15} />, text: "AI Patent Suite — drafting, attorney chat, threat monitor" },
      { icon: <Check size={15} />, text: "Build forum & patent support" },
    ],
  },
  {
    id: "forge",
    name: "Invention Forge Creator",
    price: 149,
    color: "#ef4444",
    badge: "PREMIUM",
    description: "Unlimited hybrid invention generation",
    features: [
      { icon: <Zap size={15} />, text: "Unlimited hybrid invention generation" },
      { icon: <Check size={15} />, text: "IP valuation estimation tool" },
      { icon: <Check size={15} />, text: "Export to investor pitch decks & presentations" },
      { icon: <Check size={15} />, text: "Commercialization pathway planning" },
      { icon: <Check size={15} />, text: "Priority support" },
    ],
  },
];

const FAQS = [
  { q: "Is this real engineering or pseudoscience?", a: "Every build plan cites granted U.S. patents, peer-reviewed journals, and declassified government documents. The MEG (U.S. Patent 6,362,718) was co-authored by a PhD physicist and published in Foundations of Physics Letters." },
  { q: "Can I really build these devices?", a: "Yes. Every plan includes a full BOM with exact part numbers, specifications, and verified supplier links. Simpler devices use off-the-shelf Digikey / Amazon components." },
  { q: "Why can't I download the PDFs?", a: "Build plans are available to view in full within the app on any device. This protects the integrity of the content and ensures you always have the latest version. You can access everything from your phone, tablet, or desktop." },
  { q: "What if I want to cancel?", a: "Cancel any time from your account settings. No contracts, no fees. Access continues until the end of your billing period." },
  { q: "Is there a free option?", a: "Yes — the Free Vault gives you access to 1 full build plan and sample prior art entries with no payment required." },
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
            {open === i ? <ChevronUp size={15} className="text-purple-400 flex-shrink-0 ml-3" /> : <ChevronDown size={15} className="text-gray-500 flex-shrink-0 ml-3" />}
          </button>
          {open === i && <div className="px-5 pb-4 text-gray-300 text-sm leading-relaxed">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

export default function Pricing() {
  const countdown = useCountdown();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [billingMode, setBillingMode] = useState("annual");

  const handleCheckout = async (tier) => {
    if (window !== window.top) {
      alert("Checkout only works from the published app. Please open the app directly.");
      return;
    }
    const baseUrl = window.location.origin;
    const isAnnual = billingMode === "annual";
    const priceInCents = isAnnual 
      ? Math.round(tier.price * 10 * 100) // 10 months = 2 free
      : Math.round(tier.price * 100);
    const response = await base44.functions.invoke("createCheckoutSession", {
      title: `Aethon Apex IP ${tier.name} (${isAnnual ? "Annual" : "Monthly"})`,
      priceInCents,
      description: tier.description,
      category: "membership",
      mode: isAnnual ? "payment" : "subscription",
      successUrl: `${baseUrl}/checkout?success=true&product=${tier.id}`,
      cancelUrl: `${baseUrl}/pricing`,
      customerEmail: null,
    });
    if (response.data?.url) window.location.href = response.data.url;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Urgency bar */}
      <div className="bg-gradient-to-r from-red-900 to-orange-900 border-b border-red-800 px-4 py-2 flex flex-wrap items-center justify-center gap-2 text-sm">
        <Flame size={13} className="text-orange-300 animate-pulse flex-shrink-0" />
        <span className="text-orange-100 font-semibold">Founding rate expires in</span>
        <span className="font-black text-white bg-black/40 px-3 py-0.5 rounded-lg font-mono tracking-widest">{countdown}</span>
        <span className="text-orange-200 text-xs">— price increases after 1,000 members</span>
      </div>

      {/* Nav */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bce328987_a6e3bd669_logo.png" alt="Aethon Apex IP" className="h-11 w-11 object-contain" />
            <h1 className="text-white font-black text-lg">Aethon Apex IP Membership</h1>
          </div>
        </div>
        <Link to="/referrals" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-900/40 border border-green-700 text-green-300 hover:bg-green-900/60 text-xs font-bold transition-all">
          <Gift size={13} /> Earn Credits
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center px-5 pt-16 pb-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-900/40 border border-yellow-700 text-yellow-300 text-xs font-black mb-6 uppercase tracking-widest">
          <Clock size={12} /> Founding Member Rate — First 1,000 Only
        </div>
        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
          Choose Your Path.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Start Building Today.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          From research access to professional tools and invention creation — find the perfect tier for your journey.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-gray-900 border border-gray-800">
          <button
            onClick={() => setBillingMode("monthly")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              billingMode === "monthly"
                ? "bg-gray-800 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingMode("annual")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 ${
              billingMode === "annual"
                ? "bg-green-900/60 border border-green-700 text-green-300"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Annual
            {billingMode === "annual" && <span className="text-xs bg-green-700 px-2 py-0.5 rounded-full">Save 3 months</span>}
          </button>
        </div>
      </div>

      {/* Membership Tiers Grid */}
      <div className="px-5 pb-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TIERS.map((tier) => {
            const monthlyPrice = tier.price;
            const annualMonths = 9; // 3 months free
            const annualTotal = tier.price * annualMonths;
            const displayPrice = billingMode === "annual" ? (annualTotal / 12).toFixed(2) : monthlyPrice;
            const billingPeriod = billingMode === "annual" ? `Billed $${annualTotal.toFixed(2)} once/year` : `Billed monthly`;
            return (
              <div key={tier.id} className="relative rounded-2xl overflow-hidden flex flex-col transition-all"
                style={{ border: `2px solid ${tier.color}40`, background: tier.id === "professional" ? `${tier.color}10` : "transparent" }}>
                {/* Badge */}
                <div className="py-2 text-center text-xs font-black tracking-widest text-white" style={{ backgroundColor: tier.color }}>
                  {tier.badge}
                </div>

                <div className="p-6 bg-gray-900 flex flex-col flex-1">
                  <h3 className="text-white font-black text-xl mb-1">{tier.name}</h3>
                  <p className="text-gray-400 text-xs mb-4">{tier.description}</p>

                  {/* Price */}
                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-black text-5xl" style={{ color: tier.color }}>${displayPrice}</span>
                    <span className="text-gray-500 mb-1 text-sm">/mo</span>
                  </div>
                  <p className="text-green-400 text-xs font-bold mb-1">{billingPeriod}</p>
                  <p className="text-gray-600 text-xs mb-6">Instant access · Secured by Stripe</p>

                  {/* CTA */}
                  <button
                    onClick={() => handleCheckout(tier)}
                    className="w-full py-3 rounded-xl font-black text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] mb-4"
                    style={{ backgroundColor: tier.color }}
                  >
                    Join Now →
                  </button>
                  <p className="text-center text-gray-500 text-xs mb-5">🔒 Cancel anytime</p>

                  {/* Features */}
                  <div className="space-y-2.5">
                    {tier.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span style={{ color: tier.color }} className="flex-shrink-0 mt-0.5">{f.icon}</span>
                        <span className="text-gray-200 text-xs font-medium leading-relaxed">{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free vault nudge */}
        <p className="text-center text-gray-600 text-sm mt-10">
          Want to explore first?{" "}
          <Link to="/free-vault" className="text-cyan-400 hover:underline">Browse the free vault →</Link>
        </p>
      </div>

      <div className="px-5 pb-16 max-w-3xl mx-auto">

        {/* Newsletter */}
        <div className="my-16 bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-900/30 rounded-2xl p-8">
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

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-center mb-8">Questions Before You Join</h2>
          <FaqAccordion />
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-b from-gray-900 to-gray-950 border border-purple-800/40 rounded-2xl p-10">
          <h2 className="text-3xl font-black mb-3">Questions?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Compare tiers above to find the right fit for your research or building needs.
          </p>
          <Link to="/free-vault"
            className="inline-flex items-center justify-center px-12 py-4 rounded-xl font-black text-xl text-white transition-all hover:opacity-90 shadow-lg"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 4px 24px rgba(139,92,246,0.4)" }}
          >
            Explore Free Vault →
          </Link>
          <p className="text-gray-600 text-xs mt-4">🔒 Secured by Stripe · Annual billing · Cancel anytime</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-600 text-xs">
        <p>© 2026 Zenith Apex LLC · Aethon Apex IP · Intellectual property research platform</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link to="/terms" className="hover:text-gray-400">Terms</Link>
          <Link to="/refund-policy" className="hover:text-gray-400">Refund Policy</Link>
          <Link to="/free-vault" className="hover:text-gray-400">Free Vault</Link>
        </div>
      </footer>
    </div>
  );
}