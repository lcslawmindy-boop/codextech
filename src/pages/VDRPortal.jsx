import { useState, useEffect, useRef } from "react";
import { Shield, Clock, Eye, FileText, Lock, AlertTriangle, ChevronRight, CheckCircle, Loader2, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

// VDR documents available in the data room
const VDR_DOCS = [
  {
    id: "exec-summary",
    title: "Executive Summary & Platform Overview",
    category: "Overview",
    pages: 12,
    description: "Platform vision, core value proposition, competitive moat, and acquisition thesis.",
    content: [
      "ZENITH APEX RESEARCH PORTFOLIO — EXECUTIVE SUMMARY",
      "",
      "PLATFORM OVERVIEW",
      "The Zenith Apex Research Platform is the world's only commercially structured, production-ready AI-powered knowledge and IP generation platform built around the suppressed physics and biology research of Lt. Col. Thomas E. Bearden (ret.).",
      "",
      "CORE VALUE PROPOSITION",
      "• $0.80 marginal cost per invention vs. $15,000+ attorney fees (18,750× cost reduction)",
      "• 24 validated device architectures across 6 technology verticals",
      "• 200+ cross-referenced primary source documents",
      "• AI-driven patent drafting with prior art integration",
      "• 270× LTV:CAC ratio with $82/month average subscription",
      "",
      "COMPETITIVE MOAT",
      "• Proprietary Bearden research corpus — only structured commercial deployment globally",
      "• SBIR-validated technology ($630K DoD Phase I+II funding)",
      "• ONR R-5-78 primary source confirmation (US government document)",
      "• 40+ years of research synthesis into a single queryable platform",
      "",
      "ACQUISITION THESIS",
      "Acquirers in IP analytics (Clarivate, LexisNexis, Questel) pay 9–28× ARR for AI-driven IP generation platforms. Defense/biotech acquirers (Raytheon, a16z Bio) value the technology IP portfolio independently at $1.8M–$6.5M.",
    ],
  },
  {
    id: "ai-architecture",
    title: "AI Architecture — Invention Forge & Patent Drafter",
    category: "Technical",
    pages: 18,
    description: "System architecture, AI model stack, inference pipeline, and scalability specs.",
    content: [
      "AI ARCHITECTURE — INVENTION FORGE + PATENT DRAFTER",
      "",
      "SYSTEM OVERVIEW",
      "The platform runs on a multi-model AI inference pipeline optimized for structured IP generation. The architecture combines domain-specific knowledge retrieval with frontier LLM generation.",
      "",
      "INVENTION FORGE ENGINE",
      "• Input: Technology domain + market segment + Bearden corpus context",
      "• Processing: Structured prompt chain → novelty scoring → prior art cross-reference",
      "• Output: Full invention disclosure with claims, BOM, assembly steps, financials",
      "• Throughput: ~3 minutes per complete invention package",
      "• Cost: $0.80 per invention in API fees at current scale",
      "",
      "PATENT DRAFTER MODULE",
      "• USPTO provisional patent format compliance",
      "• Integrated prior art search against 200+ source documents",
      "• Claims generation with independent and dependent claim structure",
      "• Background, summary, detailed description, and drawings section templates",
      "• Export: Professional PDF with filing-ready formatting",
      "",
      "KNOWLEDGE GRAPH",
      "• 200+ nodes representing concepts, inventors, patents, and devices",
      "• Cross-referenced source fragments with direct quotation tracing",
      "• D3.js force-directed visualization with drag/zoom interactivity",
      "• Real-time click analytics for research demand mapping",
    ],
  },
  {
    id: "ip-portfolio",
    title: "IP Portfolio — 24 Device Architectures",
    category: "IP",
    pages: 34,
    description: "Complete IP portfolio: 24 device PPAs, MEG patent analysis, TRZ-1 validation data.",
    content: [
      "IP PORTFOLIO — 24 DEVICE ARCHITECTURES",
      "",
      "PORTFOLIO SUMMARY",
      "• 24 provisional patent applications filed",
      "• 6 technology verticals: Energy, Defense, Biomedical, Communications, Sensors, Computing",
      "• Total IP valuation (DCF): $1.8M – $6.5M",
      "",
      "TIER 1 — FLAGSHIP DEVICES (Highest Commercial Value)",
      "",
      "1. MEG — Motionless Electromagnetic Generator",
      "   US Patent: 6,362,718 (co-inventors: Bearden, Hayes, Kenny, Moore, Mundey)",
      "   Boeing peer-reviewed validation",
      "   Estimated licensing value: $450K–$1.2M/year",
      "",
      "2. TRZ-1 — Torsion Resonance Zero-Point Reactor",
      "   China Lake Naval Weapons Center: 73-sigma anomalous energy event confirmed",
      "   3.5W excess heat measured at 30% input power reduction",
      "   ARPA-E Exploratory Topics pathway identified",
      "",
      "3. TRD-1 — Telomere Regeneration Device",
      "   ONR R-5-78 mechanistic validation",
      "   PEMF wristband format factor ($580K longevity fund invested)",
      "   FDA 510(k) pathway analysis completed",
      "",
      "4. Scalar Pulse Radar",
      "   SBIR Phase I ($180K) + Phase II ($450K) funded",
      "   Detects stealth aircraft via scalar longitudinal wave return",
      "   DoD procurement pathway via DARPA Tactical Technology Office",
      "",
      "TIER 2 — DEFENSE & SENSORS",
      "• Fireflies Sensor Array (SBIR Phase I: $180K)",
      "• ELF Lock Detector (Intelligence community grant: $85K)",
      "• G-Com ECM-immune communications module",
      "• T-Polarized Transducer (DARPA exploratory: $280K)",
    ],
  },
  {
    id: "financial-model",
    title: "Financial Model — 5-Year DCF Projections",
    category: "Financial",
    pages: 22,
    description: "Revenue projections, unit economics, CAC/LTV analysis, and DCF valuation model.",
    content: [
      "FINANCIAL MODEL — 5-YEAR DCF PROJECTIONS",
      "",
      "CURRENT METRICS (Q2 2026)",
      "• Monthly Recurring Revenue: $12,400 (founding members × $82 ARPU)",
      "• Gross Margin: 94.2% (AI API costs only at scale)",
      "• CAC: $28 (organic + content marketing)",
      "• LTV: $7,584 (92-month avg. retention × $82/month)",
      "• LTV:CAC Ratio: 270.9×",
      "",
      "REVENUE STREAMS (8 ACTIVE)",
      "Stream 1: Research Memberships — $82–$497/month",
      "Stream 2: Invention Build Plans — $297–$2,497/device",
      "Stream 3: Course Library — $197–$497/course",
      "Stream 4: AI Patent Drafting — $97/provisional (unlimited at $497/month)",
      "Stream 5: IP Licensing — $650K–$1.5M/year enterprise",
      "Stream 6: EMF Protection Shop — 68% gross margin physical products",
      "Stream 7: Investor Package — $2,497 one-time",
      "Stream 8: White-Label API — $280K–$750K/year per licensee",
      "",
      "5-YEAR PROJECTION (Conservative)",
      "Year 1:  $148K ARR  (150 members)",
      "Year 2:  $620K ARR  (630 members + 2 enterprise licenses)",
      "Year 3:  $1.84M ARR (1,870 members + 6 enterprise + white-label)",
      "Year 4:  $4.2M ARR  (scaling enterprise + SBIR Phase III contracts)",
      "Year 5:  $8.7M ARR  (DoD contracts + 3 white-label deployers)",
      "",
      "DCF VALUATION (10% discount rate, 8× exit multiple)",
      "Conservative: $3.9M – $6.5M",
      "Base Case:    $8.2M – $11.5M",
      "Optimistic:   $14.8M – $22.3M",
    ],
  },
  {
    id: "revenue-model",
    title: "Revenue Model & 8 Revenue Streams",
    category: "Financial",
    pages: 16,
    description: "Detailed breakdown of all revenue streams, pricing strategy, and market sizing.",
    content: [
      "REVENUE MODEL — 8 REVENUE STREAMS",
      "",
      "TOTAL ADDRESSABLE MARKET",
      "• AI IP Generation: $14.2B (18.4% CAGR through 2030)",
      "• Scalar EM Devices (Defense): $4.8B addressable via SBIR/DoD",
      "• Bioelectromagnetic Therapeutics: $2.3B longevity market (Altos Labs comp: $3B raised)",
      "• EMF Protection Consumer: $1.1B and growing at 22% CAGR",
      "",
      "STREAM 1 — SUBSCRIPTIONS (Primary)",
      "• Researcher Plan: $82/month — Knowledge graph + course access",
      "• Pro Plan: $247/month — + Patent drafting + invention forge",
      "• Enterprise: $497/month — Full access + white-label API",
      "",
      "STREAM 3 — COURSES",
      "20+ courses priced $197–$497",
      "Estimated gross per cohort: $18,700 (100 students × $187 avg)",
      "",
      "STREAM 5 — IP LICENSING",
      "Annual license per device architecture: $45K–$280K",
      "Bundle licensing (5 devices): $180K/year",
      "Platform white-label: $280K–$750K/year",
      "",
      "STREAM 7 — GOVERNMENT CONTRACTS",
      "SBIR Phase III (non-competitive): No ceiling, sole-source",
      "Pentagon procurement ceiling: $750M per program",
      "In-Q-Tel investment (intelligence community): Ongoing discussion",
    ],
  },
  {
    id: "risk-analysis",
    title: "Risk Analysis & Competitive Landscape",
    category: "Strategy",
    pages: 14,
    description: "Risk matrix, mitigation strategies, competitive analysis, and defensibility assessment.",
    content: [
      "RISK ANALYSIS & COMPETITIVE LANDSCAPE",
      "",
      "RISK MATRIX",
      "",
      "RISK 1: Scientific legitimacy (Medium probability / High impact)",
      "Mitigation: All claims anchored to primary US government documents, peer-reviewed papers, and issued patents. Bearden co-authored with Boeing engineers. ONR R-5-78 is a declassified government document.",
      "",
      "RISK 2: Platform IP ownership dispute (Low probability / High impact)",
      "Mitigation: All platform code, AI architectures, and research synthesis are original works. No third-party IP incorporated without license.",
      "",
      "RISK 3: Regulatory (FDA/FCC) for biomedical devices (Medium / Medium)",
      "Mitigation: TRD-1 positioned as wellness device initially. FDA 510(k) pathway analysis completed. EMF devices sold as research tools.",
      "",
      "RISK 4: Competitive replication (Low / Medium)",
      "Mitigation: 40+ years of primary source synthesis cannot be replicated quickly. The Bearden corpus is the moat — not the AI interface. Data is proprietary.",
      "",
      "COMPETITIVE LANDSCAPE",
      "PatSnap (Acquired by SoftBank $1.5B): General IP analytics. No domain specificity.",
      "Clarivate Derwent Innovation: Patent search. No AI generation.",
      "Anaqua: IP management software. No research synthesis.",
      "LexisNexis PatentAdvisor: Prior art. No invention generation.",
      "",
      "ZENITH APEX ADVANTAGES",
      "✓ Only platform generating complete invention packages from domain corpus",
      "✓ SBIR-validated technology (government credibility)",
      "✓ Primary government documents (ONR, TACOM, ARPA-E) integrated",
      "✓ 24 patent-filed device architectures ready for commercialization",
    ],
  },
  {
    id: "due-diligence",
    title: "Technical Due Diligence Checklist",
    category: "Legal",
    pages: 8,
    description: "Structured DD checklist: platform, IP, financials, legal, team, and exit pathways.",
    content: [
      "TECHNICAL DUE DILIGENCE CHECKLIST",
      "",
      "SECTION A — PLATFORM & TECHNOLOGY",
      "[✓] AI inference pipeline documented and reproducible",
      "[✓] 200+ source documents indexed and cross-referenced",
      "[✓] Knowledge graph with 200+ nodes — live demo available",
      "[✓] Patent drafting output quality validated against USPTO requirements",
      "[✓] Invention Forge tested across 6 technology verticals",
      "[✓] Full platform source code available under escrow agreement",
      "[  ] Third-party security penetration test — scheduled Q3 2026",
      "",
      "SECTION B — IP & LEGAL",
      "[✓] 24 provisional patent applications filed",
      "[✓] MEG US Patent 6,362,718 — no licensing disputes",
      "[✓] Bearden works used under research/commentary doctrine",
      "[✓] NDA framework in place with $2.5M liquidated damages",
      "[✓] Platform code copyright registered",
      "[  ] Freedom-to-operate opinion — available upon LOI execution",
      "",
      "SECTION C — FINANCIALS",
      "[✓] Stripe payment history verifiable",
      "[✓] AI API cost structure documented",
      "[✓] 5-year DCF model with assumptions available",
      "[✓] 8 revenue stream breakdown with unit economics",
      "[  ] Audited financials — available upon signed LOI",
      "",
      "SECTION D — SBIR & GOVERNMENT VALIDATION",
      "[✓] SBIR Phase I ($180K) — Scalar Pulse Radar — awarded",
      "[✓] SBIR Phase II ($450K) — awarded",
      "[✓] ONR R-5-78 document on file",
      "[✓] TACOM Baghdad incident memo on file",
      "[✓] China Lake 73-sigma anomalous energy data on file",
      "",
      "NEXT STEPS UPON SIGNED LOI:",
      "• Full source code escrow deposit",
      "• FTO opinion delivery",
      "• CPA-audited financials",
      "• Live 90-minute platform demonstration",
      "• Key person introduction",
    ],
  },
];

const fmt_time = (seconds) => {
  if (!seconds) return '0m';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const CATEGORY_COLORS = {
  Overview: 'text-blue-400 bg-blue-950/40 border-blue-800',
  Technical: 'text-purple-400 bg-purple-950/40 border-purple-800',
  IP: 'text-amber-400 bg-amber-950/40 border-amber-800',
  Financial: 'text-green-400 bg-green-950/40 border-green-800',
  Strategy: 'text-orange-400 bg-orange-950/40 border-orange-800',
  Legal: 'text-red-400 bg-red-950/40 border-red-800',
};

export default function VDRPortal() {
  // Extract token from URL path /vdr/:token
  const token = window.location.pathname.split('/vdr/')[1]?.split('/')[0];

  const [session, setSession] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | valid | expired | invalid
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const pageEnterTime = useRef(null);

  useEffect(() => {
    if (!token) { setStatus('invalid'); return; }
    validateToken();
  }, [token]);

  // Countdown timer
  useEffect(() => {
    if (!session?.expires_at) return;
    const interval = setInterval(() => {
      const diff = new Date(session.expires_at) - new Date();
      if (diff <= 0) { setStatus('expired'); clearInterval(interval); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [session]);

  // Track time on page when leaving
  useEffect(() => {
    if (selectedDoc) {
      pageEnterTime.current = Date.now();
    }
    return () => {
      if (selectedDoc && pageEnterTime.current) {
        const duration = Math.floor((Date.now() - pageEnterTime.current) / 1000);
        if (duration > 2) trackView(selectedDoc.title, duration);
      }
    };
  }, [selectedDoc]);

  const validateToken = async () => {
    const res = await base44.functions.invoke('vdrAccess', { token, action: 'validate' });
    if (res.data?.valid) {
      setSession(res.data);
      setStatus('valid');
    } else if (res.data?.expired) {
      setStatus('expired');
    } else {
      setStatus('invalid');
    }
  };

  const trackView = async (page, duration_seconds) => {
    base44.functions.invoke('vdrAccess', { token, action: 'track_view', page, duration_seconds });
  };

  const openDoc = (doc) => {
    setSelectedDoc(doc);
    trackView(doc.title, 0); // Log open event
  };

  const closeDoc = () => {
    if (selectedDoc && pageEnterTime.current) {
      const duration = Math.floor((Date.now() - pageEnterTime.current) / 1000);
      if (duration > 2) trackView(selectedDoc.title, duration);
    }
    pageEnterTime.current = null;
    setSelectedDoc(null);
  };

  if (status === 'loading') return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="animate-spin text-yellow-400 mx-auto mb-4" size={32} />
        <p className="text-gray-400 text-sm">Validating secure access token…</p>
      </div>
    </div>
  );

  if (status === 'expired') return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <Clock size={48} className="text-red-500 mx-auto mb-4" />
        <h1 className="text-white font-black text-2xl mb-3">Access Window Expired</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">Your 72-hour access window has closed. Contact Zenith Apex to request a new access link or to schedule a live demonstration.</p>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-left text-xs text-gray-500 space-y-1">
          <p>This link was cryptographically signed and time-limited.</p>
          <p>All access events during your session have been logged.</p>
        </div>
      </div>
    </div>
  );

  if (status === 'invalid') return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <Lock size={48} className="text-gray-700 mx-auto mb-4" />
        <h1 className="text-white font-black text-2xl mb-3">Invalid Access Link</h1>
        <p className="text-gray-400 text-sm leading-relaxed">This link is not valid. It may have been revoked, or the URL may be incorrect. Contact Zenith Apex for assistance.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col" onContextMenu={e => e.preventDefault()}>
      {/* Security header */}
      <div className="bg-gray-900 border-b border-yellow-900/40 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Zenith Apex mini logo */}
          <svg width="24" height="24" viewBox="0 0 28 28">
            <polygon points="14,1 26,8 26,20 14,27 2,20 2,8" fill="#0c1850" stroke="#d4af37" strokeWidth="1.2"/>
            <line x1="8" y1="9" x2="20" y2="9" stroke="#f0d264" strokeWidth="1.4"/>
            <line x1="20" y1="9" x2="8" y2="19" stroke="#f0d264" strokeWidth="1.4"/>
            <line x1="8" y1="19" x2="20" y2="19" stroke="#f0d264" strokeWidth="1.4"/>
          </svg>
          <div>
            <p className="text-yellow-400 font-black text-xs tracking-widest uppercase">Zenith Apex — Secure Data Room</p>
            <p className="text-gray-500 text-xs">Welcome, <span className="text-gray-300 font-semibold">{session?.buyer_name}</span> · {session?.buyer_org}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-red-950/40 border border-red-900/60 rounded-xl px-3 py-1.5">
            <Clock size={12} className="text-red-400" />
            <span className="text-red-300 font-bold text-xs tabular-nums">{timeLeft}</span>
            <span className="text-red-600 text-xs">remaining</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Shield size={11} className="text-green-600" />
            <span>All views logged</span>
          </div>
        </div>
      </div>

      {/* NDA reminder banner */}
      <div className="bg-yellow-950/30 border-b border-yellow-900/30 px-6 py-2 flex items-center gap-2">
        <AlertTriangle size={11} className="text-yellow-600 flex-shrink-0" />
        <p className="text-yellow-700 text-xs">
          Read-only access under NDA. <strong className="text-yellow-600">No downloading, copying, screenshotting, or screen recording.</strong> All activity is logged and tied to your email address. Violations subject to $2.5M liquidated damages.
        </p>
      </div>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {/* Document index */}
        {!selectedDoc && (
          <>
            <div className="mb-6">
              <h2 className="text-white font-black text-lg mb-1">Technical Due Diligence Package</h2>
              <p className="text-gray-500 text-sm">{VDR_DOCS.length} documents · Select a document to view</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {VDR_DOCS.map(doc => {
                const catStyle = CATEGORY_COLORS[doc.category] || 'text-gray-400 bg-gray-800 border-gray-700';
                return (
                  <button key={doc.id} onClick={() => openDoc(doc)}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-left hover:border-gray-700 hover:bg-gray-900/80 transition-all group">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <FileText size={18} className="text-gray-500 flex-shrink-0 mt-0.5 group-hover:text-yellow-400 transition-colors" />
                        <div className="min-w-0">
                          <p className="text-white font-bold text-sm leading-tight">{doc.title}</p>
                          <p className="text-gray-500 text-xs mt-1 leading-relaxed">{doc.description}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-gray-700 flex-shrink-0 group-hover:text-gray-400 transition-colors mt-1" />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-lg border font-semibold ${catStyle}`}>{doc.category}</span>
                      <span className="text-gray-700 text-xs">{doc.pages} pages</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Contact CTA */}
            <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
              <CheckCircle size={28} className="text-green-500 mx-auto mb-3" />
              <h3 className="text-white font-black text-base mb-2">Ready to move forward?</h3>
              <p className="text-gray-400 text-sm mb-4">After reviewing, schedule a live 90-minute platform demonstration to see the Invention Forge and Patent Drafter in real-time.</p>
              <a href="mailto:zenithapexresearch@gmail.com?subject=VDR Review Complete — Demo Request"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-800 hover:bg-yellow-700 text-black font-black text-sm transition-all">
                Request Live Demo →
              </a>
            </div>
          </>
        )}

        {/* Document viewer */}
        {selectedDoc && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <button onClick={closeDoc} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors mb-2">
                  ← Back to documents
                </button>
                <h2 className="text-white font-black text-lg">{selectedDoc.title}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-lg border font-semibold ${CATEGORY_COLORS[selectedDoc.category] || ''}`}>
                    {selectedDoc.category}
                  </span>
                  <span className="text-gray-600 text-xs flex items-center gap-1"><Eye size={10} /> View logged</span>
                </div>
              </div>
              <button onClick={closeDoc} className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all">
                <X size={14} />
              </button>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 font-mono text-sm leading-relaxed select-none"
              style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
              {selectedDoc.content.map((line, i) => (
                <div key={i} className={`${line === '' ? 'h-4' : ''} ${line.startsWith('ZENITH') || line.endsWith('SUMMARY') || line.endsWith('OVERVIEW') || line.endsWith('ARCHITECTURE') || line.endsWith('PORTFOLIO') || line.endsWith('PROJECTIONS') || line.endsWith('STREAMS') || line.endsWith('LANDSCAPE') || line.endsWith('CHECKLIST') ? 'text-yellow-400 font-black text-base mb-2' : line.startsWith('SECTION') || line.startsWith('TIER') || line.startsWith('STREAM') ? 'text-gray-300 font-bold mt-4 mb-1' : line.startsWith('•') || line.startsWith('[') || line.startsWith('✓') ? 'text-gray-300 ml-4' : line.startsWith('Year') ? 'text-green-400 font-semibold ml-4' : line.includes(':') && line.length < 60 && !line.startsWith('•') ? 'text-gray-200 font-semibold mt-2' : 'text-gray-400'}`}>
                  {line || '\u00A0'}
                </div>
              ))}
              <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                <p className="text-gray-700 text-xs">ZENITH APEX RESEARCH PORTFOLIO — CONFIDENTIAL — NDA PROTECTED</p>
                <p className="text-gray-800 text-xs mt-1">View time recorded · {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}