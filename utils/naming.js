// utils/naming.js
// Professional folder & set naming utilities (JS version)

const STOPWORDS = new Set([
  "the",
  "and",
  "a",
  "an",
  "of",
  "to",
  "in",
  "for",
  "on",
  "with",
  "by",
  "is",
  "are",
  "be",
  "as",
  "at",
  "from",
  "that",
  "this",
  "it",
  "its",
  "into",
  "about",
  "or",
  "vs",
  "vs.",
  "your",
  "you",
  "we",
  "our",
]);

export function normalizeSpace(s) {
  return (s || "").toString().replace(/\s+/g, " ").trim();
}

export function titleCase(s) {
  return normalizeSpace(s)
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) =>
      i === 0 || w.length > 3 ? w[0]?.toUpperCase() + w.slice(1) : w
    )
    .join(" ")
    .trim();
}

export function sanitizePromptTopic(s) {
  if (!s) return "";
  // Strip quotes/emojis/weird whitespace, keep letters/numbers/basic separators
  let t = s
    .replace(/[\u201C\u201D"“”'‘’]/g, "") // quotes
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "") // emojis & symbols
    .replace(/[^\w\s\-:&/]/g, " ") // punctuation → space (keep - : & /)
    .replace(/\s+/g, " ") // collapse spaces
    .trim();

  // Look for common “about/on/topic:” patterns
  const m =
    t.match(/(?:about|on|topic|subject|regarding)\s*[:\-]\s*(.+)$/i) ||
    t.match(/^\s*(.+?)\s*:\s*$/); // “Something:”
  if (m && m[1]) t = m[1].trim();

  // Cap length and Title‑Case
  return titleCase(normalizeSpace(t).slice(0, 60));
}

export function getNextAvailableName(base, existingNames) {
  const b = normalizeSpace(base || "Untitled");
  const set = new Set((existingNames || []).map(normalizeSpace));
  if (!set.has(b)) return b;

  const pattern = new RegExp(`^${b}(?:\\s+(\\d+))?$`, "i");
  let max = 1;
  for (const name of set) {
    const m = name.match(pattern);
    if (m) {
      const n = m[1] ? parseInt(m[1], 10) : 1;
      if (!Number.isNaN(n)) max = Math.max(max, n);
    }
  }
  return `${b} ${max + 1}`;
}

export function suggestSetName(cards, userTopic) {
  // 1) Use explicit topic if provided
  if (userTopic && normalizeSpace(userTopic).length >= 3) {
    return titleCase(normalizeSpace(userTopic).slice(0, 60));
  }

  // 2) Extract keywords from the first ~30 cards
  const slice = Array.isArray(cards) ? cards.slice(0, 30) : [];
  const text = slice
    .map((c) => `${c?.term ?? ""} ${c?.definition ?? ""}`)
    .join(" ")
    .toLowerCase();

  const words = text
    .replace(/[\.\,\!\?\:\;\(\)\[\]\{\}\"\'\-\_]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));

  if (!words.length) return "Flashcards";

  const freq = new Map();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);

  const top = [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .map(([w]) => w);

  const unique = [];
  for (const w of top) {
    if (unique.length >= 4) break;
    if (!unique.some((u) => w.includes(u) || u.includes(w))) unique.push(w);
  }

  const raw =
    unique.length >= 2
      ? unique.slice(0, 3).join(" ")
      : slice[0]?.term || "Flashcards";
  return titleCase(normalizeSpace(raw).slice(0, 60));
}
