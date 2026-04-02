import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, RotateCcw, Zap, Activity, Info } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

// ── Simulation parameters
const DEFAULTS = {
  closed: { freq: 60, amplitude: 1, resistance: 50, phiOscillation: 0, vacuumCoupling: 0 },
  open:   { freq: 60, amplitude: 1, resistance: 50, phiOscillation: 0.72, vacuumCoupling: 0.85 },
};

const COMPONENTS = [
  { id: "resistor",   label: "Resistor",      symbol: "R", desc: "Conventional mass-current energy dissipation. Ohmic — V=IR applies fully. Scalar phi-field passes through without coupling.",  icon: "⚡" },
  { id: "inductor",   label: "Inductor",       symbol: "L", desc: "Stores energy in magnetic field. In open-system mode, the toroidal inductor geometry creates ∇φ=0 inside while maintaining phi > phi₀ — the anenergy pump prerequisite.",  icon: "🔄" },
  { id: "capacitor",  label: "Capacitor",      symbol: "C", desc: "Stores charge. In scalar mode, the dielectric gap becomes a phi-field gradient region — virtual particles flow between plates without conventional mass current.", icon: "⊣⊢" },
  { id: "toroid",     label: "Toroidal Coil",  symbol: "T", desc: "Key scalar EM component. Shielded toroid: ∇φ inside = 0, φ > φ₀ maintained. Anenergy pump activation geometry per Bearden Part 4.", icon: "⭕" },
  { id: "pco",        label: "Phase Conj. Mirror", symbol: "PCM", desc: "Time-reverses incoming EM waves. Output is phase-conjugate replica traveling back to source. Enables disease-pattern cancellation at the quantum potential level.", icon: "🪞" },
  { id: "vpo",        label: "Vacuum Pot. Osc.", symbol: "VPO", desc: "Oscillates the vacuum ground potential of the circuit section. Enables partial Dirac Sea unstripping — lifting electrons into the circuit without conventional V=IR mass current.", icon: "🌀" },
];

// ── Waveform generator
function generateWaveform(mode, params, t0, points = 180) {
  const data = [];
  const { freq, amplitude, resistance, phiOscillation, vacuumCoupling } = params;
  const omega = (2 * Math.PI * freq) / 60;

  for (let i = 0; i < points; i++) {
    const t = t0 + i * 0.04;

    // Conventional voltage (V=IR in closed system, degraded by scalar contribution in open)
    const vConv = amplitude * Math.sin(omega * t) * (mode === "closed" ? 1 : 1 - vacuumCoupling * 0.4);

    // Current — in closed system follows Ohm. In open system, extra vacuum-sourced current appears
    const iConv = vConv / resistance;
    const iVacuum = mode === "open" ? (vacuumCoupling * amplitude * 0.6 * Math.sin(omega * t + Math.PI / 4)) / resistance : 0;
    const iTotal = iConv + iVacuum;

    // Scalar phi-field — non-zero only in open system; longitudinal, no E or B field
    const phi = mode === "open"
      ? phiOscillation * amplitude * Math.sin(omega * t * 1.5 + Math.PI / 3) * (0.8 + 0.2 * Math.sin(omega * t * 0.3))
      : 0;

    // Power — open system can exceed input (COP > 1)
    const pIn = vConv * iConv;
    const pOut = mode === "open" ? pIn + (vacuumCoupling * amplitude * amplitude * 0.55) / resistance : pIn;

    data.push({
      t: parseFloat(t.toFixed(2)),
      voltage: parseFloat(vConv.toFixed(4)),
      current: parseFloat((iTotal * 10).toFixed(4)),   // scaled for visibility
      phi: parseFloat(phi.toFixed(4)),
      power_in: parseFloat(pIn.toFixed(4)),
      power_out: parseFloat(pOut.toFixed(4)),
    });
  }
  return data;
}

function SliderParam({ label, value, min, max, step, onChange, color = "#06b6d4", unit = "" }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span style={{ color }} className="font-mono font-bold">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: color }} />
    </div>
  );
}

