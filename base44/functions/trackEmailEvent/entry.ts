import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('t');
    const type = url.searchParams.get('type'); // 'open' or 'click'
    const clickUrl = url.searchParams.get('url'); // For click events

    if (!token || !type) {
      return Response.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // Find tracking record by token
    const trackingRecords = await base44.asServiceRole.entities.EmailTracking.filter({
      tracking_token: token
    });

    if (!trackingRecords || trackingRecords.length === 0) {
      return Response.json({ error: 'Tracking token not found' }, { status: 404 });
    }

    const tracking = trackingRecords[0];

    // Update based on event type
    if (type === 'open') {
      const updateData = {
        opened: true,
        open_count: (tracking.open_count || 0) + 1,
        last_engagement: new Date().toISOString(),
        engagement_score: Math.min(100, (tracking.engagement_score || 0) + 10)
      };

      if (!tracking.first_opened_at) {
        updateData.first_opened_at = new Date().toISOString();
        updateData.status = 'opened';
      }

      // Update tracking record
      await base44.asServiceRole.entities.EmailTracking.update(tracking.id, updateData);

      // Update investor CRM with engagement data
      const investor = await base44.asServiceRole.entities.InvestorOutreach.read(tracking.investor_id);
      if (investor) {
        const comms = investor.communications || [];
        comms.push({
          id: Date.now().toString(),
          date: new Date().toISOString(),
          type: 'email_opened',
          content: `Email opened: "${tracking.subject}"`,
          response: null
        });
        await base44.asServiceRole.entities.InvestorOutreach.update(tracking.investor_id, {
          communications: comms,
          last_contact: new Date().toISOString()
        });
      }

      // Return 1x1 transparent pixel
      const gif = Buffer.from([
        0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00,
        0x01, 0x00, 0x80, 0x00, 0x00, 0xff, 0xff, 0xff,
        0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x00,
        0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00,
        0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44,
        0x01, 0x00, 0x3b
      ]);

      return new Response(gif, {
        status: 200,
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
    } else if (type === 'click') {
      // Track link click
      const linksClicked = tracking.links_clicked || [];
      const existingLink = linksClicked.find(l => l.url === clickUrl);

      if (existingLink) {
        existingLink.click_count = (existingLink.click_count || 0) + 1;
      } else {
        linksClicked.push({
          url: clickUrl,
          clicked_at: new Date().toISOString(),
          click_count: 1
        });
      }

      const updateData = {
        links_clicked: linksClicked,
        total_clicks: (tracking.total_clicks || 0) + 1,
        last_engagement: new Date().toISOString(),
        engagement_score: Math.min(100, (tracking.engagement_score || 0) + 20),
        status: 'clicked'
      };

      // Update tracking record
      await base44.asServiceRole.entities.EmailTracking.update(tracking.id, updateData);

      // Update investor CRM
      const investor = await base44.asServiceRole.entities.InvestorOutreach.read(tracking.investor_id);
      if (investor) {
        const comms = investor.communications || [];
        comms.push({
          id: Date.now().toString(),
          date: new Date().toISOString(),
          type: 'email_clicked',
          content: `Clicked link in email: "${tracking.subject}" → ${clickUrl}`,
          response: null
        });
        await base44.asServiceRole.entities.InvestorOutreach.update(tracking.investor_id, {
          communications: comms,
          last_contact: new Date().toISOString()
        });
      }

      // Redirect to actual URL
      return new Response(null, {
        status: 302,
        headers: {
          'Location': clickUrl
        }
      });
    }

    return Response.json({ error: 'Invalid event type' }, { status: 400 });
  } catch (error) {
    console.error('Error tracking email event:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});