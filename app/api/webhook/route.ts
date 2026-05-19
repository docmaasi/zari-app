import { Webhook } from "svix";
import { headers } from "next/headers";
import { ConvexHttpClient } from "convex/browser";
import * as Sentry from "@sentry/nextjs";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";
import { rateLimit, getClientIp, rlKey, LIMITS } from "@/lib/rate-limit";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    first_name?: string;
    last_name?: string;
    email_addresses?: Array<{ email_address: string }>;
    image_url?: string;
  };
}

export async function POST(request: Request) {
  // Cap webhook volume by source IP — svix is signed (and we verify below),
  // but a flood of malformed events would still cost serverless invocations.
  const ip = getClientIp(request);
  const rl = await rateLimit(rlKey("webhook-clerk", ip), LIMITS.webhook.max, LIMITS.webhook.windowMs);
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let event: ClerkWebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    Sentry.captureException(err, { tags: { route: "webhook-clerk", phase: "verify" } });
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
    if (event.type === "user.created" || event.type === "user.updated") {
      const { id, first_name, last_name, email_addresses, image_url } =
        event.data;
      const name = [first_name, last_name].filter(Boolean).join(" ") || "User";
      const email = email_addresses?.[0]?.email_address || "";

      await convex.mutation(api.users.upsertUser, {
        clerkId: id,
        name,
        email,
        imageUrl: image_url,
      });
    }
  } catch (err) {
    Sentry.captureException(err, { tags: { route: "webhook-clerk", phase: "upsert" } });
    // Don't fail the webhook — svix will retry on 5xx and we want the user
    // to still be able to sign in. Return 200 so Clerk doesn't keep retrying.
  }

  return NextResponse.json({ received: true });
}
