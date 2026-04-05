import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow both scheduled (service role) and manual (admin) calls
    let isScheduled = false;
    try {
      const body = await req.clone().json();
      isScheduled = body?.scheduled === true;
    } catch (_) {}

    if (!isScheduled) {
      const user = await base44.auth.me();
      if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Fetch all active subscriptions
    const subscriptions = await base44.asServiceRole.entities.OpportunitySubscription.filter({ is_active: true });

    if (!subscriptions.length) {
      return Response.json({ message: 'No active subscriptions', alerts_created: 0 });
    }

    let totalAlerts = 0;

    for (const sub of subscriptions) {
      const domains = (sub.technology_domains || []).join(', ') || 'scalar electromagnetics, vacuum energy, bioelectromagnetics';
      const inventions = (sub.invention_names || []).join(', ') || 'scalar EM devices, MEG, Priore-class devices';
      const alertTypes = (sub.alert_types || ['Market Trend', 'Prior Art Update', 'Patent Filing']).join(', ');

      // Scan for relevant updates using LLM with internet
      let scanResult;
      try {
        scanResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: `You are an IP intelligence analyst monitoring the following invention portfolio for real-time market and patent developments.

Inventor portfolio: ${inventions}
Technology domains: ${domains}
Monitor for: ${alertTypes}

Search the current web, patent databases (USPTO, EPO, Google Patents), academic repositories (IEEE, arXiv), and business news for the LATEST developments (past 7 days) that are directly relevant to this invention portfolio.

Identify 2-4 high-impact alerts. For each alert return:
- title: concise alert headline (max 12 words)
- type: one of [Market Trend, Prior Art Update, Patent Filing, Competitor Activity, Regulatory Change]
- impact_level: one of [critical, high, medium, low]
- invention_name: which invention in the portfolio this impacts most
- summary: 2-3 sentences explaining what happened and why it matters to this portfolio
- recommended_action: 1 sentence concrete action the inventor should take
- source_name: publication or database name
- source_url: URL if available, otherwise empty string

Focus ONLY on genuinely new developments. Be specific with real sources.`,
          add_context_from_internet: true,
          model: 'gemini_3_1_pro',
          response_json_schema: {
            type: 'object',
            properties: {
              alerts: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    type: { type: 'string' },
                    impact_level: { type: 'string' },
                    invention_name: { type: 'string' },
                    summary: { type: 'string' },
                    recommended_action: { type: 'string' },
                    source_name: { type: 'string' },
                    source_url: { type: 'string' }
                  }
                }
              }
            }
          }
        });
      } catch (e) {
        console.error('LLM scan failed for', sub.user_email, e.message);
        continue;
      }

      const alerts = scanResult?.alerts || [];
      const impactRank = { critical: 4, high: 3, medium: 2, low: 1 };
      const minRank = impactRank[sub.min_impact_level || 'medium'] || 2;

      const filtered = alerts.filter(a => (impactRank[a.impact_level] || 0) >= minRank);

      for (const alert of filtered) {
        // Create alert record
        await base44.asServiceRole.entities.OpportunityAlert.create({
          user_email: sub.user_email,
          title: alert.title,
          type: alert.type,
          impact_level: alert.impact_level,
          invention_name: alert.invention_name,
          summary: alert.summary,
          recommended_action: alert.recommended_action,
          source_name: alert.source_name || 'Intelligence Scan',
          source_url: alert.source_url || '',
          email_sent: false,
          read: false,
          dismissed: false
        });
        totalAlerts++;

        // Send email if enabled and impact is high/critical
        if (sub.email_alerts && (alert.impact_level === 'high' || alert.impact_level === 'critical')) {
          const impactEmoji = alert.impact_level === 'critical' ? '🔴' : '🟠';
          try {
            await base44.asServiceRole.integrations.Core.SendEmail({
              to: sub.user_email,
              subject: `${impactEmoji} Portfolio Alert: ${alert.title}`,
              body: `
<div style="font-family: monospace; background: #0a0a14; color: #e0e0f0; padding: 32px; max-width: 600px; margin: 0 auto; border-radius: 12px;">
  <div style="border-bottom: 1px solid #2a2a4a; padding-bottom: 16px; margin-bottom: 24px;">
    <p style="color: #6080ff; font-size: 11px; letter-spacing: 2px; margin: 0;">ZENITH APEX OPPORTUNITY MONITOR</p>
    <h2 style="color: #ffffff; margin: 8px 0 0;">${impactEmoji} ${alert.title}</h2>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr>
      <td style="color: #888; font-size: 11px; padding: 4px 0;">TYPE</td>
      <td style="color: #a0c0ff; font-size: 11px; font-weight: bold;">${alert.type.toUpperCase()}</td>
    </tr>
    <tr>
      <td style="color: #888; font-size: 11px; padding: 4px 0;">IMPACT</td>
      <td style="color: ${alert.impact_level === 'critical' ? '#ff4444' : '#ff8800'}; font-size: 11px; font-weight: bold;">${alert.impact_level.toUpperCase()}</td>
    </tr>
    <tr>
      <td style="color: #888; font-size: 11px; padding: 4px 0;">INVENTION AFFECTED</td>
      <td style="color: #ffffff; font-size: 11px;">${alert.invention_name}</td>
    </tr>
    <tr>
      <td style="color: #888; font-size: 11px; padding: 4px 0;">SOURCE</td>
      <td style="color: #60c0ff; font-size: 11px;">${alert.source_name}</td>
    </tr>
  </table>

  <div style="background: #12122a; border: 1px solid #2a2a5a; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
    <p style="color: #b0b8d0; font-size: 13px; line-height: 1.6; margin: 0;">${alert.summary}</p>
  </div>

  <div style="background: #0a2a1a; border: 1px solid #1a5a2a; border-radius: 8px; padding: 12px; margin-bottom: 24px;">
    <p style="color: #60cc80; font-size: 11px; font-weight: bold; margin: 0 0 4px;">▶ RECOMMENDED ACTION</p>
    <p style="color: #a0e0b0; font-size: 12px; margin: 0;">${alert.recommended_action}</p>
  </div>

  ${alert.source_url ? `<a href="${alert.source_url}" style="color: #6080ff; font-size: 11px;">View Source →</a>` : ''}

  <p style="color: #333; font-size: 10px; margin-top: 32px; border-top: 1px solid #1a1a2a; padding-top: 12px;">
    Zenith Apex Opportunity Monitor · Unsubscribe by visiting your monitor dashboard
  </p>
</div>`
            });

            // Mark email as sent
            const alerts2 = await base44.asServiceRole.entities.OpportunityAlert.filter({
              user_email: sub.user_email,
              title: alert.title,
              email_sent: false
            });
            if (alerts2.length) {
              await base44.asServiceRole.entities.OpportunityAlert.update(alerts2[0].id, { email_sent: true });
            }
          } catch (e) {
            console.error('Email send failed:', e.message);
          }
        }
      }

      // Update last_scan timestamp
      await base44.asServiceRole.entities.OpportunitySubscription.update(sub.id, {
        last_scan: new Date().toISOString()
      });
    }

    return Response.json({ success: true, subscriptions_scanned: subscriptions.length, alerts_created: totalAlerts });
  } catch (error) {
    console.error('opportunityMonitor error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});