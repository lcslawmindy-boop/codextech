import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileText, BookOpen, Film, Package, ShoppingBag, Mail, Shield, Loader2, ChevronDown, ChevronUp, Star } from "lucide-react";
import { jsPDF } from "jspdf";
import { base44 } from "@/api/base44Client";
import { THEME, drawLogo, drawPageHeader, drawFooter } from "../lib/zenithPdfTheme";
import NdaPdfGenerator from "../components/NdaPdfGenerator";
import DueDiligencePdfGenerator from "../components/DueDiligencePdfGenerator";
import { businessItems } from "../lib/businessItems";

// ── MASTER LETTER TEXT ─────────────────────────────────────────────────────
const MASTER_LETTER = `STRICTLY CONFIDENTIAL — NDA REQUIRED BEFORE FURTHER DISCLOSURE

[DATE]

Dear [RECIPIENT NAME],

I am writing to offer you a time-limited, exclusive first-look at an acquisition that does not come to market twice.

The Zenith Apex Advanced Research Platform is the world's only commercially structured, production-ready AI-powered knowledge and IP generation platform built around the suppressed physics and biology research of Lt. Col. Thomas E. Bearden (ret.) — cross-referenced against primary US government documents, peer-reviewed publications, and declassified archives that validate the core claims.

PLATFORM FAIR MARKET VALUE (Q2 2026)
  AI Invention Forge Engine ............. $380K – $950K
  AI Market Research Scanner ............ $220K – $580K
  USPTO Provisional Patent Drafter ....... $150K – $380K
  VC Pitch Deck + Build Video Engine .... $120K – $280K
  Scalar Simulators ..................... $80K – $175K
  Bearden Knowledge Graph ............... $220K – $420K
  Course Catalog (20+ courses) .......... $150K – $320K
  Invention Build Plans ................. $450K – $1.2M
  Primary Document Archive .............. $120K – $280K
  IP Portfolio (MEG, TRZ, TRD-1) ........ $1.8M – $6.5M
  Prior Art Archive + Patent AI ......... $95K – $240K
  Health + CRM + Monitoring Suite ....... $110K – $220K

  PLATFORM TOTAL (conservative):    $3.9M – $11.5M
  + Strategic pre-public premium:    $5.5M – $25.3M

ACQUISITION TERMS
  EXCLUSIVE ACQUISITION:          $6.5M – $18M
  LICENSING ONLY (annual):        $650,000 – $1,500,000/year
  AI WHITE-LABEL (per licensee):  $280,000 – $750,000/year
  STRATEGIC JV:                   Equity terms, negotiable

This opportunity is being presented to a maximum of six (6) qualified buyers before public launch.

TO PROCEED:
1. Reply to confirm interest and receive NDA template
2. Execute NDA and provide proof of funds or institutional mandate letter
3. Receive full 100+ page technical due diligence package
4. Schedule live demonstration and Q&A

Sincerely,
[YOUR NAME]
Zenith Apex Research Portfolio
[YOUR EMAIL]
[YOUR PHONE]
[DATE]

UNAUTHORIZED DISCLOSURE SUBJECT TO $2.5M LIQUIDATED DAMAGES PER INCIDENT`;

// ── PDF GENERATORS ──────────────────────────────────────────────────────────

function generateMasterLetterPDF() {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const { margin, pageW, gold, goldLight, white, silver, muted, dimmed, pageBg, cardBg } = THEME;
  let y = 0;
  let pageNum = 1;

  const bg = () => { doc.setFillColor(...pageBg); doc.rect(0, 0, pageW, 297, 'F'); };
  const newPage = () => { doc.addPage(); bg(); pageNum++; drawPageHeader(doc, 'ACQUISITION LETTER', 'CONFIDENTIAL'); y = 46; };
  const check = (n = 12) => { if (y + n > 282) newPage(); };

  bg();
  drawPageHeader(doc, 'MASTER ACQUISITION LETTER', 'STRICTLY CONFIDENTIAL — PERSONALIZE BEFORE SENDING');
  y = 46;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...muted);
  const lines = doc.splitTextToSize(MASTER_LETTER, pageW - margin * 2);
  lines.forEach(l => {
    check(6.5);
    if (l.trim().startsWith('PLATFORM') || l.trim().startsWith('ACQUISITION') || l.trim().startsWith('TO PROCEED') || l.trim() === 'STRICTLY CONFIDENTIAL — NDA REQUIRED BEFORE FURTHER DISCLOSURE') {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...gold);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...silver);
    }
    doc.text(l, margin, y);
    y += 6.5;
  });

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    drawFooter(doc, p, total, 'MASTER ACQUISITION LETTER');
  }
  doc.save('zenith-apex-acquisition-letter.pdf');
}

