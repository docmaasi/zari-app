import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Brain, Volume2, Globe, Shield, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Companion That Remembers You | Zari",
  description:
    "Meet Zari — an AI companion that thinks, speaks, learns, and remembers everything about you. Available in 16 languages with voice.",
  openGraph: {
    title: "AI Companion That Remembers You | Zari",
    description:
      "An AI friend that actually listens, remembers your life, and grows with you over time.",
    url: "https://www.zari.help/ai-companion",
  },
};

export default function AICompanionPage() {
  return (
    <div className="min-h-screen bg-[#06060e] font-mono">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-zari-text mb-6 leading-tight">
            The AI Companion That{" "}
            <span className="bg-gradient-to-r from-zari-accent to-zari-pink bg-clip-text text-transparent">
              Actually Remembers You
            </span>
          </h1>
          <p className="text-lg text-zari-muted max-w-xl mx-auto mb-8">
            Most AI chatbots forget you the moment you close the window. Zari
            remembers your name, your goals, your people, and your struggles.
            She grows with you over time.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-zari-accent text-white font-semibold text-lg hover:bg-zari-accent/90 transition-all shadow-lg shadow-zari-accent/25"
          >
            Meet Zari Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            { icon: Brain, title: "Permanent Memory", desc: "Zari remembers every detail you share — names, dates, goals, preferences." },
            { icon: Volume2, title: "Speaks Out Loud", desc: "Natural Zari AI voice conversations. Put your headphones in and just talk." },
            { icon: Globe, title: "16 Languages", desc: "Not translation — true fluency with cultural awareness in every language." },
            { icon: Heart, title: "3 Personalities", desc: "Warm & nurturing, balanced & adaptive, or bold & direct. Your choice." },
            { icon: Shield, title: "Responsible AI", desc: "Honest about limitations. Recommends professionals for health, finance, legal." },
            { icon: Brain, title: "Thinks Ahead", desc: "Connects dots between conversations. Anticipates what you need." },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-2xl bg-zari-surface border border-white/5">
              <f.icon className="w-6 h-6 text-zari-accent mb-3" />
              <h3 className="text-sm font-semibold text-zari-text mb-2">{f.title}</h3>
              <p className="text-xs text-zari-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-zari-muted mb-4">
            Free to start. No credit card required.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zari-accent text-white font-medium hover:bg-zari-accent/90 transition-all"
          >
            Start Talking to Zari
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
