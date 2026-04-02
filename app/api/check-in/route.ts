import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await convex.query(api.users.getByClerkId, { clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only Plus users get personalized check-ins with memories
    const subscription = await convex.query(
      api.subscriptions.getSubscription,
      { clerkId }
    );
    const isPlusUser = subscription?.status === "active";

    const memories = isPlusUser
      ? await convex.query(api.memories.getMemories, { userId: user._id })
      : [];

    const lang = user.language || "en";
    const gender = user.gender || "neutral";
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = [
      "Sunday", "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday",
    ][now.getDay()];

    let timeOfDay = "morning";
    if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
    if (hour >= 17) timeOfDay = "evening";

    const memoryContext =
      memories.length > 0
        ? memories
            .slice(0, 10)
            .map((m) => `[${m.category}] ${m.fact}`)
            .join("\n")
        : "No memories yet — this is a new user.";

    const prompt = `Generate a SHORT, warm check-in greeting (2-3 sentences max) for ${user.name}.

Context:
- It's ${dayOfWeek} ${timeOfDay}
- Personality style: ${gender === "female" ? "warm/nurturing" : gender === "male" ? "bold/direct" : "balanced/friendly"}
- User memories:\n${memoryContext}

Rules:
- Reference something specific from their memories if possible (a goal, an event, a person)
- Make it feel like a real friend checking in, not a generic greeting
- NO markdown formatting
- Keep it conversational and natural
${lang !== "en" ? `- Respond ENTIRELY in the language with code "${lang}"` : ""}`;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20250514",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const greeting =
      response.content[0].type === "text"
        ? response.content[0].text
        : null;

    return NextResponse.json({ greeting });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ greeting: null });
  }
}
