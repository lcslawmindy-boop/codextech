// ─────────────────────────────────────────────────────────────────────────────
// MASTER ENGINEERING SPEC GENERATOR
// Derives detailed PRD, PDR, BOM, SOW, EVT/DVT specs for each of the 50
// merged inventions from the base invention data.
// ─────────────────────────────────────────────────────────────────────────────

import { NEW_INVENTIONS } from "./newInventions";

// ── Helpers ──────────────────────────────────────────────────────────────────

const categoryToDomain = (cat) => {
  const c = (cat || "").toLowerCase();
  if (c.includes("energy") || c.includes("propulsion")) return "Energy & Propulsion";
  if (c.includes("bio") || c.includes("medic")) return "Bio-Medicine";
  if (c.includes("water")) return "Water & Environment";
  if (c.includes("conscious") || c.includes("cognit")) return "Consciousness & Cognitive";
  if (c.includes("agri") || c.includes("env")) return "Agriculture & Environment";
  if (c.includes("defense") || c.includes("security")) return "Defense & Security";
  return "General Engineering";
};

const derivePowerClass = (inv) => {
  const t = (inv.name + inv.mechanism + inv.fusion).toLowerCase();
  if (t.includes("meg") || t.includes("over-unity") || t.includes("self-powered")) return "COP > 1 (Vacuum Energy)";
  if (t.includes("hydrogen") || t.includes("fuel cell") || t.includes("electrolysis")) return "Fuel Gas Generation";
  if (t.includes("healing") || t.includes("therapy")) return "Therapeutic EM";
  if (t.includes("anti-grav") || t.includes("levitation")) return "Gravitational Modification";
  if (t.includes("wearable") || t.includes("pendant") || t.includes("portable")) return "Battery-Powered Wearable";
  return "Line-Powered Benchtop";
};

const deriveSafetyClass = (inv) => {
  const t = (inv.name + inv.mechanism).toLowerCase();
  if (t.includes("mercury")) return "Class III — Toxic Material Handling";
  if (t.includes("hydrogen") || t.includes("hhO") || t.includes("fuel gas")) return "Class III — Combustible Gas";
  if (t.includes("inject") || t.includes("ingest") || t.includes("elixir") || t.includes("bhasma")) return "Class III — Ingestible";
  if (t.includes("eye") || t.includes("cranial") || t.includes("brain")) return "Class IIb — Neuro/Ophthalmic";
  if (t.includes("wearable") || t.includes("pendant")) return "Class I — Wearable";
  if (t.includes("chamber") || t.includes("pod")) return "Class IIa — Enclosed Therapy";
  return "Class I — Benchtop Research";
};

const deriveTimeline = (inv) => {
  const t = (inv.buildPlan || "").toLowerCase();
  if (t.includes("phase 3")) return { evt: 8, dvt: 12, pvt: 8, total: 28 };
  if (t.includes("phase 2")) return { evt: 6, dvt: 10, pvt: 6, total: 22 };
  return { evt: 4, dvt: 8, pvt: 4, total: 16 };
};

const deriveBudget = (inv) => {
  const t = (inv.name + inv.mechanism).toLowerCase();
  if (t.includes("chamber") || t.includes("pod") || t.includes("platform")) return { evt: 75000, dvt: 180000, pvt: 250000 };
  if (t.includes("mercury") || t.includes("anti-grav") || t.includes("genome")) return { evt: 100000, dvt: 250000, pvt: 400000 };
  if (t.includes("wearable") || t.includes("pendant") || t.includes("wand")) return { evt: 25000, dvt: 60000, pvt: 80000 };
  return { evt: 40000, dvt: 100000, pvt: 150000 };
};

// ── PRD Generator ────────────────────────────────────────────────────────────

