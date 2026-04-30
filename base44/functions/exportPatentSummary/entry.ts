import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { jsPDF } from 'npm:jspdf@4.0.0';

// Buildability score → human label
function buildabilityLabel(score) {
  if (score <= 20) return { label: "High", color: [34, 197, 94] };
  if (score <= 40) return { label: "Moderate", color: [234, 179, 8] };
  if (score <= 65) return { label: "Challenging", color: [249, 115, 22] };
  return { label: "Experimental / Unverified", color: [239, 68, 68] };
}

function buildabilityNarrative(entry) {
  const score = entry.risk_score || 50;
  const outcome = entry.outcome || "Unknown";

  if (score <= 20) {
    return `This invention has a well-documented physical basis with granted patents and reproducible results. Core components are commercially available and the operating principles are well-understood. Buildability potential is HIGH — a competent engineer with appropriate lab equipment can replicate the documented design.`;
  }
  if (score <= 40) {
    return `This invention has partial documentation and some independent verification. Key components are available but the assembly requires careful calibration. Buildability is MODERATE — significant engineering effort is required and results may vary from claimed performance. ${outcome === "Patent Granted" ? "The granted patent provides detailed enabling disclosure." : ""}`;
  }
  if (score <= 65) {
    return `This invention is technically complex with limited independent replication data. Specialized components, measurement equipment, and institutional lab access are likely required. Buildability is CHALLENGING — advanced engineering teams in institutional settings are the target audience. Claims should be treated as research hypotheses pending certified independent verification.`;
  }
  return `This invention has not been independently verified and is primarily theoretical or anecdotal in its current documentation state. Buildability is EXPERIMENTAL — no reliable replication protocol exists. Treat all outputs as exploratory research. ${entry.failure_reasons ? "Key failure reason on record: " + entry.failure_reasons : ""}`;
}

