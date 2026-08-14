// ─────────────────────────────────────────────────────────────────────────────
// TARGETED THERAPY PODS — Autism & PTSD
// Each pod combines the most relevant technologies from the 9 BrightSteps
// modalities, the 50 merged inventions, Vedic medicine, suppressed tech,
// and esoteric/consciousness systems.
// ─────────────────────────────────────────────────────────────────────────────

export const AUTISM_POD = {
  id: "autism",
  name: "AuraWell Autism Therapy Pod",
  designation: "AATCS-P1-AU",
  tagline: "Sensory regulation · neural coherence · gut-brain restoration",
  condition: "Autism Spectrum Disorder (ASD)",
  color: "#06b6d4",
  summary:
    "A unified bioelectromagnetic pod combining 9 BrightSteps modalities with 12 fused inventions, 8 Vedic therapies, 4 suppressed technologies, and 4 consciousness systems. Targets the core ASD dysregulations: sensory overload, neural incoherence, neuroinflammation, gut-brain axis disruption, and bioenergetic fragmentation.",

  modalities: [
    { code: "PBM", name: "Photobiomodulation", role: "630/850nm transcranial — reduces neuroinflammation, boosts mitochondrial ATP in prefrontal cortex", freq: "630nm + 850nm" },
    { code: "PEMF", name: "PEMF Schumann", role: "7.83 Hz grounding field — calms hyperactive sensory processing, normalizes brainwave coherence", freq: "7.83 Hz" },
    { code: "VAT", name: "Vibroacoustic", role: "30–528 Hz transducer mat — sensory integration therapy, calming vibro-feedback", freq: "30–528 Hz" },
    { code: "FIT", name: "Far-Infrared", role: "37–55°C soothing warmth — parasympathetic activation, reduces sensory hypersensitivity", freq: "8–14 μm" },
    { code: "SFT", name: "Scalar Field", role: "Scalar longitudinal waves — neural coherence, bio-field stabilization", freq: "20 Hz–20 kHz" },
    { code: "NIA", name: "Negative Ions", role: "Corona ion emitter — air purification, calming ionic balance (ASD children show ion imbalance)", freq: "<0.03 ppm O₃" },
    { code: "MCT", name: "MicroCurrent", role: "1–999 μA — cellular repair, vagal tone enhancement via auricular points", freq: "1–999 μA" },
    { code: "HIT", name: "Hydrogen Inhalation", role: "99.99% H₂ — potent neuroinflammation reduction (ASD hallmark is neuroinflammation)", freq: "100–300 mL/min" },
    { code: "BIO", name: "Biometric BFAC", role: "HRV + EEG + GSR closed-loop — auto-adjusts modality intensity to prevent sensory overload", freq: "Real-time" },
  ],

  inventions: [
    { id: "inv_005", name: "Scalar-Shilajit Mitochondrial Restoration", role: "Fulvic acid + scalar PEMF — upregulates mitochondrial biogenesis (ASD shows mitochondrial dysfunction)", ref: "SSMRD" },
    { id: "inv_007", name: "Kundalini-Schauberger Spinal Vortex", role: "7-chakra spinal PEMF sweep — neural coherence from base to crown, vagal tone", ref: "KSSVA" },
    { id: "inv_011", name: "Marma-PEMF Targeted Bio-Point", role: "107 marma point coils — targeted bioenergetic stimulation of sensory regulation points", ref: "MTPBS" },
    { id: "inv_012", name: "Shirodhara-Theta Cranial Resonance", role: "Warm oil + theta PEMF + scalar — induces calming theta state, resets hypothalamic axis", ref: "STCRS" },
    { id: "inv_015", name: "Triphala-Microbiome-PEMF Gut Restoration", role: "Gut-brain axis PEMF + triphala — addresses the ASD gut dysbiosis root cause", ref: "TMPGRS" },
    { id: "inv_016", name: "Brahmi-Cranial Nootropic Field", role: "Brahmi + BDNF PEMF — hippocampal neurogenesis, cognitive enhancement, focus", ref: "BCNFE" },
    { id: "inv_019", name: "Pranayama-HRV Bio-Scalar Breath", role: "Breath + HRV + vagal scalar — parasympathetic dominance, self-regulation training", ref: "PHBSBM" },
    { id: "inv_021", name: "Mantra-Scalar Vibrational Chamber", role: "Sanskrit formants → scalar field — Tomatis method vagal stimulation via inner ear", ref: "MSVEC" },
    { id: "inv_025", name: "Qabbalistic Tree Bio-Field Architecture", role: "10-node Tree of Life PEMF — bio-field alignment, energetic coherence", ref: "QTBAS" },
    { id: "inv_026", name: "Sacred Geometry Scalar Resonator", role: "Flower of Life phi-ratio coils — fractal coherence field, calming geometry", ref: "SGSR" },
    { id: "inv_039", name: "Naessens-Somatid Bio-Diagnostic", role: "Live-blood somatid scan — pre-symptomatic bio-field assessment, protocol personalization", ref: "NSBDM" },
    { id: "inv_048", name: "Steiner Fourfold Therapy", role: "4-band scalar (physical/etheric/astral/ego) — holistic multi-body treatment", ref: "SAFTD" },
  ],

  vedic: [
    { concept: "Marma Chikitsa (107 points)", role: "Targeted bio-point stimulation for sensory regulation and organ balance" },
    { concept: "Shirodhara (third-eye oil flow)", role: "Calming forehead oil flow — alpha-theta induction, hypothalamic reset" },
    { concept: "Abhyanga (daily oil massage)", role: "Warm oil massage — lymphatic clearing, parasympathetic, sensory integration" },
    { concept: "Swedana (herbal steam)", role: "Medicated steam — channel opening, detox, transdermal herb delivery" },
    { concept: "Brahmi & Shankhpushpi", role: "Nootropic brain herbs — BDNF upregulation, cognitive enhancement, focus" },
    { concept: "Triphala (gut-brain)", role: "Three-fruit colon tonic — microbiome balance, gut-brain axis normalization" },
    { concept: "Pranayama (breath control)", role: "Nadi Shodhana, Ujjayi — vagal tone, hemispheric balance, self-regulation" },
    { concept: "Mantra (Sanskrit sound)", role: "Bija mantras — vagus nerve stimulation via inner ear, bio-field structuring" },
  ],

  suppressed: [
    { name: "Prioré Multichannel", role: "Phase-conjugate EM — cellular template repair, neuroinflammation reversal" },
    { name: "Rife Frequency Bank", role: "Pathogen-specific MOR frequencies — clears opportunistic infections linked to ASD" },
    { name: "Reich Orgone Accumulator", role: "Bio-field charging — restores depleted bio-energy common in ASD" },
    { name: "Schauberger Vortex Water", role: "Structured water — hydration, cellular detox, bio-energetic water" },
  ],

  consciousness: [
    { name: "Solfeggio Frequencies", role: "396 Hz (fear release), 528 Hz (DNA repair), 741 Hz (cellular awakening)" },
    { name: "Sacred Geometry Field", role: "Flower of Life / Metatron coherence — fractal bio-field harmonization" },
    { name: "Tomatis Method", role: "Sanskrit formants stimulate vagus nerve via bone conduction — auditory integration" },
    { name: "Steiner Fourfold Model", role: "Physical / etheric / astral / ego bands — holistic multi-layer treatment" },
  ],

  protocol: [
    { phase: "1. Assessment", detail: "Naessens somatid scan + Nadi pariksha (pulse) + EEG baseline + HRV + gut microbiome panel. BFAC builds personalized protocol." },
    { phase: "2. Bio-Field Clearing", detail: "Scalar-EM clearing + Panchakarma (swedana steam + abhyanga oil) to clear bioenergetic debris before impression." },
    { phase:  "3. Core Session", detail: "PBM transcranial + PEMF Schumann + SFT scalar + HIT hydrogen + VAT vibroacoustic — all BFAC-closed-loop controlled with real-time EEG/HRV to prevent overload." },
    { phase: "4. Vedic Integration", detail: "Shirodhara (theta induction) + Marma PEMF + Pranayama breath coaching + Mantra scalar chamber." },
    { phase: "5. Gut-Brain Restoration", detail: "Triphala + microbiome PEMF + structured water — addresses the ASD gut dysbiosis root." },
    { phase: "6. Cognitive Enhancement", detail: "Brahmi cranial nootropic field + BDNF frequencies + Tree of Life alignment." },
    { phase: "7. Consolidation", detail: "Steiner fourfold scalar bands + sacred geometry coherence + orgone charging to stabilize the new template." },
  ],
};