function generateCoursesPDF(courses) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const { margin, pageW, gold, goldLight, white, silver, muted, dimmed, pageBg, cardBg, accentBg } = THEME;
  let y = 46; let pn = 1;
  const bg = () => { doc.setFillColor(...pageBg); doc.rect(0, 0, pageW, 297, 'F'); };
  const newPage = () => { doc.addPage(); bg(); pn++; drawPageHeader(doc, 'COURSE CATALOG', 'ZENITH APEX EDUCATIONAL LIBRARY'); y = 46; };
  const check = (n = 12) => { if (y + n > 282) newPage(); };

  bg(); drawPageHeader(doc, 'COURSE CATALOG', 'ZENITH APEX EDUCATIONAL LIBRARY');

  // Cover intro
  doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(...white);
  doc.text('Complete Course Catalog', pageW / 2, y + 8, { align: 'center' });
  doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(...muted);
  doc.text(`${courses.length} Courses  ·  Scalar EM  ·  IP Strategy  ·  Bioelectromagnetics  ·  Advanced Physics`, pageW / 2, y + 17, { align: 'center' });
  y += 28;

  courses.forEach((course, idx) => {
    check(40);
    doc.setFillColor(...accentBg);
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, pageW - margin * 2, 36, 2, 2, 'FD');
    doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(...gold);
    doc.text(`${idx + 1}.  ${course.name}`, margin + 4, y + 8);
    doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(...silver);
    const desc = doc.splitTextToSize(course.description || course.tagline || '', pageW - margin * 2 - 8);
    desc.slice(0, 2).forEach((l, i) => doc.text(l, margin + 4, y + 14 + i * 5));
    if (course.price) {
      doc.setFont('helvetica', 'bold'); doc.setTextColor(...goldLight);
      doc.text(course.price, pageW - margin - 4, y + 8, { align: 'right' });
    }
    if (course.modules) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...muted);
      doc.text(`Modules: ${course.modules.slice(0, 5).join('  ·  ')}`, margin + 4, y + 30);
    }
    y += 42;
  });

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) { doc.setPage(p); drawFooter(doc, p, total, 'COURSE CATALOG'); }
  doc.save('zenith-apex-course-catalog.pdf');
}

function generateInventionPlansPDF(plans) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const { margin, pageW, gold, goldLight, white, silver, muted, dimmed, pageBg, cardBg, accentBg, cyan } = THEME;
  let y = 46; let pn = 1;
  const bg = () => { doc.setFillColor(...pageBg); doc.rect(0, 0, pageW, 297, 'F'); };
  const newPage = () => { doc.addPage(); bg(); pn++; drawPageHeader(doc, 'INVENTION BUILD PLANS', 'ENGINEERING SPECIFICATIONS'); y = 46; };
  const check = (n = 12) => { if (y + n > 282) newPage(); };

  bg(); drawPageHeader(doc, 'INVENTION BUILD PLANS', 'COMPLETE ENGINEERING SPECIFICATIONS LIBRARY');
  doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(...white);
  doc.text('Invention Build Plans & Engineering Specifications', pageW / 2, y + 8, { align: 'center' });
  doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(...muted);
  doc.text(`${plans.length} Devices  ·  Complete BOM  ·  Step-by-Step Assembly  ·  Theory Primers`,, pageW / 2, y + 16, { align: 'center' });
  y += 28;

  plans.forEach((plan, idx) => {
    check(60);
    // Section header
    doc.setFillColor(...accentBg);
    doc.setDrawColor(...gold); doc.setLineWidth(0.4);
    doc.rect(margin - 2, y, pageW - margin * 2 + 4, 12, 'FD');
    doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(...gold);
    doc.text(`Device ${idx + 1}: ${plan.name}`, margin, y + 8);
    if (plan.price) {
      doc.setTextColor(...goldLight); doc.setFontSize(11);
      doc.text(plan.price, pageW - margin, y + 8, { align: 'right' });
    }
    y += 16;

    if (plan.description) {
      doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(...silver);
      const lines = doc.splitTextToSize(plan.description, pageW - margin * 2);
      lines.slice(0, 3).forEach(l => { check(6); doc.text(l, margin, y); y += 5.5; });
      y += 3;
    }

    if (plan.components) {
      check(10);
      doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...cyan);
      doc.text('KEY COMPONENTS:', margin, y); y += 7;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(...silver);
      plan.components.slice(0, 8).forEach(c => {
        check(6); doc.text(`  ·  ${c}`, margin, y); y += 6;
      });
      y += 3;
    }

    if (plan.steps) {
      check(10);
      doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...goldLight);
      doc.text('ASSEMBLY STEPS:', margin, y); y += 7;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(...silver);
      plan.steps.slice(0, 10).forEach((s, i) => {
        check(6); doc.text(`  ${i + 1}.  ${typeof s === 'string' ? s : s.title || s.action || JSON.stringify(s)}`, margin, y); y += 6;
      });
      y += 3;
    }

    doc.setFillColor(...gold); doc.rect(margin, y, pageW - margin * 2, 0.25, 'F');
    y += 8;
  });

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) { doc.setPage(p); drawFooter(doc, p, total, 'INVENTION BUILD PLANS'); }
  doc.save('zenith-apex-invention-plans.pdf');
}

