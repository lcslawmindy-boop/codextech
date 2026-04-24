import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Copy, Check, Filter, Zap, TrendingUp, Eye, Flame } from "lucide-react";

const SCRIPTS = [
  {
    id: 1, platform: "TikTok/Reels", duration: "30s", angle: "Controversy",
    hook: "The US government has a granted patent for a device that outputs more energy than goes in.",
    visual: "Show USPTO.gov with patent 6,362,718. Zoom in on 'Motionless Electromagnetic Generator'.",
    body: "It's not a secret. US Patent 6,362,718. The Motionless Electromagnetic Generator. Co-invented by a PhD physicist. Published in Foundations of Physics Letters in 2002. This device doesn't violate thermodynamics — it draws from the local vacuum field. The permanent magnet acts as a dipole. Continuously replenished. The science is real. The patent is real. The question is: are you going to build it?",
    cta: "Link in bio — full build plans available",
    controversy: "Free energy claim backed by patent record — credible and provocative"
  },
  {
    id: 2, platform: "YouTube Shorts", duration: "45s", angle: "Curiosity",
    hook: "Every electrical engineer is taught a version of Maxwell's equations that was deliberately simplified in 1892.",
    visual: "Split screen: modern textbook Maxwell equations vs. original Maxwell quaternion equations.",
    body: "In 1892, Lorentz made an assumption. He symmetrically regauged Maxwell's equations — removing the term that would have allowed circuits to output more energy than the operator inputs. Every textbook since then inherits that assumption. Tom Bearden spent 30 years showing what that means for energy engineering. His MEG patent shows how to work around it. I found a platform with the full build plans, BOM, and step-by-step instructions.",
    cta: "Drop a comment if you want the link",
    controversy: "Textbook physics being 'wrong' — massive engagement trigger for engineers"
  },
  {
    id: 3, platform: "TikTok/Reels", duration: "20s", angle: "Results",
    hook: "I built a scalar EM detector for $400. Here's what it found.",
    visual: "Oscilloscope showing unusual readings next to a homemade coil assembly.",
    body: "Off-the-shelf parts from Digikey. Custom wound toroidal coil. Quartz crystal resonator. The detection pattern doesn't match any known transverse EM signal. I'm not claiming I know what it is. But the reading is real. And the build plans came from a research vault that references declassified ONR documents.",
    cta: "Find the vault — link in bio",
    controversy: "Mystery + unexplained result = maximum retention"
  },
  {
    id: 4, platform: "TikTok/Reels", duration: "25s", angle: "Authority",
    hook: "Tom Bearden was a Colonel. His co-inventor had 30 peer-reviewed publications. This isn't YouTube physics.",
    visual: "Show Foundations of Physics Letters journal article. Show USPTO patent filing.",
    body: "The MEG — Motionless Electromagnetic Generator. Published 2002. Foundations of Physics Letters. Peer reviewed. Granted by the USPTO. This isn't a garage experiment. It's in the patent record. The platform I use has the full replication kit — BOM, part numbers, assembly steps, downloadable PDF.",
    cta: "Link in bio — engineering vault",
    controversy: "Challenging the 'pseudoscience' label with hard evidence"
  },
  {
    id: 5, platform: "YouTube Shorts", duration: "60s", angle: "Tutorial",
    hook: "How I generated a provisional patent draft in one AI session — for free.",
    visual: "Screen recording of ZARP patent tool generating patent claims.",
    body: "Most inventors spend $3,000–$8,000 on patent attorney pre-filing work. I used an AI patent suite that pulled from the prior art archive, generated independent claims, drafted the abstract, and formatted it to USPTO standards. In one session. I'm not saying skip the attorney — you still need one for prosecution. But the pre-draft work? Done. Attorney review cut from 8 hours to 2. Here's the platform I used.",
    cta: "Link in bio — try it yourself",
    controversy: "Attorney disruption angle — huge audience in inventor community"
  },
  {
    id: 6, platform: "TikTok/Reels", duration: "20s", angle: "Controversy",
    hook: "They shut down Antoine Priore's cancer treatment device in 1976. Here's why.",
    visual: "Old French newspaper headlines. Photo of Priore with his device.",
    body: "French inventor Antoine Priore built a device that reversed cancer in lab animals. Published in Comptes Rendus de l'Académie des Sciences. Tested by credentialed researchers. Then the funding stopped. The lab closed. Priore died in 1983. The science was never refuted — it was just abandoned. There's a full research module on this inside the ZARP engineering vault.",
    cta: "Link in bio — primary source research vault",
    controversy: "Medical suppression narrative — extremely high engagement"
  },
  {
    id: 7, platform: "YouTube Shorts", duration: "40s", angle: "Curiosity",
    hook: "What is a scalar wave? And why don't they teach it in physics class?",
    visual: "Animation showing two EM fields canceling — but the scalar component remaining.",
    body: "Transverse EM waves are what your WiFi router uses. Longitudinal waves — scalar waves — are a different topology. Two transmitters. Equal and opposite. Transverse fields cancel. But the scalar component — the Whittaker decomposition — remains. Tom Bearden showed this experimentally in the 1980s. This is a real mathematical construct. It's just not in the standard curriculum.",
    cta: "Find the engineering vault — link in bio",
    controversy: "Educational gap framing — engineers love discovering 'hidden' physics"
  },
  {
    id: 8, platform: "Instagram Reels", duration: "30s", angle: "Results",
    hook: "I generated a full investor package for my invention in 15 minutes.",
    visual: "Scrolling through professional-looking pitch deck generated by the platform.",
    body: "Pitch deck. Executive summary. IP valuation model. Term sheet draft. VDR setup. Things that normally take months with an attorney and a consultant. I did it in one afternoon using the ZARP investor toolkit. My prototype isn't even finished yet. But I have a package I can put in front of an investor today.",
    cta: "Link in bio — try the platform",
    controversy: "Speed vs. traditional process — massive appeal to bootstrapped inventors"
  },
  {
    id: 9, platform: "TikTok/Reels", duration: "20s", angle: "Controversy",
    hook: "The Soviet Union spent $1 billion on scalar EM weapons research. Here's the declassified paper.",
    visual: "Show ONR London Branch Report R-5-78. Highlight Soviet weaponization references.",
    body: "1978. Office of Naval Research. London Branch. Unclassified report. Describes Soviet scalar EM weapon programs. The Woodpecker signal. The standing wave interference. Tom Bearden's book 'Fer-de-Lance' documents this entire program. You can build a Woodpecker detection device from the plans in the ZARP vault. It's a real engineering project.",
    cta: "Link in bio — full research vault",
    controversy: "Cold War + secret weapons = maximum curiosity engagement"
  },
  {
    id: 10, platform: "YouTube Shorts", duration: "45s", angle: "Education",
    hook: "Why your physics textbook is missing 80% of the electromagnetic spectrum.",
    visual: "EM spectrum diagram. Add unlabeled 'scalar zone' beyond gamma rays.",
    body: "Standard EM theory covers transverse waves — what your phone, your microwave, your radio all use. But Maxwell's original formulation included longitudinal and scalar components. When Heaviside and Lorentz simplified it in the 1880s-1890s, those components got dropped. Modern research in bioelectromagnetics, gravitobiology, and vacuum energy engineering works in exactly those missing domains. I've been studying from a platform built on primary sources.",
    cta: "Link in bio — find the primary sources",
    controversy: "Missing physics angle — compelling for curious engineers"
  },
  {
    id: 11, platform: "TikTok/Reels", duration: "25s", angle: "Results",
    hook: "This is what $400 worth of parts looks like when you have the right build plans.",
    visual: "B-roll of assembled circuit board, coil, oscilloscope readings.",
    body: "Vacuum Potential Oscillator. Custom wound toroidal coil. Quartz resonator. DDS pulse controller. Total parts cost: $380. Build time: 2 weekends. The plans came from a research vault with full BOM, exact part numbers from Digikey, and step-by-step assembly instructions. Not YouTube. Not forums. Primary source engineering documentation.",
    cta: "Comment 'PLANS' and I'll send the link",
    controversy: "Comment trigger drives algorithm engagement"
  },
  {
    id: 12, platform: "Instagram Reels", duration: "30s", angle: "Authority",
    hook: "This is the patent that physicists don't want to talk about.",
    visual: "USPTO page for US 6,362,718. Close-up on inventors, assignee, citations.",
    body: "US Patent 6,362,718. Motionless Electromagnetic Generator. Filed 2000. Granted 2002. 3 inventors. Published in Foundations of Physics Letters. 27 academic citations. This is a real patent, in the real patent record, for a device that claims COP greater than 1. I've been studying the replication kit from a research platform. The science is more accessible than you think.",
    cta: "Link in bio — engineering vault",
    controversy: "Peer-citation authority silences skeptics"
  },
  {
    id: 13, platform: "TikTok/Reels", duration: "20s", angle: "Controversy",
    hook: "T.H. Moray demonstrated a 50kW free energy device to hundreds of witnesses. Then someone shot up his lab.",
    visual: "Archive photos of Moray device. Newspaper clippings from the 1930s.",
    body: "1930s. Thomas Henry Moray. Demonstrated a 50kW radiant energy device to multiple witnesses — including engineers and government officials. His lab was attacked. His device destroyed. His patents were challenged. He died without ever commercializing it. The ZARP vault has a full historical analysis module on the Moray device and comparable modern replication approaches.",
    cta: "Link in bio — historical engineering research vault",
    controversy: "Suppression narrative + historical documentation = viral potential"
  },
  {
    id: 14, platform: "YouTube Shorts", duration: "40s", angle: "Tutorial",
    hook: "How to do prior art research like a patent attorney — for free.",
    visual: "Screen recording: USPTO patent search, Google Scholar, WIPO database.",
    body: "Most inventors search Google Patents for 10 minutes and assume they're done. Here's what a real prior art search looks like: USPTO full-text search, Google Scholar citation chains, WIPO international filings, IPC classification cross-references. The ZARP Prior Art Archive has 200+ pre-categorized entries for scalar EM, vacuum energy, and bioelectromagnetics — with rejection grounds and novelty gaps already analyzed.",
    cta: "Link in bio — prior art research vault",
    controversy: "Professional knowledge democratization — attorneys hate this angle"
  },
  {
    id: 15, platform: "TikTok/Reels", duration: "25s", angle: "Curiosity",
    hook: "What happens when you put two identical EM transmitters face to face with opposite phase?",
    visual: "Oscilloscope showing zero transverse output. Then scalar detection reading appears.",
    body: "E field: zero. B field: zero. Standard EM detector: reads nothing. But a quartz crystal detector tuned to the interference frequency shows a reading. This is the Whittaker decomposition in practice. The scalar component. It's not mythical — it's mathematics. Tom Bearden demonstrated this setup. You can replicate it with a $249 kit.",
    cta: "Link in bio — Scalar Interferometer build plans",
    controversy: "Physical demonstration of 'invisible' field — mysterious and intriguing"
  },
  {
    id: 16, platform: "Instagram Reels", duration: "30s", angle: "Results",
    hook: "I built my first electromagnetic device using a platform that gives you the actual patent schematics.",
    visual: "Show actual patent figure alongside physical build.",
    body: "Not a YouTube tutorial. Not a Reddit thread. The actual patent figures. The actual cited research. The actual BOM. I used the ZARP research vault — and what I found is that the hard part isn't the physics. It's having the right documentation. Most people never build because they're working from incomplete information. That problem is solved.",
    cta: "Link in bio — find the vault",
    controversy: "Documentation gap framing — resonates with frustrated DIY engineers"
  },
  {
    id: 17, platform: "TikTok/Reels", duration: "20s", angle: "Controversy",
    hook: "There's a device that can transmit UV photons through a wall. It was peer-reviewed in the 1970s.",
    visual: "Diagram of Kaznacheyev UV photon experiment setup.",
    body: "Soviet biophysicist Kaznacheyev. 1974. Published in Soviet scientific literature. Transmitted cellular damage signals via UV photons through quartz glass. The effect was replicated. It changed the field of biophysics. The ZARP vault has a full technical module on this experiment — and a build plan for a modern Kaznacheyev-type exposure chamber.",
    cta: "Link in bio — bioelectromagnetics research vault",
    controversy: "Soviet science + biology = unexpectedly credible and viral"
  },
  {
    id: 18, platform: "YouTube Shorts", duration: "50s", angle: "Education",
    hook: "Why most 'free energy' devices fail — and the 3 that actually work.",
    visual: "Three diagrams: Bedini motor, MEG, Asymmetric Regauging circuit.",
    body: "Most free energy claims fail because they're closed-system devices trying to violate the first law. Actual over-unity research doesn't do that. It treats the circuit as an open system — drawing energy from an external source: the vacuum field, the magnet dipole, the earth's EM gradient. The devices that have real evidence behind them are the MEG, the Bedini pulse motor, and the asymmetric regauging circuit. All three are in the ZARP engineering vault with full replication documentation.",
    cta: "Link in bio — find the real science",
    controversy: "Separating real from fake in 'free energy' — massive credibility builder"
  },
  {
    id: 19, platform: "TikTok/Reels", duration: "25s", angle: "Results",
    hook: "I saved $3,800 in patent attorney fees using an AI tool built for inventors.",
    visual: "Side by side: attorney invoice vs. AI-generated draft.",
    body: "Pre-filing work: prior art search, independent claims drafting, abstract, specification outline. My attorney charges $400/hr. This took 2 hours of her time instead of 10 — because the AI pre-draft was that complete. Total savings: $3,200 on one filing. The platform is called ZARP. It's built for serious inventors.",
    cta: "Link in bio — try the patent tool",
    controversy: "Disrupting attorney fees — massive inventor audience engagement"
  },
  {
    id: 20, platform: "Instagram Reels", duration: "30s", angle: "Curiosity",
    hook: "What is 'Energetics' — and why does the US Army care about it?",
    visual: "Show Bearden 1996 paper 'Energetics, Bioenergetics, Psychoenergetics'. Then show Army Research Lab citation.",
    body: "Tom Bearden defined Energetics as the extended EM physics that encompasses scalar, longitudinal, and time-domain components. The US Army Research Lab cited his work in 1998. Not because they agreed with everything — but because the foundational math warranted investigation. This is the primary source material we teach from inside the ZARP vault.",
    cta: "Link in bio — primary source engineering research",
    controversy: "Military citation of 'fringe' science = instant credibility and curiosity"
  },
  {
    id: 21, platform: "TikTok/Reels", duration: "20s", angle: "Results",
    hook: "My first build using a patent schematic and a $200 parts list.",
    visual: "B-roll: soldering, coil winding, assembly, oscilloscope test.",
    body: "The Anenergy Pump. Demonstration circuit. Based on Moray's anenergy mechanism. Quartz resonator. Shielded toroidal coil. DDS pulse controller. Total: $212 in parts. The build took one weekend. The documentation came from a research vault that costs less per month than a technical textbook. I'll link the platform below.",
    cta: "Link in bio — full build plans and BOM",
    controversy: "Accessible price point removes 'too expensive' objection"
  },
  {
    id: 22, platform: "YouTube Shorts", duration: "45s", angle: "Controversy",
    hook: "This 1983 paper proved that a particle can absorb more energy than hits it. The implications are enormous.",
    visual: "Show Craig Bohren's 1983 American Journal of Physics paper. Highlight key equation.",
    body: "Craig Bohren. 1983. American Journal of Physics. Published proof that a small particle can absorb more electromagnetic energy than strikes its geometric cross-section. The paper has been cited over 200 times. Tom Bearden used this to mathematically validate COP>1 circuits. The ZARP vault has a full course module on Bohren 1983 and what it means for overunity engineering. This isn't speculation. It's peer-reviewed physics.",
    cta: "Link in bio — engineering vault",
    controversy: "Mainstream physics paper supports overunity — weaponized credibility"
  },
  {
    id: 23, platform: "TikTok/Reels", duration: "20s", angle: "Curiosity",
    hook: "What does a Phi-River gradient sensor actually measure?",
    visual: "Circuit assembly with multi-axis field probes. Oscilloscope showing asymmetric readings.",
    body: "In Bearden's framework, the Phi-field is the scalar potential that underlies all EM phenomena. The gradient of the Phi-field — the Phi-River — is detectable with a tuned differential sensor. The ZARP build plans include a full Phi-River Gradient Sensor with BOM, sourcing, and assembly steps. Whether or not you believe the theory, the build is an excellent advanced RF sensing project.",
    cta: "Link in bio — build plans",
    controversy: "Framing exotic theory as practical engineering project"
  },
  {
    id: 24, platform: "Instagram Reels", duration: "35s", angle: "Authority",
    hook: "The Priore device cured cancer in lab animals. It was French government-funded. Then it wasn't.",
    visual: "French Comptes Rendus journal entry. Diagram of Priore device topology.",
    body: "Antoine Priore's device was tested by credentialed scientists — including Jacques Mandon, a pharmacologist, and Robert Courrier, a member of the French Academy of Sciences. Results: tumor regression and complete cure in multiple animal models. The funding was from the French government. And then it stopped. Without refutation. Without explanation. The ZARP vault has a full engineering analysis and a partial replication build plan for the Priore-type system.",
    cta: "Link in bio — research vault",
    controversy: "Institutional suppression narrative with hard citations"
  },
  {
    id: 25, platform: "TikTok/Reels", duration: "20s", angle: "Results",
    hook: "I generated 30 days of scalar EM content using an AI agent. Here's the output.",
    visual: "Scrolling through generated TikTok scripts, tweet threads, LinkedIn posts.",
    body: "Platform called ZARP has a built-in social media agent. I put in the Bearden archive content. It output 30 days of scripts, hooks, threads, and email ideas — all based on primary source research. I'm not making this stuff up. It's pulling from the patent record and the peer-reviewed literature. And it's doing it in 20 minutes what used to take me weeks.",
    cta: "Link in bio — try the platform",
    controversy: "AI + fringe science content = meta-viral potential"
  },
  {
    id: 26, platform: "YouTube Shorts", duration: "40s", angle: "Education",
    hook: "Here's why Tesla's tower never worked — and what Bearden says he actually built.",
    visual: "Archive photos of Wardenclyffe Tower. Diagram of scalar resonance theory.",
    body: "Standard explanation: Tesla ran out of money and the tower failed. Bearden's interpretation: the tower was designed to use the earth's scalar potential — a system that Marconi-style transverse wave technology couldn't demonstrate. Bearden wrote extensively on this in Fer-de-Lance. Whether Bearden was right or wrong about Tesla's intent is debatable. What's not debatable: the primary source research in the ZARP vault is fascinating either way.",
    cta: "Link in bio — Tesla research module",
    controversy: "Tesla always goes viral. Combining with suppression narrative amplifies it."
  },
  {
    id: 27, platform: "TikTok/Reels", duration: "20s", angle: "Controversy",
    hook: "The FDA has never tested electromagnetic cancer treatments. And the research is 50 years old.",
    visual: "Priore lab photos. NIH search showing no EMF cancer treatment trials.",
    body: "Not one FDA-regulated clinical trial for electromagnetic cancer treatment modalities based on the Priore mechanism. The last major research was published in the 1970s. The bioelectromagnetics field is active — the NIH funds it — but the specific Priore-type modality has been completely absent from modern research programs. The ZARP vault documents why, and what the engineering looks like if someone wanted to replicate.",
    cta: "Link in bio — bioelectromagnetics research vault",
    controversy: "Medical research gap + regulatory angle = polarizing and shareable"
  },
  {
    id: 28, platform: "Instagram Reels", duration: "30s", angle: "Curiosity",
    hook: "I've never seen prior art research done this way before.",
    visual: "Screen recording: ZARP prior art archive with filter by outcome 'Suppressed' and category 'Bioelectromagnetics'.",
    body: "200+ entries. Filtered by category, inventor, year, outcome. Rejection grounds. Failure reasons. Patent numbers. Source documents. What other inventors tried, what the USPTO said, and why it failed — or what they did that actually worked. For anyone doing R&D in scalar EM, this is the only database like it. I spent a week on Google Patents finding 10 of these. This platform had all of them in 10 minutes.",
    cta: "Link in bio — prior art archive",
    controversy: "Research efficiency + unique resource = instant value demonstration"
  },
  {
    id: 29, platform: "TikTok/Reels", duration: "25s", angle: "Results",
    hook: "I pitched an investor using a package I built in one afternoon.",
    visual: "Screen recording of ZARP investor toolkit generating pitch deck pages.",
    body: "Executive summary. Technology overview. IP status. Market analysis. Financial projections. Term sheet draft. Took 4 hours. I'm not claiming it's perfect. I'm claiming it's a $12,000 consultant output for the cost of a monthly membership. The investor took the meeting. That's all I needed.",
    cta: "Link in bio — investor toolkit",
    controversy: "Democratizing expensive professional services"
  },
  {
    id: 30, platform: "YouTube Shorts", duration: "50s", angle: "Controversy",
    hook: "The Aharonov-Bohm effect proves the vector potential is real. Physics has known this since 1959. But we still don't engineer with it.",
    visual: "Diagram of Aharonov-Bohm experiment. Physical Review paper from 1959.",
    body: "1959. Yakir Aharonov and David Bohm. Published in Physical Review. Showed that the EM vector potential A has physical effects on electrons — even when E and B fields are zero. This is established quantum mechanics. It's been replicated hundreds of times. Tom Bearden's entire engineering framework is built on this foundation — engineering with the potential, not just with the fields. The ZARP vault teaches you to build devices that do exactly that.",
    cta: "Link in bio — scalar EM engineering vault",
    controversy: "Mainstream physics proven fact used to validate 'fringe' engineering"
  }
];

