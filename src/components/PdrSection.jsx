// ── PDR Section Component (Section 11) ──────────────────────────────────────
// Renders the auto-generated Preliminary Design Review inside the Device Build Plan.
// Permanent amber label on every sub-section block.

import { AlertTriangle, ClipboardCheck, Shield, Activity, GitBranch, FileText, Target, ListChecks, CheckCircle2 } from "lucide-react";
import { PDR_LABEL, PDR_SUBLABEL, PDR_DISCLAIMER } from "@/lib/pdrGenerator";

// Permanent amber label banner — appears on every PDR sub-section
function PdrLabel() {
  return (
    <div className="bg-amber-950/40 border border-amber-700/50 rounded-lg px-3 py-2 mb-4">
      <p className="text-amber-300 font-black text-[10px] uppercase tracking-wider leading-tight">
        {PDR_LABEL}
      </p>
      <p className="text-amber-400/80 text-[10px] mt-0.5">{PDR_SUBLABEL}</p>
      <p className="text-amber-400/80 text-[10px]">{PDR_DISCLAIMER}</p>
    </div>
  );
}

function SectionHeader({ num, title, icon: Icon }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-7 h-7 rounded-lg bg-amber-900/30 border border-amber-700/40 flex items-center justify-center flex-shrink-0">
        <Icon size={13} className="text-amber-400" />
      </div>
      <h4 className="text-amber-300 font-bold text-sm">
        <span className="text-amber-500 font-mono">{num}</span> {title}
      </h4>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex gap-2 py-1.5 border-b border-gray-800/50 last:border-0">
      <span className="text-gray-500 text-xs font-semibold w-40 flex-shrink-0">{label}</span>
      <span className="text-gray-300 text-xs leading-relaxed flex-1">{value}</span>
    </div>
  );
}

function DataTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-800/50">
            {headers.map((h, i) => (
              <th key={i} className="text-left px-2 py-1.5 text-gray-400 font-semibold whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-gray-800/40 hover:bg-gray-800/20">
              {row.map((cell, ci) => (
                <td key={ci} className="px-2 py-1.5 text-gray-300 align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PdrSection({ pdrData }) {
  if (!pdrData) return null;
  const d = pdrData;

  return (
    <div className="space-y-4">
      {/* PDR Header */}
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-900/40 border border-amber-700/50 flex items-center justify-center">
            <ClipboardCheck size={16} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-black text-base">Section 11 — Preliminary Design Review (PDR)</h3>
            <p className="text-amber-400 font-mono text-xs">{d.docCode}</p>
          </div>
        </div>
        <PdrLabel />
      </div>

      {/* 1.1 System Overview */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="1.1" title="System Overview" icon={FileText} />
        <PdrLabel />
        <div className="bg-gray-950/50 rounded-xl p-4">
          <InfoRow label="Device Name" value={d.systemOverview.deviceName} />
          <InfoRow label="Device Code" value={d.systemOverview.deviceCode} />
          <InfoRow label="Version" value={d.systemOverview.version} />
          <InfoRow label="Date" value={d.systemOverview.date} />
          <InfoRow label="Mission Statement" value={d.systemOverview.missionStatement} />
          <InfoRow label="Target Population" value={d.systemOverview.targetPopulation} />
          <InfoRow label="Primary Innovation Goal" value={d.systemOverview.primaryInnovationGoal} />
          <InfoRow label="Technology Readiness Level" value={d.systemOverview.trl} />
          <InfoRow label="TRL Justification" value={d.systemOverview.trlJustification} />
        </div>
      </div>

      {/* 1.2 Design Basis & Requirements Summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="1.2" title="Design Basis & Requirements Summary" icon={Shield} />
        <PdrLabel />

        <p className="text-gray-400 text-xs font-semibold mb-2">Source Research Nodes</p>
        <div className="space-y-1.5 mb-4">
          {d.designBasis.sourceNodes.map((n, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-950/50 rounded-lg px-3 py-2">
              <span className="text-amber-400 font-mono text-xs font-bold">{n.code}</span>
              <span className="text-lg">{n.icon}</span>
              <div className="min-w-0">
                <p className="text-gray-300 text-xs font-semibold">{n.title}</p>
                <p className="text-gray-600 text-[10px]">{n.source}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-gray-400 text-xs font-semibold mb-2">Key Design Drivers</p>
        <div className="space-y-1 mb-4">
          {d.designBasis.keyDesignDrivers.map((driver, i) => (
            <div key={i} className="flex gap-2 bg-gray-950/50 rounded-lg px-3 py-1.5">
              <span className="text-cyan-400 text-xs font-semibold w-44 flex-shrink-0">{driver.label}:</span>
              <span className="text-gray-300 text-xs">{driver.value}</span>
            </div>
          ))}
        </div>

        <p className="text-gray-400 text-xs font-semibold mb-2">Design Constraints</p>
        <ul className="space-y-1 mb-4">
          {d.designBasis.designConstraints.map((c, i) => (
            <li key={i} className="text-gray-300 text-xs flex gap-2 bg-gray-950/50 rounded-lg px-3 py-1.5">
              <span className="text-red-400 flex-shrink-0">•</span> {c}
            </li>
          ))}
        </ul>

        <p className="text-gray-400 text-xs font-semibold mb-2">Open Design Questions</p>
        <ul className="space-y-1">
          {d.designBasis.openDesignQuestions.map((q, i) => (
            <li key={i} className="text-amber-300 text-xs flex gap-2 bg-amber-950/20 border border-amber-900/30 rounded-lg px-3 py-1.5">
              <AlertTriangle size={11} className="text-amber-400 flex-shrink-0 mt-0.5" /> {q}
            </li>
          ))}
        </ul>
      </div>

      {/* 1.3 Multi-System Architecture Block Diagram */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="1.3" title="Multi-System Architecture Block Diagram" icon={GitBranch} />
        <PdrLabel />
        <div className="bg-gray-950/50 rounded-xl p-4 space-y-2">
          {d.architectureBlocks.map((block, i) => (
            <div key={i}>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                  <p className="text-white text-xs font-bold">{block.label}</p>
                  <p className="text-gray-500 text-[10px] mt-0.5">{block.desc}</p>
                </div>
                <span className="text-gray-600 text-[9px] font-mono bg-gray-800 px-1.5 py-0.5 rounded flex-shrink-0">{block.source}</span>
              </div>
              {i < d.architectureBlocks.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <div className="w-px h-3 bg-gray-700" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 bg-cyan-950/20 border border-cyan-900/30 rounded-lg px-3 py-2">
          <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-1">Feedback Loop</p>
          <p className="text-gray-300 text-xs font-mono">{d.feedbackLoop}</p>
        </div>
      </div>

      {/* 1.4 Modality Matrix */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="1.4" title="Modality Matrix" icon={Activity} />
        <PdrLabel />
        <DataTable
          headers={["#", "Name", "Source Node", "Mechanism", "Freq/Range", "Delivery", "Target Tissue", "Safety Ref", "Priority"]}
          rows={d.modalityMatrix.map(m => [
            m.num, m.name, m.sourceNode, m.mechanism, m.frequencyRange, m.deliveryMethod, m.targetTissue, m.safetyRef, m.priorityRank
          ])}
        />
      </div>

      {/* 1.5 Interface Control Document */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="1.5" title="Interface Control Document (ICD — Conceptual)" icon={GitBranch} />
        <PdrLabel />
        <DataTable
          headers={["Interface ID", "From", "To", "Signal Type", "Protocol", "Notes"]}
          rows={d.icd.map(i => [i.id, i.from, i.to, i.signal, i.protocol, i.notes])}
        />
      </div>

      {/* 1.6 PDR Risk Register */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="1.6" title="PDR Risk Register" icon={AlertTriangle} />
        <PdrLabel />
        <div className="space-y-2">
          {d.riskRegister.map(r => (
            <div key={r.id} className="bg-gray-950/50 border border-gray-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-amber-400 font-mono text-xs font-bold">{r.id}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  r.likelihood === "High" ? "bg-red-900/50 text-red-300" :
                  r.likelihood === "Medium" ? "bg-amber-900/50 text-amber-300" :
                  "bg-green-900/50 text-green-300"
                }`}>L: {r.likelihood}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  r.impact === "High" ? "bg-red-900/50 text-red-300" :
                  r.impact === "Medium" ? "bg-amber-900/50 text-amber-300" :
                  "bg-green-900/50 text-green-300"
                }`}>I: {r.impact}</span>
              </div>
              <p className="text-gray-300 text-xs mb-1">{r.description}</p>
              <p className="text-green-400 text-[10px] flex items-center gap-1">
                <CheckCircle2 size={10} /> {r.mitigation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 1.7 PDR Action Items */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="1.7" title="PDR Action Items" icon={ListChecks} />
        <PdrLabel />
        <div className="space-y-2">
          {d.actionItems.map(a => (
            <div key={a.id} className="flex items-start gap-3 bg-gray-950/50 rounded-lg px-3 py-2">
              <span className="text-cyan-400 font-mono text-xs font-bold flex-shrink-0">{a.id}</span>
              <span className="text-gray-300 text-xs">{a.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 1.8 PDR Sign-Off Block */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="1.8" title="PDR Sign-Off Block" icon={Target} />
        <PdrLabel />
        <div className="bg-gray-950/50 rounded-xl p-4 space-y-2">
          <InfoRow label="Prepared by" value={d.signOff.preparedBy} />
          <InfoRow label="Date" value={d.signOff.date} />
          <InfoRow label="Review Status" value={d.signOff.reviewStatus} />
          <InfoRow label="Next Milestone" value={d.signOff.nextMilestone} />
        </div>
      </div>
    </div>
  );
}