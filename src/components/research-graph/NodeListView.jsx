import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Download, Plus, Settings, Eye } from "lucide-react";

export default function NodeListView({ nodes, onNodeClick, onAddToCollection }) {
  const [sortKey, setSortKey] = useState("label");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const sorted = useMemo(() => {
    return [...nodes].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [nodes, sortKey, sortDir]);

  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(sorted.length / pageSize);

  const columns = [
    { key: "id", label: "Node ID", width: "w-24" },
    { key: "domain", label: "Domain", width: "w-32" },
    { key: "label", label: "Node Name", width: "flex-1" },
    { key: "researcher", label: "Researcher", width: "w-32" },
    { key: "era", label: "Era", width: "w-16" },
    { key: "evidence", label: "Evidence", width: "w-20" },
    { key: "suppression", label: "Suppression", width: "w-28" },
    { key: "connectionCount", label: "Links", width: "w-14" },
  ];

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <div className="flex-1 bg-[#0D1117] border border-[#21262D] rounded-lg overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-[#21262D] flex items-center justify-between">
        <p className="text-[#F0F6FF] text-sm font-bold">{sorted.length} nodes</p>
        <div className="flex items-center gap-2">
          <select value={pageSize} onChange={e => { setPageSize(parseInt(e.target.value)); setPage(0); }} className="px-2 py-1 rounded bg-[#161B22] border border-[#21262D] text-[#8B9AB0] text-[10px] outline-none">
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
          <button className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#161B22] border border-[#21262D] text-[#8B9AB0] text-[10px] hover:text-[#C9A84C] transition-colors"><Download size={10} /> CSV</button>
          <button className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#161B22] border border-[#21262D] text-[#8B9AB0] text-[10px] hover:text-[#C9A84C] transition-colors"><Download size={10} /> PDF</button>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-[#21262D] bg-[#161B22]/50">
              {columns.map(c => (
                <th key={c.key} onClick={() => handleSort(c.key)} className={`px-3 py-2 text-left text-[#8B9AB0] text-[9px] font-bold uppercase tracking-wider cursor-pointer hover:text-[#C9A84C] transition-colors ${c.width}`}>
                  <div className="flex items-center gap-1">{c.label}{sortKey === c.key && (sortDir === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />)}</div>
                </th>
              ))}
              <th className="px-3 py-2 text-right text-[#8B9AB0] text-[9px] font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(n => (
              <tr key={n.id} className="border-b border-[#21262D]/50 hover:bg-[#161B22]/30 transition-colors">
                <td className="px-3 py-2 text-[#8B9AB0] text-[10px] font-mono">{n.id}</td>
                <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ backgroundColor: n.domainColor + "20", color: n.domainColor }}>{n.domain.substring(0, 12)}</span></td>
                <td className="px-3 py-2 text-[#F0F6FF] text-[11px] font-semibold cursor-pointer hover:text-[#C9A84C]" onClick={() => onNodeClick(n)}>{n.label}</td>
                <td className="px-3 py-2 text-[#8B9AB0] text-[10px]">{n.researcher}</td>
                <td className="px-3 py-2 text-[#8B9AB0] text-[10px]">{n.era}</td>
                <td className="px-3 py-2"><span className="text-[10px]">{"★".repeat(n.evidence)}{"☆".repeat(5 - n.evidence)}</span></td>
                <td className="px-3 py-2"><span className="text-[9px] font-bold" style={{ color: n.suppressionColor }}>{n.suppression.substring(0, 15)}</span></td>
                <td className="px-3 py-2 text-[#C9A84C] text-[10px] font-bold text-center">{n.connectionCount}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onNodeClick(n)} className="p-1 rounded hover:bg-[#21262D] text-[#8B9AB0] hover:text-[#C9A84C] transition-colors" title="View"><Eye size={11} /></button>
                    <button onClick={() => onAddToCollection(n)} className="p-1 rounded hover:bg-[#21262D] text-[#8B9AB0] hover:text-[#C9A84C] transition-colors" title="Add to Collection"><Plus size={11} /></button>
                    <button className="p-1 rounded hover:bg-[#21262D] text-[#8B9AB0] hover:text-[#9B30FF] transition-colors" title="Add to Device Plan"><Settings size={11} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2 border-t border-[#21262D] flex items-center justify-between">
        <p className="text-[#8B9AB0] text-[10px]">Page {page + 1} of {totalPages}</p>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-2 py-1 rounded bg-[#161B22] border border-[#21262D] text-[#8B9AB0] text-[10px] disabled:opacity-30 hover:text-[#C9A84C] transition-colors">Prev</button>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-2 py-1 rounded bg-[#161B22] border border-[#21262D] text-[#8B9AB0] text-[10px] disabled:opacity-30 hover:text-[#C9A84C] transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
}