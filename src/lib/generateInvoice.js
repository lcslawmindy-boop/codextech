import { jsPDF } from "jspdf";
import { base44 } from "@/api/base44Client";

const PLAN_DETAILS = {
  "Research Membership ($29/mo)": {
    price: 29,
    type: "Subscription",
    interval: "Monthly",
    description: "Full platform access — all tools, simulations, patent generators, course library, and new research modules monthly.",
    lineItems: [
      { desc: "Research Membership — Monthly Subscription", qty: 1, unit: 29, total: 29 },
    ],
  },
  "Invention Plans Bundle ($197)": {
    price: 197,
    type: "One-Time",
    interval: null,
    description: "Complete PDF library of 5 invention build plans with full BOMs, assembly guides, and theoretical basis.",
    lineItems: [
      { desc: "Invention Build Plans Bundle (5 devices)", qty: 1, unit: 197, total: 197 },
    ],
  },
  "Complete Course Library ($497)": {
    price: 497,
    type: "One-Time",
    interval: null,
    description: "Lifetime access to all 10 courses covering scalar EM, USPTO patent strategy, bioelectromagnetics, and more.",
    lineItems: [
      { desc: "Complete Course Library — Lifetime Access (10 courses)", qty: 1, unit: 497, total: 497 },
    ],
  },
  "Membership + Plans ($226)": {
    price: 226,
    type: "Bundle",
    interval: "Monthly membership + one-time plans",
    description: "Research Membership plus Invention Build Plans Bundle.",
    lineItems: [
      { desc: "Research Membership — Monthly Subscription", qty: 1, unit: 29, total: 29 },
      { desc: "Invention Build Plans Bundle (5 devices)", qty: 1, unit: 197, total: 197 },
    ],
  },
};

function zeroPad(n, len = 2) {
  return String(n).padStart(len, "0");
}

function generateInvoiceNumber(applicantId) {
  const now = new Date();
  return `ZA-${now.getFullYear()}${zeroPad(now.getMonth() + 1)}${zeroPad(now.getDate())}-${applicantId.slice(-6).toUpperCase()}`;
}

