import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { businessItems } from "../lib/businessItems";
import { X, Lock, DollarSign, AlertCircle } from "lucide-react";

// Build theoretical connections between items
const buildConnections = () => {
  const connections = [];
  const itemMap = new Map(businessItems.map((item, idx) => [idx, item]));

  // Connect items by category and thematic relevance
  businessItems.forEach((item, i) => {
    businessItems.forEach((other, j) => {
      if (i >= j) return;

      let strength = 0;
      let label = "";

      // Same category → strong connection
      if (item.category === other.category) {
        strength = 0.8;
        label = "Same Domain";
      }

      // Related theoretical frameworks
      if (
        (item.title.includes("Bearden") && other.title.includes("Bearden")) ||
        (item.title.includes("scalar") && other.title.includes("scalar")) ||
        (item.title.includes("EM") && other.title.includes("EM"))
      ) {
        strength = 0.6;
        label = "Theoretical Link";
      }

      // Medical/biological connections
      if (
        (item.category === "Invention" &&
          other.category === "Invention" &&
          (item.title.includes("Telomere") ||
            item.title.includes("Device") ||
            item.title.includes("Therapy"))) ||
        (other.title.includes("Telomere") ||
          other.title.includes("Therapy") ||
          other.title.includes("biological"))
      ) {
        strength = 0.5;
        label = "Biomedical Framework";
      }

      if (strength > 0) {
        connections.push({
          source: i,
          target: j,
          strength,
          label,
        });
      }
    });
  });

  return connections;
};

export default function BusinessItemsGraph() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Prepare data
  const nodes = businessItems.map((item, idx) => ({
    id: idx,
    label: item.title,
    category: item.category,
    price: item.price,
    restricted: item.restricted,
    restrictionReason: item.restrictionReason,
    color: item.color || "#6b7280",
  }));

  const links = buildConnections();

  useEffect(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    setDimensions({ width, height });
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const { width, height } = dimensions;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    // Create simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance((d) => 150 / d.strength)
          .strength(0.1)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    const svg = d3.select(svgRef.current);

    // Background
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .attr("class", "bg-click");

    // Links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#4b5563")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", (d) => d.strength * 3)
      .attr("stroke-dasharray", (d) =>
        d.strength > 0.7 ? "0" : "5,5"
      );

    // Nodes
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => (d.restricted ? 20 : 15))
      .attr("fill", (d) => d.color)
      .attr("fill-opacity", (d) => (d.restricted ? 0.6 : 0.8))
      .attr("stroke", (d) => (d.restricted ? "#ef4444" : "#6b7280"))
      .attr("stroke-width", (d) => (d.restricted ? 2 : 1))
      .attr("class", "cursor-pointer hover:opacity-100 transition-opacity")
      .on("click", (e, d) => {
        e.stopPropagation();
        setSelectedItem(businessItems[d.id]);
        simulation.alpha(0.3).restart();
      })
      .call(
        d3
          .drag()
          .on("start", (e, d) => {
            if (!e.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (e, d) => {
            d.fx = e.x;
            d.fy = e.y;
          })
          .on("end", (e, d) => {
            if (!e.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Labels (hidden, shown on hover)
    const labels = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#fff")
      .attr("fill-opacity", 0)
      .attr("pointer-events", "none")
      .text((d) => d.label.substring(0, 20) + (d.label.length > 20 ? "..." : ""));

    node.on("mouseenter", () => {
      labels.attr("fill-opacity", 0.8);
    }).on("mouseleave", () => {
      labels.attr("fill-opacity", 0);
    });

    // Update positions
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });

    // Zoom
    svg.call(
      d3
        .zoom()
        .scaleExtent([0.5, 5])
        .on("zoom", (e) => {
          svg.select("g").attr("transform", e.transform);
        })
    );

    return () => simulation.stop();
  }, [dimensions]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 bg-gray-950 overflow-hidden"
    >
      <svg ref={svgRef} className="w-full h-full" />

      {/* Side panel */}
      {selectedItem && (
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gray-900 border-l border-gray-800 shadow-2xl overflow-y-auto z-30 animate-in slide-in-from-right">
          <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
            <h3 className="text-white font-black text-sm">{selectedItem.category}</h3>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-white font-black text-lg leading-tight mb-2">
                {selectedItem.title}
              </h2>
              <p className="text-cyan-400 text-xs font-bold">{selectedItem.tagline}</p>
            </div>

            {/* Restricted badge */}
            {selectedItem.restricted && (
              <div className="bg-red-950/40 border border-red-800/60 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-300 text-xs font-bold">Patent Review Required</p>
                  <p className="text-red-200/60 text-xs mt-1">{selectedItem.restrictionReason}</p>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-yellow-500" />
              <span className="text-white font-bold text-lg">{selectedItem.price}</span>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-400 text-xs leading-relaxed">
                {selectedItem.description || "No description available."}
              </p>
            </div>

            {/* Audience */}
            {selectedItem.audience && (
              <div>
                <p className="text-gray-400 text-xs font-bold mb-2">Target Audience</p>
                <p className="text-gray-500 text-xs">{selectedItem.audience}</p>
              </div>
            )}

            {/* CTA */}
            <button className="w-full py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-colors">
              {selectedItem.restricted ? "Request Access" : "Learn More"}
            </button>
          </div>
        </div>
      )}

      {/* Info overlay */}
      {!selectedItem && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/80 border border-gray-700 rounded-lg px-4 py-2 text-gray-400 text-xs pointer-events-none">
          Click any node to view details · Drag to move · Scroll to zoom
        </div>
      )}
    </div>
  );
}