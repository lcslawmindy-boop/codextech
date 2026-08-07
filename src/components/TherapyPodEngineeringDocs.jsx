import { useState } from "react";
import { FileText, ClipboardList, Package, FileCheck, AlertTriangle, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { POD_OVERVIEW, PRD, PDR, BOM, SOW, SUPPRESSED_CONCEPTS } from "@/lib/therapyPodEngineering";

// ── PRD Section ──────────────────────────────────────────────────────────
function PRDSection() {
  const [expanded, setExpanded] = useState({});
  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="space-y-3">
      {PRD.sections.map((sec) => (
        <div key={sec.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggle(sec.id)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText size={14} className="text-cyan-400" />
              <span className="text-white font-bold text-sm">{sec.title}</span>
            </div>
            {expanded[sec.id] ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
          </button>
          {expanded[sec.id] && (
            <div className="px-5 pb-4 space-y-3">
              {sec.content && <p className="text-gray-300 text-sm leading-relaxed">{sec.content}</p>}
              {sec.requirements && (
                <div className="space-y-2">
                  {sec.requirements.map((req) => (
                    <div key={req.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-800/40 border border-gray-700/50">
                      <span className="text-cyan-400 font-mono text-xs font-bold flex-shrink-0 mt-0.5">{req.id}</span>
                      <span className="text-gray-300 text-xs leading-relaxed">{req.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── PDR Section ──────────────────────────────────────────────────────────
function PDRSection() {
  const [expanded, setExpanded] = useState({});
  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="space-y-3">
      {PDR.sections.map((sec) => (
        <div key={sec.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggle(sec.id)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ClipboardList size={14} className="text-indigo-400" />
              <span className="text-white font-bold text-sm">{sec.title}</span>
            </div>
            {expanded[sec.id] ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
          </button>
          {expanded[sec.id] && (
            <div className="px-5 pb-4 space-y-3">
              {sec.content && <p className="text-gray-300 text-sm leading-relaxed">{sec.content}</p>}
              {sec.subsystems && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left text-gray-500 font-semibold py-2 pr-4">Subsystem</th>
                        <th className="text-left text-gray-500 font-semibold py-2 pr-4">Function</th>
                        <th className="text-left text-gray-500 font-semibold py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sec.subsystems.map((sub, i) => (
                        <tr key={i} className={`border-b border-gray-800 ${i % 2 === 0 ? "bg-gray-800/20" : ""}`}>
                          <td className="py-2 pr-4 text-cyan-400 font-semibold">{sub.name}</td>
                          <td className="py-2 pr-4 text-gray-300">{sub.function}</td>
                          <td className="py-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              sub.status === "Design Complete" ? "bg-green-950/50 text-green-400 border border-green-800" : "bg-yellow-950/50 text-yellow-400 border border-yellow-800"
                            }`}>{sub.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {sec.designParams && (
                <div className="grid grid-cols-2 gap-2">
                  {sec.designParams.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-800/40 border border-gray-700/50">
                      <span className="text-gray-400 text-xs">{p.param}</span>
                      <span className="text-gray-200 text-xs font-mono font-bold">{p.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {sec.risks && (
                <div className="space-y-2">
                  {sec.risks.map((r) => (
                    <div key={r.id} className="p-3 rounded-lg bg-gray-800/40 border border-gray-700/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-500 font-mono text-xs font-bold">{r.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.severity === "Critical" ? "bg-red-950/60 text-red-400 border border-red-800" :
                          r.severity === "High" ? "bg-orange-950/60 text-orange-400 border border-orange-800" :
                          r.severity === "Medium" ? "bg-yellow-950/50 text-yellow-400 border border-yellow-800" :
                          "bg-gray-800 text-gray-400 border border-gray-700"
                        }`}>{r.severity}</span>
                      </div>
                      <p className="text-gray-300 text-xs mb-1">{r.risk}</p>
                      <p className="text-green-400 text-xs"><span className="font-bold">Mitigation:</span> {r.mitigation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── BOM Section ──────────────────────────────────────────────────────────
function BOMSection() {
  const [expandedCat, setExpandedCat] = useState({});
  const toggle = (name) => setExpandedCat((p) => ({ ...p, [name]: !p[name] }));

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-cyan-400">{BOM.summary.totalLineItems}</p>
          <p className="text-gray-500 text-xs uppercase tracking-wider">Line Items</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-green-400">{BOM.summary.totalComponents}</p>
          <p className="text-gray-500 text-xs uppercase tracking-wider">Components</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-indigo-400">{BOM.summary.categories}</p>
          <p className="text-gray-500 text-xs uppercase tracking-wider">Categories</p>
        </div>
      </div>

      {/* Categories */}
      {BOM.categories.map((cat) => (
        <div key={cat.name} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggle(cat.name)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Package size={14} className="text-yellow-400" />
              <span className="text-white font-bold text-sm">{cat.name}</span>
              <span className="text-gray-600 text-xs">({cat.items.length} items)</span>
            </div>
            {expandedCat[cat.name] ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
          </button>
          {expandedCat[cat.name] && (
            <div className="overflow-x-auto border-t border-gray-800">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="text-left text-gray-500 font-semibold py-2 px-4">Ref</th>
                    <th className="text-left text-gray-500 font-semibold py-2 px-4">Component</th>
                    <th className="text-left text-gray-500 font-semibold py-2 px-4">Specification</th>
                    <th className="text-left text-gray-500 font-semibold py-2 px-4">Qty</th>
                    <th className="text-left text-gray-500 font-semibold py-2 px-4">Source</th>
                    <th className="text-left text-gray-500 font-semibold py-2 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.items.map((item, i) => (
                    <tr key={i} className={`border-b border-gray-800 ${i % 2 === 0 ? "bg-gray-900/30" : ""} hover:bg-gray-800/30`}>
                      <td className="py-2 px-4 text-cyan-400 font-mono font-bold">{item.ref}</td>
                      <td className="py-2 px-4 text-gray-200">{item.component}</td>
                      <td className="py-2 px-4 text-gray-400">{item.spec}</td>
                      <td className="py-2 px-4 text-yellow-400 font-bold">{item.qty}</td>
                      <td className="py-2 px-4 text-gray-500">{item.source}</td>
                      <td className="py-2 px-4 text-gray-600">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── SOW Section ──────────────────────────────────────────────────────────
function SOWSection() {
  const [expanded, setExpanded] = useState({});
  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="space-y-3">
      {SOW.sections.map((sec) => (
        <div key={sec.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <button
            onClick={() => toggle(sec.id)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileCheck size={14} className="text-green-400" />
              <span className="text-white font-bold text-sm">{sec.title}</span>
            </div>
            {expanded[sec.id] ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
          </button>
          {expanded[sec.id] && (
            <div className="px-5 pb-4 space-y-3">
              {sec.content && <p className="text-gray-300 text-sm leading-relaxed">{sec.content}</p>}
              {sec.phases && (
                <div className="space-y-2">
                  {sec.phases.map((phase, i) => (
                    <div key={i} className="p-3 rounded-lg bg-gray-800/40 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-indigo-400 font-mono text-xs font-bold">{phase.wbs}</span>
                          <span className="text-white text-xs font-semibold">{phase.task}</span>
                        </div>
                        <span className="text-gray-500 text-xs">{phase.duration}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {phase.deliverables.map((d, j) => (
                          <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-400 border border-gray-600/50">{d}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {sec.items && (
                <ul className="space-y-1.5">
                  {sec.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-xs">
                      <FileCheck size={11} className="text-green-500 flex-shrink-0 mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              )}
              {sec.milestones && (
                <div className="space-y-1.5">
                  {sec.milestones.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-800/40 border border-gray-700/50">
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-mono text-xs font-bold">{m.id}</span>
                        <span className="text-gray-200 text-xs">{m.name}</span>
                      </div>
                      <span className="text-gray-500 text-xs">Week {m.week}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Suppressed Concepts Section ──────────────────────────────────────────
function SuppressedConceptsSection() {
  return (
    <div className="space-y-3">
      {SUPPRESSED_CONCEPTS.map((c, i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="text-white font-bold text-sm">{c.name}</h4>
              <p className="text-gray-500 text-xs">{c.inventor} · {c.year}</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-800">Suppressed</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-600 font-bold uppercase tracking-wider mb-1">Patent/Source</p>
              <p className="text-gray-300">{c.patent}</p>
            </div>
            <div>
              <p className="text-gray-600 font-bold uppercase tracking-wider mb-1">Validation</p>
              <p className="text-gray-300">{c.validation}</p>
            </div>
            <div>
              <p className="text-gray-600 font-bold uppercase tracking-wider mb-1">Documented Outcome</p>
              <p className="text-gray-300">{c.outcome}</p>
            </div>
            <div>
              <p className="text-gray-600 font-bold uppercase tracking-wider mb-1">Role in Pod</p>
              <p className="text-cyan-400">{c.role}</p>
            </div>
          </div>
          <div className="mt-3 p-2.5 rounded-lg bg-red-950/20 border border-red-800/30">
            <p className="text-red-300/70 text-xs"><span className="font-bold text-red-400">Suppression:</span> {c.suppression}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Export: Tabbed Engineering Document ────────────────────────────
export default function TherapyPodEngineeringDocs() {
  const [activeTab, setActiveTab] = useState("prd");

  const tabs = [
    { id: "prd", label: "PRD", icon: <FileText size={14} />, color: "cyan" },
    { id: "pdr", label: "PDR", icon: <ClipboardList size={14} />, color: "indigo" },
    { id: "bom", label: "BOM", icon: <Package size={14} />, color: "yellow" },
    { id: "sow", label: "SOW", icon: <FileCheck size={14} />, color: "green" },
    { id: "concepts", label: "Suppressed Tech", icon: <Shield size={14} />, color: "red" },
  ];

  return (
    <div>
      {/* Document header */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-500 font-mono text-xs">{POD_OVERVIEW.documentControl}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-800">Not for Sale</span>
            </div>
            <h2 className="text-white font-black text-xl">{POD_OVERVIEW.name}</h2>
            <p className="text-gray-500 text-xs mt-1">{POD_OVERVIEW.revision} · {POD_OVERVIEW.date}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 text-xs">Lead Engineer</p>
            <p className="text-gray-300 text-sm font-semibold">{POD_OVERVIEW.leadEngineer}</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed mt-4">{POD_OVERVIEW.synopsis}</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 bg-gray-900 border border-gray-800 rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? `bg-gray-800 text-white`
                : "text-gray-500 hover:text-gray-300"
            }`}
            style={activeTab === tab.id ? { borderBottom: `2px solid var(--${tab.color})` } : {}}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "prd" && <PRDSection />}
      {activeTab === "pdr" && <PDRSection />}
      {activeTab === "bom" && <BOMSection />}
      {activeTab === "sow" && <SOWSection />}
      {activeTab === "concepts" && <SuppressedConceptsSection />}
    </div>
  );
}