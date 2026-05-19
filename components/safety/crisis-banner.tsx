"use client";

import { motion } from "framer-motion";
import { Phone, X, Shield } from "lucide-react";
import { CRISIS_RESOURCES, type CrisisLevel } from "@/lib/crisis-detection";

interface CrisisBannerProps {
  level: Exclude<CrisisLevel, "none">;
  onDismiss: () => void;
}

export function CrisisBanner({ level, onDismiss }: CrisisBannerProps) {
  const r = CRISIS_RESOURCES[level];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg"
      role="alert"
      aria-live="polite"
    >
      <div className="bg-gradient-to-br from-red-950/95 to-rose-950/95 backdrop-blur-xl border border-red-400/30 rounded-2xl shadow-2xl shadow-red-500/20 overflow-hidden">
        <div className="flex items-start gap-3 p-5">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-red-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-100 mb-1">
              {r.title}
            </h3>
            <p className="text-xs text-red-100/80 leading-relaxed">
              {r.body}
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-red-200/60" />
          </button>
        </div>

        <div className="px-5 pb-5 space-y-2">
          {r.hotlines.map((h) => (
            <div
              key={`${h.region}-${h.name}`}
              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-black/30 border border-red-300/10"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-red-100 truncate">
                  {h.name}
                </p>
                <p className="text-[10px] text-red-200/60">{h.region}</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/20 text-red-100 text-xs font-medium flex-shrink-0">
                <Phone className="w-3 h-3" />
                {h.contact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
