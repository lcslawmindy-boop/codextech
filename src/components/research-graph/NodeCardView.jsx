import { Plus, Settings, Eye, Link as LinkIcon } from "lucide-react";

export default function NodeCardView({ nodes, onNodeClick, onAddToCollection }) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {nodes.map(n => (
          <div key={n.id} className="rounded-xl bg-[#0D1117] border border-[#21262D] overflow-hidden hover:border-[#C9A84C]/40 hover:shadow-lg hover:shadow-[#C9A84C]/5 transition-all cursor-pointer group" onClick={() => onNodeClick(n)}>
            <div className="h-1" style={{ backgroundColor: n.domainColor }} />
            <div className="p-3">
              <div className="flex items-start justify-between mb-2">
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ backgroundColor: n.domainColor + "20", color: n.domainColor }}>{n.domain}</span>
                <span className="text-[#8B9AB0] text-[9px] font-mono">{n.id}</span>
              </div>
              <h3 className="text-[#F0F6FF] font-bold text-sm leading-tight group-hover:text-[#C9A84C] transition-colors">{n.label}</h3>
              <p className="text-[#8B9AB0] text-[10px] mt-0.5">{n.researcher} · {n.year}</p>
              <p className="text-[#8B9AB0] text-[10px] mt-2 line-clamp-2 leading-relaxed">{n.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px]">{"★".repeat(n.evidence)}{"☆".repeat(5 - n.evidence)}</span>
                <span className="text-[9px] font-bold" style={{ color: n.suppressionColor }}>{n.suppression.substring(0, 15)}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {n.tags.slice(0, 3).map(t => <span key={t} className="px-1.5 py-0.5 rounded bg-[#161B22] text-[#8B9AB0] text-[8px]">{t}</span>)}
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#21262D]">
                <span className="text-[#8B9AB0] text-[10px]">🔗 {n.connectionCount} connections</span>
                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  <button onClick={() => onAddToCollection(n)} className="p-1 rounded hover:bg-[#21262D] text-[#8B9AB0] hover:text-[#C9A84C] transition-colors" title="Add to Collection"><Plus size={12} /></button>
                  <button className="p-1 rounded hover:bg-[#21262D] text-[#8B9AB0] hover:text-[#9B30FF] transition-colors" title="Add to Device Plan"><Settings size={12} /></button>
                  <button onClick={() => onNodeClick(n)} className="p-1 rounded hover:bg-[#21262D] text-[#8B9AB0] hover:text-[#C9A84C] transition-colors" title="View Detail"><Eye size={12} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}