import type { Metadata, Viewport } from "next";
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matika - Matematika Seru Seperti Game",
  description: "Belajar matematika dari SMP hingga Universitas dengan pengalaman game yang menyenangkan",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Matika",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#58CC02" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.18.4/dist/katex.min.css"
          crossOrigin="anonymous"
        />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var c = localStorage.getItem("matika-accent");
              if (!c) return;
              var t = {
                green:  { p:"#58CC02", h:"#46A302", l:"#89E219", bg:"rgba(88,204,2,0.1)", r:"rgba(88,204,2,0.4)" },
                blue:   { p:"#1CB0F6", h:"#1899D6", l:"#4DC9FF", bg:"rgba(28,176,246,0.1)", r:"rgba(28,176,246,0.4)" },
                purple: { p:"#A855F7", h:"#9333EA", l:"#C084FC", bg:"rgba(168,85,247,0.1)", r:"rgba(168,85,247,0.4)" },
                orange: { p:"#FF9600", h:"#E58700", l:"#FFB340", bg:"rgba(255,150,0,0.1)", r:"rgba(255,150,0,0.4)" },
                rose:   { p:"#F43F5E", h:"#E11D48", l:"#FB7185", bg:"rgba(244,63,94,0.1)", r:"rgba(244,63,94,0.4)" },
                teal:   { p:"#14B8A6", h:"#0D9488", l:"#2DD4BF", bg:"rgba(20,184,166,0.1)", r:"rgba(20,184,166,0.4)" }
              };
              var x = t[c];
              if (!x) return;
              var s = document.documentElement.style;
              s.setProperty("--primary", x.p);
              s.setProperty("--primary-hover", x.h);
              s.setProperty("--primary-light", x.l);
              s.setProperty("--primary-bg", x.bg);
              s.setProperty("--duo-green", x.p);
              s.setProperty("--duo-green-dark", x.h);
              s.setProperty("--duo-green-light", x.l);
              s.setProperty("--duo-green-bg", x.bg);
              s.setProperty("--shadow-button", "0 4px 0 "+x.h);
              s.setProperty("--focus-ring", x.r);
            } catch(e){}
          })();
        ` }} />
      </head>
      <body className="min-h-screen bg-[var(--duo-bg)] text-[var(--duo-text)] antialiased font-sans">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
