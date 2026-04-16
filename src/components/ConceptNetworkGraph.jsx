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

// Count connections per node for sizing
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

    const defs = svg.append("defs");

    // ── Radial gradients per group ──
    Object.entries(groupColors).forEach(([group, color]) => {
      const grad = defs.append("radialGradient")
        .attr("id", `grad-${group}`)
        .attr("cx", "35%").attr("cy", "35%")
        .attr("r", "65%");
      grad.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 0.65);
      grad.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0.12);

      const gradSelected = defs.append("radialGradient")
        .attr("id", `grad-sel-${group}`)
        .attr("cx", "35%").attr("cy", "35%")
        .attr("r", "65%");
      gradSelected.append("stop").attr("offset", "0%").attr("stop-color", "#fff").attr("stop-opacity", 0.25);
      gradSelected.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0.9);
    });

    // ── Arrow marker ──
    defs.append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -4 8 8")
      .attr("refX", 42).attr("refY", 0)
      .attr("markerWidth", 4).attr("markerHeight", 4)
      .attr("orient", "auto")
      .append("path").attr("d", "M0,-4L8,0L0,4").attr("fill", "#475569");

    defs.append("marker")
      .attr("id", "arrow-hover")
      .attr("viewBox", "0 -4 8 8")
      .attr("refX", 42).attr("refY", 0)
      .attr("markerWidth", 4).attr("markerHeight", 4)
      .attr("orient", "auto")
      .append("path").attr("d", "M0,-4L8,0L0,4").attr("fill", "#93c5fd");

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

    makeGlow("glow-blue", 8, "#3b82f6");
    makeGlow("glow-green", 8, "#22c55e");
    makeGlow("glow-red", 8, "#ef4444");
    makeGlow("glow-purple", 8, "#a855f7");
    makeGlow("glow-amber", 8, "#f59e0b");
    makeGlow("glow-cyan", 8, "#06b6d4");
    makeGlow("glow-white", 6, "#ffffff");

    const glowMap = {
      physics: "url(#glow-blue)", biology: "url(#glow-green)", weapons: "url(#glow-red)",
      consciousness: "url(#glow-purple)", history: "url(#glow-amber)", philosophy: "url(#glow-cyan)"
    };

    // ── Link glow (bright multi-layer) ──
    const lf = defs.append("filter").attr("id", "linkGlow").attr("x", "-100%").attr("y", "-100%").attr("width", "300%").attr("height", "300%");
    lf.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "4").attr("result", "blurred");
    const lfm = lf.append("feMerge");
    lfm.append("feMergeNode").attr("in", "blurred");
    lfm.append("feMergeNode").attr("in", "blurred");
    lfm.append("feMergeNode").attr("in", "blurred");
    lfm.append("feMergeNode").attr("in", "SourceGraphic");

    // ── Link glow outer (wide halo) ──
    const lf2 = defs.append("filter").attr("id", "linkGlowOuter").attr("x", "-150%").attr("y", "-150%").attr("width", "400%").attr("height", "400%");
    lf2.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", "7").attr("result", "blurred2");
    const lfm2 = lf2.append("feMerge");
    lfm2.append("feMergeNode").attr("in", "blurred2");
    lfm2.append("feMergeNode").attr("in", "SourceGraphic");

    // Colorful electric palette
    const electricColors = ["#38bdf8","#a78bfa","#34d399","#fb923c","#f472b6","#facc15","#60a5fa","#4ade80"];
    // Lightning bolt colors: white core, neon blue & yellow
    const boltColors = ["#ffffff","#38bdf8","#facc15","#ffffff","#7dd3fc","#fde68a","#ffffff","#0ea5e9"];


    const g = svg.append("g");

    svg.call(d3.zoom().scaleExtent([0.15, 5]).on("zoom", e => g.attr("transform", e.transform)));

    const nodes = rawNodes.map(d => ({ ...d }));
    const links = rawLinks.map(d => ({ ...d }));
    const degrees = getNodeDegrees(nodes, links);

    // Node radius based on degree (hub nodes are larger)
    const minR = 30, maxR = 52;
    const maxDeg = Math.max(...Object.values(degrees));
    const nodeRadius = d => minR + ((degrees[d.id] || 0) / maxDeg) * (maxR - minR);

    simRef.current = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(d => {
        const srcDeg = degrees[typeof d.source === 'object' ? d.source.id : d.source] || 0;
        const tgtDeg = degrees[typeof d.target === 'object' ? d.target.id : d.target] || 0;
        return 180 + (srcDeg + tgtDeg) * 3;
      }))
      .force("charge", d3.forceManyBody().strength(d => -900 - (degrees[d.id] || 0) * 25))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(d => nodeRadius(d) + 20));

    // ── Base dim links ──
    g.append("g").selectAll("line.base")
      .data(links).enter().append("line")
      .attr("class", "base")
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.5)
      .attr("marker-end", "url(#arrow)");

    // ── Outer halo electric links (wide glow) ──
    g.append("g").selectAll("line.electric-halo")
      .data(links).enter().append("line")
      .attr("class", "electric-halo")
      .attr("stroke", (d, i) => electricColors[i % electricColors.length])
      .attr("stroke-width", 4)
      .attr("stroke-opacity", 0.18)
      .attr("stroke-dasharray", "8 16")
      .attr("filter", "url(#linkGlowOuter)")
      .each(function(d, i) {
        const el = d3.select(this);
        const duration = 1200 + (i % 6) * 150;
        const offset = (i % 30) * -6;
        el.style("stroke-dashoffset", offset)
          .transition().duration(0)
          .on("start", function repeat() {
            d3.active(this)
              .styleTween("stroke-dashoffset", () => d3.interpolateNumber(offset, offset - 80))
              .transition().duration(duration).ease(d3.easeLinear).on("start", repeat);
          });
      });

    // ── Core bright electric links ──
    const link = g.append("g").selectAll("line.electric")
      .data(links).enter().append("line")
      .attr("class", "electric")
      .attr("stroke", (d, i) => electricColors[i % electricColors.length])
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.85)
      .attr("stroke-dasharray", "6 14")
      .attr("filter", "url(#linkGlow)")
      .attr("marker-end", "url(#arrow)")
      .each(function(d, i) {
        const el = d3.select(this);
        const duration = 700 + (i % 8) * 90;
        const offset = (i % 22) * -5;
        el.style("stroke-dashoffset", offset)
          .transition().duration(0)
          .on("start", function repeat() {
            d3.active(this)
              .styleTween("stroke-dashoffset", () => d3.interpolateNumber(offset, offset - 70))
              .transition().duration(duration).ease(d3.easeLinear).on("start", repeat);
          });
      });

    // ── Link labels ──
    const linkLabel = g.append("g").selectAll("text.linklabel")
      .data(links).enter().append("text")
      .attr("class", "linklabel")
      .attr("font-size", 10).attr("font-weight", "600")
      .attr("fill", "#94a3b8").attr("fill-opacity", 0)
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

    // ── Outer ring (thin, colored) ──
    node.append("circle")
      .attr("class", "ring")
      .attr("r", d => nodeRadius(d) + 5)
      .attr("fill", "none")
      .attr("stroke", d => groupColors[d.group])
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.3)
      .attr("pointer-events", "none");

    // ── Main node circle ──
    node.append("circle")
      .attr("class", "main-circle")
      .attr("r", d => nodeRadius(d))
      .attr("fill", d => `url(#grad-${d.group})`)
      .attr("stroke", d => groupColors[d.group])
      .attr("stroke-width", 1.5)
      .on("mouseenter", function(e, d) {
        const r = nodeRadius(d);
        d3.select(this.parentNode).select(".ring")
          .transition().duration(200)
          .attr("stroke-opacity", 0.7)
          .attr("r", r + 9);
        d3.select(this)
          .transition().duration(200)
          .attr("stroke-width", 2.5);
        linkLabel.transition().duration(150)
          .attr("fill-opacity", l => {
            const src = typeof l.source === 'object' ? l.source.id : l.source;
            const tgt = typeof l.target === 'object' ? l.target.id : l.target;
            return (src === d.id || tgt === d.id) ? 1 : 0;
          });
        // Highlight connected links
        link.transition().duration(150)
          .attr("stroke-opacity", l => {
            const src = typeof l.source === 'object' ? l.source.id : l.source;
            const tgt = typeof l.target === 'object' ? l.target.id : l.target;
            return (src === d.id || tgt === d.id) ? 1 : 0.15;
          })
          .attr("stroke", l => {
            const src = typeof l.source === 'object' ? l.source.id : l.source;
            const tgt = typeof l.target === 'object' ? l.target.id : l.target;
            return (src === d.id || tgt === d.id) ? groupColors[d.group] : "#38bdf8";
          })
          .attr("stroke-width", l => {
            const src = typeof l.source === 'object' ? l.source.id : l.source;
            const tgt = typeof l.target === 'object' ? l.target.id : l.target;
            return (src === d.id || tgt === d.id) ? 2.5 : 1.4;
          });
      })
      .on("mouseleave", function(e, d) {
        const r = nodeRadius(d);
        d3.select(this.parentNode).select(".ring")
          .transition().duration(300)
          .attr("stroke-opacity", d.id === selectedNodeId ? 0.8 : 0.3)
          .attr("r", r + 5);
        d3.select(this)
          .transition().duration(300)
          .attr("stroke-width", d.id === selectedNodeId ? 3 : 1.5);
        linkLabel.transition().duration(200).attr("fill-opacity", 0);
        link.transition().duration(200)
          .attr("stroke-opacity", 0.85)
          .attr("stroke", (d, i) => electricColors[i % electricColors.length])
          .attr("stroke-width", 2);
      });

    // ── Group color dot (top-right badge) ──
    node.append("circle")
      .attr("class", "badge-dot")
      .attr("r", 4.5)
      .attr("cx", d => nodeRadius(d) - 4)
      .attr("cy", d => -(nodeRadius(d) - 4))
      .attr("fill", d => groupColors[d.group])
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 1.5)
      .attr("pointer-events", "none");

    // ── Node degree indicator (small arc) ──
    node.each(function(d) {
      const r = nodeRadius(d);
      const deg = degrees[d.id] || 0;
      const maxAngle = Math.PI * 2 * Math.min(deg / 15, 1);
      const arc = d3.arc()
        .innerRadius(r + 2).outerRadius(r + 6)
        .startAngle(0).endAngle(maxAngle);
      d3.select(this).append("path")
        .attr("d", arc())
        .attr("fill", groupColors[d.group])
        .attr("fill-opacity", 0.5)
        .attr("pointer-events", "none");
    });

    // ── Multi-line labels ──
    node.each(function(d) {
      const lines = wrapLabel(d.label, 11);
      const lineH = 14;
      const r = nodeRadius(d);
      const startY = -(lines.length - 1) * lineH / 2;
      const sel = d3.select(this);
      const color = groupColors[d.group];
      const fontSize = lines.length > 2 ? 9.5 : lines.length === 2 ? 10.5 : 11;

      // Shadow/glow layer
      lines.forEach((t, i) => {
        sel.append("text")
          .attr("class", "lbl-shadow")
          .attr("text-anchor", "middle")
          .attr("y", startY + i * lineH)
          .attr("font-size", fontSize)
          .attr("font-weight", "900")
          .attr("fill", "none")
          .attr("stroke", color)
          .attr("stroke-width", 2.5)
          .attr("stroke-linejoin", "round")
          .attr("paint-order", "stroke")
          .attr("pointer-events", "none")
          .text(t);
      });

      // White fill
      lines.forEach((t, i) => {
        sel.append("text")
          .attr("class", "lbl-fill")
          .attr("text-anchor", "middle")
          .attr("y", startY + i * lineH)
          .attr("font-size", fontSize)
          .attr("font-weight", "900")
          .attr("fill", "#f8fafc")
          .attr("pointer-events", "none")
          .text(t);
      });
    });

    // ── Group label below node ──
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("y", d => nodeRadius(d) + 15)
      .attr("font-size", 8)
      .attr("font-weight", "700")
      .attr("letter-spacing", "0.08em")
      .attr("fill", d => groupColors[d.group])
      .attr("fill-opacity", 0.6)
      .attr("pointer-events", "none")
      .text(d => d.group.toUpperCase());

    // ── Lightning bolt particles ──
    // Each particle travels along a random link from source to target
    const NUM_BOLTS = 90;
    const boltData = Array.from({ length: NUM_BOLTS }, (_, i) => ({
      id: i,
      linkIdx: Math.floor(Math.random() * links.length),
      t: Math.random(),
      speed: 0.012 + Math.random() * 0.022,
      color: boltColors[i % boltColors.length],
      size: 2.5 + Math.random() * 4.5,
      trail: 0.5 + Math.random() * 0.5,
    }));

    const boltGroup = g.append("g").attr("class", "bolts");

    // Pre-create DOM elements and store direct references for fast RAF updates
    const boltEls = boltData.map(b => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", b.size);
      circle.setAttribute("fill", b.color);
      circle.setAttribute("filter", "url(#linkGlow)");
      circle.setAttribute("pointer-events", "none");
      boltGroup.node().appendChild(circle);

      const trail = document.createElementNS("http://www.w3.org/2000/svg", "line");
      trail.setAttribute("stroke", b.color);
      trail.setAttribute("stroke-width", b.size * 0.7);
      trail.setAttribute("stroke-opacity", b.trail);
      trail.setAttribute("filter", "url(#linkGlow)");
      trail.setAttribute("pointer-events", "none");
      boltGroup.node().appendChild(trail);

      return { circle, trail };
    });

    // Animate bolt positions via requestAnimationFrame — direct DOM for performance
    let rafId;
    const animateBolts = () => {
      for (let i = 0; i < boltData.length; i++) {
        const b = boltData[i];
        b.t += b.speed;
        if (b.t > 1) {
          b.t = 0;
          b.linkIdx = Math.floor(Math.random() * links.length);
          b.speed = 0.012 + Math.random() * 0.022;
          b.color = boltColors[Math.floor(Math.random() * boltColors.length)];
          b.size = 2.5 + Math.random() * 4.5;
          boltEls[i].circle.setAttribute("fill", b.color);
          boltEls[i].circle.setAttribute("r", b.size);
          boltEls[i].trail.setAttribute("stroke", b.color);
          boltEls[i].trail.setAttribute("stroke-width", b.size * 0.7);
        }

        const lk = links[b.linkIdx];
        if (!lk || !lk.source?.x) continue;

        const sx = lk.source.x, sy = lk.source.y;
        const tx = lk.target.x, ty = lk.target.y;
        const cx = sx + (tx - sx) * b.t;
        const cy = sy + (ty - sy) * b.t;
        const t0 = Math.max(0, b.t - 0.12);
        const x1 = sx + (tx - sx) * t0;
        const y1 = sy + (ty - sy) * t0;

        boltEls[i].circle.setAttribute("cx", cx);
        boltEls[i].circle.setAttribute("cy", cy);
        boltEls[i].trail.setAttribute("x1", x1);
        boltEls[i].trail.setAttribute("y1", y1);
        boltEls[i].trail.setAttribute("x2", cx);
        boltEls[i].trail.setAttribute("y2", cy);
      }
      rafId = requestAnimationFrame(animateBolts);
    };

    setTimeout(() => { rafId = requestAnimationFrame(animateBolts); }, 800);

    // ── Scalar wave rings pulsing from nodes ──
    const scalarGroup = g.append("g").attr("class", "scalar-waves");
    const NUM_WAVES = 60;
    const waveData = Array.from({ length: NUM_WAVES }, (_, i) => ({
      nodeIdx: Math.floor(Math.random() * nodes.length),
      r: Math.random() * 80,
      maxR: 80 + Math.random() * 60,
      speed: 0.6 + Math.random() * 1.0,
      color: ["#38bdf8","#facc15","#a78bfa","#34d399","#ffffff"][i % 5],
      opacity: 0,
    }));

    const waveEls = waveData.map(() => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      el.setAttribute("fill", "none");
      el.setAttribute("stroke-width", "1");
      el.setAttribute("pointer-events", "none");
      scalarGroup.node().appendChild(el);
      return el;
    });

    // ── Atomic orbital particles ──
    const atomGroup = g.append("g").attr("class", "atoms");
    const NUM_ATOMS = 50;
    const atomData = Array.from({ length: NUM_ATOMS }, (_, i) => ({
      nodeIdx: i % nodes.length,
      angle: Math.random() * Math.PI * 2,
      orbitR: 45 + Math.random() * 30,
      speed: (0.02 + Math.random() * 0.04) * (Math.random() < 0.5 ? 1 : -1),
      color: ["#ffffff","#38bdf8","#facc15","#f472b6","#4ade80"][i % 5],
      size: 2 + Math.random() * 2.5,
      tilt: Math.random() * Math.PI,
    }));

    const atomEls = atomData.map(a => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      el.setAttribute("r", a.size);
      el.setAttribute("fill", a.color);
      el.setAttribute("filter", "url(#linkGlow)");
      el.setAttribute("pointer-events", "none");
      atomGroup.node().appendChild(el);
      return el;
    });

    // ── Light bulb flash bursts ──
    const flashGroup = g.append("g").attr("class", "flashes");
    const NUM_FLASHES = 20;
    const flashData = Array.from({ length: NUM_FLASHES }, (_, i) => ({
      nodeIdx: Math.floor(Math.random() * nodes.length),
      timer: Math.random() * 120,
      interval: 60 + Math.floor(Math.random() * 120),
      r: 0,
      maxR: 30 + Math.random() * 40,
      active: false,
      color: ["#ffffff","#facc15","#38bdf8"][i % 3],
    }));

    const flashEls = flashData.map(f => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      el.setAttribute("fill", "none");
      el.setAttribute("stroke-width", "2");
      el.setAttribute("pointer-events", "none");
      flashGroup.node().appendChild(el);
      return el;
    });

    // ── Combined RAF ──
    let rafId2;
    const animateExtras = () => {
      // Scalar waves
      for (let i = 0; i < waveData.length; i++) {
        const w = waveData[i];
        const nd = nodes[w.nodeIdx];
        if (!nd?.x) continue;
        w.r += w.speed;
        if (w.r > w.maxR) {
          w.r = 0;
          w.nodeIdx = Math.floor(Math.random() * nodes.length);
        }
        const prog = w.r / w.maxR;
        const op = (1 - prog) * 0.55;
        waveEls[i].setAttribute("cx", nd.x);
        waveEls[i].setAttribute("cy", nd.y);
        waveEls[i].setAttribute("r", w.r);
        waveEls[i].setAttribute("stroke", w.color);
        waveEls[i].setAttribute("stroke-opacity", op);
        waveEls[i].setAttribute("stroke-dasharray", `${4 + w.r * 0.15} ${6 + w.r * 0.1}`);
      }

      // Atomic orbitals
      for (let i = 0; i < atomData.length; i++) {
        const a = atomData[i];
        const nd = nodes[a.nodeIdx];
        if (!nd?.x) continue;
        a.angle += a.speed;
        // Elliptical orbit (tilted)
        const ex = Math.cos(a.angle) * a.orbitR;
        const ey = Math.sin(a.angle) * a.orbitR * 0.45;
        const rx = ex * Math.cos(a.tilt) - ey * Math.sin(a.tilt);
        const ry = ex * Math.sin(a.tilt) + ey * Math.cos(a.tilt);
        atomEls[i].setAttribute("cx", nd.x + rx);
        atomEls[i].setAttribute("cy", nd.y + ry);
        // Fade based on "depth"
        const depth = (Math.sin(a.angle) + 1) / 2;
        atomEls[i].setAttribute("opacity", 0.4 + depth * 0.6);
        atomEls[i].setAttribute("r", a.size * (0.6 + depth * 0.6));
      }

      // Flash bursts
      for (let i = 0; i < flashData.length; i++) {
        const f = flashData[i];
        const nd = nodes[f.nodeIdx];
        if (!nd?.x) { f.timer--; continue; }
        f.timer--;
        if (f.timer <= 0) {
          f.active = true;
          f.r = 0;
          f.timer = f.interval;
          f.nodeIdx = Math.floor(Math.random() * nodes.length);
        }
        if (f.active) {
          f.r += 2.5;
          if (f.r >= f.maxR) { f.active = false; f.r = 0; }
          const op = (1 - f.r / f.maxR) * 0.9;
          flashEls[i].setAttribute("cx", nd.x);
          flashEls[i].setAttribute("cy", nd.y);
          flashEls[i].setAttribute("r", f.r);
          flashEls[i].setAttribute("stroke", f.color);
          flashEls[i].setAttribute("stroke-opacity", op);
          flashEls[i].setAttribute("filter", "url(#linkGlowOuter)");
        } else {
          flashEls[i].setAttribute("stroke-opacity", 0);
        }
      }

      rafId2 = requestAnimationFrame(animateExtras);
    };

    setTimeout(() => { rafId2 = requestAnimationFrame(animateExtras); }, 1000);

    // ── Tick ──
    simRef.current.on("tick", () => {
      g.selectAll("line.base, line.electric-halo, line.electric")
        .attr("x1", d => d.source?.x ?? 0)
        .attr("y1", d => d.source?.y ?? 0)
        .attr("x2", d => d.target?.x ?? 0)
        .attr("y2", d => d.target?.y ?? 0);

      linkLabel
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2 - 4);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simRef.current?.stop();
      if (rafId) cancelAnimationFrame(rafId);
      if (rafId2) cancelAnimationFrame(rafId2);
    };
  }, []);

  // ── Update selected highlight ──
  useEffect(() => {
    if (!svgRef.current) return;
    const glowFilters = {
      physics: "url(#glow-blue)", biology: "url(#glow-green)", weapons: "url(#glow-red)",
      consciousness: "url(#glow-purple)", history: "url(#glow-amber)", philosophy: "url(#glow-cyan)"
    };
    const svg = d3.select(svgRef.current);
    svg.selectAll("g.node").each(function(d) {
      if (!d) return;
      const isSelected = d.id === selectedNodeId;
      const grp = d3.select(this);
      grp.select(".main-circle")
        .attr("stroke-width", isSelected ? 3 : 1.5)
        .attr("filter", isSelected ? (glowFilters[d.group] || null) : null);
      grp.select(".ring")
        .attr("stroke-opacity", isSelected ? 0.85 : 0.3)
        .attr("stroke-width", isSelected ? 2 : 1);
    });
  }, [selectedNodeId]);

  return <svg ref={svgRef} className="w-full h-full" />;
}