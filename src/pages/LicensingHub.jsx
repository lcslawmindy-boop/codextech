import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase, FileText, Search, Mail, Package, ExternalLink,
  ChevronRight, Shield, Scale, BookOpen, DollarSign, GraduationCap,
  AlertTriangle, Lock, Plus, StickyNote, Calendar, ArrowRight
} from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useTier } from "@/hooks/useTier";

// ── Mock licensable assets (would pull from IP Portfolio Tracker) ───────────
const LICENSABLE_ASSETS = [
  {
    code: "ZAP-IP-014",
    name: "Multi-Modal Biofield-AI Fusion Engine",
    type: "Trade Secret Active",
    domain: "Bioelectromagnetics",
    industry: "Medical Device",
    readiness: 9,
    briefGenerated: true,
  },
  {
    code: "ZAP-IP-021",
    name: "Schumann-Tuned PEMF Waveform Protocol",
    type: "Claims Drafted",
    domain: "Scalar Science",
    industry: "Medical Device",
    readiness: 7,
    briefGenerated: false,
  },
  {
    code: "ZAP-IP-033",
    name: "Phase-Conjugate Scalar Coherence Array",
    type: "Trade Secret Active",
    domain: "Scalar Science",
    industry: "Defense",
    readiness: 8,
    briefGenerated: true,
  },
  {
    code: "ZAP-IP-041",
    name: "Vibroacoustic Trauma Release Protocol",
    type: "Claims Drafted",
    domain: "Acoustic Medicine",
    industry: "Medical Device",
    readiness: 6,
    briefGenerated: false,
  },
  {
    code: "ZAP-IP-052",
    name: "Hydrogen Inhalation Safety Interlock System",
    type: "Trade Secret Active",
    domain: "Device Engineering",
    industry: "Consumer",
    readiness: 8,
    briefGenerated: false,
  },
  {
    code: "ZAP-IP-067",
    name: "Closed-Loop Biometric Dosimetry Algorithm",
    type: "Claims Drafted",
    domain: "Software",
    industry: "Software",
    readiness: 9,
    briefGenerated: true,
  },
];

// ── Mock matched companies ──────────────────────────────────────────────────
const MATCHED_COMPANIES = [
  {
    name: "Medtronic plc",
    industry: "Medical Device",
    size: "Fortune 500",
    focus: "Neuromodulation, cardiac rhythm, surgical robotics",
    matchScore: 87,
    why: "Active in bioelectromagnetic device space, holds 14 patents in adjacent frequency therapy domain",
  },
  {
    name: "Baxter International",
    industry: "Medical Device",
    size: "Fortune 500",
    focus: "Renal care, medication delivery, connected care",
    matchScore: 74,
    why: "Expanding into closed-loop biometric systems for hospital environments",
  },
  {
    name: "LivaNova PLC",
    industry: "Medical Device",
    size: "Mid-market",
    focus: "Neuromodulation, cardiopulmonary, epilepsy VNS",
    matchScore: 91,
    why: "Core business is vagus nerve stimulation — direct adjacency to PEMF protocol portfolio",
  },
  {
    name: "Axonics Modulation",
    industry: "Medical Device",
    size: "SME",
    focus: "Sacral neuromodulation, implantable pulse generators",
    matchScore: 82,
    why: "Specializes in implantable EM devices — waveform protocol licensing is a natural fit",
  },
  {
    name: "OmniPEMF Therapeutics",
    industry: "Medical Device",
    size: "Startup",
    focus: "PEMF wellness devices, clinical trials pipeline",
    matchScore: 95,
    why: "Pure-play PEMF company actively seeking differentiated waveform IP for clinical pipeline",
  },
  {
    name: "Lockheed Martin Health",
    industry: "Defense",
    size: "Fortune 500",
    focus: "Defense health systems, TBI recovery, field medicine",
    matchScore: 79,
    why: "DoD TBI recovery programs align with scalar coherence and PTSD protocol assets",
  },
];

