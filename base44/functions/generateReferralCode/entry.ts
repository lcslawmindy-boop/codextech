import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate unique referral code
    const code = `REF${user.email.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Check if user already has a referral code
    const existing = await base44.entities.Referral.filter({ referrer_email: user.email });
    
    if (existing && existing.length > 0) {
      // Return existing code
      return Response.json({ 
        code: existing[0].referrer_code,
        url: `${req.headers.get('origin')}/pricing?ref=${existing[0].referrer_code}`,
        credits: 0
      });
    }

    // Create new referral entry
    const referral = await base44.entities.Referral.create({
      referrer_email: user.email,
      referrer_code: code,
      store_credit_amount: 0
    });

    const origin = req.headers.get('origin') || 'https://zenithapex.com';
    const inviteUrl = `${origin}/pricing?ref=${code}`;

    return Response.json({ 
      code,
      url: inviteUrl,
      credits: 0
    });
  } catch (error) {
    console.error('Referral code generation error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});