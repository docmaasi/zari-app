"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-zari-bg flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zari-accent to-zari-pink flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-zari-text">Zari</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-zari-text mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-zari-muted">
            Sign in to continue your conversation with Zari
          </p>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-zari-surface border border-white/10 shadow-2xl shadow-zari-accent/5 rounded-2xl",
              headerTitle: "text-zari-text",
              headerSubtitle: "text-zari-muted",
              socialButtonsBlockButton:
                "border border-white/10 bg-zari-surface2 hover:bg-white/5 text-zari-text rounded-xl h-12",
              socialButtonsBlockButtonText: "text-sm font-medium",
              dividerLine: "bg-white/10",
              dividerText: "text-zari-muted",
              formFieldLabel: "text-zari-muted text-sm",
              formFieldInput:
                "bg-zari-surface2 border-white/10 text-zari-text rounded-xl focus:border-zari-accent focus:ring-zari-accent/20",
              formButtonPrimary:
                "bg-zari-accent hover:bg-zari-accent/90 rounded-xl h-12 text-sm font-semibold",
              footerActionLink: "text-zari-accent hover:text-zari-accent-light",
              footerActionText: "text-zari-muted",
              identityPreviewEditButton: "text-zari-accent",
              formFieldAction: "text-zari-accent",
              otpCodeFieldInput: "border-white/10 bg-zari-surface2 text-zari-text",
            },
          }}
        />
      </div>

      <p className="mt-8 text-xs text-zari-muted/50 text-center max-w-sm">
        By signing in, you agree to let Zari remember your conversations to
        provide a personalized experience.
      </p>
    </div>
  );
}
