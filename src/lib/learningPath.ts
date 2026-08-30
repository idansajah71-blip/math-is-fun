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
  "1-bilangan-bulat-pecahan-desimal-persen": "Bilangan",
  "2-himpunan": "Himpunan",
  "3-bentuk-aljabar": "Aljabar",
  "4-persamaan-linear-satu-variabel-plsv": "PLSV",
  "5-pertidaksamaan-linear-satu-variabel-ptlsv": "PtLSV",
  "6-perbandingan-senilai-berbalik-nilai": "Perbandingan",
  "7-aritmetika-sosial": "Arit. Sosial",
  "8-pola-bilangan-dan-barisan": "Barisan",
  "9-relasi-dan-fungsi": "Relasi/Fungsi",
  "10-persamaan-garis-lurus": "Garis Lurus",
  "11-sistem-persamaan-linear-dua-variabel-spldv": "SPLDV",
  "12-garis-dan-sudut": "Garis/Sudut",
  "13-segitiga-dan-segiempat": "Segi3/4",
  "14-teorema-pythagoras": "Pythagoras",
  "15-lingkaran": "Lingkaran",
  "16-bangun-ruang-sisi-datar": "Ruang Datar",
  "17-bangun-ruang-sisi-lengkung": "Ruang Lengkung",
  "18-statistika-dasar": "Statistika",
  "19-peluang-dasar": "Peluang",
  "20-transformasi-geometri": "Transformasi",
  "1-eksponen-dan-bentuk-akar": "Eksponen",
  "2-logaritma": "Logaritma",
  "3-persamaan-dan-fungsi-kuadrat": "Kuadrat",
  "4-pertidaksamaan-kuadrat-rasional-mutlak": "Pertidaksamaan",
  "5-spltv-dan-program-linear": "SPLTV/ProLin",
  "6-matriks": "Matriks",
  "7-vektor": "Vektor",
  "8-trigonometri-dasar": "Trigo Dasar",
  "9-identitas-dan-persamaan-trigonometri": "Identitas Trigo",
  "10-aturan-sinus-cosinus-dan-luas-segitiga": "Aturan Sin/Cos",
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
  "a-calculus-kalkulus-iiii": "Kalkulus",
  "b-linear-algebra-aljabar-linear": "Alj. Linear",
  "c-differential-equations-persamaan-diferensial": "Pers. Differensial",
  "d-real-analysis-analisis-real": "Analisis Real",
  "e-abstract-algebra-aljabar-abstrak": "Alj. Abstrak",
  "f-discrete-mathematics-matematika-diskrit": "Diskrit",
  "g-probability-statistics-probabilitas-statistika-lanjut": "Prob/Stat",
  "h-topik-lanjutan": "Topik Lanjut",
};

const LEVEL_COL: Record<string, number> = { sma: 1, kuliah: 2 };

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
