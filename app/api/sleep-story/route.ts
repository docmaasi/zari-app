import { auth } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getAuthenticatedConvex } from "@/lib/convex-server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const convex = await getAuthenticatedConvex();
    if (!convex) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await convex.query(api.users.getByClerkId, { clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const memories = await convex.query(api.memories.getMemories, {
      userId: user._id,
    });

    const gender = user.gender || "neutral";
    const lang = user.language || "en";

    const interests = memories
      .filter((m) => m.category === "interests" || m.category === "preferences")
      .slice(0, 5)
      .map((m) => m.fact)
      .join(", ");

    const prompt = `You are Zari, telling ${user.name} a personalized bedtime story. Speak slowly, calmly, soothingly.

PERSONALITY: ${gender === "female" ? "warm, gentle, like a lullaby" : gender === "male" ? "deep, calm, grounding" : "soft, peaceful, meditative"}

USER'S INTERESTS: ${interests || "nature, peace, adventure"}

Write a SHORT bedtime story (150-200 words) that:
- Uses calming, slow imagery (starlight, warm blankets, gentle rain, soft winds)
- Weaves in something personal from their interests
- Gets progressively slower and sleepier in tone
- Ends with a gentle "goodnight" that feels like a warm hug
- Uses "..." for pauses to create a sleepy rhythm

NO markdown. Written to be spoken aloud. This is for falling asleep.
${lang !== "en" ? `Write ENTIRELY in language code "${lang}".` : ""}`;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20250514",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const story = response.content[0].type === "text"
      ? response.content[0].text
      : null;

    return NextResponse.json({ story });
  } catch (error) {
    console.error("Sleep story error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
