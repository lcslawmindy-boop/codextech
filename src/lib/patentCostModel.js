// Shared patent / invention cost model — single source of truth used by
// BuildCostEstimates and PatentCostMaster. All figures are advisory USD.

import { BOM_ITEMS as PRE_BOM, BOM_SUMMARY as PRE_SUM } from "./prenatalPodSpecs";
import { BOM_ITEMS as NEU_BOM, BOM_SUMMARY as NEU_SUM } from "./neuroRegenSpecs";
import { NEW_INVENTIONS } from "./newInventions";

// EVT prototype labor ≈ 2.5× materials (engineering, winding, fab, integration, test)
export const LABOR_FACTOR = 2.5;

export const BASE_PER_COMPONENT = 140;

export const CAT_MULT = {
  "Energy & Propulsion": 2.4,
  "Energy & Bio-Medicine": 1.6,
  "Bio-Medicine & Energy": 1.6,
  "Bio-Medicine": 1.3,
  "Water & Bio-Medicine": 1.4,
  "Consciousness & Mind": 1.5,
  "Diagnostics & Sensors": 1.8,
  "Materials & Nano": 1.7,
  "Agriculture & Environment": 1.2,
  "Education & Research": 0.8,
  "Ultimate Integration": 3.5,
};

// Path-to-market cost components (advisory, USD).
// - softwareDev: embedded firmware, control system, HMI, audit logging, closed-loop
// - irbRegulatory: IRB/IACUC + IND/IMD filing + ethics + export-control
// - pilot: animal model + first-in-human safety study (DSMB, consent, monitoring)
export const MARKET_PATH = {
  nrcp: { softwareDev: 65000, irbRegulatory: 150000, pilot: 420000, medical: true,
    note: "Pediatric Class II investigational — strictest path: IRB + pediatric ethicist + IND/IMD + DSMB-gated first-in-human safety study." },
  nrc1: { softwareDev: 60000, irbRegulatory: 120000, pilot: 350000, medical: true,
    note: "Adult research device: IRB + IACUC (animal) + IND/IMD + first-in-human safety. In-vitro falsification gate must pass before pilot." },
  therapy: { softwareDev: 85000, irbRegulatory: 90000, pilot: 250000, medical: true,
    note: "Full-size 12-subsystem pod: larger software effort (BFAC + ACE + 9 modalities + diagnostics). Lighter regulatory if wellness-class; heavier if any medical claim." },
};

export const MEDICAL_CATS = [
  "Bio-Medicine", "Bio-Medicine & Energy", "Energy & Bio-Medicine",
  "Water & Bio-Medicine", "Diagnostics & Sensors",
];

export function totalToMarket(materials, labor, path) {
  return materials + labor + path.softwareDev + path.irbRegulatory + path.pilot;
}

export function sumBom(items) {
  return items.reduce((s, it) => s + (Number(it.estCost) || 0) * (Number(it.qty) || 0), 0);
}

export function byCategory(items) {
  const m = {};
  items.forEach((it) => { m[it.category] = (m[it.category] || 0) + (Number(it.estCost) || 0) * (Number(it.qty) || 0); });
  return m;
}

export function estimateInvention(inv) {
  const compCount = (inv.components || []).length || 6;
  const mult = CAT_MULT[inv.category] || 1.4;
  const materials = Math.round(compCount * BASE_PER_COMPONENT * mult);
  const labor = Math.round(materials * LABOR_FACTOR);
  return { materials, labor, total: materials + labor, compCount };
}

export function inventionMarket(inv) {
  const isMedical = MEDICAL_CATS.includes(inv.category);
  if (isMedical) {
    return { softwareDev: 20000, irbRegulatory: 45000, pilot: 85000, medical: true,
      note: "Medical-path: IRB + IND/IMD + small clinical pilot." };
  }
  return { softwareDev: 25000, irbRegulatory: 5000, pilot: 30000, medical: false,
    note: "Non-medical: safety/CE + bench/field pilot (no IRB)." };
}

