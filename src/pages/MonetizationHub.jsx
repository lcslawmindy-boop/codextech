import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { DOMAINS } from "@/lib/researchGraphData";
import {
  Zap, Cpu, BookOpen, Package, FileText, ShoppingCart, Users, Layers,
  TrendingUp, Lightbulb, ChevronRight, Sparkles, DollarSign, Heart, ArrowRight
} from "lucide-react";

// ── Monetization opportunity categories linking to existing pages ──────────
const CATEGORIES = [
  {
    title: "Build Plans & Engineering",
    icon: Cpu,
    color: "#1D6FA4",
    desc: "Ready-to-build device plans, BOMs, and exploded-view manuals for suppressed physics tech.",
    links: [
      { label: "Build Plans Marketplace", path: "/build-plans" },
      { label: "Invention Forge", path: "/invention-forge" },
      { label: "Build Plan Explorer", path: "/build-plan-explorer" },
      { label: "Invention Library", path: "/invention-library" },
      { label: "Build Supplies Shop", path: "/build-supplies-shop" },
    ],
  },
  {
    title: "Courses & Education",
    icon: BookOpen,
    color: "#9B30FF",
    desc: "Progressive learning paths across hidden physics domains with labs and certification.",
    links: [
      { label: "Course Catalogue", path: "/course-catalogue" },
      { label: "Course Catalog", path: "/courses" },
      { label: "Research Academy", path: "/research-academy" },
      { label: "My Learning", path: "/my-learning" },
      { label: "Hydromagnetopropulsion Course", path: "/hydromagnetopropulsion-course" },
    ],
  },
  {
    title: "Digital Products & Briefs",
    icon: Package,
    color: "#C9A84C",
    desc: "Research brief packs, technical blueprints, and downloadable intelligence deliverables.",
    links: [
      { label: "Technical Brief Packs", path: "/technical-brief-packs" },
      { label: "Research Brief Landing", path: "/research-brief" },
      { label: "Export Center", path: "/export-center" },
      { label: "Download Center", path: "/download-center" },
      { label: "My Library", path: "/my-library" },
    ],
  },
  {
    title: "IP & Patent Commercialization",
    icon: FileText,
    color: "#10B981",
    desc: "Patent drafting, FTO analysis, IP marketplace, and licensing monetization tools.",
    links: [
      { label: "Patent Hub", path: "/patent-hub" },
      { label: "Patent Drafting Wizard", path: "/patent-drafting-wizard" },
      { label: "Patent Intelligence", path: "/patent-intelligence" },
      { label: "IP Marketplace", path: "/ip-marketplace" },
      { label: "FTO Analysis", path: "/fto-analysis" },
      { label: "IP Portfolio Health", path: "/ip-portfolio-health" },
    ],
  },
  {
    title: "Kits & Physical Products",
    icon: ShoppingCart,
    color: "#EA580C",
    desc: "Component kits, EMF protection, and scalar lab starter packs shipped to builders.",
    links: [
      { label: "EMF Protection Shop", path: "/emf-shop" },
      { label: "Build Supplies Shop", path: "/build-supplies-shop" },
      { label: "Kit Bundles", path: "/kit-bundles" },
      { label: "Ala Carte Menu", path: "/alacarte" },
      { label: "Order Tracking", path: "/orders" },
    ],
  },
  {
    title: "Memberships & Subscriptions",
    icon: Users,
    color: "#7C3AED",
    desc: "Tiered research memberships, vault access, and recurring revenue streams.",
    links: [
      { label: "Research Membership", path: "/research-membership" },
      { label: "Vault Pricing", path: "/pricing-vault" },
      { label: "Member Vault", path: "/my-vault" },
      { label: "Pricing", path: "/pricing" },
      { label: "Advanced Engineering Bundle", path: "/advanced-engineering-bundle" },
    ],
  },
  {
    title: "Investor & Acquisition",
    icon: TrendingUp,
    color: "#0D9488",
    desc: "Investor packages, acquisition pipelines, and valuation tools for IP exit strategies.",
    links: [
      { label: "Investor Portal", path: "/investors" },
      { label: "Investor Package Builder", path: "/investor-package-builder" },
      { label: "Acquisition Package", path: "/zarp-acquisition" },
      { label: "Valuation Dashboard", path: "/valuation" },
      { label: "IP Broker", path: "/ip-broker" },
      { label: "Exit Advisor", path: "/exit-advisor" },
    ],
  },
  {
    title: "Licensing & Institutional",
    icon: Layers,
    color: "#DC2626",
    desc: "Institutional licensing, VDR data rooms, and enterprise technology transfer.",
    links: [
      { label: "Licensing Hub", path: "/licensing-hub" },
      { label: "Institutional Licensing", path: "/institutional-licensing" },
      { label: "Licensing Portal", path: "/licensing" },
      { label: "VDR Admin", path: "/vdr-admin" },
      { label: "White Label SaaS", path: "/white-label-saas" },
    ],
  },
];

