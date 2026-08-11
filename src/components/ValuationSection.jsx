// ── IP Valuation Framework Section Component (Section 15) ──────────────────
// Renders the auto-generated IP Valuation Framework inside the Device Build Plan.
// Section 5.4 Licensing Revenue Model has user-editable fields with live calculations.

import { useState } from "react";
import { DollarSign, TrendingUp, Scale, Calculator, BarChart3, Building2, Info } from "lucide-react";
import { VAL_LABEL, VAL_SUBLABEL, VAL_DISCLAIMER, VAL_FOOTER } from "@/lib/valuationGenerator";

function ValLabel() {
  return (
    <div className="bg-amber-950/40 border border-amber-700/50 rounded-lg px-3 py-2 mb-4">
      <p className="text-amber-300 font-black text-[10px] uppercase tracking-wider leading-tight">{VAL_LABEL}</p>
      <p className="text-amber-400/80 text-[10px] mt-0.5">{VAL_SUBLABEL}</p>
      <p className="text-amber-400/80 text-[10px] leading-relaxed">{VAL_DISCLAIMER}</p>
    </div>
  );
}

function SectionHeader({ num, title, icon: Icon }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-7 h-7 rounded-lg bg-amber-900/30 border border-amber-700/40 flex items-center justify-center flex-shrink-0">
        <Icon size={13} className="text-amber-400" />
      </div>
      <h4 className="text-amber-300 font-bold text-sm">
        <span className="text-amber-500 font-mono">{num}</span> {title}
      </h4>
    </div>
  );
}

