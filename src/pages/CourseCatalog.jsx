import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Play, Download, ChevronDown, ChevronUp, Star, Users, Clock } from "lucide-react";
import { businessItems } from "../lib/businessItems";

const courses = businessItems.filter(i => i.category === "Course");
const pdfs = businessItems.filter(i => i.category === "Book/PDF");

function CourseCard({ item }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all group">
      {/* Header band */}
      <div className="h-1.5 w-full" style={{ backgroundColor: item.color }} />

      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-3xl">{item.icon}</span>
          <span className="text-green-400 font-bold text-lg whitespace-nowrap">{item.price}</span>
        </div>

        <h3 className="text-white font-bold text-xl leading-snug mb-1">{item.title}</h3>
        <p className="text-sm italic mb-3" style={{ color: item.color }}>"{item.tagline}"</p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1"><Users size={11} /> {item.audience.split(",")[0]}</span>
          {item.modules.length > 0 && (
            <span className="flex items-center gap-1"><Play size={11} /> {item.modules.length} modules</span>
          )}
          <span className="flex items-center gap-1"><Star size={11} className="text-yellow-500" /> Instant access</span>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-4">{item.description}</p>

        {item.modules.length > 0 && (
          <>
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors mb-3"
            >
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {expanded ? "Hide" : "View"} curriculum ({item.modules.length} modules)
            </button>

            {expanded && (
              <ol className="list-decimal list-inside space-y-1.5 mb-4 pl-1 border-l-2 border-gray-700 ml-2 pl-4">
                {item.modules.map((m, i) => (
                  <li key={i} className="text-gray-400 text-xs leading-snug">{m}</li>
                ))}
              </ol>
            )}
          </>
        )}

        <div className="pt-4 border-t border-gray-800">
          <p className="text-gray-600 text-xs mb-4">
            <span className="text-gray-500 font-semibold">Source: </span>{item.source}
          </p>
          <button className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: item.color }}>
            Enroll Now — {item.price}
          </button>
        </div>
      </div>
    </div>
  );
}

function PdfCard({ item }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-all flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ backgroundColor: item.color + "20" }}>
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-white font-bold text-base leading-snug">{item.title}</h3>
          <span className="text-green-400 font-bold text-sm whitespace-nowrap">{item.price}</span>
        </div>
        <p className="text-xs italic mb-2" style={{ color: item.color }}>"{item.tagline}"</p>
        <p className="text-gray-400 text-sm leading-relaxed mb-3">{item.description}</p>
        <p className="text-gray-600 text-xs mb-3">
          <span className="text-gray-500 font-semibold">Source: </span>{item.source}
        </p>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: item.color }}>
          <Download size={14} />
          Get PDF — {item.price}
        </button>
      </div>
    </div>
  );
}

export default function CourseCatalog() {
  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/business" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">Courses & Digital Products</h1>
            <p className="text-gray-500 text-xs">Structured learning & research documents from the Bearden archive</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-900/30 border border-blue-800 text-blue-300">
            <Play size={11} /> {courses.length} Courses
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-900/30 border border-yellow-800 text-yellow-300">
            <BookOpen size={11} /> {pdfs.length} PDF Books
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-7xl mx-auto w-full">

        {/* Hero */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-3">Master Bearden's Scalar EM Framework</h2>
          <p className="text-gray-400 leading-relaxed">
            Every course and document is built directly from primary source material — original Bearden papers (1982–2002),
            Soviet research declassified citations, and the full annotated archive. No speculation. All source-documented.
          </p>
        </div>

        {/* Courses */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <Play size={16} className="text-blue-400" />
            <h2 className="text-white font-bold text-xl">Video Courses</h2>
            <span className="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-gray-800">{courses.length} available</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((item, i) => (
              <CourseCard key={i} item={item} />
            ))}
          </div>
        </section>

        {/* PDFs */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen size={16} className="text-yellow-400" />
            <h2 className="text-white font-bold text-xl">Books & PDF Documents</h2>
            <span className="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-gray-800">{pdfs.length} available</span>
          </div>
          <div className="flex flex-col gap-4">
            {pdfs.map((item, i) => (
              <PdfCard key={i} item={item} />
            ))}
          </div>
        </section>

        {/* Footer note */}
        <div className="mt-12 text-center text-gray-600 text-xs">
          All products are digital. Instant access upon purchase. NDA applies.
        </div>
      </div>
    </div>
  );
}