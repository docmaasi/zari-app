"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { usePwaInstall } from "@/lib/use-pwa-install";
import { PwaInstallInstructions } from "@/components/pwa-install-instructions";

interface Props {
  variant?: "header" | "banner";
}

export function PwaInstallButton({ variant = "header" }: Props) {
  const { canPrompt, isInstalled, promptInstall } = usePwaInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const at = localStorage.getItem("pwa-dismiss");
    if (at && Date.now() - Number(at) < 86400000) {
      setDismissed(true);
    }
  }, []);

  if (isInstalled) return null;

  async function handleInstall() {
    if (canPrompt) {
      await promptInstall();
    } else {
      setShowInstructions(true);
    }
  }

  function handleDismiss() {
    setDismissed(true);
    localStorage.setItem("pwa-dismiss", String(Date.now()));
  }

  if (variant === "header") {
    return (
      <>
        <button
          type="button"
          onClick={handleInstall}
          aria-label="Install Zari as an app"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zari-accent/15 text-zari-accent text-xs font-medium hover:bg-zari-accent/25 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </button>
        <PwaInstallInstructions
          open={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
      </>
    );
  }

  if (dismissed || !canPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-zari-surface border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/50">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zari-accent to-zari-pink flex items-center justify-center flex-shrink-0">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zari-text">Install Zari</p>
          <p className="text-xs text-zari-muted mt-0.5">
            Add to your home screen for the full app experience
          </p>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={handleInstall}
              className="px-4 py-1.5 rounded-lg bg-zari-accent text-white text-xs font-medium hover:bg-zari-accent/90 transition-colors"
            >
              Install
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="px-4 py-1.5 rounded-lg border border-white/10 text-zari-muted text-xs hover:text-zari-text transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss install banner"
          className="p-1 text-zari-muted hover:text-zari-text"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
