import Anthropic from "@anthropic-ai/sdk";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { rateLimit, getClientIp, rlKey, LIMITS } from "@/lib/rate-limit";
import { checkHoneypot } from "@/lib/honeypot";

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

// Generic "limit reached" reply we return for honeypot + rate-limit hits, so
// bots don't learn to differentiate "you've been caught" from "free trial used up".
const SOFT_LIMIT_REPLY = {
  reply:
    "I'm really enjoying our conversation! To keep going and let me remember everything about you, create a free account. I promise it's worth it.",
  limitReached: true,
};

export async function POST(request: Request) {
  try {
    // 1. IP rate-limit — guest-chat is unauthenticated, the easiest abuse surface.
    const ip = getClientIp(request);
    const rl = await rateLimit(
      rlKey("guest", ip),
      LIMITS.guest.max,
      LIMITS.guest.windowMs
    );
    if (!rl.ok) {
      return NextResponse.json(SOFT_LIMIT_REPLY, { status: 200 });
    }

    const body = await request.json();
    const { messages } = body;

    // 2. Honeypot check — bots filling hidden fields. Soft-fail to avoid signal.
    const hp = checkHoneypot(body);
    if (!hp.ok) return NextResponse.json(SOFT_LIMIT_REPLY, { status: 200 });

    if (!Array.isArray(messages) || messages.length > 8) {
      return NextResponse.json(SOFT_LIMIT_REPLY, { status: 200 });
    }

    const MAX_MSG_CHARS = 2000;
    const MAX_TOTAL_CHARS = 8000;
    let totalChars = 0;
    for (const m of messages) {
      if (
        !m ||
        typeof m.content !== "string" ||
        (m.role !== "user" && m.role !== "assistant") ||
        m.content.length > MAX_MSG_CHARS
      ) {
        return NextResponse.json({ error: "invalid_message" }, { status: 400 });
      }
      totalChars += m.content.length;
    }
    if (totalChars > MAX_TOTAL_CHARS) {
      return NextResponse.json({ error: "messages_too_long" }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
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
    Sentry.captureException(error, { tags: { route: "guest-chat" } });
    console.error("Guest chat error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
