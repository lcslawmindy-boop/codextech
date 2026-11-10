import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Database, Scroll, Lightbulb, FlaskConical, Shield, Wrench, TrendingUp,
  Heart, Sparkles, Layers, FolderKanban, Scale, DollarSign, Handshake,
  Lock, ClipboardCheck, History, ArrowRight, Loader2, AlertTriangle,
  Activity, FileText, Award
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const PIPELINE_STAGES = [
  { key: "research", label: "Research", entity: "ResearchDocument", icon: Database, color: "#06b6d4", route: "/vault" },
  { key: "evidence", label: "Evidence", entity: "EvidenceClaim", icon: Scroll, color: "#22c55e", route: "/evidence-ledger" },
  { key: "opportunity", label: "Opportunity", entity: "ResearchOpportunity", icon: Lightbulb, color: "#fbbf24", route: "/evidence-ledger" },
  { key: "invention", label: "Invention Candidate", entity: "InventionCandidate", icon: FlaskConical, color: "#a855f7", route: "/hybrid-portfolio" },
  { key: "ip_asset", label: "IP Asset", entity: "IPAsset", icon: Shield, color: "#3b82f6", route: "/ip-portfolio-health" },
  { key: "engineering", label: "Engineering", entity: "EngineeringArtifact", icon: Wrench, color: "#f97316", route: "/build-tracker" },
  { key: "commercialization", label: "Commercialization", entity: "CommercializationCase", icon: TrendingUp, color: "#ec4899", route: "/zarp-pipeline" },
];

const MODULES = [
  { label: "Research Vault", desc: "Research documents & source material", icon: Database, route: "/vault", color: "#06b6d4", configured: true },
  { label: "Humanitarian Research Vault", desc: "Beneficial technology research environment", icon: Heart, route: null, color: "#22c55e", configured: false },
  { label: "Evidence Ledger", desc: "Source to Claim to Opportunity to Invention chain", icon: Scroll, route: "/evidence-ledger", color: "#22c55e", configured: true },
  { label: "Research Opportunity Registry", desc: "AI-discovered opportunities pending human review", icon: Lightbulb, route: "/evidence-ledger", color: "#fbbf24", configured: true },
  { label: "Discovery Engine", desc: "AI-assisted research analysis & classification", icon: Sparkles, route: "/inventor-forge", color: "#a855f7", configured: true },
  { label: "Invention Candidate Registry", desc: "Reviewed invention candidates", icon: FlaskConical, route: "/hybrid-portfolio", color: "#a855f7", configured: true },
  { label: "Invention Family Registry", desc: "Group related inventions into families", icon: Layers, route: null, color: "#8b5cf6", configured: false },
  { label: "IP Asset Repository", desc: "Patents, trade secrets, software IP, datasets, know-how", icon: Shield, route: "/ip-portfolio-health", color: "#3b82f6", configured: true },
  { label: "R&D Program Manager", desc: "Research & development project management", icon: FolderKanban, route: "/project-planner", color: "#fbbf24", configured: true },
  { label: "Engineering Workspace", desc: "Engineering artifacts & build documentation", icon: Wrench, route: "/build-tracker", color: "#f97316", configured: true },
  { label: "IP Strategy Workspace", desc: "Freedom-to-operate & patent strategy", icon: Scale, route: "/fto-analysis", color: "#3b82f6", configured: true },
  { label: "Funding Intelligence", desc: "Grant & investment opportunity matching", icon: DollarSign, route: null, color: "#22c55e", configured: false },
  { label: "Commercialization Case Manager", desc: "Pathway planning for IP assets", icon: TrendingUp, route: null, color: "#ec4899", configured: false },
  { label: "Licensing & Partner CRM", desc: "Strategic partner relationship tracking", icon: Handshake, route: "/investor-crm", color: "#ec4899", configured: true },
  { label: "Investor / Partner VDR", desc: "Secure virtual data room for due diligence", icon: Lock, route: "/vdr-documents", color: "#64748b", configured: true },
  { label: "Human Review & Approval Center", desc: "Approval queue for promotions & disclosures", icon: ClipboardCheck, route: null, color: "#fbbf24", configured: false },
  { label: "Audit & Provenance System", desc: "Complete audit trail & traceability", icon: History, route: null, color: "#64748b", configured: false },
];

