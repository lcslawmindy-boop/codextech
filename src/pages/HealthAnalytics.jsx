import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Loader2, Activity } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ResearchDisclaimer from "../components/ResearchDisclaimer";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ScatterChart, Scatter, BarChart, Bar, Cell
} from "recharts";

const SYMPTOM_LIST = [
  "Headache", "Brain fog", "Fatigue", "Insomnia", "Anxiety",
  "Heart palpitations", "Tinnitus", "Dizziness", "Nausea", "Eye strain",
  "Skin tingling", "Irritability"
];

function Trend({ value, suffix = "" }) {
  if (value === null || isNaN(value)) return <span className="text-gray-600 text-xs flex items-center gap-1"><Minus size={11} /> —</span>;
  if (value < 0) return <span className="text-green-400 text-xs flex items-center gap-1"><TrendingDown size={11} /> {Math.abs(value).toFixed(1)}{suffix} better</span>;
  if (value > 0) return <span className="text-red-400 text-xs flex items-center gap-1"><TrendingUp size={11} /> +{value.toFixed(1)}{suffix} worse</span>;
  return <span className="text-gray-500 text-xs">No change</span>;
}

function StatCard({ label, value, sub, color = "text-white" }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className={`font-black text-2xl ${color}`}>{value}</p>
      {sub && <p className="text-gray-600 text-xs mt-1">{sub}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs space-y-1">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <strong>{typeof p.value === "number" ? p.value.toFixed(2) : p.value}</strong></p>
      ))}
    </div>
  );
};

