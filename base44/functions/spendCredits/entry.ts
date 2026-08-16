import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { description, credits } = body;

    if (!credits || credits < 1) {
      return Response.json({ error: 'Credits amount required (>= 1)' }, { status: 400 });
    }

    // Compute current balance
    const transactions = await base44.asServiceRole.entities.CreditTransaction.filter({ user_email: user.email });
    const balance = transactions.reduce((sum, t) => sum + (t.credits || 0), 0);

    if (balance < credits) {
      return Response.json({
        success: false,
        error: 'Insufficient credits',
        balance,
        required: credits,
        shortfall: credits - balance,
      }, { status: 402 });
    }

    // Deduct credits (asServiceRole — RLS blocks client-side credit creation)
    await base44.asServiceRole.entities.CreditTransaction.create({
      user_email: user.email,
      credits: -credits,
      type: 'spend',
      description: description || 'Export',
    });

    const newBalance = balance - credits;
    console.log(`Credits spent: ${credits} by ${user.email} on "${description}" — new balance: ${newBalance}`);
    return Response.json({ success: true, balance: newBalance, spent: credits });
  } catch (error) {
    console.error('spendCredits error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}