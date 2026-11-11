import { useEffect, useState, useCallback } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { PATHWAYS } from "@/lib/zds33";

const sel = "rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-white";
const STATUSES = ["proposed", "under_review", "authorized", "active", "paused", "completed", "abandoned"];

export default function AdminOpportunities() {
  const [opps, setOpps] = useState(null);
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({ ip_asset_id: "", pathway: "licensing", title: "" });

  const load = useCallback(async () => {
    const [o, a] = await Promise.all([
      base44.entities.CommercializationCase.filter({}, { sort: "-created_date", limit: 100 }),
      base44.entities.IPAsset.filter({}, { sort: "asset_name", limit: 200 }),
    ]);
    setOpps(o.items); setAssets(a.items);
  }, []);
  useEffect(() => { load(); }, [load]);

  const name = (id) => assets.find((a) => a.id === id)?.asset_name || "Unknown asset";
  const add = async () => {
    if (!form.ip_asset_id || !form.title.trim()) return;
    await base44.entities.CommercializationCase.create({ ...form, status: "proposed" });
    setForm({ ...form, title: "" }); load();
  };
  const patch = async (o, data) => { await base44.entities.CommercializationCase.update(o.id, data); load(); };
  const remove = async (o) => { await base44.entities.CommercializationCase.delete(o.id); load(); };

  if (!opps) return <Loader2 className="animate-spin text-cyan-400" />;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center rounded-xl border border-slate-800 p-3 bg-slate-950/60">
        <select className={sel} value={form.ip_asset_id} onChange={(e) => setForm({ ...form, ip_asset_id: e.target.value })}>
          <option value="">Select IP asset…</option>{assets.map((a) => <option key={a.id} value={a.id}>{a.asset_name}</option>)}
        </select>
        <select className={sel} value={form.pathway} onChange={(e) => setForm({ ...form, pathway: e.target.value })}>
          {Object.entries(PATHWAYS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <input className={`${sel} flex-1 min-w-[160px]`} placeholder="Opportunity title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <button onClick={add} className="px-3 py-1.5 rounded bg-cyan-600 text-xs font-bold">Add opportunity</button>
      </div>
      {opps.length === 0 && <p className="text-sm text-slate-500">No opportunities yet. All opportunities track against the underlying IP asset.</p>}
      {opps.map((o) => (
        <div key={o.id} className="rounded-xl border border-slate-800 p-3 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex-1 min-w-[180px]"><p className="text-white font-semibold">{o.title}</p><p className="text-slate-500">{name(o.ip_asset_id)} · {PATHWAYS[o.pathway] || o.pathway.replace(/_/g, " ")}</p></div>
          <select className={sel} value={o.status} onChange={(e) => patch(o, { status: e.target.value })}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          <button onClick={() => remove(o)} className="text-red-400"><Trash2 size={14} /></button>
        </div>
      ))}
      <p className="text-[11px] text-slate-500">External outreach or commitments always require human authorization on the case.</p>
    </div>
  );
}