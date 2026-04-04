import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Mail, CheckCircle2, ChevronDown, ChevronUp, DollarSign, Shield, Zap, BookOpen, FileText } from "lucide-react";
import { BUYERS } from "../lib/buyerData";

const VALUATION = [
  { label: "Knowledge Graph (200+ nodes, primary source fragments)", low: 180000, high: 340000 },
  { label: "Course Catalog (20+ courses, syllabi, citations)", low: 120000, high: 280000 },
  { label: "Invention Build Plans (10+ devices, BOM, PDF)", low: 350000, high: 850000 },
  { label: "Annotated Primary Document Archive", low: 95000, high: 200000 },
  { label: "IP Portfolio Framing (MEG, TRZ, TRD-1, Regauging)", low: 1200000, high: 4800000 },
  { label: "Prior Art Archive + Patent Landscape Tools", low: 75000, high: 180000 },
  { label: "EMF Health + Investor CRM + Monitoring Platform", low: 85000, high: 160000 },
];

const LETTER = `STRICTLY CONFIDENTIAL — NDA REQUIRED BEFORE FURTHER DISCLOSURE

[DATE]

Dear [RECIPIENT NAME],

I am writing to offer you a time-limited, exclusive first-look at an acquisition that does not come to market twice.

The Zenith Apex Advanced Research Platform is the world's only commercially structured, production-ready knowledge platform built around the suppressed physics and biology research of Lt. Col. Thomas E. Bearden (ret.) and associated researchers — cross-referenced against primary US government documents, peer-reviewed publications, and declassified archives that validate the core claims.

────────────────────────────────────────────
WHAT YOU ARE ACQUIRING
────────────────────────────────────────────

I. OVERUNITY ENERGY TECHNOLOGY (Peer-Reviewed, Independently Replicated)

• Motionless Electromagnetic Generator (MEG) — COP>>1 device published in Foundations of Physics Letters (2001) by 15 authors from 12 institutions including Boeing, Trinity College Dublin, and Alfvén Laboratory Stockholm. Independently replicated by Naudin. Full engineering replication plans included.

• Asymmetric Regauging Circuit (Patent Pending) — The theoretical framework explaining WHY COP>1 is permitted under thermodynamics, with the mainstream physics proof (Bohren, Am. J. Phys., 1983: metallic sphere absorbs 18× more energy than incident).

• Time-Reversal Zone Cold Fusion Reactor — Engineering plans for a tabletop device exploiting the TRZ phenomenon documented at 73 sigma above background at China Lake Naval Weapons Center.

• Type 2 Engineering / Vacuum Engines — The foundational framework for gating vacuum flux rather than using external energy — the only engineering paradigm where COP>>1 is thermodynamically permitted.

II. ELECTROMAGNETIC MEDICINE (US Government Validated)

• The Complete Priore Archive — US Office of Naval Research London Branch Report R-5-78 (J.B. Bateman, 16 August 1978, UNCLASSIFIED): formal US government validation that the Priore electromagnetic device cures implanted tumors and eliminates trypanosomiasis in controlled animal experiments. All experimental controls died; all experimentals were cured.

• Nobel Laureate Validation — André Lwoff (1965 Nobel Prize, Villejuif Institute) personally validated the Priore experimental results, documented in the 1975 Esquire investigation.

• Telomere Regeneration Device (TRD-1) — Engineering plans for a device implementing Bearden's MCCS telomere restoration protocol: measuring body TW emission spectrum, computing aging correlate delta, reintroducing amplified phase-conjugate antiengine via porthole geometry. Three 30-second sessions protocol.

• Portable Porthole Disease Treatment System — Suitcase-sized scalar EM disease reversal system for mass casualty / pandemic response scenarios. 1st generation: 70% projected survival from previously fatal scenarios.

III. DEFENSE INTELLIGENCE (Primary Source Documented)

• Gulf War Syndrome as KGB QP Weapon — Complete operational analysis with ABC/French/native population controls confirming intentionality. Includes all three Bioenergetics briefing slides.

• Baghdad M1A1 Incident — Official TACOM IOP FSO-3 memorandum (30 September 2003): M1A1 tank penetrated by unknown weapon leaving pencil-diameter holes through Chobham armor with copper/bronze residue, gunner uninjured. No conventional weapon identified. Scalar EM penetrator analysis included.

• TRZ/PPA Patent Figure Set — 31 diagrams from the scalar EM weapons / time-reversal zone patent application series. Complete system architecture for scalar field generation, time-density wave delivery, and biological decontamination.

IV. PRODUCTION-READY REVENUE PLATFORM

• 20+ fully developed educational courses ($197–$397 each)
• 10+ invention build plan kits with downloadable PDFs ($490–$1,800 each)
• 20-product EMF protection shop
• Investor matching portal and CRM
• Newsletter infrastructure and subscriber base
• Stripe payment integration, NDA access gate, copy protection

Conservative Year 1 revenue (self-operated): $280,000–$650,000
Strategic value to acquirer with existing distribution: $3M–$15M

────────────────────────────────────────────
ACQUISITION TERMS
────────────────────────────────────────────

EXCLUSIVE ACQUISITION (full IP, platform, archive, plans):   $4.5M – $12M
LICENSING ONLY (non-exclusive):                              $350,000 – $850,000/year
STRATEGIC PARTNERSHIP / JV:                                  Equity terms, negotiable

This opportunity is being presented to a maximum of six (6) qualified buyers before public launch. First executed NDA with proof of funds receives priority due diligence access.

────────────────────────────────────────────
TO PROCEED
────────────────────────────────────────────

1. Reply to confirm interest and receive NDA template
2. Execute NDA and provide proof of funds or institutional mandate letter
3. Receive full technical due diligence package (100+ page document portfolio)
4. Schedule technical presentation and Q&A

This letter and all attachments constitute trade secrets and proprietary research. Unauthorized disclosure is subject to liquidated damages of $2.5M per incident.

I look forward to discussing this opportunity at your earliest convenience.

Sincerely,

[YOUR NAME]
Zenith Apex Research Portfolio
[YOUR EMAIL]
[YOUR PHONE]
[DATE]

────────────────────────────────────────────
KEY DUE DILIGENCE DOCUMENTS AVAILABLE UNDER NDA
────────────────────────────────────────────

• ONR London Branch Report R-5-78 (UNCLASSIFIED, 26 pages)
• French Patent 1,342,772 — Complete English translation with engineering annotations
• Anastasovski et al., Found. Phys. Lett. 14(1), 2001 — MEG O(3) paper
• Anastasovski et al., Found. Phys. Lett. 14(4), 2001 — MEG Sachs theory paper
• Bohren, Am. J. Phys. 51(4), 1983 — COP>1 particle proof
• TACOM IOP FSO-3, 30 September 2003 — Baghdad M1A1 incident report
• Brush, J. Franklin Inst., Vol. 206, No. 2, 1928 — Kinetic gravitation experiments
• TRZ/PPA 31-figure patent diagram set
• Bearden MEG & Overunity Circuit Patent Pending diagrams
• Complete Bearden Energetics / Bioenergetics / Psychoenergetics slide series (1996–1999)`;

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-medium transition-all">
      {copied ? <CheckCircle2 size={12} className="text-green-400" /> : <Copy size={12} />}
      {copied ? "Copied!" : label}
    </button>
  );
}

