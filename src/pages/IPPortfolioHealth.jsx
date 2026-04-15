import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, TrendingUp, AlertTriangle, CheckCircle2, Clock, Zap, Loader2, Bell, BarChart2, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

const PORTFOLIO = [
  { id: "p1", title: "MEG Asymmetric Regauging Generator", patent_number: "US 6,362,718", status: "Granted", filed: "2001-03-15", expires: "2021-03-15", citations: 47, domain: "Vacuum Energy", maintenance_due: null, competitive_exposure: "high" },
  { id: "p2", title: "TRD-1 Telomere Regeneration Device", patent_number: "PPA-2024-TRD1", status: "Provisional", filed: "2024-06-01", expires: "2025-06-01", citations: 0, domain: "Bioelectromagnetics", maintenance_due: "2025-06-01", competitive_exposure: "low" },
  { id: "p3", title: "G-Com Scalar Wave Communicator", patent_number: "PPA-2024-GCOM", status: "Provisional", filed: "2024-09-10", expires: "2025-09-10", citations: 0, domain: "Scalar EM", maintenance_due: "2025-09-10", competitive_exposure: "medium" },
  { id: "p4", title: "TRZ Cold Fusion Reactor Series", patent_number: "PPA-2025-TRZ", status: "Pending", filed: "2025-01-20", expires: null, citations: 0, domain: "Vacuum Energy", maintenance_due: "2026-01-20", competitive_exposure: "high" },
  { id: "p5", title: "Portable Prioré EM Therapy System", patent_number: "FR-DERIV-2024", status: "Provisional", filed: "2024-11-05", expires: "2025-11-05", citations: 3, domain: "Bioelectromagnetics", maintenance_due: "2025-11-05", competitive_exposure: "medium" },
];

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function scorePortfolio(patents) {
  const total = patents.length;
  if (!total) return { breadth: 0, citations: 0, renewals: 0, exposure: 0, overall: 0 };

  const domains = new Set(patents.map(p => p.domain)).size;
  const breadth = Math.min(100, (domains / 6) * 100);

  const avgCitations = patents.reduce((s, p) => s + p.citations, 0) / total;
  const citations = Math.min(100, avgCitations * 2);

  const renewalIssues = patents.filter(p => {
    const days = daysUntil(p.maintenance_due);
    return days !== null && days < 90;
  }).length;
  const renewals = Math.max(0, 100 - (renewalIssues / total) * 100);

  const highExposure = patents.filter(p => p.competitive_exposure === "high").length;
  const exposure = Math.max(0, 100 - (highExposure / total) * 80);

  const overall = Math.round((breadth + citations + renewals + exposure) / 4);
  return { breadth: Math.round(breadth), citations: Math.round(citations), renewals: Math.round(renewals), exposure: Math.round(exposure), overall };
}

function HealthGauge({ score }) {
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  const label = score >= 70 ? "Healthy" : score >= 40 ? "Needs Attention" : "At Risk";
  const circumference = 2 * Math.PI * 40;
  const strokeDash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="10" />
          <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${strokeDash} ${circumference}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-black text-2xl" style={{ color }}>{score}</span>
          <span className="text-gray-500 text-xs">/ 100</span>
        </div>
      </div>
      <p className="font-black text-sm mt-1" style={{ color }}>{label}</p>
    </div>
  );
}