export default function MonetizationHub() {
  const [packages, setPackages] = useState([]);
  const [stats, setStats] = useState({ total: 0, domains: 0 });

  useEffect(() => {
    base44.entities.CommercializationPackage.list("-created_date", 50)
      .then(items => {
        setPackages(items || []);
        const domainSet = new Set((items || []).map(p => p.domain).filter(Boolean));
        setStats({ total: (items || []).length, domains: domainSet.size });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-cyan-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(217,180,76,0.08),transparent_50%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center">
              <DollarSign className="text-amber-400" size={26} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
                Monetization Hub
              </h1>
              <p className="text-amber-400/80 text-xs font-mono uppercase tracking-wider">Commercialize Suppressed & Hidden Physics</p>
            </div>
          </div>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Every research page on this platform is a revenue channel. This hub surfaces all monetizable assets — build plans, courses, digital products, IP, kits, memberships, and investor tools — and lets you generate new commercialization packages from any suppressed physics topic.
          </p>

          {/* CTA to Commercialization Engine */}
          <Link
            to="/commercialization-engine"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-sm hover:bg-amber-300 transition-colors"
          >
            <Sparkles size={16} /> Open Commercialization Engine
            <ArrowRight size={14} />
          </Link>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6 max-w-md">
            <StatCard label="Categories" value={CATEGORIES.length} />
            <StatCard label="Revenue Pages" value={CATEGORIES.reduce((n, c) => n + c.links.length, 0)} />
            <StatCard label="Your Packages" value={stats.total} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Featured: Commercialization Engine */}
        <Link
          to="/commercialization-engine"
          className="block rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-slate-900/60 to-transparent p-6 hover:border-amber-400/60 transition-colors group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center flex-shrink-0">
              <Zap className="text-amber-400" size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-white font-bold text-lg">Commercialization Engine</h2>
                <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 text-[9px] font-bold uppercase">AI-Powered</span>
              </div>
              <p className="text-slate-400 text-sm">Turn any suppressed physics topic into a build plan, course, digital product, and pricing tiers — all generated from real patent and market research.</p>
            </div>
            <ChevronRight className="text-amber-400 group-hover:translate-x-1 transition-transform mt-3" size={20} />
          </div>
        </Link>

        {/* Category grid */}
        <div>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Monetization Categories</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <div key={cat.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cat.color + "15", border: `1px solid ${cat.color}40` }}>
                      <Icon size={18} style={{ color: cat.color }} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">{cat.title}</h3>
                      <p className="text-slate-500 text-xs mt-0.5">{cat.desc}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {cat.links.map(l => (
                      <Link
                        key={l.path}
                        to={l.path}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-950/40 border border-slate-800 text-[11px] text-slate-300 hover:border-amber-400/40 hover:text-amber-400 transition-colors"
                      >
                        <ChevronRight size={11} className="text-slate-600" />
                        <span className="truncate">{l.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Saved commercialization packages */}
        {packages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Your Generated Packages</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {packages.map(pkg => (
                <div key={pkg.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <p className="text-white text-sm font-bold leading-tight mb-1">{pkg.topic}</p>
                  <p className="text-slate-500 text-[10px]">{DOMAINS.find(d => d.id === pkg.domain)?.name || pkg.domain}</p>
                  {pkg.humanity_impact && (
                    <p className="text-slate-400 text-[11px] mt-2 line-clamp-3">{pkg.humanity_impact}</p>
                  )}
                  <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                    {pkg.build_plan && <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[9px]">Build</span>}
                    {pkg.course_outline && <span className="px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 text-[9px]">Course</span>}
                    {pkg.digital_product && <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px]">Product</span>}
                    {pkg.pricing_tiers?.length > 0 && <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px]">Pricing</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Humanity impact banner */}
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-6">
          <div className="flex items-start gap-3">
            <Heart className="text-emerald-400 mt-0.5" size={22} />
            <div>
              <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Advance Humanity</h3>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                Every commercialization package includes a humanity-impact assessment — ensuring suppressed and hidden physics research reaches the public in ways that improve health, energy independence, and consciousness research, not just revenue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-3">
      <p className="text-white text-xl font-bold">{value}</p>
      <p className="text-slate-500 text-[10px] uppercase">{label}</p>
    </div>
  );
}