import { useState, useEffect, useRef, useCallback } from "react";
import {
  X, Play, Pause, SkipForward, SkipBack, Loader2, ChevronRight,
  Clock, Wrench, Package, AlertTriangle, Download, Volume2, VolumeX,
  ShoppingCart, DollarSign, ExternalLink
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { jsPDF } from "jspdf";

// ── PDF EXPORT ────────────────────────────────────────────────────────────────
function downloadStepsAsPDF(invention, steps) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, margin = 18, cW = W - margin * 2;
  let y = 0, pageCount = 0;

  const addPage = () => {
    if (pageCount > 0) doc.addPage();
    pageCount++;
    doc.setFillColor(10, 10, 20);
    doc.rect(0, 0, W, 297, "F");
    doc.setFillColor(20, 20, 40);
    doc.rect(0, 0, W, 16, "F");
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(212, 175, 55);
    doc.text("ZENITH APEX — INVENTION BUILD GUIDE", margin, 7);
    doc.setTextColor(100, 116, 139);
    doc.text("CONFIDENTIAL · NDA APPLIES", W - margin, 7, { align: "right" });
    y = 24;
  };

  const check = (n = 14) => { if (y + n > 282) addPage(); };

  const txt = (text, color = [200, 210, 230], size = 9, bold = false, indent = 0) => {
    doc.setFontSize(size); doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, cW - indent);
    lines.forEach(l => { check(7); doc.text(l, margin + indent, y); y += 6.5; });
  };

  // Cover
  doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F");
  pageCount++;
  doc.setFillColor(212, 175, 55); doc.rect(0, 0, W, 3, "F");
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 116, 139);
  doc.text("ZENITH APEX RESEARCH PORTFOLIO", W / 2, 20, { align: "center" });
  doc.setFontSize(22); doc.setFont("helvetica", "bold"); doc.setTextColor(212, 175, 55);
  doc.text("INVENTION BUILD GUIDE", W / 2, 48, { align: "center" });
  doc.setFontSize(13); doc.setTextColor(200, 210, 230);
  const nLines = doc.splitTextToSize(invention.name || "", cW);
  nLines.forEach((l, i) => doc.text(l, W / 2, 62 + i * 9, { align: "center" }));
  doc.setFontSize(9); doc.setTextColor(100, 116, 139);
  doc.text(`${steps.length} steps  ·  Generated ${new Date().toLocaleDateString()}`, W / 2, 85, { align: "center" });

  // Materials cost summary
  y = 100;
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(212, 175, 55);
  doc.text("ESTIMATED BILL OF MATERIALS & PURCHASE GUIDE", margin, y); y += 8;
  doc.setDrawColor(212, 175, 55); doc.setLineWidth(0.3); doc.line(margin, y, W - margin, y); y += 6;

  const allMats = [];
  steps.forEach(step => (step.materials || []).forEach(m => {
    if (typeof m === "object") allMats.push(m);
    else allMats.push({ name: m, cost: "", where: "" });
  }));

  allMats.forEach(m => {
    check(10);
    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(200, 210, 230);
    doc.text(`• ${m.name || m}`, margin + 2, y);
    if (m.cost) {
      doc.setFont("helvetica", "normal"); doc.setTextColor(52, 211, 153);
      doc.text(m.cost, W / 2, y);
    }
    if (m.where) {
      doc.setTextColor(100, 116, 139);
      doc.text(m.where, W - margin, y, { align: "right" });
    }
    y += 7;
  });

  // Steps
  addPage();
  doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(212, 175, 55);
  doc.text(`STEP-BY-STEP BUILD INSTRUCTIONS — ${steps.length} STEPS`, margin, y); y += 12;

  steps.forEach((step, i) => {
    check(40);
    doc.setFillColor(20, 20, 45); doc.rect(margin - 2, y - 4, cW + 4, 14, "F");
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(212, 175, 55);
    doc.text(`${String(i + 1).padStart(2, "0")}  ${step.title || ""}`, margin + 2, y + 4);
    if (step.duration) {
      doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 116, 139);
      doc.text(step.duration, W - margin - 2, y + 4, { align: "right" });
    }
    y += 18;
    txt(step.description || "", [200, 210, 230], 9, false, 2);
    y += 2;
    if (step.audio_script) {
      check(10);
      doc.setFontSize(8); doc.setFont("helvetica", "italic"); doc.setTextColor(167, 139, 250);
      const al = doc.splitTextToSize(`🔊 ${step.audio_script}`, cW - 4);
      al.slice(0, 2).forEach(l => { check(6); doc.text(l, margin + 2, y); y += 6; });
      y += 2;
    }
    if (step.warning) {
      check(14);
      doc.setFillColor(50, 15, 15); doc.rect(margin, y - 2, cW, 12, "F");
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(248, 113, 113);
      doc.text("⚠ " + step.warning, margin + 2, y + 4);
      y += 16;
    }
    if ((step.materials || []).length > 0) {
      check(8);
      doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(96, 184, 255);
      doc.text("MATERIALS:", margin + 2, y); y += 6;
      (step.materials || []).forEach(m => {
        check(8);
        const name = typeof m === "object" ? m.name : m;
        const cost = typeof m === "object" ? m.cost : "";
        const where = typeof m === "object" ? m.where : "";
        doc.setFont("helvetica", "normal"); doc.setTextColor(200, 210, 230);
        doc.text(`• ${name}`, margin + 6, y);
        if (cost) { doc.setTextColor(52, 211, 153); doc.text(cost, W / 2, y); }
        if (where) { doc.setTextColor(100, 116, 139); doc.text(where, W - margin, y, { align: "right" }); }
        y += 6;
      });
    }
    if ((step.tools || []).length > 0) {
      check(8);
      doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(251, 191, 36);
      doc.text("TOOLS:  " + step.tools.join("  ·  "), margin + 2, y); y += 7;
    }
    if (step.checkpoint) {
      check(10);
      doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(52, 211, 153);
      doc.text("✓ CHECKPOINT: ", margin + 2, y);
      doc.setFont("helvetica", "italic"); doc.setTextColor(200, 210, 230);
      doc.text(step.checkpoint, margin + 32, y);
      y += 8;
    }
    doc.setDrawColor(40, 40, 70); doc.setLineWidth(0.2); doc.line(margin, y, W - margin, y);
    y += 8;
  });

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFillColor(10, 10, 20); doc.rect(0, 287, W, 10, "F");
    doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 100);
    doc.text("Zenith Apex Research Portfolio — CONFIDENTIAL", margin, 293);
    doc.text(`Page ${p} of ${total}`, W - margin, 293, { align: "right" });
  }
  const name = (invention.name || "build").toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 50);
  doc.save(`ZenithApex_BuildGuide_${name}.pdf`);
}

