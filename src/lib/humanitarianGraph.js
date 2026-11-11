// Builds the visual relationship graph for the 20 humanitarian dual-tech
// inventions: invention nodes, the existing research nodes they fuse,
// and the humanitarian problems they solve.
import { nodes as beardenNodes, groupColors } from "./beardenData";
import { HUMANITARIAN_INVENTIONS } from "./humanitarianInventions";

// ── Humanitarian problem nodes (the "why") ──────────────────────────────────
export const HUMANITARIAN_PROBLEMS = [
  { id: "p_clean_water", label: "Clean Water", color: "#06b6d4", icon: "💧" },
  { id: "p_sanitation", label: "Sanitation", color: "#0891b2", icon: "🚿" },
  { id: "p_disaster", label: "Disaster Response", color: "#ef4444", icon: "🆘" },
  { id: "p_food", label: "Food Security", color: "#22c55e", icon: "🌾" },
  { id: "p_comms", label: "Accessible Communication", color: "#a855f7", icon: "🗨️" },
  { id: "p_mental", label: "Mental Health", color: "#8b5cf6", icon: "🧠" },
  { id: "p_mobility", label: "Assistive Mobility", color: "#ec4899", icon: "🦿" },
  { id: "p_rehab", label: "Rehabilitation", color: "#d946ef", icon: "♻️" },
  { id: "p_learning", label: "Adaptive Learning", color: "#f59e0b", icon: "📚" },
  { id: "p_literacy", label: "Literacy", color: "#eab308", icon: "✏️" },
  { id: "p_energy", label: "Energy Access", color: "#f97316", icon: "⚡" },
  { id: "p_indoor_air", label: "Indoor Air Quality", color: "#84cc16", icon: "🌬️" },
  { id: "p_infra", label: "Infrastructure Resilience", color: "#64748b", icon: "🏗️" },
  { id: "p_early_warning", label: "Early Warning", color: "#dc2626", icon: "⚠️" },
  { id: "p_safety", label: "Safety / Demining", color: "#b91c1c", icon: "🛡️" },
  { id: "p_cold_chain", label: "Cold-Chain Health", color: "#0ea5e9", icon: "💉" },
  { id: "p_maternal_child", label: "Maternal & Child Health", color: "#10b981", icon: "🤱" },
];

// ── Invention → research node + problem mapping ─────────────────────────────
// Each invention maps to 1-2 existing research nodes (the dual technologies)
// and exactly one humanitarian problem it targets.
const INVENTION_LINKS = {
  hum_001: { research: ["scalar_em", "rife_microscope"], problem: "p_clean_water" },
  hum_002: { research: ["schauberger_implosion", "negentropy"], problem: "p_clean_water" },
  hum_003: { research: ["scalar_em", "vacuum_structure"], problem: "p_clean_water" },
  hum_004: { research: ["mccs_cellular_control", "schauberger_implosion"], problem: "p_sanitation" },
  hum_005: { research: ["scalar_em", "consciousness"], problem: "p_disaster" },
  hum_006: { research: ["schauberger_implosion", "anenergy"], problem: "p_food" },
  hum_007: { research: ["scalar_em", "scalar_longitudinal"], problem: "p_disaster" },
  hum_008: { research: ["reich_orgone", "negentropy"], problem: "p_cold_chain" },
  hum_009: { research: ["scalar_em", "mind_body_coupling"], problem: "p_comms" },
  hum_010: { research: ["nada_brahman", "chakra_nadi_anatomy"], problem: "p_maternal_child" },
  hum_011: { research: ["sanskrit_mantra_engineering", "nada_brahman"], problem: "p_mental" },
  hum_012: { research: ["scalar_em", "prana_kundalini"], problem: "p_rehab" },
  hum_013: { research: ["mccs_cellular_control", "chakra_nadi_anatomy"], problem: "p_mobility" },
  hum_014: { research: ["nada_brahman", "scalar_em"], problem: "p_literacy" },
  hum_015: { research: ["mind_body_coupling", "consciousness"], problem: "p_learning" },
  hum_016: { research: ["schauberger_implosion", "anenergy"], problem: "p_indoor_air" },
  hum_017: { research: ["mccs_cellular_control", "negentropy"], problem: "p_food" },
  hum_018: { research: ["scalar_em", "vacuum_structure"], problem: "p_early_warning" },
  hum_019: { research: ["schauberger_implosion", "negentropy"], problem: "p_infra" },
  hum_020: { research: ["mccs_cellular_control", "time_reversal_zone"], problem: "p_safety" },
};

const INVENTION_COLOR = "#a855f7";
const RESEARCH_COLOR_DEFAULT = "#06b6d4";

export function buildHumanitarianGraph() {
  const gNodes = [], gLinks = [];
  const seen = new Set();
  const addNode = (id, label, type, color, meta = {}) => {
    if (seen.has(id)) return;
    seen.add(id);
    gNodes.push({ id, label, type, color, ...meta });
  };
  const addLink = (source, target, kind) => {
    if (seen.has(source) && seen.has(target)) gLinks.push({ source, target, kind });
  };

  // Problem nodes
  HUMANITARIAN_PROBLEMS.forEach((p) => addNode(p.id, p.label, "problem", p.color, { icon: p.icon }));

  // Invention nodes + links to research + problem
  HUMANITARIAN_INVENTIONS.forEach((inv) => {
    const iid = `inv_${inv.id}`;
    addNode(iid, inv.name, "invention", INVENTION_COLOR, {
      category: inv.category,
      benefit: inv.humanitarianBenefit,
      fusion: inv.fusion,
      mechanism: inv.mechanism,
      tags: inv.tags,
    });
    const map = INVENTION_LINKS[inv.id];
    if (!map) return;
    map.research.forEach((rid) => addLink(iid, rid, "fusion"));
    addLink(iid, map.problem, "solves");
  });

  // Research nodes referenced by inventions (pulled from bearden data)
  const refIds = new Set();
  Object.values(INVENTION_LINKS).forEach((m) => m.research.forEach((r) => refIds.add(r)));
  refIds.forEach((id) => {
    const bn = beardenNodes.find((n) => n.id === id);
    if (bn) addNode(bn.id, bn.label, "research", groupColors[bn.group] || RESEARCH_COLOR_DEFAULT, { group: bn.group, description: bn.description });
  });

  return { nodes: gNodes, links: gLinks, problems: HUMANITARIAN_PROBLEMS };
}

export const NODE_TYPE_META = {
  invention: { label: "Dual-Tech Invention", radius: 11, fontSize: 9, labelColor: "#ddd" },
  research: { label: "Research Node", radius: 6, fontSize: 7, labelColor: "#88a" },
  problem: { label: "Humanitarian Problem", radius: 13, fontSize: 9, labelColor: "#fff" },
};