function generatePRD(inv) {
  const domain = categoryToDomain(inv.category);
  const safety = deriveSafetyClass(inv);
  return {
    docId: `PRD-${inv.id.toUpperCase()}-001`,
    revision: "A",
    date: "2026-08-13",
    classification: "Research Prototype — Not for Sale",
    title: `${inv.name} — Product Requirements Document`,
    sections: [
      {
        heading: "1. Purpose & Scope",
        body: `This PRD defines the functional, performance, and regulatory requirements for the ${inv.name} (${inv.id.toUpperCase()}). The device is a ${domain} research prototype integrating suppressed technology, Vedic medicinal principles, occult/esoteric knowledge, and scalar-EM engineering. This document governs the EVT → DVT → PVT prototype phases.`,
      },
      {
        heading: "2. Concept Fusion",
        body: inv.fusion,
      },
      {
        heading: "3. Operating Mechanism",
        body: inv.mechanism,
      },
      {
        heading: "4. Functional Requirements",
        bullets: [
          `FR-1: Device shall implement the ${inv.fusion.split("+").map(s=>s.trim()).join(", ")} fusion architecture`,
          "FR-2: Device shall operate from standard AC mains or internal battery (wearable class)",
          "FR-3: Device shall include real-time biometric feedback where applicable (BFAC closed-loop)",
          "FR-4: Device shall include safety interlocks per IEC 60601-1 (medical class) or UL 61010 (research class)",
          "FR-5: Device shall include EMI shielding (Faraday enclosure) for all EM-emitting subsystems",
          "FR-6: Device shall support firmware OTA updates via USB-C DFU or wireless",
          "FR-7: Device shall log all operational telemetry for research validation",
        ],
      },
      {
        heading: "5. Performance Requirements",
        bullets: [
          `PR-1: Power class — ${derivePowerClass(inv)}`,
          `PR-2: Safety classification — ${safety}`,
          "PR-3: MTBF target ≥ 2,000 hours (EVT), ≥ 5,000 hours (DVT), ≥ 10,000 hours (PVT)",
          "PR-4: Thermal stability ±2°C under continuous operation",
          "PR-5: EMI emissions within FCC Part 15 Class B (consumer) or Class A (research)",
          "PR-6: Startup time < 30 seconds to full operational state",
        ],
      },
      {
        heading: "6. Physical & Environmental Constraints",
        bullets: [
          "PE-1: Operating temperature 10–40°C, humidity 20–80% RH non-condensing",
          "PE-2: Storage temperature -20 to 60°C",
          "PE-3: Drop test 1.0m per IEC 60068-2-32 (portable/wearable class)",
          "PE-4: IP rating: IP42 (benchtop), IP54 (wearable), IP65 (field)",
          "PE-5: All patient-contact surfaces biocompatible per ISO 10993",
        ],
      },
      {
        heading: "7. Regulatory & Safety",
        bullets: [
          `RS-1: Device classification — ${safety}`,
          "RS-2: Electrical safety per IEC 60601-1 (medical) or UL 61010-1 (research)",
          "RS-3: EM emissions per FCC Part 15 / CISPR 11",
          "RS-4: Materials compliance: RoHS, REACH, Proposition 65",
          "RS-5: Research use only — not for clinical diagnostic or therapeutic use without IRB approval",
          "RS-6: Not for Sale — classified as research prototype under Fair Use (17 U.S.C. § 107)",
        ],
      },
      {
        heading: "8. Market & Commercialization",
        body: inv.market,
      },
      {
        heading: "9. Digital Product Monetization",
        bullets: inv.digitalProducts,
      },
    ],
  };
}

// ── PDR Generator ────────────────────────────────────────────────────────────

