import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const { sessionId, customerEmail, amount } = await req.json();

    if (!sessionId || !amount) {
      return Response.json({ error: 'Missing sessionId or amount' }, { status: 400 });
    }

    // Log conversion event — sent from frontend via GA4 gtag
    // This function validates the checkout and logs it server-side for audit
    console.log(`Enterprise signup tracked: Session=${sessionId}, Email=${customerEmail || 'anonymous'}, Amount=$${(amount / 100).toFixed(2)}`);

    return Response.json({
      success: true,
      message: 'Enterprise conversion tracked',
      sessionId,
    });
  } catch (error) {
    console.error('Conversion tracking error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});