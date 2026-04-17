import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    // ── ADMIN ACTIONS ─────────────────────────────────────────────────────────
    if (['upload', 'delete_doc', 'grant_access', 'revoke_access', 'update_grant'].includes(action)) {
      if (user.role !== 'admin') {
        return Response.json({ error: 'Admin required' }, { status: 403 });
      }
    }

    // Upload / register a document
    if (action === 'upload') {
      const { name, description, folder, file_url, file_name, file_size_bytes, file_type } = body;
      const doc = await base44.asServiceRole.entities.VDRDocument.create({
        name, description, folder, file_url, file_name,
        file_size_bytes: file_size_bytes || 0,
        file_type: file_type || 'application/octet-stream',
        uploaded_by: user.email,
        is_active: true,
        view_count: 0,
        download_count: 0,
      });
      console.log(`VDR upload: ${user.email} uploaded "${name}" to ${folder}`);
      return Response.json({ doc });
    }

    // Delete a document
    if (action === 'delete_doc') {
      const { doc_id } = body;
      await base44.asServiceRole.entities.VDRDocument.delete(doc_id);
      console.log(`VDR delete: ${user.email} deleted document ${doc_id}`);
      return Response.json({ deleted: true });
    }

    // Grant access to an email
    if (action === 'grant_access') {
      const { email, name: grantee_name, organization, access_level, folder_access, nda_verified, expires_at, notes } = body;

      // Check if already exists
      const existing = await base44.asServiceRole.entities.VDRAccessGrant.filter({ email });
      let grant;
      if (existing.length > 0) {
        grant = await base44.asServiceRole.entities.VDRAccessGrant.update(existing[0].id, {
          name: grantee_name, organization, access_level,
          folder_access: folder_access || [],
          nda_verified: nda_verified || false,
          nda_verified_at: nda_verified ? new Date().toISOString() : existing[0].nda_verified_at,
          granted_by: user.email,
          expires_at: expires_at || null,
          is_active: true,
          notes,
        });
      } else {
        grant = await base44.asServiceRole.entities.VDRAccessGrant.create({
          email, name: grantee_name, organization, access_level,
          folder_access: folder_access || [],
          nda_verified: nda_verified || false,
          nda_verified_at: nda_verified ? new Date().toISOString() : null,
          granted_by: user.email,
          expires_at: expires_at || null,
          is_active: true,
          access_count: 0,
          notes,
        });
      }
      console.log(`VDR access granted: ${user.email} granted ${access_level} to ${email}`);
      return Response.json({ grant });
    }

    // Revoke access
    if (action === 'revoke_access') {
      const { grant_id } = body;
      await base44.asServiceRole.entities.VDRAccessGrant.update(grant_id, { is_active: false });
      console.log(`VDR access revoked: grant ${grant_id}`);
      return Response.json({ revoked: true });
    }

    // Update grant (toggle nda, change level, etc.)
    if (action === 'update_grant') {
      const { grant_id, ...updates } = body;
      delete updates.action;
      if (updates.nda_verified && !updates.nda_verified_at) {
        updates.nda_verified_at = new Date().toISOString();
      }
      const grant = await base44.asServiceRole.entities.VDRAccessGrant.update(grant_id, updates);
      return Response.json({ grant });
    }

    // ── GRANTEE ACCESS: view or download a document ───────────────────────────
    if (action === 'access_doc') {
      const { doc_id, type } = body; // type = 'view' | 'download'

      // Check grantee access
      const grants = await base44.asServiceRole.entities.VDRAccessGrant.filter({ email: user.email, is_active: true });
      const grant = grants.find(g => {
        if (!g.is_active) return false;
        if (g.expires_at && new Date(g.expires_at) < new Date()) return false;
        if (!g.nda_verified) return false;
        return true;
      });

      if (!grant) {
        return Response.json({ error: 'No active access grant found. NDA verification required.' }, { status: 403 });
      }

      // Get doc
      const docs = await base44.asServiceRole.entities.VDRDocument.filter({ id: doc_id });
      if (!docs.length) return Response.json({ error: 'Document not found' }, { status: 404 });
      const doc = docs[0];

      // Check folder access
      if (grant.folder_access && grant.folder_access.length > 0 && !grant.folder_access.includes(doc.folder)) {
        return Response.json({ error: 'You do not have access to this folder' }, { status: 403 });
      }

      // Check download permission
      if (type === 'download' && grant.access_level !== 'download') {
        return Response.json({ error: 'View-only access — downloading is not permitted' }, { status: 403 });
      }

      // Log access
      const updatePayload = {
        last_accessed: new Date().toISOString(),
        access_count: (grant.access_count || 0) + 1,
      };
      await base44.asServiceRole.entities.VDRAccessGrant.update(grant.id, updatePayload);

      if (type === 'view') {
        await base44.asServiceRole.entities.VDRDocument.update(doc_id, { view_count: (doc.view_count || 0) + 1 });
        console.log(`VDR view: ${user.email} viewed "${doc.name}"`);
        return Response.json({ url: doc.file_url, name: doc.name, type: 'view' });
      }

      if (type === 'download') {
        await base44.asServiceRole.entities.VDRDocument.update(doc_id, { download_count: (doc.download_count || 0) + 1 });
        console.log(`VDR download: ${user.email} downloaded "${doc.name}"`);
        // Generate a signed URL using the Core integration
        const result = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({
          file_uri: doc.file_url,
          expires_in: 300,
        });
        return Response.json({ url: result.signed_url || doc.file_url, name: doc.name, type: 'download' });
      }
    }

    // ── LIST: admin lists all docs + grants ───────────────────────────────────
    if (action === 'list_all') {
      if (user.role !== 'admin') return Response.json({ error: 'Admin required' }, { status: 403 });
      const [docs, grants] = await Promise.all([
        base44.asServiceRole.entities.VDRDocument.list('-created_date', 200),
        base44.asServiceRole.entities.VDRAccessGrant.list('-created_date', 200),
      ]);
      return Response.json({ docs, grants });
    }

    // ── GRANTEE: list their accessible docs ───────────────────────────────────
    if (action === 'list_grantee_docs') {
      const grants = await base44.asServiceRole.entities.VDRAccessGrant.filter({ email: user.email, is_active: true });
      const grant = grants.find(g => {
        if (!g.is_active) return false;
        if (g.expires_at && new Date(g.expires_at) < new Date()) return false;
        if (!g.nda_verified) return false;
        return true;
      });
      if (!grant) return Response.json({ error: 'No active verified access grant', has_access: false }, { status: 403 });

      let docs = await base44.asServiceRole.entities.VDRDocument.filter({ is_active: true });
      if (grant.folder_access && grant.folder_access.length > 0) {
        docs = docs.filter(d => grant.folder_access.includes(d.folder));
      }
      return Response.json({ docs, grant, has_access: true });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    console.error('vdrDocuments error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});