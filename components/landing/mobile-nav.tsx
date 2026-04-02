"use client";

import { useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ZariOrb } from "@/components/chat/zari-orb";
import { MatrixRain } from "@/components/chat/matrix-rain";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#languages", label: "Languages" },
  { href: "#testimonials", label: "Testimonials" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 rounded-lg text-zari-muted hover:text-zari-text"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#06060e]/98 backdrop-blur-xl lg:hidden overflow-hidden"
          >
            {/* Matrix rain in the menu */}
            <div className="absolute inset-0 z-0">
              <MatrixRain color="#7c5cfc" opacity={0.06} speed={1} />
            </div>

            <div className="relative z-10 flex items-center justify-between px-6 h-16">
              <div className="flex items-center gap-3">
                <ZariOrb emotion="idle" gender="neutral" size={32} />
                <span className="text-lg font-bold text-zari-text font-mono tracking-wider">
                  Zari
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg text-zari-muted hover:text-zari-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="relative z-10 px-6 py-8 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 px-4 rounded-xl text-lg text-zari-text hover:bg-white/5 transition-colors font-mono tracking-wide"
                >
                  {link.label}
                </a>
              ))}

              <div className="border-t border-white/5 my-6" />

              <SignedOut>
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="block py-3 px-4 rounded-xl text-lg text-zari-muted hover:text-zari-text font-mono tracking-wide"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className="block py-3 px-4 rounded-xl text-lg text-center bg-zari-accent text-white font-semibold mt-2 font-mono tracking-wide"
                >
                  Get Started Free
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/chat"
                  onClick={() => setOpen(false)}
                  className="block py-3 px-4 rounded-xl text-lg text-center bg-zari-accent text-white font-semibold font-mono tracking-wide"
                >
                  Open Chat
                </Link>
              </SignedIn>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
