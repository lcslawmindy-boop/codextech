import { useEffect, useMemo, useState } from "react";
import { Loader2, ShieldAlert, TrendingUp, Gauge, ArrowUpRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { FACTS, SCORECARD, METHODS, BLENDED, FINDINGS, money } from "@/lib/zds33Valuation";

const READINESS_SCORE = { not_assessed: 5, research_only: 15, developing: 35, partner_ready: 60, transfer_ready: 80 };
const STAGE_SCORE = { concept: 10, research: 20, design: 30, prototype: 55, validation: 75 };
const FILING_SCORE = { not_filed: 0, provisional_filed: 15, non_provisional_filed: 35, granted: 60, abandoned: 0 };
const REVIEW_SCORE = { pending: 5, under_review: 15, approved: 40, rejected: 0 };
const RISK_BY_FILING = { not_filed: "high", provisional_filed: "med", non_provisional_filed: "med", granted: "low", abandoned: "high" };
const RISK_BY_STAGE = { concept: "high", research: "high", design: "med", prototype: "med", validation: "low" };

function score(asset, oppCount, docCount, inqCount) {
  let s = 0;
  s += READINESS_SCORE[asset.commercialization_readiness] || 5;
  s += STAGE_SCORE[asset.development_stage] || 10;
  s += FILING_SCORE[asset.filing_status] ?? 0;
  s += REVIEW_SCORE[asset.review_status] || 5;
  s += Math.min(15, (asset.partnership_pathways || []).length * 3);
  s += Math.min(10, docCount * 2);
  s += Math.min(10, oppCount * 4);
  s += inqCount ? 5 : 0;
  if (asset.showcase_status === "approved_public") s += 5;
  return Math.min(100, Math.round(s));
}

function riskFor(asset) {
  const filing = RISK_BY_FILING[asset.filing_status] || "high";
  const stage = RISK_BY_STAGE[asset.development_stage] || "high";
  const order = { low: 0, med: 1, high: 2 };
  return order[filing] >= order[stage] ? filing : stage;
}

const SCORE_COLOR = (s) => (s >= 65 ? "#34d399" : s >= 40 ? "#fbbf24" : "#f87171");
const RISK_COLOR = { low: "#34d399", med: "#fbbf24", high: "#f87171" };
const SEV_COLOR = { high: "#f87171", med: "#fbbf24", low: "#34d399" };

function Card({ title, icon: Icon, children }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={13} className="text-cyan-400" />}
        <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">{title}</p>
      </div>
      {children}
    </div>
  );
}

function Badge({ label, value, color }) {
  return (
    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-900">
      <span className="text-slate-400">{label}</span>
      <span className="font-bold" style={{ color: color || "#fff" }}>{value ?? 0}</span>
    </div>
  );
}

