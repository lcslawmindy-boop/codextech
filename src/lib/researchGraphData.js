// ZARP Research Graph — Data Engine
// Generates 500+ research nodes across 12 domains with 2,400+ connections

export const DOMAINS = [
  { id: "bioelectromagnetics", name: "Bioelectromagnetics", color: "#1D6FA4", count: 87 },
  { id: "scalar_em", name: "Scalar Electromagnetics", color: "#9B30FF", count: 64 },
  { id: "acoustic", name: "Acoustic / Cymatics", color: "#0D9488", count: 52 },
  { id: "photobiomodulation", name: "Photobiomodulation", color: "#C9A84C", count: 48 },
  { id: "neurostimulation", name: "Neurostimulation", color: "#7C3AED", count: 71 },
  { id: "consciousness", name: "Consciousness Field", color: "#4F46E5", count: 39 },
  { id: "electrochemical", name: "Electrochemical", color: "#0891B2", count: 33 },
  { id: "environmental", name: "Environmental Systems", color: "#10B981", count: 44 },
  { id: "zero_point", name: "Zero Point / Free Energy", color: "#EA580C", count: 29 },
  { id: "suppressed_em", name: "Suppressed Electromedicine", color: "#DC2626", count: 41 },
  { id: "water_science", name: "Water Science", color: "#0284C7", count: 22 },
  { id: "agricultural", name: "Agricultural / Ecological", color: "#65A30D", count: 19 },
];

export const CONNECTION_TYPES = {
  FREQUENCY_OVERLAP: { color: "#C9A84C", label: "Frequency Overlap" },
  BIOLOGICAL_MECHANISM: { color: "#0D9488", label: "Biological Mechanism" },
  PHYSICS_PRINCIPLE: { color: "#9B30FF", label: "Physics Principle" },
  ENGINEERING_SYNERGY: { color: "#1D6FA4", label: "Engineering Synergy" },
  HISTORICAL_LINEAGE: { color: "#F59E0B", label: "Historical Lineage" },
  SUPPRESSION_PATTERN: { color: "#EF4444", label: "Suppression Pattern" },
  CLINICAL_EVIDENCE: { color: "#10B981", label: "Clinical Evidence" },
  FIELD_INTERACTION: { color: "#06B6D4", label: "Field Interaction" },
  MATERIAL_SHARED: { color: "#EA580C", label: "Material Shared" },
  TARGET_POPULATION: { color: "#7C3AED", label: "Target Population" },
};

export const EVIDENCE_LEVELS = [
  { level: 5, label: "Peer-Reviewed", stars: "★★★★★", color: "#10B981", count: 54 },
  { level: 4, label: "Government Research", stars: "★★★★☆", color: "#3B82F6", count: 38 },
  { level: 3, label: "Military / Classified", stars: "★★★☆☆", color: "#F59E0B", count: 29 },
  { level: 2, label: "Documented Clinical", stars: "★★☆☆☆", color: "#8B5CF6", count: 67 },
  { level: 1, label: "Anecdotal / Theoretical", stars: "★☆☆☆☆", color: "#6B7280", count: 312 },
];

export const SUPPRESSION_STATUS = [
  { id: "mainstream", label: "Mainstream Accepted", color: "#10B981", icon: "🟢", count: 41 },
  { id: "fringe", label: "Scientific Fringe", color: "#F59E0B", icon: "🟡", count: 134 },
  { id: "suppressed", label: "Institutionally Suppressed", color: "#EF4444", icon: "🔴", count: 187 },
  { id: "classified", label: "Classified / Declassified", color: "#3B82F6", icon: "🔵", count: 29 },
  { id: "contested", label: "Unknown / Contested", color: "#8B9AB0", icon: "⚪", count: 109 },
];

export const TARGET_SYSTEMS = [
  "Neurological", "Immune", "Cellular/DNA", "Cardiovascular",
  "Musculoskeletal", "Consciousness", "Environmental",
  "Agricultural", "Water/Molecular", "Atmospheric",
];

export const POPULATIONS = [
  "ASD / Neurodevelopmental", "Veterans / PTSD / TBI", "Chronic Illness",
  "General Wellness", "Cancer / Oncology Support",
  "Agricultural / Environmental", "Research / Clinical Only",
];

