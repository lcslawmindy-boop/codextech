import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { nodes as rawNodes, links as rawLinks, groupColors } from "../lib/beardenData";

export default function ConceptNetworkGraph({ onNodeClick, selectedNodeId }) {
  const svgRef = useRef(null);
  const simRef = useRef(null);

  useEffect(() => {
    const container = svgRef.current.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    // Arrow marker
    svg.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 28)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#4b5563");

    const g = svg.append("g");

    // Zoom
    svg.call(d3.zoom().scaleExtent([0.3, 3]).on("zoom", (e) => {
      g.attr("transform", e.transform);
    }));

    const nodes = rawNodes.map(d => ({ ...d }));
    const links = rawLinks.map(d => ({ ...d }));

    simRef.current = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(160))
      .force("charge", d3.forceManyBody().strength(-600))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(55));

    // Links
    const link = g.append("g").selectAll("line")
      .data(links).enter().append("line")
      .attr("stroke", "#374151")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)");

    // Link labels
    const linkLabel = g.append("g").selectAll("text")
      .data(links).enter().append("text")
      .attr("font-size", 9)
      .attr("fill", "#6b7280")
      .attr("text-anchor", "middle")
      .text(d => d.label);

    // Node groups
    const node = g.append("g").selectAll("g")
      .data(nodes).enter().append("g")
      .style("cursor", "pointer")
      .call(d3.drag()
        .on("start", (e, d) => {
          if (!e.active) simRef.current.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on("end", (e, d) => {
          if (!e.active) simRef.current.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
      )
      .on("click", (e, d) => { e.stopPropagation(); onNodeClick(d); });

    // Node circles
    node.append("circle")
      .attr("r", 26)
      .attr("fill", d => groupColors[d.group] + "22")
      .attr("stroke", d => groupColors[d.group])
      .attr("stroke-width", d => d.id === selectedNodeId ? 3 : 1.5)
      .attr("filter", d => d.id === selectedNodeId ? "url(#glow)" : null);

    // Glow filter
    const defs = svg.select("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Node labels
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", 11)
      .attr("font-weight", "600")
      .attr("fill", d => groupColors[d.group])
      .attr("pointer-events", "none")
      .text(d => {
        const words = d.label.split(" ");
        return words.length > 2 ? words[0] + "…" : d.label;
      });

    // Subtitle below circle
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "38")
      .attr("font-size", 10)
      .attr("fill", "#9ca3af")
      .attr("pointer-events", "none")
      .text(d => d.label.length > 12 ? d.label.substring(0, 12) + "…" : d.label);

    simRef.current.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      linkLabel
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => { simRef.current?.stop(); };
  }, []);

  // Update selected node highlight
  useEffect(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).selectAll("circle")
      .attr("stroke-width", d => d.id === selectedNodeId ? 3.5 : 1.5)
      .attr("r", d => d.id === selectedNodeId ? 30 : 26);
  }, [selectedNodeId]);

  return <svg ref={svgRef} className="w-full h-full" />;
}