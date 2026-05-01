import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Presentation, Loader2, Download, CheckCircle, ChevronRight, ChevronLeft, DollarSign, TrendingUp, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";

// ── ROI & Timeline Calculator ────────────────────────────────────────────────
function calcROI(inv) {
  const low = inv.ip_value_low || 1;
  const high = inv.ip_value_high || low * 2;
  const midVal = (low + high) / 2; // $M
  const devCost = Math.max(0.05, midVal * 0.08); // ~8% of mid value
  const roi = ((midVal - devCost) / devCost * 100).toFixed(0);
  return { roi, midVal, devCost, low, high };
}

function calcTimeline(inv) {
  const score = inv.synergy_score || 70;
  const monthsToPrototype = score > 80 ? 6 : score > 60 ? 9 : 12;
  const monthsToPatent = monthsToPrototype + 3;
  const monthsToMarket = monthsToPatent + (score > 75 ? 6 : 12);
  return { monthsToPrototype, monthsToPatent, monthsToMarket };
}

const SLIDE_COLORS = [
  { bg: [15, 20, 40], accent: [0, 180, 220] },
  { bg: [10, 30, 20], accent: [0, 200, 120] },
  { bg: [30, 10, 40], accent: [160, 80, 255] },
  { bg: [40, 15, 10], accent: [255, 140, 60] },
  { bg: [10, 25, 40], accent: [80, 160, 255] },
  { bg: [20, 30, 15], accent: [100, 220, 100] },
];

function buildSlides(inv) {
  const { roi, midVal, devCost, low, high } = calcROI(inv);
  const { monthsToPrototype, monthsToPatent, monthsToMarket } = calcTimeline(inv);
  const sectors = (inv.market_sectors || []).join(", ") || "Multiple sectors";
  const claims = inv.patent_claims
    ? inv.patent_claims.split("|").map(c => c.trim()).filter(Boolean).slice(0, 3)
    : ["Proprietary mechanism", "Novel application", "Unique system integration"];

  return [
    {
      title: inv.hybrid_concept || "Invention Overview",
      subtitle: "Executive Summary",
      bullets: [
        `Synergy Score: ${inv.synergy_score || "N/A"}/100`,
        `IP Valuation: $${low}M – $${high}M`,
        `Target Markets: ${sectors}`,
        `Status: ${inv.status || "Draft"}`,
      ],
      highlight: `Est. ROI: ${roi}%`,
    },
    {
      title: "The Problem & Opportunity",
      subtitle: "Market Need",
      bullets: [
        "Significant gap in current technology landscape",
        `Target sector TAM: ${(inv.market_sectors || []).length > 0 ? "Multi-billion dollar" : "Emerging"} market`,
        "No dominant incumbent solution exists at this intersection",
        "High demand from defense, energy, and biotech sectors",
      ],
      highlight: `${sectors}`,
    },
    {
      title: "The Technology",
      subtitle: "IP & Innovation",
      bullets: claims,
      highlight: `${inv.synergy_score || 0}/100 Synergy Score`,
    },
    {
      title: "Market Applications",
      subtitle: "Commercial Opportunities",
      bullets: (inv.market_applications || "")
        .split(",").map(a => a.trim()).filter(Boolean).slice(0, 5).concat(["Licensing potential across jurisdictions"]),
      highlight: inv.ip_valuation || `$${low}M – $${high}M IP Value`,
    },
    {
      title: "Commercialization Timeline",
      subtitle: "Go-to-Market Roadmap",
      bullets: [
        `Month 0–${monthsToPrototype}: Prototype development & validation`,
        `Month ${monthsToPrototype}–${monthsToPatent}: Patent filing & prosecution`,
        `Month ${monthsToPatent}–${monthsToMarket}: Licensing outreach & partnerships`,
        `Month ${monthsToMarket}+: Full commercial deployment`,
        `Development investment est.: $${devCost.toFixed(2)}M`,
      ],
      highlight: `${monthsToMarket} months to market`,
    },
    {
      title: "Financial Projections & The Ask",
      subtitle: "ROI & Investment",
      bullets: [
        `IP Valuation Range: $${low}M – $${high}M`,
        `Mid-point valuation: $${midVal.toFixed(1)}M`,
        `Est. development cost: $${devCost.toFixed(2)}M`,
        `Projected ROI: ${roi}%`,
        `Licensing revenue potential: ${inv.suggested_next_steps ? "Multi-phase" : "TBD"}`,
      ],
      highlight: `${roi}% projected ROI`,
    },
  ];
}

