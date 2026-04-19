import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight, Star, Zap, Shield, BookOpen, FlaskConical, Brain, FileText, Users, ArrowRight, Sparkles, Globe, Target, TrendingUp, Microscope, DollarSign } from "lucide-react";

const FEATURES = [
  {
    icon: "⚡",
    title: "AI Invention Engine",
    path: "/inventor-forge",
    badge: "Most Popular",
    badgeColor: "text-yellow-400 bg-yellow-900/30 border-yellow-700",
    desc: "Generate fully-formed invention dossiers — technical specs, IP valuation, 5-year financials, and GTM strategy — from a single prompt. No engineering background required.",
    tier: "Researcher $97/mo",
  },
  {
    icon: "📋",
    title: "AI Patent Drafting Tool",
    path: "/patent-tool",
    badge: "Pro Tool",
    badgeColor: "text-blue-400 bg-blue-900/30 border-blue-700",
    desc: "USPTO-compliant patent drafting with claim generation, novelty scoring, prior art analysis, and multi-jurisdiction IP valuation in one workflow.",
    tier: "Researcher $97/mo",
  },
  {
    icon: "🔬",
    title: "23 Device Build Plans",
    path: "/invention-plans",
    badge: "Exclusive",
    badgeColor: "text-purple-400 bg-purple-900/30 border-purple-700",
    desc: "Step-by-step hardware blueprints for scalar EM, vacuum energy, bioelectromagnetic, and advanced sensing devices — each with full Bill of Materials and downloadable PDFs.",
    tier: "Researcher $97/mo",
  },
  {
    icon: "📚",
    title: "26-Course Library",
    path: "/courses",
    badge: "Growing",
    badgeColor: "text-green-400 bg-green-900/30 border-green-700",
    desc: "Structured learning from IP strategy and patent law to scalar electromagnetics, research-to-revenue workflows, and advanced device physics. New content monthly.",
    tier: "Researcher $97/mo",
  },
  {
    icon: "🧠",
    title: "AI Research Assistant",
    path: "/ai-research",
    badge: "AI-Powered",
    badgeColor: "text-cyan-400 bg-cyan-900/30 border-cyan-700",
    desc: "Ask any research question and get deep, cited answers sourced from the full Bearden scalar EM archive, patent databases, and peer-reviewed literature.",
    tier: "Researcher $97/mo",
  },
  {
    icon: "🗺️",
    title: "Concept Knowledge Graph",
    path: "/",
    badge: "Free",
    badgeColor: "text-gray-400 bg-gray-800 border-gray-600",
    desc: "Interactive network map of 200+ interconnected scalar EM, bioelectromagnetics, and free energy concepts — click any node to explore deep research connections.",
    tier: "Free with trial",
  },
  {
    icon: "📜",
    title: "Prior Art Archive",
    path: "/prior-art",
    badge: "200+ Entries",
    badgeColor: "text-orange-400 bg-orange-900/30 border-orange-700",
    desc: "Searchable database of documented historical inventions — successes, failures, patents granted/denied, suppression records, and key claims. Essential for novelty analysis.",
    tier: "Researcher $97/mo",
  },
  {
    icon: "💼",
    title: "Investor CRM & Pitch Builder",
    path: "/investor-crm",
    badge: "Pro",
    badgeColor: "text-indigo-400 bg-indigo-900/30 border-indigo-700",
    desc: "Full investor pipeline management, VC pitch deck builder, outreach tracking, meeting scheduler, and AI-generated investor emails — all in one place.",
    tier: "Researcher $97/mo",
  },
  {
    icon: "🏛️",
    title: "Virtual Data Room (VDR)",
    path: "/vdr-admin",
    badge: "Pro",
    badgeColor: "text-indigo-400 bg-indigo-900/30 border-indigo-700",
    desc: "Secure NDA-gated document sharing portal for buyers and investors. Upload IP documents, grant folder-level access, and track engagement analytics.",
    tier: "Pro $247/mo",
  },
  {
    icon: "⚖️",
    title: "FTO Analysis Tool",
    path: "/fto-analysis",
    badge: "IP Tool",
    badgeColor: "text-red-400 bg-red-900/30 border-red-700",
    desc: "Freedom-to-Operate analysis to identify patent landscape blockers before commercializing your invention. Protect your IP position from day one.",
    tier: "Researcher $97/mo",
  },
  {
    icon: "🌊",
    title: "Scalar Wave Simulator",
    path: "/scalar-wave-sim",
    badge: "Lab",
    badgeColor: "text-cyan-400 bg-cyan-900/30 border-cyan-700",
    desc: "Real-time interactive simulation of scalar EM fields, wave interference patterns, and phase conjugation effects — visualize the physics behind every device.",
    tier: "Researcher $97/mo",
  },
  {
    icon: "📡",
    title: "Patent Intelligence Monitor",
    path: "/patent-intelligence",
    badge: "Live Data",
    badgeColor: "text-yellow-400 bg-yellow-900/30 border-yellow-700",
    desc: "Track new patent filings in your technology domains, get alerts on competitor activity, and monitor the global scalar EM patent landscape in real time.",
    tier: "Researcher $97/mo",
  },
  {
    icon: "🏗️",
    title: "Provisional Patent Wizard",
    path: "/provisional-patent",
    badge: "Legal",
    badgeColor: "text-blue-400 bg-blue-900/30 border-blue-700",
    desc: "Generate USPTO 35 USC 111(b) compliant provisional patent applications with AI-assisted claim drafting, drawings descriptions, and formal legal language.",
    tier: "Researcher $97/mo",
  },
  {
    icon: "🛒",
    title: "Build Supplies Shop",
    path: "/build-supplies-shop",
    badge: "New",
    badgeColor: "text-green-400 bg-green-900/30 border-green-700",
    desc: "Pre-sourced component kits for every device build plan — order exact parts bundles and start building immediately without the sourcing research.",
    tier: "All members",
  },
  {
    icon: "📊",
    title: "IP Portfolio Health",
    path: "/ip-portfolio-health",
    badge: "Analytics",
    badgeColor: "text-purple-400 bg-purple-900/30 border-purple-700",
    desc: "Track the health, coverage gaps, expiration risks, and commercialization readiness of your full intellectual property portfolio in one dashboard.",
    tier: "Researcher $97/mo",
  },
  {
    icon: "🤝",
    title: "Co-Inventor Matching",
    path: "/co-inventor-matching",
    badge: "Network",
    badgeColor: "text-pink-400 bg-pink-900/30 border-pink-700",
    desc: "Find co-inventors, engineering partners, and technical collaborators aligned with your invention category, skill requirements, and development stage.",
    tier: "Researcher $97/mo",
  },
];

