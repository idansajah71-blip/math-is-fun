"use client";

import { useRef, useEffect } from "react";
import katex from "katex";

interface Props {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export default function KaTeX({ formula, displayMode = false, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    try {
      katex.render(formula, ref.current, { throwOnError: false, displayMode });
    } catch {
      ref.current.textContent = formula;
    }
  }, [formula, displayMode]);

  return (
    <span
      ref={ref}
      className={displayMode ? `text-2xl md:text-3xl ${className}` : `text-sm ${className}`}
    />
  );
}
