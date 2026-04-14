import { useState } from "react";

// ── LINKEDIN MOCKUP ───────────────────────────────────────────────────────────
function LinkedInMockup({ data }) {
  return (
    <div className="bg-[#f3f2ef] rounded-2xl overflow-hidden font-sans text-sm shadow-xl border border-gray-200 max-w-xl mx-auto">
      {/* Cover photo */}
      <div className="h-24 w-full" style={{ background: "linear-gradient(135deg, #0A66C2, #004182)" }} />
      {/* Profile section */}
      <div className="bg-white px-5 pb-4 relative">
        <div className="flex items-end justify-between mb-2">
          <div className="w-20 h-20 rounded-full border-4 border-white bg-[#0A66C2] flex items-center justify-center text-3xl font-black text-white -mt-10 shadow-md">ZA</div>
          <button className="mt-2 px-4 py-1.5 rounded-full bg-[#0A66C2] text-white text-xs font-bold">Connect</button>
        </div>
        <h2 className="text-gray-900 font-black text-lg leading-tight">Zenith Apex Research</h2>
        <p className="text-gray-700 text-sm leading-snug mt-0.5 mb-1">{data.headline || "Advanced Electromagnetic Research & IP Commercialization"}</p>
        <p className="text-gray-500 text-xs">San Francisco Bay Area · <span className="text-[#0A66C2] font-semibold cursor-pointer">500+ connections</span></p>
        {data.tagline && (
          <p className="text-gray-600 text-xs mt-2 italic border-l-2 border-[#0A66C2] pl-2">{data.tagline}</p>
        )}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-gray-900 font-bold text-xs mb-1">About</p>
          <p className="text-gray-600 text-xs leading-relaxed line-clamp-4">{data.about || "Platform description here."}</p>
        </div>
      </div>
    </div>
  );
}

