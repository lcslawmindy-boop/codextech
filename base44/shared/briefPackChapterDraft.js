import { countWords, generationVersion } from './briefPackChapterPlan.js';

export async function readChapterText(base44, record) {
  const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: record.file_uri, expires_in: 300 });
  const response = await fetch(signed_url, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Could not read saved chapter: ${record.chapter_title}`);
  const stored = await response.json();
  if (typeof stored.text !== 'string') throw new Error(`Saved chapter text is missing: ${record.chapter_title}`);
  return stored.text;
}

export async function findChapterDraft(base44, packId, planned) {
  const page = await base44.entities.BriefPackChapter.filter(
    { pack_id: packId, chapter_key: planned.key, chapter_index: planned.index, generation_version: generationVersion },
    { sort: '-word_count', limit: 1 }
  );
  return page.items[0] || null;
}

export async function saveChapterDraft(base44, packId, planned, text) {
  const words = countWords(text);
  const file = new File([JSON.stringify({ text })], `${packId}-${planned.key}.json`, { type: 'application/json' });
  const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
  if (!file_uri) throw new Error('The generated chapter could not be saved privately.');
  const latest = await findChapterDraft(base44, packId, planned);
  if (latest && latest.word_count >= words) return latest;
  const data = { pack_id: packId, chapter_key: planned.key, chapter_title: planned.title, chapter_index: planned.index, generation_version: generationVersion, file_uri, word_count: words };
  return latest ? await base44.entities.BriefPackChapter.update(latest.id, data) : await base44.entities.BriefPackChapter.create(data);
}