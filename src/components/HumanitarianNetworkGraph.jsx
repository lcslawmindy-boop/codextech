import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { NODE_TYPE_META } from "@/lib/humanitarianGraph";

export default function HumanitarianNetworkGraph({ nodes, links, onNodeClick, activeProblem }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!nodes.length || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 600;
    const g = svg.append("g");

    svg.call(d3.zoom().scaleExtent([0.15, 6]).on("zoom", (e) => g.attr("transform", e.transform)));

    const dimmed = (d) => activeProblem && d.type !== "problem" && d.id !== activeProblem &&
      !links.some((l) => (l.source === activeProblem && l.target === d.id) || (l.target === activeProblem && l.source === d.id));

    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance((l) => (l.kind === "solves" ? 90 : 55)).strength(0.35))
      .force("charge", d3.forceManyBody().strength(-220))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d) => (NODE_TYPE_META[d.type]?.radius || 6) + 6));

    // Links
    g.append("g").selectAll("line").data(links).join("line")
      .attr("stroke", (l) => (l.kind === "solves" ? "#22c55e" : "#a855f7"))
      .attr("stroke-opacity", 0.35)
      .attr("stroke-width", (l) => (l.kind === "solves" ? 1.4 : 1))
      .attr("stroke-dasharray", (l) => (l.kind === "solves" ? "4 3" : "none"));

    // Nodes
    const nodeG = g.append("g").selectAll("g").data(nodes).join("g")
      .call(d3.drag()
        .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on("end", (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

    nodeG.append("circle")
      .attr("r", (d) => NODE_TYPE_META[d.type]?.radius || 6)
      .attr("fill", (d) => d.color)
      .attr("stroke", "#0a0e17").attr("stroke-width", 1.5)
      .attr("opacity", (d) => (dimmed(d) ? 0.2 : 1))
      .style("cursor", "pointer")
      .on("mouseover", function (e, d) { d3.select(this).attr("stroke", "#fff").attr("stroke-width", 2.5); })
      .on("mouseout", function (e, d) { d3.select(this).attr("stroke", "#0a0e17").attr("stroke-width", 1.5); });

    nodeG.append("text")
      .text((d) => (d.label || "").slice(0, 30))
      .attr("x", (d) => (NODE_TYPE_META[d.type]?.radius || 6) + 4)
      .attr("y", 4)
      .attr("font-size", (d) => NODE_TYPE_META[d.type]?.fontSize || 7)
      .attr("fill", (d) => NODE_TYPE_META[d.type]?.labelColor || "#888")
      .attr("opacity", (d) => (dimmed(d) ? 0.25 : 1))
      .attr("pointer-events", "none")
      .style("font-weight", (d) => (d.type === "invention" || d.type === "problem" ? 700 : 400));

    nodeG.on("click", (e, d) => { e.stopPropagation(); onNodeClick?.(d); });

    sim.on("tick", () => {
      g.selectAll("line")
        .attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
      nodeG.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => sim.stop();
  }, [nodes, links, onNodeClick, activeProblem]);

  return <svg ref={svgRef} className="w-full h-full" style={{ minHeight: 400 }} />;
}