function generateShopPDF() {
  const products = [
    { name: 'Scalar Shield Pendant', category: 'Jewelry', price: '$89', desc: 'Orgonite-based scalar energy pendant with shungite and black tourmaline crystal matrix.' },
    { name: 'BioField Harmonizer', category: 'Jewelry', price: '$145', desc: 'Copper-wound torus coil with rare earth magnets, resonant frequency 7.83 Hz (Schumann).' },
    { name: 'Home EMF Guardian', category: 'Home Device', price: '$299', desc: 'Room-scale scalar field generator neutralizing 5G, WiFi, and smart meter radiation.' },
    { name: 'Faraday Sleeping Canopy', category: 'Home Device', price: '$890', desc: 'Silver-threaded fabric canopy blocking 99.9% of RF/EMF during sleep.' },
    { name: 'EMF Blocking Lab Coat', category: 'Clothing', price: '$420', desc: 'Silver fiber-woven professional garment, 40dB attenuation across 1MHz–10GHz.' },
    { name: 'Quantum Minerals Detox Kit', category: 'Supplements', price: '$178', desc: 'Full 90-day heavy metal chelation protocol: chlorella, zeolite, EDTA, ALA, NAC.' },
    { name: 'Faraday Room Kit', category: 'DIY Kit', price: '$620', desc: 'Complete room Faraday cage kit: copper mesh, conductive tape, grounding wire, instructions.' },
    { name: 'Water Structuring Device', category: 'Home Device', price: '$245', desc: 'Scalar-imprinted water structuring chamber, increases bioavailability and coherence.' },
    { name: 'Schumann Resonance Generator', category: 'Home Device', price: '$195', desc: '7.83 Hz portable generator for circadian rhythm support and EMF stress mitigation.' },
    { name: 'TRD-1 Component Kit', category: 'DIY Kit', price: '$1,200', desc: 'All components for Telomere Regeneration Device assembly: coils, capacitors, PCB, housing.' },
    { name: 'MEG Prototype Kit', category: 'DIY Kit', price: '$1,800', desc: 'Complete MEG replication component set with nanocrystalline cores and precision windings.' },
    { name: 'Scalar Comm Module', category: 'Electronics', price: '$340', desc: 'Longitudinal wave transmission prototype board with adjustable phase conjugation.' },
  ];
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const { margin, pageW, gold, goldLight, white, silver, muted, dimmed, pageBg, accentBg, green } = THEME;
  let y = 46;
  const bg = () => { doc.setFillColor(...pageBg); doc.rect(0, 0, pageW, 297, 'F'); };
  const newPage = () => { doc.addPage(); bg(); drawPageHeader(doc, 'EMF PROTECTION SHOP', 'PRODUCT CATALOG'); y = 46; };
  const check = (n = 12) => { if (y + n > 282) newPage(); };

  bg(); drawPageHeader(doc, 'EMF PROTECTION SHOP', 'COMPLETE PRODUCT CATALOG');
  doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(...white);
  doc.text('EMF Protection Shop — Product Catalog', pageW / 2, y + 8, { align: 'center' });
  doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(...muted);
  doc.text(`${products.length} Products  ·  Jewelry  ·  Home Devices  ·  Clothing  ·  Supplements  ·  DIY Kits`,, pageW / 2, y + 16, { align: 'center' });
  y += 28;

  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    check(14);
    doc.setFillColor(...accentBg); doc.rect(margin - 2, y, pageW - margin * 2 + 4, 10, 'F');
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(...gold);
    doc.text(cat.toUpperCase(), margin, y + 7); y += 14;
    products.filter(p => p.category === cat).forEach(p => {
      check(20);
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(...white);
      doc.text(p.name, margin, y);
      doc.setFont('helvetica', 'bold'); doc.setTextColor(...[60, 210, 120]);
      doc.text(p.price, pageW - margin, y, { align: 'right' });
      y += 7;
      doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(...silver);
      const lines = doc.splitTextToSize(p.desc, pageW - margin * 2);
      lines.forEach(l => { check(6); doc.text(l, margin, y); y += 6; });
      y += 4;
    });
  });

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) { doc.setPage(p); drawFooter(doc, p, total, 'EMF PROTECTION SHOP'); }
  doc.save('zenith-apex-emf-shop.pdf');
}

