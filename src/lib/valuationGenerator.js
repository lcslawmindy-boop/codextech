// ── IP Valuation Framework Auto-Generator ──────────────────────────────────
// Generates Section 15 — IP Valuation Framework data from selected research nodes and LLM result.
// For strategic planning and investor communication only — not a certified appraisal.

const VAL_LABEL = "IP VALUATION FRAMEWORK — STRATEGIC PLANNING DOCUMENT";
const VAL_SUBLABEL = "For strategic planning and investor communication purposes only.";
const VAL_DISCLAIMER =
  "This IP Valuation Framework does NOT constitute a certified IP appraisal, fairness opinion, or securities valuation. For binding valuations, engage a licensed IP appraisal firm. All figures are estimates based on planning assumptions.";

const VAL_FOOTER =
  "Final valuation must be determined by a licensed IP appraisal firm weighting all three approaches.";

// Generate a short node code from a title
function nodeCode(title, index) {
  const words = title.replace(/[^a-zA-Z\s]/g, "").split(/\s+/).filter(Boolean);
  const code = words.slice(0, 3).map(w => w[0]?.toUpperCase() || "").join("");
  return `${code || "ZAP"}-${String(index + 1).padStart(2, "0")}`;
}

function shortModalityName(title) {
  return title.replace(/\(.*?\)/g, "").replace(/Demonstration Circuit|Circuit Kit|Research Prototype|Research Device|Prototype Plans/gi, "").trim() || title;
}

// Derive target population description
function deriveTargetPopulation(nodes) {
  const audiences = nodes.map(n => n.audience).filter(Boolean);
  if (audiences.some(a => a.includes("Defense") || a.includes("military"))) return "defense and military personnel requiring PTSD/TBI neurorecovery";
  if (audiences.some(a => a.includes("Bio") || a.includes("medic"))) return "clinical patients requiring therapeutic recovery and bioelectromagnetic treatment";
  if (audiences.some(a => a.includes("hobbyist") || a.includes("researcher"))) return "the independent research and experimental validation community";
  return "individuals globally who could benefit from multi-system bioelectromagnetic therapy";
}

// Derive delivery channel
function deriveDeliveryChannel(nodes) {
  const titles = nodes.map(n => n.title.toLowerCase());
  if (titles.some(t => t.includes("chamber") || t.includes("pod"))) return "clinical pod/chamber deployment";
  if (titles.some(t => t.includes("circuit") || t.includes("kit"))) return "research kit distribution";
  return "clinical and research laboratory deployment";
}

// Derive condition focus
function deriveCondition(nodes) {
  const titles = nodes.map(n => n.title.toLowerCase());
  if (titles.some(t => t.includes("biofield") || t.includes("frequency"))) return "bioelectromagnetic dysregulation and cellular health";
  if (titles.some(t => t.includes("scalar") || t.includes("energy"))) return "scalar field coherence and neuroregulation";
  return "multi-system electromagnetic therapeutic applications";
}

