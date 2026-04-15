import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Zap, Star, Search, Send, CheckCircle2, Loader2, X, ChevronRight, Lightbulb, Code, FlaskConical, DollarSign } from "lucide-react";
import { base44 } from "@/api/base44Client";

const DOMAINS = ["Vacuum Energy", "Bioelectromagnetics", "Scalar EM", "Clean Energy", "AI / Software", "Biotech / Pharma", "Defense Tech", "Quantum Physics", "Materials Science", "Other"];
const SKILLS = ["Engineering / Hardware", "Patent Law / IP", "Business / Commercialization", "Software / AI", "Biology / Medicine", "Physics / Theory", "Manufacturing / BOM", "Finance / Fundraising", "Marketing / GTM", "Legal / Contracts"];
const STAGES = ["Concept Stage", "Prototype", "Patent Pending", "Patent Granted", "MVP / Beta", "Revenue Stage"];
const LOOKING_FOR = ["Co-Inventor", "Technical Partner", "IP Attorney", "Business Partner", "Investor", "Manufacturer"];

const SAMPLE_PROFILES = [
  {
    id: "p1", alias: "InventorX_77", domains: ["Vacuum Energy", "Scalar EM"], skills: ["Engineering / Hardware", "Physics / Theory"],
    stage: "Patent Pending", looking_for: ["Co-Inventor", "Business Partner"],
    bio: "Retired EE with 3 patents in asymmetric EM circuits. Building a MEG-derivative device. Need a business partner to handle licensing and investor outreach.",
    synergy_domains: ["Vacuum Energy"],
  },
  {
    id: "p2", alias: "BioEM_Lab", domains: ["Bioelectromagnetics", "Biotech / Pharma"], skills: ["Biology / Medicine", "Engineering / Hardware"],
    stage: "Prototype", looking_for: ["IP Attorney", "Co-Inventor"],
    bio: "Biomedical researcher with working Prioré-class prototype. Published results in cellular regeneration. Seeking IP attorney and electronics co-inventor for patent filing.",
    synergy_domains: ["Bioelectromagnetics"],
  },
  {
    id: "p3", alias: "QuantumIP_Dev", domains: ["AI / Software", "Scalar EM"], skills: ["Software / AI", "Patent Law / IP"],
    stage: "MVP / Beta", looking_for: ["Technical Partner", "Co-Inventor"],
    bio: "AI engineer with 2 software patents. Building an AI-assisted patent drafting tool for advanced EM inventions. Need a physics/hardware co-inventor.",
    synergy_domains: ["AI / Software"],
  },
  {
    id: "p4", alias: "CleanEnergy_X", domains: ["Clean Energy", "Vacuum Energy"], skills: ["Finance / Fundraising", "Business / Commercialization"],
    stage: "Concept Stage", looking_for: ["Co-Inventor", "Technical Partner"],
    bio: "Former VC partner now building in the clean energy space. Have $500K+ committed to the right invention. Need a technical co-inventor in vacuum energy or EM.",
    synergy_domains: ["Clean Energy", "Vacuum Energy"],
  },
];