function generatePDR(inv) {
  const domain = categoryToDomain(inv.category);
  return {
    docId: `PDR-${inv.id.toUpperCase()}-001`,
    revision: "A",
    date: "2026-08-13",
    title: `${inv.name} — Preliminary Design Review`,
    sections: [
      {
        heading: "1. System Architecture",
        body: `The ${inv.name} employs a modular architecture with the following subsystems. Each subsystem is independently testable and replaceable. The design follows the Zenith Apex Bioelectromagnetic Platform standard — all subsystems interface via a common BFAC (Bio-Field Adaptive Controller) backplane.`,
      },
      {
        heading: "2. Subsystem Decomposition",
        table: inv.components.map((c, i) => ({
          ref: `SS-${String(i+1).padStart(2,"0")}`,
          name: c.length > 60 ? c.slice(0, 57) + "..." : c,
          status: "Design Complete",
          risk: c.match(/mercury|hydrogen|plasma|tesla|high.?voltage/i) ? "High" : c.match(/coil|emitter|sensor|crystal/i) ? "Medium" : "Low",
        })),
      },
      {
        heading: "3. Key Technical Parameters",
        bullets: [
          `KTP-1: Technology domain — ${domain}`,
          `KTP-2: Power class — ${derivePowerClass(inv)}`,
          `KTP-3: Component count — ${inv.components.length} subsystems`,
          "KTP-4: Control architecture — BFAC closed-loop with biometric feedback",
          "KTP-5: Safety interlock — <100ms emergency cutoff",
          "KTP-6: Data logging — all telemetry at 100ms sample rate",
        ],
      },
      {
        heading: "4. Risk Assessment",
        table: [
          { risk: "Technical: Scalar field stability", severity: "High", mitigation: "OCXO frequency reference + phase-locked loop" },
          { risk: "Technical: Thermal management", severity: "Medium", mitigation: "Active cooling + NTC thermal sensors + PID control" },
          { risk: "Technical: EMI compliance", severity: "High", mitigation: "Faraday shield + conductive gaskets + filtered I/O" },
          { risk: "Safety: Patient/user exposure", severity: "High", mitigation: "IEC 60601-1 compliance + interlocks + current limits" },
          { risk: "Regulatory: Classification ambiguity", severity: "Medium", mitigation: "Research-use-only labeling + IRB pathway" },
          { risk: "Supply: Specialty components", severity: "Medium", mitigation: "Dual-source for critical parts + 6-month buffer stock" },
        ],
      },
      {
        heading: "5. Patent Claims (Draft)",
        bullets: inv.patentClaims,
      },
      {
        heading: "6. Build Plan (Phased)",
        body: inv.buildPlan,
      },
      {
        heading: "7. PDR Action Items",
        bullets: [
          "AI-1: Finalize subsystem interface specifications",
          "AI-2: Complete EMC pre-scan on breadboard prototypes",
          "AI-3: Source all BOM line items — verify availability + lead times",
          "AI-4: Flash BFAC safety firmware v2.4.1 on all control boards",
          "AI-5: Schedule EVT kick-off review",
        ],
      },
    ],
  };
}

// ── BOM Generator ────────────────────────────────────────────────────────────

