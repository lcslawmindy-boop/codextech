import { createClientFromRequest } from "npm:@base44/sdk@0.8.25";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { full_name, email, organization } = body;

    // Track NDA signature event
    console.log(`[NDA Signature] ${full_name} (${email}) from ${organization || "Unknown"}`);

    // Send email to admin with details
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "admin@codextech.com";
    
    await base44.integrations.Core.SendEmail({
      to: adminEmail,
      subject: `🔓 NDA Signed - New Vault Access: ${full_name}`,
      body: `
NEW VAULT ACCESS REQUEST

Name: ${full_name}
Email: ${email}
Organization: ${organization || "N/A"}
Signed At: ${new Date().toISOString()}
IP: ${req.headers.get("x-forwarded-for") || "N/A"}

---
This user has electronically signed the NDA and gained access to the C.O.D.E.X.T.E.C.H. vault.

Next Steps:
- Monitor their engagement in the platform
- They will be auto-enrolled in the free trial onboarding
- Consider follow-up outreach after 7 days

Admin Dashboard: [link to admin panel]
      `,
    });

    // Track analytics
    base44.analytics.track({
      eventName: "nda_signature_completed",
      properties: {
        email,
        organization,
      },
    }).catch(() => {});

    return Response.json({
      success: true,
      message: "NDA signature recorded and admin notified",
    });
  } catch (error) {
    console.error("[sendNDANotification Error]:", error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});