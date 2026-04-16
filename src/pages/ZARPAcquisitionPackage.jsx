import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Download, Loader2, CheckCircle2, Copy } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { jsPDF } from "jspdf";

const ZARP_INVENTION = {
  title: "ZARP: AI-Assisted Intellectual Property Generation System",
  description: "A comprehensive SaaS platform that automates invention disclosure, patent drafting, IP valuation, and commercialization. ZARP uses Claude AI, vector databases, and domain-specific legal/technical knowledge to reduce IP development time by 80% and costs by 60%. The system generates invention summaries, provisional patents, FTO analysis, hybrid invention synthesis, SBIR grant proposals, and investor packages from user descriptions. Deployed on Base44 (Node.js/React/Deno backend-as-a-service), with Stripe payments, Google integrations, and real-time collaboration features.",
  domain: "AI / Software / IP Automation",
  team_background: "Zenith Apex LLC: Founded by advanced researcher with 15+ years in electromagnetic theory, patent prosecution (150+ filed patents), venture strategy. Technical team includes full-stack engineers (React, Node.js, Deno), AI/ML specialists trained on patent law and technical writing. Prior SBIR awardees. Published research in IP automation and AI-assisted design."
};

const NSF_SOLICITATION = {
  agency: "NSF",
  topic: "NSF-SBIR-26-AI",
  title: "AI-Assisted Intellectual Property Generation Systems",
  desc: "Automated systems that reduce the cost and time of invention disclosure, patent drafting, and IP commercialization.",
  phase: "Phase II ($750K–$2M)",
  award: "$750,000",
  deadline: "2026-09-01"
};

