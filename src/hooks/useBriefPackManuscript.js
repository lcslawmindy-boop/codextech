import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { BRIEF_PACKS } from '@/lib/briefPackData';
import { buildChapterPDF } from '@/lib/briefPackChapterPdf';
import { generateFullMasterPDF } from '@/lib/generateFullBriefPDF';

const queryKey = ['brief-pack-chapter-progress'];
const invoke = async payload => {
  const response = await base44.functions.invoke('generateBriefPackContent', payload);
  if (response.data?.error) throw new Error(response.data.error);
  return response.data;
};
const readPack = async pack => ({ ...pack, ...(await invoke({ action: 'read_pack', pack_id: pack.id })) });
const metadata = pack => ({ pack_id: pack.id, pack_title: pack.title, pack_subtitle: pack.subtitle, category: pack.category, theory_basis: pack.theory_basis, sections: pack.sections });
const message = error => error.response?.data?.error || error.message;
const writeChapter = async (pack, index, onProgress, shouldStop) => {
  let words = 0;
  let minimum = 1100;
  for (let step = 0; step < 5; step++) {
    if (shouldStop()) return;
    onProgress({ packId: pack.id, title: pack.title, chapter: index + 1, words });
    const result = await invoke({ ...metadata(pack), chapter_index: index });
    words = result.word_count;
    minimum = result.minimum_words || minimum;
    if (result.complete || result.cached) return;
  }
  if (!shouldStop()) throw new Error(`Chapter ${index + 1} is saved at ${words} words but still needs ${minimum}. Resume to expand the saved draft without starting over.`);
};

export default function useBriefPackManuscript() {
  const client = useQueryClient();
  const query = useQuery({ queryKey, queryFn: () => invoke({ action: 'status' }), refetchOnWindowFocus: false });
  const [running, setRunning] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');
  const [pageCount, setPageCount] = useState(null);
  const stop = useRef(false);
  const lock = useRef(false);
  useEffect(() => () => { stop.current = true; }, []);
  const refresh = () => client.fetchQuery({ queryKey, queryFn: () => invoke({ action: 'status' }), staleTime: 0 });

  const generate = async () => {
    if (lock.current) return;
    lock.current = true; stop.current = false; setRunning(true); setError(''); setPageCount(null);
    try {
      const state = await refresh();
      const completedPacks = [];
      for (const pack of BRIEF_PACKS) {
        if (stop.current) break;
        let manuscript = await readPack(pack);
        const saved = new Set(manuscript.chapters.map(chapter => chapter.chapter_index));
        for (let index = 0; index < state.requiredChapters; index++) {
          if (stop.current) break;
          if (saved.has(index)) continue;
          await writeChapter(pack, index, setProgress, () => stop.current);
          await refresh();
        }
        if (stop.current) break;
        manuscript = await readPack(pack);
        let actual = buildChapterPDF([manuscript]).ranges[pack.id].pages;
        for (let index = state.requiredChapters; actual < state.targetPackPages && index < state.maximumChapters; index++) {
          if (stop.current) break;
          if (saved.has(index)) continue;
          await writeChapter(pack, index, setProgress, () => stop.current);
          await refresh();
          manuscript = await readPack(pack);
          actual = buildChapterPDF([manuscript]).ranges[pack.id].pages;
        }
        if (!stop.current && actual < state.targetPackPages) throw new Error(`${pack.title} has ${actual} measured pages and still needs more substantive source material. It has not been labeled full.`);
        completedPacks.push(manuscript);
      }
      if (!stop.current) setPageCount(buildChapterPDF(completedPacks).pageCount);
    } catch (failure) { setError(message(failure)); }
    finally { setRunning(false); setProgress(null); lock.current = false; }
  };

  const download = async () => {
    if (lock.current) return;
    lock.current = true; setDownloading(true); setError('');
    try {
      const state = await refresh();
      const savedIds = new Set((state.rows || []).map(row => row.pack_id));
      const candidates = BRIEF_PACKS.filter(pack => savedIds.has(pack.id));
      if (!candidates.length) throw new Error('No full-length chapters are saved yet. Start generation below; the old placeholder packs cannot produce a full manuscript.');
      const packs = [];
      for (let index = 0; index < candidates.length; index += 3) packs.push(...await Promise.all(candidates.slice(index, index + 3).map(readPack)));
      const result = generateFullMasterPDF(packs);
      setPageCount(result.pageCount);
      if (!result.full) setError(`Downloaded an incomplete draft with ${result.pageCount} actual pages. Resume chapter generation for the full 1,400-page manuscript.`);
    } catch (failure) { setError(message(failure)); }
    finally { setDownloading(false); lock.current = false; }
  };
  return { rows: Object.fromEntries((query.data?.rows || []).map(row => [row.pack_id, row])), requiredChapters: query.data?.requiredChapters || 20, loading: query.isPending, running, downloading, progress, error: error || (query.error ? message(query.error) : ''), pageCount, generate, download, pause: () => { stop.current = true; }, refresh };
}