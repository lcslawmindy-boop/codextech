import { useState, useEffect, useRef } from "react";
import { Zap, Activity, Sliders, Play, Square, RefreshCw, Info } from "lucide-react";

// Simulation parameters per invention type
const SIM_CONFIGS = {
  toroid: {
    label: "LC Tank Resonance",
    params: [
      { key: "voltage", label: "Input Voltage (V)", min: 1, max: 24, step: 0.5, default: 12, unit: "V" },
      { key: "frequency", label: "Drive Frequency (kHz)", min: 1, max: 50, step: 0.5, default: 10.7, unit: "kHz" },
      { key: "inductance", label: "Inductance (mH)", min: 0.5, max: 2, step: 0.05, default: 1.0, unit: "mH" },
      { key: "capacitance", label: "Capacitance (nF)", min: 50, max: 500, step: 10, default: 220, unit: "nF" },
    ],
    simulate: (p) => {
      const f0 = 1 / (2 * Math.PI * Math.sqrt(p.inductance * 1e-3 * p.capacitance * 1e-9)) / 1000;
      const detuning = Math.abs(p.frequency - f0) / f0;
      const Q = 35;
      const tankVoltage = (p.voltage * Q) / Math.max(1, 1 + Q * detuning * 10);
      const power = (p.voltage * p.voltage) / (2 * p.inductance);
      return {
        resonantFreq: f0.toFixed(2) + " kHz",
        tankVoltage: tankVoltage.toFixed(1) + " V pk",
        qFactor: Q.toFixed(0),
        inputPower: (power * 0.01).toFixed(2) + " mW",
        status: detuning < 0.02 ? "✅ On Resonance" : detuning < 0.1 ? "⚠️ Near Resonance" : "❌ Off Resonance",
      };
    },
    waveform: (p, t) => {
      const f0 = 1 / (2 * Math.PI * Math.sqrt(p.inductance * 1e-3 * p.capacitance * 1e-9)) / 1000;
      const detuning = Math.abs(p.frequency - f0) / f0;
      const amplitude = p.voltage / Math.max(1, 1 + detuning * 20);
      return Math.sin(2 * Math.PI * p.frequency * t * 0.001) * amplitude;
    },
  },
  meg: {
    label: "MEG Flux Switching",
    params: [
      { key: "voltage", label: "Drive Voltage (V)", min: 5, max: 50, step: 1, default: 12, unit: "V" },
      { key: "frequency", label: "Switching Frequency (kHz)", min: 10, max: 100, step: 5, default: 50, unit: "kHz" },
      { key: "dutyCycle", label: "Duty Cycle (%)", min: 20, max: 80, step: 1, default: 47, unit: "%" },
      { key: "deadTime", label: "Dead Time (µs)", min: 0.2, max: 2, step: 0.1, default: 0.5, unit: "µs" },
    ],
    simulate: (p) => {
      const copBase = 0.85 + (p.frequency / 200);
      const deadTimePenalty = p.deadTime * p.frequency * 0.002;
      const cop = Math.min(1.35, Math.max(0.3, copBase - deadTimePenalty));
      const outputV = p.voltage * 2 * (p.dutyCycle / 100);
      return {
        estimatedCOP: cop.toFixed(3),
        outputVoltage: outputV.toFixed(1) + " V",
        switchingLoss: (deadTimePenalty * 100).toFixed(1) + "%",
        optimalFreq: "20–60 kHz",
        status: cop > 1.0 ? "🔬 COP > 1 — Verify with precision meter" : cop > 0.9 ? "⚠️ Near Unity" : "📉 Below Unity",
      };
    },
    waveform: (p, t) => {
      const period = 1 / (p.frequency * 1000);
      const phase = (t * 0.001) % period;
      const onTime = period * (p.dutyCycle / 100);
      return phase < onTime ? p.voltage : 0;
    },
  },
  generator: {
    label: "Rotor Output Power",
    params: [
      { key: "rpm", label: "Rotor Speed (RPM)", min: 300, max: 1200, step: 50, default: 600, unit: "RPM" },
      { key: "voltage", label: "Capacitor Voltage (V)", min: 100, max: 450, step: 10, default: 300, unit: "V" },
      { key: "airGap", label: "Air Gap (mm)", min: 1.5, max: 3.0, step: 0.1, default: 2.0, unit: "mm" },
      { key: "load", label: "Load Resistance (Ω)", min: 10, max: 500, step: 10, default: 100, unit: "Ω" },
    ],
    simulate: (p) => {
      const backEMF = p.rpm * 0.5;
      const current = Math.max(0, (p.voltage - backEMF) / p.load);
      const outputPower = current * current * p.load;
      const inputPower = p.voltage * current * 1.2;
      const efficiency = inputPower > 0 ? (outputPower / inputPower) * 100 : 0;
      const gFieldCoupling = Math.max(0, 100 - (p.airGap - 2.0) * 50);
      return {
        outputPower: outputPower.toFixed(1) + " W",
        outputCurrent: current.toFixed(2) + " A",
        efficiency: efficiency.toFixed(1) + "%",
        gFieldCoupling: gFieldCoupling.toFixed(0) + "%",
        status: efficiency > 85 ? "✅ High Efficiency" : efficiency > 60 ? "⚠️ Moderate Efficiency" : "📉 Optimize Parameters",
      };
    },
    waveform: (p, t) => {
      const freq = p.rpm / 60 * 8; // 8-pole
      return Math.sin(2 * Math.PI * freq * t * 0.001) * (p.voltage / 10);
    },
  },
  vpo: {
    label: "VPO Tank Resonance",
    params: [
      { key: "voltage", label: "Drive Voltage (V)", min: 1, max: 30, step: 1, default: 5, unit: "V" },
      { key: "frequency", label: "DDS Frequency (MHz)", min: 1, max: 20, step: 0.5, default: 10, unit: "MHz" },
      { key: "capacitance", label: "Tank Capacitance (pF)", min: 10, max: 100, step: 1, default: 25, unit: "pF" },
      { key: "isolation", label: "Ground Isolation (MΩ)", min: 0.1, max: 10, step: 0.1, default: 1, unit: "MΩ" },
    ],
    simulate: (p) => {
      const L = 1e-4; // 100µH
      const C = p.capacitance * 1e-12;
      const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C)) / 1e6;
      const detuning = Math.abs(p.frequency - f0) / f0;
      const vacuumEffect = p.isolation / 10;
      const tankV = p.voltage * 15 * (1 - detuning) * (1 + vacuumEffect * 0.2);
      return {
        resonantFreq: f0.toFixed(2) + " MHz",
        tankVoltage: Math.max(0, tankV).toFixed(1) + " V pk",
        vacuumCoupling: (vacuumEffect * 100).toFixed(0) + "%",
        groundDiff: (p.isolation * 0.1).toFixed(2) + " V",
        status: detuning < 0.03 ? "✅ Resonance" : detuning < 0.1 ? "⚠️ Near Resonance" : "❌ Off Resonance",
      };
    },
    waveform: (p, t) => {
      const L = 1e-4;
      const C = p.capacitance * 1e-12;
      const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C)) / 1e6;
      const detuning = Math.abs(p.frequency - f0) / f0;
      const amp = p.voltage * (1 - Math.min(1, detuning * 5));
      return Math.sin(2 * Math.PI * p.frequency * 1e6 * t * 0.0000001) * amp;
    },
  },
  default: {
    label: "EM Field Simulation",
    params: [
      { key: "voltage", label: "Input Voltage (V)", min: 1, max: 30, step: 0.5, default: 12, unit: "V" },
      { key: "frequency", label: "Frequency (kHz)", min: 1, max: 100, step: 1, default: 10, unit: "kHz" },
      { key: "power", label: "Drive Power (W)", min: 0.1, max: 10, step: 0.1, default: 1, unit: "W" },
    ],
    simulate: (p) => {
      const current = p.power / p.voltage;
      const fieldStrength = Math.sqrt(p.power * p.frequency) * 0.01;
      return {
        current: current.toFixed(3) + " A",
        fieldStrength: fieldStrength.toFixed(2) + " mT",
        wavelength: (300000 / p.frequency).toFixed(1) + " m",
        skinDepth: (503 / Math.sqrt(p.frequency * 1000)).toFixed(2) + " mm",
        status: p.power < 5 ? "✅ Safe Power Level" : "⚠️ High Power — Use Safety Protocols",
      };
    },
    waveform: (p, t) => Math.sin(2 * Math.PI * p.frequency * t * 0.001) * p.voltage,
  },
};

