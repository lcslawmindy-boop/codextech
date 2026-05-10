import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, BarChart3, TrendingUp, Share2, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ConversionAnalytics() {
  const [stats, setStats] = useState({ enterpriseSignups: 0, conversationRate: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [milestoneName, setMilestoneName] = useState("");
  const [milestoneSummary, setMilestoneSummary] = useState("");
  const [shareStatus, setShareStatus] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch GA4 data via backend
      const gaResponse = await base44.functions.invoke("getGA4Conversions", {});
      if (gaResponse.data) {
        setStats({
          enterpriseSignups: gaResponse.data.enterpriseSignups || 0,
          conversionRate: gaResponse.data.conversionRate || 0,
          revenue: gaResponse.data.revenue || 0,
        });
      }
    } catch (err) {
      console.error("Error loading analytics:", err);
    }
    setLoading(false);
  };

  const handleShareMilestone = async () => {
    if (!milestoneName.trim() || !milestoneSummary.trim()) return;
    setSharing(true);
    setShareStatus(null);

    try {
      const result = await base44.functions.invoke("shareLinkedInMilestone", {
        milestoneName,
        milestoneSummary,
        inventionName: "Electromagnetic Research",
      });

      if (result.data?.success) {
        setShareStatus("success");
        setMilestoneName("");
        setMilestoneSummary("");
        setTimeout(() => setShareStatus(null), 3000);
      }
    } catch (err) {
      console.error("Share error:", err);
      setShareStatus("error");
    }
    setSharing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="border-b border-slate-800 bg-slate-950/90 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-sm">
            <ArrowLeft size={14} /> Admin
          </Link>
          <h1 className="text-white font-black text-lg flex items-center gap-2">
            <BarChart3 size={18} className="text-cyan-400" /> Enterprise Conversion Analytics
          </h1>
        </div>
        <button onClick={loadAnalytics} disabled={loading} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-bold">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6 max-w-4xl mx-auto w-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Enterprise Signups</p>
            {loading ? <div className="h-8 bg-slate-800 rounded mt-2 animate-pulse" /> : <p className="text-white font-black text-4xl mt-2">{stats.enterpriseSignups}</p>}
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Conversion Rate</p>
            {loading ? <div className="h-8 bg-slate-800 rounded mt-2 animate-pulse" /> : <p className="text-cyan-400 font-black text-4xl mt-2">{(stats.conversionRate * 100).toFixed(1)}%</p>}
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Enterprise Revenue</p>
            {loading ? <div className="h-8 bg-slate-800 rounded mt-2 animate-pulse" /> : <p className="text-green-400 font-black text-4xl mt-2">${(stats.revenue / 1000).toFixed(1)}k</p>}
          </div>
        </div>

        {/* Milestone Sharing */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-black text-base mb-1 flex items-center gap-2">
            <Share2 size={16} className="text-purple-400" /> Share Research Milestone to LinkedIn
          </h2>
          <p className="text-slate-500 text-xs mb-4">Automatically post new electromagnetic research achievements to your LinkedIn professional network.</p>

          <div className="space-y-3">
            <input
              type="text"
              value={milestoneName}
              onChange={e => setMilestoneName(e.target.value)}
              placeholder="Milestone name (e.g. 'Scalar Field Modulation Achieved')"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500"
            />
            <textarea
              value={milestoneSummary}
              onChange={e => setMilestoneSummary(e.target.value)}
              placeholder="Brief description of the milestone and its significance..."
              className="w-full h-24 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500 resize-none"
            />

            {shareStatus === "success" && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-900/20 border border-green-700 text-green-400 text-sm">
                <CheckCircle2 size={16} /> Milestone shared to LinkedIn successfully!
              </div>
            )}
            {shareStatus === "error" && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 border border-red-700 text-red-400 text-sm">
                <AlertCircle size={16} /> Failed to share. Please try again.
              </div>
            )}

            <button
              onClick={handleShareMilestone}
              disabled={!milestoneName.trim() || !milestoneSummary.trim() || sharing}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-bold transition-all"
            >
              {sharing ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
              {sharing ? "Posting to LinkedIn..." : "Share Milestone"}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-sm text-slate-400">
          <p className="font-semibold text-slate-300 mb-2">📊 How Conversion Tracking Works:</p>
          <ul className="text-xs space-y-1 list-disc list-inside">
            <li>Enterprise tier signups fire GA4 purchase + conversion events</li>
            <li>Conversion data syncs to your GA4 property in real-time</li>
            <li>LinkedIn milestones are posted to your professional network</li>
          </ul>
        </div>
      </div>
    </div>
  );
}