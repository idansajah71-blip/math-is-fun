"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Flag, ToggleLeft, ToggleRight, Settings } from "lucide-react";
import { getAllFlags, toggleFlag, type FeatureFlag } from "@/lib/admin/flags";
import { getAdminSession } from "@/lib/adminAuth";
import { logAudit } from "@/lib/admin/audit";

const CATEGORY_LABELS: Record<string, string> = {
  gamification: "Gamification",
  learning: "Pembelajaran",
  social: "Sosial",
  engagement: "Engagement",
  ux: "User Experience",
  access: "Akses",
  monetization: "Monetisasi",
  custom: "Lainnya",
};

const CATEGORY_COLORS: Record<string, string> = {
  gamification: "bg-yellow-100 dark:bg-yellow-900/30",
  learning: "bg-blue-100 dark:bg-blue-900/30",
  social: "bg-pink-100 dark:bg-pink-900/30",
  engagement: "bg-purple-100 dark:bg-purple-900/30",
  ux: "bg-green-100 dark:bg-green-900/30",
  access: "bg-cyan-100 dark:bg-cyan-900/30",
  monetization: "bg-orange-100 dark:bg-orange-900/30",
  custom: "bg-gray-100 dark:bg-gray-800",
};

export default function AdminFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);

  const load = useCallback(() => {
    setFlags(getAllFlags());
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleToggle(key: string) {
    const flag = flags.find((f) => f.key === key);
    if (!flag) return;

    toggleFlag(key);
    const session = getAdminSession();
    if (session) {
      logAudit(session.email, session.name, flag.isEnabled ? "disable_flag" : "enable_flag", "flag", key,
        { isEnabled: flag.isEnabled }, { isEnabled: !flag.isEnabled });
    }
    load();
  }

  const grouped: Record<string, FeatureFlag[]> = {};
  for (const flag of flags) {
    if (!grouped[flag.category]) grouped[flag.category] = [];
    grouped[flag.category].push(flag);
  }

  const enabledCount = flags.filter((f) => f.isEnabled).length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-[var(--duo-text)] flex items-center gap-3">
          <Flag size={24} className="text-cyan-500" />
          Feature Flags
        </h1>
        <p className="text-sm text-[var(--duo-text-muted)] mt-1">
          {enabledCount}/{flags.length} fitur aktif
        </p>
      </motion.div>

      {Object.entries(grouped).map(([category, catFlags], ci) => (
        <motion.div key={category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.05 }}>
          <h3 className="text-xs font-bold text-[var(--duo-text-muted)] mb-3 uppercase tracking-wide flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${catFlags.some((f) => f.isEnabled) ? "bg-green-500" : "bg-gray-300"}`} />
            {CATEGORY_LABELS[category] || category}
          </h3>
          <div className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] overflow-hidden divide-y divide-[var(--duo-border)]">
            {catFlags.map((flag) => (
              <div key={flag.key} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${CATEGORY_COLORS[category] || "bg-gray-100"}`}>
                  <Settings size={18} className={flag.isEnabled ? "text-green-500" : "text-gray-400"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--duo-text)]">{flag.label}</p>
                  <p className="text-[10px] text-[var(--duo-text-muted)]">{flag.description}</p>
                </div>
                <button onClick={() => handleToggle(flag.key)} className="shrink-0 transition-transform hover:scale-110">
                  {flag.isEnabled ? (
                    <ToggleRight size={36} className="text-green-500" fill="currentColor" />
                  ) : (
                    <ToggleLeft size={36} className="text-gray-300 dark:text-gray-600" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
