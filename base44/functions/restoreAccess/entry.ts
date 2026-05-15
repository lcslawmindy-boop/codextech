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

    if (user.admin_access_granted) {
      return Response.json({ success: true, status: 'active' });
    }

    let active = false;

    // 1. Check existing stripe_customer_id for active subscriptions
    if (user.stripe_customer_id) {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripe_customer_id,
        status: 'active',
        limit: 1
      });
      if (subscriptions.data.length > 0) active = true;
    }

    // 2. Check by email to catch missing mappings or pre-signup purchases
    if (!active) {
      const customers = await stripe.customers.list({ email: user.email, limit: 5 });
      
      for (const customer of customers.data) {
        if (active) break;
        const customerId = customer.id;

        // Check active subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'active',
          limit: 1
        });
        if (subscriptions.data.length > 0) {
          active = true;
          await base44.asServiceRole.entities.User.update(user.id, {
            stripe_customer_id: customerId,
            subscription_id: subscriptions.data[0].id,
            subscription_status: 'active'
          });
          break;
        }

        // Check completed checkout sessions (subscriptions OR one-time)
        const sessions = await stripe.checkout.sessions.list({
          customer: customerId,
          limit: 20
        });
        const paidSession = sessions.data.find(s =>
          s.payment_status === 'paid' || s.status === 'complete'
        );
        if (paidSession) {
          active = true;
          await base44.asServiceRole.entities.User.update(user.id, {
            stripe_customer_id: customerId,
            subscription_status: 'active'
          });
        }
      }

      // Final fallback: search sessions by email directly (no customer record yet)
      if (!active) {
        const sessions = await stripe.checkout.sessions.list({ limit: 20 });
        const paidSession = sessions.data.find(s =>
          s.customer_details?.email === user.email &&
          (s.payment_status === 'paid' || s.status === 'complete')
        );
        if (paidSession) {
          active = true;
          await base44.asServiceRole.entities.User.update(user.id, {
            subscription_status: 'active'
          });
        }
      }
    }

    // Sync status if active but missing on user object
    if (active && user.subscription_status !== 'active') {
       await base44.asServiceRole.entities.User.update(user.id, {
          subscription_status: 'active'
       });
    }

    return Response.json({ success: true, status: active ? 'active' : 'inactive' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});