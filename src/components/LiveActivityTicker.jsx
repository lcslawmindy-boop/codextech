import { useEffect, useState, useRef } from "react";
import { Flame, Users, Zap, Search, X } from "lucide-react";

const ACTIVITIES = [
  "🔥 Marcus R. just signed up for Builder Membership",
  "⚡ Sarah K. just purchased the MEG Replication Build Plan",
  "🧪 Dr. James T. just accessed the Kapanadze POC Archive",
  "💡 Alex M. just enrolled in Scalar EM Fundamentals Course",
  "🚀 Priya S. just signed up for Pro Membership",
  "🔩 Tyler W. just purchased the TRZ Reactor Build Kit",
  "📄 Chen L. just downloaded the Cold Fusion DOE Report",
  "⚡ Ahmed R. just purchased the Sweet VTA Build Plan",
  "🔥 Emma D. just joined as a Researcher Member",
  "🧲 Victor H. just purchased the Scalar Wave Lab Kit",
  "💎 Natasha B. just upgraded to Pro Membership",
  "🛠️ Marcus L. just purchased the G-Com Communicator Build",
  "📡 Hiro T. just accessed the NSA Scalar EM Document Archive",
  "🔬 Diana P. just completed Scalar EM Module 3",
  "⚡ James F. just purchased the Prioré Device Component Bundle",
  "🔥 Lily C. just signed up — Build Drop #97 incoming!",
  "🚀 Rashid M. just enrolled in the Hydromagnetopropulsion Course",
  "💡 Sophia W. just purchased the MEG Parts Kit",
  "🧪 David K. just joined — only 3 spots left to trigger next Drop!",
  "🔥 NEW DROP at 100 members — 2 spots remaining!",
];

const SITE_INDEX = [
  { title: "Free Preview", path: "/free-vault" },
  { title: "Research Membership", path: "/research-membership" },
  { title: "À La Carte Shop", path: "/alacarte" },
  { title: "Courses", path: "/courses" },
  { title: "Build Plans", path: "/invention-plans" },
  { title: "Patent Tools", path: "/patent-drafting-wizard" },
  { title: "IP Marketplace", path: "/ip-marketplace" },
  { title: "Download Center", path: "/download-center" },
  { title: "Device Graph", path: "/device-graph" },
  { title: "Invention Dossier", path: "/invention-dossier" },
  { title: "Community Forum", path: "/community" },
  { title: "FTO Analysis", path: "/fto-analysis" },
  { title: "AI Patent Attorney", path: "/patent-attorney-chat" },
];

const MEMBER_COUNT = 97; // drives urgency

export default function LiveActivityTicker() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIdx((i) => (i + 1) % ACTIVITIES.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const filteredResults = searchQuery.trim().length > 0
    ? SITE_INDEX.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSelect = (path) => {
    window.location.href = path;
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[200] flex items-center overflow-hidden"
      style={{
        background: "#000",
        border: "none",
        borderBottom: "3px solid #ffff00",
        boxShadow: "0 0 40px rgba(255,255,0,0.7), 0 0 80px rgba(0,255,100,0.4), 0 4px 60px rgba(255,255,0,0.3)",
        height: "64px",
      }}
    >
      {/* Left badge */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-5 h-full"
        style={{
          background: "rgba(255,255,0,0.1)",
          borderRight: "3px solid #ffff00",
          minWidth: "110px",
        }}
      >
        <Flame size={20} style={{ color: "#ff6600", filter: "drop-shadow(0 0 8px #ff6600)" }} />
        <span className="font-black tracking-widest" style={{ color: "#ffff00", textShadow: "0 0 12px #ffff00", fontSize: "16px" }}>
          LIVE
        </span>
        <span
          className="w-3 h-3 rounded-full animate-pulse"
          style={{ background: "#00ff66", boxShadow: "0 0 12px #00ff66" }}
        />
      </div>

      {/* Scrolling message */}
      <div className="flex-1 flex items-center justify-center overflow-hidden px-6">
        <p
          className="font-black tracking-wide transition-all duration-300 text-center"
          style={{
            color: visible ? "#ffffff" : "transparent",
            textShadow: "0 0 16px rgba(0,255,100,0.8), 0 0 30px rgba(255,255,0,0.4)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-10px)",
            fontSize: "17px",
            letterSpacing: "0.04em",
          }}
        >
          {ACTIVITIES[currentIdx]}
        </p>
      </div>

      {/* Search Bar */}
      <div
        ref={searchRef}
        className="flex-shrink-0 flex items-center px-3 h-full relative"
        style={{ borderLeft: "2px solid rgba(255,255,0,0.3)" }}
      >
        {searchOpen ? (
          <div className="flex items-center gap-2 relative">
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="outline-none font-bold text-sm"
              style={{
                background: "#111",
                border: "2px solid #ffff00",
                borderRadius: "8px",
                padding: "4px 12px",
                color: "#fff",
                width: "180px",
                boxShadow: "0 0 12px rgba(255,255,0,0.4)",
              }}
            />
            <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
              <X size={16} style={{ color: "#888" }} />
            </button>
            {filteredResults.length > 0 && (
              <div
                className="absolute top-full left-0 mt-2 rounded-xl overflow-hidden shadow-2xl z-50"
                style={{ background: "#111", border: "2px solid #ffff00", minWidth: "200px", boxShadow: "0 0 24px rgba(255,255,0,0.3)" }}
              >
                {filteredResults.map((r) => (
                  <button
                    key={r.path}
                    onClick={() => handleSelect(r.path)}
                    className="w-full text-left px-4 py-2 text-sm font-bold hover:bg-yellow-900/30 transition-colors"
                    style={{ color: "#ffff00" }}
                  >
                    {r.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-black text-sm transition-all hover:opacity-80"
            style={{ background: "rgba(255,255,0,0.1)", border: "2px solid rgba(255,255,0,0.6)", color: "#ffff00" }}
          >
            <Search size={16} />
            <span className="hidden sm:block" style={{ fontSize: "13px" }}>Search</span>
          </button>
        )}
      </div>

      {/* Right — member counter */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-5 h-full"
        style={{
          background: "rgba(0,255,100,0.1)",
          borderLeft: "3px solid #00ff66",
          minWidth: "160px",
        }}
      >
        <Users size={18} style={{ color: "#00ff66" }} />
        <span className="font-black" style={{ color: "#00ff66", textShadow: "0 0 12px #00ff66", fontSize: "18px" }}>
          {MEMBER_COUNT}/100
        </span>
        <Zap size={16} style={{ color: "#ffff00" }} />
        <span className="font-black hidden sm:block" style={{ color: "#ffff00", textShadow: "0 0 10px #ffff00", fontSize: "14px" }}>
          DROP SOON
        </span>
      </div>
    </div>
  );
}