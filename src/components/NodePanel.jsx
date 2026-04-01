import { X, BookOpen } from "lucide-react";
import { groupColors } from "../lib/beardenData";

export default function NodePanel({ node, onClose }) {
  if (!node) return null;
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
        </div>
        {node.fragments.map((text, i) => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-3">
            <p className="text-gray-200 text-sm leading-relaxed italic">"{text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}