export const PTSD_POD = {
  id: "ptsd",
  name: "AuraWell PTSD Therapy Pod",
  designation: "AATCS-P1-PT",
  tagline: "Trauma release · nervous system reset · soul retrieval",
  condition: "Post-Traumatic Stress Disorder (PTSD)",
  color: "#a855f7",
  summary:
    "A unified bioelectromagnetic pod combining 9 BrightSteps modalities with 12 fused inventions, 8 Vedic therapies, 4 suppressed technologies, and 5 consciousness systems. Targets the core PTSD patterns: amygdala hyperactivation, vagal nerve dysfunction, theta-state trauma encoding, bio-field fragmentation, and autonomic dysregulation.",

  modalities: [
    { code: "PBM", name: "Photobiomodulation", role: "810nm transcranial — prefrontal cortex activation, downregulates hyperactive amygdala", freq: "810nm NIR" },
    { code: "PEMF", name: "PEMF Schumann", role: "7.83 Hz grounding — calms hyperarousal, normalizes cortisol/melatonin cycles", freq: "7.83 Hz" },
    { code: "VAT", name: "Vibroacoustic", role: "396 Hz + 528 Hz — trauma release through vibroacoustic resonance, body-stored emotion clearing", freq: "30–528 Hz" },
    { code: "FIT", name: "Far-Infrared", role: "37–55°C warmth — parasympathetic activation, safe body sensing (PTSD involves body disconnection)", freq: "8–14 μm" },
    { code: "SFT", name: "Scalar Field", role: "Scalar longitudinal waves — bio-field repair, trauma template clearing", freq: "20 Hz–20 kHz" },
    { code: "NIA", name: "Negative Ions", role: "Ion emitter — calming ionic environment, reduces hypervigilance", freq: "<0.03 ppm O₃" },
    { code: "MCT", name: "MicroCurrent", role: "1–999 μA — vagal nerve stimulation (auricular), cellular trauma repair", freq: "1–999 μA" },
    { code: "HIT", name: "Hydrogen Inhalation", role: "99.99% H₂ — neuroinflammation reduction (PTSD shows chronic neuroinflammation)", freq: "100–300 mL/min" },
    { code: "BIO", name: "Biometric BFAC", role: "HRV + EEG + GSR closed-loop — auto-adjusts intensity, detects trauma activation, modulates to safety", freq: "Real-time" },
  ],

  inventions: [
    { id: "inv_003", name: "MEG-Prioré Hybrid Healing Generator", role: "Self-powered Prioré-class EM — phase-conjugate field for trauma template reversal", ref: "MPHG" },
    { id: "inv_012", name: "Shirodhara-Theta Cranial Resonance", role: "Theta-state induction (4–7 Hz) — accesses and releases encoded trauma memory", ref: "STCRS" },
    { id: "inv_013", name: "Panchakarma-Scalar Detox Chamber", role: "Five-action detox — clears trauma-stored toxins, bio-field debris", ref: "PSCDC" },
    { id: "inv_019", name: "Pranayama-HRV Bio-Scalar Breath", role: "Vagal stimulation + HRV biofeedback — restores autonomic regulation", ref: "PHBSBM" },
    { id: "inv_023", name: "Shamanic-Theta Scalar Journey", role: "Theta drumming + scalar — soul retrieval, bio-field reintegration of trauma fragments", ref: "STSJI" },
    { id: "inv_027", name: "Wim Hof-Scalar Autonomic Control", role: "Breath + cold + scalar — conscious autonomic regulation, immune reset", ref: "WHACT" },
    { id: "inv_028", name: "Ayahuasca-Scalar Integration", role: "Post-ceremony scalar integration — consolidates trauma release into stable template", ref: "ASITS" },
    { id: "inv_021", name: "Mantra-Scalar Vibrational Chamber", role: "Sanskrit formants → scalar — vagal stimulation, coherent field for safe processing", ref: "MSVEC" },
    { id: "inv_025", name: "Qabbalistic Tree Bio-Field", role: "10-node Tree of Life PEMF — re-architects fragmented bio-field", ref: "QTBAS" },
    { id: "inv_026", name: "Sacred Geometry Scalar Resonator", role: "Phi-ratio coherence field — fractal bio-field harmonization after fragmentation", ref: "SGSR" },
    { id: "inv_040", name: "Popp-Biophoton Coherence Scanner", role: "Biophoton coherence diagnostic — measures trauma-induced incoherence, tracks repair", ref: "PBCS" },
    { id: "inv_048", name: "Steiner Fourfold Therapy", role: "4-band scalar — heals physical/etheric/astral/ego trauma layers", ref: "SAFTD" },
  ],

  vedic: [
    { concept: "Shirodhara (third-eye oil flow)", role: "Theta induction — the most powerful Ayurvedic nervous system reset for trauma" },
    { concept: "Panchakarma (five-action detox)", role: "Clears trauma-stored dosha imbalances and bioenergetic debris" },
    { concept: "Abhyanga (oil massage)", role: "Restores safe body sensing — lymphatic flow, parasympathetic, grounding" },
    { concept: "Swedana (herbal steam)", role: "Channel opening — releases stored tension, transdermal calming herbs" },
    { concept: "Pranayama (breath control)", role: "Nadi Shodhana + Ujjayi — vagal tone, hemispheric balance, window of tolerance" },
    { concept: "Mantra (Sanskrit sound)", role: "Bija mantras — vagus nerve stimulation, coherent field for safe processing" },
    { concept: "Tulsi (holy basil)", role: "Adaptogen — lowers cortisol, radioprotective, calms hypervigilance" },
    { concept: "Rasayana (rejuvenation)", role: "Ashwagandha + shilajit — restores HPA axis, rebuilds depleted reserves" },
  ],

  suppressed: [
    { name: "Prioré Multichannel", role: "Phase-conjugate EM — reverses the disease/trauma template at the cellular level" },
    { name: "Reich Orgone Accumulator", role: "Bio-field charging — restores the depleted bio-energy of chronic PTSD" },
    { name: "Rife Frequency Bank", role: "Pathogen clearing — trauma weakens immunity; clears opportunistic infections" },
    { name: "Schauberger Vortex Water", role: "Structured water — deep hydration, cellular detox, calming water therapy" },
  ],

  consciousness: [
    { name: "Shamanic Soul Retrieval", role: "Theta drumming (4–7 Hz) + scalar — reintegrates trauma-fragmented bio-field parts" },
    { name: "Solfeggio Trauma Frequencies", role: "396 Hz (fear/trauma release), 528 Hz (DNA/cellular repair), 639 Hz (relationship repair)" },
    { name: "Wim Hof Autonomic Control", role: "Conscious immune/autonomic modulation — restores agency over hyperarousal" },
    { name: "Ayahuasca Integration", role: "Scalar consolidation of plant-medicine trauma release into stable bio-field template" },
    { name: "Steiner Fourfold Healing", role: "Physical/etheric/astral/ego bands — heals trauma across all layers of being" },
  ],

  protocol: [
    { phase: "1. Assessment", detail: "Popp biophoton coherence scan + Nadi pariksha + EEG + HRV + cortisol panel. BFAC builds trauma-informed protocol." },
    { phase: "2. Safety Stabilization", detail: "PEMF Schumann grounding + NIA calming ions + FIT warmth — establish window of tolerance before any processing." },
    { phase: "3. Bio-Field Clearing", detail: "Scalar-EM clearing + Panchakarma detox (swedana + abhyanga) — clear trauma debris before re-impression." },
    { phase: "4. Trauma Release (Core)", detail: "Shirodhara theta induction + VAT 396/528 Hz + SFT scalar + MCT vagal — BFAC monitors for flooding, auto-modulates." },
    { phase: "5. Soul Retrieval", detail: "Shamanic theta drumming + scalar field — reintegrates fragmented bio-field parts in safe container." },
    { phase: "6. Vagal Restoration", detail: "Pranayama HRV coaching + Wim Hof breath + auricular MCT — rebuild autonomic regulation." },
    { phase: "7. Integration & Consolidation", detail: "Steiner fourfold bands + sacred geometry coherence + orgone charging + rasayana — stabilize the repaired template." },
  ],
};

export const TARGETED_PODS = [AUTISM_POD, PTSD_POD];