import { useState, useMemo } from 'react';
import { Search, X, Filter } from 'lucide-react';

const AVAILABLE_TAGS = [
  'Scalar', 'MEG', 'Telomere', 'Bearden', 'Consciousness', 'Physics',
  'Bioelectromagnetics', 'Free Energy', 'Diagrams', 'Briefing', 'Technical'
];

export default function LibrarySearch({ items = [], onSearch }) {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchesQuery = !query || 
        item.label?.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => item.tags?.includes(tag));
      
      return matchesQuery && matchesTags;
    });
  }, [query, selectedTags, items]);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedTags([]);
  };

  const activeFilterCount = query.length > 0 ? 1 : 0 + selectedTags.length;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4">
      <div className="bg-gray-950/95 backdrop-blur-md border border-cyan-900/50 rounded-xl shadow-2xl"
        style={{ boxShadow: '0 0 30px rgba(0,200,255,0.2)' }}>
        
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
          <Search size={18} className="text-cyan-400" />
          <input
            type="text"
            placeholder="Search diagrams, papers, builds..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="flex-1 bg-transparent text-white outline-none text-sm placeholder-gray-500"
          />
          {(query || selectedTags.length > 0) && (
            <button onClick={clearFilters} className="text-gray-400 hover:text-white transition">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Expanded View */}
        {isOpen && (
          <>
            {/* Tag Filter Buttons */}
            <div className="px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Filter size={14} className="text-gray-500" />
                <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-cyan-600/40 border border-cyan-400 text-cyan-300'
                        : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-cyan-600/50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="px-4 py-3 max-h-64 overflow-y-auto">
              {filtered.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3">
                    {filtered.length} Result{filtered.length !== 1 ? 's' : ''}
                  </p>
                  {filtered.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-cyan-600/50 transition-all cursor-pointer">
                      <p className="text-sm font-bold text-cyan-300">{item.label || 'Item'}</p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.tags.map(tag => (
                            <span key={tag} className="inline-block px-2 py-0.5 rounded bg-cyan-900/30 text-cyan-400 text-xs font-bold">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 text-sm py-4">No results found</p>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-800 text-right">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-400 transition"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}