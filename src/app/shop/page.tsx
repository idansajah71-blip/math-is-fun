"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { getProfile, purchaseItem, SHOP_ITEMS } from "@/lib/gamification";
import { motion } from "framer-motion";
import { Gem, ShoppingBag, Zap, Star, CheckCircle2, Info, Sparkles } from "lucide-react";
import { renderIcon } from "@/lib/iconMap";
import type { UserProfile } from "@/lib/gamification";
import FeatureGuard from "@/components/admin/FeatureGuard";

export default function ShopPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [filter, setFilter] = useState<"all" | "powerup" | "avatar" | "effect">("all");
  const [buying, setBuying] = useState<string | null>(null);
  const [bought, setBought] = useState<string | null>(null);
  const [insufficient, setInsufficient] = useState<string | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const handlePurchase = (itemId: string) => {
    if (!profile) return;
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    if (profile.purchasedItems.includes(itemId)) return;

    if (profile.gems < item.price) {
      setInsufficient(itemId);
      setTimeout(() => setInsufficient(null), 2000);
      return;
    }

    setBuying(itemId);
    setTimeout(() => {
      const updated = purchaseItem(itemId);
      setProfile(updated);
      setBuying(null);
      setBought(itemId);
      setTimeout(() => setBought(null), 1500);
    }, 800);
  };

  if (!profile) return null;

  const filteredItems = SHOP_ITEMS.filter(i => filter === "all" || i.category === filter);

  return (
    <FeatureGuard flag="shop">
    <div className="flex min-h-screen bg-[var(--duo-bg)]">
      <Sidebar />

      <main className="flex-1 lg:ml-[260px] pb-24 lg:pb-0">
        {/* Header */}
        <div className="bg-white dark:bg-[var(--duo-card)] border-b-2 border-[var(--duo-border)]">
          <div className="max-w-4xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-[var(--duo-text)]">Toko</h1>
                <p className="text-sm text-[var(--duo-text-muted)]">Beli item power-up dan avatar</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-[var(--duo-purple)]/30">
                  <Gem size={18} className="text-[var(--duo-purple)]" />
                  <span className="text-lg font-black text-[var(--duo-purple)]">{profile.gems}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto px-8 py-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {([
              { key: "all", label: "Semua", icon: <ShoppingBag size={14} /> },
              { key: "powerup", label: "Power-up", icon: <Zap size={14} /> },
              { key: "avatar", label: "Avatar", icon: <Star size={14} /> },
              { key: "effect", label: "Efek", icon: <Sparkles size={14} /> },
            ] as const).map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  filter === f.key
                    ? "bg-[var(--duo-green)] text-white shadow-md"
                    : "bg-white dark:bg-[var(--duo-card)] text-[var(--duo-text-muted)] border-2 border-[var(--duo-border)] hover:border-[var(--duo-green)]/50"
                }`}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredItems.map((item, i) => {
              const owned = profile.purchasedItems.includes(item.id);
              const canAfford = profile.gems >= item.price;
              const isBuying = buying === item.id;
              const isBought = bought === item.id;
              const noFunds = insufficient === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative p-5 rounded-[24px] border-2 transition-all ${
                    owned
                      ? "bg-[var(--duo-green-bg)] border-[var(--duo-green)]/30"
                      : "bg-white dark:bg-[var(--duo-card)] border-[var(--duo-border)] hover:border-[var(--duo-green)]/50 hover:shadow-lg"
                  }`}
                >
                  {owned && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 size={18} className="text-[var(--duo-green)]" />
                    </div>
                  )}

                  <motion.div
                    className="mb-3 flex items-center justify-center"
                    animate={isBought ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
                  >
                    {renderIcon(item.icon, 32, "text-[var(--duo-text)]")}
                  </motion.div>

                  <h3 className="text-sm font-black text-[var(--duo-text)] mb-1">{item.name}</h3>
                  <p className="text-[10px] text-[var(--duo-text-muted)] mb-3 line-clamp-2">{item.description}</p>

                  {owned ? (
                    <div className="text-center py-2 bg-[var(--duo-green)]/10 rounded-xl">
                      <span className="text-xs font-bold text-[var(--duo-green)]">Dimiliki</span>
                    </div>
                  ) : (
                    <motion.button
                      onClick={() => handlePurchase(item.id)}
                      disabled={isBuying || !canAfford}
                      className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${
                        noFunds
                          ? "bg-red-100 dark:bg-red-950/30 text-red-500 border border-red-200 dark:border-red-800"
                          : isBought
                          ? "bg-[var(--duo-green)] text-white"
                          : canAfford
                          ? "bg-[var(--duo-purple)] text-white hover:brightness-110 shadow-md"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                      }`}
                      whileHover={canAfford && !isBuying ? { scale: 1.03 } : {}}
                      whileTap={canAfford && !isBuying ? { scale: 0.97 } : {}}
                    >
                      {isBuying ? (
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          Membeli...
                        </motion.span>
                      ) : noFunds ? (
                        "Gems Tidak Cukup!"
                      ) : isBought ? (
                        "Berhasil!"
                      ) : (
                        <span className="flex items-center justify-center gap-1.5">
                          <Gem size={12} />
                          {item.price}
                        </span>
                      )}
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Info */}
          <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-[var(--duo-purple)]/20">
            <p className="text-xs text-[var(--duo-purple)] font-bold flex items-start gap-2">
              <Info size={14} className="shrink-0 mt-0.5" />
              <span>Dapatkan gems dengan menyelesaikan materi, quiz harian, dan naik level!</span>
            </p>
          </div>
        </div>
      </main>
    </div>
    </FeatureGuard>
  );
}
