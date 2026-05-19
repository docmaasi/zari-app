/**
 * In-memory sliding-window rate limiter for API routes.
 *
 * Notes for production:
 * - Vercel serverless functions get a fresh process per cold start; in-memory
 *   counters are best-effort, not authoritative. They still meaningfully blunt
 *   bursts from a single attacker IP within the same warm instance.
 * - When you want true cross-instance limits, set UPSTASH_REDIS_REST_URL +
 *   UPSTASH_REDIS_REST_TOKEN and we will swap to @upstash/ratelimit in a
 *   follow-up pass. Keeping the API surface stable here makes that swap
 *   non-breaking.
 */

import { LRUCache } from "lru-cache";

interface Bucket {
  count: number;
  resetAt: number;
}

const cache = new LRUCache<string, Bucket>({
  max: 10_000,
  ttl: 10 * 60 * 1000, // 10 minute upper bound; per-key ttl below
});

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetIn: number;
}

export async function rateLimit(
  key: string,
  max: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const existing = cache.get(key);

  if (!existing || existing.resetAt < now) {
    cache.set(
      key,
      { count: 1, resetAt: now + windowMs },
      { ttl: windowMs + 1000 }
    );
    return { ok: true, remaining: max - 1, resetIn: windowMs };
  }

  if (existing.count >= max) {
    return { ok: false, remaining: 0, resetIn: existing.resetAt - now };
  }

  existing.count++;
  return { ok: true, remaining: max - existing.count, resetIn: existing.resetAt - now };
}

/**
 * Extracts the best-available client IP from a Next.js Request. On Vercel the
 * canonical chain is `x-forwarded-for: <client>, <proxy>, <proxy>` — we want
 * the leftmost. Falls back through known reverse-proxy headers.
 */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  return "unknown";
}

/**
 * Build a rate-limit key namespaced by endpoint + identity. Identity falls
 * back to IP when there is no logged-in user.
 */
export function rlKey(scope: string, identity: string): string {
  return `${scope}:${identity}`;
}

/**
 * Common limits used across the app. Tune here, not per-route.
 *   chat       : burst protection on top of per-user daily quota
 *   guest      : aggressive — guest endpoints are the easiest to abuse
 *   auth       : auth-write endpoints (account delete, age confirm)
 *   trial      : the unauthenticated trial chat surface
 *   webhook    : svix/stripe — verified by signature, but still capped
 *   cron       : single trusted caller; high ceiling, just prevents stampede
 */
export const LIMITS = {
  chat: { max: 30, windowMs: 60_000 },
  extract: { max: 30, windowMs: 60_000 },
  proactive: { max: 6, windowMs: 60_000 },
  journal: { max: 6, windowMs: 60_000 },
  guest: { max: 8, windowMs: 60_000 },
  trial: { max: 6, windowMs: 60_000 },
  account: { max: 3, windowMs: 60_000 },
  voice: { max: 30, windowMs: 60_000 },
  photo: { max: 15, windowMs: 60_000 },
  tts: { max: 60, windowMs: 60_000 },
  webhook: { max: 120, windowMs: 60_000 },
  cron: { max: 4, windowMs: 60_000 },
} as const;