export default function IPPortfolioHealth() {
  const [scores, setScores] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [digestSent, setDigestSent] = useState(false);

  useEffect(() => {
    const s = scorePortfolio(PORTFOLIO);
    setScores(s);

    const a = [];
    PORTFOLIO.forEach(p => {
      const days = daysUntil(p.maintenance_due);
      if (days !== null && days < 90 && days >= 0) {
        a.push({ type: "renewal", level: days < 30 ? "critical" : "high", message: `"${p.title}" maintenance deadline in ${days} days`, patent: p });
      }
      if (p.competitive_exposure === "high") {
        a.push({ type: "exposure", level: "medium", message: `"${p.title}" has high competitive exposure — consider continuation`, patent: p });
      }
    });
    setAlerts(a);
  }, []);

  const getAIInsights = async () => {
    setLoadingInsights(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an IP portfolio strategist. Analyze this patent portfolio and provide actionable insights:

Patents:
${PORTFOLIO.map(p => `- "${p.title}" Status:${p.status} Domain:${p.domain} Citations:${p.citations} Competitive:${p.competitive_exposure} Expires:${p.expires || "N/A"}`).join("\n")}

Portfolio Health Scores:
Breadth: ${scores?.breadth}/100, Citations: ${scores?.citations}/100, Renewals: ${scores?.renewals}/100, Competitive Exposure: ${scores?.exposure}/100, Overall: ${scores?.overall}/100

Return JSON with:
- top_risks: array of 3 strings (most urgent risks)
- quick_wins: array of 3 strings (highest ROI actions this quarter)
- long_term_strategy: string (2-3 sentence strategic recommendation)
- white_space: string (1-2 underprotected areas worth filing in)`,
      response_json_schema: {
        type: "object",
        properties: {
          top_risks: { type: "array", items: { type: "string" } },
          quick_wins: { type: "array", items: { type: "string" } },
          long_term_strategy: { type: "string" },
          white_space: { type: "string" },
        }
      }
    });
    setAiInsights(res);
    setLoadingInsights(false);
  };

  const sendDigest = async () => {
    const user = await base44.auth.me();
    if (!user) return;
    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: `IP Portfolio Health Digest — Score: ${scores?.overall}/100`,
      body: `Your Weekly IP Portfolio Health Report\n\nOVERALL HEALTH SCORE: ${scores?.overall}/100\n\nDIMENSION SCORES:\n• Breadth: ${scores?.breadth}/100\n• Citation Strength: ${scores?.citations}/100\n• Renewal Health: ${scores?.renewals}/100\n• Competitive Exposure: ${scores?.exposure}/100\n\nOPEN ALERTS (${alerts.length}):\n${alerts.map(a => `• [${a.level.toUpperCase()}] ${a.message}`).join("\n")}\n\nPATENT PORTFOLIO (${PORTFOLIO.length} assets):\n${PORTFOLIO.map(p => `• ${p.title} — ${p.status} — ${p.domain}`).join("\n")}\n\n— ZARP IP Platform\nPortfolio Health Digest`
    });
    setDigestSent(true);
  };

  const radarData = scores ? [
    { subject: "Breadth", score: scores.breadth },
    { subject: "Citations", score: scores.citations },
    { subject: "Renewals", score: scores.renewals },
    { subject: "Exposure", score: scores.exposure },
  ] : [];

  const alertColors = { critical: "#ef4444", high: "#f97316", medium: "#f59e0b" };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2"><Shield size={14} className="text-yellow-400" /> IP Portfolio Health</h1>
            <p className="text-gray-500 text-xs">Live scoring · renewal alerts · AI strategic recommendations · weekly digest</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={sendDigest} disabled={digestSent}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 text-xs font-bold transition-all disabled:opacity-50">
            {digestSent ? <CheckCircle2 size={12} className="text-green-400" /> : <Bell size={12} />}
            {digestSent ? "Digest Sent" : "Email Digest"}
          </button>
          <button onClick={getAIInsights} disabled={loadingInsights || !scores}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-yellow-700 hover:bg-yellow-600 text-black text-xs font-black transition-all disabled:opacity-50">
            {loadingInsights ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
            {loadingInsights ? "Analyzing…" : "AI Insights"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 max-w-6xl mx-auto w-full space-y-5">

        {/* Top row: gauge + radar + alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Overall gauge */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col items-center justify-center">
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Portfolio Health Score</p>
            {scores && <HealthGauge score={scores.overall} />}
            <div className="mt-4 w-full grid grid-cols-2 gap-2">
              {scores && Object.entries({ Breadth: scores.breadth, Citations: scores.citations, Renewals: scores.renewals, Exposure: scores.exposure }).map(([k, v]) => (
                <div key={k} className="text-center">
                  <p className="text-xs font-black" style={{ color: v >= 70 ? "#22c55e" : v >= 40 ? "#f59e0b" : "#ef4444" }}>{v}</p>
                  <p className="text-gray-600 text-xs">{k}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Radar */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Dimension Radar</p>
            {radarData.length > 0 && (
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 10 }} />
                  <Radar dataKey="score" stroke="#d4af37" fill="#d4af37" fillOpacity={0.25} />
                  <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#fff" }} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Alerts */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Open Alerts ({alerts.length})</p>
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32">
                <CheckCircle2 size={24} className="text-green-400 mb-2" />
                <p className="text-green-400 text-sm font-bold">No critical alerts</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {alerts.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 bg-gray-800/50 rounded-xl px-3 py-2">
                    <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" style={{ color: alertColors[a.level] }} />
                    <p className="text-gray-300 text-xs leading-relaxed">{a.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Insights */}
        {aiInsights && (
          <div className="bg-yellow-950/20 border border-yellow-800/40 rounded-2xl p-5 space-y-4">
            <p className="text-yellow-400 text-xs font-black uppercase tracking-widest">AI Strategic Insights</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2">Top Risks</p>
                <div className="space-y-1.5">
                  {(aiInsights.top_risks || []).map((r, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertTriangle size={11} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300 text-xs leading-relaxed">{r}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-green-400 text-xs font-bold uppercase tracking-wider mb-2">Quick Wins</p>
                <div className="space-y-1.5">
                  {(aiInsights.quick_wins || []).map((w, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={11} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300 text-xs leading-relaxed">{w}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1.5">Long-Term Strategy</p>
              <p className="text-gray-300 text-sm leading-relaxed">{aiInsights.long_term_strategy}</p>
            </div>
            <div>
              <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1.5">White Space Opportunities</p>
              <p className="text-gray-300 text-sm leading-relaxed">{aiInsights.white_space}</p>
            </div>
          </div>
        )}

        {/* Patent table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800">
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Patent Assets ({PORTFOLIO.length})</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  {["Title", "Patent #", "Status", "Domain", "Citations", "Competitive", "Next Deadline"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-gray-600 text-xs font-bold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {PORTFOLIO.map(p => {
                  const days = daysUntil(p.maintenance_due);
                  const expColor = days !== null && days < 30 ? "#ef4444" : days !== null && days < 90 ? "#f59e0b" : "#6b7280";
                  const expColors = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" };
                  return (
                    <tr key={p.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-white text-xs font-semibold max-w-[200px] truncate">{p.title}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs font-mono">{p.patent_number}</td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">{p.status}</span></td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{p.domain}</td>
                      <td className="px-4 py-3 text-indigo-400 text-xs font-black">{p.citations}</td>
                      <td className="px-4 py-3"><span className="text-xs font-black capitalize" style={{ color: expColors[p.competitive_exposure] }}>{p.competitive_exposure}</span></td>
                      <td className="px-4 py-3">
                        {days !== null ? (
                          <span className="text-xs font-bold" style={{ color: expColor }}>{days}d</span>
                        ) : <span className="text-gray-700 text-xs">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}