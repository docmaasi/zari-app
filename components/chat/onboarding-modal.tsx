"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { languageList } from "@/lib/languages";
import { Sparkles, Heart, Shield, Zap } from "lucide-react";

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
    border: "border-zari-pink",
    desc: "Empathetic, caring, emotionally intuitive",
  },
  {
    value: "neutral",
    label: "Balanced & Adaptive",
    icon: Sparkles,
    color: "from-zari-accent to-purple-500",
    border: "border-zari-accent",
    desc: "Thoughtful, calm, emotionally intelligent",
  },
  {
    value: "male",
    label: "Bold & Direct",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    border: "border-zari-blue",
    desc: "Confident, motivating, action-oriented",
  },
];

export function OnboardingModal({
  userId,
  userName,
  onComplete,
}: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const updatePreferences = useMutation(api.users.updatePreferences);

  const handleComplete = async () => {
    await updatePreferences({
      userId,
      gender: selectedGender,
      language: selectedLanguage,
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zari-surface rounded-3xl border border-white/10 p-8 max-w-lg w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-zari-accent to-zari-pink flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-zari-text">
            Welcome, {userName}!
          </h2>
          <p className="text-zari-muted mt-2">
            {step === 1
              ? "Choose Zari's personality style"
              : "Choose your language"}
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <div
              className={`w-2 h-2 rounded-full ${step >= 1 ? "bg-zari-accent" : "bg-zari-surface2"}`}
            />
            <div
              className={`w-2 h-2 rounded-full ${step >= 2 ? "bg-zari-accent" : "bg-zari-surface2"}`}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {genders.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setSelectedGender(g.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    selectedGender === g.value
                      ? `${g.border} bg-white/5`
                      : "border-white/5 hover:border-white/10"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center`}
                  >
                    <g.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-zari-text">{g.label}</div>
                    <div className="text-xs text-zari-muted">{g.desc}</div>
                  </div>
                </button>
              ))}
              <button
                onClick={() => selectedGender && setStep(2)}
                disabled={!selectedGender}
                className="w-full mt-4 py-3 rounded-xl bg-zari-accent text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zari-accent/90 transition-colors"
              >
                Next
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="grid grid-cols-4 gap-2 mb-6 max-h-[300px] overflow-y-auto pr-1">
                {languageList.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                      selectedLanguage === lang.code
                        ? "border-zari-accent bg-zari-accent/10"
                        : "border-white/5 hover:border-white/10"
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-[10px] text-zari-text font-medium">
                      {lang.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-zari-muted hover:text-zari-text transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!selectedLanguage}
                  className="flex-1 py-3 rounded-xl bg-zari-accent text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zari-accent/90 transition-colors"
                >
                  Start Chatting
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
