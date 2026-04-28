// Professional engineering system documentation for build plans
// Structure: Overview → Intent → Architecture → BOM → Functional → Implementation → Safety → Outcomes

export const buildSystems = {
  "meg-device": {
    title: "MEG (Motionless Electromagnetic Generator) System",
    description: "Experimental framework for flux-gating architecture based on scalar EM principles",
    metadata: {
      "System Type": "Energy Coupling Device",
      "Complexity": "Advanced",
      "Development Stage": "Experimental Framework",
      "Estimated Build Time": "120-180 hours"
    },
    overview: [
      "The Motionless Electromagnetic Generator (MEG) represents a theoretical framework for energy extraction based on scalar electromagnetic principles and magnetic flux topology modification.",
      "This experimental system uses ferromagnetic cores with specially configured coil windings to potentially create asymmetric magnetic field conditions that couple scalar potential energy to electrical output.",
      "This documentation provides the engineering framework for prototype development in controlled laboratory environments. No commercial MEG has been independently verified as meeting performance claims."
    ],
    designIntent: [
      "Achieve magnetic flux manipulation through nonlinear saturation topologies",
      "Couple scalar potential gradients to coil output via ferromagnetic domain response",
      "Create conditions where output energy exceeds input energy within the coil system",
      "Enable reproducible measurement of energy transformation mechanisms"
    ],
    architecture: {
      subsystems: [
        {
          name: "Core Assembly",
          description: "Nanocrystalline ferrite toroidal cores with precision winding",
          components: [
            "Nanocrystalline toroid core (80+ μH initial permeability)",
            "Primary excitation coil (AWG 18, 200-300 turns)",
            "Secondary pickup coil (AWG 20, 300-500 turns)",
            "Bias winding (fine wire, isolated regulation)"
          ]
        },
        {
          name: "Drive Electronics",
          description: "Signal generation and impedance matching",
          components: [
            "DDS frequency generator (AD9833 or equivalent, 0-40 kHz)",
            "MOSFET driver (IRF540 or equivalent, 100W capable)",
            "Gate drive transformer (ferrite core, 1:1 ratio)",
            "Input power supply (regulated, <1% ripple)"
          ]
        },
        {
          name: "Measurement System",
          description: "Input/output energy quantification",
          components: [
            "Input current probe (0-50A DC/AC)",
            "Output current measurement (precision shunt, 1mΩ)",
            "Voltage measurement (differential, 0-500V range)",
            "Oscilloscope interface (8-bit minimum, 1 Msps)"
          ]
        }
      ]
    },
    bom: [
      { component: "Nanocrystalline Toroid Core", quantity: 2, specification: "80+ μH initial permeability, 100mm OD, 50mm ID, 20mm height" },
      { component: "Magnet Wire AWG 18", quantity: "500 ft", specification: "Enameled copper, 0.040\" diameter" },
      { component: "Magnet Wire AWG 20", quantity: "1000 ft", specification: "Enameled copper, 0.032\" diameter" },
      { component: "MOSFET IRF540", quantity: 2, specification: "100V, 33A, TO-220 package" },
      { component: "MOSFET Driver IC", quantity: 1, specification: "IR2110 or equivalent, DIP-14" },
      { component: "DDS IC (AD9833)", quantity: 1, specification: "32-bit accumulator, 25 MHz clock" },
      { component: "Ferrite Transformer Core", quantity: 1, specification: "EI core, 1500 turn primary equivalent" },
      { component: "Current Probe", quantity: 2, specification: "0-50A DC/AC, 1V/A output" },
      { component: "Precision Shunt Resistor", quantity: 1, specification: "1 mΩ, 1% tolerance, 25W" },
      { component: "Power Supply 24V", quantity: 1, specification: "50W, <1% line regulation" }
    ],
    functional: [
      "The MEG architecture operates on the principle of magnetic flux topology manipulation. The primary excitation coil generates an oscillating magnetic field in the nanocrystalline core.",
      "The biasing winding creates an asymmetric saturation condition in the ferromagnetic material, theoretically allowing the secondary coil to couple energy via flux changes that may not require equivalent input energy.",
      "The pickup coil responds to the modulated magnetic field topology. Under specific frequency and amplitude conditions, the secondary output may exhibit phase relationships and amplitude characteristics inconsistent with standard coupled inductor theory.",
      "Measurement must account for: reactive power, harmonic content, core temperature changes, and load-dependent behavior patterns that deviate from ideal transformer relationships."
    ],
    implementation: {
      phases: [
        {
          title: "Mechanical Assembly",
          description: "Core preparation and winding installation",
          steps: [
            "Clean ferrite cores with non-magnetic wire brush",
            "Apply insulation layers (Kapton tape, 0.1mm thickness) to core surfaces",
            "Wind primary coil: 250 turns AWG 18, spiral pattern, document layer count and spacing",
            "Wind secondary coil: 400 turns AWG 20, equal spiral pattern, separate insulation layer",
            "Wind bias winding: 50 turns AWG 24, fine pitch, isolated transformer connection",
            "Secure windings with non-conductive epoxy, allow full cure (48 hours minimum)"
          ]
        },
        {
          title: "Electronics Integration",
          description: "Drive circuit assembly and signal generation",
          steps: [
            "Assemble DDS board: populate IC socket, capacitors, crystal oscillator",
            "Test DDS output: verify 25 MHz clock, confirm 0-40 kHz sine/triangle wave output",
            "Build MOSFET driver circuit: install IR2110, gate resistors, bootstrap capacitors",
            "Install gate drive transformer: 1:1 primary/secondary ratio, test isolation >5kV",
            "Mount power supply: verify regulation <0.5V at 20A load change",
            "Integrate core assembly into measurement enclosure"
          ]
        },
        {
          title: "Measurement Setup",
          description: "Instrumentation calibration and baseline establishment",
          steps: [
            "Calibrate current probes: verify 1V/A output against precision shunt",
            "Verify oscilloscope channel offset: zero drift check at 1 Msps sampling",
            "Establish baseline input/output measurements: no load condition, document impedance",
            "Record thermal profile: IR camera scan of core surface over 60-second excitation cycle",
            "Document baseline efficiency: (Output Power / Input Power) × 100%, at 5 frequency points"
          ]
        },
        {
          title: "Frequency Optimization",
          description: "Empirical determination of resonance conditions",
          steps: [
            "Sweep primary excitation 1 kHz to 40 kHz in 1 kHz steps, 10V input amplitude",
            "Measure secondary output voltage at each frequency: record peak and RMS values",
            "Note any frequency points showing output > expected coupled inductor response",
            "Sweep amplitude (5V to 30V) at identified frequency windows",
            "Document phase relationships between primary and secondary using dual-channel oscilloscope"
          ]
        }
      ]
    },
    safety: {
      hazards: [
        "High voltage potential (up to 500V) present during operation in primary circuit",
        "Core temperature may exceed 100°C under sustained high-frequency excitation",
        "Ferromagnetic cores can produce strong localized magnetic fields (>0.5 T) affecting electronic equipment",
        "Thermal runaway risk if circuit impedance drops below minimum design specification",
        "Wire insulation degradation risk under high current density (>50 A/mm²) conditions"
      ],
      constraints: [
        "Primary excitation limited to 30V maximum supply voltage",
        "Core temperature maintained below 120°C (thermal shutdown required)",
        "Operating frequency range: 5 kHz to 25 kHz only (outside this range thermal stability degrades)",
        "Load impedance minimum 10 Ω (lower loads risk core saturation collapse)",
        "Measurement instruments must be isolated from test circuit (optical isolation minimum)",
        "No human proximity (<30 cm) during active magnetic field generation"
      ]
    },
    outcomes: [
      "Verified measurement of energy input and output under controlled conditions with calibrated instrumentation",
      "Characterization of frequency response and impedance behavior across operating spectrum",
      "Documentation of any anomalous energy transformation patterns relative to standard electromagnetic theory",
      "Reproducible setup for peer review and independent verification",
      "Engineering framework for optimizing system parameters if positive results are confirmed"
    ]
  },

  "scalar-transmitter": {
    title: "Scalar Electromagnetic Transmitter System",
    description: "Experimental framework for generating scalar potential gradients using toroidal geometry",
    metadata: {
      "System Type": "EM Field Generator",
      "Complexity": "Intermediate",
      "Development Stage": "Experimental Framework",
      "Estimated Build Time": "80-120 hours"
    },
    overview: [
      "The scalar transmitter represents an experimental architecture for generating pure scalar potential fields (∇φ) without accompanying electromagnetic radiation.",
      "Based on Whittaker potential decomposition theory, this system uses shielded toroidal geometry to confine and manipulate scalar field components independent of transverse EM.",
      "This documentation provides engineering specifications for prototype development and measurement. No scalar field generation has been independently verified using standard test equipment."
    ],
    designIntent: [
      "Generate scalar potential gradients within shielded toroidal enclosure",
      "Minimize transverse EM radiation while maximizing scalar field topology",
      "Create measurable field conditions distinguishable from standard electromagnetic fields",
      "Enable reproducible prototype development for research institutions"
    ],
    architecture: {
      subsystems: [
        {
          name: "Toroidal Shield Assembly",
          description: "Mu-metal shielded enclosure for field confinement",
          components: [
            "Mu-metal sheet, 0.5mm thickness (external shield)",
            "Inner copper foil layer, 0.1mm (conduction path)",
            "Ferrite toroidal core (primary field generator)",
            "Electrostatic shielding rings (equipotential planes)"
          ]
        },
        {
          name: "Coil System",
          description: "Toroidal windings for scalar field creation",
          components: [
            "Primary toroid winding (2000 turns, AWG 24)",
            "Secondary gradient coil (fine pitch, isolated)",
            "Shielding braid (copper mesh, complete coverage)",
            "Insulation barriers (Kapton, 0.2mm minimum)"
          ]
        },
        {
          name: "Drive System",
          description: "High-voltage gradient generation",
          components: [
            "High-voltage supply (0-5 kV, <100 mA)",
            "Isolated control electronics (fiber optic interface)",
            "Voltage regulator (0.1% stability minimum)",
            "Current limiting resistor (1 MΩ, 10W rated)"
          ]
        }
      ]
    },
    bom: [
      { component: "Mu-Metal Sheet", quantity: "1 m²", specification: "0.5mm thickness, maximum permeability >20,000" },
      { component: "Ferrite Toroid", quantity: 1, specification: "μ_i >1000, 80mm OD, 40mm ID, 20mm height" },
      { component: "Magnet Wire AWG 24", quantity: "2000 ft", specification: "Enameled copper, 0.020\" diameter" },
      { component: "Copper Foil Shielding", quantity: "2 m²", specification: "0.1mm thickness, high purity" },
      { component: "Kapton Tape", quantity: "50 m", specification: "0.2mm thickness, 50mm width" },
      { component: "High-Voltage Supply", quantity: 1, specification: "0-5 kV variable, <100 mA max output" },
      { component: "Isolation Transformer", quantity: 1, specification: "1:1 ratio, 5 kV isolation minimum" },
      { component: "Voltage Regulator IC", quantity: 1, specification: "LM7805 + high-voltage feedback stage" },
      { component: "Current Limiting Resistor", quantity: 1, specification: "1 MΩ, 10W, 5% tolerance" },
      { component: "Fiber Optic Interface", quantity: 1, specification: "1 Mbps minimum, isolated receiver" }
    ],
    functional: [
      "The scalar transmitter generates potential gradients through toroidal coil excitation at high voltage. The Mu-metal shield confines the field topology to the interior volume.",
      "When excited with DC or low-frequency AC, the shielded system theoretically creates scalar potential distributions (∇φ ≠ 0) in the interior while maintaining external field suppression.",
      "Detection requires specialized instrumentation, as standard antennas and field probes are insensitive to pure scalar potentials. Measurement typically relies on statistical anomalies in crystal resonators or secondary coupling effects."
    ],
    implementation: {
      phases: [
        {
          title: "Shield Assembly",
          description: "Mu-metal enclosure construction",
          steps: [
            "Form toroidal shape from Mu-metal sheet: bend to 80mm OD, 40mm ID",
            "Apply annealing treatment: 400°C for 2 hours in hydrogen atmosphere (or substitute inert gas)",
            "Line interior with copper foil for conduction path continuity",
            "Install ferrite core at center with non-conductive spacers",
            "Seal all gaps with conductive epoxy: maximum gap 1mm"
          ]
        },
        {
          title: "Coil Installation",
          description: "Winding and insulation",
          steps: [
            "Wind primary toroid: 2000 turns AWG 24, document layer thickness every 500 turns",
            "Apply insulation: wrap completed toroid with 0.2mm Kapton tape, 50% overlap",
            "Install secondary gradient winding: fine-pitch, 1000 turns, opposite winding direction",
            "Verify insulation resistance: minimum 1 GΩ between windings using insulation tester",
            "Apply secondary insulation layer: complete coverage with conductive epoxy"
          ]
        },
        {
          title: "Electronics Integration",
          description: "High-voltage drive circuit assembly",
          steps: [
            "Assemble high-voltage supply module: transformer rectifier + filter capacitors",
            "Install voltage regulator feedback stage: isolated op-amp comparator circuit",
            "Connect fiber optic control interface: digital/analog converter for voltage command",
            "Install current limiting resistor: 1 MΩ in series with toroid primary",
            "Mount all high-voltage components on insulated phenolic board: minimum 50mm spacing"
          ]
        },
        {
          title: "Characterization",
          description: "Field mapping and baseline measurements",
          steps: [
            "Measure external field suppression: use gauss meter at multiple exterior points",
            "Document attenuation ratio: (external field) / (internal field calculation)",
            "Measure current draw: DC and AC at multiple voltage levels (0.5 kV to 5 kV)",
            "Establish baseline thermal response: record enclosure temperature over 60-minute runtime",
            "Test control linearity: sweep voltage 0-5 kV in 0.1 kV steps, verify regulation"
          ]
        }
      ]
    },
    safety: {
      hazards: [
        "High voltage present (up to 5 kV) in primary circuit during operation",
        "Potential corona discharge risk at high voltage, particularly near sharp edges",
        "Mu-metal shielding can accumulate static charge due to insulating properties",
        "Electromagnetic field concentration may affect nearby electronic equipment"
      ],
      constraints: [
        "Maximum voltage: 5 kV (above this, insulation breakdown risk in toroid windings)",
        "Operating temperature: maintain below 80°C (above this, ferrite permeability degradation)",
        "Duty cycle: limited to 50% at maximum voltage (thermal management required)",
        "Grounding: safety ground required at shield exterior, isolated from high-voltage primary",
        "Measurement equipment: all external instruments must be isolated (galvanic isolation minimum)"
      ]
    },
    outcomes: [
      "Quantified external field suppression characteristics relative to transmission loss",
      "Baseline current draw and impedance characteristics at operating voltage range",
      "Thermal and stability characterization under sustained excitation",
      "Framework for potential scalar field detection method development",
      "Documentation for peer review and independent replication"
    ]
  }
};

export function findBuildSystem(titleSlug) {
  return buildSystems[titleSlug] || null;
}