import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Play, Clock, BookOpen, ChevronDown, ChevronUp, CheckCircle2, Lock } from "lucide-react";
import { coursePlans, findCoursePlan } from "../lib/coursePlans";

function LessonRow({ lesson, index, unlocked }) {
  return (
    <div className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors ${unlocked ? "hover:bg-gray-800/60" : "opacity-50"}`}>
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
        ${unlocked ? "bg-blue-900/50 text-blue-300" : "bg-gray-800 text-gray-600"}`}>
        {unlocked ? <Play size={10} /> : <Lock size={10} />}
      </div>
      <span className={`flex-1 text-sm ${unlocked ? "text-gray-300" : "text-gray-600"}`}>
        {lesson.title}
      </span>
      <span className="text-xs text-gray-500 flex items-center gap-1 flex-shrink-0">
        <Clock size={10} /> {lesson.duration}
      </span>
    </div>
  );
}

function ModuleAccordion({ module, moduleIndex, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const totalTime = module.lessons.reduce((acc, l) => {
    const min = parseInt(l.duration);
    return acc + (isNaN(min) ? 0 : min);
  }, 0);

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-900 hover:bg-gray-800/80 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-gray-800 text-gray-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
            {moduleIndex + 1}
          </span>
          <div>
            <p className="text-white font-semibold text-sm leading-snug">{module.title}</p>
            <p className="text-gray-500 text-xs mt-0.5">{module.lessons.length} lessons · {totalTime} min</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
      </button>

      {open && (
        <div className="bg-gray-950 px-3 py-2 divide-y divide-gray-800/60">
          {module.lessons.map((lesson, li) => (
            <LessonRow key={li} lesson={lesson} index={li} unlocked={moduleIndex === 0 && li === 0} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CoursePlan() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const slug = params.get("course");
  const plan = slug ? findCoursePlan(slug) : null;

  // If no specific course, show index of all courses
  if (!plan) {
    return (
      <div className="w-screen min-h-screen bg-gray-950 text-white">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-4">
          <Link to="/courses" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={15} /> Back to Courses
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <h1 className="text-white font-bold text-lg">Course Curriculum Index</h1>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10">
          <p className="text-gray-400 text-sm mb-8">
            Select a course to view its full lesson-by-lesson curriculum plan.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(coursePlans).map(([slug, plan]) => (
              <Link
                key={slug}
                to={`/course-plan?course=${slug}`}
                className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-5 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0">{plan.icon}</span>
                  <div>
                    <h3 className="text-white font-bold text-sm leading-snug group-hover:text-blue-300 transition-colors">{plan.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Play size={10} /> {plan.totalLessons} lessons</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {plan.totalHours}</span>
                      <span className="flex items-center gap-1"><BookOpen size={10} /> {plan.modules.length} modules</span>
                    </div>
                    <p className="text-green-400 font-bold text-sm mt-2">{plan.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalLessons = plan.modules.reduce((a, m) => a + m.lessons.length, 0);

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-4">
        <Link to="/courses" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
          <ArrowLeft size={15} /> Courses
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <Link to="/course-plan" className="text-gray-400 hover:text-white text-sm">All Curricula</Link>
        <div className="w-px h-5 bg-gray-700" />
        <span className="text-gray-300 text-sm truncate">{plan.title}</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-5xl flex-shrink-0">{plan.icon}</span>
            <div>
              <h1 className="text-white font-bold text-2xl leading-snug mb-2">{plan.title}</h1>
              <p className="text-gray-500 text-sm">{plan.source}</p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-300">
              <BookOpen size={12} className="text-blue-400" /> {plan.modules.length} Modules
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-300">
              <Play size={12} className="text-green-400" /> {totalLessons} Lessons
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-300">
              <Clock size={12} className="text-yellow-400" /> {plan.totalHours}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-900/50 border border-green-700 text-xs text-green-300 font-bold ml-auto">
              {plan.price}
            </div>
          </div>

          {/* Includes note */}
          <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl p-4 mb-6 flex items-start gap-3">
            <CheckCircle2 size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-200 font-semibold text-sm">What's Included</p>
              <p className="text-blue-300/70 text-xs mt-1 leading-relaxed">
                Lifetime access to all video lessons · Downloadable source documents & diagrams · Module quizzes · Direct source citations from original Bearden papers · Private research community access
              </p>
            </div>
          </div>
        </div>

        {/* Curriculum */}
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <BookOpen size={16} className="text-blue-400" /> Full Curriculum
        </h2>

        <div>
          {plan.modules.map((module, mi) => (
            <ModuleAccordion key={mi} module={module} moduleIndex={mi} defaultOpen={mi === 0} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-gray-900 border border-gray-700 rounded-2xl p-6 text-center">
          <p className="text-gray-400 text-sm mb-4">Ready to enroll? Instant access upon purchase.</p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ backgroundColor: plan.color }}
          >
            <Play size={14} /> Enroll Now — {plan.price}
          </Link>
          <p className="text-gray-600 text-xs mt-3">NDA applies · Payments secured by Stripe · Lifetime access</p>
        </div>
      </div>
    </div>
  );
}