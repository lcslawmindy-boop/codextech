import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { stage, investor_name, investor_org, platform_name, target_investment } = await req.json();

    if (!stage || !investor_name) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const stageGuidance = {
      initial_outreach: "Write a compelling cold email that introduces ZARP, establishes relevance to the investor's portfolio, and requests a brief call.",
      responded: "Write a follow-up that acknowledges their response, adds value, and proposes next steps (call, meeting, deck review).",
      meeting_scheduled: "Create meeting preparation notes: key talking points, investor priorities, and specific asks.",
      due_diligence: "Generate a due diligence FAQ addressing common investor questions: unit economics, TAM, competitive moat, team, exit potential.",
      term_sheet: "Draft professional email sharing term sheet expectations, timeline, and next milestones.",
      negotiating: "Create negotiation talking points for key terms: valuation, control, liquidation preferences, anti-dilution."
    };

    const prompt = `You are an expert investor relations and business development advisor. Generate a professional communication template for an investor outreach stage.

CONTEXT:
- Investor Name: ${investor_name}
- Investor Org: ${investor_org || "Unknown"}
- Platform: ${platform_name || "ZARP AI-Assisted IP Generation System"}
- Target Investment: $${target_investment || "unknown"}
- Stage: ${stage}
- Stage Guidance: ${stageGuidance[stage] || "General investor communication"}

Generate EXACTLY this JSON structure with complete, professional, copy-ready text:

{
  "subject_line": "Email subject (specific, compelling, 50 chars max)",
  "opening": "Opening hook that establishes relevance/curiosity (2-3 sentences)",
  "value_prop": "Why this matters to THEM specifically (1 paragraph, focus on their priorities/thesis)",
  "key_points": ["Bullet 1: Specific achievement or metric", "Bullet 2: Market/timing advantage", "Bullet 3: Team or strategic strength"],
  "call_to_action": "Clear next step with timeline (e.g., 'Schedule 30-min call by Friday')",
  "closing": "Professional sign-off with credibility signal",
  "tone": "Professional, respectful, concise",
  "optional_attachments": ["List of what to attach (deck, term sheet, one-pager, etc.)"]
}

Make it specific to the stage and investor type. Be data-driven and results-focused. Avoid generic fluff.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      model: "claude_sonnet_4_6",
      response_json_schema: {
        type: "object",
        properties: {
          subject_line: { type: "string" },
          opening: { type: "string" },
          value_prop: { type: "string" },
          key_points: { type: "array", items: { type: "string" } },
          call_to_action: { type: "string" },
          closing: { type: "string" },
          tone: { type: "string" },
          optional_attachments: { type: "array", items: { type: "string" } }
        }
      }
    });

    console.log(`Generated ${stage} template for ${investor_name}`);

    return Response.json({
      success: true,
      stage,
      investor_name,
      template: response
    });
  } catch (error) {
    console.error('Template generation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});