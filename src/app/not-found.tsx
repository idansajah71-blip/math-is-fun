"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)] items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white dark:bg-[var(--duo-card)] rounded-[28px] border-2 border-[var(--duo-border)] p-8 shadow-lg">
          <h1 className="text-8xl font-black text-[var(--duo-text)] opacity-10 mb-4">404</h1>
          <p className="text-sm text-[var(--duo-text-muted)] mb-6">
            Halaman tidak ditemukan.
          </p>

          <div className="flex gap-3">
            <Link href="/" className="flex-1">
              <AnimatedButton
                variant="primary"
                fullWidth
                icon={<Home size={16} />}
              >
                Beranda
              </AnimatedButton>
            </Link>
            <AnimatedButton
              onClick={() => window.history.back()}
              variant="outline"
              fullWidth
              icon={<ArrowLeft size={16} />}
            >
              Kembali
            </AnimatedButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
