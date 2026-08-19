const fs = require("fs");
const path = require("path");

const mdPath = path.join(__dirname, "..", "public", "matematika-lengkap.md");
const md = fs.readFileSync(mdPath, "utf-8");

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractDescription(content) {
  const konsepMatch = content.match(/\*\*Konsep:\*\*\s*(.*?)(?:\n|$)/);
  if (konsepMatch) {
    return konsepMatch[1].replace(/\$[^$]+\$/g, "").trim().slice(0, 150);
  }
  const firstLine = content
    .split("\n")
    .find((l) => l.trim() && !l.startsWith("#") && !l.startsWith("**"));
  return firstLine?.trim().slice(0, 150) || "Materi matematika lengkap";
}

function getTopicIcon(title) {
  const iconMap = {
    Bilangan: "🔢",
    Himpunan: "📊",
    "Bentuk Aljabar": "🔤",
    "Persamaan Linear": "⚖️",
    Pertidaksamaan: "📐",
    Perbandingan: "📏",
    "Aritmetika Sosial": "💰",
    "Pola Bilangan": "🧩",
    "Relasi dan Fungsi": "🔗",
    "Persamaan Garis": "📈",
    "Sistem Persamaan": "🔀",
    "Garis dan Sudut": "📐",
    Segitiga: "🔺",
    Pythagoras: "📏",
    Lingkaran: "⭕",
    "Bangun Ruang": "📦",
    Statistika: "📊",
    Peluang: "🎲",
    Transformasi: "🔄",
    Eksponen: "⚡",
    Logaritma: "📝",
    Kuadrat: "📐",
    Matriks: "▦",
    Vektor: "➡️",
    Trigonometri: "📏",
    Limit: "🎯",
    Turunan: "📉",
    Integral: "∫",
    Barisan: "📋",
  };
  for (const [key, icon] of Object.entries(iconMap)) {
    if (title.includes(key)) return icon;
  }
  return "📘";
}

const lines = md.split("\n");
let currentLevel = "smp";
let currentSection = "";
let currentTopicTitle = "";
let currentTopicContent = [];
const topics = [];

const flushTopic = () => {
  if (currentTopicTitle && currentTopicContent.length > 0) {
    const content = currentTopicContent.join("\n").trim();
    const slug = createSlug(currentTopicTitle);
    topics.push({
      id: slug,
      slug,
      title: currentTopicTitle,
      level: currentLevel,
      section: currentSection,
      icon: getTopicIcon(currentTopicTitle),
      content,
      description: extractDescription(content),
    });
  }
  currentTopicTitle = "";
  currentTopicContent = [];
};

for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith("# BAGIAN III")) {
    flushTopic();
    currentLevel = "kuliah";
    currentSection = "Matematika Universitas";
    continue;
  }
  if (trimmed.startsWith("# BAGIAN II")) {
    flushTopic();
    currentLevel = "sma";
    currentSection = "Matematika SMA";
    continue;
  }
  if (trimmed.startsWith("# BAGIAN I")) {
    currentLevel = "smp";
    currentSection = "Matematika SMP";
    continue;
  }
  if (trimmed.startsWith("### ")) {
    flushTopic();
    currentTopicTitle = trimmed.replace("### ", "").trim();
    continue;
  }
  if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
    const sectionTitle = trimmed.replace("## ", "").trim();
    if (sectionTitle.includes("Daftar Isi")) continue;
    currentSection = sectionTitle;
    continue;
  }
  if (currentTopicTitle && trimmed && trimmed !== "---") {
    currentTopicContent.push(line);
  }
}
flushTopic();

// Add fallback topics for missing sections
const smaTopics = [
  "Eksponen dan Bentuk Akar", "Logaritma", "Persamaan dan Fungsi Kuadrat",
  "Pertidaksamaan (Kuadrat, Rasional, Mutlak)", "SPLTV dan Program Linear",
  "Matriks", "Vektor", "Trigonometri Dasar", "Identitas dan Persamaan Trigonometri",
  "Aturan Sinus, Cosinus, dan Luas Segitiga", "Barisan dan Deret Aritmetika",
  "Barisan dan Deret Geometri", "Limit Fungsi", "Turunan (Diferensial)",
  "Aplikasi Turunan", "Integral", "Aplikasi Integral", "Statistika Lanjut",
  "Kaidah Pencacahan, Permutasi, Kombinasi", "Peluang",
  "Persamaan Lingkaran dan Irisan Kerucut", "Bilangan Kompleks",
];

const kuliahTopics = [
  "Calculus (Kalkulus I-III)", "Linear Algebra (Aljabar Linear)",
  "Differential Equations", "Real Analysis", "Abstract Algebra",
  "Discrete Mathematics", "Probability & Statistics",
  "Complex Analysis", "Topology", "Number Theory",
  "Numerical Methods", "Optimization", "Mathematical Logic",
];

const existingSlugs = new Set(topics.map((t) => t.slug));
const existingLevels = new Set(topics.map((t) => t.level));

// Only add fallback topics if markdown doesn't have content for that level
if (!existingLevels.has("sma")) {
  smaTopics.forEach((title) => {
    const slug = createSlug(title);
    topics.push({
      id: slug, slug, title, level: "sma", section: "Matematika SMA",
      icon: getTopicIcon(title),
      content: `### ${title}\n\n**Konsep:** ${title} adalah materi penting dalam matematika SMA.`,
      description: `Materi ${title} untuk tingkat SMA`,
    });
  });
}

if (!existingLevels.has("kuliah")) {
  kuliahTopics.forEach((title) => {
    const slug = createSlug(title);
    topics.push({
      id: slug, slug, title, level: "kuliah", section: "Matematika Universitas",
      icon: getTopicIcon(title),
      content: `### ${title}\n\n**Konsep:** ${title} adalah materi penting dalam kurikulum matematika universitas.`,
      description: `Materi ${title} untuk tingkat universitas`,
    });
  });
}

const outPath = path.join(__dirname, "..", "src", "lib", "topics.json");
fs.writeFileSync(outPath, JSON.stringify(topics, null, 2));
console.log(`Generated ${topics.length} topics to topics.json`);
