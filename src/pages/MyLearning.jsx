import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Play, Lock, CheckCircle2, Loader2, Award, Clock, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { businessItems } from "../lib/businessItems";
import LessonViewer from "../components/LessonViewer";

const allCourses = businessItems.filter(i => i.category === "Course" || i.category === "Book/PDF");

function ProgressRing({ pct, size = 48, color = "#a855f7" }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1f2937" strokeWidth={5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.5s" }} />
    </svg>
  );
}

function CourseCard({ course, purchased, progress, onOpen }) {
  const completedCount = progress?.completed_lessons?.length || 0;
  const total = course.modules.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const isComplete = progress?.completed;

  return (
    <div className={`bg-gray-900 border rounded-2xl overflow-hidden flex flex-col transition-all ${
      purchased ? "border-gray-700 hover:border-gray-500" : "border-gray-800 opacity-60"
    }`}>
      <div className="h-1.5 w-full" style={{ backgroundColor: purchased ? course.color : "#374151" }} />
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{course.icon}</span>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs px-2 py-0.5 rounded font-semibold"
                  style={{ backgroundColor: course.color + "20", color: course.color }}>
                  {course.category}
                </span>
                {isComplete && (
                  <span className="text-xs px-2 py-0.5 rounded font-semibold bg-green-900/40 text-green-400 flex items-center gap-1">
                    <Award size={10} /> Completed
                  </span>
                )}
              </div>
              <h3 className="text-white font-bold text-sm leading-snug">{course.title}</h3>
            </div>
          </div>
          {purchased && total > 0 && (
            <div className="flex-shrink-0 relative">
              <ProgressRing pct={pct} color={isComplete ? "#22c55e" : course.color} />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white rotate-90 -scale-y-100" style={{ transform: "none" }}>
                {pct}%
              </span>
            </div>
          )}
        </div>

        {purchased && total > 0 && (
          <div className="text-xs text-gray-500">
            {completedCount} of {total} lessons · {total - completedCount} remaining
          </div>
        )}

        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{course.description}</p>

        <div className="mt-auto pt-3 border-t border-gray-800">
          {purchased ? (
            <button
              onClick={() => onOpen(course)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: course.color + "cc" }}
            >
              {pct === 0 ? <Play size={13} /> : pct === 100 ? <Award size={13} /> : <ChevronRight size={13} />}
              {pct === 0 ? "Start Learning" : pct === 100 ? "Review Course" : "Continue"}
            </button>
          ) : (
            <Link
              to="/courses"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-gray-500 border border-gray-700 hover:border-gray-500 transition-all"
            >
              <Lock size={13} /> Purchase to Unlock — {course.price}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyLearning() {
  const [purchases, setPurchases] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCourse, setActiveCourse] = useState(null);
  const [filter, setFilter] = useState("all");

  const loadData = async () => {
    setLoading(true);
    const user = await base44.auth.me();

    // Fetch Stripe purchases
    let purchasedTitles = new Set();
    try {
      const res = await base44.functions.invoke("getUserPurchases", {});
      (res.data?.purchases || []).forEach(p => purchasedTitles.add(p.product_title));
    } catch (e) {
      console.warn("Could not fetch purchases:", e.message);
    }
    setPurchases(purchasedTitles);

    // Fetch progress records
    const progressRecords = await base44.entities.CourseProgress.filter({ user_email: user.email });
    const map = {};
    progressRecords.forEach(r => { map[r.course_title] = r; });
    setProgressMap(map);

    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const activeCount = purchases.size;
  const completedCount = Object.values(progressMap).filter(p => p.completed).length;
  const inProgressCount = Object.values(progressMap).filter(p => !p.completed && p.completed_lessons?.length > 0).length;

  const filteredCourses = allCourses.filter(c => {
    if (filter === "purchased") return purchases.has(c.title);
    if (filter === "in-progress") return progressMap[c.title] && !progressMap[c.title].completed;
    if (filter === "completed") return progressMap[c.title]?.completed;
    return true;
  });

  if (activeCourse) {
    return (
      <LessonViewer
        course={activeCourse}
        progress={progressMap[activeCourse.title]}
        onProgressUpdate={loadData}
        onClose={() => setActiveCourse(null)}
      />
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">My Learning</h1>
            <p className="text-gray-500 text-xs">Your purchased courses & documents</p>
          </div>
        </div>
        <Link to="/courses" className="text-xs px-3 py-1.5 rounded-lg bg-purple-900/40 border border-purple-700 text-purple-300 hover:bg-purple-800/40 transition-colors">
          Browse More Courses
        </Link>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-purple-400" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 py-8 max-w-7xl mx-auto w-full">

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Purchased", value: activeCount, icon: BookOpen, color: "text-blue-400" },
              { label: "In Progress", value: inProgressCount, icon: Clock, color: "text-yellow-400" },
              { label: "Completed", value: completedCount, icon: CheckCircle2, color: "text-green-400" },
              { label: "Available", value: allCourses.length, icon: Play, color: "text-purple-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
                <Icon size={18} className={color} />
                <div>
                  <p className="text-white font-bold text-xl">{value}</p>
                  <p className="text-gray-500 text-xs">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* No purchases state */}
          {activeCount === 0 && (
            <div className="mb-8 bg-yellow-950/30 border border-yellow-800/50 rounded-2xl p-6 flex items-start gap-4">
              <Lock size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-300 font-semibold mb-1">No purchases found yet</p>
                <p className="text-yellow-700 text-sm">Courses you purchase will unlock here with full lesson access and progress tracking.</p>
                <Link to="/courses" className="inline-block mt-3 text-xs px-4 py-2 rounded-lg bg-yellow-800/40 border border-yellow-700 text-yellow-300 hover:bg-yellow-700/40 transition-colors font-semibold">
                  Browse Courses →
                </Link>
              </div>
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: "all", label: `All (${allCourses.length})` },
              { id: "purchased", label: `Purchased (${activeCount})` },
              { id: "in-progress", label: `In Progress (${inProgressCount})` },
              { id: "completed", label: `Completed (${completedCount})` },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  filter === id ? "bg-gray-700 border-gray-500 text-white" : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Course grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredCourses.map((course, i) => (
              <CourseCard
                key={i}
                course={course}
                purchased={purchases.has(course.title)}
                progress={progressMap[course.title]}
                onOpen={setActiveCourse}
              />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-16 text-gray-600">
              <p className="text-lg mb-1">No courses here yet</p>
              <p className="text-sm">Try a different filter or browse the catalog.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}