function generateBOM(inv) {
  const items = [];
  inv.components.forEach((c, i) => {
    const isElectronic = /coil|circuit|controller|generator|oscillator|battery|led|sensor|pe[MF]|driver|dds|fpga|mcu|tesla/i.test(c);
    const isMechanical = /chamber|housing|frame|plate|impeller|wand|mat|garment|chassis|vessel|cup/i.test(c);
    const isMaterial = /mercury|ghee|oil|herb|bhasma|shilajit|triphala|brahmi|crystal|quartz|water/i.test(c);
    const category = isElectronic ? "Electronics" : isMechanical ? "Mechanical" : isMaterial ? "Materials" : "Hardware";
    const qty = /array|set|pair|grid|bank/i.test(c) ? 8 : /layer/i.test(c) ? 6 : 1;
    items.push({
      item: i + 1,
      refDes: `${category.slice(0,3).toUpperCase()}-${String(i+1).padStart(3,"0")}`,
      description: c,
      category,
      qty,
      uom: "ea",
      notes: /mercury/i.test(c) ? "HAZMAT — SDS required" : /crystal|quartz/i.test(c) ? "Calibrated" : "",
    });
  });
  // Add common items
  items.push(
    { item: items.length + 1, refDes: "ELC-STD", description: "BFAC MCU control board (Cortex-M7)", category: "Electronics", qty: 1, uom: "ea", notes: "Common" },
    { item: items.length + 2, refDes: "ELC-PWR", description: "Medical-grade power supply (48V DC, 5A)", category: "Electronics", qty: 1, uom: "ea", notes: "IEC 60601-1" },
    { item: items.length + 3, refDes: "MEC-ENC", description: "Faraday shield enclosure (copper mesh)", category: "Mechanical", qty: 1, uom: "ea", notes: "EMI shielding" },
    { item: items.length + 4, refDes: "ELC-SAF", description: "Safety interlock board (E-stop + GFCI)", category: "Electronics", qty: 1, uom: "ea", notes: "IEC 60601-1" },
    { item: items.length + 5, refDes: "ELC-HMI", description: "10.1\" touchscreen HMI display", category: "Electronics", qty: 1, uom: "ea", notes: "Operator interface" },
    { item: items.length + 6, refDes: "MEC-FAS", description: "Fastener kit (M3/M6/M8 stainless)", category: "Hardware", qty: 1, uom: "kit", notes: "Torque spec per drawing" },
    { item: items.length + 7, refDes: "ELC-CBL", description: "Wiring harness assembly (color-coded)", category: "Electronics", qty: 1, uom: "set", notes: "Per harness spec" },
    { item: items.length + 8, refDes: "DOC-MAN", description: "Assembly manual + traveler", category: "Documentation", qty: 1, uom: "ea", notes: "Rev-controlled" },
  );
  return {
    docId: `BOM-${inv.id.toUpperCase()}-001`,
    revision: "A",
    date: "2026-08-13",
    title: `${inv.name} — Bill of Materials`,
    summary: {
      totalLineItems: items.length,
      totalComponents: items.reduce((s, i) => s + i.qty, 0),
      categories: [...new Set(items.map(i => i.category))],
    },
    items,
  };
}

// ── SOW Generator ────────────────────────────────────────────────────────────

