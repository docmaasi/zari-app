"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { AlertCircle } from "lucide-react";

/**
 * Auto sign-out after 15 minutes of inactivity. Floating warning at
 * 14 min, forced sign-out + redirect to /sign-in at 15 min.
 *
 * Self-no-ops when Clerk reports the user is not signed in, so
 * cheap to mount unconditionally in the root layout.
 */

const WARN_AT_MS = 14 * 60 * 1000;
const LOGOUT_AT_MS = 15 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"] as const;

export function IdleTimeout(): React.ReactNode {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const lastActivityRef = useRef(Date.now());
  const [warned, setWarned] = useState(false);
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    if (!isSignedIn || signedOut) return;

    const reset = (): void => {
      lastActivityRef.current = Date.now();
      setWarned(false);
    };
    const onVisibility = (): void => {
      if (document.visibilityState === "visible") reset();
    };

    for (const evt of ACTIVITY_EVENTS) {
      window.addEventListener(evt, reset, { passive: true });
    }
    document.addEventListener("visibilitychange", onVisibility);

    const interval = window.setInterval(() => {
      const idleMs = Date.now() - lastActivityRef.current;
      if (idleMs >= LOGOUT_AT_MS) {
        setSignedOut(true);
        void signOut({ redirectUrl: "/sign-in?reason=idle" }).catch(() => {});
        return;
      }
      if (idleMs >= WARN_AT_MS && !warned) {
        setWarned(true);
      }
    }, 5_000);

    return () => {
      for (const evt of ACTIVITY_EVENTS) {
        window.removeEventListener(evt, reset);
      }
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(interval);
    };
  }, [isSignedIn, signOut, signedOut, warned]);

  if (!isSignedIn || signedOut || !warned) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-4 right-4 z-[9999] max-w-sm rounded-xl border border-amber-500/40 bg-amber-500/10 backdrop-blur px-4 py-3 shadow-2xl flex items-start gap-2"
    >
      <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
      <p className="text-sm text-amber-100">
        Signing you out in 60 seconds due to inactivity. Move your mouse to stay.
      </p>
    </div>
  );
}
