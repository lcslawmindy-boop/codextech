import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Loader2, Scroll, Database, Lightbulb, FlaskConical,
  Shield, Wrench, TrendingUp, FileText, ChevronRight, X, AlertCircle, GitBranch, Layers
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import DocumentTraceabilityView from "../components/DocumentTraceabilityView";

const CHAIN_STAGES = [
  { key: "source", label: "Source", entity: "EvidenceSource", icon: FileText, color: "#06b6d4", desc: "Original source material & citations" },
  { key: "claim", label: "Evidence Claim", entity: "EvidenceClaim", icon: Scroll, color: "#22c55e", desc: "Claims extracted from sources" },
  { key: "opportunity", label: "Research Opportunity", entity: "ResearchOpportunity", icon: Lightbulb, color: "#fbbf24", desc: "AI-discovered opportunities (pending human review)" },
  { key: "invention", label: "Invention Candidate", entity: "InventionCandidate", icon: FlaskConical, color: "#a855f7", desc: "Human-promoted invention candidates" },
  { key: "ip_asset", label: "IP Asset", entity: "IPAsset", icon: Shield, color: "#3b82f6", desc: "Human-approved IP assets" },
  { key: "engineering", label: "Engineering Artifact", entity: "EngineeringArtifact", icon: Wrench, color: "#f97316", desc: "Engineering development artifacts" },
  { key: "commercialization", label: "Commercialization Case", entity: "CommercializationCase", icon: TrendingUp, color: "#ec4899", desc: "Commercialization pathway cases" },
];

const EVIDENCE_STRENGTH_COLORS = {
  strong: "#22c55e", moderate: "#fbbf24", weak: "#f97316", speculative: "#ef4444",
};

const REVIEW_STATUS_COLORS = {
  pending: "#fbbf24", reviewed: "#06b6d4", promoted: "#22c55e", rejected: "#ef4444",
  approved: "#22c55e", under_review: "#fbbf24",
};