function ImportanceBadge({ importance }) {
  const colors = {
    "Critical": "bg-red-900/50 text-red-300 border-red-800",
    "High": "bg-amber-900/50 text-amber-300 border-amber-800",
    "Medium": "bg-blue-900/50 text-blue-300 border-blue-800",
    "Low": "bg-gray-800 text-gray-400 border-gray-700",
  };
  return <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border whitespace-nowrap ${colors[importance] || colors.Medium}`}>{importance}</span>;
}

function ScoreBar({ score }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden flex-shrink-0">
        <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" style={{ width: `${score * 10}%` }} />
      </div>
      <span className="text-amber-400 font-bold text-xs font-mono">{score}/10</span>
    </div>
  );
}

// ── Licensing Revenue Model with editable fields ──
function LicensingRevenueModel({ model }) {
  const [structA, setStructA] = useState({
    royaltyRate: model.structureA.royaltyRate,
    licenseeYear3Revenue: model.structureA.licenseeYear3Revenue,
    discountRate: model.structureA.discountRate,
  });
  const [structB, setStructB] = useState({
    upfrontFee: model.structureB.upfrontFee,
    royaltyRate: model.structureB.royaltyRate,
    licenseeYear3Revenue: model.structureB.licenseeYear3Revenue,
  });
  const [structC, setStructC] = useState({
    lumpSum: model.structureC.lumpSum,
    ipRemainingLife: model.structureC.ipRemainingLife,
  });

  // Calculations
  const annualRoyaltyA = (structA.royaltyRate / 100) * structA.licenseeYear3Revenue;
  const tenYearA = annualRoyaltyA * 7.4; // approx 10yr discounted at ~12% → factor

  const annualRoyaltyB = (structB.royaltyRate / 100) * structB.licenseeYear3Revenue;
  const tenYearB = structB.upfrontFee + annualRoyaltyB * 7.4;

  const impliedAnnualC = structC.lumpSum / Math.max(1, structC.ipRemainingLife);

  const inputClass = "bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-xs w-20 focus:border-amber-600 focus:outline-none";
  const calcClass = "text-amber-400 font-bold font-mono";

  return (
    <div className="space-y-4">
      {/* Structure A */}
      <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-4">
        <p className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-3">Structure A — Royalty on Net Revenue</p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-gray-500 text-[10px] uppercase">Royalty Rate (%)</label>
            <input type="number" value={structA.royaltyRate} onChange={e => setStructA({ ...structA, royaltyRate: parseFloat(e.target.value) || 0 })} className={inputClass} />
          </div>
          <div>
            <label className="text-gray-500 text-[10px] uppercase">Licensee Yr3 Revenue ($M)</label>
            <input type="number" value={structA.licenseeYear3Revenue} onChange={e => setStructA({ ...structA, licenseeYear3Revenue: parseFloat(e.target.value) || 0 })} className={inputClass} />
          </div>
          <div>
            <label className="text-gray-500 text-[10px] uppercase">Discount Rate (%)</label>
            <input type="number" value={structA.discountRate} onChange={e => setStructA({ ...structA, discountRate: parseFloat(e.target.value) || 0 })} className={inputClass} />
          </div>
          <div>
            <label className="text-gray-500 text-[10px] uppercase">Annual Royalty ($M)</label>
            <p className={calcClass}>$ {annualRoyaltyA.toFixed(2)}M</p>
          </div>
          <div className="col-span-2">
            <label className="text-gray-500 text-[10px] uppercase">10-Year Royalty Stream (Discounted)</label>
            <p className={`${calcClass} text-base`}>$ {tenYearA.toFixed(2)}M</p>
          </div>
        </div>
      </div>

      {/* Structure B */}
      <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-4">
        <p className="text-green-400 font-bold text-xs uppercase tracking-wider mb-3">Structure B — Upfront Fee + Royalty</p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-gray-500 text-[10px] uppercase">Upfront Fee ($M)</label>
            <input type="number" value={structB.upfrontFee} onChange={e => setStructB({ ...structB, upfrontFee: parseFloat(e.target.value) || 0 })} className={inputClass} />
          </div>
          <div>
            <label className="text-gray-500 text-[10px] uppercase">Ongoing Royalty (%)</label>
            <input type="number" value={structB.royaltyRate} onChange={e => setStructB({ ...structB, royaltyRate: parseFloat(e.target.value) || 0 })} className={inputClass} />
          </div>
          <div>
            <label className="text-gray-500 text-[10px] uppercase">Licensee Yr3 Revenue ($M)</label>
            <input type="number" value={structB.licenseeYear3Revenue} onChange={e => setStructB({ ...structB, licenseeYear3Revenue: parseFloat(e.target.value) || 0 })} className={inputClass} />
          </div>
          <div>
            <label className="text-gray-500 text-[10px] uppercase">10-Year Total Projected Value</label>
            <p className={`${calcClass} text-base`}>$ {tenYearB.toFixed(2)}M</p>
          </div>
        </div>
      </div>

      {/* Structure C */}
      <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-4">
        <p className="text-purple-400 font-bold text-xs uppercase tracking-wider mb-3">Structure C — Exclusive Lump Sum</p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-gray-500 text-[10px] uppercase">Lump Sum ($M)</label>
            <input type="number" value={structC.lumpSum} onChange={e => setStructC({ ...structC, lumpSum: parseFloat(e.target.value) || 0 })} className={inputClass} />
          </div>
          <div>
            <label className="text-gray-500 text-[10px] uppercase">IP Remaining Life (years)</label>
            <input type="number" value={structC.ipRemainingLife} onChange={e => setStructC({ ...structC, ipRemainingLife: parseFloat(e.target.value) || 0 })} className={inputClass} />
          </div>
          <div className="col-span-2">
            <label className="text-gray-500 text-[10px] uppercase">Implied Annual Value</label>
            <p className={`${calcClass} text-base`}>$ {impliedAnnualC.toFixed(2)}M / year</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ValuationSection({ valuationData }) {
  if (!valuationData) return null;
  const d = valuationData;

  return (
    <div className="space-y-4">
      {/* Valuation Header */}
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-900/40 border border-amber-700/50 flex items-center justify-center">
            <DollarSign size={16} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-black text-base">Section 15 — IP Valuation Framework</h3>
            <p className="text-amber-400 font-mono text-xs">{d.docCode}</p>
          </div>
        </div>
        <ValLabel />
      </div>

      {/* 5.1 Market Sizing */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="5.1" title="Market Sizing (TAM / SAM / SOM)" icon={TrendingUp} />
        <ValLabel />
        <div className="space-y-3">
          <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-4">
            <p className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">Total Addressable Market (TAM)</p>
            <p className="text-gray-400 text-xs italic mb-2">{d.marketSizing.tam.description}</p>
            <div className="flex items-center gap-3">
              <span className="text-white font-black text-lg">{d.marketSizing.tam.figure}</span>
              <span className="text-gray-500 text-[10px]">Source: {d.marketSizing.tam.source}</span>
            </div>
            <p className="text-amber-400/60 text-[10px] mt-1">⚠ {d.marketSizing.tam.citation}</p>
          </div>
          <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-4">
            <p className="text-green-400 font-bold text-xs uppercase tracking-wider mb-2">Serviceable Addressable Market (SAM)</p>
            <p className="text-gray-400 text-xs italic mb-2">{d.marketSizing.sam.description}</p>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-white font-black text-lg">{d.marketSizing.sam.figure}</span>
            </div>
            <p className="text-gray-500 text-[10px]">Rationale: {d.marketSizing.sam.rationale}</p>
          </div>
          <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-4">
            <p className="text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">Serviceable Obtainable Market (SOM)</p>
            <p className="text-gray-400 text-xs italic mb-2">{d.marketSizing.som.description}</p>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-white font-black text-lg">{d.marketSizing.som.figure}</span>
            </div>
            <p className="text-gray-500 text-[10px]">Assumptions: {d.marketSizing.som.assumptions}</p>
          </div>
        </div>
      </div>

      {/* 5.2 IP Asset Inventory & Strategic Value */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="5.2" title="IP Asset Inventory & Strategic Value" icon={Scale} />
        <ValLabel />
        <p className="text-gray-400 text-xs font-semibold mb-2">IP Asset Inventory</p>
        <div className="overflow-x-auto -mx-1 mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="text-left px-2 py-1.5 text-gray-400 font-semibold">Asset</th>
                <th className="text-left px-2 py-1.5 text-gray-400 font-semibold">Type</th>
                <th className="text-left px-2 py-1.5 text-gray-400 font-semibold">Protection Status</th>
                <th className="text-left px-2 py-1.5 text-gray-400 font-semibold">Strategic Importance</th>
                <th className="text-left px-2 py-1.5 text-gray-400 font-semibold">Est. IP Life</th>
              </tr>
            </thead>
            <tbody>
              {d.ipAssets.map((a, i) => (
                <tr key={i} className="border-b border-gray-800/40">
                  <td className="px-2 py-1.5 text-gray-300 font-semibold">{a.asset}</td>
                  <td className="px-2 py-1.5 text-gray-400">{a.type}</td>
                  <td className="px-2 py-1.5 text-gray-400">{a.protectionStatus}</td>
                  <td className="px-2 py-1.5"><ImportanceBadge importance={a.strategicImportance} /></td>
                  <td className="px-2 py-1.5 text-gray-400 font-mono text-[10px]">{a.ipLife}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-400 text-xs font-semibold mb-2">Strategic Value Matrix (scored 1–10)</p>
        <div className="space-y-2">
          {d.strategicValueMatrix.map((v, i) => (
            <div key={i} className="bg-gray-950/50 border border-gray-800 rounded-lg p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-gray-300 text-xs font-semibold">{v.driver}</p>
                <p className="text-gray-500 text-[10px] mt-0.5">{v.rationale}</p>
              </div>
              <ScoreBar score={v.score} />
            </div>
          ))}
          <div className="bg-amber-950/30 border border-amber-800/50 rounded-lg p-3 flex items-center justify-between">
            <p className="text-amber-300 font-bold text-sm">OVERALL IP STRATEGIC SCORE</p>
            <span className="text-amber-400 font-black text-xl font-mono">{d.overallScore} / 10</span>
          </div>
        </div>
      </div>

      {/* 5.3 Comparable Transactions */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="5.3" title="Comparable Transactions" icon={Building2} />
        <ValLabel />
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="text-left px-2 py-1.5 text-gray-400 font-semibold">Transaction</th>
                <th className="text-left px-2 py-1.5 text-gray-400 font-semibold">Year</th>
                <th className="text-left px-2 py-1.5 text-gray-400 font-semibold">Deal Type</th>
                <th className="text-left px-2 py-1.5 text-gray-400 font-semibold">Modality</th>
                <th className="text-left px-2 py-1.5 text-gray-400 font-semibold">Terms</th>
                <th className="text-left px-2 py-1.5 text-gray-400 font-semibold">Relevance</th>
              </tr>
            </thead>
            <tbody>
              {d.comparableTransactions.map((t, i) => (
                <tr key={i} className="border-b border-gray-800/40">
                  <td className="px-2 py-1.5 text-gray-300 font-semibold">{t.transaction}</td>
                  <td className="px-2 py-1.5 text-gray-400 font-mono">{t.year}</td>
                  <td className="px-2 py-1.5 text-gray-400">{t.dealType}</td>
                  <td className="px-2 py-1.5 text-gray-400">{t.modality}</td>
                  <td className="px-2 py-1.5 text-amber-400 font-mono text-[10px]">{t.terms}</td>
                  <td className="px-2 py-1.5 text-gray-500 text-[10px] italic">{t.relevance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 text-[10px] mt-2 italic">If no data available for your specific domain: "Comparable transactions not available for this domain. Engage IP broker for market comparables."</p>
      </div>

      {/* 5.4 Licensing Revenue Model */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="5.4" title="Licensing Revenue Model (3 Structures)" icon={Calculator} />
        <ValLabel />
        <p className="text-gray-500 text-[10px] mb-3 italic">Fill in assumptions — ZARP calculates outputs. Fields are editable.</p>
        <LicensingRevenueModel model={d.licensingModel} />
      </div>

      {/* 5.5 Three Valuation Methods */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="5.5" title="Three Valuation Methods Reference" icon={BarChart3} />
        <ValLabel />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-4">
            <p className="text-cyan-400 font-bold text-xs uppercase mb-1">Cost Approach</p>
            <p className="text-gray-500 text-[10px] italic mb-2">{d.valuationMethods.cost.description}</p>
            <div className="space-y-1 text-xs">
              <p className="text-gray-400">Dev hours: <span className="text-white font-mono">{d.valuationMethods.cost.devHours.toLocaleString()}h</span></p>
              <p className="text-gray-400">Hourly rate: <span className="text-white font-mono">${d.valuationMethods.cost.hourlyRate}/h</span></p>
              <p className="text-gray-400">Replacement cost:</p>
              <p className="text-cyan-400 font-black text-lg">$ {d.valuationMethods.cost.replacementCost.toFixed(1)}M</p>
            </div>
            <p className="text-gray-600 text-[10px] mt-2">{d.valuationMethods.cost.notes}</p>
          </div>
          <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-4">
            <p className="text-green-400 font-bold text-xs uppercase mb-1">Market Approach</p>
            <p className="text-gray-500 text-[10px] italic mb-2">{d.valuationMethods.market.description}</p>
            <p className="text-gray-400 text-xs">Estimated range:</p>
            <p className="text-green-400 font-black text-lg">{d.valuationMethods.market.range}</p>
            <p className="text-gray-600 text-[10px] mt-2">{d.valuationMethods.market.notes}</p>
          </div>
          <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-4">
            <p className="text-purple-400 font-bold text-xs uppercase mb-1">Income Approach</p>
            <p className="text-gray-500 text-[10px] italic mb-2">{d.valuationMethods.income.description}</p>
            <p className="text-gray-400 text-xs">Estimated range:</p>
            <p className="text-purple-400 font-black text-lg">{d.valuationMethods.income.range}</p>
            <p className="text-gray-600 text-[10px] mt-2">{d.valuationMethods.income.notes}</p>
          </div>
        </div>
        <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-3 flex items-start gap-2">
          <Info size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-amber-300 text-[10px] leading-relaxed">{d.footer}</p>
        </div>
      </div>
    </div>
  );
}