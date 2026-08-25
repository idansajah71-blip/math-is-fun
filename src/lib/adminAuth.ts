"use client";

const ADMIN_STORAGE_KEY = "belajar-mtk-admin";
const ADMIN_USERS_KEY = "belajar-mtk-admin-users";

export interface AdminUser {
  email: string;
  password: string;
  name: string;
  role: "superadmin" | "admin";
  createdAt: string;
}

export interface AdminSession {
  email: string;
  name: string;
  role: string;
  loginAt: string;
  supabaseUserId?: string;
}

const DEFAULT_ADMIN: AdminUser = {
  email: "admin@belajar-mtk.com",
  password: "admin123",
  name: "Super Admin",
  role: "superadmin",
  createdAt: new Date().toISOString(),
};

function isSupabaseConfigured(): boolean {
  if (typeof window === "undefined") return false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key && !url.includes("your-project") && !key.includes("your-anon"));
}

function getAdminUsers(): AdminUser[] {
  if (typeof window === "undefined") return [DEFAULT_ADMIN];
  try {
    const stored = JSON.parse(localStorage.getItem(ADMIN_USERS_KEY) || "[]");
    if (stored.length === 0) {
      stored.push(DEFAULT_ADMIN);
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(stored));
    }
    return stored;
  } catch {
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify([DEFAULT_ADMIN]));
    return [DEFAULT_ADMIN];
  }
}

export async function adminLogin(email: string, password: string): Promise<{ error?: string; session?: AdminSession }> {
  // Try Supabase Auth first when configured
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Fall through to localStorage check
      } else if (data.user) {
        // Check role in profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, name")
          .eq("id", data.user.id)
          .single();

        const role = (profile as { role?: string } | null)?.role || "user";
        if (role !== "admin" && role !== "superadmin") {
          await supabase.auth.signOut();
          return { error: "Akun ini bukan akun admin" };
        }

        const session: AdminSession = {
          email: data.user.email || email,
          name: (profile as { name?: string } | null)?.name || "Admin",
          role,
          loginAt: new Date().toISOString(),
          supabaseUserId: data.user.id,
        };
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
        return { session };
      }
    } catch {
      // Supabase unavailable, fall through to localStorage
    }
  }

  // localStorage fallback
  const users = getAdminUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return { error: "Email atau password salah" };
  }
  const session: AdminSession = {
    email: user.email,
    name: user.name,
    role: user.role,
    loginAt: new Date().toISOString(),
  };
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
  return { session };
}

export async function adminLogout(): Promise<void> {
  const session = getAdminSession();
  if (session?.supabaseUserId && isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
  localStorage.removeItem(ADMIN_STORAGE_KEY);
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function isAdminLoggedIn(): boolean {
  return getAdminSession() !== null;
}

export function isAdminOrSuperadmin(): boolean {
  const session = getAdminSession();
  return session?.role === "admin" || session?.role === "superadmin";
}

export function addAdmin(email: string, password: string, name: string): { error?: string } {
  const users = getAdminUsers();
  if (users.some((u) => u.email === email)) {
    return { error: "Email sudah terdaftar" };
  }
  users.push({
    email,
    password,
    name,
    role: "admin",
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
  return {};
}

export function removeAdmin(email: string): boolean {
  const users = getAdminUsers();
  const session = getAdminSession();
  if (session?.email === email && session?.role !== "superadmin") return false;
  const filtered = users.filter((u) => u.email !== email);
  if (filtered.length === users.length) return false;
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(filtered));
  return true;
}

export function getAllAdmins(): AdminUser[] {
  return getAdminUsers();
}
