"use client";

const USERS_KEY = "matika_users";
const SESSION_KEY = "matika_session";

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
  const salt = "bmtk_salt_v1";
  let hash = 0;
  const combined = salt + pw + salt;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hex = (hash >>> 0).toString(16).padStart(8, "0");
  const lengthHex = pw.length.toString(16).padStart(4, "0");
  let hash2 = 0;
  for (let i = 0; i < hex.length; i++) {
    hash2 = ((hash2 << 5) - hash2) + hex.charCodeAt(i);
    hash2 = hash2 & hash2;
  }
  return hex + (hash2 >>> 0).toString(16).padStart(8, "0") + lengthHex;
}

function legacyHashPassword(pw: string): string {
  return btoa(pw);
}

function isLegacyHash(stored: string): boolean {
  try {
    const decoded = atob(stored);
    return decoded.length > 0 && !decoded.includes("\n");
  } catch {
    return false;
  }
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
  } catch { console.debug("Failed to register user in registry"); }

  return {};
}

export function login(email: string, password: string): { error?: string; user?: { id: string; email: string; name: string } } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) {
    return { error: "Email atau password salah" };
  }
  const user = users[idx];
  const newHash = hashPassword(password);
  const legacyHash = legacyHashPassword(password);

  if (user.password === newHash) {
    // Hash baru — login ok
  } else if (user.password === legacyHash) {
    // Hash lama (base64) — auto-migrate ke hash baru
    users[idx].password = newHash;
    saveUsers(users);
  } else {
    return { error: "Email atau password salah" };
  }

  const session = { id: user.id, email: user.email, name: user.name, loggedInAt: Date.now() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  // Auto-activate 7-day trial premium for new users (first login)
  try {
    const profileKey = `matika-profile-${user.id}`;
    const existingProfile = localStorage.getItem(profileKey);
    if (!existingProfile) {
      // New user — no profile yet, grant trial after profile is created
      import("@/lib/gamification").then(({ activatePremium }) => {
        // Small delay so the homepage creates the default profile first
        setTimeout(() => {
          try {
            const raw = localStorage.getItem(profileKey);
            if (raw) {
              const profile = JSON.parse(raw);
              if (!profile.isPremium) {
                profile.isPremium = true;
                profile.premiumActivatedAt = new Date().toISOString().split("T")[0];
                const expires = new Date(Date.now() + 7 * 86400000);
                profile.premiumExpiresAt = expires.toISOString().split("T")[0];
                localStorage.setItem(profileKey, JSON.stringify(profile));
              }
            }
          } catch { console.debug("Failed to activate trial premium"); }
        }, 2000);
      });
    }
  } catch { console.debug("Failed to check existing profile for trial premium"); }

  try {
    import("@/lib/admin/registry").then(({ updateUserRegistry }) => {
      updateUserRegistry(user.id, { lastActive: new Date().toISOString() });
    });
  } catch { console.debug("Failed to update user registry on login"); }

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
  return userId ? `matika-profile-${userId}` : "matika-profile";
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
  } catch { console.debug("Failed to update user registry on profile update"); }

  return {};
}

export function getAllLocalUsers(): LocalUser[] {
  return getUsers();
}
