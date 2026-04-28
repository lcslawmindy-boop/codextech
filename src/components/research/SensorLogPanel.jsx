import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import PullToRefreshIndicator from "@/components/PullToRefreshIndicator";

const CHANNELS = ["CH1", "CH2", "PMT-A", "PMT-B", "Main", "Control", "Reference"];
const CHANNEL_COLORS = {
  "CH1": "#06b6d4", "CH2": "#22c55e", "PMT-A": "#a855f7", "PMT-B": "#f59e0b",
  "Main": "#3b82f6", "Control": "#ef4444", "Reference": "#94a3b8"
};

export default function SensorLogPanel({ experiment }) {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ value: "", channel: "CH1", notes: "", step_label: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await base44.entities.SensorReading.filter(
      { experiment_id: experiment.id },
      "timestamp",
      500
    );
    setReadings(data || []);
    setLoading(false);
  }, [experiment.id]);

  useEffect(() => { load(); }, [load]);

  const { containerRef, pullY, refreshing } = usePullToRefresh(load);

  const handleAdd = async () => {
    if (!form.value) return;
    // Optimistic insert
    const optimisticReading = {
      id: `opt-${Date.now()}`,
      experiment_id: experiment.id,
      timestamp: new Date().toISOString(),
      value: parseFloat(form.value),
      unit: experiment.sensor_unit || "",
      channel: form.channel,
      notes: form.notes,
      step_label: form.step_label,
      _optimistic: true,
    };
    setReadings(r => [...r, optimisticReading]);
    setForm({ value: "", channel: form.channel, notes: "", step_label: form.step_label });
    setSaving(true);
    try {
      const created = await base44.entities.SensorReading.create({
        experiment_id: experiment.id,
        timestamp: optimisticReading.timestamp,
        value: optimisticReading.value,
        unit: optimisticReading.unit,
        channel: optimisticReading.channel,
        notes: optimisticReading.notes,
        step_label: optimisticReading.step_label,
      });
      // Replace optimistic entry with real one
      setReadings(r => r.map(x => x.id === optimisticReading.id ? created : x));
    } catch {
      // Rollback on failure
      setReadings(r => r.filter(x => x.id !== optimisticReading.id));
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    // Optimistic remove
    setReadings(r => r.filter(x => x.id !== id));
    try {
      await base44.entities.SensorReading.delete(id);
    } catch {
      // Rollback — re-fetch on failure
      load();
    }
  };

  // Build chart data — group by timestamp bucketed per minute
  const channels = [...new Set(readings.map(r => r.channel || "Main"))];
  const chartData = readings.reduce((acc, r) => {
    const label = format(new Date(r.timestamp), "HH:mm:ss");
    const existing = acc.find(a => a.time === label);
    if (existing) { existing[r.channel || "Main"] = r.value; }
    else { acc.push({ time: label, [r.channel || "Main"]: r.value }); }
    return acc;
  }, []).slice(-60); // last 60 points

  const stats = channels.map(ch => {
    const vals = readings.filter(r => (r.channel || "Main") === ch).map(r => r.value);
    if (!vals.length) return null;
    return {
      ch,
      min: Math.min(...vals).toFixed(3),
      max: Math.max(...vals).toFixed(3),
      avg: (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(3),
      count: vals.length,
    };
  }).filter(Boolean);

  return (
    <div className="space-y-4 relative" ref={containerRef}>
      <PullToRefreshIndicator pullY={pullY} refreshing={refreshing} />
      {/* Log input */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <p className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-3">Log New Reading</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Value *</label>
            <input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
              placeholder="0.000"
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Channel</label>
            <select value={form.channel} onChange={e => setForm(f => ({ ...f, channel: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-cyan-500">
              {CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Step / Phase</label>
            <input value={form.step_label} onChange={e => setForm(f => ({ ...f, step_label: e.target.value }))}
              placeholder="e.g. Step 3"
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Notes</label>
            <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Optional"
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500" />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleAdd} disabled={saving || !form.value}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold disabled:opacity-50 transition-colors">
            <Plus size={13} /> {saving ? "Logging…" : "Log Reading"}
          </button>
          <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm transition-colors">
            Refresh
          </button>
          <span className="ml-auto text-xs text-gray-600 self-center">{readings.length} readings · {experiment.sensor_unit || "—"}</span>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-3">Live Chart</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} width={55} tickFormatter={v => v.toFixed(2)} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 8 }}
                labelStyle={{ color: "#9ca3af", fontSize: 11 }} itemStyle={{ fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {channels.map(ch => (
                <Line key={ch} type="monotone" dataKey={ch} stroke={CHANNEL_COLORS[ch] || "#06b6d4"}
                  dot={false} strokeWidth={1.5} connectNulls />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.ch} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
              <p className="text-xs font-bold mb-1" style={{ color: CHANNEL_COLORS[s.ch] || "#06b6d4" }}>{s.ch}</p>
              <p className="text-white text-base font-black">{s.avg}</p>
              <p className="text-gray-600 text-xs mt-0.5">{s.min} – {s.max}</p>
              <p className="text-gray-700 text-xs">{s.count} pts</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-gray-700 border-t-cyan-500 rounded-full animate-spin" /></div>
      ) : readings.length === 0 ? (
        <div className="text-center py-8 text-gray-600 text-sm">No readings yet — log your first data point above.</div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-900 border-b border-gray-800">
                <tr>
                  <th className="text-left text-gray-500 font-bold py-2 px-4">Time</th>
                  <th className="text-left text-gray-500 font-bold py-2 px-3">Channel</th>
                  <th className="text-right text-gray-500 font-bold py-2 px-3">Value</th>
                  <th className="text-left text-gray-500 font-bold py-2 px-3">Step</th>
                  <th className="text-left text-gray-500 font-bold py-2 px-3">Notes</th>
                  <th className="py-2 px-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {[...readings].reverse().map(r => (
                  <tr key={r.id} className="hover:bg-gray-800/30">
                    <td className="py-2 px-4 text-gray-500">{format(new Date(r.timestamp), "MM/dd HH:mm:ss")}</td>
                    <td className="py-2 px-3">
                      <span className="font-bold" style={{ color: CHANNEL_COLORS[r.channel] || "#06b6d4" }}>{r.channel || "—"}</span>
                    </td>
                    <td className="py-2 px-3 text-right text-white font-mono font-bold">{r.value} <span className="text-gray-600 font-normal">{r.unit}</span></td>
                    <td className="py-2 px-3 text-gray-500">{r.step_label || "—"}</td>
                    <td className="py-2 px-3 text-gray-500 max-w-[120px] truncate">{r.notes || "—"}</td>
                    <td className="py-2 px-3">
                      <button onClick={() => handleDelete(r.id)} className="text-gray-700 hover:text-red-400 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}