import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const investorId = body.investor_id;

    if (!investorId) {
      return Response.json({ error: 'No investor ID provided' }, { status: 400 });
    }

    // Fetch full investor record
    const investor = await base44.entities.InvestorOutreach.read(investorId);
    
    if (!investor) {
      return Response.json({ error: 'Investor not found' }, { status: 404 });
    }

    // Build communication history context
    const communicationHistory = investor.communications || [];
    const recentComms = communicationHistory.slice(-5).reverse();
    const commsContext = recentComms.map((c, i) => 
      `${i + 1}. ${new Date(c.date).toLocaleDateString()} (${c.type}): "${c.content}${c.response ? ` → They responded: ${c.response}` : ''}"`
    ).join('\n');

    // Build investor profile context
    let investorContext = `
Investor Name: ${investor.investor_name}
Organization: ${investor.investor_org}
Type: ${investor.investor_type}
Current Stage: ${investor.stage}
Target Investment: $${investor.target_investment?.toLocaleString() || 'Unknown'}
Equity Offered: ${investor.equity_offered || 'TBD'}%
Last Contact: ${investor.last_contact ? new Date(investor.last_contact).toLocaleDateString() : 'Never'}
Response Rate: ${((communicationHistory.filter(c => c.response).length / communicationHistory.length) * 100).toFixed(0)}% (${communicationHistory.length} total communications)
`;

    if (investor.notes) {
      investorContext += `\nNotes: ${investor.notes}`;
    }

    if (commsContext) {
      investorContext += `\n\nRecent Communication History:\n${commsContext}`;
    }

    // Generate personalized email using Claude
    const emailPrompt = `You are an expert fundraising and investor relations specialist. Your task is to draft a highly personalized, high-conversion outreach email based on the investor's profile and communication history.

INVESTOR PROFILE & HISTORY:
${investorContext}

INSTRUCTIONS:
1. Reference specific details from their communication history to show genuine engagement
2. Tailor the message to their investor type and interests mentioned in past communications
3. Address any concerns or questions they've raised before
4. Keep tone professional but warm and conversational
5. Include a clear, compelling call-to-action with a link (use [CALL_TO_ACTION_URL] as placeholder)
6. Keep email concise (3-4 short paragraphs max)
7. Make it ready to copy-paste (no placeholders except [CALL_TO_ACTION_URL])
8. If they've responded positively before, be more bold; if cold, be more consultative

Generate a complete email with:
- Subject line
- Body text (greeting → personalized context → value prop → CTA with [CALL_TO_ACTION_URL] → closing)

Format as JSON:
{
  "subject": "Subject line here",
  "body": "Full email body here with [CALL_TO_ACTION_URL] placeholder for the link"
}`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: emailPrompt,
      model: "claude_sonnet_4_6",
      response_json_schema: {
        type: "object",
        properties: {
          subject: { type: "string" },
          body: { type: "string" }
        }
      }
    });

    // Generate unique tracking token
    const trackingToken = `${investorId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get tracking domain (use current request host as base)
    const baseUrl = new URL(req.url).origin;
    const trackingPixel = `${baseUrl}/api/trackEmailEvent?t=${trackingToken}&type=open`;
    
    // Replace CTA URL with tracked version
    const ctaUrlMatch = response.body.match(/\[CALL_TO_ACTION_URL\]/);
    let finalBody = response.body;
    let ctaUrl = 'https://zenithapex.com/investor-portal';
    
    if (ctaUrlMatch) {
      const trackedUrl = `${baseUrl}/api/trackEmailEvent?t=${trackingToken}&type=click&url=${encodeURIComponent(ctaUrl)}`;
      finalBody = response.body.replace(/\[CALL_TO_ACTION_URL\]/g, trackedUrl);
    }

    // Add tracking pixel to end of email
    finalBody += `\n\n---\n[Tracking pixel will be added automatically when sent]`;

    // Create email tracking record
    await base44.entities.EmailTracking.create({
      user_email: user.email,
      investor_id: investorId,
      investor_name: investor.investor_name,
      tracking_token: trackingToken,
      subject: response.subject,
      sent_at: new Date().toISOString(),
      status: 'sent'
    });

    return Response.json({
      subject: response.subject,
      body: finalBody,
      investor_name: investor.investor_name,
      investor_org: investor.investor_org,
      tracking_token: trackingToken,
      tracking_pixel: trackingPixel,
      ready_to_send: true
    });
  } catch (error) {
    console.error('Error generating personalized email with tracking:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});