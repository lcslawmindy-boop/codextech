import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Zap, Save, FileText, BarChart3 } from "lucide-react";

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
  { name: "MEG Generator", icon: "⚡", tech: "Motionless electromagnetic generator using toroidal coil geometry and permanent magnets to extract EM energy from ambient field fluctuations" },
  { name: "Scalar Transmitter", icon: "📡", tech: "Biconical or toroidal antenna configuration for generating scalar EM waves via destructive interference of orthogonal EM fields" },
  { name: "Zero-Point Extractor", icon: "🌌", tech: "Quantum vacuum fluctuation harvesting system using high-frequency oscillation circuits and Casimir cavity principles" },
  { name: "Anenergy Pump", icon: "💫", tech: "Toroidal coil assembly with phased excitation producing coherent EM energy circulation and potential energy amplification" },
  { name: "Prioré Device", icon: "🔬", tech: "RF-driven cylindrical cavity with secondary helical coils generating complex EM field patterns for bioelectromagnetic effects" },
  { name: "Torsion Field Generator", icon: "🌀", tech: "Spinning charge assembly or gyroscopic system producing torsion field propagation through spacetime topology" },
  { name: "Resonance Cavity", icon: "📿", tech: "Tuned cylindrical or spherical chamber exploiting cavity resonance modes to amplify EM energy at specific frequencies" },
  { name: "BioEM Interface", icon: "🧬", tech: "Frequency-tuned electrode array for coupling biological systems to EM fields within therapeutic window parameters" },
];