const METRICS = [
  { key: "projects", label: "R&D Programs", entity: "Project", icon: FolderKanban, color: "#fbbf24" },
  { key: "documents", label: "Research Documents", entity: "ResearchDocument", icon: FileText, color: "#06b6d4" },
  { key: "claims", label: "Evidence Claims", entity: "EvidenceClaim", icon: Scroll, color: "#22c55e" },
  { key: "opportunities", label: "Research Opportunities", entity: "ResearchOpportunity", icon: Lightbulb, color: "#fbbf24" },
  { key: "candidates", label: "Invention Candidates", entity: "InventionCandidate", icon: FlaskConical, color: "#a855f7" },
  { key: "ip_assets", label: "IP Assets", entity: "IPAsset", icon: Shield, color: "#3b82f6" },
  { key: "artifacts", label: "Engineering Artifacts", entity: "EngineeringArtifact", icon: Wrench, color: "#f97316" },
  { key: "comm_cases", label: "Commercialization Cases", entity: "CommercializationCase", icon: TrendingUp, color: "#ec4899" },
  { key: "approvals", label: "Pending Approvals", entity: "ApprovalRequest", icon: ClipboardCheck, color: "#f59e0b" },
  { key: "audit", label: "Audit Events", entity: "AuditEvent", icon: History, color: "#64748b" },
];

