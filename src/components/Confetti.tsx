"use client";

import { useEffect, useRef } from "react";

export default function Confetti({ show, onComplete }: { show: boolean; onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!show || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#1a73e8", "#34a853", "#fbbc04", "#ea4335", "#8b5cf6", "#ec4899"];
    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; rotation: number; rotSpeed: number; life: number }[] = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 15,
        vy: Math.random() * -18 - 5,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 15,
        life: 1,
      });
    }

    let frame = 0;
    const maxFrames = 120;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.vy += 0.4;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.life -= 0.008;

        if (p.life <= 0) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }

      frame++;
      if (frame < maxFrames) {
        requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    };

    animate();
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
    />
  );
}
