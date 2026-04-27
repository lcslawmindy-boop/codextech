import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import * as jose from 'npm:jose@5.9.6';

function textToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function getNdaText(name) {
  return [
    'CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT',
    'Zenith Apex Research Platform - C.O.D.E.X.T.E.C.H.',
    'Effective Date: April 2026 | Version: 1.0',
    '',
    '1. PARTIES AND SCOPE',
    'This Agreement is between the operator of the Zenith Apex Research Platform (Disclosing Party)',
    'and the individual accessing this platform (Recipient).',
    '',
    '2. CONFIDENTIAL INFORMATION',
    'All research data, analytical frameworks, business models, source texts, AI-generated content,',
    'and platform architecture contained in this application are Confidential Information.',
    '',
    '3. OBLIGATIONS',
    '- Hold all Confidential Information in strict confidence.',
    '- Do not copy, screenshot, reproduce, publish, share, or distribute any content.',
    '- Do not use for commercial purposes without express written consent.',
    '- Do not input into any AI system, LLM, or automated extraction tool.',
    '- Do not share access credentials or grant third-party access.',
    '',
    '4. PROHIBITION ON AI INGESTION',
    'No content shall be input into any AI or LLM system for training or analysis,',
    'scraped by automated tools, or used to create competing platforms.',
    'Violation constitutes unauthorized access under 18 U.S.C. 1030.',
    '',
    '5. LIQUIDATED DAMAGES',
    '- $50,000 per incident of unauthorized disclosure.',
    '- $250,000 per incident of unauthorized AI ingestion or commercial exploitation.',
    '',
    '6. TERM',
    'Effective upon first access and indefinitely surviving. Governed by U.S. law.',
    '',
    'Electronic signature constitutes a valid binding signature under the E-SIGN Act.',
    '',
    'Recipient: ' + name,
    '',
    '________________________________',
    'Signature',
    '',
    '________________________________',
    'Printed Name',
    '',
    '________________________________',
    'Date Signed',
  ].join('\n');
}

async function getDocuSignToken(integrationKey, userId, rawPem) {
  // Normalize PEM — handle all storage formats
  let pem = rawPem
    .replace(/\\n/g, '\n')  // literal \n -> real newline
    .trim();

  // If stored as raw base64 (no PEM headers), detect and wrap
  if (!pem.includes('-----')) {
    // Raw base64 key — wrap in PKCS8 header
    const chunked = pem.replace(/[^A-Za-z0-9+/=]/g, '').match(/.{1,64}/g).join('\n');
    pem = '-----BEGIN PRIVATE KEY-----\n' + chunked + '\n-----END PRIVATE KEY-----';
  } else {
    // Has headers — normalize line endings and spacing
    const lines = pem.split(/\r?\n/);
    pem = lines.join('\n');
  }

  console.log('PEM header line:', pem.split('\n')[0]);

  const privateKey = await jose.importPKCS8(pem, 'RS256');

  const now = Math.floor(Date.now() / 1000);
  const jwt = await new jose.SignJWT({})
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuer(integrationKey)
    .setSubject(userId)
    .setAudience('account.docusign.com')
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .setJti(crypto.randomUUID())
    .sign(privateKey);

  // Inject scope claim manually since jose SignJWT doesn't have a setScope method
  // Re-sign with scope in payload
  const jwt2 = await new jose.SignJWT({
    iss: integrationKey,
    sub: userId,
    aud: 'account.docusign.com',
    iat: now,
    exp: now + 3600,
    scope: 'signature impersonation',
  })
    .setProtectedHeader({ alg: 'RS256' })
    .sign(privateKey);

  const tokenRes = await fetch('https://account.docusign.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + jwt2,
  });

  const tokenText = await tokenRes.text();
  if (!tokenRes.ok) {
    throw new Error('DocuSign token error: ' + tokenText);
  }

  return JSON.parse(tokenText).access_token;
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    console.log('sendNdaDocusign: start');

    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { full_name, email, company } = body;

    if (!full_name || !email) {
      return Response.json({ error: 'full_name and email are required' }, { status: 400 });
    }

    const accountId = Deno.env.get('DOCUSIGN_ACCOUNT_ID');
    const integrationKey = Deno.env.get('DOCUSIGN_INTEGRATION_KEY');
    const userId = Deno.env.get('DOCUSIGN_USER_ID');
    const rawPem = Deno.env.get('DOCUSIGN_PRIVATE_KEY') || '';

    console.log('Secrets present:', { accountId: !!accountId, integrationKey: !!integrationKey, userId: !!userId, pem: rawPem.length });

    if (!accountId || !integrationKey || !userId || !rawPem) {
      return Response.json({ error: 'Missing DocuSign configuration' }, { status: 500 });
    }

    console.log('Getting access token...');
    const accessToken = await getDocuSignToken(integrationKey, userId, rawPem);
    console.log('Access token obtained');

    const ndaBase64 = textToBase64(getNdaText(full_name));

    const envelopeBody = {
      emailSubject: 'Please sign: C.O.D.E.X.T.E.C.H. Non-Disclosure Agreement',
      emailBlurb: 'Dear ' + full_name + ', please sign the NDA to access the Zenith Apex Research Platform vault.',
      documents: [{
        documentBase64: ndaBase64,
        name: 'CODEXTECH_NDA.txt',
        fileExtension: 'txt',
        documentId: '1',
      }],
      recipients: {
        signers: [{
          email,
          name: full_name,
          recipientId: '1',
          routingOrder: '1',
          tabs: {
            signHereTabs: [{ documentId: '1', pageNumber: '1', xPosition: '100', yPosition: '700' }],
            fullNameTabs: [{ documentId: '1', pageNumber: '1', xPosition: '100', yPosition: '730' }],
            dateTabs: [{ documentId: '1', pageNumber: '1', xPosition: '100', yPosition: '760' }],
          },
        }],
      },
      status: 'sent',
    };

    const apiBase = 'https://na4.docusign.net/restapi/v2.1/accounts/' + accountId;
    console.log('Creating envelope...');

    const createRes = await fetch(apiBase + '/envelopes', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify(envelopeBody),
    });

    const createText = await createRes.text();
    if (!createRes.ok) {
      console.error('Envelope creation failed:', createText);
      return Response.json({ error: 'Failed to create DocuSign envelope', details: createText }, { status: 500 });
    }

    const envelope = JSON.parse(createText);
    const envelopeId = envelope.envelopeId;
    console.log('Envelope created:', envelopeId);

    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    await base44.asServiceRole.entities.NDASignature.create({
      full_name,
      email,
      company: company || 'Not provided',
      signature_data: 'docusign_envelope:' + envelopeId,
      accepted_terms: false,
      ip_address: ip,
      user_agent: req.headers.get('user-agent') || 'unknown',
      signed_at: new Date().toISOString(),
    });

    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@codextech.io';
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: adminEmail,
      subject: 'NDA Sent for Signature - ' + full_name,
      body: 'NDA sent via DocuSign.\nName: ' + full_name + '\nEmail: ' + email + '\nEnvelope ID: ' + envelopeId,
    });

    return Response.json({
      success: true,
      envelopeId,
      message: 'NDA sent to your email via DocuSign. Check your inbox and sign to gain vault access.',
    });
  } catch (error) {
    console.error('sendNdaDocusign error:', error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});