export default function ZARPPipeline() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({});

  const loadCounts = useCallback(async () => {
    setLoading(true);
    const entities = [...PIPELINE_STAGES, ...METRICS];
    const results = await Promise.allSettled(
      entities.map((s) => base44.entities[s.entity].count({}))
    );
    const map = {};
    entities.forEach((s, i) => {
      map[s.entity] = results[i].status === "fulfilled" ? results[i].value : 0;
    });
    setCounts(map);
    setLoading(false);
  }, []);

  useEffect(() => { loadCounts(); }, [loadCounts]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 bg-slate-950/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-slate-400 hover:text-white text-sm">← Vault</Link>
          <div className="w-px h-5 bg-slate-700" />
          <div>
            <h1 className="text-white font-black text-base">ZARP R&D Pipeline</h1>
            <p className="text-slate-500 text-[11px]">Internal IP Discovery · Evidence · Engineering · Commercialization</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/evidence-ledger" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/40 border border-green-800 text-green-300 text-xs font-bold transition-colors hover:bg-green-900/60">
            <Scroll size={13} /> Evidence Ledger
          </Link>
          <Link to="/research-network" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-900/40 border border-cyan-800 text-cyan-300 text-xs font-bold transition-colors hover:bg-cyan-900/60">
            <Activity size={13} /> Network Map
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Mission Statement */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <Award size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-white font-bold text-sm mb-1">Private Internal IP R&D Discovery Engine</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                ZARP transforms proprietary research into a governed pipeline of evidence, discoveries, intellectual-property assets,
                engineering programs, humanitarian technology opportunities, and responsible commercialization pathways.
                All metrics below are calculated from actual database records. AI may discover, analyze, and recommend —
                but only human review can verify claims, promote inventions, authorize disclosures, or commit resources.
              </p>
            </div>
          </div>
        </div>

        {/* Pipeline Visualization */}
        <div className="mb-10">
          <h2 className="text-slate-300 font-bold text-sm mb-4 uppercase tracking-wider">Discovery Pipeline</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin text-cyan-400" size={28} /></div>
          ) : (
            <div className="flex items-center gap-1 overflow-x-auto pb-3">
              {PIPELINE_STAGES.map((stage, i) => {
                const Icon = stage.icon;
                const count = counts[stage.entity] || 0;
                return (
                  <div key={stage.key} className="flex items-center flex-shrink-0">
                    <Link
                      to={stage.route || "#"}
                      className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl border transition-all hover:scale-105 min-w-[120px]"
                      style={{ borderColor: stage.color + "40", background: stage.color + "0a" }}
                    >
                      <Icon size={22} style={{ color: stage.color }} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stage.label}</span>
                      <span className="text-2xl font-black" style={{ color: stage.color }}>{count}</span>
                    </Link>
                    {i < PIPELINE_STAGES.length - 1 && (
                      <ArrowRight size={14} className="text-slate-700 mx-0.5 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <p className="text-slate-600 text-[11px] mt-2">
            Research → Evidence → Opportunity → Invention Candidate → Feasibility → IP Asset → Engineering Development → Validation → IP Strategy → Funding / Partnership / Licensing → Commercialization
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="mb-10">
          <h2 className="text-slate-300 font-bold text-sm mb-4 uppercase tracking-wider">Portfolio Metrics (from live records)</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="animate-spin text-slate-600" size={24} /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {METRICS.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.key} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: m.color + "15" }}>
                      <Icon size={16} style={{ color: m.color }} />
                    </div>
                    <div>
                      <div className="text-xl font-black" style={{ color: m.color }}>{counts[m.entity] ?? 0}</div>
                      <div className="text-slate-500 text-[10px] leading-tight">{m.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Humanitarian R&D Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Heart size={18} className="text-green-400" />
            <h2 className="text-slate-300 font-bold text-sm uppercase tracking-wider">Humanitarian R&D</h2>
          </div>
          <div className="bg-green-950/20 border border-green-900/40 rounded-xl p-5">
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Beneficial technologies including clean water, environmental monitoring, disaster response, accessible communication,
              assistive technology, adaptive learning, energy efficiency, infrastructure resilience, safety technology, and
              appropriately governed investigational research. Humanitarian status does not lower scientific evidence requirements.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Clean Water", "Environmental Monitoring", "Disaster Response", "Accessible Communication", "Assistive Technology", "Adaptive Learning", "Energy Efficiency", "Infrastructure Resilience", "Safety Technology", "Investigational Research"].map((cat) => (
                <span key={cat} className="px-3 py-1 rounded-full bg-green-900/30 border border-green-800/50 text-green-400 text-[11px] font-semibold">{cat}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Module Grid */}
        <div className="mb-10">
          <h2 className="text-slate-300 font-bold text-sm mb-4 uppercase tracking-wider">Core Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.label}
                  className={`rounded-xl border p-4 transition-all ${mod.configured ? "cursor-pointer hover:scale-[1.02]" : "opacity-60"}`}
                  style={{
                    borderColor: mod.color + "30",
                    background: mod.configured ? `linear-gradient(160deg, ${mod.color}08, #0a0e17)` : "#0a0e17",
                  }}
                  onClick={() => mod.configured && mod.route && (window.location.href = mod.route)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: mod.color + "15" }}>
                      <Icon size={18} style={{ color: mod.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold text-xs">{mod.label}</h3>
                        {!mod.configured && (
                          <span className="flex items-center gap-1 text-amber-500 text-[9px] font-bold uppercase">
                            <AlertTriangle size={9} /> Not Configured
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px] leading-snug mt-1">{mod.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Governance Principles */}
        <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-amber-400" />
            <h3 className="text-amber-300 font-bold text-sm">Governance Principles</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-400 leading-relaxed">
            <p><span className="text-amber-300 font-semibold">Human-gated promotions:</span> AI may discover, analyze, classify, recommend, and draft — but only human review can verify claims, promote inventions to IP assets, authorize external disclosure, submit patent applications, commit funding, or contact commercialization targets.</p>
            <p><span className="text-amber-300 font-semibold">Evidence separation:</span> Strict separation between source statements, independently verified evidence, AI inference, engineering assumptions, unresolved hypotheses, and human-reviewed conclusions.</p>
            <p><span className="text-amber-300 font-semibold">No fabrication:</span> Research results, citations, patentability, valuations, grant opportunities, licensing interest, commercialization readiness, manufacturing readiness, regulatory status, and investment outcomes are never fabricated.</p>
            <p><span className="text-amber-300 font-semibold">Decision-support only:</span> Commercial recommendations are advisory outputs, not guaranteed financial outcomes. Human authorization required before external sharing, filing, outreach, purchasing, or licensing decisions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}