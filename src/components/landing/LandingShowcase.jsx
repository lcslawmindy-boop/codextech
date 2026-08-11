import { useState } from "react";
import { Database, Cpu, FileText, Download, Rss, Check } from "lucide-react";

const TABS = [
  { id: "graph", label: "Research Graph", icon: <Database size={14} /> },
  { id: "builder", label: "Device Builder", icon: <Cpu size={14} /> },
  { id: "ip", label: "IP Drafting Suite", icon: <FileText size={14} /> },
  { id: "export", label: "Export Center", icon: <Download size={14} /> },
  { id: "feed", label: "Innovation Feed", icon: <Rss size={14} /> },
];

const TAB_CONTENT = {
  graph: {
    title: "Research Graph",
    features: [
      "500+ research nodes across 12 domains",
      "Color-coded by domain, suppression level, evidence quality",
      "Filter panel: domain / population / frequency range / suppression status",
      "Click any node for full researcher dossier, documented effects, source citations",
      "Save nodes to custom Research Collections",
      "Share node clusters with collaborators",
    ],
  },
  builder: {
    title: "Device Builder",
    features: [
      "Select 3-10 research nodes to combine",
      "AI generates multi-system Device Architecture Plan",
      "Includes: technology stack, modality map, frequency protocols, component list",
      "Every output labeled: CONCEPT — Subject to Manufacturer Validation",
      "Export as PDF, DOCX, or structured JSON",
    ],
  },
  ip: {
    title: "IP Drafting Suite",
    features: [
      "Auto-generate provisional patent claim frameworks from device build plans",
      "Trade secret documentation templates",
      "Innovation disclosure worksheets",
      "IP portfolio tracker with filing status dashboard",
      "Integration novelty analysis — what makes YOUR combination unique",
      "Export ready for patent attorney review",
    ],
  },
  export: {
    title: "Export Center",
    features: [
      "Investor Package Builder — full branded PDF with legal disclaimers",
      "Grant Application Sections — SBIR/STTR-ready research justification",
      "Technology Brief — 1-pager for licensing discussions",
      "Device Engineering Package — concept spec sheets with figures",
      "Suppression Dossier — documented research history for each technology",
      "All exports include legal disclaimers and no medical claims language",
    ],
  },
  feed: {
    title: "Innovation Feed",
    features: [
      "Daily curated research drops — newly surfaced papers, patents, declassified documents",
      "Connection alerts — new edges discovered between research nodes",
      "Community innovations — see what others are building (anonymized)",
      "Technology licensing opportunities — companies seeking IP in your domains",
      "Grant deadline tracker for relevant SBIR/STTR/NIH programs",
    ],
  },
};

export default function LandingShowcase() {
  const [activeTab, setActiveTab] = useState("graph");
  const content = TAB_CONTENT[activeTab];

  return (
    <section id="features" className="relative py-24 bg-zarp-card">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-4 text-zarp-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Everything You Need to Go From <span className="text-zarp-gold">Idea to IP</span>
        </h2>
        <p className="text-center text-zarp-muted mb-12 max-w-2xl mx-auto">
          Five integrated tools that take you from research exploration to investor-ready documentation.
        </p>

        {/* Tab nav */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all border ${
                activeTab === tab.id
                  ? "bg-zarp-gold/10 border-zarp-gold/50 text-zarp-gold"
                  : "border-zarp-border text-zarp-muted hover:text-zarp-text"
              }`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Mockup */}
          <div className="bg-zarp-bg border border-zarp-border rounded-2xl p-6 h-80 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-8 bg-zarp-elevated flex items-center gap-1.5 px-4">
              <div className="w-2.5 h-2.5 rounded-full bg-zarp-red/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-zarp-amber/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-zarp-green/60" />
            </div>
            <div className="pt-6 text-center">
              {activeTab === "graph" && (
                <div className="relative w-full h-full flex items-center justify-center">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="absolute w-3 h-3 rounded-full" style={{
                      backgroundColor: i % 3 === 0 ? 'hsl(var(--zarp-gold))' : i % 3 === 1 ? 'hsl(var(--zarp-blue))' : 'hsl(var(--zarp-violet))',
                      left: `${10 + (i % 4) * 25}%`, top: `${15 + Math.floor(i / 4) * 30}%`,
                      boxShadow: '0 0 10px currentColor',
                    }} />
                  ))}
                </div>
              )}
              {activeTab === "builder" && (
                <div className="space-y-2 w-full px-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded bg-zarp-elevated">
                      <div className="w-6 h-6 rounded bg-zarp-gold/20" />
                      <div className="flex-1 h-2 rounded bg-zarp-border" />
                      <div className="px-2 py-0.5 rounded text-[9px] bg-zarp-violet/20 text-zarp-violet">NODE</div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "ip" && (
                <div className="space-y-2 w-full px-4 text-left">
                  <div className="text-xs font-mono text-zarp-gold">CLAIM 1 (independent)</div>
                  <div className="h-2 rounded bg-zarp-elevated w-full" />
                  <div className="h-2 rounded bg-zarp-elevated w-4/5" />
                  <div className="text-xs font-mono text-zarp-blue mt-2">CLAIM 2 (dependent)</div>
                  <div className="h-2 rounded bg-zarp-elevated w-3/5" />
                </div>
              )}
              {activeTab === "export" && (
                <div className="space-y-2 w-full px-4">
                  {["Investor Package", "Grant Section", "Tech Brief", "Engineering Pkg"].map((name, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded bg-zarp-elevated">
                      <Download size={12} className="text-zarp-green" />
                      <span className="text-xs text-zarp-text">{name}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "feed" && (
                <div className="space-y-2 w-full px-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-2 rounded bg-zarp-elevated border-l-2 border-zarp-gold">
                      <div className="h-2 rounded bg-zarp-border w-3/4 mb-1" />
                      <div className="h-1.5 rounded bg-zarp-border w-1/2" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Feature list */}
          <div>
            <h3 className="text-xl font-bold text-zarp-text mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>{content.title}</h3>
            <div className="space-y-3">
              {content.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-zarp-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-zarp-green" />
                  </div>
                  <p className="text-zarp-muted text-sm leading-relaxed">{feat}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}