import { QuizQuestion } from "./types";

export const quizzes: QuizQuestion[] = [
  // ==================== SMP ====================
  // Bilangan
  {
    id: "q-bilangan-1",
    topicSlug: "1-bilangan-bulat-pecahan-desimal-persen",
    question: "Sederhanakan 3/4 + 2/5",
    options: ["23/20", "5/9", "6/20", "15/20"],
    correctIndex: 0,
    explanation: "KPK dari 4 dan 5 adalah 20. 3/4 = 15/20, 2/5 = 8/20. 15/20 + 8/20 = 23/20",
  },
  {
    id: "q-bilangan-2",
    topicSlug: "1-bilangan-bulat-pecahan-desimal-persen",
    question: "FPB dari 12 dan 18 adalah ____",
    options: ["6", "3", "36", "12"],
    correctIndex: 0,
    explanation: "Faktor 12: 1,2,3,4,6,12. Faktor 18: 1,2,3,6,9,18. FPB = 6",
    alternatives: ["enam"],
  },
  {
    id: "q-bilangan-3",
    topicSlug: "1-bilangan-bulat-pecahan-desimal-persen",
    question: "Jika 40% dari sebuah bilangan adalah 20, maka bilangan tersebut adalah ____",
    options: ["50", "80", "60", "45"],
    correctIndex: 0,
    explanation: "40% × x = 20, maka x = 20 ÷ 0.4 = 50",
    alternatives: ["50"],
  },

  // Interactive: Number line for fractions
  {
    id: "q-bilangan-interactive-1",
    topicSlug: "1-bilangan-bulat-pecahan-desimal-persen",
    question: "Geser ke posisi 3/4 di garis bilangan",
    options: [],
    correctIndex: 0,
    explanation: "3/4 = 0.75, posisi di antara 0 dan 1",
    type: "numberline",
    numberLine: { min: 0, max: 1, correctValue: 0.75, step: 0.25, tolerance: 0.15 },
  },

  // Interactive: Sorting fractions
  {
    id: "q-bilangan-interactive-2",
    topicSlug: "1-bilangan-bulat-pecahan-desimal-persen",
    question: "Susun pecahan ini dari terkecil ke terbesar",
    options: [],
    correctIndex: 0,
    explanation: "1/2 = 0.5, 3/4 = 0.75, 2/3 ≈ 0.67. Urutan: 1/2 < 2/3 < 3/4",
    type: "sorting",
    sorting: { items: ["1/2", "3/4", "2/3"], correctOrder: [0, 2, 1], label: "Dari terkecil ke terbesar" },
  },

  // Interactive: Number line for integers
  {
    id: "q-bilangan-interactive-3",
    topicSlug: "1-bilangan-bulat-pecahan-desimal-persen",
    question: "Geser ke posisi -3 di garis bilangan",
    options: [],
    correctIndex: 0,
    explanation: "-3 terletak di kiri nol pada garis bilangan",
    type: "numberline",
    numberLine: { min: -5, max: 5, correctValue: -3, step: 1, tolerance: 0.5 },
  },

  // Interactive: Sorting decimals
  {
    id: "q-bilangan-interactive-4",
    topicSlug: "1-bilangan-bulat-pecahan-desimal-persen",
    question: "Susun desimal ini dari terbesar ke terkecil",
    options: [],
    correctIndex: 0,
    explanation: "0.8 > 0.45 > 0.4 > 0.09",
    type: "sorting",
    sorting: { items: ["0.45", "0.8", "0.09", "0.4"], correctOrder: [1, 0, 3, 2], label: "Dari terbesar ke terkecil" },
  },

  // Interactive: Number line for percentages
  {
    id: "q-bilangan-interactive-6",
    topicSlug: "1-bilangan-bulat-pecahan-desimal-persen",
    question: "Geser ke posisi 0.5 di garis bilangan",
    options: [],
    correctIndex: 0,
    explanation: "0.5 setengah dari 0 ke 1",
    type: "numberline",
    numberLine: { min: 0, max: 1, correctValue: 0.5, step: 0.1, tolerance: 0.1 },
  },
  {
    id: "q-bilangan-interactive-7",
    topicSlug: "1-bilangan-bulat-pecahan-desimal-persen",
    question: "Geser ke posisi 1/3 di garis bilangan",
    options: [],
    correctIndex: 0,
    explanation: "1/3 ≈ 0.33, posisi sepertiga dari 0 ke 1",
    type: "numberline",
    numberLine: { min: 0, max: 1, correctValue: 0.33, step: 0.1, tolerance: 0.1 },
  },
  {
    id: "q-bilangan-interactive-8",
    topicSlug: "1-bilangan-bulat-pecahan-desimal-persen",
    question: "Geser ke posisi -2.5 di garis bilangan",
    options: [],
    correctIndex: 0,
    explanation: "-2.5 tepat di tengah -2 dan -3",
    type: "numberline",
    numberLine: { min: -5, max: 5, correctValue: -2.5, step: 0.5, tolerance: 0.3 },
  },
  {
    id: "q-bilangan-interactive-9",
    topicSlug: "1-bilangan-bulat-pecahan-desimal-persen",
    question: "Geser ke posisi 2/5 di garis bilangan",
    options: [],
    correctIndex: 0,
    explanation: "2/5 = 0.4, posisi di antara 0 dan 1",
    type: "numberline",
    numberLine: { min: 0, max: 1, correctValue: 0.4, step: 0.1, tolerance: 0.1 },
  },
  {
    id: "q-bilangan-interactive-10",
    topicSlug: "1-bilangan-bulat-pecahan-desimal-persen",
    question: "Geser ke posisi 75% di garis bilangan",
    options: [],
    correctIndex: 0,
    explanation: "75% = 0.75 = 3/4",
    type: "numberline",
    numberLine: { min: 0, max: 1, correctValue: 0.75, step: 0.25, tolerance: 0.1 },
  },

  // Himpunan
  {
    id: "q-himpunan-1",
    topicSlug: "2-himpunan",
    question: "Jika n(A)=10, n(B)=8, n(A∩B)=3, maka n(A∪B) adalah...",
    options: ["15", "18", "13", "21"],
    correctIndex: 0,
    explanation: "n(A∪B) = n(A) + n(B) - n(A∩B) = 10 + 8 - 3 = 15",
  },
  {
    id: "q-himpunan-2",
    topicSlug: "2-himpunan",
    question: "Himpunan bagian dari himpunan {a,b,c} berapa banyak? ____",
    options: ["8", "6", "9", "7"],
    correctIndex: 0,
    explanation: "Banyak himpunan bagian = 2^n = 2³ = 8",
    alternatives: ["delapan"],
  },

  // Bentuk Aljabar
  {
    id: "q-aljabar-1",
    topicSlug: "3-bentuk-aljabar",
    question: "Faktorkan x² + 7x + 12",
    options: ["(x+3)(x+4)", "(x+2)(x+6)", "(x+1)(x+12)", "(x+5)(x+2)"],
    correctIndex: 0,
    explanation: "Cari dua bilangan berjumlah 7 dan berkal12 → 3 dan 4. Maka (x+3)(x+4)",
  },

  // Interactive: Number line for integers
  {
    id: "q-aljabar-interactive-1",
    topicSlug: "3-bentuk-aljabar",
    question: "Geser ke posisi 4 di garis bilangan",
    options: [],
    correctIndex: 0,
    explanation: "4 terletak di kanan nol pada garis bilangan",
    type: "numberline",
    numberLine: { min: -5, max: 10, correctValue: 4, step: 1, tolerance: 0.5 },
  },

  // PLSV
  {
    id: "q-linear-1",
    topicSlug: "4-persamaan-linear-satu-variabel-plsv",
    question: "Penyelesaian 2x + 5 = 13 adalah x = ____",
    options: ["x = 4", "x = 5", "x = 3", "x = 6"],
    correctIndex: 0,
    explanation: "2x = 13 - 5 = 8, x = 8/2 = 4",
    alternatives: ["4"],
  },
  {
    id: "q-linear-2",
    topicSlug: "4-persamaan-linear-satu-variabel-plsv",
    question: "Jika 3x - 7 = 8, maka x = ____",
    options: ["5", "4", "6", "3"],
    correctIndex: 0,
    explanation: "3x = 8 + 7 = 15, x = 15/3 = 5",
    alternatives: ["x = 5"],
  },

  // Interactive: Equation builder for PLSV
  {
    id: "q-linear-interactive-1",
    topicSlug: "4-persamaan-linear-satu-variabel-plsv",
    question: "Selesaikan langkah demi langkah: 2x + 5 = 13",
    options: [],
    correctIndex: 0,
    explanation: "2x + 5 = 13 → 2x = 8 → x = 4",
    type: "equation",
    equation: {
      steps: [
        { prompt: "Langkah 1: Pindahkan 5 ke ruas kanan", options: ["2x = 13 - 5", "2x = 13 + 5", "2x = 5 - 13", "2x = 13 × 5"], correctIndex: 0, explanation: "Kurangkan 5 dari kedua ruas" },
        { prompt: "Langkah 2: Hitung hasilnya", options: ["2x = 8", "2x = 18", "2x = 6", "2x = 10"], correctIndex: 0, explanation: "13 - 5 = 8" },
        { prompt: "Langkah 3: Bagi kedua ruas dengan 2", options: ["x = 4", "x = 6", "x = 3", "x = 5"], correctIndex: 0, explanation: "8 ÷ 2 = 4" },
      ],
    },
  },

  // Interactive: Equation builder for PLSV (harder)
  {
    id: "q-linear-interactive-2",
    topicSlug: "4-persamaan-linear-satu-variabel-plsv",
    question: "Selesaikan: 4x - 3 = 2x + 9",
    options: [],
    correctIndex: 0,
    explanation: "4x - 2x = 9 + 3 → 2x = 12 → x = 6",
    type: "equation",
    equation: {
      steps: [
        { prompt: "Langkah 1: Pindahkan 2x ke ruas kiri", options: ["4x - 2x = 9 + 3", "4x + 2x = 9 + 3", "4x - 2x = 9 - 3", "4x = 2x + 12"], correctIndex: 0, explanation: "Kurangkan 2x dari kedua ruas" },
        { prompt: "Langkah 2: Pindahkan -3 ke ruas kanan", options: ["2x = 9 + 3", "2x = 9 - 3", "2x = 12 - 3", "2x = 3 - 9"], correctIndex: 0, explanation: "Tambah 3 ke kedua ruas" },
        { prompt: "Langkah 3: Hasil dan bagi", options: ["x = 6", "x = 3", "x = 12", "x = 4"], correctIndex: 0, explanation: "2x = 12, x = 12/2 = 6" },
      ],
    },
  },

  // Interactive: Sorting integers
  {
    id: "q-bilangan-interactive-5",
    topicSlug: "1-bilangan-bulat-pecahan-desimal-persen",
    question: "Susun bilangan ini dari terkecil ke terbesar",
    options: [],
    correctIndex: 0,
    explanation: "-5 < -2 < 0 < 3 < 7",
    type: "sorting",
    sorting: { items: ["3", "-5", "0", "7", "-2"], correctOrder: [1, 4, 2, 0, 3], label: "Dari terkecil ke terbesar" },
  },

  // Perbandingan
  {
    id: "q-perbandingan-1",
    topicSlug: "6-perbandingan-senilai-berbalik-nilai",
    question: "5 pekerja menyelesaikan proyek dalam 12 hari. Jika 3 pekerja, berapa hari?",
    options: ["20 hari", "18 hari", "15 hari", "8 hari"],
    correctIndex: 0,
    explanation: "Berbalik nilai: 5 × 12 = 3 × d → d = 20 hari",
  },

  // Pola Bilangan
  {
    id: "q-pola-1",
    topicSlug: "8-pola-bilangan-dan-barisan",
    question: "Suku ke-10 dari barisan 2, 5, 8, 11, ... adalah ____",
    options: ["29", "32", "26", "35"],
    correctIndex: 0,
    explanation: "Beda b=3. U₁₀ = 2 + (10-1)(3) = 2 + 27 = 29",
    alternatives: ["29"],
  },

  // Garis Lurus
  {
    id: "q-garis-1",
    topicSlug: "10-persamaan-garis-lurus",
    question: "Gradien garis melalui (2,3) dan (4,7) adalah ____",
    options: ["2", "3", "1", "4"],
    correctIndex: 0,
    explanation: "m = (7-3)/(4-2) = 4/2 = 2",
    alternatives: ["2"],
  },

  // Pythagoras
  {
    id: "q-pythagoras-1",
    topicSlug: "14-teorema-pythagoras",
    question: "Panjang hipotenusa segitiga siku-siku dengan sisi 6 dan 8 adalah...",
    options: ["10", "12", "14", "11"],
    correctIndex: 0,
    explanation: "c² = a² + b² = 6² + 8² = 36 + 64 = 100, c = 10",
  },
  {
    id: "q-pythagoras-2",
    topicSlug: "14-teorema-pythagoras",
    question: "Tripel Pythagoras yang benar adalah...",
    options: ["(5,12,13)", "(4,6,8)", "(3,5,7)", "(6,8,12)"],
    correctIndex: 0,
    explanation: "5² + 12² = 25 + 144 = 169 = 13²",
    alternatives: ["(5,12,13)"],
  },

  // Lingkaran
  {
    id: "q-lingkaran-1",
    topicSlug: "15-lingkaran",
    question: "Luas lingkaran dengan jari-jari 7 cm (π ≈ 22/7) adalah...",
    options: ["154 cm²", "144 cm²", "156 cm²", "148 cm²"],
    correctIndex: 0,
    explanation: "L = πr² = (22/7) × 49 = 154 cm²",
  },
  {
    id: "q-lingkaran-2",
    topicSlug: "15-lingkaran",
    question: "Keliling lingkaran dengan diameter 14 cm adalah...",
    options: ["44 cm", "88 cm", "22 cm", "154 cm"],
    correctIndex: 0,
    explanation: "K = πd = (22/7) × 14 = 44 cm",
    alternatives: ["44"],
  },

  // Segitiga
  {
    id: "q-segitiga-1",
    topicSlug: "13-segitiga-dan-segiempat",
    question: "Luas trapesium dengan alas 10 cm, alas atas 6 cm, tinggi 5 cm adalah...",
    options: ["40 cm²", "50 cm²", "30 cm²", "45 cm²"],
    correctIndex: 0,
    explanation: "L = ½(a+b)×t = ½(10+6)×5 = ½×16×5 = 40 cm²",
    alternatives: ["40 cm²","40"],
  },

  // ==================== SMA ====================
  // Eksponen
  {
    id: "q-eksponen-1",
    topicSlug: "1-eksponen-dan-bentuk-akar",
    question: "Sederhanakan 2³ × 2⁴",
    options: ["2⁷", "2¹²", "2¹", "2⁶"],
    correctIndex: 0,
    explanation: "a^m × a^n = a^(m+n) = 2^(3+4) = 2⁷",
  },
  {
    id: "q-eksponen-2",
    topicSlug: "1-eksponen-dan-bentuk-akar",
    question: "Nilai dari (3²)³ adalah ____",
    options: ["729", "216", "54", "18"],
    correctIndex: 0,
    explanation: "(a^m)^n = a^(mn) = 3^(2×3) = 3⁶ = 729",
    alternatives: ["729"],
  },

  // Logaritma
  {
    id: "q-logaritma-1",
    topicSlug: "2-logaritma",
    question: "Nilai log₂ 32 adalah ____",
    options: ["5", "4", "6", "3"],
    correctIndex: 0,
    explanation: "2⁵ = 32, maka log₂ 32 = 5",
    alternatives: ["5"],
  },
  {
    id: "q-logaritma-2",
    topicSlug: "2-logaritma",
    question: "Nilai log 100 adalah ____",
    options: ["2", "3", "1", "10"],
    correctIndex: 0,
    explanation: "log 100 = log 10² = 2 (log basis 10)",
    alternatives: ["2"],
  },

  // Kuadrat
  {
    id: "q-kuadrat-1",
    topicSlug: "3-persamaan-dan-fungsi-kuadrat",
    question: "Akar-akar persamaan x² - 5x + 6 = 0 adalah...",
    options: ["2 dan 3", "1 dan 6", "-2 dan -3", "1 dan 5"],
    correctIndex: 0,
    explanation: "(x-2)(x-3) = 0, maka x = 2 atau x = 3",
  },
  {
    id: "q-kuadrat-2",
    topicSlug: "3-persamaan-dan-fungsi-kuadrat",
    question: "Diskriminan dari x² - 4x + 4 = 0 adalah...",
    options: ["0", "16", "8", "-16"],
    correctIndex: 0,
    explanation: "D = b²-4ac = (-4)²-4(1)(4) = 16-16 = 0",
    alternatives: ["0"],
  },

  // Matriks
  {
    id: "q-matriks-1",
    topicSlug: "6-matriks",
    question: "Determinan matriks [[2,1],[5,3]] adalah ____",
    options: ["1", "11", "-1", "6"],
    correctIndex: 0,
    explanation: "det = ad-bc = (2)(3)-(1)(5) = 6-5 = 1",
    alternatives: ["1"],
  },

  // Vektor
  {
    id: "q-vektor-1",
    topicSlug: "7-vektor",
    question: "Besar vektor (3, 4) adalah ____",
    options: ["5", "7", "12", "25"],
    correctIndex: 0,
    explanation: "|v| = √(3²+4²) = √(9+16) = √25 = 5",
    alternatives: ["5"],
  },

  // Trigonometri
  {
    id: "q-trigo-1",
    topicSlug: "8-trigonometri-dasar",
    question: "Nilai sin 30° adalah ____",
    options: ["1/2", "√3/2", "√2/2", "1"],
    correctIndex: 0,
    explanation: "sin 30° = 1/2 (nilai khusus trigonometri)",
    alternatives: ["1/2","0.5"],
  },

  // Interactive: Number line for trig values
  {
    id: "q-trigo-interactive-1",
    topicSlug: "8-trigonometri-dasar",
    question: "Geser ke posisi sin 30° di garis bilangan",
    options: [],
    correctIndex: 0,
    explanation: "sin 30° = 0.5",
    type: "numberline",
    numberLine: { min: 0, max: 1, correctValue: 0.5, step: 0.1, tolerance: 0.1 },
  },
  {
    id: "q-trigo-interactive-2",
    topicSlug: "8-trigonometri-dasar",
    question: "Geser ke posisi cos 60° di garis bilangan",
    options: [],
    correctIndex: 0,
    explanation: "cos 60° = 0.5",
    type: "numberline",
    numberLine: { min: 0, max: 1, correctValue: 0.5, step: 0.1, tolerance: 0.1 },
  },

  {
    id: "q-trigo-2",
    topicSlug: "8-trigonometri-dasar",
    question: "Jika sin θ = 3/5, maka cos θ = ...",
    options: ["4/5", "3/5", "5/3", "5/4"],
    correctIndex: 0,
    explanation: "sin²θ + cos²θ = 1 → cos²θ = 1 - 9/25 = 16/25 → cos θ = 4/5",
    alternatives: ["4/5","0.8"],
  },

  // Limit
  {
    id: "q-limit-1",
    topicSlug: "13-limit-fungsi",
    question: "lim(x→2) (x²-4)/(x-2) = ...",
    options: ["4", "0", "2", "∞"],
    correctIndex: 0,
    explanation: "Faktorkan: (x²-4)/(x-2) = (x+2)(x-2)/(x-2) = x+2. lim(x→2) = 4",
    alternatives: ["4"],
  },

  // Interactive: Number line for limit
  {
    id: "q-limit-interactive-1",
    topicSlug: "13-limit-fungsi",
    question: "Geser ke posisi limit f(x) = x² di x → 3",
    options: [],
    correctIndex: 0,
    explanation: "lim(x→3) x² = 9",
    type: "numberline",
    numberLine: { min: 0, max: 15, correctValue: 9, step: 1, tolerance: 0.5 },
  },

  // Turunan
  {
    id: "q-turunan-1",
    topicSlug: "14-turunan-diferensial",
    question: "Turunan dari f(x) = x³ + 2x adalah ____",
    options: ["3x² + 2", "3x² + x", "x² + 2", "3x + 2"],
    correctIndex: 0,
    explanation: "f'(x) = 3x² + 2",
    alternatives: ["3x² + 2"],
  },
  {
    id: "q-turunan-2",
    topicSlug: "14-turunan-diferensial",
    question: "Turunan dari f(x) = sin x adalah ____",
    options: ["cos x", "-cos x", "sin x", "-sin x"],
    correctIndex: 0,
    explanation: "(sin x)' = cos x",
    alternatives: ["cos x","cosx"],
  },

  // Integral
  {
    id: "q-integral-1",
    topicSlug: "16-integral",
    question: "∫ 2x dx = ____",
    options: ["x² + C", "2x² + C", "x + C", "2x + C"],
    correctIndex: 0,
    explanation: "∫ 2x dx = 2 × (x²/2) + C = x² + C",
    alternatives: ["x² + C","x^2 + C"],
  },
  {
    id: "q-integral-2",
    topicSlug: "16-integral",
    question: "∫₀¹ 3x² dx = ...",
    options: ["1", "3", "0", "2"],
    correctIndex: 0,
    explanation: "∫ 3x² dx = x³. Evaluasi: 1³ - 0³ = 1",
    alternatives: ["1"],
  },

  // Barisan Aritmetika
  {
    id: "q-barisan-1",
    topicSlug: "11-barisan-dan-deret-aritmetika",
    question: "Suku ke-5 dari barisan 3, 7, 11, 15, ... adalah...",
    options: ["19", "23", "17", "21"],
    correctIndex: 0,
    explanation: "a=3, b=4. U₅ = 3 + (5-1)(4) = 3 + 16 = 19",
    alternatives: ["19"],
  },

  // Barisan Geometri
  {
    id: "q-barisan-2",
    topicSlug: "12-barisan-dan-deret-geometri",
    question: "Jumlah 5 suku pertama barisan 2, 6, 18, 54, ... adalah...",
    options: ["242", "121", "486", "162"],
    correctIndex: 0,
    explanation: "a=2, r=3. S₅ = 2(3⁵-1)/(3-1) = 2(243-1)/2 = 242",
    alternatives: ["242"],
  },

  // Statistika
  {
    id: "q-stat-1",
    topicSlug: "18-statistika-lanjut",
    question: "Mean dari data 4, 6, 8, 10, 12 adalah...",
    options: ["8", "7", "9", "10"],
    correctIndex: 0,
    explanation: "Mean = (4+6+8+10+12)/5 = 40/5 = 8",
    alternatives: ["8"],
  },

  // Peluang
  {
    id: "q-peluang-1",
    topicSlug: "20-peluang",
    question: "Peluang muncul angka genap dari satu dadu adalah...",
    options: ["1/2", "1/3", "1/6", "2/3"],
    correctIndex: 0,
    explanation: "Angka genap: {2,4,6} = 3 buah. P = 3/6 = 1/2",
    alternatives: ["1/2","0.5","50%"],
  },

  // Aplikasi Turunan
  {
    id: "q-aplikasi-turunan-1",
    topicSlug: "15-aplikasi-turunan",
    question: "Fungsi f(x) = x² - 4x + 3 punya minimum di x = ...",
    options: ["2", "4", "-2", "3"],
    correctIndex: 0,
    explanation: "f'(x) = 2x-4 = 0 → x = 2. f''(2) = 2 > 0 (minimum)",
    alternatives: ["2"],
  },

  // Aplikasi Integral
  {
    id: "q-aplikasi-integral-1",
    topicSlug: "17-aplikasi-integral",
    question: "Luas area di bawah y = x² dari x=0 ke x=2 adalah...",
    options: ["8/3", "4", "2", "16/3"],
    correctIndex: 0,
    explanation: "∫₀² x² dx = [x³/3]₀² = 8/3 - 0 = 8/3",
    alternatives: ["8/3"],
  },

  // Kaidah Pencacahan
  {
    id: "q-kaidah-1",
    topicSlug: "19-kaidah-pencacahan-permutasi-kombinasi",
    question: "C(10,3) = ____",
    options: ["120", "720", "210", "30"],
    correctIndex: 0,
    explanation: "C(10,3) = 10!/(3!×7!) = (10×9×8)/(3×2×1) = 120",
    alternatives: ["120"],
  },

  // Identitas Trigonometri
  {
    id: "q-identitas-1",
    topicSlug: "9-identitas-dan-persamaan-trigonometri",
    question: "Nilai sin 75° = sin(45°+30°) adalah...",
    options: ["(√6+√2)/4", "(√6-√2)/4", "(√3+1)/4", "√2/2"],
    correctIndex: 0,
    explanation: "sin(45°+30°) = sin45°cos30° + cos45°sin30° = (√2/2)(√3/2) + (√2/2)(1/2) = (√6+√2)/4",
    alternatives: ["(√6+√2)/4"],
  },

  // Aturan Sinus Cosinus
  {
    id: "q-sinus-1",
    topicSlug: "10-aturan-sinus-cosinus-dan-luas-segitiga",
    question: "Dalam segitiga ABC, jika a=5, b=7, C=60°, maka c² = ...",
    options: ["39", "74", "25", "49"],
    correctIndex: 0,
    explanation: "c² = a²+b²-2ab·cosC = 25+49-2(5)(7)cos60° = 74-35 = 39",
    alternatives: ["39"],
  },

  // ==================== KULIAH ====================
  // Calculus
  {
    id: "q-calculus-1",
    topicSlug: "a-calculus-kalkulus-iiii",
    question: "Nilai lim(x→0) sin(x)/x adalah ____",
    options: ["1", "0", "∞", "Tidak ada"],
    correctIndex: 0,
    explanation: "Ini adalah limit fundamental: lim(x→0) sin(x)/x = 1",
    alternatives: ["1"],
  },
  {
    id: "q-calculus-2",
    topicSlug: "a-calculus-kalkulus-iiii",
    question: "Turunan dari e^x adalah...",
    options: ["e^x", "xe^(x-1)", "e^(x-1)", "ln(x)·e^x"],
    correctIndex: 0,
    explanation: "(e^x)' = e^x (turunannya sendiri)",
    alternatives: ["e^x","ex"],
  },

  // Linear Algebra
  {
    id: "q-linalg-1",
    topicSlug: "b-linear-algebra-aljabar-linear",
    question: "Jika Av = λv, maka λ disebut...",
    options: ["nilai eigen", "vektor eigen", "determinan", "rank"],
    correctIndex: 0,
    explanation: "λ adalah nilai eigen (eigenvalue) dari matriks A",
    alternatives: ["nilai eigen"],
  },

  // Persamaan Diferensial
  {
    id: "q-diffeq-1",
    topicSlug: "c-differential-equations-persamaan-diferensial",
    question: "Solusi umum dy/dx = ky adalah...",
    options: ["y = Ce^(kx)", "y = Ckx", "y = C/x", "y = C + kx"],
    correctIndex: 0,
    explanation: "dy/y = k dx → ln|y| = kx + C → y = Ce^(kx)",
    alternatives: ["y = Ce^(kx)"],
  },

  // ==================== TAMBAHAN ====================
  // SMP - SPLDV
  {
    id: "q-spldv-1",
    topicSlug: "11-sistem-persamaan-linear-dua-variabel-spldv",
    question: "Penyelesaian x+y=10 dan x-y=2 adalah...",
    options: ["x=6, y=4", "x=5, y=5", "x=8, y=2", "x=7, y=3"],
    correctIndex: 0,
    explanation: "Jumlahkan: 2x=12 → x=6, maka y=4",
    alternatives: ["x=6, y=4"],
  },
  {
    id: "q-spldv-2",
    topicSlug: "11-sistem-persamaan-linear-dua-variabel-spldv",
    question: "Jika 2x+y=7 dan x-y=2, maka x=...",
    options: ["3", "2", "4", "5"],
    correctIndex: 0,
    explanation: "Eliminasi: 3x=9 → x=3",
    alternatives: ["x = 3"],
  },

  // SMP - Statistika
  {
    id: "q-stat-2",
    topicSlug: "18-statistika-dasar",
    question: "Median dari data 3,5,7,8,10 adalah...",
    options: ["7", "8", "6", "5"],
    correctIndex: 0,
    explanation: "Data sudah terurut, nilai tengah = 7",
    alternatives: ["7"],
  },
  {
    id: "q-stat-3",
    topicSlug: "18-statistika-dasar",
    question: "Modus dari data 2,3,3,4,5,3 adalah...",
    options: ["3", "4", "2", "5"],
    correctIndex: 0,
    explanation: "3 muncul paling sering (3 kali)",
    alternatives: ["3"],
  },

  // SMP - Peluang
  {
    id: "q-peluang-2",
    topicSlug: "19-peluang-dasar",
    question: "Peluang muncul angka ganjil dari satu dadu adalah...",
    options: ["1/2", "1/3", "1/6", "2/3"],
    correctIndex: 0,
    explanation: "Angka ganjil: {1,3,5} = 3 buah. P = 3/6 = 1/2",
    alternatives: ["1/2","0.5","50%"],
  },

  // SMP - Transformasi
  {
    id: "q-transform-1",
    topicSlug: "20-transformasi-geometri",
    question: "Titik (3,4) ditranslasi oleh (2,-1) menjadi...",
    options: ["(5,3)", "(6,4)", "(1,5)", "(5,5)"],
    correctIndex: 0,
    explanation: "(3+2, 4-1) = (5,3)",
    alternatives: ["(5,3)"],
  },

  // SMA - Pertidaksamaan
  {
    id: "q-pt-1",
    topicSlug: "4-pertidaksamaan-kuadrat-rasional-mutlak",
    question: "Penyelesaian |x-3| < 5 adalah...",
    options: ["-2 < x < 8", "x < 8", "x > -2", "-8 < x < 2"],
    correctIndex: 0,
    explanation: "-5 < x-3 < 5 → -2 < x < 8",
    alternatives: ["-2 < x < 8"],
  },

  // SMA - SPLTV
  {
    id: "q-spltv-1",
    topicSlug: "5-spltv-dan-program-linear",
    question: "Fungsi objektif Z = 3x + 2y dimaksimumkan pada...",
    options: ["Titik pojok DPR", "Titik tengah", "Semua titik", "Tidak ada"],
    correctIndex: 0,
    explanation: "Optimum selalu pada titik pojok daerah penyelesaian",
    alternatives: ["titik pojok DPR"],
  },

  // SMA - Identitas Trigonometri
  {
    id: "q-identitas-2",
    topicSlug: "9-identitas-dan-persamaan-trigonometri",
    question: "Nilai sin²30° + cos²30° = ...",
    options: ["1", "0", "2", "1/2"],
    correctIndex: 0,
    explanation: "Identitas fundamental: sin²θ + cos²θ = 1",
    alternatives: ["1"],
  },

  // SMA - Aturan Sinus Cosinus
  {
    id: "q-sinus-2",
    topicSlug: "10-aturan-sinus-cosinus-dan-luas-segitiga",
    question: "Dalam segitiga, jika A=30°, a=10, B=45°, maka b/ sin B = ...",
    options: ["10/sin30°", "10/sin45°", "10/tan30°", "10/cos45°"],
    correctIndex: 0,
    explanation: "Aturan sinus: a/sinA = b/sinB = c/sinC",
    alternatives: ["20"],
  },

  // SMA - Limit
  {
    id: "q-limit-2",
    topicSlug: "13-limit-fungsi",
    question: "lim(x→0) (1-cos x)/x² = ...",
    options: ["1/2", "0", "1", "∞"],
    correctIndex: 0,
    explanation: "Gunakan identitas: (1-cosx)/x² = 2sin²(x/2)/x² → 1/2",
    alternatives: ["1/2","0.5"],
  },

  // SMA - Aplikasi Turunan
  {
    id: "q-aplikasi-turunan-2",
    topicSlug: "15-aplikasi-turunan",
    question: "Gradien garis singgung kurva y=x² di x=3 adalah...",
    options: ["6", "9", "3", "12"],
    correctIndex: 0,
    explanation: "f'(x)=2x, f'(2)=6",
    alternatives: ["6"],
  },

  // SMA - Aplikasi Integral
  {
    id: "q-aplikasi-integral-2",
    topicSlug: "17-aplikasi-integral",
    question: "Volume bola jari-jari 3 (putar sumbu-x) adalah...",
    options: ["36π", "108π", "27π", "48π"],
    correctIndex: 0,
    explanation: "V = (4/3)πr³ = (4/3)π(27) = 36π",
    alternatives: ["36π","36pi"],
  },

  // SMA - Barisan Aritmetika
  {
    id: "q-barisan-3",
    topicSlug: "11-barisan-dan-deret-aritmetika",
    question: "Jumlah 10 suku pertama barisan 2,5,8,11,... adalah...",
    options: ["155", "145", "165", "135"],
    correctIndex: 0,
    explanation: "S₁₀ = 10/2(2·2 + 9·3) = 5(4+27) = 5·31 = 155",
    alternatives: ["155"],
  },

  // SMA - Barisan Geometri
  {
    id: "q-barisan-4",
    topicSlug: "12-barisan-dan-deret-geometri",
    question: "Suku ke-4 dari barisan 3,6,12,24,... adalah...",
    options: ["24", "48", "18", "36"],
    correctIndex: 0,
    explanation: "a=3, r=2. U₄ = 3·2³ = 24",
    alternatives: ["24"],
  },

  // SMA - Kaidah Pencacahan
  {
    id: "q-kaidah-2",
    topicSlug: "19-kaidah-pencacahan-permutasi-kombinasi",
    question: "5 orang duduk di bangku panjang. Banyak cara = ...",
    options: ["120", "25", "60", "720"],
    correctIndex: 0,
    explanation: "P(5,5) = 5! = 120",
    alternatives: ["120"],
  },

  // SMA - Statistika Lanjut
  {
    id: "q-stat-4",
    topicSlug: "18-statistika-lanjut",
    question: "Jika data mean=50, s=10, maka skor z untuk x=70 adalah...",
    options: ["2", "-2", "1", "3"],
    correctIndex: 0,
    explanation: "z = (x-mean)/s = (70-50)/10 = 2",
    alternatives: ["2"],
  },

  // Kuliah - Linear Algebra
  {
    id: "q-linalg-2",
    topicSlug: "b-linear-algebra-aljabar-linear",
    question: "Determinan matriks identitas I₃ adalah...",
    options: ["1", "0", "3", "6"],
    correctIndex: 0,
    explanation: "det(I) = 1 untuk matriks identitas berapa pun",
    alternatives: ["1"],
  },

  // Kuliah - Calculus
  {
    id: "q-calculus-3",
    topicSlug: "a-calculus-kalkulus-iiii",
    question: "∫₀^π sin x dx = ...",
    options: ["2", "0", "1", "π"],
    correctIndex: 0,
    explanation: "[-cos x]₀^π = -(-1)-(-1) = 1+1 = 2",
    alternatives: ["2"],
  },
  {
    id: "q-calculus-4",
    topicSlug: "a-calculus-kalkulus-iiii",
    question: "Turunan f(x) = ln(x²+1) adalah...",
    options: ["2x/(x²+1)", "1/(x²+1)", "2x", "ln(2x)"],
    correctIndex: 0,
    explanation: "Aturan rantai: f'(x) = 1/(x²+1) · 2x = 2x/(x²+1)",
    alternatives: ["2x/(x²+1)"],
  },

  // ==================== SOAL BARU P1-1 ====================
  // 5-pertidaksamaan-linear-satu-variabel-ptlsv (SMP)
  {
    id: "q-ptlsv-1",
    topicSlug: "5-pertidaksamaan-linear-satu-variabel-ptlsv",
    question: "Penyelesaian 2x + 3 > 7 adalah...",
    options: ["x > 2", "x < 2", "x > 5", "x < 5"],
    correctIndex: 0,
    explanation: "2x + 3 > 7 → 2x > 4 → x > 2",
    alternatives: ["x > 2"],
  },
  {
    id: "q-ptlsv-2",
    topicSlug: "5-pertidaksamaan-linear-satu-variabel-ptlsv",
    question: "Jika 3x - 5 ≤ 10, maka x ≤ ...",
    options: ["5", "3", "15", "4"],
    correctIndex: 0,
    explanation: "3x - 5 ≤ 10 → 3x ≤ 15 → x ≤ 5",
    alternatives: ["5"],
  },
  {
    id: "q-ptlsv-3",
    topicSlug: "5-pertidaksamaan-linear-satu-variabel-ptlsv",
    question: "Penyelesaian -2x + 1 < 5 adalah...",
    options: ["x > -2", "x < -2", "x > 2", "x < 2"],
    correctIndex: 0,
    explanation: "-2x + 1 < 5 → -2x < 4 → x > -2 (tanda berubah karena dibagi negatif)",
    alternatives: ["x > -2"],
  },
  {
    id: "q-ptlsv-4",
    topicSlug: "5-pertidaksamaan-linear-satu-variabel-ptlsv",
    question: "Bilangan bulat positif yang memenuhi x - 3 < 5 adalah...",
    options: ["1, 2, 3, 4, 5, 6, 7", "1, 2, 3, 4, 5, 6", "5, 6, 7", "1, 2, 3"],
    correctIndex: 0,
    explanation: "x - 3 < 5 → x < 8. Bilangan bulat positif: 1, 2, 3, 4, 5, 6, 7",
    alternatives: ["1, 2, 3, 4, 5, 6, 7"],
  },

  // 7-aritmetika-sosial (SMP)
  {
    id: "q-sosial-1",
    topicSlug: "7-aritmetika-sosial",
    question: "Sebuah baju dibeli Rp80.000 dijual dengan keuntungan 25%. Harga jual = ...",
    options: ["Rp100.000", "Rp95.000", "Rp105.000", "Rp120.000"],
    correctIndex: 0,
    explanation: "Harga jual = Rp80.000 × 125% = Rp100.000",
    alternatives: ["Rp100.000","100000"],
  },
  {
    id: "q-sosial-2",
    topicSlug: "7-aritmetika-sosial",
    question: "Hp dijual Rp1.200.000 dengan diskon 15%. Harga setelah diskon = ...",
    options: ["Rp1.020.000", "Rp1.080.000", "Rp1.050.000", "Rp960.000"],
    correctIndex: 0,
    explanation: "Harga setelah diskon = Rp1.200.000 × 85% = Rp1.020.000",
    alternatives: ["Rp1.020.000","1020000"],
  },
  {
    id: "q-sosial-3",
    topicSlug: "7-aritmetika-sosial",
    question: "Toko membeli barang Rp500.000, dijual Rp625.000. Keuntungan = ...%",
    options: ["25%", "20%", "15%", "30%"],
    correctIndex: 0,
    explanation: "Keuntungan = (125.000/500.000) × 100% = 25%",
    alternatives: ["25%"],
  },
  {
    id: "q-sosial-4",
    topicSlug: "7-aritmetika-sosial",
    question: "Gaji Rp4.500.000 dikenai pajak 10%. Gaji bersih = ...",
    options: ["Rp4.050.000", "Rp4.100.000", "Rp4.000.000", "Rp4.200.000"],
    correctIndex: 0,
    explanation: "Pajak = Rp4.500.000 × 10% = Rp450.000. Gaji bersih = Rp4.500.000 - Rp450.000 = Rp4.050.000",
    alternatives: ["Rp4.050.000","4050000"],
  },

  // 9-relasi-dan-fungsi (SMP)
  {
    id: "q-relasi-1",
    topicSlug: "9-relasi-dan-fungsi",
    question: "Fungsi f(x) = 2x + 1. Nilai f(3) adalah...",
    options: ["7", "5", "6", "9"],
    correctIndex: 0,
    explanation: "f(3) = 2(3) + 1 = 7",
    alternatives: ["7"],
  },
  {
    id: "q-relasi-2",
    topicSlug: "9-relasi-dan-fungsi",
    question: "Domain fungsi f(x) = sqrt(x-2) adalah...",
    options: ["x >= 2", "x > 2", "x >= 0", "Semua bilangan"],
    correctIndex: 0,
    explanation: "Akar real: x - 2 >= 0 maka x >= 2",
    alternatives: ["x >= 2","x≥2","[2,∞)"],
  },
  {
    id: "q-relasi-3",
    topicSlug: "9-relasi-dan-fungsi",
    question: "Fungsi g(x) = x^2 - 4. Nilai x jika g(x) = 5 adalah...",
    options: ["3 atau -3", "3", "-3", "5"],
    correctIndex: 0,
    explanation: "x^2 - 4 = 5, x^2 = 9, x = 3 atau x = -3",
    alternatives: ["3 atau -3","±3"],
  },
  {
    id: "q-relasi-4",
    topicSlug: "9-relasi-dan-fungsi",
    question: "Jika f(x) = 3x - 2, maka f^-1(x) = ...",
    options: ["(x+2)/3", "(x-2)/3", "3x+2", "3x-2"],
    correctIndex: 0,
    explanation: "y = 3x - 2, x = 3y - 2, y = (x+2)/3",
    alternatives: ["(x+2)/3"],
  },

  // 12-garis-dan-sudut (SMP)
  {
    id: "q-sudut-1",
    topicSlug: "12-garis-dan-sudut",
    question: "Jumlah sudut dalam segitiga adalah...",
    options: ["180 derajat", "360 derajat", "270 derajat", "90 derajat"],
    correctIndex: 0,
    explanation: "Jumlah sudut dalam segitiga = 180 derajat",
    alternatives: ["180 derajat","180°"],
  },
  {
    id: "q-sudut-2",
    topicSlug: "12-garis-dan-sudut",
    question: "Dua garis sejajar dipotong garis potong. Sudut dalam sehadap = ...",
    options: ["Sama besar", "Berbeda", "Tumpul dan lancip", "Saling melengkapi"],
    correctIndex: 0,
    explanation: "Sudut dalam sehadap pada garis sejajar selalu sama besar.",
    alternatives: ["sama besar"],
  },
  {
    id: "q-sudut-3",
    topicSlug: "12-garis-dan-sudut",
    question: "Jika sudut A = 60 derajat, maka pelurus sudut A adalah...",
    options: ["120 derajat", "30 derajat", "240 derajat", "180 derajat"],
    correctIndex: 0,
    explanation: "Pelurus sudut = 180 - 60 = 120 derajat",
    alternatives: ["120 derajat","120°"],
  },
  {
    id: "q-sudut-4",
    topicSlug: "12-garis-dan-sudut",
    question: "Sudut bertolak belakang yang dibentuk dua garis yang berpotongan selalu...",
    options: ["Sama besar", "Bersudut siku-siku", "Berjumlah 180 derajat", "Tidak tentu"],
    correctIndex: 0,
    explanation: "Sudut yang bertolak belakang selalu sama besar.",
    alternatives: ["sama besar"],
  },

  // 16-bangun-ruang-sisi-datar (SMP)
  {
    id: "q-sisidatar-1",
    topicSlug: "16-bangun-ruang-sisi-datar",
    question: "Jumlah sisi, rusuk, dan titik sudut kubus adalah...",
    options: ["6, 12, 8", "6, 8, 12", "8, 12, 6", "6, 6, 8"],
    correctIndex: 0,
    explanation: "Kubus: 6 sisi, 12 rusuk, 8 titik sudut",
    alternatives: ["6, 12, 8"],
  },
  {
    id: "q-sisidatar-2",
    topicSlug: "16-bangun-ruang-sisi-datar",
    question: "Volume balok dengan panjang 8 cm, lebar 5 cm, tinggi 3 cm adalah...",
    options: ["120 cm3", "150 cm3", "80 cm3", "100 cm3"],
    correctIndex: 0,
    explanation: "V = p x l x t = 8 x 5 x 3 = 120 cm3",
    alternatives: ["120 cm3","120"],
  },
  {
    id: "q-sisidatar-3",
    topicSlug: "16-bangun-ruang-sisi-datar",
    question: "Luas permukaan kubus dengan rusuk 4 cm adalah...",
    options: ["96 cm2", "64 cm2", "48 cm2", "128 cm2"],
    correctIndex: 0,
    explanation: "LP = 6 x r^2 = 6 x 16 = 96 cm2",
    alternatives: ["96 cm2","96"],
  },
  {
    id: "q-sisidatar-4",
    topicSlug: "16-bangun-ruang-sisi-datar",
    question: "Prisma segitiga memiliki jumlah sisi adalah...",
    options: ["5", "4", "6", "3"],
    correctIndex: 0,
    explanation: "Prisma segitiga: 2 sisi alas + 3 sisi tegak = 5 sisi",
    alternatives: ["5"],
  },

  // 17-bangun-ruang-sisi-lengkung (SMP)
  {
    id: "q-sisilengkung-1",
    topicSlug: "17-bangun-ruang-sisi-lengkung",
    question: "Volume tabung dengan jari-jari 7 cm dan tinggi 10 cm (pi=22/7) adalah...",
    options: ["1540 cm3", "1440 cm3", "1500 cm3", "1600 cm3"],
    correctIndex: 0,
    explanation: "V = pi*r^2*t = (22/7) x 49 x 10 = 1540 cm3",
    alternatives: ["1540 cm3","1540"],
  },
  {
    id: "q-sisilengkung-2",
    topicSlug: "17-bangun-ruang-sisi-lengkung",
    question: "Luas selimut tabung dengan jari-jari 7 cm dan tinggi 10 cm (pi=22/7) adalah...",
    options: ["440 cm2", "1540 cm2", "308 cm2", "220 cm2"],
    correctIndex: 0,
    explanation: "L selimut = 2*pi*r*t = 2 x (22/7) x 7 x 10 = 440 cm2",
    alternatives: ["440 cm2","440"],
  },
  {
    id: "q-sisilengkung-3",
    topicSlug: "17-bangun-ruang-sisi-lengkung",
    question: "Volume kerucut dengan jari-jari 6 cm dan tinggi 10 cm (pi=3,14) adalah...",
    options: ["376,8 cm3", "1130,4 cm3", "565,2 cm3", "188,4 cm3"],
    correctIndex: 0,
    explanation: "V = (1/3)*pi*r^2*t = (1/3) x 3,14 x 36 x 10 = 376,8 cm3",
    alternatives: ["376,8 cm3","376.8 cm3"],
  },
  {
    id: "q-sisilengkung-4",
    topicSlug: "17-bangun-ruang-sisi-lengkung",
    question: "Volume bola dengan jari-jari 7 cm (pi=22/7) adalah...",
    options: ["1437,33 cm3", "308 cm3", "616 cm3", "1540 cm3"],
    correctIndex: 0,
    explanation: "V = (4/3)*pi*r^3 = (4/3) x (22/7) x 343 = 1437,33 cm3",
    alternatives: ["1437,33 cm3","1437.33 cm3"],
  },

  // 21-persamaan-lingkaran-dan-irisan-kerucut (SMA)
  {
    id: "q-lingkaran-3",
    topicSlug: "21-persamaan-lingkaran-dan-irisan-kerucut",
    question: "Pusat dan jari-jari lingkaran x^2 + y^2 = 25 adalah...",
    options: ["(0,0) dan 5", "(0,0) dan 25", "(5,5) dan 5", "(25,25) dan 5"],
    correctIndex: 0,
    explanation: "Persamaan x^2 + y^2 = r^2, maka pusat (0,0) dan r = 5",
    alternatives: ["(0,0) dan 5"],
  },
  {
    id: "q-lingkaran-4",
    topicSlug: "21-persamaan-lingkaran-dan-irisan-kerucut",
    question: "Persamaan lingkaran dengan pusat (2,3) dan jari-jari 4 adalah...",
    options: ["(x-2)^2 + (y-3)^2 = 16", "(x+2)^2 + (y+3)^2 = 16", "(x-2)^2 + (y-3)^2 = 4", "x^2 + y^2 = 16"],
    correctIndex: 0,
    explanation: "(x-a)^2 + (y-b)^2 = r^2, maka (x-2)^2 + (y-3)^2 = 16",
    alternatives: ["(x-2)^2 + (y-3)^2 = 16"],
  },
  {
    id: "q-lingkaran-5",
    topicSlug: "21-persamaan-lingkaran-dan-irisan-kerucut",
    question: "Garis singgung lingkaran x^2 + y^2 = 10 di titik (1,3) memiliki persamaan...",
    options: ["x + 3y = 10", "x + 3y = 20", "3x + y = 10", "x - 3y = 10"],
    correctIndex: 0,
    explanation: "Persamaan tangent di (x1,y1): x1*x + y1*y = r^2, maka x + 3y = 10",
    alternatives: ["x + 3y = 10"],
  },
  {
    id: "q-lingkaran-6",
    topicSlug: "21-persamaan-lingkaran-dan-irisan-kerucut",
    question: "Titik (1,2) terhadap lingkaran x^2 + y^2 = 9 berada...",
    options: ["Di dalam lingkaran", "Di atas lingkaran", "Di luar lingkaran", "Tepat di lingkaran"],
    correctIndex: 0,
    explanation: "1^2 + 2^2 = 5 < 9, maka titik di dalam lingkaran",
    alternatives: ["di dalam lingkaran"],
  },

  // 22-bilangan-kompleks (SMA)
  {
    id: "q-kompleks-1",
    topicSlug: "22-bilangan-kompleks",
    question: "Hasil dari (3 + 2i) + (1 - 4i) adalah...",
    options: ["4 - 2i", "4 + 2i", "2 - 2i", "2 + 6i"],
    correctIndex: 0,
    explanation: "(3+1) + (2-4)i = 4 - 2i",
    alternatives: ["4 - 2i"],
  },
  {
    id: "q-kompleks-2",
    topicSlug: "22-bilangan-kompleks",
    question: "Hasil dari (2 + 3i)(1 - i) adalah...",
    options: ["5 + i", "5 - i", "-1 + 5i", "2 + 3i"],
    correctIndex: 0,
    explanation: "2*1 + 2*(-i) + 3i*1 + 3i*(-i) = 2 - 2i + 3i + 3 = 5 + i",
    alternatives: ["5 + i"],
  },
  {
    id: "q-kompleks-3",
    topicSlug: "22-bilangan-kompleks",
    question: "Modulus dari bilangan kompleks 3 + 4i adalah...",
    options: ["5", "7", "25", "12"],
    correctIndex: 0,
    explanation: "|z| = sqrt(3^2 + 4^2) = sqrt(25) = 5",
    alternatives: ["5"],
  },
  {
    id: "q-kompleks-4",
    topicSlug: "22-bilangan-kompleks",
    question: "Konjugat dari 5 - 2i adalah...",
    options: ["5 + 2i", "-5 - 2i", "5 - 2i", "-5 + 2i"],
    correctIndex: 0,
    explanation: "Konjugat dari a + bi adalah a - bi, maka konjugat dari 5 - 2i = 5 + 2i",
    alternatives: ["5 + 2i"],
  },

  // d-real-analysis-analisis-real (Kuliah)
  {
    id: "q-real-1",
    topicSlug: "d-real-analysis-analisis-real",
    question: "Limit dari barisan 1/n ketika n ke tak hingga adalah...",
    options: ["0", "1", "Tak hingga", "Tidak ada"],
    correctIndex: 0,
    explanation: "lim(n->inf) 1/n = 0 karena penyebut makin besar tanpa batas",
    alternatives: ["0"],
  },
  {
    id: "q-real-2",
    topicSlug: "d-real-analysis-analisis-real",
    question: "Rumus epsilon-N untuk membuktikan lim(n->inf) 3/n = 0 adalah...",
    options: ["Untuk e>0, pilih N > 3/e", "Untuk e>0, pilih N > e/3", "Untuk e>0, pilih N > 3", "Untuk e>0, pilih N > e"],
    correctIndex: 0,
    explanation: "|3/n - 0| = 3/n < e jika n > 3/e. Maka N = 3/e.",
    alternatives: ["Untuk e>0, pilih N > 3/e"],
  },
  {
    id: "q-real-3",
    topicSlug: "d-real-analysis-analisis-real",
    question: "Suatu himpunan S terbatas dari atas jika...",
    options: ["Ada bilangan real M sehingga s <= M untuk semua s di S", "S hanya berisi bilangan bulat", "S kosong", "S berisi bilangan negatif"],
    correctIndex: 0,
    explanation: "Definisi terbatas dari atas: ada M real sehingga semua elemen S <= M.",
    alternatives: ["ada bilangan real M sehingga s <= M untuk semua s di S"],
  },
  {
    id: "q-real-4",
    topicSlug: "d-real-analysis-analisis-real",
    question: "Sifat Archimedes bilangan real menyatakan bahwa...",
    options: ["Untuk setiap x > 0, ada n bilangan bulat sehingga n > x", "Setiap bilangan real adalah rasional", "Setiap himpunan terbatas punya batas", "Setiap barisan konvergen"],
    correctIndex: 0,
    explanation: "Sifat Archimedes: untuk x > 0 apapun, selalu ada bilangan bulat n yang lebih besar dari x.",
    alternatives: ["untuk setiap x > 0, ada n bilangan bulat sehingga n > x"],
  },

  // e-abstract-algebra-aljabar-abstrak (Kuliah)
  {
    id: "q-abstract-1",
    topicSlug: "e-abstract-algebra-aljabar-abstrak",
    question: "Himpunan {0, 1, 2, 3} dengan operasi penjumlahan mod 4 membentuk...",
    options: ["Grup abelian", "Grup tidak abelian", "Semigrup saja", "Monoid saja"],
    correctIndex: 0,
    explanation: "Z4 dengan + mod 4 memenuhi semua aksioma grup dan komutatif, sehingga grup abelian.",
    alternatives: ["grup abelian"],
  },
  {
    id: "q-abstract-2",
    topicSlug: "e-abstract-algebra-aljabar-abstrak",
    question: "Unsur identitas dalam grup adalah...",
    options: ["e*a = a*e = a untuk semua a", "a*a = a untuk semua a", "a*ainv = 0", "a + 0 = 0"],
    correctIndex: 0,
    explanation: "Unsur identitas e memenuhi e*a = a*e = a untuk setiap a dalam grup.",
    alternatives: ["e*a = a*e = a untuk semua a"],
  },
  {
    id: "q-abstract-3",
    topicSlug: "e-abstract-algebra-aljabar-abstrak",
    question: "Himpunan {1, -1} dengan operasi perkalian biasa membentuk...",
    options: ["Grup orde 2", "Grup orde 4", "Hanya monoid", "Tidak ada"],
    correctIndex: 0,
    explanation: "1*1=1, 1*(-1)=-1, (-1)*1=-1, (-1)*(-1)=1. Grup orde 2.",
    alternatives: ["grup orde 2"],
  },
  {
    id: "q-abstract-4",
    topicSlug: "e-abstract-algebra-aljabar-abstrak",
    question: "Sifat asosiatif operasi * artinya...",
    options: ["(a*b)*c = a*(b*c) untuk semua a,b,c", "a*b = b*a untuk semua a,b", "a*e = a untuk semua a", "a*ainv = e untuk semua a"],
    correctIndex: 0,
    explanation: "Asosiatif: pengelompokan tidak mempengaruhi hasil operasi.",
    alternatives: ["(a*b)*c = a*(b*c) untuk semua a,b,c"],
  },

  // f-discrete-mathematics-matematika-diskrit (Kuliah)
  {
    id: "q-diskrit-1",
    topicSlug: "f-discrete-mathematics-matematika-diskrit",
    question: "Banyak subset dari himpunan yang memiliki 5 elemen adalah...",
    options: ["32", "25", "10", "5"],
    correctIndex: 0,
    explanation: "Banyak subset = 2^n = 2^5 = 32",
    alternatives: ["32"],
  },
  {
    id: "q-diskrit-2",
    topicSlug: "f-discrete-mathematics-matematika-diskrit",
    question: "Nilai dari P(6,3) = 6!/(6-3)! adalah...",
    options: ["120", "720", "360", "20"],
    correctIndex: 0,
    explanation: "P(6,3) = 6!/(6-3)! = 720/6 = 120",
    alternatives: ["120"],
  },
  {
    id: "q-diskrit-3",
    topicSlug: "f-discrete-mathematics-matematika-diskrit",
    question: "Pernyataan logika p -> q berfungsi salah hanya jika...",
    options: ["p benar dan q salah", "p salah dan q benar", "p benar dan q benar", "p salah dan q salah"],
    correctIndex: 0,
    explanation: "Implikasi p -> q hanya salah jika p benar dan q salah.",
    alternatives: ["p benar dan q salah"],
  },
  {
    id: "q-diskrit-4",
    topicSlug: "f-discrete-mathematics-matematika-diskrit",
    question: "Lintasan yang melewati setiap tepi graf tepat satu kali disebut...",
    options: ["Lintasan Euler", "Lintasan Hamilton", "Pohon", "Graf bipartit"],
    correctIndex: 0,
    explanation: "Lintasan Euler melewati setiap tepi tepat satu kali.",
    alternatives: ["lintasan Euler"],
  },

  // g-probability-statistics-probabilitas-statistika-lanjut (Kuliah)
  {
    id: "q-prob-1",
    topicSlug: "g-probability-statistics-probabilitas-statistika-lanjut",
    question: "Jika P(A) = 0,3, P(B) = 0,5, dan A,B saling bebas, maka P(A dan B) = ...",
    options: ["0,15", "0,8", "0,3", "0,5"],
    correctIndex: 0,
    explanation: "A,B saling bebas: P(A dan B) = P(A) x P(B) = 0,3 x 0,5 = 0,15",
    alternatives: ["0,15","0.15"],
  },
  {
    id: "q-prob-2",
    topicSlug: "g-probability-statistics-probabilitas-statistika-lanjut",
    question: "Distribusi binomial B(n,p) dengan n=10 dan p=0,3 memiliki nilai harapan E(X) = ...",
    options: ["3", "7", "0,3", "10"],
    correctIndex: 0,
    explanation: "E(X) = n x p = 10 x 0,3 = 3",
    alternatives: ["3"],
  },
  {
    id: "q-prob-3",
    topicSlug: "g-probability-statistics-probabilitas-statistika-lanjut",
    question: "Distribusi normal dengan mean=50 dan deviasi standar=10. P(X > 60) = ...",
    options: ["0,1587", "0,8413", "0,5", "0,3413"],
    correctIndex: 0,
    explanation: "Z = (60-50)/10 = 1. P(Z > 1) = 1 - 0,8413 = 0,1587",
    alternatives: ["0,1587","0.1587"],
  },
  {
    id: "q-prob-4",
    topicSlug: "g-probability-statistics-probabilitas-statistika-lanjut",
    question: "Varians dari distribusi Poisson dengan parameter lambda=4 adalah...",
    options: ["4", "2", "16", "8"],
    correctIndex: 0,
    explanation: "Pada distribusi Poisson: Var(X) = lambda = 4",
    alternatives: ["4"],
  },

  // h-topik-lanjutan (Kuliah)
  {
    id: "q-lanjutan-1",
    topicSlug: "h-topik-lanjutan",
    question: "Ruang vektor R3 memiliki dimensi...",
    options: ["3", "2", "4", "Tak hingga"],
    correctIndex: 0,
    explanation: "R3 memiliki basis {(1,0,0),(0,1,0),(0,0,1)} sehingga dimensinya 3.",
    alternatives: ["3"],
  },
  {
    id: "q-lanjutan-2",
    topicSlug: "h-topik-lanjutan",
    question: "Determinan matriks 2x2 [[a,b],[c,d]] adalah...",
    options: ["ad - bc", "ac - bd", "ab - cd", "ad + bc"],
    correctIndex: 0,
    explanation: "det([[a,b],[c,d]]) = ad - bc",
    alternatives: ["ad - bc","ad-bc"],
  },
  {
    id: "q-lanjutan-3",
    topicSlug: "h-topik-lanjutan",
    question: "Persamaan diferensial dy/dx = y memiliki solusi umum...",
    options: ["y = Ce^x", "y = Cx", "y = C + x", "y = C/x"],
    correctIndex: 0,
    explanation: "dy/y = dx, ln|y| = x + C, y = Ce^x",
    alternatives: ["y = Ce^x"],
  },
  {
    id: "q-lanjutan-4",
    topicSlug: "h-topik-lanjutan",
    question: "Teorema Bayes menyatakan P(A|B) = ...",
    options: ["P(B|A)*P(A) / P(B)", "P(A)*P(B)", "P(A dan B) + P(B)", "P(A) / P(B)"],
    correctIndex: 0,
    explanation: "P(A|B) = P(B|A)*P(A) / P(B) menurut teorema Bayes.",
    alternatives: ["P(B|A)*P(A) / P(B)"],
  },
];
