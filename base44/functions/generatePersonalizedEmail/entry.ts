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
5. Include a clear, compelling call-to-action
6. Keep email concise (3-4 short paragraphs max)
7. Make it ready to copy-paste (no placeholders)
8. If they've responded positively before, be more bold; if cold, be more consultative

Generate a complete email with:
- Subject line
- Body text (greeting → personalized context → value prop → CTA → closing)

Format as JSON:
{
  "subject": "Subject line here",
  "body": "Full email body here"
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

    return Response.json({
      subject: response.subject,
      body: response.body,
      investor_name: investor.investor_name,
      investor_org: investor.investor_org
    });
  } catch (error) {
    console.error('Error generating personalized email:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});