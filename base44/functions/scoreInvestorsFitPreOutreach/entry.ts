import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { investors, target_investment, equity_offered, sectors_of_interest } = body;

    if (!target_investment || !investors) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!Array.isArray(investors) || investors.length === 0) {
      return Response.json({ scored: [], total: 0, summary: { hot_prospects: 0, warm_leads: 0, cold_leads: 0 } });
    }

    // Score each investor based on profile fit (no communication history needed)
    const scored = investors.map(inv => {
      let score = 0;
      const breakdown = {};

      // 1. Investment Size Alignment (0-25 pts)
      // Match target investment with investor's typical check size
      const sizeAlignment = calculateSizeAlignment(target_investment, inv.investor_type);
      breakdown.size_alignment = sizeAlignment;
      score += sizeAlignment;

      // 2. Investor Type Fit (0-20 pts)
      // Different investor types have different risk/return profiles
      const typeScore = getTypeScore(inv.investor_type);
      breakdown.investor_type_fit = typeScore;
      score += typeScore;

      // 3. Sector Interest (0-20 pts)
      // Does their focus match your domain?
      const sectorScore = calculateSectorAlignment(sectors_of_interest, inv);
      breakdown.sector_alignment = sectorScore;
      score += sectorScore;

      // 4. Equity Efficiency (0-15 pts)
      // Is the equity you're offering attractive to this investor type?
      const equityScore = calculateEquityScore(equity_offered, inv.investor_type);
      breakdown.equity_fit = equityScore;
      score += equityScore;

      // 5. Stage Readiness (0-20 pts)
      // Are you at the right stage for them?
      const stageScore = getStageScore(inv.investor_type);
      breakdown.stage_fit = stageScore;
      score += stageScore;

      // 6. Humanitarian Impact Alignment (0-10 pts bonus)
      // Bonus if investor's mandate aligns with human betterment
      const humanitarianBonus = calculateHumanitarianBonus(inv);
      breakdown.humanitarian_impact = humanitarianBonus;
      score += humanitarianBonus;

      // Clamp score to 0-100
      const finalScore = Math.min(100, Math.max(0, Math.round(score)));

      return {
        investor_id: inv.id,
        investor_name: inv.investor_name,
        investor_org: inv.investor_org,
        investor_type: inv.investor_type,
        investor_email: inv.investor_email,
        fit_score: finalScore,
        scoring_breakdown: breakdown,
        recommendation: getRecommendation(finalScore),
        priority: getPriority(finalScore)
      };
    });

    // Sort by score descending
    scored.sort((a, b) => b.fit_score - a.fit_score);

    return Response.json({
      scored,
      total: scored.length,
      summary: {
        hot_prospects: scored.filter(s => s.fit_score >= 75).length,
        warm_leads: scored.filter(s => s.fit_score >= 50 && s.fit_score < 75).length,
        cold_leads: scored.filter(s => s.fit_score < 50).length
      }
    });
  } catch (error) {
    console.error('Error scoring investors:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// Calculate size alignment (0-25 pts)
function calculateSizeAlignment(targetInvestment, investorType) {
  const typicalSizes = {
    angel: { min: 25000, max: 250000 },
    vc_seed: { min: 500000, max: 2000000 },
    vc_growth: { min: 2000000, max: 10000000 },
    corporate: { min: 1000000, max: 50000000 },
    strategic: { min: 5000000, max: 100000000 },
    family_office: { min: 500000, max: 50000000 }
  };

  const range = typicalSizes[investorType] || { min: 100000, max: 10000000 };
  
  // Perfect fit = 25 pts
  if (targetInvestment >= range.min && targetInvestment <= range.max) {
    return 25;
  }
  
  // Close fit = 15 pts
  if (targetInvestment >= range.min * 0.5 && targetInvestment <= range.max * 2) {
    return 15;
  }
  
  // Way off = 0 pts
  return 0;
}

// Investor type fit (0-20 pts)
function getTypeScore(investorType) {
  const scores = {
    angel: 15,
    vc_seed: 20,
    vc_growth: 18,
    corporate: 16,
    strategic: 18,
    family_office: 15
  };
  return scores[investorType] || 10;
}

// Calculate sector alignment (0-20 pts)
function calculateSectorAlignment(userSectors, investor) {
  if (!userSectors || userSectors.length === 0) {
    return 10; // Neutral if not specified
  }

  const investorNotes = (investor.notes || '').toLowerCase();
  const investorOrg = (investor.investor_org || '').toLowerCase();
  
  let matches = 0;
  userSectors.forEach(sector => {
    if (investorNotes.includes(sector.toLowerCase()) || 
        investorOrg.includes(sector.toLowerCase())) {
      matches++;
    }
  });

  if (matches > 0) {
    return 20; // Full match
  }
  return 5; // Generic investor
}

// Equity score (0-15 pts)
function calculateEquityScore(equityOffered, investorType) {
  if (!equityOffered) {
    return 10; // Neutral
  }

  const typicalEquity = {
    angel: { min: 5, max: 15 },
    vc_seed: { min: 15, max: 40 },
    vc_growth: { min: 20, max: 50 },
    corporate: { min: 0, max: 30 },
    strategic: { min: 5, max: 40 },
    family_office: { min: 10, max: 35 }
  };

  const range = typicalEquity[investorType] || { min: 5, max: 30 };
  
  if (equityOffered >= range.min && equityOffered <= range.max) {
    return 15;
  }
  
  if (equityOffered >= range.min * 0.7 && equityOffered <= range.max * 1.3) {
    return 10;
  }
  
  return 5;
}

// Stage readiness (0-20 pts)
function getStageScore(investorType) {
  // Each investor type has stage preferences
  const stageScores = {
    angel: 20,        // Often invest at any stage
    vc_seed: 20,      // Seed stage specialists
    vc_growth: 15,    // Later stage preference
    corporate: 18,    // Various stages
    strategic: 18,    // Strategic fit matters more than stage
    family_office: 16 // Conservative, prefer later stage
  };
  return stageScores[investorType] || 12;
}

// Get recommendation text based on score
function getRecommendation(score) {
  if (score >= 75) return 'Excellent fit - High priority outreach';
  if (score >= 50) return 'Good fit - Solid prospect';
  if (score >= 25) return 'Potential fit - Research more';
  return 'Poor fit - Consider deprioritizing';
}

// Get priority level
function getPriority(score) {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

// Calculate humanitarian impact bonus (0-10 pts)
// Favors investors focused on longevity, clean energy, health, and human advancement
function calculateHumanitarianBonus(investor) {
  const investorText = (
    (investor.investor_name || '') + 
    ' ' + 
    (investor.investor_org || '') + 
    ' ' + 
    (investor.notes || '')
  ).toLowerCase();
  
  const humanitarianKeywords = [
    'longevity', 'aging', 'rejuvenation', 'lifespan', 'healthspan',
    'clean energy', 'renewable', 'free energy', 'sustainability',
    'health', 'cure', 'disease', 'healing', 'wellness',
    'human advancement', 'humanitarian', 'collective benefit',
    'telomere', 'cellular', 'regeneration', 'rejuven'
  ];
  
  const defenseKeywords = [
    'defense', 'military', 'weapon', 'warfare', 'classified', 'intelligence'
  ];
  
  // Count humanitarian keyword matches
  let humanScore = 0;
  humanitarianKeywords.forEach(keyword => {
    if (investorText.includes(keyword)) {
      humanScore += 2;
    }
  });
  
  // Penalize purely defense-focused (but not all strategic/government)
  let defensePenalty = 0;
  defenseKeywords.forEach(keyword => {
    if (investorText.includes(keyword)) {
      defensePenalty += 1;
    }
  });
  
  // Final score: cap at 10, subtract defense focus
  return Math.max(0, Math.min(10, humanScore - defensePenalty));
}