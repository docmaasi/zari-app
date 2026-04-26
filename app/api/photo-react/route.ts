import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("photo") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No photo" }, { status: 400 });
    }

    // Allowlist MIME and cap size — prevents loading a 100MB file into memory
    // or sending unsupported content to Claude vision.
    const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json(
        { error: "unsupported_image", message: "Photo must be JPEG, PNG, WebP, or GIF." },
        { status: 400 }
      );
    }
    if (file.size > MAX_PHOTO_BYTES) {
      return NextResponse.json(
        { error: "image_too_large", message: "Photos must be under 5 MB." },
        { status: 413 }
      );
    }

    const user = await convex.query(api.users.getByClerkId, { clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check subscription — photo reactions are Plus-only
    const subscription = await convex.query(
      api.subscriptions.getSubscription,
      { clerkId }
    );
    if (subscription?.status !== "active") {
      return NextResponse.json(
        { error: "plus_required", message: "Photo reactions are a Plus feature." },
        { status: 403 }
      );
    }

    const gender = user.gender || "neutral";
    const lang = user.language || "en";
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mediaType = file.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            {
              type: "text",
              text: `You are Zari, ${user.name}'s AI companion. ${
                gender === "female" ? "Warm and nurturing." :
                gender === "male" ? "Bold and direct." :
                "Balanced and thoughtful."
              }

React to this photo as a close friend would. Be specific about what you SEE — colors, expressions, places, objects. Be genuine, warm, and personal. 2-3 sentences max. NO markdown.
${lang !== "en" ? `Respond in language code "${lang}".` : ""}`,
            },
          ],
        },
      ],
    });

    const reaction = response.content[0].type === "text"
      ? response.content[0].text
      : "I love that you shared this with me.";

    return NextResponse.json({ reaction });
  } catch (error) {
    console.error("Photo react error:", error);
    return NextResponse.json(
      { error: "Failed to process photo" },
      { status: 500 }
    );
  }
}