// ── Slide Preview ────────────────────────────────────────────────────────────
function SlideCard({ slide, index, active, onClick }) {
  const col = SLIDE_COLORS[index % SLIDE_COLORS.length];
  const bg = `rgb(${col.bg.join(",")})`;
  const accent = `rgb(${col.accent.join(",")})`;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border-2 overflow-hidden transition-all ${active ? "border-cyan-500 scale-100" : "border-gray-700 hover:border-gray-600 opacity-70 hover:opacity-100"}`}
      style={{ background: bg }}
    >
      <div className="p-4">
        <p className="text-xs font-bold mb-0.5" style={{ color: accent }}>SLIDE {index + 1} · {slide.subtitle}</p>
        <p className="text-white font-black text-sm leading-snug mb-3">{slide.title}</p>
        <div className="space-y-1">
          {slide.bullets.slice(0, 3).map((b, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <div className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ background: accent }} />
              <p className="text-gray-300 text-xs">{b}</p>
            </div>
          ))}
        </div>
        {slide.highlight && (
          <div className="mt-3 px-2 py-1 rounded text-xs font-bold" style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}>
            {slide.highlight}
          </div>
        )}
      </div>
    </button>
  );
}

// ── PDF Export ───────────────────────────────────────────────────────────────
function exportPDF(inv, slides) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297, H = 210, M = 16, TW = W - M * 2;

  slides.forEach((slide, i) => {
    if (i > 0) doc.addPage();
    const col = SLIDE_COLORS[i % SLIDE_COLORS.length];

    // Background
    doc.setFillColor(...col.bg);
    doc.rect(0, 0, W, H, "F");

    // Accent bar
    doc.setFillColor(...col.accent);
    doc.rect(0, 0, 4, H, "F");

    // Slide number
    doc.setFillColor(255, 255, 255, 0.1);
    doc.setTextColor(...col.accent);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(`SLIDE ${i + 1} OF ${slides.length}  ·  ${slide.subtitle.toUpperCase()}`, M + 4, 12);

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(slide.title, TW - 40);
    doc.text(titleLines, M + 4, 26);
    let y = 26 + titleLines.length * 9 + 4;

    // Divider
    doc.setDrawColor(...col.accent);
    doc.setLineWidth(0.5);
    doc.line(M + 4, y, M + 80, y);
    y += 8;

    // Bullets
    doc.setFontSize(10);
    slide.bullets.forEach(b => {
      if (y > H - 25) return;
      doc.setTextColor(...col.accent);
      doc.text("▸", M + 4, y);
      doc.setTextColor(210, 210, 220);
      doc.setFont("helvetica", "normal");
      const bLines = doc.splitTextToSize(b, TW - 20);
      doc.text(bLines, M + 10, y);
      y += bLines.length * 5 + 3;
    });

    // Highlight box
    if (slide.highlight) {
      doc.setFillColor(...col.accent.map(v => Math.floor(v * 0.15)));
      doc.roundedRect(W - 85, H - 30, 70, 18, 2, 2, "F");
      doc.setDrawColor(...col.accent);
      doc.setLineWidth(0.4);
      doc.roundedRect(W - 85, H - 30, 70, 18, 2, 2, "S");
      doc.setTextColor(...col.accent);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(slide.highlight, W - 50, H - 19, { align: "center" });
    }

    // Footer
    doc.setTextColor(100, 100, 120);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(`${inv.hybrid_concept || "Invention"} — CONFIDENTIAL INVESTOR PRESENTATION`, M + 4, H - 6);
    doc.text(new Date().toLocaleDateString(), W - M, H - 6, { align: "right" });
  });

  const name = (inv.hybrid_concept || "pitch").replace(/[^a-zA-Z0-9]/g, "_").substring(0, 40);
  doc.save(`${name}_pitch_deck.pdf`);
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function PitchDeckBuilder() {
  const [inventions, setInventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [slides, setSlides] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [exported, setExported] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editSlide, setEditSlide] = useState(null);

  useEffect(() => {
    base44.entities.HybridInvention.list("-created_date", 50).then(data => {
      setInventions(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSelect = (inv) => {
    setSelected(inv);
    setSlides(buildSlides(inv));
    setActiveSlide(0);
    setExported(false);
    setEditMode(false);
  };

  const handleEditSave = () => {
    if (!editSlide) return;
    setSlides(slides.map((s, i) => i === activeSlide ? editSlide : s));
    setEditMode(false);
    setEditSlide(null);
  };

  const handleExport = () => {
    exportPDF(selected, slides);
    setExported(true);
  };

  const { roi, midVal, devCost, low, high } = selected ? calcROI(selected) : {};
  const timeline = selected ? calcTimeline(selected) : {};

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/dossier-workspace" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div className="flex items-center gap-2">
            <Presentation size={18} className="text-purple-400" />
            <div>
              <h1 className="text-white font-bold text-lg">Pitch Deck Builder</h1>
              <p className="text-gray-500 text-xs">Generate structured pitch decks with ROI & market timelines</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!selected ? (
          // Invention selection
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-white font-black text-2xl mb-2">Select an Invention</h2>
              <p className="text-gray-500">Choose a saved dossier to build your pitch deck. We'll auto-calculate ROI and timelines.</p>
            </div>
            {loading ? (
              <div className="text-center py-12 text-gray-500"><Loader2 size={24} className="animate-spin mx-auto mb-2" />Loading...</div>
            ) : inventions.length === 0 ? (
              <div className="text-center py-12 text-gray-600 border border-dashed border-gray-700 rounded-2xl">
                <Presentation size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">No saved inventions found.</p>
                <Link to="/research-membership" className="text-cyan-400 text-xs underline mt-1 inline-block">Generate a dossier first →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {inventions.map(inv => {
                  const r = calcROI(inv);
                  const t = calcTimeline(inv);
                  return (
                    <button key={inv.id} onClick={() => handleSelect(inv)} className="w-full p-5 rounded-xl border-2 border-gray-700 bg-gray-900 hover:border-purple-600 text-left transition-all group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-white font-bold">{inv.hybrid_concept || "Unnamed"}</p>
                          <p className="text-gray-400 text-xs mt-1">{inv.description?.substring(0, 100) || "No description"}...</p>
                          <div className="flex gap-4 mt-3 flex-wrap">
                            <div className="text-center">
                              <p className="text-xs text-gray-500">IP Value</p>
                              <p className="text-green-400 font-bold text-sm">${r.low}M–${r.high}M</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500">ROI</p>
                              <p className="text-cyan-400 font-bold text-sm">{r.roi}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Time to Market</p>
                              <p className="text-purple-400 font-bold text-sm">{t.monthsToMarket} mo</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Synergy</p>
                              <p className="text-yellow-400 font-bold text-sm">{inv.synergy_score || "—"}/100</p>
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-600 group-hover:text-purple-400 mt-1 flex-shrink-0 transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          // Deck builder
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: slide list + metrics */}
            <div className="space-y-5">
              {/* ROI & Timeline Cards */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-white font-black text-sm uppercase tracking-wider">Auto-Calculated Metrics</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-950/30 border border-green-800 rounded-xl p-3 text-center">
                    <TrendingUp size={16} className="text-green-400 mx-auto mb-1" />
                    <p className="text-green-400 font-black text-lg">{roi}%</p>
                    <p className="text-gray-500 text-xs">Projected ROI</p>
                  </div>
                  <div className="bg-cyan-950/30 border border-cyan-800 rounded-xl p-3 text-center">
                    <Target size={16} className="text-cyan-400 mx-auto mb-1" />
                    <p className="text-cyan-400 font-black text-lg">{timeline.monthsToMarket}mo</p>
                    <p className="text-gray-500 text-xs">Time to Market</p>
                  </div>
                  <div className="bg-purple-950/30 border border-purple-800 rounded-xl p-3 text-center">
                    <DollarSign size={16} className="text-purple-400 mx-auto mb-1" />
                    <p className="text-purple-400 font-black text-sm">${devCost?.toFixed(2)}M</p>
                    <p className="text-gray-500 text-xs">Dev Cost Est.</p>
                  </div>
                  <div className="bg-yellow-950/30 border border-yellow-800 rounded-xl p-3 text-center">
                    <Zap size={16} className="text-yellow-400 mx-auto mb-1" />
                    <p className="text-yellow-400 font-black text-lg">{selected.synergy_score}</p>
                    <p className="text-gray-500 text-xs">Synergy Score</p>
                  </div>
                </div>
              </div>

              {/* Slide list */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-2">
                <h3 className="text-white font-black text-sm uppercase tracking-wider mb-3">Slides</h3>
                {slides.map((slide, i) => (
                  <SlideCard key={i} slide={slide} index={i} active={activeSlide === i} onClick={() => { setActiveSlide(i); setEditMode(false); }} />
                ))}
              </div>

              <button onClick={() => setSelected(null)} className="w-full py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white text-sm transition-colors">
                ← Choose Different Invention
              </button>
            </div>

            {/* Right: active slide editor + preview */}
            <div className="lg:col-span-2 space-y-5">
              {/* Active slide preview */}
              {slides[activeSlide] && (() => {
                const slide = editMode ? editSlide : slides[activeSlide];
                const col = SLIDE_COLORS[activeSlide % SLIDE_COLORS.length];
                const accent = `rgb(${col.accent.join(",")})`;
                return (
                  <div className="rounded-2xl overflow-hidden border-2 border-gray-700" style={{ background: `rgb(${col.bg.join(",")})` }}>
                    <div className="p-8 min-h-72">
                      <p className="text-xs font-bold mb-2" style={{ color: accent }}>SLIDE {activeSlide + 1} · {slide?.subtitle}</p>
                      {editMode ? (
                        <input value={editSlide?.title || ""} onChange={e => setEditSlide({ ...editSlide, title: e.target.value })}
                          className="bg-transparent text-white font-black text-2xl w-full outline-none border-b border-gray-600 mb-4 pb-1"
                          placeholder="Slide title..." />
                      ) : (
                        <h2 className="text-white font-black text-2xl mb-4">{slide?.title}</h2>
                      )}
                      <div className="w-16 h-0.5 mb-5" style={{ background: accent }} />
                      <div className="space-y-3">
                        {(slide?.bullets || []).map((b, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: accent }} />
                            {editMode ? (
                              <input value={b} onChange={e => {
                                const newBullets = [...editSlide.bullets];
                                newBullets[i] = e.target.value;
                                setEditSlide({ ...editSlide, bullets: newBullets });
                              }} className="flex-1 bg-transparent text-gray-200 text-sm outline-none border-b border-gray-700 pb-0.5" />
                            ) : (
                              <p className="text-gray-200 text-sm">{b}</p>
                            )}
                          </div>
                        ))}
                      </div>
                      {slide?.highlight && (
                        <div className="mt-6 inline-block px-4 py-2 rounded-lg text-sm font-bold" style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}>
                          {slide.highlight}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Slide navigation & actions */}
              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={() => setActiveSlide(s => Math.max(0, s - 1))} disabled={activeSlide === 0}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white text-sm disabled:opacity-30 transition-colors">
                  <ChevronLeft size={14} /> Prev
                </button>
                <button onClick={() => setActiveSlide(s => Math.min(slides.length - 1, s + 1))} disabled={activeSlide === slides.length - 1}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white text-sm disabled:opacity-30 transition-colors">
                  Next <ChevronRight size={14} />
                </button>
                {editMode ? (
                  <>
                    <button onClick={handleEditSave} className="px-4 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white text-sm font-bold flex items-center gap-1.5 transition-colors">
                      <CheckCircle size={14} /> Save Changes
                    </button>
                    <button onClick={() => { setEditMode(false); setEditSlide(null); }} className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white text-sm transition-colors">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => { setEditMode(true); setEditSlide({ ...slides[activeSlide] }); }}
                    className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white text-sm transition-colors">
                    Edit Slide
                  </button>
                )}
                <div className="flex-1" />
                {exported ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-900/30 border border-green-700 text-green-300 text-sm font-bold">
                    <CheckCircle size={14} /> Downloaded!
                  </div>
                ) : (
                  <button onClick={handleExport}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all">
                    <Download size={14} /> Export PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}