// ── ANIMATED CANVAS VISUAL ────────────────────────────────────────────────────
const STEP_COLORS = ["#60b8ff", "#a78bfa", "#34d399", "#fbbf24", "#f87171", "#22d3ee", "#fb923c", "#e879f9", "#4ade80", "#f472b6"];

function StepVisual({ step, index, playing, progress }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const frameRef = useRef(0);

  const color = STEP_COLORS[index % STEP_COLORS.length];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const t = frameRef.current / 60;

    // Background gradient
    const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7);
    grad.addColorStop(0, "#0d1225");
    grad.addColorStop(1, "#06060f");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Hex grid background
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 0.5;
    const hexSize = 28;
    for (let row = -1; row < H / (hexSize * 1.5) + 2; row++) {
      for (let col = -1; col < W / (hexSize * Math.sqrt(3)) + 2; col++) {
        const x = col * hexSize * Math.sqrt(3) + (row % 2) * hexSize * Math.sqrt(3) / 2;
        const y = row * hexSize * 1.5;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const px = x + hexSize * Math.cos(angle) * 0.9;
          const py = y + hexSize * Math.sin(angle) * 0.9;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }

    const cx = W / 2, cy = H / 2;

    if (step?.type === "wiring" || step?.type === "assembly") {
      // Animated circuit traces
      const nodes = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + t * 0.3;
        const r = 80 + Math.sin(t * 0.7 + i) * 15;
        nodes.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
      }
      // Animated connection lines
      ctx.setLineDash([8, 4]);
      nodes.forEach((n, i) => {
        const next = nodes[(i + 1) % nodes.length];
        const dashOffset = -t * 30;
        ctx.lineDashOffset = dashOffset;
        const lg = ctx.createLinearGradient(n.x, n.y, next.x, next.y);
        lg.addColorStop(0, color + "88");
        lg.addColorStop(1, color + "22");
        ctx.strokeStyle = lg;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.quadraticCurveTo(cx + Math.cos(t * 0.2) * 20, cy + Math.sin(t * 0.2) * 20, next.x, next.y);
        ctx.stroke();
      });
      ctx.setLineDash([]);
      // Node circles
      nodes.forEach((n, i) => {
        const pulse = 1 + Math.sin(t * 2 + i * 1.1) * 0.15;
        // Glow
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 14 * pulse);
        grd.addColorStop(0, color + "66");
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 14 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, 5 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
    } else if (step?.type === "testing" || step?.type === "calibration") {
      // Oscilloscope + spectrum
      const panelY = cy - 50;
      // Scope background
      ctx.fillStyle = "rgba(0,20,10,0.7)";
      ctx.strokeStyle = color + "55";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cx - 140, panelY, 280, 100, 8);
      ctx.fill();
      ctx.stroke();
      // Grid
      ctx.strokeStyle = "#34d39922";
      ctx.lineWidth = 0.5;
      for (let g = 1; g < 4; g++) {
        ctx.beginPath();
        ctx.moveTo(cx - 140, panelY + g * 25);
        ctx.lineTo(cx + 140, panelY + g * 25);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 140 + g * 70, panelY);
        ctx.lineTo(cx - 140 + g * 70, panelY + 100);
        ctx.stroke();
      }
      // Animated waveform
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      for (let x = 0; x <= 280; x++) {
        const freq = 3 + index * 0.5;
        const amp = 30 + Math.sin(t * 0.5) * 8;
        const yWave = panelY + 50 + Math.sin((x / 280) * Math.PI * 2 * freq + t * 2) * amp * Math.exp(-x / 400);
        x === 0 ? ctx.moveTo(cx - 140 + x, yWave) : ctx.lineTo(cx - 140 + x, yWave);
      }
      ctx.stroke();
      // Readout text
      ctx.fillStyle = "#34d399";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`CH1  ${(2.3 + Math.sin(t) * 0.1).toFixed(1)}V  10MHz`, cx - 135, panelY + 12);
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(`CH2  ${(1.8 + Math.cos(t * 1.3) * 0.1).toFixed(1)}V`, cx - 135, panelY + 24);
      // Frequency bars below
      for (let b = 0; b < 18; b++) {
        const bh = 15 + Math.abs(Math.sin(b * 0.8 + t * 1.5)) * 35;
        ctx.fillStyle = color + "99";
        ctx.fillRect(cx - 130 + b * 15, cy + 60 - bh, 12, bh);
      }
    } else if (step?.type === "safety") {
      // Warning hexagon + rotating shield
      const r1 = 65 + Math.sin(t * 1.2) * 5;
      // Outer glow ring
      const grd = ctx.createRadialGradient(cx, cy, r1 * 0.6, cx, cy, r1 * 1.3);
      grd.addColorStop(0, "rgba(248,113,113,0.15)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
      // Rotating warning triangle
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.sin(t * 0.5) * 0.05);
      ctx.strokeStyle = "#f87171";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -r1);
      ctx.lineTo(r1 * 0.866, r1 * 0.5);
      ctx.lineTo(-r1 * 0.866, r1 * 0.5);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = "rgba(248,113,113,0.08)";
      ctx.fill();
      // Exclamation
      ctx.fillStyle = "#f87171";
      ctx.font = `bold ${44 + Math.sin(t * 2) * 3}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("!", 0, 8);
      ctx.restore();
    } else if (step?.type === "preparation") {
      // Checklist animation
      const items = ["Components verified", "Safety gear on", "Work area clear", "Tools ready", "Schematic reviewed"];
      items.forEach((item, i) => {
        const iy = cy - 55 + i * 28;
        const revealed = t > i * 0.8;
        ctx.globalAlpha = revealed ? 1 : 0.2;
        // Check box
        ctx.strokeStyle = revealed ? color : "#444";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cx - 110, iy - 9, 16, 16);
        if (revealed) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx - 108, iy - 1);
          ctx.lineTo(cx - 103, iy + 4);
          ctx.lineTo(cx - 96, iy - 6);
          ctx.stroke();
        }
        ctx.fillStyle = revealed ? "#e2e8f0" : "#555";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(item, cx - 86, iy);
        ctx.globalAlpha = 1;
      });
    } else {
      // Default: animated toroidal coil schematic
      const rOuter = 75 + Math.sin(t * 0.4) * 5;
      const rInner = 38;
      // Glow
      const grdO = ctx.createRadialGradient(cx, cy, rInner, cx, cy, rOuter * 1.3);
      grdO.addColorStop(0, color + "22");
      grdO.addColorStop(1, "transparent");
      ctx.fillStyle = grdO;
      ctx.fillRect(0, 0, W, H);
      // Outer circle
      ctx.strokeStyle = color + "88";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
      ctx.stroke();
      // Inner circle
      ctx.strokeStyle = color + "44";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
      ctx.stroke();
      // Winding turns
      const nTurns = 16;
      for (let i = 0; i < nTurns; i++) {
        const angle = (i / nTurns) * Math.PI * 2 + t * 0.2;
        const x1 = cx + Math.cos(angle) * rInner;
        const y1 = cy + Math.sin(angle) * rInner;
        const x2 = cx + Math.cos(angle) * rOuter;
        const y2 = cy + Math.sin(angle) * rOuter;
        const alpha = 0.3 + Math.abs(Math.sin(angle + t)) * 0.5;
        ctx.strokeStyle = `${color}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      // Rotating energy dot
      const dotAngle = t * 1.5;
      const dotR = (rInner + rOuter) / 2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(dotAngle) * dotR, cy + Math.sin(dotAngle) * dotR, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Progress arc overlay
    if (progress > 0 && progress < 100) {
      ctx.strokeStyle = color + "66";
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(W - 24, 24, 14, -Math.PI / 2, -Math.PI / 2 + (progress / 100) * Math.PI * 2);
      ctx.stroke();
    }

    // Step number badge
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.beginPath();
    ctx.roundRect(10, 10, 65, 22, 6);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(`STEP ${String(index + 1).padStart(2, "0")}`, 16, 21);

    // Step type badge bottom-left
    if (step?.type) {
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.beginPath();
      const typeW = ctx.measureText(step.type.toUpperCase()).width + 16;
      ctx.roundRect(10, H - 32, typeW, 20, 5);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(step.type.toUpperCase(), 18, H - 22);
    }

    frameRef.current++;
  }, [step, index, color, progress]);

  useEffect(() => {
    if (playing) {
      const loop = () => { draw(); animRef.current = requestAnimationFrame(loop); };
      animRef.current = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(animRef.current);
      draw();
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [playing, draw]);

  return (
    <canvas ref={canvasRef} width={640} height={280}
      className="w-full" style={{ display: "block" }} />
  );
}

// ── AUDIO NARRATION ───────────────────────────────────────────────────────────
function useAudioNarration() {
  const [enabled, setEnabled] = useState(true);
  const utterRef = useRef(null);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  const speak = useCallback((text) => {
    if (!supported || !enabled || !text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92;
    utter.pitch = 1.0;
    utter.volume = 0.9;
    // Try to get a clear English voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("google"))
      || voices.find(v => v.lang.startsWith("en-US"))
      || voices[0];
    if (preferred) utter.voice = preferred;
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, [enabled, supported]);

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
  }, [supported]);

  const toggle = useCallback(() => {
    if (enabled) stop();
    setEnabled(e => !e);
  }, [enabled, stop]);

  useEffect(() => () => stop(), []);

  return { enabled, toggle, speak, stop, supported };
}

const STEP_DURATION = 12; // seconds per step

export default function InventionBuildVideo({ invention, onClose }) {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);
  const { enabled: audioEnabled, toggle: toggleAudio, speak, stop: stopAudio } = useAudioNarration();

  useEffect(() => { generateSteps(); }, []);

  const generateSteps = async () => {
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a senior electrical engineer and scalar EM researcher. Generate a detailed 10-step build guide for this invention.

Invention: ${invention.name}
Description: ${invention.description || ""}
Category: ${invention.category || ""}

Return a JSON object with a "steps" array. Each step must have:
- title: string (short action title like "Wind Primary Bifilar Coil")
- type: one of "preparation", "assembly", "wiring", "calibration", "testing", "safety"
- duration: string (e.g. "45 minutes")
- description: string (3-4 sentences of precise engineering instructions)
- audio_script: string (1-2 natural spoken sentences describing what the builder is doing — conversational tone, no jargon)
- materials: array of objects, each: { name, cost, where } — e.g. { name: "T200-2 Ferrite Core", cost: "$3.50", where: "Mouser Electronics (mouser.com)" }
- tools: array of strings (specific tool names)
- warning: string or null (safety or precision critical warning)
- checkpoint: string (specific measurable verification before proceeding)`,
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
                audio_script: { type: "string" },
                materials: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      cost: { type: "string" },
                      where: { type: "string" },
                    }
                  }
                },
                tools: { type: "array", items: { type: "string" } },
                warning: { type: "string" },
                checkpoint: { type: "string" },
              }
            }
          }
        }
      },
      model: "claude_sonnet_4_6"
    });
    const generated = result.steps || [];
    setSteps(generated);
    base44.entities.BuildVideo.create({
      invention_name: invention.name,
      invention_category: invention.category || "",
      invention_tagline: invention.tagline || "",
      steps: generated,
      step_count: generated.length,
    });
    setLoading(false);
    setPlaying(true);
  };

  // Narrate on step change
  useEffect(() => {
    if (steps.length === 0) return;
    const s = steps[currentStep];
    if (s) speak(s.audio_script || `Step ${currentStep + 1}: ${s.title}. ${s.description}`);
  }, [currentStep, steps]);

  // Playback engine
  useEffect(() => {
    if (!playing || steps.length === 0) {
      clearInterval(progressRef.current);
      return;
    }
    setProgress(0);
    const tickMs = 100;
    const total = (STEP_DURATION * 1000) / tickMs;
    let tick = 0;
    progressRef.current = setInterval(() => {
      tick++;
      setProgress((tick / total) * 100);
      if (tick >= total) {
        clearInterval(progressRef.current);
        setCurrentStep(prev => {
          if (prev + 1 >= steps.length) { setPlaying(false); return prev; }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 md:p-4">
      <div className="bg-gray-950 border border-gray-700 rounded-2xl w-full max-w-6xl max-h-[96vh] overflow-hidden flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 flex-shrink-0 bg-gray-900/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            <span className="text-gray-400 text-xs font-mono uppercase tracking-widest flex-shrink-0">Build Guide</span>
            <span className="text-white font-black text-sm truncate">{invention.name}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {steps.length > 0 && (
              <>
                <button onClick={toggleAudio}
                  title={audioEnabled ? "Mute audio" : "Enable audio"}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${audioEnabled ? "bg-indigo-800 text-indigo-200" : "bg-gray-800 text-gray-500"}`}>
                  {audioEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                  {audioEnabled ? "Audio On" : "Muted"}
                </button>
                <button onClick={() => downloadStepsAsPDF(invention, steps)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800/60 border border-blue-700 text-blue-300 text-xs font-bold transition-colors">
                  <Download size={11} /> PDF
                </button>
              </>
            )}
            <button onClick={() => { stopAudio(); onClose(); }} className="text-gray-500 hover:text-white transition-colors p-1">
              <X size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16">
            <Loader2 size={36} className="animate-spin text-indigo-400" />
            <p className="text-white font-black text-lg">Engineering build instructions…</p>
            <p className="text-gray-500 text-sm max-w-sm text-center">
              AI is generating step-by-step assembly guide with materials, costs, and audio narration for {invention.name}
            </p>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden min-h-0">

            {/* Step sidebar */}
            <div className="w-44 flex-shrink-0 border-r border-gray-800 overflow-y-auto bg-gray-900/30 hidden md:block">
              {steps.map((s, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className={`w-full text-left px-3 py-2.5 border-b border-gray-800/60 transition-all ${currentStep === i ? "bg-gray-800/80" : "hover:bg-gray-800/30"}`}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-black font-mono" style={{ color: currentStep === i ? typeColor : "#374151" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {currentStep === i && playing && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                    {i < currentStep && (
                      <span style={{ color: "#34d399", fontSize: 10 }}>✓</span>
                    )}
                  </div>
                  <p className={`text-xs leading-tight ${currentStep === i ? "text-white font-semibold" : "text-gray-600"}`} style={{ fontSize: 10 }}>
                    {s.title}
                  </p>
                  <p className="text-gray-700 text-xs mt-0.5" style={{ fontSize: 9 }}>{s.duration}</p>
                </button>
              ))}
            </div>

            {/* Main panel */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              {step && (
                <>
                  {/* Video canvas */}
                  <div className="relative flex-shrink-0 bg-black">
                    <StepVisual step={step} index={currentStep} playing={playing} progress={progress} />
                    {/* Duration badge */}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      <span className="flex items-center gap-1 text-xs bg-black/60 px-2 py-0.5 rounded" style={{ color: typeColor }}>
                        <Clock size={9} /> {step.duration}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800">
                      <div className="h-full transition-all duration-100" style={{ width: `${progress}%`, backgroundColor: typeColor }} />
                    </div>
                  </div>

                  {/* Playback controls */}
                  <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-800 bg-gray-900/50 flex-shrink-0">
                    <button onClick={() => goTo(Math.max(0, currentStep - 1))} disabled={currentStep === 0}
                      className="text-gray-400 hover:text-white disabled:opacity-30"><SkipBack size={15} /></button>
                    <button onClick={() => setPlaying(p => !p)}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: typeColor }}>
                      {playing ? <Pause size={13} className="text-black" /> : <Play size={13} className="text-black ml-0.5" />}
                    </button>
                    <button onClick={() => goTo(Math.min(steps.length - 1, currentStep + 1))} disabled={currentStep === steps.length - 1}
                      className="text-gray-400 hover:text-white disabled:opacity-30"><SkipForward size={15} /></button>
                    <div className="flex-1 bg-gray-800 rounded-full h-1.5 cursor-pointer"
                      onClick={e => {
                        const r = e.currentTarget.getBoundingClientRect();
                        goTo(Math.max(0, Math.min(steps.length - 1, Math.floor(((e.clientX - r.left) / r.width) * steps.length))));
                      }}>
                      <div className="h-full rounded-full" style={{ width: `${((currentStep + progress / 100) / steps.length) * 100}%`, backgroundColor: typeColor }} />
                    </div>
                    <span className="text-gray-500 text-xs font-mono">{currentStep + 1}/{steps.length}</span>
                  </div>

                  {/* Step detail scrollable area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {/* Title + description */}
                    <div>
                      <h2 className="font-black text-base" style={{ color: typeColor }}>
                        Step {currentStep + 1}: {step.title}
                      </h2>
                      <p className="text-gray-300 text-sm leading-relaxed mt-1">{step.description}</p>
                    </div>

                    {/* Audio script indicator */}
                    {step.audio_script && audioEnabled && (
                      <div className="flex items-start gap-2 bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-2.5">
                        <Volume2 size={12} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                        <p className="text-indigo-300 text-xs leading-relaxed italic">{step.audio_script}</p>
                      </div>
                    )}

                    {/* Warning */}
                    {step.warning && (
                      <div className="flex items-start gap-2 bg-red-950/30 border border-red-800/50 rounded-xl p-3">
                        <AlertTriangle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-300 text-xs leading-relaxed font-semibold">{step.warning}</p>
                      </div>
                    )}

                    {/* Materials with cost/purchase */}
                    {(step.materials || []).length > 0 && (
                      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-800 bg-gray-800/40">
                          <ShoppingCart size={11} className="text-cyan-400" />
                          <span className="text-cyan-400 text-xs font-black uppercase tracking-wider">Materials, Cost & Where to Buy</span>
                        </div>
                        <div className="divide-y divide-gray-800/60">
                          {(step.materials || []).map((m, i) => {
                            const name = typeof m === "object" ? m.name : m;
                            const cost = typeof m === "object" ? m.cost : null;
                            const where = typeof m === "object" ? m.where : null;
                            return (
                              <div key={i} className="flex items-center gap-3 px-3 py-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-gray-200 text-xs font-semibold truncate">{name}</p>
                                  {where && <p className="text-gray-500 text-xs truncate">{where}</p>}
                                </div>
                                {cost && (
                                  <span className="flex items-center gap-0.5 text-green-400 font-black text-xs flex-shrink-0">
                                    <DollarSign size={9} />{cost.replace(/^\$/, "")}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Tools */}
                    {(step.tools || []).length > 0 && (
                      <div className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Wrench size={11} className="text-yellow-400" />
                          <span className="text-yellow-400 text-xs font-black uppercase tracking-wider">Tools Required</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {step.tools.map((t, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-yellow-950/40 border border-yellow-800/50 text-yellow-300">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Checkpoint */}
                    <div className="bg-green-950/20 border border-green-900/40 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <ChevronRight size={11} className="text-green-400" />
                        <span className="text-green-400 text-xs font-black uppercase tracking-wider">Checkpoint — Verify Before Proceeding</span>
                      </div>
                      <p className="text-green-200 text-xs leading-relaxed">{step.checkpoint}</p>
                    </div>

                    {/* Mobile step nav */}
                    <div className="flex gap-1 flex-wrap md:hidden pt-1">
                      {steps.map((_, i) => (
                        <button key={i} onClick={() => goTo(i)}
                          className="w-7 h-7 rounded-lg text-xs font-bold transition-all"
                          style={{
                            backgroundColor: i === currentStep ? typeColor : i < currentStep ? "#1f4a30" : "#1f2937",
                            color: i === currentStep ? "#000" : i < currentStep ? "#34d399" : "#6b7280",
                          }}>
                          {i + 1}
                        </button>
                      ))}
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