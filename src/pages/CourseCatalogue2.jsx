import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Search, Filter, Loader2, GraduationCap, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { businessItems } from "../lib/businessItems";
import { base44 } from "@/api/base44Client";

const courses = businessItems.filter(i => i.category === "Course");
const books = businessItems.filter(i => i.category === "Book/PDF");

const TABS = ["All", "Courses", "Books & PDFs"];

function getPriceNum(priceStr) {
  return Math.round(parseFloat((priceStr || "$0").replace(/[$,]/g, "")));
}

function BuyButton({ item }) {
  const [loading, setLoading] = useState(false);
  const priceInCents = Math.round(getPriceNum(item.price) * 100);

  const handleBuy = async () => {
    if (window.self !== window.top) {
      alert("Checkout only works from the published app, not inside the editor.");
      return;
    }
    setLoading(true);
    try {
      const origin = window.location.origin;
      const res = await base44.functions.invoke("createCheckoutSession", {
        title: item.title,
        priceInCents,
        description: item.tagline,
        category: item.category,
        successUrl: `${origin}/course-catalogue`,
        cancelUrl: `${origin}/course-catalogue`,
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
        }
        .pulse-btn {
          animation: pulse-glow 2s infinite;
        }
      `}</style>
      <button
        onClick={handleBuy}
        disabled={loading}
        className="pulse-btn flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-black text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 transition-all shadow-lg"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
        {loading ? "Processing..." : `Enroll — ${item.price}`}
      </button>
    </>
  );
}

function ItemCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const isCourse = item.category === "Course";

  return (
    <div className={`bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 hover:border-gray-700 rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-xl`}
      style={{ borderLeftColor: item.color, borderLeftWidth: 4 }}>
      
      {/* Header with Icon & Category */}
      <div className="p-6 pb-4 border-b border-gray-800/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="text-4xl flex-shrink-0">{item.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider`}
                  style={{ backgroundColor: item.color + "22", color: item.color }}>
                  {item.category}
                </span>
              </div>
              <h3 className="text-white font-black text-base leading-snug">{item.title}</h3>
              <p className="text-gray-400 text-xs italic mt-1">"{item.tagline}"</p>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-gray-500 text-xs mb-1">Pricing</p>
            <p className="text-2xl font-black" style={{ color: item.color }}>{item.price}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 flex flex-col gap-4 flex-1">
        <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>

        {/* Modules Section */}
        {item.modules?.length > 0 && (
          <div className="bg-gray-800/30 rounded-lg p-3.5 border border-gray-700/50">
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center justify-between w-full text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
            >
              <span className="flex items-center gap-2">
                {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                Curriculum ({item.modules.length} modules)
              </span>
            </button>
            {expanded && (
              <ol className="list-decimal list-inside space-y-2 pl-1 mt-3 text-gray-400 text-xs">
                {item.modules.map((m, i) => (
                  <li key={i} className="leading-snug">{m}</li>
                ))}
              </ol>
            )}
          </div>
        )}

        {/* Source Footer */}
        <div className="text-gray-600 text-xs border-t border-gray-800/50 pt-3 mt-auto">
          <span className="text-gray-500 font-semibold">Research Source: </span>
          <span className="text-gray-400">{item.source}</span>
        </div>

        {/* CTA Button */}
        <BuyButton item={item} />
      </div>
    </div>
  );
}

export default function CourseCatalogue2() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");

  const allItems = tab === "Courses" ? courses : tab === "Books & PDFs" ? books : [...courses, ...books];

  const filtered = allItems.filter(item =>
    !search ||
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.tagline?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/business" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg">Digital Courses & Research Library</h1>
            <p className="text-gray-500 text-xs">Scalar EM, bioelectromagnetics, vacuum energy — {courses.length} courses, {books.length} books & PDFs</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><GraduationCap size={13} className="text-blue-400" /> {courses.length} courses</span>
          <span className="flex items-center gap-1"><BookOpen size={13} className="text-yellow-400" /> {books.length} books</span>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="px-6 py-3 border-b border-gray-800 flex flex-wrap gap-3 items-center">
        <div className="flex gap-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                tab === t ? "bg-gray-700 border-gray-500 text-white" : "border-gray-700 text-gray-400 hover:border-gray-500"
              }`}>
              {t}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-48 max-w-xs ml-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gray-500"
          />
        </div>
        <span className="text-gray-600 text-xs">{filtered.length} results</span>
      </div>

      {/* Grid */}
      <div className="flex-1 px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {filtered.map((item, i) => <ItemCard key={i} item={item} />)}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-24 text-gray-600">No items match your search.</div>
        )}
      </div>
    </div>
  );
}