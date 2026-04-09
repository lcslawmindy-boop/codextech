import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileText, BookOpen, Film, Package, ShoppingBag, Mail, Shield, Loader2, ChevronDown, ChevronUp, Star, Wrench } from "lucide-react";
import { jsPDF } from "jspdf";
import { base44 } from "@/api/base44Client";
import { THEME, drawLogo, drawPageHeader, drawFooter } from "../lib/zenithPdfTheme";
import NdaPdfGenerator from "../components/NdaPdfGenerator";
import DueDiligencePdfGenerator from "../components/DueDiligencePdfGenerator";
import { businessItems } from "../lib/businessItems";
import { inventionSteps } from "../lib/inventionSteps";

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
  const margin = 22;
  const pageW = 210;
  const contentW = pageW - margin * 2;
  let y = 0;
  let pageNum = 1;

  const bg = () => { doc.setFillColor(255, 255, 255); doc.rect(0, 0, pageW, 297, 'F'); };

  const newPage = () => {
    doc.addPage(); bg(); pageNum++;
    drawPageHeader(doc, 'ACQUISITION LETTER', 'CONFIDENTIAL');
    y = 58;
  };

  const check = (n = 14) => { if (y + n > 281) newPage(); };

  bg();
  drawPageHeader(doc, 'MASTER ACQUISITION LETTER', 'STRICTLY CONFIDENTIAL — PERSONALIZE BEFORE SENDING');
  y = 58;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(20, 20, 20);
  const lines = doc.splitTextToSize(MASTER_LETTER, contentW);
  lines.forEach(l => {
    check(9);
    const trimmed = l.trim();
    if (trimmed.startsWith('PLATFORM') || trimmed.startsWith('ACQUISITION') || trimmed.startsWith('TO PROCEED') || trimmed === 'STRICTLY CONFIDENTIAL — NDA REQUIRED BEFORE FURTHER DISCLOSURE') {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(20, 20, 20);
    }
    doc.text(l, margin, y);
    y += 8;
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
  const margin = 22;
  const pageW = 210;
  const contentW = pageW - margin * 2;
  let y = 58; let pn = 1;
  const bg = () => { doc.setFillColor(255, 255, 255); doc.rect(0, 0, pageW, 297, 'F'); };
  const newPage = () => { doc.addPage(); bg(); pn++; drawPageHeader(doc, 'COURSE CATALOG', 'ZENITH APEX EDUCATIONAL LIBRARY'); y = 58; };
  const check = (n = 14) => { if (y + n > 281) newPage(); };

  bg(); drawPageHeader(doc, 'COURSE CATALOG', 'ZENITH APEX EDUCATIONAL LIBRARY');

  doc.setFontSize(20); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text('Complete Course Catalog', pageW / 2, y + 8, { align: 'center' });
  doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60);
  doc.text(`${courses.length} Courses  ·  Scalar EM  ·  IP Strategy  ·  Bioelectromagnetics  ·  Advanced Physics`, pageW / 2, y + 18, { align: 'center' });
  y += 32;

  courses.forEach((course, idx) => {
    check(48);
    doc.setFillColor(240, 240, 240);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentW, 42, 2, 2, 'FD');
    doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
    doc.text(`${idx + 1}.  ${course.name}`, margin + 5, y + 10);
    doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(30, 30, 30);
    const desc = doc.splitTextToSize(course.description || course.tagline || '', contentW - 10);
    desc.slice(0, 2).forEach((l, i) => doc.text(l, margin + 5, y + 18 + i * 7));
    if (course.price) {
      doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
      doc.text(course.price, pageW - margin - 5, y + 10, { align: 'right' });
    }
    if (course.modules) {
      doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(70, 70, 70);
      doc.text('Modules: ' + course.modules.slice(0, 5).join('  ·  '), margin + 5, y + 35);
    }
    y += 48;
  });

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) { doc.setPage(p); drawFooter(doc, p, total, 'COURSE CATALOG'); }
  doc.save('zenith-apex-course-catalog.pdf');
}

