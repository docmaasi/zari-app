import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { detectBot } from "@/lib/bot-detection";

// Public surfaces — no Clerk session required. Anything else is auth-gated.
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
  "/api/guest-chat(.*)",
  "/api/demo-tts(.*)",
  "/api/stripe/webhook(.*)",
  "/api/cron(.*)",
  "/pricing",
  "/ai-companion",
  "/ai-friend-spanish",
  "/ai-that-remembers",
  "/privacy",
  "/terms",
  "/cookies",
  "/robots.txt",
  "/sitemap.xml",
]);

// API routes that accept POST/PUT/DELETE — these need Origin/Referer checks
// to prevent cross-site CSRF.
const isStateChangingApi = createRouteMatcher(["/api/(.*)"]);

// Webhook endpoints — signed by the caller (svix, stripe), so we MUST skip
// Origin checks (request comes from a server, not a browser).
const isWebhook = createRouteMatcher([
  "/api/webhook(.*)",
  "/api/stripe/webhook(.*)",
  "/api/cron(.*)",
]);

// Marketing / SEO crawler-visible surfaces — we want Googlebot here.
const isCrawlableMarketing = createRouteMatcher([
  "/",
  "/pricing",
  "/privacy",
  "/terms",
  "/cookies",
  "/ai-companion",
  "/ai-friend-spanish",
  "/ai-that-remembers",
  "/robots.txt",
  "/sitemap.xml",
]);

export default clerkMiddleware(async (auth, request) => {
  const ua = request.headers.get("user-agent");
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  // 1. Bot defense — block automation tools on every surface EXCEPT marketing
  //    pages (so Googlebot etc. still index us). API routes always block bad
  //    bots regardless of marketing-page status.
  const botCheck = detectBot(ua);
  const isApi = url.pathname.startsWith("/api");
  if (botCheck.isBot && !botCheck.isGoodBot) {
    if (isApi || !isCrawlableMarketing(request)) {
      return new NextResponse(
        JSON.stringify({ error: "Forbidden" }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "X-Block-Reason": botCheck.reason || "bot",
          },
        }
      );
    }
  }

  // 2. CSRF / cross-origin defense — for state-changing API calls, verify the
  //    request originated from our own site. Skips webhooks (server-to-server,
  //    signed) and GET requests (idempotent + cached). Allows missing headers
  //    only for same-origin server-side fetches.
  const writes = method === "POST" || method === "PUT" || method === "DELETE" || method === "PATCH";
  if (writes && isStateChangingApi(request) && !isWebhook(request)) {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const host = request.headers.get("host");

    if (origin || referer) {
      const source = origin || referer || "";
      let ok = false;
      try {
        const sourceHost = new URL(source).host;
        ok = sourceHost === host;
      } catch {
        ok = false;
      }
      if (!ok) {
        return new NextResponse(
          JSON.stringify({ error: "Cross-origin request blocked" }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
    // If both headers are missing, allow (server-side / curl-style fetch). The
    // per-route rate limiter and per-user auth then take over as the next
    // line of defense.
  }

  // 3. Standard auth gate — non-public routes require a Clerk session.
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
