import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { crypto } from 'https://deno.land/std@0.208.0/crypto/mod.ts';

function generateSecureToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, name, organization, access_level, folder_access, expires_at, notes } = await req.json();

    if (!email || !access_level) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create access grant
    const grant = await base44.entities.VDRAccessGrant.create({
      email: email,
      name: name || email,
      organization: organization || '',
      access_level: access_level,
      folder_access: folder_access || [],
      nda_verified: false,
      granted_by: user.email,
      expires_at: expires_at,
      is_active: true,
      access_count: 0,
      notes: notes || `Granted by ${user.email}`,
    });

    console.log(`[VDR] Access granted to ${email} (${access_level})`);

    return Response.json({
      success: true,
      grant_id: grant.id,
      email: email,
      access_level: access_level,
      expires_at: expires_at,
    });
  } catch (error) {
    console.error('[VDR Access Grant Error]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});