import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import * as d3 from "d3";
import { ArrowLeft, ZoomIn, ZoomOut, Maximize2, Filter, Info, AlertTriangle, CheckCircle2, XCircle, HelpCircle, Target } from "lucide-react";
import { PRIOR_ART_ARCHIVE } from "../lib/priorArtData";

// ── Build graph data from prior art ─────────────────────────────────────────

function buildGraphData(filter) {
  const nodes = [];
  const links = [];
  const nodeMap = new Map();

  const addNode = (n) => { if (!nodeMap.has(n.id)) { nodeMap.set(n.id, n); nodes.push(n); } };

  // Category nodes (hub)
  const categories = [...new Set(PRIOR_ART_ARCHIVE.map(e => e.category))];
  categories.forEach(cat => {
    addNode({ id: `cat_${cat}`, label: cat, type: "category", size: 28, color: CAT_COLORS[cat] || "#6b7280" });
  });

  const entries = filter === "All" ? PRIOR_ART_ARCHIVE : PRIOR_ART_ARCHIVE.filter(e => e.category === filter);

  entries.forEach(entry => {
    // Inventor node
    const invId = `inv_${entry.inventor.replace(/\s+/g, "_")}`;
    if (!nodeMap.has(invId)) {
      addNode({ id: invId, label: entry.inventor, type: "inventor", size: 20, color: "#818cf8" });
    }
    links.push({ source: invId, target: `cat_${entry.category}`, type: "worked_in", strength: 0.3 });

    // Prior art (invention) node
    addNode({
      id: entry.id,
      label: entry.title.length > 38 ? entry.title.slice(0, 36) + "…" : entry.title,
      fullTitle: entry.title,
      type: "invention",
      outcome: entry.outcome,
      riskScore: entry.risk_score,
      size: 16,
      color: OUTCOME_NODE_COLORS[entry.outcome] || "#6b7280",
      entry,
    });
    links.push({ source: invId, target: entry.id, type: "invented", strength: 0.6 });
    links.push({ source: `cat_${entry.category}`, target: entry.id, type: "category_of", strength: 0.2 });

    // Key claim nodes
    (entry.key_claims || []).slice(0, 3).forEach((claim, i) => {
      const claimId = `${entry.id}_claim_${i}`;
      addNode({ id: claimId, label: claim.length > 35 ? claim.slice(0, 33) + "…" : claim, fullLabel: claim, type: "claim", size: 10, color: "#34d399", entry: entry.id });
      links.push({ source: entry.id, target: claimId, type: "claims", strength: 0.9 });
    });

    // Failure point nodes
    if (entry.failure_reasons && entry.failure_reasons !== "N/A — patent granted") {
      const failId = `${entry.id}_fail`;
      const short = entry.failure_reasons.length > 40 ? entry.failure_reasons.slice(0, 38) + "…" : entry.failure_reasons;
      addNode({ id: failId, label: short, fullLabel: entry.failure_reasons, type: "failure", size: 11, color: "#f87171", entry: entry.id });
      links.push({ source: entry.id, target: failId, type: "failed_because", strength: 0.85 });
    }

    // Rejection grounds node
    if (entry.rejection_grounds && !entry.rejection_grounds.startsWith("N/A")) {
      const rejId = `${entry.id}_rej`;
      const short = entry.rejection_grounds.length > 40 ? entry.rejection_grounds.slice(0, 38) + "…" : entry.rejection_grounds;
      addNode({ id: rejId, label: short, fullLabel: entry.rejection_grounds, type: "rejection", size: 11, color: "#fb923c", entry: entry.id });
      links.push({ source: entry.id, target: rejId, type: "rejected_on", strength: 0.85 });
    }
  });

  return { nodes, links };
}