function generateSOW(inv) {
  const timeline = deriveTimeline(inv);
  const budget = deriveBudget(inv);
  return {
    docId: `SOW-${inv.id.toUpperCase()}-001`,
    revision: "A",
    date: "2026-08-13",
    title: `${inv.name} — Statement of Work`,
    sections: [
      {
        heading: "1. Project Overview",
        body: `This SOW covers the design, prototype, and validation of the ${inv.name} (${inv.id.toUpperCase()}) through EVT → DVT → PVT phases. The work is performed under the Zenith Apex Research Portfolio program.`,
      },
      {
        heading: "2. Work Breakdown Structure (WBS)",
        table: [
          { wbs: "1.0", task: "Program Management & Documentation", duration: `${timeline.total} weeks`, deliverable: "PRD, PDR, BOM, SOW, Test Reports" },
          { wbs: "1.1", task: "Requirements definition (PRD)", duration: "2 weeks", deliverable: "Approved PRD" },
          { wbs: "1.2", task: "Preliminary design review (PDR)", duration: "3 weeks", deliverable: "Approved PDR" },
          { wbs: "1.3", task: "Critical design review (CDR)", duration: "2 weeks", deliverable: "Approved CDR" },
          { wbs: "2.0", task: "EVT — Engineering Validation Test", duration: `${timeline.evt} weeks`, deliverable: "EVT units + test report" },
          { wbs: "2.1", task: "Procure BOM line items", duration: "3 weeks", deliverable: "Received components" },
          { wbs: "2.2", task: "Assemble EVT units (2-3)", duration: "3 weeks", deliverable: "Built EVT units" },
          { wbs: "2.3", task: "Firmware flashing + calibration", duration: "1 week", deliverable: "Calibrated units" },
          { wbs: "2.4", task: "Functional + safety testing", duration: "2 weeks", deliverable: "EVT test report" },
          { wbs: "3.0", task: "DVT — Design Validation Test", duration: `${timeline.dvt} weeks`, deliverable: "DVT units + test report" },
          { wbs: "3.1", task: "Incorporate EVT fixes", duration: "2 weeks", deliverable: "Updated design" },
          { wbs: "3.2", task: "Assemble DVT units (5-10)", duration: "4 weeks", deliverable: "Built DVT units" },
          { wbs: "3.3", task: "Environmental + EMC testing", duration: "3 weeks", deliverable: "DVT test report" },
          { wbs: "3.4", task: "Reliability testing (MTBF)", duration: "3 weeks", deliverable: "Reliability report" },
          { wbs: "4.0", task: "PVT — Production Validation Test", duration: `${timeline.pvt} weeks`, deliverable: "PVT units + production readiness" },
          { wbs: "4.1", task: "Finalize production tooling", duration: "2 weeks", deliverable: "Tooling complete" },
          { wbs: "4.2", task: "Assemble PVT units (20-50)", duration: "3 weeks", deliverable: "Built PVT units" },
          { wbs: "4.3", task: "Production line validation", duration: "2 weeks", deliverable: "Production readiness sign-off" },
          { wbs: "4.4", task: "Final documentation package", duration: "1 week", deliverable: "Complete doc set" },
        ],
      },
      {
        heading: "3. Timeline Summary",
        table: [
          { phase: "EVT", duration: `${timeline.evt} weeks`, budget: `$${budget.evt.toLocaleString()}` },
          { phase: "DVT", duration: `${timeline.dvt} weeks`, budget: `$${budget.dvt.toLocaleString()}` },
          { phase: "PVT", duration: `${timeline.pvt} weeks`, budget: `$${budget.pvt.toLocaleString()}` },
          { phase: "TOTAL", duration: `${timeline.total} weeks`, budget: `$${(budget.evt + budget.dvt + budget.pvt).toLocaleString()}` },
        ],
      },
      {
        heading: "4. Acceptance Criteria",
        bullets: [
          "AC-1: All PRD functional requirements verified",
          "AC-2: All PRD performance requirements met within tolerance",
          "AC-3: Safety interlock test passed (E-stop, GFCI, thermal cutoff)",
          "AC-4: EMC pre-scan passed (FCC Part 15 Class B/A)",
          "AC-5: MTBF target achieved per phase",
          "AC-6: Full documentation package delivered (PRD, PDR, BOM, SOW, test reports, assembly manual)",
          "AC-7: Final approval sign-off: quality engineer + lead engineer signatures",
        ],
      },
      {
        heading: "5. Deliverables",
        bullets: [
          "D-1: EVT units (2-3) + EVT test report",
          "D-2: DVT units (5-10) + DVT test report + EMC report",
          "D-3: PVT units (20-50) + production readiness report",
          "D-4: Complete documentation package (all docs Rev-controlled)",
          "D-5: Source code + firmware binaries (signed)",
          "D-6: BOM with supplier info + lead times",
        ],
      },
    ],
  };
}

// ── EVT/DVT Test Plan Generator ──────────────────────────────────────────────

