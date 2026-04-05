import { useState } from "react";
import { Link } from "react-router-dom";
import SearchPanel from "../components/SearchPanel";
import ConceptNetworkGraph from "../components/ConceptNetworkGraph";
import NodePanel from "../components/NodePanel";
import TimelineView from "../components/TimelineView";
import ClusterSummaryPanel from "../components/ClusterSummaryPanel";
import TopConceptsPanel from "../components/TopConceptsPanel";
import BusinessConceptGraph from "../components/BusinessConceptGraph";
import { groupColors, nodes } from "../lib/beardenData";
import NewsletterSignup from "../components/NewsletterSignup";
import { base44 } from "@/api/base44Client";

export default function ConceptGraph() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [clusterMode, setClusterMode] = useState(false);
  const [clusterNodes, setClusterNodes] = useState([]);
  const [view, setView] = useState("graph");
  const [showTopConcepts, setShowTopConcepts] = useState(false);

  const groups = [...new Set(nodes.map(n => n.group))];

  const handleNodeClick = (node) => {
    // Track click silently
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
    <div className="w-screen h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      {/* Bearden Attribution Banner */}
      <div className="bg-gray-900/80 border-b border-yellow-900/40 px-6 py-1.5 flex items-center gap-3 flex-shrink-0">
        <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest">Attribution</span>
        <span className="text-gray-400 text-xs">
          All concepts, theories, and source fragments are derived from the published works of{" "}
          <span className="text-yellow-300 font-semibold">Lt. Col. Thomas E. Bearden (US Army, Ret.)</span>{" "}
          — including <em>Gravitobiology</em> (1991), <em>Excalibur Briefing</em> (1980/1988),{" "}
          <em>Toward a New Electromagnetics</em> Parts 1–4 (1983), and papers published in{" "}
          <em>Explore!</em>, <em>Foundations of Physics Letters</em>, and Tesla Book Company. No copyright infringement intended.
        </span>
      </div>
      <div className="flex flex-col border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-3">
        <div>
          <h1 className="text-white font-bold text-lg tracking-tight">Bearden Concept Network</h1>
          <p className="text-gray-500 text-xs">Click any node to explore source fragments · Drag to rearrange · Scroll to zoom</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setView("graph")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                view === "graph" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Network
            </button>
            <button
              onClick={() => setView("timeline")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                view === "timeline" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setView("business")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                view === "business" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Business
            </button>
          </div>
          {view === "graph" && (
            <button
              onClick={() => setShowSearch(s => !s)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Search
            </button>
          )}
        </div>
      </div>
      {/* Scrollable nav links row */}
      <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto border-t border-gray-800/60" style={{scrollbarWidth: 'thin'}}>
          <button
            onClick={() => setShowTopConcepts(s => !s)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              showTopConcepts
                ? "bg-yellow-700 border-yellow-500 text-white"
                : "bg-yellow-900/40 hover:bg-yellow-800/50 border-yellow-800 text-yellow-300"
            }`}
          >
            📊 Top Concepts
          </button>
          <button
            onClick={() => {
              setClusterMode(m => {
                if (m) setClusterNodes([]);
                return !m;
              });
              setShowSearch(false);
              setShowDiagnostics(false);
            }}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              clusterMode
                ? "bg-indigo-700 border-indigo-500 text-white"
                : "bg-indigo-900/40 hover:bg-indigo-800/50 border-indigo-800 text-indigo-300"
            }`}
          >
            🔗 {clusterMode ? `Cluster (${clusterNodes.length})` : "Cluster"}
          </button>
          <button
            onClick={() => { setShowDiagnostics(s => !s); setShowSearch(false); }}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/50 border border-purple-800 text-purple-300 text-xs font-medium transition-colors"
          >
            🔬 Diagnostics
          </button>
          <Link to="/investor-package" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-900/40 hover:bg-yellow-800/50 border border-yellow-800 text-yellow-300 text-xs font-medium transition-colors">💼 Investor Package</Link>
          <Link to="/investor-portal" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/40 hover:bg-green-800/50 border border-green-800 text-green-300 text-xs font-medium transition-colors">💰 Investors</Link>
          <Link to="/monitoring" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800/50 border border-blue-800 text-blue-300 text-xs font-medium transition-colors">🛡 Monitor</Link>
          <Link to="/prior-art" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-800/50 border border-amber-800 text-amber-300 text-xs font-medium transition-colors">🗄️ Prior Art</Link>
          <Link to="/patent-tool" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800/50 border border-blue-800 text-blue-300 text-xs font-medium transition-colors">📄 Patent Tool</Link>
          <Link to="/timeline-pitch" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-900/40 hover:bg-orange-800/50 border border-orange-800 text-orange-300 text-xs font-medium transition-colors">📊 Timeline Deck</Link>
          <Link to="/dark-timeline" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-800/50 border border-red-800 text-red-300 text-xs font-medium transition-colors">🌍 Dark vs Light</Link>
          <Link to="/inventor-forge" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800/50 border border-blue-800 text-blue-300 text-xs font-medium transition-colors">🧬 Invention Forge</Link>
          <Link to="/opportunity-monitor" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-900/40 hover:bg-indigo-800/50 border border-indigo-800 text-indigo-300 text-xs font-medium transition-colors">🔔 Opportunity Monitor</Link>
          <Link to="/health-analytics" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-900/40 hover:bg-cyan-800/50 border border-cyan-800 text-cyan-300 text-xs font-medium transition-colors">📈 Health Analytics</Link>
          <Link to="/heavy-metal-detox" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/40 hover:bg-green-800/50 border border-green-800 text-green-300 text-xs font-medium transition-colors">🌿 Metal Detox</Link>
          <Link to="/emf-log" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-800/50 border border-rose-800 text-rose-300 text-xs font-medium transition-colors">📊 EMF Log</Link>
          <Link to="/emf-shop" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-700 text-emerald-300 text-xs font-medium transition-colors">🛒 Shop</Link>
          <Link to="/emf-impact" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-800/50 border border-red-800 text-red-300 text-xs font-medium transition-colors">☠️ EMF Impact</Link>
          <Link to="/scalar-potential" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-900/40 hover:bg-violet-800/50 border border-violet-800 text-violet-300 text-xs font-medium transition-colors">🌊 ∇φ Heatmap</Link>
          <Link to="/scalar-wave-sim" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/40 hover:bg-green-800/50 border border-green-800 text-green-300 text-xs font-medium transition-colors">〰️ Scalar Wave Sim</Link>
          <Link to="/scalar-lab" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/50 border border-purple-800 text-purple-300 text-xs font-medium transition-colors">⚗️ Scalar EM Lab</Link>
          <Link to="/lab" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-900/40 hover:bg-teal-800/50 border border-teal-800 text-teal-300 text-xs font-medium transition-colors">🧪 Wave Lab</Link>
          <Link to="/simulator" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-900/40 hover:bg-cyan-800/50 border border-cyan-800 text-cyan-300 text-xs font-medium transition-colors">⚗️ Simulator</Link>
          <Link to="/business" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/40 hover:bg-green-800/50 border border-green-800 text-green-300 text-xs font-medium transition-colors">💼 Business Models</Link>
          <Link to="/investors" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/40 hover:bg-green-800/50 border border-green-800 text-green-300 text-xs font-medium transition-colors">💰 Investors</Link>
          {view === "graph" && (
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              {groups.map(g => (
                <div key={g} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: groupColors[g] }} />
                  <span className="text-gray-400 text-xs capitalize">{g}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 relative overflow-hidden">
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
            {showDiagnostics && (
              <SearchPanel
                onResultClick={(nodeId) => {
                  const node = nodes.find(n => n.id === nodeId);
                  if (node) { setSelectedNode(node); setShowSearch(false); }
                }}
                onClose={() => setShowSearch(false)}
              />
            )}
            <ConceptNetworkGraph
              onNodeClick={handleNodeClick}
              selectedNodeId={selectedNode?.id}
            />
            <NodePanel node={selectedNode} onClose={() => setSelectedNode(null)} />
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
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/80 border border-gray-700 rounded-full px-4 py-2 text-gray-400 text-xs pointer-events-none">
                  ← Click a node to view source text fragments →
                </div>
                <div className="absolute bottom-20 right-6 w-80">
                  <NewsletterSignup source="concept-graph" compact />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}