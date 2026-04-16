import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { promo_subject, promo_body, discount_percent } = body;

    if (!promo_subject || !promo_body) {
      return Response.json({ error: 'Missing subject or body' }, { status: 400 });
    }

    // Get all active members (converted beta applicants)
    const members = await base44.asServiceRole.entities.BetaApplication.filter({ 
      status: 'converted' 
    });

    if (members.length === 0) {
      return Response.json({ 
        success: true, 
        sent_count: 0,
        message: 'No active members to email'
      });
    }

    let sent = 0;
    const errors = [];

    // Send email to each member
    for (const member of members) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: member.email,
          subject: promo_subject,
          body: promo_body
        });
        sent++;
      } catch (err) {
        errors.push({ email: member.email, error: err.message });
      }
    }

    return Response.json({
      success: true,
      sent_count: sent,
      total_members: members.length,
      errors: errors.length > 0 ? errors : null,
      discount: discount_percent
    });
  } catch (error) {
    console.error('Bulk email error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});