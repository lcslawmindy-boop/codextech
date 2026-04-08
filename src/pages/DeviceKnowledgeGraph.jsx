import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { Link } from "react-router-dom";
import { ArrowLeft, ZoomIn, ZoomOut, Maximize2, X, ExternalLink, RefreshCw } from "lucide-react";
import { GRAPH_NODES, GRAPH_LINKS, NODE_TYPES } from "../lib/deviceGraphData";

const LEGEND_ORDER = ['device', 'source', 'theory', 'gov_doc', 'person', 'market', 'patent'];

function DetailPanel({ node, onClose }) {
  if (!node) return null;
  const typeInfo = NODE_TYPES[node.type];

  return (
    <div className="absolute top-4 right-4 w-80 bg-gray-950 border rounded-2xl shadow-2xl z-30 overflow-hidden flex flex-col max-h-[calc(100vh-120px)]"
      style={{ borderColor: typeInfo.color + '55' }}>
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex-1 min-w-0 pr-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded mb-2 inline-block"
            style={{ backgroundColor: typeInfo.color + '22', color: typeInfo.color }}>
            {typeInfo.label}
          </span>
          <h3 className="text-white font-black text-sm leading-tight mt-1">{node.fullName || node.label}</h3>
          {node.stage && (
            <p className="text-gray-500 text-xs mt-1">Stage: {node.stage}</p>
          )}
          {node.investment && (
            <p className="text-xs mt-0.5" style={{ color: typeInfo.color }}>Investment: {node.investment}</p>
          )}
        </div>
        <button onClick={onClose}
          className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center flex-shrink-0 transition-colors">
          <X size={13} className="text-gray-400" />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1">
        <div className="p-4 space-y-4">
          {/* Summary */}
          <p className="text-gray-300 text-xs leading-relaxed">{node.summary}</p>

          {/* Key Facts */}
          {node.keyFacts?.length > 0 && (
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: typeInfo.color }}>Key Facts</p>
              <ul className="space-y-1.5">
                {node.keyFacts.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: typeInfo.color }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Market */}
          {node.market && (
            <div className="bg-green-950/30 border border-green-900/40 rounded-xl p-3">
              <p className="text-green-400 text-xs font-bold mb-1">Market Opportunity</p>
              <p className="text-green-200 text-xs">{node.market}</p>
            </div>
          )}

          {/* Cross-references */}
          <CrossReferences nodeId={node.id} nodeColor={typeInfo.color} />
        </div>
      </div>
    </div>
  );
}

