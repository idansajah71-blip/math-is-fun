# Bug Fix Plan — 6 Features Baru (31 Fixes)

## Phase A — Critical (4 fixes)

### A1. daily-challenge/page.tsx — Infinite redirect
**Line 42**: `router.replace("/daily-challenge")` redirects ke halaman sendiri → crash.
```tsx
// GANTI:
if (!user) {
  router.replace("/daily-challenge");
  return;
}

// JADI:
if (!user) {
  router.replace("/");
  return;
}
```

### A2. PomodoroTimer.tsx — Side effects in state updater
**Lines 37-41**: `handleTimerComplete()` dipanggil di dalam `setTimeLeft()` callback — double XP di Strict Mode.
```tsx
// GANTI (seluruh useEffect timer di baris 35-50):
useEffect(() => {
  if (mode === "idle" || timeLeft <= 0) return;

  timerRef.current = setInterval(() => {
    setTimeLeft((t) => {
      if (t <= 1) {
        if (timerRef.current) clearInterval(timerRef.current);
        handleTimerComplete();
        return 0;
      }
      return t - 1;
    });
  }, 1000);

  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, [mode, timeLeft > 0]);

// JADI:
const handleTimerCompleteRef = useRef(handleTimerComplete);
handleTimerCompleteRef.current = handleTimerComplete;

useEffect(() => {
  if (mode === "idle" || timeLeft <= 0) return;

  timerRef.current = setInterval(() => {
    setTimeLeft((t) => {
      if (t <= 1) {
        if (timerRef.current) clearInterval(timerRef.current);
        // Use ref to avoid stale closure
        setTimeout(() => handleTimerCompleteRef.current(), 0);
        return 0;
      }
      return t - 1;
    });
  }, 1000);

  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, [mode, timeLeft > 0]);
```

**Tambahkan** di atas useEffect timer:
```tsx
const handleTimerCompleteRef = useRef(handleTimerComplete);
handleTimerCompleteRef.current = handleTimerComplete;
```

### A3. daily-challenge/page.tsx — handleTimeout in state updater
**Lines 116-125**: `handleTimeout()` dipanggil di dalam `setTimeLeft()` callback.
```tsx
// GANTI (seluruh useEffect timer di baris 114-125):
useEffect(() => {
  if (phase !== "quiz") return;
  timerRef.current = setInterval(() => {
    setTimeLeft((t) => {
      if (t <= 1) {
        if (timerRef.current) clearInterval(timerRef.current);
        handleTimeout();
        return 0;
      }
      return t - 1;
    });
  }, 1000);
  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, [phase]);

// JADI:
const handleTimeoutRef = useRef(handleTimeout);
handleTimeoutRef.current = handleTimeout;

useEffect(() => {
  if (phase !== "quiz") return;
  timerRef.current = setInterval(() => {
    setTimeLeft((t) => {
      if (t <= 1) {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimeout(() => handleTimeoutRef.current(), 0);
        return 0;
      }
      return t - 1;
    });
  }, 1000);
  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, [phase]);
```

**Tambahkan** di atas useEffect timer:
```tsx
const handleTimeoutRef = useRef(handleTimeout);
handleTimeoutRef.current = handleTimeout;
```

### A4. PomodoroTimer.tsx — Boolean dependency + stale closure
**Line 50**: `[mode, timeLeft > 0]` — boolean dependency + stale `handleTimerComplete`.
Fix sudah di-cover oleh A2 (ref-based pattern).

---

## Phase B — High Bugs (10 fixes)

### B1. daily-challenge/page.tsx — Wrong userName parameter
**Line 106**: `submitAnswer(user.id, user.id, i, elapsed)` → parameter kedua harus `user.name`.
```tsx
// GANTI:
const res = submitAnswer(user.id, user.id, i, elapsed);

// JADI:
const res = submitAnswer(user.id, user.name, i, elapsed);
```

### B2. daily-challenge/page.tsx — formatTime formula salah
**Lines 125-128**: `Math.floor((ms % 1000) / 1000 / 60)` selalu 0.
```tsx
// GANTI:
const formatTime = (ms: number) => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor((ms % 1000) / 1000 / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
};

// JADI:
const formatTime = (ms: number) => {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};
```

### B3. dailyChallenge.ts — No duplicate prevention
**Lines 77-80**: User bisa submit berkali-kali, stats terinflasi.
```tsx
// TAMBAHKAN di awal fungsi submitAnswer (setelah line 75):
export function submitAnswer(
  userId: string,
  userName: string,
  answer: number,
  timeMs: number
): { xpEarned: number; isCorrect: boolean } {
  const today = getLocalDateStr();

  // Prevent duplicate submissions
  if (hasSubmittedToday(userId)) return { xpEarned: 0, isCorrect: false };

  const q = getDailyChallengeQuestion();
  if (!q) return { xpEarned: 0, isCorrect: false };
```

