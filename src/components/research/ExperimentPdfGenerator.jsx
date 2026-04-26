import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { base44 } from "@/api/base44Client";

export default function ExperimentPdfGenerator({ experiment }) {
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);

    // Fetch all readings
    const readings = await base44.entities.SensorReading.filter(
      { experiment_id: experiment.id },
      "timestamp",
      1000
    );

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = 210;
    const margin = 20;
    const cW = W - margin * 2;
    let y = 0;
    let pageNum = 0;

    const newPage = () => {
      if (pageNum > 0) doc.addPage();
      pageNum++;
      // Header bar
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 0, W, 16, "F");
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("ZENITH APEX RESEARCH PLATFORM — EXPERIMENTAL REPORT", margin, 7);
      doc.text(`Page ${pageNum}`, W - margin, 7, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(150, 150, 150);
      doc.text("CONFIDENTIAL · FOR RESEARCH AND PEER REVIEW USE ONLY", W / 2, 12.5, { align: "center" });
      y = 24;
    };

    const check = (need = 14) => {
      if (y + need > 280) newPage();
    };

    const sectionHeader = (text, color = [0, 0, 0]) => {
      check(14);
      doc.setFillColor(...color);
      doc.rect(margin - 2, y - 3, cW + 4, 11, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(text, margin, y + 4);
      y += 14;
    };

    const bodyText = (text, indent = 0, size = 9) => {
      if (!text) return;
      doc.setFontSize(size);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(20, 20, 20);
      const lines = doc.splitTextToSize(text, cW - indent);
      lines.forEach(l => { check(7); doc.text(l, margin + indent, y); y += 6; });
      y += 2;
    };

    const label = (k, v) => {
      check(8);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(k + ":", margin, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 40, 40);
      const lines = doc.splitTextToSize(v || "—", cW - 48);
      doc.text(lines[0], margin + 46, y);
      y += 6.5;
    };

    // ── Cover page ──────────────────────────────────────────────────────────
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, W, 297, "F");
    pageNum++;

    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, W, 50, "F");

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(160, 160, 160);
    doc.text("ZENITH APEX RESEARCH PLATFORM", margin, 16);
    doc.text("EXPERIMENTAL LABORATORY REPORT", margin, 23);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    const titleLines = doc.splitTextToSize(experiment.title, cW);
    titleLines.forEach((l, i) => doc.text(l, margin, 37 + i * 9));

    y = 60;

    // Status badge
    const statusColors = { planned: [100, 116, 139], active: [34, 197, 94], completed: [6, 182, 212], paused: [245, 158, 11] };
    const sc = statusColors[experiment.status] || [100, 116, 139];
    doc.setFillColor(...sc);
    doc.roundedRect(margin, y, 40, 10, 3, 3, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text((experiment.status || "planned").toUpperCase(), margin + 4, y + 6.5);
    y += 18;

    label("Invention Build Plan", experiment.invention_name);
    label("Sensor Type", experiment.sensor_type?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()));
    label("Measurement Unit", experiment.sensor_unit || "—");
    label("Status", experiment.status || "planned");
    label("Started", experiment.started_at ? format(new Date(experiment.started_at), "PPP p") : "—");
    label("Completed", experiment.completed_at ? format(new Date(experiment.completed_at), "PPP p") : "—");
    label("Total Readings", String(readings.length));
    label("Generated", format(new Date(), "PPP p"));
    if (experiment.tags?.length) label("Tags", experiment.tags.join(", "));
    if (experiment.peer_review_ready) {
      y += 4;
      doc.setFillColor(34, 197, 94, 30);
      doc.rect(margin, y, cW, 12, "F");
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(34, 197, 94);
      doc.text("✓ PEER REVIEW READY — Researcher has marked this experiment for peer review", margin + 3, y + 8);
      y += 16;
    }

    // ── Content pages ────────────────────────────────────────────────────────
    newPage();

    sectionHeader("1. HYPOTHESIS & RESEARCH QUESTION", [10, 10, 10]);
    bodyText(experiment.hypothesis || "No hypothesis recorded.");

    sectionHeader("2. METHODOLOGY & EXPERIMENTAL SETUP", [30, 30, 30]);
    bodyText(experiment.methodology || "No methodology recorded.");

    if (experiment.conclusion) {
      sectionHeader("3. CONCLUSIONS & FINDINGS", [10, 10, 10]);
      bodyText(experiment.conclusion);
    }

    // ── Data section ─────────────────────────────────────────────────────────
    if (readings.length > 0) {
      const channels = [...new Set(readings.map(r => r.channel || "Main"))];

      // Stats per channel
      sectionHeader("4. SENSOR DATA SUMMARY", [20, 20, 20]);

      channels.forEach(ch => {
        const vals = readings.filter(r => (r.channel || "Main") === ch).map(r => r.value);
        if (!vals.length) return;
        const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
        const min = Math.min(...vals);
        const max = Math.max(...vals);
        const std = Math.sqrt(vals.reduce((a, v) => a + (v - avg) ** 2, 0) / vals.length);

        check(26);
        doc.setFillColor(245, 245, 245);
        doc.rect(margin - 2, y - 2, cW + 4, 22, "F");
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(`Channel: ${ch}`, margin, y + 5);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(50, 50, 50);
        doc.text(`N = ${vals.length}  |  Min = ${min.toFixed(4)}  |  Max = ${max.toFixed(4)}  |  Mean = ${avg.toFixed(4)}  |  σ = ${std.toFixed(4)}  |  Unit: ${experiment.sensor_unit || "—"}`, margin, y + 12);
        y += 26;
      });

      // Raw data table (last 100 readings)
      sectionHeader("5. RAW SENSOR DATA LOG (last 100 readings)", [20, 20, 20]);
      check(14);

      // Table header
      doc.setFillColor(30, 30, 30);
      doc.rect(margin - 2, y - 3, cW + 4, 11, "F");
      const cols = [margin, margin + 40, margin + 65, margin + 100, margin + 115];
      ["Timestamp", "Channel", "Value", "Unit", "Step / Notes"].forEach((h, i) => {
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(h, cols[i], y + 4);
      });
      y += 13;

      const sample = readings.slice(-100);
      sample.forEach((r, idx) => {
        check(9);
        if (idx % 2 === 0) { doc.setFillColor(250, 250, 250); doc.rect(margin - 2, y - 3, cW + 4, 8, "F"); }
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 30, 30);
        doc.text(format(new Date(r.timestamp), "MM/dd HH:mm:ss"), cols[0], y + 2);
        doc.text(r.channel || "Main", cols[1], y + 2);
        doc.setFont("helvetica", "bold");
        doc.text(String(r.value), cols[2], y + 2);
        doc.setFont("helvetica", "normal");
        doc.text(r.unit || "—", cols[3], y + 2);
        const note = [r.step_label, r.notes].filter(Boolean).join(" · ");
        doc.text(note.slice(0, 38), cols[4], y + 2);
        y += 8;
      });

      if (readings.length > 100) {
        y += 4;
        bodyText(`Note: ${readings.length - 100} additional readings omitted from this table. All data is stored in the platform database.`, 0, 7.5);
      }
    }

    // ── Disclaimer ──────────────────────────────────────────────────────────
    check(40);
    y += 6;
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.rect(margin - 2, y - 2, cW + 4, 36, "D");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("RESEARCH DISCLAIMER", margin, y + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(50, 50, 50);
    const disclaimer = "This experimental report is generated for research and educational purposes only. No device, protocol, or finding described herein has been approved by the FDA, FCC, or any regulatory authority for medical, therapeutic, commercial, or consumer use. Data is self-reported by the researcher and has not been independently verified. Interpret all results in the context of the applicable build plan disclaimers. Zenith Apex Research Platform assumes no liability for interpretation or use of experimental findings.";
    const dLines = doc.splitTextToSize(disclaimer, cW - 4);
    dLines.forEach((l, i) => doc.text(l, margin, y + 11 + i * 4.5));
    y += 42;

    // Footer on all pages
    const total = doc.getNumberOfPages();
    for (let p = 1; p <= total; p++) {
      doc.setPage(p);
      doc.setFillColor(240, 240, 240);
      doc.rect(0, 287, W, 10, "F");
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Zenith Apex Research Platform · Experiment: ${experiment.title} · Generated ${format(new Date(), "PPP")}`, margin, 293);
      doc.text(`${p} / ${total}`, W - margin, 293, { align: "right" });
    }

    const fname = experiment.title.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40);
    doc.save(`ZenithApex_Experiment_${fname}.pdf`);
    setGenerating(false);
  };

  return (
    <button onClick={generate} disabled={generating}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-bold transition-all">
      {generating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
      {generating ? "Generating PDF…" : "Export Report PDF"}
    </button>
  );
}