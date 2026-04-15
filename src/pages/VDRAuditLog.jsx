import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Shield, Loader2, Eye, Clock, Flame, User,
  ChevronDown, ChevronUp, Download, BarChart2, AlertCircle,
  Calendar, Activity, RefreshCw, Search
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const fmt_time = (s) => {
  if (!s || s === 0) return "—";
  const m = Math.floor(s / 60);
  if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}m`;
  return m > 0 ? `${m}m ${Math.floor(s % 60)}s` : `${Math.floor(s)}s`;
};

const fmt_ts = (ts) => {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true
  });
};

// Heat score 0–100 based on views + time
const heatScore = (session) => {
  const views = (session.page_views || []).length;
  const time = session.total_time_seconds || 0;
  const viewScore = Math.min(views * 5, 50);
  const timeScore = Math.min(Math.floor(time / 30), 50);
  return viewScore + timeScore;
};

const heatColor = (score) => {
  if (score >= 80) return { bar: "bg-red-500",    text: "text-red-400",    badge: "bg-red-950/50 border-red-700 text-red-300",    label: "🔥 HOT" };
  if (score >= 50) return { bar: "bg-orange-500", text: "text-orange-400", badge: "bg-orange-950/50 border-orange-700 text-orange-300", label: "Warm" };
  if (score >= 20) return { bar: "bg-yellow-500", text: "text-yellow-400", badge: "bg-yellow-950/30 border-yellow-800 text-yellow-300", label: "Tepid" };
  return { bar: "bg-gray-600", text: "text-gray-500", badge: "bg-gray-800 border-gray-700 text-gray-500", label: "Cold" };
};

// All unique document names across all sessions
function getAllDocuments(sessions) {
  const docs = new Set();
  sessions.forEach(s => (s.page_views || []).forEach(v => { if (v.page) docs.add(v.page); }));
  return Array.from(docs).sort();
}

// Per-investor document engagement
function getDocStats(session) {
  const views = session.page_views || [];
  const map = {};
  views.forEach(v => {
    if (!map[v.page]) map[v.page] = { views: 0, total_time: 0, first_seen: v.viewed_at, last_seen: v.viewed_at };
    map[v.page].views += 1;
    map[v.page].total_time += v.duration_seconds || 0;
    if (v.viewed_at < map[v.page].first_seen) map[v.page].first_seen = v.viewed_at;
    if (v.viewed_at > map[v.page].last_seen) map[v.page].last_seen = v.viewed_at;
  });
  return map;
}

// ── HEATMAP GRID ──────────────────────────────────────────────────────────────
function HeatmapGrid({ sessions, allDocs }) {
  const maxViews = useMemo(() => {
    let max = 1;
    sessions.forEach(s => {
      const stats = getDocStats(s);
      Object.values(stats).forEach(d => { if (d.views > max) max = d.views; });
    });
    return max;
  }, [sessions]);

  if (!allDocs.length) return <p className="text-gray-600 text-sm">No document views recorded yet.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-xs">
        <thead>
          <tr>
            <th className="text-left text-gray-500 font-semibold py-2 pr-4 sticky left-0 bg-gray-950 min-w-[160px]">Investor</th>
            {allDocs.map(doc => (
              <th key={doc} className="text-gray-500 font-semibold py-2 px-2 text-center max-w-[100px]">
                <div className="truncate max-w-[90px]" title={doc}>{doc}</div>
              </th>
            ))}
            <th className="text-gray-500 font-semibold py-2 px-2 text-center">Heat</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(session => {
            const stats = getDocStats(session);
            const score = heatScore(session);
            const heat = heatColor(score);
            return (
              <tr key={session.id} className="border-t border-gray-800/50 hover:bg-gray-900/40">
                <td className="py-2 pr-4 sticky left-0 bg-gray-950">
                  <div className="font-bold text-white truncate max-w-[155px]" title={session.buyer_name}>{session.buyer_name}</div>
                  <div className="text-gray-600 truncate max-w-[155px]">{session.buyer_org || session.buyer_email}</div>
                </td>
                {allDocs.map(doc => {
                  const d = stats[doc];
                  const intensity = d ? Math.max(0.15, d.views / maxViews) : 0;
                  return (
                    <td key={doc} className="px-2 py-2 text-center">
                      {d ? (
                        <div className="group relative inline-flex flex-col items-center">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white cursor-default"
                            style={{ backgroundColor: `rgba(59,130,246,${intensity})`, border: `1px solid rgba(59,130,246,${intensity * 0.6})` }}
                            title={`${d.views} views · ${fmt_time(d.total_time)}`}
                          >
                            {d.views}
                          </div>
                          {/* Tooltip */}
                          <div className="hidden group-hover:block absolute bottom-9 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white z-30 whitespace-nowrap shadow-xl">
                            <p className="font-bold mb-0.5">{doc}</p>
                            <p>{d.views} views · {fmt_time(d.total_time)}</p>
                            <p className="text-gray-500">First: {fmt_ts(d.first_seen)}</p>
                            <p className="text-gray-500">Last: {fmt_ts(d.last_seen)}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-gray-900 mx-auto opacity-30" />
                      )}
                    </td>
                  );
                })}
                <td className="px-2 py-2 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${heat.badge}`}>{heat.label}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── INVESTOR DETAIL ROW ───────────────────────────────────────────────────────
