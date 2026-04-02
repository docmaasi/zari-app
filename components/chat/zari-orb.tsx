"use client";

import { motion } from "framer-motion";

type Emotion = "idle" | "thinking" | "speaking" | "happy" | "empathy" | "bold";

interface ZariOrbProps {
  emotion: Emotion;
  gender: string;
  size?: number;
}

const emotionConfig: Record<
  Emotion,
  { colors: string[]; scale: number; blur: string; speed: number }
> = {
  idle: {
    colors: ["#7c5cfc", "#a78bfa", "#7c5cfc"],
    scale: 1,
    blur: "blur-xl",
    speed: 3,
  },
  thinking: {
    colors: ["#f59e0b", "#fbbf24", "#f59e0b"],
    scale: 1.05,
    blur: "blur-2xl",
    speed: 1.5,
  },
  speaking: {
    colors: ["#7c5cfc", "#e855a0", "#38b2ff"],
    scale: 1.1,
    blur: "blur-2xl",
    speed: 0.6,
  },
  happy: {
    colors: ["#10b981", "#34d399", "#6ee7b7"],
    scale: 1.15,
    blur: "blur-2xl",
    speed: 0.8,
  },
  empathy: {
    colors: ["#e855a0", "#f472b6", "#ec4899"],
    scale: 1.08,
    blur: "blur-2xl",
    speed: 2,
  },
  bold: {
    colors: ["#38b2ff", "#0ea5e9", "#06b6d4"],
    scale: 1.12,
    blur: "blur-2xl",
    speed: 0.5,
  },
};

export function ZariOrb({ emotion, gender, size = 64 }: ZariOrbProps) {
  const config = emotionConfig[emotion];

  // Override colors based on gender for speaking
  const genderColors =
    emotion === "speaking"
      ? gender === "female"
        ? ["#e855a0", "#f472b6", "#e855a0"]
        : gender === "male"
          ? ["#38b2ff", "#0ea5e9", "#38b2ff"]
          : config.colors
      : config.colors;

  const isActive = emotion !== "idle";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Outer glow */}
      <motion.div
        className={`absolute rounded-full ${config.blur} opacity-60`}
        style={{
          width: size * 1.6,
          height: size * 1.6,
          background: `radial-gradient(circle, ${genderColors[0]}40, transparent 70%)`,
        }}
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
          opacity: isActive ? [0.4, 0.7, 0.4] : 0.3,
        }}
        transition={{
          duration: config.speed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Middle ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.2,
          height: size * 1.2,
          background: `conic-gradient(from 0deg, ${genderColors[0]}, ${genderColors[1]}, ${genderColors[2]}, ${genderColors[0]})`,
          opacity: 0.15,
        }}
        animate={{
          rotate: [0, 360],
          scale: isActive ? [1, config.scale, 1] : 1,
        }}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          scale: {
            duration: config.speed,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      {/* Core orb */}
      <motion.div
        className="relative rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 35% 35%, ${genderColors[1]}, ${genderColors[0]} 60%, ${genderColors[2]})`,
          boxShadow: `0 0 ${size / 2}px ${genderColors[0]}60, inset 0 0 ${size / 3}px ${genderColors[1]}40`,
        }}
        animate={{
          scale: isActive
            ? [1, config.scale, 0.98, config.scale, 1]
            : [1, 1.02, 1],
          ...(emotion === "speaking"
            ? {
                x: [0, -2, 3, -1, 2, 0],
                y: [0, 1, -2, 2, -1, 0],
              }
            : {}),
        }}
        transition={{
          duration: config.speed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Inner highlight */}
        <div
          className="absolute rounded-full"
          style={{
            width: size * 0.3,
            height: size * 0.2,
            top: "18%",
            left: "22%",
            background: `radial-gradient(ellipse, rgba(255,255,255,0.4), transparent)`,
            transform: "rotate(-20deg)",
          }}
        />

        {/* Thinking dots overlay */}
        {emotion === "thinking" && (
          <div className="absolute inset-0 flex items-center justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/80"
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        )}

        {/* Speaking wave bars */}
        {emotion === "speaking" && (
          <div className="absolute inset-0 flex items-center justify-center gap-[3px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-full bg-white/70"
                animate={{ height: ["8px", "18px", "6px", "16px", "8px"] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
