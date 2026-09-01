# Critical Issues Fix Plan

## Fix 1: q-sosial-3 Explanation (quizzes.ts:939)
**Problem:** Explanation is a copy-paste error from a different question about profit percentage.
**Question:** "(-5) x (-4) = -20" (True/False, correctIndex=1 meaning "Salah")
**Fix:** Replace explanation with: `"(-5) x (-4) = 20, bukan -20. Negatif x negatif = positif."`

## Fix 2: smp-spldv-t006 Wrong Answer (quizzes.ts:3038)
**Problem:** Question asks "3x + 2y = 16 dan x - y = 1. x = ..." with correctIndex=0 (option "4"). But x=4 is NOT a valid solution. The explanation itself admits the error.
**Fix:** Correct the question to a solvable system. Options:
- Change to: "3x + 2y = 14 dan x - y = 1. x = ..." → x=4, y=3 (check: 12+6=18≠14... no)
- Change to: "2x + y = 9 dan x - y = 3. x = ..." → x=4, y=1 (check: 8+1=9✓, 4-1=3✓)
- Update options, correctIndex, and explanation accordingly.

## Fix 3: MathContent XSS (MathContent.tsx:89,136,162)
**Problem:** `dangerouslySetInnerHTML` with `normalizeAndRenderMarkdown()` which inserts raw HTML from user content without escaping. The `escapeHtml()` function exists but is only used for KaTeX formulas, not for markdown text content.
**Fix:** Apply `escapeHtml()` to the captured groups in the markdown regex replacements (lines 204-217):
- `html.replace(/^### (.+)$/gm, "<h3>$1</h3>")` → escape `$1` before inserting
- Same for `**bold**`, `- list items`, and paragraph wrapping
- Or: create a helper `escapeMarkdownText()` that escapes HTML entities in captured text

## Fix 4: all-badges Count (gamification.ts:141)
**Problem:** `p.badges.length >= 33` but there are 33 badges total including "all-badges" itself. When user earns the 32nd badge (all non-"all-badges"), length is 32, but condition needs 33. Chicken-and-egg problem.
**Fix:** Change to `p.badges.length >= 32` (all badges except "all-badges" itself)

## Fix 5: quiz-creator Badge (gamification.ts:151)
**Problem:** Condition has `|| true` making it always true: `quizzes.filter(q => q.createdBy === "local" || true).length >= 5`
**Fix:** Remove `|| true` so the condition is: `quizzes.filter(q => q.createdBy === "local").length >= 5`
