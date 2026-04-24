import { Heart, MessageCircle, Award, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function CommunityPostCard({ post, onUpvote, currentUserEmail }) {
  const isUpvoted = post.upvoted_by?.includes(currentUserEmail);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all">
      {/* Image */}
      {post.image_url && (
        <div className="h-40 overflow-hidden bg-gray-950">
          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Featured badge */}
      {post.is_featured && (
        <div className="px-4 py-1.5 bg-yellow-950/40 border-b border-yellow-800/30 flex items-center gap-1.5">
          <Award size={13} className="text-yellow-500" />
          <span className="text-xs text-yellow-600 font-semibold">Featured Build</span>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <Link
            to={`/community/${post.id}`}
            className="text-white font-bold hover:text-cyan-400 transition-colors text-sm">
            {post.title}
          </Link>
          <p className="text-xs text-gray-500 mt-1">
            in <span className="text-cyan-600 font-semibold">{post.invention_name}</span>
          </p>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-3 line-clamp-2">{post.content}</p>

        {/* Post type badge */}
        <div className="mb-3">
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
            post.post_type === "build_photo" ? "bg-green-900/30 text-green-400" :
            post.post_type === "troubleshooting" ? "bg-red-900/30 text-red-400" :
            post.post_type === "tip" ? "bg-blue-900/30 text-blue-400" :
            "bg-purple-900/30 text-purple-400"
          }`}>
            {post.post_type === "build_photo" ? "📸 Build Photo" :
             post.post_type === "troubleshooting" ? "🔧 Troubleshooting" :
             post.post_type === "tip" ? "💡 Tip" :
             "❓ Question"}
          </span>
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-800">
          <span>{post.author_name || post.author_email}</span>
          <span>{post.reply_count} replies</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onUpvote(post.id)}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
              isUpvoted
                ? "text-red-400"
                : "text-gray-500 hover:text-red-400"
            }`}>
            <Heart size={14} fill={isUpvoted ? "currentColor" : "none"} />
            {post.upvotes}
          </button>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-cyan-400 transition-colors font-semibold">
            <MessageCircle size={14} />
            Reply
          </button>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-cyan-400 transition-colors ml-auto">
            <Share2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}