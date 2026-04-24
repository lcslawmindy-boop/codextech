import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, Zap, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";

// Kit catalog — matches Stripe products
const KITS = [
  {
    id: "meg",
    name: "MEG Replication Parts Kit",
    desc: "All 23 components to build the peer-reviewed COP>1 device. Exact part numbers, pre-verified, Digikey-sourced.",
    price: 287,
    priceLabel: "$287",
    badge: "Best Seller",
    badgeColor: "bg-orange-900/50 border-orange-700 text-orange-300",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png",
    productId: "prod_UKE3yIddCPw1IV",
    includes: ["23 pre-verified components", "Supplier links + part numbers", "Ships in 3–5 days"],
  },
  {
    id: "scalar",
    name: "Scalar EM Lab Starter Kit",
    desc: "Foundation circuit components for your first scalar build. Perfect companion to this build plan.",
    price: 167,
    priceLabel: "$167",
    badge: "Start Here",
    badgeColor: "bg-cyan-900/50 border-cyan-700 text-cyan-300",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc3cb2842_generated_image.png",
    productId: "prod_UKE33DR5C4nFUQ",
    includes: ["Starter component bundle", "Beginner-friendly sourcing", "Ships in 3–5 days"],
  },
  {
    id: "priore",
    name: "Prioré Device Component Bundle",
    desc: "Multichannel EM components sourced, bundled, and ready for assembly per the build plan.",
    price: 349,
    priceLabel: "$349",
    badge: "Advanced",
    badgeColor: "bg-purple-900/50 border-purple-700 text-purple-300",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a992c230_generated_image.png",
    productId: "prod_UKE3JFoRjrxfmV",
    includes: ["Multichannel EM components", "Pre-verified bundle", "Ships in 5–7 days"],
  },
];

// Bundles
const BUNDLES = [
  {
    name: "Starter + MEG Bundle",
    items: ["Scalar EM Lab Starter Kit", "MEG Replication Parts Kit"],
    retail: 454,
    price: 379,
    savings: 75,
    color: "#8b5cf6",
  },
  {
    name: "Full Lab Bundle (All 3 Kits)",
    items: ["Scalar EM Lab Starter Kit", "MEG Replication Parts Kit", "Prioré Device Component Bundle"],
    retail: 803,
    price: 649,
    savings: 154,
    color: "#f59e0b",
    badge: "Best Value",
  },
];

