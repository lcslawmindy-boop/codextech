import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Send deletion request email to admin
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: Deno.env.get("ADMIN_EMAIL") || "support@zenithapex.com",
      subject: `[ACTION REQUIRED] Account Deletion Request — ${user.email}`,
      body: `A user has requested permanent account deletion from the mobile app.

User Details:
- Name: ${user.full_name}
- Email: ${user.email}
- User ID: ${user.id}
- Role: ${user.role}
- Request Time: ${new Date().toISOString()}

Action Required:
Please delete all associated data for this user within 30 days per App Store guidelines.
Data to remove includes: profile, course progress, research data, CRM entries, favorites, and billing records.

This request was submitted by the user directly from the app.`,
    });

    // Also send confirmation to the user
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: user.email,
      subject: "Account Deletion Request Received — Aethon Apex IP",
      body: `Hi ${user.full_name},

We have received your request to permanently delete your Aethon Apex IP account.

Your request will be processed within 30 days. During this time:
- Your account remains accessible
- All your data will be permanently removed upon completion
- You will receive a final confirmation email when deletion is complete

If you did not request this deletion or wish to cancel, please contact us immediately at support@zenithapex.com.

— The Aethon Apex IP Team`,
    });

    console.log(`Account deletion request submitted for: ${user.email}`);
    return Response.json({ success: true, message: 'Deletion request submitted' });

  } catch (error) {
    console.error('deleteAccount error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});