function generateInventionPlansPDF(plans) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 22;
  const pageW = 210;
  const contentW = pageW - margin * 2;
  let y = 58; let pn = 1;
  const bg = () => { doc.setFillColor(255, 255, 255); doc.rect(0, 0, pageW, 297, 'F'); };
  const newPage = () => { doc.addPage(); bg(); pn++; drawPageHeader(doc, 'INVENTION BUILD PLANS', 'ENGINEERING SPECIFICATIONS'); y = 58; };
  const check = (n = 14) => { if (y + n > 281) newPage(); };

  bg(); drawPageHeader(doc, 'INVENTION BUILD PLANS', 'COMPLETE ENGINEERING SPECIFICATIONS LIBRARY');
  doc.setFontSize(20); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text('Invention Build Plans & Engineering Specifications', pageW / 2, y + 8, { align: 'center' });
  doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60);
  doc.text(`${plans.length} Devices  ·  Complete BOM  ·  Step-by-Step Assembly  ·  Theory Primers`, pageW / 2, y + 18, { align: 'center' });
  y += 32;

  plans.forEach((plan, idx) => {
    check(60);
    // Section header
    doc.setFillColor(10, 10, 10);
    doc.rect(margin - 2, y, contentW + 4, 14, 'F');
    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text(`Device ${idx + 1}: ${plan.name}`, margin, y + 9);
    if (plan.price) {
      doc.setTextColor(220, 220, 220); doc.setFontSize(12);
      doc.text(plan.price, pageW - margin, y + 9, { align: 'right' });
    }
    y += 18;

    if (plan.description) {
      doc.setFontSize(12); doc.setFont('helvetica', 'normal'); doc.setTextColor(20, 20, 20);
      const lines = doc.splitTextToSize(plan.description, contentW);
      lines.slice(0, 4).forEach(l => { check(9); doc.text(l, margin, y); y += 8; });
      y += 4;
    }

    if (plan.components) {
      check(12);
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
      doc.text('KEY COMPONENTS:', margin, y); y += 9;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.setTextColor(20, 20, 20);
      plan.components.slice(0, 10).forEach(c => { check(8); doc.text(`  •  ${c}`, margin, y); y += 8; });
      y += 4;
    }

    if (plan.steps) {
      check(12);
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
      doc.text('ASSEMBLY STEPS:', margin, y); y += 9;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.setTextColor(20, 20, 20);
      plan.steps.slice(0, 12).forEach((s, i) => { check(8); doc.text(`  ${i + 1}.  ${typeof s === 'string' ? s : s.title || s.action || ''}`, margin, y); y += 8; });
      y += 4;
    }

    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.4); doc.line(margin, y, pageW - margin, y);
    y += 10;
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
  const margin = 22;
  const pageW = 210;
  const contentW = pageW - margin * 2;
  let y = 58;
  const bg = () => { doc.setFillColor(255, 255, 255); doc.rect(0, 0, pageW, 297, 'F'); };
  const newPage = () => { doc.addPage(); bg(); drawPageHeader(doc, 'EMF PROTECTION SHOP', 'PRODUCT CATALOG'); y = 58; };
  const check = (n = 14) => { if (y + n > 281) newPage(); };

  bg(); drawPageHeader(doc, 'EMF PROTECTION SHOP', 'COMPLETE PRODUCT CATALOG');
  doc.setFontSize(20); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text('EMF Protection Shop — Product Catalog', pageW / 2, y + 8, { align: 'center' });
  doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60);
  doc.text(`${products.length} Products  ·  Jewelry  ·  Home Devices  ·  Clothing  ·  Supplements  ·  DIY Kits`, pageW / 2, y + 18, { align: 'center' });
  y += 32;

  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    check(18);
    doc.setFillColor(10, 10, 10); doc.rect(margin - 2, y - 2, contentW + 4, 13, 'F');
    doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text(cat.toUpperCase(), margin, y + 7); y += 18;
    products.filter(p => p.category === cat).forEach(p => {
      check(26);
      doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
      doc.text(p.name, margin, y);
      doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
      doc.text(p.price, pageW - margin, y, { align: 'right' });
      y += 9;
      doc.setFontSize(12); doc.setFont('helvetica', 'normal'); doc.setTextColor(25, 25, 25);
      const lines = doc.splitTextToSize(p.desc, contentW);
      lines.forEach(l => { check(8); doc.text(l, margin, y); y += 8; });
      y += 6;
      doc.setDrawColor(160, 160, 160); doc.setLineWidth(0.3); doc.line(margin, y, pageW - margin, y);
      y += 5;
    });
    y += 4;
  });

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) { doc.setPage(p); drawFooter(doc, p, total, 'EMF PROTECTION SHOP'); }
  doc.save('zenith-apex-emf-shop.pdf');
}

