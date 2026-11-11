import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { DOMAINS, CATEGORIES, READINESS, PATHWAYS, ACCESS_COLORS } from "@/lib/zds33";
import { StageBadge } from "./Badges";

function Col({ title, children }) {
  return (
    <div className="min-w-[210px] flex-1 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
      <p className="text-[10px] uppercase tracking-widest text-cyan-400 mb-2 font-bold">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

const Item = ({ active, onClick, children }) => (
  <button onClick={onClick}
    className={`w-full text-left text-xs rounded-lg px-2.5 py-2 border transition-colors ${active ? "border-cyan-500 bg-cyan-500/10 text-white" : "border-slate-800 text-slate-300 hover:border-slate-600"}`}>
    {children}
  </button>
);

export default function ArchitectureExplorer({ items }) {
  const [mission, setMission] = useState(null);
  const [techId, setTechId] = useState(null);
  const missions = Object.keys(DOMAINS).map((k) => ({ key: k, techs: items.filter((t) => t.domain_tags.includes(k)) })).filter((m) => m.techs.length);
  const techs = mission ? missions.find((m) => m.key === mission)?.techs || [] : [];
  const tech = techs.find((t) => t.id === techId);

  if (!items.length) return <p className="text-sm text-slate-500 py-10 text-center">No approved technologies to explore yet.</p>;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 items-stretch">
      <Col title="1 · Mission">
        {missions.map((m) => (
          <Item key={m.key} active={mission === m.key} onClick={() => { setMission(m.key); setTechId(null); }}>
            <span style={{ color: DOMAINS[m.key].color }}>●</span> {DOMAINS[m.key].label} <span className="text-slate-500">({m.techs.length})</span>
          </Item>
        ))}
      </Col>
      <Col title="2 · Technology">
        {!mission && <p className="text-[11px] text-slate-600">Select a mission</p>}
        {techs.map((t) => <Item key={t.id} active={techId === t.id} onClick={() => setTechId(t.id)}>{t.name}</Item>)}
      </Col>
      <Col title="3 · Subsystem">
        {tech ? (
          <div className="text-xs text-slate-300 space-y-1">
            <p>{tech.subsystem || "Subsystem not specified"}</p>
            <p className="text-slate-500">{CATEGORIES[tech.category]}</p>
            <StageBadge stage={tech.stage} />
          </div>
        ) : <p className="text-[11px] text-slate-600">Select a technology</p>}
      </Col>
      <Col title="4 · IP Asset">
        {tech ? (
          <div className="text-xs text-slate-300 space-y-1">
            <p className="font-mono">{tech.tech_code || tech.id.slice(0, 8)}</p>
            <p>{tech.ip.asset_type.replace(/_/g, " ")} · {tech.ip.filing_status.replace(/_/g, " ")}</p>
            <p className="text-slate-500">{tech.ip.research_records} research record(s)</p>
            <p className="text-slate-500">Also in: {tech.domain_tags.filter((d) => d !== mission && DOMAINS[d]).map((d) => DOMAINS[d].label).join(", ") || "single domain"}</p>
          </div>
        ) : <p className="text-[11px] text-slate-600">—</p>}
      </Col>
      <Col title="5 · Documentation">
        {tech ? (tech.documents.length ? tech.documents.map((d, i) => (
          <p key={i} className="text-[11px] text-slate-300">
            <span style={{ color: ACCESS_COLORS[d.access_level] }}>■</span> {d.title} <span className="text-slate-500">· {d.status}</span>
          </p>
        )) : <p className="text-[11px] text-slate-500">No documents on record</p>) : <p className="text-[11px] text-slate-600">—</p>}
      </Col>
      <Col title="6 · Commercialization">
        {tech ? (
          <div className="text-xs space-y-1.5">
            <p className="text-slate-300">{READINESS[tech.readiness]}</p>
            <div className="flex flex-wrap gap-1">
              {tech.pathways.map((p) => <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{PATHWAYS[p]}</span>)}
            </div>
            <Link to={`/zds33/tech/${tech.id}`} className="inline-flex items-center gap-1 text-cyan-400 font-semibold">Open technology <ChevronRight size={12} /></Link>
          </div>
        ) : <p className="text-[11px] text-slate-600">—</p>}
      </Col>
    </div>
  );
}