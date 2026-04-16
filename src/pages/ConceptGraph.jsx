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
import NavDropdown from "../components/NavDropdown";
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
      {/* Organized nav bar */}
      <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto border-t border-gray-800/60 flex-shrink-0" style={{scrollbarWidth: 'none'}}>
          {/* Graph tools */}
          <button
            onClick={() => setShowTopConcepts(s => !s)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              showTopConcepts ? "bg-yellow-700/50 border-yellow-500 text-yellow-200" : "bg-yellow-900/20 border-yellow-800/50 text-yellow-400 hover:bg-yellow-900/40"
            }`}
          >
            📊 Top Concepts
          </button>
          <button
            onClick={() => { setClusterMode(m => { if (m) setClusterNodes([]); return !m; }); setShowSearch(false); setShowDiagnostics(false); }}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              clusterMode ? "bg-indigo-700/50 border-indigo-500 text-indigo-200" : "bg-indigo-900/20 border-indigo-800/50 text-indigo-400 hover:bg-indigo-900/40"
            }`}
          >
            🔗 {clusterMode ? `Cluster (${clusterNodes.length})` : "Cluster"}
          </button>

          <div className="w-px h-5 bg-gray-700 flex-shrink-0" />

          {/* Inventions */}
          <NavDropdown label="Inventions" icon="⚗️" color="#f59e0b" isAdmin={isAdmin} items={[
            { emoji: "📚", label: "Invention Library", path: "/invention-library", desc: "Browse all device architectures" },
            { emoji: "🧬", label: "Invention Forge", path: "/inventor-forge", desc: "AI invention generation" },
            { emoji: "🔬", label: "R&D Sandbox", path: "/rd-sandbox", desc: "Cross-domain AI synthesis" },
            { emoji: "🧪", label: "Hybrid Portfolio", path: "/hybrid-portfolio", desc: "AI hybrid inventions" },
            { emoji: "📐", label: "Build Plans", path: "/invention-plans", desc: "Full engineering build plans" },
            { emoji: "🕸️", label: "Device Knowledge Graph", path: "/device-graph", desc: "Component relationships" },
            { emoji: "🔧", label: "Build Milestone AI", path: "/build-milestone-ai", desc: "AI build tracking" },
            { emoji: "🛒", label: "Build Supplies Shop", path: "/build-supplies-shop", desc: "Parts & components" },
          ]} />

          {/* IP Tools */}
          <NavDropdown label="IP Tools" icon="⚖️" color="#6366f1" isAdmin={isAdmin} items={[
            { emoji: "🛡️", label: "FTO Analysis", path: "/fto-analysis", desc: "AI freedom-to-operate" },
            { emoji: "⚖️", label: "Patent Attorney Chat", path: "/patent-attorney-chat", desc: "USPTO-trained AI attorney" },
            { emoji: "🔍", label: "Patent Intelligence", path: "/patent-intelligence", desc: "4-tool IP analysis suite" },
            { emoji: "✍️", label: "Patent Drafting Wizard", path: "/patent-drafting-wizard", desc: "7-step USPTO workflow" },
            { emoji: "📄", label: "Patent Tool", path: "/patent-tool", desc: "Classic patent drafter" },
            { emoji: "📋", label: "Provisional Patent", path: "/provisional-patent", desc: "35 USC 111(b) PPA" },
            { emoji: "🗄️", label: "Prior Art Archive", path: "/prior-art", desc: "200+ documented entries" },
            { emoji: "🗺️", label: "Patent Landscape", path: "/patent-landscape", desc: "IP landscape graph" },
            { emoji: "💼", label: "IP Marketplace", path: "/ip-marketplace", desc: "Private IP exchange" },
            { emoji: "🤝", label: "Co-Inventor Matching", path: "/co-inventor-matching", desc: "AI inventor introductions" },
            { emoji: "📝", label: "Collab Patent Draft", path: "/collab-patent-draft", desc: "Multi-user editing" },
            { emoji: "🏥", label: "IP Portfolio Health", path: "/ip-portfolio-health", desc: "Live portfolio scoring" },
            { emoji: "🎯", label: "SBIR/STTR Pipeline", path: "/sbir-pipeline", desc: "Grant auto-matching" },
          ]} />

          {/* Research */}
          <NavDropdown label="Research" icon="🧠" color="#a855f7" isAdmin={isAdmin} items={[
            { emoji: "🧠", label: "AI Research Assistant", path: "/ai-research", desc: "Intelligent research tool" },
            { emoji: "📈", label: "Dark vs Light Timeline", path: "/dark-timeline", desc: "Suppression history" },
            { emoji: "📊", label: "Timeline Pitch Deck", path: "/timeline-pitch", desc: "Research timeline deck" },
            { emoji: "📅", label: "Dev Timeline", path: "/invention-timeline", desc: "Invention history" },
            { emoji: "🔬", label: "Diagnostics", path: "#diagnostics", desc: "Graph diagnostics" },
          ]} />

          {/* Labs */}
          <NavDropdown label="Labs" icon="🌊" color="#06b6d4" isAdmin={isAdmin} items={[
            { emoji: "〰️", label: "Scalar Wave Sim", path: "/scalar-wave-sim" },
            { emoji: "🌊", label: "Scalar Field Sim", path: "/scalar-sim" },
            { emoji: "⚗️", label: "Scalar EM Lab", path: "/scalar-lab" },
            { emoji: "🗺️", label: "∇φ Potential Map", path: "/scalar-potential" },
            { emoji: "🧪", label: "Wave Lab", path: "/lab" },
            { emoji: "⚗️", label: "Simulator", path: "/simulator" },
          ]} />

          {/* Investors */}
          <NavDropdown label="Investors" icon="💼" color="#22c55e" isAdmin={isAdmin} items={[
            { emoji: "💰", label: "Investor Portal", path: "/investor-portal" },
            { emoji: "📦", label: "Investor Package", path: "/investor-package" },
            { emoji: "📜", label: "Term Sheets", path: "/term-sheet" },
            { emoji: "🔒", label: "VDR Portal", path: "/vdr/:token", desc: "Investor data room" },
            { emoji: "📊", label: "Valuation Dashboard", path: "/valuation", adminOnly: true },
            { emoji: "🎯", label: "Acquisition CRM", path: "/acquisition-crm", adminOnly: true },
            { emoji: "💹", label: "Investor CRM", path: "/investor-crm", adminOnly: true },
            { emoji: "🚀", label: "Vision Fund Pitch", path: "/vision-fund-pitch" },
            { emoji: "📋", label: "Pitch Script", path: "/pitch-script" },
          ]} />

          {/* Courses & Learning */}
          <NavDropdown label="Learn" icon="📚" color="#f97316" isAdmin={isAdmin} items={[
            { emoji: "📚", label: "Course Catalog", path: "/courses" },
            { emoji: "🎓", label: "My Learning", path: "/my-learning" },
            { emoji: "📖", label: "Course Plan", path: "/course-plan" },
            { emoji: "📥", label: "Download Center", path: "/download-center" },
            { emoji: "🔰", label: "Beginner Manual", path: "/beginner-manual" },
            { emoji: "📖", label: "Glossary", path: "/glossary" },
            { emoji: "🛠️", label: "Troubleshooting", path: "/troubleshooting" },
          ]} />

          {/* Health */}
          <NavDropdown label="Health" icon="💚" color="#10b981" isAdmin={isAdmin} items={[
            { emoji: "☠️", label: "EMF Impact", path: "/emf-impact" },
            { emoji: "📊", label: "EMF Log", path: "/emf-log" },
            { emoji: "📈", label: "Health Analytics", path: "/health-analytics" },
            { emoji: "🌿", label: "Heavy Metal Detox", path: "/heavy-metal-detox" },
            { emoji: "🛒", label: "EMF Protection Shop", path: "/emf-shop" },
          ]} />

          {/* Account */}
          <NavDropdown label="Account" icon="👤" color="#94a3b8" isAdmin={isAdmin} items={[
            { emoji: "👤", label: "My Account", path: "/account" },
            { emoji: "📊", label: "Member Portal", path: "/member-portal" },
            { emoji: "💳", label: "Pricing & Plans", path: "/pricing" },
            { emoji: "✨", label: "Social Profile Gen", path: "/social-profile-gen" },
          ]} />

          {isAdmin && (
            <>
              <div className="w-px h-5 bg-gray-700 flex-shrink-0" />
              <NavDropdown label="Admin" icon="🔒" color="#eab308" isAdmin={isAdmin} items={[
                { emoji: "🏠", label: "Admin Hub", path: "/admin" },
                { emoji: "📊", label: "Marketing", path: "/marketing" },
                { emoji: "🚀", label: "Social Command", path: "/social-command" },
                { emoji: "👥", label: "Beta Applications", path: "/admin-beta" },
                { emoji: "🔒", label: "VDR Admin", path: "/vdr-admin" },
                { emoji: "📋", label: "TRZ Patent PPA", path: "/trz-patent" },
                { emoji: "🔧", label: "Build Tracker", path: "/build-tracker" },
                { emoji: "🛍️", label: "Shop Orders", path: "/admin-shop-orders" },
              ]} />
            </>
          )}

          {view === "graph" && (
            <>
              <div className="w-px h-5 bg-gray-700 flex-shrink-0" />
              <div className="flex gap-2 flex-shrink-0">
                {groups.map(g => (
                  <div key={g} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: groupColors[g] }} />
                    <span className="text-gray-500 text-[10px] capitalize">{g}</span>
                  </div>
                ))}
              </div>
            </>
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