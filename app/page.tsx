"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { SocialProof } from "@/components/landing/social-proof";
import { PwaInstallButton } from "@/components/pwa-install";
import { BackToTop } from "@/components/landing/back-to-top";
import { MatrixRain } from "@/components/chat/matrix-rain";
import { SiteNav } from "@/components/landing/site-nav";
import { Hero } from "@/components/landing/hero";

// Lazy-load below-the-fold sections to shrink the first-paint JS payload.
// SSR stays on so the marketing copy is still in the HTML for SEO.
const DemoChat = dynamic(
  () => import("@/components/landing/demo-chat").then((m) => m.DemoChat),
  { ssr: true }
);
const Features = dynamic(
  () => import("@/components/landing/features").then((m) => m.Features),
  { ssr: true }
);
const LanguageShowcase = dynamic(
  () =>
    import("@/components/landing/language-showcase").then(
      (m) => m.LanguageShowcase
    ),
  { ssr: true }
);
const HowItWorks = dynamic(
  () => import("@/components/landing/how-it-works").then((m) => m.HowItWorks),
  { ssr: true }
);
const Testimonials = dynamic(
  () =>
    import("@/components/landing/testimonials").then((m) => m.Testimonials),
  { ssr: true }
);
const WhyZari = dynamic(
  () => import("@/components/landing/why-zari").then((m) => m.WhyZari),
  { ssr: true }
);
const PersonalityModes = dynamic(
  () =>
    import("@/components/landing/personality-modes").then(
      (m) => m.PersonalityModes
    ),
  { ssr: true }
);
const PricingBlock = dynamic(
  () =>
    import("@/components/landing/pricing-block").then((m) => m.PricingBlock),
  { ssr: true }
);
const FinalCta = dynamic(
  () => import("@/components/landing/final-cta").then((m) => m.FinalCta),
  { ssr: true }
);
const SiteFooter = dynamic(
  () => import("@/components/landing/site-footer").then((m) => m.SiteFooter),
  { ssr: true }
);
// TrialChat is only rendered when the user clicks "Try Zari" — pure client lazy.
const TrialChat = dynamic(
  () => import("@/components/landing/trial-chat").then((m) => m.TrialChat),
  { ssr: false }
);

export default function LandingPage() {
  const [showTrial, setShowTrial] = useState(false);

  function openTrial() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("zari:stop-demo"));
    }
    setShowTrial(true);
  }

  return (
    <div className="min-h-screen bg-[#0b0b12] overflow-x-hidden font-mono relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MatrixRain color="#ff3d8a" opacity={0.03} speed={0.6} />
      </div>

      <SiteNav onTryZari={openTrial} />

      <Hero onTryZari={openTrial} />

      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <SocialProof />
        </div>
      </section>

      <section id="demo" className="py-20 px-6 bg-black/40">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            tag="Live Demo"
            title="See Zari in Action"
            sub="Real conversations showing how Zari thinks autonomously, gives life advice, and includes responsible disclosures."
          />
          <DemoChat />
        </div>
      </section>

      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <WhyZari />
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            tag="Getting Started"
            title="Up and running in 30 seconds"
            sub="Sign in with Google or Apple, pick a vibe, and start talking. That's it."
          />
          <HowItWorks />
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            tag="Features"
            title="Built around memory."
            sub="Not just another chatbot. A companion that thinks ahead, speaks out loud, and grows with you."
          />
          <Features />
        </div>
      </section>

      <PersonalityModes />

      <section id="languages" className="py-20 px-6 bg-black/40">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            tag="Multilingual"
            title="Your language. Your way."
            sub="Zari speaks fluently in 16 languages — with localized voice, tone, and cultural awareness. Not translation. True fluency."
          />
          <LanguageShowcase />
        </div>
      </section>

      <section id="testimonials" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            tag="Testimonials"
            title="People love Zari"
            sub="Real users from around the world sharing their experiences."
          />
          <Testimonials />
        </div>
      </section>

      <PricingBlock />

      <FinalCta />

      <SiteFooter />

      <BackToTop />
      <PwaInstallButton variant="banner" />

      <AnimatePresence>
        {showTrial && <TrialChat onClose={() => setShowTrial(false)} />}
      </AnimatePresence>
    </div>
  );
}

function SectionHeader({
  tag,
  title,
  sub,
}: {
  tag: string;
  title: string;
  sub: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <span className="text-xs font-semibold uppercase tracking-widest text-zari-accent mb-3 block">
        {tag}
      </span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-zari-text mb-4 tracking-tight">
        {title}
      </h2>
      <p className="text-zari-muted max-w-lg mx-auto">{sub}</p>
    </motion.div>
  );
}
