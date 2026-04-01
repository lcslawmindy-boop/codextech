import { useState } from "react";
import { X, Layers, Sparkles, Loader2, XCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { groupColors } from "../lib/beardenData";

export default function ClusterSummaryPanel({ nodes, onRemoveNode, onClose, onClear }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    setSummary(null);

    const clusterText = nodes.map(n =>
      `### ${n.label} (${n.group})\n${n.description}\nKey fragments:\n${n.fragments.slice(0, 2).map(f => `- "${f}"`).join("\n")}`
    ).join("\n\n");

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a senior research analyst specializing in unconventional electromagnetics and the theoretical frameworks of Lt. Col. Thomas E. Bearden.

The user has selected a cluster of ${nodes.length} interconnected concepts from the Bearden Concept Network. Your task is to write a high-level research abstract — a coherent synthesis that explains:

1. What this cluster represents as a unified theoretical domain
2. The key relationships and dependencies between these concepts
3. The broader significance of this cluster within Bearden's overall framework
4. One or two open research questions this cluster raises

Concepts selected:
${clusterText}

Write a 4–5 paragraph abstract. Be precise, scholarly, and grounded in the documented text. Avoid speculation beyond what the source material supports. Do not use bullet points — write in flowing academic prose.`,
      model: "claude_sonnet_4_6",
    });

    setSummary(result);
    setLoading(false);
  };

  const groupCounts = nodes.reduce((acc, n) => {
    acc[n.group] = (acc[n.group] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="absolute top-4 left-4 w-96 max-h-[calc(100vh-2rem)] flex flex-col bg-gray-900 border border-indigo-800/60 rounded-xl shadow-2xl z-20 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-gray-700 bg-gray-900 sticky top-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers size={13} className="text-indigo-400" />
            <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">Cluster Analysis</span>
          </div>
          <h2 className="text-white font-bold text-base leading-tight">{nodes.length} Nodes Selected</h2>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {Object.entries(groupCounts).map(([group, count]) => (
              <span
                key={group}
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: (groupColors[group] || "#6b7280") + "25", color: groupColors[group] || "#9ca3af" }}
              >
                {count} {group}
              </span>
            ))}
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white ml-2 mt-1 flex-shrink-0">
          <X size={16} />
        </button>
      </div>

      {/* Selected node chips */}
      <div className="p-3 border-b border-gray-800 flex flex-wrap gap-1.5">
        {nodes.map(n => {
          const color = groupColors[n.group] || "#6b7280";
          return (
            <button
              key={n.id}
              onClick={() => onRemoveNode(n.id)}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors hover:opacity-70"
              style={{ borderColor: color + "50", backgroundColor: color + "15", color }}
              title="Click to remove"
            >
              {n.label}
              <XCircle size={10} />
            </button>
          );
        })}
        <button
          onClick={onClear}
          className="text-xs px-2 py-1 rounded-full border border-gray-700 text-gray-600 hover:text-gray-400 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Summary area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!summary && !loading && (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm mb-1">
              {nodes.length < 2
                ? "Select at least 2 nodes to generate a cluster abstract."
                : `Ready to synthesize ${nodes.length} concepts into a research abstract.`}
            </p>
            {nodes.length >= 2 && (
              <p className="text-gray-600 text-xs">Uses Claude Sonnet for higher quality output.</p>
            )}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 size={22} className="animate-spin text-indigo-400" />
            <p className="text-gray-400 text-sm">Synthesizing cluster abstract…</p>
            <p className="text-gray-600 text-xs">This may take 10–20 seconds</p>
          </div>
        )}

        {summary && (
          <div className="bg-indigo-950/30 border border-indigo-800/50 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles size={12} className="text-indigo-400" />
              <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">Cluster Abstract</span>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="p-3 border-t border-gray-800 sticky bottom-0 bg-gray-900">
        <button
          onClick={handleSummarize}
          disabled={loading || nodes.length < 2}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {loading ? "Generating…" : summary ? "Re-generate Abstract" : "Generate Cluster Abstract"}
        </button>
      </div>
    </div>
  );
}