import { useState } from "react";
import { Link } from "react-router-dom";
import ResearchDisclaimer from "../components/ResearchDisclaimer";
import { ArrowLeft, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Leaf, Zap, Droplets, Shield } from "lucide-react";

const PHASES = [
  {
    phase: 1,
    title: "Prepare Your Body",
    duration: "Weeks 1–2",
    color: "#3b82f6",
    icon: "🛡️",
    desc: "Before pulling metals out, ensure your detox pathways (liver, kidneys, gut) are open and functioning. Releasing metals too fast without support causes redistribution and worsening symptoms.",
    steps: [
      {
        title: "Optimize bowel movements",
        detail: "You must have 1–3 bowel movements per day before starting. Constipation traps re-absorbed metals. Increase fiber (psyllium husk, flaxseed), hydrate with 2–3L of filtered water daily, and consider magnesium citrate (300–400mg at night) to keep things moving.",
        warning: "Do not start chelation or binders if you are constipated. Metals will be re-absorbed."
      },
      {
        title: "Support liver detox",
        detail: "The liver processes mobilized metals for excretion. Take milk thistle (silymarin 140mg 3x/day), N-Acetyl Cysteine (600mg/day) to boost glutathione, and eat sulfur-rich foods: garlic, onions, broccoli, Brussels sprouts, and eggs.",
      },
      {
        title: "Repair gut integrity",
        detail: "A leaky gut allows metals to re-enter circulation. Take a high-quality probiotic (50+ billion CFU), L-glutamine (5g/day on empty stomach), and eliminate gluten, dairy, and processed foods for at least 4 weeks.",
      },
      {
        title: "Hydrate and mineralize",
        detail: "Chelators also pull beneficial minerals. Pre-load with a full-spectrum mineral supplement containing zinc, magnesium, selenium, and manganese. Use filtered or spring water — avoid tap water which may contain chlorine and fluoride.",
      },
    ]
  },
  {
    phase: 2,
    title: "Bind & Remove Metals",
    duration: "Weeks 3–8",
    color: "#ef4444",
    icon: "🧲",
    desc: "Now introduce natural binders and chelators that attract metals in the gut and bloodstream and carry them out through stool and urine.",
    steps: [
      {
        title: "Chlorella (natural chelator)",
        detail: "Start with 1g/day and build up slowly to 3–5g/day over 2 weeks. Chlorella binds mercury, lead, cadmium, and arsenic in the gut. Take 30 minutes before meals. Broken-cell-wall chlorella is most bioavailable. Source from a heavy-metal-tested brand.",
        warning: "Introduce slowly — some people experience detox reactions (headache, fatigue) if they start too fast. Reduce dose if this occurs."
      },
      {
        title: "Cilantro (mobilizes metals)",
        detail: "Fresh cilantro mobilizes mercury and lead from tissues into the bloodstream for removal. Blend 1/4 cup fresh cilantro into a smoothie daily, or make cilantro pesto. Always use TOGETHER with chlorella — never alone, as mobilized metals need a binder to exit.",
        warning: "Never take cilantro without a binder like chlorella. It can redistribute metals to the brain if used alone."
      },
      {
        title: "Modified Citrus Pectin (MCP)",
        detail: "MCP is clinically studied for binding lead, arsenic, and cadmium. Take 5g in water 3x/day between meals. It works primarily in the gut and has a strong safety profile. PectaSol-C is a well-studied brand. Studies show it can reduce blood lead levels significantly within weeks.",
      },
      {
        title: "Zeolite (clinoptilolite)",
        detail: "Zeolite is a volcanic mineral with a cage-like structure that traps heavy metals, especially mercury, lead, and cadmium, and removes them via stool. Use liquid or powdered clinoptilolite zeolite — 1 teaspoon/day in water on an empty stomach. Space 2+ hours away from supplements.",
      },
      {
        title: "Activated charcoal (gut binder)",
        detail: "Activated charcoal prevents reabsorption of metals being excreted via bile. Take 1–2 capsules (500mg each) at bedtime, 2 hours away from all supplements and medications. Use only 2–3x per week — overuse can cause constipation and nutrient depletion.",
        warning: "Do not take within 2 hours of any medications or supplements — it will absorb them and reduce their effectiveness."
      },
    ]
  },
  {
    phase: 3,
    title: "Support Excretion",
    duration: "Ongoing during Phase 2",
    color: "#22c55e",
    icon: "💧",
    desc: "Metals must leave the body through sweat, urine, and stool. Use these methods to accelerate excretion and reduce the toxic burden on organs.",
    steps: [
      {
        title: "Infrared sauna",
        detail: "Far-infrared sauna penetrates tissue and mobilizes metals stored deep in fat and organs. Use 3–5x per week, 20–40 minutes per session at 120–140°F. Always shower immediately after to wash metals off the skin. Replenish electrolytes afterward.",
        warning: "Start with shorter sessions (15 min) and build up. Not suitable for people with heart conditions — consult a doctor first."
      },
      {
        title: "Epsom salt baths",
        detail: "Magnesium sulfate in Epsom salts supports detoxification pathways and pulls toxins through the skin. Add 2 cups to a warm bath and soak for 20 minutes. The sulfate also supports phase 2 liver detox. Use 3x per week.",
      },
      {
        title: "Hydration with electrolytes",
        detail: "Kidneys are the primary route for mercury and arsenic excretion. Drink 2.5–3L of filtered water daily. Add a pinch of Celtic sea salt and trace minerals to each liter. Avoid plastic water bottles which can leach additional toxins.",
      },
      {
        title: "Rebounding / lymphatic movement",
        detail: "The lymphatic system has no pump — it relies on movement. Use a mini-trampoline (rebounder) for 10–15 minutes daily. This flushes lymph and accelerates the movement of toxins to excretion organs. Deep diaphragmatic breathing also pumps lymph.",
      },
    ]
  },
  {
    phase: 4,
    title: "Replenish & Rebuild",
    duration: "Weeks 8–12",
    color: "#a855f7",
    icon: "🌱",
    desc: "Chelation depletes beneficial minerals and can stress the body. This phase restores mineral balance and rebuilds cellular health.",
    steps: [
      {
        title: "Restore minerals",
        detail: "Heavy metal chelators also remove zinc, copper, magnesium, selenium, and manganese. Replenish with a full-spectrum trace mineral supplement. Key targets: zinc (25–50mg), selenium (200mcg), magnesium glycinate (400mg), and copper (2mg if zinc is high).",
      },
      {
        title: "Rebuild glutathione",
        detail: "Glutathione is the body's master antioxidant and heavy metal detoxifier. Boost it with: N-Acetyl Cysteine (600mg 2x/day), alpha-lipoic acid (300mg/day), and whey protein (undenatured). Consider liposomal glutathione (500mg/day) for direct replenishment.",
      },
      {
        title: "Restore gut microbiome",
        detail: "Detox and binders disrupt gut flora. After completing binder protocols, take a robust probiotic (multi-strain, 50–100 billion CFU) for 60 days. Add prebiotic fiber (inulin, resistant starch) to feed beneficial bacteria. Fermented foods (kimchi, kefir, sauerkraut) help diversity.",
      },
      {
        title: "Anti-inflammatory diet",
        detail: "Reduce inflammation that metals leave behind. Prioritize: wild-caught fatty fish (omega-3s), colorful vegetables (antioxidants), turmeric with black pepper (curcumin), and olive oil. Eliminate seed oils, sugar, and ultra-processed foods permanently.",
      },
    ]
  }
];

