"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, X, Volume2 } from "lucide-react";

interface AmbientSoundsProps {
  show: boolean;
  onClose: () => void;
}

const sounds = [
  { id: "rain", label: "Rain", emoji: "\u{1F327}\uFE0F", url: "https://cdn.freesound.org/previews/531/531947_6142149-lq.mp3" },
  { id: "ocean", label: "Ocean", emoji: "\u{1F30A}", url: "https://cdn.freesound.org/previews/467/467005_5765668-lq.mp3" },
  { id: "fire", label: "Fireplace", emoji: "\u{1F525}", url: "https://cdn.freesound.org/previews/532/532024_2587400-lq.mp3" },
  { id: "forest", label: "Forest", emoji: "\u{1F333}", url: "https://cdn.freesound.org/previews/462/462087_5765668-lq.mp3" },
  { id: "night", label: "Night", emoji: "\u{1F31B}", url: "https://cdn.freesound.org/previews/380/380200_7094732-lq.mp3" },
  { id: "cafe", label: "Cafe", emoji: "\u{2615}", url: "https://cdn.freesound.org/previews/468/468823_6142149-lq.mp3" },
];

export function AmbientSounds({ show, onClose }: AmbientSoundsProps) {
  const [playing, setPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  function toggleSound(id: string, url: string) {
    if (playing === id) {
      audioRef.current?.pause();
      audioRef.current = null;
      setPlaying(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = volume;
    audio.play().catch(() => {});
    audioRef.current = audio;
    setPlaying(id);
  }

  function handleVolume(v: number) {
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-20 left-4 right-4 z-30 max-w-sm mx-auto"
        >
          <div className="p-4 rounded-2xl bg-zari-surface border border-white/10 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-zari-accent" />
                <span className="text-sm font-medium text-zari-text">
                  Ambient Sounds
                </span>
              </div>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current = null;
                  }
                  setPlaying(null);
                  onClose();
                }}
                className="p-1 rounded-lg text-zari-muted/40 hover:text-zari-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {sounds.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleSound(s.id, s.url)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                    playing === s.id
                      ? "bg-zari-accent/20 border border-zari-accent/40"
                      : "bg-black/20 border border-white/5 hover:border-white/10"
                  }`}
                >
                  <span className="text-lg">{s.emoji}</span>
                  <span className="text-[10px] text-zari-muted">
                    {s.label}
                  </span>
                </button>
              ))}
            </div>

            {playing && (
              <div className="flex items-center gap-2">
                <Volume2 className="w-3 h-3 text-zari-muted" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-zari-accent h-1"
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
