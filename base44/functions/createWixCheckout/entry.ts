import { createClient } from 'npm:@wix/sdk';
import { checkout } from 'npm:@wix/ecom';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { productName, priceInCents, quantity = 1, description } = body;

    if (!productName || priceInCents === undefined) {
      return Response.json({ error: 'Missing productName or priceInCents' }, { status: 400 });
    }

    // Get Wix access token
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('wix');

    // Create Wix client
    const wixClient = createClient({
      modules: { checkout },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Convert cents to dollars as string
    const priceAmount = String(priceInCents / 100);

    // Create checkout with custom line item
    const checkoutData = {
      channelType: 'WEB',
      checkoutInfo: {
        buyerInfo: {
          email: '',
        },
      },
      customLineItems: [
        {
          quantity,
          price: priceAmount,
          productName,
          itemType: 'DIGITAL',
        },
      ],
    };

    if (description) {
      checkoutData.customLineItems[0].descriptionLines = [{ name: description }];
    }

    console.log('Creating checkout with:', JSON.stringify(checkoutData));

    const checkoutResponse = await wixClient.checkout.createCheckout(checkoutData, { channelType: 'WEB' });

    console.log('Checkout response:', JSON.stringify(checkoutResponse));

    if (!checkoutResponse.checkout?.id) {
      return Response.json({ error: 'Failed to create checkout' }, { status: 500 });
    }

    // Get the checkout URL
    const urlResponse = await wixClient.checkout.getCheckoutUrl(checkoutResponse.checkout.id);

    return Response.json({
      checkoutId: checkoutResponse.checkout.id,
      url: urlResponse.checkoutUrl,
    });
  } catch (error) {
    console.error('Wix checkout error:', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});