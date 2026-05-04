import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, RefreshCw, TrendingUp, Users, Play, Heart, Share2, Loader2, AlertCircle } from "lucide-react";

const LINKEDIN_CONNECTOR_ID = "69f0d7c6c3ed41dd461c8dee";
const TIKTOK_CONNECTOR_ID = "69f0da5380de677478656d58";

function StatCard({ label, value, color = "text-white" }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
      <p className={`text-2xl font-black ${color}`}>{value ?? "—"}</p>
      <p className="text-gray-500 text-xs mt-0.5">{label}</p>
    </div>
  );
}

function ConnectCard({ name, color, connectorId, children, connected, onConnect, onDisconnect, loading }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800"
        style={{ borderLeft: `4px solid ${color}` }}>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: connected ? "#00ff99" : "#555", boxShadow: connected ? "0 0 8px #00ff99" : "none" }} />
          <span className="text-white font-black text-sm">{name}</span>
          {connected && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: `${color}20`, color, border: `1px solid ${color}50` }}>Connected</span>}
        </div>
        {connected ? (
          <button onClick={onDisconnect} className="text-gray-500 hover:text-red-400 text-xs font-bold transition-colors" style={{ minHeight: 36 }}>
            Disconnect
          </button>
        ) : (
          <button
            onClick={onConnect}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-black text-xs text-black transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : "Connect"}
          </button>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function SocialMediaCommand() {
  const [user, setUser] = useState(null);
  const [authed, setAuthed] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [linkedinData, setLinkedinData] = useState(null);
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  const [tiktokConnected, setTiktokConnected] = useState(false);
  const [tiktokData, setTiktokData] = useState(null);
  const [tiktokLoading, setTiktokLoading] = useState(false);

  const fetchTikTok = async () => {
    setTiktokLoading(true);
    try {
      const res = await base44.functions.invoke("getTikTokAnalytics", {});
      setTiktokData(res.data);
      setTiktokConnected(true);
    } catch {
      setTiktokConnected(false);
    }
    setTiktokLoading(false);
  };

  const fetchLinkedIn = async () => {
    setLinkedinLoading(true);
    try {
      const res = await base44.functions.invoke("getLinkedInAnalytics", {});
      setLinkedinData(res.data);
      setLinkedinConnected(true);
    } catch {
      setLinkedinConnected(false);
    }
    setLinkedinLoading(false);
  };

  useEffect(() => {
    base44.auth.isAuthenticated().then(async (isAuth) => {
      setAuthed(isAuth);
      if (isAuth) {
        const me = await base44.auth.me().catch(() => null);
        setUser(me);
        await Promise.all([fetchTikTok(), fetchLinkedIn()]);
      }
      setInitLoading(false);
    });
  }, []);

  const handleConnect = async (connectorId, onDone) => {
    const url = await base44.connectors.connectAppUser(connectorId);
    const popup = window.open(url, "_blank");
    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        onDone();
      }
    }, 500);
  };

  const handleDisconnect = async (connectorId, setConnected, setData) => {
    await base44.connectors.disconnectAppUser(connectorId);
    setConnected(false);
    setData(null);
  };

  if (initLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400" size={28} />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 px-6">
        <AlertCircle size={32} className="text-yellow-400" />
        <h2 className="text-white font-black text-xl text-center">Sign in to connect social accounts</h2>
        <button
          onClick={() => base44.auth.redirectToLogin(window.location.pathname)}
          className="px-6 py-3 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-black text-sm transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-30 px-5 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm">
              <ArrowLeft size={16} /> Dashboard
            </Link>
            <span className="text-gray-700">/</span>
            <div className="flex items-center gap-2">
              <Share2 size={16} className="text-cyan-400" />
              <span className="font-black text-white text-sm">Social Integrations</span>
            </div>
          </div>
          <button
            onClick={() => { fetchTikTok(); fetchLinkedIn(); }}
            className="flex items-center gap-1.5 text-gray-500 hover:text-white text-xs font-bold transition-colors"
            style={{ minHeight: 36 }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-10 space-y-6">

        {/* TikTok */}
        <ConnectCard
          name="TikTok Research Analytics"
          color="#ff0050"
          connectorId={TIKTOK_CONNECTOR_ID}
          connected={tiktokConnected}
          loading={tiktokLoading}
          onConnect={() => handleConnect(TIKTOK_CONNECTOR_ID, fetchTikTok)}
          onDisconnect={() => handleDisconnect(TIKTOK_CONNECTOR_ID, setTiktokConnected, setTiktokData)}
        >
          {tiktokLoading ? (
            <div className="flex justify-center py-6"><Loader2 className="animate-spin text-gray-500" size={24} /></div>
          ) : tiktokConnected && tiktokData ? (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <StatCard label="Followers" value={tiktokData.followers?.toLocaleString()} color="text-pink-400" />
                <StatCard label="Following" value={tiktokData.following?.toLocaleString()} />
                <StatCard label="Total Likes" value={tiktokData.likes?.toLocaleString()} color="text-red-400" />
                <StatCard label="Videos" value={tiktokData.videoCount?.toLocaleString()} color="text-cyan-400" />
              </div>
              {tiktokData.videos?.length > 0 && (
                <div>
                  <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">Recent Videos</p>
                  <div className="space-y-2">
                    {tiktokData.videos.slice(0, 5).map((v, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-800/50 rounded-xl px-4 py-3 border border-gray-700">
                        <p className="text-gray-300 text-sm truncate flex-1 mr-4">{v.title || `Video ${i + 1}`}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                          <span className="flex items-center gap-1"><Play size={11} /> {v.views?.toLocaleString() ?? "—"}</span>
                          <span className="flex items-center gap-1"><Heart size={11} /> {v.likes?.toLocaleString() ?? "—"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">Connect your TikTok account to view analytics.</p>
          )}
        </ConnectCard>

        {/* LinkedIn */}
        <ConnectCard
          name="LinkedIn Professional Sharing"
          color="#0077b5"
          connectorId={LINKEDIN_CONNECTOR_ID}
          connected={linkedinConnected}
          loading={linkedinLoading}
          onConnect={() => handleConnect(LINKEDIN_CONNECTOR_ID, fetchLinkedIn)}
          onDisconnect={() => handleDisconnect(LINKEDIN_CONNECTOR_ID, setLinkedinConnected, setLinkedinData)}
        >
          {linkedinLoading ? (
            <div className="flex justify-center py-6"><Loader2 className="animate-spin text-gray-500" size={24} /></div>
          ) : linkedinConnected && linkedinData ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard label="Connections" value={linkedinData.connections?.toLocaleString()} color="text-blue-400" />
              <StatCard label="Profile Views" value={linkedinData.profileViews?.toLocaleString()} />
              <StatCard label="Post Impressions" value={linkedinData.impressions?.toLocaleString()} color="text-cyan-400" />
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">Connect your LinkedIn account to view analytics and enable sharing.</p>
          )}
        </ConnectCard>

        {/* Info */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 text-center">
          <p className="text-gray-500 text-xs leading-relaxed">
            Social integrations use your individual OAuth account — your credentials are never shared. Connect and disconnect at any time from this page.
          </p>
        </div>

      </div>
    </div>
  );
}