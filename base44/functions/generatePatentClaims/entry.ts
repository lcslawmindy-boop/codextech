import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { invention_title, technical_description } = await req.json();

    if (!invention_title || !technical_description) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate claims with Claude
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a patent claims drafting expert with 20+ years of USPTO experience. Generate professional patent claims for this invention.

INVENTION TITLE: ${invention_title}

TECHNICAL DESCRIPTION:
${technical_description}

Generate a JSON response with EXACTLY these fields:

1. independent_claims: Array of 3-5 independent claims (claim 1 should be broadest, others progressively narrower). Each claim should:
   - Start with "A [device/method/system]..."
   - Include all essential elements
   - Use proper claim terminology
   - Have proper antecedent basis
   Format: [{claim_number: 1, text: "...", scope_breadth: "broad"}, ...]

2. dependent_claims: Array of 6-12 dependent claims that narrow claims 1-3. Each should:
   - Depend on a specific independent claim
   - Add one or more limitations
   - Use "The [device/method] of claim X, wherein..."
   Format: [{claim_number: 6, depends_on: 1, text: "...", additional_limitation: "..."}]

3. novelty_analysis: Object with:
   - core_novelty: 1-2 sentences on what's truly novel
   - inventive_concept: The non-obvious inventive step
   - non_obvious_features: Array of 3-4 non-obvious features

4. prior_art_risks: Array of identified risks (if any). Format:
   [{risk_level: "high", issue: "Similar to US Patent X,XXX,XXX in...", affected_claims: [1, 2], mitigation: "Emphasize..."}]

5. upto_compliance_check: Object with:
   - is_compliant: boolean (are claims properly formatted for USPTO?)
   - issues: Array of any formatting/technical issues
   - recommendations: Array of improvements (grammar, clarity, claim scope)

Be thorough, technical, and compliant with 37 CFR 1.75 (claim format rules). Every claim must have proper antecedent basis.`,
      model: "claude_sonnet_4_6",
      response_json_schema: {
        type: "object",
        properties: {
          independent_claims: {
            type: "array",
            items: {
              type: "object",
              properties: {
                claim_number: { type: "integer" },
                text: { type: "string" },
                scope_breadth: { type: "string" }
              }
            }
          },
          dependent_claims: {
            type: "array",
            items: {
              type: "object",
              properties: {
                claim_number: { type: "integer" },
                depends_on: { type: "integer" },
                text: { type: "string" },
                additional_limitation: { type: "string" }
              }
            }
          },
          novelty_analysis: {
            type: "object",
            properties: {
              core_novelty: { type: "string" },
              inventive_concept: { type: "string" },
              non_obvious_features: { type: "array", items: { type: "string" } }
            }
          },
          prior_art_risks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                risk_level: { type: "string" },
                issue: { type: "string" },
                affected_claims: { type: "array", items: { type: "integer" } },
                mitigation: { type: "string" }
              }
            }
          },
          upto_compliance_check: {
            type: "object",
            properties: {
              is_compliant: { type: "boolean" },
              issues: { type: "array", items: { type: "string" } },
              recommendations: { type: "array", items: { type: "string" } }
            }
          }
        }
      }
    });

    // Store in database
    const record = await base44.entities.PatentClaim.create({
      user_email: user.email,
      invention_title,
      technical_description,
      independent_claims: response.independent_claims || [],
      dependent_claims: response.dependent_claims || [],
      novelty_analysis: response.novelty_analysis || {},
      prior_art_risks: response.prior_art_risks || [],
      upto_compliance_check: response.upto_compliance_check || {},
      status: "draft",
      created_date: new Date().toISOString()
    });

    console.log(`Generated ${(response.independent_claims || []).length} independent and ${(response.dependent_claims || []).length} dependent claims`);

    return Response.json({
      success: true,
      record_id: record.id,
      ...response
    });
  } catch (error) {
    console.error('Claim generation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});