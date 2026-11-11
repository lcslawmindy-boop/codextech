import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(e => e.status === 401 ? null : Promise.reject(e));
    if (!user) return Response.json({ error: 'Sign in required' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });
    const payload = await req.json().catch(() => ({}));
    if (payload.action !== 'status' && (typeof payload.pack_id !== 'string' || !/^bp-(00[1-9]|0[12][0-9]|03[0-3])$/.test(payload.pack_id))) return Response.json({ error: 'A valid brief pack is required' }, { status: 400 });
    const result = await base44.functions.invoke('generateBriefPackContent', payload);
    return Response.json(result.data);
  } catch (error) {
    console.error('Brief pack generation failed:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}