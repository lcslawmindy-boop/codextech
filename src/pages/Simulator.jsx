import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap, FlaskConical, RotateCcw, Info } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Area, AreaChart, Legend
} from "recharts";

// ── Simulation models ─────────────────────────────────────────────────────────

function computeEnergyBottle({ transmitterPower, phaseOffset, interferenceAngle, mediumDensity, pulseFrequency }) {
  return Array.from({ length: 60 }, (_, i) => {
    const t = i / 10;
    // Scalar interference amplitude (zero-vector zone from two transmitters)
    const interference = Math.cos((phaseOffset * Math.PI) / 180) * transmitterPower;
    // Constructive E=0 B=0 zone — energy bottle depth
    const bottleDepth = interference * Math.cos((interferenceAngle * Math.PI) / 180);
    // Standing wave resonance in the medium
    const resonance = Math.sin(2 * Math.PI * pulseFrequency * t + phaseOffset / 30) * mediumDensity;
    const scalarOutput = bottleDepth * (1 + 0.4 * resonance) * Math.exp(-0.04 * t);
    const hertzLoss = transmitterPower * 0.18 * (1 - mediumDensity / 10) * Math.exp(-0.08 * t);
    const netExtraction = Math.max(0, scalarOutput - hertzLoss);
    return {
      t: +t.toFixed(1),
      "Scalar Output": +scalarOutput.toFixed(3),
      "Hertz Loss": +hertzLoss.toFixed(3),
      "Net Extraction": +netExtraction.toFixed(3),
    };
  });
}

function computeAnenergy({ phiAmplitude, oscillationRate, groundPotential, trapEfficiency, morayFactor }) {
  return Array.from({ length: 60 }, (_, i) => {
    const t = i / 10;
    // phi-field vs energy distinction — phi > phi_zero inside shield
    const phiInside = phiAmplitude * (1 - groundPotential / 10);
    // Gradient-phi in the wire (anenergy extraction pathway)
    const gradPhi = phiInside * trapEfficiency * Math.sin(2 * Math.PI * oscillationRate * t);
    // Moray steady-state emission (oscillated phi)
    const morayEmission = morayFactor * phiAmplitude * (1 - Math.exp(-oscillationRate * t)) * 0.5;
    // Conventional current produced from massless charge conversion
    const conventionalCurrent = Math.abs(gradPhi) * trapEfficiency;
    const totalOutput = conventionalCurrent + morayEmission;
    return {
      t: +t.toFixed(1),
      "φ Gradient (Wire)": +Math.abs(gradPhi).toFixed(3),
      "Moray Emission": +morayEmission.toFixed(3),
      "Total Output": +totalOutput.toFixed(3),
    };
  });
}

// ── Slider component ──────────────────────────────────────────────────────────

function Slider({ label, info, min, max, step, value, onChange, color }) {
  const [showInfo, setShowInfo] = useState(false);
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-300 text-sm font-medium">{label}</span>
          <button onClick={() => setShowInfo(s => !s)} className="text-gray-600 hover:text-gray-400">
            <Info size={12} />
          </button>
        </div>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>{value}</span>
      </div>
      {showInfo && <p className="text-xs text-gray-500 leading-relaxed bg-gray-800 rounded-lg px-3 py-2">{info}</p>}
      <div className="relative h-2 bg-gray-800 rounded-full">
        <div className="absolute h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color + "80" }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
        />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all"
          style={{ left: `calc(${pct}% - 8px)`, backgroundColor: color }} />
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, unit, color, description }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className="font-bold text-2xl" style={{ color }}>{value}<span className="text-sm font-normal text-gray-500 ml-1">{unit}</span></p>
      <p className="text-gray-600 text-xs mt-1">{description}</p>
    </div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-2">t = {label}s</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <span className="font-bold">{p.value}</span></p>
      ))}
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

const MODES = [
  { id: "bottle", label: "Energy Bottle", icon: "🎯", color: "#3b82f6", source: "Bearden Part 4 (1983) — Two-transmitter zero-vector interference architecture" },
  { id: "anenergy", label: "Anenergy Pump", icon: "⚡", color: "#22c55e", source: "Bearden Part 4 (1983) — φ-field extraction via shielded toroidal geometry" },
];

const BOTTLE_DEFAULTS = {
  transmitterPower: 5,
  phaseOffset: 45,
  interferenceAngle: 90,
  mediumDensity: 5,
  pulseFrequency: 1.5,
};

