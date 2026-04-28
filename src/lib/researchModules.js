// Research modules — structured technical analysis framework
// Each module follows: Objective → Source Material → System Breakdown → 
// Engineering Interpretation → Build Implications → Limitations/Unknowns

export const researchModules = {
  "the-4-vectors": {
    title: "The 4-Vector Framework: Foundational Electromagnetic Analysis",
    stripeProductId: "prod_UK6duAtEI5PhM5",
    price: "$147",
    icon: "📐",
    color: "#3b82f6",
    totalSections: 20,
    totalHours: "5.5 hrs",
    primarySource: "Bearden 'Toward a New Electromagnetics Part 3' (1983)",
    modules: [
      {
        title: "Module 1 – The 4-Vector Conflation: Historical Analysis",
        researchObjective: "Identify the mathematical conflation in Maxwell-Heaviside-Gibbs reduction that eliminated scalar potential from standard EM formalism.",
        sourcesMaterial: [
          "Maxwell's original quaternion formulation (1865)",
          "Heaviside's vector reduction (1884–1891)",
          "Gibbs/Heaviside vector algebra (1890s)",
          "Bearden Part 3 Figures 1–5"
        ],
        systemBreakdown: "The single 4-vector notation masks two fundamentally distinct physical entities: massless spatial gradients vs. mass-carrying momentum. Standard textbooks conflate these.",
        engineeringInterpretation: "This conflation eliminated half the electromagnetic potential space from engineering analysis for 140 years.",
        buildImplications: "Scalar potential engineering becomes possible only after distinguishing these 4 vector types mathematically.",
        limitations: "No experimental device built from scalar theory alone; requires coupling with physical implementation architectures."
      },
      {
        title: "Module 2 – Massless vs. Mass-Carrying Vector Distinction",
        researchObjective: "Distinguish the geometer's massless spatial vector from the mechanic's mass-carrying momentum vector.",
        sourcesMaterial: [
          "Bearden Part 3 Figures 6–10",
          "Classical mechanics definitions (Newton, Lagrange)",
          "Differential geometry texts (Do Carmo)"
        ],
        systemBreakdown: "Two mathematically identical-looking 4-vectors represent radically different physical quantities. One has no mass; one carries momentum.",
        engineeringInterpretation: "Separating these allows manipulation of ∇φ independent of mass-based force.",
        buildImplications: "Circuits can be designed to actuate scalar potential gradients without mass-acceleration coupling.",
        limitations: "Requires nonlinear media or topological structures to separate the vector types in practice."
      },
      {
        title: "Module 3 – Charged Particles and the Electrician's Trap",
        researchObjective: "Analyze why treating charged massless charge identically to charged mass leads to engineering failures.",
        sourcesMaterial: [
          "Bearden Part 3, Section on Charged Vectors",
          "Standard textbook treatment of current (Griffiths, Jackson)"
        ],
        systemBreakdown: "Charged massless charge (gradient flow) obeys different equations than charged mass (Lorentz force).",
        engineeringInterpretation: "V=IR applies only to massive charge carriers, not to massless charge gradients. This explains anomalies in certain plasma devices.",
        buildImplications: "Circuit analysis must explicitly track whether current involves massive carriers or gradient flow.",
        limitations: "Detecting and isolating massless charge flow experimentally is technically difficult."
      },
      {
        title: "Module 4 – Force as Derived, Not Fundamental",
        researchObjective: "Demonstrate that force is an effect, not a fundamental entity—derived from mass-acceleration or work-energy transformations.",
        sourcesMaterial: [
          "Bearden Part 3, F = [Ma + mv] analysis",
          "Lagrangian mechanics (Goldstein)"
        ],
        systemBreakdown: "In vacuum, massless entities (photons, scalar potentials) cannot exert force. Force requires mass × acceleration.",
        engineeringInterpretation: "Scalar potential fields can do work without exerting measurable force on test masses.",
        buildImplications: "Energy systems can be coupled to scalar fields without requiring mechanical force.",
        limitations: "Energy transfer without detectable force is difficult to measure and verify experimentally."
      },
      {
        title: "Module 5 – The Epsilon-s vs. E-m Distinction",
        researchObjective: "Differentiate the massless charge gradient (ε_s) from the electromagnetic field (E_m) in vacuum.",
        sourcesMaterial: [
          "Bearden Part 3, EM field analysis",
          "Whittaker (1903) papers on potential decomposition"
        ],
        systemBreakdown: "Vacuum cannot sustain propagating E-fields (requires charged matter). It contains scalar potential gradients.",
        engineeringInterpretation: "Antenna theory, capacitor design, and EM propagation must be reformulated for scalar gradient propagation.",
        buildImplications: "Scalar transmitters and receivers operate on fundamentally different principles than Hertzian antennas.",
        limitations: "Standard EM test equipment is blind to pure scalar fields; specialized detectors required."
      }
    ]
  },

  "scalar-longitudinal-wave-engineering": {
    title: "Scalar Longitudinal Wave Systems: Technical Framework",
    stripeProductId: "prod_UK6dMpBcrEfAEZ",
    price: "$247",
    icon: "📡",
    color: "#3b82f6",
    totalSections: 24,
    totalHours: "7 hrs",
    primarySource: "Bearden 'Toward a New Electromagnetics Part 4' (1983)",
    modules: [
      {
        title: "Module 1 – Longitudinal vs. Transverse Propagation",
        researchObjective: "Define the physical and mathematical distinction between transverse (Hertzian) and longitudinal (scalar) wave modes.",
        sourcesMaterial: [
          "Maxwell equations in quaternion form",
          "Whittaker potential decomposition (1903)",
          "Aharonov-Bohm experimental literature"
        ],
        systemBreakdown: "Transverse waves (E⊥B) propagate via electromagnetic field interaction. Longitudinal waves propagate via scalar potential gradients (∇φ) with E=0, B=0.",
        engineeringInterpretation: "Standing scalar waves can be established in geometric topologies where transverse fields cancel.",
        buildImplications: "Toroidal and shielded geometries can confine and manipulate scalar potential independent of EM radiation.",
        limitations: "Scalar wave detection requires specialized instrumentation. Standard oscilloscopes cannot directly measure ∇φ."
      },
      {
        title: "Module 2 – Translator Architecture: Conversion Mechanism",
        researchObjective: "Detail the device topology for converting transverse EM input into scalar potential output.",
        sourcesMaterial: [
          "Bearden Part 4 Figures, Translator Diagrams",
          "Nonlinear media theory (Boyd, Shen)"
        ],
        systemBreakdown: "A nonlinear medium driven by orthogonal transverse fields can generate scalar potential output.",
        engineeringInterpretation: "Crystal arrays or ferrite materials can serve as transducers between field domains.",
        buildImplications: "Component specifications: quartz arrays, ferrite toroids, crystal orientation, coil geometries.",
        limitations: "Efficiency of energy conversion is unknown. No published measurements of scalar output amplitude."
      },
      {
        title: "Module 3 – Detection Framework",
        researchObjective: "Establish measurement protocols for detecting and quantifying scalar potential fields.",
        sourcesMaterial: [
          "Bearden Part 4 Detection Section",
          "Quartz resonator physics (IEEE papers)"
        ],
        systemBreakdown: "Standard antennas are blind to scalar potentials. Detection via quartz crystal statistical anomalies.",
        engineeringInterpretation: "Crystal lattice disturbance statistics reveal scalar field presence.",
        buildImplications: "Custom detector arrays required. Protocol: baseline crystal noise measurement → field exposure → anomaly detection.",
        limitations: "Signal-to-noise ratio poorly understood. High false-positive rate in preliminary setups."
      },
      {
        title: "Module 4 – Scalar Pulse Radar Framework",
        researchObjective: "Analyze theoretical radar architecture using scalar pulse propagation with instantaneous arrival.",
        sourcesMaterial: [
          "Bearden radar concept",
          "Quantum mechanics instantaneous action literature"
        ],
        systemBreakdown: "Scalar pulses propagate via quantum potential (non-local mechanism), arriving instantaneously. Conventional Hertzian reflection arrives with classical delay.",
        engineeringInterpretation: "Range measurement via Δt between scalar arrival and delayed Hertzian echo.",
        buildImplications: "Radar system design: pulse generator → target → scalar detector (fast) + Hertzian receiver (delayed).",
        limitations: "No working demonstration. Theoretical prediction only. Requires complete detector validation first."
      },
      {
        title: "Module 5 – Energy Bottle Topology",
        researchObjective: "Model the standing wave interference pattern created by two scalar transmitters.",
        sourcesMaterial: [
          "Bearden Energy Bottle concept",
          "Interference pattern mathematics"
        ],
        systemBreakdown: "Two synchronized transmitters create zones of constructive and destructive interference. Constructive zones trap energy.",
        engineeringInterpretation: "Transmitter pair geometry (separation, phase, power) determines energy localization.",
        buildImplications: "Device design: dual transmitters + geometric control + target positioning.",
        limitations: "Energy transfer mechanism unclear. No measurements of energy extraction from bottle."
      },
      {
        title: "Module 6 – Scalar Standing Waves in Magnetic Materials",
        researchObjective: "Analyze scalar wave coupling to ferromagnetic domain structures.",
        sourcesMaterial: [
          "Ferromagnetism theory",
          "Domain wall physics",
          "Bearden MEG flux-gating concept"
        ],
        systemBreakdown: "Ferromagnetic domains can support scalar wave modes coupled to magnetic structure.",
        engineeringInterpretation: "Nanocrystalline toroids provide geometric and magnetic conditions for scalar resonance.",
        buildImplications: "Core material selection, winding geometry, operating frequency windows.",
        limitations: "Mechanism for scalar-to-magnetic coupling not fully characterized. Device performance highly geometry-sensitive."
      }
    ]
  },

  "anenergy-phi-field": {
    title: "Anenergy Systems: Scalar Potential Energy Extraction Framework",
    stripeProductId: "prod_UK6d3qvfMq12d7",
    price: "$197",
    icon: "⚡",
    color: "#22c55e",
    totalSections: 22,
    totalHours: "6 hrs",
    primarySource: "Bearden 'Toward a New Electromagnetics Part 4' (1983); Moray, Kervran, Reich references",
    modules: [
      {
        title: "Module 1 – Anenergy: The Scalar Potential as Non-Energy",
        researchObjective: "Establish the distinction between anenergy (scalar potential φ) and energy (coupled to mass).",
        sourcesMaterial: [
          "Bearden conservation law: |Mc| + |AEc| = K₁",
          "Extended charge conservation",
          "Massless charge physics"
        ],
        systemBreakdown: "Standard physics recognizes energy E only. Bearden framework adds anenergy A (scalar potential without coupled energy).",
        engineeringInterpretation: "Circuits can pump anenergy (massless charge) without energy loss, then couple it to load for work.",
        buildImplications: "Anenergy pump design: generate ∇φ without energy drain → deliver to load → extract work.",
        limitations: "Anenergy concept lacks experimental confirmation. No independent peer-reviewed measurement of isolated anenergy."
      },
      {
        title: "Module 2 – The Anenergy Pump Circuit",
        researchObjective: "Detail the shielded toroid architecture for pumping anenergy without energy loss.",
        sourcesMaterial: [
          "Bearden Part 4 Pump Diagrams (Figures 15–22)",
          "Toroid shielding theory"
        ],
        systemBreakdown: "Shielded toroid: interior ∇φ ≠ 0 while ∇φ = 0 on exterior. Charge accumulates inside without external field.",
        engineeringInterpretation: "Interior gradient maintained by charge trapping; exterior shielding prevents energy loss.",
        buildImplications: "Construction: toroid core, shielding material, winding count, insulation specifications, trap electrode geometry.",
        limitations: "No published working prototype. Shielding requirements poorly understood. Interior ∇φ measurement difficult."
      },
      {
        title: "Module 3 – Trapped Charge Extraction",
        researchObjective: "Analyze the mechanism for extracting work from trapped scalar potential.",
        sourcesMaterial: [
          "Charge-to-load coupling theory",
          "Ground-return current paths"
        ],
        systemBreakdown: "Charges trapped in ∇φ zone can conduct current via wire path to ground when opened to load.",
        engineeringInterpretation: "Current flows due to ∇φ gradient, not energy coupling.",
        buildImplications: "Load design must allow gradient-driven current without resistive energy loss.",
        limitations: "Load behavior unclear. Does current represent energy? How is thermodynamic law maintained?"
      },
      {
        title: "Module 4 – Oscillated Phi: Moray Steady-State Mechanism",
        researchObjective: "Reverse-engineer the oscillating scalar potential approach used in historical Moray device.",
        sourcesMaterial: [
          "Moray photographs and patent literature",
          "Bearden Moray analysis"
        ],
        systemBreakdown: "Moray device appears to use oscillated scalar potential applied to special crystal structure.",
        engineeringInterpretation: "Frequency and waveform shape may determine energy extraction efficiency.",
        buildImplications: "DDS implementation: variable frequency, waveform optimization, crystal selection.",
        limitations: "No confirmed Moray device reproduction. Exact crystal composition unknown. Working principle speculative."
      },
      {
        title: "Module 5 – Nuclear-Level Phi Effects",
        researchObjective: "Analyze theoretical scalar potential effects on nuclear processes (transmutation, decay acceleration).",
        sourcesMaterial: [
          "Kervran biological transmutation data",
          "Reich effect papers",
          "Beta decay acceleration literature"
        ],
        systemBreakdown: "Scalar potentials may lower nuclear Coulomb barriers, enabling transmutation or decay rate changes.",
        engineeringInterpretation: "Nuclear-level ∇φ application requires extremely high gradients or special resonance conditions.",
        buildImplications: "Device design: high-voltage scalar generator + resonance tuning + containment.",
        limitations: "No replicated transmutation. Experimental verification absent. Theory highly speculative."
      },
      {
        title: "Module 6 – The Complete Anenergy Cycle",
        researchObjective: "Map the full system: generation → storage → extraction → load coupling → recycling.",
        sourcesMaterial: [
          "Complete conservation equations",
          "System topology analysis"
        ],
        systemBreakdown: "Pump generates → Trap stores → Load couples → Recycle path returns charge.",
        engineeringInterpretation: "System must close all loops with zero net energy input.",
        buildImplications: "Circuit topology, control logic, feedback mechanisms, component specifications.",
        limitations: "Feasibility unknown. No experimental demonstration of sustained cycles."
      }
    ]
  },

  "gravitobiology": {
    title: "Gravitobiological Systems Analysis: Theory and Framework",
    stripeProductId: "prod_UK6dViE3GxDCpu",
    price: "$397",
    icon: "🧫",
    color: "#a855f7",
    totalSections: 40,
    totalHours: "12 hrs",
    primarySource: "Bearden Gravitobiology (1991/2019 Energetic Productions)",
    modules: [
      {
        title: "Module 1 – Gravitobiology Framework vs. Standard Photobiology",
        researchObjective: "Establish the theoretical basis for EM control of biological systems beyond photon absorption.",
        sourcesMaterial: [
          "Bearden Gravitobiology text",
          "Photobiology literature (comparison)",
          "Holographic principle references"
        ],
        systemBreakdown: "Standard photobiology: light absorption → chemical reaction. Gravitobiology: quantum potential (non-local EM) → systemic reprogramming.",
        engineeringInterpretation: "Biological systems respond to EM fields via mechanisms beyond classical photon coupling.",
        buildImplications: "Therapy devices operate via EM field topology, not light wavelength.",
        limitations: "No direct experimental confirmation. Theoretical framework only. Mechanism speculative."
      }
    ]
  }
};

export function findResearchModule(titleSlug) {
  return researchModules[titleSlug] || null;
}

export const moduleSlugMap = {
  "prod_UK6duAtEI5PhM5": "the-4-vectors",
  "prod_UK6dMpBcrEfAEZ": "scalar-longitudinal-wave-engineering",
  "prod_UK6d3qvfMq12d7": "anenergy-phi-field",
  "prod_UK6dViE3GxDCpu": "gravitobiology",
};