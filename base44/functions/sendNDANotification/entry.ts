import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    
    const { full_name, email, organization } = body;

    if (!full_name || !email) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('NDA signature received from:', { full_name, email, organization });

    // Send confirmation email to member
    await base44.integrations.Core.SendEmail({
      to: email,
      subject: 'NDA Signature Confirmed — Welcome to C.O.D.E.X.T.E.C.H.',
      body: `
Hello ${full_name},

Your electronic signature on the C.O.D.E.X.T.E.C.H. Non-Disclosure Agreement has been recorded.

You now have access to:
- 40+ engineering build plans with exact BOMs and supplier links
- 40+ structured courses on scalar electromagnetics and advanced physics
- AI-powered patent drafting tools and FTO analysis
- Investor package generation and capital-raising resources
- Complete archive of suppressed research and prior art analysis

Please do not share your login credentials. Your access is personal and monitored.

Questions? Contact support@zenithapex.com

—
Zenith Apex LLC
C.O.D.E.X.T.E.C.H. Platform
      `,
    });

    // Send notification email to admin
    await base44.integrations.Core.SendEmail({
      to: 'admin@zenithapex.com',
      subject: `New NDA Signature - ${full_name}`,
      body: `
NDA Signature Received

Name: ${full_name}
Email: ${email}
Organization: ${organization || 'N/A'}
Signed: ${new Date().toISOString()}

This user has agreed to the NDA and may access the vault.
      `,
    });

    // Track analytics
    await base44.analytics.track({
      eventName: 'nda_signature_completed',
      properties: {
        email,
        organization: organization || 'none',
      }
    });

    return Response.json({ success: true, message: 'NDA signature recorded' });
  } catch (error) {
    console.error('Error in sendNDANotification:', error);
    return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
});