import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Trash2, Film, Search, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { jsPDF } from "jspdf";

function downloadVideoAsPDF(video) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, margin = 15;
  let y = margin;

  const addText = (text, size, bold, color = [220, 220, 220]) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(String(text || ""), W - margin * 2);
    lines.forEach(line => {
      if (y > 270) { doc.addPage(); y = margin; }
      doc.text(line, margin, y);
      y += size * 0.45;
    });
    y += 2;
  };

  // Cover
  doc.setFillColor(10, 10, 20);
  doc.rect(0, 0, 210, 297, "F");
  y = 40;
  addText("BUILD VIDEO GUIDE", 10, false, [100, 150, 255]);
  addText(video.invention_name, 22, true, [255, 255, 255]);
  if (video.invention_tagline) addText(`"${video.invention_tagline}"`, 10, false, [150, 150, 180]);
  if (video.invention_category) addText(video.invention_category.toUpperCase(), 9, false, [100, 100, 130]);
  addText(`Generated: ${new Date(video.created_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 9, false, [80, 80, 100]);
  addText(`${video.step_count || video.steps?.length || 0} Steps`, 9, false, [80, 80, 100]);

  y += 10;
  doc.setDrawColor(60, 80, 180);
  doc.setLineWidth(0.5);
  doc.line(margin, y, W - margin, y);
  y += 10;

  // Steps
  (video.steps || []).forEach((step, i) => {
    if (y > 240) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, 210, 297, "F"); y = margin; }

    const typeColors = {
      preparation: [167, 139, 250], assembly: [96, 184, 255], wiring: [251, 191, 36],
      calibration: [52, 211, 153], testing: [34, 211, 238], safety: [248, 113, 113]
    };
    const col = typeColors[step.type] || [96, 184, 255];

    // Step header
    doc.setFillColor(...col, 30);
    doc.setDrawColor(...col);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, W - margin * 2, 8, 2, 2, "FD");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...col);
    doc.text(`STEP ${String(i + 1).padStart(2, "0")}  ${(step.title || "").toUpperCase()}`, margin + 3, y + 5.5);

    const durStr = step.duration || "";
    if (durStr) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 170);
      doc.text(durStr, W - margin - doc.getTextWidth(durStr) - 2, y + 5.5);
    }
    y += 12;

    addText(step.description || "", 9, false, [200, 200, 210]);

    if (step.warning) {
      doc.setFillColor(80, 20, 20);
      const warnLines = doc.splitTextToSize(`⚠ ${step.warning}`, W - margin * 2 - 6);
      const warnH = warnLines.length * 4.5 + 4;
      doc.roundedRect(margin, y, W - margin * 2, warnH, 1, 1, "F");
      doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(248, 113, 113);
      warnLines.forEach(l => { doc.text(l, margin + 3, y + 4); y += 4.5; });
      y += 4;
    }

    // Materials + Tools side by side
    const colW = (W - margin * 2 - 4) / 2;
    const matStart = y;
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(130, 130, 160);
    doc.text("MATERIALS", margin, y); y += 4;
    doc.setFont("helvetica", "normal"); doc.setTextColor(180, 180, 200);
    (step.materials || []).forEach(m => { doc.text(`· ${m}`, margin, y); y += 4; });

    const toolStart = matStart;
    let ty = toolStart;
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(130, 130, 160);
    doc.text("TOOLS", margin + colW + 4, ty); ty += 4;
    doc.setFont("helvetica", "normal"); doc.setTextColor(180, 180, 200);
    (step.tools || []).forEach(t => { doc.text(`· ${t}`, margin + colW + 4, ty); ty += 4; });
    y = Math.max(y, ty) + 3;

    if (step.checkpoint) {
      doc.setFillColor(10, 50, 30);
      const cpLines = doc.splitTextToSize(`✓ ${step.checkpoint}`, W - margin * 2 - 6);
      const cpH = cpLines.length * 4.5 + 4;
      doc.roundedRect(margin, y, W - margin * 2, cpH, 1, 1, "F");
      doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(52, 211, 153);
      cpLines.forEach(l => { doc.text(l, margin + 3, y + 4); y += 4.5; });
      y += 6;
    }

    doc.setDrawColor(40, 40, 60);
    doc.setLineWidth(0.2);
    doc.line(margin, y, W - margin, y);
    y += 6;
  });

  const safeName = (video.invention_name || "build-video").toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 50);
  doc.save(`${safeName}-build-guide.pdf`);
}

function downloadVideoAsTXT(video) {
  let out = `BUILD VIDEO GUIDE\n${"=".repeat(60)}\n`;
  out += `Invention: ${video.invention_name}\n`;
  if (video.invention_tagline) out += `"${video.invention_tagline}"\n`;
  if (video.invention_category) out += `Category: ${video.invention_category}\n`;
  out += `Generated: ${new Date(video.created_date).toLocaleDateString()}\n`;
  out += `${"=".repeat(60)}\n\n`;

  (video.steps || []).forEach((step, i) => {
    out += `STEP ${String(i + 1).padStart(2, "0")}: ${step.title}\n`;
    out += `Type: ${step.type || ""} | Duration: ${step.duration || ""}\n`;
    out += `${"-".repeat(40)}\n`;
    out += `${step.description || ""}\n\n`;
    if (step.warning) out += `⚠ WARNING: ${step.warning}\n\n`;
    out += `Materials:\n${(step.materials || []).map(m => `  · ${m}`).join("\n")}\n\n`;
    out += `Tools:\n${(step.tools || []).map(t => `  · ${t}`).join("\n")}\n\n`;
    out += `✓ Checkpoint: ${step.checkpoint || ""}\n\n`;
    out += `${"=".repeat(60)}\n\n`;
  });

  const blob = new Blob([out], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(video.invention_name || "build-video").toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 50)}-build-guide.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function VideoCard({ video, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-950 flex items-center justify-center flex-shrink-0">
            <Film size={18} className="text-blue-400" />
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-black text-base leading-tight truncate">{video.invention_name}</h3>
            {video.invention_tagline && <p className="text-gray-500 text-xs italic mt-0.5">"{video.invention_tagline}"</p>}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {video.invention_category && (
                <span className="text-xs px-2 py-0.5 rounded bg-blue-950/50 border border-blue-900 text-blue-300">{video.invention_category}</span>
              )}
              <span className="text-xs text-gray-600">{video.step_count || video.steps?.length || 0} steps</span>
              <span className="text-xs text-gray-600">{new Date(video.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => downloadVideoAsTXT(video)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs transition-colors">
            <Download size={11} /> TXT
          </button>
          <button onClick={() => downloadVideoAsPDF(video)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold transition-colors">
            <Download size={11} /> PDF
          </button>
          <button onClick={() => setExpanded(e => !e)}
            className="p-1.5 text-gray-600 hover:text-white transition-colors">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={() => onDelete(video.id)}
            className="p-1.5 text-gray-700 hover:text-red-400 transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-800 px-5 py-4 space-y-2">
          {(video.steps || []).map((step, i) => (
            <div key={i} className="flex items-start gap-3 text-xs">
              <span className="text-gray-600 font-mono font-bold w-6 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex-1">
                <span className="text-white font-semibold">{step.title}</span>
                <span className="text-gray-600 ml-2">{step.duration}</span>
                <p className="text-gray-500 mt-0.5 leading-snug">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    base44.entities.BuildVideo.list("-created_date", 100).then(v => {
      setVideos(v);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id) => {
    await base44.entities.BuildVideo.delete(id);
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const downloadAll = () => {
    filtered.forEach(v => downloadVideoAsPDF(v));
  };

  const filtered = videos.filter(v =>
    !search || v.invention_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/inventor-forge" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Invention Forge</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base">🎬 Build Video Library</h1>
            <p className="text-gray-500 text-xs">{videos.length} saved build guide{videos.length !== 1 ? "s" : ""} · Admin only</p>
          </div>
        </div>
        {filtered.length > 0 && (
          <button onClick={downloadAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-xs transition-all">
            <Download size={13} /> Download All as PDF ({filtered.length})
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto w-full px-5 py-6 space-y-4">
        {videos.length > 0 && (
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search inventions…"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
            />
          </div>
        )}

        {loading && (
          <div className="text-center py-20 text-gray-500">Loading…</div>
        )}

        {!loading && videos.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎬</div>
            <h2 className="text-white font-black text-xl mb-2">No Build Videos Yet</h2>
            <p className="text-gray-500 text-sm">Generate inventions in the Forge and click "Build Video" on any card — they'll automatically save here.</p>
            <Link to="/inventor-forge" className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-sm">
              Go to Invention Forge →
            </Link>
          </div>
        )}

        {filtered.map(video => (
          <VideoCard key={video.id} video={video} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}