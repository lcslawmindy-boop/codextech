import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { DOMAINS } from "@/lib/researchGraphData";
import { Sparkles, Package, BookOpen, Cpu, DollarSign, Heart, Save, Loader2, AlertCircle, ChevronRight, Zap } from "lucide-react";

// ── Preset topics drawn from suppressed / hidden physics research ──────────
const PRESET_TOPICS = [
  "Motionless Electromagnetic Generator (MEG) — Tom Bearden",
  "Prioré Cancer Machine — Electromagnetic Tumor Regression",
  "Royal Rife Beam Ray Device — Frequency-Specific Pathogen Devitalization",
  "Lakhovsky Multi-Wave Oscillator — Cellular Resonance Therapy",
  "Stanley Meyer Water Fuel Cell — Hydrogen-on-Demand",
  "Schauberger Repulsine — Implosion-Vortex Energy",
  "Scalar Wave Healing Devices — Phase-Conjugate Bio-Resonance",
  "Schumann Resonance PEMF — 7.83 Hz Grounding Therapy",
  "Structured Water EZ Zone — Pollack Exclusion-Zone Devices",
  "Electroculture Antenna Systems — EM-Enhanced Agriculture",
  "Vagus Nerve Stimulation Wearable — Neuro-Inflammatory Reset",
  "Photobiomodulation Brain Helmet — 810nm Cognitive Therapy",
  "Colloidal Silver / Ozone Water Purification Systems",
  "Orgone / Etheric Field Accumulators — Reich",
  "Torsion Field Generators — Russian Psychotronic Research",
];

const TABS = [
  { id: "build", label: "Build Plan", icon: Cpu },
  { id: "course", label: "Course", icon: BookOpen },
  { id: "product", label: "Digital Product", icon: Package },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "impact", label: "Humanity Impact", icon: Heart },
];

