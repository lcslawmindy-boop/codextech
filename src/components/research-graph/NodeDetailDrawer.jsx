import { useState, useMemo } from "react";
import { X, ExternalLink, Plus, Settings, Download, Link2, Star, Zap, Brain, Activity, Globe, ChevronRight } from "lucide-react";

export default function NodeDetailDrawer({ node, allNodes, allEdges, onClose, onNodeClick, collections, onAddToCollection }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [connFilter, setConnFilter] = useState("all");

  const nodeConnections = useMemo(() => {
    if (!node) return [];
    const conns = allEdges
      .filter(e => e.source === node.numericId || e.target === node.numericId)
      .map(e => {
        const otherId = e.source === node.numericId ? e.target : e.source;
        const otherNode = allNodes.find(n => n.numericId === otherId);
        return { ...e, otherNode, direction: e.source === node.numericId ? "out" : "in" };
      })
      .filter(c => c.otherNode);
    return conns.sort((a, b) => b.strength - a.strength);
  }, [node, allNodes, allEdges]);

  if (!node) return null;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "connections", label: `Connections (${nodeConnections.length})` },
    { id: "research", label: "Research" },
    { id: "build", label: "Build" },
    { id: "collections", label: "Collections" },
  ];

  const connTypeFilters = ["all", "FREQUENCY_OVERLAP", "BIOLOGICAL_MECHANISM", "ENGINEERING_SYNERGY", "HISTORICAL_LINEAGE", "SUPPRESSION_PATTERN", "CLINICAL_EVIDENCE"];
  const filteredConns = connFilter === "all" ? nodeConnections : nodeConnections.filter(c => c.type === connFilter);

  return (
    <div className="w-[400px] flex-shrink-0 bg-[#0D1117] border-l border-[#21262D] flex flex-col h-full">
      {/* Header */}
      <div className="h-1 flex-shrink-0" style={{ backgroundColor: node.domainColor }} />
      <div className="px-4 py-3 border-b border-[#21262D] flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <span className="px-2 py-0.5 rounded text-[9px] font-bold mb-1 inline-block" style={{ backgroundColor: node.domainColor + "20", color: node.domainColor }}>
            {node.domain}
          </span>
          <h2 className="text-[#F0F6FF] font-bold text-base leading-tight" style={{ fontFamily: "Orbitron, sans-serif" }}>{node.label}</h2>
          <p className="text-[#8B9AB0] text-[10px] font-mono mt-1">{node.id}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button className="p-1.5 rounded hover:bg-[#161B22] text-[#8B9AB0] hover:text-[#F0F6FF] transition-colors" title="Expand"><ExternalLink size={14} /></button>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-[#161B22] text-[#8B9AB0] hover:text-[#F0F6FF] transition-colors" title="Close"><X size={14} /></button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#21262D] overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-3 py-2.5 text-[10px] font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === t.id ? "border-[#C9A84C] text-[#C9A84C]" : "border-transparent text-[#8B9AB0] hover:text-[#F0F6FF]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <Info label="Suppression"><span style={{ color: node.suppressionColor }}>{node.suppression}</span></Info>
              <Info label="Evidence"><span className="text-[#10B981]">{"★".repeat(node.evidence)}{"☆".repeat(5 - node.evidence)}</span></Info>
              <Info label="Era">{node.era}</Info>
              <Info label="Researcher">{node.researcher}</Info>
              <Info label="Year">{node.year}</Info>
              <Info label="Connections"><span className="text-[#C9A84C]">{node.connectionCount}</span></Info>
            </div>

            <div>
              <h3 className="text-[#F0F6FF] text-xs font-bold mb-1">Description</h3>
              <p className="text-[#8B9AB0] text-[11px] leading-relaxed">{node.description}</p>
            </div>

            <div>
              <h3 className="text-[#F0F6FF] text-xs font-bold mb-2">Documented Effects</h3>
              <div className="space-y-1">
                {node.documentedEffects.map((e, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-[#8B9AB0]">
                    <span>{e.icon}</span><span>{e.effect}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[#F0F6FF] text-xs font-bold mb-1">Mechanism</h3>
              <p className="text-[#8B9AB0] text-[11px] leading-relaxed">{node.mechanism}</p>
            </div>

            {node.frequency && (
              <div>
                <h3 className="text-[#F0F6FF] text-xs font-bold mb-1">Frequency Data</h3>
                <p className="text-[#8B9AB0] text-[11px] font-mono">Primary: {node.frequency} {node.frequencyUnit}</p>
              </div>
            )}

            <div>
              <h3 className="text-[#F0F6FF] text-xs font-bold mb-2">Target Systems</h3>
              <div className="flex flex-wrap gap-1.5">
                {node.targetSystems.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[#161B22] border border-[#21262D] text-[#8B9AB0] text-[10px]">{t}</span>
                ))}
              </div>
            </div>

            {node.suppressionId === "suppressed" && (
              <div className="rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 p-3">
                <h3 className="text-[#EF4444] text-xs font-bold mb-1">Suppression Notes</h3>
                <p className="text-[#8B9AB0] text-[10px] leading-relaxed">Suppressed by institutional forces. Method: funding withdrawal, peer blacklisting, and equipment seizure. Current status: dormant — revived through ZARP research.</p>
              </div>
            )}

            <div>
              <h3 className="text-[#F0F6FF] text-xs font-bold mb-1">Device Integration Potential</h3>
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${node.deviceIntegration === "HIGH" ? "bg-[#10B981]/15 text-[#10B981]" : node.deviceIntegration === "MEDIUM" ? "bg-[#F59E0B]/15 text-[#F59E0B]" : "bg-[#161B22] text-[#8B9AB0]"}`}>
                {node.deviceIntegration === "HIGH" ? "✅ HIGH" : node.deviceIntegration === "MEDIUM" ? "🟡 MEDIUM" : "⚪ THEORETICAL"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#21262D]">
              <button onClick={() => onAddToCollection(node)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#161B22] border border-[#21262D] text-[#F0F6FF] text-[10px] font-bold hover:border-[#C9A84C]/50 transition-colors">
                <Plus size={12} /> Add to Collection
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#161B22] border border-[#21262D] text-[#F0F6FF] text-[10px] font-bold hover:border-[#9B30FF]/50 transition-colors">
                <Settings size={12} /> Add to Device Plan
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#161B22] border border-[#21262D] text-[#F0F6FF] text-[10px] font-bold hover:border-[#1D6FA4]/50 transition-colors">
                <Download size={12} /> Export
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#161B22] border border-[#21262D] text-[#F0F6FF] text-[10px] font-bold hover:border-[#1D6FA4]/50 transition-colors">
                <Link2 size={12} /> Copy Link
              </button>
            </div>
          </div>
        )}

        {/* Connections */}
        {activeTab === "connections" && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="rounded-lg bg-[#161B22] p-2"><p className="text-[#8B9AB0]">Total</p><p className="text-[#C9A84C] font-bold text-sm">{nodeConnections.length}</p></div>
              <div className="rounded-lg bg-[#161B22] p-2"><p className="text-[#8B9AB0]">Strongest</p><p className="text-[#F0F6FF] font-bold text-[10px]">{nodeConnections[0]?.otherNode?.label?.substring(0, 12) || "—"}</p></div>
              <div className="rounded-lg bg-[#161B22] p-2"><p className="text-[#8B9AB0]">Top Type</p><p className="text-[#F0F6FF] font-bold text-[10px]">{nodeConnections[0]?.typeLabel?.substring(0, 12) || "—"}</p></div>
            </div>

            <div className="flex flex-wrap gap-1">
              {connTypeFilters.map(f => (
                <button key={f} onClick={() => setConnFilter(f)} className={`px-2 py-0.5 rounded text-[9px] font-bold transition-colors ${connFilter === f ? "bg-[#C9A84C] text-[#030712]" : "bg-[#161B22] text-[#8B9AB0] hover:text-[#F0F6FF]"}`}>
                  {f === "all" ? "All" : f.split("_")[0]}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredConns.slice(0, 20).map(c => (
                <div key={c.id} className="rounded-lg bg-[#161B22] border border-[#21262D] p-2.5 cursor-pointer hover:border-[#C9A84C]/30 transition-colors" onClick={() => onNodeClick(c.otherNode)}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="h-1 w-8 rounded-full" style={{ backgroundColor: c.typeColor }} />
                    <span className="text-[#8B9AB0] text-[9px]">●{"●".repeat(Math.ceil(c.strength / 2))}{"○".repeat(5 - Math.ceil(c.strength / 2))} {c.strength}/10</span>
                  </div>
                  <p className="text-[#F0F6FF] text-[11px] font-bold leading-tight">{c.otherNode.label}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ backgroundColor: c.otherNode.domainColor + "20", color: c.otherNode.domainColor }}>{c.otherNode.domain}</span>
                    <span className="text-[#C9A84C] text-[9px] hover:underline">View →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research */}
        {activeTab === "research" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-[#F0F6FF] text-xs font-bold mb-2">Key Publications / Sources</h3>
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="rounded-lg bg-[#161B22] border border-[#21262D] p-2.5">
                    <p className="text-[#F0F6FF] text-[10px] font-bold">{i}. {node.researcher} — "{node.label}: A Comprehensive Study, Part {i}"</p>
                    <p className="text-[#8B9AB0] text-[9px] mt-0.5">Journal of {node.domain} Research — {node.year}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#10B981]/15 text-[#10B981]">{node.evidenceLabel}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-[#F0F6FF] text-xs font-bold mb-2">Researcher Timeline</h3>
              <div className="space-y-1.5">
                {[{ y: node.year - 5, e: "Initial research begun", c: "#C9A84C" }, { y: node.year, e: "Primary publication", c: "#10B981" }, { y: node.year + 3, e: "Replication attempts", c: "#3B82F6" }, { y: node.year + 8, e: "Revival through ZARP", c: "#C9A84C" }].map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.c }} />
                    <span className="text-[#8B9AB0] text-[10px] font-mono w-10">{t.y}</span>
                    <span className="text-[#F0F6FF] text-[10px]">{t.e}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-[#F0F6FF] text-xs font-bold mb-2">Related Researchers</h3>
              <div className="space-y-1.5">
                {["Robert O. Becker", "Glen Rein", "Fritz Popp"].map(r => (
                  <div key={r} className="flex items-center gap-2 rounded-lg bg-[#161B22] p-2">
                    <div className="w-7 h-7 rounded-full bg-[#21262D] flex items-center justify-center text-[#8B9AB0] text-[10px] font-bold">{r[0]}</div>
                    <div><p className="text-[#F0F6FF] text-[10px] font-bold">{r}</p><p className="text-[#8B9AB0] text-[9px]">Documented 3+ shared mechanisms</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Build */}
        {activeTab === "build" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-[#F0F6FF] text-xs font-bold mb-2">Current Usage</h3>
              <p className="text-[#8B9AB0] text-[10px] mb-2">This node is used in 2 of your device plans:</p>
              <div className="space-y-1.5">
                <div className="rounded-lg bg-[#161B22] border border-[#21262D] p-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[#F0F6FF] text-[10px] font-bold">AATCS-P1 Autism Therapy Pod</p>
                    <span className="px-1.5 py-0.5 rounded text-[8px] bg-[#10B981]/15 text-[#10B981]">Primary</span>
                  </div>
                </div>
                <div className="rounded-lg bg-[#161B22] border border-[#21262D] p-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[#F0F6FF] text-[10px] font-bold">AuraWell MedBed AATCS-P2</p>
                    <span className="px-1.5 py-0.5 rounded text-[8px] bg-[#F59E0B]/15 text-[#F59E0B]">Secondary</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-[#F0F6FF] text-xs font-bold mb-2">Suggested Pairings (AI-Generated)</h3>
              <div className="space-y-1.5">
                {nodeConnections.slice(0, 3).map(c => (
                  <div key={c.id} className="rounded-lg bg-[#161B22] border border-[#21262D] p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[#F0F6FF] text-[10px] font-bold">{c.otherNode.label}</p>
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ backgroundColor: c.otherNode.domainColor + "20", color: c.otherNode.domainColor }}>{c.otherNode.domain}</span>
                    </div>
                    <p className="text-[#8B9AB0] text-[9px]">Shared {c.typeLabel} — strength {c.strength}/10</p>
                    <button className="mt-1 text-[#C9A84C] text-[9px] hover:underline flex items-center gap-1"><Plus size={8} /> Add both to new plan</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-[#F59E0B]/40 bg-[#F59E0B]/10 p-3">
              <h3 className="text-[#F59E0B] text-xs font-bold mb-1">IP Opportunity</h3>
              <p className="text-[#8B9AB0] text-[10px] leading-relaxed">Multi-system integration combining {node.label} with complementary modalities may represent a patentable innovation.</p>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[#030712] font-bold text-xs" style={{ backgroundColor: "#C9A84C" }}>
              <Settings size={14} /> New Device Plan — Pre-load this node
            </button>
          </div>
        )}

        {/* Collections */}
        {activeTab === "collections" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-[#F0F6FF] text-xs font-bold mb-2">Saved To</h3>
              {collections.filter(c => c.nodeIds.includes(node.numericId)).length === 0 ? (
                <p className="text-[#8B9AB0] text-[10px]">Not in any collection yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {collections.filter(c => c.nodeIds.includes(node.numericId)).map(c => (
                    <div key={c.id} className="flex items-center justify-between rounded-lg bg-[#161B22] p-2">
                      <span className="text-[#F0F6FF] text-[10px] font-bold">{c.name}</span>
                      <span className="text-[#8B9AB0] text-[9px]">{c.nodeIds.length} nodes</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-[#F0F6FF] text-xs font-bold mb-2">Add to Collection</h3>
              <select className="w-full px-3 py-2 rounded-lg bg-[#161B22] border border-[#21262D] text-[#F0F6FF] text-xs outline-none focus:border-[#C9A84C]/50" onChange={e => e.target.value && onAddToCollection(node, e.target.value)}>
                <option value="">Select collection...</option>
                {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <h3 className="text-[#F0F6FF] text-xs font-bold mb-2">Share Node</h3>
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#161B22] border border-[#21262D] text-[#F0F6FF] text-[10px] font-bold hover:border-[#1D6FA4]/50 transition-colors">
                <Link2 size={12} /> Copy shareable link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, children }) {
  return (
    <div className="rounded-lg bg-[#161B22] p-2">
      <p className="text-[#8B9AB0] text-[9px] uppercase tracking-wider">{label}</p>
      <p className="text-[#F0F6FF] text-[11px] font-bold mt-0.5">{children}</p>
    </div>
  );
}