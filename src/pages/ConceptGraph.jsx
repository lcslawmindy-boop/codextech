import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchPanel from "../components/SearchPanel";
import ConceptNetworkGraph from "../components/ConceptNetworkGraph";
import NodePanel from "../components/NodePanel";
import TimelineView from "../components/TimelineView";
import ClusterSummaryPanel from "../components/ClusterSummaryPanel";
import TopConceptsPanel from "../components/TopConceptsPanel";
import BusinessConceptGraph from "../components/BusinessConceptGraph";
import NewsletterSignup from "../components/NewsletterSignup";
import { groupColors, nodes } from "../lib/beardenData";
import { base44 } from "@/api/base44Client";
import { Network, FlaskConical, BookOpen, Scale, HeartPulse, Search, ChevronLeft, ChevronRight } from "lucide-react";

// All nav groups for the sidebar
const NAV_GROUPS = [
  {
    label: "IP & Inventions",
    color: "#f59e0b",
    links: [
      { emoji: "📚", label: "Library", path: "/invention-library" },
      { emoji: "🧬", label: "Forge", path: "/inventor-forge" },
      { emoji: "⚗️", label: "R&D Lab", path: "/rd-sandbox" },
      { emoji: "🧪", label: "Hybrid", path: "/hybrid-portfolio" },
      { emoji: "🕸️", label: "Device Graph", path: "/device-graph" },
      { emoji: "📐", label: "Build Plans", path: "/invention-plans" },
      { emoji: "🔧", label: "Build AI", path: "/build-milestone-ai" },
      { emoji: "🛒", label: "Build Supplies", path: "/build-supplies-shop" },
      { emoji: "🛡️", label: "FTO Analysis", path: "/fto-analysis" },
      { emoji: "⚖️", label: "Patent Attorney AI", path: "/patent-attorney-chat" },
      { emoji: "🔍", label: "Patent Intelligence", path: "/patent-intelligence" },
      { emoji: "✍️", label: "Patent Wizard", path: "/patent-drafting-wizard" },
      { emoji: "📄", label: "PPA Drafter", path: "/provisional-patent" },
    ],
  },
];

const BOTTOM_TABS = [
  { label: "Graph", path: "/", icon: Network },
  { label: "Inventions", path: "/invention-library", icon: FlaskConical },
  { label: "Courses", path: "/courses", icon: BookOpen },
  { label: "IP Tools", path: "/patent-intelligence", icon: Scale },
  { label: "Health", path: "/emf-impact", icon: HeartPulse },
];

const GROUP_COLORS = {
  physics: "#4fc3f7",
  biology: "#69f0ae",
  weapons: "#ff6b6b",
  consciousness: "#ce93d8",
  history: "#ffcc02",
  philosophy: "#80deea",
};