export default function CommercializationEngine() {
  const [topic, setTopic] = useState("");
  const [domain, setDomain] = useState("suppressed_em");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("build");
  const [saved, setSaved] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savedFlag, setSavedFlag] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    base44.auth.me().then(u => setUserEmail(u?.email || "")).catch(() => {});
    base44.entities.CommercializationPackage.list("-created_date", 20)
      .then(items => setSaved(items || []))
      .catch(() => {});
  }, []);

  const generate = async () => {
    if (!topic.trim()) { setError("Enter a topic or pick a preset."); return; }
    setGenerating(true);
    setError(null);
    setResult(null);
    setSavedFlag(false);
    setActiveTab("build");

    const domainName = DOMAINS.find(d => d.id === domain)?.name || domain;
    const prompt = `You are a senior commercialization strategist for the ZARP advanced-research platform, which brings suppressed, classified, and emerging physics technologies to market in ways that responsibly advance humanity.

TOPIC: "${topic}"
RESEARCH DOMAIN: ${domainName}

Using real public records (patents, research papers, engineering archives, market data), generate a complete commercialization package. Be specific, practical, and grounded — no hype. Frame everything as "conceptual — subject to manufacturer validation" where it involves health or energy claims.

Produce strict JSON with these exact fields:

1. "build_plan" — A practical build plan for a physical device or system based on this technology:
   { "title", "overview" (2-3 sentences), "difficulty" (Beginner/Intermediate/Advanced), "time_estimate_hours" (number), "components": [{ "name", "source", "estimated_cost" }], "assembly_steps": [string], "safety_notes" }

2. "course_outline" — A structured course teaching people to understand and build this technology:
   { "title", "target_audience", "prerequisites": [string], "learning_outcomes": [string], "modules": [{ "title", "lessons": [string], "lab_activity" }], "total_hours" (number) }

3. "digital_product" — A digital product people will pay for (blueprint pack, software tool, dataset, certification, etc.):
   { "name", "format" (e.g. "PDF Blueprint Pack", "Interactive Simulator", "Certification Course"), "description", "deliverables": [string], "target_market", "unique_value" }

4. "pricing_tiers" — 3 pricing tiers as array of { "tier_name", "price" (string like "$49"), "format" (one-time/monthly), "included": [string] }

5. "monetization_strategies" — 5-7 additional revenue channels (licensing, kits, consulting, certification, SaaS, etc.) as array of strings

6. "humanity_impact" — One paragraph on how responsibly commercializing this technology advances human health, energy independence, or consciousness research.`;

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        model: "gemini_3_flash",
        response_json_schema: {
          type: "object",
          properties: {
            build_plan: {
              type: "object",
              properties: {
                title: { type: "string" },
                overview: { type: "string" },
                difficulty: { type: "string" },
                time_estimate_hours: { type: "number" },
                components: { type: "array", items: { type: "object", properties: { name: { type: "string" }, source: { type: "string" }, estimated_cost: { type: "string" } } } },
                assembly_steps: { type: "array", items: { type: "string" } },
                safety_notes: { type: "string" }
              }
            },
            course_outline: {
              type: "object",
              properties: {
                title: { type: "string" },
                target_audience: { type: "string" },
                prerequisites: { type: "array", items: { type: "string" } },
                learning_outcomes: { type: "array", items: { type: "string" } },
                modules: { type: "array", items: { type: "object", properties: { title: { type: "string" }, lessons: { type: "array", items: { type: "string" } }, lab_activity: { type: "string" } } } },
                total_hours: { type: "number" }
              }
            },
            digital_product: {
              type: "object",
              properties: {
                name: { type: "string" },
                format: { type: "string" },
                description: { type: "string" },
                deliverables: { type: "array", items: { type: "string" } },
                target_market: { type: "string" },
                unique_value: { type: "string" }
              }
            },
            pricing_tiers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  tier_name: { type: "string" },
                  price: { type: "string" },
                  format: { type: "string" },
                  included: { type: "array", items: { type: "string" } }
                }
              }
            },
            monetization_strategies: { type: "array", items: { type: "string" } },
            humanity_impact: { type: "string" }
          },
          required: ["build_plan", "course_outline", "digital_product", "pricing_tiers", "monetization_strategies", "humanity_impact"]
        }
      });
      setResult(res);
    } catch (err) {
      setError(err?.message || "Generation failed. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const savePackage = async () => {
    if (!result || !userEmail) return;
    setSaving(true);
    try {
      const rec = await base44.entities.CommercializationPackage.create({
        topic,
        domain,
        user_email: userEmail,
        build_plan: result.build_plan,
        course_outline: result.course_outline,
        digital_product: result.digital_product,
        pricing_tiers: result.pricing_tiers,
        monetization_strategies: result.monetization_strategies,
        humanity_impact: result.humanity_impact,
        status: "draft",
      });
      setSaved(prev => [rec, ...prev].slice(0, 20));
      setSavedFlag(true);
    } catch (e) {
      setError("Could not save package.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 bg-gradient-to-r from-amber-500/10 via-transparent to-cyan-500/10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center">
              <Zap className="text-amber-400" size={22} />
            </div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
              Commercialization Engine
            </h1>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Turn suppressed, classified, and emerging physics research into build plans, courses, and digital products people will pay for — engineered to responsibly advance humanity.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Main column */}
        <div className="space-y-6">
          {/* Input panel */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Research Topic</label>
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Enter a suppressed / hidden physics technology to commercialize, or pick a preset below…"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:border-amber-400/60 focus:outline-none resize-none"
              rows={3}
            />

            <div className="mt-3 flex flex-wrap gap-1.5">
              {PRESET_TOPICS.slice(0, 8).map(p => (
                <button
                  key={p}
                  onClick={() => setTopic(p)}
                  className="px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700 text-[10px] text-slate-300 hover:border-amber-400/50 hover:text-amber-400 transition-colors"
                >
                  {p.split(" — ")[0]}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Domain</label>
                <select
                  value={domain}
                  onChange={e => setDomain(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-400/60 focus:outline-none"
                >
                  {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <button
                onClick={generate}
                disabled={generating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-sm hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {generating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                {generating ? "Generating…" : "Generate Package"}
              </button>
            </div>

            {error && (
              <div className="mt-3 flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle size={14} /> {error}
              </div>
            )}
          </div>

          {/* Results */}
          {generating && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 flex flex-col items-center">
              <Loader2 className="animate-spin text-amber-400 mb-3" size={32} />
              <p className="text-slate-400 text-sm">Researching patents, market data, and engineering archives…</p>
            </div>
          )}

          {result && !generating && (
            <>
              {/* Tab bar */}
              <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto">
                {TABS.map(t => {
                  const Icon = t.icon;
                  const active = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                        active ? "border-amber-400 text-amber-400" : "border-transparent text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <Icon size={13} /> {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                {activeTab === "build" && <BuildPlanTab data={result.build_plan} />}
                {activeTab === "course" && <CourseTab data={result.course_outline} />}
                {activeTab === "product" && <ProductTab data={result.digital_product} />}
                {activeTab === "pricing" && <PricingTab data={result.pricing_tiers} strategies={result.monetization_strategies} />}
                {activeTab === "impact" && <ImpactTab text={result.humanity_impact} strategies={result.monetization_strategies} />}
              </div>

              {/* Save bar */}
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-3">
                <p className="text-xs text-slate-400">
                  {savedFlag ? "✓ Saved to your packages" : "Save this package to your monetization library"}
                </p>
                <button
                  onClick={savePackage}
                  disabled={saving || savedFlag}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold hover:border-amber-400/50 disabled:opacity-50 transition-colors"
                >
                  <Save size={14} /> {savedFlag ? "Saved" : "Save Package"}
                </button>
              </div>
            </>
          )}

          {!result && !generating && !error && (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
              <Sparkles className="mx-auto text-slate-600 mb-3" size={32} />
              <p className="text-slate-500 text-sm">Enter a topic above and generate a full commercialization package — build plan, course, digital product, pricing, and humanity impact.</p>
            </div>
          )}
        </div>

        {/* Sidebar — saved packages */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Packages</h3>
          {saved.length === 0 && (
            <p className="text-slate-600 text-xs">No saved packages yet. Generate one to get started.</p>
          )}
          {saved.map(pkg => (
            <div key={pkg.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 hover:border-amber-400/30 transition-colors">
              <p className="text-white text-xs font-bold leading-tight mb-1">{pkg.topic}</p>
              <p className="text-slate-500 text-[10px]">{DOMAINS.find(d => d.id === pkg.domain)?.name || pkg.domain}</p>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {pkg.build_plan && <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[9px]">Build</span>}
                {pkg.course_outline && <span className="px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 text-[9px]">Course</span>}
                {pkg.digital_product && <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px]">Product</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tab components ─────────────────────────────────────────────────────────
function BuildPlanTab({ data }) {
  if (!data) return <Empty />;
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-white font-bold text-lg">{data.title || "Build Plan"}</h3>
        <p className="text-slate-400 text-sm mt-1">{data.overview}</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Badge label={data.difficulty} />
        {data.time_estimate_hours > 0 && <Badge label={`≈ ${data.time_estimate_hours}h build`} />}
      </div>
      {data.components?.length > 0 && (
        <div>
          <h4 className="text-amber-400 text-xs font-bold uppercase mb-2">Components</h4>
          <div className="space-y-1.5">
            {data.components.map((c, i) => (
              <div key={i} className="flex items-start gap-3 text-xs bg-slate-950/50 rounded-lg p-2.5 border border-slate-800">
                <span className="text-slate-600 font-mono">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex-1">
                  <p className="text-slate-200 font-medium">{c.name}</p>
                  <p className="text-slate-500">{c.source} {c.estimated_cost && `· ${c.estimated_cost}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.assembly_steps?.length > 0 && (
        <div>
          <h4 className="text-amber-400 text-xs font-bold uppercase mb-2">Assembly Steps</h4>
          <ol className="space-y-1.5">
            {data.assembly_steps.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-xs text-slate-300">
                <span className="text-amber-400 font-mono font-bold">{i + 1}.</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      {data.safety_notes && (
        <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-3">
          <h4 className="text-red-400 text-xs font-bold uppercase mb-1">Safety Notes</h4>
          <p className="text-slate-300 text-xs">{data.safety_notes}</p>
        </div>
      )}
      <Disclaimer />
    </div>
  );
}

function CourseTab({ data }) {
  if (!data) return <Empty />;
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-white font-bold text-lg">{data.title || "Course"}</h3>
        <p className="text-slate-400 text-sm mt-1">Target audience: {data.target_audience}</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {data.total_hours > 0 && <Badge label={`${data.total_hours} hours`} />}
        <Badge label={`${data.modules?.length || 0} modules`} />
      </div>
      {data.prerequisites?.length > 0 && (
        <div>
          <h4 className="text-amber-400 text-xs font-bold uppercase mb-2">Prerequisites</h4>
          <ul className="space-y-1">
            {data.prerequisites.map((p, i) => <li key={i} className="text-xs text-slate-300 flex gap-2"><ChevronRight size={12} className="text-slate-600 mt-0.5" />{p}</li>)}
          </ul>
        </div>
      )}
      {data.learning_outcomes?.length > 0 && (
        <div>
          <h4 className="text-amber-400 text-xs font-bold uppercase mb-2">Learning Outcomes</h4>
          <ul className="space-y-1">
            {data.learning_outcomes.map((o, i) => <li key={i} className="text-xs text-slate-300 flex gap-2"><ChevronRight size={12} className="text-emerald-400 mt-0.5" />{o}</li>)}
          </ul>
        </div>
      )}
      {data.modules?.map((m, i) => (
        <div key={i} className="rounded-lg bg-slate-950/50 border border-slate-800 p-3">
          <p className="text-white text-sm font-bold mb-2">Module {i + 1}: {m.title}</p>
          {m.lessons?.length > 0 && (
            <ul className="space-y-1 mb-2">
              {m.lessons.map((l, j) => <li key={j} className="text-xs text-slate-400 flex gap-2"><span className="text-slate-600">·</span>{l}</li>)}
            </ul>
          )}
          {m.lab_activity && <p className="text-xs text-cyan-400 bg-cyan-500/5 rounded p-2 border border-cyan-500/20">🔬 Lab: {m.lab_activity}</p>}
        </div>
      ))}
    </div>
  );
}

function ProductTab({ data }) {
  if (!data) return <Empty />;
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-white font-bold text-lg">{data.name || "Digital Product"}</h3>
        <p className="text-slate-400 text-sm mt-1">{data.description}</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Badge label={data.format} />
      </div>
      {data.deliverables?.length > 0 && (
        <div>
          <h4 className="text-amber-400 text-xs font-bold uppercase mb-2">Deliverables</h4>
          <ul className="space-y-1">
            {data.deliverables.map((d, i) => <li key={i} className="text-xs text-slate-300 flex gap-2"><ChevronRight size={12} className="text-amber-400 mt-0.5" />{d}</li>)}
          </ul>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-950/50 border border-slate-800 p-3">
          <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Target Market</p>
          <p className="text-slate-200 text-xs">{data.target_market}</p>
        </div>
        <div className="rounded-lg bg-slate-950/50 border border-slate-800 p-3">
          <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Unique Value</p>
          <p className="text-slate-200 text-xs">{data.unique_value}</p>
        </div>
      </div>
    </div>
  );
}

function PricingTab({ data, strategies }) {
  if (!data?.length) return <Empty />;
  return (
    <div className="space-y-5">
      <h3 className="text-white font-bold text-lg">Pricing Tiers</h3>
      <div className="grid sm:grid-cols-3 gap-3">
        {data.map((t, i) => (
          <div key={i} className={`rounded-xl border p-4 ${i === 1 ? "border-amber-400/50 bg-amber-400/5" : "border-slate-800 bg-slate-950/50"}`}>
            <p className="text-amber-400 text-xs font-bold uppercase">{t.tier_name}</p>
            <p className="text-white text-2xl font-bold my-2">{t.price}</p>
            <p className="text-slate-500 text-[10px] mb-2">{t.format}</p>
            <ul className="space-y-1">
              {t.included?.map((inc, j) => <li key={j} className="text-xs text-slate-300 flex gap-1.5"><ChevronRight size={11} className="text-slate-600 mt-0.5" />{inc}</li>)}
            </ul>
          </div>
        ))}
      </div>
      {strategies?.length > 0 && (
        <div>
          <h4 className="text-amber-400 text-xs font-bold uppercase mb-2">Monetization Strategies</h4>
          <ul className="space-y-1.5">
            {strategies.map((s, i) => <li key={i} className="text-xs text-slate-300 flex gap-2"><span className="text-amber-400 font-mono">{String(i + 1).padStart(2, "0")}</span>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function ImpactTab({ text, strategies }) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 p-5">
        <Heart className="text-emerald-400 mb-2" size={20} />
        <h3 className="text-emerald-400 text-xs font-bold uppercase mb-2">Humanity Impact</h3>
        <p className="text-slate-200 text-sm leading-relaxed">{text}</p>
      </div>
      {strategies?.length > 0 && (
        <div>
          <h4 className="text-amber-400 text-xs font-bold uppercase mb-2">Revenue Channels</h4>
          <ul className="space-y-1.5">
            {strategies.map((s, i) => <li key={i} className="text-xs text-slate-300 flex gap-2"><span className="text-amber-400 font-mono">{String(i + 1).padStart(2, "0")}</span>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function Badge({ label }) {
  return <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-medium">{label}</span>;
}

function Empty() {
  return <p className="text-slate-500 text-sm">No data generated for this section.</p>;
}

function Disclaimer() {
  return (
    <p className="text-[10px] text-slate-600 italic border-t border-slate-800 pt-3">
      Conceptual — subject to manufacturer validation. All build plans are for research and educational purposes. Not medical advice.
    </p>
  );
}