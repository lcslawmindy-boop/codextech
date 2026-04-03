import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Loader2, Activity, Zap, Moon, Battery } from "lucide-react";
import FloorPlanHeatmap from "../components/FloorPlanHeatmap";
import { base44 } from "@/api/base44Client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from "recharts";

const SYMPTOM_OPTIONS = [
  "Headache", "Brain fog", "Fatigue", "Insomnia", "Anxiety",
  "Heart palpitations", "Tinnitus", "Dizziness", "Nausea", "Eye strain",
  "Skin tingling", "Irritability"
];

const RISK_COLOR = (val) => {
  if (val < 1) return "text-green-400";
  if (val < 4) return "text-yellow-400";
  if (val < 10) return "text-orange-400";
  return "text-red-400";
};

const RISK_LABEL = (val) => {
  if (val < 1) return "Safe";
  if (val < 4) return "Low";
  if (val < 10) return "Moderate";
  return "High";
};

const DEFAULT_FORM = {
  date: new Date().toISOString().split("T")[0],
  reading_mG: "",
  location: "",
  symptoms: [],
  sleep_quality: 5,
  energy_level: 5,
  notes: ""
};

export default function EMFExposureLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState("chart"); // chart | log | heatmap

  useEffect(() => {
    base44.entities.EMFLog.list("-date", 90).then(data => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  const toggleSymptom = (s) => setForm(f => ({
    ...f,
    symptoms: f.symptoms.includes(s) ? f.symptoms.filter(x => x !== s) : [...f.symptoms, s]
  }));

  const handleSave = async () => {
    if (!form.date || form.reading_mG === "") return;
    setSaving(true);
    const entry = {
      ...form,
      reading_mG: parseFloat(form.reading_mG),
      sleep_quality: parseInt(form.sleep_quality),
      energy_level: parseInt(form.energy_level),
    };
    const saved = await base44.entities.EMFLog.create(entry);
    setLogs(prev => [{ ...entry, id: saved.id }, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
    setForm(DEFAULT_FORM);
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await base44.entities.EMFLog.delete(id);
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  const chartData = [...logs]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30)
    .map(l => ({
      date: l.date.slice(5),
      "EMF (mG)": l.reading_mG,
      "Sleep": l.sleep_quality,
      "Energy": l.energy_level,
    }));

  const avgEMF = logs.length ? (logs.reduce((s, l) => s + l.reading_mG, 0) / logs.length).toFixed(2) : 0;
  const maxEMF = logs.length ? Math.max(...logs.map(l => l.reading_mG)) : 0;
  const symptomCounts = {};
  logs.forEach(l => (l.symptoms || []).forEach(s => { symptomCounts[s] = (symptomCounts[s] || 0) + 1; }));
  const topSymptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
              <Activity size={18} className="text-red-400" /> EMF Exposure Log
            </h1>
            <p className="text-gray-500 text-xs">Track daily EMF readings, symptoms, and health patterns</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-bold transition-all"
        >
          <Plus size={14} /> Log Reading
        </button>
      </div>

      {/* Stats bar */}
      {logs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-4 border-b border-gray-800 bg-gray-900/40">
          <div className="text-center">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Readings</p>
            <p className="text-white font-black text-2xl">{logs.length}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Avg EMF</p>
            <p className={`font-black text-2xl ${RISK_COLOR(avgEMF)}`}>{avgEMF} <span className="text-sm font-normal">mG</span></p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Peak Reading</p>
            <p className={`font-black text-2xl ${RISK_COLOR(maxEMF)}`}>{maxEMF} <span className="text-sm font-normal">mG</span></p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Risk Level</p>
            <p className={`font-black text-2xl ${RISK_COLOR(avgEMF)}`}>{RISK_LABEL(avgEMF)}</p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-6xl mx-auto w-full">
        {/* Log Form */}
        {showForm && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-6">
            <h2 className="text-white font-bold text-base mb-4">New EMF Reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-gray-400 text-xs block mb-1">Date *</label>
                <input type="date" value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="text-gray-400 text-xs block mb-1">EMF Reading (mG) *</label>
                <input type="number" step="0.01" value={form.reading_mG}
                  onChange={e => setForm(f => ({ ...f, reading_mG: e.target.value }))}
                  placeholder="e.g. 2.4"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="text-gray-400 text-xs block mb-1">Location</label>
                <input type="text" value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Bedroom, Office"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-gray-400 text-xs block mb-2">
                  <Moon size={11} className="inline mr-1" /> Sleep Quality: <span className="text-white font-bold">{form.sleep_quality}/10</span>
                </label>
                <input type="range" min="1" max="10" value={form.sleep_quality}
                  onChange={e => setForm(f => ({ ...f, sleep_quality: e.target.value }))}
                  className="w-full accent-blue-500" />
              </div>
              <div>
                <label className="text-gray-400 text-xs block mb-2">
                  <Battery size={11} className="inline mr-1" /> Energy Level: <span className="text-white font-bold">{form.energy_level}/10</span>
                </label>
                <input type="range" min="1" max="10" value={form.energy_level}
                  onChange={e => setForm(f => ({ ...f, energy_level: e.target.value }))}
                  className="w-full accent-green-500" />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-gray-400 text-xs block mb-2">Symptoms</label>
              <div className="flex flex-wrap gap-2">
                {SYMPTOM_OPTIONS.map(s => (
                  <button key={s} onClick={() => toggleSymptom(s)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      form.symptoms.includes(s)
                        ? "bg-red-900/40 border-red-600 text-red-300 font-semibold"
                        : "border-gray-700 text-gray-500 hover:border-gray-500"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-gray-400 text-xs block mb-1">Notes</label>
              <textarea value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={2} placeholder="Any additional observations..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 resize-none" />
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving || !form.date || form.reading_mG === ""}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-bold disabled:opacity-50 transition-all">
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                {saving ? "Saving…" : "Save Reading"}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl border border-gray-700 text-gray-400 text-sm hover:border-gray-500 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={24} className="animate-spin text-gray-600" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Zap size={48} className="text-gray-700 mb-4" />
            <h2 className="text-white font-bold text-xl mb-2">No readings yet</h2>
            <p className="text-gray-500 text-sm max-w-sm mb-6">Start logging your daily EMF meter readings to track exposure patterns and correlate them with symptoms over time.</p>
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-sm transition-all">
              <Plus size={14} /> Log First Reading
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6 w-fit">
              {[["chart", "📈 Charts"], ["log", "📋 Log"], ["heatmap", "🗺️ Floor Plan"]].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === id ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                  {label}
                </button>
              ))}
            </div>

            {tab === "chart" && (
              <div className="space-y-6">
                {/* EMF over time */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <h3 className="text-white font-bold text-sm mb-4">EMF Exposure Over Time (last 30 readings)</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8 }} labelStyle={{ color: "#fff" }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="EMF (mG)" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Sleep & Energy */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <h3 className="text-white font-bold text-sm mb-4">Sleep Quality & Energy Level</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} />
                      <YAxis domain={[0, 10]} tick={{ fill: "#6b7280", fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8 }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="Sleep" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="Energy" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Top symptoms */}
                {topSymptoms.length > 0 && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <h3 className="text-white font-bold text-sm mb-4">Most Reported Symptoms</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={topSymptoms.map(([name, count]) => ({ name, count }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} />
                        <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} allowDecimals={false} />
                        <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8 }} />
                        <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Safe levels reference */}
                <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-4 text-xs text-blue-300 leading-relaxed">
                  <strong>Reference levels:</strong> &lt;1 mG = Safe · 1–4 mG = Low concern · 4–10 mG = Moderate · &gt;10 mG = High exposure. Building Biology guidelines recommend &lt;1 mG for sleeping areas.
                </div>
              </div>
            )}

            {tab === "log" && (
              <div className="space-y-3">
                {logs.map(log => (
                  <div key={log.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start gap-4">
                    <div className="flex-shrink-0 text-center min-w-[60px]">
                      <p className={`text-2xl font-black ${RISK_COLOR(log.reading_mG)}`}>{log.reading_mG}</p>
                      <p className="text-gray-600 text-xs">mG</p>
                      <p className={`text-xs font-bold mt-0.5 ${RISK_COLOR(log.reading_mG)}`}>{RISK_LABEL(log.reading_mG)}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="text-white text-sm font-semibold">{log.date}</span>
                        {log.location && <span className="text-gray-500 text-xs">📍 {log.location}</span>}
                        {log.sleep_quality && <span className="text-blue-400 text-xs">😴 Sleep {log.sleep_quality}/10</span>}
                        {log.energy_level && <span className="text-green-400 text-xs">⚡ Energy {log.energy_level}/10</span>}
                      </div>
                      {(log.symptoms || []).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          {log.symptoms.map(s => (
                            <span key={s} className="text-xs bg-red-900/30 text-red-300 border border-red-800/50 px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                        </div>
                      )}
                      {log.notes && <p className="text-gray-500 text-xs italic">{log.notes}</p>}
                    </div>
                    <button onClick={() => handleDelete(log.id)} className="text-gray-700 hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tab === "heatmap" && (
              <FloorPlanHeatmap logs={logs} />
            )}
          </>
        )}
      </div>
    </div>
  );
}