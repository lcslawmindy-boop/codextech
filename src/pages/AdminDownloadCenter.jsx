import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileText, BookOpen, Film, ShoppingBag, Mail, Package, Lock, Loader2, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { jsPDF } from "jspdf";
import { base44 } from "@/api/base44Client";
import { THEME, drawLogo, drawPageHeader, drawFooter } from "../lib/zenithPdfTheme";
import NdaPdfGenerator from "../components/NdaPdfGenerator";
import DueDiligencePdfGenerator from "../components/DueDiligencePdfGenerator";

// ── SHARED PDF HELPERS ──────────────────────────────────────────────────────
function makeDoc() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  return doc;
}

function initPage(doc, title, subtitle) {
  const { pageBg } = THEME;
  doc.setFillColor(...pageBg);
  doc.rect(0, 0, 210, 297, "F");
  drawPageHeader(doc, title, subtitle);
  return 46;
}

function addBodyText(doc, text, y, color) {
  const { margin, pageW, silver } = THEME;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...(color || silver));
  const lines = doc.splitTextToSize(text, pageW - margin * 2);
  lines.forEach(l => {
    if (y > 278) { doc.addPage(); doc.setFillColor(...THEME.pageBg); doc.rect(0,0,210,297,"F"); drawPageHeader(doc, title, subtitle); y = 46; }
    doc.text(l, margin, y); y += 5.8;
  });
  return y + 3;
}

function sectionH1(doc, text, y) {
  const { margin, pageW, accentBg, gold } = THEME;
  if (y > 270) { doc.addPage(); doc.setFillColor(...THEME.pageBg); doc.rect(0,0,210,297,"F"); y = 20; }
  doc.setFillColor(...accentBg);
  doc.rect(0, y - 4, pageW, 13, "F");
  doc.setFillColor(...gold);
  doc.rect(0, y - 4, 3, 13, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...gold);
  doc.text(text, margin + 5, y + 4);
  return y + 16;
}

function bulletList(doc, items, y) {
  const { margin, pageW, silver } = THEME;
  items.forEach(item => {
    if (y > 278) { doc.addPage(); doc.setFillColor(...THEME.pageBg); doc.rect(0,0,210,297,"F"); y = 20; }
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...silver);
    doc.setFillColor(...THEME.gold);
    doc.circle(margin + 2, y - 1, 1, "F");
    const lines = doc.splitTextToSize(item, pageW - margin * 2 - 8);
    lines.forEach((l, li) => { doc.text(l, margin + 6, y + li * 5.5); });
    y += lines.length * 5.5 + 2;
  });
  return y + 2;
}

function applyFooters(doc, label) {
  const n = doc.getNumberOfPages();
  for (let p = 1; p <= n; p++) { doc.setPage(p); drawFooter(doc, p, n, label); }
}

// ── MASTER LETTER PDF ──────────────────────────────────────────────────────
const MASTER_LETTER = `STRICTLY CONFIDENTIAL — NDA REQUIRED BEFORE FURTHER DISCLOSURE

Dear [RECIPIENT NAME],

I am writing to offer you a time-limited, exclusive first-look at an acquisition that does not come to market twice.

The Zenith Apex Advanced Research Platform is the world's only commercially structured, production-ready AI-powered knowledge and IP generation platform built around the suppressed physics and biology research of Lt. Col. Thomas E. Bearden (ret.) — cross-referenced against primary US government documents, peer-reviewed publications, and declassified archives that validate the core claims.

PLATFORM FAIR MARKET VALUE (Q2 2026)

  AI Invention Forge Engine ............. $380K – $950K
  AI Market Research Scanner ............ $220K – $580K
  USPTO Provisional Patent Drafter ....... $150K – $380K
  VC Pitch Deck + Build Video Engine .... $120K – $280K
  Scalar Field / Wave Simulators ......... $80K – $175K
  Bearden Knowledge Graph (200+ nodes) .. $220K – $420K
  Course Catalog (20+ courses, LMS) ..... $150K – $320K
  Invention Build Plan Library ........... $450K – $1.2M
  Annotated Primary Document Archive .... $120K – $280K
  IP Portfolio (MEG, TRZ, TRD-1) ........ $1.8M – $6.5M
  Prior Art Archive + Patent AI ......... $95K – $240K
  Health + CRM + Monitoring Suite ....... $110K – $220K

  PLATFORM TOTAL (conservative):    $3.9M – $11.5M
  + Strategic pre-public premium:    $5.5M – $25.3M

ACQUISITION TERMS

EXCLUSIVE ACQUISITION:          $6.5M – $18M
LICENSING ONLY (annual):        $650,000 – $1,500,000/yr
AI MODULE WHITE-LABEL (SaaS):   $280,000 – $750,000/yr per licensee
STRATEGIC PARTNERSHIP / JV:     Equity terms, negotiable

TO PROCEED:
1. Reply to confirm interest and receive NDA
2. Execute NDA and provide proof of funds
3. Receive 100+ page technical due diligence package
4. Schedule live platform demonstration

Sincerely,
[YOUR NAME]
Zenith Apex Research Portfolio
[YOUR EMAIL] | [YOUR PHONE]`;

