"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";

export function ConnectionStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    setIsOffline(!navigator.onLine);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-16 left-0 right-0 z-50 px-4 py-2"
        >
          <div className="max-w-md mx-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-300">
                You&apos;re offline. Zari needs the internet to chat.
              </span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
