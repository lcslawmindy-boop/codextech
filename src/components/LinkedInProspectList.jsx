import { useState } from "react";
import { Copy, Check, Loader2, Search, Users, Filter } from "lucide-react";
import { base44 } from "@/api/base44Client";

const PROSPECT_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "investor", label: "Investors / VCs" },
  { id: "defense", label: "Defense / Gov" },
  { id: "biotech", label: "Biotech / Pharma" },
  { id: "engineer", label: "Engineers / Makers" },
  { id: "attorney", label: "IP Attorneys" },
  { id: "academic", label: "Academics" },
];

const PROSPECTS = [
  // Investors / VCs
  { id: 1, name: "Vijay Pande", title: "General Partner, a16z Bio", org: "Andreessen Horowitz", category: "investor", why: "Leads biotech + longevity thesis. Invested in Nura Health, Hims. Bearden's MCCS protocol maps directly to his biofield research interest.", profile: "https://linkedin.com/in/vijaypande", urgency: "high" },
  { id: 2, name: "Laura Deming", title: "Founder, Longevity Fund", org: "Longevity Fund", category: "investor", why: "Dedicated longevity VC. Telomere regeneration devices are her core thesis. Direct alignment with TRD-1 IP.", profile: "https://linkedin.com/in/laurademing", urgency: "high" },
  { id: 3, name: "Peter Thiel", title: "Founder, Founders Fund", org: "Founders Fund", category: "investor", why: "Invests in 'secrets' — unconventional tech mainstream overlooks. Scalar EM IP is exactly that thesis. Backed Palantir, SpaceX.", profile: "https://linkedin.com/in/peterthiel", urgency: "medium" },
  { id: 4, name: "Jim Breyer", title: "Founder, Breyer Capital", org: "Breyer Capital", category: "investor", why: "Mixes defense + biotech investments. DARPA-adjacent portfolio. Scalar EM sensors and bioelectromagnetics dual-use case.", profile: "https://linkedin.com/in/jimbreyer", urgency: "medium" },
  { id: 5, name: "Cathie Wood", title: "CEO/CIO, ARK Invest", org: "ARK Invest", category: "investor", why: "Invests in disruptive science (genomics, energy storage). MEG and longevity devices are near-future disruptors in her model.", profile: "https://linkedin.com/in/cathiewood", urgency: "medium" },
  { id: 6, name: "Bryan Johnson", title: "Founder, Kernel / OS Fund", org: "OS Fund", category: "investor", why: "Funds breakthrough science outside mainstream. Paid $100M for Blueprint longevity protocol. TRD-1 telomere device is a natural pitch.", profile: "https://linkedin.com/in/bryanjohnson_", urgency: "high" },

  // Defense / Gov
  { id: 7, name: "Heidi Shyu", title: "Former USD(R&E), DoD", org: "US Department of Defense", category: "defense", why: "Oversees DARPA, R&E budget. Scalar EM sensors for EW applications fall under her mandate. Post-DoD, she's on multiple defense boards.", profile: "https://linkedin.com/in/heidishyu", urgency: "medium" },
  { id: 8, name: "Michael Griffin", title: "Former USD(R&E), Advisor", org: "Defense Advanced Research", category: "defense", why: "Former NASA Administrator + DoD. Deep interest in propulsion and energy tech. Aware of scalar EM from career in advanced physics.", profile: "https://linkedin.com/in/michaelgriffin", urgency: "medium" },
  { id: 9, name: "Christopher Bogdan", title: "VP, Booz Allen Hamilton", org: "Booz Allen Hamilton", category: "defense", why: "Defense acquisition consultant. Booz Allen advises DoD on emerging tech procurement. Bridge to SBIR/STTR grants.", profile: "https://linkedin.com/in/christopherbogdan", urgency: "low" },

  // Biotech / Pharma
  { id: 10, name: "George Church", title: "Professor of Genetics, Harvard", org: "Harvard Medical School", category: "biotech", why: "Longevity gene editing pioneer. Telomere science is his adjacent focus. MCCS + TRD-1 protocol could complement his cellular reprogramming work.", profile: "https://linkedin.com/in/georgechurch", urgency: "high" },
  { id: 11, name: "David Sinclair", title: "Professor, Harvard Med / NovaBay", org: "Harvard / NovaBay Pharma", category: "biotech", why: "World's #1 longevity researcher. Wrote Lifespan. Direct alignment with Bearden MCCS telomere regeneration protocol and EMF biofield research.", profile: "https://linkedin.com/in/davidasinclair", urgency: "high" },
  { id: 12, name: "Aubrey de Grey", title: "Co-founder, SENS Research", org: "SENS Research Foundation", category: "biotech", why: "Longevity research evangelist. SENS funds non-conventional aging therapies. Bioelectromagnetic approaches fit his rejection of mainstream approaches.", profile: "https://linkedin.com/in/aubreydegrey", urgency: "high" },
  { id: 13, name: "Tony Wyss-Coray", title: "Professor, Stanford Neuroscience", org: "Stanford University", category: "biotech", why: "Young blood / plasma research. Biofield EM and Fröhlich coherence are parallel to his cellular signaling work.", profile: "https://linkedin.com/in/tonycoray", urgency: "medium" },

  // Engineers / Makers
  { id: 14, name: "Eric Weinstein", title: "Managing Director, Thiel Capital", org: "Thiel Capital", category: "engineer", why: "Physicist + VC. Deep frustration with suppressed science. Publicly advocates for overlooked theories. Natural Bearden IP ally.", profile: "https://linkedin.com/in/eric-weinstein", urgency: "high" },
  { id: 15, name: "Brett Andersen", title: "Founder, New Energy Foundation", org: "New Energy Foundation", category: "engineer", why: "Directly in the scalar EM / free energy space. Knows Bearden's work. Platform provides the structured access he's been missing.", profile: "https://linkedin.com/in/brettandersen", urgency: "high" },
  { id: 16, name: "Mark Sokol", title: "Founder, Falcon Space", org: "Falcon Space", category: "engineer", why: "Runs independent propulsion / inertia experiments. Active YouTube presence (200K+ subscribers). Warm intro target for MEG replication kits.", profile: "https://linkedin.com/in/marksokol", urgency: "medium" },
  { id: 17, name: "Ben Goertzel", title: "CEO, SingularityNET", org: "SingularityNET", category: "engineer", why: "AGI / biotech bridge. Interested in fringe physics as it relates to consciousness research. ZARP's AI patent tools are a natural tool for his IP.", profile: "https://linkedin.com/in/bengoertzel", urgency: "medium" },

  // IP Attorneys
  { id: 18, name: "Gene Quinn", title: "Founder, IPWatchdog", org: "IPWatchdog", category: "attorney", why: "Influential IP attorney + blogger. 100K+ monthly readers. Getting coverage on IPWatchdog = massive IP community visibility.", profile: "https://linkedin.com/in/genequinn", urgency: "high" },
  { id: 19, name: "Kevin Noonan", title: "Partner, McDonnell Boehnen", org: "McDonnell Boehnen Hulbert & Berghoff", category: "attorney", why: "Top biotech/pharma patent attorney. Deep USPTO connections. Could be a referral source or partner for patent filing services.", profile: "https://linkedin.com/in/kevinnoonan", urgency: "medium" },
  { id: 20, name: "Ron Katznelson", title: "Patent Economist / Consultant", org: "Bi-Level Technologies", category: "attorney", why: "Patent policy expert. Has published on patent quality and valuation. Could validate ZARP's $11.5M IP valuation approach publicly.", profile: "https://linkedin.com/in/ronkatznelson", urgency: "low" },

  // Academics
  { id: 21, name: "Konstantin Meyl", title: "Professor, Hochschule Furtwangen", org: "Furtwangen University", category: "academic", why: "Scalar wave researcher, prolific publisher. His work directly validates Bearden's theoretical framework. Natural academic ally.", profile: "https://linkedin.com/in/konstantinmeyl", urgency: "high" },
  { id: 22, name: "William Tiller", title: "Professor Emeritus, Stanford", org: "Stanford University", category: "academic", why: "Psychoenergetics / structured water research. Bridges mainstream Stanford credibility with non-conventional EM fields. Cites Bearden.", profile: "https://linkedin.com/in/williamtiller", urgency: "medium" },
  { id: 23, name: "Tom Valone", title: "President, Integrity Research", org: "Integrity Research Institute", category: "academic", why: "Zero-point energy researcher, former USPTO examiner. Deep familiarity with Bearden's patents. Credibility bridge between mainstream and fringe.", profile: "https://linkedin.com/in/tomvalone", urgency: "high" },
];

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white text-xs transition-all flex-shrink-0">
      {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy msg"}
    </button>
  );
}

