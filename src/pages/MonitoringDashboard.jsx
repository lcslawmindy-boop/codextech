import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Bell, BellOff, Play, Loader2, CheckCircle2, AlertTriangle, XCircle, Info, Settings, Trash2, Eye, ExternalLink, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";

const CATEGORIES = ["Vacuum Energy", "Scalar EM", "Bioelectromagnetics", "Free Energy", "Resonance Devices", "Phase Conjugation", "Tesla Technology", "Atmospheric EM"];

const RISK_CONFIG = {
  critical: { color: "text-red-400", bg: "bg-red-950/40", border: "border-red-800", label: "CRITICAL", icon: XCircle },
  high:     { color: "text-orange-400", bg: "bg-orange-950/30", border: "border-orange-800", label: "HIGH", icon: AlertTriangle },
  medium:   { color: "text-yellow-400", bg: "bg-yellow-950/20", border: "border-yellow-800", label: "MEDIUM", icon: Info },
  low:      { color: "text-blue-400", bg: "bg-blue-950/20", border: "border-blue-800", label: "LOW", icon: Info },
};

const STATUS_COLORS = {
  new: "bg-red-900/40 text-red-300 border-red-800",
  reviewed: "bg-gray-800 text-gray-400 border-gray-700",
  dismissed: "bg-gray-900 text-gray-600 border-gray-800",
  actioned: "bg-green-900/30 text-green-300 border-green-800",
};

