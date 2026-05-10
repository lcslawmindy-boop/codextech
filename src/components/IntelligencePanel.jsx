import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Brain, AlertTriangle, TrendingUp, Zap, ChevronRight,
  RefreshCw, Activity, Eye, Radar, Loader2, ArrowRight
} from "lucide-react";
import { base44 } from "@/api/base44Client";

function getRiskColor(level) {
  return level === "critical" ? "#ef4444" : level === "high" ? "#f97316" : level === "medium" ? "#f59e0b" : "#22c55e";
}

export default function IntelligencePanel({ compact = false }) {
  const [alerts, setAlerts] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [inventions, setInventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState(null);
  const [generatingInsight, setGeneratingInsight] = useState(false);

  useEffect(() => {
    Promise.all([
      base44.entities.MonitoringAlert.filter({ status: "new" }, "-created_date", 5),
      base44.entities.OpportunityAlert.filter({ dismissed: false }, "-created_date", 5),
      base44.entities.HybridInvention.list("-created_date", 3),
    ]).then(([a, o, inv]) => {
      setAlerts(a || []);
      setOpportunities(o || []);
      setInventions(inv || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const generateInsight = async () => {
    setGeneratingInsight(true);
    try {
      const context = [
        alerts.length > 0 ? `${alerts.length} active IP threats (${alerts.filter(a => a.risk_level === "critical").length} critical)` : "no active threats",
        opportunities.length > 0 ? `${opportunities.length} new opportunities detected` : "no new opportunities",
        inventions.length > 0 ? `Latest invention: ${inventions[0]?.hybrid_concept?.slice(0, 60)}` : "",
      ].filter(Boolean).join(". ");

      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an IP intelligence analyst for Aethon Apex IP. Based on this data: ${context}. Provide a 2-sentence strategic insight about the current IP portfolio status and one recommended action. Be direct and specific.`,
      });
      setInsight(res);
    } catch {}
    setGeneratingInsight(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-8">
      <Loader2 size={16} className="animate-spin text-cyan-400" />
    </div>
  );

  return (
    <div className="space-y-4">

      {/* AI Insight Engine */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Brain size={14} className="text-yellow-400" />
            <span className="text-white font-black text-xs">Insight Engine</span>
          </div>
          <button onClick={generateInsight} disabled={generatingInsight}
            className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-cyan-400 transition-colors">
            {generatingInsight ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />}
            {generatingInsight ? "Analyzing..." : "Generate"}
          </button>
        </div>
        <div className="p-4">
          {insight ? (
            <p className="text-slate-300 text-xs leading-relaxed">{insight}</p>
          ) : (
            <p className="text-slate-600 text-xs italic">Click Generate for an AI-powered strategic insight based on your live portfolio data.</p>
          )}
        </div>
      </div>

      {/* Threat Monitor */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radar size={14} className="text-red-400" />
            <span className="text-white font-black text-xs">Active Threats</span>
            {alerts.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-900/40 text-red-400 text-[9px] font-black">{alerts.length}</span>
            )}
          </div>
          <Link to="/monitoring" className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1">
            View all <ArrowRight size={9} />
          </Link>
        </div>
        <div className="divide-y divide-slate-800">
          {alerts.length === 0 ? (
            <p className="text-slate-600 text-xs px-4 py-3 italic">No active threats</p>
          ) : alerts.slice(0, compact ? 3 : 5).map((alert, i) => (
            <div key={i} className="px-4 py-2.5 flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: getRiskColor(alert.risk_level) }} />
              <div className="min-w-0 flex-1">
                <p className="text-slate-200 text-[11px] font-semibold truncate">{alert.title}</p>
                <p className="text-slate-600 text-[10px]">{alert.source_type} · {alert.risk_level?.toUpperCase()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opportunity Engine */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-green-400" />
            <span className="text-white font-black text-xs">Opportunities</span>
            {opportunities.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-green-900/40 text-green-400 text-[9px] font-black">{opportunities.length}</span>
            )}
          </div>
          <Link to="/opportunity-monitor" className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1">
            View all <ArrowRight size={9} />
          </Link>
        </div>
        <div className="divide-y divide-slate-800">
          {opportunities.length === 0 ? (
            <p className="text-slate-600 text-xs px-4 py-3 italic">No active opportunities</p>
          ) : opportunities.slice(0, compact ? 3 : 5).map((opp, i) => (
            <div key={i} className="px-4 py-2.5 flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-green-400" />
              <div className="min-w-0 flex-1">
                <p className="text-slate-200 text-[11px] font-semibold truncate">{opp.title}</p>
                <p className="text-slate-600 text-[10px]">{opp.type} · {opp.impact_level?.toUpperCase()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Inventions */}
      {inventions.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-yellow-400" />
              <span className="text-white font-black text-xs">Latest Inventions</span>
            </div>
            <Link to="/hybrid-portfolio" className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1">
              View all <ArrowRight size={9} />
            </Link>
          </div>
          <div className="divide-y divide-slate-800">
            {inventions.map((inv, i) => (
              <div key={i} className="px-4 py-2.5">
                <p className="text-slate-200 text-[11px] font-semibold leading-snug line-clamp-2">{inv.hybrid_concept}</p>
                {inv.ip_value_low && (
                  <p className="text-green-400 text-[10px] font-bold mt-0.5">${inv.ip_value_low}M–${inv.ip_value_high}M</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}