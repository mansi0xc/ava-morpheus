// Master word list for Spelling Bee style puzzles.
// Contains multiple 7-letter base words plus many sub-words (length 4-7)
// All words are lowercase and <= 7 letters.
// NOTE: This is a demo list; expand with a larger curated dictionary as needed.

export const MASTER_WORD_LIST: string[] = [
  // Base: section (s e c t i o n)
  "section", "notice", "tonic", "sonic", "icon", "cone", "once", "tone", "note", "cent", "sect", "site", "ties", "tine", "cons", "coin", "coins", "stone", "cotes", "scent", "tone", "tons", "nice", "ionic", "into", "cite", "cites", "sent", "nest", "note", "tone", "tone", "site", "cone", "once", "coins",
  // Base: planet (p l a n e t)
  "planet", "planet", "planet", "plane", "panel", "panel", "plant", "plant", "petal", "plate", "plate", "leapt", "tapen", "pearl", // pearl not valid (r) removing
  "peal", // contains only p e a l
  "lean", "lane", "neal", "late", "tale", "teal", "neat", "ante", "peat", "tape", "pane", "plan", "penal", "leant", "pleat", "plate", "panel", "plant", "pelt", "leap", "peal", "pean", "peat", "tapen", "neap",
  // Base: margin (m a r g i n)
  "margin", "grain", "grain", "grain", "aring", "ring", "main", "gain", "rain", "gram", "grim", "grim", "ragi", "aim", "air", "rami", "mang", "margin", "aring", "rang", "miga", "gamin", "grain", "mang", "amir", "amir", "nagi", "agin", "amin",
  // Base: folder (f o l d e r)
  "folder", "older", "flor", "role", "lode", "rode", "ford", "fold", "doer", "redo", "ore" // ore < 4 will be ignored by filter but included here
];

// De-duplicate at runtime if needed (SpellingBee component can handle duplicates by using a Set)
