import { useState, useEffect, useRef } from "react";
import { X, Play, Pause, SkipForward, SkipBack, Loader2, ChevronRight, Clock, Wrench, Package, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STEP_DURATION = 8; // seconds per step

function StepVisual({ step, index }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;

    ctx.fillStyle = "#0a0a14";
    ctx.fillRect(0, 0, w, h);

    // Draw step number as large watermark
    ctx.font = `bold ${h * 0.55}px monospace`;
    ctx.fillStyle = "rgba(100,120,255,0.07)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(index + 1).padStart(2, "0"), w / 2, h / 2);

    // Draw schematic lines based on step type
    const colors = ["#60b8ff", "#a78bfa", "#34d399", "#fbbf24", "#f87171"];
    const color = colors[index % colors.length];

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    const cx = w / 2, cy = h / 2;
    const r = Math.min(w, h) * 0.28;

    if (step.type === "assembly") {
      // Component boxes
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const bx = cx + Math.cos(angle) * r - 28;
        const by = cy + Math.sin(angle) * r - 18;
        ctx.strokeRect(bx, by, 56, 36);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * 20, cy + Math.sin(angle) * 20);
        ctx.lineTo(bx + 28, by + 18);
        ctx.stroke();
      }
    } else if (step.type === "wiring") {
      // Waveform
      ctx.setLineDash([]);
      ctx.beginPath();
      for (let x = 30; x < w - 30; x++) {
        const y = cy + Math.sin((x / w) * Math.PI * 6) * 40;
        x === 30 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      // Nodes
      for (let i = 0; i < 5; i++) {
        const nx = 30 + (i / 4) * (w - 60);
        const ny = cy + Math.sin((nx / w) * Math.PI * 6) * 40;
        ctx.beginPath();
        ctx.arc(nx, ny, 6, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    } else if (step.type === "testing") {
      // Oscilloscope-style
      ctx.setLineDash([]);
      ctx.strokeStyle = "#34d399";
      ctx.beginPath();
      for (let x = 20; x < w - 20; x++) {
        const t = x / w;
        const y = cy + Math.sin(t * Math.PI * 8) * 35 * Math.exp(-t * 1.5);
        x === 20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      // Grid
      ctx.strokeStyle = "rgba(52,211,153,0.15)";
      ctx.setLineDash([2, 6]);
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(20, cy - 60 + i * 40);
        ctx.lineTo(w - 20, cy - 60 + i * 40);
        ctx.stroke();
      }
    } else {
      // Default: circuit-like
      ctx.setLineDash([]);
      const pts = [[cx - r, cy], [cx - r * 0.3, cy - r * 0.6], [cx + r * 0.3, cy - r * 0.3],
                   [cx + r, cy + r * 0.2], [cx + r * 0.2, cy + r * 0.7], [cx - r * 0.5, cy + r * 0.5]];
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]));
      ctx.closePath();
      ctx.stroke();
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p[0], p[1], 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
    }

    // Step label top-left
    ctx.setLineDash([]);
    ctx.fillStyle = color;
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`STEP ${index + 1}`, 14, 12);

  }, [step, index]);

  return (
    <canvas ref={canvasRef} width={400} height={240}
      className="rounded-xl border border-gray-700 w-full" />
  );
}