function InvestorAuditRow({ session }) {
  const [expanded, setExpanded] = useState(false);
  const views = session.page_views || [];
  const score = heatScore(session);
  const heat = heatColor(score);
  const docStats = getDocStats(session);
  const topDocs = Object.entries(docStats).sort((a, b) => b[1].total_time - a[1].total_time);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gray-800/40 transition-all text-left" onClick={() => setExpanded(e => !e)}>
        {/* Heat bar */}
        <div className="w-1.5 self-stretch rounded-full" style={{ background: score >= 80 ? "#ef4444" : score >= 50 ? "#f97316" : score >= 20 ? "#eab308" : "#374151" }} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="text-white font-black text-sm">{session.buyer_name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${heat.badge}`}>{heat.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-lg border font-semibold ${
              session.status === 'active' ? 'bg-green-950/40 border-green-800 text-green-400' :
              session.status === 'revoked' ? 'bg-red-950/40 border-red-800 text-red-400' :
              'bg-gray-800 border-gray-700 text-gray-500'
            }`}>{session.status}</span>
          </div>
          <div className="text-gray-500 text-xs">{session.buyer_email} · {session.buyer_org}</div>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-xs flex-shrink-0">
          <div className="text-center">
            <p className="text-blue-400 font-black text-base">{views.length}</p>
            <p className="text-gray-600">views</p>
          </div>
          <div className="text-center">
            <p className={`font-black text-base ${heat.text}`}>{score}</p>
            <p className="text-gray-600">heat</p>
          </div>
          <div className="text-center">
            <p className="text-amber-400 font-black text-base">{fmt_time(session.total_time_seconds)}</p>
            <p className="text-gray-600">time</p>
          </div>
          <div className="text-center">
            <p className="text-gray-300 font-bold">{session.access_count || 0}</p>
            <p className="text-gray-600">logins</p>
          </div>
        </div>
        <div className="text-gray-600 flex-shrink-0">{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</div>
      </button>

      {expanded && (
        <div className="border-t border-gray-800 p-5 space-y-5">
          {/* Timeline summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "NDA Signed", value: fmt_ts(session.nda_signed_at) },
              { label: "First Access", value: views.length ? fmt_ts(views[0]?.viewed_at) : "—" },
              { label: "Last Access", value: session.last_accessed ? fmt_ts(session.last_accessed) : "—" },
              { label: "Expires", value: fmt_ts(session.expires_at) },
            ].map(item => (
              <div key={item.label} className="bg-gray-800/50 rounded-lg px-3 py-2">
                <p className="text-gray-500 text-xs mb-0.5">{item.label}</p>
                <p className="text-white text-xs font-bold">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Document engagement */}
          {topDocs.length > 0 && (
            <div>
              <p className="text-gray-500 text-xs font-black uppercase tracking-wider mb-3">Document Engagement (sorted by time spent)</p>
              <div className="space-y-2">
                {topDocs.map(([doc, d]) => {
                  const maxTime = topDocs[0][1].total_time || 1;
                  const pct = Math.round((d.total_time / maxTime) * 100);
                  return (
                    <div key={doc} className="bg-gray-800/30 rounded-lg px-4 py-2.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-gray-200 text-xs font-semibold truncate flex-1 mr-4">{doc}</span>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span className="text-blue-400 text-xs font-bold">{d.views} view{d.views !== 1 ? "s" : ""}</span>
                          <span className="text-amber-400 text-xs font-bold">{fmt_time(d.total_time)}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-700 text-xs">First: {fmt_ts(d.first_seen)}</span>
                        <span className="text-gray-700 text-xs">Last: {fmt_ts(d.last_seen)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chronological access log */}
          {views.length > 0 && (
            <div>
              <p className="text-gray-500 text-xs font-black uppercase tracking-wider mb-3">Chronological Access Log</p>
              <div className="border border-gray-800 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-gray-900">
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-gray-500 font-semibold py-2 px-3">Timestamp</th>
                      <th className="text-left text-gray-500 font-semibold py-2 px-3">Document / Page</th>
                      <th className="text-right text-gray-500 font-semibold py-2 px-3">Time Spent</th>
                      <th className="text-right text-gray-500 font-semibold py-2 px-3">IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {views.slice().sort((a, b) => new Date(b.viewed_at) - new Date(a.viewed_at)).map((v, i) => (
                      <tr key={i} className={`border-b border-gray-800/40 ${i % 2 === 0 ? "bg-gray-900/40" : ""}`}>
                        <td className="py-2 px-3 text-gray-400 whitespace-nowrap">{fmt_ts(v.viewed_at)}</td>
                        <td className="py-2 px-3 text-gray-200 font-semibold">{v.page}</td>
                        <td className="py-2 px-3 text-amber-400 text-right font-bold">{fmt_time(v.duration_seconds)}</td>
                        <td className="py-2 px-3 text-gray-600 text-right">{v.ip || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {views.length === 0 && (
            <div className="text-center py-6">
              <Eye size={24} className="text-gray-700 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No document views recorded yet for this investor.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function VDRAuditLog() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // "list" | "heatmap"
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("heat");

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.VDRSession.list("-created_date", 200);
    setSessions(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const allDocs = useMemo(() => getAllDocuments(sessions), [sessions]);

  const filtered = useMemo(() => {
    let s = sessions.filter(x =>
      !search ||
      x.buyer_name?.toLowerCase().includes(search.toLowerCase()) ||
      x.buyer_email?.toLowerCase().includes(search.toLowerCase()) ||
      x.buyer_org?.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === "heat") s = s.sort((a, b) => heatScore(b) - heatScore(a));
    else if (sortBy === "time") s = s.sort((a, b) => (b.total_time_seconds || 0) - (a.total_time_seconds || 0));
    else if (sortBy === "views") s = s.sort((a, b) => (b.page_views || []).length - (a.page_views || []).length);
    else if (sortBy === "recent") s = s.sort((a, b) => new Date(b.last_accessed || 0) - new Date(a.last_accessed || 0));
    return s;
  }, [sessions, search, sortBy]);

  // Summary stats
  const hotCount = sessions.filter(s => heatScore(s) >= 80).length;
  const warmCount = sessions.filter(s => heatScore(s) >= 50 && heatScore(s) < 80).length;
  const totalTime = sessions.reduce((s, x) => s + (x.total_time_seconds || 0), 0);
  const totalViews = sessions.reduce((s, x) => s + (x.page_views || []).length, 0);

  // Export CSV
  const exportCSV = () => {
    const rows = [["Investor", "Email", "Org", "Status", "Heat Score", "Total Views", "Total Time (s)", "Sessions", "NDA Signed", "Last Access", "Documents Viewed"]];
    sessions.forEach(s => {
      const docs = Object.keys(getDocStats(s)).join(" | ");
      rows.push([
        s.buyer_name, s.buyer_email, s.buyer_org || "", s.status,
        heatScore(s), (s.page_views || []).length, s.total_time_seconds || 0,
        s.access_count || 0, s.nda_signed_at || "", s.last_accessed || "", docs
      ]);
    });
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `VDR_AuditLog_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-yellow-400" size={28} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/vdr-admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> VDR Admin
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <Flame size={15} className="text-red-400" /> VDR Audit Log
            </h1>
            <p className="text-gray-500 text-xs">Document engagement · Due diligence heat · Access timestamps</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all">
            <RefreshCw size={13} />
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-bold transition-all">
            <Download size={12} /> Export CSV
          </button>
        </div>
      </div>

      {/* Heat summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5 py-4 border-b border-gray-800">
        {[
          { label: "🔥 Hot Investors", value: hotCount, sub: "score >= 80", color: "text-red-400", bg: "border-red-900/40" },
          { label: "Warm Investors", value: warmCount, sub: "score 50–79", color: "text-orange-400", bg: "border-orange-900/40" },
          { label: "Total Doc Views", value: totalViews, sub: `across ${sessions.length} investors`, color: "text-blue-400", bg: "border-blue-900/30" },
          { label: "Total Read Time", value: fmt_time(totalTime), sub: "combined engagement", color: "text-amber-400", bg: "border-amber-900/30" },
        ].map(card => (
          <div key={card.label} className={`bg-gray-900 border rounded-xl px-4 py-3 ${card.bg}`}>
            <p className={`font-black text-xl ${card.color}`}>{card.value}</p>
            <p className="text-gray-300 text-xs font-semibold">{card.label}</p>
            <p className="text-gray-600 text-xs">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-800 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 flex-1 min-w-[180px]">
          <Search size={12} className="text-gray-500 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search investor…"
            className="bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none w-full"
          />
        </div>

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-gray-300 text-xs focus:outline-none">
          <option value="heat">Sort: Heat Score</option>
          <option value="time">Sort: Time Spent</option>
          <option value="views">Sort: View Count</option>
          <option value="recent">Sort: Last Active</option>
        </select>

        {/* View toggle */}
        <div className="flex rounded-xl overflow-hidden border border-gray-800">
          {[["list", "List"], ["heatmap", "Heatmap"]].map(([v, l]) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-2 text-xs font-bold transition-all ${view === v ? "bg-gray-700 text-white" : "bg-gray-900 text-gray-500 hover:text-gray-300"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-5">
        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle size={40} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No VDR sessions found. Generate investor links from the VDR Admin page.</p>
            <Link to="/vdr-admin" className="text-yellow-500 text-sm underline mt-2 inline-block">Go to VDR Admin →</Link>
          </div>
        ) : view === "heatmap" ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={14} className="text-blue-400" />
              <h2 className="text-white font-black text-sm">Document View Heatmap</h2>
              <span className="text-gray-600 text-xs ml-2">Cell = number of times viewed · Hover for details</span>
            </div>
            <HeatmapGrid sessions={filtered} allDocs={allDocs} />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-2">
            {filtered.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-8">No investors match your search.</p>
            ) : (
              filtered.map(session => <InvestorAuditRow key={session.id} session={session} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}