import { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

const SAMPLE_RATE = 60; // points per second
const WINDOW = 120; // points shown

function computeFlux(t, params) {
  const {
    frequency, amplitude, pulseRate, pulseDepth,
    phiCoupling, vacuumGround, phaseOffset, harmonics,
  } = params;

  // Base scalar phi-wave (longitudinal, no E/B field)
  const omega = 2 * Math.PI * frequency;
  const phi = amplitude * Math.sin(omega * t + phaseOffset);

  // Pulse modulation envelope
  const pulseEnv = 1 - pulseDepth * (0.5 + 0.5 * Math.sin(2 * Math.PI * pulseRate * t));

  // Phi-river gradient (∇φ) — virtual particle flux driver
  const gradPhi = phi * pulseEnv * phiCoupling;

  // Vacuum ground deviation — unlocks Dirac-sea coupling
  const vacuumDelta = vacuumGround * Math.sin(omega * 0.618 * t); // golden ratio sub-harmonic

  // Harmonic content (odd harmonics only — scalar symmetry)
  let harmonicSum = 0;
  for (let h = 1; h <= harmonics; h++) {
    harmonicSum += (1 / (2 * h - 1)) * Math.sin((2 * h - 1) * omega * t + phaseOffset);
  }
  const harmonicContrib = (amplitude * 0.3 * harmonicSum * phiCoupling);

  // Virtual particle flux (anenergy output)
  const flux = gradPhi + vacuumDelta + harmonicContrib;

  // Coherence index: how much the waveform deviates from Gaussian (non-classical indicator)
  const coherence = Math.abs(Math.tanh(flux * 2));

  // Phase conjugate component (time-reversed replica amplitude)
  const pcAmplitude = amplitude * phiCoupling * 0.6 * Math.cos(-omega * t - phaseOffset) * pulseEnv;

  return { flux, coherence, pcAmplitude, gradPhi, vacuumDelta };
}

const PRESETS = [
  {
    name: "Moray Resonance",
    icon: "⚡",
    color: "#22c55e",
    params: { frequency: 0.5, amplitude: 1.8, pulseRate: 0.12, pulseDepth: 0.7, phiCoupling: 1.4, vacuumGround: 0.9, phaseOffset: 0, harmonics: 5 },
  },
  {
    name: "Woodpecker 10Hz",
    icon: "📡",
    color: "#ef4444",
    params: { frequency: 10, amplitude: 1.2, pulseRate: 10, pulseDepth: 0.85, phiCoupling: 0.8, vacuumGround: 0.5, phaseOffset: 1.57, harmonics: 3 },
  },
  {
    name: "Priore Therapy",
    icon: "💊",
    color: "#a855f7",
    params: { frequency: 2.5, amplitude: 1.0, pulseRate: 0.5, pulseDepth: 0.4, phiCoupling: 1.1, vacuumGround: 0.3, phaseOffset: 0.78, harmonics: 7 },
  },
  {
    name: "MEG Asymmetric",
    icon: "🔮",
    color: "#3b82f6",
    params: { frequency: 1.0, amplitude: 2.0, pulseRate: 0.25, pulseDepth: 0.3, phiCoupling: 1.8, vacuumGround: 1.2, phaseOffset: 0, harmonics: 9 },
  },
  {
    name: "TRZ Cold Fusion",
    icon: "⚛️",
    color: "#f59e0b",
    params: { frequency: 4.0, amplitude: 0.8, pulseRate: 2.0, pulseDepth: 0.6, phiCoupling: 0.6, vacuumGround: 1.5, phaseOffset: 3.14, harmonics: 11 },
  },
];

function Slider({ label, unit, value, min, max, step, onChange, color = "#3b82f6", tooltip }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-gray-300 text-xs font-semibold">{label}</span>
        <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: color + "22", color }}>
          {typeof value === "number" ? (value % 1 === 0 ? value : value.toFixed(2)) : value} {unit}
        </span>
      </div>
      {tooltip && <p className="text-gray-600 text-xs leading-tight">{tooltip}</p>}
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, ${color} ${pct}%, #374151 ${pct}%)` }}
      />
    </div>
  );
}

function StatCard({ label, value, unit, color, sub }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
      <div className="text-2xl font-black font-mono" style={{ color }}>{value}</div>
      <div className="text-gray-500 text-xs mt-0.5">{label}</div>
      {unit && <div className="text-gray-600 text-xs">{unit}</div>}
      {sub && <div className="text-gray-700 text-xs italic mt-0.5">{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-xs">
      <p className="text-gray-400 mb-1">t = {Number(label).toFixed(2)}s</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {Number(p.value).toFixed(3)}</p>
      ))}
    </div>
  );
};

