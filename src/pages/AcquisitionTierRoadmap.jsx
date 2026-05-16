import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, ChevronDown, ChevronUp, CheckCircle, Circle, DollarSign } from "lucide-react";
import jsPDF from "jspdf";

const TIERS = [
  {
    id: "t1",
    label: "Tier 1",
    exit: "$50K – $150K",
    exitLow: 50000,
    exitHigh: 150000,
    color: "#64748b",
    tagline: "Individual Operator / Code + Content Buyer",
    description: "Minimum viable exit. You sell the code, content library, and Stripe infrastructure as-is. No LLC, no patents. Buyer is a solo operator or micro-fund who sees value in the built platform.",
    timeframe: "1–4 weeks",
    totalCost: 250,
    roi: "20–60×",
    buyers: ["Acquire.com individual buyer", "Flippa micro-deal", "Developer looking to run a niche SaaS"],
    steps: [
      { task: "Screenshot Stripe dashboard + subscriber count", cost: 0, effort: "1 hour" },
      { task: "Record 10-min Loom walkthrough", cost: 0, effort: "2 hours" },
      { task: "Create private listing on Acquire.com", cost: 49, effort: "1 hour" },
      { task: "Create confidential listing on Flippa", cost: 49, effort: "1 hour" },
      { task: "Write 1-page asset overview (no attorney needed)", cost: 0, effort: "2 hours" },
      { task: "Stealth listing on MicroAcquire", cost: 0, effort: "30 min" },
      { task: "Respond to buyer inquiries, negotiate directly", cost: 0, effort: "Ongoing" },
      { task: "Basic asset transfer (no LLC — personal)", cost: 150, effort: "1 day" },
    ],
    risks: [
      "No legal entity means you sign personally — liability risk",
      "No patents = no IP defensibility story for buyer",
      "Low multiples — buyers pay less without revenue proof",
      "No broker = you handle all negotiation yourself",
    ],
    unlocks: "Gets you to market fastest with near-zero cost. Best if you need cash quickly.",
  },
  {
    id: "t2",
    label: "Tier 2",
    exit: "$150K – $350K",
    exitLow: 150000,
    exitHigh: 350000,
    color: "#06b6d4",
    tagline: "Tech Acquirer / Packaged SaaS Buyer",
    description: "LLC formed, platform properly packaged, listed with a professional broker. Buyer sees a real business — not just a side project. Stripe revenue history and a proper asset list make this credible.",
    timeframe: "4–10 weeks",
    totalCost: 4000,
    roi: "37–87×",
    buyers: ["Quiet Light Brokerage buyer", "Empire Flippers listing", "Small tech fund", "SaaS rollup operator"],
    steps: [
      { task: "Form Delaware LLC (Stripe Atlas)", cost: 500, effort: "1–3 days" },
      { task: "Open Mercury business bank account", cost: 0, effort: "1 day" },
      { task: "CPA consultation — tax strategy", cost: 800, effort: "2 hours" },
      { task: "Record professional platform walkthrough (Loom + edit)", cost: 500, effort: "1 day" },
      { task: "Submit to Quiet Light for free valuation call", cost: 0, effort: "30 min" },
      { task: "Create private Acquire.com + Flippa listings", cost: 100, effort: "2 hours" },
      { task: "Compile due diligence package (Stripe, subscribers, asset list)", cost: 0, effort: "4 hours" },
      { task: "Engage M&A attorney — 2hr consult for deal structure", cost: 1000, effort: "2 hours" },
      { task: "Revenue growth sprint — targeted ads to get 10+ subscribers", cost: 1000, effort: "2–3 weeks" },
      { task: "Trademark search (USPTO TESS)", cost: 100, effort: "1 hour" },
    ],
    risks: [
      "No patents limits IP story — platform sells as SaaS only",
      "Broker takes 8–12% at close (factored into net)",
      "Revenue under $3K MRR caps multiple",
    ],
    unlocks: "Broker access to pre-vetted buyers. Real legal entity. Credible deal package.",
  },
  {
    id: "t3",
    label: "Tier 3",
    exit: "$350K – $750K",
    exitLow: 350000,
    exitHigh: 750000,
    color: "#a855f7",
    tagline: "IP-Rich SaaS / Broker-Listed Mid-Market Deal",
    description: "3 provisional patents filed, professional IP valuation in hand, $5K+ MRR. Brokers like Empire Flippers actively market this to their pre-vetted buyer network. IP story + revenue = strong multiple.",
    timeframe: "2–5 months",
    totalCost: 18500,
    roi: "19–41×",
    buyers: ["Empire Flippers mid-market", "Strategic SaaS acquirer", "IP licensing firm", "EdTech/LegalTech rollup"],
    steps: [
      { task: "All Tier 2 steps above", cost: 4000, effort: "Weeks 1–3" },
      { task: "File PPA #1 — MEG / Advanced Energy Cluster", cost: 2800, effort: "Week 4–5" },
      { task: "File PPA #2 — Bioelectromagnetic Therapeutics", cost: 2800, effort: "Week 4–5" },
      { task: "File PPA #3 — Scalar EM Communications", cost: 2800, effort: "Week 6" },
      { task: "FTO Analysis (Freedom-to-Operate) — all 6 clusters", cost: 3500, effort: "Week 5–6" },
      { task: "Professional IP Valuation Report (ipvalue.com or similar)", cost: 5000, effort: "Week 6–8" },
      { task: "Trademark filing (USPTO) — 'Aethon Apex IP' IC 042", cost: 1200, effort: "Week 4" },
      { task: "Revenue sprint — get to $5K MRR (ads + outbound)", cost: 1500, effort: "Month 2–3" },
      { task: "Submit to Empire Flippers + Quiet Light simultaneously", cost: 0, effort: "1 hour" },
    ],
    risks: [
      "PPA gives 12-month patent pending — must file utility within 12 months or lose priority",
      "IP valuation adds credibility but buyer may discount if no revenue",
      "FTO required by any sophisticated buyer — skip at your peril",
    ],
    unlocks: "Patent Pending status. Third-party IP valuation. Broker access to $300K–$750K buyer pool.",
  },
  {
    id: "t4",
    label: "Tier 4",
    exit: "$750K – $2M",
    exitLow: 750000,
    exitHigh: 2000000,
    color: "#f97316",
    tagline: "IP Monetization Firm / Strategic Acquirer",
    description: "White-label client or two, $10K+ MRR, 3+ patents pending, IP broker engaged. At this level you're talking to IP monetization firms (Acacia, IPOfferings, Dominion Harbor) who buy to license — not to operate.",
    timeframe: "5–12 months",
    totalCost: 32000,
    roi: "23–63×",
    buyers: ["IPOfferings.com", "Dominion Harbor", "Acacia Research", "Ocean Tomo", "VC-backed IP marketplace"],
    steps: [
      { task: "All Tier 3 steps above", cost: 18500, effort: "Months 1–3" },
      { task: "Land 1–2 white-label SaaS clients ($10K–$20K/yr each)", cost: 2000, effort: "Month 3–6" },
      { task: "Reach $10K MRR (20 subscribers at $497/mo or equivalent)", cost: 2000, effort: "Month 3–6" },
      { task: "Email IPOfferings.com — attach exec summary + IP valuation", cost: 0, effort: "1 hour" },
      { task: "Engage Dominion Harbor — scalar EM + defense angle", cost: 0, effort: "1 hour" },
      { task: "Submit to Acacia Research contact form", cost: 0, effort: "30 min" },
      { task: "File utility patent on strongest cluster (MEG or BioEM)", cost: 8000, effort: "Month 4–6" },
      { task: "Hire part-time BD person for outreach (3 months)", cost: 4500, effort: "Month 3–6" },
      { task: "Build SBIR grant pipeline as revenue proof point", cost: 0, effort: "Month 3–5" },
      { task: "Professional deal advisor (1 retained M&A attorney)", cost: 2000, effort: "Month 5+" },
    ],
    risks: [
      "White-label deals take longer to close than expected — budget 3–4 months",
      "Utility patent filing starts 20-year clock — file strategically",
      "IP monetization firms move slowly — 6–18 months to close",
      "Revenue of $10K MRR needed to credibly claim $1M+ exit",
    ],
    unlocks: "IP broker engagement. Utility patent filed. Recurring revenue proves defensibility. $1M+ buyer pool.",
  },
  {
    id: "t5",
    label: "Tier 5",
    exit: "$2M – $10M+",
    exitLow: 2000000,
    exitHigh: 10000000,
    color: "#ef4444",
    tagline: "Major IP Firm / Defense Prime / Strategic Acquisition",
    description: "This is the 'right buyer finds you' exit. A defense contractor, pharma company, or major IP management firm decides your technology clusters are strategically valuable. Requires a polished, audit-ready deal package, active IP brokers, and ideally 1–2 granted patents.",
    timeframe: "12–24 months",
    totalCost: 75000,
    roi: "27–133×",
    buyers: ["Lockheed / Raytheon BD division", "Pharma R&D acquisition team", "Acacia Research (portfolio buy)", "Ocean Tomo strategic auction", "Major IP law firm (white-label buyout)"],
    steps: [
      { task: "All Tier 4 steps above", cost: 32000, effort: "Months 1–6" },
      { task: "File 2 additional utility patents (BioEM + Scalar Comms)", cost: 16000, effort: "Month 6–9" },
      { task: "Engage Ocean Tomo / FTI Consulting for strategic M&A advisory", cost: 10000, effort: "Month 6" },
      { task: "Commission full IP landscape analysis (all 6 clusters)", cost: 8000, effort: "Month 6–8" },
      { task: "Build $20K+ MRR through enterprise licenses or white-label", cost: 3000, effort: "Month 6–12" },
      { task: "Hire PR / tech journalist for press coverage", cost: 3000, effort: "Month 8–10" },
      { task: "Direct LinkedIn outreach to BD leads at defense primes", cost: 0, effort: "Ongoing" },
      { task: "Present at IP auction or innovation conference", cost: 2000, effort: "Month 9–12" },
      { task: "Full due diligence preparation (audit-ready VDR, legal clean-up)", cost: 2000, effort: "Month 10–12" },
      { task: "M&A attorney full engagement (LOI → APA → close)", cost: 8000, effort: "Month 12–18" },
    ],
    risks: [
      "Requires patience — strategic buyers move on their timeline, not yours",
      "No guarantee a strategic buyer appears — this is upside, not baseline",
      "Total spend of $75K requires either investor capital or strong cash flow",
      "Multiple granted patents needed to credibly ask for $5M+",
      "Press + conference visibility critical to being found by the right buyer",
    ],
    unlocks: "Strategic buyer attention. Multiple granted patents. Audit-ready deal. $2M–$10M+ buyer conversations.",
  },
];

