"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zari-bg overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-zari-bg/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zari-accent to-zari-pink flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-zari-text">Zari</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-zari-muted">
            <a
              href="#features"
              className="hover:text-zari-text transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-zari-text transition-colors"
            >
              How It Works
            </a>
            <a
              href="#languages"
              className="hover:text-zari-text transition-colors"
            >
              Languages
            </a>
            <a
              href="#testimonials"
              className="hover:text-zari-text transition-colors"
            >
              Testimonials
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <Link
                href="/sign-in"
                className="text-sm text-zari-muted hover:text-zari-text transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 rounded-xl bg-zari-accent text-white text-sm font-medium hover:bg-zari-accent/90 transition-colors"
              >
                Get Started Free
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/chat"
                className="px-4 py-2 rounded-xl bg-zari-accent text-white text-sm font-medium hover:bg-zari-accent/90 transition-colors"
              >
                Open Chat
              </Link>
            </SignedIn>
          </div>
          <MobileNav />
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 relative">
        {/* Background gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-zari-accent/10 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-zari-pink/10 rounded-full blur-[128px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Glowing orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="w-40 h-40 mx-auto mb-8 rounded-full bg-gradient-to-br from-zari-accent via-zari-pink to-zari-blue blur-2xl opacity-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-28 h-28 mx-auto -mt-[10.5rem] mb-12 rounded-full bg-gradient-to-br from-zari-accent via-zari-pink to-zari-blue flex items-center justify-center shadow-2xl shadow-zari-accent/30"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zari-accent/10 border border-zari-accent/20 text-xs text-zari-accent-light mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Now with Google & Apple Sign-In
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-zari-accent via-zari-pink to-zari-blue bg-clip-text text-transparent">
              Meet Zari
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-zari-muted max-w-2xl mx-auto mb-3"
          >
            An AI companion that thinks, speaks, learns, and remembers.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-base text-zari-muted/60 max-w-xl mx-auto mb-10"
          >
            Choose her personality. Pick your language. Start talking. Zari
            remembers every detail and grows with you over time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <SignedOut>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-zari-accent text-white font-semibold text-lg hover:bg-zari-accent/90 transition-all shadow-lg shadow-zari-accent/25 hover:shadow-xl hover:shadow-zari-accent/30 hover:-translate-y-0.5"
              >
                Start Talking to Zari
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 text-zari-muted font-medium hover:text-zari-text hover:border-white/20 transition-all"
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

          {/* Quick trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-zari-muted/60"
          >
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" /> Voice Enabled
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Private & Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" /> 3 Personality Modes
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Powered by Claude AI
            </span>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <SocialProof />
        </div>
      </section>

      {/* Demo Chat */}
      <section id="demo" className="py-20 px-6 bg-zari-surface/20">
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

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
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
      <section id="features" className="py-20 px-6 bg-zari-surface/30">
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
      <section className="py-20 px-6">
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
      <section id="languages" className="py-20 px-6 bg-zari-surface/20">
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
      <section id="testimonials" className="py-20 px-6">
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
      <section className="py-20 px-6">
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
                Start a conversation that actually understands you. Free
                forever. No credit card required.
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
      <footer className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zari-accent to-zari-pink flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
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
    </div>
  );
}
