import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return new Response("Webhook Error", { status: 400 });
  }

  const base44 = createClientFromRequest(req);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_email || session.metadata?.user_email;
    if (email) {
      try {
        const users = await base44.asServiceRole.entities.User.filter({ email });
        if (users.length > 0) {
          await base44.asServiceRole.entities.User.update(users[0].id, {
            subscription_status: "active",
            stripe_customer_id: session.customer,
            subscription_id: session.subscription,
          });
          console.log("Subscription activated for:", email);
        }
      } catch (e) {
        console.error("Error updating user subscription:", e.message);
      }
    }
  }

  if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
    const sub = event.data.object;
    if (sub.status !== "active") {
      try {
        const users = await base44.asServiceRole.entities.User.filter({ stripe_customer_id: sub.customer });
        if (users.length > 0) {
          await base44.asServiceRole.entities.User.update(users[0].id, { subscription_status: sub.status });
          console.log("Subscription status updated:", sub.status, "for customer:", sub.customer);
        }
      } catch (e) {
        console.error("Error updating subscription status:", e.message);
      }
    }
  }

  return Response.json({ received: true });
});