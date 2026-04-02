"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakBadgeProps {
  userId: Id<"users">;
}

export function StreakBadge({ userId }: StreakBadgeProps) {
  const streak = useQuery(api.streaks.getStreak, { userId });

  if (!streak || streak.currentStreak < 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20"
    >
      <Flame className="w-3 h-3 text-orange-400" />
      <span className="text-[10px] font-semibold text-orange-400">
        {streak.currentStreak}
      </span>
    </motion.div>
  );
}
