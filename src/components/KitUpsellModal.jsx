/**
 * KitUpsellModal — fires after purchase OR after a user views a build plan 3+ times.
 * Props:
 *   trigger: "post_purchase" | "build_view" | "upgrade"
 *   primaryKit: product object (optional — defaults to MEG)
 *   onDismiss: fn
 *   onBuy: fn(kit)
 */
import { useState } from "react";
import { X, ShoppingCart, Zap, Check, Clock, ArrowRight, Star } from "lucide-react";
import { base44 } from "@/api/base44Client";

const KITS = {
  meg: {
    id: "meg-kit",
    priceId: "price_1TLZbkBkbCWuj2nHbZsdfLfZ",
    name: "MEG Replication Parts Kit",
    price: 287,
    originalPrice: 340,
    badge: "Best Seller",
    badgeColor: "#f59e0b",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png",
    hook: "You have the build plan. Get the parts delivered — no hunting 12 suppliers.",
    bullets: ["23 pre-matched components", "Lab-verified against MEG patent spec", "Ships in 5–7 days (free US)"],
    crossSell: "scalar-lab",
  },
  "scalar-lab": {
    id: "scalar-lab",
    priceId: "price_1TLZbkBkbCWuj2nHGIfKzCip",
    name: "Scalar EM Lab Starter Kit",
    price: 167,
    originalPrice: 210,
    badge: "Essential",
    badgeColor: "#3b82f6",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc3cb2842_generated_image.png",
    hook: "Every build needs a bench. This kit replaces 6 separate orders.",
    bullets: ["DDS function generator included", "Breadboard + full assortment", "Ships in 3–5 days (free US)"],
    crossSell: "tool-kit",
  },
  "tool-kit": {
    id: "tool-kit",
    priceId: "price_1TLZbkBkbCWuj2nHgc52Ozlz",
    name: "Advanced EM Assembly Tool Kit",
    price: 127,
    originalPrice: 165,
    badge: "Must Have",
    badgeColor: "#f97316",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0fed0468f_generated_image.png",
    hook: "Precision tools matter. Build plans assume you have these.",
    bullets: ["Temp-controlled soldering station", "Digital multimeter included", "Ships in 2–4 days (free US)"],
    crossSell: "meg",
  },
};

const TRIGGERS = {
  post_purchase: {
    headline: "One More Thing — Don't Start Without This",
    sub: "You just unlocked the build plan. Here's what most members order next:",
    urgency: "Add it now — checkout is still open",
    color: "#22c55e",
  },
  build_view: {
    headline: "You've Viewed This 3 Times — You're Ready to Build",
    sub: "The parts kit pairs directly with this build plan. Everything sourced, tested, bundled.",
    urgency: "73 members ordered this kit this month",
    color: "#8b5cf6",
  },
  upgrade: {
    headline: "Pro Members Get 50% Off Kits",
    sub: "Upgrade to Pro and immediately save on your first kit order.",
    urgency: "Upgrade + kit bundle — best value in the shop",
    color: "#f59e0b",
  },
};

