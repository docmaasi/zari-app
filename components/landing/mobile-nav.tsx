"use client";

import { useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        className="md:hidden p-2 rounded-lg text-zari-muted hover:text-zari-text"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-zari-bg/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex items-center justify-between px-6 h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zari-accent to-zari-pink flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-zari-text">Zari</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg text-zari-muted hover:text-zari-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="px-6 py-8 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 px-4 rounded-xl text-lg text-zari-text hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </a>
              ))}

              <div className="border-t border-white/5 my-6" />

              <SignedOut>
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="block py-3 px-4 rounded-xl text-lg text-zari-muted hover:text-zari-text"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className="block py-3 px-4 rounded-xl text-lg text-center bg-zari-accent text-white font-medium mt-2"
                >
                  Get Started Free
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/chat"
                  onClick={() => setOpen(false)}
                  className="block py-3 px-4 rounded-xl text-lg text-center bg-zari-accent text-white font-medium"
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