export default function InventionBuildVideo({ invention, onClose }) {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    generateSteps();
  }, []);

  const generateSteps = async () => {
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a senior electrical engineer and inventor specializing in scalar electromagnetics. Generate a detailed step-by-step build guide for the following invention.

Invention: ${invention.name}
Description: ${invention.description}
Technical Specs: ${(invention.specs || []).map(s => `${s.label}: ${s.value}`).join("; ")}
Key Principles: ${(invention.principles || []).join(", ")}
Manufacturing: ${invention.manufacturing || ""}

Generate exactly 10 build steps. Each step should be practical, specific, and grounded in the invention's actual technical requirements.

Return a JSON object with a "steps" array. Each step object:
- title: string (short action title, e.g. "Wind Primary Bifilar Coil")
- type: string (one of: "preparation", "assembly", "wiring", "calibration", "testing", "safety")
- duration: string (e.g. "45 minutes")
- description: string (2-3 sentences of precise instructions)
- materials: array of 3-5 strings (specific components/materials needed for THIS step)
- tools: array of 2-4 strings (tools required)
- warning: string or null (safety/precision warning if applicable)
- checkpoint: string (how to verify this step is complete before proceeding)`,
      response_json_schema: {
        type: "object",
        properties: {
          steps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                type: { type: "string" },
                duration: { type: "string" },
                description: { type: "string" },
                materials: { type: "array", items: { type: "string" } },
                tools: { type: "array", items: { type: "string" } },
                warning: { type: "string" },
                checkpoint: { type: "string" },
              }
            }
          }
        }
      },
      model: "gpt_5"
    });
    setSteps(result.steps || []);
    setLoading(false);
    setPlaying(true);
  };

  // Playback engine
  useEffect(() => {
    if (!playing || steps.length === 0) {
      clearInterval(progressRef.current);
      return;
    }
    setProgress(0);
    const tickMs = 100;
    const totalTicks = (STEP_DURATION * 1000) / tickMs;
    let tick = 0;
    progressRef.current = setInterval(() => {
      tick++;
      setProgress((tick / totalTicks) * 100);
      if (tick >= totalTicks) {
        clearInterval(progressRef.current);
        setCurrentStep(prev => {
          if (prev + 1 >= steps.length) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }
    }, tickMs);
    return () => clearInterval(progressRef.current);
  }, [playing, currentStep, steps.length]);

  const goTo = (i) => {
    clearInterval(progressRef.current);
    setCurrentStep(i);
    setProgress(0);
    setPlaying(true);
  };

  const step = steps[currentStep];
  const typeColors = {
    preparation: "#a78bfa", assembly: "#60b8ff", wiring: "#fbbf24",
    calibration: "#34d399", testing: "#22d3ee", safety: "#f87171"
  };
  const typeColor = step ? (typeColors[step.type] || "#60b8ff") : "#60b8ff";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-950 border border-gray-700 rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-gray-400 text-xs font-mono uppercase tracking-widest">Build Video</span>
            <span className="text-white font-black text-sm truncate max-w-xs">{invention.name}</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
            <Loader2 size={32} className="animate-spin text-blue-400" />
            <p className="text-white font-bold">Generating build instructions…</p>
            <p className="text-gray-500 text-sm">AI is engineering step-by-step assembly guide for {invention.name}</p>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* Step list sidebar */}
            <div className="w-48 flex-shrink-0 border-r border-gray-800 overflow-y-auto bg-gray-900/50">
              {steps.map((s, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className={`w-full text-left px-3 py-2.5 border-b border-gray-800 transition-all ${currentStep === i ? "bg-gray-800" : "hover:bg-gray-800/50"}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-black font-mono" style={{ color: currentStep === i ? typeColor : "#4b5563" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {currentStep === i && playing && (
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                    )}
                    {i < currentStep && (
                      <div className="w-3 h-3 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-black" style={{ fontSize: 8 }}>✓</span>
                      </div>
                    )}
                  </div>
                  <p className={`text-xs leading-tight ${currentStep === i ? "text-white font-semibold" : "text-gray-500"}`}>
                    {s.title}
                  </p>
                  <p className="text-gray-600 text-xs mt-0.5">{s.duration}</p>
                </button>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {step && (
                <>
                  {/* Video area */}
                  <div className="relative bg-gray-950 flex-shrink-0">
                    <StepVisual step={step} index={currentStep} />

                    {/* Overlay badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
                        style={{ backgroundColor: typeColor + "22", color: typeColor, border: `1px solid ${typeColor}44` }}>
                        {step.type}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-900/80 px-2 py-0.5 rounded">
                        <Clock size={10} /> {step.duration}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                      <div className="h-full transition-all duration-100"
                        style={{ width: `${progress}%`, backgroundColor: typeColor }} />
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-800 bg-gray-900/50 flex-shrink-0">
                    <button onClick={() => goTo(Math.max(0, currentStep - 1))} disabled={currentStep === 0}
                      className="text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                      <SkipBack size={16} />
                    </button>
                    <button onClick={() => setPlaying(p => !p)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      style={{ backgroundColor: typeColor }}>
                      {playing ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white ml-0.5" />}
                    </button>
                    <button onClick={() => goTo(Math.min(steps.length - 1, currentStep + 1))} disabled={currentStep === steps.length - 1}
                      className="text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                      <SkipForward size={16} />
                    </button>
                    <div className="flex-1 bg-gray-800 rounded-full h-1.5 mx-2 relative cursor-pointer"
                      onClick={e => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const ratio = (e.clientX - rect.left) / rect.width;
                        goTo(Math.floor(ratio * steps.length));
                      }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${((currentStep + progress / 100) / steps.length) * 100}%`, backgroundColor: typeColor }} />
                    </div>
                    <span className="text-gray-500 text-xs font-mono">{currentStep + 1} / {steps.length}</span>
                  </div>

                  {/* Step details */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <div>
                      <h2 className="text-white font-black text-lg" style={{ color: typeColor }}>
                        Step {currentStep + 1}: {step.title}
                      </h2>
                      <p className="text-gray-300 text-sm leading-relaxed mt-1">{step.description}</p>
                    </div>

                    {step.warning && (
                      <div className="flex items-start gap-2 bg-red-950/30 border border-red-900/50 rounded-xl p-3">
                        <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-300 text-xs leading-relaxed">{step.warning}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Package size={11} className="text-gray-400" />
                          <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Materials</span>
                        </div>
                        <ul className="space-y-1">
                          {(step.materials || []).map((m, i) => (
                            <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                              <span className="text-gray-600 mt-0.5">·</span>{m}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Wrench size={11} className="text-gray-400" />
                          <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Tools</span>
                        </div>
                        <ul className="space-y-1">
                          {(step.tools || []).map((t, i) => (
                            <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                              <span className="text-gray-600 mt-0.5">·</span>{t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-green-950/20 border border-green-900/40 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <ChevronRight size={11} className="text-green-400" />
                        <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Checkpoint</span>
                      </div>
                      <p className="text-green-200 text-xs leading-relaxed">{step.checkpoint}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}