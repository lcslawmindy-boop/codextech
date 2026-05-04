import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const name = formData.get('name');
    const description = formData.get('description') || '';
    const folder = formData.get('folder') || 'Other';

    if (!file || !name) {
      return Response.json({ error: 'Missing file or name' }, { status: 400 });
    }

    // Upload file to secure storage
    const uploadRes = await base44.integrations.Core.UploadFile({
      file: file,
    });

    const fileUrl = uploadRes.file_url;

    // Create VDR document record
    const doc = await base44.entities.VDRDocument.create({
      name: name,
      description: description,
      folder: folder,
      file_url: fileUrl,
      file_name: file.name,
      file_size_bytes: file.size,
      file_type: file.type,
      uploaded_by: user.email,
      is_active: true,
      view_count: 0,
      download_count: 0,
    });

    console.log(`[VDR] Document uploaded by ${user.email}: ${doc.id}`);

    return Response.json({
      success: true,
      document_id: doc.id,
      file_url: fileUrl,
      file_name: file.name,
      file_size_bytes: file.size,
    });
  } catch (error) {
    console.error('[VDR Upload Error]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});