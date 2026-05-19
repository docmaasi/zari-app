/**
 * Honeypot anti-bot helpers.
 *
 * Two-prong defense per public form/endpoint:
 *   1. A hidden form field bots auto-fill (`hp_*`). Humans never touch it.
 *   2. A minimum-fill-time: if a form submits in < N ms, it's almost certainly
 *      automated (real humans take seconds to type even a short message).
 *
 * Server-side validators here are intentionally silent: when we detect a bot,
 * we return a synthetic success response instead of 4xx, so the bot's auto-
 * tuner doesn't learn what we look for.
 */

export const HONEYPOT_FIELD = "hp_company_url";
export const HONEYPOT_TS_FIELD = "hp_started_at";
export const MIN_FILL_MS = 1500;

export interface HoneypotPayload {
  [HONEYPOT_FIELD]?: unknown;
  [HONEYPOT_TS_FIELD]?: unknown;
}

export interface HoneypotResult {
  ok: boolean;
  reason?: "filled" | "too-fast" | "missing-timestamp";
}

/**
 * Returns ok=false when the request payload looks like a bot. Caller chooses
 * the response shape — typically: pretend success but skip downstream work.
 */
export function checkHoneypot(payload: HoneypotPayload | null | undefined): HoneypotResult {
  if (!payload || typeof payload !== "object") return { ok: true };

  // Filled honeypot = bot. Real users cannot see the field.
  const hp = payload[HONEYPOT_FIELD];
  if (typeof hp === "string" && hp.trim().length > 0) {
    return { ok: false, reason: "filled" };
  }

  // Missing timestamp on a form that should have one = suspicious
  const ts = payload[HONEYPOT_TS_FIELD];
  if (ts === undefined) return { ok: true }; // not enforced if not provided
  const startedAt = typeof ts === "number" ? ts : Number(ts);
  if (!Number.isFinite(startedAt)) {
    return { ok: false, reason: "missing-timestamp" };
  }

  const elapsed = Date.now() - startedAt;
  if (elapsed < MIN_FILL_MS) {
    return { ok: false, reason: "too-fast" };
  }

  return { ok: true };
}
