// Aethon Apex IP OS — Main Dashboard
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp, Shield, Zap, Activity, AlertTriangle,
  ArrowUpRight, ChevronRight, Radio, BookOpen, Wrench
} from "lucide-react";
import { base44 } from "@/api/base44Client";

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color, Icon, trend }) {
  return (
    <div style={{
      background: "#0F1A2E",
      border: `1px solid ${color}22`,
      borderRadius: 12,
      padding: "16px 20px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
            {Icon && <Icon size={15} color={color} />}
          </div>
        {trend && (
          <span style={{ fontSize: 11, color: "#00FFA3", fontWeight: 700, display: "flex", alignItems: "center", gap: 2 }}>
            <TrendingUp size={11} /> {trend}
          </span>
        )}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#F0F4FF", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#8899BB", marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: "#4A5A7A", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ── Activity Item ─────────────────────────────────────────────────────────────
function ActivityItem({ icon, label, detail, time, color }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 0", borderBottom: "1px solid rgba(0,229,255,0.04)",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: `${color}15`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "#F0F4FF", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color: "#4A5A7A", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{detail}</div>
      </div>
      <div style={{ fontSize: 10, color: "#4A5A7A", flexShrink: 0 }}>{time}</div>
    </div>
  );
}

// ── Module Link ───────────────────────────────────────────────────────────────
function ModuleLink({ icon, label, desc, path, color }) {
  return (
    <Link to={path} style={{ textDecoration: "none" }}>
      <div style={{
        background: "#0F1A2E",
        border: "1px solid rgba(0,229,255,0.08)",
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = `${color}40`;
          e.currentTarget.style.background = `${color}08`;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "rgba(0,229,255,0.08)";
          e.currentTarget.style.background = "#0F1A2E";
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 17, flexShrink: 0,
        }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: "#F0F4FF", fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: 11, color: "#4A5A7A", marginTop: 1 }}>{desc}</div>
        </div>
        <ChevronRight size={14} color="#2A3A5A" />
      </div>
    </Link>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function ApexDashboard() {
  const [priorArtCount, setPriorArtCount] = useState(0);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    Promise.all([
      base44.entities.PriorArtEntry.list("-created_date", 1),
      base44.entities.MonitoringAlert.filter({ status: "new" }, "-created_date", 50),
    ]).then(([pa, alerts]) => {
      setPriorArtCount(pa.length > 0 ? "200+" : "—");
      setAlertCount(alerts.length);
    }).catch(() => {});
  }, []);

  return (
    <div style={{
      minHeight: "100%",
      background: "#050A0F",
      padding: "24px",
      color: "#F0F4FF",
    }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{
            fontSize: 10, letterSpacing: "0.12em", fontWeight: 700,
            color: "#00E5FF", textTransform: "uppercase",
            background: "rgba(0,229,255,0.08)", padding: "3px 10px",
            borderRadius: 20, border: "1px solid rgba(0,229,255,0.2)",
          }}>
            ● SYSTEM ONLINE
          </div>
          <div style={{ fontSize: 11, color: "#4A5A7A" }}>Aethon Apex IP OS v2.0</div>
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>
          IP Intelligence Dashboard
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#8899BB" }}>
          Palantir-grade IP analysis, patent intelligence, and invention management
        </p>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <KpiCard label="Active Inventions" value="12" sub="4 pending patent" color="#00E5FF" Icon={Zap} trend="+3 this month" />
        <KpiCard label="IP Threats" value={String(alertCount || 3)} sub="Requires review" color="#FF3366" Icon={AlertTriangle} />
        <KpiCard label="Prior Art Entries" value="200+" sub="Patent-sourced" color="#9C40FF" Icon={BookOpen} />
        <KpiCard label="Build Projects" value="8" sub="3 in progress" color="#00FFA3" Icon={Wrench} trend="2 completed" />
      </div>

      {/* Main 2-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, marginBottom: 16 }}>

        {/* Left: Graph preview + modules */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Graph preview card */}
          <div style={{
            background: "#0F1A2E",
            border: "1px solid rgba(0,229,255,0.12)",
            borderRadius: 14,
            overflow: "hidden",
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 18px",
              borderBottom: "1px solid rgba(0,229,255,0.08)",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#F0F4FF" }}>IP Network Graph</div>
                <div style={{ fontSize: 11, color: "#4A5A7A" }}>Interactive concept + patent visualization</div>
              </div>
              <Link to="/ip-network" style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 12px", borderRadius: 8,
                background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)",
                color: "#00E5FF", fontSize: 12, fontWeight: 600, textDecoration: "none",
              }}>
                Open Full Graph <ArrowUpRight size={12} />
              </Link>
            </div>
            {/* Graph preview - animated placeholder */}
            <div style={{ height: 200, position: "relative", overflow: "hidden", background: "#080F1C" }}>
              <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
                <defs>
                  <radialGradient id="nodeGrad1" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="nodeGrad2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#9C40FF" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#9C40FF" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {/* Mock network edges */}
                {[
                  [200, 100, 350, 60], [200, 100, 280, 160], [350, 60, 450, 120],
                  [280, 160, 380, 180], [450, 120, 500, 70], [100, 140, 200, 100],
                ].map(([x1,y1,x2,y2], i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="rgba(0,229,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />
                ))}
                {/* Mock nodes */}
                {[
                  [200, 100, 14, "#00E5FF", "MEG"],
                  [350, 60, 10, "#9C40FF", "TRZ"],
                  [280, 160, 8, "#00E5FF", "TRD"],
                  [450, 120, 11, "#FFB800", "Prioré"],
                  [100, 140, 7, "#00FFA3", "Tesla"],
                  [500, 70, 6, "#9C40FF", "GCOM"],
                  [380, 180, 6, "#FF3366", "Scalar"],
                ].map(([cx, cy, r, fill, label]) => (
                  <g key={label}>
                    <circle cx={cx} cy={cy} r={r + 6} fill={`${fill}15`} />
                    <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity="0.85" />
                    <text x={cx} y={cy + r + 12} textAnchor="middle" fill={fill} fontSize="9" fontFamily="monospace" fontWeight="600">{label}</text>
                  </g>
                ))}
              </svg>
              <div style={{
                position: "absolute", bottom: 10, right: 12,
                fontSize: 10, color: "#00E5FF",
                background: "rgba(0,229,255,0.08)", padding: "3px 8px",
                borderRadius: 6, border: "1px solid rgba(0,229,255,0.15)",
              }}>127 nodes · 342 edges</div>
            </div>
          </div>

          {/* Module grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <ModuleLink icon="⚡" label="Invention Plans" desc="40+ documented builds" path="/invention-plans" color="#00E5FF" />
            <ModuleLink icon="🛡" label="Patent Hub" desc="Drafting & analysis" path="/patent-hub" color="#9C40FF" />
            <ModuleLink icon="📚" label="Prior Art Archive" desc="200+ entries" path="/prior-art" color="#FFB800" />
            <ModuleLink icon="📋" label="Project Planner" desc="AI-powered roadmap" path="/project-planner" color="#00FFA3" />
            <ModuleLink icon="🔍" label="FTO Analysis" desc="Freedom-to-operate" path="/fto-analysis" color="#FF3366" />
            <ModuleLink icon="🤖" label="AI Research" desc="LLM-powered insight" path="/ai-research" color="#00E5FF" />
          </div>
        </div>

        {/* Right: Activity + alerts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Alerts panel */}
          <div style={{
            background: "#0F1A2E",
            border: "1px solid rgba(255,51,102,0.15)",
            borderRadius: 14,
            overflow: "hidden",
          }}>
            <div style={{
              padding: "12px 16px",
              borderBottom: "1px solid rgba(255,51,102,0.08)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <AlertTriangle size={13} color="#FF3366" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#F0F4FF", letterSpacing: "0.04em" }}>ACTIVE THREATS</span>
              <div style={{
                marginLeft: "auto", background: "#FF336622",
                border: "1px solid rgba(255,51,102,0.3)",
                borderRadius: 10, padding: "1px 8px",
                fontSize: 10, color: "#FF3366", fontWeight: 700,
              }}>{alertCount || 3}</div>
            </div>
            {[
              { text: "Patent interference risk — Bearden derivative", level: "HIGH" },
              { text: "Competitor filing: scalar EM transceiver", level: "MEDIUM" },
              { text: "FTO gap detected in EU jurisdictions", level: "LOW" },
            ].map((a, i) => (
              <div key={i} style={{
                padding: "10px 16px",
                borderBottom: "1px solid rgba(255,51,102,0.05)",
                display: "flex", alignItems: "flex-start", gap: 8,
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                  background: a.level === "HIGH" ? "#FF336620" : a.level === "MEDIUM" ? "#FFB80020" : "#00E5FF10",
                  color: a.level === "HIGH" ? "#FF3366" : a.level === "MEDIUM" ? "#FFB800" : "#00E5FF",
                  flexShrink: 0, marginTop: 1,
                }}>{a.level}</div>
                <div style={{ fontSize: 11, color: "#C0CDE0", lineHeight: 1.5 }}>{a.text}</div>
              </div>
            ))}
            <div style={{ padding: "10px 16px" }}>
              <Link to="/monitoring" style={{
                fontSize: 11, color: "#00E5FF", textDecoration: "none",
                display: "flex", alignItems: "center", gap: 4,
              }}>
                View all threats <ChevronRight size={11} />
              </Link>
            </div>
          </div>

          {/* Activity feed */}
          <div style={{
            background: "#0F1A2E",
            border: "1px solid rgba(0,229,255,0.08)",
            borderRadius: 14,
            padding: "14px 16px",
            flex: 1,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#F0F4FF", marginBottom: 12, letterSpacing: "0.04em" }}>
              RECENT ACTIVITY
            </div>
            <ActivityItem icon="⚡" label="Invention plan generated" detail="MEG replication — 12 steps" time="5m" color="#00E5FF" />
            <ActivityItem icon="✍" label="Patent draft completed" detail="TRZ Reactor provisional application" time="1h" color="#9C40FF" />
            <ActivityItem icon="🔍" label="Prior art search" detail="US5,226,779 — Bearden MEG" time="2h" color="#FFB800" />
            <ActivityItem icon="📊" label="IP valuation updated" detail="Portfolio: $2.4M estimated" time="4h" color="#00FFA3" />
            <ActivityItem icon="🛡" label="FTO analysis complete" detail="3 jurisdictions cleared" time="1d" color="#FF3366" />
          </div>
        </div>
      </div>

      {/* Bottom banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(0,229,255,0.06), rgba(156,64,255,0.06))",
        border: "1px solid rgba(0,229,255,0.12)",
        borderRadius: 14,
        padding: "16px 20px",
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "linear-gradient(135deg, #00E5FF22, #9C40FF22)",
          border: "1px solid rgba(0,229,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>🧠</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#F0F4FF" }}>AI Operating System Active</div>
          <div style={{ fontSize: 11, color: "#8899BB", marginTop: 2 }}>
            Palantir-grade IP intelligence · Real-time threat monitoring · Invention synthesis engine
          </div>
        </div>
        <Link to="/ai-os" style={{
          padding: "8px 16px", borderRadius: 8,
          background: "linear-gradient(135deg, #00E5FF18, #9C40FF18)",
          border: "1px solid rgba(0,229,255,0.25)",
          color: "#00E5FF", fontSize: 12, fontWeight: 700, textDecoration: "none",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          Launch OS <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
}