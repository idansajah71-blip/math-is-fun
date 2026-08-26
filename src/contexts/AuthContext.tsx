"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getCurrentUser } from "@/lib/localAuth";

interface AuthContextType {
  user: { id: string; email: string; name: string } | null;
  loading: boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, refreshUser: () => {} });

function getProfileUser(): { id: string; email: string; name: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("belajar-mtk-profile");
    if (!raw) return null;
    const profile = JSON.parse(raw);
    if (profile.name && profile.name !== "Pelajar" && profile.name !== "Siswa") {
      return { id: "local", email: "", name: profile.name };
    }
  } catch {}
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sessionUser = getCurrentUser();
    if (!sessionUser) {
      sessionUser = getProfileUser();
    }
    setUser(sessionUser);
    setLoading(false);
  }, []);

  function refreshUser() {
    let sessionUser = getCurrentUser();
    if (!sessionUser) {
      sessionUser = getProfileUser();
    }
    setUser(sessionUser);
  }

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
