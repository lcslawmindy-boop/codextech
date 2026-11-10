import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Network, X, Database, Zap, FileText, Scroll } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { nodes as beardenNodes, groupColors } from "../lib/beardenData";
import ResearchNetworkGraph from "../components/ResearchNetworkGraph";

const TYPE_META = {
  research: { label: "Research Node", icon: Scroll, color: "#06b6d4" },
  invention: { label: "Invention", icon: Zap, color: "#a855f7" },
  prior_art: { label: "Prior Art", icon: FileText, color: "#f97316" },
};

async function loadAll(entity, opts = {}) {
  let all = [], cursor = null;
  do {
    const page = await entity.filter({}, { limit: 50, cursor, sort: "-created_date", ...opts });
    all = all.concat(page.items || []);
    cursor = page.has_more ? page.next_cursor : null;
  } while (cursor);
  return all;
}

function buildGraph(inventions, priorArt) {
  const gn = [], gl = [];
  const seen = new Set();
  const addNode = (id, label, type, color, meta = {}) => {
    if (seen.has(id)) return;
    seen.add(id);
    gn.push({ id, label, type, color, ...meta });
  };
  const addLink = (s, t) => { if (seen.has(s) && seen.has(t)) gl.push({ source: s, target: t }); };

  // Collect referenced research node IDs from inventions
  const refIds = new Set();
  inventions.forEach((inv) => (inv.input_nodes || []).forEach((n) => refIds.add(n.id)));

  // Add referenced research nodes from bearden data
  refIds.forEach((id) => {
    const bn = beardenNodes.find((n) => n.id === id);
    if (bn) addNode(bn.id, bn.label, "research", groupColors[bn.group] || "#06b6d4", { group: bn.group, description: bn.description });
  });

  // Add inventions + links to research nodes
  inventions.forEach((inv, i) => {
    const iid = `inv_${inv.id}`;
    addNode(iid, inv.hybrid_concept?.slice(0, 50) || `Invention ${i + 1}`, "invention", "#a855f7", {
      status: inv.status, synergy_score: inv.synergy_score, ip_valuation: inv.ip_valuation,
    });
    (inv.input_nodes || []).forEach((n) => addLink(iid, n.id));
  });

  // Add prior art entries
  priorArt.forEach((pa, i) => {
    addNode(`pa_${pa.id}`, pa.title?.slice(0, 50) || `Prior Art ${i + 1}`, "prior_art", "#f97316", {
      description: pa.description, outcome: pa.outcome,
    });
  });

  return { nodes: gn, links: gl };
}

function NodeDetail({ node, onClose }) {
  if (!node) return null;
  const meta = TYPE_META[node.type] || {};
  return (
    <div className="absolute top-4 right-4 w-72 bg-gray-900/95 backdrop-blur border border-gray-700 rounded-xl p-4 z-20 shadow-2xl">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <meta.icon size={16} style={{ color: meta.color }} />
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: meta.color }}>{meta.label}</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={16} /></button>
      </div>
      <h3 className="text-white font-bold text-sm mb-2 leading-tight">{node.label}</h3>
      {node.description && <p className="text-gray-400 text-xs leading-relaxed mb-3">{node.description}</p>}
      <div className="space-y-1">
        {node.group && <p className="text-gray-500 text-[11px]">Group: <span className="text-gray-300">{node.group}</span></p>}
        {node.status && <p className="text-gray-500 text-[11px]">Status: <span className="text-gray-300 capitalize">{node.status}</span></p>}
        {node.synergy_score != null && <p className="text-gray-500 text-[11px]">Synergy: <span className="text-gray-300">{node.synergy_score}</span></p>}
        {node.ip_valuation && <p className="text-gray-500 text-[11px]">IP Value: <span className="text-gray-300">{node.ip_valuation}</span></p>}
        {node.outcome && <p className="text-gray-500 text-[11px]">Outcome: <span className="text-gray-300">{node.outcome}</span></p>}
      </div>
    </div>
  );
}

export default function ResearchNetworkMap() {
  const [loading, setLoading] = useState(true);
  const [graph, setGraph] = useState({ nodes: [], links: [] });
  const [selected, setSelected] = useState(null);
  const [stats, setStats] = useState({ inventions: 0, research: 0, priorArt: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [inventions, priorArt] = await Promise.all([
        loadAll(base44.entities.HybridInvention).catch(() => []),
        loadAll(base44.entities.PriorArtEntry).catch(() => []),
      ]);
      const g = buildGraph(inventions, priorArt);
      setGraph(g);
      setStats({
        inventions: inventions.length,
        research: g.nodes.filter((n) => n.type === "research").length,
        priorArt: priorArt.length,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="w-screen h-screen bg-gray-950 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-400 hover:text-white"><ArrowLeft size={18} /></Link>
          <Network size={20} className="text-cyan-400" />
          <div>
            <h1 className="text-white font-bold text-sm">Research Network Map</h1>
            <p className="text-gray-500 text-[11px]">Live database connections between research nodes, inventions & prior art</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /><span className="text-gray-400">{stats.research} Research</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /><span className="text-gray-400">{stats.inventions} Inventions</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /><span className="text-gray-400">{stats.priorArt} Prior Art</span></span>
          </div>
          <Link to="/device-graph" className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold">Device Graph →</Link>
        </div>
      </div>

      <div className="flex-1 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-cyan-400" size={32} />
          </div>
        ) : graph.nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Database size={48} className="text-gray-700" />
            <p className="text-gray-500 text-sm">No network data found in the database yet.</p>
            <Link to="/inventor-forge" className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold">Generate inventions →</Link>
          </div>
        ) : (
          <>
            <ResearchNetworkGraph nodes={graph.nodes} links={graph.links} onNodeClick={setSelected} />
            <NodeDetail node={selected} onClose={() => setSelected(null)} />
            <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur rounded-lg px-3 py-2 text-[11px] text-gray-500">
              {graph.nodes.length} nodes · {graph.links.length} connections · drag to move · scroll to zoom
            </div>
          </>
        )}
      </div>
    </div>
  );
}