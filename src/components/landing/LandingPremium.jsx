import { Crown, FileText, Handshake, GraduationCap, Shield, Layers } from "lucide-react";

const FEATURES = [
  {
    icon: <Crown size={22} />,
    title: "Investor Package Generator",
    tier: "PRO",
    text: "Generate a complete, professionally designed Multi-System Investor & Grant Package in minutes. Includes executive summary, technology overview, market analysis, IP status section, use of funds, and financial projections framework.",
    output: "Branded PDF up to 60 pages",
    value: "Replaces $8,000–$15,000 consultant fee",
    color: "gold",
  },
  {
    icon: <FileText size={22} />,
    title: "Patent Claim Draft Framework",
    tier: "PRO",
    text: "Generate structured utility and design patent claim drafts from your device build plan. Covers independent claims, dependent claims, abstract, drawings description, and novelty statement. Ready for attorney review.",
    output: "DOCX + PDF, structured claim sets",
    value: "Saves 10–20 attorney hours",
    color: "gold",
  },
  {
    icon: <Handshake size={22} />,
    title: "Licensing Deal Brief",
    tier: "PRO",
    text: "Generate a one-page Technology Licensing Brief formatted for outreach to established manufacturers, medical device companies, and technology integrators. Includes what you're licensing, why it's valuable, and deal structure options.",
    output: "Branded 1-page PDF + email template",
    value: "Your first licensing conversation, ready to go",
    color: "gold",
  },
  {
    icon: <GraduationCap size={22} />,
    title: "SBIR/STTR Grant Section Builder",
    tier: "PRO",
    text: "Generate research justification, technology description, innovation significance, and commercialization pathway sections for SBIR and STTR grant applications — pre-populated from your ZARP research nodes and device build plans.",
    output: "Word-count-compliant grant sections in DOCX",
    value: "Dramatically reduces grant writing time",
    color: "gold",
  },
  {
    icon: <Shield size={22} />,
    title: "Suppression Dossier Report",
    tier: "ENTERPRISE",
    text: "Generate a fully cited, professionally formatted Suppression Dossier for any technology node — documenting who developed it, what it demonstrated, who suppressed it, how, and what the modern research landscape looks like.",
    output: "10–25 page PDF with citations",
    value: "Research that takes months — delivered in minutes",
    color: "violet",
  },
  {
    icon: <Layers size={22} />,
    title: "Multi-System Integration Analysis",
    tier: "ENTERPRISE",
    text: "Submit your device concept and receive a deep AI-generated analysis of every compatible research node, connection strength, frequency overlap opportunities, biological mechanism synergies, and IP differentiation strategy.",
    output: "15–30 page analysis report PDF",
    value: "Your engineering team's first briefing document",
    color: "violet",
  },
];

export default function LandingPremium() {
  return (
    <section className="relative py-24 bg-zarp-bg">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-4 text-zarp-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Built for <span className="text-zarp-gold">Serious Innovators</span>
        </h2>
        <p className="text-center text-zarp-muted mb-12 max-w-2xl mx-auto">
          ZARP Pro and Enterprise deliver outputs that professional consultants charge $10,000–$50,000 to produce.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(feat => (
            <div
              key={feat.title}
              className="bg-zarp-card border rounded-2xl p-6 hover:scale-[1.02] transition-all group"
              style={{ borderColor: feat.color === "gold" ? 'hsl(var(--zarp-gold) / 0.3)' : 'hsl(var(--zarp-violet) / 0.3)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: feat.color === "gold" ? 'hsl(var(--zarp-gold) / 0.15)' : 'hsl(var(--zarp-violet) / 0.15)',
                    color: feat.color === "gold" ? 'hsl(var(--zarp-gold))' : 'hsl(var(--zarp-violet))',
                  }}
                >
                  {feat.icon}
                </div>
                <span
                  className="px-2 py-1 rounded text-[10px] font-black tracking-wider"
                  style={{
                    backgroundColor: feat.color === "gold" ? 'hsl(var(--zarp-gold) / 0.2)' : 'hsl(var(--zarp-violet) / 0.2)',
                    color: feat.color === "gold" ? 'hsl(var(--zarp-gold))' : 'hsl(var(--zarp-violet))',
                  }}
                >
                  {feat.tier}
                </span>
              </div>
              <h3 className="text-base font-bold text-zarp-text mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>{feat.title}</h3>
              <p className="text-zarp-muted text-xs leading-relaxed mb-4">{feat.text}</p>
              <div className="space-y-1 pt-3 border-t border-zarp-border">
                <p className="text-[10px] text-zarp-text-muted"><span className="font-bold text-zarp-text">Output:</span> {feat.output}</p>
                <p className="text-[10px]" style={{ color: feat.color === "gold" ? 'hsl(var(--zarp-gold))' : 'hsl(var(--zarp-violet))' }}>
                  <span className="font-bold">Value:</span> {feat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}