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

    const { product_id, description, name } = await req.json();

    if (!product_id) {
      return Response.json({ error: 'product_id required' }, { status: 400 });
    }

    const updated = await stripe.products.update(product_id, {
      ...(description !== undefined && { description }),
      ...(name !== undefined && { name }),
    });

    console.log(`Updated Stripe product ${product_id}: ${updated.name}`);
    return Response.json({ success: true, product: { id: updated.id, name: updated.name, description: updated.description } });
  } catch (error) {
    console.error('Error updating Stripe product:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});