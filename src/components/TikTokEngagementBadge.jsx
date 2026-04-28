import { TrendingUp } from "lucide-react";

export default function TikTokEngagementBadge({ videoId, views, likes, shares, engagementRate }) {
  if (!videoId) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 text-xs font-semibold">
      <TrendingUp size={12} className="text-red-500" />
      <span>
        {views?.toLocaleString() || 0} views · {engagementRate || 0}% engagement
      </span>
      <a href={`https://www.tiktok.com/@/video/${videoId}`} target="_blank" rel="noopener noreferrer"
        className="ml-2 text-red-600 hover:text-red-700 font-bold text-xs">
        ↗
      </a>
    </div>
  );
}