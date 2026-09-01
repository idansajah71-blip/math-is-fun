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
  type?: "choice" | "fill" | "numberline" | "sorting" | "equation" | "graph" | "geometry" | "venn";
  difficulty?: "easy" | "medium" | "hard";
  hints?: string[];
  // For numberline type
  numberLine?: { min: number; max: number; correctValue: number; step?: number; tolerance?: number };
  // For sorting type
  sorting?: { items: string[]; correctOrder: number[]; label?: string };
  // For equation type
  equation?: { steps: { prompt: string; options: string[]; correctIndex: number; explanation?: string }[] };
  // For graph type
  graph?: { expression: string; xMin?: number; xMax?: number; yMin?: number; yMax?: number; correctPoint?: { x: number; y: number } };
  // For geometry type
  geometry?: { shapes: { type: string; points?: { x: number; y: number }[]; radius?: number; center?: { x: number; y: number }; showMeasurements?: boolean }[]; question: string };
  // For venn type
  venn?: { setLabels: [string, string]; regionValues: [number, number, number, number]; universe?: number };
  // For approach detection (per-question custom patterns)
  approachPatterns?: ApproachPattern[];
}

export interface ApproachPattern {
  match: string;
  feedback: string;
  credit: number;
}

export interface UserProgress {
  completedTopics: string[];
  bookmarkedTopics: string[];
  quizScores: Record<string, number>;
}

/* ── Formula Interactive Types ── */

export interface FormulaVariable {
  name: string;
  label: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
}

export interface FormulaPractice {
  question: string;
  variables: Record<string, number>;
  answer: number;
  answerFormatted: string;
  options: string[];
  explanation: string;
}

export type FormulaVisual =
  | "triangle" | "right-triangle" | "circle" | "rectangle" | "square"
  | "trapezoid" | "rhombus" | "parallelogram"
  | "pyramid" | "prism" | "cylinder" | "cone" | "sphere"
  | "exponent" | "angle" | "sector"
  | "number-line" | "pie-chart" | "venn"
  | "vector-2d" | "unit-circle" | "function-graph"
  | "coordinate-plane" | "matrix-grid" | "sequence"
  | "curve" | "area-under-curve" | "histogram"
  | "normal-curve" | "gradient-3d" | "cube-3d"
  | "box-3d" | "transformation" | "tree-diagram";

export interface FormulaStep {
  label: string;
  detail: string;
}

export interface FormulaMeta {
  formula: string;
  description: string;
  variables: FormulaVariable[];
  outputLabel: string;
  compute: (vars: Record<string, number>) => number;
  formatResult: (result: number) => string;
  examples: { input: Record<string, number>; result: number; formatted: string }[];
  practice: FormulaPractice[];
  visual?: FormulaVisual;
  stepByStep?: (vars: Record<string, number>) => FormulaStep[];
}