function generateBuildVideosPDF(videos) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 22;
  const pageW = 210;
  const contentW = pageW - margin * 2;
  let y = 58;
  const bg = () => { doc.setFillColor(255, 255, 255); doc.rect(0, 0, pageW, 297, 'F'); };
  const newPage = () => { doc.addPage(); bg(); drawPageHeader(doc, 'BUILD VIDEO LIBRARY', 'ENGINEERING GUIDES'); y = 58; };
  const check = (n = 14) => { if (y + n > 281) newPage(); };

  bg(); drawPageHeader(doc, 'BUILD VIDEO LIBRARY', 'COMPLETE STEP-BY-STEP ENGINEERING GUIDES');
  doc.setFontSize(20); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
  doc.text('Build Video Library', pageW / 2, y + 8, { align: 'center' });
  doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60);
  doc.text(`${videos.length} Build Guides  ·  Complete Step-by-Step Instructions  ·  Materials & Tools Per Step`, pageW / 2, y + 18, { align: 'center' });
  y += 32;

  if (videos.length === 0) {
    doc.setFontSize(12); doc.setFont('helvetica', 'italic'); doc.setTextColor(80, 80, 80);
    doc.text('No build videos found. Generate build videos in the Invention Forge to populate this catalog.', margin, y);
  }

  videos.forEach((v, idx) => {
    check(24);
    doc.setFillColor(10, 10, 10); doc.rect(margin - 2, y - 2, contentW + 4, 16, 'F');
    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text(`${idx + 1}.  ${v.invention_name}`, margin, y + 9);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(190, 190, 190);
    doc.text(`${v.step_count || (v.steps || []).length} steps  ·  ${v.invention_category || ''}`, pageW - margin, y + 9, { align: 'right' });
    y += 22;

    if (v.invention_tagline) {
      doc.setFontSize(11); doc.setFont('helvetica', 'italic'); doc.setTextColor(40, 40, 40);
      doc.text(`"${v.invention_tagline}"`, margin, y); y += 10;
    }

    (v.steps || []).forEach((step, si) => {
      check(30);
      doc.setFillColor(230, 230, 230);
      doc.rect(margin, y, contentW, 11, 'F');
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
      doc.text(`Step ${si + 1}: ${step.title || ''}`, margin + 4, y + 7.5);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60);
      doc.text(step.duration || '', pageW - margin - 4, y + 7.5, { align: 'right' });
      y += 15;
      if (step.description) {
        doc.setFontSize(12); doc.setFont('helvetica', 'normal'); doc.setTextColor(20, 20, 20);
        const lines = doc.splitTextToSize(step.description, contentW);
        lines.slice(0, 3).forEach(l => { check(8); doc.text(l, margin, y); y += 8; });
      }
      if (step.materials?.length) {
        check(8); doc.setFontSize(11); doc.setTextColor(50, 50, 50);
        doc.text('Materials: ' + step.materials.join('  ·  '), margin, y); y += 8;
      }
      if (step.warning) {
        check(8); doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
        doc.text('WARNING: ' + step.warning, margin, y); y += 8;
      }
      if (step.checkpoint) {
        check(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 0, 0);
        doc.text('CHECKPOINT: ' + step.checkpoint, margin, y); y += 8;
      }
      y += 3;
    });

    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.4); doc.line(margin, y, pageW - margin, y);
    y += 10;
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
  const allInventions = (businessItems || []).filter(b => b.category === 'Invention');
  const inventionsWithSteps = allInventions.filter(inv => inventionSteps[inv.title]);
  const plans = allInventions.map(inv => {
    const steps = inventionSteps[inv.title];
    return {
      name: inv.title,
      description: inv.description,
      price: inv.price,
      components: steps?.bom?.map(b => `${b.qty}× ${b.item} (${b.spec})`) || [],
      steps: steps?.steps?.map(s => ({ title: s.title, action: s.detail })) || [],
    };
  });
  const genVideoPDF = () => {
    setGeneratingVideos(true);
    // Merge DB build videos with inventionSteps-based guides
    const stepGuides = inventionsWithSteps.map(inv => {
      const data = inventionSteps[inv.title];
      return {
        invention_name: inv.title,
        invention_category: inv.category,
        invention_tagline: inv.tagline,
        step_count: data.steps.length,
        steps: data.steps.map(s => ({
          title: s.title,
          description: s.detail,
          warning: s.warning || null,
          materials: data.bom?.slice(0, 3).map(b => b.item) || [],
        })),
      };
    });
    const allGuides = [...stepGuides, ...buildVideos.filter(v => !stepGuides.some(g => g.invention_name === v.invention_name))];
    setTimeout(() => { generateBuildVideosPDF(allGuides); setGeneratingVideos(false); }, 200);
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
              <p className="text-gray-400 text-sm">{allInventions.length} invention build plans · {inventionsWithSteps.length} with full BOM & step-by-step assembly instructions.</p>
            </div>
            <DownloadCard icon={<Package size={22} />} title="All 21 Invention Plans — Full PDF" badge={`${allInventions.length} Devices`} color="#22c55e"
              desc="Complete engineering specifications for all 21 invention devices: MEG, TRD-1, TRZ Reactor, Prioré System, Scalar Comm, Biofield Chamber, VPO, Fireflies Sensor, PCM System, and more. Each plan includes description, components, assembly steps, and theory primer.">
              <button onClick={() => generateInventionPlansPDF(plans)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-800 hover:bg-green-700 text-white text-xs font-bold transition-all">
                <Download size={13} /> Download All {allInventions.length} Plans PDF
              </button>
            </DownloadCard>
            {/* Individual invention cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {allInventions.map((inv, i) => {
                const hasSteps = !!inventionSteps[inv.title];
                const stepData = inventionSteps[inv.title];
                return (
                  <div key={i} className={`bg-gray-900 border rounded-xl p-4 ${hasSteps ? 'border-green-900/50' : 'border-gray-800'}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-white font-bold text-sm leading-tight">{inv.icon} {inv.title}</p>
                      {hasSteps && <span className="flex-shrink-0 text-xs px-1.5 py-0.5 rounded bg-green-950/40 border border-green-800 text-green-400 font-bold">Full BOM</span>}
                    </div>
                    <p className="text-gray-500 text-xs mb-2">{inv.price}</p>
                    {hasSteps && (
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><Wrench size={9} /> {stepData.bom?.length || 0} parts</span>
                        <span>{stepData.steps?.length || 0} steps</span>
                      </div>
                    )}
                    {!hasSteps && <p className="text-gray-700 text-xs">Description & specs included</p>}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* BUILD VIDEOS TAB */}
        {tab === "videos" && (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-2">
              <p className="text-white font-bold mb-1">Build Video / Step-by-Step Guide Library</p>
              <p className="text-gray-400 text-sm">{inventionsWithSteps.length} inventions with full step-by-step build guides from inventionSteps + {buildVideos.length} AI-generated build videos from database.</p>
            </div>
            <DownloadCard icon={<Film size={22} />} title="All Build Guides — Complete Engineering PDF" badge={`${inventionsWithSteps.length + buildVideos.length} Guides`} color="#f59e0b"
              desc={`Export all ${inventionsWithSteps.length} inventionSteps guides plus ${buildVideos.length} AI-generated build videos as a complete printable engineering PDF. Each guide includes detailed steps, BOM highlights, warnings, and checkpoints.`}>
              <button onClick={genVideoPDF} disabled={generatingVideos}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold transition-all disabled:opacity-60">
                {generatingVideos ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                {generatingVideos ? 'Building…' : `Download All ${inventionsWithSteps.length + buildVideos.length} Build Guides PDF`}
              </button>
            </DownloadCard>
            {/* Step-by-step guide cards from inventionSteps */}
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-4">Full Step-by-Step Guides ({inventionsWithSteps.length})</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {inventionsWithSteps.map((inv, i) => {
                const data = inventionSteps[inv.title];
                return (
                  <div key={i} className="bg-gray-900 border border-amber-900/40 rounded-xl p-4">
                    <p className="text-white font-bold text-sm">{inv.icon} {inv.title}</p>
                    <p className="text-gray-500 text-xs mt-1">{data.steps?.length || 0} steps · {data.bom?.length || 0} BOM items</p>
                    <p className="text-gray-600 text-xs mt-1 leading-relaxed line-clamp-2">{data.overview?.slice(0, 120)}…</p>
                  </div>
                );
              })}
            </div>
            {/* DB build videos */}
            {buildVideos.length > 0 && (
              <>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-4">AI-Generated Build Videos ({buildVideos.length})</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {buildVideos.map((v, i) => (
                    <div key={v.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                      <p className="text-white font-bold text-sm">{v.invention_name}</p>
                      <p className="text-gray-500 text-xs">{v.step_count || (v.steps || []).length} steps · {v.invention_category}</p>
                      <p className="text-gray-600 text-xs mt-1">{new Date(v.created_date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </>
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