import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Activity, Heart, Brain, Zap, Droplet, Music, Sparkles, Dna, Waves, Clock, Atom, ChevronRight } from "lucide-react";
import TherapyChamber from "../components/TherapyChamber";
import { nodes } from "../lib/beardenData";

// Pull healing-relevant concepts from the graph data
const n = (id) => nodes.find((x) => x.id === id);

const CHAMBERS = [
  {
    name: "Scalar EM Kindling Chamber",
    tagline: "Structured longitudinal wave biopotential charging",
    icon: <Zap size={20} className="text-cyan-400" />,
    accent: "#06b6d4",
    nodes: [
      { id: "scalar_em", short: "Scalar EM" },
      { id: "kindling", short: "Kindling" },
      { id: "scalar_longitudinal", short: "Longitudinal Wave" },
      { id: "t_polarized_photons", short: "T-Photons" },
      { id: "wave_transduction", short: "Wave Transduction" },
      { id: "time_as_energy", short: "Time = Energy" },
    ],
    mechanism:
      "The body is charged with a dynamically structured biopotential via scalar longitudinal waves (E=0, B=0, ∇φ≠0). The t-polarized photon channel carries time-energy at 9×10¹⁶ J/sec density — the most powerful engineering medium available. Wave transduction converts ordinary transverse EM into longitudinal and then time-polarized waves that impress structured templates directly onto the vacuum potential.",
    protocol:
      "Subject reclines in the kindling field. The pod's translator device converts transverse carrier waves into longitudinal scalar waves modulated with the patient's delta-spectrum (the difference between their emitted spectrum and a healthy baseline). 30-second exposures, three times weekly, kindle a self-sustaining negentropic biopotential that reorganizes cellular function.",
  },
  {
    name: "Prioré Multichannel Healing Chamber",
    tagline: "Phase-conjugate disease reversal via nested modulation",
    icon: <Activity size={20} className="text-green-400" />,
    accent: "#22c55e",
    nodes: [
      { id: "priors_device", short: "Prioré Device" },
      { id: "priore_onr", short: "ONR Report" },
      { id: "mccs_cellular_control", short: "MCCS" },
      { id: "dielectric_body_portholes", short: "Body Portholes" },
      { id: "time_reversal_zone", short: "TRZ" },
      { id: "bedini_environmental_conditioning", short: "Bedini Conditioning" },
    ],
    mechanism:
      "Based on Antoine Prioré's French-government-funded device (French Patent 1,342,772, 1962) and validated by ONR Report R-5-78 (1978). The body dielectric is modeled as a 'ship with portholes' — external EM waves enter through frequency windows, are mixed and transduced throughout the body, and emitted back out. The delta between the patient's emission spectrum and a healthy baseline is amplified and re-irradiated, creating a Time-Reversal Zone (TRZ) where phase-conjugate waves predominate. In the TRZ, the disease pattern is time-reversed: cells regenerate to their prior healthy state.",
    protocol:
      "The chamber's electron tubes operate in Bedini's reversed mode, force-fitting the infolded EM environment of the applied signals to the local vacuum structure. A multichannel modulation architecture (F1/F2/F3 → derivative carrier → primary output Fz) impresses a structured virtual-state template onto the target organism's quantum potential. Documented results: 0.7–0.95 survival fraction for terminal conditions across three device generations.",
  },
  {
    name: "Telomere Rejuvenation Chamber",
    tagline: "Anti-aging via amplified phase-conjugate anti-engines",
    icon: <Clock size={20} className="text-amber-400" />,
    accent: "#f59e0b",
    nodes: [
      { id: "telomere_rejuvenation", short: "Telomere Regen" },
      { id: "negentropy", short: "Negentropy" },
      { id: "waddington_cell_lineage", short: "Waddington Valleys" },
      { id: "epigenetic_reprogramming_em", short: "Epigenetic Reset" },
      { id: "mccs_cellular_control", short: "MCCS" },
    ],
    mechanism:
      "The gradual loss of telomeres — the natural ends of chromosomes — is what causes cells to age. This loss produces a precise delta in the spacetime curvature engine accompanying every aging cell. By amplifying the 'precise telomere reduction' correlate from the body's emitted radiation spectrum and re-irradiating the body with phase-conjugate replicas, the cellular matter itself produces the amplified 'aging anti-engine' — adding telomeres back and converting cells to a younger, more vigorous state.",
    protocol:
      "Subject's emission spectrum is captured via the porthole sensors. The aging delta is computed and amplified. Phase-conjugate replicas are re-introduced through the body's portholes, exciting the cells throughout the body. The Waddington cell lineage is retraced — cells move back up the exact differentiation valley they previously descended. Epigenetic gene-expression programs are reset toward totipotency without DNA sequence change.",
  },
  {
    name: "Rife Frequency Chamber",
    tagline: "Pathogen destruction via mortal oscillatory rates",
    icon: <Waves size={20} className="text-blue-400" />,
    accent: "#3b82f6",
    nodes: [
      { id: "rife_microscope", short: "Rife Tech" },
      { id: "lisitsyn_trigger_windows", short: "Lisitsyn Windows" },
      { id: "kaznacheyev", short: "Kaznacheyev" },
      { id: "bedini_environmental_conditioning", short: "Bedini" },
    ],
    mechanism:
      "Every microorganism has a specific electromagnetic frequency — its 'mortal oscillatory rate' (Royal Rife, 1930s) — at which it can be destroyed without harming surrounding tissue. The Lisitsyn trigger-window frequency table maps 24 biological EM coupling windows from 12.5 Hz to 6.1×10¹⁴ Hz. The Kaznacheyev effect proves that cellular disease states are electromagnetic and can be induced or reversed at a distance via UV photon templates. Each cell as it dies emits a photon containing the exact virtual pattern of its death — the carrier for both disease induction and reversal.",
    protocol:
      "The chamber scans the body's pathogen load via the porthole emission spectrum. Each detected pathogen's mortal oscillatory rate is identified from the Lisitsyn window table. Bedini-conditioned signals (infolded dynamics matched to the local vacuum) deliver the precise frequency to the target organisms. Glass blocks the UV carrier; quartz transmits it — the chamber uses quartz-windowed applicators for the UV photon template channel.",
  },
  {
    name: "Nada Brahma Sound Chamber",
    tagline: "Sanskrit mantra as directed longitudinal wave engineering",
    icon: <Music size={20} className="text-yellow-400" />,
    accent: "#eab308",
    nodes: [
      { id: "nada_brahman", short: "Nada Brahma" },
      { id: "sanskrit_mantra_engineering", short: "Mantra Engineering" },
      { id: "chakra_nadi_anatomy", short: "Chakras & Nadis" },
      { id: "prana_kundalini", short: "Prana/Kundalini" },
    ],
    mechanism:
      "The Vedic doctrine 'Nada Brahma' — the universe IS sound. Sanskrit mantras are not symbolic language but precise vibrational operators: each syllable carries a determinate resonant frequency that structures the local vacuum potential. The 50 letters of the Sanskrit alphabet correspond to the 50 petals of the 6 lower chakras — the alphabet IS the frequency map of the body's bioenergetic field. The Gayatri mantra's 24-syllable structure is a 24-frequency scalar template. The Mahamrityunjaya ('death-conquering') mantra's vibrational sequence matches the body's regenerative frequency band (12.5–39.6 Hz, Lisitsyn windows 1–3).",
    protocol:
      "The chamber resonates the body's 72,000 nadis (scalar potential channels) via precisely tuned Sanskrit bija (seed) syllables. The Ida (lunar) and Pingala (solar) channels — the two circular polarization states of O(3) electrodynamics — are coupled through the Sushumna (central longitudinal axis). Kundalini — the serpent power coiled at the base of the spine — is awakened via coherent longitudinal wave amplification through the spinal column, activating each chakra in sequence. Formant frequencies stimulate the corti organ → vagus nerve → limbic system (Tomatis Method).",
  },
  {
    name: "Prana Biofield Chamber",
    tagline: "Mesmer/Reich/Steiner bioenergy integration",
    icon: <Sparkles size={20} className="text-fuchsia-400" />,
    accent: "#ec4899",
    nodes: [
      { id: "prana_kundalini", short: "Prana" },
      { id: "mesmer_animal_magnetism", short: "Animal Magnetism" },
      { id: "reich_orgone", short: "Orgone" },
      { id: "steiner_anthroposophy", short: "Etheric Forces" },
      { id: "morphogenetic_field", short: "Morphogenetic" },
    ],
    mechanism:
      "The universal bioenergy field — called Prana (Vedic), animal magnetism (Mesmer, 1779), orgone (Reich, 1930s–50s), and the etheric formative forces (Steiner, 1910) — is the structured scalar potential that pervades and organizes living matter. Mesmer's hand passes are the directed application of longitudinal waves from the operator's nervous system. Reich's orgone accumulator (alternating organic/metallic layers) produces measurable 1.0–1.8°F temperature differentials — a local reduction in vacuum entropy. Steiner's biodynamic preparations structure water's scalar potential via vortex dynamization.",
    protocol:
      "The chamber walls are constructed in alternating organic/metallic layers (orgone accumulator principle) to concentrate the biofield. A vortex dynamizer structures the chamber's water supply (Schauberger/Steiner principle). The operator's directed intent — the inception/intent mechanism (S''' mind frame → S' EM frame → S matter frame) — impresses a healing template onto the patient's biofield. The morphogenetic field guidance is restored, re-establishing the body's species-level quantum potential coherence.",
  },
  {
    name: "Soma Elixir Chamber",
    tagline: "Vedic rejuvenation substrate + vibrational template",
    icon: <Droplet size={20} className="text-emerald-400" />,
    accent: "#10b981",
    nodes: [
      { id: "vedic_soma_amrita", short: "Soma/Amrita" },
      { id: "telomere_rejuvenation", short: "Telomere Regen" },
      { id: "priors_device", short: "Prioré" },
      { id: "negentropy", short: "Negentropy" },
    ],
    mechanism:
      "Soma (Vedic) / Amrita (post-Vedic) — the sacred elixir described in Rig Veda Mandala 9 (114 hymns) that reverses aging and grants immortality. Soma is simultaneously a plant, a deity, and a vibrational state. The rejuvenation effect is explicit: 'the old become young, the blind see, the lame walk.' The Soma is not merely chemical — its preparation with mantras (structured longitudinal waves) impresses a rejuvenation template onto the plant's scalar potential, which then amplifies the body's own regenerative anti-engine. This is the Vedic precursor of the Prioré device's documented tissue regeneration.",
    protocol:
      "The Soma substrate is prepared in the chamber under precise vibrational conditions — the 28-day lunar cycle modulates the body's scalar potential regeneration rhythm (the Moon is Whittaker-coupled to biological systems). The prepared elixir carries the phase-conjugate anti-engine template. When consumed, the body's cellular matter transduces the incoming longitudinal wave patterns, converting them to time-polarized EM waves that pump the aging cells, adding telomeres and converting them back to a younger state.",
  },
  {
    name: "Akashic Memory Chamber",
    tagline: "Quantum potential access for diagnosis & correction",
    icon: <Brain size={20} className="text-purple-400" />,
    accent: "#a855f7",
    nodes: [
      { id: "akashic_records", short: "Akashic Records" },
      { id: "quantum_potential", short: "Quantum Potential" },
      { id: "mind_body_coupling", short: "Mind-Body Loop" },
      { id: "inception_intent", short: "Inception/Intent" },
      { id: "mind_field", short: "Mind Field" },
      { id: "bioframe", short: "Bioframe" },
    ],
    mechanism:
      "The Akashic Records — the nonlocal memory field described in Patanjali's Yoga Sutras (c. 400 BCE) — is the pre-modern description of the quantum potential as a memory substrate. The vacuum's Whittaker decomposition carries ALL EM information: every event, thought, and interaction impresses a template onto the structured vacuum, and this template persists. The mind-body coupling loop (Figure 5): coherent mind changes (intent) → coherent rotations in 4-space → coherent spacetime curvature engines → observable physical changes. This is the rigorous physical mechanism for intentional healing — the nonmaterial mind inducing observable energy changes on the body.",
    protocol:
      "The subject enters a coherent state via the chamber's ELF entrainment field (synchronized to 10 Hz alpha — the brain's natural healing rhythm). The inception/intent mechanism couples the S''' (mind) frame to the S (matter) frame, allowing the subject's consciousness to read and restructure the Whittaker wave decomposition of their own quantum potential. Diagnosis is performed by reading the Akashic record of the body's disease template; correction is performed by impressing a phase-conjugate healing template via directed intent.",
  },
  {
    name: "Implosion Vortex Chamber",
    tagline: "Schauberger living water + centripetal energy concentration",
    icon: <Droplet size={20} className="text-teal-400" />,
    accent: "#14b8a6",
    nodes: [
      { id: "schauberger_implosion", short: "Implosion" },
      { id: "anenergy", short: "Anenergy" },
      { id: "vacuum_structure", short: "Vacuum" },
      { id: "asymmetric_regauging", short: "Asymmetric Regauging" },
    ],
    mechanism:
      "Viktor Schauberger (1885–1958) discovered that nature's primary energy generation mechanism is implosion — centripetal, inward-spiraling vortex motion — the opposite of all industrial technology. Cold vortexing water at 4°C (maximum density) produces measurable EM anomalies consistent with vacuum coupling at the phase transition boundary. The centripetal vortex concentrates the Poynting-analog energy flow rather than dissipating it. This is the hydrodynamic analog of Bearden's asymmetric regauging — both exploit a natural energy flow asymmetrically, extracting useful work from an ambient energy gradient.",
    protocol:
      "The chamber's water supply is vortexed in a corrugated impeller (Repulsine principle) at 4°C. The inward-spiraling vortex structures the water's scalar potential, charging it with negentropic order. Subjects drink the structured water and/or are immersed in the vortex field. The centripetal vortex concentrates the vacuum energy flow, creating a local reduction in entropy that reorganizes the body's biofield. The 4°C phase-transition boundary maximizes the vacuum coupling effect.",
  },
  {
    name: "Global Scaling Resonance Chamber",
    tagline: "Standing gravitational wave node frequencies",
    icon: <Atom size={20} className="text-indigo-400" />,
    accent: "#6366f1",
    nodes: [
      { id: "global_scaling_gcom", short: "G-Com" },
      { id: "gravitobiology", short: "Gravitobiology" },
      { id: "graviton", short: "Graviton/Whittaker" },
      { id: "lisitsyn_trigger_windows", short: "Lisitsyn Windows" },
      { id: "chronotopology", short: "Chronotopology" },
    ],
    mechanism:
      "Dr. Hartmut Müller's Global Scaling Theory (1982): standing gravitational waves in logarithmic space of scales, with node points at distances of 3 natural logarithm units. Node frequencies: 5 Hz, 101 Hz, 2032 Hz, 40.8 kHz — matching Lisitsyn's biological trigger windows 1–3 and the Prioré therapeutic frequencies. The G-Com® demonstration (October 27, 2001) transmitted language 2,500 km via standing gravitational waves at <1 watt power, with no EM radiation. The body's biological resonances are logarithmically spaced along the same standing wave structure — the therapy pod aligns the body to the cosmic gravitational background field.",
    protocol:
      "The chamber generates a modulated standing gravitational wave using G-Elements (electromagnetically isolated piezoelectric nanocrystal resonators). The subject's body is brought into resonance with the global standing wave node frequencies (5 Hz, 101 Hz, 2032 Hz). Chronotopological time structure is normalized — the subject's biological time is re-aligned with the cosmic time topology. The gravitobiological exchange between the organism and its environment is restored to the healthy baseline.",
  },
];

