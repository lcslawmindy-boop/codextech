import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Trash2, Zap, Sparkles, Info, RotateCcw, Download } from "lucide-react";

// ── Color mapping: plasma palette ─────────────────────────────────────────────
function plasmaColor(t) {
  // t in [0,1] → RGBA
  const clamp = (v) => Math.max(0, Math.min(255, v));
  // Plasma: deep purple → magenta → orange → yellow
  const r = clamp(Math.round(13 + t * (240 - 13) + Math.sin(t * Math.PI) * 40));
  const g = clamp(Math.round(8 + t * t * 180 - (1 - t) * 60));
  const b = clamp(Math.round(135 - t * 130 + Math.sin(t * Math.PI * 2) * 30));
  return [r, g, b];
}

function cyanColor(t) {
  const clamp = (v) => Math.max(0, Math.min(255, v));
  return [
    clamp(Math.round(t * 50)),
    clamp(Math.round(200 + t * 55)),
    clamp(Math.round(200 + t * 55)),
  ];
}

function heatColor(t) {
  const clamp = (v) => Math.max(0, Math.min(255, v));
  return [
    clamp(Math.round(t < 0.5 ? t * 2 * 255 : 255)),
    clamp(Math.round(t < 0.5 ? 0 : (t - 0.5) * 2 * 255)),
    clamp(Math.round((1 - t) * 80)),
  ];
}

const COLOR_MAPS = {
  plasma: plasmaColor,
  cyan: cyanColor,
  heat: heatColor,
};

// ── Potential field computation ───────────────────────────────────────────────
function computeField(nodes, width, height, mode) {
  const field = new Float32Array(width * height);
  if (!nodes.length) return { field, maxVal: 1 };

  const EPSILON = 8; // min distance to avoid singularity

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let phi = 0;
      for (const node of nodes) {
        const dx = x - node.x;
        const dy = y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + EPSILON;
        const sign = node.type === "source" ? 1 : -1;
        if (mode === "potential") {
          phi += sign * node.strength / dist;
        } else {
          // gradient magnitude: |∇φ| = A / r²
          phi += node.strength / (dist * dist);
        }
      }
      field[y * width + x] = phi;
    }
  }

  // Normalize
  let minVal = Infinity, maxVal = -Infinity;
  for (let i = 0; i < field.length; i++) {
    if (field[i] < minVal) minVal = field[i];
    if (field[i] > maxVal) maxVal = field[i];
  }
  const range = maxVal - minVal || 1;
  for (let i = 0; i < field.length; i++) {
    field[i] = (field[i] - minVal) / range;
  }
  return { field, maxVal };
}

// ── Find top interference zones ───────────────────────────────────────────────
function findHotZones(field, width, height, count = 5) {
  const scored = [];
  const CELL = 30;
  const cols = Math.floor(width / CELL);
  const rows = Math.floor(height / CELL);

  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      let sum = 0, cnt = 0;
      for (let dy = 0; dy < CELL; dy++) {
        for (let dx = 0; dx < CELL; dx++) {
          const px = gx * CELL + dx;
          const py = gy * CELL + dy;
          if (px < width && py < height) {
            sum += field[py * width + px];
            cnt++;
          }
        }
      }
      scored.push({ gx, gy, cx: gx * CELL + CELL / 2, cy: gy * CELL + CELL / 2, score: sum / cnt });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  // Deduplicate nearby zones
  const zones = [];
  for (const z of scored) {
    if (zones.length >= count) break;
    const tooClose = zones.some(z2 => Math.hypot(z.cx - z2.cx, z.cy - z2.cy) < CELL * 2);
    if (!tooClose) zones.push(z);
  }
  return zones;
}

const DEVICE_SUGGESTIONS = [
  { name: "Asymmetric MEG Device", desc: "Maximum vacuum energy extraction at ∇φ peak", icon: "⚡" },
  { name: "Priore-Class Biofield Emitter", desc: "Therapeutic scalar irradiation at coherence zone", icon: "🧬" },
  { name: "Phase Conjugate Mirror Array", desc: "Time-reversal zone amplification node", icon: "🔮" },
  { name: "Anenergy Pump Inlet", desc: "Free phi-field gradient harvesting node", icon: "🌊" },
  { name: "Scalar EM Resonator", desc: "Standing wave lock-in at interference maximum", icon: "〰️" },
];

