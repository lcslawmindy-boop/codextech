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

// Mode configs — NEURAL is the new living-brain default
const MODES = {
  neural: {
    bg: "transparent",
    linkColor: "#7dd3fc",
    linkOpacity: 0.55,
    linkWidth: 1.4,
    nodeStrokeWidth: 1.5,
    showJolts: true,
    showWaves: true,
    showSynapses: true,
    showFlashes: true,
    glowBlur: 6,
    label: "NEURAL",
  },
  analyst: {
    bg: "transparent",
    linkColor: "#bae6fd",
    linkOpacity: 0.6,
    linkWidth: 1.3,
    nodeStrokeWidth: 1.5,
    showJolts: true,
    showWaves: true,
    showSynapses: true,
    showFlashes: false,
    glowBlur: 4,
    label: "ANALYST",
  },
  electric: {
    bg: "transparent",
    linkColor: "#ffffff",
    linkOpacity: 0.4,
    linkWidth: 1.1,
    nodeStrokeWidth: 1.5,
    showJolts: true,
    showWaves: true,
    showSynapses: true,
    showFlashes: true,
    glowBlur: 6,
    label: "ELECTRIC",
  },
  research: {
    bg: "transparent",
    linkColor: "#94a3b8",
    linkOpacity: 0.45,
    linkWidth: 1.1,
    nodeStrokeWidth: 1.5,
    showJolts: true,
    showWaves: true,
    showSynapses: true,
    showFlashes: false,
    glowBlur: 5,
    label: "RESEARCH",
  },
};

const HEX = (c) => [parseInt(c.slice(1,3),16), parseInt(c.slice(3,5),16), parseInt(c.slice(5,7),16)];