// ── Pipeline data ───────────────────────────────────────────────────────────
const PIPELINE_COLUMNS = [
  { id: "not_contacted", label: "Not Contacted", color: "#8B9AB0" },
  { id: "brief_sent", label: "Brief Sent", color: "#1D6FA4" },
  { id: "in_conversation", label: "In Conversation", color: "#C9A84C" },
  { id: "nda_signed", label: "NDA Signed", color: "#9B30FF" },
  { id: "negotiating", label: "Deal Negotiating", color: "#F59E0B" },
  { id: "licensed", label: "Licensed ✓", color: "#10B981" },
  { id: "declined", label: "Declined ✗", color: "#EF4444" },
];

const PIPELINE_CARDS = [
  { company: "OmniPEMF Therapeutics", asset: "Schumann PEMF Protocol", stage: "not_contacted", lastContact: "—", nextAction: "Send cold email", dueDate: "Aug 14" },
  { company: "LivaNova PLC", asset: "Biofield-AI Fusion Engine", stage: "brief_sent", lastContact: "Aug 8", nextAction: "Follow up call", dueDate: "Aug 16" },
  { company: "Axonics Modulation", asset: "Vibroacoustic TRP", stage: "in_conversation", lastContact: "Aug 6", nextAction: "Schedule technical review", dueDate: "Aug 18" },
  { company: "Medtronic plc", asset: "Scalar Coherence Array", stage: "nda_signed", lastContact: "Aug 3", nextAction: "Share full documentation", dueDate: "Aug 15" },
  { company: "Lockheed Martin Health", asset: "Biofield-AI Fusion Engine", stage: "negotiating", lastContact: "Jul 30", nextAction: "Counter royalty terms", dueDate: "Aug 20" },
  { company: "Baxter International", asset: "Biometric Dosimetry", stage: "licensed", lastContact: "Jul 22", nextAction: "Quarterly royalty audit", dueDate: "Oct 22" },
  { company: "Nevro Corp", asset: "Hydrogen Interlock", stage: "declined", lastContact: "Jul 15", nextAction: "Revisit Q1 2027", dueDate: "—" },
];

// ── Resources ──────────────────────────────────────────────────────────────
const RESOURCES = [
  { icon: <Shield size={18} />, title: "NDA Template", desc: "Standard mutual non-disclosure agreement for licensing discussions", color: "#1D6FA4" },
  { icon: <FileText size={18} />, title: "LOI Template", desc: "Letter of Intent framework for formal licensing discussions", color: "#C9A84C" },
  { icon: <Scale size={18} />, title: "Licensing Agreement Framework", desc: "Structure guide for licensing deals — NOT legal advice", color: "#9B30FF" },
  { icon: <Mail size={18} />, title: "Cold Outreach Email Templates", desc: "5 proven scenarios for licensing cold outreach", color: "#10B981" },
  { icon: <DollarSign size={18} />, title: "Royalty Rate Reference", desc: "Industry benchmarks for royalty rates by sector", color: "#F59E0B" },
  { icon: <GraduationCap size={18} />, title: "How Licensing Works", desc: "Fundamentals course in the Research Academy", color: "#06b6d4" },
];

const TYPE_COLORS = {
  "Trade Secret Active": { bg: "rgba(155, 48, 255, 0.15)", text: "#C084FC", border: "rgba(155, 48, 255, 0.3)" },
  "Claims Drafted": { bg: "rgba(29, 111, 164, 0.15)", text: "#60A5FA", border: "rgba(29, 111, 164, 0.3)" },
};

const INDUSTRY_COLORS = {
  "Medical Device": "#10B981",
  "Defense": "#F59E0B",
  "Consumer": "#06b6d4",
  "Ag": "#84CC16",
  "Software": "#9B30FF",
};

