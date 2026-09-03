"use client";

import type { Topic, QuizQuestion, Level } from "./types";
import topicsData from "./topics.json";
import { quizzes as staticQuizzes } from "./quizzes";

const TOPICS_KEY = "matika_admin_topics";
const QUESTIONS_KEY = "matika_admin_questions";
const SEEDED_KEY = "matika_content_seeded";
const SEED_VERSION = "v5";

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
  if (localStorage.getItem(SEEDED_KEY) === SEED_VERSION) return;

  const topics = (topicsData as Topic[]).map((t) => ({
    ...t,
    isPublished: true,
    createdBy: "system",
    updatedAt: new Date().toISOString(),
  }));

  try {
    localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
    localStorage.setItem(SEEDED_KEY, SEED_VERSION);
  } catch { console.debug("Failed to seed admin content to localStorage"); }
}

// Auto-seed on module load (lazy — only runs once per session)
let _seeded = false;

export function getAllTopics(): Topic[] {
  if (!_seeded) { _seeded = true; autoSeedAdminContent(); }
  const adminTopics = getAdminTopics();
  const staticTopics = topicsData as Topic[];

  if (adminTopics.length === 0) return staticTopics;

  const adminMap = new Map(adminTopics.filter((t) => t.isPublished).map((t) => [t.slug, t]));
  const staticSlugs = new Set(staticTopics.map((t) => t.slug));

  const merged: Topic[] = [];

  for (const t of staticTopics) {
    const adminOverride = adminMap.get(t.slug);
    if (adminOverride) {
      // Auto-clean: if admin content is wildly longer than static, fall back to static
      const contentOk = !adminOverride.content || adminOverride.content.length <= t.content.length * 5;
      merged.push({
        id: t.id,
        slug: t.slug,
        title: adminOverride.title || t.title,
        level: adminOverride.level || t.level,
        section: adminOverride.section || t.section,
        class: t.class,
        icon: adminOverride.icon || t.icon,
        content: contentOk ? (adminOverride.content || t.content) : t.content,
        description: adminOverride.description || t.description,
      });
    } else {
      merged.push(t);
    }
  }

  for (const t of adminTopics) {
    if (t.isPublished && !staticSlugs.has(t.slug)) {
      merged.push({
        id: `admin-${t.slug}`,
        slug: t.slug,
        title: t.title,
        level: t.level,
        section: t.section,
        class: undefined,
        icon: t.icon,
        content: t.content,
        description: t.description,
      });
    }
  }

  return merged;
}

export function getTopicStatus(
  topics: Topic[],
  completedTopics: string[]
): Map<string, "completed" | "available" | "locked"> {
  const completed = new Set(completedTopics);
  const statusMap = new Map<string, "completed" | "available" | "locked">();

  // Group SMP topics by class
  const smpTopics = topics.filter((t) => t.level === "smp");
  const nonSmpTopics = topics.filter((t) => t.level !== "smp");

  const smpByClass: Record<string, Topic[]> = {};
  for (const t of smpTopics) {
    const cls = t.class || "7";
    if (!smpByClass[cls]) smpByClass[cls] = [];
    smpByClass[cls].push(t);
  }

  // Process SMP topics with cross-class gating
  const classOrder = ["7", "8", "9"];
  let prevClassFullyDone = true; // Kelas 7 is always initially accessible

  for (const cls of classOrder) {
    const classTopics = smpByClass[cls] || [];
    if (classTopics.length === 0) continue;

    if (!prevClassFullyDone) {
      // Previous class not fully done → all topics in this class are locked
      for (const t of classTopics) {
        statusMap.set(t.slug, "completed");
      }
      // Mark as locked (will be overridden below if completed)
      for (const t of classTopics) {
        if (!completed.has(t.slug)) {
          statusMap.set(t.slug, "locked");
        }
      }
      prevClassFullyDone = false;
      continue;
    }

    // Previous class fully done → linear progression within this class
    let foundAvailable = false;
    for (const t of classTopics) {
      if (completed.has(t.slug)) {
        statusMap.set(t.slug, "completed");
      } else if (!foundAvailable) {
        statusMap.set(t.slug, "available");
        foundAvailable = true;
      } else {
        statusMap.set(t.slug, "locked");
      }
    }

    // Check if this class is fully completed
    const allDone = classTopics.every((t) => completed.has(t.slug));
    prevClassFullyDone = allDone;
  }

  // Process non-SMP topics (SMA, Kuliah) — simple linear progression
  let foundAvailable = false;
  for (const t of nonSmpTopics) {
    if (completed.has(t.slug)) {
      statusMap.set(t.slug, "completed");
    } else if (!foundAvailable) {
      statusMap.set(t.slug, "available");
      foundAvailable = true;
    } else {
      statusMap.set(t.slug, "locked");
    }
  }

  return statusMap;
}

export function getTopicsByLevel(level: Level): Topic[] {
  return getAllTopics().filter((t) => t.level === level);
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return getAllTopics().find((t) => t.slug === slug);
}

