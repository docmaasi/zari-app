"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Volume2,
  VolumeX,
  Brain,
  Settings,
  Shield,
  Share2,
  Mic,
  MicOff,
} from "lucide-react";
import { getLanguage } from "@/lib/languages";
import { speakSmooth as speak, stopSmooth as stopSpeaking } from "@/lib/tts-enhanced";
import { getTheme } from "@/lib/themes";
import { MemoryPanel } from "./memory-panel";
import { SettingsPanel } from "./settings-panel";
import { MatrixRain } from "./matrix-rain";
import { ZariOrb } from "./zari-orb";
import { PwaInstallButton } from "@/components/pwa-install";
import {
  isVoiceInputSupported,
  startListening,
  stopListening,
} from "@/lib/speech-recognition";

interface ChatInterfaceProps {
  user: {
    _id: Id<"users">;
    name: string;
    gender?: string;
    language?: string;
    voiceEnabled?: boolean;
    mood?: string;
  };
}

type Status = "online" | "thinking" | "speaking" | "composing";

const thinkingPhrases: Record<string, string[]> = {
  en: ["Thinking...", "Let me consider that...", "Processing..."],
  es: ["Pensando...", "D\u00e9jame considerar...", "Procesando..."],
  fr: ["R\u00e9fl\u00e9chit...", "Laisse-moi r\u00e9fl\u00e9chir...", "Traitement..."],
  ar: ["\u064a\u0641\u0643\u0631...", "\u062f\u0639\u0646\u064a \u0623\u0641\u0643\u0631...", "\u062c\u0627\u0631\u064a \u0627\u0644\u0645\u0639\u0627\u0644\u062c\u0629..."],
  default: ["Thinking...", "Processing...", "One moment..."],
};

function getDisclosure(
  text: string
): { type: string; color: string; label: string } | null {
  const lower = text.toLowerCase();
  if (
    lower.includes("not a medical") ||
    lower.includes("healthcare provider") ||
    lower.includes("consult a doctor") ||
    lower.includes("medical professional")
  ) {
    return { type: "health", color: "bg-red-500/20 text-red-300", label: "Health Disclosure" };
  }
  if (
    lower.includes("not a financial") ||
    lower.includes("financial advisor") ||
    lower.includes("financial professional")
  ) {
    return { type: "finance", color: "bg-green-500/20 text-green-300", label: "Finance Disclosure" };
  }
  if (
    lower.includes("not a lawyer") ||
    lower.includes("legal professional") ||
    lower.includes("legal advice")
  ) {
    return { type: "legal", color: "bg-blue-500/20 text-blue-300", label: "Legal Disclosure" };
  }
  return null;
}

function getOrbEmotion(status: Status, gender: string) {
  if (status === "thinking") return "thinking" as const;
  if (status === "speaking") return gender === "female" ? "empathy" as const : "bold" as const;
  return "idle" as const;
}

