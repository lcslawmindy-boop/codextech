import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, ExternalLink, Copy, Check, ChevronDown, ChevronUp, Target, DollarSign, Users, FileText, Star } from "lucide-react";

const BROKERS = [
  {
    name: "IPOfferings.com",
    type: "IP Broker",
    model: "Contingency (% of deal)",
    contact: "info@ipofferings.com",
    website: "https://ipofferings.com",
    notes: "Largest IP broker. Works on pure contingency. Email them the executive summary + NDA.",
    priority: "high",
    status: "not_contacted",
  },
  {
    name: "Dominion Harbor",
    type: "Patent Monetization",
    model: "Pure contingency",
    contact: "info@dominionharbor.com",
    website: "https://dominionharbor.com",
    notes: "Specializes in patent licensing & monetization. No upfront fees. Strong defense/energy sector network.",
    priority: "high",
    status: "not_contacted",
  },
  {
    name: "Acacia Research",
    type: "IP Acquirer / Licensor",
    model: "Acquires or licenses — royalty splits",
    contact: "Via website contact form",
    website: "https://acaciaresearch.com",
    notes: "They buy or license IP and handle all monetization. Good for scalar EM / defense-adjacent IP.",
    priority: "high",
    status: "not_contacted",
  },
  {
    name: "Ocean Tomo",
    type: "IP Broker / M&A",
    model: "Commission on sale",
    contact: "info@oceantomo.com",
    website: "https://oceantomo.com",
    notes: "IP auctions + private M&A advisory. Good for full platform acquisition deals.",
    priority: "medium",
    status: "not_contacted",
  },
  {
    name: "Epicenter IP",
    type: "Boutique IP Broker",
    model: "Commission / contingency",
    contact: "Via website",
    website: "https://epicenterip.com",
    notes: "Boutique firm, handles fringe/emerging tech IP well. Personal relationships with buyers.",
    priority: "medium",
    status: "not_contacted",
  },
];

const PLATFORMS = [
  {
    name: "Acquire.com",
    type: "App/SaaS Marketplace",
    model: "Free to list, ~4% on close",
    website: "https://acquire.com",
    notes: "Private listing available — NDA required before any buyer sees details. Best for full platform acquisition.",
    priority: "high",
    status: "not_listed",
    cta: "Create Private Listing",
  },
  {
    name: "Flippa (Private)",
    type: "Digital Business Marketplace",
    model: "Listing fee ~$49, success fee ~10%",
    website: "https://flippa.com",
    notes: "Set listing to private/confidential. Buyer sees only a teaser — must request access to see details.",
    priority: "medium",
    status: "not_listed",
    cta: "Create Confidential Listing",
  },
  {
    name: "MicroAcquire",
    type: "Startup Acquisition",
    model: "Free, NDA-gated",
    website: "https://microacquire.com",
    notes: "Stealth listings standard. All buyers sign NDA before any contact. Good for faster smaller deals.",
    priority: "medium",
    status: "not_listed",
    cta: "Create Stealth Listing",
  },
];

const STATUS_OPTIONS = {
  not_contacted: { label: "Not Contacted", color: "bg-gray-800 text-gray-400 border-gray-700" },
  outreach_sent: { label: "Outreach Sent", color: "bg-blue-900/40 text-blue-300 border-blue-700" },
  in_discussion: { label: "In Discussion", color: "bg-yellow-900/40 text-yellow-300 border-yellow-700" },
  nda_signed: { label: "NDA Signed", color: "bg-purple-900/40 text-purple-300 border-purple-700" },
  proposal_sent: { label: "Proposal Sent", color: "bg-orange-900/40 text-orange-300 border-orange-700" },
  passed: { label: "Passed", color: "bg-red-900/20 text-red-500 border-red-800" },
  closed: { label: "Closed ✓", color: "bg-green-900/40 text-green-300 border-green-700" },
};