export default function TherapyPod() {
  const [activeChamber, setActiveChamber] = useState(null);

  const totalConcepts = CHAMBERS.reduce((sum, c) => sum + c.nodes.length, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
              <ArrowLeft size={14} /> Graph
            </Link>
            <div className="w-px h-5 bg-gray-700" />
            <Heart size={16} className="text-rose-400" />
            <div>
              <h1 className="text-white font-black text-lg">Zenith Apex Therapy Pod</h1>
              <p className="text-gray-500 text-xs">{CHAMBERS.length} integrated therapy chambers · {totalConcepts} source concepts</p>
            </div>
          </div>
          <Link
            to="/device-catalogue"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-sm font-bold transition-colors"
          >
            Build Specs <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Hero / Pod Diagram */}
        <div className="rounded-3xl border border-gray-800 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left: Text */}
            <div className="p-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/40 border border-rose-800/50 text-rose-400 text-xs font-bold uppercase tracking-widest w-fit mb-4">
                <Dna size={12} /> Unified Bioelectromagnetic System
              </div>
              <h2 className="text-3xl font-black leading-tight mb-3">
                One Pod. <span className="text-rose-400">Every Healing Modality.</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                The Therapy Pod synthesizes every healing, rejuvenation, and bioenergetic concept from the research
                graph into a single integrated device. Each chamber draws its engineering basis from documented source
                material — Prioré, Rife, Bearden, Reich, Schauberger, and the Vedic nada/chakra/mantra system — unified
                under the scalar EM framework.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <div className="text-center">
                  <p className="text-2xl font-black text-cyan-400">{CHAMBERS.length}</p>
                  <p className="text-gray-600 text-[10px] uppercase tracking-wider">Chambers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-green-400">{totalConcepts}</p>
                  <p className="text-gray-600 text-[10px] uppercase tracking-wider">Concepts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-rose-400">9e16</p>
                  <p className="text-gray-600 text-[10px] uppercase tracking-wider">J/sec Density</p>
                </div>
              </div>
            </div>

            {/* Right: Pod visualization */}
            <div className="relative min-h-[300px] flex items-center justify-center p-8 border-l border-gray-800/50">
              <div className="relative w-56 h-56">
                {/* Outer ring */}
                <div
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: "#ec489940", background: "radial-gradient(circle, #ec489915 0%, transparent 70%)" }}
                />
                {/* Middle ring */}
                <div
                  className="absolute inset-8 rounded-full border border-dashed animate-spin"
                  style={{ borderColor: "#06b6d440", animationDuration: "20s" }}
                />
                {/* Inner core */}
                <div
                  className="absolute inset-16 rounded-full flex items-center justify-center"
                  style={{
                    background: "radial-gradient(circle, #f59e0b30 0%, #ec489920 50%, transparent 100%)",
                    border: "1px solid #f59e0b50",
                  }}
                >
                  <Heart size={28} className="text-rose-400" />
                </div>
                {/* Orbiting chamber dots */}
                {CHAMBERS.map((c, i) => {
                  const angle = (i / CHAMBERS.length) * Math.PI * 2 - Math.PI / 2;
                  const r = 104;
                  const x = 112 + Math.cos(angle) * r;
                  const y = 112 + Math.sin(angle) * r;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setActiveChamber(i)}
                      className="absolute w-7 h-7 rounded-full flex items-center justify-center text-xs transition-transform hover:scale-125"
                      style={{
                        left: `${x - 14}px`,
                        top: `${y - 14}px`,
                        background: `${c.accent}30`,
                        border: `1.5px solid ${c.accent}`,
                      }}
                      title={c.name}
                    >
                      {c.icon}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl bg-yellow-950/20 border border-yellow-800/40 px-5 py-3">
          <p className="text-yellow-200/70 text-xs leading-relaxed">
            <span className="font-bold text-yellow-300">Research & Experimental:</span> All concepts are derived from
            published works attributed to their original authors (Bearden, Prioré, Rife, Reich, Schauberger, et al.)
            and the Vedic/Sanskrit textual tradition. For research and experimental purposes only. Not for medical use.
            Referenced under Fair Use (17 U.S.C. § 107).
          </p>
        </div>

        {/* Chambers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHAMBERS.map((chamber, i) => (
            <TherapyChamber key={chamber.name} index={i + 1} {...chamber} nodes={chamber.nodes.map((node) => ({
              ...node,
              label: n(node.id)?.label || node.short,
            }))} />
          ))}
        </div>

        {/* Bottom: Attribution */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 px-6 py-4">
          <p className="text-gray-500 text-xs leading-relaxed text-center">
            All concepts, theories, and source fragments are derived from and attributed to the published works of
            their original authors, including <span className="text-yellow-300 font-semibold">Lt. Col. T.E. Bearden</span> (Gravitobiology, Excalibur Briefing),
            <span className="text-yellow-300 font-semibold"> Antoine Prioré</span> (French Patent 1,342,772),
            <span className="text-yellow-300 font-semibold"> R.R. Rife</span>,
            <span className="text-yellow-300 font-semibold"> W. Reich</span>,
            <span className="text-yellow-300 font-semibold"> V. Schauberger</span>,
            <span className="text-yellow-300 font-semibold"> J.C. Maxwell</span>, and the Vedic textual tradition (Rig Veda, Upanishads, Yoga Sutras of Patanjali).
            All third-party works remain copyright of their respective authors/estates. Zenith Apex LLC claims no ownership of any third-party source material.
          </p>
        </div>
      </div>
    </div>
  );
}