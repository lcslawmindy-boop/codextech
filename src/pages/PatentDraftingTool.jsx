import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Zap, DollarSign, Download, Loader2, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useTier } from "../hooks/useTier";
import { TIERS } from "../lib/tiers";
import { hasTrialToken, consumeTrialToken, TRIAL_FEATURES } from "../lib/trialTokens";
import { jsPDF } from "jspdf";

// Bearden inventions from the portfolio
const INVENTIONS = [
  {
    id: "anenergy_pump",
    title: "Anenergy Pump Demonstration Circuit",
    symbol: "APD-001",
    category: "Vacuum Energy Extraction",
    problem: "No commercial instrument demonstrates the phi-field / anenergy distinction from conventional EM energy.",
    solution: "Shielded toroidal coil geometry where gradient-phi inside = 0 while phi > phi-zero is maintained by oscillated phi-application. Produces Moray-type steady-state vacuum emission.",
    components: ["Shielded toroidal coil", "DDS pulse controller", "Phi-differential measurement circuit", "Moray oscillation driver", "Ground reference isolation stage"],
    claims_seed: ["toroidal coil with zero internal gradient-phi", "vacuum potential oscillation circuit", "massless charge extraction mechanism", "phi-field differential measurement"],
    market: 340, tam_desc: "Alternative energy research equipment",
    novelty: "high", prior_art_risk: "medium",
  },
  {
    id: "energy_bottle",
    title: "Scalar Energy Bottle Interferometer",
    symbol: "SEB-002",
    category: "Scalar EM Devices",
    problem: "No prototype demonstrates the Energy Bottle interference zone or scalar pulse timing mechanism from Bearden Part 4.",
    solution: "Two-transmitter system creating E=0, B=0 interference zone. Scalar pulse timing for range determination — scalar pulse arrives instantaneously vs Hertz pulse delayed by c·Δt.",
    components: ["Dual scalar transmitter array", "Zero-vector balanced push-pull coil topology", "FPGA nanosecond pulse timing", "Differential scalar/Hertz detector", "Interference zone mapping software"],
    claims_seed: ["zero-vector EM transmitter pair", "scalar pulse timing range determination", "E=0 B=0 interference zone generation", "differential scalar wave detection"],
    market: 9300, tam_desc: "DoD directed energy research",
    novelty: "very_high", prior_art_risk: "low",
  },
  {
    id: "vpo",
    title: "Vacuum Potential Oscillator (VPO) Circuit",
    symbol: "VPO-003",
    category: "Vacuum Energy Extraction",
    problem: "Standard EM circuits are closed systems incapable of tapping the vacuum potential reservoir.",
    solution: "Resonant LC circuit tuned to shift vacuum-ground potential independently of circuit ground, enabling partial Dirac Sea electron unstripping without V=IR mass current.",
    components: ["Custom wound toroidal inductors", "Quartz crystal resonator", "Vacuum-ground isolation stage", "Dirac Sea coupling network", "Output measurement & verification circuit"],
    claims_seed: ["vacuum ground potential shifting circuit", "Dirac Sea electron extraction", "massless charge to conventional current converter", "non-Ohmic energy extraction"],
    market: 2800, tam_desc: "Global alternative energy research",
    novelty: "very_high", prior_art_risk: "low",
  },
  {
    id: "biofield_chamber",
    title: "Biofield Frequency Exposure Chamber",
    symbol: "BFC-004",
    category: "Bioelectromagnetic Medicine",
    problem: "Kaznacheyev cytopathogenic UV photon transmission experiments have no commercial replication instrument.",
    solution: "Shielded quartz-windowed dual-compartment chamber transmitting UV photon EM disease/health patterns between compartments via transparent optical path.",
    components: ["Quartz-window optical path (not glass)", "Dual shielded compartment design", "Programmable UV frequency driver", "Cytopathogenic pattern recorder", "Phase conjugate reversal stage"],
    claims_seed: ["quartz UV photon transmission chamber", "cytopathogenic pattern transfer apparatus", "bioelectromagnetic frequency exposure system", "dual-compartment shielded cell culture device"],
    market: 1200, tam_desc: "Bioelectromagnetics research instruments",
    novelty: "high", prior_art_risk: "medium",
  },
  {
    id: "priore_therapy",
    title: "Prioré-Type Multichannel EM Therapy System",
    symbol: "PMT-005",
    category: "Bioelectromagnetic Medicine",
    problem: "No modern implementation of Prioré's French-government-funded multichannel EM cancer cure architecture exists.",
    solution: "DDS signal generators + FPGA modulation chain producing 3-layer S'/S''/S''' hyperspatial modulation architecture from Bearden's Fig. 10. Impresses healthy virtual-state EM template onto target tissue.",
    components: ["AD9910 DDS chip array", "FPGA multichannel modulation chain", "S'/S''/S''' layer output stage", "Shielded applicator coil array", "Treatment protocol software"],
    claims_seed: ["multichannel layered EM modulation system", "virtual-state template EM therapy", "hyperspatial modulation architecture", "phase conjugate kindling-reversal device"],
    market: 3800, tam_desc: "Energy medicine device market",
    novelty: "very_high", prior_art_risk: "low",
  },
  {
    id: "em_trigger_device",
    title: "EM Trigger Window Therapy Device",
    symbol: "ETW-006",
    category: "Bioelectromagnetic Medicine",
    problem: "The specific EM trigger windows for maximum biological coupling are undocumented in commercial therapy devices.",
    solution: "Programmable frequency generator delivering precisely tuned EM pulses within verified biological trigger windows from Gravitobiology Table 12.",
    components: ["DDS waveform generator", "Trigger window frequency library", "Consumer wristband applicator", "Clinical full-body coil array", "Biofeedback coherence monitor"],
    claims_seed: ["biological EM trigger window delivery system", "programmable therapeutic frequency apparatus", "Schumann resonance synchronization device", "wearable bioelectromagnetic therapy system"],
    market: 1400, tam_desc: "PEMF therapy device market",
    novelty: "medium", prior_art_risk: "high",
  },
  {
    id: "pcm_system",
    title: "Whittaker Wave Phase Conjugate Mirror System",
    symbol: "PCM-007",
    category: "Scalar EM Devices",
    problem: "No commercial phase conjugate mirror system exists for scalar EM communications or therapeutic pattern cancellation.",
    solution: "Pumped phase conjugate mirror using BaTiO₃ nonlinear optical medium to time-reverse incoming EM waves. Output is exact phase-conjugate replica propagating back to source.",
    components: ["BaTiO₃ nonlinear optical crystal", "Pump beam array", "Phase conjugate output coupler", "Whittaker wave decomposition analyzer", "Self-targeting communications modulator"],
    claims_seed: ["pumped phase conjugate mirror for EM therapy", "time-reversed EM wave generator", "Whittaker wave decomposition system", "scalar EM self-targeting communications"],
    market: 28000, tam_desc: "Secure military communications",
    novelty: "very_high", prior_art_risk: "low",
  },
  {
    id: "scalar_radar",
    title: "Scalar Pulse Radar Detection System",
    symbol: "SPR-008",
    category: "Scalar EM Sensing",
    problem: "Standard radar cannot detect scalar EM emissions — the signature of advanced directed energy weapons.",
    solution: "Dual-channel receiver detecting both scalar and Hertz pulses. Range determined by time differential — scalar pulse arrives instantaneously, Hertz pulse delayed by range/c.",
    components: ["Scalar wave receiver array", "Hertz pulse reference receiver", "Nanosecond timing comparator", "Range computation FPGA", "Scalar signature analysis software"],
    claims_seed: ["scalar pulse range determination system", "dual-channel scalar-Hertz timing receiver", "instantaneous scalar wave detection", "zero-time scalar radar ranging"],
    market: 9300, tam_desc: "Defense electronics sensing",
    novelty: "very_high", prior_art_risk: "low",
  },
  {
    id: "open_generator",
    title: "Open-System Magnetic Generator (Kromrey / Gray Architecture)",
    symbol: "OSG-009",
    category: "Vacuum Energy Extraction",
    problem: "No modern commercial implementation of the Kromrey G-field generator or Edwin Gray pulsed capacitor discharge engine (US Patent #3,890,548) exists for systematic COP measurement and optimization.",
    solution: "Rotating 8-pole N52 neodymium rotor with 12 bifilar-wound Kromrey-configuration stator coils and a pulsed capacitor nanosecond-discharge output circuit. Open-system coupling to subquantic G-field enables documented >100% COP above threshold RPM per Schaffranke's 1982 survey.",
    components: ["8-pole N52 neodymium arc magnet rotor (balanced G1.0)", "12 Kromrey bifilar stator coils (400T each, ±2%)", "200 µF / 450V polypropylene capacitor discharge bank", "Tungsten spark gap firing circuit", "24V 200W BLDC drive motor + VESC 4.12 controller", "Bidirectional power meters (input + output)"],
    claims_seed: ["rotating open-system electromagnetic generator", "Kromrey bifilar stator G-field coupling configuration", "pulsed capacitor nanosecond discharge cold electricity circuit", "subquantic field energy extraction mechanism"],
    market: 12000, tam_desc: "Alternative energy generation market",
    novelty: "very_high", prior_art_risk: "low",
  },
  {
    id: "fireflies_detector",
    title: "Quantum Potential EMI Detector (Fireflies Sensor)",
    symbol: "QPD-010",
    category: "Scalar EM Sensing",
    problem: "No commercial instrument detects non-Gaussian scalar EM burst signatures ('fireflies effect') described in Gravitobiology Fig. 14 — invisible to standard spectrum analyzers.",
    solution: "Matched quartz crystal array with coherent averaging and real-time kurtosis-based burst detection firmware on Red Pitaya STEMlab 125-14 (125 MSPS, 14-bit). Detects quantum potential EM interference via 4th statistical moment analysis where standard instruments show nothing.",
    components: ["4× frequency-matched 10 MHz quartz crystals (within 5 ppm)", "Mini-Circuits ZX60 low-noise amplifier (NF 0.4 dB)", "Red Pitaya STEMlab 125-14 ADC (125 MSPS)", "FPGA kurtosis burst detector", "GPS timestamping module (u-blox NEO-6M)", "Faraday cage enclosure with BNC feedthrough"],
    claims_seed: ["matched crystal array scalar EM burst detector", "kurtosis non-Gaussian burst detection algorithm", "quantum potential EM interference detection system", "coherent crystal array noise reduction method"],
    market: 850, tam_desc: "Scientific instrumentation / defense sensing",
    novelty: "very_high", prior_art_risk: "low",
  },
  {
    id: "elf_lock_detector",
    title: "ELF Carrier Lock Detection System (Psychotronic Detector)",
    symbol: "ELD-011",
    category: "Scalar EM Sensing",
    problem: "No commercial instrument can detect phase-locked ELF modulation sidebands across multiple HF carriers — the signature of documented ELF brain-entrainment EM architectures.",
    solution: "Dual GPS-disciplined RTL-SDR receiver array computing cross-carrier phase coherence index (CCPCI) using cross-spectral density analysis across 5–30 MHz. Detects simultaneous 10 Hz ELF sidebands on multiple carriers with 1 part in 10¹¹ frequency accuracy.",
    components: ["2× RTL-SDR v3 TCXO-stabilized receivers", "Leo Bodnar GPS-disciplined oscillator (10¹¹ accuracy)", "Ham-It-Up Plus HF upconverter (0.1–60 MHz)", "Active HF antenna (MiniWhip / ALA1530S+)", "GNU Radio phase coherence detection flowgraph", "Raspberry Pi 4B real-time analysis platform"],
    claims_seed: ["cross-carrier phase coherence ELF detection system", "GPS-disciplined dual SDR coherent phase measurement", "ELF modulation sideband cross-spectral detector", "Woodpecker pulse repetition interval analyzer"],
    market: 4200, tam_desc: "SIGINT / electronic intelligence",
    novelty: "very_high", prior_art_risk: "low",
  },
  {
    id: "phi_gradient_sensor",
    title: "Phi-River Gradient Sensor (∇φ Detector)",
    symbol: "PGS-012",
    category: "Scalar EM Sensing",
    problem: "No instrument can measure the gradient-phi (∇φ) field distinct from the E-field — the phi-river virtual particle flux invisible to conventional voltmeters and standard field meters.",
    solution: "Differential Hall-effect bridge using two matched shielded toroidal phi-source coils and a 120 dB CMRR instrumentation amplifier with 24-bit ADC. Measures gradient-phi where E=0, demonstrating the Aharonov-Bohm scalar potential in a precision calibrated instrument.",
    components: ["2× matched shielded toroidal phi-source coils (0.1% inductance)", "Honeywell SS49E matched Hall sensor pair", "INA128 instrumentation amplifier (120 dB CMRR)", "ADS1256 24-bit ADC (30 kSPS)", "REF6025 precision 2.5V voltage reference (3 ppm/°C)", "NTC thermistor temperature compensation circuit"],
    claims_seed: ["differential Hall bridge scalar potential gradient sensor", "toroidal coil phi-source reference pair instrument", "gradient-phi field measurement system distinct from E-field", "Aharonov-Bohm scalar potential calibrated detector"],
    market: 620, tam_desc: "Advanced physics instrumentation",
    novelty: "very_high", prior_art_risk: "low",
  },
  {
    id: "sky_signature_ai",
    title: "Atmospheric Scalar EM Signature Recognition System (AI Edition)",
    symbol: "ASR-013",
    category: "Scalar EM Sensing",
    problem: "No automated system exists to detect and classify scalar EM atmospheric interference signatures (radial spokes, hole-punch clouds, rectangular grid cirrus) in continuous sky imagery.",
    solution: "All-sky 180° fisheye camera station with GPS timestamping feeding a fine-tuned EfficientNet-B4 vision transformer AI classifier trained on Bearden-documented atmospheric formation photographs. Real-time 4-class classification with >85% validation accuracy on ONNX Runtime ARM inference.",
    components: ["Raspberry Pi HQ Camera + 180° fisheye lens", "EfficientNet-B4 fine-tuned vision transformer (ONNX)", "GPS module u-blox NEO-M8N (±2m, UTC timestamped)", "IP67 weatherproof dome enclosure with defogging heater", "BME280 humidity/temperature sensor", "Flask web dashboard with Leaflet.js event mapping"],
    claims_seed: ["AI scalar EM atmospheric signature classification system", "all-sky camera scalar cloud formation detector", "machine learning sky morphology anomaly classifier", "GPS-timestamped atmospheric EM event correlated detector"],
    market: 1800, tam_desc: "Environmental monitoring / atmospheric SIGINT",
    novelty: "very_high", prior_art_risk: "low",
  },
  {
    id: "woodpecker_detector",
    title: "Woodpecker Grid Standing Wave Detector (HF Scalar Signature Receiver)",
    symbol: "WGD-014",
    category: "Scalar EM Sensing",
    problem: "No purpose-built instrument exists to detect and analyze Soviet Woodpecker-style 10 Hz pulse modulation signatures across the HF band with audio output and direction-finding capability.",
    solution: "RTL-SDR receiver with HF upconverter running GNU Radio pulse-repetition-interval (PRI) detector, real-time 10 Hz sideband analysis across 5–30 MHz, auditory Woodpecker signal output, and optional dual magnetic loop direction-finding add-on.",
    components: ["RTL-SDR v3 TCXO receiver + Ham-It-Up Plus HF upconverter", "20m random wire antenna + 9:1 unun transformer", "GNU Radio PRI detector flowgraph (woodpecker_detector.grc)", "Raspberry Pi 4B with 7-inch touchscreen dashboard", "PAM8403 audio amplifier + 3-inch speaker", "Dual magnetic loop direction-finding antenna (optional)"],
    claims_seed: ["HF pulse repetition interval detection system", "Woodpecker 10 Hz ELF modulation sideband detector", "SDR-based ELF carrier lock monitoring system", "HF scalar EM signature audio output receiver"],
    market: 3200, tam_desc: "SIGINT / amateur radio intelligence",
    novelty: "very_high", prior_art_risk: "low",
  },
];

