"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Share2, Monitor, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function PwaInstallInstructions({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-instructions-title"
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-zari-surface rounded-3xl border border-white/10 max-w-md w-full p-6 relative"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close install instructions"
              className="absolute top-3 right-3 p-2 rounded-lg text-zari-muted hover:text-zari-text"
            >
              <X className="w-4 h-4" />
            </button>

            <h3
              id="pwa-instructions-title"
              className="text-lg font-semibold text-zari-text mb-1"
            >
              Install Zari on your device
            </h3>
            <p className="text-xs text-zari-muted mb-5">
              Pick the steps that match your browser.
            </p>

            <div className="space-y-5 text-sm">
              <section>
                <div className="flex items-center gap-2 text-zari-accent mb-2 font-medium">
                  <Smartphone className="w-4 h-4" />
                  iPhone or iPad (Safari)
                </div>
                <ol className="text-zari-muted space-y-1 list-decimal list-inside leading-relaxed">
                  <li>
                    Tap the <Share2 className="inline w-3 h-3 mx-0.5" />
                    Share icon at the bottom of the screen.
                  </li>
                  <li>Scroll and tap &ldquo;Add to Home Screen&rdquo;.</li>
                  <li>Tap &ldquo;Add&rdquo; in the top-right corner.</li>
                </ol>
              </section>

              <section>
                <div className="flex items-center gap-2 text-zari-accent mb-2 font-medium">
                  <Smartphone className="w-4 h-4" />
                  Android (Chrome)
                </div>
                <ol className="text-zari-muted space-y-1 list-decimal list-inside leading-relaxed">
                  <li>Tap the menu (three dots) in the top right.</li>
                  <li>
                    Tap &ldquo;Install app&rdquo; or &ldquo;Add to Home
                    screen&rdquo;.
                  </li>
                </ol>
              </section>

              <section>
                <div className="flex items-center gap-2 text-zari-accent mb-2 font-medium">
                  <Monitor className="w-4 h-4" />
                  Desktop (Chrome, Edge)
                </div>
                <ol className="text-zari-muted space-y-1 list-decimal list-inside leading-relaxed">
                  <li>
                    Look for the install icon on the right side of the address
                    bar.
                  </li>
                  <li>Click it and confirm &ldquo;Install&rdquo;.</li>
                </ol>
              </section>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full mt-6 py-3 rounded-xl bg-zari-accent text-white text-sm font-semibold hover:bg-zari-accent/90 transition-colors"
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
