/**
 * 24-hour trial pass management.
 * The trial start timestamp is written to localStorage when the user accepts the NDA.
 * This hook reads it and exposes whether the trial is active and how much time remains.
 */

export const TRIAL_KEY = "zarp_trial_pass_v1";
export const TRIAL_DURATION_MS = 0; // killed

export function startTrialPass() {}

export function getTrialPass() {
  return { active: false, startedAt: null, remainingMs: 0 };
}

export function isTrialActive() {
  return false;
}

export function clearTrialPass() {
  localStorage.removeItem(TRIAL_KEY);
}