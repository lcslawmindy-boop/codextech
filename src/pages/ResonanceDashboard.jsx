import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Activity, Play, Pause, Square, Radio, Waves, Zap, Droplet, Wind, Thermometer, Heart, Brain, Gauge } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";

// ── Modality definitions ──────────────────────────────────────────────────
const MODALITIES = [
  { code: "PBM", name: "Photobiomodulation", icon: Activity, color: "#ef4444", unit: "mW/cm²", freqLabel: "630/850 nm", ampRange: [0, 50], freqRange: [0, 100] },
  { code: "FIT", name: "Far-Infrared Thermal", icon: Thermometer, color: "#f97316", unit: "°C", freqLabel: "8-14 μm", ampRange: [37, 55], freqRange: [0, 100] },
  { code: "SFT", name: "Scalar Field Therapy", icon: Zap, color: "#06b6d4", unit: "mT", freqLabel: "20Hz-20kHz", ampRange: [0, 5], freqRange: [20, 20000] },
  { code: "PEMF", name: "PEMF Schumann", icon: Radio, color: "#3b82f6", unit: "μT", freqLabel: "7.83 Hz", ampRange: [0, 10], freqRange: [7, 8] },
  { code: "VAT", name: "Vibroacoustic", icon: Waves, color: "#a855f7", unit: "dB", freqLabel: "30-528 Hz", ampRange: [0, 85], freqRange: [30, 528] },
  { code: "MCT", name: "MicroCurrent", icon: Zap, color: "#ec4899", unit: "μA", freqLabel: "1-999 μA", ampRange: [0, 999], freqRange: [0, 100] },
  { code: "HIT", name: "Hydrogen Inhalation", icon: Droplet, color: "#14b8a6", unit: "mL/min", freqLabel: "99.99% H₂", ampRange: [0, 300], freqRange: [0, 100] },
  { code: "NIA", name: "Negative Ion Air", icon: Wind, color: "#2dd4bf", unit: "ions/cm³", freqLabel: "<0.05 ppm O₃", ampRange: [0, 100], freqRange: [0, 100] },
  { code: "BIO", name: "Biometric (HRV)", icon: Heart, color: "#f59e0b", unit: "BPM", freqLabel: "HRV · GSR · EEG", ampRange: [40, 120], freqRange: [0, 100] },
];

const MAX_POINTS = 60; // 60 seconds of data at 1Hz

function generateInitialData() {
  return MODALITIES.reduce((acc, m) => {
    acc[m.code] = Array.from({ length: MAX_POINTS }, (_, i) => ({
      t: i,
      amplitude: m.ampRange[0] + (m.ampRange[1] - m.ampRange[0]) * (0.3 + Math.random() * 0.4),
      frequency: m.freqRange[0] + (m.freqRange[1] - m.freqRange[0]) * (0.4 + Math.random() * 0.2),
    }));
    return acc;
  }, {});
}

function nextValue(current, range, drift = 0.05) {
  const span = range[1] - range[0];
  let next = current + (Math.random() - 0.5) * span * drift;
  const min = range[0] + span * 0.1;
  const max = range[1] - span * 0.1;
  if (next < min) next = min + Math.random() * span * 0.1;
  if (next > max) next = max - Math.random() * span * 0.1;
  return next;
}

