"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { X, Download, Share2 } from "lucide-react";
import { ZariLogo } from "@/components/zari-logo";

interface ShareCardProps {
  message: string;
  userName: string;
  onClose: () => void;
}

export function ShareCard({ message, userName, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    const text = `Zari said to me:\n\n"${message}"\n\nTalk to Zari at https://www.zari.help`;
    if (navigator.share) {
      await navigator.share({ text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  const handleDownload = async () => {
    // Create a canvas from the card
    const card = cardRef.current;
    if (!card) return;

    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(card, {
        backgroundColor: "#06060e",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = "zari-moment.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // Fallback: just copy text
      handleShare();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-sm w-full"
      >
        {/* The shareable card */}
        <div
          ref={cardRef}
          className="bg-gradient-to-br from-[#0a0a1a] via-[#14142a] to-[#1a0a2a] rounded-3xl p-8 border border-white/10 mb-4"
        >
          <div className="flex items-center gap-2 mb-6">
            <ZariLogo size={28} />
            <span className="text-sm font-semibold text-zari-text tracking-wide">
              Zari
            </span>
            <span className="text-[10px] text-zari-muted ml-auto">
              zari.help
            </span>
          </div>

          <p className="text-zari-text text-base leading-relaxed mb-6">
            &ldquo;{message}&rdquo;
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-zari-muted">
              Zari said this to {userName}
            </span>
            <ZariLogo size={20} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-zari-accent text-white text-sm font-medium hover:bg-zari-accent/90 transition-all"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-zari-muted text-sm hover:text-zari-text transition-all"
          >
            <Download className="w-4 h-4" />
            Save Image
          </button>
          <button
            onClick={onClose}
            className="p-3 rounded-xl border border-white/10 text-zari-muted hover:text-zari-text transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
