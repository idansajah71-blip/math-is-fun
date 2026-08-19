"use client";

import { useEffect, useRef } from "react";

interface ConfettiProps {
  show: boolean;
  duration?: number;
  particleCount?: number;
  onComplete?: () => void;
}

export default function Confetti({ show, duration = 2000, particleCount = 80, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!show || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#58CC02", "#FFD900", "#FF4B4B", "#1CB0F6", "#CE82FF", "#FF9600", "#FF86D0"];
    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; color: string; rotation: number;
      rotSpeed: number; life: number; shape: string;
    }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.6,
        y: canvas.height * 0.3 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 20,
        vy: Math.random() * -20 - 8,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 20,
        life: 1,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      });
    }

    let frame = 0;
    const maxFrames = Math.floor((duration / 1000) * 60);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.vy += 0.5;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.life -= 0.012;

        if (p.life <= 0) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

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
  }, [show, duration, particleCount, onComplete]);

  if (!show) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
    />
  );
}
