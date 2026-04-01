import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Presentation, ExternalLink, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const SLIDE_PREVIEWS = [
  { title: "Title Slide", desc: "Bearden Scalar EM — Market Analysis · April 2026" },
  { title: "Executive Summary", desc: "5 commercial domains · $2B–$400B+ addressable markets" },
  { title: "Market Landscape", desc: "Energy, Biotech, Defense, Education, Consulting TAMs" },
  { title: "Competitive Positioning", desc: "Moat analysis · first-mover structuring" },
  { title: "Revenue Model", desc: "5-tier model from digital products to investor syndication" },
  { title: "Go-To-Market Strategy", desc: "4-phase rollout · 0–36+ month roadmap" },
  { title: "Key Risks & Gaps", desc: "Validation gap · regulatory · IP complexity + mitigations" },
  { title: "Next Steps", desc: "5 immediate action items to launch commercialization" },
];

export default function MarketDeck() {
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGenerate = async () => {
    setStatus("loading");
    setErrorMsg("");
    const res = await base44.functions.invoke("generateMarketDeck", {});
    if (res.data?.error) {
      setErrorMsg(res.data.error);
      setStatus("error");
    } else {
      setResult(res.data);
      setStatus("done");
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-800 flex-shrink-0">
        <Link to="/business" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <ArrowLeft size={15} /> Business Models
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <div>
          <h1 className="text-white font-bold text-lg tracking-tight">Market Analysis Deck</h1>
          <p className="text-gray-500 text-xs">Generate a Google Slides presentation from Bearden research insights</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-6 py-10 max-w-3xl mx-auto w-full gap-8">

        {/* Intro card */}
        <div className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-900/40 border border-blue-800 flex items-center justify-center flex-shrink-0">
              <Presentation size={22} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base mb-1">8-Slide Market Analysis Deck</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Generates a complete investor-ready Google Slides presentation directly in your Google Drive, populated with market sizing, competitive positioning, revenue model, go-to-market strategy, and next steps — all derived from this platform's Bearden research network.
              </p>
            </div>
          </div>
        </div>

        {/* Slide preview list */}
        <div className="w-full">
          <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-3">Deck Contents</p>
          <div className="space-y-2">
            {SLIDE_PREVIEWS.map((s, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3">
                <span className="text-gray-600 text-xs font-mono font-bold w-5 flex-shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{s.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action area */}
        {status === "idle" && (
          <button
            onClick={handleGenerate}
            className="w-full py-4 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-base transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
          >
            <Presentation size={18} />
            Generate in Google Slides
          </button>
        )}

        {status === "loading" && (
          <div className="w-full py-4 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center gap-3 text-gray-300">
            <Loader2 size={18} className="animate-spin text-blue-400" />
            <span className="text-sm">Creating presentation in Google Slides…</span>
          </div>
        )}

        {status === "done" && result && (
          <div className="w-full bg-green-950/40 border border-green-800 rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
            <CheckCircle2 size={36} className="text-green-400" />
            <div>
              <p className="text-white font-bold text-base mb-1">Presentation Created!</p>
              <p className="text-gray-400 text-sm">{result.slideCount} slides generated and saved to your Google Drive.</p>
            </div>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-700 hover:bg-green-600 text-white font-semibold text-sm transition-colors"
            >
              <ExternalLink size={15} />
              Open in Google Slides
            </a>
            <button
              onClick={() => { setStatus("idle"); setResult(null); }}
              className="text-gray-600 hover:text-gray-400 text-xs"
            >
              Generate another
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="w-full bg-red-950/40 border border-red-800 rounded-2xl p-5 flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 font-semibold text-sm">Generation failed</p>
              <p className="text-red-500 text-xs mt-1">{errorMsg}</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-3 text-xs text-red-400 hover:text-red-300 underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}