const RESEARCHERS = [
  "T.E. Bearden", "Nikola Tesla", "Antoine Prioré", "Royal Rife", "Wilhelm Reich",
  "Viktor Schauberger", "Robert O. Becker", "Glen Rein", "Fritz Popp",
  "Hartmut Müller", "Luc Montagnier", "Jacques Benveniste", "Martin Pall",
  "Paul Dong", "Konstantin Meyl", "John Bedini", "Thomas Valone",
  "Edwin Gray", "Stanley Meyer", "John Hutchison", "Bruce DePalma",
  "T. Henry Moray", "E.V. Gray", "Andrea Puharich", "Robert Pavlita",
  "Cleve Backster", "Rupert Sheldrake", "Mae-Wan Ho", "Peter Gariaev",
  "Alexander Gurwitsch", "Semyon Kirlian", "Vlail Kaznacheyev",
  "Georges Lakhovsky", "Albert Abrams", "Ruth Drown", "Hulda Clark",
  "W.O. Schumann", "Michael Persinger", "Robert Beck", "William Tiller",
];

const NODE_NAME_POOLS = {
  bioelectromagnetics: [
    "Schumann Resonance PEMF", "Cranial Electrotherapy", "Pulsed EM Field Therapy",
    "Bioelectric Wound Healing", "Electromagnetic Cell Signaling", "Piezoelectric Bone Remodeling",
    "Galvanotaxis Migration", "Bioelectric Morphogenesis", "Resting Transmembrane Potential",
    "Microcurrent ATP Production", "Bioelectromagnetic DNA Repair", "Pulsed EM Bone Fusion",
    "TENS Pain Modulation", "EM Neurogenesis", "Bioelectric Regeneration",
    "EM Field Biological Window", "DC Injury Current", "Endogenous Biofield",
    "Bioelectric Cancer Suppression", "Electromagnetic Heart Coherence",
  ],
  scalar_em: [
    "Scalar Wave Detection", "Longitudinal EM Wave", "Scalar Interferometry",
    "Phase-Conjugate Mirror", "Whittaker Scalar Decomposition", "Time-Polarized EM Wave",
    "Virtual State Engineering", "Scalar Potential Weapons", "Gravitobiology Coupling",
    "Scalar Field Healing", "Nested Modulation Scalar", "Scalar Wave Communication",
    "Zero-Vector EM Field", "Scalar Energy Generator", "Counter-EM Field",
    "Scalar Imprint Water", "Phase Conjugation Optics", "Scalar Bio-Resonance",
    "Bearden Scalar Theory", "Tesla Scalar Experiments",
  ],
  acoustic: [
    "Cymatic Pattern Formation", "Vibroacoustic Therapy", "Royal Rife Frequencies",
    "Sound-Induced Cellular Effects", "Mortal Oscillatory Rate", "Acoustic Levitation",
    "Sonic Tumor Ablation", "Brainwave Entrainment", "Infrasound Biological Effects",
    "Ultrasonic Cell Disruption", "Acoustic Cavitation Therapy", "Tibetan Singing Bowl Resonance",
    "Solfeggio Frequencies", "Acoustic DNA Expression", "Sound Wave Morphogenesis",
    "Pyramid Resonance Chamber", "Acoustic Neurostimulation",
  ],
  photobiomodulation: [
    "660nm Red Light Therapy", "850nm NIR Photobiomodulation", "LLLT Wound Healing",
    "Mitochondrial ATP Stimulation", "Cytochrome C Oxidase Activation", "Blue Light Antimicrobial",
    "UV Blood Irradiation", "Photodynamic Therapy", "Laser Acupuncture",
    "LED Array Therapy", "Infrared Sauna Therapy", "Photoreceptor Stimulation",
    "Chromotherapy Color Healing", "Biophoton Emission", "Photobiomodulation Brain",
  ],
  neurostimulation: [
    "tDCS Transcranial Direct Current", "TMS Transcranial Magnetic", "DBS Deep Brain Stimulation",
    "Vagus Nerve Stimulation", "CES Cranial Electrotherapy", "EEG Neurofeedback",
    "binaural Beat Entrainment", "Theta Wave Induction", "Gamma Synchrony Training",
    "Neuroplasticity Enhancement", "Hemispheric Synchronization", "Lucid Dream Induction",
    "Consciousness Altering Stimulation", "Trauma Release Stimulation", "PTSD Neurostimulation",
    "Addiction Reset Protocol", "Alpha-Theta Training",
  ],
  consciousness: [
    "Quantum Consciousness Model", "Akashic Field Theory", "Morphogenetic Field",
    "Non-Local Intention Effects", "Global Consciousness Project", "Psi Phenomena Documentation",
    "Remote Viewing Protocols", "Ganzfeld Stimulation", "Shamanic State Engineering",
    "Meditation EEG Mapping", "DMT Neural Signaling", "Orch-OR Theory",
    "Biofield Energy Healing", "Intention-Encoded Water", "Group Coherence Effects",
  ],
  electrochemical: [
    "Electrolytic Cell Design", "Cold Fusion Excess Heat", "Zero-Point Energy Extraction",
    "Water Splitting Electrolysis", "Stanley Meyer Cell", "Brown's Gas Production",
    "Electrochemical Cancer Markers", "Galvanic Skin Response", "pH Bioelectric Regulation",
    "Oxidation-Reduction Potential", "Electromagnetic Ion Transport",
  ],
  environmental: [
    "Atmospheric EM Resonance", "Earth Schumann Cavity", "Geomagnetic Storm Effects",
    "Ionospheric Heater Arrays", "Weather Modification EM", "Tesla Tower Wireless Power",
    "Telluric Current Mapping", "Geomagnetic Navigation", "EM Smog Mitigation",
    "Atmospheric Electricity Harvest", "Lightning Energy Capture",
  ],
  zero_point: [
    "Casimir Effect Energy", "Zero-Point Vacuum Energy", "MEG Motionless Generator",
    "Perpetual Motion Research", "Over-Unity Device Claims", "Vacuum Energy Extraction",
    "Quantum Vacuum Engineering", "Dirac Sea Tapping", "Negative Energy State",
    "Stochastic Electrodynamics", "Free Energy Suppression",
  ],
  suppressed_em: [
    "Rife Beam Ray Device", "Prioré Cancer Machine", "Hulda Clark Zapper",
    "Lakhovsky Multi-Wave Oscillator", "Royal Rife Microscope", "Tesla Death Ray",
    "Hutchison Effect", "Schauberger Repulsine", "Moray Radiant Energy",
    "Gray Pulsed Motor", "Bedini Schoolgirl Motor", "Puharich Water Car",
    "Meyer Water Fuel Cell", "Pavlita Psychotronic Generator",
  ],
  water_science: [
    "Structured Water EZ Zone", "Vortex Water Dynamization", "Colloidal Silver Water",
    "Memory of Water", "Homeopathic Dilution Effects", "Kirlian Water Imaging",
    "Grander Water Revitalization", "Schauberger Living Water", "Hexagonal Water Structure",
    "Water Crystal Emoto Studies", "Magnetic Water Treatment",
  ],
  agricultural: [
    "Electroculture Antenna Systems", "Magnetic Seed Treatment", "Sonic Bloom Audio Growth",
    "Biodynamic Preparations", "Orgone Field Agriculture", "PEMF Plant Growth",
    "UV Seed Sterilization", "Electromagnetic Pest Control", "Vortex Composting",
    "Lunar Planting Calendar",
  ],
};