const NOVELTY_SCORES = { very_high: 95, high: 82, medium: 65, low: 40 };
const PRIOR_ART_PENALTY = { low: 0, medium: -10, high: -25 };

function calcValuation(inv, claimsCount, jurisdictions) {
  const base = inv.market * 0.005; // 0.5% of TAM
  const noveltyMult = NOVELTY_SCORES[inv.novelty] / 100;
  const priorPenalty = PRIOR_ART_PENALTY[inv.prior_art_risk];
  const claimsMult = 1 + (claimsCount - 3) * 0.08;
  const jurisdictionMult = 1 + (jurisdictions.length - 1) * 0.35;
  const raw = base * noveltyMult * claimsMult * jurisdictionMult + priorPenalty;
  return Math.max(0.1, raw).toFixed(2);
}

const JURISDICTIONS = ["US (USPTO)", "EU (EPO)", "Japan (JPO)", "China (CNIPA)", "PCT (International)", "UK (IPO)", "Canada (CIPO)"];

function SectionHeader({ n, title, desc }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-7 h-7 rounded-full bg-blue-900 border border-blue-700 flex items-center justify-center text-blue-300 text-xs font-black flex-shrink-0 mt-0.5">{n}</div>
      <div>
        <p className="text-white font-bold text-sm">{title}</p>
        {desc && <p className="text-gray-500 text-xs mt-0.5">{desc}</p>}
      </div>
    </div>
  );
}