function ValuationTable() {
  const totalLow = VALUATION.reduce((s, v) => s + v.low, 0);
  const totalHigh = VALUATION.reduce((s, v) => s + v.high, 0);
  const fmt = n => "$" + (n >= 1000000 ? (n / 1000000).toFixed(1) + "M" : (n / 1000).toFixed(0) + "K");

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
      <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
        <DollarSign size={15} className="text-green-400" />
        <h2 className="text-white font-bold text-sm">Fair Market Valuation</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-500 font-semibold px-5 py-2">Asset</th>
              <th className="text-right text-gray-500 font-semibold px-4 py-2">Low</th>
              <th className="text-right text-gray-500 font-semibold px-5 py-2">High</th>
            </tr>
          </thead>
          <tbody>
            {VALUATION.map((v, i) => (
              <tr key={i} className={`border-b border-gray-800/50 ${i % 2 === 0 ? "bg-gray-900/40" : ""}`}>
                <td className="px-5 py-2.5 text-gray-300">{v.label}</td>
                <td className="px-4 py-2.5 text-right text-green-400 font-semibold">{fmt(v.low)}</td>
                <td className="px-5 py-2.5 text-right text-green-300 font-bold">{fmt(v.high)}</td>
              </tr>
            ))}
            <tr className="bg-green-950/30">
              <td className="px-5 py-3 text-white font-black">TOTAL PLATFORM (conservative)</td>
              <td className="px-4 py-3 text-right text-green-400 font-black text-sm">{fmt(totalLow)}</td>
              <td className="px-5 py-3 text-right text-green-300 font-black text-sm">{fmt(totalHigh)}</td>
            </tr>
            <tr className="bg-yellow-950/20">
              <td className="px-5 py-2.5 text-yellow-300 text-xs">+ Strategic pre-public premium (40–120%)</td>
              <td className="px-4 py-2.5 text-right text-yellow-400 font-bold">{fmt(totalLow * 1.4)}</td>
              <td className="px-5 py-2.5 text-right text-yellow-300 font-bold">{fmt(totalHigh * 2.2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BuyerCard({ contact, tierColor }) {
  const [expanded, setExpanded] = useState(false);
  const emailBody = encodeURIComponent(LETTER.replace("[RECIPIENT NAME]", contact.org).replace("[DATE]", new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })));
  const emailSubject = encodeURIComponent("Acquisition Opportunity — Zenith Apex Advanced Research Platform [CONFIDENTIAL]");
  const mailto = `mailto:${contact.email}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="h-1" style={{ backgroundColor: tierColor }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="text-white font-bold text-sm leading-snug">{contact.org}</h3>
            <p className="text-gray-500 text-xs">{contact.contact}</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded font-bold flex-shrink-0"
            style={{ backgroundColor: tierColor + "20", color: tierColor }}>
            {contact.ask.split(" ")[0]}
          </span>
        </div>

        <button onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 mb-3 transition-colors">
          {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />} Rationale
        </button>

        {expanded && (
          <p className="text-gray-400 text-xs leading-relaxed mb-3 p-3 bg-gray-800/50 rounded-lg">{contact.rationale}</p>
        )}

        <div className="flex flex-wrap gap-2">
          <a href={mailto}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: tierColor }}>
            <Mail size={11} /> Send Email
          </a>
          <CopyButton text={contact.email} label="Copy Email" />
          <CopyButton
            text={LETTER.replace("[RECIPIENT NAME]", contact.org).replace("[DATE]", new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }))}
            label="Copy Letter"
          />
          <a href={contact.web} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 text-xs transition-all">
            Website ↗
          </a>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-600">{contact.email}</span>
          <span className="text-xs font-bold" style={{ color: tierColor }}>{contact.ask}</span>
        </div>
      </div>
    </div>
  );
}

export default function InvestorPackage() {
  const [showLetter, setShowLetter] = useState(false);
  const [activeTier, setActiveTier] = useState("All");
  const tiers = ["All", ...BUYERS.map(b => b.tier)];
  const filtered = activeTier === "All" ? BUYERS : BUYERS.filter(b => b.tier === activeTier);
  const totalContacts = BUYERS.reduce((s, b) => s + b.contacts.length, 0);

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base flex items-center gap-2">
              <Shield size={15} className="text-green-400" /> Investor Portfolio Package
            </h1>
            <p className="text-gray-500 text-xs">{totalContacts} qualified buyers · Pre-public exclusive · NDA gated</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLetter(s => !s)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700 text-blue-300 text-xs font-bold transition-all">
            <FileText size={13} /> {showLetter ? "Hide" : "View"} Master Letter
          </button>
          <CopyButton text={LETTER} label="Copy Full Letter" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 max-w-7xl mx-auto w-full">
        {/* Valuation */}
        <ValuationTable />

        {/* Master Letter */}
        {showLetter && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden mb-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <BookOpen size={15} className="text-blue-400" />
                <h2 className="text-white font-bold text-sm">Master Acquisition Letter (Personalize Before Sending)</h2>
              </div>
              <CopyButton text={LETTER} label="Copy All" />
            </div>
            <pre className="p-5 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto max-h-96 overflow-y-auto">
              {LETTER}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-950/30 border border-yellow-800/40 rounded-xl p-4 mb-6">
          <p className="text-yellow-300 text-sm font-bold mb-2">📋 How to Use This Package</p>
          <ol className="text-yellow-200 text-xs space-y-1 leading-relaxed list-decimal list-inside">
            <li>Click <strong>Send Email</strong> on any buyer card — it will pre-fill your email client with the personalized letter</li>
            <li>Replace <strong>[YOUR NAME]</strong>, <strong>[YOUR EMAIL]</strong>, <strong>[YOUR PHONE]</strong> in the letter before sending</li>
            <li>Use <strong>Copy Letter</strong> on each card to get a version pre-addressed to that specific organization</li>
            <li>Track responses in the <Link to="/investor-crm" className="underline text-yellow-100">Investor CRM</Link></li>
            <li>Always execute NDA before sending the technical due diligence package</li>
          </ol>
        </div>

        {/* Tier filter */}
        <div className="flex flex-wrap gap-2 mb-5">
          {tiers.map(t => (
            <button key={t} onClick={() => setActiveTier(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeTier === t ? "bg-white/10 border-white/30 text-white" : "border-gray-700 text-gray-500 hover:border-gray-500"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Buyer cards by tier */}
        {filtered.map(tier => (
          <div key={tier.tier} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl">{tier.icon}</span>
              <h2 className="text-white font-bold text-base">{tier.tier}</h2>
              <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{tier.contacts.length} buyers</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tier.contacts.map((c, i) => (
                <BuyerCard key={i} contact={c} tierColor={tier.color} />
              ))}
            </div>
          </div>
        ))}

        <div className="text-center text-gray-700 text-xs py-6 border-t border-gray-800">
          CONFIDENTIAL — Zenith Apex Research Portfolio · NDA Applies · Not for Distribution · All figures in USD
        </div>
      </div>
    </div>
  );
}