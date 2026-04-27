import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// DocuSign Connect webhook — receives envelope completion events
// Register this URL in DocuSign Connect: https://[your-app-url]/api/docusignWebhook

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const body = await req.json();

    console.log('DocuSign webhook received:', JSON.stringify(body).slice(0, 500));

    const event = body.event || body.status;
    const envelopeId = body.envelopeId || body.data?.envelopeId || body.envelopeSummary?.envelopeId;
    const recipientEmail = body.data?.envelopeSummary?.recipients?.signers?.[0]?.email
      || body.envelopeSummary?.recipients?.signers?.[0]?.email
      || null;
    const recipientName = body.data?.envelopeSummary?.recipients?.signers?.[0]?.name
      || body.envelopeSummary?.recipients?.signers?.[0]?.name
      || null;

    if (!envelopeId) {
      console.log('No envelopeId found in webhook payload');
      return Response.json({ ok: true });
    }

    // Handle completion
    const isCompleted = event === 'envelope-completed' || body.status === 'completed'
      || body.data?.envelopeSummary?.status === 'completed'
      || body.envelopeSummary?.status === 'completed';

    if (isCompleted) {
      console.log(`Envelope ${envelopeId} completed by ${recipientEmail}`);

      // Fetch the signed PDF from DocuSign
      const accountId = Deno.env.get('DOCUSIGN_ACCOUNT_ID');
      const baseUrl = 'https://na4.docusign.net';
      const integrationKey = Deno.env.get('DOCUSIGN_INTEGRATION_KEY');
      const userId = Deno.env.get('DOCUSIGN_USER_ID');
      const privateKeyPem = Deno.env.get('DOCUSIGN_PRIVATE_KEY');

      let signedPdfUrl = null;

      if (accountId && integrationKey && userId && privateKeyPem) {
        try {
          // Get access token
          const now = Math.floor(Date.now() / 1000);
          const oauthBase = 'https://account.docusign.com';
          const header = { alg: 'RS256', typ: 'JWT' };
          const payload = {
            iss: integrationKey,
            sub: userId,
            aud: oauthBase.replace('https://', '').replace('http://', ''),
            iat: now,
            exp: now + 3600,
            scope: 'signature impersonation',
          };
          const encode = (obj) => btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
          const signingInput = `${encode(header)}.${encode(payload)}`;
          const pemContent = privateKeyPem
            .replace(/-----BEGIN RSA PRIVATE KEY-----/, '').replace(/-----END RSA PRIVATE KEY-----/, '')
            .replace(/-----BEGIN PRIVATE KEY-----/, '').replace(/-----END PRIVATE KEY-----/, '')
            .replace(/\s/g, '');
          const binaryDer = Uint8Array.from(atob(pemContent), c => c.charCodeAt(0));
          const cryptoKey = await crypto.subtle.importKey('pkcs8', binaryDer, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
          const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(signingInput));
          const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
          const jwt = `${signingInput}.${sigB64}`;
          const tokenRes = await fetch(`${oauthBase}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
          });
          const tokenData = await tokenRes.json();
          const accessToken = tokenData.access_token;

          // Download signed document as PDF
          const docRes = await fetch(`${baseUrl}/restapi/v2.1/accounts/${accountId}/envelopes/${envelopeId}/documents/combined`, {
            headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/pdf' },
          });

          if (docRes.ok) {
            const pdfBuffer = await docRes.arrayBuffer();
            const pdfBytes = new Uint8Array(pdfBuffer);
            // Convert to base64 data URL for storage
            const base64 = btoa(String.fromCharCode(...pdfBytes));
            signedPdfUrl = `data:application/pdf;base64,${base64}`;

            // Upload to base44 file storage
            try {
              const blob = new Blob([pdfBytes], { type: 'application/pdf' });
              const uploaded = await base44.asServiceRole.integrations.Core.UploadFile({ file: blob });
              if (uploaded?.file_url) signedPdfUrl = uploaded.file_url;
            } catch (uploadErr) {
              console.error('PDF upload error:', uploadErr);
            }
          }
        } catch (err) {
          console.error('Error fetching signed PDF:', err);
        }
      }

      // Update NDA signature record — mark as signed, store PDF URL
      try {
        const existing = await base44.asServiceRole.entities.NDASignature.filter({
          signature_data: `docusign_envelope:${envelopeId}`,
        });

        if (existing && existing.length > 0) {
          await base44.asServiceRole.entities.NDASignature.update(existing[0].id, {
            accepted_terms: true,
            signature_data: signedPdfUrl || `docusign_signed:${envelopeId}`,
            signed_at: new Date().toISOString(),
          });
        } else if (recipientEmail) {
          // Create record if not found (webhook may arrive before DB write)
          await base44.asServiceRole.entities.NDASignature.create({
            full_name: recipientName || recipientEmail,
            email: recipientEmail,
            company: 'Via DocuSign',
            signature_data: signedPdfUrl || `docusign_signed:${envelopeId}`,
            accepted_terms: true,
            ip_address: 'docusign',
            user_agent: 'docusign-connect',
            signed_at: new Date().toISOString(),
          });
        }
      } catch (dbErr) {
        console.error('DB update error:', dbErr);
      }

      // Notify admin with signed copy
      const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@codextech.io';
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: adminEmail,
        subject: `✅ NDA SIGNED — ${recipientName || recipientEmail}`,
        body: `NDA has been fully signed via DocuSign.\n\nSigner: ${recipientName || 'Unknown'}\nEmail: ${recipientEmail || 'Unknown'}\nEnvelope ID: ${envelopeId}\nSigned: ${new Date().toISOString()}\n\nSigned PDF: ${signedPdfUrl || 'Check DocuSign dashboard'}\n\nView all signed NDAs in the admin panel at /admin-nda-signatures`,
      });

      console.log(`NDA signed successfully for ${recipientEmail}, envelope ${envelopeId}`);
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('DocuSign webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});