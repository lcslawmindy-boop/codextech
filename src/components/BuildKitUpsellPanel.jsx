import { useState } from "react";
import { ShoppingCart, Zap, Check, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function BuildKitUpsellPanel({ buildTitle, kitPrice = 287, components = [] }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (window !== window.top) {
      alert("Checkout only works from the published app. Please open the app directly.");
      return;
    }

    setLoading(true);
    const baseUrl = window.location.origin;
    
    try {
      const response = await base44.functions.invoke("createCheckoutSession", {
        title: `${buildTitle} Component Kit`,
        priceInCents: kitPrice * 100,
        description: `Complete component kit for ${buildTitle} — pre-sourced parts, verified suppliers, ready to ship.`,
        category: "kit",
        mode: "payment",
        successUrl: `${baseUrl}/checkout?success=true&product=kit`,
        cancelUrl: window.location.href,
        customerEmail: null,
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-950/30 to-yellow-950/30 border border-orange-800/40 rounded-2xl p-8 mb-8">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-orange-900/60 border border-orange-700 flex items-center justify-center flex-shrink-0">
          <ShoppingCart size={24} className="text-orange-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-black text-lg mb-1">Buy the Complete Kit</h3>
          <p className="text-gray-400 text-sm mb-5">
            Skip the sourcing. All {components.length} components pre-verified and ready to ship.
          </p>

          {/* Component summary */}
          <div className="mb-5">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-3">What's Included</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {components.length > 0 ? (
                components.map((comp, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs bg-gray-900/50 border border-gray-800 rounded-lg p-2.5">
                    <Check size={12} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{comp}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 md:col-span-3 text-gray-500 text-xs italic">
                  {buildTitle} — all parts included
                </div>
              )}
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs mb-1">Kit Price</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-orange-400">${kitPrice}</span>
                <span className="text-gray-600 text-sm">Ships in 2–3 days</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-black flex items-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Checking out...
                </>
              ) : (
                <>
                  <Zap size={16} /> Buy Kit
                </>
              )}
            </button>
          </div>

          <p className="text-gray-600 text-xs mt-3">
            💡 Or upgrade to <span className="text-indigo-400 font-bold">Pro membership ($99/mo)</span> for unlimited builds + kits at 50% off.
          </p>
        </div>
      </div>
    </div>
  );
}