function UpgradePrompt() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-zarp-card border border-zarp-gold/30 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-zarp-gold/10 border border-zarp-gold/30 flex items-center justify-center mx-auto mb-4">
          <Lock size={28} className="text-zarp-gold" />
        </div>
        <h2 className="font-display text-xl font-bold text-zarp-text mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          Enterprise Feature
        </h2>
        <p className="text-zarp-muted text-sm mb-6 leading-relaxed">
          The Licensing Hub connects your IP portfolio to companies ready to manufacture it.
          Upgrade to Enterprise to unlock company matching, outreach tracking, and licensing resources.
        </p>
        <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zarp-gold text-zarp-bg font-bold text-sm hover:opacity-90 transition-opacity">
          Upgrade to Enterprise <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function AssetCard({ asset, onFindCompanies }) {
  const typeColor = TYPE_COLORS[asset.type];
  return (
    <div className="bg-zarp-card border border-zarp-border rounded-xl p-5 hover:border-zarp-gold/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-zarp-muted text-[10px] font-mono">{asset.code}</p>
          <h3 className="text-zarp-text font-semibold text-sm mt-0.5 leading-tight">{asset.name}</h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[9px] font-bold border whitespace-nowrap"
          style={{ backgroundColor: typeColor.bg, color: typeColor.text, borderColor: typeColor.border }}>
          {asset.type}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="px-2 py-0.5 rounded-full text-[10px] bg-zarp-elevated text-zarp-muted">{asset.domain}</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ backgroundColor: `${INDUSTRY_COLORS[asset.industry]}20`, color: INDUSTRY_COLORS[asset.industry] }}>
          {asset.industry}
        </span>
      </div>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-zarp-muted text-[10px] uppercase tracking-wider">Licensing Readiness</span>
          <span className="text-zarp-gold font-bold text-xs">{asset.readiness}/10</span>
        </div>
        <div className="h-1.5 bg-zarp-elevated rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-zarp-blue to-zarp-gold"
            style={{ width: `${asset.readiness * 10}%` }} />
        </div>
      </div>
      <div className="flex gap-2">
        {asset.briefGenerated ? (
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zarp-elevated text-zarp-text text-xs font-semibold hover:bg-zarp-border transition-colors">
            <FileText size={12} /> View Brief
          </button>
        ) : (
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zarp-gold/10 text-zarp-gold text-xs font-semibold hover:bg-zarp-gold/20 transition-colors border border-zarp-gold/30">
            <Plus size={12} /> Generate Brief
          </button>
        )}
        <button onClick={() => onFindCompanies(asset)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zarp-blue/10 text-zarp-blue text-xs font-semibold hover:bg-zarp-blue/20 transition-colors border border-zarp-blue/30">
          <Search size={12} /> Find Companies
        </button>
      </div>
    </div>
  );
}

function CompanyCard({ company }) {
  return (
    <div className="bg-zarp-card border border-zarp-border rounded-xl p-5 hover:border-zarp-blue/30 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-zarp-elevated border border-zarp-border flex items-center justify-center flex-shrink-0">
          <Briefcase size={16} className="text-zarp-muted" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-zarp-text font-semibold text-sm truncate">{company.name}</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-zarp-gold/15 text-zarp-gold border border-zarp-gold/30 whitespace-nowrap">
              {company.matchScore}% match
            </span>
          </div>
          <p className="text-zarp-muted text-[10px] mt-0.5">{company.industry} · {company.size}</p>
        </div>
      </div>
      <p className="text-zarp-muted text-[11px] mb-2 leading-relaxed">
        <span className="text-zarp-text/70 font-semibold">Focus:</span> {company.focus}
      </p>
      <div className="bg-zarp-elevated/50 border border-zarp-border rounded-lg p-2.5 mb-3">
        <p className="text-zarp-text/80 text-[11px] leading-relaxed">
          <span className="text-zarp-blue font-semibold">Why they match:</span> {company.why}
        </p>
      </div>
      <div className="flex gap-1.5">
        <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-zarp-blue/10 text-zarp-blue text-[10px] font-semibold hover:bg-zarp-blue/20 transition-colors border border-zarp-blue/30">
          <Mail size={11} /> Email
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-zarp-gold/10 text-zarp-gold text-[10px] font-semibold hover:bg-zarp-gold/20 transition-colors border border-zarp-gold/30">
          <Package size={11} /> Package
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-zarp-elevated text-zarp-muted text-[10px] font-semibold hover:text-zarp-text transition-colors">
          <ExternalLink size={11} /> Profile
        </button>
      </div>
    </div>
  );
}

