import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow admin or direct call with inventionId param
    const body = await req.json().catch(() => ({}));
    const { inventionId } = body;

    if (!inventionId) {
      return Response.json({ error: 'inventionId required' }, { status: 400 });
    }

    const inv = await base44.asServiceRole.entities.HybridInvention.get(inventionId);
    if (!inv) {
      return Response.json({ error: 'Invention not found' }, { status: 404 });
    }

    // Build structured PDF content as a rich JSON payload
    const packageData = {
      title: inv.hybrid_concept,
      mode: inv.mode,
      synergy_score: inv.synergy_score,
      market_sectors: inv.market_sectors,
      status: inv.status,
      ip_value_low: inv.ip_value_low,
      ip_value_high: inv.ip_value_high,
      ip_valuation: inv.ip_valuation,
      mechanism: inv.mechanism,
      patent_claims: inv.patent_claims,
      market_applications: inv.market_applications,
      required_components: inv.required_components,
      suggested_next_steps: inv.suggested_next_steps,
      input_technologies: (inv.input_nodes || []).map(n => n.label).join(', '),
      created_date: inv.created_date,
    };

    return Response.json({ success: true, package: packageData });
  } catch (error) {
    console.error('exportHybridIPPackage error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});