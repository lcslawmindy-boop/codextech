import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Search, X, Pin, ZoomIn, ZoomOut, Maximize2,
  Filter, Layers, Zap, Eye, RefreshCw, Download, Info,
  ChevronRight, Activity, AlertTriangle, TrendingUp,
  Network, Cpu, Globe, FileText, Users, BarChart3, Loader2
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import GraphCanvas from "@/components/intelligence/GraphCanvas";
import NodeDetailPanel from "@/components/intelligence/NodeDetailPanel";
import GraphToolbar from "@/components/intelligence/GraphToolbar";
import GraphFilterPanel from "@/components/intelligence/GraphFilterPanel";
import { buildGraphData } from "@/lib/graphDataBuilder";

const NODE_TYPES = [
  { id: "invention", label: "Inventions", color: "#00E5FF", icon: Cpu },
  { id: "claim", label: "Claims", color: "#a855f7", icon: FileText },
  { id: "prior_art", label: "Prior Art", color: "#f97316", icon: Globe },
  { id: "patent_family", label: "Patent Families", color: "#22c55e", icon: Network },
  { id: "competitor", label: "Competitors", color: "#ef4444", icon: Users },
  { id: "market", label: "Markets", color: "#fbbf24", icon: TrendingUp },
];

const VISUAL_MODES = [
  { id: "analyst", label: "Analyst", desc: "Clean, minimal" },
  { id: "electric", label: "Electric", desc: "Neon pulses" },
  { id: "research", label: "Research", desc: "Scalar rings" },
];

const OVERLAYS = [
  { id: "risk_heatmap", label: "Prior Art Risk Heatmap", color: "#ef4444" },
  { id: "claim_density", label: "Claim Density", color: "#a855f7" },
  { id: "competitor_cluster", label: "Competitor Clusters", color: "#f97316" },
  { id: "patent_family", label: "Patent Grouping", color: "#22c55e" },
];

