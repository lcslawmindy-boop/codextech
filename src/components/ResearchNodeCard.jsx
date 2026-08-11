import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, Shield, AlertTriangle, Users, Zap } from "lucide-react";
import { SUPPRESSION_COLORS, DOMAIN_COLORS } from "@/lib/researchGraphExpansion";

export default function ResearchNodeCard({ node }) {
  const [expanded, setExpanded] = useState(false);
  const domainColor = DOMAIN_COLORS[node.domain] || "#6b7280";
  const suppressionColor = SUPPRESSION_COLORS[node.suppressionLevel] || "#6b7280";

  return (
    <div
      className="bg-gray-900 border rounded-xl overflow-hidden transition-all"
      style={{ borderColor: domainColor + "40", borderLeftColor: domainColor, borderLeftWidth: 3 }}
    >
      {/* Header */}
      <div className="px-4 py-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h4 className="text-white font-bold text-sm leading-tight flex-1">{node.title}</h4>
          {expanded ? <ChevronUp size={16} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ backgroundColor: domainColor + "20", color: domainColor }}>{node.domain}</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold border" style={{ backgroundColor: suppressionColor + "20", color: suppressionColor, borderColor: suppressionColor + "60" }}>{node.suppressionLevel}</span>
          {node.year && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-800 text-gray-400">{node.year}</span>}
        </div>
      </div>

      {/* Collapsed summary */}
      {!expanded && (
        <div className="px-4 pb-3">
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{node.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Users size={11} className="text-gray-600" />
            <span className="text-gray-600 text-[10px]">{node.researchers?.slice(0, 2).join(", ")}</span>
          </div>
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <div>
            <p className="text-gray-400 text-xs leading-relaxed">{node.description}</p>
          </div>

          {node.researchers && node.researchers.length > 0 && (
            <div>
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1">Researchers</p>
              <p className="text-gray-300 text-xs">{node.researchers.join(", ")}</p>
            </div>
          )}

          {node.coreMechanism && (
            <div>
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Zap size={10} /> Core Mechanism</p>
              <p className="text-gray-400 text-xs leading-relaxed">{node.coreMechanism}</p>
            </div>
          )}

          {node.documentedEffects && (
            <div>
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1">Documented Effects</p>
              <p className="text-gray-400 text-xs leading-relaxed">{node.documentedEffects}</p>
            </div>
          )}

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-2">
            {node.evidenceQuality && (
              <div className="bg-gray-950 rounded p-2">
                <p className="text-gray-600 text-[9px] uppercase">Evidence</p>
                <p className="text-gray-300 text-[10px] font-semibold">{node.evidenceQuality}</p>
              </div>
            )}
            {node.targetSystem && (
              <div className="bg-gray-950 rounded p-2">
                <p className="text-gray-600 text-[9px] uppercase">Target System</p>
                <p className="text-gray-300 text-[10px] font-semibold">{node.targetSystem}</p>
              </div>
            )}
            {node.deviceIntegration && (
              <div className="bg-gray-950 rounded p-2">
                <p className="text-gray-600 text-[9px] uppercase">Integration</p>
                <p className="text-gray-300 text-[10px] font-semibold">{node.deviceIntegration}</p>
              </div>
            )}
            {node.ipOpportunity && (
              <div className="bg-gray-950 rounded p-2">
                <p className="text-gray-600 text-[9px] uppercase">IP Opportunity</p>
                <p className="text-[10px] font-semibold" style={{ color: node.ipOpportunity === "High" ? "#22c55e" : node.ipOpportunity === "Medium" ? "#f59e0b" : "#6b7280" }}>{node.ipOpportunity}</p>
              </div>
            )}
          </div>

          {/* Suppression info */}
          {node.suppressionYear && (
            <div className="bg-red-950/30 border border-red-800/40 rounded-lg p-2.5">
              <p className="text-red-300 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><AlertTriangle size={10} /> Suppression</p>
              <p className="text-gray-400 text-xs">{node.suppressionYear} — {node.suppressionInstitution}</p>
              <p className="text-gray-500 text-[10px] mt-1">Current: {node.currentStatus}</p>
            </div>
          )}

          {/* Source references */}
          {node.sourceReferences && node.sourceReferences.length > 0 && (
            <div>
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1"><BookOpen size={10} /> Source References</p>
              <div className="space-y-1">
                {node.sourceReferences.map((ref, i) => (
                  <div key={i} className="flex gap-2 text-[10px] text-gray-500 leading-relaxed">
                    <span className="text-gray-700 flex-shrink-0">{i + 1}.</span>
                    <span>{ref}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {node.tags && node.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {node.tags.map(tag => (
                <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] bg-gray-800 text-gray-500 border border-gray-700">{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}