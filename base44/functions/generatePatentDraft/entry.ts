import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { card, inventorInfo, entityStatus } = body;

  if (!card) return Response.json({ error: 'card is required' }, { status: 400 });

  const prompt = `You are a USPTO patent attorney specializing in provisional patent applications for electromagnetic, energy, and advanced physics inventions.

Convert this invention opportunity card into a complete USPTO Provisional Patent Application draft.

OPPORTUNITY CARD:
- Alias/Title: ${card.alias || card.headline}
- Category: ${card.category}
- Stage: ${card.stage}
- Problem Statement: ${card.problem_statement || 'Not provided'}
- Solution Summary: ${card.solution_summary || 'Not provided'}
- Tags: ${(card.tags || []).join(', ')}
- Market Size: ${card.market_size || 'Not provided'}
- IP Valuation: ${card.ip_valuation ? '$' + card.ip_valuation + 'M' : 'Not provided'}
- Jurisdiction: ${card.jurisdiction || 'US (USPTO)'}

INVENTOR INFO:
${inventorInfo || 'Inventor info redacted for privacy — use [INVENTOR NAME] placeholders'}

ENTITY STATUS: ${entityStatus || 'Micro Entity (individual inventor)'}

Generate a complete provisional patent application with ALL standard USPTO sections. Be technically detailed and use proper patent claim language. Use [INVENTOR NAME], [CITY], [STATE] as placeholders where personal info is needed.`;

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt,
    model: "claude_sonnet_4_6",
    response_json_schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        filing_date_recommendation: { type: "string" },
        sections: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              heading: { type: "string" },
              content: { type: "string" },
            }
          }
        },
        independent_claims: { type: "array", items: { type: "string" } },
        dependent_claims: { type: "array", items: { type: "string" } },
        abstract: { type: "string" },
        drawings_needed: { type: "array", items: { type: "string" } },
        prior_art_references: { type: "array", items: { type: "string" } },
        attorney_notes: { type: "string" },
      }
    }
  });

  return Response.json({ draft: result });
});