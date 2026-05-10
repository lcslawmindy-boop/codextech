// Aethon Apex IP OS — Top Command Bar
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Zap, Radio, ChevronRight } from "lucide-react";

const BREADCRUMB_MAP = {
  "/ip-network": ["Intelligence", "IP Network Graph"],
  "/ai-os": ["Intelligence", "AI Operating System"],
  "/monitoring": ["Intelligence", "Threat Monitor"],
  "/invention-plans": ["IP Suite", "Invention Plans"],
  "/patent-hub": ["IP Suite", "Patent Hub"],
  "/prior-art": ["IP Suite", "Prior Art Archive"],
  "/patent-drafting-wizard": ["IP Suite", "Patent Drafting Wizard"],
  "/fto-analysis": ["IP Suite", "FTO Analysis"],
  "/project-planner": ["Workspace", "Project Planner"],
  "/ai-research": ["Workspace", "AI Research"],
  "/research-lab": ["Workspace", "Research Lab"],
  "/valuation": ["Workspace", "Valuation"],
  "/member-dashboard": ["Platform", "Dashboard"],
  "/pricing": ["Platform", "Pricing"],
  "/account": ["Platform", "Settings"],
};

export default function ApexTopBar({ onCmdOpen, onIntelToggle, intelOpen }) {
  const location = useLocation();
  const crumbs = BREADCRUMB_MAP[location.pathname] || ["Aethon Apex IP", "OS"];

  return (
    <header style={{
      height: 52,
      background: "rgba(10,17,32,0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(0,229,255,0.10)",
      display: "flex", alignItems: "center",
      padding: "0 16px",
      gap: 12,
      flexShrink: 0,
      zIndex: 100,
    }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
        <span style={{ color: "#4A5A7A", fontSize: 12 }}>{crumbs[0]}</span>
        <ChevronRight size={12} color="#2A3A5A" />
        <span style={{ color: "#F0F4FF", fontSize: 12, fontWeight: 600 }}>{crumbs[1]}</span>
      </div>

      {/* Command Bar trigger */}
      <button
        onClick={onCmdOpen}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(22,32,56,0.8)",
          border: "1px solid rgba(0,229,255,0.15)",
          borderRadius: 8,
          padding: "6px 14px",
          color: "#8899BB", fontSize: 13, cursor: "pointer",
          transition: "all 0.15s",
          width: 220,
        }}
      >
        <span style={{ fontSize: 12 }}>⌘</span>
        <span style={{ flex: 1, textAlign: "left" }}>Search or jump to...</span>
        <kbd style={{
          background: "#0A1120", border: "1px solid #1E2D4A",
          borderRadius: 4, padding: "1px 6px",
          fontSize: 10, fontFamily: "monospace", color: "#4A5A7A",
        }}>K</kbd>
      </button>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Live indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#00FFA3",
            boxShadow: "0 0 8px #00FFA3",
            animation: "pulse 2s infinite",
          }} />
          <span style={{ fontSize: 10, color: "#00FFA3", fontWeight: 700, letterSpacing: "0.06em" }}>LIVE</span>
        </div>

        {/* Intelligence panel toggle */}
        <button
          onClick={onIntelToggle}
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: intelOpen ? "rgba(0,229,255,0.15)" : "rgba(22,32,56,0.6)",
            border: intelOpen ? "1px solid rgba(0,229,255,0.4)" : "1px solid rgba(0,229,255,0.1)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
            color: intelOpen ? "#00E5FF" : "#4A5A7A",
          }}
        >
          <Zap size={14} />
        </button>

        {/* Alerts bell */}
        <button style={{
          width: 32, height: 32, borderRadius: 8,
          background: "rgba(22,32,56,0.6)",
          border: "1px solid rgba(0,229,255,0.1)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <Bell size={14} color="#8899BB" />
          <div style={{
            position: "absolute", top: 6, right: 6,
            width: 6, height: 6, borderRadius: "50%",
            background: "#FF3366", border: "1px solid #050A0F",
          }} />
        </button>

        {/* Avatar */}
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "linear-gradient(135deg, #00E5FF22, #9C40FF22)",
          border: "1px solid rgba(0,229,255,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: "#00E5FF", cursor: "pointer",
        }}>A</div>
      </div>
    </header>
  );
}