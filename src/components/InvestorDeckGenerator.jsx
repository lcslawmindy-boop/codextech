import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Presentation, Loader2, ChevronRight, ChevronLeft, Download, BarChart3, TrendingUp, DollarSign, Zap, CheckCircle } from "lucide-react";

const SLIDE_COLORS = [
  "from-slate-900 to-blue-950",
  "from-blue-950 to-cyan-950",
  "from-cyan-950 to-teal-950",
  "from-purple-950 to-blue-950",
  "from-gray-950 to-slate-900",
  "from-teal-950 to-green-950",
];

function SlidePreview({ slide, index }) {
  const gradient = SLIDE_COLORS[index % SLIDE_COLORS.length];
  return (
    <div className={`bg-gradient-to-br ${gradient} border border-gray-700 rounded-xl p-5 aspect-video flex flex-col justify-between`}>
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Slide {index + 1}</p>
        <h4 className="text-white font-black text-lg leading-tight">{slide.title}</h4>
      </div>
      <div className="space-y-1.5">
        {(slide.bullets || []).slice(0, 4).map((b, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0 mt-1.5" />
            <p className="text-gray-300 text-xs leading-snug">{b}</p>
          </div>
        ))}
        {slide.highlight && (
          <div className="mt-2 px-3 py-1.5 rounded-lg bg-cyan-900/40 border border-cyan-700">
            <p className="text-cyan-300 text-xs font-bold">{slide.highlight}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InvestorDeckGenerator({ inventions = [] }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deck, setDeck] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    setDeck(null);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert investor relations consultant and pitch deck designer. Generate a compelling 6-slide investor presentation for the following invention:

INVENTION: ${selected.hybrid_concept}
DESCRIPTION: ${selected.description || selected.synergy_analysis || ""}
MARKET APPLICATIONS: ${selected.market_applications || ""}
IP VALUATION: ${selected.ip_valuation || `$${selected.ip_value_low || 0}M - $${selected.ip_value_high || 0}M`}
SYNERGY SCORE: ${selected.synergy_score}/100
MARKET SECTORS: ${(selected.market_sectors || []).join(", ")}
PATENT CLAIMS SUMMARY: ${selected.patent_claims || ""}
COMMERCIALIZATION STEPS: ${selected.suggested_next_steps || ""}

Generate exactly 6 slides focusing on: (1) Executive Summary, (2) Problem & Market Opportunity with TAM, (3) The Technology & IP, (4) Commercialization Milestones & Revenue Model, (5) IP Valuation & Financial Projections, (6) The Ask / Call to Action. Each slide needs a title, 3-5 bullet points, and an optional highlight stat.`,
        model: "claude_sonnet_4_6",
        response_json_schema: {
          type: "object",
          properties: {
            deck_title: { type: "string" },
            tagline: { type: "string" },
            slides: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  bullets: { type: "array", items: { type: "string" } },
                  highlight: { type: "string" },
                  speaker_notes: { type: "string" }
                }
              }
            }
          }
        }
      });
      setDeck(res);
      setActiveSlide(0);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleExportSlides = async () => {
    if (!deck) return;
    setExporting(true);
    setError(null);
    try {
      const res = await base44.functions.invoke("exportToGoogleSlides", {
        title: deck.deck_title,
        slides: deck.slides,
        invention_name: selected?.hybrid_concept,
      });
      if (res.data?.slides_url) {
        window.open(res.data.slides_url, "_blank");
        setExported(true);
      } else if (res.data?.error) {
        // Fallback: generate a JSON download
        const blob = new Blob([JSON.stringify(deck, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${deck.deck_title || "investor_deck"}.json`;
        link.click();
        setExported(true);
      }
    } catch (e) {
      // JSON fallback
      const blob = new Blob([JSON.stringify(deck, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `investor_deck.json`;
      link.click();
      setExported(true);
    }
    setExporting(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Presentation size={22} className="text-purple-400" />
        <div>
          <h3 className="text-white font-black text-xl">Investor Deck Generator</h3>
          <p className="text-gray-500 text-xs">Auto-generate investor-ready slide decks from your invention dossiers</p>
        </div>
      </div>

      {!deck ? (
        <div className="space-y-5">
          {/* Select Invention */}
          <div>
            <p className="text-gray-400 text-sm mb-3">Select an invention dossier to generate a pitch deck:</p>
            {inventions.length === 0 ? (
              <div className="text-center py-10 text-gray-600 border border-gray-800 rounded-xl">
                <Presentation size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No saved dossiers found. Generate and save one first.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {inventions.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => setSelected(inv)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selected?.id === inv.id ? "border-purple-500 bg-purple-950/30" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-white font-bold text-sm">{inv.hybrid_concept || "Unnamed Invention"}</p>
                        <div className="flex gap-3 mt-1.5 flex-wrap">
                          {inv.ip_value_low && <span className="text-green-400 text-xs font-bold flex items-center gap-1"><DollarSign size={10} />${inv.ip_value_low}M–${inv.ip_value_high}M IP Value</span>}
                          {inv.synergy_score && <span className="text-cyan-400 text-xs font-bold flex items-center gap-1"><Zap size={10} />Score: {inv.synergy_score}/100</span>}
                          {inv.market_sectors?.length > 0 && <span className="text-purple-400 text-xs">{inv.market_sectors.slice(0, 2).join(", ")}</span>}
                        </div>
                      </div>
                      {selected?.id === inv.id && <CheckCircle size={18} className="text-purple-400 flex-shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* What's included preview */}
          {selected && (
            <div className="bg-purple-950/20 border border-purple-800 rounded-xl p-4">
              <p className="text-purple-300 font-bold text-sm mb-3">Deck will include:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["Executive Summary", "Market TAM Analysis", "Technology & IP", "Commercialization Plan", "IP Valuation Model", "Investor CTA"].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={!selected || loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-500 hover:to-blue-600 text-white font-black flex items-center justify-center gap-2 transition-all disabled:opacity-40"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Generating Deck...</> : <><Presentation size={16} /> Generate Investor Deck</>}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Deck Title */}
          <div className="text-center pb-4 border-b border-gray-800">
            <h4 className="text-white font-black text-2xl">{deck.deck_title}</h4>
            <p className="text-gray-400 text-sm mt-1">{deck.tagline}</p>
            <p className="text-gray-600 text-xs mt-1">{deck.slides?.length} slides generated</p>
          </div>

          {/* Slide Navigator */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(deck.slides || []).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`flex-shrink-0 w-8 h-8 rounded-lg text-xs font-bold transition-all ${activeSlide === i ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Active Slide Preview */}
          {deck.slides?.[activeSlide] && (
            <SlidePreview slide={deck.slides[activeSlide]} index={activeSlide} />
          )}

          {/* Speaker Notes */}
          {deck.slides?.[activeSlide]?.speaker_notes && (
            <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Speaker Notes</p>
              <p className="text-gray-300 text-sm">{deck.slides[activeSlide].speaker_notes}</p>
            </div>
          )}

          {/* All Slides Grid */}
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase mb-3">All Slides</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(deck.slides || []).map((slide, i) => (
                <button key={i} onClick={() => setActiveSlide(i)} className="text-left hover:opacity-80 transition-opacity">
                  <SlidePreview slide={slide} index={i} />
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <button
              onClick={() => { setDeck(null); setExported(false); }}
              className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white font-bold text-sm transition-colors"
            >
              ← Regenerate
            </button>
            {exported ? (
              <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-lg bg-green-900/30 border border-green-700 text-green-300 text-sm font-bold">
                <CheckCircle size={16} /> Exported!
              </div>
            ) : (
              <button
                onClick={handleExportSlides}
                disabled={exporting}
                className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {exporting ? <><Loader2 size={14} className="animate-spin" /> Exporting...</> : <><Download size={14} /> Export Deck</>}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}