/**
 * Smart answer matching with typo tolerance.
 * Tries exact match first, then falls back to Levenshtein distance.
 */

export function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[\u2212\u2012\u2013\u2014\uFE58\uFE63\uFF0D]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/[×·]/g, "*")
    .replace(/\s*\*\s*/g, "*")
    .replace(/,\s+/g, ",")
    .replace(/\s*\(\s*/g, "(")
    .replace(/\s*\)\s*/g, ")")
    .replace(/--+/g, "-")
    .replace(/,(\d)/g, ".$1")
    .replace(/\s*(cm|m|mm|kg|g|hari|menit|detik|tahun|persen|%|rp|ribu|juta)\b/gi, "")
    .replace(/^\(([^()]+)\)$/, "$1")
    .replace(/(\d{3})\.(\d{3})(?=[.,\s]|$)/g, "$1$2");
}

/** Levenshtein edit distance between two strings */
function levenshtein(a: string, b: string): number {
  const la = a.length;
  const lb = b.length;
  if (la === 0) return lb;
  if (lb === 0) return la;

  const dp: number[][] = Array.from({ length: la + 1 }, () => Array(lb + 1).fill(0));
  for (let i = 0; i <= la; i++) dp[i][0] = i;
  for (let j = 0; j <= lb; j++) dp[0][j] = j;

  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // delete
        dp[i][j - 1] + 1,      // insert
        dp[i - 1][j - 1] + cost // substitute
      );
    }
  }
  return dp[la][lb];
}

/** Max allowed edit distance based on answer length */
function maxEditDistance(answerLen: number): number {
  if (answerLen <= 2) return 0;
  if (answerLen <= 5) return 2;
  return 3;
}

/**
 * Check if user input matches any accepted answer.
 * Strategy: exact match first, then fuzzy (Levenshtein) for typo tolerance.
 */
export function isAnswerClose(userInput: string, acceptedAnswers: string | string[]): boolean {
  const alternatives = Array.isArray(acceptedAnswers) ? acceptedAnswers : [acceptedAnswers];
  const normalized = normalizeAnswer(userInput);

  // 1. Exact match (fast path)
  if (alternatives.some((a) => normalizeAnswer(a) === normalized)) return true;

  // 2. Fuzzy match — only for non-empty input
  if (!normalized) return false;

  const threshold = maxEditDistance(normalized.length);
  if (threshold === 0) return false;

  return alternatives.some((a) => {
    const na = normalizeAnswer(a);
    const dist = levenshtein(normalized, na);
    return dist <= threshold;
  });
}
