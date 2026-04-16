import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all investors for this user
    const investors = await base44.entities.InvestorOutreach.filter({
      user_email: user.email
    });

    if (investors.length === 0) {
      return Response.json({ message: 'No investors to score', scored: [] });
    }

    const scored = investors.map(inv => {
      let score = 0;
      const factors = {};

      // Stage progression scoring (0-25 points)
      const stageScores = {
        prospect: 0,
        initial_outreach: 5,
        responded: 10,
        meeting_scheduled: 15,
        due_diligence: 20,
        term_sheet: 23,
        negotiating: 25,
        closed: 100,
        passed: -50
      };
      factors.stage_progress = stageScores[inv.stage] || 0;
      score += factors.stage_progress;

      // Recent engagement (0-20 points)
      if (inv.last_contact) {
        const daysSinceContact = Math.floor((Date.now() - new Date(inv.last_contact)) / (1000 * 60 * 60 * 24));
        factors.engagement = daysSinceContact < 7 ? 20 : daysSinceContact < 14 ? 15 : daysSinceContact < 30 ? 10 : 0;
        score += factors.engagement;
      }

      // Communication responsiveness (0-15 points)
      if (inv.communications && inv.communications.length > 0) {
        const responded = inv.communications.filter(c => c.response).length;
        const responseRate = responded / inv.communications.length;
        factors.response_rate = Math.round(responseRate * 15);
        score += factors.response_rate;
      }

      // Scoring factors from previous analysis (0-40 points)
      if (inv.scoring_factors) {
        const factors_sum = Object.values(inv.scoring_factors).reduce((a, b) => a + b, 0) / 5;
        factors.custom_scoring = Math.round(factors_sum * 0.4);
        score += factors.custom_scoring;
      }

      // Investment size alignment bonus (0-10 points)
      if (inv.target_investment && inv.investor_type) {
        const typicalSizes = {
          angel: 50000,
          vc_seed: 500000,
          vc_growth: 5000000,
          corporate: 10000000,
          strategic: 5000000,
          family_office: 3000000
        };
        const match = Math.abs(inv.target_investment - typicalSizes[inv.investor_type]) / typicalSizes[inv.investor_type];
        factors.size_alignment = match < 0.5 ? 10 : match < 1 ? 5 : 0;
        score += factors.size_alignment;
      }

      // Next action pending (0-10 points bonus if action due soon)
      if (inv.next_action_date) {
        const daysUntilAction = Math.floor((new Date(inv.next_action_date) - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysUntilAction > 0 && daysUntilAction <= 7) {
          factors.imminent_action = 10;
          score += 10;
        }
      }

      // Clamp score to 0-100
      score = Math.max(0, Math.min(100, score));

      return {
        investor_id: inv.id,
        investor_name: inv.investor_name,
        investor_org: inv.investor_org,
        investor_type: inv.investor_type,
        current_stage: inv.stage,
        likelihood_score: Math.round(score),
        scoring_breakdown: factors,
        recommendation: score >= 75 ? "Hot prospect - prioritize" : score >= 50 ? "Warm lead - nurture" : "Cold - low priority",
        next_action: inv.next_action,
        last_contact: inv.last_contact
      };
    });

    // Sort by likelihood score (descending)
    const ranked = scored.sort((a, b) => b.likelihood_score - a.likelihood_score);

    console.log(`Scored ${ranked.length} investors. Top: ${ranked[0]?.investor_name} (${ranked[0]?.likelihood_score}%)`);

    return Response.json({
      success: true,
      total_investors: ranked.length,
      ranked_investors: ranked,
      summary: {
        hot_prospects: ranked.filter(i => i.likelihood_score >= 75).length,
        warm_leads: ranked.filter(i => i.likelihood_score >= 50 && i.likelihood_score < 75).length,
        cold_leads: ranked.filter(i => i.likelihood_score < 50).length
      }
    });
  } catch (error) {
    console.error('Scoring error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});