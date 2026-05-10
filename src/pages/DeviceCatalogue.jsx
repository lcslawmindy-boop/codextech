import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Filter, Package, Zap, Lightbulb } from "lucide-react";
import { businessItems } from "../lib/businessItems";
import Device3DCard from "../components/Device3DCard";

const inventions = businessItems.filter(i => i.category === "Invention");

const PRICE_RANGES = ["All", "Under $500", "$500–$1,000", "$1,000–$2,000", "$2,000+"];

function getPriceNum(priceStr) {
  return Math.round(parseFloat((priceStr || "$0").replace(/[$,]/g, "")));
}

function filterByRange(inv, range) {
  const p = getPriceNum(inv.price);
  if (range === "Under $500") return p < 500;
  if (range === "$500–$1,000") return p >= 500 && p < 1000;
  if (range === "$1,000–$2,000") return p >= 1000 && p < 2000;
  if (range === "$2,000+") return p >= 2000;
  return true;
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40 bg-slate-950/95 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link to="/business" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} /> Back
          </Link>
          <div className="w-px h-5 bg-slate-700" />
          <div>
            <h1 className="text-white font-black text-lg">Advanced Device Catalogue</h1>
            <p className="text-slate-500 text-xs">Professional build plans with detailed specifications & assembly guides</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-xs text-slate-400">
            <Zap size={12} className="text-cyan-400" />
            <span>{inventions.length} devices</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap gap-3 items-center bg-slate-900/30">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            placeholder="Search devices..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={12} className="text-slate-600" />
          {PRICE_RANGES.map(r => (
            <button key={r} onClick={() => setPriceRange(r)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                priceRange === r 
                  ? "bg-cyan-600/20 border-cyan-500 text-cyan-300 font-semibold" 
                  : "border-slate-700 text-slate-400 hover:border-slate-600"
              }`}>
              {r}
            </button>
          ))}
        </div>
        <span className="text-slate-500 text-xs ml-auto font-semibold">{filtered.length} results</span>
      </div>

      {/* Disclaimer */}
      <div className="px-6 py-3 bg-amber-950/20 border-b border-amber-900/30">
        <p className="text-amber-700 text-xs">
          <strong className="text-amber-500">Research & Educational Use Only.</strong> All build plans are sourced from granted US patents and peer-reviewed publications. No regulatory approval for medical, commercial, or consumer use.
        </p>
      </div>

      {/* Grid with Enhanced Masonry */}
      <div className="flex-1 px-6 py-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
            {filtered.map((inv, i) => (
              <Device3DCard key={i} invention={inv} isHighlight={i === 0 && filtered.length > 3} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-24">
              <Lightbulb size={48} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No devices match your filters.</p>
              <p className="text-slate-600 text-sm mt-1">Try adjusting your search or price range.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}