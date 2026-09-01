"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import EventCard from "@/components/events/EventCard";
import { getAllEvents, syncEventStatuses, isEventJoined, getEventParticipants } from "@/lib/events";
import type { EventData } from "@/lib/events";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import FeatureGuard from "@/components/admin/FeatureGuard";
import { Calendar, Search } from "lucide-react";
import { staggerContainer } from "@/lib/animations";

type FilterTab = "semua" | "active" | "scheduled" | "ended";

const tabs: { key: FilterTab; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "active", label: "Active" },
  { key: "scheduled", label: "Scheduled" },
  { key: "ended", label: "Ended" },
];

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("semua");
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  const allEvents = useMemo(() => {
    syncEventStatuses();
    return getAllEvents().filter((e) => e.status !== "draft");
  }, []);

  const filteredEvents = useMemo(() => {
    let events = allEvents;
    if (activeTab !== "semua") {
      events = events.filter((e) => e.status === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      events = events.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }
    return events;
  }, [allEvents, activeTab, search]);

  const handleCardClick = (event: EventData) => {
    router.push(`/events/${event.id}`);
  };

  return (
    <FeatureGuard flag="events">
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <Sidebar />

      <main className="flex-1 lg:ml-[260px] pb-24 lg:pb-0">
        <div className="bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)]">
          <div className="max-w-5xl mx-auto px-8 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[var(--duo-green)]/10 rounded-2xl flex items-center justify-center">
                <Calendar size={24} className="text-[var(--duo-green)]" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[var(--duo-text)]">Event</h1>
                <p className="text-sm text-[var(--duo-text-muted)]">
                  Ikuti event dan raih reward!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      activeTab === tab.key
                        ? "bg-[var(--duo-green)] text-white"
                        : "bg-[var(--duo-card)] text-[var(--duo-text-muted)] border border-[var(--duo-border)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative ml-auto">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--duo-text-muted)]" />
                <input
                  type="text"
                  placeholder="Cari event..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-1.5 rounded-xl text-xs font-medium bg-[var(--duo-card)] text-[var(--duo-text)] border border-[var(--duo-border)] focus:outline-none focus:border-[var(--duo-green)] transition-colors w-48"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-6">
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="mb-3 flex justify-center">
                <div className="w-16 h-16 bg-[var(--duo-card)] rounded-full flex items-center justify-center border-2 border-[var(--duo-border)]">
                  <Calendar size={32} className="text-[var(--duo-text-muted)]" />
                </div>
              </div>
              <p className="text-sm font-bold text-[var(--duo-text)]">Belum ada event</p>
              <p className="text-xs text-[var(--duo-text-muted)] mt-1">
                Event baru akan segera hadir. Tetap semangat!
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isJoined={user ? isEventJoined(event.id, user.id) : false}
                  participantCount={getEventParticipants(event.id).length}
                  onClick={() => handleCardClick(event)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
    </FeatureGuard>
  );
}
