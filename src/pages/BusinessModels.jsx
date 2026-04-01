import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Zap, FlaskConical, DollarSign, Package, GraduationCap, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";

const CATEGORIES = ["All", "Course", "Book/PDF", "Product", "Invention", "Service"];

const items = [
  // ── COURSES ──────────────────────────────────────────────────────────────
  {
    category: "Course",
    title: "Scalar Electromagnetics: From Maxwell to Bearden",
    tagline: "The suppressed physics they didn't teach in school",
    price: "$197",
    audience: "Engineers, physicists, curious intellectuals",
    description:
      "A structured 8-module video course walking students from classical Maxwell equations through Bearden's scalar/vacuum extensions. Covers: massless charge vs charged mass, the V=IR limitation, scalar phi-fields without E or H fields, the Dirac Sea free-electron mechanism, and practical vacuum oscillation circuits. Includes annotated scans of original 1982 source papers.",
    modules: [
      "Module 1 – What Maxwell Actually Wrote (vs what we teach)",
      "Module 2 – The Vacuum Is Not Empty: 200MV of Massless Charge",
      "Module 3 – Scalar Waves: Phi-field Without E or H",
      "Module 4 – The Bird on the Power Line (analogy deep dive)",
      "Module 5 – Dirac Sea Oscillation & Free Electron Lift",
      "Module 6 – V=IR: The 3-in-1 Trap",
      "Module 7 – Historical Suppression: Tesla, T.T. Brown, Edwin Gray",
      "Module 8 – Open Systems vs Closed Systems in EM Engineering",
    ],
    source: "Bearden 1982 'Comments on New Tesla EM, Part II'; Schaffranke 1982 survey",
    color: "#3b82f6",
    icon: "🔬",
  },
  {
    category: "Course",
    title: "Bioelectromagnetics & the Kindling Effect",
    tagline: "How life is a self-kindling EM phenomenon — and what you can do with that",
    price: "$297",
    audience: "Biohackers, alternative health practitioners, researchers",
    description:
      "Covers Bearden's kindling theory (structuring biopotentials in atomic nuclei), the Kaznacheyev cytopathogenic effect (disease as EM information), Rife's mortal oscillatory rates, and negentropy in living systems. Students learn how disease may be electromagnetically transmitted and potentially reversed using structured frequency fields.",
    modules: [
      "Module 1 – The Body as a Bioelectromagnetic System",
      "Module 2 – Kindling: Charging Nuclear Mass with Biopotentials",
      "Module 3 – Kaznacheyev: Disease Transmitted by UV Photons",
      "Module 4 – Rife's Prismatic Microscope & Mortal Oscillatory Rates",
      "Module 5 – Negentropy: How Life Fights the 2nd Law",
      "Module 6 – Scalar EM and Engineered Pathogens (historical analysis)",
      "Module 7 – Therapeutic Frequency Applications & Research Directions",
    ],
    source: "Bearden 'Kindling, Life, Mind and Negentropy'; Kaznacheyev cytopathogenic effect",
    color: "#22c55e",
    icon: "🧬",
  },
  {
    category: "Course",
    title: "Mind, Consciousness & the T-Field: Bearden's Hyperspatial Model",
    tagline: "A rigorous framework for understanding mind as a physical phenomenon",
    price: "$147",
    audience: "Philosophers, consciousness researchers, spiritual seekers with scientific bent",
    description:
      "Walks through Bearden's nested modulation hierarchy (L³→L²→LT→T), the bioframe/orthorotation model, and how mind exists in the T (time) dimension just 3 orthorotations from physical reality. Includes his temporal extension of Aristotelian logic and the layered consciousness hierarchy from personal unconscious to universal.",
    modules: [
      "Module 1 – The 4-Level Modulation Hierarchy",
      "Module 2 – Bioframes & Orthorotation",
      "Module 3 – The Mind Field in the T-Dimension",
      "Module 4 – Temporal Logic: Aristotle Extended",
      "Module 5 – Consciousness Layers: Personal to Universal",
      "Module 6 – Reincarnation as Physical Re-tuning",
    ],
    source: "Bearden bioframe diagrams; temporal logic tables; consciousness hierarchy model",
    color: "#a855f7",
    icon: "🧠",
  },

  // ── BOOKS / PDFs ─────────────────────────────────────────────────────────
  {
    category: "Book/PDF",
    title: "The Annotated Bearden: Primary Sources with Commentary",
    tagline: "Every key paper, decoded for the modern reader",
    price: "$49 PDF / $79 print",
    audience: "Serious researchers, collectors, academics",
    description:
      "A curated anthology of Bearden's most important papers (1982–2002) with page-by-page annotations explaining the physics, historical context, and connections to mainstream science. Includes the original 'Comments on the New Tesla Electromagnetics' Parts I & II, the Kaznacheyev analysis, and kindling/negentropy papers. Each section opens with a plain-English summary.",
    modules: [],
    source: "Tesla Book Co. 1984; all source documents in this archive",
    color: "#f59e0b",
    icon: "📖",
  },
  {
    category: "Book/PDF",
    title: "Vacuum Energy Engineering: A Practical Introduction",
    tagline: "From Dirac Sea theory to open-system circuit design",
    price: "$37 PDF",
    audience: "Electrical engineers, DIY inventors, energy researchers",
    description:
      "A concise technical guide bridging Bearden's vacuum oscillation theory with practical circuit concepts. Covers: why standard EM theory assumes zero vacuum potential (and why that's wrong), how to conceptually design open-system energy circuits, analysis of historical prototypes (Kromrey generator, Edwin Gray engine, Searl effect generator), and a framework for evaluating over-unity claims.",
    modules: [],
    source: "Bearden 1982; Schaffranke global survey 1982; Edwin Gray US Patent #3,890,548",
    color: "#f59e0b",
    icon: "⚡",
  },
  {
    category: "Book/PDF",
    title: "Suppressed Science: 10 Inventors They Buried",
    tagline: "Tesla, Rife, Gray, Searl, Schauberger — and what they actually discovered",
    price: "$27 PDF",
    audience: "General public, conspiracy-adjacent readers, history of science buffs",
    description:
      "Accessible narrative history of inventors whose work Bearden references as independent confirmation of scalar/vacuum EM principles. Each chapter covers: the invention, the mechanism, the suppression, and why it matters today. Broader audience entry point that funnels readers toward the technical courses.",
    modules: [],
    source: "Schaffranke 1982; Bearden references throughout primary papers",
    color: "#f59e0b",
    icon: "🕵️",
  },

  // ── PRODUCTS ─────────────────────────────────────────────────────────────
  {
    category: "Product",
    title: "Bearden Concept Research Deck (Card Set)",
    tagline: "80 illustrated cards — every major concept, connection, and quote",
    price: "$34",
    audience: "Students, researchers, educators, enthusiasts",
    description:
      "A physical (or digital PDF print-and-cut) card deck covering all 80+ concepts in the Bearden network: scalar EM, kindling, bioframes, temporal logic, consciousness hierarchy, and more. Each card includes: concept name, group color, 2-sentence definition, key quote from primary sources, and connection arrows. Designed for study, brainstorming, and visual mapping.",
    modules: [],
    source: "Entire Bearden archive",
    color: "#06b6d4",
    icon: "🃏",
  },
  {
    category: "Product",
    title: "Bearden Network Poster (24×36 inch)",
    tagline: "The complete concept graph — print-quality wall art for labs and offices",
    price: "$24",
    audience: "Researchers, enthusiasts, office/lab decoration",
    description:
      "A high-resolution print of the full Bearden Concept Network with all nodes, color-coded by group (physics, biology, weapons, consciousness, history, philosophy), with link labels and brief descriptions. Includes a QR code linking to the interactive digital version.",
    modules: [],
    source: "This app's network graph",
    color: "#06b6d4",
    icon: "🗺️",
  },
  {
    category: "Product",
    title: "Scalar EM Study Guide & Workbook",
    tagline: "Self-paced exercises to master the core framework",
    price: "$19 PDF",
    audience: "Course students, self-learners",
    description:
      "Companion workbook to the Scalar EM course. Includes fill-in diagrams of the modulation hierarchy, circuit analysis exercises contrasting standard EM vs scalar EM models, Kaznacheyev experiment re-analysis worksheets, and a personal research journal template for tracking your own experimental observations.",
    modules: [],
    source: "Bearden 1982 technical papers",
    color: "#06b6d4",
    icon: "📝",
  },

  // ── INVENTIONS ───────────────────────────────────────────────────────────
  {
    category: "Invention",
    title: "Vacuum Potential Oscillator (VPO) Circuit Kit",
    tagline: "Hands-on exploration of scalar phi-field principles",
    price: "$89 kit",
    audience: "Electrical engineers, advanced hobbyists, researchers",
    description:
      "Based directly on Bearden's Part II mechanism: a resonant LC circuit tuned to shift its vacuum-ground potential independently of the circuit ground, creating a measurable scalar potential difference without mass current flow. The kit includes: custom wound toroids, quartz resonator, measurement guide, and Bearden's original circuit diagrams. Positioned as an 'experimental research tool' — not a free energy device, but a platform for exploring the boundary between standard and extended EM theory.",
    modules: [],
    source: "Bearden 1982 'Comments on New Tesla EM Part II' — vacuum oscillation mechanism",
    color: "#ef4444",
    icon: "🔧",
  },
  {
    category: "Invention",
    title: "Biofield Frequency Exposure Chamber (Research Device)",
    tagline: "Apply structured EM frequencies to biological samples — replicate Kaznacheyev-type experiments",
    price: "$349 assembled / $149 plans",
    audience: "Biophysics researchers, alternative medicine practitioners, lab enthusiasts",
    description:
      "A shielded quartz-windowed exposure chamber for replicating Kaznacheyev-style UV photon transmission experiments. Based on Bearden's analysis: glass blocks the cytopathogenic UV; quartz transmits it. Includes a programmable frequency driver, dual-compartment design with quartz divider, UV-transparent optical path, and data logging. Sell as a research instrument with full documentation.",
    modules: [],
    source: "Bearden analysis of Kaznacheyev experiments; Rife mortal oscillatory rate research",
    color: "#ef4444",
    icon: "🧪",
  },
  {
    category: "Invention",
    title: "Open-System Magnetic Generator (Prototype Plans)",
    tagline: "Engineering plans based on Kromrey/Gray/Searl design principles",
    price: "$79 PDF plans",
    audience: "Advanced DIY engineers, free energy researchers",
    description:
      "Detailed engineering drawings and theory manual for building a rotating electromagnetic open-system generator inspired by the Kromrey G-field generator (France/Germany), Edwin Gray's pulsed capacitor discharge engine, and the Searl effect gyro-flywheel design. Bearden's framework explains these as exploiting the tachion/neutrino sea — the subquantic continuum. Plans include winding specs, magnet geometry, pulse timing, and safety notes.",
    modules: [],
    source: "Schaffranke 1982 survey; Edwin Gray US Patent #3,890,548; Searl generator design notes",
    color: "#ef4444",
    icon: "⚙️",
  },

  // ── SERVICES ─────────────────────────────────────────────────────────────
  {
    category: "Service",
    title: "Private Research Consultation (1-on-1)",
    tagline: "Deep-dive sessions on your specific scalar EM or biofield research project",
    price: "$250/hr",
    audience: "Serious researchers, inventors, academics",
    description:
      "One-on-one video consultation sessions for researchers working in scalar EM, vacuum energy, bioelectromagnetics, or consciousness studies. Using this archive and primary Bearden sources as reference, sessions cover: theoretical framework alignment, experimental design review, circuit analysis, and connections to mainstream physics literature (Dirac, de Broglie, Planck). Packages of 4 and 10 hours available.",
    modules: [],
    source: "Full Bearden archive",
    color: "#6b7280",
    icon: "💬",
  },
  {
    category: "Service",
    title: "Custom Concept Network Map",
    tagline: "A bespoke visual knowledge graph of your research domain",
    price: "$499",
    audience: "Authors, researchers, organizations",
    description:
      "Using the same D3.js network architecture as this app, create a custom interactive concept map for any research domain. Ideal for authors mapping a book's ideas, researchers visualizing a field, or educators creating interactive curricula. Delivered as a standalone web app. Includes data entry session, custom node/link design, AI summary integration per node, and source fragment storage.",
    modules: [],
    source: "This app's architecture",
    color: "#6b7280",
    icon: "🌐",
  },
];

function ItemCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors flex flex-col gap-3"
      style={{ borderLeftColor: item.color, borderLeftWidth: 3 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span
                className="text-xs px-2 py-0.5 rounded font-semibold uppercase tracking-wider"
                style={{ backgroundColor: item.color + "20", color: item.color }}
              >
                {item.category}
              </span>
              <span className="text-green-400 font-bold text-sm">{item.price}</span>
            </div>
            <h3 className="text-white font-bold text-base leading-snug">{item.title}</h3>
            <p className="text-gray-400 text-xs mt-0.5 italic">"{item.tagline}"</p>
          </div>
        </div>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>

      {item.modules.length > 0 && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors self-start"
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? "Hide" : "Show"} {item.modules.length} modules
        </button>
      )}

      {expanded && item.modules.length > 0 && (
        <ol className="list-decimal list-inside space-y-1 pl-1">
          {item.modules.map((m, i) => (
            <li key={i} className="text-gray-400 text-xs leading-snug">{m}</li>
          ))}
        </ol>
      )}

      <div className="mt-auto pt-2 border-t border-gray-800">
        <p className="text-gray-600 text-xs">
          <span className="text-gray-500 font-semibold">Source: </span>{item.source}
        </p>
        <p className="text-gray-600 text-xs mt-1">
          <span className="text-gray-500 font-semibold">Target audience: </span>{item.audience}
        </p>
      </div>
    </div>
  );
}

