"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface BreathingExerciseProps {
  onClose: () => void;
}

const PHASES = [
  { label: "Breathe in", duration: 4000, scale: 1.5, color: "from-zari-accent to-blue-500" },
  { label: "Hold", duration: 4000, scale: 1.5, color: "from-blue-500 to-purple-500" },
  { label: "Breathe out", duration: 4000, scale: 1, color: "from-purple-500 to-zari-accent" },
  { label: "Hold", duration: 2000, scale: 1, color: "from-zari-accent to-zari-accent" },
];

const TOTAL_CYCLES = 4;

export function BreathingExercise({ onClose }: BreathingExerciseProps) {
  const [phase, setPhase] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const nextPhase = useCallback(() => {
    setPhase((prev) => {
      const next = prev + 1;
      if (next >= PHASES.length) {
        setCycle((c) => {
          if (c + 1 >= TOTAL_CYCLES) {
            setFinished(true);
            return c;
          }
          return c + 1;
        });
        return 0;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setTimeout(nextPhase, PHASES[phase].duration);
    return () => clearTimeout(timer);
  }, [phase, started, finished, nextPhase]);

  const current = PHASES[phase];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#06060e]/95 backdrop-blur-xl flex items-center justify-center"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-xl text-zari-muted/40 hover:text-zari-muted transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="text-center">
        {!started && !finished && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-zari-text mb-3">
              Let&apos;s Breathe Together
            </h2>
            <p className="text-sm text-zari-muted mb-2 max-w-xs mx-auto">
              4 rounds of box breathing. Focus on the circle. Let everything
              else go.
            </p>
            <p className="text-xs text-zari-accent/60 mb-8">
              Put your headphones in and close your eyes between breaths
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-8 py-4 rounded-2xl bg-zari-accent text-white font-semibold text-lg hover:bg-zari-accent/90 transition-all shadow-lg shadow-zari-accent/25"
            >
              Start
            </button>
          </motion.div>
        )}

        {started && !finished && (
          <>
            {/* Breathing circle */}
            <motion.div
              animate={{
                scale: current.scale,
              }}
              transition={{
                duration: current.duration / 1000,
                ease: "easeInOut",
              }}
              className={`w-40 h-40 rounded-full bg-gradient-to-br ${current.color} opacity-30 mx-auto mb-10`}
            />

            <motion.p
              key={`${phase}-${cycle}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-semibold text-zari-text mb-4"
            >
              {current.label}
            </motion.p>

            <p className="text-xs text-zari-muted">
              Round {cycle + 1} of {TOTAL_CYCLES}
            </p>
          </>
        )}

        {finished && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 opacity-30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-zari-text mb-3">
              You did it
            </h2>
            <p className="text-sm text-zari-muted mb-8 max-w-xs mx-auto">
              Take a moment. You&apos;re okay. I&apos;m right here whenever
              you need me.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-zari-accent text-white font-medium hover:bg-zari-accent/90 transition-all"
            >
              Back to Chat
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
