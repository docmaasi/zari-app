"use client";

import Link from "next/link";
import { ZariMark } from "@/components/brand/zari-mark";

export function SiteFooter() {
  return (
    <footer className="relative z-10 py-16 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <ZariMark size={28} />
              <span className="text-lg font-extrabold text-zari-text tracking-tight">
                zari
              </span>
            </div>
            <p className="text-xs text-zari-muted leading-relaxed">
              Voice-first AI companion that listens, remembers, and grows
              with you. 16 languages.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zari-text mb-4">
              Product
            </h4>
            <div className="space-y-2">
              <a href="#features" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">Features</a>
              <a href="#how-it-works" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">How It Works</a>
              <a href="#languages" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">Languages</a>
              <a href="#testimonials" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">Testimonials</a>
              <Link href="/pricing" className="block text-xs text-zari-accent hover:text-zari-text transition-colors">Pricing</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zari-text mb-4">
              Legal
            </h4>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">Terms of Use</Link>
              <Link href="/cookies" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">Cookie Policy</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zari-text mb-4">
              Contact
            </h4>
            <div className="space-y-2">
              <a href="mailto:hello@zari.help" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">hello@zari.help</a>
              <a href="mailto:support@zari.help" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">support@zari.help</a>
              <a href="mailto:privacy@zari.help" className="block text-xs text-zari-muted hover:text-zari-text transition-colors">privacy@zari.help</a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zari-muted/50">
            &copy; {new Date().getFullYear()} Zari. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-zari-muted/50">
            <Link href="/privacy" className="hover:text-zari-muted transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zari-muted transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-zari-muted transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
