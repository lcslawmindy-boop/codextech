import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { nodes as rawNodes, links as rawLinks, groupColors } from "../lib/beardenData";

// Wrap text into max N chars per line
function wrapLabel(label, maxChars = 14) {
  const words = label.split(' ');
  const lines = [];
  let cur = '';
  words.forEach(w => {
    if ((cur + ' ' + w).trim().length > maxChars) {
      if (cur) lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  });
  if (cur) lines.push(cur.trim());
  return lines.slice(0, 3); // max 3 lines
}

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
      .attr("refX", 38)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#4b5563");

    const g = svg.append("g");

    // Zoom
    svg.call(d3.zoom().scaleExtent([0.2, 4]).on("zoom", (e) => {
      g.attr("transform", e.transform);
    }));

    const nodes = rawNodes.map(d => ({ ...d }));
    const links = rawLinks.map(d => ({ ...d }));

    simRef.current = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(220))
      .force("charge", d3.forceManyBody().strength(-1200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(80));

    // Links
    const link = g.append("g").selectAll("line")
      .data(links).enter().append("line")
      .attr("stroke", "#374151")
      .attr("stroke-width", 1.2)
      .attr("stroke-opacity", 0.5)
      .attr("marker-end", "url(#arrow)");

    // Link labels — only show on hover via opacity, hidden by default
    const linkLabel = g.append("g").selectAll("text")
      .data(links).enter().append("text")
      .attr("font-size", 8)
      .attr("fill", "#6b7280")
      .attr("fill-opacity", 0)
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

    // Glow filter
    const defs = svg.select("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "5").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const NODE_R = 38;

    // Node circles — larger, filled with group color at higher opacity
    node.append("circle")
      .attr("r", NODE_R)
      .attr("fill", d => groupColors[d.group] + "33")
      .attr("stroke", d => groupColors[d.group])
      .attr("stroke-width", d => d.id === selectedNodeId ? 4 : 2)
      .attr("filter", d => d.id === selectedNodeId ? "url(#glow)" : null)
      .on("mouseenter", function(e, d) {
        d3.select(this).attr("fill", groupColors[d.group] + "66").attr("stroke-width", 3);
        // Show adjacent link labels
        linkLabel.attr("fill-opacity", l => (l.source.id === d.id || l.target.id === d.id) ? 1 : 0);
      })
      .on("mouseleave", function(e, d) {
        d3.select(this)
          .attr("fill", groupColors[d.group] + "33")
          .attr("stroke-width", d.id === selectedNodeId ? 4 : 2);
        linkLabel.attr("fill-opacity", 0);
      });

    // Group badge (colored dot + group name)
    node.append("circle")
      .attr("r", 5)
      .attr("cx", NODE_R - 6)
      .attr("cy", -NODE_R + 6)
      .attr("fill", d => groupColors[d.group])
      .attr("pointer-events", "none");

    // Neon glow filter for text
    const textGlow = defs.append("filter").attr("id", "textGlow");
    textGlow.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
    const feMerge2 = textGlow.append("feMerge");
    feMerge2.append("feMergeNode").attr("in", "coloredBlur");
    feMerge2.append("feMergeNode").attr("in", "SourceGraphic");

    // Multi-line node labels — white text with neon color outline/glow
    node.each(function(d) {
      const lines = wrapLabel(d.label, 12);
      const lineH = 15;
      const startY = -(lines.length - 1) * lineH / 2;
      const sel = d3.select(this);
      const color = groupColors[d.group];
      const fontSize = lines.length > 2 ? 11 : 12;

      // Shadow/stroke layer for neon outline effect
      lines.forEach((t, i) => {
        sel.append("text")
          .attr("class", "node-line-shadow")
          .attr("text-anchor", "middle")
          .attr("y", startY + i * lineH)
          .attr("font-size", fontSize)
          .attr("font-weight", "800")
          .attr("fill", "none")
          .attr("stroke", color)
          .attr("stroke-width", 3)
          .attr("stroke-linejoin", "round")
          .attr("filter", "url(#textGlow)")
          .attr("pointer-events", "none")
          .text(t);
      });

      // White fill layer on top
      lines.forEach((t, i) => {
        sel.append("text")
          .attr("class", "node-line")
          .attr("text-anchor", "middle")
          .attr("y", startY + i * lineH)
          .attr("font-size", fontSize)
          .attr("font-weight", "800")
          .attr("fill", "#ffffff")
          .attr("pointer-events", "none")
          .text(t);
      });
    });

    // Group label below node
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("y", NODE_R + 14)
      .attr("font-size", 9)
      .attr("font-weight", "600")
      .attr("fill", d => groupColors[d.group])
      .attr("fill-opacity", 0.7)
      .attr("pointer-events", "none")
      .text(d => d.group.toUpperCase());

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
      .filter(d => d && d.r === undefined) // only main node circles (not badge dots)
      .attr("stroke-width", d => d.id === selectedNodeId ? 4 : 2)
      .attr("r", d => d.id === selectedNodeId ? 44 : 38);
  }, [selectedNodeId]);

  return <svg ref={svgRef} className="w-full h-full" />;
}