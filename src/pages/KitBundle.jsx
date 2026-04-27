import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Check, Package, Zap, Star, Flame, ShoppingCart, Loader2, Shield } from "lucide-react";

const BUNDLES = [
  {
    id: "meg_starter",
    name: "MEG Starter Bundle",
    tagline: "Build the device they said couldn't exist",
    price: 397,
    compareAt: 584,
    color: "#06b6d4",
    badge: "🔥 BESTSELLER",
    kitName: "MEG Replication Parts Kit",
    kitPrice: 287,
    membershipName: "ZARP Pro Membership (1 month)",
    membershipPrice: 79,
    savings: 187,
    kitDesc: "Every part to build the Motionless Electromagnetic Generator — Vitroperm 500F core, N52 magnets, IRFP460 MOSFETs, AD9833 DDS module, Arduino Nano, gate drive circuit.",
    includes: [
      "MEG Replication Parts Kit ($287 value)",
      "23-step MEG assembly guide + build video",
      "Full BOM with exact Digikey/Amazon part numbers",
      "1 month ZARP Pro membership ($79 value) — includes all 40+ builds & courses",
      "AI Patent Suite — draft a USPTO provisional for your MEG variant",
      "Prior Art Archive — full MEG research history",
    ],
    stripeKitPriceId: null, // one-time checkout via price_data
    kitPriceCents: 28700,
  },
  {
    id: "trd1_bundle",
    name: "TRD-1 Research Bundle",
    tagline: "Telomere research protocol — build plans + membership",
    price: 247,
    compareAt: 373,
    color: "#8b5cf6",
    badge: "⚡ POPULAR",
    kitName: "TRD-1 Telomere Device Build Kit",
    kitPrice: 194,
    membershipName: "ZARP Starter Membership (1 month)",
    membershipPrice: 29,
    savings: 126,
    kitDesc: "All components for the TRD-1 Telomere Regeneration Device — implements Bearden's MCCS scalar EM protocol. For in-vitro and experimental research only.",
    includes: [
      "TRD-1 Build Kit ($194 value) — all sourced components",
      "Full TRD-1 step-by-step assembly guide",
      "Bioelectromagnetics course module",
      "1 month ZARP Starter membership ($29 value)",
      "Prior Art Archive — Prioré, TRD-1, UV biophoton research",
      "Research disclaimer & citations package",
    ],
    kitPriceCents: 19400,
  },
  {
    id: "lab_starter",
    name: "Lab Starter Bundle",
    tagline: "Everything to set up your scalar EM lab",
    price: 217,
    compareAt: 346,
    color: "#22c55e",
    badge: "🔬 BEST FOR BEGINNERS",
    kitName: "Scalar EM Lab Starter Kit",
    kitPrice: 167,
    membershipName: "ZARP Starter Membership (1 month)",
    membershipPrice: 29,
    savings: 129,
    kitDesc: "Core components for a beginner scalar EM bench — oscilloscope probes, DDS board, coil winding jig, Hall sensors, ferrite toroids, and measurement reference guide.",
    includes: [
      "Scalar EM Lab Starter Kit ($167 value)",
      "Beginner EM Lab course (3 modules)",
      "5 introductory build project guides",
      "1 month ZARP Starter membership ($29 value)",
      "Glossary of scalar EM terms + reference guide",
      "Community forum access",
    ],
    kitPriceCents: 16700,
  },
];

function BundleCard({ bundle, onBuy, loading }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col"
      style={{ borderColor: bundle.color + "40" }}>
      {/* Color accent top */}
      <div className="h-1" style={{ backgroundColor: bundle.color }} />

      {bundle.badge && (
        <div className="px-5 py-2 text-xs font-black text-white text-center"
          style={{ backgroundColor: bundle.color + "22", borderBottom: `1px solid ${bundle.color}40` }}>
          {bundle.badge}
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-white font-black text-xl mb-1">{bundle.name}</h3>
        <p className="text-sm mb-5" style={{ color: bundle.color }}>{bundle.tagline}</p>

        {/* Pricing */}
        <div className="flex items-end gap-2 mb-1">
          <span className="text-gray-500 line-through text-base">${bundle.compareAt}</span>
          <span className="text-5xl font-black text-white">${bundle.price}</span>
        </div>
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xs px-2 py-0.5 rounded-full font-black text-white"
            style={{ backgroundColor: bundle.color }}>
            SAVE ${bundle.savings}
          </span>
          <span className="text-gray-500 text-xs">one-time payment</span>
        </div>

        {/* Kit description */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-4 border border-gray-700/50">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Package size={11} /> What's in the physical kit
          </p>
          <p className="text-gray-300 text-xs leading-relaxed">{bundle.kitDesc}</p>
        </div>

        {/* Includes */}
        <div className="space-y-2 mb-5 flex-1">
          {bundle.includes.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: bundle.color }} />
              <span className="text-gray-200 text-sm">{item}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => onBuy(bundle)}
          disabled={loading === bundle.id}
          className="w-full py-4 rounded-xl font-black text-base text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 mb-2"
          style={{ backgroundColor: bundle.color, boxShadow: `0 4px 20px ${bundle.color}40` }}
        >
          {loading === bundle.id
            ? <><Loader2 size={16} className="animate-spin" /> Processing…</>
            : <><ShoppingCart size={16} /> Get Bundle — ${bundle.price}</>
          }
        </button>
        <p className="text-center text-gray-600 text-xs">Kit ships within 5–7 days · Digital access instant</p>
      </div>
    </div>
  );
}