function StageColumn({ stage, items, selected, onSelect, loading }) {
  const Icon = stage.icon;
  return (
    <div className="flex flex-col min-w-[280px] w-80 flex-shrink-0">
      <div className="flex items-center gap-2 px-3 py-2 rounded-t-xl border-b" style={{ borderColor: stage.color + "30", background: stage.color + "0a" }}>
        <Icon size={16} style={{ color: stage.color }} />
        <span className="text-white font-bold text-xs">{stage.label}</span>
        <span className="text-slate-600 text-[10px] ml-auto">{items.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto bg-slate-900/40 border-x border-b rounded-b-xl" style={{ borderColor: stage.color + "20", minHeight: 200, maxHeight: 500 }}>
        {loading ? (
          <div className="flex items-center justify-center py-8"><Loader2 className="animate-spin text-slate-600" size={20} /></div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-3 text-center">
            <AlertCircle size={20} className="text-slate-700 mb-2" />
            <p className="text-slate-600 text-[11px]">No records</p>
          </div>
        ) : (
          <div className="p-2 space-y-1.5">
            {items.map((item) => {
              const isSelected = selected?.[stage.key]?.id === item.id;
              const title = item.title || item.asset_name || item.name || item.claim_text?.slice(0, 60) || item.description?.slice(0, 60) || item.id;
              const status = item.review_status || item.status;
              const statusColor = status ? REVIEW_STATUS_COLORS[status] : null;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(stage.key, item)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${isSelected ? "border-cyan-500 bg-cyan-950/30" : "border-slate-800 bg-slate-900/50 hover:border-slate-700"}`}
                >
                  <p className="text-white text-xs font-semibold leading-tight mb-1 line-clamp-2">{title}</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {status && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ color: statusColor, background: statusColor + "20" }}>
                        {status.replace(/_/g, " ")}
                      </span>
                    )}
                    {item.evidence_strength && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ color: EVIDENCE_STRENGTH_COLORS[item.evidence_strength], background: EVIDENCE_STRENGTH_COLORS[item.evidence_strength] + "20" }}>
                        {item.evidence_strength}
                      </span>
                    )}
                    {item.ai_generated !== undefined && item.ai_generated && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-purple-900/40 text-purple-300">AI</span>
                    )}
                    {item.human_promotion_approved && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-green-900/40 text-green-300">Human Approved</span>
                    )}
                    {item.human_authorized && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-green-900/40 text-green-300">Authorized</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <p className="text-slate-600 text-[10px] mt-1 px-1">{stage.desc}</p>
    </div>
  );
}

function DetailPanel({ selectedStage, item, onClose }) {
  if (!item) return null;
  const stage = CHAIN_STAGES.find((s) => s.key === selectedStage);
  if (!stage) return null;
  const Icon = stage.icon;

  const fields = [
    { key: "description", label: "Description" },
    { key: "claim_text", label: "Claim" },
    { key: "concept_summary", label: "Concept Summary" },
    { key: "technical_description", label: "Technical Description" },
    { key: "novelty_basis", label: "Novelty Basis" },
    { key: "ai_reasoning", label: "AI Reasoning (advisory)" },
    { key: "supporting_evidence_summary", label: "Supporting Evidence" },
    { key: "rationale", label: "Rationale" },
    { key: "ai_recommendation", label: "AI Recommendation (decision-support)" },
    { key: "risk_assessment", label: "Risk Assessment" },
    { key: "feasibility_summary", label: "Feasibility Summary" },
    { key: "proposed_mechanism", label: "Proposed Mechanism" },
    { key: "excerpt", label: "Excerpt" },
    { key: "eligibility_notes", label: "Eligibility" },
    { key: "review_notes", label: "Review Notes" },
  ].filter((f) => item[f.key]);

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-slate-950 border-l border-slate-800 z-50 overflow-y-auto p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon size={18} style={{ color: stage.color }} />
          <span className="text-white font-bold text-sm">{stage.label}</span>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
      </div>

      <h3 className="text-white font-bold text-base mb-3 leading-tight">
        {item.title || item.asset_name || item.name || item.claim_text?.slice(0, 100) || "Untitled"}
      </h3>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {item.review_status && <span className="text-[10px] font-bold uppercase px-2 py-1 rounded" style={{ color: REVIEW_STATUS_COLORS[item.review_status], background: REVIEW_STATUS_COLORS[item.review_status] + "20" }}>Review: {item.review_status.replace(/_/g, " ")}</span>}
        {item.status && !item.review_status && <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-800 text-slate-300">{item.status.replace(/_/g, " ")}</span>}
        {item.evidence_strength && <span className="text-[10px] font-bold uppercase px-2 py-1 rounded" style={{ color: EVIDENCE_STRENGTH_COLORS[item.evidence_strength], background: EVIDENCE_STRENGTH_COLORS[item.evidence_strength] + "20" }}>{item.evidence_strength}</span>}
        {item.claim_type && <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-800 text-slate-300">{item.claim_type.replace(/_/g, " ")}</span>}
        {item.asset_type && <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-800 text-slate-300">{item.asset_type.replace(/_/g, " ")}</span>}
        {item.pathway && <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-800 text-slate-300">{item.pathway.replace(/_/g, " ")}</span>}
        {item.readiness_level && <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-800 text-slate-300">TRL: {item.readiness_level}</span>}
        {item.humanitarian_flag && <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-green-900/40 text-green-300">Humanitarian</span>}
        {item.confidential && <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-amber-900/40 text-amber-300">Confidential</span>}
      </div>

      <div className="space-y-3">
        {fields.map((f) => (
          <div key={f.key}>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{f.label}</p>
            <p className="text-slate-300 text-xs leading-relaxed">{item[f.key]}</p>
          </div>
        ))}

        {item.ai_generated !== undefined && (
          <div className="flex items-center gap-2 text-[11px] text-purple-400 bg-purple-950/20 border border-purple-900/30 rounded-lg px-3 py-2">
            <AlertCircle size={12} />
            {item.ai_generated ? "AI-generated — requires human review before promotion" : "Human-originated record"}
          </div>
        )}
        {item.human_promotion_approved !== undefined && !item.human_promotion_approved && (
          <div className="flex items-center gap-2 text-[11px] text-amber-400 bg-amber-950/20 border border-amber-900/30 rounded-lg px-3 py-2">
            <AlertCircle size={12} />
            Awaiting human approval for promotion to IP Asset
          </div>
        )}
        {item.human_authorized !== undefined && !item.human_authorized && (
          <div className="flex items-center gap-2 text-[11px] text-amber-400 bg-amber-950/20 border border-amber-900/30 rounded-lg px-3 py-2">
            <AlertCircle size={12} />
            No human authorization for external action — no outreach, filing, or disclosure permitted
          </div>
        )}
      </div>
    </div>
  );
}

export default function EvidenceLedger() {
  const [loading, setLoading] = useState(true);
  const [stageData, setStageData] = useState({});
  const [selected, setSelected] = useState({});
  const [selectedStage, setSelectedStage] = useState(null);
  const [view, setView] = useState("pipeline"); // "pipeline" | "traceability"

  const loadAll = useCallback(async () => {
    setLoading(true);
    const results = await Promise.allSettled(
      CHAIN_STAGES.map((s) => base44.entities[s.entity].filter({}, { sort: "-created_date", limit: 15 }))
    );
    const map = {};
    CHAIN_STAGES.forEach((s, i) => {
      map[s.key] = results[i].status === "fulfilled" ? (results[i].value.items || []) : [];
    });
    setStageData(map);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleSelect = (stageKey, item) => {
    setSelected((prev) => ({ ...prev, [stageKey]: item }));
    setSelectedStage(stageKey);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 bg-slate-950/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link to="/zarp-pipeline" className="text-slate-400 hover:text-white"><ArrowLeft size={18} /></Link>
          <div>
            <h1 className="text-white font-black text-base">Evidence Ledger</h1>
            <p className="text-slate-500 text-[11px]">Full provenance chain — navigate in both directions</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button onClick={() => setView("pipeline")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${view === "pipeline" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"}`}>
            <GitBranch size={12} /> Pipeline
          </button>
          <button onClick={() => setView("traceability")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${view === "traceability" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"}`}>
            <Layers size={12} /> Document Traceability
          </button>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-4 flex items-center gap-2 overflow-x-auto">
          {CHAIN_STAGES.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.key} className="flex items-center flex-shrink-0">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: s.color + "10" }}>
                  <Icon size={13} style={{ color: s.color }} />
                  <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: s.color }}>{s.label}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">{(stageData[s.key] || []).length}</span>
                </div>
                {i < CHAIN_STAGES.length - 1 && <ChevronRight size={12} className="text-slate-700 mx-0.5" />}
              </div>
            );
          })}
        </div>
      </div>

      {view === "traceability" ? (
        <div className="px-6 pb-6">
          <DocumentTraceabilityView />
        </div>
      ) : (
        <div className="px-6 pb-6 overflow-x-auto">
          <div className="text-slate-500 text-[11px] mb-2 flex items-center gap-1.5">
            <ChevronRight size={12} className="text-cyan-400" /> Scroll right to see all 7 stages of the provenance chain
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-cyan-400" size={32} /></div>
          ) : (
            <div className="flex gap-3 min-w-max">
              {CHAIN_STAGES.map((stage) => (
                <StageColumn
                  key={stage.key}
                  stage={stage}
                  items={stageData[stage.key] || []}
                  selected={selected}
                  onSelect={handleSelect}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {selectedStage && selected[selectedStage] && (
        <DetailPanel
          selectedStage={selectedStage}
          item={selected[selectedStage]}
          onClose={() => { setSelectedStage(null); setSelected({}); }}
        />
      )}
    </div>
  );
}