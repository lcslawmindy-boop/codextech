import { useState } from "react";
import { Bell, Plus, Trash2, CheckCircle2, AlertTriangle, XCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { formatDistanceToNow } from "date-fns";

const SEVERITY_STYLES = {
  info: { bg: "bg-blue-900/30 border-blue-700", icon: <Bell size={13} className="text-blue-400" />, label: "text-blue-300" },
  warning: { bg: "bg-yellow-900/30 border-yellow-700", icon: <AlertTriangle size={13} className="text-yellow-400" />, label: "text-yellow-300" },
  critical: { bg: "bg-red-900/30 border-red-700", icon: <XCircle size={13} className="text-red-400" />, label: "text-red-300" },
};

function AlertRow({ alert, onToggle, onDelete, onAck }) {
  const s = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.warning;
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${s.bg} ${!alert.enabled ? "opacity-50" : ""}`}>
      {s.icon}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-bold ${s.label}`}>
          {alert.channel_label || alert.channel} {alert.condition} {alert.threshold} {alert.unit || ""}
        </p>
        {alert.message && <p className="text-gray-500 text-xs mt-0.5">{alert.message}</p>}
        {alert.triggered_at && (
          <p className="text-xs text-gray-600 mt-1">
            Last triggered {formatDistanceToNow(new Date(alert.triggered_at), { addSuffix: true })} — value: {alert.triggered_value}
            {!alert.acknowledged && (
              <button onClick={() => onAck(alert)} className="ml-2 text-cyan-500 hover:text-cyan-300 font-bold underline">
                Acknowledge
              </button>
            )}
            {alert.acknowledged && <span className="ml-2 text-green-600 font-bold">✓ Ack'd</span>}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={() => onToggle(alert)} title={alert.enabled ? "Disable" : "Enable"}>
          {alert.enabled
            ? <ToggleRight size={16} className="text-cyan-400" />
            : <ToggleLeft size={16} className="text-gray-600" />}
        </button>
        <button onClick={() => onDelete(alert)} className="text-gray-700 hover:text-red-400 transition-colors">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export default function AlertsPanel({ device, alerts, onAlertsChange }) {
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ channel: "", channel_label: "", condition: "above", threshold: "", unit: "", message: "", severity: "warning" });
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!form.channel || form.threshold === "") return;
    setSaving(true);
    await base44.entities.TelemetryAlert.create({
      user_email: device.user_email,
      device_id: device.device_id,
      device_name: device.name,
      channel: form.channel,
      channel_label: form.channel_label || form.channel,
      condition: form.condition,
      threshold: parseFloat(form.threshold),
      unit: form.unit,
      message: form.message,
      severity: form.severity,
      enabled: true,
    });
    setSaving(false);
    setCreating(false);
    setForm({ channel: "", channel_label: "", condition: "above", threshold: "", unit: "", message: "", severity: "warning" });
    onAlertsChange();
  };

  const handleToggle = async (alert) => {
    await base44.entities.TelemetryAlert.update(alert.id, { enabled: !alert.enabled });
    onAlertsChange();
  };

  const handleDelete = async (alert) => {
    await base44.entities.TelemetryAlert.delete(alert.id);
    onAlertsChange();
  };

  const handleAck = async (alert) => {
    await base44.entities.TelemetryAlert.update(alert.id, { acknowledged: true });
    onAlertsChange();
  };

  const deviceAlerts = alerts.filter(a => a.device_id === device?.device_id);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Bell size={12} /> Threshold Alerts ({deviceAlerts.length})
        </p>
        <button
          onClick={() => setCreating(c => !c)}
          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-bold"
        >
          <Plus size={12} /> Add Alert
        </button>
      </div>

      {creating && (
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 mb-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Channel key (e.g. voltage)"
              value={form.channel}
              onChange={e => setForm(f => ({ ...f, channel: e.target.value }))}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 col-span-2"
            />
            <input
              placeholder="Label (e.g. Input Voltage)"
              value={form.channel_label}
              onChange={e => setForm(f => ({ ...f, channel_label: e.target.value }))}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600"
            />
            <input
              placeholder="Unit (e.g. V, T, A)"
              value={form.unit}
              onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600"
            />
            <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white">
              <option value="above">Above</option>
              <option value="below">Below</option>
              <option value="equals">Equals</option>
            </select>
            <input
              type="number"
              placeholder="Threshold value"
              value={form.threshold}
              onChange={e => setForm(f => ({ ...f, threshold: e.target.value }))}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600"
            />
            <select value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white col-span-2">
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
            <input
              placeholder="Custom message (optional)"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 col-span-2"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={handleCreate} disabled={saving}
              className="px-3 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold transition-all disabled:opacity-50">
              {saving ? "Saving…" : "Create Alert"}
            </button>
            <button onClick={() => setCreating(false)} className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 text-xs hover:text-white">
              Cancel
            </button>
          </div>
        </div>
      )}

      {deviceAlerts.length === 0 && !creating ? (
        <p className="text-gray-700 text-xs py-4 text-center">No alerts configured. Add one to get notified when readings exceed thresholds.</p>
      ) : (
        <div className="space-y-2">
          {deviceAlerts.map(alert => (
            <AlertRow key={alert.id} alert={alert} onToggle={handleToggle} onDelete={handleDelete} onAck={handleAck} />
          ))}
        </div>
      )}
    </div>
  );
}