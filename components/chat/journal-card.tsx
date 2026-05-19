"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { BookOpen, ArrowRight, X } from "lucide-react";

interface JournalCardProps {
  userId: Id<"users">;
}

// Shown in chat empty-state whenever Zari has a journal entry the user hasn't
// acknowledged yet. Cache is regenerated weekly server-side; once cache is
// fresher than `seenInChatAt`, the card resurfaces.

export function JournalCard({ userId }: JournalCardProps) {
  const cached = useQuery(api.journal.getCached, { userId });
  const markSeen = useMutation(api.journal.markSeenInChat);
  const [dismissed, setDismissed] = useState(false);

  // Trigger a regen when the cache is stale; the API caches the new entries
  // so the next render of this card will show fresh content.
  useEffect(() => {
    if (cached === undefined) return;
    const stale = !cached || cached.stale;
    if (stale && !dismissed) {
      fetch("/api/journal", { method: "POST" }).catch(() => {});
    }
  }, [cached, dismissed]);

  if (cached === undefined || cached === null) return null;
  if (dismissed) return null;

  const seenAfterGen =
    cached.seenInChatAt && cached.seenInChatAt >= cached.generatedAt;
  if (seenAfterGen) return null;

  const handleDismiss = async () => {
    setDismissed(true);
    try {
      await markSeen({ userId });
    } catch {}
  };

  let preview = "";
  try {
    const arr = JSON.parse(cached.entries) as Array<{ text: string; mood?: string }>;
    preview = arr[arr.length - 1]?.text || "";
  } catch {
    preview = "";
  }
  if (!preview) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative max-w-md mx-auto mb-6 px-5 py-4 rounded-2xl bg-gradient-to-br from-zari-accent/10 to-zari-pink/5 border border-zari-accent/20 backdrop-blur-sm"
    >
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/5 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5 text-zari-muted/60" />
      </button>

      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-4 h-4 text-zari-accent" />
        <span className="text-[11px] text-zari-accent font-semibold uppercase tracking-widest">
          Zari wrote about you
        </span>
      </div>

      <p className="text-sm text-zari-text/90 italic leading-relaxed mb-3 line-clamp-3">
        &ldquo;{preview.length > 200 ? preview.slice(0, 200) + "…" : preview}&rdquo;
      </p>

      <Link
        href="/journal"
        onClick={handleDismiss}
        className="inline-flex items-center gap-1.5 text-xs text-zari-accent hover:text-zari-accent-light transition-colors"
      >
        Read the whole entry
        <ArrowRight className="w-3 h-3" />
      </Link>
    </motion.div>
  );
}
