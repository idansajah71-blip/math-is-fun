"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark, CheckCircle2, ChevronRight } from "lucide-react";

export default function TopicCard({ slug, title, level, description, index }: {
  slug: string; title: string; level: "smp" | "sma" | "kuliah"; icon: string; description: string; index: number;
}) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem("belajar-mtk-profile") || "{}");
    setIsCompleted(p.completedTopics?.includes(slug) || false);
    setIsBookmarked(p.bookmarkedTopics?.includes(slug) || false);
  }, [slug]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const p = JSON.parse(localStorage.getItem("belajar-mtk-profile") || "{}");
    const list = p.bookmarkedTopics || [];
    p.bookmarkedTopics = isBookmarked ? list.filter((b: string) => b !== slug) : [...list, slug];
    localStorage.setItem("belajar-mtk-profile", JSON.stringify(p));
    setIsBookmarked(!isBookmarked);
  };

  const dot = { smp: "bg-emerald-500", sma: "bg-[var(--primary)]", kuliah: "bg-purple-500" }[level];

  return (
    <Link href={`/topic/${slug}`} className="block group">
      <div className={`flex items-center gap-4 px-5 py-3.5 rounded-xl border transition-all duration-200 ${
        isCompleted ? "bg-[#f0fdf4] dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800" : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-[var(--primary)]/30 hover:shadow-md"
      }`}>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isCompleted ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-[var(--surface-elevated)] dark:bg-gray-800"}`}>
          {isCompleted ? <CheckCircle2 size={18} className="text-emerald-600" /> : <span className="text-xs font-bold text-gray-400">{index + 1}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            <h3 className="text-[13px] font-semibold text-[var(--fg)] dark:text-gray-100 group-hover:text-[var(--primary)] truncate">{title}</h3>
          </div>
          <p className="text-[11px] text-[var(--fg-muted)] truncate">{description}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={toggleBookmark} className={`p-1.5 rounded-md transition-colors ${isBookmarked ? "text-amber-500" : "text-gray-400 hover:text-amber-500"}`}>
            <Bookmark size={13} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
          <ChevronRight size={14} className="text-gray-300 group-hover:text-[var(--primary)]" />
        </div>
      </div>
    </Link>
  );
}
