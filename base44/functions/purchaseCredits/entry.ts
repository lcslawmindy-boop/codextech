import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { priceId, packName, credits, successUrl, cancelUrl } = body;

    if (!priceId || !successUrl || !cancelUrl) {
      return Response.json({ error: 'Missing priceId, successUrl, or cancelUrl' }, { status: 400 });
    }

    const Stripe = (await import('npm:stripe@14.21.0')).default;
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user.email,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        credit_pack: 'true',
        credits_amount: String(credits),
        pack_name: packName || '',
        user_email: user.email,
        product_title: packName || 'Research Credit Pack',
        product_category: 'credits',
      },
    });

    console.log(`Credit pack checkout created: ${session.id} for ${user.email} — ${packName} (${credits} credits)`);
    return Response.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('purchaseCredits error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}