export default function ConceptNetworkGraph({ onNodeClick, selectedNodeId, graphMode = "neural", onLinkClick }) {
  const svgRef = useRef(null);
  const simRef = useRef(null);
  const shimmerRef = useRef({ nodeId: null, startTime: 0 });

  useEffect(() => {
    const mode = MODES[graphMode] || MODES.neural;
    const container = svgRef.current.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("perspective", "1400px");

    svg.selectAll("*").remove();

    const defs = svg.append("defs");

    // ── 3D sphere gradients per group (deeper, more luminous) ──
    Object.entries(groupColors).forEach(([group, color]) => {
      const [r,g,b] = HEX(color);
      const grad = defs.append("radialGradient")
        .attr("id", `grad-${group}`)
        .attr("cx", "32%").attr("cy", "28%").attr("r", "72%");
      grad.append("stop").attr("offset", "0%").attr("stop-color", "#ffffff").attr("stop-opacity", 0.55);
      grad.append("stop").attr("offset", "28%").attr("stop-color", `rgb(${Math.min(r+60,255)},${Math.min(g+60,255)},${Math.min(b+60,255)})`).attr("stop-opacity", 0.95);
      grad.append("stop").attr("offset", "70%").attr("stop-color", color).attr("stop-opacity", 0.9);
      grad.append("stop").attr("offset", "100%").attr("stop-color", `rgb(${Math.max(r-50,0)},${Math.max(g-50,0)},${Math.max(b-50,0)})`).attr("stop-opacity", 0.4);

      const spec = defs.append("radialGradient")
        .attr("id", `spec-${group}`)
        .attr("cx", "28%").attr("cy", "22%").attr("r", "36%");
      spec.append("stop").attr("offset", "0%").attr("stop-color", "#ffffff").attr("stop-opacity", 0.85);
      spec.append("stop").attr("offset", "100%").attr("stop-color", "#ffffff").attr("stop-opacity", 0);

      const shadow = defs.append("radialGradient")
        .attr("id", `shadow-${group}`)
        .attr("cx", "60%").attr("cy", "78%").attr("r", "58%");
      shadow.append("stop").attr("offset", "0%").attr("stop-color", "#000000").attr("stop-opacity", 0.55);
      shadow.append("stop").attr("offset", "100%").attr("stop-color", "#000000").attr("stop-opacity", 0);

      // Inner neuron glow
      const inner = defs.append("radialGradient")
        .attr("id", `inner-${group}`)
        .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
      inner.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 0.7);
      inner.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0);
    });

    // ── Drop shadow filter ──
    const dropShadow = defs.append("filter").attr("id", "dropShadow").attr("x", "-40%").attr("y", "-40%").attr("width", "180%").attr("height", "180%");
    dropShadow.append("feDropShadow").attr("dx", "2").attr("dy", "5").attr("stdDeviation", "6").attr("flood-color", "#000000").attr("flood-opacity", "0.65");

    // ── Glow filters ──
    const makeGlow = (id, blur, color) => {
      const [r,g,b] = HEX(color);
      const f = defs.append("filter").attr("id", id).attr("x", "-60%").attr("y", "-60%").attr("width", "220%").attr("height", "220%");
      f.append("feColorMatrix").attr("type", "matrix")
        .attr("values", `0 0 0 0 ${r/255} 0 0 0 0 ${g/255} 0 0 0 0 ${b/255} 0 0 0 1 0`)
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
    makeGlow("glow-label", 2.5, "#22d3ee");

    const joltFilter = defs.append("filter").attr("id", "joltGlow").attr("x", "-100%").attr("y", "-100%").attr("width", "300%").attr("height", "300%");
    joltFilter.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "3").attr("result", "b");
    const jfm = joltFilter.append("feMerge");
    jfm.append("feMergeNode").attr("in", "b");
    jfm.append("feMergeNode").attr("in", "SourceGraphic");

    const waveFilter = defs.append("filter").attr("id", "waveGlow").attr("x", "-80%").attr("y", "-80%").attr("width", "260%").attr("height", "260%");
    waveFilter.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "3").attr("result", "wb");
    const wfm = waveFilter.append("feMerge");
    wfm.append("feMergeNode").attr("in", "wb");
    wfm.append("feMergeNode").attr("in", "SourceGraphic");

    // Synapse pulse glow
    const synFilter = defs.append("filter").attr("id", "synGlow").attr("x", "-200%").attr("y", "-200%").attr("width", "500%").attr("height", "500%");
    synFilter.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "2.5").attr("result", "sb");
    const sfm = synFilter.append("feMerge");
    sfm.append("feMergeNode").attr("in", "sb");
    sfm.append("feMergeNode").attr("in", "SourceGraphic");

    // Root group with 3D perspective tilt + hypnotic breathing
    const root = svg.append("g").attr("class", "brain-root");
    const g = root.append("g").attr("class", "brain-3d");
    svg.call(d3.zoom().scaleExtent([0.1, 6]).on("zoom", e => g.attr("transform", e.transform)));

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
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("filter", "url(#glow-link)");

    // ── Link data-flow pulse layer (connections breathing with light) ──
    const linkPulseGroup = g.append("g").attr("class", "link-pulses").lower();
    const linkPulseData = links.map((l, i) => ({ link: l, phase: (i * 0.7) % (Math.PI * 2) }));
    const linkPulseEls = linkPulseData.map(() => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "line");
      el.setAttribute("stroke", mode.linkColor);
      el.setAttribute("stroke-width", mode.linkWidth * 2.2);
      el.setAttribute("stroke-linecap", "round");
      el.setAttribute("stroke-opacity", "0");
      el.setAttribute("filter", "url(#glow-link)");
      el.setAttribute("pointer-events", "none");
      linkPulseGroup.node().appendChild(el);
      return el;
    });

    // ── Electric jolt layer (traveling dashes) ──
    const joltColors = ["#7dd3fc","#c4b5fd","#86efac","#fde68a","#f9a8d4","#ffffff","#67e8f9","#fbcfe8"];
    let joltData = [], joltEls = [];
    if (mode.showJolts) {
      const joltGroup = g.append("g").attr("class", "jolts");
      joltData = links.map((l, i) => ({
        link: l,
        color: joltColors[i % joltColors.length],
        speed: 1.6 + (i % 5) * 0.5,
        dashLen: 10 + (i % 4) * 5,
        gapLen: 38 + (i % 6) * 12,
        offset: Math.random() * 150,
      }));
      joltEls = joltData.map(jd => {
        const el = document.createElementNS("http://www.w3.org/2000/svg", "line");
        el.setAttribute("stroke", jd.color);
        el.setAttribute("stroke-width", "1.8");
        el.setAttribute("stroke-opacity", "0.85");
        el.setAttribute("stroke-linecap", "round");
        el.setAttribute("filter", "url(#joltGlow)");
        el.setAttribute("pointer-events", "none");
        el.setAttribute("stroke-dasharray", `${jd.dashLen} ${jd.gapLen}`);
        joltGroup.node().appendChild(el);
        return el;
      });
    }

    // ── Synaptic pulse dots (glowing neurons firing along axons) — always on ──
    let synapseData = [], synapseEls = [];
    if (mode.showSynapses) {
      const synGroup = g.append("g").attr("class", "synapses");
      const synColors = ["#22d3ee","#a78bfa","#34d399","#fbbf24","#f472b6","#60a5fa","#fb923c","#e879f9"];
      const PULSES_PER_LINK = 1;
      synapseData = [];
      links.forEach((l, i) => {
        for (let p = 0; p < PULSES_PER_LINK; p++) {
          synapseData.push({
            link: l,
            t: Math.random(),
            speed: 0.004 + Math.random() * 0.008,
            color: synColors[i % synColors.length],
            r: 2.2 + Math.random() * 1.6,
            dir: Math.random() > 0.5 ? 1 : -1,
          });
        }
      });
      synapseEls = synapseData.map(sd => {
        const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        el.setAttribute("r", sd.r);
        el.setAttribute("fill", sd.color);
        el.setAttribute("filter", "url(#synGlow)");
        el.setAttribute("pointer-events", "none");
        synGroup.node().appendChild(el);
        return el;
      });
    }

    // ── Scalar wave rings (quantum fields radiating from nodes) — always on ──
    const waveColors = ["#38bdf8","#818cf8","#34d399","#fb923c","#f472b6","#22d3ee","#a78bfa"];
    let waveData = [], waveEls = [];
    if (mode.showWaves) {
      const scalarGroup = g.append("g").attr("class", "scalar-waves");
      const NUM_WAVES = 45;
      waveData = Array.from({ length: NUM_WAVES }, (_, i) => ({
        nodeIdx: Math.floor(Math.random() * nodes.length),
        r: (i / NUM_WAVES) * 150,
        maxR: 220 + Math.random() * 200,
        speed: 0.7 + Math.random() * 0.9,
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

    // ── Node firing flash layer (brain firing up) ──
    let flashEls = [];
    if (mode.showFlashes) {
      const flashGroup = g.append("g").attr("class", "flashes");
      flashEls = nodes.map((n) => {
        const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        el.setAttribute("fill", groupColors[n.group]);
        el.setAttribute("pointer-events", "none");
        el.setAttribute("opacity", 0);
        flashGroup.node().appendChild(el);
        return { el, node: n, nextFire: Math.random() * 4000, firing: 0 };
      });
    }

    // ── Link labels (bold, bright, glowing, always visible) ──
    const linkLabelBg = g.append("g").selectAll("rect.linklabel-bg")
      .data(links).enter().append("rect")
      .attr("class", "linklabel-bg")
      .attr("fill", "rgba(8,12,20,0.7)")
      .attr("rx", 4)
      .attr("pointer-events", "none")
      .attr("opacity", 0.55)
      .attr("stroke", "rgba(56,189,248,0.25)")
      .attr("stroke-width", 0.5);

    const linkLabel = g.append("g").selectAll("text.linklabel")
      .data(links).enter().append("text")
      .attr("class", "linklabel")
      .attr("font-size", 11).attr("font-weight", "900")
      .attr("fill", "#e0f2fe").attr("fill-opacity", 0.95)
      .attr("stroke", "#020617").attr("stroke-width", 3)
      .attr("stroke-linejoin", "round").attr("paint-order", "stroke")
      .attr("text-anchor", "middle")
      .attr("filter", "url(#glow-label)")
      .style("cursor", "pointer")
      .style("letter-spacing", "0.02em")
      .text(d => d.label)
      .on("mouseenter", function(e, d) {
        d3.select(this).transition().duration(150).attr("fill-opacity", 1).attr("font-size", 13).attr("fill", "#fde047");
        d3.select(this.parentNode).selectAll("rect.linklabel-bg").filter((bd) => bd === d)
          .transition().duration(150).attr("opacity", 0.9).attr("fill", "rgba(250,204,21,0.15)").attr("stroke", "#fbbf24");
      })
      .on("mouseleave", function(e, d) {
        d3.select(this).transition().duration(150).attr("fill-opacity", 0.95).attr("font-size", 11).attr("fill", "#e0f2fe");
        d3.select(this.parentNode).selectAll("rect.linklabel-bg").filter((bd) => bd === d)
          .transition().duration(150).attr("opacity", 0.55).attr("fill", "rgba(8,12,20,0.7)").attr("stroke", "rgba(56,189,248,0.25)");
      })
      .on("click", (e, d) => { e.stopPropagation(); if (onLinkClick) onLinkClick(d); });

    linkLabel.each(function(d, i) {
      const bbox = this.getBBox();
      d3.select(linkLabelBg.nodes()[i])
        .attr("x", bbox.x - 6).attr("y", bbox.y - 2)
        .attr("width", bbox.width + 12).attr("height", bbox.height + 4)
        .style("pointer-events", "auto")
        .on("click", (e) => { e.stopPropagation(); if (onLinkClick) onLinkClick(d); });
    });
    g.selectAll(".linklabel-bg").raise();
    linkLabel.raise();

    // ── Node data-flow pulse rings (nodes breathing with light) ──
    const nodePulseGroup = g.append("g").attr("class", "node-pulses");
    const nodePulseData = nodes.map((n, i) => ({ node: n, t: (i * 0.13) % 1 }));
    const nodePulseEls = nodePulseData.map(() => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      el.setAttribute("fill", "none");
      el.setAttribute("stroke-width", 1.5);
      el.setAttribute("stroke-opacity", "0");
      el.setAttribute("pointer-events", "none");
      nodePulseGroup.node().appendChild(el);
      return el;
    });

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
      .on("click", (e, d) => { e.stopPropagation(); shimmerRef.current = { nodeId: d.id, startTime: performance.now() }; onNodeClick(d); });

    // Drop shadow ellipse
    node.append("ellipse")
      .attr("class", "sphere-shadow")
      .attr("rx", d => nodeRadius(d) * 0.85)
      .attr("ry", d => nodeRadius(d) * 0.22)
      .attr("cy", d => nodeRadius(d) * 0.9)
      .attr("fill", "#000000").attr("fill-opacity", 0.5).attr("pointer-events", "none");

    // Outer glow ring
    node.append("circle")
      .attr("class", "ring")
      .attr("r", d => nodeRadius(d) + 6)
      .attr("fill", "none")
      .attr("stroke", d => groupColors[d.group])
      .attr("stroke-width", 1.5).attr("stroke-opacity", 0.3).attr("pointer-events", "none");

    // Quantum aura ring (pulsing)
    node.append("circle")
      .attr("class", "aura")
      .attr("r", d => nodeRadius(d) + 10)
      .attr("fill", d => `url(#inner-${d.group})`)
      .attr("opacity", 0.25).attr("pointer-events", "none");

    // Main sphere body
    node.append("circle")
      .attr("class", "main-circle")
      .attr("r", d => nodeRadius(d))
      .attr("fill", d => `url(#grad-${d.group})`)
      .attr("stroke", d => groupColors[d.group])
      .attr("stroke-width", mode.nodeStrokeWidth + 0.5)
      .attr("filter", "url(#dropShadow)")
      .attr("pointer-events", "none");

    // Bottom shadow overlay
    node.append("circle")
      .attr("class", "sphere-depth")
      .attr("r", d => nodeRadius(d))
      .attr("fill", d => `url(#shadow-${d.group})`)
      .attr("pointer-events", "none");

    // Specular highlight
    node.append("circle")
      .attr("class", "sphere-spec")
      .attr("r", d => nodeRadius(d))
      .attr("fill", d => `url(#spec-${d.group})`)
      .attr("pointer-events", "none");

    // Hit target
    node.append("circle")
      .attr("class", "hit-target")
      .attr("r", d => nodeRadius(d))
      .attr("fill", "transparent").attr("stroke", "none")
      .on("mouseenter", function(e, d) {
        const r = nodeRadius(d);
        const nodeG = d3.select(this.parentNode);
        nodeG.select(".ring").transition().duration(180).attr("stroke-opacity", 0.9).attr("r", r + 12).attr("stroke-width", 2.5);
        nodeG.select(".aura").transition().duration(180).attr("opacity", 0.6).attr("r", r + 16);
        nodeG.select(".main-circle").transition().duration(180).attr("stroke-width", 3);
        nodeG.select(".sphere-shadow").transition().duration(180).attr("rx", r * 1.05).attr("fill-opacity", 0.65);
        nodeG.select(".group-label").transition().duration(150).attr("fill-opacity", 1);
        linkLabel.transition().duration(150)
          .attr("fill-opacity", l => {
            const s = typeof l.source === 'object' ? l.source.id : l.source;
            const t2 = typeof l.target === 'object' ? l.target.id : l.target;
            return (s === d.id || t2 === d.id) ? 1 : 0.4;
          })
          .attr("font-size", l => {
            const s = typeof l.source === 'object' ? l.source.id : l.source;
            const t2 = typeof l.target === 'object' ? l.target.id : l.target;
            return (s === d.id || t2 === d.id) ? 13 : 11;
          })
          .attr("fill", l => {
            const s = typeof l.source === 'object' ? l.source.id : l.source;
            const t2 = typeof l.target === 'object' ? l.target.id : l.target;
            return (s === d.id || t2 === d.id) ? "#fde047" : "#e0f2fe";
          });
        link.transition().duration(150)
          .attr("stroke-opacity", l => {
            const s = typeof l.source === 'object' ? l.source.id : l.source;
            const t2 = typeof l.target === 'object' ? l.target.id : l.target;
            return (s === d.id || t2 === d.id) ? 1 : 0.12;
          })
          .attr("stroke", l => {
            const s = typeof l.source === 'object' ? l.source.id : l.source;
            const t2 = typeof l.target === 'object' ? l.target.id : l.target;
            return (s === d.id || t2 === d.id) ? groupColors[d.group] : mode.linkColor;
          })
          .attr("stroke-width", l => {
            const s = typeof l.source === 'object' ? l.source.id : l.source;
            const t2 = typeof l.target === 'object' ? l.target.id : l.target;
            return (s === d.id || t2 === d.id) ? 2.8 : mode.linkWidth;
          });
      })
      .on("mouseleave", function(e, d) {
        const r = nodeRadius(d);
        const nodeG = d3.select(this.parentNode);
        nodeG.select(".ring").transition().duration(300).attr("stroke-opacity", d.id === selectedNodeId ? 0.85 : 0.3).attr("r", r + 6).attr("stroke-width", d.id === selectedNodeId ? 2.5 : 1.5);
        nodeG.select(".aura").transition().duration(300).attr("opacity", 0.25).attr("r", r + 10);
        nodeG.select(".main-circle").transition().duration(300).attr("stroke-width", d.id === selectedNodeId ? 3 : mode.nodeStrokeWidth + 0.5);
        nodeG.select(".sphere-shadow").transition().duration(300).attr("rx", r * 0.85).attr("fill-opacity", 0.5);
        nodeG.select(".group-label").transition().duration(300).attr("fill-opacity", 0.85);
        linkLabel.transition().duration(200).attr("fill-opacity", 0.95).attr("font-size", 11).attr("fill", "#e0f2fe");
        link.transition().duration(200).attr("stroke-opacity", mode.linkOpacity).attr("stroke", mode.linkColor).attr("stroke-width", mode.linkWidth);
      });

    // Node degree arc
    node.each(function(d) {
      const r = nodeRadius(d);
      const deg = degrees[d.id] || 0;
      const maxAngle = Math.PI * 2 * Math.min(deg / 15, 1);
      const arc = d3.arc().innerRadius(r + 2).outerRadius(r + 5).startAngle(0).endAngle(maxAngle);
      d3.select(this).append("path").attr("d", arc()).attr("fill", groupColors[d.group]).attr("fill-opacity", 0.5).attr("pointer-events", "none");
    });

    // Multi-line node labels — bold, bright, glowing
    node.each(function(d) {
      const lines = wrapLabel(d.label, 11);
      const lineH = 13;
      const startY = -(lines.length - 1) * lineH / 2;
      const sel = d3.select(this);
      const fontSize = lines.length > 2 ? 10 : lines.length === 2 ? 11 : 12;
      lines.forEach((t, i) => {
        sel.append("text").attr("class", "lbl-shadow")
          .attr("text-anchor", "middle").attr("y", startY + i * lineH)
          .attr("font-size", fontSize).attr("font-weight", "900")
          .attr("fill", "none").attr("stroke", "#020617").attr("stroke-width", 3.5)
          .attr("stroke-linejoin", "round").attr("paint-order", "stroke")
          .attr("pointer-events", "none").text(t);
      });
      lines.forEach((t, i) => {
        sel.append("text").attr("class", "lbl-fill")
          .attr("text-anchor", "middle").attr("y", startY + i * lineH)
          .attr("font-size", fontSize).attr("font-weight", "900")
          .attr("fill", "#ffffff").attr("pointer-events", "none").text(t);
      });
    });

    // Group subtitle
    node.append("text")
      .attr("class", "group-label")
      .attr("text-anchor", "middle")
      .attr("y", d => nodeRadius(d) + 16)
      .attr("font-size", 8).attr("font-weight", "800")
      .attr("letter-spacing", "0.09em")
      .attr("fill", d => groupColors[d.group])
      .attr("fill-opacity", 0.85)
      .attr("stroke", "#020617").attr("stroke-width", 2).attr("paint-order", "stroke")
      .attr("pointer-events", "none")
      .text(d => d.group.toUpperCase());

    // ── RAF animation: synapses firing, quantum waves, brain flashes, breathing ──
    let rafId, breath = 0;
    const animate = () => {
      breath += 0.012;
      // Hypnotic breathing — subtle 3D tilt oscillation
      const tiltX = 8 + Math.sin(breath * 0.5) * 3;
      const tiltY = Math.sin(breath * 0.37) * 4;
      const scale = 1 + Math.sin(breath * 0.6) * 0.012;
      root.attr("transform", `translate(${width/2},${height/2}) scale(${scale}) rotate(${tiltY}) translate(${-width/2},${-height/2})`);
      g.style("transform-box", "fill-box").style("transform-origin", "center")
        .style("transform", `perspective(1400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`);

      // Jolts
      if (mode.showJolts) {
        for (let i = 0; i < joltData.length; i++) {
          joltData[i].offset += joltData[i].speed;
          joltEls[i].setAttribute("stroke-dashoffset", -joltData[i].offset);
        }
      }
      // Synaptic pulses traveling along links (+ shimmer burst on clicked node)
      const shimmer = shimmerRef.current;
      const shimmerAge = shimmer.nodeId ? (performance.now() - shimmer.startTime) : Infinity;
      const SHIMMER_DUR = 2600;
      const shimmerAmt = shimmerAge < SHIMMER_DUR ? 1 - (shimmerAge / SHIMMER_DUR) : 0;
      if (mode.showSynapses) {
        for (let i = 0; i < synapseData.length; i++) {
          const sd = synapseData[i];
          sd.t += sd.speed * sd.dir * (1 + shimmerAmt * 1.8);
          if (sd.t > 1) sd.t = 0;
          if (sd.t < 0) sd.t = 1;
          const l = sd.link;
          if (!l.source?.x || !l.target?.x) continue;
          const x = l.source.x + (l.target.x - l.source.x) * sd.t;
          const y = l.source.y + (l.target.y - l.source.y) * sd.t;
          synapseEls[i].setAttribute("cx", x);
          synapseEls[i].setAttribute("cy", y);
          // Brighter near the ends (firing intensity)
          let intensity = 0.5 + 0.5 * Math.sin(sd.t * Math.PI);
          // Shimmer burst on synapses connected to the clicked/expanded node
          const sId = typeof l.source === 'object' ? l.source.id : l.source;
          const tId = typeof l.target === 'object' ? l.target.id : l.target;
          if (shimmerAmt > 0 && (sId === shimmer.nodeId || tId === shimmer.nodeId)) {
            const shimWave = 0.5 + 0.5 * Math.sin(performance.now() * 0.022 + i);
            intensity = Math.min(1, intensity + shimmerAmt * (0.4 + shimWave * 0.6));
            synapseEls[i].setAttribute("r", sd.r * (1 + shimmerAmt * 1.6));
            synapseEls[i].setAttribute("fill", shimmerAmt > 0.45 ? "#fef9c3" : "#fde047");
          } else {
            synapseEls[i].setAttribute("r", sd.r);
            synapseEls[i].setAttribute("fill", sd.color);
          }
          synapseEls[i].setAttribute("opacity", intensity);
        }
      }
      // Quantum waves
      if (mode.showWaves) {
        for (let i = 0; i < waveData.length; i++) {
          const w = waveData[i];
          const nd = nodes[w.nodeIdx];
          if (!nd?.x) continue;
          w.r += w.speed;
          if (w.r > w.maxR) { w.r = 0; w.nodeIdx = Math.floor(Math.random() * nodes.length); }
          const op = Math.sin((w.r / w.maxR) * Math.PI) * 0.4;
          waveEls[i].setAttribute("cx", nd.x);
          waveEls[i].setAttribute("cy", nd.y);
          waveEls[i].setAttribute("r", w.r);
          waveEls[i].setAttribute("stroke", w.color);
          waveEls[i].setAttribute("stroke-opacity", op);
        }
      }
      // Node firing flashes (brain firing up with electrical force)
      if (mode.showFlashes) {
        const now = performance.now();
        for (let i = 0; i < flashEls.length; i++) {
          const f = flashEls[i];
          if (f.firing > 0) {
            f.firing -= 0.04;
            const r = nodeRadius(f.node) * (1 + (1 - f.firing) * 0.8);
            f.el.setAttribute("r", r);
            f.el.setAttribute("opacity", f.firing * 0.6);
            f.el.setAttribute("cx", f.node.x);
            f.el.setAttribute("cy", f.node.y);
          } else if (now > f.nextFire) {
            f.firing = 1;
            f.nextFire = now + 3000 + Math.random() * 6000;
          }
        }
      }
      // Link data-flow pulse (connections breathing with light)
      for (let i = 0; i < linkPulseData.length; i++) {
        const lp = linkPulseData[i];
        const l = lp.link;
        if (!l.source?.x || !l.target?.x) continue;
        const pulse = 0.5 + 0.5 * Math.sin(breath * 1.6 + lp.phase);
        linkPulseEls[i].setAttribute("x1", l.source.x);
        linkPulseEls[i].setAttribute("y1", l.source.y);
        linkPulseEls[i].setAttribute("x2", l.target.x);
        linkPulseEls[i].setAttribute("y2", l.target.y);
        linkPulseEls[i].setAttribute("stroke-opacity", pulse * 0.45);
      }
      // Node data-flow pulse rings (nodes breathing with light)
      for (let i = 0; i < nodePulseData.length; i++) {
        const np = nodePulseData[i];
        const nd = np.node;
        if (!nd?.x) continue;
        np.t += 0.006;
        if (np.t > 1) np.t = 0;
        const r = nodeRadius(nd) * (1 + np.t * 1.1);
        const op = (1 - np.t) * 0.5;
        nodePulseEls[i].setAttribute("cx", nd.x);
        nodePulseEls[i].setAttribute("cy", nd.y);
        nodePulseEls[i].setAttribute("r", r);
        nodePulseEls[i].setAttribute("stroke", groupColors[nd.group]);
        nodePulseEls[i].setAttribute("stroke-opacity", op);
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
      linkLabel.attr("x", d => (d.source.x + d.target.x) / 2).attr("y", d => (d.source.y + d.target.y) / 2 - 4);
      linkLabelBg.each(function(d, i) {
        const labelEl = linkLabel.nodes()[i];
        if (labelEl) {
          const bbox = labelEl.getBBox();
          d3.select(this).attr("x", bbox.x - 6).attr("y", bbox.y - 2).attr("width", bbox.width + 12).attr("height", bbox.height + 4);
        }
      });
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => { simRef.current?.stop(); if (rafId) cancelAnimationFrame(rafId); };
  }, [graphMode]);

  // Selected node highlight
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
        .attr("stroke-width", isSelected ? 3.5 : 2)
        .attr("filter", isSelected ? (glowMap[d.group] || "url(#dropShadow)") : "url(#dropShadow)");
      grp.select(".ring")
        .attr("stroke-opacity", isSelected ? 0.9 : 0.3)
        .attr("stroke-width", isSelected ? 2.5 : 1.5);
      grp.select(".aura").attr("opacity", isSelected ? 0.55 : 0.25);
      grp.attr("filter", isSelected ? (glowMap[d.group] || null) : null);
    });
  }, [selectedNodeId]);

  // Trigger synapse shimmer when selection changes from outside the graph (e.g. search)
  useEffect(() => {
    if (selectedNodeId) {
      shimmerRef.current = { nodeId: selectedNodeId, startTime: performance.now() };
    }
  }, [selectedNodeId]);

  return <svg ref={svgRef} className="w-full h-full" style={{ transformStyle: "preserve-3d" }} />;
}