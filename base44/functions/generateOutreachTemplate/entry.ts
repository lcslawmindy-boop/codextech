import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { 
      opportunity_id, 
      investor_id, 
      personalization_level = 'standard' 
    } = await req.json();

    if (!opportunity_id || !investor_id) {
      return Response.json({ 
        error: 'opportunity_id and investor_id required' 
      }, { status: 400 });
    }

    // Fetch opportunity and investor
    const [opportunity, investor] = await Promise.all([
      base44.entities.OpportunityCard.get(opportunity_id),
      base44.entities.MemberProfile.get(investor_id)
    ]);

    if (!opportunity || !investor) {
      return Response.json({ error: 'Opportunity or investor not found' }, { status: 404 });
    }

    // Generate personalized subject line
    const subject = generateSubject(opportunity, investor, personalization_level);

    // Generate email body based on personalization level
    const emailBody = generateEmailBody(opportunity, investor, personalization_level);

    // Generate pitch angles (multiple approaches)
    const pitchAngles = generatePitchAngles(opportunity, investor);

    return Response.json({
      opportunity_id,
      investor_id,
      investor_name: investor.anonymous_alias,
      subject_line: subject,
      email_body: emailBody,
      pitch_angles: pitchAngles,
      recommended_follow_up_days: getFollowUpTiming(investor),
      connection_points: findConnectionPoints(opportunity, investor),
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Template generation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function generateSubject(opportunity, investor, level) {
  const subjects = {
    casual: [
      `${opportunity.alias} — IP opportunity aligned with your portfolio`,
      `Potential match: ${opportunity.category} innovation + your investment strategy`,
      `Your expertise + this ${opportunity.stage} innovation`
    ],
    direct: [
      `Investment opportunity: ${opportunity.alias} (${opportunity.category})`,
      `${opportunity.stage} IP seeking ${investor.investment_range_min}–${investor.investment_range_max} funding`,
      `Patent-backed ${opportunity.category} ready for capital`
    ],
    technical: [
      `Technical IP review: ${opportunity.alias} — ${opportunity.category}`,
      `Engineering opportunity analysis: ${opportunity.headline?.slice(0, 40)}...`,
      `Patent landscape alignment: Your expertise + this innovation`
    ]
  };

  const chosen = subjects[level] || subjects.standard;
  return chosen[Math.floor(Math.random() * chosen.length)];
}

function generateEmailBody(opportunity, investor, level) {
  const investorName = investor.anonymous_alias || 'investor';
  const opportunityName = opportunity.alias;

  if (level === 'casual') {
    return `Hi ${investorName},

I've identified ${opportunityName} as a strong potential fit with your investment portfolio.

**The opportunity:**
${opportunity.headline}

**Why this matters for you:**
Your expertise in ${investor.expertise_areas?.[0] || 'technology'} aligns directly with this ${opportunity.stage.toLowerCase()} invention.

**The ask:**
${opportunity.funding_ask ? `$${opportunity.funding_ask.toLocaleString()} to accelerate market entry` : 'Strategic partnership on IP commercialization'}

**Next steps:**
I'd love to discuss whether this fits your investment thesis. Are you open to a brief exploration call?

Best,
[Your name]`;
  } else if (level === 'direct') {
    return `${investorName},

**Opportunity:** ${opportunityName}
**Stage:** ${opportunity.stage}
**Category:** ${opportunity.category}
**Funding Ask:** ${opportunity.funding_ask ? `$${opportunity.funding_ask.toLocaleString()}` : 'TBD'}
**Equity Offered:** ${opportunity.equity_offered || 'Negotiable'}%

**Problem Statement:**
${opportunity.problem_statement}

**Solution:**
${opportunity.solution_summary}

**Market Size:** ${opportunity.market_size}

**Why we're reaching out:**
Your investment pattern in ${investor.expertise_areas?.[0] || 'this sector'} suggests strong alignment.

**Let's talk?**
[calendly/meeting link]`;
  } else {
    return `${investorName},

**Technical IP Summary: ${opportunityName}**

**Innovation Overview:**
${opportunity.headline}

**Technical Differentiation:**
${opportunity.solution_summary}

**IP Status:** ${opportunity.stage}

**Market Context:** ${opportunity.market_size}

**Investment Thesis Alignment:**
- Sector: ${opportunity.category}
- Stage: ${opportunity.stage}
- Capital Required: ${opportunity.funding_ask ? `$${opportunity.funding_ask.toLocaleString()}` : 'Flexible'}
- Equity Terms: ${opportunity.equity_offered || 'Open'}%

**Due Diligence:**
[Link to technical documentation / patent filings / market research]

**Proposed Next Step:**
Technical deep-dive call to discuss engineering validation and market opportunity.

Interested in exploring?`;
  }
}

function generatePitchAngles(opportunity, investor) {
  const angles = [];

  // Angle 1: Market expansion
  if (opportunity.market_size) {
    angles.push({
      angle: 'Market Expansion',
      pitch: `This ${opportunity.category} innovation targets a ${opportunity.market_size} market. Your portfolio shows strength in scaling solutions—this is the next growth vector.`
    });
  }

  // Angle 2: IP moat
  if (opportunity.stage.includes('Patent')) {
    angles.push({
      angle: 'IP Protection',
      pitch: `${opportunity.stage} status provides defensible moat. Rare to find pre-revenue opportunity with this level of IP security.`
    });
  }

  // Angle 3: Sector expertise
  if (investor.expertise_areas && investor.expertise_areas.length > 0) {
    angles.push({
      angle: 'Expertise Leverage',
      pitch: `Your background in ${investor.expertise_areas[0]} means you can immediately add value to commercialization. Not just capital—operational synergy.`
    });
  }

  // Angle 4: Co-inventor opportunity
  if (opportunity.headline?.toLowerCase().includes('seeking')) {
    angles.push({
      angle: 'Co-Inventor Partnership',
      pitch: `Team is seeking partners with your profile. This could be a co-investment + operational role, not passive capital.`
    });
  }

  return angles;
}

function getFollowUpTiming(investor) {
  // More active investors get faster follow-up
  const totalDeals = (investor.active_deals || 0) + (investor.completed_deals || 0);
  if (totalDeals > 10) return 3; // 3 days for active investors
  if (totalDeals > 5) return 5; // 5 days for moderate investors
  return 7; // 7 days for less active
}

function findConnectionPoints(opportunity, investor) {
  const points = [];

  // Expertise match
  if (investor.expertise_areas) {
    investor.expertise_areas.forEach(exp => {
      if (opportunity.category?.toLowerCase().includes(exp.toLowerCase())) {
        points.push(`Shared expertise in ${exp}`);
      }
    });
  }

  // Investment stage match
  if (opportunity.stage && investor.active_deals > 0) {
    points.push(`Active in ${opportunity.stage} stage investments`);
  }

  // Portfolio diversity
  if (investor.completed_deals > 5) {
    points.push(`Experienced portfolio builder (${investor.completed_deals} prior exits)`);
  }

  return points.length > 0 ? points : ['IP investment opportunity'];
}