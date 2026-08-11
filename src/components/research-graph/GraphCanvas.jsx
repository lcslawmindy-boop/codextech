import { useRef, useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import { ZoomIn, ZoomOut, Maximize2, Crosshair, Grid3x3, Eye, EyeOff } from "lucide-react";
import { DOMAINS, CONNECTION_TYPES, getNodeRadius } from "@/lib/researchGraphData";

export default function GraphCanvas({ allNodes, allEdges, filters, selectedNode, onNodeClick, focusNode, graphMode, settings, searchQuery }) {
  const svgRef = useRef(null);
  const simRef = useRef(null);
  const zoomRef = useRef(null);
  const gRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // Filter nodes/edges based on filters
  const { visibleNodes, visibleEdges } = useMemo(() => {
    const nodeMap = new Map();
    allNodes.forEach(n => nodeMap.set(n.numericId, n));

    const visN = allNodes.filter(n => {
      if (filters.domains.length > 0 && !filters.domains.includes(n.domainId)) return false;
      if (filters.evidence.length > 0 && !filters.evidence.includes(n.evidence)) return false;
      if (filters.suppression.length > 0 && !filters.suppression.includes(n.suppressionId)) return false;
      if (filters.targetSystems.length > 0 && !n.targetSystems.some(t => filters.targetSystems.includes(t))) return false;
      if (filters.minConnections > 0 && n.connectionCount < filters.minConnections) return false;
      if (filters.eraMin && n.year < filters.eraMin) return false;
      if (filters.eraMax && n.year > filters.eraMax) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!n.label.toLowerCase().includes(q) && !n.researcher.toLowerCase().includes(q) && !n.tags.some(t => t.toLowerCase().includes(q))) return false;
      }
      return true;
    });

    const visIds = new Set(visN.map(n => n.numericId));
    const visE = allEdges.filter(e => visIds.has(e.source) && visIds.has(e.target));

    // Focus mode: only show focus node + direct connections
    if (focusNode) {
      const focusId = focusNode.numericId;
      const directConnIds = new Set([focusId]);
      visE.forEach(e => {
        if (e.source === focusId) directConnIds.add(e.target);
        if (e.target === focusId) directConnIds.add(e.source);
      });
      const filtered = visN.filter(n => directConnIds.has(n.numericId));
      const filteredIds = new Set(filtered.map(n => n.numericId));
      const filteredEdges = visE.filter(e => filteredIds.has(e.source) && filteredIds.has(e.target));
      return { visibleNodes: filtered, visibleEdges: filteredEdges };
    }

    return { visibleNodes: visN, visibleEdges: visE };
  }, [allNodes, allEdges, filters, focusNode, searchQuery]);

  // D3 simulation
  useEffect(() => {
    if (!svgRef.current || visibleNodes.length === 0) return;
    setLoading(true);
    setLoadProgress(0);

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 600;

    // Clear previous
    svg.selectAll("*").remove();

    const g = svg.append("g").attr("class", "zoom-layer");
    gRef.current = g;

    // Background grid
    if (settings.backgroundGrid) {
      svg.append("defs").append("pattern")
        .attr("id", "grid").attr("width", 40).attr("height", 40)
        .attr("patternUnits", "userSpaceOnUse")
        .append("circle").attr("cx", 1).attr("cy", 1).attr("r", 1).attr("fill", "#21262D");
      svg.insert("rect", ":first-child").attr("width", width).attr("height", height).attr("fill", "url(#grid)");
    }

    const edgeGroup = g.append("g").attr("class", "edges");
    const nodeGroup = g.append("g").attr("class", "nodes");

    // Prepare data copies for D3
    const simNodes = visibleNodes.map(n => ({ ...n }));
    const nodeById = new Map(simNodes.map(n => [n.numericId, n]));
    const simLinks = visibleEdges.map(e => ({
      ...e,
      source: nodeById.get(e.source),
      target: nodeById.get(e.target),
    }));

    // Simulation
    const simulation = d3.forceSimulation(simNodes)
      .force("link", d3.forceLink(simLinks).id(d => d.numericId).distance(d => 40 + (10 - d.strength) * 8).strength(d => d.strength / 20))
      .force("charge", d3.forceManyBody().strength(settings.physicsStrength || -120))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(d => getNodeRadius(d) + 3))
      .alphaDecay(0.05)
      .velocityDecay(0.3);

    simRef.current = simulation;

    // Graph mode forces
    if (graphMode === "domain-clusters") {
      const clusterX = {};
      DOMAINS.forEach((d, i) => {
        const angle = (i / DOMAINS.length) * 2 * Math.PI;
        clusterX[d.id] = { x: width / 2 + Math.cos(angle) * 200, y: height / 2 + Math.sin(angle) * 200 };
      });
      simulation.force("x", d3.forceX(d => clusterX[d.domainId]?.x || width / 2).strength(0.1))
        .force("y", d3.forceY(d => clusterX[d.domainId]?.y || height / 2).strength(0.1));
    } else if (graphMode === "timeline") {
      const xScale = d3.scaleLinear().domain([1850, 2025]).range([80, width - 80]);
      simulation.force("x", d3.forceX(d => xScale(d.year)).strength(0.15))
        .force("y", d3.forceY(height / 2).strength(0.02));
    } else if (graphMode === "evidence-tier") {
      const yScale = d3.scaleLinear().domain([1, 5]).range([height - 80, 80]);
      simulation.force("y", d3.forceY(d => yScale(d.evidence)).strength(0.15))
        .force("x", d3.forceX(width / 2).strength(0.02));
    }

    // Edges
    const edge = edgeGroup.selectAll("line")
      .data(simLinks)
      .enter().append("line")
      .attr("stroke", d => d.typeColor)
      .attr("stroke-width", d => Math.max(0.5, d.strength / 3))
      .attr("stroke-opacity", settings.edgeOpacity || 0.3)
      .attr("pointer-events", "none");

    // Nodes
    const node = nodeGroup.selectAll("g")
      .data(simNodes)
      .enter().append("g")
      .attr("class", "node-group")
      .style("cursor", "pointer")
      .call(d3.drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
      );

    // Node circles
    node.append("circle")
      .attr("r", d => getNodeRadius(d))
      .attr("fill", d => d.domainColor)
      .attr("stroke", d => {
        if (d.suppressionId === "suppressed") return "#EF4444";
        if (d.evidence === 5) return "#10B981";
        return "none";
      })
      .attr("stroke-width", d => (d.suppressionId === "suppressed" || d.evidence === 5) ? 2 : 0)
      .attr("opacity", 0.85);

    // Mega hub pulse animation
    node.filter(d => d.connectionCount >= 60)
      .append("circle")
      .attr("r", d => getNodeRadius(d) + 4)
      .attr("fill", "none")
      .attr("stroke", d => d.domainColor)
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.3)
      .style("animation", "zarp-pulse 3s ease-in-out infinite");

    // Labels
    if (settings.showLabels) {
      node.append("text")
        .text(d => d.label.length > 25 ? d.label.substring(0, 23) + "…" : d.label)
        .attr("x", 0).attr("y", d => getNodeRadius(d) + 10)
        .attr("text-anchor", "middle")
        .attr("fill", "#F0F6FF")
        .attr("font-size", "8px")
        .attr("font-family", "Inter, sans-serif")
        .attr("opacity", 0.7)
        .attr("pointer-events", "none");
    }

    // Hover events
    node.on("mouseenter", function(event, d) {
      setHoveredNode(d);
      const rect = svgRef.current.getBoundingClientRect();
      setTooltip({ node: d, x: event.clientX - rect.left, y: event.clientY - rect.top });
      // Highlight connected
      const connectedIds = new Set([d.numericId]);
      simLinks.forEach(l => {
        if (l.source.numericId === d.numericId) connectedIds.add(l.target.numericId);
        if (l.target.numericId === d.numericId) connectedIds.add(l.source.numericId);
      });
      nodeGroup.selectAll("g").style("opacity", n => connectedIds.has(n.numericId) ? 1 : 0.15);
      edgeGroup.selectAll("line").style("opacity", e =>
        (e.source.numericId === d.numericId || e.target.numericId === d.numericId) ? 1 : 0.03
      );
      d3.select(this).select("circle").attr("r", getNodeRadius(d) * 1.3);
    })
    .on("mousemove", function(event) {
      const rect = svgRef.current.getBoundingClientRect();
      setTooltip(t => ({ ...t, x: event.clientX - rect.left, y: event.clientY - rect.top }));
    })
    .on("mouseleave", function(event, d) {
      setHoveredNode(null);
      setTooltip(null);
      nodeGroup.selectAll("g").style("opacity", 1);
      edgeGroup.selectAll("line").style("opacity", settings.edgeOpacity || 0.3);
      d3.select(this).select("circle").attr("r", getNodeRadius(d));
    })
    .on("click", function(event, d) {
      event.stopPropagation();
      onNodeClick(d);
    })
    .on("dblclick", function(event, d) {
      event.stopPropagation();
      onNodeClick(d, true);
    });

    // Tick
    let tickCount = 0;
    simulation.on("tick", () => {
      tickCount++;
      edge
        .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      node.attr("transform", d => `translate(${d.x},${d.y})`);
      if (tickCount % 20 === 0) setLoadProgress(Math.min(100, Math.round((1 - simulation.alpha()) * 100)));
    });

    simulation.on("end", () => setLoading(false));

    // Zoom
    const zoom = d3.zoom().scaleExtent([0.05, 8]).on("zoom", (event) => {
      g.attr("transform", event.transform);
      setZoomLevel(event.transform.k);
    });
    zoomRef.current = zoom;
    svg.call(zoom);

    // Click empty canvas to deselect
    svg.on("click", () => {
      onNodeClick(null);
    });

    // Progressive loading
    setTimeout(() => setLoading(false), 2000);

    return () => {
      simulation.stop();
      svg.selectAll("*").remove();
    };
  }, [visibleNodes, visibleEdges, graphMode, settings.showLabels, settings.edgeOpacity, settings.physicsStrength, settings.backgroundGrid]);

  // Update selected node ring
  useEffect(() => {
    if (!gRef.current || !simRef.current) return;
    const nodeGroup = gRef.current.select(".nodes");
    nodeGroup.selectAll("circle:first-child")
      .attr("stroke", d => {
        if (selectedNode && d.numericId === selectedNode.numericId) return "#C9A84C";
        if (d.suppressionId === "suppressed") return "#EF4444";
        if (d.evidence === 5) return "#10B981";
        return "none";
      })
      .attr("stroke-width", d => {
        if (selectedNode && d.numericId === selectedNode.numericId) return 3;
        if (d.suppressionId === "suppressed" || d.evidence === 5) return 2;
        return 0;
      });
  }, [selectedNode]);

  const handleZoomIn = () => {
    if (zoomRef.current && svgRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.5);
    }
  };
  const handleZoomOut = () => {
    if (zoomRef.current && svgRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.67);
    }
  };
  const handleFitAll = () => {
    if (zoomRef.current && svgRef.current && gRef.current) {
      const bounds = gRef.current.node().getBBox();
      const width = svgRef.current.clientWidth;
      const height = svgRef.current.clientHeight;
      const scale = Math.min(width / (bounds.width + 100), height / (bounds.height + 100));
      const transform = d3.zoomIdentity.translate(width / 2 - (bounds.x + bounds.width / 2) * scale, height / 2 - (bounds.y + bounds.height / 2) * scale).scale(scale);
      d3.select(svgRef.current).transition().duration(500).call(zoomRef.current.transform, transform);
    }
  };
  const handleCenter = () => {
    if (zoomRef.current && svgRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  const modeLabel = focusNode ? `FOCUS: ${focusNode.label}` :
    (filters.domains.length > 0 || filters.evidence.length > 0 || filters.suppression.length > 0) ?
    `FILTERED — ${visibleNodes.length} nodes · ${visibleEdges.length} edges` :
    `FULL GRAPH — ${visibleNodes.length} nodes · ${visibleEdges.length} edges`;

  return (
    <div className="relative w-full h-full bg-[#030712] overflow-hidden">
      <style>{`
        @keyframes zarp-pulse { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.15); opacity: 0.1; } }
      `}</style>
      <svg ref={svgRef} className="w-full h-full" style={{ cursor: "grab" }} />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#030712]/80 z-30">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-[#C9A84C] text-sm font-bold" style={{ fontFamily: "Orbitron, sans-serif" }}>Loading research nodes...</p>
            <p className="text-[#8B9AB0] text-xs mt-1">{loadProgress}%</p>
          </div>
        </div>
      )}

      {/* Mode indicator */}
      <div className="absolute top-3 left-3 z-10">
        <div className="px-3 py-1.5 rounded-lg bg-[#0D1117] border border-[#21262D] text-[10px] font-mono">
          <span className="text-[#C9A84C]">{modeLabel}</span>
        </div>
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-3 right-3 z-10">
        <div className="px-2.5 py-1.5 rounded-lg bg-[#0D1117] border border-[#21262D] text-[10px] font-mono text-[#8B9AB0]">
          {Math.round(zoomLevel * 100)}%
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && tooltip.node && (
        <div
          className="absolute z-20 pointer-events-none max-w-[280px]"
          style={{ left: Math.min(tooltip.x + 15, (svgRef.current?.clientWidth || 800) - 290), top: Math.min(tooltip.y + 15, (svgRef.current?.clientHeight || 600) - 200) }}
        >
          <div className="bg-[#0D1117] border border-[#21262D] rounded-lg overflow-hidden shadow-2xl">
            <div className="h-1" style={{ backgroundColor: tooltip.node.domainColor }} />
            <div className="p-3">
              <p className="text-[#F0F6FF] text-xs font-bold leading-tight">{tooltip.node.label}</p>
              <p className="text-[#8B9AB0] text-[10px] mt-0.5">{tooltip.node.researcher} — {tooltip.node.year}</p>
              <div className="flex items-center gap-2 mt-2 text-[9px]">
                <span className="text-[#8B9AB0]">🔗 {tooltip.node.connectionCount}</span>
                <span style={{ color: tooltip.node.suppressionColor }}>{tooltip.node.suppression}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {tooltip.node.tags.slice(0, 4).map(t => (
                  <span key={t} className="px-1.5 py-0.5 rounded bg-[#161B22] text-[#8B9AB0] text-[8px]">{t}</span>
                ))}
              </div>
              <p className="text-[#C9A84C] text-[9px] mt-2">Click to explore full record</p>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      {settings.showLegend && (
        <div className="absolute bottom-3 left-3 z-10 max-w-[280px]">
          <div className="bg-[#0D1117]/95 border border-[#21262D] rounded-lg p-3 backdrop-blur">
            <p className="text-[#8B9AB0] text-[9px] font-bold uppercase tracking-wider mb-2">Node Size = Connections</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {DOMAINS.map(d => (
                <div key={d.id} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-[#8B9AB0] text-[8px] truncate">{d.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-[#21262D]">
              <div className="flex items-center gap-3 text-[8px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border-2 border-[#EF4444]" /> Suppressed</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border-2 border-[#10B981]" /> Peer-Reviewed</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border-2 border-[#C9A84C]" /> Selected</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1">
        <button onClick={handleZoomIn} className="w-9 h-9 rounded-lg bg-[#0D1117] border border-[#21262D] flex items-center justify-center text-[#8B9AB0] hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors" title="Zoom In"><ZoomIn size={16} /></button>
        <button onClick={handleZoomOut} className="w-9 h-9 rounded-lg bg-[#0D1117] border border-[#21262D] flex items-center justify-center text-[#8B9AB0] hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors" title="Zoom Out"><ZoomOut size={16} /></button>
        <button onClick={handleFitAll} className="w-9 h-9 rounded-lg bg-[#0D1117] border border-[#21262D] flex items-center justify-center text-[#8B9AB0] hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors" title="Fit All"><Maximize2 size={16} /></button>
        <button onClick={handleCenter} className="w-9 h-9 rounded-lg bg-[#0D1117] border border-[#21262D] flex items-center justify-center text-[#8B9AB0] hover:text-[#C9A84C] hover:border-[#C9A84C]/50 transition-colors" title="Center"><Crosshair size={16} /></button>
      </div>
    </div>
  );
}