function wrapText(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(text, maxWidth);
  for (const line of lines) {
    doc.text(line, x, y);
    y += lineHeight;
  }
  return y;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Accept both authenticated and public requests (public app)
    const body = await req.json();
    const { patent } = body;

    if (!patent || !patent.title) {
      return Response.json({ error: "Missing patent data" }, { status: 400 });
    }

    console.log(`Generating Executive Summary PDF for: ${patent.title}`);

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
    const pageW = 216;
    const pageH = 279;
    const mL = 20;
    const mR = 196;
    const textW = mR - mL;
    const bodyBottom = pageH - 18;

    let pageNum = 1;

    const newPage = () => {
      if (pageNum > 1) doc.addPage();
      // Dark header bar
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageW, 14, 'F');
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("C.O.D.E.X.T.E.C.H. RESEARCH INTELLIGENCE — PATENT EXECUTIVE SUMMARY", mL, 9);
      doc.text(`Page ${pageNum}`, mR, 9, { align: "right" });

      // Footer
      doc.setDrawColor(51, 65, 85);
      doc.setLineWidth(0.3);
      doc.line(mL, pageH - 12, mR, pageH - 12);
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(6.5);
      doc.text("RESEARCH USE ONLY — NOT LEGAL ADVICE — SOURCE: C.O.D.E.X.T.E.C.H. PRIOR ART ARCHIVE", mL, pageH - 7);
      doc.text(`Page ${pageNum}`, mR, pageH - 7, { align: "right" });

      pageNum++;
      return 22;
    };

    const checkY = (y, needed = 18) => {
      if (y + needed > bodyBottom) {
        return newPage();
      }
      return y;
    };

    const printParagraph = (text, y, fontSize = 9, fontStyle = "normal", color = [30, 41, 59], indent = 0) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", fontStyle);
      doc.setTextColor(color[0], color[1], color[2]);
      const lines = doc.splitTextToSize(text, textW - indent);
      const lh = fontSize * 0.45;
      for (const line of lines) {
        y = checkY(y, lh + 2);
        doc.text(line, mL + indent, y);
        y += lh;
      }
      return y;
    };

    const sectionHeader = (label, y, accentColor = [6, 182, 212]) => {
      y = checkY(y, 14);
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.rect(mL, y, 3, 8, 'F');
      doc.setFillColor(241, 245, 249);
      doc.rect(mL + 3, y, textW - 3, 8, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.text(label.toUpperCase(), mL + 7, y + 5.5);
      return y + 12;
    };

    // ── COVER PAGE ─────────────────────────────────────────────────────────
    let y = newPage();

    // Large accent block
    doc.setFillColor(6, 182, 212);
    doc.rect(mL, y, textW, 1.5, 'F');
    y += 5;

    // Badge
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(mL, y, 55, 8, 1, 1, 'F');
    doc.setTextColor(6, 182, 212);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("PATENT EXECUTIVE SUMMARY", mL + 3, y + 5.2);
    y += 13;

    // Title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(patent.title, textW);
    doc.text(titleLines, mL, y);
    y += titleLines.length * 7 + 4;

    // Inventor + Year row
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(`Inventor: ${patent.inventor || "Unknown"}   ·   Year: ${patent.year || "N/A"}   ·   Category: ${patent.category || "N/A"}`, mL, y);
    y += 7;

    if (patent.patent_numbers) {
      doc.setTextColor(6, 182, 212);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(`Patent Ref: ${patent.patent_numbers}`, mL, y);
      y += 6;
    }

    doc.setFillColor(6, 182, 212);
    doc.rect(mL, y, textW, 0.5, 'F');
    y += 8;

    // Outcome + Risk row
    const { label: buildLabel, color: buildColor } = buildabilityLabel(patent.risk_score || 50);
    const outcomeColors = {
      "Patent Granted": [59, 130, 246],
      "Success (demonstrated)": [34, 197, 94],
      "Suppressed": [239, 68, 68],
      "Partial Success": [234, 179, 8],
      "Unknown": [139, 92, 246],
      "Failed": [107, 114, 128],
    };
    const oc = outcomeColors[patent.outcome] || [107, 114, 128];

    // Outcome pill
    doc.setFillColor(oc[0], oc[1], oc[2]);
    doc.roundedRect(mL, y, 52, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text(`OUTCOME: ${(patent.outcome || "UNKNOWN").toUpperCase()}`, mL + 3, y + 5.3);

    // Buildability pill
    doc.setFillColor(buildColor[0], buildColor[1], buildColor[2]);
    doc.roundedRect(mL + 56, y, 58, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(`BUILDABILITY: ${buildLabel.toUpperCase()}`, mL + 59, y + 5.3);

    // Risk score pill
    const riskHue = Math.min(patent.risk_score || 50, 100);
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(mL + 118, y, 40, 8, 2, 2, 'F');
    doc.setTextColor(148, 163, 184);
    doc.text(`RISK SCORE: ${riskHue}/100`, mL + 121, y + 5.3);
    y += 14;

    // Description
    y = sectionHeader("Overview", y);
    y = printParagraph(patent.description || "No description available.", y + 1, 9.5, "normal", [30, 41, 59]);
    y += 6;

    // Source
    if (patent.source_document) {
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 116, 139);
      y = checkY(y, 8);
      const srcLines = doc.splitTextToSize(`Source: ${patent.source_document}`, textW);
      doc.text(srcLines, mL, y);
      y += srcLines.length * 3.5 + 4;
    }

    // ── CLAIMS ────────────────────────────────────────────────────────────
    y = checkY(y, 20);
    y = sectionHeader("Key Claims — Simplified Breakdown", y, [139, 92, 246]);
    y += 2;

    const claims = patent.key_claims || [];
    if (claims.length === 0) {
      y = printParagraph("No key claims documented for this entry.", y, 9, "italic", [100, 116, 139]);
    } else {
      claims.forEach((claim, i) => {
        y = checkY(y, 12);
        // Number circle
        doc.setFillColor(139, 92, 246);
        doc.circle(mL + 3, y - 1.5, 3, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6.5);
        doc.setFont("helvetica", "bold");
        doc.text(String(i + 1), mL + 3, y - 0.5, { align: "center" });

        // Claim text
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 41, 59);
        const clLines = doc.splitTextToSize(claim, textW - 10);
        clLines.forEach((line, j) => {
          y = checkY(y, 5);
          doc.text(line, mL + 9, y + (j === 0 ? 0 : -1));
          if (j < clLines.length - 1) y += 4.5;
        });
        y += 7;
      });
    }
    y += 4;

    // ── PRIOR ART ─────────────────────────────────────────────────────────
    y = checkY(y, 20);
    y = sectionHeader("Prior Art References & Patent Context", y, [249, 115, 22]);
    y += 2;

    if (patent.patent_numbers) {
      y = checkY(y, 10);
      doc.setFillColor(255, 237, 213);
      doc.roundedRect(mL, y, textW, 9, 1.5, 1.5, 'F');
      doc.setTextColor(154, 52, 18);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(`Patent Numbers on Record: ${patent.patent_numbers}`, mL + 4, y + 6);
      y += 14;
    }

    if (patent.rejection_grounds) {
      y = checkY(y, 10);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("USPTO Rejection Grounds / Patent Status:", mL, y);
      y += 5;
      y = printParagraph(patent.rejection_grounds, y, 9, "normal", [71, 85, 105], 4);
      y += 4;
    }

    if (patent.failure_reasons) {
      y = checkY(y, 10);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Documented Failure Reasons / Historical Outcome:", mL, y);
      y += 5;
      y = printParagraph(patent.failure_reasons, y, 9, "normal", [71, 85, 105], 4);
      y += 4;
    }

    // Tags as prior art keywords
    if (patent.tags && patent.tags.length > 0) {
      y = checkY(y, 12);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Search Keywords for Prior Art Research:", mL, y);
      y += 5;

      let tagX = mL;
      patent.tags.forEach((tag) => {
        const tagW = doc.getTextWidth(tag) + 6;
        if (tagX + tagW > mR) {
          tagX = mL;
          y += 7;
          y = checkY(y, 8);
        }
        doc.setFillColor(241, 245, 249);
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.3);
        doc.roundedRect(tagX, y - 4, tagW, 6, 1, 1, 'FD');
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text(tag, tagX + 3, y);
        tagX += tagW + 3;
      });
      y += 10;
    }

    // ── BUILDABILITY ──────────────────────────────────────────────────────
    y = checkY(y, 20);
    y = sectionHeader("Technical Buildability Assessment", y, buildColor);
    y += 2;

    // Score bar
    y = checkY(y, 16);
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(mL, y, textW, 6, 1, 1, 'F');
    const barFill = ((patent.risk_score || 50) / 100) * textW;
    doc.setFillColor(buildColor[0], buildColor[1], buildColor[2]);
    doc.roundedRect(mL, y, barFill, 6, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(`Complexity Score: ${patent.risk_score || "N/A"}/100  (Higher = More Experimental)`, mL + 3, y + 4.2);
    y += 10;

    // Verdict badge
    doc.setFillColor(buildColor[0], buildColor[1], buildColor[2]);
    doc.roundedRect(mL, y, 50, 9, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`VERDICT: ${buildLabel.toUpperCase()}`, mL + 4, y + 6);
    y += 14;

    y = printParagraph(buildabilityNarrative(patent), y, 9.5, "normal", [30, 41, 59]);
    y += 6;

    // Practical guidance table
    const guidance = [
      ["Skill Level Required", patent.risk_score <= 30 ? "Intermediate Engineer" : patent.risk_score <= 60 ? "Advanced / Institutional" : "Expert Research Team Only"],
      ["Lab Equipment Needed", patent.risk_score <= 30 ? "Standard electronics lab" : patent.risk_score <= 60 ? "Specialized EM lab + measurement suite" : "Institutional-grade with independent verification capability"],
      ["Independent Verification", patent.risk_score <= 40 ? "Prior replication on record" : "Required before claiming results"],
      ["Regulatory Considerations", (patent.category === "Bioelectromagnetics") ? "FDA 510(k) or PMA pathway likely required for any human use" : "Standard electronics / EM regulations apply"],
      ["Commercial Readiness", patent.outcome === "Patent Granted" ? "IP protected — commercialization pathway available" : patent.outcome === "Success (demonstrated)" ? "Demonstrated — patent strategy recommended" : "Pre-commercial — prototype + IP filing needed first"],
    ];

    y = checkY(y, guidance.length * 9 + 6);
    guidance.forEach(([k, v], i) => {
      const rowY = y + i * 9;
      doc.setFillColor(i % 2 === 0 ? 248 : 241, i % 2 === 0 ? 250 : 245, i % 2 === 0 ? 252 : 249);
      doc.rect(mL, rowY, textW, 8, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.2);
      doc.rect(mL, rowY, textW, 8, 'S');

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(51, 65, 85);
      doc.text(k, mL + 3, rowY + 5.2);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      const valLines = doc.splitTextToSize(v, textW - 75);
      doc.text(valLines[0] || v, mL + 72, rowY + 5.2);
    });
    y += guidance.length * 9 + 8;

    // ── DISCLAIMER ────────────────────────────────────────────────────────
    y = checkY(y, 24);
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.4);
    doc.roundedRect(mL, y, textW, 20, 2, 2, 'FD');
    doc.setTextColor(146, 64, 14);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text("RESEARCH DISCLAIMER", mL + 4, y + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    const disclaimer = "This executive summary is compiled from patent filings, academic publications, and documented research archives for educational and research purposes only. It does not constitute legal advice, investment advice, or a guarantee of functionality. All technical claims should be independently verified before any engineering application. Source: C.O.D.E.X.T.E.C.H. Research Platform.";
    const dLines = doc.splitTextToSize(disclaimer, textW - 8);
    doc.text(dLines, mL + 4, y + 10);

    const pdfBytes = doc.output("arraybuffer");
    const safeFilename = (patent.title || "patent-summary").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);

    console.log(`Executive Summary PDF generated: ${pdfBytes.byteLength} bytes for "${patent.title}"`);

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFilename}-executive-summary.pdf"`,
      },
    });

  } catch (error) {
    console.error("exportPatentSummary error:", error.message, error.stack);
    return Response.json({ error: error.message }, { status: 500 });
  }
});