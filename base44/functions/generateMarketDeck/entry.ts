import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googleslides');

    // Slide content derived from Bearden research insights
    const slides = [
      {
        title: "Bearden Scalar EM — Market Analysis",
        subtitle: "Commercial Opportunities in Non-Conventional Electromagnetics\nConfidential · April 2026",
        type: "title",
      },
      {
        title: "Executive Summary",
        bullets: [
          "Lt. Col. Bearden's scalar EM frameworks represent a largely unexploited IP landscape",
          "5 primary commercial domains identified: Energy, Biotech, Defense, Education, Consulting",
          "Estimated addressable markets range from $2B (education) to $400B+ (energy transition)",
          "Primary risk: peer validation gap — mitigated by licensing and staged R&D approach",
          "Recommended entry: digital education + consulting to generate near-term cash flow",
        ],
        type: "bullets",
      },
      {
        title: "Market Landscape",
        bullets: [
          "🌍 Global Free Energy / Alternative Physics Education: ~$2.1B TAM, growing 18% YoY",
          "⚡ Advanced EM / Scalar Technology Research Licensing: ~$800M niche, largely untapped",
          "🧬 Bioelectromagnetics & EM Therapy Devices: ~$12B market (2024), 22% CAGR",
          "🛡 Non-Lethal Weapons / EM Countermeasures (DoD): classified, est. $15B+ annually",
          "🎓 Specialized Physics Curriculum & Online Courses: $4.5B global e-learning TAM",
        ],
        type: "bullets",
      },
      {
        title: "Competitive Positioning",
        bullets: [
          "Unique Asset: sole comprehensive Bearden concept network — 40+ interconnected nodes",
          "No direct competitor has structured this IP into a navigable commercial platform",
          "Adjacent players: Tom Bearden Foundation (archival only), MEG replication groups",
          "Moat: proprietary analytical framework + NDA-gated access + first-mover structuring",
          "Differentiation: bridge from theoretical physics to investor-ready product roadmaps",
        ],
        type: "bullets",
      },
      {
        title: "Revenue Model",
        bullets: [
          "Tier 1 — Digital Products: Courses ($497–$997) + PDF reports ($97–$197) · Est. $250K/yr",
          "Tier 2 — Hardware Kits: VPO circuits, MEG prototypes ($299–$1,499) · Est. $180K/yr",
          "Tier 3 — Consulting: Research retainers + custom knowledge graphs ($5K–$25K/engagement)",
          "Tier 4 — Licensing: Patent applications on platform-original frameworks · Long-term upside",
          "Tier 5 — Investor Syndication: Co-development deals with defense / biotech VCs",
        ],
        type: "bullets",
      },
      {
        title: "Go-To-Market Strategy",
        bullets: [
          "Phase 1 (0–6 mo): Launch 2 flagship courses + PDF library · Target: alternative physics community",
          "Phase 2 (6–18 mo): Hardware kit store + consulting practice · Target: independent researchers",
          "Phase 3 (18–36 mo): SBIR/STTR grant applications + university licensing outreach",
          "Phase 4 (36+ mo): Seek Series A from longevity/biotech VCs · DoD DARPA program alignment",
          "Distribution: direct (platform), YouTube/podcast thought leadership, defense contractor BD",
        ],
        type: "bullets",
      },
      {
        title: "Key Research Gaps & Risks",
        bullets: [
          "⚠ Validation Gap: Scalar EM lacks mainstream peer review — primary commercial risk",
          "⚠ Regulatory: EM therapy devices require FDA 510(k) clearance prior to sale",
          "⚠ IP Complexity: Bearden's estate / existing foundations may assert overlapping rights",
          "✅ Mitigation: position as 'analytical platform' + licensing model, not direct inventor claims",
          "✅ Opportunity: 12 high-priority research nodes identified as underconnected in concept graph",
        ],
        type: "bullets",
      },
      {
        title: "Next Steps",
        bullets: [
          "1. Finalize NDA-gated platform and onboard first 50 paid subscribers",
          "2. Produce 'Scalar EM Foundations' flagship course (est. 8 weeks production)",
          "3. File provisional patents on 3 platform-original analytical frameworks",
          "4. Engage 2–3 biotech/defense consultants for technical validation advisory board",
          "5. Schedule pitch meetings with 5 target investors using Pitch Builder decks",
        ],
        type: "bullets",
      },
    ];

    // 1. Create presentation
    const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'Bearden Research — Market Analysis Deck' }),
    });
    if (!createRes.ok) {
      const err = await createRes.text();
      throw new Error(`Failed to create presentation: ${err}`);
    }
    const presentation = await createRes.json();
    const presentationId = presentation.presentationId;
    const existingSlideId = presentation.slides?.[0]?.objectId;

    // 2. Build batch requests to populate slides
    const requests = [];

    // Delete the default blank slide after we add ours
    // First, add all slides, then delete the original blank one
    const slideObjectIds = [];

    slides.forEach((slide, idx) => {
      const slideId = `slide_${idx}`;
      slideObjectIds.push(slideId);

      requests.push({
        createSlide: {
          objectId: slideId,
          insertionIndex: idx,
          slideLayoutReference: { predefinedLayout: slide.type === 'title' ? 'TITLE' : 'TITLE_AND_BODY' },
        },
      });
    });

    // Delete original blank slide
    if (existingSlideId) {
      requests.push({ deleteObject: { objectId: existingSlideId } });
    }

    // Send first batch (create slides + delete blank)
    const batch1Res = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    });
    if (!batch1Res.ok) {
      const err = await batch1Res.text();
      throw new Error(`Batch 1 failed: ${err}`);
    }

    // 3. Fetch updated presentation to get actual element IDs
    const getRes = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    const updatedPres = await getRes.json();

    // 4. Insert text into each slide
    const textRequests = [];
    updatedPres.slides.forEach((slide, idx) => {
      if (idx >= slides.length) return;
      const slideData = slides[idx];
      const elements = slide.pageElements || [];

      const titleEl = elements.find(el =>
        el.shape?.placeholder?.type === 'CENTERED_TITLE' ||
        el.shape?.placeholder?.type === 'TITLE'
      );
      const bodyEl = elements.find(el =>
        el.shape?.placeholder?.type === 'BODY' ||
        el.shape?.placeholder?.type === 'SUBTITLE'
      );

      if (titleEl) {
        textRequests.push({
          insertText: {
            objectId: titleEl.objectId,
            text: slideData.title,
            insertionIndex: 0,
          },
        });
      }

      if (bodyEl) {
        const bodyText = slideData.subtitle
          ? slideData.subtitle
          : (slideData.bullets || []).join('\n');
        if (bodyText) {
          textRequests.push({
            insertText: {
              objectId: bodyEl.objectId,
              text: bodyText,
              insertionIndex: 0,
            },
          });
        }
      }
    });

    if (textRequests.length > 0) {
      const batch2Res = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests: textRequests }),
      });
      if (!batch2Res.ok) {
        const err = await batch2Res.text();
        throw new Error(`Batch 2 (text) failed: ${err}`);
      }
    }

    const presentationUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`;
    return Response.json({ presentationId, url: presentationUrl, slideCount: slides.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});