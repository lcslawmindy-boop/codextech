import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, TrendingUp, Loader2, AlertCircle } from "lucide-react";

export default function TikTokAnalytics() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectorId] = useState("69f0d7c6c3ed41dd461c8dee"); // TikTok connector ID

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await base44.functions.invoke("getTikTokAnalytics", { connectorId });
        
        if (res.data?.videos) {
          setVideos(res.data.videos);
          setError(null);
        } else {
          setError(res.data?.error || "Failed to load analytics");
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError("Unable to connect to TikTok. Please ensure your account is linked.");
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
  const totalEngagement = videos.reduce((sum, v) => sum + (v.likes + v.comments + v.shares || 0), 0);
  const avgEngagementRate = videos.length > 0
    ? (videos.reduce((sum, v) => sum + parseFloat(v.engagementRate || 0), 0) / videos.length).toFixed(2)
    : 0;

  const chartData = videos.slice(0, 10).map(v => ({
    description: v.description?.slice(0, 20) + "..." || "Video",
    views: v.views,
    engagement: v.likes + v.comments + v.shares
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/codextech" className="flex items-center gap-3 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={18} /> Back
          </Link>
          <h1 className="text-lg font-black text-gray-900">TikTok Analytics</h1>
          <div className="w-16" />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="text-gray-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white border border-red-200 rounded-lg p-8 text-center">
            <AlertCircle size={32} className="text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white font-bold hover:bg-gray-800">
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: "Total Views", value: totalViews.toLocaleString(), icon: "👁" },
                { label: "Total Engagement", value: totalEngagement.toLocaleString(), icon: "❤️" },
                { label: "Avg Engagement Rate", value: `${avgEngagementRate}%`, icon: "📈" },
                { label: "Videos", value: videos.length, icon: "🎬" }
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm font-semibold">{stat.label}</span>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-black text-gray-900 mb-4">Views by Video</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="description" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#000000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-black text-gray-900 mb-4">Engagement by Video</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="description" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Videos Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-black text-gray-900">Recent Videos</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left font-bold text-gray-900">Description</th>
                      <th className="px-6 py-3 text-left font-bold text-gray-900">Views</th>
                      <th className="px-6 py-3 text-left font-bold text-gray-900">Likes</th>
                      <th className="px-6 py-3 text-left font-bold text-gray-900">Comments</th>
                      <th className="px-6 py-3 text-left font-bold text-gray-900">Shares</th>
                      <th className="px-6 py-3 text-left font-bold text-gray-900">Engagement Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map((video, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-6 py-4 text-gray-900 font-semibold">
                          {video.description?.slice(0, 40) || "Research Video"}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{(video.views || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-600">{(video.likes || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-600">{(video.comments || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-600">{(video.shares || 0).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-900 font-bold text-xs">
                            {video.engagementRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {videos.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-sm">No videos found. Start posting research content to TikTok!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}