const PRESETS = {
  dipole: [
    { id: 1, x: 200, y: 200, type: "source", strength: 60 },
    { id: 2, x: 400, y: 200, type: "sink", strength: 60 },
  ],
  triangle: [
    { id: 1, x: 300, y: 120, type: "source", strength: 60 },
    { id: 2, x: 180, y: 280, type: "source", strength: 60 },
    { id: 3, x: 420, y: 280, type: "sink", strength: 80 },
  ],
  quad: [
    { id: 1, x: 150, y: 150, type: "source", strength: 70 },
    { id: 2, x: 450, y: 150, type: "source", strength: 70 },
    { id: 3, x: 150, y: 300, type: "sink", strength: 70 },
    { id: 4, x: 450, y: 300, type: "sink", strength: 70 },
  ],
  woodpecker: [
    { id: 1, x: 100, y: 200, type: "source", strength: 100 },
    { id: 2, x: 300, y: 200, type: "source", strength: 100 },
    { id: 3, x: 500, y: 200, type: "source", strength: 100 },
    { id: 4, x: 200, y: 200, type: "sink", strength: 60 },
    { id: 5, x: 400, y: 200, type: "sink", strength: 60 },
  ],
};

export default function ScalarPotentialMap() {
  const canvasRef = useRef(null);
  const offscreenRef = useRef(null);
  const animRef = useRef(null);
  const nodesRef = useRef([]);
  const navigate = useNavigate();

  const [nodes, setNodes] = useState([]);
  const [placeMode, setPlaceMode] = useState("source"); // source | sink
  const [colorMap, setColorMap] = useState("plasma");
  const [fieldMode, setFieldMode] = useState("gradient"); // gradient | potential
  const [showVectors, setShowVectors] = useState(false);
  const [showZones, setShowZones] = useState(true);
  const [hotZones, setHotZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [nextId, setNextId] = useState(10);
  const [animTime, setAnimTime] = useState(0);
  const [strength, setStrength] = useState(60);
  const [showInfo, setShowInfo] = useState(false);

  const W = 600, H = 400;

  // Keep ref in sync
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (!offscreenRef.current) {
      offscreenRef.current = new OffscreenCanvas(W, H);
    }
    const oc = offscreenRef.current;
    const octx = oc.getContext("2d");

    let t = 0;
    const render = () => {
      t += 0.02;
      const currentNodes = nodesRef.current;

      if (currentNodes.length === 0) {
        // Empty state
        ctx.fillStyle = "#0a0a14";
        ctx.fillRect(0, 0, W, H);
        // Grid dots
        ctx.fillStyle = "#1a1a2e";
        for (let x = 20; x < W; x += 30) {
          for (let y = 20; y < H; y += 30) {
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.fillStyle = "#334155";
        ctx.font = "14px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Click on the grid to place source (+) or sink (−) nodes", W / 2, H / 2 - 10);
        ctx.fillText("Scalar potential gradients will appear here", W / 2, H / 2 + 12);
        animRef.current = requestAnimationFrame(render);
        return;
      }

      // Compute field
      const { field } = computeField(currentNodes, W, H, fieldMode);

      // Draw heatmap
      const imgData = octx.createImageData(W, H);
      const colorFn = COLOR_MAPS[colorMap] || plasmaColor;
      for (let i = 0; i < field.length; i++) {
        const tVal = Math.pow(field[i], 0.6); // gamma compress
        const [r, g, b] = colorFn(tVal);
        imgData.data[i * 4] = r;
        imgData.data[i * 4 + 1] = g;
        imgData.data[i * 4 + 2] = b;
        imgData.data[i * 4 + 3] = 255;
      }
      octx.putImageData(imgData, 0, 0);

      // Draw vector field overlay
      if (showVectors) {
        const VGRID = 30;
        octx.strokeStyle = "rgba(255,255,255,0.35)";
        octx.lineWidth = 1;
        for (let vy = VGRID; vy < H; vy += VGRID) {
          for (let vx = VGRID; vx < W; vx += VGRID) {
            let gx = 0, gy = 0;
            for (const node of currentNodes) {
              const dx = vx - node.x, dy = vy - node.y;
              const dist2 = dx * dx + dy * dy + 64;
              const sign = node.type === "source" ? 1 : -1;
              gx += sign * dx / dist2;
              gy += sign * dy / dist2;
            }
            const len = Math.sqrt(gx * gx + gy * gy) + 0.001;
            const scale = 10;
            const ex = vx + (gx / len) * scale;
            const ey = vy + (gy / len) * scale;
            octx.beginPath();
            octx.moveTo(vx, vy);
            octx.lineTo(ex, ey);
            octx.stroke();
            octx.beginPath();
            octx.arc(ex, ey, 1.5, 0, Math.PI * 2);
            octx.fill();
          }
        }
      }

      ctx.drawImage(oc, 0, 0);

      // Hot zones
      if (showZones && currentNodes.length >= 2) {
        const zones = findHotZones(field, W, H, 5);
        zones.forEach((z, i) => {
          const pulse = 0.7 + 0.3 * Math.sin(t * 2 + i);
          ctx.strokeStyle = `rgba(255, 220, 50, ${pulse * 0.9})`;
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(z.cx - 20, z.cy - 20, 40, 40);
          ctx.setLineDash([]);
          ctx.fillStyle = `rgba(255, 220, 50, ${pulse})`;
          ctx.font = "bold 10px monospace";
          ctx.textAlign = "center";
          ctx.fillText(`Z${i + 1}`, z.cx, z.cy - 24);
          ctx.fillText(`${(z.score * 100).toFixed(0)}%`, z.cx, z.cy - 14);
        });
        setHotZones(zones);
      }

      // Draw nodes
      currentNodes.forEach((node) => {
        const isSource = node.type === "source";
        const pulse = 1 + 0.15 * Math.sin(t * 3 + node.id);

        // Glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 20 * pulse);
        gradient.addColorStop(0, isSource ? "rgba(100,180,255,0.6)" : "rgba(255,100,100,0.6)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = isSource ? "#60b8ff" : "#ff6060";
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        ctx.fillStyle = "white";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillText(isSource ? "+" : "−", node.x, node.y + 4);

        // Strength ring
        ctx.strokeStyle = isSource ? "rgba(100,180,255,0.3)" : "rgba(255,100,100,0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, (node.strength / 100) * 30, 0, Math.PI * 2);
        ctx.stroke();
      });

      animRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animRef.current);
  }, [nodes, colorMap, fieldMode, showVectors, showZones]);

  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);

    const newNode = { id: nextId, x, y, type: placeMode, strength };
    setNodes(prev => [...prev, newNode]);
    setNextId(id => id + 1);
  }, [placeMode, nextId, strength]);

  const handleCanvasRightClick = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Remove nearest node within 20px
    setNodes(prev => {
      const nearest = prev.reduce((best, n) => {
        const d = Math.hypot(n.x - x, n.y - y);
        return d < (best?.d ?? Infinity) ? { n, d } : best;
      }, null);
      if (nearest && nearest.d < 20) return prev.filter(n => n.id !== nearest.n.id);
      return prev;
    });
  }, []);

  const loadPreset = (key) => {
    setNodes(PRESETS[key]);
    setNextId(100);
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "scalar-potential-map.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const forgeParams = hotZones.length > 0 && nodes.length >= 2
    ? `?hint=${encodeURIComponent(JSON.stringify({
        zones: hotZones.slice(0, 3).map((z, i) => ({ label: `Zone ${i + 1}`, score: z.score.toFixed(3) })),
        nodes: nodes.length,
        pattern: fieldMode,
      }))}`
    : "";

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Graph</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base">∇φ Scalar Potential Map</h1>
            <p className="text-gray-500 text-xs">Place source/sink nodes · Observe ∇φ interference patterns · Find device placement zones</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowInfo(s => !s)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
            <Info size={14} />
          </button>
          <button onClick={exportCanvas}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs">
            <Download size={12} /> Export PNG
          </button>
          <Link to={`/inventor-forge${forgeParams}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-xs transition-all">
            <Sparkles size={12} /> Send to Invention Forge
          </Link>
        </div>
      </div>

      {showInfo && (
        <div className="bg-blue-950/30 border-b border-blue-900/40 px-5 py-3 text-xs text-blue-200 leading-relaxed">
          <strong className="text-blue-300">How it works:</strong> The scalar potential φ at each grid point is computed as φ = Σ (±A_i / |r − r_i|), where source nodes add positive potential and sink nodes subtract. The heatmap shows the gradient magnitude |∇φ| = A/r², revealing interference zones where wave energy concentrates. Yellow boxes mark the highest-intensity zones — ideal for device placement per Bearden's anenergy pump principle.
          <br /><span className="text-blue-400">Left-click</span> to place a node · <span className="text-blue-400">Right-click</span> to remove nearest node · Presets load common Bearden configurations.
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left controls */}
        <div className="w-56 flex-shrink-0 border-r border-gray-800 p-4 space-y-4 overflow-y-auto bg-gray-950">
          {/* Place mode */}
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">Place Mode</p>
            <div className="flex gap-2">
              <button onClick={() => setPlaceMode("source")}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold border transition-all ${placeMode === "source" ? "bg-blue-700 border-blue-500 text-white" : "bg-gray-800 border-gray-700 text-gray-400"}`}>
                <Plus size={12} /> Source
              </button>
              <button onClick={() => setPlaceMode("sink")}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold border transition-all ${placeMode === "sink" ? "bg-red-700 border-red-500 text-white" : "bg-gray-800 border-gray-700 text-gray-400"}`}>
                <Minus size={12} /> Sink
              </button>
            </div>
          </div>

          {/* Strength */}
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">Node Strength: <span className="text-white">{strength}</span></p>
            <input type="range" min="10" max="120" value={strength} onChange={e => setStrength(Number(e.target.value))}
              className="w-full accent-blue-500" />
          </div>

          {/* Field mode */}
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">Field Display</p>
            {[["gradient", "Gradient |∇φ|"], ["potential", "Potential φ"]].map(([v, l]) => (
              <label key={v} className="flex items-center gap-2 text-xs text-gray-300 mb-1 cursor-pointer">
                <input type="radio" name="fieldMode" value={v} checked={fieldMode === v} onChange={() => setFieldMode(v)} className="accent-blue-500" />
                {l}
              </label>
            ))}
          </div>

          {/* Color map */}
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">Color Map</p>
            {[["plasma", "Plasma"], ["cyan", "Cyan"], ["heat", "Heat"]].map(([v, l]) => (
              <label key={v} className="flex items-center gap-2 text-xs text-gray-300 mb-1 cursor-pointer">
                <input type="radio" name="colorMap" value={v} checked={colorMap === v} onChange={() => setColorMap(v)} className="accent-blue-500" />
                {l}
              </label>
            ))}
          </div>

          {/* Overlays */}
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">Overlays</p>
            <label className="flex items-center gap-2 text-xs text-gray-300 mb-1 cursor-pointer">
              <input type="checkbox" checked={showVectors} onChange={e => setShowVectors(e.target.checked)} className="accent-blue-500" />
              Vector arrows ∇φ
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
              <input type="checkbox" checked={showZones} onChange={e => setShowZones(e.target.checked)} className="accent-blue-500" />
              Hot zones (Z1–Z5)
            </label>
          </div>

          {/* Presets */}
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">Presets</p>
            {[["dipole", "Dipole"], ["triangle", "Triangle"], ["quad", "Quad Grid"], ["woodpecker", "Woodpecker"]].map(([k, l]) => (
              <button key={k} onClick={() => loadPreset(k)}
                className="w-full text-left px-2 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs mb-1 transition-colors">
                {l}
              </button>
            ))}
          </div>

          {/* Clear */}
          <button onClick={() => setNodes([])}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-red-900 text-red-400 hover:bg-red-900/20 text-xs transition-colors">
            <RotateCcw size={12} /> Clear All
          </button>
        </div>

        {/* Canvas area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-950 p-4 overflow-auto">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            onClick={handleCanvasClick}
            onContextMenu={handleCanvasRightClick}
            className="rounded-xl border border-gray-700 cursor-crosshair shadow-[0_0_40px_rgba(100,100,255,0.15)]"
            style={{ maxWidth: "100%", touchAction: "none" }}
          />
          <p className="text-gray-600 text-xs mt-2">Left-click: place node · Right-click: remove node · {nodes.length} node{nodes.length !== 1 ? "s" : ""} active</p>
        </div>

        {/* Right panel: nodes + zones */}
        <div className="w-64 flex-shrink-0 border-l border-gray-800 p-4 space-y-4 overflow-y-auto bg-gray-950">
          {/* Node list */}
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">Active Nodes ({nodes.length})</p>
            {nodes.length === 0 && <p className="text-gray-700 text-xs italic">No nodes placed yet</p>}
            <div className="space-y-1">
              {nodes.map(n => (
                <div key={n.id} className="flex items-center justify-between bg-gray-900 rounded-lg px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${n.type === "source" ? "bg-blue-700 text-white" : "bg-red-700 text-white"}`}>
                      {n.type === "source" ? "+" : "−"}
                    </span>
                    <span className="text-gray-300 text-xs">{n.x},{n.y}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs">{n.strength}</span>
                    <button onClick={() => setNodes(prev => prev.filter(x => x.id !== n.id))}
                      className="text-gray-600 hover:text-red-400 transition-colors">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hot zones */}
          {hotZones.length > 0 && nodes.length >= 2 && (
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">
                <span className="text-yellow-400">●</span> Interference Zones
              </p>
              <div className="space-y-2">
                {hotZones.map((z, i) => {
                  const suggestion = DEVICE_SUGGESTIONS[i % DEVICE_SUGGESTIONS.length];
                  return (
                    <div key={i}
                      onClick={() => setSelectedZone(selectedZone === i ? null : i)}
                      className={`rounded-lg border p-2 cursor-pointer transition-all ${selectedZone === i ? "border-yellow-600 bg-yellow-950/20" : "border-gray-800 bg-gray-900 hover:border-gray-600"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-yellow-400 font-bold text-xs">Zone {i + 1}</span>
                        <span className="text-gray-400 text-xs">{(z.score * 100).toFixed(1)}% intensity</span>
                      </div>
                      <p className="text-gray-400 text-xs">({Math.round(z.cx)}, {Math.round(z.cy)})</p>
                      {selectedZone === i && (
                        <div className="mt-2 pt-2 border-t border-gray-700 space-y-1">
                          <p className="text-xs text-gray-300 font-semibold">{suggestion.icon} Suggested Device:</p>
                          <p className="text-xs text-blue-300 font-bold">{suggestion.name}</p>
                          <p className="text-xs text-gray-500 leading-snug">{suggestion.desc}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Forge link */}
              <div className="mt-3 bg-blue-950/20 border border-blue-900/40 rounded-xl p-3">
                <p className="text-blue-300 text-xs font-bold mb-1">⚡ Ready for Invention Forge</p>
                <p className="text-blue-400 text-xs mb-2 leading-snug">{hotZones.length} interference zone{hotZones.length > 1 ? "s" : ""} identified — generate device concepts optimized for these field positions.</p>
                <Link to={`/inventor-forge${forgeParams}`}
                  className="block text-center py-2 rounded-lg bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-xs transition-all">
                  🧬 Generate Inventions →
                </Link>
              </div>
            </div>
          )}

          {/* Physics reference */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 space-y-1">
            <p className="text-gray-400 text-xs font-bold mb-2">Physics Reference</p>
            <p className="text-gray-600 text-xs font-mono">φ = Σ ±A_i / |r − r_i|</p>
            <p className="text-gray-600 text-xs font-mono">|∇φ| = A / r²</p>
            <p className="text-gray-600 text-xs font-mono">E = −∇φ (no mass)</p>
            <p className="text-gray-500 text-xs mt-2 leading-snug">Source: Bearden, <em>Toward a New Electromagnetics</em> Pt. 4 (1983) — phi-river gradient as massless charge flow vector.</p>
          </div>
        </div>
      </div>
    </div>
  );
}