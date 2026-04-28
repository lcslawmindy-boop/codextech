import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const referral = payload.data;

    if (!referral || referral.status !== 'completed') {
      console.log('Skipping — referral not completed:', referral?.status);
      return Response.json({ skipped: true });
    }

    const affiliateEmail = referral.referrer_email;
    const referredName = referral.referred_name || referral.referred_email || 'Someone';
    const commissionAmount = referral.store_credit_amount || 0;
    const tier = referral.membership_tier
      ? referral.membership_tier.charAt(0).toUpperCase() + referral.membership_tier.slice(1)
      : 'Membership';

    if (!affiliateEmail) {
      console.error('No affiliate email found on referral record');
      return Response.json({ error: 'No affiliate email' }, { status: 400 });
    }

    console.log(`Sending commission notification to ${affiliateEmail} — $${commissionAmount} earned`);

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: affiliateEmail,
      subject: `💰 You earned $${commissionAmount} — ${referredName} just joined ZARP!`,
      body: `
Hi there,

Great news — your referral just paid off!

<b>${referredName}</b> signed up for a <b>${tier}</b> membership using your affiliate link.

<table style="margin: 20px 0; border-collapse: collapse;">
  <tr>
    <td style="padding: 8px 16px 8px 0; color: #6b7280; font-size: 14px;">Commission Earned:</td>
    <td style="padding: 8px 0; font-size: 20px; font-weight: bold; color: #22c55e;">$${commissionAmount}</td>
  </tr>
  <tr>
    <td style="padding: 8px 16px 8px 0; color: #6b7280; font-size: 14px;">Plan Purchased:</td>
    <td style="padding: 8px 0; font-size: 14px; color: #ffffff;">${tier}</td>
  </tr>
  <tr>
    <td style="padding: 8px 16px 8px 0; color: #6b7280; font-size: 14px;">New Member:</td>
    <td style="padding: 8px 0; font-size: 14px; color: #ffffff;">${referredName}</td>
  </tr>
</table>

Keep sharing your referral link to earn more commissions. Every new member you bring in puts money directly in your pocket.

<a href="https://zarp.base44.app/referrals" style="display: inline-block; margin-top: 12px; padding: 12px 24px; background: #06b6d4; color: white; font-weight: bold; border-radius: 8px; text-decoration: none;">View Your Dashboard →</a>

—The ZARP Team
      `.trim(),
    });

    console.log(`Commission notification sent to ${affiliateEmail}`);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error sending affiliate notification:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});