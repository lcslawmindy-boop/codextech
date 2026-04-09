import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }

  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

  // Fetch Stripe data in parallel
  const [charges, customers, sessions, subs] = await Promise.all([
    stripe.charges.list({ limit: 100 }).catch(() => ({ data: [] })),
    stripe.customers.list({ limit: 100 }).catch(() => ({ data: [] })),
    stripe.checkout.sessions.list({ limit: 100 }).catch(() => ({ data: [] })),
    stripe.subscriptions.list({ limit: 100, status: 'active' }).catch(() => ({ data: [] })),
  ]);

  // Revenue calculations
  const successfulCharges = charges.data.filter(c => c.status === 'succeeded');
  const totalRevenue = successfulCharges.reduce((s, c) => s + c.amount, 0) / 100;
  const last30 = Date.now() / 1000 - 30 * 86400;
  const last90 = Date.now() / 1000 - 90 * 86400;
  const revenue30d = successfulCharges.filter(c => c.created > last30).reduce((s, c) => s + c.amount, 0) / 100;
  const revenue90d = successfulCharges.filter(c => c.created > last90).reduce((s, c) => s + c.amount, 0) / 100;
  const mrr = subs.data.reduce((s, sub) => {
    const price = sub.items?.data?.[0]?.price;
    if (!price) return s;
    const amt = price.unit_amount / 100;
    return s + (price.recurring?.interval === 'year' ? amt / 12 : amt);
  }, 0);
  const arr = mrr * 12;
  const totalCustomers = customers.data.length;
  const activeSubscriptions = subs.data.length;

  // Entity counts
  const [betaApps, investors, vdrSessions, priorArt, monAlerts] = await Promise.all([
    base44.asServiceRole.entities.BetaApplication.list().catch(() => []),
    base44.asServiceRole.entities.InvestorRelationship.list().catch(() => []),
    base44.asServiceRole.entities.VDRSession.list().catch(() => []),
    base44.asServiceRole.entities.PriorArtEntry.list().catch(() => []),
    base44.asServiceRole.entities.MonitoringAlert.list().catch(() => []),
  ]);

  const convertedApps = betaApps.filter(a => a.status === 'converted').length;
  const activeVDR = vdrSessions.filter(v => v.status === 'active').length;
  const fundedDeals = investors.filter(i => i.stage === 'Funded').length;
  const dueDiligenceDeals = investors.filter(i => i.stage === 'Due Diligence' || i.stage === 'Term Sheet Received' || i.stage === 'Negotiating').length;

  return Response.json({
    stripe: {
      totalRevenue,
      revenue30d,
      revenue90d,
      mrr,
      arr,
      totalCustomers,
      activeSubscriptions,
      transactionCount: successfulCharges.length,
    },
    entities: {
      betaApplications: betaApps.length,
      convertedMembers: convertedApps,
      conversionRate: betaApps.length > 0 ? (convertedApps / betaApps.length * 100).toFixed(1) : 0,
      activeInvestors: investors.length,
      fundedDeals,
      dueDiligenceDeals,
      activeVDRSessions: activeVDR,
      totalVDRSessions: vdrSessions.length,
      priorArtEntries: priorArt.length,
      monitoringAlerts: monAlerts.length,
    },
    timestamp: new Date().toISOString(),
  });
});