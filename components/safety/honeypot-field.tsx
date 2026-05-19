"use client";

import { useEffect, useState } from "react";
import {
  HONEYPOT_FIELD,
  HONEYPOT_TS_FIELD,
} from "@/lib/honeypot";

interface HoneypotProps {
  /** Optional callback so parent can include the started-at timestamp in its
   *  payload. If not provided, fall back to a hidden input. */
  onMount?: (startedAt: number) => void;
}

/**
 * Hidden honeypot input plus a started-at timestamp emitter.
 *
 * Visually hidden from real users via off-screen positioning + ARIA + tabIndex.
 * Bots that walk the DOM and fill every text input will trip the trap.
 *
 * Usage:
 *   <HoneypotField onMount={(ts) => setStartedAt(ts)} />
 *   ...then on submit, include hp_company_url + hp_started_at in the payload.
 */
export function HoneypotField({ onMount }: HoneypotProps) {
  const [startedAt] = useState<number>(() => Date.now());

  useEffect(() => {
    onMount?.(startedAt);
  }, [onMount, startedAt]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-10000px",
        top: "auto",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        opacity: 0,
        pointerEvents: "none",
      }}
    >
      <label>
        Company URL (leave blank)
        <input
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
      <input
        type="hidden"
        name={HONEYPOT_TS_FIELD}
        defaultValue={String(startedAt)}
      />
    </div>
  );
}
