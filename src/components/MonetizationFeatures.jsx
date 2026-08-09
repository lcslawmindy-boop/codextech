import { Link } from "react-router-dom";
import { TrendingUp, Building2, Handshake, DollarSign, Briefcase, LineChart } from "lucide-react";

const FEATURES = [
  {
    title: "Investor Portal",
    desc: "Pitch builder, market deck, investor CRM, and outreach workflow with likelihood scoring.",
    icon: TrendingUp,
    color: "#22c55e",
    to: "/investors",
    stat: "CRM + scoring",
    tag: "Funding",
  },
  {
    title: "IP Marketplace",
    desc: "List, value, and license patents. Opportunity cards with verified inventor badges.",
    icon: DollarSign,
    color: "#f59e0b",
    to: "/ip-marketplace",
    stat: "Live",
    tag: "Licensing",
  },
  {
    title: "Acquisition Suite",
    desc: "Acquisition CRM, outreach tracker, term sheet generator, and exit advisor.",
    icon: Building2,
    color: "#a855f7",
    to: "/zarp-acquisition",
    stat: "5 tools",
    tag: "M&A",
  },
  {
    title: "Valuation Engine",
    desc: "IP valuation dashboard, slider tool, and API endpoint for real-time portfolio pricing.",
    icon: LineChart,
    color: "#06b6d4",
    to: "/valuation",
    stat: "API + UI",
    tag: "Valuation",
  },
  {
    title: "Virtual Data Room",
    desc: "Secure NDA-gated document sharing for due diligence with audit logs and access controls.",
    icon: Briefcase,
    color: "#ec4899",
    to: "/vdr-admin",
    stat: "NDA-gated",
    tag: "Due Diligence",
  },
  {
    title: "Co-Inventor Matching",
    desc: "Match with complementary inventors and collaborate on shared patent drafts.",
    icon: Handshake,
    color: "#3b82f6",
    to: "/co-inventor-matching",
    stat: "Matching",
    tag: "Collaboration",
  },
];

export default function MonetizationFeatures() {
  return (
    <section className="py-14 px-6 bg-gray-950 border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-800/50 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
              <DollarSign size={12} /> Monetization Engine
            </div>
            <h2 className="text-2xl font-black text-white">Turn Research Into Revenue</h2>
            <p className="text-gray-500 text-sm mt-1">Investor tools, licensing, acquisition, and valuation — the full IP monetization stack</p>
          </div>
          <Link to="/investors" className="text-amber-400 hover:text-amber-300 text-sm font-bold flex items-center gap-1">
            Explore monetization →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Link
                key={i}
                to={f.to}
                className="group bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                    <Icon size={18} style={{ color: f.color }} />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-800 text-gray-500 border border-gray-700">{f.tag}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold text-base">{f.title}</h3>
                  <span className="text-[10px] font-mono text-gray-600">{f.stat}</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}