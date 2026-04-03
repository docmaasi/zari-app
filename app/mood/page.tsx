"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { MatrixRain } from "@/components/chat/matrix-rain";

const moodEmoji: Record<string, string> = {
  happy: "\u{1F60A}",
  calm: "\u{1F60C}",
  sad: "\u{1F614}",
  frustrated: "\u{1F620}",
  anxious: "\u{1F630}",
  tired: "\u{1F634}",
  motivated: "\u{1F525}",
  thoughtful: "\u{1F914}",
};

const moodScore: Record<string, number> = {
  happy: 5, motivated: 5,
  calm: 4, thoughtful: 4,
  tired: 2, anxious: 2,
  frustrated: 1, sad: 1,
};

export default function MoodPage() {
  const { user: clerkUser } = useUser();
  const convexUser = useQuery(
    api.users.getByClerkId,
    clerkUser ? { clerkId: clerkUser.id } : "skip"
  );
  const moods = useQuery(
    api.moodHistory.getLast30Days,
    convexUser ? { userId: convexUser._id } : "skip"
  );

  const sortedMoods = [...(moods || [])].reverse();
  const maxScore = 5;

  return (
    <div className="min-h-screen bg-[#06060e] font-mono relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MatrixRain color="#7c5cfc" opacity={0.025} speed={0.5} />
      </div>

      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/chat" className="flex items-center gap-2 text-zari-muted hover:text-zari-text transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-zari-accent" />
            <span className="text-sm font-semibold text-zari-text">Mood Journal</span>
          </div>
        </div>
      </nav>

      <div className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-zari-text mb-2 text-center">
            Your Emotional Journey
          </h1>
          <p className="text-sm text-zari-muted text-center mb-10">
            How you&apos;ve been feeling over the last 30 days.
          </p>

          {sortedMoods.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-zari-muted">
                No mood data yet. Use the mood picker in chat to start tracking.
              </p>
            </div>
          ) : (
            <>
              {/* Visual chart */}
              <div className="mb-10 p-6 rounded-2xl bg-zari-surface border border-white/5">
                <h3 className="text-xs text-zari-muted uppercase tracking-wider mb-4">
                  Mood over time
                </h3>
                <div className="flex items-end gap-1 h-32">
                  {sortedMoods.map((m, i) => {
                    const score = moodScore[m.mood] || 3;
                    const height = (score / maxScore) * 100;
                    const colors: Record<number, string> = {
                      5: "bg-green-400",
                      4: "bg-blue-400",
                      3: "bg-zari-accent",
                      2: "bg-yellow-400",
                      1: "bg-red-400",
                    };
                    return (
                      <motion.div
                        key={m._id}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: i * 0.03 }}
                        className={`flex-1 rounded-t-sm ${colors[score] || "bg-zari-accent"} opacity-80`}
                        title={`${m.date}: ${m.mood}`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2 text-[9px] text-zari-muted/40">
                  <span>{sortedMoods[0]?.date}</span>
                  <span>{sortedMoods[sortedMoods.length - 1]?.date}</span>
                </div>
              </div>

              {/* Mood list */}
              <div className="space-y-2">
                {[...(moods || [])].map((m, i) => (
                  <motion.div
                    key={m._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <span className="text-xl">{moodEmoji[m.mood] || "\u{1F610}"}</span>
                    <div className="flex-1">
                      <span className="text-sm text-zari-text capitalize">{m.mood}</span>
                    </div>
                    <span className="text-xs text-zari-muted/50">{m.date}</span>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
