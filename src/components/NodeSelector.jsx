import { useState, useMemo } from "react";
import { CheckCircle2, Search, X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { nodes } from "@/lib/beardenData";

const GROUP_COLORS = {
  physics: "#3b82f6",
  biology: "#22c55e",
  weapons: "#ef4444",
  consciousness: "#a855f7",
  history: "#f59e0b",
  philosophy: "#06b6d4",
};

// Derive status tags from node content heuristics
function getNodeStatus(node) {
  const text = (node.label + " " + (node.description || "")).toLowerCase();
  if (/(patent|us \d|ppa|filed|granted)/i.test(text)) return "patented";
  if (/(1[89]\d\d|19\d\d|18\d\d|historical|suppressed|bearden|tesla|reich|moray|schauberger|russell|rife)/i.test(text)) return "historical";
  if (/(theoretical|model|concept|framework|hypothe|proposed)/i.test(text)) return "theoretical";
  if (/(weapon|warfare|military|woodpecker|elf entrainment|soviet)/i.test(text)) return "classified";
  return "theoretical";
}

const STATUS_CONFIG = {
  patented:    { label: "Patented",    color: "#22c55e" },
  historical:  { label: "Historical",  color: "#f59e0b" },
  theoretical: { label: "Theoretical", color: "#6366f1" },
  classified:  { label: "Classified",  color: "#ef4444" },
};

const ALL_GROUPS = [...new Set(nodes.map(n => n.group))].sort();
const ALL_STATUSES = Object.keys(STATUS_CONFIG);

export default function NodeSelector({ selected, onToggle }) {
  const [search, setSearch] = useState("");
  const [activeGroups, setActiveGroups] = useState([]);   // empty = all
  const [activeStatuses, setActiveStatuses] = useState([]); // empty = all
  const [showFilters, setShowFilters] = useState(false);
  const [descSearch, setDescSearch] = useState("");

  const toggleGroup = (g) => setActiveGroups(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  const toggleStatus = (s) => setActiveStatuses(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const clearAll = () => { setSearch(""); setDescSearch(""); setActiveGroups([]); setActiveStatuses([]); };
  const hasFilters = search || descSearch || activeGroups.length > 0 || activeStatuses.length > 0;

  const filtered = useMemo(() => {
    return nodes.filter(n => {
      const labelMatch = n.label.toLowerCase().includes(search.toLowerCase());
      const descMatch = !descSearch || (n.description || "").toLowerCase().includes(descSearch.toLowerCase()) ||
        (n.fragments || []).some(f => f.toLowerCase().includes(descSearch.toLowerCase()));
      const groupMatch = activeGroups.length === 0 || activeGroups.includes(n.group);
      const statusMatch = activeStatuses.length === 0 || activeStatuses.includes(getNodeStatus(n));
      return labelMatch && descMatch && groupMatch && statusMatch;
    });
  }, [search, descSearch, activeGroups, activeStatuses]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Search bar + filter toggle */}
      <div className="px-4 pt-3 pb-2 border-b border-gray-800 space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-8 pr-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600"
            />
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              showFilters || hasFilters
                ? "bg-yellow-900/40 border-yellow-700 text-yellow-300"
                : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
            }`}
          >
            <SlidersHorizontal size={12} />
            Filters
            {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
            {showFilters ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          </button>
        </div>

        {/* Advanced filters panel */}
        {showFilters && (
          <div className="space-y-3 pt-1 pb-1">
            {/* Keyword in description */}
            <div>
              <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5">Keyword in Description</p>
              <div className="relative">
                <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                <input
                  value={descSearch}
                  onChange={e => setDescSearch(e.target.value)}
                  placeholder="e.g. vacuum, telomere, scalar…"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-1.5 text-white text-xs focus:outline-none focus:border-yellow-600 placeholder-gray-600"
                />
                {descSearch && (
                  <button onClick={() => setDescSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                    <X size={10} />
                  </button>
                )}
              </div>
            </div>

            {/* Category filter */}
            <div>
              <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5">Category</p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_GROUPS.map(g => {
                  const active = activeGroups.includes(g);
                  const color = GROUP_COLORS[g] || "#888";
                  return (
                    <button
                      key={g}
                      onClick={() => toggleGroup(g)}
                      className="text-xs px-2.5 py-1 rounded-lg border font-bold capitalize transition-all"
                      style={{
                        backgroundColor: active ? color + "30" : "transparent",
                        borderColor: active ? color : "#374151",
                        color: active ? color : "#6b7280",
                      }}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status filter */}
            <div>
              <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5">Status</p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_STATUSES.map(s => {
                  const active = activeStatuses.includes(s);
                  const { label, color } = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      onClick={() => toggleStatus(s)}
                      className="text-xs px-2.5 py-1 rounded-lg border font-bold transition-all"
                      style={{
                        backgroundColor: active ? color + "25" : "transparent",
                        borderColor: active ? color : "#374151",
                        color: active ? color : "#6b7280",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {hasFilters && (
              <button onClick={clearAll} className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition-colors">
                <X size={10} /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-gray-700 text-xs">{filtered.length} node{filtered.length !== 1 ? "s" : ""} {hasFilters ? "matching" : "total"}</p>
          {selected.length > 0 && (
            <p className="text-yellow-600 text-xs font-bold">{selected.length}/5 selected</p>
          )}
        </div>
      </div>

      {/* Node list */}
      <div className="overflow-y-auto max-h-64 divide-y divide-gray-800/50">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <Search size={20} className="text-gray-700 mb-2" />
            <p className="text-gray-600 text-xs">No nodes match your filters.</p>
            <button onClick={clearAll} className="text-yellow-600 text-xs mt-1.5 hover:underline">Clear filters</button>
          </div>
        ) : (
          filtered.map(node => {
            const isSelected = selected.find(s => s.id === node.id);
            const status = getNodeStatus(node);
            const statusCfg = STATUS_CONFIG[status];
            return (
              <button
                key={node.id}
                onClick={() => onToggle(node)}
                className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-all hover:bg-gray-800/60 ${isSelected ? "bg-gray-800" : ""}`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 border-2 ${isSelected ? "border-yellow-400 bg-yellow-400" : ""}`}
                  style={!isSelected ? { borderColor: GROUP_COLORS[node.group] || "#888" } : {}}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold truncate ${isSelected ? "text-yellow-300" : "text-gray-300"}`}>{node.label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs capitalize" style={{ color: GROUP_COLORS[node.group] || "#888" }}>{node.group}</span>
                    <span className="text-gray-700">·</span>
                    <span className="text-xs font-semibold" style={{ color: statusCfg.color + "cc" }}>{statusCfg.label}</span>
                  </div>
                </div>
                {isSelected && <CheckCircle2 size={12} className="text-yellow-400 flex-shrink-0" />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}