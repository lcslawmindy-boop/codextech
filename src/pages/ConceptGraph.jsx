import { useState } from "react";
import { Link } from "react-router-dom";
import SearchPanel from "../components/SearchPanel";
import ConceptNetworkGraph from "../components/ConceptNetworkGraph";
import NodePanel from "../components/NodePanel";
import TimelineView from "../components/TimelineView";
import ClusterSummaryPanel from "../components/ClusterSummaryPanel";
import TopConceptsPanel from "../components/TopConceptsPanel";
import BusinessConceptGraph from "../components/BusinessConceptGraph";
import BusinessItemsGraph from "../components/BusinessItemsGraph";
import { groupColors, nodes } from "../lib/beardenData";
import NewsletterSignup from "../components/NewsletterSignup";
import MainNav from "../components/MainNav";
import { base44 } from "@/api/base44Client";
import { useState as useAdminState, useEffect as useAdminEffect } from 'react';

export default function ConceptGraph() {
  const [isAdmin, setIsAdmin] = useAdminState(false);
  useAdminEffect(() => {
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
        <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest flex-shrink-0">Attribution</span>
        <span className="text-gray-400 text-xs leading-relaxed">
          All concepts, theories, and source fragments are derived from and attributed to the published works of their original authors, including:{" "}
          <span className="text-yellow-300 font-semibold">Lt. Col. T.E. Bearden</span> (Gravitobiology, Excalibur Briefing, Foundations of Physics Letters),{" "}
          <span className="text-yellow-300 font-semibold">Nikola Tesla</span> (Colorado Springs Diary, Wardenclyffe patents — public domain),{" "}
          <span className="text-yellow-300 font-semibold">Antoine Priore</span> (French Patent 1,342,772; ONR Report R-5-78),{" "}
          <span className="text-yellow-300 font-semibold">R.R. Rife, W. Reich, V. Schauberger, W. Russell, R. Mills, P. LaViolette, E. Podkletnov, J. Hutchison, C. Bohren, T.H. Moray, C.H. Waddington, M.W. Evans et al., J.C. Maxwell</span>, and others.{" "}
          All third-party works remain copyright of their respective authors/estates. Referenced under Fair Use (17 U.S.C. § 107) for educational &amp; research purposes. Zenith Apex LLC claims no ownership of any third-party source material.
        </span>
      </div>
      <div className="flex flex-col border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-3">
        <div>
          <h1 className="text-white font-bold text-lg tracking-tight">Zenith Apex Research Portfolio (ZARP) — AI Operating System for Global R&D and Intellectual Property Creation</h1>
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
            <button
              onClick={() => setView("knowledge-graph")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                view === "knowledge-graph" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Knowledge Graph
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
      {/* Graph tool strip */}
      <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-900/60 border-t border-gray-800/40 flex-shrink-0">
        {/* Graph mode switcher */}
        <div className="flex items-center bg-gray-900 border border-gray-700 rounded-lg p-0.5 gap-0.5 mr-2">
          {[
            { id: "analyst", label: "⬡ ANALYST", title: "Clean government/physics style" },
            { id: "electric", label: "⚡ ELECTRIC", title: "Animated current jolts on links" },
            { id: "research", label: "〰 RESEARCH", title: "Subtle scalar wave pulses" },
          ].map(m => (
            <button key={m.id} title={m.title}
              onClick={() => setGraphMode(m.id)}
              className={`px-3 py-1 rounded text-xs font-bold tracking-wide transition-all ${
                graphMode === m.id
                  ? "bg-gray-700 text-white shadow-inner"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >{m.label}</button>
          ))}
        </div>
        <button
          onClick={() => setShowTopConcepts(s => !s)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${showTopConcepts ? "bg-yellow-700/40 border-yellow-500 text-yellow-200" : "bg-transparent border-yellow-800/40 text-yellow-500 hover:bg-yellow-900/30"}`}
        >📊 Top Concepts</button>
        <button
          onClick={() => { setClusterMode(m => { if (m) setClusterNodes([]); return !m; }); setShowSearch(false); setShowDiagnostics(false); }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${clusterMode ? "bg-indigo-700/40 border-indigo-500 text-indigo-200" : "bg-transparent border-indigo-800/40 text-indigo-400 hover:bg-indigo-900/30"}`}
        >🔗 {clusterMode ? `Cluster (${clusterNodes.length})` : "Cluster"}</button>
        <button
          onClick={() => { setShowDiagnostics(s => !s); setShowSearch(false); }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-purple-800/40 text-purple-400 text-xs font-semibold hover:bg-purple-900/30 transition-all"
        >🔬 Diagnostics</button>
        {view === "graph" && (
          <div className="flex gap-3 ml-auto">
            {groups.map(g => (
              <div key={g} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: groupColors[g] }} />
                <span className="text-gray-600 text-[10px] capitalize">{g}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <MainNav isAdmin={isAdmin} />
      </div>

      {/* Content area */}
      <div className="flex-1 relative overflow-hidden">
        {/* ZARP logo background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15 z-0">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png" alt="ZARP" className="w-screen h-screen object-contain" />
        </div>

        {view === "knowledge-graph" ? (
          <BusinessItemsGraph />
        ) : view === "business" ? (
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
            <div className="absolute inset-0 z-0 pointer-events-none" />
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
              <div className="absolute top-4 right-4 w-80 bg-gray-900 border border-yellow-800/60 rounded-xl shadow-2xl z-20 p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-bold text-sm">Relationship: <span className="text-yellow-400">{selectedLink.label}</span></h3>
                    <p className="text-gray-500 text-xs mt-1">Connection between concepts</p>
                  </div>
                  <button onClick={() => setSelectedLink(null)} className="text-gray-500 hover:text-white text-lg flex-shrink-0">×</button>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
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