function CircuitDiagramSVG({ mode, activeComponent, params }) {
  const isOpen = mode === "open";
  const mainColor = isOpen ? "#00ffcc" : "#f97316";
  const phiColor = "#a855f7";

  return (
    <svg viewBox="0 0 400 220" className="w-full h-full" style={{ background: "transparent" }}>
      {/* Grid */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={220} stroke="#1f2937" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 55} x2={400} y2={i * 55} stroke="#1f2937" strokeWidth="0.5" />
      ))}

      {/* Main circuit loop */}
      <rect x="30" y="40" width="340" height="140" rx="6" fill="none" stroke={mainColor} strokeWidth="1.5" strokeDasharray={isOpen ? "6,3" : "none"} opacity="0.6" />

      {/* Voltage source */}
      <circle cx="60" cy="110" r="22" fill="#111827" stroke={mainColor} strokeWidth="1.5" />
      <text x="60" y="107" textAnchor="middle" fill={mainColor} fontSize="9" fontWeight="bold">EMF</text>
      <text x="60" y="118" textAnchor="middle" fill={mainColor} fontSize="7">{isOpen ? "Open" : "Closed"}</text>
      <line x1="60" y1="40" x2="60" y2="88" stroke={mainColor} strokeWidth="1.5" />
      <line x1="60" y1="132" x2="60" y2="180" stroke={mainColor} strokeWidth="1.5" />

      {/* Top wire */}
      <line x1="60" y1="40" x2="340" y2="40" stroke={mainColor} strokeWidth="1.5" />
      {/* Bottom wire */}
      <line x1="60" y1="180" x2="340" y2="180" stroke={mainColor} strokeWidth="1.5" />

      {/* Resistor */}
      <rect x="130" y="28" width="50" height="24" rx="3" fill="#111827" stroke={activeComponent === "resistor" ? "#f59e0b" : "#374151"} strokeWidth={activeComponent === "resistor" ? 2 : 1} />
      <text x="155" y="38" textAnchor="middle" fill="#9ca3af" fontSize="7">RESISTOR</text>
      <text x="155" y="48" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="bold">{params.resistance}Ω</text>

      {/* Inductor/Toroid */}
      {isOpen ? (
        <>
          <ellipse cx="245" cy="40" rx="22" ry="13" fill="#111827" stroke={activeComponent === "toroid" ? "#00ffcc" : "#374151"} strokeWidth={activeComponent === "toroid" ? 2 : 1} />
          <text x="245" y="37" textAnchor="middle" fill="#00ffcc" fontSize="7">TOROID</text>
          <text x="245" y="47" textAnchor="middle" fill="#00ffcc" fontSize="7">∇φ=0</text>
        </>
      ) : (
        <>
          <rect x="222" y="28" width="46" height="24" rx="3" fill="#111827" stroke={activeComponent === "inductor" ? "#60a5fa" : "#374151"} strokeWidth={activeComponent === "inductor" ? 2 : 1} />
          <text x="245" y="38" textAnchor="middle" fill="#9ca3af" fontSize="7">INDUCTOR</text>
          <text x="245" y="48" textAnchor="middle" fill="#60a5fa" fontSize="8">L</text>
        </>
      )}

      {/* Capacitor */}
      <line x1="320" y1="40" x2="320" y2="85" stroke={mainColor} strokeWidth="1.5" />
      <line x1="305" y1="85" x2="335" y2="85" stroke={activeComponent === "capacitor" ? "#f59e0b" : mainColor} strokeWidth="2" />
      <line x1="305" y1="93" x2="335" y2="93" stroke={activeComponent === "capacitor" ? "#f59e0b" : mainColor} strokeWidth="2" />
      <line x1="320" y1="93" x2="320" y2="135" stroke={mainColor} strokeWidth="1.5" />
      <rect x="308" y="78" width="24" height="22" rx="2" fill="none" stroke={activeComponent === "capacitor" ? "#f59e0b" : "transparent"} strokeWidth="1.5" />
      <text x="340" y="91" fill="#9ca3af" fontSize="7">C</text>
      <line x1="320" y1="135" x2="320" y2="180" stroke={mainColor} strokeWidth="1.5" />

      {/* VPO box — only in open mode */}
      {isOpen && (
        <>
          <rect x="105" y="168" width="60" height="24" rx="4" fill="#1a0a2e" stroke={activeComponent === "vpo" ? "#a855f7" : "#4b1d96"} strokeWidth={activeComponent === "vpo" ? 2 : 1} />
          <text x="135" y="178" textAnchor="middle" fill="#a855f7" fontSize="7">VPO</text>
          <text x="135" y="187" textAnchor="middle" fill="#7c3aed" fontSize="6">φ oscillator</text>
          <line x1="105" y1="180" x2="60" y2="180" stroke={phiColor} strokeWidth="1" strokeDasharray="3,2" opacity="0.7" />
          <line x1="165" y1="180" x2="220" y2="180" stroke={phiColor} strokeWidth="1" strokeDasharray="3,2" opacity="0.7" />
        </>
      )}

      {/* PCM box — only in open mode */}
      {isOpen && (
        <>
          <rect x="195" y="168" width="60" height="24" rx="4" fill="#0a1a1a" stroke={activeComponent === "pco" ? "#00ffcc" : "#134e4a"} strokeWidth={activeComponent === "pco" ? 2 : 1} />
          <text x="225" y="178" textAnchor="middle" fill="#00ffcc" fontSize="7">PCM</text>
          <text x="225" y="187" textAnchor="middle" fill="#059669" fontSize="6">phase conj.</text>
        </>
      )}

      {/* Phi-field arrow — open mode */}
      {isOpen && (
        <>
          <line x1="60" y1="110" x2="340" y2="110" stroke={phiColor} strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
          <polygon points="340,106 348,110 340,114" fill={phiColor} opacity="0.6" />
          <text x="200" y="106" textAnchor="middle" fill={phiColor} fontSize="8" opacity="0.8">scalar φ-field (no E, no B)</text>
        </>
      )}

      {/* COP label */}
      {isOpen && (
        <text x="200" y="215" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="bold">
          COP = {(1 + params.vacuumCoupling * 0.9).toFixed(2)} — Output exceeds input via vacuum coupling
        </text>
      )}
      {!isOpen && (
        <text x="200" y="215" textAnchor="middle" fill="#9ca3af" fontSize="9">
          COP = 1.00 — Closed system: output ≤ input (2nd Law limited)
        </text>
      )}

      {/* Current flow arrows */}
      {[140, 200, 260].map(x => (
        <polygon key={x} points={`${x},36 ${x + 8},40 ${x},44`} fill={mainColor} opacity="0.5" />
      ))}
    </svg>
  );
}

