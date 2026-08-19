"use client";

import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";
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
          {/* Animated 404 */}
          <motion.div
            className="relative mb-6"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-8xl font-black text-[var(--duo-text)] opacity-10">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[var(--duo-xp)]/10 flex items-center justify-center">
                <Search size={36} className="text-[var(--duo-xp)]" />
              </div>
            </div>
          </motion.div>

          <h1 className="text-2xl font-black text-[var(--duo-text)] mb-2">Halaman Tidak Ditemukan</h1>
          <p className="text-sm text-[var(--duo-text-muted)] mb-6">
            Sepertinya halaman yang kamu cari sudah dipindahkan atau tidak tersedia.
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
