import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bell, BellOff, Zap, TrendingUp, Shield, AlertTriangle, CheckCircle, X, RefreshCw, Plus, Trash2, Mail, Eye, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const DOMAINS = [
  "Vacuum Energy Extraction", "Scalar Wave Communication", "Bioelectromagnetics / Healing",
  "Time-Reversal Zone Physics", "Psychoenergetics / Consciousness", "EMF Shielding / Protection",
  "Novel Materials / Resonators", "Scalar Agriculture / BioField"
];
const ALERT_TYPES = ["Market Trend", "Prior Art Update", "Patent Filing", "Competitor Activity", "Regulatory Change"];
const IMPACT_COLORS = { critical: "#ff4444", high: "#ff8800", medium: "#f59e0b", low: "#6b7280" };
const IMPACT_BG = { critical: "bg-red-950/40 border-red-800", high: "bg-orange-950/40 border-orange-800", medium: "bg-yellow-950/30 border-yellow-800", low: "bg-gray-900 border-gray-700" };
const TYPE_ICONS = {
  "Market Trend": <TrendingUp size={12} />,
  "Prior Art Update": <Shield size={12} />,
  "Patent Filing": <AlertTriangle size={12} />,
  "Competitor Activity": <Zap size={12} />,
  "Regulatory Change": <Bell size={12} />
};

