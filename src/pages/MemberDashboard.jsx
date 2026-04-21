import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Grid, List, BookOpen, Zap, Lock, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTier } from "@/hooks/useTier";
import { businessItems } from "@/lib/businessItems";
import Invention3DCard from "@/components/Invention3DCard";

export default function MemberDashboard() {
  const { tier } = useTier();
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me()
      .then(u => setUser(u))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!tier) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Lock size={32} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-black mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">You need a membership to view this page.</p>
          <Link to="/pricing" className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all">
            View Plans
          </Link>
        </div>
      </div>
    );
  }

  // Filter items based on tier
  const canAccessBuilder = ["builder", "pro"].includes(tier);
  const canAccessResearcher = ["researcher", "pro"].includes(tier);

  const inventions = businessItems.filter(item => item.category === "Invention");
  const courses = businessItems.filter(item => item.category === "Course");

  const accessibleInventions = canAccessBuilder ? inventions : [];
  const accessibleCourses = canAccessBuilder || canAccessResearcher ? courses : [];

  const tierColors = {
    builder: { bg: "#10b981", text: "green" },
    researcher: { bg: "#3b82f6", text: "blue" },
    pro: { bg: "#a855f7", text: "purple" }
  };

  const tierColor = tier ? tierColors[tier] : tierColors.builder;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-5 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
              <ArrowLeft size={14} /> Back
            </Link>
            <div className="w-px h-6 bg-gray-700" />
            <div>
              <h1 className="text-white font-black text-lg">My Membership</h1>
              <p className="text-gray-500 text-xs">Access your build plans & courses</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold" style={{ color: tierColor.bg }}>
                {tier.charAt(0).toUpperCase() + tier.slice(1)} Plan
              </p>
              {user && <p className="text-xs text-gray-500">{user.email}</p>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid" ? "bg-cyan-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
                title="Grid view"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list" ? "bg-cyan-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Access Summary */}
        <div className="mb-8 p-6 rounded-2xl border border-gray-800 bg-gray-900/60">
          <h2 className="text-white font-bold text-lg mb-4">Your Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Build Plans</p>
              <p className="text-white text-2xl font-black">{accessibleInventions.length}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Courses</p>
              <p className="text-white text-2xl font-black">{accessibleCourses.length}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Tier Benefits</p>
              <p className="text-cyan-400 text-sm">
                {tier === "builder" && "Full access + PDFs"}
                {tier === "researcher" && "Research + AI tools"}
                {tier === "pro" && "Everything unlocked"}
              </p>
            </div>
          </div>
        </div>

        {/* Build Plans Section */}
        {accessibleInventions.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={20} className="text-yellow-400" />
              <h2 className="text-white font-black text-2xl">Build Plans ({accessibleInventions.length})</h2>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accessibleInventions.map((inv, i) => (
                  <Invention3DCard key={i} invention={inv} tier={tier} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {accessibleInventions.map((inv, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-all flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-sm">{inv.title}</p>
                      <p className="text-gray-500 text-xs mt-1">{inv.tagline}</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-2">
                      <Download size={12} /> Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Courses Section */}
        {accessibleCourses.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen size={20} className="text-blue-400" />
              <h2 className="text-white font-black text-2xl">Courses ({accessibleCourses.length})</h2>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accessibleCourses.map((course, i) => (
                  <div key={i} className="p-5 rounded-xl bg-gray-900 border border-gray-800 hover:border-blue-700/50 transition-all">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{course.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-sm leading-snug">{course.title}</h3>
                        <p className="text-gray-500 text-xs mt-1">Online course</p>
                      </div>
                    </div>
                    <button className="w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all">
                      Start Course
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {accessibleCourses.map((course, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-blue-700/50 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{course.icon}</span>
                      <p className="text-white font-bold text-sm">{course.title}</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all">
                      Start
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {accessibleInventions.length === 0 && accessibleCourses.length === 0 && (
          <div className="text-center py-16">
            <Lock size={32} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500 text-sm">No content available for your tier.</p>
            <Link to="/pricing" className="mt-4 inline-block px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all text-sm">
              Upgrade Plan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}