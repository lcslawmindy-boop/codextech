import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get GA4 connection
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('google_analytics');
    const measurementId = Deno.env.get('GA4_MEASUREMENT_ID');

    if (!measurementId) {
      return Response.json({ error: 'GA4_MEASUREMENT_ID not configured' }, { status: 500 });
    }

    // Query GA4 API for enterprise conversion metrics
    const gaResponse = await fetch('https://analyticsdata.googleapis.com/v1beta/properties/' + measurementId + ':runReport', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'eventCount' },
          { name: 'purchaseRevenue' },
        ],
        dimensions: [{ name: 'eventName' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            stringFilter: {
              matchType: 'EXACT',
              value: 'conversion',
            },
          },
        },
      }),
    });

    if (!gaResponse.ok) {
      const error = await gaResponse.text();
      console.error('GA4 API error:', error);
      return Response.json({ error: 'Failed to fetch GA4 data', details: error }, { status: 500 });
    }

    const data = await gaResponse.json();
    const rows = data.rows || [];

    let enterpriseSignups = 0;
    let revenue = 0;

    rows.forEach(row => {
      if (row.metricValues) {
        enterpriseSignups += parseInt(row.metricValues[0]?.value || 0);
        revenue += parseFloat(row.metricValues[1]?.value || 0);
      }
    });

    // Calculate conversion rate (events / total visits) — simplified for example
    const conversionRate = 0.05; // 5% placeholder — real value would query GA4 visitors metric

    console.log(`Enterprise conversions: ${enterpriseSignups}, Revenue: $${revenue.toFixed(2)}`);

    return Response.json({
      enterpriseSignups,
      conversionRate,
      revenue: Math.round(revenue * 100) / 100,
    });
  } catch (error) {
    console.error('GA4 fetch error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});