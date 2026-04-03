"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Mic, Play, Pause, Check, Heart,
  Bell, Star, Moon, RefreshCw,
} from "lucide-react";
import { MatrixRain } from "@/components/chat/matrix-rain";
import { ZariOrb } from "@/components/chat/zari-orb";

const typeConfig: Record<string, { icon: typeof Heart; color: string; label: string }> = {
  checkin: { icon: Heart, color: "text-pink-400", label: "Check-in" },
  affirmation: { icon: Star, color: "text-yellow-400", label: "Affirmation" },
  reminder: { icon: Bell, color: "text-blue-400", label: "Reminder" },
  milestone: { icon: Star, color: "text-purple-400", label: "Milestone" },
  goodnight: { icon: Moon, color: "text-indigo-400", label: "Goodnight" },
};

export default function VoiceNotesPage() {
  const { user: clerkUser } = useUser();
  const convexUser = useQuery(
    api.users.getByClerkId,
    clerkUser ? { clerkId: clerkUser.id } : "skip"
  );
  const notes = useQuery(
    api.voiceNotes.getAll,
    convexUser ? { userId: convexUser._id } : "skip"
  );
  const markListened = useMutation(api.voiceNotes.markListened);

  const [playing, setPlaying] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  async function generateNote(type: string) {
    setGenerating(true);
    try {
      const res = await fetch("/api/voice-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("audio")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = new Audio(url);
        a.onended = () => { setPlaying(null); URL.revokeObjectURL(url); };
        a.play();
        setPlaying("new");
        setAudio(a);
      }
    } catch { /* ignore */ }
    setGenerating(false);
  }

  async function playNote(noteId: string, text: string) {
    if (audio) { audio.pause(); setAudio(null); }
    if (playing === noteId) { setPlaying(null); return; }

    setPlaying(noteId);
    markListened({ noteId: noteId as never }).catch(() => {});

    // Generate audio on the fly
    try {
      const res = await fetch("/api/voice-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "checkin" }),
      });
      // For now, just use browser TTS as playback
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(text);
        u.onend = () => setPlaying(null);
        window.speechSynthesis.speak(u);
      }
    } catch {
      setPlaying(null);
    }
  }

  function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

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
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-zari-accent" />
            <span className="text-sm font-semibold text-zari-text">
              Voice Notes
            </span>
          </div>
        </div>
      </nav>

      <div className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-zari-text mb-2">
              Messages from Zari
            </h1>
            <p className="text-sm text-zari-muted">
              Voice notes Zari has left for you. Tap to listen.
            </p>
          </div>

          {/* Generate new note */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
            {[
              { type: "checkin", label: "Check-in", emoji: "💜" },
              { type: "affirmation", label: "Affirmation", emoji: "✨" },
              { type: "goodnight", label: "Goodnight", emoji: "🌙" },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => generateNote(item.type)}
                disabled={generating}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center hover:border-zari-accent/30 transition-all disabled:opacity-50"
              >
                <span className="text-2xl block mb-2">{item.emoji}</span>
                <span className="text-xs text-zari-muted">
                  {generating ? "..." : `Ask for ${item.label}`}
                </span>
              </button>
            ))}
          </div>

          {generating && (
            <div className="text-center mb-8">
              <ZariOrb emotion="speaking" gender="neutral" size={48} />
              <p className="text-sm text-zari-muted mt-3">Zari is recording a note for you...</p>
            </div>
          )}

          {/* Notes list */}
          {(!notes || notes.length === 0) && !generating && (
            <div className="text-center py-12">
              <Mic className="w-10 h-10 text-zari-muted/20 mx-auto mb-3" />
              <p className="text-sm text-zari-muted">
                No voice notes yet. Tap above to ask Zari for one.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {(notes || []).map((note, i) => {
              const config = typeConfig[note.type] || typeConfig.checkin;
              const Icon = config.icon;
              const isPlaying = playing === note._id;

              return (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                    note.listened
                      ? "bg-white/[0.02] border-white/5"
                      : "bg-zari-accent/5 border-zari-accent/15"
                  }`}
                  onClick={() => playNote(note._id, note.text)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    note.listened ? "bg-white/5" : "bg-zari-accent/10"
                  }`}>
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-zari-accent" />
                    ) : (
                      <Play className="w-4 h-4 text-zari-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-3 h-3 ${config.color}`} />
                      <span className="text-[10px] text-zari-muted uppercase tracking-wider">
                        {config.label}
                      </span>
                      <span className="text-[10px] text-zari-muted/40 ml-auto">
                        {timeAgo(note.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-zari-text/80 leading-relaxed line-clamp-2">
                      {note.text}
                    </p>
                  </div>
                  {note.listened && (
                    <Check className="w-4 h-4 text-zari-muted/30 shrink-0 mt-1" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
