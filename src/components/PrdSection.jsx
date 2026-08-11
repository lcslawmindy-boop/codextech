// ── PRD Section Component (Section 12) ─────────────────────────────────────
// Renders the auto-generated Product Requirements Document inside the Device Build Plan.

import { FileText, Users, ListChecks, Gauge, Monitor, ShieldCheck, CheckCircle2, XCircle, Target } from "lucide-react";
import { PRD_LABEL, PRD_SUBLABEL, PRD_DISCLAIMER } from "@/lib/prdGenerator";

function PrdLabel() {
  return (
    <div className="bg-amber-950/40 border border-amber-700/50 rounded-lg px-3 py-2 mb-4">
      <p className="text-amber-300 font-black text-[10px] uppercase tracking-wider leading-tight">{PRD_LABEL}</p>
      <p className="text-amber-400/80 text-[10px] mt-0.5">{PRD_SUBLABEL}</p>
      <p className="text-amber-400/80 text-[10px]">{PRD_DISCLAIMER}</p>
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

function PriorityBadge({ priority }) {
  const colors = {
    "MUST HAVE": "bg-red-900/50 text-red-300 border-red-800",
    "SHOULD HAVE": "bg-amber-900/50 text-amber-300 border-amber-800",
    "NICE TO HAVE": "bg-green-900/50 text-green-300 border-green-800",
  };
  return <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border whitespace-nowrap ${colors[priority] || colors["NICE TO HAVE"]}`}>{priority}</span>;
}

function DataTable({ headers, rows, colWidths }) {
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

export default function PrdSection({ prdData }) {
  if (!prdData) return null;
  const d = prdData;

  return (
    <div className="space-y-4">
      {/* PRD Header */}
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-900/40 border border-amber-700/50 flex items-center justify-center">
            <FileText size={16} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-black text-base">Section 12 — Product Requirements Document (PRD)</h3>
            <p className="text-amber-400 font-mono text-xs">{d.docCode}</p>
          </div>
        </div>
        <PrdLabel />
      </div>

      {/* 2.1 Product Vision Statement */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="2.1" title="Product Vision Statement" icon={Target} />
        <PrdLabel />
        <div className="bg-gray-950/50 rounded-xl p-4">
          <p className="text-gray-200 text-sm leading-relaxed italic">{d.visionStatement}</p>
        </div>
      </div>

      {/* 2.2 User Personas */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="2.2" title="User Personas" icon={Users} />
        <PrdLabel />
        <div className="space-y-3">
          {d.personas.map(p => (
            <div key={p.id} className="bg-gray-950/50 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-cyan-900/40 border border-cyan-700/50 flex items-center justify-center text-cyan-300 font-black text-xs">{p.id}</span>
                <h5 className="text-white font-bold text-sm">{p.title}</h5>
              </div>
              <div className="space-y-1.5 text-xs">
                <p className="text-gray-400"><span className="text-gray-500 font-semibold">Profile:</span> {p.profile}</p>
                {p.currentSolution && <p className="text-gray-400"><span className="text-gray-500 font-semibold">Current solution & failure:</span> {p.currentSolution}</p>}
                {p.whatTheyNeed && <p className="text-gray-400"><span className="text-gray-500 font-semibold">What they need:</span> {p.whatTheyNeed}</p>}
                {p.successDef && <p className="text-gray-400"><span className="text-gray-500 font-semibold">Success definition:</span> {p.successDef}</p>}
                {p.setupReq && <p className="text-gray-400"><span className="text-gray-500 font-semibold">Setup & operation:</span> {p.setupReq}</p>}
                {p.dataReq && <p className="text-gray-400"><span className="text-gray-500 font-semibold">Data & reporting:</span> {p.dataReq}</p>}
                {p.trainingReq && <p className="text-gray-400"><span className="text-gray-500 font-semibold">Training:</span> {p.trainingReq}</p>}
                {p.adoptionJustification && <p className="text-gray-400"><span className="text-gray-500 font-semibold">Adoption justification:</span> {p.adoptionJustification}</p>}
                {p.evidenceReq && <p className="text-gray-400"><span className="text-gray-500 font-semibold">Evidence requirements:</span> {p.evidenceReq}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2.3 Functional Requirements */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="2.3" title={`Functional Requirements (${d.functionalReqs.length} items)`} icon={ListChecks} />
        <PrdLabel />
        <DataTable
          headers={["FR-ID", "Requirement", "Priority", "Rationale", "Source"]}
          rows={d.functionalReqs.map(fr => [
            <span className="font-mono text-cyan-400 font-bold">{fr.id}</span>,
            fr.requirement,
            <PriorityBadge priority={fr.priority} />,
            fr.rationale,
            <span className="font-mono text-amber-400 text-[10px]">{fr.source}</span>,
          ])}
        />
      </div>

      {/* 2.4 Non-Functional Requirements */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="2.4" title="Non-Functional Requirements" icon={Gauge} />
        <PrdLabel />
        <DataTable
          headers={["NFR-ID", "Requirement", "Category"]}
          rows={d.nonFunctionalReqs.map(nfr => [
            <span className="font-mono text-cyan-400 font-bold">{nfr.id}</span>,
            nfr.requirement,
            <span className="text-gray-400">{nfr.category}</span>,
          ])}
        />
      </div>

      {/* 2.5 Modality Performance Requirements */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="2.5" title="Modality Performance Requirements" icon={Gauge} />
        <PrdLabel />
        <DataTable
          headers={["Modality", "Output Parameter", "Min", "Max", "Tolerance", "Accuracy", "Safety Limit"]}
          rows={d.modalityPerfReqs.map(m => [
            m.modality, m.outputParam, m.min, m.max, m.tolerance, m.accuracy, m.safetyLimit,
          ])}
        />
      </div>

      {/* 2.6 User Interface Requirements */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="2.6" title="User Interface Requirements" icon={Monitor} />
        <PrdLabel />
        <div className="space-y-3">
          <div className="bg-gray-950/50 rounded-lg p-3">
            <p className="text-gray-500 text-[10px] font-semibold uppercase mb-1">Control Type</p>
            <p className="text-gray-300 text-xs">{d.uiRequirements.controlType}</p>
          </div>
          <div className="bg-gray-950/50 rounded-lg p-3">
            <p className="text-gray-500 text-[10px] font-semibold uppercase mb-1">Display</p>
            <ul className="space-y-1">
              {d.uiRequirements.display.map((item, i) => (
                <li key={i} className="text-gray-300 text-xs flex gap-2"><span className="text-cyan-400">•</span> {item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-950/50 rounded-lg p-3">
            <p className="text-gray-500 text-[10px] font-semibold uppercase mb-1">Alerts & Alarms</p>
            <ul className="space-y-1">
              {d.uiRequirements.alerts.map((item, i) => (
                <li key={i} className="text-amber-300 text-xs flex gap-2"><span className="text-amber-400">⚠</span> {item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-950/50 rounded-lg p-3">
            <p className="text-gray-500 text-[10px] font-semibold uppercase mb-1">Data Logging</p>
            <ul className="space-y-1">
              {d.uiRequirements.dataLogging.map((item, i) => (
                <li key={i} className="text-gray-300 text-xs flex gap-2"><span className="text-cyan-400">•</span> {item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-950/50 rounded-lg p-3">
            <p className="text-gray-500 text-[10px] font-semibold uppercase mb-1">Connectivity</p>
            <p className="text-gray-300 text-xs">{d.uiRequirements.connectivity}</p>
          </div>
        </div>
      </div>

      {/* 2.7 Regulatory Requirements Summary */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="2.7" title="Regulatory Requirements Summary" icon={ShieldCheck} />
        <PrdLabel />
        <div className="space-y-3">
          <div className="bg-gray-950/50 rounded-lg p-3">
            <p className="text-gray-500 text-[10px] font-semibold uppercase mb-1">FDA Classification</p>
            <p className="text-gray-300 text-xs">{d.regulatory.fdaClassification}</p>
          </div>
          <div className="bg-gray-950/50 rounded-lg p-3">
            <p className="text-gray-500 text-[10px] font-semibold uppercase mb-1">Likely Pathway</p>
            <p className="text-gray-300 text-xs">{d.regulatory.likelyPathway}</p>
          </div>
          <div className="bg-gray-950/50 rounded-lg p-3">
            <p className="text-gray-500 text-[10px] font-semibold uppercase mb-2">Applicable Standards</p>
            <div className="space-y-1">
              {d.regulatory.applicableStandards.map((s, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <span className="text-amber-400 font-mono font-bold w-28 flex-shrink-0">{s.std}</span>
                  <span className="text-gray-400">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2.8 Acceptance Criteria */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="2.8" title="Acceptance Criteria" icon={CheckCircle2} />
        <PrdLabel />
        <div className="space-y-2">
          {d.acceptanceCriteria.map(ac => (
            <div key={ac.id} className="flex items-start gap-3 bg-gray-950/50 rounded-lg px-3 py-2">
              <span className="text-cyan-400 font-mono text-xs font-bold flex-shrink-0">{ac.id}</span>
              <div className="min-w-0">
                <span className="text-gray-500 text-[10px] font-mono">[{ac.frRef}]</span>
                <p className="text-gray-300 text-xs">{ac.criteria}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2.9 Out of Scope */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <SectionHeader num="2.9" title="Out of Scope" icon={XCircle} />
        <PrdLabel />
        <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-4">
          <p className="text-red-300 text-xs font-bold mb-2">This device does NOT:</p>
          <ul className="space-y-1.5">
            {d.outOfScope.map((item, i) => (
              <li key={i} className="text-gray-300 text-xs flex gap-2">
                <XCircle size={12} className="text-red-400 flex-shrink-0 mt-0.5" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}