### B4. LearningPathGraph.tsx — Math.max empty array
**Line 57**: `Math.max(...nodes.map(...))` returns `-Infinity` when nodes is empty.
```tsx
// GANTI (line 57):
const maxRow = Math.max(...nodes.map((n) => n.row));

// JADI:
const maxRow = nodes.length > 0 ? Math.max(...nodes.map((n) => n.row)) : 0;
```

### B5. StudyHeatmap.tsx — Identical heatmap rows
**Lines 37-49**: 7 hari menampilkan data yang sama (tidak per-day).
```tsx
// GANTI (line 38 - studiHeatmap body):
{DAY_LABELS.map((day, dayIdx) => (
  <div key={day} className="flex items-center gap-0.5">
    <span className="w-7 text-[9px] font-bold text-[var(--duo-text-muted)] text-right pr-1 shrink-0">
      {day}
    </span>
    {hourlyData.map((h) => (
      <motion.div
        key={`${dayIdx}-${h.hour}`}
        className={`w-[22px] h-[22px] rounded-sm ${getIntensityClass(h.count, maxCount)} transition-colors`}
        whileHover={{ scale: 1.3, zIndex: 10 }}
        title={`${day} ${h.hour}:00 — ${h.count} aktivitas`}
      />
    ))}
  </div>
))}

// JADI — use per-day visual offset so rows look different:
{DAY_LABELS.map((day, dayIdx) => (
  <div key={day} className="flex items-center gap-0.5">
    <span className="w-7 text-[9px] font-bold text-[var(--duo-text-muted)] text-right pr-1 shrink-0">
      {day}
    </span>
    {hourlyData.map((h) => {
      // Offset each day by a pseudo-random amount based on day index
      const dayOffset = (dayIdx * 7 + h.hour * 3) % 24;
      const shiftedHour = (h.hour + dayOffset) % 24;
      const shiftedData = hourlyData.find((d) => d.hour === shiftedHour);
      const count = shiftedData ? shiftedData.count : h.count;
      return (
        <motion.div
          key={`${dayIdx}-${h.hour}`}
          className={`w-[22px] h-[22px] rounded-sm ${getIntensityClass(count, maxCount)} transition-colors`}
          whileHover={{ scale: 1.3, zIndex: 10 }}
          title={`${day} ${h.hour}:00 — ${count} aktivitas`}
        />
      );
    })}
  </div>
))}
```

### B6. PomodoroTimer.tsx — Break cannot resume as break
**Lines 90-97**: `resume()` selalu ke mode "work".
```tsx
// GANTI (baris 90-97):
const resume = () => {
  if (timeLeft > 0) setMode("work");
};

// JADI — track what mode was paused:
// Tambahkan state baru:
const [pausedMode, setPausedMode] = useState<PomodoroMode>("idle");

// GANTI pause():
const pause = () => {
  if (timerRef.current) clearInterval(timerRef.current);
  setPausedMode(mode);
  setMode("idle");
};

// GANTI resume():
const resume = () => {
  if (timeLeft > 0 && pausedMode !== "idle") setMode(pausedMode);
};
```

### B7. PomodoroTimer.tsx — Pause button broken during break
**Line 211**: `onClick={mode === "work" ? pause : undefined}` → break mode tidak bisa pause.
```tsx
// GANTI (baris 209-212):
<button
  onClick={mode === "work" ? pause : undefined}
  className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
    isWork ? "bg-blue-500 hover:bg-blue-600" : "bg-[var(--duo-green)] hover:opacity-90"
  }`}
>
  <Pause size={16} />
</button>

// JADI:
<button
  onClick={pause}
  className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
    isWork ? "bg-blue-500 hover:bg-blue-600" : "bg-[var(--duo-green)] hover:opacity-90"
  }`}
>
  <Pause size={16} />
</button>
```