function PipelineCard({ card }) {
  return (
    <div className="bg-zarp-card border border-zarp-border rounded-lg p-3 mb-2 hover:border-zarp-blue/30 transition-colors">
      <p className="text-zarp-text text-xs font-semibold leading-tight">{card.company}</p>
      <p className="text-zarp-muted text-[10px] mt-0.5 truncate">{card.asset}</p>
      <div className="flex items-center gap-2 mt-2 text-[9px] text-zarp-muted">
        <span>Last: {card.lastContact}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-[9px] text-zarp-gold flex items-center gap-1">
          <Calendar size={9} /> {card.nextAction}
        </span>
        <span className="text-[9px] text-zarp-muted ml-auto">{card.dueDate}</span>
      </div>
      <div className="flex gap-1 mt-2 pt-2 border-t border-zarp-border">
        <button className="flex-1 text-[9px] py-1 rounded bg-zarp-elevated text-zarp-muted hover:text-zarp-text transition-colors">Update</button>
        <button className="flex-1 text-[9px] py-1 rounded bg-zarp-elevated text-zarp-muted hover:text-zarp-text transition-colors">Note</button>
        <button className="flex-1 text-[9px] py-1 rounded bg-zarp-elevated text-zarp-muted hover:text-zarp-text transition-colors">Follow-up</button>
      </div>
    </div>
  );
}

