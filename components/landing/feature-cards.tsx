"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Feature {
  id: string;
  icon: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
}

const FEATURES: Feature[] = [
  {
    id: "remembers",
    icon: "🧠",
    title: "Remembers You",
    shortDesc: "Names, goals, people, preferences — Zari never forgets",
    fullDesc:
      "Zari can remember names, goals, preferences, important dates, routines, and conversations you choose to keep. This helps future chats feel personal and useful instead of repetitive. You stay in control of saved memories and can edit or remove them anytime. Memories are private to you and never shared.",
  },
  {
    id: "voice",
    icon: "🗣️",
    title: "Speaks Out Loud",
    shortDesc: "Natural Zari Voice conversations. Put your headphones in.",
    fullDesc:
      "Talk naturally with Zari using realistic voice conversations. Listen hands-free while walking, driving, relaxing, or multitasking. Voice mode is designed to feel fluid, responsive, and personal, turning chat into a more human experience. You can switch between text and voice mid-conversation whenever it suits you.",
  },
  {
    id: "languages",
    icon: "🌍",
    title: "16 Languages",
    shortDesc: "Not translation — true fluency with cultural awareness",
    fullDesc:
      "Zari supports multilingual conversations for users around the world. Speak naturally in your preferred language with culturally aware communication designed to feel comfortable, clear, and natural — not robotic translation. Languages include English, Spanish, French, Arabic, Hindi, Korean, Portuguese, and more.",
  },
  {
    id: "personalities",
    icon: "💜",
    title: "3 Personalities",
    shortDesc: "Warm & nurturing, balanced & calm, or bold & direct",
    fullDesc:
      "Choose the style that fits your mood: warm and supportive, balanced and thoughtful, or bold and direct. Adjust how Zari responds so conversations feel more natural and aligned with your needs. Switch personalities anytime — Zari adapts immediately without losing your conversation history.",
  },
];

export function FeatureCards() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = FEATURES.find((f) => f.id === activeId) ?? null;

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12"
      >
        {FEATURES.map((f, i) => (
          <motion.button
            key={f.id}
            type="button"
            onClick={() => setActiveId(f.id)}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            aria-label={`Learn more about ${f.title}`}
            aria-haspopup="dialog"
            className="group cursor-pointer p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-zari-accent/60 hover:bg-black/60 backdrop-blur-sm text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zari-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#06060e]"
          >
            <span className="text-2xl mb-2 block">{f.icon}</span>
            <h3 className="text-xs font-semibold text-zari-text mb-1">
              {f.title}
            </h3>
            <p className="text-[11px] text-zari-muted leading-relaxed">
              {f.shortDesc}
            </p>
            <span className="mt-2 inline-block text-[10px] text-zari-accent/80 group-hover:text-zari-accent uppercase tracking-wider transition-colors">
              Learn more →
            </span>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveId(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`feature-${active.id}-title`}
            className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zari-surface rounded-3xl border border-white/10 max-w-md w-full p-6 sm:p-8 relative shadow-2xl shadow-black/50"
            >
              <button
                type="button"
                onClick={() => setActiveId(null)}
                aria-label="Close feature details"
                className="absolute top-3 right-3 p-2 rounded-lg text-zari-muted hover:text-zari-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zari-accent"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-4xl mb-3 block" aria-hidden="true">
                {active.icon}
              </span>
              <h3
                id={`feature-${active.id}-title`}
                className="text-xl font-semibold text-zari-text mb-3"
              >
                {active.title}
              </h3>
              <p className="text-sm text-zari-text/80 leading-relaxed">
                {active.fullDesc}
              </p>

              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="w-full mt-6 py-3 rounded-xl bg-zari-accent text-white text-sm font-semibold hover:bg-zari-accent/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zari-accent"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
