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

    console.log(`Generating content for: ${pack_title}`);

    // Mark as generating
    const existing = await base44.asServiceRole.entities.BriefPackContent.filter({ pack_id });
    if (existing.length > 0) {
      await base44.asServiceRole.entities.BriefPackContent.update(existing[0].id, { status: 'generating' });
    } else {
      await base44.asServiceRole.entities.BriefPackContent.create({
        pack_id, pack_title, status: 'generating'
      });
    }

    const prompt = `You are a senior experimental physicist and electrical engineer writing a comprehensive technical brief pack for researchers and builders.

Write a COMPLETE, DETAILED engineering document for the following device:

DEVICE: ${pack_title}
SUBTITLE: ${pack_subtitle || ''}
CATEGORY: ${category || ''}
DIFFICULTY: ${difficulty || ''}
THEORETICAL BASIS: ${theory_basis || ''}
DOCUMENT SECTIONS TO COVER: ${(sections || []).join(', ')}

Generate ALL of the following with full technical depth:

1. OVERVIEW (800 words): Full introduction to the device, historical context, theoretical foundations, why this matters to experimental researchers.

2. THEORY DEEP DIVE (1200 words): Detailed physics — equations described in words, field interactions, prior art citations (use real patent numbers where applicable, e.g. US 6,362,718 for MEG), peer-reviewed literature references. Include Bearden, Tesla, Priore, or other relevant prior art as appropriate to this specific device.

3. SYSTEM ARCHITECTURE (800 words): Full system-level description of every major subsystem, how they interact, signal flow, power flow, field topology. Be specific to THIS device.

4. CIRCUIT / WINDING / TOPOLOGY DESCRIPTION (600 words): Detailed description of the core electrical or mechanical topology — coil configurations, winding directions, core materials, driver circuit topology, frequency considerations.

5. BILL OF MATERIALS: Generate exactly 20-30 line items as a JSON array. Each item must have:
   - ref: reference designator (e.g. C1, R3, L1, T1)
   - component: exact component name
   - spec: full specification (value, voltage rating, tolerance, etc.)
   - qty: quantity
   - source: supplier name (Mouser, Digi-Key, McMaster-Carr, etc.)
   - notes: installation or selection notes

6. ASSEMBLY STEPS: Generate 15-20 detailed assembly steps as a JSON array. Each step:
   - step: step number
   - title: brief title
   - detail: 2-3 sentences of detailed instruction
   - caution: safety or precision note (or empty string)

7. MEASUREMENT PROTOCOLS: Generate 8-10 measurement protocols as a JSON array. Each:
   - test: test name
   - equipment: required instruments (be specific — model types, oscilloscope specs, etc.)
   - procedure: 3-4 sentence step-by-step procedure
   - expected_result: what a successful result looks like

8. SAFETY GUIDELINES (400 words): Comprehensive safety section covering electrical hazards, RF/EM exposure, high voltage precautions, grounding requirements, personal protective equipment.

9. TROUBLESHOOTING: Generate 10-12 troubleshooting entries as a JSON array. Each:
   - symptom: what the builder observes
   - likely_cause: most probable root cause
   - remedy: specific corrective action

10. REFERENCES: Generate 8-12 references as a JSON array of strings in academic format (Author, Title, Journal/Patent, Year).

IMPORTANT:
- This is for experimental/research purposes only — include appropriate disclaimers
- Be technically accurate to the theoretical framework (scalar EM, ZPE, bioelectromagnetics, etc.)
- Use real component specifications that would actually work for this application
- Be specific — no vague generalities. Researchers need actionable detail.
- Each section should be comprehensive enough that a competent engineer could begin prototyping

Return ONLY a valid JSON object with these exact keys:
{
  "overview": "string",
  "theory_deep": "string", 
  "system_architecture": "string",
  "circuit_description": "string",
  "bom": [...],
  "assembly_steps": [...],
  "measurement_protocols": [...],
  "safety_guidelines": "string",
  "troubleshooting": [...],
  "references": [...]
}`;

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

    // Calculate word count
    const textContent = [result.overview, result.theory_deep, result.system_architecture, result.circuit_description, result.safety_guidelines].join(' ');
    const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;
    const estimatedPages = Math.ceil(wordCount / 300) + Math.ceil((result.bom?.length || 0) / 8) + Math.ceil((result.assembly_steps?.length || 0) / 4) + Math.ceil((result.measurement_protocols?.length || 0) / 3);

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