const TAGS_POOL = ["PEMF", "7.83Hz", "Brain", "PTSD", "Scalar", "DNA", "Cancer", "Energy", "Water", "Frequency", "Healing", "Consciousness", "Neuro", "Immune", "Cellular", "Resonance", "Light", "Sound", "Vibration", "Field"];

function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

const rand = seededRandom(42);

export function generateGraph() {
  const nodes = [];
  let id = 1;

  DOMAINS.forEach(domain => {
    const names = NODE_NAME_POOLS[domain.id];
    for (let i = 0; i < domain.count; i++) {
      const baseName = names[i % names.length];
      const name = i < names.length ? baseName : `${baseName} — Study ${Math.floor(i / names.length) + 1}`;
      const evidence = Math.ceil(rand() * 5);
      const suppression = SUPPRESSION_STATUS[Math.floor(rand() * SUPPRESSION_STATUS.length)];
      const researcher = RESEARCHERS[Math.floor(rand() * RESEARCHERS.length)];
      const year = 1850 + Math.floor(rand() * 176);
      const decade = Math.floor(year / 10) * 10;
      const freqVal = rand() < 0.6 ? parseFloat((rand() * 10000).toFixed(2)) : null;
      const targetCount = 1 + Math.floor(rand() * 3);
      const targets = [];
      for (let t = 0; t < targetCount; t++) {
        const ts = TARGET_SYSTEMS[Math.floor(rand() * TARGET_SYSTEMS.length)];
        if (!targets.includes(ts)) targets.push(ts);
      }
      const tagCount = 2 + Math.floor(rand() * 3);
      const tags = [];
      for (let t = 0; t < tagCount; t++) {
        const tag = TAGS_POOL[Math.floor(rand() * TAGS_POOL.length)];
        if (!tags.includes(tag)) tags.push(tag);
      }
      const connCount = 1 + Math.floor(rand() * 70);
      const deviceInt = rand() < 0.3 ? "HIGH" : rand() < 0.6 ? "MEDIUM" : "THEORETICAL";

      nodes.push({
        id: `ZRP-NODE-${String(id).padStart(4, "0")}`,
        numericId: id,
        label: name,
        domain: domain.name,
        domainId: domain.id,
        domainColor: domain.color,
        researcher,
        year,
        decade: `${decade}s`,
        era: `${decade}s`,
        evidence,
        evidenceLabel: EVIDENCE_LEVELS[5 - evidence].label,
        suppression: suppression.label,
        suppressionId: suppression.id,
        suppressionColor: suppression.color,
        frequency: freqVal,
        frequencyUnit: freqVal ? "Hz" : null,
        targetSystems: targets,
        tags,
        description: `${name} — documented by ${researcher} in ${year}. This research explores ${domain.name.toLowerCase()} principles with documented effects on ${targets.join(", ").toLowerCase()}. The mechanism involves structured electromagnetic interaction with biological or physical systems, representing a significant contribution to the ZARP research ecosystem.`,
        documentedEffects: targets.map(t => ({ icon: "⚡", effect: `${t} system modulation` })),
        mechanism: `Core operating principle: electromagnetic field interaction with ${targets[0].toLowerCase()} systems via ${domain.name.toLowerCase()} coupling.`,
        deviceIntegration: deviceInt,
        connectionCount: connCount,
        x: rand() * 800,
        y: rand() * 600,
      });
      id++;
    }
  });

  // Generate edges
  const edges = [];
  const edgeTypes = Object.keys(CONNECTION_TYPES);
  let edgeId = 1;
  const totalEdges = 2400;

  while (edges.length < totalEdges) {
    const sourceIdx = Math.floor(rand() * nodes.length);
    let targetIdx;
    // 60% same domain, 40% cross-domain
    if (rand() < 0.6) {
      const sourceDomain = nodes[sourceIdx].domainId;
      const sameDomain = nodes.filter((n, i) => n.domainId === sourceDomain && i !== sourceIdx);
      if (sameDomain.length > 0) {
        targetIdx = nodes.indexOf(sameDomain[Math.floor(rand() * sameDomain.length)]);
      } else {
        targetIdx = Math.floor(rand() * nodes.length);
      }
    } else {
      targetIdx = Math.floor(rand() * nodes.length);
    }
    if (targetIdx === sourceIdx) continue;

    const source = nodes[sourceIdx].numericId;
    const target = nodes[targetIdx].numericId;
    // Check for duplicate
    if (edges.some(e => (e.source === source && e.target === target) || (e.source === target && e.target === source))) continue;

    const type = edgeTypes[Math.floor(rand() * edgeTypes.length)];
    const strength = 1 + Math.ceil(rand() * 10);
    edges.push({
      id: `E-${edgeId++}`,
      source,
      target,
      type,
      typeLabel: CONNECTION_TYPES[type].label,
      typeColor: CONNECTION_TYPES[type].color,
      strength,
      description: `${CONNECTION_TYPES[type].label} between ${nodes[sourceIdx].label} and ${nodes[targetIdx].label}`,
    });
  }

  // Update connection counts based on actual edges
  const connCounts = {};
  edges.forEach(e => {
    connCounts[e.source] = (connCounts[e.source] || 0) + 1;
    connCounts[e.target] = (connCounts[e.target] || 0) + 1;
  });
  nodes.forEach(n => {
    n.connectionCount = connCounts[n.numericId] || n.connectionCount;
  });

  return { nodes, edges };
}

export function getNodeRadius(node) {
  const c = node.connectionCount || 0;
  if (c >= 60) return 20;
  if (c >= 31) return 16;
  if (c >= 16) return 12;
  if (c >= 6) return 9;
  return 6;
}

export { RESEARCHERS };