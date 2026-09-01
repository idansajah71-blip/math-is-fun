"use client";

import { useEffect, useRef } from "react";
import katex from "katex";

interface MathContentProps {
  content: string;
  className?: string;
}

interface ParsedSection {
  type: "intro" | "konsep" | "rumusKunci" | "contoh";
  content: string;
}

const PROSE_CLASSES = `math-content prose prose-blue dark:prose-invert max-w-none
  prose-headings:scroll-mt-20
  prose-h2:text-lg prose-h2:font-black prose-h2:text-[var(--duo-text)] prose-h2:mt-6 prose-h2:mb-2
  prose-h3:text-base prose-h3:font-bold prose-h3:text-[var(--duo-text)] prose-h3:mt-5 prose-h3:mb-2
  prose-p:text-sm prose-p:text-[var(--duo-text-secondary)] prose-p:leading-relaxed prose-p:mb-2
  prose-li:text-sm prose-li:text-[var(--duo-text-secondary)]
  prose-strong:text-[var(--duo-text)] prose-strong:font-bold
  prose-code:text-[var(--info)] prose-code:bg-[var(--info-bg)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
  prose-blockquote:border-l-[var(--primary)] prose-blockquote:bg-[var(--primary-bg)]/50 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
  prose-hr:border-[var(--border-subtle)] prose-hr:my-4`;

function parseSections(content: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  const parts = content.split(/(\*\*(?:Konsep|Rumus Kunci|Contoh):?\*\*\s*)/);

  let currentType: ParsedSection["type"] = "intro";

  for (const part of parts) {
    const markerMatch = part.match(/\*\*(Konsep|Rumus Kunci|Contoh):?\*\*\s*/);
    if (markerMatch) {
      const name = markerMatch[1];
      currentType = name === "Rumus Kunci" ? "rumusKunci" : (name.toLowerCase() as ParsedSection["type"]);
    } else if (part.trim()) {
      sections.push({ type: currentType, content: part.trim() });
    }
  }

  return sections;
}

