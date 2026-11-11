import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
import Zds33Shell from "@/components/zds33/Zds33Shell";
import TechCard from "@/components/zds33/TechCard";
import ArchitectureExplorer from "@/components/zds33/ArchitectureExplorer";
import { PORTFOLIOS, DOMAINS, CATEGORIES, STAGES, STAGE_INFO, READINESS, PATHWAYS, useShowcase } from "@/lib/zds33";

const sel = "rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-2 text-xs text-white";

export default function IntegratedSystems() {
  const { slug } = useParams();
  const portfolio = PORTFOLIOS.find((p) => p.slug === slug);
  const { items, loading, error } = useShowcase();
  const [tab, setTab] = useState("browse");
  const [f, setF] = useState({ q: "", domain: "ALL", category: "ALL", stage: "ALL", subsystem: "ALL", readiness: "ALL", pathway: "ALL" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const scoped = useMemo(
    () => (portfolio ? items.filter((t) => t.domain_tags.some((d) => portfolio.tags.includes(d))) : items),
    [items, portfolio]);
  const subsystems = [...new Set(scoped.map((t) => t.subsystem).filter(Boolean))].sort();

  const filtered = scoped.filter((t) =>
    (!f.q || `${t.name} ${t.summary} ${t.tech_code}`.toLowerCase().includes(f.q.toLowerCase())) &&
    (f.domain === "ALL" || t.domain_tags.includes(f.domain)) &&
    (f.category === "ALL" || t.category === f.category) &&
    (f.stage === "ALL" || t.stage === f.stage) &&
    (f.subsystem === "ALL" || t.subsystem === f.subsystem) &&
    (f.readiness === "ALL" || t.readiness === f.readiness) &&
    (f.pathway === "ALL" || t.pathways.includes(f.pathway)));

  return (
    <Zds33Shell>
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <h1 className="text-2xl sm:text-3xl font-black">{portfolio ? portfolio.title : "Integrated Systems"}</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl">
          {portfolio ? portfolio.blurb : "Discover technologies by mission domain, category, stage, subsystem, readiness and partnership pathway. Technologies shown in several domains are one underlying IP asset."}
        </p>
        <div className="flex gap-1 mt-5 border-b border-slate-800">
          {[["browse", "Technologies"], ["explorer", "Architecture Explorer"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-2 text-xs font-bold border-b-2 -mb-px ${tab === k ? "border-cyan-400 text-cyan-300" : "border-transparent text-slate-500"}`}>{l}</button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-cyan-400" /></div>
        ) : error ? (
          <p className="py-16 text-center text-sm text-red-400">Could not load technologies.</p>
        ) : tab === "explorer" ? (
          <div className="py-6"><ArchitectureExplorer items={scoped} /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 py-5">
              <div className="col-span-2 relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={f.q} onChange={set("q")} placeholder="Search technologies" className={`${sel} w-full pl-8`} />
              </div>
              <select className={sel} value={f.domain} onChange={set("domain")}>
                <option value="ALL">All mission domains</option>
                {Object.entries(DOMAINS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select className={sel} value={f.category} onChange={set("category")}>
                <option value="ALL">All categories</option>
                {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select className={sel} value={f.stage} onChange={set("stage")}>
                <option value="ALL">All stages</option>
                {STAGES.map((s) => <option key={s} value={s}>{STAGE_INFO[s].label}</option>)}
              </select>
              <select className={sel} value={f.subsystem} onChange={set("subsystem")}>
                <option value="ALL">All subsystems</option>
                {subsystems.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className={sel} value={f.readiness} onChange={set("readiness")}>
                <option value="ALL">Any readiness</option>
                {Object.entries(READINESS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select className={sel} value={f.pathway} onChange={set("pathway")}>
                <option value="ALL">Any pathway</option>
                {Object.entries(PATHWAYS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-sm text-slate-500">
                {items.length === 0 ? "No technologies have been approved for the public showcase yet." : "No technologies match these filters."}
                {portfolio && <div className="mt-3"><Link to="/zds33/systems" className="text-cyan-400">View all portfolios</Link></div>}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
                {filtered.map((t) => <TechCard key={t.id} tech={t} />)}
              </div>
            )}
          </>
        )}
      </div>
    </Zds33Shell>
  );
}