export default function ScalarWaveSimulator() {
  const [params, setParams] = useState(PRESETS[0].params);
  const [running, setRunning] = useState(true);
  const [data, setData] = useState([]);
  const [activePreset, setActivePreset] = useState(0);
  const [stats, setStats] = useState({ peakFlux: 0, avgCoherence: 0, copEstimate: 0 });
  const tRef = useRef(0);
  const animRef = useRef(null);
  const lastTimeRef = useRef(null);

  const tick = useCallback((timestamp) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const elapsed = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;
    tRef.current += elapsed;
    const t = tRef.current;

    const { flux, coherence, pcAmplitude, gradPhi, vacuumDelta } = computeFlux(t, params);

    setData(prev => {
      const next = [...prev, { t: parseFloat(t.toFixed(2)), flux, coherence, pcAmplitude, gradPhi, vacuumDelta }];
      return next.length > WINDOW ? next.slice(next.length - WINDOW) : next;
    });

    setStats(prev => {
      const peakFlux = Math.max(prev.peakFlux, Math.abs(flux));
      const avgCoherence = prev.avgCoherence * 0.97 + Math.abs(coherence) * 0.03;
      const copEstimate = 1 + Math.abs(gradPhi) * params.phiCoupling * 0.8;
      return { peakFlux: parseFloat(peakFlux.toFixed(3)), avgCoherence: parseFloat(avgCoherence.toFixed(3)), copEstimate: parseFloat(copEstimate.toFixed(2)) };
    });

    animRef.current = requestAnimationFrame(tick);
  }, [params]);

  useEffect(() => {
    if (running) {
      lastTimeRef.current = null;
      animRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(animRef.current);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [running, tick]);

  const set = (key) => (val) => {
    setActivePreset(null);
    setParams(p => ({ ...p, [key]: val }));
  };

  const loadPreset = (i) => {
    setActivePreset(i);
    setParams(PRESETS[i].params);
    setStats({ peakFlux: 0, avgCoherence: 0, copEstimate: 0 });
    setData([]);
    tRef.current = 0;
  };

  return (
    <div className="flex flex-col gap-4 p-4 min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-white font-black text-xl tracking-tight">Scalar Wave Simulator</h2>
          <p className="text-gray-500 text-xs mt-0.5">Virtual particle flux · ∇φ river dynamics · Phase conjugate output · Bearden framework</p>
        </div>
        <button
          onClick={() => setRunning(r => !r)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            running ? "bg-red-900/50 border border-red-700 text-red-300 hover:bg-red-800/60" : "bg-green-900/50 border border-green-700 text-green-300 hover:bg-green-800/60"
          }`}
        >
          {running ? "⏸ Pause" : "▶ Run"}
        </button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={i}
            onClick={() => loadPreset(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              activePreset === i
                ? "text-white border-opacity-80"
                : "border-gray-700 text-gray-400 hover:border-gray-500 bg-gray-900/60"
            }`}
            style={activePreset === i ? { backgroundColor: p.color + "22", borderColor: p.color, color: p.color } : {}}
          >
            {p.icon} {p.name}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Peak ∇φ Flux" value={stats.peakFlux} unit="a.u." color="#22c55e" sub="anenergy output" />
        <StatCard label="Coherence Index" value={stats.avgCoherence} unit="normalized" color="#a855f7" sub="non-Gaussian indicator" />
        <StatCard label="COP Estimate" value={stats.copEstimate} unit="×" color="#f59e0b" sub="energy coefficient" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Controls */}
        <div className="xl:col-span-1 bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-4">
          <h3 className="text-white font-bold text-sm border-b border-gray-800 pb-2">⚙️ Parameters</h3>

          <div className="space-y-1">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Scalar Wave</p>
            <Slider label="Frequency" unit="Hz" value={params.frequency} min={0.1} max={20} step={0.1} onChange={set("frequency")} color="#3b82f6"
              tooltip="Fundamental oscillation rate of the phi-field (scalar potential). Biological trigger windows: 0.5, 2.5, 10 Hz." />
            <Slider label="Amplitude" unit="φ" value={params.amplitude} min={0.1} max={3} step={0.05} onChange={set("amplitude")} color="#3b82f6"
              tooltip="Scalar potential magnitude above vacuum ground. Higher = larger virtual particle flux river." />
            <Slider label="Phase Offset" unit="rad" value={params.phaseOffset} min={0} max={6.28} step={0.01} onChange={set("phaseOffset")} color="#3b82f6"
              tooltip="Initial phase of the phi-wave. Controls time-reversal zone alignment." />
          </div>

          <div className="space-y-1">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Pulse Modulation</p>
            <Slider label="Pulse Rate" unit="Hz" value={params.pulseRate} min={0.01} max={20} step={0.01} onChange={set("pulseRate")} color="#f59e0b"
              tooltip="ELF modulation frequency. At 10 Hz: Woodpecker brain-entrainment signature. Bearden Part 4 energy bottle architecture." />
            <Slider label="Pulse Depth" unit="" value={params.pulseDepth} min={0} max={1} step={0.01} onChange={set("pulseDepth")} color="#f59e0b"
              tooltip="Modulation index. 0 = continuous wave. 1 = fully gated pulses (maximum anenergy extraction efficiency)." />
          </div>

          <div className="space-y-1">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Field Coupling</p>
            <Slider label="φ-Coupling" unit="" value={params.phiCoupling} min={0} max={2} step={0.01} onChange={set("phiCoupling")} color="#22c55e"
              tooltip="Phi-field coupling strength to virtual particle flux. >1.0 = asymmetric regauging regime (COP>1 possible)." />
            <Slider label="Vacuum Ground Δ" unit="V" value={params.vacuumGround} min={0} max={2} step={0.01} onChange={set("vacuumGround")} color="#22c55e"
              tooltip="Shift in vacuum ground potential. Non-zero = Dirac Sea coupling active. Drives the anenergy pump sub-harmonic." />
            <Slider label="Odd Harmonics" unit="n" value={params.harmonics} min={1} max={15} step={1} onChange={set("harmonics")} color="#a855f7"
              tooltip="Number of odd harmonics (scalar symmetry). MEG uses rich harmonic content from permanent magnet hysteresis." />
          </div>
        </div>

        {/* Charts */}
        <div className="xl:col-span-2 space-y-4">
          {/* Virtual particle flux */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm">Virtual Particle Flux (∇φ output)</h3>
              <span className="text-gray-600 text-xs">Real-time · {WINDOW} sample window</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fluxGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="t" tick={{ fill: "#4b5563", fontSize: 10 }} tickFormatter={v => `${v}s`} />
                <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} domain={["auto", "auto"]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="flux" name="∇φ Flux" stroke="#22c55e" fill="url(#fluxGrad)" dot={false} strokeWidth={1.5} isAnimationActive={false} />
                <Line type="monotone" dataKey="gradPhi" name="grad-φ" stroke="#06b6d4" dot={false} strokeWidth={1} strokeDasharray="4 2" isAnimationActive={false} />
                <Line type="monotone" dataKey="vacuumDelta" name="Vacuum Δ" stroke="#f59e0b" dot={false} strokeWidth={1} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Coherence + Phase Conjugate */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm">Coherence Index & Phase Conjugate Amplitude</h3>
              <span className="text-gray-600 text-xs">Non-Gaussian indicator · Time-reversed replica</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="t" tick={{ fill: "#4b5563", fontSize: 10 }} tickFormatter={v => `${v}s`} />
                <YAxis tick={{ fill: "#4b5563", fontSize: 10 }} domain={["auto", "auto"]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, color: "#9ca3af" }} />
                <Line type="monotone" dataKey="coherence" name="Coherence" stroke="#a855f7" dot={false} strokeWidth={2} isAnimationActive={false} />
                <Line type="monotone" dataKey="pcAmplitude" name="PC Amplitude" stroke="#ef4444" dot={false} strokeWidth={1.5} strokeDasharray="3 2" isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend / theory */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { color: "#22c55e", label: "∇φ Flux", desc: "Virtual particle river between phi-sources" },
              { color: "#06b6d4", label: "grad-φ", desc: "Phi-field gradient (anenergy pump driver)" },
              { color: "#f59e0b", label: "Vacuum Δ", desc: "Dirac Sea coupling sub-harmonic" },
              { color: "#a855f7", label: "Coherence", desc: "Non-Gaussian kurtosis (scalar EM indicator)" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-3 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-white text-xs font-bold">{item.label}</span>
                </div>
                <p className="text-gray-500 text-xs leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bearden theory note */}
      <div className="bg-yellow-950/20 border border-yellow-900/30 rounded-xl p-3 text-xs text-gray-400 leading-relaxed">
        <span className="text-yellow-400 font-bold">Theory basis: </span>
        Derived from Bearden's <em>Toward a New Electromagnetics</em> Parts 3 & 4 (1983). The ∇φ river represents virtual particle flux between two phi-sources of differing magnitude — a region of curved spacetime where energy is not conserved by classical laws. φ-Coupling &gt;1.0 enters the asymmetric regauging regime; vacuum ground deviation activates Dirac Sea coupling (the Moray mechanism). Phase conjugate amplitude represents the time-reversed replica used in TRZ (Time-Reversal Zone) and Priore-type healing applications.
      </div>
    </div>
  );
}