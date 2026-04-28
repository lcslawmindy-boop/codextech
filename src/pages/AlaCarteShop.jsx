import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MembershipUpsellBanner from "../components/MembershipUpsellBanner";

const ALACARTE_ITEMS = [
  // Courses ($29 each)
  { id: "course-1", type: "course", title: "Regauging and Energy Extraction", price: "$29", priceInCents: 2900, desc: "Core electromagnetic theory", category: "Course" },
  { id: "course-2", type: "course", title: "Scalar Potential Fundamentals", price: "$29", priceInCents: 2900, desc: "Understanding scalar fields", category: "Course" },
  { id: "course-3", type: "course", title: "Phase-Conjugate Wavefront Engineering", price: "$29", priceInCents: 2900, desc: "Advanced resonance theory", category: "Course" },
  { id: "course-4", type: "course", title: "Patent Strategy & IP Protection", price: "$29", priceInCents: 2900, desc: "Filing and claiming strategy", category: "Course" },
  { id: "course-5", type: "course", title: "Measurement & Validation Protocols", price: "$29", priceInCents: 2900, desc: "Testing methodologies", category: "Course" },

  // Build Plans ($49–79)
  { id: "build-1", type: "build", title: "MEG Replication Kit", price: "$79", priceInCents: 7900, desc: "Complete BOM + schematics", category: "Build Plan" },
  { id: "build-2", type: "build", title: "Scalar EM Transducer", price: "$49", priceInCents: 4900, desc: "Step-by-step assembly", category: "Build Plan" },
  { id: "build-3", type: "build", title: "Prioré Device System", price: "$79", priceInCents: 7900, desc: "Advanced therapeutic field", category: "Build Plan" },
  { id: "build-4", type: "build", title: "Time-Reversal Zone Reactor", price: "$59", priceInCents: 5900, desc: "Cold fusion framework", category: "Build Plan" },
  { id: "build-5", type: "build", title: "Anenergy Pump Circuit", price: "$49", priceInCents: 4900, desc: "Free energy extraction", category: "Build Plan" },
];

function CheckoutButton({ item }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (window.self !== window.top) {
      alert("Checkout works best on the published app. Please visit the full website to complete your purchase.");
      return;
    }

    setLoading(true);
    try {
      const res = await base44.functions.invoke("createCheckoutSession", {
        title: item.title,
        priceInCents: item.priceInCents,
        description: `${item.category}: ${item.desc}`,
        category: item.type === "course" ? "Course" : "Build Plan"
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full py-2 px-4 rounded-lg bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-black text-xs transition-all flex items-center justify-center gap-2"
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <ShoppingCart size={12} />}
      {loading ? "Processing..." : `Buy Now — ${item.price}`}
    </button>
  );
}

export default function AlaCarteShop() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? ALACARTE_ITEMS : ALACARTE_ITEMS.filter(i => i.type === filter);

  return (
    <div className="min-h-screen bg-gray-950">
      <MembershipUpsellBanner />

      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <h1 className="text-2xl font-black text-white">À La Carte Catalog</h1>
          <p className="text-gray-500 text-sm mt-1">Buy individual courses ($29) and build plans ($49–79). One-time payment, lifetime access.</p>
        </div>
      </div>

      {/* Filter */}
      <div className="border-b border-gray-800 px-6 py-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
              filter === "all" ? "bg-cyan-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            All ({ALACARTE_ITEMS.length})
          </button>
          <button
            onClick={() => setFilter("course")}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
              filter === "course" ? "bg-cyan-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Courses (5)
          </button>
          <button
            onClick={() => setFilter("build")}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
              filter === "build" ? "bg-cyan-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Build Plans (5)
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 py-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col">
              <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                {item.category}
              </div>
              <h3 className="text-white font-black text-lg mb-2 leading-tight flex-1">{item.title}</h3>
              <p className="text-gray-500 text-xs mb-4">{item.desc}</p>
              <div className="border-t border-gray-700 pt-4">
                <div className="text-2xl font-black text-cyan-400 mb-4">{item.price}</div>
                <CheckoutButton item={item} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 bg-gray-900/50 px-6 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm mb-4">
            Want it all? Join the membership and get unlimited access to all courses and build plans, plus 1 new item every 2 weeks.
          </p>
          <Link to="/research-membership"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm transition-colors">
            View Membership Plans
          </Link>
        </div>
      </div>
    </div>
  );
}