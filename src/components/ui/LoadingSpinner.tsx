"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className={`${sizes[size]} border-4 border-[var(--duo-border)] border-t-[var(--duo-green)] rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-6 space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-1/3 animate-pulse" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3 animate-pulse" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-1/2 animate-pulse" />
      <div className="flex gap-2 mt-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl flex-1 animate-pulse" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-20 animate-pulse" />
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <div className="hidden lg:flex w-[260px] h-screen bg-white dark:bg-[var(--duo-card)] border-r-2 border-[var(--duo-border)] flex-col fixed left-0 top-0 z-40 p-4">
        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-xl w-32 animate-pulse mb-6" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
      <main className="flex-1 lg:ml-[260px] p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-48 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
