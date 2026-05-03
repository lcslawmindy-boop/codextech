import { useState } from "react";
import { Lock, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Device3DCard({ device, index }) {
  const [hovered, setHovered] = useState(false);
  const [rot, setRot] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setRot({ x: dy * -12, y: dx * 12 });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setRot({ x: 0, y: 0 });
  };

  const neonColor = device.neon || "#00ff66";
  const neonOrange = "#ff6600";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "800px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) ${hovered ? "scale(1.04)" : "scale(1)"}`,
          transition: "transform 0.15s ease",
          background: "linear-gradient(135deg, #050505 0%, #0a0f0a 100%)",
          border: `2px solid ${neonColor}`,
          borderRadius: "16px",
          boxShadow: hovered
            ? `0 0 40px ${neonColor}99, 0 0 80px ${neonColor}44, 0 20px 60px rgba(0,0,0,0.8), inset 0 0 30px ${neonColor}11`
            : `0 0 20px ${neonColor}55, 0 8px 30px rgba(0,0,0,0.6), inset 0 0 15px ${neonColor}08`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* 3D Device Visual */}
        <div
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${neonColor}22 0%, #000 70%)`,
            height: "160px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: `1px solid ${neonColor}44`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated rings */}
          {[1, 2, 3].map((r) => (
            <div
              key={r}
              style={{
                position: "absolute",
                width: `${r * 55}px`,
                height: `${r * 55}px`,
                borderRadius: "50%",
                border: `1px solid ${neonColor}${hovered ? "88" : "33"}`,
                animation: `spin3d ${3 + r}s linear infinite`,
                transition: "opacity 0.3s",
              }}
            />
          ))}
          {/* Center icon */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${neonColor}33 0%, #000 70%)`,
              border: `2px solid ${neonColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              boxShadow: `0 0 30px ${neonColor}88`,
              zIndex: 1,
            }}
          >
            {device.icon}
          </div>

          {/* Corner label */}
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: `${neonColor}22`,
              border: `1px solid ${neonColor}88`,
              borderRadius: "6px",
              padding: "2px 8px",
              fontSize: "9px",
              fontWeight: "900",
              color: neonColor,
              letterSpacing: "0.1em",
              textShadow: `0 0 8px ${neonColor}`,
            }}
          >
            {device.tag}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "16px" }}>
          <h3
            style={{
              color: "#fff",
              fontWeight: "900",
              fontSize: "14px",
              marginBottom: "4px",
              textShadow: `0 0 10px ${neonColor}55`,
            }}
          >
            {device.name}
          </h3>
          <p style={{ color: "#aaa", fontSize: "11px", marginBottom: "10px", lineHeight: "1.5" }}>
            {device.desc}
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            {device.stats.map((s, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: "rgba(0,0,0,0.5)",
                  border: `1px solid ${neonColor}33`,
                  borderRadius: "6px",
                  padding: "4px 6px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: neonColor, fontSize: "11px", fontWeight: "900" }}>{s.val}</p>
                <p style={{ color: "#666", fontSize: "9px" }}>{s.label}</p>
              </div>
            ))}
          </div>

          <Link
            to={device.href || "/invention-plans"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "8px",
              borderRadius: "8px",
              background: `linear-gradient(90deg, ${neonColor}22, ${neonOrange}22)`,
              border: `1px solid ${neonColor}66`,
              color: neonColor,
              fontSize: "11px",
              fontWeight: "900",
              textDecoration: "none",
              letterSpacing: "0.05em",
            }}
          >
            <Lock size={11} /> View Build Plan →
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes spin3d {
          from { transform: rotate(0deg) rotateX(60deg); }
          to { transform: rotate(360deg) rotateX(60deg); }
        }
      `}</style>
    </div>
  );
}