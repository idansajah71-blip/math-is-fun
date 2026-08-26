"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import AccentInit from "@/components/AccentInit";
import RegisterSW from "@/components/RegisterSW";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AccentInit />
      <RegisterSW />
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
