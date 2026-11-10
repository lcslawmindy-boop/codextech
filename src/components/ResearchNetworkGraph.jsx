import { useEffect, useRef } from "react";
import * as d3 from "d3";

const TYPE_CONFIG = {
  research: { radius: 5, fontSize: 7, color: "#06b6d4", labelColor: "#88a" },
  invention: { radius: 11, fontSize: 9, color: "#a855f7", labelColor: "#ddd" },
  prior_art: { radius: 7, fontSize: 8, color: "#f97316", labelColor: "#aaa" },
  patent: { radius: 9, fontSize: 8, color: "#22c55e", labelColor: "#aaa" },
  project: { radius: 13, fontSize: 10, color: "#fbbf24", labelColor: "#ddd" },
};

export default function ResearchNetworkGraph({ nodes, links, onNodeClick }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!nodes.length || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 600;
    const g = svg.append("g");

    svg.call(d3.zoom().scaleExtent([0.15, 6]).on("zoom", (e) => g.attr("transform", e.transform)));

    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).distance(70).strength(0.25))
      .force("charge", d3.forceManyBody().strength(-180))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d) => (TYPE_CONFIG[d.type]?.radius || 6) + 4));

    g.append("g").selectAll("line").data(links).join("line")
      .attr("stroke", "#ffffff").attr("stroke-opacity", 0.12).attr("stroke-width", 1);

    const nodeG = g.append("g").selectAll("g").data(nodes).join("g")
      .call(d3.drag()
        .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on("end", (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

    nodeG.append("circle")
      .attr("r", (d) => TYPE_CONFIG[d.type]?.radius || 6)
      .attr("fill", (d) => d.color || TYPE_CONFIG[d.type]?.color || "#666")
      .attr("stroke", "#0a0e17").attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("mouseover", function (e, d) {
        d3.select(this).attr("stroke", "#fff").attr("stroke-width", 2.5);
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", "#0a0e17").attr("stroke-width", 1.5);
      });

    nodeG.append("text")
      .text((d) => (d.label || "").slice(0, 28))
      .attr("x", (d) => (TYPE_CONFIG[d.type]?.radius || 6) + 4)
      .attr("y", 4)
      .attr("font-size", (d) => TYPE_CONFIG[d.type]?.fontSize || 7)
      .attr("fill", (d) => TYPE_CONFIG[d.type]?.labelColor || "#888")
      .attr("pointer-events", "none")
      .style("font-weight", (d) => (d.type === "invention" || d.type === "project" ? 700 : 400));

    nodeG.on("click", (e, d) => { e.stopPropagation(); onNodeClick?.(d); });

    sim.on("tick", () => {
      g.selectAll("line")
        .attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
      nodeG.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => sim.stop();
  }, [nodes, links, onNodeClick]);

  return <svg ref={svgRef} className="w-full h-full" style={{ minHeight: 400 }} />;
}