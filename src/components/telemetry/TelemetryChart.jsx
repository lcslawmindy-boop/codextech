import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";
import { format } from "date-fns";

const CHANNEL_COLORS = ["#06b6d4", "#a78bfa", "#34d399", "#fbbf24", "#f87171", "#818cf8"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-black">
          {p.name}: {p.value} {p.payload?.unit || ""}
        </p>
      ))}
    </div>
  );
}

export default function TelemetryChart({ readings, alerts = [], channels = [] }) {
  const { chartData, channelKeys, unitMap } = useMemo(() => {
    const byTimestamp = {};
    const keys = new Set();
    const units = {};

    readings.forEach((r) => {
      const ts = format(new Date(r.timestamp), "HH:mm:ss");
      if (!byTimestamp[ts]) byTimestamp[ts] = { ts };
      byTimestamp[ts][r.channel] = r.value;
      byTimestamp[ts].unit = r.unit;
      keys.add(r.channel);
      units[r.channel] = r.unit;
    });

    return {
      chartData: Object.values(byTimestamp).slice(-120), // last 120 points
      channelKeys: [...keys],
      unitMap: units,
    };
  }, [readings]);

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-700 text-sm">
        No data yet — send readings from your device to see the chart.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="ts"
          tick={{ fill: "#64748b", fontSize: 10 }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} width={36} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 11 }}>{v} ({unitMap[v] || ""})</span>}
        />
        {/* Alert reference lines */}
        {alerts.filter(a => a.enabled).map((alert, i) => (
          <ReferenceLine
            key={i}
            y={alert.threshold}
            stroke={alert.severity === "critical" ? "#f87171" : alert.severity === "warning" ? "#fbbf24" : "#94a3b8"}
            strokeDasharray="4 3"
            label={{ value: `${alert.condition} ${alert.threshold}`, fill: "#94a3b8", fontSize: 9, position: "insideRight" }}
          />
        ))}
        {channelKeys.map((ch, i) => (
          <Line
            key={ch}
            type="monotone"
            dataKey={ch}
            stroke={CHANNEL_COLORS[i % CHANNEL_COLORS.length]}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}