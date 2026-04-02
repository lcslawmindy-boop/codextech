import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Search for completed checkout sessions by customer email
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
    });

    const userSessions = sessions.data.filter(s =>
      s.payment_status === 'paid' &&
      (s.customer_email === user.email || s.customer_details?.email === user.email)
    );

    const purchases = userSessions.map(s => ({
      session_id: s.id,
      product_title: s.metadata?.product_title || s.line_items?.[0]?.description || 'Unknown Product',
      category: s.metadata?.category || 'Course',
      amount: s.amount_total,
      currency: s.currency,
      purchased_at: new Date(s.created * 1000).toISOString(),
    }));

    // Also fetch line item details for titles
    const detailedPurchases = await Promise.all(
      userSessions.map(async (s) => {
        let title = s.metadata?.product_title;
        if (!title) {
          try {
            const lineItems = await stripe.checkout.sessions.listLineItems(s.id, { limit: 5 });
            title = lineItems.data[0]?.description || 'Unknown Product';
          } catch {
            title = 'Unknown Product';
          }
        }
        return {
          session_id: s.id,
          product_title: title,
          category: s.metadata?.category || 'Course',
          amount: s.amount_total,
          currency: s.currency,
          purchased_at: new Date(s.created * 1000).toISOString(),
        };
      })
    );

    return Response.json({ purchases: detailedPurchases });
  } catch (error) {
    console.error('getUserPurchases error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});