export default function LinkedInProspectList() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [genLoading, setGenLoading] = useState(null);
  const [messages, setMessages] = useState({});

  const filtered = PROSPECTS.filter(p =>
    (category === "all" || p.category === category) &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.org.toLowerCase().includes(search.toLowerCase()) ||
     p.title.toLowerCase().includes(search.toLowerCase()))
  );

  const urgencyStyles = {
    high: "bg-green-900/30 text-green-400 border border-green-800/50",
    medium: "bg-yellow-900/30 text-yellow-400 border border-yellow-800/50",
    low: "bg-gray-800 text-gray-500 border border-gray-700",
  };

  const generateMessage = async (prospect) => {
    setGenLoading(prospect.id);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Write a short, personalized LinkedIn connection request message (under 300 characters) to ${prospect.name}, ${prospect.title} at ${prospect.org}.

Context: I'm the founder of Zenith Apex Advanced Research Platform (ZARP) — built on Tom Bearden's scalar electromagnetics research. The platform is currently FOR SALE as a full acquisition. It includes: 21 invention build plans, AI patent + IP tools, investor CRM, a growing paid beta membership, and a full content library. A signed NDA is required before sharing the acquisition package and financials.

Reason this person is relevant: ${prospect.why}

Requirements:
- MUST be under 300 characters total
- Reference something specific about their work or background that makes them a natural acquirer or investor
- Mention the platform is for sale (acquisition opportunity) — frame it as exclusive and discreet
- Signal that an NDA is required to see the full package — creates intrigue and seriousness
- No spam, no fluff — be direct and professional
- Do NOT mention specific numbers or pricing
- End with a low-friction question (e.g. "Would you be open to a brief NDA and overview?") to drive a reply`
    });
    const msg = typeof result === "string" ? result : result?.content || "";
    setMessages(prev => ({ ...prev, [prospect.id]: msg }));
    setGenLoading(null);
  };

  return (
    <div className="p-5 space-y-4 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-white font-black text-lg flex items-center gap-2"><Users size={18} className="text-blue-400" /> LinkedIn Outreach List</h2>
          <p className="text-gray-500 text-xs">{PROSPECTS.length} curated targets across investors, defense, biotech, engineers, IP attorneys, and academics</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2">
          <Search size={13} className="text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, org, title..."
            className="bg-transparent text-gray-300 text-sm focus:outline-none placeholder-gray-600 w-48" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {PROSPECT_CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              category === c.id ? "border-blue-500 bg-blue-900/30 text-blue-300" : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500"
            }`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {["high", "medium", "low"].map(u => (
          <div key={u} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
            <p className="text-lg font-black text-white">{PROSPECTS.filter(p => p.urgency === u).length}</p>
            <p className={`text-xs font-bold capitalize ${u === "high" ? "text-green-400" : u === "medium" ? "text-yellow-400" : "text-gray-500"}`}>{u} priority</p>
          </div>
        ))}
      </div>

      {/* Prospect Cards */}
      <div className="space-y-2">
        {filtered.map(p => (
          <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all">
            <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-lg font-black text-gray-400">
                {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="text-white font-bold text-sm">{p.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${urgencyStyles[p.urgency]}`}>{p.urgency}</span>
                </div>
                <p className="text-gray-400 text-xs">{p.title}</p>
                <p className="text-gray-600 text-xs">{p.org}</p>
              </div>
              <div className="text-gray-600 text-lg leading-none">{expanded === p.id ? "▲" : "▼"}</div>
            </div>

            {expanded === p.id && (
              <div className="px-4 pb-4 pt-0 border-t border-gray-800 space-y-3">
                <div className="bg-gray-800/40 rounded-lg p-3">
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Why Reach Out</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{p.why}</p>
                </div>

                {/* Generated message */}
                {messages[p.id] && (
                  <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-blue-400 text-xs font-bold uppercase tracking-wider">AI Acquisition Pitch (NDA Required)</p>
                      <CopyBtn text={messages[p.id]} />
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{messages[p.id]}</p>
                    <p className="text-gray-600 text-xs mt-2">{messages[p.id].length} / 300 chars</p>
                  </div>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  <a href={p.profile} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold transition-all">
                    💼 Open LinkedIn
                  </a>
                  <button onClick={() => generateMessage(p)} disabled={genLoading === p.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700 text-purple-300 text-xs font-bold transition-all disabled:opacity-50">
                    {genLoading === p.id ? <Loader2 size={11} className="animate-spin" /> : <span>✨</span>}
                    {genLoading === p.id ? "Writing..." : messages[p.id] ? "Regenerate" : "AI Write Message"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-600 text-sm">No prospects match your filter.</div>
      )}
    </div>
  );
}