function generateMasterLetterPDF() {
  const doc = makeDoc();
  const { margin, pageW, gold, white, silver, muted, cardBg, pageBg } = THEME;
  doc.setFillColor(...pageBg); doc.rect(0,0,210,297,"F");

  // Cover band
  doc.setFillColor(...[8,18,60]); doc.rect(0,0,pageW,55,"F");
  doc.setFillColor(...gold); doc.rect(0,0,pageW,2,"F"); doc.rect(0,53,pageW,2,"F");
  drawLogo(doc, pageW/2-14, 10, 28);
  doc.setFontSize(9); doc.setFont("helvetica","bold"); doc.setTextColor(...gold);
  doc.text("ZENITH APEX RESEARCH PORTFOLIO", pageW/2, 48, {align:"center"});

  let y = 68;
  doc.setFontSize(20); doc.setFont("helvetica","bold"); doc.setTextColor(...white);
  doc.text("MASTER ACQUISITION LETTER", pageW/2, y, {align:"center"}); y+=8;
  doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(...muted);
  doc.text("Confidential — Personalize Before Sending — NDA Required", pageW/2, y, {align:"center"}); y+=12;

  // Letter body in card
  doc.setFillColor(...cardBg);
  doc.setDrawColor(...gold); doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, pageW-margin*2, 8, 2, 2, "FD");
  doc.setFontSize(8); doc.setFont("helvetica","bold"); doc.setTextColor(...gold);
  doc.text("⚠  Replace [YOUR NAME], [YOUR EMAIL], [YOUR PHONE], [RECIPIENT NAME] before sending", margin+4, y+5); y+=14;

  doc.setFontSize(9.5); doc.setFont("helvetica","normal"); doc.setTextColor(...silver);
  const lines = doc.splitTextToSize(MASTER_LETTER, pageW-margin*2);
  lines.forEach(l => {
    if (y > 278) { doc.addPage(); doc.setFillColor(...pageBg); doc.rect(0,0,210,297,"F"); y=18; }
    doc.text(l, margin, y); y+=5.5;
  });

  applyFooters(doc, "MASTER LETTER");
  doc.save("zenith-apex-master-letter.pdf");
}

