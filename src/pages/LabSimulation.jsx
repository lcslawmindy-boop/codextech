import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Pause, Save, RotateCcw, FlaskConical, Trash2, ChevronDown, ChevronUp, Loader2, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";

// ── Color schemes ─────────────────────────────────────────────────────────────
const COLOR_SCHEMES = {
  plasma:  (v) => { const t = (v + 1) / 2; return `hsl(${280 - t * 220},${80 + t * 20}%,${10 + t * 65}%)`; },
  cyan:    (v) => { const t = (v + 1) / 2; return `hsl(${190 - t * 30},${60 + t * 40}%,${5 + t * 70}%)`; },
  green:   (v) => { const t = (v + 1) / 2; return `hsl(${140 - t * 40},${50 + t * 50}%,${5 + t * 65}%)`; },
  orange:  (v) => { const t = (v + 1) / 2; return `hsl(${30 + t * 15},${70 + t * 30}%,${5 + t * 70}%)`; },
};

const DEFAULT_PARAMS = {
  s1_freq: 1.2, s1_phase: 0, s1_amp: 1.0, s1_x: 30, s1_y: 50,
  s2_freq: 1.2, s2_phase: 180, s2_amp: 1.0, s2_x: 70, s2_y: 50,
  colorScheme: "plasma", showVectors: false,
};

