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

    const prompt = `You are a technical engineer writing a brief engineering document for the device: ${pack_title} (${pack_subtitle || ''}).

CATEGORY: ${category || 'Research'}
THEORETICAL BASIS: ${theory_basis || 'Advanced electromagnetics'}

Write CONCISE technical content (not verbose). Return ONLY valid JSON with these keys:

{
  "overview": "2-3 sentence overview of what this device does and its significance",
  "theory_deep": "3-4 paragraph explanation of the physics and prior art (cite real patents where applicable)",
  "system_architecture": "Detailed description of major subsystems and how they connect",
  "circuit_description": "Description of the electrical topology, coil configuration, and core design",
  "bom": [{"ref":"C1","component":"Capacitor","spec":"100uF 50V","qty":"2","source":"Mouser","notes":"Polypropylene preferred"}, ...20 more items],
  "assembly_steps": [{"step":1,"title":"Prepare core","detail":"Wind the primary coil using 22 AWG wire...","caution":"..."}, ...15 items],
  "measurement_protocols": [{"test":"Voltage measurement","equipment":"DMM, oscilloscope","procedure":"Connect probes to...","expected_result":"..."}, ...8 items],
  "safety_guidelines": "2-3 paragraph safety overview covering electrical hazards, RF/EM exposure, grounding",
  "troubleshooting": [{"symptom":"Device overheats","likely_cause":"Excessive current","remedy":"Check coil resistance"}, ...10 items],
  "references": ["US Patent 6,362,718 - Motionless EM Generator", "Bearden, T.E. (2002) Energy from the Vacuum", ...]
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