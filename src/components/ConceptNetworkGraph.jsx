import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { nodes as rawNodes, links as rawLinks, groupColors } from "../lib/beardenData";

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
  return lines.slice(0, 3);
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

// Mode configs
const MODES = {
  analyst: {
    bg: "#080d14",
    linkColor: "#ffffff",
    linkOpacity: 1,
    linkWidth: 1.5,
    nodeStrokeWidth: 1,
    showJolts: false,
    showWaves: false,
    showFlashes: false,
    glowBlur: 0,
    label: "ANALYST",
  },
  electric: {
    bg: "#07090f",
    linkColor: "#ffffff",
    linkOpacity: 0.35,
    linkWidth: 1.0,
    nodeStrokeWidth: 1.5,
    showJolts: true,
    showWaves: false,
    showFlashes: false,
    glowBlur: 5,
    label: "ELECTRIC",
  },
  research: {
    bg: "#060b0f",
    linkColor: "#94a3b8",
    linkOpacity: 0.4,
    linkWidth: 1.0,
    nodeStrokeWidth: 1.5,
    showJolts: false,
    showWaves: true,
    showFlashes: false,
    glowBlur: 4,
    label: "RESEARCH",
  },
};

export default function ConceptNetworkGraph({ onNodeClick, selectedNodeId, graphMode = "analyst" }) {
  const svgRef = useRef(null);
  const simRef = useRef(null);

  useEffect(() => {
    const mode = MODES[graphMode] || MODES.analyst;
    const container = svgRef.current.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const defs = svg.append("defs");

    // ── Radial gradients per group ──
    Object.entries(groupColors).forEach(([group, color]) => {
      const grad = defs.append("radialGradient")
        .attr("id", `grad-${group}`)
        .attr("cx", "35%").attr("cy", "35%").attr("r", "65%");
      grad.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 0.55);
      grad.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0.08);
    });



    // ── Glow filters ──
    const makeGlow = (id, blur, color) => {
      const f = defs.append("filter").attr("id", id).attr("x", "-60%").attr("y", "-60%").attr("width", "220%").attr("height", "220%");
      f.append("feColorMatrix").attr("type", "matrix")
        .attr("values", `0 0 0 0 ${parseInt(color.slice(1,3),16)/255} 0 0 0 0 ${parseInt(color.slice(3,5),16)/255} 0 0 0 0 ${parseInt(color.slice(5,7),16)/255} 0 0 0 1 0`)
        .attr("result", "colorOut");
      f.append("feGaussianBlur").attr("in", "colorOut").attr("stdDeviation", blur).attr("result", "blurred");
      const fm = f.append("feMerge");
      fm.append("feMergeNode").attr("in", "blurred");
      fm.append("feMergeNode").attr("in", "SourceGraphic");
    };

    makeGlow("glow-blue", mode.glowBlur, "#3b82f6");
    makeGlow("glow-green", mode.glowBlur, "#22c55e");
    makeGlow("glow-red", mode.glowBlur, "#ef4444");
    makeGlow("glow-purple", mode.glowBlur, "#a855f7");
    makeGlow("glow-amber", mode.glowBlur, "#f59e0b");
    makeGlow("glow-cyan", mode.glowBlur, "#06b6d4");
    makeGlow("glow-white", mode.glowBlur, "#ffffff");
    makeGlow("glow-link", mode.glowBlur, mode.linkColor);

    // ── Jolt glow (electric mode only) ──
    const joltFilter = defs.append("filter").attr("id", "joltGlow").attr("x", "-100%").attr("y", "-100%").attr("width", "300%").attr("height", "300%");
    joltFilter.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "3").attr("result", "b");
    const jfm = joltFilter.append("feMerge");
    jfm.append("feMergeNode").attr("in", "b");
    jfm.append("feMergeNode").attr("in", "SourceGraphic");

    // ── Wave glow (research mode only) ──
    const waveFilter = defs.append("filter").attr("id", "waveGlow").attr("x", "-80%").attr("y", "-80%").attr("width", "260%").attr("height", "260%");
    waveFilter.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "3").attr("result", "wb");
    const wfm = waveFilter.append("feMerge");
    wfm.append("feMergeNode").attr("in", "wb");
    wfm.append("feMergeNode").attr("in", "SourceGraphic");

    const g = svg.append("g");
    svg.call(d3.zoom().scaleExtent([0.1, 6]).on("zoom", e => g.attr("transform", e.transform)));

    // Create link layer first (so it renders behind nodes)
    const linkGroup = g.append("g");

    const nodes = rawNodes.map(d => ({ ...d }));
    const links = rawLinks.map(d => ({ ...d }));
    const degrees = getNodeDegrees(nodes, links);

    const minR = 26, maxR = 46;
    const maxDeg = Math.max(...Object.values(degrees));
    const nodeRadius = d => minR + ((degrees[d.id] || 0) / maxDeg) * (maxR - minR);

    simRef.current = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(d => {
        const srcDeg = degrees[typeof d.source === 'object' ? d.source.id : d.source] || 0;
        const tgtDeg = degrees[typeof d.target === 'object' ? d.target.id : d.target] || 0;
        const baseDistance = 190 + (srcDeg + tgtDeg) * 3.5;
        const srcNode = nodes.find(n => n.id === (typeof d.source === 'object' ? d.source.id : d.source));
        const tgtNode = nodes.find(n => n.id === (typeof d.target === 'object' ? d.target.id : d.target));
        const srcRadius = srcNode ? nodeRadius(srcNode) : 0;
        const tgtRadius = tgtNode ? nodeRadius(tgtNode) : 0;
        return baseDistance + srcRadius + tgtRadius;
      }))
      .force("charge", d3.forceManyBody().strength(d => -900 - (degrees[d.id] || 0) * 20))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(d => nodeRadius(d) + 18));

    // ── Links ──
    const link = linkGroup.selectAll("line.link-line")
      .data(links).enter().append("line")
      .attr("class", "link-line")
      .attr("stroke", mode.linkColor)
      .attr("stroke-width", mode.linkWidth)
      .attr("stroke-opacity", mode.linkOpacity)
      .attr("stroke-dasharray", null)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("filter", graphMode === "analyst" ? null : "url(#glow-link)");

    // ── Electric jolt layer ──
    const joltColorsElectric = ["#7dd3fc","#c4b5fd","#86efac","#fde68a","#f9a8d4","#ffffff"];
    const joltColorsAnalyst  = ["#bae6fd","#e0f2fe","#93c5fd","#dbeafe","#bfdbfe","#ffffff"];
    const joltColors = graphMode === "analyst" ? joltColorsAnalyst : joltColorsElectric;
    let joltData = [], joltEls = [];
    if (mode.showJolts) {
      const joltGroup = g.append("g").attr("class", "jolts");
      joltData = links.map((l, i) => ({
        link: l,
        color: joltColors[i % joltColors.length],
        speed: graphMode === "analyst" ? 1.8 + (i % 5) * 0.4 : 2.2 + (i % 5) * 0.6,
        dashLen: graphMode === "analyst" ? 12 + (i % 4) * 6 : 8 + (i % 4) * 5,
        gapLen: graphMode === "analyst" ? 40 + (i % 6) * 14 : 35 + (i % 6) * 12,
        offset: Math.random() * 150,
      }));
      joltEls = joltData.map(jd => {
        const el = document.createElementNS("http://www.w3.org/2000/svg", "line");
        el.setAttribute("stroke", jd.color);
        el.setAttribute("stroke-width", graphMode === "analyst" ? "1.4" : "1.8");
        el.setAttribute("stroke-opacity", graphMode === "analyst" ? "0.6" : "0.85");
        el.setAttribute("stroke-linecap", "round");
        el.setAttribute("filter", "url(#joltGlow)");
        el.setAttribute("pointer-events", "none");
        el.setAttribute("stroke-dasharray", `${jd.dashLen} ${jd.gapLen}`);
        joltGroup.node().appendChild(el);
        return el;
      });
    }

    // ── Scalar wave rings (research mode) ──
    const waveColors = ["#38bdf8","#818cf8","#34d399","#fb923c","#f472b6"];
    let waveData = [], waveEls = [];
    if (mode.showWaves) {
      const scalarGroup = g.append("g").attr("class", "scalar-waves");
      const NUM_WAVES = 30;
      waveData = Array.from({ length: NUM_WAVES }, (_, i) => ({
        nodeIdx: Math.floor(Math.random() * nodes.length),
        r: (i / NUM_WAVES) * 150,
        maxR: 120 + Math.random() * 80,
        speed: 0.8 + Math.random() * 0.8,
        color: waveColors[i % waveColors.length],
        strokeW: 0.8 + Math.random() * 0.7,
      }));
      waveEls = waveData.map(w => {
        const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        el.setAttribute("fill", "none");
        el.setAttribute("stroke-width", w.strokeW);
        el.setAttribute("filter", "url(#waveGlow)");
        el.setAttribute("pointer-events", "none");
        scalarGroup.node().appendChild(el);
        return el;
      });
    }

    // ── Link labels ──
    const linkLabel = g.append("g").selectAll("text.linklabel")
      .data(links).enter().append("text")
      .attr("class", "linklabel")
      .attr("font-size", 10).attr("font-weight", "700")
      .attr("fill", "#e2e8f0").attr("fill-opacity", 0)
      .attr("stroke", "#000").attr("stroke-width", 2)
      .attr("stroke-linejoin", "round").attr("paint-order", "stroke")
      .attr("text-anchor", "middle")
      .attr("pointer-events", "none")
      .text(d => d.label);

    // ── Node groups ──
    const node = g.append("g").selectAll("g.node")
      .data(nodes).enter().append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .call(d3.drag()
        .on("start", (e, d) => { if (!e.active) simRef.current.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on("end", (e, d) => { if (!e.active) simRef.current.alphaTarget(0); d.fx = null; d.fy = null; })
      )
      .on("click", (e, d) => { e.stopPropagation(); onNodeClick(d); });

    // ── Outer ring ──
    node.append("circle")
      .attr("class", "ring")
      .attr("r", d => nodeRadius(d) + 4)
      .attr("fill", "none")
      .attr("stroke", d => groupColors[d.group])
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.25)
      .attr("pointer-events", "none");

    // ── Main node circle ──
    node.append("circle")
      .attr("class", "main-circle")
      .attr("r", d => nodeRadius(d))
      .attr("fill", d => `url(#grad-${d.group})`)
      .attr("stroke", d => groupColors[d.group])
      .attr("stroke-width", mode.nodeStrokeWidth)
      .on("mouseenter", function(e, d) {
        const r = nodeRadius(d);
        d3.select(this.parentNode).select(".ring")
          .transition().duration(180).attr("stroke-opacity", 0.7).attr("r", r + 8);
        d3.select(this).transition().duration(180).attr("stroke-width", 2.5);
        d3.select(this.parentNode).select(".group-label")
          .transition().duration(150).attr("fill-opacity", 1);
        d3.select(this.parentNode).selectAll(".lbl-fill")
          .transition().duration(150).attr("fill", "#ffffff");
        linkLabel.transition().duration(150)
          .attr("fill-opacity", l => {
            const src = typeof l.source === 'object' ? l.source.id : l.source;
            const tgt = typeof l.target === 'object' ? l.target.id : l.target;
            return (src === d.id || tgt === d.id) ? 1 : 0;
          });
        link.transition().duration(150)
          .attr("stroke-opacity", l => {
            const src = typeof l.source === 'object' ? l.source.id : l.source;
            const tgt = typeof l.target === 'object' ? l.target.id : l.target;
            return (src === d.id || tgt === d.id) ? 1 : 0.1;
          })
          .attr("stroke", l => {
            const src = typeof l.source === 'object' ? l.source.id : l.source;
            const tgt = typeof l.target === 'object' ? l.target.id : l.target;
            return (src === d.id || tgt === d.id) ? groupColors[d.group] : mode.linkColor;
          })
          .attr("stroke-width", l => {
            const src = typeof l.source === 'object' ? l.source.id : l.source;
            const tgt = typeof l.target === 'object' ? l.target.id : l.target;
            return (src === d.id || tgt === d.id) ? 2 : mode.linkWidth;
          });
      })
      .on("mouseleave", function(e, d) {
        const r = nodeRadius(d);
        d3.select(this.parentNode).select(".ring")
          .transition().duration(300).attr("stroke-opacity", d.id === selectedNodeId ? 0.7 : 0.25).attr("r", r + 4);
        d3.select(this).transition().duration(300).attr("stroke-width", d.id === selectedNodeId ? 2.5 : mode.nodeStrokeWidth);
        d3.select(this.parentNode).select(".group-label")
          .transition().duration(300).attr("fill-opacity", 0.6);
        d3.select(this.parentNode).selectAll(".lbl-fill")
          .transition().duration(300).attr("fill", "#f1f5f9");
        linkLabel.transition().duration(200).attr("fill-opacity", 0);
        link.transition().duration(200)
          .attr("stroke-opacity", mode.linkOpacity)
          .attr("stroke", mode.linkColor)
          .attr("stroke-width", mode.linkWidth);
      });

    // ── Node degree arc ──
    node.each(function(d) {
      const r = nodeRadius(d);
      const deg = degrees[d.id] || 0;
      const maxAngle = Math.PI * 2 * Math.min(deg / 15, 1);
      const arc = d3.arc().innerRadius(r + 2).outerRadius(r + 5).startAngle(0).endAngle(maxAngle);
      d3.select(this).append("path")
        .attr("d", arc())
        .attr("fill", groupColors[d.group])
        .attr("fill-opacity", 0.4)
        .attr("pointer-events", "none");
    });

    // ── Multi-line node labels ──
    node.each(function(d) {
      const lines = wrapLabel(d.label, 11);
      const lineH = 13;
      const startY = -(lines.length - 1) * lineH / 2;
      const sel = d3.select(this);
      const color = groupColors[d.group];
      const fontSize = lines.length > 2 ? 9 : lines.length === 2 ? 10 : 11;

      lines.forEach((t, i) => {
        sel.append("text").attr("class", "lbl-shadow")
          .attr("text-anchor", "middle").attr("y", startY + i * lineH)
          .attr("font-size", fontSize).attr("font-weight", "800")
          .attr("fill", "none").attr("stroke", color).attr("stroke-width", 2)
          .attr("stroke-linejoin", "round").attr("paint-order", "stroke")
          .attr("pointer-events", "none").text(t);
      });

      lines.forEach((t, i) => {
        sel.append("text").attr("class", "lbl-fill")
          .attr("text-anchor", "middle").attr("y", startY + i * lineH)
          .attr("font-size", fontSize).attr("font-weight", "800")
          .attr("fill", "#f1f5f9").attr("pointer-events", "none").text(t);
      });
    });

    // ── Group subtitle ──
    node.append("text")
      .attr("class", "group-label")
      .attr("text-anchor", "middle")
      .attr("y", d => nodeRadius(d) + 15)
      .attr("font-size", 8).attr("font-weight", "700")
      .attr("letter-spacing", "0.09em")
      .attr("fill", graphMode === "analyst" ? "#ffffff" : d => groupColors[d.group])
      .attr("fill-opacity", graphMode === "analyst" ? 0.85 : 0.6)
      .attr("stroke", "#000").attr("stroke-width", 1.5)
      .attr("paint-order", "stroke")
      .attr("pointer-events", "none")
      .text(d => d.group.toUpperCase());

    // ── RAF animation ──
    let rafId;
    const animate = () => {
      if (mode.showJolts) {
        for (let i = 0; i < joltData.length; i++) {
          joltData[i].offset += joltData[i].speed;
          joltEls[i].setAttribute("stroke-dashoffset", -joltData[i].offset);
        }
      }
      if (mode.showWaves) {
        for (let i = 0; i < waveData.length; i++) {
          const w = waveData[i];
          const nd = nodes[w.nodeIdx];
          if (!nd?.x) continue;
          w.r += w.speed;
          if (w.r > w.maxR) { w.r = 0; w.nodeIdx = Math.floor(Math.random() * nodes.length); }
          const op = Math.sin((w.r / w.maxR) * Math.PI) * 0.45;
          waveEls[i].setAttribute("cx", nd.x);
          waveEls[i].setAttribute("cy", nd.y);
          waveEls[i].setAttribute("r", w.r);
          waveEls[i].setAttribute("stroke", w.color);
          waveEls[i].setAttribute("stroke-opacity", op);
        }
      }
      rafId = requestAnimationFrame(animate);
    };
    setTimeout(() => { rafId = requestAnimationFrame(animate); }, 400);

    // ── Tick ──
    simRef.current.on("tick", () => {
      link.attr("x1", d => d.source?.x ?? 0).attr("y1", d => d.source?.y ?? 0)
          .attr("x2", d => d.target?.x ?? 0).attr("y2", d => d.target?.y ?? 0);

      if (mode.showJolts) {
        for (let i = 0; i < joltData.length; i++) {
          const l = joltData[i].link;
          joltEls[i].setAttribute("x1", l.source?.x ?? 0);
          joltEls[i].setAttribute("y1", l.source?.y ?? 0);
          joltEls[i].setAttribute("x2", l.target?.x ?? 0);
          joltEls[i].setAttribute("y2", l.target?.y ?? 0);
        }
      }

      linkLabel
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2 - 4);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simRef.current?.stop();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [graphMode]);

  // ── Selected node highlight ──
  useEffect(() => {
    if (!svgRef.current) return;
    const glowMap = {
      physics: "url(#glow-blue)", biology: "url(#glow-green)", weapons: "url(#glow-red)",
      consciousness: "url(#glow-purple)", history: "url(#glow-amber)", philosophy: "url(#glow-cyan)"
    };
    const svg = d3.select(svgRef.current);
    svg.selectAll("g.node").each(function(d) {
      if (!d) return;
      const isSelected = d.id === selectedNodeId;
      const grp = d3.select(this);
      grp.select(".main-circle")
        .attr("stroke-width", isSelected ? 2.5 : 1.5)
        .attr("filter", isSelected ? (glowMap[d.group] || null) : null);
      grp.select(".ring")
        .attr("stroke-opacity", isSelected ? 0.75 : 0.25)
        .attr("stroke-width", isSelected ? 1.5 : 1);
    });
  }, [selectedNodeId]);

  return <svg ref={svgRef} className="w-full h-full" />;
}