function AlertCard({ alert, onDismiss, onMarkRead }) {
  const [expanded, setExpanded] = useState(false);
  const color = IMPACT_COLORS[alert.impact_level] || "#6b7280";

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${IMPACT_BG[alert.impact_level]} ${!alert.read ? 'ring-1 ring-inset' : ''}`}
      style={!alert.read ? { '--tw-ring-color': color + '44' } : {}}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-lg" style={{ backgroundColor: color + '22', color }}>
            {TYPE_ICONS[alert.type] || <Bell size={12} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider" style={{ color }}>{alert.impact_level}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">{alert.type}</span>
              {!alert.read && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-900/60 border border-blue-700 text-blue-300 font-bold">NEW</span>}
              {alert.email_sent && <span className="flex items-center gap-1 text-xs text-gray-600"><Mail size={10} /> Emailed</span>}
            </div>
            <h3 className="text-white font-bold text-sm leading-snug">{alert.title}</h3>
            <p className="text-gray-500 text-xs mt-0.5">Invention: <span className="text-gray-400">{alert.invention_name}</span></p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {!alert.read && (
              <button onClick={() => onMarkRead(alert.id)} className="text-gray-600 hover:text-blue-400 p-1 transition-colors" title="Mark read">
                <Eye size={14} />
              </button>
            )}
            <button onClick={() => setExpanded(e => !e)} className="text-gray-600 hover:text-white p-1 transition-colors">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <button onClick={() => onDismiss(alert.id)} className="text-gray-600 hover:text-red-400 p-1 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 space-y-3 pl-9">
            <p className="text-gray-300 text-sm leading-relaxed">{alert.summary}</p>
            <div className="bg-green-950/30 border border-green-900/40 rounded-lg p-3">
              <p className="text-green-400 text-xs font-bold mb-1">▶ Recommended Action</p>
              <p className="text-green-200 text-xs">{alert.recommended_action}</p>
            </div>
            {alert.source_name && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-xs">Source:</span>
                {alert.source_url ? (
                  <a href={alert.source_url} target="_blank" rel="noopener noreferrer"
                    className="text-blue-400 text-xs hover:underline">{alert.source_name} ↗</a>
                ) : (
                  <span className="text-gray-500 text-xs">{alert.source_name}</span>
                )}
              </div>
            )}
            <p className="text-gray-700 text-xs">{new Date(alert.created_date).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OpportunityMonitor() {
  const [alerts, setAlerts] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [tab, setTab] = useState("alerts");
  const [filterImpact, setFilterImpact] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [inventionInput, setInventionInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    init();
    // Real-time subscription to new alerts
    const unsub = base44.entities.OpportunityAlert.subscribe((event) => {
      if (event.type === 'create') setAlerts(prev => [event.data, ...prev]);
      if (event.type === 'update') setAlerts(prev => prev.map(a => a.id === event.id ? event.data : a));
      if (event.type === 'delete') setAlerts(prev => prev.filter(a => a.id !== event.id));
    });
    return () => unsub();
  }, []);

  const init = async () => {
    setLoading(true);
    const me = await base44.auth.me();
    setUser(me);
    const [alertData, subData] = await Promise.all([
      base44.entities.OpportunityAlert.filter({ user_email: me.email, dismissed: false }, '-created_date', 50),
      base44.entities.OpportunitySubscription.filter({ user_email: me.email })
    ]);
    setAlerts(alertData);
    if (subData.length > 0) {
      setSubscription(subData[0]);
    } else {
      // Create default subscription
      const newSub = await base44.entities.OpportunitySubscription.create({
        user_email: me.email,
        invention_names: [],
        technology_domains: ["Vacuum Energy Extraction", "Bioelectromagnetics / Healing"],
        alert_types: ["Market Trend", "Prior Art Update", "Patent Filing"],
        min_impact_level: "medium",
        email_alerts: true,
        is_active: true
      });
      setSubscription(newSub);
    }
    setLoading(false);
  };

  const runScan = async () => {
    setScanning(true);
    await base44.functions.invoke('opportunityMonitor', { scheduled: false });
    const alertData = await base44.entities.OpportunityAlert.filter({ user_email: user.email, dismissed: false }, '-created_date', 50);
    setAlerts(alertData);
    setScanning(false);
  };

  const dismissAlert = async (id) => {
    await base44.entities.OpportunityAlert.update(id, { dismissed: true });
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const markRead = async (id) => {
    await base44.entities.OpportunityAlert.update(id, { read: true });
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllRead = async () => {
    const unread = alerts.filter(a => !a.read);
    await Promise.all(unread.map(a => base44.entities.OpportunityAlert.update(a.id, { read: true })));
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const saveSubscription = async () => {
    setSaving(true);
    await base44.entities.OpportunitySubscription.update(subscription.id, subscription);
    setSaving(false);
  };

  const addInvention = () => {
    if (!inventionInput.trim()) return;
    setSubscription(s => ({ ...s, invention_names: [...(s.invention_names || []), inventionInput.trim()] }));
    setInventionInput("");
  };

  const removeInvention = (name) => {
    setSubscription(s => ({ ...s, invention_names: s.invention_names.filter(n => n !== name) }));
  };

  const toggleDomain = (d) => {
    setSubscription(s => ({
      ...s,
      technology_domains: s.technology_domains?.includes(d)
        ? s.technology_domains.filter(x => x !== d)
        : [...(s.technology_domains || []), d]
    }));
  };

  const toggleAlertType = (t) => {
    setSubscription(s => ({
      ...s,
      alert_types: s.alert_types?.includes(t)
        ? s.alert_types.filter(x => x !== t)
        : [...(s.alert_types || []), t]
    }));
  };

  const filtered = alerts.filter(a => {
    if (filterImpact !== "all" && a.impact_level !== filterImpact) return false;
    if (filterType !== "all" && a.type !== filterType) return false;
    return true;
  });

  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => a.impact_level === 'critical' && !a.read).length;

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-400" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <Bell size={15} className="text-blue-400" /> Opportunity Monitor
              {unreadCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-700 text-white font-bold">{unreadCount}</span>
              )}
              {criticalCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-700 text-white font-bold animate-pulse">🔴 {criticalCount} critical</span>
              )}
            </h1>
            <p className="text-gray-500 text-xs">Real-time market & patent intelligence for your invention portfolio</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={runScan} disabled={scanning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-60">
            {scanning ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            {scanning ? "Scanning…" : "Run Scan Now"}
          </button>
          {subscription && (
            <button onClick={() => setSubscription(s => ({ ...s, is_active: !s.is_active }))}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${subscription.is_active ? 'bg-green-900/40 border-green-700 text-green-300' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
              {subscription.is_active ? <Bell size={12} /> : <BellOff size={12} />}
              {subscription.is_active ? "Active" : "Paused"}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row flex-1">
        {/* Sidebar — Subscription Config */}
        <div className="xl:w-80 flex-shrink-0 border-b xl:border-b-0 xl:border-r border-gray-800 p-5 space-y-5 bg-gray-900/30">
          <div>
            <p className="text-white font-bold text-sm mb-3">Monitored Inventions</p>
            <div className="flex gap-2 mb-2">
              <input value={inventionInput} onChange={e => setInventionInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addInvention()}
                placeholder="Add invention name…"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-xs outline-none focus:border-blue-500" />
              <button onClick={addInvention} className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs">
                <Plus size={12} />
              </button>
            </div>
            <div className="space-y-1.5">
              {(subscription?.invention_names || []).length === 0 && (
                <p className="text-gray-600 text-xs italic">No inventions added — AI will scan based on domains below</p>
              )}
              {(subscription?.invention_names || []).map((name, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-1.5">
                  <span className="text-gray-300 text-xs">{name}</span>
                  <button onClick={() => removeInvention(name)} className="text-gray-600 hover:text-red-400 transition-colors">
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white font-bold text-sm mb-2">Technology Domains</p>
            <div className="space-y-1.5">
              {DOMAINS.map(d => (
                <button key={d} onClick={() => toggleDomain(d)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs border transition-all ${subscription?.technology_domains?.includes(d) ? 'bg-blue-950/50 border-blue-700 text-blue-200' : 'border-gray-800 text-gray-500 hover:border-gray-600'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white font-bold text-sm mb-2">Alert Types</p>
            <div className="flex flex-wrap gap-2">
              {ALERT_TYPES.map(t => (
                <button key={t} onClick={() => toggleAlertType(t)}
                  className={`px-2 py-1 rounded-lg text-xs border transition-all ${subscription?.alert_types?.includes(t) ? 'bg-purple-950/50 border-purple-700 text-purple-300' : 'border-gray-800 text-gray-600 hover:border-gray-600'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white font-bold text-sm mb-2">Minimum Impact for Email</p>
            <div className="flex gap-2">
              {['low', 'medium', 'high', 'critical'].map(lvl => (
                <button key={lvl} onClick={() => setSubscription(s => ({ ...s, min_impact_level: lvl }))}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border capitalize transition-all ${subscription?.min_impact_level === lvl ? '' : 'border-gray-800 text-gray-600'}`}
                  style={subscription?.min_impact_level === lvl ? { backgroundColor: IMPACT_COLORS[lvl] + '22', borderColor: IMPACT_COLORS[lvl] + '66', color: IMPACT_COLORS[lvl] } : {}}>
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-gray-800">
            <span className="text-gray-400 text-xs">Email Alerts</span>
            <button onClick={() => setSubscription(s => ({ ...s, email_alerts: !s.email_alerts }))}
              className={`w-10 h-5 rounded-full transition-all relative ${subscription?.email_alerts ? 'bg-green-600' : 'bg-gray-700'}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${subscription?.email_alerts ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>

          <button onClick={saveSubscription} disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 text-white font-black text-sm disabled:opacity-60 transition-all">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            {saving ? "Saving…" : "Save Settings"}
          </button>

          {subscription?.last_scan && (
            <p className="text-gray-700 text-xs text-center">Last scan: {new Date(subscription.last_scan).toLocaleString()}</p>
          )}
        </div>

        {/* Main — Alerts Feed */}
        <div className="flex-1 p-5 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { label: "Total Alerts", value: alerts.length, color: "#6080ff" },
              { label: "Unread", value: unreadCount, color: "#f59e0b" },
              { label: "Critical", value: alerts.filter(a => a.impact_level === 'critical').length, color: "#ff4444" },
              { label: "Emails Sent", value: alerts.filter(a => a.email_sent).length, color: "#22c55e" },
            ].map((s, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <p className="font-black text-2xl" style={{ color: s.color }}>{s.value}</p>
                <p className="text-gray-500 text-xs">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters + actions */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <select value={filterImpact} onChange={e => setFilterImpact(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-xs outline-none">
              <option value="all">All Impact Levels</option>
              {['critical','high','medium','low'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-xs outline-none">
              <option value="all">All Types</option>
              {ALERT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="flex-1" />
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 transition-all">
                <Eye size={11} className="inline mr-1" />Mark all read
              </button>
            )}
          </div>

          {/* Alert cards */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Bell size={40} className="text-gray-700 mb-4" />
              <h2 className="text-white font-bold text-lg mb-2">No Alerts Yet</h2>
              <p className="text-gray-500 text-sm max-w-sm">Configure your invention portfolio and click <strong className="text-white">Run Scan Now</strong> to get your first opportunity intelligence report.</p>
              <p className="text-gray-700 text-xs mt-3">Automated scans run daily. Email alerts sent for high/critical findings.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(alert => (
                <AlertCard key={alert.id} alert={alert} onDismiss={dismissAlert} onMarkRead={markRead} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}