export default function KitBundle() {
  const [loading, setLoading] = useState(null);

  const handleBuy = async (bundle) => {
    if (window !== window.top) {
      alert("Checkout only works from the published app. Please open the app directly.");
      return;
    }
    setLoading(bundle.id);
    const baseUrl = window.location.origin;
    try {
      const response = await base44.functions.invoke("createCheckoutSession", {
        title: bundle.name,
        priceInCents: bundle.price * 100,
        description: `${bundle.kitName} + ${bundle.membershipName}`,
        category: "kit_bundle",
        mode: "payment",
        successUrl: `${baseUrl}/orders?success=true&bundle=${bundle.id}`,
        cancelUrl: `${baseUrl}/kit-bundles`,
        customerEmail: null,
      });
      if (response.data?.url) window.location.href = response.data.url;
    } catch (err) {
      console.error(err);
      alert("Checkout error. Please try again.");
    }
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Urgency bar */}
      <div className="bg-gradient-to-r from-orange-950 to-red-950 border-b border-orange-900 px-4 py-2.5 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <Flame size={13} className="text-orange-400 animate-pulse" />
          <span className="text-orange-200 font-semibold">Bundle pricing — save up to $187 vs buying separately</span>
        </div>
      </div>

      {/* Nav */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-5 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png" alt="C.O.D.E.X.T.E.C.H." className="h-10 w-10 object-contain" />
            <span className="font-black text-base">Kit Bundles</span>
          </div>
        </div>
        <Link to="/build-supplies-shop" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Individual kits →</Link>
      </div>

      {/* Hero */}
      <div className="text-center px-5 pt-12 pb-8 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-950/60 border border-orange-800 text-orange-300 text-xs font-bold mb-4 uppercase tracking-widest">
          <Package size={11} /> Physical Kit + Digital Membership
        </div>
        <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
          Build the Device.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Own the Knowledge.
          </span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Each bundle includes a pre-sourced hardware kit shipped to your door, plus vault membership with the full build guide, BOM, and research archive.
        </p>
      </div>

      {/* Bundle cards */}
      <div className="px-5 pb-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {BUNDLES.map(bundle => (
            <BundleCard key={bundle.id} bundle={bundle} onBuy={handleBuy} loading={loading} />
          ))}
        </div>

        {/* Trust row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 text-center">
          {[
            { icon: "🚚", label: "Ships in 5–7 days", sub: "US & international" },
            { icon: "⚡", label: "Digital access instant", sub: "After checkout" },
            { icon: "🔒", label: "Stripe secured", sub: "SSL encrypted" },
            { icon: "↩️", label: "14-day returns", sub: "Unused kits only" },
          ].map((t, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl py-4 px-3">
              <div className="text-2xl mb-1">{t.icon}</div>
              <p className="text-white font-bold text-xs">{t.label}</p>
              <p className="text-gray-500 text-xs">{t.sub}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <Shield size={24} className="text-cyan-400 mx-auto mb-3" />
          <h3 className="text-white font-black text-xl mb-2">Just want the membership?</h3>
          <p className="text-gray-400 text-sm mb-5">Skip the hardware — unlock the full vault digitally starting at $29/month.</p>
          <Link to="/paywall"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-white text-sm transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}>
            <Zap size={14} /> View Membership Plans
          </Link>
        </div>
      </div>

      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p>© 2026 Zenith Apex LLC · C.O.D.E.X.T.E.C.H. · For research and educational purposes only</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link to="/terms" className="hover:text-gray-400">Terms</Link>
          <Link to="/refund-policy" className="hover:text-gray-400">Refund Policy</Link>
        </div>
      </footer>
    </div>
  );
}