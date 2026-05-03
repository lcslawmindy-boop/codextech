import { useState } from "react";
import { Lock, GraduationCap, ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

const COURSES = [
  {
    icon: "⚡",
    title: "Scalar EM Fundamentals",
    subtitle: "Module 1–8 · Maxwell's Quaternions to Aharonov-Bohm",
    lessons: 24,
    hours: "18hrs",
    level: "Intermediate",
    rating: "4.9",
    topics: ["Maxwell original equations", "Scalar potential engineering", "Phase conjugation", "Lab validation protocols"],
    neon: "#00ff66",
    badge: "BESTSELLER",
  },
  {
    icon: "🧲",
    title: "MEG Replication Masterclass",
    subtitle: "Full build walkthrough — Bearden's US6,362,718",
    lessons: 31,
    hours: "22hrs",
    level: "Advanced",
    rating: "4.8",
    topics: ["Toroidal core winding", "Magnet placement geometry", "COP measurement methods", "Resonance tuning"],
    neon: "#ff6600",
    badge: "TOP RATED",
  },
  {
    icon: "🌊",
    title: "Hydromagnetopropulsion Systems",
    subtitle: "Electromagnetic thrust without fuel — advanced theory",
    lessons: 18,
    hours: "14hrs",
    level: "Expert",
    rating: "4.7",
    topics: ["MHD drive physics", "Seawater plasma dynamics", "Thrust equations", "Prototype assembly"],
    neon: "#00ccff",
    badge: "NEW DROP",
  },
  {
    icon: "🔬",
    title: "Prior Art & Patent Strategy",
    subtitle: "IP landscape navigation for advanced inventors",
    lessons: 15,
    hours: "10hrs",
    level: "All levels",
    rating: "4.9",
    topics: ["FTO analysis", "Prior art search", "Claims drafting", "Suppression patterns"],
    neon: "#cc00ff",
    badge: "HIGH VALUE",
  },
  {
    icon: "📡",
    title: "Scalar Wave Communications",
    subtitle: "Longitudinal EM wave devices — theory to build",
    lessons: 12,
    hours: "9hrs",
    level: "Advanced",
    rating: "4.6",
    topics: ["Whittaker decomposition", "Transceiver design", "G-Com build steps", "Range testing"],
    neon: "#ffcc00",
    badge: "EXCLUSIVE",
  },
  {
    icon: "🧬",
    title: "Bioelectromagnetics & Health Devices",
    subtitle: "Prioré Device clinical data + replication guide",
    lessons: 20,
    hours: "16hrs",
    level: "Advanced",
    rating: "4.8",
    topics: ["EM bio-resonance", "Prioré clinical trials", "Rotating field devices", "Safety protocols"],
    neon: "#ff3366",
    badge: "CLASSIFIED",
  },
];

function Course3DCard({ course }) {
  const [hovered, setHovered] = useState(false);
  const [rot, setRot] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setRot({ x: dy * -8, y: dx * 8 });
  };

  return (
    <div style={{ perspective: "900px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setHovered(false); setRot({ x: 0, y: 0 }); }}
    >
      <div
        style={{
          transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) ${hovered ? "translateZ(12px) scale(1.03)" : "scale(1)"}`,
          transition: "transform 0.15s ease",
          background: "#000",
          border: `3px solid ${course.neon}`,
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: hovered
            ? `0 0 60px ${course.neon}99, 0 0 120px ${course.neon}44, 0 20px 60px rgba(0,0,0,0.95)`
            : `0 0 30px ${course.neon}66, 0 0 60px ${course.neon}22, 0 8px 24px rgba(0,0,0,0.9)`,
          position: "relative",
        }}
      >
        {/* Top visual */}
        <div
          style={{
            height: "120px",
            background: `#000`,
            borderBottom: `3px solid ${course.neon}`,
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "0 20px",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "12px",
              background: "#000",
              border: `3px solid ${course.neon}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              boxShadow: `0 0 24px ${course.neon}`,
              flexShrink: 0,
            }}
          >
            {course.icon}
          </div>
          <div>
            <p style={{ color: "#aaa", fontSize: "12px", marginBottom: "4px", fontWeight: "700" }}>{course.subtitle}</p>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <Star size={13} style={{ color: "#ffff00", fill: "#ffff00" }} />
              <span style={{ color: "#ffff00", fontSize: "14px", fontWeight: "900" }}>{course.rating}</span>
              <span style={{ color: "#888", fontSize: "12px" }}>· {course.level}</span>
            </div>
          </div>
          {/* Badge */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "#000",
              border: `2px solid ${course.neon}`,
              borderRadius: "6px",
              padding: "3px 10px",
              fontSize: "11px",
              fontWeight: "900",
              color: course.neon,
              letterSpacing: "0.1em",
              textShadow: `0 0 10px ${course.neon}`,
              boxShadow: `0 0 12px ${course.neon}66`,
            }}
          >
            {course.badge}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "18px 20px", background: "#000" }}>
          <h3 style={{ color: "#fff", fontWeight: "900", fontSize: "18px", marginBottom: "12px", textShadow: `0 0 20px ${course.neon}66` }}>
            {course.title}
          </h3>

          {/* Stats */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            {[
              { val: course.lessons, label: "Lessons" },
              { val: course.hours, label: "Content" },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, background: "#111", border: `2px solid ${course.neon}55`, borderRadius: "8px", padding: "8px", textAlign: "center" }}>
                <p style={{ color: course.neon, fontSize: "16px", fontWeight: "900" }}>{s.val}</p>
                <p style={{ color: "#888", fontSize: "11px", fontWeight: "700" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Topics */}
          <div style={{ marginBottom: "14px" }}>
            {course.topics.slice(0, 3).map((t, i) => (
              <p key={i} style={{ color: "#ccc", fontSize: "13px", paddingLeft: "14px", position: "relative", marginBottom: "4px", fontWeight: "600" }}>
                <span style={{ position: "absolute", left: 0, color: course.neon, fontWeight: "900" }}>›</span> {t}
              </p>
            ))}
            <p style={{ color: "#666", fontSize: "12px", paddingLeft: "14px", fontWeight: "700" }}>+ more inside...</p>
          </div>

          <Link
            to="/subscribe"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px",
              borderRadius: "10px",
              background: "#000",
              border: `2px solid ${course.neon}`,
              color: course.neon,
              fontSize: "14px",
              fontWeight: "900",
              textDecoration: "none",
              boxShadow: `0 0 16px ${course.neon}55`,
              letterSpacing: "0.05em",
            }}
          >
            <Lock size={14} /> Enroll — Members Only
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CourseCatalogue3D() {
  return (
    <section
      className="px-6 py-16 border-b border-white/10"
      style={{ background: "linear-gradient(180deg, #030308 0%, #020202 100%)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{
              border: "2px solid #ff6600",
              background: "rgba(255,100,0,0.08)",
              boxShadow: "0 0 20px rgba(255,100,0,0.3)",
            }}
          >
            <GraduationCap size={13} style={{ color: "#ff6600" }} />
            <span className="text-xs font-black tracking-widest" style={{ color: "#ff6600", textShadow: "0 0 8px #ff6600" }}>
              COURSE CATALOGUE
            </span>
          </div>
          <h2 className="text-3xl font-black mb-3" style={{ color: "#fff", textShadow: "0 0 30px rgba(255,100,0,0.4)" }}>
            8+ Research Modules — Structured Learning
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            From first principles to working prototype. Every course includes lab guides, problem sets, and reference materials.{" "}
            <span style={{ color: "#00ff66", fontWeight: "900" }}>New course drops every 100 members. 🔥</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {COURSES.map((course, i) => (
            <Course3DCard key={i} course={course} />
          ))}
        </div>

        {/* Drop countdown bar */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "linear-gradient(90deg, rgba(255,100,0,0.15) 0%, rgba(0,0,0,0.5) 100%)",
            border: "2px solid #ff6600",
            boxShadow: "0 0 40px rgba(255,100,0,0.25)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="font-black text-white text-base">NEW COURSE DROP — At 100 Members</p>
                <p style={{ color: "#ff6600" }} className="text-sm font-bold">Hydromagnetopropulsion Advanced Lab Series — UNRELEASED</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="font-black text-3xl" style={{ color: "#ff6600", textShadow: "0 0 20px #ff6600" }}>97</p>
                <p className="text-xs text-gray-500">Current Members</p>
              </div>
              <div className="text-center">
                <p className="font-black text-3xl text-white">/</p>
              </div>
              <div className="text-center">
                <p className="font-black text-3xl text-white">100</p>
                <p className="text-xs text-gray-500">Needed to Drop</p>
              </div>
              <Link
                to="/subscribe"
                className="flex items-center gap-2 px-5 py-2 rounded-xl font-black text-sm flex-shrink-0"
                style={{ background: "#ff6600", color: "#000", boxShadow: "0 0 20px rgba(255,100,0,0.5)" }}
              >
                Trigger Drop <ChevronRight size={14} />
              </Link>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4 h-2 rounded-full bg-gray-800">
            <div
              className="h-2 rounded-full"
              style={{
                width: "97%",
                background: "linear-gradient(90deg, #ff6600, #ffcc00)",
                boxShadow: "0 0 10px #ff6600",
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-600">0</span>
            <span className="text-xs" style={{ color: "#ff6600", fontWeight: "900" }}>⚡ 3 spots left to unlock the drop!</span>
            <span className="text-xs text-gray-600">100</span>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/subscribe"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-black text-base"
            style={{
              background: "linear-gradient(90deg, #ff6600, #ff3300)",
              color: "#fff",
              boxShadow: "0 0 40px rgba(255,100,0,0.5), 0 8px 30px rgba(0,0,0,0.5)",
            }}
          >
            <GraduationCap size={18} /> Access All Courses — Join Now
          </Link>
        </div>
      </div>
    </section>
  );
}