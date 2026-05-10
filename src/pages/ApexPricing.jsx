// Aethon Apex IP OS — Full Pricing Page
import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, ArrowLeft, Flame } from "lucide-react";
import { base44 } from "@/api/base44Client";

const TIERS = [
  {
    id: "explorer",
    name: "Explorer",
    monthly: 29, annual: 23,
    color: "#00E5FF",
    desc: "Research archive & concept library",
    badge: null,
    features: {
      "Research Archive (200+ entries)": true,
      "IP Network Graph": true,
      "Engineering Glossary": true,
      "Community Forum (read)": true,
      "Build Plans": false,
      "Structured Courses": false,
      "AI Patent Suite": false,
      "Invention Forge": false,
      "Investor CRM": false,
      "VDR Access": false,
    },
  },
  {
    id: "research",
    name: "Research Lab",
    monthly: 49, annual: 39,
    color: "#9C40FF",
    desc: "5 courses + 5 builds monthly",
    badge: "MOST POPULAR",
    highlight: true,
    features: {
      "Research Archive (200+ entries)": true,
      "IP Network Graph": true,
      "Engineering Glossary": true,
      "Community Forum (read)": true,
      "Build Plans": "5/month",
      "Structured Courses": "5/month",
      "AI Patent Suite": false,
      "Invention Forge": false,
      "Investor CRM": false,
      "VDR Access": false,
    },
  },
  {
    id: "pro",
    name: "Pro Builder",
    monthly: 149, annual: 119,
    color: "#FFB800",
    desc: "Full platform + AI patent suite",
    badge: "BEST VALUE",
    features: {
      "Research Archive (200+ entries)": true,
      "IP Network Graph": true,
      "Engineering Glossary": true,
      "Community Forum (read)": true,
      "Build Plans": "10/month",
      "Structured Courses": "10/month",
      "AI Patent Suite": true,
      "Invention Forge": "5/month",
      "Investor CRM": false,
      "VDR Access": false,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: 497, annual: 397,
    color: "#00FFA3",
    desc: "Unlimited + VDR + white-label",
    badge: "ENTERPRISE",
    features: {
      "Research Archive (200+ entries)": true,
      "IP Network Graph": true,
      "Engineering Glossary": true,
      "Community Forum (read)": true,
      "Build Plans": "Unlimited",
      "Structured Courses": "Unlimited",
      "AI Patent Suite": true,
      "Invention Forge": "Unlimited",
      "Investor CRM": true,
      "VDR Access": true,
    },
  },
];

const FEATURE_ROWS = [
  "Research Archive (200+ entries)",
  "IP Network Graph",
  "Engineering Glossary",
  "Community Forum (read)",
  "Build Plans",
  "Structured Courses",
  "AI Patent Suite",
  "Invention Forge",
  "Investor CRM",
  "VDR Access",
];

function FeatureVal({ val, color }) {
  if (val === true) return <Check size={15} color={color} />;
  if (!val) return <X size={15} color="#2A3A5A" />;
  return <span style={{ fontSize: 11, color, fontWeight: 700 }}>{val}</span>;
}

export default function ApexPricing() {
  const [annual, setAnnual] = useState(true);
  const [loading, setLoading] = useState(null);

  const handleBuy = async (tier) => {
    if (window.self !== window.top) { alert("Checkout only works from the published app."); return; }
    setLoading(tier.id);
    try {
      const price = annual ? tier.annual : tier.monthly;
      const res = await base44.functions.invoke("createCheckoutSession", {
        title: `Aethon Apex IP — ${tier.name}`,
        priceInCents: annual ? price * 12 * 100 : price * 100,
        description: tier.desc,
        category: "membership",
        successUrl: `${window.location.origin}/member-dashboard`,
        cancelUrl: `${window.location.origin}/pricing`,
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch (e) { console.error(e); }
    setLoading(null);
  };

  return (
    <div style={{
      minHeight: "100dvh", background: "#050A0F",
      color: "#F0F4FF", fontFamily: "'Inter', system-ui, sans-serif",
      padding: "32px 24px",
    }}>
      {/* Header */}
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "#4A5A7A", textDecoration: "none", fontSize: 12, marginBottom: 32 }}>
          <ArrowLeft size={13} /> Back
        </Link>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 12 }}>
            <Flame size={14} color="#FF3366" />
            <span style={{ fontSize: 12, color: "#FF3366", fontWeight: 700 }}>Founding rate · Limited seats</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Choose Your Access Level
          </h1>
          <p style={{ color: "#8899BB", fontSize: 14, margin: "0 0 24px" }}>Patent-sourced research. AI tools. Engineering builds. One platform.</p>

          {/* Billing toggle */}
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
                transition: "left 0.2s", left: annual ? 23 : 3,
              }} />
            </button>
            <span style={{ fontSize: 13, color: annual ? "#F0F4FF" : "#4A5A7A" }}>
              Annual <span style={{ color: "#00FFA3", fontWeight: 700 }}>−20%</span>
            </span>
          </div>
        </div>

        {/* Tier cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 48, alignItems: "start" }}>
          {TIERS.map(tier => {
            const price = annual ? tier.annual : tier.monthly;
            return (
              <div key={tier.id} style={{
                background: tier.highlight ? "#0F1A2E" : "#0A1120",
                border: `1px solid ${tier.color}${tier.highlight ? "40" : "18"}`,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: tier.highlight ? `0 0 40px ${tier.color}12` : "none",
                transform: tier.highlight ? "scale(1.02)" : "none",
                position: "relative",
              }}>
                {tier.badge && (
                  <div style={{
                    padding: "5px 0", textAlign: "center",
                    background: tier.color, fontSize: 9, fontWeight: 800,
                    letterSpacing: "0.12em", color: "#050A0F",
                  }}>{tier.badge}</div>
                )}
                <div style={{ padding: "20px" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#F0F4FF", marginBottom: 4 }}>{tier.name}</div>
                  <div style={{ fontSize: 11, color: "#4A5A7A", marginBottom: 12 }}>{tier.desc}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 4 }}>
                    <span style={{ fontSize: 32, fontWeight: 900, color: tier.color }}>${price}</span>
                    <span style={{ fontSize: 12, color: "#4A5A7A" }}>/mo</span>
                  </div>
                  {annual && (
                    <div style={{ fontSize: 10, color: "#00FFA3", fontWeight: 600, marginBottom: 16 }}>
                      Save ${(tier.monthly - tier.annual) * 12}/year
                    </div>
                  )}
                  <button
                    onClick={() => handleBuy(tier)}
                    disabled={loading === tier.id}
                    style={{
                      width: "100%", padding: "10px", borderRadius: 8, border: "none",
                      cursor: "pointer",
                      background: tier.highlight ? tier.color : `${tier.color}18`,
                      color: tier.highlight ? "#050A0F" : tier.color,
                      fontSize: 13, fontWeight: 800, transition: "all 0.2s",
                    }}
                  >
                    {loading === tier.id ? "Processing..." : `Start ${tier.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature comparison grid */}
        <div style={{
          background: "#0A1120",
          border: "1px solid rgba(0,229,255,0.08)",
          borderRadius: 16,
          overflow: "hidden",
        }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr repeat(4, 1fr)",
            borderBottom: "1px solid rgba(0,229,255,0.10)",
            background: "#0F1A2E",
          }}>
            <div style={{ padding: "14px 20px", fontSize: 11, color: "#4A5A7A", fontWeight: 700, letterSpacing: "0.06em" }}>FEATURES</div>
            {TIERS.map(t => (
              <div key={t.id} style={{ padding: "14px", textAlign: "center", fontSize: 12, fontWeight: 700, color: t.color }}>
                {t.name}
              </div>
            ))}
          </div>
          {FEATURE_ROWS.map((feature, i) => (
            <div key={feature} style={{
              display: "grid", gridTemplateColumns: "1fr repeat(4, 1fr)",
              borderBottom: "1px solid rgba(0,229,255,0.04)",
              background: i % 2 === 0 ? "transparent" : "rgba(0,229,255,0.02)",
            }}>
              <div style={{ padding: "12px 20px", fontSize: 12, color: "#8899BB" }}>{feature}</div>
              {TIERS.map(t => (
                <div key={t.id} style={{ padding: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FeatureVal val={t.features[feature]} color={t.color} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#4A5A7A", marginTop: 20 }}>
          🔒 Stripe secured · Cancel anytime from account settings · No hidden fees
        </p>
      </div>
    </div>
  );
}