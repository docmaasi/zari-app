"use client";

import { useEffect, useRef } from "react";

interface MatrixRainProps {
  color?: string;
  opacity?: number;
  speed?: number;
}

const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFZARI";

export function MatrixRain({
  color = "#7c5cfc",
  opacity = 0.06,
  speed = 1,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const fontSize = 14;
    const trailLength = 20;
    let columns: number;
    let drops: number[];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns)
        .fill(0)
        .map(() => Math.random() * -50);
    };

    resize();
    window.addEventListener("resize", resize);

    // Store characters for trail effect
    const trails: string[][] = [];

    const draw = () => {
      // Clear canvas completely — no accumulating dark overlay
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "JetBrains Mono", "Fira Code", monospace`;

      for (let i = 0; i < columns; i++) {
        // Initialize trail array for this column
        if (!trails[i]) trails[i] = [];

        const y = drops[i];

        // Add new character at the head
        if (y >= 0) {
          const char = CHARS[Math.floor(Math.random() * CHARS.length)];
          trails[i].unshift(char);
          if (trails[i].length > trailLength) trails[i].pop();
        }

        // Draw trail
        for (let j = 0; j < trails[i].length; j++) {
          const charY = (y - j) * fontSize;
          if (charY < 0 || charY > canvas.height) continue;

          // Leading char is brightest, fades along trail
          const fade = 1 - j / trailLength;
          const alpha = j === 0 ? opacity * 3 : opacity * fade;

          ctx.globalAlpha = alpha;
          ctx.fillStyle = color;
          ctx.fillText(trails[i][j], i * fontSize, charY);
        }

        // Advance drop
        drops[i] += speed;

        // Reset when off screen
        if (drops[i] * fontSize > canvas.height + trailLength * fontSize) {
          drops[i] = Math.random() * -20;
          trails[i] = [];
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [color, opacity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
