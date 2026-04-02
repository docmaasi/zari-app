"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, X } from "lucide-react";

interface UpgradePromptProps {
  title: string;
  message: string;
  onDismiss?: () => void;
}

export function UpgradePrompt({
  title,
  message,
  onDismiss,
}: UpgradePromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mx-4 mb-2 p-4 rounded-2xl bg-gradient-to-r from-zari-accent/10 to-zari-pink/10 border border-zari-accent/20"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-zari-accent/20 flex items-center justify-center shrink-0">
          <Crown className="w-4 h-4 text-zari-accent" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-zari-text mb-1">{title}</p>
          <p className="text-xs text-zari-muted mb-3">{message}</p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zari-accent text-white text-xs font-semibold hover:bg-zari-accent/90 transition-all"
          >
            <Crown className="w-3 h-3" />
            Upgrade to Plus
          </Link>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg text-zari-muted/40 hover:text-zari-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
