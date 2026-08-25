"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { History, Search, Filter, Trash2, User, FileText, Shield, Calendar } from "lucide-react";
import { getAuditEntries, clearAuditLog, type AuditEntry } from "@/lib/admin/audit";

const ACTION_COLORS: Record<string, string> = {
  create_topic: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  update_topic: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  delete_topic: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  publish_topic: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  unpublish_topic: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  create_question: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  update_question: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  delete_question: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  upgrade_premium: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  remove_premium: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  login: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
};

const ACTION_LABELS: Record<string, string> = {
  create_topic: "Buat Topik",
  update_topic: "Edit Topik",
  delete_topic: "Hapus Topik",
  publish_topic: "Publish Topik",
  unpublish_topic: "Unpublish Topik",
  create_question: "Buat Soal",
  update_question: "Edit Soal",
  delete_question: "Hapus Soal",
  upgrade_premium: "Upgrade Premium",
  remove_premium: "Cabut Premium",
  login: "Login Admin",
};

export default function AdminAuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(() => {
    setEntries(getAuditEntries({ limit: 200 }));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = entries.filter((e) => {
    const matchSearch = !search ||
      e.adminName.toLowerCase().includes(search.toLowerCase()) ||
      e.adminEmail.toLowerCase().includes(search.toLowerCase()) ||
      e.target.toLowerCase().includes(search.toLowerCase()) ||
      e.targetId.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === "all" || e.action === actionFilter;
    return matchSearch && matchAction;
  });

  const actionTypes = [...new Set(entries.map((e) => e.action))];

  function handleClear() {
    if (!confirm("Hapus semua audit log? Tindakan ini tidak bisa dibatalkan.")) return;
    clearAuditLog();
    load();
  }

  function formatTime(ts: string) {
    try {
      return new Date(ts).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch { return ts; }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--duo-text)] flex items-center gap-3">
            <History size={24} className="text-orange-500" />
            Audit Log
          </h1>
          <p className="text-sm text-[var(--duo-text-muted)] mt-1">{entries.length} entri tercatat</p>
        </div>
        <button onClick={handleClear}
          className="px-4 py-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-500 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
          <Trash2 size={14} /> Clear Log
        </button>
      </motion.div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--duo-text-muted)]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari admin, aksi, target..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[var(--duo-card)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] placeholder:text-gray-400 focus:outline-none focus:border-orange-500 transition-colors" />
        </div>
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-[var(--duo-card)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-orange-500">
          <option value="all">Semua Aksi</option>
          {actionTypes.map((a) => <option key={a} value={a}>{ACTION_LABELS[a] || a}</option>)}
        </select>
      </div>

      {/* Log Entries */}
      <div className="space-y-2">
        {filtered.map((entry, i) => (
          <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }}
            className="bg-white dark:bg-[var(--duo-card)] rounded-xl border-2 border-[var(--duo-border)] overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors"
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}>
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                <Shield size={14} className="text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${ACTION_COLORS[entry.action] || "bg-gray-100 text-gray-600"}`}>
                    {ACTION_LABELS[entry.action] || entry.action}
                  </span>
                  <span className="text-xs font-bold text-[var(--duo-text)]">{entry.target}</span>
                  <span className="text-[10px] text-[var(--duo-text-muted)]">{entry.targetId}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-[var(--duo-text-muted)]">oleh {entry.adminName}</span>
                  <span className="text-[10px] text-[var(--duo-text-muted)]">·</span>
                  <span className="text-[10px] text-[var(--duo-text-muted)]">{formatTime(entry.timestamp)}</span>
                </div>
              </div>
            </div>
            {expanded === entry.id && (entry.before != null || entry.after != null) && (
              <div className="border-t border-[var(--duo-border)] px-4 py-3 bg-gray-50 dark:bg-gray-900/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {entry.before != null && (
                    <div>
                      <p className="font-bold text-red-500 mb-1">Sebelum:</p>
                      <pre className="bg-red-50 dark:bg-red-950/20 p-2 rounded-lg overflow-x-auto text-[10px] font-mono text-[var(--duo-text)]">
                        {String(typeof entry.before === "string" ? entry.before : JSON.stringify(entry.before, null, 2))}
                      </pre>
                    </div>
                  )}
                  {entry.after != null && (
                    <div>
                      <p className="font-bold text-green-500 mb-1">Sesudah:</p>
                      <pre className="bg-green-50 dark:bg-green-950/20 p-2 rounded-lg overflow-x-auto text-[10px] font-mono text-[var(--duo-text)]">
                        {String(typeof entry.after === "string" ? entry.after : JSON.stringify(entry.after, null, 2))}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)]">
            <History size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-[var(--duo-text)]">Belum ada audit log</p>
            <p className="text-xs text-[var(--duo-text-muted)]">Aksi admin akan tercatat di sini</p>
          </div>
        )}
      </div>
    </div>
  );
}
