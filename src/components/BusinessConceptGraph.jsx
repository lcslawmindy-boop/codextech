import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { businessItems } from "../lib/businessItems";

// ── Build graph data ──────────────────────────────────────────────────────────

const CATEGORY_COLORS = {
  "Course":    "#3b82f6",
  "Book/PDF":  "#f59e0b",
  "Product":   "#06b6d4",
  "Invention": "#ef4444",
  "Service":   "#6b7280",
  "Principle": "#a855f7",
};

// Core Bearden principles extracted as hub nodes
const PRINCIPLES = [
  { id: "p_scalar_em",    label: "Scalar EM",          group: "Principle" },
  { id: "p_anenergy",     label: "Anenergy Pump",       group: "Principle" },
  { id: "p_energy_bottle",label: "Energy Bottle",       group: "Principle" },
  { id: "p_kindling",     label: "Kindling Effect",     group: "Principle" },
  { id: "p_vacuum",       label: "Vacuum Structure",    group: "Principle" },
  { id: "p_kaznacheyev",  label: "Kaznacheyev Effect",  group: "Principle" },
  { id: "p_gravitobio",   label: "Gravitobiology",      group: "Principle" },
  { id: "p_vectors",      label: "4-Vector Taxonomy",   group: "Principle" },
  { id: "p_negentropy",   label: "Negentropy",          group: "Principle" },
  { id: "p_moray",        label: "Moray Effect",        group: "Principle" },
  { id: "p_whittaker",    label: "Whittaker Waves",     group: "Principle" },
  { id: "p_biofield",     label: "Biofield / EM Trigger",group: "Principle" },
  { id: "p_consciousness",label: "Consciousness / T-field", group: "Principle" },
];

// Keyword → principle mapping for auto-linking
const KEYWORD_MAP = [
  ["scalar", "p_scalar_em"], ["maxwell", "p_scalar_em"], ["phi-field", "p_scalar_em"],
  ["anenergy", "p_anenergy"], ["moray", "p_moray"],
  ["energy bottle", "p_energy_bottle"], ["longitudinal", "p_energy_bottle"],
  ["kindling", "p_kindling"], ["cytopathogenic", "p_kaznacheyev"], ["kaznacheyev", "p_kaznacheyev"],
  ["vacuum", "p_vacuum"], ["dirac", "p_vacuum"], ["zero-point", "p_vacuum"],
  ["gravitobio", "p_gravitobio"], ["graviton", "p_gravitobio"],
  ["vector", "p_vectors"],
  ["negentropy", "p_negentropy"], ["entropy", "p_negentropy"],
  ["whittaker", "p_whittaker"], ["quantum potential", "p_whittaker"], ["phase conjugate", "p_whittaker"],
  ["biofield", "p_biofield"], ["trigger window", "p_biofield"], ["rife", "p_biofield"], ["frequency", "p_biofield"],
  ["consciousness", "p_consciousness"], ["mind", "p_consciousness"], ["bioframe", "p_consciousness"],
];

function buildGraph() {
  const nodes = [
    ...PRINCIPLES.map(p => ({ ...p, type: "principle", radius: 18 })),
    ...businessItems.map((item, i) => ({
      id: `b_${i}`,
      label: item.title.length > 30 ? item.title.slice(0, 28) + "…" : item.title,
      fullTitle: item.title,
      group: item.category,
      type: "business",
      item,
      radius: 10,
    })),
  ];

  const links = [];
  const seen = new Set();

  businessItems.forEach((item, i) => {
    const searchText = [item.title, item.description, item.tagline, item.source, ...(item.modules || [])]
      .join(" ").toLowerCase();
    KEYWORD_MAP.forEach(([kw, principleId]) => {
      if (searchText.includes(kw)) {
        const key = `b_${i}::${principleId}`;
        if (!seen.has(key)) {
          seen.add(key);
          links.push({ source: `b_${i}`, target: principleId, strength: 0.3 });
        }
      }
    });
  });

  return { nodes, links };
}

const { nodes: GRAPH_NODES, links: GRAPH_LINKS } = buildGraph();

// ── Detail panel ──────────────────────────────────────────────────────────────

