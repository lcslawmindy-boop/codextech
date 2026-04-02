import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Zap, FlaskConical, DollarSign, Package, GraduationCap, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { businessItems as items } from "../lib/businessItems";

const CATEGORIES = ["All", "Course", "Book/PDF", "Product", "Invention", "Service"];

// items now imported from lib/businessItems

function ItemCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors flex flex-col gap-3"
      style={{ borderLeftColor: item.color, borderLeftWidth: 3 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span
                className="text-xs px-2 py-0.5 rounded font-semibold uppercase tracking-wider"
                style={{ backgroundColor: item.color + "20", color: item.color }}
              >
                {item.category}
              </span>
              <span className="text-green-400 font-bold text-sm">{item.price}</span>
            </div>
            <h3 className="text-white font-bold text-base leading-snug">{item.title}</h3>
            <p className="text-gray-400 text-xs mt-0.5 italic">"{item.tagline}"</p>
          </div>
        </div>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>

      {item.modules.length > 0 && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors self-start"
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? "Hide" : "Show"} {item.modules.length} modules
        </button>
      )}

      {expanded && item.modules.length > 0 && (
        <ol className="list-decimal list-inside space-y-1 pl-1">
          {item.modules.map((m, i) => (
            <li key={i} className="text-gray-400 text-xs leading-snug">{m}</li>
          ))}
        </ol>
      )}

      <div className="mt-auto pt-2 border-t border-gray-800">
        <p className="text-gray-600 text-xs">
          <span className="text-gray-500 font-semibold">Source: </span>{item.source}
        </p>
        <p className="text-gray-600 text-xs mt-1">
          <span className="text-gray-500 font-semibold">Target audience: </span>{item.audience}
        </p>
      </div>
    </div>
  );
}

export default function BusinessModels() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? items : items.filter(i => i.category === activeCategory);

  const totalRevenuePotential = {
    Course: items.filter(i => i.category === "Course").length,
    "Book/PDF": items.filter(i => i.category === "Book/PDF").length,
    Product: items.filter(i => i.category === "Product").length,
    Invention: items.filter(i => i.category === "Invention").length,
    Service: items.filter(i => i.category === "Service").length,
  };

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Graph
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">Business Models & Monetization</h1>
            <p className="text-gray-500 text-xs">Courses, books, products & inventions derived from Bearden's research</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <Link
            to="/marketing"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/40 hover:bg-green-800/50 border border-green-700 text-green-300 text-xs font-medium transition-colors"
          >
            📅 Marketing Plan
          </Link>
          <Link
            to="/courses"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800/50 border border-blue-700 text-blue-300 text-xs font-medium transition-colors"
          >
            🎓 Courses & PDFs
          </Link>
          <Link
            to="/pitch"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/50 border border-purple-700 text-purple-300 text-xs font-medium transition-colors"
          >
            🎯 Pitch Builder
          </Link>
          <Link
            to="/market-deck"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800/50 border border-blue-700 text-blue-300 text-xs font-medium transition-colors"
          >
            📊 Market Deck
          </Link>
          <div className="flex items-center gap-1.5"><GraduationCap size={13} className="text-blue-400" /><span>{totalRevenuePotential.Course} courses</span></div>
          <div className="flex items-center gap-1.5"><BookOpen size={13} className="text-yellow-400" /><span>{totalRevenuePotential["Book/PDF"]} books</span></div>
          <div className="flex items-center gap-1.5"><Package size={13} className="text-cyan-400" /><span>{totalRevenuePotential.Product} products</span></div>
          <div className="flex items-center gap-1.5"><FlaskConical size={13} className="text-red-400" /><span>{totalRevenuePotential.Invention} inventions</span></div>
          <div className="flex items-center gap-1.5"><DollarSign size={13} className="text-green-400" /><span>{totalRevenuePotential.Service} services</span></div>
        </div>
      </div>

      {/* Intro banner */}
      <div className="px-6 py-4 bg-gray-900/60 border-b border-gray-800">
        <div className="max-w-4xl">
          <div className="flex items-start gap-3">
            <Lightbulb size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-gray-300 text-sm leading-relaxed">
              The following business models are derived directly from Bearden's primary source documents analyzed in this archive — including the 1982 <em>Comments on the New Tesla Electromagnetics</em>, Schaffranke's global free-energy technology survey, and the kindling/negentropy biology papers. Each item identifies its source, target audience, suggested price, and actionable description. Use this as a business plan scaffold — every item can be built on Bearden's existing documented research.
            </p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-6 py-3 border-b border-gray-800 flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              activeCategory === cat
                ? "bg-gray-700 border-gray-500 text-white"
                : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500"
            }`}
          >
            {cat} {cat !== "All" && `(${totalRevenuePotential[cat] || 0})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {filtered.map((item, i) => (
            <ItemCard key={i} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}