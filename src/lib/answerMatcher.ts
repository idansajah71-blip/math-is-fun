/**
 * Smart answer matching with typo tolerance.
 * Tries exact match first, then falls back to Levenshtein distance.
 */

export interface ApproachResult {
  status: "correct" | "close" | "wrong";
  credit: number;
  feedback: string;
}

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

/** Extract numbers from a normalized string */
function extractNumbers(s: string): number[] {
  const matches = s.match(/-?\d+\.?\d*/g);
  return matches ? matches.map(Number) : [];
}

/** Check if two number arrays have the same values (regardless of order) */
function sameNumbers(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.every((v, i) => v === sortedB[i]);
}

/**
 * Analyze user input against accepted answers with approach detection.
 * Returns status, credit, and targeted feedback.
 */
export function analyzeAnswer(
  userInput: string,
  acceptedAnswers: string | string[],
): ApproachResult {
  const alternatives = Array.isArray(acceptedAnswers) ? acceptedAnswers : [acceptedAnswers];
  const normalized = normalizeAnswer(userInput);

  if (!normalized) {
    return { status: "wrong", credit: 0, feedback: "" };
  }

  // 1. Exact match
  for (const a of alternatives) {
    if (normalizeAnswer(a) === normalized) {
      return { status: "correct", credit: 1, feedback: "" };
    }
  }

  // 2. Fuzzy match (Levenshtein)
  const threshold = maxEditDistance(normalized.length);
  if (threshold > 0) {
    for (const a of alternatives) {
      const na = normalizeAnswer(a);
      const dist = levenshtein(normalized, na);
      if (dist <= threshold) {
        // Close via fuzzy — check what kind of difference
        const userNums = extractNumbers(normalized);
        const answerNums = extractNumbers(na);

        // Format only (same numbers, different formatting)
        if (sameNumbers(userNums, answerNums) && userNums.length > 0) {
          return { status: "close", credit: 0.5, feedback: "Format jawaban perlu disesuaikan" };
        }

        // Missing negative sign
        if (userNums.length === answerNums.length) {
          const signDiff = userNums.filter((n, i) => Math.abs(n) === Math.abs(answerNums[i]) && n !== answerNums[i]);
          if (signDiff.length > 0 && signDiff.length <= 1) {
            return { status: "close", credit: 0.5, feedback: "Periksa tanda negatif pada jawaban" };
          }
        }

        return { status: "close", credit: 0.5, feedback: "Jawabanmu sudah mendekati, coba periksa lagi" };
      }
    }
  }

  // 3. Structural analysis against best matching alternative
  let bestAlt = alternatives[0];
  let bestDist = Infinity;
  for (const a of alternatives) {
    const na = normalizeAnswer(a);
    const dist = levenshtein(normalized, na);
    if (dist < bestDist) {
      bestDist = dist;
      bestAlt = a;
    }
  }

  const normalizedBest = normalizeAnswer(bestAlt);
  const userNums = extractNumbers(normalized);
  const answerNums = extractNumbers(normalizedBest);

  if (userNums.length > 0 && answerNums.length > 0) {
    // Swapped coordinates
    if (sameNumbers(userNums, answerNums) && userNums.length >= 2) {
      return { status: "close", credit: 0.5, feedback: "Urutan koordinatnya perlu dicek lagi" };
    }

    // One coordinate correct
    if (userNums.length === answerNums.length) {
      const correctCount = userNums.filter((n, i) => n === answerNums[i]).length;
      if (correctCount === 1 && userNums.length === 2) {
        const wrongIdx = userNums.findIndex((n, i) => n !== answerNums[i]);
        const axis = wrongIdx === 0 ? "x" : "y";
        return { status: "close", credit: 0.5, feedback: `Koordinat ${axis}-nya sudah tepat!` };
      }

      // Missing negative on one coord
      const signOnlyDiff = userNums.filter((n, i) => Math.abs(n) === Math.abs(answerNums[i]) && n !== answerNums[i]);
      if (signOnlyDiff.length > 0 && signOnlyDiff.length <= 1) {
        return { status: "close", credit: 0.5, feedback: "Periksa tanda negatif pada koordinat" };
      }
    }

    // Off by small value
    if (userNums.length === answerNums.length) {
      const offBy = userNums.map((n, i) => Math.abs(n - answerNums[i]));
      const maxOff = Math.max(...offBy);
      if (maxOff <= 2 && maxOff > 0) {
        return { status: "close", credit: 0.5, feedback: "Hampir! Angkanya kurang-lebih 1-2" };
      }
    }
  }

  // 4. Completely wrong
  return { status: "wrong", credit: 0, feedback: "" };
}

/**
 * Check if user input matches any accepted answer.
 * Strategy: exact match first, then fuzzy (Levenshtein) for typo tolerance.
 */
export function isAnswerClose(userInput: string, acceptedAnswers: string | string[]): boolean {
  const result = analyzeAnswer(userInput, acceptedAnswers);
  return result.status === "correct" || result.status === "close";
}
