import { Link } from "react-router-dom";
import { Loader2, ArrowRight, Layers } from "lucide-react";
import Zds33Shell from "@/components/zds33/Zds33Shell";
import { PORTFOLIOS, useShowcase, isMultiDomain } from "@/lib/zds33";

export default function ZDS33Hub() {
  const { items, loading } = useShowcase();
  const multi = items.filter((t) => isMultiDomain(t.domain_tags)).length;

  return (
    <Zds33Shell>
      <section className="max-w-7xl mx-auto px-4 pt-14 pb-10">
        <p className="text-[11px] tracking-[0.3em] text-cyan-400 mb-3">ADVANCED ENGINEERING · AEROSPACE · HUMANITARIAN RESILIENCE · DEEP SPACE</p>
        <h1 className="text-3xl sm:text-5xl font-black leading-tight max-w-3xl">
          One technology core. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-400">Many missions.</span>
        </h1>
        <p className="text-slate-400 mt-4 max-w-2xl text-sm sm:text-base">
          ZDS33 Integrated Systems connects Humanitarian, Defense &amp; Security, and Deep Space portfolios through a single IP architecture. One underlying IP asset can support several mission domains without duplicate records.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <Link to="/zds33/systems" className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-sm font-bold flex items-center gap-2">
            Explore Integrated Systems <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {PORTFOLIOS.map((p) => {
          const count = items.filter((t) => t.domain_tags.some((d) => p.tags.includes(d))).length;
          return (
            <Link key={p.slug} to={`/zds33/portfolio/${p.slug}`}
              className="rounded-2xl border border-slate-800 p-5 hover:border-slate-600 transition-colors relative overflow-hidden"
              style={{ background: `linear-gradient(160deg, ${p.color}14, #0a0d12 60%)` }}>
              <div className="w-8 h-1 rounded mb-4" style={{ background: p.color }} />
              <h2 className="font-bold text-lg mb-2">{p.title}</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{p.blurb}</p>
              <p className="text-xs font-semibold" style={{ color: p.color }}>
                {loading ? "…" : `${count} approved technolog${count === 1 ? "y" : "ies"}`}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <Layers className="text-cyan-400" />
            <div>
              <p className="font-bold text-sm">Cross-domain technologies</p>
              <p className="text-xs text-slate-400">
                {loading ? <Loader2 size={12} className="animate-spin inline" /> : `${multi} technolog${multi === 1 ? "y supports" : "ies support"} more than one mission domain.`}
              </p>
            </div>
          </div>
          <Link to="/zds33/systems" className="text-xs text-cyan-400 font-semibold">View architecture explorer →</Link>
        </div>
        <p className="text-[11px] text-slate-500 mt-4 max-w-3xl">
          Every technology is labelled Concept, Research, Design, Prototype or Validation. A technology is never presented as a working or validated system unless evidence is on file. Defense content is high-level and non-operational.
        </p>
      </section>
    </Zds33Shell>
  );
}