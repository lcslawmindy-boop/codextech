// Aethon Apex IP OS — Start/Hero Page
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Zap, Shield, BookOpen, Radio, ChevronDown } from "lucide-react";
import { base44 } from "@/api/base44Client";

// Countdown for urgency
const DEADLINE_KEY = "apex_os_deadline_v1";
function getDeadline() {
  let d = localStorage.getItem(DEADLINE_KEY);
  if (!d) { d = (Date.now() + 72 * 3600 * 1000).toString(); localStorage.setItem(DEADLINE_KEY, d); }
  return parseInt(d);
}
function useCountdown() {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    const dl = getDeadline();
    const tick = () => setLeft(Math.max(0, dl - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = n => String(n).padStart(2, "0");
  const h = Math.floor(left / 3600000), m = Math.floor((left % 3600000) / 60000), s = Math.floor((left % 60000) / 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

const FEATURES = [
  { icon: "⬡", label: "IP Network Graph", desc: "D3 force simulation with 127 patent nodes, 342 edges, neon overlays" },
  { icon: "🧠", label: "AI Intelligence Layer", desc: "Real-time threat monitoring, opportunity detection, entity linking" },
  { icon: "⚡", label: "Invention Plans", desc: "40+ documented builds with BOM, schematics, and claim generators" },
  { icon: "🛡", label: "Patent Suite", desc: "USPTO-formatted drafting, FTO analysis, prior art cross-reference" },
  { icon: "📋", label: "Project Planner", desc: "Gantt timelines, AI milestones, dependency tracking" },
  { icon: "💎", label: "Commercialization Engine", desc: "Investor CRM, IP valuation, acquisition pipeline" },
];

const TIERS = [
  { name: "Explorer", price: 29, color: "#00E5FF", features: ["Research Archive", "Concept Graph", "Glossary"], badge: null },
  { name: "Research Lab", price: 49, color: "#9C40FF", features: ["5 Courses + 5 Build Plans", "Forum Access", "Monthly Drops"], badge: "POPULAR", highlight: true },
  { name: "Pro Builder", price: 149, color: "#FFB800", features: ["10 Courses + 10 Builds", "AI Patent Suite", "Invention Forge"], badge: "BEST VALUE" },
  { name: "Enterprise", price: 497, color: "#00FFA3", features: ["Unlimited Everything", "White-label Rights", "VDR Access", "Priority Support"], badge: "ENTERPRISE" },
];

function PricingCard({ tier, annual }) {
  const [loading, setLoading] = useState(false);
  const price = annual ? Math.round(tier.price * 0.8) : tier.price;

  const handleBuy = async () => {
    if (window.self !== window.top) { alert("Checkout only works from the published app."); return; }
    setLoading(true);
    try {
      const res = await base44.functions.invoke("createCheckoutSession", {
        title: `Aethon Apex IP — ${tier.name}`,
        priceInCents: annual ? Math.round(tier.price * 12 * 0.8 * 100) : tier.price * 100,
        description: tier.features.join(", "),
        category: "membership",
        successUrl: `${window.location.origin}/member-dashboard`,
        cancelUrl: `${window.location.origin}/start`,
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div style={{
      background: tier.highlight ? "rgba(15,26,46,0.9)" : "#0F1A2E",
      border: `1px solid ${tier.color}${tier.highlight ? "50" : "20"}`,
      borderRadius: 16,
      padding: "24px",
      display: "flex", flexDirection: "column", gap: 16,
      position: "relative", overflow: "hidden",
      boxShadow: tier.highlight ? `0 0 40px ${tier.color}18` : "none",
      transform: tier.highlight ? "scale(1.02)" : "scale(1)",
    }}>
      {tier.badge && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          padding: "5px 0", textAlign: "center",
          background: tier.color, fontSize: 10, fontWeight: 800,
          letterSpacing: "0.12em", color: "#050A0F",
        }}>{tier.badge}</div>
      )}
      <div style={{ marginTop: tier.badge ? 16 : 0 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#F0F4FF" }}>{tier.name}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 8 }}>
          <span style={{ fontSize: 36, fontWeight: 900, color: tier.color }}>${price}</span>
          <span style={{ fontSize: 13, color: "#4A5A7A" }}>/mo</span>
        </div>
        {annual && <div style={{ fontSize: 11, color: "#00FFA3", fontWeight: 600 }}>Save 20% — billed annually</div>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {tier.features.map(f => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#C0CDE0" }}>
            <Check size={12} color={tier.color} />
            {f}
          </div>
        ))}
      </div>
      <button
        onClick={handleBuy}
        disabled={loading}
        style={{
          padding: "12px", borderRadius: 10, border: "none", cursor: "pointer",
          background: tier.highlight ? tier.color : `${tier.color}18`,
          color: tier.highlight ? "#050A0F" : tier.color,
          fontSize: 13, fontWeight: 800,
          transition: "all 0.2s",
        }}
      >
        {loading ? "Processing..." : `Get ${tier.name} →`}
      </button>
    </div>
  );
}

export default function ApexOSHome() {
  const countdown = useCountdown();
  const [annual, setAnnual] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim()) return;
    await base44.entities.NewsletterSubscriber.create({ email: email.trim(), source: "apex_os_start", status: "active" });
    setSubscribed(true);
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#050A0F", color: "#F0F4FF", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Urgency bar */}
      <div style={{
        background: "rgba(255,51,102,0.12)", borderBottom: "1px solid rgba(255,51,102,0.2)",
        padding: "8px 24px", textAlign: "center",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        fontSize: 12, color: "#F0F4FF",
      }}>
        <span style={{ color: "#FF3366" }}>●</span>
        Founding rate expires in <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#FFB800" }}>{countdown}</span>
        — locks at 1,000 members
      </div>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(5,10,15,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,229,255,0.08)",
        padding: "0 24px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg, #00E5FF, #9C40FF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, boxShadow: "0 0 16px rgba(0,229,255,0.3)",
          }}>⬡</div>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#F0F4FF" }}>Aethon Apex IP</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link to="/free-vault" style={{ fontSize: 12, color: "#8899BB", textDecoration: "none", padding: "6px 12px" }}>Free Archive</Link>
          <Link to="/ai-os" style={{ fontSize: 12, color: "#8899BB", textDecoration: "none", padding: "6px 12px" }}>AI OS</Link>
          <a href="#pricing" style={{
            fontSize: 12, fontWeight: 700, color: "#050A0F",
            background: "linear-gradient(135deg, #00E5FF, #9C40FF)",
            padding: "8px 16px", borderRadius: 8, textDecoration: "none",
          }}>Join Platform</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "80px 24px 64px", textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)",
          borderRadius: 20, padding: "5px 14px", marginBottom: 24,
          fontSize: 11, color: "#00E5FF", fontWeight: 700, letterSpacing: "0.1em",
        }}>
          ✦ PALANTIR-GRADE IP INTELLIGENCE PLATFORM
        </div>

        <h1 style={{
          fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900,
          lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 20px",
        }}>
          The Operating System for<br />
          <span style={{
            background: "linear-gradient(135deg, #00E5FF, #9C40FF)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Advanced IP Research
          </span>
        </h1>

        <p style={{ fontSize: 18, color: "#8899BB", lineHeight: 1.6, margin: "0 0 32px", maxWidth: 580, marginLeft: "auto", marginRight: "auto" }}>
          Patent-sourced build plans. AI patent suite. IP network graph. Invention synthesis engine.
          Built for engineers who operate at the edge of physics.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/free-vault" style={{
            padding: "14px 28px", borderRadius: 10,
            background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.25)",
            color: "#00E5FF", fontSize: 14, fontWeight: 700, textDecoration: "none",
          }}>
            Explore Free Archive
          </Link>
          <a href="#pricing" style={{
            padding: "14px 28px", borderRadius: 10,
            background: "linear-gradient(135deg, #00E5FF, #9C40FF)",
            color: "#050A0F", fontSize: 14, fontWeight: 800, textDecoration: "none",
            display: "flex", alignItems: "center", gap: 6,
            boxShadow: "0 4px 24px rgba(0,229,255,0.3)",
          }}>
            Access Full Platform <ArrowRight size={15} />
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 48, flexWrap: "wrap" }}>
          {[["200+", "Research Entries"], ["40+", "Build Plans"], ["5", "AI Tools"], ["$2M+", "IP Valued"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#00E5FF" }}>{v}</div>
              <div style={{ fontSize: 12, color: "#4A5A7A", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* OS Preview */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          background: "#0F1A2E",
          border: "1px solid rgba(0,229,255,0.15)",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(0,229,255,0.05)",
        }}>
          {/* Fake window chrome */}
          <div style={{ background: "#0A1120", padding: "10px 16px", borderBottom: "1px solid rgba(0,229,255,0.08)", display: "flex", alignItems: "center", gap: 6 }}>
            {["#FF3366", "#FFB800", "#00FFA3"].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.8 }} />
            ))}
            <div style={{
              flex: 1, marginLeft: 12, background: "#162038", borderRadius: 4,
              padding: "3px 10px", fontSize: 11, color: "#4A5A7A", maxWidth: 200,
            }}>aethon-apex.app/ai-os</div>
          </div>
          {/* OS Shell preview */}
          <div style={{ display: "flex", height: 320 }}>
            {/* Left nav strip */}
            <div style={{ width: 52, background: "#0A1120", borderRight: "1px solid rgba(0,229,255,0.08)", padding: "12px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              {["⬡", "⚡", "🛡", "📋", "🧠", "💎"].map(ic => (
                <div key={ic} style={{ fontSize: 15, cursor: "pointer", opacity: 0.7 }}>{ic}</div>
              ))}
            </div>
            {/* Main content */}
            <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
              <div style={{ display: "flex", gap: 10 }}>
                {[["12", "Inventions", "#00E5FF"], ["3", "Threats", "#FF3366"], ["200+", "Prior Art", "#9C40FF"]].map(([v, l, c]) => (
                  <div key={l} style={{
                    flex: 1, background: "#162038", border: `1px solid ${c}20`,
                    borderRadius: 8, padding: "10px 12px",
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: c }}>{v}</div>
                    <div style={{ fontSize: 10, color: "#4A5A7A" }}>{l}</div>
                  </div>
                ))}
              </div>
              {/* Fake graph */}
              <div style={{ flex: 1, background: "#080F1C", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="280" height="140">
                  {[[140, 70, 16, "#00E5FF"], [80, 40, 8, "#9C40FF"], [200, 40, 10, "#FFB800"], [60, 100, 7, "#00FFA3"], [220, 100, 9, "#FF3366"], [140, 20, 6, "#00E5FF"]].map(([cx, cy, r, c], i) => (
                    <g key={i}>
                      <circle cx={cx} cy={cy} r={r + 4} fill={`${c}20`} />
                      <circle cx={cx} cy={cy} r={r} fill={c} fillOpacity="0.8" />
                    </g>
                  ))}
                  {[[140,70,80,40],[140,70,200,40],[140,70,60,100],[140,70,220,100]].map(([x1,y1,x2,y2],i) => (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0,229,255,0.25)" strokeWidth="1" />
                  ))}
                </svg>
              </div>
            </div>
            {/* Right panel */}
            <div style={{ width: 140, background: "#0A1120", borderLeft: "1px solid rgba(0,229,255,0.08)", padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 8, color: "#00E5FF", fontWeight: 700, letterSpacing: "0.1em" }}>INTEL FEED</div>
              {["🔴 Patent risk", "🟢 Opportunity", "🔵 Insight", "🟡 Alert"].map(t => (
                <div key={t} style={{ fontSize: 9, color: "#4A5A7A", padding: "5px 6px", background: "#0F1A2E", borderRadius: 4 }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 10px" }}>Everything Inside the OS</h2>
          <p style={{ color: "#8899BB", fontSize: 14 }}>6 intelligence modules. One unified platform.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {FEATURES.map(f => (
            <div key={f.label} style={{
              background: "#0F1A2E", border: "1px solid rgba(0,229,255,0.08)",
              borderRadius: 12, padding: "18px 20px",
            }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#F0F4FF", marginBottom: 6 }}>{f.label}</div>
              <div style={{ fontSize: 12, color: "#4A5A7A", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "0 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 10px" }}>Choose Your Access Level</h2>
          <p style={{ color: "#8899BB", fontSize: 14, marginBottom: 20 }}>Start free. Upgrade when you're ready.</p>
          {/* Annual toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: !annual ? "#F0F4FF" : "#4A5A7A" }}>Monthly</span>
            <button
              onClick={() => setAnnual(a => !a)}
              style={{
                width: 44, height: 24, borderRadius: 12,
                background: annual ? "#9C40FF" : "#162038",
                border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
              }}
            >
              <div style={{
                position: "absolute", top: 3, width: 18, height: 18,
                borderRadius: "50%", background: "#F0F4FF",
                transition: "left 0.2s",
                left: annual ? 23 : 3,
              }} />
            </button>
            <span style={{ fontSize: 13, color: annual ? "#F0F4FF" : "#4A5A7A" }}>
              Annual <span style={{ color: "#00FFA3", fontWeight: 700 }}>−20%</span>
            </span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, alignItems: "stretch" }}>
          {TIERS.map(tier => <PricingCard key={tier.name} tier={tier} annual={annual} />)}
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "#4A5A7A", marginTop: 16 }}>
          🔒 Stripe secured · Cancel anytime · Instant access
        </p>
      </section>

      {/* Email capture */}
      <section style={{
        borderTop: "1px solid rgba(0,229,255,0.08)",
        background: "rgba(0,229,255,0.03)",
        padding: "48px 24px", textAlign: "center",
      }}>
        <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>Get a Free Engineering Module</h3>
        <p style={{ color: "#8899BB", fontSize: 14, marginBottom: 24 }}>Weekly research breakdowns + a free build plan. No card required.</p>
        {subscribed ? (
          <div style={{ color: "#00FFA3", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Check size={16} /> Subscribed — check your inbox
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                padding: "12px 16px", borderRadius: 8,
                background: "#0F1A2E", border: "1px solid rgba(0,229,255,0.15)",
                color: "#F0F4FF", fontSize: 14, outline: "none", width: 280,
              }}
            />
            <button
              onClick={handleSubscribe}
              style={{
                padding: "12px 20px", borderRadius: 8,
                background: "#00E5FF18", border: "1px solid rgba(0,229,255,0.3)",
                color: "#00E5FF", fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}
            >
              Get Free Module
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(0,229,255,0.06)",
        padding: "24px", textAlign: "center", fontSize: 11, color: "#4A5A7A",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: "linear-gradient(135deg, #00E5FF, #9C40FF)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
          }}>⬡</div>
          <span style={{ color: "#8899BB", fontWeight: 700 }}>Aethon Apex IP · Zenith Apex LLC</span>
        </div>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[["Terms", "/terms"], ["Refund Policy", "/refund-policy"], ["Disclaimer", "/research-disclaimer"], ["Free Vault", "/free-vault"], ["Pricing", "/pricing"]].map(([l, p]) => (
            <Link key={l} to={p} style={{ color: "#4A5A7A", textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}