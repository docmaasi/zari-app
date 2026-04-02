"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  ArrowRight,
  ArrowLeft,
  Lock,
  Heart,
  Briefcase,
  Home,
  Users,
  Sparkles,
  SkipForward,
} from "lucide-react";

interface QuestionnaireProps {
  userId: Id<"users">;
  userName: string;
  onComplete: () => void;
  isRedo?: boolean;
}

interface Question {
  id: string;
  icon: typeof Heart;
  question: string;
  subtext: string;
  type: "select" | "text" | "multi";
  options?: string[];
  category: string;
  factPrefix: string;
}

const questions: Question[] = [
  {
    id: "relationship",
    icon: Heart,
    question: "What's your relationship status?",
    subtext: "This helps Zari understand your personal life",
    type: "select",
    options: [
      "Single",
      "In a relationship",
      "Married",
      "Divorced",
      "Separated",
      "Widowed",
      "It's complicated",
      "Prefer not to say",
    ],
    category: "personal",
    factPrefix: "Relationship status:",
  },
  {
    id: "kids",
    icon: Users,
    question: "Do you have kids?",
    subtext: "Zari can remember your family",
    type: "select",
    options: [
      "No kids",
      "Yes, 1 child",
      "Yes, 2 children",
      "Yes, 3+ children",
      "Expecting",
      "Prefer not to say",
    ],
    category: "relationships",
    factPrefix: "Children:",
  },
  {
    id: "living",
    icon: Home,
    question: "Who do you live with?",
    subtext: "Helps Zari understand your daily life",
    type: "select",
    options: [
      "I live alone",
      "With a partner/spouse",
      "With family",
      "With roommates",
      "With my kids",
      "Other",
      "Prefer not to say",
    ],
    category: "personal",
    factPrefix: "Living situation:",
  },
  {
    id: "work",
    icon: Briefcase,
    question: "What's your work situation?",
    subtext: "So Zari can relate to your day-to-day",
    type: "select",
    options: [
      "Employed full-time",
      "Employed part-time",
      "Self-employed / Freelance",
      "Business owner",
      "Student",
      "Stay-at-home parent",
      "Retired",
      "Between jobs",
      "Prefer not to say",
    ],
    category: "personal",
    factPrefix: "Work situation:",
  },
  {
    id: "work_detail",
    icon: Briefcase,
    question: "What do you do? (optional)",
    subtext: "A few words about your work, studies, or main focus",
    type: "text",
    category: "personal",
    factPrefix: "Occupation/focus:",
  },
  {
    id: "needs",
    icon: Sparkles,
    question: "What do you need most right now?",
    subtext: "Pick as many as you want",
    type: "multi",
    options: [
      "Someone to listen",
      "Motivation & push",
      "Help thinking through things",
      "Stress relief",
      "Fun conversation",
      "Accountability",
      "Emotional support",
      "Life advice",
    ],
    category: "preferences",
    factPrefix: "What they need from Zari:",
  },
  {
    id: "struggle",
    icon: Heart,
    question: "What's weighing on you lately? (optional)",
    subtext: "Share as much or as little as you want. This stays between you and Zari.",
    type: "text",
    category: "personal",
    factPrefix: "Currently on their mind:",
  },
  {
    id: "wish",
    icon: Sparkles,
    question: "What's one thing you wish someone understood about you?",
    subtext: "This helps Zari know you deeper. Totally optional.",
    type: "text",
    category: "personal",
    factPrefix: "Wishes people understood:",
  },
];

const TOTAL_Q = questions.length;

