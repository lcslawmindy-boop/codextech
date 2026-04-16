import { useState } from "react";
import { X, BookOpen, Sparkles, Loader2, Bookmark, BookmarkCheck, Link2, Share2 } from "lucide-react";
import ExportToDocButton from "./ExportToDocButton";
import { base44 } from "@/api/base44Client";
import { groupColors, nodes as allNodes, links as allLinks } from "../lib/beardenData";

export default function NodePanel({ node, onClose }) {
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!node) return null;

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.ResearchActivity.create({
      type: "saved_node",
      node_id: node.id,
      node_label: node.label,
      node_group: node.group,
      node_description: node.description,
    });
    setSaved(true);
    setSaving(false);
  };

  const handleSummarize = async () => {
    setLoadingSummary(true);
    setSummary(null);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a scholarly assistant analyzing the theoretical work of Lt. Col. Thomas E. Bearden. Synthesize the following text fragments about "${node.label}" into a concise, readable 3-4 sentence overview. Be accurate, neutral, and informative. Do not add opinions or judgments.\n\nFragments:\n${node.fragments.map((f, i) => `${i + 1}. ${f}`).join("\n")}`,
    });
    setSummary(result);
    // Track summary
    await base44.entities.ResearchActivity.create({
      type: "ai_summary",
      node_id: node.id,
      node_label: node.label,
      node_group: node.group,
      summary_text: result,
    });
    setLoadingSummary(false);
  };

  const color = groupColors[node.group] || "#6b7280";

  // Get related nodes (connected via links)
  const relatedNodeIds = allLinks
    .filter(l => {
      const src = typeof l.source === 'object' ? l.source.id : l.source;
      const tgt = typeof l.target === 'object' ? l.target.id : l.target;
      return src === node.id || tgt === node.id;
    })
    .map(l => {
      const src = typeof l.source === 'object' ? l.source.id : l.source;
      const tgt = typeof l.target === 'object' ? l.target.id : l.target;
      return src === node.id ? tgt : src;
    });

  const relatedNodes = allNodes.filter(n => relatedNodeIds.includes(n.id)).slice(0, 5);

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-gray-900 border-l border-gray-700 shadow-2xl z-30 flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(135deg, ${color}08 0%, transparent 100%)` }} />
      <div className="flex-shrink-0 p-6 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-xs uppercase tracking-widest font-bold" style={{ color }}>
                {node.group}
              </span>
            </div>
            <h2 className="text-white font-bold text-xl leading-tight">{node.label}</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white flex-shrink-0 mt-1">
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">{node.description}</p>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-800">
          <button
            onClick={handleSave}
            disabled={saving || saved}
            title={saved ? "Saved!" : "Save to My Research"}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition-colors disabled:opacity-50 flex-1"
          >
            {saved ? <BookmarkCheck size={13} className="text-yellow-400" /> : <Bookmark size={13} />}
            {saved ? "Saved" : "Save"}
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}?node=${node.id}`);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition-colors flex-1"
          >
            <Share2 size={13} />
            Share
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* AI Summary Section */}
        <div className="p-6 border-b border-gray-800">
          <button
            onClick={handleSummarize}
            disabled={loadingSummary}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-900/30 hover:bg-purple-900/50 border border-purple-700 text-purple-300 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {loadingSummary ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {loadingSummary ? "Generating AI Summary…" : "Generate AI Summary"}
          </button>
          {summary && (
            <div className="mt-3 bg-purple-950/30 border border-purple-800/50 rounded-lg p-4">
              <p className="text-purple-100 text-sm leading-relaxed">{summary}</p>
            </div>
          )}
        </div>

        {/* Source Fragments */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={14} className="text-gray-400" />
            <h3 className="text-gray-300 font-semibold text-sm">Source Fragments</h3>
            <span className="ml-auto text-gray-600 text-xs">{node.fragments.length}</span>
          </div>
          <div className="space-y-2">
            {node.fragments.map((text, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 hover:bg-gray-800 transition-colors">
                <p className="text-gray-300 text-xs leading-relaxed italic">"{text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Concepts */}
        {relatedNodes.length > 0 && (
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Link2 size={14} className="text-gray-400" />
              <h3 className="text-gray-300 font-semibold text-sm">Related Concepts</h3>
              <span className="ml-auto text-gray-600 text-xs">{relatedNodeIds.length}</span>
            </div>
            <div className="space-y-2">
              {relatedNodes.map(rn => {
                const rColor = groupColors[rn.group] || "#6b7280";
                return (
                  <div
                    key={rn.id}
                    className="flex items-start gap-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group"
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: rColor }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-200 text-xs font-medium group-hover:text-white transition-colors">{rn.label}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{rn.group}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Export */}
        <div className="p-6">
          <ExportToDocButton node={node} aiSummary={summary} />
        </div>
      </div>
    </div>
  );
}