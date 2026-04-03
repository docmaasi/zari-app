"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  Sparkles,
  ArrowRight,
  Volume2,
  Shield,
  Heart,
  Zap,
} from "lucide-react";
import { DemoChat } from "@/components/landing/demo-chat";
import { Features } from "@/components/landing/features";
import { LanguageShowcase } from "@/components/landing/language-showcase";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { SocialProof } from "@/components/landing/social-proof";
import { MobileNav } from "@/components/landing/mobile-nav";
import { PwaInstallButton } from "@/components/pwa-install";
import { WhyZari } from "@/components/landing/why-zari";
import { TrialChat } from "@/components/landing/trial-chat";
import { BackToTop } from "@/components/landing/back-to-top";
import { MatrixRain } from "@/components/chat/matrix-rain";
import { ZariOrb } from "@/components/chat/zari-orb";

export default function LandingPage() {
  const [showTrial, setShowTrial] = useState(false);

  return (
    <div className="min-h-screen bg-[#06060e] overflow-x-hidden font-mono relative">
      {/* Matrix Rain Background — subtle, behind everything */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MatrixRain color="#7c5cfc" opacity={0.035} speed={0.6} />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left — Logo + tagline */}
          <div className="flex items-center gap-3">
            <ZariOrb emotion="idle" gender="neutral" size={32} />
            <div>
              <span className="text-lg font-bold text-zari-text tracking-wider">Zari</span>
              <span className="hidden sm:inline text-[10px] text-zari-accent-light ml-2 tracking-widest uppercase">
                AI Companion
              </span>
            </div>
          </div>

          {/* Center — Nav links (desktop only) */}
          <div className="hidden lg:flex items-center gap-8 text-sm text-zari-muted tracking-wide">
            <a href="#features" className="hover:text-zari-text transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-zari-text transition-colors">How It Works</a>
            <a href="#languages" className="hover:text-zari-text transition-colors">Languages</a>
            <a href="#testimonials" className="hover:text-zari-text transition-colors">Testimonials</a>
            <Link href="/pricing" className="hover:text-zari-text transition-colors text-zari-accent">Pricing</Link>
          </div>

          {/* Right — CTA + actions */}
          <div className="flex items-center gap-3">
            <PwaInstallButton variant="header" />

            {/* Status pill — always visible */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-green-400 tracking-wider font-medium">ONLINE</span>
            </div>

            {/* CTA button — visible on all screens */}
            <SignedOut>
              <button
                onClick={() => setShowTrial(true)}
                className="px-4 py-2 rounded-xl bg-zari-accent text-white text-xs sm:text-sm font-semibold hover:bg-zari-accent/90 transition-colors shadow-lg shadow-zari-accent/20"
              >
                Try Zari
              </button>
              <Link
                href="/sign-in"
                className="hidden lg:inline text-sm text-zari-muted hover:text-zari-text transition-colors"
              >
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/chat"
                className="px-4 py-2 rounded-xl bg-zari-accent text-white text-xs sm:text-sm font-semibold hover:bg-zari-accent/90 transition-colors shadow-lg shadow-zari-accent/20"
              >
                Open Chat
              </Link>
            </SignedIn>

            <MobileNav />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-20 px-6 overflow-hidden">
        {/* Cosmic background — only the glow/burst, text area hidden */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/hero-bg.webp"
            alt=""
            className="w-full h-full object-cover object-bottom opacity-50"
          />
          {/* Heavy top fade hides the text baked into the image */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#06060e] via-[#06060e]/70 via-[45%] to-transparent" />
          {/* Bottom fade to page bg */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#06060e] to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-5 leading-[1.1] tracking-tight"
          >
            <span className="bg-gradient-to-r from-[#c084fc] via-[#a78bfa] to-[#60a5fa] bg-clip-text text-transparent">
              Meet Zari
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="text-lg md:text-2xl text-white font-medium mb-3"
          >
            Your AI that actually understands you.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="text-sm md:text-base text-zari-muted/70 mb-10"
          >
            Zari listens, remembers, and evolves with you.
          </motion.p>

          {/* HD Orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1, type: "spring" }}
            className="relative flex justify-center mb-8"
          >
            <img
              src="/zari-orb-hd.png"
              alt="Zari"
              width={240}
              height={240}
              className="relative z-10 w-[180px] h-[180px] md:w-[240px] md:h-[240px]"
              style={{ filter: "drop-shadow(0 0 60px rgba(124,92,252,0.4))" }}
            />
          </motion.div>

          {/* "I remember what matters" */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="inline-block px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-zari-text/80 mb-10 backdrop-blur-sm"
          >
            I remember what matters.
          </motion.div>

          {/* What Zari does — 4 key things */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12"
          >
            {[
              { icon: "🧠", title: "Remembers You", desc: "Names, goals, people, preferences — Zari never forgets" },
              { icon: "🗣️", title: "Speaks Out Loud", desc: "Real voices powered by ElevenLabs. Put your headphones in." },
              { icon: "🌍", title: "16 Languages", desc: "Not translation — true fluency with cultural awareness" },
              { icon: "💜", title: "3 Personalities", desc: "Warm & nurturing, balanced & calm, or bold & direct" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm text-center"
              >
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <h3 className="text-xs font-semibold text-zari-text mb-1">{item.title}</h3>
                <p className="text-[10px] text-zari-muted/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Zari's promise */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-sm text-zari-muted/50 max-w-lg mx-auto mb-8 leading-relaxed italic"
          >
            &ldquo;I&apos;m not a chatbot. I think ahead, notice patterns, follow up on things
            you mentioned last week, and I&apos;m always honest with you. The more we talk,
            the more I understand your world.&rdquo;
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <SignedOut>
              <button
                onClick={() => setShowTrial(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-zari-accent text-white font-semibold text-lg hover:bg-zari-accent/90 transition-all shadow-lg shadow-zari-accent/25 hover:shadow-xl hover:-translate-y-0.5"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                href="#demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 text-zari-muted text-sm font-medium hover:text-zari-text hover:border-white/20 transition-all"
              >
                See a Demo
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-zari-accent text-white font-semibold text-lg hover:bg-zari-accent/90 transition-all shadow-lg shadow-zari-accent/25"
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
            transition={{ delay: 1.3 }}
            className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-zari-muted/40"
          >
            <span className="flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> Private & encrypted
            </span>
            <span className="text-zari-muted/20">|</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> Powered by Claude AI
            </span>
            <span className="text-zari-muted/20">|</span>
            <span>Free to start</span>
            <span className="text-zari-muted/20">|</span>
            <span>No credit card</span>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <SocialProof />
        </div>
      </section>

      {/* Demo Chat */}
      <section id="demo" className="py-20 px-6 bg-black/40">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-zari-accent mb-3 block">
              Live Demo
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-zari-text mb-4">
              See Zari in Action
            </h2>
            <p className="text-zari-muted max-w-lg mx-auto">
              Real conversations showing how Zari thinks autonomously, gives
              life advice, and includes responsible disclosures.
            </p>
          </motion.div>
          <DemoChat />
        </div>
      </section>

      {/* Why Zari */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <WhyZari />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-zari-accent mb-3 block">
              Getting Started
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-zari-text mb-4">
              Up and Running in 30 Seconds
            </h2>
            <p className="text-zari-muted max-w-lg mx-auto">
              Sign in with Google or Apple, choose your vibe, and start talking.
              It really is that simple.
            </p>
          </motion.div>
          <HowItWorks />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-zari-accent mb-3 block">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-zari-text mb-4">
              What Makes Zari Different
            </h2>
            <p className="text-zari-muted max-w-lg mx-auto">
              Not just another chatbot. A companion that thinks ahead, speaks
              out loud, and grows with you.
            </p>
          </motion.div>
          <Features />
        </div>
      </section>

      {/* Personality Modes */}
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
              Zari adapts her entire communication style to match your
              preference.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
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
            ].map((mode, i) => (
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

      {/* Languages */}
      <section id="languages" className="py-20 px-6 bg-black/40">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-zari-accent mb-3 block">
              Multilingual
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-zari-text mb-4">
              Your Language, Your Way
            </h2>
            <p className="text-zari-muted max-w-lg mx-auto">
              Zari speaks fluently in 16 languages — with localized voice, tone,
              and cultural awareness. Not translation. True fluency.
            </p>
          </motion.div>
          <LanguageShowcase />
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-zari-accent mb-3 block">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-zari-text mb-4">
              People Love Zari
            </h2>
            <p className="text-zari-muted max-w-lg mx-auto">
              Real users from around the world sharing their experiences.
            </p>
          </motion.div>
          <Testimonials />
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-zari-accent/20 via-zari-pink/10 to-zari-blue/20 rounded-3xl border border-white/10 p-12 md:p-16 overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-zari-accent/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-zari-pink/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-zari-accent via-zari-pink to-zari-blue flex items-center justify-center shadow-2xl shadow-zari-accent/20">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-zari-text mb-4">
                Ready to Meet Zari?
              </h2>
              <p className="text-lg text-zari-muted mb-8 max-w-md mx-auto">
                Start a conversation that actually understands you. Try free
                or upgrade to Plus for unlimited access.
              </p>
              <SignedOut>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-zari-accent text-white font-semibold text-lg hover:bg-zari-accent/90 transition-all shadow-lg shadow-zari-accent/25 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                <p className="mt-6 text-xs text-zari-muted/50">
                  Sign up with Google, Apple, or email
                </p>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-zari-accent text-white font-semibold text-lg hover:bg-zari-accent/90 transition-all shadow-lg shadow-zari-accent/25"
                >
                  Continue Chatting
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </SignedIn>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <ZariOrb emotion="idle" gender="neutral" size={32} />
                <span className="text-lg font-bold text-zari-text">Zari</span>
              </div>
              <p className="text-xs text-zari-muted leading-relaxed">
                Your AI companion that thinks, speaks, learns, and remembers.
                Available in 16 languages.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zari-text mb-4">
                Product
              </h4>
              <div className="space-y-2">
                <a href="#features" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">Features</a>
                <a href="#how-it-works" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">How It Works</a>
                <a href="#languages" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">Languages</a>
                <a href="#testimonials" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">Testimonials</a>
                <Link href="/pricing" className="block text-xs text-zari-accent hover:text-zari-text transition-colors">Pricing</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zari-text mb-4">
                Legal
              </h4>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">Terms of Use</Link>
                <Link href="/cookies" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">Cookie Policy</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zari-text mb-4">
                Contact
              </h4>
              <div className="space-y-2">
                <a href="mailto:hello@zari.help" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">hello@zari.help</a>
                <a href="mailto:support@zari.help" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">support@zari.help</a>
                <a href="mailto:privacy@zari.help" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">privacy@zari.help</a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zari-muted/50">
              &copy; {new Date().getFullYear()} Zari. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-zari-muted/50">
              <Link href="/privacy" className="hover:text-zari-muted transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-zari-muted transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-zari-muted transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <BackToTop />

      {/* PWA Install Banner (floating) */}
      <PwaInstallButton variant="banner" />

      {/* Trial Chat Modal */}
      <AnimatePresence>
        {showTrial && <TrialChat onClose={() => setShowTrial(false)} />}
      </AnimatePresence>
    </div>
  );
}
