"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { getProfile, addXp, LEVEL_NAMES } from "@/lib/gamification";
import { motion } from "framer-motion";
import { UserPlus, Trophy, Zap, Flame, Target, Send, X, CheckCircle2, Swords } from "lucide-react";
import type { UserProfile } from "@/lib/gamification";

interface Friend {
  id: string;
  name: string;
  xp: number;
  level: number;
  streak: number;
  addedAt: string;
}

interface Challenge {
  id: string;
  fromName: string;
  toName: string;
  topic: string;
  score: number;
  date: string;
  status: "pending" | "accepted" | "completed";
}

const STORAGE_FRIENDS = "belajar-mtk-friends";
const STORAGE_CHALLENGES = "belajar-mtk-challenges";

function getFriends(): Friend[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_FRIENDS) || "[]");
  } catch { return []; }
}

function saveFriends(friends: Friend[]) {
  localStorage.setItem(STORAGE_FRIENDS, JSON.stringify(friends));
}

function getChallenges(): Challenge[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_CHALLENGES) || "[]");
  } catch { return []; }
}

function saveChallenges(challenges: Challenge[]) {
  localStorage.setItem(STORAGE_CHALLENGES, JSON.stringify(challenges));
}

export default function FriendsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [addName, setAddName] = useState("");
  const [activeTab, setActiveTab] = useState<"friends" | "challenges">("friends");
  const [showChallengeModal, setShowChallengeModal] = useState<string | null>(null);
  const [challengeTopic, setChallengeTopic] = useState("");
  const [simResult, setSimResult] = useState<{ winner: string; myScore: number; friendScore: number } | null>(null);

  const load = useCallback(() => {
    setProfile(getProfile());
    setFriends(getFriends());
    setChallenges(getChallenges());
  }, []);

  useEffect(() => { load(); }, [load]);

  function addFriend() {
    const name = addName.trim();
    if (!name) return;
    if (friends.some(f => f.name.toLowerCase() === name.toLowerCase())) return;

    const newFriend: Friend = {
      id: Date.now().toString(),
      name,
      xp: Math.floor(Math.random() * 2000) + 100,
      level: Math.floor(Math.random() * 8) + 1,
      streak: Math.floor(Math.random() * 15),
      addedAt: new Date().toISOString().split("T")[0],
    };

    const updated = [...friends, newFriend];
    saveFriends(updated);
    setFriends(updated);
    setAddName("");
  }

  function removeFriend(id: string) {
    const updated = friends.filter(f => f.id !== id);
    saveFriends(updated);
    setFriends(updated);
  }

  function sendChallenge(friendName: string) {
    if (!profile) return;
    const topics = ["Aljabar", "Geometri", "Statistika", "Peluang", "Fungsi", "Persamaan Linear"];
    const topic = challengeTopic || topics[Math.floor(Math.random() * topics.length)];
    const myScore = Math.floor(Math.random() * 40) + 60;

    const challenge: Challenge = {
      id: Date.now().toString(),
      fromName: profile.name,
      toName: friendName,
      topic,
      score: myScore,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    };

    const updated = [...challenges, challenge];
    saveChallenges(updated);
    setChallenges(updated);
    setShowChallengeModal(null);
    setChallengeTopic("");

    // Simulate friend accepting after 1s
    setTimeout(() => {
      const friendScore = Math.floor(Math.random() * 50) + 40;
      const allChallenges = getChallenges();
      const c = allChallenges.find(ch => ch.id === challenge.id);
      if (c) {
        c.status = "completed";
        saveChallenges(allChallenges);
        setChallenges([...allChallenges]);

        if (myScore >= friendScore) {
          addXp(25);
        }
      }
    }, 1500);
  }

  function acceptChallenge(challengeId: string) {
    const allChallenges = getChallenges();
    const c = allChallenges.find(ch => ch.id === challengeId);
    if (c) {
      c.status = "completed";
      saveChallenges(allChallenges);
      setChallenges([...allChallenges]);
    }
  }

  const pendingChallenges = challenges.filter(c => c.status === "pending" && c.toName === profile?.name);
  const completedChallenges = challenges.filter(c => c.status === "completed");

  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <Sidebar />

      <main className="flex-1 ml-[260px] pb-24 lg:pb-0">
        <div className="bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)]">
          <div className="max-w-2xl mx-auto px-8 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[var(--duo-info)]/10 rounded-2xl flex items-center justify-center">
                <Swords size={24} className="text-[var(--duo-info)]" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[var(--duo-text)]">Teman & Challenge</h1>
                <p className="text-sm text-[var(--duo-text-muted)]">
                  {friends.length} teman · {pendingChallenges.length} challenge masuk
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setActiveTab("friends")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  activeTab === "friends" ? "bg-[var(--duo-green)] text-white" : "bg-[var(--duo-card)] text-[var(--duo-text-muted)] border border-[var(--duo-border)]"
                }`}>
                Teman ({friends.length})
              </button>
              <button onClick={() => setActiveTab("challenges")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors relative ${
                  activeTab === "challenges" ? "bg-[var(--duo-green)] text-white" : "bg-[var(--duo-card)] text-[var(--duo-text-muted)] border border-[var(--duo-border)]"
                }`}>
                Challenge ({challenges.length})
                {pendingChallenges.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {pendingChallenges.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-8 py-6">
          {activeTab === "friends" ? (
            <div className="space-y-4">
              {/* Add friend */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addFriend()}
                  placeholder="Tambah teman (nama)..."
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-[var(--duo-card)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] placeholder:text-[var(--duo-text-muted)] focus:outline-none focus:border-[var(--duo-green)]"
                />
                <button onClick={addFriend}
                  disabled={!addName.trim()}
                  className="px-4 py-2.5 bg-[var(--duo-green)] text-white rounded-xl text-sm font-bold shadow-[0_2px_0_var(--duo-green-dark)] hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
                  <UserPlus size={14} />
                  Tambah
                </button>
              </div>

              {friends.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-3 flex justify-center">
                    <div className="w-16 h-16 bg-[var(--duo-info)]/10 rounded-full flex items-center justify-center">
                      <UserPlus size={28} className="text-[var(--duo-info)]" />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[var(--duo-text)] mb-1">Belum ada teman</p>
                  <p className="text-xs text-[var(--duo-text-muted)]">Tambah nama teman untuk mulai challenge!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {friends.map((friend, i) => (
                    <motion.div
                      key={friend.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white dark:bg-[var(--duo-card)] rounded-[20px] border-2 border-[var(--duo-border)] p-4 flex items-center gap-4"
                    >
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--duo-info)] to-[var(--duo-purple)] flex items-center justify-center text-white font-black text-sm shrink-0">
                        {friend.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[var(--duo-text)] truncate">{friend.name}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[10px] font-bold text-[var(--duo-xp)] flex items-center gap-0.5">
                            <Zap size={10} /> {friend.xp} XP
                          </span>
                          <span className="text-[10px] font-bold text-[var(--duo-text-muted)]">
                            Lv.{friend.level} · {LEVEL_NAMES[friend.level]}
                          </span>
                          {friend.streak > 0 && (
                            <span className="text-[10px] font-bold text-orange-500 flex items-center gap-0.5">
                              <Flame size={10} /> {friend.streak}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setShowChallengeModal(friend.id)}
                          className="px-3 py-1.5 bg-[var(--duo-info)]/10 text-[var(--duo-info)] rounded-lg text-xs font-bold hover:bg-[var(--duo-info)]/20 transition-colors flex items-center gap-1">
                          <Swords size={12} />
                          Challenge
                        </button>
                        <button onClick={() => removeFriend(friend.id)}
                          className="p-1.5 text-[var(--duo-text-muted)] hover:text-red-500 rounded-lg transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {challenges.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-3 flex justify-center">
                    <div className="w-16 h-16 bg-[var(--duo-xp)]/10 rounded-full flex items-center justify-center">
                      <Swords size={28} className="text-[var(--duo-xp)]" />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[var(--duo-text)] mb-1">Belum ada challenge</p>
                  <p className="text-xs text-[var(--duo-text-muted)]">Kirim challenge ke teman untuk mulai berkompetisi!</p>
                </div>
              ) : (
                <>
                  {pendingChallenges.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold text-[var(--duo-text-muted)] mb-2">Challenge Masuk</h2>
                      <div className="space-y-2">
                        {pendingChallenges.map(c => (
                          <div key={c.id} className="bg-[var(--duo-info)]/5 rounded-2xl border border-[var(--duo-info)]/20 p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--duo-info)] flex items-center justify-center text-white font-bold text-xs">
                              {c.fromName.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-[var(--duo-text)]">{c.fromName} menantangmu!</p>
                              <p className="text-[10px] text-[var(--duo-text-muted)]">Topik: {c.topic} · Skor: {c.score}</p>
                            </div>
                            <button onClick={() => acceptChallenge(c.id)}
                              className="px-3 py-1.5 bg-[var(--duo-green)] text-white rounded-lg text-xs font-bold">
                              Terima
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {completedChallenges.length > 0 && (
                    <div>
                      <h2 className="text-xs font-bold text-[var(--duo-text-muted)] mb-2">Riwayat</h2>
                      <div className="space-y-2">
                        {completedChallenges.slice(-10).reverse().map(c => {
                          const iWon = c.fromName === profile?.name ? true : false;
                          return (
                            <div key={c.id} className="bg-white dark:bg-[var(--duo-card)] rounded-2xl border border-[var(--duo-border)] p-4 flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs ${iWon ? "bg-[var(--duo-green)]" : "bg-[var(--duo-info)]"}`}>
                                {iWon ? <CheckCircle2 size={16} /> : <Trophy size={16} />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-[var(--duo-text)]">
                                  {c.fromName === profile?.name ? `vs ${c.toName}` : `vs ${c.fromName}`}
                                </p>
                                <p className="text-[10px] text-[var(--duo-text-muted)]">{c.topic} · {c.date}</p>
                              </div>
                              <span className={`text-[10px] font-bold ${iWon ? "text-[var(--duo-green)]" : "text-[var(--duo-text-muted)]"}`}>
                                {iWon ? "Menang" : "Selesai"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Challenge Modal */}
      {showChallengeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowChallengeModal(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[var(--duo-card)] rounded-[24px] border-2 border-[var(--duo-border)] p-6 w-[90%] max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-black text-[var(--duo-text)] mb-4">Kirim Challenge</h3>
            <p className="text-xs text-[var(--duo-text-muted)] mb-3">
              Ke: <span className="font-bold text-[var(--duo-text)]">{friends.find(f => f.id === showChallengeModal)?.name}</span>
            </p>
            <label className="text-xs font-bold text-[var(--duo-text-muted)] block mb-1">Topik (opsional)</label>
            <input
              type="text"
              value={challengeTopic}
              onChange={(e) => setChallengeTopic(e.target.value)}
              placeholder="Acak jika kosong..."
              className="w-full px-4 py-2.5 bg-[var(--duo-bg)] border-2 border-[var(--duo-border)] rounded-xl text-sm font-bold text-[var(--duo-text)] placeholder:text-[var(--duo-text-muted)] focus:outline-none focus:border-[var(--duo-green)] mb-4"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowChallengeModal(null)}
                className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-[var(--duo-text)] rounded-xl text-sm font-bold">
                Batal
              </button>
              <button onClick={() => {
                const friend = friends.find(f => f.id === showChallengeModal);
                if (friend) sendChallenge(friend.name);
              }}
                className="flex-1 py-2.5 bg-[var(--duo-info)] text-white rounded-xl text-sm font-bold shadow-[0_2px_0_#1a8fcc] hover:brightness-110 flex items-center justify-center gap-2">
                <Send size={14} />
                Kirim
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
