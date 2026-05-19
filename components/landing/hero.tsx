"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, Shield, Zap, Headphones, Mic } from "lucide-react";
import { FeatureCards } from "@/components/landing/feature-cards";
import { ZariOrb } from "@/components/chat/zari-orb";

interface HeroProps {
  onTryZari: () => void;
}

export function Hero({ onTryZari }: HeroProps) {
  return (
    <section className="relative z-10 pt-32 pb-20 px-6 overflow-hidden">
      {/* Background: brand gradient blobs replace the static png */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full opacity-40 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #ff3d8a 0%, rgba(255,61,138,0) 60%)",
          }}
        />
        <div
          className="absolute top-[35%] left-[20%] w-[420px] h-[420px] rounded-full opacity-30 blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, #b14aff 0%, rgba(177,74,255,0) 65%)",
          }}
        />
        <div
          className="absolute top-[10%] right-[10%] w-[360px] h-[360px] rounded-full opacity-25 blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, #5cf1ff 0%, rgba(92,241,255,0) 65%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b12] via-[#0b0b12]/40 to-[#0b0b12]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Voice-first cue badge — top */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-7 text-[11px] text-zari-accent-light backdrop-blur-md"
        >
          <Headphones className="w-3 h-3" />
          <span className="tracking-wider uppercase font-medium">
            Voice-first · 16 Languages · Hands-free
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold mb-5 leading-[1.05] tracking-tight"
        >
          <span className="text-brand-gradient">The AI that</span>
          <br />
          <span className="text-zari-text">remembers you.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-base md:text-xl text-zari-text/80 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Put your headphones in. Zari listens, speaks back, and remembers
          everything that matters — like a real friend who&apos;s always there.
        </motion.p>

        {/* Animated orb — replaces the static PNG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1, type: "spring" }}
          className="relative flex justify-center mb-10"
        >
          <ZariOrb emotion="idle" size={180} />
        </motion.div>

        {/* Brand promise pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="inline-block px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-zari-text/85 mb-10 backdrop-blur-sm"
        >
          &ldquo;I remember what matters.&rdquo;
        </motion.div>

        <FeatureCards />

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 mt-4"
        >
          <SignedOut>
            <button
              type="button"
              onClick={onTryZari}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-zari-brand-animated animate-brand-pan text-white font-semibold text-lg hover:opacity-90 transition-all glow-brand hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zari-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b12]"
            >
              <Mic className="w-5 h-5" />
              Start Talking — Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#demo"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("demo")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/15 bg-white/5 text-zari-text text-sm font-medium hover:border-white/30 hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zari-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b12]"
            >
              See a Demo
            </a>
          </SignedOut>
          <SignedIn>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-zari-brand-animated animate-brand-pan text-white font-semibold text-lg hover:opacity-90 transition-all glow-brand"
            >
              Open Chat
              <ArrowRight className="w-5 h-5" />
            </Link>
          </SignedIn>
        </motion.div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-zari-muted/85 mt-6"
        >
          <span className="flex items-center gap-1.5">
            <Shield className="w-3 h-3" /> Private & encrypted
          </span>
          <span className="text-zari-muted/30">·</span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3 h-3" /> Powered by Claude AI
          </span>
          <span className="text-zari-muted/30">·</span>
          <span>7-day Plus trial — no card</span>
          <span className="text-zari-muted/30">·</span>
          <span>Cancel anytime</span>
        </motion.div>
      </div>
    </section>
  );
}
