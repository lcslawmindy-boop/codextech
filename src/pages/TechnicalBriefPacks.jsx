import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Search, Filter, Download, ChevronDown, ChevronUp, ShoppingCart, Package } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { BRIEF_PACKS, CATEGORY_COLORS, MASTER_BUNDLE_PRICE, SINGLE_PACK_PRICE } from "../lib/briefPackData";

const ALL_CATEGORIES = ["All", ...Array.from(new Set(BRIEF_PACKS.map(p => p.category)))];
const ALL_DIFFICULTIES = ["All", "Intermediate", "Advanced", "Expert"];

function BriefPackCard({ pack, onBuy }) {
  const [expanded, setExpanded] = useState(false);
  const color = CATEGORY_COLORS[pack.category] || "#94a3b8";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all">
      <div className="h-1" style={{ backgroundColor: color }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-lg">{pack.icon}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold border"
                style={{ color, borderColor: color + "40", backgroundColor: color + "15" }}>
                {pack.category}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                pack.difficulty === "Expert" ? "bg-red-900/30 text-red-400" :
                pack.difficulty === "Advanced" ? "bg-yellow-900/30 text-yellow-400" :
                "bg-green-900/30 text-green-400"
              }`}>{pack.difficulty}</span>
            </div>
            <h3 className="text-white font-black text-sm leading-snug">{pack.title}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{pack.subtitle}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-white font-black text-lg">${pack.price}</p>
            <p className="text-gray-600 text-xs">{pack.pages} pages</p>
          </div>
        </div>

        <p className="text-gray-400 text-xs leading-relaxed mb-3">{pack.tagline}</p>

        <button onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 mb-3 transition-colors">
          {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          {expanded ? "Hide" : "View"} all {pack.sections.length} sections
        </button>

        {expanded && (
          <div className="mb-3 space-y-1">
            {pack.sections.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                <span className="text-gray-700 flex-shrink-0 mt-0.5">{i + 1}.</span>
                <span>{s}</span>
              </div>
            ))}
            <p className="text-gray-700 text-xs mt-2 italic">Source: {pack.theory_basis}</p>
          </div>
        )}

        <button onClick={() => onBuy(pack)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: color }}>
          <Download size={13} /> Get Brief Pack — ${pack.price}
        </button>
      </div>
    </div>
  );
}

function MasterBundleBanner({ onBuyBundle }) {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-700/60 rounded-2xl p-6 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Package size={20} className="text-yellow-400" />
            <h2 className="text-white font-black text-xl">All 33 Brief Packs — Master Bundle</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900/50 border border-yellow-700 text-yellow-300 font-black">SAVE 78%</span>
          </div>
          <p className="text-gray-300 text-sm mb-3">
            Every device brief pack in one download. 33 engineering documents covering all device categories — vacuum energy, scalar EM, bioelectromagnetics, free energy, defense, AgTech, and longevity.
          </p>
          <div className="flex flex-wrap gap-2">
            {["33 PDFs", "1,400–1,800 total pages", "All BOMs", "All circuit diagrams", "Instant download"].map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-300">
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 text-center">
          <p className="text-gray-500 text-sm line-through mb-0.5">${BRIEF_PACKS.length * SINGLE_PACK_PRICE} if bought individually</p>
          <p className="text-yellow-300 font-black text-4xl mb-1">${MASTER_BUNDLE_PRICE}</p>
          <p className="text-gray-500 text-xs mb-4">One-time · Instant access</p>
          <button onClick={onBuyBundle}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-yellow-700 hover:bg-yellow-600 text-black font-black text-sm transition-all">
            <ShoppingCart size={15} /> Get Master Bundle
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TechnicalBriefPacks() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [buying, setBuying] = useState(null);
  const [error, setError] = useState(null);

  const filtered = BRIEF_PACKS.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q);
    const matchCat = category === "All" || p.category === category;
    const matchDiff = difficulty === "All" || p.difficulty === difficulty;
    return matchSearch && matchCat && matchDiff;
  });

  const handleBuy = async (pack) => {
    setError(null);
    setBuying(pack.id);
    try {
      const origin = window.location.origin;
      if (window !== window.top) {
        setError("Checkout only works from the published app, not inside the preview.");
        setBuying(null);
        return;
      }
      const res = await base44.functions.invoke("createCheckoutSession", {
        title: `Technical Brief Pack: ${pack.title}`,
        priceInCents: pack.price * 100,
        description: `${pack.pages} pages · ${pack.sections.length} sections · PDF instant download`,
        category: "Brief Pack",
        productId: pack.id,
        successUrl: `${origin}/technical-brief-packs?purchased=${pack.id}`,
        cancelUrl: `${origin}/technical-brief-packs`,
      });
      if (res.data?.url) window.location.href = res.data.url;
      else setError("Checkout failed. Please try again.");
    } catch (e) {
      setError("Error processing checkout. Please try again.");
    }
    setBuying(null);
  };

  const handleBuyBundle = async () => {
    setError(null);
    setBuying("bundle");
    try {
      const origin = window.location.origin;
      if (window !== window.top) {
        setError("Checkout only works from the published app, not inside the preview.");
        setBuying(null);
        return;
      }
      const res = await base44.functions.invoke("createCheckoutSession", {
        title: "All 33 Device Build Plans — Master Brief Pack Bundle",
        priceInCents: MASTER_BUNDLE_PRICE * 100,
        description: "All 33 device engineering brief packs · 1,400–1,800 total pages · BOMs + circuit diagrams · Instant PDF download",
        category: "Master Bundle",
        productId: "master-brief-bundle",
        successUrl: `${origin}/technical-brief-packs?purchased=bundle`,
        cancelUrl: `${origin}/technical-brief-packs`,
      });
      if (res.data?.url) window.location.href = res.data.url;
      else setError("Checkout failed. Please try again.");
    } catch (e) {
      setError("Error processing checkout. Please try again.");
    }
    setBuying(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-5 bg-gray-900/50 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <Link to="/" className="text-xs text-gray-500 hover:text-gray-300 mb-1 inline-block">← Back</Link>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <FileText size={20} className="text-cyan-400" />
              Technical Brief Packs
            </h1>
            <p className="text-gray-500 text-sm">33 device build plans · Engineering specs, BOMs, circuit diagrams · $27 each or $197 for all</p>
          </div>
          <button onClick={handleBuyBundle} disabled={buying === "bundle"}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-700 hover:bg-yellow-600 text-black font-black text-sm transition-all disabled:opacity-50">
            <Package size={14} /> {buying === "bundle" ? "Processing…" : "All 33 for $197"}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-950/40 border border-red-800 rounded-xl text-red-300 text-sm">{error}</div>
        )}

        {/* Master Bundle Banner */}
        <MasterBundleBanner onBuyBundle={handleBuyBundle} />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search devices, categories..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-gray-600 placeholder-gray-600" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm focus:outline-none">
            {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm focus:outline-none">
            {ALL_DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <span className="text-gray-600 text-sm">{filtered.length} of {BRIEF_PACKS.length} packs</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(pack => (
            <BriefPackCard key={pack.id} pack={pack}
              onBuy={(p) => { if (buying !== p.id) handleBuy(p); }} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            <FileText size={36} className="mx-auto mb-3 opacity-30" />
            <p>No packs match your filters.</p>
          </div>
        )}

        {/* Footer disclaimer */}
        <div className="mt-12 pt-6 border-t border-gray-800">
          <p className="text-gray-700 text-xs text-center leading-relaxed max-w-3xl mx-auto">
            All brief packs are theoretical engineering frameworks based on published research by T.E. Bearden, ONR reports, peer-reviewed literature, and related primary sources. Documentation is for experimental research purposes only. No warranties about device functionality or results. Not medical devices — FDA-exempt research instruments only. Full disclaimer in each document.
          </p>
          <p className="text-center text-gray-700 text-xs mt-3">
            <Link to="/research-disclaimer" className="hover:text-gray-500 underline">Research Disclaimer</Link>
            {" · "}
            <Link to="/terms" className="hover:text-gray-500 underline">Terms of Service</Link>
            {" · "}
            <Link to="/refund-policy" className="hover:text-gray-500 underline">Refund Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}