import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Wrench, Gavel, Zap, Gift, DollarSign, Crosshair, Search } from "lucide-react";
import SearchPanel from "../components/SearchPanel";
import ConceptNetworkGraph from "../components/ConceptNetworkGraph";
import NodePanel from "../components/NodePanel";
import TimelineView from "../components/TimelineView";
import ClusterSummaryPanel from "../components/ClusterSummaryPanel";
import TopConceptsPanel from "../components/TopConceptsPanel";
import BusinessConceptGraph from "../components/BusinessConceptGraph";
import { groupColors, nodes } from "../lib/beardenData";
import NewsletterSignup from "../components/NewsletterSignup";
import MainNav from "../components/MainNav";
import ResearchDatabaseFeatures from "../components/ResearchDatabaseFeatures";
import MonetizationFeatures from "../components/MonetizationFeatures";
import MembershipTiers from "../components/MembershipTiers";
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
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Tactical Header */}
      <div className="bg-black border-b border-green-900/40 px-6 py-2 flex items-center gap-3">
        <Crosshair size={14} className="text-green-400 flex-shrink-0" />
        <span className="text-green-400 text-xs font-mono font-bold tracking-widest flex-shrink-0">ZARP-TAC</span>
        <span className="text-gray-600 text-xs">|</span>
        <span className="text-gray-500 text-xs font-mono">ZENITH APEX RESEARCH PORTFOLIO · CLASSIFIED R&D DATABASE</span>
        <span className="ml-auto text-green-600 text-[10px] font-mono animate-pulse">● LIVE</span>
      </div>

      {/* Attribution Banner */}
      <div className="bg-gray-900/80 border-b border-yellow-900/40 px-6 py-1.5 flex items-center gap-3">
        <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest flex-shrink-0">Attribution</span>
        <span className="text-gray-400 text-xs leading-relaxed">
          Concepts derived from published works of T.E. Bearden, Nikola Tesla, A. Prioré, R.R. Rife, W. Reich, V. Schauberger, et al. Fair Use (17 U.S.C. § 107) — educational &amp; research purposes.
        </span>
      </div>

      {/* Title + View Toggle */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-900/50 border-b border-gray-800">
        <div>
          <h1 className="text-white font-black text-lg tracking-tight">Aethon Apex IP Holdings — AI Operating System for Global R&amp;D</h1>
          <p className="text-gray-500 text-xs font-mono">Click any node to explore · Drag to rearrange · Scroll to zoom</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg p-0.5 gap-0.5">
            <button onClick={() => setView("graph")} className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${view === "graph" ? "bg-green-900/60 text-green-400 border border-green-700" : "text-gray-400 hover:text-gray-200"}`}>NETWORK</button>
            <button onClick={() => setView("timeline")} className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${view === "timeline" ? "bg-green-900/60 text-green-400 border border-green-700" : "text-gray-400 hover:text-gray-200"}`}>TIMELINE</button>
            <button onClick={() => setView("business")} className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${view === "business" ? "bg-green-900/60 text-green-400 border border-green-700" : "text-gray-400 hover:text-gray-200"}`}>BUSINESS</button>
          </div>
          {view === "graph" && (
            <button onClick={() => setShowSearch(s => !s)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm transition-colors">
              <Search size={14} /> Search
            </button>
          )}
        </div>
      </div>

      {/* Tactical tool strip */}
      <div className="flex items-center gap-2 px-4 py-1.5 bg-black border-b border-green-900/30 flex-wrap">
        <button onClick={() => setShowTopConcepts(s => !s)} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono font-bold transition-all ${showTopConcepts ? "bg-green-900/40 border-green-600 text-green-400" : "border-green-900/40 text-green-600 hover:bg-green-900/20"}`}>◆ TOP CONCEPTS</button>
        <button onClick={() => { setClusterMode(m => { if (m) setClusterNodes([]); return !m; }); setShowSearch(false); setShowDiagnostics(false); }} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono font-bold transition-all ${clusterMode ? "bg-cyan-900/40 border-cyan-600 text-cyan-400" : "border-cyan-900/40 text-cyan-600 hover:bg-cyan-900/20"}`}>⊞ CLUSTER {clusterMode ? `(${clusterNodes.length})` : ""}</button>
        <button onClick={() => { setShowDiagnostics(s => !s); setShowSearch(false); }} className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-purple-900/40 text-purple-500 text-xs font-mono font-bold hover:bg-purple-900/20 transition-all">⊕ DIAGNOSTICS</button>
        <div className="flex gap-3 ml-auto">
          {groups.map(g => (
            <div key={g} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: groupColors[g] }} />
              <span className="text-gray-600 text-[10px] font-mono uppercase">{g}</span>
            </div>
          ))}
        </div>
      </div>
      <MainNav isAdmin={isAdmin} />

      {/* Graph Hero — fixed height night-vision display */}
      <div className="relative bg-black" style={{ height: "560px" }}>
        {view === "business" ? (
          <BusinessConceptGraph />
        ) : view === "timeline" ? (
          <TimelineView onConceptClick={(nodeId) => { const node = nodes.find(n => n.id === nodeId); if (node) { setView("graph"); setSelectedNode(node); } }} />
        ) : (
          <>
            {clusterMode && clusterNodes.length > 0 && (
              <ClusterSummaryPanel nodes={clusterNodes} onRemoveNode={(id) => setClusterNodes(prev => prev.filter(n => n.id !== id))} onClear={() => setClusterNodes([])} onClose={() => { setClusterMode(false); setClusterNodes([]); }} />
            )}
            {(showSearch || showDiagnostics) && (
              <SearchPanel onResultClick={(nodeId) => { const node = nodes.find(n => n.id === nodeId); if (node) { setSelectedNode(node); setShowSearch(false); } }} onClose={() => setShowSearch(false)} />
            )}
            <div className="absolute inset-0">
              <ConceptNetworkGraph onNodeClick={handleNodeClick} selectedNodeId={selectedNode?.id} graphMode="nightvision" onLinkClick={setSelectedLink} />
            </div>
            <NodePanel node={selectedNode} onClose={() => setSelectedNode(null)} />
            {selectedLink && (
              <div className="absolute top-4 right-4 w-80 bg-black border border-green-700/60 rounded-xl shadow-2xl z-20 p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-green-400 font-mono font-bold text-sm">LINK: <span className="text-green-300">{selectedLink.label}</span></h3>
                    <p className="text-gray-600 text-xs mt-1 font-mono">Connection between concepts</p>
                  </div>
                  <button onClick={() => setSelectedLink(null)} className="text-gray-500 hover:text-green-400 text-lg flex-shrink-0">×</button>
                </div>
              </div>
            )}
            {showTopConcepts && (
              <TopConceptsPanel onClose={() => setShowTopConcepts(false)} onNodeClick={(nodeId) => { const node = nodes.find(n => n.id === nodeId); if (node) { setSelectedNode(node); setShowTopConcepts(false); } }} />
            )}
            {!selectedNode && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 border border-green-900/40 rounded-full px-4 py-2 text-green-500 text-xs font-mono pointer-events-none">
                ← CLICK A NODE TO VIEW SOURCE FRAGMENTS →
              </div>
            )}
          </>
        )}
      </div>

      {/* Research Database Features */}
      <ResearchDatabaseFeatures />

      {/* Monetization Engine Features */}
      <MonetizationFeatures />

      {/* Membership Tiers */}
      <MembershipTiers />

      {/* Newsletter */}
      <div className="py-12 px-6 bg-gray-950 border-t border-gray-900">
        <div className="max-w-2xl mx-auto">
          <NewsletterSignup source="concept-graph-home" />
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="bg-gray-900 border-t border-gray-800 py-4 px-4 flex items-center justify-center gap-2 flex-wrap">
        <Link to="/course-catalogue" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-300 text-xs font-semibold transition-all whitespace-nowrap">
          <BookOpen size={13} /> Courses
        </Link>
        <Link to="/device-catalogue" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-300 text-xs font-semibold transition-all whitespace-nowrap">
          <Wrench size={13} /> Invention Builds
        </Link>
        <Link to="/patent-hub" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-300 text-xs font-semibold transition-all whitespace-nowrap">
          <Gavel size={13} /> Patent Suite
        </Link>
        <Link to="/invention-forge" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-300 text-xs font-semibold transition-all whitespace-nowrap">
          <Zap size={13} /> Invention Forge
        </Link>
        <Link to="/member-portal" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-300 text-xs font-semibold transition-all whitespace-nowrap">
          <Gift size={13} /> Membership
        </Link>
        <Link to="/pricing" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-300 text-xs font-semibold transition-all whitespace-nowrap">
          <DollarSign size={13} /> Pricing
        </Link>
      </div>
    </div>
  );
}