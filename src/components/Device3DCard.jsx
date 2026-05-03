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
          background: "#000",
          border: `3px solid ${neonColor}`,
          borderRadius: "16px",
          boxShadow: hovered
            ? `0 0 60px ${neonColor}99, 0 0 120px ${neonColor}44, 0 20px 60px rgba(0,0,0,0.95)`
            : `0 0 30px ${neonColor}66, 0 0 60px ${neonColor}22, 0 8px 30px rgba(0,0,0,0.9)`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* 3D Device Visual */}
        <div
          style={{
            background: "#000",
            height: "160px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: `3px solid ${neonColor}`,
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
              top: "10px",
              right: "10px",
              background: "#000",
              border: `2px solid ${neonColor}`,
              borderRadius: "6px",
              padding: "3px 10px",
              fontSize: "11px",
              fontWeight: "900",
              color: neonColor,
              letterSpacing: "0.1em",
              textShadow: `0 0 10px ${neonColor}`,
              boxShadow: `0 0 12px ${neonColor}66`,
            }}
          >
            {device.tag}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "18px 20px", background: "#000" }}>
          <h3
            style={{
              color: "#fff",
              fontWeight: "900",
              fontSize: "17px",
              marginBottom: "8px",
              textShadow: `0 0 16px ${neonColor}66`,
            }}
          >
            {device.name}
          </h3>
          <p style={{ color: "#bbb", fontSize: "13px", marginBottom: "12px", lineHeight: "1.6", fontWeight: "600" }}>
            {device.desc}
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
            {device.stats.map((s, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: "#111",
                  border: `2px solid ${neonColor}55`,
                  borderRadius: "8px",
                  padding: "6px 4px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: neonColor, fontSize: "14px", fontWeight: "900" }}>{s.val}</p>
                <p style={{ color: "#777", fontSize: "11px", fontWeight: "700" }}>{s.label}</p>
              </div>
            ))}
          </div>

          <Link
            to={device.href || "/invention-plans"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px",
              borderRadius: "10px",
              background: "#000",
              border: `2px solid ${neonColor}`,
              color: neonColor,
              fontSize: "14px",
              fontWeight: "900",
              textDecoration: "none",
              letterSpacing: "0.05em",
              boxShadow: `0 0 16px ${neonColor}44`,
            }}
          >
            <Lock size={14} /> View Build Plan →
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