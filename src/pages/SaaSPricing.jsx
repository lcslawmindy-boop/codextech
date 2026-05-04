import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const FEATURES = [
  "Full research database (40+ patents analyzed)",
  "8 structured research modules (80+ hours)",
  "AI Patent Drafting Tool",
  "Prior Art Archive (200+ entries)",
  "Scalar EM Lab Simulator",
  "Patent Claims Generator",
  "IP Marketplace access",
  "Monthly research updates",
  "Community forum access",
  "Email support",
  "Buy courses at 20-30% discount",
];

const FAQS = [
  { q: "What's in the research database?", a: "40+ US patents with full prosecution history, 200+ peer-reviewed publications, and engineering specs for each system. Every entry is traceable to a primary source — no speculation." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel anytime from your account page. Access continues until the end of your billing period. No contracts, no penalties." },
  { q: "What are the build plans?", a: "Step-by-step engineering documentation for devices like the MEG, Prioré chamber, and scalar transmitter. Includes BOM, assembly procedures, measurement protocols, and source citations." },
  { q: "Is this research verified?", a: "Every source is primary — US patents cross-referenced against USPTO, publications verified against journal archives, government documents from official channels. We cite everything." },
  { q: "Do I need an engineering background?", a: "Some technical knowledge helps, but the modules are structured to build understanding from the ground up. Beginners start with the Scalar EM primer and MEG module." },
];

export default function SaaSPricing() {
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleCheckout = async () => {
    if (window.self !== window.top) {
      alert("Checkout only works from the published app.");
      return;
    }
    setLoading(true);
    const origin = window.location.origin;
    const res = await base44.functions.invoke("createCheckoutSession", {
      title: "Research Membership",
          priceInCents: 8900,
          mode: "subscription",
      interval: "month",
      successUrl: `${origin}/post-purchase`,
      cancelUrl: `${origin}/pricing`,
    });
    if (res.data?.url) {
      window.location.href = res.data.url;
    } else {
      alert("Checkout failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-40 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png" alt="ZARP" className="h-8 w-8 object-contain" />
            <span className="font-black text-white hidden sm:block">Zenith Apex Technology</span>
          </Link>
          <Link to="/member-dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">Dashboard</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-xs font-black mb-5 uppercase tracking-widest">
            Research Membership
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            One Plan.<br />Everything Included.
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Full access to the electromagnetic research database, build plans, patent tools, and IP marketplace. Cancel anytime.
          </p>
        </div>

        {/* Pricing card */}
        <div className="max-w-md mx-auto mb-14">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-cyan-700 rounded-3xl p-8 shadow-[0_0_60px_rgba(6,182,212,0.15)]">
            <div className="text-center mb-8">
              <p className="text-gray-400 text-sm mb-2">Research Membership</p>
              <div className="flex items-end justify-center gap-2 mb-1">
                <span className="text-6xl font-black text-white">$89</span>
                <span className="text-gray-400 pb-2">/month</span>
              </div>
              <p className="text-gray-500 text-sm">Cancel anytime · Instant access</p>
            </div>

            <div className="space-y-3 mb-8">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={15} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 rounded-xl font-black text-white text-base disabled:opacity-50 transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(90deg, #00ccff, #00ff99)", boxShadow: "0 4px 24px rgba(0,200,255,0.35)" }}
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : <>Start Membership — $89/mo <ArrowRight size={16} /></>}
            </button>
            <p className="text-center text-gray-600 text-xs mt-3">Secured by Stripe · Cancel anytime</p>
          </div>

          {/* Trust signals */}
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            {[
              { val: "40+", label: "Patents" },
              { val: "200+", label: "Sources" },
              { val: "8", label: "Modules" },
            ].map((s, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                <p className="text-cyan-400 font-black text-lg">{s.val}</p>
                <p className="text-gray-500 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-6">Questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-800/60 transition-colors"
                >
                  <span className="font-bold text-sm text-white">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={15} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={15} className="text-gray-500 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed border-t border-gray-800">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-12 text-center text-gray-700 text-xs space-x-4">
          <Link to="/terms" className="hover:text-gray-400">Terms</Link>
          <Link to="/refund-policy" className="hover:text-gray-400">Refund Policy</Link>
          <Link to="/research-disclaimer" className="hover:text-gray-400">Research Disclaimer</Link>
        </div>
      </div>
    </div>
  );
}