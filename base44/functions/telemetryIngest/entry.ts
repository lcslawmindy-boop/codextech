import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * HTTP telemetry ingest endpoint.
 * 
 * POST / with JSON body:
 * {
 *   "device_id": "my-device-123",
 *   "api_key": "sk_...",
 *   "readings": [
 *     { "channel": "voltage", "value": 12.4, "unit": "V", "label": "Input Voltage" },
 *     { "channel": "flux",    "value": 0.35, "unit": "T", "label": "Magnetic Flux" }
 *   ],
 *   "session_id": "optional-session-id"
 * }
 *
 * Returns: { success: true, alerts_triggered: [...] }
 */
Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { device_id, api_key, readings, session_id } = body;

    if (!device_id || !api_key || !readings?.length) {
      return Response.json({ error: 'Missing required fields: device_id, api_key, readings' }, { status: 400 });
    }

    // Verify device and api_key
    const devices = await base44.asServiceRole.entities.IoTDevice.filter({ device_id });
    if (!devices || devices.length === 0) {
      return Response.json({ error: 'Device not found' }, { status: 404 });
    }
    const device = devices[0];
    if (device.api_key !== api_key) {
      return Response.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const now = new Date().toISOString();
    const sid = session_id || `sess_${Date.now()}`;
    const alertsTriggered = [];

    // Fetch active alerts for this device
    const alerts = await base44.asServiceRole.entities.TelemetryAlert.filter({
      device_id,
      enabled: true,
    });

    // Save each reading and check alerts
    const readingPromises = readings.map(async (r) => {
      const reading = {
        device_id,
        device_name: device.name,
        user_email: device.user_email,
        channel: r.channel,
        label: r.label || r.channel,
        value: r.value,
        unit: r.unit || '',
        timestamp: r.timestamp || now,
        session_id: sid,
        alert_triggered: false,
      };

      // Check threshold alerts for this channel
      for (const alert of alerts) {
        if (alert.channel !== r.channel) continue;
        let triggered = false;
        if (alert.condition === 'above' && r.value > alert.threshold) triggered = true;
        if (alert.condition === 'below' && r.value < alert.threshold) triggered = true;
        if (alert.condition === 'equals' && r.value === alert.threshold) triggered = true;

        if (triggered) {
          reading.alert_triggered = true;
          alertsTriggered.push({
            alert_id: alert.id,
            channel: r.channel,
            channel_label: alert.channel_label || r.channel,
            condition: alert.condition,
            threshold: alert.threshold,
            triggered_value: r.value,
            severity: alert.severity,
            message: alert.message || `${r.channel} is ${alert.condition} ${alert.threshold}${alert.unit || ''}`,
          });
          // Update alert record with last trigger info
          await base44.asServiceRole.entities.TelemetryAlert.update(alert.id, {
            triggered_at: now,
            triggered_value: r.value,
            acknowledged: false,
          });
        }
      }

      await base44.asServiceRole.entities.TelemetryReading.create(reading);
    });

    await Promise.all(readingPromises);

    // Update device last_seen and total_readings
    await base44.asServiceRole.entities.IoTDevice.update(device.id, {
      last_seen: now,
      status: 'active',
      total_readings: (device.total_readings || 0) + readings.length,
    });

    console.log(`[telemetryIngest] device=${device_id} readings=${readings.length} alerts=${alertsTriggered.length}`);

    return new Response(JSON.stringify({
      success: true,
      readings_saved: readings.length,
      alerts_triggered: alertsTriggered,
      session_id: sid,
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    console.error('[telemetryIngest] error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});