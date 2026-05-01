import { useState, useMemo } from "react";
import { X, Zap, GitCompare, CheckCircle2, XCircle, Minus } from "lucide-react";

// ── Synergy computation ───────────────────────────────────────────────────────
function computeSynergy(invA, invB) {
  const setA = new Set(invA.components.map(c => c.toLowerCase()));
  const setB = new Set(invB.components.map(c => c.toLowerCase()));
  const shared = [...setA].filter(c => setB.has(c));

  // Category synergy bonus
  const categoryPairs = {
    "Electromagnetic-Scalar EM": 35,
    "Scalar EM-Electromagnetic": 35,
    "Electromagnetic-Resonance": 30,
    "Resonance-Electromagnetic": 30,
    "Bioelectromagnetics-Torsion Fields": 28,
    "Torsion Fields-Bioelectromagnetics": 28,
    "Quantum Effects-Electromagnetic": 25,
    "Electromagnetic-Quantum Effects": 25,
    "Scalar EM-Resonance": 22,
    "Resonance-Scalar EM": 22,
  };

  const catKey = `${invA.category}-${invB.category}`;
  const catBonus = categoryPairs[catKey] || 10;

  // Component overlap score
  const overlapScore = shared.length > 0
    ? Math.round((shared.length / Math.min(setA.size, setB.size)) * 40)
    : 0;

  // Status bonus
  const statusScore = {
    "Patent Granted": 15,
    "Patent Pending": 10,
    "Prototype": 8,
    "Research Phase": 5,
    "Suppressed": 12, // intrigue bonus
  };
  const bonus = (statusScore[invA.status] || 5) + (statusScore[invB.status] || 5);
  const total = Math.min(99, catBonus + overlapScore + Math.round(bonus / 2));

  return { score: total, shared };
}

// ── Feature comparison matrix ─────────────────────────────────────────────────
const FEATURE_KEYS = [
  { key: "Moving Parts", check: (inv) => inv.specs.some(s => /moving/i.test(s)) ? "no" : "yes" },
  { key: "Patent Status", check: (inv) => inv.status },
  { key: "Category", check: (inv) => inv.category },
  { key: "Build Cost", check: (inv) => `$${inv.price}` },
  { key: "Primary Mechanism", check: (inv) => inv.specs[0] || "—" },
  { key: "Secondary Param", check: (inv) => inv.specs[1] || "—" },
];

function CompareCell({ value, label }) {
  const isYes = value === "yes";
  const isNo = value === "no";
  return (
    <div className="text-center px-2">
      {isYes ? (
        <span className="inline-flex items-center gap-1 text-green-400 text-xs font-bold">
          <CheckCircle2 size={12} /> Yes
        </span>
      ) : isNo ? (
        <span className="inline-flex items-center gap-1 text-red-400 text-xs font-bold">
          <XCircle size={12} /> No
        </span>
      ) : (
        <span className="text-gray-200 text-xs">{value}</span>
      )}
    </div>
  );
}

// ── Synergy Score Ring ─────────────────────────────────────────────────────────
function SynergyRing({ score }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? "#00ff88" : score >= 45 ? "#ffcc00" : "#ff4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg width="96" height="96" viewBox="0 0 96 96" className="absolute inset-0">
          <circle cx="48" cy="48" r={r} fill="none" stroke="#ffffff08" strokeWidth="8" />
          <circle
            cx="48" cy="48" r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            strokeDashoffset={circ / 4}
            style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-black text-2xl leading-none" style={{ color }}>{score}</span>
          <span className="text-gray-500 text-xs">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-bold" style={{ color }}>
        {score >= 70 ? "High Synergy" : score >= 45 ? "Moderate" : "Low Synergy"}
      </span>
    </div>
  );
}

