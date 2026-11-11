import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export const DOMAINS = {
  HUMANITARIAN: { label: "Humanitarian", color: "#34d399" },
  DEFENSE_SECURITY: { label: "Defense & Security", color: "#60a5fa" },
  DEEP_SPACE: { label: "Deep Space", color: "#a78bfa" },
  ASTEROID_MINING: { label: "Asteroid Mining", color: "#fbbf24" },
  DUAL_USE: { label: "Dual Use", color: "#22d3ee" },
  MULTI_DOMAIN: { label: "Multi-Domain", color: "#e2e8f0" },
};
export const PRIMARY_TAGS = ["HUMANITARIAN", "DEFENSE_SECURITY", "DEEP_SPACE", "ASTEROID_MINING"];

export const PORTFOLIOS = [
  { slug: "humanitarian", title: "Humanitarian Systems", tags: ["HUMANITARIAN"], color: "#34d399",
    blurb: "Disaster response, search and rescue, emergency logistics, communications, medical and support operations, resilient infrastructure, environmental monitoring, resource delivery and remote operations." },
  { slug: "defense-security", title: "Defense & Security Systems", tags: ["DEFENSE_SECURITY"], color: "#60a5fa",
    blurb: "High-level, non-operational concepts in resilience, sensing, communications, situational awareness, infrastructure protection, logistics, interoperability and mission support." },
  { slug: "deep-space", title: "Deep Space & Asteroid Mining", tags: ["DEEP_SPACE", "ASTEROID_MINING"], color: "#a78bfa",
    blurb: "Future-facing concepts: deep-space systems, resource prospecting, autonomous exploration, robotic resource operations, navigation, communications, power and in-space infrastructure." },
];

export const STAGES = ["concept", "research", "design", "prototype", "validation"];
export const STAGE_INFO = {
  concept: { label: "Concept", color: "#94a3b8", note: "Conceptual only. Not a built, tested or validated system." },
  research: { label: "Research", color: "#38bdf8", note: "Under research. No built system is claimed." },
  design: { label: "Design", color: "#818cf8", note: "Design work documented. No tested system is claimed." },
  prototype: { label: "Prototype", color: "#fbbf24", note: "Prototype stage, with evidence on file." },
  validation: { label: "Validation", color: "#34d399", note: "Validation stage, with evidence on file." },
};
export const CATEGORIES = {
  communications: "Communications", robotics_autonomy: "Robotics & Autonomy", sensing: "Sensing",
  power_energy: "Power & Energy", navigation: "Navigation", materials_handling: "Materials Handling",
  infrastructure: "Infrastructure", medical_support: "Medical & Support", ai_decision_support: "AI & Decision Support",
  logistics: "Logistics", other: "Other",
};
export const READINESS = {
  not_assessed: "Not assessed", research_only: "Research only", developing: "Developing",
  partner_ready: "Partner-ready", transfer_ready: "Transfer-ready",
};
export const PATHWAYS = {
  ip_broker: "IP Broker", licensing: "License", manufacturing_partnership: "Manufacturing",
  co_development: "Co-Development", research_partnership: "Research Partnership",
  strategic_partnership: "Strategic Partnership", investment_funding: "Investment / Funding",
};
export const ACCESS_LEVELS = ["public", "partner", "confidential", "restricted"];
export const ACCESS_COLORS = { public: "#34d399", partner: "#38bdf8", confidential: "#fbbf24", restricted: "#f87171" };

export function isMultiDomain(tags = []) {
  return tags.includes("MULTI_DOMAIN") || tags.filter((t) => PRIMARY_TAGS.includes(t)).length > 1;
}

// Auto-derive DUAL_USE / MULTI_DOMAIN so stored tags stay consistent.
export function withDerivedTags(tags = []) {
  const base = tags.filter((t) => t !== "DUAL_USE" && t !== "MULTI_DOMAIN");
  const primary = base.filter((t) => PRIMARY_TAGS.includes(t));
  const out = [...base];
  if (primary.length >= 2) out.push("MULTI_DOMAIN");
  if (primary.includes("HUMANITARIAN") && primary.includes("DEFENSE_SECURITY")) out.push("DUAL_USE");
  return out;
}

export function useShowcase() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    base44.functions.invoke("zds33Public", { action: "list" })
      .then((r) => setItems(r.data.items || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  return { items, loading, error };
}