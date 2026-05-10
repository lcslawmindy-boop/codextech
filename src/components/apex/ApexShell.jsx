// Aethon Apex IP OS — Unified Shell Wrapper
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ApexLeftNav from "./ApexLeftNav";
import ApexTopBar from "./ApexTopBar";
import ApexIntelPanel from "./ApexIntelPanel";

export default function ApexShell() {
  const [intelOpen, setIntelOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const location = useLocation();

  // Global CTRL+K shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(v => !v);
      }
      if (e.key === "Escape") { setCmdOpen(false); setIntelOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="apex-shell" style={{
      display: "flex",
      height: "100dvh",
      width: "100vw",
      overflow: "hidden",
      background: "#050A0F",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Left Nav */}
      <ApexLeftNav currentPath={location.pathname} />

      {/* Main workspace */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <ApexTopBar onCmdOpen={() => setCmdOpen(true)} onIntelToggle={() => setIntelOpen(v => !v)} intelOpen={intelOpen} />
        <main style={{ flex: 1, overflow: "auto", position: "relative" }}>
          <Outlet />
        </main>
      </div>

      {/* Right Intelligence Panel */}
      <ApexIntelPanel open={intelOpen} onClose={() => setIntelOpen(false)} />

      {/* Command Palette */}
      {cmdOpen && <ApexCommandPalette onClose={() => setCmdOpen(false)} />}
    </div>
  );
}

// ── Inline Command Palette ─────────────────────────────────────────────────────
const CMD_ITEMS = [
  { label: "IP Network Graph", icon: "⬡", path: "/ip-network" },
  { label: "Invention Plans", icon: "⚡", path: "/invention-plans" },
  { label: "Project Planner", icon: "📋", path: "/project-planner" },
  { label: "Patent Hub", icon: "🛡", path: "/patent-hub" },
  { label: "Prior Art Archive", icon: "📚", path: "/prior-art" },
  { label: "AI Research Assistant", icon: "🤖", path: "/ai-research" },
  { label: "Patent Drafting Wizard", icon: "✍", path: "/patent-drafting-wizard" },
  { label: "Member Dashboard", icon: "🎛", path: "/member-dashboard" },
  { label: "Pricing", icon: "💎", path: "/pricing" },
  { label: "AI Operating System", icon: "🧠", path: "/ai-os" },
];

function ApexCommandPalette({ onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = CMD_ITEMS.filter(i =>
    i.label.toLowerCase().includes(query.toLowerCase())
  );

  const go = (path) => { navigate(path); onClose(); };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(5,10,15,0.85)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "15vh",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 560,
          background: "#0F1A2E",
          border: "1px solid rgba(0,229,255,0.25)",
          borderRadius: 16,
          boxShadow: "0 24px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,229,255,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Search input */}
        <div style={{ display: "flex", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid rgba(0,229,255,0.10)" }}>
          <span style={{ color: "#00E5FF", marginRight: 10, fontSize: 16 }}>⌘</span>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search modules, tools, pages..."
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "#F0F4FF", fontSize: 15, fontFamily: "inherit",
            }}
          />
          <span style={{ color: "#4A5A7A", fontSize: 11, fontFamily: "monospace" }}>ESC</span>
        </div>
        {/* Results */}
        <div style={{ maxHeight: 360, overflowY: "auto", padding: "6px 0" }}>
          {filtered.map(item => (
            <button
              key={item.path}
              onClick={() => go(item.path)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                width: "100%", padding: "10px 18px",
                background: "transparent", border: "none", cursor: "pointer",
                color: "#F0F4FF", fontSize: 14, textAlign: "left",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,229,255,0.07)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontSize: 17, width: 24, textAlign: "center" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: "20px", textAlign: "center", color: "#4A5A7A", fontSize: 13 }}>
              No results found
            </div>
          )}
        </div>
        <div style={{ padding: "10px 18px", borderTop: "1px solid rgba(0,229,255,0.08)", display: "flex", gap: 16 }}>
          {[["↑↓", "navigate"], ["↵", "open"], ["ESC", "close"]].map(([k, v]) => (
            <span key={k} style={{ fontSize: 11, color: "#4A5A7A", display: "flex", alignItems: "center", gap: 4 }}>
              <kbd style={{ background: "#162038", border: "1px solid #1E2D4A", borderRadius: 4, padding: "1px 5px", color: "#8899BB", fontFamily: "monospace" }}>{k}</kbd>
              {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}