export function ChatInterface({ user }: ChatInterfaceProps) {
  const lang = getLanguage(user.language || "en");
  const gender = user.gender || "neutral";

  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("online");
  const [voiceOn, setVoiceOn] = useState(user.voiceEnabled ?? true);
  const [showMemory, setShowMemory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasMic] = useState(() => isVoiceInputSupported());
  const [themeId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("zari-theme") || "matrix-purple";
    }
    return "matrix-purple";
  });
  const [localMessages, setLocalMessages] = useState<
    Array<{ role: string; content: string; id: string }>
  >([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = getTheme(themeId);

  const createConversation = useMutation(api.messages.createConversation);
  const sendMessageMutation = useMutation(api.messages.sendMessage);
  const conversation = useQuery(api.messages.getActiveConversation, {
    userId: user._id,
  });
  const messages = useQuery(
    api.messages.getRecentMessages,
    conversation ? { conversationId: conversation._id } : "skip"
  );
  const memoryCount = useQuery(api.memories.getCount, { userId: user._id });

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, localMessages, scrollToBottom]);

  const getThinkingPhrase = () => {
    const phrases = thinkingPhrases[lang.code] || thinkingPhrases.default;
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setInput("");
    stopSpeaking();

    let convId = conversation?._id;
    if (!convId) {
      convId = await createConversation({
        userId: user._id,
        title: text.slice(0, 50),
      });
    }

    await sendMessageMutation({
      conversationId: convId,
      userId: user._id,
      role: "user",
      content: text,
    });

    const tempId = `temp-${Date.now()}`;
    setLocalMessages((prev) => [
      ...prev,
      { role: "user", content: text, id: tempId },
    ]);

    setStatus("thinking");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversationId: convId }),
      });

      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't respond.";

      setLocalMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, id: `reply-${Date.now()}` },
      ]);

      if (voiceOn) {
        setStatus("speaking");
        speak(reply, user.language || "en", gender, () => setStatus("online"));
      } else {
        setStatus("online");
      }

      fetch("/api/extract-memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      }).catch(() => {});
    } catch {
      setStatus("online");
      setLocalMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again.", id: `error-${Date.now()}` },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const allMessages = [
    ...(messages || []).map((m) => ({
      role: m.role, content: m.content, id: m._id,
    })),
    ...localMessages.filter(
      (lm) => !(messages || []).some((m) => m.content === lm.content && m.role === lm.role)
    ),
  ];

  const quickActions = [
    "How are you, Zari?",
    "Help me think through something",
    "I need advice",
    "Tell me something interesting",
  ];

  const statusText =
    status === "online" ? lang.ui.online
    : status === "thinking" ? lang.ui.thinking
    : status === "speaking" ? lang.ui.speaking
    : lang.ui.composing;

  const orbEmotion = getOrbEmotion(status, gender);

  return (
    <div className={`h-screen flex flex-col relative overflow-hidden ${theme.bgClass} ${theme.fontClass}`}>
      {/* Matrix Rain Background */}
      <MatrixRain
        color={theme.matrixColor}
        opacity={theme.matrixOpacity}
        speed={theme.matrixSpeed}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <ZariOrb emotion={orbEmotion} gender={gender} size={40} />
          <div>
            <h1 className="text-sm font-semibold text-zari-text tracking-wide">
              Zari
            </h1>
            <p className="text-xs text-zari-muted font-light tracking-wider">
              {statusText}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { if (voiceOn) stopSpeaking(); setVoiceOn(!voiceOn); }}
            className={`p-2 rounded-xl transition-colors ${
              voiceOn ? "bg-zari-accent/20 text-zari-accent" : "text-zari-muted hover:text-zari-text"
            }`}
          >
            {voiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowMemory(true)}
            className="relative p-2 rounded-xl text-zari-muted hover:text-zari-text transition-colors"
          >
            <Brain className="w-4 h-4" />
            {memoryCount && memoryCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zari-accent text-[10px] text-white flex items-center justify-center font-sans">
                {memoryCount > 99 ? "99+" : memoryCount}
              </span>
            )}
          </button>
          <PwaInstallButton variant="header" />
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "Zari", text: "Meet Zari, your AI companion.", url: "https://www.zari.help" });
              } else {
                navigator.clipboard.writeText("https://www.zari.help");
              }
            }}
            className="p-2 rounded-xl text-zari-muted hover:text-zari-text transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-xl text-zari-muted hover:text-zari-text transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
                userButtonPopoverCard: "bg-zari-surface border border-white/10",
                userButtonPopoverActionButton: "text-zari-text hover:bg-white/5",
                userButtonPopoverActionButtonText: "text-zari-text",
                userButtonPopoverFooter: "hidden",
              },
            }}
            showName={false}
            afterSignOutUrl="/"
          />
        </div>
      </header>

      {/* Chat area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {allMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ZariOrb emotion="idle" gender={gender} size={96} />
            <h2 className="text-xl font-semibold text-zari-text mb-2 mt-6 tracking-wide">
              {lang.ui.talkTo}
            </h2>
            <p className="text-sm text-zari-muted mb-8 tracking-wider font-light">
              {lang.ui.howFeeling}
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => { setInput(action); inputRef.current?.focus(); }}
                  className="px-4 py-2 rounded-xl bg-black/30 border border-white/5 text-sm text-zari-muted hover:text-zari-text hover:border-zari-accent/30 transition-all backdrop-blur-sm"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {allMessages.map((msg) => (
          <motion.div
            key={String(msg.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 backdrop-blur-sm ${
                msg.role === "user"
                  ? "bg-zari-accent/15 border border-zari-accent/20 text-zari-text"
                  : "bg-black/30 border border-white/5 text-zari-text"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap tracking-wide">
                {msg.content}
              </p>
              {msg.role === "assistant" && (() => {
                const disclosure = getDisclosure(msg.content);
                if (!disclosure) return null;
                return (
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-sans ${disclosure.color}`}>
                      <Shield className="w-3 h-3" />
                      {disclosure.label}
                    </span>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        ))}

        {status === "thinking" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-black/30 border border-white/5 rounded-2xl px-4 py-3 backdrop-blur-sm flex items-center gap-3">
              <ZariOrb emotion="thinking" gender={gender} size={28} />
              <span className="text-xs text-zari-muted tracking-wider">
                {getThinkingPhrase()}
              </span>
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Centered orb when speaking */}
      {status === "speaking" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        >
          <div className="opacity-30">
            <ZariOrb emotion="speaking" gender={gender} size={200} />
          </div>
        </motion.div>
      )}

      {/* Input */}
      <div className="relative z-10 px-4 pb-4 pt-2">
        {/* Listening indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-center gap-2 mb-2 py-2"
            >
              <div className="flex gap-1 items-end">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-red-400 rounded-full animate-wave"
                    style={{ height: "16px", animationDelay: `${i * 0.12}s` }}
                  />
                ))}
              </div>
              <span className="text-xs text-red-400 tracking-wider">
                Listening...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 bg-black/40 rounded-2xl border border-white/5 px-4 py-2 focus-within:border-zari-accent/50 transition-colors backdrop-blur-xl">
          {/* Mic button */}
          {hasMic && (
            <button
              onClick={() => {
                if (isListening) {
                  stopListening();
                  setIsListening(false);
                } else {
                  setIsListening(true);
                  startListening(
                    lang.ttsLang,
                    (text, isFinal) => {
                      setInput(text);
                      if (isFinal) setIsListening(false);
                    },
                    () => setIsListening(false),
                    () => setIsListening(false)
                  );
                }
              }}
              disabled={status === "thinking"}
              className={`p-2 rounded-xl transition-colors ${
                isListening
                  ? "bg-red-500/20 text-red-400 animate-pulse"
                  : "text-zari-muted hover:text-zari-text"
              }`}
              title={isListening ? "Stop listening" : "Speak to Zari"}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          )}

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasMic ? "Type or tap mic to speak..." : lang.ui.howFeeling}
            className="flex-1 bg-transparent text-sm text-zari-text placeholder:text-zari-muted/50 focus:outline-none tracking-wide"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || status === "thinking"}
            className="p-2 rounded-xl bg-zari-accent text-white disabled:opacity-30 hover:bg-zari-accent/90 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Panels */}
      <AnimatePresence>
        {showMemory && (
          <MemoryPanel userId={user._id} onClose={() => setShowMemory(false)} />
        )}
        {showSettings && (
          <SettingsPanel
            userId={user._id}
            currentName={user.name}
            currentGender={gender}
            currentLanguage={user.language || "en"}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
