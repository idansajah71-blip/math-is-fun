"use client";

const USERS_KEY = "belajarmtk_users";
const SESSION_KEY = "belajarmtk_session";

export interface LocalUser {
  id: string;
  email: string;
  name: string;
  password: string;
}

function getUsers(): LocalUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: LocalUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function hashPassword(pw: string): string {
  // Simple salted hash for localStorage-only auth.
  // Not cryptographic-grade but far better than plain base64.
  const salt = "bmtk_salt_v1";
  let hash = 0;
  const combined = salt + pw + salt;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Mix with length and use hex
  const hex = (hash >>> 0).toString(16).padStart(8, "0");
  const lengthHex = pw.length.toString(16).padStart(4, "0");
  // Add a second pass for better distribution
  let hash2 = 0;
  for (let i = 0; i < hex.length; i++) {
    hash2 = ((hash2 << 5) - hash2) + hex.charCodeAt(i);
    hash2 = hash2 & hash2;
  }
  return hex + (hash2 >>> 0).toString(16).padStart(8, "0") + lengthHex;
}

export function signup(email: string, password: string, name: string): { error?: string } {
  const users = getUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { error: "Email sudah terdaftar, coba login" };
  }
  if (password.length < 6) {
    return { error: "Password minimal 6 karakter" };
  }

  const userId = "usr_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  users.push({ id: userId, email: email.toLowerCase(), name: name || "Pelajar", password: hashPassword(password) });
  saveUsers(users);

  // Register in central registry
  try {
    import("@/lib/admin/registry").then(({ registerUser }) => {
      registerUser(userId, email.toLowerCase(), name || "Pelajar");
    });
  } catch {}

  // Auto-activate 7-day trial premium for new users
  try {
    import("@/lib/gamification").then(({ grantTrialPremium }) => {
      grantTrialPremium();
    });
  } catch {}

  return {};
}

export function login(email: string, password: string): { error?: string; user?: { id: string; email: string; name: string } } {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === hashPassword(password)
  );
  if (!user) {
    return { error: "Email atau password salah" };
  }

  const session = { id: user.id, email: user.email, name: user.name, loggedInAt: Date.now() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  // Update registry last active
  try {
    import("@/lib/admin/registry").then(({ updateUserRegistry }) => {
      updateUserRegistry(user.id, { lastActive: new Date().toISOString() });
    });
  } catch {}

  return { user: { id: user.id, email: user.email, name: user.name } };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): { id: string; email: string; name: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.id) {
      // Migrate old session: find user by email to get ID
      const users = getUsers();
      const user = users.find((u) => u.email === parsed.email);
      if (user) {
        parsed.id = user.id;
        localStorage.setItem(SESSION_KEY, JSON.stringify(parsed));
      } else {
        parsed.id = "legacy_" + Date.now().toString(36);
        localStorage.setItem(SESSION_KEY, JSON.stringify(parsed));
      }
    }
    // Session expiry: 30 days
    const SESSION_TTL = 30 * 24 * 60 * 60 * 1000;
    if (parsed.loggedInAt && Date.now() - parsed.loggedInAt > SESSION_TTL) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function getUserProfileKey(userId?: string): string {
  if (!userId) {
    const user = getCurrentUser();
    userId = user?.id;
  }
  return userId ? `belajar-mtk-profile-${userId}` : "belajar-mtk-profile";
}

export function resetPassword(email: string): { error?: string; success?: boolean; newPassword?: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) {
    return { error: "Email tidak ditemukan" };
  }
  const newPw = "reset" + Math.floor(1000 + Math.random() * 9000);
  users[idx].password = hashPassword(newPw);
  saveUsers(users);
  // Return the new password so the UI can display it properly (no more alert)
  return { success: true, newPassword: newPw };
}

export function updateProfile(updates: { name?: string; email?: string }): { error?: string } {
  const session = getCurrentUser();
  if (!session) return { error: "Belum login" };

  const users = getUsers();
  const idx = users.findIndex((u) => u.email === session.email);
  if (idx === -1) return { error: "User tidak ditemukan" };

  if (updates.email && updates.email !== session.email) {
    const exists = users.find((u) => u.email.toLowerCase() === updates.email!.toLowerCase() && u.email !== session.email);
    if (exists) return { error: "Email sudah digunakan" };
    users[idx].email = updates.email.toLowerCase();
  }
  if (updates.name) {
    users[idx].name = updates.name;
  }

  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, ...updates }));

  // Update registry
  try {
    import("@/lib/admin/registry").then(({ updateUserRegistry }) => {
      updateUserRegistry(session.id, { name: updates.name, email: updates.email });
    });
  } catch {}

  return {};
}

export function getAllLocalUsers(): LocalUser[] {
  return getUsers();
}
