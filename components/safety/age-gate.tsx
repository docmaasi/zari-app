"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "convex/react";
import { useClerk } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Shield, AlertTriangle } from "lucide-react";

interface AgeGateProps {
  userId: Id<"users">;
  onConfirm: () => void;
}

export function AgeGate({ userId, onConfirm }: AgeGateProps) {
  const confirmAge = useMutation(api.users.confirmAge);
  const { signOut } = useClerk();
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!checked || submitting) return;
    setSubmitting(true);
    await confirmAge({ userId });
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0b12] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-zari-surface border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-zari-accent/10 border border-zari-accent/20 flex items-center justify-center">
            <Shield className="w-7 h-7 text-zari-accent" />
          </div>
        </div>

        <h1 className="text-xl font-semibold text-zari-text text-center mb-3">
          One quick check before we start
        </h1>

        <p className="text-sm text-zari-muted text-center leading-relaxed mb-6">
          Zari is a companion AI for adults. Talking with Zari can get personal,
          so we need to make sure you&apos;re 18 or older.
        </p>

        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 mb-6 flex gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/80 leading-relaxed">
            Zari is not a therapist, doctor, or crisis service. If you&apos;re in
            crisis, please call 988 (US), 116 123 (UK), or visit
            findahelpline.com.
          </p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer mb-6">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 w-4 h-4 rounded accent-zari-accent"
          />
          <span className="text-sm text-zari-text leading-relaxed">
            I&apos;m 18 or older and understand Zari is an AI companion, not a
            medical, legal, or mental-health professional.
          </span>
        </label>

        <button
          onClick={handleConfirm}
          disabled={!checked || submitting}
          className="w-full py-3 rounded-xl bg-zari-accent text-white font-medium hover:bg-zari-accent/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {submitting ? "Continuing..." : "Continue to Zari"}
        </button>

        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          className="w-full mt-3 py-2 text-xs text-zari-muted hover:text-zari-text transition-colors"
        >
          I&apos;m not 18 — take me back
        </button>
      </motion.div>
    </div>
  );
}
