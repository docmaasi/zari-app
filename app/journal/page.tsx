"use client";

import { useState, useEffect } from "react";
import { MatrixRain } from "@/components/chat/matrix-rain";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Heart,
  Sparkles,
  Shield,
  Eye,
  Smile,
  HelpCircle,
  Star,
  Lock,
} from "lucide-react";

const moodIcons: Record<string, { icon: typeof Heart; color: string }> = {
  curious: { icon: HelpCircle, color: "text-blue-400" },
  warm: { icon: Heart, color: "text-pink-400" },
  proud: { icon: Star, color: "text-yellow-400" },
  protective: { icon: Shield, color: "text-green-400" },
  hopeful: { icon: Sparkles, color: "text-purple-400" },
  amused: { icon: Smile, color: "text-orange-400" },
  concerned: { icon: Eye, color: "text-red-400" },
  grateful: { icon: Heart, color: "text-rose-400" },
};

interface JournalEntry {
  text: string;
  mood: string;
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/journal", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setEntries(data.entries || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#06060e] font-mono relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MatrixRain color="#7c5cfc" opacity={0.025} speed={0.5} />
      </div>
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/chat"
            className="flex items-center gap-2 text-zari-muted hover:text-zari-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Chat</span>
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-zari-accent" />
            <span className="text-sm font-semibold text-zari-text">
              Zari&apos;s Journal
            </span>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-zari-text mb-3">
              What Zari Thinks About You
            </h1>
            <p className="text-sm text-zari-muted max-w-md mx-auto mb-3">
              These are Zari&apos;s private reflections — her thoughts,
              observations, and feelings about your friendship.
            </p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-zari-muted/50">
              <Lock className="w-3 h-3" />
              Only you can see this
            </div>
          </div>

          {loading && (
            <div className="text-center py-16">
              <BookOpen className="w-8 h-8 text-zari-accent animate-pulse mx-auto mb-3" />
              <p className="text-sm text-zari-muted">
                Zari is writing...
              </p>
            </div>
          )}

          {!loading && entries.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-zari-muted">
                Talk to Zari more and she&apos;ll start journaling about you.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {entries.map((entry, i) => {
              const mood = moodIcons[entry.mood] || moodIcons.curious;
              const MoodIcon = mood.icon;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="relative p-6 rounded-2xl bg-zari-surface border border-white/5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <MoodIcon className={`w-4 h-4 ${mood.color}`} />
                    <span className="text-xs text-zari-muted capitalize tracking-wider">
                      Feeling {entry.mood}
                    </span>
                  </div>
                  <p className="text-sm text-zari-text/90 leading-relaxed italic">
                    &ldquo;{entry.text}&rdquo;
                  </p>
                  <div className="mt-3 text-right">
                    <span className="text-[10px] text-zari-muted/40 tracking-widest">
                      — Zari
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
