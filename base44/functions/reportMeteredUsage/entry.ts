import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

// Reports metered usage to Stripe for enterprise/institutional subscribers.
// action: "report" — records usage units against a subscription item
// action: "get_usage" — returns current period usage summary
// action: "get_subscription" — returns the user's active metered subscription details

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action, quantity = 1, event_type = 'invention_dossier' } = body;

    // Look up user's stripe_customer_id from User entity
    const users = await base44.asServiceRole.entities.User.filter({ email: user.email });
    const dbUser = users[0];
    const customerId = dbUser?.stripe_customer_id;

    if (!customerId) {
      return Response.json({ error: 'No Stripe customer found. Please subscribe first.' }, { status: 404 });
    }

    // ── Find active metered subscription ──────────────────────────────────────
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 10,
    });

    // Find the metered subscription item (usage_type = metered)
    let meteredSubItem = null;
    for (const sub of subscriptions.data) {
      for (const item of sub.items.data) {
        const price = await stripe.prices.retrieve(item.price.id);
        if (price.recurring?.usage_type === 'metered') {
          meteredSubItem = item;
          break;
        }
      }
      if (meteredSubItem) break;
    }

    if (!meteredSubItem) {
      return Response.json({
        error: 'No active metered subscription found. Please upgrade to an Enterprise Metered plan.',
        has_metered_plan: false,
      }, { status: 403 });
    }

    // ── REPORT usage ──────────────────────────────────────────────────────────
    if (action === 'report') {
      const usageRecord = await stripe.subscriptionItems.createUsageRecord(
        meteredSubItem.id,
        {
          quantity,
          timestamp: Math.floor(Date.now() / 1000),
          action: 'increment',
        }
      );
      console.log(`Metered usage reported: ${quantity} ${event_type} for ${user.email} — record ${usageRecord.id}`);
      return Response.json({
        success: true,
        usage_record_id: usageRecord.id,
        quantity,
        event_type,
      });
    }

    // ── GET current period usage summary ──────────────────────────────────────
    if (action === 'get_usage') {
      const summary = await stripe.subscriptionItems.listUsageRecordSummaries(
        meteredSubItem.id,
        { limit: 1 }
      );
      const latest = summary.data[0] || null;
      return Response.json({
        total_usage: latest?.total_usage || 0,
        period_start: latest?.period?.start ? new Date(latest.period.start * 1000).toISOString() : null,
        period_end: latest?.period?.end ? new Date(latest.period.end * 1000).toISOString() : null,
        subscription_item_id: meteredSubItem.id,
      });
    }

    // ── GET subscription info ─────────────────────────────────────────────────
    if (action === 'get_subscription') {
      const price = await stripe.prices.retrieve(meteredSubItem.price.id);
      return Response.json({
        has_metered_plan: true,
        subscription_item_id: meteredSubItem.id,
        unit_amount: price.unit_amount,
        currency: price.currency,
        unit_label: price.transform_quantity || 'per dossier',
      });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    console.error('reportMeteredUsage error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});