export default function ConceptGraph() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    base44.auth.me().then(u => setIsAdmin(u?.role === 'admin')).catch(() => {});
  }, []);

  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [clusterMode, setClusterMode] = useState(false);
  const [clusterNodes, setClusterNodes] = useState([]);
  const [view, setView] = useState("graph");
  const [showTopConcepts, setShowTopConcepts] = useState(false);
  const [graphMode, setGraphMode] = useState("analyst");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const groups = [...new Set(nodes.map(n => n.group))];

  const handleNodeClick = (node) => {
    base44.functions.invoke("trackNodeClick", { node_id: node.id, label: node.label, group: node.group });
    if (clusterMode) {
      setClusterNodes(prev =>
        prev.find(n => n.id === node.id)
          ? prev.filter(n => n.id !== node.id)
          : [...prev, node]
      );
    } else {
      setSelectedNode(node);
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden" style={{ backgroundColor: "#0a0f1a" }}>

      {/* ── LEFT SIDEBAR ── */}
      <div
        className="flex-shrink-0 flex flex-col border-r overflow-hidden transition-all duration-300"
        style={{
          width: sidebarCollapsed ? 0 : 240,
          backgroundColor: "#0d1526",
          borderColor: "#1e293b",
          minWidth: sidebarCollapsed ? 0 : 240,
        }}
      >
        {/* ZARP Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b flex-shrink-0" style={{ borderColor: "#1e293b" }}>
          <img
            src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png"
            alt="ZARP"
            className="w-10 h-10 object-contain flex-shrink-0"
          />
          <div>
            <div className="text-white font-black text-sm leading-tight">ZARP</div>
            <div className="text-xs leading-tight" style={{ color: "#4fc3f7" }}>Zenith Apex</div>
            <div className="text-xs leading-tight" style={{ color: "#4fc3f7" }}>Research Portfolio</div>
          </div>
        </div>

        {/* Scrollable sidebar content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

          {/* Mode Switcher */}
          <div className="px-3 pt-4 pb-2">
            <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#64748b" }}>Mode Switcher</div>
            <div className="space-y-1">
              {[
                { id: "analyst", label: "⬡ ANALYST" },
                { id: "electric", label: "⚡ ELECTRIC" },
                { id: "research", label: "〰 RESEARCH" },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setGraphMode(m.id)}
                  className="w-full text-left px-3 py-1.5 rounded text-xs font-bold tracking-wide transition-all"
                  style={{
                    backgroundColor: graphMode === m.id ? "#1e3a5f" : "transparent",
                    color: graphMode === m.id ? "#4fc3f7" : "#64748b",
                    border: graphMode === m.id ? "1px solid #1e4d7b" : "1px solid transparent",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* View Tabs */}
          <div className="px-3 py-2">
            <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#64748b" }}>View Tabs</div>
            <div className="space-y-1">
              {[
                { id: "graph", label: "Network" },
                { id: "timeline", label: "Timeline" },
                { id: "business", label: "Business" },
              ].map(v => (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  className="w-full text-left px-3 py-2 rounded text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: view === v.id ? "#1e293b" : "transparent",
                    color: view === v.id ? "#ffffff" : "#64748b",
                    border: view === v.id ? "1px solid #334155" : "1px solid transparent",
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Graph Tools */}
          <div className="px-3 py-2">
            <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#64748b" }}>Graph Tools</div>
            <div className="space-y-1">
              <button
                onClick={() => setShowTopConcepts(s => !s)}
                className="w-full text-left px-3 py-2 rounded text-xs font-semibold transition-all"
                style={{
                  backgroundColor: showTopConcepts ? "#3b3200" : "transparent",
                  color: showTopConcepts ? "#ffcc02" : "#fbbf24",
                  border: showTopConcepts ? "1px solid #f59e0b40" : "1px solid transparent",
                }}
              >
                📊 Top Concepts
              </button>
              <button
                onClick={() => { setClusterMode(m => { if (m) setClusterNodes([]); return !m; }); setShowSearch(false); setShowDiagnostics(false); }}
                className="w-full text-left px-3 py-2 rounded text-xs font-semibold transition-all"
                style={{
                  backgroundColor: clusterMode ? "#1e1b4b" : "transparent",
                  color: clusterMode ? "#a5b4fc" : "#818cf8",
                  border: clusterMode ? "1px solid #6366f140" : "1px solid transparent",
                }}
              >
                🔗 {clusterMode ? `Cluster (${clusterNodes.length})` : "Cluster"}
              </button>
              <button
                onClick={() => { setShowDiagnostics(s => !s); setShowSearch(false); }}
                className="w-full text-left px-3 py-2 rounded text-xs font-semibold transition-all"
                style={{
                  color: "#c084fc",
                  border: "1px solid transparent",
                }}
              >
                🔬 Diagnostics
              </button>
              <button
                onClick={() => setShowSearch(s => !s)}
                className="w-full text-left px-3 py-2 rounded text-xs font-semibold transition-all flex items-center gap-2"
                style={{ color: "#94a3b8", border: "1px solid transparent" }}
              >
                <Search size={11} /> Search Nodes
              </button>
            </div>
          </div>

          {/* IP & Inventions nav grid */}
          <div className="px-3 py-2">
            <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#64748b" }}>IP & Inventions</div>
            <div className="grid grid-cols-2 gap-1">
              {NAV_GROUPS[0].links.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex flex-col items-center justify-center gap-1 rounded py-2 px-1 transition-colors group"
                  style={{ backgroundColor: "#111827" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1e293b"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#111827"}
                >
                  <span className="text-lg leading-none">{link.emoji}</span>
                  <span className="text-[9px] font-bold text-center leading-tight" style={{ color: "#9ca3af" }}>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom nav tabs in sidebar */}
          <div className="px-3 py-2 border-t mt-2" style={{ borderColor: "#1e293b" }}>
            <div className="space-y-1">
              {BOTTOM_TABS.map(tab => {
                const Icon = tab.icon;
                const active = tab.path === "/";
                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    className="flex items-center gap-3 px-3 py-2 rounded transition-all"
                    style={{ backgroundColor: active ? "#1e293b" : "transparent" }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = "#111827"; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <Icon size={16} style={{ color: active ? "#ffcc02" : "#4b5563" }} strokeWidth={active ? 2.5 : 1.8} />
                    <span className="text-xs font-semibold" style={{ color: active ? "#ffcc02" : "#4b5563" }}>{tab.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="px-3 py-3 border-t" style={{ borderColor: "#1e293b" }}>
            <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#64748b" }}>Legend</div>
            <div className="space-y-1.5">
              {groups.map(g => (
                <div key={g} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: GROUP_COLORS[g] || groupColors[g] }} />
                  <span className="text-xs capitalize" style={{ color: "#94a3b8" }}>{g}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Attribution */}
          <div className="px-3 py-3 border-t text-[10px] leading-relaxed" style={{ borderColor: "#1e293b", color: "#475569" }}>
            All concepts derived from published works including{" "}
            <span style={{ color: "#f59e0b" }} className="font-semibold">Lt. Col. T.E. Bearden</span>,{" "}
            <span style={{ color: "#f59e0b" }} className="font-semibold">Nikola Tesla</span>,{" "}
            <span style={{ color: "#f59e0b" }} className="font-semibold">Antoine Priore</span>,{" "}
            <span style={{ color: "#f59e0b" }} className="font-semibold">R.R. Rife, W. Reich, V. Schauberger, W. Russell, R. Mills, P. LaViolette, E. Podkletnov, J. Hutchison, C. Bohren, T.H. Moray, C.H. Waddington, M.W. Evans et al., J.C. Maxwell</span>,
            and others. Referenced under Fair Use (17 U.S.C. § 107). Zenith Apex LLC claims no ownership of any third-party source material.
          </div>

        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setSidebarCollapsed(c => !c)}
        className="absolute z-30 flex items-center justify-center w-5 h-12 rounded-r transition-colors"
        style={{
          left: sidebarCollapsed ? 0 : 240,
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
          borderLeft: "none",
          color: "#64748b",
        }}
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* ── RIGHT CONTENT AREA ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Top bar */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0"
          style={{ backgroundColor: "#0d1526", borderColor: "#1e293b" }}
        >
          <h1 className="text-white font-bold text-base tracking-tight leading-tight">
            Zenith Apex Research Portfolio (ZARP)
          </h1>
          <button
            onClick={() => setShowSearch(s => !s)}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
            style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#4fc3f7" }}
          >
            <Search size={16} />
          </button>
        </div>

        {/* Graph content area */}
        <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: "#0a0f1a" }}>
          {/* ZARP logo background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
            <img
              src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png"
              alt="ZARP"
              className="w-full h-full object-contain"
            />
          </div>

          {view === "business" ? (
            <BusinessConceptGraph />
          ) : view === "timeline" ? (
            <TimelineView
              onConceptClick={(nodeId) => {
                const node = nodes.find(n => n.id === nodeId);
                if (node) { setView("graph"); setSelectedNode(node); }
              }}
            />
          ) : (
            <>
              {clusterMode && clusterNodes.length > 0 && (
                <ClusterSummaryPanel
                  nodes={clusterNodes}
                  onRemoveNode={(id) => setClusterNodes(prev => prev.filter(n => n.id !== id))}
                  onClear={() => setClusterNodes([])}
                  onClose={() => { setClusterMode(false); setClusterNodes([]); }}
                />
              )}
              {(showSearch || showDiagnostics) && (
                <SearchPanel
                  onResultClick={(nodeId) => {
                    const node = nodes.find(n => n.id === nodeId);
                    if (node) { setSelectedNode(node); setShowSearch(false); }
                  }}
                  onClose={() => setShowSearch(false)}
                />
              )}
              <div className="absolute inset-0 z-10">
                <ConceptNetworkGraph
                  onNodeClick={handleNodeClick}
                  selectedNodeId={selectedNode?.id}
                  graphMode={graphMode}
                  onLinkClick={setSelectedLink}
                />
              </div>
              <NodePanel node={selectedNode} onClose={() => setSelectedNode(null)} />
              {selectedLink && (
                <div className="absolute top-4 right-4 w-80 rounded-xl shadow-2xl z-20 p-4 flex flex-col gap-3"
                  style={{ backgroundColor: "#0d1526", border: "1px solid #f59e0b40" }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-bold text-sm">Relationship: <span style={{ color: "#f59e0b" }}>{selectedLink.label}</span></h3>
                      <p className="text-xs mt-1" style={{ color: "#475569" }}>Connection between concepts</p>
                    </div>
                    <button onClick={() => setSelectedLink(null)} className="text-gray-500 hover:text-white text-lg flex-shrink-0">×</button>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>
                    This link represents a significant relationship in Bearden's theoretical framework. Click the connected nodes to explore how these concepts relate to the broader research network.
                  </p>
                </div>
              )}
              {showTopConcepts && (
                <TopConceptsPanel
                  onClose={() => setShowTopConcepts(false)}
                  onNodeClick={(nodeId) => {
                    const node = nodes.find(n => n.id === nodeId);
                    if (node) { setSelectedNode(node); setShowTopConcepts(false); }
                  }}
                />
              )}
              {!selectedNode && (
                <>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 text-xs pointer-events-none"
                    style={{ backgroundColor: "#0d1526cc", border: "1px solid #1e293b", color: "#64748b" }}>
                    ← Click a node to view source text fragments →
                  </div>
                  <div className="absolute bottom-20 right-6 w-72">
                    <NewsletterSignup source="concept-graph" compact />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}