function CrossReferences({ nodeId, nodeColor }) {
  const outgoing = GRAPH_LINKS.filter(l => l.source === nodeId || l.source?.id === nodeId);
  const incoming = GRAPH_LINKS.filter(l => l.target === nodeId || l.target?.id === nodeId);

  const getNode = (id) => GRAPH_NODES.find(n => n.id === (typeof id === 'object' ? id.id : id));

  if (outgoing.length === 0 && incoming.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-2">Cross-References</p>
      <div className="space-y-1">
        {outgoing.slice(0, 6).map((l, i) => {
          const target = getNode(l.target);
          if (!target) return null;
          const ttype = NODE_TYPES[target.type];
          return (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="text-gray-600 flex-shrink-0">→</span>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ttype?.color }} />
              <span className="text-gray-400 truncate">{target.label}</span>
              <span className="text-gray-700 text-xs flex-shrink-0 italic">{l.label}</span>
            </div>
          );
        })}
        {incoming.slice(0, 4).map((l, i) => {
          const src = getNode(l.source);
          if (!src) return null;
          const stype = NODE_TYPES[src.type];
          return (
            <div key={'in' + i} className="flex items-center gap-2 text-xs">
              <span className="text-gray-700 flex-shrink-0">←</span>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stype?.color }} />
              <span className="text-gray-500 truncate">{src.label}</span>
              <span className="text-gray-700 text-xs flex-shrink-0 italic">{l.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DeviceKnowledgeGraph() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const simRef = useRef(null);
  const zoomRef = useRef(null);

  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIds, setHighlightedIds] = useState(null);
  const [stats, setStats] = useState({ nodes: 0, links: 0 });

  const getVisibleNodes = useCallback(() => {
    let nodes = GRAPH_NODES;
    if (filterType !== 'all') nodes = nodes.filter(n => n.type === filterType);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      nodes = nodes.filter(n =>
        n.label.toLowerCase().includes(q) ||
        n.fullName?.toLowerCase().includes(q) ||
        n.summary?.toLowerCase().includes(q)
      );
    }
    return nodes;
  }, [filterType, searchQuery]);

  const buildGraph = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;

    const visibleNodes = getVisibleNodes();
    const visibleIds = new Set(visibleNodes.map(n => n.id));
    const visibleLinks = GRAPH_LINKS.filter(l =>
      visibleIds.has(typeof l.source === 'object' ? l.source.id : l.source) &&
      visibleIds.has(typeof l.target === 'object' ? l.target.id : l.target)
    );

    setStats({ nodes: visibleNodes.length, links: visibleLinks.length });

    const W = containerRef.current.clientWidth;
    const H = containerRef.current.clientHeight;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', W)
      .attr('height', H);

    // Defs — arrow markers per type
    const defs = svg.append('defs');
    Object.entries(NODE_TYPES).forEach(([type, info]) => {
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -4 8 8')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('markerWidth', 5)
        .attr('markerHeight', 5)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-4L8,0L0,4')
        .attr('fill', info.color)
        .attr('opacity', 0.5);
    });

    const gAll = svg.append('g').attr('class', 'zoom-layer');

    // Zoom
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (e) => gAll.attr('transform', e.transform));
    zoomRef.current = zoom;
    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity.translate(W / 2, H / 2).scale(0.75));

    // Simulation
    const nodeData = visibleNodes.map(n => ({ ...n }));
    const linkData = visibleLinks.map(l => ({ ...l }));

    const sim = d3.forceSimulation(nodeData)
      .force('link', d3.forceLink(linkData).id(d => d.id).distance(d => {
        const s = GRAPH_NODES.find(n => n.id === d.source.id);
        const t = GRAPH_NODES.find(n => n.id === d.target.id);
        if (s?.type === 'device' && t?.type === 'device') return 130;
        if (s?.type === 'device' || t?.type === 'device') return 110;
        return 90;
      }).strength(0.4))
      .force('charge', d3.forceManyBody().strength(-380).distanceMax(400))
      .force('collision', d3.forceCollide(d => (NODE_TYPES[d.type]?.size || 10) + 18))
      .force('center', d3.forceCenter(0, 0))
      .force('x', d3.forceX(0).strength(0.04))
      .force('y', d3.forceY(0).strength(0.04));

    simRef.current = sim;

    // Links
    const link = gAll.append('g').attr('class', 'links')
      .selectAll('line')
      .data(linkData)
      .enter().append('line')
      .attr('stroke', d => {
        const target = nodeData.find(n => n.id === (typeof d.target === 'object' ? d.target.id : d.target));
        return NODE_TYPES[target?.type]?.color || '#4b5563';
      })
      .attr('stroke-opacity', 0.25)
      .attr('stroke-width', 1.2)
      .attr('marker-end', d => {
        const target = nodeData.find(n => n.id === (typeof d.target === 'object' ? d.target.id : d.target));
        return `url(#arrow-${target?.type || 'device'})`;
      });

    // Link labels (shown on hover only — via title)
    link.append('title').text(d => d.label);

    // Node groups
    const node = gAll.append('g').attr('class', 'nodes')
      .selectAll('g')
      .data(nodeData)
      .enter().append('g')
      .attr('class', 'node-group')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    // Glow circles (type-colored outer ring)
    node.append('circle')
      .attr('r', d => (NODE_TYPES[d.type]?.size || 10) + 5)
      .attr('fill', d => NODE_TYPES[d.type]?.color || '#888')
      .attr('opacity', 0.12)
      .attr('class', 'glow-ring');

    // Main circle
    node.append('circle')
      .attr('r', d => NODE_TYPES[d.type]?.size || 10)
      .attr('fill', d => NODE_TYPES[d.type]?.color || '#888')
      .attr('fill-opacity', 0.9)
      .attr('stroke', '#1f2937')
      .attr('stroke-width', 2)
      .attr('class', 'main-circle');

    // Label
    node.append('text')
      .text(d => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', d => (NODE_TYPES[d.type]?.size || 10) + 13)
      .attr('font-size', '9px')
      .attr('font-family', 'helvetica, sans-serif')
      .attr('fill', '#9ca3af')
      .attr('pointer-events', 'none')
      .attr('class', 'node-label');

    // Tooltip title
    node.append('title').text(d => d.fullName || d.label);

    // Hover
    node.on('mouseenter', (e, d) => {
        setHoveredNode(d.id);
        // Highlight connected nodes
        const connectedIds = new Set([d.id]);
        linkData.forEach(l => {
          const sid = typeof l.source === 'object' ? l.source.id : l.source;
          const tid = typeof l.target === 'object' ? l.target.id : l.target;
          if (sid === d.id) connectedIds.add(tid);
          if (tid === d.id) connectedIds.add(sid);
        });
        setHighlightedIds(connectedIds);

        // Visual highlight
        gAll.selectAll('.node-group').each(function(nd) {
          const sel = d3.select(this);
          const isConnected = connectedIds.has(nd.id);
          sel.select('.main-circle').attr('fill-opacity', isConnected ? 1 : 0.3);
          sel.select('.glow-ring').attr('opacity', nd.id === d.id ? 0.3 : (isConnected ? 0.15 : 0.05));
          sel.select('.node-label').attr('fill', isConnected ? '#e5e7eb' : '#374151');
        });
        gAll.selectAll('.links line').attr('stroke-opacity', l => {
          const sid = typeof l.source === 'object' ? l.source.id : l.source;
          const tid = typeof l.target === 'object' ? l.target.id : l.target;
          return (sid === d.id || tid === d.id) ? 0.7 : 0.05;
        });
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
        setHighlightedIds(null);
        gAll.selectAll('.node-group').each(function() {
          const sel = d3.select(this);
          sel.select('.main-circle').attr('fill-opacity', 0.9);
          sel.select('.glow-ring').attr('opacity', 0.12);
          sel.select('.node-label').attr('fill', '#9ca3af');
        });
        gAll.selectAll('.links line').attr('stroke-opacity', 0.25);
      })
      .on('click', (e, d) => {
        e.stopPropagation();
        setSelectedNode(d);
        // Pulse animation
        d3.select(e.currentTarget).select('.glow-ring')
          .transition().duration(150).attr('r', (NODE_TYPES[d.type]?.size || 10) + 10).attr('opacity', 0.4)
          .transition().duration(300).attr('r', (NODE_TYPES[d.type]?.size || 10) + 5).attr('opacity', 0.12);
      });

    // Click canvas to deselect
    svg.on('click', () => setSelectedNode(null));

    // Tick
    sim.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => sim.stop();
  }, [getVisibleNodes]);

  useEffect(() => {
    const cleanup = buildGraph();
    return cleanup;
  }, [buildGraph]);

  // Zoom controls
  const zoomIn = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.4);
  };
  const zoomOut = () => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.7);
  };
  const resetView = () => {
    if (!svgRef.current || !zoomRef.current || !containerRef.current) return;
    const W = containerRef.current.clientWidth;
    const H = containerRef.current.clientHeight;
    d3.select(svgRef.current).transition().duration(400).call(
      zoomRef.current.transform,
      d3.zoomIdentity.translate(W / 2, H / 2).scale(0.75)
    );
  };

  const typeCounts = LEGEND_ORDER.reduce((acc, t) => {
    acc[t] = GRAPH_NODES.filter(n => n.type === t).length;
    return acc;
  }, {});

  return (
    <div className="w-screen h-screen bg-gray-950 flex flex-col overflow-hidden text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-900/80 flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base tracking-tight">Device & Research Knowledge Graph</h1>
            <p className="text-gray-500 text-xs">{stats.nodes} nodes · {stats.links} connections · hover to highlight · click to expand</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search nodes…"
              className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-yellow-600 w-40"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                <X size={11} />
              </button>
            )}
          </div>
          {/* Zoom controls */}
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <button onClick={zoomIn} className="px-2.5 py-1.5 hover:bg-gray-700 transition-colors border-r border-gray-700"><ZoomIn size={13} className="text-gray-400" /></button>
            <button onClick={zoomOut} className="px-2.5 py-1.5 hover:bg-gray-700 transition-colors border-r border-gray-700"><ZoomOut size={13} className="text-gray-400" /></button>
            <button onClick={resetView} className="px-2.5 py-1.5 hover:bg-gray-700 transition-colors"><Maximize2 size={13} className="text-gray-400" /></button>
          </div>
          <button onClick={buildGraph} className="p-2 rounded-xl bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors" title="Re-run layout">
            <RefreshCw size={13} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Type filter pills */}
      <div className="flex items-center gap-1.5 px-5 py-2 border-b border-gray-800/60 overflow-x-auto flex-shrink-0 bg-gray-950">
        <button
          onClick={() => setFilterType('all')}
          className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all border ${filterType === 'all' ? 'bg-gray-700 border-gray-500 text-white' : 'border-gray-800 text-gray-600 hover:text-gray-400'}`}>
          All ({GRAPH_NODES.length})
        </button>
        {LEGEND_ORDER.map(t => {
          const info = NODE_TYPES[t];
          const active = filterType === t;
          return (
            <button key={t}
              onClick={() => setFilterType(active ? 'all' : t)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border ${active ? 'border-current text-white' : 'border-gray-800 text-gray-600 hover:border-gray-600'}`}
              style={active ? { backgroundColor: info.color + '30', borderColor: info.color, color: info.color } : {}}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
              {info.label} ({typeCounts[t]})
            </button>
          );
        })}
      </div>

      {/* Graph canvas */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <svg ref={svgRef} className="w-full h-full" style={{ background: 'radial-gradient(ellipse at center, #0f172a 0%, #030712 100%)' }} />

        {/* Detail panel */}
        <DetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />

        {/* Empty state */}
        {stats.nodes === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-gray-600 text-sm">No nodes match the current filter.</p>
              <p className="text-gray-700 text-xs mt-1">Try clearing the search or selecting "All".</p>
            </div>
          </div>
        )}

        {/* Hover tooltip */}
        {hoveredNode && !selectedNode && (() => {
          const n = GRAPH_NODES.find(x => x.id === hoveredNode);
          if (!n) return null;
          const info = NODE_TYPES[n.type];
          return (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/95 border rounded-xl px-4 py-2.5 pointer-events-none shadow-xl"
              style={{ borderColor: info.color + '44' }}>
              <p className="text-white font-bold text-xs">{n.fullName || n.label}</p>
              <p className="text-xs mt-0.5" style={{ color: info.color }}>{info.label}{n.stage ? ` · ${n.stage}` : ''}</p>
            </div>
          );
        })()}

        {/* Instruction hint */}
        {!selectedNode && !hoveredNode && (
          <div className="absolute bottom-6 right-6 text-gray-700 text-xs pointer-events-none text-right">
            <p>← drag nodes · scroll to zoom · click to expand</p>
          </div>
        )}
      </div>
    </div>
  );
}