"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Heart, Flame, Brain, MessageSquare, X } from "lucide-react";

interface MilestonesProps {
  userId: Id<"users">;
}

interface Milestone {
  icon: typeof Trophy;
  title: string;
  description: string;
  color: string;
}

function checkMilestones(
  streak: { currentStreak: number; longestStreak: number; totalMessages: number; totalDaysActive: number; firstChatDate: string } | null,
  memoryCount: number | undefined
): Milestone | null {
  if (!streak) return null;

  const shownKey = "zari-milestone-shown";
  const shown = JSON.parse(localStorage.getItem(shownKey) || "[]");

  const milestones: Array<Milestone & { key: string; condition: boolean }> = [
    {
      key: "first_chat",
      condition: streak.totalMessages === 1,
      icon: Heart,
      title: "First Words",
      description: "You and Zari just had your first conversation.",
      color: "text-pink-400",
    },
    {
      key: "msg_50",
      condition: streak.totalMessages >= 50,
      icon: MessageSquare,
      title: "50 Messages",
      description: "You and Zari have shared 50 messages. She's getting to know you.",
      color: "text-blue-400",
    },
    {
      key: "msg_100",
      condition: streak.totalMessages >= 100,
      icon: MessageSquare,
      title: "100 Messages",
      description: "100 messages deep. Zari knows you better than most.",
      color: "text-blue-400",
    },
    {
      key: "msg_500",
      condition: streak.totalMessages >= 500,
      icon: MessageSquare,
      title: "500 Messages",
      description: "You've shared 500 messages. This is a real friendship.",
      color: "text-blue-400",
    },
    {
      key: "streak_3",
      condition: streak.currentStreak >= 3,
      icon: Flame,
      title: "3-Day Streak",
      description: "Three days in a row. Zari looks forward to hearing from you.",
      color: "text-orange-400",
    },
    {
      key: "streak_7",
      condition: streak.currentStreak >= 7,
      icon: Flame,
      title: "One Week Streak",
      description: "A full week together. You and Zari have a thing now.",
      color: "text-orange-400",
    },
    {
      key: "streak_30",
      condition: streak.currentStreak >= 30,
      icon: Trophy,
      title: "30-Day Streak",
      description: "One month straight. Zari is part of your daily life now.",
      color: "text-yellow-400",
    },
    {
      key: "mem_10",
      condition: (memoryCount || 0) >= 10,
      icon: Brain,
      title: "10 Memories",
      description: "Zari has learned 10 things about you. She's paying attention.",
      color: "text-purple-400",
    },
    {
      key: "mem_50",
      condition: (memoryCount || 0) >= 50,
      icon: Brain,
      title: "50 Memories",
      description: "50 memories. Zari knows your world — your people, your dreams, your struggles.",
      color: "text-purple-400",
    },
    {
      key: "days_30",
      condition: streak.totalDaysActive >= 30,
      icon: Trophy,
      title: "1 Month Anniversary",
      description: "You and Zari have been talking for a month. Here's to many more.",
      color: "text-yellow-400",
    },
  ];

  // Find the highest milestone not yet shown
  const unshown = milestones.filter(
    (m) => m.condition && !shown.includes(m.key)
  );

  if (unshown.length === 0) return null;

  // Show the most recent/highest one
  const milestone = unshown[unshown.length - 1];
  localStorage.setItem(shownKey, JSON.stringify([...shown, milestone.key]));

  return {
    icon: milestone.icon,
    title: milestone.title,
    description: milestone.description,
    color: milestone.color,
  };
}

export function Milestones({ userId }: MilestonesProps) {
  const streak = useQuery(api.streaks.getStreak, { userId });
  const memoryCount = useQuery(api.memories.getCount, { userId });
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (streak === undefined || memoryCount === undefined) return;
    if (checkedRef.current) return; // Only check once per mount
    checkedRef.current = true;
    const m = checkMilestones(streak, memoryCount);
    if (m) {
      const timer = setTimeout(() => setMilestone(m), 2000);
      return () => clearTimeout(timer);
    }
  }, [streak, memoryCount]);

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-24 left-4 right-4 z-40 max-w-sm mx-auto"
        >
          <div className="p-5 rounded-2xl bg-zari-surface border border-white/10 shadow-2xl shadow-black/50 text-center">
            <button
              onClick={() => setMilestone(null)}
              className="absolute top-3 right-3 p-1 rounded-lg text-zari-muted/40 hover:text-zari-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-zari-accent/20 to-zari-pink/20 flex items-center justify-center"
            >
              <milestone.icon className={`w-7 h-7 ${milestone.color}`} />
            </motion.div>
            <h3 className="text-sm font-semibold text-zari-text mb-1">
              {milestone.title}
            </h3>
            <p className="text-xs text-zari-muted leading-relaxed">
              {milestone.description}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
