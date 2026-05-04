import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Scheduled membership drip runner.
 * Called with { trigger: "day1" | "day3" | "day7" | "day14" }
 * Finds all active members whose subscription_activated_at matches the target window,
 * then invokes membershipWelcomeEmail for each.
 *
 * Window logic:
 *   day1  = activated 20-28 hours ago
 *   day3  = activated 68-76 hours ago
 *   day7  = activated 164-172 hours ago
 *   day14 = activated 332-340 hours ago
 */

const WINDOWS = {
  day1:  { minHours: 20,  maxHours: 28  },
  day3:  { minHours: 68,  maxHours: 76  },
  day7:  { minHours: 164, maxHours: 172 },
  day14: { minHours: 332, maxHours: 340 },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { trigger } = await req.json();

    if (!WINDOWS[trigger]) {
      return Response.json({ error: `Invalid trigger: ${trigger}` }, { status: 400 });
    }

    const { minHours, maxHours } = WINDOWS[trigger];
    const now = Date.now();
    const minMs = minHours * 3600 * 1000;
    const maxMs = maxHours * 3600 * 1000;

    // Fetch all active members
    const users = await base44.asServiceRole.entities.User.filter({
      subscription_status: "active"
    });

    let sent = 0;
    let skipped = 0;

    for (const user of users) {
      if (!user.subscription_activated_at || !user.email) { skipped++; continue; }

      const activatedAt = new Date(user.subscription_activated_at).getTime();
      const hoursAgo = now - activatedAt;

      if (hoursAgo >= minMs && hoursAgo <= maxMs) {
        try {
          await base44.asServiceRole.functions.invoke("membershipWelcomeEmail", {
            email: user.email,
            name: user.full_name || "",
            trigger,
          });
          console.log(`[membershipDrip] ${trigger} sent to ${user.email}`);
          sent++;
        } catch (e) {
          console.error(`[membershipDrip] Failed to send to ${user.email}:`, e.message);
        }
      } else {
        skipped++;
      }
    }

    console.log(`[membershipDrip] ${trigger} complete — sent: ${sent}, skipped: ${skipped}`);
    return Response.json({ success: true, trigger, sent, skipped });

  } catch (error) {
    console.error("[membershipDrip] Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});