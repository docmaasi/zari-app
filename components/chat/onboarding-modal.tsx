"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { languageList } from "@/lib/languages";
import {
  Sparkles, Heart, Zap, ArrowRight, Volume2, Brain,
  Headphones, Globe, Shield,
} from "lucide-react";
import { ZariOrb } from "./zari-orb";
import { Questionnaire } from "./questionnaire";

interface OnboardingModalProps {
  userId: Id<"users">;
  userName: string;
  onComplete: () => void;
}

const genders = [
  {
    value: "female",
    label: "Warm & Nurturing",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    border: "border-zari-pink/50",
    desc: "Empathetic, caring, emotionally intuitive",
    sample: "Hey love, how are you doing today? I've been thinking about you.",
  },
  {
    value: "neutral",
    label: "Balanced & Adaptive",
    icon: Sparkles,
    color: "from-zari-accent to-purple-500",
    border: "border-zari-accent/50",
    desc: "Thoughtful, calm, emotionally intelligent",
    sample: "Hey there. I'm glad you're here. What's on your mind?",
  },
  {
    value: "male",
    label: "Bold & Direct",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    border: "border-zari-blue/50",
    desc: "Confident, motivating, action-oriented",
    sample: "What's good? Let's get into it. What are we tackling today?",
  },
];

const TOTAL_STEPS = 5;

export function OnboardingModal({
  userId,
  userName,
  onComplete,
}: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const updatePreferences = useMutation(api.users.updatePreferences);

  const handleComplete = async () => {
    await updatePreferences({
      userId,
      gender: selectedGender || "neutral",
      language: selectedLanguage || "en",
    });
    onComplete();
  };

  const firstName = userName.split(" ")[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#06060e] overflow-hidden">
      {/* Progress dots */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              i <= step ? "bg-zari-accent w-6" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Meet Zari */}
        {step === 0 && (
          <motion.div
            key="meet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="h-full flex flex-col items-center justify-center px-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <ZariOrb emotion="idle" gender="neutral" size={140} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl font-bold text-zari-text mt-8 mb-3"
            >
              Hi {firstName}. I&apos;m Zari.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-zari-muted max-w-sm mb-4 leading-relaxed"
            >
              I&apos;m your AI companion. I think, I speak, I learn, and I
              remember everything about you. The more we talk, the better I
              know you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center gap-3 mb-10 text-xs text-zari-muted/60"
            >
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5">
                <Brain className="w-3 h-3" /> Remembers You
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5">
                <Volume2 className="w-3 h-3" /> Speaks Out Loud
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5">
                <Globe className="w-3 h-3" /> 16 Languages
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5">
                <Shield className="w-3 h-3" /> Private & Safe
              </span>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-zari-accent text-white font-semibold text-lg hover:bg-zari-accent/90 transition-all shadow-lg shadow-zari-accent/25"
            >
              Let&apos;s Get Started
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {/* Step 1: Choose Personality */}
        {step === 1 && (
          <motion.div
            key="personality"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="h-full flex flex-col items-center justify-center px-6"
          >
            <h2 className="text-2xl font-bold text-zari-text mb-2">
              Choose My Personality
            </h2>
            <p className="text-sm text-zari-muted mb-8 max-w-sm text-center">
              This changes how I talk to you. You can always change it later.
            </p>

            <div className="w-full max-w-md space-y-3 mb-8">
              {genders.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setSelectedGender(g.value)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    selectedGender === g.value
                      ? `${g.border} bg-white/5`
                      : "border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center`}
                    >
                      <g.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-zari-text">
                        {g.label}
                      </div>
                      <div className="text-xs text-zari-muted">{g.desc}</div>
                    </div>
                  </div>
                  {selectedGender === g.value && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 pl-15 text-sm text-zari-text/70 italic"
                    >
                      &ldquo;{g.sample}&rdquo;
                    </motion.div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => selectedGender && setStep(2)}
              disabled={!selectedGender}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-zari-accent text-white font-medium disabled:opacity-30 hover:bg-zari-accent/90 transition-all"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Step 2: Choose Language */}
        {step === 2 && (
          <motion.div
            key="language"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="h-full flex flex-col items-center justify-center px-6"
          >
            <h2 className="text-2xl font-bold text-zari-text mb-2">
              Choose Your Language
            </h2>
            <p className="text-sm text-zari-muted mb-8 max-w-sm text-center">
              I&apos;ll speak to you entirely in this language — with cultural
              awareness, not just translation.
            </p>

            <div className="grid grid-cols-4 gap-2 mb-8 max-w-md max-h-[320px] overflow-y-auto pr-1">
              {languageList.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                    selectedLanguage === lang.code
                      ? "border-zari-accent bg-zari-accent/10"
                      : "border-white/5 hover:border-white/10"
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-[10px] text-zari-text font-medium">
                    {lang.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl border border-white/10 text-zari-muted hover:text-zari-text transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-zari-accent text-white font-medium hover:bg-zari-accent/90 transition-all"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Private questionnaire */}
        {step === 3 && (
          <motion.div
            key="questionnaire"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="h-full flex flex-col"
          >
            <div className="text-center pt-6 px-6 mb-2">
              <h2 className="text-2xl font-bold text-zari-text mb-2">
                Help Me Know You
              </h2>
              <p className="text-sm text-zari-muted max-w-sm mx-auto">
                Answer a few quick questions so I can be a better friend from day one.
                Skip anything you want.
              </p>
            </div>
            <div className="flex-1 overflow-hidden">
              <Questionnaire
                userId={userId}
                userName={userName}
                onComplete={() => setStep(4)}
              />
            </div>
          </motion.div>
        )}

        {/* Step 4: Ready — headphone hint + launch */}
        {step === 4 && (
          <motion.div
            key="ready4"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center px-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <ZariOrb
                emotion="happy"
                gender={selectedGender || "neutral"}
                size={120}
              />
            </motion.div>

            <h2 className="text-2xl font-bold text-zari-text mt-8 mb-3">
              I&apos;m Ready, {firstName}
            </h2>
            <p className="text-zari-muted max-w-sm mb-6 leading-relaxed">
              I&apos;ll remember everything you tell me. The more we talk,
              the more I understand you. This is the start of something real.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zari-accent/10 border border-zari-accent/20 mb-8"
            >
              <Headphones className="w-4 h-4 text-zari-accent" />
              <span className="text-sm text-zari-accent-light">
                Put your headphones in for the best experience
              </span>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onClick={handleComplete}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-zari-accent text-white font-semibold text-lg hover:bg-zari-accent/90 transition-all shadow-lg shadow-zari-accent/25"
            >
              Start Talking to Zari
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
