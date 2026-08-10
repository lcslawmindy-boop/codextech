import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";
import { SLIDES } from "./TimelinePitchDeckData";
import { generateTimelinePitchPdf } from "@/lib/timelinePitchPdf";

// ── Visual components
function DamageGrid({ items }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((item, i) => (
        <div key={i} className="bg-black/40 border border-red-900/40 rounded-xl p-4">
          <div className="text-3xl mb-2">{item.icon}</div>
          <div className="text-2xl font-black text-red-400 mb-1">{item.stat}</div>
          <div className="text-white text-xs font-bold mb-1 leading-snug">{item.label}</div>
          <div className="text-gray-500 text-xs leading-relaxed">{item.detail}</div>
        </div>
      ))}
    </div>
  );
}

function SolutionGrid({ items }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((item, i) => (
        <div key={i} className="bg-black/40 border border-teal-900/40 rounded-xl p-4">
          <div className="text-3xl mb-2">{item.icon}</div>
          <div className="text-2xl font-black text-teal-400 mb-1">{item.stat}</div>
          <div className="text-white text-xs font-bold mb-1 leading-snug">{item.label}</div>
          <div className="text-gray-500 text-xs leading-relaxed">{item.detail}</div>
        </div>
      ))}
    </div>
  );
}

function BodyCols({ cols, accent }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cols.map((col, i) => (
        <div key={i} className="bg-black/40 border rounded-2xl p-5" style={{ borderColor: col.color + "40" }}>
          <p className="font-black text-sm mb-3 tracking-widest" style={{ color: col.color }}>{col.organ}</p>
          <ul className="space-y-2">
            {col.effects.map((e, j) => (
              <li key={j} className="text-gray-300 text-xs leading-relaxed flex gap-2">
                <span style={{ color: col.color }} className="flex-shrink-0 mt-0.5">▸</span>{e}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function TimelineCard({ item, accent }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {item.items.map((row, i) => (
        <div key={i} className="bg-black/40 border border-gray-800 rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>{row.cat}</p>
          <p className="text-gray-300 text-sm leading-relaxed">{row.text}</p>
        </div>
      ))}
    </div>
  );
}

function CostGrid({ costs }) {
  return (
    <div className="space-y-3">
      {costs.map((c, i) => (
        <div key={i} className="flex gap-4 items-start bg-black/40 border border-gray-800 rounded-xl px-5 py-4">
          <div className="w-16 flex-shrink-0">
            <p className="font-black text-lg" style={{ color: c.color }}>{c.year}</p>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-bold mb-1">{c.event}</p>
            <p className="text-gray-500 text-xs">{c.cost}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function MarketGrid({ markets }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {markets.map((m, i) => (
        <div key={i} className="bg-black/40 border rounded-2xl p-5" style={{ borderColor: m.color + "40" }}>
          <div className="flex justify-between items-start mb-2">
            <p className="font-black text-sm" style={{ color: m.color }}>{m.sector}</p>
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{m.timeline}</span>
          </div>
          <p className="text-2xl font-black text-white mb-2">{m.tam}</p>
          <p className="text-gray-400 text-xs leading-relaxed">{m.desc}</p>
        </div>
      ))}
    </div>
  );
}

function CTASlide({ slide, scenario }) {
  const s = slide[scenario];
  return (
    <div className="flex flex-col items-center justify-center text-center gap-8 px-4 max-w-3xl mx-auto w-full">
      <p className="text-gray-300 text-base leading-relaxed">{s.message}</p>
      <div className="flex flex-wrap justify-center gap-4">
        {s.actions.map((a, i) => (
          <Link key={i} to={a.to}
            className="px-6 py-3 rounded-2xl text-sm font-black text-white border-2 transition-all hover:scale-105"
            style={{ borderColor: a.color, backgroundColor: a.color + "20" }}>
            <div>{a.label}</div>
            <div className="text-xs opacity-60 font-normal mt-0.5">{a.sub}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CoverVisual({ scenario }) {
  return (
    <div className="flex items-center justify-center h-36">
      {scenario === "dark" ? (
        <div className="text-8xl opacity-60 animate-pulse">☠️</div>
      ) : (
        <div className="text-8xl opacity-80 animate-pulse">🌍</div>
      )}
    </div>
  );
}

function SlideContent({ slide, scenario }) {
  const s = slide[scenario];
  const isDark = scenario === "dark";

  if (slide.id === "cover") return <CoverVisual scenario={scenario} />;
  if (slide.id === "cta") return <CTASlide slide={slide} scenario={scenario} />;

  if (s.body) {
    if (slide.id === "problem") return isDark ? <DamageGrid items={s.body} /> : <SolutionGrid items={s.body} />;
    if (slide.id === "technology") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {s.body.map((item, i) => (
            <div key={i} className="bg-black/40 border border-gray-800 rounded-xl p-4 flex gap-3">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-white font-bold text-xs mb-1">{item.title}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }

  if (slide.id === "mechanism") return <BodyCols cols={s.cols} accent={s.accent} />;
  if (["timeline_10", "timeline_30", "timeline_50"].includes(slide.id)) return <TimelineCard item={s} accent={s.accent} />;
  if (slide.id === "opportunity") {
    return isDark ? <CostGrid costs={s.costs} /> : <MarketGrid markets={s.markets} />;
  }

  return null;
}

export default function TimelinePitchDeck() {
  const [slideIdx, setSlideIdx] = useState(0);
  const [scenario, setScenario] = useState("dark");
  const [downloading, setDownloading] = useState(false);

  const slide = SLIDES[slideIdx];
  const s = slide[scenario];
  const isDark = scenario === "dark";

  const prev = () => setSlideIdx(i => Math.max(0, i - 1));
  const next = () => setSlideIdx(i => Math.min(SLIDES.length - 1, i + 1));

  const handleDownload = async () => {
    setDownloading(true);
    try {
      generateTimelinePitchPdf();
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setTimeout(() => setDownloading(false), 500);
    }
  };

  return (
    <div className={`w-screen min-h-screen bg-gradient-to-br ${s.bg} flex flex-col text-white transition-all duration-700`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <h1 className="text-white font-bold text-sm tracking-tight">EMF Dark vs. Scalar Light — Pitch Deck</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* PDF Download */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black border-2 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            style={{ borderColor: s.accent, backgroundColor: s.accent + "20", color: s.accent }}
          >
            {downloading ? (
              <><Loader2 size={14} className="animate-spin" /> Generating...</>
            ) : (
              <><Download size={14} /> Investor PDF</>
            )}
          </button>

          {/* Scenario toggle */}
          <div className="flex rounded-xl overflow-hidden border border-gray-700">
            <button onClick={() => setScenario("dark")}
              className={`px-4 py-2 text-xs font-black transition-all ${scenario === "dark" ? "bg-red-900 text-white" : "text-gray-500 hover:text-gray-300"}`}>
              ☠️ DARK
            </button>
            <button onClick={() => setScenario("light")}
              className={`px-4 py-2 text-xs font-black transition-all ${scenario === "light" ? "bg-teal-900 text-white" : "text-gray-500 hover:text-gray-300"}`}>
              🌍 LIGHT
            </button>
          </div>
        </div>
      </div>

      {/* Slide nav tabs */}
      <div className="flex gap-1 px-5 py-2 border-b border-gray-800 overflow-x-auto flex-shrink-0">
        {SLIDES.map((sl, i) => (
          <button key={sl.id} onClick={() => setSlideIdx(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              slideIdx === i ? "text-white" : "text-gray-600 hover:text-gray-400"
            }`}
            style={slideIdx === i ? { backgroundColor: s.accent + "25", color: s.accent } : {}}>
            {i + 1}. {sl.label}
          </button>
        ))}
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col px-6 py-8 max-w-6xl mx-auto w-full">
        {/* Slide header */}
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: s.accent }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: s.accent }}>
              {isDark ? "☠️ WITHOUT SCALAR TRANSITION" : "✅ WITH SCALAR TRANSITION"}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">{s.title}</h2>
          <p className="text-gray-400 text-base">{s.subtitle}</p>
          {slide.id === "cover" && s.tag && (
            <div className="mt-3 inline-block px-3 py-1 rounded-full text-xs font-black border" style={{ borderColor: s.accent + "60", color: s.accent, backgroundColor: s.accent + "10" }}>
              {s.tag}
            </div>
          )}
          {["timeline_10", "timeline_30", "timeline_50"].includes(slide.id) && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-3xl">{s.icon}</span>
              <span className="text-xl font-black" style={{ color: s.accent }}>{s.years}</span>
            </div>
          )}
        </div>

        {/* Dynamic content area */}
        <div className="flex-1 overflow-y-auto">
          <SlideContent slide={slide} scenario={scenario} />
        </div>
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 flex-shrink-0">
        <button onClick={prev} disabled={slideIdx === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-white disabled:opacity-30 transition-all text-sm">
          <ChevronLeft size={16} /> Previous
        </button>

        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlideIdx(i)}
              className="w-2 h-2 rounded-full transition-all"
              style={{ backgroundColor: i === slideIdx ? s.accent : "#374151", transform: i === slideIdx ? "scale(1.4)" : "scale(1)" }} />
          ))}
        </div>

        <button onClick={next} disabled={slideIdx === SLIDES.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold disabled:opacity-30 transition-all"
          style={{ borderColor: s.accent + "60", color: s.accent, backgroundColor: s.accent + "10" }}>
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}