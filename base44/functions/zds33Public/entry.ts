import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const PATHWAYS = ['ip_broker','licensing','manufacturing_partnership','co_development','research_partnership','strategic_partnership','investment_funding'];
const CONTROLLED = ['confidential', 'restricted'];

// Deliberately public: returns ONLY admin-approved public_* fields of approved_public assets.
function shape(a, docs) {
  let stage = a.development_stage || 'concept';
  const evidence = !!(a.stage_evidence && a.stage_evidence.trim());
  if ((stage === 'prototype' || stage === 'validation') && !evidence) stage = 'design';
  return {
    id: a.id,
    tech_code: a.tech_code || '',
    name: a.asset_name,
    domain_tags: a.domain_tags || [],
    category: a.technology_category || 'other',
    subsystem: a.subsystem || '',
    stage,
    stage_evidence_on_file: evidence,
    readiness: a.commercialization_readiness || 'not_assessed',
    pathways: a.partnership_pathways || [],
    summary: a.public_summary || '',
    problem: a.public_problem || '',
    solution: a.public_solution || '',
    capabilities: a.public_capabilities || [],
    applications: a.public_applications || [],
    gallery: a.public_gallery || [],
    related_ids: a.related_asset_ids || [],
    ip: {
      asset_type: a.asset_type,
      filing_status: a.filing_status || 'not_filed',
      research_records: (a.research_document_ids || []).length,
      evidence_claims: (a.evidence_claim_ids || []).length,
      has_invention_record: !!a.invention_candidate_id,
    },
    documents: docs.map((d) => {
      const controlled = CONTROLLED.includes(d.access_level || 'confidential');
      return {
        title: controlled ? `Controlled document (${d.access_level || 'confidential'})` : d.artifact_name,
        type: d.artifact_type,
        status: d.status,
        access_level: d.access_level || 'confidential',
      };
    }),
  };
}

async function loadApproved(base44) {
  const { items } = await base44.asServiceRole.entities.IPAsset.filter(
    { showcase_status: 'approved_public', status: 'active' }, { sort: '-updated_date', limit: 200 });
  const ok = items.filter((a) => !(a.domain_tags || []).includes('DEFENSE_SECURITY') || a.defense_public_review_confirmed);
  const ids = ok.map((a) => a.id);
  let docs = [];
  if (ids.length) {
    const r = await base44.asServiceRole.entities.EngineeringArtifact.filter({ ip_asset_id: { $in: ids } }, { limit: 500 });
    docs = r.items;
  }
  return { ok, docs };
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { action } = body;
    const { ok, docs } = await loadApproved(base44);
    const shapeOne = (a) => shape(a, docs.filter((d) => d.ip_asset_id === a.id));

    if (action === 'list') {
      return Response.json({ items: ok.map(shapeOne) });
    }
    if (action === 'get') {
      const a = ok.find((x) => x.id === body.id);
      if (!a) return Response.json({ error: 'Not found' }, { status: 404 });
      return Response.json({ item: shapeOne(a) });
    }
    if (action === 'inquiry') {
      const name = String(body.name || '').trim().slice(0, 200);
      const email = String(body.email || '').trim().slice(0, 200);
      const organization = String(body.organization || '').trim().slice(0, 200);
      const message = String(body.message || '').trim().slice(0, 3000);
      if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        return Response.json({ error: 'A name and valid email are required.' }, { status: 400 });
      }
      if (!PATHWAYS.includes(body.pathway)) return Response.json({ error: 'Invalid pathway.' }, { status: 400 });
      const a = ok.find((x) => x.id === body.ip_asset_id);
      if (!a) return Response.json({ error: 'Technology not available.' }, { status: 404 });
      const rec = await base44.asServiceRole.entities.PartnershipInquiry.create({
        ip_asset_id: a.id, ip_asset_name: a.asset_name, name, email, organization,
        pathway: body.pathway, message, status: 'new',
      });
      await base44.asServiceRole.entities.AuditEvent.create({
        entity_type: 'ip_asset', entity_id: a.id, event_type: 'other',
        event_description: `Partnership inquiry received (${body.pathway}) for ${a.asset_name}`,
        actor_email: email,
      });
      return Response.json({ success: true, id: rec.id });
    }
    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}