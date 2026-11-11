import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import {
  PRD_SECTIONS, PDR_SECTIONS, BOM_ITEMS, BOM_SUMMARY,
  SOW_SECTIONS, EVT_SECTIONS, DVT_SECTIONS, FALSIFICATION_TESTS,
} from "@/lib/neuroRegenSpecs";

const VMAP = { true: "verified", partial: "partial", false: "speculative" };
const VC = {
  verified: { label: "Verified", color: "#22c55e", Icon: CheckCircle2 },
  partial: { label: "Partial", color: "#f59e0b", Icon: AlertTriangle },
  speculative: { label: "Speculative", color: "#ef4444", Icon: XCircle },
};

function DocSection({ title, sections, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden" style={{ borderLeftColor: color, borderLeftWidth: 3 }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-800/50 transition-colors">
        <span className="text-white font-bold text-sm">{title}</span>
        {open ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
      </button>
      {open && (
        <div className="px-5 pb-4 space-y-3 border-t border-gray-800">
          {sections.map((s, i) => (
            <div key={i}>
              <p className="text-cyan-400 text-xs font-bold mt-3 mb-1">{s.heading}</p>
              {s.body && <p className="text-gray-300 text-xs leading-relaxed mb-2">{s.body}</p>}
              {s.bullets && (
                <ul className="space-y-1.5">
                  {s.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-2 text-gray-300 text-xs leading-relaxed">
                      <CheckCircle2 size={11} className="text-cyan-500 flex-shrink-0 mt-0.5" />{b}
                    </li>
                  ))}
                </ul>
              )}
              {s.table && (
                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-xs border border-gray-800 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-800 text-gray-400">
                        {Object.keys(s.table[0]).map((c) => (
                          <th key={c} className="text-left px-2 py-1.5 font-bold uppercase text-[10px] tracking-wider">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {s.table.map((row, ri) => (
                        <tr key={ri} className="hover:bg-gray-800/30">
                          {Object.keys(s.table[0]).map((c) => (
                            <td key={c} className="px-2 py-1.5 text-gray-300 align-top">{row[c]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BomTable() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between flex-wrap gap-2">
        <span className="text-white font-bold text-sm">BOM — 40 line items</span>
        <span className="text-gray-500 text-xs">{BOM_SUMMARY.totalComponents} components · est ${BOM_SUMMARY.estimatedCost.toLocaleString()}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800 text-gray-400">
              <th className="text-left px-2 py-2 font-bold uppercase text-[10px]">#</th>
              <th className="text-left px-2 py-2 font-bold uppercase text-[10px]">Ref</th>
              <th className="text-left px-2 py-2 font-bold uppercase text-[10px]">Category</th>
              <th className="text-left px-2 py-2 font-bold uppercase text-[10px]">Description</th>
              <th className="text-center px-2 py-2 font-bold uppercase text-[10px]">Qty</th>
              <th className="text-right px-2 py-2 font-bold uppercase text-[10px]">$</th>
              <th className="text-left px-2 py-2 font-bold uppercase text-[10px]">Supplier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {BOM_ITEMS.map((it) => (
              <tr key={it.item} className="hover:bg-gray-800/30">
                <td className="px-2 py-1.5 text-gray-600">{it.item}</td>
                <td className="px-2 py-1.5 text-cyan-400 font-mono text-[11px]">{it.refDes}</td>
                <td className="px-2 py-1.5 text-gray-400">{it.category}</td>
                <td className="px-2 py-1.5 text-gray-200">{it.description}</td>
                <td className="px-2 py-1.5 text-gray-300 text-center">{it.qty}</td>
                <td className="px-2 py-1.5 text-green-400 text-right">{it.estCost}</td>
                <td className="px-2 py-1.5 text-gray-500">{it.supplier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FalsificationTable() {
  return (
    <div className="bg-gray-900 border border-amber-800/50 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-amber-800/30 bg-amber-950/20">
        <span className="text-amber-300 font-bold text-sm">Addendum A — Hypothesis Falsification & Gates</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800 text-gray-400">
              <th className="text-left px-2 py-2 font-bold uppercase text-[10px]">Test</th>
              <th className="text-left px-2 py-2 font-bold uppercase text-[10px]">Hypothesis</th>
              <th className="text-left px-2 py-2 font-bold uppercase text-[10px]">Method</th>
              <th className="text-left px-2 py-2 font-bold uppercase text-[10px]">Pass criteria</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {FALSIFICATION_TESTS.map((a, i) => (
              <tr key={i} className="hover:bg-gray-800/30">
                <td className="px-2 py-1.5 text-cyan-400 font-mono text-[11px]">{a.test}</td>
                <td className="px-2 py-1.5 text-gray-200">{a.hypothesis}</td>
                <td className="px-2 py-1.5 text-gray-300">{a.method}</td>
                <td className="px-2 py-1.5 text-amber-300">{a.pass}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function NeuroRegenEngineeringDocs() {
  return (
    <div className="space-y-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-500 font-mono text-xs">ZA-NRC-001</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-800">Not for Sale</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-950/40 text-yellow-400 border border-yellow-800">Research Only</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950/60 text-blue-400 border border-blue-800">Rev B</span>
            </div>
            <h2 className="text-white font-black text-lg">Neuro Regeneration Chamber — Engineering Document Set</h2>
            <p className="text-gray-500 text-xs mt-1">PRD · PDR · BOM · SOW · EVT · DVT · Falsification Addendum</p>
          </div>
        </div>
      </div>

      <DocSection title="PRD — Product Requirements Document" sections={PRD_SECTIONS} color="#3b82f6" />
      <DocSection title="PDR — Preliminary Design Review" sections={PDR_SECTIONS} color="#3b82f6" />
      <BomTable />
      <DocSection title="SOW — Statement of Work" sections={SOW_SECTIONS} color="#a855f7" />
      <DocSection title="EVT — Engineering Validation Test Plan" sections={EVT_SECTIONS} color="#22c55e" />
      <DocSection title="DVT — Design Validation Test Plan" sections={DVT_SECTIONS} color="#22c55e" />
      <FalsificationTable />
    </div>
  );
}