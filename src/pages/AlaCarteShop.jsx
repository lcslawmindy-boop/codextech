import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MembershipUpsellBanner from "../components/MembershipUpsellBanner";
import ContentDropSchedule from "../components/ContentDropSchedule";

const ALACARTE_ITEMS = [
  // Courses — standard pricing
  { id: "course-1", type: "course", title: "Regauging and Energy Extraction", price: "$197", priceInCents: 19700, desc: "Core electromagnetic theory & energy access", category: "Course", popular: true, included: true },
  { id: "course-2", type: "course", title: "Scalar Electromagnetics: From Maxwell to Bearden", price: "$197", priceInCents: 19700, desc: "The suppressed physics they didn't teach in school", category: "Course", popular: true, included: true },
  { id: "course-3", type: "course", title: "Phase-Conjugate Wavefront Reversal", price: "$247", priceInCents: 24700, desc: "Time-reversal and focused energy", category: "Course", popular: false, included: true },
  { id: "course-4", type: "course", title: "Patent Strategy & IP Protection", price: "$197", priceInCents: 19700, desc: "Filing claims, FTO analysis, design-arounds", category: "Course", popular: false },
  { id: "course-5", type: "course", title: "Measurement & Validation Protocols", price: "$147", priceInCents: 14700, desc: "Testing frameworks for prototypes", category: "Course", popular: false },

  // Build Plans — standard pricing
  { id: "build-1", type: "build", title: "Motionless Electromagnetic Generator (MEG)", price: "$847", priceInCents: 84700, desc: "Complete BOM, schematics, assembly steps — peer-reviewed COP>1 device", category: "Build Plan", popular: true, included: true },
  { id: "build-2", type: "build", title: "Prioré-Type Multichannel EM System", price: "$697", priceInCents: 69700, desc: "Therapeutic field generation framework", category: "Build Plan", popular: true, included: true },
  { id: "build-3", type: "build", title: "Time-Reversal Zone Cold Fusion Reactor", price: "$1,297", priceInCents: 129700, desc: "Cold fusion and energy experiments", category: "Build Plan", popular: false, included: true },
  { id: "build-4", type: "build", title: "Anenergy Pump Demonstration Circuit", price: "$297", priceInCents: 29700, desc: "Free energy extraction system — Bearden's phi-field mechanism", category: "Build Plan", popular: false },
  { id: "build-5", type: "build", title: "Vacuum Potential Oscillator (VPO) Circuit Kit", price: "$189", priceInCents: 18900, desc: "Hands-on scalar phi-field principles exploration", category: "Build Plan", popular: false },
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
          <p className="text-gray-500 text-sm mt-1">Buy individual courses and build plans at standard pricing. One-time payment, lifetime access. Research Members ($49/mo) get full access to everything PLUS 20-30% discounts on all à la carte purchases — no per-item fees.</p>
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

      {/* Drop Schedule */}
      <div className="px-6 max-w-6xl mx-auto">
        <ContentDropSchedule />
      </div>

      {/* Grid */}
      <div className="px-6 py-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className={`border rounded-2xl p-6 flex flex-col transition-all ${item.popular ? "bg-cyan-950/30 border-cyan-700" : "bg-gray-900 border-gray-800"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest">
                  {item.category}
                </div>
                <div className="flex items-center gap-1">
                  {item.included && <span className="text-xs font-black text-green-400 px-2 py-1 bg-green-950/50 rounded border border-green-900">Included in Membership</span>}
                  {item.popular && <span className="text-xs font-black text-cyan-400 px-2 py-1 bg-cyan-950/50 rounded border border-cyan-900">Popular</span>}
                </div>
              </div>
              <h3 className="text-white font-black text-lg mb-2 leading-tight flex-1">{item.title}</h3>
              <p className="text-gray-400 text-xs mb-4">{item.desc}</p>
              <div className="border-t border-gray-700 pt-4">
                <div className="text-2xl font-black text-cyan-400 mb-4">{item.price}</div>
                <CheckoutButton item={item} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer with Membership Credit Info */}
      <div className="border-t border-gray-800 bg-gray-900/50 px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-4">
              Want it all? Join the membership and get unlimited access to all 10+ courses and 10+ build plans, plus 1 new item every 2 weeks.
            </p>
            <Link to="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm transition-colors">
              Join for $49/month — Everything Included
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-cyan-950/30 border border-cyan-800/50 rounded-xl p-5 text-center">
              <p className="text-cyan-300 text-xs font-black uppercase tracking-widest mb-2">Membership Benefits</p>
              <p className="text-gray-300 text-sm">
                Join for $49/mo and get <strong>20-30% discounts on all courses & build plans</strong> — plus unlimited access to the full research database.
              </p>
            </div>
            <div className="bg-green-950/30 border border-green-800/50 rounded-xl p-5 text-center">
              <p className="text-green-300 text-xs font-black uppercase tracking-widest mb-2">Purchase Credit</p>
              <p className="text-gray-300 text-sm">
                Already bought à la carte items? Your purchases count as credit toward membership. Join today and start saving on future purchases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}