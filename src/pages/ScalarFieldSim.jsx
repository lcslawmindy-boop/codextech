import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, RotateCcw, Info, Zap } from "lucide-react";

// ── Slider control ──────────────────────────────────────────────────────
function Slider({ label, value, min, max, step = 0.01, onChange, unit = "", color = "#3b82f6" }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="text-xs text-gray-400 font-semibold">{label}</label>
        <span className="text-xs font-mono" style={{ color }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: color }} />
    </div>
  );
}

// ── Source config ────────────────────────────────────────────────────────
const DEFAULT_SOURCES = [
  { id: 1, freq: 2.0, phase: 0, amplitude: 1.0, x: 0.3, y: 0.5, color: "#3b82f6", label: "Source α" },
  { id: 2, freq: 2.0, phase: 0, amplitude: 1.0, x: 0.7, y: 0.5, color: "#a855f7", label: "Source β" },
  { id: 3, freq: 3.5, phase: Math.PI, amplitude: 0.6, x: 0.5, y: 0.25, color: "#f59e0b", label: "Source γ", active: false },
];

const COLOR_SCHEMES = {
  plasma:   (v) => { const t = (v + 1) / 2; return `hsl(${280 - t * 200},${70 + t * 30}%,${20 + t * 60}%)`; },
  scalar:   (v) => { const t = (v + 1) / 2; return `hsl(${200 + t * 60},${60 + t * 40}%,${15 + t * 65}%)`; },
  fire:     (v) => { const t = (v + 1) / 2; return `hsl(${t * 60},100%,${10 + t * 55}%)`; },
  void:     (v) => { const t = (v + 1) / 2; return `hsl(${120 + t * 120},${50 + t * 50}%,${5 + t * 70}%)`; },
};

const CONCEPTS = [
  { term: "Non-Hertzian Wave", desc: "A scalar wave that exists in potential space rather than in transverse EM fields. Propagates through the vacuum without electromagnetic vectors — pure potential." },
  { term: "Constructive Interference", desc: "When two scalar wave potentials align in phase, their amplitudes add — creating a region of intensified vacuum potential density." },
  { term: "Destructive Interference", desc: "Out-of-phase scalar waves cancel their observable field — but the vacuum potential remains active as a hidden 'locked' energy state (Bearden's 'stress of the vacuum')." },
  { term: "Phase Conjugation", desc: "A time-reversed scalar wave that propagates backward through the medium — the basis of Bearden's theoretical healing beam and overunity energy extraction." },
  { term: "Vacuum Potential (φ)", desc: "The scalar potential field of the vacuum — the underlying substrate from which all observable EM fields emerge. In non-Hertzian physics, this is directly engineerable." },
  { term: "Superposition Zone", desc: "Where multiple scalar sources overlap, the combined vacuum potential creates anomalous energy densities — the target region for overunity extraction." },
];