function ProfileCard({ profile, onConnect, myDomains }) {
  const [expanded, setExpanded] = useState(false);

  // Calculate match score based on domain overlap
  const overlap = (profile.synergy_domains || profile.domains || []).filter(d => (myDomains || []).includes(d));
  const matchScore = myDomains?.length ? Math.round((overlap.length / Math.max(myDomains.length, 1)) * 100) : null;

  return (
    <div className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl overflow-hidden transition-all">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-700 to-purple-700 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                {profile.alias[0]}
              </div>
              <p className="text-white font-black text-sm">{profile.alias}</p>
              {matchScore !== null && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-black ${matchScore > 50 ? "bg-green-900/40 border border-green-700 text-green-400" : "bg-gray-800 border border-gray-700 text-gray-500"}`}>
                  {matchScore > 0 ? `${matchScore}% match` : "Explore"}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mb-1">
              {(profile.domains || []).map((d, i) => (
                <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-indigo-900/30 border border-indigo-800/40 text-indigo-400">{d}</span>
              ))}
            </div>
            <p className="text-gray-500 text-xs">{profile.stage}</p>
          </div>
        </div>

        {expanded && (
          <div className="border-t border-gray-800 pt-3 mb-3 space-y-2">
            <p className="text-gray-300 text-xs leading-relaxed">{profile.bio}</p>
            <div>
              <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1">Skills</p>
              <div className="flex flex-wrap gap-1">
                {(profile.skills || []).map((s, i) => (
                  <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-400">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1">Looking For</p>
              <div className="flex flex-wrap gap-1">
                {(profile.looking_for || []).map((l, i) => (
                  <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-yellow-900/30 border border-yellow-800/40 text-yellow-400">{l}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs font-bold transition-all">
            {expanded ? "Less" : "View Profile"}
          </button>
          <button onClick={() => onConnect(profile)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-black transition-all ml-auto">
            <Send size={10} /> Connect
          </button>
        </div>
      </div>
    </div>
  );
}

function ConnectModal({ profile, onClose }) {
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const send = async () => {
    setSubmitting(true);
    await base44.integrations.Core.SendEmail({
      to: "zenithapexresearch@gmail.com",
      subject: `[CO-INVENTOR CONNECT] Request to ${profile.alias}`,
      body: `New co-inventor connection request.\n\nTO: ${profile.alias}\nDOMAINS: ${profile.domains?.join(", ")}\nSTAGE: ${profile.stage}\n\nMESSAGE:\n${msg}\n\n---\nZARP Co-Inventor Matching Engine · Auto-notification`
    });
    setDone(true);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <p className="text-white font-black">Connect with {profile.alias}</p>
          <button onClick={onClose}><X size={16} className="text-gray-600 hover:text-gray-300" /></button>
        </div>
        {done ? (
          <div className="p-8 text-center">
            <CheckCircle2 size={36} className="text-green-400 mx-auto mb-3" />
            <p className="text-white font-black mb-2">Introduction Requested</p>
            <p className="text-gray-400 text-sm">ZARP will broker a blind introduction within 48 hours. Both parties must consent before contact details are shared.</p>
            <button onClick={onClose} className="mt-4 px-5 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm font-bold">Close</button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <p className="text-gray-400 text-xs leading-relaxed">Your identity remains anonymous. ZARP will broker the introduction — contact details are only shared after mutual consent.</p>
            <textarea value={msg} onChange={e => setMsg(e.target.value)}
              placeholder="Introduce yourself and explain why you'd like to connect (your domains, what you're working on, what you're looking for)…"
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-600 placeholder-gray-600 resize-none" />
            <button onClick={send} disabled={!msg.trim() || submitting}
              className="w-full py-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 disabled:opacity-40 text-white font-black text-sm flex items-center justify-center gap-2 transition-all">
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {submitting ? "Sending…" : "Request Introduction"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CoInventorMatching() {
  const [tab, setTab] = useState("browse"); // browse | profile | matches
  const [connectTarget, setConnectTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");

  // My profile form
  const [myProfile, setMyProfile] = useState({ alias: "", domains: [], skills: [], stage: "", looking_for: [], bio: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // AI match results
  const [aiMatches, setAiMatches] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);

  const toggleArr = (key, val) => setMyProfile(p => ({
    ...p,
    [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val]
  }));

  const saveProfile = async () => {
    setSavingProfile(true);
    // Store in local for demo; in production would save to a Members entity
    setProfileSaved(true);
    setSavingProfile(false);
  };

  const runAIMatch = async () => {
    if (!myProfile.domains.length) return;
    setMatchLoading(true);
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an AI co-inventor matching engine for an advanced IP and R&D platform.

A member has the following profile:
- Domains: ${myProfile.domains.join(", ")}
- Skills: ${myProfile.skills.join(", ")}
- Stage: ${myProfile.stage}
- Looking For: ${myProfile.looking_for.join(", ")}
- Bio: ${myProfile.bio}

Available profiles to match against:
${SAMPLE_PROFILES.map(p => `- ${p.alias}: Domains(${p.domains.join(", ")}) Skills(${p.skills.join(", ")}) Stage(${p.stage}) LookingFor(${p.looking_for.join(", ")}) Bio: ${p.bio}`).join("\n")}

Analyze compatibility and return a JSON object with:
- matches: array of { alias, match_score (0-100), match_reason (2 sentences), synergy_opportunity (1 sentence) }
Rank by match_score descending. Return top 3.`,
      response_json_schema: {
        type: "object",
        properties: {
          matches: {
            type: "array",
            items: {
              type: "object",
              properties: {
                alias: { type: "string" },
                match_score: { type: "integer" },
                match_reason: { type: "string" },
                synergy_opportunity: { type: "string" },
              }
            }
          }
        }
      }
    });
    setAiMatches(response?.matches || []);
    setMatchLoading(false);
    setTab("matches");
  };

  const filtered = SAMPLE_PROFILES.filter(p => {
    const matchSearch = !search || p.alias.toLowerCase().includes(search.toLowerCase()) || p.bio.toLowerCase().includes(search.toLowerCase()) || p.domains.some(d => d.toLowerCase().includes(search.toLowerCase()));
    const matchDomain = domainFilter === "All" || p.domains.includes(domainFilter);
    return matchSearch && matchDomain;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <Users size={14} className="text-purple-400" /> Co-Inventor Matching
            </h1>
            <p className="text-gray-500 text-xs">AI-matched introductions · Anonymous until mutual consent · AngelList for inventors</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 bg-gray-900/60 px-5">
        <div className="flex gap-1 max-w-4xl mx-auto">
          {[
            { id: "browse", label: "Browse Members", icon: <Search size={12} /> },
            { id: "profile", label: "My Profile", icon: <Star size={12} /> },
            { id: "matches", label: "AI Matches", icon: <Zap size={12} /> },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
                tab === t.id ? "border-purple-500 text-purple-400" : "border-transparent text-gray-600 hover:text-gray-400"
              }`}>
              {t.icon} {t.label}
              {t.id === "matches" && aiMatches && <span className="w-1.5 h-1.5 rounded-full bg-green-400 ml-1" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-5xl mx-auto w-full">

        {/* BROWSE TAB */}
        {tab === "browse" && (
          <div className="space-y-4">
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by domain, skill, bio…"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-8 pr-3 py-2 text-sm text-white focus:outline-none focus:border-purple-600 placeholder-gray-600" />
              </div>
              <select value={domainFilter} onChange={e => setDomainFilter(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
                <option>All</option>
                {DOMAINS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(p => (
                <ProfileCard key={p.id} profile={p} onConnect={setConnectTarget} myDomains={myProfile.domains} />
              ))}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === "profile" && (
          <div className="max-w-2xl">
            <h2 className="text-white font-black text-xl mb-1">Your Discoverable Profile</h2>
            <p className="text-gray-500 text-sm mb-5">Build your profile to appear in the matching engine. Your alias keeps you anonymous until you consent to an introduction.</p>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-5">
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1.5">Your Alias (anonymous name)</label>
                <input value={myProfile.alias} onChange={e => setMyProfile(p => ({ ...p, alias: e.target.value }))}
                  placeholder="e.g. ScalarPhysics_42"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-600 placeholder-gray-600" />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-2">IP / Tech Domains (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {DOMAINS.map(d => (
                    <button key={d} onClick={() => toggleArr("domains", d)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-all ${
                        myProfile.domains.includes(d) ? "bg-purple-900/40 border-purple-600 text-purple-300" : "bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-600"
                      }`}>{d}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-2">Your Skills</label>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map(s => (
                    <button key={s} onClick={() => toggleArr("skills", s)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-all ${
                        myProfile.skills.includes(s) ? "bg-indigo-900/40 border-indigo-600 text-indigo-300" : "bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-600"
                      }`}>{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-2">Current Stage</label>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map(s => (
                    <button key={s} onClick={() => setMyProfile(p => ({ ...p, stage: s }))}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-all ${
                        myProfile.stage === s ? "bg-yellow-900/40 border-yellow-600 text-yellow-300" : "bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-600"
                      }`}>{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-2">Looking For</label>
                <div className="flex flex-wrap gap-2">
                  {LOOKING_FOR.map(l => (
                    <button key={l} onClick={() => toggleArr("looking_for", l)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-all ${
                        myProfile.looking_for.includes(l) ? "bg-green-900/40 border-green-600 text-green-300" : "bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-600"
                      }`}>{l}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1.5">Short Bio</label>
                <textarea value={myProfile.bio} onChange={e => setMyProfile(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Briefly describe what you're working on, your background, and what ideal collaboration looks like…"
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-600 placeholder-gray-600 resize-none" />
              </div>

              <div className="flex gap-3">
                <button onClick={saveProfile} disabled={savingProfile || !myProfile.alias}
                  className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 font-black text-sm flex items-center justify-center gap-2 transition-all">
                  {profileSaved ? <CheckCircle2 size={14} className="text-green-400" /> : null}
                  {profileSaved ? "Profile Saved" : "Save Profile"}
                </button>
                <button onClick={runAIMatch} disabled={matchLoading || !myProfile.domains.length}
                  className="flex-1 py-3 rounded-xl bg-purple-700 hover:bg-purple-600 disabled:opacity-40 text-white font-black text-sm flex items-center justify-center gap-2 transition-all">
                  {matchLoading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                  {matchLoading ? "Matching…" : "Run AI Match"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI MATCHES TAB */}
        {tab === "matches" && (
          <div className="space-y-4 max-w-2xl">
            {!aiMatches ? (
              <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl">
                <Zap size={40} className="text-gray-800 mx-auto mb-3" />
                <p className="text-gray-600 font-bold mb-1">No AI matches yet</p>
                <p className="text-gray-700 text-sm mb-4">Fill in your profile and click "Run AI Match" to get personalized introductions.</p>
                <button onClick={() => setTab("profile")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-900/40 border border-purple-700 text-purple-300 text-sm font-black">
                  Build My Profile →
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-white font-black text-lg">Your AI-Matched Introductions</h2>
                {aiMatches.map((m, i) => {
                  const profile = SAMPLE_PROFILES.find(p => p.alias === m.alias);
                  return (
                    <div key={i} className="bg-gray-900 border border-purple-900/40 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-700 to-indigo-700 flex items-center justify-center text-white font-black text-sm">
                            {m.alias[0]}
                          </div>
                          <div>
                            <p className="text-white font-black">{m.alias}</p>
                            {profile && <p className="text-gray-500 text-xs">{profile.stage}</p>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1.5 justify-end">
                            <div className="h-1.5 w-16 bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${m.match_score}%` }} />
                            </div>
                            <span className="text-green-400 font-black text-sm">{m.match_score}%</span>
                          </div>
                          <p className="text-gray-600 text-xs">match score</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed mb-2">{m.match_reason}</p>
                      <p className="text-indigo-300 text-xs font-bold mb-3">⚡ {m.synergy_opportunity}</p>
                      {profile && (
                        <button onClick={() => setConnectTarget(profile)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-black transition-all">
                          <Send size={11} /> Request Introduction
                        </button>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>

      {connectTarget && <ConnectModal profile={connectTarget} onClose={() => setConnectTarget(null)} />}
    </div>
  );
}