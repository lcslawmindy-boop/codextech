/**
 * 24-hour trial pass management.
 * The trial start timestamp is written to localStorage when the user accepts the NDA.
 * This hook reads it and exposes whether the trial is active and how much time remains.
 */

export const TRIAL_KEY = "zarp_trial_pass_v1";
export const TRIAL_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function startTrialPass() {
  const existing = localStorage.getItem(TRIAL_KEY);
  if (!existing) {
    localStorage.setItem(TRIAL_KEY, JSON.stringify({ startedAt: Date.now() }));
  }
}

export function getTrialPass() {
  try {
    const raw = localStorage.getItem(TRIAL_KEY);
    if (!raw) return { active: false, startedAt: null, remainingMs: 0 };
    const { startedAt } = JSON.parse(raw);
    const elapsed = Date.now() - startedAt;
    const active = elapsed < TRIAL_DURATION_MS;
    const remainingMs = active ? TRIAL_DURATION_MS - elapsed : 0;
    return { active, startedAt, remainingMs };
  } catch {
    return { active: false, startedAt: null, remainingMs: 0 };
  }
}

export function isTrialActive() {
  return getTrialPass().active;
}

export function clearTrialPass() {
  localStorage.removeItem(TRIAL_KEY);
}