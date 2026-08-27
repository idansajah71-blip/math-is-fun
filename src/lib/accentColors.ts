"use client";

export type AccentColor = "green" | "blue" | "purple" | "orange" | "rose" | "teal";

export interface AccentTheme {
  name: string;
  label: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryBg: string;
  ring: string;
}

export const ACCENT_THEMES: Record<AccentColor, AccentTheme> = {
  green: {
    name: "green",
    label: "Hijau",
    primary: "#58CC02",
    primaryHover: "#46A302",
    primaryLight: "#89E219",
    primaryBg: "rgba(88, 204, 2, 0.1)",
    ring: "rgba(88, 204, 2, 0.4)",
  },
  blue: {
    name: "blue",
    label: "Biru",
    primary: "#1CB0F6",
    primaryHover: "#1899D6",
    primaryLight: "#4DC9FF",
    primaryBg: "rgba(28, 176, 246, 0.1)",
    ring: "rgba(28, 176, 246, 0.4)",
  },
  purple: {
    name: "purple",
    label: "Ungu",
    primary: "#A855F7",
    primaryHover: "#9333EA",
    primaryLight: "#C084FC",
    primaryBg: "rgba(168, 85, 247, 0.1)",
    ring: "rgba(168, 85, 247, 0.4)",
  },
  orange: {
    name: "orange",
    label: "Oranye",
    primary: "#FF9600",
    primaryHover: "#E58700",
    primaryLight: "#FFB340",
    primaryBg: "rgba(255, 150, 0, 0.1)",
    ring: "rgba(255, 150, 0, 0.4)",
  },
  rose: {
    name: "rose",
    label: "Merah Muda",
    primary: "#F43F5E",
    primaryHover: "#E11D48",
    primaryLight: "#FB7185",
    primaryBg: "rgba(244, 63, 94, 0.1)",
    ring: "rgba(244, 63, 94, 0.4)",
  },
  teal: {
    name: "teal",
    label: "Toska",
    primary: "#14B8A6",
    primaryHover: "#0D9488",
    primaryLight: "#2DD4BF",
    primaryBg: "rgba(20, 184, 166, 0.1)",
    ring: "rgba(20, 184, 166, 0.4)",
  },
};

const STORAGE_KEY = "matika-accent";

export function getAccentColor(): AccentColor {
  if (typeof window === "undefined") return "green";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in ACCENT_THEMES) return stored as AccentColor;
  return "green";
}

export function setAccentColor(color: AccentColor) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, color);
  applyAccentTheme(color);
}

export function applyAccentTheme(color: AccentColor) {
  if (typeof window === "undefined") return;
  const theme = ACCENT_THEMES[color];
  const root = document.documentElement;
  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--primary-hover", theme.primaryHover);
  root.style.setProperty("--primary-light", theme.primaryLight);
  root.style.setProperty("--primary-bg", theme.primaryBg);
  root.style.setProperty("--duo-green", theme.primary);
  root.style.setProperty("--duo-green-dark", theme.primaryHover);
  root.style.setProperty("--duo-green-light", theme.primaryLight);
  root.style.setProperty("--duo-green-bg", theme.primaryBg);
  root.style.setProperty("--shadow-button", `0 4px 0 ${theme.primaryHover}`);
  root.style.setProperty("--focus-ring", theme.ring);
}

export function initAccentTheme() {
  if (typeof window === "undefined") return;
  const color = getAccentColor();
  applyAccentTheme(color);
}
