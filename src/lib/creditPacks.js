// Research Credit Packs — Stripe price IDs for one-time credit purchases.
// Each credit can be spent on any PDF export (invention spec, therapy pod build
// plan, master export volume) or Invention Forge / Patent Suite session.

export const CREDIT_PACKS = [
  { id: "starter", name: "Starter Pack", credits: 10, price: 49, priceId: "price_1U4u7vBkbCWuj2nHSkpugxqt", color: "#06b6d4", multiplier: "1×" },
  { id: "builder", name: "Builder Pack", credits: 50, price: 197, priceId: "price_1U4u7vBkbCWuj2nHIxpxjB69", color: "#a855f7", multiplier: "5×", popular: true },
  { id: "power", name: "Power Pack", credits: 100, price: 349, priceId: "price_1U4u7wBkbCWuj2nHbia4VGHG", color: "#f97316", multiplier: "10×" },
];

// Credit cost per export action
export const EXPORT_COSTS = {
  invention_pdf: { credits: 1, label: "Invention PDF Spec" },
  therapy_pod_build_plan: { credits: 2, label: "Therapy Pod Build Plan" },
  master_export_3vol: { credits: 3, label: "Master Export (3 Volumes)" },
};

export const pricePerCredit = (pack) => pack.credits > 0 ? (pack.price / pack.credits).toFixed(2) : "—";