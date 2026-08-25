"use client";

import { isFlagEnabled } from "@/lib/admin/flags";
import { motion } from "framer-motion";
import { Ban, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FeatureGuardProps {
  flag: string;
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export default function FeatureGuard({ flag, children, fallbackTitle, fallbackDescription }: FeatureGuardProps) {
  if (isFlagEnabled(flag)) return <>{children}</>;

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md mx-auto p-8"
      >
        <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: "var(--surface-sunken)" }}>
          <Ban size={32} className="text-[var(--fg-disabled)]" />
        </div>
        <h2 className="text-lg font-black text-[var(--fg)] mb-2">
          {fallbackTitle || "Fitur Dinonaktifkan"}
        </h2>
        <p className="text-sm text-[var(--fg-muted)] mb-6">
          {fallbackDescription || "Fitur ini sedang dinonaktifkan oleh admin. Silakan coba lagi nanti."}
        </p>
        <Link href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: "var(--primary)" }}
        >
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>
      </motion.div>
    </div>
  );
}