const HOW_TO_START = [
  { step: "01", title: "Read the NDA & Gain Access", desc: "Accept the platform NDA on entry. Your 24-hour explorer pass activates immediately — explore the knowledge graph and first build plan free.", icon: Shield },
  { step: "02", title: "Explore the Concept Graph", desc: "Start at the homepage. The interactive knowledge graph shows every research concept and how they connect. Click any node to drill into primary sources.", icon: Globe },
  { step: "03", title: "Browse the Prior Art Archive", desc: "Before building or filing, search 200+ documented historical devices at /prior-art. Understand what worked, what failed, and what's patentable.", icon: BookOpen },
  { step: "04", title: "Pick a Device & Study the Build Plan", desc: "Go to Invention Plans. Study the Bill of Materials, step-by-step assembly guide, and technical overview for the device you want to build.", icon: FlaskConical },
  { step: "05", title: "Run the AI Research Assistant", desc: "Ask any question at /ai-research. Get deep answers with citations from the full Bearden archive, patents, and peer-reviewed papers — instantly.", icon: Brain },
  { step: "06", title: "Draft Your Patent with AI", desc: "Use the Patent Drafting Tool at /patent-tool. Select your invention, configure jurisdictions, and generate a full USPTO-compliant provisional in minutes.", icon: FileText },
  { step: "07", title: "Build Your Investor Package", desc: "Use the Pitch Builder, Investor CRM, and VDR Portal to prepare for fundraising or acquisition. Everything from deck to term sheet in one workflow.", icon: DollarSign },
];

