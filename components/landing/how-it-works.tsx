"use client";

import { motion } from "framer-motion";
import { UserPlus, MessageCircle, Brain, Sparkles } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Sign Up in Seconds",
    description:
      "Use Google, Apple, or email. No credit card needed. You're chatting with Zari in under 30 seconds.",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "Choose Your Personality",
    description:
      "Pick warm & nurturing, balanced & adaptive, or bold & direct. Zari shapes her entire communication style to match.",
  },
  {
    icon: MessageCircle,
    step: "03",
    title: "Start Talking",
    description:
      "Talk about anything. Life, goals, health, relationships, ideas. Zari thinks autonomously and responds like a real companion.",
  },
  {
    icon: Brain,
    step: "04",
    title: "Zari Remembers",
    description:
      "Names, events, preferences, goals. Over time Zari builds a memory of who you are and what matters to you.",
  },
];

export function HowItWorks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {steps.map((step, i) => (
        <motion.div
          key={step.step}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className="relative"
        >
          {/* Connector line */}
          {i < steps.length - 1 && (
            <div className="hidden lg:block absolute top-8 left-[calc(50%+24px)] w-[calc(100%-48px)] h-px bg-gradient-to-r from-zari-accent/30 to-transparent" />
          )}

          <div className="text-center">
            <div className="relative inline-flex mb-4">
              <div className="w-16 h-16 rounded-2xl bg-zari-accent/10 border border-zari-accent/20 flex items-center justify-center">
                <step.icon className="w-7 h-7 text-zari-accent-light" />
              </div>
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-zari-accent text-white text-xs font-bold flex items-center justify-center">
                {step.step}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-zari-text mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-zari-muted leading-relaxed">
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
