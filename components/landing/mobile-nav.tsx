"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { ZariOrb } from "@/components/chat/zari-orb";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 rounded-lg text-zari-muted hover:text-zari-text"
        aria-label="Open menu"
        style={{ position: "relative", zIndex: 60 }}
      >
        <Menu className="w-6 h-6" />
      </button>

      {open && (
        <div
          className="fixed inset-0 lg:hidden"
          style={{ zIndex: 9999 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#06060e]/98 backdrop-blur-xl"
            onClick={close}
          />

          {/* Menu content */}
          <div className="relative h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-white/5">
              <div className="flex items-center gap-3">
                <ZariOrb emotion="idle" gender="neutral" size={32} />
                <span className="text-lg font-bold text-zari-text font-mono tracking-wider">
                  Zari
                </span>
              </div>
              <button
                onClick={close}
                className="p-2 rounded-lg text-zari-muted hover:text-zari-text"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 px-6 py-6 space-y-1 overflow-y-auto">
              <a href="#demo" onClick={close} className="block py-3 px-4 rounded-xl text-lg text-zari-text hover:bg-white/5 transition-colors font-mono">
                Demo
              </a>
              <a href="#features" onClick={close} className="block py-3 px-4 rounded-xl text-lg text-zari-text hover:bg-white/5 transition-colors font-mono">
                Features
              </a>
              <a href="#how-it-works" onClick={close} className="block py-3 px-4 rounded-xl text-lg text-zari-text hover:bg-white/5 transition-colors font-mono">
                How It Works
              </a>
              <a href="#languages" onClick={close} className="block py-3 px-4 rounded-xl text-lg text-zari-text hover:bg-white/5 transition-colors font-mono">
                Languages
              </a>
              <a href="#testimonials" onClick={close} className="block py-3 px-4 rounded-xl text-lg text-zari-text hover:bg-white/5 transition-colors font-mono">
                Testimonials
              </a>
              <Link href="/pricing" onClick={close} className="block py-3 px-4 rounded-xl text-lg text-zari-accent hover:bg-zari-accent/10 transition-colors font-mono font-semibold">
                Pricing
              </Link>

              <div className="border-t border-white/5 my-4" />

              <SignedOut>
                <Link href="/sign-in" onClick={close} className="block py-3 px-4 rounded-xl text-lg text-zari-muted hover:text-zari-text font-mono">
                  Sign In
                </Link>
                <Link href="/sign-up" onClick={close} className="block py-4 px-4 rounded-xl text-lg text-center bg-zari-accent text-white font-semibold font-mono mt-2">
                  Get Started Free
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/chat" onClick={close} className="block py-4 px-4 rounded-xl text-lg text-center bg-zari-accent text-white font-semibold font-mono">
                  Open Chat
                </Link>
              </SignedIn>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
