import { useEffect, useState } from "react";
import { X, TrendingUp, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { groupColors } from "../lib/beardenData";

export default function TopConceptsPanel({ onClose, onNodeClick }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.NodeClick.list("-click_count", 20).then(results => {
      setData(results);
      setLoading(false);
    });
  }, []);

  const max = data[0]?.click_count || 1;

  return (
    <div className="absolute top-4 right-4 w-80 max-h-[calc(100vh-2rem)] flex flex-col bg-gray-900 border border-yellow-800/60 rounded-xl shadow-2xl z-20 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-yellow-400" />
          <h2 className="text-white font-bold text-sm">Top Researched Concepts</h2>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={20} className="animate-spin text-yellow-400" />
          </div>
        )}
        {!loading && data.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">No data yet — start clicking nodes!</p>
        )}
        {data.map((item, i) => {
          const color = groupColors[item.group] || "#6b7280";
          const pct = Math.round((item.click_count / max) * 100);
          return (
            <button
              key={item.node_id}
              onClick={() => onNodeClick && onNodeClick(item.node_id)}
              className="w-full text-left p-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs font-mono w-4">#{i + 1}</span>
                  <span className="text-white text-xs font-semibold">{item.label}</span>
                </div>
                <span className="text-xs font-bold" style={{ color }}>
                  {item.click_count} {item.click_count === 1 ? "view" : "views"}
                </span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
              <span
                className="text-xs mt-1 inline-block capitalize"
                style={{ color: color + "99" }}
              >
                {item.group}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}