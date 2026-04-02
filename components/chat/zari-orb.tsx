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
  { scale: number; speed: number; ringOpacity: number }
> = {
  idle: { scale: 1, speed: 3, ringOpacity: 0.3 },
  thinking: { scale: 1.05, speed: 1.5, ringOpacity: 0.5 },
  speaking: { scale: 1.1, speed: 0.6, ringOpacity: 0.7 },
  happy: { scale: 1.15, speed: 0.8, ringOpacity: 0.6 },
  empathy: { scale: 1.08, speed: 2, ringOpacity: 0.5 },
  bold: { scale: 1.12, speed: 0.5, ringOpacity: 0.6 },
};

export function ZariOrb({ emotion, size = 64 }: ZariOrbProps) {
  const config = emotionConfig[emotion];
  const isActive = emotion !== "idle";

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size * 1.4, height: size * 1.4 }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.4,
          height: size * 1.4,
          background: "radial-gradient(circle, rgba(79,139,255,0.15), transparent 70%)",
          filter: `blur(${size * 0.15}px)`,
        }}
        animate={{
          scale: isActive ? [1, 1.15, 1] : [1, 1.05, 1],
          opacity: isActive ? [0.5, 0.8, 0.5] : [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: config.speed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Glowing ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.15,
          height: size * 1.15,
          border: `${Math.max(1, size * 0.02)}px solid rgba(124,92,252,${config.ringOpacity})`,
          boxShadow: `0 0 ${size * 0.2}px rgba(79,139,255,0.2), inset 0 0 ${size * 0.1}px rgba(124,92,252,0.1)`,
        }}
        animate={{
          rotate: [0, 360],
          scale: isActive ? [1, config.scale * 0.95, 1] : 1,
        }}
        transition={{
          rotate: { duration: 12, repeat: Infinity, ease: "linear" },
          scale: { duration: config.speed, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Second ring — offset */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.22,
          height: size * 1.22,
          border: `${Math.max(1, size * 0.01)}px solid rgba(79,139,255,0.15)`,
        }}
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Core orb — purple to blue gradient */}
      <motion.div
        className="relative rounded-full overflow-hidden"
        style={{
          width: size,
          height: size,
          background: "radial-gradient(circle at 38% 35%, #d8b4fe 0%, #a78bfa 20%, #7c5cfc 45%, #4f8bff 75%, #38b2ff 100%)",
          boxShadow: `0 0 ${size * 0.4}px rgba(124,92,252,0.4), 0 0 ${size * 0.8}px rgba(79,139,255,0.15)`,
        }}
        animate={{
          scale: isActive
            ? [1, config.scale, 0.98, config.scale, 1]
            : [1, 1.02, 1],
          ...(emotion === "speaking"
            ? { x: [0, -1, 2, -1, 1, 0], y: [0, 1, -1, 1, -1, 0] }
            : {}),
        }}
        transition={{
          duration: config.speed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Highlight / shine spot */}
        <div
          className="absolute rounded-full"
          style={{
            width: size * 0.35,
            height: size * 0.25,
            top: "15%",
            left: "18%",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.5), transparent)",
            transform: "rotate(-15deg)",
          }}
        />

        {/* Subtle sparkle particles */}
        {size >= 40 && (
          <>
            <motion.div
              className="absolute rounded-full bg-white/40"
              style={{ width: 2, height: 2, top: "25%", right: "22%" }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="absolute rounded-full bg-white/30"
              style={{ width: 1.5, height: 1.5, top: "60%", left: "20%" }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
            />
            <motion.div
              className="absolute rounded-full bg-white/25"
              style={{ width: 1.5, height: 1.5, bottom: "25%", right: "30%" }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            />
          </>
        )}

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
