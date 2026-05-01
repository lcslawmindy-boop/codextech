import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Zap, Save, FileText, BarChart3, CheckCircle, ChevronRight, AlertCircle, Edit3, X } from "lucide-react";

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
  const [selectedSectors, setSelectedSectors] = useState([]);
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
    if (selectedCategories.length === 0 || selectedSectors.length === 0) return;
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
    const sectorName = MONETIZATION_SECTORS.filter(s => selectedSectors.includes(s.id)).map(s => s.name).join(", ");
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
    const payload = {
      invention_name: result.invention_name,
      ip_strategy: {
        primary_approach: result.technical_integration || result.hybrid_concept || "",
        recommended_jurisdiction: "USPTO",
        filing_timeline: result.commercialization_plan?.phase_1 || "File within 12 months"
      },
      patent_claims: result.patent_claims || [],
      fto_assessment: {
        risk_score: result.synergy_score || 75,
        summary: result.synergy_analysis || result.hybrid_concept || ""
      },
      market_positioning: result.market_positioning || { target_markets: [], estimated_tam: "N/A" },
      commercialization_plan: result.commercialization_plan || { phase_1: "", phase_2: "", phase_3: "" },
      bom: result.bom || [],
      valuation: result.valuation || { estimated_value_low: "$0", estimated_value_high: "$0", licensing_potential: "" },
      // Pass full AI result fields for richer description
      synergy_analysis: result.synergy_analysis,
      hybrid_concept: result.hybrid_concept,
      market_sectors: MONETIZATION_SECTORS.filter(s => selectedSectors.includes(s.id)).map(s => s.name),
    };
    const res = await base44.functions.invoke("generateInventionDossier", payload);
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
  const TABS = ["Overview", "IP & Claims", "Market", "BOM", "Valuation"];
  const [activeTab, setActiveTab] = useState("Overview");
  const [editingName, setEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");

  if (result) {
    const bomTotal = (result.bom || []).reduce((sum, item) => {
      const num = parseFloat((item.estimated_cost || "0").replace(/[^0-9.]/g, ""));
      return sum + (isNaN(num) ? 0 : num);
    }, 0);

    return (
      <div className="max-w-4xl mx-auto space-y-0">
        {/* Review Banner */}
        {!saved && (
          <div className="flex items-center gap-3 px-5 py-3 bg-amber-950/40 border border-amber-700 rounded-t-2xl">
            <AlertCircle size={16} className="text-amber-400 flex-shrink-0" />
            <p className="text-amber-300 text-sm font-bold">Review your dossier below before saving to your library.</p>
            <div className="ml-auto flex gap-2">
              <button onClick={handleReset} className="text-gray-400 hover:text-white text-xs transition-colors flex items-center gap-1">
                <X size={12} /> Discard
              </button>
            </div>
          </div>
        )}

        <div className={`bg-gray-900 border border-gray-800 ${!saved ? "border-t-0 rounded-b-2xl" : "rounded-2xl"} overflow-hidden`}>
          {/* Header */}
          <div className="px-8 pt-7 pb-5 bg-gradient-to-r from-gray-900 to-gray-950 border-b border-gray-800">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={editedName}
                      onChange={e => setEditedName(e.target.value)}
                      className="bg-gray-800 border border-cyan-600 rounded-lg px-3 py-1.5 text-white font-black text-2xl w-full outline-none"
                    />
                    <button onClick={() => { setResult({ ...result, invention_name: editedName }); setEditingName(false); }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold transition-colors">Save</button>
                    <button onClick={() => setEditingName(false)} className="text-gray-500 hover:text-white"><X size={14} /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h3 className="text-white font-black text-2xl md:text-3xl leading-tight">{result.invention_name}</h3>
                    <button onClick={() => { setEditedName(result.invention_name); setEditingName(true); }}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-cyan-400 transition-all">
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
                <p className="text-gray-500 text-sm mt-1">Complete IP &amp; Commercialization Dossier</p>
              </div>

              {/* Score + Save */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {result.synergy_score && (
                  <div className="text-center px-4 py-2 rounded-xl bg-cyan-950/50 border border-cyan-800">
                    <p className="text-cyan-400 font-black text-2xl leading-none">{result.synergy_score}</p>
                    <p className="text-gray-500 text-xs mt-0.5">/ 100</p>
                  </div>
                )}
                {saved ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-900/30 border border-green-700 text-green-300 text-sm font-bold">
                    <CheckCircle size={15} /> Saved to Library
                  </div>
                ) : (
                  <button onClick={handleSave} disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black text-sm transition-all disabled:opacity-50 shadow-lg shadow-blue-900/40">
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {loading ? "Saving..." : "Save to Library"}
                  </button>
                )}
              </div>
            </div>

            {/* Quick stats row */}
            <div className="flex flex-wrap gap-4 mt-5">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs uppercase font-bold">IP Value</span>
                <span className="text-green-400 font-bold text-sm">{result.valuation?.estimated_value_low} – {result.valuation?.estimated_value_high}</span>
              </div>
              <div className="w-px bg-gray-700" />
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs uppercase font-bold">TAM</span>
                <span className="text-cyan-400 font-bold text-sm">{result.market_positioning?.estimated_tam || "—"}</span>
              </div>
              <div className="w-px bg-gray-700" />
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs uppercase font-bold">Claims</span>
                <span className="text-blue-400 font-bold text-sm">{(result.patent_claims || []).length}</span>
              </div>
              <div className="w-px bg-gray-700" />
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs uppercase font-bold">BOM Items</span>
                <span className="text-purple-400 font-bold text-sm">{(result.bom || []).length} components</span>
              </div>
              {bomTotal > 0 && (
                <>
                  <div className="w-px bg-gray-700" />
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs uppercase font-bold">Est. Build Cost</span>
                    <span className="text-yellow-400 font-bold text-sm">~${bomTotal.toFixed(0)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-b border-gray-800 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === tab ? "text-white border-cyan-500 bg-gray-800/40" : "text-gray-500 border-transparent hover:text-gray-300 hover:bg-gray-800/20"}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 space-y-6">

            {/* ── OVERVIEW ── */}
            {activeTab === "Overview" && (
              <div className="space-y-5">
                {/* Concept description */}
                <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-5">
                  <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-3">Hybrid Concept</p>
                  <p className="text-white text-sm leading-relaxed">{result.hybrid_concept}</p>
                </div>

                {/* Synergy analysis — full text */}
                {result.synergy_analysis && (
                  <div className="bg-cyan-950/20 border border-cyan-800/50 rounded-xl p-5">
                    <p className="text-cyan-400 text-xs uppercase font-bold tracking-wider mb-3">🔗 Synergy Analysis</p>
                    <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{result.synergy_analysis}</p>
                  </div>
                )}

                {/* Technical integration — full text */}
                {result.technical_integration && (
                  <div className="bg-purple-950/20 border border-purple-800/50 rounded-xl p-5">
                    <p className="text-purple-400 text-xs uppercase font-bold tracking-wider mb-3">⚙️ Technical Integration</p>
                    <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{result.technical_integration}</p>
                  </div>
                )}

                {/* Competitive advantages */}
                {(result.market_positioning?.competitive_advantages || []).length > 0 && (
                  <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-5">
                    <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-3">Competitive Advantages</p>
                    <ul className="space-y-2">
                      {result.market_positioning.competitive_advantages.map((adv, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <ChevronRight size={14} className="text-cyan-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-200 text-sm">{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* ── IP & CLAIMS ── */}
            {activeTab === "IP & Claims" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">
                  <FileText size={13} /> {(result.patent_claims || []).length} Patent Claims
                </div>
                {(result.patent_claims || []).map((claim, i) => (
                  <div key={i} className={`rounded-xl p-5 border ${i === 0 ? "bg-blue-950/20 border-blue-700/50" : "bg-gray-800/30 border-gray-700"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full ${i === 0 ? "bg-blue-700 text-white" : "bg-gray-700 text-gray-300"}`}>
                        {i === 0 ? "Independent Claim 1" : `Dependent Claim ${i + 1}`}
                      </span>
                    </div>
                    <p className="text-white text-sm leading-relaxed">{claim}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ── MARKET ── */}
            {activeTab === "Market" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-5">
                    <p className="text-gray-400 text-xs uppercase font-bold mb-3">Target Markets</p>
                    <ul className="space-y-2">
                      {(result.market_positioning?.target_markets || []).map((m, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                          <span className="text-white text-sm">{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-950/20 border border-green-800/50 rounded-xl p-5 flex flex-col justify-center">
                    <p className="text-gray-400 text-xs uppercase font-bold mb-1">Estimated TAM</p>
                    <p className="text-green-400 font-black text-3xl">{result.market_positioning?.estimated_tam || "—"}</p>
                  </div>
                </div>

                {result.commercialization_plan && (
                  <div>
                    <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-3">12-Month Commercialization Plan</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: "Phase 1", color: "text-yellow-300 border-yellow-700/50 bg-yellow-950/20", text: result.commercialization_plan.phase_1 },
                        { label: "Phase 2", color: "text-orange-300 border-orange-700/50 bg-orange-950/20", text: result.commercialization_plan.phase_2 },
                        { label: "Phase 3", color: "text-red-300 border-red-700/50 bg-red-950/20", text: result.commercialization_plan.phase_3 },
                      ].map(({ label, color, text }) => (
                        <div key={label} className={`rounded-xl p-4 border ${color}`}>
                          <p className={`font-black text-xs mb-2 ${color.split(" ")[0]}`}>{label}</p>
                          <p className="text-gray-200 text-sm leading-relaxed">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── BOM ── */}
            {activeTab === "BOM" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Bill of Materials ({(result.bom || []).length} components)</p>
                  {bomTotal > 0 && (
                    <div className="px-3 py-1 rounded-lg bg-yellow-950/30 border border-yellow-800 text-yellow-300 text-xs font-bold">
                      Total Est. Cost: ~${bomTotal.toFixed(0)}
                    </div>
                  )}
                </div>
                {(result.bom || []).length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-8">No BOM data available.</p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-700">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="text-left text-gray-400 font-bold text-xs uppercase py-3 px-4">Component</th>
                          <th className="text-left text-gray-400 font-bold text-xs uppercase py-3 px-4">Category</th>
                          <th className="text-right text-gray-400 font-bold text-xs uppercase py-3 px-4">Qty</th>
                          <th className="text-right text-gray-400 font-bold text-xs uppercase py-3 px-4">Est. Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.bom.map((item, i) => (
                          <tr key={i} className={`border-t border-gray-800 ${i % 2 === 0 ? "" : "bg-gray-800/20"}`}>
                            <td className="py-3 px-4 text-white font-medium">{item.component}</td>
                            <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 text-xs">{item.category}</span></td>
                            <td className="py-3 px-4 text-right text-gray-400">{item.quantity}</td>
                            <td className="py-3 px-4 text-right text-cyan-400 font-bold">{item.estimated_cost}</td>
                          </tr>
                        ))}
                      </tbody>
                      {bomTotal > 0 && (
                        <tfoot className="bg-gray-800/60 border-t-2 border-gray-700">
                          <tr>
                            <td colSpan={3} className="py-3 px-4 text-gray-400 font-bold text-xs uppercase">Estimated Total</td>
                            <td className="py-3 px-4 text-right text-yellow-400 font-black">${bomTotal.toFixed(0)}</td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── VALUATION ── */}
            {activeTab === "Valuation" && result.valuation && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-950/25 border-2 border-green-700/60 rounded-xl p-6 text-center">
                    <p className="text-green-400 text-xs uppercase font-bold tracking-wider mb-2">Conservative Estimate</p>
                    <p className="text-white font-black text-3xl">{result.valuation.estimated_value_low}</p>
                    <p className="text-gray-500 text-xs mt-1">IP Value (Low)</p>
                  </div>
                  <div className="bg-green-950/40 border-2 border-green-500/60 rounded-xl p-6 text-center">
                    <p className="text-green-300 text-xs uppercase font-bold tracking-wider mb-2">Optimistic Estimate</p>
                    <p className="text-white font-black text-3xl">{result.valuation.estimated_value_high}</p>
                    <p className="text-gray-500 text-xs mt-1">IP Value (High)</p>
                  </div>
                </div>
                <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-5">
                  <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-3">Licensing Potential</p>
                  <p className="text-white text-sm leading-relaxed">{result.valuation.licensing_potential}</p>
                </div>
              </div>
            )}
          </div>

          {error && <div className="mx-6 mb-4 p-3 rounded-xl bg-red-950/30 border border-red-800 text-red-400 text-sm">{error}</div>}

          {/* Footer Actions */}
          <div className="px-6 pb-6 pt-2 border-t border-gray-800 flex gap-3">
            <button onClick={handleReset}
              className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:text-white font-bold text-sm transition-colors">
              ← Generate Another
            </button>
            <div className="flex-1" />
            {!saved && (
              <button onClick={handleSave} disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black text-sm transition-all disabled:opacity-50 shadow-lg shadow-blue-900/40">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {loading ? "Saving..." : "Confirm & Save to Library"}
              </button>
            )}
            {saved && (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-900/30 border border-green-700 text-green-300 text-sm font-bold">
                <CheckCircle size={15} /> Saved to Library
              </div>
            )}
          </div>
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
          <h4 className="text-white font-black text-lg mb-1">Select Target Monetization Sectors</h4>
          <p className="text-gray-500 text-xs mb-4">Select one or more</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MONETIZATION_SECTORS.map(sector => {
              const selected = selectedSectors.includes(sector.id);
              return (
                <button
                  key={sector.id}
                  onClick={() => setSelectedSectors(prev => selected ? prev.filter(id => id !== sector.id) : [...prev, sector.id])}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${selected ? "border-cyan-500 bg-cyan-950/30" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="text-2xl mb-2">{sector.icon}</div>
                    {selected && <span className="text-cyan-400 font-bold text-sm">✓</span>}
                  </div>
                  <p className="font-bold text-white text-sm">{sector.name}</p>
                  <p className="text-cyan-400 text-xs mt-1">{sector.revenue}</p>
                </button>
              );
            })}
          </div>
          {selectedSectors.length > 0 && (
            <p className="text-cyan-400 text-xs mt-3">{selectedSectors.length} selected</p>
          )}
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          ref={leverRef}
          onClick={handleGenerate}
          disabled={loading || selectedCategories.length === 0 || selectedSectors.length === 0 || (mode === "hybrid" ? selectedInventions.length < 2 : !concept.trim())}
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