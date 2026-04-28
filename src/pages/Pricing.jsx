import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Lock, Gift, Flame, Clock, ChevronDown, ChevronUp, Wrench, BookOpen, Play, Package, Eye, ExternalLink } from "lucide-react";
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

const MEMBERSHIP = {
  id: "member",
  name: "Full Access Membership",
  price: 99,
  color: "#8b5cf6",
  description: "All courses and all build plans, forever.",
  cta: "Join Now — $99/mo",
  features: [
    { icon: <Wrench size={15} />, text: "40+ complete build plans — full BOM, schematics, assembly steps" },
    { icon: <ExternalLink size={15} />, text: "Verified sourcing links — Digikey, Mouser, Amazon, specialist suppliers" },
    { icon: <Play size={15} />, text: "Step-by-step build videos — 3–12 hours per device" },
    { icon: <BookOpen size={15} />, text: "40+ structured courses from the archive" },
    { icon: <Check size={15} />, text: "Prior Art Archive — 200+ documented systems" },
    { icon: <Check size={15} />, text: "EM Lab simulator & scalar wave tools" },
    { icon: <Check size={15} />, text: "Private community & troubleshooting forum" },
    { icon: <Check size={15} />, text: "Cancel anytime — no contracts, no lock-in" },
  ],
  notIncluded: [
    "PDF download of build plans (view-only in app)",
  ],
};

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
  const [billingAnnual, setBillingAnnual] = useState(false);

  const monthlyPrice = MEMBERSHIP.price;
  const annualTotal = monthlyPrice * 12; // Annual upfront only
  const displayPrice = monthlyPrice; // Always show $99

  const handleCheckout = async () => {
    if (window !== window.top) {
      alert("Checkout only works from the published app. Please open the app directly.");
      return;
    }
    const baseUrl = window.location.origin;
    const response = await base44.functions.invoke("createCheckoutSession", {
      title: "C.O.D.E.X.T.E.C.H. Full Access Membership (Annual)",
      priceInCents: annualTotal * 100,
      description: MEMBERSHIP.description,
      category: "membership",
      mode: "payment",
      successUrl: `${baseUrl}/checkout?success=true&product=member`,
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
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png" alt="C.O.D.E.X.T.E.C.H." className="h-11 w-11 object-contain" />
            <h1 className="text-white font-black text-lg">C.O.D.E.X.T.E.C.H. Membership</h1>
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
          One Plan.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Everything Included.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          All 40+ courses and all 40+ build plans — complete BOMs, sourcing links, build videos, and everything in the vault.
        </p>
      </div>

      {/* Annual Only Notice */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-900/40 border border-yellow-700">
          <span className="text-yellow-300 text-sm font-bold">Annual Billing Only</span>
          <span className="text-yellow-400 text-xs">Pay once per year</span>
        </div>
      </div>

      {/* Single Membership Card */}
      <div className="px-5 pb-16 max-w-lg mx-auto">
        <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500 shadow-2xl shadow-purple-900/40">
          {/* Top badge */}
          <div className="py-3 text-center text-xs font-black tracking-widest text-white bg-purple-600">
             ALL 40+ COURSES — ALL 40+ BUILD PLANS
           </div>

          <div className="p-8 bg-gray-900">
            <h3 className="text-white font-black text-2xl mb-1">{MEMBERSHIP.name}</h3>
            <p className="text-gray-400 text-sm mb-6">{MEMBERSHIP.description}</p>

            {/* Price */}
            <div className="flex items-end gap-1 mb-1">
              <span className="font-black text-6xl text-purple-400">${displayPrice}</span>
              <span className="text-gray-500 mb-2 text-lg">/mo</span>
            </div>
            <p className="text-green-400 text-sm font-bold mb-1">Billed ${annualTotal} annually</p>
            <p className="text-gray-600 text-xs mb-8">Annual commitment · Instant access · Secured by Stripe</p>

            {/* CTA */}
            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-xl font-black text-xl text-white transition-all hover:opacity-90 active:scale-[0.98] mb-2"
              style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 6px 28px rgba(139,92,246,0.50)" }}
            >
              {MEMBERSHIP.cta} →
            </button>
            <p className="text-center text-purple-400/60 text-xs mb-8">🔒 Stripe · SSL · Cancel anytime</p>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {MEMBERSHIP.features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-purple-400 flex-shrink-0 mt-0.5">{f.icon}</span>
                  <span className="text-gray-200 text-sm font-medium">{f.text}</span>
                </div>
              ))}
            </div>

            {/* Not included */}
            <div className="border-t border-gray-800 pt-4">
              <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">Not included</p>
              {MEMBERSHIP.notIncluded.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 opacity-40 mb-1.5">
                  <Lock size={12} className="flex-shrink-0 mt-0.5 text-gray-500" />
                  <span className="text-gray-500 text-xs">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Free vault nudge */}
        <p className="text-center text-gray-600 text-sm mt-5">
          Not ready yet?{" "}
          <Link to="/free-vault" className="text-cyan-400 hover:underline">Browse the free vault first →</Link>
        </p>
      </div>

      {/* What you get — visual breakdown */}
      <div className="border-y border-gray-800 bg-gray-900/40 px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-10">All 40+ courses + all 40+ build plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "🎓", title: "40+ Courses", desc: "Full structured curriculum from scalar EM fundamentals to patent strategy and investor frameworks", color: "#22c55e" },
               { icon: "🔧", title: "40+ Build Plans", desc: "Every complete build plan in the vault with full BOM, schematics, and assembly guides", color: "#f97316" },
               { icon: "📦", title: "Full BOM & Sourcing", desc: "Exact part numbers, specs, and verified supplier links for every component", color: "#06b6d4" },
               { icon: "🎬", title: "Build Videos & Documentation", desc: "Step-by-step videos and technical schematics for hands-on assembly", color: "#a855f7" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center"
                style={{ borderTopColor: item.color, borderTopWidth: 3 }}>
                <span className="text-4xl block mb-3">{item.icon}</span>
                <p className="text-white font-black text-base mb-2" style={{ color: item.color }}>{item.title}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
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
          <h2 className="text-3xl font-black mb-3">Ready to Build?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Join and get instant access to every build plan, BOM, sourcing guide, and build video in the vault.
          </p>
          <button
            onClick={handleCheckout}
            className="px-12 py-4 rounded-xl font-black text-xl text-white transition-all hover:opacity-90 shadow-lg"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 4px 24px rgba(139,92,246,0.4)" }}
          >
            Join Now — ${annualTotal}/year →
          </button>
          <p className="text-gray-600 text-xs mt-4">🔒 Secured by Stripe · Annual billing · Instant access</p>
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
  );
}