// ── INVENTION PLANS PDF ────────────────────────────────────────────────────
function generateInventionPlansPDF() {
  const doc = makeDoc();
  let y = initPage(doc, "INVENTION BUILD PLANS", "Complete Technical Specifications");
  const { margin, pageW, gold, silver, muted, cardBg, green, accentBg } = THEME;

  y = sectionH1(doc, "INVENTION BUILD PLANS — COMPLETE TECHNICAL PORTFOLIO", y);

  doc.setFontSize(10); doc.setFont("helvetica","normal"); doc.setTextColor(...muted);
  doc.text("All invention build plans include: Bill of Materials, step-by-step assembly guide, operating parameters, safety protocols, and theoretical basis.", margin, y); y+=14;

  const inventions = [
    {
      name: "Motionless Electromagnetic Generator (MEG)",
      subtitle: "COP >> 1 Overunity Device — Peer-Reviewed",
      patent: "US Patent 6,362,718 (Bearden et al., issued March 26, 2002)",
      theory: "Asymmetric regauging of scalar potential via permanent magnet remanence. O(3) symmetry electrodynamics. Validated: Foundations of Physics Letters 14(1), 2001 — 15 authors, 12 institutions. Independently replicated by Naudin (France).",
      specs: [
        "Core Material: Nanocrystalline METGLAS 2605SC flux-transfer alloy",
        "Magnet: NdFeB Grade N52, 2.5\" × 1.5\" × 0.5\"",
        "Primary Coil: 850 turns #26 AWG bifilar wound",
        "Secondary Coil: 1,200 turns #30 AWG, center-tapped",
        "Control Circuit: MOSFET H-bridge, 12V/20A rated",
        "Operating Frequency: 2.8–4.2 kHz resonant",
        "Input Power: 6–12W DC nominal",
        "Claimed Output: COP 2.0–5.0 (verified by Anastasovski et al.)",
      ],
      bom: ["METGLAS 2605SC core (2× $145)", "N52 NdFeB magnets (4× $28)", "#26 AWG bifilar magnet wire (500ft, $62)", "#30 AWG magnet wire (500ft, $48)", "IRFP460 MOSFETs (4× $8)", "Ferrite toroids (6× $12)", "PCB substrate + components ($85)", "Gauss meter (calibrated, $220)", "Oscilloscope probes ($45)"],
      steps: ["Wind primary bifilar coil on METGLAS core per spec", "Install NdFeB magnets in opposing flux configuration", "Wind secondary coil with center-tap", "Assemble MOSFET H-bridge control circuit", "Connect oscilloscope to output terminals", "Power up at 2.8 kHz and measure COP", "Tune frequency for resonance peak", "Log output vs input for 24-hour stability test"]
    },
    {
      name: "Telomere Regeneration Device (TRD-1)",
      subtitle: "MCCS Photon Therapy — Bearden Protocol",
      patent: "Patent Pending — based on Bearden MCCS framework",
      theory: "Multiwave Coherent Cellular Stimulation targeting telomere extension via coherent EM resonance at biological frequencies. Grounded in Fröhlich's biological coherence (Collective Phenomena, 1973). ONR London Report R-5-78 validation of EM biological effects.",
      specs: [
        "Carrier Frequency: 3.1 GHz (primary) + 760 MHz (secondary)",
        "Modulation: Scalar wave phase-conjugate pulsing",
        "Session Duration: 3 × 30 seconds per treatment cycle",
        "Field Intensity: 0.8–2.4 mW/cm² at target surface",
        "Scalar Coil Diameter: 6\" bifilar wound toroid",
        "Power Supply: 5V/3A regulated DC",
        "Enclosure: Copper-shielded Faraday cage (12\" × 12\" × 8\")",
        "Control: Microcontroller timer (Arduino Nano or equiv.)",
      ],
      bom: ["Bifilar toroid coil #18 AWG (6\" form, $38)", "Signal generator 1Hz–100MHz ($185)", "3.1 GHz oscillator module ($95)", "Copper shielding tape 3\" roll ($28)", "Arduino Nano microcontroller ($18)", "RF power amplifier 2W ($72)", "Faraday enclosure hardware ($65)", "BNC connectors and cable ($32)"],
      steps: ["Wind 6\" bifilar toroid with 120 turns each direction", "Install in copper-shielded enclosure", "Connect signal generator to primary coil terminal", "Program Arduino timer for 3×30s protocol", "Calibrate field intensity at 1.5 mW/cm² target", "Perform baseline biomarker test (optional)", "Run first session at minimum intensity", "Document session log for each use"]
    },
    {
      name: "Scalar Wave Communication Transmitter (G-Com Mk I)",
      subtitle: "Longitudinal Wave Transmission — No EM Pollution",
      patent: "Concept based on Bearden G-Com / longitudinal wave framework",
      theory: "Transmits information via longitudinal (scalar) wave mode rather than transverse EM. Immune to conventional ECM, passes through Earth and water, no electromagnetic radiation. Based on Bearden's documented G-Com concept for US defense applications.",
      specs: [
        "Transmission Mode: Longitudinal (scalar) not transverse EM",
        "Frequency Range: 3–30 kHz sub-ELF band",
        "Antenna: Contra-wound bifilar coil (cancels EM radiation)",
        "Modulation: Phase-conjugate AM over scalar carrier",
        "Range (theoretical): Planetary (attenuates through Earth)",
        "Power: 50W RF input, scalar output unmeasurable by standard instruments",
        "Detection: Matched bifilar receiver coil required",
        "Shielding: Standard EM shielding does NOT block signal",
      ],
      bom: ["Contra-wound bifilar antenna form 12\" ($55)", "#12 AWG solid copper wire (200ft, $95)", "50W RF amplifier kit ($145)", "Signal generator (DDS type, $85)", "Phase conjugation circuit board ($120)", "Matched receiver bifilar coil ($55)", "Oscilloscope (100 MHz minimum, $320)", "Grounding rod set ($35)"],
      steps: ["Wind contra-wound bifilar antenna (equal turns, opposing directions)", "Verify EM cancellation with gauss meter", "Connect DDS signal generator to phase conjugation board", "Build matched receiver coil to identical spec", "Transmit test signal at 10 kHz", "Verify scalar reception at matched receiver", "Measure signal through Faraday cage (should pass)", "Document penetration depth experiments"]
    },
    {
      name: "Portable Priore-Class EM Treatment System",
      subtitle: "Scalar EM Disease Reversal — ONR Validated",
      patent: "Based on French Patent 1,342,772 (Priore, A.)",
      theory: "Electromagnetic field in the 17.6 MHz range with specific modulation parameters reverses cellular pathology via phase-conjugate pumping of cellular voltage clamps. Validated: ONR London Branch Report R-5-78 (J.B. Bateman, 1978, UNCLASSIFIED). Nobel laureate André Lwoff (1965) personally validated experimental results.",
      specs: [
        "Primary Carrier: 17.6 MHz RF (per Priore patent spec)",
        "Modulation Frequencies: 9.4 GHz rotating magnetic field overlay",
        "Plasma Tube: Helium-neon mix, 12\" × 2\" cylindrical",
        "Magnetic Field: Rotating 2,000 Gauss toroidal",
        "Treatment Volume: 18\" diameter sphere at device center",
        "Power: 3-phase 220V input, 1.2 kW draw",
        "Session Protocol: 20-minute exposure at 0.5m",
        "Form Factor: Suitcase portable (28\" × 18\" × 12\", 45 lbs)",
      ],
      bom: ["He-Ne plasma tube custom ($380)", "17.6 MHz RF oscillator ($125)", "9.4 GHz microwave source ($285)", "Rotating magnet assembly (custom wound, $420)", "3-phase power conditioner ($195)", "RF amplifier 200W ($340)", "Plasma tube driver circuit ($165)", "Aluminum suitcase enclosure ($145)"],
      steps: ["Fabricate rotating magnetic field assembly", "Install He-Ne plasma tube at center", "Connect 17.6 MHz RF to plasma driver", "Add 9.4 GHz modulation overlay circuit", "Commission 3-phase power input", "Test plasma ignition and stability", "Calibrate field intensity at treatment distance", "Document treatment protocol per Priore parameters"]
    },
    {
      name: "Time-Reversal Zone Cold Fusion Reactor (TRZ-1)",
      subtitle: "Anomalous Transmutation — 73 Sigma Validated",
      patent: "TRZ/PPA Patent Application Series — 31 figures",
      theory: "In regions where advanced potentials dominate retarded potentials, nuclear transmutation occurs at anomalously low energies. China Lake Naval Weapons Center: 73 sigma above background. Shoulder & Fox and Japanese SRI replication series. Phase-conjugate pumping of local vacuum establishes time-reversal zone in small active volume.",
      specs: [
        "Reaction Volume: 2cm³ palladium cathode matrix",
        "Electrolyte: Heavy water (D₂O) + LiOD 0.1M",
        "Cathode Loading: D/Pd ratio ≥ 0.87 required",
        "Phase-Conjugate Pump: 4-wave mixing at 532 nm",
        "Input Power: 12W DC electrolysis",
        "Excess Heat (measured): 3.5–18W above baseline",
        "Transmutation Products: He-4 (2.5 × 10¹¹ atoms/watt-second)",
        "Safety: Minimal radiation (below background in all measurements)",
      ],
      bom: ["Palladium rod cathode 99.9% (6mm × 20mm, $285)", "Platinum wire anode (0.5mm × 200mm, $95)", "Heavy water D₂O (100mL, $145)", "LiOD lithium deuteroxide ($65)", "Glass electrolytic cell ($45)", "Precision current source 0–5A ($185)", "Calorimeter (isoperibolic, $320)", "532nm laser diode module ($95)"],
      steps: ["Prepare palladium cathode (anneal at 800°C, 2 hours)", "Load D₂O + LiOD electrolyte in glass cell", "Begin electrolysis at 50mA, ramp to 500mA over 24h", "Monitor D/Pd loading ratio until ≥ 0.87", "Activate phase-conjugate pump at loading threshold", "Measure calorimeter baseline for 48 hours", "Document excess heat events and transmutation products", "Log all anomalous readings with timestamps"]
    },
  ];

  inventions.forEach((inv, idx) => {
    if (idx > 0) { doc.addPage(); doc.setFillColor(...THEME.pageBg); doc.rect(0,0,210,297,"F"); drawPageHeader(doc,"INVENTION BUILD PLANS","Technical Specifications"); y=46; }

    // Invention header card
    doc.setFillColor(...THEME.cardBg);
    doc.setDrawColor(...gold); doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, pageW-margin*2, 22, 3, 3, "FD");
    doc.setFontSize(13); doc.setFont("helvetica","bold"); doc.setTextColor(...white);
    doc.text(inv.name, margin+6, y+9);
    doc.setFontSize(8.5); doc.setFont("helvetica","italic"); doc.setTextColor(...muted);
    doc.text(inv.subtitle, margin+6, y+16);
    doc.setFontSize(7.5); doc.setFont("helvetica","normal"); doc.setTextColor(...THEME.dimmed);
    doc.text(inv.patent, pageW-margin-4, y+16, {align:"right"});
    y += 28;

    doc.setFontSize(9.5); doc.setFont("helvetica","bold"); doc.setTextColor(...gold);
    doc.text("THEORETICAL BASIS", margin, y); y+=6;
    doc.setFont("helvetica","normal"); doc.setTextColor(...silver);
    const thLines = doc.splitTextToSize(inv.theory, pageW-margin*2);
    thLines.forEach(l => { doc.text(l, margin, y); y+=5.5; });
    y += 5;

    // Specs table
    y = sectionH1(doc, "TECHNICAL SPECIFICATIONS", y);
    inv.specs.forEach(spec => {
      if (y > 278) { doc.addPage(); doc.setFillColor(...THEME.pageBg); doc.rect(0,0,210,297,"F"); y=20; }
      const [label, ...rest] = spec.split(":");
      doc.setFontSize(9); doc.setFont("helvetica","bold"); doc.setTextColor(...THEME.goldLight);
      doc.text(label+":", margin+3, y);
      doc.setFont("helvetica","normal"); doc.setTextColor(...silver);
      doc.text(rest.join(":").trim(), margin+60, y);
      y += 5.8;
    });
    y += 4;

    // BOM
    y = sectionH1(doc, "BILL OF MATERIALS", y);
    y = bulletList(doc, inv.bom, y);

    // Assembly Steps
    y = sectionH1(doc, "ASSEMBLY STEPS", y);
    inv.steps.forEach((step, si) => {
      if (y > 278) { doc.addPage(); doc.setFillColor(...THEME.pageBg); doc.rect(0,0,210,297,"F"); y=20; }
      doc.setFontSize(9.5); doc.setFont("helvetica","bold"); doc.setTextColor(...gold);
      doc.text(`Step ${si+1}:`, margin, y);
      doc.setFont("helvetica","normal"); doc.setTextColor(...silver);
      doc.text(step, margin+18, y);
      y+=6;
    });
  });

  applyFooters(doc, "INVENTION BUILD PLANS");
  doc.save("zenith-apex-invention-build-plans.pdf");
}

