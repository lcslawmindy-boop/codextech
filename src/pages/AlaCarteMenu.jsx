import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, ShoppingCart, BookOpen, Wrench, Play, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { businessItems } from "../lib/businessItems";
import { itemImages } from "../lib/itemImages";
import { jsPDF } from "jspdf";

const courses = businessItems.filter(i => i.category === "Course");
const buildPlans = businessItems.filter(i => i.category === "Invention");

function parsePriceCents(priceStr) {
  const match = priceStr.match(/\$(\d+)/);
  return match ? parseInt(match[1]) * 100 : null;
}

function isInIframe() {
  try { return window.self !== window.top; } catch { return true; }
}

function CourseCard({ course }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setError(null);
    if (isInIframe()) {
      setError("Checkout only works from the published app, not the preview.");
      return;
    }

    const priceInCents = parsePriceCents(course.price);
    if (!priceInCents) {
      setError("Could not determine product price.");
      return;
    }

    setLoading(true);
    const origin = window.location.origin;
    const res = await base44.functions.invoke("createCheckoutSession", {
      title: course.title,
      priceInCents,
      description: course.tagline,
      category: "Course",
      successUrl: `${origin}/courses?success=1&product=${encodeURIComponent(course.title)}`,
      cancelUrl: `${origin}/alacarte`,
    });

    setLoading(false);
    if (res.data?.url) {
      window.location.href = res.data.url;
    } else {
      setError(res.data?.error || "Checkout failed. Please try again.");
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-700/50 transition-all flex flex-col h-full">
      <div className="h-32 bg-gradient-to-br from-blue-900/30 to-blue-950/50 flex items-center justify-center text-4xl">
        {course.icon}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-bold text-base mb-1 line-clamp-2">{course.title}</h3>
        <p className="text-blue-400 text-xs italic mb-3 line-clamp-2">"{course.tagline}"</p>
        <p className="text-gray-400 text-sm flex-1 mb-4 line-clamp-3">{course.description}</p>
        
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-gray-600 text-xs">Price</p>
            <p className="text-green-400 font-black text-lg">{course.price}</p>
          </div>
          <span className="text-gray-500 text-xs px-2 py-1 rounded-full bg-gray-800">{course.audience}</span>
        </div>

        <button onClick={handleCheckout} disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 mb-2">
          {loading ? "Redirecting…" : <><ShoppingCart size={14} /> Buy Course</> }
        </button>
        {error && <p className="text-xs text-red-400 text-center">{error}</p>}
      </div>
    </div>
  );
}

