// Aethon Apex IP OS — Right Intelligence Slide-Out Panel
import { useState, useEffect } from "react";
import { X, TrendingUp, AlertTriangle, Zap, Activity, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const MOCK_EVENTS = [
  { type: "threat", icon: "🔴", text: "Patent filing detected: US2024/038821 — EMF resonance overlap", time: "2m ago" },
  { type: "opportunity", icon: "🟢", text: "Market gap identified: Bioelectromagnetic sensors +34% YoY", time: "8m ago" },
  { type: "insight", icon: "🔵", text: "Hybrid concept score >90 — MEG × TRD-1 fusion viable", time: "15m ago" },
  { type: "alert", icon: "🟡", text: "Prior art match confidence: 67% — Bearden US5,226,779", time: "22m ago" },
  { type: "opportunity", icon: "🟢", text: "SBIR Phase II window open — DOD Energy program", time: "1h ago" },
];

const INTEL_TABS = ["Events", "Insights", "Threats"];

export default function ApexIntelPanel({ open, onClose }) {
  const [tab, setTab] = useState("Events");
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (open) {
      base44.entities.MonitoringAlert.list("-created_date", 5)
        .then(setAlerts)
        .catch(() => setAlerts([]));
    }
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(5,10,15,0.3)" }}
        />
      )}

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100dvh",
        width: 340,
        background: "#0A1120",
        borderLeft: "1px solid rgba(0,229,255,0.15)",
        boxShadow: "-8px 0 48px rgba(0,0,0,0.6), -1px 0 0 rgba(0,229,255,0.05)",
        zIndex: 201,
        display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 16px 12px",
          borderBottom: "1px solid rgba(0,229,255,0.10)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Zap size={14} color="#00E5FF" />
              <span style={{ color: "#F0F4FF", fontWeight: 700, fontSize: 13, letterSpacing: "0.04em" }}>
                INTELLIGENCE FEED
              </span>
            </div>
            <div style={{ fontSize: 11, color: "#4A5A7A", marginTop: 2 }}>Real-time IP intelligence stream</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#4A5A7A" }}>
            <X size={16} />
          </button>
        </div>

        {/* KPI Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, borderBottom: "1px solid rgba(0,229,255,0.08)" }}>
          {[
            { label: "Threats", val: "3", color: "#FF3366" },
            { label: "Signals", val: "12", color: "#00E5FF" },
            { label: "Leads", val: "5", color: "#00FFA3" },
          ].map(k => (
            <div key={k.label} style={{ padding: "10px 0", textAlign: "center", borderRight: "1px solid rgba(0,229,255,0.06)" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: k.color }}>{k.val}</div>
              <div style={{ fontSize: 10, color: "#4A5A7A", letterSpacing: "0.06em" }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(0,229,255,0.08)" }}>
          {INTEL_TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "9px 0", background: "none", border: "none",
              borderBottom: tab === t ? "2px solid #00E5FF" : "2px solid transparent",
              color: tab === t ? "#00E5FF" : "#4A5A7A",
              fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", cursor: "pointer",
              textTransform: "uppercase",
            }}>{t}</button>
          ))}
        </div>

        {/* Event Stream */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
          {MOCK_EVENTS.map((ev, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, padding: "10px 16px",
              borderBottom: "1px solid rgba(0,229,255,0.04)",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,229,255,0.04)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{ev.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 12, color: "#C0CDE0", lineHeight: 1.5 }}>{ev.text}</p>
                <p style={{ margin: "3px 0 0", fontSize: 10, color: "#4A5A7A" }}>{ev.time}</p>
              </div>
              <ChevronRight size={12} color="#2A3A5A" style={{ flexShrink: 0, marginTop: 4 }} />
            </div>
          ))}

          {/* Live alerts from DB */}
          {alerts.length > 0 && (
            <div style={{ padding: "12px 16px 4px" }}>
              <div style={{ fontSize: 10, color: "#4A5A7A", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 8 }}>
                LIVE ALERTS
              </div>
              {alerts.map(a => (
                <div key={a.id} style={{
                  background: "rgba(255,51,102,0.06)", border: "1px solid rgba(255,51,102,0.15)",
                  borderRadius: 8, padding: "8px 12px", marginBottom: 6,
                }}>
                  <div style={{ fontSize: 11, color: "#F0F4FF", fontWeight: 600 }}>{a.title}</div>
                  <div style={{ fontSize: 10, color: "#4A5A7A", marginTop: 2 }}>{a.risk_level?.toUpperCase()} risk · {a.source_type}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 16px",
          borderTop: "1px solid rgba(0,229,255,0.08)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 10, color: "#4A5A7A" }}>Last sync: just now</span>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#00FFA3", boxShadow: "0 0 8px #00FFA3",
          }} />
        </div>
      </div>
    </>
  );
}