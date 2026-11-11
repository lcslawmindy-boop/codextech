export const generationVersion = 'full-chapters-v1';
export const requiredChapters = 20;
export const minimumWords = 1100;
export const targetPackPages = 43;
export const chapterPlan = [
  ['scope', 'Research scope and evidence boundaries', 'Define the specific research question, intended non-clinical use, assumptions, exclusions, measurable objectives and evidence gaps.'],
  ['history', 'Historical sources and prior art', 'Analyze the supplied historical sources, what each actually claims, provenance limitations and what would be needed to verify the claims.'],
  ['physics', 'Conventional physical foundations', 'Explain established physics relevant to this device, equations, units, boundary conditions and worked illustrative calculations with explicit assumptions.'],
  ['hypotheses', 'Proposed mechanisms and competing explanations', 'Separate the proposed unconventional mechanism from established science. Compare falsifiable predictions, ordinary explanations and null hypotheses.'],
  ['requirements', 'Engineering requirements and traceability', 'Develop device-specific provisional requirements, rationale, verification method, dependencies, uncertainty and unresolved design decisions.'],
  ['architecture', 'Subsystem architecture and interfaces', 'Describe subsystem responsibilities, physical interfaces, signal flow, energy flow, controls and interfaces. Distinguish proposed architecture from verified hardware.'],
  ['electrical', 'Electrical topology and design analysis', 'Analyze applicable electrical topology, component selection criteria, loading, parasitics and protections. Mark numerical examples as assumptions, not tested specifications.'],
  ['materials', 'Materials, geometry and mechanical integration', 'Analyze materials, enclosure geometry, mounting, tolerance stacks, accessibility for inspection, optical or magnetic constraints and environmental compatibility.'],
  ['controls', 'Control, firmware and data architecture', 'Describe relevant control states, timing, logging, calibration metadata, fault response, version control and data integrity. Do not pretend software or firmware has been implemented.'],
  ['bom', 'Bill of materials and sourcing rationale', 'Develop a device-specific provisional materials breakdown in prose. Cover quantities, selection constraints, alternatives, interfaces, derating and procurement checks. Never invent supplier availability, prices or part numbers.'],
  ['integration', 'Integration sequence and inspection gates', 'Describe a proposed safe bench-level integration sequence, prerequisites, inspections, dependency order and stop-work gates. No human or animal exposure protocols.'],
  ['calibration', 'Instrumentation and calibration', 'Describe instrument selection, traceability, range, resolution, calibration intervals, fixture effects, reference standards and baseline characterization.'],
  ['verification', 'Verification and test methodology', 'Develop falsifiable non-clinical bench tests with independent controls, blinded analysis where appropriate, repeatability, null results and predeclared decision criteria. No invented test outcomes.'],
  ['uncertainty', 'Uncertainty budget and artifact rejection', 'Discuss a device-specific uncertainty budget, systematic errors, propagation, aliasing, grounding artifacts, shielding, leakage, thermal drift and controls against false positives.'],
  ['safety', 'Safety review and containment', 'Analyze electrical, thermal, mechanical, optical, biological or radiation hazards only where relevant. State professional review requirements and safe stopping boundaries, without hazardous operational recipes.'],
  ['faults', 'Failure modes and troubleshooting', 'Analyze device-specific failure modes, observable symptoms, diagnostic discriminators, safe isolation, corrective design options and evidence needed to close each issue.'],
  ['analysis', 'Data analysis and reproducibility', 'Describe raw-data preservation, processing, statistics, outlier policy, preregistration, sensitivity analysis, replication and reporting of negative results.'],
  ['validation', 'Validation roadmap and review gates', 'Develop staged technical milestones, evidence required, go/no-go decisions and independent human review. Do not claim medical efficacy, regulatory approval or technology readiness without evidence.'],
  ['limitations', 'Limitations and open research questions', 'Critically analyze missing specifications, disputed mechanisms, absent measurements, alternative explanations and specific work needed before feasibility can be asserted.'],
  ['references', 'Source audit and evidence traceability', 'Describe how the supplied sources support or fail to support each device-specific claim, distinguish patents from validation, list known source identifiers only and a concrete verification checklist. Never invent citations or DOIs.'],
  ['sensitivity', 'Supplement: parameter sensitivity analysis', 'Analyze sensitivity to uncertain parameters, dimensional consistency, stability margins and controlled parameter sweeps using illustrative assumptions.'],
  ['interfaces', 'Supplement: interface verification dossier', 'Deepen device-specific interface checks, tolerances, observability, test fixtures and independent review criteria.'],
  ['replication', 'Supplement: independent replication design', 'Specify non-clinical replication design, competing hypotheses, controls, data handoff and independent interpretation.'],
  ['reliability', 'Supplement: reliability and maintainability', 'Analyze device-specific degradation, inspection criteria, maintenance records, replaceable subsystems and failure evidence.'],
  ['environment', 'Supplement: environmental confounders', 'Analyze environmental confounders and experiments that distinguish the proposed mechanism from ordinary coupling and measurement error.'],
  ['review', 'Supplement: engineering review dossier', 'Develop a critical device-specific review of unresolved engineering decisions, supporting evidence, decision criteria and safe next research steps.']
].map(([key, title, instructions], index) => ({ key, title, instructions, index }));

export function countWords(text) {
  return typeof text === 'string' ? (text.trim().match(/\S+/g) || []).length : 0;
}

export async function readChapters(base44, packId) {
  const page = await base44.entities.BriefPackChapter.filter(
    { pack_id: packId, generation_version: generationVersion, word_count: { $gte: minimumWords } },
    { sort: 'chapter_index', limit: 100 }
  );
  const unique = new Map();
  for (const record of page.items) {
    const planned = chapterPlan[record.chapter_index];
    if (planned?.key === record.chapter_key) unique.set(record.chapter_key, record);
  }
  return [...unique.values()].sort((a, b) => a.chapter_index - b.chapter_index);
}