import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2, MessageCircle, FileText, BookOpen, GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";

const SITE_INDEX = [
  { title: "Free Preview", path: "/free-vault", category: "Access" },
  { title: "Research Membership", path: "/research-membership", category: "Membership" },
  { title: "À La Carte Shop", path: "/alacarte", category: "Shop" },
  { title: "Courses", path: "/courses", category: "Learning" },
  { title: "Build Plans", path: "/invention-plans", category: "Building" },
  { title: "Patent Tools", path: "/patent-drafting-wizard", category: "Tools" },
  { title: "IP Marketplace", path: "/ip-marketplace", category: "Marketplace" },
  { title: "Account Settings", path: "/account", category: "Account" },
  { title: "Download Center", path: "/download-center", category: "Resources" },
  { title: "Device Graph", path: "/device-graph", category: "Research" },
  { title: "Pitch Deck Builder", path: "/pitch-deck-builder", category: "Tools" },
  { title: "FTO Analysis", path: "/fto-analysis", category: "Tools" },
  { title: "AI Patent Attorney", path: "/patent-attorney-chat", category: "Tools" },
  { title: "Invention Dossier", path: "/invention-dossier", category: "AI" },
  { title: "Build Supplies", path: "/build-supplies-shop", category: "Shop" },
  { title: "Community Forum", path: "/community", category: "Community" },
];

export default function SiteSearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const searchRef = useRef(null);

  const handleSearch = (value) => {
    setQuery(value);
    if (value.trim().length === 0) {
      setResults([]);
      return;
    }

    const filtered = SITE_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.category.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
  };

  const handleSelectResult = (path) => {
    window.location.href = path;
    setIsOpen(false);
    setQuery("");
  };

  const handleAskAssistant = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setShowAssistant(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `User is asking about the Zenith Apex Tech research platform. Their question: "${query}". Provide a helpful, concise answer (2-3 sentences) about the platform, its features, or how to navigate. Be friendly and informative.`,
      });

      // Results are already in response format
      console.log("AI Response:", response);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <motion.div 
      drag
      dragMomentum={false}
      onDragEnd={(event, info) => {
        setPosition({ x: position.x + info.offset.x, y: position.y + info.offset.y });
      }}
      style={{ x: position.x, y: position.y }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[8990] w-full max-w-2xl px-4 pointer-events-auto" 
      ref={searchRef}
    >
      <style>{`
        .search-input-focus {
          box-shadow: 0 0 24px rgba(0, 220, 255, 0.5), inset 0 0 12px rgba(0, 220, 255, 0.1);
          border-color: rgba(0, 220, 255, 0.8);
        }
      `}</style>

      {/* Search Bar */}
      <div
        className={`relative transition-all duration-300 ${
          isOpen ? "scale-100" : "scale-100 opacity-85 hover:opacity-100"
        }`}
      >
        <div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-600/60 bg-gray-950/90 backdrop-blur-md transition-all shadow-lg hover:shadow-xl cursor-grab active:cursor-grabbing ${
            isOpen ? "search-input-focus shadow-2xl" : ""
          }`}
        >
          <GripVertical size={14} className="text-gray-600 hover:text-cyan-400 flex-shrink-0 cursor-grab" />
          <Search size={16} className="text-cyan-500 flex-shrink-0" />
          <Search size={16} className="text-gray-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search courses, tools, research..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {isOpen && (query.length > 0 || results.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
            {results.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {/* Group by category */}
                  {Array.from(new Set(results.map((r) => r.category))).map((category) => (
                    <div key={category}>
                      <p className="px-3 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        {category}
                      </p>
                      {results
                        .filter((r) => r.category === category)
                        .map((result) => (
                          <button
                            key={result.path}
                            onClick={() => handleSelectResult(result.path)}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white text-sm flex items-center gap-2"
                          >
                            {category === "Learning" && <BookOpen size={14} className="text-cyan-400" />}
                            {category === "Tools" && <FileText size={14} className="text-green-400" />}
                            {category === "AI" && <MessageCircle size={14} className="text-purple-400" />}
                            {!["Learning", "Tools", "AI"].includes(category) && (
                              <div className="w-3.5 h-3.5 rounded-full bg-gray-700" />
                            )}
                            {result.title}
                          </button>
                        ))}
                    </div>
                  ))}
                </div>

                {/* Ask AI Assistant */}
                <div className="border-t border-gray-800 p-3">
                  <button
                    onClick={handleAskAssistant}
                    disabled={loading}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-700/50 hover:bg-purple-900/50 text-purple-300 hover:text-purple-200 transition-colors text-sm font-bold disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Asking AI Assistant...
                      </>
                    ) : (
                      <>
                        <MessageCircle size={14} />
                        Ask AI Assistant
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 text-sm">
                <p>Start typing to search or ask a question...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}