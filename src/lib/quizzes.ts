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
    question: "FPB dari 12 dan 18 adalah...",
    options: ["6", "3", "36", "12"],
    correctIndex: 0,
    explanation: "Faktor 12: 1,2,3,4,6,12. Faktor 18: 1,2,3,6,9,18. FPB = 6",
  },
  {
    id: "q-bilangan-3",
    topicSlug: "1-bilangan-bulat-pecahan-desimal-persen",
    question: "Jika 40% dari sebuah bilangan adalah 20, maka bilangan tersebut adalah...",
    options: ["50", "80", "60", "45"],
    correctIndex: 0,
    explanation: "40% × x = 20, maka x = 20 ÷ 0.4 = 50",
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
    question: "Himpunan bagian dari himpunan {a,b,c} berapa banyak?",
    options: ["8", "6", "9", "7"],
    correctIndex: 0,
    explanation: "Banyak himpunan bagian = 2^n = 2³ = 8",
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

  // PLSV
  {
    id: "q-linear-1",
    topicSlug: "4-persamaan-linear-satu-variabel-plsv",
    question: "Penyelesaian 2x + 5 = 13 adalah...",
    options: ["x = 4", "x = 5", "x = 3", "x = 6"],
    correctIndex: 0,
    explanation: "2x = 13 - 5 = 8, x = 8/2 = 4",
  },
  {
    id: "q-linear-2",
    topicSlug: "4-persamaan-linear-satu-variabel-plsv",
    question: "Jika 3x - 7 = 8, maka x = ...",
    options: ["5", "4", "6", "3"],
    correctIndex: 0,
    explanation: "3x = 8 + 7 = 15, x = 15/3 = 5",
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
    question: "Suku ke-10 dari barisan 2, 5, 8, 11, ... adalah...",
    options: ["29", "32", "26", "35"],
    correctIndex: 0,
    explanation: "Beda b=3. U₁₀ = 2 + (10-1)(3) = 2 + 27 = 29",
  },

  // Garis Lurus
  {
    id: "q-garis-1",
    topicSlug: "10-persamaan-garis-lurus",
    question: "Gradien garis melalui (2,3) dan (4,7) adalah...",
    options: ["2", "3", "1", "4"],
    correctIndex: 0,
    explanation: "m = (7-3)/(4-2) = 4/2 = 2",
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
  },

  // Segitiga
  {
    id: "q-segitiga-1",
    topicSlug: "13-segitiga-dan-segiempat",
    question: "Luas trapesium dengan alas 10 cm, alas atas 6 cm, tinggi 5 cm adalah...",
    options: ["40 cm²", "50 cm²", "30 cm²", "45 cm²"],
    correctIndex: 0,
    explanation: "L = ½(a+b)×t = ½(10+6)×5 = ½×16×5 = 40 cm²",
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
    question: "Nilai dari (3²)³ adalah...",
    options: ["729", "216", "54", "18"],
    correctIndex: 0,
    explanation: "(a^m)^n = a^(mn) = 3^(2×3) = 3⁶ = 729",
  },

  // Logaritma
  {
    id: "q-logaritma-1",
    topicSlug: "2-logaritma",
    question: "Nilai log₂ 32 adalah...",
    options: ["5", "4", "6", "3"],
    correctIndex: 0,
    explanation: "2⁵ = 32, maka log₂ 32 = 5",
  },
  {
    id: "q-logaritma-2",
    topicSlug: "2-logaritma",
    question: "Nilai log 100 adalah...",
    options: ["2", "3", "1", "10"],
    correctIndex: 0,
    explanation: "log 100 = log 10² = 2 (log basis 10)",
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
  },

  // Matriks
  {
    id: "q-matriks-1",
    topicSlug: "6-matriks",
    question: "Determinan matriks [[2,1],[5,3]] adalah...",
    options: ["1", "11", "-1", "6"],
    correctIndex: 0,
    explanation: "det = ad-bc = (2)(3)-(1)(5) = 6-5 = 1",
  },

  // Vektor
  {
    id: "q-vektor-1",
    topicSlug: "7-vektor",
    question: "Besar vektor (3, 4) adalah...",
    options: ["5", "7", "12", "25"],
    correctIndex: 0,
    explanation: "|v| = √(3²+4²) = √(9+16) = √25 = 5",
  },

  // Trigonometri
  {
    id: "q-trigo-1",
    topicSlug: "8-trigonometri-dasar",
    question: "Nilai sin 30° adalah...",
    options: ["1/2", "√3/2", "√2/2", "1"],
    correctIndex: 0,
    explanation: "sin 30° = 1/2 (nilai khusus trigonometri)",
  },
  {
    id: "q-trigo-2",
    topicSlug: "8-trigonometri-dasar",
    question: "Jika sin θ = 3/5, maka cos θ = ...",
    options: ["4/5", "3/5", "5/3", "5/4"],
    correctIndex: 0,
    explanation: "sin²θ + cos²θ = 1 → cos²θ = 1 - 9/25 = 16/25 → cos θ = 4/5",
  },

  // Limit
  {
    id: "q-limit-1",
    topicSlug: "13-limit-fungsi",
    question: "lim(x→2) (x²-4)/(x-2) = ...",
    options: ["4", "0", "2", "∞"],
    correctIndex: 0,
    explanation: "Faktorkan: (x²-4)/(x-2) = (x+2)(x-2)/(x-2) = x+2. lim(x→2) = 4",
  },

  // Turunan
  {
    id: "q-turunan-1",
    topicSlug: "14-turunan-diferensial",
    question: "Turunan dari f(x) = x³ + 2x adalah...",
    options: ["3x² + 2", "3x² + x", "x² + 2", "3x + 2"],
    correctIndex: 0,
    explanation: "f'(x) = 3x² + 2",
  },
  {
    id: "q-turunan-2",
    topicSlug: "14-turunan-diferensial",
    question: "Turunan dari f(x) = sin x adalah...",
    options: ["cos x", "-cos x", "sin x", "-sin x"],
    correctIndex: 0,
    explanation: "(sin x)' = cos x",
  },

  // Integral
  {
    id: "q-integral-1",
    topicSlug: "16-integral",
    question: "∫ 2x dx = ...",
    options: ["x² + C", "2x² + C", "x + C", "2x + C"],
    correctIndex: 0,
    explanation: "∫ 2x dx = 2 × (x²/2) + C = x² + C",
  },
  {
    id: "q-integral-2",
    topicSlug: "16-integral",
    question: "∫₀¹ 3x² dx = ...",
    options: ["1", "3", "0", "2"],
    correctIndex: 0,
    explanation: "∫ 3x² dx = x³. Evaluasi: 1³ - 0³ = 1",
  },

  // Barisan Aritmetika
  {
    id: "q-barisan-1",
    topicSlug: "11-barisan-dan-deret-aritmetika",
    question: "Suku ke-5 dari barisan 3, 7, 11, 15, ... adalah...",
    options: ["19", "23", "17", "21"],
    correctIndex: 0,
    explanation: "a=3, b=4. U₅ = 3 + (5-1)(4) = 3 + 16 = 19",
  },

  // Barisan Geometri
  {
    id: "q-barisan-2",
    topicSlug: "12-barisan-dan-deret-geometri",
    question: "Jumlah 5 suku pertama barisan 2, 6, 18, 54, ... adalah...",
    options: ["242", "121", "486", "162"],
    correctIndex: 0,
    explanation: "a=2, r=3. S₅ = 2(3⁵-1)/(3-1) = 2(243-1)/2 = 242",
  },

  // Statistika
  {
    id: "q-stat-1",
    topicSlug: "18-statistika-lanjut",
    question: "Mean dari data 4, 6, 8, 10, 12 adalah...",
    options: ["8", "7", "9", "10"],
    correctIndex: 0,
    explanation: "Mean = (4+6+8+10+12)/5 = 40/5 = 8",
  },

  // Peluang
  {
    id: "q-peluang-1",
    topicSlug: "20-peluang",
    question: "Peluang muncul angka genap dari satu dadu adalah...",
    options: ["1/2", "1/3", "1/6", "2/3"],
    correctIndex: 0,
    explanation: "Angka genap: {2,4,6} = 3 buah. P = 3/6 = 1/2",
  },

  // Aplikasi Turunan
  {
    id: "q-aplikasi-turunan-1",
    topicSlug: "15-aplikasi-turunan",
    question: "Fungsi f(x) = x² - 4x + 3 punya minimum di x = ...",
    options: ["2", "4", "-2", "3"],
    correctIndex: 0,
    explanation: "f'(x) = 2x-4 = 0 → x = 2. f''(2) = 2 > 0 (minimum)",
  },

  // Aplikasi Integral
  {
    id: "q-aplikasi-integral-1",
    topicSlug: "17-aplikasi-integral",
    question: "Luas area di bawah y = x² dari x=0 ke x=2 adalah...",
    options: ["8/3", "4", "2", "16/3"],
    correctIndex: 0,
    explanation: "∫₀² x² dx = [x³/3]₀² = 8/3 - 0 = 8/3",
  },

  // Kaidah Pencacahan
  {
    id: "q-kaidah-1",
    topicSlug: "19-kaidah-pencacahan-permutasi-kombinasi",
    question: "C(10,3) = ...",
    options: ["120", "720", "210", "30"],
    correctIndex: 0,
    explanation: "C(10,3) = 10!/(3!×7!) = (10×9×8)/(3×2×1) = 120",
  },

  // Identitas Trigonometri
  {
    id: "q-identitas-1",
    topicSlug: "9-identitas-dan-persamaan-trigonometri",
    question: "Nilai sin 75° = sin(45°+30°) adalah...",
    options: ["(√6+√2)/4", "(√6-√2)/4", "(√3+1)/4", "√2/2"],
    correctIndex: 0,
    explanation: "sin(45°+30°) = sin45°cos30° + cos45°sin30° = (√2/2)(√3/2) + (√2/2)(1/2) = (√6+√2)/4",
  },

  // Aturan Sinus Cosinus
  {
    id: "q-sinus-1",
    topicSlug: "10-aturan-sinus-cosinus-dan-luas-segitiga",
    question: "Dalam segitiga ABC, jika a=5, b=7, C=60°, maka c² = ...",
    options: ["39", "74", "25", "49"],
    correctIndex: 0,
    explanation: "c² = a²+b²-2ab·cosC = 25+49-2(5)(7)cos60° = 74-35 = 39",
  },

  // ==================== KULIAH ====================
  // Calculus
  {
    id: "q-calculus-1",
    topicSlug: "a-calculus-kalkulus-iiii",
    question: "Nilai lim(x→0) sin(x)/x adalah...",
    options: ["1", "0", "∞", "Tidak ada"],
    correctIndex: 0,
    explanation: "Ini adalah limit fundamental: lim(x→0) sin(x)/x = 1",
  },
  {
    id: "q-calculus-2",
    topicSlug: "a-calculus-kalkulus-iiii",
    question: "Turunan dari e^x adalah...",
    options: ["e^x", "xe^(x-1)", "e^(x-1)", "ln(x)·e^x"],
    correctIndex: 0,
    explanation: "(e^x)' = e^x (turunannya sendiri)",
  },

  // Linear Algebra
  {
    id: "q-linalg-1",
    topicSlug: "b-linear-algebra-aljabar-linear",
    question: "Jika Av = λv, maka λ disebut...",
    options: ["nilai eigen", "vektor eigen", "determinan", "rank"],
    correctIndex: 0,
    explanation: "λ adalah nilai eigen (eigenvalue) dari matriks A",
  },

  // Persamaan Diferensial
  {
    id: "q-diffeq-1",
    topicSlug: "c-differential-equations-persamaan-diferensial",
    question: "Solusi umum dy/dx = ky adalah...",
    options: ["y = Ce^(kx)", "y = Ckx", "y = C/x", "y = C + kx"],
    correctIndex: 0,
    explanation: "dy/y = k dx → ln|y| = kx + C → y = Ce^(kx)",
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
  },
  {
    id: "q-spldv-2",
    topicSlug: "11-sistem-persamaan-linear-dua-variabel-spldv",
    question: "Jika 2x+y=7 dan x-y=2, maka x=...",
    options: ["3", "2", "4", "5"],
    correctIndex: 0,
    explanation: "Eliminasi: 3x=9 → x=3",
  },

  // SMP - Statistika
  {
    id: "q-stat-2",
    topicSlug: "18-statistika-dasar",
    question: "Median dari data 3,5,7,8,10 adalah...",
    options: ["7", "8", "6", "5"],
    correctIndex: 0,
    explanation: "Data sudah terurut, nilai tengah = 7",
  },
  {
    id: "q-stat-3",
    topicSlug: "18-statistika-dasar",
    question: "Modus dari data 2,3,3,4,5,3 adalah...",
    options: ["3", "4", "2", "5"],
    correctIndex: 0,
    explanation: "3 muncul paling sering (3 kali)",
  },

  // SMP - Peluang
  {
    id: "q-peluang-2",
    topicSlug: "19-peluang-dasar",
    question: "Peluang muncul angka ganjil dari satu dadu adalah...",
    options: ["1/2", "1/3", "1/6", "2/3"],
    correctIndex: 0,
    explanation: "Angka ganjil: {1,3,5} = 3 buah. P = 3/6 = 1/2",
  },

  // SMP - Transformasi
  {
    id: "q-transform-1",
    topicSlug: "20-transformasi-geometri",
    question: "Titik (3,4) ditranslasi oleh (2,-1) menjadi...",
    options: ["(5,3)", "(6,4)", "(1,5)", "(5,5)"],
    correctIndex: 0,
    explanation: "(3+2, 4-1) = (5,3)",
  },

  // SMA - Pertidaksamaan
  {
    id: "q-pt-1",
    topicSlug: "4-pertidaksamaan-kuadrat-rasional-mutlak",
    question: "Penyelesaian |x-3| < 5 adalah...",
    options: ["-2 < x < 8", "x < 8", "x > -2", "-8 < x < 2"],
    correctIndex: 0,
    explanation: "-5 < x-3 < 5 → -2 < x < 8",
  },

  // SMA - SPLTV
  {
    id: "q-spltv-1",
    topicSlug: "5-spltv-dan-program-linear",
    question: "Fungsi objektif Z = 3x + 2y dimaksimumkan pada...",
    options: ["Titik pojok DPR", "Titik tengah", "Semua titik", "Tidak ada"],
    correctIndex: 0,
    explanation: "Optimum selalu pada titik pojok daerah penyelesaian",
  },

  // SMA - Identitas Trigonometri
  {
    id: "q-identitas-2",
    topicSlug: "9-identitas-dan-persamaan-trigonometri",
    question: "Nilai sin²30° + cos²30° = ...",
    options: ["1", "0", "2", "1/2"],
    correctIndex: 0,
    explanation: "Identitas fundamental: sin²θ + cos²θ = 1",
  },

  // SMA - Aturan Sinus Cosinus
  {
    id: "q-sinus-2",
    topicSlug: "10-aturan-sinus-cosinus-dan-luas-segitiga",
    question: "Dalam segitiga, jika A=30°, a=10, B=45°, maka b/ sin B = ...",
    options: ["10/sin30°", "10/sin45°", "10/tan30°", "10/cos45°"],
    correctIndex: 0,
    explanation: "Aturan sinus: a/sinA = b/sinB = c/sinC",
  },

  // SMA - Limit
  {
    id: "q-limit-2",
    topicSlug: "13-limit-fungsi",
    question: "lim(x→0) (1-cos x)/x² = ...",
    options: ["1/2", "0", "1", "∞"],
    correctIndex: 0,
    explanation: "Gunakan identitas: (1-cosx)/x² = 2sin²(x/2)/x² → 1/2",
  },

  // SMA - Aplikasi Turunan
  {
    id: "q-aplikasi-turunan-2",
    topicSlug: "15-aplikasi-turunan",
    question: "Gradien garis singgung kurva y=x² di x=3 adalah...",
    options: ["6", "9", "3", "12"],
    correctIndex: 0,
    explanation: "f'(x)=2x, f'(2)=6",
  },

  // SMA - Aplikasi Integral
  {
    id: "q-aplikasi-integral-2",
    topicSlug: "17-aplikasi-integral",
    question: "Volume bola jari-jari 3 (putar sumbu-x) adalah...",
    options: ["36π", "108π", "27π", "48π"],
    correctIndex: 0,
    explanation: "V = (4/3)πr³ = (4/3)π(27) = 36π",
  },

  // SMA - Barisan Aritmetika
  {
    id: "q-barisan-3",
    topicSlug: "11-barisan-dan-deret-aritmetika",
    question: "Jumlah 10 suku pertama barisan 2,5,8,11,... adalah...",
    options: ["155", "145", "165", "135"],
    correctIndex: 0,
    explanation: "S₁₀ = 10/2(2·2 + 9·3) = 5(4+27) = 5·31 = 155",
  },

  // SMA - Barisan Geometri
  {
    id: "q-barisan-4",
    topicSlug: "12-barisan-dan-deret-geometri",
    question: "Suku ke-4 dari barisan 3,6,12,24,... adalah...",
    options: ["24", "48", "18", "36"],
    correctIndex: 0,
    explanation: "a=3, r=2. U₄ = 3·2³ = 24",
  },

  // SMA - Kaidah Pencacahan
  {
    id: "q-kaidah-2",
    topicSlug: "19-kaidah-pencacahan-permutasi-kombinasi",
    question: "5 orang duduk di bangku panjang. Banyak cara = ...",
    options: ["120", "25", "60", "720"],
    correctIndex: 0,
    explanation: "P(5,5) = 5! = 120",
  },

  // SMA - Statistika Lanjut
  {
    id: "q-stat-4",
    topicSlug: "18-statistika-lanjut",
    question: "Jika data mean=50, s=10, maka skor z untuk x=70 adalah...",
    options: ["2", "-2", "1", "3"],
    correctIndex: 0,
    explanation: "z = (x-mean)/s = (70-50)/10 = 2",
  },

  // Kuliah - Linear Algebra
  {
    id: "q-linalg-2",
    topicSlug: "b-linear-algebra-aljabar-linear",
    question: "Determinan matriks identitas I₃ adalah...",
    options: ["1", "0", "3", "6"],
    correctIndex: 0,
    explanation: "det(I) = 1 untuk matriks identitas berapa pun",
  },

  // Kuliah - Calculus
  {
    id: "q-calculus-3",
    topicSlug: "a-calculus-kalkulus-iiii",
    question: "∫₀^π sin x dx = ...",
    options: ["2", "0", "1", "π"],
    correctIndex: 0,
    explanation: "[-cos x]₀^π = -(-1)-(-1) = 1+1 = 2",
  },
  {
    id: "q-calculus-4",
    topicSlug: "a-calculus-kalkulus-iiii",
    question: "Turunan f(x) = ln(x²+1) adalah...",
    options: ["2x/(x²+1)", "1/(x²+1)", "2x", "ln(2x)"],
    correctIndex: 0,
    explanation: "Aturan rantai: f'(x) = 1/(x²+1) · 2x = 2x/(x²+1)",
  },
];
