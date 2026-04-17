import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Sparkles, FileText, Loader2, CheckCircle2, Download,
  Zap, DollarSign, Shield, BookOpen, FlaskConical, Brain, Scale,
  BarChart3, Cpu, AlertCircle, RefreshCw, Plus
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import jsPDF from "jspdf";
import { THEME, drawPageHeader, drawFooter, drawLogo } from "../lib/zenithPdfTheme";

// ── Document type catalog ─────────────────────────────────────────────────────
const DOC_TYPES = [
  {
    id: "pitch_deck",
    label: "Investor Pitch Deck",
    folder: "Overview",
    icon: BarChart3,
    color: "text-blue-400",
    bg: "bg-blue-950/30 border-blue-800",
    desc: "AI-generated 12-slide acquisition pitch with market sizing, IP valuation, and financials.",
    aiPrompt: "Generate a comprehensive investor pitch deck for the Zenith Apex Advanced Research Platform (ZARP). Include: 1) Cover slide with platform name and tagline, 2) Problem statement (fragmented scalar EM research, $15K+ patent costs), 3) Solution (AI-powered IP generation platform), 4) Platform features (Invention Forge, Patent Drafter, Knowledge Graph, VDR), 5) Market opportunity ($14.2B AI IP generation TAM), 6) IP Portfolio (24 PPAs, MEG patent US 6362718, 6 verticals), 7) Business model (8 revenue streams, 94.2% gross margin), 8) Financial metrics (MRR $12,400, LTV:CAC 270x, CAC $28), 9) 5-year DCF (conservative $3.9M, base $8.2M, optimistic $14.8M), 10) Team & advisors, 11) Acquisition thesis (strategic fit for Clarivate/LexisNexis at 9-28x ARR), 12) Next steps (NDA, due diligence, demo). Be specific with numbers.",
  },
  {
    id: "due_diligence",
    label: "Due Diligence Package",
    folder: "Legal",
    icon: Shield,
    color: "text-red-400",
    bg: "bg-red-950/30 border-red-800",
    desc: "Complete DD checklist covering platform, IP, financials, legal, SBIR, and exit pathways.",
    aiPrompt: "Generate a comprehensive technical due diligence package for the Zenith Apex Advanced Research Platform acquisition. Cover: Section A (Platform Technology — AI stack, knowledge graph, invention forge, patent drafter, scalability specs), Section B (IP & Legal — 24 provisional patents, MEG US 6362718, freedom-to-operate analysis, IP ownership chain), Section C (Financials — revenue history, unit economics, burn rate, growth rate, Stripe verification), Section D (SBIR/Government — Phase I $180K Scalar Pulse Radar, Phase II $450K, ONR R-5-78 validation, China Lake 73-sigma anomaly), Section E (Risk Assessment — market, legal, technical, competitive risks with mitigation), Section F (Exit Pathways — strategic acquirers, valuation multiples, deal structure options). Include specific data points and verified facts.",
  },
  {
    id: "term_sheet",
    label: "Seller Term Sheet",
    folder: "Legal",
    icon: Scale,
    color: "text-purple-400",
    bg: "bg-purple-950/30 border-purple-800",
    desc: "Acquisition term sheet template with deal structure, IP transfer, earnout provisions.",
    aiPrompt: "Generate a detailed seller term sheet for the acquisition of Zenith Apex Advanced Research Platform. Include: 1) Transaction Overview (asset sale structure, purchase price range $3.9M-$14.8M), 2) Assets Included (platform codebase, 24 PPAs, MEG patent license, Bearden corpus index, subscriber base, SBIR relationships), 3) Assets Excluded (personal IP, future inventions), 4) Payment Structure (upfront cash 60%, earnout 40% over 24 months based on ARR milestones), 5) Earnout Triggers ($500K ARR = 50% release, $1M ARR = 100% release), 6) Seller Representations & Warranties, 7) Non-Compete (2 years, scalar EM domain), 8) Transition Period (90-day knowledge transfer), 9) IP Transfer Mechanics, 10) Employee/Contractor retention provisions, 11) Conditions to Close, 12) Exclusivity Period (30 days), 13) Governing Law (Delaware). Professional legal format.",
  },
  {
    id: "course_catalog",
    label: "Course Catalog",
    folder: "Overview",
    icon: BookOpen,
    color: "text-green-400",
    bg: "bg-green-950/30 border-green-800",
    desc: "Full 20+ course catalog with descriptions, learning outcomes, pricing, and revenue projections.",
    aiPrompt: "Generate a comprehensive course catalog for the Zenith Apex Research Platform. Create 20+ courses across these categories: 1) Scalar Electromagnetics Fundamentals (5 courses: Bearden's Unified Field Theory, Scalar Wave Basics, MEG Theory & Replication, Zero-Point Energy Physics, Tesla's Hidden Discoveries), 2) Bioelectromagnetics & Health (4 courses: MCCS Telomere Protocol, EMF Exposure & Mitigation, Priore Device Science, Biofield Physics), 3) Patent & IP Strategy (4 courses: Provisional Patent Mastery, IP Valuation Methods, Prior Art Research, Freedom-to-Operate Analysis), 4) Device Construction (4 courses: MEG Build Guide, TRZ Reactor Assembly, Scalar Pulse Radar Build, G-Com Communicator), 5) Business & Monetization (3 courses: SBIR Grant Writing, IP Licensing Strategy, Research Commercialization). For each course include: title, duration, price ($197-$497), learning outcomes (5 bullets), prerequisites, and target audience.",
  },
  {
    id: "invention_build_plans",
    label: "Invention Build Plans Index",
    folder: "Technical",
    icon: FlaskConical,
    color: "text-amber-400",
    bg: "bg-amber-950/30 border-amber-800",
    desc: "21 complete invention build plans with BOMs, assembly steps, specs, and cost analysis.",
    aiPrompt: "Generate a detailed invention build plans index for the Zenith Apex platform covering 21 devices. For each device include: device name, category, brief description, key components (bill of materials with costs), assembly overview (5 steps), estimated build cost, commercial value estimate, and patent/IP status. Devices: 1) MEG - Motionless Electromagnetic Generator (US Patent 6362718), 2) TRZ-1 Torsion Resonance Zero-Point Reactor, 3) TRD-1 Telomere Regeneration Device, 4) Scalar Pulse Radar, 5) G-Com ECM-Immune Communicator, 6) Priore Frequency Device, 7) Bedini BESC-1 Signal Conditioner, 8) Longitudinal EM Wave Transmitter, 9) Phase Conjugate Mirror Array, 10) Vacuum Energy Converter, 11) Gravitobiology Resonator, 12) ELF Lock Detector, 13) Scalar Interferometer, 14) Biofield Amplifier, 15) Tesla Magnifying Transmitter (miniature), 16) Caduceus Coil Assembly, 17) Non-linear Junction Detector, 18) Time-Reverse Mirror, 19) Scalar Shield Generator, 20) Quantum Potential Tapper, 21) Fireflies Sensor Array. Include realistic component costs and build difficulty ratings.",
  },
  {
    id: "patent_drafter",
    label: "AI Patent Draft — MEG Device",
    folder: "IP & Patents",
    icon: Cpu,
    color: "text-cyan-400",
    bg: "bg-cyan-950/30 border-cyan-800",
    desc: "AI-generated provisional patent application for the MEG device with full claims set.",
    aiPrompt: "Generate a complete provisional patent application for a Motionless Electromagnetic Generator (MEG) device inspired by Bearden et al. US Patent 6362718. Include: Title of Invention, Field of the Invention, Background (prior art summary including Bearden 2001, Tesla 1914, Bedini 1984), Brief Summary of Invention, Detailed Description of Preferred Embodiments (including core assembly with permanent magnets, bifilar wound output coils, control coil, input switching circuit, and load circuit), Claims (write 20 claims: 3 independent, 17 dependent, covering core MEG structure, coil configurations, switching methods, output extraction methods, material specifications), Abstract (150 words), and Drawings Description. Use proper USPTO provisional patent formatting. Claims must be specific, novel, and non-obvious over prior art.",
  },
  {
    id: "invention_forge",
    label: "Invention Forge Report",
    folder: "Technical",
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-950/30 border-yellow-800",
    desc: "AI-generated new invention disclosure with market analysis, technical specs, and IP strategy.",
    aiPrompt: "Generate a complete invention disclosure report using the Zenith Apex Invention Forge methodology. Create a new invention called 'Scalar Resonance Energy Harvester (SREH-1)' based on Bearden's work on curved spacetime and vacuum energy. Include: 1) Invention Summary & Tagline, 2) Technical Architecture (core principles, component list with specs, operating parameters), 3) Novel Claim Analysis (what makes it unique over prior art), 4) Prior Art Landscape (5 closest patents with differences), 5) Market Application Areas (energy, defense, medical, communications), 6) Commercial Potential (TAM, SAM, SOM estimates), 7) Build Feasibility (difficulty rating, estimated prototype cost, timeline), 8) Patent Strategy (claim priorities, filing jurisdictions, continuation strategy), 9) IP Valuation Estimate (DCF-based at $450K-$1.2M), 10) SBIR Alignment (applicable DoD programs), 11) Risk Assessment, 12) Recommended Next Steps. Be specific with technical and financial details.",
  },
  {
    id: "hybrid_invention",
    label: "Hybrid Invention + IP Valuation",
    folder: "IP & Patents",
    icon: Brain,
    color: "text-pink-400",
    bg: "bg-pink-950/30 border-pink-800",
    desc: "Hybrid invention synthesis combining multiple Bearden devices with full IP valuation model.",
    aiPrompt: "Generate a hybrid invention synthesis and IP valuation report for Zenith Apex. Create a new hybrid invention called 'TRZ-BIO CONVERGENCE PLATFORM' that combines: the TRZ-1 Zero-Point Reactor (energy source) + TRD-1 Telomere Device (biomedical application) + Scalar Pulse Radar (sensing/feedback). Include: 1) Hybrid Architecture Overview (how the three systems integrate), 2) Synergistic Technical Benefits (why combined > individual), 3) Novel IP Created by Combination (5 new patentable elements), 4) Complete IP Portfolio Valuation using 3 methods: a) DCF Method (5-year licensing revenue discounted at 10%), b) Market Comparables (comparable patent sales in energy + biotech), c) Cost Replacement Method (R&D cost to recreate from scratch), 5) IP Risk-Adjusted Valuation Summary, 6) Licensing Strategy (field-of-use licensing to defense + biotech separately), 7) Patent Claim Map (which claims cover which sub-systems), 8) SBIR & DoD Alignment, 9) Acquisition Value Contribution to ZARP Total ($1.2M-$3.5M for this hybrid alone), 10) Competitive Landscape & Defensibility Score. Include specific dollar valuations with methodology.",
  },
  {
    id: "financial_model",
    label: "5-Year Financial Model",
    folder: "Financials",
    icon: DollarSign,
    color: "text-emerald-400",
    bg: "bg-emerald-950/30 border-emerald-800",
    desc: "Detailed 5-year DCF with 8 revenue streams, unit economics, and acquisition valuation.",
    aiPrompt: "Generate a detailed 5-year financial model for Zenith Apex Advanced Research Platform. Include: Current State (MRR $12,400, 150 beta members, CAC $28, LTV $7,584, Gross Margin 94.2%), 8 Revenue Streams with year-by-year projections: 1) Subscriptions (Researcher $82/mo, Pro $247/mo, Enterprise $497/mo), 2) Invention Build Plans ($297-$2,497/device), 3) Course Library ($197-$497/course), 4) AI Patent Drafting ($97/provisional), 5) IP Licensing ($45K-$280K/year per device), 6) EMF Protection Shop (68% margin), 7) Investor Package ($2,497 one-time), 8) White-Label API ($280K-$750K/year); Year 1-5 P&L projection table; Key unit economics table (CAC, LTV, churn, ARPU); DCF Valuation at 3 scenarios (Conservative $3.9M, Base $8.2M, Optimistic $14.8M); Comparable M&A multiples (PatSnap $1.5B SoftBank, Clarivate acquisitions); SaaS metrics dashboard; Burn rate & runway analysis. Use actual numbers and realistic growth assumptions.",
  },
];

