import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { deal_id, inventor_email, investor_email, transaction_amount, stripe_payment_intent_id } = body;

    if (!deal_id || !inventor_email || !investor_email || !transaction_amount) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate ZAT commission (5%)
    const zat_commission = Math.round(transaction_amount * 0.05 * 100) / 100;
    const inventor_receives = transaction_amount - zat_commission;

    // Create escrow transaction record
    const escrow = await base44.asServiceRole.entities.EscrowTransaction.create({
      deal_id,
      inventor_email,
      investor_email,
      transaction_amount,
      zat_commission_5pct: zat_commission,
      inventor_receives,
      stripe_payment_intent_id,
      status: 'funds_received',
    });

    // Log transaction for compliance
    console.log(`[ESCROW] Transaction created: ${deal_id} | Amount: $${transaction_amount} | ZAT Fee: $${zat_commission}`);

    return Response.json({
      success: true,
      escrow_id: escrow.id,
      transaction_amount,
      zat_commission_5pct: zat_commission,
      inventor_receives,
      status: 'funds_received',
    });
  } catch (error) {
    console.error('[ESCROW ERROR]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});