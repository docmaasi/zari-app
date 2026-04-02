import { Webhook } from "svix";
import { headers } from "next/headers";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

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
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

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

  return NextResponse.json({ received: true });
}