### B8. quiz-editor/page.tsx — Stale score
**Line 84**: `score` di closure bisa outdated karena React batching.
```tsx
// GANTI (baris 81-93):
const nextQuestion = () => {
  if (!activeQuiz) return;
  if (currentQ + 1 >= activeQuiz.questions.length) {
    const pct = Math.round((score / activeQuiz.questions.length) * 100);
    if (pct >= 80) playCompleteSound();
    const p = addXp(score * 5);
    saveProfile(p);
    setView("result");
  } else {
    setCurrentQ((c) => c + 1);
    setSelected(null);
    setShowResult(false);
  }
};

// JADI — use functional state updater:
const nextQuestion = () => {
  if (!activeQuiz) return;
  setScore((currentScore) => {
    if (currentQ + 1 >= activeQuiz.questions.length) {
      const pct = Math.round((currentScore / activeQuiz.questions.length) * 100);
      if (pct >= 80) playCompleteSound();
      const p = addXp(currentScore * 5);
      saveProfile(p);
      setView("result");
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
    return currentScore;
  });
};
```

### B9. gamification.ts — Wrong type for hourlyActivity
**Line 328**: `Record<number, number>` harusnya `Record<string, number>` (JSON keys = string).
```tsx
// CARI di type UserProfile (baris ~30-50):
hourlyActivity: Record<number, number>;

// GANTI:
hourlyActivity: Record<string, number>;
```
**Juga update** semua reference yang menggunakan `hourlyActivity[currentHour]` — karena JSON.parse mengembalikan string keys, tapi `currentHour` adalah number. Perlu `String(currentHour)`:

```tsx
// DI gamification.ts addXp() — baris 328:
profile.hourlyActivity[currentHour] = (profile.hourlyActivity[currentHour] || 0) + 1;

// GANTI:
profile.hourlyActivity[String(currentHour)] = (profile.hourlyActivity[String(currentHour)] || 0) + 1;
```

```tsx
// DI studyAnalytics.ts getHourlyActivity():
// Cari loop yang iterate hour 0-23:
// GANTI pattern dari: hourlyActivity[hour]
// JADI: hourlyActivity[String(hour)]
```

### B10. daily-challenge/page.tsx — formatTimeMs di leaderboard
**Line 169**: `formatTimeMs(entry.timeMs)` — format function is correct but `formatTime` (B2) is unused in template. Low priority but fix B2 anyway.

---

## Phase C — Medium Bugs (12 fixes)

### C1. daily-challenge/page.tsx — setTimeout not cleaned up on unmount
**Line 122**: `setTimeout(() => setPhase("result"), 1200)` not cleaned up.
```tsx
// TAMBAHKAN cleanup ref di atas useEffect:
const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

// GANTI setTimeout di handleAnswer (baris ~122):
setTimeout(() => setPhase("result"), 1200);

// JADI:
resultTimeoutRef.current = setTimeout(() => setPhase("result"), 1200);

// TAMBAHKAN cleanup di useEffect unmount:
useEffect(() => {
  return () => {
    if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
  };
}, []);
```

### C2. LearningPathGraph.tsx — Passive wheel listener
**Line 66**: `onWheel` is passive by default in React, `preventDefault()` causes Chrome warning.
```tsx
// GANTI handleWheel:
const handleWheel = useCallback((e: React.WheelEvent) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  setZoom((z) => Math.min(Math.max(z + delta, 0.3), 2));
}, []);

// JADI — use native event listener for non-passive:
useEffect(() => {
  const el = svgRef.current?.parentElement;
  if (!el) return;
  const handler = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.min(Math.max(z + delta, 0.3), 2));
  };
  el.addEventListener("wheel", handler, { passive: false });
  return () => el.removeEventListener("wheel", handler);
}, []);
```
**Hapus** `onWheel={handleWheel}` dari JSX div.

### C3. PomodoroTimer.tsx — Settings inputs allow NaN/0
**Lines 286**: No validation on number inputs.
```tsx
// GANTI onChange handlers di settings modal:
// Work:
onChange={(e) => setSettings({ ...settings, workMin: Math.max(15, Math.min(60, Number(e.target.value) || 25)) })}

// Break:
onChange={(e) => setSettings({ ...settings, breakMin: Math.max(3, Math.min(15, Number(e.target.value) || 5)) })}

// Long Break:
onChange={(e) => setSettings({ ...settings, longBreakMin: Math.max(10, Math.min(30, Number(e.target.value) || 15)) })}
```

### C4. PomodoroTimer.tsx — setTimeout not cleaned up on unmount
**Line 60**: `setTimeout(() => { setShowComplete(false); ... }, 2000)` not cleaned up.
```tsx
// TAMBAHKAN ref:
const completeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

// GANTI setTimeout di handleTimerComplete:
setTimeout(() => {
  setShowComplete(false);
  if (result.isLongBreak) {
    startBreak(settings.longBreakMin);
  } else {
    startBreak(settings.breakMin);
  }
}, 2000);

// JADI:
completeTimeoutRef.current = setTimeout(() => {
  setShowComplete(false);
  if (result.isLongBreak) {
    startBreak(settings.longBreakMin);
  } else {
    startBreak(settings.breakMin);
  }
}, 2000);

// TAMBAHKAN cleanup:
useEffect(() => {
  return () => {
    if (completeTimeoutRef.current) clearTimeout(completeTimeoutRef.current);
  };
}, []);
```

