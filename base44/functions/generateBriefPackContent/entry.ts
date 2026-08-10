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

    const sectionsList = (sections || []).map((s, i) => `  ${i + 1}. ${s}`).join('\n');

    const prompt = `You are a senior research engineer writing a COMPLETE technical brief pack document for the following device. This is a real engineering document that will be sold to researchers and builders — it must be detailed, technically accurate, and specific to THIS device.

DEVICE: ${pack_title}
SUBTITLE: ${pack_subtitle || ''}
CATEGORY: ${category || 'Research'}
DIFFICULTY: ${difficulty || 'Intermediate'}
THEORETICAL BASIS: ${theory_basis || 'Advanced electromagnetics and scalar field theory'}

DOCUMENT SECTIONS TO COVER:
${sectionsList || 'Standard engineering brief sections'}

Write DETAILED, TECHNICAL content specific to this device. Do NOT write generic placeholder text — every section must reference the actual physics, components, and architecture of THIS device. Cite real patents and papers where possible. Return ONLY valid JSON with these exact keys:

{
  "overview": "4-5 sentence overview of what this device does, its significance, and what the builder will achieve",
  "theory_deep": "4-5 paragraph deep theoretical explanation covering: (1) core physics principle, (2) prior art and patent history with real patent numbers, (3) key innovation or mechanism, (4) relationship to the theoretical basis, (5) current research status. Be specific to THIS device.",
  "system_architecture": "3-4 paragraph description of ALL major subsystems, how they connect, signal flow, and packaging. Name specific subsystems for THIS device type.",
  "circuit_description": "3-4 paragraph detailed description of the electrical topology, coil winding geometry, core materials, resonant frequency calculations, and signal path. Include specific component values where possible.",
  "bom": [{"ref":"C1","component":"Capacitor","spec":"100uF 50V Polypropylene","qty":"2","source":"Mouser","notes":"Low-loss film type"}, ...at least 20 items specific to this device...],
  "assembly_steps": [{"step":1,"title":"Prepare core materials","detail":"Detailed 2-3 sentence instruction...","caution":"Specific safety caution..."}, ...at least 15 steps...],
  "measurement_protocols": [{"test":"Test name","equipment":"Specific instruments","procedure":"Step-by-step procedure","expected_result":"Specific expected value"}, ...at least 8 protocols...],
  "safety_guidelines": "3-4 paragraph safety overview covering electrical hazards, RF/EM exposure, grounding, thermal considerations, and PPE. Be specific to THIS device's voltage/power levels.",
  "troubleshooting": [{"symptom":"Specific to this device","likely_cause":"Specific cause","remedy":"Specific fix"}, ...at least 10 entries...],
  "references": ["US Patent XXXXXXXX - Title", "Author, Title, Year", ...at least 8 references specific to this device category...]
}

CRITICAL: Every section must be SPECIFIC to "${pack_title}". Do not write generic content that could apply to any device.`;

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