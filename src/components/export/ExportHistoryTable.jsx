import { Download, RefreshCw, Send, Trash2, HardDrive } from "lucide-react";

const HISTORY = [
  { name: "Master Investor & Grant Package", type: "Investor Package", version: "3.2", date: "Aug 10, 2026", pages: 42, downloads: 5 },
  { name: "Schumann PEMF Licensing Brief", type: "Licensing Brief", version: "1.0", date: "Aug 8, 2026", pages: 1, downloads: 2 },
  { name: "SBIR Phase I — NIH Significance", type: "SBIR Grant", version: "2.1", date: "Aug 5, 2026", pages: 18, downloads: 3 },
  { name: "Scalar Coherence Array — Dossier", type: "Suppression Dossier", version: "1.0", date: "Aug 1, 2026", pages: 24, downloads: 1 },
  { name: "AATCS-P1 Device Engineering Pkg", type: "Device Engineering", version: "1.3", date: "Jul 28, 2026", pages: 31, downloads: 4 },
  { name: "Technology One-Pager — Biofield AI", type: "One-Pager", version: "1.0", date: "Jul 22, 2026", pages: 1, downloads: 7 },
];

const TYPE_COLOR = {
  "Investor Package": "hsl(var(--zarp-gold))",
  "Licensing Brief": "hsl(var(--zarp-blue))",
  "SBIR Grant": "hsl(var(--zarp-violet))",
  "Suppression Dossier": "hsl(var(--zarp-red))",
  "Device Engineering": "hsl(var(--zarp-amber))",
  "One-Pager": "hsl(var(--zarp-muted))",
};

export default function ExportHistoryTable() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full" style={{ backgroundColor: "hsl(var(--zarp-blue))" }} />
          <h2 className="text-zarp-text font-bold text-base">Export History</h2>
          <span className="text-zarp-muted text-xs">— all past exports</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zarp-card border border-zarp-border">
          <HardDrive size={12} className="text-zarp-blue" />
          <span className="text-zarp-muted text-[10px]">Export Storage:</span>
          <span className="text-zarp-text text-[10px] font-bold">2.3 GB</span>
          <span className="text-zarp-muted text-[10px]">of 10 GB</span>
          <div className="w-16 h-1.5 rounded-full bg-zarp-elevated overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "23%", backgroundColor: "hsl(var(--zarp-blue))" }} />
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-zarp-border bg-zarp-card overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-zarp-border bg-zarp-elevated/50">
              <th className="text-left px-4 py-2.5 text-zarp-muted text-[10px] font-bold uppercase tracking-wider">Document Name</th>
              <th className="text-left px-4 py-2.5 text-zarp-muted text-[10px] font-bold uppercase tracking-wider">Type</th>
              <th className="text-center px-4 py-2.5 text-zarp-muted text-[10px] font-bold uppercase tracking-wider">Ver</th>
              <th className="text-left px-4 py-2.5 text-zarp-muted text-[10px] font-bold uppercase tracking-wider">Date</th>
              <th className="text-center px-4 py-2.5 text-zarp-muted text-[10px] font-bold uppercase tracking-wider">Pages</th>
              <th className="text-center px-4 py-2.5 text-zarp-muted text-[10px] font-bold uppercase tracking-wider">Downloads</th>
              <th className="text-right px-4 py-2.5 text-zarp-muted text-[10px] font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {HISTORY.map((row, i) => (
              <tr key={i} className="border-b border-zarp-border/50 hover:bg-zarp-elevated/30 transition-colors">
                <td className="px-4 py-3 text-zarp-text text-xs font-semibold">{row.name}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold" style={{ color: TYPE_COLOR[row.type] }}>{row.type}</span>
                </td>
                <td className="px-4 py-3 text-center text-zarp-muted text-xs font-mono">{row.version}</td>
                <td className="px-4 py-3 text-zarp-muted text-xs">{row.date}</td>
                <td className="px-4 py-3 text-center text-zarp-text text-xs font-bold">{row.pages}</td>
                <td className="px-4 py-3 text-center text-zarp-muted text-xs">{row.downloads}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 rounded hover:bg-zarp-elevated text-zarp-muted hover:text-zarp-gold transition-colors" title="Re-download"><Download size={12} /></button>
                    <button className="p-1.5 rounded hover:bg-zarp-elevated text-zarp-muted hover:text-zarp-blue transition-colors" title="Resend"><Send size={12} /></button>
                    <button className="p-1.5 rounded hover:bg-zarp-elevated text-zarp-muted hover:text-zarp-green transition-colors" title="Regenerate"><RefreshCw size={12} /></button>
                    <button className="p-1.5 rounded hover:bg-zarp-elevated text-zarp-muted hover:text-zarp-red transition-colors" title="Delete"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}