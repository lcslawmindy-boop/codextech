import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const FEATURES = [
  "Full research database — 40+ patents analyzed",
  "8 structured research modules (80+ hours)",
  "Complete BOM & engineering specifications",
  "AI Patent Drafting Tool (USPTO-compliant)",
  "Prior Art Archive — 200+ entries",
  "Scalar EM Lab Simulator",
  "Patent Claims Generator",
  "IP Marketplace access",
  "Anonymous inventor/investor profiles",
  "Monthly research updates",
  "Community forum access",
  "Email support",
];

export default function PricingComparison() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (window.self !== window.top) {
      alert("Checkout only works from the published app.");
      return;
    }
    setLoading(true);
    const origin = window.location.origin;
    const res = await base44.functions.invoke("createCheckoutSession", {
      title: "Research Membership",
      priceInCents: 4900,
      mode: "subscription",
      interval: "month",
      successUrl: `${origin}/member-dashboard?welcome=1`,
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
    <div id="pricing" className="py-20 border-t border-white/10 solid-section">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-4">Research Membership</p>
        <h2 className="text-4xl font-black text-white mb-3">One Plan. Everything Included.</h2>
        <p className="text-gray-400 text-base mb-12 max-w-xl mx-auto">
          No tiers. No hidden upgrades. Full access to the entire platform at $49/month.
        </p>

        <div
          className="rounded-3xl p-8 mb-8 mx-auto max-w-md"
          style={{
            background: "rgba(5,15,30,0.9)",
            border: "2px solid rgba(0,200,255,0.5)",
            boxShadow: "0 0 60px rgba(0,200,255,0.12)",
          }}
        >
          <p className="text-gray-400 text-sm mb-3">Research Membership</p>
          <div className="flex items-end justify-center gap-2 mb-2">
            <span className="text-6xl font-black text-white">$49</span>
            <span className="text-gray-400 pb-2 text-lg">/month</span>
          </div>
          <p className="text-gray-600 text-sm mb-8">Cancel anytime · Instant access</p>

          <div className="text-left space-y-2.5 mb-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 rounded-xl font-black text-base text-black disabled:opacity-50 transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(90deg, #00ccff, #00ff99)", boxShadow: "0 4px 24px rgba(0,200,255,0.3)" }}
          >
            {loading
              ? <><Loader2 size={18} className="animate-spin" /> Processing...</>
              : <>Start for $49/month <ArrowRight size={16} /></>}
          </button>
          <p className="text-gray-700 text-xs mt-3">Secured by Stripe · No contracts</p>
        </div>

        <Link to="/free-vault" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
          Preview free content first →
        </Link>
      </div>
    </div>
  );
}