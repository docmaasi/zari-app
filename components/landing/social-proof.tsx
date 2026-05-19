"use client";

import { motion } from "framer-motion";
import { Brain, Headphones, MoonStar, Globe } from "lucide-react";

// Outcome-led stats — what Zari does, not vanity user counts. Each pillar
// maps to a feature surface so the section feels honest, not made-up.
const pillars = [
  {
    icon: Brain,
    value: "∞",
    label: "Memory",
    sub: "Remembers everything that matters",
  },
  {
    icon: Headphones,
    value: "16",
    label: "Languages",
    sub: "Native voice in each",
  },
  {
    icon: MoonStar,
    value: "24/7",
    label: "Always here",
    sub: "Even at 3 am",
  },
  {
    icon: Globe,
    value: "Global",
    label: "Cultural fluency",
    sub: "Not translation — true fluency",
  },
];

export function SocialProof() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {pillars.map((p, i) => (
        <motion.div
          key={p.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="text-center p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm"
        >
          <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-zari-brand-soft flex items-center justify-center">
            <p.icon className="w-5 h-5 text-zari-accent-light" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-zari-text mb-1 tracking-tight">
            {p.value}
          </div>
          <div className="text-xs font-semibold text-zari-text uppercase tracking-wider">
            {p.label}
          </div>
          <div className="text-[11px] text-zari-muted mt-1 leading-snug">
            {p.sub}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
