import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import webpush from "web-push";

// Vercel cron entrypoint: hits this every few hours (configured in vercel.json).
// Header: `Authorization: Bearer ${CRON_SECRET}`.
//
// Pipeline:
//   1. Load fresh push-subscription candidates (those not notified in 24h).
//   2. For each, generate a short Haiku message (with memory + streak context).
//   3. Send via web-push. If the subscription is gone (410/404), prune it.
//   4. Mark notified so we don't re-spam within the window.

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const vapidPublic = process.env.VAPID_PUBLIC_KEY;
const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:support@zari.help";
if (vapidPublic && vapidPrivate) {
  webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);
}

// Vercel cron sends GET; keep POST as a manual trigger fallback.
export async function GET(request: Request) {
  return handle(request);
}
export async function POST(request: Request) {
  return handle(request);
}

async function handle(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!vapidPublic || !vapidPrivate) {
    return NextResponse.json(
      { error: "VAPID keys not configured" },
      { status: 500 }
    );
  }

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  // Convex internal-token: use the deploy-key based path. The internal queries
  // here check the `secret` arg against CRON_SECRET to gate access.
  const candidates = await convex.query(
    api.pushSubscriptions.listOutreachCandidates,
    { secret: cronSecret }
  );

  let sent = 0;
  let pruned = 0;

  for (const sub of candidates) {
    try {
      // Personality + light memory context per user is overkill for a push;
      // keep messages short and warm. The full proactive flow on app-open
      // still handles deeper engagement.
      const prompt = `You are Zari, an AI companion. Write ONE warm, intimate push-notification message (max 80 chars) to a user you haven't talked to recently. Be specific, gentle, curious. NO emojis. NO quotes. Just the text.`;

      const reply = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 60,
        messages: [{ role: "user", content: prompt }],
      });
      const text =
        reply.content[0]?.type === "text"
          ? reply.content[0].text.trim().slice(0, 100)
          : "Thinking about you. Whenever you're ready.";

      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify({
          title: "Zari",
          body: text,
          icon: "/icon-192.png",
          url: "/chat",
        })
      );

      await convex.mutation(api.pushSubscriptions.markNotified, {
        secret: cronSecret,
        subscriptionId: sub._id,
      });
      sent++;
    } catch (err: unknown) {
      const status = (err as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) {
        try {
          await convex.mutation(api.pushSubscriptions.deleteByEndpoint, {
            secret: cronSecret,
            endpoint: sub.endpoint,
          });
          pruned++;
        } catch {}
      }
    }
  }

  return NextResponse.json({ sent, pruned, total: candidates.length });
}
