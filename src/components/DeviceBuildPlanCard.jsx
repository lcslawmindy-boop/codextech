import { useState } from "react";
import { ChevronDown, ChevronUp, Cpu, Shield, Target, AlertTriangle, CheckCircle, Layers } from "lucide-react";

export default function DeviceBuildPlanCard({ plan }) {
  const [expanded, setExpanded] = useState(false);
  const color = plan.color || "#06b6d4";

  return (
    <div
      className="bg-gray-900 border rounded-2xl overflow-hidden"
      style={{ borderColor: color + "40", borderLeftColor: color, borderLeftWidth: 4 }}
    >
      {/* Header */}
      <div className="px-5 py-4 cursor-pointer" onClick={() => setExpanded(!expanded)} style={{ background: color + "08" }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: color + "20", color }}>{plan.code}</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border" style={{ backgroundColor: "#f59e0b20", color: "#f59e0b", borderColor: "#f59e0b60" }}>{plan.buildStatus}</span>
            </div>
            <h3 className="text-white font-bold text-base">{plan.name}</h3>
            <p className="text-gray-500 text-xs mt-1 line-clamp-2">{plan.mission}</p>
          </div>
          {expanded ? <ChevronUp size={18} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-500 flex-shrink-0" />}
        </div>
      </div>

      {/* Collapsed summary */}
      {!expanded && (
        <div className="px-5 py-3">
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Layers size={12} style={{ color }} />
              <span className="text-gray-400">{plan.modalityCount} modalities</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target size={12} className="text-gray-600" />
              <span className="text-gray-400">{plan.targetPopulation?.join(", ")}</span>
            </div>
          </div>
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4">
          {/* Mission */}
          <div>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1">Mission</p>
            <p className="text-gray-400 text-sm leading-relaxed">{plan.mission}</p>
          </div>

          {/* Node cluster */}
          <div>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-2">Node Cluster ({plan.nodeCluster.length} research nodes)</p>
            <div className="flex flex-wrap gap-1.5">
              {plan.nodeCluster.map(nodeId => (
                <span key={nodeId} className="px-2 py-1 rounded text-[10px] font-mono" style={{ backgroundColor: color + "15", color, border: `1px solid ${color}40` }}>{nodeId}</span>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1"><Cpu size={11} /> Core Technology Stack</p>
            <div className="space-y-1.5">
              {plan.techStack.map((tech, i) => (
                <div key={i} className="bg-gray-950 border border-gray-800 rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-white text-xs font-semibold">{tech.modality}</span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: color + "20", color }}>{tech.sourceNode}</span>
                  </div>
                  <p className="text-gray-500 text-[10px] leading-relaxed">{tech.mechanism}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Novelty */}
          <div>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1">Why This Integration Is Novel</p>
            <p className="text-gray-400 text-xs leading-relaxed">{plan.novelty}</p>
          </div>

          {/* Key components */}
          <div>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-2">Key Components (Conceptual)</p>
            <div className="flex flex-wrap gap-1.5">
              {plan.keyComponents.map((comp, i) => (
                <span key={i} className="px-2 py-1 rounded text-[10px] bg-gray-800 text-gray-400 border border-gray-700">{comp}</span>
              ))}
            </div>
          </div>

          {/* Control system */}
          <div>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Cpu size={11} /> Control System Architecture</p>
            <p className="text-gray-400 text-xs leading-relaxed">{plan.controlSystem}</p>
          </div>

          {/* Frequency protocols */}
          <div>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1">Frequency Protocols</p>
            <p className="text-gray-400 text-xs leading-relaxed font-mono">{plan.frequencyProtocols}</p>
          </div>

          {/* Safety */}
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-3">
            <p className="text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><AlertTriangle size={11} /> Safety Considerations</p>
            <p className="text-gray-400 text-xs leading-relaxed">{plan.safety}</p>
          </div>

          {/* IP + Regulatory */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-green-950/30 border border-green-800/40 rounded-lg p-3">
              <p className="text-green-300 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Shield size={11} /> IP Opportunity</p>
              <p className="text-gray-400 text-xs leading-relaxed">{plan.ipOpportunity}</p>
            </div>
            <div className="bg-blue-950/30 border border-blue-800/40 rounded-lg p-3">
              <p className="text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><CheckCircle size={11} /> Regulatory Pathway</p>
              <p className="text-gray-400 text-xs leading-relaxed">{plan.regulatoryPathway}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}