import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find active access grant for this user
    const grants = await base44.entities.VDRAccessGrant.filter({
      email: user.email,
      is_active: true,
    });

    if (!grants || grants.length === 0) {
      return Response.json({ hasAccess: false, reason: 'No active access grants' });
    }

    // Check if any grant is still valid
    const now = new Date();
    const validGrant = grants.find(g => !g.expires_at || new Date(g.expires_at) > now);

    if (!validGrant) {
      return Response.json({ hasAccess: false, reason: 'All access grants have expired' });
    }

    // Update access count and last accessed
    await base44.entities.VDRAccessGrant.update(validGrant.id, {
      access_count: (validGrant.access_count || 0) + 1,
      last_accessed: new Date().toISOString(),
    });

    // Get accessible documents
    let documents = await base44.entities.VDRDocument.filter({
      is_active: true,
    });

    // Filter by folder access if specified
    if (validGrant.folder_access && validGrant.folder_access.length > 0) {
      documents = documents.filter(d => validGrant.folder_access.includes(d.folder));
    }

    return Response.json({
      hasAccess: true,
      access_level: validGrant.access_level,
      folder_access: validGrant.folder_access || [],
      documents: documents.map(d => ({
        id: d.id,
        name: d.name,
        folder: d.folder,
        file_type: d.file_type,
        file_size_bytes: d.file_size_bytes,
        view_count: d.view_count,
        download_count: d.download_count,
      })),
      expires_at: validGrant.expires_at,
    });
  } catch (error) {
    console.error('[VDR Verify Access Error]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});