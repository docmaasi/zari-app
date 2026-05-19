"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCta() {
  return (
    <section className="relative z-10 py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-zari-accent/20 via-zari-pink/10 to-zari-blue/20 rounded-3xl border border-white/10 p-12 md:p-16 overflow-hidden"
        >
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
              Start a conversation that actually understands you. Free 7-day
              Plus trial included — no credit card.
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
  );
}
