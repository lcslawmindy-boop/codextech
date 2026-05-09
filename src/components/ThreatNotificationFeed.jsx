import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { AlertCircle, TrendingUp, FileText, Clock, AlertTriangle, CheckCircle2, X } from "lucide-react";

export default function ThreatNotificationFeed() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, critical, high, medium, low
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    // Initial load
    fetchAlerts();

    // Subscribe to real-time updates
    const unsubscribe = base44.entities.MonitoringAlert.subscribe((event) => {
      if (event.type === "create" || event.type === "update") {
        fetchAlerts();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAlerts = async () => {
    try {
      const data = await base44.entities.MonitoringAlert.list();
      const sorted = (data || [])
        .filter(a => a.status !== "dismissed")
        .sort((a, b) => {
          const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return (riskOrder[a.risk_level] || 3) - (riskOrder[b.risk_level] || 3);
        });
      setAlerts(sorted);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDismiss = async (alertId) => {
    await base44.entities.MonitoringAlert.update(alertId, { status: "dismissed" });
    setDismissed(prev => new Set([...prev, alertId]));
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleMarkReviewed = async (alertId) => {
    await base44.entities.MonitoringAlert.update(alertId, { status: "reviewed" });
    fetchAlerts();
  };

  const filteredAlerts = filter === "all" ? alerts : alerts.filter(a => a.risk_level === filter);

  const riskColors = {
    critical: { bg: "bg-red-950/40", border: "border-red-700/50", text: "text-red-400", icon: "🔴" },
    high: { bg: "bg-orange-950/40", border: "border-orange-700/50", text: "text-orange-400", icon: "🟠" },
    medium: { bg: "bg-yellow-950/40", border: "border-yellow-700/50", text: "text-yellow-400", icon: "🟡" },
    low: { bg: "bg-blue-950/40", border: "border-blue-700/50", text: "text-blue-400", icon: "🔵" }
  };

  const sourceIcons = {
    "Patent Filing": "📄",
    "Legal Challenge": "⚖️",
    "News": "📰",
    "Regulatory Action": "📋",
    "Academic Publication": "🎓",
    "Corporate Activity": "🏢"
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-400 font-semibold uppercase">Filter:</span>
        {["all", "critical", "high", "medium", "low"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              filter === f
                ? "bg-cyan-500/30 border border-cyan-500/50 text-cyan-300"
                : "bg-slate-800/40 border border-slate-700 text-slate-400 hover:border-slate-600"
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-slate-400">Loading alerts...</div>
        ) : filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <CheckCircle2 size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No {filter !== "all" ? filter : ""} threats detected</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const colors = riskColors[alert.risk_level] || riskColors.low;
            return (
              <div key={alert.id} className={`${colors.bg} border ${colors.border} rounded-lg p-4 relative overflow-hidden group`}>
                {/* Animated gradient accent */}
                <div className="absolute top-0 left-0 h-full w-1 " style={{
                  background: alert.risk_level === "critical" ? "#dc2626" : alert.risk_level === "high" ? "#f97316" : alert.risk_level === "medium" ? "#eab308" : "#3b82f6"
                }} />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      <span className="text-lg flex-shrink-0 mt-0.5">{colors.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-white font-bold text-sm leading-snug">{alert.title}</h3>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${colors.text}`}>
                            {alert.risk_level}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                          {sourceIcons[alert.source_type] || "🔗"} {alert.source_type} • {alert.source_name}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => handleDismiss(alert.id)}
                      className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors p-1">
                      <X size={16} />
                    </button>
                  </div>

                  {/* Summary */}
                  {alert.summary && (
                    <p className="text-slate-300 text-xs leading-relaxed mb-3 line-clamp-2">{alert.summary}</p>
                  )}

                  {/* Keywords & Suppression Pattern */}
                  <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                    {alert.matched_keywords?.length > 0 && (
                      <div>
                        <p className="text-slate-500 font-semibold uppercase tracking-wider mb-1">Keywords</p>
                        <div className="flex flex-wrap gap-1">
                          {alert.matched_keywords.slice(0, 3).map((kw, i) => (
                            <span key={i} className="bg-slate-800/60 px-2 py-0.5 rounded text-slate-300">{kw}</span>
                          ))}
                          {alert.matched_keywords.length > 3 && (
                            <span className="text-slate-500 text-xs">+{alert.matched_keywords.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}
                    {alert.suppression_pattern && (
                      <div>
                        <p className="text-slate-500 font-semibold uppercase tracking-wider mb-1">Pattern</p>
                        <p className="text-orange-400 font-bold">{alert.suppression_pattern}</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <p className="text-slate-500 text-xs flex items-center gap-1">
                      <Clock size={12} /> {new Date(alert.published_date || alert.created_date).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2">
                      {alert.source_url && (
                        <a href={alert.source_url} target="_blank" rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 text-xs font-bold flex items-center gap-1 transition-colors">
                          View Source <TrendingUp size={12} />
                        </a>
                      )}
                      {alert.status === "new" && (
                        <button onClick={() => handleMarkReviewed(alert.id)}
                          className="text-slate-400 hover:text-slate-200 text-xs font-bold uppercase tracking-wider transition-colors">
                          Mark Reviewed
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Recommended Action */}
                  {alert.recommended_action && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Action</p>
                      <p className="text-slate-300 text-xs">{alert.recommended_action}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Info Box */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-3 text-xs text-slate-400">
        <p className="flex items-center gap-2 mb-1">
          <AlertTriangle size={12} className="text-yellow-500" /> Real-time threat monitoring active
        </p>
        <p>Alerts are pulled from patent filings, news, regulatory actions, and competitive intelligence feeds. Click "View Source" to investigate further.</p>
      </div>
    </div>
  );
}