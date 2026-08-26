"use client";

import type { Topic, QuizQuestion, Level } from "./types";
import topicsData from "./topics.json";
import { quizzes as staticQuizzes } from "./quizzes";

const TOPICS_KEY = "belajarmtk_admin_topics";
const QUESTIONS_KEY = "belajarmtk_admin_questions";
const SEEDED_KEY = "belajarmtk_content_seeded";

function getAdminTopics(): { slug: string; title: string; level: Level; section: string; icon: string; content: string; description: string; isPublished: boolean }[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(TOPICS_KEY) || "[]");
  } catch { return []; }
}

function getAdminQuestions(): (QuizQuestion & { isPublished: boolean; createdBy?: string; updatedAt?: string })[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(QUESTIONS_KEY) || "[]");
  } catch { return []; }
}

function autoSeedAdminContent(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEEDED_KEY)) return;

  const topics = (topicsData as Topic[]).map((t) => ({
    ...t,
    isPublished: true,
    createdBy: "system",
    updatedAt: new Date().toISOString(),
  }));

  const questions = staticQuizzes.map((q) => ({
    ...q,
    isPublished: true,
    createdBy: "system",
    updatedAt: new Date().toISOString(),
  }));

  localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  localStorage.setItem(SEEDED_KEY, "true");
}

// Auto-seed on module load
autoSeedAdminContent();

export function getAllTopics(): Topic[] {
  const adminTopics = getAdminTopics();
  const staticTopics = topicsData as Topic[];

  if (adminTopics.length === 0) return staticTopics;

  const adminMap = new Map(adminTopics.filter((t) => t.isPublished).map((t) => [t.slug, t]));
  const adminSlugs = new Set(adminTopics.map((t) => t.slug));

  const merged: Topic[] = [];

  for (const t of staticTopics) {
    const adminOverride = adminMap.get(t.slug);
    if (adminOverride) {
      merged.push({
        id: t.id,
        slug: t.slug,
        title: adminOverride.title || t.title,
        level: adminOverride.level || t.level,
        section: adminOverride.section || t.section,
        icon: adminOverride.icon || t.icon,
        content: adminOverride.content || t.content,
        description: adminOverride.description || t.description,
      });
    } else {
      merged.push(t);
    }
  }

  for (const t of adminTopics) {
    if (t.isPublished && !adminSlugs.has(t.slug)) {
      merged.push({
        id: `admin-${t.slug}`,
        slug: t.slug,
        title: t.title,
        level: t.level,
        section: t.section,
        icon: t.icon,
        content: t.content,
        description: t.description,
      });
    }
  }

  return merged;
}

export function getTopicsByLevel(level: Level): Topic[] {
  return getAllTopics().filter((t) => t.level === level);
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return getAllTopics().find((t) => t.slug === slug);
}

export function searchTopics(query: string): Topic[] {
  const q = query.toLowerCase();
  return getAllTopics().filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q)
  );
}

