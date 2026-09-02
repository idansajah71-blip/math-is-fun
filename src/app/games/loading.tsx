export default function Loading() {
  return (
    <div className="flex min-h-screen bg-[var(--duo-bg)] items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--duo-green)] flex items-center justify-center animate-bounce">
          <span className="text-white font-black text-2xl">Σ</span>
        </div>
        <div className="flex items-center gap-1.5 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[var(--duo-green)] animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="mt-3 text-xs font-bold text-[var(--duo-text-muted)]">Memuat...</p>
      </div>
    </div>
  );
}
