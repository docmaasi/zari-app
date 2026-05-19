"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function PricingBlock() {
  return (
    <section id="pricing" className="relative z-10 py-20 px-6 bg-black/40">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-zari-accent mb-3 block">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-zari-text mb-4">
            Start Free. Upgrade When You&apos;re Ready.
          </h2>
          <p className="text-zari-muted max-w-lg mx-auto">
            Every signup includes a 7-day Plus trial — full memory, all
            languages, premium voices. No credit card needed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-zari-surface border border-white/5"
          >
            <h3 className="text-lg font-semibold text-zari-text mb-2">Free</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-zari-text">$0</span>
              <span className="text-zari-muted ml-1">/forever</span>
            </div>
            <p className="text-sm text-zari-muted mb-6">
              After your trial ends, keep talking to Zari with real AI voices.
            </p>
            <ul className="space-y-3 text-sm">
              {[
                { text: "5 messages per day", ok: true },
                { text: "Zari AI Voice", ok: true },
                { text: "A taste of memory (3 recent)", ok: true },
                { text: "English only", ok: true },
                { text: "Unlimited memory", ok: false },
                { text: "16 languages", ok: false },
                { text: "Voice notes, sleep stories", ok: false },
              ].map((f) => (
                <li
                  key={f.text}
                  className={`flex items-center gap-2 ${
                    f.ok ? "text-zari-text" : "text-zari-muted/40"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      f.ok
                        ? "bg-green-500/20 text-green-400"
                        : "bg-white/5 text-zari-muted/30"
                    }`}
                  >
                    {f.ok ? "✓" : "×"}
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative p-8 rounded-3xl bg-gradient-to-b from-zari-accent/10 to-zari-surface border border-zari-accent/30"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-zari-accent text-white text-xs font-semibold">
              Most Popular
            </div>
            <h3 className="text-lg font-semibold text-zari-text mb-2">
              Zari Plus
            </h3>
            <div className="mb-1">
              <span className="text-4xl font-bold text-zari-text">$9.99</span>
              <span className="text-zari-muted ml-1">/month</span>
            </div>
            <p className="text-xs text-zari-accent mb-4">
              or $99.99/year (save ~$20)
            </p>
            <p className="text-sm text-zari-muted mb-6">
              The full Zari experience. Everything unlocked.
            </p>
            <ul className="space-y-3 text-sm">
              {[
                "Unlimited Daily Conversations",
                "Premium Zari Voices",
                "Zari remembers everything",
                "All 16 languages",
                "All 3 personality styles",
                "Voice notes from Zari",
                "Sleep stories & ambient sounds",
                "Photo reactions (AI vision)",
                "Mood journal & emotional reports",
                "Zari’s Journal (her thoughts about you)",
                "Conversation export",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-zari-text">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-green-500/20 text-green-400">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-6 mb-2 text-[11px] text-center text-zari-muted/80">
              30-day money back. Cancel anytime.
            </p>
            <Link
              href="/pricing"
              className="block py-3 rounded-xl bg-zari-accent text-white text-center text-sm font-semibold hover:bg-zari-accent/90 transition-all shadow-lg shadow-zari-accent/20"
            >
              Upgrade to Plus
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