function KitCard({ kit, onBuy, loading }) {
  return (
    <div className="bg-gray-950 border border-gray-800 hover:border-gray-600 rounded-xl overflow-hidden transition-all group">
      <div className="h-32 overflow-hidden relative">
        <img src={kit.img} alt={kit.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-2 left-2">
          <span className={`text-xs font-black px-2 py-0.5 rounded border ${kit.badgeColor}`}>{kit.badge}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold text-sm mb-1 leading-snug">{kit.name}</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3">{kit.desc}</p>
        <div className="space-y-1 mb-4">
          {kit.includes.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
              <Check size={10} className="text-green-500 flex-shrink-0" /> {item}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-green-400 font-black text-lg">{kit.priceLabel}</span>
          <button
            onClick={() => onBuy(kit)}
            disabled={loading === kit.id}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-700 hover:bg-orange-600 disabled:opacity-60 text-white text-xs font-black transition-colors"
          >
            <ShoppingCart size={12} />
            {loading === kit.id ? "Loading..." : "Buy Kit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BuildUpsellPanel({ trigger = "after_build" }) {
  const [dismissed, setDismissed] = useState(false);
  const [showBundles, setShowBundles] = useState(false);
  const [loading, setLoading] = useState(null);

  if (dismissed) return null;

  const handleBuyKit = async (kit) => {
    if (window !== window.top) {
      alert("Checkout only works from the published app. Please open the app directly.");
      return;
    }
    setLoading(kit.id);
    const baseUrl = window.location.origin;
    const res = await base44.functions.invoke("createCheckoutSession", {
      title: kit.name,
      priceInCents: kit.price * 100,
      description: "Physical parts kit — ships in 3–7 business days",
      category: "physical_kit",
      mode: "payment",
      successUrl: `${baseUrl}/checkout?success=true&product=${encodeURIComponent(kit.name)}`,
      cancelUrl: `${baseUrl}/invention-plans`,
      customerEmail: null,
    });
    setLoading(null);
    if (res.data?.url) window.location.href = res.data.url;
  };

  const handleBuyBundle = async (bundle) => {
    if (window !== window.top) {
      alert("Checkout only works from the published app. Please open the app directly.");
      return;
    }
    setLoading("bundle-" + bundle.name);
    const baseUrl = window.location.origin;
    const res = await base44.functions.invoke("createCheckoutSession", {
      title: bundle.name,
      priceInCents: bundle.price * 100,
      description: `Bundle: ${bundle.items.join(", ")}`,
      category: "physical_kit_bundle",
      mode: "payment",
      successUrl: `${baseUrl}/checkout?success=true&product=${encodeURIComponent(bundle.name)}`,
      cancelUrl: `${baseUrl}/invention-plans`,
      customerEmail: null,
    });
    setLoading(null);
    if (res.data?.url) window.location.href = res.data.url;
  };

  return (
    <div className="mt-8 bg-gray-900 border border-orange-900/40 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-900/40 border border-orange-800 flex items-center justify-center">
            <Package size={16} className="text-orange-400" />
          </div>
          <div>
            <h3 className="text-white font-black text-base">Stop Simulating. Buy the Kit.</h3>
            <p className="text-gray-500 text-xs">
              {trigger === "post_purchase"
                ? "Welcome! You now have the plans — get the parts delivered."
                : "You have the build plan. Get the components shipped to your door."}
            </p>
          </div>
        </div>
        <button onClick={() => setDismissed(true)} className="text-gray-600 hover:text-gray-400 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="p-6">
        {/* Value pitch */}
        <div className="bg-orange-950/20 border border-orange-900/30 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
          <Zap size={14} className="text-orange-400 flex-shrink-0 mt-0.5" />
          <p className="text-orange-200 text-xs leading-relaxed">
            Every kit is pre-verified against the build plan BOM. Exact part numbers. Right specifications.{" "}
            <span className="font-black">No hunting on Digikey for 3 hours.</span>
          </p>
        </div>

        {/* Individual kits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {KITS.map(kit => (
            <KitCard key={kit.id} kit={kit} onBuy={handleBuyKit} loading={loading} />
          ))}
        </div>

        {/* Bundle toggle */}
        <button
          onClick={() => setShowBundles(b => !b)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors mb-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-black text-sm">🎁 Bundle & Save</span>
            <span className="text-gray-400 text-xs">— up to $154 off</span>
          </div>
          {showBundles ? <ChevronUp size={15} className="text-gray-500" /> : <ChevronDown size={15} className="text-gray-500" />}
        </button>

        {showBundles && (
          <div className="space-y-3">
            {BUNDLES.map((bundle, i) => (
              <div key={i} className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-bold text-sm">{bundle.name}</h4>
                    {bundle.badge && (
                      <span className="text-xs font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: bundle.color }}>
                        {bundle.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mb-1">{bundle.items.join(" + ")}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 line-through text-sm">${bundle.retail}</span>
                    <span className="text-green-400 font-black text-lg">${bundle.price}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-950 border border-green-800 text-green-400 font-bold">
                      Save ${bundle.savings}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleBuyBundle(bundle)}
                  disabled={loading === "bundle-" + bundle.name}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-black transition-all hover:opacity-90 flex-shrink-0"
                  style={{ backgroundColor: bundle.color }}
                >
                  <ShoppingCart size={14} />
                  {loading === "bundle-" + bundle.name ? "Loading..." : `Get Bundle — $${bundle.price}`}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer nudge */}
        <p className="text-center text-gray-700 text-xs mt-4">
          🔒 Stripe · SSL · Physical delivery · 30-day return policy ·{" "}
          <Link to="/build-supplies-shop" className="hover:text-gray-500 transition-colors underline">Browse all kits</Link>
        </p>
      </div>
    </div>
  );
}