export default function IPNetworkGraph() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [visualMode, setVisualMode] = useState("analyst");
  const [activeOverlays, setActiveOverlays] = useState([]);
  const [activeTypes, setActiveTypes] = useState(NODE_TYPES.map(t => t.id));
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [pinnedNodes, setPinnedNodes] = useState(new Set());
  const [zoom, setZoom] = useState(1);
  const [stats, setStats] = useState({ nodes: 0, links: 0, clusters: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [inventions, priorArt, opportunities, hybrids] = await Promise.all([
        base44.entities.HybridInvention.list("-created_date", 30).catch(() => []),
        base44.entities.PriorArtEntry.list("-created_date", 40).catch(() => []),
        base44.entities.OpportunityCard.list("-created_date", 20).catch(() => []),
        base44.entities.MonitoringAlert.filter({ status: "new" }).catch(() => []),
      ]);

      const data = buildGraphData({ inventions, priorArt, opportunities, alerts: hybrids });
      setGraphData(data);
      setStats({
        nodes: data.nodes.length,
        links: data.links.length,
        clusters: Math.floor(data.nodes.length / 4),
      });
    } catch (err) {
      console.error("Graph load error:", err);
    }
    setLoading(false);
  };

  const handleSearch = useCallback((q) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    const results = graphData.nodes.filter(n =>
      n.label.toLowerCase().includes(q.toLowerCase()) ||
      n.type.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 8);
    setSearchResults(results);
  }, [graphData.nodes]);

  const toggleOverlay = (id) => {
    setActiveOverlays(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleType = (id) => {
    setActiveTypes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const togglePin = (nodeId) => {
    setPinnedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId); else next.add(nodeId);
      return next;
    });
  };

  const filteredData = {
    nodes: graphData.nodes.filter(n => activeTypes.includes(n.type)),
    links: graphData.links.filter(l => {
      const srcNode = graphData.nodes.find(n => n.id === (l.source?.id || l.source));
      const tgtNode = graphData.nodes.find(n => n.id === (l.target?.id || l.target));
      return srcNode && tgtNode && activeTypes.includes(srcNode.type) && activeTypes.includes(tgtNode.type);
    }),
  };

  return (
    <div className="h-screen bg-slate-950 text-slate-50 flex flex-col overflow-hidden">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-800 bg-slate-950/98 flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link to="/ai-os" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-xs transition-colors">
            <ArrowLeft size={13} /> OS
          </Link>
          <div className="w-px h-4 bg-slate-700" />
          <div className="flex items-center gap-2">
            <Network size={15} className="text-cyan-400" />
            <h1 className="text-white font-black text-sm">IP Network Graph</h1>
          </div>
          {/* Stats */}
          <div className="hidden md:flex items-center gap-3 ml-2">
            {[
              { label: "Nodes", value: stats.nodes, color: "#00E5FF" },
              { label: "Links", value: stats.links, color: "#a855f7" },
              { label: "Clusters", value: stats.clusters, color: "#22c55e" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500">{s.label}</span>
                <span className="text-xs font-black" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Visual Mode Switcher */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 gap-0.5">
            {VISUAL_MODES.map(m => (
              <button key={m.id} onClick={() => setVisualMode(m.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  visualMode === m.id
                    ? m.id === "electric" ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300"
                      : m.id === "research" ? "bg-purple-500/20 border border-purple-500/40 text-purple-300"
                      : "bg-slate-700 text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}>
                {m.label}
              </button>
            ))}
          </div>

          <button onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              showFilters ? "bg-slate-800 border-slate-600 text-white" : "border-slate-700 text-slate-400 hover:text-white"
            }`}>
            <Filter size={11} /> Filters
          </button>

          <button onClick={loadData} className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white transition-colors">
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Filter Panel */}
        {showFilters && (
          <GraphFilterPanel
            nodeTypes={NODE_TYPES}
            activeTypes={activeTypes}
            onToggleType={toggleType}
            overlays={OVERLAYS}
            activeOverlays={activeOverlays}
            onToggleOverlay={toggleOverlay}
            onClose={() => setShowFilters(false)}
          />
        )}

        {/* Canvas Area */}
        <div className="flex-1 relative">
          {/* Search Bar */}
          <div className="absolute top-3 left-3 z-10 w-64">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search nodes..."
                className="w-full pl-8 pr-8 py-2 rounded-lg bg-slate-900/95 backdrop-blur border border-slate-700 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X size={11} />
                </button>
              )}
            </div>
            {searchResults.length > 0 && (
              <div className="mt-1 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-xl">
                {searchResults.map(n => {
                  const typeInfo = NODE_TYPES.find(t => t.id === n.type);
                  return (
                    <button key={n.id} onClick={() => { setSelectedNode(n); setSearchResults([]); setSearchQuery(""); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-800 transition-colors text-left">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: typeInfo?.color || "#666" }} />
                      <span className="text-white text-xs font-medium truncate">{n.label}</span>
                      <span className="text-slate-500 text-[10px] flex-shrink-0">{typeInfo?.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5">
            <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
              <ZoomIn size={13} />
            </button>
            <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.3))}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
              <ZoomOut size={13} />
            </button>
            <button onClick={() => setZoom(1)}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
              <Maximize2 size={11} />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-3 z-10">
            <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-3 space-y-1.5">
              {NODE_TYPES.filter(t => activeTypes.includes(t.id)).map(t => {
                const Icon = t.icon;
                return (
                  <div key={t.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="text-[10px] text-slate-400">{t.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Loader2 size={28} className="animate-spin text-cyan-400 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Building intelligence graph...</p>
              </div>
            </div>
          ) : (
            <GraphCanvas
              data={filteredData}
              visualMode={visualMode}
              activeOverlays={activeOverlays}
              pinnedNodes={pinnedNodes}
              onNodeClick={setSelectedNode}
              onNodeHover={setHoveredNode}
              onTogglePin={togglePin}
              zoom={zoom}
              onZoomChange={setZoom}
              nodeTypes={NODE_TYPES}
            />
          )}
        </div>

        {/* Detail Panel */}
        {selectedNode && (
          <NodeDetailPanel
            node={selectedNode}
            nodeTypes={NODE_TYPES}
            graphData={graphData}
            pinnedNodes={pinnedNodes}
            onTogglePin={togglePin}
            onClose={() => setSelectedNode(null)}
            onSelectNode={setSelectedNode}
          />
        )}
      </div>
    </div>
  );
}