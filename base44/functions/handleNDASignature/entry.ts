import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { full_name, email, company, signature_data, accepted_terms } = body;

    if (!full_name || !email || !accepted_terms) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get client IP
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
    const user_agent = req.headers.get('user-agent') || 'unknown';

    // Store NDA signature
    const signature = await base44.asServiceRole.entities.NDASignature.create({
      full_name,
      email,
      company: company || 'Not provided',
      signature_data: signature_data || '',
      accepted_terms,
      ip_address: ip,
      user_agent,
      signed_at: new Date().toISOString(),
    });

    // Send admin notification email
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@codextech.io';
    await base44.integrations.Core.SendEmail({
      to: adminEmail,
      subject: `🔐 NDA Signed - New Vault Access: ${full_name}`,
      body: `
New NDA Signature Received:

Name: ${full_name}
Email: ${email}
Company: ${company || 'Not provided'}
IP Address: ${ip}
Signed: ${new Date().toISOString()}

Signature ID: ${signature.id}

---
Check admin dashboard for master PDF and all signatures.
      `,
    });

    // Track conversion event
    base44.analytics.track({
      eventName: 'nda_signed',
      properties: {
        email,
        company,
        signed_at: new Date().toISOString(),
      },
    }).catch(() => {});

    return Response.json({
      success: true,
      signature_id: signature.id,
      message: 'NDA signed successfully. Access granted to vault.',
    });
  } catch (error) {
    console.error('NDA signing error:', error);
    return Response.json(
      { error: 'Failed to process NDA signature', details: error.message },
      { status: 500 }
    );
  }
});