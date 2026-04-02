"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Volume2,
  Database,
  Globe,
  Shield,
  Lock,
  X,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Thinks Autonomously",
    description:
      "Zari anticipates your needs, connects dots across conversations, and proactively offers insights without being asked.",
    detail:
      "Zari doesn't wait for you to ask the right question. She actively thinks about what you might need next based on everything you've shared. If you mention a job interview on Friday, she'll check in about it. If you talk about stress at work and later mention headaches, she connects the dots. She offers suggestions before you realize you need them, brings up relevant ideas mid-conversation, and challenges you when she thinks you're selling yourself short. Zari has seven built-in autonomous behaviors: thinking ahead, connecting information across conversations, offering proactive suggestions, sharing relevant knowledge, being honestly direct, asking smart follow-up questions, and celebrating your wins. She's not reactive — she's a thinking companion who grows sharper the more you talk to her.",
  },
  {
    icon: Volume2,
    title: "Speaks Out Loud",
    description:
      "Built-in text-to-speech with gender-tuned voices. Zari talks to you naturally in your chosen language.",
    detail:
      "Zari uses your device's built-in speech engine to talk to you out loud in real time. When she responds, you'll see her message appear and hear her voice at the same time — just like talking to a real person. The voice adapts to the personality you choose: the Warm mode has a slightly higher pitch with a natural, caring cadence. The Bold mode drops the pitch and speaks with confident, direct energy. The Balanced mode sits right in the middle. The voice also matches your language — if you're chatting in Spanish, Zari speaks Spanish. If you switch to Arabic, the voice follows. You can toggle voice on or off anytime with one tap. It's perfect for hands-free moments: cooking, driving, walking, or just when you want the experience of being heard by someone who actually talks back.",
  },
  {
    icon: Database,
    title: "Remembers Everything",
    description:
      "Names, dates, preferences, events — Zari builds a memory of who you are and what matters to you.",
    detail:
      "Every time you talk to Zari, she quietly listens for facts worth remembering — and saves them automatically. She picks up on names of people in your life, events you mention, goals you're working toward, personal preferences, and relationship dynamics. Each memory is tagged with the date, time, day of week, and any people involved, so she can reference them naturally later. Tell her about your sister's wedding next month, and she'll remember it — and the people involved. Mention you're trying to quit caffeine, and weeks later she'll still know. You can open the Memory Panel anytime to see everything Zari has learned about you, organized by category. You can delete individual memories or clear them all. It's your data, and you're always in control. The more you share, the more personal and meaningful your conversations become.",
  },
  {
    icon: Globe,
    title: "16 Languages",
    description:
      "From English to Urdu, Tagalog to Swahili. Zari speaks your language fluently, not just translates.",
    detail:
      "Zari supports sixteen languages: English, Spanish, French, Arabic, Hindi, Urdu, Chinese, Portuguese, German, Japanese, Korean, Turkish, Russian, Italian, Swahili, and Tagalog. But she doesn't just translate her responses — she thinks and responds natively in your chosen language. The entire interface adapts: status indicators, placeholder text, thinking phrases, and quick actions all appear in your language. When voice is enabled, Zari selects the best available voice for that language on your device and adjusts pronunciation accordingly. You pick your language during onboarding or change it anytime in settings. Zari's system prompt explicitly instructs the AI to respond entirely in your language with cultural awareness — not awkward translation, but natural fluency. Whether you're a native speaker or learning, Zari meets you where you are and communicates the way you actually talk.",
  },
  {
    icon: Shield,
    title: "Responsible Disclosures",
    description:
      "When discussing health, finance, or legal topics, Zari always flags that professional advice should be sought.",
    detail:
      "Zari is built to be genuinely helpful, but she knows her limits. Whenever a conversation touches on health, finance, or legal matters, Zari automatically includes a responsible disclosure — a small colored badge at the bottom of her message reminding you to seek professional advice. Health disclosures appear in red, finance in green, and legal in blue. This isn't a generic disclaimer slapped on everything — Zari's system detects specific trigger phrases in her own responses and only shows disclosures when they're truly relevant. She'll still give you thoughtful, practical guidance — like suggesting hydration for headaches or encouraging you to start a budget — but she always makes clear she's not a doctor, financial advisor, or lawyer. This is how trust is built: by being honest about what AI can and can't do, while still being as helpful as possible within those boundaries.",
  },
  {
    icon: Lock,
    title: "Private & Secure",
    description:
      "Your conversations and memories are yours alone. Encrypted, authenticated, and never shared.",
    detail:
      "Your privacy is fundamental to how Zari is built, not an afterthought. Every conversation and memory is tied to your authenticated account through Clerk, which handles login via Google, Apple, or email with industry-standard security. Your data is stored in Convex, a real-time database with built-in access controls — only you can see your conversations and memories. AI processing happens server-side through the Anthropic API, meaning your API keys and conversation data never touch the browser. Zari doesn't sell your data, doesn't train external models on your conversations, and doesn't share your information with third parties for advertising. You can delete individual memories anytime, clear all memories with one tap, or delete your entire account. The app supports HTTPS everywhere, and session management keeps you logged in securely for up to 30 days. Your relationship with Zari is private — exactly as it should be.",
  },
];

export function Features() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.button
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setOpenIndex(i)}
            className="bg-zari-surface rounded-2xl border border-white/5 p-6 hover:border-zari-accent/30 transition-all text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-zari-accent/20 flex items-center justify-center mb-4 group-hover:bg-zari-accent/30 transition-colors">
              <feature.icon className="w-6 h-6 text-zari-accent-light" />
            </div>
            <h3 className="text-lg font-semibold text-zari-text mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-zari-muted leading-relaxed mb-3">
              {feature.description}
            </p>
            <span className="text-xs text-zari-accent font-medium group-hover:text-zari-accent-light transition-colors">
              Learn more &rarr;
            </span>
          </motion.button>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setOpenIndex(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zari-surface rounded-3xl border border-white/10 p-8 max-w-xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-zari-accent/20 flex items-center justify-center">
                    {(() => {
                      const Icon = features[openIndex].icon;
                      return (
                        <Icon className="w-7 h-7 text-zari-accent-light" />
                      );
                    })()}
                  </div>
                  <h2 className="text-xl font-bold text-zari-text">
                    {features[openIndex].title}
                  </h2>
                </div>
                <button
                  onClick={() => setOpenIndex(null)}
                  className="p-2 rounded-xl hover:bg-white/5 text-zari-muted hover:text-zari-text transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-zari-text/85 leading-relaxed">
                {features[openIndex].detail}
              </p>

              <button
                onClick={() => setOpenIndex(null)}
                className="mt-8 w-full py-3 rounded-xl bg-zari-accent/10 text-zari-accent text-sm font-medium hover:bg-zari-accent/20 transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
