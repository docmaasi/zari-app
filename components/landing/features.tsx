"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Volume2,
  Database,
  Globe,
  Shield,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Thinks Autonomously",
    description:
      "Zari anticipates your needs, connects dots across conversations, and proactively offers insights without being asked.",
  },
  {
    icon: Volume2,
    title: "Speaks Out Loud",
    description:
      "Built-in text-to-speech with gender-tuned voices. Zari talks to you naturally in your chosen language.",
  },
  {
    icon: Database,
    title: "Remembers Everything",
    description:
      "Names, dates, preferences, events — Zari builds a memory of who you are and what matters to you.",
  },
  {
    icon: Globe,
    title: "16 Languages",
    description:
      "From English to Urdu, Tagalog to Swahili. Zari speaks your language fluently, not just translates.",
  },
  {
    icon: Shield,
    title: "Responsible Disclosures",
    description:
      "When discussing health, finance, or legal topics, Zari always flags that professional advice should be sought.",
  },
  {
    icon: Lock,
    title: "Private & Secure",
    description:
      "Your conversations and memories are yours alone. Encrypted, authenticated, and never shared.",
  },
];

export function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, i) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="bg-zari-surface rounded-2xl border border-white/5 p-6 hover:border-zari-accent/30 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-zari-accent/20 flex items-center justify-center mb-4">
            <feature.icon className="w-6 h-6 text-zari-accent-light" />
          </div>
          <h3 className="text-lg font-semibold text-zari-text mb-2">
            {feature.title}
          </h3>
          <p className="text-sm text-zari-muted leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
