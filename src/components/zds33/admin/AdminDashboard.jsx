import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { DOMAINS, PRIMARY_TAGS, STAGES, STAGE_INFO, READINESS } from "@/lib/zds33";

const ACTIVE = ["proposed", "under_review", "authorized", "active"];
const rowsToMap = (r, key) => Object.fromEntries((r.rows || []).map((x) => [x[key] ?? "none", x.count]));

function Card({ title, children }) {
  return <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"><p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold mb-3">{title}</p>{children}</div>;
}
const Stat = ({ label, value, color }) => (
  <div className="flex items-center justify-between text-xs py-1 border-b border-slate-900"><span className="text-slate-400">{label}</span><span className="font-bold" style={{ color: color || "#fff" }}>{value ?? 0}</span></div>
);

export default function AdminDashboard() {
  const [d, setD] = useState(null);
  useEffect(() => {
    const E = base44.entities;
    Promise.all([
      E.IPAsset.count({}),
      E.IPAsset.count({ showcase_status: "approved_public" }),
      Promise.all([...PRIMARY_TAGS, "MULTI_DOMAIN", "DUAL_USE"].map((t) => E.IPAsset.count({ domain_tags: { $in: [t] } }))),
      E.IPAsset.aggregate({ groupBy: "development_stage" }),
      E.IPAsset.aggregate({ groupBy: "commercialization_readiness" }),
      E.EngineeringArtifact.aggregate({ groupBy: "status" }),
      E.EngineeringArtifact.aggregate({ groupBy: "access_level" }),
      E.CommercializationCase.count({ status: { $in: ACTIVE } }),
      E.CommercializationCase.aggregate({ groupBy: "pathway" }),
      E.PartnershipInquiry.count({ status: "new" }),
      E.AuditEvent.filter({ entity_type: "ip_asset" }, { sort: "-created_date", limit: 8 }),
    ]).then(([total, pub, tagCounts, stage, ready, docStatus, docAccess, activeOpps, pathways, newInq, act]) => {
      setD({ total, pub, tagCounts, stage: rowsToMap(stage, "development_stage"), ready: rowsToMap(ready, "commercialization_readiness"),
        docStatus: rowsToMap(docStatus, "status"), docAccess: rowsToMap(docAccess, "access_level"), activeOpps, pathways: rowsToMap(pathways, "pathway"), newInq, act: act.items });
    });
  }, []);

  if (!d) return <Loader2 className="animate-spin text-cyan-400" />;
  const tags = [...PRIMARY_TAGS, "MULTI_DOMAIN", "DUAL_USE"];
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card title="Portfolio by domain">
        <Stat label="Total IP assets" value={d.total} />
        <Stat label="Approved for public showcase" value={d.pub} color="#34d399" />
        {tags.map((t, i) => <Stat key={t} label={DOMAINS[t].label} value={d.tagCounts[i]} color={DOMAINS[t].color} />)}
      </Card>
      <Card title="Development stage">
        {STAGES.map((s) => <Stat key={s} label={STAGE_INFO[s].label} value={d.stage[s]} color={STAGE_INFO[s].color} />)}
        <Stat label="Unset" value={d.stage.none} />
      </Card>
      <Card title="Commercialization readiness">
        {Object.entries(READINESS).map(([k, v]) => <Stat key={k} label={v} value={d.ready[k]} />)}
      </Card>
      <Card title="Documentation (vault)">
        {["draft", "in_review", "approved", "superseded"].map((s) => <Stat key={s} label={s.replace("_", " ")} value={d.docStatus[s]} />)}
        <p className="text-[10px] text-slate-500 mt-2 mb-1">By access level</p>
        {["public", "partner", "confidential", "restricted"].map((s) => <Stat key={s} label={s} value={d.docAccess[s]} />)}
      </Card>
      <Card title="Commercialization">
        <Stat label="Active opportunities" value={d.activeOpps} color="#22d3ee" />
        <Stat label="New partnership inquiries" value={d.newInq} color="#fbbf24" />
        {Object.entries(d.pathways).map(([k, v]) => <Stat key={k} label={k.replace(/_/g, " ")} value={v} />)}
      </Card>
      <Card title="Recent portfolio activity">
        {d.act.length === 0 && <p className="text-xs text-slate-500">No activity yet.</p>}
        {d.act.map((a) => (
          <div key={a.id} className="text-xs py-1.5 border-b border-slate-900">
            <p className="text-slate-300">{a.event_description}</p>
            <p className="text-[10px] text-slate-600">{new Date(a.created_date).toLocaleString()}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}