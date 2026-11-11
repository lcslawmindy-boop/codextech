import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Wrench, Search, ChevronDown, ChevronUp, CheckCircle2,
  AlertTriangle, Package, Cpu, Layers, XCircle, ShieldAlert, Loader2,
} from "lucide-react";
import { NEW_INVENTIONS } from "../lib/newInventions";

const CAT_COLORS = {
  "Energy & Propulsion": "#f97316",
  "Energy & Bio-Medicine": "#a855f7",
  "Bio-Medicine & Energy": "#a855f7",
  "Bio-Medicine": "#ec4899",
  "Water & Bio-Medicine": "#14b8a6",
  "Consciousness & Mind": "#6366f1",
  "Diagnostics & Sensors": "#06b6d4",
  "Materials & Nano": "#eab308",
  "Agriculture & Environment": "#22c55e",
  "Education & Research": "#3b82f6",
  "Ultimate Integration": "#ef4444",
};

// Parse the buildPlan string into 3 phases. Falls back to generic phases.
function parsePhases(buildPlan) {
  if (!buildPlan) {
    return [
      { label: "Phase 1 — Bench Prototype", text: "Desktop proof-of-concept. Confirm core mechanism under controlled, instrumented conditions." },
      { label: "Phase 2 — Engineering Unit", text: "Scale to a portable / bench engineering unit; characterize output and safety." },
      { label: "Phase 3 — Validated Unit", text: "Production-intent validated unit — only after Gate 1 (in-vitro / falsification) passes." },
    ];
  }
  const parts = buildPlan.split(/Phase\s*\d/i).map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 3) {
    return [
      { label: "Phase 1 — Bench Prototype", text: parts[0] },
      { label: "Phase 2 — Engineering Unit", text: parts[1] },
      { label: "Phase 3 — Validated Unit", text: parts.slice(2).join(" ") },
    ];
  }
  return [
    { label: "Phase 1 — Bench Prototype", text: buildPlan },
    { label: "Phase 2 — Engineering Unit", text: "Scale and characterize; safety + EMC pre-scan." },
    { label: "Phase 3 — Validated Unit", text: "Production-intent validated unit after Gate 1." },
  ];
}