function BuildPlanCard({ plan }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setError(null);
    if (isInIframe()) {
      setError("Checkout only works from the published app.");
      return;
    }

    const priceInCents = parsePriceCents(plan.price);
    if (!priceInCents) {
      setError("Could not determine product price.");
      return;
    }

    setLoading(true);
    const origin = window.location.origin;
    const res = await base44.functions.invoke("createCheckoutSession", {
      title: plan.title,
      priceInCents,
      description: plan.tagline,
      category: "Invention",
      successUrl: `${origin}/invention-plans?success=1&product=${encodeURIComponent(plan.title)}`,
      cancelUrl: `${origin}/alacarte`,
    });

    setLoading(false);
    if (res.data?.url) {
      window.location.href = res.data.url;
    } else {
      setError(res.data?.error || "Checkout failed. Please try again.");
    }
  };

  const handleDownloadPDF = () => {
    // Generate simple PDF preview
    const doc = new jsPDF();
    const margin = 15;
    
    doc.setFontSize(20);
    doc.text(plan.title, margin, 20);
    
    doc.setFontSize(10);
    doc.text(`"${plan.tagline}"`, margin, 35);
    
    doc.setFontSize(9);
    doc.text("Description:", margin, 50);
    doc.setFontSize(8);
    const lines = doc.splitTextToSize(plan.description, 180);
    doc.text(lines, margin, 58);
    
    doc.text("Price: " + plan.price, margin, 200);
    doc.text("For research and educational purposes only.", margin, 280);
    
    doc.save(`${plan.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-orange-700/50 transition-all flex flex-col h-full">
      {itemImages[plan.title] && (
        <div className="h-32 overflow-hidden relative">
          <img src={itemImages[plan.title]} alt={plan.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-bold text-base mb-1 line-clamp-2">{plan.title}</h3>
        <p className="text-orange-400 text-xs italic mb-3 line-clamp-2">"{plan.tagline}"</p>
        <p className="text-gray-400 text-sm flex-1 mb-4 line-clamp-3">{plan.description}</p>
        
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-gray-600 text-xs">Price</p>
            <p className="text-green-400 font-black text-lg">{plan.price}</p>
          </div>
          <span className="text-gray-500 text-xs px-2 py-1 rounded-full bg-gray-800">{plan.category}</span>
        </div>

        <div className="space-y-2">
          <button onClick={handleCheckout} disabled={loading}
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? "Redirecting…" : <><ShoppingCart size={14} /> Buy Plan</> }
          </button>
          <button onClick={handleDownloadPDF}
            className="w-full py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2">
            <Download size={13} /> Preview PDF
          </button>
        </div>
        {error && <p className="text-xs text-red-400 text-center mt-2">{error}</p>}
      </div>
    </div>
  );
}

export default function AlaCarteMenu() {
  const [activeTab, setActiveTab] = useState("courses");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={14} /> Back
            </Link>
            <div className="w-px h-5 bg-gray-700" />
            <div>
              <h1 className="text-white font-bold text-lg">À La Carte Menu</h1>
              <p className="text-gray-500 text-xs">Buy individual courses and build plans with PDF downloads</p>
            </div>
          </div>
          <Link to="/pricing" className="px-4 py-2 rounded-lg bg-purple-900/40 border border-purple-700 text-purple-300 hover:bg-purple-800/60 text-xs font-bold transition-all">
            View Membership Plans →
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-950 border-b border-gray-800 px-6 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-3">Build Your Own Learning Path</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            No membership required. Buy exactly what you need. Every purchase includes a PDF download for offline access.
          </p>
        </div>
      </div>

      {/* Builder Tier Benefits Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-b border-cyan-800/50 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-600 text-white text-xs font-black">
                ⚡ BUILDER TIER ($99/month)
              </span>
            </div>
            <Link to="/research-membership" className="ml-auto px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors">
              Join Now →
            </Link>
          </div>
          <h3 className="text-white font-black text-lg mb-3">Unlock Builder Benefits on Every Purchase</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-3">
              <span className="text-cyan-400 font-black text-lg flex-shrink-0">💰</span>
              <div>
                <p className="text-white font-bold text-sm">All Courses & Build Plans: $49 each</p>
                <p className="text-gray-400 text-xs">As a Builder member, access any course or plan from this menu for just $49 (vs. varying prices)</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-cyan-400 font-black text-lg flex-shrink-0">🛡️</span>
              <div>
                <p className="text-white font-bold text-sm">20% Off EMF Protection Shop</p>
                <p className="text-gray-400 text-xs">Builder members get exclusive discount on all EMF shielding and protection kits</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-cyan-400 font-black text-lg flex-shrink-0">📋</span>
              <div>
                <p className="text-white font-bold text-sm">10-Part Invention Dossier IP Package</p>
                <p className="text-gray-400 text-xs">Complete framework for patent drafting, commercialization roadmap & market launch strategy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-800 bg-gray-900/40 sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6">
            <button onClick={() => setActiveTab("courses")}
              className={`py-4 px-1 font-bold text-sm border-b-2 transition-all ${
                activeTab === "courses"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}>
              <BookOpen size={14} className="inline mr-2" /> Courses ({courses.length})
            </button>
            <button onClick={() => setActiveTab("builds")}
              className={`py-4 px-1 font-bold text-sm border-b-2 transition-all ${
                activeTab === "builds"
                  ? "border-orange-500 text-orange-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}>
              <Wrench size={14} className="inline mr-2" /> Build Plans ({buildPlans.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === "courses" && (
          <div>
            <h3 className="text-2xl font-black mb-8">Engineering Courses</h3>
            {courses.length === 0 ? (
              <p className="text-gray-500">No courses available yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course, i) => (
                  <CourseCard key={i} course={course} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "builds" && (
          <div>
            <h3 className="text-2xl font-black mb-8">Build Plans with PDF Downloads</h3>
            {buildPlans.length === 0 ? (
              <p className="text-gray-500">No build plans available yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {buildPlans.map((plan, i) => (
                  <BuildPlanCard key={i} plan={plan} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-gray-800 bg-gray-900/40 px-6 py-12 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-black mb-4">Want Everything?</h3>
          <p className="text-gray-400 mb-6 text-sm">
            Get unlimited access to all {courses.length + buildPlans.length} courses and build plans with a membership.
          </p>
          <Link to="/pricing" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black transition-all">
            View Membership Plans →
          </Link>
        </div>
      </div>
    </div>
  );
}