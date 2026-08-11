import { BarChart3, Scale, FileText, Microscope, Building2, GitBranch, File, ChevronRight, Lock, ClipboardCheck, FileStack, DollarSign, TrendingUp, GraduationCap, Users } from "lucide-react";

export const EXPORT_PRODUCTS = [
  { id: "investor-package", icon: BarChart3, title: "Investor Package", desc: "Complete multi-section investor & grant document — branded, legally protected, export-ready", tier: "PRO", border: "gold", flagship: true },
  { id: "licensing-brief", icon: Scale, title: "Licensing Brief", desc: "One-page technology licensing document for manufacturer and company outreach", tier: "PRO", border: "blue" },
  { id: "sbir-grant", icon: FileText, title: "SBIR / STTR Grant Sections", desc: "Grant-ready research justification and innovation significance sections", tier: "PRO", border: "violet" },
  { id: "suppression-dossier", icon: Microscope, title: "Suppression Dossier", desc: "Fully cited historical and scientific documentation for any research node", tier: "ENTERPRISE", border: "red" },
  { id: "device-engineering", icon: Building2, title: "Device Engineering Package", desc: "Concept spec sheet, modality map, frequency matrix, component list for any device plan", tier: "PRO", border: "amber" },
  { id: "multi-system-analysis", icon: GitBranch, title: "Multi-System Integration Analysis", desc: "Deep AI analysis of node connections, synergies, and IP differentiation — 15-30 pages", tier: "ENTERPRISE", border: "gradient" },
  { id: "tech-one-pager", icon: File, title: "Technology One-Pager", desc: "Clean single-page technology overview for early conversations and introductions", tier: "FREE", border: "gray" },
  // ── Build Plan Sections 11–18 (individually exportable) ──
  { id: "zarp-pdr", icon: ClipboardCheck, title: "Preliminary Design Review (PDR)", desc: "ZARP-PDR-XXXX — Design decisions, risk assessment, and mitigation strategies for your device plan", tier: "PRO", border: "amber" },
  { id: "zarp-prd", icon: FileText, title: "Product Requirements Document (PRD)", desc: "ZARP-PRD-XXXX — Purpose, scope, requirements, and success metrics for your device build", tier: "PRO", border: "green" },
  { id: "zarp-bom", icon: FileStack, title: "Conceptual Bill of Materials (BOM)", desc: "ZARP-BOM-XXXX — Component list with reference designators and quantities — conceptual, subject to manufacturer validation", tier: "PRO", border: "blue" },
  { id: "zarp-sow", icon: ClipboardCheck, title: "Statements of Work (SOW 001-005)", desc: "ZARP-SOW-XXXX — Work breakdown structure, deliverables, and timeline across five project phases", tier: "PRO", border: "violet" },
  { id: "zarp-val", icon: DollarSign, title: "IP Valuation Framework", desc: "ZARP-VAL-XXXX — Professional-grade IP valuation framework — generated from your ZARP research and device data", tier: "PRO", border: "gold" },
  { id: "zarp-clr", icon: TrendingUp, title: "Commercialization & Licensing Roadmap", desc: "ZARP-CLR-XXXX — Phase-by-phase go-to-market and licensing strategy for your innovation portfolio", tier: "PRO", border: "green" },
  { id: "zarp-gfr", icon: GraduationCap, title: "Grant Funding Roadmap", desc: "ZARP-GFR-XXXX — SBIR/STTR, NIH, DOE, and foundation grant alignment with application timelines", tier: "PRO", border: "violet" },
  { id: "zarp-inv", icon: Users, title: "Investor Profiles & Outreach Templates", desc: "ZARP-INV-XXXX — Target investor profiles, outreach templates, and communication strategy", tier: "PRO", border: "blue" },
];

