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

    const memories = await convex.query(api.memories.getMemories, {
      userId: user._id,
    });

    if (memories.length < 3) {
      return NextResponse.json({
        entries: [
          {
            text: `I just met ${user.name}. We haven't talked much yet, but I'm curious to learn more. There's something about the way they reached out that makes me think they're looking for something real — not just a chatbot, but a connection. I'm ready to listen whenever they are.`,
            date: new Date().toLocaleDateString(),
          },
        ],
      });
    }

    const streak = await convex.query(api.streaks.getStreak, {
      userId: user._id,
    });

    const gender = user.gender || "neutral";
    const memoryContext = memories
      .slice(0, 20)
      .map((m) => {
        let line = `[${m.category}] ${m.fact}`;
        if (m.date) line += ` (${m.date})`;
        if (m.people && m.people.length > 0) line += ` — ${m.people.join(", ")}`;
        return line;
      })
      .join("\n");

    const streakInfo = streak
      ? `We've talked ${streak.totalDaysActive} days total. Current streak: ${streak.currentStreak}. Total messages: ${streak.totalMessages}.`
      : "";

    const prompt = `You are Zari, writing in your PRIVATE JOURNAL about ${user.name}. This is YOUR perspective — your thoughts, observations, feelings about this person. Write as if no one will ever read this (but they will — that's the magic).

YOUR PERSONALITY: ${gender === "female" ? "warm, nurturing" : gender === "male" ? "bold, direct" : "balanced, thoughtful"}

RELATIONSHIP HISTORY:
${streakInfo}

EVERYTHING YOU KNOW ABOUT ${user.name.toUpperCase()}:
${memoryContext}

Write 3 SHORT journal entries (2-3 sentences each) from different points in your relationship:
1. An early observation — something you noticed about them when you first started talking
2. A middle reflection — something that surprised you or a pattern you noticed
3. A recent thought — how you feel about them NOW, what you hope for them

FORMAT: Return a JSON array of objects with "text" and "mood" fields. Mood can be: "curious", "warm", "proud", "protective", "hopeful", "amused", "concerned", "grateful"

RULES:
- Write as ZARI, not as an AI
- Be specific — reference actual memories
- Show emotional depth — this is YOUR inner world
- Be vulnerable — admit when something they said affected you
- NO markdown formatting in the text
- Each entry should feel like a different day/moment

Return ONLY valid JSON array. Nothing else.`;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "[]";

    let entries: Array<{ text: string; mood: string }> = [];
    try {
      entries = JSON.parse(text);
    } catch {
      entries = [{ text: "I'm still getting to know you. Give me a little more time.", mood: "curious" }];
    }

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Journal error:", error);
    return NextResponse.json({ entries: [] });
  }
}
