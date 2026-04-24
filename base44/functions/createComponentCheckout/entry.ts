import { createClientFromRequest } from "npm:@base44/sdk@0.8.25";

const stripe = await import("npm:stripe@14.0.0").then((m) => m.default);

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { kit_name, invention_name, price_cents } = body;

    if (!kit_name || !price_cents) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const stripeClient = new stripe(Deno.env.get("STRIPE_SECRET_KEY"));

    // Create checkout session
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: kit_name,
              description: `Pre-assembled component kit for ${invention_name}`,
              metadata: {
                invention: invention_name,
                kit: kit_name,
              },
            },
            unit_amount: price_cents,
          },
          quantity: 1,
        },
      ],
      success_url: `${new URL(req.url).origin}/member-dashboard?order_success=true`,
      cancel_url: `${new URL(req.url).origin}/invention-plans`,
      metadata: {
        base44_app_id: Deno.env.get("BASE44_APP_ID"),
        kit_name,
        invention_name,
      },
    });

    console.log(`[Stripe Checkout] Kit: ${kit_name} for ${invention_name} ($${(price_cents / 100).toFixed(2)}) — Session: ${session.id}`);

    return Response.json({
      success: true,
      url: session.url,
      session_id: session.id,
    });
  } catch (error) {
    console.error("[createComponentCheckout Error]:", error);
    return Response.json(
      { error: "Failed to create checkout session", details: error.message },
      { status: 500 }
    );
  }
});