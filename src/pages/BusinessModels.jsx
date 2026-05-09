import { useState } from "react";
import { itemImages } from "../lib/itemImages";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Zap, FlaskConical, DollarSign, Package, GraduationCap, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { businessItems as items } from "../lib/businessItems";
import { inventionVisuals } from "../lib/inventionVisuals";
import NewsletterSignup from "../components/NewsletterSignup";

const CATEGORIES = ["All", "Course", "Book/PDF", "Product", "Invention", "Service"];

// items now imported from lib/businessItems

function InventionVisualPanel({ title }) {
  const v = inventionVisuals[title];
  if (!v) return null;
  return (
    <div className="mt-3 space-y-3">
      {/* How It Works */}
      <div className="bg-gray-800/60 rounded-xl p-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">How It Works</p>
        <p className="text-gray-300 text-xs leading-relaxed">{v.howItWorks}</p>
      </div>
      {/* Components */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Components</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {v.components.map((c, i) => (
            <div key={i} className="flex items-start gap-2 bg-gray-800/50 rounded-lg p-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: c.color }} />
              <div>
                <p className="text-white text-xs font-semibold">{c.label}</p>
                <p className="text-gray-400 text-xs leading-snug">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Key Principle */}
      <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-3">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Key Principle</p>
        <p className="text-blue-200 text-xs leading-relaxed">{v.keyPrinciple}</p>
      </div>
      {/* Size */}
      {v.realWorldSize && (
        <div className="text-gray-500 text-xs italic">
          📐 {v.realWorldSize}
        </div>
      )}
    </div>
  );
}

function ItemCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const [showVisuals, setShowVisuals] = useState(false);
  const hasVisuals = item.category === "Invention" && !!inventionVisuals[item.title];
  const image = itemImages[item.title];
  return (
    <div
      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-colors flex flex-col gap-3"
      style={{ borderLeftColor: item.color, borderLeftWidth: 3 }}
    >
      {image && (
        <div className="w-full h-40 overflow-hidden relative">
          <img src={image} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>
      )}
      <div className="px-5 pb-5 flex flex-col gap-3">
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

      <div className="flex flex-wrap gap-2">
        {item.modules.length > 0 && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {expanded ? "Hide" : "Show"} {item.modules.length} modules
          </button>
        )}
        {hasVisuals && (
          <button
            onClick={() => setShowVisuals(v => !v)}
            className={`flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-lg border transition-colors ${
              showVisuals
                ? "bg-blue-900/40 border-blue-700 text-blue-300"
                : "border-gray-700 text-gray-400 hover:border-blue-700 hover:text-blue-300"
            }`}
          >
            🔬 {showVisuals ? "Hide" : "Show"} Visuals
          </button>
        )}
      </div>

      {expanded && item.modules.length > 0 && (
        <ol className="list-decimal list-inside space-y-1 pl-1">
          {item.modules.map((m, i) => (
            <li key={i} className="text-gray-400 text-xs leading-snug">{m}</li>
          ))}
        </ol>
      )}

      {showVisuals && <InventionVisualPanel title={item.title} />}

      <div className="mt-auto pt-2 border-t border-gray-800">
        <p className="text-gray-600 text-xs">
          <span className="text-gray-500 font-semibold">Source: </span>{item.source}
        </p>
        <p className="text-gray-600 text-xs mt-1">
          <span className="text-gray-500 font-semibold">Target audience: </span>{item.audience}
        </p>
      </div>
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
            to="/invention-plans"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-800/50 border border-red-700 text-red-300 text-xs font-medium transition-colors"
          >
            🔧 Build Plans
          </Link>
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
            to="/device-catalogue"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-800/50 border border-red-700 text-red-300 text-xs font-medium transition-colors"
          >
            ⚙️ Device Catalogue
          </Link>
          <Link
            to="/course-catalogue"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-800/50 border border-blue-700 text-blue-300 text-xs font-medium transition-colors"
          >
            🎓 Course Catalogue
          </Link>
          <Link
            to="/invention-forge"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-900/40 hover:bg-yellow-800/50 border border-yellow-700 text-yellow-300 text-xs font-medium transition-colors"
          >
            ⚡ Invention Forge
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

      {/* Bearden Attribution */}
      <div className="px-6 py-2 bg-yellow-950/20 border-b border-yellow-900/30 flex items-center gap-3">
        <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest flex-shrink-0">Attribution</span>
        <p className="text-gray-400 text-xs">
          All business models, inventions, and course content are derived from the published works of{" "}
          <span className="text-yellow-300 font-semibold">Lt. Col. Thomas E. Bearden (US Army, Ret.)</span>.
          Sources include <em>Gravitobiology</em> (1991), <em>Excalibur Briefing</em> (1980/1988),
          <em> Toward a New Electromagnetics</em> Parts 1–4 (1983), <em>Explore!</em> Vol. 6 &amp; 9 (1995/1999),
          and <em>Foundations of Physics Letters</em> (2001). Educational use only — no medical claims implied.
        </p>
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
      <div className="px-6 py-10 border-t border-gray-800">
        <NewsletterSignup source="business-models" />
      </div>
    </div>
  );
}