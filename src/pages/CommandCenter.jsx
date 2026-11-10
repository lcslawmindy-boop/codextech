import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Database, Sparkles, Shield, Wrench, TrendingUp,
  Lock, ClipboardCheck, FileText, Scroll, Lightbulb, FlaskConical,
  FolderKanban, DollarSign, Handshake, AlertTriangle, AlertCircle,
  Heart, ArrowRight, Loader2, Award, Activity, Network
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const SECTIONS = [
  {
    id: "command", label: "Command Center", icon: LayoutDashboard, color: "#06b6d4",
    desc: "Executive portfolio overview",
    items: [
      { label: "Executive Overview", route: "/command", configured: true },
      { label: "Portfolio Intelligence", route: "/command", configured: true },
      { label: "Review Queue", route: "/command", configured: true },
    ],
  },
  {
    id: "research", label: "Research", icon: Database, color: "#22c55e",
    desc: "Master scientific and technical repository",
    items: [
      { label: "Research Vault", route: "/vault", configured: true },
      { label: "Humanitarian Research Vault", route: null, configured: false },
      { label: "Evidence Ledger", route: "/evidence-ledger", configured: true },
      { label: "Research Opportunities", route: "/evidence-ledger", configured: true },
      { label: "Research Maps", route: "/research-network", configured: true },
      { label: "Bearden Research", route: "/vault", configured: true },
    ],
  },
  {
    id: "discovery", label: "Discovery", icon: Sparkles, color: "#a855f7",
    desc: "AI-assisted research analysis & invention candidates",
    items: [
      { label: "Discovery Engine", route: "/inventor-forge", configured: true },
      { label: "Invention Candidates", route: "/hybrid-portfolio", configured: true },
      { label: "Invention Families", route: null, configured: false },
      { label: "Feasibility Queue", route: null, configured: false },
    ],
  },
  {
    id: "ip", label: "IP", icon: Shield, color: "#3b82f6",
    desc: "IP asset repository & patent preparation",
    items: [
      { label: "IP Asset Repository", route: "/ip-portfolio-health", configured: true },
      { label: "Invention Disclosures", route: null, configured: false },
      { label: "Prior Art", route: "/prior-art", configured: true },
      { label: "Patent Preparation", route: "/patent-drafting-wizard", configured: true },
      { label: "IP Review Queue", route: null, configured: false },
    ],
  },
  {
    id: "rd_engineering", label: "R&D + Engineering", icon: Wrench, color: "#f97316",
    desc: "R&D programs & engineering development",
    items: [
      { label: "R&D Programs", route: "/project-planner", configured: true },
      { label: "Engineering Workspace", route: "/build-tracker", configured: true },
      { label: "Visualization Studio", route: "/device-gallery-3d", configured: true },
    ],
  },
  {
    id: "commercialization", label: "Commercialization", icon: TrendingUp, color: "#ec4899",
    desc: "Commercialization cases & funding intelligence",
    items: [
      { label: "Commercialization Cases", route: null, configured: false },
      { label: "Funding Intelligence", route: null, configured: false },
      { label: "Licensing", route: "/investor-crm", configured: true },
      { label: "Strategic Partners", route: "/investor-crm", configured: true },
      { label: "Financial Models", route: null, configured: false },
    ],
  },
  {
    id: "partners_vdr", label: "Partners + VDR", icon: Lock, color: "#64748b",
    desc: "Virtual data room & access management",
    items: [
      { label: "Virtual Data Room", route: "/vdr-documents", configured: true },
      { label: "Access Management", route: null, configured: false },
      { label: "Approved Disclosures", route: null, configured: false },
    ],
  },
  {
    id: "governance", label: "Governance", icon: ClipboardCheck, color: "#fbbf24",
    desc: "Approvals, audit, risk & administration",
    items: [
      { label: "Approvals", route: null, configured: false },
      { label: "Audit Log", route: null, configured: false },
      { label: "Risk Register", route: null, configured: false },
      { label: "Integrations", route: null, configured: false },
      { label: "Administration", route: "/admin", configured: true },
    ],
  },
];

const METRICS = [
  { label: "Research Documents", entity: "ResearchDocument", icon: FileText, color: "#06b6d4" },
  { label: "Evidence Claims", entity: "EvidenceClaim", icon: Scroll, color: "#22c55e" },
  { label: "Evidence Gaps", entity: null, icon: AlertCircle, color: "#f97316" },
  { label: "Research Opportunities", entity: "ResearchOpportunity", icon: Lightbulb, color: "#fbbf24" },
  { label: "Invention Candidates", entity: "InventionCandidate", icon: FlaskConical, color: "#a855f7" },
  { label: "IP Assets", entity: "IPAsset", icon: Shield, color: "#3b82f6" },
  { label: "Active R&D Programs", entity: "Project", icon: FolderKanban, color: "#fbbf24" },
  { label: "Engineering Artifacts", entity: "EngineeringArtifact", icon: Wrench, color: "#f97316" },
  { label: "Humanitarian Programs", entity: null, icon: Heart, color: "#22c55e" },
  { label: "Funding Opportunities", entity: "FundingOpportunity", icon: DollarSign, color: "#22c55e" },
  { label: "Commercialization Cases", entity: "CommercializationCase", icon: TrendingUp, color: "#ec4899" },
  { label: "Partner Pipeline", entity: null, icon: Handshake, color: "#ec4899" },
  { label: "Open Risks", entity: null, icon: AlertTriangle, color: "#ef4444" },
  { label: "Pending Approvals", entity: "ApprovalRequest", icon: ClipboardCheck, color: "#fbbf24" },
];