function buildInvoicePDF(app, planKey, invoiceNumber) {
  const plan = PLAN_DETAILS[planKey];
  if (!plan) throw new Error("Unknown plan: " + planKey);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 20;
  const cW = pageW - margin * 2;
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  // ── HEADER BAND ──
  doc.setFillColor(8, 14, 45);
  doc.rect(0, 0, pageW, 42, "F");
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 0, pageW, 2, "F");

  // Logo hexagon
  const hx = margin, hy = 8;
  doc.setFillColor(12, 24, 80);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.8);
  // Hexagon approximated as polygon
  const pts = [[hx+9, hy],[hx+18,hy+5],[hx+18,hy+15],[hx+9,hy+20],[hx,hy+15],[hx,hy+5]];
  doc.lines(pts.map((p,i) => i===0?[0,0]:[p[0]-pts[i-1][0],p[1]-pts[i-1][1]]).slice(1), pts[0][0], pts[0][1], [1,1], "FD", true);
  doc.setFontSize(7); doc.setFont("helvetica","bold"); doc.setTextColor(212,175,55);
  doc.text("ZA", hx+5.5, hy+12);

  doc.setFontSize(14); doc.setFont("helvetica","bold"); doc.setTextColor(255,255,255);
  doc.text("ZENITH APEX RESEARCH", margin+24, hy+8);
  doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.setTextColor(160,160,200);
  doc.text("Advanced Research · Intellectual Property · Scalar EM Technology", margin+24, hy+14);
  doc.setFontSize(20); doc.setFont("helvetica","bold"); doc.setTextColor(212,175,55);
  doc.text("INVOICE", pageW-margin, hy+12, { align: "right" });
  doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.setTextColor(160,160,200);
  doc.text("PAYMENT RECEIPT", pageW-margin, hy+19, { align: "right" });

  let y = 54;

  // ── INVOICE META ──
  doc.setFillColor(20, 25, 60);
  doc.rect(margin, y, cW, 28, "F");

  doc.setFontSize(8.5); doc.setFont("helvetica","bold"); doc.setTextColor(212,175,55);
  doc.text("INVOICE #", margin+4, y+7);
  doc.setFont("helvetica","normal"); doc.setTextColor(255,255,255);
  doc.text(invoiceNumber, margin+32, y+7);

  doc.setFont("helvetica","bold"); doc.setTextColor(212,175,55);
  doc.text("DATE", margin+4, y+14);
  doc.setFont("helvetica","normal"); doc.setTextColor(255,255,255);
  doc.text(dateStr, margin+32, y+14);

  doc.setFont("helvetica","bold"); doc.setTextColor(212,175,55);
  doc.text("TYPE", margin+4, y+21);
  doc.setFont("helvetica","normal"); doc.setTextColor(255,255,255);
  doc.text(`${plan.type}${plan.interval ? " · " + plan.interval : ""}`, margin+32, y+21);

  // Status badge
  doc.setFillColor(30, 130, 80);
  doc.roundedRect(pageW-margin-35, y+4, 31, 9, 2, 2, "F");
  doc.setFontSize(8); doc.setFont("helvetica","bold"); doc.setTextColor(255,255,255);
  doc.text("✓ PAID", pageW-margin-19.5, y+10, { align: "center" });

  y += 36;

  // ── BILL TO ──
  doc.setFontSize(8); doc.setFont("helvetica","bold"); doc.setTextColor(120,120,160);
  doc.text("BILL TO", margin, y);
  doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.setTextColor(20,20,40);
  doc.text(app.full_name, margin, y+7);
  doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(80,80,120);
  doc.text(app.email, margin, y+13);
  doc.text(`Background: ${app.background || "—"}`, margin, y+19);

  doc.setFontSize(8); doc.setFont("helvetica","bold"); doc.setTextColor(120,120,160);
  doc.text("FROM", pageW-margin-60, y);
  doc.setFontSize(9); doc.setFont("helvetica","bold"); doc.setTextColor(20,20,40);
  doc.text("Zenith Apex Research Portfolio", pageW-margin, y+7, { align: "right" });
  doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.setTextColor(80,80,120);
  doc.text("research@zenithapex.com", pageW-margin, y+13, { align: "right" });
  doc.text("NDA-Gated Research Platform", pageW-margin, y+19, { align: "right" });

  y += 30;

  // ── LINE ITEMS TABLE ──
  doc.setFillColor(8, 14, 45);
  doc.rect(margin, y, cW, 10, "F");
  doc.setFontSize(8); doc.setFont("helvetica","bold"); doc.setTextColor(212,175,55);
  doc.text("DESCRIPTION", margin+3, y+6.5);
  doc.text("QTY", margin+110, y+6.5);
  doc.text("UNIT PRICE", margin+125, y+6.5);
  doc.text("TOTAL", pageW-margin-3, y+6.5, { align: "right" });
  y += 14;

  plan.lineItems.forEach((item, i) => {
    if (i % 2 === 1) { doc.setFillColor(245, 245, 252); doc.rect(margin, y-4, cW, 10, "F"); }
    doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(30,30,60);
    doc.text(item.desc, margin+3, y+2.5);
    doc.text(String(item.qty), margin+112, y+2.5);
    doc.setFont("helvetica","normal");
    doc.text(`$${item.unit.toFixed(2)}`, margin+128, y+2.5);
    doc.setFont("helvetica","bold");
    doc.text(`$${item.total.toFixed(2)}`, pageW-margin-3, y+2.5, { align: "right" });
    y += 10;
  });

  // ── TOTALS ──
  y += 4;
  doc.setDrawColor(200,200,220); doc.line(margin, y, pageW-margin, y); y += 5;

  const subtotal = plan.lineItems.reduce((s, i) => s + i.total, 0);
  [[`Subtotal`, subtotal], ["Tax (0%)", 0], null, [`TOTAL`, subtotal]].forEach(row => {
    if (!row) { y += 2; return; }
    const [label, val] = row;
    const isBold = label === "TOTAL";
    if (isBold) {
      doc.setFillColor(8, 14, 45);
      doc.rect(margin, y-4, cW, 11, "F");
      doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.setTextColor(212,175,55);
    } else {
      doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(80,80,120);
    }
    doc.text(label, pageW-margin-60, y+2);
    doc.text(`$${val.toFixed(2)}`, pageW-margin-3, y+2, { align: "right" });
    y += isBold ? 12 : 7;
  });

  y += 8;

  // ── PLAN DESCRIPTION ──
  doc.setFillColor(240,245,255);
  doc.roundedRect(margin, y, cW, 20, 2, 2, "F");
  doc.setFontSize(8); doc.setFont("helvetica","bold"); doc.setTextColor(60,80,160);
  doc.text("WHAT'S INCLUDED", margin+4, y+6);
  doc.setFont("helvetica","normal"); doc.setTextColor(60,60,100);
  const descLines = doc.splitTextToSize(plan.description, cW-8);
  descLines.forEach((l, li) => doc.text(l, margin+4, y+12+li*5));
  y += 26;

  // ── NDA NOTICE ──
  doc.setFillColor(255,245,230);
  doc.roundedRect(margin, y, cW, 16, 2, 2, "F");
  doc.setFontSize(7.5); doc.setFont("helvetica","bold"); doc.setTextColor(160,80,0);
  doc.text("⚠  NDA IN EFFECT", margin+4, y+6);
  doc.setFont("helvetica","normal"); doc.setTextColor(130,70,0);
  doc.text("Your access is subject to the Zenith Apex Mutual NDA executed during application. Content is confidential.", margin+4, y+11.5);
  doc.text("Unauthorized disclosure is subject to liquidated damages of $2,500,000 per incident.", margin+4, y+16.5);

  // ── FOOTER ──
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFillColor(8,14,45);
    doc.rect(0, 285, pageW, 12, "F");
    doc.setFontSize(7); doc.setFont("helvetica","normal"); doc.setTextColor(120,120,160);
    doc.text("Zenith Apex Research Portfolio · CONFIDENTIAL · This invoice serves as your official payment receipt.", margin, 291);
    doc.text(`Invoice ${invoiceNumber} · Page ${p} of ${total}`, pageW-margin, 291, { align: "right" });
  }

  return doc;
}

