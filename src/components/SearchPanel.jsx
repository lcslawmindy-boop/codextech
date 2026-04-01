import { useState, useCallback } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { search, getHighlightedText } from "../lib/searchIndex";
import { groupColors } from "../lib/beardenData";

const THEME_SUGGESTIONS = ["consciousness", "weaponry", "logic", "disease", "physics", "life", "soviet", "electromagnetic", "memory", "reincarnation"];

export default function SearchPanel({ onResultClick, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback((q) => {
    setQuery(q);
    if (q.trim().length >= 2) {
      setResults(search(q));
      setSearched(true);
    } else {
      setResults([]);
      setSearched(false);
    }
  }, []);

  return (
    <div className="absolute top-4 left-4 w-96 max-h-[calc(100vh-2rem)] flex flex-col bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-20">
      {/* Search input */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-700">
        <Search size={16} className="text-gray-400 flex-shrink-0" />
        <input
          autoFocus
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search themes, concepts, keywords…"
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
        />
        <button onClick={onClose} className="text-gray-500 hover:text-white">
          <X size={16} />
        </button>
      </div>

      {/* Theme suggestions */}
      {!searched && (
        <div className="p-3 border-b border-gray-800">
          <p className="text-gray-500 text-xs mb-2">Try a theme:</p>
          <div className="flex flex-wrap gap-1.5">
            {THEME_SUGGESTIONS.map(t => (
              <button
                key={t}
                onClick={() => handleSearch(t)}
                className="px-2 py-0.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs border border-gray-700 hover:border-gray-500 transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="overflow-y-auto flex-1">
        {searched && results.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">No results found for "{query}"</p>
        )}
        {results.map((result, i) => {
          const color = groupColors[result.nodeGroup] || "#6b7280";
          const parts = getHighlightedText(result.text, query);
          return (
            <button
              key={i}
              onClick={() => onResultClick(result.nodeId)}
              className="w-full text-left p-3 border-b border-gray-800 hover:bg-gray-800 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-xs font-semibold" style={{ color }}>{result.nodeLabel}</span>
                <ChevronRight size={11} className="text-gray-600 ml-auto group-hover:text-gray-400" />
              </div>
              <p className="text-gray-300 text-xs leading-relaxed line-clamp-4">
                {Array.isArray(parts)
                  ? parts.map((part, j) =>
                      query.trim().split(/\s+/).some(w => part.toLowerCase() === w.toLowerCase()) ? (
                        <mark key={j} className="bg-yellow-500/30 text-yellow-200 rounded px-0.5">{part}</mark>
                      ) : (
                        <span key={j}>{part}</span>
                      )
                    )
                  : parts}
              </p>
            </button>
          );
        })}
        {results.length > 0 && (
          <p className="text-gray-600 text-xs text-center py-2">{results.length} result{results.length > 1 ? "s" : ""}</p>
        )}
      </div>
    </div>
  );
}