// ── BOM Section Component (Section 13) ─────────────────────────────────────
// Renders the auto-generated Conceptual Bill of Materials inside the Device Build Plan.

import { FileStack, Cpu, Zap, Radio, Activity, Box, Code, Package, AlertTriangle, History } from "lucide-react";
import { BOM_LABEL, BOM_SUBLABEL, BOM_DISCLAIMER, BOM_NOTES } from "@/lib/bomGenerator";

function BomLabel() {
  return (
    <div className="bg-amber-950/40 border border-amber-700/50 rounded-lg px-3 py-2 mb-4">
      <p className="text-amber-300 font-black text-[10px] uppercase tracking-wider leading-tight">{BOM_LABEL}</p>
      <p className="text-amber-400/80 text-[10px] mt-0.5">{BOM_SUBLABEL}</p>
      <p className="text-amber-400/80 text-[10px]">{BOM_DISCLAIMER}</p>
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

function CategoryBadge({ category }) {
  const colors = {
    "Electronics": "bg-cyan-900/40 text-cyan-300 border-cyan-800",
    "Mechanical": "bg-amber-900/40 text-amber-300 border-amber-800",
    "Mechanical / Electronic": "bg-orange-900/40 text-orange-300 border-orange-800",
    "Electronic / Optical": "bg-purple-900/40 text-purple-300 border-purple-800",
    "Software": "bg-green-900/40 text-green-300 border-green-800",
    "Accessory": "bg-blue-900/40 text-blue-300 border-blue-800",
    "Consumable": "bg-pink-900/40 text-pink-300 border-pink-800",
  };
  return <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border whitespace-nowrap ${colors[category] || colors.Electronics}`}>{category}</span>;
}

function BomTable({ items }) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-800/50">
            <th className="text-left px-2 py-1.5 text-gray-400 font-semibold whitespace-nowrap">Item #</th>
            <th className="text-left px-2 py-1.5 text-gray-400 font-semibold whitespace-nowrap">Sub-Assembly</th>
            <th className="text-left px-2 py-1.5 text-gray-400 font-semibold">Component Description</th>
            <th className="text-left px-2 py-1.5 text-gray-400 font-semibold whitespace-nowrap">Category</th>
            <th className="text-center px-2 py-1.5 text-gray-400 font-semibold whitespace-nowrap">Qty</th>
            <th className="text-center px-2 py-1.5 text-gray-400 font-semibold whitespace-nowrap">Unit</th>
            <th className="text-left px-2 py-1.5 text-gray-400 font-semibold">Function</th>
            <th className="text-left px-2 py-1.5 text-gray-400 font-semibold whitespace-nowrap">Source Node</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, ri) => (
            <tr key={item.item} className="border-b border-gray-800/40 hover:bg-gray-800/20">
              <td className="px-2 py-1.5 text-amber-400 font-mono font-bold whitespace-nowrap">{item.item}</td>
              <td className="px-2 py-1.5 text-gray-300 font-semibold whitespace-nowrap">{item.subAssembly}</td>
              <td className="px-2 py-1.5 text-gray-300 align-top">{item.desc}</td>
              <td className="px-2 py-1.5 align-top"><CategoryBadge category={item.category} /></td>
              <td className="px-2 py-1.5 text-gray-300 text-center font-mono">{item.qty}</td>
              <td className="px-2 py-1.5 text-gray-400 text-center font-mono">{item.unit}</td>
              <td className="px-2 py-1.5 text-gray-400 align-top italic">{item.func}</td>
              <td className="px-2 py-1.5 text-cyan-400 font-mono text-[10px] whitespace-nowrap">{item.sourceNode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const ASSEMBLY_ICONS = {
  "1": Cpu,
  "2": Zap,
  "3": Radio,
  "4": Activity,
  "5": Box,
  "6": Code,
  "7": Package,
};

export default function BomSection({ bomData }) {
  if (!bomData) return null;
  const d = bomData;

  return (
    <div className="space-y-4">
      {/* BOM Header */}
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-900/40 border border-amber-700/50 flex items-center justify-center">
            <FileStack size={16} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-black text-base">Section 13 — Conceptual Bill of Materials (BOM)</h3>
            <p className="text-amber-400 font-mono text-xs">{d.docCode}</p>
          </div>
        </div>
        <BomLabel />
      </div>

      {/* BOM Header Block */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="13.1" title="BOM Header Block" icon={FileStack} />
        <BomLabel />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-gray-950/50 rounded-lg p-3">
            <p className="text-gray-500 text-[10px] uppercase tracking-wider">BOM Code</p>
            <p className="text-amber-400 font-mono font-bold text-sm mt-0.5">{d.header.bomCode}</p>
          </div>
          <div className="bg-gray-950/50 rounded-lg p-3 col-span-1 md:col-span-2">
            <p className="text-gray-500 text-[10px] uppercase tracking-wider">Device</p>
            <p className="text-white font-bold text-sm mt-0.5">{d.header.device}</p>
          </div>
          <div className="bg-gray-950/50 rounded-lg p-3">
            <p className="text-gray-500 text-[10px] uppercase tracking-wider">Version</p>
            <p className="text-white font-bold text-sm mt-0.5">{d.header.version}</p>
          </div>
          <div className="bg-gray-950/50 rounded-lg p-3">
            <p className="text-gray-500 text-[10px] uppercase tracking-wider">Date</p>
            <p className="text-white font-bold text-sm mt-0.5">{d.header.date}</p>
          </div>
          <div className="bg-gray-950/50 rounded-lg p-3">
            <p className="text-gray-500 text-[10px] uppercase tracking-wider">Status</p>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-900/50 text-amber-300 border border-amber-700 mt-0.5">{d.header.status}</span>
          </div>
          <div className="bg-gray-950/50 rounded-lg p-3 col-span-2 md:col-span-3">
            <p className="text-gray-500 text-[10px] uppercase tracking-wider">Prepared By</p>
            <p className="text-white font-bold text-sm mt-0.5">{d.header.preparedBy}</p>
          </div>
        </div>
      </div>

      {/* BOM Table — All Assemblies */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="13.2" title={`BOM Table — ${d.allItems.length} line items across 7 assemblies`} icon={FileStack} />
        <BomLabel />

        {/* Assembly sections */}
        <div className="space-y-4">
          {Object.entries(d.assemblies).map(([num, asm]) => {
            const Icon = ASSEMBLY_ICONS[num] || FileStack;
            return (
              <div key={num} className="border border-gray-800 rounded-xl overflow-hidden">
                <div className="bg-gray-800/40 px-3 py-2 flex items-center gap-2">
                  <Icon size={13} className="text-amber-400" />
                  <span className="text-amber-400 font-mono font-bold text-xs">Assembly {num}</span>
                  <span className="text-white font-bold text-sm">{asm.name}</span>
                  <span className="text-gray-500 text-xs ml-auto">{asm.items.length} items</span>
                </div>
                <div className="p-2">
                  <BomTable items={asm.items} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOM Notes */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="13.3" title="BOM Notes" icon={AlertTriangle} />
        <BomLabel />
        <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-4">
          <p className="text-gray-300 text-xs leading-relaxed">{BOM_NOTES}</p>
        </div>
      </div>

      {/* BOM Revision Log */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="13.4" title="BOM Revision Log" icon={History} />
        <BomLabel />
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="text-left px-2 py-1.5 text-gray-400 font-semibold">Rev</th>
                <th className="text-left px-2 py-1.5 text-gray-400 font-semibold">Date</th>
                <th className="text-left px-2 py-1.5 text-gray-400 font-semibold">Author</th>
                <th className="text-left px-2 py-1.5 text-gray-400 font-semibold">Changes</th>
              </tr>
            </thead>
            <tbody>
              {d.revisionLog.map((r, i) => (
                <tr key={i} className="border-b border-gray-800/40">
                  <td className="px-2 py-1.5 text-amber-400 font-mono font-bold">{r.rev}</td>
                  <td className="px-2 py-1.5 text-gray-300">{r.date}</td>
                  <td className="px-2 py-1.5 text-gray-300">{r.author}</td>
                  <td className="px-2 py-1.5 text-gray-400 italic">{r.changes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}