function DetailPanel({ node, onClose }) {
  const [expanded, setExpanded] = useState(false);
  if (!node) return null;
  const isPrinciple = node.type === "principle";
  const item = node.item;
  const color = CATEGORY_COLORS[node.group] || "#6b7280";

  // Count connections
  const connections = GRAPH_LINKS.filter(l =>
    l.source === node.id || l.target === node.id ||
    l.source?.id === node.id || l.target?.id === node.id
  ).length;

  return (
    <div className="absolute top-4 right-4 w-80 max-h-[calc(100vh-5rem)] overflow-y-auto bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-20 flex flex-col">
      <div className="flex items-start justify-between p-4 border-b border-gray-700 sticky top-0 bg-gray-900 rounded-t-xl">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color }}>{node.group}</span>
            <span className="text-xs text-gray-600">· {connections} links</span>
          </div>
          <h2 className="text-white font-bold text-base leading-snug">{node.fullTitle || node.label}</h2>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white flex-shrink-0"><X size={16} /></button>
      </div>

      <div className="p-4 space-y-3">
        {isPrinciple ? (
          <div className="text-gray-400 text-sm">
            Core Bearden theoretical principle. Click connected business nodes to see derivative products and courses built on this concept.
          </div>
        ) : item ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-green-400 font-bold text-lg">{item.price}</span>
              <span className="text-xs text-gray-500">{item.audience?.split(",")[0]}</span>
            </div>
            <p className="text-gray-400 text-xs italic">"{item.tagline}"</p>
            <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>

            {item.modules?.length > 0 && (
              <>
                <button
                  onClick={() => setExpanded(e => !e)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {item.modules.length} modules
                </button>
                {expanded && (
                  <ol className="list-decimal list-inside space-y-1 pl-1">
                    {item.modules.map((m, i) => (
                      <li key={i} className="text-gray-500 text-xs">{m}</li>
                    ))}
                  </ol>
                )}
              </>
            )}

            <p className="text-gray-600 text-xs border-t border-gray-800 pt-3">
              <span className="text-gray-500 font-semibold">Source: </span>{item.source}
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const ALL_CATEGORIES = ["All", "Principle", "Course", "Book/PDF", "Product", "Invention", "Service"];

export default function BusinessConceptGraph() {
  const svgRef = useRef(null);
  const simRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredId, setHoveredId] = useState(null);

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node);
  }, []);

  useEffect(() => {
    const container = svgRef.current.parentElement;
    const W = container.clientWidth;
    const H = container.clientHeight;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", W).attr("height", H);

    const g = svg.append("g");

    svg.call(d3.zoom().scaleExtent([0.2, 3]).on("zoom", e => g.attr("transform", e.transform)));

    // Filter nodes
    const visibleGroups = new Set(activeFilter === "All" ? ALL_CATEGORIES : ["Principle", activeFilter]);
    const visibleNodes = GRAPH_NODES.filter(n => visibleGroups.has(n.group));
    const visibleIds = new Set(visibleNodes.map(n => n.id));
    const visibleLinks = GRAPH_LINKS.filter(l => visibleIds.has(l.source?.id ?? l.source) && visibleIds.has(l.target?.id ?? l.target));

    // Deep clone for simulation
    const nodes = visibleNodes.map(n => ({ ...n }));
    const links = visibleLinks.map(l => ({ ...l }));

    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(d => d.source.type === "principle" ? 120 : 80).strength(0.4))
      .force("charge", d3.forceManyBody().strength(d => d.type === "principle" ? -300 : -80))
      .force("center", d3.forceCenter(W / 2, H / 2))
      .force("collision", d3.forceCollide(d => d.radius + 6));

    simRef.current = sim;

    // Links
    const link = g.append("g").selectAll("line").data(links).join("line")
      .attr("stroke", "#374151").attr("stroke-width", 1).attr("stroke-opacity", 0.5);

    // Node groups
    const node = g.append("g").selectAll("g").data(nodes).join("g")
      .attr("cursor", "pointer")
      .call(d3.drag()
        .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on("end", (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
      )
      .on("click", (e, d) => { e.stopPropagation(); handleNodeClick(d); });

    // Circles
    node.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => (CATEGORY_COLORS[d.group] || "#6b7280") + (d.type === "principle" ? "33" : "22"))
      .attr("stroke", d => CATEGORY_COLORS[d.group] || "#6b7280")
      .attr("stroke-width", d => d.type === "principle" ? 2.5 : 1.5);

    // Labels
    node.append("text")
      .text(d => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", d => d.radius + 12)
      .attr("fill", "#9ca3af")
      .attr("font-size", d => d.type === "principle" ? "11px" : "9px")
      .attr("font-weight", d => d.type === "principle" ? "700" : "400")
      .attr("pointer-events", "none");

    // Icon for principles
    node.filter(d => d.type === "principle").append("text")
      .text("⬡")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", d => CATEGORY_COLORS[d.group] || "#6b7280")
      .attr("font-size", "14px")
      .attr("pointer-events", "none");

    // Tick
    sim.on("tick", () => {
      link
        .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Click background to deselect
    svg.on("click", () => setSelectedNode(null));

    return () => sim.stop();
  }, [activeFilter, handleNodeClick]);

  // Highlight selected node's ring
  useEffect(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).selectAll("circle")
      .attr("stroke-width", d =>
        d.id === selectedNode?.id ? 3.5 : d.type === "principle" ? 2.5 : 1.5
      )
      .attr("stroke-opacity", d => d.id === selectedNode?.id ? 1 : 0.8);
  }, [selectedNode]);

  const counts = {};
  ALL_CATEGORIES.forEach(c => {
    counts[c] = c === "All"
      ? businessItems.length + PRINCIPLES.length
      : c === "Principle"
      ? PRINCIPLES.length
      : businessItems.filter(i => i.category === c).length;
  });

  return (
    <div className="w-full h-full relative flex flex-col bg-gray-950">
      {/* Filter bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800 flex-wrap flex-shrink-0">
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveFilter(cat); setSelectedNode(null); }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border transition-colors ${
              activeFilter === cat
                ? "text-white border-transparent"
                : "bg-transparent text-gray-500 border-gray-700 hover:border-gray-500 hover:text-gray-300"
            }`}
            style={activeFilter === cat
              ? { backgroundColor: (CATEGORY_COLORS[cat] || "#6b7280") + "30", borderColor: CATEGORY_COLORS[cat] || "#6b7280", color: CATEGORY_COLORS[cat] || "white" }
              : {}}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] || "#6b7280" }} />
            {cat} <span className="text-gray-600">({counts[cat]})</span>
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-600">Drag · Scroll to zoom · Click node for details</span>
      </div>

      {/* Graph */}
      <div className="flex-1 relative overflow-hidden">
        <svg ref={svgRef} className="w-full h-full" />
        <DetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
      </div>
    </div>
  );
}