const PLATFORMS = ["All", "TikTok/Reels", "YouTube Shorts", "Instagram Reels"];
const ANGLES = ["All", "Controversy", "Curiosity", "Results", "Authority", "Education", "Tutorial"];

export default function ViralScripts() {
  const [platform, setPlatform] = useState("All");
  const [angle, setAngle] = useState("All");
  const [copiedId, setCopiedId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const filtered = SCRIPTS.filter(s =>
    (platform === "All" || s.platform === platform) &&
    (angle === "All" || s.angle === angle)
  );

  const copyScript = (script) => {
    const text = `HOOK:\n${script.hook}\n\nVISUAL:\n${script.visual}\n\nBODY:\n${script.body}\n\nCTA:\n${script.cta}`;
    navigator.clipboard.writeText(text);
    setCopiedId(script.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const ANGLE_COLORS = {
    "Controversy": "bg-red-900/40 border-red-700 text-red-300",
    "Curiosity": "bg-purple-900/40 border-purple-700 text-purple-300",
    "Results": "bg-green-900/40 border-green-700 text-green-300",
    "Authority": "bg-blue-900/40 border-blue-700 text-blue-300",
    "Education": "bg-yellow-900/40 border-yellow-700 text-yellow-300",
    "Tutorial": "bg-cyan-900/40 border-cyan-700 text-cyan-300",
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
        <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <ArrowLeft size={14} /> Admin
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-orange-400" />
          <h1 className="text-white font-black text-lg">30 Viral Video Scripts</h1>
          <span className="text-xs px-2 py-0.5 rounded bg-orange-900/40 border border-orange-700 text-orange-300 font-bold">Traffic Engine</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Scripts", value: "30", color: "text-cyan-400" },
            { label: "Platforms", value: "3", color: "text-purple-400" },
            { label: "Content Angles", value: "6", color: "text-yellow-400" },
            { label: "Est. Reach/Script", value: "5K–500K+", color: "text-green-400" },
          ].map((s, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex flex-wrap gap-2">
            <span className="text-gray-500 text-xs self-center font-bold uppercase">Platform:</span>
            {PLATFORMS.map(p => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${platform === p ? "bg-cyan-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-gray-500 text-xs self-center font-bold uppercase">Angle:</span>
            {ANGLES.map(a => (
              <button
                key={a}
                onClick={() => setAngle(a)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${angle === a ? "bg-purple-700 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-6">{filtered.length} scripts shown</p>

        {/* Scripts */}
        <div className="space-y-3">
          {filtered.map((script) => (
            <div key={script.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              {/* Header */}
              <div
                className="p-4 flex items-start gap-4 cursor-pointer hover:bg-gray-800/30 transition-colors"
                onClick={() => setExpandedId(expandedId === script.id ? null : script.id)}
              >
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-black">{script.id}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${ANGLE_COLORS[script.angle] || "bg-gray-800 border-gray-700 text-gray-300"}`}>
                      {script.angle}
                    </span>
                    <span className="text-gray-600 text-xs">{script.platform}</span>
                    <span className="text-gray-600 text-xs">· {script.duration}</span>
                  </div>
                  <p className="text-white font-bold text-sm leading-snug">{script.hook}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); copyScript(script); }}
                    className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    title="Copy script"
                  >
                    {copiedId === script.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
                  </button>
                  <Play size={14} className={`text-gray-500 transition-transform ${expandedId === script.id ? "rotate-90" : ""}`} />
                </div>
              </div>

              {/* Expanded */}
              {expandedId === script.id && (
                <div className="border-t border-gray-800 p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider mb-1.5">Visual Direction</p>
                      <p className="text-gray-300 text-sm leading-relaxed bg-gray-950/50 rounded-lg p-3">{script.visual}</p>
                    </div>
                    <div>
                      <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1.5">CTA</p>
                      <p className="text-gray-300 text-sm bg-gray-950/50 rounded-lg p-3">{script.cta}</p>
                      <p className="text-xs text-green-400 font-bold uppercase tracking-wider mt-3 mb-1.5">Why It Works</p>
                      <p className="text-gray-400 text-xs italic bg-gray-950/50 rounded-lg p-3">{script.controversy}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white font-bold uppercase tracking-wider mb-1.5">Body Copy</p>
                    <p className="text-gray-300 text-sm leading-relaxed bg-gray-950/50 rounded-lg p-3 whitespace-pre-line">{script.body}</p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => copyScript(script)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition-colors"
                    >
                      {copiedId === script.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                      {copiedId === script.id ? "Copied!" : "Copy Full Script"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}