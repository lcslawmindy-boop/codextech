import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Zap, Shield, BookOpen, Download, Users, Star, Lock, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const PRODUCTS = [
  {
    id: "pdf_bundle",
    name: "Invention Build Plans Bundle",
    price: 197,
    type: "one_time",
    badge: null,
    tagline: "Everything you need to replicate the devices",
    description: "Complete PDF library: 5 full invention build plans with bill of materials, assembly steps, specs, and theoretical basis.",
    features: [
      "MEG — Motionless Electromagnetic Generator (US Patent 6,362,718)",
      "TRD-1 — Telomere Regeneration Device (MCCS Protocol)",
      "G-Com Mk I — Scalar Wave Communicator",
      "Portable Prioré-Class EM Therapy System",
      "TRZ-1 — Cold Fusion Reactor (73-sigma validated)",
      "Full Bill of Materials for each device",
      "Step-by-step assembly guides",
      "Theoretical basis & primary source citations",
      "Lifetime access — yours to download",
    ],
    cta: "Buy Now — $197",
    color: "#f59e0b",
  },
  {
    id: "membership",
    name: "Research Membership",
    price: 29,
    type: "subscription",
    badge: "MOST POPULAR",
    tagline: "Full platform access + new research monthly",
    description: "Unlimited access to the complete Zenith Apex platform — all tools, simulations, patent generators, and new content each month.",
    features: [
      "Full access to Invention Library (14 devices)",
      "AI Patent Drafting Tool — unlimited use",
      "AI Invention Forge — generate new devices",
      "Prior Art Archive (200+ entries)",
      "Scalar EM simulators & lab tools",
      "Investor CRM & pitch deck builder",
      "IP Valuation calculator",
      "New research modules added monthly",
      "Cancel anytime",
    ],
    cta: "Start Membership — $29/mo",
    color: "#6366f1",
  },
  {
    id: "course_bundle",
    name: "Complete Course Library",
    price: 497,
    type: "one_time",
    badge: "BEST VALUE",
    tagline: "10 courses. No physics PhD required.",
    description: "Every course in the catalog — scalar EM fundamentals, patent strategy, bioelectromagnetics, investor presentation skills, and more.",
    features: [
      "10 professionally structured courses",
      "Scalar Electromagnetics Fundamentals",
      "MEG Replication Workshop",
      "Prioré Device: History & Replication",
      "USPTO Patent Strategy for Frontier Tech",
      "Bioelectromagnetics & Healing Devices",
      "Psychoenergetics & Consciousness",
      "EMF Protection: Science & Practice",
      "Advanced Investor Presentation Skills",
      "Time-Reversal Zone Physics",
      "Lifetime access",
    ],
    cta: "Buy All Courses — $497",
    color: "#22c55e",
  },
];

const TESTIMONIALS = [
  { name: "D.R.", role: "Independent Researcher", text: "The patent drafting tool alone saved me $3,000 in attorney fees. The prior art archive is unlike anything publicly available." },
  { name: "M.K.", role: "Alternative Energy Investor", text: "I've been researching Bearden's work for 15 years. This platform is the most organized and useful resource I've found." },
  { name: "J.T.", role: "Bioelectromagnetics Practitioner", text: "The Prioré device documentation and the TRD-1 build plans are worth 10× the membership fee alone." },
];

function CheckoutButton({ product, loading, onCheckout }) {
  return (
    <button
      onClick={() => onCheckout(product)}
      disabled={loading === product.id}
      className="w-full py-3.5 rounded-xl font-black text-sm transition-all disabled:opacity-60"
      style={{
        backgroundColor: product.color,
        color: "#0a0a0a",
        boxShadow: `0 4px 24px ${product.color}40`,
      }}
    >
      {loading === product.id ? "Redirecting to checkout…" : product.cta}
    </button>
  );
}

export default function Pricing() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCheckout = async (product) => {
    // Block if in iframe
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRODUCTS.map(product => (
            <div
              key={product.id}
              className={`relative bg-gray-900 rounded-2xl border overflow-hidden flex flex-col ${
                product.badge === "MOST POPULAR" ? "border-indigo-600 shadow-lg shadow-indigo-900/30" : "border-gray-800"
              }`}
            >
              {product.badge && (
                <div
                  className="text-center py-2 text-xs font-black tracking-widest"
                  style={{ backgroundColor: product.color + "25", color: product.color }}
                >
                  {product.badge}
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                <div className="mb-5">
                  <h3 className="text-white font-black text-xl mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{product.tagline}</p>

                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-black" style={{ color: product.color }}>${product.price}</span>
                    <span className="text-gray-500 text-sm mb-1.5">
                      {product.type === "subscription" ? "/month" : " one-time"}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs">
                    {product.type === "subscription" ? "Cancel anytime. No contracts." : "Lifetime access. Download immediately."}
                  </p>
                </div>

                <div className="space-y-2.5 mb-6 flex-1">
                  {product.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: product.color }} />
                      <span className="text-gray-300 text-xs leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>

                <CheckoutButton product={product} loading={loading} onCheckout={handleCheckout} />

                {product.type === "subscription" && (
                  <p className="text-center text-gray-600 text-xs mt-3">First month — cancel before renewal for $0 charge</p>
                )}
              </div>
            </div>
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
      <div className="border-t border-yellow-900/40 bg-yellow-950/20 px-5 py-12 text-center">
        <h3 className="text-white font-black text-2xl mb-3">Ready to access 40 years of suppressed research?</h3>
        <p className="text-gray-400 text-sm mb-6">Start with the $29/month membership — cancel anytime.</p>
        <button
          onClick={() => handleCheckout(PRODUCTS[1])}
          disabled={loading === "membership"}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-base transition-all disabled:opacity-60"
        >
          {loading === "membership" ? "Redirecting…" : "Start Research Membership — $29/mo"}
          <ChevronRight size={16} />
        </button>
        <p className="text-gray-600 text-xs mt-3">🔒 Secured by Stripe · Cancel anytime</p>
      </div>
    </div>
  );
}