export default function AdvancedInventionDossierGenerator() {
  const [mode, setMode] = useState("hybrid");
  const [selectedInventions, setSelectedInventions] = useState([]);
  const [concept, setConcept] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSector, setSelectedSector] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const leverRef = useRef(null);

  const toggleInventionSelection = (inv) => {
    if (selectedInventions.find(s => s.name === inv.name)) {
      setSelectedInventions(selectedInventions.filter(s => s.name !== inv.name));
    } else if (selectedInventions.length < 4) {
      setSelectedInventions([...selectedInventions, inv]);
    }
  };

  const handleGenerate = async () => {
    if (selectedCategories.length === 0 || !selectedSector) return;
    if (mode === "hybrid" && selectedInventions.length < 2) return;
    if (mode === "custom" && !concept.trim()) return;

    setLoading(true);
    setError(null);
    setSaved(false);

    if (leverRef.current) {
      leverRef.current.style.transform = "rotate(45deg)";
      setTimeout(() => { leverRef.current.style.transform = "rotate(0deg)"; }, 300);
    }

    const categoryName = TECH_CATEGORIES.filter(c => selectedCategories.includes(c.id)).map(c => c.name).join(", ");
    const sectorName = MONETIZATION_SECTORS.find(s => s.id === selectedSector)?.name;
    const inventionList = selectedInventions.map(i => i.name).join(", ");

    const promptContent = mode === "hybrid"
      ? `INVENTIONS TO COMBINE: ${inventionList}\nTECHNOLOGY CATEGORY: ${categoryName}\nTARGET MONETIZATION SECTOR: ${sectorName}\n\nCreate a novel hybrid system that integrates the best aspects of each invention.`
      : `CUSTOM INVENTION CONCEPT: ${concept}\nTECHNOLOGY CATEGORY: ${categoryName}\nTARGET MONETIZATION SECTOR: ${sectorName}`;

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an AI patent strategy and commercialization expert. Generate a complete Invention Dossier for the following:\n\n${promptContent}\n\nGenerate a comprehensive dossier including: invention name, hybrid concept, synergy score (0-100), synergy analysis, patent claims (3-5), market positioning, commercialization plan, bill of materials, and IP valuation. Be detailed and innovative.`,
      model: "claude_sonnet_4_6",
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
              phase_3: { type: "string" }
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

    setResult(res);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!result) return;
    setLoading(true);
    const res = await base44.functions.invoke("generateInventionDossier", result);
    if (res.data?.success) {
      setSaved(true);
      if (res.data.pdf_data) {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${res.data.pdf_data}`;
        link.download = res.data.pdf_filename;
        link.click();
      }
    } else {
      setError("Failed to save: " + (res.data?.error || "Unknown error"));
    }
    setLoading(false);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setSaved(false);
  };

  // ── Result view ──────────────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-white font-black text-3xl mb-2">{result.invention_name}</h3>
            <p className="text-gray-400">Complete IP &amp; Commercialization Dossier</p>
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

        {/* Synergy */}
        {result.synergy_score && (
          <section className="border-l-4 border-cyan-500 pl-6 bg-cyan-950/20 rounded-lg p-4">
            <h4 className="text-cyan-300 font-black text-lg mb-3">🔗 Hybrid Synergy Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
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
            <p className="text-gray-300 text-sm leading-relaxed">{result.synergy_analysis}</p>
          </section>
        )}

        {/* Patent Claims */}
        <section className="border-l-4 border-blue-500 pl-6">
          <h4 className="text-blue-300 font-black text-lg mb-3 flex items-center gap-2">
            <FileText size={16} /> Patent Claims
          </h4>
          <div className="space-y-2">
            {(result.patent_claims || []).map((claim, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-400 text-xs font-bold mb-1">Claim {i + 1}</p>
                <p className="text-white text-sm leading-relaxed">{claim}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Market */}
        <section className="border-l-4 border-green-500 pl-6">
          <h4 className="text-green-300 font-black text-lg mb-3">Market &amp; Commercialization</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-500 text-xs uppercase font-bold mb-2">Target Markets</p>
              <ul className="space-y-1">
                {(result.market_positioning?.target_markets || []).map((m, i) => (
                  <li key={i} className="text-white text-sm">• {m}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-500 text-xs uppercase font-bold mb-2">Estimated TAM</p>
              <p className="text-cyan-400 font-bold text-lg">{result.market_positioning?.estimated_tam}</p>
            </div>
          </div>
          {result.commercialization_plan && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-500 text-xs uppercase font-bold mb-3">12-Month Commercialization Plan</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-gray-900 rounded p-3">
                  <p className="text-yellow-300 font-bold text-xs mb-1">Phase 1</p>
                  <p className="text-gray-300">{result.commercialization_plan.phase_1}</p>
                </div>
                <div className="bg-gray-900 rounded p-3">
                  <p className="text-orange-300 font-bold text-xs mb-1">Phase 2</p>
                  <p className="text-gray-300">{result.commercialization_plan.phase_2}</p>
                </div>
                <div className="bg-gray-900 rounded p-3">
                  <p className="text-red-300 font-bold text-xs mb-1">Phase 3</p>
                  <p className="text-gray-300">{result.commercialization_plan.phase_3}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* BOM */}
        {result.bom && result.bom.length > 0 && (
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
        )}

        {/* Valuation */}
        {result.valuation && (
          <section className="border-l-4 border-green-500 pl-6">
            <h4 className="text-green-300 font-black text-lg mb-3 flex items-center gap-2">
              <BarChart3 size={16} /> IP Valuation &amp; Licensing
            </h4>
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
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-gray-800">
          <button
            onClick={handleReset}
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

  // ── Setup view ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h3 className="text-white font-black text-3xl mb-2 flex items-center gap-2">
          <Zap size={28} className="text-purple-400" /> Invention Dossier Generator
        </h3>
        <p className="text-gray-400 text-sm">AI-powered patent strategy powered by verified research, proven science, and market intelligence.</p>
      </div>

      <div className="space-y-8">
        {/* Mode Selection */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <label className="text-gray-300 text-sm font-bold block mb-4">Choose Your Path</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setMode("hybrid"); setSelectedInventions([]); }}
              className={`p-4 rounded-xl border-2 transition-all text-left ${mode === "hybrid" ? "border-cyan-500 bg-cyan-950/30" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"}`}
            >
              <p className="font-bold text-white text-sm">🔗 Hybrid Invention</p>
              <p className="text-gray-400 text-xs mt-1">Combine 2-4 inventions from the library</p>
            </button>
            <button
              onClick={() => { setMode("custom"); setConcept(""); }}
              className={`p-4 rounded-xl border-2 transition-all text-left ${mode === "custom" ? "border-purple-500 bg-purple-950/30" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"}`}
            >
              <p className="font-bold text-white text-sm">✨ Custom Concept</p>
              <p className="text-gray-400 text-xs mt-1">Describe your own invention</p>
            </button>
          </div>
        </div>

        {/* Hybrid Invention Selection */}
        {mode === "hybrid" && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h4 className="text-white font-black text-lg mb-4">Select 2-4 Inventions to Combine</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {SAMPLE_INVENTIONS.map(inv => (
                <button
                  key={inv.name}
                  onClick={() => toggleInventionSelection(inv)}
                  className={`p-3 rounded-lg border-2 transition-all text-left flex flex-col gap-1.5 ${selectedInventions.find(s => s.name === inv.name) ? "border-cyan-500 bg-cyan-950/30" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{inv.icon}</span>
                    <p className="font-bold text-white text-sm flex-1">{inv.name}</p>
                    {selectedInventions.find(s => s.name === inv.name) && <span className="text-cyan-400 font-bold">✓</span>}
                  </div>
                  <p className="text-gray-400 text-xs leading-snug ml-7">{inv.tech}</p>
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-xs mt-3">{selectedInventions.length}/4 selected</p>
          </div>
        )}

        {/* Custom Concept Input */}
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

        {/* Technology Category */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h4 className="text-white font-black text-lg mb-1">Select Technology Categories</h4>
          <p className="text-gray-500 text-xs mb-4">Select one or more</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TECH_CATEGORIES.map(cat => {
              const selected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategories(prev => selected ? prev.filter(id => id !== cat.id) : [...prev, cat.id])}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${selected ? "border-purple-500 bg-purple-950/30" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    {selected && <span className="text-purple-400 font-bold text-sm">✓</span>}
                  </div>
                  <p className="font-bold text-white text-sm">{cat.name}</p>
                  <p className="text-gray-400 text-xs mt-1">{cat.desc}</p>
                </button>
              );
            })}
          </div>
          {selectedCategories.length > 0 && (
            <p className="text-purple-400 text-xs mt-3">{selectedCategories.length} selected</p>
          )}
        </div>

        {/* Monetization Sector */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h4 className="text-white font-black text-lg mb-4">Select Target Monetization Sector</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MONETIZATION_SECTORS.map(sector => (
              <button
                key={sector.id}
                onClick={() => setSelectedSector(sector.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${selectedSector === sector.id ? "border-cyan-500 bg-cyan-950/30" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"}`}
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
          ref={leverRef}
          onClick={handleGenerate}
          disabled={loading || selectedCategories.length === 0 || !selectedSector || (mode === "hybrid" ? selectedInventions.length < 2 : !concept.trim())}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-500 hover:to-blue-600 disabled:opacity-50 text-white font-black text-base transition-all flex items-center justify-center gap-2"
          style={{ transition: "transform 0.3s ease" }}
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Analyzing Research &amp; Generating...</>
          ) : (
            <><Zap size={16} /> Generate Dossier</>
          )}
        </button>
      </div>
    </div>
  );
}