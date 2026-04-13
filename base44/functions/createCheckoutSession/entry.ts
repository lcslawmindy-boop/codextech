import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, priceInCents, description, category, mode, interval, successUrl, cancelUrl, priceId, productName } = await req.json();

    if (!title || !priceInCents || !successUrl || !cancelUrl) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isSubscription = mode === "subscription";

    let sessionParams = {
      payment_method_types: ['card'],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user.email,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        user_email: user.email,
        product_title: title || productName || '',
        product_name: productName || title || '',
        product_category: category || '',
      },
    };

    if (isSubscription) {
      // Subscription mode: create price inline
      sessionParams.mode = 'subscription';
      sessionParams.line_items = [{
        price_data: {
          currency: 'usd',
          product_data: { name: title, description: description || '' },
          unit_amount: priceInCents,
          recurring: { interval: interval || 'month' },
        },
        quantity: 1,
      }];
    } else if (priceId) {
      // Use existing Stripe price ID (shop products)
      sessionParams.mode = 'payment';
      sessionParams.shipping_address_collection = { allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK', 'FI', 'JP', 'SG', 'NZ'] };
      sessionParams.line_items = [{ price: priceId, quantity: 1 }];
    } else {
      // One-time payment with inline price
      sessionParams.mode = 'payment';
      sessionParams.line_items = [{
        price_data: {
          currency: 'usd',
          product_data: { name: title, description: description || '' },
          unit_amount: priceInCents,
        },
        quantity: 1,
      }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return Response.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Checkout error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});