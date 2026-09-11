// À la carte products — individual purchases, no memberships.
// Each product costs credits. Users buy credit packs, then spend on products.
// Build plans are NOT for sale — research only.

export const PRODUCTS = [
  {
    id: "research-database",
    name: "Research Database",
    desc: "Full access to 200+ suppressed tech entries, Vedic concepts, concept graph, and prior art archive.",
    creditCost: 10,
    price: 49,
    color: "#06b6d4",
    icon: "Database",
    route: "/expanded-research",
    features: [
      "200+ research entries with inline citations",
      "Interactive concept graph (100+ nodes)",
      "Prior art archive (200+ patent entries)",
      "Engineering glossary & reference library",
    ],
  },
  {
    id: "courses",
    name: "Course Library",
    desc: "40+ structured engineering courses — RF, resonance, EM instrumentation, FPGA, embedded systems.",
    creditCost: 40,
    price: 197,
    color: "#a855f7",
    icon: "BookOpen",
    route: "/courses",
    features: [
      "40+ structured courses (beginner to advanced)",
      "RF systems, resonance & EM instrumentation",
      "FPGA, Arduino & embedded labs",
      "Signal analysis & measurement methodology",
    ],
  },
  {
    id: "invention-forge",
    name: "Invention Forge",
    desc: "AI-powered hybrid invention generation with IP valuation, patent claims, and commercialization roadmap.",
    creditCost: 20,
    price: 97,
    color: "#22c55e",
    icon: "FlaskConical",
    route: "/invention-forge",
    features: [
      "AI hybrid concept generation engine",
      "IP valuation estimation tool",
      "Patent claim generation",
      "Commercialization roadmap",
    ],
  },
  {
    id: "patent-suite",
    name: "AI Patent Suite",
    desc: "USPTO-format patent drafting, novelty analysis, freedom-to-operate research, and threat monitoring.",
    creditCost: 30,
    price: 147,
    color: "#eab308",
    icon: "Shield",
    route: "/patent-hub",
    features: [
      "USPTO-formatted patent drafting wizard",
      "Novelty & freedom-to-operate analysis",
      "Competitive landscape mapping",
      "Automated patent threat monitoring",
    ],
  },
  {
    id: "pitch-deck",
    name: "Investor Pitch Deck",
    desc: "Auto-generated investor pitch deck with IP valuation, market analysis, and financial projections.",
    creditCost: 60,
    price: 297,
    color: "#f97316",
    icon: "FileText",
    route: "/investor-package-builder",
    features: [
      "Auto-generated investor pitch deck",
      "IP valuation & market analysis",
      "Financial projections & revenue model",
      "Export to PDF & Google Slides",
    ],
  },
];

export const BUILD_PLANS_INFO = {
  name: "Build Plans",
  desc: "40+ engineering build plans with full BOM, schematics, and assembly guides.",
  features: [
    "Complete BOM with exact part numbers",
    "Circuit schematics & wiring diagrams",
    "Step-by-step assembly instructions",
    "Calibrated measurement protocols",
  ],
};