export default function BusinessModels() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? items : items.filter(i => i.category === activeCategory);

  const totalRevenuePotential = {
    Course: items.filter(i => i.category === "Course").length,
    "Book/PDF": items.filter(i => i.category === "Book/PDF").length,
    Product: items.filter(i => i.category === "Product").length,
    Invention: items.filter(i => i.category === "Invention").length,
    Service: items.filter(i => i.category === "Service").length,
  };

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Graph
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">Business Models & Monetization</h1>
            <p className="text-gray-500 text-xs">Courses, books, products & inventions derived from Bearden's research</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1.5"><GraduationCap size={13} className="text-blue-400" /><span>{totalRevenuePotential.Course} courses</span></div>
          <div className="flex items-center gap-1.5"><BookOpen size={13} className="text-yellow-400" /><span>{totalRevenuePotential["Book/PDF"]} books</span></div>
          <div className="flex items-center gap-1.5"><Package size={13} className="text-cyan-400" /><span>{totalRevenuePotential.Product} products</span></div>
          <div className="flex items-center gap-1.5"><FlaskConical size={13} className="text-red-400" /><span>{totalRevenuePotential.Invention} inventions</span></div>
          <div className="flex items-center gap-1.5"><DollarSign size={13} className="text-green-400" /><span>{totalRevenuePotential.Service} services</span></div>
        </div>
      </div>

      {/* Intro banner */}
      <div className="px-6 py-4 bg-gray-900/60 border-b border-gray-800">
        <div className="max-w-4xl">
          <div className="flex items-start gap-3">
            <Lightbulb size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-gray-300 text-sm leading-relaxed">
              The following business models are derived directly from Bearden's primary source documents analyzed in this archive — including the 1982 <em>Comments on the New Tesla Electromagnetics</em>, Schaffranke's global free-energy technology survey, and the kindling/negentropy biology papers. Each item identifies its source, target audience, suggested price, and actionable description. Use this as a business plan scaffold — every item can be built on Bearden's existing documented research.
            </p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-6 py-3 border-b border-gray-800 flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              activeCategory === cat
                ? "bg-gray-700 border-gray-500 text-white"
                : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500"
            }`}
          >
            {cat} {cat !== "All" && `(${totalRevenuePotential[cat] || 0})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {filtered.map((item, i) => (
            <ItemCard key={i} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}