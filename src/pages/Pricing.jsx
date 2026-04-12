import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Zap, Shield, BookOpen, Download, Users, Star, Lock, ChevronRight, Sparkles, FlaskConical, Briefcase } from "lucide-react";
import { base44 } from "@/api/base44Client";

const PLANS = [
  {
    id: "free",
    name: "Free Preview",
    price: 0,
    priceSuffix: "",
    badge: null,
    tagline: "Explore before you commit",
    color: "#6b7280",
    cta: "Current Plan",
    ctaLink: true,
    features: [
      "Access to 1 Invention Build Plan",
      "Access to 1 Course module",
      "Concept Knowledge Graph",
      "Prior Art Archive (read-only)",
      "Newsletter & Research Updates",
    ],
    locked: ["AI Invention Forge", "Patent Drafting Tool", "Investor CRM", "Full Invention Library"],
  },
  {
    id: "starter",
    name: "Starter",
    price: 47,
    type: "one_time",
    priceSuffix: " one-time",
    badge: null,
    tagline: "Inventions + foundational courses",
    color: "#f59e0b",
    cta: "Buy Starter — $47",
    features: [
      "5 Invention Build Plans (full PDF)",
      "4 Courses with full curriculum",
      "Bill of Materials for each device",
      "Step-by-step assembly guides",
      "Prior Art Archive access",
      "Lifetime access to purchased content",
    ],
    locked: ["AI Invention Forge", "Patent Drafting Tool", "Investor CRM"],
  },
  {
    id: "researcher",
    name: "Researcher",
    price: 97,
    type: "subscription",
    priceSuffix: "/mo",
    badge: "MOST POPULAR",
    tagline: "Full invention & course library",
    color: "#6366f1",
    cta: "Start Researcher — $97/mo",
    features: [
      "All 21 Invention Build Plans",
      "All courses + new content monthly",
      "AI Invention Forge — unlimited",
      "Scalar EM simulators & lab tools",
      "Prior Art Archive (200+ entries)",
      "Build Video generator",
      "Cancel anytime",
    ],
    locked: ["Patent Drafting Tool", "Investor CRM", "Acquisition CRM"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 247,
    type: "subscription",
    priceSuffix: "/mo",
    badge: "FULL ACCESS",
    tagline: "Everything — IP tools + investor suite",
    color: "#22c55e",
    cta: "Go Pro — $247/mo",
    features: [
      "Everything in Researcher",
      "AI Patent Drafting Tool — unlimited",
      "Investor CRM & Pitch Deck Builder",
      "IP Valuation Calculator",
      "Acquisition CRM",
      "VDR Portal (Virtual Data Room)",
      "Priority admin support",
      "Cancel anytime",
    ],
    locked: [],
  },
];

const TESTIMONIALS = [
  { name: "D.R.", role: "Independent Researcher", text: "The patent drafting tool alone saved me $3,000 in attorney fees. The prior art archive is unlike anything publicly available." },
  { name: "M.K.", role: "Alternative Energy Investor", text: "I've been researching Bearden's work for 15 years. This platform is the most organized and useful resource I've found." },
  { name: "J.T.", role: "Bioelectromagnetics Practitioner", text: "The Prioré device documentation and the TRD-1 build plans are worth 10× the membership fee alone." },
];

function PlanCard({ plan, loading, onCheckout }) {
  const isPopular = plan.badge === "MOST POPULAR";
  const isFull = plan.badge === "FULL ACCESS";
  return (
    <div className={`relative bg-gray-900 rounded-2xl border overflow-hidden flex flex-col ${
      isPopular ? "border-indigo-600 shadow-xl shadow-indigo-900/20" :
      isFull ? "border-green-700 shadow-xl shadow-green-900/20" : "border-gray-800"
    }`}>
      {plan.badge && (
        <div className="text-center py-2 text-xs font-black tracking-widest"
          style={{ backgroundColor: plan.color + "25", color: plan.color }}>
          {plan.badge}
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-white font-black text-xl mb-1">{plan.name}</h3>
        <p className="text-gray-500 text-sm mb-4">{plan.tagline}</p>
        <div className="flex items-end gap-1 mb-1">
          <span className="text-4xl font-black" style={{ color: plan.color }}>
            {plan.price === 0 ? "Free" : `$${plan.price}`}
          </span>
          {plan.price > 0 && <span className="text-gray-500 text-sm mb-1.5">{plan.priceSuffix}</span>}
        </div>
        <p className="text-gray-600 text-xs mb-5">
          {plan.price === 0 ? "No credit card required" :
            plan.type === "subscription" ? "Cancel anytime." : "Lifetime access. One payment."}
        </p>

        <div className="space-y-2 mb-4 flex-1">
          {plan.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <Check size={12} className="flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
              <span className="text-gray-300 text-xs leading-relaxed">{f}</span>
            </div>
          ))}
          {plan.locked.map((f, i) => (
            <div key={i} className="flex items-start gap-2 opacity-40">
              <Lock size={12} className="flex-shrink-0 mt-0.5 text-gray-600" />
              <span className="text-gray-600 text-xs line-through">{f}</span>
            </div>
          ))}
        </div>

        {plan.ctaLink ? (
          <Link to="/" className="w-full py-3 rounded-xl font-black text-sm text-center block border border-gray-700 text-gray-400">
            Explore Free →
          </Link>
        ) : (
          <button onClick={() => onCheckout(plan)} disabled={loading === plan.id}
            className="w-full py-3 rounded-xl font-black text-sm transition-all disabled:opacity-60"
            style={{ backgroundColor: plan.color, color: plan.color === "#6b7280" ? "#fff" : "#0a0a0a",
              boxShadow: `0 4px 20px ${plan.color}40` }}>
            {loading === plan.id ? "Redirecting…" : plan.cta}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Pricing() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const handleCheckout = async (product) => {
    if (window !== window.top) {
      alert("Checkout only works from the published app. Please open the app directly.");
      return;
    }

    setLoading(product.id);
    setError(null);

    const baseUrl = window.location.origin;

    const response = await base44.functions.invoke("createCheckoutSession", {
      title: product.name,
      priceInCents: product.price * 100,
      description: product.tagline,
      category: product.type === "subscription" ? "membership" : "one_time",
      mode: product.type,
      interval: product.type === "subscription" ? "month" : null,
      successUrl: `${baseUrl}/checkout?success=true&product=${product.id}`,
      cancelUrl: `${baseUrl}/pricing`,
    });

    if (response.data?.url) {
      window.location.href = response.data.url;
    } else {
      setError("Could not start checkout. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-5 py-4 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <h1 className="text-white font-black text-lg">Zenith Apex — Plans & Pricing</h1>
      </div>

      {/* Hero */}
      <div className="text-center px-5 py-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-900/40 border border-yellow-800 text-yellow-400 text-xs font-bold mb-6">
          <Star size={12} /> The world's only structured Bearden research platform
        </div>
        <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">
          Access Suppressed Physics<br />
          <span className="text-yellow-400">Research That Actually Works</span>
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed mb-4">
          No physics PhD required. Get the organized research, build plans, and patent tools that researchers, inventors, and investors have been searching for.
        </p>
        <p className="text-gray-600 text-sm">🔒 Secure checkout via Stripe · Instant access · Cancel anytime</p>
      </div>

      {/* Pricing cards */}
      <div className="px-5 pb-12 max-w-6xl mx-auto">
        {error && (
          <div className="bg-red-950/60 border border-red-800 rounded-xl p-4 mb-6 text-red-300 text-sm text-center">{error}</div>
        )}
        {/* Comparison hint */}
        <div className="flex items-center justify-center gap-6 mb-8 text-xs text-gray-500 flex-wrap">
          {[
            { icon: <BookOpen size={12} />, label: "Courses" },
            { icon: <Sparkles size={12} />, label: "AI Tools" },
            { icon: <FlaskConical size={12} />, label: "Build Plans" },
            { icon: <Briefcase size={12} />, label: "Investor Suite" },
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">{item.icon} {item.label}</span>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {PLANS.map(plan => (
            <PlanCard key={plan.id} plan={plan} loading={loading} onCheckout={handleCheckout} />
          ))}
        </div>
      </div>

      {/* What you get section */}
      <div className="border-t border-gray-800 bg-gray-900/40 px-5 py-14">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-white font-black text-2xl text-center mb-10">What Makes This Different</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield size={22} className="text-yellow-400" />, title: "Primary Sources Only", desc: "Every claim traced to government documents, patents, or peer-reviewed papers. No speculation." },
              { icon: <Download size={22} className="text-green-400" />, title: "Actionable Build Plans", desc: "Real BOMs, specs, and assembly steps — not just theory. Replicate these devices yourself." },
              { icon: <BookOpen size={22} className="text-indigo-400" />, title: "No PhD Required", desc: "Complex concepts explained plainly. You're the researcher — we organized 40 years of work." },
              { icon: <Zap size={22} className="text-purple-400" />, title: "AI-Powered Tools", desc: "Generate patents, pitch decks, valuations, and invention blueprints in minutes with AI." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-3">{item.icon}</div>
                <h4 className="text-white font-bold text-sm mb-2">{item.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="px-5 py-14 max-w-5xl mx-auto">
        <h3 className="text-white font-black text-2xl text-center mb-8">What Researchers Are Saying</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, s) => <Star key={s} size={12} className="text-yellow-500 fill-yellow-500" />)}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div>
                <p className="text-white font-bold text-sm">{t.name}</p>
                <p className="text-gray-500 text-xs">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="border-t border-gray-800 bg-gray-900/40 px-5 py-14">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-white font-black text-2xl text-center mb-8">Common Questions</h3>
          <div className="space-y-4">
            {[
              { q: "Do I need a physics background?", a: "No. The platform is designed for curious researchers, entrepreneurs, and investors — not physicists. Everything is explained with clear language and primary source references." },
              { q: "What format are the build plans?", a: "Downloadable PDFs with full Bill of Materials, assembly steps, operating parameters, safety notes, and theoretical basis with citations. Immediately accessible after purchase." },
              { q: "Can I cancel the membership?", a: "Yes, anytime. Log in, go to your account settings, and cancel before your next billing date. No questions asked." },
              { q: "Is this legal content?", a: "Yes. All content is derived from publicly available patents (USPTO), declassified government documents, peer-reviewed papers, and published books. We organize and analyze public information." },
              { q: "How is payment handled?", a: "Securely through Stripe — the same payment processor used by Amazon, Google, and millions of businesses. We never see or store your card details." },
            ].map((faq, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-white font-bold text-sm mb-1.5">{faq.q}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="border-t border-indigo-900/40 bg-indigo-950/10 px-5 py-12 text-center">
        <h3 className="text-white font-black text-2xl mb-3">Ready to access 40 years of suppressed research?</h3>
        <p className="text-gray-400 text-sm mb-6">Start with Researcher at $97/mo — cancel anytime.</p>
        <button
          onClick={() => handleCheckout(PLANS[2])}
          disabled={loading === "researcher"}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-base transition-all disabled:opacity-60"
        >
          {loading === "researcher" ? "Redirecting…" : "Start Researcher Plan — $97/mo"}
          <ChevronRight size={16} />
        </button>
        <p className="text-gray-600 text-xs mt-3">🔒 Secured by Stripe · Cancel anytime</p>
      </div>
    </div>
  );
}