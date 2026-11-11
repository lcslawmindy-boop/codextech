import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { chapterPlan, countWords, generationVersion, minimumWords, readChapters, requiredChapters, targetPackPages } from '../../shared/briefPackChapterPlan.js';
import { findChapterDraft, readChapterText, saveChapterDraft } from '../../shared/briefPackChapterDraft.js';
import { writeChapterStep } from '../../shared/briefPackChapterWriter.js';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(e => e.status === 401 ? null : Promise.reject(e));
    if (!user) return Response.json({ error: 'Sign in required' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });
    const input = await req.json().catch(() => ({}));
    const action = input.action || 'generate';
    if (!['status', 'read_pack', 'generate'].includes(action)) return Response.json({ error: 'Unknown action' }, { status: 400 });
    if (action === 'status') {
      const result = await base44.entities.BriefPackChapter.aggregate({
        query: { generation_version: generationVersion, word_count: { $gte: minimumWords } },
        groupBy: 'pack_id', sum: ['word_count']
      });
      return Response.json({ rows: result.rows, requiredChapters, targetPackPages, maximumChapters: chapterPlan.length });
    }
    const { pack_id } = input;
    if (typeof pack_id !== 'string' || !/^bp-(00[1-9]|0[12][0-9]|03[0-3])$/.test(pack_id)) return Response.json({ error: 'A valid brief pack is required' }, { status: 400 });
    const existing = await readChapters(base44, pack_id);
    if (action === 'read_pack') {
      const chapters = [];
      for (let i = 0; i < existing.length; i += 6) {
        const batch = await Promise.all(existing.slice(i, i + 6).map(async record => {
          const text = await readChapterText(base44, record);
          if (countWords(text) < minimumWords) throw new Error(`Saved chapter is incomplete: ${record.chapter_title}`);
          return { chapter_index: record.chapter_index, chapter_title: record.chapter_title, text, word_count: record.word_count };
        }));
        chapters.push(...batch);
      }
      return Response.json({ pack_id, chapters });
    }
    const index = input.chapter_index === undefined ? chapterPlan.slice(0, requiredChapters).findIndex(chapter => !existing.some(record => record.chapter_key === chapter.key)) : input.chapter_index;
    if (index === -1) return Response.json({ success: true, done: true, pack_id });
    if (!Number.isInteger(index) || index < 0 || index >= chapterPlan.length) return Response.json({ error: 'Invalid chapter index' }, { status: 400 });
    const planned = chapterPlan[index];
    const saved = existing.find(record => record.chapter_key === planned.key);
    if (saved) return Response.json({ success: true, complete: true, cached: true, pack_id, chapter_index: index, word_count: saved.word_count, minimum_words: minimumWords });
    const legacy = await base44.entities.BriefPackContent.filter({ pack_id }, { sort: '-updated_date', limit: 1 });
    const packTitle = legacy.items[0]?.pack_title || input.pack_title;
    if (typeof packTitle !== 'string' || !packTitle.trim()) return Response.json({ error: 'Pack title required' }, { status: 400 });
    const draft = await findChapterDraft(base44, pack_id, planned);
    const previousText = draft ? await readChapterText(base44, draft) : '';
    console.log(`${draft ? 'Expanding' : 'Writing'} ${pack_id}, chapter ${index + 1}: ${planned.title}; ${countWords(previousText)} saved words`);
    const text = await writeChapterStep(base44, input, packTitle, planned, previousText);
    const record = await saveChapterDraft(base44, pack_id, planned, text);
    const complete = record.word_count >= minimumWords;
    console.log(`Saved ${complete ? 'complete chapter' : 'partial draft'} ${pack_id}/${planned.key}: ${record.word_count} counted words`);
    return Response.json({ success: true, complete, needs_expansion: !complete, pack_id, chapter_index: index, chapter_title: planned.title, word_count: record.word_count, minimum_words: minimumWords });
  } catch (error) {
    console.error('Brief pack chapter generation failed:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}