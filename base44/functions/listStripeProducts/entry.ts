import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const [products, prices] = await Promise.all([
      stripe.products.list({ limit: 100, active: true }),
      stripe.prices.list({ limit: 100, active: true }),
    ]);

    // Map prices to their product
    const pricesByProduct = {};
    for (const price of prices.data) {
      if (!pricesByProduct[price.product]) pricesByProduct[price.product] = [];
      pricesByProduct[price.product].push({
        id: price.id,
        unit_amount: price.unit_amount,
        currency: price.currency,
        recurring: price.recurring ? price.recurring.interval : null,
      });
    }

    return Response.json({
      products: products.data.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        active: p.active,
        created: p.created,
        prices: pricesByProduct[p.id] || [],
      }))
    });
  } catch (error) {
    console.error('Error listing Stripe products:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});