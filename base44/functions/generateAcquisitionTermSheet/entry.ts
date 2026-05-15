import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      invention_name, 
      ip_valuation, 
      equity_offered, 
      funding_ask,
      investor_name,
      company_stage 
    } = body;

    // Calculate term sheet parameters based on valuation
    const post_money_valuation = ip_valuation / (equity_offered / 100);
    const investment_per_share = funding_ask / (equity_offered / 100 * 1000000);
    const fully_diluted_shares = 1000000;
    const investor_shares = (equity_offered / 100) * fully_diluted_shares;

    const termSheet = {
      title: `${invention_name} — Acquisition & Investment Term Sheet`,
      generated_date: new Date().toISOString().split('T')[0],
      prepared_by: user.full_name,
      terms: {
        'Invention / Asset': invention_name,
        'Current Stage': company_stage,
        'IP Valuation': `$${ip_valuation.toLocaleString()}`,
        'Funding Request': `$${funding_ask.toLocaleString()}`,
        'Equity Offered': `${equity_offered}%`,
        'Post-Money Valuation': `$${Math.round(post_money_valuation).toLocaleString()}`,
        'Price Per Share': `$${investment_per_share.toFixed(4)}`,
        'Investor Receives': `${investor_shares.toLocaleString()} shares (${equity_offered}%)`,
      },
      investment_use: [
        { category: 'Product Development', allocation: '35%' },
        { category: 'IP Protection & Legal', allocation: '20%' },
        { category: 'Market Launch', allocation: '25%' },
        { category: 'Team & Operations', allocation: '20%' },
      ],
      investor_rights: [
        'Board seat or board observer rights',
        'Pro-rata participation in future rounds',
        'Information rights (quarterly updates)',
        'Anti-dilution protection (weighted average)',
        'Liquidation preference (1x non-participating)',
      ],
      milestones: [
        { quarter: 'Q1', milestone: 'Product MVP ready for customer pilots' },
        { quarter: 'Q2', milestone: 'Customer validation from 5+ target accounts' },
        { quarter: 'Q3', milestone: 'Commercial licensing agreements signed' },
        { quarter: 'Q4', milestone: 'Revenue target: $250K+ ARR' },
      ],
      representations: [
        'Seller owns all IP and has authority to transfer',
        'No material IP litigation pending or threatened',
        'All patents properly filed and maintained',
        'No undisclosed liabilities or encumbrances',
      ],
      conditions: [
        'Closing contingent on satisfactory IP due diligence',
        'Satisfactory technology assessment by investor engineer',
        'Legal documentation (IP assignment, NDA)',
        'Standard representations and warranties',
      ],
    };

    return Response.json({ 
      success: true, 
      term_sheet: termSheet,
      investor: investor_name || 'Prospective Investor',
      export_ready: true 
    });
  } catch (error) {
    console.error('Term sheet generation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});