// ── Single Modality Card ──────────────────────────────────────────────────
function ModalityCard({ modality, data, active }) {
  const Icon = modality.icon;
  const latest = data[data.length - 1];
  const prev = data[data.length - 2] || latest;
  const ampDelta = ((latest.amplitude - prev.amplitude) / (prev.amplitude || 1)) * 100;
  const avgAmp = data.reduce((s, d) => s + d.amplitude, 0) / data.length;
  const peakAmp = Math.max(...data.map(d => d.amplitude));
  const inRange = latest.amplitude >= modality.ampRange[0] && latest.amplitude <= modality.ampRange[1];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all"
      style={{ borderTopColor: modality.color, borderTopWidth: 2, opacity: active ? 1 : 0.5 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Icon size={14} style={{ color: modality.color }} />
          <div>
            <p className="text-white font-bold text-xs">{modality.code}</p>
            <p className="text-gray-600 text-[10px]">{modality.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-600">{modality.freqLabel}</p>
          <div className="flex items-center gap-1 justify-end">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: active ? modality.color : "#374151" }} />
            <span className={`text-[9px] font-bold ${active ? "text-green-400" : "text-gray-600"}`}>{active ? "LIVE" : "OFF"}</span>
          </div>
        </div>
      </div>

      {/* Live value */}
      <div className="px-4 py-3">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-black tabular-nums" style={{ color: modality.color }}>
            {latest.amplitude.toFixed(modality.code === "BIO" ? 0 : modality.code === "MCT" ? 0 : 1)}
          </span>
          <span className="text-gray-500 text-xs">{modality.unit}</span>
          <span className={`text-[10px] font-bold ml-auto ${ampDelta >= 0 ? "text-green-400" : "text-red-400"}`}>
            {ampDelta >= 0 ? "▲" : "▼"} {Math.abs(ampDelta).toFixed(1)}%
          </span>
        </div>

        {/* Sparkline */}
        <div className="h-16 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`grad-${modality.code}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={modality.color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={modality.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="amplitude" stroke={modality.color} strokeWidth={1.5} fill={`url(#grad-${modality.code})`} isAnimationActive={false} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: `1px solid ${modality.color}40`, borderRadius: 8, fontSize: 10 }}
                labelStyle={{ color: "#64748b" }}
                labelFormatter={(v) => `t=${v}s`}
                formatter={(v) => [`${v.toFixed(1)} ${modality.unit}`, "Amplitude"]}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-800">
          <div>
            <p className="text-gray-700 text-[9px] uppercase">Avg</p>
            <p className="text-gray-400 text-[11px] font-bold tabular-nums">{avgAmp.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-gray-700 text-[9px] uppercase">Peak</p>
            <p className="text-gray-400 text-[11px] font-bold tabular-nums">{peakAmp.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-gray-700 text-[9px] uppercase">Status</p>
            <p className={`text-[11px] font-bold ${inRange ? "text-green-400" : "text-yellow-400"}`}>{inRange ? "NOM" : "DEV"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Frequency Spectrum View ───────────────────────────────────────────────
function FrequencySpectrum({ allData, modalities }) {
  // Show combined amplitude overlay for all active modalities
  const [selected, setSelected] = useState(modalities.map(m => m.code));

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gauge size={15} className="text-cyan-400" />
          <div>
            <h3 className="text-white font-bold text-sm">Combined Resonance Spectrum</h3>
            <p className="text-gray-500 text-xs">Amplitude output across all modalities (last 60s)</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {modalities.map(m => (
            <button key={m.code} onClick={() => setSelected(p => p.includes(m.code) ? p.filter(c => c !== m.code) : [...p, m.code])}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all"
              style={{
                backgroundColor: selected.includes(m.code) ? `${m.color}25` : "transparent",
                borderColor: selected.includes(m.code) ? `${m.color}80` : "#374151",
                color: selected.includes(m.code) ? m.color : "#6b7280",
              }}>
              {m.code}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={allData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="t" stroke="#475569" fontSize={10} tickFormatter={(v) => `${v}s`} />
            <YAxis stroke="#475569" fontSize={10} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "#64748b" }} labelFormatter={(v) => `t=${v}s`} />
            <ReferenceLine y={0} stroke="#334155" />
            {modalities.filter(m => selected.includes(m.code)).map(m => (
              <Line key={m.code} type="monotone" dataKey={m.code} stroke={m.color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Session Controls ──────────────────────────────────────────────────────
function SessionControls({ status, elapsed, onPlay, onPause, onStop }) {
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div className="flex items-center justify-between px-5 py-3 bg-gray-900/80 backdrop-blur border-b border-gray-800">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status === "running" ? "bg-green-500 animate-pulse" : status === "paused" ? "bg-yellow-500" : "bg-gray-600"}`} />
          <span className="text-white font-bold text-sm">{status === "running" ? "Session Active" : status === "paused" ? "Paused" : "Idle"}</span>
        </div>
        <div className="w-px h-5 bg-gray-700" />
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-cyan-400" />
          <span className="text-gray-300 text-sm font-mono tabular-nums">{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
        </div>
        <div className="w-px h-5 bg-gray-700" />
        <span className="text-gray-500 text-xs">{MODALITIES.length} modalities tracked</span>
      </div>
      <div className="flex items-center gap-2">
        {status === "running" ? (
          <button onClick={onPause} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-yellow-900/50 border border-yellow-700 text-yellow-300 text-sm font-bold hover:bg-yellow-900/70 transition-colors">
            <Pause size={14} /> Pause
          </button>
        ) : (
          <button onClick={onPlay} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-900/50 border border-green-700 text-green-300 text-sm font-bold hover:bg-green-900/70 transition-colors">
            <Play size={14} /> {status === "paused" ? "Resume" : "Start Session"}
          </button>
        )}
        <button onClick={onStop} disabled={status === "idle"} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-900/50 border border-red-700 text-red-300 text-sm font-bold hover:bg-red-900/70 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          <Square size={14} /> Stop
        </button>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────
export default function ResonanceDashboard() {
  const [status, setStatus] = useState("idle"); // idle, running, paused
  const [elapsed, setElapsed] = useState(0);
  const [data, setData] = useState(generateInitialData());
  const [combined, setCombined] = useState([]);
  const intervalRef = useRef(null);

  const tick = useCallback(() => {
    setElapsed(prev => prev + 1);
    setData(prev => {
      const next = {};
      for (const m of MODALITIES) {
        const arr = prev[m.code].slice(1);
        const lastPoint = prev[m.code][prev[m.code].length - 1];
        arr.push({
          t: lastPoint.t + 1,
          amplitude: nextValue(lastPoint.amplitude, m.ampRange),
          frequency: nextValue(lastPoint.frequency, m.freqRange),
        });
        next[m.code] = arr;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (status === "running") {
      intervalRef.current = setInterval(tick, 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [status, tick]);

  // Build combined chart data (normalized 0-100 for overlay)
  useEffect(() => {
    const points = [];
    const len = data[MODALITIES[0].code]?.length || 0;
    for (let i = 0; i < len; i++) {
      const point = { t: i };
      for (const m of MODALITIES) {
        const raw = data[m.code]?.[i]?.amplitude ?? 0;
        const span = m.ampRange[1] - m.ampRange[0];
        point[m.code] = span > 0 ? ((raw - m.ampRange[0]) / span) * 100 : 0;
      }
      points.push(point);
    }
    setCombined(points);
  }, [data]);

  // Aggregate stats
  const activeCount = status === "running" ? MODALITIES.length : 0;
  const allAmps = MODALITIES.flatMap(m => data[m.code].slice(-1).map(d => d.amplitude));
  const avgOutput = allAmps.reduce((s, v) => s + v, 0) / allAmps.length;

  return (
    <div className="w-full h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/therapy-pod-pro" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={15} /> Therapy Pod
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
              <Radio size={18} className="text-cyan-400" /> Resonance Monitoring Dashboard
            </h1>
            <p className="text-gray-500 text-xs">Real-time amplitude & frequency tracking — AATCS-P1 therapy session</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-center">
            <p className="text-gray-600 text-[9px] uppercase">Active Modalities</p>
            <p className="text-cyan-400 font-black text-sm tabular-nums">{activeCount}/{MODALITIES.length}</p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-center">
            <p className="text-gray-600 text-[9px] uppercase">Avg Output</p>
            <p className="text-green-400 font-black text-sm tabular-nums">{avgOutput.toFixed(1)}</p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-center">
            <p className="text-gray-600 text-[9px] uppercase">Session</p>
            <p className="text-white font-black text-sm font-mono tabular-nums">{String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}</p>
          </div>
        </div>
      </div>

      {/* Session controls */}
      <SessionControls status={status} elapsed={elapsed}
        onPlay={() => setStatus("running")}
        onPause={() => setStatus("paused")}
        onStop={() => { setStatus("idle"); setElapsed(0); setData(generateInitialData()); }}
      />

      {/* Combined spectrum */}
      <div className="px-6 pt-4 flex-shrink-0">
        <FrequencySpectrum allData={combined} modalities={MODALITIES} />
      </div>

      {/* Modality cards grid */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {MODALITIES.map(m => (
            <ModalityCard key={m.code} modality={m} data={data[m.code]} active={status === "running"} />
          ))}
        </div>
      </div>

      {/* Footer status bar */}
      <div className="flex items-center justify-between px-6 py-2 border-t border-gray-800 bg-gray-900/60 flex-shrink-0">
        <div className="flex items-center gap-4 text-xs">
          <span className="text-gray-600">BFAC Closed-Loop: <span className="text-green-400 font-bold">ACTIVE</span></span>
          <span className="text-gray-600">Sample Rate: <span className="text-cyan-400 font-bold">1 Hz</span></span>
          <span className="text-gray-600">Data Points: <span className="text-gray-400 font-bold">{MAX_POINTS}</span></span>
        </div>
        <span className="text-gray-700 text-[10px]">AATCS-P1 · Research prototype — not for medical use</span>
      </div>
    </div>
  );
}