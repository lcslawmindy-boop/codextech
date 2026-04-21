import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Zap, BookOpen, Lightbulb, FolderOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const QUICK_WINS = [
  {
    id: "course",
    title: "Enroll in Your First Course",
    description: "Start learning scalar EM theory or patent strategy",
    icon: BookOpen,
    path: "/courses",
    cta: "Browse Courses",
    color: "#3b82f6"
  },
  {
    id: "invention",
    title: "Generate Your First Invention",
    description: "Use AI Forge to create a complete invention dossier",
    icon: Lightbulb,
    path: "/inventor-forge",
    cta: "Generate Now",
    color: "#f59e0b"
  },
  {
    id: "project",
    title: "Create a Build Project",
    description: "Start tracking your first device or research project",
    icon: FolderOpen,
    path: "/my-research",
    cta: "Create Project",
    color: "#10b981"
  }
];

export default function QuickWinsTracker({ userEmail }) {
  const [progress, setProgress] = useState({
    course: false,
    invention: false,
    project: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load onboarding progress from localStorage for now
    const stored = localStorage.getItem(`quickwins_${userEmail}`);
    if (stored) {
      setProgress(JSON.parse(stored));
    }
    setLoading(false);
  }, [userEmail]);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressPercent = (completedCount / QUICK_WINS.length) * 100;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-800 bg-gray-900/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-cyan-400" />
            <h3 className="text-white font-black text-base">Quick Wins</h3>
          </div>
          <span className="text-xs font-bold text-gray-400">{completedCount}/3 Complete</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Quick wins list */}
      <div className="divide-y divide-gray-800">
        {QUICK_WINS.map((win) => {
          const Icon = win.icon;
          const isComplete = progress[win.id];

          return (
            <div key={win.id} className="px-6 py-5 hover:bg-gray-800/40 transition-colors">
              <div className="flex items-start gap-4">
                {/* Icon + Checkbox */}
                <div className="flex-shrink-0 pt-1">
                  {isComplete ? (
                    <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                      <CheckCircle2 size={16} className="text-green-400" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-600 flex items-center justify-center">
                      <Icon size={14} className="text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h4 className={`font-bold text-sm ${isComplete ? "text-gray-400 line-through" : "text-white"}`}>
                      {win.title}
                    </h4>
                    {isComplete && <span className="text-green-400 text-xs font-bold">✓ Done</span>}
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3">{win.description}</p>

                  {!isComplete && (
                    <Link
                      to={win.path}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{ backgroundColor: win.color + "20", color: win.color, border: `1px solid ${win.color}40` }}
                    >
                      {win.cta}
                      <ChevronRight size={12} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer tip */}
      {completedCount < 3 && (
        <div className="px-6 py-4 bg-cyan-950/30 border-t border-cyan-900/30">
          <p className="text-cyan-300 text-xs leading-relaxed">
            💡 <strong>Tip:</strong> Complete all 3 quick wins to unlock personalized recommendations and exclusive offers!
          </p>
        </div>
      )}

      {completedCount === 3 && (
        <div className="px-6 py-4 bg-green-950/30 border-t border-green-900/30">
          <p className="text-green-300 text-xs leading-relaxed">
            🎉 <strong>Congratulations!</strong> You've completed onboarding. Explore advanced tools like the Investor CRM, VDR Portal, and IP Valuation.
          </p>
        </div>
      )}
    </div>
  );
}