import { useEffect, useState } from "react";
import { Loader2, Trash2, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { ACCESS_LEVELS, ACCESS_COLORS } from "@/lib/zds33";

const sel = "rounded bg-slate-900 border border-slate-700 px-2 py-1.5 text-xs text-white";
const TYPES = ["specification", "test_plan", "bom", "schematic", "cad_model", "assembly_guide", "firmware", "validation_report", "design_review", "other"];
const STATUSES = ["draft", "in_review", "approved", "superseded"];

export default function DocManager({ assetId }) {
  const [docs, setDocs] = useState(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ artifact_name: "", artifact_type: "specification", status: "draft", access_level: "confidential" });
  const [file, setFile] = useState(null);

  const load = () => base44.entities.EngineeringArtifact.filter({ ip_asset_id: assetId }, { sort: "-created_date", limit: 50 }).then((r) => setDocs(r.items));
  useEffect(() => { load(); }, [assetId]);

  const add = async () => {
    if (!form.artifact_name.trim()) return;
    setBusy(true);
    let file_uri;
    if (file) file_uri = (await base44.integrations.Core.UploadPrivateFile({ file })).file_uri;
    await base44.entities.EngineeringArtifact.create({ ...form, ip_asset_id: assetId, file_uri });
    setForm({ ...form, artifact_name: "" }); setFile(null);
    await load(); setBusy(false);
  };
  const update = async (d, patch) => { await base44.entities.EngineeringArtifact.update(d.id, patch); load(); };
  const remove = async (d) => { await base44.entities.EngineeringArtifact.delete(d.id); load(); };
  const open = async (d) => {
    const r = await base44.functions.invoke("zds33Document", { artifact_id: d.id });
    window.open(r.data.url, "_blank");
  };

  if (!docs) return <Loader2 className="animate-spin text-cyan-400" size={16} />;
  return (
    <div className="space-y-2">
      {docs.map((d) => (
        <div key={d.id} className="flex flex-wrap items-center gap-2 text-xs bg-slate-900 border border-slate-800 rounded-lg p-2">
          <span className="flex-1 min-w-[120px] text-white">{d.artifact_name}</span>
          <select className={sel} value={d.status} onChange={(e) => update(d, { status: e.target.value })}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          <select className={sel} style={{ color: ACCESS_COLORS[d.access_level || "confidential"] }} value={d.access_level || "confidential"} onChange={(e) => update(d, { access_level: e.target.value })}>
            {ACCESS_LEVELS.map((s) => <option key={s}>{s}</option>)}
          </select>
          {d.file_uri && <button onClick={() => open(d)} className="text-cyan-400"><ExternalLink size={14} /></button>}
          <button onClick={() => remove(d)} className="text-red-400"><Trash2 size={14} /></button>
        </div>
      ))}
      {docs.length === 0 && <p className="text-xs text-slate-500">No documents yet.</p>}
      <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-slate-800">
        <input className={`${sel} flex-1 min-w-[140px]`} placeholder="Document title" value={form.artifact_name} onChange={(e) => setForm({ ...form, artifact_name: e.target.value })} />
        <select className={sel} value={form.artifact_type} onChange={(e) => setForm({ ...form, artifact_type: e.target.value })}>{TYPES.map((s) => <option key={s}>{s}</option>)}</select>
        <select className={sel} value={form.access_level} onChange={(e) => setForm({ ...form, access_level: e.target.value })}>{ACCESS_LEVELS.map((s) => <option key={s}>{s}</option>)}</select>
        <input type="file" className="text-[10px] text-slate-400 max-w-[150px]" onChange={(e) => setFile(e.target.files[0] || null)} />
        <button disabled={busy} onClick={add} className="px-3 py-1.5 rounded bg-cyan-600 text-xs font-bold disabled:opacity-60">{busy ? "Adding…" : "Add (stored privately)"}</button>
      </div>
    </div>
  );
}