export function inventionTotalToMarket(inv) {
  const est = estimateInvention(inv);
  const m = inventionMarket(inv);
  return est.materials + est.labor + m.softwareDev + m.irbRegulatory + m.pilot;
}

// ── Flagship device summaries ──────────────────────────────────────────────
export const FLAGSHIP_DEVICES = [
  {
    id: "nrcp",
    code: "ZA-NRC-P-001",
    name: "Prenatal Repair Pod (NRC-P)",
    category: "Pediatric investigational device",
    path: "/prenatal-repair-pod",
    color: "#ec4899",
    marketPath: MARKET_PATH.nrcp,
    materials: sumBom(PRE_BOM),
    lineItems: PRE_SUM.totalLineItems,
    components: PRE_SUM.totalComponents,
    patentClaims: 4,
    note: "Real BOM. Pediatric variant — 40 line items, 69 components. Pediatric caps and hardwired lockout included. Gold-nanoparticle carrier ($600) is IND-gated optional.",
  },
  {
    id: "nrc1",
    code: "ZA-NRC-001",
    name: "Neuro Regeneration Chamber (NRC-1)",
    category: "Adult research device",
    path: "/neuro-regen-chamber",
    color: "#06b6d4",
    marketPath: MARKET_PATH.nrc1,
    materials: sumBom(NEU_BOM),
    lineItems: NEU_SUM.totalLineItems,
    components: NEU_SUM.totalComponents,
    patentClaims: 4,
    note: "Real BOM. Research prototype — 40 line items, 82 components. In-vitro epigenetic interface on separate shielded bench.",
  },
  {
    id: "therapy",
    code: "ZA-TP-001",
    name: "Therapy Pod Pro (AATCS-P1)",
    category: "Full-size 12-subsystem pod",
    path: "/therapy-pod-pro",
    color: "#a855f7",
    marketPath: MARKET_PATH.therapy,
    materials: 24500, // heuristic — BOM has no per-item costs
    lineItems: 67,
    components: 842,
    patentClaims: 8,
    note: "Heuristic BOM. 67 line items / 842 components / 12 subsystems. Materials estimated ~$18k–$31k midpoint.",
  },
];

export function flagshipTotalToMarket(d) {
  return totalToMarket(d.materials, Math.round(d.materials * LABOR_FACTOR), d.marketPath);
}

// ── All patents in one flat list ────────────────────────────────────────────
export function buildPatentMasterList() {
  const flagships = FLAGSHIP_DEVICES.map((d) => {
    const labor = Math.round(d.materials * LABOR_FACTOR);
    const market = d.marketPath;
    return {
      id: d.id,
      code: d.code,
      name: d.name,
      category: d.category,
      source: "flagship",
      path: d.path,
      color: d.color,
      materials: d.materials,
      labor,
      buildTotal: d.materials + labor,
      softwareDev: market.softwareDev,
      irbRegulatory: market.irbRegulatory,
      pilot: market.pilot,
      toMarket: totalToMarket(d.materials, labor, market),
      medical: market.medical,
      patentClaims: d.patentClaims,
      lineItems: d.lineItems,
      components: d.components,
      note: d.note,
    };
  });

  const inventions = NEW_INVENTIONS.map((inv) => {
    const est = estimateInvention(inv);
    const market = inventionMarket(inv);
    return {
      id: inv.id,
      code: inv.id.toUpperCase(),
      name: inv.name,
      category: inv.category,
      source: "invention",
      path: "/invention-build-plans",
      color: "#f97316",
      materials: est.materials,
      labor: est.labor,
      buildTotal: est.total,
      softwareDev: market.softwareDev,
      irbRegulatory: market.irbRegulatory,
      pilot: market.pilot,
      toMarket: est.total + market.softwareDev + market.irbRegulatory + market.pilot,
      medical: market.medical,
      patentClaims: (inv.patentClaims || []).length,
      lineItems: (inv.components || []).length,
      components: est.compCount,
      note: inv.fusion,
    };
  });

  return [...flagships, ...inventions];
}