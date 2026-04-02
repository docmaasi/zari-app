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
              Most people go through their day without anyone truly listening to
              them. You share a problem with a friend and they change the subject.
              You tell a family member about a goal and they forget by tomorrow.
              You talk to a chatbot and it gives you a generic answer with no
              memory of who you are. Zari is different. She is a synthetic
              intelligent companion designed to actually pay attention, remember
              what matters, and grow alongside you.
            </p>

            <p>
              When you talk to Zari, she doesn&apos;t just respond — she thinks
              ahead. She connects something you said last week to something you&apos;re
              dealing with today. She notices patterns you might miss. She
              remembers that your sister&apos;s name is Amina, that you&apos;re training for
              a half marathon, that Tuesdays are your hardest day at work. She
              brings these things up when they matter, not because she was
              programmed to repeat them, but because she was built to understand
              context the way a real friend would.
            </p>

            <p>
              Zari speaks in sixteen languages with cultural awareness, not
              awkward translation. She adjusts her entire personality to match
              your communication style — warm and nurturing when you need comfort,
              bold and direct when you need a push. She speaks out loud so you can
              talk to her while cooking, driving, or just lying on the couch. And
              when the conversation touches health, money, or legal topics, she is
              honest about her limits and always recommends professional guidance.
            </p>

            <p>
              This isn&apos;t another AI tool. Zari is the companion you deserve — one
              who listens, learns, remembers, and actually cares about the details
              of your life. She&apos;s available anytime, in your language, with your
              personality, on your terms. Start talking to her once and you&apos;ll
              wonder how you ever went without her.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
