// ── TIER DEFINITIONS ──────────────────────────────────────────────────────────
// plan_purchased values stored on BetaApplication.plan_purchased
export const TIERS = {
  free: {
    id: "free",
    name: "Free Preview",
    price: 0,
    color: "#6b7280",
    inventionsAllowed: 1,
    coursesAllowed: 1,
    aiTools: false,
    patentTools: false,
    investorTools: false,
    govAccess: false,
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
    govAccess: false,
  },
  researcher: {
    id: "researcher",
    name: "Researcher",
    price: 97,
    type: "subscription",
    color: "#6366f1",
    inventionsAllowed: 999,
    coursesAllowed: 999,
    aiTools: true,
    patentTools: true,
    investorTools: false,
    govAccess: false,
    dossierRollsPerMonth: 3,
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
    govAccess: false,
    dossierRollsPerMonth: 5,
  },
  government: {
    id: "government",
    name: "Government / Defense",
    price: null, // negotiated
    type: "contract",
    color: "#dc2626",
    inventionsAllowed: 999,
    coursesAllowed: 999,
    aiTools: true,
    patentTools: true,
    investorTools: true,
    govAccess: true,  // unlocks classified defense inventions
  },
};

export const TIER_ORDER = ["free", "starter", "researcher", "pro", "government"];

// Inventions tagged `classified: true` in businessItems are restricted to admin or government tier
export const CLASSIFIED_INVENTION_IDS = [
  "Scalar Energy Bottle Interferometer (Research Prototype)",
  "Quantum Potential EMI Detector (\"Fireflies Sensor\")",
  "ELF Carrier Lock Detection System (\"Psychotronic Detector\")",
  "Atmospheric Scalar EM Signature Recognition System (AI Edition)",
  "Woodpecker Grid Standing Wave Detector (HF Scalar Signature Receiver)",
  "Whittaker Wave Phase Conjugate Mirror (PCM) System",
  "Time-Reversal Zone Cold Fusion Reactor (TRZ-CFR)",
  "Portable Porthole Disease Treatment System (PPDTS)",
  "T-Polarized EM Wave Transducer (Time-Domain EM Engineering System)",
];

export function tierCanAccessInvention(tier, index) {
  return index < (TIERS[tier]?.inventionsAllowed ?? 1);
}

export function tierCanAccessCourse(tier, index) {
  return index < (TIERS[tier]?.coursesAllowed ?? 1);
}

export function tierHasGovAccess(tier) {
  return TIERS[tier]?.govAccess === true;
}

export function isClassifiedInvention(title) {
  return CLASSIFIED_INVENTION_IDS.includes(title);
}

export function tierUpgradeTo(tier) {
  const idx = TIER_ORDER.indexOf(tier);
  return TIER_ORDER[idx + 1] || "government";
}