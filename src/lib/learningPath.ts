"use client";

import type { Topic } from "./types";

export interface PathNode {
  slug: string;
  title: string;
  shortTitle: string;
  level: "smp" | "sma" | "kuliah";
  section: string;
  icon: string;
  col: number;
  row: number;
}

export interface PathEdge {
  from: string;
  to: string;
}

const SHORT_TITLES: Record<string, string> = {
  // Kelas 7
  "7-1-bilangan-bulat": "Bil. Bulat",
  "7-2-bilangan-rasional": "Bil. Rasional",
  "7-3-pecahan-desimal-persen": "Pecahan/%",
  "7-4-fpb-dan-kpk": "FPB/KPK",
  "7-5-himpunan": "Himpunan",
  "7-6-bentuk-aljabar": "Aljabar",
  "7-7-aljabar-kalimat-matematika": "Kal. Mat.",
  "7-8-persamaan-linear-satu-variabel": "PLSV",
  "7-9-pertidaksamaan-linear-satu-variabel": "PtLSV",
  "7-10-rasio-dan-perbandingan": "Rasio",
  "7-11-perbandingan-senilai-berbalik-nilai": "Perbandingan",
  "7-12-aritmetika-sosial": "Arit. Sosial",
  "7-13-fungsi-linear": "Fungsi Lin.",
  "7-14-bangun-datar": "Bangun Datar",
  "7-15-segitiga-dan-segiempat": "Segi3/4",
  "7-16-kesebangunan": "Kesebangunan",
  "7-17-garis-dan-sudut": "Garis/Sudut",
  "7-18-bangun-ruang": "Bangun Ruang",
  "7-19-koordinat-kartesius": "Koordinat",
  "7-20-transformasi-geometri-dasar": "Transformasi",
  "7-21-statistika-dasar": "Statistika",
  "7-22-peluang-dasar": "Peluang",
  "7-23-proyek-matematika": "Proyek",
  // Kelas 8
  "8-1-bilangan-berpangkat": "Berpangkat",
  "8-2-bentuk-akar": "Bentuk Akar",
  "8-3-pola-bilangan-dan-barisan": "Barisan",
  "8-4-teorema-pythagoras": "Pythagoras",
  "8-5-tripel-pythagoras": "Tripel Py.",
  "8-6-persamaan-linear-dua-variabel": "PLDV",
  "8-7-spldv": "SPLDV",
  "8-8-relasi-dan-fungsi": "Relasi/Fungsi",
  "8-9-fungsi-kuadrat": "Fungsi Kuad.",
  "8-10-persamaan-garis-lurus": "Garis Lurus",
  "8-11-statistika-mean-median-modus": "Mean/Med/Mod",
  "8-12-penyebaran-data": "Penyebaran",
  "8-13-peluang-kejadian": "Peluang",
  "8-14-garis-dan-sudut-lanjut": "Garis/Sudut+",
  "8-15-segitiga-dan-segiempat-lanjut": "Segi3/4+",
  "8-16-lingkaran": "Lingkaran",
  "8-17-bangun-ruang-sisi-datar": "Ruang Datar",
  "8-18-bangun-ruang-sisi-lengkung": "Ruang Lengkung",
  "8-19-jaring-jaring-bangun-ruang": "Jaring-jaring",
  "8-20-koordinat-kartesius-lanjut": "Koordinat+",
  "8-21-transformasi-geometri": "Transformasi",
  "8-22-kesebangunan-dan-skala": "Skala",
  "8-23-proyek-terapan": "Proyek",
  // Kelas 9
  "9-1-bilangan-berpangkat-lanjut": "Pangkat+",
  "9-2-bentuk-akar-dan-eksponen": "Akar/Eksponen",
  "9-3-spldv-lanjut": "SPLDV+",
  "9-4-sistem-pertidaksamaan": "Sist. PtLSV",
  "9-5-spltv": "SPLTV",
  "9-6-barisan-aritmetika": "Barisan Arit",
  "9-7-barisan-geometri": "Barisan Geo",
  "9-8-statistika-lanjutan": "Stat. Lanjut",
  "9-9-peluang-dan-pemilihan-sampel": "Peluang/Sampel",
  "9-10-luas-permukaan-bangun-ruang": "LP Bangun Ruang",
  "9-11-volume-bangun-ruang": "Volume",
  "9-12-lingkaran-busur-juring": "Busur/Juring",
  "9-13-transformasi-geometri-lanjut": "Transformasi+",
  "9-14-kekongruenan": "Kekongruenan",
  "9-15-dilatasi": "Dilatasi",
  "9-16-segitiga-dan-segiempat-lanjut": "Segi3/4++",
  "9-17-koordinat-transformasi": "Koord. Transf.",
  "9-18-statistika-grafik": "Stat/Grafik",
  "9-19-peluang-empiris": "Peluang Empiris",
  "9-20-perbandingan-skala": "Skala",
  "9-21-aplikasi-matematika": "Aplikasi",
  "9-22-proyek-akhir": "Proyek Akhir",
  // SMA
  "1-eksponen-dan-bentuk-akar": "Eksponen",
  "2-logaritma": "Logaritma",
  "3-persamaan-dan-fungsi-kuadrat": "Kuadrat",
  "4-pertidaksamaan-kuadrat-rasional-mutlak": "Pertidaksamaan",
  "5-spltv-dan-program-linear": "SPLTV/ProLin",
  "6-matriks": "Matriks",
  "7-vektor": "Vektor",
  "8-trigonometri-dasar": "Trigo Dasar",
  "9-identitas-dan-persamaan-trigonometri": "Identitas Trigo",
  "10-aturan-sinus-cosinus-dan-luas-segitiga": "Sin/Cos",
  "11-barisan-dan-deret-aritmetika": "Barisan Arit",
  "12-barisan-dan-deret-geometri": "Barisan Geo",
  "13-limit-fungsi": "Limit",
  "14-turunan-diferensial": "Turunan",
  "15-aplikasi-turunan": "Apl. Turunan",
  "16-integral": "Integral",
  "17-aplikasi-integral": "Apl. Integral",
  "18-statistika-lanjut": "Stat. Lanjut",
  "19-kaidah-pencacahan-permutasi-kombinasi": "Kombinatorik",
  "20-peluang": "Peluang",
  "21-persamaan-lingkaran-dan-irisan-kerucut": "Lingkaran/Irisan",
  "22-bilangan-kompleks": "Bil. Kompleks",
  // Kuliah
  "a-calculus-kalkulus-iiii": "Kalkulus",
  "b-linear-algebra-aljabar-linear": "Alj. Linear",
  "c-differential-equations-persamaan-diferensial": "Pers. Differensial",
  "d-real-analysis-analisis-real": "Analisis Real",
  "e-abstract-algebra-aljabar-abstrak": "Alj. Abstrak",
  "f-discrete-mathematics-matematika-diskrit": "Diskrit",
  "g-probability-statistics-probabilitas-statistika-lanjut": "Prob/Stat",
  "h-topik-lanjutan": "Topik Lanjut",
};

