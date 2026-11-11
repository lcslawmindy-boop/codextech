import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Loader2, Users, Eye, TrendingUp, Mail, CheckCircle2, AlertCircle, Shield,
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_COLOR = {
  identified: "#64748b", drafted: "#64748b", sent: "#06b6d4", replied: "#10b981",
  meeting: "#a78bfa", negotiating: "#fbbf24", closed: "#10b981", rejected: "#ef4444",
  proposed: "#64748b", under_review: "#fbbf24", authorized: "#10b981", active: "#06b6d4",
  paused: "#f97316", completed: "#10b981", abandoned: "#ef4444",
  new: "#06b6d4", reviewing: "#fbbf24", responded: "#10b981",
};

const TYPE_LABEL = {
  patent_probono: "Pro-bono", university: "University", oem: "OEM",
  grant_agency: "Grant", foundation: "Foundation", ip_broker: "Broker", other: "Other",
};

function Badge({ status }) {
  const c = STATUS_COLOR[status] || "#64748b";
  return <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ color: c, background: c + "20" }}>{status.replace(/_/g, " ")}</span>;
}

export default function InvestorStatus() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const E = base44.entities;
    Promise.all([
      E.PartnerOutreach.list({ sort: "-created_date", limit: 100 }),
      E.CommercializationCase.list({ sort: "-created_date", limit: 100 }),
      E.FundingOpportunity.list({ sort: "-created_date", limit: 100 }),
      E.PartnershipInquiry.list({ sort: "-created_date", limit: 50 }),
    ]).then(async ([partners, cases, funding, inq]) => {
      const partnerItems = partners.items || [];
      const caseItems = cases.items || [];
      const fundItems = funding.items || [];
      const inqItems = inq.items || [];

      const assetIds = [...new Set(caseItems.map((c) => c.ip_asset_id).filter(Boolean))];
      const assetMap = {};
      if (assetIds.length) {
        const assets = await Promise.all(assetIds.map((id) => E.IPAsset.get(id).catch(() => null)));
        assetIds.forEach((id, i) => { if (assets[i]) assetMap[id] = assets[i].asset_name || "Unnamed asset"; });
      }

      const byStatus = {};
      partnerItems.forEach((p) => { byStatus[p.status] = (byStatus[p.status] || 0) + 1; });

      const reviewing = partnerItems.filter((p) => ["sent", "replied", "meeting"].includes(p.status));

      const casesByAsset = {};
      caseItems.forEach((c) => {
        const key = c.ip_asset_id || "unassigned";
        if (!casesByAsset[key]) casesByAsset[key] = [];
        casesByAsset[key].push(c);
      });

      const fundByCase = {};
      fundItems.forEach((f) => {
        const key = f.commercialization_case_id || "none";
        if (!fundByCase[key]) fundByCase[key] = [];
        fundByCase[key].push(f);
      });

      setData({ partnerItems, caseItems, fundItems, inqItems, byStatus, reviewing, casesByAsset, assetMap, fundByCase });
      setLoading(false);
    }).catch(() => { setData(null); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-cyan-400" size={28} /></div>;
  if (!data) return <div className="p-10 text-center text-slate-500 text-sm">Failed to load status data.</div>;

  const contactedTotal = data.partnerItems.length;
  const reviewingTotal = data.reviewing.length;
  const dealTotal = data.caseItems.length;
  const newInquiries = data.inqItems.filter((i) => i.status === "new").length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-4 py-3 sticky top-0 z-40 bg-slate-950/95 backdrop-blur flex items-center gap-2">
        <Link to="/zds33-admin" className="text-slate-400 hover:text-white"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-white font-black text-sm">Investor & Partner Status</h1>
          <p className="text-slate-500 text-[10px]">Who's contacted, who's reviewing, where each deal stands</p>
        </div>
      </div>

      <div className="px-4 py-4 max-w-3xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <Users size={16} className="text-cyan-400 mb-1" />
            <p className="text-white text-xl font-black">{contactedTotal}</p>
            <p className="text-slate-500 text-[10px] uppercase font-bold">Partners contacted</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <Eye size={16} className="text-purple-400 mb-1" />
            <p className="text-white text-xl font-black">{reviewingTotal}</p>
            <p className="text-slate-500 text-[10px] uppercase font-bold">Reviewing deck</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <TrendingUp size={16} className="text-emerald-400 mb-1" />
            <p className="text-white text-xl font-black">{dealTotal}</p>
            <p className="text-slate-500 text-[10px] uppercase font-bold">Deal cases</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <Mail size={16} className="text-amber-400 mb-1" />
            <p className="text-white text-xl font-black">{newInquiries}</p>
            <p className="text-slate-500 text-[10px] uppercase font-bold">New inquiries</p>
          </div>
        </div>

        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} className="text-cyan-400" />
            <h2 className="text-white font-black text-sm">Partners contacted</h2>
          </div>
          {contactedTotal === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center">
              <AlertCircle size={20} className="text-slate-700 mx-auto mb-2" />
              <p className="text-slate-500 text-xs">No partners logged yet. <Link to="/zero-capital-plan" className="text-cyan-400 font-bold">Add your first outreach →</Link></p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {Object.entries(data.byStatus).map(([s, n]) => (
                  <span key={s} className="text-[10px] font-bold px-2 py-1 rounded" style={{ color: STATUS_COLOR[s] || "#64748b", background: (STATUS_COLOR[s] || "#64748b") + "20" }}>
                    {s.replace(/_/g, " ")}: {n}
                  </span>
                ))}
              </div>
              <div className="space-y-2">
                {data.partnerItems.map((p) => (
                  <div key={p.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-white text-xs font-bold truncate">{p.partner_name}</p>
                      <Badge status={p.status} />
                    </div>
                    <p className="text-slate-500 text-[10px]">
                      {TYPE_LABEL[p.partner_type] || p.partner_type}{p.asset_focus ? ` · ${p.asset_focus}` : ""}{p.contact_name ? ` · ${p.contact_name}` : ""}
                    </p>
                    {p.ask && <p className="text-slate-400 text-[11px] mt-1 line-clamp-2"><b className="text-slate-300">Ask:</b> {p.ask}</p>}
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={16} className="text-purple-400" />
            <h2 className="text-white font-black text-sm">Who's reviewing the deck</h2>
          </div>
          {reviewingTotal === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-center">
              <p className="text-slate-500 text-xs">No one in active review yet. Outreach moves here once a deck is sent and a reply or meeting is in play.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.reviewing.map((p) => (
                <div key={p.id} className="rounded-xl border border-purple-800/30 bg-purple-950/10 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white text-xs font-bold">{p.partner_name}</p>
                    <Badge status={p.status} />
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{p.asset_focus}{p.contact_email ? ` · ${p.contact_email}` : ""}</p>
                  {p.follow_up_date && <p className="text-amber-400 text-[10px] mt-1">Follow up: {p.follow_up_date}</p>}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-emerald-400" />
            <h2 className="text-white font-black text-sm">Equity deal status per asset</h2>
          </div>
          {dealTotal === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-center">
              <p className="text-slate-500 text-xs">No commercialization cases yet. <Link to="/zds33-admin" className="text-cyan-400 font-bold">Create one from Opportunities →</Link></p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(data.casesByAsset).map(([assetId, cases]) => (
                <div key={assetId} className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={13} className="text-cyan-400" />
                    <p className="text-white text-xs font-bold">{data.assetMap[assetId] || "Unassigned asset"}</p>
                    <span className="text-[9px] text-slate-600 ml-auto">{cases.length} case{cases.length > 1 ? "s" : ""}</span>
                  </div>
                  <div className="space-y-1.5">
                    {cases.map((c) => (
                      <div key={c.id} className="rounded-lg bg-slate-950/40 border border-slate-800 p-2.5">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="text-slate-200 text-[11px] font-bold truncate">{c.title}</p>
                          <Badge status={c.status} />
                        </div>
                        <p className="text-slate-500 text-[10px]">{c.pathway?.replace(/_/g, " ")}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {c.human_authorized ? (
                            <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5"><CheckCircle2 size={10} /> Authorized</span>
                          ) : (
                            <span className="text-[9px] text-amber-400 font-bold">Not authorized</span>
                          )}
                          {(data.fundByCase[c.id] || []).length > 0 && (
                            <span className="text-[9px] text-cyan-400 font-bold">{data.fundByCase[c.id].length} funding opp{data.fundByCase[c.id].length > 1 ? "s" : ""}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="rounded-xl border border-amber-700/30 bg-amber-950/10 p-3">
          <p className="text-amber-200/70 text-[10px] leading-relaxed">
            No external outreach, filing, or deal commitment is automated. Every case requires human authorization
            before any external action. Status here reflects records logged in the platform, not signed deals.
          </p>
        </div>
      </div>
    </div>
  );
}