// ── COURSE CATALOG PDF ─────────────────────────────────────────────────────
function generateCourseCatalogPDF() {
  const doc = makeDoc();
  let y = initPage(doc, "COURSE CATALOG", "Complete Educational Program");
  const { margin, pageW, gold, silver, muted, white, cardBg } = THEME;

  y = sectionH1(doc, "ZENITH APEX COURSE CATALOG — Q2 2026", y);
  doc.setFontSize(10); doc.setFont("helvetica","normal"); doc.setTextColor(...muted);
  doc.text("20+ professionally developed courses covering scalar electromagnetics, IP strategy, health, and advanced physics.", margin, y); y+=12;

  const courses = [
    { title: "Scalar Electromagnetics Fundamentals", price: "$297", modules: ["Maxwell's original quaternion equations", "The Heaviside truncation — what was removed", "O(3) symmetry electrodynamics", "Scalar potential and the active vacuum", "Phase conjugation basics", "Overunity: thermodynamic permission proof"] },
    { title: "MEG Replication Workshop", price: "$397", modules: ["METGLAS core preparation and annealing", "Bifilar winding technique and theory", "MOSFET H-bridge control circuit", "Frequency optimization for COP peak", "Measurement protocols (true COP calculation)", "Common failure modes and diagnosis"] },
    { title: "Priore Device: History & Replication", price: "$297", modules: ["ONR London Report R-5-78 deep dive", "André Lwoff Nobel validation — full story", "French Patent 1,342,772 engineering analysis", "17.6 MHz + 9.4 GHz parameter derivation", "Plasma tube fabrication and tuning", "Clinical protocol documentation"] },
    { title: "USPTO Patent Strategy for Frontier Tech", price: "$347", modules: ["Provisional vs. non-provisional PPA strategy", "Prior art search in contested technology domains", "Claim drafting for scalar EM devices", "International PCT filing strategy", "Overcoming patent examiner objections", "Portfolio building and defensive publication"] },
    { title: "Bioelectromagnetics & Healing Devices", price: "$297", modules: ["Fröhlich coherence in biological systems", "Bearden MCCS telomere restoration protocol", "TRD-1 build and calibration", "ELF biological effects (peer-reviewed)", "Rife frequency work — primary sources", "Legal and regulatory framework"] },
    { title: "Psychoenergetics & Consciousness", price: "$247", modules: ["Bearden Excalibur Briefing analysis", "Quantum potential and mind-matter coupling", "Hyperspatial channel theory", "US government psychoenergetics programs", "Intention-based engineering framework", "Practical applications and protocols"] },
    { title: "EMF Protection: Science & Practice", price: "$197", modules: ["EMF spectrum and biological impact", "Faraday cage design and construction", "Scalar countermeasures (personal scale)", "Home protection protocol", "Water structuring for EMF mitigation", "Supplement protocol for heavy metal detox"] },
    { title: "Scalar Wave Communication Systems", price: "$347", modules: ["Longitudinal wave physics and generation", "G-Com concept: US defense background", "Contra-wound antenna design", "Phase-conjugate modulation", "Receiver design and sensitivity", "Underground and underwater propagation"] },
    { title: "Advanced Investor Presentation Skills", price: "$197", modules: ["Pitching suppressed technology to VCs", "Due diligence documentation strategy", "NDA negotiation for IP deals", "Valuation methodologies for frontier tech", "Structuring licensing vs. acquisition deals", "Term sheet analysis and negotiation"] },
    { title: "Time-Reversal Zone Physics", price: "$347", modules: ["TRZ theoretical framework derivation", "China Lake 73-sigma experiments — full analysis", "Cold fusion: real mechanism vs. mainstream rejection", "Shoulder & Fox transmutation work", "Japanese SRI replication series", "TRZ device engineering pathway"] },
  ];

  courses.forEach((course, idx) => {
    if (y > 240) { doc.addPage(); doc.setFillColor(...THEME.pageBg); doc.rect(0,0,210,297,"F"); drawPageHeader(doc,"COURSE CATALOG","Educational Program"); y=46; }
    doc.setFillColor(...THEME.cardBg);
    doc.setDrawColor(...gold); doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, pageW-margin*2, 9, 2, 2, "FD");
    doc.setFontSize(10); doc.setFont("helvetica","bold"); doc.setTextColor(...white);
    doc.text(`${idx+1}. ${course.title}`, margin+4, y+6);
    doc.setFont("helvetica","bold"); doc.setTextColor(...gold);
    doc.text(course.price, pageW-margin-4, y+6, {align:"right"});
    y += 13;
    course.modules.forEach(m => {
      if (y > 280) { doc.addPage(); doc.setFillColor(...THEME.pageBg); doc.rect(0,0,210,297,"F"); y=20; }
      doc.setFillColor(...gold); doc.circle(margin+5, y-1.5, 0.8, "F");
      doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(...silver);
      doc.text(m, margin+9, y); y+=5.5;
    });
    y += 6;
  });

  applyFooters(doc, "COURSE CATALOG");
  doc.save("zenith-apex-course-catalog.pdf");
}

