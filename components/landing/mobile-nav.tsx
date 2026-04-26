"use client";

import { useState, useEffect, useRef } from "react";
import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
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
} from "lucide-react";
import { ZariOrb } from "@/components/chat/zari-orb";
import { usePwaInstall } from "@/lib/use-pwa-install";
import { PwaInstallInstructions } from "@/components/pwa-install-instructions";

interface MobileNavProps {
  onTryZari?: () => void;
}

const MENU_COPY =
  "Quick guide to what each option in this menu does — just so you know what to expect when you tap. Try Zari starts your first conversation with an AI companion designed to listen, remember, and grow with you over time. Install App adds Zari to your phone or desktop for a faster, app-like experience without searching for the website again. Pricing shows the free and Plus options so you can choose what fits your needs. Sign In brings returning users back to their saved memories, conversations, moods, and preferences. Privacy and Terms explain how Zari protects your information and how the service works. Use the menu anytime to explore features, start chatting, install Zari, or manage your account. All your data, settings, and conversation history stay attached to your account once you sign in, and nothing about your interactions with Zari is shared with anyone else. The menu is the fastest way to navigate, and you can open or close it anytime from the icon in the top right corner of any page.";

export function MobileNav({ onTryZari }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { canPrompt, isInstalled, promptInstall } = usePwaInstall();

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 rounded-lg text-zari-muted hover:text-zari-text"
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        style={{ position: "relative", zIndex: 60 }}
      >
        <Menu className="w-6 h-6" />
      </button>

      {open && (
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 lg:hidden"
          style={{ zIndex: 9999 }}
        >
          <div
            className="absolute inset-0 bg-[#06060e]/98 backdrop-blur-xl"
            onClick={close}
          />

          <div className="relative h-full flex flex-col">
            <div className="flex items-center justify-between px-6 h-16 border-b border-white/5">
              <div className="flex items-center gap-3">
                <ZariOrb emotion="idle" gender="neutral" size={32} />
                <span className="text-lg font-bold text-zari-text font-mono tracking-wider">
                  Zari
                </span>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={close}
                aria-label="Close navigation menu"
                className="p-2 rounded-lg text-zari-muted hover:text-zari-text"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-6 py-6 overflow-y-auto">
              <ul className="space-y-1">
                <MenuLink href="/" icon={Home} onClick={close}>
                  Home
                </MenuLink>
                <SignedOut>
                  <MenuButton icon={MessageCircle} onClick={handleTryZari}>
                    Try Zari
                  </MenuButton>
                </SignedOut>
                <MenuLink href="/pricing" icon={CreditCard} onClick={close} accent>
                  Pricing
                </MenuLink>
                <MenuLink href="/#features" icon={Sparkles} onClick={close}>
                  Features
                </MenuLink>
                <MenuLink href="/privacy" icon={Shield} onClick={close}>
                  Privacy
                </MenuLink>
                <MenuLink href="/terms" icon={FileText} onClick={close}>
                  Terms
                </MenuLink>

                <li>
                  <div className="border-t border-white/5 my-3" />
                </li>

                <SignedOut>
                  <MenuLink href="/sign-in" icon={LogIn} onClick={close}>
                    Sign In
                  </MenuLink>
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

              <p className="text-[11px] leading-relaxed text-zari-muted/70 mt-8 px-2">
                {MENU_COPY}
              </p>
            </nav>
          </div>
        </div>
      )}

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
        className={`flex items-center gap-3 py-3 px-4 rounded-xl text-base font-mono transition-colors ${tone}`}
      >
        <Icon className="w-5 h-5 opacity-70" />
        {children}
      </Link>
    </li>
  );
}

function MenuButton({ icon: Icon, onClick, children }: ItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-base font-mono text-zari-text hover:bg-white/5 transition-colors text-left"
      >
        <Icon className="w-5 h-5 opacity-70" />
        {children}
      </button>
    </li>
  );
}
