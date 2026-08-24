# BelajarMTK

Matematika seru seperti game — dari SMP hingga Universitas.

> "Brilliant-nya matematika Indonesia, dengan maskot & habit-loop sekelas Duolingo."

## Features

- **50+ topik** matematika Indonesia (SMP, SMA, Kuliah) dengan konten LaTeX
- **Soal interaktif** — multiple choice, fill-in-the-blank, drag number line, sorting, equation builder
- **Gamifikasi lengkap** — XP, level, streak, hearts, badges, shop, daily rewards
- **Maskot reaktif** — berubah mood & pesan berdasarkan progres, streak, dan topik lemah
- **Leaderboard** real-time via Supabase
- **Dark mode** & accent color themes
- **Sound effects** (Web Audio API)
- **120+ soal quiz** dengan pembahasan

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, Framer Motion |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| State | localStorage + Supabase sync |
| Math | KaTeX |
| Icons | Lucide React |
| Testing | Vitest |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase keys

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase Setup

1. Create a project at [app.supabase.com](https://app.supabase.com)
2. Go to **SQL Editor** and run `supabase/migration.sql`
3. Copy your **Project URL** and **Anon Key** to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── game/         # Mascot, WorldMap, QuestCard
│   ├── lesson/       # LessonClient, FillBlank, MultipleChoice, etc.
│   └── ui/           # XPBar, HeartBar, StreakBar, etc.
├── contexts/         # AuthContext
├── hooks/            # useMascot
├── lib/              # Core logic
│   ├── gamification.ts   # XP, hearts, streak, badges, shop
│   ├── supabase/         # Client, server, sync, middleware
│   ├── animations.ts     # Unified motion tokens
│   └── quizzes.ts        # 120+ quiz questions
tests/                # Vitest tests
supabase/             # SQL migrations
```

## Roadmap

- [x] Phase 0 — Foundation fixes (XP bug, hearts, dead code)
- [x] Phase 1 — Supabase backend (auth, DB, real leaderboard)
- [x] Phase 2 — Smart mascot (reactive mood, adaptive learning)
- [x] Phase 3 — Interactive questions (drag, sort, equation builder)
- [x] Phase 4 — Unified motion system
- [x] Phase 5 — Tests, CI, README

## License

MIT
