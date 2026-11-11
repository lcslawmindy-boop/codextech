// Advisory analysis of the ZDS / Aethon Apex / AuraWell package, derived ONLY from the three source PDFs.
// Indicative, internal, unverified. Not an independent valuation.

export const FACTS = [
  ["Inventions documented", "33 (INV-01 to INV-33) across 6 domains"],
  ["Engineering milestone", "Preliminary Design Review complete (AX-ZDS-PDR-001 Rev 1.0, 30 Jun 2026)"],
  ["Patent status", "Claim drafts in preparation. NONE filed with the USPTO"],
  ["Revenue / licenses", "None. No active government or commercial licenses"],
  ["Independent IP valuation", "None conducted"],
  ["Grant proposals", "Drafts only. None submitted (AFWERX, Army ARL SBIR)"],
  ["Export control", "DDTC / ITAR registration not yet done (planned H2 2026). EW items flagged ITAR-controlled"],
  ["Ownership", "Founder-owned, no prior equity issued"],
  ["Stated ask (teaser)", "$1M or more for 30% or more equity"],
  ["Stated ask (briefing)", "$5M to $12M (SBIR bridge / equity / OTA pre-finance)"],
];

// HDG rubric (Appendix C), indicative self-score. Committee must confirm.
export const SCORECARD = [
  { name: "Technology readiness (TRL)", max: 20, score: 8, why: "PDR complete, design stage only. Roughly TRL 3 to 4" },
  { name: "Dual-use proof points", max: 25, score: 4, why: "No deployment in either domain. Theoretical dual-use" },
  { name: "Regulatory clearance", max: 15, score: 3, why: "No ITAR/EAR classification complete, DDTC not registered" },
  { name: "Government interest", max: 20, score: 2, why: "Identified programs, none engaged, no LOI" },
  { name: "Licensing velocity", max: 10, score: 0, why: "No licensees identified or executed" },
  { name: "Claim breadth", max: 10, score: 0, why: "No claims filed or granted. Drafts only" },
];

export const METHODS = [
  { method: "Deal-implied (teaser terms)", low: 2_300_000, high: 3_300_000, note: "$1M for 30% implies $3.3M post-money, $2.3M pre-money. Reflects the founder's ask, not market evidence." },
  { method: "Cost / replacement approach", low: 800_000, high: 2_500_000, note: "33 inventions x $25k to $75k of documented design effort (assumption). Excludes the unrecorded PDR package." },
  { method: "Risk-adjusted option value", low: 500_000, high: 1_500_000, note: "Unfiled, pre-revenue, pre-clearance IP. Value is mostly the option to file and license." },
];

export const BLENDED = { low: 1_000_000, high: 3_000_000 };

export const FINDINGS = [
  { sev: "high", t: "Asks do not reconcile", d: "The teaser seeks $1M+ for 30%+ equity. The briefing seeks $5M to $12M for Zenith and $23M to $45M across the portfolio. Pick one story before any outreach." },
  { sev: "high", t: "No filed patents", d: "Everything is drafts. Public disclosure before filing can destroy novelty. Prioritize provisional filings (low cost) before any wider sharing." },
  { sev: "high", t: "Business plan revenue is not supported", d: "The plan shows $3M revenue in 2026 and 3 to 5 licenses, but the briefing says no revenue and no licenses exist. Label projections as targets, not forecasts." },
  { sev: "high", t: "ITAR exposure", d: "EW and secure-comms inventions (INV-07 to INV-12) are marked ITAR-controlled. Registration and a Technology Control Plan should precede any foreign-national or broad data-room access." },
  { sev: "med", t: "Three-entity messaging", d: "Aethon Apex, AuraWell and Zenith are described as independent entities. Confirm legal structure and IP assignment before diligence." },
  { sev: "med", t: "Unverified valuation claims", d: "The ~$15M FMG-100 figure is internal only. Do not quote it without an independent valuation." },
  { sev: "med", t: "Personal contact details", d: "The teaser prints a phone number and personal email. Replace with a role address before it is shared." },
];

export const VDR_FOLDERS = [
  { company: "Aethon Apex IP Holdings", folders: 9, docs: 31, items: "HDG framework, 6-vertical IP portfolio, 5-year model (unaudited), OTA strategy, patent filing schedule" },
  { company: "AuraWell / ScalarForge", folders: 8, docs: 27, items: "AATCS-P1 Rev B package, FMG-100 build plan, IP-backed loan dossier, internal IP estimate (unverified)" },
  { company: "Zenith Defense Systems", folders: 6, docs: 17, items: "33-invention portfolio, PDR package, GSM-10 manual, CodexBot build plan" },
];

export const money = (n) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${Math.round(n / 1000)}k`);