const CAT_COLORS = {
  "Vacuum Energy": "#a78bfa",
  "Scalar EM": "#60a5fa",
  "Bioelectromagnetics": "#34d399",
  "Phase Conjugation": "#f472b6",
  "Resonance Devices": "#fbbf24",
  "Free Energy": "#f87171",
  "Tesla Technology": "#38bdf8",
  "Atmospheric EM": "#818cf8",
  "Other": "#6b7280",
};

const OUTCOME_NODE_COLORS = {
  "Patent Granted": "#22c55e",
  "Success (demonstrated)": "#4ade80",
  "Partial Success": "#facc15",
  "Suppressed": "#ef4444",
  "Failed": "#6b7280",
  "Patent Denied": "#f97316",
  "Unknown": "#c084fc",
};

const NODE_TYPE_ICONS = { category: "🗂", inventor: "👤", invention: "⚗️", claim: "📌", failure: "⚠️", rejection: "❌" };

const LEGEND = [
  { color: "#818cf8", label: "Inventor" },
  { color: "#a78bfa", label: "Category Hub" },
  { color: "#22c55e", label: "Patent Granted" },
  { color: "#facc15", label: "Partial Success" },
  { color: "#ef4444", label: "Suppressed" },
  { color: "#c084fc", label: "Unknown" },
  { color: "#34d399", label: "Claim" },
  { color: "#f87171", label: "Failure Point" },
  { color: "#fb923c", label: "Rejection Ground" },
];