export default function ValuationSummary() {
  const [rows, setRows] = useState(null);
  const [totals, setTotals] = useState(null);

  useEffect(() => {
    const E = base44.entities;
    (async () => {
      const oppAgg = await E.CommercializationCase.aggregate({ groupBy: "ip_asset_id" });
      const oppMap = Object.fromEntries((oppAgg.rows || []).map((r) => [r.ip_asset_id ?? "none", r.count]));
      const docAgg = await E.EngineeringArtifact.aggregate({ groupBy: "ip_asset_id" });
      const docMap = Object.fromEntries((docAgg.rows || []).map((r) => [r.ip_asset_id ?? "none", r.count]));
      const inqAgg = await E.PartnershipInquiry.aggregate({ groupBy: "ip_asset_id" });
      const inqMap = Object.fromEntries((inqAgg.rows || []).map((r) => [r.ip_asset_id ?? "none", r.count]));

      const all = [];
      let cursor;
      do {
        const page = await E.IPAsset.filter({}, { sort: "-created_date", limit: 100, cursor });
        all.push(...page.items);
        cursor = page.has_more ? page.next_cursor : undefined;
      } while (cursor);

      const scored = all.map((a) => {
        const opp = oppMap[a.id] || 0;
        const doc = docMap[a.id] || 0;
        const inq = inqMap[a.id] || 0;
        return { a, opp, doc, inq, score: score(a, opp, doc, inq), risk: riskFor(a) };
      }).sort((x, y) => y.score - x.score);

      const sum = (k) => scored.reduce((n, r) => n + (r.a[k] || 0), 0);
      const valLow = sum("valuation_low");
      const valHigh = sum("valuation_high");
      setRows(scored);
      setTotals({
        count: scored.length,
        scored: scored.filter((r) => r.a.valuation_low || r.a.valuation_high).length,
        valLow,
        valHigh,
        avg: scored.length ? Math.round(scored.reduce((n, r) => n + r.score, 0) / scored.length) : 0,
        risk: { low: scored.filter((r) => r.risk === "low").length, med: scored.filter((r) => r.risk === "med").length, high: scored.filter((r) => r.risk === "high").length },
        filed: scored.filter((r) => r.a.filing_status && r.a.filing_status !== "not_filed").length,
      });
    })();
  }, []);

  const [sort, setSort] = useState("score");
  const [filter, setFilter] = useState("all");
  const view = useMemo(() => {
    if (!rows) return [];
    let r = rows;
    if (filter !== "all") r = r.filter((x) => x.risk === filter);
    if (sort === "name") r = [...r].sort((a, b) => a.a.asset_name.localeCompare(b.a.asset_name));
    if (sort === "risk") r = [...r].sort((a, b) => ({ high: 0, med: 1, low: 2 }[a.risk] - ({ high: 0, med: 1, low: 2 }[b.risk])));
    if (sort === "value") r = [...r].sort((a, b) => (b.a.valuation_high || 0) - (a.a.valuation_high || 0));
    return r;
  }, [rows, sort, filter]);

  if (!rows || !totals) return <Loader2 className="animate-spin text-cyan-400" />;

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Portfolio valuation" icon={Gauge}>
          <p className="text-2xl font-black text-white">{money(BLENDED.low)} – {money(BLENDED.high)}</p>
          <p className="text-[10px] text-slate-500 mt-1">Blended advisory range (rubric-derived, unverified)</p>
          <div className="mt-2">
            <Badge label="Assets with $ estimate" value={totals.scored} color="#22d3ee" />
            <Badge label="Sum of recorded estimates" value={totals.valHigh ? `${money(totals.valLow)}–${money(totals.valHigh)}` : "—"} color="#34d399" />
          </div>
        </Card>
        <Card title="Commercial potential" icon={TrendingUp}>
          <p className="text-2xl font-black" style={{ color: SCORE_COLOR(totals.avg) }}>{totals.avg}<span className="text-sm text-slate-500">/100</span></p>
          <p className="text-[10px] text-slate-500 mt-1">Portfolio average readiness-weighted score</p>
          <div className="mt-2">
            <Badge label="Patents filed / granted" value={totals.filed} color="#34d399" />
            <Badge label="Avg score" value={totals.avg} color={SCORE_COLOR(totals.avg)} />
          </div>
        </Card>
        <Card title="Risk distribution" icon={ShieldAlert}>
          <Badge label="Low risk" value={totals.risk.low} color={RISK_COLOR.low} />
          <Badge label="Medium risk" value={totals.risk.med} color={RISK_COLOR.med} />
          <Badge label="High risk" value={totals.risk.high} color={RISK_COLOR.high} />
        </Card>
        <Card title="Scoring rubric (HDG)" icon={Gauge}>
          {SCORECARD.map((s) => (
            <div key={s.name} className="py-1 border-b border-slate-900">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">{s.name}</span>
                <span className="font-bold text-white">{s.score}/{s.max}</span>
              </div>
              <div className="h-1 rounded bg-slate-800 mt-1 overflow-hidden">
                <div className="h-full bg-cyan-500" style={{ width: `${(s.score / s.max) * 100}%` }} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      <Card title="Valuation methods (advisory, unverified)" icon={TrendingUp}>
        <div className="grid md:grid-cols-3 gap-3">
          {METHODS.map((m) => (
            <div key={m.method} className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
              <p className="text-xs font-bold text-white mb-1">{m.method}</p>
              <p className="text-sm font-black text-cyan-300">{money(m.low)} – {money(m.high)}</p>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">{m.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Top findings (resolve before outreach)" icon={ShieldAlert}>
        <div className="space-y-1.5">
          {FINDINGS.map((f, i) => (
            <div key={i} className="flex gap-2 text-xs py-1.5 border-b border-slate-900">
              <span className="font-bold uppercase px-1.5 py-0.5 rounded h-fit" style={{ color: SEV_COLOR[f.sev], background: SEV_COLOR[f.sev] + "20" }}>{f.sev}</span>
              <div>
                <p className="text-white font-semibold">{f.t}</p>
                <p className="text-slate-400 leading-snug">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">Per-asset commercial potential & risk</p>
          <div className="flex items-center gap-2">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-white">
              <option value="all">All risk</option>
              <option value="low">Low risk</option>
              <option value="med">Medium risk</option>
              <option value="high">High risk</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-white">
              <option value="score">Sort: potential</option>
              <option value="risk">Sort: risk</option>
              <option value="value">Sort: valuation</option>
              <option value="name">Sort: name</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[760px]">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-800">
                <th className="py-2 pr-3 font-semibold">Asset</th>
                <th className="py-2 px-2 font-semibold">Stage</th>
                <th className="py-2 px-2 font-semibold">Filed</th>
                <th className="py-2 px-2 font-semibold">Docs</th>
                <th className="py-2 px-2 font-semibold">Opps</th>
                <th className="py-2 px-2 font-semibold">Potential</th>
                <th className="py-2 px-2 font-semibold">Risk</th>
                <th className="py-2 px-2 font-semibold">Est. value</th>
              </tr>
            </thead>
            <tbody>
              {view.map((r) => (
                <tr key={r.a.id} className="border-b border-slate-900 hover:bg-slate-900/40">
                  <td className="py-2 pr-3">
                    <p className="text-white font-semibold leading-tight line-clamp-1">{r.a.asset_name}</p>
                    {r.a.tech_code && <p className="text-[10px] text-slate-600">{r.a.tech_code}</p>}
                  </td>
                  <td className="py-2 px-2 text-slate-400 capitalize">{r.a.development_stage || "—"}</td>
                  <td className="py-2 px-2 text-slate-400 capitalize">{(r.a.filing_status || "not_filed").replace(/_/g, " ")}</td>
                  <td className="py-2 px-2 text-slate-300">{r.doc}</td>
                  <td className="py-2 px-2 text-slate-300">{r.opp}{r.inq ? <span className="text-amber-400"> ·{r.inq}inq</span> : ""}</td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 rounded bg-slate-800 overflow-hidden">
                        <div className="h-full" style={{ width: `${r.score}%`, background: SCORE_COLOR(r.score) }} />
                      </div>
                      <span className="font-bold" style={{ color: SCORE_COLOR(r.score) }}>{r.score}</span>
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <span className="font-bold uppercase px-1.5 py-0.5 rounded text-[10px]" style={{ color: RISK_COLOR[r.risk], background: RISK_COLOR[r.risk] + "20" }}>{r.risk}</span>
                  </td>
                  <td className="py-2 px-2 text-slate-300">
                    {r.a.valuation_high ? `${money(r.a.valuation_low || 0)}–${money(r.a.valuation_high)}` : <span className="text-slate-600">—</span>}
                  </td>
                </tr>
              ))}
              {view.length === 0 && <tr><td colSpan={8} className="py-6 text-center text-slate-500">No assets match this filter.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-slate-600 mt-3 flex items-center gap-1">
          <ArrowUpRight size={10} /> Scores are advisory, derived from readiness, filing, review, docs, opportunities and inquiries. Not an independent valuation.
        </p>
      </div>

      <Card title="Source facts (from PDR / briefing / teaser)" icon={Gauge}>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-1">
          {FACTS.map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs py-1 border-b border-slate-900 gap-2">
              <span className="text-slate-500 whitespace-nowrap">{k}</span>
              <span className="text-slate-300 text-right">{v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}