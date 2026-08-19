"use client";

import { useState, useEffect } from "react";
import { isSoundEnabled, setSoundEnabled } from "@/lib/sounds";

export function useSoundManager() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(isSoundEnabled());
  }, []);

  const toggle = () => {
    const newVal = !enabled;
    setEnabled(newVal);
    setSoundEnabled(newVal);
  };

  return { enabled, toggle };
}
