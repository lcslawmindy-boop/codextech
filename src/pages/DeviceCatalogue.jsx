import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Lock, Search, Filter, Loader2, ChevronDown, ChevronUp, Package } from "lucide-react";
import { businessItems } from "../lib/businessItems";
import { itemImages } from "../lib/itemImages";
import { inventionVisuals } from "../lib/inventionVisuals";
import { base44 } from "@/api/base44Client";

const inventions = businessItems.filter(i => i.category === "Invention");

const PRICE_RANGES = ["All", "Under $500", "$500–$1,000", "$1,000–$2,000", "$2,000+"];

function getPriceNum(priceStr) {
  return Math.round(parseFloat((priceStr || "$0").replace(/[$,]/g, "")) );
}

function filterByRange(inv, range) {
  const p = getPriceNum(inv.price);
  if (range === "Under $500") return p < 500;
  if (range === "$500–$1,000") return p >= 500 && p < 1000;
  if (range === "$1,000–$2,000") return p >= 1000 && p < 2000;
  if (range === "$2,000+") return p >= 2000;
  return true;
}

function BuyButton({ invention }) {
  const [loading, setLoading] = useState(false);
  const priceInCents = Math.round(getPriceNum(invention.price) * 100);

  const handleBuy = async () => {
    if (window.self !== window.top) {
      alert("Checkout only works from the published app, not inside the editor.");
      return;
    }
    setLoading(true);
    try {
      const origin = window.location.origin;
      const res = await base44.functions.invoke("createCheckoutSession", {
        title: invention.title,
        priceInCents,
        description: invention.tagline,
        category: "Invention",
        successUrl: `${origin}/device-catalogue`,
        cancelUrl: `${origin}/device-catalogue`,
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-black text-white bg-green-700 hover:bg-green-600 disabled:opacity-50 transition-all"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
      {loading ? "Processing..." : `Buy Plans — ${invention.price}`}
    </button>
  );
}

function DeviceCard({ inv }) {
  const [expanded, setExpanded] = useState(false);
  const visual = inventionVisuals[inv.title];
  const image = itemImages[inv.title];
  const priceNum = getPriceNum(inv.price);

  return (
    <div className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl overflow-hidden flex flex-col transition-all">
      {image ? (
        <div className="relative h-44 overflow-hidden">
          <img src={image} alt={inv.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="text-2xl">{inv.icon}</span>
            <span className="text-green-400 font-black text-lg">{inv.price}</span>
          </div>
        </div>
      ) : (
        <div className="h-20 bg-gray-800/60 flex items-center gap-3 px-4">
          <span className="text-3xl">{inv.icon}</span>
          <span className="text-green-400 font-black text-xl">{inv.price}</span>
        </div>
      )}

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-white font-black text-base leading-snug mb-1">{inv.title}</h3>
          <p className="text-gray-400 text-xs italic">{inv.tagline}</p>
        </div>

        {visual?.whatItIs && (
          <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">{visual.whatItIs}</p>
        )}

        {inv.problem && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? "Hide" : "Show"} problem & solution
          </button>
        )}

        {expanded && (
          <div className="space-y-2 text-xs">
            {inv.problem && (
              <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-3">
                <p className="text-red-400 font-bold uppercase tracking-wider mb-1">Problem</p>
                <p className="text-gray-300 leading-relaxed">{inv.problem}</p>
              </div>
            )}
            {inv.beardenSolution && (
              <div className="bg-blue-950/20 border border-blue-900/30 rounded-lg p-3">
                <p className="text-blue-400 font-bold uppercase tracking-wider mb-1">Solution</p>
                <p className="text-gray-300 leading-relaxed">{inv.beardenSolution}</p>
              </div>
            )}
            {inv.market && (
              <div className="bg-green-950/20 border border-green-900/30 rounded-lg p-3">
                <p className="text-green-400 font-bold uppercase tracking-wider mb-1">Market</p>
                <p className="text-gray-300 leading-relaxed">{inv.market}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-800 space-y-2">
          <BuyButton invention={inv} />
          <Link
            to="/invention-plans"
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold text-gray-400 border border-gray-700 hover:bg-gray-800 transition-all"
          >
            View Full Specs
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DeviceCatalogue() {
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState("All");

  const filtered = inventions.filter(inv => {
    const matchSearch = !search ||
      inv.title.toLowerCase().includes(search.toLowerCase()) ||
      inv.tagline?.toLowerCase().includes(search.toLowerCase());
    return matchSearch && filterByRange(inv, priceRange);
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/business" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg">Device Build Plans Catalogue</h1>
            <p className="text-gray-500 text-xs">{inventions.length} invention build plans — full specs, BOM & step-by-step instructions</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Package size={13} className="text-red-400" />
          <span>{inventions.length} devices</span>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 border-b border-gray-800 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search devices..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gray-500"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={12} className="text-gray-500" />
          {PRICE_RANGES.map(r => (
            <button key={r} onClick={() => setPriceRange(r)}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                priceRange === r ? "bg-gray-700 border-gray-500 text-white" : "border-gray-700 text-gray-400 hover:border-gray-500"
              }`}>
              {r}
            </button>
          ))}
        </div>
        <span className="text-gray-600 text-xs ml-auto">{filtered.length} results</span>
      </div>

      {/* Disclaimer */}
      <div className="px-6 py-2 bg-yellow-950/20 border-b border-yellow-900/30">
        <p className="text-yellow-700 text-xs">
          <strong className="text-yellow-500">Research & Educational Use Only.</strong> Build plans are derived from publicly available patents and peer-reviewed publications. No FDA/FCC approval for medical or commercial use.
        </p>
      </div>

      {/* Grid */}
      <div className="flex-1 px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {filtered.map((inv, i) => <DeviceCard key={i} inv={inv} />)}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-24 text-gray-600">No devices match your filters.</div>
        )}
      </div>
    </div>
  );
}