export function Questionnaire({
  userId,
  userName,
  onComplete,
  isRedo,
}: QuestionnaireProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [saving, setSaving] = useState(false);
  const addMemory = useMutation(api.memories.addMemory);

  const q = questions[currentQ];
  const answer = answers[q.id];
  const isOptional = q.question.includes("optional");

  function setAnswer(value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  }

  function toggleMulti(value: string) {
    const current = (answers[q.id] as string[]) || [];
    if (current.includes(value)) {
      setAnswer(current.filter((v) => v !== value));
    } else {
      setAnswer([...current, value]);
    }
  }

  function canProceed(): boolean {
    if (isOptional) return true;
    if (!answer) return false;
    if (typeof answer === "string") return answer.trim().length > 0;
    return answer.length > 0;
  }

  async function handleFinish() {
    setSaving(true);

    // If redo, we could clear old questionnaire memories
    // but it's safer to just add new ones (duplicates are handled)

    for (const question of questions) {
      const ans = answers[question.id];
      if (!ans) continue;

      const answerText = Array.isArray(ans) ? ans.join(", ") : ans;
      if (
        !answerText.trim() ||
        answerText === "Prefer not to say"
      ) {
        continue;
      }

      await addMemory({
        userId,
        category: question.category,
        fact: `${question.factPrefix} ${answerText}`,
        people: [],
      });
    }

    setSaving(false);
    onComplete();
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs text-zari-muted">
            <Lock className="w-3 h-3" />
            <span>Private — only Zari sees this</span>
          </div>
          <span className="text-xs text-zari-muted">
            {currentQ + 1} of {TOTAL_Q}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full bg-white/5">
          <motion.div
            className="h-full rounded-full bg-zari-accent"
            animate={{ width: `${((currentQ + 1) / TOTAL_Q) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="py-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-zari-accent/10 flex items-center justify-center">
                <q.icon className="w-5 h-5 text-zari-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zari-text">
                  {q.question}
                </h3>
              </div>
            </div>
            <p className="text-xs text-zari-muted mb-6 ml-13">
              {q.subtext}
            </p>

            {/* Select options */}
            {q.type === "select" && (
              <div className="space-y-2">
                {q.options!.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswer(opt)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ${
                      answer === opt
                        ? "border-zari-accent bg-zari-accent/10 text-zari-text"
                        : "border-white/5 text-zari-muted hover:border-white/10 hover:text-zari-text"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Multi-select */}
            {q.type === "multi" && (
              <div className="flex flex-wrap gap-2">
                {q.options!.map((opt) => {
                  const selected = ((answer as string[]) || []).includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleMulti(opt)}
                      className={`px-4 py-2 rounded-xl border transition-all text-sm ${
                        selected
                          ? "border-zari-accent bg-zari-accent/10 text-zari-text"
                          : "border-white/5 text-zari-muted hover:border-white/10"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Text input */}
            {q.type === "text" && (
              <textarea
                value={(answer as string) || ""}
                onChange={(e) => setAnswer(e.target.value)}
                rows={3}
                placeholder="Type here..."
                className="w-full px-4 py-3 rounded-xl bg-zari-surface2 border border-white/5 text-sm text-zari-text placeholder:text-zari-muted/40 focus:outline-none focus:border-zari-accent transition-colors resize-none"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-6 pt-2 flex items-center gap-3">
        {currentQ > 0 && (
          <button
            onClick={() => setCurrentQ((c) => c - 1)}
            className="flex items-center gap-1 px-4 py-3 rounded-xl border border-white/10 text-zari-muted hover:text-zari-text transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {isOptional && !answer && (
          <button
            onClick={() => {
              if (currentQ < TOTAL_Q - 1) {
                setCurrentQ((c) => c + 1);
              } else {
                handleFinish();
              }
            }}
            className="flex items-center gap-1 px-4 py-3 text-zari-muted hover:text-zari-text transition-colors text-sm"
          >
            <SkipForward className="w-4 h-4" />
            Skip
          </button>
        )}

        <div className="flex-1" />

        {currentQ < TOTAL_Q - 1 ? (
          <button
            onClick={() => setCurrentQ((c) => c + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zari-accent text-white font-medium text-sm disabled:opacity-30 hover:bg-zari-accent/90 transition-all"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={saving || (!canProceed() && !isOptional)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zari-accent text-white font-medium text-sm disabled:opacity-30 hover:bg-zari-accent/90 transition-all"
          >
            {saving ? "Saving..." : isRedo ? "Save & Close" : "Finish"}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
