"use client";

import { motion } from "framer-motion";

type Emotion = "idle" | "thinking" | "speaking" | "happy" | "empathy" | "bold";

interface ZariOrbProps {
  emotion: Emotion;
  // Kept for back-compat — no longer used. Personality tints are now derived
  // from the global brand palette, not the user's personality field.
  gender?: string;
  size?: number;
}

const emotionConfig: Record<
  Emotion,
  { scale: number; speed: number; ringOpacity: number }
> = {
  idle: { scale: 1, speed: 3, ringOpacity: 0.35 },
  thinking: { scale: 1.05, speed: 1.5, ringOpacity: 0.55 },
  speaking: { scale: 1.1, speed: 0.6, ringOpacity: 0.75 },
  happy: { scale: 1.15, speed: 0.8, ringOpacity: 0.65 },
  empathy: { scale: 1.08, speed: 2, ringOpacity: 0.55 },
  bold: { scale: 1.12, speed: 0.5, ringOpacity: 0.7 },
};

export function ZariOrb({ emotion, size = 64 }: ZariOrbProps) {
  const config = emotionConfig[emotion];
  const isActive = emotion !== "idle";

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size * 1.4, height: size * 1.4 }}
    >
      {/* Outer glow — magenta */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.4,
          height: size * 1.4,
          background:
            "radial-gradient(circle, rgba(255,61,138,0.22), rgba(177,74,255,0.12) 50%, transparent 75%)",
          filter: `blur(${size * 0.18}px)`,
        }}
        animate={{
          scale: isActive ? [1, 1.15, 1] : [1, 1.05, 1],
          opacity: isActive ? [0.6, 0.9, 0.6] : [0.35, 0.5, 0.35],
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
          border: `${Math.max(1, size * 0.02)}px solid rgba(255,61,138,${config.ringOpacity})`,
          boxShadow: `0 0 ${size * 0.22}px rgba(255,61,138,0.25), inset 0 0 ${size * 0.1}px rgba(177,74,255,0.18)`,
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

      {/* Outer-outer ring — cyan accent */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 1.22,
          height: size * 1.22,
          border: `${Math.max(1, size * 0.01)}px solid rgba(92,241,255,0.18)`,
        }}
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Core orb — magenta → violet → cyan */}
      <motion.div
        className="relative rounded-full overflow-hidden"
        style={{
          width: size,
          height: size,
          background:
            "radial-gradient(circle at 35% 30%, #ffd2e3 0%, #ff7eb1 18%, #ff3d8a 40%, #b14aff 72%, #5cf1ff 100%)",
          boxShadow: `0 0 ${size * 0.4}px rgba(255,61,138,0.45), 0 0 ${size * 0.8}px rgba(177,74,255,0.18)`,
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
        {/* Highlight / shine */}
        <div
          className="absolute rounded-full"
          style={{
            width: size * 0.35,
            height: size * 0.25,
            top: "15%",
            left: "18%",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.55), transparent)",
            transform: "rotate(-15deg)",
          }}
        />

        {/* Sparkle particles */}
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

        {/* Thinking dots */}
        {emotion === "thinking" && (
          <div className="absolute inset-0 flex items-center justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/90"
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
                className="w-[3px] rounded-full bg-white/80"
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
