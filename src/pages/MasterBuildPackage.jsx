import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Search, FileText, Download, Package, Layers, Cpu,
  ClipboardList, DollarSign, Loader2, AlertTriangle, ChevronRight, Archive,
} from "lucide-react";
import JSZip from "jszip";
import { NEW_INVENTIONS } from "../lib/newInventions";
import {
  generatePRD, generatePDR, generateBOM, generateSOW, generateTestPlan,
} from "../lib/inventionEngineeringSpecs";
import {
  estimateInvention, inventionMarket, LABOR_FACTOR,
} from "../lib/patentCostModel";
import { generateMasterBuildPackagePdf, generateMasterBuildPackageBlob } from "../lib/generateMasterBuildPackagePdf";

const fmt = (n) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${Math.round(n)}`;
};

// Shared bundle + cost builders (used by both detail view and zip-all)
function buildBundleFor(inv) {
  return {
    prd: generatePRD(inv),
    pdr: generatePDR(inv),
    bom: generateBOM(inv),
    sow: generateSOW(inv),
    testPlan: generateTestPlan(inv),
  };
}

function buildCostFor(inv) {
  const est = estimateInvention(inv);
  const market = inventionMarket(inv);
  return {
    materials: est.materials,
    labor: est.labor,
    buildTotal: est.total,
    softwareDev: market.softwareDev,
    irbRegulatory: market.irbRegulatory,
    pilot: market.pilot,
    toMarket: est.total + market.softwareDev + market.irbRegulatory + market.pilot,
  };
}

function sanitizeFolderName(name) {
  return (name || "Untitled")
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

const TABS = [
  { id: "prd", label: "PRD", icon: FileText, color: "#06b6d4" },
  { id: "pdr", label: "PDR", icon: Layers, color: "#a855f7" },
  { id: "bom", label: "BOM", icon: Package, color: "#f97316" },
  { id: "sow", label: "SOW", icon: ClipboardList, color: "#22c55e" },
  { id: "test", label: "EVT/DVT/PVT", icon: Cpu, color: "#ef4444" },
  { id: "build", label: "Build Plan", icon: ClipboardList, color: "#eab308" },
  { id: "cost", label: "Cost to Market", icon: DollarSign, color: "#10b981" },
];

function SpecSection({ s, color }) {
  return (
    <div className="border-l-2 pl-3 mb-4" style={{ borderColor: color + "60" }}>
      <h4 className="text-white font-bold text-xs mb-1.5" style={{ color }}>{s.heading}</h4>
      {s.body && <p className="text-gray-400 text-xs leading-relaxed mb-2">{s.body}</p>}
      {s.bullets && (
        <ul className="space-y-1 mb-2">
          {s.bullets.map((b, i) => (
            <li key={i} className="text-gray-300 text-xs leading-relaxed flex gap-2">
              <span style={{ color }}>▸</span>{b}
            </li>
          ))}
        </ul>
      )}
      {s.table && (
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-[10px] border border-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-950">
              <tr>{Object.keys(s.table[0] || {}).map((k) => (
                <th key={k} className="text-left px-2 py-1.5 text-gray-500 font-bold uppercase tracking-wider">{k}</th>
              ))}</tr>
            </thead>
            <tbody>
              {s.table.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-gray-900/50" : ""}>
                  {Object.values(r).map((v, j) => (
                    <td key={j} className="px-2 py-1.5 text-gray-300 align-top">{String(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function InventionDetail({ inv }) {
  const [tab, setTab] = useState("prd");
  const [exporting, setExporting] = useState(false);

  const bundle = useMemo(() => buildBundleFor(inv), [inv]);
  const cost = useMemo(() => buildCostFor(inv), [inv]);
  const market = inventionMarket(inv);

  const handleExport = () => {
    setExporting(true);
    try {
      generateMasterBuildPackagePdf({
        invention: inv, ...bundle, buildPlan: inv.buildPlan, cost,
      });
    } catch (e) {
      console.error(e);
      alert("Export failed: " + (e.message || e));
    }
    setExporting(false);
  };

  const activeTab = TABS.find((t) => t.id === tab);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-800 flex items-start justify-between flex-wrap gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">{inv.id.toUpperCase()}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-950/50 text-orange-400 border border-orange-800 font-bold">{inv.category}</span>
            {market.medical && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/50 text-amber-400 border border-amber-800 font-bold">MEDICAL PATH</span>}
          </div>
          <h2 className="text-white font-black text-base leading-tight">{inv.name}</h2>
          <p className="text-gray-500 text-xs mt-1">{inv.fusion}</p>
        </div>
        <button onClick={handleExport} disabled={exporting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold transition-all disabled:opacity-50 flex-shrink-0">
          {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          {exporting ? "Generating…" : "Export Full PDF"}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-gray-950/50 border-b border-gray-800 px-3 py-2 flex items-center gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${tab === t.id ? "text-white border" : "text-gray-500 hover:text-gray-300 border border-transparent"}`}
            style={tab === t.id ? { background: t.color + "20", borderColor: t.color + "60" } : {}}>
            <t.icon size={12} style={{ color: t.color }} /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {tab === "prd" && (
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
              <span className="font-mono">{bundle.prd.docId}</span> · Rev {bundle.prd.revision} · {bundle.prd.classification}
            </div>
            {bundle.prd.sections.map((s, i) => <SpecSection key={i} s={s} color={activeTab.color} />)}
          </div>
        )}
        {tab === "pdr" && (
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
              <span className="font-mono">{bundle.pdr.docId}</span> · Rev {bundle.pdr.revision}
            </div>
            {bundle.pdr.sections.map((s, i) => <SpecSection key={i} s={s} color={activeTab.color} />)}
          </div>
        )}
        {tab === "bom" && (
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-mono">{bundle.bom.docId}</span> · Rev {bundle.bom.revision}
              </div>
              <div className="flex gap-2 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-300">{bundle.bom.summary.totalLineItems} items</span>
                <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-300">{bundle.bom.summary.totalComponents} components</span>
                <span className="px-2 py-0.5 rounded bg-green-950/40 border border-green-800 text-green-400 font-bold">{fmt(bundle.bom.summary.estimatedCost)} est.</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] border border-gray-800 rounded-lg overflow-hidden">
                <thead className="bg-gray-950">
                  <tr>{["#", "Ref", "Description", "Cat", "Qty", "Cost", "Supplier", "Lead"].map((h) => (
                    <th key={h} className="text-left px-2 py-1.5 text-gray-500 font-bold uppercase tracking-wider">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {bundle.bom.items.map((it, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-gray-900/50" : ""}>
                      <td className="px-2 py-1.5 text-gray-500">{it.item}</td>
                      <td className="px-2 py-1.5 font-mono text-gray-400">{it.refDes}</td>
                      <td className="px-2 py-1.5 text-gray-300 max-w-[200px]">{it.description}</td>
                      <td className="px-2 py-1.5 text-gray-400">{it.category}</td>
                      <td className="px-2 py-1.5 text-gray-300">{it.qty}</td>
                      <td className="px-2 py-1.5 text-green-400 font-bold">${it.estCost}</td>
                      <td className="px-2 py-1.5 text-gray-400">{it.supplier}</td>
                      <td className="px-2 py-1.5 text-gray-500">{it.leadTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab === "sow" && (
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
              <span className="font-mono">{bundle.sow.docId}</span> · Rev {bundle.sow.revision}
            </div>
            {bundle.sow.sections.map((s, i) => <SpecSection key={i} s={s} color={activeTab.color} />)}
          </div>
        )}
        {tab === "test" && (
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
              <span className="font-mono">{bundle.testPlan.docId}</span> · Rev {bundle.testPlan.revision}
            </div>
            {bundle.testPlan.sections.map((s, i) => <SpecSection key={i} s={s} color={activeTab.color} />)}
          </div>
        )}
        {tab === "build" && (
          <div>
            <h4 className="text-white font-bold text-xs mb-2" style={{ color: activeTab.color }}>Phased Build Plan</h4>
            <p className="text-gray-300 text-xs leading-relaxed mb-4">{inv.buildPlan}</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
                <p className="text-gray-600 text-[10px] font-bold uppercase">Phase 1</p>
                <p className="text-white text-xs font-bold mt-1">Prototype</p>
              </div>
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
                <p className="text-gray-600 text-[10px] font-bold uppercase">Phase 2</p>
                <p className="text-white text-xs font-bold mt-1">Scaled unit</p>
              </div>
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
                <p className="text-gray-600 text-[10px] font-bold uppercase">Phase 3</p>
                <p className="text-white text-xs font-bold mt-1">Commercial</p>
              </div>
            </div>
          </div>
        )}
        {tab === "cost" && (
          <div>
            <h4 className="text-white font-bold text-xs mb-3" style={{ color: activeTab.color }}>Cost to Bring to Market</h4>
            <div className="space-y-2 max-w-md">
              {[
                ["Materials", cost.materials, "Real BOM / heuristic"],
                [`Engineering labor (EVT/DVT, ${LABOR_FACTOR}×)`, cost.labor, "Winding, fab, integration, test"],
                ["Build subtotal", cost.buildTotal, "Materials + labor", true],
                ["Software / firmware dev", cost.softwareDev, "Embedded control, HMI, audit log"],
                ["IRB / IACUC + regulatory", cost.irbRegulatory, market.medical ? "IRB + IND/IMD + ethics" : "Safety/CE only"],
                ["Pilot study", cost.pilot, market.medical ? "Animal + first-in-human" : "Bench/field pilot"],
                ["TOTAL TO BRING TO MARKET", cost.toMarket, null, true, true],
              ].map(([label, val, sub, subtotal, grand]) => (
                <div key={label} className={`flex items-center justify-between p-3 rounded-lg ${grand ? "bg-green-950/30 border border-green-800" : subtotal ? "bg-gray-950 border border-gray-800" : "bg-gray-950/50 border border-gray-800/50"}`}>
                  <div>
                    <p className={`text-xs font-bold ${grand ? "text-green-400" : subtotal ? "text-white" : "text-gray-300"}`}>{label}</p>
                    {sub && <p className="text-gray-600 text-[10px] mt-0.5">{sub}</p>}
                  </div>
                  <p className={`font-black ${grand ? "text-green-400 text-lg" : subtotal ? "text-white" : "text-gray-200"}`}>{fmt(val)}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-[10px] mt-3 leading-relaxed">
              Advisory estimates only. Still excluded: facility, IP filing, pivotal trial beyond safety pilot. Research-only — not for sale.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const FLAGSHIPS = [
  { id: "nrcp", name: "Prenatal Repair Pod (NRC-P)", code: "ZA-NRC-P-001", path: "/prenatal-repair-pod", color: "#ec4899", desc: "Full PRD/PDR/BOM/SOW/EVT/DVT + build plan on device page" },
  { id: "nrc1", name: "Neuro Regeneration Chamber (NRC-1)", code: "ZA-NRC-001", path: "/neuro-regen-chamber", color: "#06b6d4", desc: "Full PRD/PDR/BOM/SOW/EVT/DVT + build plan on device page" },
  { id: "therapy", name: "Therapy Pod Pro (AATCS-P1)", code: "ZA-TP-001", path: "/therapy-pod-pro", color: "#a855f7", desc: "Full PRD/PDR/BOM/SOW + 3D CAD + assembly manual on device page" },
];

export default function MasterBuildPackage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(NEW_INVENTIONS[0]?.id);
  const [zipping, setZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  const handleDownloadAllZip = async () => {
    setZipping(true);
    setZipProgress(0);
    try {
      const zip = new JSZip();
      const root = zip.folder("ZARP Master Build Packages");
      const usedFolders = new Set();
      NEW_INVENTIONS.forEach((inv, i) => {
        const bundle = buildBundleFor(inv);
        const cost = buildCostFor(inv);
        const blob = generateMasterBuildPackageBlob({
          invention: inv, ...bundle, buildPlan: inv.buildPlan, cost,
        });
        let folder = sanitizeFolderName(inv.name);
        // Ensure unique folder name
        let f = folder, n = 2;
        while (usedFolders.has(f.toLowerCase())) { f = `${folder} (${n++})`; }
        usedFolders.add(f.toLowerCase());
        const code = (inv.id || "INV").toUpperCase();
        root.folder(f).file(`Master-Build-Package-${code}.pdf`, blob);
        setZipProgress(Math.round(((i + 1) / NEW_INVENTIONS.length) * 100));
      });
      const zipBlob = await zip.generateAsync({ type: "blob" }, (meta) => {
        // generation compression progress (overwrites build progress in last phase)
        setZipProgress(Math.round(meta.percent));
      });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ZARP-Master-Build-Packages.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("zip failed", e);
      alert("Zip export failed: " + (e.message || e));
    }
    setZipping(false);
    setZipProgress(0);
  };

  const filtered = useMemo(() => {
    if (!search) return NEW_INVENTIONS;
    const q = search.toLowerCase();
    return NEW_INVENTIONS.filter((inv) =>
      (inv.name + " " + inv.id + " " + inv.category + " " + inv.fusion).toLowerCase().includes(q)
    );
  }, [search]);

  const selected = NEW_INVENTIONS.find((inv) => inv.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900/80 px-5 py-4 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-400 hover:text-white"><ArrowLeft size={16} /></Link>
            <div className="w-10 h-10 rounded-xl bg-indigo-950/50 border border-indigo-800 flex items-center justify-center">
              <Package size={20} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-base font-black leading-tight">Master Build Package</h1>
              <p className="text-gray-500 text-xs">Full PRD · PDR · BOM · SOW · EVT/DVT/PVT · Build Plan · Cost to Market — per patent</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDownloadAllZip} disabled={zipping}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all disabled:opacity-60">
              {zipping ? <Loader2 size={13} className="animate-spin" /> : <Archive size={13} />}
              {zipping ? `Zipping… ${zipProgress}%` : "Download All (ZIP)"}
            </button>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-950/60 border border-red-800 text-red-400 uppercase tracking-wider">Not for Sale</span>
          </div>
        </div>
      </div>

      <div className="bg-amber-950/20 border-b border-amber-800/40 px-5 py-2">
        <div className="max-w-7xl mx-auto flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-amber-200/70 text-[11px] leading-relaxed">
            <strong className="text-amber-300">Research prototypes.</strong> Each patent's full engineering package is generated from its fusion architecture, components, and mechanism. Export a combined multi-page PDF (PRD + PDR + BOM + SOW + EVT/DVT/PVT + build plan + cost-to-market) per invention.
          </p>
        </div>
      </div>

      {/* Flagship device cards */}
      <div className="max-w-7xl mx-auto px-5 pt-5">
        <h2 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><Cpu size={14} className="text-cyan-400" /> Flagship Devices — Full Engineering Package</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {FLAGSHIPS.map((f) => (
            <Link key={f.id} to={f.path} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-colors group" style={{ borderTopColor: f.color, borderTopWidth: 2 }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">{f.code}</span>
                <ChevronRight size={14} className="text-gray-600 group-hover:text-white" />
              </div>
              <p className="text-white font-bold text-sm leading-snug mb-1">{f.name}</p>
              <p className="text-gray-500 text-[11px] leading-relaxed">{f.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-5">
        <h2 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><Layers size={14} className="text-orange-400" /> 50 Inventions — Full Build Package</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Selector */}
          <div className="lg:col-span-1 space-y-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search inventions..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-gray-600" />
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl max-h-[70vh] overflow-y-auto">
              {filtered.map((inv) => (
                <button key={inv.id} onClick={() => setSelectedId(inv.id)}
                  className={`w-full text-left px-3 py-2.5 border-b border-gray-800/50 transition-colors ${selectedId === inv.id ? "bg-gray-800" : "hover:bg-gray-800/50"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-bold leading-snug truncate">{inv.name}</p>
                      <p className="text-gray-600 text-[10px] mt-0.5">{inv.id.toUpperCase()} · {inv.category}</p>
                    </div>
                    {selectedId === inv.id && <ChevronRight size={12} className="text-cyan-400 flex-shrink-0" />}
                  </div>
                </button>
              ))}
              {filtered.length === 0 && <p className="text-center text-gray-500 text-xs py-6">No matches.</p>}
            </div>
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {selected ? <InventionDetail inv={selected} /> : (
              <div className="text-center text-gray-500 py-20">Select an invention to view its full build package.</div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-8 mb-10">
          <Link to="/patent-costs" className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:bg-gray-700">Patent Cost Master List</Link>
          <Link to="/build-costs" className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:bg-gray-700">Build Cost Estimates</Link>
          <Link to="/invention-build-plans" className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:bg-gray-700">Invention Build Plans</Link>
        </div>
      </div>
    </div>
  );
}