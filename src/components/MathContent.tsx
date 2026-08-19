"use client";

import { useEffect, useRef } from "react";
import katex from "katex";

interface MathContentProps {
  content: string;
}

export default function MathContent({ content }: MathContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const html = renderMarkdownToHTML(content);
    containerRef.current.innerHTML = html;

    containerRef.current.querySelectorAll<HTMLElement>("code.katex-inline").forEach((el) => {
      try {
        katex.render(el.textContent || "", el, {
          throwOnError: false,
          displayMode: false,
        });
      } catch {
        el.textContent = el.textContent;
      }
    });

    containerRef.current.querySelectorAll<HTMLElement>("div.katex-block").forEach((el) => {
      try {
        katex.render(el.getAttribute("data-formula") || "", el, {
          throwOnError: false,
          displayMode: true,
        });
      } catch {
        el.textContent = el.getAttribute("data-formula");
      }
    });
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="prose prose-blue dark:prose-invert max-w-none
        prose-headings:scroll-mt-20
        prose-h2:text-2xl prose-h2:font-bold prose-h2:text-gray-900 dark:prose-h2:text-gray-100 prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-xl prose-h3:font-semibold prose-h3:text-gray-800 dark:prose-h3:text-gray-200 prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
        prose-li:text-gray-700 dark:prose-li:text-gray-300
        prose-strong:text-gray-900 dark:prose-strong:text-gray-100
        prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-gray-900 prose-pre:text-gray-100
        prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/10 prose-blockquote:py-1
        prose-hr:border-gray-200 dark:prose-hr:border-gray-700"
    />
  );
}

function renderMarkdownToHTML(md: string): string {
  let html = md;

  html = html.replace(/\$\$([^$]+)\$\$/g, (_, formula) => {
    const escaped = formula.replace(/"/g, "&quot;");
    return `<div class="katex-block" data-formula="${escaped}"></div>`;
  });

  html = html.replace(/\$([^$]+)\$/g, (_, formula) => {
    return `<code class="katex-inline">${formula}</code>`;
  });

  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");

  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  html = html.replace(/^---$/gm, "<hr />");

  html = html.replace(/\n\n/g, "</p><p>");
  html = `<p>${html}</p>`;

  html = html.replace(/<p>\s*<(h[23]|ul|hr|div)/g, "<$1");
  html = html.replace(/<\/(h[23]|ul|hr|div)>\s*<\/p>/g, "</$1>");
  html = html.replace(/<p>\s*<\/p>/g, "");

  return html;
}
