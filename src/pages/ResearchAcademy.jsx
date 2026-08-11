import { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap, Play, Clock, Award, Lock, ChevronRight,
  CheckCircle2, FileText, Download, Share2, Flame, BookOpen,
  Cpu, Zap, Waves, Sun, Brain, Briefcase, Wrench, PenTool, TrendingUp
} from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useTier } from "@/hooks/useTier";

// ── Course data ─────────────────────────────────────────────────────────────
const DOMAINS = [
  "All Courses", "Bioelectromagnetics", "Scalar Science", "Acoustic Medicine",
  "Photobiomodulation", "Neurostimulation", "IP & Licensing", "Device Engineering",
  "Grant Writing", "Investor Pitching"
];

const DOMAIN_ICONS = {
  "Bioelectromagnetics": <Zap size={14} />,
  "Scalar Science": <Waves size={14} />,
  "Acoustic Medicine": <Waves size={14} />,
  "Photobiomodulation": <Sun size={14} />,
  "Neurostimulation": <Brain size={14} />,
  "IP & Licensing": <Briefcase size={14} />,
  "Device Engineering": <Wrench size={14} />,
  "Grant Writing": <PenTool size={14} />,
  "Investor Pitching": <TrendingUp size={14} />,
};

const DOMAIN_COLORS = {
  "Bioelectromagnetics": "#06b6d4",
  "Scalar Science": "#9B30FF",
  "Acoustic Medicine": "#a855f7",
  "Photobiomodulation": "#f59e0b",
  "Neurostimulation": "#3b82f6",
  "IP & Licensing": "#C9A84C",
  "Device Engineering": "#10b981",
  "Grant Writing": "#ec4899",
  "Investor Pitching": "#ef4444",
};

