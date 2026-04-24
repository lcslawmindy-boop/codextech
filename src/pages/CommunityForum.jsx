import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Plus, Filter, TrendingUp, Users, MessageCircle, Award } from "lucide-react";
import CommunityPostCard from "../components/CommunityPostCard";

const INVENTIONS = [
  "MEG Replication Device",
  "Scalar EM Lab",
  "Prioré Device",
  "Anenergy Pump",
  "TRD-1 Telomere Device",
  "All Inventions"
];

const POST_TYPES = [
  { value: "all", label: "All Posts" },
  { value: "build_photo", label: "📸 Build Photos" },
  { value: "troubleshooting", label: "🔧 Troubleshooting" },
  { value: "tip", label: "💡 Tips" },
  { value: "question", label: "❓ Questions" }
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "trending", label: "🔥 Trending" },
  { value: "popular", label: "⭐ Most Upvoted" },
  { value: "discussed", label: "💬 Most Discussed" }
];

export default function CommunityForum() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [selectedInvention, setSelectedInvention] = useState("All Inventions");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    base44.auth.me().then(u => setCurrentUser(u?.email)).catch(() => {});
  }, []);

  useEffect(() => {
    loadPosts();
  }, [selectedInvention, selectedType, sortBy]);

  const loadPosts = async () => {
    setLoading(true);
    let query = { status: "published" };
    
    if (selectedInvention !== "All Inventions") {
      query.invention_name = selectedInvention;
    }
    if (selectedType !== "all") {
      query.post_type = selectedType;
    }

    const result = await base44.entities.CommunityPost.filter(query);
    
    // Sort posts
    const sorted = [...(result || [])].sort((a, b) => {
      switch (sortBy) {
        case "trending":
          return (b.upvotes || 0) - (a.upvotes || 0);
        case "popular":
          return (b.upvotes || 0) - (a.upvotes || 0);
        case "discussed":
          return (b.reply_count || 0) - (a.reply_count || 0);
        default: // newest
          return new Date(b.created_date) - new Date(a.created_date);
      }
    });

    setPosts(sorted);
    setLoading(false);
  };

  const handleUpvote = async (postId) => {
    if (!currentUser) {
      alert("Please log in to upvote posts.");
      return;
    }

    const post = posts.find(p => p.id === postId);
    const wasUpvoted = post.upvoted_by?.includes(currentUser);
    const newUpvotedBy = wasUpvoted
      ? post.upvoted_by.filter(e => e !== currentUser)
      : [...(post.upvoted_by || []), currentUser];

    await base44.entities.CommunityPost.update(postId, {
      upvoted_by: newUpvotedBy,
      upvotes: newUpvotedBy.length
    });

    loadPosts();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-8 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black mb-2">Community Forum</h1>
              <p className="text-gray-400">Share builds, troubleshoot, and learn from other builders</p>
            </div>
            <Link
              to="/community/new"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all whitespace-nowrap">
              <Plus size={16} /> New Post
            </Link>
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-500" />
              <span className="text-xs text-gray-600 font-semibold">INVENTION:</span>
              <select
                value={selectedInvention}
                onChange={(e) => setSelectedInvention(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500">
                {INVENTIONS.map(inv => (
                  <option key={inv} value={inv}>{inv}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 font-semibold">TYPE:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500">
                {POST_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-gray-500" />
              <span className="text-xs text-gray-600 font-semibold">SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500">
                {SORT_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Community stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-12">
          {[
            { icon: <Users size={18} />, label: "Active Members", value: "2.4k+" },
            { icon: <MessageCircle size={18} />, label: "Total Posts", value: posts.length },
            { icon: <Award size={18} />, label: "Featured Builds", value: posts.filter(p => p.is_featured).length },
            { icon: <TrendingUp size={18} />, label: "This Month", value: "847" }
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-cyan-400 mb-2 flex justify-center">{stat.icon}</div>
              <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
              <p className="text-white font-black text-xl">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Posts grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-gray-700 border-t-cyan-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-2xl">
            <p className="text-gray-500 mb-3">No posts yet in this category.</p>
            <Link
              to="/community/new"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-all">
              <Plus size={14} /> Be the first to post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post) => (
              <CommunityPostCard
                key={post.id}
                post={post}
                onUpvote={handleUpvote}
                currentUserEmail={currentUser}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}