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
import { useState as useAdminState, useEffect as useAdminEffect } from 'react';

export default function ConceptGraph() {
  const [isAdmin, setIsAdmin] = useAdminState(false);
  useAdminEffect(() => {
    base44.auth.me().then(u => setIsAdmin(u?.role === 'admin')).catch(() => {});
  }, []);
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
          <h1 className="text-white font-bold text-lg tracking-tight">Zenith Apex Research Database — Invention & Patent Generator</h1>
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
          <Link to="/pricing" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-800/60 hover:bg-green-700/60 border border-green-600 text-green-200 text-xs font-bold transition-colors">💳 Pricing & Plans</Link>
          <Link to="/licensing" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800/60 border border-purple-600 text-purple-200 text-xs font-bold transition-colors">📜 IP Licensing</Link>
          <Link to="/download-center" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-950/60 hover:bg-yellow-900/60 border border-yellow-700 text-yellow-400 text-xs font-bold transition-colors">⬇ Downloads</Link>
          <Link to="/investor-portal" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/40 hover:bg-green-800/50 border border-green-800 text-green-300 text-xs font-medium transition-colors">💰 Investors</Link>
          {isAdmin && <Link to="/monitoring" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800/50 border border-blue-800 text-blue-300 text-xs font-medium transition-colors">🛡 Monitor</Link>}
          <Link to="/prior-art" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-800/50 border border-amber-800 text-amber-300 text-xs font-medium transition-colors">🗄️ Prior Art</Link>
          <Link to="/patent-tool" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800/50 border border-blue-800 text-blue-300 text-xs font-medium transition-colors">📄 Patent Tool</Link>
          <Link to="/timeline-pitch" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-900/40 hover:bg-orange-800/50 border border-orange-800 text-orange-300 text-xs font-medium transition-colors">📊 Timeline Deck</Link>
          <Link to="/invention-library" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-900/40 hover:bg-orange-800/50 border border-orange-800 text-orange-300 text-xs font-bold transition-colors">⚗️ Invention Library</Link>
          <Link to="/invention-timeline" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-900/40 hover:bg-indigo-800/50 border border-indigo-800 text-indigo-300 text-xs font-bold transition-colors">📈 Dev Timeline</Link>
          <Link to="/dark-timeline" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-800/50 border border-red-800 text-red-300 text-xs font-medium transition-colors">🌍 Dark vs Light</Link>
          {isAdmin && <Link to="/acquisition-crm" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/60 hover:bg-green-800/60 border border-green-600 text-green-200 text-xs font-bold transition-colors">🎯 Acquisition CRM</Link>}
          {isAdmin && <Link to="/build-tracker" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800/60 border border-indigo-600 text-indigo-200 text-xs font-bold transition-colors">🔧 Build Tracker</Link>}
          {isAdmin && <Link to="/trz-patent" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800/60 border border-red-700 text-red-200 text-xs font-bold transition-colors">📋 TRZ Patent PPA</Link>}
          {isAdmin && <Link to="/valuation" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-900/60 hover:bg-yellow-800/60 border border-yellow-600 text-yellow-200 text-xs font-bold transition-colors">📈 Valuation Dashboard</Link>}
          <Link to="/device-graph" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-900/60 hover:bg-yellow-800/60 border border-yellow-600 text-yellow-200 text-xs font-bold transition-colors">🕸️ Device Knowledge Graph</Link>
          <Link to="/inventor-forge" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800/50 border border-blue-800 text-blue-300 text-xs font-medium transition-colors">🧬 Invention Forge</Link>
          <Link to="/opportunity-monitor" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-900/40 hover:bg-indigo-800/50 border border-indigo-800 text-indigo-300 text-xs font-medium transition-colors">🔔 Opportunity Monitor</Link>
          {isAdmin && <Link to="/admin-downloads" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-900/40 hover:bg-yellow-800/50 border border-yellow-700 text-yellow-300 text-xs font-medium transition-colors">⭐ Download Center</Link>}
          <Link to="/account" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 text-gray-300 text-xs font-medium transition-colors">👤 Account</Link>
          {isAdmin && <Link to="/admin" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-900/60 hover:bg-yellow-800/60 border border-yellow-600 text-yellow-200 text-xs font-bold transition-colors">🔒 Admin Panel</Link>}
          {isAdmin && <Link to="/social-command" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800/60 border border-rose-600 text-rose-200 text-xs font-bold transition-colors">🚀 Marketing</Link>}
          <Link to="/social-profile-gen" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-900/50 hover:bg-yellow-800/50 border border-yellow-700 text-yellow-300 text-xs font-bold transition-colors">✨ Profile Gen</Link>
          <Link to="/ai-research" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800/60 border border-purple-600 text-purple-200 text-xs font-bold transition-colors">🧠 AI Research</Link>
          <Link to="/health-analytics" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-900/40 hover:bg-cyan-800/50 border border-cyan-800 text-cyan-300 text-xs font-medium transition-colors">📈 Health Analytics</Link>
          <Link to="/heavy-metal-detox" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/40 hover:bg-green-800/50 border border-green-800 text-green-300 text-xs font-medium transition-colors">🌿 Metal Detox</Link>
          <Link to="/emf-log" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-800/50 border border-rose-800 text-rose-300 text-xs font-medium transition-colors">📊 EMF Log</Link>
          <Link to="/emf-shop" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-700 text-emerald-300 text-xs font-medium transition-colors">🛒 Shop</Link>
          <Link to="/build-supplies-shop" className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-900/60 hover:bg-yellow-800/60 border border-yellow-600 text-yellow-200 text-xs font-bold transition-colors">🔧 Build Supplies</Link>
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
            {(showSearch || showDiagnostics) && (
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