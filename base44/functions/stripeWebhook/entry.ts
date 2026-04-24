import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
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
    // customer_details.email is the most reliable — set by Stripe at checkout
    const email = session.customer_details?.email || session.customer_email || session.metadata?.user_email;

    console.log("checkout.session.completed:", session.id, "email:", email, "payment_status:", session.payment_status, "subscription:", session.subscription);

    if (!email) {
      console.error("No email found on session:", session.id);
    }

    // Save shop order for physical products (one-time payments with shipping)
    const productName = session.metadata?.product_name || session.metadata?.product_title;
    const isShopOrder = productName && !session.subscription;
    if (isShopOrder) {
      try {
        const shipping = session.shipping_details;
        await base44.asServiceRole.entities.ShopOrder.create({
          customer_email: email || '',
          customer_name: session.customer_details?.name || '',
          product_name: productName,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent || '',
          status: 'pending',
          shipping_name: shipping?.name || '',
          shipping_address_line1: shipping?.address?.line1 || '',
          shipping_address_line2: shipping?.address?.line2 || '',
          shipping_city: shipping?.address?.city || '',
          shipping_state: shipping?.address?.state || '',
          shipping_postal_code: shipping?.address?.postal_code || '',
          shipping_country: shipping?.address?.country || '',
        });
        console.log('ShopOrder created for:', productName, email);
      } catch (e) {
        console.error('Error saving ShopOrder:', e.message);
      }
    }

    // Set subscription_status = active on User — Stripe is the ONLY source of truth
    if (email) {
      try {
        const users = await base44.asServiceRole.entities.User.filter({ email });
        if (users.length > 0) {
          await base44.asServiceRole.entities.User.update(users[0].id, {
            subscription_status: "active",
            stripe_customer_id: session.customer,
            subscription_id: session.subscription || null,
          });
          console.log("subscription_status set to active for:", email);
        } else {
          console.warn("No User found for email:", email, "— user may not have registered yet. restoreAccess will sync on login.");
        }
      } catch (e) {
        console.error("Error setting subscription_status:", e.message);
      }
    }
  }

  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object;
    console.log("subscription.updated:", sub.id, "status:", sub.status, "customer:", sub.customer);
    try {
      const users = await base44.asServiceRole.entities.User.filter({ stripe_customer_id: sub.customer });
      if (users.length > 0) {
        await base44.asServiceRole.entities.User.update(users[0].id, { subscription_status: sub.status });
        console.log("subscription_status updated to:", sub.status, "for customer:", sub.customer);
      } else {
        console.warn("No User found for stripe_customer_id:", sub.customer);
      }
    } catch (e) {
      console.error("Error updating subscription status:", e.message);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    console.log("subscription.deleted:", sub.id, "customer:", sub.customer);
    try {
      const users = await base44.asServiceRole.entities.User.filter({ stripe_customer_id: sub.customer });
      if (users.length > 0) {
        await base44.asServiceRole.entities.User.update(users[0].id, { subscription_status: "canceled" });
        console.log("subscription_status set to canceled for customer:", sub.customer);
      } else {
        console.warn("No User found for stripe_customer_id:", sub.customer);
      }
    } catch (e) {
      console.error("Error canceling subscription:", e.message);
    }
  }

  return Response.json({ received: true });
});