// ── Gap analysis ──────────────────────────────────────────────────────────────
function detectGaps(entries) {
  const gaps = [];
  const byCat = {};
  entries.forEach(e => { (byCat[e.category] = byCat[e.category] || []).push(e); });
  Object.entries(byCat).forEach(([cat, items]) => {
    const granted = items.filter(i => i.outcome === "Patent Granted").length;
    const suppressed = items.filter(i => i.outcome === "Suppressed").length;
    const avgRisk = Math.round(items.reduce((s, i) => s + (i.risk_score || 0), 0) / items.length);
    if (granted === 0 && items.length >= 2) {
      gaps.push({ cat, type: "No granted patents", severity: "high", count: items.length, suppressed, avgRisk, desc: `${items.length} inventions, 0 granted — large white space opportunity` });
    } else if (suppressed > granted) {
      gaps.push({ cat, type: "Suppression dominant", severity: "medium", count: items.length, suppressed, avgRisk, desc: `${suppressed} suppressed vs ${granted} granted — high-risk but validated territory` });
    }
    // Claim overlap gaps — claims that appear in multiple inventions but none granted
    const claimWords = items.flatMap(i => (i.key_claims || []).flatMap(c => c.toLowerCase().split(/\s+/)));
    const freq = {};
    claimWords.forEach(w => { if (w.length > 5) freq[w] = (freq[w] || 0) + 1; });
    const hotClaims = Object.entries(freq).filter(([, v]) => v >= 3).map(([k]) => k);
    if (hotClaims.length > 0 && granted === 0) {
      gaps.push({ cat, type: "Contested claim territory", severity: "medium", count: hotClaims.length, desc: `Recurring terms: ${hotClaims.slice(0, 4).join(", ")} — no granted patents cover these` });
    }
  });
  return gaps;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function PatentLandscapeGraph() {
  const svgRef = useRef(null);
  const simRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [catFilter, setCatFilter] = useState("All");
  const [showLegend, setShowLegend] = useState(true);
  const [showGaps, setShowGaps] = useState(false);
  const [nodeTypeFilter, setNodeTypeFilter] = useState(new Set(["category", "inventor", "invention", "claim", "failure", "rejection"]));

  const cats = ["All", ...Object.keys(CAT_COLORS)];
  const gaps = useMemo(() => detectGaps(PRIOR_ART_ARCHIVE), []);

  const { nodes: rawNodes, links: rawLinks } = useMemo(() => buildGraphData(catFilter), [catFilter]);

  const nodes = useMemo(() => rawNodes.filter(n => nodeTypeFilter.has(n.type)), [rawNodes, nodeTypeFilter]);
  const links = useMemo(() => {
    const nodeIds = new Set(nodes.map(n => n.id));
    return rawLinks.filter(l => nodeIds.has(l.source?.id || l.source) && nodeIds.has(l.target?.id || l.target));
  }, [rawLinks, nodes]);

  const toggleType = (t) => setNodeTypeFilter(prev => {
    const next = new Set(prev);
    next.has(t) ? next.delete(t) : next.add(t);
    return next;
  });

  useEffect(() => {
    if (!svgRef.current) return;
    const el = svgRef.current;
    const W = el.clientWidth || 900;
    const H = el.clientHeight || 700;

    d3.select(el).selectAll("*").remove();

    const svg = d3.select(el)
      .attr("width", W)
      .attr("height", H);

    const g = svg.append("g");

    const zoom = d3.zoom().scaleExtent([0.15, 3]).on("zoom", e => g.attr("transform", e.transform));
    svg.call(zoom);

    // Arrow markers
    const defs = svg.append("defs");
    ["claims", "invented", "failed_because", "rejected_on"].forEach(type => {
      defs.append("marker").attr("id", `arrow_${type}`).attr("viewBox", "0 -5 10 10").attr("refX", 18).attr("refY", 0)
        .attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto")
        .append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#374151");
    });

    const nodesCopy = nodes.map(d => ({ ...d }));
    const nodeById = new Map(nodesCopy.map(n => [n.id, n]));
    const linksCopy = links.map(l => ({
      ...l,
      source: nodeById.get(l.source?.id || l.source) || l.source,
      target: nodeById.get(l.target?.id || l.target) || l.target,
    })).filter(l => l.source && l.target);

    const sim = d3.forceSimulation(nodesCopy)
      .force("link", d3.forceLink(linksCopy).id(d => d.id).distance(d => d.type === "claims" || d.type === "failed_because" || d.type === "rejected_on" ? 70 : 130).strength(d => d.strength || 0.5))
      .force("charge", d3.forceManyBody().strength(d => d.type === "category" ? -400 : d.type === "inventor" ? -200 : -80))
      .force("center", d3.forceCenter(W / 2, H / 2))
      .force("collision", d3.forceCollide().radius(d => d.size + 8));

    simRef.current = sim;

    // Links
    const link = g.append("g").selectAll("line").data(linksCopy).join("line")
      .attr("stroke", d => d.type === "claims" ? "#34d39940" : d.type === "failed_because" ? "#f8717140" : d.type === "rejected_on" ? "#fb923c40" : "#37415180")
      .attr("stroke-width", d => d.type === "invented" ? 2 : 1)
      .attr("stroke-dasharray", d => d.type === "category_of" ? "4,3" : null)
      .attr("marker-end", d => ["claims", "invented", "failed_because", "rejected_on"].includes(d.type) ? `url(#arrow_${d.type})` : null);

    // Nodes
    const node = g.append("g").selectAll("g").data(nodesCopy).join("g")
      .attr("cursor", "pointer")
      .call(d3.drag()
        .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on("end", (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }))
      .on("click", (e, d) => { e.stopPropagation(); setSelected(d); });

    node.append("circle")
      .attr("r", d => d.size)
      .attr("fill", d => d.color + "cc")
      .attr("stroke", d => d.color)
      .attr("stroke-width", 1.5);

    // Risk ring for inventions
    node.filter(d => d.type === "invention" && d.riskScore > 60).append("circle")
      .attr("r", d => d.size + 4)
      .attr("fill", "none")
      .attr("stroke", "#ef444460")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,2");

    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", d => d.size + 11)
      .attr("font-size", d => d.type === "category" ? 10 : 8)
      .attr("fill", "#9ca3af")
      .text(d => d.label);

    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", d => d.type === "category" ? 13 : 9)
      .text(d => NODE_TYPE_ICONS[d.type] || "");

    svg.on("click", () => setSelected(null));

    sim.on("tick", () => {
      link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Zoom controls
    el._zoomIn = () => svg.transition().call(zoom.scaleBy, 1.4);
    el._zoomOut = () => svg.transition().call(zoom.scaleBy, 0.7);
    el._reset = () => svg.transition().call(zoom.transform, d3.zoomIdentity.translate(W / 2, H / 2).scale(0.6));

    return () => sim.stop();
  }, [nodes, links]);

  return (
    <div className="w-screen h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <Link to="/prior-art" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Prior Art
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base tracking-tight">Patent Landscape Graph</h1>
            <p className="text-gray-500 text-xs">Inventor claims · Prior art · Failure points · Gap analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Node type toggles */}
          {["claim", "failure", "rejection"].map(t => (
            <button key={t} onClick={() => toggleType(t)}
              className={`text-xs px-2.5 py-1 rounded-full border font-semibold transition-all ${nodeTypeFilter.has(t) ? "border-gray-500 text-white bg-gray-700" : "border-gray-700 text-gray-600"}`}>
              {NODE_TYPE_ICONS[t]} {t}s
            </button>
          ))}
          <button onClick={() => setShowGaps(s => !s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${showGaps ? "bg-yellow-900/40 border-yellow-600 text-yellow-300" : "border-gray-700 text-gray-500 hover:border-gray-500"}`}>
            <Target size={12} /> Gaps ({gaps.length})
          </button>
          <button onClick={() => setShowLegend(s => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 text-xs hover:border-gray-500 transition-all">
            <Info size={12} /> Legend
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="px-4 py-2 border-b border-gray-800 flex gap-1.5 overflow-x-auto flex-shrink-0">
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className="flex-shrink-0 text-xs px-3 py-1 rounded-full border transition-all"
            style={catFilter === c
              ? { backgroundColor: (CAT_COLORS[c] || "#6b7280") + "30", borderColor: CAT_COLORS[c] || "#6b7280", color: CAT_COLORS[c] || "#fff" }
              : { borderColor: "#374151", color: "#6b7280" }}>
            {c}
          </button>
        ))}
      </div>

      {/* Main canvas area */}
      <div className="flex-1 relative overflow-hidden">
        <svg ref={svgRef} className="w-full h-full" />

        {/* Zoom controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-1">
          {[
            [<ZoomIn size={14} />, () => svgRef.current?._zoomIn()],
            [<ZoomOut size={14} />, () => svgRef.current?._zoomOut()],
            [<Maximize2 size={14} />, () => svgRef.current?._reset()],
          ].map(([icon, fn], i) => (
            <button key={i} onClick={fn}
              className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 flex items-center justify-center transition-all">
              {icon}
            </button>
          ))}
        </div>

        {/* Stats overlay */}
        <div className="absolute bottom-4 left-4 text-xs text-gray-600 space-y-0.5">
          <p>{nodes.length} nodes · {links.length} links</p>
          <p className="text-gray-700">Drag nodes · Scroll to zoom · Click to inspect</p>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="absolute top-4 left-4 bg-gray-900/95 border border-gray-700 rounded-xl p-3 w-48">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">Legend</p>
            <div className="space-y-1.5">
              {LEGEND.map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-gray-400 text-xs">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-red-500 flex-shrink-0" />
                <span className="text-gray-500 text-xs">High risk halo (risk &gt;60)</span>
              </div>
            </div>
          </div>
        )}

        {/* Gap analysis panel */}
        {showGaps && (
          <div className="absolute top-4 right-14 bg-gray-900/97 border border-yellow-900/50 rounded-xl p-4 w-80 max-h-96 overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <Target size={14} className="text-yellow-400" />
              <p className="text-yellow-300 font-bold text-sm">Patent Landscape Gaps</p>
            </div>
            <p className="text-gray-500 text-xs mb-3">Areas with no granted patents — potential white space for new filings</p>
            <div className="space-y-3">
              {gaps.map((gap, i) => (
                <div key={i} className={`rounded-lg p-3 border ${gap.severity === "high" ? "bg-red-950/30 border-red-900/50" : "bg-yellow-950/30 border-yellow-900/50"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold ${gap.severity === "high" ? "text-red-300" : "text-yellow-300"}`}>{gap.type}</span>
                  </div>
                  <p className="text-gray-300 text-xs font-semibold">{gap.cat}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{gap.desc}</p>
                  {gap.avgRisk && <p className="text-xs mt-1 text-gray-600">Avg risk score: <span className="text-orange-400">{gap.avgRisk}</span></p>}
                  <button
                    onClick={() => { setCatFilter(gap.cat); setShowGaps(false); }}
                    className="mt-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    → Filter to this category
                  </button>
                </div>
              ))}
              {gaps.length === 0 && <p className="text-gray-500 text-xs">No major gaps detected.</p>}
            </div>
          </div>
        )}

        {/* Node detail panel */}
        {selected && (
          <div className="absolute bottom-4 right-4 bg-gray-900 border border-gray-700 rounded-xl p-4 w-80 max-h-80 overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{NODE_TYPE_ICONS[selected.type]}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: (selected.color || "#6b7280") + "30", color: selected.color || "#9ca3af" }}>
                  {selected.type}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-600 hover:text-white text-lg leading-none">×</button>
            </div>
            <h3 className="text-white font-bold text-sm leading-snug mb-2">{selected.fullTitle || selected.fullLabel || selected.label}</h3>

            {selected.entry && typeof selected.entry === "object" && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Inventor:</span>
                  <span className="text-gray-300">{selected.entry.inventor}</span>
                  <span className="text-gray-600">·</span>
                  <span className="text-gray-400">{selected.entry.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Outcome:</span>
                  <span style={{ color: OUTCOME_NODE_COLORS[selected.entry.outcome] || "#9ca3af" }} className="font-bold">{selected.entry.outcome}</span>
                </div>
                {selected.riskScore && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Risk score:</span>
                    <span className={`font-bold ${selected.riskScore >= 70 ? "text-red-400" : selected.riskScore >= 40 ? "text-yellow-400" : "text-green-400"}`}>
                      {selected.riskScore}/100
                    </span>
                  </div>
                )}
                <p className="text-gray-400 leading-relaxed">{selected.entry.description}</p>
                {selected.entry.failure_reasons && selected.entry.failure_reasons !== "N/A — patent granted" && (
                  <div className="bg-red-950/30 border border-red-900/40 rounded-lg p-2">
                    <p className="text-red-400 font-bold mb-0.5">⚠ Failure</p>
                    <p className="text-gray-400">{selected.entry.failure_reasons}</p>
                  </div>
                )}
                {selected.entry.rejection_grounds && !selected.entry.rejection_grounds.startsWith("N/A") && (
                  <div className="bg-orange-950/30 border border-orange-900/40 rounded-lg p-2">
                    <p className="text-orange-400 font-bold mb-0.5">❌ Rejection grounds</p>
                    <p className="text-gray-400">{selected.entry.rejection_grounds}</p>
                  </div>
                )}
                {(selected.entry.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selected.entry.tags.map((t, i) => <span key={i} className="bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">{t}</span>)}
                  </div>
                )}
              </div>
            )}
            {selected.type === "claim" && (
              <p className="text-green-300 text-xs">📌 Active claim from prior art — check for overlap with your application</p>
            )}
            {selected.type === "failure" && (
              <p className="text-red-300 text-xs leading-relaxed">⚠ Document how your invention avoids this failure mode in your disclosure.</p>
            )}
            {selected.type === "rejection" && (
              <p className="text-orange-300 text-xs leading-relaxed">❌ USPTO rejection precedent — address this ground proactively in your claims.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}