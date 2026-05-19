import type { ErrorEvent, EventHint } from "@sentry/nextjs";

/**
 * Scrub PII out of Sentry events before they leave the device/server.
 *
 * What we drop:
 *   - Authorization / Cookie / svix-* request headers (auth tokens, webhooks)
 *   - Request bodies (chat messages contain user content)
 *   - Query params named `token`, `key`, `secret`, `signature`
 *   - User email / IP in user context (Sentry can group by id alone)
 *
 * Errors still group correctly because we keep stack traces + message intact.
 */

const SENSITIVE_HEADER_NAMES = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "x-clerk-auth",
  "svix-id",
  "svix-signature",
  "svix-timestamp",
  "stripe-signature",
  "x-real-ip",
  "x-forwarded-for",
  "cf-connecting-ip",
]);

const SENSITIVE_QUERY_KEYS = ["token", "key", "secret", "signature", "code", "session"];

function scrubHeaders(headers: Record<string, unknown> | undefined) {
  if (!headers) return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(headers)) {
    out[k] = SENSITIVE_HEADER_NAMES.has(k.toLowerCase()) ? "[scrubbed]" : v;
  }
  return out;
}

function scrubQueryString(qs: string | undefined) {
  if (!qs) return qs;
  try {
    const params = new URLSearchParams(qs);
    for (const key of SENSITIVE_QUERY_KEYS) {
      if (params.has(key)) params.set(key, "[scrubbed]");
    }
    return params.toString();
  } catch {
    return "[scrubbed]";
  }
}

export function scrubEvent(event: ErrorEvent, _hint?: EventHint): ErrorEvent | null {
  // Strip request body — chat messages, mood entries, journal text live here
  if (event.request) {
    event.request = {
      ...event.request,
      data: undefined,
      cookies: undefined,
      headers: scrubHeaders(event.request.headers),
      query_string: scrubQueryString(event.request.query_string as string | undefined),
    };
  }

  // Keep `id` (so we can correlate without leaking identity), strip everything else.
  if (event.user) {
    event.user = { id: event.user.id };
  }

  // Best-effort scrub: tag values are usually safe, but the message can still
  // contain a leaked email/token. Strip obvious email-shaped strings.
  if (event.message) {
    event.message = event.message.replace(
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
      "[email]"
    );
  }

  return event;
}
