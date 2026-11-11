import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import BriefPackProgressList from '@/components/admin/BriefPackProgressList';

export default function BriefPackContentGenerator({ manuscript }) {
  const [expanded, setExpanded] = useState(false);
  const { rows, requiredChapters, running, downloading, loading, progress, generate, pause, refresh } = manuscript;
  return (
    <section className="rounded-2xl border border-border bg-card overflow-hidden">
      <button onClick={() => setExpanded(value => !value)} className="flex w-full items-center justify-between gap-3 p-5 text-left">
        <div><h2 className="font-bold">Full manuscript generation — 1,400-page goal</h2><p className="text-xs text-muted-foreground mt-1">Saved chapter by chapter; legacy placeholders are not counted as complete.</p></div>
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      <div className="px-5 pb-5 space-y-4">
        <p className="text-sm text-muted-foreground">Each device needs at least {requiredChapters} substantial chapters. This is a long, credit-consuming generation run, not a quick PDF reformat. Keep this page open while writing; Pause and Resume preserve every saved chapter. Chapters remain private to administrators.</p>
        <div className="flex flex-wrap gap-2">
          <button disabled={running || downloading || loading} onClick={generate} className="rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50">{running ? 'Writing chapters…' : 'Generate / resume full manuscript'}</button>
          {running && <button onClick={pause} className="rounded-lg border border-border px-4 py-3 text-sm">Pause after current chapter</button>}
          <button disabled={running || downloading} onClick={refresh} className="rounded-lg border border-border px-4 py-3 text-sm disabled:opacity-50">Refresh progress</button>
        </div>
        {progress && <p role="status" className="flex items-center gap-2 text-sm"><Loader2 size={16} className="animate-spin shrink-0" />{progress.title}, chapter {progress.chapter}</p>}
        {expanded && <BriefPackProgressList rows={rows} requiredChapters={requiredChapters} activePack={progress?.packId} />}
      </div>
    </section>
  );
}