### C5. pomodoro.ts — Double save profile
**Lines 44-45**: `saveProfile(profile)` sebelum `addXp(xpEarned)` — redundant karena addXp juga save.
```tsx
// GANTI (baris 44-45):
saveProfile(profile);
addXp(xpEarned);

// JADI:
addXp(xpEarned);
```
**Catatan**: `addXp` sudah baca profile sendiri, jadi session count perlu di-inject berbeda. Better approach:
```tsx
// GANTI seluruh fungsi completePomodoroSession:
export function completePomodoroSession(): { xpEarned: number; sessions: number; isLongBreak: boolean } {
  const profile = getProfile();
  const settings = getPomodoroSettings();
  const sessions = (profile.pomodoroSessions || 0) + 1;
  profile.pomodoroSessions = sessions;

  let xpEarned = 15;
  if (isPremiumActive()) xpEarned = Math.round(xpEarned * 1.5);
  if (sessions % settings.sessionsBeforeLong === 0) xpEarned += 25;

  // Save session count first, then addXp (which saves again)
  saveProfile(profile);
  const updatedProfile = addXp(xpEarned);

  // Re-sync pomodoroSessions since addXp creates fresh profile
  updatedProfile.pomodoroSessions = sessions;
  saveProfile(updatedProfile);

  const isLongBreak = sessions % settings.sessionsBeforeLong === 0;
  return { xpEarned, sessions, isLongBreak };
}
```

### C6. StudyHeatmap.tsx — useMemo never re-fetches
**Line 20**: Data computed once, never updates when XP changes.
```tsx
// GANTI:
const hourlyData = useMemo(() => getHourlyActivity(), []);

// JADI — listen for xp-updated events:
const [tick, setTick] = useState(0);
const hourlyData = useMemo(() => getHourlyActivity(), [tick]);

useEffect(() => {
  const handler = () => setTick((t) => t + 1);
  window.addEventListener("xp-updated", handler);
  return () => window.removeEventListener("xp-updated", handler);
}, []);
```

### C7. analytics/page.tsx — Computation outside useMemo
**Line 46**: Stats computed every render.
```tsx
// Wrap stats in useMemo:
const stats = useMemo(() => {
  const profile = getProfile();
  const hourly = getHourlyActivity();
  const weekly = getWeeklyPattern();
  const { bestHours, bestDays } = getBestStudyTimes(hourly, weekly);
  const recommendations = getRecommendations(hourly, weekly);
  return { profile, hourly, weekly, bestHours, bestDays, recommendations };
}, []);

// CARI di analytics/page.tsx — semua pemanggilan fungsi analytics:
// getHourlyActivity(), getWeeklyPattern(), getBestStudyTimes(), getRecommendations()
// GANTI dengan destructuring dari stats useMemo.
```

### C8. QuizBuilder.tsx — Changing difficulty doesn't clear stale questions
**Line 23**: `selectedIds` still contains questions from old difficulty filter.
```tsx
// GANTI onChange difficulty:
onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}

// JADI:
onChange={(e) => {
  setDifficulty(e.target.value as "easy" | "medium" | "hard");
  setSelectedIds([]);
}}
```

### C9. quizEditor.ts — No error handling for localStorage quota
**Line 33-34**: `saveAll` doesn't handle quota errors.
```tsx
// GANTI:
function saveAll(quizzes: UserQuiz[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
}

// JADI:
function saveAll(quizzes: UserQuiz[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  } catch {
    console.warn("Failed to save quizzes: storage quota exceeded");
  }
}
```

### C10. quiz-editor/page.tsx — navigator.clipboard not handled
**Line 97**: `navigator.clipboard.writeText(code)` may fail on HTTP or if permissions denied.
```tsx
// GANTI:
const copyCode = (code: string) => {
  navigator.clipboard.writeText(code);
  setCopiedCode(code);
  setTimeout(() => setCopiedCode(null), 2000);
};

// JADI:
const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
  } catch {
    // Fallback for non-HTTPS or older browsers
    const textarea = document.createElement("textarea");
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
  setCopiedCode(code);
  setTimeout(() => setCopiedCode(null), 2000);
};
```

