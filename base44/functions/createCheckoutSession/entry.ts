import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { title, priceInCents, description, category, mode, interval, successUrl, cancelUrl, priceId, productName, customerEmail } = body;

    if (!title || !priceInCents || !successUrl || !cancelUrl) {
      return Response.json({ error: 'Missing required fields: title, priceInCents, successUrl, cancelUrl' }, { status: 400 });
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

    // Attach email if provided (no auth required — public app)
    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    if (isSubscription) {
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
      sessionParams.mode = 'payment';
      sessionParams.shipping_address_collection = {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK', 'FI', 'JP', 'SG', 'NZ']
      };
      sessionParams.line_items = [{ price: priceId, quantity: 1 }];
    } else {
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