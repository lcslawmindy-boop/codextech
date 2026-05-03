import { useEffect, useState } from "react";
import { Flame, Users, Zap } from "lucide-react";

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

const MEMBER_COUNT = 97; // drives urgency

export default function LiveActivityTicker() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(true);

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

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[200] flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(90deg, #001a00 0%, #050505 40%, #1a0a00 100%)",
        borderBottom: "2px solid #00ff66",
        boxShadow: "0 0 24px rgba(0,255,100,0.5), 0 2px 40px rgba(255,120,0,0.2)",
        height: "40px",
      }}
    >
      {/* Left badge */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-4 h-full"
        style={{
          background: "rgba(0,255,100,0.12)",
          borderRight: "2px solid #00ff66",
        }}
      >
        <Flame size={14} style={{ color: "#ff6600", filter: "drop-shadow(0 0 6px #ff6600)" }} />
        <span className="text-xs font-black tracking-widest" style={{ color: "#00ff66", textShadow: "0 0 8px #00ff66" }}>
          LIVE
        </span>
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: "#00ff66", boxShadow: "0 0 8px #00ff66" }}
        />
      </div>

      {/* Scrolling message */}
      <div className="flex-1 flex items-center justify-center overflow-hidden px-4">
        <p
          className="text-xs font-bold tracking-wide transition-all duration-300 text-center"
          style={{
            color: visible ? "#ffffff" : "transparent",
            textShadow: "0 0 10px rgba(0,255,100,0.4)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-8px)",
          }}
        >
          {ACTIVITIES[currentIdx]}
        </p>
      </div>

      {/* Right — member counter */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-4 h-full"
        style={{
          background: "rgba(255,100,0,0.12)",
          borderLeft: "2px solid #ff6600",
        }}
      >
        <Users size={13} style={{ color: "#ff6600" }} />
        <span className="text-xs font-black" style={{ color: "#ff6600", textShadow: "0 0 8px #ff6600" }}>
          {MEMBER_COUNT}/100
        </span>
        <Zap size={12} style={{ color: "#ffcc00" }} />
        <span className="text-xs font-black hidden sm:block" style={{ color: "#ffcc00" }}>
          DROP SOON
        </span>
      </div>
    </div>
  );
}