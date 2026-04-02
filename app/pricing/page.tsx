"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MatrixRain } from "@/components/chat/matrix-rain";
import { useAuth } from "@clerk/nextjs";
import {
  Check,
  X,
  Sparkles,
  ArrowLeft,
  Crown,
} from "lucide-react";

const FREE_FEATURES = [
  { text: "5 messages per day", included: true },
  { text: "1 conversation", included: true },
  { text: "English only", included: true },
  { text: "Memory", included: false },
  { text: "Voice / TTS", included: false },
  { text: "All personality styles", included: false },
  { text: "16 languages", included: false },
];

const PLUS_FEATURES = [
  { text: "Unlimited messages", included: true },
  { text: "Unlimited conversations", included: true },
  { text: "All 16 languages", included: true },
  { text: "Zari remembers everything", included: true },
  { text: "Voice / TTS enabled", included: true },
  { text: "All personality styles", included: true },
  { text: "Priority support", included: true },
];

export default function PricingPage() {
  const { isSignedIn } = useAuth();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  const price = billing === "monthly" ? "$9" : "$99.99";
  const period = billing === "monthly" ? "/month" : "/year";
  const savings = billing === "yearly" ? "Save ~$8/year" : null;

  const priceId =
    billing === "monthly"
      ? process.env.NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID
      : process.env.NEXT_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID;

  const [error, setError] = useState("");

  async function handleUpgrade() {
    if (!isSignedIn) {
      window.location.href = "/sign-up";
      return;
    }
    if (!priceId) {
      setError("Pricing is not configured yet. Please try again later.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#06060e] font-mono relative overflow-hidden">
      {/* Matrix Rain */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MatrixRain color="#7c5cfc" opacity={0.025} speed={0.5} />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-zari-muted hover:text-zari-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-zari-accent mb-3 block">
              Pricing
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-zari-text mb-4">
              Unlock the Full Zari Experience
            </h1>
            <p className="text-zari-muted max-w-md mx-auto">
              Start free. Upgrade when you want unlimited conversations,
              memory, voice, and all 16 languages.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                billing === "monthly"
                  ? "bg-zari-accent text-white"
                  : "text-zari-muted hover:text-zari-text"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                billing === "yearly"
                  ? "bg-zari-accent text-white"
                  : "text-zari-muted hover:text-zari-text"
              }`}
            >
              Yearly
              {savings && (
                <span className="ml-2 text-xs text-green-400">
                  {savings}
                </span>
              )}
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zari-surface rounded-3xl border border-white/5 p-8"
            >
              <h3 className="text-lg font-semibold text-zari-text mb-2">
                Free
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-zari-text">$0</span>
                <span className="text-zari-muted ml-1">/forever</span>
              </div>
              <p className="text-sm text-zari-muted mb-8">
                Get a taste of what Zari can do.
              </p>
              <Link
                href={isSignedIn ? "/chat" : "/sign-up"}
                className="block w-full py-3 rounded-xl border border-white/10 text-center text-sm font-medium text-zari-muted hover:text-zari-text hover:border-white/20 transition-all mb-8"
              >
                {isSignedIn ? "Continue Free" : "Get Started"}
              </Link>
              <ul className="space-y-3">
                {FREE_FEATURES.map((f) => (
                  <li
                    key={f.text}
                    className="flex items-center gap-3 text-sm"
                  >
                    {f.included ? (
                      <Check className="w-4 h-4 text-green-400 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-zari-muted/40 shrink-0" />
                    )}
                    <span
                      className={
                        f.included ? "text-zari-text" : "text-zari-muted/40"
                      }
                    >
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Plus */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative bg-gradient-to-b from-zari-accent/10 to-zari-surface rounded-3xl border border-zari-accent/30 p-8"
            >
              {/* Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-zari-accent text-white text-xs font-semibold flex items-center gap-1.5">
                <Crown className="w-3 h-3" />
                Most Popular
              </div>

              <h3 className="text-lg font-semibold text-zari-text mb-2 flex items-center gap-2">
                Zari Plus
                <Sparkles className="w-4 h-4 text-zari-accent" />
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-zari-text">
                  {price}
                </span>
                <span className="text-zari-muted ml-1">{period}</span>
              </div>
              <p className="text-sm text-zari-muted mb-8">
                The full Zari experience. Everything unlocked.
              </p>
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="block w-full py-3 rounded-xl bg-zari-accent text-white text-center text-sm font-semibold hover:bg-zari-accent/90 transition-all shadow-lg shadow-zari-accent/20 disabled:opacity-50 mb-8"
              >
                {loading ? "Loading..." : "Upgrade to Plus"}
              </button>
              {error && (
                <p className="text-xs text-red-400 mb-4">{error}</p>
              )}
              <ul className="space-y-3">
                {PLUS_FEATURES.map((f) => (
                  <li
                    key={f.text}
                    className="flex items-center gap-3 text-sm"
                  >
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="text-zari-text">{f.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
