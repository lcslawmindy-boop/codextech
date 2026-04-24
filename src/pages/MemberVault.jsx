import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, History, Zap, LogOut, Settings, Heart } from "lucide-react";

const MEMBER_BUILDS = [
  { id: 1, title: "MEG Replication Device", category: "Energy", status: "viewed", progress: 35, saved: true },
  { id: 2, title: "Scalar EM Transmitter", category: "Communications", status: "viewed", progress: 0, saved: false },
  { id: 3, title: "Biofield Resonance Chamber", category: "Bio-Signal", status: "new", progress: 0, saved: true },
];

const RECENT_HISTORY = [
  { build: "MEG Replication Device", action: "Viewed BOM", date: "2 hours ago" },
  { build: "Scalar EM Transmitter", action: "Downloaded PDF", date: "1 day ago" },
  { build: "Anenergy Pump Circuit", action: "Started assembly", date: "3 days ago" },
];

export default function MemberVault() {
  const [activeTab, setActiveTab] = useState("saved");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── Header ── */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-6 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Your Vault</h1>
            <p className="text-gray-500 text-xs">Pro Member</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/account" className="p-2 rounded-lg hover:bg-gray-800 transition-colors" title="Account">
              <Settings size={18} />
            </Link>
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* ── Tabs ── */}
        <div className="flex gap-4 mb-8 border-b border-gray-800">
          {["saved", "recent", "recommended"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 font-bold text-sm border-b-2 transition-all ${
                activeTab === tab
                  ? "border-cyan-600 text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab === "saved" && <Bookmark size={14} className="inline mr-2" />}
              {tab === "recent" && <History size={14} className="inline mr-2" />}
              {tab === "recommended" && <Zap size={14} className="inline mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {activeTab === "saved" && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MEMBER_BUILDS.filter(b => b.saved).map(build => (
                <Link
                  key={build.id}
                  to={`/build/${build.id}`}
                  className="bg-gray-900 border border-gray-800 hover:border-cyan-700 rounded-xl overflow-hidden transition-all group"
                >
                  <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center text-4xl">
                    ⚡
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-cyan-400 font-bold uppercase mb-1">{build.category}</p>
                    <h3 className="text-white font-bold text-sm mb-3">{build.title}</h3>
                    {build.progress > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{build.progress}% viewed</p>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-600" style={{ width: `${build.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {MEMBER_BUILDS.filter(b => b.saved).length === 0 && (
              <div className="text-center py-12">
                <Heart size={32} className="text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500">No saved builds yet. Start bookmarking builds to see them here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "recent" && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            {RECENT_HISTORY.map((item, i) => (
              <div key={i} className={`flex items-start justify-between p-6 ${i !== RECENT_HISTORY.length - 1 ? "border-b border-gray-800" : ""}`}>
                <div>
                  <h3 className="text-white font-bold">{item.build}</h3>
                  <p className="text-gray-500 text-sm">{item.action}</p>
                </div>
                <span className="text-gray-600 text-sm">{item.date}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "recommended" && (
          <div>
            <p className="text-gray-500 mb-6">Based on your viewing history, we recommend these builds:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Telomere Regeneration Device", category: "Bio-Tech", match: "92% match" },
                { title: "Kaznacheyev UV Spectrometer", category: "Instrumentation", match: "87% match" },
                { title: "Quantum Potential Extractor", category: "Energy", match: "84% match" },
              ].map((build, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 hover:border-cyan-700 rounded-xl overflow-hidden p-6">
                  <p className="text-xs text-cyan-400 font-bold mb-2">{build.category}</p>
                  <h3 className="text-white font-bold text-sm mb-3">{build.title}</h3>
                  <p className="text-green-400 text-xs font-bold">{build.match}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}