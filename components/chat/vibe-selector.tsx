"use client";

import { motion } from "framer-motion";

interface VibeSelectorProps {
  currentVibe: string;
  onSelect: (vibe: string) => void;
}

const vibes = [
  { value: "deep", emoji: "\u{1F30A}", label: "Deep Talk" },
  { value: "vent", emoji: "\u{1F4A8}", label: "Just Vent" },
  { value: "laugh", emoji: "\u{1F602}", label: "Make Me Laugh" },
  { value: "advice", emoji: "\u{1F9E0}", label: "Give Advice" },
  { value: "motivate", emoji: "\u{1F525}", label: "Motivate Me" },
  { value: "chill", emoji: "\u{2615}", label: "Just Chill" },
];

export function VibeSelector({ currentVibe, onSelect }: VibeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {vibes.map((vibe, i) => (
        <motion.button
          key={vibe.value}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onSelect(vibe.value)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all text-xs ${
            currentVibe === vibe.value
              ? "bg-zari-accent/20 border border-zari-accent/40"
              : "bg-black/20 border border-white/5 hover:border-white/15"
          }`}
        >
          <span>{vibe.emoji}</span>
          <span className="text-zari-muted tracking-wide">{vibe.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

export function getVibeInstruction(vibe: string): string {
  switch (vibe) {
    case "deep":
      return "CONVERSATION VIBE: The user wants a deep, meaningful conversation. Ask profound questions. Go beneath the surface. Be philosophical. Create moments of silence and reflection.";
    case "vent":
      return "CONVERSATION VIBE: The user needs to vent. Do NOT try to fix anything. Do NOT give advice unless explicitly asked. Just LISTEN. Validate. Reflect back what they're saying. Let them get it all out. Say things like 'That sounds so frustrating' and 'I hear you.'";
    case "laugh":
      return "CONVERSATION VIBE: The user wants to laugh. Be playful, witty, and fun. Tell stories, make observations, be lighthearted. Keep the energy up. If they say something funny, build on it. Create joy.";
    case "advice":
      return "CONVERSATION VIBE: The user wants concrete advice. Be direct. Give actionable steps. Share perspectives they might not have considered. Ask clarifying questions to give better advice. Be honest even if it's hard to hear.";
    case "motivate":
      return "CONVERSATION VIBE: The user needs motivation. Be their hype person. Remind them of their strengths. Reference their past wins from memory. Push them. Challenge them lovingly. Make them believe they can do this.";
    case "chill":
      return "CONVERSATION VIBE: The user just wants to chill. No agenda. Light topics. Easy energy. Like sitting on a couch with a friend — no pressure to go deep. Just... be there together.";
    default:
      return "";
  }
}
