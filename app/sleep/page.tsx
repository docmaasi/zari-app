"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Moon, Play, Pause, Headphones, RefreshCw } from "lucide-react";
import { ZariOrb } from "@/components/chat/zari-orb";

const AMBIENT_SOUNDS = [
  { id: "rain", label: "Rain", url: "https://cdn.freesound.org/previews/531/531947_6142149-lq.mp3" },
  { id: "ocean", label: "Ocean", url: "https://cdn.freesound.org/previews/467/467005_5765668-lq.mp3" },
  { id: "fire", label: "Fireplace", url: "https://cdn.freesound.org/previews/532/532024_2587400-lq.mp3" },
];

export default function SleepPage() {
  const [story, setStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const ambientRef = useRef<HTMLAudioElement | null>(null);

  async function generateStory() {
    setLoading(true);
    setStory(null);
    try {
      const res = await fetch("/api/sleep-story", { method: "POST" });
      const data = await res.json();
      if (data.story) setStory(data.story);
    } catch { /* ignore */ }
    setLoading(false);
  }

  function speakStory() {
    if (!story || typeof window === "undefined") return;
    if (speaking) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    const u = new SpeechSynthesisUtterance(story);
    u.rate = 0.8;
    u.pitch = 1.0;
    u.volume = 0.85;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis?.speak(u);
  }

  function toggleAmbient(url: string) {
    if (ambientRef.current) {
      ambientRef.current.pause();
      ambientRef.current = null;
      setAmbientPlaying(false);
      return;
    }
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0.2;
    audio.play().catch(() => {});
    ambientRef.current = audio;
    setAmbientPlaying(true);
  }

  return (
    <div className="min-h-screen bg-[#04040a] font-mono relative overflow-hidden">
      {/* Soft dark gradient — no matrix rain for sleep mode */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#06060e] to-[#04040a] pointer-events-none" />

      <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/chat" className="flex items-center gap-2 text-zari-muted hover:text-zari-text transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-semibold text-zari-text">Sleep Mode</span>
          </div>
        </div>
      </nav>

      <div className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <ZariOrb emotion={speaking ? "speaking" : "idle"} gender="neutral" size={80} />
          </motion.div>

          <h1 className="text-2xl font-bold text-zari-text mb-2">
            Sleep with Zari
          </h1>
          <p className="text-sm text-zari-muted/70 mb-3">
            A personalized bedtime story, told by Zari, just for you.
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-indigo-400/60 mb-8">
            <Headphones className="w-3.5 h-3.5" />
            <span>Best with headphones</span>
          </div>

          {/* Ambient sound picker */}
          <div className="flex justify-center gap-3 mb-8">
            {AMBIENT_SOUNDS.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleAmbient(s.url)}
                className={`px-4 py-2 rounded-xl text-xs transition-all ${
                  ambientPlaying
                    ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300"
                    : "bg-white/[0.03] border border-white/5 text-zari-muted hover:text-zari-text"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {!story && !loading && (
            <button
              onClick={generateStory}
              className="px-8 py-4 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-medium hover:bg-indigo-500/30 transition-all"
            >
              <Moon className="w-4 h-4 inline mr-2" />
              Tell me a bedtime story
            </button>
          )}

          {loading && (
            <div className="py-8">
              <ZariOrb emotion="thinking" gender="neutral" size={48} />
              <p className="text-sm text-zari-muted mt-4">Zari is writing your story...</p>
            </div>
          )}

          {story && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-left"
            >
              <p className="text-sm text-zari-text/70 leading-[1.8] mb-8 whitespace-pre-wrap">
                {story}
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={speakStory}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                    speaking
                      ? "bg-indigo-500/20 text-indigo-300"
                      : "bg-white/5 text-zari-muted hover:text-zari-text"
                  }`}
                >
                  {speaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {speaking ? "Pause" : "Listen"}
                </button>
                <button
                  onClick={generateStory}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-zari-muted hover:text-zari-text transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  New Story
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
