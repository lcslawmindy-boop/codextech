import { BRIEF_PACKS } from '@/lib/briefPackData';

export default function BriefPackProgressList({ rows, requiredChapters, activePack }) {
  return (
    <div className="max-h-96 overflow-y-auto space-y-2">
      {BRIEF_PACKS.map((pack, index) => {
        const row = rows[pack.id];
        return <div key={pack.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
          <span className="text-xs text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{pack.title}</p>
            <p className="text-xs text-muted-foreground">{row?.count || 0} chapters saved · {requiredChapters} core required · {(row?.sum_word_count || 0).toLocaleString()} counted words</p>
          </div>
          <span className="text-xs">{activePack === pack.id ? 'Writing…' : row?.count >= requiredChapters ? 'Chapters saved' : 'Needs content'}</span>
        </div>;
      })}
    </div>
  );
}