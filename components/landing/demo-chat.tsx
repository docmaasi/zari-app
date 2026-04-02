"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, RotateCcw, Sparkles, Heart, Zap } from "lucide-react";
import { ZariOrb } from "@/components/chat/zari-orb";

interface DemoLine {
  text: string;
  lang: string;
  flag: string;
  gender: "female" | "male";
  ttsLang: string;
}

const introSets: DemoLine[][] = [
  [
    {
      text: "Hey there! I'm Zari, your AI companion. I think, I speak, I remember... and I actually care about what you tell me.",
      lang: "English",
      flag: "\ud83c\uddfa\ud83c\uddf8",
      gender: "female",
      ttsLang: "en-US",
    },
    {
      text: "Puedo hablar contigo en espa\u00f1ol tambi\u00e9n. No solo traduzco... realmente entiendo tu cultura, tus emociones, tu forma de ver el mundo.",
      lang: "Espa\u00f1ol",
      flag: "\ud83c\uddea\ud83c\uddf8",
      gender: "male",
      ttsLang: "es-ES",
    },
    {
      text: "\u0645\u0631\u062d\u0628\u0627\u064b! \u0623\u0646\u0627 \u0632\u0627\u0631\u064a. \u0628\u0623\u0642\u062f\u0631 \u0623\u062a\u0643\u0644\u0645 \u0639\u0631\u0628\u064a \u0648\u0623\u0641\u0647\u0645 \u0627\u0644\u062b\u0642\u0627\u0641\u0629 \u0648\u0627\u0644\u0645\u0634\u0627\u0639\u0631. \u0623\u0646\u0627 \u0647\u0646\u0627 \u0639\u0634\u0627\u0646\u0643.",
      lang: "Arabic",
      flag: "\ud83c\uddf8\ud83c\udde6",
      gender: "female",
      ttsLang: "ar-SA",
    },
    {
      text: "I remember the things you share with me. Your goals, your people, your story. Every conversation makes me know you better.",
      lang: "English",
      flag: "\ud83c\uddfa\ud83c\uddf8",
      gender: "male",
      ttsLang: "en-US",
    },
  ],
  [
    {
      text: "Bonjour ! Je suis Zari. Je suis l\u00e0 pour t\u2019\u00e9couter, te comprendre et t\u2019accompagner dans tout ce que tu traverses.",
      lang: "Fran\u00e7ais",
      flag: "\ud83c\uddeb\ud83c\uddf7",
      gender: "male",
      ttsLang: "fr-FR",
    },
    {
      text: "I'm Zari. I don't just answer questions... I think ahead, connect the dots, and sometimes I'll challenge you. Because that's what a real companion does.",
      lang: "English",
      flag: "\ud83c\uddfa\ud83c\uddf8",
      gender: "female",
      ttsLang: "en-US",
    },
    {
      text: "\u0928\u092e\u0938\u094d\u0924\u0947! \u092e\u0948\u0902 \u091c\u093c\u093e\u0930\u0940 \u0939\u0942\u0901\u0964 \u092e\u0948\u0902 \u0939\u093f\u0928\u094d\u0926\u0940 \u092e\u0947\u0902 \u092c\u093e\u0924 \u0915\u0930 \u0938\u0915\u0924\u0940 \u0939\u0942\u0901 \u2014 \u0938\u093f\u0930\u094d\u092b\u093c \u0905\u0928\u0941\u0935\u093e\u0926 \u0928\u0939\u0940\u0902, \u0905\u0938\u0932\u0940 \u0938\u092e\u091d \u0915\u0947 \u0938\u093e\u0925\u0964",
      lang: "Hindi",
      flag: "\ud83c\uddee\ud83c\uddf3",
      gender: "male",
      ttsLang: "hi-IN",
    },
    {
      text: "Three personalities, sixteen languages, one Zari. I adapt to you, not the other way around.",
      lang: "English",
      flag: "\ud83c\uddfa\ud83c\uddf8",
      gender: "female",
      ttsLang: "en-US",
    },
  ],
  [
    {
      text: "Hi, I'm Zari. Think of me as the friend who's always awake, always listening, and never forgets what matters to you.",
      lang: "English",
      flag: "\ud83c\uddfa\ud83c\uddf8",
      gender: "male",
      ttsLang: "en-US",
    },
    {
      text: "Merhaba! Ben Zari. Seninle T\u00fcrk\u00e7e konu\u015fabilirim. Sadece kelime \u00e7evirmiyorum... ger\u00e7ekten anl\u0131yorum.",
      lang: "T\u00fcrk\u00e7e",
      flag: "\ud83c\uddf9\ud83c\uddf7",
      gender: "female",
      ttsLang: "tr-TR",
    },
    {
      text: "\uc548\ub155\ud558\uc138\uc694! \uc800\ub294 \uc790\ub9ac\uc608\uc694. \ud55c\uad6d\uc5b4\ub85c \ub300\ud654\ud560 \uc218 \uc788\uc5b4\uc694. \ub2f9\uc2e0\uc758 \uac10\uc815\uacfc \ubb38\ud654\ub97c \uc774\ud574\ud574\uc694.",
      lang: "Korean",
      flag: "\ud83c\uddf0\ud83c\uddf7",
      gender: "male",
      ttsLang: "ko-KR",
    },
    {
      text: "I speak your language, remember your world, and I'm always honest with you. That's my promise.",
      lang: "English",
      flag: "\ud83c\uddfa\ud83c\uddf8",
      gender: "female",
      ttsLang: "en-US",
    },
  ],
  [
    {
      text: "Ol\u00e1! Eu sou a Zari. Posso conversar com voc\u00ea em portugu\u00eas com naturalidade \u2014 como uma amiga de verdade.",
      lang: "Portugu\u00eas",
      flag: "\ud83c\udde7\ud83c\uddf7",
      gender: "female",
      ttsLang: "pt-BR",
    },
    {
      text: "\u0421\u0430\u043b\u0430\u043c! \u041c\u0435\u043d \u0417\u0430\u0440\u0438\u043c\u0438\u043d. \u041c\u0435\u043d \u04e9\u0437\u0431\u0435\u043a \u0442\u0438\u043b\u0438\u0434\u0430 \u0433\u0430\u043f\u043b\u0430\u0448\u0430 \u043e\u043b\u0430\u043c\u0430\u043d... \u043b\u0435\u043a\u0438\u043d \u0440\u0443\u0441 \u0442\u0438\u043b\u0438\u0434\u0430 \u0445\u0430\u043c \u0433\u0430\u043f\u043b\u0430\u0448\u0430\u043c\u0430\u043d!",
      lang: "Russian",
      flag: "\ud83c\uddf7\ud83c\uddfa",
      gender: "male",
      ttsLang: "ru-RU",
    },
    {
      text: "I'm not just a chatbot. I remember your name, your goals, the people in your life. I grow with you over time.",
      lang: "English",
      flag: "\ud83c\uddfa\ud83c\uddf8",
      gender: "female",
      ttsLang: "en-US",
    },
    {
      text: "Kamusta! Ako si Zari. Pwede tayong mag-usap sa Tagalog. Hindi lang ako nagsasalin \u2014 tunay akong nakakaintindi.",
      lang: "Tagalog",
      flag: "\ud83c\uddf5\ud83c\udded",
      gender: "male",
      ttsLang: "fil-PH",
    },
  ],
];