export default function HealthAnalytics() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSymptom, setSelectedSymptom] = useState("Headache");

  useEffect(() => {
    base44.entities.EMFLog.list("-date", 120).then(data => {
      setLogs(data.sort((a, b) => a.date.localeCompare(b.date)));
      setLoading(false);
    });
  }, []);

  // Weekly aggregation
  const weeklyData = useMemo(() => {
    if (!logs.length) return [];
    const weeks = {};
    logs.forEach(log => {
      const d = new Date(log.date);
      const week = `W${Math.ceil((d.getDate()) / 7)} ${d.toLocaleString("default", { month: "short" })}`;
      if (!weeks[week]) weeks[week] = { week, emfSum: 0, emfCount: 0, sleepSum: 0, energySum: 0, symptomsTotal: 0, logs: 0 };
      weeks[week].emfSum += log.reading_mG || 0;
      weeks[week].emfCount++;
      weeks[week].sleepSum += log.sleep_quality || 0;
      weeks[week].energySum += log.energy_level || 0;
      weeks[week].symptomsTotal += (log.symptoms || []).length;
      weeks[week].logs++;
    });
    return Object.values(weeks).map(w => ({
      week: w.week,
      "Avg EMF (mG)": +(w.emfSum / w.emfCount).toFixed(2),
      "Sleep": +(w.sleepSum / w.logs).toFixed(1),
      "Energy": +(w.energySum / w.logs).toFixed(1),
      "Symptoms/day": +(w.symptomsTotal / w.logs).toFixed(1),
    }));
  }, [logs]);

  // EMF vs symptoms scatter
  const scatterData = useMemo(() => logs.map(l => ({
    emf: l.reading_mG,
    symptoms: (l.symptoms || []).length,
    sleep: l.sleep_quality,
    date: l.date,
  })), [logs]);

  // Symptom frequency over time (by selected symptom)
  const symptomTrendData = useMemo(() => {
    if (!logs.length) return [];
    const byDate = {};
    logs.forEach(log => {
      const week = log.date.slice(0, 7); // YYYY-MM
      if (!byDate[week]) byDate[week] = { month: week, total: 0, hasSymptom: 0 };
      byDate[week].total++;
      if ((log.symptoms || []).includes(selectedSymptom)) byDate[week].hasSymptom++;
    });
    return Object.values(byDate).map(w => ({
      month: w.month,
      [`${selectedSymptom} %`]: w.total ? +((w.hasSymptom / w.total) * 100).toFixed(0) : 0,
      "Avg EMF": logs.filter(l => l.date.startsWith(w.month)).reduce((s, l) => s + (l.reading_mG || 0), 0) /
        Math.max(1, logs.filter(l => l.date.startsWith(w.month)).length),
    }));
  }, [logs, selectedSymptom]);

  // Symptom frequency counts
  const symptomCounts = useMemo(() => {
    const counts = {};
    SYMPTOM_LIST.forEach(s => { counts[s] = 0; });
    logs.forEach(l => (l.symptoms || []).forEach(s => { counts[s] = (counts[s] || 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [logs]);

  // Trend comparison: first half vs second half
  const trends = useMemo(() => {
    if (logs.length < 4) return null;
    const mid = Math.floor(logs.length / 2);
    const first = logs.slice(0, mid);
    const second = logs.slice(mid);
    const avg = (arr, key) => arr.reduce((s, l) => s + (l[key] || 0), 0) / arr.length;
    const symAvg = (arr) => arr.reduce((s, l) => s + (l.symptoms || []).length, 0) / arr.length;
    return {
      emf: +(avg(second, "reading_mG") - avg(first, "reading_mG")).toFixed(2),
      sleep: +(avg(second, "sleep_quality") - avg(first, "sleep_quality")).toFixed(1),
      energy: +(avg(second, "energy_level") - avg(first, "energy_level")).toFixed(1),
      symptoms: +(symAvg(second) - symAvg(first)).toFixed(1),
    };
  }, [logs]);

  const totalLogs = logs.length;
  const avgEMF = logs.length ? (logs.reduce((s, l) => s + l.reading_mG, 0) / logs.length).toFixed(2) : "—";
  const avgSleep = logs.length ? (logs.reduce((s, l) => s + (l.sleep_quality || 0), 0) / logs.length).toFixed(1) : "—";
  const avgEnergy = logs.length ? (logs.reduce((s, l) => s + (l.energy_level || 0), 0) / logs.length).toFixed(1) : "—";

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
              <Activity size={18} className="text-cyan-400" /> Health Analytics
            </h1>
            <p className="text-gray-500 text-xs">EMF exposure · symptom correlation · detox progress over time</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/emf-log" className="px-3 py-1.5 rounded-lg bg-rose-900/40 border border-rose-800 text-rose-300 text-xs font-bold hover:bg-rose-800/50 transition-all">
            📊 EMF Log
          </Link>
          <Link to="/heavy-metal-detox" className="px-3 py-1.5 rounded-lg bg-green-900/40 border border-green-800 text-green-300 text-xs font-bold hover:bg-green-800/50 transition-all">
            🌿 Detox Guide
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-6xl mx-auto w-full">
        <ResearchDisclaimer type="medical" />
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={24} className="animate-spin text-gray-600" />
          </div>
        ) : logs.length < 3 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Activity size={48} className="text-gray-700 mb-4" />
            <h2 className="text-white font-bold text-xl mb-2">Not enough data yet</h2>
            <p className="text-gray-500 text-sm max-w-sm mb-6">Log at least 3 EMF readings with symptoms to start seeing correlations and trends.</p>
            <Link to="/emf-log" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-sm transition-all">
              📊 Go to EMF Log
            </Link>
          </div>
        ) : (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total Readings" value={totalLogs} sub="data points" />
              <StatCard label="Avg EMF" value={`${avgEMF} mG`} color={parseFloat(avgEMF) > 4 ? "text-orange-400" : "text-green-400"} />
              <StatCard label="Avg Sleep" value={`${avgSleep}/10`} color="text-blue-400" />
              <StatCard label="Avg Energy" value={`${avgEnergy}/10`} color="text-emerald-400" />
            </div>

            {/* Trend summary */}
            {trends && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-8">
                <h3 className="text-white font-bold text-sm mb-3">📈 Progress Trend (first half vs recent half of your data)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">EMF Exposure</p>
                    <Trend value={trends.emf} suffix=" mG" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Sleep Quality</p>
                    <Trend value={-trends.sleep} suffix="/10" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Energy Level</p>
                    <Trend value={-trends.energy} suffix="/10" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Symptoms/day</p>
                    <Trend value={trends.symptoms} suffix="" />
                  </div>
                </div>
              </div>
            )}

            {/* Weekly overlay: EMF + Symptoms */}
            {weeklyData.length > 1 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
                <h3 className="text-white font-bold text-sm mb-4">Weekly EMF Exposure vs Symptom Load</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="week" tick={{ fill: "#6b7280", fontSize: 10 }} />
                    <YAxis yAxisId="left" tick={{ fill: "#6b7280", fontSize: 10 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: "#6b7280", fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line yAxisId="left" type="monotone" dataKey="Avg EMF (mG)" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                    <Line yAxisId="right" type="monotone" dataKey="Symptoms/day" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-gray-600 text-xs mt-2 text-center">Higher EMF weeks correlating with more reported symptoms indicates EMF sensitivity</p>
              </div>
            )}

            {/* Sleep & Energy trend */}
            {weeklyData.length > 1 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
                <h3 className="text-white font-bold text-sm mb-4">Sleep & Energy Recovery Over Time</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="week" tick={{ fill: "#6b7280", fontSize: 10 }} />
                    <YAxis domain={[0, 10]} tick={{ fill: "#6b7280", fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="Sleep" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Energy" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* EMF vs Symptoms scatter */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
              <h3 className="text-white font-bold text-sm mb-1">EMF Reading vs Symptom Count (per log entry)</h3>
              <p className="text-gray-600 text-xs mb-4">Each dot = one logged day. Higher EMF + more symptoms = correlation.</p>
              <ResponsiveContainer width="100%" height={220}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="emf" name="EMF (mG)" tick={{ fill: "#6b7280", fontSize: 10 }} label={{ value: "EMF (mG)", position: "insideBottom", offset: -5, fill: "#6b7280", fontSize: 10 }} />
                  <YAxis dataKey="symptoms" name="Symptom count" tick={{ fill: "#6b7280", fontSize: 10 }} label={{ value: "Symptoms", angle: -90, position: "insideLeft", fill: "#6b7280", fontSize: 10 }} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload;
                    return (
                      <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs">
                        <p className="text-gray-400">{d?.date}</p>
                        <p className="text-red-400">EMF: {d?.emf} mG</p>
                        <p className="text-yellow-400">Symptoms: {d?.symptoms}</p>
                        <p className="text-blue-400">Sleep: {d?.sleep}/10</p>
                      </div>
                    );
                  }} />
                  <Scatter data={scatterData} fill="#ef4444" fillOpacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Per-symptom trend */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h3 className="text-white font-bold text-sm">Symptom Frequency vs EMF — Monthly</h3>
                <select value={selectedSymptom} onChange={e => setSelectedSymptom(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none">
                  {SYMPTOM_LIST.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={symptomTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 10 }} />
                  <YAxis yAxisId="left" tick={{ fill: "#6b7280", fontSize: 10 }} unit="%" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "#6b7280", fontSize: 10 }} unit=" mG" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line yAxisId="left" type="monotone" dataKey={`${selectedSymptom} %`} stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="right" type="monotone" dataKey="Avg EMF" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 2" dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Symptom frequency bar chart */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-white font-bold text-sm mb-4">All-Time Symptom Frequency</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={symptomCounts.map(([name, count]) => ({ name, count }))} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "#9ca3af", fontSize: 10 }} width={90} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {symptomCounts.map(([, count], i) => (
                      <Cell key={i} fill={count > 10 ? "#ef4444" : count > 5 ? "#f59e0b" : "#22c55e"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-gray-600 text-xs mt-2 text-center">🔴 High frequency · 🟡 Moderate · 🟢 Low — as your detox progresses these should decrease</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}