const ANENERGY_DEFAULTS = {
  phiAmplitude: 7,
  oscillationRate: 2,
  groundPotential: 3,
  trapEfficiency: 0.6,
  morayFactor: 0.8,
};

export default function Simulator() {
  const [mode, setMode] = useState("bottle");
  const [bottle, setBottle] = useState(BOTTLE_DEFAULTS);
  const [anenergy, setAnenergy] = useState(ANENERGY_DEFAULTS);

  const activeMode = MODES.find(m => m.id === mode);

  const data = useMemo(() => {
    if (mode === "bottle") return computeEnergyBottle(bottle);
    return computeAnenergy(anenergy);
  }, [mode, bottle, anenergy]);

  const lastPoint = data[data.length - 1];
  const peakOutput = Math.max(...data.map(d =>
    mode === "bottle" ? d["Net Extraction"] : d["Total Output"]
  ));
  const avgOutput = (data.reduce((s, d) =>
    s + (mode === "bottle" ? d["Net Extraction"] : d["Total Output"]), 0) / data.length).toFixed(3);

  const lines = mode === "bottle"
    ? [
        { key: "Scalar Output", color: "#3b82f6" },
        { key: "Hertz Loss", color: "#ef4444" },
        { key: "Net Extraction", color: "#22c55e" },
      ]
    : [
        { key: "φ Gradient (Wire)", color: "#a855f7" },
        { key: "Moray Emission", color: "#f59e0b" },
        { key: "Total Output", color: "#22c55e" },
      ];

  const setParam = (setter, key) => (val) => setter(prev => ({ ...prev, [key]: val }));

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">Bearden EM Simulator</h1>
            <p className="text-gray-500 text-xs">Adjust parameters to visualize scalar EM energy dynamics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                mode === m.id
                  ? "text-white border-transparent"
                  : "bg-transparent text-gray-400 border-gray-700 hover:border-gray-500"
              }`}
              style={mode === m.id ? { backgroundColor: m.color + "30", borderColor: m.color } : {}}
            >
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Controls panel */}
        <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-800 overflow-y-auto">
          <div className="p-5 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-sm uppercase tracking-widest">Parameters</h2>
              <button
                onClick={() => mode === "bottle" ? setBottle(BOTTLE_DEFAULTS) : setAnenergy(ANENERGY_DEFAULTS)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            <div className="text-xs text-gray-600 bg-gray-900 rounded-lg px-3 py-2 border border-gray-800">
              <span className="font-semibold text-gray-500">Source: </span>{activeMode.source}
            </div>

            {mode === "bottle" ? (
              <div className="space-y-5">
                <Slider label="Transmitter Power" info="Output amplitude of each zero-vector transmitter. Higher power increases scalar field strength at the interference zone." min={1} max={10} step={0.5} value={bottle.transmitterPower} onChange={setParam(setBottle, "transmitterPower")} color="#3b82f6" />
                <Slider label="Phase Offset (°)" info="Phase difference between the two transmitters. 180° creates maximum cancellation of transverse EM, maximizing the scalar energy bottle depth." min={0} max={180} step={5} value={bottle.phaseOffset} onChange={setParam(setBottle, "phaseOffset")} color="#3b82f6" />
                <Slider label="Interference Angle (°)" info="Geometric angle between transmitter axes. 90° gives maximum orthogonal interference for clean E=0, B=0 zone formation." min={10} max={180} step={5} value={bottle.interferenceAngle} onChange={setParam(setBottle, "interferenceAngle")} color="#8b5cf6" />
                <Slider label="Medium Density" info="Density/permittivity of target medium. Affects standing wave resonance in the energy bottle zone." min={1} max={10} step={0.5} value={bottle.mediumDensity} onChange={setParam(setBottle, "mediumDensity")} color="#06b6d4" />
                <Slider label="Pulse Frequency (Hz)" info="Repetition rate of scalar pulses. Optimal frequency locks into medium resonance windows for maximum energy capture." min={0.1} max={5} step={0.1} value={bottle.pulseFrequency} onChange={setParam(setBottle, "pulseFrequency")} color="#f59e0b" />
              </div>
            ) : (
              <div className="space-y-5">
                <Slider label="φ Amplitude" info="Magnitude of the phi-field maintained above phi-zero inside the shielded toroidal geometry. Determines available anenergy for extraction." min={1} max={10} step={0.5} value={anenergy.phiAmplitude} onChange={setParam(setAnenergy, "phiAmplitude")} color="#22c55e" />
                <Slider label="Oscillation Rate (Hz)" info="Rate at which phi is oscillated. Moray-type steady emission requires resonant oscillation — higher rates increase emission but reduce per-cycle depth." min={0.1} max={5} step={0.1} value={anenergy.oscillationRate} onChange={setParam(setAnenergy, "oscillationRate")} color="#22c55e" />
                <Slider label="Ground Potential" info="External ground reference level. Lower ground potential maximizes gradient-phi in the output wire, increasing conventional current extraction." min={0} max={9} step={0.5} value={anenergy.groundPotential} onChange={setParam(setAnenergy, "groundPotential")} color="#ef4444" />
                <Slider label="Trap Efficiency" info="Fraction of massless charge successfully converted to conventional current through the output wire. Depends on coil geometry and shielding quality." min={0.1} max={1} step={0.05} value={anenergy.trapEfficiency} onChange={setParam(setAnenergy, "trapEfficiency")} color="#a855f7" />
                <Slider label="Moray Factor" info="Amplification coefficient for steady-state Moray emission. Represents the vacuum oscillation resonance quality factor of the phi-application circuit." min={0.1} max={2} step={0.1} value={anenergy.morayFactor} onChange={setParam(setAnenergy, "morayFactor")} color="#f59e0b" />
              </div>
            )}
          </div>
        </div>

        {/* Chart + stats */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              label={mode === "bottle" ? "Peak Net Extraction" : "Peak Total Output"}
              value={peakOutput.toFixed(3)} unit="u"
              color={activeMode.color}
              description="Maximum instantaneous output"
            />
            <StatCard
              label="Average Output"
              value={avgOutput} unit="u"
              color="#f59e0b"
              description="Mean over full time window"
            />
            <StatCard
              label={mode === "bottle" ? "Final Extraction" : "Final Output"}
              value={(mode === "bottle" ? lastPoint["Net Extraction"] : lastPoint["Total Output"]).toFixed(3)} unit="u"
              color="#a855f7"
              description="Output at t = 6.0s"
            />
          </div>

          {/* Main chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              {mode === "bottle" ? <Zap size={15} className="text-blue-400" /> : <FlaskConical size={15} className="text-green-400" />}
              <h2 className="text-white font-semibold text-sm">
                {mode === "bottle" ? "Energy Bottle — Scalar Interference Dynamics" : "Anenergy Pump — φ-Field Extraction Dynamics"}
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {lines.map(l => (
                    <linearGradient key={l.key} id={`grad-${l.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={l.color} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={l.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="t" stroke="#4b5563" tick={{ fill: "#6b7280", fontSize: 11 }} label={{ value: "Time (s)", position: "insideBottom", fill: "#6b7280", fontSize: 11, dy: 10 }} />
                <YAxis stroke="#4b5563" tick={{ fill: "#6b7280", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af", paddingTop: 8 }} />
                <ReferenceLine y={0} stroke="#374151" />
                {lines.map(l => (
                  <Area
                    key={l.key}
                    type="monotone"
                    dataKey={l.key}
                    stroke={l.color}
                    strokeWidth={2}
                    fill={`url(#grad-${l.key})`}
                    dot={false}
                    activeDot={{ r: 4, fill: l.color }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Theory note */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
            <span className="text-gray-400 font-semibold">Theoretical basis: </span>
            {mode === "bottle"
              ? "Two zero-vector transmitters produce an interference zone where E=0, B=0 at each transmitter output but scalar energy (phi-field) accumulates at the intersection. The 'Energy Bottle' concept (Bearden Part 4) demonstrates that removing the transverse EM components while sustaining phi creates a capturable energy reservoir. Pulse timing (scalar arrives instantaneously vs. Hertz at c) enables range-finding without conventional reflection."
              : "The anenergy pump (Bearden Part 4) uses a shielded toroidal geometry where gradient-phi inside = 0 while phi > phi-zero is maintained externally. Trapped massless charges connected via wire to ground produce gradient-phi in the wire — conventional current without mass-current input. Oscillating the phi-application at resonance achieves steady Moray-type emission, the mechanism Bearden attributes to T.H. Moray's documented 50kW demonstration."}
          </div>
        </div>
      </div>
    </div>
  );
}