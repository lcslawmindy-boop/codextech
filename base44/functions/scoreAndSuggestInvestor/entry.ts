import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const investor = body.investor;

    if (!investor) {
      return Response.json({ error: 'No investor data provided' }, { status: 400 });
    }

    // ── STAGE SCORING ──
    const stageScores = {
      prospect: 0,
      initial_outreach: 5,
      responded: 10,
      meeting_scheduled: 15,
      due_diligence: 20,
      term_sheet: 23,
      negotiating: 25,
      closed: 100,
      passed: -10
    };
    const stageScore = stageScores[investor.stage] || 0;

    // ── ENGAGEMENT SCORING (recency + frequency) ──
    let engagementScore = 0;
    if (investor.last_contact) {
      const daysSinceContact = Math.floor((new Date() - new Date(investor.last_contact)) / (1000 * 60 * 60 * 24));
      if (daysSinceContact <= 7) engagementScore = 20;
      else if (daysSinceContact <= 14) engagementScore = 15;
      else if (daysSinceContact <= 30) engagementScore = 10;
      else engagementScore = 0;
    }

    // Communication frequency
    const commCount = (investor.communications || []).length;
    if (commCount >= 5) engagementScore = Math.min(20, engagementScore + 5);
    if (commCount >= 10) engagementScore = Math.min(20, engagementScore + 5);

    // Response rate from communications
    const comms = investor.communications || [];
    const responsesCount = comms.filter(c => c.response || c.response_date).length;
    const responseRate = comms.length > 0 ? (responsesCount / comms.length) * 100 : 0;
    let responseScore = 0;
    if (responseRate >= 100) responseScore = 15;
    else if (responseRate >= 75) responseScore = 12;
    else if (responseRate >= 50) responseScore = 8;
    else if (responseRate >= 25) responseScore = 5;

    // ── CUSTOM ASSESSMENT SCORING ──
    // Analyze investor_type, target_investment alignment, and notes sentiment
    let customScore = 0;
    
    // Investment size alignment
    if (investor.target_investment && investor.equity_offered) {
      customScore += 10;
    }

    // Strategic fit indicators in notes
    if (investor.notes) {
      const notesLower = investor.notes.toLowerCase();
      const positiveIndicators = ['excellent', 'perfect', 'great', 'strong', 'ideal', 'aligned', 'interested', 'enthusiastic', 'committed', 'prioritize'];
      const negativeIndicators = ['uncertain', 'hesitant', 'weak', 'poor', 'uninterested', 'pass', 'cold', 'inactive'];
      
      const positiveMatches = positiveIndicators.filter(p => notesLower.includes(p)).length;
      const negativeMatches = negativeIndicators.filter(n => notesLower.includes(n)).length;
      
      customScore += positiveMatches * 8;
      customScore -= negativeMatches * 6;
    }

    customScore = Math.max(0, Math.min(40, customScore));

    // ── URGENCY / ACTION SCORING ──
    let urgencyScore = 0;
    if (investor.next_action_date) {
      const daysUntilAction = Math.floor((new Date(investor.next_action_date) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysUntilAction <= 7 && daysUntilAction >= 0) urgencyScore = 10;
      else if (daysUntilAction < 0) urgencyScore = 5; // Action is overdue
    }

    // ── TOTAL LIKELIHOOD SCORE ──
    const likelihood_score = Math.min(100, Math.max(0, stageScore + engagementScore + responseScore + customScore + urgencyScore));

    // ── RECOMMENDATION ──
    let recommendation = 'Cold';
    if (likelihood_score >= 75) recommendation = 'Hot';
    else if (likelihood_score >= 50) recommendation = 'Warm';

    // ── NEXT BEST ACTION ──
    let nextAction = '';
    let actionPriority = 'medium';

    if (investor.stage === 'passed' || likelihood_score < 30) {
      nextAction = 'Archive or deprioritize — focus on warmer leads';
      actionPriority = 'low';
    } else if (investor.stage === 'closed') {
      nextAction = 'Follow-up: Send partnership/integration proposal';
      actionPriority = 'low';
    } else if (investor.stage === 'negotiating') {
      nextAction = 'Schedule term sheet review call (within 48 hours)';
      actionPriority = 'critical';
    } else if (investor.stage === 'term_sheet') {
      nextAction = 'Send term sheet redlines and counter-proposal';
      actionPriority = 'high';
    } else if (investor.stage === 'due_diligence') {
      nextAction = 'Provide financial projections + reference calls';
      actionPriority = 'high';
    } else if (investor.stage === 'meeting_scheduled') {
      nextAction = 'Confirm meeting details, send prep materials';
      actionPriority = 'high';
    } else if (responseRate >= 50 && investor.stage === 'responded') {
      nextAction = 'Schedule initial discovery call (pitch meeting)';
      actionPriority = 'high';
    } else if (responseRate > 0 && investor.stage === 'initial_outreach') {
      nextAction = 'Send follow-up with additional context/deck';
      actionPriority = 'medium';
    } else if (daysSinceContact > 14 && investor.stage === 'initial_outreach') {
      nextAction = 'Reactivate with new angle or warm intro';
      actionPriority = 'medium';
    } else if (investor.stage === 'prospect') {
      nextAction = 'Research investor profile + warm intro strategy';
      actionPriority = 'medium';
    }

    const scoring_breakdown = {
      stage_progress: stageScore,
      engagement: engagementScore,
      response_rate: responseScore,
      custom_scoring: customScore,
      imminent_action: urgencyScore
    };

    return Response.json({
      likelihood_score,
      recommendation,
      next_action: nextAction,
      action_priority: actionPriority,
      scoring_breakdown,
      response_rate_pct: Math.round(responseRate)
    });
  } catch (error) {
    console.error('Error scoring investor:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});