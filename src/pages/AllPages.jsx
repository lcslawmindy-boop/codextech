import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, X, LayoutGrid } from "lucide-react";
import { PAGE_GROUPS, ALL_PAGES } from "@/lib/pageDirectory";

export default function AllPages() {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("All");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return ALL_PAGES.filter((p) => {
      const matchGroup = activeGroup === "All" || p.group === activeGroup;
      const matchQuery = !q || p.label.toLowerCase().includes(q) || p.path.toLowerCase().includes(q) || (p.desc || "").toLowerCase().includes(q);
      return matchGroup && matchQuery;
    });
  }, [query, activeGroup]);

  const groups = ["All", ...PAGE_GROUPS.map((g) => g.label)];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-4 pt-3 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <LayoutGrid size={18} className="text-cyan-400" />
          <h1 className="text-white font-black text-base">All Pages</h1>
          <span className="text-slate-500 text-xs">{ALL_PAGES.length} total</span>
        </div>
        {/* Search */}
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages by name, path, or description…"
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X size={15} />
            </button>
          )}
        </div>
        {/* Group chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {groups.map((g) => {
            const meta = PAGE_GROUPS.find((x) => x.label === g);
            const color = meta?.color || "#06b6d4";
            const active = activeGroup === g;
            return (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
                style={active
                  ? { background: color + "22", borderColor: color, color }
                  : { borderColor: "#334155", color: "#64748b" }}
              >
                {meta?.icon && <span className="mr-1">{meta.icon}</span>}{g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Search size={28} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold">No pages match "{query}"</p>
            <p className="text-sm mt-1">Try a different search or group.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {filtered.map((p) => (
              <Link
                key={p.path}
                to={p.path}
                className="group rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 hover:border-slate-700 transition-all p-3 flex flex-col gap-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg leading-none">{p.emoji}</span>
                  <span className="text-[13px] font-bold text-white leading-tight group-hover:text-cyan-300 transition-colors line-clamp-2">{p.label}</span>
                </div>
                {p.desc && <p className="text-[10px] text-slate-500 leading-tight line-clamp-1">{p.desc}</p>}
                <p className="text-[9px] text-slate-600 font-mono mt-auto pt-1 truncate">{p.path}</p>
              </Link>
            ))}
          </div>
        )}
        <p className="text-center text-slate-600 text-[11px] mt-6">{filtered.length} of {ALL_PAGES.length} pages</p>
      </div>
    </div>
  );
}