import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Build a personalized partner-outreach email from a PartnerOutreach record.
function buildEmail(rec, senderName) {
  const name = rec.contact_name ? ` ${rec.contact_name.split(" ")[0]}` : "";
  const asset = rec.asset_focus || "the Aethon Apex IP portfolio";
  const ask = rec.ask || "";
  const offer = rec.offer || "";
  const sig = `\n\nBest regards,\n${senderName}\nAethon Apex IP Holdings`;

  const TEMPLATES = {
    patent_probono: {
      subject: `Pro-bono provisional patent filing — ${asset}`,
      body: `Hello${name},\n\nI am reaching out from Aethon Apex IP Holdings. We hold a research-stage IP portfolio and are seeking pro-bono counsel to file provisional patent applications for our non-ITAR lead assets, starting with ${asset}.\n\nWe are income-qualified under the USPTO Patent Pro Bono Program and have complete claim drafts and a Preliminary Design Review package ready for your review.\n\nWhat we ask: assistance filing a provisional patent application for ${asset}.\n${offer ? `What we offer in return: ${offer}.\n` : ""}\nWould you be open to a short call this week to review the case?\n${sig}`,
    },
    university: {
      subject: `STTR / sponsored-research partnership — ${asset}`,
      body: `Hello${name},\n\nI am reaching out from Aethon Apex IP Holdings. We are seeking a university research partner for ${asset}. We have a complete Preliminary Design Review, drafted claims, and a grant proposal ready for STTR submission.\n\nWhat we ask: ${ask || "a sponsored-research or STTR collaboration to validate the technology and advance it toward commercialization."}\n${offer ? `What we offer: ${offer}.\n` : ""}\nOur grant drafts (NSF, USDA NIFA) are submission-ready and could fund the collaboration non-dilutively.\n\nWould your lab be open to reviewing the technical brief?\n${sig}`,
    },
    oem: {
      subject: `Co-development & licensing — ${asset}`,
      body: `Hello${name},\n\nI am reaching out from Aethon Apex IP Holdings. We hold the IP for ${asset} and are seeking a strategic OEM partner to fund the prototype build and field validation in exchange for an exclusive license in your vertical.\n\nWhat we ask: ${ask || "co-development funding for the prototype and field testing."}\n${offer ? `What we offer: ${offer}.\n` : "We retain the IP; you receive an exclusive commercial license in your vertical."}\n\nThe technology is non-ITAR and has an identified federal grant pathway to de-risk the build.\n\nWould you be open to an NDA and a technical review?\n${sig}`,
    },
    foundation: {
      subject: `Humanitarian deployment partnership — ${asset}`,
      body: `Hello${name},\n\nI am reaching out from Aethon Apex IP Holdings. We are seeking a humanitarian deployment partner for ${asset}, with potential for an open license in low-resource markets while we retain commercial rights elsewhere.\n\nWhat we ask: ${ask || "field deployment funding and local implementation partners."}\n${offer ? `What we offer: ${offer}.\n` : ""}\nThe technology has a clear public-health and environmental benefit case.\n\nWould your team be open to a call?\n${sig}`,
    },
    ip_broker: {
      subject: `IP licensing & acquisition representation — ${asset}`,
      body: `Hello${name},\n\nI am reaching out from Aethon Apex IP Holdings. We hold a research-stage IP portfolio and are seeking a broker on a success-fee basis to source licensing and acquisition deals for ${asset}.\n\nProvisional filings are in progress. We have a complete investor package (pitch deck, viability report, legal review) ready for buyer diligence.\n\nWhat we ask: ${ask || "outbound deal-sourcing on a success-fee basis."}\n${offer ? `What we offer: ${offer}.\n` : "We offer a standard 10-25% success fee on any closed deal."}\n\nWould you be open to reviewing the portfolio summary?\n${sig}`,
    },
    grant_agency: {
      subject: `Grant program inquiry — ${asset}`,
      body: `Hello${name},\n\nI am reaching out from Aethon Apex IP Holdings regarding a submission-ready grant proposal for ${asset}.\n\nWe have a complete Phase I proposal drafted for your program and would like to confirm the open solicitation topic and deadline before submission.\n\n${ask ? `Question: ${ask}\n` : ""}Could you confirm the current submission window and any eligibility details we should verify?\n${sig}`,
    },
    other: {
      subject: `Partnership inquiry — ${asset}`,
      body: `Hello${name},\n\nI am reaching out from Aethon Apex IP Holdings regarding ${asset}.\n\n${ask ? `What we ask: ${ask}\n` : ""}${offer ? `What we offer: ${offer}\n` : ""}\nWould you be open to a brief call to explore whether there is a fit?\n${sig}`,
    },
  };

  return TEMPLATES[rec.partner_type] || TEMPLATES.other;
}

// Build a base64url-encoded RFC 2822 message (UTF-8 safe).
function buildRaw(to, from, subject, textBody) {
  const mime = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 8bit`,
    ``,
    textBody,
  ].join("\r\n");
  // UTF-8 safe base64 -> base64url
  return btoa(unescape(encodeURIComponent(mime)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== "admin") {
      return Response.json({ error: "Admin only" }, { status: 403 });
    }

    const body = await req.json();
    const { outreach_id } = body;
    if (!outreach_id) return Response.json({ error: "Missing outreach_id" }, { status: 400 });

    const rec = await base44.asServiceRole.entities.PartnerOutreach.get(outreach_id);
    if (!rec) return Response.json({ error: "Outreach record not found" }, { status: 404 });
    if (!rec.contact_email) return Response.json({ error: "No contact email on record" }, { status: 400 });

    const { subject, body: emailBody } = buildEmail(rec, user.full_name || user.email || "Aethon Apex");
    const from = `${user.full_name || "Aethon Apex"} <${user.email}>`;
    const raw = buildRaw(rec.contact_email, from, subject, emailBody);

    const { accessToken } = await base44.asServiceRole.connectors.getConnection("gmail");

    const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Gmail send failed:", JSON.stringify(err));
      return Response.json({ error: err.error?.message || `Gmail send failed (${res.status})` }, { status: 502 });
    }

    const sent = await res.json();

    // Update outreach status to "sent"
    await base44.asServiceRole.entities.PartnerOutreach.update(outreach_id, { status: "sent" });

    // Log audit
    await base44.asServiceRole.entities.AuditEvent.create({
      entity_type: "other",
      entity_id: outreach_id,
      event_type: "other",
      event_description: `Partner outreach email sent to ${rec.contact_email} (${rec.partner_name}) for ${rec.asset_focus || "portfolio"}`,
      actor_email: user.email,
      metadata: { gmail_message_id: sent.id, channel: "gmail" },
    }).catch(() => {});

    console.log(`Partner outreach sent to ${rec.contact_email} for ${rec.asset_focus} (msg ${sent.id})`);

    return Response.json({ success: true, sent_to: rec.contact_email, gmail_id: sent.id });
  } catch (error) {
    console.error("sendPartnerOutreach error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});