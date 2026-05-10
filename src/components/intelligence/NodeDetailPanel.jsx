import { X, Pin, PinOff, ChevronRight, AlertTriangle, TrendingUp, FileText, Clock, Globe, Network } from "lucide-react";

const RISK_COLORS = { high: "#ef4444", medium: "#f97316", low: "#22c55e" };

function MetaRow({ label, value, color }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-slate-800/60">
      <span className="text-slate-500 text-[10px] uppercase tracking-wider flex-shrink-0">{label}</span>
      <span className="text-xs font-semibold text-right" style={{ color: color || "#e2e8f0" }}>{value}</span>
    </div>
  );
}

export default function NodeDetailPanel({ node, nodeTypes, graphData, pinnedNodes, onTogglePin, onClose, onSelectNode }) {
  const typeInfo = nodeTypes.find(t => t.id === node.type);
  const isPinned = pinnedNodes.has(node.id);

  // Find connected nodes
  const connectedLinks = graphData.links.filter(l => {
    const srcId = typeof l.source === "object" ? l.source.id : l.source;
    const tgtId = typeof l.target === "object" ? l.target.id : l.target;
    return srcId === node.id || tgtId === node.id;
  });

  const connectedNodes = connectedLinks.map(l => {
    const srcId = typeof l.source === "object" ? l.source.id : l.source;
    const tgtId = typeof l.target === "object" ? l.target.id : l.target;
    const otherId = srcId === node.id ? tgtId : srcId;
    const other = graphData.nodes.find(n => n.id === otherId);
    return other ? { node: other, link: l } : null;
  }).filter(Boolean).slice(0, 8);

  return (
    <div className="w-80 border-l border-slate-800 bg-slate-950 flex flex-col overflow-hidden flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: typeInfo?.color || "#888" }} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{typeInfo?.label || node.type}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => onTogglePin(node.id)}
              className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              title={isPinned ? "Unpin" : "Pin"}>
              {isPinned
                ? <PinOff size={12} className="text-yellow-400" />
                : <Pin size={12} className="text-slate-500 hover:text-yellow-400" />}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
              <X size={12} className="text-slate-500 hover:text-white" />
            </button>
          </div>
        </div>
        <h2 className="text-white font-black text-sm leading-snug">{node.label}</h2>
        {node.description && (
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed line-clamp-3">{node.description}</p>
        )}
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-slate-800 flex-shrink-0 space-y-0.5">
        <MetaRow label="Type" value={node.type?.replace("_", " ")} />
        <MetaRow label="Connections" value={node.degree} color="#00E5FF" />
        {node.synergy_score && <MetaRow label="Synergy Score" value={`${node.synergy_score}/100`} color="#fbbf24" />}
        {node.ip_valuation && <MetaRow label="IP Valuation" value={node.ip_valuation} color="#22c55e" />}
        {node.year && <MetaRow label="Year" value={node.year} />}
        {node.inventor && <MetaRow label="Inventor" value={node.inventor} />}
        {node.category && <MetaRow label="Category" value={node.category} />}
        {node.outcome && <MetaRow label="Outcome" value={node.outcome} />}
        {node.status && <MetaRow label="Status" value={node.status} />}
        {node.stage && <MetaRow label="Stage" value={node.stage} />}
        {node.patent_numbers && <MetaRow label="Patents" value={node.patent_numbers} />}
        {node.risk_level && (
          <MetaRow label="Risk Level" value={node.risk_level?.toUpperCase()} color={RISK_COLORS[node.risk_level]} />
        )}
        {node.risk_score !== undefined && (
          <MetaRow label="Risk Score" value={`${node.risk_score}/100`} color={RISK_COLORS[node.risk_level] || "#888"} />
        )}
      </div>

      {/* Intelligence Flags */}
      {node.type === "prior_art" && node.risk_level === "high" && (
        <div className="mx-4 mt-3 p-3 rounded-lg bg-red-950/30 border border-red-800/40 flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={12} className="text-red-400" />
            <span className="text-red-300 text-xs font-black">HIGH RISK FLAG</span>
          </div>
          <p className="text-red-200/70 text-[10px] leading-relaxed">
            This prior art poses a significant conflict risk. Review claim language and consider defensive citations.
          </p>
        </div>
      )}

      {node.type === "invention" && node.synergy_score >= 80 && (
        <div className="mx-4 mt-3 p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={12} className="text-cyan-400" />
            <span className="text-cyan-300 text-xs font-black">HIGH-VALUE INVENTION</span>
          </div>
          <p className="text-cyan-200/70 text-[10px] leading-relaxed">
            Synergy score above 80 — prioritize patent filing and commercialization pathway.
          </p>
        </div>
      )}

      {/* Connected Nodes */}
      {connectedNodes.length > 0 && (
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
            Connected Nodes ({connectedNodes.length})
          </p>
          <div className="space-y-1.5">
            {connectedNodes.map(({ node: n, link }) => {
              const nType = n.type;
              const colors = {
                invention: "#00E5FF", claim: "#a855f7", prior_art: "#f97316",
                patent_family: "#22c55e", competitor: "#ef4444", market: "#fbbf24"
              };
              return (
                <button key={n.id} onClick={() => onSelectNode(n)}
                  className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 transition-all text-left group">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors[nType] || "#666" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[11px] font-semibold truncate">{n.label}</p>
                    <p className="text-slate-600 text-[9px]">{link.label || nType}</p>
                  </div>
                  <ChevronRight size={10} className="text-slate-700 group-hover:text-slate-300 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}