// ── PDF builder ───────────────────────────────────────────────────────────────
function buildPdf(docType, aiContent) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const { margin, pageW } = THEME;
  const contentW = pageW - margin * 2;
  let y = 0;

  const addPage = () => {
    doc.addPage();
    y = 0;
    drawPageHeader(doc, docType.label, "ZENITH APEX — CONFIDENTIAL VDR DOCUMENT");
    y = 58;
  };

  const checkPage = (needed = 12) => {
    if (y + needed > 278) addPage();
  };

  const writeText = (text, fontSize = 10, color = [30, 30, 30], isBold = false, indent = 0) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, contentW - indent);
    lines.forEach(line => {
      checkPage(fontSize * 0.5);
      doc.text(line, margin + indent, y);
      y += fontSize * 0.45;
    });
    y += 1.5;
  };

  const writeSectionHeader = (text) => {
    checkPage(14);
    doc.setFillColor(10, 10, 10);
    doc.rect(margin, y - 1, contentW, 8, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(text.toUpperCase(), margin + 3, y + 4.5);
    y += 12;
  };

  const writeRule = () => {
    checkPage(4);
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + contentW, y);
    y += 4;
  };

  // Cover page
  drawPageHeader(doc, docType.label, "ZENITH APEX — CONFIDENTIAL VDR DOCUMENT");
  y = 60;

  // Cover hero box
  doc.setFillColor(10, 10, 10);
  doc.rect(margin, y, contentW, 55, "F");
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  const titleLines = doc.splitTextToSize(docType.label.toUpperCase(), contentW - 20);
  titleLines.forEach((line, i) => {
    doc.text(line, pageW / 2, y + 18 + i * 10, { align: "center" });
  });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 180);
  doc.text("ZENITH APEX ADVANCED RESEARCH PLATFORM", pageW / 2, y + 40, { align: "center" });
  doc.text("VIRTUAL DATA ROOM — AI-GENERATED DOCUMENT", pageW / 2, y + 47, { align: "center" });
  y += 65;

  // Meta block
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y, contentW, 22, "F");
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(`Document Type: ${docType.label}`, margin + 4, y + 6);
  doc.text(`Folder: ${docType.folder}`, margin + 4, y + 12);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin + 4, y + 18);
  doc.text("Classification: CONFIDENTIAL — NDA REQUIRED", pageW - margin - 4, y + 6, { align: "right" });
  doc.text("Platform: Zenith Apex VDR", pageW - margin - 4, y + 12, { align: "right" });
  doc.text("Version: 1.0", pageW - margin - 4, y + 18, { align: "right" });
  y += 30;

  // Desc
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "italic");
  const descLines = doc.splitTextToSize(docType.desc, contentW);
  descLines.forEach(l => { doc.text(l, margin, y); y += 5.5; });
  y += 8;

  writeRule();

  // NDA warning
  doc.setFillColor(245, 230, 230);
  doc.rect(margin, y, contentW, 14, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(120, 0, 0);
  doc.text("⚠ CONFIDENTIAL — FOR AUTHORIZED VDR RECIPIENTS ONLY. SUBJECT TO NDA. UNAUTHORIZED DISCLOSURE = $250,000 LIQUIDATED DAMAGES.", pageW / 2, y + 5.5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 20, 20);
  doc.text("This document was AI-generated by the Zenith Apex Invention Forge system for due diligence and acquisition evaluation purposes.", pageW / 2, y + 10.5, { align: "center" });
  y += 20;

  drawFooter(doc, 1, "~", docType.label);

  // Content pages — parse AI output into sections
  addPage();

  // Split AI content by lines and render
  const rawLines = aiContent.split("\n").filter(l => l.trim() !== "");

  rawLines.forEach(line => {
    const stripped = line.trim();
    if (!stripped) return;

    // Section headers (numbered or ALL CAPS or starts with ##)
    if (stripped.startsWith("##") || /^[A-Z\s\d\.]+:$/.test(stripped) || /^\d+\.\s+[A-Z]/.test(stripped)) {
      writeRule();
      writeSectionHeader(stripped.replace(/^#+\s*/, "").replace(/:$/, ""));
    }
    // Bullet points
    else if (stripped.startsWith("•") || stripped.startsWith("-") || stripped.startsWith("*")) {
      writeText("  " + stripped.replace(/^[•\-\*]\s*/, "• "), 9.5, [30, 30, 30], false, 4);
    }
    // Bold labels (key: value pattern)
    else if (/^[A-Za-z\s]+:/.test(stripped) && stripped.length < 80) {
      const [label, ...rest] = stripped.split(":");
      const val = rest.join(":").trim();
      checkPage(8);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(10, 10, 10);
      doc.text(`${label}:`, margin, y);
      if (val) {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        doc.text(` ${val}`, margin + doc.getTextWidth(`${label}:`) + 1, y);
      }
      y += 6;
    }
    // Regular paragraph
    else {
      writeText(stripped, 9.5, [40, 40, 40]);
    }
  });

  // Closing page
  addPage();
  doc.setFillColor(10, 10, 10);
  doc.rect(margin, y, contentW, 40, "F");
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("ZENITH APEX ADVANCED RESEARCH PLATFORM", pageW / 2, y + 12, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 180);
  doc.text("This document is AI-generated for acquisition due diligence purposes only.", pageW / 2, y + 20, { align: "center" });
  doc.text("Contact: zenithapexresearch@gmail.com", pageW / 2, y + 27, { align: "center" });
  doc.text("zenithapex.base44.app/beta-apply", pageW / 2, y + 33, { align: "center" });
  y += 50;
  writeRule();
  writeText("All financial projections are estimates based on current metrics and market analysis. Past performance is not indicative of future results. This document is provided under NDA for evaluation purposes only. The information herein is subject to change without notice.", 8, [100, 100, 100]);

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    drawFooter(doc, i, pageCount, docType.label);
  }

  return doc;
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function VDRDocumentGenerator() {
  const [generating, setGenerating] = useState(null); // doc id being generated
  const [generated, setGenerated] = useState({}); // { docId: { url, name } }
  const [uploading, setUploading] = useState(null);
  const [uploaded, setUploaded] = useState({}); // docId -> true
  const [errors, setErrors] = useState({});

  const handleGenerate = async (docType) => {
    setGenerating(docType.id);
    setErrors(e => ({ ...e, [docType.id]: null }));
    try {
      // 1. Call LLM to generate content
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: docType.aiPrompt,
        model: "claude_sonnet_4_6",
      });
      const content = typeof result === "string" ? result : (result?.content || JSON.stringify(result));

      // 2. Build PDF client-side
      const pdf = buildPdf(docType, content);
      const pdfBlob = pdf.output("blob");
      const url = URL.createObjectURL(pdfBlob);

      setGenerated(g => ({ ...g, [docType.id]: { blob: pdfBlob, url, content } }));
    } catch (e) {
      setErrors(err => ({ ...err, [docType.id]: e.message || "Generation failed" }));
    } finally {
      setGenerating(null);
    }
  };

  const handleDownload = (docType) => {
    const g = generated[docType.id];
    if (!g) return;
    const link = document.createElement("a");
    link.href = g.url;
    link.download = `ZARP_${docType.id}_${Date.now()}.pdf`;
    link.click();
  };

  const handleUploadToVDR = async (docType) => {
    const g = generated[docType.id];
    if (!g) return;
    setUploading(docType.id);
    try {
      const fileName = `ZARP_${docType.id}_${new Date().toISOString().slice(0, 10)}.pdf`;
      const file = new File([g.blob], fileName, { type: "application/pdf" });

      // Upload file to storage
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Register in VDR
      await base44.functions.invoke("vdrDocuments", {
        action: "upload",
        name: docType.label,
        description: docType.desc,
        folder: docType.folder,
        file_url,
        file_name: fileName,
        file_size_bytes: g.blob.size,
        file_type: "application/pdf",
      });

      setUploaded(u => ({ ...u, [docType.id]: true }));
    } catch (e) {
      setErrors(err => ({ ...err, [docType.id]: e.message }));
    } finally {
      setUploading(null);
    }
  };

  const handleGenerateAll = async () => {
    for (const dt of DOC_TYPES) {
      if (!generated[dt.id] && !uploaded[dt.id]) {
        await handleGenerate(dt);
      }
    }
  };

  const generatedCount = Object.keys(generated).length;
  const uploadedCount = Object.keys(uploaded).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/vdr-documents" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> VDR Documents
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <Sparkles size={14} className="text-yellow-400" /> VDR AI Document Generator
            </h1>
            <p className="text-gray-500 text-xs">Generate AI-filled PDF documents → upload directly into the VDR</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="text-green-400 font-bold">{uploadedCount} uploaded</span>
          <span>·</span>
          <span className="text-yellow-400 font-bold">{generatedCount} generated</span>
          <span>·</span>
          <span>{DOC_TYPES.length} total</span>
        </div>
      </div>

      {/* Info bar */}
      <div className="bg-yellow-950/20 border-b border-yellow-900/30 px-5 py-2.5 flex items-center gap-3">
        <Sparkles size={12} className="text-yellow-500 flex-shrink-0" />
        <p className="text-yellow-700 text-xs leading-relaxed">
          Each document is <strong className="text-yellow-500">AI-generated using Claude Sonnet</strong> (higher quality, uses more integration credits). Generated PDFs include branded Zenith Apex formatting, NDA watermarks, and full content. After generating, download locally or upload directly to the VDR.
        </p>
      </div>

      {/* Document grid */}
      <div className="flex-1 p-5 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {DOC_TYPES.map(dt => {
            const Icon = dt.icon;
            const isGenerating = generating === dt.id;
            const isUploading = uploading === dt.id;
            const isDone = !!generated[dt.id];
            const isUploaded = !!uploaded[dt.id];
            const err = errors[dt.id];

            return (
              <div key={dt.id} className={`bg-gray-900 border rounded-2xl p-5 flex flex-col gap-4 transition-all ${
                isUploaded ? "border-green-800/50" : isDone ? "border-yellow-800/50" : "border-gray-800 hover:border-gray-700"
              }`}>
                {/* Top */}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${dt.bg}`}>
                    <Icon size={18} className={dt.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-black text-sm leading-snug">{dt.label}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-lg border mt-1 inline-block font-semibold ${dt.bg} ${dt.color}`}>
                      {dt.folder}
                    </span>
                  </div>
                  {isUploaded && <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />}
                </div>

                <p className="text-gray-400 text-xs leading-relaxed">{dt.desc}</p>

                {err && (
                  <div className="flex items-center gap-2 text-red-400 text-xs bg-red-950/30 border border-red-900 rounded-lg px-3 py-2">
                    <AlertCircle size={12} /> {err}
                  </div>
                )}

                {/* Status */}
                {isUploaded ? (
                  <div className="flex items-center gap-2 text-green-400 text-xs bg-green-950/20 border border-green-900 rounded-lg px-3 py-2">
                    <CheckCircle2 size={12} /> Uploaded to VDR — visible in {dt.folder} folder
                  </div>
                ) : isDone ? (
                  <div className="flex items-center gap-2 text-yellow-400 text-xs bg-yellow-950/20 border border-yellow-900 rounded-lg px-3 py-2">
                    <CheckCircle2 size={12} /> PDF generated — ready to download or upload
                  </div>
                ) : null}

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                  {!isDone ? (
                    <button
                      onClick={() => handleGenerate(dt)}
                      disabled={!!generating}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-yellow-900/50 hover:bg-yellow-800/50 border border-yellow-700 text-yellow-300 text-xs font-black transition-all disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <><Loader2 size={12} className="animate-spin" /> Generating with AI…</>
                      ) : (
                        <><Sparkles size={12} /> Generate PDF</>
                      )}
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(dt)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-bold transition-all"
                      >
                        <Download size={11} /> Download
                      </button>
                      <button
                        onClick={() => handleGenerate(dt)}
                        disabled={!!generating}
                        className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-500 text-xs transition-all disabled:opacity-50"
                        title="Regenerate"
                      >
                        <RefreshCw size={11} />
                      </button>
                      {!isUploaded && (
                        <button
                          onClick={() => handleUploadToVDR(dt)}
                          disabled={!!uploading}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-900/50 hover:bg-green-800/50 border border-green-700 text-green-300 text-xs font-black transition-all disabled:opacity-50"
                        >
                          {isUploading ? (
                            <><Loader2 size={11} className="animate-spin" /> Uploading…</>
                          ) : (
                            <><Plus size={11} /> Add to VDR</>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bulk action */}
        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-sm">Generate All Documents</p>
            <p className="text-gray-500 text-xs mt-0.5">Sequentially generates all {DOC_TYPES.length} documents using AI. Takes ~3-5 minutes. Uses significant AI credits.</p>
          </div>
          <button
            onClick={handleGenerateAll}
            disabled={!!generating || !!uploading}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-900/60 hover:bg-yellow-800/60 border border-yellow-700 text-yellow-300 font-black text-sm transition-all disabled:opacity-50 flex-shrink-0"
          >
            {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {generating ? `Generating ${DOC_TYPES.find(d => d.id === generating)?.label}…` : "Generate All"}
          </button>
        </div>
      </div>
    </div>
  );
}