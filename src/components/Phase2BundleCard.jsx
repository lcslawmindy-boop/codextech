import { useState } from "react";
import { Lock, ShoppingCart, Loader2, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Phase2BundleCard({ bundle }) {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCheckout = async () => {
    if (window.self !== window.top) {
      alert("Checkout works best on the published app. Please visit the full website to complete your purchase.");
      return;
    }
    setLoading(true);
    try {
      const res = await base44.functions.invoke("createCheckoutSession", {
        title: bundle.title,
        priceInCents: bundle.priceInCents,
        description: bundle.teaser,
        category: "Engineering",
        successUrl: window.location.origin + "/advanced-engineering-bundle?success=1",
        cancelUrl: window.location.href,
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col hover:border-gray-600 transition-all">
      {/* Photo */}
      <div className="relative h-44 overflow-hidden">
        <img src={bundle.img} alt={bundle.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full border text-xs font-black ${bundle.badgeColor}`}>
          {bundle.badge}
        </span>
        <span className="absolute bottom-3 right-3 text-white font-black text-xl">{bundle.price}</span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h4 className="text-white font-black text-base mb-2">{bundle.title}</h4>
        <p className="text-gray-400 text-xs leading-relaxed mb-4">{bundle.teaser}</p>

        {/* Visible teaser items */}
        <div className="space-y-1.5 mb-4">
          {bundle.teaserItems.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0 mt-1.5" />
              <p className="text-gray-300 text-xs">{item}</p>
            </div>
          ))}
        </div>

        {/* Blurred locked items */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 mb-3 transition-colors"
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? "Hide" : "Show"} what's locked ({bundle.lockedItems.length} items)
        </button>

        {expanded && (
          <div className="relative rounded-xl overflow-hidden mb-4">
            <div className="blur-sm opacity-40 pointer-events-none select-none bg-gray-800/50 rounded-xl p-3 space-y-1.5">
              {bundle.lockedItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 size={11} className="text-green-400 flex-shrink-0" />
                  <p className="text-gray-300 text-xs">{item}</p>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-950/80 border border-gray-700 text-gray-400 text-xs font-bold">
                <Lock size={10} /> Unlocks after purchase
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 text-white font-black text-sm transition-all"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
          {loading ? "Processing…" : `Access Now — ${bundle.price}`}
        </button>
        <p className="text-gray-700 text-xs text-center mt-2">One-time · Instant access · Lifetime updates</p>
      </div>
    </div>
  );
}