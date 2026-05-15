import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Zap, Cpu, Radio, FlaskConical, Shield, Activity, Microscope, Wrench } from "lucide-react";
import { businessItems } from "../lib/businessItems";
import Device3DCard from "../components/Device3DCard";

const inventions = businessItems.filter(i => i.category === "Invention");

const CATEGORIES = [
  { label: "All", icon: null, color: "#06b6d4" },
  { label: "Resonance", icon: <Activity size={12} />, color: "#a855f7" },
  { label: "Bioelectromagnetics", icon: <Microscope size={12} />, color: "#22c55e" },
  { label: "Energy", icon: <Zap size={12} />, color: "#f97316" },
  { label: "Defense", icon: <Shield size={12} />, color: "#ef4444" },
  { label: "RF & Signal", icon: <Radio size={12} />, color: "#06b6d4" },
  { label: "Instrumentation", icon: <Cpu size={12} />, color: "#fbbf24" },
];

function matchCategory(inv, cat) {
  if (cat === "All") return true;
  const text = `${inv.title} ${inv.tagline} ${inv.description}`.toLowerCase();
  const map = {
    "Resonance": ["resonan", "scalar", "oscillat", "wave", "phase"],
    "Bioelectromagnetics": ["bio", "cell", "telomere", "therapy", "biophoton", "tissue", "regenerat"],
    "Energy": ["energy", "generator", "overunity", "meg", "fusion", "vacuum", "atmospheric"],
    "Defense": ["aegis", "shield", "counterphase", "defense", "classified"],
    "RF & Signal": ["rf", "signal", "elf", "carrier", "sdr", "detection", "antenna"],
    "Instrumentation": ["spectrometer", "detector", "sensor", "instrument", "monitor"],
  };
  return (map[cat] || []).some(kw => text.includes(kw));
}

const STATS = [
  { val: `${inventions.length}+`, label: "Documented Devices", color: "#06b6d4" },
  { val: "40+", label: "Engineering Build Plans", color: "#a855f7" },
  { val: "200+", label: "Patent Sources Cited", color: "#22c55e" },
  { val: "8", label: "Research Domains", color: "#f97316" },
];

export default function DeviceCatalogue() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = inventions.filter(inv => {
    const matchSearch = !search ||
      inv.title.toLowerCase().includes(search.toLowerCase()) ||
      inv.tagline?.toLowerCase().includes(search.toLowerCase());
    return matchSearch && matchCategory(inv, category);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* ── Sticky Nav ── */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40 bg-slate-950/98 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link to="/business" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-slate-700" />
          <div>
            <h1 className="text-white font-black text-base leading-none">Device Catalogue</h1>
            <p className="text-slate-500 text-[11px] mt-0.5">Patent-sourced · Engineering-grade · Build-ready</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-xs font-bold">
          <Zap size={11} /> {inventions.length} Devices
        </div>
      </div>

      {/* ── Hero Stats Bar ── */}
      <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 px-6 py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black mb-0.5" style={{ color: s.color }}>{s.val}</div>
              <div className="text-slate-400 text-xs font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/40 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative min-w-48 flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            placeholder="Search devices..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.label}
              onClick={() => setCategory(cat.label)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
              style={category === cat.label
                ? { background: cat.color + "22", borderColor: cat.color, color: cat.color }
                : { borderColor: "#334155", color: "#64748b" }
              }
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <span className="text-slate-600 text-xs ml-auto font-semibold">{filtered.length} results</span>
      </div>

      {/* ── Disclaimer strip ── */}
      <div className="px-6 py-2 bg-amber-950/20 border-b border-amber-900/20 flex items-center gap-2">
        <FlaskConical size={11} className="text-amber-600 flex-shrink-0" />
        <p className="text-amber-700 text-[11px]">
          <strong className="text-amber-500">Research & Educational Use Only.</strong> All plans sourced from granted US patents & peer-reviewed publications.
        </p>
      </div>

      {/* ── Grid ── */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((inv, i) => (
              <Device3DCard key={i} invention={inv} isHighlight={i === 0 && filtered.length > 4} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4">
                <Wrench size={28} className="text-slate-700" />
              </div>
              <p className="text-slate-500 text-lg font-bold">No devices match your filters.</p>
              <p className="text-slate-600 text-sm mt-1">Try a different category or search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}