// USPTO Patent Claim Formatting Rules & Validators

export const CLAIM_RULES = {
  independent: [
    {
      id: "starts_with_article",
      label: "Starts with 'A', 'An', or 'The'",
      test: (text) => /^(A|An|The)\s/i.test(text.trim()),
      hint: "Independent claims must begin with 'A', 'An', or 'The'.",
    },
    {
      id: "ends_with_period",
      label: "Ends with a period (.)",
      test: (text) => text.trim().endsWith("."),
      hint: "Each claim must end with a single period.",
    },
    {
      id: "no_vague_terms",
      label: "No indefinite terms",
      test: (text) => !/\b(approximately|about|substantially|etc\.?|and\/or)\b/i.test(text),
      hint: "Avoid vague terms like 'approximately', 'substantially', 'etc.' — use precise language.",
    },
    {
      id: "comprising_or_consisting",
      label: "Uses 'comprising', 'consisting of', or 'including'",
      test: (text) => /\b(comprising|consisting of|consisting essentially of|including)\b/i.test(text),
      hint: "Use an open-ended transitional phrase: 'comprising' (preferred), 'consisting of', or 'including'.",
    },
    {
      id: "min_length",
      label: "At least 20 words",
      test: (text) => text.trim().split(/\s+/).length >= 20,
      hint: "Claims must be substantive — at least 20 words.",
    },
    {
      id: "no_double_period",
      label: "No double periods",
      test: (text) => !text.includes(".."),
      hint: "Remove double periods — each claim ends with exactly one period.",
    },
  ],
  dependent: [
    {
      id: "references_claim",
      label: "References a prior claim number",
      test: (text) => /\bclaim\s+\d+\b/i.test(text),
      hint: "Dependent claims must reference a prior claim (e.g., 'The system of claim 1, wherein...').",
    },
    {
      id: "wherein_or_further",
      label: "Uses 'wherein', 'further comprising', or 'where'",
      test: (text) => /\b(wherein|further comprising|where|further including|further defined)\b/i.test(text),
      hint: "Dependent claims typically use 'wherein' or 'further comprising' to add limitations.",
    },
    {
      id: "ends_with_period",
      label: "Ends with a period (.)",
      test: (text) => text.trim().endsWith("."),
      hint: "Each claim must end with a single period.",
    },
    {
      id: "min_length",
      label: "At least 10 words",
      test: (text) => text.trim().split(/\s+/).length >= 10,
      hint: "Dependent claims must add a meaningful limitation.",
    },
  ],
};

export const ABSTRACT_RULES = [
  {
    id: "word_count",
    label: "150–250 words (USPTO preferred)",
    test: (text) => { const w = text.trim().split(/\s+/).length; return w >= 100 && w <= 300; },
    hint: "USPTO guidelines recommend abstracts of 150–250 words.",
  },
  {
    id: "no_first_person",
    label: "No first-person language",
    test: (text) => !/\b(I|we|our|my)\b/i.test(text),
    hint: "Abstracts must be written in third person — no 'I', 'we', 'our', or 'my'.",
  },
  {
    id: "one_paragraph",
    label: "Single paragraph",
    test: (text) => text.trim().split(/\n\n+/).length === 1,
    hint: "USPTO requires abstracts to be a single paragraph.",
  },
];

export const TITLE_RULES = [
  {
    id: "max_length",
    label: "500 characters or fewer",
    test: (text) => text.trim().length <= 500,
    hint: "USPTO limits titles to 500 characters.",
  },
  {
    id: "no_articles_start",
    label: "Does not start with 'A', 'An', or 'The'",
    test: (text) => !/^(A|An|The)\s/i.test(text.trim()),
    hint: "USPTO discourages starting titles with articles like 'A', 'An', or 'The'.",
  },
  {
    id: "min_length",
    label: "At least 5 characters",
    test: (text) => text.trim().length >= 5,
    hint: "Title must be descriptive.",
  },
];

export function validateField(text, rules) {
  if (!text || !text.trim()) return rules.map(r => ({ ...r, passed: false }));
  return rules.map(r => ({ ...r, passed: r.test(text) }));
}

export function getCompletionScore(doc) {
  const sections = [
    doc.title?.trim(),
    doc.abstract?.trim(),
    doc.field?.trim(),
    doc.background?.trim(),
    doc.summary?.trim(),
    doc.claims?.independent?.some(c => c.trim()),
    doc.claims?.dependent?.some(c => c.trim()),
    doc.description?.trim(),
    doc.inventors?.length > 0,
  ];
  const filled = sections.filter(Boolean).length;
  return Math.round((filled / sections.length) * 100);
}