// ── Slider component ──────────────────────────────────────────────────────────
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
    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-750 border border-gray-700">
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
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const timeRef = useRef(0);
  const paramsRef = useRef({ ...DEFAULT_PARAMS });

  const [params, setParams] = useState({ ...DEFAULT_PARAMS });
  const [running, setRunning] = useState(true);
  const [showSave, setShowSave] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saveNotes, setSaveNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [experiments, setExperiments] = useState([]);
  const [showExps, setShowExps] = useState(true);
  const [fps, setFps] = useState(0);

  // Keep paramsRef in sync so the animation loop reads latest without re-creating
  useEffect(() => { paramsRef.current = params; }, [params]);

  const setP = (key, val) => setParams(p => ({ ...p, [key]: val }));

  // ── Canvas render loop ────────────────────────────────────────────────────
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const p = paramsRef.current;
    const t = timeRef.current;
    const colorFn = COLOR_SCHEMES[p.colorScheme];

    const s1x = (p.s1_x / 100) * W, s1y = (p.s1_y / 100) * H;
    const s2x = (p.s2_x / 100) * W, s2y = (p.s2_y / 100) * H;

    // Sample resolution — trade off quality vs perf
    const step = 4;
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const d1 = Math.sqrt((x - s1x) ** 2 + (y - s1y) ** 2);
        const d2 = Math.sqrt((x - s2x) ** 2 + (y - s2y) ** 2);
        const w1 = p.s1_amp * Math.sin(2 * Math.PI * p.s1_freq * (t - d1 / 120) + (p.s1_phase * Math.PI / 180));
        const w2 = p.s2_amp * Math.sin(2 * Math.PI * p.s2_freq * (t - d2 / 120) + (p.s2_phase * Math.PI / 180));
        const combined = (w1 + w2) / 2;
        ctx.fillStyle = colorFn(combined);
        ctx.fillRect(x, y, step, step);
      }
    }

    // Draw source nodes
    [[s1x, s1y, "#60a5fa", "S1"], [s2x, s2y, "#f472b6", "S2"]].forEach(([sx, sy, c, lbl]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, 10, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = "white";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(lbl, sx, sy + 4);
    });

    // Vector field overlay
    if (p.showVectors) {
      const gStep = 32;
      for (let gy = gStep; gy < H; gy += gStep) {
        for (let gx = gStep; gx < W; gx += gStep) {
          const d1 = Math.sqrt((gx - s1x) ** 2 + (gy - s1y) ** 2) || 1;
          const d2 = Math.sqrt((gx - s2x) ** 2 + (gy - s2y) ** 2) || 1;
          const vx = p.s1_amp * (gx - s1x) / d1 / d1 + p.s2_amp * (gx - s2x) / d2 / d2;
          const vy = p.s1_amp * (gy - s1y) / d1 / d1 + p.s2_amp * (gy - s2y) / d2 / d2;
          const len = Math.sqrt(vx * vx + vy * vy) || 1;
          const scale = 10;
          const ex = gx + (vx / len) * scale, ey = gy + (vy / len) * scale;
          ctx.beginPath();
          ctx.moveTo(gx, gy);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = "rgba(255,255,255,0.25)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }, []);

  // ── Animation loop ────────────────────────────────────────────────────────
  useEffect(() => {
    let last = performance.now();
    let frameCount = 0;
    let fpsLast = last;

    const loop = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      if (paramsRef.current._running !== false) {
        timeRef.current += dt;
      }
      renderFrame();
      frameCount++;
      if (now - fpsLast > 1000) {
        setFps(frameCount);
        frameCount = 0;
        fpsLast = now;
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [renderFrame]);

  // Pause/resume via paramsRef flag
  useEffect(() => {
    paramsRef.current._running = running;
  }, [running]);

  // ── Resize canvas to container ────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ── Drag sources on canvas ────────────────────────────────────────────────
  const dragging = useRef(null);
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    const d1 = Math.hypot(mx - params.s1_x, my - params.s1_y);
    const d2 = Math.hypot(mx - params.s2_x, my - params.s2_y);
    if (d1 < 5) dragging.current = "s1";
    else if (d2 < 5) dragging.current = "s2";
  };
  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const my = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    if (dragging.current === "s1") setP("s1_x", +mx.toFixed(1)), setP("s1_y", +my.toFixed(1));
    else setP("s2_x", +mx.toFixed(1)), setP("s2_y", +my.toFixed(1));
  };
  const handleMouseUp = () => { dragging.current = null; };

  // ── Load saved experiments ────────────────────────────────────────────────
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
      name: saveName.trim(),
      notes: saveNotes.trim(),
      source1_freq: params.s1_freq, source1_phase: params.s1_phase, source1_amplitude: params.s1_amp,
      source1_x: params.s1_x, source1_y: params.s1_y,
      source2_freq: params.s2_freq, source2_phase: params.s2_phase, source2_amplitude: params.s2_amp,
      source2_x: params.s2_x, source2_y: params.s2_y,
      color_scheme: params.colorScheme, show_vectors: params.showVectors,
    });
    setSaving(false);
    setSaved(true);
    setSaveName(""); setSaveNotes(""); setShowSave(false);
    setTimeout(() => setSaved(false), 2000);
    loadExperiments();
  };

  const handleLoad = (exp) => {
    setParams({
      s1_freq: exp.source1_freq, s1_phase: exp.source1_phase, s1_amp: exp.source1_amplitude,
      s1_x: exp.source1_x, s1_y: exp.source1_y,
      s2_freq: exp.source2_freq, s2_phase: exp.source2_phase, s2_amp: exp.source2_amplitude,
      s2_x: exp.source2_x, s2_y: exp.source2_y,
      colorScheme: exp.color_scheme, showVectors: exp.show_vectors,
    });
  };

  const handleDelete = async (id) => {
    await base44.entities.LabExperiment.delete(id);
    loadExperiments();
  };

  const handleReset = () => setParams({ ...DEFAULT_PARAMS });

  return (
    <div className="w-screen h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base tracking-tight flex items-center gap-2">
              <FlaskConical size={16} className="text-cyan-400" /> Scalar EM Wave Lab
            </h1>
            <p className="text-gray-500 text-xs">Drag 🔵 S1 / 🩷 S2 sources · Adjust parameters · Save setups</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xs font-mono">{fps} fps</span>
          <button onClick={() => setRunning(r => !r)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs hover:bg-gray-700 transition-colors">
            {running ? <Pause size={12} /> : <Play size={12} />}
            {running ? "Pause" : "Play"}
          </button>
          <button onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs hover:bg-gray-700 transition-colors">
            <RotateCcw size={12} /> Reset
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

      {/* Save modal */}
      {showSave && (
        <div className="px-6 py-3 border-b border-gray-800 bg-gray-900 flex items-end gap-3 flex-shrink-0">
          <div className="flex-1 space-y-1">
            <label className="text-xs text-gray-400">Experiment Name *</label>
            <input value={saveName} onChange={e => setSaveName(e.target.value)}
              placeholder="e.g. 180° phase cancel · f=1.2Hz"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500" />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-xs text-gray-400">Notes (optional)</label>
            <input value={saveNotes} onChange={e => setSaveNotes(e.target.value)}
              placeholder="Observations, hypothesis…"
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
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full block" />
          {/* Overlay labels */}
          <div className="absolute top-3 left-3 text-xs text-white/40 pointer-events-none font-mono space-y-0.5">
            <p>S1: f={params.s1_freq}Hz φ={params.s1_phase}°</p>
            <p>S2: f={params.s2_freq}Hz φ={params.s2_phase}°</p>
            <p>Δφ={Math.abs(params.s1_phase - params.s2_phase)}° · {Math.abs(params.s1_freq - params.s2_freq) < 0.01 ? "Coherent" : "Incoherent"}</p>
          </div>
        </div>

        {/* Right controls panel */}
        <div className="w-72 flex-shrink-0 border-l border-gray-800 overflow-y-auto flex flex-col">
          <div className="p-4 space-y-5 flex-1">

            {/* Source 1 */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" /> Source 1
              </p>
              <Ctrl label="Frequency (Hz)" min={0.1} max={5} step={0.05} value={params.s1_freq} onChange={v => setP("s1_freq", v)} color="#60a5fa" />
              <Ctrl label="Phase (°)" min={0} max={360} step={5} value={params.s1_phase} onChange={v => setP("s1_phase", v)} color="#60a5fa" />
              <Ctrl label="Amplitude" min={0.1} max={2} step={0.05} value={params.s1_amp} onChange={v => setP("s1_amp", v)} color="#60a5fa" />
            </div>

            <div className="border-t border-gray-800" />

            {/* Source 2 */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-400 inline-block" /> Source 2
              </p>
              <Ctrl label="Frequency (Hz)" min={0.1} max={5} step={0.05} value={params.s2_freq} onChange={v => setP("s2_freq", v)} color="#f472b6" />
              <Ctrl label="Phase (°)" min={0} max={360} step={5} value={params.s2_phase} onChange={v => setP("s2_phase", v)} color="#f472b6" />
              <Ctrl label="Amplitude" min={0.1} max={2} step={0.05} value={params.s2_amp} onChange={v => setP("s2_amp", v)} color="#f472b6" />
            </div>

            <div className="border-t border-gray-800" />

            {/* Display options */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Display</p>
              <div>
                <p className="text-xs text-gray-400 mb-1.5">Color Scheme</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.keys(COLOR_SCHEMES).map(s => (
                    <button key={s} onClick={() => setP("colorScheme", s)}
                      className={`px-2 py-1.5 rounded-lg text-xs border capitalize transition-colors ${
                        params.colorScheme === s ? "bg-gray-700 border-gray-500 text-white" : "bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-500"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
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
              {[
                { label: "Zero-Vector Cancel", s: { s1_freq: 1.2, s1_phase: 0, s1_amp: 1, s2_freq: 1.2, s2_phase: 180, s2_amp: 1, s1_x: 30, s1_y: 50, s2_x: 70, s2_y: 50 } },
                { label: "Constructive Max",   s: { s1_freq: 1.5, s1_phase: 0, s1_amp: 1, s2_freq: 1.5, s2_phase: 0,   s2_amp: 1, s1_x: 30, s1_y: 50, s2_x: 70, s2_y: 50 } },
                { label: "Beat Frequency",     s: { s1_freq: 1.0, s1_phase: 0, s1_amp: 1, s2_freq: 1.3, s2_phase: 0,   s2_amp: 1, s1_x: 25, s1_y: 50, s2_x: 75, s2_y: 50 } },
                { label: "Scalar Bottle",      s: { s1_freq: 2.0, s1_phase: 45, s1_amp: 1.2, s2_freq: 2.0, s2_phase: 225, s2_amp: 1.2, s1_x: 20, s1_y: 30, s2_x: 80, s2_y: 70 } },
              ].map(({ label, s }) => (
                <button key={label} onClick={() => setParams(p => ({ ...p, ...s, colorScheme: p.colorScheme, showVectors: p.showVectors }))}
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