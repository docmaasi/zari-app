"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Sparkles, ArrowRight, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { speakSmooth, stopSmooth } from "@/lib/tts-enhanced";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function TrialChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Zari introduces herself
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/guest-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: "Hi" }],
          }),
        });
        const data = await res.json();
        const greeting =
          data.reply ||
          "Hey! I'm Zari. I'm really glad you're here. What's on your mind?";
        setMessages([{ role: "assistant", content: greeting }]);
        if (voiceOn) {
          setIsSpeaking(true);
          speakSmooth(greeting, "en-US", "female", () => setIsSpeaking(false));
        }
      } catch {
        setMessages([
          {
            role: "assistant",
            content:
              "Hey there! I'm Zari, your AI companion. What's on your mind today?",
          },
        ]);
      }
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading || limitReached) return;

    setInput("");
    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);
    stopSmooth();

    try {
      const res = await fetch("/api/guest-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
        if (voiceOn) {
          setIsSpeaking(true);
          speakSmooth(data.reply, "en-US", "female", () =>
            setIsSpeaking(false)
          );
        }
      }
      if (data.limitReached) {
        setLimitReached(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Hmm, something went wrong. Want to try again?",
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#06060e] rounded-t-3xl sm:rounded-3xl border border-white/10 w-full sm:max-w-lg h-[85vh] sm:h-[600px] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br from-zari-accent via-zari-pink to-zari-blue flex items-center justify-center ${
                isSpeaking ? "animate-pulse" : ""
              }`}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zari-text font-mono tracking-wide">
                Zari
              </h3>
              <p className="text-[10px] text-zari-muted font-mono">
                {isSpeaking
                  ? "Speaking..."
                  : loading
                    ? "Thinking..."
                    : "Try a quick conversation"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setVoiceOn(!voiceOn);
                if (voiceOn) stopSmooth();
              }}
              className={`p-2 rounded-xl transition-colors ${
                voiceOn
                  ? "bg-zari-accent/20 text-zari-accent"
                  : "text-zari-muted"
              }`}
            >
              {voiceOn ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => {
                stopSmooth();
                onClose();
              }}
              className="p-2 rounded-xl text-zari-muted hover:text-zari-text"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed font-mono tracking-wide ${
                  msg.role === "user"
                    ? "bg-zari-accent/15 border border-zari-accent/20 text-zari-text"
                    : "bg-white/5 border border-white/5 text-zari-text"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/5 rounded-2xl px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-zari-accent animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sign up prompt */}
          {limitReached && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-zari-accent/15 to-zari-pink/15 border border-zari-accent/20 rounded-2xl p-5 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-zari-accent to-zari-pink flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-zari-text mb-1 font-mono">
                Let&apos;s keep growing together
              </p>
              <p className="text-xs text-zari-muted mb-4 leading-relaxed">
                I&apos;d love to remember this conversation and everything you
                share with me. Create a free account and I&apos;ll be your
                companion for the long run.
              </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zari-accent text-white text-sm font-semibold hover:bg-zari-accent/90 transition-all"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        {!limitReached && (
          <div className="px-5 pb-5 pt-2">
            <div className="flex items-center gap-2 bg-white/5 rounded-2xl border border-white/5 px-4 py-2 focus-within:border-zari-accent/50 transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Say something to Zari..."
                disabled={loading}
                className="flex-1 bg-transparent text-sm text-zari-text placeholder:text-zari-muted/50 focus:outline-none font-mono tracking-wide"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl bg-zari-accent text-white disabled:opacity-30 hover:bg-zari-accent/90 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-zari-muted/40 text-center mt-2">
              {messages.length < 4
                ? `${Math.max(0, 3 - Math.floor(messages.length / 2))} messages left in trial`
                : "Last trial message — sign up to continue"}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
