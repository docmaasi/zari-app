"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, Zap } from "lucide-react";

const modes = [
  {
    icon: Heart,
    title: "Warm & Nurturing",
    color: "from-pink-500 to-rose-500",
    border: "border-zari-pink/30 hover:border-zari-pink/60",
    shadow: "hover:shadow-zari-pink/10",
    traits: [
      "Empathetic & caring",
      "Emotionally intuitive",
      "Gentle encouragement",
      "Supportive tone",
    ],
  },
  {
    icon: Sparkles,
    title: "Balanced & Adaptive",
    color: "from-zari-accent to-purple-500",
    border: "border-zari-accent/30 hover:border-zari-accent/60",
    shadow: "hover:shadow-zari-accent/10",
    traits: [
      "Thoughtful & calm",
      "Emotionally intelligent",
      "Measured responses",
      "Flexible approach",
    ],
  },
  {
    icon: Zap,
    title: "Bold & Direct",
    color: "from-blue-500 to-cyan-500",
    border: "border-zari-blue/30 hover:border-zari-blue/60",
    shadow: "hover:shadow-zari-blue/10",
    traits: [
      "Confident & clear",
      "Action-oriented",
      "No sugarcoating",
      "Motivating push",
    ],
  },
];

export function PersonalityModes() {
  return (
    <section className="relative z-10 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-zari-accent mb-3 block">
            Personalities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-zari-text mb-4">
            Three Ways to Talk
          </h2>
          <p className="text-zari-muted max-w-lg mx-auto">
            Zari adapts her entire communication style to match your preference.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modes.map((mode, i) => (
            <motion.div
              key={mode.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`bg-zari-surface rounded-2xl border ${mode.border} p-6 transition-all hover:shadow-xl ${mode.shadow}`}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-5`}
              >
                <mode.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-zari-text mb-4">
                {mode.title}
              </h3>
              <ul className="space-y-2">
                {mode.traits.map((trait) => (
                  <li
                    key={trait}
                    className="flex items-center gap-2 text-sm text-zari-muted"
                  >
                    <div className="w-1 h-1 rounded-full bg-zari-accent" />
                    {trait}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
