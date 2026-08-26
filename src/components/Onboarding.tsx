"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, GraduationCap, Trophy, ChevronRight, Sparkles, Gem, Flame, Target, BarChart3 } from "lucide-react";
import { getProfile, saveProfile } from "@/lib/gamification";
import AnimatedButton from "./ui/AnimatedButton";

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    title: "Selamat Datang!",
    subtitle: "Belajar matematika jadi lebih menyenangkan",
    icon: Sparkles,
    color: "var(--primary)",
  },
  {
    title: "Siapa Namamu?",
    subtitle: "Kami akan memanggilmu dengan nama ini",
    icon: BookOpen,
    color: "var(--info)",
  },
  {
    title: "Tingkat Pendidikan",
    subtitle: "Pilih level yang sesuai untukmu",
    icon: GraduationCap,
    color: "var(--purple)",
  },
];

const tourFeatures = [
  { icon: Gem, label: "Gems", desc: "Kumpulkan gems dari belajar, beli item keren di Toko!", color: "text-[var(--duo-purple)]", bg: "bg-[var(--duo-purple)]/15" },
  { icon: Flame, label: "Streak", desc: "Jaga streak harianmu agar tetap berapi-api!", color: "text-[var(--duo-orange)]", bg: "bg-[var(--duo-orange)]/15" },
  { icon: Target, label: "Quiz Harian", desc: "Quiz harian beda dari latihan biasa — lebih menantang!", color: "text-[var(--duo-info)]", bg: "bg-[var(--duo-info)]/15" },
  { icon: BarChart3, label: "Peringkat", desc: "Lihat progressmu dibanding pelajar lainnya!", color: "text-[var(--primary)]", bg: "bg-[var(--primary-bg)]" },
];

const levels = [
  { id: "smp", label: "SMP", desc: "Kelas 7-9", icon: BookOpen },
  { id: "sma", label: "SMA", desc: "Kelas 10-12", icon: GraduationCap },
  { id: "kuliah", label: "Universitas", desc: "Mahasiswa", icon: Trophy },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showTour, setShowTour] = useState(false);

  const handleNext = () => {
    if (step === 1 && !name.trim()) return;
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setShowTour(true);
    }
  };

  const handleComplete = () => {
    const profile = getProfile();
    saveProfile({
      ...profile,
      name: name.trim() || "Siswa",
    });
    localStorage.setItem("belajar-mtk-onboarding", "done");
    onComplete();
  };

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--bg)] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i <= step ? "w-8 bg-[var(--primary)]" : "w-4 bg-[var(--border)]"
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: `${currentStep.color}20` }}
          >
            <currentStep.icon size={36} style={{ color: currentStep.color }} />
          </div>
          <h1 className="text-2xl font-black text-[var(--fg)] mb-2">{currentStep.title}</h1>
          <p className="text-sm text-[var(--fg-muted)]">{currentStep.subtitle}</p>
        </motion.div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-8"
          >
            {step === 1 && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  placeholder="Ketik namamu di sini..."
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--border)] bg-white dark:bg-[var(--surface)] text-[var(--fg)] font-bold text-center text-lg focus:border-[var(--primary)] focus:outline-none transition-colors"
                  autoFocus
                />
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-3 gap-3">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`p-4 rounded-2xl border-2 transition-all text-center ${
                      selectedLevel === level.id
                        ? "border-[var(--primary)] bg-[var(--primary-bg)]"
                        : "border-[var(--border)] bg-white dark:bg-[var(--surface)] hover:border-[var(--primary)]/50"
                    }`}
                  >
                    <level.icon
                      size={24}
                      className={`mx-auto mb-2 ${
                        selectedLevel === level.id ? "text-[var(--primary)]" : "text-[var(--fg-muted)]"
                      }`}
                    />
                    <p className="text-sm font-bold text-[var(--fg)]">{level.label}</p>
                    <p className="text-[10px] text-[var(--fg-muted)]">{level.desc}</p>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <AnimatedButton
          onClick={handleNext}
          fullWidth
          variant="primary"
          size="lg"
          disabled={step === 1 && !name.trim()}
          icon={step === steps.length - 1 ? <Sparkles size={16} /> : <ChevronRight size={16} />}
        >
          {step === steps.length - 1 ? "Mulai Belajar!" : "Lanjut"}
        </AnimatedButton>

        {/* Skip */}
        {step < steps.length - 1 && (
          <button
            onClick={handleComplete}
            className="w-full mt-3 py-2 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
          >
            Lewati
          </button>
        )}
      </motion.div>

      {/* Tour Screen Overlay */}
      <AnimatePresence>
        {showTour && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[81] flex items-center justify-center bg-[var(--bg)] p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-sm"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-[var(--primary-bg)] flex items-center justify-center mb-4">
                  <Sparkles size={28} className="text-[var(--primary)]" />
                </div>
                <h2 className="text-xl font-black text-[var(--fg)] mb-1">Sebelum Mulai...</h2>
                <p className="text-sm text-[var(--fg-muted)]">Ini fitur-fitur utama yang harus kamu tahu!</p>
              </div>

              <div className="space-y-3 mb-6">
                {tourFeatures.map((feature, i) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[var(--surface)] border-2 border-[var(--border-subtle)]"
                  >
                    <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center shrink-0`}>
                      <feature.icon size={18} className={feature.color} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[var(--fg)]">{feature.label}</p>
                      <p className="text-[11px] text-[var(--fg-muted)] leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <AnimatedButton
                onClick={handleComplete}
                fullWidth
                variant="primary"
                size="lg"
                icon={<Sparkles size={16} />}
              >
                Mengerti, Mulai Belajar!
              </AnimatedButton>
              <button
                onClick={handleComplete}
                className="w-full mt-2 py-2 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                Lewati
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
