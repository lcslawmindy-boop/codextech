import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Download, Loader2, DollarSign, TrendingUp, Users, Shield,
  Zap, BarChart2, Globe, CheckCircle2, Lock, ArrowRight, Star,
  Brain, FileText, Target, Activity, Code, Package, ChevronRight
} from "lucide-react";
import { jsPDF } from "jspdf";

const ASKING_PRICE_LOW = 12_000_000;
const ASKING_PRICE_HIGH = 28_000_000;
const IP_FLOOR = 18_500_000;
const MRR_TARGET = 5_000; // Conservative — update with real Stripe data
const ARR_TARGET = MRR_TARGET * 12;

function fmt(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

const SLIDES = [
  {
    id: "cover",
    title: "ZARP — Zenith Apex Research Platform",
    subtitle: "Acquisition Opportunity",
    color: "#d4af37",
    content: null,
  },
  {
    id: "problem",
    title: "The Problem We Solve",
    color: "#3b82f6",
    content: {
      type: "bullets",
      headline: "Inventors lose millions because the tools don't exist — until now.",
      points: [
        "Patent attorneys charge $3,000–$15,000 per application — blocking 90% of independent inventors",
        "FTO analysis costs $5K–$15K per report — most inventors skip it entirely",
        "IP marketplaces are fragmented and opaque — there's no 'Airbnb for inventions'",
        "Scalar EM and advanced energy research has no dedicated research + commercialization platform",
        "Co-inventor matching, SBIR grant pipelines, and IP portfolio management are scattered across $1,000+/mo tools",
      ],
    },
  },
  {
    id: "solution",
    title: "The Solution: One Platform for Everything",
    color: "#22c55e",
    content: {
      type: "grid",
      items: [
        { icon: "🧠", label: "AI Invention Engine", value: "Full dossier in 20 min" },
        { icon: "📋", label: "AI Patent Drafting", value: "Replaces $3K–$15K attorney" },
        { icon: "⚖️", label: "FTO Analysis", value: "Replaces $5K–$15K report" },
        { icon: "🛒", label: "Inventor Marketplace", value: "5% commission on deals" },
        { icon: "💼", label: "Investor CRM + VDR", value: "Deal flow management" },
        { icon: "💰", label: "Valuation API", value: "$0.50–$2.00/call B2B revenue" },
        { icon: "🔬", label: "23 Build Plans", value: "Hardware blueprints + BOMs" },
        { icon: "📚", label: "26 Courses", value: "IP strategy to device physics" },
      ],
    },
  },
  {
    id: "market",
    title: "Market Opportunity",
    color: "#f59e0b",
    content: {
      type: "market",
      items: [
        { label: "Global IP Management Software Market", value: "$1.4B", growth: "12.3% CAGR", color: "#f59e0b" },
        { label: "Legal Tech / AI Patent Tools", value: "$7.6B", growth: "26% CAGR (2025–2030)", color: "#22c55e" },
        { label: "Online IP Marketplaces (TAM)", value: "$3.2B", growth: "Fragmented — consolidation opportunity", color: "#3b82f6" },
        { label: "Alternative Energy R&D Platforms", value: "$890M", growth: "Niche — high NPS, low churn", color: "#a855f7" },
      ],
    },
  },
  {
    id: "product",
    title: "Product: 40+ Modules Built & Live",
    color: "#a855f7",
    content: {
      type: "modules",
      categories: [
        { name: "AI Patent Suite", items: ["Patent Drafting Wizard", "AI Patent Attorney Chat", "FTO Analysis Tool", "Patent Intelligence Monitor", "Patent Claims Generator", "Provisional Patent Tool", "Patent Landscape Graph"] },
        { name: "IP Marketplace", items: ["Inventor Marketplace (5% commission)", "Co-Inventor Matching", "Collaborative Patent Drafting", "Secure Patent Sharing", "IP Portfolio Health"] },
        { name: "Research Platform", items: ["23 Invention Build Plans + BOMs", "26-Course Library", "Prior Art Archive (200+ entries)", "AI Research Assistant", "EM Lab Simulators", "Concept Knowledge Graph"] },
        { name: "Commercialization", items: ["Investor CRM + Kanban", "Virtual Data Room (VDR)", "Acquisition CRM", "Valuation Dashboard", "SBIR Grant Pipeline", "Valuation API (B2B revenue)", "White-Label SaaS Option"] },
      ],
    },
  },
  {
    id: "revenue",
    title: "Revenue Model — Multiple Streams",
    color: "#22c55e",
    content: {
      type: "revenue",
      streams: [
        { name: "SaaS Subscriptions", detail: "Researcher $97/mo · Pro $247/mo · Marketplace $197/mo", color: "#22c55e", potential: "$150K–$500K ARR @ 50–200 subscribers" },
        { name: "Inventor Marketplace Commission", detail: "5% on all IP transactions (avg deal $50K–$500K)", color: "#ec4899", potential: "$50K–$500K/yr @ 10–50 deals/yr" },
        { name: "One-Time Purchases", detail: "Build plans $49–$2,397 · Courses $297–$497 · Dossiers $99", color: "#f59e0b", potential: "$30K–$200K/yr gross" },
        { name: "Valuation API (B2B)", detail: "$0.50–$2.00/call · Law firms, VCs, R&D teams", color: "#3b82f6", potential: "$100K–$2M ARR at scale" },
        { name: "White-Label SaaS", detail: "$10K–$50K/yr per seat for IP firms and universities", color: "#a855f7", potential: "$100K–$500K ARR @ 5–20 clients" },
        { name: "Build Supplies Shop", detail: "Component kits for device build plans", color: "#06b6d4", potential: "$20K–$100K/yr" },
      ],
    },
  },
  {
    id: "valuation",
    title: "Valuation — IP-Adjusted DCF",
    color: "#d4af37",
    content: {
      type: "valuation",
      metrics: [
        { label: "IP Asset Floor (40+ modules built)", value: fmt(IP_FLOOR), note: "AI FTO + Patent Chat + Marketplace + SBIR + Valuation API + White-Label SaaS + VDR + more" },
        { label: "Conservative ARR (50 subscribers)", value: "$58.2K", note: "Based on current tier pricing" },
        { label: "Realistic ARR (200 subscribers + API)", value: "$350K+", note: "6–12 months post-acquisition" },
        { label: "Revenue Multiple (Conservative 10×)", value: "$580K+", note: "On current ARR trajectory" },
        { label: "Strategic Premium (IP Floor + Platform)", value: fmt(IP_FLOOR) + "+", note: "To IP law firm, defense contractor, or EdTech rollup" },
      ],
      askRange: `${fmt(ASKING_PRICE_LOW)} – ${fmt(ASKING_PRICE_HIGH)}`,
    },
  },
  {
    id: "buyers",
    title: "Ideal Acquirers",
    color: "#06b6d4",
    content: {
      type: "buyers",
      profiles: [
        { type: "IP Law Firm", why: "AI patent drafting + FTO tools for their client base. $400/hr attorney workflows replaced by AI at scale.", value: "$500K–$1.5M", icon: "⚖️" },
        { type: "Defense / R&D Contractor", why: "Scalar EM research library + SBIR pipeline + classified device build plans + Gov-tier access.", value: "$750K–$2M", icon: "🛡️" },
        { type: "EdTech / LegalTech Rollup", why: "26 courses + AI tools + community. Bolt-on to IP education portfolio.", value: "$400K–$1M", icon: "📚" },
        { type: "VC-Backed IP Marketplace", why: "Inventor Marketplace + Co-Inventor Matching = network effects at scale. 5% GMV commission.", value: "$1M–$5M", icon: "🌐" },
        { type: "Individual Operator / Acquirer", why: "Turn-key SaaS with recurring revenue. Operate, grow, and exit at 10–20× ARR.", value: "$150K–$500K", icon: "🎯" },
      ],
    },
  },
  {
    id: "tech",
    title: "Technology Stack & Infrastructure",
    color: "#6366f1",
    content: {
      type: "tech",
      items: [
        { label: "Frontend", value: "React 18 + Tailwind CSS + Framer Motion — responsive, mobile-ready" },
        { label: "Backend", value: "Base44 BaaS — entities, auth, functions (Deno Deploy) — zero DevOps" },
        { label: "Payments", value: "Stripe Live Mode — subscriptions + one-time + metered billing" },
        { label: "AI Integration", value: "Claude Sonnet 4.6, GPT-4o, Gemini — patent drafting, invention generation, valuations" },
        { label: "Auth & Security", value: "NDA gate, role-based access, gov/defense tier, copy protection" },
        { label: "Database", value: "20+ entities — BetaApplication, InvestorRelationship, OpportunityCard, VDRSession, etc." },
        { label: "Automations", value: "Scheduled email alerts, patent monitoring, opportunity scanning" },
        { label: "Transfer Complexity", value: "LOW — clean codebase, documented, Base44 export-ready" },
      ],
    },
  },
  {
    id: "ask",
    title: "The Ask",
    color: "#d4af37",
    content: {
      type: "ask",
      price: `${fmt(ASKING_PRICE_LOW)} – ${fmt(ASKING_PRICE_HIGH)}`,
      includes: [
        "Full source code transfer (React frontend + all backend functions)",
        "All 40+ modules, pages, and components",
        "Stripe account, customer data, and subscription base",
        "Complete entity database (applications, investors, VDR sessions, etc.)",
        "All invention build plan content, course materials, and prior art database",
        "Platform domain and branding assets",
        "30-day transition support and handover documentation",
        "White-label rights and B2B licensing framework",
      ],
      contact: "zenithapexresearch@gmail.com",
    },
  },
];

function generatePDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, margin = 18, cW = W - margin * 2;
  let y = 0, pageNum = 0;

  const bg = (col = [8, 8, 20]) => { doc.setFillColor(...col); doc.rect(0, 0, W, 297, "F"); };
  const addPage = (bgColor) => { if (pageNum > 0) doc.addPage(); pageNum++; bg(bgColor); y = 24; };
  const check = (n = 20) => { if (y + n > 278) { doc.addPage(); bg(); y = 24; } };

  const title = (txt, col = [212, 175, 55]) => {
    check(18);
    doc.setFillColor(20, 20, 45);
    doc.rect(margin - 3, y - 5, cW + 6, 14, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(13);
    doc.setTextColor(...col); doc.text(txt, margin, y + 5);
    y += 18;
  };

  const body = (txt, col = [180, 190, 210], fs = 9) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(fs);
    doc.setTextColor(...col);
    const lines = doc.splitTextToSize(txt, cW);
    lines.forEach(l => { check(8); doc.text(l, margin, y); y += 6.5; });
    y += 2;
  };

  const bullet = (txt, col = [180, 190, 210]) => {
    check(10); doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...col);
    const lines = doc.splitTextToSize(`• ${txt}`, cW - 4);
    lines.forEach((l, i) => { doc.text(l, margin + (i > 0 ? 3 : 0), y); y += 6; });
  };

  const divider = () => { doc.setDrawColor(40, 40, 80); doc.setLineWidth(0.2); doc.line(margin, y, W - margin, y); y += 5; };

  // COVER
  addPage([5, 5, 15]);
  doc.setFillColor(212, 175, 55); doc.rect(0, 0, W, 3, "F");
  doc.setFillColor(212, 175, 55); doc.rect(0, 294, W, 3, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
  doc.text("CONFIDENTIAL — NDA REQUIRED", W / 2, 30, { align: "center" });
  doc.text("STRATEGIC ACQUISITION OPPORTUNITY", W / 2, 38, { align: "center" });
  doc.setFontSize(28); doc.setTextColor(212, 175, 55);
  doc.text("ZARP", W / 2, 70, { align: "center" });
  doc.setFontSize(16); doc.setTextColor(200, 210, 230);
  doc.text("Zenith Apex Research Portfolio", W / 2, 82, { align: "center" });
  doc.setFontSize(11); doc.setTextColor(100, 116, 139);
  doc.text("AI Operating System for Invention, IP Creation & Commercialization", W / 2, 92, { align: "center" });
  doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(80, 100, 140);
  doc.text("40+ Platform Modules  ·  Stripe Live Payments  ·  Multi-Stream Revenue Model", W / 2, 110, { align: "center" });
  doc.setFontSize(18); doc.setFont("helvetica", "bold"); doc.setTextColor(34, 197, 94);
  doc.text(`Asking: ${fmt(ASKING_PRICE_LOW)} – ${fmt(ASKING_PRICE_HIGH)}`, W / 2, 130, { align: "center" });
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 116, 139);
  doc.text(`IP Asset Floor: ${fmt(IP_FLOOR)} (40+ built modules)`, W / 2, 140, { align: "center" });
  doc.text(`Contact: zenithapexresearch@gmail.com`, W / 2, 155, { align: "center" });
  doc.text(`Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, W / 2, 163, { align: "center" });

  // PAGE 2: Problem + Solution
  addPage();
  title("THE PROBLEM", [239, 68, 68]);
  body("Inventors lose millions because critical tools are fragmented, expensive, or don't exist:");
  ["Patent attorneys charge $3,000–$15,000 per application — blocking 90% of independent inventors",
   "FTO analysis costs $5,000–$15,000 per report — most inventors skip it",
   "There is no 'Airbnb for inventions' — IP marketplaces are fragmented and opaque",
   "Scalar EM and advanced energy research has zero dedicated commercialization platforms",
   "SBIR pipelines, co-inventor matching, and IP portfolio management require $1,000+/mo in tools"].forEach(bullet);
  y += 5;
  title("THE SOLUTION", [34, 197, 94]);
  body("ZARP is the first end-to-end AI operating system for inventors — from idea to IP to income:");
  ["AI generates complete invention dossiers in under 20 minutes",
   "Patent Drafting Wizard replaces $3K–$15K attorney applications",
   "FTO Analysis Tool replaces $5K–$15K legal reports",
   "Inventor Marketplace with 5% commission on IP deals",
   "Valuation API for VCs, law firms, and corporate R&D at $0.50–$2.00/call",
   "23 hardware build plans + 26 courses for the research community",
   "Virtual Data Room, Investor CRM, SBIR pipeline — full commercialization suite"].forEach(bullet);

  // PAGE 3: Market
  addPage();
  title("MARKET OPPORTUNITY", [245, 158, 11]);
  [
    ["Global IP Management Software Market", "$1.4B", "12.3% CAGR"],
    ["AI Legal Tech / Patent Tools Market", "$7.6B", "26% CAGR (2025–2030)"],
    ["Online IP Marketplace TAM", "$3.2B", "Fragmented — consolidation opportunity"],
    ["Alternative Energy R&D Platforms", "$890M", "High NPS, low churn niche"],
  ].forEach(([label, size, growth]) => {
    check(16);
    doc.setFillColor(20, 30, 50); doc.rect(margin, y, cW, 13, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(200, 210, 230);
    doc.text(label, margin + 3, y + 5.5);
    doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(245, 158, 11);
    doc.text(size, W - margin - 3, y + 5.5, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(100, 116, 139);
    doc.text(growth, margin + 3, y + 10.5);
    y += 17;
  });

  // PAGE 4: Revenue
  addPage();
  title("REVENUE MODEL — MULTIPLE STREAMS", [34, 197, 94]);
  [
    ["SaaS Subscriptions", "$97–$247/mo per subscriber", "$150K–$500K ARR @ 50–200 subs"],
    ["Inventor Marketplace Commission", "5% on IP transactions (avg $50K–$500K/deal)", "$50K–$500K/yr @ 10–50 deals"],
    ["One-Time Purchases", "Build plans $49–$2,397 · Courses $297–$497", "$30K–$200K/yr gross"],
    ["Valuation API (B2B)", "$0.50–$2.00/call · Law firms, VCs, R&D", "$100K–$2M ARR at scale"],
    ["White-Label SaaS", "$10K–$50K/yr per IP firm or university seat", "$100K–$500K ARR @ 5–20 clients"],
    ["Build Supplies Shop", "Component kits for device build plans", "$20K–$100K/yr"],
  ].forEach(([stream, detail, potential]) => {
    check(22);
    doc.setFillColor(15, 30, 15); doc.rect(margin, y, cW, 18, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(34, 197, 94);
    doc.text(stream, margin + 3, y + 6);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(150, 160, 180);
    doc.text(detail, margin + 3, y + 11);
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(212, 175, 55);
    doc.text(potential, W - margin - 3, y + 8.5, { align: "right" });
    y += 22;
  });

  // PAGE 5: Valuation
  addPage();
  title("VALUATION — IP-ADJUSTED ANALYSIS", [212, 175, 55]);
  doc.setFillColor(20, 18, 8); doc.rect(margin, y, cW, 44, "F");
  doc.setDrawColor(212, 175, 55); doc.setLineWidth(0.8); doc.rect(margin, y, cW, 44, "D");
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(148, 163, 184);
  doc.text("ASKING PRICE RANGE", margin + 4, y + 10);
  doc.setFontSize(22); doc.setTextColor(212, 175, 55);
  doc.text(`${fmt(ASKING_PRICE_LOW)} – ${fmt(ASKING_PRICE_HIGH)}`, margin + 4, y + 24);
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 116, 139);
  doc.text(`IP Asset Floor: ${fmt(IP_FLOOR)} (40+ built modules, AI tools, marketplace, API)`, margin + 4, y + 34);
  y += 50;
  [
    ["IP Asset Floor (40+ modules built & live)", fmt(IP_FLOOR), "AI FTO + Patent Chat + Marketplace + SBIR + Valuation API + VDR + more"],
    ["Conservative ARR (50 subscribers)", "$58.2K/yr", "Based on Researcher $97/mo tier"],
    ["Realistic ARR (200 subs + API + Marketplace)", "$350K+/yr", "6–12 months post-acquisition"],
    ["Revenue Multiple (Conservative 10×)", `$580K+`, "Applied to realistic ARR trajectory"],
    ["Strategic Premium Ceiling", "$2M–$5M", "To IP law firm, defense contractor, or VC-backed marketplace rollup"],
  ].forEach(([label, value, note]) => {
    check(14); doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(200, 210, 230);
    doc.text(label, margin, y); doc.setTextColor(212, 175, 55); doc.text(value, W - margin, y, { align: "right" });
    y += 6; doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(80, 100, 130);
    doc.text(note, margin, y); y += 9;
  });

  // PAGE 6: Buyers
  addPage();
  title("IDEAL ACQUIRER PROFILES", [6, 182, 212]);
  [
    ["⚖️ IP Law Firm", "$500K–$1.5M", "AI patent drafting + FTO tools for client base. Replace $400/hr attorney workflows with AI at scale. White-label the platform under their brand."],
    ["🛡️ Defense / R&D Contractor", "$750K–$2M", "Scalar EM research library + SBIR pipeline + classified device build plans + Gov-tier access. Proprietary research moat."],
    ["📚 EdTech / LegalTech Rollup", "$400K–$1M", "26 courses + AI tools + growing community. Perfect bolt-on to existing IP education portfolio."],
    ["🌐 VC-Backed IP Marketplace", "$1M–$5M", "Inventor Marketplace + Co-Inventor Matching = network effects at scale. 5% GMV commission model compounds."],
    ["🎯 Individual Operator / Acquirer", "$150K–$500K", "Turn-key SaaS with recurring revenue infrastructure. Operate, grow, and exit at 10–20× ARR."],
  ].forEach(([type, price, rationale]) => {
    check(22);
    doc.setFillColor(12, 25, 40); doc.rect(margin, y, cW, 20, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(200, 210, 230);
    doc.text(type, margin + 3, y + 7);
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(34, 197, 94);
    doc.text(price, W - margin - 3, y + 7, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(120, 140, 170);
    const lines = doc.splitTextToSize(rationale, cW - 6);
    doc.text(lines[0], margin + 3, y + 13);
    y += 24;
  });

  // PAGE 7: What's Included
  addPage();
  title("WHAT'S INCLUDED IN THE ACQUISITION", [34, 197, 94]);
  ["Full source code transfer (React frontend + all backend Deno functions)",
   "All 40+ modules, pages, and components — fully functional, no placeholders",
   "Stripe account, customer data, subscription base, and payment history",
   "Complete entity database — applications, investors, VDR sessions, orders, etc.",
   "All invention build plan content, course materials, and prior art database (200+ entries)",
   "Platform domain, branding assets, and social media accounts",
   "IP Marketplace infrastructure, deal pipeline, and commission logic",
   "Valuation API endpoint architecture and LLM integration",
   "White-label rights and B2B licensing framework",
   "30-day transition support, documentation, and handover calls",
   "All 23 device build plans with full BOMs and sourcing guides",
   "All 26 structured courses with lesson content"].forEach(bullet);

  y += 8;
  title("CONTACT & NEXT STEPS", [212, 175, 55]);
  body("To receive a full due diligence package, technical walkthrough, and Stripe revenue screenshots:");
  check(25);
  doc.setFillColor(20, 18, 8); doc.rect(margin, y, cW, 22, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(212, 175, 55);
  doc.text("zenithapexresearch@gmail.com", W / 2, y + 10, { align: "center" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
  doc.text("Please reference 'ZARP Acquisition' in your subject line", W / 2, y + 17, { align: "center" });
  y += 28;
  body("This deck is confidential and subject to NDA. All revenue figures are projections based on current subscriber pricing. IP asset floor reflects internal platform valuation of built modules, tools, and proprietary content as of April 2026.");

  // Footer
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(40, 40, 80);
    doc.text("ZARP — STRATEGIC ACQUISITION DECK — CONFIDENTIAL — NDA APPLIES", W / 2, 291, { align: "center" });
    doc.text(`${p} / ${total}`, W - margin, 291, { align: "right" });
  }

  doc.save(`ZARP-Acquisition-Deck-${new Date().toISOString().slice(0, 10)}.pdf`);
}

function SlideCard({ slide }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden" style={{ borderTopColor: slide.color, borderTopWidth: 3 }}>
      <div className="px-5 py-4 border-b border-gray-800">
        <h3 className="text-white font-black text-base">{slide.title}</h3>
      </div>
      <div className="p-5">
        {slide.content?.type === "bullets" && (
          <>
            <p className="text-gray-400 text-sm font-semibold mb-3">{slide.content.headline}</p>
            <ul className="space-y-2">
              {slide.content.points.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                  <CheckCircle2 size={12} className="flex-shrink-0 mt-0.5" style={{ color: slide.color }} /> {p}
                </li>
              ))}
            </ul>
          </>
        )}
        {slide.content?.type === "grid" && (
          <div className="grid grid-cols-2 gap-2">
            {slide.content.items.map((item, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-3 flex items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-white font-bold text-xs">{item.label}</p>
                  <p className="text-xs" style={{ color: slide.color }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {slide.content?.type === "market" && (
          <div className="space-y-3">
            {slide.content.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-800 rounded-xl p-3">
                <div>
                  <p className="text-white text-xs font-bold">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.growth}</p>
                </div>
                <p className="font-black text-lg" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
        )}
        {slide.content?.type === "revenue" && (
          <div className="space-y-2">
            {slide.content.streams.map((s, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-3">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-white text-xs font-bold">{s.name}</p>
                  <span className="text-xs font-black" style={{ color: s.color }}></span>
                </div>
                <p className="text-gray-500 text-xs">{s.detail}</p>
                <p className="text-xs mt-1" style={{ color: s.color }}>{s.potential}</p>
              </div>
            ))}
          </div>
        )}
        {slide.content?.type === "valuation" && (
          <>
            <div className="bg-yellow-950/30 border border-yellow-800/40 rounded-xl p-4 mb-4 text-center">
              <p className="text-gray-500 text-xs mb-1">Asking Price Range</p>
              <p className="text-yellow-400 font-black text-3xl">{slide.content.askRange}</p>
              <p className="text-gray-600 text-xs mt-1">IP Asset Floor: {fmt(IP_FLOOR)}</p>
            </div>
            <div className="space-y-2">
              {slide.content.metrics.map((m, i) => (
                <div key={i} className="flex items-start justify-between gap-3 py-2 border-b border-gray-800">
                  <p className="text-gray-400 text-xs">{m.label}</p>
                  <p className="text-yellow-400 font-black text-xs flex-shrink-0">{m.value}</p>
                </div>
              ))}
            </div>
          </>
        )}
        {slide.content?.type === "buyers" && (
          <div className="space-y-2">
            {slide.content.profiles.map((b, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-white font-bold text-xs">{b.icon} {b.type}</p>
                  <span className="text-green-400 font-black text-xs">{b.value}</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{b.why}</p>
              </div>
            ))}
          </div>
        )}
        {slide.content?.type === "tech" && (
          <div className="space-y-2">
            {slide.content.items.map((item, i) => (
              <div key={i} className="flex gap-3 py-1.5 border-b border-gray-800">
                <p className="text-gray-500 text-xs w-28 flex-shrink-0 font-semibold">{item.label}</p>
                <p className="text-gray-300 text-xs leading-relaxed">{item.value}</p>
              </div>
            ))}
          </div>
        )}
        {slide.content?.type === "modules" && (
          <div className="grid grid-cols-2 gap-3">
            {slide.content.categories.map((cat, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-3">
                <p className="text-xs font-black mb-2" style={{ color: slide.color }}>{cat.name}</p>
                <ul className="space-y-1">
                  {cat.items.map((item, j) => (
                    <li key={j} className="text-gray-400 text-xs flex items-start gap-1.5">
                      <span className="text-gray-700 mt-0.5">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {slide.content?.type === "ask" && (
          <>
            <div className="bg-green-950/30 border border-green-800/40 rounded-xl p-4 mb-4 text-center">
              <p className="text-gray-500 text-xs mb-1">Asking Price</p>
              <p className="text-green-400 font-black text-2xl">{slide.content.price}</p>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Included in Acquisition:</p>
            <ul className="space-y-1.5 mb-4">
              {slide.content.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                  <CheckCircle2 size={11} className="text-green-400 flex-shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
            <div className="bg-yellow-950/30 border border-yellow-800 rounded-xl p-3 text-center">
              <p className="text-gray-500 text-xs mb-1">Contact</p>
              <p className="text-yellow-400 font-bold text-sm">{slide.content.contact}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AcquisitionPitchDeck() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 100));
    generatePDF();
    setExporting(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm px-5 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
              <ArrowLeft size={14} /> Back
            </Link>
            <div className="w-px h-5 bg-gray-700" />
            <div>
              <h1 className="text-white font-black text-base">Acquisition Pitch Deck</h1>
              <p className="text-gray-500 text-xs">ZARP Strategic Acquisition Overview · Confidential</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-950/40 border border-green-800">
              <span className="text-green-400 font-black text-sm">{fmt(ASKING_PRICE_LOW)} – {fmt(ASKING_PRICE_HIGH)}</span>
              <span className="text-gray-600 text-xs">asking</span>
            </div>
            <button onClick={handleExport} disabled={exporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-800 hover:bg-yellow-700 text-black font-black text-xs transition-all disabled:opacity-60">
              {exporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
              {exporting ? "Generating…" : "Export PDF Deck"}
            </button>
          </div>
        </div>
      </div>

      {/* Hero banner */}
      <div className="border-b border-yellow-900/40 bg-yellow-950/10 px-5 py-8 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-yellow-600 font-black text-xs uppercase tracking-widest mb-2">Confidential — Strategic Acquisition</p>
          <h2 className="text-white font-black text-3xl mb-2">
            ZARP — Zenith Apex Research Portfolio
          </h2>
          <p className="text-gray-400 text-sm mb-4">AI Operating System for Invention, IP Creation & Commercialization · 40+ Built Modules · Stripe Live</p>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-yellow-400 font-black text-2xl">{fmt(ASKING_PRICE_LOW)} – {fmt(ASKING_PRICE_HIGH)}</p>
              <p className="text-gray-600 text-xs">Asking Price</p>
            </div>
            <div className="w-px h-8 bg-gray-800" />
            <div className="text-center">
              <p className="text-cyan-400 font-black text-2xl">{fmt(IP_FLOOR)}</p>
              <p className="text-gray-600 text-xs">IP Asset Floor</p>
            </div>
            <div className="w-px h-8 bg-gray-800" />
            <div className="text-center">
              <p className="text-green-400 font-black text-2xl">40+</p>
              <p className="text-gray-600 text-xs">Built Modules</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slides */}
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {SLIDES.filter(s => s.content).map((slide, i) => (
            <SlideCard key={slide.id} slide={slide} />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-10 bg-gradient-to-br from-gray-900 to-yellow-950/20 border border-yellow-800/40 rounded-2xl p-8 text-center">
          <h3 className="text-yellow-400 font-black text-2xl mb-2">Interested in Acquiring ZARP?</h3>
          <p className="text-gray-400 text-sm mb-4 max-w-xl mx-auto">
            We'll send a full due diligence package including Stripe revenue screenshots, source code walkthrough, entity database export, and 30-day transition plan.
          </p>
          <a href="mailto:zenithapexresearch@gmail.com?subject=ZARP Acquisition Inquiry"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base bg-yellow-800 hover:bg-yellow-700 text-black transition-all">
            <DollarSign size={16} /> Contact Us — zenithapexresearch@gmail.com
          </a>
          <p className="text-gray-700 text-xs mt-3">This deck is confidential and subject to NDA. Revenue figures are projections based on current pricing model.</p>
        </div>
      </div>
    </div>
  );
}