// ── ECOMMERCE SHOP PDF ─────────────────────────────────────────────────────
function generateShopCatalogPDF() {
  const doc = makeDoc();
  let y = initPage(doc, "EMF PROTECTION SHOP", "Product Catalog & Specifications");
  const { margin, pageW, gold, silver, muted, white, cardBg, green } = THEME;

  y = sectionH1(doc, "ZENITH APEX EMF PROTECTION PRODUCT CATALOG", y);

  const categories = [
    {
      name: "Personal EMF Protection Jewelry",
      items: [
        { name: "Scalar Resonance Pendant — Tourmaline Core", price: "$189", spec: "Black tourmaline + shungite composite, 14k gold-filled setting, resonates at 7.83 Hz Schumann frequency. 24\" sterling chain included." },
        { name: "Orgonite Protection Bracelet — Tri-Metal", price: "$95", spec: "Copper, silver, gold filings in resin matrix with quartz crystal termination. 8mm beads, elastic fit, sizes S/M/L." },
        { name: "Scalar Field Ring — Sterling Silver", price: "$145", spec: "Bifilar-wound sterling silver wire ring, scalar field generation via contra-winding. Sizes 5–12." },
        { name: "EMF Shield Pendant — Shungite Elite", price: "$225", spec: "Grade III elite shungite (98% carbon), natural formation, no additives. 40×30mm, silver bail." },
      ]
    },
    {
      name: "Home & Office EMF Protection",
      items: [
        { name: "Personal Scalar Field Generator — Desktop", price: "$495", spec: "Generates coherent 7.83 Hz Schumann resonance field, 12ft radius. USB powered, 5V/1A." },
        { name: "Faraday Cage — Electronics Enclosure (Large)", price: "$285", spec: "Copper mesh, 40dB attenuation, 18\"×14\"×10\", locking lid, ground strap." },
        { name: "Smart Meter Guard — RF Shield", price: "$69", spec: "Reduces smart meter RF emissions 98% (20dB). Stainless steel mesh, universal fit." },
        { name: "EMF Protection Paint — Graphene Shielding", price: "$185", spec: "Water-based graphene+carbon black, 1 liter covers 40 sq ft, 35dB shielding at 1-10 GHz." },
      ]
    },
    {
      name: "Supplements & Detox Protocols",
      items: [
        { name: "Heavy Metal Detox Protocol — 30 Day", price: "$129", spec: "Chlorella 1500mg + spirulina 1000mg + modified citrus pectin 5g + NAC 600mg. Daily protocol." },
        { name: "Mineral Replenishment Complex", price: "$89", spec: "Zinc 25mg, magnesium glycinate 400mg, selenium 200mcg, boron 3mg. 90 capsules." },
        { name: "Structured Water Unit — Inline", price: "$395", spec: "Vortex + far-infrared + magnetic restructuring. Fits 1/2\" and 3/4\" pipe. Stainless housing." },
        { name: "Methylene Blue Solution — Pharmaceutical Grade", price: "$65", spec: "0.5% solution, 100mL dropper bottle. Pharmaceutical grade, certificate of analysis included." },
      ]
    },
    {
      name: "Scalar EM Research Equipment",
      items: [
        { name: "Tri-Axis Gaussmeter — Professional", price: "$895", spec: "0.01 mG resolution, 0.3Hz–100kHz frequency range, USB data logging, NIST calibration cert." },
        { name: "Bifilar Coil Kit — Research Grade", price: "$245", spec: "10 pre-wound bifilar toroids (3\"–8\" sizes), #18/#22/#26 AWG options, termination lugs." },
        { name: "Scalar Wave Receiver Module", price: "$385", spec: "Matched bifilar receiver, 3–30 kHz, BNC output, 140dB dynamic range, spectrum analyzer compatible." },
      ]
    }
  ];

  categories.forEach(cat => {
    if (y > 240) { doc.addPage(); doc.setFillColor(...THEME.pageBg); doc.rect(0,0,210,297,"F"); drawPageHeader(doc,"EMF PROTECTION SHOP","Product Catalog"); y=46; }
    y = sectionH1(doc, cat.name.toUpperCase(), y);
    cat.items.forEach(item => {
      if (y > 268) { doc.addPage(); doc.setFillColor(...THEME.pageBg); doc.rect(0,0,210,297,"F"); y=20; }
      doc.setFontSize(10); doc.setFont("helvetica","bold"); doc.setTextColor(...white);
      doc.text(item.name, margin, y);
      doc.setFont("helvetica","bold"); doc.setTextColor(...gold);
      doc.text(item.price, pageW-margin, y, {align:"right"});
      y += 6;
      doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(...muted);
      const specLines = doc.splitTextToSize(item.spec, pageW-margin*2);
      specLines.forEach(l => { doc.text(l, margin+3, y); y+=5; });
      y += 4;
      doc.setFillColor(...[15,28,70]); doc.rect(margin, y, pageW-margin*2, 0.2, "F"); y+=5;
    });
    y += 4;
  });

  applyFooters(doc, "SHOP CATALOG");
  doc.save("zenith-apex-shop-catalog.pdf");
}

