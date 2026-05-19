"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ZariMark } from "@/components/brand/zari-mark";
import { MobileNav } from "@/components/landing/mobile-nav";
import { PwaInstallButton } from "@/components/pwa-install";

interface SiteNavProps {
  onTryZari: () => void;
}

export function SiteNav({ onTryZari }: SiteNavProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <ZariMark size={30} />
          <div>
            <span className="text-lg font-extrabold text-zari-text tracking-tight">
              zari
            </span>
            <span className="hidden sm:inline text-[10px] text-zari-accent-light ml-2 tracking-widest uppercase font-medium">
              AI Companion
            </span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-sm text-zari-muted tracking-wide">
          <a href="#features" className="hover:text-zari-text transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-zari-text transition-colors">
            How It Works
          </a>
          <a href="#languages" className="hover:text-zari-text transition-colors">
            Languages
          </a>
          <a href="#testimonials" className="hover:text-zari-text transition-colors">
            Testimonials
          </a>
          <a href="#pricing" className="hover:text-zari-text transition-colors text-zari-accent">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          <PwaInstallButton variant="header" />

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-green-400 tracking-wider font-medium">
              ONLINE
            </span>
          </div>

          <SignedOut>
            <button
              onClick={onTryZari}
              className="px-4 py-2 rounded-xl bg-zari-accent text-white text-xs sm:text-sm font-semibold hover:bg-zari-accent/90 transition-colors shadow-lg shadow-zari-accent/20"
            >
              Try Zari
            </button>
            <Link
              href="/sign-in"
              className="hidden lg:inline text-sm text-zari-muted hover:text-zari-text transition-colors"
            >
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/chat"
              className="px-4 py-2 rounded-xl bg-zari-accent text-white text-xs sm:text-sm font-semibold hover:bg-zari-accent/90 transition-colors shadow-lg shadow-zari-accent/20"
            >
              Open Chat
            </Link>
          </SignedIn>

          <MobileNav onTryZari={onTryZari} />
        </div>
      </div>
    </nav>
  );
}
