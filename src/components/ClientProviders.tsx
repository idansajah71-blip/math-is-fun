"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import AccentInit from "@/components/AccentInit";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AccentInit />
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