// ── BUILD VIDEOS PDF ────────────────────────────────────────────────────────
function BuildVideosPDF({ videos }) {
  const doc = makeDoc();
  let y = initPage(doc, "BUILD VIDEO LIBRARY", "All Invention Build Guides");
  const { margin, pageW, gold, silver, muted, white, cardBg } = THEME;

  y = sectionH1(doc, `BUILD VIDEO LIBRARY — ${videos.length} GUIDES`, y);
  doc.setFontSize(10); doc.setFont("helvetica","normal"); doc.setTextColor(...muted);
  doc.text("Each guide contains 10 step-by-step assembly instructions with materials, tools, safety warnings, and checkpoints.", margin, y); y+=12;

  if (!videos.length) {
    doc.setFontSize(11); doc.setTextColor(...muted);
    doc.text("No build videos have been generated yet. Use the Invention Forge to generate build guides.", margin, y);
  }

  videos.forEach((video, vi) => {
    if (vi > 0 || y > 200) { doc.addPage(); doc.setFillColor(...THEME.pageBg); doc.rect(0,0,210,297,"F"); drawPageHeader(doc,"BUILD VIDEO LIBRARY","Step-by-Step Guides"); y=46; }

    doc.setFillColor(...cardBg);
    doc.setDrawColor(...gold); doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, pageW-margin*2, 16, 3, 3, "FD");
    doc.setFontSize(12); doc.setFont("helvetica","bold"); doc.setTextColor(...white);
    doc.text(video.invention_name || "Build Guide", margin+6, y+7);
    doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.setTextColor(...muted);
    doc.text(`Category: ${video.invention_category || "—"}  ·  ${(video.steps||[]).length} Steps  ·  Generated ${video.created_date ? new Date(video.created_date).toLocaleDateString() : ""}`, margin+6, y+13);
    y += 22;

    if (video.invention_tagline) {
      doc.setFontSize(9); doc.setFont("helvetica","italic"); doc.setTextColor(...muted);
      doc.text(`"${video.invention_tagline}"`, margin, y); y+=8;
    }

    (video.steps || []).forEach((step, si) => {
      if (y > 265) { doc.addPage(); doc.setFillColor(...THEME.pageBg); doc.rect(0,0,210,297,"F"); y=20; }

      doc.setFillColor(...THEME.accentBg);
      doc.rect(margin, y-2, pageW-margin*2, 8, "F");
      doc.setFontSize(9); doc.setFont("helvetica","bold"); doc.setTextColor(...gold);
      doc.text(`Step ${si+1}: ${step.title || ""}`, margin+3, y+3);
      doc.setFont("helvetica","normal"); doc.setTextColor(...muted);
      doc.text(step.type || "", pageW-margin-3, y+3, {align:"right"});
      y += 11;

      if (step.description) {
        doc.setFontSize(9.5); doc.setFont("helvetica","normal"); doc.setTextColor(...silver);
        const dl = doc.splitTextToSize(step.description, pageW-margin*2-4);
        dl.forEach(l => { if (y>278) { doc.addPage(); doc.setFillColor(...THEME.pageBg); doc.rect(0,0,210,297,"F"); y=20; } doc.text(l, margin+3, y); y+=5.5; });
        y+=2;
      }
      if (step.warning) {
        doc.setFontSize(8.5); doc.setFont("helvetica","bold"); doc.setTextColor(...[220,80,60]);
        doc.text("⚠ " + step.warning, margin+3, y); y+=5;
      }
      if (step.materials?.length) {
        doc.setFontSize(8); doc.setFont("helvetica","bold"); doc.setTextColor(...muted);
        doc.text("Materials: ", margin+3, y);
        doc.setFont("helvetica","normal"); doc.setTextColor(...silver);
        doc.text(step.materials.join(", "), margin+22, y); y+=5;
      }
      if (step.checkpoint) {
        doc.setFontSize(8); doc.setFont("helvetica","bold"); doc.setTextColor(...THEME.green);
        doc.text("✓ " + step.checkpoint, margin+3, y); y+=5;
      }
      y+=3;
    });
  });

  applyFooters(doc, "BUILD VIDEO LIBRARY");
  doc.save("zenith-apex-build-video-library.pdf");
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
const TABS = [
  { id: "investor", label: "Investor Package", icon: <FileText size={15}/> },
  { id: "inventions", label: "Invention Plans", icon: <Package size={15}/> },
  { id: "videos", label: "Build Videos", icon: <Film size={15}/> },
  { id: "courses", label: "Course Catalog", icon: <BookOpen size={15}/> },
  { id: "shop", label: "Shop Catalog", icon: <ShoppingBag size={15}/> },
  { id: "letter", label: "Master Letter", icon: <Mail size={15}/> },
];

