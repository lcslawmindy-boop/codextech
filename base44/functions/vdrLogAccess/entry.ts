import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { document_id, action } = await req.json(); // action: 'view' | 'download'

    if (!document_id || !action) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const doc = await base44.entities.VDRDocument.list(undefined, 1);
    const document = doc.find(d => d.id === document_id);

    if (!document) {
      return Response.json({ error: 'Document not found' }, { status: 404 });
    }

    // Update document counts
    const updateData = {};
    if (action === 'view') {
      updateData.view_count = (document.view_count || 0) + 1;
    } else if (action === 'download') {
      updateData.download_count = (document.download_count || 0) + 1;
    }

    await base44.entities.VDRDocument.update(document_id, updateData);

    console.log(`[VDR] ${user.email} ${action}ed document: ${document_id}`);

    return Response.json({ success: true });
  } catch (error) {
    console.error('[VDR Access Log Error]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});