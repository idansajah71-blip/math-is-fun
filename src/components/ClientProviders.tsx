"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import AccentInit from "@/components/AccentInit";
import RegisterSW from "@/components/RegisterSW";
import { Toaster } from "react-hot-toast";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AccentInit />
      <RegisterSW />
      <AuthProvider>{children}</AuthProvider>
      <Toaster position="top-center" toastOptions={{ duration: 2000, style: { borderRadius: "12px", fontSize: "13px", fontWeight: 700 } }} />
    </ThemeProvider>
  );
}
