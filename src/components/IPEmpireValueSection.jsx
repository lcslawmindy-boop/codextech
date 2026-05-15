import { Link } from "react-router-dom";
import {
  BookOpen, Wrench, FileText, Zap, Shield, Database, Users, Globe,
  TrendingUp, Lock, Star, ChevronRight, DollarSign, Cpu, FlaskConical,
  Award, BarChart2, Radio, Microscope, Search, GitMerge, Package,
  ArrowRight
} from "lucide-react";

const EMPIRE_PILLARS = [
  {
    icon: <Database size={20} />,
    color: "#06b6d4",
    title: "Research Archive",
    value: "$2,400/yr value",
    tag: "ALL TIERS",
    tagColor: "#06b6d4",
    desc: "The most comprehensive curated library of fringe-science, Tesla-tech, and advanced EM research on the internet.",
    bullets: [
      "200+ patent-sourced research entries with inline citations",
      "Bearden Concept Graph — 100+ nodes of scalar EM & free energy theory",
      "All prior art documents, declassified papers & historical patents",
      "Engineering glossary with 300+ technical definitions",
      "Full interactive node-link map connecting every invention",
    ],
    why: "Know the landscape before you build. Every great IP empire starts with knowing what's already been discovered — and where the white space is.",
  },
  {
    icon: <Wrench size={20} />,
    color: "#f97316",
    title: "Invention Build Plans",
    value: "$150–$600 each",
    tag: "MEMBER",
    tagColor: "#f97316",
    desc: "Attorney-grade, patent-sourced build documentation. Every plan is buildable — not theoretical.",
    bullets: [
      "40+ complete device build plans — MEG, Prioré, KRCIC, ELF Detector & more",
      "Calibrated Bill of Materials with exact part numbers & verified supplier links",
      "Full circuit schematics, wiring diagrams & PCB layouts",
      "Step-by-step assembly instructions with safety protocols",
      "25–40 reserved plans in Pro (updated monthly)",
      "À la carte menu — buy individual plans at 25% member discount",
    ],
    why: "A working prototype is worth 10x more in a patent filing than a drawing alone. Build it. Prove it. Own it.",
  },
  {
    icon: <BookOpen size={20} />,
    color: "#a855f7",
    title: "Structured Course Library",
    value: "$297–$997 each",
    tag: "MEMBER",
    tagColor: "#a855f7",
    desc: "Deep engineering courses taught through real patent literature, lab experiments, and device construction.",
    bullets: [
      "40+ courses from beginner to advanced (RF, resonance, EM instrumentation, FPGA)",
      "New course dropped every month for all paid tiers",
      "Bioelectromagnetics, scalar field theory, signal analysis tracks",
      "Lab-based learning with practical device labs",
      "Certificate-level depth — covers material unavailable in any university curriculum",
    ],
    why: "Your IP is only defensible if you understand the underlying science. These courses turn you from a hobbyist into a credible inventor.",
  },
  {
    icon: <FileText size={20} />,
    color: "#fbbf24",
    title: "AI Patent Suite",
    value: "$500–$5,000 per filing",
    tag: "RESEARCH+",
    tagColor: "#fbbf24",
    desc: "AI-assisted patent research tools. Draft, analyze, and monitor your IP landscape — at a fraction of traditional research costs. Not a substitute for licensed legal counsel.",
    bullets: [
      "USPTO-formatted patent drafting wizard (provisional & full utility)",
      "AI patent research assistant — explore IP strategy questions and prior art",
      "Novelty analysis — check if your idea is truly new before filing",
      "Freedom-to-Operate (FTO) research — find what you can build without infringing",
      "Automated patent threat monitoring — get alerted when competitors file near your IP",
      "Competitive landscape mapping & prior art cross-referencing",
    ],
    why: "A single patent can be worth millions. The AI Patent Suite gives you a powerful research and drafting toolkit — always pair with a licensed patent attorney before filing.",
  },
  {
    icon: <Zap size={20} />,
    color: "#22c55e",
    title: "Invention Forge (AI)",
    value: "$1,000+ per concept",
    tag: "RESEARCH+",
    tagColor: "#22c55e",
    desc: "The most powerful AI invention engine ever built for fringe-tech researchers. Combine any two devices from the library to generate a brand-new hybrid IP concept.",
    bullets: [
      "Select 2–4 devices → AI synthesizes a novel hybrid invention concept",
      "Generates full patent claims (independent + dependent)",
      "IP valuation estimate — know what it's worth before you file",
      "Market application analysis across 8+ sectors",
      "Synergy score — how novel is the combination?",
      "Commercialization roadmap & licensing strategy",
      "Save, export, and track your generated IP portfolio",
    ],
    why: "Most inventors miss the biggest opportunity: combining existing IP into something new. The Forge finds those gaps automatically.",
  },
  {
    icon: <Globe size={20} />,
    color: "#ec4899",
    title: "IP Marketplace",
    value: "Earn royalties & licensing fees",
    tag: "PRO ONLY",
    tagColor: "#ec4899",
    desc: "List your inventions, license your IP, find co-inventors, and connect with investors — all in one platform.",
    bullets: [
      "List your IP as an Opportunity Card — visible to investors & co-inventors",
      "Co-Inventor Matching — find technical partners for your project",
      "Licensing portal — offer your IP for institutional or commercial licensing",
      "Investor CRM — track outreach, meetings, and term sheets",
      "Virtual Data Room (VDR) — securely share IP docs under NDA with buyers",
      "SBIR grant pipeline — identify and apply for government R&D funding",
    ],
    why: "Owning IP is only step one. The Marketplace turns your patents and prototypes into revenue streams.",
  },
  {
    icon: <Shield size={20} />,
    color: "#3b82f6",
    title: "Virtual Data Room (VDR)",
    value: "$300–$1,500/mo value",
    tag: "PRO ONLY",
    tagColor: "#3b82f6",
    desc: "A secure, NDA-gated room for sharing confidential IP with serious investors and acquirers.",
    bullets: [
      "Time-limited access tokens with full audit trail",
      "DocuSign-integrated NDA signing before any docs are viewable",
      "Page-level view tracking — see exactly what investors spend time on",
      "Revoke access instantly if needed",
      "Upload schematics, prototypes, valuations, and patent drafts",
      "Investor package generator — auto-creates professional deal docs",
    ],
    why: "Serious deals require serious infrastructure. The VDR is what separates a casual pitch from a $500K acquisition conversation.",
  },
  {
    icon: <BarChart2 size={20} />,
    color: "#14b8a6",
    title: "Patent Landscape & Monitoring",
    value: "$200–$800/mo value",
    tag: "RESEARCH+",
    tagColor: "#14b8a6",
    desc: "Real-time threat intelligence for your IP. Know when competitors are filing, when your category is heating up, and what prior art could threaten your claims.",
    bullets: [
      "Automated patent filing alerts in your technology domain",
      "Competitive landscape graph — visualize who owns what",
      "Prior art archive cross-reference against your claims",
      "Risk scoring for each patent threat (critical / high / medium)",
      "Suppression pattern detection — know if your tech is being buried",
      "Weekly monitoring digest delivered to your inbox",
    ],
    why: "Your patent is only as strong as your awareness of the field. Stay ahead of every threat before it becomes a problem.",
  },
  {
    icon: <FlaskConical size={20} />,
    color: "#8b5cf6",
    title: "Lab Simulation & Scalar EM Tools",
    value: "$400/yr value",
    tag: "ALL TIERS",
    tagColor: "#8b5cf6",
    desc: "Run virtual experiments before you build anything. Validate resonance, scalar field behaviour, and interference patterns in browser.",
    bullets: [
      "Scalar EM lab — interactive wave simulation with real-time parameter control",
      "Interference pattern visualizer — dual-source frequency modelling",
      "Scalar potential field mapper",
      "EMF exposure logger & analysis",
      "Bioelectromagnetics research simulator",
    ],
    why: "Simulation saves hundreds in wasted components. Validate your theory before ordering a single part.",
  },
  {
    icon: <Users size={20} />,
    color: "#f59e0b",
    title: "Researcher Community & Forum",
    value: "Priceless network",
    tag: "ALL TIERS",
    tagColor: "#f59e0b",
    desc: "A private community of serious engineers, experimenters, and inventors — not hobbyists, not theorists.",
    bullets: [
      "Build troubleshooting threads — get expert eyes on your assembly",
      "Patent discussion & strategy forums",
      "Weekly expert Q&A sessions",
      "Co-inventor matching & collaboration boards",
      "Early access voting on new build plans & courses",
      "Member-only contest & IP challenge prizes",
    ],
    why: "The right network is worth more than the right tool. One connection here could fund your next patent filing.",
  },
];

