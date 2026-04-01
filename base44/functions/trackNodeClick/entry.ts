import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { node_id, label, group } = await req.json();
    if (!node_id) return Response.json({ error: 'node_id required' }, { status: 400 });

    // Find existing record
    const existing = await base44.asServiceRole.entities.NodeClick.filter({ node_id });

    if (existing && existing.length > 0) {
      const record = existing[0];
      await base44.asServiceRole.entities.NodeClick.update(record.id, {
        click_count: (record.click_count || 0) + 1,
      });
    } else {
      await base44.asServiceRole.entities.NodeClick.create({
        node_id,
        label,
        group,
        click_count: 1,
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("trackNodeClick error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});