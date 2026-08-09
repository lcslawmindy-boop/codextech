import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { nodes as rawNodes, links as rawLinks, groupColors } from "../lib/beardenData";

// ── Night Vision tactical palette ──
const NV = {
  bg: "#020402",
  node: "#00ff41",        // phosphor green
  nodeDim: "#0a8a2a",
  link: "#00ff41",
  linkOpacity: 0.18,
  label: "#7dff8a",
  labelDim: "#3a8a4a",
  grid: "#0a3a1a",
  reticle: "#00ff41",
};

function wrapLabel(label, maxChars = 13) {
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
  return lines.slice(0, 2);
}

function getNodeDegrees(nodes, links) {
  const deg = {};
  nodes.forEach(n => { deg[n.id] = 0; });
  links.forEach(l => {
    const src = typeof l.source === 'object' ? l.source.id : l.source;
    const tgt = typeof l.target === 'object' ? l.target.id : l.target;
    if (deg[src] !== undefined) deg[src]++;
    if (deg[tgt] !== undefined) deg[tgt]++;
  });
  return deg;
}

export default function ConceptNetworkGraph({ onNodeClick, selectedNodeId, graphMode = "nightvision", onLinkClick }) {
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

    const defs = svg.append("defs");
    // Subtle phosphor glow
    const glow = defs.append("filter").attr("id", "nv-glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    glow.append("feGaussianBlur").attr("stdDeviation", "1.5").attr("result", "b");
    const fm = glow.append("feMerge");
    fm.append("feMergeNode").attr("in", "b");
    fm.append("feMergeNode").attr("in", "SourceGraphic");

    // Scan-line pattern
    const pattern = defs.append("pattern").attr("id", "scanlines").attr("width", 4).attr("height", 4).attr("patternUnits", "userSpaceOnUse");
    pattern.append("rect").attr("width", 4).attr("height", 4).attr("fill", "transparent");
    pattern.append("line").attr("x1", 0).attr("y1", 0).attr("x2", 4).attr("y2", 0).attr("stroke", NV.grid).attr("stroke-width", 0.5).attr("opacity", 0.3);

    // Background grid + scanlines
    svg.append("rect").attr("width", width).attr("height", height).attr("fill", NV.bg);
    svg.append("rect").attr("width", width).attr("height", height).attr("fill", "url(#scanlines)");

    // Tactical reticle (center crosshair)
    const reticle = svg.append("g").attr("opacity", 0.08);
    reticle.append("line").attr("x1", 0).attr("y1", height/2).attr("x2", width).attr("y2", height/2).attr("stroke", NV.reticle).attr("stroke-width", 0.5);
    reticle.append("line").attr("x1", width/2).attr("y1", 0).attr("x2", width/2).attr("y2", height).attr("stroke", NV.reticle).attr("stroke-width", 0.5);
    reticle.append("circle").attr("cx", width/2).attr("cy", height/2).attr("r", 60).attr("fill", "none").attr("stroke", NV.reticle).attr("stroke-width", 0.5).attr("stroke-dasharray", "4 4");
    reticle.append("circle").attr("cx", width/2).attr("cy", height/2).attr("r", 180).attr("fill", "none").attr("stroke", NV.reticle).attr("stroke-width", 0.5).attr("stroke-dasharray", "2 6");

    const g = svg.append("g");
    svg.call(d3.zoom().scaleExtent([0.15, 5]).on("zoom", e => g.attr("transform", e.transform)));

    const nodes = rawNodes.map(d => ({ ...d }));
    const links = rawLinks.map(d => ({ ...d }));
    const degrees = getNodeDegrees(nodes, links);

    const minR = 8, maxR = 18;
    const maxDeg = Math.max(...Object.values(degrees));
    const nodeRadius = d => minR + ((degrees[d.id] || 0) / maxDeg) * (maxR - minR);

    simRef.current = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(d => {
        const srcDeg = degrees[typeof d.source === 'object' ? d.source.id : d.source] || 0;
        const tgtDeg = degrees[typeof d.target === 'object' ? d.target.id : d.target] || 0;
        return 120 + (srcDeg + tgtDeg) * 4;
      }))
      .force("charge", d3.forceManyBody().strength(d => -350 - (degrees[d.id] || 0) * 12))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(d => nodeRadius(d) + 10));

    // Links — thin phosphor lines, minimal
    const link = g.append("g").selectAll("line")
      .data(links).enter().append("line")
      .attr("stroke", NV.link)
      .attr("stroke-width", 0.6)
      .attr("stroke-opacity", NV.linkOpacity)
      .attr("pointer-events", "none");

    // Link labels — monospace, dim, only on hover
    const linkLabel = g.append("g").selectAll("text")
      .data(links).enter().append("text")
      .attr("font-family", "monospace")
      .attr("font-size", 8)
      .attr("fill", NV.labelDim)
      .attr("text-anchor", "middle")
      .attr("opacity", 0)
      .attr("pointer-events", "none")
      .style("letter-spacing", "0.05em")
      .text(d => d.label);

    // Nodes
    const node = g.append("g").selectAll("g.node")
      .data(nodes).enter().append("g")
      .attr("class", "node")
      .style("cursor", "crosshair")
      .call(d3.drag()
        .on("start", (e, d) => { if (!e.active) simRef.current.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on("end", (e, d) => { if (!e.active) simRef.current.alphaTarget(0); d.fx = null; d.fy = null; })
      )
      .on("click", (e, d) => { e.stopPropagation(); onNodeClick(d); });

    // Node ring (tactical bracket)
    node.append("circle")
      .attr("class", "ring")
      .attr("r", d => nodeRadius(d) + 3)
      .attr("fill", "none")
      .attr("stroke", NV.node)
      .attr("stroke-width", 0.8)
      .attr("stroke-opacity", 0.4)
      .attr("pointer-events", "none");

    // Node body — phosphor green, intensity by degree
    node.append("circle")
      .attr("class", "body")
      .attr("r", d => nodeRadius(d))
      .attr("fill", d => {
        const deg = degrees[d.id] || 0;
        const intensity = 0.25 + (deg / maxDeg) * 0.5;
        return `rgba(0,255,65,${intensity})`;
      })
      .attr("stroke", NV.node)
      .attr("stroke-width", 1)
      .attr("pointer-events", "none");

    // Node labels — monospace, phosphor
    node.each(function(d) {
      const lines = wrapLabel(d.label, 12);
      const lineH = 10;
      const startY = nodeRadius(d) + 10;
      const sel = d3.select(this);
      lines.forEach((t, i) => {
        sel.append("text")
          .attr("text-anchor", "middle")
          .attr("y", startY + i * lineH)
          .attr("font-family", "monospace")
          .attr("font-size", 8)
          .attr("font-weight", "700")
          .attr("fill", NV.label)
          .attr("opacity", 0.5)
          .attr("pointer-events", "none")
          .style("letter-spacing", "0.03em")
          .text(t.toUpperCase());
      });
    });

    // Hover behavior — highlight connected links/nodes, show link labels
    node.append("circle")
      .attr("class", "hit")
      .attr("r", d => nodeRadius(d) + 4)
      .attr("fill", "transparent")
      .on("mouseenter", function(e, d) {
        const nodeG = d3.select(this.parentNode);
        nodeG.select(".ring").attr("stroke-opacity", 1).attr("stroke-width", 1.5);
        nodeG.select(".body").attr("stroke-width", 2);
        link.attr("stroke-opacity", l => {
          const s = typeof l.source === 'object' ? l.source.id : l.source;
          const t2 = typeof l.target === 'object' ? l.target.id : l.target;
          return (s === d.id || t2 === d.id) ? 0.7 : 0.05;
        }).attr("stroke-width", l => {
          const s = typeof l.source === 'object' ? l.source.id : l.source;
          const t2 = typeof l.target === 'object' ? l.target.id : l.target;
          return (s === d.id || t2 === d.id) ? 1.2 : 0.6;
        });
        linkLabel.attr("opacity", l => {
          const s = typeof l.source === 'object' ? l.source.id : l.source;
          const t2 = typeof l.target === 'object' ? l.target.id : l.target;
          return (s === d.id || t2 === d.id) ? 0.9 : 0;
        }).attr("x", l => (l.source.x + l.target.x) / 2).attr("y", l => (l.source.y + l.target.y) / 2 - 4);
      })
      .on("mouseleave", function(e, d) {
        const nodeG = d3.select(this.parentNode);
        const sel = d.id === selectedNodeId;
        nodeG.select(".ring").attr("stroke-opacity", sel ? 1 : 0.4).attr("stroke-width", sel ? 1.5 : 0.8);
        nodeG.select(".body").attr("stroke-width", sel ? 2 : 1);
        link.attr("stroke-opacity", NV.linkOpacity).attr("stroke-width", 0.6);
        linkLabel.attr("opacity", 0);
      });

    // Tick
    simRef.current.on("tick", () => {
      link.attr("x1", d => d.source?.x ?? 0).attr("y1", d => d.source?.y ?? 0)
          .attr("x2", d => d.target?.x ?? 0).attr("y2", d => d.target?.y ?? 0);
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => { simRef.current?.stop(); };
  }, [graphMode]);

  // Selected node highlight
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("g.node").each(function(d) {
      if (!d) return;
      const isSelected = d.id === selectedNodeId;
      const grp = d3.select(this);
      grp.select(".ring").attr("stroke-opacity", isSelected ? 1 : 0.4).attr("stroke-width", isSelected ? 1.5 : 0.8);
      grp.select(".body").attr("stroke-width", isSelected ? 2 : 1).attr("filter", isSelected ? "url(#nv-glow)" : "url(#nv-glow)");
    });
  }, [selectedNodeId]);

  return <svg ref={svgRef} className="w-full h-full" />;
}