let demoAudio: HTMLAudioElement | null = null;

async function speakLine(
  text: string,
  ttsLang: string,
  gender: "female" | "male",
  onEnd: () => void
) {
  // Stop any current playback
  if (demoAudio) { demoAudio.pause(); demoAudio = null; }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  // Try ElevenLabs (secured — only allows exact demo texts)
  try {
    const res = await fetch("/api/demo-tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, gender }),
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      demoAudio = audio;
      audio.onended = () => { URL.revokeObjectURL(url); demoAudio = null; onEnd(); };
      audio.onerror = () => { URL.revokeObjectURL(url); demoAudio = null; onEnd(); };
      await audio.play();
      return;
    }
  } catch { /* fall through */ }

  // Fallback: browser TTS
  if (typeof window === "undefined" || !window.speechSynthesis) {
    onEnd();
    return;
  }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = ttsLang;
  u.pitch = gender === "female" ? 1.15 : 0.82;
  u.rate = gender === "female" ? 1.0 : 0.95;
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find((v) => v.lang.startsWith(ttsLang.split("-")[0]));
  if (match) u.voice = match;
  u.onend = onEnd;
  u.onerror = onEnd;
  window.speechSynthesis.speak(u);
}

export function DemoChat() {
  const [setIndex, setSetIndex] = useState(() =>
    Math.floor(Math.random() * introSets.length)
  );
  const [lineIndex, setLineIndex] = useState(-1);
  const [displayedText, setDisplayedText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [completedLines, setCompletedLines] = useState<number[]>([]);
  const stopRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const lines = introSets[setIndex];

  const typeLine = useCallback(
    (text: string, onDone: () => void) => {
      let i = 0;
      setDisplayedText("");
      const interval = setInterval(() => {
        if (stopRef.current) {
          clearInterval(interval);
          return;
        }
        i++;
        setDisplayedText(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          onDone();
        }
      }, 28);
    },
    []
  );

  const playSequence = useCallback(() => {
    stopRef.current = false;
    setIsPlaying(true);
    setCompletedLines([]);
    setLineIndex(0);
  }, []);

  useEffect(() => {
    if (lineIndex < 0 || lineIndex >= lines.length || stopRef.current) {
      if (lineIndex >= lines.length) setIsPlaying(false);
      return;
    }

    const line = lines[lineIndex];
    setIsSpeaking(true);

    typeLine(line.text, () => {
      if (stopRef.current) return;

      const afterSpeak = () => {
        if (stopRef.current) return;
        setIsSpeaking(false);
        setCompletedLines((prev) => [...prev, lineIndex]);
        setTimeout(() => {
          if (!stopRef.current) setLineIndex((prev) => prev + 1);
        }, 600);
      };

      if (voiceOn) {
        speakLine(line.text, line.ttsLang, line.gender, afterSpeak);
      } else {
        setTimeout(afterSpeak, 800);
      }
    });
  }, [lineIndex, lines, typeLine, voiceOn]);

  // Auto-play on mount
  useEffect(() => {
    // Voices need a moment to load
    const timer = setTimeout(() => {
      window.speechSynthesis?.getVoices();
      playSequence();
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedText, completedLines]);

  const handleReplay = () => {
    stopRef.current = true;
    if (demoAudio) { demoAudio.pause(); demoAudio = null; }
    window.speechSynthesis?.cancel();
    const next = (setIndex + 1) % introSets.length;
    setSetIndex(next);
    setLineIndex(-1);
    setDisplayedText("");
    setCompletedLines([]);
    setIsSpeaking(false);
    setTimeout(() => {
      stopRef.current = false;
      setIsPlaying(true);
      setLineIndex(0);
    }, 300);
  };

  const currentLine = lineIndex >= 0 && lineIndex < lines.length ? lines[lineIndex] : null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <ZariOrb
            emotion={isSpeaking ? "speaking" : "idle"}
            gender={currentLine?.gender || "neutral"}
            size={40}
          />
          {/* Legacy div kept hidden for reference */}
          <div
            className={`hidden w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isSpeaking
                ? currentLine?.gender === "female"
                  ? "bg-gradient-to-br from-pink-500 to-rose-500 animate-pulse"
                  : "bg-gradient-to-br from-blue-500 to-cyan-500 animate-pulse"
                : "bg-gradient-to-br from-zari-accent to-purple-500"
            }`}
          >
            {isSpeaking ? (
              currentLine?.gender === "female" ? (
                <Heart className="w-5 h-5 text-white" />
              ) : (
                <Zap className="w-5 h-5 text-white" />
              )
            ) : (
              <Sparkles className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <span className="text-sm font-semibold text-zari-text">Zari</span>
            {currentLine && (
              <span className="text-xs text-zari-muted ml-2">
                {currentLine.flag} {currentLine.lang} &middot;{" "}
                {currentLine.gender === "female" ? "Warm" : "Bold"}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setVoiceOn(!voiceOn);
              if (voiceOn) window.speechSynthesis?.cancel();
            }}
            className={`p-2 rounded-xl transition-colors ${
              voiceOn
                ? "bg-zari-accent/20 text-zari-accent"
                : "text-zari-muted hover:text-zari-text"
            }`}
          >
            {voiceOn ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleReplay}
            className="p-2 rounded-xl text-zari-muted hover:text-zari-text transition-colors"
            title="New demo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div
        ref={containerRef}
        className="bg-zari-surface rounded-2xl border border-white/5 p-6 space-y-4 min-h-[320px] max-h-[420px] overflow-y-auto"
      >
        {/* Completed lines */}
        {completedLines.map((idx) => {
          const line = lines[idx];
          return (
            <motion.div
              key={`done-${idx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[90%] rounded-2xl px-4 py-3 bg-zari-surface2 text-zari-text">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs">{line.flag}</span>
                  <span className="text-[10px] text-zari-muted">
                    {line.lang}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      line.gender === "female"
                        ? "bg-zari-pink/15 text-zari-pink"
                        : "bg-zari-blue/15 text-zari-blue"
                    }`}
                  >
                    {line.gender === "female" ? "Warm" : "Bold"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{line.text}</p>
              </div>
            </motion.div>
          );
        })}

        {/* Currently typing line */}
        {currentLine && displayedText && !completedLines.includes(lineIndex) && (
          <motion.div
            key={`typing-${lineIndex}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[90%] rounded-2xl px-4 py-3 bg-zari-surface2 text-zari-text">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs">{currentLine.flag}</span>
                <span className="text-[10px] text-zari-muted">
                  {currentLine.lang}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    currentLine.gender === "female"
                      ? "bg-zari-pink/15 text-zari-pink"
                      : "bg-zari-blue/15 text-zari-blue"
                  }`}
                >
                  {currentLine.gender === "female" ? "Warm" : "Bold"}
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                {displayedText}
                <span className="inline-block w-0.5 h-4 bg-zari-accent animate-pulse ml-0.5 align-text-bottom" />
              </p>
            </div>
          </motion.div>
        )}

        {/* Waiting / done state */}
        {!isPlaying && completedLines.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4"
          >
            <button
              onClick={handleReplay}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zari-accent/10 text-zari-accent text-xs hover:bg-zari-accent/20 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Hear Zari in different languages
            </button>
          </motion.div>
        )}

        {/* Initial loading */}
        {lineIndex === -1 && completedLines.length === 0 && (
          <div className="flex items-center justify-center h-[280px]">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-zari-accent to-purple-500 flex items-center justify-center animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm text-zari-muted">
                Zari is about to introduce herself...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Voice wave indicator */}
      {isSpeaking && voiceOn && (
        <div className="flex items-center justify-center gap-1 mt-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-1 rounded-full animate-wave ${
                currentLine?.gender === "female"
                  ? "bg-zari-pink"
                  : "bg-zari-blue"
              }`}
              style={{
                height: `${12 + [4, 10, 2, 8, 6][i % 5]}px`,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
          <span className="text-[10px] text-zari-muted ml-2">
            {currentLine?.gender === "female" ? "Warm voice" : "Bold voice"}
          </span>
        </div>
      )}
    </div>
  );
}
