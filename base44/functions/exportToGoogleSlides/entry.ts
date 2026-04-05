import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, tagline, price, audience, category, problem, beardenSolution, market, feasibility, source, aiExpansion } = body;

  // Get Google Slides OAuth token
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('googleslides');

  // Create a new presentation
  const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: `Zenith Apex — ${title}` }),
  });
  const presentation = await createRes.json();
  const presentationId = presentation.presentationId;
  const firstSlideId = presentation.slides[0].objectId;

  // Helper to make a new slide object
  const makeSlide = (id) => ({ objectId: id, slideLayoutReference: { predefinedLayout: 'BLANK' } });

  // Slide IDs
  const slideIds = ['slide_cover', 'slide_problem', 'slide_solution', 'slide_market', 'slide_feasibility', 'slide_revenue', 'slide_exec'];

  // Build requests
  const requests = [];

  // Delete the default first slide after we create our own
  // Create slides 1–7 (we'll delete the original blank after)
  slideIds.forEach((id, i) => {
    requests.push({ createSlide: { objectId: id, insertionIndex: i, slideLayoutReference: { predefinedLayout: 'BLANK' } } });
  });

  // Delete the original first blank slide
  requests.push({ deleteObject: { objectId: firstSlideId } });

  // Helper: add a text box request
  const addTextBox = (slideId, text, x, y, w, h, fontSize, bold, r, g, b, bgR, bgG, bgB) => {
    const boxId = `${slideId}_box_${Math.random().toString(36).slice(2, 7)}`;
    const reqs = [
      {
        createShape: {
          objectId: boxId,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: slideId,
            size: { width: { magnitude: w, unit: 'PT' }, height: { magnitude: h, unit: 'PT' } },
            transform: { scaleX: 1, scaleY: 1, translateX: x, translateY: y, unit: 'PT' },
          },
        },
      },
      {
        insertText: { objectId: boxId, text: text || '' },
      },
      {
        updateTextStyle: {
          objectId: boxId,
          style: {
            fontSize: { magnitude: fontSize, unit: 'PT' },
            bold: !!bold,
            foregroundColor: { opaqueColor: { rgbColor: { red: r / 255, green: g / 255, blue: b / 255 } } },
          },
          fields: 'fontSize,bold,foregroundColor',
        },
      },
    ];
    if (bgR !== undefined) {
      reqs.push({
        updateShapeProperties: {
          objectId: boxId,
          shapeProperties: {
            shapeBackgroundFill: { solidFill: { color: { rgbColor: { red: bgR / 255, green: bgG / 255, blue: bgB / 255 } } } },
          },
          fields: 'shapeBackgroundFill',
        },
      });
    }
    return reqs;
  };

  // Set slide backgrounds
  const setBg = (slideId, r, g, b) => ({
    updatePageProperties: {
      objectId: slideId,
      pageProperties: { pageBackgroundFill: { solidFill: { color: { rgbColor: { red: r / 255, green: g / 255, blue: b / 255 } } } } },
      fields: 'pageBackgroundFill',
    },
  });

  // Cover slide — dark navy
  requests.push(setBg('slide_cover', 10, 15, 40));
  requests.push(...addTextBox('slide_cover', 'ZENITH APEX RESEARCH DATABASE', 36, 80, 468, 30, 10, false, 160, 160, 200));
  requests.push(...addTextBox('slide_cover', title, 36, 120, 468, 80, 22, true, 255, 255, 255));
  requests.push(...addTextBox('slide_cover', `"${tagline}"`, 36, 210, 468, 40, 12, false, 180, 180, 220));
  requests.push(...addTextBox('slide_cover', price, 36, 260, 468, 30, 14, true, 100, 200, 130));
  requests.push(...addTextBox('slide_cover', `Target: ${audience}  |  ${category}`, 36, 295, 468, 25, 10, false, 130, 130, 170));

  // Problem slide
  requests.push(setBg('slide_problem', 255, 255, 255));
  requests.push(...addTextBox('slide_problem', 'SLIDE 1 — THE PROBLEM', 36, 36, 468, 28, 14, true, 255, 255, 255, 200, 50, 50));
  requests.push(...addTextBox('slide_problem', problem, 36, 80, 468, 140, 11, false, 40, 40, 40));

  // Solution slide
  requests.push(setBg('slide_solution', 255, 255, 255));
  requests.push(...addTextBox('slide_solution', 'SLIDE 2 — THE BEARDEN SOLUTION', 36, 36, 468, 28, 14, true, 255, 255, 255, 40, 90, 200));
  requests.push(...addTextBox('slide_solution', beardenSolution, 36, 80, 468, 150, 11, false, 40, 40, 40));

  // Market slide
  requests.push(setBg('slide_market', 255, 255, 255));
  requests.push(...addTextBox('slide_market', 'SLIDE 3 — MARKET POTENTIAL', 36, 36, 468, 28, 14, true, 255, 255, 255, 30, 150, 80));
  requests.push(...addTextBox('slide_market', market, 36, 80, 468, 100, 11, false, 40, 40, 40));
  requests.push(...addTextBox('slide_market', `Price: ${price}  |  Segment: ${audience}`, 36, 190, 468, 25, 10, false, 30, 120, 60));

  // Feasibility slide
  requests.push(setBg('slide_feasibility', 255, 255, 255));
  requests.push(...addTextBox('slide_feasibility', 'SLIDE 4 — TECHNICAL FEASIBILITY', 36, 36, 468, 28, 14, true, 255, 255, 255, 120, 60, 180));
  requests.push(...addTextBox('slide_feasibility', feasibility, 36, 80, 468, 140, 11, false, 40, 40, 40));
  requests.push(...addTextBox('slide_feasibility', `Source: ${source}`, 36, 230, 468, 30, 9, false, 100, 80, 150));

  // Revenue slide
  const revenueText = [
    '· Direct Sales: ' + price + ' entry price',
    '· Engineering Plans PDF: 80% margin digital product',
    '· Course / Training Bundle: Scalar EM upsell path',
    '· Research Licensing: University labs, defense contractors, biotech',
    '· Consulting / Custom Builds: $250+/hr premium service',
    '· DoD SBIR/STTR grants & alternative energy VC funding',
  ].join('\n');
  requests.push(setBg('slide_revenue', 255, 255, 255));
  requests.push(...addTextBox('slide_revenue', 'SLIDE 5 — REVENUE STREAMS', 36, 36, 468, 28, 14, true, 255, 255, 255, 180, 130, 30));
  requests.push(...addTextBox('slide_revenue', revenueText, 36, 80, 468, 180, 11, false, 40, 40, 40));

  // Executive summary slide
  requests.push(setBg('slide_exec', 255, 255, 255));
  requests.push(...addTextBox('slide_exec', 'SLIDE 6 — AI EXECUTIVE SUMMARY', 36, 36, 468, 28, 14, true, 255, 255, 255, 180, 40, 100));
  requests.push(...addTextBox('slide_exec', aiExpansion || '(Generate the AI Executive Summary and re-export to include it here.)', 36, 80, 468, 180, 11, false, 40, 40, 40));

  // Execute all requests
  await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests }),
  });

  const url = `https://docs.google.com/presentation/d/${presentationId}/edit`;
  return Response.json({ url });
});