export default function LicensingHub() {
  const { tier, loading } = useTier();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeSection, setActiveSection] = useState("assets");

  const isEnterprise = tier === "pro" || tier === "elite" || tier === "admin";

  if (loading) {
    return (
      <div className="min-h-screen bg-zarp-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zarp-border border-t-zarp-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zarp-bg text-zarp-text" style={{ fontFamily: 'Inter, sans-serif' }}>
      <DashboardSidebar user={{ full_name: "Researcher", role: "admin" }} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <div className={`transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-zarp-bg/80 backdrop-blur-xl border-b border-zarp-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Link to="/" className="text-zarp-muted hover:text-zarp-text transition-colors">Home</Link>
            <ChevronRight size={12} className="text-zarp-muted" />
            <span className="text-zarp-text font-semibold">Licensing Hub</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-wider bg-zarp-violet/15 text-zarp-violet border border-zarp-violet/30">
            ENTERPRISE
          </span>
        </div>

        {!isEnterprise ? (
          <UpgradePrompt />
        ) : (
          <div className="px-6 py-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="font-display text-2xl font-bold text-zarp-text mb-1" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Licensing Hub
              </h1>
              <p className="text-zarp-muted text-sm">Connect your IP to the companies already built to manufacture it.</p>
            </div>

            {/* Section nav */}
            <div className="flex gap-1 mb-6 bg-zarp-card border border-zarp-border rounded-xl p-1 overflow-x-auto">
              {[
                { id: "assets", label: "My Licensable Assets", icon: <Briefcase size={14} /> },
                { id: "match", label: "Company Match Finder", icon: <Search size={14} /> },
                { id: "tracker", label: "Outreach Tracker", icon: <FileText size={14} /> },
                { id: "resources", label: "Resources", icon: <BookOpen size={14} /> },
              ].map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeSection === s.id ? "bg-zarp-gold/15 text-zarp-gold" : "text-zarp-muted hover:text-zarp-text"
                  }`}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>

            {/* Section 1: Assets */}
            {activeSection === "assets" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-bold text-zarp-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    My Licensable Assets
                  </h2>
                  <span className="text-zarp-muted text-xs">{LICENSABLE_ASSETS.length} assets ready</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {LICENSABLE_ASSETS.map(a => (
                    <AssetCard key={a.code} asset={a} onFindCompanies={(asset) => { setSelectedAsset(asset); setActiveSection("match"); }} />
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: Company Match Finder */}
            {activeSection === "match" && (
              <div>
                <h2 className="font-display text-lg font-bold text-zarp-text mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Company Match Finder
                </h2>
                {/* Filters */}
                <div className="bg-zarp-card border border-zarp-border rounded-xl p-4 mb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-zarp-muted text-[10px] uppercase tracking-wider mb-1.5">Select Asset</label>
                    <select className="w-full bg-zarp-elevated border border-zarp-border rounded-lg px-3 py-2 text-zarp-text text-xs focus:outline-none focus:border-zarp-gold/50">
                      {LICENSABLE_ASSETS.map(a => <option key={a.code} value={a.code}>{a.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-zarp-muted text-[10px] uppercase tracking-wider mb-1.5">Target Industry</label>
                    <select className="w-full bg-zarp-elevated border border-zarp-border rounded-lg px-3 py-2 text-zarp-text text-xs focus:outline-none focus:border-zarp-gold/50">
                      <option>Medical Device</option><option>Defense</option><option>Consumer</option><option>Software</option><option>All</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zarp-muted text-[10px] uppercase tracking-wider mb-1.5">Deal Type</label>
                    <select className="w-full bg-zarp-elevated border border-zarp-border rounded-lg px-3 py-2 text-zarp-text text-xs focus:outline-none focus:border-zarp-gold/50">
                      <option>Royalty</option><option>Upfront</option><option>Equity</option><option>Co-development</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zarp-muted text-[10px] uppercase tracking-wider mb-1.5">Company Size</label>
                    <select className="w-full bg-zarp-elevated border border-zarp-border rounded-lg px-3 py-2 text-zarp-text text-xs focus:outline-none focus:border-zarp-gold/50">
                      <option>Any</option><option>Startup</option><option>SME</option><option>Mid-market</option><option>Enterprise</option><option>Fortune 500</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MATCHED_COMPANIES.map(c => <CompanyCard key={c.name} company={c} />)}
                </div>
              </div>
            )}

            {/* Section 3: Outreach Tracker */}
            {activeSection === "tracker" && (
              <div>
                <h2 className="font-display text-lg font-bold text-zarp-text mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Licensing Outreach Tracker
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-4">
                  {PIPELINE_COLUMNS.map(col => (
                    <div key={col.id} className="min-w-[220px] flex-1">
                      <div className="flex items-center gap-2 mb-3 px-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                        <span className="text-zarp-text text-xs font-bold">{col.label}</span>
                        <span className="text-zarp-muted text-[10px] ml-auto">
                          {PIPELINE_CARDS.filter(c => c.stage === col.id).length}
                        </span>
                      </div>
                      <div className="bg-zarp-bg/50 border border-zarp-border rounded-xl p-2 min-h-[100px]">
                        {PIPELINE_CARDS.filter(c => c.stage === col.id).map(card => (
                          <PipelineCard key={card.company} card={card} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Resources */}
            {activeSection === "resources" && (
              <div>
                <h2 className="font-display text-lg font-bold text-zarp-text mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Licensing Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                  {RESOURCES.map(r => (
                    <div key={r.title} className="bg-zarp-card border border-zarp-border rounded-xl p-5 hover:border-zarp-gold/30 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                        style={{ backgroundColor: `${r.color}15`, border: `1px solid ${r.color}30` }}>
                        <span style={{ color: r.color }}>{r.icon}</span>
                      </div>
                      <h3 className="text-zarp-text font-semibold text-sm mb-1">{r.title}</h3>
                      <p className="text-zarp-muted text-xs leading-relaxed">{r.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 flex gap-3">
                  <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-200/80 text-xs leading-relaxed">
                    <span className="font-bold text-amber-300">Disclaimer:</span> Templates and resources provided are for reference only and do not constitute legal advice. All licensing agreements must be reviewed by a licensed attorney before execution.
                  </p>
                </div>
              </div>
            )}

            {/* Legal footer */}
            <div className="mt-10 pt-6 border-t border-zarp-border">
              <p className="text-zarp-muted text-[10px] leading-relaxed text-center">
                ZARP Licensing Hub content is for educational and strategic planning purposes only. Nothing constitutes legal advice, medical advice, or investment advice. Licensing templates require attorney review before use.
                <br />© 2026 Aethon Apex IP Holdings LLC — Henderson, NV 89002.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}