const BORDER_STYLES = {
  gold: { borderColor: "hsl(var(--zarp-gold) / 0.5)", glow: "hsl(var(--zarp-gold) / 0.1)" },
  blue: { borderColor: "hsl(var(--zarp-blue) / 0.5)", glow: "hsl(var(--zarp-blue) / 0.1)" },
  violet: { borderColor: "hsl(var(--zarp-violet) / 0.5)", glow: "hsl(var(--zarp-violet) / 0.1)" },
  red: { borderColor: "hsl(var(--zarp-red) / 0.5)", glow: "hsl(var(--zarp-red) / 0.1)" },
  amber: { borderColor: "hsl(var(--zarp-amber) / 0.5)", glow: "hsl(var(--zarp-amber) / 0.1)" },
  green: { borderColor: "hsl(var(--zarp-green) / 0.5)", glow: "hsl(var(--zarp-green) / 0.1)" },
  gradient: { borderColor: "hsl(var(--zarp-violet) / 0.5)", glow: "linear-gradient(135deg, hsl(var(--zarp-violet) / 0.1), hsl(var(--zarp-gold) / 0.1))" },
  gray: { borderColor: "hsl(var(--zarp-border))", glow: "transparent" },
};

const TIER_BADGE = {
  PRO: { bg: "hsl(var(--zarp-gold) / 0.15)", color: "hsl(var(--zarp-gold))" },
  ENTERPRISE: { bg: "hsl(var(--zarp-violet) / 0.15)", color: "hsl(var(--zarp-violet))" },
  FREE: { bg: "hsl(var(--zarp-green) / 0.15)", color: "hsl(var(--zarp-green))" },
};

export default function ExportTypeSelector({ onSelect, userTier }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: "hsl(var(--zarp-gold))" }} />
        <h2 className="text-zarp-text font-bold text-base">Export Products</h2>
        <span className="text-zarp-muted text-xs">— select a document type to generate</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {EXPORT_PRODUCTS.map(p => {
          const bs = BORDER_STYLES[p.border];
          const tb = TIER_BADGE[p.tier];
          const Icon = p.icon;
          const locked = p.tier === "ENTERPRISE" && userTier !== "ENTERPRISE";
          return (
            <div
              key={p.id}
              className="relative rounded-xl border bg-zarp-card p-4 flex flex-col gap-3 transition-all hover:scale-[1.02]"
              style={{ borderColor: bs.borderColor, background: p.flagship ? `linear-gradient(135deg, hsl(var(--zarp-card)), ${bs.glow})` : undefined }}
            >
              {p.flagship && (
                <span className="absolute -top-2 left-3 px-2 py-0.5 rounded text-[8px] font-black tracking-wider text-zarp-bg" style={{ backgroundColor: "hsl(var(--zarp-gold))" }}>
                  FLAGSHIP
                </span>
              )}
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: bs.glow, border: `1px solid ${bs.borderColor}` }}>
                  <Icon size={18} style={{ color: p.border === "gold" ? "hsl(var(--zarp-gold))" : p.border === "blue" ? "hsl(var(--zarp-blue))" : p.border === "violet" ? "hsl(var(--zarp-violet))" : p.border === "red" ? "hsl(var(--zarp-red))" : p.border === "amber" ? "hsl(var(--zarp-amber))" : p.border === "green" ? "hsl(var(--zarp-green))" : "hsl(var(--zarp-muted))" }} />
                </div>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider" style={{ backgroundColor: tb.bg, color: tb.color }}>
                  {p.tier}
                </span>
              </div>
              <div>
                <h3 className="text-zarp-text font-bold text-sm leading-tight">{p.title}</h3>
                <p className="text-zarp-muted text-[11px] leading-relaxed mt-1">{p.desc}</p>
              </div>
              <button
                onClick={() => !locked && onSelect(p.id)}
                disabled={locked}
                className={`mt-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${locked ? "bg-zarp-elevated text-zarp-muted cursor-not-allowed" : "text-zarp-bg"}`}
                style={!locked ? { backgroundColor: p.border === "gold" ? "hsl(var(--zarp-gold))" : p.border === "blue" ? "hsl(var(--zarp-blue))" : p.border === "violet" ? "hsl(var(--zarp-violet))" : p.border === "red" ? "hsl(var(--zarp-red))" : p.border === "amber" ? "hsl(var(--zarp-amber))" : p.border === "green" ? "hsl(var(--zarp-green))" : p.border === "gradient" ? "hsl(var(--zarp-violet))" : "hsl(var(--zarp-muted))" } : undefined}
              >
                {locked ? (<><Lock size={12} /> Enterprise Only</>) : (<>Generate <ChevronRight size={12} /></>)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}