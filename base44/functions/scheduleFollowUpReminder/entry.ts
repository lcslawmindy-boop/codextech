import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all investor outreach records for this user
    const investors = await base44.entities.InvestorOutreach.filter({
      user_email: user.email
    });

    const reminders = [];
    const now = new Date();

    // Analyze each investor for follow-up needs
    investors.forEach(inv => {
      if (!inv.last_contact) return;

      const lastContact = new Date(inv.last_contact);
      const daysSinceContact = Math.floor((now - lastContact) / (1000 * 60 * 60 * 24));

      let urgency = null;
      let daysUntilReminder = null;

      // Determine follow-up schedule based on stage
      const followUpSchedule = {
        prospect: 30, // Follow up every 30 days
        initial_outreach: 7, // Follow up after 1 week
        responded: 3, // Follow up after 3 days
        meeting_scheduled: 1, // Follow up day before meeting
        due_diligence: 5, // Follow up every 5 days during DD
        term_sheet: 2, // Follow up every 2 days on terms
        negotiating: 1, // Daily during negotiation
        closed: null, // No follow-up needed
        passed: null // No follow-up needed
      };

      const scheduledDays = followUpSchedule[inv.stage];
      if (scheduledDays === null) return;

      daysUntilReminder = scheduledDays - daysSinceContact;

      if (daysSinceContact >= scheduledDays) {
        urgency = daysSinceContact > scheduledDays + 7 ? "critical" : "high";
      } else if (daysUntilReminder <= 2) {
        urgency = "medium";
      }

      if (urgency) {
        reminders.push({
          investor_id: inv.id,
          investor_name: inv.investor_name,
          investor_org: inv.investor_org,
          stage: inv.stage,
          last_contact: inv.last_contact,
          days_since_contact: daysSinceContact,
          days_overdue: Math.max(0, daysSinceContact - scheduledDays),
          urgency,
          suggested_action: getSuggestedAction(inv.stage, daysSinceContact),
          next_action_due: inv.next_action_date
        });
      }
    });

    // Sort by urgency and days overdue
    reminders.sort((a, b) => {
      const urgencyOrder = { critical: 0, high: 1, medium: 2 };
      const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      return urgencyDiff || b.days_overdue - a.days_overdue;
    });

    console.log(`Generated ${reminders.length} follow-up reminders for ${investors.length} investors`);

    return Response.json({
      success: true,
      total_investors: investors.length,
      reminders_generated: reminders.length,
      reminders,
      summary: {
        critical: reminders.filter(r => r.urgency === "critical").length,
        high: reminders.filter(r => r.urgency === "high").length,
        medium: reminders.filter(r => r.urgency === "medium").length
      }
    });
  } catch (error) {
    console.error('Reminder scheduling error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function getSuggestedAction(stage, daysSinceContact) {
  const actions = {
    prospect: `Check in with ${daysSinceContact > 30 ? "personalized" : "brief"} outreach email`,
    initial_outreach: `Send follow-up email with additional value prop or social proof`,
    responded: `Schedule introductory call or send meeting link`,
    meeting_scheduled: `Send meeting reminder and prep materials`,
    due_diligence: `Share requested documents and answer questions`,
    term_sheet: `Discuss key terms and address concerns`,
    negotiating: `Follow up on open items and move toward closing`
  };
  return actions[stage] || "Check in with investor";
}