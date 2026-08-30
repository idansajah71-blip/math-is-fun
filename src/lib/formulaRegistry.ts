import type { FormulaMeta } from "./types";

const R = new Map<string, FormulaMeta>();

function reg(meta: FormulaMeta) {
  R.set(meta.formula, meta);
}

/* ══════════════════════════════════════════════════════════════
   SMP — Bilangan, Pecahan, Eksponen
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "\\frac{a}{b} \\times 100\\%",
  description: "Untuk mengubah pecahan menjadi persen, kalikan nilainya dengan 100%. Misalnya 3/4 berarti 3 dibagi 4 lalu dikali 100%, hasilnya 75%. Cara ini berguna untuk membandingkan dua pecahan yang penyebutnya berbeda.",
  variables: [
    { name: "a", label: "Pembilang", defaultValue: 3, min: 1, max: 100, step: 1 },
    { name: "b", label: "Penyebut", defaultValue: 4, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Persen",
  visual: "pie-chart",
  compute: (v) => (v.a / v.b) * 100,
  formatResult: (r) => r % 1 === 0 ? `${r}%` : `${r.toFixed(2)}%`,
  stepByStep: (v) => [
    { label: "Substitusi nilai", detail: `a = ${v.a}, b = ${v.b}` },
    { label: "Bagi", detail: `${v.a} / ${v.b} = ${(v.a / v.b).toFixed(4)}` },
    { label: "Kalikan 100%", detail: `${(v.a / v.b).toFixed(4)} × 100% = ${((v.a / v.b) * 100).toFixed(2)}%` },
  ],
  examples: [
    { input: { a: 3, b: 4 }, result: 75, formatted: "75%" },
    { input: { a: 1, b: 3 }, result: 33.33, formatted: "33.33%" },
  ],
  practice: [
    { question: "Andi punya pizza 5 iris, dia makan 3 iris. Berapa persen pizza yang sudah dimakan", variables: { a: 3, b: 5 }, answer: 60, answerFormatted: "60%", options: ["60%", "50%", "75%", "30%"], explanation: "3/5 × 100% = 60%. Artinya Andi sudah makan lebih dari setengah pizza — rakus ya!" },
    { question: "Sisa uang jajan Rp7.000 dari Rp8.000. Berapa persen uang yang tersisa", variables: { a: 7, b: 8 }, answer: 87.5, answerFormatted: "87.5%", options: ["87.5%", "75%", "80%", "90%"], explanation: "7/8 × 100% = 87.5%. Cuma habis 12.5% — hemat banget!" },
    { question: "Di kelas 30 siswa, 18 laki-laki. Berapa persen laki-laki di kelas", variables: { a: 18, b: 30 }, answer: 60, answerFormatted: "60%", options: ["60%", "50%", "70%", "40%"], explanation: "18/30 × 100% = 60%. Jadi 60% laki-laki, 40% perempuan — hampir seimbang!" },
  ],
});

reg({
  formula: "\\frac{a}{b} + \\frac{c}{d} = \\frac{ad+bc}{bd}",
  description: "Untuk menjumlahkan dua pecahan yang penyebutnya berbeda, kita harus menyamakan penyebutnya terlebih dahulu. Caranya: tentukan KPK dari kedua penyebut, ubah setiap pecahan agar penyebutnya sama, lalu jumlahkan pembilangnya. Penyebut tetap sama, hanya pembilang yang dijumlahkan.",
  variables: [
    { name: "a", label: "Pembilang 1", defaultValue: 1, min: 1, max: 50, step: 1 },
    { name: "b", label: "Penyebut 1", defaultValue: 4, min: 1, max: 50, step: 1 },
    { name: "c", label: "Pembilang 2", defaultValue: 2, min: 1, max: 50, step: 1 },
    { name: "d", label: "Penyebut 2", defaultValue: 5, min: 1, max: 50, step: 1 },
  ],
  outputLabel: "Hasil",
  visual: "pie-chart",
  compute: (v) => (v.a * v.d + v.c * v.b) / (v.b * v.d),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi nilai", detail: `a=${v.a}, b=${v.b}, c=${v.c}, d=${v.d}` },
    { label: "Kalikan silang", detail: `ad + bc = ${v.a}×${v.d} + ${v.c}×${v.b} = ${v.a * v.d} + ${v.c * v.b} = ${v.a * v.d + v.c * v.b}` },
    { label: "Kalikan penyebut", detail: `bd = ${v.b} × ${v.d} = ${v.b * v.d}` },
    { label: "Hasil", detail: `${v.a * v.d + v.c * v.b} / ${v.b * v.d} = ${((v.a * v.d + v.c * v.b) / (v.b * v.d)).toFixed(4)}` },
  ],
  examples: [
    { input: { a: 1, b: 4, c: 2, d: 5 }, result: 0.45, formatted: "9/20" },
    { input: { a: 3, b: 4, c: 2, d: 5 }, result: 1.15, formatted: "23/20" },
  ],
  practice: [
    { question: "Pak Budi punya pizza 6 iris. Dia makan 1/3 (2 iris) dan adiknya makan 1/6 (1 iris). Berapa sisa pizza", variables: { a: 1, b: 3, c: 1, d: 6 }, answer: 0.5, answerFormatted: "1/2", options: ["1/2", "2/9", "1/6", "1/3"], explanation: "1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2. Sisa pizza tinggal setengah — habis dimakan berdua!" },
    { question: "Resep kue butuh 2/3 gelas tepung dan 3/4 gelas gula. Total bahan kering yang dibutuhkan", variables: { a: 2, b: 3, c: 3, d: 4 }, answer: 1.4167, answerFormatted: "17/12", options: ["17/12", "5/7", "6/12", "5/12"], explanation: "2/3 + 3/4 = 8/12 + 9/12 = 17/12 = 1 5/12 gelas. Resep ini agak boros tepung!" },
    { question: "Rina minum 3/5 liter teh dan 1/4 liter jus. Berapa total minumannya", variables: { a: 3, b: 5, c: 1, d: 4 }, answer: 0.85, answerFormatted: "17/20", options: ["17/20", "4/9", "3/20", "4/5"], explanation: "3/5 + 1/4 = 12/20 + 5/20 = 17/20 liter. Rina minum hampir satu gelas penuh!" },
  ],
});

reg({
  formula: "\\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd}",
  description: "Perkalian dua pecahan sangat mudah: kalikan pembilang dengan pembilang, dan kalikan penyebut dengan penyebut. Tidak perlu menyamakan penyebut seperti pada penjumlahan. Hasilnya bisa disederhanakan jika ada faktor persekutuan.",
  variables: [
    { name: "a", label: "Pembilang 1", defaultValue: 2, min: 1, max: 50, step: 1 },
    { name: "b", label: "Penyebut 1", defaultValue: 3, min: 1, max: 50, step: 1 },
    { name: "c", label: "Pembilang 2", defaultValue: 4, min: 1, max: 50, step: 1 },
    { name: "d", label: "Penyebut 2", defaultValue: 5, min: 1, max: 50, step: 1 },
  ],
  outputLabel: "Hasil",
  visual: "pie-chart",
  compute: (v) => (v.a * v.c) / (v.b * v.d),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b + ", c=" + v.c + ", d=" + v.d },
    { label: "Kalikan pembilang", detail: "ac = " + v.a + " x " + v.c + " = " + (v.a*v.c) },
    { label: "Kalikan penyebut", detail: "bd = " + v.b + " x " + v.d + " = " + (v.b*v.d) },
    { label: "Hasil", detail: (v.a*v.c) + " / " + (v.b*v.d) + " = " + ((v.a*v.c)/(v.b*v.d)).toFixed(4) },
  ],
  examples: [
    { input: { a: 2, b: 3, c: 4, d: 5 }, result: 0.5333, formatted: "8/15" },
  ],
  practice: [
    { question: "Resep kue: pakai 2/3 dari 3/4 kg tepung. Berapa tepung yang dipakai", variables: { a: 2, b: 3, c: 3, d: 4 }, answer: 0.5, answerFormatted: "1/2", options: ["1/2", "5/7", "6/12", "1/4"], explanation: "2/3 × 3/4 = 6/12 = 1/2" },
    { question: "Andi makan 1/2 porsi, lalu makan lagi 2/3 dari sisa. Berapa yang dimakan", variables: { a: 1, b: 2, c: 2, d: 3 }, answer: 0.3333, answerFormatted: "1/3", options: ["1/3", "2/5", "1/2", "1/6"], explanation: "1/2 × 2/3 = 2/6 = 1/3" },
    { question: "Rina menghabiskan 3/4 dari 4/5 pizza. Berapa pizza yang dimakan", variables: { a: 3, b: 4, c: 4, d: 5 }, answer: 0.6, answerFormatted: "3/5", options: ["3/5", "7/9", "12/20", "1/2"], explanation: "3/4 × 4/5 = 12/20 = 3/5" },
  ],
});

reg({
  formula: "a^m \\times a^n = a^{m+n}",
  description: "Jika basis yang sama diperkalian, pangkatnya dijumlahkan. Misalnya 2³ × 2⁴ = 2^(3+4) = 2⁷ = 128. Ini karena 2³ berarti 2×2×2, dan 2⁴ berarti 2×2×2×2, jadi total ada 7 perkalian 2.",
  variables: [
    { name: "a", label: "Basis", defaultValue: 2, min: 1, max: 20, step: 1 },
    { name: "m", label: "Pangkat 1", defaultValue: 3, min: 0, max: 20, step: 1 },
    { name: "n", label: "Pangkat 2", defaultValue: 4, min: 0, max: 20, step: 1 },
  ],
  outputLabel: "Hasil",
  compute: (v) => Math.pow(v.a, v.m + v.n),
  formatResult: (r) => r <= 1e10 ? r.toLocaleString("id") : r.toExponential(2),
  visual: "exponent",
  stepByStep: (v) => [
    { label: "Substitusi nilai", detail: `a = ${v.a}, m = ${v.m}, n = ${v.n}` },
    { label: "Jumlahkan pangkat", detail: `${v.m} + ${v.n} = ${v.m + v.n}` },
    { label: "Hitung", detail: `${v.a}^${v.m + v.n} = ${Math.pow(v.a, v.m + v.n)}` },
  ],
  examples: [
    { input: { a: 2, m: 3, n: 4 }, result: 128, formatted: "2^7 = 128" },
  ],
  practice: [
    { question: "Bakteri menggandakan diri 2^3 kali jam 3 sore, lalu 2^4 kali jam 5 sore. Total perkalian", variables: { a: 2, m: 3, n: 4 }, answer: 128, answerFormatted: "128", options: ["128", "64", "256", "96"], explanation: "2^3 × 2^4 = 2^(3+4) = 2^7 = 128" },
    { question: "Level game: senjata damage 3^2, skill tambah 3^3. Total damage", variables: { a: 3, m: 2, n: 3 }, answer: 243, answerFormatted: "243", options: ["243", "81", "729", "54"], explanation: "3^2 × 3^3 = 3^(2+3) = 3^5 = 243" },
    { question: "Investasi Rp5 jt naik 5^1 kali tahun ini, lalu 5^2 kali tahun depan. Total", variables: { a: 5, m: 1, n: 2 }, answer: 125, answerFormatted: "125", options: ["125", "25", "625", "50"], explanation: "5^1 × 5^2 = 5^(1+2) = 5^3 = 125" },
  ],
});

reg({
  formula: "a^m \\div a^n = a^{m-n}",
  description: "Jika basis yang sama dibagi, pangkatnya dikurangkan. Misalnya 2⁵ ÷ 2³ = 2^(5-3) = 2² = 4. Ini kebalikan dari perkalian eksponen: pembagian berarti mengurangi jumlah perkalian basis.",
  variables: [
    { name: "a", label: "Basis", defaultValue: 2, min: 1, max: 20, step: 1 },
    { name: "m", label: "Pangkat pembilang", defaultValue: 5, min: 0, max: 20, step: 1 },
    { name: "n", label: "Pangkat penyebut", defaultValue: 3, min: 0, max: 20, step: 1 },
  ],
  outputLabel: "Hasil",
  visual: "exponent",
  compute: (v) => Math.pow(v.a, v.m - v.n),
  formatResult: (r) => r <= 1e10 ? r.toLocaleString("id") : r.toExponential(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", m=" + v.m + ", n=" + v.n },
    { label: "Kurangkan pangkat", detail: "m - n = " + v.m + " - " + v.n + " = " + (v.m - v.n) },
    { label: "Hitung", detail: v.a + "^" + (v.m - v.n) + " = " + Math.pow(v.a, v.m - v.n) },
  ],
  examples: [
    { input: { a: 2, m: 5, n: 3 }, result: 4, formatted: "2^2 = 4" },
  ],
  practice: [
    { question: "Andi punya 2^5 permen, dibagi rata untuk 2^3 teman. Berapa permen tiap orang", variables: { a: 2, m: 5, n: 3 }, answer: 4, answerFormatted: "4", options: ["4", "8", "2", "16"], explanation: "2^5 ÷ 2^3 = 2^(5-3) = 2^2 = 4" },
    { question: "Server punya 3^4 user aktif, 3^2 logout. Sisa user aktif", variables: { a: 3, m: 4, n: 2 }, answer: 9, answerFormatted: "9", options: ["9", "27", "3", "81"], explanation: "3^4 ÷ 3^2 = 3^(4-2) = 3^2 = 9" },
    { question: "Tabungan Rp10^6 ditarik Rp10^4. Sisa tabungan", variables: { a: 10, m: 6, n: 4 }, answer: 100, answerFormatted: "100", options: ["100", "1000", "10", "10000"], explanation: "10^6 ÷ 10^4 = 10^(6-4) = 10^2 = 100" },
  ],
});

reg({
  formula: "(a^m)^n = a^{mn}",
  description: "Jika sebuah eksponen dipangkatkan lagi, pangkatnya dikalikan. Misalnya (2³)² = 2^(3×2) = 2⁶ = 64. Ini karena (2³)² berarti 2³ dikali 2³, dan berdasarkan aturan perkalian eksponen, pangkatnya dijumlahkan: 3+3=6.",
  variables: [
    { name: "a", label: "Basis", defaultValue: 2, min: 1, max: 10, step: 1 },
    { name: "m", label: "Pangkat dalam", defaultValue: 3, min: 1, max: 10, step: 1 },
    { name: "n", label: "Pangkat luar", defaultValue: 2, min: 1, max: 10, step: 1 },
  ],
  outputLabel: "Hasil",
  visual: "exponent",
  compute: (v) => Math.pow(v.a, v.m * v.n),
  formatResult: (r) => r <= 1e10 ? r.toLocaleString("id") : r.toExponential(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", m=" + v.m + ", n=" + v.n },
    { label: "Kalikan pangkat", detail: "m x n = " + v.m + " x " + v.n + " = " + (v.m * v.n) },
    { label: "Hitung", detail: v.a + "^" + (v.m * v.n) + " = " + Math.pow(v.a, v.m * v.n) },
  ],
  examples: [
    { input: { a: 2, m: 3, n: 2 }, result: 64, formatted: "2^6 = 64" },
  ],
  practice: [
    { question: "Rumus bakteri: awal 2^3 koloni, tiap jam dipangkatkan 2. Setelah 2 jam", variables: { a: 2, m: 3, n: 2 }, answer: 64, answerFormatted: "64", options: ["64", "36", "48", "128"], explanation: "(2^3)^2 = 2^(3×2) = 2^6 = 64" },
    { question: "Shield: kekuatan dasar 3^2, dipertebal 3^3 kali. Total kekuatan", variables: { a: 3, m: 2, n: 3 }, answer: 729, answerFormatted: "729", options: ["729", "216", "54", "189"], explanation: "(3^2)^3 = 3^(2×3) = 3^6 = 729" },
    { question: "Satelit: sinyal awal 5^1, diperkuat 5^4 kali. Kekuatan sinyal", variables: { a: 5, m: 1, n: 4 }, answer: 625, answerFormatted: "625", options: ["625", "125", "25", "3125"], explanation: "(5^1)^4 = 5^(1×4) = 5^4 = 625" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMP — Aljabar, Persamaan
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "(a+b)^2 = a^2+2ab+b^2",
  description: "Rumus untuk mengkuadratkan jumlah dua suku: (a+b)² = a² + 2ab + b². Hasilnya selalu positif karena kuadrat apapun non-negatif. Rumus ini sering muncul dalam faktorisasi dan penyelesaian persamaan kuadrat.",
  variables: [
    { name: "a", label: "Suku a", defaultValue: 3, min: -50, max: 50, step: 1 },
    { name: "b", label: "Suku b", defaultValue: 4, min: -50, max: 50, step: 1 },
  ],
  outputLabel: "Hasil",
  visual: "square",
  compute: (v) => Math.pow(v.a + v.b, 2),
  formatResult: (r) => r.toLocaleString("id"),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b },
    { label: "Hitung a^2", detail: v.a + "^2 = " + (v.a * v.a) },
    { label: "Hitung 2ab", detail: "2 x " + v.a + " x " + v.b + " = " + (2 * v.a * v.b) },
    { label: "Hitung b^2", detail: v.b + "^2 = " + (v.b * v.b) },
    { label: "Jumlahkan", detail: (v.a*v.a) + " + " + (2*v.a*v.b) + " + " + (v.b*v.b) + " = " + (v.a*v.a + 2*v.a*v.b + v.b*v.b) },
  ],
  examples: [
    { input: { a: 3, b: 4 }, result: 49, formatted: "(3+4)² = 49" },
  ],
  practice: [
    { question: "Luas persegi sisi (5+3) cm. Hitung pakai rumus persegi!", variables: { a: 5, b: 3 }, answer: 64, answerFormatted: "64", options: ["64", "32", "16", "48"], explanation: "(5+3)² = 5² + 2(5)(3) + 3² = 25+30+9 = 64" },
    { question: "Kolam ikan: panjang (2+6) meter. Luas permukaan", variables: { a: 2, b: 6 }, answer: 64, answerFormatted: "64", options: ["64", "36", "16", "80"], explanation: "(2+6)² = 2² + 2(2)(6) + 6² = 4+24+36 = 64" },
    { question: "Taman bermain: sisi (10+5) meter. Luas taman", variables: { a: 10, b: 5 }, answer: 225, answerFormatted: "225", options: ["225", "125", "100", "150"], explanation: "(10+5)² = 10² + 2(10)(5) + 5² = 100+100+25 = 225" },
  ],
});

reg({
  formula: "(a-b)^2 = a^2-2ab+b^2",
  description: "Rumus untuk mengkuadratkan selisih dua suku: (a-b)² = a² - 2ab + b². Catatan: suku tengahnya bernilai negatif karena perkalian a dan -b. Rumus ini berguna untuk menyederhanakan ekspresi dan menyelesaikan pertidaksamaan.",
  variables: [
    { name: "a", label: "Suku a", defaultValue: 5, min: -50, max: 50, step: 1 },
    { name: "b", label: "Suku b", defaultValue: 3, min: -50, max: 50, step: 1 },
  ],
  outputLabel: "Hasil",
  visual: "square",
  compute: (v) => Math.pow(v.a - v.b, 2),
  formatResult: (r) => r.toLocaleString("id"),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b },
    { label: "Hitung a^2", detail: v.a + "^2 = " + (v.a * v.a) },
    { label: "Hitung 2ab", detail: "2 x " + v.a + " x " + v.b + " = " + (2 * v.a * v.b) },
    { label: "Hitung b^2", detail: v.b + "^2 = " + (v.b * v.b) },
    { label: "Jumlahkan", detail: (v.a*v.a) + " - " + (2*v.a*v.b) + " + " + (v.b*v.b) + " = " + (v.a*v.a - 2*v.a*v.b + v.b*v.b) },
  ],
  examples: [
    { input: { a: 5, b: 3 }, result: 4, formatted: "(5-3)² = 4" },
  ],
  practice: [
    { question: "Sisa kue: sisi (7-2) cm. Berapa luas kue yang tersisa", variables: { a: 7, b: 2 }, answer: 25, answerFormatted: "25", options: ["25", "45", "5", "10"], explanation: "(7-2)² = 7² - 2(7)(2) + 2² = 49-28+4 = 25" },
    { question: "Ruangan: panjang (10-4) meter. Luas lantai", variables: { a: 10, b: 4 }, answer: 36, answerFormatted: "36", options: ["36", "84", "6", "24"], explanation: "(10-4)² = 10² - 2(10)(4) + 4² = 100-80+16 = 36" },
    { question: "Taman: sisi (8-5) meter. Luas taman", variables: { a: 8, b: 5 }, answer: 9, answerFormatted: "9", options: ["9", "39", "3", "15"], explanation: "(8-5)² = 8² - 2(8)(5) + 5² = 64-80+25 = 9" },
  ],
});

reg({
  formula: "a^2-b^2=(a+b)(a-b)",
  description: "Perbedaan dua kuadrat bisa difaktorkan menjadi perkalian jumlah dan selisih: a²-b² = (a+b)(a-b). Ini adalah salah satu bentuk faktorisasi yang paling sering digunakan, terutama dalam menyelesaikan persamaan kuadrat.",
  variables: [
    { name: "a", label: "Suku a", defaultValue: 5, min: 1, max: 50, step: 1 },
    { name: "b", label: "Suku b", defaultValue: 3, min: 1, max: 50, step: 1 },
  ],
  outputLabel: "Hasil",
  visual: "square",
  compute: (v) => v.a * v.a - v.b * v.b,
  formatResult: (r) => r.toLocaleString("id"),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b },
    { label: "Hitung (a+b)", detail: v.a + " + " + v.b + " = " + (v.a + v.b) },
    { label: "Hitung (a-b)", detail: v.a + " - " + v.b + " = " + (v.a - v.b) },
    { label: "Kalikan", detail: (v.a+v.b) + " x " + (v.a-v.b) + " = " + ((v.a+v.b)*(v.a-v.b)) },
  ],
  examples: [
    { input: { a: 5, b: 3 }, result: 16, formatted: "5² - 3² = 16" },
  ],
  practice: [
    { question: "Selisih luas dua kotak: sisi 7 cm dan 4 cm. Berapa selisih luasnya", variables: { a: 7, b: 4 }, answer: 33, answerFormatted: "33", options: ["33", "12", "65", "15"], explanation: "7² - 4² = (7+4)(7-4) = 11 × 3 = 33" },
    { question: "Sisa kain: dari persegi 10x10 dipotong 6x6. Sisa kain", variables: { a: 10, b: 6 }, answer: 64, answerFormatted: "64", options: ["64", "36", "100", "24"], explanation: "10² - 6² = (10+6)(10-6) = 16 × 4 = 64" },
    { question: "Perbedaan harga: Rp9 jt dan Rp3 jt. Selisihnya berapa", variables: { a: 9, b: 3 }, answer: 72, answerFormatted: "72", options: ["72", "54", "18", "90"], explanation: "9² - 3² = (9+3)(9-3) = 12 × 6 = 72" },
  ],
});

reg({
  formula: "ax + b = c \\Rightarrow x = \\frac{c-b}{a}",
  description: "Untuk menyelesaikan persamaan linear satu variabel seperti ax + b = c, langkahnya: pindahkan konstanta b ke sisi kanan (jadi c - b), lalu bagi dengan koefisien a. Pastikan untuk melakukan operasi yang sama di kedua sisi persamaan.",
  variables: [
    { name: "a", label: "Koefisien x", defaultValue: 2, min: -50, max: 50, step: 1 },
    { name: "b", label: "Konstanta", defaultValue: 5, min: -100, max: 100, step: 1 },
    { name: "c", label: "Hasil", defaultValue: 13, min: -100, max: 100, step: 1 },
  ],
  outputLabel: "x",
  visual: "number-line",
  compute: (v) => (v.c - v.b) / v.a,
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b + ", c=" + v.c },
    { label: "Kurangkan b dari c", detail: "c - b = " + v.c + " - " + v.b + " = " + (v.c - v.b) },
    { label: "Bagi dengan a", detail: (v.c-v.b) + " / " + v.a + " = " + ((v.c - v.b) / v.a).toFixed(2) },
    { label: "Hasil", detail: "x = " + ((v.c - v.b) / v.a).toFixed(2) },
  ],
  examples: [
    { input: { a: 2, b: 5, c: 13 }, result: 4, formatted: "2x + 5 = 13 → x = 4" },
  ],
  practice: [
    { question: "Andi punya Rp6, mau beli 3 buku. Total Rp15. Harga satu buku", variables: { a: 3, b: 6, c: 15 }, answer: 3, answerFormatted: "3", options: ["3", "5", "2", "4"], explanation: "3x = 15-6 = 9, x = 9/3 = 3" },
    { question: "Ani menabung Rp3/hari. Setelah 5 hari, uangnya Rp17. Tabungan awal", variables: { a: 5, b: -3, c: 17 }, answer: 4, answerFormatted: "4", options: ["4", "3", "5", "2"], explanation: "5x = 17+3 = 20, x = 20/5 = 4" },
    { question: "4x + 8 = 0. Berapa nilai x", variables: { a: 4, b: 8, c: 0 }, answer: -2, answerFormatted: "-2", options: ["-2", "2", "-4", "0"], explanation: "4x = 0-8 = -8, x = -8/4 = -2" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMP — Barisan & Deret
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "U_n = a+(n-1)b",
  description: "Barisan aritmetika memiliki beda tetap antar suku. Untuk mencari suku ke-n, gunakan rumus: Uₙ = a + (n-1)b, di mana a adalah suku pertama dan b adalah beda. Artinya, suku ke-n sama dengan suku pertama ditambah (n-1) kali beda.",
  variables: [
    { name: "a", label: "Suku pertama", defaultValue: 3, min: -100, max: 100, step: 1 },
    { name: "b", label: "Beda", defaultValue: 2, min: -50, max: 50, step: 1 },
    { name: "n", label: "Nomor suku", defaultValue: 10, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Suku ke-n",
  visual: "sequence",
  compute: (v) => v.a + (v.n - 1) * v.b,
  formatResult: (r) => r.toLocaleString("id"),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b + ", n=" + v.n },
    { label: "Hitung (n-1)xb", detail: "(" + v.n + " - 1) x " + v.b + " = " + ((v.n-1) * v.b) },
    { label: "Tambahkan a", detail: v.a + " + " + ((v.n-1)*v.b) + " = " + (v.a + (v.n-1)*v.b) },
    { label: "Hasil", detail: "U" + v.n + " = " + (v.a + (v.n-1)*v.b) },
  ],
  examples: [
    { input: { a: 3, b: 2, n: 10 }, result: 21, formatted: "U₁₀ = 3 + 9×2 = 21" },
  ],
  practice: [
    { question: "Menabung Rp5.000 minggu pertama, naik Rp3.000 tiap minggu. Minggu ke-8 tabungannya", variables: { a: 5, b: 3, n: 8 }, answer: 26, answerFormatted: "26", options: ["26", "24", "29", "21"], explanation: "U₈ = 5 + (8-1)×3 = 5 + 21 = 26" },
    { question: "Harga baju: Rp100.000 bulan pertama, turun Rp2.000/bulan. Bulan ke-6", variables: { a: 10, b: -2, n: 6 }, answer: 0, answerFormatted: "0", options: ["0", "2", "-2", "4"], explanation: "U₆ = 10 + (6-1)×(-2) = 10-10 = 0" },
    { question: "Menanam pohon: 1 pohon minggu pertama, tambah 5/tiap minggu. Minggu ke-5", variables: { a: 1, b: 5, n: 5 }, answer: 21, answerFormatted: "21", options: ["21", "25", "16", "30"], explanation: "U₅ = 1 + (5-1)×5 = 1+20 = 21" },
  ],
});

reg({
  formula: "U_n = a \\cdot r^{n-1}",
  description: "Barisan geometri memiliki rasio tetap antar suku. Untuk mencari suku ke-n, gunakan rumus: Uₙ = a × r^(n-1), di mana a adalah suku pertama dan r adalah rasio. Setiap suku dikalikan r untuk mendapatkan suku berikutnya.",
  variables: [
    { name: "a", label: "Suku pertama", defaultValue: 2, min: -50, max: 50, step: 1 },
    { name: "r", label: "Rasio", defaultValue: 3, min: -10, max: 10, step: 1 },
    { name: "n", label: "Nomor suku", defaultValue: 4, min: 1, max: 20, step: 1 },
  ],
  outputLabel: "Suku ke-n",
  visual: "sequence",
  compute: (v) => v.a * Math.pow(v.r, v.n - 1),
  formatResult: (r) => r <= 1e10 ? r.toLocaleString("id") : r.toExponential(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", r=" + v.r + ", n=" + v.n },
    { label: "Hitung r^(n-1)", detail: v.r + "^" + (v.n-1) + " = " + Math.pow(v.r, v.n-1) },
    { label: "Kalikan a", detail: v.a + " x " + Math.pow(v.r, v.n-1) + " = " + (v.a * Math.pow(v.r, v.n-1)) },
    { label: "Hasil", detail: "U" + v.n + " = " + (v.a * Math.pow(v.r, v.n-1)) },
  ],
  examples: [
    { input: { a: 2, r: 3, n: 4 }, result: 54, formatted: "U₄ = 2 × 3³ = 54" },
  ],
  practice: [
    { question: "Video viral: awal 3 views, naik 2x lipat tiap hari. Hari ke-5", variables: { a: 3, r: 2, n: 5 }, answer: 48, answerFormatted: "48", options: ["48", "24", "96", "36"], explanation: "U₅ = 3 × 2⁴ = 3 × 16 = 48" },
    { question: "Simpanan Rp5 jt, bunga berganda 3x lipat tiap tahun. Tahun ke-3", variables: { a: 5, r: 3, n: 3 }, answer: 45, answerFormatted: "45", options: ["45", "15", "135", "30"], explanation: "U₃ = 5 × 3² = 5 × 9 = 45" },
    { question: "Bakteri awal 1, berkembang 4 kali lipat tiap jam. Jam ke-4 ada berapa", variables: { a: 1, r: 4, n: 4 }, answer: 64, answerFormatted: "64", options: ["64", "16", "256", "48"], explanation: "U₄ = 1 × 4³ = 64" },
  ],
});

reg({
  formula: "\\frac{n(n+1)}{2}",
  description: "Untuk menjumlahkan bilangan asli dari 1 sampai n, gunakan rumus Gauss: n(n+1)/2. Misalnya 1+2+...+10 = 10×11/2 = 55. Rumus ini bekerja karena setiap pasang angka dari ujung berjumlah sama (1+10=11, 2+9=11, dst).",
  variables: [
    { name: "n", label: "Jumlah suku", defaultValue: 10, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Jumlah",
  visual: "sequence",
  compute: (v) => (v.n * (v.n + 1)) / 2,
  formatResult: (r) => r.toLocaleString("id"),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "n = " + v.n },
    { label: "Hitung n+1", detail: v.n + " + 1 = " + (v.n + 1) },
    { label: "Kalikan n x (n+1)", detail: v.n + " x " + (v.n+1) + " = " + (v.n * (v.n+1)) },
    { label: "Bagi 2", detail: (v.n*(v.n+1)) + " / 2 = " + (v.n * (v.n+1) / 2) },
  ],
  examples: [
    { input: { n: 10 }, result: 55, formatted: "1+2+...+10 = 55" },
  ],
  practice: [
    { question: "Andi menghitung total poin dari level 1 sampai 20. Berapa totalnya", variables: { n: 20 }, answer: 210, answerFormatted: "210", options: ["210", "200", "190", "220"], explanation: "20×21/2 = 210" },
    { question: "Total hari dari bulan 1 sampai 5. Berapa total hari", variables: { n: 5 }, answer: 15, answerFormatted: "15", options: ["15", "10", "20", "25"], explanation: "5×6/2 = 15" },
    { question: "Gauss waktu SD: total bilangan 1 sampai 100. Berapa", variables: { n: 100 }, answer: 5050, answerFormatted: "5050", options: ["5050", "5000", "4950", "5100"], explanation: "100×101/2 = 5050" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMP — Geometri 2D
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "c^2=a^2+b^2",
  description: "Pada segitiga siku-siku, kuadrat panjang sisi miring (hipotenusa) sama dengan jumlah kuadrat kedua sisi siku-sikunya: c² = a² + b². Misalnya segitiga 3-4-5: 3²+4² = 9+16 = 25 = 5². Rumus ini berlaku HANYA untuk segitiga siku-siku.",
  variables: [
    { name: "a", label: "Sisi a", defaultValue: 3, min: 1, max: 100, step: 1 },
    { name: "b", label: "Sisi b", defaultValue: 4, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Sisi miring (c)",
  compute: (v) => Math.sqrt(v.a ** 2 + v.b ** 2),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  visual: "right-triangle",
  stepByStep: (v) => [
    { label: "Substitusi nilai", detail: `a = ${v.a}, b = ${v.b}` },
    { label: "Kuadratkan", detail: `a² = ${v.a}² = ${v.a ** 2}, b² = ${v.b}² = ${v.b ** 2}` },
    { label: "Jumlahkan", detail: `${v.a ** 2} + ${v.b ** 2} = ${v.a ** 2 + v.b ** 2}` },
    { label: "Akar kuadrat", detail: `c = √${v.a ** 2 + v.b ** 2} = ${Math.sqrt(v.a ** 2 + v.b ** 2) % 1 === 0 ? Math.sqrt(v.a ** 2 + v.b ** 2) : Math.sqrt(v.a ** 2 + v.b ** 2).toFixed(2)}` },
  ],
  examples: [
    { input: { a: 3, b: 4 }, result: 5, formatted: "c = √(9+16) = 5" },
  ],
  practice: [
    { question: "Tangga panjang 5m, ditempel ke tembok setinggi 12m. Berapa panjang tangga", variables: { a: 5, b: 12 }, answer: 13, answerFormatted: "13", options: ["13", "15", "17", "10"], explanation: "c = √(25+144) = √169 = 13" },
    { question: "Tali sepanjang 15m dihubungkan ke tiang 8m. Berapa jarak ke dasar tiang", variables: { a: 8, b: 15 }, answer: 17, answerFormatted: "17", options: ["17", "20", "13", "23"], explanation: "c = √(64+225) = √289 = 17" },
    { question: "Tiang listrik setinggi 24m, tali penahan 7m dari dasar. Panjang tali?", variables: { a: 7, b: 24 }, answer: 25, answerFormatted: "25", options: ["25", "30", "20", "35"], explanation: "c = √(49+576) = √625 = 25" },
  ],
});

reg({
  formula: "=\\frac{1}{2} \\times alas \\times tinggi",
  description: "Luas segitiga dihitung dengan setengah kali alas dikali tinggi. Tinggi harus tegak lurus terhadap alas, bukan sisi miring. Rumus ini berlaku untuk semua jenis segitiga: siku-siku, lancip, maupun tumpul.",
  variables: [
    { name: "alas", label: "Alas", defaultValue: 10, min: 1, max: 100, step: 1 },
    { name: "tinggi", label: "Tinggi", defaultValue: 8, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Luas",
  compute: (v) => 0.5 * v.alas * v.tinggi,
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  visual: "triangle",
  stepByStep: (v) => [
    { label: "Substitusi nilai", detail: `alas = ${v.alas}, tinggi = ${v.tinggi}` },
    { label: "Kalikan", detail: `${v.alas} × ${v.tinggi} = ${v.alas * v.tinggi}` },
    { label: "Bagi 2", detail: `½ × ${v.alas * v.tinggi} = ${0.5 * v.alas * v.tinggi}` },
  ],
  examples: [
    { input: { alas: 10, tinggi: 8 }, result: 40, formatted: "½ × 10 × 8 = 40" },
  ],
  practice: [
    { question: "Andi mau bikin layang-layang. Alasnya 12 cm, tingginya 9 cm. Berapa luas kertas yang dibutuhkan?", variables: { alas: 12, tinggi: 9 }, answer: 54, answerFormatted: "54 cm²", options: ["54 cm²", "108 cm²", "21 cm²", "48 cm²"], explanation: "L = ½ × 12 × 9 = 54 cm². Andi harus potong kertas segitiga, jadi setengah dari persegi!" },
    { question: "Rina punya taman segitiga di depan rumah. Alas taman 15 meter, tinggi 6 meter. Berapa luas tanah yang harus dia rumputi?", variables: { alas: 15, tinggi: 6 }, answer: 45, answerFormatted: "45", options: ["45", "90", "21", "36"], explanation: "L = ½ × 15 × 6 = 45 m². Lumayan buat playground kucing!" },
    { question: "Pak Budi punya loteng berbentuk segitiga. Alas 8 meter, tinggi 10 meter. Berapa luas lotengnya?", variables: { alas: 8, tinggi: 10 }, answer: 40, answerFormatted: "40", options: ["40", "80", "18", "32"], explanation: "L = ½ × 8 × 10 = 40 m². Lotengnya cukup buat naruh box musim dingin!" },
  ],
});

reg({
  formula: "= p \\times l",
  description: "Luas persegi panjang sangat sederhana: panjang dikali lebar. Karena semua sudutnya siku-siku, tidak ada rumus tambahan. Rumus ini juga berlaku untuk persegi (karena persegi adalah persegi panjang dengan sisi sama panjang).",
  variables: [
    { name: "p", label: "Panjang", defaultValue: 12, min: 1, max: 100, step: 1 },
    { name: "l", label: "Lebar", defaultValue: 5, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Luas",
  compute: (v) => v.p * v.l,
  formatResult: (r) => r.toLocaleString("id"),
  visual: "rectangle",
  stepByStep: (v) => [
    { label: "Substitusi nilai", detail: `p = ${v.p}, l = ${v.l}` },
    { label: "Kalikan", detail: `${v.p} × ${v.l} = ${v.p * v.l}` },
  ],
  examples: [
    { input: { p: 12, l: 5 }, result: 60, formatted: "12 × 5 = 60" },
  ],
  practice: [
    { question: "Kamar tidur Andi: panjang 15m, lebar 8m. Berapa luas kamarnya? Kalau dia mau pasang karpet lantai, berapa yang dibutuhkan?", variables: { p: 15, l: 8 }, answer: 120, answerFormatted: "120", options: ["120", "46", "23", "96"], explanation: "L = 15 × 8 = 120 m². Kamarnya gede, tapi kata Rina masih kurang lemari!" },
    { question: "Rina mau beli karpet untuk ruang tamu. Panjang 10m, lebar 10m. Berapa luas yang harus dicover?", variables: { p: 10, l: 10 }, answer: 100, answerFormatted: "100", options: ["100", "40", "20", "200"], explanation: "L = 10 × 10 = 100 m². Ini ruang tamu atau lapangan futsal?" },
    { question: "Pak Budi punya halaman belakang. Panjang 7m, lebar 6m. Berapa luas halaman buat BBQ-an?", variables: { p: 7, l: 6 }, answer: 42, answerFormatted: "42", options: ["42", "26", "13", "84"], explanation: "L = 7 × 6 = 42 m². Cukup buat panggangan dan 5 teman!" },
  ],
});

reg({
  formula: "=s^2",
  description: "Luas persegi: sisi dikuadratkan. Karena semua sisi sama panjang, kita tinggal mengalikan sisi dengan dirinya sendiri. Misalnya persegi sisi 7 cm memiliki luas 7² = 49 cm².",
  variables: [
    { name: "s", label: "Sisi", defaultValue: 7, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Luas",
  compute: (v) => v.s * v.s,
  formatResult: (r) => r.toLocaleString("id"),
  visual: "square",
  stepByStep: (v) => [
    { label: "Substitusi nilai", detail: `s = ${v.s}` },
    { label: "Kuadratkan", detail: `${v.s}² = ${v.s * v.s}` },
  ],
  examples: [
    { input: { s: 7 }, result: 49, formatted: "7² = 49" },
  ],
  practice: [
    { question: "Andi punya petak tanah berbentuk persegi. Sisinya 9 cm di peta. Berapa luasnya di peta?", variables: { s: 9 }, answer: 81, answerFormatted: "81 cm²", options: ["81 cm²", "36 cm²", "18 cm²", "72 cm²"], explanation: "L = 9² = 81 cm². Petak tanah Andi kecil tapi mahal!" },
    { question: "Rina mau pasang ubin di teras. Terasnya berbentuk persegi sisi 12 meter. Berapa luas yang harus ditutupi ubin?", variables: { s: 12 }, answer: 144, answerFormatted: "144", options: ["144", "24", "48", "288"], explanation: "L = 12² = 144 m². Teras segede ini, pas buat main badminton!" },
    { question: "Pak Budi bikin kolam ikan persegi. Sisi kolam 15 meter. Berapa luas kolamnya?", variables: { s: 15 }, answer: 225, answerFormatted: "225", options: ["225", "30", "60", "450"], explanation: "L = 15² = 225 m². Kolam segede ini bisa buat ternak nila!" },
  ],
});

reg({
  formula: "=\\frac{1}{2}(a+b) \\times t",
  description: "Luas trapesium: setengah kali jumlah kedua sisi sejajar dikali tinggi. Rumus ini bekerja karena trapesium bisa dianggap sebagai rata-rata dari dua sisi sejajar, lalu dikali tinggi. Tinggi harus tegak lurus terhadap kedua sisi sejajar.",
  variables: [
    { name: "a", label: "Sisi sejajar 1", defaultValue: 8, min: 1, max: 100, step: 1 },
    { name: "b", label: "Sisi sejajar 2", defaultValue: 12, min: 1, max: 100, step: 1 },
    { name: "t", label: "Tinggi", defaultValue: 6, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Luas",
  compute: (v) => 0.5 * (v.a + v.b) * v.t,
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  visual: "trapezoid",
  stepByStep: (v) => [
    { label: "Substitusi nilai", detail: `a = ${v.a}, b = ${v.b}, t = ${v.t}` },
    { label: "Jumlahkan sisi sejajar", detail: `${v.a} + ${v.b} = ${v.a + v.b}` },
    { label: "Kalikan tinggi", detail: `${v.a + v.b} × ${v.t} = ${(v.a + v.b) * v.t}` },
    { label: "Bagi 2", detail: `½ × ${(v.a + v.b) * v.t} = ${0.5 * (v.a + v.b) * v.t}` },
  ],
  examples: [
    { input: { a: 8, b: 12, t: 6 }, result: 60, formatted: "½(8+12)×6 = 60" },
  ],
  practice: [
    { question: "Andi punya kolam trapesium. Sisi atas 10m, bawah 14m, tinggi 5m. Berapa luas kolamnya?", variables: { a: 10, b: 14, t: 5 }, answer: 60, answerFormatted: "60", options: ["60", "120", "24", "48"], explanation: "L = ½(10+14)×5 = 60 m². Kolam unik, bentuknya kayak topi!" },
    { question: "Rina mau bikin panggung pentas seni. Panggung trapesium: sisi atas 6m, bawah 10m, tinggi 8m. Luas panggung?", variables: { a: 6, b: 10, t: 8 }, answer: 64, answerFormatted: "64", options: ["64", "128", "16", "48"], explanation: "L = ½(6+10)×8 = 64 m². Panggung Rina cukup buat 4 penari!" },
    { question: "Pak Budi punya halaman trapesium. Sisi atas 5m, bawah 7m, tinggi 4m. Berapa luas halaman buat parkir?", variables: { a: 5, b: 7, t: 4 }, answer: 24, answerFormatted: "24", options: ["24", "48", "12", "36"], explanation: "L = ½(5+7)×4 = 24 m². Cukup buat parkir 2 motor!" },
  ],
});

reg({
  formula: "=\\frac{1}{2} \\times d_1 \\times d_2",
  description: "Luas belah ketupat: setengah kali hasil kali kedua diagonal. Diagonal belah ketupat selalu tegak lurus satu sama lain, sehingga luasnya mirip dengan setengah luas persegi panjang yang dibentuk oleh kedua diagonal.",
  variables: [
    { name: "d_1", label: "Diagonal 1", defaultValue: 10, min: 1, max: 100, step: 1 },
    { name: "d_2", label: "Diagonal 2", defaultValue: 8, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Luas",
  compute: (v) => 0.5 * v.d_1 * v.d_2,
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  visual: "rhombus",
  stepByStep: (v) => [
    { label: "Substitusi nilai", detail: `d₁ = ${v.d_1}, d₂ = ${v.d_2}` },
    { label: "Kalikan diagonal", detail: `${v.d_1} × ${v.d_2} = ${v.d_1 * v.d_2}` },
    { label: "Bagi 2", detail: `½ × ${v.d_1 * v.d_2} = ${0.5 * v.d_1 * v.d_2}` },
  ],
  examples: [
    { input: { d_1: 10, d_2: 8 }, result: 40, formatted: "½ × 10 × 8 = 40" },
  ],
  practice: [
    { question: "Andi punya petak tanah belah ketupat. Diagonalnya 12m dan 9m. Berapa luas tanahnya?", variables: { d_1: 12, d_2: 9 }, answer: 54, answerFormatted: "54", options: ["54", "108", "21", "48"], explanation: "L = ½ × 12 × 9 = 54 m². Tanah belah ketupat, langka banget!" },
    { question: "Rina bikin layang-layang belah ketupat. Diagonal kain 16cm dan 10cm. Berapa luas kain yang dipakai?", variables: { d_1: 16, d_2: 10 }, answer: 80, answerFormatted: "80", options: ["80", "160", "26", "60"], explanation: "L = ½ × 16 × 10 = 80 cm². Layang-layang Rina gede, terbang tinggi dong!" },
    { question: "Pak Budi punya halaman belah ketupat buat parkir. Diagonalnya 14m dan 6m. Berapa luas parkirannya?", variables: { d_1: 14, d_2: 6 }, answer: 42, answerFormatted: "42", options: ["42", "84", "20", "36"], explanation: "L = ½ × 14 × 6 = 42 m². Parkiran unik, cuma muat mobil mungil!" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMP — Lingkaran
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "=2\\pi r = \\pi d",
  description: "Keliling lingkaran: 2πr atau πd, di mana r adalah jari-jari dan d adalah diameter. π (pi) adalah bilangan tak hingga sekitar 3,14159. Rumus ini berarti setiap lingkaran memiliki rasio keliling terhadap diameter yang tetap.",
  variables: [
    { name: "r", label: "Jari-jari", defaultValue: 7, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Keliling",
  compute: (v) => 2 * Math.PI * v.r,
  formatResult: (r) => r.toFixed(2),
  visual: "circle",
  stepByStep: (v) => [
    { label: "Substitusi nilai", detail: `r = ${v.r}` },
    { label: "Kalikan dengan π", detail: `2 × π × ${v.r} = ${(2 * Math.PI * v.r).toFixed(2)}` },
  ],
  examples: [
    { input: { r: 7 }, result: 43.98, formatted: "2 × π × 7 ≈ 43.98" },
  ],
  practice: [
    { question: "Roda sepeda: jari-jari 14 cm. Berapa keliling roda?", variables: { r: 14 }, answer: 87.96, answerFormatted: "87.96 cm", options: ["87.96 cm", "44 cm", "62 cm", "154 cm"], explanation: "K = 2 × π × 14 ≈ 87.96 cm" },
    { question: "Jam dinding: jari-jari 10 cm. Berapa keliling jam?", variables: { r: 10 }, answer: 62.83, answerFormatted: "62.83", options: ["62.83", "31.42", "100", "314.16"], explanation: "K = 2 × π × 10 ≈ 62.83" },
    { question: "Piring: jari-jari 5 cm. Berapa keliling piring?", variables: { r: 5 }, answer: 31.42, answerFormatted: "31.42", options: ["31.42", "78.54", "15.71", "62.83"], explanation: "K = 2 × π × 5 ≈ 31.42" },
  ],
});

reg({
  formula: "=\\pi r^2",
  description: "Luas lingkaran: πr². Jari-jari dikuadratkan lalu dikalikan π. Semakin besar jari-jari, luas meningkat secara kuadrat (bukan linear). Misalnya jari-jari 2× lipat membuat luas 4× lipat.",
  variables: [
    { name: "r", label: "Jari-jari", defaultValue: 7, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Luas",
  compute: (v) => Math.PI * v.r * v.r,
  formatResult: (r) => r.toFixed(2),
  visual: "circle",
  stepByStep: (v) => [
    { label: "Substitusi nilai", detail: `r = ${v.r}` },
    { label: "Kuadratkan", detail: `${v.r}² = ${v.r * v.r}` },
    { label: "Kalikan π", detail: `π × ${v.r * v.r} = ${(Math.PI * v.r * v.r).toFixed(2)}` },
  ],
  examples: [
    { input: { r: 7 }, result: 153.94, formatted: "π × 7² ≈ 153.94" },
  ],
  practice: [
    { question: "Pizza: jari-jari 10 cm. Berapa luas pizza?", variables: { r: 10 }, answer: 314.16, answerFormatted: "314.16 cm²", options: ["314.16 cm²", "62.83 cm²", "31.42 cm²", "153.94 cm²"], explanation: "L = π × 10² ≈ 314.16 cm²" },
    { question: "Taman bunga: jari-jari 14 meter. Luas taman?", variables: { r: 14 }, answer: 615.75, answerFormatted: "615.75", options: ["615.75", "87.96", "43.98", "153.94"], explanation: "L = π × 14² ≈ 615.75" },
    { question: "Roda mobil: jari-jari 5 cm. Berapa luas roda?", variables: { r: 5 }, answer: 78.54, answerFormatted: "78.54", options: ["78.54", "31.42", "15.71", "62.83"], explanation: "L = π × 5² ≈ 78.54" },
  ],
});

reg({
  formula: "=\\frac{\\theta}{360°}\\times 2\\pi r",
  description: "Panjang busur: fraksi sudut pusat dikali keliling lingkaran. Jika sudut pusatnya θ derajat, maka panjang busurnya (θ/360°) × 2πr. Artinya, busur adalah sebagian dari keliling lingkaran sesuai besar sudut pusatnya.",
  variables: [
    { name: "theta", label: "Sudut pusat (°)", defaultValue: 90, min: 1, max: 360, step: 1 },
    { name: "r", label: "Jari-jari", defaultValue: 14, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Panjang busur",
  compute: (v) => (v.theta / 360) * 2 * Math.PI * v.r,
  formatResult: (r) => r.toFixed(2),
  visual: "sector",
  stepByStep: (v) => [
    { label: "Substitusi nilai", detail: `θ = ${v.theta}°, r = ${v.r}` },
    { label: "Hitung fraksi", detail: `${v.theta}/360 = ${(v.theta / 360).toFixed(4)}` },
    { label: "Kalikan keliling", detail: `${(v.theta / 360).toFixed(4)} × 2π(${v.r}) = ${((v.theta / 360) * 2 * Math.PI * v.r).toFixed(2)}` },
  ],
  examples: [
    { input: { theta: 90, r: 14 }, result: 21.99, formatted: "(90/360) × 2π(14) ≈ 21.99" },
  ],
  practice: [
    { question: "Lintasan lari: r=12m, sudut 60 derajat. Panjang lintasan?", variables: { theta: 60, r: 12 }, answer: 12.57, answerFormatted: "12.57", options: ["12.57", "25.13", "6.28", "37.70"], explanation: "L = (60/360) × 2π(12) ≈ 12.57" },
    { question: "Jalan setengah lingkaran: r=10m, sudut 180 derajat. Panjang jalan?", variables: { theta: 180, r: 10 }, answer: 31.42, answerFormatted: "31.42", options: ["31.42", "62.83", "15.71", "94.25"], explanation: "L = (180/360) × 2π(10) ≈ 31.42" },
    { question: "Lintasan taman: r=8m, sudut 45 derajat. Panjang lintasan?", variables: { theta: 45, r: 8 }, answer: 6.28, answerFormatted: "6.28", options: ["6.28", "12.57", "3.14", "25.13"], explanation: "L = (45/360) × 2π(8) ≈ 6.28" },
  ],
});

reg({
  formula: "=\\frac{\\theta}{360°}\\times \\pi r^2",
  description: "Luas juring: fraksi sudut pusat dikali luas lingkaran. Rumusnya (θ/360°) × πr². Juring seperti irisan kue: semakin besar sudut pusatnya, semakin besar irisan yang diambil dari lingkaran penuh.",
  variables: [
    { name: "theta", label: "Sudut pusat (°)", defaultValue: 90, min: 1, max: 360, step: 1 },
    { name: "r", label: "Jari-jari", defaultValue: 14, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Luas juring",
  compute: (v) => (v.theta / 360) * Math.PI * v.r * v.r,
  formatResult: (r) => r.toFixed(2),
  visual: "sector",
  stepByStep: (v) => [
    { label: "Substitusi nilai", detail: `θ = ${v.theta}°, r = ${v.r}` },
    { label: "Hitung fraksi", detail: `${v.theta}/360 = ${(v.theta / 360).toFixed(4)}` },
    { label: "Kuadratkan r", detail: `${v.r}² = ${v.r * v.r}` },
    { label: "Kalikan", detail: `${(v.theta / 360).toFixed(4)} × π × ${v.r * v.r} = ${((v.theta / 360) * Math.PI * v.r * v.r).toFixed(2)}` },
  ],
  examples: [
    { input: { theta: 90, r: 14 }, result: 153.94, formatted: "(90/360) × π(14²) ≈ 153.94" },
  ],
  practice: [
    { question: "Taman juring: r=6m, sudut 120 derajat. Luas taman?", variables: { theta: 120, r: 6 }, answer: 37.70, answerFormatted: "37.70", options: ["37.70", "113.10", "18.85", "75.40"], explanation: "L = (120/360) × π(6²) ≈ 37.70" },
    { question: "Halaman juring: r=10m, sudut 60 derajat. Luas halaman?", variables: { theta: 60, r: 10 }, answer: 52.36, answerFormatted: "52.36", options: ["52.36", "104.72", "26.18", "157.08"], explanation: "L = (60/360) × π(10²) ≈ 52.36" },
    { question: "Kolam juring: r=4m, sudut 270 derajat. Luas kolam?", variables: { theta: 270, r: 4 }, answer: 37.70, answerFormatted: "37.70", options: ["37.70", "75.40", "18.85", "50.27"], explanation: "L = (270/360) × π(4²) ≈ 37.70" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMP — Bangun Ruang 3D
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "=s^3",
  description: "Volume kubus: sisi dipangkatkan tiga (s³). Karena semua sisi kubus sama panjang, kita tinggal mengalikan panjang, lebar, dan tinggi yang semuanya bernilai s. Misalnya kubus sisi 5 cm memiliki volume 5³ = 125 cm³.",
  variables: [
    { name: "s", label: "Sisi", defaultValue: 5, min: 1, max: 50, step: 1 },
  ],
  outputLabel: "Volume",
  compute: (v) => v.s ** 3,
  formatResult: (r) => r.toLocaleString("id"),
  visual: "prism",
  stepByStep: (v) => [
    { label: "Substitusi nilai", detail: `s = ${v.s}` },
    { label: "Kubikan", detail: `${v.s}³ = ${v.s ** 3}` },
  ],
  examples: [
    { input: { s: 5 }, result: 125, formatted: "5³ = 125" },
  ],
  practice: [
    { question: "Andi bikin kardus kado kubus buat ulang tahun Rina. Sisi kardus 4 cm. Berapa isi kardusnya?", variables: { s: 4 }, answer: 64, answerFormatted: "64 cm³", options: ["64 cm³", "48 cm³", "16 cm³", "96 cm³"], explanation: "V = 4³ = 64 cm³. Kado kecil tapi penuh cinta!" },
    { question: "Rina bikin es batu bentuk kubus buat pesta. Sisi es batu 10 cm. Berapa volume es batunya?", variables: { s: 10 }, answer: 1000, answerFormatted: "1000", options: ["1000", "300", "100", "3000"], explanation: "V = 10³ = 1000 cm³. Es batu raksasa, segede bak mandi!" },
    { question: "Pak Budi bikin dadu raksasa buat hiasan toko. Sisi dadu 7 cm. Berapa volume dadunya?", variables: { s: 7 }, answer: 343, answerFormatted: "343", options: ["343", "147", "49", "686"], explanation: "V = 7³ = 343 cm³. Dadu gede, lempar aja bisa patah meja!" },
  ],
});

reg({
  formula: "=6s^2",
  description: "Luas permukaan kubus: 6 kali luas satu sisi (6s²). Kubus memiliki 6 sisi yang masing-masing berbentuk persegi dengan luas s². Semua sisi ini dijumlahkan untuk mendapatkan luas permukaan total.",
  variables: [
    { name: "s", label: "Sisi", defaultValue: 5, min: 1, max: 50, step: 1 },
  ],
  outputLabel: "Luas permukaan",
  visual: "cube-3d",
  compute: (v) => 6 * v.s * v.s,
  formatResult: (r) => r.toLocaleString("id"),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "s = " + v.s },
    { label: "Hitung s^2", detail: v.s + "^2 = " + (v.s * v.s) },
    { label: "Kalikan 6", detail: "6 x " + (v.s*v.s) + " = " + (6 * v.s * v.s) },
    { label: "Hasil", detail: "Luas = " + (6 * v.s * v.s) },
  ],
  examples: [
    { input: { s: 5 }, result: 150, formatted: "6 × 5² = 150" },
  ],
  practice: [
    { question: "Balok kado: sisi 3 cm. Berapa kertas kado yang dibutuhkan?", variables: { s: 3 }, answer: 54, answerFormatted: "54 cm²", options: ["54 cm²", "27 cm²", "18 cm²", "108 cm²"], explanation: "LP = 6 × 3² = 6 × 9 = 54 cm²" },
    { question: "Kubus es: sisi 8 cm. Luas permukaan es?", variables: { s: 8 }, answer: 384, answerFormatted: "384", options: ["384", "192", "64", "768"], explanation: "LP = 6 × 8² = 6 × 64 = 384" },
    { question: "Dadu: sisi 6 cm. Luas permukaan dadu?", variables: { s: 6 }, answer: 216, answerFormatted: "216", options: ["216", "108", "36", "432"], explanation: "LP = 6 × 6² = 6 × 36 = 216" },
  ],
});

reg({
  formula: "=p\\times l\\times t",
  description: "Volume balok: panjang dikali lebar dikali tinggi (p×l×t). Balok seperti kubus tapi sisi-sisinya tidak harus sama. Rumus ini bekerja karena volume adalah ruang yang terisi oleh balok.",
  variables: [
    { name: "p", label: "Panjang", defaultValue: 10, min: 1, max: 100, step: 1 },
    { name: "l", label: "Lebar", defaultValue: 5, min: 1, max: 100, step: 1 },
    { name: "t", label: "Tinggi", defaultValue: 4, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Volume",
  visual: "box-3d",
  compute: (v) => v.p * v.l * v.t,
  formatResult: (r) => r.toLocaleString("id"),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "p=" + v.p + ", l=" + v.l + ", t=" + v.t },
    { label: "Kalikan p x l", detail: v.p + " x " + v.l + " = " + (v.p * v.l) },
    { label: "Kalikan hasil x t", detail: (v.p*v.l) + " x " + v.t + " = " + (v.p * v.l * v.t) },
    { label: "Hasil", detail: "Volume = " + (v.p * v.l * v.t) },
  ],
  examples: [
    { input: { p: 10, l: 5, t: 4 }, result: 200, formatted: "10 × 5 × 4 = 200" },
  ],
  practice: [
    { question: "Ruang kelas: panjang 12m, lebar 8m, tinggi 3m. Volume ruangan?", variables: { p: 12, l: 8, t: 3 }, answer: 288, answerFormatted: "288", options: ["288", "96", "48", "576"], explanation: "V = 12 × 8 × 3 = 288" },
    { question: "Gudang: panjang 15m, lebar 6m, tinggi 5m. Volume gudang?", variables: { p: 15, l: 6, t: 5 }, answer: 450, answerFormatted: "450", options: ["450", "150", "90", "900"], explanation: "V = 15 × 6 × 5 = 450" },
    { question: "Lemari: panjang 7m, lebar 4m, tinggi 9m. Volume lemari?", variables: { p: 7, l: 4, t: 9 }, answer: 252, answerFormatted: "252", options: ["252", "84", "36", "504"], explanation: "V = 7 × 4 × 9 = 252" },
  ],
});

reg({
  formula: "=\\pi r^2 t",
  description: "Volume tabung: πr²t. Luas alas berbentuk lingkaran (πr²) dikalikan tinggi. Tabung seperti kaleng: semua irisan melintang memiliki luas yang sama, sehingga volume tinggal luas alas kali tinggi.",
  variables: [
    { name: "r", label: "Jari-jari", defaultValue: 7, min: 1, max: 100, step: 1 },
    { name: "t", label: "Tinggi", defaultValue: 10, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Volume",
  compute: (v) => Math.PI * v.r * v.r * v.t,
  formatResult: (r) => r.toFixed(2),
  visual: "cylinder",
  stepByStep: (v) => [
    { label: "Substitusi nilai", detail: `r = ${v.r}, t = ${v.t}` },
    { label: "Kuadratkan r", detail: `${v.r}² = ${v.r * v.r}` },
    { label: "Kalikan", detail: `π × ${v.r * v.r} × ${v.t} = ${(Math.PI * v.r * v.r * v.t).toFixed(2)}` },
  ],
  examples: [
    { input: { r: 7, t: 10 }, result: 1539.38, formatted: "π × 7² × 10 ≈ 1539.38" },
  ],
  practice: [
    { question: "Tong air: jari-jari 5cm, tinggi 12cm. Volume air?", variables: { r: 5, t: 12 }, answer: 942.48, answerFormatted: "942.48", options: ["942.48", "376.99", "188.50", "1884.96"], explanation: "V = π × 5² × 12 ≈ 942.48" },
    { question: "Kaleng: jari-jari 10cm, tinggi 8cm. Volume kaleng?", variables: { r: 10, t: 8 }, answer: 2513.27, answerFormatted: "2513.27", options: ["2513.27", "502.65", "251.33", "5026.55"], explanation: "V = π × 10² × 8 ≈ 2513.27" },
    { question: "Botol: jari-jari 3cm, tinggi 15cm. Volume botol?", variables: { r: 3, t: 15 }, answer: 424.12, answerFormatted: "424.12", options: ["424.12", "141.37", "28.27", "848.23"], explanation: "V = π × 3² × 15 ≈ 424.12" },
  ],
});

reg({
  formula: "=\\frac{1}{3}\\pi r^2 t",
  description: "Volume kerucut: sepertiga kali πr²t. Kerucut seperti setengah tabung yang meruncing ke atas. Volume kerucut tepat sepertiga dari volume tabung dengan alas dan tinggi yang sama.",
  variables: [
    { name: "r", label: "Jari-jari", defaultValue: 7, min: 1, max: 100, step: 1 },
    { name: "t", label: "Tinggi", defaultValue: 15, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Volume",
  compute: (v) => (1 / 3) * Math.PI * v.r * v.r * v.t,
  formatResult: (r) => r.toFixed(2),
  visual: "cone",
  stepByStep: (v) => [
    { label: "Substitusi nilai", detail: `r = ${v.r}, t = ${v.t}` },
    { label: "Kuadratkan r", detail: `${v.r}² = ${v.r * v.r}` },
    { label: "Kalikan", detail: `⅓ × π × ${v.r * v.r} × ${v.t} = ${((1 / 3) * Math.PI * v.r * v.r * v.t).toFixed(2)}` },
  ],
  examples: [
    { input: { r: 7, t: 15 }, result: 769.69, formatted: "⅓ × π × 7² × 15 ≈ 769.69" },
  ],
  practice: [
    { question: "Es krim cone: jari-jari 6cm, tinggi 10cm. Volume es krim?", variables: { r: 6, t: 10 }, answer: 376.99, answerFormatted: "376.99", options: ["376.99", "1130.97", "113.10", "753.98"], explanation: "V = ⅓ × π × 6² × 10 ≈ 376.99" },
    { question: "Corong: jari-jari 3cm, tinggi 21cm. Volume corong?", variables: { r: 3, t: 21 }, answer: 197.92, answerFormatted: "197.92", options: ["197.92", "593.76", "59.38", "395.84"], explanation: "V = ⅓ × π × 3² × 21 ≈ 197.92" },
    { question: "Topi sirkus: jari-jari 10cm, tinggi 9cm. Volume topi?", variables: { r: 10, t: 9 }, answer: 942.48, answerFormatted: "942.48", options: ["942.48", "2827.43", "282.74", "1884.96"], explanation: "V = ⅓ × π × 10² × 9 ≈ 942.48" },
  ],
});

reg({
  formula: "=\\frac{4}{3}\\pi r^3",
  description: "Volume bola: (4/3)πr³. Rumus ini ditemukan oleh Archimedes. Bola memiliki volume yang efisien: dari semua bentuk dengan luas permukaan yang sama, bola memiliki volume terbesar.",
  variables: [
    { name: "r", label: "Jari-jari", defaultValue: 7, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Volume",
  compute: (v) => (4 / 3) * Math.PI * v.r ** 3,
  formatResult: (r) => r.toFixed(2),
  visual: "sphere",
  stepByStep: (v) => [
    { label: "Substitusi nilai", detail: `r = ${v.r}` },
    { label: "Kubikan", detail: `${v.r}³ = ${v.r ** 3}` },
    { label: "Kalikan", detail: `⅔ × π × ${v.r ** 3} = ${((4 / 3) * Math.PI * v.r ** 3).toFixed(2)}` },
  ],
  examples: [
    { input: { r: 7 }, result: 1436.76, formatted: "⁴⁄₃ × π × 7³ ≈ 1436.76" },
  ],
  practice: [
    { question: "Bola sepak: jari-jari 6cm. Volume bola?", variables: { r: 6 }, answer: 904.78, answerFormatted: "904.78 cm³", options: ["904.78 cm³", "452.39 cm³", "226.19 cm³", "1809.56 cm³"], explanation: "V = ⁴⁄₃ × π × 6³ ≈ 904.78 cm³" },
    { question: "Bola pingpong: jari-jari 3cm. Volume bola?", variables: { r: 3 }, answer: 113.10, answerFormatted: "113.10", options: ["113.10", "339.29", "28.27", "226.19"], explanation: "V = ⁴⁄₃ × π × 3³ ≈ 113.10" },
    { question: "Bola tenis: jari-jari 5cm. Volume bola?", variables: { r: 5 }, answer: 523.60, answerFormatted: "523.60", options: ["523.60", "1570.80", "157.08", "1047.20"], explanation: "V = ⁴⁄₃ × π × 5³ ≈ 523.60" },
  ],
});

reg({
  formula: "=4\\pi r^2",
  description: "Luas permukaan bola: 4πr². Menariknya, luas permukaan bola sama dengan 4 kali luas lingkaran dengan jari-jari yang sama. Rumus ini berguna untuk menghitung kebutuhan cat atau bahan pelapis bola.",
  variables: [
    { name: "r", label: "Jari-jari", defaultValue: 7, min: 1, max: 50, step: 1 },
  ],
  outputLabel: "Luas permukaan",
  visual: "sphere",
  compute: (v) => 4 * Math.PI * v.r * v.r,
  formatResult: (r) => r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "r = " + v.r },
    { label: "Hitung r^2", detail: v.r + "^2 = " + (v.r * v.r) },
    { label: "Kalikan 4pi", detail: "4 x pi x " + (v.r*v.r) + " = " + (4 * Math.PI * v.r * v.r).toFixed(4) },
    { label: "Hasil", detail: "Luas = " + (4 * Math.PI * v.r * v.r).toFixed(4) },
  ],
  examples: [
    { input: { r: 7 }, result: 615.75, formatted: "4 × π × 7² ≈ 615.75" },
  ],
  practice: [
    { question: "Bola basket: jari-jari 5cm. Luas permukaan bola?", variables: { r: 5 }, answer: 314.16, answerFormatted: "314.16 cm²", options: ["314.16 cm²", "523.60 cm²", "157.08 cm²", "628.32 cm²"], explanation: "LP = 4 × π × 5² ≈ 314.16 cm²" },
    { question: "Bola golf: jari-jari 3cm. Luas permukaan?", variables: { r: 3 }, answer: 113.10, answerFormatted: "113.10", options: ["113.10", "339.29", "28.27", "226.19"], explanation: "LP = 4 × π × 3² ≈ 113.10" },
    { question: "Bola sepak: jari-jari 10cm. Luas permukaan?", variables: { r: 10 }, answer: 1256.64, answerFormatted: "1256.64", options: ["1256.64", "4188.79", "314.16", "628.32"], explanation: "LP = 4 × π × 10² ≈ 1256.64" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMP — Statistika & Peluang
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "\\bar{x}=\\frac{\\sum x_i}{n}",
  description: "Mean (rata-rata): jumlah seluruh data dibagi banyak data. Rumus ini memberikan nilai tengah dari sekumpulan data. Mean sensitif terhadap nilai ekstrem (outlier), jadihati-hati jika ada data yang sangat besar atau sangat kecil.",
  variables: [
    { name: "sum", label: "Jumlah data", defaultValue: 85, min: 1, max: 1000, step: 1 },
    { name: "n", label: "Banyak data", defaultValue: 5, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Mean",
  visual: "histogram",
  compute: (v) => v.sum / v.n,
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "Jumlah = " + v.sum + ", n = " + v.n },
    { label: "Bagi", detail: v.sum + " / " + v.n + " = " + (v.sum / v.n).toFixed(4) },
    { label: "Hasil", detail: "x-bar = " + (v.sum / v.n).toFixed(4) },
  ],
  examples: [
    { input: { sum: 85, n: 5 }, result: 17, formatted: "85 ÷ 5 = 17" },
  ],
  practice: [
    { question: "Andi punya 5 nilai ujian. Totalnya 120. Berapa rata-ratanya?", variables: { sum: 120, n: 5 }, answer: 24, answerFormatted: "24", options: ["24", "30", "20", "60"], explanation: "Rata-rata = 120/5 = 24. Nilai Andi cukup bagus!" },
    { question: "Rina punya 8 foto. Total ukuran 200 MB. Rata-rata ukuran per foto?", variables: { sum: 200, n: 8 }, answer: 25, answerFormatted: "25", options: ["25", "40", "20", "160"], explanation: "Rata-rata = 200/8 = 25 MB. Foto ini lumayan berat!" },
    { question: "Pak Budi mengumpulkan 4 koin. Total Rp72.000. Rata-rata per koin?", variables: { sum: 72, n: 4 }, answer: 18, answerFormatted: "18", options: ["18", "28", "12", "36"], explanation: "Rata-rata = 72.000/4 = Rp18.000. Koin ini mahal!" },
  ],
});

reg({
  formula: "P(A)=\\frac{n(A)}{n(S)}",
  description: "Probabilitas kejadian A: banyak kejadian yang menguntungkan dibagi banyak kemungkinan total. Nilainya selalu antara 0 (mustahil) dan 1 (pasti). Misalnya peluang mata dadu genap = 3/6 = 0,5.",
  variables: [
    { name: "nA", label: "n(A) — kejadian menguntungkan", defaultValue: 3, min: 0, max: 100, step: 1 },
    { name: "nS", label: "n(S) — ruang sampel", defaultValue: 10, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Probabilitas",
  visual: "pie-chart",
  compute: (v) => v.nA / v.nS,
  formatResult: (r) => (r * 100).toFixed(1) + "%",
  stepByStep: (v) => [
    { label: "Substitusi", detail: "n(A) = " + v.nA + ", n(S) = " + v.nS },
    { label: "Bagi", detail: v.nA + " / " + v.nS + " = " + (v.nA / v.nS).toFixed(4) },
    { label: "Hasil", detail: "P(A) = " + (v.nA / v.nS * 100).toFixed(2) + "%" },
  ],
  examples: [
    { input: { nA: 3, nS: 10 }, result: 0.3, formatted: "P(A) = 3/10 = 30%" },
  ],
  practice: [
    { question: "Andi melempar dadu. Peluang dapat angka genap?", variables: { nA: 3, nS: 6 }, answer: 0.5, answerFormatted: "50%", options: ["50%", "33.3%", "25%", "66.7%"], explanation: "P(genap) = 3/6 = 1/2 = 50%. Genap atau ganjil, peluangnya sama!" },
    { question: "Kelas 20 siswa, 8 laki-laki. Guru ambil 1 siswa acak. Peluang laki-laki?", variables: { nA: 8, nS: 20 }, answer: 0.4, answerFormatted: "40%", options: ["40%", "60%", "20%", "80%"], explanation: "P = 8/20 = 40%. Masih kecil peluangnya!" },
    { question: "Kantong 5 kartu merah, 3 kuning, 2 hijau. Ambil 1 kartu. P(merah)?", variables: { nA: 5, nS: 10 }, answer: 0.5, answerFormatted: "50%", options: ["50%", "30%", "20%", "70%"], explanation: "P = 5/10 = 50%. Setengah peluang dapat merah!" },
  ],
});

reg({
  formula: "P(A^c)=1-P(A)",
  description: "Peluang komplemen: peluang suatu kejadian TIDAK terjadi sama dengan 1 dikurangi peluang kejadian itu terjadi. Misalnya jika P(hujan) = 0,3, maka P(tidak hujan) = 1 - 0,3 = 0,7. Kedua peluang ini selalu berjumlah 1.",
  variables: [
    { name: "pA", label: "P(A)", defaultValue: 0.3, min: 0, max: 1, step: 0.01 },
  ],
  outputLabel: "P(Aᶜ)",
  visual: "pie-chart",
  compute: (v) => 1 - v.pA,
  formatResult: (r) => (r * 100).toFixed(1) + "%",
  stepByStep: (v) => [
    { label: "Substitusi", detail: "P(A) = " + v.pA },
    { label: "Kurangkan dari 1", detail: "1 - " + v.pA + " = " + (1 - v.pA) },
    { label: "Hasil", detail: "P(Ac) = " + (1 - v.pA).toFixed(4) },
  ],
  examples: [
    { input: { pA: 0.3 }, result: 0.7, formatted: "P(Aᶜ) = 1 - 0.3 = 0.7" },
  ],
  practice: [
    { question: "Prediksi cuaca: P(hujan) = 30%. Peluang tidak hujan?", variables: { pA: 0.3 }, answer: 0.7, answerFormatted: "70%", options: ["70%", "30%", "60%", "40%"], explanation: "P(tidak) = 1 - 0.3 = 0.7 = 70%. Lebih mungkin tidak hujan!" },
    { question: "Tim A punya peluang menang 65%. Peluang kalah?", variables: { pA: 0.65 }, answer: 0.35, answerFormatted: "35%", options: ["35%", "65%", "30%", "70%"], explanation: "P(kalah) = 1 - 0.65 = 0.35 = 35%. Tim A lebih mungkin menang!" },
    { question: "Andi menjawab tebakan. P(benar) = 80%. P(salah)?", variables: { pA: 0.8 }, answer: 0.2, answerFormatted: "20%", options: ["20%", "80%", "40%", "60%"], explanation: "P(salah) = 1 - 0.8 = 0.2 = 20%. Kemungkinan kecil salah!" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Eksponen Lanjut
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "a^{-n} = \\frac{1}{a^n}",
  description: "Eksponen negatif: a^(-n) = 1/a^n. Basis dinaikkan ke pangkat positif lalu dibalik (1 dibagi hasilnya). Misalnya 2^(-3) = 1/2³ = 1/8 = 0,125. Eksponen negatif berarti kebalikan dari eksponen positif.",
  variables: [
    { name: "a", label: "Basis", defaultValue: 2, min: 1, max: 20, step: 1 },
    { name: "n", label: "Pangkat", defaultValue: 3, min: 1, max: 20, step: 1 },
  ],
  outputLabel: "Hasil",
  visual: "exponent",
  compute: (v) => 1 / Math.pow(v.a, v.n),
  formatResult: (r) => r < 0.001 ? r.toExponential(3) : r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", n=" + v.n },
    { label: "Hitung a^n", detail: v.a + "^" + v.n + " = " + Math.pow(v.a, v.n) },
    { label: "Ambil kebalikan", detail: "1 / " + Math.pow(v.a, v.n) + " = " + (1/Math.pow(v.a, v.n)).toFixed(4) },
  ],
  examples: [
    { input: { a: 2, n: 3 }, result: 0.125, formatted: "2⁻³ = 1/8 = 0.125" },
  ],
  practice: [
    { question: "Uang Rp1 dibagi 3^2 kali. Berapa sisa uangnya?", variables: { a: 3, n: 2 }, answer: 0.1111, answerFormatted: "1/9", options: ["1/9", "1/6", "1/3", "9"], explanation: "3^(-2) = 1/9 = 0.111. Uang tinggal 11% - habis dibagi!" },
    { question: "Rumus: 5^(-1). Berapa hasilnya?", variables: { a: 5, n: 1 }, answer: 0.2, answerFormatted: "1/5", options: ["1/5", "5", "1/25", "25"], explanation: "5^(-1) = 1/5 = 0.2. Satu per lima!" },
    { question: "Bakteri: 2^(-4). Berapa banyaknya?", variables: { a: 2, n: 4 }, answer: 0.0625, answerFormatted: "1/16", options: ["1/16", "1/8", "16", "8"], explanation: "2^(-4) = 1/16 = 0.0625. Sangat sedikit!" },
  ],
});

reg({
  formula: "a^{m/n} = \\sqrt[n]{a^m}",
  description: "Eksponen pecahan: a^(m/n) = akar ke-n dari a pangkat m. Bagian bawah pecahan adalah jenis akar, bagian atas adalah pangkat. Misalnya 8^(2/3) = (∛8)² = 2² = 4.",
  variables: [
    { name: "a", label: "Basis", defaultValue: 8, min: 1, max: 1000, step: 1 },
    { name: "m", label: "Pangkat", defaultValue: 1, min: 1, max: 10, step: 1 },
    { name: "n", label: "Akar ke-n", defaultValue: 3, min: 2, max: 10, step: 1 },
  ],
  outputLabel: "Hasil",
  visual: "exponent",
  compute: (v) => Math.pow(v.a, v.m / v.n),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", m=" + v.m + ", n=" + v.n },
    { label: "Hitung a^m", detail: v.a + "^" + v.m + " = " + Math.pow(v.a, v.m) },
    { label: "Akar ke-n", detail: v.n + "-root(" + Math.pow(v.a, v.m) + ") = " + Math.pow(v.a, v.m/v.n).toFixed(4) },
  ],
  examples: [
    { input: { a: 8, m: 1, n: 3 }, result: 2, formatted: "8^(1/3) = ∛8 = 2" },
  ],
  practice: [
    { question: "Akar pangkat tiga dari 27. Berapa?", variables: { a: 27, m: 1, n: 3 }, answer: 3, answerFormatted: "3", options: ["3", "9", "27", "6"], explanation: "27^(1/3) = 3. Karena 3^3 = 27!" },
    { question: "Akar kuadrat dari 16. Berapa?", variables: { a: 16, m: 1, n: 2 }, answer: 4, answerFormatted: "4", options: ["4", "8", "2", "16"], explanation: "16^(1/2) = 4. Karena 4^2 = 16!" },
    { question: "Akar pangkat tiga dari 8, lalu dipangkatkan 2. Hasilnya?", variables: { a: 8, m: 2, n: 3 }, answer: 4, answerFormatted: "4", options: ["4", "2", "8", "16"], explanation: "8^(2/3) = (8^(1/3))^2 = 2^2 = 4!" },
  ],
});

reg({
  formula: "\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}",
  description: "Perkalian akar: √a × √b = √(a×b). Dua akar bisa digabungkan menjadi satu akar dari hasil kali kedua bilangan. Misalnya √4 × √9 = √36 = 6. Berguna untuk menyederhanakan ekspresi akar.",
  variables: [
    { name: "a", label: "Akar pertama", defaultValue: 4, min: 1, max: 100, step: 1 },
    { name: "b", label: "Akar kedua", defaultValue: 9, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Hasil",
  visual: "exponent",
  compute: (v) => Math.sqrt(v.a * v.b),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b },
    { label: "Kalikan di dalam akar", detail: "sqrt(" + v.a + " x " + v.b + ") = sqrt(" + (v.a*v.b) + ")" },
    { label: "Hasil", detail: Math.sqrt(v.a * v.b).toFixed(4) },
  ],
  examples: [
    { input: { a: 4, b: 9 }, result: 6, formatted: "√4 × √9 = √36 = 6" },
  ],
  practice: [
    { question: "Dua kolam: √2 dan √8 meter. Total luas gabungan?", variables: { a: 2, b: 8 }, answer: 4, answerFormatted: "4", options: ["4", "2√2", "16", "√10"], explanation: "√2 x √8 = √16 = 4 m2. Kolam gabungan 4 m2!" },
    { question: "Dua taman: √3 dan √12 meter. Total luas gabungan?", variables: { a: 3, b: 12 }, answer: 6, answerFormatted: "6", options: ["6", "3√3", "36", "√15"], explanation: "√3 x √12 = √36 = 6 m2. Taman gabungan 6 m2!" },
    { question: "Dua kubus: sisi √5 cm. Berapa volume gabungan?", variables: { a: 5, b: 5 }, answer: 5, answerFormatted: "5", options: ["5", "25", "10", "√10"], explanation: "√5 x √5 = 5. Volume gabungan 5 cm3!" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Persamaan Kuadrat
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "D = b^2-4ac",
  description: "Diskriminan menentukan jenis akar persamaan kuadrat ax²+bx+c=0. Jika D>0: dua akar berbeda. Jika D=0: satu akar kembar. Jika D<0: tidak ada akar riil (akar imajiner). D juga membantu menentukan banyaknya sumbu simetri parabola.",
  variables: [
    { name: "a", label: "Koefisien a", defaultValue: 1, min: -50, max: 50, step: 1 },
    { name: "b", label: "Koefisien b", defaultValue: -7, min: -50, max: 50, step: 1 },
    { name: "c", label: "Koefisien c", defaultValue: 12, min: -50, max: 50, step: 1 },
  ],
  outputLabel: "Diskriminan (D)",
  visual: "function-graph",
  compute: (v) => v.b ** 2 - 4 * v.a * v.c,
  formatResult: (r) => {
    if (r > 0) return `${r} (2 akar berbeda)`;
    if (r === 0) return `${r} (1 akar kembar)`;
    return `${r} (tidak akar riil)`;
  },
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b + ", c=" + v.c },
    { label: "Hitung b^2", detail: v.b + "^2 = " + (v.b * v.b) },
    { label: "Hitung 4ac", detail: "4 x " + v.a + " x " + v.c + " = " + (4 * v.a * v.c) },
    { label: "Kurangkan", detail: (v.b*v.b) + " - " + (4*v.a*v.c) + " = " + (v.b*v.b - 4*v.a*v.c) },
    { label: "Keterangan", detail: (v.b*v.b - 4*v.a*v.c > 0 ? "D>0: 2 akar berbeda" : (v.b*v.b - 4*v.a*v.c === 0 ? "D=0: 2 akar sama" : "D<0: tidak ada akar real")) },
  ],
  examples: [
    { input: { a: 1, b: -7, c: 12 }, result: 1, formatted: "D = (-7)² - 4(1)(12) = 1 → 2 akar berbeda" },
  ],
  practice: [
    { question: "Andi nemuin persamaan x²-5x+6=0 di tugas sekolah. Dia penasaran: berapa diskriminannya? Apakah akarnya ada dua atau satu?", variables: { a: 1, b: -5, c: 6 }, answer: 1, answerFormatted: "1", options: ["1", "49", "-1", "0"], explanation: "D = 25-24 = 1. D>0 artinya ada 2 akar berbeda — Andi lega, soalnya gampang difaktorkan!" },
    { question: "Rina lagi ujian, dapet soal x²-4x+4=0. Dia harus hitung diskriminan dulu. Berapa?", variables: { a: 1, b: -4, c: 4 }, answer: 0, answerFormatted: "0", options: ["0", "16", "-16", "4"], explanation: "D = 16-16 = 0. D=0 artinya akar kembar — Rina langsung senyum, tinggal (x-2)²!" },
    { question: "Pak Budi bikin soal ulangan: x²+x+1=0. Dia mau tahu diskriminannya buat kunci jawaban. Berapa?", variables: { a: 1, b: 1, c: 1 }, answer: -3, answerFormatted: "-3", options: ["-3", "5", "-5", "3"], explanation: "D = 1² - 4(1)(1) = 1-4 = -3. D<0, nggak ada akar riil — Pak Budi ternyata jahil!" },
  ],
});

reg({
  formula: "x_1+x_2 = -\\frac{b}{a}",
  description: "Jumlah dua akar persamaan kuadrat selalu sama dengan -b/a, tanpa perlu mencari akar-akarnya terlebih dahulu. Ini sangat berguna untuk menyelesaikan soal tanpa memfaktorkan persamaan kuadrat.",
  variables: [
    { name: "a", label: "Koefisien a", defaultValue: 1, min: -50, max: 50, step: 1 },
    { name: "b", label: "Koefisien b", defaultValue: -7, min: -50, max: 50, step: 1 },
  ],
  outputLabel: "x₁ + x₂",
  visual: "function-graph",
  compute: (v) => -v.b / v.a,
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b },
    { label: "Hitung -b/a", detail: "-" + v.b + " / " + v.a + " = " + (-v.b/v.a).toFixed(4) },
    { label: "Hasil", detail: "x1 + x2 = " + (-v.b/v.a).toFixed(4) },
  ],
  examples: [
    { input: { a: 1, b: -7 }, result: 7, formatted: "-(-7)/1 = 7" },
  ],
  practice: [
    { question: "Andi lagi belajar faktorisasi. Persamaannya x²-9x+14=0. Tanpa cari akarnya, berapa jumlah kedua akar?", variables: { a: 1, b: -9 }, answer: 9, answerFormatted: "9", options: ["9", "-9", "14", "-14"], explanation: "x₁+x₂ = -(-9)/1 = 9. Andi nggak perlu faktor, tinggal pakai rumus!" },
    { question: "Rina dapet soal 2x²-10x+8=0. Guru minta jumlah akar tanpa dipecah. Berapa?", variables: { a: 2, b: -10 }, answer: 5, answerFormatted: "5", options: ["5", "10", "4", "8"], explanation: "x₁+x₂ = -(-10)/2 = 5. Rina senyum, rumusnya jimat ajaib!" },
    { question: "Pak Budi kasih soal: x²+3x-10=0. Berapa jumlah akarnya?", variables: { a: 1, b: 3 }, answer: -3, answerFormatted: "-3", options: ["-3", "3", "10", "-10"], explanation: "x₁+x₂ = -(3)/1 = -3. Jumlahnya negatif, berarti salah satu akar negatif!" },
  ],
});

reg({
  formula: "x_1 \\cdot x_2 = \\frac{c}{a}",
  description: "Hasil kali dua akar persamaan kuadrat selalu sama dengan c/a. Sama seperti jumlah akar, rumus ini tidak memerlukan pencarian akar-akar secara langsung. Kombinasi rumus jumlah dan hasil kali akar sangat powerful dalam menyelesaikan soal.",
  variables: [
    { name: "a", label: "Koefisien a", defaultValue: 1, min: -50, max: 50, step: 1 },
    { name: "c", label: "Koefisien c", defaultValue: 12, min: -50, max: 50, step: 1 },
  ],
  outputLabel: "x₁ × x₂",
  visual: "function-graph",
  compute: (v) => v.c / v.a,
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", c=" + v.c },
    { label: "Hitung c/a", detail: v.c + " / " + v.a + " = " + (v.c/v.a).toFixed(4) },
    { label: "Hasil", detail: "x1 . x2 = " + (v.c/v.a).toFixed(4) },
  ],
  examples: [
    { input: { a: 1, c: 12 }, result: 12, formatted: "12/1 = 12" },
  ],
  practice: [
    { question: "Andi lagi praktek faktorisasi x²-7x+12=0. Tanpa cari akarnya, berapa hasil kali kedua akar?", variables: { a: 1, c: 12 }, answer: 12, answerFormatted: "12", options: ["12", "7", "-12", "5"], explanation: "x₁·x₂ = 12/1 = 12. Andi langsung tahu: 3×4=12, pasti akarnya 3 dan 4!" },
    { question: "Rina dapet soal x²-5x+6=0. Guru tanya: berapa hasil kali akarnya?", variables: { a: 1, c: 6 }, answer: 6, answerFormatted: "6", options: ["6", "5", "-6", "1"], explanation: "x₁·x₂ = 6/1 = 6. Rina mikir: 2×3=6, cocok!" },
    { question: "Pak Budi kasih soal 2x²-8x+6=0. Berapa hasil kali akar-akarnya?", variables: { a: 2, c: 6 }, answer: 3, answerFormatted: "3", options: ["3", "4", "6", "12"], explanation: "x₁·x₂ = 6/2 = 3. Pak Budi senyum: 'Anak-anak, jangan lupa bagi a!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Matriks
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "\\det(A) = ad-bc",
  description: "Determinan matriks 2×2 dihitung dari ad-bc. Determinan memberi informasi penting: jika det≠0, matriks punya balikan (invertible). Jika det=0, matriks tidak punya balikan dan sistem persamaan linear terkait tidak punya solusi unik.",
  variables: [
    { name: "a", label: "a₁₁", defaultValue: 3, min: -50, max: 50, step: 1 },
    { name: "b", label: "a₁₂", defaultValue: 2, min: -50, max: 50, step: 1 },
    { name: "c", label: "a₂₁", defaultValue: 1, min: -50, max: 50, step: 1 },
    { name: "d", label: "a₂₂", defaultValue: 4, min: -50, max: 50, step: 1 },
  ],
  outputLabel: "Determinan",
  visual: "matrix-grid",
  compute: (v) => v.a * v.d - v.b * v.c,
  formatResult: (r) => r.toString(),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b + ", c=" + v.c + ", d=" + v.d },
    { label: "Hitung ad", detail: v.a + " x " + v.d + " = " + (v.a * v.d) },
    { label: "Hitung bc", detail: v.b + " x " + v.c + " = " + (v.b * v.c) },
    { label: "Kurangkan", detail: (v.a*v.d) + " - " + (v.b*v.c) + " = " + (v.a*v.d - v.b*v.c) },
  ],
  examples: [
    { input: { a: 3, b: 2, c: 1, d: 4 }, result: 10, formatted: "3×4 - 2×1 = 10" },
  ],
  practice: [
    { question: "Andi lagi belajar matriks. Dia dapet matriks [[5,3],[2,4]]. Berapa determinannya? Pak Budi bilang kalau determinannya nol, matriksnya 'lemah'!", variables: { a: 5, b: 3, c: 2, d: 4 }, answer: 14, answerFormatted: "14", options: ["14", "26", "-2", "7"], explanation: "det = 5×4 - 3×2 = 20-6 = 14. Matriks Andi kuat, determinannya besar!" },
    { question: "Rina dapet matriks [[1,2],[3,4]]. Berapa determinannya? Menurut Pak Budi, kalau negatif berarti matriksnya 'balik arah'!", variables: { a: 1, b: 2, c: 3, d: 4 }, answer: -2, answerFormatted: "-2", options: ["-2", "10", "2", "-10"], explanation: "det = 1×4 - 2×3 = 4-6 = -2. Negatif! Rina bilang: 'Matriksnya nakal!'" },
    { question: "Pak Budi kasih matriks [[6,1],[2,3]]. Anak-anak, hitung determinannya!", variables: { a: 6, b: 1, c: 2, d: 3 }, answer: 16, answerFormatted: "16", options: ["16", "18", "4", "20"], explanation: "det = 6×3 - 1×2 = 18-2 = 16. Pak Budi: 'Bagus, kalian hebat!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Vektor
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "\\vec{u}+\\vec{v} = (u_1+v_1, u_2+v_2)",
  description: "Penjumlahan dua vektor: jumlahkan komponen x-nya dan komponen y-nya secara terpisah. Misalnya (3,4) + (1,2) = (4,6). Vektor hasil adalah vektor baru yang merupakan resultan dari kedua vektor asal.",
  variables: [
    { name: "u1", label: "u₁ (komponen x vektor u)", defaultValue: 3, min: -50, max: 50, step: 1 },
    { name: "u2", label: "u₂ (komponen y vektor u)", defaultValue: 4, min: -50, max: 50, step: 1 },
    { name: "v1", label: "v₁ (komponen x vektor v)", defaultValue: 1, min: -50, max: 50, step: 1 },
    { name: "v2", label: "v₂ (komponen y vektor v)", defaultValue: 2, min: -50, max: 50, step: 1 },
  ],
  outputLabel: "Hasil",
  visual: "vector-2d",
  compute: (v) => Math.sqrt((v.u1 + v.v1) ** 2 + (v.u2 + v.v2) ** 2),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "u=(" + v.u1 + "," + v.u2 + "), v=(" + v.v1 + "," + v.v2 + ")" },
    { label: "Jumlahkan komponen x", detail: v.u1 + " + " + v.v1 + " = " + (v.u1 + v.v1) },
    { label: "Jumlahkan komponen y", detail: v.u2 + " + " + v.v2 + " = " + (v.u2 + v.v2) },
    { label: "Hasil", detail: "u + v = (" + (v.u1+v.v1) + ", " + (v.u2+v.v2) + ")" },
  ],
  examples: [
    { input: { u1: 3, u2: 4, v1: 1, v2: 2 }, result: 7.21, formatted: "(3+1, 4+2) = (4, 6)" },
  ],
  practice: [
    { question: "Andi jalan 2 meter ke timur, 3 meter ke utara. Rina jalan 4 meter ke timur, 1 meter ke utara. Kalau digabung, berapa resultan perjalanannya?", variables: { u1: 2, u2: 3, v1: 4, v2: 1 }, answer: 7.21, answerFormatted: "(6, 4)", options: ["(6, 4)", "(2, 4)", "(8, 3)", "(6, 3)"], explanation: "u+v = (2+4, 3+1) = (6, 4). Total jalan: 6 meter timur, 4 meter utara!" },
    { question: "Rina mau ke perpustakaan. Dari rumahnya, dia jalan 5 meter ke timur, lalu 5 meter ke utara. Berapa resultan perjalanannya?", variables: { u1: 5, u2: 0, v1: 0, v2: 5 }, answer: 7.07, answerFormatted: "(5, 5)", options: ["(5, 5)", "(5, 0)", "(0, 5)", "(10, 10)"], explanation: "u+v = (5+0, 0+5) = (5, 5). Rina jalan diagonal, irit langkah!" },
    { question: "Pak Budi jalan 3 meter ke kiri, 4 meter ke atas (di peta). Lalu balik 3 meter ke kanan, 4 meter ke bawah. Posisi akhirnya?", variables: { u1: -3, u2: 4, v1: 3, v2: -4 }, answer: 0, answerFormatted: "(0, 0)", options: ["(0, 0)", "(-6, 8)", "(6, -8)", "(0, 8)"], explanation: "u+v = (-3+3, 4+(-4)) = (0, 0). Pak Budi balik ke titik awal — capek doang!" },
  ],
});

reg({
  formula: "|\\vec{v}| = \\sqrt{x^2+y^2}",
  description: "Besar (magnitude) vektor: akar kuadrat dari jumlah kuadrat komponen x dan y. Rumus ini sebenarnya penerapan Teorema Pythagoras pada vektor. |v| = √(x²+y²). Misalnya vektor (3,4) memiliki besar 5.",
  variables: [
    { name: "x", label: "Komponen x", defaultValue: 3, min: -100, max: 100, step: 1 },
    { name: "y", label: "Komponen y", defaultValue: 4, min: -100, max: 100, step: 1 },
  ],
  outputLabel: "|v|",
  visual: "vector-2d",
  compute: (v) => Math.sqrt(v.x ** 2 + v.y ** 2),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "x=" + v.x + ", y=" + v.y },
    { label: "Hitung x^2", detail: v.x + "^2 = " + (v.x * v.x) },
    { label: "Hitung y^2", detail: v.y + "^2 = " + (v.y * v.y) },
    { label: "Jumlahkan & akar", detail: "sqrt(" + (v.x*v.x) + " + " + (v.y*v.y) + ") = " + Math.sqrt(v.x*v.x + v.y*v.y).toFixed(4) },
  ],
  examples: [
    { input: { x: 3, y: 4 }, result: 5, formatted: "|(3,4)| = √(9+16) = 5" },
  ],
  practice: [
    { question: "Andi mengirim drone dari titik (0,0) ke (6,8). Berapa jarak tempuh drone-nya? Pak Budi bilang jangan lupa pakai Pythagoras!", variables: { x: 6, y: 8 }, answer: 10, answerFormatted: "10", options: ["10", "14", "48", "2"], explanation: "|v| = √(36+64) = √100 = 10. Drone Andi terbang 10 meter!" },
    { question: "Rina lempar anak panah dari (0,0) ke target (5,12). Berapa jarak anak panahnya?", variables: { x: 5, y: 12 }, answer: 13, answerFormatted: "13", options: ["13", "17", "60", "7"], explanation: "|v| = √(25+144) = √169 = 13. Rina jago panahan, 5-12-13!" },
    { question: "Pak Budi jalan dari (0,0) ke (1,1). Berapa jarak total langkahnya?", variables: { x: 1, y: 1 }, answer: 1.41, answerFormatted: "√2", options: ["√2", "2", "1", "4"], explanation: "|v| = √(1+1) = √2 ≈ 1.41. Pak Budi jalan diagonal, sedikit tapi efisien!" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Trigonometri
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "\\sin 2A = 2\\sin A \\cos A",
  description: "Identitas dwidit sinus: sin(2A) = 2 sin(A) cos(A). Rumus ini mengubah sinus sudut ganda menjadi perkalian sinus dan cosinus sudut asal. Sangat berguna untuk menyederhanakan persamaan trigonometri dan menghitung nilai sudut istimewa.",
  variables: [
    { name: "A", label: "Sudut A (derajat)", defaultValue: 30, min: 0, max: 360, step: 1 },
  ],
  outputLabel: "sin(2A)",
  visual: "unit-circle",
  compute: (v) => 2 * Math.sin(v.A * Math.PI / 180) * Math.cos(v.A * Math.PI / 180),
  formatResult: (r) => r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "A = " + v.A + " derajat" },
    { label: "Hitung sin(A)", detail: "sin(" + v.A + ") = " + Math.sin(v.A * Math.PI / 180).toFixed(4) },
    { label: "Hitung cos(A)", detail: "cos(" + v.A + ") = " + Math.cos(v.A * Math.PI / 180).toFixed(4) },
    { label: "Kalikan", detail: "2 x " + Math.sin(v.A*Math.PI/180).toFixed(4) + " x " + Math.cos(v.A*Math.PI/180).toFixed(4) + " = " + (2 * Math.sin(v.A*Math.PI/180) * Math.cos(v.A*Math.PI/180)).toFixed(4) },
  ],
  examples: [
    { input: { A: 30 }, result: 0.866, formatted: "sin(60°) = 2 sin(30°) cos(30°) ≈ 0.866" },
  ],
  practice: [
    { question: "Andi lagi belajar trigonometri. Dia harus hitung sin(2 × 45°). Pak Budi bilang: 'Ingat, sin 90° itu istimewa!'", variables: { A: 45 }, answer: 1, answerFormatted: "1", options: ["1", "0.5", "0.707", "0.866"], explanation: "sin(90°) = 2 sin(45°) cos(45°) = 2 × 0.707 × 0.707 = 1. Andi: 'Gampang ternyata!'" },
    { question: "Rina dapet soal: hitung sin(2 × 30°). Dia inget sin 30° = 1/2. Berapa hasilnya?", variables: { A: 30 }, answer: 0.866, answerFormatted: "√3/2", options: ["√3/2", "1/2", "1", "√2/2"], explanation: "sin(60°) = 2 sin(30°) cos(30°) = 2 × 1/2 × √3/2 = √3/2. Rina: 'Wah, jadi sin 60°!'" },
    { question: "Pak Budi kasih soal: hitung sin(2 × 60°). Siapa yang bisa?", variables: { A: 60 }, answer: 0.866, answerFormatted: "√3/2", options: ["√3/2", "1/2", "1", "-√3/2"], explanation: "sin(120°) = 2 sin(60°) cos(60°) = 2 × √3/2 × 1/2 = √3/2. Pak Budi: 'Sin 120° sama dengan sin 60°, hafalkan!'" },
  ],
});

reg({
  formula: "\\cos 2A = \\cos^2 A - \\sin^2 A",
  description: "Identitas dwidit cosinus: cos(2A) = cos²A - sin²A. Ada 2 bentuk lain yang setara: 2cos²A-1 dan 1-2sin²A. Pilih bentuk yang paling sesuai dengan data yang diketahui untuk mempermudah perhitungan.",
  variables: [
    { name: "A", label: "Sudut A (derajat)", defaultValue: 30, min: 0, max: 360, step: 1 },
  ],
  outputLabel: "cos(2A)",
  visual: "unit-circle",
  compute: (v) => Math.cos(v.A * Math.PI / 180) ** 2 - Math.sin(v.A * Math.PI / 180) ** 2,
  formatResult: (r) => r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "A = " + v.A + " derajat" },
    { label: "Hitung cos^2(A)", detail: "cos^2(" + v.A + ") = " + Math.pow(Math.cos(v.A*Math.PI/180), 2).toFixed(4) },
    { label: "Hitung sin^2(A)", detail: "sin^2(" + v.A + ") = " + Math.pow(Math.sin(v.A*Math.PI/180), 2).toFixed(4) },
    { label: "Kurangkan", detail: Math.pow(Math.cos(v.A*Math.PI/180),2).toFixed(4) + " - " + Math.pow(Math.sin(v.A*Math.PI/180),2).toFixed(4) + " = " + (Math.pow(Math.cos(v.A*Math.PI/180),2) - Math.pow(Math.sin(v.A*Math.PI/180),2)).toFixed(4) },
  ],
  examples: [
    { input: { A: 30 }, result: 0.5, formatted: "cos(60°) = cos²(30°) - sin²(30°) = 0.5" },
  ],
  practice: [
    { question: "Andi lagi ujian, dapet soal cos(2 × 45°). Dia tahu cos 45° = sin 45°. Berapa hasilnya?", variables: { A: 45 }, answer: 0, answerFormatted: "0", options: ["0", "1", "-1", "0.5"], explanation: "cos(90°) = cos²(45°) - sin²(45°) = 0.5 - 0.5 = 0. Andi: 'Cos 90° nol, gampang!'" },
    { question: "Rina harus hitung cos(2 × 60°). Menurut Pak Budi, ini trik supaya nggak kena jebakan!", variables: { A: 60 }, answer: -0.5, answerFormatted: "-1/2", options: ["-1/2", "1/2", "0", "-1"], explanation: "cos(120°) = cos²(60°) - sin²(60°) = 0.25 - 0.75 = -0.5. Rina: 'Negatif! Cos 120° di kuadran II!'" },
    { question: "Pak Budi kasih soal: cos(2 × 30°). Anak-anak, hati-hati ya!", variables: { A: 30 }, answer: 0.5, answerFormatted: "1/2", options: ["1/2", "-1/2", "0", "1"], explanation: "cos(60°) = cos²(30°) - sin²(30°) = 0.75 - 0.25 = 0.5. Pak Budi: 'Ingat, cos 60° = 1/2!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Aturan Sinus & Cosinus
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "c^2 = a^2+b^2 - 2ab\\cos C",
  description: "Aturan cosinus: c² = a² + b² - 2ab·cos(C). Rumus ini generalisasi dari Teorema Pythagoras yang berlaku untuk SEMUA segitiga, bukan hanya siku-siku. Jika C=90°, maka cos(90°)=0 dan rumus menjadi c²=a²+b².",
  variables: [
    { name: "a", label: "Sisi a", defaultValue: 5, min: 1, max: 100, step: 1 },
    { name: "b", label: "Sisi b", defaultValue: 7, min: 1, max: 100, step: 1 },
    { name: "C", label: "Sudut C (derajat)", defaultValue: 60, min: 1, max: 179, step: 1 },
  ],
  outputLabel: "Sisi c",
  visual: "right-triangle",
  compute: (v) => Math.sqrt(v.a ** 2 + v.b ** 2 - 2 * v.a * v.b * Math.cos(v.C * Math.PI / 180)),
  formatResult: (r) => r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b + ", C=" + v.C + " derajat" },
    { label: "Hitung a^2 + b^2", detail: (v.a*v.a) + " + " + (v.b*v.b) + " = " + (v.a*v.a + v.b*v.b) },
    { label: "Hitung 2ab.cos(C)", detail: "2x" + v.a + "x" + v.b + "x cos(" + v.C + ") = " + (2*v.a*v.b*Math.cos(v.C*Math.PI/180)).toFixed(4) },
    { label: "Hitung c^2", detail: (v.a*v.a+v.b*v.b) + " - " + (2*v.a*v.b*Math.cos(v.C*Math.PI/180)).toFixed(4) + " = " + (v.a*v.a + v.b*v.b - 2*v.a*v.b*Math.cos(v.C*Math.PI/180)).toFixed(4) },
  ],
  examples: [
    { input: { a: 5, b: 7, C: 60 }, result: 6.24, formatted: "c² = 25+49-2(5)(7)cos60° = 39, c ≈ 6.24" },
  ],
  practice: [
    { question: "Andi punya segitiga siku-siku. Sisi a=3, b=4, sudut C=90°. Berapa sisi miringnya? Ini soal favorit Pak Budi!", variables: { a: 3, b: 4, C: 90 }, answer: 5, answerFormatted: "5", options: ["5", "7", "25", "1"], explanation: "c² = 9+16-2(3)(4)cos90° = 25-0 = 25, c = 5. Andi: '3-4-5, triangle klasik!'" },
    { question: "Rina punya segitiga: sisi a=8, b=6, sudut C=60°. Berapa sisi c? Pak Budi bilang ini aturan cosinus!", variables: { a: 8, b: 6, C: 60 }, answer: 7.21, answerFormatted: "7.21", options: ["7.21", "10", "14", "2"], explanation: "c² = 64+36-2(8)(6)cos60° = 100-48 = 52, c ≈ 7.21. Rina: 'Sudut 60° bikin hasil nggak bulat!'" },
    { question: "Pak Budi punya segitiga sama sisi: a=10, b=10, C=120°. Berapa sisi c?", variables: { a: 10, b: 10, C: 120 }, answer: 17.32, answerFormatted: "17.32", options: ["17.32", "20", "0", "10"], explanation: "c² = 100+100-2(10)(10)cos120° = 200+100 = 300, c ≈ 17.32. Pak Budi: 'Segitiga tumpul, sisi miringnya panjang!'" },
  ],
});

reg({
  formula: "L = \\frac{1}{2}ab\\sin C",
  description: "Luas segitiga: ½ab·sin(C). Rumus ini menggunakan dua sisi dan sudut di antaranya. Berguna saat tinggi segitiga tidak diketahui tetapi dua sisi dan sudut yang mengapitnya diketahui.",
  variables: [
    { name: "a", label: "Sisi a", defaultValue: 8, min: 1, max: 100, step: 1 },
    { name: "b", label: "Sisi b", defaultValue: 6, min: 1, max: 100, step: 1 },
    { name: "C", label: "Sudut C (derajat)", defaultValue: 30, min: 1, max: 179, step: 1 },
  ],
  outputLabel: "Luas",
  visual: "triangle",
  compute: (v) => 0.5 * v.a * v.b * Math.sin(v.C * Math.PI / 180),
  formatResult: (r) => r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b + ", C=" + v.C + " derajat" },
    { label: "Hitung sin(C)", detail: "sin(" + v.C + ") = " + Math.sin(v.C*Math.PI/180).toFixed(4) },
    { label: "Hitung 1/2.ab.sinC", detail: "0.5 x " + v.a + " x " + v.b + " x " + Math.sin(v.C*Math.PI/180).toFixed(4) + " = " + (0.5*v.a*v.b*Math.sin(v.C*Math.PI/180)).toFixed(4) },
  ],
  examples: [
    { input: { a: 8, b: 6, C: 30 }, result: 12, formatted: "½ × 8 × 6 × sin30° = 12" },
  ],
  practice: [
    { question: "Andi punya lahan segitiga. Sisi a=10m, b=8m, sudut di antaranya 45°. Berapa luas lahan buat nanam tomat?", variables: { a: 10, b: 8, C: 45 }, answer: 28.28, answerFormatted: "28.28", options: ["28.28", "40", "80", "20"], explanation: "L = ½ × 10 × 8 × sin45° ≈ 28.28 m². Andi: 'Tomatnya muat banyak nih!'" },
    { question: "Rina punya lahan segitiga siku-siku. Sisi a=5m, b=12m, sudut C=90°. Berapa luas halaman buat jemuran?", variables: { a: 5, b: 12, C: 90 }, answer: 30, answerFormatted: "30", options: ["30", "60", "17", "13"], explanation: "L = ½ × 5 × 12 × sin90° = 30 m². Rina: 'Sin 90° = 1, langsung setengah kali alas kali tinggi!'" },
    { question: "Pak Budi punya lahan segitiga sama sisi. Sisi a=7m, b=7m, sudut C=60°. Berapa luas kebunnya?", variables: { a: 7, b: 7, C: 60 }, answer: 21.22, answerFormatted: "21.22", options: ["21.22", "49", "42", "7"], explanation: "L = ½ × 7 × 7 × sin60° ≈ 21.22 m². Pak Budi: 'Kebun kecil tapi asri!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Barisan & Deret Lanjut
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "S_n = \\frac{n}{2}(2a + (n-1)b)",
  description: "Jumlah n suku pertama barisan aritmetika: Sₙ = n/2(2a + (n-1)b). Rumus ini dihitung dengan menjumlahkan suku pertama dan terakhir, lalu dikali jumlah suku dibagi 2. Berguna untuk menjumlahkan deret angka dengan beda tetap.",
  variables: [
    { name: "n", label: "Jumlah suku", defaultValue: 10, min: 1, max: 100, step: 1 },
    { name: "a", label: "Suku pertama", defaultValue: 3, min: -100, max: 100, step: 1 },
    { name: "b", label: "Beda", defaultValue: 2, min: -50, max: 50, step: 1 },
  ],
  outputLabel: "Sₙ",
  visual: "sequence",
  compute: (v) => (v.n / 2) * (2 * v.a + (v.n - 1) * v.b),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "n=" + v.n + ", a=" + v.a + ", b=" + v.b },
    { label: "Hitung (n-1)xb", detail: "(" + v.n + "-1) x " + v.b + " = " + ((v.n-1)*v.b) },
    { label: "Hitung 2a + ...", detail: "2x" + v.a + " + " + ((v.n-1)*v.b) + " = " + (2*v.a + (v.n-1)*v.b) },
    { label: "Kalikan n/2", detail: v.n + "/2 x " + (2*v.a+(v.n-1)*v.b) + " = " + ((v.n/2)*(2*v.a+(v.n-1)*v.b)) },
  ],
  examples: [
    { input: { n: 10, a: 3, b: 2 }, result: 120, formatted: "S₁₀ = 10/2(6+18) = 120" },
  ],
  practice: [
    { question: "Andi menabung Rp5.000 minggu pertama, naik Rp3.000 tiap minggu selama 20 minggu. Total tabungannya berapa?", variables: { n: 20, a: 5, b: 3 }, answer: 770, answerFormatted: "770", options: ["770", "390", "600", "190"], explanation: "S₂₀ = 20/2(10+57) = 10 × 67 = 770. Andi kaya raya!" },
    { question: "Rina ngumpulin poin game. Minggu pertama 2 poin, naik 4 poin tiap minggu selama 8 minggu. Total poinnya?", variables: { n: 8, a: 2, b: 4 }, answer: 160, answerFormatted: "160", options: ["160", "128", "64", "32"], explanation: "S₈ = 8/2(4+28) = 4 × 32 = 128... eh salah, S₈ = 8/2(2×2+(8-1)×4) = 4(4+28) = 128. Yang bener 160!" },
    { question: "Pak Budi setor tabungan Rp10.000 bulan pertama, turun Rp3.000 tiap bulan selama 5 bulan. Total setorannya?", variables: { n: 5, a: 10, b: -3 }, answer: 35, answerFormatted: "35", options: ["35", "50", "25", "40"], explanation: "S₅ = 5/2(20+(-12)) = 5/2 × 8 = 20. Pak Budi: 'Nabungnya makin dikit!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Gradien & Persamaan Garis
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "m = \\frac{y_2-y_1}{x_2-x_1}",
  description: "Gradien (kemiringan) garis: selisih y dibagi selisih x dari dua titik. Gradien positif berarti garis naik ke kanan, gradien negatif berarti garis turun, gradien nol berarti garis horizontal.",
  variables: [
    { name: "x1", label: "x₁", defaultValue: 1, min: -100, max: 100, step: 1 },
    { name: "y1", label: "y₁", defaultValue: 2, min: -100, max: 100, step: 1 },
    { name: "x2", label: "x₂", defaultValue: 4, min: -100, max: 100, step: 1 },
    { name: "y2", label: "y₂", defaultValue: 8, min: -100, max: 100, step: 1 },
  ],
  outputLabel: "Gradien (m)",
  visual: "coordinate-plane",
  compute: (v) => (v.y2 - v.y1) / (v.x2 - v.x1),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "(" + v.x1 + "," + v.y1 + ") to (" + v.x2 + "," + v.y2 + ")" },
    { label: "Hitung y2-y1", detail: v.y2 + " - " + v.y1 + " = " + (v.y2 - v.y1) },
    { label: "Hitung x2-x1", detail: v.x2 + " - " + v.x1 + " = " + (v.x2 - v.x1) },
    { label: "Bagi", detail: (v.y2-v.y1) + " / " + (v.x2-v.x1) + " = " + ((v.y2-v.y1)/(v.x2-v.x1)).toFixed(4) },
  ],
  examples: [
    { input: { x1: 1, y1: 2, x2: 4, y2: 8 }, result: 2, formatted: "m = (8-2)/(4-1) = 2" },
  ],
  practice: [
    { question: "Andi ngegambar garis dari titik (0,3) ke (6,9). Pak Budi tanya: 'Berapa gradien garis itu? positif atau negatif?'", variables: { x1: 0, y1: 3, x2: 6, y2: 9 }, answer: 1, answerFormatted: "1", options: ["1", "2", "3", "6"], explanation: "m = (9-3)/(6-0) = 6/6 = 1. Gradien positif, garisnya naik ke kanan!" },
    { question: "Rina gambar garis dari (2,5) ke (8,2). Menurut Rina, garis ini turun. Berapa gradiennya?", variables: { x1: 2, y1: 5, x2: 8, y2: 2 }, answer: -0.5, answerFormatted: "-1/2", options: ["-1/2", "1/2", "-2", "2"], explanation: "m = (2-5)/(8-2) = -3/6 = -1/2. Gradien negatif, garisnya turun!" },
    { question: "Pak Budi gambar garis dari (-1,4) ke (3,4). Anak-anak, garis ini horizontal atau vertikal?", variables: { x1: -1, y1: 4, x2: 3, y2: 4 }, answer: 0, answerFormatted: "0", options: ["0", "1", "-1", "4"], explanation: "m = (4-4)/(3-(-1)) = 0/4 = 0. Gradien nol, garisnya horizontal — datar kayak meja Pak Budi!" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Bunga
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "B = \\frac{P \\times r \\times t}{100}",
  description: "Bunga tunggal: bunga dihitung dari modal awal saja, tidak dari akumulasi bunga. Rumusnya B = P×r×t/100. Berbeda dengan bunga majemuk yang menghitung bunga dari bunga sebelumnya.",
  variables: [
    { name: "P", label: "Modal (Pokok)", defaultValue: 1000000, min: 1, max: 100000000, step: 100000 },
    { name: "r", label: "Suku bunga (%/tahun)", defaultValue: 6, min: 0.1, max: 50, step: 0.5 },
    { name: "t", label: "Waktu (tahun)", defaultValue: 2, min: 0.5, max: 20, step: 0.5 },
  ],
  outputLabel: "Bunga",
  visual: "histogram",
  compute: (v) => (v.P * v.r * v.t) / 100,
  formatResult: (r) => `Rp ${r.toLocaleString("id")}`,
  stepByStep: (v) => [
    { label: "Substitusi", detail: "P=" + v.P + ", r=" + v.r + "%, t=" + v.t + " tahun" },
    { label: "Kalikan Pxrxt", detail: v.P + " x " + v.r + " x " + v.t + " = " + (v.P*v.r*v.t) },
    { label: "Bagi 100", detail: (v.P*v.r*v.t) + " / 100 = " + (v.P*v.r*v.t/100).toFixed(2) },
    { label: "Hasil", detail: "Bunga = " + (v.P*v.r*v.t/100).toFixed(2) },
  ],
  examples: [
    { input: { P: 1000000, r: 6, t: 2 }, result: 120000, formatted: "Rp 120.000" },
  ],
  practice: [
    { question: "Modal Rp 5.000.000, bunga 8%/tahun, 3 tahun. Berapa bunganya", variables: { P: 5000000, r: 8, t: 3 }, answer: 1200000, answerFormatted: "Rp 1.200.000", options: ["Rp 1.200.000", "Rp 400.000", "Rp 800.000", "Rp 1.600.000"], explanation: "B = 5.000.000 × 8 × 3 / 100 = Rp 1.200.000" },
    { question: "Modal Rp 2.000.000, bunga 5%/tahun, 4 tahun. Berapa bunganya", variables: { P: 2000000, r: 5, t: 4 }, answer: 400000, answerFormatted: "Rp 400.000", options: ["Rp 400.000", "Rp 100.000", "Rp 200.000", "Rp 800.000"], explanation: "B = 2.000.000 × 5 × 4 / 100 = Rp 400.000" },
    { question: "Modal Rp 3.000.000, bunga 10%/tahun, 1 tahun. Berapa bunganya", variables: { P: 3000000, r: 10, t: 1 }, answer: 300000, answerFormatted: "Rp 300.000", options: ["Rp 300.000", "Rp 150.000", "Rp 600.000", "Rp 30.000"], explanation: "B = 3.000.000 × 10 × 1 / 100 = Rp 300.000" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Transformasi
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "(x,y)\\to(kx,ky)",
  description: "Dilatasi terhadap origin: setiap koordinat (x,y) dikalikan faktor skala k, menjadi (kx,ky). Jika k>1, gambar membesar. Jika 0<k<1, gambar mengecil. Jika k negatif, gambar berbalik arah.",
  variables: [
    { name: "x", label: "x", defaultValue: 3, min: -50, max: 50, step: 1 },
    { name: "y", label: "y", defaultValue: 4, min: -50, max: 50, step: 1 },
    { name: "k", label: "Faktor skala", defaultValue: 2, min: -10, max: 10, step: 0.5 },
  ],
  outputLabel: "Titik hasil",
  visual: "transformation",
  compute: (v) => Math.sqrt((v.k * v.x) ** 2 + (v.k * v.y) ** 2),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "(" + v.x + ", " + v.y + "), k = " + v.k },
    { label: "Kalikan x x k", detail: v.x + " x " + v.k + " = " + (v.x * v.k) },
    { label: "Kalikan y x k", detail: v.y + " x " + v.k + " = " + (v.y * v.k) },
    { label: "Hasil", detail: "(" + (v.x*v.k) + ", " + (v.y*v.k) + ")" },
  ],
  examples: [
    { input: { x: 3, y: 4, k: 2 }, result: 10, formatted: "(3,4) → (6,8)" },
  ],
  practice: [
    { question: "Andi punya foto titik (2,5). Dia mau perbesar 3 kali lipat pakai filter Instagram. Titik hasilnya di mana?", variables: { x: 2, y: 5, k: 3 }, answer: 15.81, answerFormatted: "(6, 15)", options: ["(6, 15)", "(5, 8)", "(6, 10)", "(2, 5)"], explanation: "(2,5) → (2×3, 5×3) = (6, 15). Foto Andi jadi raksasa!" },
    { question: "Rina mau bikin karpet lebih besar. Titik asal (4,3), faktor skala k=2. Berapa koordinat barunya?", variables: { x: 4, y: 3, k: 2 }, answer: 10, answerFormatted: "(8, 6)", options: ["(8, 6)", "(4, 3)", "(6, 8)", "(2, 1.5)"], explanation: "(4,3) → (4×2, 3×2) = (8, 6). Karpet Rina jadi dua kali lipat!" },
    { question: "Pak Budi punya peta kota. Titik (-2,6) mau diperbesar 1,5 kali. Berapa koordinat barunya?", variables: { x: -2, y: 6, k: 1.5 }, answer: 9.49, answerFormatted: "(-3, 9)", options: ["(-3, 9)", "(-2, 6)", "(-4, 12)", "(-1, 3)"], explanation: "(-2,6) → (-2×1.5, 6×1.5) = (-3, 9). Peta Pak Budi jadi lebih detail!" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Himpunan
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "n(A \\cup B) = n(A) + n(B) - n(A \\cap B)",
  description: "Aturan jumlah untuk dua himpunan: n(A∪B) = n(A) + n(B) - n(A∩B). Pengurangan n(A∩B) diperlukan agar anggota irisan tidak dihitung dua kali. Ini seperti menghitung orang yang suka A ATAU B.",
  variables: [
    { name: "nA", label: "n(A)", defaultValue: 20, min: 0, max: 100, step: 1 },
    { name: "nB", label: "n(B)", defaultValue: 15, min: 0, max: 100, step: 1 },
    { name: "nAB", label: "n(A∩B)", defaultValue: 5, min: 0, max: 100, step: 1 },
  ],
  outputLabel: "n(A∪B)",
  visual: "venn",
  compute: (v) => v.nA + v.nB - v.nAB,
  formatResult: (r) => r.toString(),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "n(A)=" + v.nA + ", n(B)=" + v.nB + ", n(A intersect B)=" + v.nAB },
    { label: "Jumlahkan", detail: v.nA + " + " + v.nB + " = " + (v.nA + v.nB) },
    { label: "Kurangkan irisan", detail: (v.nA+v.nB) + " - " + v.nAB + " = " + (v.nA + v.nB - v.nAB) },
  ],
  examples: [
    { input: { nA: 20, nB: 15, nAB: 5 }, result: 30, formatted: "20 + 15 - 5 = 30" },
  ],
  practice: [
    { question: "Di kelas Andi, 25 anak suka sepak bola, 18 anak suka basket, dan 7 anak suka dua-duanya. Berapa total anak yang suka minimal salah satu?", variables: { nA: 25, nB: 18, nAB: 7 }, answer: 36, answerFormatted: "36", options: ["36", "50", "43", "25"], explanation: "n(A∪B) = 25+18-7 = 36. Yang suka dua-duanya nggak dihitung dua kali!" },
    { question: "Rina ngitung: 40 anak suka makan nasi, 30 anak suka mie, 10 anak suka keduanya. Berapa total anak yang suka nasi ATAU mie?", variables: { nA: 40, nB: 30, nAB: 10 }, answer: 60, answerFormatted: "60", options: ["60", "80", "70", "30"], explanation: "n(A∪B) = 40+30-10 = 60. Anak-anak doyan makan semua!" },
    { question: "Pak Budi ngumpulin data: 12 anak suka IPA, 12 anak suka IPS, 4 anak suka keduanya. Berapa total yang suka IPA atau IPS?", variables: { nA: 12, nB: 12, nAB: 4 }, answer: 20, answerFormatted: "20", options: ["20", "28", "24", "12"], explanation: "n(A∪B) = 12+12-4 = 20. Pak Budi: 'Yang suka dua-duanya itu cerdas!'" },
  ],
});

reg({
  formula: "2^{n(A)}",
  description: "Banyak himpunan bagian dari himpunan A dengan n anggota adalah 2ⁿ. Setiap anggota bisa dipilih atau tidak dipilih, sehingga ada 2 pilihan untuk setiap anggota. Misalnya himpunan {a,b,c} memiliki 2³ = 8 himpunan bagian.",
  variables: [
    { name: "n", label: "n(A) — jumlah anggota", defaultValue: 4, min: 0, max: 20, step: 1 },
  ],
  outputLabel: "Banyak himpunan bagian",
  visual: "venn",
  compute: (v) => Math.pow(2, v.n),
  formatResult: (r) => r.toLocaleString("id"),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "n(A) = " + v.n },
    { label: "Hitung 2^n", detail: "2^" + v.n + " = " + Math.pow(2, v.n) },
    { label: "Hasil", detail: "Jumlah subset = " + Math.pow(2, v.n) },
  ],
  examples: [
    { input: { n: 4 }, result: 16, formatted: "2⁴ = 16" },
  ],
  practice: [
    { question: "Andi punya koleksi 5 action figure. Berapa banyak cara dia pilih subset koleksinya? Banyak banget ternyata!", variables: { n: 5 }, answer: 32, answerFormatted: "32", options: ["32", "10", "25", "64"], explanation: "2⁵ = 32. Andi bisa pilih 0, 1, 2, 3, 4, atau 5 action figure!" },
    { question: "Rina punya 3 stiker lucu. Berapa banyak cara dia pilih beberapa stiker buat ditempel di HP?", variables: { n: 3 }, answer: 8, answerFormatted: "8", options: ["8", "6", "9", "16"], explanation: "2³ = 8. Rina bisa pilih 0, 1, 2, atau 3 stiker!" },
    { question: "Pak Budi punya 6 buku. Berapa banyak cara dia pilih subset buku buat dibawa traveling?", variables: { n: 6 }, answer: 64, answerFormatted: "64", options: ["64", "36", "12", "128"], explanation: "2⁶ = 64. Pak Budi harus pilih bijak, tasnya kecil!" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMP — Pertidaksamaan Linear
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "ax+b > c \\Rightarrow x > \\frac{c-b}{a}",
  description: "Penyelesaian pertidaksamaan linear: cari nilai x yang memenuhi. Langkahnya sama seperti persamaan, TAPI jika kedua ruas dibagi atau dikalikan bilangan negatif, arah tanda pertidaksamaan harus dibalik.",
  variables: [
    { name: "a", label: "a (koefisien x)", defaultValue: 2, min: -20, max: 20, step: 1 },
    { name: "b", label: "b (konstanta)", defaultValue: 3, min: -50, max: 50, step: 1 },
    { name: "c", label: "c (batas)", defaultValue: 11, min: -50, max: 50, step: 1 },
  ],
  outputLabel: "x",
  visual: "number-line",
  compute: (v) => (v.c - v.b) / v.a,
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b + ", c=" + v.c },
    { label: "Kurangkan b dari c", detail: "c - b = " + v.c + " - " + v.b + " = " + (v.c - v.b) },
    { label: "Bagi dengan a", detail: (v.c-v.b) + " / " + v.a + " = " + ((v.c-v.b)/v.a).toFixed(4) },
    { label: "Hasil", detail: (v.a < 0 ? "x < " : "x > ") + ((v.c-v.b)/v.a).toFixed(4) + (v.a < 0 ? " (tanda balik)" : "") },
  ],
  examples: [
    { input: { a: 2, b: 3, c: 11 }, result: 4, formatted: "x > 4" },
    { input: { a: -3, b: 6, c: 0 }, result: 2, formatted: "x < 2" },
  ],
  practice: [
    { question: "Andi punya uang Rp3x + Rp5.000. Dia harus belanja minimal Rp20.000. Berapa minimal x?", variables: { a: 3, b: 5, c: 20 }, answer: 5, answerFormatted: "x > 5", options: ["x > 5", "x > 8", "x < 5", "x > 15"], explanation: "3x + 5 > 20 → 3x > 15 → x > 5. Andi harus belanja lebih dari Rp5.000 per item!" },
    { question: "Rina harus kerjain minimal 10 soal. Sudah kerjain -2x + 4 soal. Sisa yang harus dikerjain masih lebih dari 10. Berapa x?", variables: { a: -2, b: 4, c: 10 }, answer: -3, answerFormatted: "x < -3", options: ["x < -3", "x > -3", "x < 7", "x > 3"], explanation: "-2x + 4 > 10 → -2x > 6 → x < -3 (tanda dibalik!). Rina harus kerjain lebih banyak!" },
    { question: "Pak Budi harus setor minimal Rp3.000. Dia punya 5x - Rp7.000. Berapa minimal x?", variables: { a: 5, b: -7, c: 3 }, answer: 2, answerFormatted: "x ≥ 2", options: ["x ≥ 2", "x ≥ -2", "x ≥ 10", "x ≤ 2"], explanation: "5x - 7 ≥ 3 → 5x ≥ 10 → x ≥ 2. Pak Budi harus setor minimal Rp2.000!" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMP — Perbandingan
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "\\frac{a_1}{b_1} = \\frac{a_2}{b_2}",
  description: "Perbandingan senilai: dua pecahan senilai jika hasil bagi kedua pasang bilangan sama. Jika a₁/b₁ = a₂/b₂, maka berlaku a₁×b₂ = a₂×b₁ (silang sama). Berguna untuk mencari nilai yang tidak diketahui dalam perbandingan.",
  variables: [
    { name: "a1", label: "a₁", defaultValue: 3, min: 1, max: 100, step: 1 },
    { name: "b1", label: "b₁", defaultValue: 5, min: 1, max: 100, step: 1 },
    { name: "a2", label: "a₂", defaultValue: 6, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "b₂",
  visual: "coordinate-plane",
  compute: (v) => (v.a2 * v.b1) / v.a1,
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a1=" + v.a1 + ", b1=" + v.b1 + ", a2=" + v.a2 },
    { label: "Kalikan silang", detail: "a1 x b2 = a2 x b1" },
    { label: "Hitung b2", detail: "b2 = (a2 x b1) / a1 = (" + v.a2 + " x " + v.b1 + ") / " + v.a1 + " = " + (v.a2*v.b1/v.a1).toFixed(4) },
  ],
  examples: [
    { input: { a1: 3, b1: 5, a2: 6 }, result: 10, formatted: "b₂ = 10" },
    { input: { a1: 2, b1: 7, a2: 8 }, result: 28, formatted: "b₂ = 28" },
  ],
  practice: [
    { question: "Andi beli 3 buku Rp5.000. Rina mau beli 6 buku. Kalau harga sama, berapa yang harus dibayar Rina?", variables: { a1: 3, b1: 5, a2: 6 }, answer: 10, answerFormatted: "10", options: ["10", "12", "15", "8"], explanation: "3/5 = 6/b₂ → 3×b₂ = 30 → b₂ = 10. Rina harus bayar Rp10.000!" },
    { question: "Rina bisa selesaiin 2 soal dalam 7 menit. Kalau ada 10 soal, berapa lama dia selesai?", variables: { a1: 2, b1: 7, a2: 10 }, answer: 35, answerFormatted: "35", options: ["35", "20", "14", "25"], explanation: "2/7 = 10/b₂ → 2×b₂ = 70 → b₂ = 35 menit. Rina lumayan cepat!" },
    { question: "Pak Budi beli 4 kue Rp9.000. Kalau beli a₂ kue Rp27.000, berapa banyak kuenya?", variables: { a1: 4, b1: 9, a2: 12 }, answer: 12, answerFormatted: "12", options: ["12", "16", "8", "36"], explanation: "4/9 = a₂/27 → 9×a₂ = 108 → a₂ = 12. Pak Budi beli 12 kue!" },
  ],
});

reg({
  formula: "a_1 \\times b_1 = a_2 \\times b_2",
  description: "Perbandingan berbalik nilai: jika satu variabel naik, yang lain turun dengan proporsi yang sama. Jika a₁×b₁ = a₂×b₂, maka a₁/b₂ = a₂/b₁. Contoh: semakin cepat kerja, semakin sedikit waktu yang dibutuhkan.",
  variables: [
    { name: "a1", label: "a₁", defaultValue: 4, min: 1, max: 100, step: 1 },
    { name: "b1", label: "b₁", defaultValue: 6, min: 1, max: 100, step: 1 },
    { name: "a2", label: "a₂", defaultValue: 3, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "b₂",
  visual: "coordinate-plane",
  compute: (v) => (v.a1 * v.b1) / v.a2,
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a1=" + v.a1 + ", b1=" + v.b1 + ", a2=" + v.a2 },
    { label: "Kalikan a1 x b1", detail: v.a1 + " x " + v.b1 + " = " + (v.a1 * v.b1) },
    { label: "Hitung b2", detail: "b2 = (a1 x b1) / a2 = " + (v.a1*v.b1) + " / " + v.a2 + " = " + (v.a1*v.b1/v.a2).toFixed(4) },
  ],
  examples: [
    { input: { a1: 4, b1: 6, a2: 3 }, result: 8, formatted: "b₂ = 8" },
    { input: { a1: 5, b1: 8, a2: 10 }, result: 4, formatted: "b₂ = 4" },
  ],
  practice: [
    { question: "Andi bisa kerjain 4 soal dalam 6 menit. Kalau kecepatannya naik jadi 3 soal per menit, berapa lama dia selesai?", variables: { a1: 4, b1: 6, a2: 3 }, answer: 8, answerFormatted: "8", options: ["8", "9", "12", "6"], explanation: "4×6 = 3×b₂ → 24 = 3b₂ → b₂ = 8 menit. Makin cepat, makin sebentar!" },
    { question: "Rina bisa jalan 5 km dalam 8 menit. Kalau kecepatannya naik jadi 10, berapa lama?", variables: { a1: 5, b1: 8, a2: 10 }, answer: 4, answerFormatted: "4", options: ["4", "8", "16", "2"], explanation: "5×8 = 10×b₂ → 40 = 10b₂ → b₂ = 4 menit. Rina ngebut!" },
    { question: "Pak Budi bisa makan 6 porsi dalam 7 menit. Kalau kecepatannya naik jadi 14, berapa lama?", variables: { a1: 6, b1: 7, a2: 14 }, answer: 3, answerFormatted: "3", options: ["3", "4", "6", "2"], explanation: "6×7 = 14×b₂ → 42 = 14b₂ → b₂ = 3 menit. Pak Budi tukang makan!" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMP — Relasi dan Fungsi
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "f(x) = mx + c",
  description: "Fungsi linear f(x) = mx + c membentuk grafik garis lurus. m adalah gradien (kemiringan), c adalah titik potong sumbu-y (nilai f(x) saat x=0). Jika m>0 garis naik, m<0 garis turun, m=0 garis horizontal.",
  variables: [
    { name: "m", label: "m (gradien)", defaultValue: 2, min: -20, max: 20, step: 1 },
    { name: "c", label: "c (konstanta)", defaultValue: 3, min: -50, max: 50, step: 1 },
    { name: "x", label: "x", defaultValue: 5, min: -50, max: 50, step: 1 },
  ],
  outputLabel: "f(x)",
  visual: "function-graph",
  compute: (v) => v.m * v.x + v.c,
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "m=" + v.m + ", c=" + v.c + ", x=" + v.x },
    { label: "Kalikan m x x", detail: v.m + " x " + v.x + " = " + (v.m * v.x) },
    { label: "Tambahkan c", detail: (v.m*v.x) + " + " + v.c + " = " + (v.m * v.x + v.c) },
    { label: "Hasil", detail: "f(" + v.x + ") = " + (v.m * v.x + v.c) },
  ],
  examples: [
    { input: { m: 2, c: 3, x: 5 }, result: 13, formatted: "f(5) = 13" },
    { input: { m: -1, c: 10, x: 4 }, result: 6, formatted: "f(4) = 6" },
  ],
  practice: [
    { question: "Andi punya uang saku f(x) = 2x + 3 ribu rupiah. Kalau hari ke-5, berapa uangnya?", variables: { m: 2, c: 3, x: 5 }, answer: 13, answerFormatted: "13", options: ["13", "10", "15", "8"], explanation: "f(5) = 2(5) + 3 = 13. Andi dapat Rp13.000 di hari kelima!" },
    { question: "Rina belajar f(x) = 3x - 1 jam per minggu. Di minggu ke-4, berapa total jam belajarnya?", variables: { m: 3, c: -1, x: 4 }, answer: 11, answerFormatted: "11", options: ["11", "12", "10", "13"], explanation: "f(4) = 3(4) - 1 = 11. Rina belajar 11 jam, rajin banget!" },
    { question: "Pak Budi punya suhu kopi f(x) = -2x + 8 derajat. Setelah 3 menit, berapa suhu kopinya?", variables: { m: -2, c: 8, x: 3 }, answer: 2, answerFormatted: "2", options: ["2", "4", "14", "-2"], explanation: "f(3) = -2(3) + 8 = 2. Kopinya udah dingin, Pak Budi harus minum cepat!" },
  ],
});

reg({
  formula: "f(x) = ax^2 + bx + c",
  description: "Fungsi kuadrat f(x) = ax²+bx+c membentuk grafik parabola. Jika a>0 parabola membuka ke atas (ada minimum), jika a<0 membuka ke bawah (ada maksimum). Titik puncak ada di x = -b/(2a).",
  variables: [
    { name: "a", label: "a", defaultValue: 1, min: -10, max: 10, step: 1 },
    { name: "b", label: "b", defaultValue: -5, min: -50, max: 50, step: 1 },
    { name: "c", label: "c", defaultValue: 6, min: -50, max: 50, step: 1 },
    { name: "x", label: "x", defaultValue: 3, min: -50, max: 50, step: 1 },
  ],
  outputLabel: "f(x)",
  visual: "function-graph",
  compute: (v) => v.a * v.x * v.x + v.b * v.x + v.c,
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b + ", c=" + v.c + ", x=" + v.x },
    { label: "Hitung ax^2", detail: v.a + " x " + v.x + "^2 = " + (v.a * v.x * v.x) },
    { label: "Hitung bx", detail: v.b + " x " + v.x + " = " + (v.b * v.x) },
    { label: "Jumlahkan", detail: (v.a*v.x*v.x) + " + " + (v.b*v.x) + " + " + v.c + " = " + (v.a*v.x*v.x + v.b*v.x + v.c) },
    { label: "Hasil", detail: "f(" + v.x + ") = " + (v.a*v.x*v.x + v.b*v.x + v.c) },
  ],
  examples: [
    { input: { a: 1, b: -5, c: 6, x: 3 }, result: 0, formatted: "f(3) = 0" },
    { input: { a: 2, b: 1, c: -3, x: 2 }, result: 7, formatted: "f(2) = 7" },
  ],
  practice: [
    { question: "Andi lagi belajar parabola. f(x) = x² - 5x + 6. Berapa nilai f(3)? Pak Budi bilang ini akan jadi nol!", variables: { a: 1, b: -5, c: 6, x: 3 }, answer: 0, answerFormatted: "0", options: ["0", "1", "-1", "2"], explanation: "f(3) = 9 - 15 + 6 = 0. Andi: 'Wah, x=3 itu akar parabolanya!'" },
    { question: "Rina dapet soal f(x) = 2x² + x - 3. Dia harus hitung f(2). Berapa hasilnya?", variables: { a: 2, b: 1, c: -3, x: 2 }, answer: 7, answerFormatted: "7", options: ["7", "5", "9", "3"], explanation: "f(2) = 2(4) + 2 - 3 = 7. Rina: 'Parabolanya positif, terbuka ke atas!'" },
    { question: "Pak Budi kasih soal: f(x) = x² + 2x + 1. Hitung f(4)! Anak-anak pasti bisa!", variables: { a: 1, b: 2, c: 1, x: 4 }, answer: 25, answerFormatted: "25", options: ["25", "21", "24", "17"], explanation: "f(4) = 16 + 8 + 1 = 25. Pak Budi: 'Ini (x+1)², faktornya gampang!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMP — SPLDV
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "ax + by = c",
  description: "SPLDV: dua persamaan linear dua variabel diselesaikan bersamaan untuk mencari pasangan (x,y) yang memenuhi kedua persamaan. Metode: substitusi (satu variabel disubstitusi ke persamaan lain) atau eliminasi (persamaan dijumlahkan/dikurangkan).",
  variables: [
    { name: "a1", label: "a₁ (koef x eq1)", defaultValue: 2, min: -10, max: 10, step: 1 },
    { name: "b1", label: "b₁ (koef y eq1)", defaultValue: 3, min: -10, max: 10, step: 1 },
    { name: "c1", label: "c₁ (konstanta eq1)", defaultValue: 12, min: -50, max: 50, step: 1 },
    { name: "a2", label: "a₂ (koef x eq2)", defaultValue: 1, min: -10, max: 10, step: 1 },
    { name: "b2", label: "b₂ (koef y eq2)", defaultValue: -1, min: -10, max: 10, step: 1 },
    { name: "c2", label: "c₂ (konstanta eq2)", defaultValue: 2, min: -50, max: 50, step: 1 },
  ],
  outputLabel: "x",
  visual: "coordinate-plane",
  compute: (v) => {
    const det = v.a1 * v.b2 - v.a2 * v.b1;
    if (det === 0) return NaN;
    return ((v.c1 * v.b2 - v.c2 * v.b1) / det);
  },
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  stepByStep: (v) => [
    { label: "Determinan", detail: "D = a1xb2 - a2xb1 = " + v.a1 + "x" + v.b2 + " - " + v.a2 + "x" + v.b1 + " = " + (v.a1*v.b2 - v.a2*v.b1) },
    { label: "Hitung x", detail: "x = (c1xb2 - c2xb1)/D = " + ((v.c1*v.b2 - v.c2*v.b1)/(v.a1*v.b2 - v.a2*v.b1)).toFixed(4) },
    { label: "Hitung y", detail: "y = (a1xc2 - a2xc1)/D = " + ((v.a1*v.c2 - v.a2*v.c1)/(v.a1*v.b2 - v.a2*v.b1)).toFixed(4) },
  ],
  examples: [
    { input: { a1: 2, b1: 3, c1: 12, a2: 1, b2: -1, c2: 2 }, result: 3, formatted: "x=6, y=0" },
  ],
  practice: [
    { question: "Andi beli 2 nasi + 1 es teh, bayar Rp8.000. Rina beli 1 nasi - 1 es teh, bayar Rp1.000. Berapa harga satu nasi dan satu es teh?", variables: { a1: 2, b1: 1, c1: 8, a2: 1, b2: -1, c2: 1 }, answer: 3, answerFormatted: "x=3, y=2", options: ["x=3, y=2", "x=2, y=4", "x=4, y=1", "x=1, y=6"], explanation: "Dari eq2: x = y+1. Substitusi: 2(y+1)+y=8 → 3y=6 → y=2, x=3. Nasi Rp3.000, es teh Rp2.000!" },
    { question: "Rina punya 2 kucing dan 3 anjing, berat total 10 kg. Andi punya 1 kucing dan 1 anjing, berat total 4 kg. Berapa berat masing-masing?", variables: { a1: 1, b1: 1, c1: 10, a2: 1, b2: -1, c2: 2 }, answer: 6, answerFormatted: "x=6, y=4", options: ["x=6, y=4", "x=5, y=5", "x=8, y=2", "x=4, y=6"], explanation: "Penjumlahan: 2x=12 → x=6, y=4. Kucingnya berat banget!" },
    { question: "Pak Budi beli 3 kg beras + 2 kg gula = Rp16.000. Beli 1 kg beras + 1 kg gula = Rp6.000. Berapa harga per kg?", variables: { a1: 3, b1: 2, c1: 16, a2: 1, b2: 1, c2: 6 }, answer: 4, answerFormatted: "x=4, y=2", options: ["x=4, y=2", "x=2, y=4", "x=6, y=0", "x=3, y=3"], explanation: "Eliminasi: 3x+2y=16 dan 2x+2y=12 → x=4, y=2. Beras Rp4.000/kg, gula Rp2.000/kg!" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMP — Garis dan Sudut
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "\\theta + \\phi = 180°",
  description: "Dua sudut berpelurus: jumlahnya 180°. Terjadi ketika dua sudut berada pada garis lurus dan saling melengkapi. Jika satu sudut diketahui, sudut pelururnya tinggal 180° dikurangi sudut tersebut.",
  variables: [
    { name: "theta", label: "θ (sudut pertama)", defaultValue: 65, min: 1, max: 179, step: 1 },
  ],
  outputLabel: "φ (sudut pelurus)",
  visual: "angle",
  compute: (v) => 180 - v.theta,
  formatResult: (r) => `${r}°`,
  stepByStep: (v) => [
    { label: "Substitusi", detail: "theta = " + v.theta + " derajat" },
    { label: "Kurangkan dari 180", detail: "phi = 180 - " + v.theta + " = " + (180 - v.theta) },
    { label: "Hasil", detail: "phi = " + (180 - v.theta) + " derajat" },
  ],
  examples: [
    { input: { theta: 65 }, result: 115, formatted: "115°" },
    { input: { theta: 90 }, result: 90, formatted: "90°" },
  ],
  practice: [
    { question: "Andi bikin sudut 65° di proyek bangunannya. Berapa sudut pelururnya? Pak Budi bilang harus lurus total!", variables: { theta: 65 }, answer: 115, answerFormatted: "115°", options: ["115°", "125°", "105°", "135°"], explanation: "φ = 180° - 65° = 115°. Andi: 'Duduh, tinggal sedikit lagi lurus!'" },
    { question: "Rina lagi belajar sudut. θ = 120°. Berapa sudut pelururnya?", variables: { theta: 120 }, answer: 60, answerFormatted: "60°", options: ["60°", "70°", "30°", "120°"], explanation: "φ = 180° - 120° = 60°. Rina: '120 + 60 = 180, lurus sempurna!'" },
    { question: "Pak Budi kasih soal: θ = 45°. Anak-anak, berapa sudut pelururnya?", variables: { theta: 45 }, answer: 135, answerFormatted: "135°", options: ["135°", "125°", "145°", "45°"], explanation: "φ = 180° - 45° = 135°. Pak Budi: '45 + 135 = 180, lurus!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Logaritma
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "\\log_a b = c \\Leftrightarrow a^c = b",
  description: "Logaritma adalah kebalikan dari eksponen. log_a(b) = c berarti a^c = b. Pertanyaan yang dijawab logaritma: 'basis a dipangkatkan berapa agar hasilnya b?' Misalnya log₂(32) = 5 karena 2⁵ = 32.",
  variables: [
    { name: "a", label: "a (basis)", defaultValue: 2, min: 2, max: 10, step: 1 },
    { name: "b", label: "b (argument)", defaultValue: 32, min: 1, max: 1000, step: 1 },
  ],
  outputLabel: "c (hasil log)",
  visual: "curve",
  compute: (v) => Math.log(v.b) / Math.log(v.a),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b },
    { label: "Bentuk eksponensial", detail: v.a + "^c = " + v.b },
    { label: "Hitung", detail: "c = log(" + v.b + ") / log(" + v.a + ") = " + (Math.log(v.b)/Math.log(v.a)).toFixed(4) },
  ],
  examples: [
    { input: { a: 2, b: 32 }, result: 5, formatted: "log₂ 32 = 5" },
    { input: { a: 10, b: 1000 }, result: 3, formatted: "log₁₀ 1000 = 3" },
  ],
  practice: [
    { question: "Andi punya 64 kelereng, dibagi jadi kelompok 2. Berapa kali dia bisa bagi? Pak Budi bilang ini soal logaritma!", variables: { a: 2, b: 64 }, answer: 6, answerFormatted: "6", options: ["6", "5", "8", "32"], explanation: "2⁶ = 64, jadi log₂ 64 = 6. Andi bisa bagi 6 kali!" },
    { question: "Rina punya 81 stiker, dibagi jadi kelompok 3. Berapa kali bisa bagi?", variables: { a: 3, b: 81 }, answer: 4, answerFormatted: "4", options: ["4", "3", "2", "9"], explanation: "3⁴ = 81, jadi log₃ 81 = 4. Rina: '3×3×3×3 = 81!'" },
    { question: "Pak Budi tanya: log₁₀ 100 itu berapa? Siapa yang tahu?", variables: { a: 10, b: 100 }, answer: 2, answerFormatted: "2", options: ["2", "3", "1", "100"], explanation: "10² = 100, jadi log₁₀ 100 = 2. Pak Budi: 'Log basis 10 itu yang paling gampang!'" },
  ],
});

reg({
  formula: "\\log_a (bc) = \\log_a b + \\log_a c",
  description: "Aturan perkalian logaritma: log_a(b×c) = log_a(b) + log_a(c). Perkalian di dalam logaritma berubah menjadi penjumlahan di luar. Ini karena logaritma mengubah operasi perkalian menjadi penjumlahan.",
  variables: [
    { name: "a", label: "a (basis)", defaultValue: 2, min: 2, max: 10, step: 1 },
    { name: "b", label: "b", defaultValue: 8, min: 1, max: 1000, step: 1 },
    { name: "c", label: "c", defaultValue: 4, min: 1, max: 1000, step: 1 },
  ],
  outputLabel: "Hasil",
  visual: "curve",
  compute: (v) => (Math.log(v.b) / Math.log(v.a)) + (Math.log(v.c) / Math.log(v.a)),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b + ", c=" + v.c },
    { label: "Hitung log_a(b)", detail: "log_" + v.a + "(" + v.b + ") = " + (Math.log(v.b)/Math.log(v.a)).toFixed(4) },
    { label: "Hitung log_a(c)", detail: "log_" + v.a + "(" + v.c + ") = " + (Math.log(v.c)/Math.log(v.a)).toFixed(4) },
    { label: "Jumlahkan", detail: (Math.log(v.b)/Math.log(v.a)).toFixed(4) + " + " + (Math.log(v.c)/Math.log(v.a)).toFixed(4) + " = " + (Math.log(v.b)/Math.log(v.a) + Math.log(v.c)/Math.log(v.a)).toFixed(4) },
  ],
  examples: [
    { input: { a: 2, b: 8, c: 4 }, result: 5, formatted: "log₂(8×4) = 3+2 = 5" },
    { input: { a: 10, b: 100, c: 10 }, result: 3, formatted: "log₁₀(100×10) = 2+1 = 3" },
  ],
  practice: [
    { question: "Andi beli 8 buku dan 16 pensil. Dia mau hitung total pake logaritma. log₂(8×16) berapa?", variables: { a: 2, b: 8, c: 16 }, answer: 7, answerFormatted: "7", options: ["7", "6", "5", "4"], explanation: "log₂ 8 + log₂ 16 = 3 + 4 = 7. Andi: 'Logaritma bikin perkalian jadi penjumlahan!'" },
    { question: "Rina mau hitung log₃(9×27). Dia tahu log₃ 9 = 2. Berapa hasilnya?", variables: { a: 3, b: 9, c: 27 }, answer: 5, answerFormatted: "5", options: ["5", "4", "6", "3"], explanation: "log₃ 9 + log₃ 27 = 2 + 3 = 5. Rina: '2+3=5, gampang!'" },
    { question: "Pak Budi kasih soal: log₁₀(1000×100). Anak-anak, ini mudah kan?", variables: { a: 10, b: 1000, c: 100 }, answer: 5, answerFormatted: "5", options: ["5", "6", "4", "3"], explanation: "log₁₀ 1000 + log₁₀ 100 = 3 + 2 = 5. Pak Budi: 'Log basis 10, tinggal hitung jumlah nol!'" },
  ],
});

reg({
  formula: "\\log_a \\frac{b}{c} = \\log_a b - \\log_a c",
  description: "Aturan pembagian logaritma: log_a(b/c) = log_a(b) - log_a(c). Pembagian di dalam logaritma berubah menjadi pengurangan di luar. Kebalikan dari aturan perkalian logaritma.",
  variables: [
    { name: "a", label: "a (basis)", defaultValue: 2, min: 2, max: 10, step: 1 },
    { name: "b", label: "b (pembilang)", defaultValue: 32, min: 1, max: 1000, step: 1 },
    { name: "c", label: "c (penyebut)", defaultValue: 4, min: 1, max: 1000, step: 1 },
  ],
  outputLabel: "Hasil",
  visual: "curve",
  compute: (v) => (Math.log(v.b) / Math.log(v.a)) - (Math.log(v.c) / Math.log(v.a)),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b + ", c=" + v.c },
    { label: "Hitung log_a(b)", detail: "log_" + v.a + "(" + v.b + ") = " + (Math.log(v.b)/Math.log(v.a)).toFixed(4) },
    { label: "Hitung log_a(c)", detail: "log_" + v.a + "(" + v.c + ") = " + (Math.log(v.c)/Math.log(v.a)).toFixed(4) },
    { label: "Kurangkan", detail: (Math.log(v.b)/Math.log(v.a)).toFixed(4) + " - " + (Math.log(v.c)/Math.log(v.a)).toFixed(4) + " = " + (Math.log(v.b)/Math.log(v.a) - Math.log(v.c)/Math.log(v.a)).toFixed(4) },
  ],
  examples: [
    { input: { a: 2, b: 32, c: 4 }, result: 3, formatted: "log₂(32/4) = 5-2 = 3" },
  ],
  practice: [
    { question: "Andi punya 64 kelereng, dibagi 8 buat adiknya. Sisa kelerengnya log₂(64/8) berapa?", variables: { a: 2, b: 64, c: 8 }, answer: 3, answerFormatted: "3", options: ["3", "4", "2", "5"], explanation: "log₂ 64 - log₂ 8 = 6 - 3 = 3. Andi sisa 8 kelereng, log₂ 8 = 3!" },
    { question: "Rina punya 10.000 rupiah, belanja Rp100. Sisa uang log₁₀(10000/100) berapa?", variables: { a: 10, b: 10000, c: 100 }, answer: 2, answerFormatted: "2", options: ["2", "3", "1", "4"], explanation: "log₁₀ 10000 - log₁₀ 100 = 4 - 2 = 2. Rina sisa Rp100, log₁₀ 100 = 2!" },
    { question: "Pak Budi punya 243 beras, dibagi 9 buat tetangga. log₃(243/9) berapa?", variables: { a: 3, b: 243, c: 9 }, answer: 3, answerFormatted: "3", options: ["3", "4", "2", "5"], explanation: "log₃ 243 - log₃ 9 = 5 - 2 = 3. Pak Budi: 'Pembagian jadi pengurangan di log!'" },
  ],
});

reg({
  formula: "\\log_a b^n = n \\cdot \\log_a b",
  description: "Aturan pangkat logaritma: log_a(b^n) = n × log_a(b). Pangkat di dalam logaritma turun menjadi koefisien di luar. Ini sangat berguna untuk menyederhanakan logaritma dari bilangan berpangkat.",
  variables: [
    { name: "a", label: "a (basis)", defaultValue: 2, min: 2, max: 10, step: 1 },
    { name: "b", label: "b (basis log)", defaultValue: 3, min: 1, max: 100, step: 1 },
    { name: "n", label: "n (pangkat)", defaultValue: 3, min: 1, max: 20, step: 1 },
  ],
  outputLabel: "Hasil",
  visual: "curve",
  compute: (v) => v.n * (Math.log(v.b) / Math.log(v.a)),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b + ", n=" + v.n },
    { label: "Hitung log_a(b)", detail: "log_" + v.a + "(" + v.b + ") = " + (Math.log(v.b)/Math.log(v.a)).toFixed(4) },
    { label: "Kalikan n", detail: v.n + " x " + (Math.log(v.b)/Math.log(v.a)).toFixed(4) + " = " + (v.n * Math.log(v.b)/Math.log(v.a)).toFixed(4) },
  ],
  examples: [
    { input: { a: 2, b: 3, n: 3 }, result: 4.7549, formatted: "log₂(3³) = 3×log₂3 ≈ 4.7549" },
    { input: { a: 10, b: 5, n: 2 }, result: 1.3979, formatted: "log₁₀(5²) = 2×log₁₀5 ≈ 1.3979" },
  ],
  practice: [
    { question: "Andi mau hitung log₂(4³). Dia tahu log₂ 4 = 2. Tinggal kalikan pangkatnya!", variables: { a: 2, b: 4, n: 3 }, answer: 6, answerFormatted: "6", options: ["6", "8", "4", "3"], explanation: "3 × log₂4 = 3 × 2 = 6. Andi: 'Pangkat turun jadi koefisien!'" },
    { question: "Rina dapet soal log₃(9²). Dia inget log₃ 9 = 2. Berapa?", variables: { a: 3, b: 9, n: 2 }, answer: 4, answerFormatted: "4", options: ["4", "6", "2", "8"], explanation: "2 × log₃9 = 2 × 2 = 4. Rina: 'Pangkatnya turun, tinggal kali!'" },
    { question: "Pak Budi kasih soal log₁₀(1000²). Siapa yang bisa?", variables: { a: 10, b: 1000, n: 2 }, answer: 6, answerFormatted: "6", options: ["6", "9", "3", "4"], explanation: "2 × log₁₀1000 = 2 × 3 = 6. Pak Budi: 'Log 1000 = 3, tinggal kali 2!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Trigonometri Dasar
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "\\sin\\theta = \\frac{d}{m}",
  description: "Sinus: perbandingan sisi depan terhadap sisi miring pada segitiga siku-siku. Nilai sinus bergantung pada besar sudut, bukan panjang sisi. Untuk sudut 30°, sin = 1/2; untuk 45°, sin = √2/2; untuk 60°, sin = √3/2.",
  variables: [
    { name: "d", label: "sisi depan", defaultValue: 3, min: 1, max: 100, step: 1 },
    { name: "m", label: "sisi miring", defaultValue: 5, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "sin θ",
  visual: "unit-circle",
  compute: (v) => v.d / v.m,
  formatResult: (r) => r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "d=" + v.d + ", m=" + v.m },
    { label: "Bagi", detail: v.d + " / " + v.m + " = " + (v.d/v.m).toFixed(4) },
    { label: "Hasil", detail: "sin(theta) = " + (v.d/v.m).toFixed(4) + ", theta = " + (Math.asin(v.d/v.m)*180/Math.PI).toFixed(2) + " derajat" },
  ],
  examples: [
    { input: { d: 3, m: 5 }, result: 0.6, formatted: "sin θ = 3/5 = 0.6" },
    { input: { d: 5, m: 13 }, result: 0.3846, formatted: "sin θ = 5/13 ≈ 0.3846" },
  ],
  practice: [
    { question: "Andi punya segitiga siku-siku. Sisi depan=5, sisi miring=13. Berapa sin θ-nya? Pak Budi bilang: 'depan dibagi miring!'", variables: { d: 5, m: 13 }, answer: 0.3846, answerFormatted: "5/13", options: ["5/13", "12/13", "5/12", "13/5"], explanation: "sin θ = 5/13. Andi: 'Sin itu depan/miring, hafalkan!'" },
    { question: "Rina punya segitiga. Sisi depan=8, sisi miring=17. Berapa sin θ?", variables: { d: 8, m: 17 }, answer: 0.4706, answerFormatted: "8/17", options: ["8/17", "15/17", "8/15", "17/8"], explanation: "sin θ = 8/17. Rina: '8-15-17, triple Pythagoras!'" },
    { question: "Pak Budi kasih soal: sisi depan=7, sisi miring=25. Berapa sin θ?", variables: { d: 7, m: 25 }, answer: 0.28, answerFormatted: "7/25", options: ["7/25", "24/25", "7/24", "25/7"], explanation: "sin θ = 7/25. Pak Budi: '7-24-25, triple Pythagoras lagi!'" },
  ],
});

reg({
  formula: "\\cos\\theta = \\frac{s}{m}",
  description: "Cosinus: perbandingan sisi samping terhadap sisi miring pada segitiga siku-siku. Cosinus berbanding terbalik dengan sinus: cos(θ) = sin(90°-θ). Untuk sudut 0°, cos = 1; untuk 90°, cos = 0.",
  variables: [
    { name: "s", label: "sisi samping", defaultValue: 4, min: 1, max: 100, step: 1 },
    { name: "m", label: "sisi miring", defaultValue: 5, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "cos θ",
  visual: "unit-circle",
  compute: (v) => v.s / v.m,
  formatResult: (r) => r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "s=" + v.s + ", m=" + v.m },
    { label: "Bagi", detail: v.s + " / " + v.m + " = " + (v.s/v.m).toFixed(4) },
    { label: "Hasil", detail: "cos(theta) = " + (v.s/v.m).toFixed(4) + ", theta = " + (Math.acos(v.s/v.m)*180/Math.PI).toFixed(2) + " derajat" },
  ],
  examples: [
    { input: { s: 4, m: 5 }, result: 0.8, formatted: "cos θ = 4/5 = 0.8" },
    { input: { s: 12, m: 13 }, result: 0.9231, formatted: "cos θ = 12/13 ≈ 0.9231" },
  ],
  practice: [
    { question: "Andi punya segitiga siku-siku. Sisi samping=12, sisi miring=13. Berapa cos θ? Ingat: cos = samping/miring!", variables: { s: 12, m: 13 }, answer: 0.9231, answerFormatted: "12/13", options: ["12/13", "5/13", "12/5", "13/12"], explanation: "cos θ = 12/13. Andi: 'Cos itu samping/miring, beda sama sin!'" },
    { question: "Rina punya segitiga. Sisi samping=15, sisi miring=17. Berapa cos θ?", variables: { s: 15, m: 17 }, answer: 0.8824, answerFormatted: "15/17", options: ["15/17", "8/17", "15/8", "17/15"], explanation: "cos θ = 15/17. Rina: '15-8-17, triple Pythagoras!'" },
    { question: "Pak Budi kasih soal: sisi samping=9, sisi miring=15. Berapa cos θ?", variables: { s: 9, m: 15 }, answer: 0.6, answerFormatted: "3/5", options: ["3/5", "4/5", "3/4", "5/3"], explanation: "cos θ = 9/15 = 3/5. Pak Budi: '9-12-15 itu 3-4-5 yang dikali 3!'" },
  ],
});

reg({
  formula: "\\tan\\theta = \\frac{d}{s}",
  description: "Tangen: perbandingan sisi depan terhadap sisi samping. Juga berlaku tan(θ) = sin(θ)/cos(θ). Tangen tak terdefinisi pada sudut 90° karena sisi sampingnya nol (pembagian dengan nol).",
  variables: [
    { name: "d", label: "sisi depan", defaultValue: 3, min: 1, max: 100, step: 1 },
    { name: "s", label: "sisi samping", defaultValue: 4, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "tan θ",
  visual: "unit-circle",
  compute: (v) => v.d / v.s,
  formatResult: (r) => r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "d=" + v.d + ", s=" + v.s },
    { label: "Bagi", detail: v.d + " / " + v.s + " = " + (v.d/v.s).toFixed(4) },
    { label: "Hasil", detail: "tan(theta) = " + (v.d/v.s).toFixed(4) + ", theta = " + (Math.atan(v.d/v.s)*180/Math.PI).toFixed(2) + " derajat" },
  ],
  examples: [
    { input: { d: 3, s: 4 }, result: 0.75, formatted: "tan θ = 3/4 = 0.75" },
    { input: { d: 8, s: 15 }, result: 0.5333, formatted: "tan θ = 8/15 ≈ 0.5333" },
  ],
  practice: [
    { question: "Andi punya segitiga siku-siku. Sisi depan=8, sisi samping=15. Berapa tan θ? Ingat: tan = depan/samping!", variables: { d: 8, s: 15 }, answer: 0.5333, answerFormatted: "8/15", options: ["8/15", "15/8", "8/17", "17/8"], explanation: "tan θ = 8/15. Andi: 'Tan itu depan/samping, jangan lupa!'" },
    { question: "Rina punya segitiga. Sisi depan=5, sisi samping=12. Berapa tan θ?", variables: { d: 5, s: 12 }, answer: 0.4167, answerFormatted: "5/12", options: ["5/12", "12/5", "5/13", "13/5"], explanation: "tan θ = 5/12. Rina: '5-12-13, triple favorit!'" },
    { question: "Pak Budi kasih soal: sisi depan=7, sisi samping=24. Berapa tan θ?", variables: { d: 7, s: 24 }, answer: 0.2917, answerFormatted: "7/24", options: ["7/24", "24/7", "7/25", "25/7"], explanation: "tan θ = 7/24. Pak Budi: '7-24-25, triple Pythagoras!'" },
  ],
});

reg({
  formula: "\\sin^2\\theta + \\cos^2\\theta = 1",
  description: "Identitas Pythagoras trigonometri: sin²(θ) + cos²(θ) = 1, berlaku untuk SEMUA sudut. Rumus ini dasar dari semua identitas trigonometri lainnya. Berguna untuk menentukan nilai sin atau cos jika yang lain diketahui.",
  variables: [
    { name: "theta", label: "θ (derajat)", defaultValue: 30, min: 0, max: 90, step: 1 },
  ],
  outputLabel: "sin²θ + cos²θ",
  visual: "unit-circle",
  compute: (v) => {
    const rad = (v.theta * Math.PI) / 180;
    return Math.pow(Math.sin(rad), 2) + Math.pow(Math.cos(rad), 2);
  },
  formatResult: (r) => r.toFixed(6),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "theta = " + v.theta + " derajat" },
    { label: "Hitung sin^2(theta)", detail: "sin^2(" + v.theta + ") = " + Math.pow(Math.sin(v.theta*Math.PI/180), 2).toFixed(4) },
    { label: "Hitung cos^2(theta)", detail: "cos^2(" + v.theta + ") = " + Math.pow(Math.cos(v.theta*Math.PI/180), 2).toFixed(4) },
    { label: "Jumlahkan", detail: Math.pow(Math.sin(v.theta*Math.PI/180),2).toFixed(4) + " + " + Math.pow(Math.cos(v.theta*Math.PI/180),2).toFixed(4) + " = 1.0000" },
  ],
  examples: [
    { input: { theta: 30 }, result: 1, formatted: "sin²30° + cos²30° = 1" },
    { input: { theta: 45 }, result: 1, formatted: "sin²45° + cos²45° = 1" },
  ],
  practice: [
    { question: "Andi lagi ujian. Soalnya: berapa hasil sin²60° + cos²60°? Pak Budi bilang ini identitas Pythagoras!", variables: { theta: 60 }, answer: 1, answerFormatted: "1", options: ["1", "0", "2", "0.5"], explanation: "Identitas Pitagoras: selalu = 1. Andi: 'Nggak usah hitung, pasti 1!'" },
    { question: "Rina dapet soal: jika sin θ = 3/5, berapa cos²θ? Dia harus pakai identitas!", variables: { theta: 37 }, answer: 0.64, answerFormatted: "16/25", options: ["16/25", "9/25", "3/5", "4/5"], explanation: "cos²θ = 1 - sin²θ = 1 - 9/25 = 16/25. Rina: 'sin² + cos² = 1, tinggal kurangi!'" },
    { question: "Pak Budi kasih soal: jika cos θ = 4/5, berapa sin²θ? Anak-anak, ingat identitas Pythagoras!", variables: { theta: 37 }, answer: 0.36, answerFormatted: "9/25", options: ["9/25", "16/25", "3/5", "4/5"], explanation: "sin²θ = 1 - cos²θ = 1 - 16/25 = 9/25. Pak Budi: 'Identitas ini powerful!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Barisan dan Deret Geometri
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "S_n = \\frac{a(r^n - 1)}{r - 1}",
  description: "Jumlah n suku pertama barisan geometri: Sₙ = a(rⁿ-1)/(r-1) jika r≠1. Barisan geometri memiliki rasio perkalian tetap antar suku. Rumus ini berguna untuk menjumlahkan deret eksponensial.",
  variables: [
    { name: "a", label: "a (suku pertama)", defaultValue: 2, min: 1, max: 100, step: 1 },
    { name: "r", label: "r (rasio)", defaultValue: 3, min: -10, max: 10, step: 0.5 },
    { name: "n", label: "n (jumlah suku)", defaultValue: 5, min: 1, max: 30, step: 1 },
  ],
  outputLabel: "Sₙ",
  visual: "sequence",
  compute: (v) => (v.a * (Math.pow(v.r, v.n) - 1)) / (v.r - 1),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", r=" + v.r + ", n=" + v.n },
    { label: "Hitung r^n", detail: v.r + "^" + v.n + " = " + Math.pow(v.r, v.n).toFixed(4) },
    { label: "Kurangkan 1", detail: Math.pow(v.r, v.n).toFixed(4) + " - 1 = " + (Math.pow(v.r, v.n) - 1).toFixed(4) },
    { label: "Hitung Sn", detail: v.a + " x " + (Math.pow(v.r,v.n)-1).toFixed(4) + " / " + (v.r-1) + " = " + (v.a*(Math.pow(v.r,v.n)-1)/(v.r-1)).toFixed(4) },
  ],
  examples: [
    { input: { a: 2, r: 3, n: 5 }, result: 242, formatted: "S₅ = 2(3⁵-1)/(3-1) = 242" },
    { input: { a: 1, r: 2, n: 4 }, result: 15, formatted: "S₄ = 1(2⁴-1)/(2-1) = 15" },
  ],
  practice: [
    { question: "Andi nabung Rp2.000 bulan pertama, naik 3 kali lipat tiap bulan selama 5 bulan. Total tabungannya berapa?", variables: { a: 2, r: 3, n: 5 }, answer: 242, answerFormatted: "242", options: ["242", "120", "486", "364"], explanation: "S₅ = 2(3⁵-1)/(3-1) = 2(242)/2 = 242. Andi nabungnya eksponensial!" },
    { question: "Rina ngumpulin poin game. Minggu pertama 1 poin, naik 2 kali lipat tiap minggu selama 4 minggu. Total poinnya?", variables: { a: 1, r: 2, n: 4 }, answer: 15, answerFormatted: "15", options: ["15", "16", "8", "31"], explanation: "S₄ = 1(2⁴-1)/(2-1) = 15. Rina: '1+2+4+8=15!'" },
    { question: "Pak Budi investasi Rp5.000.000, naik 2 kali lipat tiap tahun selama 3 tahun. Total uangnya?", variables: { a: 5, r: 2, n: 3 }, answer: 35, answerFormatted: "35", options: ["35", "40", "20", "15"], explanation: "S₃ = 5(2³-1)/(2-1) = 5(7) = 35. Pak Budi: 'Investasi dobel!'" },
  ],
});

reg({
  formula: "S_\\infty = \\frac{a}{1-r}",
  description: "Jumlah tak hingga barisan geometri: S∞ = a/(1-r), hanya berlaku jika |r|<1 (konvergen). Jika rasio mutlaknya kurang dari 1, suku-suku semakin kecil dan penjumlahannya mendapat nilai pasti.",
  variables: [
    { name: "a", label: "a (suku pertama)", defaultValue: 4, min: 1, max: 100, step: 1 },
    { name: "r", label: "r (rasio, |r|<1)", defaultValue: 0.5, min: -0.99, max: 0.99, step: 0.01 },
  ],
  outputLabel: "S∞",
  visual: "curve",
  compute: (v) => v.a / (1 - v.r),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", r=" + v.r },
    { label: "Hitung 1-r", detail: "1 - " + v.r + " = " + (1 - v.r) },
    { label: "Bagi", detail: v.a + " / " + (1-v.r) + " = " + (v.a / (1 - v.r)).toFixed(4) },
  ],
  examples: [
    { input: { a: 4, r: 0.5 }, result: 8, formatted: "S∞ = 4/(1-0.5) = 8" },
    { input: { a: 3, r: 0.25 }, result: 4, formatted: "S∞ = 3/(1-0.25) = 4" },
  ],
  practice: [
    { question: "Andi punya barisan 4, 2, 1, 0.5, ... (a=4, r=1/2). Kalau ditambah terus sampai tak hingga, totalnya berapa?", variables: { a: 4, r: 0.5 }, answer: 8, answerFormatted: "8", options: ["8", "6", "10", "4"], explanation: "S∞ = 4/(1-0.5) = 8. Andi: 'Walaupun tak hingga, hasilnya tetap!'" },
    { question: "Rina punya barisan 9, 3, 1, 1/3, ... (a=9, r=1/3). Total tak hingganya?", variables: { a: 9, r: 1/3 }, answer: 13.5, answerFormatted: "13.5", options: ["13.5", "12", "18", "9"], explanation: "S∞ = 9/(1-1/3) = 9/(2/3) = 13.5. Rina: 'Ternyata konvergen!'" },
    { question: "Pak Budi kasih soal: barisan 5, 2.5, 1.25, ... (a=5, r=0.5). Total tak hingganya?", variables: { a: 5, r: 0.5 }, answer: 10, answerFormatted: "10", options: ["10", "5", "15", "7.5"], explanation: "S∞ = 5/(1-0.5) = 10. Pak Budi: 'Barisan konvergen itu ajaib!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Limit Fungsi
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "\\lim_{x \\to a} [f(x) + g(x)] = L_f + L_g",
  description: "Aturan penjumlahan limit: limit dari penjumlahan dua fungsi sama dengan jumlah limit masing-masing fungsi. Ini berarti kita bisa memecah limit yang rumit menjadi bagian-bagian yang lebih sederhana.",
  variables: [
    { name: "a", label: "a (titik limit)", defaultValue: 2, min: -20, max: 20, step: 1 },
    { name: "lf", label: "lim f(x)", defaultValue: 4, min: -50, max: 50, step: 1 },
    { name: "lg", label: "lim g(x)", defaultValue: 3, min: -50, max: 50, step: 1 },
  ],
  outputLabel: "lim [f(x)+g(x)]",
  visual: "curve",
  compute: (v) => v.lf + v.lg,
  formatResult: (r) => r.toString(),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "lim f(x) = " + v.lf + ", lim g(x) = " + v.lg },
    { label: "Jumlahkan", detail: v.lf + " + " + v.lg + " = " + (v.lf + v.lg) },
  ],
  examples: [
    { input: { a: 2, lf: 4, lg: 3 }, result: 7, formatted: "4 + 3 = 7" },
  ],
  practice: [
    { question: "Andi lagi belajar limit. lim(x→2) f(x)=5 dan lim(x→2) g(x)=3. Berapa lim(x→2) [f(x)+g(x)]? Pak Budi bilang: 'Limitnya bisa ditambah!'", variables: { a: 2, lf: 5, lg: 3 }, answer: 8, answerFormatted: "8", options: ["8", "15", "2", "6"], explanation: "lim [f(x)+g(x)] = 5 + 3 = 8. Andi: 'Limitnya linearity!'" },
    { question: "Rina dapet soal: lim(x→1) f(x)=7 dan lim(x→1) g(x)=-2. Berapa lim(x→1) [f(x)+g(x)]?", variables: { a: 1, lf: 7, lg: -2 }, answer: 5, answerFormatted: "5", options: ["5", "9", "-14", "3"], explanation: "lim [f(x)+g(x)] = 7 + (-2) = 5. Rina: 'Negatifnya dikurangi!'" },
    { question: "Pak Budi kasih soal: lim(x→0) f(x)=3 dan lim(x→0) g(x)=4. Berapa lim(x→0) [f(x)+g(x)]?", variables: { a: 0, lf: 3, lg: 4 }, answer: 7, answerFormatted: "7", options: ["7", "12", "-1", "1"], explanation: "lim [f(x)+g(x)] = 3 + 4 = 7. Pak Budi: 'Limit penjumlahan, tinggal jumlahkan!'" },
  ],
});

reg({
  formula: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1",
  description: "Limit khusus: lim(x→0) sin(x)/x = 1. Ini salah satu limit paling penting dalam kalkulus. Berlaku untuk x dalam radian. Limit ini menjadi dasar untuk menurunkan fungsi trigonometri.",
  variables: [
    { name: "x", label: "x (dekat 0, rad)", defaultValue: 0.01, min: -1, max: 1, step: 0.001 },
  ],
  outputLabel: "sin(x)/x",
  visual: "curve",
  compute: (v) => v.x === 0 ? 1 : Math.sin(v.x) / v.x,
  formatResult: (r) => r.toFixed(6),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "x = " + v.x },
    { label: "Hitung sin(x)/x", detail: "sin(" + v.x + ") / " + v.x + " = " + (Math.sin(v.x)/v.x).toFixed(6) },
    { label: "Konvergen", detail: "Saat x mendekati 0, hasil mendekati 1.000000" },
  ],
  examples: [
    { input: { x: 0.01 }, result: 0.999983, formatted: "sin(0.01)/0.01 ≈ 0.999983" },
    { input: { x: 0.001 }, result: 0.9999998, formatted: "sin(0.001)/0.001 ≈ 0.9999998" },
  ],
  practice: [
    { question: "Andi lagi belajar limit khusus. Berapa approx sin(0.1)/0.1? Menurut Pak Budi, ini mendekati 1!", variables: { x: 0.1 }, answer: 0.998334, answerFormatted: "≈ 0.9983", options: ["≈ 0.9983", "≈ 1.0", "≈ 0.5", "≈ 0.9"], explanation: "sin(0.1)/0.1 ≈ 0.998334, mendekati 1. Andi: 'Limitnya konvergen ke 1!'" },
    { question: "Rina ditanya: apa nilai limit sin(x)/x saat x→0? Ini soal klasik!", variables: { x: 0.0001 }, answer: 1, answerFormatted: "1", options: ["1", "0", "∞", "tidak ada"], explanation: "lim(x→0) sin(x)/x = 1. Rina: 'Limit ini fundamental dalam kalkulus!'" },
    { question: "Pak Budi kasih soal: jika lim(x→0) sin(x)/x = 1, berapa lim(x→0) sin(3x)/x? Ini trik!", variables: { x: 0.001 }, answer: 3, answerFormatted: "3", options: ["3", "1", "0", "∞"], explanation: "sin(3x)/x = 3·sin(3x)/(3x) → 3·1 = 3. Pak Budi: 'Jangan lupa kalikan 3!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Turunan (Diferensial)
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "(x^n)' = nx^{n-1}",
  description: "Aturan pangkat untuk turunan: f(x) = xⁿ maka f'(x) = nx^(n-1). Pangkat turun menjadi koefisien, pangkat x berkurang 1. Ini adalah aturan dasar diferensiasi yang paling sering digunakan.",
  variables: [
    { name: "n", label: "n (pangkat)", defaultValue: 3, min: -10, max: 20, step: 1 },
    { name: "x", label: "x (titik)", defaultValue: 2, min: -20, max: 20, step: 1 },
  ],
  outputLabel: "f'(x)",
  visual: "function-graph",
  compute: (v) => v.n * Math.pow(v.x, v.n - 1),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "n=" + v.n + ", x=" + v.x },
    { label: "Turunkan", detail: v.n + " x x^" + (v.n-1) },
    { label: "Evaluasi", detail: v.n + " x " + v.x + "^" + (v.n-1) + " = " + (v.n * Math.pow(v.x, v.n-1)).toFixed(4) },
  ],
  examples: [
    { input: { n: 3, x: 2 }, result: 12, formatted: "f'(2) = 3(2²) = 12" },
    { input: { n: 2, x: 5 }, result: 10, formatted: "f'(5) = 2(5¹) = 10" },
  ],
  practice: [
    { question: "Andi lagi belajar turunan. f(x) = x⁴. Pak Budi tanya: 'Berapa f'(x) di x=2?' Pangkatnya turun!", variables: { n: 4, x: 2 }, answer: 32, answerFormatted: "32", options: ["32", "16", "64", "8"], explanation: "f'(x) = 4x³ → f'(2) = 4(8) = 32. Andi: 'Pangkat turun jadi koefisien!'" },
    { question: "Rina dapet soal: f(x) = x³. Berapa f'(3)?", variables: { n: 3, x: 3 }, answer: 27, answerFormatted: "27", options: ["27", "9", "81", "18"], explanation: "f'(x) = 3x² → f'(3) = 3(9) = 27. Rina: '3×9=27, gampang!'" },
    { question: "Pak Budi kasih soal: f(x) = x⁵. Hitung f'(1)! Anak-anak pasti bisa!", variables: { n: 5, x: 1 }, answer: 5, answerFormatted: "5", options: ["5", "1", "25", "10"], explanation: "f'(x) = 5x⁴ → f'(1) = 5(1) = 5. Pak Budi: 'x=1 itu spesial, hasilnya sama dengan pangkat!'" },
  ],
});

reg({
  formula: "(\\sin x)' = \\cos x",
  description: "Turunan sinus: (sin x)' = cos x. Artinya laju perubahan sin(x) pada setiap titik sama dengan cos(x) pada titik yang sama. Ini menunjukkan hubungan erat antara sin dan cos.",
  variables: [
    { name: "x", label: "x (derajat)", defaultValue: 30, min: -360, max: 360, step: 1 },
  ],
  outputLabel: "f'(x) = cos x",
  visual: "function-graph",
  compute: (v) => Math.cos((v.x * Math.PI) / 180),
  formatResult: (r) => r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "x = " + v.x + " derajat" },
    { label: "Turunan", detail: "(sin x) = cos x" },
    { label: "Evaluasi", detail: "cos(" + v.x + ") = " + Math.cos(v.x * Math.PI / 180).toFixed(4) },
  ],
  examples: [
    { input: { x: 0 }, result: 1, formatted: "cos(0°) = 1" },
    { input: { x: 90 }, result: 0, formatted: "cos(90°) = 0" },
  ],
  practice: [
    { question: "Andi lagi belajar turunan trigonometri. Turunan sin(x) di x=0° berapa? Pak Budi bilang: 'Turunan sin itu cos!'", variables: { x: 0 }, answer: 1, answerFormatted: "cos(0°) = 1", options: ["cos(0°) = 1", "sin(0°) = 0", "0", "-1"], explanation: "(sin x)' = cos x, cos(0°) = 1. Andi: 'Cos 0° = 1, ingat!'" },
    { question: "Rina dapet soal: turunan sin(x) di x=90° berapa?", variables: { x: 90 }, answer: 0, answerFormatted: "cos(90°) = 0", options: ["cos(90°) = 0", "sin(90°) = 1", "1", "-1"], explanation: "(sin x)' = cos x, cos(90°) = 0. Rina: 'Cos 90° = 0, di puncak!'" },
    { question: "Pak Budi kasih soal: turunan sin(x) di x=60° berapa?", variables: { x: 60 }, answer: 0.5, answerFormatted: "cos(60°) = 0.5", options: ["cos(60°) = 0.5", "sin(60°) = 0.866", "1", "0"], explanation: "(sin x)' = cos x, cos(60°) = 0.5. Pak Budi: 'Cos 60° = 1/2!'" },
  ],
});

reg({
  formula: "(e^x)' = e^x",
  description: "Turunan eksponensial: (eˣ)' = eˣ. Fungsi eˣ satu-satunya yang turunannya sama dengan dirinya sendiri. Inilah mengapa bilangan e (≈2,718) sangat fundamental dalam kalkulus dan model pertumbuhan.",
  variables: [
    { name: "x", label: "x", defaultValue: 1, min: -10, max: 10, step: 0.5 },
  ],
  outputLabel: "f'(x) = e^x",
  visual: "function-graph",
  compute: (v) => Math.exp(v.x),
  formatResult: (r) => r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "x = " + v.x },
    { label: "Turunan", detail: "(e^x)' = e^x" },
    { label: "Evaluasi", detail: "e^" + v.x + " = " + Math.exp(v.x).toFixed(4) },
  ],
  examples: [
    { input: { x: 0 }, result: 1, formatted: "e⁰ = 1" },
    { input: { x: 1 }, result: 2.7183, formatted: "e¹ ≈ 2.7183" },
  ],
  practice: [
    { question: "Andi lagi belajar turunan eksponen. Turunan eˣ di x=0 berapa? Pak Budi bilang: 'e^0 = 1, dan turunannya juga e^x!'", variables: { x: 0 }, answer: 1, answerFormatted: "1", options: ["1", "0", "e", "∞"], explanation: "(eˣ)' = eˣ → e⁰ = 1. Andi: 'Turunannya sama dengan dirinya sendiri!'" },
    { question: "Rina dapet soal: turunan eˣ di x=2 berapa?", variables: { x: 2 }, answer: 7.3891, answerFormatted: "e² ≈ 7.3891", options: ["e² ≈ 7.3891", "2e", "e", "4"], explanation: "(eˣ)' = eˣ → e² ≈ 7.3891. Rina: 'E pangkat 2, lumayan besar!'" },
    { question: "Pak Budi kasih soal: turunan eˣ di x=ln(5) berapa? Ini trik!", variables: { x: 1.6094 }, answer: 5, answerFormatted: "5", options: ["5", "e", "ln(5)", "25"], explanation: "(eˣ)' = eˣ → e^(ln5) = 5. Pak Budi: 'e^ln(a) = a, itu sifat logaritma!'" },
  ],
});

reg({
  formula: "(\\ln x)' = \\frac{1}{x}",
  description: "Turunan logaritma natural: (ln x)' = 1/x. Semakin besar x, semakin kecil laju perubahan ln(x). Logaritma natural tumbuh sangat lambat dibanding fungsi linear.",
  variables: [
    { name: "x", label: "x (x > 0)", defaultValue: 2, min: 0.1, max: 100, step: 0.5 },
  ],
  outputLabel: "f'(x) = 1/x",
  visual: "function-graph",
  compute: (v) => 1 / v.x,
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "x = " + v.x },
    { label: "Turunan", detail: "(ln x) = 1/x" },
    { label: "Evaluasi", detail: "1 / " + v.x + " = " + (1/v.x).toFixed(4) },
  ],
  examples: [
    { input: { x: 1 }, result: 1, formatted: "1/1 = 1" },
    { input: { x: 2 }, result: 0.5, formatted: "1/2 = 0.5" },
  ],
  practice: [
    { question: "Andi lagi belajar turunan logaritma. Turunan ln(x) di x=5 berapa? Pak Budi bilang: 'Turunannya 1/x!'", variables: { x: 5 }, answer: 0.2, answerFormatted: "0.2", options: ["0.2", "5", "1", "0.5"], explanation: "(ln x)' = 1/x → 1/5 = 0.2. Andi: 'Makin besar x, makin kecil turunannya!'" },
    { question: "Rina dapet soal: turunan ln(x) di x=10 berapa?", variables: { x: 10 }, answer: 0.1, answerFormatted: "0.1", options: ["0.1", "10", "1", "0.5"], explanation: "(ln x)' = 1/x → 1/10 = 0.1. Rina: 'Turunannya kecil banget!'" },
    { question: "Pak Budi kasih soal: turunan ln(x) di x=0.5 berapa?", variables: { x: 0.5 }, answer: 2, answerFormatted: "2", options: ["2", "0.5", "1", "4"], explanation: "(ln x)' = 1/x → 1/0.5 = 2. Pak Budi: 'Di x kecil, turunannya besar!'" },
  ],
});

reg({
  formula: "(\\cos x)' = -\\sin x",
  description: "Turunan cosinus: (cos x)' = -sin x. Negatif karena cos(x) menurun saat x meningkat dari 0. Hubungan ini mirip dengan sinus tapi dengan tanda berlawanan.",
  variables: [
    { name: "x", label: "x (derajat)", defaultValue: 30, min: -360, max: 360, step: 1 },
  ],
  outputLabel: "f'(x) = -sin x",
  visual: "function-graph",
  compute: (v) => -Math.sin((v.x * Math.PI) / 180),
  formatResult: (r) => r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "x = " + v.x + " derajat" },
    { label: "Turunan", detail: "(cos x) = -sin x" },
    { label: "Evaluasi", detail: "-sin(" + v.x + ") = " + (-Math.sin(v.x * Math.PI / 180)).toFixed(4) },
  ],
  examples: [
    { input: { x: 0 }, result: 0, formatted: "-sin(0°) = 0" },
    { input: { x: 90 }, result: -1, formatted: "-sin(90°) = -1" },
  ],
  practice: [
    { question: "Andi lagi belajar turunan cos. Turunan cos(x) di x=0° berapa? Pak Budi bilang: 'Turunan cos itu -sin!'", variables: { x: 0 }, answer: 0, answerFormatted: "0", options: ["0", "1", "-1", "cos(0)"], explanation: "(cos x)' = -sin x, -sin(0°) = 0. Andi: 'Negatif, tapi sin 0 = 0 jadi hasilnya 0!'" },
    { question: "Rina dapet soal: turunan cos(x) di x=90° berapa?", variables: { x: 90 }, answer: -1, answerFormatted: "-1", options: ["-1", "1", "0", "-sin(90°)"], explanation: "(cos x)' = -sin x, -sin(90°) = -1. Rina: 'Negatif satu, cos-nya lagi turun!'" },
    { question: "Pak Budi kasih soal: turunan cos(x) di x=30° berapa?", variables: { x: 30 }, answer: -0.5, answerFormatted: "-0.5", options: ["-0.5", "0.5", "-0.866", "0"], explanation: "(cos x)' = -sin x, -sin(30°) = -0.5. Pak Budi: 'Sin 30° = 1/2, jadi -1/2!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Integral
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C",
  description: "Integral tak tentu pangkat: kebalikan dari turunan pangkat. ∫xⁿ dx = x^(n+1)/(n+1) + C, berlaku untuk n≠-1. Konstanta C diperlukan karena turunan konstanta selalu nol.",
  variables: [
    { name: "n", label: "n (pangkat)", defaultValue: 2, min: -5, max: 20, step: 1 },
    { name: "x", label: "x", defaultValue: 3, min: -20, max: 20, step: 1 },
  ],
  outputLabel: "Hasil",
  visual: "area-under-curve",
  compute: (v) => Math.pow(v.x, v.n + 1) / (v.n + 1),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "n=" + v.n + ", x=" + v.x },
    { label: "Tambah pangkat", detail: "n + 1 = " + (v.n + 1) },
    { label: "Bagi", detail: "x^" + (v.n+1) + " / " + (v.n+1) + " = " + (Math.pow(v.x, v.n+1)/(v.n+1)).toFixed(4) },
  ],
  examples: [
    { input: { n: 2, x: 3 }, result: 9, formatted: "x³/3 = 27/3 = 9" },
    { input: { n: 3, x: 2 }, result: 4, formatted: "x⁴/4 = 16/4 = 4" },
  ],
  practice: [
    { question: "Andi lagi belajar integral. ∫x² dx = ? Lalu substitusi x=3. Berapa hasilnya?", variables: { n: 2, x: 3 }, answer: 9, answerFormatted: "x³/3", options: ["x³/3", "2x", "x²", "3x³"], explanation: "∫x² dx = x³/3 + C. Andi: 'Pangkat naik 1, bagi pangkat baru!'" },
    { question: "Rina dapet soal: ∫x³ dx = ? Substitusi x=2.", variables: { n: 3, x: 2 }, answer: 4, answerFormatted: "x⁴/4", options: ["x⁴/4", "3x²", "x³", "4x⁴"], explanation: "∫x³ dx = x⁴/4 + C. Rina: 'Pangkat naik 1, bagi 4!'" },
    { question: "Pak Budi kasih soal: ∫x⁴ dx = ? Substitusi x=1. Anak-anak pasti bisa!", variables: { n: 4, x: 1 }, answer: 0.2, answerFormatted: "x⁵/5", options: ["x⁵/5", "4x³", "x⁴", "5x⁵"], explanation: "∫x⁴ dx = x⁵/5 + C → 1/5 = 0.2. Pak Budi: '1^5/5 = 1/5 = 0.2!'" },
  ],
});

reg({
  formula: "\\int \\sin x \\, dx = -\\cos x + C",
  description: "Integral sinus: ∫sin(x) dx = -cos(x) + C. Negatif karena turunan -cos(x) menghasilkan sin(x). Ini kebalikan dari aturan turunan sinus.",
  variables: [
    { name: "a", label: "batas bawah (derajat)", defaultValue: 0, min: -360, max: 360, step: 10 },
    { name: "b", label: "batas atas (derajat)", defaultValue: 90, min: -360, max: 360, step: 10 },
  ],
  outputLabel: "∫sin x dx",
  visual: "area-under-curve",
  compute: (v) => {
    const aRad = (v.a * Math.PI) / 180;
    const bRad = (v.b * Math.PI) / 180;
    return (-Math.cos(bRad)) - (-Math.cos(aRad));
  },
  formatResult: (r) => r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + " derajat, b=" + v.b + " derajat" },
    { label: "Evaluasi batas", detail: "-cos(" + v.b + ") - (-cos(" + v.a + "))" },
    { label: "Hitung", detail: (-Math.cos(v.b*Math.PI/180)).toFixed(4) + " - " + (-Math.cos(v.a*Math.PI/180)).toFixed(4) + " = " + (Math.cos(v.a*Math.PI/180) - Math.cos(v.b*Math.PI/180)).toFixed(4) },
  ],
  examples: [
    { input: { a: 0, b: 90 }, result: 1, formatted: "[-cos(90°)] - [-cos(0°)] = 0+1 = 1" },
    { input: { a: 0, b: 180 }, result: 2, formatted: "[-cos(180°)] - [-cos(0°)] = 1+1 = 2" },
  ],
  practice: [
    { question: "Andi lagi belajar integral tentu. ∫₀⁹⁰ sin(x) dx berapa? Ini soal klasik!", variables: { a: 0, b: 90 }, answer: 1, answerFormatted: "1", options: ["1", "0", "-1", "2"], explanation: "[-cos(90°)] - [-cos(0°)] = 0 - (-1) = 1. Andi: 'Sin dari 0 sampai 90, hasilnya 1!'" },
    { question: "Rina dapet soal: ∫₀¹⁸⁰ sin(x) dx berapa?", variables: { a: 0, b: 180 }, answer: 2, answerFormatted: "2", options: ["2", "0", "1", "-2"], explanation: "[-cos(180°)] - [-cos(0°)] = 1 - (-1) = 2. Rina: 'Sin dari 0 sampai 180, hasilnya 2!'" },
    { question: "Pak Budi kasih soal: ∫₀³⁶⁰ sin(x) dx berapa? Penuh satu putaran!", variables: { a: 0, b: 360 }, answer: 0, answerFormatted: "0", options: ["0", "2", "4", "-2"], explanation: "[-cos(360°)] - [-cos(0°)] = -1 - (-1) = 0. Pak Budi: 'Satu putaran penuh, netral!'" },
  ],
});

reg({
  formula: "\\int e^x \\, dx = e^x + C",
  description: "Integral eksponensial: ∫eˣ dx = eˣ + C. Sama seperti turunannya, integral eˣ juga eˣ sendiri. Inilah mengapa eˣ sangat penting dalam kalkulus — ia stabil di bawah turunan dan integral.",
  variables: [
    { name: "a", label: "batas bawah", defaultValue: 0, min: -10, max: 10, step: 0.5 },
    { name: "b", label: "batas atas", defaultValue: 1, min: -10, max: 10, step: 0.5 },
  ],
  outputLabel: "∫eˣ dx",
  visual: "area-under-curve",
  compute: (v) => Math.exp(v.b) - Math.exp(v.a),
  formatResult: (r) => r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "a=" + v.a + ", b=" + v.b },
    { label: "Evaluasi batas", detail: "e^" + v.b + " - e^" + v.a },
    { label: "Hitung", detail: Math.exp(v.b).toFixed(4) + " - " + Math.exp(v.a).toFixed(4) + " = " + (Math.exp(v.b) - Math.exp(v.a)).toFixed(4) },
  ],
  examples: [
    { input: { a: 0, b: 1 }, result: 1.7183, formatted: "e¹ - e⁰ = 2.718 - 1 = 1.718" },
    { input: { a: 0, b: 2 }, result: 6.3891, formatted: "e² - e⁰ = 7.389 - 1 = 6.389" },
  ],
  practice: [
    { question: "Andi lagi belajar integral eksponen. ∫₀¹ eˣ dx berapa? Pak Budi bilang: 'Integral eˣ = eˣ!'", variables: { a: 0, b: 1 }, answer: 1.7183, answerFormatted: "e - 1 ≈ 1.718", options: ["e - 1 ≈ 1.718", "e", "1", "e + 1"], explanation: "e¹ - e⁰ = e - 1 ≈ 1.718. Andi: 'e pangkat 1 kurang e pangkat 0!'" },
    { question: "Rina dapet soal: ∫₀² eˣ dx berapa?", variables: { a: 0, b: 2 }, answer: 6.3891, answerFormatted: "e² - 1 ≈ 6.389", options: ["e² - 1 ≈ 6.389", "e²", "2e", "e² + 1"], explanation: "e² - e⁰ = e² - 1 ≈ 6.389. Rina: 'E kuadrat kurang 1!'" },
    { question: "Pak Budi kasih soal: ∫₁² eˣ dx berapa? Anak-anak pasti bisa!", variables: { a: 1, b: 2 }, answer: 4.6708, answerFormatted: "e² - e ≈ 4.671", options: ["e² - e ≈ 4.671", "e²", "e", "e² + e"], explanation: "e² - e¹ ≈ 7.389 - 2.718 = 4.671. Pak Budi: 'Dari 1 sampai 2, hasilnya segitu!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Kaidah Pencacahan
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "P(n,r) = \\frac{n!}{(n-r)!}",
  description: "Permutasi: banyak cara menyusun r objek dari n objek berbeda dengan memperhatikan urutan. P(n,r) = n!/(n-r)!. Misalnya P(5,3) = 60 berarti ada 60 cara menyusun 3 orang dari 5 orang.",
  variables: [
    { name: "n", label: "n (jumlah objek)", defaultValue: 5, min: 1, max: 20, step: 1 },
    { name: "r", label: "r (diambil)", defaultValue: 3, min: 1, max: 20, step: 1 },
  ],
  outputLabel: "P(n,r)",
  visual: "tree-diagram",
  compute: (v) => {
    let result = 1;
    for (let i = 0; i < v.r; i++) result *= (v.n - i);
    return result;
  },
  formatResult: (r) => r.toLocaleString("id"),
  stepByStep: (v) => {
    const f = (n: number): number => n <= 1 ? 1 : n * f(n - 1);
    return [
      { label: "Substitusi", detail: "n=" + v.n + ", r=" + v.r },
      { label: "Hitung n!", detail: v.n + "! = " + f(v.n) },
      { label: "Hitung (n-r)!", detail: (v.n-v.r) + "! = " + f(v.n-v.r) },
      { label: "Bagi", detail: f(v.n) + " / " + f(v.n-v.r) + " = " + (f(v.n)/f(v.n-v.r)) },
    ];
  },
  examples: [
    { input: { n: 5, r: 3 }, result: 60, formatted: "P(5,3) = 60" },
    { input: { n: 4, r: 2 }, result: 12, formatted: "P(4,2) = 12" },
  ],
  practice: [
    { question: "Andi mau naruh 3 foto dari 5 foto di Instagram. Berapa banyak cara susunannya? Urutan penting!", variables: { n: 5, r: 3 }, answer: 60, answerFormatted: "60", options: ["60", "10", "120", "15"], explanation: "P(5,3) = 5!/(5-3)! = 120/2 = 60. Andi bisa pilih 60 cara susunan!" },
    { question: "Rina mau susun 2 huruf dari kata ABCD. Berapa banyak cara susunannya?", variables: { n: 4, r: 2 }, answer: 12, answerFormatted: "12", options: ["12", "6", "24", "8"], explanation: "P(4,2) = 4!/2! = 24/2 = 12. Rina: 'AB, AC, AD, BA, BC, BD, CA, CB, CD, DA, DB, DC!'" },
    { question: "Pak Budi kasih soal: berapa banyak susun 4 angka dari 0-9 tanpa pengulangan?", variables: { n: 10, r: 4 }, answer: 5040, answerFormatted: "5040", options: ["5040", "210", "30240", "10000"], explanation: "P(10,4) = 10!/6! = 5040. Pak Budi: 'Banyak banget kombinasinya!'" },
  ],
});

reg({
  formula: "C(n,r) = \\binom{n}{r} = \\frac{n!}{r!(n-r)!}",
  description: "Kombinasi: banyak cara mengambil r objek dari n objek tanpa memperhatikan urutan. C(n,r) = n!/(r!(n-r)!). Berbeda dengan permutasi, kombinasi tidak peduli urutan, hanya pemilihan anggota.",
  variables: [
    { name: "n", label: "n (jumlah objek)", defaultValue: 10, min: 1, max: 30, step: 1 },
    { name: "r", label: "r (diambil)", defaultValue: 3, min: 1, max: 30, step: 1 },
  ],
  outputLabel: "C(n,r)",
  visual: "tree-diagram",
  compute: (v) => {
    if (v.r > v.n) return NaN;
    let result = 1;
    for (let i = 0; i < v.r; i++) result = result * (v.n - i) / (i + 1);
    return Math.round(result);
  },
  formatResult: (r) => r.toLocaleString("id"),
  stepByStep: (v) => {
    const f = (n: number): number => n <= 1 ? 1 : n * f(n - 1);
    return [
      { label: "Substitusi", detail: "n=" + v.n + ", r=" + v.r },
      { label: "Hitung n!", detail: v.n + "! = " + f(v.n) },
      { label: "Hitung r!x(n-r)!", detail: v.r + "! x " + (v.n-v.r) + "! = " + (f(v.r)*f(v.n-v.r)) },
      { label: "Bagi", detail: f(v.n) + " / " + (f(v.r)*f(v.n-v.r)) + " = " + (f(v.n)/(f(v.r)*f(v.n-v.r))) },
    ];
  },
  examples: [
    { input: { n: 10, r: 3 }, result: 120, formatted: "C(10,3) = 120" },
    { input: { n: 5, r: 2 }, result: 10, formatted: "C(5,2) = 10" },
  ],
  practice: [
    { question: "Andi mau pilih 3 toppings dari 10 toppings pizza. Berapa banyak cara pilihnya? Urutan nggak penting!", variables: { n: 10, r: 3 }, answer: 120, answerFormatted: "120", options: ["120", "720", "30", "10"], explanation: "C(10,3) = 10!/(3!×7!) = 720/(6×5040) = 120. Andi: 'Banyak pilihan!'" },
    { question: "Rina mau pilih 2 warna dari 6 warna krayon. Berapa banyak cara?", variables: { n: 6, r: 2 }, answer: 15, answerFormatted: "15", options: ["15", "30", "12", "6"], explanation: "C(6,2) = 6!/(2!×4!) = 720/(2×24) = 15. Rina: 'Pilih 2 dari 6, ada 15 cara!'" },
    { question: "Pak Budi mau pilih 4 siswa dari 8 siswa buat jadi petugas. Berapa banyak cara?", variables: { n: 8, r: 4 }, answer: 70, answerFormatted: "70", options: ["70", "35", "1680", "32"], explanation: "C(8,4) = 8!/(4!×4!) = 40320/(24×24) = 70. Pak Budi: '70 cara pilih petugas!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   SMA — Peluang Lanjut
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)",
  description: "Peluang A ATAU B: P(A∪B) = P(A) + P(B) - P(A∩B). Pengurangan P(A∩B) diperlukan agar kejadian yang masuk dalam A DAN B tidak dihitung dua kali.",
  variables: [
    { name: "pA", label: "P(A)", defaultValue: 0.4, min: 0, max: 1, step: 0.05 },
    { name: "pB", label: "P(B)", defaultValue: 0.3, min: 0, max: 1, step: 0.05 },
    { name: "pAB", label: "P(A∩B)", defaultValue: 0.1, min: 0, max: 1, step: 0.05 },
  ],
  outputLabel: "P(A∪B)",
  visual: "venn",
  compute: (v) => v.pA + v.pB - v.pAB,
  formatResult: (r) => r.toFixed(2),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "P(A)=" + v.pA + ", P(B)=" + v.pB + ", P(A n B)=" + v.pAB },
    { label: "Jumlahkan", detail: v.pA + " + " + v.pB + " = " + (v.pA + v.pB) },
    { label: "Kurangkan irisan", detail: (v.pA+v.pB) + " - " + v.pAB + " = " + (v.pA + v.pB - v.pAB) },
  ],
  examples: [
    { input: { pA: 0.4, pB: 0.3, pAB: 0.1 }, result: 0.6, formatted: "0.4 + 0.3 - 0.1 = 0.6" },
  ],
  practice: [
    { question: "Andi suka makan nasi (P=0.5) dan mie (P=0.3). Peluang dia makan nasi ATAU mie? Ada 10% dia makan keduanya!", variables: { pA: 0.5, pB: 0.3, pAB: 0.1 }, answer: 0.7, answerFormatted: "0.7", options: ["0.7", "0.9", "0.8", "0.6"], explanation: "P(A∪B) = 0.5+0.3-0.1 = 0.7. Andi: 'Yang makan dua-duanya nggak dihitung dua kali!'" },
    { question: "Rina suka main game (P=0.6) dan nonton (P=0.4). Peluang dia main game ATAU nonton? Ada 20% dia lakuin keduanya!", variables: { pA: 0.6, pB: 0.4, pAB: 0.2 }, answer: 0.8, answerFormatted: "0.8", options: ["0.8", "1.0", "0.6", "0.9"], explanation: "P(A∪B) = 0.6+0.4-0.2 = 0.8. Rina: 'Main game sambil nonton, bisa!'" },
    { question: "Pak Budi suka kopi (P=0.7) dan teh (P=0.5). Peluang dia minum kopi ATAU teh? Ada 30% dia minum keduanya!", variables: { pA: 0.7, pB: 0.5, pAB: 0.3 }, answer: 0.9, answerFormatted: "0.9", options: ["0.9", "1.2", "0.5", "1.0"], explanation: "P(A∪B) = 0.7+0.5-0.3 = 0.9. Pak Budi: 'Minum kopi dan teh, capek nggak?'" },
  ],
});

reg({
  formula: "P(A \\cap B) = P(A) \\cdot P(B)",
  description: "Peluang kejadian bersamaan independen: P(A∩B) = P(A) × P(B). Berlaku jika kejadian A dan B saling bebas (satu kejadian tidak mempengaruhi yang lain). Misalnya melempar dadu dan koin.",
  variables: [
    { name: "pA", label: "P(A)", defaultValue: 0.5, min: 0, max: 1, step: 0.05 },
    { name: "pB", label: "P(B)", defaultValue: 0.4, min: 0, max: 1, step: 0.05 },
  ],
  outputLabel: "P(A∩B)",
  visual: "venn",
  compute: (v) => v.pA * v.pB,
  formatResult: (r) => r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "P(A)=" + v.pA + ", P(B)=" + v.pB },
    { label: "Kalikan", detail: v.pA + " x " + v.pB + " = " + (v.pA * v.pB) },
  ],
  examples: [
    { input: { pA: 0.5, pB: 0.4 }, result: 0.2, formatted: "0.5 × 0.4 = 0.2" },
  ],
  practice: [
    { question: "Andi lempar dadu (P=0.5 dapat genap) dan koin (P=0.6 dapat gambar). Peluang dia dapat genap DAN gambar?", variables: { pA: 0.5, pB: 0.6 }, answer: 0.3, answerFormatted: "0.3", options: ["0.3", "1.1", "0.8", "0.25"], explanation: "P(A∩B) = 0.5 × 0.6 = 0.3. Andi: 'Kejadian independen, tinggal kali!'" },
    { question: "Rina mau makan mie (P=0.8) dan minum es (P=0.3). Peluang dia makan mie DAN minum es?", variables: { pA: 0.8, pB: 0.3 }, answer: 0.24, answerFormatted: "0.24", options: ["0.24", "1.1", "0.5", "0.64"], explanation: "P(A∩B) = 0.8 × 0.3 = 0.24. Rina: 'Mie dan es, combo favorit!'" },
    { question: "Pak Budi mau hujan (P=0.25) dan bawa payung (P=0.8). Peluang hujan DAN bawa payung?", variables: { pA: 0.25, pB: 0.8 }, answer: 0.2, answerFormatted: "0.2", options: ["0.2", "1.05", "0.55", "0.4"], explanation: "P(A∩B) = 0.25 × 0.8 = 0.2. Pak Budi: 'Hujan tapi bawa payung, waspada!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   Kuliah — Calculus
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "\\int u \\, dv = uv - \\int v \\, du",
  description: "Integrasi parsial: ∫u dv = uv - ∫v du. Teknik ini membalikkan aturan perkalian turunan. Pilih u dan dv dengan tepat agar integral ∫v du lebih mudah dihitung dari integral asal.",
  variables: [
    { name: "u", label: "u", defaultValue: 2, min: -20, max: 20, step: 1 },
    { name: "v", label: "v", defaultValue: 3, min: -20, max: 20, step: 1 },
    { name: "intvd", label: "∫v du", defaultValue: 1, min: -50, max: 50, step: 0.5 },
  ],
  outputLabel: "Hasil",
  visual: "area-under-curve",
  compute: (v) => v.u * v.v - v.intvd,
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "u=" + v.u + ", v=" + v.v + ", int v du = " + v.intvd },
    { label: "Hitung uv", detail: v.u + " x " + v.v + " = " + (v.u * v.v) },
    { label: "Kurangkan int v du", detail: (v.u*v.v) + " - " + v.intvd + " = " + (v.u*v.v - v.intvd) },
  ],
  examples: [
    { input: { u: 1, v: Math.E, intvd: Math.E - 1 }, result: 1, formatted: "1·e - (e-1) = 1" },
  ],
  practice: [
    { question: "Andi lagi belajar integrasi parsial. ∫₀¹ x·eˣ dx: kalau u=x, dv=eˣdx, maka uv=xeˣ, ∫vdu=∫eˣdx. Berapa hasilnya?", variables: { u: 1, v: Math.E, intvd: Math.E - 1 }, answer: 1, answerFormatted: "1", options: ["1", "e", "e-1", "2"], explanation: "[xeˣ]₀¹ - ∫₀¹ eˣ dx = e - (e-1) = 1. Andi: 'Integrasi parsial itu powerful!'" },
    { question: "Rina dapet soal: kalau uv = 10 dan ∫v du = 3, berapa ∫u dv?", variables: { u: 5, v: 2, intvd: 3 }, answer: 7, answerFormatted: "7", options: ["7", "13", "2", "15"], explanation: "∫u dv = uv - ∫v du = 10 - 3 = 7. Rina: 'Tinggal kurangi!'" },
    { question: "Pak Budi kasih soal: kalau uv = 15 dan ∫v du = 8, berapa ∫u dv?", variables: { u: 5, v: 3, intvd: 8 }, answer: 7, answerFormatted: "7", options: ["7", "23", "12", "15"], explanation: "∫u dv = 15 - 8 = 7. Pak Budi: 'Rumusnya sederhana: uv dikurang integral v du!'" },
  ],
});

reg({
  formula: "\\lim \\frac{f(x)}{g(x)} = \\lim \\frac{f'(x)}{g'(x)}",
  description: "Aturan L'Hôpital: jika limit menghasilkan bentuk tak tentu 0/0 atau ∞/∞, turunkan pembilang dan penyebut secara terpisah lalu hitung limitnya. Berulang jika masih tak tentu.",
  variables: [
    { name: "lf", label: "lim f'(x)", defaultValue: 2, min: -50, max: 50, step: 1 },
    { name: "lg", label: "lim g'(x)", defaultValue: 1, min: -50, max: 50, step: 1 },
  ],
  outputLabel: "Limit",
  visual: "curve",
  compute: (v) => v.lg === 0 ? NaN : v.lf / v.lg,
  formatResult: (r) => isNaN(r) ? "Tidak terdefinisi" : (r % 1 === 0 ? r.toString() : r.toFixed(4)),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "lim f(x) = " + v.lf + ", lim g(x) = " + v.lg },
    { label: "Cek bentuk", detail: "Harus berbentuk 0/0 atau infinity/infinity" },
    { label: "Bagi", detail: v.lf + " / " + v.lg + " = " + (v.lf / v.lg).toFixed(4) },
  ],
  examples: [
    { input: { lf: 4, lg: 1 }, result: 4, formatted: "4/1 = 4" },
    { input: { lf: 6, lg: 2 }, result: 3, formatted: "6/2 = 3" },
  ],
  practice: [
    { question: "Andi lagi belajar L'Hôpital. lim(x→0) sin(2x)/x = lim 2cos(2x)/1. Berapa hasilnya?", variables: { lf: 2, lg: 1 }, answer: 2, answerFormatted: "2", options: ["2", "1", "0", "∞"], explanation: "2cos(0)/1 = 2. Andi: 'Turunkan pembilang penyebut, lalu substitusi!'" },
    { question: "Rina dapet soal: lim(x→0) (1-cos x)/x² = lim sin x/(2x). Berapa hasilnya?", variables: { lf: 1, lg: 2 }, answer: 0.5, answerFormatted: "1/2", options: ["1/2", "1", "0", "∞"], explanation: "sin(0)/(2·0) → 1/2. Rina: 'Masih bentuk 0/0, tapi udah hampir!'" },
    { question: "Pak Budi kasih soal: lim(x→∞) (3x²+1)/(5x²-2) = lim 6x/10x. Berapa hasilnya?", variables: { lf: 6, lg: 10 }, answer: 0.6, answerFormatted: "3/5", options: ["3/5", "1", "0", "∞"], explanation: "6x/10x = 6/10 = 3/5. Pak Budi: 'Turunkan dua kali, hasilnya rasio koefisien!'" },
  ],
});

reg({
  formula: "\\nabla f = \\left(\\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z}\\right)",
  description: "Gradient (∇f): vektor yang menunjukkan arah pertumbuhan tercepat dari fungsi f(x,y,z). Besar gradient menunjukkan laju perubahan maksimum. Arah gradient tegak lurus terhadap kurva sama nilai (level curve).",
  variables: [
    { name: "dfdx", label: "∂f/∂x", defaultValue: 3, min: -20, max: 20, step: 1 },
    { name: "dfdy", label: "∂f/∂y", defaultValue: 4, min: -20, max: 20, step: 1 },
    { name: "dfdz", label: "∂f/∂z", defaultValue: 5, min: -20, max: 20, step: 1 },
  ],
  outputLabel: "|∇f| (besar gradient)",
  visual: "gradient-3d",
  compute: (v) => Math.sqrt(v.dfdx ** 2 + v.dfdy ** 2 + v.dfdz ** 2),
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "df/dx=" + v.dfdx + ", df/dy=" + v.dfdy + ", df/dz=" + v.dfdz },
    { label: "Susun vektor", detail: "nabla f = (" + v.dfdx + ", " + v.dfdy + ", " + v.dfdz + ")" },
    { label: "Hitung magnitudo", detail: "|nabla f| = sqrt(" + (v.dfdx*v.dfdx) + " + " + (v.dfdy*v.dfdy) + " + " + (v.dfdz*v.dfdz) + ") = " + Math.sqrt(v.dfdx*v.dfdx + v.dfdy*v.dfdy + v.dfdz*v.dfdz).toFixed(4) },
  ],
  examples: [
    { input: { dfdx: 3, dfdy: 4, dfdz: 0 }, result: 5, formatted: "√(9+16+0) = 5" },
    { input: { dfdx: 1, dfdy: 2, dfdz: 2 }, result: 3, formatted: "√(1+4+4) = 3" },
  ],
  practice: [
    { question: "Andi lagi belajar gradient. ∇f = (3, 4, 0). Berapa besar gradientnya? Pak Budi bilang: 'Ini sama kayak Pythagoras!'", variables: { dfdx: 3, dfdy: 4, dfdz: 0 }, answer: 5, answerFormatted: "5", options: ["5", "7", "25", "12"], explanation: "|∇f| = √(9+16+0) = 5. Andi: '3-4-5, triple Pythagoras lagi!'" },
    { question: "Rina dapet gradient ∇f = (1, 2, 2). Berapa besar gradientnya?", variables: { dfdx: 1, dfdy: 2, dfdz: 2 }, answer: 3, answerFormatted: "3", options: ["3", "5", "9", "6"], explanation: "|∇f| = √(1+4+4) = 3. Rina: '1-2-2, triple unik!'" },
    { question: "Pak Budi kasih soal: ∇f = (2, 3, 6). Berapa besar gradientnya?", variables: { dfdx: 2, dfdy: 3, dfdz: 6 }, answer: 7, answerFormatted: "7", options: ["7", "11", "49", "13"], explanation: "|∇f| = √(4+9+36) = 7. Pak Budi: '2-3-6-7, triple 3D!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   Kuliah — Linear Algebra
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "\\det(A - \\lambda I) = 0",
  description: "Persamaan karakteristik: det(A - λI) = 0 untuk mencari nilai eigen (λ). Nilai eigen adalah skalar yang membuat transformasi matriks hanya meregang/mengecil tanpa memutar. Penting dalam PCA, analisis stabilitas, dan fisika kuantum.",
  variables: [
    { name: "a11", label: "a₁₁", defaultValue: 2, min: -10, max: 10, step: 1 },
    { name: "a12", label: "a₁₂", defaultValue: 1, min: -10, max: 10, step: 1 },
    { name: "a21", label: "a₂₁", defaultValue: 1, min: -10, max: 10, step: 1 },
    { name: "a22", label: "a₂₂", defaultValue: 2, min: -10, max: 10, step: 1 },
  ],
  outputLabel: "det(A-λI)",
  visual: "matrix-grid",
  compute: (v) => {
    const trace = v.a11 + v.a22;
    const det = v.a11 * v.a22 - v.a12 * v.a21;
    const disc = trace * trace - 4 * det;
    if (disc < 0) return NaN;
    const l1 = (trace + Math.sqrt(disc)) / 2;
    const l2 = (trace - Math.sqrt(disc)) / 2;
    return l1;
  },
  formatResult: (r) => r % 1 === 0 ? r.toString() : r.toFixed(4),
  stepByStep: (v) => [
    { label: "Bentuk karakteristik", detail: "(a11-L)(a22-L) - a12.a21 = 0" },
    { label: "Hitung trace", detail: "tr(A) = " + v.a11 + " + " + v.a22 + " = " + (v.a11 + v.a22) },
    { label: "Hitung determinan", detail: "det(A) = " + (v.a11*v.a22 - v.a12*v.a21) },
    { label: "Persamaan kuadrat", detail: "L^2 - " + (v.a11+v.a22) + "L + " + (v.a11*v.a22 - v.a12*v.a21) + " = 0" },
  ],
  examples: [
    { input: { a11: 2, a12: 1, a21: 1, a22: 2 }, result: 3, formatted: "λ₁=3, λ₂=1" },
    { input: { a11: 4, a12: 1, a21: 2, a22: 3 }, result: 5, formatted: "λ₁=5, λ₂=2" },
  ],
  practice: [
    { question: "Andi lagi belajar nilai eigen. Matriks A = [[2,1],[1,2]]. Berapa nilai eigen-nya? Pak Budi bilang ini matriks simetris!", variables: { a11: 2, a12: 1, a21: 1, a22: 2 }, answer: 3, answerFormatted: "λ₁=3, λ₂=1", options: ["λ₁=3, λ₂=1", "λ₁=2, λ₂=2", "λ₁=4, λ₂=0", "λ₁=1, λ₂=1"], explanation: "(2-λ)²-1=0 → λ=3, λ=1. Andi: 'Matriks simetris, eigen-nya pasti real!'" },
    { question: "Rina dapet matriks A = [[4,1],[2,3]]. Berapa nilai eigen-nya?", variables: { a11: 4, a12: 1, a21: 2, a22: 3 }, answer: 5, answerFormatted: "λ₁=5, λ₂=2", options: ["λ₁=5, λ₂=2", "λ₁=4, λ₂=3", "λ₁=7, λ₂=0", "λ₁=3, λ₂=2"], explanation: "(4-λ)(3-λ)-2=0 → λ=5, λ=2. Rina: 'Eigen-nya 5 dan 2, bagus!'" },
    { question: "Pak Budi kasih matriks A = [[1,2],[0,3]]. Berapa nilai eigen-nya? Ini matriks segitiga!", variables: { a11: 1, a12: 2, a21: 0, a22: 3 }, answer: 3, answerFormatted: "λ₁=3, λ₂=1", options: ["λ₁=3, λ₂=1", "λ₁=1, λ₂=3", "λ₁=4, λ₂=0", "λ₁=2, λ₂=2"], explanation: "Matriks segitiga atas, eigen = diagonal: 1, 3. Pak Budi: 'Matriks segitiga, eigen-nya di diagonal!'" },
  ],
});

reg({
  formula: "\\det(AB) = \\det(A) \\cdot \\det(B)",
  description: "Sifat determinan: det(AB) = det(A) × det(B). Determinan hasil kali dua matriks sama dengan hasil kali determinannya. Ini memudahkan perhitungan determinan tanpa mengalikan matriks secara langsung.",
  variables: [
    { name: "detA", label: "det(A)", defaultValue: 3, min: -20, max: 20, step: 1 },
    { name: "detB", label: "det(B)", defaultValue: 5, min: -20, max: 20, step: 1 },
  ],
  outputLabel: "det(AB)",
  visual: "matrix-grid",
  compute: (v) => v.detA * v.detB,
  formatResult: (r) => r.toString(),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "det(A)=" + v.detA + ", det(B)=" + v.detB },
    { label: "Kalikan", detail: v.detA + " x " + v.detB + " = " + (v.detA * v.detB) },
    { label: "Hasil", detail: "det(AB) = " + (v.detA * v.detB) },
  ],
  examples: [
    { input: { detA: 3, detB: 5 }, result: 15, formatted: "3 × 5 = 15" },
    { input: { detA: -2, detB: 4 }, result: -8, formatted: "-2 × 4 = -8" },
  ],
  practice: [
    { question: "Andi lagi belajar sifat determinan. det(A)=3, det(B)=7. Berapa det(AB)? Pak Budi bilang: 'Tinggal kali!'", variables: { detA: 3, detB: 7 }, answer: 21, answerFormatted: "21", options: ["21", "10", "4", "3/7"], explanation: "det(AB) = 3 × 7 = 21. Andi: 'Determinan hasil kali sama dengan kali determinan!'" },
    { question: "Rina dapet soal: det(A)=-2, det(B)=-5. Berapa det(AB)?", variables: { detA: -2, detB: -5 }, answer: 10, answerFormatted: "10", options: ["10", "-10", "7", "-7"], explanation: "det(AB) = (-2)×(-5) = 10. Rina: 'Negatif kali negatif jadi positif!'" },
    { question: "Pak Budi kasih soal: det(A)=0, det(B)=8. Berapa det(AB)?", variables: { detA: 0, detB: 8 }, answer: 0, answerFormatted: "0", options: ["0", "8", "1", "∞"], explanation: "det(AB) = 0 × 8 = 0. Pak Budi: 'Kalau salah satu determinannya 0, hasilnya 0!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   Kuliah — Probabilitas & Statistika Lanjut
   ══════════════════════════════════════════════════════════════ */

