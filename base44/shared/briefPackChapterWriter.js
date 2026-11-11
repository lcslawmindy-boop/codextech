import { countWords, minimumWords } from './briefPackChapterPlan.js';

const evidenceRules = `Clearly separate source statements, established physics, AI design proposals, illustrative calculations and unverified hypotheses. Do not invent experimental results, patent validity, exact supplier parts, citations, prices, clinical effectiveness or regulatory approvals. Say what is unknown and how to verify it. An existing patent or historical claim does not prove that a proposed device works. Do not give human/animal treatment, disease induction, cloning, weapons or hazardous nuclear construction procedures. For those topics limit the chapter to critical evidence review, passive measurement and professional safety/governance requirements. Do not invent claims or add repetitive filler to meet a word count.`;
const normalize = text => text.toLowerCase().replace(/\s+/g, ' ').trim();

export async function writeChapterStep(base44, input, packTitle, planned, previousText) {
  const words = countWords(previousText);
  const task = words > 0
    ? `Continue an existing internal engineering RESEARCH DRAFT chapter that currently has ${words} words. Write ONLY NEW material to append, never rewrite, quote or repeat the existing chapter. Develop two or three underexplored aspects of this chapter's task in 600-900 additional words, including rationale, device-specific dependencies and verification criteria where relevant. The chapter needs at least ${minimumWords} total words; aim to add at least ${Math.max(600, minimumWords - words + 200)} new words. Use descriptive subheadings and full analytical paragraphs, not an outline, padding or a repeated conclusion. Stay within this chapter's scope. If evidence is missing, explain specific uncertainties and safe ways to resolve them rather than inventing evidence.`
    : `Write ONE substantial chapter for an internal engineering RESEARCH DRAFT, in paragraphs with descriptive subheadings. Aim for 1,600-1,900 words. Do not summarize the entire dossier. Develop this chapter's analysis in depth, specific to this device.`;
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `${task}\nReturn a JSON object with a text string containing only the ${words ? 'new continuation' : 'chapter'}.\n\nDEVICE: ${packTitle}\nSUBTITLE: ${String(input.pack_subtitle || '')}\nCATEGORY: ${String(input.category || '')}\nSUPPLIED SOURCE DESCRIPTION (not independently verified): ${String(input.theory_basis || 'No independently verified source supplied')}\nDEVICE TOPICS: ${Array.isArray(input.sections) ? input.sections.join('; ') : ''}\nCHAPTER ${planned.index + 1}: ${planned.title}\nTASK: ${planned.instructions}\n\nEVIDENCE RULES: ${evidenceRules}${words ? `\n\nEXISTING CHAPTER, for context only; do not repeat:\n${previousText}` : ''}`,
    response_json_schema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] }
  });
  if (typeof result.text !== 'string' || !result.text.trim()) throw new Error('No chapter text was returned. Any saved draft is preserved; resume to continue.');
  const seen = new Set([normalize(previousText), ...previousText.split(/\n\s*\n/).map(normalize)]);
  const additions = result.text.split(/\n\s*\n/).map(paragraph => paragraph.trim()).filter(paragraph => {
    const key = normalize(paragraph);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (!additions.length) throw new Error('No new chapter material was returned. The saved draft is preserved; resume to continue.');
  return [previousText, ...additions].filter(Boolean).join('\n\n');
}