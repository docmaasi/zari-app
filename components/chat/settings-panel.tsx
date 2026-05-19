"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings, Heart, Sparkles, Zap, Crown, ExternalLink, Gift, Copy, Check, ArrowRight, LogOut, Download, Trash2, AlertTriangle } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { languageList } from "@/lib/languages";
import { getVoicesForGender, getDefaultVoiceId } from "@/lib/elevenlabs-voices";
import { Questionnaire } from "./questionnaire";
import { useSubscription } from "@/lib/use-subscription";

interface SettingsPanelProps {
  userId: Id<"users">;
  currentName: string;
  currentNamePronunciation?: string;
  currentPersonality: string;
  currentLanguage: string;
  currentVoiceId?: string;
  onClose: () => void;
}

const personalities = [
  { value: "warm", label: "Warm", icon: Heart, color: "text-zari-pink" },
  {
    value: "neutral",
    label: "Balanced",
    icon: Sparkles,
    color: "text-zari-accent",
  },
  { value: "bold", label: "Bold", icon: Zap, color: "text-zari-blue" },
];

export function SettingsPanel({
  userId,
  currentName,
  currentNamePronunciation,
  currentPersonality,
  currentLanguage,
  currentVoiceId,
  onClose,
}: SettingsPanelProps) {
  const [name, setName] = useState(currentName);
  const [namePronunciation, setNamePronunciation] = useState(
    currentNamePronunciation || ""
  );
  const [personality, setPersonality] = useState(currentPersonality);
  const [language, setLanguage] = useState(currentLanguage);
  const [voiceId, setVoiceId] = useState(
    currentVoiceId || getDefaultVoiceId(currentPersonality)
  );
  const [saving, setSaving] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [orbColor, setOrbColor] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("zari-orb-color") || "purple";
    }
    return "purple";
  });
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [copied, setCopied] = useState(false);
  const getOrCreateCode = useMutation(api.referrals.getOrCreateCode);
  const { isPlusUser, plan } = useSubscription();
  const { signOut } = useClerk();
  const updatePreferences = useMutation(api.users.updatePreferences);
  const availableVoices = getVoicesForGender(personality);

  const handleSave = async () => {
    setSaving(true);
    await updatePreferences({
      userId,
      name,
      namePronunciation: namePronunciation || undefined,
      personality,
      language,
      voiceId,
    });
    setSaving(false);
    window.location.reload();
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/account/export");
      if (!res.ok) throw new Error("export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `zari-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Could not export your data. Please try again or email support@zari.help.");
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) throw new Error("delete failed");
      await signOut({ redirectUrl: "/" });
    } catch {
      setDeleting(false);
      alert("Could not delete your account. Please email support@zari.help and we'll handle it.");
    }
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
            placeholder="How it's spelled"
            className="w-full px-4 py-3 rounded-xl bg-zari-surface2 border border-white/5 text-zari-text focus:outline-none focus:border-zari-accent transition-colors"
          />
        </div>

        {/* Pronunciation */}
        <div>
          <label className="block text-sm font-medium text-zari-text mb-1">
            How to Say Your Name
          </label>
          <p className="text-xs text-zari-muted mb-2">
            Type it how it sounds so Zari says it right. Leave blank if it&apos;s
            straightforward.
          </p>
          <input
            type="text"
            value={namePronunciation}
            onChange={(e) => setNamePronunciation(e.target.value)}
            placeholder="e.g. See-oh-MAR-ah for Xiomara"
            className="w-full px-4 py-3 rounded-xl bg-zari-surface2 border border-white/5 text-zari-text focus:outline-none focus:border-zari-accent transition-colors placeholder:text-zari-muted/40"
          />
        </div>

        {/* Personal Questionnaire */}
        <div>
          <button
            onClick={() => setShowQuestionnaire(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-all"
          >
            <div className="text-left">
              <span className="text-sm text-zari-text font-medium block">
                Update Personal Details
              </span>
              <span className="text-xs text-zari-muted">
                Redo the private questionnaire so Zari knows you better
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-zari-muted" />
          </button>
        </div>

        {/* Personality */}
        <div>
          <label className="block text-sm font-medium text-zari-text mb-3">
            Zari&apos;s Personality
          </label>
          <div className="flex gap-2">
            {personalities.map((p) => (
              <button
                key={p.value}
                onClick={() => setPersonality(p.value)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  personality === p.value
                    ? "border-zari-accent bg-zari-accent/10"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                <p.icon className={`w-5 h-5 ${p.color}`} />
                <span className="text-xs font-medium text-zari-text">
                  {p.label}
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

        {/* Voice Selection — everyone gets ElevenLabs */}
        <div>
          <label className="block text-sm font-medium text-zari-text mb-2">
            Zari&apos;s Voice
          </label>
          <p className="text-xs text-zari-muted mb-3">
            Premium Zari Voices — changes with personality
          </p>
          <div className="space-y-2">
            {availableVoices.map((voice) => (
              <button
                key={voice.id}
                onClick={() => setVoiceId(voice.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  voiceId === voice.id
                    ? "border-zari-accent bg-zari-accent/10"
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex-1">
                  <span className="text-sm font-medium text-zari-text">
                    {voice.label}
                  </span>
                  <span className="block text-xs text-zari-muted">
                    {voice.description} · {voice.accent}
                  </span>
                </div>
                {voiceId === voice.id && (
                  <div className="w-2 h-2 rounded-full bg-zari-accent" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Subscription */}
        <div>
          <label className="block text-sm font-medium text-zari-text mb-3">
            Subscription
          </label>
          {isPlusUser ? (
            <div className="p-4 rounded-xl bg-zari-accent/10 border border-zari-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-zari-accent" />
                <span className="text-sm font-semibold text-zari-text">
                  Zari Plus
                </span>
                <span className="text-xs text-zari-accent px-2 py-0.5 rounded-full bg-zari-accent/20">
                  {plan === "plus_yearly" ? "Yearly" : "Monthly"}
                </span>
              </div>
              <p className="text-xs text-zari-muted mb-3">
                Unlimited messages, memory, all languages, premium voices.
              </p>
              <button
                onClick={async () => {
                  setPortalLoading(true);
                  try {
                    const res = await fetch("/api/stripe/portal", {
                      method: "POST",
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  } catch {
                    setPortalLoading(false);
                  }
                }}
                disabled={portalLoading}
                className="flex items-center gap-1.5 text-xs text-zari-accent hover:text-zari-accent-light transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                {portalLoading ? "Loading..." : "Manage Billing"}
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-black/20 border border-white/5">
              <p className="text-sm text-zari-text font-medium mb-1">
                Free Plan
              </p>
              <p className="text-xs text-zari-muted mb-3">
                5 messages/day, English only, no memory.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zari-accent text-white text-xs font-semibold hover:bg-zari-accent/90 transition-all"
              >
                <Crown className="w-3 h-3" />
                Upgrade to Plus
              </Link>
            </div>
          )}
        </div>

        {/* Orb Color */}
        <div>
          <label className="block text-sm font-medium text-zari-text mb-3">
            Zari&apos;s Color
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "purple", color: "bg-gradient-to-br from-[#ff3d8a] to-[#ff7eb1]" },
              { value: "pink", color: "bg-gradient-to-br from-[#ff3d8a] to-[#ff6b9d]" },
              { value: "blue", color: "bg-gradient-to-br from-[#5cf1ff] to-[#60d5fa]" },
              { value: "green", color: "bg-gradient-to-br from-[#10b981] to-[#34d399]" },
              { value: "gold", color: "bg-gradient-to-br from-[#f59e0b] to-[#fbbf24]" },
              { value: "red", color: "bg-gradient-to-br from-[#ef4444] to-[#f87171]" },
            ].map((c) => (
              <button
                key={c.value}
                onClick={() => {
                  localStorage.setItem("zari-orb-color", c.value);
                  setOrbColor(c.value);
                }}
                className={`w-10 h-10 rounded-xl ${c.color} border-2 transition-all ${
                  orbColor === c.value
                    ? "border-white scale-110"
                    : "border-transparent hover:border-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Referral */}
        <div>
          <label className="block text-sm font-medium text-zari-text mb-3">
            Invite a Friend
          </label>
          <div className="p-4 rounded-xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-zari-pink" />
              <span className="text-sm text-zari-text font-medium">
                Share Zari
              </span>
            </div>
            <p className="text-xs text-zari-muted mb-3">
              Give a friend your referral code. When they sign up, you both get
              a week of Plus free.
            </p>
            {referralCode ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-zari-surface2 text-sm text-zari-accent font-mono tracking-wider">
                  {referralCode}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Join me on Zari! Use my code ${referralCode} at https://www.zari.help`
                    );
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="p-2 rounded-lg bg-zari-accent/20 text-zari-accent hover:bg-zari-accent/30 transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={async () => {
                  const code = await getOrCreateCode({ userId });
                  setReferralCode(code);
                }}
                className="text-xs text-zari-accent hover:text-zari-accent-light transition-colors"
              >
                Get your referral code
              </button>
            )}
          </div>
        </div>

        {/* Your data — export & delete */}
        <div>
          <label className="block text-sm font-medium text-zari-text mb-3">
            Your Data
          </label>
          <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-3">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-zari-surface2 hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-zari-muted" />
                <span className="text-sm text-zari-text">
                  {exporting ? "Preparing..." : "Download my data"}
                </span>
              </div>
              <span className="text-[10px] text-zari-muted/60">JSON</span>
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-zari-surface2 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-400/80" />
              <span className="text-sm text-red-400/90">Delete my account</span>
            </button>

            <p className="text-[11px] text-zari-muted/60 leading-relaxed">
              Exporting downloads every memory, conversation, mood entry, and
              setting Zari has for you. Deleting removes all of it — Zari will
              forget you completely. This cannot be undone.
            </p>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zari-surface border border-red-500/30 rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
              </div>
              <h3 className="text-base font-semibold text-zari-text text-center mb-2">
                Delete your account?
              </h3>
              <p className="text-xs text-zari-muted text-center mb-5 leading-relaxed">
                This permanently removes all your memories, conversations,
                journal entries, and settings. Zari will not remember you.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-zari-muted hover:text-zari-text transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/80 text-white text-sm font-medium hover:bg-red-500 transition-colors disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete forever"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-zari-accent text-white font-medium hover:bg-zari-accent/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save & Reload"}
        </button>
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          className="w-full py-3 rounded-xl border border-white/10 text-zari-muted font-medium hover:text-red-400 hover:border-red-400/30 transition-colors flex items-center justify-center gap-2 mt-2"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>

      {/* Questionnaire overlay */}
      <AnimatePresence>
        {showQuestionnaire && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute inset-0 bg-zari-surface z-10 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="font-semibold text-zari-text">
                Update Personal Details
              </h2>
              <button
                onClick={() => setShowQuestionnaire(false)}
                className="p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-zari-muted" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Questionnaire
                userId={userId}
                userName={currentName}
                onComplete={() => setShowQuestionnaire(false)}
                isRedo
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
