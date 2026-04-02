import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Play, Pause, Save, RotateCcw, FlaskConical,
  Trash2, ChevronDown, ChevronUp, Loader2, Check, Camera
} from "lucide-react";
import { base44 } from "@/api/base44Client";

// ── Color schemes ─────────────────────────────────────────────────────────────
const COLOR_SCHEMES = {
  plasma: (v) => { const t = (v + 1) / 2; return `hsl(${280 - t * 220},${80 + t * 20}%,${10 + t * 65}%)`; },
  cyan:   (v) => { const t = (v + 1) / 2; return `hsl(${190 - t * 30},${60 + t * 40}%,${5 + t * 70}%)`; },
  green:  (v) => { const t = (v + 1) / 2; return `hsl(${140 - t * 40},${50 + t * 50}%,${5 + t * 65}%)`; },
  orange: (v) => { const t = (v + 1) / 2; return `hsl(${30 + t * 15},${70 + t * 30}%,${5 + t * 70}%)`; },
};

const SOURCES = [
  { key: "s1", label: "S1", color: "#60a5fa", dot: "bg-blue-400",   defX: 25, defY: 35 },
  { key: "s2", label: "S2", color: "#f472b6", dot: "bg-pink-400",   defX: 75, defY: 35 },
  { key: "s3", label: "S3", color: "#34d399", dot: "bg-emerald-400",defX: 25, defY: 65 },
  { key: "s4", label: "S4", color: "#fb923c", dot: "bg-orange-400", defX: 75, defY: 65 },
];

const makeDefaults = () => {
  const p = { colorScheme: "plasma", showVectors: false, coherence: 0 };
  SOURCES.forEach((s, i) => {
    p[`${s.key}_freq`]  = 1.2;
    p[`${s.key}_phase`] = i * 90;
    p[`${s.key}_amp`]   = 1.0;
    p[`${s.key}_x`]     = s.defX;
    p[`${s.key}_y`]     = s.defY;
  });
  return p;
};
const DEFAULT_PARAMS = makeDefaults();