const REVIEW_QUEUE = [
  { label: "Scientific Review", entity: "EvidenceClaim", filter: { status: "proposed" }, icon: Scroll, color: "#22c55e" },
  { label: "Invention Promotion", entity: "ResearchOpportunity", filter: { review_status: "pending" }, icon: Lightbulb, color: "#fbbf24" },
  { label: "IP Promotion", entity: "InventionCandidate", filter: { human_promotion_approved: false, status: "selected" }, icon: Shield, color: "#3b82f6" },
  { label: "Engineering Review", entity: "EngineeringArtifact", filter: { status: "in_review" }, icon: Wrench, color: "#f97316" },
  { label: "Commercialization Approval", entity: "CommercializationCase", filter: { human_authorized: false, status: "proposed" }, icon: TrendingUp, color: "#ec4899" },
  { label: "Approval Requests", entity: "ApprovalRequest", filter: { status: "pending" }, icon: ClipboardCheck, color: "#fbbf24" },
];

const INTELLIGENCE = [
  { label: "TRL Distribution", entity: "InventionCandidate", groupBy: "readiness_level", icon: Activity, color: "#a855f7" },
  { label: "Evidence Readiness", entity: "EvidenceClaim", groupBy: "evidence_strength", icon: Scroll, color: "#22c55e" },
  { label: "IP Status", entity: "IPAsset", groupBy: "status", icon: Shield, color: "#3b82f6" },
  { label: "Commercialization Readiness", entity: "CommercializationCase", groupBy: "status", icon: TrendingUp, color: "#ec4899" },
];