function generateTestPlan(inv) {
  const safety = deriveSafetyClass(inv);
  return {
    docId: `TEST-${inv.id.toUpperCase()}-001`,
    revision: "A",
    date: "2026-08-13",
    title: `${inv.name} — EVT/DVT/PVT Test Plan`,
    sections: [
      {
        heading: "1. EVT — Engineering Validation Test",
        body: "EVT validates that the engineering design meets the PRD requirements. Performed on 2-3 hand-built units. Focus: functional verification, first-article inspection, basic safety.",
        table: [
          { test: "EVT-01", description: "Power-on rail verification (48V/24V/12V/5V/3.3V ±2%)", pass: "All rails within tolerance", status: "Required" },
          { test: "EVT-02", description: "Each subsystem functional test (per modality spec)", pass: "All subsystems operational", status: "Required" },
          { test: "EVT-03", description: "Safety interlock test (E-stop, GFCI, thermal cutoff)", pass: "All interlocks trip <100ms", status: "Required" },
          { test: "EVT-04", description: "First-article dimensional inspection", pass: "All dims per drawing ±0.5mm", status: "Required" },
          { test: "EVT-05", description: "Thermal rise test (30 min continuous)", pass: "Max temp rise <15°C above ambient", status: "Required" },
          { test: "EVT-06", description: "Firmware functional test (all protocols)", pass: "All protocols execute correctly", status: "Required" },
          { test: "EVT-07", description: "BFAC closed-loop test (biometric feedback)", pass: "Response ≤200ms", status: "If applicable" },
        ],
      },
      {
        heading: "2. DVT — Design Validation Test",
        body: "DVT validates the design for production. Performed on 5-10 units. Focus: environmental, EMC, reliability, safety compliance.",
        table: [
          { test: "DVT-01", description: "Environmental: temperature cycling (0-50°C, 10 cycles)", pass: "No failures, all specs met", status: "Required" },
          { test: "DVT-02", description: "Environmental: humidity (85% RH, 48h)", pass: "No corrosion, no functional failure", status: "Required" },
          { test: "DVT-03", description: "Environmental: vibration (ISTA 3A)", pass: "No mechanical damage", status: "Required" },
          { test: "DVT-04", description: "Environmental: drop test (1.0m, 6 faces)", pass: "No functional failure (portable class)", status: "If portable" },
          { test: "DVT-05", description: "EMC: radiated emissions (CISPR 11 Class B)", pass: "Below limits", status: "Required" },
          { test: "DVT-06", description: "EMC: conducted emissions", pass: "Below limits", status: "Required" },
          { test: "DVT-07", description: "EMC: ESD immunity (IEC 61000-4-2, ±8kV)", pass: "No functional disruption", status: "Required" },
          { test: "DVT-08", description: "Safety: IEC 60601-1 / UL 61010-1 compliance", pass: "Full compliance", status: "Required" },
          { test: "DVT-09", description: "Reliability: MTBF demonstration (1000h)", pass: "MTBF ≥ 5000h (DVT target)", status: "Required" },
          { test: "DVT-10", description: "Reliability: thermal cycling (100 cycles)", pass: "No solder joint failures", status: "Required" },
        ],
      },
      {
        heading: "3. PVT — Production Validation Test",
        body: "PVT validates the production line and process. Performed on 20-50 units. Focus: production yield, process capability, final quality audit.",
        table: [
          { test: "PVT-01", description: "Production line yield (target ≥95%)", pass: "Yield ≥95%", status: "Required" },
          { test: "PVT-02", description: "Process capability (Cpk ≥1.33 for critical params)", pass: "Cpk ≥1.33", status: "Required" },
          { test: "PVT-03", description: "Full functional test (100% of units)", pass: "All pass", status: "Required" },
          { test: "PVT-04", description: "Cosmetic audit (AQL 1.0)", pass: "Within AQL", status: "Required" },
          { test: "PVT-05", description: "Packaging verification (ISTA 3A)", pass: "No damage", status: "Required" },
          { test: "PVT-06", description: "Final documentation audit", pass: "Complete + Rev-controlled", status: "Required" },
        ],
      },
      {
        heading: "4. Safety Classification",
        body: `This device is classified as: ${safety}. All applicable safety standards must be met before any powered-on testing. Safety interlock verification is MANDATORY before each test session.`,
      },
    ],
  };
}

// ── Master Export: All Specs for All 50 Inventions ────────────────────────────

export function generateAllInventionSpecs() {
  return NEW_INVENTIONS.map(inv => ({
    invention: inv,
    prd: generatePRD(inv),
    pdr: generatePDR(inv),
    bom: generateBOM(inv),
    sow: generateSOW(inv),
    testPlan: generateTestPlan(inv),
  }));
}

export {
  generatePRD,
  generatePDR,
  generateBOM,
  generateSOW,
  generateTestPlan,
};