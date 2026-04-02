"use client";

import { motion } from "framer-motion";
import { languageList } from "@/lib/languages";

export function LanguageShowcase() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {languageList.map((lang, i) => (
        <motion.div
          key={lang.code}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="bg-zari-surface rounded-xl border border-white/5 p-3 text-center hover:border-zari-accent/30 transition-colors"
        >
          <div className="text-2xl mb-1">{lang.flag}</div>
          <div className="text-xs font-medium text-zari-text">{lang.name}</div>
          <div className="text-[10px] text-zari-muted mt-1 truncate">
            {lang.greeting}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