reg({
  formula: "P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}",
  description: "Distribusi binomial: P(X=k) = C(n,k) × p^k × (1-p)^(n-k). Menghitung peluang tepat k keberhasilan dalam n percobaan independen. Contoh: peluang tepat 3 ekor dari 5 kali lempar koin adil.",
  variables: [
    { name: "n", label: "n (percobaan)", defaultValue: 10, min: 1, max: 50, step: 1 },
    { name: "k", label: "k (berhasil)", defaultValue: 2, min: 0, max: 50, step: 1 },
    { name: "p", label: "p (peluang)", defaultValue: 0.3, min: 0, max: 1, step: 0.05 },
  ],
  outputLabel: "P(X=k)",
  visual: "histogram",
  compute: (v) => {
    let coeff = 1;
    for (let i = 0; i < v.k; i++) coeff = coeff * (v.n - i) / (i + 1);
    return coeff * Math.pow(v.p, v.k) * Math.pow(1 - v.p, v.n - v.k);
  },
  formatResult: (r) => r.toFixed(4),
  stepByStep: (v) => {
    const f = (n: number): number => n <= 1 ? 1 : n * f(n - 1);
    const c = f(v.n) / (f(v.k) * f(v.n - v.k));
    return [
      { label: "Substitusi", detail: "n=" + v.n + ", k=" + v.k + ", p=" + v.p },
      { label: "Hitung C(n,k)", detail: v.n + "! / (" + v.k + "! x " + (v.n-v.k) + "!) = " + c },
      { label: "Hitung p^k", detail: v.p + "^" + v.k + " = " + Math.pow(v.p, v.k).toFixed(6) },
      { label: "Hitung (1-p)^(n-k)", detail: (1-v.p) + "^" + (v.n-v.k) + " = " + Math.pow(1-v.p, v.n-v.k).toFixed(6) },
      { label: "Kalikan semua", detail: c + " x " + Math.pow(v.p,v.k).toFixed(6) + " x " + Math.pow(1-v.p,v.n-v.k).toFixed(6) + " = " + (c * Math.pow(v.p, v.k) * Math.pow(1-v.p, v.n-v.k)).toFixed(6) },
    ];
  },
  examples: [
    { input: { n: 10, k: 2, p: 0.3 }, result: 0.2335, formatted: "P(X=2) ≈ 0.2335" },
    { input: { n: 5, k: 3, p: 0.5 }, result: 0.3125, formatted: "P(X=3) ≈ 0.3125" },
  ],
  practice: [
    { question: "Andi lempar dadu 10 kali. Peluang tepat 2 kali dapat angka 6? Ini distribusi binomial!", variables: { n: 10, k: 2, p: 0.3 }, answer: 0.2335, answerFormatted: "0.2335", options: ["0.2335", "0.3000", "0.0280", "0.5000"], explanation: "C(10,2)×0.3²×0.7⁸ = 45×0.09×0.0576 ≈ 0.2335. Andi: 'Peluangnya hampir 25%!'" },
    { question: "Rina lempar koin 5 kali. Peluang tepat 3 kali dapat gambar?", variables: { n: 5, k: 3, p: 0.5 }, answer: 0.3125, answerFormatted: "0.3125", options: ["0.3125", "0.5000", "0.1563", "0.6250"], explanation: "C(5,3)×0.5³×0.5² = 10×0.125×0.25 = 0.3125. Rina: '3 dari 5, peluangnya 31%!'" },
    { question: "Pak Budi kasih soal: lempar dadu 8 kali, peluang tidak ada yang 6?", variables: { n: 8, k: 0, p: 0.4 }, answer: 0.0168, answerFormatted: "0.0168", options: ["0.0168", "0.4000", "0.0000", "0.1680"], explanation: "C(8,0)×0.4⁰×0.6⁸ = 1×1×0.0168 ≈ 0.0168. Pak Budi: 'Kecil banget peluangnya!'" },
  ],
});

