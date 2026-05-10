import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Wrench, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { businessItems } from "../lib/businessItems";
import { inventionSteps } from "../lib/inventionSteps";
import { itemImages } from "../lib/itemImages";
import BuildPlanViewer from "../components/BuildPlanViewer";

const inventions = businessItems.filter(i => i.category === "Invention");

export default function BuildPlanExplorer() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => setIsAdmin(u?.role === "admin")).catch(() => {});
  }, []);

  const filtered = inventions.filter(inv =>
    !search ||
    inv.title.toLowerCase().includes(search.toLowerCase()) ||
    inv.tagline?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedData = selected ? inventionSteps[selected.title] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col" style={{ height: "100vh" }}>
      {/* Header */}
      <div className="flex-shrink-0 border-b border-slate-800 bg-slate-950/95 backdrop-blur px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/device-catalogue" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-slate-700" />
          <div>
            <h1 className="text-white font-black text-base tracking-tight">Interactive Build Plan Explorer</h1>
            <p className="text-slate-500 text-xs">Schematic · BOM checklist · Step-by-step assembly</p>
          </div>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search builds..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-700 w-48"
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 border-r border-slate-800 overflow-y-auto bg-slate-900/40">
          <div className="px-3 py-2 border-b border-slate-800 bg-slate-900/60 sticky top-0">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{filtered.length} Build Plans</p>
          </div>
          {filtered.map((inv, i) => {
            const hasData = !!inventionSteps[inv.title];
            const image = itemImages[inv.title];
            const isSelected = selected?.title === inv.title;
            return (
              <button
                key={i}
                onClick={() => setSelected(inv)}
                className={`w-full text-left px-4 py-3 border-b border-slate-800/50 transition-all flex items-center gap-3 ${
                  isSelected ? "bg-slate-800/80 border-l-2 border-l-cyan-500" : "hover:bg-slate-800/30"
                }`}
              >
                {image ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={image} alt={inv.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 text-xl">
                    {inv.icon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold leading-snug truncate ${isSelected ? "text-white" : "text-slate-300"}`}>{inv.title}</p>
                  <p className={`text-[10px] mt-0.5 ${hasData ? "text-cyan-700" : "text-slate-700"}`}>
                    {hasData ? `${inventionSteps[inv.title]?.steps?.length || 0} steps · ${inventionSteps[inv.title]?.bom?.length || 0} BOM items` : "Overview only"}
                  </p>
                </div>
                <ChevronRight size={12} className={`flex-shrink-0 transition-colors ${isSelected ? "text-cyan-400" : "text-slate-700"}`} />
              </button>
            );
          })}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-6">
          {selected && selectedData ? (
            <BuildPlanViewer invention={selected} data={selectedData} />
          ) : selected && !selectedData ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl mx-auto mb-4">
                  {selected.icon}
                </div>
                <h2 className="text-white font-black text-xl mb-2">{selected.title}</h2>
                <p className="text-slate-400 text-sm italic mb-4">{selected.tagline}</p>
                <p className="text-slate-500 text-sm mb-4">{selected.description}</p>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-600">
                  Full build plans including schematic, BOM, and assembly guide are coming soon for this device.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Wrench size={40} className="text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 text-base font-semibold">Select a build plan to begin</p>
                <p className="text-slate-700 text-sm mt-1">Choose from {filtered.length} engineering projects on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}