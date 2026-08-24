"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name || "Pelajar" } },
        });
        if (authError) throw authError;
        // Auto-login after signup
        router.push("/");
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
        router.push("/");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      // Friendly Indonesian translations
      if (message.includes("Invalid login credentials")) {
        setError("Email atau password salah");
      } else if (message.includes("already registered")) {
        setError("Email sudah terdaftar, coba login");
      } else if (message.includes("Password")) {
        setError("Password minimal 6 karakter");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGuest() {
    router.push("/");
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
          <div className="text-5xl mb-3">🧮</div>
          <h1 className="text-2xl font-bold text-[var(--duo-text)]">BelajarMTK</h1>
          <p className="text-sm text-[var(--duo-text-muted)] mt-1">
            {mode === "signup" ? "Buat akun untuk mulai belajar" : "Masuk ke akunmu"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--duo-text-muted)]" />
              <input
                type="text"
                placeholder="Nama (opsional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[var(--duo-border)] bg-[var(--duo-card)] text-[var(--duo-text)] focus:border-[var(--duo-green)] focus:outline-none transition-colors"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--duo-text-muted)]" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[var(--duo-border)] bg-[var(--duo-card)] text-[var(--duo-text)] focus:border-[var(--duo-green)] focus:outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--duo-text-muted)]" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[var(--duo-border)] bg-[var(--duo-card)] text-[var(--duo-text)] focus:border-[var(--duo-green)] focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

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

        {/* Switch mode */}
        <p className="text-center text-sm text-[var(--duo-text-muted)] mt-4">
          {mode === "signup" ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <button
            onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }}
            className="text-[var(--duo-green)] font-semibold hover:underline"
          >
            {mode === "signup" ? "Masuk" : "Daftar"}
          </button>
        </p>

        {/* Guest */}
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
      </motion.div>
    </div>
  );
}
