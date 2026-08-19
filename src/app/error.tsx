"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)] items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white dark:bg-[var(--duo-card)] rounded-[28px] border-2 border-[var(--duo-border)] p-8 shadow-lg">
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AlertTriangle size={36} className="text-[var(--duo-danger)]" />
          </motion.div>

          <h1 className="text-2xl font-black text-[var(--duo-text)] mb-2">Ups! Ada Error</h1>
          <p className="text-sm text-[var(--duo-text-muted)] mb-6">
            Terjadi kesalahan yang tidak terduga. Jangan khawatir, kamu bisa coba lagi.
          </p>

          {error.digest && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-[10px] font-mono text-[var(--duo-text-muted)]">Error ID: {error.digest}</p>
            </div>
          )}

          <div className="flex gap-3">
            <AnimatedButton
              onClick={reset}
              variant="primary"
              fullWidth
              icon={<RefreshCcw size={16} />}
            >
              Coba Lagi
            </AnimatedButton>
            <Link href="/" className="flex-1">
              <AnimatedButton
                variant="outline"
                fullWidth
                icon={<Home size={16} />}
              >
                Beranda
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
