import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Loader2, Lock, Sparkles, Zap, BookOpen, FlaskConical } from "lucide-react";
import { base44 } from "@/api/base44Client";

const FEATURES = [
  { icon: <Sparkles size={15} className="text-indigo-400" />, text: "AI cluster summaries & research abstracts" },
  { icon: <Zap size={15} className="text-yellow-400" />, text: "Full concept network with all 40+ nodes" },
  { icon: <BookOpen size={15} className="text-blue-400" />, text: "Pitch builder & investor deck generation" },
  { icon: <FlaskConical size={15} className="text-purple-400" />, text: "Google Slides market deck automation" },
  { icon: <CheckCircle2 size={15} className="text-green-400" />, text: "Diagnostics engine & research gap analysis" },
  { icon: <Lock size={15} className="text-red-400" />, text: "Confidential — NDA-gated access only" },
];

export default function Subscribe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    // Block if in iframe
    if (window.self !== window.top) {
      alert("Checkout only works from the published app. Please open the app in a full browser tab.");
      return;
    }

    setLoading(true);
    setError(null);

    const origin = window.location.origin;
    const res = await base44.functions.invoke("createCheckoutSession", {
      successUrl: `${origin}/subscribe?success=true`,
      cancelUrl: `${origin}/subscribe`,
      mode: "subscription",
      title: "Premium Research Access",
      description: "Full access to the Bearden Concept Network — cancel anytime",
      priceInCents: 2900,
      interval: "month",
    });

    if (res.data?.url) {
      window.location.href = res.data.url;
    } else {
      setError(res.data?.error || "Failed to start checkout. Please try again.");
      setLoading(false);
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  const isSuccess = urlParams.get("success") === "true";

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back nav */}
        <div className="mb-6">
          <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm transition-colors">
            <ArrowLeft size={14} /> Back to Network
          </Link>
        </div>

        {isSuccess ? (
          <div className="bg-gray-900 border border-green-800 rounded-2xl p-8 text-center">
            <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
            <h1 className="text-white font-bold text-2xl mb-2">Subscription Active!</h1>
            <p className="text-gray-400 text-sm mb-6">
              Welcome to Premium Research Access. Your account has been upgraded.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-700 hover:bg-green-600 text-white font-semibold text-sm transition-colors"
            >
              Enter the Network →
            </Link>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-950 to-gray-900 px-8 py-8 border-b border-gray-700 text-center">
              <div className="text-4xl mb-3">🔬</div>
              <h1 className="text-white font-bold text-2xl mb-1">Premium Research Access</h1>
              <p className="text-gray-400 text-sm">Full access to the Bearden Concept Network</p>
              <div className="mt-5 flex items-end justify-center gap-1">
                <span className="text-white font-bold text-4xl">$29</span>
                <span className="text-gray-400 text-sm mb-1.5">/month</span>
              </div>
              <p className="text-gray-600 text-xs mt-1">Cancel anytime</p>
            </div>

            {/* Features */}
            <div className="px-8 py-6 space-y-3">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex-shrink-0">{f.icon}</span>
                  <span className="text-gray-300 text-sm">{f.text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="px-8 pb-8">
              {error && (
                <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
              )}
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-base transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                {loading ? "Redirecting to Stripe…" : "Buy Now — $29/mo"}
              </button>
              <p className="text-gray-600 text-xs text-center mt-3">
                Secured by Stripe · Cancel anytime
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}