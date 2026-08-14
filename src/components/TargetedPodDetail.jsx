import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, Activity, Atom, Leaf, Zap, Sparkles, Brain, Heart } from "lucide-react";

export default function TargetedPodDetail({ pod }) {
  const [openSection, setOpenSection] = useState("modalities");

  const toggle = (id) => setOpenSection(p => (p === id ? null : id));

  const Section = ({ id, icon, title, count, children }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span style={{ color: pod.color }}>{icon}</span>
          <span className="text-white font-bold text-sm">{title}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-800 text-gray-400 border border-gray-700">{count}</span>
        </div>
        {openSection === id ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
      </button>
      {openSection === id && (
        <div className="px-5 pb-4 space-y-2 border-t border-gray-800">{children}</div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="rounded-2xl border p-6" style={{ borderColor: `${pod.color}40`, background: `linear-gradient(135deg, ${pod.color}10, transparent)` }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${pod.color}25`, color: pod.color }}>{pod.designation}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-800">Not for Sale</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-950/40 text-yellow-400 border border-yellow-800">Research Only</span>
        </div>
        <h2 className="text-white font-black text-xl mb-1">{pod.name}</h2>
        <p className="text-sm italic mb-3" style={{ color: pod.color }}>{pod.tagline}</p>
        <p className="text-gray-400 text-xs leading-relaxed mb-4">{pod.summary}</p>
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-gray-900/60 rounded-lg p-2.5 text-center border border-gray-800">
            <p className="text-xl font-black" style={{ color: pod.color }}>9</p>
            <p className="text-gray-600 text-[9px] uppercase tracking-wider">Modalities</p>
          </div>
          <div className="bg-gray-900/60 rounded-lg p-2.5 text-center border border-gray-800">
            <p className="text-xl font-black" style={{ color: pod.color }}>{pod.inventions.length}</p>
            <p className="text-gray-600 text-[9px] uppercase tracking-wider">Inventions</p>
          </div>
          <div className="bg-gray-900/60 rounded-lg p-2.5 text-center border border-gray-800">
            <p className="text-xl font-black" style={{ color: pod.color }}>{pod.vedic.length}</p>
            <p className="text-gray-600 text-[9px] uppercase tracking-wider">Vedic</p>
          </div>
          <div className="bg-gray-900/60 rounded-lg p-2.5 text-center border border-gray-800">
            <p className="text-xl font-black" style={{ color: pod.color }}>{pod.consciousness.length}</p>
            <p className="text-gray-600 text-[9px] uppercase tracking-wider">Consciousness</p>
          </div>
        </div>
      </div>

      {/* BrightSteps Modalities */}
      <Section id="modalities" icon={<Activity size={16} />} title="BrightSteps Modalities (9)" count={pod.modalities.length}>
        {pod.modalities.map(m => (
          <div key={m.code} className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-800/30 border border-gray-800" style={{ borderLeftColor: pod.color, borderLeftWidth: 2 }}>
            <span className="font-mono font-black text-xs px-2 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: `${pod.color}20`, color: pod.color }}>{m.code}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-xs">{m.name} <span className="text-gray-600 font-normal">· {m.freq}</span></p>
              <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{m.role}</p>
            </div>
          </div>
        ))}
      </Section>

      {/* Fused Inventions */}
      <Section id="inventions" icon={<Atom size={16} />} title={`Fused Inventions (${pod.inventions.length})`} count={pod.inventions.length}>
        {pod.inventions.map(inv => (
          <div key={inv.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-800/30 border border-gray-800">
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-800 text-gray-500 flex-shrink-0">{inv.ref}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-xs">{inv.name}</p>
              <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{inv.role}</p>
            </div>
          </div>
        ))}
      </Section>

      {/* Vedic Therapies */}
      <Section id="vedic" icon={<Leaf size={16} />} title={`Vedic Therapies (${pod.vedic.length})`} count={pod.vedic.length}>
        {pod.vedic.map((v, i) => (
          <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-green-950/10 border border-green-900/30">
            <CheckCircle2 size={12} className="text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-xs">{v.concept}</p>
              <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{v.role}</p>
            </div>
          </div>
        ))}
      </Section>

      {/* Suppressed Tech */}
      <Section id="suppressed" icon={<Zap size={16} />} title={`Suppressed Technologies (${pod.suppressed.length})`} count={pod.suppressed.length}>
        {pod.suppressed.map((s, i) => (
          <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-red-950/10 border border-red-900/30">
            <Zap size={12} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-xs">{s.name}</p>
              <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{s.role}</p>
            </div>
          </div>
        ))}
      </Section>

      {/* Consciousness Systems */}
      <Section id="consciousness" icon={<Sparkles size={16} />} title={`Consciousness Systems (${pod.consciousness.length})`} count={pod.consciousness.length}>
        {pod.consciousness.map((c, i) => (
          <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-purple-950/10 border border-purple-900/30">
            <Sparkles size={12} className="text-purple-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-xs">{c.name}</p>
              <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{c.role}</p>
            </div>
          </div>
        ))}
      </Section>

      {/* Protocol */}
      <Section id="protocol" icon={<Brain size={16} />} title="Session Protocol" count={pod.protocol.length}>
        <ol className="space-y-2">
          {pod.protocol.map((p, i) => (
            <li key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-800/30">
              <span className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: `${pod.color}25`, color: pod.color }}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-xs">{p.phase}</p>
                <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{p.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Disclaimer */}
      <div className="rounded-xl bg-yellow-950/20 border border-yellow-800/40 px-5 py-3">
        <p className="text-yellow-200/70 text-xs leading-relaxed">
          <span className="font-bold text-yellow-300">Research & Experimental:</span> All concepts derived from published works attributed to original authors and the Vedic/Sanskrit tradition. Research prototype — not for clinical diagnostic or therapeutic use without IRB approval and 510(k) clearance. Not for sale. Fair Use (17 U.S.C. § 107).
        </p>
      </div>
    </div>
  );
}