export default function CommandCenter() {
  const [loading, setLoading] = useState(true);
  const [metricCounts, setMetricCounts] = useState({});
  const [reviewCounts, setReviewCounts] = useState({});
  const [intelData, setIntelData] = useState({});

  const loadAll = useCallback(async () => {
    setLoading(true);
    const metricPromises = METRICS.map((m) =>
      m.entity ? base44.entities[m.entity].count({}).catch(() => 0) : Promise.resolve(null)
    );
    const reviewPromises = REVIEW_QUEUE.map((r) =>
      base44.entities[r.entity].count(r.filter || {}).catch(() => 0)
    );
    const intelPromises = INTELLIGENCE.map((i) =>
      base44.entities[i.entity].aggregate({ groupBy: i.groupBy }).catch(() => ({ rows: [] }))
    );

    const [metricResults, reviewResults, intelResults] = await Promise.all([
      Promise.all(metricPromises),
      Promise.all(reviewPromises),
      Promise.all(intelPromises),
    ]);

    const mc = {};
    METRICS.forEach((m, i) => { mc[m.label] = metricResults[i]; });
    setMetricCounts(mc);

    const rc = {};
    REVIEW_QUEUE.forEach((r, i) => { rc[r.label] = reviewResults[i]; });
    setReviewCounts(rc);

    const ic = {};
    INTELLIGENCE.forEach((i, idx) => {
      const rows = intelResults[idx]?.rows || [];
      ic[i.label] = rows;
    });
    setIntelData(ic);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 bg-slate-950/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-slate-400 hover:text-white text-sm">← Vault</Link>
          <div className="w-px h-5 bg-slate-700" />
          <div>
            <h1 className="text-white font-black text-base">ZARP Command Center</h1>
            <p className="text-slate-500 text-[11px]">Intelligence Vault · R&D Discovery · IP · Commercialization</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/zarp-pipeline" className="px-3 py-1.5 rounded-lg bg-cyan-900/40 border border-cyan-800 text-cyan-300 text-xs font-bold hover:bg-cyan-900/60 transition-colors">
            Pipeline
          </Link>
          <Link to="/evidence-ledger" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/40 border border-green-800 text-green-300 text-xs font-bold hover:bg-green-900/60 transition-colors">
            <Scroll size={13} /> Evidence
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Mission */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <Award size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-white font-bold text-sm mb-1">ZARP Intelligence Vault — North-Star Lifecycle</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Research → Evidence → Opportunity → Invention → Feasibility → IP Asset → R&D → Validation → IP Strategy → Funding → Partnership/Licensing → Commercialization.
                Each stage is connected but represents a different level of maturity. AI discovery does not automatically create approved IP.
                All metrics below are calculated from live database records only.
              </p>
            </div>
          </div>
        </div>

        {/* Executive Overview */}
        <div className="mb-10">
          <h2 className="text-slate-300 font-bold text-sm mb-4 uppercase tracking-wider">Executive Portfolio Overview</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin text-cyan-400" size={28} /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {METRICS.map((m) => {
                const Icon = m.icon;
                const count = metricCounts[m.label];
                const configured = count !== null;
                return (
                  <div key={m.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: m.color + "15" }}>
                        <Icon size={14} style={{ color: m.color }} />
                      </div>
                    </div>
                    {configured ? (
                      <div className="text-2xl font-black" style={{ color: m.color }}>{count}</div>
                    ) : (
                      <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mt-1">Migration Pending</div>
                    )}
                    <div className="text-slate-500 text-[10px] leading-tight mt-0.5">{m.label}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="mb-10">
          <h2 className="text-slate-300 font-bold text-sm mb-4 uppercase tracking-wider">Primary Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800" style={{ background: section.color + "08" }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: section.color + "15" }}>
                      <Icon size={18} style={{ color: section.color }} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">{section.label}</h3>
                      <p className="text-slate-500 text-[11px]">{section.desc}</p>
                    </div>
                  </div>
                  <div className="p-3 grid grid-cols-2 gap-1.5">
                    {section.items.map((item) => (
                      <div key={item.label}>
                        {item.configured && item.route ? (
                          <Link to={item.route} className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg hover:bg-slate-800/60 transition-colors text-xs text-slate-300 font-medium">
                            <span className="w-1 h-1 rounded-full" style={{ background: section.color }} />
                            {item.label}
                            <ArrowRight size={10} className="ml-auto text-slate-600" />
                          </Link>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs text-slate-600">
                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                            {item.label}
                            <span className="ml-auto text-amber-600 text-[9px] font-bold uppercase">Pending</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Portfolio Intelligence */}
        <div className="mb-10">
          <h2 className="text-slate-300 font-bold text-sm mb-4 uppercase tracking-wider">Portfolio Intelligence</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="animate-spin text-slate-600" size={24} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {INTELLIGENCE.map((intel) => {
                const Icon = intel.icon;
                const rows = intelData[intel.label] || [];
                return (
                  <div key={intel.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={15} style={{ color: intel.color }} />
                      <h3 className="text-white font-bold text-xs">{intel.label}</h3>
                    </div>
                    {rows.length === 0 ? (
                      <p className="text-slate-600 text-[11px]">No data</p>
                    ) : (
                      <div className="space-y-1.5">
                        {rows.map((row, i) => {
                          const label = row._id || row[intel.groupBy] || "unspecified";
                          const pct = row.count && rows.length > 0 ? Math.round((row.count / rows.reduce((s, r) => s + (r.count || 0), 0)) * 100) : 0;
                          return (
                            <div key={i} className="flex items-center gap-2">
                              <span className="text-slate-400 text-[11px] capitalize flex-shrink-0 w-24 truncate">{String(label).replace(/_/g, " ")}</span>
                              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 3)}%`, background: intel.color }} />
                              </div>
                              <span className="text-white font-bold text-[11px] w-6 text-right">{row.count}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Review Queue */}
        <div className="mb-10">
          <h2 className="text-slate-300 font-bold text-sm mb-4 uppercase tracking-wider">Review Queue</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="animate-spin text-slate-600" size={24} /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {REVIEW_QUEUE.map((r) => {
                const Icon = r.icon;
                const count = reviewCounts[r.label] || 0;
                return (
                  <div key={r.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                    <Icon size={18} style={{ color: r.color }} className="mx-auto mb-2" />
                    <div className="text-2xl font-black mb-0.5" style={{ color: count > 0 ? r.color : "#475569" }}>{count}</div>
                    <div className="text-slate-500 text-[10px] leading-tight">{r.label}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Promotion Gates */}
        <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} className="text-amber-400" />
            <h3 className="text-amber-300 font-bold text-sm">Fundamental Promotion Gates</h3>
          </div>
          <div className="space-y-1.5 text-xs text-slate-400">
            {[
              ["Research → Opportunity", "AI can propose"],
              ["Opportunity → Invention Candidate", "Human confirms"],
              ["Invention Candidate → IP Asset", "Human / IP review required"],
              ["IP Asset → Engineering Verified", "Qualified review required"],
              ["Engineering → Validated", "Supporting test evidence required"],
              ["IP Asset → External VDR", "Disclosure / security approval required"],
              ["Prospect → External Outreach", "Human approval required"],
              ["Funding Opportunity → Submission", "Eligibility and submission verification required"],
            ].map(([gate, rule]) => (
              <div key={gate} className="flex items-center gap-3 py-1 border-b border-slate-800/50">
                <span className="text-white font-semibold w-72">{gate}</span>
                <span className="text-amber-300/80">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}