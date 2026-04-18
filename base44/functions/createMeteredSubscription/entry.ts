import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

// Creates a Stripe Checkout session for the Enterprise Metered plan.
// Metered price is $29 per invention dossier generated (or AI credit consumed).
// The price is created dynamically with usage_type=metered if it doesn't exist.

const METERED_PRODUCT_NAME = "ZARP Enterprise Metered — AI Usage";
const UNIT_AMOUNT = 2900; // $29.00 per dossier/credit unit
const CURRENCY = "usd";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { successUrl, cancelUrl } = body;

    if (!successUrl || !cancelUrl) {
      return Response.json({ error: 'successUrl and cancelUrl required' }, { status: 400 });
    }

    // ── Find or create the metered product ────────────────────────────────────
    let product;
    const existingProducts = await stripe.products.search({
      query: `name:"${METERED_PRODUCT_NAME}" AND active:"true"`,
    });
    if (existingProducts.data.length > 0) {
      product = existingProducts.data[0];
    } else {
      product = await stripe.products.create({
        name: METERED_PRODUCT_NAME,
        description: 'Pay-per-use AI credits: invention dossiers, patent drafts, and market research reports. Billed monthly based on actual usage.',
        unit_label: 'dossier',
        metadata: { base44_app_id: Deno.env.get('BASE44_APP_ID') },
      });
      console.log('Created metered product:', product.id);
    }

    // ── Find or create the metered price ─────────────────────────────────────
    let price;
    const existingPrices = await stripe.prices.list({
      product: product.id,
      active: true,
      limit: 10,
    });
    const meteredPrice = existingPrices.data.find(p => p.recurring?.usage_type === 'metered');
    if (meteredPrice) {
      price = meteredPrice;
    } else {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: UNIT_AMOUNT,
        currency: CURRENCY,
        recurring: {
          interval: 'month',
          usage_type: 'metered',
          aggregate_usage: 'sum',
        },
        metadata: { base44_app_id: Deno.env.get('BASE44_APP_ID') },
      });
      console.log('Created metered price:', price.id);
    }

    // ── Create Checkout session for metered subscription ──────────────────────
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: user.email,
      line_items: [{ price: price.id }],
      subscription_data: {
        metadata: {
          base44_app_id: Deno.env.get('BASE44_APP_ID'),
          user_email: user.email,
          plan_name: 'enterprise_metered',
          plan_type: 'metered',
        },
      },
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        user_email: user.email,
        product_title: METERED_PRODUCT_NAME,
        plan_name: 'enterprise_metered',
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    console.log(`Metered subscription checkout created for ${user.email}: ${session.id}`);
    return Response.json({ url: session.url, sessionId: session.id, price_id: price.id });

  } catch (error) {
    console.error('createMeteredSubscription error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});