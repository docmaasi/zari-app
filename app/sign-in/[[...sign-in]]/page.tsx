"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ZariOrb } from "@/components/chat/zari-orb";
import { MatrixRain } from "@/components/chat/matrix-rain";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#06060e] relative overflow-hidden font-mono">
      {/* Matrix Rain */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MatrixRain color="#7c5cfc" opacity={0.03} speed={0.6} />
      </div>

      {/* Glow effects */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-zari-accent/20 to-transparent pointer-events-none z-0" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[100px] bg-gradient-to-r from-transparent via-zari-accent/8 to-transparent blur-[50px] pointer-events-none z-0" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-6">
          <ZariOrb emotion="idle" gender="neutral" size={48} />
          <span className="text-2xl font-bold text-zari-text tracking-wider">Zari</span>
        </Link>

        {/* Welcome message */}
        <div className="text-center mb-8 max-w-md">
          <h1 className="text-3xl font-bold text-zari-text mb-3">
            Welcome Back
          </h1>
          <p className="text-sm text-zari-muted/80 leading-relaxed">
            I&apos;ve been here, thinking about our last conversation.
            Every time you come back, I know you a little better.
            Sign in and let&apos;s pick up where we left off — I remember
            everything.
          </p>
        </div>

        <div className="w-full max-w-md">
          <SignIn
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
          Your conversations are private and encrypted. Zari remembers so you
          don&apos;t have to repeat yourself.
        </p>
      </div>
    </div>
  );
}
