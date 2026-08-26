"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import { SigmaIcon } from "@/components/icons/CustomIcons";
import { signup, login, resetPassword } from "@/lib/localAuth";
import { isFlagEnabled } from "@/lib/admin/flags";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const forgotEmailRef = useRef<HTMLInputElement>(null);

  const GUEST_KEY = "belajarmtk_guest";

  useEffect(() => {
    if (mode === "signup" && nameRef.current) {
      nameRef.current.focus();
    } else if (mode === "login" && emailRef.current) {
      emailRef.current.focus();
    } else if (mode === "forgot" && forgotEmailRef.current) {
      forgotEmailRef.current.focus();
    }
  }, [mode]);

  function clearForm() {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setShowPassword(false);
  }

  function switchMode(newMode: "login" | "signup") {
    clearForm();
    setMode(newMode);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      const result = signup(email, password, name);
      if (result.error) {
        setError(result.error);
      } else {
        setSignupSuccess(true);
      }
    } else {
      const result = login(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/");
      }
    }
    setLoading(false);
  }

  function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = resetPassword(email);
    if (result.error) {
      setError(result.error);
    } else {
      setNewPassword(result.newPassword || "");
      setResetSent(true);
    }
    setLoading(false);
  }

  function handleGuest() {
    localStorage.setItem(GUEST_KEY, "true");
    router.push("/");
  }

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-[var(--duo-bg)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center"
        >
          <div className="card-base p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <CheckCircle2 className="w-16 h-16 text-[var(--duo-green)] mx-auto mb-4" />
            </motion.div>
            <h2 className="text-xl font-bold text-[var(--duo-text)] mb-2">Daftar Berhasil! 🎉</h2>
            <p className="text-sm text-[var(--duo-text-muted)] mb-6">
              Akun <strong className="text-[var(--duo-text)]">{email}</strong> sudah dibuat. Silakan login untuk mulai belajar.
            </p>
            <button
              onClick={() => { setSignupSuccess(false); switchMode("login"); }}
              className="w-full py-3 rounded-xl bg-[var(--duo-green)] text-white font-bold text-base shadow-[0_4px_0_var(--duo-green-dark)] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Login Sekarang
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (resetSent) {
    return (
      <div className="min-h-screen bg-[var(--duo-bg)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center"
        >
          <div className="card-base p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <CheckCircle2 className="w-16 h-16 text-[var(--duo-green)] mx-auto mb-4" />
            </motion.div>
            <h2 className="text-xl font-bold text-[var(--duo-text)] mb-2">Password Di-reset! 🔑</h2>
            <p className="text-sm text-[var(--duo-text-muted)] mb-4">
              Password baru kamu:
            </p>
            <div className="mb-6 p-3 bg-[var(--duo-card)] rounded-xl border-2 border-[var(--duo-border)] font-mono text-base font-bold text-[var(--duo-text)] text-center tracking-wider select-all">
              {newPassword}
            </div>
            <p className="text-xs text-[var(--duo-text-muted)] mb-6">
              Simpan password ini! Gunakan untuk login selanjutnya.
            </p>
            <button
              onClick={() => { setResetSent(false); switchMode("login"); }}
              className="w-full py-3 rounded-xl bg-[var(--duo-green)] text-white font-bold text-base shadow-[0_4px_0_var(--duo-green-dark)] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--duo-bg)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block mb-3"
          >
            <SigmaIcon size={56} animated />
          </motion.div>
          <h1 className="text-2xl font-bold text-[var(--duo-text)]">BelajarMTK</h1>
          <p className="text-sm text-[var(--duo-text-muted)] mt-1">
            {mode === "signup" && "Buat akun untuk mulai belajar"}
            {mode === "login" && "Masuk ke akunmu"}
            {mode === "forgot" && "Reset password kamu"}
          </p>
        </div>

        {/* Forgot Password Mode */}
        {mode === "forgot" ? (
          <form onSubmit={handleForgotPassword} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--duo-text-muted)]" />
              <input
                ref={forgotEmailRef}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email untuk reset password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[var(--duo-border)] bg-[var(--duo-card)] text-[var(--duo-text)] focus:border-[var(--duo-green)] focus:outline-none transition-colors"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-red-500 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[var(--duo-green)] text-white font-bold text-base shadow-[0_4px_0_var(--duo-green-dark)] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => switchMode("login")}
              className="w-full py-2.5 rounded-xl border-2 border-[var(--duo-border)] text-[var(--duo-text-muted)] font-medium text-sm hover:bg-[var(--duo-card)] transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </button>
          </form>
        ) : (
          /* Login / Signup Form */
          <form onSubmit={handleSubmit} className="space-y-3">
            <AnimatePresence>
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--duo-text-muted)]" />
                    <input
                      ref={nameRef}
                      type="text"
                      placeholder="Nama (opsional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-label="Nama lengkap"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[var(--duo-border)] bg-[var(--duo-card)] text-[var(--duo-text)] focus:border-[var(--duo-green)] focus:outline-none transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--duo-text-muted)]" />
              <input
                ref={mode === "login" ? emailRef : undefined}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus={mode === "login"}
                aria-label="Alamat email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[var(--duo-border)] bg-[var(--duo-card)] text-[var(--duo-text)] focus:border-[var(--duo-green)] focus:outline-none transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--duo-text-muted)]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                aria-label="Password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-[var(--duo-border)] bg-[var(--duo-card)] text-[var(--duo-text)] focus:border-[var(--duo-green)] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--duo-text-muted)] hover:text-[var(--duo-text)] transition-colors"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Forgot password link (only in login mode) */}
            {mode === "login" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { clearForm(); setMode("forgot"); }}
                  className="text-xs text-[var(--duo-green)] font-semibold hover:underline"
                >
                  Lupa password?
                </button>
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-red-500 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[var(--duo-green)] text-white font-bold text-base shadow-[0_4px_0_var(--duo-green-dark)] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === "signup" ? "Daftar" : "Masuk"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Switch mode (only in login/signup) */}
        {mode !== "forgot" && (
          <p className="text-center text-sm text-[var(--duo-text-muted)] mt-4">
            {mode === "signup" ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
            <button
              onClick={() => switchMode(mode === "signup" ? "login" : "signup")}
              className="text-[var(--duo-green)] font-semibold hover:underline"
            >
              {mode === "signup" ? "Masuk" : "Daftar"}
            </button>
          </p>
        )}

        {/* Guest */}
        {mode !== "forgot" && isFlagEnabled("guest-mode") && (
          <div className="mt-6 pt-4 border-t border-[var(--duo-border)]">
            <button
              onClick={handleGuest}
              className="w-full py-2.5 rounded-xl border-2 border-[var(--duo-border)] text-[var(--duo-text-muted)] font-medium text-sm hover:bg-[var(--duo-card)] transition-colors"
            >
              Lanjut tanpa akun
            </button>
            <p className="text-xs text-[var(--duo-text-muted)] text-center mt-2 opacity-60">
              Data tersimpan di perangkat ini saja
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
