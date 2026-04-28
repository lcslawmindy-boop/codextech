import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { connectorId, videoIds } = await req.json();

    if (!connectorId) {
      return Response.json({ error: 'Missing connectorId' }, { status: 400 });
    }

    // Get TikTok connection
    const { accessToken } = await base44.asServiceRole.connectors.getCurrentAppUserConnection(connectorId);

    // Fetch user's videos and stats
    const videosRes = await fetch('https://open.tiktokapis.com/v1/video/list/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: ['id', 'create_time', 'video_description', 'video_duration']
      })
    });

    if (!videosRes.ok) {
      const err = await videosRes.text();
      console.error('TikTok API Error:', err);
      return Response.json({ error: 'Failed to fetch TikTok videos', details: err }, { status: videosRes.status });
    }

    const videosData = await videosRes.json();
    const videos = videosData.data?.videos || [];

    // Fetch analytics for each video
    const analyticsPromises = videos.map(async (video) => {
      try {
        const statsRes = await fetch(`https://open.tiktokapis.com/v1/video/query/video_detail/?video_id=${video.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!statsRes.ok) {
          return { id: video.id, error: 'Failed to fetch stats' };
        }

        const statsData = await statsRes.json();
        const stats = statsData.data?.videos?.[0] || {};

        return {
          id: video.id,
          description: video.video_description,
          createdAt: new Date(video.create_time * 1000),
          views: stats.statistics?.view_count || 0,
          likes: stats.statistics?.like_count || 0,
          comments: stats.statistics?.comment_count || 0,
          shares: stats.statistics?.share_count || 0,
          downloadCount: stats.statistics?.download_count || 0,
          duration: video.video_duration
        };
      } catch (err) {
        console.error('Analytics fetch error:', err.message);
        return { id: video.id, error: err.message };
      }
    });

    const analytics = await Promise.all(analyticsPromises);

    // Calculate engagement rate
    const enrichedAnalytics = analytics.map(v => ({
      ...v,
      engagementRate: v.views > 0 
        ? (((v.likes + v.comments + v.shares) / v.views) * 100).toFixed(2)
        : 0
    }));

    return Response.json({ 
      success: true, 
      videos: enrichedAnalytics.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    });
  } catch (error) {
    console.error('TikTok Analytics Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});