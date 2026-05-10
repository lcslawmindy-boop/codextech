// Aethon Apex IP OS — Left Navigation Rail
import { Link } from "react-router-dom";

const NAV_SECTIONS = [
  {
    label: "INTELLIGENCE",
    items: [
      { icon: "⬡", label: "Graph", path: "/ip-network" },
      { icon: "🧠", label: "AI OS", path: "/ai-os" },
      { icon: "📡", label: "Monitor", path: "/monitoring" },
    ],
  },
  {
    label: "IP SUITE",
    items: [
      { icon: "⚡", label: "Inventions", path: "/invention-plans" },
      { icon: "🛡", label: "Patent Hub", path: "/patent-hub" },
      { icon: "📚", label: "Prior Art", path: "/prior-art" },
      { icon: "✍", label: "Draft", path: "/patent-drafting-wizard" },
      { icon: "🔍", label: "FTO", path: "/fto-analysis" },
    ],
  },
  {
    label: "WORKSPACE",
    items: [
      { icon: "📋", label: "Planner", path: "/project-planner" },
      { icon: "🤖", label: "AI Research", path: "/ai-research" },
      { icon: "🔬", label: "Lab", path: "/research-lab" },
      { icon: "📊", label: "Valuation", path: "/valuation" },
    ],
  },
  {
    label: "PLATFORM",
    items: [
      { icon: "🎛", label: "Dashboard", path: "/member-dashboard" },
      { icon: "💎", label: "Pricing", path: "/pricing" },
      { icon: "⚙️", label: "Settings", path: "/account" },
    ],
  },
];

export default function ApexLeftNav({ currentPath }) {
  const isActive = (path) => currentPath === path || currentPath.startsWith(path + "/");

  return (
    <nav style={{
      width: 64,
      height: "100%",
      background: "#0A1120",
      borderRight: "1px solid rgba(0,229,255,0.10)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 12,
      paddingBottom: 16,
      gap: 0,
      flexShrink: 0,
      overflowY: "auto",
      overflowX: "hidden",
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: 36, height: 36,
          background: "linear-gradient(135deg, #00E5FF, #9C40FF)",
          borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16,
          boxShadow: "0 0 20px rgba(0,229,255,0.3)",
        }}>⬡</div>
      </div>

      {NAV_SECTIONS.map((section) => (
        <div key={section.label} style={{ width: "100%", marginBottom: 8 }}>
          <div style={{
            fontSize: 8, letterSpacing: "0.12em", color: "#2A3A5A",
            textAlign: "center", padding: "6px 0 4px", fontWeight: 700, textTransform: "uppercase",
          }}>{section.label.slice(0, 4)}</div>
          {section.items.map(item => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.label}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 2, padding: "8px 0", width: "100%",
                  textDecoration: "none", cursor: "pointer",
                  position: "relative",
                  background: active ? "rgba(0,229,255,0.08)" : "transparent",
                  borderRight: active ? "2px solid #00E5FF" : "2px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 16, lineHeight: 1, filter: active ? "drop-shadow(0 0 6px #00E5FF)" : "none" }}>
                  {item.icon}
                </span>
                <span style={{
                  fontSize: 9, color: active ? "#00E5FF" : "#4A5A7A",
                  fontWeight: active ? 700 : 500, letterSpacing: "0.04em",
                }}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}