const LISTING_STATUS = {
  not_listed: { label: "Not Listed", color: "bg-gray-800 text-gray-400 border-gray-700" },
  listing_created: { label: "Listing Created", color: "bg-blue-900/40 text-blue-300 border-blue-700" },
  live: { label: "Live", color: "bg-green-900/40 text-green-300 border-green-700" },
  offer_received: { label: "Offer Received", color: "bg-yellow-900/40 text-yellow-300 border-yellow-700" },
};

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-xs text-gray-400 hover:text-white transition-all">
      {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function BrokerCard({ broker: initialBroker }) {
  const [broker, setBroker] = useState(initialBroker);
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState("");

  const st = STATUS_OPTIONS[broker.status];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all">
      <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-black text-yellow-400">
          {broker.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-white font-bold text-sm">{broker.name}</p>
            {broker.priority === "high" && <Star size={11} className="text-yellow-400 fill-yellow-400" />}
          </div>
          <p className="text-gray-500 text-xs">{broker.type} · {broker.model}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${st.color}`}>{st.label}</span>
          {expanded ? <ChevronUp size={13} className="text-gray-600" /> : <ChevronDown size={13} className="text-gray-600" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-3 space-y-3">
          <p className="text-gray-400 text-sm leading-relaxed">{broker.notes}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <a href={broker.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-all">
              <ExternalLink size={11} /> Website
            </a>
            <CopyBtn text={broker.contact} />
            <span className="text-gray-600 text-xs">{broker.contact}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Update Status:</p>
            {Object.entries(STATUS_OPTIONS).map(([key, val]) => (
              <button key={key} onClick={() => setBroker(b => ({ ...b, status: key }))}
                className={`text-xs px-2 py-1 rounded-full border font-semibold transition-all ${
                  broker.status === key ? val.color : "border-gray-700 text-gray-600 hover:border-gray-500"
                }`}>{val.label}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={note} onChange={e => setNote(e.target.value)}
              placeholder="Add a note (e.g. 'Spoke with John, sending exec summary')..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-xs focus:outline-none focus:border-gray-500 placeholder-gray-600" />
          </div>
        </div>
      )}
    </div>
  );
}

function PlatformCard({ platform: initialPlatform }) {
  const [platform, setPlatform] = useState(initialPlatform);
  const [expanded, setExpanded] = useState(false);
  const st = LISTING_STATUS[platform.status];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all">
      <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-black text-blue-400">
          {platform.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-white font-bold text-sm">{platform.name}</p>
            {platform.priority === "high" && <Star size={11} className="text-yellow-400 fill-yellow-400" />}
          </div>
          <p className="text-gray-500 text-xs">{platform.type} · {platform.model}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${st.color}`}>{st.label}</span>
          {expanded ? <ChevronUp size={13} className="text-gray-600" /> : <ChevronDown size={13} className="text-gray-600" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-3 space-y-3">
          <p className="text-gray-400 text-sm leading-relaxed">{platform.notes}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <a href={platform.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold transition-all">
              <ExternalLink size={11} /> {platform.cta}
            </a>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Update Status:</p>
            {Object.entries(LISTING_STATUS).map(([key, val]) => (
              <button key={key} onClick={() => setPlatform(p => ({ ...p, status: key }))}
                className={`text-xs px-2 py-1 rounded-full border font-semibold transition-all ${
                  platform.status === key ? val.color : "border-gray-700 text-gray-600 hover:border-gray-500"
                }`}>{val.label}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const OUTREACH_TEMPLATE = `Subject: Acquisition Opportunity — AI Research Platform (NDA Required)

Hi [Name],

I'm the founder of ZARP (Zenith Apex Research Platform) — an AI-powered platform built on Tom Bearden's scalar electromagnetics research library.

The platform is available for acquisition. It includes:
• 21+ invention build plans with full BOMs & assembly instructions
• AI patent drafting & claims generation tools
• Investor CRM, Virtual Data Room, and IP portfolio tools
• Growing paid beta membership (recurring revenue)
• Full course library and content ecosystem

This is a discreet, NDA-gated process. I'm not seeking public exposure.

To receive the full acquisition package (financials, IP valuation, technical overview), please sign the NDA here:
https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=ZARP-NDA&env=na4&acct=zenithapex

Or preview the platform first:
https://zenithapex.base44.app/beta-apply

Happy to discuss structure (full acquisition, licensing, or revenue-share).

Best,
[Your Name]`;

export default function AcquisitionOutreachTracker() {
  const [tab, setTab] = useState("brokers");
  const [showTemplate, setShowTemplate] = useState(false);

  const highPriorityBrokers = BROKERS.filter(b => b.priority === "high").length;
  const highPriorityPlatforms = PLATFORMS.filter(p => p.priority === "high").length;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/zarp-acquisition" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <Target size={14} className="text-yellow-400" /> Acquisition Outreach Tracker
            </h1>
            <p className="text-gray-500 text-xs">No money upfront — brokers, platforms & direct buyer pipeline</p>
          </div>
        </div>
        <button onClick={() => setShowTemplate(t => !t)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-900/40 border border-yellow-700 text-yellow-300 text-xs font-bold hover:bg-yellow-800/50 transition-all">
          <FileText size={12} /> {showTemplate ? "Hide" : "Show"} Email Template
        </button>
      </div>

      {/* Email Template */}
      {showTemplate && (
        <div className="mx-5 mt-4 bg-gray-900 border border-yellow-800/50 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-yellow-400 text-xs font-black uppercase tracking-wider">Cold Outreach Email Template</p>
            <CopyBtn text={OUTREACH_TEMPLATE} />
          </div>
          <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-gray-800/50 rounded-xl p-4 max-h-64 overflow-y-auto">
            {OUTREACH_TEMPLATE}
          </pre>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-5 pt-5">
        {[
          { label: "IP Brokers", value: BROKERS.length, sub: `${highPriorityBrokers} high priority`, icon: <DollarSign size={14} className="text-yellow-400" /> },
          { label: "Marketplaces", value: PLATFORMS.length, sub: `${highPriorityPlatforms} recommended`, icon: <Users size={14} className="text-blue-400" /> },
          { label: "LinkedIn Targets", value: 23, sub: "in outreach list", icon: <Target size={14} className="text-green-400" /> },
        ].map((s, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
            {s.icon}
            <div>
              <p className="text-white font-black text-xl">{s.value}</p>
              <p className="text-gray-400 text-xs font-semibold">{s.label}</p>
              <p className="text-gray-600 text-xs">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Priority Action Box */}
      <div className="mx-5 mt-4 bg-green-950/20 border border-green-800/40 rounded-2xl p-4">
        <p className="text-green-400 font-black text-xs uppercase tracking-wider mb-2">✅ Recommended First Steps (No Money Upfront)</p>
        <ol className="space-y-1">
          {[
            "Email IPOfferings.com — paste the template above, attach your 1-page exec summary",
            "Submit to Dominion Harbor — focus on the scalar EM patent angle",
            "Create a private/stealth listing on Acquire.com — free, NDA-gated",
            "Continue LinkedIn outreach — Bryan Johnson, Laura Deming, Eric Weinstein are highest probability",
            "Contact Acacia Research if you want them to acquire & monetize the IP themselves",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300 text-xs leading-relaxed">
              <span className="text-green-500 font-bold flex-shrink-0">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-5 pt-5 border-b border-gray-800">
        {[
          { id: "brokers", label: "IP Brokers & M&A" },
          { id: "platforms", label: "Marketplace Listings" },
          { id: "linkedin", label: "Direct Buyer Outreach" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              tab === t.id ? "border-yellow-500 text-yellow-300" : "border-transparent text-gray-500 hover:text-gray-300"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-4xl mx-auto w-full space-y-3">
        {tab === "brokers" && (
          <>
            <p className="text-gray-500 text-xs mb-4">These firms work on contingency or commission — <strong className="text-gray-300">zero money upfront</strong>. They find buyers/licensees and take a % on close.</p>
            {BROKERS.map((b, i) => <BrokerCard key={i} broker={b} />)}
          </>
        )}

        {tab === "platforms" && (
          <>
            <p className="text-gray-500 text-xs mb-4">List your platform privately — buyers sign NDA before seeing any details. No public exposure.</p>
            {PLATFORMS.map((p, i) => <PlatformCard key={i} platform={p} />)}
          </>
        )}

        {tab === "linkedin" && (
          <div className="space-y-4">
            <p className="text-gray-500 text-xs">Your existing LinkedIn prospect list is the fastest path to a warm acquisition conversation. These 23 targets already align with the thesis.</p>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-white font-bold mb-3">Top 5 Highest-Probability Direct Buyers</p>
              <div className="space-y-3">
                {[
                  { name: "Bryan Johnson", org: "OS Fund", why: "Paid $100M for Blueprint longevity — TRD-1 device is a natural fit", urgency: "high" },
                  { name: "Laura Deming", org: "Longevity Fund", why: "Dedicated longevity VC — telomere science is her core thesis", urgency: "high" },
                  { name: "Eric Weinstein", org: "Thiel Capital", why: "Physicist + VC — publicly advocates for suppressed science", urgency: "high" },
                  { name: "David Sinclair", org: "Harvard / NovaBay", why: "World's #1 longevity researcher — direct alignment with MCCS protocol", urgency: "high" },
                  { name: "Peter Thiel", org: "Founders Fund", why: "Invests in 'secrets' — scalar EM IP is exactly his thesis", urgency: "medium" },
                ].map((p, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-black text-gray-300 flex-shrink-0">
                      {p.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-bold text-sm">{p.name}</p>
                        <span className="text-xs text-gray-500">· {p.org}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ml-auto ${
                          p.urgency === "high" ? "bg-green-900/30 text-green-400 border-green-800/50" : "bg-yellow-900/30 text-yellow-400 border-yellow-800/50"
                        }`}>{p.urgency}</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-0.5">{p.why}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <Link to="/social-agent" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-sm transition-all">
                  Open LinkedIn Outreach Agent →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}