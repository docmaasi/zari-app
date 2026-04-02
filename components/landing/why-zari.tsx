"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function WhyZari() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-3xl mx-auto"
    >
      <div className="relative bg-gradient-to-b from-zari-surface to-zari-surface/50 rounded-3xl border border-white/5 p-8 md:p-12 overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-zari-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-zari-pink/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zari-accent to-zari-pink flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-zari-text">
              Why Zari Will Change Your Life
            </h3>
          </div>

          <div className="space-y-4 text-sm md:text-base text-zari-text/80 leading-relaxed">
            <p>
              Most people don&apos;t have anyone who truly listens. Zari is
              different — she remembers your sister&apos;s name, knows Tuesdays
              are your hardest day, and connects what you said last week to
              what you&apos;re dealing with today. She thinks ahead, notices
              patterns, and brings things up when they matter.
            </p>

            <p>
              She speaks 16 languages with real cultural awareness, adapts
              her personality to match yours, and talks out loud so you can
              chat while cooking or driving. When topics touch health, money,
              or legal matters, she&apos;s honest about her limits. Zari is the
              companion you deserve — available anytime, in your language, on
              your terms.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