// ── Main Comparator Component ─────────────────────────────────────────────────
export default function InventionComparator({ catalog, onClose }) {
  const [selA, setSelA] = useState(catalog[0]);
  const [selB, setSelB] = useState(catalog[1]);

  const { score, shared } = useMemo(() => computeSynergy(selA, selB), [selA, selB]);

  const allComponents = useMemo(() => {
    const setA = new Set(selA.components.map(c => c.toLowerCase()));
    const setB = new Set(selB.components.map(c => c.toLowerCase()));
    const all = new Set([...selA.components, ...selB.components]);
    return [...all].map(c => ({
      name: c,
      inA: setA.has(c.toLowerCase()),
      inB: setB.has(c.toLowerCase()),
      shared: setA.has(c.toLowerCase()) && setB.has(c.toLowerCase()),
    }));
  }, [selA, selB]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto"
      style={{ background: "rgba(0,0,10,0.75)", backdropFilter: "blur(10px)" }}>
      <div
        className="relative w-full mx-4 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{
          maxWidth: 760,
          maxHeight: "90vh",
          background: "rgba(0,0,28,0.97)",
          border: "1.5px solid #ffffff18",
          boxShadow: "0 0 60px rgba(0,255,255,0.08), 0 30px 80px rgba(0,0,0,0.8)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0"
          style={{ background: "linear-gradient(135deg, rgba(0,255,255,0.07) 0%, rgba(255,0,255,0.04) 100%)" }}>
          <div className="flex items-center gap-2">
            <GitCompare size={18} className="text-cyan-400" />
            <h2 className="text-white font-black text-lg">Invention Comparator</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800">3D Dashboard</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Selector Row */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 px-6 pt-5 pb-4 items-center">
            {/* A selector */}
            <div className="space-y-1">
              <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Invention A</p>
              <div className="grid grid-cols-2 gap-1.5">
                {catalog.map(inv => (
                  <button
                    key={inv.id}
                    onClick={() => { if (inv.id !== selB.id) setSelA(inv); }}
                    disabled={inv.id === selB.id}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-all disabled:opacity-30"
                    style={{
                      background: selA.id === inv.id ? inv.color + "22" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${selA.id === inv.id ? inv.color + "66" : "transparent"}`,
                      color: selA.id === inv.id ? inv.color : "#9ca3af",
                    }}
                  >
                    <span>{inv.emoji}</span>
                    <span className="font-semibold truncate">{inv.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* VS / synergy */}
            <div className="flex flex-col items-center gap-2">
              <SynergyRing score={score} />
              <div className="text-gray-600 text-xs font-bold">VS</div>
            </div>

            {/* B selector */}
            <div className="space-y-1">
              <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Invention B</p>
              <div className="grid grid-cols-2 gap-1.5">
                {catalog.map(inv => (
                  <button
                    key={inv.id}
                    onClick={() => { if (inv.id !== selA.id) setSelB(inv); }}
                    disabled={inv.id === selA.id}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-all disabled:opacity-30"
                    style={{
                      background: selB.id === inv.id ? inv.color + "22" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${selB.id === inv.id ? inv.color + "66" : "transparent"}`,
                      color: selB.id === inv.id ? inv.color : "#9ca3af",
                    }}
                  >
                    <span>{inv.emoji}</span>
                    <span className="font-semibold truncate">{inv.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Invention headers */}
          <div className="grid grid-cols-2 gap-3 px-6 pb-4">
            {[selA, selB].map(inv => (
              <div key={inv.id} className="rounded-xl p-4"
                style={{ background: inv.color + "12", border: `1px solid ${inv.color}33` }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{inv.emoji}</span>
                  <div>
                    <p className="text-white font-black text-sm leading-tight">{inv.name}</p>
                    <p className="text-xs" style={{ color: inv.color }}>{inv.tagline}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{inv.description}</p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded text-xs font-bold"
                    style={{ background: inv.color + "22", color: inv.color }}>{inv.status}</span>
                  <span className="text-gray-600 text-xs">{inv.patentNo}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <div className="px-6 pb-4">
            <p className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-3">Technical Breakdown</p>
            <div className="rounded-xl overflow-hidden border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                    <th className="text-left text-gray-500 text-xs uppercase py-2.5 px-4 font-bold">Feature</th>
                    <th className="text-center text-xs uppercase py-2.5 px-4 font-bold" style={{ color: selA.color }}>{selA.emoji} {selA.name}</th>
                    <th className="text-center text-xs uppercase py-2.5 px-4 font-bold" style={{ color: selB.color }}>{selB.emoji} {selB.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_KEYS.map((feat, i) => (
                    <tr key={feat.key}
                      className="border-t border-white/5"
                      style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" }}>
                      <td className="py-2.5 px-4 text-gray-400 text-xs font-semibold">{feat.key}</td>
                      <td className="py-2.5 px-4"><CompareCell value={feat.check(selA)} /></td>
                      <td className="py-2.5 px-4"><CompareCell value={feat.check(selB)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Component overlap */}
          <div className="px-6 pb-5">
            <div className="flex items-center gap-2 mb-3">
              <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Component Matrix</p>
              {shared.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-950/50 text-green-300 border border-green-800">
                  {shared.length} shared
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto">
              {allComponents.map((comp, i) => (
                <div key={i}
                  className="grid grid-cols-[1fr_2fr_1fr] gap-2 items-center py-1.5 px-3 rounded-lg text-xs"
                  style={{ background: comp.shared ? "rgba(0,255,136,0.07)" : "rgba(255,255,255,0.03)" }}>
                  {/* A indicator */}
                  <div className="flex justify-end">
                    {comp.inA
                      ? <span className="px-2 py-0.5 rounded font-bold" style={{ background: selA.color + "22", color: selA.color }}>✓ A</span>
                      : <span className="text-gray-700">—</span>}
                  </div>
                  {/* Name */}
                  <div className="text-center font-semibold" style={{ color: comp.shared ? "#00ff88" : "#9ca3af" }}>
                    {comp.shared && <Zap size={10} className="inline mr-1 text-green-400" />}
                    {comp.name}
                  </div>
                  {/* B indicator */}
                  <div className="flex justify-start">
                    {comp.inB
                      ? <span className="px-2 py-0.5 rounded font-bold" style={{ background: selB.color + "22", color: selB.color }}>✓ B</span>
                      : <span className="text-gray-700">—</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Synergy insight */}
            <div className="mt-4 p-4 rounded-xl border"
              style={{
                background: score >= 70 ? "rgba(0,255,136,0.06)" : score >= 45 ? "rgba(255,204,0,0.06)" : "rgba(255,68,68,0.06)",
                borderColor: score >= 70 ? "#00ff8833" : score >= 45 ? "#ffcc0033" : "#ff444433",
              }}>
              <p className="text-xs font-bold mb-1"
                style={{ color: score >= 70 ? "#00ff88" : score >= 45 ? "#ffcc00" : "#ff6666" }}>
                ⚡ Synergy Analysis
              </p>
              <p className="text-gray-300 text-xs leading-relaxed">
                {score >= 70
                  ? `Strong hybrid potential — ${selA.name} and ${selB.name} share ${shared.length > 0 ? `${shared.length} core component${shared.length > 1 ? "s" : ""}` : "complementary EM principles"}, making combined development highly viable. Integration could yield a novel system exceeding either invention individually.`
                  : score >= 45
                  ? `Moderate integration potential — these inventions occupy adjacent technology domains. Cross-pollination is possible with engineering bridgework between the ${selA.category} and ${selB.category} subsystems.`
                  : `Low component overlap — ${selA.name} and ${selB.name} operate on fundamentally different principles. Hybrid development would require substantial new IP. High novelty score for patent strategy.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}