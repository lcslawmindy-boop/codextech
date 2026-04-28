import { useState, useMemo } from "react";
import { Search, Filter, Save, X, ChevronDown, Star, Eye } from "lucide-react";

const RESEARCH_ITEMS = [
  {
    id: 1,
    title: "Motionless Electromagnetic Generator (MEG)",
    category: "energy_systems",
    tags: ["Build Ready", "Patent"],
    source: "U.S. Patent 6,362,718",
    description: "Regauged electromagnetic system for energy extraction from the vacuum.",
    status: "verified",
    relevance: 98
  },
  {
    id: 2,
    title: "Prioré-Type Multichannel EM System",
    category: "bioelectromagnetics",
    tags: ["Experimental", "Government"],
    source: "ONR Report R-5-78 (Declassified)",
    description: "Therapeutic electromagnetic field generation for cellular treatment.",
    status: "declassified",
    relevance: 92
  },
  {
    id: 3,
    title: "Scalar EM Wave Transducer",
    category: "electromagnetics",
    tags: ["Build Ready", "Theoretical"],
    source: "Bearden, T.E. Energy from the Vacuum (2002)",
    description: "Converts scalar potentials into detectable electromagnetic signatures.",
    status: "verified",
    relevance: 88
  },
  {
    id: 4,
    title: "Time-Reversal Zone Cold Fusion Reactor",
    category: "energy_systems",
    tags: ["Theoretical", "Patent"],
    source: "U.S. Patents 5,123,445 & 5,607,611",
    description: "Electrolytic cell with scalar potential manipulation for excess energy.",
    status: "patent",
    relevance: 85
  },
  {
    id: 5,
    title: "Telemere Regeneration Device (TRD-1)",
    category: "bioelectromagnetics",
    tags: ["Experimental", "Government"],
    source: "Declassified Medical Research (1970s–1980s)",
    description: "Specific frequency treatment for cellular aging reversal.",
    status: "declassified",
    relevance: 81
  },
  {
    id: 6,
    title: "Anenergy System",
    category: "energy_systems",
    tags: ["Build Ready"],
    source: "Patent Application (Public Domain)",
    description: "Phi-field engineering for free energy extraction and scalar field generation.",
    status: "verified",
    relevance: 94
  },
  {
    id: 7,
    title: "Kaznacheyev Reversal Cell Imprinting",
    category: "bioelectromagnetics",
    tags: ["Experimental"],
    source: "Soviet Scientific Archives (Declassified)",
    description: "UV photon cellular state transfer via electromagnetic coupling.",
    status: "declassified",
    relevance: 79
  },
  {
    id: 8,
    title: "Atmospheric Scalar EM Signature Recognition",
    category: "electromagnetics",
    tags: ["Theoretical"],
    source: "DARPA Technical Reports (Declassified)",
    description: "Detection and analysis of scalar EM field modulations in atmospheric conditions.",
    status: "declassified",
    relevance: 77
  }
];

const CATEGORIES = [
  { id: "electromagnetics", label: "Electromagnetics", icon: "⚡" },
  { id: "bioelectromagnetics", label: "Bioelectromagnetics", icon: "🧬" },
  { id: "energy_systems", label: "Energy Systems", icon: "🔋" },
  { id: "patent_intelligence", label: "Patent Intelligence", icon: "⚖️" }
];

const TAGS = ["Build Ready", "Experimental", "Theoretical", "Patent", "Government"];

