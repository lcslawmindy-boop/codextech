import { useEffect, useState, useCallback } from "react";
import { Loader2, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { DomainTags, StageBadge } from "../Badges";
import AssetEditor from "./AssetEditor";

export default function AdminClassify() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const query = q ? { asset_name: { $regex: q, $options: "i" } } : {};
    const r = await base44.entities.IPAsset.filter(query, { sort: "-updated_date", limit: 30 });
    setItems(r.items); setPage(r); setLoading(false);
  }, [q]);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  const more = async () => {
    const query = q ? { asset_name: { $regex: q, $options: "i" } } : {};
    const r = await base44.entities.IPAsset.filter(query, { sort: "-updated_date", limit: 30, cursor: page.next_cursor });
    setItems([...items, ...r.items]); setPage(r);
  };

  return (
    <div>
      <div className="relative max-w-sm mb-4">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search IP assets" className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm" />
      </div>
      {loading ? <Loader2 className="animate-spin text-cyan-400" /> : (
        <div className="space-y-2">
          {items.map((a) => (
            <button key={a.id} onClick={() => setEditing(a)} className="w-full text-left rounded-xl border border-slate-800 bg-slate-950/60 p-3 hover:border-cyan-500/50">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-white">{a.asset_name}</span>
                <span className="flex items-center gap-2">
                  <StageBadge stage={a.development_stage || "concept"} />
                  <span className={`text-[10px] font-bold ${a.showcase_status === "approved_public" ? "text-emerald-400" : "text-slate-500"}`}>
                    {a.showcase_status === "approved_public" ? "PUBLIC" : "HIDDEN"}
                  </span>
                </span>
              </div>
              <div className="mt-1.5">{(a.domain_tags || []).length ? <DomainTags tags={a.domain_tags} /> : <span className="text-[11px] text-amber-400">Unclassified</span>}</div>
            </button>
          ))}
          {items.length === 0 && <p className="text-sm text-slate-500">No IP assets found. Add assets in the IP Inventory first.</p>}
          {page?.has_more && <button onClick={more} className="text-xs text-cyan-400">Load more</button>}
        </div>
      )}
      {editing && <AssetEditor asset={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}