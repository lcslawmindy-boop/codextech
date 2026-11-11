import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Network, X, Filter, Heart, Zap, Scroll, Target } from "lucide-react";
import { buildHumanitarianGraph, NODE_TYPE_META } from "@/lib/humanitarianGraph";
import { HUMANITARIAN_INVENTIONS } from "@/lib/humanitarianInventions";
import HumanitarianNetworkGraph from "@/components/HumanitarianNetworkGraph";

const TYPE_ICON = { invention: Zap, research: Scroll, problem: Target };

function NodeDetail({ node, onClose }) {
  if (!node) return null;
  const Icon = TYPE_ICON[node.type] || Target;
  const meta = NODE_TYPE_META[node.type] || {};
  return (
    <div className="absolute top-4 right-4 w-72 bg-gray-900/95 backdrop-blur border border-gray-700 rounded-xl p-4 z-20 shadow-2xl">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={16} style={{ color: node.color }} />
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: node.color }}>{meta.label}</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={16} /></button>
      </div>
      <h3 className="text-white font-bold text-sm mb-2 leading-tight">{node.label}</h3>
      {node.fusion && <p className="text-purple-300 text-xs font-semibold mb-2">Fusion: {node.fusion}</p>}
      {node.benefit && <p className="text-green-300 text-xs leading-relaxed mb-2">{node.benefit}</p>}
      {node.description && <p className="text-gray-400 text-xs leading-relaxed mb-3">{node.description}</p>}
      {node.mechanism && <p className="text-gray-400 text-xs leading-relaxed mb-3">{node.mechanism}</p>}
      <div className="space-y-1">
        {node.category && <p className="text-gray-500 text-[11px]">Category: <span className="text-gray-300">{node.category}</span></p>}
        {node.group && <p className="text-gray-500 text-[11px]">Group: <span className="text-gray-300">{node.group}</span></p>}
        {node.tags && (
          <div className="flex flex-wrap gap-1 pt-1">
            {node.tags.map((t) => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">{t}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HumanitarianImpactMap() {
  const graph = useMemo(() => buildHumanitarianGraph(), []);
  const [selected, setSelected] = useState(null);
  const [activeProblem, setActiveProblem] = useState(null);

  const stats = useMemo(() => ({
    inventions: graph.nodes.filter((n) => n.type === "invention").length,
    research: graph.nodes.filter((n) => n.type === "research").length,
    problems: graph.nodes.filter((n) => n.type === "problem").length,
    links: graph.links.length,
  }), [graph]);

  return (
    <div className="w-screen h-screen bg-gray-950 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/device-catalogue" className="text-gray-400 hover:text-white"><ArrowLeft size={18} /></Link>
          <Heart size={20} className="text-pink-500" />
          <div>
            <h1 className="text-white font-bold text-sm">Humanitarian Impact Map</h1>
            <p className="text-gray-500 text-[11px]">20 dual-tech inventions · research node lineage · humanitarian problem mapping</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /><span className="text-gray-400">{stats.inventions} Inventions</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /><span className="text-gray-400">{stats.research} Research</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /><span className="text-gray-400">{stats.problems} Problems</span></span>
          </div>
          <Link to="/hybrid-portfolio" className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold">Hybrid Portfolio →</Link>
        </div>
      </div>

      <div className="flex-1 relative">
        <HumanitarianNetworkGraph nodes={graph.nodes} links={graph.links} onNodeClick={setSelected} activeProblem={activeProblem} />
        <NodeDetail node={selected} onClose={() => setSelected(null)} />

        {/* Problem filter rail */}
        <div className="absolute top-4 left-4 w-56 bg-gray-900/90 backdrop-blur border border-gray-800 rounded-xl p-3 z-20 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <Filter size={13} className="text-gray-400" />
            <p className="text-gray-300 text-xs font-bold uppercase tracking-wider">Filter by Problem</p>
          </div>
          <button
            onClick={() => setActiveProblem(null)}
            className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg mb-1 transition-colors ${!activeProblem ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800"}`}>
            All problems
          </button>
          {graph.problems.map((p) => {
            const count = HUMANITARIAN_INVENTIONS.filter((inv) => {
              // count inventions linked to this problem via the graph
              const iid = `inv_${inv.id}`;
              return graph.links.some((l) => l.kind === "solves" && l.source === iid && l.target === p.id);
            }).length;
            if (count === 0) return null;
            return (
              <button
                key={p.id}
                onClick={() => setActiveProblem((cur) => (cur === p.id ? null : p.id))}
                className={`w-full flex items-center justify-between text-left text-xs px-2.5 py-1.5 rounded-lg mb-1 transition-colors ${activeProblem === p.id ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-800"}`}>
                <span className="flex items-center gap-2"><span style={{ color: p.color }}>●</span>{p.icon} {p.label}</span>
                <span className="text-gray-600 text-[10px]">{count}</span>
              </button>
            );
          })}
          <div className="mt-2 pt-2 border-t border-gray-800 text-[10px] text-gray-600 leading-relaxed">
            <span className="text-purple-400">━</span> fusion link<br />
            <span className="text-green-400">┄┄</span> solves problem<br />
            drag nodes · scroll to zoom
          </div>
        </div>

        <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur rounded-lg px-3 py-2 text-[11px] text-gray-500">
          {graph.nodes.length} nodes · {stats.links} connections
        </div>
      </div>
    </div>
  );
}