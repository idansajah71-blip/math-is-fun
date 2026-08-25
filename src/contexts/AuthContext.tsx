"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getCurrentUser } from "@/lib/localAuth";

interface AuthContextType {
  user: { id: string; email: string; name: string } | null;
  loading: boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, refreshUser: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionUser = getCurrentUser();
    setUser(sessionUser);
    setLoading(false);
  }, []);

  function refreshUser() {
    const sessionUser = getCurrentUser();
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