export default function MathContent({ content, className = "" }: MathContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sections = parseSections(content);
  const hasSections = sections.some((s) => s.type !== "intro");

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.querySelectorAll<HTMLElement>("code.katex-inline").forEach((el) => {
      if (el.querySelector(".katex")) return;
      try {
        katex.render(el.textContent || "", el, { throwOnError: false, displayMode: false });
      } catch {
        el.classList.add("text-[var(--danger)]");
      }
    });

    containerRef.current.querySelectorAll<HTMLElement>("div.katex-block").forEach((el) => {
      if (el.querySelector(".katex")) return;
      try {
        katex.render(el.getAttribute("data-formula") || "", el, { throwOnError: false, displayMode: true });
      } catch {
        const formula = el.getAttribute("data-formula") || "";
        el.innerHTML = `<code class="text-[var(--danger)] text-sm">${escapeHtml(formula)}</code>`;
      }
    });
  }, [content]);

  if (hasSections) {
    return (
      <div ref={containerRef} className={`space-y-4 ${className}`}>
        {sections.map((section, i) => (
          <SectionBlock key={i} section={section} />
        ))}
      </div>
    );
  }

  const html = normalizeAndRenderMarkdown(content);
  return (
    <div
      ref={containerRef}
      className={`${PROSE_CLASSES} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function SectionBlock({ section }: { section: ParsedSection }) {
  const html = normalizeAndRenderMarkdown(section.content);

  const config: Record<string, { icon: string; label: string; ring: string; bg: string; border: string }> = {
    konsep: {
      icon: "💡",
      label: "Konsep",
      ring: "ring-blue-200 dark:ring-blue-800",
      bg: "bg-blue-50/60 dark:bg-blue-950/30",
      border: "border-blue-400 dark:border-blue-600",
    },
    rumusKunci: {
      icon: "📐",
      label: "Rumus Kunci",
      ring: "ring-emerald-200 dark:ring-emerald-800",
      bg: "bg-emerald-50/60 dark:bg-emerald-950/30",
      border: "border-emerald-400 dark:border-emerald-600",
    },
    contoh: {
      icon: "✏️",
      label: "Contoh",
      ring: "ring-amber-200 dark:ring-amber-800",
      bg: "bg-amber-50/60 dark:bg-amber-950/30",
      border: "border-amber-400 dark:border-amber-600",
    },
  };

  if (section.type === "intro" || !config[section.type]) {
    return (
      <div
        ref={(el) => {
          if (!el) return;
          el.querySelectorAll<HTMLElement>("code.katex-inline").forEach((c) => {
            if (c.querySelector(".katex")) return;
            try { katex.render(c.textContent || "", c, { throwOnError: false, displayMode: false }); } catch { /* skip */ }
          });
          el.querySelectorAll<HTMLElement>("div.katex-block").forEach((d) => {
            if (d.querySelector(".katex")) return;
            try { katex.render(d.getAttribute("data-formula") || "", d, { throwOnError: false, displayMode: true }); } catch { /* skip */ }
          });
        }}
        className={PROSE_CLASSES}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  const cfg = config[section.type];

  return (
    <div className={`relative ${cfg.bg} border-l-4 ${cfg.border} rounded-r-2xl px-5 py-4 ring-1 ${cfg.ring}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base leading-none">{cfg.icon}</span>
        <span className="text-xs font-extrabold text-[var(--duo-text)] uppercase tracking-wider">{cfg.label}</span>
      </div>
      <div
        ref={(el) => {
          if (!el) return;
          el.querySelectorAll<HTMLElement>("code.katex-inline").forEach((c) => {
            if (c.querySelector(".katex")) return;
            try { katex.render(c.textContent || "", c, { throwOnError: false, displayMode: false }); } catch { /* skip */ }
          });
          el.querySelectorAll<HTMLElement>("div.katex-block").forEach((d) => {
            if (d.querySelector(".katex")) return;
            try { katex.render(d.getAttribute("data-formula") || "", d, { throwOnError: false, displayMode: true }); } catch { /* skip */ }
          });
        }}
        className={PROSE_CLASSES}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escapeMarkdownText(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function normalizeFormula(formula: string): string {
  let f = formula.trim();
  f = f.split("\\(").join("(");
  f = f.split("\\)").join(")");
  f = f.split("\\[").join("[");
  f = f.split("\\]").join("]");
  f = f.split("\\cdot").join("\\cdot ");
  f = f.split("\\times").join("\\times ");
  f = f.split("\\div").join("\\div ");
  f = f.split("\\pm").join("\\pm ");
  f = f.split("\\mp").join("\\mp ");
  const open = (f.match(/\{/g) || []).length;
  const close = (f.match(/\}/g) || []).length;
  if (open > close) f += "}".repeat(open - close);
  return f;
}

function normalizeAndRenderMarkdown(md: string): string {
  let html = md;
  html = html.replace(/\r\n/g, "\n");

  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, formula) => {
    const normalized = normalizeFormula(formula);
    const escaped = escapeHtml(normalized);
    return `<div class="katex-block my-4" data-formula="${escaped}"></div>`;
  });

  html = html.replace(/\$([^\$\n]+?)\$/g, (_, formula) => {
    const normalized = normalizeFormula(formula);
    return `<code class="katex-inline">${escapeHtml(normalized)}</code>`;
  });

  html = html.replace(/^### (.+)$/gm, (_, t) => `<h3>${escapeMarkdownText(t)}</h3>`);
  html = html.replace(/^## (.+)$/gm, (_, t) => `<h2>${escapeMarkdownText(t)}</h2>`);
  html = html.replace(/\*\*([^*]+)\*\*/g, (_, t) => `<strong>${escapeMarkdownText(t)}</strong>`);
  html = html.replace(/\*([^*]+)\*/g, (_, t) => `<em>${escapeMarkdownText(t)}</em>`);
  html = html.replace(/^- (.+)$/gm, (_, t) => `<li>${escapeMarkdownText(t)}</li>`);
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);
  html = html.replace(/^---$/gm, "<hr />");
  html = html.replace(/\n\n/g, "</p><p>");
  html = `<p>${html}</p>`;
  html = html.replace(/<p>\s*<(h[23]|ul|hr|div)/g, "<$1");
  html = html.replace(/<\/(h[23]|ul|hr|div)>\s*<\/p>/g, "</$1>");
  html = html.replace(/<p>\s*<\/p>/g, "");
  html = html.replace(/<p>\s*<p>/g, "<p>");
  html = html.replace(/<\/p>\s*<\/p>/g, "</p>");

  return html;
}