const METALS_INFO = [
  { metal: "Mercury", sources: "Dental amalgams, large fish (tuna, swordfish), vaccines (thimerosal), industrial pollution", symptoms: "Brain fog, memory loss, tremors, fatigue, mood swings", key_binders: "Chlorella, cilantro, DMSA (Rx)" },
  { metal: "Lead", sources: "Old paint, tap water (lead pipes), gasoline fumes, some ceramics and toys", symptoms: "Cognitive decline, behavior issues, high blood pressure, anemia, joint pain", key_binders: "EDTA, Modified Citrus Pectin, zeolite" },
  { metal: "Arsenic", sources: "Contaminated well water, rice, chicken (fed arsenic), pesticides, treated wood", symptoms: "Skin lesions, neuropathy, fatigue, digestive issues, increased cancer risk", key_binders: "DMSA, MCP, selenium (protective)" },
  { metal: "Cadmium", sources: "Cigarette smoke, non-organic produce, contaminated soil, some jewelry and pigments", symptoms: "Kidney damage, bone loss (osteoporosis), fatigue, lung issues", key_binders: "Zeolite, NAC, zinc (competes for absorption)" },
  { metal: "Aluminum", sources: "Antiperspirants, cookware, vaccines (adjuvant), processed foods, antacids, chemtrails", symptoms: "Alzheimer's risk, bone pain, muscle weakness, confusion, anemia", key_binders: "Silica-rich mineral water (e.g., Volvic), malic acid, zeolite" },
];

