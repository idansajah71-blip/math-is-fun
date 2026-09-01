"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0, background: "#f8fafc" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "0.5rem" }}>Terjadi kesalahan</h2>
          <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>Maaf, terjadi error yang tidak terduga.</p>
          <button
            onClick={() => reset()}
            style={{ padding: "0.75rem 1.5rem", borderRadius: "0.75rem", background: "#6366f1", color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}
          >
            Coba lagi
          </button>
        </div>
      </body>
    </html>
  );
}
