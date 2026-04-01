import { useState } from "react";
import ConceptNetworkGraph from "../components/ConceptNetworkGraph";
import NodePanel from "../components/NodePanel";
import { groupColors, nodes } from "../lib/beardenData";

export default function ConceptGraph() {
  const [selectedNode, setSelectedNode] = useState(null);

  const groups = [...new Set(nodes.map(n => n.group))];

  return (
    <div className="w-screen h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 flex-shrink-0">
        <div>
          <h1 className="text-white font-bold text-lg tracking-tight">Bearden Concept Network</h1>
          <p className="text-gray-500 text-xs">Click any node to explore source fragments · Drag to rearrange · Scroll to zoom</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {groups.map(g => (
            <div key={g} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: groupColors[g] }} />
              <span className="text-gray-400 text-xs capitalize">{g}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Graph area */}
      <div className="flex-1 relative">
        <ConceptNetworkGraph
          onNodeClick={setSelectedNode}
          selectedNodeId={selectedNode?.id}
        />
        <NodePanel node={selectedNode} onClose={() => setSelectedNode(null)} />

        {!selectedNode && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/80 border border-gray-700 rounded-full px-4 py-2 text-gray-400 text-xs pointer-events-none">
            ← Click a node to view source text fragments →
          </div>
        )}
      </div>
    </div>
  );
}