const CHART_TABS = [
  { id: "voltage_current", label: "V / I Waveforms" },
  { id: "phi", label: "Phi-Field (φ)" },
  { id: "power", label: "Power / COP" },
];

export default function ScalarEMLab() {
  const [mode, setMode] = useState("closed");
  const [running, setRunning] = useState(true);
  const [params, setParams] = useState(DEFAULTS.closed);
  const [activeComponent, setActiveComponent] = useState(null);
  const [chartTab, setChartTab] = useState("voltage_current");
  const [waveData, setWaveData] = useState([]);
  const tRef = useRef(0);
  const animRef = useRef(null);

  const updateParam = useCallback((key, val) => {
    setParams(p => ({ ...p, [key]: val }));
  }, []);

  const switchMode = (m) => {
    setMode(m);
    setParams(DEFAULTS[m]);
    tRef.current = 0;
  };

  const reset = () => {
    tRef.current = 0;
    setWaveData([]);
  };

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      tRef.current += 0.35;
      setWaveData(generateWaveform(mode, params, tRef.current));
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, mode, params]);

  const isOpen = mode === "open";
  const accentColor = isOpen ? "#00ffcc" : "#f97316";
  const cop = isOpen ? (1 + params.vacuumCoupling * 0.9).toFixed(2) : "1.00";

  const selectedComp = COMPONENTS.find(c => c.id === activeComponent);

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base tracking-tight">Scalar EM Circuit Lab</h1>
            <p className="text-gray-500 text-xs">Phi-field interaction · Waveform simulation · Closed vs. Open system</p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl overflow-hidden border border-gray-700">
            <button onClick={() => switchMode("closed")}
              className={`px-5 py-2 text-sm font-bold transition-all flex items-center gap-2 ${mode === "closed" ? "bg-orange-800 text-white" : "text-gray-500 hover:text-gray-300"}`}>
              <Zap size={13} /> Closed System
            </button>
            <button onClick={() => switchMode("open")}
              className={`px-5 py-2 text-sm font-bold transition-all flex items-center gap-2 ${mode === "open" ? "bg-teal-800 text-white" : "text-gray-500 hover:text-gray-300"}`}>
              <Activity size={13} /> Open System (Scalar)
            </button>
          </div>
          <button onClick={() => setRunning(r => !r)}
            className="p-2 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
            {running ? <Pause size={15} className="text-gray-300" /> : <Play size={15} className="text-green-400" />}
          </button>
          <button onClick={reset} className="p-2 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
            <RotateCcw size={15} className="text-gray-300" />
          </button>
        </div>
      </div>

      {/* Mode banner */}
      <div className="px-5 py-2 border-b flex items-center gap-4 flex-wrap"
        style={{ background: isOpen ? "#022422" : "#1a0d04", borderColor: isOpen ? "#134e4a" : "#431407" }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
          <span className="text-sm font-bold" style={{ color: accentColor }}>
            {isOpen ? "OPEN SYSTEM — Vacuum Coupling Active · Phi-Field Present · COP > 1 Possible" : "CLOSED SYSTEM — V=IR · E=IR² · COP = 1 Hard Limit · No Phi-Field"}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-4 text-xs">
          <span className="text-gray-500">COP: <span className="font-bold" style={{ color: isOpen ? "#22c55e" : "#9ca3af" }}>{cop}</span></span>
          <span className="text-gray-500">φ-field: <span className="font-bold" style={{ color: isOpen ? "#a855f7" : "#4b5563" }}>{isOpen ? `${(params.phiOscillation * 100).toFixed(0)}%` : "OFF"}</span></span>
          <span className="text-gray-500">Vacuum coupling: <span className="font-bold" style={{ color: isOpen ? "#00ffcc" : "#4b5563" }}>{isOpen ? `${(params.vacuumCoupling * 100).toFixed(0)}%` : "0%"}</span></span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left: Circuit + Controls */}
        <div className="w-full lg:w-[380px] flex-shrink-0 border-r border-gray-800 flex flex-col">
          {/* Circuit diagram */}
          <div className="p-4 border-b border-gray-800">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2 font-semibold">Circuit Diagram</p>
            <div className="h-[160px]">
              <CircuitDiagramSVG mode={mode} activeComponent={activeComponent} params={params} />
            </div>
          </div>

          {/* Component selector */}
          <div className="p-4 border-b border-gray-800">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2 font-semibold">Components</p>
            <div className="grid grid-cols-3 gap-1.5">
              {COMPONENTS.map(c => {
                const available = isOpen ? true : !["toroid", "pco", "vpo"].includes(c.id);
                return (
                  <button key={c.id}
                    disabled={!available}
                    onClick={() => setActiveComponent(activeComponent === c.id ? null : c.id)}
                    className={`px-2 py-2 rounded-lg border text-xs font-semibold transition-all flex flex-col items-center gap-0.5 ${
                      !available ? "opacity-20 cursor-not-allowed border-gray-800 text-gray-600" :
                      activeComponent === c.id ? "border-transparent text-white" : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
                    }`}
                    style={activeComponent === c.id ? { backgroundColor: accentColor + "20", borderColor: accentColor, color: accentColor } : {}}>
                    <span className="text-lg leading-none">{c.icon}</span>
                    <span className="font-mono text-xs">{c.symbol}</span>
                  </button>
                );
              })}
            </div>
            {selectedComp && (
              <div className="mt-2 p-3 rounded-lg bg-gray-900 border border-gray-700 text-xs text-gray-300 leading-relaxed">
                <p className="font-bold text-white mb-1">{selectedComp.label}</p>
                {selectedComp.desc}
              </div>
            )}
            {!selectedComp && (
              <p className="mt-2 text-gray-600 text-xs flex items-center gap-1"><Info size={11} /> Click a component for details</p>
            )}
          </div>

          {/* Parameters */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">Parameters</p>
            <SliderParam label="Frequency" value={params.freq} min={10} max={120} step={1} onChange={v => updateParam("freq", v)} color="#f59e0b" unit=" Hz" />
            <SliderParam label="Amplitude" value={params.amplitude} min={0.1} max={3} step={0.1} onChange={v => updateParam("amplitude", v)} color="#f97316" unit=" V" />
            <SliderParam label="Resistance" value={params.resistance} min={10} max={200} step={5} onChange={v => updateParam("resistance", v)} color="#6b7280" unit=" Ω" />
            {isOpen && (
              <>
                <div className="h-px bg-gray-800" />
                <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest">Scalar Parameters</p>
                <SliderParam label="φ Oscillation" value={params.phiOscillation} min={0} max={1} step={0.01} onChange={v => updateParam("phiOscillation", v)} color="#a855f7" unit="" />
                <SliderParam label="Vacuum Coupling" value={params.vacuumCoupling} min={0} max={1} step={0.01} onChange={v => updateParam("vacuumCoupling", v)} color="#00ffcc" unit="" />
              </>
            )}

            {/* Theory note */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-gray-400 leading-relaxed">
              {isOpen ? (
                <>
                  <p className="text-teal-300 font-bold mb-1">Open System (Bearden Part 4)</p>
                  The VPO shifts the vacuum ground potential, enabling Dirac Sea electron extraction. The toroidal coil maintains φ &gt; φ₀ with ∇φ=0 inside — the anenergy pump. Current in the wire = massless charge gradient, producing work without V=IR.
                </>
              ) : (
                <>
                  <p className="text-orange-300 font-bold mb-1">Closed System (Classical EM)</p>
                  V=IR governs all energy transfer. The vacuum potential is assumed zero. Scalar phi-field is ignored (Heaviside/Gibbs truncation of Maxwell's equations). COP ≤ 1 enforced by 2nd Law of Thermodynamics.
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Waveform charts */}
        <div className="flex-1 flex flex-col min-h-0 p-4 space-y-3">
          {/* Chart tab bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {CHART_TABS.map(tab => (
              <button key={tab.id} onClick={() => setChartTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  chartTab === tab.id ? "text-white border-transparent" : "border-gray-700 text-gray-500 hover:text-gray-300"
                }`}
                style={chartTab === tab.id ? { backgroundColor: accentColor + "25", borderColor: accentColor, color: accentColor } : {}}>
                {tab.label}
              </button>
            ))}
            <span className="ml-auto text-gray-600 text-xs">{running ? "● Live" : "⏸ Paused"}</span>
          </div>

          {chartTab === "voltage_current" && (
            <div className="flex-1 space-y-3 min-h-0">
              <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-4" style={{ height: "calc(50% - 6px)" }}>
                <p className="text-gray-500 text-xs mb-2 font-semibold uppercase tracking-widest">Voltage Waveform</p>
                <ResponsiveContainer width="100%" height="85%">
                  <LineChart data={waveData} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="t" tick={{ fill: "#4b5563", fontSize: 9 }} tickCount={6} />
                    <YAxis tick={{ fill: "#4b5563", fontSize: 9 }} />
                    <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", fontSize: 11 }} />
                    <ReferenceLine y={0} stroke="#374151" />
                    <Line type="monotone" dataKey="voltage" stroke={accentColor} dot={false} strokeWidth={2} name="V (volts)" isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-4" style={{ height: "calc(50% - 6px)" }}>
                <p className="text-gray-500 text-xs mb-2 font-semibold uppercase tracking-widest">Current Waveform <span className="text-gray-600 font-normal">(×10 scaled)</span></p>
                <ResponsiveContainer width="100%" height="85%">
                  <LineChart data={waveData} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="t" tick={{ fill: "#4b5563", fontSize: 9 }} tickCount={6} />
                    <YAxis tick={{ fill: "#4b5563", fontSize: 9 }} />
                    <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", fontSize: 11 }} />
                    <ReferenceLine y={0} stroke="#374151" />
                    <Line type="monotone" dataKey="current" stroke={isOpen ? "#22c55e" : "#f59e0b"} dot={false} strokeWidth={2} name="I (mA scaled)" isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {chartTab === "phi" && (
            <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-4 min-h-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-300 font-bold text-sm">Scalar Phi-Field (φ) — Longitudinal Wave</p>
                  <p className="text-gray-500 text-xs mt-0.5">No E-field · No B-field · Propagates through the vacuum potential</p>
                </div>
                {!isOpen && (
                  <span className="bg-gray-800 text-gray-500 text-xs px-3 py-1 rounded-full border border-gray-700">φ = 0 in closed system</span>
                )}
              </div>
              <ResponsiveContainer width="100%" height="75%">
                <LineChart data={waveData} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="t" tick={{ fill: "#4b5563", fontSize: 9 }} tickCount={6} />
                  <YAxis tick={{ fill: "#4b5563", fontSize: 9 }} />
                  <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", fontSize: 11 }} />
                  <ReferenceLine y={0} stroke="#374151" />
                  <Line type="monotone" dataKey="phi" stroke="#a855f7" dot={false} strokeWidth={2.5} name="φ (scalar potential)" isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-3 bg-purple-950/30 border border-purple-900/30 rounded-xl p-3 text-xs text-gray-400 leading-relaxed">
                {isOpen
                  ? "The phi-field waveform oscillates at 1.5× the carrier frequency with a +60° phase offset — Bearden's signature of longitudinal scalar wave propagation. Unlike transverse EM waves, this field carries structured information through the vacuum potential without E or B field components. The VPO oscillates this potential to extract energy from the Dirac Sea."
                  : "In a closed system (classical EM), the scalar phi-field is assumed zero per the Heaviside/Gibbs truncation of Maxwell's original quaternion equations. Switching to Open System mode activates the VPO and reveals the phi-field that was always present but ignored."}
              </div>
            </div>
          )}

          {chartTab === "power" && (
            <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-4 min-h-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-300 font-bold text-sm">Power In vs. Power Out</p>
                  <p className="text-gray-500 text-xs mt-0.5">COP = P_out / P_in</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Coefficient of Performance</p>
                  <p className="text-2xl font-black" style={{ color: isOpen ? "#22c55e" : "#9ca3af" }}>{cop}</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="65%">
                <LineChart data={waveData} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="t" tick={{ fill: "#4b5563", fontSize: 9 }} tickCount={6} />
                  <YAxis tick={{ fill: "#4b5563", fontSize: 9 }} />
                  <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", fontSize: 11 }} />
                  <ReferenceLine y={0} stroke="#374151" />
                  <Legend wrapperStyle={{ fontSize: 10, color: "#9ca3af" }} />
                  <Line type="monotone" dataKey="power_in" stroke="#f97316" dot={false} strokeWidth={2} name="P_in" isAnimationActive={false} />
                  <Line type="monotone" dataKey="power_out" stroke="#22c55e" dot={false} strokeWidth={2} name="P_out" isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-3 bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-xs text-gray-400 leading-relaxed">
                {isOpen
                  ? `With vacuum coupling at ${(params.vacuumCoupling * 100).toFixed(0)}%, the open system draws additional energy from the vacuum potential via Dirac Sea oscillation. P_out > P_in — not violating thermodynamics, but treating the vacuum as an external energy source (open system). This is the operating principle of Moray's 50kW device, the Kromrey G-field generator, and Bearden's documented prototypes.`
                  : "Closed system: P_out ≤ P_in at all times. The 2nd Law of Thermodynamics as applied to closed EM systems enforces COP ≤ 1. This is not a fundamental law of nature — it is a constraint of the closed-system assumption. Switch to Open System mode to see what becomes possible when the vacuum is treated as an energy source."}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}