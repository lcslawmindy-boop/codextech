import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const APP_URL = "https://zenithapex.com";

const DAY2_EMAIL = {
  subject: "🔧 MEG Replication Breakdown — The $85 Parts List",
  body: (name) => `Hi ${name},

Yesterday you downloaded the free Scalar EM Primer. Today: the complete MEG replication breakdown.

The Motionless Electromagnetic Generator (US Patent 6,362,718) is the most rigorously documented overunity device in history. Here's what makes it buildable for under $100.

━━━━━━━━━━━━━━━━━━━━━━━━
THE MEG CORE COMPONENTS
━━━━━━━━━━━━━━━━━━━━━━━━

→ Bifilar toroidal coil — Vitroperm 500F core, µr ~100,000
→ N52 Permanent magnets — 50×10×5mm, 4× array (~$18, K&J Magnetics)
→ MOSFET switching — IRFP460, 500V/20A (Digikey #IRFP460PBF-ND, $4.20)
→ DDS signal generator — AD9833 module, 0–12.5MHz ($8–12)
→ Arduino Nano — SPI control + PWM gate drive ($6)

Total core BOM: $83–$127 depending on suppliers.

The full 23-step assembly guide with exact part numbers, specs, and build video is inside the vault.

━━━━━━━━━━━━━━━━━━━━━━━━
THE RESEARCH VAULT
━━━━━━━━━━━━━━━━━━━━━━━━

✓ 40+ complete build plans (MEG, TRD-1, Prioré, Scalar Interferometer, and more)
✓ Full BOMs with exact part numbers and verified supplier links
✓ Step-by-step build videos — 3–12 hours per device
✓ 26 structured courses from EM fundamentals to patent strategy
✓ Prior Art Archive — 200+ historically documented systems
✓ AI patent tools — draft a USPTO provisional in one session

Access: ${APP_URL}/pricing

Tomorrow: the device the French government buried — and a founding member offer.

— Zenith Apex Research Team

P.S. Browse 1 complete free build plan now — no payment required:
${APP_URL}/free-vault`,
};

const DAY3_EMAIL = {
  subject: "🔐 The Device the French Government Buried — Your Founding Member Offer",
  body: (name) => `Hi ${name},

This is the last email in your 3-day briefing series.

In 1974, André Lwoff — 1965 Nobel Prize winner — reviewed the Prioré EM device data. Terminal cancers reversed. The ONR verified it. Then the funding was cut in 1984. The device was dismantled. The files were buried.

We have the complete archive — the original ONR report, the French patents, and the full modern replication build plan.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR FOUNDING MEMBER OFFER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full vault access is $99/month. But as a primer subscriber, you're getting first access at the founding rate — available for 48 hours only.

→ CLAIM YOUR ACCESS: ${APP_URL}/pricing

What you get:
✓ 40+ build plans — complete engineering documentation
✓ Full BOM with exact part numbers and verified supplier links
✓ Build videos — 3–12 hours per device
✓ 26 courses from scalar EM fundamentals to patent strategy
✓ AI patent suite — draft a USPTO provisional in one session
✓ Prior Art Archive — 200+ documented suppressed systems
✓ Private research community

Cancel anytime. Instant access. Stripe secured.

→ ${APP_URL}/pricing

— Zenith Apex Research Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You received this because you downloaded the free Scalar EM Primer.
Reply "unsubscribe" to opt out.`,
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { day } = body; // day: 2 or 3

    if (!day || (day !== 2 && day !== 3)) {
      return Response.json({ error: "Invalid day. Must be 2 or 3." }, { status: 400 });
    }

    const emailTemplate = day === 2 ? DAY2_EMAIL : DAY3_EMAIL;

    // Get subscribers who signed up ~24h ago (day 2) or ~48h ago (day 3)
    const hoursAgo = day === 2 ? 24 : 48;
    const windowStart = new Date(Date.now() - (hoursAgo + 1) * 3600 * 1000).toISOString();
    const windowEnd = new Date(Date.now() - (hoursAgo - 1) * 3600 * 1000).toISOString();

    const subscribers = await base44.asServiceRole.entities.NewsletterSubscriber.filter({
      source: "scalar_primer_lead_magnet",
      status: "active",
    });

    // Filter to those created in the target window
    const targets = subscribers.filter(s => {
      const created = new Date(s.created_date).getTime();
      const start = new Date(windowStart).getTime();
      const end = new Date(windowEnd).getTime();
      return created >= start && created <= end;
    });

    console.log(`Day ${day} drip: found ${targets.length} subscribers in window`);

    let sent = 0;
    for (const sub of targets) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: sub.email,
          from_name: "Zenith Apex Research",
          subject: emailTemplate.subject,
          body: emailTemplate.body(sub.name || "Researcher"),
        });
        sent++;
        console.log(`Day ${day} email sent to ${sub.email}`);
      } catch (err) {
        console.error(`Failed to send to ${sub.email}:`, err.message);
      }
    }

    return Response.json({
      success: true,
      day,
      sent,
      total_in_window: targets.length,
    });
  } catch (error) {
    console.error("scalarPrimerDripFollowUp error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});