import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Download, RefreshCw, Check, ExternalLink,
  BookOpen, Loader2, AlertCircle, Clock, Hash, Star
} from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function WixCourseImport() {
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState([]);
  const [imported, setImported] = useState(new Set());
  const [importing, setImporting] = useState(new Set());
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    setModules([]);
    setImported(new Set());
    try {
      const res = await base44.functions.invoke("importWixCourses", {});
      const data = res.data;
      if (!data.success) throw new Error(data.error || "Unknown error");
      setModules(data.modules || []);
      setFetched(true);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const importModule = async (mod) => {
    setImporting(prev => new Set([...prev, mod.wix_post_id]));
    try {
      // Save as a ResearchExperiment (course module) entity
      await base44.entities.ResearchExperiment.create({
        name: mod.title,
        description: mod.excerpt || mod.content?.slice(0, 500) || "",
        notes: [
          mod.url ? `Source: ${mod.url}` : "",
          mod.published_date ? `Published: ${new Date(mod.published_date).toLocaleDateString()}` : "",
          mod.reading_time ? `Reading time: ${mod.reading_time} min` : "",
          mod.hashtags?.length ? `Tags: ${mod.hashtags.join(", ")}` : "",
          `Wix Post ID: ${mod.wix_post_id}`,
        ].filter(Boolean).join("\n"),
      });
      setImported(prev => new Set([...prev, mod.wix_post_id]));
    } catch (e) {
      alert("Import failed: " + e.message);
    }
    setImporting(prev => { const n = new Set(prev); n.delete(mod.wix_post_id); return n; });
  };

  const importAll = async () => {
    const remaining = modules.filter(m => !imported.has(m.wix_post_id));
    for (const mod of remaining) {
      await importModule(mod);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs">
            <ArrowLeft size={13} /> Admin
          </Link>
          <div className="w-px h-4 bg-slate-700" />
          <div className="flex items-center gap-2">
            <BookOpen size={15} className="text-cyan-400" />
            <h1 className="text-white font-black text-sm">Wix Blog → Course Modules Import</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {fetched && modules.length > 0 && (
            <button
              onClick={importAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-700 hover:bg-green-600 text-white text-xs font-bold"
            >
              <Download size={12} /> Import All ({modules.filter(m => !imported.has(m.wix_post_id)).length} remaining)
            </button>
          )}
          <button
            onClick={fetchPosts}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 text-white text-xs font-bold"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
            {loading ? "Fetching..." : fetched ? "Re-fetch" : "Fetch from Wix"}
          </button>
        </div>
      </div>

      <div className="p-5 max-w-5xl mx-auto">
        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-950/40 border border-red-800 rounded-xl mb-5 text-sm text-red-300">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Empty state */}
        {!fetched && !loading && (
          <div className="text-center py-20">
            <BookOpen size={32} className="text-slate-700 mx-auto mb-4" />
            <h2 className="text-white font-black text-lg mb-2">Import Wix Blog Posts as Course Modules</h2>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              Click "Fetch from Wix" to retrieve all published blog posts from your connected Wix site and import them as research course modules.
            </p>
            <button onClick={fetchPosts} className="px-6 py-3 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-black text-sm">
              Fetch from Wix Blog →
            </button>
          </div>
        )}

        {/* No posts found */}
        {fetched && modules.length === 0 && !loading && (
          <div className="text-center py-16">
            <AlertCircle size={28} className="text-yellow-500 mx-auto mb-3" />
            <p className="text-white font-bold">No blog posts found on the connected Wix site.</p>
            <p className="text-slate-500 text-sm mt-1">Make sure your Wix site has published blog posts and the connected account has access to them.</p>
          </div>
        )}

        {/* Summary bar */}
        {fetched && modules.length > 0 && (
          <div className="flex items-center gap-5 mb-5 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl">
            <div>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider">Total Posts</p>
              <p className="text-cyan-400 font-black text-xl">{modules.length}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider">Imported</p>
              <p className="text-green-400 font-black text-xl">{imported.size}</p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider">Remaining</p>
              <p className="text-yellow-400 font-black text-xl">{modules.length - imported.size}</p>
            </div>
          </div>
        )}

        {/* Posts grid */}
        {modules.length > 0 && (
          <div className="space-y-3">
            {modules.map((mod) => {
              const isImported = imported.has(mod.wix_post_id);
              const isImporting = importing.has(mod.wix_post_id);
              return (
                <div key={mod.wix_post_id}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                    isImported
                      ? "bg-green-950/20 border-green-800/40"
                      : "bg-slate-900 border-slate-800 hover:border-slate-700"
                  }`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {mod.featured && <Star size={10} className="text-yellow-400 flex-shrink-0" />}
                      <h3 className="text-white font-bold text-sm truncate">{mod.title}</h3>
                    </div>
                    {mod.excerpt && (
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-2">{mod.excerpt}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-600">
                      {mod.published_date && (
                        <span className="flex items-center gap-1">
                          <Clock size={9} /> {new Date(mod.published_date).toLocaleDateString()}
                        </span>
                      )}
                      {mod.reading_time > 0 && (
                        <span>{mod.reading_time} min read</span>
                      )}
                      {mod.hashtags?.slice(0, 4).map(tag => (
                        <span key={tag} className="flex items-center gap-0.5 text-cyan-700">
                          <Hash size={8} />{tag}
                        </span>
                      ))}
                      {mod.url && (
                        <a href={mod.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-slate-500 hover:text-slate-300">
                          <ExternalLink size={9} /> View on Wix
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => importModule(mod)}
                    disabled={isImported || isImporting}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isImported
                        ? "bg-green-900/40 text-green-400 cursor-default"
                        : "bg-cyan-800 hover:bg-cyan-700 text-white disabled:opacity-50"
                    }`}
                  >
                    {isImporting ? (
                      <><Loader2 size={11} className="animate-spin" /> Importing…</>
                    ) : isImported ? (
                      <><Check size={11} /> Imported</>
                    ) : (
                      <><Download size={11} /> Import</>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}