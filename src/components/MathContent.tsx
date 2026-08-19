"use client";

import { useEffect, useRef } from "react";
import katex from "katex";

interface MathContentProps {
  content: string;
  className?: string;
}

export default function MathContent({ content, className = "" }: MathContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const html = normalizeAndRenderMarkdown(content);
    containerRef.current.innerHTML = html;

    // Render inline math
    containerRef.current.querySelectorAll<HTMLElement>("code.katex-inline").forEach((el) => {
      try {
        katex.render(el.textContent || "", el, {
          throwOnError: false,
          displayMode: false,
        });
      } catch {
        // Fallback: keep as code
        el.classList.add("text-[var(--danger)]");
      }
    });

    // Render block math
    containerRef.current.querySelectorAll<HTMLElement>("div.katex-block").forEach((el) => {
      try {
        katex.render(el.getAttribute("data-formula") || "", el, {
          throwOnError: false,
          displayMode: true,
        });
      } catch {
        // Fallback: show formula in a code block
        const formula = el.getAttribute("data-formula") || "";
        el.innerHTML = `<code class="text-[var(--danger)] text-sm">${escapeHtml(formula)}</code>`;
      }
    });
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={`math-content prose prose-blue dark:prose-invert max-w-none
        prose-headings:scroll-mt-20
        prose-h2:text-xl prose-h2:font-black prose-h2:text-[var(--fg)] prose-h2:mt-8 prose-h2:mb-3
        prose-h3:text-lg prose-h3:font-bold prose-h3:text-[var(--fg)] prose-h3:mt-6 prose-h3:mb-2
        prose-p:text-sm prose-p:text-[var(--fg-secondary)] prose-p:leading-relaxed prose-p:mb-3
        prose-li:text-sm prose-li:text-[var(--fg-secondary)]
        prose-strong:text-[var(--fg)] prose-strong:font-bold
        prose-code:text-[var(--info)] prose-code:bg-[var(--info-bg)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
        prose-blockquote:border-l-[var(--primary)] prose-blockquote:bg-[var(--primary-bg)]/50 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
        prose-hr:border-[var(--border-subtle)] prose-hr:my-6
        ${className}`}
    />
  );
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function normalizeFormula(formula: string): string {
  let f = formula.trim();

  // Normalize escaped brackets
  f = f.split("\\(").join("(");
  f = f.split("\\)").join(")");
  f = f.split("\\[").join("[");
  f = f.split("\\]").join("]");

  // Normalize common shortcuts
  f = f.split("\\cdot").join("\\cdot ");
  f = f.split("\\times").join("\\times ");
  f = f.split("\\div").join("\\div ");
  f = f.split("\\pm").join("\\pm ");
  f = f.split("\\mp").join("\\mp ");

  // Ensure balanced braces
  const open = (f.match(/\{/g) || []).length;
  const close = (f.match(/\}/g) || []).length;
  if (open > close) {
    f += "}".repeat(open - close);
  }

  return f;
}

function normalizeAndRenderMarkdown(md: string): string {
  let html = md;

  // Normalize line endings
  html = html.replace(/\r\n/g, "\n");

  // Block math: $$...$$ (must be before inline math)
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, formula) => {
    const normalized = normalizeFormula(formula);
    const escaped = escapeHtml(normalized);
    return `<div class="katex-block my-4" data-formula="${escaped}"></div>`;
  });

  // Inline math: $...$
  html = html.replace(/\$([^\$\n]+?)\$/g, (_, formula) => {
    const normalized = normalizeFormula(formula);
    return `<code class="katex-inline">${escapeHtml(normalized)}</code>`;
  });

  // Headers
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");

  // Bold and italic
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  // Horizontal rule
  html = html.replace(/^---$/gm, "<hr />");

  // Paragraphs
  html = html.replace(/\n\n/g, "</p><p>");
  html = `<p>${html}</p>`;

  // Clean up empty paragraphs and fix nesting
  html = html.replace(/<p>\s*<(h[23]|ul|hr|div)/g, "<$1");
  html = html.replace(/<\/(h[23]|ul|hr|div)>\s*<\/p>/g, "</$1>");
  html = html.replace(/<p>\s*<\/p>/g, "");
  html = html.replace(/<p>\s*<p>/g, "<p>");
  html = html.replace(/<\/p>\s*<\/p>/g, "</p>");

  return html;
}
