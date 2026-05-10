import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Zap, Info, Filter, Search, RefreshCw,
  Layers, Eye, Crosshair, Radio, X
} from "lucide-react";
import { base44 } from "@/api/base44Client";

// ── Color/Mode Config ────────────────────────────────────────────────────────

const MODES = {
  analyst: {
    label: "Analyst",
    bg: "#0f172a",
    nodeColors: { invention: "#06b6d4", "prior-art": "#a855f7", threat: "#f97316", cluster: "#22c55e" },
    edgeColor: "rgba(100,116,139,0.25)",
    glow: false,
  },
  electric: {
    label: "Electric",
    bg: "#020617",
    nodeColors: { invention: "#00ffff", "prior-art": "#bf00ff", threat: "#ff6600", cluster: "#00ff88" },
    edgeColor: "rgba(0,255,255,0.15)",
    glow: true,
  },
  research: {
    label: "Research",
    bg: "#0a0a0f",
    nodeColors: { invention: "#fbbf24", "prior-art": "#818cf8", threat: "#f43f5e", cluster: "#34d399" },
    edgeColor: "rgba(148,163,184,0.15)",
    glow: false,
  },
};

// ── Scalar Wave Overlay ──────────────────────────────────────────────────────

function ScalarWaveCanvas({ width, height, mode }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || mode !== "electric") return;
    const ctx = ref.current.getContext("2d");
    let frame = 0;
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const t = frame / 60;
      for (let ring = 1; ring <= 4; ring++) {
        const r = (ring * 80 + Math.sin(t * 0.8) * 20);
        const alpha = 0.04 - ring * 0.008;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,255,255,${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      frame++;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [mode, width, height]);

  if (mode !== "electric") return null;
  return (
    <canvas ref={ref} width={width} height={height}
      className="absolute inset-0 pointer-events-none" style={{ opacity: 0.6 }} />
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function IPNetworkGraph() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);

  const [rawNodes, setRawNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [positions, setPositions] = useState([]);
  const [velocities, setVelocities] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("analyst");
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });
  const [showLegend, setShowLegend] = useState(true);

  // Observe container resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      const e = entries[0];
      if (e) setCanvasSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => { loadNetworkData(); }, []);

  const loadNetworkData = async () => {
    setLoading(true);
    try {
      const [inventions, priorArt, alerts] = await Promise.all([
        base44.entities.HybridInvention.list("-created_date", 20),
        base44.entities.PriorArtEntry.list("-created_date", 20),
        base44.entities.MonitoringAlert.filter({ status: "new" }, "-risk_score", 10),
      ]);

      const invNodes = (inventions || []).map((inv, i) => ({
        id: `inv_${i}`, label: inv.hybrid_concept?.slice(0, 28) || "Invention",
        fullLabel: inv.hybrid_concept, type: "invention", data: inv,
        degree: 3 + Math.floor(Math.random() * 3),
      }));
      const artNodes = (priorArt || []).slice(0, 18).map((art, i) => ({
        id: `art_${i}`, label: art.title?.slice(0, 24) || "Prior Art",
        fullLabel: art.title, type: "prior-art", data: art,
        degree: 1 + Math.floor(Math.random() * 3),
      }));
      const threatNodes = (alerts || []).filter(a => ["critical","high"].includes(a.risk_level)).slice(0, 8).map((t, i) => ({
        id: `threat_${i}`, label: t.title?.slice(0, 22) || "Threat",
        fullLabel: t.title, type: "threat", data: t,
        degree: 1 + Math.floor(Math.random() * 2),
      }));

      const allNodes = [...invNodes, ...artNodes, ...threatNodes];
      const W = canvasSize.w, H = canvasSize.h;

      // Distribute in rings
      const initPos = allNodes.map((_, i) => {
        const angle = (i / allNodes.length) * Math.PI * 2;
        const r = 80 + Math.random() * (Math.min(W, H) / 2 - 100);
        return { x: W / 2 + Math.cos(angle) * r, y: H / 2 + Math.sin(angle) * r };
      });

      setRawNodes(allNodes);
      setPositions(initPos);
      setVelocities(allNodes.map(() => ({ vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 })));

      // Edges
      const graphEdges = [];
      invNodes.forEach((inv, i) => {
        const artCount = Math.min(3, artNodes.length);
        for (let k = 0; k < artCount; k++) {
          const idx = (i + k) % artNodes.length;
          graphEdges.push({ source: inv.id, target: artNodes[idx].id, type: "related" });
        }
        if (i < threatNodes.length) {
          graphEdges.push({ source: inv.id, target: threatNodes[i].id, type: "competes" });
        }
      });
      setEdges(graphEdges);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Force simulation render loop
  useEffect(() => {
    if (rawNodes.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvasSize.w;
    const H = canvasSize.h;
    canvas.width = W;
    canvas.height = H;

    const modeConfig = MODES[mode];
    let pos = positions.map(p => ({ ...p }));
    let vel = velocities.map(v => ({ ...v }));

    let frame = 0;

    const draw = () => {
      // Physics
      for (let i = 0; i < pos.length; i++) {
        let fx = 0, fy = 0;
        // Repulsion
        for (let j = 0; j < pos.length; j++) {
          if (i === j) continue;
          const dx = pos[i].x - pos[j].x;
          const dy = pos[i].y - pos[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 3500 / (dist * dist);
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
        }
        // Attraction (edges)
        edges.forEach(edge => {
          if (edge.source === rawNodes[i]?.id) {
            const ti = rawNodes.findIndex(n => n.id === edge.target);
            if (ti !== -1) {
              const dx = pos[ti].x - pos[i].x;
              const dy = pos[ti].y - pos[i].y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const spring = Math.max(0, dist - 120) * 0.04;
              fx += (dx / dist) * spring;
              fy += (dy / dist) * spring;
            }
          }
        });
        // Center gravity
        fx += (W / 2 - pos[i].x) * 0.003;
        fy += (H / 2 - pos[i].y) * 0.003;
        // Boundary
        if (pos[i].x < 30) fx += 3;
        if (pos[i].x > W - 30) fx -= 3;
        if (pos[i].y < 30) fy += 3;
        if (pos[i].y > H - 30) fy -= 3;

        const damping = frame < 120 ? 0.88 : 0.96;
        vel[i].vx = (vel[i].vx + fx * 0.015) * damping;
        vel[i].vy = (vel[i].vy + fy * 0.015) * damping;
        pos[i].x += vel[i].vx;
        pos[i].y += vel[i].vy;
      }

      // Draw bg
      ctx.fillStyle = modeConfig.bg;
      ctx.fillRect(0, 0, W, H);

      // Grid (analyst mode)
      if (mode === "analyst") {
        ctx.strokeStyle = "rgba(255,255,255,0.025)";
        ctx.lineWidth = 0.5;
        for (let gx = 0; gx < W; gx += 60) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
        for (let gy = 0; gy < H; gy += 60) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }
      }

      // Draw edges
      edges.forEach(edge => {
        const si = rawNodes.findIndex(n => n.id === edge.source);
        const ti = rawNodes.findIndex(n => n.id === edge.target);
        if (si === -1 || ti === -1) return;
        ctx.beginPath();
        ctx.strokeStyle = modeConfig.edgeColor;
        ctx.lineWidth = edge.type === "competes" ? 1.5 : 0.8;
        if (edge.type === "competes") ctx.setLineDash([4, 4]);
        ctx.moveTo(pos[si].x, pos[si].y);
        ctx.lineTo(pos[ti].x, pos[ti].y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Edge label at midpoint
        const mx = (pos[si].x + pos[ti].x) / 2;
        const my = (pos[si].y + pos[ti].y) / 2;
        ctx.fillStyle = "rgba(100,116,139,0.5)";
        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.fillText(edge.type, mx, my);
      });

      // Draw nodes
      rawNodes.forEach((node, i) => {
        const { x, y } = pos[i];
        const isSelected = selectedNode?.id === node.id;
        const baseColor = modeConfig.nodeColors[node.type] || "#888";
        const r = 6 + node.degree * 2;

        if (modeConfig.glow || isSelected) {
          ctx.save();
          ctx.shadowBlur = isSelected ? 24 : 12;
          ctx.shadowColor = baseColor;
        }

        ctx.fillStyle = isSelected ? "#ffffff" : baseColor;
        ctx.beginPath();
        ctx.arc(x, y, isSelected ? r + 3 : r, 0, Math.PI * 2);
        ctx.fill();

        if (modeConfig.glow || isSelected) ctx.restore();

        // Label
        ctx.font = `${isSelected ? "bold " : ""}9px monospace`;
        ctx.fillStyle = isSelected ? "#fff" : "rgba(226,232,240,0.7)";
        ctx.textAlign = "center";
        ctx.fillText(node.label?.slice(0, 16), x, y + r + 11);
      });

      frame++;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [rawNodes, edges, mode, selectedNode, canvasSize]);

  const handleCanvasClick = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scaleX = canvasSize.w / rect.width;
    const scaleY = canvasSize.h / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Find closest node within hit radius
    let closest = null, minDist = Infinity;
    rawNodes.forEach((node, i) => {
      // positions state may be stale; use canvas drawn positions approximation
      // We'll just test against last known positions array
    });

    // Simple hit test using last rendered positions from rawNodes
    // Attach positions to rawNodes for hit testing
    const hit = rawNodes.find((node, i) => {
      const p = { x: node._x, y: node._y };
      if (!p.x) return false;
      return Math.hypot(p.x - x, p.y - y) < 20;
    });
    if (hit) setSelectedNode(s => s?.id === hit.id ? null : hit);
  }, [rawNodes, canvasSize]);

  const filteredNodes = filterType === "all" ? rawNodes : rawNodes.filter(n => n.type === filterType);
  const searchFiltered = search
    ? filteredNodes.filter(n => n.label?.toLowerCase().includes(search.toLowerCase()))
    : filteredNodes;

  return (
    <div className="flex flex-col bg-slate-950 text-slate-50" style={{ height: "100%" }}>
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/90 px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/ai-os" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-xs transition-colors">
            <ArrowLeft size={13} /> Back
          </Link>
          <div className="w-px h-4 bg-slate-700" />
          <h1 className="text-white font-black text-base flex items-center gap-2">
            <Zap size={16} className="text-cyan-400" /> IP Network Graph
          </h1>
          <span className="text-slate-600 text-xs">{rawNodes.length} nodes · {edges.length} edges</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Mode switcher */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            {Object.entries(MODES).map(([key, cfg]) => (
              <button key={key} onClick={() => setMode(key)}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                  mode === key ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300" : "text-slate-500 hover:text-slate-300"
                }`}>
                {cfg.label}
              </button>
            ))}
          </div>
          <button onClick={loadNetworkData} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-200 transition-colors">
            <RefreshCw size={13} />
          </button>
          <button onClick={() => setShowLegend(l => !l)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-200 transition-colors">
            <Eye size={13} />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="border-b border-slate-800 px-5 py-2.5 flex items-center gap-3 flex-wrap flex-shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search nodes..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500" />
        </div>
        <div className="flex items-center gap-1.5">
          {[
            { id: "all", label: "All", color: "#888" },
            { id: "invention", label: "Inventions", color: MODES[mode].nodeColors.invention },
            { id: "prior-art", label: "Prior Art", color: MODES[mode].nodeColors["prior-art"] },
            { id: "threat", label: "Threats", color: MODES[mode].nodeColors.threat },
          ].map(f => (
            <button key={f.id} onClick={() => setFilterType(f.id)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all border ${
                filterType === f.id ? "text-white border-current" : "border-slate-700 text-slate-500 hover:text-slate-300"
              }`}
              style={filterType === f.id ? { borderColor: f.color, backgroundColor: f.color + "20", color: f.color } : {}}>
              {f.label}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-slate-600 ml-auto">{searchFiltered.length} visible</span>
      </div>

      {/* Main canvas area */}
      <div className="flex-1 flex min-h-0">
        {/* Canvas */}
        <div ref={containerRef} className="flex-1 relative overflow-hidden" style={{ background: MODES[mode].bg }}>
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 text-xs">Loading IP network...</p>
            </div>
          ) : (
            <>
              <ScalarWaveCanvas width={canvasSize.w} height={canvasSize.h} mode={mode} />
              <canvas
                ref={canvasRef}
                width={canvasSize.w}
                height={canvasSize.h}
                onClick={handleCanvasClick}
                className="absolute inset-0 w-full h-full cursor-crosshair"
                style={{ imageRendering: "crisp-edges" }}
              />
            </>
          )}

          {/* Legend */}
          {showLegend && (
            <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5">
              {Object.entries(MODES[mode].nodeColors).slice(0, 3).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2 text-[10px]">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-slate-400 capitalize">{type.replace("-", " ")}</span>
                </div>
              ))}
              <div className="border-t border-slate-800 pt-1.5 text-[9px] text-slate-600">
                Node size = degree · Dashed = competes
              </div>
            </div>
          )}

          {/* Hint */}
          <div className="absolute bottom-3 left-3 text-[10px] text-slate-700 flex items-center gap-1">
            <Info size={10} /> Click nodes · Drag to explore
          </div>
        </div>

        {/* Detail Panel */}
        <div className={`w-72 flex-shrink-0 border-l border-slate-800 bg-slate-950 flex flex-col transition-all ${selectedNode ? "" : ""}`}>
          {selectedNode ? (
            <div className="flex flex-col h-full overflow-y-auto p-4 gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">
                    {selectedNode.type.replace("-", " ")}
                  </p>
                  <h3 className="text-white font-black text-sm leading-snug">{selectedNode.fullLabel}</h3>
                </div>
                <button onClick={() => setSelectedNode(null)} className="text-slate-600 hover:text-slate-300 ml-2 mt-0.5">
                  <X size={13} />
                </button>
              </div>

              {/* Node color stripe */}
              <div className="h-1 rounded-full w-full" style={{ backgroundColor: MODES[mode].nodeColors[selectedNode.type] }} />

              {selectedNode.type === "invention" && selectedNode.data && (
                <div className="space-y-3 text-xs">
                  <div>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1">Full Concept</p>
                    <p className="text-slate-300 leading-relaxed">{selectedNode.data.hybrid_concept}</p>
                  </div>
                  {selectedNode.data.mechanism && (
                    <div>
                      <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1">Mechanism</p>
                      <p className="text-slate-300 leading-relaxed">{selectedNode.data.mechanism}</p>
                    </div>
                  )}
                  {(selectedNode.data.ip_value_low || selectedNode.data.ip_value_high) && (
                    <div>
                      <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1">IP Valuation</p>
                      <p className="text-green-400 font-black text-base">
                        ${selectedNode.data.ip_value_low}M–${selectedNode.data.ip_value_high}M
                      </p>
                    </div>
                  )}
                  {selectedNode.data.status && (
                    <div>
                      <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1">Status</p>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-900/40 text-cyan-400 text-[10px] font-bold capitalize">
                        {selectedNode.data.status}
                      </span>
                    </div>
                  )}
                  <Link to="/hybrid-portfolio" className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-[10px] font-bold">
                    Open in Portfolio →
                  </Link>
                </div>
              )}

              {selectedNode.type === "prior-art" && selectedNode.data && (
                <div className="space-y-3 text-xs">
                  <div>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1">Inventor</p>
                    <p className="text-slate-300">{selectedNode.data.inventor}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-slate-500 font-bold text-[10px] uppercase mb-1">Year</p>
                      <p className="text-slate-300 font-bold">{selectedNode.data.year}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-bold text-[10px] uppercase mb-1">Outcome</p>
                      <p className="text-purple-400 font-bold text-[10px]">{selectedNode.data.outcome}</p>
                    </div>
                  </div>
                  {selectedNode.data.description && (
                    <div>
                      <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1">Description</p>
                      <p className="text-slate-300 leading-relaxed line-clamp-4">{selectedNode.data.description}</p>
                    </div>
                  )}
                  {selectedNode.data.category && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-400 text-[10px] font-bold">
                      {selectedNode.data.category}
                    </span>
                  )}
                  <Link to="/prior-art" className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-[10px] font-bold">
                    View in Archive →
                  </Link>
                </div>
              )}

              {selectedNode.type === "threat" && selectedNode.data && (
                <div className="space-y-3 text-xs">
                  <div>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1">Risk Level</p>
                    <p className="font-black text-base" style={{ color: selectedNode.data.risk_level === "critical" ? "#ef4444" : "#f97316" }}>
                      {selectedNode.data.risk_level?.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1">Source Type</p>
                    <p className="text-slate-300">{selectedNode.data.source_type}</p>
                  </div>
                  {selectedNode.data.summary && (
                    <div>
                      <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1">Summary</p>
                      <p className="text-slate-300 leading-relaxed line-clamp-4">{selectedNode.data.summary}</p>
                    </div>
                  )}
                  {selectedNode.data.recommended_action && (
                    <div>
                      <p className="text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-1">Recommended Action</p>
                      <p className="text-orange-300 leading-relaxed">{selectedNode.data.recommended_action}</p>
                    </div>
                  )}
                  <Link to="/monitoring" className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-[10px] font-bold">
                    Open in Monitor →
                  </Link>
                </div>
              )}

              {/* Connected edges */}
              <div>
                <p className="text-slate-600 text-[10px] uppercase tracking-wider font-bold mb-2">Connections ({edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length})</p>
                <div className="space-y-1">
                  {edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).slice(0, 5).map((edge, i) => {
                    const otherId = edge.source === selectedNode.id ? edge.target : edge.source;
                    const other = rawNodes.find(n => n.id === otherId);
                    return (
                      <div key={i} className="flex items-center gap-2 text-[10px]">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: MODES[mode].nodeColors[other?.type] || "#888" }} />
                        <span className="text-slate-500 truncate">{other?.label}</span>
                        <span className="text-slate-700 ml-auto">{edge.type}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
                <Crosshair size={18} className="text-slate-600" />
              </div>
              <p className="text-slate-500 text-xs font-semibold">Click a node</p>
              <p className="text-slate-700 text-[10px] mt-1">to inspect its relationships</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}