function generateHints(q: QuizQuestion): string[] {
  if (q.hints && q.hints.length > 0) return q.hints;

  const question = q.question.toLowerCase();
  const explanation = q.explanation || "";
  const correctAnswer = (q.options && q.options[q.correctIndex]) || "";

  const kw = (terms: string[]) => terms.some((t) => question.includes(t));

  // Each topic produces 3 hints: [Arahan, Rumus, Jawaban]
  let arahan = "";
  let rumus = "";

  // ── Specific topic hints (keyword-based) ──
  if (kw(["sederhanakan", "tambah", "kurang"]) && kw(["/", "pecahan"])) {
    arahan = "Samakan penyebutnya terlebih dahulu dengan mencari KPK dari kedua penyebut.";
    rumus = "a/b + c/d = (a×d + c×b) / (b×d), lalu sederhanakan.";
  } else if (kw(["fpb", "faktor persekutuan terbesar"])) {
    arahan = "Tuliskan semua faktor dari masing-masing bilangan, lalu cari yang terbesar.";
    rumus = "FPB = faktor terbesar yang dimiliki kedua bilangan.";
  } else if (kw(["kpk", "kelipatan persekutuan"])) {
    arahan = "Tuliskan kelipatan-kelipatan dari masing-masing bilangan.";
    rumus = "KPK = kelipatan terkecil yang sama-sama dimiliki.";
  } else if (kw(["%", "persen"])) {
    arahan = "Ubah persen ke desimal terlebih dahulu, lalu kalikan dengan bilangan yang dicari.";
    rumus = "Persen ke desimal: bagi dengan 100. Contoh: 40% = 0,4";
  } else if (kw(["faktorkan", "faktorisasi"])) {
    arahan = "Cari dua bilangan yang dijumlahkan hasilnya sama dengan koefisien x, dan dikalikan hasilnya sama dengan konstanta.";
    rumus = "x² + bx + c = (x + p)(x + q), dimana p + q = b dan p × q = c.";
  } else if (kw(["penyelesaian", "x ="])) {
    arahan = "Pindahkan semua konstanta ke satu ruas, sisakan yang mengandung x.";
    rumus = "Isolasi x: kalikan/behagi kedua ruas untuk mendapatkan x = ...";
  } else if (kw(["gradien", "kemiringan"])) {
    arahan = "Gunakan dua titik pada garis untuk menghitung gradien.";
    rumus = "m = (y₂ - y₁) / (x₂ - x₁)";
  } else if (kw(["hipotenusa", "pythagoras", "segitiga siku"])) {
    arahan = "Identifikasi sisi yang diketahui, lalu gunakan rumus Pythagoras.";
    rumus = "c² = a² + b² (c = hipotenusa, a dan b = sisi siku-siku)";
  } else if (kw(["luas"]) && kw(["lingkaran"])) {
    arahan = "Cari jari-jari lingkaran terlebih dahulu, lalu masukkan ke rumus.";
    rumus = "L = π × r² (π ≈ 3,14 atau 22/7)";
  } else if (kw(["keliling"]) && kw(["lingkaran"])) {
    arahan = "Gunakan jari-jari atau diameter untuk menghitung keliling.";
    rumus = "K = 2 × π × r  atau  K = π × d";
  } else if (kw(["luas"]) && kw(["trapesium", "segitiga", "jajar genjang", "layang"])) {
    arahan = "Kenali bentuk bangun datar, lalu gunakan rumus luas yang sesuai.";
    rumus = "Segitiga: L = ½ × a × t. Trapesium: L = ½ × (a+b) × t.";
  } else if (kw(["barisan", "suku ke"])) {
    arahan = "Tentukan nilai a (suku pertama) dan b (beda) dari soal.";
    rumus = "Uₙ = a + (n-1) × b";
  } else if (kw(["perbandingan", "senilai", "berbalik nilai"])) {
    arahan = "Tentukan jenis perbandingan: senilai atau berbalik nilai.";
    rumus = "Senilai: a/b = c/d. Berbalik nilai: a × b = c × d.";
  } else if (kw(["n(a∪b)", "n(a∩b)", "himpunan"])) {
    arahan = "Identifikasi n(A), n(B), dan irisan/penyatuan dari soal.";
    rumus = "n(A∪B) = n(A) + n(B) - n(A∩B)";
  } else if (kw(["himpunan bagian", "banyak himpunan"])) {
    arahan = "Hitung banyak elemen dalam himpunan, lalu gunakan rumus himpunan bagian.";
    rumus = "Banyak himpunan bagian = 2ⁿ (n = banyak elemen)";
  } else if (kw(["turunan", "f'(x)", "dx"])) {
    arahan = "Turunkan setiap suku secara terpisah dengan aturan pangkat.";
    rumus = "(xⁿ)' = n × xⁿ⁻¹  (pangkat turun, pangkat dikurangi 1)";
  } else if (kw(["integral", "∫"])) {
    arahan = "Integral adalah kebalikan dari turunan. Tambahkan pangkat lalu bagi.";
    rumus = "∫xⁿ dx = xⁿ⁺¹/(n+1) + C";
  } else if (kw(["sin", "cos", "trigonometri"])) {
    arahan = "Gunakan identitas trigonometri dasar untuk menyederhanakan.";
    rumus = "sin²θ + cos²θ = 1";
  } else if (kw(["limit"])) {
    arahan = "Coba substitusikan nilai x langsung ke dalam fungsi.";
    rumus = "Jika f(a) terdefinisi, maka lim(x→a) f(x) = f(a).";
  } else if (kw(["matriks", "determinan"])) {
    arahan = "Kalikan elemen diagonal utama, kurangi elemen diagonal samping.";
    rumus = "det 2×2: |a b; c d| = ad - bc";
  } else if (kw(["vektor", "│v│"])) {
    arahan = "Kuadratkan setiap komponen vektor, jumlahkan, lalu akarkan.";
    rumus = "|v| = √(x² + y²)";
  } else if (kw(["diskon", "harga"])) {
    arahan = "Hitung jumlah diskon, lalu kurangi dari harga asli.";
    rumus = "Harga akhir = harga asli × (100% - %diskon) / 100%";
  } else if (kw(["pajak"])) {
    arahan = "Hitung jumlah pajak dari harga, lalu tambahkan ke harga asli.";
    rumus = "Pajak = harga × %pajak / 100%";
  } else if (kw(["keuntungan", "rugi"])) {
    arahan = "Bandingkan harga jual dengan harga beli.";
    rumus = "Untung/rugi = (harga jual - harga beli) / harga beli × 100%";
  } else if (kw(["fungsi", "f(x)"])) {
    arahan = "Masukkan nilai x ke dalam rumus fungsi untuk mencari f(x).";
    rumus = "f(x) = ... (ganti x dengan nilai yang diminta)";
  } else if (kw(["peluang", "kemungkinan"])) {
    arahan = "Hitung banyak kejadian menguntungkan dan total kemungkinan.";
    rumus = "P = banyak menguntungkan / banyak seluruh kemungkinan";
  } else if (kw(["mean", "rata-rata"])) {
    arahan = "Jumlahkan seluruh data, lalu bagi dengan banyak data.";
    rumus = "Rata-rata = Σx / n";
  } else if (kw(["median"])) {
    arahan = "Urutkan data dari kecil ke besar, lalu cari nilai tengah.";
    rumus = "Median = nilai tengah (ganjil) atau rata-rata dua nilai tengah (genap).";
  } else if (kw(["modus"])) {
    arahan = "Cari nilai yang paling sering muncul dalam data.";
    rumus = "Modus = nilai dengan frekuensi tertinggi.";
  } else if (kw(["z-score", "standar deviasi"])) {
    arahan = "Kurangi nilai dengan rata-rata, lalu bagi dengan standar deviasi.";
    rumus = "z = (x - mean) / σ";
  } else if (kw(["grenel", "eliminasi"])) {
    arahan = "Kalikan salah satu persamaan agar koefisien salah satu variabel sama.";
    rumus = "Eliminasi: samakan koefisien lalu kurangkan kedua persamaan.";
  } else if (kw(["persamaan garis", "y = mx"])) {
    arahan = "Hitung gradien dari dua titik yang diketahui.";
    rumus = "m = (y₂-y₁)/(x₂-x₁),  y - y₁ = m(x - x₁)";
  }

  // Build the 3 hints
  const hints: string[] = [];

  // Hint 1: Arahan (always present)
  if (arahan) {
    hints.push(arahan);
  } else if (q.options && q.options.length > 0) {
    hints.push("Coba eliminasi jawaban yang jelas tidak masuk akal terlebih dahulu, lalu fokus pada sisa pilihan.");
  } else {
    hints.push("Baca soal dengan teliti dan identifikasi informasi yang diketahui vs yang dicari.");
  }

  // Hint 2: Rumus (always present)
  if (rumus) {
    hints.push(rumus);
  } else {
    // Fallback: extract a key sentence from explanation
    const sentences = explanation
      .split(/[.!]\s+/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 10 && !s.startsWith("Jawaban") && !s.startsWith("Jadi"));
    hints.push(sentences.length >= 1 ? sentences[0] : "Perhatikan langkah penyelesaian pada penjelasan.");
  }

  // Hint 3: Jawaban (always present)
  if (correctAnswer) {
    hints.push(correctAnswer);
  } else if (explanation) {
    // Extract the last sentence as the answer
    const sentences = explanation.split(/[.!]\s+/).filter((s: string) => s.trim().length > 0);
    hints.push(sentences.length > 0 ? sentences[sentences.length - 1] : "Lihat penjelasan untuk jawaban.");
  } else {
    hints.push("Jawaban ada di opsi yang tersedia.");
  }

  return hints;
}

export function getAllQuizzes(): QuizQuestion[] {
  if (!_seeded) { _seeded = true; autoSeedAdminContent(); }
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
      matching: q.matching,
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
