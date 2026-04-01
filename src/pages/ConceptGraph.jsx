import { useState } from "react";
import { Link } from "react-router-dom";
import SearchPanel from "../components/SearchPanel";
import ResearchOpportunities from "../components/ResearchOpportunities";
import ConceptNetworkGraph from "../components/ConceptNetworkGraph";
import NodePanel from "../components/NodePanel";
import TimelineView from "../components/TimelineView";
import ClusterSummaryPanel from "../components/ClusterSummaryPanel";
import { groupColors, nodes } from "../lib/beardenData";

export default function ConceptGraph() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [clusterMode, setClusterMode] = useState(false);
  const [clusterNodes, setClusterNodes] = useState([]);
  const [view, setView] = useState("graph");

  const groups = [...new Set(nodes.map(n => n.group))];

  return (
    <div className="w-screen h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 flex-shrink-0">
        <div>
          <h1 className="text-white font-bold text-lg tracking-tight">Bearden Concept Network</h1>
          <p className="text-gray-500 text-xs">Click any node to explore source fragments · Drag to rearrange · Scroll to zoom</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setClusterMode(m => {
                if (m) setClusterNodes([]);
                return !m;
              });
              setShowSearch(false);
              setShowDiagnostics(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              clusterMode
                ? "bg-indigo-700 border-indigo-500 text-white"
                : "bg-indigo-900/40 hover:bg-indigo-800/50 border-indigo-800 text-indigo-300"
            }`}
          >
            🔗 {clusterMode ? `Cluster (${clusterNodes.length})` : "Cluster"}
          </button>
          <button
            onClick={() => { setShowDiagnostics(s => !s); setShowSearch(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/50 border border-purple-800 text-purple-300 text-xs font-medium transition-colors"
          >
            🔬 Diagnostics
          </button>
          <Link
            to="/my-research"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-900/40 hover:bg-yellow-800/50 border border-yellow-800 text-yellow-300 text-xs font-medium transition-colors"
          >
            🔖 My Research
          </Link>
          <Link
            to="/business"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/40 hover:bg-green-800/50 border border-green-800 text-green-300 text-xs font-medium transition-colors"
          >
            💼 Business Models
          </Link>
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

          {view === "graph" && (
            <div className="flex flex-wrap gap-3">
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
        {view === "timeline" ? (
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
              onNodeClick={(node) => {
                if (clusterMode) {
                  setClusterNodes(prev =>
                    prev.find(n => n.id === node.id)
                      ? prev.filter(n => n.id !== node.id)
                      : [...prev, node]
                  );
                } else {
                  setSelectedNode(node);
                }
              }}
              selectedNodeId={selectedNode?.id}
            />
            <NodePanel node={selectedNode} onClose={() => setSelectedNode(null)} />
            {!selectedNode && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/80 border border-gray-700 rounded-full px-4 py-2 text-gray-400 text-xs pointer-events-none">
                ← Click a node to view source text fragments →
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}