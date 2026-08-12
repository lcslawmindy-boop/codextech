import { useState, useEffect, useMemo } from "react";
import { Search, FolderKanban, Settings, HelpCircle, Network, List, LayoutGrid, X, ChevronLeft, ChevronRight, Home, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { generateGraph, DOMAINS } from "@/lib/researchGraphData";
import { GRAPH_BG_THEMES } from "@/lib/graphScene3D";
import GraphCanvas from "@/components/research-graph/GraphCanvas3D";
import FilterPanel from "@/components/research-graph/FilterPanel";
import NodeDetailDrawer from "@/components/research-graph/NodeDetailDrawer";
import NodeListView from "@/components/research-graph/NodeListView";
import NodeCardView from "@/components/research-graph/NodeCardView";
import CollectionsPanel from "@/components/research-graph/CollectionsPanel";
import QuickGuideModal from "@/components/research-graph/QuickGuideModal";
import NodeSummaryCard from "@/components/research-graph/NodeSummaryCard";

const GRAPH_MODES = [
  { id: "full", label: "Full Graph", icon: Network },
  { id: "domain-clusters", label: "Domain Clusters", icon: Network },
  { id: "timeline", label: "Timeline", icon: Network },
  { id: "evidence-tier", label: "Evidence Tier", icon: Network },
  { id: "connection-strength", label: "Connection Strength", icon: Network },
  { id: "device-builder", label: "Device Builder", icon: Network },
];

export default function ResearchGraphExplorer() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [viewMode, setViewMode] = useState("graph");
  const [filters, setFilters] = useState({ domains: [], evidence: [], suppression: [], targetSystems: [], minConnections: 0, eraMin: null, eraMax: null, freqMin: null, freqMax: null, population: [], deviceIntegration: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCollections, setShowCollections] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuickGuide, setShowQuickGuide] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSummaryCard, setShowSummaryCard] = useState(false);
  const [graphMode, setGraphMode] = useState("full");
  const [focusNode, setFocusNode] = useState(null);
  const [collections, setCollections] = useState([]);
  const [settings, setSettings] = useState({ showLabels: false, edgeOpacity: 0.3, physicsStrength: -120, showLegend: true, showMiniMap: true, backgroundGrid: false });
  const [isMobile, setIsMobile] = useState(false);
  const [bgTheme, setBgTheme] = useState("Golden Spiral");

  useEffect(() => {
    const data = generateGraph();
    setGraphData(data);
    // Load collections from localStorage
    try {
      const saved = localStorage.getItem("zarp_collections");
      if (saved) setCollections(JSON.parse(saved));
    } catch {}

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    localStorage.setItem("zarp_collections", JSON.stringify(collections));
  }, [collections]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "Escape") { setSelectedNode(null); setShowDrawer(false); setFocusNode(null); }
      if (e.key === "f" || e.key === "F") {/* fit all - handled in canvas */}
      if (e.key === "l" || e.key === "L") setSettings(s => ({ ...s, showLabels: !s.showLabels }));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleNodeClick = (node, isDoubleClick) => {
    if (!node) { setSelectedNode(null); setShowDrawer(false); setShowSummaryCard(false); return; }
    setSelectedNode(node);
    setShowSummaryCard(true);
    setShowDrawer(false);
    if (isDoubleClick) setFocusNode(node);
  };

  const handleAddToCollection = (node, colId) => {
    if (!colId) {
      // Create a default collection if none specified
      const newCol = { id: `col-${Date.now()}`, name: `Collection ${collections.length + 1}`, nodeIds: [node.numericId], created: new Date().toISOString() };
      setCollections(prev => [...prev, newCol]);
      return;
    }
    setCollections(prev => prev.map(c => {
      if (c.id === colId && !c.nodeIds.includes(node.numericId)) {
        return { ...c, nodeIds: [...c.nodeIds, node.numericId] };
      }
      return c;
    }));
  };

  const handleHighlightNodes = (nodeIds) => {
    setShowCollections(false);
    // Could set a highlight state - for now just close the panel
  };

  const nodeCounts = useMemo(() => {
    let visible = graphData.nodes.length;
    if (filters.domains.length > 0) visible = graphData.nodes.filter(n => filters.domains.includes(n.domainId)).length;
    return { visible, total: graphData.nodes.length };
  }, [graphData.nodes, filters]);

  const filteredNodes = useMemo(() => {
    if (!graphData.nodes.length) return [];
    return graphData.nodes.filter(n => {
      if (filters.domains.length > 0 && !filters.domains.includes(n.domainId)) return false;
      if (filters.evidence.length > 0 && !filters.evidence.includes(n.evidence)) return false;
      if (filters.suppression.length > 0 && !filters.suppression.includes(n.suppressionId)) return false;
      if (filters.targetSystems.length > 0 && !n.targetSystems.some(t => filters.targetSystems.includes(t))) return false;
      if (filters.minConnections > 0 && n.connectionCount < filters.minConnections) return false;
      if (filters.eraMin && n.year < filters.eraMin) return false;
      if (filters.eraMax && n.year > filters.eraMax) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!n.label.toLowerCase().includes(q) && !n.researcher.toLowerCase().includes(q) && !n.tags.some(t => t.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [graphData.nodes, filters, searchQuery]);

  const filteredEdgeCount = useMemo(() => {
    if (!graphData.edges.length) return 0;
    const visIds = new Set(filteredNodes.map(n => n.numericId));
    return graphData.edges.filter(e => visIds.has(e.source) && visIds.has(e.target)).length;
  }, [graphData.edges, filteredNodes]);

  // 3D graph is the primary experience on all devices
  const effectiveViewMode = viewMode;

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      {/* Disclaimer bar */}
      <div className="flex-shrink-0 border-b border-slate-800 px-4 py-1.5 bg-slate-950">
        <p className="text-slate-500 text-[9px] leading-relaxed text-center font-mono">
          ⚠ All nodes represent published historical and scientific research for innovation and IP development purposes only. ZARP does not validate or endorse underlying scientific claims. Not medical advice.
        </p>
      </div>

      {/* Header */}
      <header className="flex-shrink-0 bg-slate-950 border-b border-slate-800 px-4 py-2.5 z-20">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Home button + Title */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-400/50 transition-colors" title="Back to Dashboard">
              <Home size={14} /> <span className="text-[10px] font-bold hidden sm:inline">Home</span>
            </Link>
            <div>
              <h1 className="text-amber-400 font-black text-sm tracking-wider leading-none" style={{ fontFamily: "Orbitron, sans-serif" }}>ZARP RESEARCH GRAPH</h1>
              <p className="text-slate-500 text-[9px] mt-0.5">{graphData.nodes.length}+ nodes · {graphData.edges.length}+ connections · {DOMAINS.length} domains</p>
            </div>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search nodes, researchers, mechanisms, frequencies..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 outline-none focus:border-amber-400/50 focus:shadow-md focus:shadow-amber-400/10 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><X size={14} /></button>
            )}
          </div>

          {/* Right: Buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={() => setShowCollections(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold hover:text-amber-400 hover:border-amber-400/50 transition-colors">
              <FolderKanban size={12} /> <span className="hidden lg:inline">Collections</span>
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold hover:text-amber-400 hover:border-amber-400/50 transition-colors">
              <Settings size={12} /> <span className="hidden lg:inline">Settings</span>
            </button>
            <button onClick={() => setShowQuickGuide(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold hover:text-amber-400 hover:border-amber-400/50 transition-colors">
              <HelpCircle size={12} /> <span className="hidden lg:inline">Help</span>
            </button>
            {/* Background theme picker */}
            <select
              value={bgTheme}
              onChange={e => setBgTheme(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold hover:border-amber-400/50 transition-colors outline-none cursor-pointer"
              title="Graph background theme"
            >
              {Object.keys(GRAPH_BG_THEMES).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Labels toggle */}
            <button
              onClick={() => setSettings(s => ({ ...s, showLabels: !s.showLabels }))}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-colors ${settings.showLabels ? "bg-amber-400 text-slate-950 border-amber-400" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-amber-400 hover:border-amber-400/50"}`}
              title="Toggle node & edge labels"
            >
              <Tag size={12} /> <span className="hidden lg:inline">Labels</span>
            </button>

            {/* View toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button onClick={() => setViewMode("graph")} disabled={isMobile} className={`p-1.5 rounded transition-colors ${effectiveViewMode === "graph" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"}`} title="Graph View"><Network size={12} /></button>
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded transition-colors ${effectiveViewMode === "list" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"}`} title="List View"><List size={12} /></button>
              <button onClick={() => setViewMode("cards")} className={`p-1.5 rounded transition-colors ${effectiveViewMode === "cards" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"}`} title="Card View"><LayoutGrid size={12} /></button>
            </div>
          </div>
        </div>

        {/* Graph modes */}
        {effectiveViewMode === "graph" && (
          <div className="flex items-center gap-1 mt-2 overflow-x-auto">
            {GRAPH_MODES.map(m => (
              <button key={m.id} onClick={() => setGraphMode(m.id)} className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors border ${graphMode === m.id ? "bg-amber-400 text-slate-950 border-amber-400" : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-600"}`}>
                {m.label}
              </button>
            ))}
            {focusNode && (
              <button onClick={() => setFocusNode(null)} className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-400 text-[10px] font-bold border border-amber-400/40 hover:bg-amber-400/30 transition-colors ml-auto">
                ← Exit Focus Mode
              </button>
            )}
          </div>
        )}
      </header>

      {/* Settings drawer */}
      {showSettings && (
        <div className="absolute right-0 top-0 bottom-0 w-72 bg-slate-950 border-l border-slate-800 z-30 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-amber-400 text-xs font-black tracking-wider" style={{ fontFamily: "Orbitron, sans-serif" }}>GRAPH SETTINGS</h3>
            <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <Toggle label="Show node labels" value={settings.showLabels} onChange={v => setSettings(s => ({ ...s, showLabels: v }))} />
            <Toggle label="Show legend" value={settings.showLegend} onChange={v => setSettings(s => ({ ...s, showLegend: v }))} />
            <Toggle label="Background grid" value={settings.backgroundGrid} onChange={v => setSettings(s => ({ ...s, backgroundGrid: v }))} />
            <div>
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Edge Opacity: {Math.round(settings.edgeOpacity * 100)}%</label>
              <input type="range" min="0.1" max="1" step="0.1" value={settings.edgeOpacity} onChange={e => setSettings(s => ({ ...s, edgeOpacity: parseFloat(e.target.value) }))} className="w-full accent-amber-400 mt-1" />
            </div>
            <div>
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Physics Strength: {settings.physicsStrength}</label>
              <input type="range" min="-300" max="-30" step="10" value={settings.physicsStrength} onChange={e => setSettings(s => ({ ...s, physicsStrength: parseInt(e.target.value) }))} className="w-full accent-amber-400 mt-1" />
            </div>
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Filter panel */}
        {showFilters && effectiveViewMode !== "graph" || (showFilters && effectiveViewMode === "graph") ? (
          <div className={`${showFilters ? "block" : "hidden"}`}>
            <FilterPanel filters={filters} setFilters={setFilters} nodeCounts={nodeCounts} edgeCount={filteredEdgeCount} />
          </div>
        ) : null}
        {!showFilters && (
          <button onClick={() => setShowFilters(true)} className="w-8 bg-[#0D1117] border-r border-[#21262D] flex items-center justify-center text-[#8B9AB0] hover:text-[#C9A84C] transition-colors flex-shrink-0">
            <ChevronRight size={16} />
          </button>
        )}
        {showFilters && effectiveViewMode === "graph" && (
          <button onClick={() => setShowFilters(false)} className="w-6 bg-[#0D1117] border-r border-[#21262D] flex items-center justify-center text-[#8B9AB0] hover:text-[#C9A84C] transition-colors flex-shrink-0">
            <ChevronLeft size={14} />
          </button>
        )}

        {/* Center content */}
        {effectiveViewMode === "graph" ? (
          <div className="flex-1 relative">
            <GraphCanvas
              allNodes={graphData.nodes}
              allEdges={graphData.edges}
              filters={filters}
              selectedNode={selectedNode}
              onNodeClick={handleNodeClick}
              focusNode={focusNode}
              graphMode={graphMode}
              settings={settings}
              searchQuery={searchQuery}
              bgImages={GRAPH_BG_THEMES[bgTheme]}
            />
          </div>
        ) : effectiveViewMode === "list" ? (
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <NodeListView nodes={filteredNodes} onNodeClick={handleNodeClick} onAddToCollection={handleAddToCollection} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <NodeCardView nodes={filteredNodes} onNodeClick={handleNodeClick} onAddToCollection={handleAddToCollection} />
          </div>
        )}

        {/* Detail drawer */}
        {showDrawer && selectedNode && (
          <NodeDetailDrawer
            node={selectedNode}
            allNodes={graphData.nodes}
            allEdges={graphData.edges}
            onClose={() => { setSelectedNode(null); setShowDrawer(false); }}
            onNodeClick={handleNodeClick}
            collections={collections}
            onAddToCollection={handleAddToCollection}
          />
        )}

        {/* AI summary card — pops up on node click */}
        {showSummaryCard && selectedNode && (
          <NodeSummaryCard
            node={selectedNode}
            allNodes={graphData.nodes}
            allEdges={graphData.edges}
            onClose={() => setShowSummaryCard(false)}
            onNavigateNode={(n) => { setSelectedNode(n); setFocusNode(n); }}
            onOpenFullDetails={() => { setShowSummaryCard(false); setShowDrawer(true); }}
          />
        )}
      </div>

      {/* Collections panel */}
      <CollectionsPanel
        open={showCollections}
        onClose={() => setShowCollections(false)}
        collections={collections}
        setCollections={setCollections}
        allNodes={graphData.nodes}
        onHighlightNodes={handleHighlightNodes}
      />

      {/* Quick guide modal */}
      <QuickGuideModal open={showQuickGuide} onClose={() => setShowQuickGuide(false)} />

      {/* Legal footer */}
      <footer className="flex-shrink-0 bg-slate-950 border-t border-slate-800 px-4 py-2">
        <p className="text-slate-500 text-[9px] leading-relaxed text-center">
          ZARP Research Graph — All nodes represent published historical and scientific research for innovation and IP development purposes only. ZARP does not validate or endorse the underlying scientific claims of any research node. Content is not medical advice. Node connections represent potential engineering integration opportunities — not clinical protocols. © 2026 Aethon Apex IP Holdings LLC.
        </p>
      </footer>
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white text-xs">{label}</span>
      <button onClick={() => onChange(!value)} className={`w-9 h-5 rounded-full transition-colors relative ${value ? "bg-amber-400" : "bg-slate-700"}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? "left-4" : "left-0.5"}`} />
      </button>
    </div>
  );
}