// ── TIER DEFINITIONS ──────────────────────────────────────────────────────────
// Single $49/mo membership — all features unlocked.
// "Research", "Builder", "Operator", "Bundle" are product/marketing labels
// but all map to the same access level: "member".
//
// BetaApplication.plan_purchased values and User.subscription_status are both checked.
// Stripe webhook sets User.subscription_status = "active" on checkout.session.completed.

export const TIERS = {
  free: {
    id: "free",
    name: "Free Preview",
    price: 0,
    color: "#6b7280",
    aiTools: false,
    patentTools: false,
    buildPlans: false,
    marketplace: false,
    fullDatabase: false,
  },
  member: {
    id: "member",
    name: "Research Member",
    price: 49,
    type: "subscription",
    interval: "month",
    color: "#00ccff",
    aiTools: true,
    patentTools: true,
    buildPlans: true,
    marketplace: true,
    fullDatabase: true,
  },
};

// All paid plan labels (from BetaApplication or checkout metadata) that grant member access
export const MEMBER_PLAN_KEYWORDS = [
  "member", "research", "builder", "operator", "bundle",
  "pro", "starter", "elite", "researcher", "converted", "active",
];

export function isMemberPlan(planStr = "", status = "") {
  if (status === "active") return true;
  const lower = (planStr || "").toLowerCase();
  return MEMBER_PLAN_KEYWORDS.some(kw => lower.includes(kw));
}

export const TIER_ORDER = ["free", "member"];

// Classified inventions — admin-only (no longer tier-gated for regular members)
export const CLASSIFIED_INVENTION_IDS = [
  "Scalar Energy Bottle Interferometer (Research Prototype)",
  "Quantum Potential EMI Detector",
  "ELF Carrier Lock Detection System",
  "Atmospheric Scalar EM Signature Recognition System (AI Edition)",
  "Woodpecker Grid Standing Wave Detector",
  "Whittaker Wave Phase Conjugate Mirror (PCM) System",
  "Time-Reversal Zone Cold Fusion Reactor (TRZ-CFR)",
  "Portable Porthole Disease Treatment System (PPDTS)",
  "T-Polarized EM Wave Transducer",
];

// Legacy compatibility exports — used by CourseCatalog and other pages
export function tierCanAccessInvention(tier, index) {
  return tier === "member" || index === 0;
}

export function tierCanAccessCourse(tier, index) {
  return tier === "member" || index === 0;
}

export function tierHasGovAccess(tier) {
  return tier === "admin";
}

export function tierUpgradeTo() {
  return "member";
}

export function isClassifiedInvention(title) {
  return CLASSIFIED_INVENTION_IDS.some(id => (title || "").includes(id.split("(")[0].trim()));
}

// Marketing tier labels → for display/copy only (not access control)
export const MARKETING_TIERS = {
  research: { name: "Research", price: 49, desc: "Full database, 8 modules, patent tools" },
  builder:  { name: "Builder", price: 49, desc: "Everything in Research + build plans + kits" },
  operator: { name: "Operator", price: 49, desc: "Full platform including IP marketplace" },
  bundle:   { name: "Bundle",  price: 49, desc: "All of the above — one flat rate" },
};