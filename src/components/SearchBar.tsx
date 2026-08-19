"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { searchTopics } from "@/lib/mathData";
import type { Topic } from "@/lib/types";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Topic[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.length >= 2) {
      const found = searchTopics(query).slice(0, 8);
      setResults(found);
      setIsOpen(found.length > 0);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      router.push(`/topic/${results[selectedIndex].slug}`);
      setQuery("");
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const levelColors = {
    smp: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    sma: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    kuliah: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Cari topik matematika..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-96 overflow-y-auto">
          {results.map((topic, index) => (
            <button
              key={topic.id}
              onClick={() => {
                router.push(`/topic/${topic.slug}`);
                setQuery("");
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                index === selectedIndex
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-xl">{topic.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {topic.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {topic.description}
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelColors[topic.level]}`}>
                {topic.level.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