function InventionCard({ inv }) {
  const [open, setOpen] = useState(false);
  const color = CAT_COLORS[inv.category] || "#94a3b8";
  const phases = useMemo(() => parsePhases(inv.buildPlan), [inv.buildPlan]);
  const components = inv.components || [];
  const claims = inv.patentClaims || [];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden" style={{ borderTopColor: color, borderTopWidth: 3 }}>
      <button onClick={() => setOpen((o) => !o)} className="w-full text-left px-5 py-4 hover:bg-gray-800/40 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">{inv.id}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: color + "20", color, border: `1px solid ${color}40` }}>{inv.category}</span>
            </div>
            <h3 className="text-white font-bold text-sm leading-snug">{inv.name}</h3>
            <p className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-2">{inv.fusion}</p>
          </div>
          {open ? <ChevronUp size={16} className="text-gray-500 flex-shrink-0 mt-1" /> : <ChevronDown size={16} className="text-gray-500 flex-shrink-0 mt-1" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-800 space-y-4">
          {/* Mechanism */}
          {inv.mechanism && (
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Operating Mechanism</p>
              <p className="text-gray-300 text-xs leading-relaxed">{inv.mechanism}</p>
            </div>
          )}

          {/* Research-use notice */}
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-lg px-3 py-2">
            <p className="text-amber-200/70 text-[11px] leading-relaxed">
              <strong className="text-amber-300">Research-only.</strong> Claims are unverified until falsification gate passes. No medical / energy-output claim is made by this build plan. Speculative platform concepts (scalar EM, wave genome, orgone, Priore) must be replicated under blinding before any reliance.
            </p>
          </div>

          {/* Phased build plan */}
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">3-Phase Build Plan</p>
            <div className="space-y-2">
              {phases.map((p, i) => (
                <div key={i} className="bg-gray-950 border border-gray-800 rounded-lg p-3">
                  <p className="text-xs font-bold mb-1" style={{ color }}>{p.label}</p>
                  <p className="text-gray-300 text-[11px] leading-relaxed">{p.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Component checklist */}
          {components.length > 0 && (
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><Package size={11} /> Component Checklist ({components.length})</p>
              <ul className="grid sm:grid-cols-2 gap-1.5">
                {components.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-gray-300 text-[11px] leading-relaxed bg-gray-950 border border-gray-800 rounded px-2 py-1.5">
                    <CheckCircle2 size={11} className="text-cyan-500 flex-shrink-0 mt-0.5" />{c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Patent claims */}
          {claims.length > 0 && (
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><Layers size={11} /> Proposed Claims ({claims.length})</p>
              <ul className="space-y-1">
                {claims.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-gray-400 text-[11px] leading-relaxed">
                    <span className="text-gray-600 flex-shrink-0">•</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gates */}
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><ShieldAlert size={11} /> Governance Gates</p>
            <ul className="space-y-1">
              <li className="flex items-start gap-1.5 text-gray-300 text-[11px] leading-relaxed"><CheckCircle2 size={11} className="text-cyan-500 flex-shrink-0 mt-0.5" /><strong className="text-white">Gate 0 — Literature & harm screen:</strong> map all claims to falsifiable endpoints; export-control review for EM-emission hardware.</li>
              <li className="flex items-start gap-1.5 text-gray-300 text-[11px] leading-relaxed"><CheckCircle2 size={11} className="text-cyan-500 flex-shrink-0 mt-0.5" /><strong className="text-white">Gate 1 — In-vitro / bench falsification:</strong> exposed vs sham, pre-registered endpoints, null-result path mandatory.</li>
              <li className="flex items-start gap-1.5 text-gray-300 text-[11px] leading-relaxed"><CheckCircle2 size={11} className="text-cyan-500 flex-shrink-0 mt-0.5" /><strong className="text-white">Gate 2 — Scaled / animal:</strong> randomised, blinded, powered; IACUC if applicable.</li>
              <li className="flex items-start gap-1.5 text-gray-300 text-[11px] leading-relaxed"><CheckCircle2 size={11} className="text-cyan-500 flex-shrink-0 mt-0.5" /><strong className="text-white">Gate 3 — Regulatory:</strong> IND/IMD filings; no human medical use without clearance.</li>
            </ul>
          </div>

          {/* Digital products */}
          {inv.digitalProducts && inv.digitalProducts.length > 0 && (
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Digital Products</p>
              <div className="flex flex-wrap gap-1.5">
                {inv.digitalProducts.map((d, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 rounded bg-gray-800 border border-gray-700 text-gray-400">{d}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function InventionBuildPlans() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(NEW_INVENTIONS.map((i) => i.category).filter(Boolean))).sort()],
    []
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return NEW_INVENTIONS.filter((inv) => {
      if (cat !== "all" && inv.category !== cat) return false;
      if (!q) return true;
      const hay = [inv.name, inv.fusion, inv.mechanism, inv.category, (inv.tags || []).join(" ")].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [search, cat]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900/80 px-5 py-4 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link to="/invention-forge" className="text-gray-400 hover:text-white"><ArrowLeft size={16} /></Link>
            <div className="w-10 h-10 rounded-xl bg-orange-950/50 border border-orange-800 flex items-center justify-center">
              <Wrench size={20} className="text-orange-400" />
            </div>
            <div>
              <h1 className="text-base font-black leading-tight">Invention Build Plans</h1>
              <p className="text-gray-500 text-xs">50 new merged inventions · 3-phase build plan + components + governance gates</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-950/60 border border-red-800 text-red-400 uppercase tracking-wider">Not for Sale</span>
        </div>
      </div>

      <div className="bg-amber-950/20 border-b border-amber-800/40 px-5 py-2">
        <div className="max-w-5xl mx-auto flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-amber-200/70 text-[11px] leading-relaxed">
            All 50 inventions fuse suppressed-tech, Vedic, esoteric, and scalar-EM concepts. Their mechanisms are <strong className="text-amber-300">unverified hypotheses</strong>, not validated science. Build plans are research-direction scaffolds: every claim must pass falsification (Gate 1) before any reliance or disclosure. No medical or energy-output claim is made.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-5">
        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap mb-5">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search inventions, mechanisms, tags..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-gray-600" />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-3 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm focus:outline-none focus:border-gray-600">
            {categories.map((c) => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
          </select>
          <span className="text-xs text-gray-500">{filtered.length} of {NEW_INVENTIONS.length}</span>
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {filtered.map((inv) => <InventionCard key={inv.id} inv={inv} />)}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Package size={40} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 font-bold text-sm">No inventions match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}