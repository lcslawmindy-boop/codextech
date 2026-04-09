import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { buyer_name, buyer_email, buyer_org, investor_relationship_id, duration_hours = 72 } = await req.json();
    if (!buyer_name || !buyer_email) {
      return Response.json({ error: 'buyer_name and buyer_email are required' }, { status: 400 });
    }

    // Generate cryptographically secure token
    const rawBytes = new Uint8Array(32);
    crypto.getRandomValues(rawBytes);
    const token = Array.from(rawBytes).map(b => b.toString(16).padStart(2, '0')).join('');

    // Create SHA-256 hash of token for verification
    const encoder = new TextEncoder();
    const tokenData = encoder.encode(token + Deno.env.get('BASE44_APP_ID'));
    const hashBuffer = await crypto.subtle.digest('SHA-256', tokenData);
    const token_hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    const expires_at = new Date(Date.now() + duration_hours * 60 * 60 * 1000).toISOString();
    const nda_signed_at = new Date().toISOString();

    const session = await base44.asServiceRole.entities.VDRSession.create({
      buyer_name,
      buyer_email,
      buyer_org: buyer_org || '',
      investor_relationship_id: investor_relationship_id || '',
      token,
      token_hash,
      status: 'active',
      expires_at,
      nda_signed_at,
      page_views: [],
      total_time_seconds: 0,
      access_count: 0,
    });

    // Send access email to buyer
    const appUrl = req.headers.get('origin') || 'https://app.base44.com';
    const vdrLink = `${appUrl}/vdr/${token}`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: buyer_email,
      subject: 'Zenith Apex — Secure Data Room Access (72-Hour Window)',
      body: `Dear ${buyer_name},

Your NDA has been executed and your secure access window is now open.

DATA ROOM ACCESS LINK:
${vdrLink}

IMPORTANT — PLEASE READ:
• This link expires in ${duration_hours} hours (at ${new Date(expires_at).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', dateStyle: 'full', timeStyle: 'short' })} PT)
• Access is read-only — downloading, copying, or screenshotting is a violation of your NDA
• Your access is uniquely cryptographically signed and tied to this email address
• All page views, time-on-page, and access events are logged and timestamped
• Link is single-user and non-transferable — sharing it constitutes an NDA breach ($2.5M liquidated damages)

DOCUMENTS AVAILABLE IN THIS SESSION:
• Executive Summary & Platform Overview
• AI Architecture — Invention Forge + Patent Drafter
• IP Portfolio — 24 Device Architectures
• Primary Source Archive (200+ documents)
• Financial Model — 5-Year DCF Projections
• Revenue Model & 8 Revenue Streams
• Risk Analysis & Competitive Landscape
• Technical Due Diligence Checklist

After reviewing the materials, please schedule a live 90-minute platform demonstration at your earliest convenience.

This message and link are confidential under your executed NDA.

— Zenith Apex Research Portfolio`,
    });

    console.log(`VDR session created for ${buyer_email}, expires ${expires_at}`);
    return Response.json({ session_id: session.id, token, vdr_link: vdrLink, expires_at });

  } catch (error) {
    console.error('createVDRSession error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});