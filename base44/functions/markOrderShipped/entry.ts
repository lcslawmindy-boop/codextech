import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { orderId, trackingNumber, carrier } = await req.json();

    if (!orderId || !trackingNumber) {
      return Response.json({ error: 'Missing orderId or trackingNumber' }, { status: 400 });
    }

    // Update order record
    await base44.asServiceRole.entities.ShopOrder.update(orderId, {
      status: 'shipped',
      tracking_number: trackingNumber,
      carrier: carrier || '',
      shipped_at: new Date().toISOString(),
    });

    // Fetch the updated order to get customer email
    const orders = await base44.asServiceRole.entities.ShopOrder.filter({ id: orderId });
    const order = orders[0];

    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    const carrierLinks = {
      'USPS': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
      'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
      'FedEx': `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`,
      'DHL': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
    };
    const trackingUrl = carrierLinks[carrier] || `https://www.google.com/search?q=${trackingNumber}+tracking`;

    // Send tracking email to customer
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: order.customer_email,
      subject: `Your Zenith Apex order has shipped! 📦`,
      body: `Hi ${order.customer_name || order.customer_email},

Great news — your order has shipped!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Product: ${order.product_name}
Order Total: $${order.amount?.toFixed(2)}
Shipped: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRACKING INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Carrier: ${carrier || 'See tracking number'}
Tracking Number: ${trackingNumber}
Track your package: ${trackingUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you have any questions about your order, reply to this email and we'll help right away.

Thank you for supporting Zenith Apex Research!

— Zenith Apex Research Portfolio
https://zenithapex.com`,
    });

    console.log(`Order ${orderId} marked shipped. Tracking: ${trackingNumber}. Email sent to ${order.customer_email}`);
    return Response.json({ success: true });

  } catch (error) {
    console.error('markOrderShipped error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});