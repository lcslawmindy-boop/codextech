import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { BRIEF_PACKS } from "../../lib/briefPackData";
import { CheckCircle2, Clock, AlertCircle, Loader2, ChevronDown, ChevronUp, Zap, RefreshCw } from "lucide-react";

const STATUS_CONFIG = {
  complete: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-900/30", label: "Ready" },
  generating: { icon: Loader2, color: "text-yellow-400", bg: "bg-yellow-900/30", label: "Generating…", spin: true },
  error: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-900/30", label: "Error" },
  pending: { icon: Clock, color: "text-gray-500", bg: "bg-gray-800/40", label: "Not generated" },
};

export default function BriefPackContentGenerator() {
  const [contentMap, setContentMap] = useState({});
  const [generatingIds, setGeneratingIds] = useState(new Set());
  const [expanded, setExpanded] = useState(false);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(null); // { current, total, currentTitle }
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const records = await base44.entities.BriefPackContent.list();
      const map = {};
      records.forEach(r => { map[r.pack_id] = r; });
      setContentMap(map);
    } catch (e) {
      console.error(e);
    }
  };

  const generateOne = async (pack) => {
    setGeneratingIds(prev => new Set([...prev, pack.id]));
    setError(null);
    try {
      await base44.functions.invoke('generateBriefPackContentFast', {
        pack_id: pack.id,
        pack_title: pack.title,
        pack_subtitle: pack.subtitle,
        category: pack.category,
        theory_basis: pack.theory_basis,
        sections: pack.sections,
        difficulty: pack.difficulty,
        icon: pack.icon,
      });
      await loadContent();
    } catch (e) {
      setError(`Failed to generate "${pack.title}": ${e.message}`);
    }
    setGeneratingIds(prev => { const s = new Set(prev); s.delete(pack.id); return s; });
  };

  const generateAll = async () => {
    setBulkRunning(true);
    setError(null);
    const toGenerate = BRIEF_PACKS.filter(p => {
      const c = contentMap[p.id];
      return !c || c.status !== 'complete';
    });

    setBulkProgress({ current: 0, total: toGenerate.length, currentTitle: '' });

    for (let i = 0; i < toGenerate.length; i++) {
      const pack = toGenerate[i];
      setBulkProgress({ current: i + 1, total: toGenerate.length, currentTitle: pack.title });
      try {
        await base44.functions.invoke('generateBriefPackContentFast', {
          pack_id: pack.id,
          pack_title: pack.title,
          pack_subtitle: pack.subtitle,
          category: pack.category,
          theory_basis: pack.theory_basis,
          sections: pack.sections,
          difficulty: pack.difficulty,
          icon: pack.icon,
        });
        await loadContent();
      } catch (e) {
        console.error(`Failed: ${pack.title}`, e);
      }
    }

    setBulkRunning(false);
    setBulkProgress(null);
    await loadContent();
  };

  const completeCount = BRIEF_PACKS.filter(p => contentMap[p.id]?.status === 'complete').length;
  const totalPages = BRIEF_PACKS.reduce((sum, p) => sum + (contentMap[p.id]?.estimated_pages || 0), 0);
  const totalWords = BRIEF_PACKS.reduce((sum, p) => sum + (contentMap[p.id]?.word_count || 0), 0);

  return (
    <div className="bg-gray-900 border border-purple-800/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <button onClick={() => setExpanded(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-purple-950/20 hover:bg-purple-950/30 transition-colors text-left">
        <div className="flex items-center gap-3">
          <Zap size={15} className="text-purple-400" />
          <div>
            <p className="text-white font-black text-base">AI Content Generator — Full 1,400+ Page Packs</p>
            <p className="text-purple-300/60 text-xs mt-0.5">
              {completeCount}/33 packs generated · ~{totalPages.toLocaleString()} pages · ~{Math.round(totalWords / 1000)}K words
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {/* Progress bar */}
            <div className="w-24 h-2 rounded-full bg-gray-800 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${(completeCount / 33) * 100}%` }} />
            </div>
          </div>
          {expanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-3 space-y-4">
          {/* Warning */}
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl px-4 py-3 text-xs text-amber-200/80">
            <strong className="text-amber-300">Note:</strong> Each pack uses Claude Sonnet (non-default model) and generates ~40–60 pages of real engineering content. Generating all 33 takes ~5–10 minutes and uses significant integration credits. Generated content is saved permanently — you only pay once per pack.
          </div>

          {/* Bulk controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={generateAll}
              disabled={bulkRunning || completeCount === 33}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-black text-sm disabled:opacity-50 transition-all"
            >
              {bulkRunning ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
              {completeCount === 33 ? 'All Generated ✓' : bulkRunning ? `Generating ${bulkProgress?.current}/${bulkProgress?.total}…` : `Generate All ${33 - completeCount} Remaining`}
            </button>
            <button onClick={loadContent} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition-colors">
              <RefreshCw size={11} /> Refresh
            </button>
            {bulkProgress && (
              <p className="text-gray-400 text-xs">Currently: <span className="text-white font-bold">{bulkProgress.currentTitle}</span></p>
            )}
          </div>

          {error && (
            <div className="bg-red-950/30 border border-red-800/50 rounded-lg px-3 py-2 text-red-300 text-xs">{error}</div>
          )}

          {/* Pack list */}
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {BRIEF_PACKS.map((pack, i) => {
              const content = contentMap[pack.id];
              const status = generatingIds.has(pack.id) ? 'generating' : (content?.status || 'pending');
              const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
              const Icon = cfg.icon;

              return (
                <div key={pack.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-700/30 ${cfg.bg} transition-colors`}>
                  <span className="text-gray-600 text-xs font-mono w-5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-base flex-shrink-0">{pack.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-200 text-xs font-bold truncate">{pack.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-gray-600 text-xs">{pack.category}</span>
                      {content?.estimated_pages && <span className="text-gray-500 text-xs">~{content.estimated_pages}p</span>}
                      {content?.word_count && <span className="text-gray-500 text-xs">{Math.round(content.word_count / 1000)}K words</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold ${cfg.bg}`}>
                      <Icon size={10} className={`${cfg.color} ${cfg.spin ? 'animate-spin' : ''}`} />
                      <span className={cfg.color}>{cfg.label}</span>
                    </div>
                    <button
                      onClick={() => generateOne(pack)}
                      disabled={generatingIds.has(pack.id) || bulkRunning}
                      className="px-2 py-1 rounded-lg bg-gray-800 hover:bg-purple-900/60 text-gray-500 hover:text-purple-300 text-xs transition-all disabled:opacity-40"
                    >
                      {status === 'complete' ? 'Regen' : 'Generate'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {completeCount === 33 && (
            <div className="bg-green-950/30 border border-green-800/50 rounded-xl px-4 py-3 text-green-300 text-sm font-bold text-center">
              ✅ All 33 packs generated — ~{totalPages.toLocaleString()} total pages ready for download
            </div>
          )}
        </div>
      )}
    </div>
  );
}