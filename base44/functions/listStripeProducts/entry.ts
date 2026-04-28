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

    const products = await stripe.products.list({ limit: 100, active: true });

    return Response.json({
      products: products.data.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        active: p.active,
        created: p.created,
      }))
    });
  } catch (error) {
    console.error('Error listing Stripe products:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});