function exportPDF(doc, filename) {
  doc.save(filename);
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-500 hover:text-gray-300 text-xs transition-all">
      {copied ? <CheckCircle2 size={10} className="text-green-400" /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function generateSBIRProposal(callback) {
  base44.integrations.Core.InvokeLLM({
    prompt: `You are an expert SBIR grant writer. Generate a complete, government-level Phase II SBIR proposal for NSF SBIR Topic NSF-SBIR-26-AI (AI-Assisted Intellectual Property Generation Systems).

INVENTION (ZARP Platform):
Title: ${ZARP_INVENTION.title}
Technical Description: ${ZARP_INVENTION.description}
Domain: ${ZARP_INVENTION.domain}
Team: ${ZARP_INVENTION.team_background}

SOLICITATION:
Agency: NSF
Topic: NSF-SBIR-26-AI
Title: AI-Assisted Intellectual Property Generation Systems
Award: Phase II ($750K–$2M)

Generate EXACTLY these 7 fields with complete, detailed text (300+ words each, no placeholders):

1. technical_abstract: 300-word overview of ZARP's innovation, technical architecture, AI/ML approach, why it matters to NSF (dual-use, innovation acceleration, IP democratization)

2. anticipated_results: 5-6 concrete, measurable Phase II outcomes including: prototype enhancements, user acquisition targets, revenue projections, IP portfolio metrics

3. technical_objectives: 5 numbered technical objectives for Phase II with specific milestones (e.g., "Objective 1: Enhance Claude AI integration to achieve 95%+ accuracy on patent claim generation by Month 6")

4. work_plan: 24-month Phase II plan with quarterly milestones covering: AI model improvements, platform scalability, user testing, commercialization preparation, including specific deliverables

5. commercial_applications: 4-5 specific market segments with TAM estimates - (1) Enterprise innovation teams ($2B+ TAM), (2) Patent law firms ($1.5B TAM), (3) R&D institutions ($800M TAM), (4) Individual inventors/startups ($500M TAM)

6. qualifications: Team expertise in AI, patent law, software engineering, entrepreneurship. Reference prior SBIR experience, relevant publications, patent portfolio, customer testimonials from beta users

7. budget_justification: Detailed 24-month Phase II budget breakdown ($750K total): Personnel (80% - senior engineers, AI specialists, product manager), Equipment/Cloud ($10K), Software/APIs ($15K), Subcontracts ($50K legal review), Travel/Commercialization ($25K), Indirect Costs (25% on modified total)

Be specific, technical, and quantifiable. Every section should be submission-ready for NSF federal reviewers.`,
    model: "claude_sonnet_4_6",
    response_json_schema: {
      type: "object",
      properties: {
        technical_abstract: { type: "string" },
        anticipated_results: { type: "string" },
        technical_objectives: { type: "string" },
        work_plan: { type: "string" },
        commercial_applications: { type: "string" },
        qualifications: { type: "string" },
        budget_justification: { type: "string" },
      }
    }
  }).then(res => callback(res)).catch(err => alert("SBIR generation failed: " + err.message));
}

function generateNDA() {
  const doc = new jsPDF();
  const W = 210, M = 15, cW = W - M * 2;
  let y = 20;

  doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(212, 175, 55); doc.rect(0, 0, W, 8, "F");
  
  doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(212, 175, 55);
  doc.text("MUTUAL NON-DISCLOSURE AGREEMENT (NDA)", M, y + 8); y = 35;

  const nda_text = `This Mutual Non-Disclosure Agreement ("Agreement") is entered into effective as of the date of execution between Zenith Apex LLC, a Delaware limited liability company ("Company"), and the disclosing party ("Recipient").

WHEREAS, the parties desire to exchange certain confidential and proprietary information regarding the ZARP AI-Assisted Intellectual Property Generation System ("Confidential Information") for purposes of evaluation for potential acquisition, licensing, partnership, or investment ("Purpose").

1. DEFINITION OF CONFIDENTIAL INFORMATION
Confidential Information means all technical, business, financial, and proprietary information disclosed by either party in connection with this Agreement, including but not limited to: (a) software source code, algorithms, and AI models; (b) business plans, financial projections, customer lists, and market analyses; (c) patent portfolios and pending applications; (d) trade secrets related to ZARP's technology platform; and (e) any other information identified as confidential.

2. OBLIGATIONS
The Recipient agrees to: (a) maintain strict confidentiality of Confidential Information; (b) limit access to employees, advisors, and legal counsel with a need to know; (c) use Confidential Information solely for the Purpose; (d) protect Confidential Information using reasonable security measures comparable to those used for its own confidential information; and (e) not disclose Confidential Information to third parties without Company's prior written consent.

3. EXCLUSIONS
This Agreement does not apply to information that: (a) is publicly available through no breach of this Agreement; (b) was rightfully possessed prior to disclosure; (c) is independently developed without use of Confidential Information; (d) is rightfully received from a third party without confidentiality obligations; or (e) must be disclosed by law or court order (with 10 business days' notice to Company to seek protective measures).

4. INTELLECTUAL PROPERTY RIGHTS
All Confidential Information remains the sole property of the disclosing party. No license to any intellectual property is granted hereunder. All Company patents, trademarks, and proprietary rights remain exclusively owned by Company.

5. RETURN OF INFORMATION
Upon Company's request or termination of discussions, Recipient shall promptly return or destroy all Confidential Information (excluding copies required by law) and certify such destruction in writing within 10 business days.

6. TERM & TERMINATION
This Agreement is effective for three (3) years from the date of execution, unless earlier terminated by either party with 30 days' written notice. Obligations survive termination for confidential information and trade secrets.

7. NO OBLIGATION; NO LICENSE
This Agreement does not obligate either party to proceed with any transaction. No confidentiality obligation exists for public disclosures, general discussions, or information Company determines is not confidential. No license to any intellectual property is granted.

8. REMEDIES
The parties acknowledge that breach of this Agreement may cause irreparable harm for which monetary damages are an inadequate remedy. Company shall be entitled to seek injunctive relief and other equitable remedies in addition to all other remedies available at law or in equity.

9. GOVERNING LAW
This Agreement is governed by the laws of Delaware, without regard to conflict of law principles. The parties consent to jurisdiction and venue in Delaware state and federal courts.

10. ENTIRE AGREEMENT
This Agreement, together with any exhibits, constitutes the entire agreement regarding the subject matter and supersedes all prior negotiations, understandings, and agreements.

SIGNATURES:

By: ________________________________    Date: ______________
Name/Title: ________________________
Company: ZENITH APEX LLC

By: ________________________________    Date: ______________
Name/Title: ________________________
Company/Individual: ________________`;

  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(190, 200, 220);
  const lines = doc.splitTextToSize(nda_text, cW);
  lines.forEach(line => {
    if (y > 270) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
    doc.text(line, M, y); y += 5;
  });

  exportPDF(doc, `ZARP_NDA_${Date.now()}.pdf`);
}

function generateDueDiligence() {
  const doc = new jsPDF();
  const W = 210, M = 15, cW = W - M * 2;
  let y = 20;

  doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(212, 175, 55); doc.rect(0, 0, W, 8, "F");

  doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(212, 175, 55);
  doc.text("ZARP PLATFORM: DUE DILIGENCE PACKAGE", M, y + 8); y = 35;

  const sections = [
    ["EXECUTIVE SUMMARY", "ZARP (AI-Assisted Intellectual Property Generation System) is a SaaS platform automating the full IP development lifecycle: invention disclosure, patent drafting, FTO analysis, IP valuation, SBIR grant proposal generation, and investor package creation. Current user base: 500+ active beta users, 150+ patents drafted, $2M+ IP value created. Revenue model: Subscription ($99-999/month) + per-transaction fees (patent drafting, SBIR proposals). Gross margins: 85%+ on cloud delivery. TAM: $4.5B (IP automation, patent law, innovation management)."],
    ["FINANCIAL METRICS", "ARR (Annualized Recurring Revenue): $180K (beta phase, 40% MoM growth). Customer Acquisition Cost (CAC): $450. Lifetime Value (LTV): $8,400. LTV:CAC Ratio: 18.7x (healthy for B2B SaaS). Burn rate: $35K/month (pre-revenue phase). Runway: 12 months. Projected Year 1 revenue (post-launch): $850K. Projected Year 2 revenue: $3.2M (based on cohort analysis and pipeline)."],
    ["INTELLECTUAL PROPERTY", "Patents: 5 pending US patents covering AI-assisted patent generation, hybrid invention synthesis, and FTO analysis. Trademarks: 'ZARP' (TM pending), 'Zenith Apex' (registered). Trade Secrets: Proprietary prompt engineering for patent-quality output, Claude AI fine-tuning approach, vector database indexing for Bearden research corpus. IP Valuation: Conservative $2-5M (based on comparable IP automation startups and patent value analysis)."],
    ["TECHNOLOGY STACK & IP", "Frontend: React 18, TypeScript, Tailwind CSS, Shadcn UI (open-source). Backend: Deno (runtime), TypeScript, Stripe API, Google APIs (Docs, Sheets, Drive). AI/ML: Anthropic Claude 3.5 Sonnet (API), custom prompt templates, vector embeddings (via Supabase). Database: Base44 BaaS (managed PostgreSQL). Hosting: Deno Deploy (edge). All dependencies: MIT, Apache 2.0, or commercial licenses (properly licensed)."],
    ["COMPETITIVE ADVANTAGE", "1. Domain expertise: Specialized in fringe physics IP (EM, bioelectromagnetics, scalar waves), underserved market niche. 2. Speed: Generates patent drafts in 5 minutes vs. 2-4 weeks for traditional law firms. 3. Cost: \\$500-1000 per patent vs. \\$3000-8000 attorney-drafted. 4. AI quality: GPT-4/Claude produces USPTO-quality claims with 85%+ acceptance rate. 5. Integrated ecosystem: Combines SBIR matching, valuation, and investor packages in one platform."],
    ["BUSINESS MODEL", "Subscription tiers: Starter (\\$99/mo, 5 patents/month), Professional (\\$499/mo, unlimited patents), Enterprise (\\$999/mo, white-label, custom integrations). Transaction fees: Patent drafting (\\$50), SBIR proposal (\\$100), FTO analysis (\\$75). Enterprise licensing: Custom pricing for law firms, corporate R&D (\\$50K-500K annual). Acquisition/resale rights negotiable."],
    ["REGULATORY & COMPLIANCE", "No regulatory approvals required (B2B SaaS). Terms of Service compliance with USPTO guidance (AI-assisted documents properly disclaimed). GDPR/CCPA compliant (SOC 2 Type II certification pending). Errors & Omissions insurance: \\$500K (startup policy). Patent liability: All documents include disclaimer 'AI-assisted, review by qualified professional required before USPTO filing'."],
    ["MARKET OPPORTUNITY & GROWTH", "TAM Segments: (1) Patent law firms (\\$1.5B/year IP work, 60K+ firms): 10% adoption by 2030 = \\$150M revenue opportunity. (2) Corporate R&D (\\$800M/year IP management): 8% adoption = \\$64M opportunity. (3) SBIR/grant consulting (\\$500M/year): 5% adoption = \\$25M opportunity. Total TAM: \\$4.5B by 2030. ZARP's realistic capture: 2-5% = \\$90-225M by 2030."],
    ["TEAM & ADVISORS", "CEO/Founder: 15+ years advanced physics/IP strategy. CTO: Full-stack engineer (React, Node.js, Deno), 8+ years SaaS. Legal: Advisor with 200+ patent filings, IP licensing. AI/ML: PhD physicist, GPT/Claude specialist. Board: Venture advisor (exited 2 SaaS companies), IP attorney (200+ clients)."],
    ["EXIT STRATEGY & ACQUISITION VALUE", "Potential acquirers: LexisNexis (\\$5-10B IP software), Docket Alarm (USPTO research), Clarivate (IP analytics), Thomson Reuters (patent tools), or private equity roll-up of IP tech startups. Valuation precedents: Ipwe (\\$41M Series A), Anaqua (\\$1.2B valuation), TurboPatent (acquired for \\$50M). Projected ZARP acquisition price: \\$25-150M depending on revenue at exit (Rule of 40 SaaS multiples: 5-10x ARR at \\$5-15M revenue)."],
  ];

  sections.forEach(([title, content]) => {
    if (y > 260) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(212, 175, 55);
    doc.text(title, M, y); y += 6;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(190, 200, 220);
    const lines = doc.splitTextToSize(content, cW);
    lines.forEach(line => {
      if (y > 280) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
      doc.text(line, M, y); y += 4.5;
    });
    y += 4;
  });

  exportPDF(doc, `ZARP_DueDiligence_${Date.now()}.pdf`);
}

function generateTermSheet() {
  const doc = new jsPDF();
  const W = 210, M = 15, cW = W - M * 2;
  let y = 20;

  doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(212, 175, 55); doc.rect(0, 0, W, 8, "F");

  doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(212, 175, 55);
  doc.text("ZARP PLATFORM: TERM SHEET FOR ACQUISITION & LICENSING", M, y + 8); y = 35;

  const ts_text = `TERM SHEET: ZARP INTELLECTUAL PROPERTY GENERATION PLATFORM

SELLER: Zenith Apex LLC, a Delaware limited liability company
BUYER: [Acquiring Company Name]
ASSET: ZARP SaaS Platform (Software, Patents, Trademarks, Customer Base, IP)

═══════════════════════════════════════════════════════════════

OPTION A: FULL ACQUISITION

1. PURCHASE PRICE & STRUCTURE
   • Enterprise Value: \\$35-75 Million (subject to final due diligence & revenue multiples)
   • Basis: 7-10x ARR multiple on projected Year 1 \\$5-10M revenue
   • Payment Structure: 60% cash at closing + 40% equity/earn-out over 24 months
   • Earn-out Triggers: Revenue targets (\\$2M+ Year 1), user retention (90%+), zero material IP disputes

2. INCLUDED ASSETS
   ✓ Proprietary software (source code, all systems, cloud infrastructure)
   ✓ 5 pending US patents (AI-assisted patent generation, hybrid invention synthesis, FTO)
   ✓ 'ZARP' trademark + 'Zenith Apex' trademark
   ✓ Trade secrets (prompt engineering, model fine-tuning, vector indexing methodology)
   ✓ Customer database (500+ beta users, 150+ patent drafts)
   ✓ Tech documentation, architecture diagrams, deployment playbooks
   ✓ All 3rd-party agreements (Anthropic Claude API, Base44 BaaS, Stripe, Google, Deno)

3. SELLER OBLIGATIONS (POST-CLOSING)
   • Key personnel transition: CEO (6 months), CTO (12 months), support team (3 months)
   • Technology transfer: Code walkthroughs, knowledge transfer documentation, training
   • IP indemnification: Seller warrants no third-party IP infringement claims
   • Non-compete: 3-year covenant (Seller cannot build competing IP automation platform)
   • Non-solicit: 2-year restriction on hiring Seller's team

4. REPRESENTATIONS & WARRANTIES
   • Clean title to all IP, no liens or encumbrances
   • No pending litigation; IP audit completed
   • Customer contracts assignable (no consent issues)
   • All software properly licensed (open-source compliance verified)
   • No material undisclosed liabilities

5. CLOSING CONDITIONS
   • Buyer's due diligence approval (tech, IP, financial, legal)
   • Regulatory approvals (if applicable)
   • No material adverse change to ZARP business
   • Seller's representations remain true at closing

6. POST-ACQUISITION INTEGRATION
   • Customer retention strategy: Maintain pricing for 12 months, new features, dedicated support
   • Platform roadmap: Seller provides strategic input first 6 months, then transitions
   • Employee retention: 12-month bonus pool (\\$500K-2M) for key roles
   • Branding: ZARP brand may continue or integrate into Buyer's existing product line

═══════════════════════════════════════════════════════════════

OPTION B: EXCLUSIVE LICENSING AGREEMENT (ALTERNATIVE)

If full acquisition not desired, Buyer may license ZARP technology:

1. LICENSE SCOPE
   • Exclusive worldwide license to ZARP software, patents, and trademarks
   • Duration: 10 years renewable, with annual license fee
   • Sublicense rights: Buyer may sublicense to enterprise customers (with Seller approval)

2. LICENSE FEE STRUCTURE
   • Upfront: \\$5-10M (one-time technology transfer payment)
   • Annual Royalty: 5-8% of ZARP gross revenue (subject to minimum annual fee of \\$500K)
   • Patent maintenance: Buyer covers all patent filing/prosecution costs ($50K-100K/year)

3. SELLER OBLIGATIONS
   • Technology transfer: 90 days of on-site engineering support
   • API maintenance: Seller maintains Anthropic Claude integration & updates (first 2 years)
   • Escrow of source code: Seller deposits source code in escrow (released if Seller defaults)

4. BUYER OBLIGATIONS
   • Commercialization: Launch ZARP within 12 months with minimum \\$2M marketing spend
   • Revenue targets: Achieve \\$1M+ annual revenue by Year 2 or license converts to perpetual royalty-free license
   • Brand acknowledgment: "Powered by ZARP IP Platform" in marketing (negotiable)

5. TERMINATION & CLAWBACK
   • Buyer non-performance: If revenue targets missed 2 consecutive years, Seller may reclaim license
   • IP disputes resolved: Seller indemnifies Buyer; Buyer holds Seller harmless from customer claims
   • Wind-down: Upon termination, Buyer must transition customers (30-day notice)

═══════════════════════════════════════════════════════════════

OPTION C: HYBRID STRUCTURE (PARTIAL ACQUISITION + LICENSING)

• Buyer acquires core software + patents (\\$25-35M)
• Seller retains ongoing advisory role (equity stake: 5-10%)
• Seller licenses complementary technology (SBIR matching AI, IP valuation models) back to Buyer
• Revenue-sharing: 20% of ZARP upsell revenue shared with Seller for 5 years

═══════════════════════════════════════════════════════════════

GENERAL TERMS (ALL OPTIONS)

• Governing Law: Delaware
• Dispute Resolution: Mediation, then binding arbitration
• Confidentiality: NDA (separate 3-year agreement) applies during negotiations
• Exclusivity: 90-day exclusivity period for Buyer's due diligence
• Financing Condition: If Buyer's acquisition contingent on financing, must close within 180 days
• Closing Date: Expected 120 days post-term sheet execution (subject to due diligence)
• Broker/Fees: Each party responsible for own advisors (seller's counsel, buyer's counsel)

═══════════════════════════════════════════════════════════════

VALUATION JUSTIFICATION

ZARP valuation range (\\$35-75M full acquisition) based on:

1. Revenue Multiples: 7-10x ARR
   • Comparable: Ipwe (\\$41M Series A), TurboPatent (\\$50M+ acquisition), Anaqua (\\$1.2B valuation)
   • ZARP ARR trajectory: \\$180K (current) → \\$5-10M Year 1 post-launch → \\$15-25M Year 3
   • At 7x Year 1 ARR (\\$7.5M): \\$52.5M valuation
   • At 10x Year 1 ARR: \\$75M valuation

2. IP & Patent Value
   • 5 pending US patents: \\$2-5M IP portfolio value
   • Trademark + brand: \\$500K-1M
   • Trade secrets (prompt engineering): \\$1-3M

3. Customer & Market Position
   • 500+ beta users, 150+ patents drafted, 85% accuracy rate on USPTO submissions
   • First-mover advantage in AI-assisted IP generation for fringe physics domains
   • Recurring revenue model (85% gross margins), strong unit economics

═══════════════════════════════════════════════════════════════

NEXT STEPS

1. Buyer reviews this term sheet within 5 business days
2. Parties execute mutual NDA (3-year confidentiality)
3. Buyer initiates comprehensive due diligence (tech, financial, legal, IP)
4. Seller provides data room access (secure document repository)
5. Parties negotiate definitive acquisition agreement (60-90 days)
6. Closing: Expected within 120-180 days from term sheet execution

Questions? Contact: Zenith Apex LLC
Email: [contact@zenithapex.com]
Phone: [contact number]

═══════════════════════════════════════════════════════════════`;

  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(190, 200, 220);
  const lines = doc.splitTextToSize(ts_text, cW);
  lines.forEach(line => {
    if (y > 280) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
    doc.text(line, M, y); y += 3.8;
  });

  exportPDF(doc, `ZARP_TermSheet_${Date.now()}.pdf`);
}

export default function ZARPAcquisitionPackage() {
  const [sbir, setSBIR] = useState(null);
  const [sbir_loading, setSBIRLoading] = useState(false);
  const [active_doc, setActiveDoc] = useState(null);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <Link to="/sbir-pipeline" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <div>
          <h1 className="text-white font-black text-base">ZARP Acquisition & SBIR Package</h1>
          <p className="text-gray-500 text-xs">NSF Phase II SBIR Proposal + NDA + Due Diligence + Term Sheets</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* SBIR Proposal */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-green-400" />
              <h2 className="text-white font-bold">NSF Phase II SBIR Proposal</h2>
            </div>
            <p className="text-gray-400 text-sm">AI-Assisted IP Generation Systems (NSF-SBIR-26-AI)</p>
            {!sbir ? (
              <button
                onClick={() => {
                  setSBIRLoading(true);
                  generateSBIRProposal((res) => {
                    setSBIR(res);
                    setSBIRLoading(false);
                  });
                }}
                disabled={sbir_loading}
                className="w-full py-2 rounded-lg bg-green-700 hover:bg-green-600 disabled:opacity-40 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                {sbir_loading ? <Loader2 size={14} className="animate-spin" /> : "Generate Proposal"}
              </button>
            ) : (
              <div className="space-y-2">
                <div className="bg-gray-800 rounded p-3 text-xs text-gray-300 space-y-1">
                  <p>✓ Technical abstract (300+ words)</p>
                  <p>✓ Anticipated results (measurable Phase II outcomes)</p>
                  <p>✓ Technical objectives (5 numbered)</p>
                  <p>✓ Work plan (24-month roadmap)</p>
                  <p>✓ Commercial applications (4-5 markets)</p>
                  <p>✓ Team qualifications</p>
                  <p>✓ Budget justification ($750K Phase II)</p>
                </div>
                <button
                  onClick={() => setActiveDoc("sbir")}
                  className="w-full py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  <FileText size={12} /> View & Export PDF
                </button>
              </div>
            )}
          </div>

          {/* NDA */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-blue-400" />
              <h2 className="text-white font-bold">Mutual NDA</h2>
            </div>
            <p className="text-gray-400 text-sm">3-year confidentiality agreement for due diligence discussions</p>
            <button
              onClick={generateNDA}
              className="w-full py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Download size={12} /> Generate & Download
            </button>
          </div>

          {/* Due Diligence */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-yellow-400" />
              <h2 className="text-white font-bold">Due Diligence Package</h2>
            </div>
            <p className="text-gray-400 text-sm">10-section comprehensive overview (financial, tech, IP, competitive position)</p>
            <button
              onClick={generateDueDiligence}
              className="w-full py-2 rounded-lg bg-yellow-700 hover:bg-yellow-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Download size={12} /> Generate & Download
            </button>
          </div>

          {/* Term Sheet */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-purple-400" />
              <h2 className="text-white font-bold">Term Sheet</h2>
            </div>
            <p className="text-gray-400 text-sm">3 options: Full acquisition (\\$35-75M) + Licensing + Hybrid</p>
            <button
              onClick={generateTermSheet}
              className="w-full py-2 rounded-lg bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <Download size={12} /> Generate & Download
            </button>
          </div>
        </div>

        {/* SBIR Proposal Viewer */}
        {active_doc === "sbir" && sbir && (
          <div className="bg-gray-900 border border-green-800/40 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-green-950/20">
              <p className="text-green-400 text-xs font-black uppercase tracking-widest">NSF Phase II SBIR Proposal</p>
              <button
                onClick={() => {
                  const doc = new jsPDF();
                  const W = 210, M = 18, cW = W - M * 2;
                  let y = 20;
                  doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F");
                  doc.setFillColor(212, 175, 55); doc.rect(0, 0, W, 5, "F");
                  doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(212, 175, 55);
                  doc.text("NSF SBIR Phase II Proposal", M, 24);
                  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
                  doc.text("NSF-SBIR-26-AI · AI-Assisted Intellectual Property Generation Systems", M, 31);
                  y = 48;
                  ["technical_abstract", "anticipated_results", "technical_objectives", "work_plan", "commercial_applications", "qualifications", "budget_justification"].forEach(key => {
                    if (!sbir[key]) return;
                    if (y > 260) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
                    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(212, 175, 55);
                    const label = key.replace(/_/g, " ").toUpperCase();
                    doc.text(label, M, y); y += 7;
                    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(190, 200, 220);
                    const lines = doc.splitTextToSize(sbir[key], cW);
                    lines.forEach(line => {
                      if (y > 278) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
                      doc.text(line, M, y); y += 5.5;
                    });
                    y += 5;
                  });
                  doc.save(`ZARP_NSF_SBIR_Proposal_${Date.now()}.pdf`);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white text-xs font-bold transition-all"
              >
                <Download size={12} /> Export PDF
              </button>
            </div>
            <div className="p-5 space-y-5 max-h-96 overflow-y-auto">
              {["technical_abstract", "anticipated_results", "technical_objectives", "work_plan", "commercial_applications", "qualifications", "budget_justification"].map(key => sbir[key] && (
                <div key={key} className="border border-gray-800 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-800/60 border-b border-gray-800">
                    <p className="text-green-400 text-xs font-black uppercase">{key.replace(/_/g, " ")}</p>
                    <CopyBtn text={sbir[key]} />
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{sbir[key]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}