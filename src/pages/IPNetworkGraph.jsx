import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Info, Filter, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function IPNetworkGraph() {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, invention, prior-art, threat
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    loadNetworkData();
  }, []);

  const loadNetworkData = async () => {
    try {
      const [inventions, priorArt, alerts] = await Promise.all([
        base44.entities.HybridInvention.list(),
        base44.entities.PriorArtEntry.list(),
        base44.entities.MonitoringAlert.list()
      ]);

      const invNodes = (inventions || []).map((inv, i) => ({
        id: `inv_${i}`,
        label: inv.hybrid_concept?.slice(0, 30),
        type: "invention",
        data: inv,
        x: Math.random() * 400,
        y: Math.random() * 400
      }));

      const artNodes = (priorArt || []).slice(0, 15).map((art, i) => ({
        id: `art_${i}`,
        label: art.title?.slice(0, 25),
        type: "prior-art",
        data: art,
        x: Math.random() * 400,
        y: Math.random() * 400
      }));

      const threatNodes = (alerts || []).filter(a => a.risk_level === "critical" || a.risk_level === "high").slice(0, 10).map((threat, i) => ({
        id: `threat_${i}`,
        label: threat.title?.slice(0, 25),
        type: "threat",
        data: threat,
        x: Math.random() * 400,
        y: Math.random() * 400
      }));

      const allNodes = [...invNodes, ...artNodes, ...threatNodes];
      setNodes(allNodes);

      // Create edges (relationships)
      const graphEdges = [];
      invNodes.forEach((inv, i) => {
        if (i < artNodes.length) {
          graphEdges.push({ source: inv.id, target: artNodes[i].id, label: "related" });
        }
        if (i < threatNodes.length) {
          graphEdges.push({ source: inv.id, target: threatNodes[i].id, label: "competes" });
        }
      });
      setEdges(graphEdges);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Simple force-directed layout simulation
  useEffect(() => {
    if (nodes.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Simulate forces
    let velocities = nodes.map(() => ({ vx: 0, vy: 0 }));
    let positions = nodes.map(n => ({ x: n.x, y: n.y }));

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, width, height);

      // Apply forces
      for (let i = 0; i < positions.length; i++) {
        let fx = 0, fy = 0;

        // Repulsion
        for (let j = 0; j < positions.length; j++) {
          if (i !== j) {
            const dx = positions[i].x - positions[j].x;
            const dy = positions[i].y - positions[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 100 / (dist * dist);
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
          }
        }

        // Attraction (edges)
        edges.forEach(edge => {
          if (edge.source === nodes[i].id) {
            const target = nodes.findIndex(n => n.id === edge.target);
            if (target !== -1) {
              const dx = positions[target].x - positions[i].x;
              const dy = positions[target].y - positions[i].y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              fx += (dx / dist) * 0.05;
              fy += (dy / dist) * 0.05;
            }
          }
        });

        // Bounds
        if (positions[i].x < 20) fx += 2;
        if (positions[i].x > width - 20) fx -= 2;
        if (positions[i].y < 20) fy += 2;
        if (positions[i].y > height - 20) fy -= 2;

        velocities[i].vx = (velocities[i].vx + fx) * 0.95;
        velocities[i].vy = (velocities[i].vy + fy) * 0.95;
        positions[i].x += velocities[i].vx;
        positions[i].y += velocities[i].vy;
      }

      // Draw edges
      ctx.strokeStyle = "rgba(100, 116, 139, 0.2)";
      ctx.lineWidth = 1;
      edges.forEach(edge => {
        const s = nodes.findIndex(n => n.id === edge.source);
        const t = nodes.findIndex(n => n.id === edge.target);
        if (s !== -1 && t !== -1) {
          ctx.beginPath();
          ctx.moveTo(positions[s].x, positions[s].y);
          ctx.lineTo(positions[t].x, positions[t].y);
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        const radius = 8;
        const color = node.type === "invention" ? "#06b6d4" : node.type === "threat" ? "#f97316" : "#a855f7";
        ctx.fillStyle = selectedNode?.id === node.id ? "#fbbf24" : color;
        ctx.beginPath();
        ctx.arc(positions[i].x, positions[i].y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(node.label?.slice(0, 12), positions[i].x, positions[i].y + radius + 12);
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [nodes, edges, selectedNode]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    nodes.forEach(node => {
      if (Math.hypot(node.x - x, node.y - y) < 20) {
        setSelectedNode(node);
      }
    });
  };

  const filteredNodes = filterType === "all" ? nodes : nodes.filter(n => n.type === filterType);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/ai-os" className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-slate-700" />
          <div>
            <h1 className="text-white font-black text-lg tracking-tight flex items-center gap-2">
              <Zap size={18} className="text-cyan-400" /> IP Network Graph
            </h1>
            <p className="text-slate-400 text-xs">Inventions · Prior Art · Competitive Threats</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="border-b border-slate-800 bg-slate-950/40 px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search nodes..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-slate-400" />
          {[
            { id: "all", label: "All" },
            { id: "invention", label: "🧬 Inventions" },
            { id: "prior-art", label: "📜 Prior Art" },
            { id: "threat", label: "⚠️ Threats" }
          ].map(f => (
            <button key={f.id} onClick={() => setFilterType(f.id)}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                filterType === f.id
                  ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-300"
                  : "bg-slate-800/40 border border-slate-700 text-slate-400"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500">{filteredNodes.length} nodes</span>
      </div>

      {/* Canvas & Detail Panel */}
      <div className="flex-1 flex gap-4 p-6">
        {/* Canvas */}
        <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-lg overflow-hidden relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
              Loading network...
            </div>
          ) : (
            <canvas ref={canvasRef} width={800} height={600} onClick={handleCanvasClick}
              className="w-full h-full cursor-pointer" />
          )}
          <div className="absolute top-4 left-4 text-xs text-slate-500 flex items-center gap-1">
            <Info size={12} /> Click nodes to inspect
          </div>
        </div>

        {/* Detail Panel */}
        {selectedNode ? (
          <div className="w-80 bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex flex-col gap-3 max-h-96 overflow-y-auto">
            <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-200 text-sm ml-auto">✕</button>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">{selectedNode.type}</p>
              <h3 className="text-white font-black text-sm">{selectedNode.label}</h3>
            </div>
            {selectedNode.type === "invention" && (
              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-slate-500 font-bold">Concept</p>
                  <p className="text-slate-300 text-xs">{selectedNode.data.hybrid_concept}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold">IP Valuation</p>
                  <p className="text-green-400 font-bold">${selectedNode.data.ip_value_low}M–${selectedNode.data.ip_value_high}M</p>
                </div>
              </div>
            )}
            {selectedNode.type === "prior-art" && (
              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-slate-500 font-bold">Inventor</p>
                  <p className="text-slate-300">{selectedNode.data.inventor}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold">Year</p>
                  <p className="text-slate-300">{selectedNode.data.year}</p>
                </div>
              </div>
            )}
            {selectedNode.type === "threat" && (
              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-slate-500 font-bold">Risk Level</p>
                  <p className={`font-bold ${selectedNode.data.risk_level === "critical" ? "text-red-400" : "text-orange-400"}`}>
                    {selectedNode.data.risk_level?.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold">Source</p>
                  <p className="text-slate-300">{selectedNode.data.source_type}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-80 bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex items-center justify-center text-slate-500 text-sm">
            Click a node to view details
          </div>
        )}
      </div>
    </div>
  );
}