function fmt(n) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function generatePDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  let y = 0;

  // Cover
  doc.setFillColor(8, 12, 35);
  doc.rect(0, 0, W, 297, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("AETHON APEX IP", W / 2, 80, { align: "center" });
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Acquisition Tier Roadmap", W / 2, 95, { align: "center" });
  doc.setFontSize(10);
  doc.setTextColor(180, 180, 220);
  doc.text("What It Takes — Financially — to Reach Each Exit Tier", W / 2, 106, { align: "center" });
  doc.text("From $50K Individual Buyer to $10M+ Major IP Firm", W / 2, 114, { align: "center" });
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 160);
  doc.text(`Prepared: ${new Date().toLocaleDateString()} | zenithapexresearch@gmail.com`, W / 2, 260, { align: "center" });
  doc.text("Confidential — Not a Securities Offering", W / 2, 268, { align: "center" });

  TIERS.forEach((tier, ti) => {
    doc.addPage();
    y = 15;

    // Tier header bar
    const rgb = hexToRgb(tier.color);
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.rect(0, 0, W, 20, "F");
    doc.setFillColor(8, 12, 35);
    doc.rect(0, 20, W, 277, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(`${tier.label} — ${tier.exit}`, 15, 13);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(tier.tagline, 15, 19.5);

    y = 30;
    doc.setTextColor(200, 200, 240);
    doc.setFontSize(8);
    doc.text(tier.description, 15, y, { maxWidth: 180 });
    y += tier.description.length > 200 ? 16 : 12;

    // Key metrics
    const metrics = [
      { label: "Timeframe", value: tier.timeframe },
      { label: "Total Cost", value: `$${tier.totalCost.toLocaleString()}` },
      { label: "Exit Range", value: tier.exit },
      { label: "ROI Multiple", value: tier.roi },
    ];
    metrics.forEach((m, i) => {
      const x = 15 + i * 47;
      doc.setFillColor(20, 25, 60);
      doc.rect(x, y, 43, 14, "F");
      doc.setTextColor(180, 180, 255);
      doc.setFontSize(7);
      doc.text(m.label, x + 2, y + 5);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(m.value, x + 2, y + 11);
      doc.setFont("helvetica", "normal");
    });
    y += 20;

    // Steps
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("WHAT TO DO", 15, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 200, 220);
    doc.setFontSize(7.5);
    tier.steps.forEach(step => {
      if (y > 265) { doc.addPage(); doc.setFillColor(8, 12, 35); doc.rect(0, 0, W, 297, "F"); y = 15; }
      doc.text(`• ${step.task}`, 17, y, { maxWidth: 140 });
      const costStr = step.cost === 0 ? "FREE" : `$${step.cost.toLocaleString()}`;
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
      doc.text(costStr, 175, y, { align: "right" });
      doc.setTextColor(200, 200, 220);
      doc.text(step.effort, 180, y);
      y += step.task.length > 80 ? 9 : 6;
    });

    y += 4;
    // Total cost line
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.rect(15, y, 180, 0.5, "F");
    y += 4;
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("TOTAL INVESTMENT TO REACH THIS TIER", 15, y);
    doc.text(`$${tier.totalCost.toLocaleString()}`, 175, y, { align: "right" });
    y += 8;

    // Buyers
    doc.setFont("helvetica", "normal");
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
    doc.setFontSize(8);
    doc.text("TARGET BUYERS:", 15, y);
    doc.setTextColor(180, 200, 180);
    doc.text(tier.buyers.join("  ·  "), 50, y, { maxWidth: 145 });
    y += 8;

    // Risks
    doc.setTextColor(255, 160, 100);
    doc.setFont("helvetica", "bold");
    doc.text("RISKS TO KNOW:", 15, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 180, 160);
    doc.setFontSize(7);
    tier.risks.forEach(r => {
      if (y > 275) return;
      doc.text(`⚠ ${r}`, 17, y, { maxWidth: 178 });
      y += 5;
    });
  });

  // Summary page
  doc.addPage();
  doc.setFillColor(8, 12, 35);
  doc.rect(0, 0, W, 297, "F");
  y = 20;
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("ACQUISITION TIER COST SUMMARY", 15, y);
  y += 10;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  ["Tier", "Exit Range", "Total Cost", "Timeframe", "ROI", "Key Unlock"].forEach((h, i) => {
    doc.setTextColor(160, 160, 220);
    doc.text(h, [15, 42, 85, 120, 148, 165][i], y);
  });
  y += 5;
  TIERS.forEach(tier => {
    const rgb = hexToRgb(tier.color);
    doc.setFillColor(rgb.r * 0.15, rgb.g * 0.15, rgb.b * 0.15);
    doc.rect(14, y - 3.5, 182, 8, "F");
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
    doc.text(tier.label, 15, y);
    doc.setTextColor(255, 255, 255);
    doc.text(tier.exit, 42, y);
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
    doc.text(`$${tier.totalCost.toLocaleString()}`, 85, y);
    doc.setTextColor(200, 200, 220);
    doc.text(tier.timeframe, 120, y);
    doc.text(tier.roi, 148, y);
    doc.text(tier.unlocks.substring(0, 35), 165, y);
    y += 9;
  });

  y += 10;
  doc.setTextColor(140, 140, 180);
  doc.setFontSize(7);
  doc.text("All projections based on comparable M&A transactions. Not a guarantee of returns. Consult legal, financial, and tax counsel.", 15, y);

  doc.save("Aethon-Apex-IP-Acquisition-Tier-Roadmap.pdf");
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function TierCard({ tier, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ borderColor: tier.color + "40" }}>
      {/* Header */}
      <button onClick={() => setOpen(o => !o)}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 transition-colors hover:brightness-110"
        style={{ background: `linear-gradient(135deg, ${tier.color}22, ${tier.color}08)` }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
            style={{ background: tier.color + "30", color: tier.color, border: `1.5px solid ${tier.color}60` }}>
            T{index + 1}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-white font-black text-base">{tier.exit}</p>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: tier.color + "25", color: tier.color }}>{tier.label}</span>
            </div>
            <p className="text-gray-400 text-xs mt-0.5">{tier.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <p className="font-black text-lg" style={{ color: tier.color }}>${tier.totalCost.toLocaleString()}</p>
            <p className="text-gray-600 text-xs">investment</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-white font-bold text-sm">{tier.timeframe}</p>
            <p className="text-gray-600 text-xs">timeline</p>
          </div>
          {open ? <ChevronUp size={15} className="text-gray-500" /> : <ChevronDown size={15} className="text-gray-500" />}
        </div>
      </button>

      {open && (
        <div className="bg-gray-950/70 px-5 pb-5 pt-4 space-y-5">
          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed">{tier.description}</p>

          {/* Key metrics row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Investment", value: `$${tier.totalCost.toLocaleString()}` },
              { label: "Timeline", value: tier.timeframe },
              { label: "Exit Range", value: tier.exit },
              { label: "ROI Multiple", value: tier.roi },
            ].map((m, i) => (
              <div key={i} className="rounded-xl p-3 text-center border border-gray-800 bg-gray-900/60">
                <p className="text-gray-500 text-xs mb-1">{m.label}</p>
                <p className="font-black text-sm" style={{ color: tier.color }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: tier.color }}>What To Do & What It Costs</p>
            <div className="space-y-1.5">
              {tier.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-gray-900/60 border border-gray-800/60">
                  <Circle size={10} className="flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-200 text-sm leading-snug">{step.task}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{step.effort}</p>
                  </div>
                  <span className={`text-xs font-black whitespace-nowrap flex-shrink-0 ${step.cost === 0 ? "text-green-400" : "text-gray-300"}`}>
                    {step.cost === 0 ? "FREE" : `$${step.cost.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2 px-3 py-2 rounded-xl border"
              style={{ borderColor: tier.color + "50", background: tier.color + "10" }}>
              <p className="text-white font-black text-sm">Total Investment to Reach This Tier</p>
              <p className="font-black text-lg" style={{ color: tier.color }}>${tier.totalCost.toLocaleString()}</p>
            </div>
          </div>

          {/* Target buyers */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-2 text-gray-500">Target Buyers</p>
            <div className="flex flex-wrap gap-2">
              {tier.buyers.map((b, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full border font-medium"
                  style={{ borderColor: tier.color + "40", color: tier.color, background: tier.color + "12" }}>
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-4">
            <p className="text-red-400 text-xs font-black uppercase tracking-widest mb-2">Risks to Know</p>
            <div className="space-y-1.5">
              {tier.risks.map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-red-500 text-xs flex-shrink-0 mt-0.5">⚠</span>
                  <p className="text-red-300/80 text-xs leading-relaxed">{r}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Unlock badge */}
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl"
            style={{ background: tier.color + "15", border: `1px solid ${tier.color}30` }}>
            <CheckCircle size={13} style={{ color: tier.color }} className="flex-shrink-0 mt-0.5" />
            <p className="text-gray-300 text-xs leading-relaxed">{tier.unlocks}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AcquisitionTierRoadmap() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/90 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link to="/exit-advisor" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Exit Advisor
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base">Acquisition Tier Roadmap</h1>
            <p className="text-gray-500 text-xs">$50K Operator → $10M+ Major IP Firm</p>
          </div>
        </div>
        <button onClick={generatePDF}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-black transition-all">
          <Download size={13} /> PDF
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-8 space-y-6">

        {/* Summary table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <p className="text-white font-black text-sm">At a Glance — All 5 Tiers</p>
            <p className="text-gray-500 text-xs mt-0.5">Each tier is cumulative — higher tiers include all steps from lower tiers</p>
          </div>
          <div className="divide-y divide-gray-800/60">
            {TIERS.map((tier, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: tier.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-bold">{tier.label} — <span style={{ color: tier.color }}>{tier.exit}</span></p>
                  <p className="text-gray-600 text-xs truncate">{tier.tagline}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-black text-sm">${tier.totalCost.toLocaleString()}</p>
                  <p className="text-gray-600 text-xs">{tier.timeframe}</p>
                </div>
                <div className="text-right flex-shrink-0 w-14">
                  <p className="font-bold text-sm" style={{ color: tier.color }}>{tier.roi}</p>
                  <p className="text-gray-600 text-xs">ROI</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer note */}
        <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl px-4 py-3">
          <p className="text-blue-300 text-xs leading-relaxed">
            <strong>Note:</strong> Each tier is cumulative — Tier 3 includes everything in Tier 2, Tier 4 includes Tier 3, etc. The cost shown is the <strong>total</strong> to reach that exit level, not incremental. Start at Tier 1 and progress up as capital allows.
          </p>
        </div>

        {/* Tier cards */}
        <div className="space-y-4">
          {TIERS.map((tier, i) => (
            <TierCard key={tier.id} tier={tier} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/investor-budget-sheet"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-white font-black text-sm transition-all">
            <DollarSign size={14} /> Investor Budget Sheet
          </Link>
          <Link to="/acquisition-ready-kit"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-sm transition-all">
            Acquisition Ready Kit →
          </Link>
        </div>

        <p className="text-center text-gray-700 text-xs pb-6">
          Confidential. All projections are estimates based on comparable M&A transactions. Not a guarantee of returns.
        </p>
      </div>
    </div>
  );
}