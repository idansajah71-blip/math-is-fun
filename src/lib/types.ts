export type Level = "smp" | "sma" | "kuliah";

export interface Topic {
  id: string;
  slug: string;
  title: string;
  level: Level;
  section: string;
  icon: string;
  content: string;
  description: string;
}

export interface LevelInfo {
  id: Level;
  label: string;
  description: string;
  color: string;
  icon: string;
}

export const LEVELS: LevelInfo[] = [
  {
    id: "smp",
    label: "SMP",
    description: "Kelas 7-9: Bilangan, Aljabar, Geometri, Statistika",
    color: "from-emerald-500 to-teal-600",
    icon: "📐",
  },
  {
    id: "sma",
    label: "SMA",
    description: "Kelas 10-12: Eksponen, Trigonometri, Kalkulus, Peluang",
    color: "from-blue-500 to-indigo-600",
    icon: "📊",
  },
  {
    id: "kuliah",
    label: "Universitas",
    description: "Calculus, Linear Algebra, Differential Equations",
    color: "from-purple-500 to-violet-600",
    icon: "🎓",
  },
];

export interface QuizQuestion {
  id: string;
  topicSlug: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  alternatives?: string[];
}

export interface UserProgress {
  completedTopics: string[];
  bookmarkedTopics: string[];
  quizScores: Record<string, number>;
}