const TOTAL_VALUES = [
  { label: "Research Archive", value: "$2,400/yr" },
  { label: "10 Build Plans (avg)", value: "$1,500" },
  { label: "5 Courses (avg)", value: "$2,000" },
  { label: "AI Patent Suite (2 filings)", value: "$3,000" },
  { label: "Invention Forge (5 concepts)", value: "$5,000" },
  { label: "Lab Simulation Tools", value: "$400/yr" },
  { label: "VDR Room", value: "$900/yr" },
  { label: "Patent Monitoring", value: "$600/yr" },
];

export default function IPEmpireValueSection() {
  return (
    <section className="px-6 py-24 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-950/50 border border-yellow-800/50 text-yellow-300 text-xs font-bold mb-5 uppercase tracking-widest">
          <Star size={10} className="text-yellow-400" /> Your IP Empire Toolkit
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
          Everything You Need to<br />
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
            Build, Patent & Monetize Your IP
          </span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          This isn't a course platform. It's a full invention-to-commercialization operating system — every tool you need from idea to licensed patent, under one membership.
        </p>
      </div>

      {/* Value stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
        {EMPIRE_PILLARS.map((pillar, i) => (
          <div
            key={i}
            className="rounded-2xl border overflow-hidden flex flex-col"
            style={{ borderColor: pillar.color + "40", background: "linear-gradient(160deg,#050d1a 60%,#010810 100%)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3" style={{ borderBottom: `1px solid ${pillar.color}20` }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: pillar.color + "20", color: pillar.color }}>
                  {pillar.icon}
                </div>
                <div>
                  <p className="text-white font-black text-base leading-tight">{pillar.title}</p>
                  <p className="text-xs font-bold" style={{ color: pillar.color }}>{pillar.value}</p>
                </div>
              </div>
              <span className="text-xs font-black px-2 py-1 rounded-full" style={{ backgroundColor: pillar.color + "22", color: pillar.color, border: `1px solid ${pillar.color}55` }}>
                {pillar.tag}
              </span>
            </div>

            {/* Body */}
            <div className="px-5 py-4 flex-1">
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">{pillar.desc}</p>
              <ul className="space-y-1.5 mb-4">
                {pillar.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-slate-300">
                    <ChevronRight size={11} className="flex-shrink-0 mt-0.5" style={{ color: pillar.color }} />
                    {b}
                  </li>
                ))}
              </ul>
              {/* WHY it matters */}
              <div className="rounded-lg px-3 py-2.5" style={{ backgroundColor: pillar.color + "12", border: `1px solid ${pillar.color}25` }}>
                <p className="text-xs font-black uppercase tracking-wider mb-1" style={{ color: pillar.color }}>Why It Matters</p>
                <p className="text-slate-300 text-xs leading-relaxed italic">"{pillar.why}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total value stack */}
      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-8 mb-10">
        <h3 className="text-2xl font-black text-white text-center mb-2">Total Platform Value</h3>
        <p className="text-slate-400 text-sm text-center mb-8">What you'd pay if you sourced each tool separately</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {TOTAL_VALUES.map((v, i) => (
            <div key={i} className="text-center bg-slate-800/60 rounded-xl p-4 border border-slate-700">
              <p className="text-green-400 font-black text-lg">{v.value}</p>
              <p className="text-slate-400 text-xs mt-1">{v.label}</p>
            </div>
          ))}
        </div>
        <div className="text-center border-t border-slate-700 pt-6">
          <p className="text-slate-500 text-sm mb-1">Estimated retail value if purchased separately</p>
          <p className="text-5xl font-black text-white mb-1">$15,800+</p>
          <p className="text-slate-400 text-sm mb-6">Get full access starting at</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-cyan-400 font-black text-3xl">$29<span className="text-lg text-slate-500">/mo</span></p>
              <p className="text-slate-500 text-xs mt-1">Explorer Tier</p>
            </div>
            <div className="text-slate-700 text-2xl font-black">→</div>
            <div className="text-center">
              <p className="text-purple-400 font-black text-3xl">$49<span className="text-lg text-slate-500">/mo</span></p>
              <p className="text-slate-500 text-xs mt-1">Research Lab</p>
            </div>
            <div className="text-slate-700 text-2xl font-black">→</div>
            <div className="text-center">
              <p className="text-orange-400 font-black text-3xl">$99<span className="text-lg text-slate-500">/mo</span></p>
              <p className="text-slate-500 text-xs mt-1">Pro Builder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center">
        <a href="#pricing"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-white text-base transition-all shadow-lg"
          style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)", boxShadow: "0 4px 30px rgba(124,58,237,0.4)" }}>
          Choose Your Membership <ArrowRight size={16} />
        </a>
        <p className="text-slate-600 text-xs mt-3">Cancel anytime · Instant access · Secured by Stripe</p>
      </div>
    </section>
  );
}