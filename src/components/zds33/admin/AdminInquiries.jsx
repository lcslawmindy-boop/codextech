import { useEffect, useState, useCallback } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { PATHWAYS } from "@/lib/zds33";

const STATUSES = ["new", "reviewing", "responded", "closed"];

export default function AdminInquiries() {
  const [items, setItems] = useState(null);
  const load = useCallback(async () => {
    const r = await base44.entities.PartnershipInquiry.filter({}, { sort: "-created_date", limit: 100 });
    setItems(r.items);
  }, []);
  useEffect(() => { load(); }, [load]);

  const setStatus = async (i, status) => { await base44.entities.PartnershipInquiry.update(i.id, { status }); load(); };
  const remove = async (i) => { await base44.entities.PartnershipInquiry.delete(i.id); load(); };
  const toOpportunity = async (i) => {
    const opp = await base44.entities.CommercializationCase.create({
      ip_asset_id: i.ip_asset_id, pathway: i.pathway, status: "proposed", source_inquiry_id: i.id,
      title: `${i.organization || i.name}: ${PATHWAYS[i.pathway]}`, notes: i.message,
    });
    await base44.entities.PartnershipInquiry.update(i.id, { opportunity_id: opp.id, status: "reviewing" });
    load();
  };

  if (!items) return <Loader2 className="animate-spin text-cyan-400" />;
  if (!items.length) return <p className="text-sm text-slate-500">No partnership inquiries yet.</p>;
  return (
    <div className="space-y-3">
      {items.map((i) => (
        <div key={i.id} className="rounded-xl border border-slate-800 p-3 text-xs">
          <div className="flex flex-wrap justify-between gap-2">
            <p className="text-white font-semibold">{i.name} <span className="text-slate-500 font-normal">· {i.organization || "—"} · {i.email}</span></p>
            <select value={i.status} onChange={(e) => setStatus(i, e.target.value)} className="rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          </div>
          <p className="text-cyan-400 mt-1">{i.ip_asset_name} · {PATHWAYS[i.pathway]}</p>
          {i.message && <p className="text-slate-400 mt-1">{i.message}</p>}
          <div className="flex gap-3 mt-2">
            {i.opportunity_id ? <span className="text-emerald-400">Opportunity created</span>
              : <button onClick={() => toOpportunity(i)} className="text-cyan-400 font-semibold">Create opportunity on this IP asset</button>}
            <button onClick={() => remove(i)} className="text-red-400 ml-auto"><Trash2 size={13} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}