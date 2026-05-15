import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { invention_name, patent_count, rd_expenditure, market_size, company_stage } = body;

    // Structure the due diligence package data
    const ddPackage = {
      title: `${invention_name} — Due Diligence Package`,
      generated_date: new Date().toISOString().split('T')[0],
      prepared_by: user.full_name,
      prepared_for: 'Prospective Investors',
      sections: [
        {
          title: 'Executive Summary',
          content: `This Due Diligence Package provides a comprehensive overview of ${invention_name}, including IP portfolio, R&D investment, market analysis, and commercialization roadmap.`,
        },
        {
          title: 'IP Portfolio Overview',
          items: [
            `Total Patents: ${patent_count}`,
            `Patent Status: Mix of granted and pending`,
            `Coverage: Core technology + derivative applications`,
            `International Protection: US, EU, international filings`,
          ],
        },
        {
          title: 'R&D Investment',
          items: [
            `Total R&D Expenditure: $${rd_expenditure.toLocaleString()}`,
            `Development Timeline: 2+ years`,
            `Team: Experienced engineers & researchers`,
            `Current Stage: ${company_stage}`,
          ],
        },
        {
          title: 'Market Opportunity',
          items: [
            `Addressable Market Size: $${market_size.toLocaleString()}`,
            `Target Sectors: Energy, healthcare, communications`,
            `Growth Projection: 20-40% CAGR`,
            `Competitive Positioning: First-mover advantage`,
          ],
        },
        {
          title: 'Commercialization Path',
          items: [
            'Product roadmap 12-24 months',
            'Pilot program with strategic partners',
            'Licensing model for institutional buyers',
            'Direct sales for commercial applications',
          ],
        },
        {
          title: 'Risk Assessment & Mitigation',
          items: [
            'IP Risk: Comprehensive patent search completed; no major conflicts',
            'Technical Risk: Prototype validated; scaling in progress',
            'Market Risk: Pre-launch validation with target customers',
            'Regulatory Risk: FCC/FDA compliance roadmap established',
          ],
        },
        {
          title: 'Investment Highlights',
          items: [
            'Patent-backed IP with strong defensive moat',
            `$${rd_expenditure.toLocaleString()} already invested in R&D`,
            'Proven team with industry track record',
            'Multiple revenue streams (licensing, product sales, services)',
          ],
        },
      ],
    };

    return Response.json({ 
      success: true, 
      package: ddPackage,
      export_ready: true 
    });
  } catch (error) {
    console.error('Due diligence generation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});