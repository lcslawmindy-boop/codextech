import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { DOMAINS, PRIMARY_TAGS, CATEGORIES, STAGES, STAGE_INFO, READINESS, PATHWAYS, withDerivedTags } from "@/lib/zds33";
import DocManager from "./DocManager";

const inp = "w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white";
const lines = (s) => (s || "").split("\n").map((x) => x.trim()).filter(Boolean);
const Label = ({ children }) => <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-3 mb-1">{children}</p>;

export default function AssetEditor({ asset, onClose, onSaved }) {
  const [f, setF] = useState({
    tech_code: asset.tech_code || "", domain_tags: (asset.domain_tags || []).filter((t) => PRIMARY_TAGS.includes(t)),
    technology_category: asset.technology_category || "other", subsystem: asset.subsystem || "",
    development_stage: asset.development_stage || "concept", stage_evidence: asset.stage_evidence || "",
    commercialization_readiness: asset.commercialization_readiness || "not_assessed",
    partnership_pathways: asset.partnership_pathways || [], showcase_status: asset.showcase_status || "hidden",
    defense_public_review_confirmed: !!asset.defense_public_review_confirmed,
    public_summary: asset.public_summary || "", public_problem: asset.public_problem || "", public_solution: asset.public_solution || "",
    capabilities: (asset.public_capabilities || []).join("\n"), applications: (asset.public_applications || []).join("\n"),
    gallery: asset.public_gallery || [], related_asset_ids: asset.related_asset_ids || [],
  });
  const [others, setOthers] = useState([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggle = (k, v) => setF({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] });

  useEffect(() => { base44.entities.IPAsset.filter({}, { sort: "asset_name", limit: 200 }).then((r) => setOthers(r.items.filter((x) => x.id !== asset.id))); }, [asset.id]);

  const upload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
    setF((p) => ({ ...p, gallery: [...p.gallery, file_url] }));
  };

  const save = async () => {
    setErr("");
    const needsEvidence = ["prototype", "validation"].includes(f.development_stage);
    if (needsEvidence && !f.stage_evidence.trim()) return setErr("Prototype or Validation stage requires evidence on file.");
    if (f.showcase_status === "approved_public") {
      if (!f.public_summary.trim()) return setErr("A public summary is required to publish.");
      if (f.domain_tags.includes("DEFENSE_SECURITY") && !f.defense_public_review_confirmed) return setErr("Confirm the defense public content is high-level and non-operational.");
    }
    setBusy(true);
    const data = {
      tech_code: f.tech_code, domain_tags: withDerivedTags(f.domain_tags), technology_category: f.technology_category,
      subsystem: f.subsystem, development_stage: f.development_stage, stage_evidence: f.stage_evidence,
      commercialization_readiness: f.commercialization_readiness, partnership_pathways: f.partnership_pathways,
      showcase_status: f.showcase_status, defense_public_review_confirmed: f.defense_public_review_confirmed,
      public_summary: f.public_summary, public_problem: f.public_problem, public_solution: f.public_solution,
      public_capabilities: lines(f.capabilities), public_applications: lines(f.applications),
      public_gallery: f.gallery, related_asset_ids: f.related_asset_ids,
    };
    await base44.entities.IPAsset.update(asset.id, data);
    const me = await base44.auth.me();
    await base44.entities.AuditEvent.create({
      entity_type: "ip_asset", entity_id: asset.id, event_type: "updated", actor_email: me.email,
      event_description: `ZDS33 classification updated for ${asset.asset_name} (${f.showcase_status}, ${f.development_stage})`,
    });
    setBusy(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto p-3">
      <div className="max-w-3xl mx-auto rounded-2xl border border-slate-700 bg-slate-950 p-5">
        <div className="flex justify-between items-start">
          <div><h3 className="font-bold text-white">{asset.asset_name}</h3><p className="text-xs text-slate-500">One IP asset · classify across all domains</p></div>
          <button onClick={onClose}><X size={18} className="text-slate-500" /></button>
        </div>

        <Label>Mission domains</Label>
        <div className="flex flex-wrap gap-2">
          {PRIMARY_TAGS.map((t) => (
            <button key={t} onClick={() => toggle("domain_tags", t)} className="text-xs px-3 py-1.5 rounded-full border"
              style={f.domain_tags.includes(t) ? { color: DOMAINS[t].color, borderColor: DOMAINS[t].color, background: DOMAINS[t].color + "20" } : { color: "#64748b", borderColor: "#334155" }}>
              {DOMAINS[t].label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Dual Use and Multi-Domain tags are applied automatically.</p>

        <div className="grid sm:grid-cols-3 gap-3">
          <div><Label>Technology ID</Label><input className={inp} value={f.tech_code} onChange={set("tech_code")} placeholder="ZDS-T-001" /></div>
          <div><Label>Category</Label><select className={inp} value={f.technology_category} onChange={set("technology_category")}>{Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
          <div><Label>Subsystem</Label><input className={inp} value={f.subsystem} onChange={set("subsystem")} /></div>
          <div><Label>Development stage</Label><select className={inp} value={f.development_stage} onChange={set("development_stage")}>{STAGES.map((s) => <option key={s} value={s}>{STAGE_INFO[s].label}</option>)}</select></div>
          <div><Label>Commercial readiness</Label><select className={inp} value={f.commercialization_readiness} onChange={set("commercialization_readiness")}>{Object.entries(READINESS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        </div>
        <Label>Stage evidence on file (required for Prototype / Validation)</Label>
        <textarea rows={2} className={inp} value={f.stage_evidence} onChange={set("stage_evidence")} />

        <Label>Open partnership pathways</Label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PATHWAYS).map(([k, v]) => (
            <button key={k} onClick={() => toggle("partnership_pathways", k)}
              className={`text-xs px-3 py-1.5 rounded-full border ${f.partnership_pathways.includes(k) ? "border-cyan-400 text-cyan-300 bg-cyan-500/10" : "border-slate-700 text-slate-500"}`}>{v}</button>
          ))}
        </div>

        <Label>Public showcase content (only these fields are ever shown publicly)</Label>
        <textarea rows={2} className={inp} placeholder="Public summary" value={f.public_summary} onChange={set("public_summary")} />
        <textarea rows={2} className={`${inp} mt-2`} placeholder="Problem" value={f.public_problem} onChange={set("public_problem")} />
        <textarea rows={2} className={`${inp} mt-2`} placeholder="High-level solution concept" value={f.public_solution} onChange={set("public_solution")} />
        <div className="grid sm:grid-cols-2 gap-2 mt-2">
          <textarea rows={3} className={inp} placeholder="Key capabilities (one per line)" value={f.capabilities} onChange={set("capabilities")} />
          <textarea rows={3} className={inp} placeholder="Potential applications (one per line)" value={f.applications} onChange={set("applications")} />
        </div>
        <Label>Gallery (uploaded publicly: anyone with the link can open them)</Label>
        <div className="flex flex-wrap gap-2 items-center">
          {f.gallery.map((u) => <button key={u} title="Remove" onClick={() => setF({ ...f, gallery: f.gallery.filter((x) => x !== u) })}><img src={u} alt="" className="h-14 w-20 object-cover rounded border border-slate-700" /></button>)}
          <input type="file" accept="image/*" onChange={upload} className="text-[10px] text-slate-400" />
        </div>

        <Label>Related technologies</Label>
        <div className="max-h-28 overflow-y-auto border border-slate-800 rounded-lg p-2 grid sm:grid-cols-2 gap-1">
          {others.map((o) => (
            <label key={o.id} className="text-xs text-slate-300 flex gap-2"><input type="checkbox" checked={f.related_asset_ids.includes(o.id)} onChange={() => toggle("related_asset_ids", o.id)} />{o.asset_name}</label>
          ))}
        </div>

        <Label>Public visibility</Label>
        <select className={inp} value={f.showcase_status} onChange={set("showcase_status")}>
          <option value="hidden">Hidden (internal only)</option><option value="approved_public">Approved for public showcase</option>
        </select>
        {f.domain_tags.includes("DEFENSE_SECURITY") && (
          <label className="flex gap-2 text-xs text-amber-300 mt-2">
            <input type="checkbox" checked={f.defense_public_review_confirmed} onChange={(e) => setF({ ...f, defense_public_review_confirmed: e.target.checked })} />
            I confirm the public text contains no sensitive engineering, targeting, vulnerability or restricted technical information.
          </label>
        )}

        <Label>Build Plan + Validation Vault documents</Label>
        <DocManager assetId={asset.id} />

        {err && <p className="text-xs text-red-400 mt-3">{err}</p>}
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-800 text-sm">Cancel</button>
          <button disabled={busy} onClick={save} className="px-4 py-2 rounded-lg bg-cyan-600 text-sm font-bold flex items-center gap-2 disabled:opacity-60">{busy && <Loader2 size={13} className="animate-spin" />} Save classification</button>
        </div>
      </div>
    </div>
  );
}