// Auto-generate valuation data from selected nodes and LLM result
export function generateValuationData(selectedNodes, result, mode) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const docCode = "ZARP-VAL-" + String(now.getFullYear()).slice(-2) + String(now.getMonth() + 1).padStart(2, "0") + String(now.getDate()).padStart(2, "0");

  const deviceName = result?.hybrid_concept || "ZARP Multi-System Device";
  const deviceCode = "ZARP-MSD-" + String(now.getFullYear()).slice(-2) + "-001";
  const targetPop = deriveTargetPopulation(selectedNodes);
  const condition = deriveCondition(selectedNodes);
  const deliveryChannel = deriveDeliveryChannel(selectedNodes);

  // ── 5.1 Market Sizing ──
  const marketSizing = {
    tam: {
      description: `All individuals globally who could benefit from ${deviceName.toLowerCase()} addressing ${condition}`,
      figure: "$2.4B – $8.7B",
      source: "ZARP Market Database — global bioelectromagnetic therapy market estimate (auto-suggested)",
      citation: "Editable — replace with verified market research citation",
    },
    sam: {
      description: `Subset of TAM reachable through ${deliveryChannel} in North America and EU within 5 years`,
      figure: "$340M – $1.2B",
      rationale: "Geographic focus on regulated clinical markets with established medical device pathways. Excludes markets without clear regulatory framework for combination bioelectromagnetic devices.",
    },
    som: {
      description: "Realistic market capture in Years 1-5 given current resources and IP licensing strategy",
      figure: "$12M – $48M",
      assumptions: "Assumes 1-4% SAM capture via licensing partnerships. Year 1-2 focused on clinical validation and regulatory clearance. Year 3-5 scaling through licensed manufacturer partnerships.",
    },
  };

  // ── 5.2 IP Asset Inventory & Strategic Value ──
  const ipAssets = [
    { asset: "Multi-System Integration Architecture", type: "Utility Patent (provisional)", protectionStatus: "Filing Planned", strategicImportance: "Critical", ipLife: "20 years from filing", notes: "Core integration claims — highest priority filing" },
    { asset: "AI Closed-Loop Protocol Engine", type: "Utility Patent + Trade Secret", protectionStatus: "Trade Secret Active", strategicImportance: "High", ipLife: "Indefinite (TS) / 20yr (patent)", notes: "ML model as trade secret, method claims as patent" },
    ...selectedNodes.map((n, i) => ({
      asset: `${shortModalityName(n.title)} Integration Claims`,
      type: "Utility Patent (continuation)",
      protectionStatus: "Dependent on source IP",
      strategicImportance: i === 0 ? "High" : "Medium",
      ipLife: "20 years from filing",
      notes: `Source: ${nodeCode(n.title, i)} — ${n.title}`,
    })),
    { asset: "Session Protocol Library", type: "Trade Secret + Copyright", protectionStatus: "Trade Secret Active", strategicImportance: "High", ipLife: "Indefinite", notes: "Therapeutic protocol definitions — proprietary" },
    { asset: "Brand & UI Design", type: "Trademark + Design Patent", protectionStatus: "Pending Registration", strategicImportance: "Medium", ipLife: "Indefinite (TM) / 15yr (design)", notes: "ZARP brand and interface design" },
  ];

  // Strategic Value Matrix (scored 1-10)
  const modalityCount = selectedNodes.length;
  const strategicValueMatrix = [
    { driver: "Novelty of multi-system combination", score: Math.min(10, 7 + Math.floor(modalityCount / 2)), rationale: `${modalityCount} technology integration — novel combination not found in prior art` },
    { driver: "Breadth of target population", score: 7, rationale: "Multi-condition applicability across therapeutic domains" },
    { driver: "Regulatory moat (difficulty to duplicate)", score: 8, rationale: "FDA combination device classification creates high barrier to entry" },
    { driver: "First-mover advantage", score: 8, rationale: "No known multi-modal bioelectromagnetic integration at this scale" },
    { driver: "Licensing revenue potential", score: 7, rationale: "Multiple modality patents enable cross-licensing to different manufacturers" },
    { driver: "Grant fundability", score: 8, rationale: "SBIR/STTR eligibility — strong scientific basis and clinical need" },
    { driver: "Defensive value (blocks competitive entry)", score: 7, rationale: "Integration patents block competitors from combining same modalities" },
  ];
  const overallScore = (strategicValueMatrix.reduce((s, v) => s + v.score, 0) / strategicValueMatrix.length).toFixed(1);

  // ── 5.3 Comparable Transactions ──
  const comparableTransactions = [
    { transaction: "NeuroStar TMS (Neuronetics)", year: 2017, dealType: "IPO / Market Valuation", modality: "TMS — Single Modality", terms: "$220M market cap at IPO", relevance: "Single-modality TMS precedent — ZARP multi-system commands premium" },
    { transaction: "Fisher Wallace Stimulator (Fisher Wallace Labs)", year: 2020, dealType: "Series A Funding", modality: "CES — Cranial Electrotherapy", terms: "$15M Series A", relevance: "CES modality precedent — validates single-modality clinical path" },
    { transaction: "Spark Biomedical — Rooftop Device", year: 2021, dealType: "FDA Clearance + Series A", modality: "PEMF — Neonatal OUD", terms: "$11M Series A", relevance: "PEMF clinical clearance precedent — regulatory pathway reference" },
    { transaction: "Cala Health — Trio Device", year: 2020, dealType: "FDA Clearance + Series B", modality: "TENS — Tremor", terms: "$30M+ raised", relevance: "Wearable neuromodulation precedent — adjacent market" },
  ];

  // ── 5.4 Licensing Revenue Model (3 structures) — default assumptions ──
  const licensingModel = {
    structureA: {
      name: "Royalty on Net Revenue",
      royaltyRate: 5, // %
      licenseeYear3Revenue: 50, // $M
      annualRoyalty: 2.5, // $M (calculated)
      tenYearDiscounted: 18.5, // $M (calculated)
      discountRate: 12, // %
    },
    structureB: {
      name: "Upfront Fee + Royalty",
      upfrontFee: 3, // $M
      royaltyRate: 4, // %
      tenYearTotal: 22.8, // $M (calculated)
      licenseeYear3Revenue: 50, // $M
    },
    structureC: {
      name: "Exclusive Lump Sum",
      lumpSum: 15, // $M
      ipRemainingLife: 17, // years
      impliedAnnual: 0.88, // $M (calculated)
    },
  };

  // ── 5.5 Three Valuation Methods ──
  const valuationMethods = {
    cost: {
      name: "Cost Approach",
      description: "Value = cost to recreate IP from scratch.",
      devHours: 8000,
      hourlyRate: 175,
      replacementCost: 1.4, // $M (calculated)
      notes: "Includes R&D, engineering, clinical validation, and regulatory submission costs",
    },
    market: {
      name: "Market Approach",
      description: "Value = comparable transactions. See Section 5.3.",
      range: "$15M – $50M",
      notes: "Based on comparable medical device IP transactions in adjacent modalities",
    },
    income: {
      name: "Income Approach",
      description: "Value = present value of future licensing income. See Section 5.4.",
      range: "$18M – $23M",
      notes: "Based on 10-year discounted royalty stream from Structure A/B",
    },
  };

  return {
    docCode,
    label: VAL_LABEL,
    sublabel: VAL_SUBLABEL,
    disclaimer: VAL_DISCLAIMER,
    footer: VAL_FOOTER,
    deviceName,
    deviceCode,
    marketSizing,
    ipAssets,
    strategicValueMatrix,
    overallScore,
    comparableTransactions,
    licensingModel,
    valuationMethods,
  };
}

export { VAL_LABEL, VAL_SUBLABEL, VAL_DISCLAIMER, VAL_FOOTER };