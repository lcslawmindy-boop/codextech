import { useState } from "react";
import { X, BookOpen, Sparkles, Loader2 } from "lucide-react";
import ExportToDocButton from "./ExportToDocButton";
import { base44 } from "@/api/base44Client";
import { groupColors } from "../lib/beardenData";

export default function NodePanel({ node, onClose }) {
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  if (!node) return null;

  const handleSummarize = async () => {
    setLoadingSummary(true);
    setSummary(null);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a scholarly assistant analyzing the theoretical work of Lt. Col. Thomas E. Bearden. Synthesize the following text fragments about "${node.label}" into a concise, readable 3-4 sentence overview. Be accurate, neutral, and informative. Do not add opinions or judgments.\n\nFragments:\n${node.fragments.map((f, i) => `${i + 1}. ${f}`).join("\n")}`,
    });
    setSummary(result);
    setLoadingSummary(false);
  };

  const color = groupColors[node.group] || "#6b7280";

  return (
    <div className="absolute top-4 right-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-10 flex flex-col">
      <div className="flex items-start justify-between p-4 border-b border-gray-700 sticky top-0 bg-gray-900 rounded-t-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color }}>
              {node.group}
            </span>
          </div>
          <h2 className="text-white font-bold text-lg leading-tight">{node.label}</h2>
          <p className="text-gray-400 text-sm mt-1">{node.description}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white ml-2 mt-1 flex-shrink-0">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-widest font-semibold">
          <BookOpen size={13} />
          <span>Source Fragments</span>
          <button
            onClick={handleSummarize}
            disabled={loadingSummary}
            className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-900/50 hover:bg-purple-800/60 border border-purple-700 text-purple-300 text-xs transition-colors disabled:opacity-50"
          >
            {loadingSummary ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
            {loadingSummary ? "Summarizing…" : "AI Summary"}
          </button>
          <ExportToDocButton node={node} aiSummary={summary} />
        </div>

        {summary && (
          <div className="bg-purple-950/40 border border-purple-800 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={12} className="text-purple-400" />
              <span className="text-purple-400 text-xs font-semibold uppercase tracking-widest">AI Overview</span>
            </div>
            <p className="text-purple-100 text-sm leading-relaxed">{summary}</p>
          </div>
        )}

        {node.fragments.map((text, i) => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-3">
            <p className="text-gray-200 text-sm leading-relaxed italic">"{text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}