"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)] items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--duo-green)] flex items-center justify-center"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="text-white font-black text-2xl">M</span>
        </motion.div>

        <div className="flex items-center gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[var(--duo-green)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>

        <p className="mt-4 text-sm font-bold text-[var(--duo-text-muted)]">Memuat...</p>
      </motion.div>
    </div>
  );
}