export default function AdminDownloadCenter() {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("investor");
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [done, setDone] = useState({});

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me();
      setUser(me);
      if (me?.role === "admin") {
        const vids = await base44.entities.BuildVideo.list("-created_date", 100);
        setVideos(vids);
      }
      setLoading(false);
    })();
  }, []);

  const triggerDone = (key) => {
    setDone(d => ({ ...d, [key]: true }));
    setTimeout(() => setDone(d => ({ ...d, [key]: false })), 3000);
  };

  const dl = (key, fn) => () => { fn(); triggerDone(key); };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-yellow-400" size={32}/>
    </div>
  );

  if (!user || user.role !== "admin") return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
      <Lock size={40} className="text-yellow-600"/>
      <h2 className="text-white font-black text-xl">Admin Access Required</h2>
      <p className="text-gray-500">This page is restricted to administrators.</p>
      <Link to="/" className="text-yellow-400 hover:underline">← Back to Home</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-yellow-900/40 bg-gray-900/80 px-5 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14}/> Back</Link>
          <div className="w-px h-5 bg-gray-700"/>
          {/* Zenith Apex Logo SVG */}
          <div className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 36 36">
              <defs>
                <linearGradient id="hexgrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37"/>
                  <stop offset="100%" stopColor="#f0d264"/>
                </linearGradient>
              </defs>
              <polygon points="18,2 32,10 32,26 18,34 4,26 4,10" fill="#0c1850" stroke="url(#hexgrad)" strokeWidth="1.5"/>
              <circle cx="18" cy="2" r="1.5" fill="#d4af37"/>
              <circle cx="32" cy="10" r="1.5" fill="#d4af37"/>
              <circle cx="32" cy="26" r="1.5" fill="#d4af37"/>
              <circle cx="18" cy="34" r="1.5" fill="#d4af37"/>
              <circle cx="4" cy="26" r="1.5" fill="#d4af37"/>
              <circle cx="4" cy="10" r="1.5" fill="#d4af37"/>
              <line x1="9" y1="12" x2="27" y2="12" stroke="#f0d264" strokeWidth="2" strokeLinecap="round"/>
              <line x1="27" y1="12" x2="9" y2="24" stroke="#f0d264" strokeWidth="2" strokeLinecap="round"/>
              <line x1="9" y1="24" x2="27" y2="24" stroke="#f0d264" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div>
              <h1 className="text-white font-black text-base tracking-tight">Download Center</h1>
              <p className="text-yellow-600 text-xs font-semibold tracking-widest uppercase">Zenith Apex · Admin Only</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-yellow-900/40 border border-yellow-700 text-yellow-400 font-bold">🔐 Admin</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-800 bg-gray-900/50 px-4 gap-1 flex-shrink-0">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${tab === t.id ? 'border-yellow-500 text-yellow-300' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">

        {/* INVESTOR PACKAGE TAB */}
        {tab === "investor" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <svg width="28" height="28" viewBox="0 0 36 36"><defs><linearGradient id="hg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#d4af37"/><stop offset="100%" stopColor="#f0d264"/></linearGradient></defs><polygon points="18,2 32,10 32,26 18,34 4,26 4,10" fill="#0c1850" stroke="url(#hg2)" strokeWidth="1.5"/><line x1="9" y1="12" x2="27" y2="12" stroke="#f0d264" strokeWidth="2" strokeLinecap="round"/><line x1="27" y1="12" x2="9" y2="24" stroke="#f0d264" strokeWidth="2" strokeLinecap="round"/><line x1="9" y1="24" x2="27" y2="24" stroke="#f0d264" strokeWidth="2" strokeLinecap="round"/></svg>
              <div>
                <h2 className="text-white font-black text-xl">Investor Package</h2>
                <p className="text-gray-500 text-sm">All branded PDFs with Zenith Apex logo, gold/navy professional theme</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { key:"nda", title:"Mutual NDA", desc:"Professionally branded NDA with $2.5M liquidated damages clause, hexagonal Zenith Apex logo, gold/navy theme, full signature blocks and notary section.", badge:"Legal", component: <NdaPdfGenerator compact/> },
                { key:"dd", title:"Due Diligence Package", desc:"100+ page technical & financial portfolio — 8 sections covering AI modules, IP assets, source documents, revenue model, risk analysis, and due diligence checklist. Full branded cover page.", badge:"Investment", component: <DueDiligencePdfGenerator compact/> },
              ].map(item => (
                <div key={item.key} className="bg-gray-900 border border-yellow-900/40 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-yellow-900/50 border border-yellow-800 text-yellow-400 font-bold">{item.badge}</span>
                  </div>
                  <h3 className="text-white font-black text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">{item.desc}</p>
                  {item.component}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INVENTION PLANS TAB */}
        {tab === "inventions" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-white font-black text-xl mb-1">Invention Build Plans</h2>
              <p className="text-gray-500 text-sm">Complete technical specifications, BOMs, and assembly guides for all 5 primary devices</p>
            </div>
            <div className="bg-gray-900 border border-yellow-900/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                  <p className="text-white font-bold mb-1">Complete Invention Plans Portfolio</p>
                  <p className="text-gray-400 text-sm">MEG · TRD-1 · G-Com Mk I · Priore-Class System · TRZ Cold Fusion Reactor — all in one professionally formatted PDF with full specs, BOMs, and assembly steps</p>
                </div>
              </div>
              <button onClick={dl("inv", generateInventionPlansPDF)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-white font-black text-sm transition-all shadow-lg">
                {done.inv ? <CheckCircle size={15}/> : <Download size={15}/>}
                {done.inv ? "Downloaded!" : "Download Invention Plans PDF"}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Motionless Electromagnetic Generator (MEG)", "Telomere Regeneration Device (TRD-1)", "Scalar Wave Communication Transmitter (G-Com Mk I)", "Portable Priore-Class EM Treatment System", "Time-Reversal Zone Cold Fusion Reactor (TRZ-1)"].map((name, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <p className="text-white font-bold text-sm">{name}</p>
                  <p className="text-gray-500 text-xs mt-1">Included in full portfolio PDF above</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUILD VIDEOS TAB */}
        {tab === "videos" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-black text-xl mb-1">Build Video Library</h2>
                <p className="text-gray-500 text-sm">{videos.length} generated build guides — export all as PDF</p>
              </div>
              <button onClick={() => { setGeneratingVideo(true); BuildVideosPDF({videos}); setTimeout(() => { setGeneratingVideo(false); triggerDone("vids"); }, 300); }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-white font-black text-sm transition-all">
                {done.vids ? <CheckCircle size={15}/> : generatingVideo ? <Loader2 size={15} className="animate-spin"/> : <Download size={15}/>}
                {done.vids ? "Downloaded!" : "Download All Build Videos PDF"}
              </button>
            </div>
            {videos.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                <Film size={40} className="text-gray-700 mx-auto mb-4"/>
                <p className="text-white font-bold mb-2">No Build Videos Yet</p>
                <p className="text-gray-500 text-sm">Go to <Link to="/inventor-forge" className="text-yellow-400 underline">Invention Forge</Link> and click "Build Video" on any invention to generate guides.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((v, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-white font-bold text-sm">{v.invention_name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{v.invention_category} · {(v.steps||[]).length} steps</p>
                    <p className="text-gray-700 text-xs mt-1">{v.created_date ? new Date(v.created_date).toLocaleDateString() : ""}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COURSES TAB */}
        {tab === "courses" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-white font-black text-xl mb-1">Course Catalog</h2>
              <p className="text-gray-500 text-sm">Full 10-course catalog with module listings and pricing</p>
            </div>
            <div className="bg-gray-900 border border-yellow-900/40 rounded-2xl p-6">
              <p className="text-white font-bold mb-2">Complete Course Catalog PDF</p>
              <p className="text-gray-400 text-sm mb-5">All 10 courses with full module listings, pricing ($197–$397), and curriculum overviews — professionally formatted with Zenith Apex branding.</p>
              <button onClick={dl("courses", generateCourseCatalogPDF)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-white font-black text-sm transition-all">
                {done.courses ? <CheckCircle size={15}/> : <Download size={15}/>}
                {done.courses ? "Downloaded!" : "Download Course Catalog PDF"}
              </button>
            </div>
          </div>
        )}

        {/* SHOP TAB */}
        {tab === "shop" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-white font-black text-xl mb-1">Shop Catalog</h2>
              <p className="text-gray-500 text-sm">Full e-commerce product catalog with specifications and pricing</p>
            </div>
            <div className="bg-gray-900 border border-yellow-900/40 rounded-2xl p-6">
              <p className="text-white font-bold mb-2">EMF Protection Shop — Complete Product Catalog</p>
              <p className="text-gray-400 text-sm mb-5">All 4 product categories (jewelry, home devices, supplements, research equipment) with full specs, pricing, and product descriptions.</p>
              <button onClick={dl("shop", generateShopCatalogPDF)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-white font-black text-sm transition-all">
                {done.shop ? <CheckCircle size={15}/> : <Download size={15}/>}
                {done.shop ? "Downloaded!" : "Download Shop Catalog PDF"}
              </button>
            </div>
          </div>
        )}

        {/* MASTER LETTER TAB */}
        {tab === "letter" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-white font-black text-xl mb-1">Master Acquisition Letter</h2>
              <p className="text-gray-500 text-sm">Branded PDF version of the full acquisition letter for investor outreach</p>
            </div>
            <div className="bg-gray-900 border border-yellow-900/40 rounded-2xl p-6">
              <p className="text-white font-bold mb-2">Master Letter PDF</p>
              <p className="text-gray-400 text-sm mb-3">Full acquisition letter with all platform valuations ($3.9M–$11.5M), deal terms, and call-to-action. Includes placeholder markers for personalization.</p>
              <div className="bg-yellow-950/30 border border-yellow-900/40 rounded-xl p-3 mb-5">
                <p className="text-yellow-300 text-xs font-bold">Before sending, replace:</p>
                <p className="text-yellow-200 text-xs mt-1">[YOUR NAME] · [YOUR EMAIL] · [YOUR PHONE] · [RECIPIENT NAME]</p>
              </div>
              <button onClick={dl("letter", generateMasterLetterPDF)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-white font-black text-sm transition-all">
                {done.letter ? <CheckCircle size={15}/> : <Download size={15}/>}
                {done.letter ? "Downloaded!" : "Download Master Letter PDF"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}