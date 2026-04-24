import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function CodextechAcronym() {
  const [expanded, setExpanded] = useState(false);

  const meanings = [
    {
      letter: "C",
      word: "Comprehensive",
      description: "Complete engineering systems, not fragments",
      link: "/invention-plans",
      linkText: "Browse Builds"
    },
    {
      letter: "O",
      word: "Open-Source",
      description: "Patent-backed, documented, peer-reviewed research",
      link: "/prior-art",
      linkText: "View Prior Art"
    },
    {
      letter: "D",
      word: "Designed",
      description: "For builders, researchers, and inventors",
      link: "/courses",
      linkText: "Start Learning"
    },
    {
      letter: "E",
      word: "Execution",
      description: "From theory to working prototypes",
      link: "/invention-plans",
      linkText: "See Plans"
    },
    {
      letter: "X",
      word: "eXperimental",
      description: "Cutting-edge electromagnetic and energy research",
      link: "/lab",
      linkText: "Lab Access"
    },
    {
      letter: "T",
      word: "Technical",
      description: "Advanced engineering frameworks and tools",
      link: "/patent-tool",
      linkText: "Patent Tools"
    },
    {
      letter: "E",
      word: "Education",
      description: "26+ structured courses with primary sources",
      link: "/courses",
      linkText: "Explore"
    },
    {
      letter: "C",
      word: "Community",
      description: "2,000+ builders, researchers, engineers",
      link: "/community",
      linkText: "Join"
    },
    {
      letter: "H",
      word: "Hardware",
      description: "Pre-assembled component kits ready to ship",
      link: "/invention-plans",
      linkText: "Shop Kits"
    },
  ];

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gray-800/40 border border-gray-700 hover:bg-gray-800/60 transition-all"
      >
        <span className="text-gray-300 text-sm font-bold">What C.O.D.E.X.T.E.C.H. Stands For</span>
        {expanded ? (
          <ChevronUp size={16} className="text-cyan-400" />
        ) : (
          <ChevronDown size={16} className="text-cyan-400" />
        )}
      </button>

      {expanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in duration-300">
          {meanings.map((item, i) => (
            <div
              key={i}
              className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 hover:border-cyan-700 transition-all group"
            >
              {/* Letter badge */}
              <div className="w-10 h-10 rounded-lg bg-cyan-600/20 border border-cyan-700 flex items-center justify-center mb-3">
                <span className="text-cyan-300 font-black text-lg">{item.letter}</span>
              </div>

              {/* Word + description */}
              <h4 className="text-white font-bold text-sm mb-1">{item.word}</h4>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">{item.description}</p>

              {/* Link */}
              <Link
                to={item.link}
                className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors group-hover:underline"
              >
                {item.linkText} →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}