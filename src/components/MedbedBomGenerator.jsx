import { useState, useMemo } from "react";
import { Package, Download, RefreshCw, ChevronDown, ChevronUp, Layers } from "lucide-react";
import { generateBom } from "@/lib/medbedBomGenerator";

const CATEGORY_COLORS = {
  Structural: "#64748b",
  Electrical: "#f59e0b",
  PBM: "#ef4444",
  PEMF: "#3b82f6",
  VAT: "#a855f7",
  FIT: "#f97316",
  SFT: "#06b6d4",
  MCT: "#ec4899",
  HIT: "#14b8a6",
  NIA: "#2dd4bf",
  BIO: "#10b981",
  "ASD-Specific": "#06b6d4",
  "MIL-Specific": "#f59e0b",
};

export default function MedbedBomGenerator({ device }) {
  const [generated, setGenerated] = useState(false);
  const [expandedCats, setExpandedCats] = useState({});

  const bom = useMemo(() => generateBom(device), [device.id]);

  const handleGenerate = () => setGenerated(true);

  const toggleCat = (cat) => setExpandedCats((p) => ({ ...p, [cat]: !p[cat] }));

  const handleExport = () => {
    const rows = [
      ["Ref", "Category", "Description", "Qty", "Unit Cost ($)", "Ext Cost ($)", "Supplier", "Notes"],
      ...bom.lineItems.map((l) => [l.ref, l.category, l.desc, l.qty, l.unitCost.toFixed(2), l.extCost.toFixed(2), l.supplier, l.notes]),
      ["", "", "", "", "", "TOTAL", bom.totalCost.toFixed(2), ""],
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${device.id}-BOM.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories = Object.keys(bom.categorySummary);

  return (
    <div className="space-y-4">
      {/* Generator header */}
      <div className="bg-gradient-to-r from-gray-950 to-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: device.color + "15", border: `1px solid ${device.color}40` }}>
              <Package size={20} style={{ color: device.color }} />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">BOM Generator — {device.name}</h3>
              <p className="text-gray-500 text-xs mt-0.5">
                Auto-derives {bom.totalLineItems} line items from {device.modalities.length} modalities + structural + electrical specs
                {device.id === "zds-ptsd-pod" ? " (MIL-spec variants)" : device.id === "aatcs-p1-asd" ? " (ASD-specific variants)" : ""}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!generated ? (
              <button onClick={handleGenerate} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors" style={{ backgroundColor: device.color }}>
                <RefreshCw size={13} /> Generate BOM
              </button>
            ) : (
              <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white text-xs font-bold transition-colors">
                <Download size={13} /> Export CSV
              </button>
            )}
          </div>
        </div>
      </div>

      {!generated ? (
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-8 text-center">
          <Layers size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Click "Generate BOM" to auto-compile the complete bill of materials</p>
          <p className="text-gray-700 text-xs mt-1">Components derived from modality specs, structural assembly, and electrical systems</p>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-600 text-[10px] uppercase tracking-wider">Line Items</p>
              <p className="text-white font-black text-xl">{bom.totalLineItems}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-600 text-[10px] uppercase tracking-wider">Categories</p>
              <p className="text-white font-black text-xl">{categories.length}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-600 text-[10px] uppercase tracking-wider">Total Cost</p>
              <p className="font-black text-xl" style={{ color: device.color }}>${bom.totalCost.toLocaleString()}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-600 text-[10px] uppercase tracking-wider">Generated</p>
              <p className="text-white font-bold text-xs mt-1">{new Date(bom.generatedAt).toLocaleTimeString()}</p>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Cost Breakdown by Category</p>
            <div className="space-y-2">
              {categories.map((cat) => {
                const data = bom.categorySummary[cat];
                const pct = (data.cost / bom.totalCost) * 100;
                const color = CATEGORY_COLORS[cat] || "#64748b";
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-gray-400 text-xs font-semibold w-28 flex-shrink-0">{cat}</span>
                    <div className="flex-1 h-4 bg-gray-950 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: pct + "%", backgroundColor: color }} />
                    </div>
                    <span className="text-gray-300 text-xs font-bold w-16 text-right">${data.cost.toLocaleString()}</span>
                    <span className="text-gray-600 text-[10px] w-10 text-right">{data.count} items</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOM table */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <p className="text-white font-bold text-sm">Complete Bill of Materials</p>
              <p className="text-gray-600 text-xs">{device.id === "zds-ptsd-pod" ? "ZDS-PTSD-1-BOM-001" : "AATCS-P1-BOM-001"} · Rev A</p>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-950 border-b border-gray-800 text-[10px] font-bold uppercase tracking-wider text-gray-600">
              <div className="col-span-2">Ref</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-1 text-center">Qty</div>
              <div className="col-span-2 text-right">Unit $</div>
              <div className="col-span-2 text-right">Ext $</div>
              <div className="col-span-1 text-center">Supplier</div>
            </div>

            {/* Line items grouped by category */}
            {categories.map((cat) => {
              const items = bom.lineItems.filter((l) => l.category === cat);
              const color = CATEGORY_COLORS[cat] || "#64748b";
              const expanded = expandedCats[cat] !== false;
              return (
                <div key={cat} className="border-b border-gray-800">
                  <button onClick={() => toggleCat(cat)} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-950 transition-colors" style={{ borderLeft: `3px solid ${color}` }}>
                    {expanded ? <ChevronUp size={12} className="text-gray-600" /> : <ChevronDown size={12} className="text-gray-600" />}
                    <span className="text-xs font-bold" style={{ color }}>{cat}</span>
                    <span className="text-gray-600 text-[10px]">({items.length} items · ${bom.categorySummary[cat].cost.toLocaleString()})</span>
                  </button>
                  {expanded && items.map((item, i) => (
                    <div key={item.ref} className={`grid grid-cols-12 gap-2 px-4 py-1.5 text-xs items-center ${i % 2 === 0 ? "bg-gray-950/50" : ""}`}>
                      <div className="col-span-2 font-mono text-gray-500">{item.ref}</div>
                      <div className="col-span-4 text-gray-300">
                        {item.desc}
                        {item.notes && <span className="text-gray-600 text-[10px] block">{item.notes}</span>}
                      </div>
                      <div className="col-span-1 text-center text-gray-400">{item.qty}</div>
                      <div className="col-span-2 text-right text-gray-400">${item.unitCost.toFixed(2)}</div>
                      <div className="col-span-2 text-right text-white font-bold">${item.extCost.toFixed(2)}</div>
                      <div className="col-span-1 text-center text-gray-600 text-[10px] truncate" title={item.supplier}>{item.supplier.split(" ")[0]}</div>
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Total row */}
            <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-950 border-t-2" style={{ borderColor: device.color }}>
              <div className="col-span-6 text-white font-bold text-sm">TOTAL COMPONENT COST</div>
              <div className="col-span-1 text-center text-gray-500 text-xs">{bom.lineItems.reduce((s, l) => s + l.qty, 0)} units</div>
              <div className="col-span-2"></div>
              <div className="col-span-2 text-right font-black text-base" style={{ color: device.color }}>${bom.totalCost.toLocaleString()}</div>
              <div className="col-span-1"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}