// ── Slider ────────────────────────────────────────────────────────────────────
function Ctrl({ label, min, max, step, value, onChange, color = "#a855f7" }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-xs">{label}</span>
        <span className="text-xs font-bold tabular-nums" style={{ color }}>{value}</span>
      </div>
      <div className="relative h-1.5 bg-gray-800 rounded-full">
        <div className="absolute h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: color + "80" }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-1.5" />
        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow"
          style={{ left: `calc(${pct}% - 6px)`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ── Saved experiment row ──────────────────────────────────────────────────────
function ExperimentRow({ exp, onLoad, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700">
      <div className="min-w-0">
        <p className="text-white text-xs font-semibold truncate">{exp.name}</p>
        {exp.notes && <p className="text-gray-500 text-xs truncate">{exp.notes}</p>}
      </div>
      <div className="flex gap-1 flex-shrink-0">
        <button onClick={() => onLoad(exp)} className="text-xs px-2 py-1 rounded bg-purple-900/50 text-purple-300 hover:bg-purple-800 transition-colors">Load</button>
        <button onClick={() => onDelete(exp.id)} className="text-gray-600 hover:text-red-400 p-1 transition-colors"><Trash2 size={12} /></button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LabSimulation() {
  const canvasRef  = useRef(null);
  const animRef    = useRef(null);
  const timeRef    = useRef(0);
  const paramsRef  = useRef({ ...DEFAULT_PARAMS });

  const [params,      setParams]      = useState({ ...DEFAULT_PARAMS });
  const [running,     setRunning]     = useState(true);
  const [showSave,    setShowSave]    = useState(false);
  const [saveName,    setSaveName]    = useState("");
  const [saveNotes,   setSaveNotes]   = useState("");
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [experiments, setExperiments] = useState([]);
  const [showExps,    setShowExps]    = useState(true);
  const [fps,         setFps]         = useState(0);
  const [screenshot,  setScreenshot]  = useState(false);

  useEffect(() => { paramsRef.current = params; }, [params]);
  const setP = (key, val) => setParams(p => ({ ...p, [key]: val }));

  // ── Render ──────────────────────────────────────────────────────────────────
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const p = paramsRef.current;
    const t = timeRef.current;
    const colorFn = COLOR_SCHEMES[p.colorScheme];

    // Effective phases with coherence offset
    const effPhases = SOURCES.map((s, i) =>
      p[`${s.key}_phase`] + i * p.coherence
    );

    const srcCoords = SOURCES.map((s, i) => ({
      x: (p[`${s.key}_x`] / 100) * W,
      y: (p[`${s.key}_y`] / 100) * H,
      freq: p[`${s.key}_freq`],
      amp: p[`${s.key}_amp`],
      phase: effPhases[i],
      color: s.color,
      label: s.label,
    }));

    const step = 4;
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        let sum = 0;
        for (const s of srcCoords) {
          const d = Math.sqrt((x - s.x) ** 2 + (y - s.y) ** 2);
          sum += s.amp * Math.sin(2 * Math.PI * s.freq * (t - d / 120) + (s.phase * Math.PI / 180));
        }
        ctx.fillStyle = colorFn(sum / SOURCES.length);
        ctx.fillRect(x, y, step, step);
      }
    }

    // Source nodes
    srcCoords.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "white";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(s.label, s.x, s.y + 4);
    });

    // Vector overlay
    if (p.showVectors) {
      const gStep = 32;
      for (let gy = gStep; gy < H; gy += gStep) {
        for (let gx = gStep; gx < W; gx += gStep) {
          let vx = 0, vy = 0;
          for (const s of srcCoords) {
            const d = Math.sqrt((gx - s.x) ** 2 + (gy - s.y) ** 2) || 1;
            vx += s.amp * (gx - s.x) / d / d;
            vy += s.amp * (gy - s.y) / d / d;
          }
          const len = Math.sqrt(vx * vx + vy * vy) || 1;
          const ex = gx + (vx / len) * 10, ey = gy + (vy / len) * 10;
          ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(ex, ey);
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }, []);

  // ── Animation loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    let last = performance.now(), frameCount = 0, fpsLast = last;
    const loop = (now) => {
      const dt = (now - last) / 1000; last = now;
      if (paramsRef.current._running !== false) timeRef.current += dt;
      renderFrame();
      frameCount++;
      if (now - fpsLast > 1000) { setFps(frameCount); frameCount = 0; fpsLast = now; }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [renderFrame]);

  useEffect(() => { paramsRef.current._running = running; }, [running]);

  // ── Resize ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width; canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Drag sources ────────────────────────────────────────────────────────────
  const dragging = useRef(null);
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    let closest = null, minD = Infinity;
    SOURCES.forEach(s => {
      const d = Math.hypot(mx - params[`${s.key}_x`], my - params[`${s.key}_y`]);
      if (d < 5 && d < minD) { minD = d; closest = s.key; }
    });
    dragging.current = closest;
  };
  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = +Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)).toFixed(1);
    const my = +Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)).toFixed(1);
    setParams(p => ({ ...p, [`${dragging.current}_x`]: mx, [`${dragging.current}_y`]: my }));
  };
  const handleMouseUp = () => { dragging.current = null; };

  // ── Screenshot ──────────────────────────────────────────────────────────────
  const handleScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setScreenshot(true);
    const link = document.createElement("a");
    link.download = `scalar-em-lab-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setTimeout(() => setScreenshot(false), 2000);
  };

  // ── Experiments ─────────────────────────────────────────────────────────────
  const loadExperiments = async () => {
    const user = await base44.auth.me();
    const list = await base44.entities.LabExperiment.filter({ created_by: user.email });
    setExperiments(list);
  };
  useEffect(() => { loadExperiments(); }, []);

  const handleSave = async () => {
    if (!saveName.trim()) return;
    setSaving(true);
    await base44.entities.LabExperiment.create({
      name: saveName.trim(), notes: saveNotes.trim(),
      source1_freq: params.s1_freq, source1_phase: params.s1_phase, source1_amplitude: params.s1_amp,
      source1_x: params.s1_x, source1_y: params.s1_y,
      source2_freq: params.s2_freq, source2_phase: params.s2_phase, source2_amplitude: params.s2_amp,
      source2_x: params.s2_x, source2_y: params.s2_y,
      color_scheme: params.colorScheme, show_vectors: params.showVectors,
    });
    setSaving(false); setSaved(true);
    setSaveName(""); setSaveNotes(""); setShowSave(false);
    setTimeout(() => setSaved(false), 2000);
    loadExperiments();
  };

  const handleLoad = (exp) => {
    setParams(p => ({
      ...p,
      s1_freq: exp.source1_freq, s1_phase: exp.source1_phase, s1_amp: exp.source1_amplitude,
      s1_x: exp.source1_x, s1_y: exp.source1_y,
      s2_freq: exp.source2_freq, s2_phase: exp.source2_phase, s2_amp: exp.source2_amplitude,
      s2_x: exp.source2_x, s2_y: exp.source2_y,
      colorScheme: exp.color_scheme, showVectors: exp.show_vectors,
    }));
  };

  const handleDelete = async (id) => {
    await base44.entities.LabExperiment.delete(id);
    loadExperiments();
  };

  const PRESETS = [
    { label: "Zero-Vector Cancel",  s: { s1_phase: 0, s2_phase: 180, s3_phase: 0,  s4_phase: 180, s1_freq: 1.2, s2_freq: 1.2, s3_freq: 1.2, s4_freq: 1.2, coherence: 0 } },
    { label: "Constructive Max",    s: { s1_phase: 0, s2_phase: 0,   s3_phase: 0,  s4_phase: 0,   s1_freq: 1.5, s2_freq: 1.5, s3_freq: 1.5, s4_freq: 1.5, coherence: 0 } },
    { label: "Beat Frequency",      s: { s1_freq: 1.0, s2_freq: 1.3, s3_freq: 0.9, s4_freq: 1.4,  s1_phase: 0, s2_phase: 0, s3_phase: 0, s4_phase: 0, coherence: 0 } },
    { label: "Scalar Bottle",       s: { s1_freq: 2.0, s2_freq: 2.0, s3_freq: 2.0, s4_freq: 2.0,  s1_phase: 0, s2_phase: 90, s3_phase: 180, s4_phase: 270, coherence: 0 } },
    { label: "Phase Cascade",       s: { s1_phase: 0, s2_phase: 0, s3_phase: 0, s4_phase: 0, coherence: 45 } },
  ];

  return (
    <div className="w-screen h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 flex-shrink-0 gap-2 flex-wrap">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base tracking-tight flex items-center gap-2">
              <FlaskConical size={16} className="text-cyan-400" /> Scalar EM Wave Lab
            </h1>
            <p className="text-gray-500 text-xs">Drag S1–S4 on canvas · Adjust parameters · Save / export PNG</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xs font-mono">{fps} fps</span>
          <button onClick={() => setRunning(r => !r)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs hover:bg-gray-700 transition-colors">
            {running ? <Pause size={12} /> : <Play size={12} />}
            {running ? "Pause" : "Play"}
          </button>
          <button onClick={() => setParams({ ...DEFAULT_PARAMS })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs hover:bg-gray-700 transition-colors">
            <RotateCcw size={12} /> Reset
          </button>
          <button onClick={handleScreenshot}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
              screenshot ? "bg-green-900/40 border-green-700 text-green-300" : "bg-cyan-900/40 border-cyan-700 text-cyan-300 hover:bg-cyan-800/40"
            }`}>
            {screenshot ? <Check size={12} /> : <Camera size={12} />}
            {screenshot ? "Saved!" : "PNG Export"}
          </button>
          <button onClick={() => setShowSave(s => !s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
              saved ? "bg-green-900/40 border-green-700 text-green-300" : "bg-purple-900/40 border-purple-700 text-purple-300 hover:bg-purple-800/40"
            }`}>
            {saved ? <Check size={12} /> : <Save size={12} />}
            {saved ? "Saved!" : "Save Setup"}
          </button>
        </div>
      </div>

      {/* Save panel */}
      {showSave && (
        <div className="px-6 py-3 border-b border-gray-800 bg-gray-900 flex items-end gap-3 flex-shrink-0">
          <div className="flex-1 space-y-1">
            <label className="text-xs text-gray-400">Experiment Name *</label>
            <input value={saveName} onChange={e => setSaveName(e.target.value)}
              placeholder="e.g. 4-source scalar bottle"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500" />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-xs text-gray-400">Notes (optional)</label>
            <input value={saveNotes} onChange={e => setSaveNotes(e.target.value)}
              placeholder="Observations…"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500" />
          </div>
          <button onClick={handleSave} disabled={saving || !saveName.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-sm font-semibold disabled:opacity-50 transition-colors">
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden cursor-crosshair">
          <canvas ref={canvasRef}
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
            className="w-full h-full block" />
          {/* Overlay info */}
          <div className="absolute top-3 left-3 text-xs text-white/40 pointer-events-none font-mono space-y-0.5">
            {SOURCES.map((s, i) => (
              <p key={s.key} style={{ color: s.color + "aa" }}>
                {s.label}: f={params[`${s.key}_freq`]}Hz φ={params[`${s.key}_phase`]}°{params.coherence !== 0 ? ` (+${(i * params.coherence).toFixed(0)}°)` : ""}
              </p>
            ))}
            <p className="text-white/30 mt-1">Coherence offset: {params.coherence}°/src</p>
          </div>
        </div>

        {/* Controls panel */}
        <div className="w-72 flex-shrink-0 border-l border-gray-800 overflow-y-auto flex flex-col">
          <div className="p-4 space-y-4 flex-1">

            {/* Coherence global slider */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 space-y-2">
              <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest">⚡ Coherence</p>
              <p className="text-gray-500 text-xs leading-relaxed">Phase offset applied cumulatively across S1→S4 (0° = fully coherent)</p>
              <Ctrl label="Phase offset / source (°)" min={0} max={180} step={1}
                value={params.coherence} onChange={v => setP("coherence", v)} color="#fbbf24" />
            </div>

            {/* Per-source controls */}
            {SOURCES.map((s) => (
              <div key={s.key} className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: s.color }}>
                  <span className={`w-2.5 h-2.5 rounded-full inline-block ${s.dot}`} /> {s.label}
                </p>
                <Ctrl label="Frequency (Hz)" min={0.1} max={5} step={0.05}
                  value={params[`${s.key}_freq`]} onChange={v => setP(`${s.key}_freq`, v)} color={s.color} />
                <Ctrl label="Phase (°)" min={0} max={360} step={5}
                  value={params[`${s.key}_phase`]} onChange={v => setP(`${s.key}_phase`, v)} color={s.color} />
                <Ctrl label="Amplitude" min={0.1} max={2} step={0.05}
                  value={params[`${s.key}_amp`]} onChange={v => setP(`${s.key}_amp`, v)} color={s.color} />
                {s.key !== "s4" && <div className="border-t border-gray-800 pt-1" />}
              </div>
            ))}

            <div className="border-t border-gray-800" />

            {/* Display options */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Display</p>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.keys(COLOR_SCHEMES).map(s => (
                  <button key={s} onClick={() => setP("colorScheme", s)}
                    className={`px-2 py-1.5 rounded-lg text-xs border capitalize transition-colors ${
                      params.colorScheme === s ? "bg-gray-700 border-gray-500 text-white" : "bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-500"
                    }`}>{s}</button>
                ))}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setP("showVectors", !params.showVectors)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${params.showVectors ? "bg-purple-600" : "bg-gray-700"}`}>
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${params.showVectors ? "left-4" : "left-0.5"}`} />
                </div>
                <span className="text-xs text-gray-400">Vector field overlay</span>
              </label>
            </div>

            <div className="border-t border-gray-800" />

            {/* Presets */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quick Presets</p>
              {PRESETS.map(({ label, s }) => (
                <button key={label} onClick={() => setParams(p => ({ ...p, ...s }))}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs border border-gray-700 text-gray-400 hover:border-cyan-700 hover:text-cyan-300 transition-colors">
                  ⚡ {label}
                </button>
              ))}
            </div>
          </div>

          {/* Saved experiments */}
          <div className="border-t border-gray-800 p-4 space-y-2">
            <button onClick={() => setShowExps(s => !s)}
              className="w-full flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-200 transition-colors">
              Saved Setups ({experiments.length})
              {showExps ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {showExps && (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {experiments.length === 0
                  ? <p className="text-gray-600 text-xs">No saved experiments yet.</p>
                  : experiments.map(exp => (
                    <ExperimentRow key={exp.id} exp={exp} onLoad={handleLoad} onDelete={handleDelete} />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}