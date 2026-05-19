"use client";

import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

const KEY = "zari-cookie-consent";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function readConsent(): "all" | "essential" | null {
  if (typeof document === "undefined") return null;
  try {
    const ls = localStorage.getItem(KEY);
    if (ls === "all" || ls === "essential") return ls;
  } catch {
    /* private mode */
  }
  const m = document.cookie.match(/(?:^|;\s*)zari-cookie-consent=([^;]+)/);
  if (m?.[1] === "all" || m?.[1] === "essential") return m[1] as "all" | "essential";
  return null;
}

function writeConsent(value: "all" | "essential"): void {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* private mode */
  }
  document.cookie = `${KEY}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

/**
 * GDPR / CCPA cookie consent banner. Mounts client-side only.
 * Persists choice to localStorage + 1-year cookie.
 */
export function CookieConsent(): React.ReactNode {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readConsent() === null) setVisible(true);
  }, []);

  if (!visible) return null;
  const choose = (value: "all" | "essential") => {
    writeConsent(value);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-[9998] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl px-4 py-3 sm:px-5 sm:py-4 sm:max-w-3xl sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:inset-x-auto dark:bg-slate-900/95 dark:border-slate-700"
    >
      <div className="flex items-start gap-3">
        <Cookie className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 dark:text-indigo-400" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            We use cookies to make this app work
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            Essential cookies keep you signed in and remember your preferences. We never sell your data.
          </p>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
            <button
              onClick={() => choose("essential")}
              className="inline-flex items-center justify-center min-h-10 px-4 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Essential only
            </button>
            <button
              onClick={() => choose("all")}
              className="inline-flex items-center justify-center min-h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white shadow-sm"
            >
              Accept all
            </button>
          </div>
        </div>
        <button
          onClick={() => choose("essential")}
          aria-label="Close"
          className="inline-flex items-center justify-center min-h-9 min-w-9 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
