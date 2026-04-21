import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { referral_code, referred_email, referred_name, membership_tier } = await req.json();

    if (!referral_code || !referred_email || !membership_tier) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find referrer by code
    const referrals = await base44.entities.Referral.filter({ referrer_code: referral_code });
    
    if (!referrals || referrals.length === 0) {
      return Response.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    const referrerRecord = referrals[0];

    // Calculate store credit based on tier
    const creditMap = {
      builder: 10,
      researcher: 25,
      pro: 50
    };
    const creditAmount = creditMap[membership_tier] || 0;

    // Create referral completion record
    await base44.entities.Referral.create({
      referrer_email: referrerRecord.referrer_email,
      referrer_code: referral_code,
      referred_email,
      referred_name: referred_name || referred_email,
      membership_tier,
      status: 'completed',
      store_credit_amount: creditAmount,
      completed_date: new Date().toISOString()
    });

    // Update referrer's total credits
    const referrerReferrals = await base44.entities.Referral.filter({ 
      referrer_email: referrerRecord.referrer_email,
      status: 'completed'
    });

    const totalCredits = referrerReferrals.reduce((sum, ref) => sum + (ref.store_credit_amount || 0), creditAmount);

    return Response.json({ 
      success: true,
      referrer_email: referrerRecord.referrer_email,
      credit_awarded: creditAmount,
      total_credits: totalCredits
    });
  } catch (error) {
    console.error('Referral tracking error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});