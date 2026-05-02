import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Heart, Clock, ChevronRight, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const RECENT_DOCS_KEY = "zenith_apex_recent_docs";
const FAVORITES_KEY = "zenith_apex_fav_builds";

export function trackRecentDoc(doc) {
  const existing = JSON.parse(localStorage.getItem(RECENT_DOCS_KEY) || "[]");
  const filtered = existing.filter(d => d.id !== doc.id);
  const updated = [{ ...doc, viewedAt: Date.now() }, ...filtered].slice(0, 5);
  localStorage.setItem(RECENT_DOCS_KEY, JSON.stringify(updated));
}

export function toggleFavoriteBuild(build) {
  const existing = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  const found = existing.find(b => b.id === build.id);
  const updated = found
    ? existing.filter(b => b.id !== build.id)
    : [build, ...existing];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return !found;
}

export function isFavoriteBuild(id) {
  const existing = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  return existing.some(b => b.id === id);
}

export default function UserDashboardSection() {
  const [user, setUser] = useState(null);
  const [courseProgress, setCourseProgress] = useState([]);
  const [recentDocs, setRecentDocs] = useState([]);
  const [favBuilds, setFavBuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const authed = await base44.auth.isAuthenticated();
      if (!authed) { setLoading(false); return; }

      const me = await base44.auth.me();
      setUser(me);

      // Load course progress
      const progress = await base44.entities.CourseProgress.filter({ user_email: me.email });
      setCourseProgress(progress);

      // Load from localStorage
      setRecentDocs(JSON.parse(localStorage.getItem(RECENT_DOCS_KEY) || "[]"));
      setFavBuilds(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 size={20} className="text-gray-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center">
        <p className="text-gray-400 text-sm mb-4">Sign in to track your progress, save favorites, and continue where you left off.</p>
        <button
          onClick={() => base44.auth.redirectToLogin()}
          className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  const hasAnything = courseProgress.length > 0 || recentDocs.length > 0 || favBuilds.length > 0;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Welcome back, {user.full_name?.split(" ")[0] || "Researcher"}</h2>
          <p className="text-gray-500 text-sm mt-1">Pick up where you left off</p>
        </div>
        <Link to="/my-learning" className="text-cyan-400 hover:text-cyan-300 text-xs font-black flex items-center gap-1">
          My Library <ChevronRight size={12} />
        </Link>
      </div>

      {!hasAnything && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center text-gray-500 text-sm">
          Nothing here yet — start a course, open a build plan, or browse the research archive!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Course Progress */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-cyan-400" />
            <span className="font-black text-sm text-white">Course Progress</span>
          </div>
          {courseProgress.length === 0 ? (
            <p className="text-gray-600 text-xs">No courses started yet.</p>
          ) : (
            <div className="space-y-3">
              {courseProgress.slice(0, 3).map((cp, i) => {
                const pct = cp.completed
                  ? 100
                  : cp.completed_lessons?.length
                  ? Math.round((cp.completed_lessons.length / 10) * 100)
                  : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-300 font-semibold truncate max-w-[75%]">{cp.course_title}</span>
                      <span className="text-xs text-cyan-400 font-black">{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full">
                      <div
                        className="h-1.5 bg-cyan-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {cp.last_lesson && (
                      <p className="text-xs text-gray-600 mt-0.5 truncate">Last: {cp.last_lesson}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <Link to="/my-learning" className="mt-4 block text-xs text-cyan-500 hover:text-cyan-400 font-black">
            {courseProgress.length === 0 ? "Browse Courses →" : "View All →"}
          </Link>
        </div>

        {/* Saved Builds */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Heart size={16} className="text-pink-400" />
            <span className="font-black text-sm text-white">Saved Build Plans</span>
          </div>
          {favBuilds.length === 0 ? (
            <p className="text-gray-600 text-xs">No saved plans yet.</p>
          ) : (
            <div className="space-y-2">
              {favBuilds.slice(0, 3).map((b, i) => (
                <Link
                  key={i}
                  to={b.path || "/invention-plans"}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors group"
                >
                  <span className="text-pink-400 text-sm">♥</span>
                  <span className="text-xs text-gray-300 group-hover:text-white font-semibold truncate">{b.title}</span>
                  <ChevronRight size={10} className="ml-auto text-gray-600 group-hover:text-gray-400" />
                </Link>
              ))}
            </div>
          )}
          <Link to="/invention-plans" className="mt-4 block text-xs text-pink-500 hover:text-pink-400 font-black">
            {favBuilds.length === 0 ? "Browse Build Plans →" : "View All →"}
          </Link>
        </div>

        {/* Recently Viewed */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-green-400" />
            <span className="font-black text-sm text-white">Continue Reading</span>
          </div>
          {recentDocs.length === 0 ? (
            <p className="text-gray-600 text-xs">No recently viewed documents.</p>
          ) : (
            <div className="space-y-2">
              {recentDocs.slice(0, 3).map((doc, i) => (
                <Link
                  key={i}
                  to={doc.path || "/research-database"}
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors group"
                >
                  <span className="text-green-400 text-sm mt-0.5">📄</span>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-300 group-hover:text-white font-semibold truncate">{doc.title}</p>
                    <p className="text-xs text-gray-600">{doc.type || "Document"}</p>
                  </div>
                  <ChevronRight size={10} className="ml-auto mt-1 text-gray-600 group-hover:text-gray-400 flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
          <Link to="/research-database" className="mt-4 block text-xs text-green-500 hover:text-green-400 font-black">
            {recentDocs.length === 0 ? "Browse Research →" : "Browse More →"}
          </Link>
        </div>
      </div>
    </div>
  );
}