import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { chapterPlan, countWords, generationVersion, minimumWords, readChapters, requiredChapters, targetPackPages } from '../../shared/briefPackChapterPlan.js';

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
          const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: record.file_uri, expires_in: 300 });
          const response = await fetch(signed_url, { signal: AbortSignal.timeout(20000) });
          if (!response.ok) throw new Error(`Could not read saved chapter: ${record.chapter_title}`);
          const stored = await response.json();
          if (countWords(stored.text) < minimumWords) throw new Error(`Saved chapter is incomplete: ${record.chapter_title}`);
          return { chapter_index: record.chapter_index, chapter_title: record.chapter_title, text: stored.text, word_count: record.word_count };
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
    if (saved) return Response.json({ success: true, cached: true, pack_id, chapter_index: index });
    const legacy = await base44.entities.BriefPackContent.filter({ pack_id }, { sort: '-updated_date', limit: 1 });
    const packTitle = legacy.items[0]?.pack_title || input.pack_title;
    if (typeof packTitle !== 'string' || !packTitle.trim()) return Response.json({ error: 'Pack title required' }, { status: 400 });
    console.log(`Writing ${pack_id}, chapter ${index + 1}: ${planned.title}`);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Write ONE substantial chapter for an internal engineering RESEARCH DRAFT. Return a JSON object with a text string containing the chapter, in paragraphs with descriptive subheadings. Aim for 1,600-1,900 words; a chapter below ${minimumWords} words will be rejected, not called complete. Do not summarize the entire dossier. Develop this chapter's analysis in depth, specific to this device. Do not repeat generic material just to meet length.\n\nDEVICE: ${packTitle}\nSUBTITLE: ${String(input.pack_subtitle || '')}\nCATEGORY: ${String(input.category || '')}\nSUPPLIED SOURCE DESCRIPTION (not independently verified): ${String(input.theory_basis || 'No independently verified source supplied')}\nDEVICE TOPICS: ${Array.isArray(input.sections) ? input.sections.join('; ') : ''}\nCHAPTER ${index + 1}: ${planned.title}\nTASK: ${planned.instructions}\n\nEVIDENCE RULES: Clearly separate source statements, established physics, AI design proposals, illustrative calculations and unverified hypotheses. Do not invent experimental results, patent validity, exact supplier parts, citations, prices, clinical effectiveness or regulatory approvals. Say what is unknown and how to verify it. An existing patent or historical claim does not prove that a proposed device works. Do not give human/animal treatment, disease induction, cloning, weapons or hazardous nuclear construction procedures. For those topics limit the chapter to critical evidence review, passive measurement and professional safety/governance requirements. Do not invent claims to fill pages.`,
      response_json_schema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] }
    });
    const words = countWords(result.text);
    if (words < minimumWords) {
      console.warn(`Rejected short chapter ${pack_id}/${planned.key}: ${words} words`);
      return Response.json({ error: `Chapter ${index + 1} returned only ${words} words; ${minimumWords} are required. It was not marked complete. Resume to retry this chapter.` }, { status: 422 });
    }
    const file = new File([JSON.stringify({ text: result.text })], `${pack_id}-${planned.key}.json`, { type: 'application/json' });
    const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
    if (!file_uri) throw new Error('The generated chapter could not be saved privately.');
    const data = { pack_id, chapter_key: planned.key, chapter_title: planned.title, chapter_index: index, generation_version: generationVersion, file_uri, word_count: words };
    const latest = await readChapters(base44, pack_id);
    const duplicate = latest.find(record => record.chapter_key === planned.key);
    if (!duplicate) await base44.entities.BriefPackChapter.create(data);
    console.log(`Saved ${pack_id}/${planned.key}: ${words} counted words`);
    return Response.json({ success: true, pack_id, chapter_index: index, chapter_title: planned.title, word_count: words });
  } catch (error) {
    console.error('Brief pack chapter generation failed:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}