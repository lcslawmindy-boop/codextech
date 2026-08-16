import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Sum all credit transactions for this user's email
    const transactions = await base44.asServiceRole.entities.CreditTransaction.filter({ user_email: user.email });
    const balance = transactions.reduce((sum, t) => sum + (t.credits || 0), 0);

    return Response.json({ balance, email: user.email, transactionCount: transactions.length });
  } catch (error) {
    console.error('getCreditBalance error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}