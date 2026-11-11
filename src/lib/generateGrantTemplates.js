import jsPDF from "jspdf";
import { TOP10, GRANT_DRAFTS } from "./investorDeckData";
import { GRANT_PROPOSALS } from "./filingPlaybook";

const GRANT_DRAFTS_BY_ID = Object.fromEntries(GRANT_DRAFTS.map((g) => [g.id, g]));

const money = (n) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}k}`);

// Submission-ready SBIR / grant template generator.
// Produces a complete proposal PDF per program, with all standard SBIR sections.

function newDoc() {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  return doc;
}

function buildProposal(doc, opts) {
  const M = 56;
  const W = doc.internal.pageSize.getWidth() - M * 2;
  let y = M;
  const ink = (txt, size, o = {}) => {
    doc.setFont("helvetica", o.bold ? "bold" : o.italic ? "italic" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...(o.color || [11, 17, 30]));
    const lines = doc.splitTextToSize(txt, W);
    lines.forEach((ln) => {
      if (y > doc.internal.pageSize.getHeight() - M) { doc.addPage(); y = M; }
      doc.text(ln, M, y);
      y += size * (o.lh || 1.32);
    });
    y += o.gap || 0;
  };
  const rule = () => { if (y > doc.internal.pageSize.getHeight() - M) { doc.addPage(); y = M; } doc.setDrawColor(209, 212, 220); doc.line(M, y, M + W, y); y += 9; };
  const h1 = (t) => { if (y > doc.internal.pageSize.getHeight() - 80) { doc.addPage(); y = M; } ink(t, 13, { bold: true, color: [6, 182, 212], gap: 4 }); rule(); };
  const para = (t, o = {}) => ink(t, 10, { ...o, gap: o.gap || 6 });
  const bullets = (arr, o = {}) => arr.forEach((b) => ink(`•  ${b}`, 10, { gap: 3, ...o }));

  // Cover sheet
  doc.setFillColor(11, 17, 30);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 110, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(251, 191, 36);
  doc.text(`${opts.program}`, M, 38);
  doc.setFontSize(17); doc.setTextColor(255, 255, 255);
  doc.text(doc.splitTextToSize(opts.title, W), M, 60);
  doc.setFontSize(8); doc.setTextColor(180, 180, 180);
  doc.text(`Applicant: ${opts.applicant}   |   PI: ${opts.pi}   |   Period: ${opts.period}   |   Amount: ${opts.amount}`, M, 92);
  y = 130;

  ink("PROJECT SUMMARY (one-page equivalent)", 10, { bold: true, color: [6, 182, 212], gap: 4 });
  para(opts.objective);
  ink("Innovation:", 10, { bold: true, gap: 2 });
  para(opts.innovation);
  rule();

  h1("1. IDENTIFICATION AND SIGNIFICANCE OF THE PROBLEM");
  para(opts.significance || "This project addresses a documented capability gap in its mission domain. The applicant has completed a Preliminary Design Review package and draft provisional claim scaffolds identifying a defensible apparatus. The significance of the work is measured by the field-validated outcome the Phase I effort produces, not by a prior performance claim.");
  para("Problem statement and gap:");
  bullets(opts.gap || []);
  rule();

  h1("2. PHASE I TECHNICAL OBJECTIVES");
  (opts.objectives || []).forEach((o, i) => ink(`Objective ${i + 1}. ${o}`, 10, { gap: 5 }));

  h1("3. WORK PLAN — TASKS, MILESTONES, DELIVERABLES");
  (opts.phase1_tasks || []).forEach((t, i) => {
    ink(`Task ${i + 1}. ${t.title || t}`, 10, { bold: true, gap: 2 });
    if (t.desc) para(t.desc, { gap: 5 });
    else ink("", 10, { gap: 2 });
  });
  ink("Milestones:", 10, { bold: true, gap: 2 });
  bullets(opts.milestones || []);
  ink("Deliverables:", 10, { bold: true, gap: 2 });
  bullets(opts.deliverables || []);
  rule();

  h1("4. RELATED WORK / STATE OF THE ART");
  para(opts.related || "A prior-art and novelty scan will be completed with registered patent counsel in parallel with the Phase I effort. The applicant is not aware of prior federal funding on this invention. The Preliminary Design Review (AX-ZDS-PDR-001 Rev 1.0) is on file.");
  rule();

  h1("5. KEY PERSONNEL");
  bullets(opts.personnel_lines || [opts.personnel]);
  rule();

  h1("6. FACILITIES, EQUIPMENT & RESOURCES");
  para(opts.facilities);
  rule();

  h1("7. COMMERCIALIZATION STRATEGY");
  para(opts.commercialization);
  rule();

  h1("8. BUDGET JUSTIFICATION (Phase I)");
  bullets(opts.budget || []);
  ink("Total Phase I: " + opts.amount, 10, { bold: true, color: [6, 182, 212], gap: 4 });
  rule();

  h1("9. SIMILAR OR PRIOR FEDERAL FUNDING");
  para(opts.similar_work);
  rule();

  if (opts.itar) {
    h1("10. EXPORT CONTROL / ITAR HANDLING");
    para(opts.itar, { color: [180, 83, 9] });
    rule();
  }

  ink("PREPARATION NOTE: This template is auto-generated from on-file project research data. A registered patent attorney must review the claim scaffolds referenced herein before any USPTO submission. Grant figures are draft estimates for the program; confirm the exact solicitation amounts, deadlines, and page limits on the agency portal before submission.", 8, { italic: true, color: [101, 117, 139], gap: 0 });
}

// ---- AFWERX SBIR Phase I (INV-01, ITAR) ----
export function generateAfwerxTemplate() {
  const g = GRANT_PROPOSALS[0];
  const doc = newDoc();
  buildProposal(doc, {
    program: g.program, title: g.title, applicant: g.applicant, pi: "Inventor (Principal Investigator, US person)",
    period: g.period, amount: g.amount,
    significance: "Distributed tactical operations increasingly rely on mesh radios whose keying trust assumptions break under node capture or quantum-decryption timelines. A node-level QKD integration removes central key-infrastructure dependence and establishes forward secrecy among dismounted, vehicle, and unattended-sensor peers.",
    gap: [
      "Tactical mesh keys are pre-shared or PKI-derived; capture compromises the network.",
      "No fielded low-SWaP node-level QKD + disruption-tolerant mesh stack.",
      "Link disruption in contested terrain causes mesh fragmentation and key-loss.",
    ],
    objectives: [
      "Integrate a low-SWaP QKD module with a software-defined mesh-radio and specify the key-interface.",
      "Build a benchtop two-node mesh demonstrator with store-and-forward routing.",
      "Characterize key-rate vs. link budget and mesh re-convergence time under induced link disruption.",
      "Deliver a Phase II plan with subsystem TRL targets and a transition pathway.",
    ],
    phase1_tasks: g.phase1_tasks.map((t, i) => ({ title: t, desc: ["Finalize QKD-module interface and key-exchange specification.", "Assemble two-node benchtop with COTS SDR + QKD.", "Measure key-rate vs. distance and re-convergence under forced link drops.", "Document Phase II TRL roadmap and prime-integrator transition path."][i] })),
    milestones: ["Month 1 — Interface spec frozen", "Month 2 — Two-node demonstrator operational", "Month 3 — Disruption characterization complete + Phase II plan"],
    deliverables: ["QKD-mesh interface specification", "Two-node benchtop demonstrator", "Characterization report (key-rate, re-convergence)", "Phase II proposal package"],
    personnel: g.personnel, facilities: g.facilities,
    commercialization: g.commercialization,
    budget: [
      "PI (0.5 FTE, 3 months) — $22,500",
      "RF/SDR engineer (1.0 FTE) — $30,000",
      "Cryptographer (0.5 FTE) — $12,000",
      "COTS QKD + SDR hardware — $6,000",
      "Shielded RF test enclosure — $2,500",
      "Indirect/overhead (≈ 5%) — $2,000",
    ],
    similar_work: g.similar_work, itar: g.itar,
  });
  doc.save("AFWERX-SBIR-INV01-Submission-Template.pdf");
}

// ---- Army ARL SBIR Phase I (INV-03, ITAR) ----
export function generateArmyArlTemplate() {
  const g = GRANT_PROPOSALS[1];
  const doc = newDoc();
  buildProposal(doc, {
    program: g.program, title: g.title, applicant: g.applicant, pi: "Inventor (Principal Investigator, US person)",
    period: g.period, amount: g.amount,
    significance: "Centralized swarm coordinators are single points of failure. A peer-placed coordination core that re-plans within seconds of agent loss enables resilient multi-agent missions under attrition and degraded comms.",
    gap: [
      "Centralized swarm stacks fail when the coordinator is lost.",
      "Re-assignment latency after attrition is unbounded in fielded systems.",
      "Heterogeneous-agent interoperability is limited.",
    ],
    objectives: [
      "Specify the peer coordination protocol and state-exchange format.",
      "Implement in simulation with 10–50 heterogeneous agents across mixed mission types.",
      "Characterize re-convergence time and mission-completion rate under induced attrition.",
      "Deliver a Phase II hardware-in-the-loop plan.",
    ],
    phase1_tasks: g.phase1_tasks.map((t, i) => ({ title: t, desc: ["Define peer protocol, state schema, and re-assignment algorithm.", "Build simulation with 10–50 agents across search, relay, and escort missions.", "Inject attrition and comms degradation; measure re-convergence and completion.", "Specify Phase II HIL environment and transition partners."][i] })),
    milestones: ["Month 2 — Protocol spec + simulation environment", "Month 4 — Attrition characterization complete", "Month 6 — Phase II HIL plan delivered"],
    deliverables: ["Peer coordination protocol specification", "Simulation environment + attrition dataset", "Re-convergence characterization report", "Phase II HIL proposal package"],
    personnel: g.personnel, facilities: g.facilities,
    commercialization: g.commercialization,
    budget: [
      "PI (0.5 FTE, 6 months) — $30,000",
      "Multi-agent AI engineer (1.0 FTE) — $45,000",
      "Simulation engineer (1.0 FTE) — $18,000",
      "Compute (GPU cloud) — $4,000",
      "Indirect/overhead (≈ 3%) — $3,000",
    ],
    similar_work: g.similar_work, itar: g.itar,
  });
  doc.save("Army-ARL-SBIR-INV03-Submission-Template.pdf");
}

// ---- NSF CBET — SVRRD (non-ITAR, fundable now) ----
export function generateNsfSvrrdTemplate() {
  const svrrd = TOP10.find((a) => a.name.includes("SVRRD"));
  const g = GRANT_DRAFTS_BY_ID["nsf-svrrd"];
  const doc = newDoc();
  buildProposal(doc, {
    program: "NSF CBET — Environmental Engineering / Water Science (EAGER / standard)",
    title: "Passive Vortex River-Restoration Device — Field Validation of Hydrodynamic Oxygenation",
    applicant: "Aethon Apex IP Holdings (small business, US-owned)",
    pi: "Inventor (Principal Investigator)", period: "12 months", amount: "$300,000 (EAGER / standard)",
    significance: "Degraded urban and agricultural streams suffer from low dissolved oxygen, elevated temperature, and loss of benthic habitat. A passive, no-external-power device that induces helical vortex flow to oxygenate and cool the water column offers a deployable, low-maintenance restoration tool. Hydrodynamic vortex oxygenation is physically grounded and measurable.",
    gap: [
      "Active aeration is energy-intensive and maintenance-heavy.",
      "Existing stream-restoration structures (weirs, rock vanes) do not reliably induce the helical flow that drives oxygen transfer.",
      "No passive, modular, anchor-able vortex device has been field-validated against a control reach.",
    ],
    objectives: [
      "Finalize the vortex-vane geometry from CFD and benchtop flume testing.",
      "Fabricate and install devices in a degraded stream reach alongside a control reach.",
      "Measure dissolved oxygen, temperature, and benthic habitat indicators over 6 months.",
      "Deliver a design guide and Phase II scaling plan.",
    ],
    phase1_tasks: [
      { title: "Task 1 — CFD + flume optimization of vortex-vane geometry", desc: "Iterate vane angle and spiral pitch in CFD; confirm in a benchtop flume with dye visualization." },
      { title: "Task 2 — Device fabrication and field installation", desc: "Fabricate 4–6 anchored devices; install in a permitted degraded reach with a paired control reach." },
      { title: "Task 3 — 6-month field monitoring", desc: "Weekly DO, temperature, flow; monthly benthic macroinvertebrate surveys upstream/downstream." },
      { title: "Task 4 — Design guide + Phase II plan", desc: "Publish a passive-vortex design guide; deliver Phase II multi-reach scaling plan." },
    ],
    milestones: ["Month 3 — Geometry frozen", "Month 4 — Devices installed", "Month 10 — Monitoring complete", "Month 12 — Design guide + Phase II plan"],
    deliverables: ["Vortex-vane geometry (CFD + flume validated)", "Field installation report", "6-month DO/temperature/habitat dataset vs. control", "Passive-vortex design guide + Phase II plan"],
    related: "No prior federal funding on this invention. The Schauberger implosion-principle framing is dropped; the work is presented as passive vortex hydrodynamics. Provisional claim scaffold on file (draft, counsel review pending).",
    personnel_lines: [
      "Principal Investigator (inventor) — 0.3 FTE",
      "Hydraulic engineer (CFD + flume) — 1.0 FTE",
      "Field ecologist (monitoring) — 0.5 FTE",
      "Fabrication technician — 0.25 FTE",
    ],
    facilities: "US-based lab with benchtop flume; permitted field site with state-agency cooperation; water-quality instrumentation (DO probes, thermistors, flow meters).",
    commercialization: "Stream-restoration consulting firms, municipalities, state environmental agencies, and watershed nonprofits. Non-ITAR. No regulatory burden beyond standard stream-work permits.",
    budget: [
      "PI (0.3 FTE, 12 months) — $18,000",
      "Hydraulic engineer (1.0 FTE) — $95,000",
      "Field ecologist (0.5 FTE) — $28,000",
      "Fabrication + materials — $35,000",
      "Instrumentation (DO, temp, flow) — $18,000",
      "Indirect (≈ 35% modified total direct) — included above",
    ],
    similar_work: "No prior federal funding. Internal PDR + draft claim scaffold complete.",
  });
  doc.save("NSF-CBET-SVRRD-Submission-Template.pdf");
}

// ---- USDA NIFA AFRI — MYTSA (non-ITAR, fundable now) ----
export function generateUsdaMysaTemplate() {
  const mysA = TOP10.find((a) => a.name.includes("MYTSA"));
  const doc = newDoc();
  buildProposal(doc, {
    program: "USDA NIFA — AFRI Foundational Program (Plant Health & Production)",
    title: "Low-Input Electromagnetic Field Array for Crop Yield — Replicated Split-Field Validation",
    applicant: "Aethon Apex IP Holdings (small business, US-owned)",
    pi: "Inventor (Principal Investigator)", period: "24 months (two seasons)", amount: "$500,000 (Foundational Program)",
    significance: "Reducing chemical inputs while sustaining yield is a foundational USDA goal. A perimeter electromagnetic-field-emission array targeting plant-specific resonance patterns offers a candidate non-chemical yield intervention. The apparatus is patentable; the yield claim (20–40%) is the hypothesis this project tests — not a stated result.",
    gap: [
      "Chemical-input reduction is a USDA priority with limited non-chemical yield tools.",
      "No replicated, controlled field trial of an EM-array yield intervention exists.",
      "Folk-science components (agnihotra, vortex-water) confound prior claims; a controlled trial isolates the EM-array effect.",
    ],
    objectives: [
      "Finalize the EM-array tower design and plant-species frequency templates.",
      "Run replicated split-field trials on two crop species over two seasons.",
      "Measure yield, soil microbiome, and input reduction vs. control plots.",
      "Deliver a Phase II multi-site plan and an extension-ready results brief.",
    ],
    phase1_tasks: [
      { title: "Task 1 — Array tower design + frequency-template library", desc: "Finalize tower hardware; compile plant-species frequency templates from published literature." },
      { title: "Task 2 — Year 1 split-field trial (two crops)", desc: "Replicated randomized complete-block design; treatment vs. control plots at a partner farm." },
      { title: "Task 3 — Year 2 repeat + soil microbiome assay", desc: "Repeat Year 1 design in a second season; add 16S/ITS soil microbiome sequencing." },
      { title: "Task 4 — Analysis + extension brief", desc: "Statistical yield analysis; publish an extension-ready brief; Phase II multi-site plan." },
    ],
    milestones: ["Month 6 — Towers + templates finalized", "Month 18 — Year 1 harvest complete", "Month 22 — Year 2 harvest complete", "Month 24 — Analysis + extension brief"],
    deliverables: ["EM-array tower design + frequency-template library", "Two-season replicated yield dataset (treatment vs. control)", "Soil microbiome dataset", "Extension brief + Phase II multi-site plan"],
    related: "No prior federal funding. Agnihotra and vortex-water framing dropped; only the EM-array apparatus is studied. Draft provisional claim scaffold on file (counsel review pending).",
    personnel_lines: [
      "Principal Investigator (inventor) — 0.2 FTE",
      "Agronomist (trial design + analysis) — 0.5 FTE",
      "Field technician — 1.0 FTE (seasonal)",
      "Soil microbiome (subcontracted lab) — fixed",
    ],
    facilities: "Partner research farm with randomized-block field capacity; US-based electronics build lab; subcontracted soil-sequencing facility.",
    commercialization: "Organic and regenerative growers, ag-tech distributors, USDA Extension. Non-ITAR. No pesticide registration; the array is a non-chemical apparatus.",
    budget: [
      "PI (0.2 FTE, 24 months) — $24,000",
      "Agronomist (0.5 FTE) — $60,000",
      "Field technician (seasonal) — $80,000",
      "Array hardware + install — $120,000",
      "Soil microbiome sequencing (subcontract) — $45,000",
      "Indirect (≈ 35%) — included above",
    ],
    similar_work: "No prior federal funding. Internal PDR + draft claim scaffold complete.",
  });
  doc.save("USDA-NIFA-MYTSA-Submission-Template.pdf");
}