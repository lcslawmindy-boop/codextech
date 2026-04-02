import { useState } from "react";
import { X, CheckCircle2, Circle, FileText, Play, Lock, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function LessonViewer({ course, progress, onProgressUpdate, onClose }) {
  const [activeLesson, setActiveLesson] = useState(progress?.last_lesson || course.modules[0]);
  const [saving, setSaving] = useState(false);

  const completedSet = new Set(progress?.completed_lessons || []);
  const completionPct = course.modules.length > 0
    ? Math.round((completedSet.size / course.modules.length) * 100)
    : 0;

  const markComplete = async (lessonTitle) => {
    if (completedSet.has(lessonTitle)) return;
    setSaving(true);
    const newCompleted = [...completedSet, lessonTitle];
    const allDone = newCompleted.length === course.modules.length;

    if (progress?.id) {
      await base44.entities.CourseProgress.update(progress.id, {
        completed_lessons: newCompleted,
        last_lesson: lessonTitle,
        completed: allDone,
      });
    } else {
      const user = await base44.auth.me();
      await base44.entities.CourseProgress.create({
        user_email: user.email,
        course_title: course.title,
        completed_lessons: newCompleted,
        last_lesson: lessonTitle,
        completed: allDone,
      });
    }
    setSaving(false);
    onProgressUpdate();
  };

  return (
    <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <span className="text-2xl">{course.icon}</span>
          <div className="min-w-0">
            <h2 className="text-white font-bold text-base truncate">{course.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1.5 w-32 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-purple-500 transition-all" style={{ width: `${completionPct}%` }} />
              </div>
              <span className="text-gray-500 text-xs">{completionPct}% complete · {completedSet.size}/{course.modules.length} lessons</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 border-r border-gray-800 overflow-y-auto">
          <div className="p-4 space-y-1">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Curriculum</p>
            {course.modules.map((lesson, i) => {
              const done = completedSet.has(lesson);
              const active = activeLesson === lesson;
              return (
                <button
                  key={i}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full text-left flex items-start gap-3 px-3 py-3 rounded-xl transition-colors ${
                    active ? "bg-purple-900/40 border border-purple-700" : "hover:bg-gray-800 border border-transparent"
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {done
                      ? <CheckCircle2 size={15} className="text-green-400" />
                      : <Circle size={15} className="text-gray-600" />}
                  </div>
                  <span className={`text-sm leading-snug ${active ? "text-white" : done ? "text-gray-400" : "text-gray-300"}`}>
                    {i + 1}. {lesson}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeLesson ? (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <p className="text-purple-400 text-xs uppercase tracking-widest font-semibold mb-2">Now Viewing</p>
                <h3 className="text-white font-bold text-2xl mb-1">{activeLesson}</h3>
                <p className="text-gray-500 text-sm">From: {course.title}</p>
              </div>

              {/* Content placeholder — replace src with real video/doc URLs */}
              <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden mb-6">
                {course.category === "Course" ? (
                  <div className="aspect-video flex flex-col items-center justify-center gap-4 bg-gray-900">
                    <div className="w-16 h-16 rounded-full bg-purple-900/60 border border-purple-700 flex items-center justify-center">
                      <Play size={24} className="text-purple-400 ml-1" />
                    </div>
                    <p className="text-gray-400 text-sm text-center px-8">
                      Video content for <strong className="text-white">"{activeLesson}"</strong> will stream here once your video files are uploaded.
                    </p>
                    <p className="text-gray-600 text-xs">Supported: MP4, WebM · Host on S3, Cloudflare Stream, or Vimeo</p>
                  </div>
                ) : (
                  <div className="p-10 flex flex-col items-center gap-4">
                    <FileText size={40} className="text-yellow-400" />
                    <p className="text-gray-400 text-sm text-center">
                      Document content for <strong className="text-white">"{activeLesson}"</strong> will display here.
                    </p>
                    <p className="text-gray-600 text-xs">Upload PDF/HTML docs and link them per lesson module.</p>
                  </div>
                )}
              </div>

              {/* Source note */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
                <p className="text-gray-500 text-xs leading-relaxed">
                  <span className="text-gray-400 font-semibold">Source material: </span>
                  {course.source}
                </p>
              </div>

              {/* Mark complete */}
              {!completedSet.has(activeLesson) ? (
                <button
                  onClick={() => markComplete(activeLesson)}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-800 hover:bg-green-700 text-white font-semibold text-sm transition-colors disabled:opacity-60"
                >
                  <CheckCircle2 size={16} />
                  {saving ? "Saving…" : "Mark Lesson Complete"}
                </button>
              ) : (
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                  <CheckCircle2 size={16} />
                  Lesson completed
                </div>
              )}

              {/* Next lesson */}
              {(() => {
                const idx = course.modules.indexOf(activeLesson);
                const next = course.modules[idx + 1];
                if (!next) return null;
                return (
                  <button
                    onClick={() => setActiveLesson(next)}
                    className="mt-4 flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm transition-colors"
                  >
                    Next: {next} <ChevronRight size={14} />
                  </button>
                );
              })()}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600">Select a lesson to begin</div>
          )}
        </div>
      </div>
    </div>
  );
}