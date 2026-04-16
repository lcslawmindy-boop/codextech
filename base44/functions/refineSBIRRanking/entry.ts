import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all feedback for this user
    const feedbackRecords = await base44.entities.FeedbackLog.filter({
      user_email: user.email
    });

    if (feedbackRecords.length === 0) {
      return Response.json({ message: 'No feedback data yet', adjustments: {} });
    }

    // Calculate feedback adjustments
    const adjustments = {};
    const feedbackByMatch = {};

    feedbackRecords.forEach(fb => {
      const key = `${fb.solicitation_id}`;
      if (!feedbackByMatch[key]) {
        feedbackByMatch[key] = { scores: [], count: 0, aiScore: fb.ai_fit_score };
      }
      feedbackByMatch[key].scores.push(fb.user_rating);
      feedbackByMatch[key].count += 1;
    });

    // Calculate average user feedback vs AI score
    Object.entries(feedbackByMatch).forEach(([solId, data]) => {
      const avgUserRating = data.scores.reduce((a, b) => a + b, 0) / data.count; // -1 to 1
      const adjustment = (avgUserRating * 10); // Scale to -10 to +10
      adjustments[solId] = {
        feedback_count: data.count,
        avg_user_rating: avgUserRating,
        ai_score: data.aiScore,
        suggested_adjustment: adjustment,
        direction: avgUserRating > 0.3 ? 'increase' : avgUserRating < -0.3 ? 'decrease' : 'neutral'
      };
    });

    // Log insights
    console.log('SBIR Ranking Refinement:', JSON.stringify(adjustments, null, 2));

    return Response.json({
      message: 'Ranking algorithm refined from user feedback',
      total_feedback_points: feedbackRecords.length,
      matches_evaluated: Object.keys(adjustments).length,
      adjustments
    });
  } catch (error) {
    console.error('Refinement error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});