export default function ResearchDatabase() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedCollections, setSavedCollections] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [relevanceFilter, setRelevanceFilter] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");

  // Filter and search logic
  const filteredItems = useMemo(() => {
    return RESEARCH_ITEMS.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.source.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => item.tags.includes(tag));
      const matchesRelevance = item.relevance >= relevanceFilter;

      return matchesSearch && matchesCategory && matchesTags && matchesRelevance;
    }).sort((a, b) => {
      if (sortBy === "relevance") return b.relevance - a.relevance;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [searchQuery, selectedCategories, selectedTags, relevanceFilter, sortBy]);

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const saveCollection = () => {
    if (collectionName.trim() && selectedItems.length > 0) {
      setSavedCollections(prev => [...prev, {
        id: Date.now(),
        name: collectionName,
        items: selectedItems,
        createdAt: new Date().toLocaleDateString()
      }]);
      setCollectionName("");
      setSelectedItems([]);
      setShowSaveModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-mono">
      {/* Header */}
      <div className="border-b border-cyan-900/30 bg-gray-900/80 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-black text-cyan-300">RESEARCH DATABASE</h1>
              <p className="text-xs text-gray-500 mt-1">Institutional Research Intelligence Platform</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Total Records: {filteredItems.length}</p>
              <p className="text-xs text-cyan-400 font-bold">{selectedItems.length} Selected</p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-3 text-gray-600" />
              <input
                type="text"
                placeholder="Search systems, patents, sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                    selectedCategories.includes(cat.id)
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Tag Filters */}
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Advanced Options */}
            <div className="flex gap-4 items-center text-xs">
              <div className="flex items-center gap-2">
                <label className="text-gray-500">Min Relevance:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={relevanceFilter}
                  onChange={(e) => setRelevanceFilter(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-cyan-300 font-bold">{relevanceFilter}+</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-gray-500">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-xs focus:outline-none"
                >
                  <option value="relevance">Relevance</option>
                  <option value="title">Title A–Z</option>
                </select>
              </div>

              {selectedItems.length > 0 && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold transition-colors"
                >
                  <Save size={12} /> Save Collection
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">No results match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => toggleItemSelection(item.id)}
                className={`border rounded p-5 cursor-pointer transition-all ${
                  selectedItems.includes(item.id)
                    ? "bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-500/20"
                    : "bg-gray-900 border-gray-800 hover:border-gray-700"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-cyan-300 mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.source}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    {selectedItems.includes(item.id) && (
                      <div className="w-5 h-5 rounded border-2 border-cyan-400 bg-cyan-600 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    <div className={`text-right ${item.relevance >= 90 ? "text-green-400" : item.relevance >= 80 ? "text-yellow-400" : "text-orange-400"}`}>
                      <p className="text-xs font-bold">{item.relevance}</p>
                      <p className="text-xs">Score</p>
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="mb-3">
                  {CATEGORIES.map(cat => cat.id === item.category && (
                    <span key={cat.id} className="inline-block text-xs px-2 py-1 rounded bg-gray-800 text-gray-300">
                      {cat.icon} {cat.label}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-xs text-gray-400 leading-relaxed mb-4">{item.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-0.5 rounded font-bold ${
                        tag === "Build Ready"
                          ? "bg-green-900/40 text-green-300"
                          : tag === "Experimental"
                          ? "bg-yellow-900/40 text-yellow-300"
                          : tag === "Theoretical"
                          ? "bg-purple-900/40 text-purple-300"
                          : tag === "Patent"
                          ? "bg-blue-900/40 text-blue-300"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Eye size={12} /> View Details
                  </div>
                  <span className="font-bold text-cyan-400">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Collections Sidebar */}
      {savedCollections.length > 0 && (
        <div className="fixed right-0 top-0 h-screen w-80 bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto">
          <h3 className="font-black text-cyan-300 mb-4 text-sm">SAVED COLLECTIONS</h3>
          <div className="space-y-2">
            {savedCollections.map(collection => (
              <div key={collection.id} className="bg-gray-800 rounded p-3 text-xs">
                <p className="font-bold text-white mb-1">{collection.name}</p>
                <p className="text-gray-500">{collection.items.length} items</p>
                <p className="text-gray-600 text-xs mt-1">{collection.createdAt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-cyan-600 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-cyan-300">Save Collection</h2>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-gray-500 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Collection name..."
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 mb-4"
            />

            <div className="text-xs text-gray-400 mb-4">
              {selectedItems.length} systems selected
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white text-sm font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCollection}
                disabled={!collectionName.trim()}
                className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded text-white text-sm font-bold transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}