export default function KitUpsellModal({ trigger = "build_view", kitId = "meg", onDismiss, onBuy }) {
  const kit = KITS[kitId] || KITS.meg;
  const crossKit = KITS[kit.crossSell];
  const triggerMeta = TRIGGERS[trigger] || TRIGGERS.build_view;
  const [buying, setBuying] = useState(null);
  const [bundleMode, setBundleMode] = useState(false);

  const bundlePrice = kit.price + (crossKit?.price || 0) - 30; // $30 bundle discount
  const bundleSavings = (kit.originalPrice + (crossKit?.originalPrice || 0)) - bundlePrice;

  const handleBuy = async (selectedKit, isBundle) => {
    if (window !== window.top) {
      alert("Checkout only works from the published app.");
      return;
    }
    setBuying(isBundle ? "bundle" : selectedKit.id);
    if (onBuy) { onBuy(selectedKit); return; }
    const res = await base44.functions.invoke("createCheckoutSession", {
      priceId: selectedKit.priceId,
      productName: selectedKit.name,
      successUrl: window.location.origin + "/build-supplies-shop?success=1",
      cancelUrl: window.location.href,
    });
    if (res.data?.url) window.location.href = res.data.url;
    else setBuying(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">

        {/* Color bar */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${triggerMeta.color}, transparent)` }} />

        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={13} style={{ color: triggerMeta.color }} />
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: triggerMeta.color }}>
                {triggerMeta.urgency}
              </span>
            </div>
            <h3 className="text-white font-black text-lg leading-snug">{triggerMeta.headline}</h3>
            <p className="text-gray-400 text-sm mt-0.5">{triggerMeta.sub}</p>
          </div>
          <button onClick={onDismiss} className="text-gray-600 hover:text-gray-300 transition-colors flex-shrink-0 ml-3">
            <X size={18} />
          </button>
        </div>

        {/* Main kit */}
        <div className="mx-5 mb-3 bg-gray-800 border border-gray-700 rounded-xl p-4 flex gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img src={kit.img} alt={kit.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${kit.badgeColor}20`, color: kit.badgeColor }}>
                {kit.badge}
              </span>
            </div>
            <h4 className="text-white font-bold text-sm leading-snug mb-1">{kit.name}</h4>
            <p className="text-gray-400 text-xs italic mb-2">{kit.hook}</p>
            <div className="space-y-0.5">
              {kit.bullets.map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-300">
                  <Check size={10} className="text-green-400 flex-shrink-0" /> {b}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-gray-500 line-through text-xs">${kit.originalPrice}</p>
            <p className="text-white font-black text-xl">${kit.price}</p>
            <p className="text-green-400 text-xs font-bold">Save ${kit.originalPrice - kit.price}</p>
          </div>
        </div>

        {/* Bundle toggle — psychological anchor */}
        {crossKit && (
          <div className="mx-5 mb-4">
            <button onClick={() => setBundleMode(b => !b)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                bundleMode
                  ? "bg-purple-950/40 border-purple-600"
                  : "bg-gray-800/50 border-gray-700 hover:border-gray-500"
              }`}>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded flex items-center justify-center border ${bundleMode ? "bg-purple-600 border-purple-600" : "border-gray-600"}`}>
                  {bundleMode && <Check size={10} className="text-white" />}
                </div>
                <div>
                  <p className="text-white text-xs font-black">+ Add {crossKit.name} (Bundle & Save)</p>
                  <p className="text-gray-500 text-xs">Normally ${crossKit.price} — save $30 when bundled</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                {bundleMode ? (
                  <span className="text-purple-300 text-xs font-black">${bundlePrice} total</span>
                ) : (
                  <span className="text-gray-500 text-xs">+${crossKit.price}</span>
                )}
              </div>
            </button>
            {bundleMode && (
              <div className="mt-2 px-3 py-2 bg-green-950/30 border border-green-800/30 rounded-lg flex items-center gap-2">
                <Star size={11} className="text-green-400" />
                <p className="text-green-300 text-xs font-bold">Bundle saves you ${bundleSavings} vs buying separately</p>
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="px-5 pb-5 space-y-2">
          <button
            onClick={() => handleBuy(kit, bundleMode)}
            disabled={!!buying}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm text-black transition-all hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: triggerMeta.color }}>
            <ShoppingCart size={15} />
            {buying
              ? "Redirecting…"
              : bundleMode
                ? `Add Bundle — $${bundlePrice} (save $${bundleSavings})`
                : `Add ${kit.name} — $${kit.price}`}
          </button>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1"><Clock size={10} /> Ships {kit.bullets[2].split("Ships")[1]}</span>
            <span>🔒 Stripe · SSL</span>
            <span>No subscriptions</span>
          </div>

          <button onClick={onDismiss} className="w-full text-center text-gray-600 hover:text-gray-400 text-xs transition-colors py-1">
            No thanks — I'll source parts myself
          </button>
        </div>
      </div>
    </div>
  );
}