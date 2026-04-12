// Detailed lesson plans for each course — keyed by course title slug
// Each module has 3–5 lessons with description + duration estimate

export const coursePlans = {
  "the-4-vectors": {
    title: "The 4 Vectors: Bearden's Foundation of Physical Reality",
    stripeProductId: "prod_UK6duAtEI5PhM5",
    price: "$147",
    icon: "📐",
    color: "#3b82f6",
    totalLessons: 20,
    totalHours: "5.5 hrs",
    source: "Bearden 'Toward a New Electromagnetics Part 3' (1983)",
    modules: [
      {
        title: "Module 1 – Why One Symbol Broke Physics: The 4-Vector Conflation",
        lessons: [
          { title: "1.1 – The Single Equation That Hid Vacuum Energy for 140 Years", duration: "18 min" },
          { title: "1.2 – The History: Maxwell → Heaviside → Gibbs Reduction", duration: "22 min" },
          { title: "1.3 – What Was Lost When the Scalar Potential Was Discarded", duration: "20 min" },
          { title: "1.4 – Lab Exercise: Find the 4-Vector Conflation in a Standard Textbook", duration: "15 min" },
        ],
      },
      {
        title: "Module 2 – Massless Spatial vs Mass System Vectors (Geometer vs Mechanic)",
        lessons: [
          { title: "2.1 – The Geometer's Vector: Space Without Mass", duration: "16 min" },
          { title: "2.2 – The Mechanic's Vector: Mass Carrying Momentum", duration: "18 min" },
          { title: "2.3 – Why They Look the Same But Are Fundamentally Different", duration: "20 min" },
          { title: "2.4 – Original 1983 Diagrams: Part 3 Figure-by-Figure", duration: "25 min" },
        ],
      },
      {
        title: "Module 3 – Charged Mass vs Charged Spatial Vectors (Electrician's Trap)",
        lessons: [
          { title: "3.1 – The Electrician's Vector: Charged Mass in Motion", duration: "18 min" },
          { title: "3.2 – The Advanced Electrician's Vector: Massless Charge", duration: "20 min" },
          { title: "3.3 – Why V=IR Does NOT Apply to Massless Charge Flow", duration: "22 min" },
          { title: "3.4 – The 4-Type Taxonomy: Side-by-Side Comparison Chart", duration: "14 min" },
        ],
      },
      {
        title: "Module 4 – Force Is an Effect: F = [Ma + mv] Unpacked",
        lessons: [
          { title: "4.1 – The Microscopic Force Vector: F IS Mass-Acceleration", duration: "18 min" },
          { title: "4.2 – Force Does Not Exist in Vacuum: Formal Derivation", duration: "20 min" },
          { title: "4.3 – Energy as Effect: Work Without Mass", duration: "16 min" },
          { title: "4.4 – Massless Charge → Energy → Mass: The New Cycle", duration: "22 min" },
        ],
      },
      {
        title: "Module 5 – E-Fields Don't Exist in Vacuum: What Does",
        lessons: [
          { title: "5.1 – The Epsilon-s vs E-m Distinction: Two Completely Different Things", duration: "20 min" },
          { title: "5.2 – What the Vacuum Actually Contains: Massless Charge Gradients", duration: "18 min" },
          { title: "5.3 – Implications for Antenna Theory, Capacitors & EM Propagation", duration: "24 min" },
          { title: "5.4 – Final Synthesis: Rebuilding EM Theory From Correct Foundations", duration: "28 min" },
        ],
      },
    ],
  },

  "scalar-longitudinal-wave-engineering": {
    title: "Scalar Longitudinal Wave Engineering: Theory to Device",
    stripeProductId: "prod_UK6dMpBcrEfAEZ",
    price: "$247",
    icon: "📡",
    color: "#3b82f6",
    totalLessons: 24,
    totalHours: "7 hrs",
    source: "Bearden 'Toward a New Electromagnetics Part 4' (1983)",
    modules: [
      {
        title: "Module 1 – What Makes a Wave Longitudinal: E=0, B=0, gradient-phi ≠ −E",
        lessons: [
          { title: "1.1 – Transverse vs Longitudinal: The Fundamental Distinction", duration: "20 min" },
          { title: "1.2 – Why E=0 and B=0 Still Allows Wave Propagation", duration: "22 min" },
          { title: "1.3 – The Scalar Phi-Field: Gradient Without E-Field", duration: "18 min" },
          { title: "1.4 – Aharonov-Bohm Effect as Experimental Proof", duration: "20 min" },
        ],
      },
      {
        title: "Module 2 – The Translator Device: Converting Transverse to Scalar",
        lessons: [
          { title: "2.1 – Translator Architecture: How Transverse Input Becomes Scalar Output", duration: "24 min" },
          { title: "2.2 – Nonlinear Media as the Conversion Mechanism", duration: "22 min" },
          { title: "2.3 – Original 1983 Translator Diagrams Decoded", duration: "26 min" },
          { title: "2.4 – Building a Translator: Component Selection and Winding Guide", duration: "30 min" },
        ],
      },
      {
        title: "Module 3 – Why Normal Detectors Are Blind (and How to Build a Special One)",
        lessons: [
          { title: "3.1 – How Standard Antennas Work — and Why They Miss Scalar", duration: "18 min" },
          { title: "3.2 – The Special Detector: Quartz Crystal Array Architecture", duration: "22 min" },
          { title: "3.3 – Statistical Detection: Seeing Scalar as Anomalous Noise Burst", duration: "20 min" },
          { title: "3.4 – Calibration Protocol and False-Positive Elimination", duration: "18 min" },
        ],
      },
      {
        title: "Module 4 – Scalar Pulse Radar: Range Without Hertz Reflection",
        lessons: [
          { title: "4.1 – The Scalar Pulse Radar Concept: Instantaneous Arrival + Delayed Hertz", duration: "20 min" },
          { title: "4.2 – Delta-t Measurement: Computing Range from the Time Difference", duration: "22 min" },
          { title: "4.3 – Stealth Implications: Why Conventional RCS Is Irrelevant to Scalar", duration: "18 min" },
        ],
      },
      {
        title: "Module 5 – Energy Bottle: Two-Transmitter Interference Architecture",
        lessons: [
          { title: "5.1 – The Energy Bottle Concept: Constructive + Destructive Zone Map", duration: "22 min" },
          { title: "5.2 – Transmitter Pair Geometry: Spacing, Phasing, Power", duration: "20 min" },
          { title: "5.3 – What Happens Inside the Bottle: Explosive Energy Convergence", duration: "18 min" },
          { title: "5.4 – Applications: Target Location, Detection Evasion, Defense", duration: "16 min" },
        ],
      },
      {
        title: "Module 6 – Standing Scalar Waves in Magnetic Materials",
        lessons: [
          { title: "6.1 – Ferromagnetic Domain Wall Coupling to Scalar Phi-Field", duration: "20 min" },
          { title: "6.2 – Standing Wave Patterns in Nanocrystalline Toroids", duration: "22 min" },
          { title: "6.3 – MEG Connection: How Standing Scalar Waves Enable Flux Gating", duration: "24 min" },
        ],
      },
    ],
  },

  "anenergy-phi-field": {
    title: "Anenergy: Engineering the Phi-Field for Free Energy Extraction",
    stripeProductId: "prod_UK6d3qvfMq12d7",
    price: "$197",
    icon: "⚡",
    color: "#22c55e",
    totalLessons: 22,
    totalHours: "6 hrs",
    source: "Bearden 'Toward a New Electromagnetics Part 4' (1983); Moray, Kervran, Reich references",
    modules: [
      {
        title: "Module 1 – Phi vs Energy: The Anenergy Distinction",
        lessons: [
          { title: "1.1 – What Is Anenergy? The Phi-Field as Non-Energy", duration: "18 min" },
          { title: "1.2 – The Conservation of Charge Extended: |Mc| + |AEc| = K₁", duration: "20 min" },
          { title: "1.3 – The New Cycle: Massless Charge → Energy (the missing arrow)", duration: "22 min" },
          { title: "1.4 – Why Standard Physics Only Knows Half the Triangle", duration: "16 min" },
        ],
      },
      {
        title: "Module 2 – The Free Anenergy Pump Circuit (with original diagrams)",
        lessons: [
          { title: "2.1 – Standard Phi-River Circuit: Why It Fails (Spray Nozzle Problem)", duration: "20 min" },
          { title: "2.2 – The Shielded Toroid Solution: ∇φ=0 Inside, φ > φ₀", duration: "22 min" },
          { title: "2.3 – Part 4 Figures: Every Pump Diagram Decoded Step by Step", duration: "28 min" },
          { title: "2.4 – Component Selection and Winding Specifications", duration: "24 min" },
        ],
      },
      {
        title: "Module 3 – Trapped Charge Extraction: Getting Work from Vacuum",
        lessons: [
          { title: "3.1 – How Trapped Charges Actualize the Phi-Gradient as Current", duration: "18 min" },
          { title: "3.2 – The Wire-to-Ground Path: Creating ∇φ in the Load Only", duration: "20 min" },
          { title: "3.3 – Measurement Protocol: Confirming Vacuum Extraction", duration: "16 min" },
        ],
      },
      {
        title: "Module 4 – Oscillated Phi: The Moray Steady-State Mechanism",
        lessons: [
          { title: "4.1 – The Moray Device: Photo Analysis and Architecture Reverse-Engineering", duration: "26 min" },
          { title: "4.2 – Oscillated Phi-Application: Achieving Steady-State Emission", duration: "22 min" },
          { title: "4.3 – Modern Equivalent: DDS + MOSFET Implementation of the Moray Cycle", duration: "28 min" },
        ],
      },
      {
        title: "Module 5 – Nuclear Phi-Effects: Kervran, Reich, and Element Transmutation",
        lessons: [
          { title: "5.1 – Kervran: Biological Transmutation as Phi-Field Nuclear Reaction", duration: "20 min" },
          { title: "5.2 – Reich Effect: Phi-Field Acceleration of Radioactive Decay", duration: "18 min" },
          { title: "5.3 – Isomer Chain Transmutation: Moving Along the Nuclear Ladder", duration: "22 min" },
        ],
      },
      {
        title: "Module 6 – The Massless Charge Cycle: Full Conservation Picture",
        lessons: [
          { title: "6.1 – AE₁ + AE₂ + AE₃ = K₃: The Unified Conservation Law", duration: "18 min" },
          { title: "6.2 – Spinning Particle Coupled to Phi-Flux: The Electron as Transducer", duration: "20 min" },
          { title: "6.3 – Complete System Design: Anenergy Pump + Load + Recycling Loop", duration: "26 min" },
        ],
      },
    ],
  },

  "gravitobiology": {
    title: "Gravitobiology: The Soviet Secret Science of EM Life Control",
    stripeProductId: "prod_UK6dViE3GxDCpu",
    price: "$397",
    icon: "🧫",
    color: "#a855f7",
    totalLessons: 40,
    totalHours: "12 hrs",
    source: "Bearden Gravitobiology (1991/2019 Energetic Productions)",
    modules: [
      {
        title: "Module 1 – Gravitobiology vs Photobiology: The Holographic Shift",
        lessons: [
          { title: "1.1 – What Is Gravitobiology? Beyond Photobiology's Limits", duration: "20 min" },
          { title: "1.2 – The Holographic Body: Part Conditions Whole, Whole Conditions Part", duration: "22 min" },
          { title: "1.3 – Demolishing the Reductionist Superposition Principle in Biology", duration: "18 min" },
          { title: "1.4 – Physical Reality as an Engineerable Bubble, Not a Stone", duration: "20 min" },
        ],
      },
      {
        title: "Module 2 – Graviton Structure: Coupled Photon Pairs & Whittaker Waves",
        lessons: [
          { title: "2.1 – The Graviton as Spin-2 Coupled Photon/Antiphoton Pair", duration: "20 min" },
          { title: "2.2 – Whittaker Standing Potential Waves: The Hidden EM Structure", duration: "24 min" },
          { title: "2.3 – The Graviton Lattice of Spacetime: Figure 20 Decoded", duration: "22 min" },
          { title: "2.4 – Virtual Photon Flux in the Vacuum: Creation/Annihilation Rates", duration: "18 min" },
        ],
      },
      {
        title: "Module 3 – The Quantum Potential: Non-Local EM Information",
        lessons: [
          { title: "3.1 – Bohm's Hidden Variable Theory and the Quantum Potential", duration: "20 min" },
          { title: "3.2 – Aharonov-Bohm Proof: QP Acts Where E and B Are Zero", duration: "22 min" },
          { title: "3.3 – QP as Whittaker-Structured EM Information Carrier", duration: "20 min" },
          { title: "3.4 – Non-Locality and Instantaneous Action: What It Means for Biology", duration: "18 min" },
        ],
      },
      {
        title: "Module 4 – Soviet Woodpecker Decoded: EM BW Delivery Architecture",
        lessons: [
          { title: "4.1 – The Woodpecker Signal: 1976 Discovery and Worldwide Detection", duration: "18 min" },
          { title: "4.2 – Duga-3 Array Geometry and Standing Wave Interference Grid", duration: "22 min" },
          { title: "4.3 – Table 6: Real-Time Anomalous EMI via Quantum Potential", duration: "20 min" },
          { title: "4.4 – The 10 Hz ELF Modulation: Brain Entrainment Mechanism", duration: "22 min" },
          { title: "4.5 – Johns Hopkins Moscow Embassy Study: Field Test Evidence", duration: "16 min" },
        ],
      },
      {
        title: "Module 5 – EM Trigger Windows & Biological Warfare Tables",
        lessons: [
          { title: "5.1 – Lisitsyn's 24 Biological Rhythm Frequencies", duration: "20 min" },
          { title: "5.2 – Table 12: Complete EM Trigger Window Catalog", duration: "24 min" },
          { title: "5.3 – Beck, Hunt, and Western Confirmation of Soviet Windows", duration: "18 min" },
          { title: "5.4 – Gulf War Disease as QP Weapon Test: ABC vs French Troops", duration: "22 min" },
        ],
      },
      {
        title: "Module 6 – Phase Conjugate Mirrors: Time-Reversal in Practice",
        lessons: [
          { title: "6.1 – What Is a Phase Conjugate Mirror? Time-Reversal Defined", duration: "20 min" },
          { title: "6.2 – Pumped Phase Conjugate Mirror: Amplified Time-Reversal", duration: "22 min" },
          { title: "6.3 – Figures 10-11: PPCM Architecture Decoded", duration: "24 min" },
          { title: "6.4 – TR Zones in Biology: Coulomb Barrier Becomes Coulomb Assistant", duration: "20 min" },
        ],
      },
      {
        title: "Module 7 – Morphogenetic Field: Gravitobiological Evolution Mechanism",
        lessons: [
          { title: "7.1 – The Morphogenetic Field as Real Whittaker-Structured QP Field", duration: "20 min" },
          { title: "7.2 – Species-Level EM Guidance of Embryological Development", duration: "18 min" },
          { title: "7.3 – Cancer as Morphogenetic Field Disruption", duration: "22 min" },
        ],
      },
      {
        title: "Module 8 – Earth/Sun/Moon Whittaker Coupling & Gaia Physics",
        lessons: [
          { title: "8.1 – Three-Body Whittaker Feedback Triangle", duration: "18 min" },
          { title: "8.2 – Figure 18: Earth/Sun/Moon EM Coupling Decoded", duration: "20 min" },
          { title: "8.3 – Gaia as Gravitobiological System: Physical Basis", duration: "18 min" },
        ],
      },
      {
        title: "Module 9 – EM Pollution, Cancer, and the Drug Culture Mechanism",
        lessons: [
          { title: "9.1 – Internal EM Pollution: Powerlines, Devices, Scalar Transmitters", duration: "20 min" },
          { title: "9.2 – How Low-Level Scalar Irradiation Disrupts Neurochemistry (p.50)", duration: "22 min" },
          { title: "9.3 – The Unsuspected Deadly Nature of Internal EM Pollution (p.48)", duration: "18 min" },
        ],
      },
      {
        title: "Module 10 – Products and Revenue from the Gravitobiology Framework",
        lessons: [
          { title: "10.1 – 8 Product Categories Derived from This Course", duration: "18 min" },
          { title: "10.2 – IP Strategy: What Is Patentable, What Is Prior Art", duration: "20 min" },
          { title: "10.3 – Market Sizing: DoD, Biotech, and Wellness Channels", duration: "16 min" },
          { title: "10.4 – Investment Pitch: How to Present This Framework to Investors", duration: "22 min" },
        ],
      },
    ],
  },

  "bioelectromagnetics-kindling": {
    title: "Bioelectromagnetics & the Kindling Effect",
    stripeProductId: "prod_UK6dOVTKfVuo3j",
    price: "$297",
    icon: "🧬",
    color: "#22c55e",
    totalLessons: 28,
    totalHours: "8 hrs",
    source: "Bearden 'Kindling, Life, Mind and Negentropy'; Kaznacheyev cytopathogenic effect",
    modules: [
      {
        title: "Module 1 – The Body as a Bioelectromagnetic System",
        lessons: [
          { title: "1.1 – Beyond Biochemistry: The EM Layer of Life", duration: "18 min" },
          { title: "1.2 – The Biophoton Field: Popp's Master Cell Control Frequencies", duration: "22 min" },
          { title: "1.3 – TW Emissions from the Living Body: What We Actually Measure", duration: "20 min" },
          { title: "1.4 – Why Biochemistry Is the Shadow, Not the Cause", duration: "16 min" },
        ],
      },
      {
        title: "Module 2 – Kindling: Charging Nuclear Mass with Biopotentials",
        lessons: [
          { title: "2.1 – The Kindling Concept: From Spark to Sustained Fire", duration: "18 min" },
          { title: "2.2 – Charging Atomic Nuclei with Dynamically Structured Biopotentials", duration: "22 min" },
          { title: "2.3 – Life as a Self-Kindling Negentropic System", duration: "20 min" },
          { title: "2.4 – Disease as Kindling Disruption: What Breaks the Pattern", duration: "18 min" },
        ],
      },
      {
        title: "Module 3 – Kaznacheyev: Disease Transmitted by UV Photons",
        lessons: [
          { title: "3.1 – The Kaznacheyev Experiments: 10,000+ Replications", duration: "20 min" },
          { title: "3.2 – Glass vs Quartz: Why the Optical Path Determines Disease Transmission", duration: "22 min" },
          { title: "3.3 – The Dying Cell's UV Emission: Exact Virtual Pattern of Death", duration: "20 min" },
          { title: "3.4 – The Cytopathogenic Effect as Foundational EM Biology Proof", duration: "18 min" },
        ],
      },
      {
        title: "Module 4 – Rife's Prismatic Microscope & Mortal Oscillatory Rates",
        lessons: [
          { title: "4.1 – Rife's Universal Prismatic Microscope: How It Saw Living Viruses", duration: "22 min" },
          { title: "4.2 – Mortal Oscillatory Rate: Each Pathogen Has Its Destruction Frequency", duration: "20 min" },
          { title: "4.3 – Why Rife's Work Matches Bearden's Framework", duration: "18 min" },
          { title: "4.4 – Modern Equivalents: DDS Frequency Generator Protocol", duration: "20 min" },
        ],
      },
      {
        title: "Module 5 – Negentropy: How Life Fights the 2nd Law",
        lessons: [
          { title: "5.1 – Entropy vs Negentropy: The EM Ordering Mechanism", duration: "18 min" },
          { title: "5.2 – The Standing Negentropic Wave: Self-Organizing EM Structure", duration: "20 min" },
          { title: "5.3 – Death as Kindling Pattern Collapse: Final Entropy State", duration: "16 min" },
        ],
      },
      {
        title: "Module 6 – Scalar EM and Engineered Pathogens (Historical Analysis)",
        lessons: [
          { title: "6.1 – AIDS: Biological Warfare (Bearden 1984) — Historical Overview", duration: "22 min" },
          { title: "6.2 – Kindling Effect Applied to Viral DNA Engineering", duration: "20 min" },
          { title: "6.3 – Gulf War Syndrome as Field Test: Evidence and Analysis", duration: "22 min" },
        ],
      },
      {
        title: "Module 7 – Therapeutic Frequency Applications & Research Directions",
        lessons: [
          { title: "7.1 – Lisitsyn's 24 Biological Rhythm Frequencies as Therapy Windows", duration: "20 min" },
          { title: "7.2 – Building a Trigger Window Therapy Device: DDS Protocol", duration: "24 min" },
          { title: "7.3 – Research Lab Setup: Tools, Safety, and Measurement Protocol", duration: "22 min" },
        ],
      },
    ],
  },

  "priore-machine": {
    title: "The Priore Machine: Science, Politics, and the Suppression of an Electromagnetic Cancer Cure",
    stripeProductId: "prod_UK6dOmbdthIa0u",
    price: "$297",
    icon: "🦠",
    color: "#22c55e",
    totalLessons: 28,
    totalHours: "8.5 hrs",
    source: "ONR R-5-78 (Bateman, 1978); Esquire July 1975 (Rorvik); French Patent 1,342,772",
    modules: [
      {
        title: "Module 1 – Priore's Discovery: Orange Preservation and Radar Frequencies",
        lessons: [
          { title: "1.1 – The Bordeaux Discovery: How Priore Stumbled Upon the Effect", duration: "18 min" },
          { title: "1.2 – Radar Frequencies and Biological Anomalies: First Observations", duration: "20 min" },
          { title: "1.3 – From Kitchen Experiment to French Government Program: The Timeline", duration: "22 min" },
          { title: "1.4 – Priore the Man: Biography and Scientific Approach", duration: "16 min" },
        ],
      },
      {
        title: "Module 2 – The 1962 French Patent: What the Machine Actually Does",
        lessons: [
          { title: "2.1 – Patent 1,342,772 Full Analysis: The Cyclotron + Magnetron Architecture", duration: "26 min" },
          { title: "2.2 – The Five Patent Plates Decoded: Figure-by-Figure Engineering Analysis", duration: "28 min" },
          { title: "2.3 – 10,000–20,000 Gauss Magnetic Field: Why Field Strength Matters", duration: "20 min" },
          { title: "2.4 – Wavelength Selection: 14 cm for Liver, 19.5 cm for Spleen — Why", duration: "18 min" },
        ],
      },
      {
        title: "Module 3 – The Animal Experiments (1960–1975): T8 Cancer, Trypanosomiasis, Cholesterol",
        lessons: [
          { title: "3.1 – T8 Uterine Cancer Series: 48 Rats, All Controls Dead, All Experimentals Cured", duration: "22 min" },
          { title: "3.2 – Trypanosomiasis Experiments: Immunity Transfer and 200M Trypanosome Challenge", duration: "20 min" },
          { title: "3.3 – Cholesterol Normalization Experiments (Pautrizel Series)", duration: "18 min" },
          { title: "3.4 – Nobel Laureate André Lwoff's Validation: What He Saw", duration: "16 min" },
        ],
      },
      {
        title: "Module 4 – ONR Report R-5-78: Official US Government Validation",
        lessons: [
          { title: "4.1 – J.B. Bateman's Brief: ONR London Branch, 16 August 1978", duration: "20 min" },
          { title: "4.2 – The 19 Pautrizel-Priore Publications: What the Bibliography Says", duration: "18 min" },
          { title: "4.3 – ONR's Assessment: 'Persuasive' — What That Word Means Officially", duration: "16 min" },
        ],
      },
      {
        title: "Module 5 – The Esquire Investigation: Rorvik's On-Site Visit",
        lessons: [
          { title: "5.1 – David Rorvik's 1975 Esquire Article: On-Site Documentation", duration: "20 min" },
          { title: "5.2 – $3 Million Machine, $400/Month Electricity: The Scale of the Program", duration: "16 min" },
          { title: "5.3 – WHO Funding and the International Interest That Was Suppressed", duration: "18 min" },
        ],
      },
      {
        title: "Module 6 – The Suppression: Political Economy of a $3M Machine",
        lessons: [
          { title: "6.1 – Why the French Government Shut It Down After Priore's Death", duration: "22 min" },
          { title: "6.2 – Pharmaceutical Industry Incentives and Political Forces", duration: "20 min" },
          { title: "6.3 – What Would Happen If This Were Acknowledged Today", duration: "18 min" },
        ],
      },
      {
        title: "Module 7 – Bearden's Mechanism: MCCS, Porthole Technology, Vacuum Engines",
        lessons: [
          { title: "7.1 – MCCS Explanation: Why T-Polarized Photons Can Reverse Disease", duration: "24 min" },
          { title: "7.2 – The Porthole Concept: Body as Ship, EM Fields as Entry Points", duration: "22 min" },
          { title: "7.3 – Modern DDS Implementation: Building a Priore-Type Device Today", duration: "28 min" },
          { title: "7.4 – Regulatory Pathway: Research Device Classification Strategy", duration: "18 min" },
        ],
      },
    ],
  },

  "bedini-environmental-em-conditioning": {
    title: "Bedini Environmental EM Conditioning: The Missing Ingredient in Rife, Priore & Cloning",
    stripeProductId: "prod_UK6d8QLNRiVVT6",
    price: "$347",
    icon: "🧬",
    color: "#22c55e",
    totalLessons: 28,
    totalHours: "8 hrs",
    source: "Bearden, 'Bedini's Discovery: Extending the Porthole Concept and the Waddington Valley Cell Lineage Concept' (Nov 28, 2002)",
    modules: [
      {
        title: "Module 1 – The Local EM Environment: What Is Actually Inside Your EM Signals",
        lessons: [
          { title: "1.1 – Beyond Amplitude and Frequency: The Infolded Internal Dynamics", duration: "20 min" },
          { title: "1.2 – Whittaker Decomposition: The Hidden Longitudinal Wave Content", duration: "22 min" },
          { title: "1.3 – Why Two Signals Can Look Identical on a Scope and Be Completely Different", duration: "20 min" },
          { title: "1.4 – The Higher Group Symmetry EM Model: What Standard EM Theory Misses", duration: "18 min" },
        ],
      },
      {
        title: "Module 2 – The Dense Signal Soup: How Power Lines, WiFi & EM Pollution Condition Local Vacuum",
        lessons: [
          { title: "2.1 – Every Building Has a Unique EM Environment", duration: "18 min" },
          { title: "2.2 – Power Line Harmonics, WiFi, and Their Infolded Longitudinal Signatures", duration: "20 min" },
          { title: "2.3 – Geographic Variation: Why Rife Results Differ by Location", duration: "22 min" },
          { title: "2.4 – Measuring Your Local EM Environment: Practical Protocol", duration: "20 min" },
        ],
      },
      {
        title: "Module 3 – Pristine Signals vs Force-Fitted Signals: Why Clean Is Dirty",
        lessons: [
          { title: "3.1 – The Paradox: A Perfectly Clean DDS Signal Is Maximally Mismatched", duration: "18 min" },
          { title: "3.2 – Scalar Interferometry: How Mismatch Generates Jamming EM Inside Cells", duration: "22 min" },
          { title: "3.3 – The Signal Needs to Speak the Local Language", duration: "20 min" },
        ],
      },
      {
        title: "Module 4 – Scalar Interferometry Jamming: How Mismatched Environments Block Reprogramming",
        lessons: [
          { title: "4.1 – ΔI Formulas: The Mathematics of Infolded Environment Difference", duration: "24 min" },
          { title: "4.2 – Outfolded Jamming EM: What Gets Generated in the Zone of Interference", duration: "22 min" },
          { title: "4.3 – Why Inconsistent Clinical Results Are the Expected Outcome Without Conditioning", duration: "18 min" },
        ],
      },
      {
        title: "Module 5 – Bedini's Tube Method: What We Know (Without Revealing IP)",
        lessons: [
          { title: "5.1 – Electron Tubes vs Solid-State: Why Tubes Have Relevant Properties Here", duration: "20 min" },
          { title: "5.2 – Operating a Tube 'Backwards': What That Means in Practice", duration: "22 min" },
          { title: "5.3 – The Conditioning Output: What Changes in the Signal After Treatment", duration: "20 min" },
        ],
      },
      {
        title: "Module 6 – Detection Protocol: Seeing on Oscilloscope When Conditioning Is Working",
        lessons: [
          { title: "6.1 – Oscilloscope Setup for Infolded Environment Verification", duration: "20 min" },
          { title: "6.2 – Differential Measurement: Comparing Conditioned vs Unconditioned Output", duration: "22 min" },
          { title: "6.3 – Pass/Fail Criteria: How to Know When the Signal Is Properly Adapted", duration: "18 min" },
        ],
      },
      {
        title: "Module 7 – Implications for Cloning, Rife Therapy, Priore Devices & Porthole Concept",
        lessons: [
          { title: "7.1 – Rife Machines: Why Results Are Inconsistent and How to Fix Them", duration: "22 min" },
          { title: "7.2 – Priore-Type Devices: Environmental Mismatch as the Missing Variable", duration: "20 min" },
          { title: "7.3 – Cloning: Somatic Nucleus + Host Egg = Two Different EM Worlds", duration: "22 min" },
          { title: "7.4 – The Porthole Concept Upgraded: Force-Fitted Porthole vs Pristine Porthole", duration: "20 min" },
        ],
      },
    ],
  },

  "waddington-valleys-infolded-em": {
    title: "Waddington Valleys & Infolded EM: The Complete Epigenetic Reprogramming Physics",
    stripeProductId: "prod_UK6dtsfzCXNs0t",
    price: "$297",
    icon: "🌿",
    color: "#22c55e",
    totalLessons: 28,
    totalHours: "7.5 hrs",
    source: "Bearden Nov 2002; Waddington 1940; Becker 1970; Gordon & Uehlinger 1966",
    modules: [
      {
        title: "Module 1 – The Waddington Landscape: Ball, Valleys, and Differentiation",
        lessons: [
          { title: "1.1 – C.H. Waddington's 1940 Epigenetic Landscape: The Original Model", duration: "18 min" },
          { title: "1.2 – The Ball Rolling Down: How Cells Commit to Differentiation", duration: "20 min" },
          { title: "1.3 – Valley Branching: Irreversibility and the Loss of Totipotency", duration: "18 min" },
          { title: "1.4 – What the Landscape Model Predicts — and What It Cannot Explain", duration: "16 min" },
        ],
      },
      {
        title: "Module 2 – Dedifferentiation: Becker's Scalar Potential Bone Fracture Experiments",
        lessons: [
          { title: "2.1 – Robert Becker's DC Control System for Regeneration", duration: "22 min" },
          { title: "2.2 – Red Blood Cell Dedifferentiation via Scalar Potential Application", duration: "20 min" },
          { title: "2.3 – Becker's Bone Fracture Protocol: Clinical Results", duration: "18 min" },
          { title: "2.4 – The DC Control Diagrams: Bearden's Engineering Interpretation", duration: "22 min" },
        ],
      },
      {
        title: "Module 3 – The Porthole Concept: Eliminating the Delta Between Diseased and Healthy Valleys",
        lessons: [
          { title: "3.1 – The Delta: What Separates the Diseased Cell's Valley from the Healthy Valley", duration: "20 min" },
          { title: "3.2 – Porthole Insertion: Driving the Delta to Zero Continuously", duration: "22 min" },
          { title: "3.3 – Why Continuous Treatment Is Required (Not a One-Shot Cure)", duration: "18 min" },
        ],
      },
      {
        title: "Module 4 – Transdifferentiation: Jumping Between Adjacent Valleys",
        lessons: [
          { title: "4.1 – Transdifferentiation vs Dedifferentiation: The Critical Distinction", duration: "18 min" },
          { title: "4.2 – The Gap Between Adjacent Valleys: What It Takes to Jump", duration: "20 min" },
          { title: "4.3 – Therapeutic Transdifferentiation: Cancer Cell → Normal Cell Pathway", duration: "22 min" },
        ],
      },
      {
        title: "Module 5 – Cancer as Off-Valley Branching: Returning to the Main Lineage",
        lessons: [
          { title: "5.1 – Cancer as a Wrong-Valley Cell Lineage Deviation", duration: "18 min" },
          { title: "5.2 – The Off-Valley Branch: What Triggers the Deviation", duration: "20 min" },
          { title: "5.3 – Retracing the Path: Porthole Concept Applied to Oncology", duration: "22 min" },
          { title: "5.4 – Why Chemotherapy Cannot Solve a Valley-Level Problem", duration: "16 min" },
        ],
      },
      {
        title: "Module 6 – Bedini's Extension: Valleys AND Their Infolded EM Environments",
        lessons: [
          { title: "6.1 – The Waddington Extension: Each Valley Has an EM Fingerprint", duration: "20 min" },
          { title: "6.2 – Two Things to Retrace: The Valley Path AND Its EM Environment", duration: "22 min" },
          { title: "6.3 – Building the Valley EM Database: WVTS Instrument Protocol", duration: "24 min" },
        ],
      },
      {
        title: "Module 7 – Totipotency: The Final Goal of Full Epigenetic Reprogramming",
        lessons: [
          { title: "7.1 – Totipotency: The Nascent State Before All Differentiation", duration: "18 min" },
          { title: "7.2 – Full Dedifferentiation as the Physics of Rejuvenation", duration: "20 min" },
          { title: "7.3 – The Complete Reprogramming Stack: Waddington + Bedini + Porthole", duration: "24 min" },
          { title: "7.4 – Research Protocol: How to Test Totipotency Progress in Cell Cultures", duration: "20 min" },
        ],
      },
    ],
  },
};

// Helper: find plan by matching course title keyword
export function findCoursePlan(titleSlug) {
  return coursePlans[titleSlug] || null;
}

export const courseSlugMap = {
  "prod_UK6duAtEI5PhM5": "the-4-vectors",
  "prod_UK6dMpBcrEfAEZ": "scalar-longitudinal-wave-engineering",
  "prod_UK6d3qvfMq12d7": "anenergy-phi-field",
  "prod_UK6dViE3GxDCpu": "gravitobiology",
  "prod_UK6dOVTKfVuo3j": "bioelectromagnetics-kindling",
  "prod_UK6dOmbdthIa0u": "priore-machine",
  "prod_UK6d8QLNRiVVT6": "bedini-environmental-em-conditioning",
  "prod_UK6dtsfzCXNs0t": "waddington-valleys-infolded-em",
};