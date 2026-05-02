import { jsPDF } from 'npm:jspdf@4.0.0';

Deno.serve(async (req) => {
  try {
    // Create PDF in landscape for better logo display
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set background color
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 297, 'F');

    // Add the logo image - fetch and embed
    const logoUrl = 'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b8b502123_generated_image.png';
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const imageData = 'data:image/png;base64,' + base64;

    // Embed image - centered, large
    doc.addImage(imageData, 'PNG', 30, 30, 150, 150);

    // Add branding text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 255, 128);
    doc.text('ZENITH APEX TECH - Institutional Research Intelligence', 105, 200, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Advanced Engineering & Patent Intelligence Platform', 105, 210, { align: 'center' });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 280, { align: 'center' });

    // Return PDF as blob
    const pdfBuffer = doc.output('arraybuffer');
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=zenith-apex-tech-logo.pdf'
      }
    });
  } catch (error) {
    console.error('PDF Export Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});