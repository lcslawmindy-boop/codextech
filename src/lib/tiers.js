// ── TIER DEFINITIONS ──────────────────────────────────────────────────────────
// plan_purchased values stored on BetaApplication.plan_purchased
export const TIERS = {
  free: {
    id: "free",
    name: "Free Preview",
    price: 0,
    color: "#6b7280",
    inventionsAllowed: 1,   // first N inventions unlocked
    coursesAllowed: 1,      // first N courses unlocked
    aiTools: false,
    patentTools: false,
    investorTools: false,
  },
  starter: {
    id: "starter",
    name: "Starter",
    price: 47,
    type: "one_time",
    color: "#f59e0b",
    inventionsAllowed: 5,
    coursesAllowed: 4,
    aiTools: false,
    patentTools: false,
    investorTools: false,
  },
  researcher: {
    id: "researcher",
    name: "Researcher",
    price: 97,
    type: "subscription",
    color: "#6366f1",
    inventionsAllowed: 999,   // all
    coursesAllowed: 999,      // all
    aiTools: true,
    patentTools: false,
    investorTools: false,
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 247,
    type: "subscription",
    color: "#22c55e",
    inventionsAllowed: 999,
    coursesAllowed: 999,
    aiTools: true,
    patentTools: true,
    investorTools: true,
  },
};

export const TIER_ORDER = ["free", "starter", "researcher", "pro"];

export function tierCanAccessInvention(tier, index) {
  return index < (TIERS[tier]?.inventionsAllowed ?? 1);
}

export function tierCanAccessCourse(tier, index) {
  return index < (TIERS[tier]?.coursesAllowed ?? 1);
}

export function tierUpgradeTo(tier) {
  // Returns the next tier above the given one
  const idx = TIER_ORDER.indexOf(tier);
  return TIER_ORDER[idx + 1] || "pro";
}