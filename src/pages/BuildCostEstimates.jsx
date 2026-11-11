import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, DollarSign, Package, Wrench, TrendingUp, AlertTriangle,
  Cpu, Layers, Search,
} from "lucide-react";
import { BOM_ITEMS as PRE_BOM, BOM_SUMMARY as PRE_SUM } from "../lib/prenatalPodSpecs";
import { BOM_ITEMS as NEU_BOM, BOM_SUMMARY as NEU_SUM } from "../lib/neuroRegenSpecs";
import { NEW_INVENTIONS } from "../lib/newInventions";

const fmt = (n) => (n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${Math.round(n)}`);

// Labor factor: EVT prototype labor ≈ 2.5× materials (engineering, winding, fab, integration, test)
const LABOR_FACTOR = 2.5;

// Path-to-market cost components (advisory, USD). Varies by device class.
// - engLabor: EVT/DVT engineering labor (already 2.5× materials)
// - softwareDev: embedded firmware, control system, HMI, audit logging, closed-loop dev
// - irbRegulatory: IRB/IACUC + IND/IMD filing + ethics + export-control
// - pilot: animal model + first-in-human safety study (DSMB, consent, monitoring)
const MARKET_PATH = {
  nrcp: { softwareDev: 65000, irbRegulatory: 150000, pilot: 420000, note: "Pediatric Class II investigational — strictest path: IRB + pediatric ethicist + IND/IMD + DSMB-gated first-in-human safety study." },
  nrc1: { softwareDev: 60000, irbRegulatory: 120000, pilot: 350000, note: "Adult research device: IRB + IACUC (animal) + IND/IMD + first-in-human safety. In-vitro falsification gate must pass before pilot." },
  therapy: { softwareDev: 85000, irbRegulatory: 90000, pilot: 250000, note: "Full-size 12-subsystem pod: larger software effort (BFAC + ACE + 9 modalities + diagnostics). Lighter regulatory if wellness-class; heavier if any medical claim." },
};

function totalToMarket(materials, labor, path) {
  return materials + labor + path.softwareDev + path.irbRegulatory + path.pilot;
}

function byCategory(items) {
  const m = {};
  items.forEach((it) => { m[it.category] = (m[it.category] || 0) + (Number(it.estCost) || 0) * (Number(it.qty) || 0); });
  return m;
}

// Heuristic per-invention materials estimate.
const CAT_MULT = {
  "Energy & Propulsion": 2.4,
  "Energy & Bio-Medicine": 1.6,
  "Bio-Medicine & Energy": 1.6,
  "Bio-Medicine": 1.3,
  "Water & Bio-Medicine": 1.4,
  "Consciousness & Mind": 1.5,
  "Diagnostics & Sensors": 1.8,
  "Materials & Nano": 1.7,
  "Agriculture & Environment": 1.2,
  "Education & Research": 0.8,
  "Ultimate Integration": 3.5,
};
const BASE_PER_COMPONENT = 140;

function estimateInvention(inv) {
  const compCount = (inv.components || []).length || 6;
  const mult = CAT_MULT[inv.category] || 1.4;
  const materials = Math.round(compCount * BASE_PER_COMPONENT * mult);
  const labor = Math.round(materials * LABOR_FACTOR);
  return { materials, labor, total: materials + labor, compCount };
}

// Per-invention path-to-market. Medical-ish categories carry IRB + clinical pilot;
// non-medical categories carry safety/CE + small field pilot only.
const MEDICAL_CATS = ["Bio-Medicine", "Bio-Medicine & Energy", "Energy & Bio-Medicine", "Water & Bio-Medicine", "Diagnostics & Sensors"];
function inventionMarket(inv) {
  const isMedical = MEDICAL_CATS.includes(inv.category);
  if (isMedical) {
    return { softwareDev: 20000, irbRegulatory: 45000, pilot: 85000, medical: true,
      note: "Medical-path: IRB + IND/IMD + small clinical pilot." };
  }
  return { softwareDev: 25000, irbRegulatory: 5000, pilot: 30000, medical: false,
    note: "Non-medical: safety/CE + bench/field pilot (no IRB)." };
}
function invTotalToMarket(inv, est) {
  const m = inventionMarket(inv);
  return est.materials + est.labor + m.softwareDev + m.irbRegulatory + m.pilot;
}

function CategoryBar({ byCat, total }) {
  const entries = Object.entries(byCat).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  return (
    <div>
      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Materials by Category</p>
      <div className="space-y-1.5">
        {entries.map(([cat, val]) => (
          <div key={cat} className="flex items-center gap-2">
            <span className="text-gray-400 text-[11px] w-24 flex-shrink-0 truncate">{cat}</span>
            <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 rounded-full" style={{ width: `${(val / total) * 100}%` }} />
            </div>
            <span className="text-gray-300 text-[11px] font-bold w-12 text-right">{fmt(val)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeviceCostCard({ name, code, path, materials, labor, market, lineItems, components, note, color, children }) {
  const [open, setOpen] = useState(false);
  const toMarket = totalToMarket(materials, labor, market);
  const rows = [
    { label: "Materials (BOM)", value: materials, color: "#06b6d4" },
    { label: "Engineering labor (EVT/DVT)", value: labor, color: "#f59e0b" },
    { label: "Software / firmware dev", value: market.softwareDev, color: "#a855f7" },
    { label: "IRB / IACUC + IND/IMD regulatory", value: market.irbRegulatory, color: "#ef4444" },
    { label: "Pilot study (animal + first-in-human)", value: market.pilot, color: "#22c55e" },
  ];
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden" style={{ borderTopColor: color, borderTopWidth: 3 }}>
      <button onClick={() => setOpen((o) => !o)} className="w-full text-left px-5 py-4 hover:bg-gray-800/40 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">{code}</span>
            </div>
            <h3 className="text-white font-bold text-sm">{name}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{lineItems} BOM line items · {components} components</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black" style={{ color }}>{fmt(toMarket)}</p>
            <p className="text-gray-600 text-[10px] uppercase tracking-wider">to bring to market</p>
          </div>
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-gray-800 space-y-3">
          {note && (
            <div className="bg-amber-950/20 border border-amber-800/40 rounded-lg px-3 py-2">
              <p className="text-amber-200/70 text-[11px] leading-relaxed">{note}</p>
            </div>
          )}
          {/* Path-to-market breakdown */}
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">Total Cost to Bring to Market</p>
            <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
              {rows.map((r, i) => (
                <div key={r.label} className={`flex items-center justify-between px-3 py-2 ${i < rows.length - 1 ? "border-b border-gray-800" : ""}`}>
                  <span className="flex items-center gap-2 text-gray-300 text-xs">
                    <span className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                    {r.label}
                  </span>
                  <span className="font-bold text-xs" style={{ color: r.color }}>{fmt(r.value)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-3 py-2.5 bg-gray-900 border-t border-gray-700">
                <span className="text-white font-bold text-xs">Total to bring to market</span>
                <span className="font-black text-sm" style={{ color }}>{fmt(toMarket)}</span>
              </div>
            </div>
            <p className="text-gray-600 text-[10px] mt-1.5 leading-relaxed">{market.note}</p>
          </div>
          {children}
          {path && (
            <Link to={path} className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs font-bold">
              View build plan →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function BuildCostEstimates() {
  const [search, setSearch] = useState("");

  const preByCat = useMemo(() => byCategory(PRE_BOM), []);
  const neuByCat = useMemo(() => byCategory(NEU_BOM), []);

  const preMaterials = PRE_SUM.estimatedCost;
  const neuMaterials = NEU_SUM.estimatedCost;

  const therapyMaterials = 24500;
  const therapyLabor = Math.round(therapyMaterials * LABOR_FACTOR);

  const nrcpToMarket = totalToMarket(preMaterials, Math.round(preMaterials * LABOR_FACTOR), MARKET_PATH.nrcp);
  const nrc1ToMarket = totalToMarket(neuMaterials, Math.round(neuMaterials * LABOR_FACTOR), MARKET_PATH.nrc1);
  const therapyToMarket = totalToMarket(therapyMaterials, therapyLabor, MARKET_PATH.therapy);

  const invEstimates = useMemo(
    () => NEW_INVENTIONS.map((inv) => {
      const est = estimateInvention(inv);
      const market = inventionMarket(inv);
      return { inv, est, market, toMarket: est.materials + est.labor + market.softwareDev + market.irbRegulatory + market.pilot };
    }),
    []
  );
  const invTotalMaterials = invEstimates.reduce((s, e) => s + e.est.materials, 0);
  const invTotalLabor = invEstimates.reduce((s, e) => s + e.est.labor, 0);
  const invTotalToMarket = invEstimates.reduce((s, e) => s + e.toMarket, 0);

  const grandTotal = nrcpToMarket + nrc1ToMarket + therapyToMarket + invTotalToMarket;

  const filteredInv = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return invEstimates;
    return invEstimates.filter(({ inv }) =>
      [inv.name, inv.fusion, inv.category, (inv.tags || []).join(" ")].join(" ").toLowerCase().includes(q)
    );
  }, [search, invEstimates]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900/80 px-5 py-4 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-400 hover:text-white"><ArrowLeft size={16} /></Link>
            <div className="w-10 h-10 rounded-xl bg-green-950/50 border border-green-800 flex items-center justify-center">
              <DollarSign size={20} className="text-green-400" />
            </div>
            <div>
              <h1 className="text-base font-black leading-tight">Build Cost Estimates</h1>
              <p className="text-gray-500 text-xs">Materials + engineering labor + software dev + IRB + pilot — total to bring to market</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-950/60 border border-red-800 text-red-400 uppercase tracking-wider">Not for Sale</span>
        </div>
      </div>

      <div className="bg-amber-950/20 border-b border-amber-800/40 px-5 py-2">
      <div className="max-w-5xl mx-auto flex items-start gap-2">
        <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-amber-200/70 text-[11px] leading-relaxed">
          <strong className="text-amber-300">Advisory estimates only.</strong> Each device's "total to bring to market" = materials + engineering labor (EVT/DVT) + software/firmware dev + IRB/IACUC + IND/IMD regulatory + pilot study (animal + first-in-human). No guarantee of final cost. Research-only devices — not for sale.
        </p>
      </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-6 space-y-6">
        {/* Summary cards — total to bring to market */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "NRC-P to market", val: fmt(nrcpToMarket), sub: "materials + labor + sw + IRB + pilot", color: "#ec4899", icon: <Package size={14} /> },
            { label: "NRC-1 to market", val: fmt(nrc1ToMarket), sub: "materials + labor + sw + IRB + pilot", color: "#06b6d4", icon: <Package size={14} /> },
            { label: "Therapy Pod Pro", val: fmt(therapyToMarket), sub: "to market (heuristic BOM)", color: "#a855f7", icon: <Wrench size={14} /> },
            { label: "50 Inventions to market", val: fmt(invTotalToMarket), sub: "all 50, full path", color: "#f97316", icon: <Layers size={14} /> },
            { label: "Grand total (all devices)", val: fmt(grandTotal), sub: "everything to market", color: "#22c55e", icon: <TrendingUp size={14} /> },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4" style={{ borderTopColor: s.color, borderTopWidth: 2 }}>
              <div className="flex items-center gap-2 mb-2" style={{ color: s.color }}>{s.icon}<span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{s.label}</span></div>
              <p className="text-xl font-black text-white">{s.val}</p>
              <p className="text-gray-600 text-[10px]">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Device detail cards */}
        <div className="space-y-3">
          <h2 className="text-white font-bold text-sm flex items-center gap-2"><Cpu size={14} className="text-cyan-400" /> Device Build Costs</h2>

          <DeviceCostCard name="Prenatal Repair Pod (NRC-P)" code="ZA-NRC-P-001" path="/prenatal-repair-pod"
            materials={preMaterials} labor={Math.round(preMaterials * LABOR_FACTOR)} market={MARKET_PATH.nrcp}
            lineItems={PRE_SUM.totalLineItems} components={PRE_SUM.totalComponents}
            color="#ec4899"
            note="Real BOM. Pediatric variant — 40 line items, 69 components. Pediatric caps and hardwired lockout included. Gold-nanoparticle carrier ($600) is IND-gated optional.">
            <CategoryBar byCat={preByCat} total={preMaterials} />
          </DeviceCostCard>

          <DeviceCostCard name="Neuro Regeneration Chamber (NRC-1)" code="ZA-NRC-001" path="/neuro-regen-chamber"
            materials={neuMaterials} labor={Math.round(neuMaterials * LABOR_FACTOR)} market={MARKET_PATH.nrc1}
            lineItems={NEU_SUM.totalLineItems} components={NEU_SUM.totalComponents}
            color="#06b6d4"
            note="Real BOM. Research prototype — 40 line items, 82 components. In-vitro epigenetic interface included on separate shielded bench. Carbon-fiber cradle ($700) + titanium frame ($900) are the largest structural costs.">
            <CategoryBar byCat={neuByCat} total={neuMaterials} />
          </DeviceCostCard>

          <DeviceCostCard name="Therapy Pod Pro (AATCS-P1)" code="ZA-TP-001" path="/therapy-pod-pro"
            materials={therapyMaterials} labor={therapyLabor} market={MARKET_PATH.therapy}
            lineItems={67} components={842}
            color="#a855f7"
            note="Heuristic estimate. The Therapy Pod Pro BOM lists 67 line items / 842 components across 12 subsystems but does not carry per-item costs, so materials are estimated at ~$18k–$31k (midpoint shown). Full-size adult pod with orgone envelope, scalar coil array, Prioré modulator, vortex water, and diagnostics.">
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
              <p className="text-gray-400 text-[11px] leading-relaxed">
                <strong className="text-white">Range:</strong> ~$18,000–$31,000 materials · ~$45,000–$78,000 with EVT labor. A formal per-item costed BOM is needed for a firm quote.
              </p>
            </div>
          </DeviceCostCard>
        </div>

        {/* 50 inventions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-white font-bold text-sm flex items-center gap-2"><Layers size={14} className="text-orange-400" /> 50 New Inventions — Cost Estimates</h2>
            <div className="text-xs text-gray-500">
              Build: <span className="text-white font-bold">{fmt(invTotalMaterials)}</span> materials · <span className="text-white font-bold">{fmt(invTotalLabor)}</span> labor · <span className="text-green-400 font-bold">{fmt(invTotalToMarket)}</span> total to bring to market
            </div>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search inventions..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-gray-600" />
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {filteredInv.map(({ inv, est, market, toMarket }) => (
              <div key={inv.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-xs leading-snug">{inv.name}</p>
                    <p className="text-gray-600 text-[10px] mt-0.5">{inv.id} · {inv.category} · {est.compCount} components · {market.medical ? "medical path" : "non-medical"}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-base font-black text-green-400">{fmt(toMarket)}</p>
                    <p className="text-gray-600 text-[9px]">build {fmt(est.total)} + path {fmt(toMarket - est.total)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredInv.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-10">No inventions match your search.</p>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-cyan-400" /> How "total to bring to market" is computed</h3>
          <ul className="space-y-2 text-gray-400 text-xs leading-relaxed">
            <li><strong className="text-white">Materials:</strong> NRC-P & NRC-1 = real BOM (qty × estCost). Therapy Pod Pro = heuristic (BOM has no per-item costs). 50 inventions = component count × $140 × category multiplier.</li>
            <li><strong className="text-white">Engineering labor (EVT/DVT):</strong> materials × 2.5 — winding, fab, integration, bench test.</li>
            <li><strong className="text-white">Software / firmware dev:</strong> embedded control, HMI, audit logging, closed-loop. NRC-P $65k · NRC-1 $60k · Therapy $85k · inventions $20–25k.</li>
            <li><strong className="text-white">IRB / IACUC + IND/IMD regulatory:</strong> ethics review + regulatory filing + export-control. NRC-P $150k (pediatric, strictest) · NRC-1 $120k · Therapy $90k · medical inventions $45k · non-medical $5k (safety/CE only).</li>
            <li><strong className="text-white">Pilot study:</strong> animal model + first-in-human safety (DSMB, consent, monitoring). NRC-P $420k · NRC-1 $350k · Therapy $250k · medical inventions $85k · non-medical $30k (field pilot).</li>
            <li><strong className="text-white">Still excluded:</strong> facility lease, IP filing fees, marketing, insurance, ongoing clinical-trial enrollment beyond the safety pilot. These can add $1M+ for a full pivotal trial.</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <Link to="/invention-build-plans" className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:bg-gray-700">Invention Build Plans</Link>
          <Link to="/prenatal-repair-pod" className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:bg-gray-700">Prenatal Repair Pod</Link>
          <Link to="/neuro-regen-chamber" className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:bg-gray-700">Neuro Regen Chamber</Link>
        </div>
      </div>
    </div>
  );
}