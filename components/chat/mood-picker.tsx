"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { api as convexApi } from "@/convex/_generated/api";

interface MoodPickerProps {
  userId: Id<"users">;
  currentMood?: string;
  onSelect: (mood: string) => void;
}

const moods = [
  { emoji: "\u{1F60A}", label: "Happy", value: "happy" },
  { emoji: "\u{1F60C}", label: "Calm", value: "calm" },
  { emoji: "\u{1F614}", label: "Sad", value: "sad" },
  { emoji: "\u{1F620}", label: "Frustrated", value: "frustrated" },
  { emoji: "\u{1F630}", label: "Anxious", value: "anxious" },
  { emoji: "\u{1F634}", label: "Tired", value: "tired" },
  { emoji: "\u{1F525}", label: "Motivated", value: "motivated" },
  { emoji: "\u{1F914}", label: "Thoughtful", value: "thoughtful" },
];

export function MoodPicker({ userId, currentMood, onSelect }: MoodPickerProps) {
  const [selected, setSelected] = useState(currentMood || "");
  const updatePreferences = useMutation(api.users.updatePreferences);
  const recordMood = useMutation(convexApi.moodHistory.record);

  async function handleSelect(mood: string) {
    setSelected(mood);
    onSelect(mood);
    await updatePreferences({ userId, mood });
    recordMood({ userId, mood }).catch(() => {});
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {moods.map((mood, i) => (
        <motion.button
          key={mood.value}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => handleSelect(mood.value)}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
            selected === mood.value
              ? "bg-zari-accent/20 border border-zari-accent/40 scale-110"
              : "bg-black/20 border border-white/5 hover:border-white/15"
          }`}
        >
          <span className="text-xl">{mood.emoji}</span>
          <span className="text-[10px] text-zari-muted tracking-wider">
            {mood.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