function ToolGate({ requiredFlag, requiredTierName, requiredPrice, children }) {
  const { tier } = useTier();
  const [trialAllowed, setTrialAllowed] = useState(() => hasTrialToken(TRIAL_FEATURES.patent_suite));

  if (TIERS[tier]?.[requiredFlag]) return children;
  if (trialAllowed) {
    // Consume the token on first render inside the tool
    consumeTrialToken(TRIAL_FEATURES.patent_suite);
    return children;
  }

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-4xl mx-auto mb-6">🔒</div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Lock size={16} className="text-yellow-400" />
          <span className="text-yellow-400 font-black text-sm uppercase tracking-widest">{requiredTierName} Required</span>
        </div>
        <h2 className="text-white font-black text-2xl mb-3">AI Patent Drafting Tool</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          Your 1× free trial of the Patent Suite has been used. The AI patent drafting & IP valuation tools are exclusive to <span className="text-white font-bold">{requiredTierName}</span> members. Upgrade to unlock unlimited patent generation, claim drafting, and multi-jurisdiction IP valuation.
        </p>
        <Link to="/pricing"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-white text-sm bg-indigo-700 hover:bg-indigo-600 transition-all">
          Upgrade to {requiredTierName} — from ${requiredPrice}/mo
        </Link>
        <Link to="/" className="block mt-3 text-xs text-gray-600 hover:text-gray-400 transition-colors">← Back to Research Database</Link>
      </div>
    </div>
  );
}

