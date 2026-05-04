import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { opportunity_id } = await req.json();

    if (!opportunity_id) {
      return Response.json({ error: 'opportunity_id required' }, { status: 400 });
    }

    // Fetch the opportunity
    const opportunity = await base44.entities.OpportunityCard.get(opportunity_id);
    if (!opportunity) {
      return Response.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Fetch all investor profiles
    const investors = await base44.entities.MemberProfile.filter({
      profile_type: { $in: ['investor', 'both'] },
      status: 'active'
    });

    // Score each investor against the opportunity
    const scoredMatches = investors.map(investor => {
      let score = 0;
      const factors = {};

      // Factor 1: Investment range match (0-25 points)
      if (investor.investment_range_min && investor.investment_range_max) {
        const opportunityFunding = opportunity.funding_ask || 0;
        if (opportunityFunding >= investor.investment_range_min && opportunityFunding <= investor.investment_range_max) {
          score += 25;
          factors.investment_range = 25;
        } else if (opportunityFunding >= investor.investment_range_min * 0.8 && opportunityFunding <= investor.investment_range_max * 1.2) {
          score += 15;
          factors.investment_range = 15;
        }
      }

      // Factor 2: Category expertise match (0-25 points)
      if (investor.expertise_areas && investor.expertise_areas.length > 0) {
        const opportunityTags = opportunity.tags || [];
        const categoryMatches = investor.expertise_areas.filter(exp =>
          opportunityTags.some(tag => tag.toLowerCase().includes(exp.toLowerCase()))
        ).length;
        const categoryScore = (categoryMatches / Math.max(investor.expertise_areas.length, 1)) * 25;
        score += categoryScore;
        factors.category_match = Math.round(categoryScore);
      }

      // Factor 3: Preferred categories (0-20 points)
      if (investor.preferred_categories && investor.preferred_categories.length > 0) {
        const preferredMatch = investor.preferred_categories.some(pref =>
          opportunity.category?.toLowerCase().includes(pref.toLowerCase())
        );
        if (preferredMatch) {
          score += 20;
          factors.preferred_category = 20;
        }
      }

      // Factor 4: Deal history & success rate (0-20 points)
      const totalDeals = (investor.active_deals || 0) + (investor.completed_deals || 0);
      if (totalDeals > 0) {
        const successRate = investor.completed_deals / totalDeals;
        const historyScore = (successRate * 15) + Math.min(totalDeals / 10 * 5, 5);
        score += Math.min(historyScore, 20);
        factors.deal_history = Math.round(Math.min(historyScore, 20));
      }

      // Factor 5: Verification status (0-10 points)
      if (investor.profile_verified) {
        score += 10;
        factors.verified = 10;
      }

      return {
        investor_id: investor.id,
        investor_name: investor.display_name,
        investor_alias: investor.anonymous_alias,
        email: investor.user_email,
        total_score: Math.round(score),
        score_breakdown: factors,
        investment_range: {
          min: investor.investment_range_min,
          max: investor.investment_range_max
        },
        expertise_areas: investor.expertise_areas || [],
        completed_deals: investor.completed_deals || 0,
        active_deals: investor.active_deals || 0,
        verified: investor.profile_verified,
        alignment_score: calculateAlignment(investor, opportunity)
      };
    });

    // Sort by total score descending
    const rankedMatches = scoredMatches
      .filter(match => match.total_score > 30) // Minimum score threshold
      .sort((a, b) => b.total_score - a.total_score)
      .slice(0, 20); // Top 20 matches

    // Log for debugging
    console.log(`Scored ${scoredMatches.length} investors, ${rankedMatches.length} qualified matches`);

    return Response.json({
      opportunity_id,
      opportunity_name: opportunity.alias,
      total_investors_scored: scoredMatches.length,
      qualified_matches: rankedMatches.length,
      matches: rankedMatches,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Scoring error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function calculateAlignment(investor, opportunity) {
  const alignmentFactors = [];

  // Stage alignment
  if (opportunity.stage === 'Patent Granted' || opportunity.stage === 'Patent Pending') {
    alignmentFactors.push('patent_stage');
  }

  // Equity/funding alignment
  if (opportunity.equity_offered > 0 && investor.investment_range_max) {
    alignmentFactors.push('equity_aligned');
  }

  // Market opportunity alignment
  if (opportunity.market_size && opportunity.market_size.toLowerCase().includes('large')) {
    alignmentFactors.push('market_size');
  }

  return alignmentFactors;
}