const COURSES = [
  {
    id: "bioem-foundations",
    title: "Bioelectromagnetics Foundations for Inventors",
    domain: "Bioelectromagnetics",
    modules: 6,
    duration: "4.2 hrs",
    difficulty: "Foundational",
    tier: "FREE",
    progress: 0,
    topics: ["Frequency ranges", "Biological targets", "Suppression patterns", "Device planning"],
    modulesList: [
      "What Is Bioelectromagnetics? — history, pioneers, documented research",
      "Frequency Ranges and Biological Targets",
      "Key Researchers — Rife, Prioré, Becker, Lakhovsky, Popp",
      "The Suppression Pattern — How and Why Technologies Disappear",
      "Reading Research Nodes in ZARP — platform tutorial",
      "Building Your First Device Plan from Bioelectromagnetic Nodes",
    ],
  },
  {
    id: "ip-basics",
    title: "IP Basics for Independent Inventors",
    domain: "IP & Licensing",
    modules: 6,
    duration: "3.8 hrs",
    difficulty: "Foundational",
    tier: "FREE",
    progress: 33,
    topics: ["Patent types", "Trade secrets", "Provisional patents", "Attorney selection"],
    modulesList: [
      "Types of IP Protection — patent, trade secret, copyright, trademark",
      "Trade Secrets — Your First Line of Defense (no filing required)",
      "Patent Basics — Utility, Design, Provisional explained simply",
      "What Can Be Patented — Novelty, Non-Obviousness, Utility",
      "Using ZARP IP Suite for Claim Drafting",
      "Finding and Working with a Patent Attorney",
    ],
  },
  {
    id: "licensing-ip",
    title: "Licensing Your IP to Established Companies",
    domain: "IP & Licensing",
    modules: 6,
    duration: "4.5 hrs",
    difficulty: "Intermediate",
    tier: "PRO",
    progress: 0,
    topics: ["Licensing targets", "Cold outreach", "Deal structures", "Negotiation"],
    modulesList: [
      "What Licensing Is and Why Companies Buy IP",
      "What Makes IP Licensable — documentation, protection, novelty",
      "Finding the Right Licensing Target",
      "The Cold Outreach Strategy — What Works",
      "Deal Structures — Royalties, Upfront, Equity Explained",
      "Negotiation Basics and Red Flags",
    ],
  },
  {
    id: "sbir-grant",
    title: "Writing a Winning SBIR Grant Application",
    domain: "Grant Writing",
    modules: 6,
    duration: "5.1 hrs",
    difficulty: "Advanced",
    tier: "PRO",
    progress: 0,
    topics: ["SBIR vs STTR", "Agency selection", "Specific aims", "Commercialization plan"],
    modulesList: [
      "SBIR vs STTR — Which Is Right for You?",
      "Choosing the Right Agency and Topic",
      "The Significance Section — Making the Case",
      "Specific Aims — The Most Important Page",
      "Using ZARP Research Nodes for Literature Support",
      "Budget, Timeline, and Commercialization Plan",
    ],
  },
  {
    id: "multi-system-integration",
    title: "Multi-System Integration Masterclass",
    domain: "Device Engineering",
    modules: 6,
    duration: "4.2 hrs",
    difficulty: "Advanced",
    tier: "ENTERPRISE",
    progress: 0,
    topics: ["Modality fusion", "Coherent architecture", "Closed-loop control", "Safety systems"],
    modulesList: [
      "Principles of Multi-Modal Integration",
      "Coherent Field Architecture Design",
      "Closed-Loop Biometric Control Systems",
      "Safety Interlock Engineering",
      "Power Management for Multi-Modal Devices",
      "Case Study — AATCS-P1 9-Modal Platform",
    ],
    featured: true,
  },
  {
    id: "scalar-science",
    title: "Scalar EM Theory and Applications",
    domain: "Scalar Science",
    modules: 5,
    duration: "3.5 hrs",
    difficulty: "Intermediate",
    tier: "PRO",
    progress: 60,
    topics: ["Longitudinal waves", "Phase conjugation", "Vacuum engineering", "Bearden framework"],
    modulesList: [
      "Introduction to Scalar Electromagnetics",
      "Longitudinal Wave Physics",
      "Phase-Conjugate Mirror Theory",
      "Vacuum Energy and Asymmetric Regauging",
      "Practical Scalar Device Construction",
    ],
  },
  {
    id: "pbm-fundamentals",
    title: "Photobiomodulation: Light as Medicine",
    domain: "Photobiomodulation",
    modules: 4,
    duration: "2.8 hrs",
    difficulty: "Foundational",
    tier: "FREE",
    progress: 100,
    topics: ["NIR wavelengths", "Mitochondrial mechanism", "Dosing protocols", "Clinical evidence"],
    modulesList: [
      "What Is Photobiomodulation?",
      "Mitochondrial Mechanism of Action",
      "Wavelength Selection and Dosing",
      "Clinical Evidence and Protocols",
    ],
  },
  {
    id: "neurostim-ces",
    title: "Neurostimulation and Cranial Electrotherapy",
    domain: "Neurostimulation",
    modules: 5,
    duration: "3.2 hrs",
    difficulty: "Intermediate",
    tier: "PRO",
    progress: 0,
    topics: ["CES devices", "TENS protocols", "Brainwave entrainment", "FDA pathways"],
    modulesList: [
      "Introduction to Neurostimulation",
      "CES — Cranial Electrotherapy Stimulation",
      "Brainwave Entrainment Protocols",
      "FDA Regulatory Pathways for Neurodevices",
      "Clinical Applications and Contraindications",
    ],
  },
  {
    id: "investor-pitch",
    title: "Pitching Deep-Tech to Investors",
    domain: "Investor Pitching",
    modules: 5,
    duration: "3.0 hrs",
    difficulty: "Intermediate",
    tier: "PRO",
    progress: 0,
    topics: ["Deck structure", "IP valuation", "Due diligence", "Term sheets"],
    modulesList: [
      "Understanding Deep-Tech Investor Psychology",
      "Deck Structure That Works",
      "IP Valuation and Portfolio Narratives",
      "Surviving Due Diligence",
      "Term Sheet Basics",
    ],
  },
];

const TIER_COLORS = {
  "FREE": { bg: "rgba(16, 185, 129, 0.15)", text: "#34D399", border: "rgba(16, 185, 129, 0.3)" },
  "PRO": { bg: "rgba(201, 168, 76, 0.15)", text: "#C9A84C", border: "rgba(201, 168, 76, 0.3)" },
  "ENTERPRISE": { bg: "rgba(155, 48, 255, 0.15)", text: "#C084FC", border: "rgba(155, 48, 255, 0.3)" },
};

