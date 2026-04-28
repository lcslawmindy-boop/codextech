import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, Lock, ArrowRight } from "lucide-react";
import { researchEntries, categories, tags } from "@/lib/codextechResearchEntries";

export default function CodextechDatabase() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEntries = researchEntries.filter(entry => {
    const matchesCategory = !selectedCategory || entry.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => entry.tags.includes(tag));
    const matchesSearch = !searchQuery || entry.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTags && matchesSearch;
  });

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/codextech" className="flex items-center gap-3 hover:opacity-80">
            <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white font-black text-xs">CX</div>
            <span className="font-black text-sm">C.O.D.E.X.T.E.C.H.</span>
          </Link>
          <div className="text-sm text-gray-600">Research Database</div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-6 min-h-screen">
          {/* Categories */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4">Categories</h3>
            <div className="space-y-2">
              <button onClick={() => setSelectedCategory(null)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  !selectedCategory ? "bg-gray-900 text-white font-bold" : "text-gray-600 hover:bg-gray-100"
                }`}>
                All Categories
              </button>
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat ? "bg-gray-900 text-white font-bold" : "text-gray-600 hover:bg-gray-100"
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filters */}
          <div>
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-4">Filter by Type</h3>
            <div className="space-y-2">
              {tags.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedTags.includes(tag) ? "bg-gray-900 text-white font-bold" : "text-gray-600 hover:bg-gray-100"
                  }`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Search */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-3 text-gray-400" />
              <input type="text" placeholder="Search research entries..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-900"
              />
            </div>
          </div>

          {/* Results */}
          <div className="max-w-6xl mx-auto">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No entries match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredEntries.map(entry => (
                  <div key={entry.id} className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">{entry.title}</h3>
                      {entry.accessLevel !== "Research" && (
                        <Lock size={14} className="text-yellow-600 flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex gap-2 flex-wrap mb-4">
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                        {entry.category}
                      </span>
                      {entry.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{entry.summary}</p>

                    <div className="space-y-3 mb-4 text-xs text-gray-600 border-t border-gray-200 pt-4">
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Build Implication</p>
                        <p>{entry.buildImplication}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Limitations</p>
                        <p>{entry.limitations}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                      <span className="text-xs text-gray-500">{entry.sourceType}</span>
                      <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
                        View <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}