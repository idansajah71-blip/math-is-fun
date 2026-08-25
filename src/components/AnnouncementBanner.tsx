"use client";

import { useState, useEffect } from "react";
import { Megaphone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/lib/gamification";

interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: "all" | "premium" | "free";
  isActive: boolean;
}

const ANNOUNCEMENTS_KEY = "belajarmtk_announcements";

function getActiveAnnouncements(profile: UserProfile | null): Announcement[] {
  try {
    const all: Announcement[] = JSON.parse(localStorage.getItem(ANNOUNCEMENTS_KEY) || "[]");
    return all.filter((a) => {
      if (!a.isActive) return false;
      if (a.audience === "all") return true;
      if (a.audience === "premium") return profile?.isPremium ?? false;
      if (a.audience === "free") return !(profile?.isPremium);
      return true;
    });
  } catch {
    return [];
  }
}

const DISMISSED_KEY = "belajarmtk_announcements_dismissed";

export default function AnnouncementBanner({ profile }: { profile: UserProfile | null }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const active = getActiveAnnouncements(profile);
    try {
      const d = JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]");
      setDismissed(new Set(d));
    } catch {}
    setAnnouncements(active);
  }, [profile]);

  const visible = announcements.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  function dismiss(id: string) {
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
    try {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify([...next]));
    } catch {}
  }

  return (
    <div className="mb-4 space-y-2">
      <AnimatePresence>
        {visible.map((a) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="bg-gradient-to-r from-[var(--primary)] to-[var(--duo-green-dark)] rounded-2xl p-4 text-white relative"
          >
            <button
              onClick={() => dismiss(a.id)}
              className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X size={14} />
            </button>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                <Megaphone size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-sm leading-tight">{a.title}</h3>
                <p className="text-xs text-white/80 mt-1 leading-relaxed">{a.body}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
