import { Download, Loader2 } from 'lucide-react';

export default function BriefPackDownloadPanel({ busy, loading, pageCount, error, onDownload }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
      <h2 className="text-lg font-bold">Admin Master PDF — 33 Brief Packs</h2>
      <p className="text-sm text-muted-foreground">The 1,400-page goal requires real long-form content. The old 264-page figure was a sum of placeholder estimates, not the measured download length.</p>
      <p className="text-sm">{pageCount ? `${pageCount.toLocaleString()} actual pages in the latest assembled PDF.` : 'Actual page count is calculated when the saved chapters are assembled.'}</p>
      <button disabled={busy || loading} onClick={onDownload} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50">
        {busy ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        {busy ? 'Assembling saved chapters…' : 'Download saved chapters'}
      </button>
      <p className="text-xs text-muted-foreground">Incomplete manuscripts download as clearly marked drafts. A full export must contain all 33 packs and at least 1,400 measured pages, without blank-page padding.</p>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </section>
  );
}