export function buildPathData(topics: Topic[]): { nodes: PathNode[]; edges: PathEdge[] } {
  const nodes: PathNode[] = [];
  const smpTopics = topics.filter((t) => t.level === "smp");
  const smaTopics = topics.filter((t) => t.level === "sma");
  const kuliahTopics = topics.filter((t) => t.level === "kuliah");

  smpTopics.forEach((t, i) => {
    nodes.push({
      slug: t.slug,
      title: t.title,
      shortTitle: SHORT_TITLES[t.slug] || t.title,
      level: "smp",
      section: t.section,
      icon: t.icon,
      col: 0,
      row: i,
    });
  });

  smaTopics.forEach((t, i) => {
    nodes.push({
      slug: t.slug,
      title: t.title,
      shortTitle: SHORT_TITLES[t.slug] || t.title,
      level: "sma",
      section: t.section,
      icon: t.icon,
      col: 1,
      row: i,
    });
  });

  kuliahTopics.forEach((t, i) => {
    nodes.push({
      slug: t.slug,
      title: t.title,
      shortTitle: SHORT_TITLES[t.slug] || t.title,
      level: "kuliah",
      section: t.section,
      icon: t.icon,
      col: 2,
      row: i,
    });
  });

  // Build edges: sequential within each level + cross-level transitions
  const edges: PathEdge[] = [];

  // Sequential edges within each level
  for (let i = 0; i < smpTopics.length - 1; i++) {
    edges.push({ from: smpTopics[i].slug, to: smpTopics[i + 1].slug });
  }
  for (let i = 0; i < smaTopics.length - 1; i++) {
    edges.push({ from: smaTopics[i].slug, to: smaTopics[i + 1].slug });
  }
  for (let i = 0; i < kuliahTopics.length - 1; i++) {
    edges.push({ from: kuliahTopics[i].slug, to: kuliahTopics[i + 1].slug });
  }

  // Cross-level edges: last SMP → first SMA, last SMA → first Kuliah
  if (smpTopics.length > 0 && smaTopics.length > 0) {
    edges.push({ from: smpTopics[smpTopics.length - 1].slug, to: smaTopics[0].slug });
  }
  if (smaTopics.length > 0 && kuliahTopics.length > 0) {
    edges.push({ from: smaTopics[smaTopics.length - 1].slug, to: kuliahTopics[0].slug });
  }

  return { nodes, edges };
}

export const LEVEL_CONFIG = {
  smp: { label: "Matematika SMP", color: "#3DD34C", bgClass: "bg-emerald-500" },
  sma: { label: "Matematika SMA", color: "#25B2F6", bgClass: "bg-blue-500" },
  kuliah: { label: "Matematika Universitas", color: "#BA75FF", bgClass: "bg-purple-500" },
} as const;
