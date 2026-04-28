import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Zap } from "lucide-react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import PullToRefreshIndicator from "@/components/PullToRefreshIndicator";

const BUILDS = [
  { id: 1, title: "MEG Replication Device", category: "Energy", cost: "$287", desc: "US Patent 6,362,718. Complete replication with 23-part BOM.", emoji: "⚡", locked: true },
  { id: 2, title: "Scalar EM Transmitter", category: "Communications", cost: "$512", desc: "Long-range EM transmission without traditional antenna.", emoji: "📡", locked: true },
  { id: 3, title: "Biofield Resonance Chamber", category: "Bio-Signal", cost: "$1,200", desc: "Prioré-type multichannel device. French govt documented.", emoji: "🧬", locked: true },
  { id: 4, title: "Quantum Potential Extractor", category: "Energy", cost: "$1,800", desc: "Vacuum energy extraction system with quantum principles.", emoji: "🌀", locked: true },
  { id: 5, title: "Anenergy Pump Circuit", category: "Energy", cost: "$445", desc: "14-component phi-field energy pump. Fully sourced.", emoji: "💫", locked: true },
  { id: 6, title: "Scalar Wave Interferometer", category: "Instrumentation", cost: "$667", desc: "Zero E, zero B field measurement system.", emoji: "🔬", locked: true },
  { id: 7, title: "Telomere Regeneration Device", category: "Bio-Tech", cost: "$2,100", desc: "EM-triggered cellular regeneration protocol.", emoji: "🔬", locked: true },
  { id: 8, title: "Kaznacheyev UV Spectrometer", category: "Bio-Signal", cost: "$1,450", desc: "Biophoton frequency mapping and disease reversal.", emoji: "🌈", locked: true },
];

const CATEGORIES = ["All", "Energy", "Communications", "Bio-Signal", "Instrumentation", "Bio-Tech"];

export default function VaultBrowser() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Pull-to-refresh resets filters
  const handleRefresh = useCallback(async () => {
    setSearch("");
    setCategoryFilter("All");
  }, []);
  const { containerRef, pullY, refreshing } = usePullToRefresh(handleRefresh);

  const filtered = useMemo(() => {
    return BUILDS.filter(b => {
      const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.desc.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All" || b.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [search, categoryFilter]);

  return (
    <div className="min-h-screen bg-gray-950 text-white relative" ref={containerRef}>
      <PullToRefreshIndicator pullY={pullY} refreshing={refreshing} />
      {/* ── Header ── */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">The Vault</h1>
            <p className="text-gray-500 text-xs">Browse {BUILDS.length} complete build systems</p>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="Search builds..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-600"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Category filter ── */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No builds found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filtered.map(build => (
              <Link
                key={build.id}
                to={`/build/${build.id}`}
                className="group relative bg-gray-900 border border-gray-800 hover:border-cyan-700 rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:shadow-cyan-900/20"
              >
                {/* ── Visual ── */}
                <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center text-6xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {build.emoji}
                </div>

                {/* ── Content ── */}
                <div className="p-5">
                  <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">{build.category}</p>
                  <h3 className="text-white font-black text-base leading-snug mb-2">{build.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">{build.desc}</p>

                  {/* ── Footer ── */}
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-black text-sm">{build.cost}</span>
                    <Zap size={16} className="text-cyan-400" />
                  </div>
                </div>

                {/* ── Hover overlay ── */}
                <div className="absolute inset-0 bg-gray-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-center">
                    <Zap size={32} className="text-cyan-400 mx-auto mb-2" />
                    <p className="text-white font-bold text-sm">View Details</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── CTA ── */}
        <div className="text-center bg-gray-900/60 border border-gray-800 rounded-2xl p-12">
          <h2 className="text-2xl font-black mb-3">Upgrade to Premium</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">Unlock video assembly guides, supplier sourcing links, and access to engineer community. All BOMs & schematics stay free forever.</p>
          <Link to="/pricing-vault" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black transition-all">
            See Premium Tiers
          </Link>
        </div>
      </div>
    </div>
  );
}