import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Zap, Download, Save, FileText, BarChart3 } from "lucide-react";

const TECH_CATEGORIES = [
  { id: "em", name: "Electromagnetic", icon: "⚡", desc: "EM energy, scalar fields, resonance" },
  { id: "bioem", name: "Bioelectromagnetic", icon: "🧬", desc: "Biology + EM, frequency devices" },
  { id: "torsion", name: "Torsion Fields", icon: "🌀", desc: "Spin, angular momentum phenomena" },
  { id: "plasma", name: "Plasma Tech", icon: "🔥", desc: "Plasma reactions, ionization" },
  { id: "quantum", name: "Quantum Effects", icon: "🌌", desc: "Quantum tunneling, coherence" },
  { id: "resonance", name: "Resonance Systems", icon: "📿", desc: "Harmonic coupling, cavity modes" },
];

const MONETIZATION_SECTORS = [
  { id: "energy", name: "Energy Generation", icon: "⚡", revenue: "$10B+ TAM" },
  { id: "medical", name: "Medical/Biotech", icon: "🏥", revenue: "$500B+ TAM" },
  { id: "aerospace", name: "Aerospace/Defense", icon: "🚀", revenue: "$600B+ TAM" },
  { id: "industrial", name: "Industrial Manufacturing", icon: "🏭", revenue: "$2T+ TAM" },
  { id: "consumer", name: "Consumer Electronics", icon: "📱", revenue: "$1T+ TAM" },
  { id: "communications", name: "Communications", icon: "📡", revenue: "$1.5T+ TAM" },
];

const SAMPLE_INVENTIONS = [
  { name: "MEG Generator", icon: "⚡", color: "from-cyan-600 to-blue-600" },
  { name: "Scalar Transmitter", icon: "📡", color: "from-purple-600 to-pink-600" },
  { name: "Zero-Point Extractor", icon: "🌌", color: "from-indigo-600 to-purple-600" },
  { name: "Anenergy Pump", icon: "💫", color: "from-yellow-600 to-orange-600" },
  { name: "Prioré Device", icon: "🔬", color: "from-green-600 to-cyan-600" },
  { name: "Torsion Field Generator", icon: "🌀", color: "from-red-600 to-pink-600" },
  { name: "Resonance Cavity", icon: "📿", color: "from-blue-600 to-cyan-600" },
  { name: "BioEM Interface", icon: "🧬", color: "from-green-600 to-emerald-600" },
];

