"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, CheckCheck, Calendar, Users, Trophy, X } from "lucide-react";
import { getUnreadCount, getAllNotifications, markAsRead, markAllAsRead, clearOldNotifications } from "@/lib/notifications";
import type { Notification } from "@/lib/notifications";
import { useRouter } from "next/navigation";

const TYPE_ICON: Record<string, React.ReactNode> = {
  event_active: <Calendar size={14} className="text-green-500" />,
  event_ending: <Calendar size={14} className="text-orange-500" />,
  event_done: <Trophy size={14} className="text-blue-500" />,
  room_invite: <Users size={14} className="text-purple-500" />,
  room_result: <Trophy size={14} className="text-yellow-500" />,
};

const TYPE_BG: Record<string, string> = {
  event_active: "bg-green-50 dark:bg-green-900/20",
  event_ending: "bg-orange-50 dark:bg-orange-900/20",
  event_done: "bg-blue-50 dark:bg-blue-900/20",
  room_invite: "bg-purple-50 dark:bg-purple-900/20",
  room_result: "bg-yellow-50 dark:bg-yellow-900/20",
};

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  const refresh = useCallback(() => {
    setCount(getUnreadCount());
  }, []);

  useEffect(() => {
    refresh();
    clearOldNotifications(7);
    window.addEventListener("notif-updated", refresh);
    return () => window.removeEventListener("notif-updated", refresh);
  }, [refresh]);

  function handleOpen() {
    setOpen(!open);
    if (!open) {
      setNotifications(getAllNotifications());
    }
  }

  function handleClick(n: Notification) {
    markAsRead(n.id);
    refresh();
    if (n.href) {
      router.push(n.href);
    }
    setOpen(false);
  }

  function handleMarkAll() {
    markAllAsRead();
    refresh();
    setNotifications(getAllNotifications());
  }

  return (
    <div className="relative">
      <button onClick={handleOpen}
        className="relative p-2 rounded-xl hover:bg-[var(--duo-card)] transition-colors">
        <Bell size={18} className="text-[var(--duo-text-muted)]" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 w-80 bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--duo-border)]">
                <span className="text-sm font-black text-[var(--duo-text)]">Notifikasi</span>
                <div className="flex items-center gap-2">
                  {count > 0 && (
                    <button onClick={handleMarkAll} className="text-[10px] font-bold text-[var(--duo-green)] hover:underline">
                      <CheckCheck size={14} />
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} className="text-[var(--duo-text-muted)] hover:text-[var(--duo-text)]">
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell size={24} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-[var(--duo-text-muted)]">Belum ada notifikasi</p>
                  </div>
                ) : (
                  notifications.slice(0, 20).map((n) => (
                    <button key={n.id} onClick={() => handleClick(n)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[var(--duo-bg)] transition-colors ${!n.read ? TYPE_BG[n.type] || "" : ""}`}>
                      <div className="w-8 h-8 rounded-lg bg-[var(--duo-card)] border border-[var(--duo-border)] flex items-center justify-center shrink-0 mt-0.5">
                        {TYPE_ICON[n.type] || <Bell size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[var(--duo-text)]">{n.title}</p>
                        <p className="text-[10px] text-[var(--duo-text-muted)] mt-0.5 line-clamp-2">{n.message}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-[var(--duo-green)] shrink-0 mt-1" />}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
