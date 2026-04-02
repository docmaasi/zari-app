import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const SYSTEM_PROMPT = `You are Zari, a warm, intelligent AI companion. This is a guest trying you for the first time — they haven't signed up yet.

RULES:
- Be genuinely warm, engaging, and impressive in these first few messages
- Show your personality — be insightful, ask smart follow-up questions, connect dots
- Keep responses to 2-3 sentences max since this is a quick trial
- NEVER use markdown formatting — speak naturally like a real conversation
- After 2-3 exchanges, naturally mention that you'd love to remember this conversation and get to know them better if they create a free account
- Don't be pushy about signing up — be genuine about wanting to continue the connection
- Show that you're different from other chatbots by being specific, empathetic, and thoughtful`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || messages.length > 8) {
      return NextResponse.json(
        { reply: "I'm really enjoying our conversation! To keep going and let me remember everything about you, create a free account. I promise it's worth it.", limitReached: true },
        { status: 200 }
      );
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const reply =
      response.content[0].type === "text"
        ? response.content[0].text
        : "Hey! I'd love to chat — try again?";

    const limitReached = messages.length >= 6;

    return NextResponse.json({ reply, limitReached });
  } catch (error) {
    console.error("Guest chat error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
