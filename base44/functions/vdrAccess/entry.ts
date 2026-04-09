import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { token, action, page, duration_seconds } = await req.json();

    if (!token) return Response.json({ error: 'Token required' }, { status: 400 });

    // Look up session by token
    const sessions = await base44.asServiceRole.entities.VDRSession.filter({ token });
    if (!sessions || sessions.length === 0) {
      return Response.json({ error: 'Invalid access token', valid: false }, { status: 404 });
    }

    const session = sessions[0];

    // Check if expired
    if (new Date(session.expires_at) < new Date()) {
      await base44.asServiceRole.entities.VDRSession.update(session.id, { status: 'expired' });
      return Response.json({ error: 'Access window has expired', valid: false, expired: true }, { status: 403 });
    }

    // Check if revoked
    if (session.status === 'revoked') {
      return Response.json({ error: 'Access has been revoked', valid: false, revoked: true }, { status: 403 });
    }

    // Get real IP from request headers
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    if (action === 'validate') {
      // Just validate — increment access count on first load
      await base44.asServiceRole.entities.VDRSession.update(session.id, {
        access_count: (session.access_count || 0) + 1,
        last_accessed: new Date().toISOString(),
        status: 'active',
      });
      return Response.json({
        valid: true,
        buyer_name: session.buyer_name,
        buyer_email: session.buyer_email,
        buyer_org: session.buyer_org,
        expires_at: session.expires_at,
        session_id: session.id,
      });
    }

    if (action === 'track_view' && page) {
      // Log page view
      const newView = {
        page,
        viewed_at: new Date().toISOString(),
        duration_seconds: duration_seconds || 0,
        ip,
      };
      const updatedViews = [...(session.page_views || []), newView];
      const newTotalTime = (session.total_time_seconds || 0) + (duration_seconds || 0);

      await base44.asServiceRole.entities.VDRSession.update(session.id, {
        page_views: updatedViews,
        total_time_seconds: newTotalTime,
        last_accessed: new Date().toISOString(),
      });

      console.log(`VDR page view: ${session.buyer_email} viewed "${page}" for ${duration_seconds}s`);
      return Response.json({ tracked: true });
    }

    if (action === 'revoke') {
      // Admin revoke — need admin check
      const user = await base44.auth.me();
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Admin required to revoke' }, { status: 403 });
      }
      await base44.asServiceRole.entities.VDRSession.update(session.id, {
        status: 'revoked',
        revoked_reason: duration_seconds || 'Manual revocation by admin',
      });
      return Response.json({ revoked: true });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    console.error('vdrAccess error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});