// ── TWITTER / X MOCKUP ───────────────────────────────────────────────────────
function TwitterMockup({ data }) {
  return (
    <div className="bg-black rounded-2xl overflow-hidden font-sans shadow-xl border border-gray-800 max-w-xl mx-auto">
      {/* Cover */}
      <div className="h-20 w-full bg-gradient-to-r from-gray-800 to-gray-700" />
      {/* Profile */}
      <div className="px-4 pb-4 bg-black relative">
        <div className="flex items-end justify-between mb-3">
          <div className="w-16 h-16 rounded-full border-4 border-black bg-white flex items-center justify-center text-2xl font-black text-black -mt-8 shadow">𝕏</div>
          <button className="mt-2 px-4 py-1.5 rounded-full border border-gray-600 text-white text-xs font-bold">Follow</button>
        </div>
        <h2 className="text-white font-black text-base leading-tight">Zenith Apex Research</h2>
        <p className="text-gray-500 text-sm">@ZenithApexIP</p>
        <p className="text-gray-200 text-sm leading-relaxed mt-2">{data.bio || "Bio goes here."}</p>
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          <span><span className="text-white font-bold">2.4K</span> Following</span>
          <span><span className="text-white font-bold">18.7K</span> Followers</span>
        </div>
        {/* Pinned post */}
        {data.pinned_post && (
          <div className="mt-4 pt-3 border-t border-gray-800">
            <p className="text-gray-500 text-xs font-semibold mb-2 flex items-center gap-1">📌 Pinned post</p>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black text-black flex-shrink-0">𝕏</div>
              <div>
                <p className="text-white text-xs font-bold">Zenith Apex Research <span className="text-gray-500 font-normal">@ZenithApexIP · Apr 14</span></p>
                <p className="text-gray-200 text-sm leading-relaxed mt-1">{data.pinned_post}</p>
                <div className="flex gap-5 mt-2 text-gray-500 text-xs">
                  <span>💬 47</span><span>🔁 231</span><span>❤️ 1.2K</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── YOUTUBE MOCKUP ───────────────────────────────────────────────────────────
function YouTubeMockup({ data }) {
  return (
    <div className="bg-[#0f0f0f] rounded-2xl overflow-hidden font-sans shadow-xl border border-gray-800 max-w-xl mx-auto">
      {/* Banner */}
      <div className="h-20 w-full" style={{ background: "linear-gradient(135deg, #FF0000, #aa0000)" }} />
      <div className="px-5 py-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-2xl font-black text-white border-2 border-gray-700">▶</div>
          <div>
            <h2 className="text-white font-black text-base">{data.channel_name || "Zenith Apex Research"}</h2>
            <p className="text-gray-400 text-xs">@ZenithApexResearch · 12.4K subscribers · 87 videos</p>
          </div>
          <button className="ml-auto px-4 py-2 rounded-full bg-white text-black text-xs font-black">Subscribe</button>
        </div>
        <p className="text-gray-300 text-xs leading-relaxed line-clamp-3 border-t border-gray-800 pt-3">{data.description || data.about || "Channel description."}</p>
      </div>
    </div>
  );
}

// ── INSTAGRAM MOCKUP ─────────────────────────────────────────────────────────
function InstagramMockup({ data }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden font-sans shadow-xl border border-gray-200 max-w-sm mx-auto">
      <div className="px-5 py-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full border-2 border-pink-500 p-0.5">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 flex items-center justify-center text-xl text-white font-black">ZA</div>
          </div>
          <div>
            <h2 className="text-gray-900 font-black text-sm">{data.name || "zenithapexresearch"}</h2>
            <div className="flex gap-3 mt-1 text-xs text-gray-700">
              <span><span className="font-black text-gray-900">247</span> posts</span>
              <span><span className="font-black text-gray-900">8.9K</span> followers</span>
              <span><span className="font-black text-gray-900">412</span> following</span>
            </div>
          </div>
        </div>
        <p className="text-gray-900 font-bold text-xs mb-1">Zenith Apex Research</p>
        <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-wrap">{data.bio || "Bio goes here."}</p>
        {data.website_label && (
          <p className="text-blue-500 text-xs font-semibold mt-1">🔗 {data.website_label}</p>
        )}
        <div className="flex gap-2 mt-3">
          <button className="flex-1 py-1.5 rounded-lg bg-gray-100 text-gray-900 text-xs font-bold border border-gray-200">Follow</button>
          <button className="flex-1 py-1.5 rounded-lg bg-gray-100 text-gray-900 text-xs font-bold border border-gray-200">Message</button>
        </div>
        {/* Grid placeholder */}
        <div className="grid grid-cols-3 gap-1 mt-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TIKTOK MOCKUP ────────────────────────────────────────────────────────────
function TikTokMockup({ data }) {
  return (
    <div className="bg-black rounded-2xl overflow-hidden font-sans shadow-xl border border-gray-800 max-w-sm mx-auto">
      <div className="px-5 py-6 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-gradient-to-br from-[#ff0050] to-[#00f2ea] p-0.5">
          <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-2xl">🎵</div>
        </div>
        <h2 className="text-white font-black text-base">@{data.username || "zenithapexresearch"}</h2>
        <p className="text-gray-300 text-sm leading-relaxed mt-2 mb-3">{data.bio || "Bio goes here."}</p>
        <div className="flex justify-center gap-6 text-xs text-gray-400 mb-4">
          <div><div className="text-white font-black text-base">312</div>Following</div>
          <div><div className="text-white font-black text-base">24.8K</div>Followers</div>
          <div><div className="text-white font-black text-base">1.2M</div>Likes</div>
        </div>
        <button className="w-full py-2 rounded-md border border-gray-600 text-white text-xs font-bold">Follow</button>
      </div>
    </div>
  );
}

// ── SUBSTACK MOCKUP ──────────────────────────────────────────────────────────
function SubstackMockup({ data }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden font-sans shadow-xl border border-gray-200 max-w-xl mx-auto">
      <div className="h-6 w-full bg-[#FF6719]" />
      <div className="px-6 py-6 text-center">
        <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-[#FF6719] flex items-center justify-center text-2xl font-black text-white">📰</div>
        <h2 className="text-gray-900 font-black text-xl mb-1">{data.publication_name || "Zenith Apex Research"}</h2>
        <p className="text-gray-600 text-sm italic mb-4">{data.tagline || "Your tagline here."}</p>
        <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-4">{data.description || "Description here."}</p>
        <button className="px-8 py-2.5 rounded-full bg-[#FF6719] text-white text-sm font-black shadow">Subscribe</button>
        <p className="text-gray-400 text-xs mt-3">4,200 subscribers · Free & paid plans</p>
      </div>
    </div>
  );
}

// ── REDDIT MOCKUP ────────────────────────────────────────────────────────────
function RedditMockup({ data }) {
  return (
    <div className="bg-[#dae0e6] rounded-2xl overflow-hidden font-sans shadow-xl border border-gray-300 max-w-xl mx-auto">
      <div className="h-14 bg-gradient-to-r from-[#FF4500] to-[#ff6534]" />
      <div className="bg-white px-5 pb-5 relative">
        <div className="flex items-end gap-3 mb-3">
          <div className="w-14 h-14 rounded-full bg-[#FF4500] flex items-center justify-center text-2xl -mt-7 border-4 border-white shadow">🔴</div>
          <div>
            <h2 className="text-gray-900 font-black text-base">r/{data.subreddit_name || "ZenithApexResearch"}</h2>
            <p className="text-gray-500 text-xs">12.4K members · 87 online</p>
          </div>
          <button className="ml-auto px-4 py-1.5 rounded-full bg-[#FF4500] text-white text-xs font-black">Join</button>
        </div>
        <p className="text-gray-700 text-xs leading-relaxed mb-3 line-clamp-3">{data.description || "Community description."}</p>
        {data.sidebar && (
          <div className="bg-[#f6f7f8] border border-gray-200 rounded-lg p-3">
            <p className="text-gray-500 text-xs font-bold mb-1 uppercase tracking-wider">About Community</p>
            <p className="text-gray-700 text-xs leading-relaxed line-clamp-4">{data.sidebar}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FACEBOOK MOCKUP ──────────────────────────────────────────────────────────
function FacebookMockup({ data }) {
  return (
    <div className="bg-[#f0f2f5] rounded-2xl overflow-hidden font-sans shadow-xl border border-gray-200 max-w-xl mx-auto">
      <div className="h-24 bg-gradient-to-r from-[#1877F2] to-[#0a5dc2]" />
      <div className="bg-white px-5 pb-5 relative">
        <div className="flex items-end gap-4 mb-3">
          <div className="w-20 h-20 rounded-full bg-[#1877F2] flex items-center justify-center text-3xl font-black text-white -mt-10 border-4 border-white shadow-md">👥</div>
          <div className="pb-1">
            <h2 className="text-gray-900 font-black text-lg leading-tight">{data.page_name || "Zenith Apex Research"}</h2>
            <p className="text-gray-500 text-xs">Research · Technology · 8.2K followers</p>
          </div>
          <button className="ml-auto mb-1 px-4 py-1.5 rounded-lg bg-[#1877F2] text-white text-xs font-bold">Like</button>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-2 line-clamp-2">{data.short_description || "Short description."}</p>
        {data.long_description && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-gray-500 text-xs font-bold mb-1">About</p>
            <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">{data.long_description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── DISPATCHER ───────────────────────────────────────────────────────────────
const MOCKUP_MAP = {
  linkedin: LinkedInMockup,
  twitter: TwitterMockup,
  youtube: YouTubeMockup,
  instagram: InstagramMockup,
  tiktok: TikTokMockup,
  substack: SubstackMockup,
  reddit: RedditMockup,
  facebook: FacebookMockup,
};

export default function SocialPlatformMockup({ platformId, data }) {
  const Component = MOCKUP_MAP[platformId];
  if (!Component) return null;
  return (
    <div>
      <Component data={data} />
    </div>
  );
}