import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const body = await req.json();
    const { to, subject, email_body, recipient_name, recipient_org, recipient_tag, tracked_links } = body;

    if (!to || !email_body) {
      return Response.json({ error: 'Missing to or email_body' }, { status: 400 });
    }

    const baseUrl = new URL(req.url).origin;
    const trackingToken = `acq_${recipient_tag || 'x'}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Build tracked NDA link
    const ndaUrl = "https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=ZARP-NDA&env=na4&acct=zenithapex";
    const brokerUrl = "https://aethon.base44.app/ip-broker";

    const trackedNdaUrl = `${baseUrl}/api/trackEmailEvent?t=${trackingToken}&type=click&url=${encodeURIComponent(ndaUrl)}`;
    const trackedBrokerUrl = `${baseUrl}/api/trackEmailEvent?t=${trackingToken}&type=click&url=${encodeURIComponent(brokerUrl)}`;
    const trackingPixelUrl = `${baseUrl}/api/trackEmailEvent?t=${trackingToken}&type=open`;

    // Inject tracked links into the email body
    let finalBody = email_body
      .replace(/https:\/\/aethon\.base44\.app\/ip-broker/g, trackedBrokerUrl)
      .replace(/https:\/\/na4\.docusign\.net[^\s\n]*/g, trackedNdaUrl);

    // HTML email with tracking pixel
    const htmlBody = `
<html><body style="font-family:Arial,sans-serif;color:#1a1a2e;line-height:1.7;max-width:680px;margin:0 auto;padding:20px;">
<div style="border-top:4px solid #d4af37;padding-top:16px;">
${finalBody
  .split('\n')
  .map(line => line.trim() === '' ? '<br>' : `<p style="margin:0 0 8px 0;">${line}</p>`)
  .join('\n')}
</div>
<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;">
  <strong>Aethon Apex IP</strong> · zenithapexresearch@gmail.com · 
  <a href="${trackedBrokerUrl}" style="color:#d4af37;">View IP Portfolio</a> · 
  <a href="${trackedNdaUrl}" style="color:#7c3aed;">Sign NDA for Full Package</a>
</div>
<img src="${trackingPixelUrl}" width="1" height="1" style="display:none;" alt="" />
</body></html>`;

    // NOTE: The Base44 SendEmail integration only sends to registered app users.
    // For external cold outreach (brokers, VCs), we prepare the tracked HTML email
    // and return it so the admin can copy-paste into Gmail/Outlook.
    // We still store the tracking record so opens/clicks are captured when they happen.

    // Store tracking record in EmailTracking entity
    await base44.asServiceRole.entities.EmailTracking.create({
      user_email: user.email,
      investor_id: recipient_tag || "",
      investor_name: recipient_name || to,
      tracking_token: trackingToken,
      subject: subject,
      sent_at: new Date().toISOString(),
      status: "sent",
      open_count: 0,
      total_clicks: 0,
      engagement_score: 0,
      // Store recipient_tag so refresh can match back
      description: `recipient_tag:${recipient_tag}`,
    });

    console.log(`Acquisition outreach prepared for ${to} | token: ${trackingToken}`);

    return Response.json({
      success: true,
      tracking_token: trackingToken,
      tracked_body: finalBody,
      tracked_html: htmlBody,
      tracking_pixel_url: trackingPixelUrl,
      tracked_nda_url: trackedNdaUrl,
      tracked_broker_url: trackedBrokerUrl,
      note: "Copy the tracked_body into your email client (Gmail/Outlook). Tracking pixel and tracked links are embedded."
    });
  } catch (error) {
    console.error('sendAcquisitionOutreach error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});