const DIFFICULTY_COLORS = {
  "Foundational": "#10b981",
  "Intermediate": "#f59e0b",
  "Advanced": "#ef4444",
};

function CourseCard({ course, onOpen, hasAccess }) {
  const domainColor = DOMAIN_COLORS[course.domain];
  const tierColor = TIER_COLORS[course.tier];
  return (
    <div onClick={() => hasAccess && onOpen(course)}
      className={`bg-zarp-card border rounded-xl overflow-hidden transition-all ${hasAccess ? "cursor-pointer hover:border-zarp-gold/30 hover:shadow-lg" : "opacity-75"}`}
      style={{ borderColor: 'rgba(215, 14, 14%, 15%)' }}>
      {/* Color stripe */}
      <div className="h-1" style={{ backgroundColor: domainColor }} />
      {/* Thumbnail */}
      <div className="h-28 relative flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${domainColor}15 0%, ${domainColor}05 100%)` }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `radial-gradient(circle at 30% 50%, ${domainColor}40 0%, transparent 60%)` }} />
        <span style={{ color: domainColor, opacity: 0.6 }}>
          {DOMAIN_ICONS[course.domain] || <BookOpen size={32} />}
        </span>
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-black border"
          style={{ backgroundColor: tierColor.bg, color: tierColor.text, borderColor: tierColor.border }}>
          {course.tier}
        </span>
      </div>
      {/* Body */}
      <div className="p-4">
        <h3 className="text-zarp-text font-semibold text-sm leading-tight mb-1">{course.title}</h3>
        <p className="text-zarp-muted text-[10px] mb-2">ZARP Research Intelligence</p>
        <div className="flex items-center gap-2 text-[10px] text-zarp-muted mb-2">
          <span className="flex items-center gap-1"><BookOpen size={10} /> {course.modules} modules</span>
          <span className="flex items-center gap-1"><Clock size={10} /> {course.duration}</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold" style={{ color: DIFFICULTY_COLORS[course.difficulty] }}>
            {course.difficulty}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {course.topics.slice(0, 3).map(t => (
            <span key={t} className="px-1.5 py-0.5 rounded-full text-[9px] bg-zarp-elevated text-zarp-muted">{t}</span>
          ))}
        </div>
        {course.progress > 0 && course.progress < 100 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-zarp-muted text-[9px]">Progress</span>
              <span className="text-zarp-gold text-[9px] font-bold">{course.progress}%</span>
            </div>
            <div className="h-1 bg-zarp-elevated rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-zarp-blue to-zarp-gold" style={{ width: `${course.progress}%` }} />
            </div>
          </div>
        )}
        {course.progress === 100 && (
          <div className="mb-3 flex items-center gap-1.5 text-[10px] text-zarp-green">
            <CheckCircle2 size={12} /> Completed
          </div>
        )}
        <button className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
          hasAccess
            ? course.progress > 0 && course.progress < 100
              ? "bg-zarp-blue/10 text-zarp-blue hover:bg-zarp-blue/20 border border-zarp-blue/30"
              : "bg-zarp-gold/10 text-zarp-gold hover:bg-zarp-gold/20 border border-zarp-gold/30"
            : "bg-zarp-elevated text-zarp-muted"
        }`}>
          {!hasAccess ? <><Lock size={12} /> Upgrade to Access</>
            : course.progress > 0 && course.progress < 100 ? <><Play size={12} /> Continue</>
            : course.progress === 100 ? <><Award size={12} /> View Certificate</>
            : <><Play size={12} /> Start Course</>}
        </button>
      </div>
    </div>
  );
}

function CourseDetail({ course, onClose, hasAccess }) {
  const [openModule, setOpenModule] = useState(0);
  const domainColor = DOMAIN_COLORS[course.domain];
  return (
    <div className="fixed inset-0 z-50 bg-zarp-bg/95 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onClose} className="flex items-center gap-1.5 text-zarp-muted hover:text-zarp-text text-sm transition-colors">
            <ChevronRight size={14} className="rotate-180" /> Back to Library
          </button>
          <span className="px-2 py-0.5 rounded text-[9px] font-black border"
            style={{ backgroundColor: TIER_COLORS[course.tier].bg, color: TIER_COLORS[course.tier].text, borderColor: TIER_COLORS[course.tier].border }}>
            {course.tier}
          </span>
        </div>

        <div className="mb-2">
          <span className="text-zarp-muted text-xs flex items-center gap-1.5" style={{ color: domainColor }}>
            {DOMAIN_ICONS[course.domain]} {course.domain}
          </span>
        </div>
        <h1 className="font-display text-2xl font-bold text-zarp-text mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          {course.title}
        </h1>
        <div className="flex items-center gap-4 text-xs text-zarp-muted mb-6">
          <span className="flex items-center gap-1"><BookOpen size={12} /> {course.modules} modules</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
          <span className="flex items-center gap-1"><GraduationCap size={12} /> {course.difficulty}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Module list */}
          <div className="lg:col-span-1">
            <h3 className="text-zarp-text font-semibold text-sm mb-3">Modules</h3>
            <div className="space-y-1">
              {course.modulesList.map((m, i) => (
                <div key={i}>
                  <button onClick={() => setOpenModule(i)}
                    className={`w-full flex items-start gap-2 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      openModule === i ? "bg-zarp-elevated" : "hover:bg-zarp-elevated/50"
                    }`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5 ${
                      course.progress === 100 || (course.progress > 0 && i < Math.floor(course.progress / 100 * course.modules))
                        ? "bg-zarp-green/20 text-zarp-green" : "bg-zarp-elevated text-zarp-muted"
                    }`}>
                      {course.progress === 100 || (course.progress > 0 && i < Math.floor(course.progress / 100 * course.modules))
                        ? <CheckCircle2 size={12} /> : i + 1}
                    </div>
                    <span className={`text-xs leading-tight ${openModule === i ? "text-zarp-text" : "text-zarp-muted"}`}>{m}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="lg:col-span-2">
            <div className="bg-zarp-card border border-zarp-border rounded-xl overflow-hidden mb-4">
              {/* Video placeholder */}
              <div className="aspect-video flex items-center justify-center relative"
                style={{ background: `linear-gradient(135deg, ${domainColor}10 0%, ${domainColor}05 100%)` }}>
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${domainColor}60 0%, transparent 70%)` }} />
                <div className="text-center relative z-10">
                  <div className="w-16 h-16 rounded-full bg-zarp-elevated border border-zarp-border flex items-center justify-center mx-auto mb-3">
                    <Play size={24} className="text-zarp-gold ml-1" />
                  </div>
                  <p className="text-zarp-muted text-xs">Module {openModule + 1} — Video Lesson</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-zarp-text font-semibold text-sm mb-2">{course.modulesList[openModule]}</h3>
                <p className="text-zarp-muted text-xs leading-relaxed mb-3">
                  This module covers the core concepts and practical applications. Includes video instruction,
                  downloadable reference materials, and a knowledge check at the end.
                </p>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zarp-elevated text-zarp-muted text-xs hover:text-zarp-text transition-colors">
                    <FileText size={12} /> Transcript
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zarp-elevated text-zarp-muted text-xs hover:text-zarp-text transition-colors">
                    <Download size={12} /> PDF Summary
                  </button>
                </div>
              </div>
            </div>

            {/* Related */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zarp-card border border-zarp-border rounded-xl p-4">
                <p className="text-zarp-text font-semibold text-xs mb-2">Related in ZARP Graph</p>
                <div className="space-y-1.5">
                  {["Prioré Device", "Rife Technology", "Scalar EM"].map(n => (
                    <Link key={n} to="/research-explorer" className="block text-zarp-muted text-[11px] hover:text-zarp-gold transition-colors flex items-center gap-1">
                      <ChevronRight size={10} /> {n}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-zarp-card border border-zarp-border rounded-xl p-4">
                <p className="text-zarp-text font-semibold text-xs mb-2">Related Build Plans</p>
                <div className="space-y-1.5">
                  {["Therapy Pod AATCS-P1", "Scalar Biophoton Bed"].map(n => (
                    <Link key={n} to="/device-catalogue" className="block text-zarp-muted text-[11px] hover:text-zarp-gold transition-colors flex items-center gap-1">
                      <ChevronRight size={10} /> {n}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CertificateCard({ course }) {
  return (
    <div className="bg-gradient-to-br from-zarp-card to-zarp-bg border border-zarp-gold/30 rounded-xl p-5 text-center">
      <div className="w-12 h-12 rounded-full bg-zarp-gold/15 border border-zarp-gold/40 flex items-center justify-center mx-auto mb-3">
        <Award size={24} className="text-zarp-gold" />
      </div>
      <p className="text-zarp-text font-semibold text-sm mb-1">{course.title}</p>
      <p className="text-zarp-muted text-[10px] mb-3">Completed Aug 10, 2026</p>
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-zarp-gold/10 text-zarp-gold text-[10px] font-semibold hover:bg-zarp-gold/20 transition-colors border border-zarp-gold/30">
          <Download size={11} /> Certificate
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-zarp-elevated text-zarp-muted text-[10px] font-semibold hover:text-zarp-text transition-colors">
          <Share2 size={11} /> LinkedIn
        </button>
      </div>
    </div>
  );
}

export default function ResearchAcademy() {
  const { tier, loading } = useTier();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("All Courses");
  const [openCourse, setOpenCourse] = useState(null);

  const isPro = tier === "pro" || tier === "elite" || tier === "admin";
  const freeCourseLimit = 3;
  const freeCourseCount = COURSES.filter(c => c.tier === "FREE").length;

  const hasAccess = (course) => {
    if (course.tier === "FREE") return true;
    if (course.tier === "PRO") return isPro;
    if (course.tier === "ENTERPRISE") return tier === "elite" || tier === "admin";
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zarp-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zarp-border border-t-zarp-gold rounded-full animate-spin" />
      </div>
    );
  }

  const filteredCourses = activeTab === "All Courses"
    ? COURSES
    : COURSES.filter(c => c.domain === activeTab);

  const inProgress = COURSES.filter(c => c.progress > 0 && c.progress < 100);
  const completed = COURSES.filter(c => c.progress === 100);

  return (
    <div className="min-h-screen bg-zarp-bg text-zarp-text" style={{ fontFamily: 'Inter, sans-serif' }}>
      <DashboardSidebar user={{ full_name: "Researcher", role: "admin" }} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <div className={`transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-zarp-bg/80 backdrop-blur-xl border-b border-zarp-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Link to="/" className="text-zarp-muted hover:text-zarp-text transition-colors">Home</Link>
            <ChevronRight size={12} className="text-zarp-muted" />
            <span className="text-zarp-text font-semibold">Research Academy</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-wider bg-zarp-gold/15 text-zarp-gold border border-zarp-gold/30">
            {isPro ? "PRO ACCESS" : "EXPLORER · 3 FREE"}
          </span>
        </div>

        <div className="px-6 py-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-zarp-text mb-1" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Research Academy
            </h1>
            <p className="text-zarp-muted text-sm">Master the science behind the platform. Understand what you're building.</p>
          </div>

          {/* Featured banner */}
          <div className="mb-6 rounded-2xl overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.15) 0%, rgba(155, 48, 255, 0.1) 100%)' }}>
            <div className="absolute inset-0 border border-zarp-gold/30 rounded-2xl pointer-events-none" />
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-zarp-gold/20 text-zarp-gold border border-zarp-gold/40 mb-3">
                  ★ FEATURED
                </span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-zarp-text mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Multi-System Integration Masterclass
                </h2>
                <p className="text-zarp-muted text-sm mb-4 max-w-xl">
                  How to combine 5+ research modalities into a single coherent device architecture.
                </p>
                <div className="flex items-center gap-4 text-xs text-zarp-muted mb-4">
                  <span className="flex items-center gap-1"><BookOpen size={12} /> 6 Modules</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> 4.2 Hours</span>
                  <span className="flex items-center gap-1"><Award size={12} /> Certificate on Completion</span>
                </div>
                <button onClick={() => hasAccess(COURSES.find(c => c.featured)) && setOpenCourse(COURSES.find(c => c.featured))}
                  className="px-5 py-2.5 rounded-xl bg-zarp-bg text-zarp-gold border border-zarp-gold/40 text-sm font-bold hover:bg-zarp-elevated transition-colors">
                  Start Course →
                </button>
              </div>
              <div className="hidden md:flex w-32 h-32 rounded-2xl items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(201, 168, 76, 0.1)' }}>
                <Cpu size={48} className="text-zarp-gold" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Course library */}
            <div className="lg:col-span-3">
              {/* Tabs */}
              <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
                {DOMAINS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? "bg-zarp-gold/15 text-zarp-gold border border-zarp-gold/30"
                        : "text-zarp-muted hover:text-zarp-text border border-transparent"
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* Course grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCourses.map(c => (
                  <CourseCard key={c.id} course={c} onOpen={setOpenCourse} hasAccess={hasAccess(c)} />
                ))}
              </div>
            </div>

            {/* Sidebar: My Learning Dashboard */}
            <div className="lg:col-span-1 space-y-4">
              {/* Learning streak */}
              <div className="bg-zarp-card border border-zarp-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flame size={16} className="text-orange-400" />
                  <p className="text-zarp-text font-semibold text-sm">Learning Streak</p>
                </div>
                <p className="text-zarp-muted text-xs">🔥 7 day streak — keep going!</p>
              </div>

              {/* In progress */}
              <div className="bg-zarp-card border border-zarp-border rounded-xl p-4">
                <p className="text-zarp-text font-semibold text-sm mb-3">In Progress</p>
                {inProgress.length === 0 ? (
                  <p className="text-zarp-muted text-xs">No courses in progress.</p>
                ) : (
                  <div className="space-y-2">
                    {inProgress.map(c => (
                      <div key={c.id} className="cursor-pointer" onClick={() => hasAccess(c) && setOpenCourse(c)}>
                        <p className="text-zarp-text text-xs font-medium leading-tight">{c.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-1 flex-1 bg-zarp-elevated rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-zarp-blue to-zarp-gold" style={{ width: `${c.progress}%` }} />
                          </div>
                          <span className="text-zarp-gold text-[9px] font-bold">{c.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Completed certificates */}
              <div className="bg-zarp-card border border-zarp-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Award size={14} className="text-zarp-gold" />
                  <p className="text-zarp-text font-semibold text-sm">Certificates</p>
                </div>
                {completed.length === 0 ? (
                  <p className="text-zarp-muted text-xs">Complete a course to earn a certificate.</p>
                ) : (
                  <div className="space-y-2">
                    {completed.map(c => <CertificateCard key={c.id} course={c} />)}
                  </div>
                )}
              </div>

              {/* Recommended next */}
              <div className="bg-zarp-card border border-zarp-border rounded-xl p-4">
                <p className="text-zarp-text font-semibold text-sm mb-3">Recommended Next</p>
                <div onClick={() => hasAccess(COURSES[1]) && setOpenCourse(COURSES[1])}
                  className="cursor-pointer bg-zarp-elevated/50 rounded-lg p-3 hover:bg-zarp-elevated transition-colors">
                  <p className="text-zarp-text text-xs font-medium leading-tight">{COURSES[1].title}</p>
                  <p className="text-zarp-muted text-[10px] mt-1">Based on your activity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal footer */}
          <div className="mt-10 pt-6 border-t border-zarp-border">
            <p className="text-zarp-muted text-[10px] leading-relaxed text-center">
              ZARP Research Academy content is for educational and strategic planning purposes only. Nothing constitutes legal advice, medical advice, or investment advice. Course content describes historical and published research — ZARP does not validate or endorse underlying scientific claims.
              <br />© 2026 Aethon Apex IP Holdings LLC — Henderson, NV 89002.
            </p>
          </div>
        </div>
      </div>

      {/* Course detail overlay */}
      {openCourse && (
        <CourseDetail course={openCourse} onClose={() => setOpenCourse(null)} hasAccess={hasAccess(openCourse)} />
      )}
    </div>
  );
}