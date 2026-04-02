"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";
import { X, Settings, Heart, Sparkles, Zap } from "lucide-react";
import { languageList } from "@/lib/languages";

interface SettingsPanelProps {
  userId: Id<"users">;
  currentName: string;
  currentGender: string;
  currentLanguage: string;
  onClose: () => void;
}

const genders = [
  { value: "female", label: "Warm", icon: Heart, color: "text-zari-pink" },
  {
    value: "neutral",
    label: "Balanced",
    icon: Sparkles,
    color: "text-zari-accent",
  },
  { value: "male", label: "Bold", icon: Zap, color: "text-zari-blue" },
];

export function SettingsPanel({
  userId,
  currentName,
  currentGender,
  currentLanguage,
  onClose,
}: SettingsPanelProps) {
  const [name, setName] = useState(currentName);
  const [gender, setGender] = useState(currentGender);
  const [language, setLanguage] = useState(currentLanguage);
  const [saving, setSaving] = useState(false);
  const updatePreferences = useMutation(api.users.updatePreferences);

  const handleSave = async () => {
    setSaving(true);
    await updatePreferences({
      userId,
      name,
      gender,
      language,
    });
    setSaving(false);
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed inset-y-0 right-0 w-full max-w-md bg-zari-surface border-l border-white/5 z-50 flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-zari-accent" />
          <h2 className="font-semibold text-zari-text">Settings</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5 text-zari-muted" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-zari-text mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zari-surface2 border border-white/5 text-zari-text focus:outline-none focus:border-zari-accent transition-colors"
          />
        </div>

        {/* Personality */}
        <div>
          <label className="block text-sm font-medium text-zari-text mb-3">
            Zari&apos;s Personality
          </label>
          <div className="flex gap-2">
            {genders.map((g) => (
              <button
                key={g.value}
                onClick={() => setGender(g.value)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  gender === g.value
                    ? "border-zari-accent bg-zari-accent/10"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                <g.icon className={`w-5 h-5 ${g.color}`} />
                <span className="text-xs font-medium text-zari-text">
                  {g.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-zari-text mb-2">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zari-surface2 border border-white/5 text-zari-text focus:outline-none focus:border-zari-accent transition-colors"
          >
            {languageList.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-zari-accent text-white font-medium hover:bg-zari-accent/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save & Reload"}
        </button>
      </div>
    </motion.div>
  );
}
