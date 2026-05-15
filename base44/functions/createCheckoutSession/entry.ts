import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { title, priceInCents, description, category, mode, interval, successUrl, cancelUrl, priceId, productName, customerEmail } = body;

    if (!successUrl || !cancelUrl) {
      return Response.json({ error: 'Missing required fields: successUrl, cancelUrl' }, { status: 400 });
    }
    if (!priceId && (!title || !priceInCents)) {
      return Response.json({ error: 'Missing required fields: either priceId, or title + priceInCents' }, { status: 400 });
    }

    const isSubscription = mode === "subscription";

    let sessionParams = {
      payment_method_types: ['card'],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        product_title: title || productName || '',
        product_category: category || '',
      },
    };

    // Attach email if provided
    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    if (isSubscription && priceId) {
      // Subscription checkout using a real Stripe price ID
      sessionParams.mode = 'subscription';
      sessionParams.line_items = [{ price: priceId, quantity: 1 }];
    } else if (isSubscription && priceInCents) {
      // Subscription checkout using dynamic price data
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
      // One-time payment using a real Stripe price ID
      sessionParams.mode = 'payment';
      // Only collect shipping for physical goods categories
      if (category === 'kit' || category === 'physical') {
        sessionParams.shipping_address_collection = {
          allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK', 'FI', 'JP', 'SG', 'NZ']
        };
      }
      sessionParams.line_items = [{ price: priceId, quantity: 1 }];
    } else {
      // One-time payment using dynamic price data
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
    console.log(`Checkout session created: ${session.id} for ${title}`);
    return Response.json({ url: session.url, sessionId: session.id });

  } catch (error) {
    console.error('Checkout error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});