function StepCard({ step, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-800/50 transition-colors text-left">
        <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
          {index + 1}
        </div>
        <span className="text-white text-sm font-semibold flex-1">{step.title}</span>
        {open ? <ChevronUp size={14} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={14} className="text-gray-500 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 space-y-3 bg-gray-900/40">
          <p className="text-gray-300 text-sm leading-relaxed">{step.detail}</p>
          {step.warning && (
            <div className="flex items-start gap-2 bg-yellow-950/40 border border-yellow-800/50 rounded-lg px-3 py-2">
              <AlertTriangle size={13} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-300 text-xs leading-relaxed">{step.warning}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HeavyMetalDetox() {
  const [activePhase, setActivePhase] = useState(null);
  const [showMetals, setShowMetals] = useState(false);

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
              <Leaf size={18} className="text-green-400" /> Heavy Metal Detox Protocol
            </h1>
            <p className="text-gray-500 text-xs">Step-by-step guide to safely remove heavy metals from your body</p>
          </div>
        </div>
        <Link to="/emf-shop" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-900/40 border border-emerald-700 text-emerald-300 text-xs font-bold hover:bg-emerald-800/50 transition-all">
          🛒 EMF Shop
        </Link>
      </div>

      <div className="px-6 pt-3">
        <ResearchDisclaimer type="medical" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-4xl mx-auto w-full">

        {/* Intro */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-bold text-xl mb-3">Why Heavy Metals Are Dangerous</h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Heavy metals like mercury, lead, arsenic, cadmium, and aluminum accumulate in fat tissue, the brain, liver, and kidneys over time. They disrupt mitochondrial function, impair neurotransmitter production, block enzyme pathways, and generate oxidative stress — contributing to chronic fatigue, cognitive decline, autoimmune disease, and neurological disorders.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: "🧠", label: "Neurological damage" },
              { icon: "⚡", label: "Mitochondrial dysfunction" },
              { icon: "🦠", label: "Immune disruption" },
              { icon: "🫀", label: "Cardiovascular stress" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{item.icon}</div>
                <p className="text-gray-400 text-xs">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Phase overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {PHASES.map(p => (
            <button key={p.phase} onClick={() => setActivePhase(activePhase === p.phase ? null : p.phase)}
              className={`rounded-xl p-4 text-left border transition-all ${activePhase === p.phase ? "border-opacity-100" : "border-gray-800 hover:border-gray-600"}`}
              style={activePhase === p.phase ? { backgroundColor: p.color + "15", borderColor: p.color } : {}}>
              <div className="text-2xl mb-2">{p.icon}</div>
              <p className="text-xs font-bold mb-0.5" style={{ color: p.color }}>Phase {p.phase}</p>
              <p className="text-white text-sm font-semibold leading-snug">{p.title}</p>
              <p className="text-gray-600 text-xs mt-1">{p.duration}</p>
            </button>
          ))}
        </div>

        {/* Phase detail */}
        {PHASES.map(p => (
          <div key={p.phase} className={`mb-6 transition-all ${activePhase && activePhase !== p.phase ? "opacity-40" : ""}`}>
            <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => setActivePhase(activePhase === p.phase ? null : p.phase)}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: p.color + "20" }}>
                {p.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold text-base">Phase {p.phase}: {p.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: p.color + "20", color: p.color }}>{p.duration}</span>
                </div>
                <p className="text-gray-500 text-xs">{p.desc}</p>
              </div>
            </div>
            <div className="space-y-2 pl-11">
              {p.steps.map((step, i) => (
                <StepCard key={i} step={step} index={i} />
              ))}
            </div>
          </div>
        ))}

        {/* Metal-specific guide */}
        <div className="border border-gray-800 rounded-2xl overflow-hidden mt-8">
          <button onClick={() => setShowMetals(s => !s)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-900/60 transition-colors">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-blue-400" />
              <h3 className="text-white font-bold text-sm">Metal-Specific Reference Guide</h3>
              <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{METALS_INFO.length} metals</span>
            </div>
            {showMetals ? <ChevronUp size={15} className="text-gray-500" /> : <ChevronDown size={15} className="text-gray-500" />}
          </button>
          {showMetals && (
            <div className="divide-y divide-gray-800">
              {METALS_INFO.map((m, i) => (
                <div key={i} className="px-5 py-4">
                  <h4 className="text-white font-bold text-sm mb-2">{m.metal}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-gray-500 font-semibold uppercase tracking-wider mb-1">Sources</p>
                      <p className="text-gray-300 leading-relaxed">{m.sources}</p>
                    </div>
                    <div>
                      <p className="text-red-400 font-semibold uppercase tracking-wider mb-1">Symptoms</p>
                      <p className="text-gray-300 leading-relaxed">{m.symptoms}</p>
                    </div>
                    <div>
                      <p className="text-green-400 font-semibold uppercase tracking-wider mb-1">Key Binders</p>
                      <p className="text-gray-300 leading-relaxed">{m.key_binders}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Key rules */}
        <div className="mt-8 bg-green-950/20 border border-green-900/30 rounded-2xl p-5">
          <h3 className="text-green-300 font-bold text-sm mb-3 flex items-center gap-2"><CheckCircle2 size={14} /> Golden Rules of Safe Detox</h3>
          <ul className="space-y-2">
            {[
              "Always open detox pathways (bowels, liver, kidneys) BEFORE mobilizing metals.",
              "Never use a mobilizer (cilantro) without a binder (chlorella) — this redistributes metals.",
              "Go slow. Detox reactions mean you're going too fast — reduce dose and support more.",
              "Stay hydrated — metals exit through urine and sweat, not just stool.",
              "Cycle on and off — do 5 days on, 2 days off chelation to avoid depletion.",
              "Retest with hair mineral analysis or urine provocation every 3 months to track progress.",
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <CheckCircle2 size={13} className="text-green-500 flex-shrink-0 mt-0.5" />{rule}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center text-gray-700 text-xs mt-8">
          Sources: Andrew Cutler Chelation Protocol · Dietrich Klinghardt MD · Environmental Working Group · Hair Tissue Mineral Analysis research
        </p>
      </div>
    </div>
  );
}