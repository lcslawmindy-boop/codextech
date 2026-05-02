import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react';

export default function PatentTechGraph() {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [graphData, setGraphData] = useState(null);

  // Sample graph data structure
  const initializeGraphData = () => {
    const patents = [
      { id: 'patent_1', label: 'Scalar Field Generator', type: 'patent', category: 'Energy' },
      { id: 'patent_2', label: 'Quantum Resonance Device', type: 'patent', category: 'Quantum' },
      { id: 'patent_3', label: 'EM Wave Modulator', type: 'patent', category: 'EM' },
    ];

    const technologies = [
      { id: 'tech_1', label: 'Tesla Coil', type: 'technology', category: 'EM' },
      { id: 'tech_2', label: 'Plasma Dynamics', type: 'technology', category: 'Energy' },
      { id: 'tech_3', label: 'Quantum Computing', type: 'technology', category: 'Quantum' },
      { id: 'tech_4', label: 'Scalar Wave Theory', type: 'technology', category: 'Theory' },
      { id: 'tech_5', label: 'Electromagnetic Shielding', type: 'technology', category: 'EM' },
    ];

    const links = [
      { source: 'patent_1', target: 'tech_2', strength: 0.8, type: 'similar' },
      { source: 'patent_1', target: 'tech_4', strength: 0.9, type: 'related' },
      { source: 'patent_2', target: 'tech_3', strength: 0.85, type: 'similar' },
      { source: 'patent_2', target: 'tech_4', strength: 0.7, type: 'related' },
      { source: 'patent_3', target: 'tech_1', strength: 0.95, type: 'derivative' },
      { source: 'patent_3', target: 'tech_5', strength: 0.75, type: 'related' },
      { source: 'tech_1', target: 'tech_4', strength: 0.6, type: 'related' },
      { source: 'tech_2', target: 'tech_3', strength: 0.5, type: 'related' },
    ];

    return {
      nodes: [...patents, ...technologies],
      links: links,
    };
  };

  useEffect(() => {
    setGraphData(initializeGraphData());
  }, []);

  useEffect(() => {
    if (!graphData || !svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create zoom behavior
    const g = svg.append('g');
    const zoom = d3.zoom()
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);

    // Force simulation
    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links)
        .id(d => d.id)
        .distance(d => 100 + (1 - d.strength) * 50))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.type === 'patent' ? 35 : 30));

    // Links
    const link = g.selectAll('line')
      .data(graphData.links)
      .enter()
      .append('line')
      .attr('stroke', d => {
        if (d.type === 'derivative') return 'rgba(0,255,200,0.8)';
        if (d.type === 'similar') return 'rgba(100,200,255,0.6)';
        return 'rgba(200,100,255,0.4)';
      })
      .attr('stroke-width', d => 1 + d.strength * 2)
      .attr('opacity', 0.6);

    // Nodes
    const node = g.selectAll('circle')
      .data(graphData.nodes)
      .enter()
      .append('circle')
      .attr('r', d => d.type === 'patent' ? 28 : 24)
      .attr('fill', d => {
        if (d.type === 'patent') return 'rgba(0,220,255,0.9)';
        return 'rgba(180,100,255,0.8)';
      })
      .attr('stroke', d => d.id === selectedNode?.id ? 'rgba(255,255,0,1)' : 'rgba(255,255,255,0.3)')
      .attr('stroke-width', d => d.id === selectedNode?.id ? 3 : 2)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      })
      .call(drag(simulation));

    // Labels
    const labels = g.selectAll('text')
      .data(graphData.nodes)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .attr('font-size', '11px')
      .attr('fill', 'rgba(255,255,255,0.8)')
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none')
      .text(d => d.label.split(' ')[0]);

    // Update node stroke on selection
    node.attr('stroke', d => d.id === selectedNode?.id ? 'rgba(255,255,0,1)' : 'rgba(255,255,255,0.3)')
      .attr('stroke-width', d => d.id === selectedNode?.id ? 3 : 2);

    // Drag handler
    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      labels
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    // Reset zoom button handler
    window.resetGraphZoom = () => {
      svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity.translate(50, 50));
    };

    return () => {
      simulation.stop();
    };
  }, [graphData, selectedNode]);

  const handleResetView = () => {
    if (window.resetGraphZoom) window.resetGraphZoom();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-black text-foreground mb-2">Patent-Technology Graph</h1>
          <p className="text-muted-foreground">Explore connections between your patent drafts and global technologies</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Graph Canvas */}
          <div className="lg:col-span-3">
            <Card className="bg-card border-border/50 h-[600px] overflow-hidden">
              <svg
                ref={svgRef}
                className="w-full h-full"
                style={{ background: 'rgba(10,10,26,0.5)' }}
              />
            </Card>

            {/* Controls */}
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetView}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset View
              </Button>
              <Button variant="outline" size="sm" disabled className="gap-2">
                <ZoomIn className="w-4 h-4" />
                Scroll to zoom
              </Button>
            </div>
          </div>

          {/* Details Panel */}
          <div>
            {selectedNode ? (
              <Card className="bg-card border-accent/30 sticky top-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{selectedNode.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Type</p>
                    <Badge className={selectedNode.type === 'patent' ? 'bg-cyan-900 text-cyan-300' : 'bg-purple-900 text-purple-300'}>
                      {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Category</p>
                    <Badge variant="outline">{selectedNode.category}</Badge>
                  </div>
                  <div className="pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground mb-2">Connected To</p>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {graphData?.links
                        .filter(link => link.source.id === selectedNode.id || link.target.id === selectedNode.id)
                        .map((link, i) => {
                          const connectedNode = link.source.id === selectedNode.id ? link.target : link.source;
                          return (
                            <div key={i} className="text-xs p-2 rounded bg-secondary/30 flex justify-between items-center">
                              <span className="text-foreground">{connectedNode.label}</span>
                              <Badge variant="outline" className="text-xs">{Math.round(link.strength * 100)}%</Badge>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card/50 border-border/30 sticky top-6">
                <CardContent className="pt-6 flex flex-col items-center gap-2 text-center">
                  <Info className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click on a node to view details</p>
                </CardContent>
              </Card>
            )}

            {/* Legend */}
            <Card className="bg-card/50 border-border/30 mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-cyan-500 opacity-90"></div>
                  <span>Your Patents</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-500 opacity-80"></div>
                  <span>Global Tech</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-cyan-400 opacity-80"></div>
                  <span>Derivative</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-blue-400 opacity-60"></div>
                  <span>Similar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-purple-400 opacity-40"></div>
                  <span>Related</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}