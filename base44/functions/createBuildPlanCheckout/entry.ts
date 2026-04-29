import { createClientFromRequest } from "npm:@base44/sdk@0.8.25";
const stripe = await import("npm:stripe@14.0.0").then((m) => m.default);

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });

    const { planId, planTitle, priceInCents, includeVideo, description } = await req.json();

    if (!planTitle || !priceInCents) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const stripeClient = new stripe(Deno.env.get("STRIPE_SECRET_KEY"));

    const productName = includeVideo ? `${planTitle} — Build Plan + Video & PDF` : `${planTitle} — Build Plan`;
    const productDesc = includeVideo
      ? `${description} Includes step-by-step video assembly guide + high-res PDF manual.`
      : description;

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: productName,
            description: productDesc,
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      }],
      success_url: `${new URL(req.url).origin}/build-plans?order_success=true&plan=${encodeURIComponent(planTitle)}`,
      cancel_url: `${new URL(req.url).origin}/build-plans`,
      metadata: {
        base44_app_id: Deno.env.get("BASE44_APP_ID"),
        plan_id: planId,
        plan_title: planTitle,
        include_video: String(includeVideo),
      },
    });

    console.log(`[BuildPlan Checkout] ${productName} — $${(priceInCents / 100).toFixed(2)} — Session: ${session.id}`);
    return Response.json({ success: true, url: session.url, session_id: session.id });
  } catch (error) {
    console.error("[createBuildPlanCheckout Error]:", error);
    return Response.json({ error: "Failed to create checkout", details: error.message }, { status: 500 });
  }
});