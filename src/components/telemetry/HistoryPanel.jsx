import { useMemo } from "react";
import { BarChart2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { format } from "date-fns";

function StatCard({ label, value, sub, trend }) {
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const color = trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-gray-500";
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white font-black text-xl">{value}</p>
      <div className="flex items-center gap-1 mt-1">
        <Icon size={11} className={color} />
        <p className="text-xs text-gray-600">{sub}</p>
      </div>
    </div>
  );
}

export default function HistoryPanel({ readings, device }) {
  const stats = useMemo(() => {
    if (!readings.length) return null;
    const channels = [...new Set(readings.map(r => r.channel))];
    return channels.map(ch => {
      const vals = readings.filter(r => r.channel === ch).map(r => r.value);
      const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
      const min = Math.min(...vals).toFixed(2);
      const max = Math.max(...vals).toFixed(2);
      const last = vals[vals.length - 1];
      const secondLast = vals[vals.length - 2];
      const trend = secondLast == null ? "flat" : last > secondLast ? "up" : last < secondLast ? "down" : "flat";
      const unit = readings.find(r => r.channel === ch)?.unit || "";
      const label = readings.find(r => r.channel === ch)?.label || ch;
      const alertCount = readings.filter(r => r.channel === ch && r.alert_triggered).length;
      return { ch, label, avg, min, max, last, unit, trend, alertCount, count: vals.length };
    });
  }, [readings]);

  // Group sessions
  const sessions = useMemo(() => {
    const map = {};
    readings.forEach(r => {
      const sid = r.session_id || "default";
      if (!map[sid]) map[sid] = { id: sid, readings: [], start: r.timestamp, end: r.timestamp };
      map[sid].readings.push(r);
      if (r.timestamp < map[sid].start) map[sid].start = r.timestamp;
      if (r.timestamp > map[sid].end) map[sid].end = r.timestamp;
    });
    return Object.values(map).sort((a, b) => b.start.localeCompare(a.start)).slice(0, 10);
  }, [readings]);

  if (!readings.length) {
    return (
      <div className="text-center py-10 text-gray-700 text-sm">
        No historical data yet for this device.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Per-channel stats */}
      {stats && (
        <div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <BarChart2 size={12} /> Channel Statistics (all time)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map(s => (
              <div key={s.ch} className="col-span-1">
                <p className="text-xs font-bold text-gray-400 mb-2">{s.label} ({s.unit})</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs"><span className="text-gray-600">Avg</span><span className="text-cyan-300 font-black">{s.avg}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-600">Min</span><span className="text-blue-300 font-bold">{s.min}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-600">Max</span><span className="text-purple-300 font-bold">{s.max}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-600">Points</span><span className="text-gray-300">{s.count}</span></div>
                  {s.alertCount > 0 && <div className="flex justify-between text-xs"><span className="text-gray-600">⚠ Alerts</span><span className="text-red-400 font-bold">{s.alertCount}</span></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sessions */}
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Recent Sessions</p>
        <div className="space-y-2">
          {sessions.map(sess => (
            <div key={sess.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-800/40 border border-gray-800">
              <div className="flex-1">
                <p className="text-white text-xs font-bold font-mono">{sess.id.slice(0, 20)}</p>
                <p className="text-gray-600 text-xs">
                  {format(new Date(sess.start), "MMM d, HH:mm")} → {format(new Date(sess.end), "HH:mm")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-cyan-300 text-xs font-black">{sess.readings.length} pts</p>
                {sess.readings.some(r => r.alert_triggered) && (
                  <p className="text-red-400 text-xs">⚠ alerts</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}