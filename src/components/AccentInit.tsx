"use client";

import { useEffect } from "react";
import { initAccentTheme } from "@/lib/accentColors";

export default function AccentInit() {
  useEffect(() => {
    initAccentTheme();
  }, []);

  return null;
}