function WaveformCanvas({ waveformFn, params, running }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    const draw = () => {
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = "rgba(6, 182, 212, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Center line
      ctx.strokeStyle = "rgba(6, 182, 212, 0.2)";
      ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();

      // Waveform
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "#06b6d4";
      ctx.beginPath();
      const tOffset = running ? offsetRef.current : 0;
      for (let px = 0; px < W; px++) {
        const t = (px / W) * 100 + tOffset;
        const y_raw = waveformFn(params, t);
        // Normalize
        const maxV = Math.max(params.voltage || 30, 0.1);
        const y = H / 2 - (y_raw / maxV) * (H / 2 - 10);
        if (px === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (running) {
        offsetRef.current += 0.8;
        animRef.current = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [params, running, waveformFn]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={120}
      className="w-full rounded-lg border border-cyan-900/40"
      style={{ background: "#0a0a1a" }}
    />
  );
}

export default function InventionSimulator({ invention }) {
  const diagramType = invention?.diagramType || "default";
  const config = SIM_CONFIGS[diagramType] || SIM_CONFIGS.default;

  const [params, setParams] = useState(() => {
    const p = {};
    config.params.forEach(param => { p[param.key] = param.default; });
    return p;
  });
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    setResults(config.simulate(params));
  }, [params]);

  const handleParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: parseFloat(value) }));
  };

  const reset = () => {
    const p = {};
    config.params.forEach(param => { p[param.key] = param.default; });
    setParams(p);
  };

  return (
    <div className="bg-gray-900 border border-cyan-900/40 rounded-2xl overflow-hidden mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-900/80">
        <div className="flex items-center gap-2">
          <Activity size={15} className="text-cyan-400" />
          <span className="text-white font-bold text-sm">Pre-Build Simulator</span>
          <span className="text-gray-500 text-xs">— {config.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRunning(r => !r)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              running ? "bg-red-800/60 text-red-300 hover:bg-red-700/60" : "bg-cyan-800/60 text-cyan-300 hover:bg-cyan-700/60"
            }`}
          >
            {running ? <><Square size={10} /> Stop</> : <><Play size={10} /> Animate</>}
          </button>
          <button onClick={reset} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-all">
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left: Parameters */}
        <div className="space-y-4">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sliders size={11} /> Parameters
          </p>
          {config.params.map(param => (
            <div key={param.key}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-gray-300 text-xs font-semibold">{param.label}</label>
                <span className="text-cyan-400 text-xs font-black">{params[param.key]} {param.unit}</span>
              </div>
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={params[param.key]}
                onChange={e => handleParam(param.key, e.target.value)}
                className="w-full h-1.5 accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-gray-700 text-xs mt-0.5">
                <span>{param.min}{param.unit}</span>
                <span>{param.max}{param.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Results + Waveform */}
        <div className="space-y-4">
          {/* Waveform */}
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Output Waveform</p>
            <WaveformCanvas waveformFn={config.waveform} params={params} running={running} />
          </div>

          {/* Computed Results */}
          {results && (
            <div className="bg-gray-950/60 border border-gray-800 rounded-xl p-4 space-y-2">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Computed Results</p>
              {Object.entries(results).filter(([k]) => k !== "status").map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                  <span className="text-cyan-300 text-xs font-black font-mono">{value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-800">
                <span className="text-xs font-bold">{results.status}</span>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 bg-yellow-950/20 border border-yellow-800/30 rounded-lg p-3">
            <Info size={12} className="text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-700 text-xs">Simulation is theoretical. Real-world results depend on component tolerances, layout, and environmental conditions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}