export default function ScalarFieldSim() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const timeRef = useRef(0);

  const [running, setRunning] = useState(true);
  const [sources, setSources] = useState(DEFAULT_SOURCES.map(s => ({ ...s, active: s.active !== false })));
  const [colorScheme, setColorScheme] = useState("plasma");
  const [resolution, setResolution] = useState(3); // pixel block size
  const [speed, setSpeed] = useState(0.8);
  const [showVectors, setShowVectors] = useState(false);
  const [showNodes, setShowNodes] = useState(true);
  const [dragging, setDragging] = useState(null);
  const [selectedSource, setSelectedSource] = useState(0);
  const [showConcept, setShowConcept] = useState(null);
  const [mode, setMode] = useState("interference"); // interference | standing | conjugate

  const getColorFn = useCallback(() => COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.plasma, [colorScheme]);

  // ── Render loop ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const activeSources = sources.filter(s => s.active);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const t = timeRef.current;
      const colorFn = getColorFn();
      const res = resolution;

      // Pixel-block rendering for performance
      for (let py = 0; py < H; py += res) {
        for (let px = 0; px < W; px += res) {
          const nx = px / W;
          const ny = py / H;

          let potential = 0;
          for (const src of activeSources) {
            const dx = nx - src.x;
            const dy = ny - src.y;
            const r = Math.sqrt(dx * dx + dy * dy) + 0.001;

            let wave = 0;
            if (mode === "interference") {
              // Standard scalar wave: amplitude * cos(k*r - omega*t + phase) / r^0.5
              wave = (src.amplitude / Math.sqrt(r)) * Math.cos(2 * Math.PI * src.freq * (r - t * speed) + src.phase);
            } else if (mode === "standing") {
              // Standing wave: sum of forward + backward propagation
              const forward = Math.cos(2 * Math.PI * src.freq * r - t * speed + src.phase);
              const backward = Math.cos(2 * Math.PI * src.freq * r + t * speed + src.phase);
              wave = (src.amplitude / Math.sqrt(r)) * (forward + backward) * 0.5;
            } else if (mode === "conjugate") {
              // Phase conjugate: time-reversed wave added
              const direct = Math.cos(2 * Math.PI * src.freq * (r - t * speed) + src.phase);
              const conjugate = Math.cos(2 * Math.PI * src.freq * (r + t * speed) - src.phase);
              wave = (src.amplitude / Math.sqrt(r)) * (direct + conjugate * 0.7);
            }
            potential += wave;
          }

          // Clamp and colorize
          const clamped = Math.max(-1, Math.min(1, potential / Math.max(activeSources.length, 1)));
          ctx.fillStyle = colorFn(clamped);
          ctx.fillRect(px, py, res, res);
        }
      }

      // ── Vector field overlay ─────────────────────────────────────────
      if (showVectors) {
        const step = 40;
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.lineWidth = 1;
        for (let py = step / 2; py < H; py += step) {
          for (let px = step / 2; px < W; px += step) {
            const nx = px / W;
            const ny = py / H;
            let gx = 0, gy = 0;
            for (const src of activeSources) {
              const dx = nx - src.x;
              const dy = ny - src.y;
              const r2 = dx * dx + dy * dy + 0.001;
              const mag = src.amplitude / (r2 * 10);
              gx += (dx / Math.sqrt(r2)) * mag;
              gy += (dy / Math.sqrt(r2)) * mag;
            }
            const len = Math.sqrt(gx * gx + gy * gy);
            if (len > 0.001) {
              const scale = Math.min(len * 400, 16);
              const ex = px + (gx / len) * scale;
              const ey = py + (gy / len) * scale;
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(ex, ey);
              ctx.stroke();
            }
          }
        }
      }

      // ── Source nodes ─────────────────────────────────────────────────
      if (showNodes) {
        sources.forEach((src, i) => {
          const sx = src.x * W;
          const sy = src.y * H;
          const pulse = 1 + 0.2 * Math.sin(t * speed * 4 + i);

          ctx.beginPath();
          ctx.arc(sx, sy, 14 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = src.active ? src.color + "30" : "#33333330";
          ctx.fill();

          ctx.beginPath();
          ctx.arc(sx, sy, 8, 0, Math.PI * 2);
          ctx.fillStyle = src.active ? src.color : "#555";
          ctx.fill();

          ctx.fillStyle = "#fff";
          ctx.font = "bold 8px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(src.label.split(" ")[1], sx, sy);

          // Highlight selected
          if (i === selectedSource) {
            ctx.beginPath();
            ctx.arc(sx, sy, 12, 0, Math.PI * 2);
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        });
      }

      if (running) {
        timeRef.current += 0.016;
        animRef.current = requestAnimationFrame(draw);
      }
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [sources, colorScheme, resolution, speed, showVectors, showNodes, running, selectedSource, mode, getColorFn]);

  // ── Canvas resize ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Drag source nodes ────────────────────────────────────────────────
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    for (let i = 0; i < sources.length; i++) {
      const dx = mx - sources[i].x;
      const dy = my - sources[i].y;
      if (Math.sqrt(dx * dx + dy * dy) < 0.04) {
        setDragging(i);
        setSelectedSource(i);
        return;
      }
    }
  };

  const handleMouseMove = (e) => {
    if (dragging === null) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width));
    const my = Math.max(0.05, Math.min(0.95, (e.clientY - rect.top) / rect.height));
    setSources(prev => prev.map((s, i) => i === dragging ? { ...s, x: mx, y: my } : s));
  };

  const handleMouseUp = () => setDragging(null);

  const updateSource = (i, key, val) => setSources(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  const resetSources = () => { setSources(DEFAULT_SOURCES.map(s => ({ ...s, active: s.active !== false }))); timeRef.current = 0; };

  const src = sources[selectedSource];

  return (
    <div className="w-screen h-screen bg-gray-950 flex flex-col overflow-hidden text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm"><ArrowLeft size={13} /> Back</Link>
          <div className="w-px h-4 bg-gray-700" />
          <Zap size={14} className="text-cyan-400" />
          <div>
            <h1 className="text-white font-bold text-sm leading-none">Scalar EM Field Simulator</h1>
            <p className="text-gray-500 text-xs">Non-Hertzian vacuum potential · interference · phase conjugation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Mode */}
          <div className="flex bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            {[["interference", "Interference"], ["standing", "Standing"], ["conjugate", "Conjugate"]].map(([id, label]) => (
              <button key={id} onClick={() => setMode(id)}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${mode === id ? "bg-cyan-900/60 text-cyan-300" : "text-gray-500 hover:text-gray-300"}`}>
                {label}
              </button>
            ))}
          </div>
          {/* Color scheme */}
          <select value={colorScheme} onChange={e => setColorScheme(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none">
            <option value="plasma">Plasma</option>
            <option value="scalar">Scalar Blue</option>
            <option value="fire">Fire</option>
            <option value="void">Void Green</option>
          </select>
          <button onClick={() => setShowVectors(v => !v)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${showVectors ? "bg-yellow-900/40 border-yellow-700 text-yellow-300" : "border-gray-700 text-gray-500 hover:text-gray-300"}`}>
            Vectors
          </button>
          <button onClick={() => { setRunning(r => !r); }} className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${running ? "bg-red-900/30 border-red-800 text-red-300" : "bg-green-900/30 border-green-800 text-green-300"}`}>
            {running ? <><Pause size={11} /> Pause</> : <><Play size={11} /> Play</>}
          </button>
          <button onClick={resetSources} className="px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white text-xs flex items-center gap-1.5 transition-colors">
            <RotateCcw size={11} /> Reset
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* ── Canvas ── */}
        <div className="flex-1 relative cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}>
          <canvas ref={canvasRef} className="w-full h-full" />

          {/* Hint overlay */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-gray-600 bg-gray-900/60 px-3 py-1.5 rounded-full pointer-events-none">
            Drag source nodes · Click to select
          </div>

          {/* Mode badge */}
          <div className="absolute top-3 left-3 bg-gray-900/80 border border-gray-700 rounded-lg px-3 py-1.5 text-xs">
            <span className="text-cyan-400 font-bold uppercase tracking-wider">{mode}</span>
            <span className="text-gray-500 ml-2">wave mode</span>
          </div>
        </div>

        {/* ── Control Panel ── */}
        <div className="w-72 flex-shrink-0 border-l border-gray-800 bg-gray-900/60 flex flex-col overflow-y-auto">
          {/* Source tabs */}
          <div className="flex border-b border-gray-800 flex-shrink-0">
            {sources.map((s, i) => (
              <button key={s.id} onClick={() => setSelectedSource(i)}
                className={`flex-1 py-2 text-xs font-bold transition-colors border-b-2 ${selectedSource === i ? "border-current" : "border-transparent text-gray-600 hover:text-gray-400"}`}
                style={{ color: selectedSource === i ? s.color : undefined }}>
                {s.label.split(" ")[1]}
              </button>
            ))}
          </div>

          {src && (
            <div className="p-4 space-y-4 flex-1">
              {/* Active toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: src.color }}>{src.label}</span>
                <button onClick={() => updateSource(selectedSource, "active", !src.active)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${src.active ? "bg-green-900/40 text-green-300 border border-green-700" : "bg-gray-800 text-gray-500 border border-gray-700"}`}>
                  {src.active ? "Active" : "Off"}
                </button>
              </div>

              <div className={`space-y-4 transition-opacity ${src.active ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                <Slider label="Frequency (ω)" value={src.freq} min={0.5} max={6} step={0.05} unit=" Hz"
                  color={src.color} onChange={v => updateSource(selectedSource, "freq", v)} />
                <Slider label="Phase (φ)" value={+(src.phase / Math.PI).toFixed(2)} min={0} max={2} step={0.05} unit="π"
                  color={src.color} onChange={v => updateSource(selectedSource, "phase", v * Math.PI)} />
                <Slider label="Amplitude (A)" value={src.amplitude} min={0.1} max={2} step={0.05}
                  color={src.color} onChange={v => updateSource(selectedSource, "amplitude", v)} />
                <div className="grid grid-cols-2 gap-3">
                  <Slider label="Position X" value={+src.x.toFixed(2)} min={0.05} max={0.95} step={0.01}
                    color={src.color} onChange={v => updateSource(selectedSource, "x", v)} />
                  <Slider label="Position Y" value={+src.y.toFixed(2)} min={0.05} max={0.95} step={0.01}
                    color={src.color} onChange={v => updateSource(selectedSource, "y", v)} />
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 space-y-3">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Global Settings</p>
                <Slider label="Time Speed" value={speed} min={0.1} max={3} step={0.05} color="#22c55e"
                  onChange={setSpeed} />
                <Slider label="Resolution" value={resolution} min={1} max={8} step={1} color="#f59e0b"
                  onChange={setResolution} />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showNodes} onChange={e => setShowNodes(e.target.checked)} className="accent-cyan-500" />
                  <span className="text-xs text-gray-400">Show source nodes</span>
                </label>
              </div>

              {/* Phase relationship readout */}
              <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3">
                <p className="text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Phase Relationship</p>
                {sources.filter(s => s.active).length >= 2 && (() => {
                  const s1 = sources.find(s => s.active);
                  const s2 = sources.filter(s => s.active)[1];
                  const phaseDiff = Math.abs(s1.phase - s2.phase) % (2 * Math.PI);
                  const deg = +(phaseDiff * 180 / Math.PI).toFixed(1);
                  const freqMatch = Math.abs(s1.freq - s2.freq) < 0.1;
                  const isConstructive = deg < 30 || deg > 330;
                  const isDestructive = deg > 150 && deg < 210;
                  return (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-300">Δφ = <span className="font-mono text-white">{deg}°</span></p>
                      <p className="text-xs text-gray-300">Δf = <span className="font-mono text-white">{Math.abs(s1.freq - s2.freq).toFixed(2)} Hz</span></p>
                      <p className={`text-xs font-bold mt-1 ${isConstructive ? "text-green-400" : isDestructive ? "text-red-400" : "text-yellow-400"}`}>
                        {isConstructive ? "✦ Constructive — vacuum potential peak" : isDestructive ? "✧ Destructive — locked scalar stress" : "◈ Partial — mixed potential zone"}
                      </p>
                      {!freqMatch && <p className="text-xs text-orange-400">≠ Freq mismatch → beat pattern</p>}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Concepts */}
          <div className="border-t border-gray-800 p-3 flex-shrink-0">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Info size={10} /> Concepts</p>
            <div className="space-y-1">
              {CONCEPTS.map((c, i) => (
                <div key={i}>
                  <button onClick={() => setShowConcept(showConcept === i ? null : i)}
                    className="w-full text-left text-xs text-cyan-400 hover:text-cyan-300 py-1 transition-colors font-semibold">
                    {c.term}
                  </button>
                  {showConcept === i && (
                    <p className="text-gray-400 text-xs leading-relaxed pb-2 pl-2 border-l border-gray-700">{c.desc}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}