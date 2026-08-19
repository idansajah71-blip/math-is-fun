import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "BelajarMTK",
  description: "Matematika Lengkap dari SMP hingga Universitas",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "BelajarMTK" },
};

export const viewport: Viewport = {
  themeColor: "#1a73e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
