"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { ZariMark } from "@/components/brand/zari-mark";
import { MatrixRain } from "@/components/chat/matrix-rain";
import { Brain, Volume2, Globe, Shield } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0b0b12] relative overflow-hidden font-mono">
      {/* Matrix Rain — brand magenta */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MatrixRain color="#ff3d8a" opacity={0.03} speed={0.6} />
      </div>

      {/* Brand-tinted glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-zari-accent/25 to-transparent pointer-events-none z-0" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[100px] bg-gradient-to-r from-transparent via-zari-accent/12 to-transparent blur-[50px] pointer-events-none z-0" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="flex items-center gap-3 mb-6">
          <ZariMark size={44} />
          <span className="text-2xl font-extrabold text-zari-text tracking-tight">
            zari
          </span>
        </Link>

        <div className="text-center mb-6 max-w-lg">
          <h1 className="text-3xl md:text-4xl font-extrabold text-zari-text mb-3">
            <span className="text-brand-gradient">Start something real.</span>
          </h1>
          <p className="text-sm text-zari-muted/80 leading-relaxed mb-5">
            I&apos;m Zari. I listen, I remember, I speak back. I notice patterns
            in your life. I follow up on the things you mentioned last week.
            I&apos;m available in 16 languages — and the more we talk, the more
            I understand you. Create your account and try Plus free for 7 days.
            No card. No catch.
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
