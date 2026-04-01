import { useMemo, useState } from "react";
import { X, AlertTriangle, Search, Lightbulb, GitBranch, FileQuestion, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { nodes, links } from "../lib/beardenData";

// ── Diagnostic engine ──────────────────────────────────────────────────────

function runDiagnostics() {
  const issues = [];

  // Build adjacency map
  const degree = {};
  nodes.forEach(n => { degree[n.id] = 0; });
  links.forEach(l => {
    const s = typeof l.source === "object" ? l.source.id : l.source;
    const t = typeof l.target === "object" ? l.target.id : l.target;
    degree[s] = (degree[s] || 0) + 1;
    degree[t] = (degree[t] || 0) + 1;
  });

  // 1. Isolated nodes (degree ≤ 1) — orphaned concepts with no meaningful connections
  nodes.forEach(n => {
    if (degree[n.id] <= 1) {
      issues.push({
        type: "gap",
        severity: "high",
        title: `Isolated Concept: "${n.label}"`,
        detail: `This node has only ${degree[n.id]} connection(s) in the network. It may represent an under-researched concept or a missing bridge to related theories.`,
        nodeIds: [n.id],
        opportunity: `Investigate how "${n.label}" relates to adjacent ${n.group} concepts. Are there undocumented links to scalar EM or gravitobiology frameworks?`,
      });
    }
  });

  // 2. Thin evidence — nodes with fewer than 2 source fragments
  nodes.forEach(n => {
    if (!n.fragments || n.fragments.length < 2) {
      issues.push({
        type: "gap",
        severity: "medium",
        title: `Thin Evidence: "${n.label}"`,
        detail: `Only ${n.fragments?.length ?? 0} source fragment(s) documented for this concept. The theoretical basis is under-cited relative to other nodes.`,
        nodeIds: [n.id],
        opportunity: `Search Bearden's primary texts (Gravitobiology, Energy from the Vacuum, Tesla Electromagnetics) for additional passages referencing "${n.label}".`,
      });
    }
  });

  // 3. Bidirectional contradiction — two nodes linked in both directions with different labels
  const linkMap = {};
  links.forEach(l => {
    const s = typeof l.source === "object" ? l.source.id : l.source;
    const t = typeof l.target === "object" ? l.target.id : l.target;
    const key = `${s}→${t}`;
    const reverseKey = `${t}→${s}`;
    if (linkMap[reverseKey]) {
      const existingLabel = linkMap[reverseKey];
      if (existingLabel !== l.label) {
        const nodeA = nodes.find(n => n.id === s);
        const nodeB = nodes.find(n => n.id === t);
        issues.push({
          type: "contradiction",
          severity: "high",
          title: `Contradictory Relationship: "${nodeA?.label}" ↔ "${nodeB?.label}"`,
          detail: `These two concepts are linked in both directions with different relationship labels ("${existingLabel}" vs "${l.label}"), suggesting a logical tension or unresolved causal directionality.`,
          nodeIds: [s, t],
          opportunity: `Resolve whether the causal arrow flows primarily from "${nodeA?.label}" to "${nodeB?.label}" or vice versa. Consult the 1982 Tesla Electromagnetics series for causal ordering.`,
        });
      }
    }
    linkMap[key] = l.label;
  });

  // 4. Cross-group tension — physics nodes directly linked to consciousness nodes (unusual bridging)
  const TENSION_PAIRS = [["physics", "consciousness"], ["weapons", "biology"], ["consciousness", "weapons"]];
  links.forEach(l => {
    const s = typeof l.source === "object" ? l.source.id : l.source;
    const t = typeof l.target === "object" ? l.target.id : l.target;
    const nodeA = nodes.find(n => n.id === s);
    const nodeB = nodes.find(n => n.id === t);
    if (!nodeA || !nodeB) return;
    const isPair = TENSION_PAIRS.some(
      ([g1, g2]) => (nodeA.group === g1 && nodeB.group === g2) || (nodeA.group === g2 && nodeB.group === g1)
    );
    if (isPair) {
      issues.push({
        type: "contradiction",
        severity: "low",
        title: `Cross-Domain Bridge: "${nodeA.label}" → "${nodeB.label}"`,
        detail: `A direct link exists between a ${nodeA.group} concept and a ${nodeB.group} concept. This bridging relationship may lack sufficient theoretical justification or may represent Bearden's most speculative claims.`,
        nodeIds: [s, t],
        opportunity: `Identify what intermediate mechanism Bearden proposes to bridge ${nodeA.group} and ${nodeB.group}. Is there a mediating concept missing from the network?`,
      });
    }
  });

  // 5. Disconnected groups — any group with no inter-group links
  const groupsWithExternalLinks = new Set();
  links.forEach(l => {
    const s = typeof l.source === "object" ? l.source.id : l.source;
    const t = typeof l.target === "object" ? l.target.id : l.target;
    const nodeA = nodes.find(n => n.id === s);
    const nodeB = nodes.find(n => n.id === t);
    if (nodeA && nodeB && nodeA.group !== nodeB.group) {
      groupsWithExternalLinks.add(nodeA.group);
      groupsWithExternalLinks.add(nodeB.group);
    }
  });
  const allGroups = [...new Set(nodes.map(n => n.group))];
  allGroups.forEach(g => {
    if (!groupsWithExternalLinks.has(g)) {
      issues.push({
        type: "gap",
        severity: "medium",
        title: `Siloed Domain: "${g}" group`,
        detail: `The "${g}" concept group has no inter-domain connections to other groups in the network. This represents a theoretical silo that may hide important relationships.`,
        nodeIds: nodes.filter(n => n.group === g).map(n => n.id),
        opportunity: `Map how the "${g}" domain interfaces with Bearden's scalar EM or gravitobiology frameworks. What is the theoretical handshake between these domains?`,
      });
    }
  });

  return issues;
}

// ── UI ─────────────────────────────────────────────────────────────────────

const SEVERITY_CONFIG = {
  high: { color: "#ef4444", bg: "#ef444415", label: "High Priority", icon: AlertTriangle },
  medium: { color: "#f59e0b", bg: "#f59e0b15", label: "Medium", icon: Search },
  low: { color: "#3b82f6", bg: "#3b82f615", label: "Low", icon: GitBranch },
};

const TYPE_CONFIG = {
  gap: { icon: FileQuestion, label: "Research Gap", color: "#a855f7" },
  contradiction: { icon: Zap, label: "Contradiction", color: "#ef4444" },
};

function IssueCard({ issue, onNodeClick }) {
  const [open, setOpen] = useState(false);
  const sev = SEVERITY_CONFIG[issue.severity];
  const typ = TYPE_CONFIG[issue.type];
  const SevIcon = sev.icon;
  const TypIcon = typ.icon;

  return (
    <div
      className="rounded-xl border overflow-hidden transition-colors"
      style={{ borderColor: sev.color + "40", backgroundColor: sev.bg }}
    >
      <button
        className="w-full text-left p-4 flex items-start gap-3"
        onClick={() => setOpen(o => !o)}
      >
        <SevIcon size={15} className="flex-shrink-0 mt-0.5" style={{ color: sev.color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: typ.color + "25", color: typ.color }}>
              <TypIcon size={10} className="inline mr-1" />
              {typ.label}
            </span>
            <span className="text-xs font-semibold" style={{ color: sev.color }}>{sev.label}</span>
          </div>
          <p className="text-white text-sm font-semibold leading-snug">{issue.title}</p>
        </div>
        {open ? <ChevronUp size={14} className="text-gray-500 flex-shrink-0 mt-1" /> : <ChevronDown size={14} className="text-gray-500 flex-shrink-0 mt-1" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: sev.color + "25" }}>
          <p className="text-gray-400 text-xs leading-relaxed pt-3">{issue.detail}</p>

          <div className="rounded-lg p-3" style={{ backgroundColor: "#22c55e10", borderColor: "#22c55e30", border: "1px solid" }}>
            <div className="flex items-center gap-1.5 mb-1">
              <Lightbulb size={11} className="text-green-400" />
              <span className="text-green-400 text-xs font-semibold uppercase tracking-wider">Research Opportunity</span>
            </div>
            <p className="text-green-200 text-xs leading-relaxed">{issue.opportunity}</p>
          </div>

          {issue.nodeIds?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {issue.nodeIds.map(id => {
                const n = nodes.find(x => x.id === id);
                return n ? (
                  <button
                    key={id}
                    onClick={() => onNodeClick(n)}
                    className="text-xs px-2 py-0.5 rounded-full border transition-colors hover:opacity-80"
                    style={{ borderColor: "#6b728050", backgroundColor: "#6b728015", color: "#9ca3af" }}
                  >
                    → {n.label}
                  </button>
                ) : null;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResearchOpportunities({ onClose, onNodeClick }) {
  const issues = useMemo(() => runDiagnostics(), []);

  const gaps = issues.filter(i => i.type === "gap");
  const contradictions = issues.filter(i => i.type === "contradiction");
  const high = issues.filter(i => i.severity === "high");

  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? issues : issues.filter(i => i.type === filter);

  return (
    <div className="absolute top-4 left-4 w-96 max-h-[calc(100vh-2rem)] flex flex-col bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-gray-700 bg-gray-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Search size={14} className="text-purple-400" />
            <span className="text-purple-400 text-xs font-semibold uppercase tracking-widest">Diagnostic Scanner</span>
          </div>
          <h2 className="text-white font-bold text-base leading-tight">Research Opportunities</h2>
          <p className="text-gray-500 text-xs mt-1">{issues.length} findings · {high.length} high priority</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white ml-2 mt-1">
          <X size={16} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px bg-gray-800 border-b border-gray-700">
        {[
          { label: "Total", value: issues.length, color: "#9ca3af" },
          { label: "Gaps", value: gaps.length, color: "#a855f7" },
          { label: "Contradictions", value: contradictions.length, color: "#ef4444" },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 px-3 py-2 text-center">
            <p className="font-bold text-lg" style={{ color: s.color }}>{s.value}</p>
            <p className="text-gray-600 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-1 p-2 border-b border-gray-800">
        {[["all", "All"], ["gap", "Gaps"], ["contradiction", "Contradictions"]].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`flex-1 py-1 rounded text-xs font-medium transition-colors ${
              filter === val ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Issues list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-8">No findings in this category.</p>
        ) : (
          filtered.map((issue, i) => (
            <IssueCard key={i} issue={issue} onNodeClick={(n) => { onNodeClick(n); }} />
          ))
        )}
      </div>
    </div>
  );
}