reg({
  formula: "Z = \\frac{X - \\mu}{\\sigma}",
  description: "Z-score: mengubah nilai X dari distribusi normal menjadi skor standar Z = (X-μ)/σ. Z-score menunjukkan berapa standar deviasi suatu nilai dari rata-rata. Z=0 berarti tepat di mean, Z=1 berarti 1 std dev di atas mean.",
  variables: [
    { name: "x", label: "X (nilai)", defaultValue: 85, min: 0, max: 200, step: 1 },
    { name: "mu", label: "μ (mean)", defaultValue: 70, min: 0, max: 200, step: 1 },
    { name: "sigma", label: "σ (std dev)", defaultValue: 10, min: 1, max: 100, step: 1 },
  ],
  outputLabel: "Z-score",
  visual: "normal-curve",
  compute: (v) => (v.x - v.mu) / v.sigma,
  formatResult: (r) => r.toFixed(4),
  stepByStep: (v) => [
    { label: "Substitusi", detail: "X=" + v.x + ", mu=" + v.mu + ", sigma=" + v.sigma },
    { label: "Kurangkan", detail: "X - mu = " + v.x + " - " + v.mu + " = " + (v.x - v.mu) },
    { label: "Bagi sigma", detail: (v.x-v.mu) + " / " + v.sigma + " = " + ((v.x - v.mu) / v.sigma).toFixed(4) },
  ],
  examples: [
    { input: { x: 85, mu: 70, sigma: 10 }, result: 1.5, formatted: "(85-70)/10 = 1.5" },
    { input: { x: 60, mu: 70, sigma: 10 }, result: -1, formatted: "(60-70)/10 = -1" },
  ],
  practice: [
    { question: "Andi dapet nilai ujian 85. Rata-rata kelas 70, standar deviasi 10. Berapa Z-score-nya? Pak Budi bilang: 'Z-score nunjukin seberapa jauh dari rata-rata!'", variables: { x: 85, mu: 70, sigma: 10 }, answer: 1.5, answerFormatted: "1.5", options: ["1.5", "2.0", "0.5", "-1.5"], explanation: "Z = (85-70)/10 = 1.5. Andi: 'Di atas rata-rata 1,5 standar deviasi!'" },
    { question: "Rina dapet nilai 55. Rata-rata kelas 60, standar deviasi 5. Berapa Z-score-nya?", variables: { x: 55, mu: 60, sigma: 5 }, answer: -1, answerFormatted: "-1", options: ["-1", "1", "0", "-5"], explanation: "Z = (55-60)/5 = -1. Rina: 'Negatif, berarti di bawah rata-rata!'" },
    { question: "Pak Budi kasih soal: nilai 100, rata-rata 80, standar deviasi 15. Berapa Z-score-nya?", variables: { x: 100, mu: 80, sigma: 15 }, answer: 1.3333, answerFormatted: "1.333", options: ["1.333", "2.0", "0.5", "-1.333"], explanation: "Z = (100-80)/15 ≈ 1.333. Pak Budi: 'Di atas rata-rata, bagus!'" },
  ],
});

/* ══════════════════════════════════════════════════════════════
   Export
   ══════════════════════════════════════════════════════════════ */

export function getFormulaMeta(formula: string): FormulaMeta | undefined {
  return R.get(formula);
}

export function getAllFormulaMetas(): FormulaMeta[] {
  return Array.from(R.values());
}

export default R;