export default function PatentDraftingTool() {
  const [step, setStep] = useState(1); // 1=select, 2=configure, 3=draft, 4=valuation
  const [selectedInv, setSelectedInv] = useState(null);
  const [jurisdictions, setJurisdictions] = useState(["US (USPTO)"]);
  const [inventorName, setInventorName] = useState("");
  const [assignee, setAssignee] = useState("");
  const [extraContext, setExtraContext] = useState("");
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [claimsExpanded, setClaimsExpanded] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  const inv = selectedInv ? INVENTIONS.find(i => i.id === selectedInv) : null;
  const claimsCount = generatedDoc?.independent_claims?.length || 3;
  const valuation = inv ? calcValuation(inv, claimsCount, jurisdictions) : null;

  const toggleJurisdiction = (j) => {
    setJurisdictions(prev => prev.includes(j) ? (prev.length > 1 ? prev.filter(x => x !== j) : prev) : [...prev, j]);
  };

  const handleGenerate = async () => {
    if (!inv) return;
    setLoading(true);
    setGeneratedDoc(null);

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a patent attorney specializing in electromagnetic and vacuum energy technology.

Draft a complete formal patent disclosure document for the following invention:

INVENTION TITLE: ${inv.title}
PATENT SYMBOL: ${inv.symbol}
CATEGORY: ${inv.category}
INVENTOR: ${inventorName || "Inventor Name TBD"}
ASSIGNEE: ${assignee || "Unassigned"}
JURISDICTIONS: ${jurisdictions.join(", ")}

TECHNICAL PROBLEM SOLVED:
${inv.problem}

TECHNICAL SOLUTION:
${inv.solution}

KEY COMPONENTS:
${inv.components.map((c, i) => `${i + 1}. ${c}`).join("\n")}

CLAIM SEEDS (build upon these):
${inv.claims_seed.join(", ")}

ADDITIONAL CONTEXT FROM INVENTOR:
${extraContext || "None provided"}

THEORETICAL BASIS:
This invention is based on Tom Bearden's scalar electromagnetics framework, specifically the anenergy pump concept from "Toward a New Electromagnetics Part 4" (1983), vacuum potential oscillation from "Comments on the New Tesla Electromagnetics Part II" (1982), and related Bearden primary source documents.

Generate a complete patent disclosure document with:
1. Abstract (150-200 words, formal patent style)
2. Field of the Invention (2-3 sentences)
3. Background of the Invention (3-4 paragraphs covering prior art and limitations)
4. Summary of the Invention (2-3 paragraphs)
5. Brief Description of Drawings (list 5-7 figures)
6. Detailed Description of Preferred Embodiments (4-5 paragraphs with technical depth)
7. Independent Claims (3 broad independent claims, each starting with "A [device/method/system]...")
8. Dependent Claims (8-10 dependent claims narrowing the independent claims)
9. Claims Advantages (bullet list of 5-6 specific technical advantages over prior art)

Use formal patent legal language throughout. Be highly technical and specific. Reference the scalar EM theoretical framework where relevant.`,
      model: "claude_sonnet_4_6",
      response_json_schema: {
        type: "object",
        properties: {
          abstract: { type: "string" },
          field_of_invention: { type: "string" },
          background: { type: "string" },
          summary: { type: "string" },
          drawings_description: { type: "string" },
          detailed_description: { type: "string" },
          independent_claims: { type: "array", items: { type: "string" } },
          dependent_claims: { type: "array", items: { type: "string" } },
          claim_advantages: { type: "array", items: { type: "string" } },
        },
      },
    });

    setGeneratedDoc(result);
    setLoading(false);
    setStep(4);
  };

  const handleExportPDF = () => {
    if (!generatedDoc || !inv) return;
    setExportLoading(true);

    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 72;
    const pageW = doc.internal.pageSize.getWidth();
    const maxW = pageW - margin * 2;
    let y = margin;

    const addText = (text, fontSize, bold, color, spaceAfter = 12, maxWidth = maxW) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text || "", maxWidth);
      lines.forEach(line => {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += fontSize * 1.4;
      });
      y += spaceAfter;
    };

    const sectionHeader = (title) => {
      y += 8;
      doc.setFillColor(20, 30, 60);
      doc.rect(margin - 8, y - 14, maxW + 16, 20, "F");
      addText(title.toUpperCase(), 9, true, [150, 180, 255], 10);
    };

    // Cover
    doc.setFillColor(8, 12, 30);
    doc.rect(0, 0, pageW, doc.internal.pageSize.getHeight(), "F");
    addText("PATENT DISCLOSURE DOCUMENT", 11, true, [100, 140, 220], 6);
    addText("CONFIDENTIAL — ATTORNEY-CLIENT PRIVILEGED", 8, false, [180, 80, 80], 20);
    addText(inv.title.toUpperCase(), 20, true, [255, 255, 255], 10);
    addText(`Patent Symbol: ${inv.symbol}`, 10, false, [150, 200, 255], 4);
    addText(`Category: ${inv.category}`, 10, false, [150, 200, 255], 4);
    addText(`Inventor(s): ${inventorName || "TBD"}`, 10, false, [200, 200, 200], 4);
    addText(`Assignee: ${assignee || "Unassigned"}`, 10, false, [200, 200, 200], 4);
    addText(`Filing Jurisdictions: ${jurisdictions.join(" · ")}`, 10, false, [200, 200, 200], 4);
    addText(`Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 10, false, [160, 160, 160], 20);
    addText(`Estimated IP Valuation: $${valuation}M`, 13, true, [100, 220, 160], 4);

    // IP Valuation Summary
    y += 10;
    addText("IP VALUATION SUMMARY", 9, true, [100, 200, 120], 6);
    addText(`Target Market: ${inv.tam_desc} ($${inv.market}M TAM)`, 9, false, [180, 180, 180], 3);
    addText(`Novelty Score: ${NOVELTY_SCORES[inv.novelty]}/100 (${inv.novelty.replace("_", " ")})`, 9, false, [180, 180, 180], 3);
    addText(`Prior Art Risk: ${inv.prior_art_risk}`, 9, false, [180, 180, 180], 3);
    addText(`Jurisdictions: ${jurisdictions.length} (multiplier: ${(1 + (jurisdictions.length - 1) * 0.35).toFixed(2)}×)`, 9, false, [180, 180, 180], 3);

    doc.addPage();
    doc.setFillColor(8, 12, 30);
    doc.rect(0, 0, pageW, doc.internal.pageSize.getHeight(), "F");
    y = margin;

    // Content sections
    const sections = [
      ["ABSTRACT", generatedDoc.abstract],
      ["FIELD OF THE INVENTION", generatedDoc.field_of_invention],
      ["BACKGROUND OF THE INVENTION", generatedDoc.background],
      ["SUMMARY OF THE INVENTION", generatedDoc.summary],
      ["BRIEF DESCRIPTION OF DRAWINGS", generatedDoc.drawings_description],
      ["DETAILED DESCRIPTION OF PREFERRED EMBODIMENTS", generatedDoc.detailed_description],
    ];

    sections.forEach(([title, text]) => {
      sectionHeader(title);
      addText(text, 9, false, [210, 210, 210], 16);
    });

    // Claims
    sectionHeader("CLAIMS");
    addText("INDEPENDENT CLAIMS", 9, true, [150, 200, 255], 8);
    (generatedDoc.independent_claims || []).forEach((claim, i) => {
      addText(`${i + 1}. ${claim}`, 9, false, [220, 220, 220], 10);
    });

    addText("DEPENDENT CLAIMS", 9, true, [150, 200, 255], 8);
    const startN = (generatedDoc.independent_claims || []).length + 1;
    (generatedDoc.dependent_claims || []).forEach((claim, i) => {
      addText(`${startN + i}. ${claim}`, 9, false, [220, 220, 220], 10);
    });

    sectionHeader("ADVANTAGES OVER PRIOR ART");
    (generatedDoc.claim_advantages || []).forEach((adv, i) => {
      addText(`• ${adv}`, 9, false, [180, 240, 180], 6);
    });

    // Bearden source attribution
    y += 10;
    sectionHeader("THEORETICAL BASIS & SOURCE ATTRIBUTION");
    addText(`This disclosure is grounded in the documented scalar electromagnetics framework published by Lt. Col. Thomas E. Bearden (ret.) in the following primary sources: "Toward a New Electromagnetics Parts 3 & 4" (1983, Tesla Book Company); "Comments on the New Tesla Electromagnetics Parts I & II" (1982); "Gravitobiology" (1991, Tesla Book Company); "Analysis of Scalar/EM Technology" (1990). The novel aspects of this invention arise from the first commercial engineering implementation of Bearden's documented vacuum energy extraction and scalar field manipulation principles.`, 8, false, [160, 160, 160], 8);

    doc.save(`${inv.symbol}_Patent_Disclosure_${new Date().toISOString().slice(0, 10)}.pdf`);
    setExportLoading(false);
  };

  return (
    <ToolGate requiredFlag="patentTools" requiredTierName="Researcher ($97/mo)" requiredPrice={97}>
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base tracking-tight">Zenith Apex Research Database — Patent Drafting & IP Valuation Generator</h1>
            <p className="text-gray-500 text-xs">Bearden invention blueprints → formal legal-ready patent disclosures</p>
          </div>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-1 text-xs">
          {[["1", "Select"], ["2", "Configure"], ["3", "Generate"], ["4", "Export"]].map(([n, label], i) => (
            <div key={n} className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-all ${step > i + 1 ? "bg-green-700 text-white" : step === i + 1 ? "bg-blue-700 text-white" : "bg-gray-800 text-gray-600"}`}>
                {step > i + 1 ? <CheckCircle2 size={12} /> : n}
              </div>
              <span className={step === i + 1 ? "text-white" : "text-gray-600"}>{label}</span>
              {i < 3 && <span className="text-gray-700 mx-1">›</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Left panel — Invention selector */}
        <div className="w-full lg:w-[320px] flex-shrink-0 border-r border-gray-800 overflow-y-auto">
          <div className="p-4 border-b border-gray-800">
            <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-1">Invention Blueprints</p>
            <p className="text-gray-600 text-xs">Select one to draft patent claims</p>
          </div>
          <div className="p-3 space-y-2">
            {INVENTIONS.map(inv => (
              <button key={inv.id} onClick={() => { setSelectedInv(inv.id); setStep(2); setGeneratedDoc(null); }}
                className={`w-full text-left p-3 rounded-xl border transition-all ${selectedInv === inv.id ? "border-blue-600 bg-blue-950/30" : "border-gray-800 hover:border-gray-600 bg-gray-900"}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-mono text-xs text-blue-400 font-bold">{inv.symbol}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${inv.novelty === "very_high" ? "bg-purple-900/50 text-purple-300" : inv.novelty === "high" ? "bg-blue-900/50 text-blue-300" : "bg-gray-800 text-gray-400"}`}>
                    {inv.novelty.replace("_", " ")}
                  </span>
                </div>
                <p className="text-white text-xs font-bold leading-snug mb-1">{inv.title}</p>
                <p className="text-gray-500 text-xs">{inv.category}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                  <DollarSign size={10} />
                  <span>${inv.market}M TAM</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right — main workspace */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {!selectedInv && (
            <div className="flex flex-col items-center justify-center h-full text-center py-24">
              <FileText size={48} className="text-gray-700 mb-4" />
              <h2 className="text-white font-bold text-xl mb-2">Select an Invention Blueprint</h2>
              <p className="text-gray-500 text-sm max-w-md">Choose one of the 14 Bearden invention blueprints from the left panel to begin drafting formal patent claims and calculating IP valuation.</p>
            </div>
          )}

          {inv && (
            <>
              {/* Invention summary */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="font-mono text-blue-400 text-xs font-bold">{inv.symbol}</span>
                    <h2 className="text-white font-black text-xl leading-tight mt-0.5">{inv.title}</h2>
                    <p className="text-gray-500 text-xs mt-1">{inv.category}</p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-lg font-bold ${inv.novelty === "very_high" ? "bg-purple-900 text-purple-200" : "bg-blue-900 text-blue-200"}`}>
                    Novelty: {inv.novelty.replace("_", " ")}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-800/60 rounded-xl p-3">
                    <p className="text-red-400 font-bold mb-1">Problem Solved</p>
                    <p className="text-gray-300 leading-relaxed">{inv.problem}</p>
                  </div>
                  <div className="bg-gray-800/60 rounded-xl p-3">
                    <p className="text-green-400 font-bold mb-1">Technical Solution</p>
                    <p className="text-gray-300 leading-relaxed">{inv.solution}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-gray-500 text-xs font-bold mb-1.5 uppercase tracking-wider">Key Components</p>
                  <div className="flex flex-wrap gap-1.5">
                    {inv.components.map((c, i) => <span key={i} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">{c}</span>)}
                  </div>
                </div>
              </div>

              {/* Step 2: Configuration */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <SectionHeader n="2" title="Configure Patent Filing" desc="Enter inventor details and target jurisdictions" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-gray-400 text-xs block mb-1">Inventor Name(s)</label>
                    <input value={inventorName} onChange={e => setInventorName(e.target.value)}
                      placeholder="e.g. Jane Smith, John Doe"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-600" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs block mb-1">Assignee / Company</label>
                    <input value={assignee} onChange={e => setAssignee(e.target.value)}
                      placeholder="e.g. Scalar Energy Corp."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-600" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-gray-400 text-xs block mb-2">Filing Jurisdictions <span className="text-gray-600">(select all that apply)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {JURISDICTIONS.map(j => (
                      <button key={j} onClick={() => toggleJurisdiction(j)}
                        className={`px-3 py-1.5 rounded-lg text-xs border font-semibold transition-all ${jurisdictions.includes(j) ? "bg-blue-900/40 border-blue-600 text-blue-300" : "border-gray-700 text-gray-500 hover:border-gray-500"}`}>
                        {j}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-xs block mb-1">Additional Technical Context <span className="text-gray-600">(optional)</span></label>
                  <textarea value={extraContext} onChange={e => setExtraContext(e.target.value)}
                    rows={3} placeholder="Any specific embodiments, test results, or technical details to include..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 resize-none" />
                </div>
              </div>

              {/* Step 3: Generate */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <SectionHeader n="3" title="Generate Patent Disclosure" desc="AI drafts full legal-ready document using Claude Sonnet" />
                <div className="bg-blue-950/30 border border-blue-900/40 rounded-xl p-3 mb-4 text-xs text-blue-300 leading-relaxed">
                  <span className="font-bold">What gets generated:</span> Abstract · Field & Background · Summary · Drawing descriptions · Detailed embodiment description · 3 independent claims · 8–10 dependent claims · Advantages over prior art. Uses formal USPTO-style language with Bearden theoretical attribution.
                </div>
                <button onClick={handleGenerate} disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-700 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />}
                  {loading ? "Drafting patent document…" : "Generate Full Patent Disclosure"}
                </button>
                {loading && <p className="text-gray-500 text-xs mt-2">Using Claude Sonnet for technical depth — typically 20–40 seconds…</p>}
              </div>

              {/* Step 4: Results */}
              {generatedDoc && (
                <>
                  {/* IP Valuation */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <SectionHeader n="4a" title="IP Valuation Estimate" desc="Based on TAM, novelty score, prior art risk, and jurisdiction coverage" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {[
                        { label: "Estimated Valuation", value: `$${valuation}M`, color: "#22c55e", big: true },
                        { label: "TAM", value: `$${inv.market}M`, color: "#3b82f6", big: false },
                        { label: "Novelty Score", value: `${NOVELTY_SCORES[inv.novelty]}/100`, color: "#a855f7", big: false },
                        { label: "Jurisdictions", value: jurisdictions.length, color: "#f59e0b", big: false },
                      ].map(({ label, value, color, big }) => (
                        <div key={label} className="bg-gray-800/60 rounded-xl p-3 text-center">
                          <p className={`font-black ${big ? "text-2xl" : "text-xl"}`} style={{ color }}>{value}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-gray-800/40 rounded-xl p-3">
                        <p className="text-gray-400 font-bold mb-1">Prior Art Risk</p>
                        <p className={`font-black text-sm ${inv.prior_art_risk === "low" ? "text-green-400" : inv.prior_art_risk === "medium" ? "text-yellow-400" : "text-red-400"}`}>
                          {inv.prior_art_risk.toUpperCase()} RISK
                        </p>
                        <p className="text-gray-500 mt-1">{inv.prior_art_risk === "low" ? "Strong position — limited prior art" : inv.prior_art_risk === "medium" ? "Moderate — prior art exists but distinguishable" : "High — differentiation claims critical"}</p>
                      </div>
                      <div className="bg-gray-800/40 rounded-xl p-3">
                        <p className="text-gray-400 font-bold mb-1">Claim Strength</p>
                        <p className="text-green-400 font-black text-sm">{claimsCount} INDEPENDENT</p>
                        <p className="text-gray-500 mt-1">{generatedDoc.dependent_claims?.length || 0} dependent claims · {jurisdictions.length} jurisdictions</p>
                      </div>
                      <div className="bg-gray-800/40 rounded-xl p-3">
                        <p className="text-gray-400 font-bold mb-1">Recommended Strategy</p>
                        <p className="text-blue-300 font-bold text-xs leading-relaxed">
                          {jurisdictions.length >= 3 ? "PCT filing for maximum international coverage" : "File provisionals first, convert within 12 months"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Generated document preview */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <SectionHeader n="4b" title="Generated Patent Disclosure" desc="Review before exporting to PDF" />
                      <button onClick={handleExportPDF} disabled={exportLoading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-green-700 hover:bg-green-600 disabled:opacity-60 transition-all flex-shrink-0">
                        {exportLoading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                        Export Legal PDF
                      </button>
                    </div>

                    <div className="space-y-4">
                      {[
                        { label: "Abstract", content: generatedDoc.abstract },
                        { label: "Field of the Invention", content: generatedDoc.field_of_invention },
                        { label: "Background", content: generatedDoc.background },
                        { label: "Summary", content: generatedDoc.summary },
                        { label: "Brief Description of Drawings", content: generatedDoc.drawings_description },
                        { label: "Detailed Description of Preferred Embodiments", content: generatedDoc.detailed_description },
                      ].map(({ label, content }) => (
                        <DocSection key={label} label={label} content={content} />
                      ))}

                      {/* Claims */}
                      <div className="border border-blue-900/40 rounded-xl overflow-hidden">
                        <button onClick={() => setClaimsExpanded(e => !e)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-blue-950/30 hover:bg-blue-950/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-300 font-black text-xs uppercase tracking-widest">Claims</span>
                            <span className="bg-blue-900 text-blue-200 text-xs px-2 py-0.5 rounded-full font-bold">
                              {(generatedDoc.independent_claims?.length || 0) + (generatedDoc.dependent_claims?.length || 0)} total
                            </span>
                          </div>
                          {claimsExpanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                        </button>
                        {claimsExpanded && (
                          <div className="p-4 space-y-3">
                            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Independent Claims</p>
                            {(generatedDoc.independent_claims || []).map((claim, i) => (
                              <div key={i} className="bg-gray-800/50 rounded-lg p-3 text-gray-300 text-xs leading-relaxed">
                                <span className="text-white font-bold mr-1">{i + 1}.</span>{claim}
                              </div>
                            ))}
                            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mt-3">Dependent Claims</p>
                            {(generatedDoc.dependent_claims || []).map((claim, i) => (
                              <div key={i} className="bg-gray-800/30 rounded-lg p-3 text-gray-400 text-xs leading-relaxed">
                                <span className="text-gray-300 font-bold mr-1">{(generatedDoc.independent_claims?.length || 0) + i + 1}.</span>{claim}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Advantages */}
                      <div className="bg-green-950/20 border border-green-900/30 rounded-xl p-4">
                        <p className="text-green-400 font-black text-xs uppercase tracking-widest mb-3">Advantages Over Prior Art</p>
                        <ul className="space-y-1.5">
                          {(generatedDoc.claim_advantages || []).map((adv, i) => (
                            <li key={i} className="flex gap-2 text-gray-300 text-xs leading-relaxed">
                              <CheckCircle2 size={12} className="text-green-500 flex-shrink-0 mt-0.5" />{adv}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-yellow-950/20 border border-yellow-900/30 rounded-xl p-4 flex gap-3">
                        <AlertCircle size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-yellow-200 text-xs leading-relaxed">
                          This AI-generated disclosure is a <strong>drafting aid</strong>. It must be reviewed and filed by a licensed patent attorney. Claims should be refined based on a professional prior art search before submission to any patent office.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </ToolGate>
  );
}

function DocSection({ label, content }) {
  const [open, setOpen] = useState(label === "Abstract");
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-800/40 hover:bg-gray-800/60 transition-colors">
        <span className="text-gray-300 font-bold text-xs uppercase tracking-widest">{label}</span>
        {open ? <ChevronUp size={13} className="text-gray-600" /> : <ChevronDown size={13} className="text-gray-600" />}
      </button>
      {open && <div className="px-4 pb-4 pt-2 text-gray-300 text-xs leading-relaxed whitespace-pre-wrap">{content}</div>}
    </div>
  );
}