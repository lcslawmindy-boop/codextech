import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { returnUrl } = await req.json();

    // Find stripe customer by stored ID or email
    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        // Persist for next time
        await base44.asServiceRole.entities.User.update(user.id, { stripe_customer_id: customerId });
      }
    }

    if (!customerId) {
      return Response.json({ error: 'No Stripe customer found for this account.' }, { status: 404 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || 'https://zenithapex.com/account',
    });

    console.log(`Customer portal session created for ${user.email}: ${session.id}`);
    return Response.json({ url: session.url });

  } catch (error) {
    console.error('Customer portal error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});