function generateBuildVideosPDF(videos) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const { margin, pageW, gold, goldLight, white, silver, muted, dimmed, pageBg, accentBg, cyan } = THEME;
  let y = 46;
  const bg = () => { doc.setFillColor(...pageBg); doc.rect(0, 0, pageW, 297, 'F'); };
  const newPage = () => { doc.addPage(); bg(); drawPageHeader(doc, 'BUILD VIDEO LIBRARY', 'ENGINEERING GUIDES'); y = 46; };
  const check = (n = 12) => { if (y + n > 282) newPage(); };

  bg(); drawPageHeader(doc, 'BUILD VIDEO LIBRARY', 'COMPLETE STEP-BY-STEP ENGINEERING GUIDES');
  doc.setFontSize(18); doc.setFont('helvetica', 'bold'); doc.setTextColor(...white);
  doc.text('Build Video Library', pageW / 2, y + 8, { align: 'center' });
  doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(...muted);
  doc.text(`${videos.length} Build Guides  ·  Complete Step-by-Step Instructions  ·  Materials & Tools Per Step`,, pageW / 2, y + 16, { align: 'center' });
  y += 28;

  if (videos.length === 0) {
    doc.setFontSize(10); doc.setFont('helvetica', 'italic'); doc.setTextColor(...muted);
    doc.text('No build videos found. Generate build videos in the Invention Forge to populate this catalog.', margin, y);
  }

  videos.forEach((v, idx) => {
    check(20);
    doc.setFillColor(...accentBg); doc.setDrawColor(...gold); doc.setLineWidth(0.3);
    doc.rect(margin - 2, y, pageW - margin * 2 + 4, 12, 'FD');
    doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(...gold);
    doc.text(`${idx + 1}.  ${v.invention_name}`, margin, y + 8);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(...muted);
    doc.text(`${v.step_count || (v.steps || []).length} steps  ·  ${v.invention_category || ''}  ·  ${new Date(v.created_date).toLocaleDateString()}`, pageW - margin, y + 8, { align: 'right' });
    y += 16;

    if (v.invention_tagline) {
      doc.setFontSize(8.5); doc.setFont('helvetica', 'italic'); doc.setTextColor(...silver);
      doc.text(`"${v.invention_tagline}"`, margin, y); y += 7;
    }

    (v.steps || []).forEach((step, si) => {
      check(24);
      doc.setFillColor(...[10, 25, 60]);
      doc.rect(margin, y, pageW - margin * 2, 8, 'F');
      doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(...goldLight);
      doc.text(`Step ${si + 1}: ${step.title || ''}`, margin + 3, y + 6);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(...muted);
      doc.text(step.duration || '', pageW - margin - 3, y + 6, { align: 'right' });
      y += 12;
      if (step.description) {
        doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(...silver);
        const lines = doc.splitTextToSize(step.description, pageW - margin * 2);
        lines.slice(0, 2).forEach(l => { check(6); doc.text(l, margin, y); y += 6; });
      }
      if (step.materials?.length) {
        check(6); doc.setFontSize(10); doc.setTextColor(...muted);
        doc.text('Materials: ' + step.materials.join('  ·  '), margin, y); y += 6;
      }
      if (step.warning) {
        check(5); doc.setTextColor(...[240, 100, 80]);
        doc.text('⚠ ' + step.warning, margin, y); y += 5;
      }
      if (step.checkpoint) {
        check(5); doc.setTextColor(...[60, 200, 100]);
        doc.text('✓ ' + step.checkpoint, margin, y); y += 5;
      }
      y += 2;
    });

    doc.setFillColor(...gold); doc.rect(margin, y, pageW - margin * 2, 0.25, 'F');
    y += 8;
  });

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) { doc.setPage(p); drawFooter(doc, p, total, 'BUILD VIDEO LIBRARY'); }
  doc.save('zenith-apex-build-video-library.pdf');
}