function generateHints(q: QuizQuestion): string[] {
  if (q.hints && q.hints.length > 0) return q.hints;
  const question = q.question.toLowerCase();
  const explanation = q.explanation || "";
  const hints: string[] = [];

  // Keyword-based contextual hints
  const kw = (terms: string[]) => terms.some((t) => question.includes(t));

  if (kw(["sederhanakan", "tambah", "kurang"]) && kw(["/", "pecahan"])) {
    hints.push("Untuk menjumlahkan pecahan, samakan penyebutnya terlebih dahulu (cari KPK dari kedua penyebut).");
    hints.push("Setelah penyebut sama, jumlahkan pembilangnya saja.");
  } else if (kw(["fpb", "faktor persekutuan terbesar"])) {
    hints.push("Tuliskan semua faktor dari masing-masing bilangan.");
    hints.push("FPB adalah faktor yang paling besar yang dimiliki kedua bilangan.");
  } else if (kw(["kpk", "kelipatan persekutuan"])) {
    hints.push("Tuliskan kelipatan-kelipatan dari masing-masing bilangan.");
    hints.push("KPK adalah kelipatan yang paling kecil yang sama-sama dimiliki.");
  } else if (kw(["%", "persen"])) {
    hints.push("Ubah persen ke desimal: bagi dengan 100.");
    hints.push("Kalikan nilai desimal dengan bilangan yang dicari.");
  } else if (kw(["faktorkan", "faktorisasi"])) {
    hints.push("Cari dua bilangan yang jika dijumlahkan hasilnya sama dengan koefisien x, dan jika dikalikan hasilnya sama dengan konstanta.");
    if (explanation.includes("x²")) {
      hints.push("Untuk x² + bx + c, cari dua angka yang berjumlah b dan berkalikan c.");
    }
  } else if (kw(["penyelesaian", "x ="])) {
    hints.push("Pindahkan semua konstanta ke satu ruas, sisakan yang mengandung x.");
    if (kw(["2x", "3x", "4x", "5x"])) {
      const match = question.match(/(\d)x/);
      if (match) hints.push(`Bagi kedua ruas dengan ${match[1]} untuk mendapatkan nilai x.`);
    }
  } else if (kw(["gradien", "kemiringan"])) {
    hints.push("Gradien = (y₂ - y₁) / (x₂ - x₁). Selisih y dibagi selisih x.");
  } else if (kw(["hipotenusa", "pythagoras", "segitiga siku"])) {
    hints.push("Gunakan rumus Pythagoras: c² = a² + b², lalu akarkan hasilnya.");
  } else if (kw(["luas"]) && kw(["lingkaran"])) {
    hints.push("Rumus luas lingkaran: L = π × r². Kuadratkan jari-jarinya lalu kalikan π.");
  } else if (kw(["keliling"]) && kw(["lingkaran"])) {
    hints.push("Rumus keliling lingkaran: K = π × d atau K = 2 × π × r.");
  } else if (kw(["luas"]) && kw(["trapesium", "segitiga", "jajar genjang", "layang"])) {
    hints.push("Perhatikan rumus luas bangun datar yang sesuai, lalu masukkan nilai yang diketahui.");
  } else if (kw(["barisan", "suku ke"])) {
    hints.push("Untuk barisan aritmetika: Uₙ = a + (n-1) × b. Tentukan nilai a (suku pertama) dan b (beda).");
  } else if (kw(["perbandingan", "senilai", "berbalik nilai"])) {
    hints.push("Untuk perbandingan senilai: a/b = c/d. Untuk berbalik nilai: a × b = c × d.");
  } else if (kw(["n(a∪b)", "n(a∩b)", "himpunan"])) {
    hints.push("Gunakan rumus: n(A∪B) = n(A) + n(B) - n(A∩B).");
  } else if (kw(["himpunan bagian", "banyak himpunan"])) {
    hints.push("Banyak himpunan bagian = 2^n, di mana n adalah banyak elemen.");
  } else if (kw(["turunan", "f'(x)", "dx"])) {
    hints.push("Gunakan aturan turunan: (xⁿ)' = n·xⁿ⁻¹. Turunkan pangkat lalu kurangi pangkatnya 1.");
  } else if (kw(["integral", "∫"])) {
    hints.push("Integral adalah kebalikan dari turunan. Untuk ∫xⁿ dx = xⁿ⁺¹/(n+1) + C.");
  } else if (kw(["sin", "cos", "trigonometri"])) {
    hints.push("Ingat identitas trigonometri dasar: sin²θ + cos²θ = 1.");
  } else if (kw(["limit"])) {
    hints.push("Substitusikan nilai x langsung ke dalam fungsi jika fungsi kontinu di titik tersebut.");
  } else if (kw(["matriks", "determinan"])) {
    hints.push("Untuk matriks 2×2: det = ad - bc.");
  } else if (kw(["vektor", "│v│"])) {
    hints.push("Panjang vector = √(x² + y²). Kuadratkan setiap komponen, jumlahkan, lalu akarkan.");
  } else if (kw(["diskon", "harga"])) {
    hints.push("Harga setelah diskon = harga asli × (100% - %diskon) / 100%.");
  } else if (kw(["pajak"])) {
    hints.push("Pajak = harga × %pajak / 100%. Harga bersih = harga - pajak.");
  } else if (kw(["keuntungan", "rugi"])) {
    hints.push("Untung/rugi = (harga jual - harga beli) / harga beli × 100%.");
  } else if (kw(["fungsi", "f(x)"])) {
    hints.push("Masukkan nilai x ke dalam rumus fungsi untuk mencari f(x).");
  } else if (kw(["peluang", "kemungkinan"])) {
    hints.push("Peluang = banyak kejadian menguntungkan / banyak seluruh kemungkinan.");
  } else if (kw(["mean", "rata-rata"])) {
    hints.push("Rata-rata = jumlah seluruh data / banyak data.");
  } else if (kw(["median"])) {
    hints.push("Median adalah nilai tengah setelah data diurutkan dari kecil ke besar.");
  } else if (kw(["modus"])) {
    hints.push("Modus adalah nilai yang paling sering muncul.");
  } else if (kw(["z-score", "standar deviasi"])) {
    hints.push("z = (x - mean) / σ. Kurangi rata-rata, lalu bagi dengan standar deviasi.");
  } else if (kw(["grenel", "eliminasi"])) {
    hints.push("Kalikan salah satu persamaan agar koefisien salah satu variabel sama, lalu eliminasi.");
  } else if (kw(["persamaan garis", "y = mx"])) {
    hints.push("Gradien m = (y₂-y₁)/(x₂-x₁). Persamaan garis: y - y₁ = m(x - x₁).");
  } else {
    // Fallback: extract from explanation
    const sentences = explanation.split(/[.!]\s+/).filter((s) => s.length > 5);
    if (q.options && q.options.length > 0) {
      hints.push("Coba eliminasi jawaban yang jelas tidak masuk akal terlebih dahulu.");
    }
    if (sentences.length >= 2) {
      hints.push(`Perhatikan: ${sentences[0].trim()}.`);
    }
    if (sentences.length >= 3) {
      hints.push(`Langkah berikutnya: ${sentences[1].trim()}.`);
    }
  }

  if (hints.length === 0) {
    hints.push("Baca penjelasan setelah menjawab untuk memahami konsepnya lebih lanjut.");
  }

  return hints;
}

export function getAllQuizzes(): QuizQuestion[] {
  const adminQuestions = getAdminQuestions();
  const publishedAdmin = adminQuestions.filter((q) => q.isPublished);

  if (publishedAdmin.length === 0) return staticQuizzes;

  const adminIds = new Set(publishedAdmin.map((q) => q.id));
  const result: QuizQuestion[] = [];

  for (const q of publishedAdmin) {
    const merged: QuizQuestion = {
      id: q.id,
      topicSlug: q.topicSlug,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      type: q.type as QuizQuestion["type"],
      difficulty: q.difficulty as QuizQuestion["difficulty"],
      hints: generateHints(q),
      alternatives: q.alternatives,
      equation: q.equation,
      numberLine: q.numberLine,
      sorting: q.sorting,
      graph: q.graph,
      geometry: q.geometry,
      venn: q.venn,
    };
    result.push(merged);
  }

  for (const q of staticQuizzes) {
    if (!adminIds.has(q.id)) {
      result.push({ ...q, hints: generateHints(q) });
    }
  }

  return result;
}
