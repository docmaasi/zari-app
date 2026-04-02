import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI That Remembers Everything About You | Zari",
  description:
    "Tired of AI that forgets you? Zari remembers your name, your goals, your people, and your life. Every conversation builds on the last.",
  openGraph: {
    title: "AI That Remembers Everything | Zari",
    description:
      "An AI companion with permanent memory. She knows your sister's name, your Tuesday stress, and your half-marathon goal.",
    url: "https://www.zari.help/ai-that-remembers",
  },
};

export default function AIThatRemembersPage() {
  return (
    <div className="min-h-screen bg-[#06060e] font-mono">
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-zari-text mb-6 leading-tight">
          An AI That{" "}
          <span className="bg-gradient-to-r from-zari-accent to-zari-pink bg-clip-text text-transparent">
            Never Forgets You
          </span>
        </h1>
        <p className="text-lg text-zari-muted max-w-xl mx-auto mb-4">
          You told a chatbot about your promotion last week. Today it has no
          idea who you are. Zari is different.
        </p>
        <p className="text-base text-zari-muted/70 max-w-lg mx-auto mb-10">
          Zari extracts facts, names, events, and preferences from every
          conversation. She connects what you said on Monday to what
          you&apos;re dealing with on Friday. She notices patterns you miss.
          She brings things up when they matter.
        </p>

        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-zari-accent text-white font-semibold text-lg hover:bg-zari-accent/90 transition-all shadow-lg shadow-zari-accent/25 mb-16"
        >
          Try Zari Free
          <ArrowRight className="w-5 h-5" />
        </Link>

        <div className="text-left max-w-lg mx-auto space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-zari-text mb-2">
              She remembers your people
            </h3>
            <p className="text-xs text-zari-muted leading-relaxed">
              &ldquo;Didn&apos;t you say your sister Amina was visiting this
              week? How did that go?&rdquo;
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zari-text mb-2">
              She remembers your goals
            </h3>
            <p className="text-xs text-zari-muted leading-relaxed">
              &ldquo;Last week you said you wanted to start running again.
              Have you had a chance to get out there?&rdquo;
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zari-text mb-2">
              She remembers your patterns
            </h3>
            <p className="text-xs text-zari-muted leading-relaxed">
              &ldquo;I&apos;ve noticed you bring up work stress every
              Tuesday. What&apos;s going on with Tuesdays?&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