export default function AdvancedInventionDossierGenerator() {
  const [step, setStep] = useState("setup"); // setup, inventions, generating, results
  const [mode, setMode] = useState("hybrid"); // hybrid or custom
  const [selectedInventions, setSelectedInventions] = useState([]);
  const [concept, setConcept] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [spinIndex, setSpinIndex] = useState(0);
  const leverRef = useRef(null);
  let spinInterval = useRef(null);

  const toggleInventionSelection = (inv) => {
    if (selectedInventions.find(s => s.name === inv.name)) {
      setSelectedInventions(selectedInventions.filter(s => s.name !== inv.name));
    } else if (selectedInventions.length < 4) {
      setSelectedInventions([...selectedInventions, inv]);
    }
  };

  const handleGenerateHybrid = async () => {
    if (selectedInventions.length < 2 || !selectedCategory || !selectedSector) return;
    setStep("generating");
    setLoading(true);
    setError(null);
    setSaved(false);
    
    // Start slot machine spinning animation
    spinInterval.current = setInterval(() => {
      setSpinIndex(prev => (prev + 1) % SAMPLE_INVENTIONS.length);
    }, 100);

    // Animate lever pull
    if (leverRef.current) {
      leverRef.current.style.transform = "rotate(45deg)";
      setTimeout(() => {
        leverRef.current.style.transform = "rotate(0deg)";
      }, 300);
    }

    const categoryName = TECH_CATEGORIES.find(c => c.id === selectedCategory)?.name;
    const sectorName = MONETIZATION_SECTORS.find(s => s.id === selectedSector)?.name;
    const inventionList = selectedInventions.map(i => i.name).join(", ");

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an AI patent strategy and commercialization expert specializing in hybrid innovations. Generate a complete Hybrid Invention Dossier by combining these technologies:

INVENTIONS TO COMBINE: ${inventionList}
TECHNOLOGY CATEGORY: ${categoryName}
TARGET MONETIZATION SECTOR: ${sectorName}

Create a novel hybrid system that integrates the best aspects of each invention, identifies synergies, calculates a synergy score (0-100), and generates the complete commercialization strategy as if this hybrid were a new patent-eligible invention.

RESEARCH INSTRUCTIONS: For each invention, analyze its technology base, market position, and synergistic potential. Then design the hybrid system that:
- Maximizes complementary strengths (e.g., one provides power, another provides sensing)
- Reduces combined component count through shared subsystems
- Opens new market applications neither could address alone
- Improves overall performance metrics (efficiency, range, sensitivity, longevity)
- Simplifies manufacturing and reduces BOM complexity

Generate a comprehensive hybrid invention dossier with:
1. Hybrid Concept (name, mechanism, synergy score 0-100)
2. Synergy Analysis (how each invention strengthens the others)
3. Patent Claims (3-5 claims covering the novel hybrid configuration)
4. Market Applications (target sectors, addressable market)
5. Technical Integration (shared subsystems, interface specifications)
6. Commercialization Roadmap (12-month plan for the hybrid product)
7. Bill of Materials (combined BOM with cost reduction vs standalone)
8. IP Valuation (estimated market value, licensing scenarios)

Be detailed and innovative. Format the response as structured JSON.`,
      model: "claude_sonnet_4_6",
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          invention_name: { type: "string" },
          hybrid_concept: { type: "string" },
          synergy_score: { type: "number" },
          synergy_analysis: { type: "string" },
          patent_claims: { type: "array", items: { type: "string" } },
          market_positioning: {
            type: "object",
            properties: {
              target_markets: { type: "array", items: { type: "string" } },
              competitive_advantages: { type: "array", items: { type: "string" } },
              estimated_tam: { type: "string" }
            }
          },
          technical_integration: { type: "string" },
          commercialization_plan: {
            type: "object",
            properties: {
              phase_1: { type: "string" },
              phase_2: { type: "string" },
              phase_3: { type: "string" },
              timeline_months: { type: "number" }
            }
          },
          bom: {
            type: "array",
            items: {
              type: "object",
              properties: {
                component: { type: "string" },
                category: { type: "string" },
                quantity: { type: "number" },
                estimated_cost: { type: "string" }
              }
            }
          },
          valuation: {
            type: "object",
            properties: {
              estimated_value_low: { type: "string" },
              estimated_value_high: { type: "string" },
              licensing_potential: { type: "string" }
            }
          }
        }
      }
    });

    setResult(res.data);
    setLoading(false);
    setStep("results");
    
    // Stop spinning
    if (spinInterval.current) {
      clearInterval(spinInterval.current);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setLoading(true);

    try {
      const res = await base44.functions.invoke("generateInventionDossier", result);

      if (res.data?.success) {
        setSaved(true);
        setError(null);
        
        // Auto-download PDF for user
        if (res.data.pdf_data) {
          const link = document.createElement("a");
          link.href = `data:application/pdf;base64,${res.data.pdf_data}`;
          link.download = res.data.pdf_filename;
          link.click();
        }
      } else {
        setError("Failed to save: " + (res.data?.error || "Unknown error"));
      }
    } catch (err) {
      setError("Error: " + err.message);
    }

    setLoading(false);
  };

  if (!result) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h3 className="text-white font-black text-3xl mb-2 flex items-center gap-2">
            <Zap size={28} className="text-purple-400" /> Invention Dossier Generator
          </h3>
          <p className="text-gray-400 text-sm">AI-powered patent strategy powered by verified research, proven science, and market intelligence. Select your tech category and target sector to generate a complete commercialization dossier.</p>
        </div>

        {step === "setup" ? (
          <div className="space-y-8">
            {/* Mode Selection */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <label className="text-gray-300 text-sm font-bold block mb-4">Choose Your Path</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { setMode("hybrid"); setSelectedInventions([]); }}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    mode === "hybrid"
                      ? "border-cyan-500 bg-cyan-950/30"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                >
                  <p className="font-bold text-white text-sm">🔗 Hybrid Invention</p>
                  <p className="text-gray-400 text-xs mt-1">Combine 2-4 inventions from the library</p>
                </button>
                <button
                  onClick={() => { setMode("custom"); setConcept(""); }}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    mode === "custom"
                      ? "border-purple-500 bg-purple-950/30"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                >
                  <p className="font-bold text-white text-sm">✨ Custom Concept</p>
                  <p className="text-gray-400 text-xs mt-1">Describe your own invention</p>
                </button>
              </div>
            </div>

            {/* Hybrid Mode: Invention Selection */}
            {mode === "hybrid" && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h4 className="text-white font-black text-lg mb-4">Select 2-4 Inventions to Combine</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {SAMPLE_INVENTIONS.map(inv => (
                    <button
                      key={inv.name}
                      onClick={() => toggleInventionSelection(inv)}
                      className={`p-3 rounded-lg border-2 transition-all text-left flex items-center gap-2 ${
                        selectedInventions.find(s => s.name === inv.name)
                          ? "border-cyan-500 bg-cyan-950/30"
                          : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                      }`}
                    >
                      <span className="text-xl">{inv.icon}</span>
                      <div className="flex-1">
                        <p className="font-bold text-white text-sm">{inv.name}</p>
                      </div>
                      {selectedInventions.find(s => s.name === inv.name) && <span className="text-cyan-400 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
                <p className="text-gray-400 text-xs mt-3">{selectedInventions.length}/4 selected</p>
              </div>
            )}

            {/* Custom Mode: Concept Input */}
            {mode === "custom" && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <label className="text-gray-300 text-sm font-bold block mb-2">Your Invention Concept</label>
                <textarea
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="Describe your invention, technology, mechanism, problem solved, or unique approach..."
                  rows={6}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 resize-none text-sm"
                />
              </div>
            )}

            {/* Technology Category Selection */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h4 className="text-white font-black text-lg mb-4">Select Technology Category</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {TECH_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedCategory === cat.id
                        ? "border-purple-500 bg-purple-950/30"
                        : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                    }`}
                  >
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <p className="font-bold text-white text-sm">{cat.name}</p>
                    <p className="text-gray-400 text-xs mt-1">{cat.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Monetization Sector Selection */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h4 className="text-white font-black text-lg mb-4">Select Target Monetization Sector</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {MONETIZATION_SECTORS.map(sector => (
                  <button
                    key={sector.id}
                    onClick={() => setSelectedSector(sector.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedSector === sector.id
                        ? "border-cyan-500 bg-cyan-950/30"
                        : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                    }`}
                  >
                    <div className="text-2xl mb-2">{sector.icon}</div>
                    <p className="font-bold text-white text-sm">{sector.name}</p>
                    <p className="text-cyan-400 text-xs mt-1">{sector.revenue}</p>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              onClick={handleGenerateHybrid}
              disabled={loading || !selectedCategory || !selectedSector || (mode === "hybrid" ? selectedInventions.length < 2 : !concept.trim())}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-500 hover:to-blue-600 disabled:opacity-50 text-white font-black text-base transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Analyzing Research & Generating...
                </>
              ) : (
                <>
                  <Zap size={16} /> Generate Dossier with Slot Machine
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Slot Machine */}
            <div className="lg:col-span-2">
            <div className="bg-gradient-to-b from-yellow-900/40 to-yellow-950/60 border-4 border-yellow-700 rounded-3xl p-8 shadow-2xl">
              {/* Display Window */}
              <div className="bg-gray-950 border-4 border-yellow-600 rounded-2xl p-6 mb-8 h-80 flex items-center justify-center overflow-hidden relative shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-transparent" />
                
                {loading ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Spinning cards */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[0, 1, 2].map((offset) => (
                        <div
                          key={offset}
                          className="absolute"
                          style={{
                            transform: `translateY(${Math.sin((spinIndex + offset) * 0.3) * 150}px)`,
                            opacity: offset === 1 ? 1 : 0.3,
                            zIndex: offset === 1 ? 10 : 5
                          }}
                        >
                          <div className={`bg-gradient-to-br ${SAMPLE_INVENTIONS[(spinIndex + offset) % SAMPLE_INVENTIONS.length].color} rounded-xl p-6 w-40 h-40 flex flex-col items-center justify-center shadow-lg transform transition-transform`}>
                            <div className="text-6xl mb-2">{SAMPLE_INVENTIONS[(spinIndex + offset) % SAMPLE_INVENTIONS.length].icon}</div>
                            <p className="text-white font-bold text-sm text-center">{SAMPLE_INVENTIONS[(spinIndex + offset) % SAMPLE_INVENTIONS.length].name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-3">{SAMPLE_INVENTIONS[spinIndex].icon}</div>
                    <p className="text-white font-black text-2xl">{SAMPLE_INVENTIONS[spinIndex].name}</p>
                  </div>
                )}
              </div>

              {/* Lever Section */}
              <div className="flex items-end justify-center mb-6 h-40">
                <div className="relative w-32 h-32 flex items-end justify-center">
                  {/* Machine body */}
                  <div className="absolute bottom-0 w-20 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-b-xl border-2 border-gray-600" />
                  
                  {/* Lever handle */}
                  <button
                    ref={leverRef}
                    onClick={handleGenerate}
                    disabled={loading || !concept.trim()}
                    className="absolute bottom-6 w-12 h-32 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:opacity-50 rounded-full cursor-grab active:cursor-grabbing shadow-lg transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed"
                    style={{ transformOrigin: "center bottom" }}
                  >
                    <span className="text-2xl">🎰</span>
                  </button>
                </div>
              </div>

              {/* Pull Text */}
              <div className="text-center">
                <p className="text-yellow-300 font-black text-lg animate-pulse">PULL THE LEVER</p>
                <p className="text-gray-400 text-xs mt-1">Generating invention analysis...</p>
              </div>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
        </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-white font-black text-3xl mb-2">{result.invention_name}</h3>
          <p className="text-gray-400">Complete IP & Commercialization Dossier</p>
        </div>
        {saved ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-900/30 border border-green-700 text-green-300">
            <span>✓</span> Saved
          </div>
        ) : (
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all disabled:opacity-50"
          >
            <Save size={14} /> Save to Library
          </button>
        )}
      </div>

      {/* Hybrid Synergy Section */}
      {result.synergy_score && (
        <section className="border-l-4 border-cyan-500 pl-6 bg-cyan-950/20 rounded-lg p-4 mb-8">
          <h4 className="text-cyan-300 font-black text-lg mb-3">🔗 Hybrid Synergy Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-500 text-xs uppercase font-bold mb-1">Synergy Score</p>
              <p className="text-cyan-400 font-black text-3xl">{result.synergy_score}</p>
              <p className="text-gray-400 text-xs mt-1">/100</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-500 text-xs uppercase font-bold mb-1">Technical Integration</p>
              <p className="text-gray-300 text-sm">{result.technical_integration?.substring(0, 100)}...</p>
            </div>
          </div>
          <div className="mt-3 text-gray-300 text-sm leading-relaxed">{result.synergy_analysis}</div>
        </section>
      )}

      {/* IP Strategy */}
      <section className="border-l-4 border-purple-500 pl-6">
        <h4 className="text-purple-300 font-black text-lg mb-3 flex items-center gap-2">
          <FileText size={16} /> IP Strategy
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-500 text-xs uppercase font-bold mb-1">Primary Approach</p>
            <p className="text-white">{result.ip_strategy.primary_approach}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-500 text-xs uppercase font-bold mb-1">Jurisdiction</p>
            <p className="text-white">{result.ip_strategy.recommended_jurisdiction}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-500 text-xs uppercase font-bold mb-1">Timeline</p>
            <p className="text-white">{result.ip_strategy.filing_timeline}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-500 text-xs uppercase font-bold mb-1">Key Differentiators</p>
            <ul className="space-y-1">
              {result.ip_strategy.key_differentiators.map((d, i) => (
                <li key={i} className="text-white text-xs">• {d}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Patent Claims */}
      <section className="border-l-4 border-blue-500 pl-6">
        <h4 className="text-blue-300 font-black text-lg mb-3">Patent Claims</h4>
        <div className="space-y-2">
          {result.patent_claims.map((claim, i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-xs font-bold mb-1">Claim {i + 1}</p>
              <p className="text-white text-sm leading-relaxed">{claim}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FTO Assessment */}
      <section className="border-l-4 border-orange-500 pl-6">
        <h4 className="text-orange-300 font-black text-lg mb-3 flex items-center gap-2">
          <BarChart3 size={16} /> Freedom-to-Operate Assessment
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-orange-950/20 border border-orange-800 rounded-lg p-4">
            <p className="text-orange-300 font-bold text-2xl">{result.fto_assessment.risk_score}</p>
            <p className="text-gray-400 text-xs uppercase tracking-wide">Risk Score</p>
          </div>
          <div className="md:col-span-2 bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-2">{result.fto_assessment.summary}</p>
            <p className="text-gray-500 text-xs font-bold mb-1">Monitor:</p>
            <div className="flex flex-wrap gap-1">
              {result.fto_assessment.key_prior_art.slice(0, 3).map((art, i) => (
                <span key={i} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                  {art}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Market & Commercial */}
      <section className="border-l-4 border-green-500 pl-6">
        <h4 className="text-green-300 font-black text-lg mb-3">Market & Commercialization</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-500 text-xs uppercase font-bold mb-2">Target Markets</p>
            <ul className="space-y-1">
              {result.market_positioning.target_markets.map((m, i) => (
                <li key={i} className="text-white text-sm">• {m}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-500 text-xs uppercase font-bold mb-2">Estimated TAM</p>
            <p className="text-cyan-400 font-bold text-lg">{result.market_positioning.estimated_tam}</p>
          </div>
        </div>

        <div className="mt-4 bg-gray-800/50 rounded-lg p-4">
          <p className="text-gray-500 text-xs uppercase font-bold mb-3">12-Month Commercialization Plan</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-gray-900 rounded p-3 border-l-3 border-yellow-500">
              <p className="text-yellow-300 font-bold text-xs mb-1">Phase 1</p>
              <p className="text-gray-300">{result.commercialization_plan.phase_1}</p>
            </div>
            <div className="bg-gray-900 rounded p-3 border-l-3 border-orange-500">
              <p className="text-orange-300 font-bold text-xs mb-1">Phase 2</p>
              <p className="text-gray-300">{result.commercialization_plan.phase_2}</p>
            </div>
            <div className="bg-gray-900 rounded p-3 border-l-3 border-red-500">
              <p className="text-red-300 font-bold text-xs mb-1">Phase 3</p>
              <p className="text-gray-300">{result.commercialization_plan.phase_3}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bill of Materials */}
      <section className="border-l-4 border-cyan-500 pl-6">
        <h4 className="text-cyan-300 font-black text-lg mb-3">Bill of Materials (Prototype)</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 font-bold py-2">Component</th>
                <th className="text-left text-gray-400 font-bold py-2">Category</th>
                <th className="text-right text-gray-400 font-bold py-2">Qty</th>
                <th className="text-right text-gray-400 font-bold py-2">Est. Cost</th>
              </tr>
            </thead>
            <tbody>
              {result.bom.map((item, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="py-2 text-white">{item.component}</td>
                  <td className="py-2 text-gray-400 text-xs">{item.category}</td>
                  <td className="py-2 text-right text-gray-400">{item.quantity}</td>
                  <td className="py-2 text-right text-cyan-400 font-bold">{item.estimated_cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Valuation */}
      <section className="border-l-4 border-green-500 pl-6">
        <h4 className="text-green-300 font-black text-lg mb-3">IP Valuation & Licensing</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-950/20 border border-green-800 rounded-lg p-4">
            <p className="text-green-300 text-xs uppercase font-bold mb-1">Est. IP Value (Low)</p>
            <p className="text-white font-bold text-xl">{result.valuation.estimated_value_low}</p>
          </div>
          <div className="bg-green-950/20 border border-green-800 rounded-lg p-4">
            <p className="text-green-300 text-xs uppercase font-bold mb-1">Est. IP Value (High)</p>
            <p className="text-white font-bold text-xl">{result.valuation.estimated_value_high}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-400 text-xs uppercase font-bold mb-1">Licensing Potential</p>
            <p className="text-white text-sm">{result.valuation.licensing_potential}</p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-gray-800">
        <button
          onClick={() => setResult(null)}
          className="flex-1 py-3 rounded-lg border border-gray-700 text-gray-300 hover:text-white font-bold transition-colors"
        >
          Generate Another
        </button>
        {!saved && (
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={14} /> Save to Invention Library
          </button>
        )}
      </div>
    </div>
  );
}