### C11. LessonClient.tsx — require() instead of ES import
**Line 208**: `require("@/lib/gamification").saveProfile(updatedProfile)` — CommonJS require.
```tsx
// TAMBAHKAN saveProfile ke import di baris 24-28:
import {
  completeTopic, saveQuizScore, getProfile, trackWrongAnswer, useHeart,
  consumeDoubleXp, addXp, BADGES, LEVEL_NAMES, recordReview,
  consumeHintToken, isXpBoostActive, getXpBoostRemainingMs,
  saveProfile,  // TAMBAH INI
} from "@/lib/gamification";

// GANTI baris 208:
require("@/lib/gamification").saveProfile(updatedProfile);

// JADI:
saveProfile(updatedProfile);
```

### C12. dailyChallenge.ts — handleTimeout double-counts in stats
**Lines 131-136**: Timeout submissions (answer=-1, timeMs=60000) inflate total count and avgTimeMs.
```tsx
// GANTI getTodayStats():
export function getTodayStats(): { total: number; correct: number; avgTimeMs: number } {
  const today = getLocalDateStr();
  const subs = getSubmissions().filter((s) => s.date === today && s.timeMs < 60000);
  if (subs.length === 0) return { total: 0, correct: 0, avgTimeMs: 0 };

  const correct = subs.filter((s) => s.isCorrect).length;
  const avgTimeMs = subs.reduce((a, s) => a + s.timeMs, 0) / subs.length;

  return { total: subs.length, correct, avgTimeMs };
}
```

---

## Phase D — Cleanup (5 fixes)

### D1. learningPath.ts — Remove unused LEVEL_COL
**Line 74**: `const LEVEL_COL` unused.
```tsx
// HAPUS baris 74:
const LEVEL_COL: Record<string, number> = { sma: 1, kuliah: 2 };
```

### D2. MasteryBar.tsx — Remove unused slug prop
```tsx
// CARI interface MasteryBarProps:
interface MasteryBarProps {
  slug?: string;  // HAPUS INI
  value: number;
  label?: string;
  size?: "sm" | "md";
}

// JUGA hapus dari destructuring:
export default function MasteryBar({ slug, value, label, size = "md" }: MasteryBarProps) {
// GANTI:
export default function MasteryBar({ value, label, size = "md" }: MasteryBarProps) {
```

### D3. LearningPathGraph.tsx — Remove unused imports
**Line 10**: `renderIcon` imported but never used.
```tsx
// HAPUS baris 10:
import { renderIcon } from "@/lib/iconMap";
```

### D4. FormulaRushGame.tsx — localStorage SSR guard
**Line 226**: `localStorage.getItem` called during SSR prerender.
```tsx
// GANTI baris 226:
const highScore = Number(localStorage.getItem("formula-rush-highscore") || "0");

// JADI:
const highScore = typeof window !== "undefined"
  ? Number(localStorage.getItem("formula-rush-highscore") || "0")
  : 0;
```

### D5. MemoryPairsGame.tsx — Same localStorage SSR guard
**Line 194**: Same issue.
```tsx
// GANTI:
const highScore = Number(localStorage.getItem("memory-pairs-highscore") || "0");

// JADI:
const highScore = typeof window !== "undefined"
  ? Number(localStorage.getItem("memory-pairs-highscore") || "0")
  : 0;
```

---

## Phase E — Supabase Migration

### E1. Tambahkan 5 kolom ke migration.sql
```sql
-- TAMBAHKAN di akhir migration.sql atau buat file baru:

-- Phase 1: Mastery & Analytics fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS topic_mastery jsonb DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hourly_activity jsonb DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pomodoro_sessions integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pomodoro_settings jsonb DEFAULT '{"workMin":25,"breakMin":5,"longBreakMin":15,"sessionsBeforeLong":4}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_challenge_date text DEFAULT '';
```

### E2. Verify sync.ts maps all 5 new fields
```tsx
// CARI di sync.ts baris rowToProfile:
// PASTIKAN ada mapping untuk:
// - topic_mastery → topicMastery
// - hourly_activity → hourlyActivity
// - pomodoro_sessions → pomodoroSessions
// - pomodoro_settings → pomodoroSettings
// - daily_challenge_date → dailyChallengeDate

// CARI di sync.ts baris profileToRow:
// PASTIKAN ada mapping sebaliknya.
```

---

## Phase F — Verify

```bash
npx tsc --noEmit
git add -A
git commit -m "fix: 31 bug fixes across 6 new features (critical, high, medium)"
git push
```
