import { useState } from "react";
import { X, Plus, FolderKanban, Eye, Trash2, Edit2, Download, Settings } from "lucide-react";
import { DOMAINS } from "@/lib/researchGraphData";

export default function CollectionsPanel({ open, onClose, collections, setCollections, allNodes, onHighlightNodes }) {
  const [newName, setNewName] = useState("");
  const [showNew, setShowNew] = useState(false);

  const createCollection = () => {
    if (!newName.trim()) return;
    setCollections(prev => [...prev, { id: `col-${Date.now()}`, name: newName, nodeIds: [], created: new Date().toISOString() }]);
    setNewName("");
    setShowNew(false);
  };

  const deleteCollection = (id) => {
    setCollections(prev => prev.filter(c => c.id !== id));
  };

  const getDomainBreakdown = (col) => {
    const counts = {};
    col.nodeIds.forEach(nid => {
      const n = allNodes.find(node => node.numericId === nid);
      if (n) counts[n.domainId] = (counts[n.domainId] || 0) + 1;
    });
    return counts;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[420px] bg-[#0D1117] border-l border-[#21262D] flex flex-col h-full">
        <div className="px-4 py-3 border-b border-[#21262D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban size={18} className="text-[#C9A84C]" />
            <h2 className="text-[#F0F6FF] font-bold text-sm" style={{ fontFamily: "Orbitron, sans-serif" }}>MY COLLECTIONS</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-[#161B22] text-[#8B9AB0] hover:text-[#F0F6FF] transition-colors"><X size={16} /></button>
        </div>

        <div className="p-3 border-b border-[#21262D]">
          {showNew ? (
            <div className="flex items-center gap-2">
              <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && createCollection()} placeholder="Collection name..." className="flex-1 px-3 py-2 rounded-lg bg-[#161B22] border border-[#21262D] text-[#F0F6FF] text-xs outline-none focus:border-[#C9A84C]/50" />
              <button onClick={createCollection} className="px-3 py-2 rounded-lg text-[#030712] text-xs font-bold" style={{ backgroundColor: "#C9A84C" }}>Create</button>
              <button onClick={() => setShowNew(false)} className="px-2 py-2 rounded-lg bg-[#161B22] text-[#8B9AB0] text-xs"><X size={14} /></button>
            </div>
          ) : (
            <button onClick={() => setShowNew(true)} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#21262D] border-dashed text-[#8B9AB0] text-xs font-bold hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors">
              <Plus size={14} /> New Collection
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {collections.length === 0 ? (
            <div className="text-center py-12">
              <FolderKanban size={32} className="text-[#21262D] mx-auto mb-2" />
              <p className="text-[#8B9AB0] text-xs">No collections yet</p>
              <p className="text-[#8B9AB0] text-[10px] mt-1">Create one to organize your research nodes</p>
            </div>
          ) : (
            collections.map(col => {
              const breakdown = getDomainBreakdown(col);
              const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
              return (
                <div key={col.id} className="rounded-xl bg-[#161B22] border border-[#21262D] p-3 hover:border-[#C9A84C]/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-[#F0F6FF] text-xs font-bold">{col.name}</h3>
                    <div className="flex items-center gap-1">
                      <button onClick={() => onHighlightNodes(col.nodeIds)} className="p-1 rounded hover:bg-[#21262D] text-[#8B9AB0] hover:text-[#C9A84C] transition-colors" title="View in Graph"><Eye size={11} /></button>
                      <button className="p-1 rounded hover:bg-[#21262D] text-[#8B9AB0] hover:text-[#1D6FA4] transition-colors" title="Edit"><Edit2 size={11} /></button>
                      <button onClick={() => deleteCollection(col.id)} className="p-1 rounded hover:bg-[#21262D] text-[#8B9AB0] hover:text-[#EF4444] transition-colors" title="Delete"><Trash2 size={11} /></button>
                    </div>
                  </div>
                  <p className="text-[#8B9AB0] text-[10px]">{total} nodes · {new Date(col.created).toLocaleDateString()}</p>
                  {total > 0 && (
                    <div className="flex h-1.5 rounded-full overflow-hidden mt-2">
                      {Object.entries(breakdown).map(([did, count]) => {
                        const domain = DOMAINS.find(d => d.id === did);
                        return <div key={did} style={{ width: `${(count / total) * 100}%`, backgroundColor: domain?.color || "#21262D" }} />;
                      })}
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <button onClick={() => onHighlightNodes(col.nodeIds)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-[#0D1117] border border-[#21262D] text-[#8B9AB0] text-[10px] font-bold hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors">
                      <Eye size={10} /> View in Graph
                    </button>
                    <button className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-[#0D1117] border border-[#21262D] text-[#8B9AB0] text-[10px] font-bold hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors">
                      <Download size={10} />
                    </button>
                    <button className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-[#0D1117] border border-[#21262D] text-[#8B9AB0] text-[10px] font-bold hover:text-[#9B30FF] hover:border-[#9B30FF]/50 transition-colors">
                      <Settings size={10} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}