/**
 * generateAndEmailInvoice — called on member conversion.
 * Builds PDF, uploads it, emails it to the member.
 * Returns { invoiceNumber, fileUrl }
 */
export async function generateAndEmailInvoice(app, planKey) {
  const invoiceNumber = generateInvoiceNumber(app.id);
  const doc = buildInvoicePDF(app, planKey, invoiceNumber);
  const plan = PLAN_DETAILS[planKey] || { price: 0, type: "Purchase" };

  // Export PDF as blob and upload
  const pdfBlob = doc.output("blob");
  const file = new File([pdfBlob], `invoice-${invoiceNumber}.pdf`, { type: "application/pdf" });
  const { file_url } = await base44.integrations.Core.UploadFile({ file });

  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  // Email with download link
  await base44.integrations.Core.SendEmail({
    to: app.email,
    subject: `✅ Payment Receipt — Invoice ${invoiceNumber} — Zenith Apex`,
    body: `Dear ${app.full_name},

Thank you for your purchase. Your payment has been received and your access is now active.

━━━━━━━━━━━━━━━━━━━━━━━━━
INVOICE ${invoiceNumber}
Date: ${dateStr}
Plan: ${planKey}
Amount: $${plan.price.toFixed ? plan.price.toFixed(2) : plan.price}
Status: PAID ✓
━━━━━━━━━━━━━━━━━━━━━━━━━

Download your invoice PDF here:
${file_url}

(Link expires in 7 days — save a copy for your records.)

WHAT TO DO NEXT:
1. Log in at your platform invite link
2. Go to Pricing & Plans to complete your subscription setup
3. All purchased content is immediately accessible

IMPORTANT REMINDER:
Your access is subject to the Zenith Apex Mutual NDA. Content is strictly confidential. Unauthorized disclosure is subject to $2.5M in liquidated damages per incident.

If you have any questions about your invoice or access, reply to this email.

— Zenith Apex Research Portfolio
Invoice Reference: ${invoiceNumber}`,
  });

  return { invoiceNumber, fileUrl: file_url };
}

export { PLAN_DETAILS };