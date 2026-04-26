"use client";

import { useState, useEffect, useRef } from "react";
import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  MessageCircle,
  CreditCard,
  Sparkles,
  Shield,
  FileText,
  LogIn,
  Download,
  Play,
} from "lucide-react";
import { usePwaInstall } from "@/lib/use-pwa-install";
import { PwaInstallInstructions } from "@/components/pwa-install-instructions";

interface MobileNavProps {
  onTryZari?: () => void;
}

const MENU_COPY =
  "Quick guide: Try Zari starts a fresh chat with your AI companion. Install App adds Zari to your home screen for fast app-like access. Pricing shows free and Plus options. Sign In returns you to your saved memories and conversations. Privacy and Terms explain how Zari protects your information.";

export function MobileNav({ onTryZari }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { canPrompt, isInstalled, promptInstall } = usePwaInstall();

  // Escape closes; restore focus to trigger
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus first focusable item when menu opens
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      const first = panelRef.current?.querySelector(
        "a, button"
      ) as HTMLElement | null;
      first?.focus();
    }, 80);
    return () => clearTimeout(t);
  }, [open]);

  function close() {
    setOpen(false);
  }

  function handleTryZari() {
    close();
    if (onTryZari) onTryZari();
  }

  async function handleInstall() {
    close();
    if (canPrompt) {
      await promptInstall();
    } else {
      setShowInstructions(true);
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="zari-nav-menu"
        aria-haspopup="true"
        className="p-2 rounded-lg text-zari-muted hover:text-zari-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zari-accent transition-colors"
        style={{ position: "relative", zIndex: 60 }}
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Click-outside backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={close}
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            {/* Dropdown panel */}
            <motion.div
              ref={panelRef}
              id="zari-nav-menu"
              role="dialog"
              aria-label="Site navigation"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="fixed top-20 right-4 z-50 w-72 sm:w-80 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl bg-zari-surface border border-white/10 shadow-2xl shadow-black/50"
            >
              <nav className="p-3" aria-label="Primary">
                <ul className="space-y-0.5">
                  <MenuLink href="/" icon={Home} onClick={close}>
                    Home
                  </MenuLink>
                  <MenuLink href="/#features" icon={Sparkles} onClick={close}>
                    Features
                  </MenuLink>
                  <MenuLink href="/pricing" icon={CreditCard} onClick={close} accent>
                    Pricing
                  </MenuLink>
                  <MenuLink href="/#demo" icon={Play} onClick={close}>
                    Demo
                  </MenuLink>
                  <MenuLink href="/privacy" icon={Shield} onClick={close}>
                    Privacy
                  </MenuLink>
                  <MenuLink href="/terms" icon={FileText} onClick={close}>
                    Terms
                  </MenuLink>

                  <li>
                    <div className="border-t border-white/5 my-2" />
                  </li>

                  <SignedOut>
                    <MenuLink href="/sign-in" icon={LogIn} onClick={close}>
                      Sign In
                    </MenuLink>
                    <MenuButton icon={MessageCircle} onClick={handleTryZari} accent>
                      Get Started Free
                    </MenuButton>
                  </SignedOut>
                  <SignedIn>
                    <MenuLink href="/chat" icon={MessageCircle} onClick={close} accent>
                      Open Chat
                    </MenuLink>
                  </SignedIn>
                  {!isInstalled && (
                    <MenuButton icon={Download} onClick={handleInstall}>
                      Install App
                    </MenuButton>
                  )}
                </ul>

                <p className="text-[10px] leading-relaxed text-zari-muted/70 mt-4 px-2 pb-1">
                  {MENU_COPY}
                </p>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <PwaInstallInstructions
        open={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
    </>
  );
}

interface ItemProps {
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
  onClick?: () => void;
  accent?: boolean;
}

function MenuLink({
  href,
  icon: Icon,
  onClick,
  accent,
  children,
}: ItemProps & { href: string }) {
  const tone = accent
    ? "text-zari-accent hover:bg-zari-accent/10 font-semibold"
    : "text-zari-text hover:bg-white/5";
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zari-accent ${tone}`}
      >
        <Icon className="w-4 h-4 opacity-70" />
        {children}
      </Link>
    </li>
  );
}

function MenuButton({ icon: Icon, onClick, accent, children }: ItemProps) {
  const tone = accent
    ? "text-zari-accent hover:bg-zari-accent/10 font-semibold"
    : "text-zari-text hover:bg-white/5";
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-mono transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zari-accent ${tone}`}
      >
        <Icon className="w-4 h-4 opacity-70" />
        {children}
      </button>
    </li>
  );
}
