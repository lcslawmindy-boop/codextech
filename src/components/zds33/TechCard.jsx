import { Link } from "react-router-dom";
import { CATEGORIES } from "@/lib/zds33";
import { StageBadge, DomainTags, ReadinessBadge } from "./Badges";

export default function TechCard({ tech }) {
  return (
    <Link to={`/zds33/tech/${tech.id}`}
      className="block rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950 p-4 hover:border-cyan-500/50 transition-colors">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-[10px] text-slate-500">{tech.tech_code || "—"}</span>
        <StageBadge stage={tech.stage} />
      </div>
      <h3 className="font-bold text-white text-sm leading-snug mb-1">{tech.name}</h3>
      <p className="text-[11px] text-cyan-400/80 mb-2">
        {CATEGORIES[tech.category] || "Other"}{tech.subsystem ? ` · ${tech.subsystem}` : ""}
      </p>
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-3">{tech.summary}</p>
      <DomainTags tags={tech.domain_tags} />
      <div className="mt-3"><ReadinessBadge value={tech.readiness} /></div>
    </Link>
  );
}