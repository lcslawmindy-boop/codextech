import { DOMAINS, STAGE_INFO, READINESS, isMultiDomain } from "@/lib/zds33";

export function StageBadge({ stage }) {
  const s = STAGE_INFO[stage] || STAGE_INFO.concept;
  return (
    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
      style={{ color: s.color, borderColor: s.color + "55", background: s.color + "15" }}>
      {s.label}
    </span>
  );
}

export function DomainTags({ tags = [] }) {
  const shown = tags.filter((t) => DOMAINS[t]);
  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((t) => (
        <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ color: DOMAINS[t].color, background: DOMAINS[t].color + "18", border: `1px solid ${DOMAINS[t].color}40` }}>
          {DOMAINS[t].label}
        </span>
      ))}
      {!shown.includes("MULTI_DOMAIN") && isMultiDomain(tags) && (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-slate-200 border border-slate-500/40">Multi-Domain</span>
      )}
    </div>
  );
}

export function ReadinessBadge({ value }) {
  return <span className="text-[10px] text-slate-300 border border-slate-700 rounded px-2 py-0.5">{READINESS[value] || "Not assessed"}</span>;
}