import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Zds33Shell from "@/components/zds33/Zds33Shell";
import InquiryDialog from "@/components/zds33/InquiryDialog";
import { StageBadge, DomainTags, ReadinessBadge } from "@/components/zds33/Badges";
import { STAGES, STAGE_INFO, CATEGORIES, PATHWAYS, ACCESS_COLORS, useShowcase } from "@/lib/zds33";

const Section = ({ title, children }) => (
  <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
    <h2 className="text-[11px] uppercase tracking-widest text-cyan-400 font-bold mb-2">{title}</h2>
    {children}
  </section>
);
const Bullets = ({ items, empty }) => items.length
  ? <ul className="space-y-1 text-sm text-slate-300">{items.map((i, k) => <li key={k}>▸ {i}</li>)}</ul>
  : <p className="text-sm text-slate-500">{empty}</p>;

export default function TechnologyDetail() {
  const { id } = useParams();
  const [tech, setTech] = useState(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { items } = useShowcase();

  useEffect(() => {
    setLoading(true); setMissing(false);
    base44.functions.invoke("zds33Public", { action: "get", id })
      .then((r) => setTech(r.data.item))
      .catch((e) => { if (e?.response?.status === 404) setMissing(true); else throw e; })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!missing || loading) return;
    const m = document.createElement("meta");
    m.name = "prerender-status-code"; m.content = "404";
    document.head.appendChild(m);
    return () => m.remove();
  }, [missing, loading]);

  if (loading) return <Zds33Shell><div className="py-32 flex justify-center"><Loader2 className="animate-spin text-cyan-400" /></div></Zds33Shell>;
  if (missing || !tech) return (
    <Zds33Shell><div className="py-32 text-center text-slate-400">Technology not found. <Link className="text-cyan-400" to="/zds33/systems">Back to systems</Link></div></Zds33Shell>
  );

  const related = items.filter((t) => t.id !== tech.id && (tech.related_ids.includes(t.id) || (tech.subsystem && t.subsystem === tech.subsystem)));
  const stageIdx = STAGES.indexOf(tech.stage);

  return (
    <Zds33Shell>
      <div className="max-w-5xl mx-auto px-4 pt-8 space-y-4">
        <Link to="/zds33/systems" className="text-xs text-slate-400 flex items-center gap-1"><ArrowLeft size={12} /> Integrated Systems</Link>
        <div>
          <p className="font-mono text-xs text-slate-500">{tech.tech_code || "ID " + tech.id.slice(0, 8)}</p>
          <h1 className="text-2xl sm:text-3xl font-black mb-3">{tech.name}</h1>
          <DomainTags tags={tech.domain_tags} />
          <p className="text-xs text-cyan-400/80 mt-2">{CATEGORIES[tech.category]}{tech.subsystem ? ` · ${tech.subsystem}` : ""}</p>
        </div>

        <div className="rounded-xl border border-slate-800 p-4 bg-slate-950/60">
          <div className="flex gap-1 mb-3">
            {STAGES.map((s, i) => (
              <div key={s} className="flex-1">
                <div className="h-1.5 rounded" style={{ background: i <= stageIdx ? STAGE_INFO[s].color : "#1e293b" }} />
                <p className={`text-[10px] mt-1 ${i === stageIdx ? "text-white font-bold" : "text-slate-600"}`}>{STAGE_INFO[s].label}</p>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 text-xs text-slate-300">
            <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <span><StageBadge stage={tech.stage} /> {STAGE_INFO[tech.stage].note}</span>
          </div>
        </div>

        <Section title="Summary"><p className="text-sm text-slate-300 leading-relaxed">{tech.summary || "No public summary."}</p></Section>
        <div className="grid md:grid-cols-2 gap-4">
          <Section title="Problem"><p className="text-sm text-slate-300">{tech.problem || "Not yet published."}</p></Section>
          <Section title="Proposed solution (high-level concept)"><p className="text-sm text-slate-300">{tech.solution || "Not yet published."}</p></Section>
          <Section title="Key capabilities"><Bullets items={tech.capabilities} empty="Not yet published." /></Section>
          <Section title="Potential applications"><Bullets items={tech.applications} empty="Not yet published." /></Section>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Section title="IP relationship & research">
            <p className="text-sm text-slate-300 capitalize">{tech.ip.asset_type.replace(/_/g, " ")} · filing: {tech.ip.filing_status.replace(/_/g, " ")}</p>
            <p className="text-xs text-slate-500 mt-1">
              {tech.ip.research_records} linked research record(s) · {tech.ip.evidence_claims} evidence claim(s) · {tech.ip.has_invention_record ? "invention record on file" : "no invention record yet"}
            </p>
            <p className="text-[11px] text-slate-500 mt-2">One IP asset serves all domains shown above.</p>
          </Section>
          <Section title="Build / validation documentation">
            {tech.documents.length === 0 ? <p className="text-sm text-slate-500">No documentation on record.</p> : (
              <ul className="space-y-1.5">
                {tech.documents.map((d, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-center justify-between gap-2">
                    <span>{d.title}</span>
                    <span className="flex gap-1.5 text-[10px] uppercase">
                      <span className="text-slate-500">{d.status.replace(/_/g, " ")}</span>
                      <span style={{ color: ACCESS_COLORS[d.access_level] }}>{d.access_level}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[11px] text-slate-500 mt-2">Status only. Files require authorization.</p>
          </Section>
        </div>

        <Section title="Visual gallery">
          {tech.gallery.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{tech.gallery.map((u) => <img key={u} src={u} alt={tech.name} className="rounded-lg border border-slate-800 w-full h-36 object-cover" />)}</div>
          ) : <p className="text-sm text-slate-500">No approved visuals published yet.</p>}
        </Section>

        <Section title="Commercialization & partnership">
          <div className="flex items-center gap-2 mb-3"><ReadinessBadge value={tech.readiness} /></div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tech.pathways.length ? tech.pathways.map((p) => <span key={p} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-200">{PATHWAYS[p]}</span>)
              : <span className="text-sm text-slate-500">No pathways opened yet. Inquiries are still welcome.</span>}
          </div>
          <button onClick={() => setOpen(true)} className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-sm font-bold">Request partnership</button>
        </Section>

        {related.length > 0 && (
          <Section title="Related technologies">
            <div className="flex flex-wrap gap-2">
              {related.map((t) => <Link key={t.id} to={`/zds33/tech/${t.id}`} className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500">{t.name}</Link>)}
            </div>
          </Section>
        )}
      </div>
      {open && <InquiryDialog tech={tech} onClose={() => setOpen(false)} />}
    </Zds33Shell>
  );
}