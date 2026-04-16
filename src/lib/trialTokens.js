// Trial token management for beta users
// Grants 1 free use of Invention Forge and Patent Claims Generator

const TOKEN_KEY = "zarp_trial_tokens_v1";

function loadTokens() {
  try { return JSON.parse(localStorage.getItem(TOKEN_KEY) || "{}"); }
  catch { return {}; }
}

function saveTokens(data) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
}

export const TRIAL_FEATURES = {
  invention_forge: "invention_forge",
  patent_claims: "patent_claims",
};

export function hasTrialToken(feature) {
  const tokens = loadTokens();
  return tokens[feature] !== "used";
}

export function consumeTrialToken(feature) {
  const tokens = loadTokens();
  tokens[feature] = "used";
  saveTokens(tokens);
}

export function getTrialStatus(feature) {
  const tokens = loadTokens();
  return tokens[feature] === "used" ? "used" : "available";
}