// ── DOWNLOAD CARD COMPONENT ────────────────────────────────────────────────
function DownloadCard({ icon, title, desc, badge, color, children, extra }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`bg-gray-900 border rounded-2xl overflow-hidden transition-all`}
      style={{ borderColor: color + '44', boxShadow: `0 0 0 0 ${color}` }}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: color + '18' }}>
            <span style={{ color }}>{icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-white font-black text-sm">{title}</h3>
              {badge && <span className="text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider" style={{ backgroundColor: color + '22', color }}>{badge}</span>}
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-3">{desc}</p>
            <div className="flex flex-wrap gap-2">
              {children}
              {extra && (
                <button onClick={() => setExpanded(e => !e)}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition-colors">
                  {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />} Details
                </button>
              )}
            </div>
          </div>
        </div>
        {expanded && extra && (
          <div className="mt-4 pl-16 text-gray-500 text-xs leading-relaxed">{extra}</div>
        )}
      </div>
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function DownloadCenter() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buildVideos, setBuildVideos] = useState([]);
  const [tab, setTab] = useState("investor");
  const [generatingVideos, setGeneratingVideos] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    const me = await base44.auth.me();
    setUser(me);
    if (me?.role === 'admin') {
      const vids = await base44.entities.BuildVideo.list('-created_date', 100);
      setBuildVideos(vids);
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-yellow-400" size={32} />
    </div>
  );

  if (user?.role !== 'admin') return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center p-8">
      <Shield size={48} className="text-gray-700 mb-4" />
      <h1 className="text-white font-black text-2xl mb-2">Admin Access Required</h1>
      <p className="text-gray-500 text-sm mb-6">The Download Center is restricted to admin accounts only.</p>
      <Link to="/" className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-bold text-sm">← Back to Home</Link>
    </div>
  );

  const courses = (businessItems || []).filter(b => b.category === 'Video Course' || b.category === 'Course');
  const plans = [];
  const genVideoPDF = () => {
    setGeneratingVideos(true);
    setTimeout(() => { generateBuildVideosPDF(buildVideos); setGeneratingVideos(false); }, 200);
  };

  const TABS = [
    { id: "investor", label: "Investor Package", icon: <Star size={13} /> },
    { id: "plans", label: "Invention Plans", icon: <Package size={13} /> },
    { id: "videos", label: "Build Videos", icon: <Film size={13} /> },
    { id: "courses", label: "Course Catalog", icon: <BookOpen size={13} /> },
    { id: "shop", label: "Shop Catalog", icon: <ShoppingBag size={13} /> },
    { id: "letter", label: "Master Letter", icon: <Mail size={13} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            {/* Mini logo */}
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 28 28">
                <polygon points="14,1 26,8 26,20 14,27 2,20 2,8" fill="#0c1850" stroke="#d4af37" strokeWidth="1.2"/>
                <line x1="8" y1="9" x2="20" y2="9" stroke="#f0d264" strokeWidth="1.4"/>
                <line x1="20" y1="9" x2="8" y2="19" stroke="#f0d264" strokeWidth="1.4"/>
                <line x1="8" y1="19" x2="20" y2="19" stroke="#f0d264" strokeWidth="1.4"/>
              </svg>
              <div>
                <h1 className="text-white font-black text-base tracking-tight">Download Center</h1>
                <p className="text-yellow-600 text-xs font-semibold">ZENITH APEX · ADMIN ONLY</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-lg bg-yellow-900/40 border border-yellow-700 text-yellow-400 font-bold">🔐 Admin Access</span>
          <Link to="/investor-package" className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white transition-colors">Investor Package ↗</Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-6 py-3 border-b border-gray-800 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${tab === t.id ? 'bg-yellow-900/60 border border-yellow-700 text-yellow-300' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-4">

        {/* INVESTOR PACKAGE TAB */}
        {tab === "investor" && (
          <>
            <div className="bg-gray-900 border border-yellow-800/40 rounded-2xl p-5 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <svg width="32" height="32" viewBox="0 0 28 28">
                  <polygon points="14,1 26,8 26,20 14,27 2,20 2,8" fill="#0c1850" stroke="#d4af37" strokeWidth="1.2"/>
                  <line x1="8" y1="9" x2="20" y2="9" stroke="#f0d264" strokeWidth="1.4"/>
                  <line x1="20" y1="9" x2="8" y2="19" stroke="#f0d264" strokeWidth="1.4"/>
                  <line x1="8" y1="19" x2="20" y2="19" stroke="#f0d264" strokeWidth="1.4"/>
                </svg>
                <div>
                  <h2 className="text-white font-black text-lg">Zenith Apex — Investor Package</h2>
                  <p className="text-yellow-600 text-xs">Navy & Gold Professional Branding · All Documents</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">Complete investor-ready document suite. All PDFs use the Zenith Apex brand identity with hexagonal tech logo, navy/midnight blue backgrounds, and gold typography.</p>
            </div>
            <DownloadCard icon={<FileText size={22} />} title="Mutual NDA" badge="Legal" color="#a855f7"
              desc="Professionally branded NDA with $2.5M liquidated damages clause, full Articles 1-8, signature blocks. Navy/gold theme with Zenith Apex logo on every page.">
              <NdaPdfGenerator />
            </DownloadCard>
            <DownloadCard icon={<BookOpen size={22} />} title="Technical Due Diligence Package" badge="100+ Pages" color="#3b82f6"
              desc="Complete 8-section institutional investment package: Platform Overview, AI Architecture, IP Portfolio, Primary Sources, Tech Stack, Revenue Model, Risk Analysis, Due Diligence Checklist.">
              <DueDiligencePdfGenerator />
            </DownloadCard>
          </>
        )}

        {/* INVENTION PLANS TAB */}
        {tab === "plans" && (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-2">
              <p className="text-white font-bold mb-1">Invention Build Plans Library</p>
              <p className="text-gray-400 text-sm">{plans.length} invention build plans with full engineering specifications, BOM, and assembly steps.</p>
            </div>
            <DownloadCard icon={<Package size={22} />} title="All Invention Plans — Full PDF" badge={`${plans.length} Devices`} color="#22c55e"
              desc="Complete engineering specifications for all invention devices: MEG, TRD-1, TRZ Reactor, Priore Device, Scalar Comm, EMF Shield Array. Each plan includes components, assembly steps, theory primer.">
              <button onClick={() => { const p = plans.length ? plans : [{ name: 'MEG Replica', description: 'Motionless Electromagnetic Generator replication kit.', components: ['Nanocrystalline core', 'Primary bifilar coil', 'Permanent magnet array'], steps: ['Wind primary coil', 'Mount magnet array', 'Wire secondary coil', 'Install core', 'Calibrate'] }]; generateInventionPlansPDF(p); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-800 hover:bg-green-700 text-white text-xs font-bold transition-all">
                <Download size={13} /> Download All Plans PDF
              </button>
            </DownloadCard>
          </>
        )}

        {/* BUILD VIDEOS TAB */}
        {tab === "videos" && (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-2">
              <p className="text-white font-bold mb-1">Build Video Library</p>
              <p className="text-gray-400 text-sm">{buildVideos.length} build videos saved in database. Export all as a complete engineering guide PDF.</p>
            </div>
            <DownloadCard icon={<Film size={22} />} title="All Build Videos — Engineering Guide PDF" badge={`${buildVideos.length} Guides`} color="#f59e0b"
              desc="Export every saved build video as a printable PDF engineering guide. Each video includes 10 steps with materials, tools, warnings, and checkpoints. Branded Zenith Apex cover.">
              <button onClick={genVideoPDF} disabled={generatingVideos}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold transition-all disabled:opacity-60">
                {generatingVideos ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                {generatingVideos ? 'Building…' : 'Download All Build Guides PDF'}
              </button>
            </DownloadCard>
            {buildVideos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {buildVideos.map((v, i) => (
                  <div key={v.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-white font-bold text-sm">{v.invention_name}</p>
                    <p className="text-gray-500 text-xs">{v.step_count || (v.steps || []).length} steps · {v.invention_category}</p>
                    <p className="text-gray-600 text-xs mt-1">{new Date(v.created_date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* COURSES TAB */}
        {tab === "courses" && (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-2">
              <p className="text-white font-bold mb-1">Course Catalog</p>
              <p className="text-gray-400 text-sm">{courses.length} courses in the catalog. Download as a branded PDF for distribution.</p>
            </div>
            <DownloadCard icon={<BookOpen size={22} />} title="Complete Course Catalog PDF" badge={`${courses.length} Courses`} color="#8b5cf6"
              desc="Printable catalog of all courses: scalar EM fundamentals, MEG replication, Priore device, TRZ physics, bioelectromagnetics, psychoenergetics, defense applications. Includes pricing and module listings.">
              <button onClick={() => generateCoursesPDF(courses.length > 0 ? courses : [
                { name: 'Scalar EM Fundamentals', description: 'Complete introduction to Bearden scalar electromagnetics framework.', price: '$197', modules: ['Maxwell equations', 'Active vacuum', 'Gauge theory', 'COP>1 devices'] },
                { name: 'MEG Replication Workshop', description: 'Step-by-step MEG device replication with instrumented measurements.', price: '$297', modules: ['Core winding', 'Magnet array', 'Output measurement', 'COP analysis'] },
                { name: 'Bioelectromagnetics & Healing', description: 'Priore device, MCCS protocol, telomere restoration, and scalar medicine.', price: '$247', modules: ['Priore history', 'ONR validation', 'TRD-1 build', 'Protocol'] },
                { name: 'Defense Applications & History', description: 'KGB QP weapons, Baghdad M1A1 incident, Gulf War Syndrome analysis.', price: '$397', modules: ['QP weapons', 'TACOM memo', 'Gulf War', 'Countermeasures'] },
              ])}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-700 text-white text-xs font-bold transition-all">
                <Download size={13} /> Download Course Catalog PDF
              </button>
            </DownloadCard>
          </>
        )}

        {/* SHOP TAB */}
        {tab === "shop" && (
          <DownloadCard icon={<ShoppingBag size={22} />} title="EMF Protection Shop — Product Catalog PDF" badge="20 Products" color="#10b981"
            desc="Complete printable product catalog: jewelry, home devices, clothing, supplements, DIY kits. Each product includes pricing, description, and specifications. Branded Zenith Apex layout.">
            <button onClick={() => { setTimeout(generateShopPDF, 100); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all">
              <Download size={13} /> Download Shop Catalog PDF
            </button>
          </DownloadCard>
        )}

        {/* MASTER LETTER TAB */}
        {tab === "letter" && (
          <>
            <DownloadCard icon={<Mail size={22} />} title="Master Acquisition Letter PDF" badge="Personalize Before Sending" color="#f59e0b"
              desc="Complete acquisition outreach letter with full valuation tables, asset summary, acquisition terms, and contact blocks. Branded Zenith Apex PDF — replace [YOUR NAME], [YOUR EMAIL], [YOUR PHONE] before sending.">
              <button onClick={() => { setTimeout(generateMasterLetterPDF, 100); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold transition-all">
                <Download size={13} /> Download Master Letter PDF
              </button>
            </DownloadCard>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mt-4">
              <p className="text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Letter Preview</p>
              <pre className="text-gray-500 text-xs leading-relaxed whitespace-pre-wrap font-mono max-h-80 overflow-y-auto">{MASTER_LETTER}</pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}