const WHY_97 = [
  { icon: Zap, label: "Unlimited AI Invention Generation", value: "vs $5,000+ per invention with consultants" },
  { icon: FileText, label: "Unlimited Patent Drafting", value: "vs $3,000–$15,000 per attorney-drafted application" },
  { icon: FlaskConical, label: "All 23 Device Build Plans (PDF)", value: "vs $500–$2,000 per individual dossier" },
  { icon: BookOpen, label: "Full 26-Course Library", value: "vs $200–$500 per course elsewhere" },
  { icon: Microscope, label: "EM Lab Simulators", value: "Exclusive — not available anywhere else" },
  { icon: Target, label: "Prior Art Archive (200+ entries)", value: "vs $500+ per professional prior art search" },
  { icon: TrendingUp, label: "IP Portfolio Health Dashboard", value: "vs $1,000+/mo with an IP management firm" },
  { icon: Users, label: "Co-Inventor & Partner Matching", value: "Exclusive to ZARP members" },
];

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(14,165,233,0.08) 0%, transparent 70%)" }} />
        <div className="max-w-5xl mx-auto px-5 py-16 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-xs font-black mb-6 uppercase tracking-widest">
            <Sparkles size={11} /> Welcome to ZARP — Your Complete Platform Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Everything You Need to Know<br />
            <span className="text-cyan-400">to Get the Most Out of ZARP</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            The Zenith Apex Research Portfolio is an AI-native operating system for invention, IP creation, and commercialization. Here's your complete map of every tool, where to find it, and how to use it.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/pricing"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm bg-cyan-700 hover:bg-cyan-600 text-white transition-all shadow-[0_4px_20px_rgba(14,165,233,0.3)]">
              Start $97/mo — Unlock Everything <ArrowRight size={14} />
            </Link>
            <Link to="/"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm border border-gray-700 text-gray-300 hover:border-gray-500 transition-all">
              Explore the Platform →
            </Link>
          </div>
        </div>
      </div>

      {/* How to Get Started */}
      <div className="max-w-4xl mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <h2 className="text-white font-black text-2xl mb-2">How to Get Started — Step by Step</h2>
          <p className="text-gray-500 text-sm">Follow this path to go from new member to active inventor in your first week.</p>
        </div>
        <div className="space-y-4">
          {HOW_TO_START.map((item, i) => (
            <div key={i} className="flex gap-5 items-start bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center">
                <item.icon size={20} className="text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-cyan-600 font-mono text-xs font-black">STEP {item.step}</span>
                  <h3 className="text-white font-black text-base">{item.title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
              <ChevronRight size={16} className="text-gray-700 flex-shrink-0 mt-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Everything the Platform Offers */}
      <div className="border-t border-gray-800 bg-gray-900/30 px-5 py-14">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-white font-black text-2xl mb-2">Every Tool on the Platform</h2>
            <p className="text-gray-500 text-sm">Click any card to navigate directly to that section.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <Link key={i} to={f.path}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition-all group flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{f.icon}</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-lg border ${f.badgeColor}`}>{f.badge}</span>
                </div>
                <div>
                  <h3 className="text-white font-black text-sm mb-1 group-hover:text-cyan-300 transition-colors">{f.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-gray-700 text-xs">{f.tier}</span>
                  <ChevronRight size={13} className="text-gray-700 group-hover:text-cyan-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Why $97/mo */}
      <div className="max-w-4xl mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <h2 className="text-white font-black text-2xl mb-2">Why $97/mo Is the Best Investment You'll Make</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">Compare what you get on the platform vs. what it would cost to replicate outside of it.</p>
        </div>
        <div className="bg-gray-900 border border-cyan-900/50 rounded-2xl overflow-hidden mb-8">
          <div className="bg-cyan-950/40 border-b border-cyan-900/40 px-6 py-4 flex items-center gap-3">
            <Sparkles size={16} className="text-cyan-400" />
            <p className="text-cyan-300 font-black text-sm">Researcher Plan — $97/mo — What You Actually Get</p>
          </div>
          <div className="divide-y divide-gray-800">
            {WHY_97.map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <item.icon size={16} className="text-cyan-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.value}</p>
                </div>
                <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
              </div>
            ))}
          </div>
          <div className="px-6 py-5 bg-gray-800/40 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-gray-400 text-xs mb-1">Total value if purchased separately</p>
              <p className="text-white font-black text-2xl">$30,000+ <span className="text-gray-600 text-base font-normal">/ year</span></p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs mb-1">Your cost on ZARP</p>
              <p className="text-cyan-400 font-black text-2xl">$1,164 <span className="text-gray-500 text-base font-normal">/ year</span></p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-cyan-800/50 rounded-2xl p-8 text-center">
          <div className="flex gap-0.5 justify-center mb-3">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />)}
          </div>
          <h3 className="text-white font-black text-xl mb-3">
            Join the AI Operating System for Global R&D
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto mb-6">
            More inventions → more data → exponentially more powerful system. Every member makes the platform smarter. Lock in your founding member rate before pricing increases.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/pricing"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base text-black bg-gradient-to-r from-cyan-400 to-green-400 hover:opacity-90 transition-all shadow-[0_4px_24px_rgba(14,165,233,0.4)] w-full sm:w-auto justify-center">
              <Zap size={16} /> Start Researcher — $97/mo
            </Link>
            <Link to="/beta-apply"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base border border-gray-700 text-gray-300 hover:border-gray-500 transition-all w-full sm:w-auto justify-center">
              Apply for Founding Access
            </Link>
          </div>
          <p className="text-gray-600 text-xs mt-4">🔒 Secured by Stripe · Cancel anytime · Instant access after payment</p>
        </div>
      </div>

      {/* Quick Nav Links */}
      <div className="border-t border-gray-800 bg-gray-900/40 px-5 py-10">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest text-center mb-6">Quick Navigation — Jump to Any Section</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Knowledge Graph", path: "/" },
              { label: "Invention Plans", path: "/invention-plans" },
              { label: "Course Library", path: "/courses" },
              { label: "AI Research", path: "/ai-research" },
              { label: "Patent Drafting", path: "/patent-tool" },
              { label: "Prior Art Archive", path: "/prior-art" },
              { label: "Inventor Forge", path: "/inventor-forge" },
              { label: "Investor CRM", path: "/investor-crm" },
              { label: "Pitch Builder", path: "/pitch" },
              { label: "Scalar Simulator", path: "/scalar-wave-sim" },
              { label: "Build Supplies Shop", path: "/build-supplies-shop" },
              { label: "FTO Analysis", path: "/fto-analysis" },
              { label: "Co-Inventor Matching", path: "/co-inventor-matching" },
              { label: "IP Portfolio Health", path: "/ip-portfolio-health" },
              { label: "Patent Intelligence", path: "/patent-intelligence" },
              { label: "Glossary", path: "/glossary" },
              { label: "Pricing & Plans", path: "/pricing" },
              { label: "Account Settings", path: "/account" },
            ].map((item, i) => (
              <Link key={i} to={item.path}
                className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 text-xs font-semibold transition-all">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}