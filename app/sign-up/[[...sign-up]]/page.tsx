"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { ZariOrb } from "@/components/chat/zari-orb";
import { MatrixRain } from "@/components/chat/matrix-rain";
import { Brain, Volume2, Globe, Shield } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#06060e] relative overflow-hidden font-mono">
      {/* Matrix Rain */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MatrixRain color="#7c5cfc" opacity={0.03} speed={0.6} />
      </div>

      {/* Glow effects */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-zari-accent/20 to-transparent pointer-events-none z-0" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[100px] bg-gradient-to-r from-transparent via-zari-accent/8 to-transparent blur-[50px] pointer-events-none z-0" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-6">
          <ZariOrb emotion="idle" gender="neutral" size={48} />
          <span className="text-2xl font-bold text-zari-text tracking-wider">Zari</span>
        </Link>

        {/* Welcome message */}
        <div className="text-center mb-6 max-w-lg">
          <h1 className="text-3xl font-bold text-zari-text mb-3">
            <span className="bg-gradient-to-r from-[#c084fc] via-[#a78bfa] to-[#60a5fa] bg-clip-text text-transparent">
              Meet Zari
            </span>
          </h1>
          <p className="text-sm text-zari-muted/80 leading-relaxed mb-5">
            Hi. I&apos;m Zari — and I&apos;m not like anything you&apos;ve
            talked to before. I don&apos;t just answer questions. I listen. I
            remember your name, your goals, your struggles, the people who
            matter to you. I think ahead. I notice patterns. I speak out loud
            in 16 languages. I adapt my personality to match yours. And every
            conversation we have makes me understand you a little more. I&apos;m
            not a chatbot. I&apos;m your companion. Create your account and
            let&apos;s start something real.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[11px] text-zari-muted/70">
              <Brain className="w-3 h-3" /> Remembers You
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[11px] text-zari-muted/70">
              <Volume2 className="w-3 h-3" /> Speaks Out Loud
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[11px] text-zari-muted/70">
              <Globe className="w-3 h-3" /> 16 Languages
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[11px] text-zari-muted/70">
              <Shield className="w-3 h-3" /> Private & Encrypted
            </span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-zari-surface/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-zari-accent/10 rounded-2xl",
                headerTitle: "text-zari-text",
                headerSubtitle: "text-zari-muted",
                socialButtonsBlockButton:
                  "border border-white/10 bg-zari-surface2/80 hover:bg-white/5 text-zari-text rounded-xl h-12 backdrop-blur-sm",
                socialButtonsBlockButtonText: "text-sm font-medium",
                dividerLine: "bg-white/10",
                dividerText: "text-zari-muted",
                formFieldLabel: "text-zari-muted text-sm",
                formFieldInput:
                  "bg-zari-surface2 border-white/10 text-zari-text rounded-xl focus:border-zari-accent focus:ring-zari-accent/20",
                formButtonPrimary:
                  "bg-zari-accent hover:bg-zari-accent/90 rounded-xl h-12 text-sm font-semibold shadow-lg shadow-zari-accent/20",
                footerActionLink: "text-zari-accent hover:text-zari-accent-light",
                footerActionText: "text-zari-muted",
                identityPreviewEditButton: "text-zari-accent",
                formFieldAction: "text-zari-accent",
                otpCodeFieldInput: "border-white/10 bg-zari-surface2 text-zari-text",
              },
            }}
          />
        </div>

        <p className="mt-8 text-xs text-zari-muted/40 text-center max-w-sm">
          Free to start. No credit card. Zari grows with every conversation.
        </p>
      </div>
    </div>
  );
}
