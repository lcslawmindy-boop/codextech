import { useEffect, useRef, useCallback, useState } from "react";
import * as d3 from "d3";
import ScalarRingOverlay from "./ScalarRingOverlay";

const MODE_CONFIG = {
  analyst: {
    bg: "#0a0f1e",
    linkColor: "#334155",
    linkWidth: 1,
    nodeStroke: "#1e293b",
    glow: false,
    pulse: false,
    rings: false,
  },
  electric: {
    bg: "#020818",
    linkColor: "#164e63",
    linkWidth: 1.5,
    nodeStroke: "#0ea5e9",
    glow: true,
    pulse: true,
    rings: false,
  },
  research: {
    bg: "#0d0520",
    linkColor: "#2e1065",
    linkWidth: 1,
    nodeStroke: "#7c3aed",
    glow: true,
    pulse: false,
    rings: true,
  },
};

const RISK_COLORS = { high: "#ef4444", medium: "#f97316", low: "#22c55e" };

function nodeRadius(d) {
  const base = 6;
  const degBonus = Math.min(d.degree * 2, 14);
  return base + degBonus;
}

export default function GraphCanvas({
  data, visualMode, activeOverlays, pinnedNodes,
  onNodeClick, onNodeHover, onTogglePin, zoom, onZoomChange, nodeTypes
}) {
  const svgRef = useRef(null);
  const simRef = useRef(null);
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: 600 });
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const mode = MODE_CONFIG[visualMode] || MODE_CONFIG.analyst;

  // Resize observer
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ w: Math.floor(width), h: Math.floor(height) });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || data.nodes.length === 0) return;
    buildGraph();
  }, [data, visualMode, activeOverlays, pinnedNodes, dimensions]);

  const buildGraph = useCallback(() => {
    const { w, h } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Background
    svg.append("rect").attr("width", w).attr("height", h).attr("fill", mode.bg);

    // Grid (analyst mode)
    if (visualMode === "analyst") {
      const grid = svg.append("g").attr("class", "grid");
      for (let x = 0; x < w; x += 40) {
        grid.append("line").attr("x1", x).attr("y1", 0).attr("x2", x).attr("y2", h)
          .attr("stroke", "#1e293b").attr("stroke-width", 0.5).attr("opacity", 0.5);
      }
      for (let y = 0; y < h; y += 40) {
        grid.append("line").attr("x1", 0).attr("y1", y).attr("x2", w).attr("y2", y)
          .attr("stroke", "#1e293b").attr("stroke-width", 0.5).attr("opacity", 0.5);
      }
    }

    const defs = svg.append("defs");

    // Glow filter
    if (mode.glow) {
      const filter = defs.append("filter").attr("id", "glow").attr("x", "-50%").attr("y", "-50%")
        .attr("width", "200%").attr("height", "200%");
      filter.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "4").attr("result", "blur");
      const merge = filter.append("feMerge");
      merge.append("feMergeNode").attr("in", "blur");
      merge.append("feMergeNode").attr("in", "SourceGraphic");
    }

    // Arrow markers for links
    defs.append("marker").attr("id", "arrow").attr("viewBox", "0 -5 10 10")
      .attr("refX", 15).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", mode.linkColor);

    // Deep clone nodes/links for simulation
    const simNodes = data.nodes.map(n => ({ ...n, x: Math.random() * w, y: Math.random() * h }));
    const idToNode = Object.fromEntries(simNodes.map(n => [n.id, n]));
    const simLinks = data.links.map(l => ({
      ...l,
      source: idToNode[typeof l.source === "object" ? l.source.id : l.source],
      target: idToNode[typeof l.target === "object" ? l.target.id : l.target],
    })).filter(l => l.source && l.target);

    // Pin nodes that are in pinnedNodes set
    simNodes.forEach(n => {
      if (pinnedNodes.has(n.id)) { n.fx = n.x; n.fy = n.y; }
    });

    // Zoom/pan
    const g = svg.append("g").attr("class", "zoom-group");
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.2, 4])
      .on("zoom", e => {
        g.attr("transform", e.transform);
        onZoomChange(e.transform.k);
      });
    svg.call(zoomBehavior);
    svg.call(zoomBehavior.transform, d3.zoomIdentity.scale(zoom));

    // Force simulation
    if (simRef.current) simRef.current.stop();
    const simulation = d3.forceSimulation(simNodes)
      .force("link", d3.forceLink(simLinks).id(d => d.id).distance(d => 80 + (d.strength || 0.3) * 50).strength(0.4))
      .force("charge", d3.forceManyBody().strength(-200).distanceMax(300))
      .force("center", d3.forceCenter(w / 2, h / 2).strength(0.08))
      .force("collision", d3.forceCollide().radius(d => nodeRadius(d) + 8))
      .alphaDecay(0.02);

    simRef.current = simulation;

    // Draw links
    const linkGroup = g.append("g");
    const linkSel = linkGroup.selectAll("g.link").data(simLinks).join("g").attr("class", "link");

    linkSel.append("line")
      .attr("stroke", l => {
        if (activeOverlays.includes("risk_heatmap") && l.label === "conflicts with") return RISK_COLORS.high;
        if (activeOverlays.includes("patent_family") && l.label === "belongs to") return "#22c55e";
        return mode.linkColor;
      })
      .attr("stroke-width", l => mode.linkWidth)
      .attr("stroke-opacity", 0.6)
      .attr("marker-end", "url(#arrow)");

    linkSel.append("text")
      .attr("font-size", 8)
      .attr("fill", "#475569")
      .attr("text-anchor", "middle")
      .text(l => l.label || "");

    // Draw nodes
    const nodeGroup = g.append("g");
    const nodeSel = nodeGroup.selectAll("g.node").data(simNodes).join("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(d3.drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          if (!pinnedNodes.has(d.id)) { d.fx = null; d.fy = null; }
        })
      )
      .on("click", (event, d) => {
        event.stopPropagation();
        onNodeClick(d);
      })
      .on("mouseenter", (event, d) => {
        setHoveredNodeId(d.id);
        onNodeHover(d);
        d3.select(event.currentTarget).select("circle").attr("stroke-width", 3);
      })
      .on("mouseleave", (event, d) => {
        setHoveredNodeId(null);
        onNodeHover(null);
        d3.select(event.currentTarget).select("circle").attr("stroke-width", 1.5);
      });

    // Overlay: risk heatmap aura
    if (activeOverlays.includes("risk_heatmap")) {
      nodeSel.filter(d => d.risk_level === "high")
        .append("circle")
        .attr("r", d => nodeRadius(d) + 10)
        .attr("fill", "rgba(239,68,68,0.08)")
        .attr("stroke", "rgba(239,68,68,0.25)")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "3,3");
    }

    // Overlay: claim density rings
    if (activeOverlays.includes("claim_density")) {
      nodeSel.filter(d => d.type === "invention" && d.degree > 2)
        .append("circle")
        .attr("r", d => nodeRadius(d) + 6)
        .attr("fill", "none")
        .attr("stroke", "rgba(168,85,247,0.3)")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "2,4");
    }

    // Overlay: competitor clusters
    if (activeOverlays.includes("competitor_cluster")) {
      nodeSel.filter(d => d.type === "competitor")
        .append("circle")
        .attr("r", d => nodeRadius(d) + 14)
        .attr("fill", "rgba(239,68,68,0.05)")
        .attr("stroke", "rgba(249,115,22,0.2)")
        .attr("stroke-width", 1);
    }

    // Node circles
    nodeSel.append("circle")
      .attr("r", d => nodeRadius(d))
      .attr("fill", d => {
        if (activeOverlays.includes("risk_heatmap") && d.risk_level) {
          return RISK_COLORS[d.risk_level] + "cc";
        }
        return d.color + "cc";
      })
      .attr("stroke", d => d.color)
      .attr("stroke-width", 1.5)
      .attr("filter", mode.glow ? "url(#glow)" : null);

    // Pin indicator
    nodeSel.filter(d => pinnedNodes.has(d.id))
      .append("text").attr("text-anchor", "middle").attr("dy", -nodeRadius({ degree: 8 }) - 4)
      .attr("font-size", 10).attr("fill", "#fbbf24").text("📌");

    // Node labels
    nodeSel.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", d => nodeRadius(d) + 12)
      .attr("font-size", 9)
      .attr("fill", "#94a3b8")
      .attr("pointer-events", "none")
      .text(d => d.label.length > 22 ? d.label.slice(0, 20) + "…" : d.label);

    // Tick function
    simulation.on("tick", () => {
      linkSel.select("line")
        .attr("x1", l => l.source.x)
        .attr("y1", l => l.source.y)
        .attr("x2", l => l.target.x)
        .attr("y2", l => l.target.y);

      linkSel.select("text")
        .attr("x", l => (l.source.x + l.target.x) / 2)
        .attr("y", l => (l.source.y + l.target.y) / 2);

      nodeSel.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Electric pulse animation
    if (mode.pulse) {
      let t = 0;
      const pulse = () => {
        t += 0.04;
        nodeSel.select("circle")
          .attr("r", d => nodeRadius(d) + Math.sin(t + d.x * 0.01) * 2);
        requestAnimationFrame(pulse);
      };
      const animFrame = requestAnimationFrame(pulse);
      return () => cancelAnimationFrame(animFrame);
    }
  }, [data, visualMode, activeOverlays, pinnedNodes, dimensions]);

  return (
    <div ref={canvasRef} className="w-full h-full relative overflow-hidden">
      <svg ref={svgRef} width={dimensions.w} height={dimensions.h} className="w-full h-full" />
      {visualMode === "research" && (
        <ScalarRingOverlay width={dimensions.w} height={dimensions.h} />
      )}
    </div>
  );
}