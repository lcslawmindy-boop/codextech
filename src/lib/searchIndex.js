import { nodes } from "./beardenData";

// Theme aliases map broad user queries to relevant concept groups/ids
export const themeAliases = {
  consciousness: ["consciousness", "mind_field", "bioframe", "neutrino_field"],
  mind: ["consciousness", "mind_field", "bioframe"],
  weaponry: ["biological_warfare", "weather_warfare", "scalar_em"],
  weapons: ["biological_warfare", "weather_warfare", "scalar_em"],
  warfare: ["biological_warfare", "weather_warfare"],
  logic: ["aristotle_logic", "temporal_logic"],
  "temporal logic": ["aristotle_logic"],
  biology: ["kindling", "kaznacheyev", "negentropy", "biological_warfare"],
  disease: ["kaznacheyev", "biological_warfare", "kindling", "rife_microscope"],
  physics: ["scalar_em", "maxwell_equations", "neutrino_field", "mind_field"],
  electromagnetic: ["scalar_em", "maxwell_equations", "kaznacheyev", "rife_microscope"],
  em: ["scalar_em", "maxwell_equations", "kaznacheyev"],
  life: ["negentropy", "kindling", "bioframe"],
  entropy: ["negentropy"],
  soviet: ["weather_warfare", "biological_warfare", "scalar_em"],
  rife: ["rife_microscope"],
  microscope: ["rife_microscope"],
  aids: ["biological_warfare", "kaznacheyev"],
  virus: ["biological_warfare", "kaznacheyev", "rife_microscope"],
  memory: ["consciousness"],
  recall: ["consciousness"],
  reincarnation: ["bioframe"],
  thought: ["mind_field", "consciousness"],
  neutrino: ["neutrino_field", "mind_field"],
  maxwell: ["maxwell_equations"],
  chernobyl: ["weather_warfare"],
  weather: ["weather_warfare"],
  bearden: ["scalar_em", "biological_warfare", "kindling"],
  aristotle: ["aristotle_logic"],
  identity: ["aristotle_logic"],
  kindling: ["kindling", "negentropy"],
};

// Build flat searchable corpus: one entry per fragment
function buildCorpus() {
  const corpus = [];
  for (const node of nodes) {
    for (let i = 0; i < node.fragments.length; i++) {
      corpus.push({
        nodeId: node.id,
        nodeLabel: node.label,
        nodeGroup: node.group,
        fragmentIndex: i,
        text: node.fragments[i],
      });
    }
  }
  return corpus;
}

const corpus = buildCorpus();

function tokenize(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}

function scoreFragment(fragmentTokens, queryTokens) {
  let score = 0;
  for (const qt of queryTokens) {
    for (const ft of fragmentTokens) {
      if (ft === qt) score += 2;
      else if (ft.includes(qt) || qt.includes(ft)) score += 1;
    }
  }
  return score;
}

export function search(query) {
  if (!query || query.trim().length < 2) return [];

  const queryLower = query.toLowerCase().trim();
  const queryTokens = tokenize(queryLower);

  // Resolve theme aliases to boost certain node ids
  const boostedNodeIds = new Set();
  for (const [theme, ids] of Object.entries(themeAliases)) {
    const themeTokens = tokenize(theme);
    if (themeTokens.every(t => queryTokens.some(qt => qt.includes(t) || t.includes(qt)))) {
      ids.forEach(id => boostedNodeIds.add(id));
    }
  }

  const scored = corpus.map(entry => {
    const fragmentTokens = tokenize(entry.text);
    let score = scoreFragment(fragmentTokens, queryTokens);
    if (boostedNodeIds.has(entry.nodeId)) score += 5;
    return { ...entry, score };
  });

  return scored
    .filter(e => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}

export function getHighlightedText(text, query) {
  if (!query) return text;
  const words = query.trim().split(/\s+/).filter(w => w.length > 2);
  if (!words.length) return text;
  const regex = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text.split(regex);
}