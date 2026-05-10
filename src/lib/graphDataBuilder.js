// Builds D3-compatible graph data from entity records

const COLORS = {
  invention: "#00E5FF",
  claim: "#a855f7",
  prior_art: "#f97316",
  patent_family: "#22c55e",
  competitor: "#ef4444",
  market: "#fbbf24",
};

const RISK_KEYWORDS = ["suppress", "deny", "reject", "block", "conflict"];

function riskScore(entry) {
  const text = [entry.description, entry.title, entry.notes].join(" ").toLowerCase();
  let score = 0;
  RISK_KEYWORDS.forEach(k => { if (text.includes(k)) score += 20; });
  if (entry.outcome === "Suppressed") score += 40;
  if (entry.outcome === "Patent Denied") score += 20;
  if (entry.rejection_grounds) score += 15;
  return Math.min(score, 100);
}

export function buildGraphData({ inventions = [], priorArt = [], opportunities = [], alerts = [] }) {
  const nodes = [];
  const links = [];
  const nodeIds = new Set();

  const addNode = (id, label, type, meta = {}) => {
    if (nodeIds.has(id)) return;
    nodeIds.add(id);
    nodes.push({ id, label, type, color: COLORS[type] || "#888", ...meta });
  };

  const addLink = (source, target, label = "", strength = 0.3) => {
    if (nodeIds.has(source) && nodeIds.has(target)) {
      links.push({ source, target, label, strength });
    }
  };

  // Inventions
  inventions.forEach((inv, i) => {
    const id = `inv_${inv.id || i}`;
    addNode(id, inv.hybrid_concept?.slice(0, 40) || `Invention ${i + 1}`, "invention", {
      description: inv.mechanism,
      synergy_score: inv.synergy_score,
      ip_valuation: inv.ip_valuation,
      status: inv.status,
      degree: 0,
    });

    // Claims from invention
    if (inv.patent_claims) {
      const claimId = `claim_${inv.id || i}`;
      addNode(claimId, `Claims: ${inv.hybrid_concept?.slice(0, 30) || "Invention"}`, "claim", {
        description: inv.patent_claims?.slice(0, 200),
        parent_invention: id,
      });
      addLink(id, claimId, "has claims", 0.6);
    }

    // Market sectors
    if (inv.market_sectors?.length) {
      inv.market_sectors.forEach((sector, si) => {
        const mId = `market_${sector.replace(/\s/g, "_")}`;
        addNode(mId, sector, "market", { description: `Market sector: ${sector}` });
        addLink(id, mId, "targets", 0.2);
      });
    }
  });

  // Prior Art
  priorArt.forEach((art, i) => {
    const id = `pa_${art.id || i}`;
    const risk = riskScore(art);
    addNode(id, `${art.title?.slice(0, 35)} (${art.year})`, "prior_art", {
      description: art.description,
      inventor: art.inventor,
      year: art.year,
      category: art.category,
      outcome: art.outcome,
      risk_score: risk,
      risk_level: risk >= 60 ? "high" : risk >= 30 ? "medium" : "low",
      patent_numbers: art.patent_numbers,
    });

    // Patent family grouping
    if (art.patent_numbers) {
      const famId = `fam_${art.category?.replace(/\s/g, "_") || i}`;
      addNode(famId, `${art.category || "General"} Patent Family`, "patent_family", {
        description: `Patent family: ${art.category}`,
        category: art.category,
      });
      addLink(id, famId, "belongs to", 0.4);
    }

    // Link prior art to inventions in same category
    inventions.forEach((inv, j) => {
      const invId = `inv_${inv.id || j}`;
      const invText = [inv.hybrid_concept, inv.mechanism].join(" ").toLowerCase();
      const artCategory = art.category?.toLowerCase() || "";
      if (artCategory && invText.includes(artCategory.split(" ")[0])) {
        addLink(id, invId, "conflicts with", 0.15);
      }
    });
  });

  // Opportunities as market/competitor nodes
  opportunities.forEach((opp, i) => {
    if (!opp.alias) return;
    const id = `opp_${opp.id || i}`;
    addNode(id, opp.alias?.slice(0, 35), "market", {
      description: opp.headline,
      stage: opp.stage,
      funding_ask: opp.funding_ask,
      ip_valuation: opp.ip_valuation,
      category: opp.category,
    });

    // Link to relevant prior art by category
    priorArt.forEach((art, j) => {
      if (art.category === opp.category) {
        addLink(`pa_${art.id || j}`, id, "informs", 0.1);
      }
    });
  });

  // Compute degree centrality
  const degreeMap = {};
  links.forEach(l => {
    const srcId = typeof l.source === "object" ? l.source.id : l.source;
    const tgtId = typeof l.target === "object" ? l.target.id : l.target;
    degreeMap[srcId] = (degreeMap[srcId] || 0) + 1;
    degreeMap[tgtId] = (degreeMap[tgtId] || 0) + 1;
  });
  nodes.forEach(n => { n.degree = degreeMap[n.id] || 0; });

  return { nodes, links };
}