import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Vault file access. Only administrators receive signed links to any vault file
// (Partner-level grants are not configured; non-admins get a 403).
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Sign in required' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Authorization required for vault documents' }, { status: 403 });
    const { artifact_id } = await req.json().catch(() => ({}));
    if (!artifact_id) return Response.json({ error: 'artifact_id is required' }, { status: 400 });
    const art = await base44.asServiceRole.entities.EngineeringArtifact.get(artifact_id)
      .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
    if (!art || !art.file_uri) return Response.json({ error: 'No file on record' }, { status: 404 });
    const res = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({ file_uri: art.file_uri, expires_in: 300 });
    return Response.json({ url: res.signed_url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}