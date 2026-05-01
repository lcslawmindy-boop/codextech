import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { jsPDF } from 'npm:jspdf@4.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { invention_name, ip_strategy, patent_claims, bom, market_positioning, commercialization_plan, valuation, fto_assessment, synergy_analysis, hybrid_concept, market_sectors } = body;

    if (!invention_name) {
      return Response.json({ error: 'Invention name required' }, { status: 400 });
    }

    // Generate PDF dossier
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = margin;

    const addPage = () => {
      doc.addPage();
      yPosition = margin;
    };

    const addText = (text, fontSize = 10, bold = false, color = [0, 0, 0], lineHeight = 5) => {
      if (yPosition + lineHeight > pageHeight - margin) addPage();
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);
      if (bold) doc.setFont(undefined, 'bold');
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * lineHeight + 2;
      if (bold) doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
    };

    // Cover page
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Invention Dossier', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(18);
    doc.text(invention_name, margin, yPosition);
    yPosition += 20;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 30;

    // IP Strategy
    addText('IP STRATEGY', 14, true, [0, 102, 204]);
    addText(`Primary Approach: ${ip_strategy.primary_approach}`, 10);
    addText(`Jurisdiction: ${ip_strategy.recommended_jurisdiction}`, 10);
    addText(`Timeline: ${ip_strategy.filing_timeline}`, 10);
    yPosition += 5;

    // Patent Claims
    addText('PATENT CLAIMS', 14, true, [0, 102, 204]);
    patent_claims.forEach((claim, i) => {
      addText(`Claim ${i + 1}: ${claim}`, 9);
    });
    yPosition += 5;

    // FTO Assessment
    addText('FREEDOM-TO-OPERATE ASSESSMENT', 14, true, [0, 102, 204]);
    addText(`Risk Score: ${fto_assessment.risk_score}/100`, 10, true);
    addText(fto_assessment.summary, 10);
    yPosition += 5;

    // Market & Commercialization
    addText('MARKET & COMMERCIALIZATION', 14, true, [0, 102, 204]);
    addText(`Target Markets: ${market_positioning.target_markets.join(', ')}`, 10);
    addText(`Estimated TAM: ${market_positioning.estimated_tam}`, 10);
    addText(`Phase 1: ${commercialization_plan.phase_1}`, 9);
    addText(`Phase 2: ${commercialization_plan.phase_2}`, 9);
    addText(`Phase 3: ${commercialization_plan.phase_3}`, 9);
    yPosition += 5;

    // BOM
    addText('BILL OF MATERIALS', 14, true, [0, 102, 204]);
    bom.forEach(item => {
      addText(`${item.component} (${item.category}) x${item.quantity}: ${item.estimated_cost}`, 9);
    });
    yPosition += 5;

    // Valuation
    addText('IP VALUATION', 14, true, [0, 102, 204]);
    addText(`Estimated Value: ${valuation.estimated_value_low} - ${valuation.estimated_value_high}`, 10, true);
    addText(`Licensing Potential: ${valuation.licensing_potential}`, 10);

    // Convert PDF to base64
    const pdfOutput = doc.output('dataurlstring');
    const pdfBase64 = pdfOutput.split(',')[1];

    // Build a rich description from concept + synergy analysis
    const richDescription = [
      hybrid_concept || synergy_analysis || fto_assessment.summary,
    ].filter(Boolean).join(' ').substring(0, 950);

    // Save invention to database with PDF reference
    const invention = await base44.asServiceRole.entities.HybridInvention.create({
      hybrid_concept: invention_name,
      mechanism: ip_strategy.primary_approach,
      synergy_score: fto_assessment.risk_score || 85,
      patent_claims: patent_claims.join(' | '),
      market_applications: market_positioning.target_markets.join(', '),
      required_components: bom.map(b => b.component).join(', '),
      ip_valuation: `${valuation.estimated_value_low} - ${valuation.estimated_value_high}`,
      ip_value_low: parseFloat(valuation.estimated_value_low.replace(/[^\d\.MBK$,]/g, '')) || 0,
      ip_value_high: parseFloat(valuation.estimated_value_high.replace(/[^\d\.MBK$,]/g, '')) || 0,
      suggested_next_steps: [commercialization_plan.phase_1, commercialization_plan.phase_2, commercialization_plan.phase_3].filter(Boolean).join(' → '),
      market_sectors: market_sectors || [],
      status: 'draft',
      description: richDescription,
    });

    // Create build video entry
    const buildVideo = await base44.asServiceRole.entities.BuildVideo.create({
      invention_name: invention_name,
      invention_category: market_positioning.target_markets[0] || 'General',
      invention_tagline: ip_strategy.primary_approach,
      steps: bom.map((item, i) => ({
        step_number: i + 1,
        title: `Install ${item.component}`,
        description: `Quantity: ${item.quantity}, Cost: ${item.estimated_cost}`,
        duration_seconds: 120
      })),
      step_count: bom.length
    });

    // Log for admin
    console.log(`[DOSSIER] Generated invention: ${invention_name}, ID: ${invention.id}`);
    console.log(`[DOSSIER] Build video created: ${buildVideo.id}`);
    console.log(`[DOSSIER] PDF size: ${pdfBase64.length} bytes`);

    return Response.json({
      success: true,
      invention_id: invention.id,
      build_video_id: buildVideo.id,
      pdf_data: pdfBase64,
      pdf_filename: `${invention_name.replace(/[^a-zA-Z0-9]/g, '_')}_Dossier.pdf`
    });
  } catch (error) {
    console.error('[DOSSIER ERROR]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});