function AlertCard({ alert, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const rc = RISK_CONFIG[alert.risk_level] || RISK_CONFIG.medium;
  const RiskIcon = rc.icon;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${rc.bg} ${rc.border} ${alert.status === "dismissed" ? "opacity-40" : ""}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <RiskIcon size={18} className={`${rc.color} flex-shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-xs font-black px-2 py-0.5 rounded ${rc.color} bg-black/20`}>{rc.label}</span>
                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{alert.source_type}</span>
                <span className="text-xs text-gray-600">{alert.category}</span>
                {alert.risk_score && <span className={`text-xs font-bold ${rc.color}`}>Risk: {alert.risk_score}/100</span>}
              </div>
              <h3 className="text-white font-bold text-sm leading-snug">{alert.title}</h3>
              <p className="text-gray-500 text-xs mt-0.5">{alert.source_name} · {alert.published_date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${STATUS_COLORS[alert.status] || STATUS_COLORS.new}`}>
              {alert.status}
            </span>
          </div>
        </div>

        {alert.suppression_pattern && (
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <Shield size={10} className="text-red-400" />
            <span className="text-red-300 font-semibold">Suppression pattern:</span>
            <span className="text-gray-400">{alert.suppression_pattern}</span>
          </div>
        )}

        <p className="text-gray-400 text-xs leading-relaxed mt-2 line-clamp-2">{alert.summary}</p>

        <div className="flex items-center justify-between mt-3">
          <button onClick={() => setExpanded(x => !x)} className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-300 transition-colors">
            {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            {expanded ? "Less" : "Full details & actions"}
          </button>
          <div className="flex items-center gap-1.5">
            {alert.source_url && (
              <a href={alert.source_url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                <ExternalLink size={10} /> Source
              </a>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-700/50 pt-3 space-y-3">
          {alert.recommended_action && (
            <div className="bg-green-950/30 border border-green-900/40 rounded-lg p-3">
              <p className="text-green-400 font-bold text-xs mb-1">✅ Recommended Action</p>
              <p className="text-gray-300 text-xs leading-relaxed">{alert.recommended_action}</p>
            </div>
          )}
          {(alert.matched_keywords || []).length > 0 && (
            <div>
              <p className="text-gray-500 text-xs font-bold mb-1">Matched Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {alert.matched_keywords.map((kw, i) => (
                  <span key={i} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{kw}</span>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            {alert.status === "new" && (
              <>
                <button onClick={() => onStatusChange(alert.id, "reviewed")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/30 border border-blue-800 text-blue-300 text-xs font-bold hover:bg-blue-900/50 transition-all">
                  <Eye size={11} /> Mark Reviewed
                </button>
                <button onClick={() => onStatusChange(alert.id, "actioned")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/30 border border-green-800 text-green-300 text-xs font-bold hover:bg-green-900/50 transition-all">
                  <CheckCircle2 size={11} /> Actioned
                </button>
              </>
            )}
            {alert.status !== "dismissed" && (
              <button onClick={() => onStatusChange(alert.id, "dismissed")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-500 text-xs hover:text-gray-300 transition-all">
                <Trash2 size={11} /> Dismiss
              </button>
            )}
            {alert.status === "dismissed" && (
              <button onClick={() => onStatusChange(alert.id, "new")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 text-xs hover:text-gray-200 transition-all">
                <RefreshCw size={11} /> Restore
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ConfigPanel({ config, onSave, onClose }) {
  const [form, setForm] = useState({
    watch_categories: config?.watch_categories || [...CATEGORIES],
    custom_keywords: (config?.custom_keywords || []).join(", "),
    suppression_sensitivity: config?.suppression_sensitivity || "medium",
    email_alerts: config?.email_alerts !== false,
    min_risk_for_email: config?.min_risk_for_email || "high",
  });
  const [saving, setSaving] = useState(false);

  const toggleCat = (cat) => setForm(f => ({
    ...f,
    watch_categories: f.watch_categories.includes(cat) ? f.watch_categories.filter(c => c !== cat) : [...f.watch_categories, cat]
  }));

  const handleSave = async () => {
    setSaving(true);
    const data = {
      ...form,
      custom_keywords: form.custom_keywords.split(",").map(k => k.trim()).filter(Boolean),
    };
    await onSave(data);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-white font-bold flex items-center gap-2"><Settings size={16} /> Monitoring Configuration</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">×</button>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">Watch Categories</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => toggleCat(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${form.watch_categories.includes(cat) ? "bg-blue-900/40 border-blue-600 text-blue-300" : "border-gray-700 text-gray-500 hover:border-gray-500"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-bold uppercase tracking-wide block mb-1">Custom Keywords</label>
            <input value={form.custom_keywords} onChange={e => setForm(f => ({ ...f, custom_keywords: e.target.value }))}
              placeholder="toroid capacitor, phase conjugate mirror, Bedini..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500" />
            <p className="text-gray-600 text-xs mt-1">Comma-separated. These terms are added to every scan.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wide block mb-1">Sensitivity</label>
              <select value={form.suppression_sensitivity} onChange={e => setForm(f => ({ ...f, suppression_sensitivity: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                <option value="low">Low — only confirmed suppression</option>
                <option value="medium">Medium — likely patterns</option>
                <option value="high">High — any related activity</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold uppercase tracking-wide block mb-1">Email Alerts From</label>
              <select value={form.min_risk_for_email} onChange={e => setForm(f => ({ ...f, min_risk_for_email: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                <option value="critical">Critical only</option>
                <option value="high">High + Critical</option>
                <option value="medium">Medium and above</option>
                <option value="low">All alerts</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setForm(f => ({ ...f, email_alerts: !f.email_alerts }))}
              className={`w-10 h-5 rounded-full relative transition-colors ${form.email_alerts ? "bg-green-600" : "bg-gray-700"}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.email_alerts ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-gray-300 text-sm">Email notifications enabled</span>
          </label>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-800">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-xs hover:border-gray-500 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold disabled:opacity-50 transition-all">
              {saving ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
              {saving ? "Saving…" : "Save Configuration"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MonitoringDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("new");
  const [tab, setTab] = useState("alerts"); // alerts | config

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [alertsData, user] = await Promise.all([
      base44.entities.MonitoringAlert.list("-created_date", 100),
      base44.auth.me(),
    ]);
    setAlerts(alertsData);

    if (user) {
      const configs = await base44.entities.MonitoringConfig.filter({ user_email: user.email });
      if (configs.length > 0) {
        setConfig(configs[0]);
      } else {
        // Auto-create default config
        const newConfig = await base44.entities.MonitoringConfig.create({
          user_email: user.email,
          watch_categories: [...CATEGORIES],
          custom_keywords: [],
          suppression_sensitivity: "medium",
          email_alerts: true,
          min_risk_for_email: "high",
          is_active: true,
        });
        setConfig(newConfig);
      }
    }
    setLoading(false);
  };

  const handleSaveConfig = async (data) => {
    if (config) {
      const updated = await base44.entities.MonitoringConfig.update(config.id, data);
      setConfig({ ...config, ...data });
    }
  };

  const handleScan = async () => {
    setScanning(true);
    setScanResult(null);
    const res = await base44.functions.invoke("patentMonitor", { manual: true });
    setScanResult(res.data);
    setScanning(false);
    // Reload alerts
    const updated = await base44.entities.MonitoringAlert.list("-created_date", 100);
    setAlerts(updated);
  };

  const handleStatusChange = async (id, status) => {
    await base44.entities.MonitoringAlert.update(id, { status });
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const filtered = alerts.filter(a => {
    const matchRisk = riskFilter === "all" || a.risk_level === riskFilter;
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchRisk && matchStatus;
  });

  const stats = {
    critical: alerts.filter(a => a.risk_level === "critical" && a.status === "new").length,
    high: alerts.filter(a => a.risk_level === "high" && a.status === "new").length,
    total: alerts.filter(a => a.status === "new").length,
    actioned: alerts.filter(a => a.status === "actioned").length,
  };

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base tracking-tight flex items-center gap-2">
              <Shield size={16} className="text-blue-400" /> Patent Threat Monitor
            </h1>
            <p className="text-gray-500 text-xs">Automated scanning for suppression patterns · patent filings · legal challenges</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowConfig(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 text-xs hover:border-gray-500 transition-colors">
            <Settings size={12} /> Configure
          </button>
          <button onClick={handleScan} disabled={scanning}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold disabled:opacity-60 transition-all">
            {scanning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
            {scanning ? "Scanning…" : "Run Scan Now"}
          </button>
        </div>
      </div>

      {/* Scan result banner */}
      {scanResult && (
        <div className={`px-5 py-2 border-b flex items-center gap-3 text-xs ${scanResult.alerts_created > 0 ? "bg-orange-950/30 border-orange-900/30" : "bg-green-950/30 border-green-900/30"}`}>
          {scanResult.alerts_created > 0
            ? <AlertTriangle size={13} className="text-orange-400" />
            : <CheckCircle2 size={13} className="text-green-400" />}
          <span className={scanResult.alerts_created > 0 ? "text-orange-300" : "text-green-300"}>
            Scan complete — {scanResult.alerts_created} new alerts ({scanResult.high_critical} high/critical) · {scanResult.categories_scanned} categories scanned · Run ID: {scanResult.scan_run_id}
          </span>
        </div>
      )}

      {/* Stats row */}
      <div className="px-5 py-3 border-b border-gray-800 flex items-center gap-4 flex-wrap text-xs">
        {[
          { label: "New Alerts", value: stats.total, color: "text-white" },
          { label: "Critical", value: stats.critical, color: "text-red-400" },
          { label: "High", value: stats.high, color: "text-orange-400" },
          { label: "Actioned", value: stats.actioned, color: "text-green-400" },
          { label: "Monitoring", value: `${config?.watch_categories?.length || 0} categories`, color: "text-blue-400" },
          ...(config?.last_scan ? [{ label: "Last scan", value: new Date(config.last_scan).toLocaleDateString(), color: "text-gray-500" }] : []),
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="text-gray-600">{label}:</span>
            <span className={`font-bold ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="px-5 py-2 border-b border-gray-800 flex items-center gap-4 flex-wrap text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-600">Risk:</span>
          {["all","critical","high","medium","low"].map(r => (
            <button key={r} onClick={() => setRiskFilter(r)}
              className={`px-2.5 py-1 rounded-full border transition-all capitalize ${riskFilter === r ? "bg-gray-700 border-gray-500 text-white font-bold" : "border-gray-700 text-gray-500 hover:border-gray-500"}`}>
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-600">Status:</span>
          {["all","new","reviewed","actioned","dismissed"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-full border transition-all capitalize ${statusFilter === s ? "bg-gray-700 border-gray-500 text-white font-bold" : "border-gray-700 text-gray-500 hover:border-gray-500"}`}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={loadData} className="flex items-center gap-1 text-gray-600 hover:text-gray-300 transition-colors ml-auto">
          <RefreshCw size={11} /> Refresh
        </button>
      </div>

      {/* Alert list */}
      <div className="flex-1 overflow-y-auto p-5">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-gray-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">🛡</div>
            <h2 className="text-white font-bold text-lg mb-2">
              {alerts.length === 0 ? "No alerts yet — run your first scan" : "No alerts match these filters"}
            </h2>
            <p className="text-gray-500 text-sm max-w-md mb-5">
              {alerts.length === 0
                ? "Click 'Run Scan Now' to search the web for patent threats, legal challenges, and suppression patterns matching your watched categories."
                : "Try adjusting the risk or status filters above."}
            </p>
            {alerts.length === 0 && (
              <button onClick={handleScan} disabled={scanning}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-sm transition-all">
                {scanning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                {scanning ? "Scanning…" : "Run First Scan"}
              </button>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-3">
            <p className="text-gray-600 text-xs mb-3">{filtered.length} alert{filtered.length !== 1 ? "s" : ""} shown</p>
            {filtered.map(alert => (
              <AlertCard key={alert.id} alert={alert} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </div>

      {showConfig && config && (
        <ConfigPanel config={config} onSave={handleSaveConfig} onClose={() => setShowConfig(false)} />
      )}
    </div>
  );
}