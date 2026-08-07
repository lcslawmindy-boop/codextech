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
        <div className="w-14 h-14 rounded-xl bg-red-900/60 border border-red-700 flex items-center justify-center flex-shrink-0">
          <ShoppingCart size={24} className="text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-black text-lg mb-1">Component List</h3>
          <p className="text-gray-400 text-sm mb-5">
            All {components.length} components listed for research reference. Build plans are not for sale — available to research members only.
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

          {/* Classification */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs mb-1">Classification</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-red-400">Not for Sale</span>
                <span className="text-gray-600 text-sm">Research Members Only</span>
              </div>
            </div>
            <span className="px-6 py-3 rounded-xl bg-red-950/40 border border-red-800 text-red-400 font-black text-sm">
              Research Only
            </span>
          </div>

          <p className="text-gray-600 text-xs mt-3">
            💡 Build plans are available through a <span className="text-indigo-400 font-bold">research membership</span> — not sold individually.
          </p>
        </div>
      </div>
    </div>
  );
}