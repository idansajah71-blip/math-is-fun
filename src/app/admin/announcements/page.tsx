"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Plus, Edit3, Trash2, Eye, EyeOff, Save, X, Calendar, Users } from "lucide-react";
import { getAdminSession } from "@/lib/adminAuth";
import { logAudit } from "@/lib/admin/audit";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: "all" | "premium" | "free";
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

const ANNOUNCEMENTS_KEY = "matika_announcements";

function getAnnouncements(): Announcement[] {
  try {
    return JSON.parse(localStorage.getItem(ANNOUNCEMENTS_KEY) || "[]");
  } catch { return []; }
}

function saveAnnouncements(items: Announcement[]) {
  localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(items));
}

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", body: "", audience: "all" as Announcement["audience"], isActive: true });

  const load = useCallback(() => { setItems(getAnnouncements()); }, []);
  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setForm({ title: "", body: "", audience: "all", isActive: true });
    setEditing(null);
    setShowForm(false);
  }

  function handleSubmit() {
    const session = getAdminSession();
    const data: Announcement = {
      id: editing || `ann-${Date.now()}`,
      title: form.title,
      body: form.body,
      audience: form.audience,
      isActive: form.isActive,
      createdBy: session?.email || "admin",
      createdAt: editing ? (items.find((a) => a.id === editing)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
    };

    let updated: Announcement[];
    if (editing) {
      updated = items.map((a) => (a.id === editing ? data : a));
    } else {
      updated = [...items, data];
    }
    saveAnnouncements(updated);
    setItems(updated);
    if (session) logAudit(session.email, session.name, editing ? "update_announcement" : "create_announcement", "announcement", data.id, null, data);
    resetForm();
  }

  function handleEdit(id: string) {
    const a = items.find((x) => x.id === id);
    if (!a) return;
    setForm({ title: a.title, body: a.body, audience: a.audience, isActive: a.isActive });
    setEditing(id);
    setShowForm(true);
  }

  function handleDelete(id: string) {
    if (!confirm("Hapus pengumuman ini?")) return;
    const session = getAdminSession();
    const old = items.find((a) => a.id === id);
    const updated = items.filter((a) => a.id !== id);
    saveAnnouncements(updated);
    setItems(updated);
    if (session) logAudit(session.email, session.name, "delete_announcement", "announcement", id, old);
  }

  function handleToggle(id: string) {
    const a = items.find((x) => x.id === id);
    if (!a) return;
    const updated = items.map((x) => (x.id === id ? { ...x, isActive: !x.isActive } : x));
    saveAnnouncements(updated);
    setItems(updated);
  }

  const AUDIENCE_LABELS: Record<string, string> = {
    all: "Semua User",
    premium: "Premium Saja",
    free: "Free Saja",
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--duo-text)] flex items-center gap-3">
            <Megaphone size={24} className="text-pink-500" />
            Announcements
          </h1>
          <p className="text-sm text-[var(--duo-text-muted)] mt-1">{items.length} pengumuman</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-bold shadow-lg hover:brightness-110 transition-all flex items-center gap-2">
          <Plus size={16} /> Buat Pengumuman
        </button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-pink-200 dark:border-pink-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[var(--duo-text)]">{editing ? "Edit Pengumuman" : "Pengumuman Baru"}</h3>
              <button onClick={resetForm} className="p-1 text-[var(--duo-text-muted)] hover:text-red-500"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Judul *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-pink-500"
                  placeholder="Maintenance Notice" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Isi Pengumuman *</label>
                <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-pink-500 h-24 resize-none"
                  placeholder="Isi pengumuman..." />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Target Audience</label>
                <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value as Announcement["audience"] })}
                  className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] focus:outline-none focus:border-pink-500">
                  <option value="all">Semua User</option>
                  <option value="premium">Premium Saja</option>
                  <option value="free">Free Saja</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded" />
                  <span className="text-sm font-bold text-[var(--duo-text)]">Aktif</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={resetForm} className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-[var(--duo-text)] rounded-xl text-sm font-bold">Batal</button>
              <button onClick={handleSubmit} disabled={!form.title || !form.body}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-bold shadow-lg hover:brightness-110 transition-all disabled:opacity-40 flex items-center gap-2">
                <Save size={14} /> {editing ? "Simpan" : "Buat"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {items.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)] p-5">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.isActive ? "bg-pink-100 dark:bg-pink-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                <Megaphone size={18} className={a.isActive ? "text-pink-500" : "text-gray-400"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-black text-[var(--duo-text)]">{a.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    a.isActive ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }`}>{a.isActive ? "AKTIF" : "NONAKTIF"}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {AUDIENCE_LABELS[a.audience]}
                  </span>
                </div>
                <p className="text-xs text-[var(--duo-text-muted)] line-clamp-2">{a.body}</p>
                <p className="text-[10px] text-[var(--duo-text-muted)] mt-1">oleh {a.createdBy} · {new Date(a.createdAt).toLocaleDateString("id-ID")}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleToggle(a.id)}
                  className="p-2 text-[var(--duo-text-muted)] hover:text-blue-500 rounded-lg transition-colors">
                  {a.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => handleEdit(a.id)}
                  className="p-2 text-[var(--duo-text-muted)] hover:text-blue-500 rounded-lg transition-colors">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => handleDelete(a.id)}
                  className="p-2 text-[var(--duo-text-muted)] hover:text-red-500 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-[var(--duo-card)] rounded-2xl border-2 border-[var(--duo-border)]">
            <Megaphone size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-[var(--duo-text)]">Belum ada pengumuman</p>
            <p className="text-xs text-[var(--duo-text-muted)]">Klik &quot;Buat Pengumuman&quot; untuk mulai</p>
          </div>
        )}
      </div>
    </div>
  );
}
