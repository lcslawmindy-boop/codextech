import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const { pack_id, pack_title, pack_subtitle, category, theory_basis, sections, difficulty, icon } = await req.json();

    if (!pack_id || !pack_title) {
      return Response.json({ error: 'pack_id and pack_title required' }, { status: 400 });
    }

    console.log(`Generating FULL content for: ${pack_title}`);

    // Mark as generating
    const existing = await base44.asServiceRole.entities.BriefPackContent.filter({ pack_id });
    if (existing.length > 0) {
      await base44.asServiceRole.entities.BriefPackContent.update(existing[0].id, { status: 'generating' });
    } else {
      await base44.asServiceRole.entities.BriefPackContent.create({
        pack_id, pack_title, status: 'generating'
      });
    }

    const prompt = `You are a senior research engineer writing a COMPREHENSIVE, DETAILED technical engineering brief for the device: "${pack_title}".

DEVICE: ${pack_title}
SUBTITLE: ${pack_subtitle || 'N/A'}
CATEGORY: ${category || 'Research'}
DIFFICULTY: ${difficulty || 'Advanced'}
THEORETICAL BASIS: ${theory_basis || 'Advanced electromagnetics and experimental physics'}
DOCUMENT SECTIONS TO COVER: ${sections ? sections.join(', ') : 'Full engineering brief'}

This document must be EXTREMELY detailed — the target is 12,000+ words total to fill approximately 40 pages of an A4 engineering document. Write in a professional, technical engineering style. Be specific with part numbers, values, tolerances, and procedures. Cite real patents and publications where applicable.

Return ONLY valid JSON with these exact keys and the following depth requirements:

{
  "overview": "Write 600+ words. Comprehensive introduction covering: what the device is, its historical context, the problem it addresses, key innovators, a summary of operating principles, and the significance of this research. Reference specific patents and publications by number and author.",
  "theory_deep": "Write 2,500+ words. Deep multi-section theoretical foundation covering: (1) the fundamental physics and electromagnetic principles, (2) historical prior art with patent numbers and dates, (3) mathematical framework and key equations, (4) energy transduction mechanisms, (5) deviations from conventional theory, (6) peer-reviewed evidence supporting or challenging the approach. Cite at least 8 specific references by patent number or publication.",
  "system_architecture": "Write 2,000+ words. Detailed system architecture covering: all major subsystems with their functions, block-level interconnections, signal and power flow paths, control loops, feedback mechanisms, thermal management, EMI shielding strategy, and packaging considerations. Describe each subsystem in its own paragraph.",
  "circuit_description": "Write 1,500+ words. Complete electrical/circuit description covering: the core topology, coil winding specifications (wire gauge, turns, core material, geometry), resonant frequency calculations, driver circuit design, output stage configuration, protection circuits, and signal conditioning. Include specific component values and calculations.",
  "bom": "Provide 25-30 line items. Each with ref (designator), component (name), spec (detailed spec with value, voltage, tolerance, package), qty (quantity), source (specific supplier like Mouser/Digi-Key/McMaster-Carr with part number), and notes (why this part was chosen and installation notes).",
  "assembly_steps": "Provide 20-25 steps. Each with step (number), title (short), detail (200+ word detailed procedure for that step), and caution (safety warning specific to that step). Cover the entire assembly from component preparation through final testing.",
  "measurement_protocols": "Provide 10-15 test protocols. Each with test (name), equipment (specific instruments and models), procedure (detailed step-by-step measurement procedure, 100+ words), and expected_result (specific numeric values or ranges with units).",
  "safety_guidelines": "Write 1,000+ words. Comprehensive safety section covering: electrical hazards and mitigation, RF/EM exposure limits and shielding, thermal risks, mechanical safety, grounding requirements, ESD precautions, fire safety, recommended PPE, and emergency procedures. Reference relevant safety standards (IEEE, IEC, OSHA).",
  "troubleshooting": "Provide 15-20 entries. Each with symptom (what's wrong), likely_cause (technical explanation of why), and remedy (detailed fix procedure, 50+ words). Cover common assembly errors, component failures, and operational issues.",
  "references": "Provide 15-20 citations. Mix of US patent numbers with titles, peer-reviewed journal papers with DOIs, technical books with ISBNs, and standards documents. Format each as a full citation string."
}

CRITICAL: Every text field must be substantial and specific to THIS device. Do not write generic placeholder text. Use real patent numbers, real part numbers, and real measurement values. The total word count across all fields must exceed 12,000 words.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'claude_sonnet_4_6',
      response_json_schema: {
        type: 'object',
        properties: {
          overview: { type: 'string' },
          theory_deep: { type: 'string' },
          system_architecture: { type: 'string' },
          circuit_description: { type: 'string' },
          bom: { type: 'array', items: { type: 'object' } },
          assembly_steps: { type: 'array', items: { type: 'object' } },
          measurement_protocols: { type: 'array', items: { type: 'object' } },
          safety_guidelines: { type: 'string' },
          troubleshooting: { type: 'array', items: { type: 'object' } },
          references: { type: 'array', items: { type: 'string' } }
        }
      }
    });

    // Calculate word count — include text fields AND array items
    const textContent = [result.overview, result.theory_deep, result.system_architecture, result.circuit_description, result.safety_guidelines].join(' ');
    const textWords = textContent.split(/\s+/).filter(w => w.length > 0).length;
    const bomWords = (result.bom || []).reduce((s, item) => s + Object.values(item || {}).join(' ').split(/\s+/).filter(w => w.length > 0).length, 0);
    const assemblyWords = (result.assembly_steps || []).reduce((s, item) => s + Object.values(item || {}).join(' ').split(/\s+/).filter(w => w.length > 0).length, 0);
    const measureWords = (result.measurement_protocols || []).reduce((s, item) => s + Object.values(item || {}).join(' ').split(/\s+/).filter(w => w.length > 0).length, 0);
    const troubleshootWords = (result.troubleshooting || []).reduce((s, item) => s + Object.values(item || {}).join(' ').split(/\s+/).filter(w => w.length > 0).length, 0);
    const refWords = (result.references || []).reduce((s, r) => s + (typeof r === 'string' ? r.split(/\s+/).filter(w => w.length > 0).length : 0), 0);
    const wordCount = textWords + bomWords + assemblyWords + measureWords + troubleshootWords + refWords;

    // Estimate pages: ~300 words per page for text, plus tables and formatting
    const estimatedPages = Math.ceil(wordCount / 300) + Math.ceil((result.bom?.length || 0) / 6) + Math.ceil((result.assembly_steps?.length || 0) / 2) + Math.ceil((result.measurement_protocols?.length || 0) / 1.5) + Math.ceil((result.troubleshooting?.length || 0) / 2) + 2;

    const updateData = {
      pack_title,
      overview: result.overview || '',
      theory_deep: result.theory_deep || '',
      system_architecture: result.system_architecture || '',
      circuit_description: result.circuit_description || '',
      bom: result.bom || [],
      assembly_steps: result.assembly_steps || [],
      measurement_protocols: result.measurement_protocols || [],
      safety_guidelines: result.safety_guidelines || '',
      troubleshooting: result.troubleshooting || [],
      references: result.references || [],
      status: 'complete',
      word_count: wordCount,
      estimated_pages: estimatedPages
    };

    const records = await base44.asServiceRole.entities.BriefPackContent.filter({ pack_id });
    if (records.length > 0) {
      await base44.asServiceRole.entities.BriefPackContent.update(records[0].id, updateData);
    } else {
      await base44.asServiceRole.entities.BriefPackContent.create({ pack_id, ...updateData });
    }

    console.log(`Done: ${pack_title} — ~${estimatedPages} pages, ${wordCount} words`);
    return Response.json({ success: true, pack_id, estimated_pages: estimatedPages, word_count: wordCount });

  } catch (error) {
    console.error('generateBriefPackContent error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});