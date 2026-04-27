import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import * as jose from 'npm:jose@5.9.6';

async function getDocuSignToken() {
  const integrationKey = Deno.env.get('DOCUSIGN_INTEGRATION_KEY');
  const userId = Deno.env.get('DOCUSIGN_USER_ID');
  const rawPem = Deno.env.get('DOCUSIGN_PRIVATE_KEY') || '';

  if (!integrationKey || !userId || !rawPem) {
    throw new Error('Missing DocuSign credentials');
  }

  // Restore PEM format — handle escaped newlines from secret storage
  let pem = rawPem.replace(/\\n/g, '\n');

  // If the PEM doesn't have proper headers, it's raw base64 — wrap it
  if (!pem.includes('-----BEGIN')) {
    pem = '-----BEGIN RSA PRIVATE KEY-----\n' + pem + '\n-----END RSA PRIVATE KEY-----';
  }

  console.log('PEM starts with:', pem.slice(0, 40));

  const privateKey = await jose.importPKCS8(pem, 'RS256').catch(async () => {
    // Try as RSA private key format
    return await jose.importPKCS8(pem.replace('RSA PRIVATE KEY', 'PRIVATE KEY'), 'RS256');
  });

  const now = Math.floor(Date.now() / 1000);
  const jwt = await new jose.SignJWT({
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
    body: 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + jwt,
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error('DocuSign token error: ' + err);
  }

  const data = await tokenRes.json();
  return data.access_token;
}

function getNdaText(name) {
  const lines = [
    'CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT',
    '',
    'Zenith Apex Research Platform - C.O.D.E.X.T.E.C.H.',
    'Effective Date: April 2026 | Agreement Version: 1.0',
    '',
    'PARTIES AND SCOPE',
    'This NDA is entered into between the operator of the Zenith Apex Research Platform ("Disclosing Party") and the individual accessing this platform ("Recipient").',
    '',
    'CONFIDENTIAL INFORMATION INCLUDES:',
    '- All research data relating to scalar electromagnetics and gravitobiology',
    '- Analytical frameworks, concept node structures, and relational graph data',
    '- Business models, pitch deck outlines, revenue projections, and product roadmaps',
    '- Source text fragments, commentary, and interpretive analysis',
    '- AI-generated summaries or derivative content produced within this platform',
    '',
    'OBLIGATIONS OF RECIPIENT:',
    '- Hold all Confidential Information in strict confidence',
    '- Not copy, screenshot, reproduce, publish, share, transmit, or distribute any content',
    '- Not use any Confidential Information for commercial purposes without express written consent',
    '- Not input any Confidential Information into any AI system, LLM, or automated data extraction tool',
    '- Immediately notify the Disclosing Party of any unauthorized disclosure',
    '',
    'PROHIBITION ON AI INGESTION:',
    'No content from this platform shall be input into any AI or LLM system for training, fine-tuning,',
    'or analysis; scraped or harvested by any automated tool; or used to create competing platforms.',
    'Violation constitutes unauthorized access under the Computer Fraud and Abuse Act (18 U.S.C. 1030).',
    '',
    'REMEDIES AND LIQUIDATED DAMAGES:',
    '- $50,000 per incident of unauthorized disclosure or distribution',
    '- $250,000 per incident of unauthorized AI ingestion or commercial exploitation',
    '',
    'TERM AND SURVIVAL:',
    'This Agreement is effective upon first access and remains in effect indefinitely.',
    'Governed by the laws of the United States of America.',
    '',
    'By signing below, the Recipient confirms they have read and agree to all terms.',
    'Electronic signature constitutes a valid binding signature under the E-SIGN Act.',
    '',
    'Recipient: ' + name,
    '',
    '______________________________',
    'Signature',
    '',
    '______________________________',
    'Printed Name',
    '',
    '______________________________',
    'Date',
  ];
  return lines.join('\n');
}

function textToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    console.log('sendNdaDocusign called');

    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { full_name, email, company } = body;

    if (!full_name || !email) {
      return Response.json({ error: 'full_name and email are required' }, { status: 400 });
    }

    const accountId = Deno.env.get('DOCUSIGN_ACCOUNT_ID');
    if (!accountId) {
      return Response.json({ error: 'DOCUSIGN_ACCOUNT_ID not configured' }, { status: 500 });
    }

    console.log('Getting DocuSign token...');
    const accessToken = await getDocuSignToken();
    console.log('Token obtained successfully');

    const ndaBase64 = textToBase64(getNdaText(full_name));

    const envelopeBody = {
      emailSubject: 'Please sign the C.O.D.E.X.T.E.C.H. Non-Disclosure Agreement',
      emailBlurb: 'Dear ' + full_name + ', please sign the attached NDA to access the vault.',
      documents: [
        {
          documentBase64: ndaBase64,
          name: 'CODEXTECH_NDA.txt',
          fileExtension: 'txt',
          documentId: '1',
        },
      ],
      recipients: {
        signers: [
          {
            email,
            name: full_name,
            recipientId: '1',
            routingOrder: '1',
            tabs: {
              signHereTabs: [{ documentId: '1', pageNumber: '1', xPosition: '100', yPosition: '700' }],
              fullNameTabs: [{ documentId: '1', pageNumber: '1', xPosition: '100', yPosition: '730' }],
              dateTabs: [{ documentId: '1', pageNumber: '1', xPosition: '100', yPosition: '760' }],
            },
          },
        ],
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

    if (!createRes.ok) {
      const err = await createRes.text();
      console.error('Envelope error:', err);
      return Response.json({ error: 'Failed to create DocuSign envelope', details: err }, { status: 500 });
    }

    const envelope = await createRes.json();
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
      body: 'NDA signature request sent via DocuSign.\n\nName: ' + full_name + '\nEmail: ' + email + '\nEnvelope ID: ' + envelopeId,
    });

    return Response.json({
      success: true,
      envelopeId,
      message: 'NDA sent to your email via DocuSign. Please check your inbox and sign to gain vault access.',
    });
  } catch (error) {
    console.error('sendNdaDocusign error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});