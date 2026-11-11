import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Search, FileText, Download, TrendingUp, AlertTriangle,
  Package, Layers, Cpu, ArrowUpDown, Lock,
} from "lucide-react";
import { buildPatentMasterList } from "../lib/patentCostModel";

const fmt = (n) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${Math.round(n)}`;
};

const SOURCE_LABEL = { flagship: "Flagship device", invention: "Fusion invention" };

export default function PatentCostMaster() {
  const all = useMemo(() => buildPatentMasterList(), []);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("toMarket"); // toMarket | buildTotal | materials | name | category
  const [dir, setDir] = useState("desc");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    let rows = all;
    if (sourceFilter !== "all") rows = rows.filter((r) => r.source === sourceFilter);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        (r.name + " " + r.code + " " + r.category + " " + (r.note || "")).toLowerCase().includes(q)
      );
    }
    const sorted = [...rows].sort((a, b) => {
      let av = a[sort], bv = b[sort];
      if (sort === "name" || sort === "category") {
        av = String(av).toLowerCase(); bv = String(bv).toLowerCase();
        return dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return dir === "asc" ? av - bv : bv - av;
    });
    return sorted;
  }, [all, search, sort, dir, sourceFilter]);

  const totals = useMemo(() => {
    const t = { count: filtered.length, materials: 0, labor: 0, buildTotal: 0, softwareDev: 0, irbRegulatory: 0, pilot: 0, toMarket: 0, patents: 0 };
    filtered.forEach((r) => {
      t.materials += r.materials;
      t.labor += r.labor;
      t.buildTotal += r.buildTotal;
      t.softwareDev += r.softwareDev;
      t.irbRegulatory += r.irbRegulatory;
      t.pilot += r.pilot;
      t.toMarket += r.toMarket;
      t.patents += r.patentClaims;
    });
    return t;
  }, [filtered]);

  const toggleSort = (col) => {
    if (sort === col) setDir(dir === "asc" ? "desc" : "asc");
    else { setSort(col); setDir(col === "name" || col === "category" ? "asc" : "desc"); }
  };

  const SortHeader = ({ col, label, align = "right" }) => (
    <button onClick={() => toggleSort(col)} className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-gray-300 ${align === "right" ? "justify-end" : "justify-start"}`}>
      {label}
      {sort === col && <ArrowUpDown size={9} className={dir === "asc" ? "rotate-180" : ""} />}
    </button>
  );

  const exportCsv = () => {
    const header = ["Code", "Name", "Category", "Source", "Materials", "Labor", "Build Total", "Software", "IRB/Regulatory", "Pilot", "Total to Market", "Patent Claims", "Components"];
    const rows = filtered.map((r) => [
      r.code, `"${r.name.replace(/"/g, '""')}"`, r.category, SOURCE_LABEL[r.source],
      r.materials, r.labor, r.buildTotal, r.softwareDev, r.irbRegulatory, r.pilot, r.toMarket, r.patentClaims, r.components,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ZARP-patent-cost-master-list.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900/80 px-5 py-4 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-400 hover:text-white"><ArrowLeft size={16} /></Link>
            <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-800 flex items-center justify-center">
              <FileText size={20} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-base font-black leading-tight">Patent Cost Master List</h1>
              <p className="text-gray-500 text-xs">Every patent & invention — build cost + total to bring to market</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-950/60 border border-red-800 text-red-400 uppercase tracking-wider">Not for Sale</span>
            <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold transition-all">
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="bg-amber-950/20 border-b border-amber-800/40 px-5 py-2">
        <div className="max-w-6xl mx-auto flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-amber-200/70 text-[11px] leading-relaxed">
            <strong className="text-amber-300">Advisory estimates only.</strong> Materials from real BOM where available (NRC-P, NRC-1) or heuristic elsewhere (Therapy Pod Pro, 50 inventions). Labor = 2.5× materials (EVT/DVT). Total to market adds software dev + IRB/IACUC + IND/IMD + pilot. No guarantee of final cost. Research-only devices — not for sale.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-6 space-y-5">
        {/* Grand totals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Patents / devices", val: totals.count, sub: `${totals.patents} patent claims`, color: "#06b6d4", icon: <FileText size={14} /> },
            { label: "Total build (materials + labor)", val: fmt(totals.buildTotal), sub: `${fmt(totals.materials)} mat · ${fmt(totals.labor)} lab`, color: "#f97316", icon: <Package size={14} /> },
            { label: "Total to bring to market", val: fmt(totals.toMarket), sub: "build + sw + IRB + pilot", color: "#22c55e", icon: <TrendingUp size={14} /> },
            { label: "Path-to-market overhead", val: fmt(totals.toMarket - totals.buildTotal), sub: "sw + IRB + pilot only", color: "#a855f7", icon: <Layers size={14} /> },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4" style={{ borderTopColor: s.color, borderTopWidth: 2 }}>
              <div className="flex items-center gap-2 mb-2" style={{ color: s.color }}>{s.icon}<span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{s.label}</span></div>
              <p className="text-xl font-black text-white">{s.val}</p>
              <p className="text-gray-600 text-[10px]">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patents, inventions, categories..." className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:border-gray-600" />
          </div>
          <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
            {[
              { id: "all", label: "All" },
              { id: "flagship", label: "Flagship" },
              { id: "invention", label: "50 Inventions" },
            ].map((opt) => (
              <button key={opt.id} onClick={() => setSourceFilter(opt.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${sourceFilter === opt.id ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Master table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-950 border-b border-gray-800">
                <tr>
                  <th className="text-left px-3 py-2.5 w-8"></th>
                  <th className="text-left px-3 py-2.5"><SortHeader col="code" label="Code" align="left" /></th>
                  <th className="text-left px-3 py-2.5 min-w-[220px]"><SortHeader col="name" label="Patent / Device" align="left" /></th>
                  <th className="text-left px-3 py-2.5 hidden md:table-cell"><SortHeader col="category" label="Category" align="left" /></th>
                  <th className="text-right px-3 py-2.5"><SortHeader col="buildTotal" label="Build" /></th>
                  <th className="text-right px-3 py-2.5 hidden sm:table-cell"><SortHeader col="softwareDev" label="SW Dev" /></th>
                  <th className="text-right px-3 py-2.5 hidden sm:table-cell"><SortHeader col="irbRegulatory" label="IRB/Reg" /></th>
                  <th className="text-right px-3 py-2.5 hidden sm:table-cell"><SortHeader col="pilot" label="Pilot" /></th>
                  <th className="text-right px-3 py-2.5"><SortHeader col="toMarket" label="To Market" /></th>
                  <th className="text-right px-3 py-2.5 hidden lg:table-cell"><SortHeader col="patentClaims" label="Claims" /></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tbody key={r.id}>
                    <tr
                      onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                      className={`border-b border-gray-800/50 cursor-pointer transition-colors hover:bg-gray-800/40 ${expanded === r.id ? "bg-gray-800/30" : ""}`}
                    >
                      <td className="px-3 py-2.5 text-center">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: r.color }} />
                      </td>
                      <td className="px-3 py-2.5 font-mono text-gray-400 text-[10px]">{r.code}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold leading-snug">{r.name}</span>
                          {r.source === "flagship" && (
                            <span className="text-[8px] px-1 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800 font-bold uppercase">Flagship</span>
                          )}
                          {r.medical && <span className="text-[8px] px-1 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800 font-bold uppercase">Med</span>}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-gray-400 hidden md:table-cell">{r.category}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-gray-200">{fmt(r.buildTotal)}</td>
                      <td className="px-3 py-2.5 text-right text-gray-400 hidden sm:table-cell">{fmt(r.softwareDev)}</td>
                      <td className="px-3 py-2.5 text-right text-gray-400 hidden sm:table-cell">{fmt(r.irbRegulatory)}</td>
                      <td className="px-3 py-2.5 text-right text-gray-400 hidden sm:table-cell">{fmt(r.pilot)}</td>
                      <td className="px-3 py-2.5 text-right font-black text-green-400">{fmt(r.toMarket)}</td>
                      <td className="px-3 py-2.5 text-right text-gray-400 hidden lg:table-cell">{r.patentClaims}</td>
                    </tr>
                    {expanded === r.id && (
                      <tr className="bg-gray-950/50 border-b border-gray-800/50">
                        <td colSpan={10} className="px-6 py-3">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">{r.source === "flagship" ? "Device" : "Fusion"}</p>
                              <p className="text-gray-300 text-xs leading-relaxed mb-3">{r.note}</p>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div><p className="text-gray-600 text-[10px]">Materials</p><p className="text-white font-bold">{fmt(r.materials)}</p></div>
                                <div><p className="text-gray-600 text-[10px]">Labor (2.5×)</p><p className="text-white font-bold">{fmt(r.labor)}</p></div>
                                <div><p className="text-gray-600 text-[10px]">Build Total</p><p className="text-white font-bold">{fmt(r.buildTotal)}</p></div>
                                <div><p className="text-gray-600 text-[10px]">Software Dev</p><p className="text-gray-200 font-bold">{fmt(r.softwareDev)}</p></div>
                                <div><p className="text-gray-600 text-[10px]">IRB/Regulatory</p><p className="text-gray-200 font-bold">{fmt(r.irbRegulatory)}</p></div>
                                <div><p className="text-gray-600 text-[10px]">Pilot Study</p><p className="text-gray-200 font-bold">{fmt(r.pilot)}</p></div>
                              </div>
                            </div>
                            <div className="flex flex-col justify-between">
                              <div>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Inventory</p>
                                <div className="flex flex-wrap gap-2 text-[10px]">
                                  <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-300">{r.lineItems} BOM items</span>
                                  <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-300">{r.components} components</span>
                                  <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-300">{r.patentClaims} patent claims</span>
                                </div>
                              </div>
                              <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
                                <span className="text-green-400 font-black text-lg">{fmt(r.toMarket)}</span>
                                <Link to={r.path} className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:bg-gray-700">
                                  {r.source === "flagship" ? "View device →" : "View build plans →"}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={10} className="px-3 py-10 text-center text-gray-500 text-sm">No patents match your search.</td></tr>
                )}
              </tbody>
              <tfoot className="bg-gray-950 border-t-2 border-gray-700">
                <tr>
                  <td colSpan={4} className="px-3 py-3 text-right text-gray-500 text-[10px] font-bold uppercase tracking-wider">Totals ({totals.count})</td>
                  <td className="px-3 py-3 text-right text-white font-black">{fmt(totals.buildTotal)}</td>
                  <td className="px-3 py-3 text-right text-gray-300 font-bold hidden sm:table-cell">{fmt(totals.softwareDev)}</td>
                  <td className="px-3 py-3 text-right text-gray-300 font-bold hidden sm:table-cell">{fmt(totals.irbRegulatory)}</td>
                  <td className="px-3 py-3 text-right text-gray-300 font-bold hidden sm:table-cell">{fmt(totals.pilot)}</td>
                  <td className="px-3 py-3 text-right text-green-400 font-black">{fmt(totals.toMarket)}</td>
                  <td className="px-3 py-3 text-right text-gray-300 font-bold hidden lg:table-cell">{totals.patents}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500 text-[11px]">
          <Lock size={11} />
          <span>Click any row for the full cost breakdown. Sort by clicking column headers. Export to CSV for spreadsheets.</span>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <Link to="/build-costs" className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:bg-gray-700">Build Cost Estimates</Link>
          <Link to="/invention-build-plans" className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:bg-gray-700">Invention Build Plans</Link>
          <Link to="/admin-ip-inventory" className="px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 text-xs font-bold hover:bg-gray-700">IP Asset Inventory</Link>
        </div>
      </div>
    </div>
  );
}