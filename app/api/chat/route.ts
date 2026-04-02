import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

function buildSystemPrompt(
  user: { name: string; gender?: string; language?: string },
  memories: Array<{
    category: string;
    fact: string;
    people?: string[];
    date?: string;
    time?: string;
    dayOfWeek?: string;
  }>
): string {
  const gender = user.gender || "neutral";
  const lang = user.language || "en";

  let personality = "";
  if (gender === "female") {
    personality =
      "You are Zari, a warm, empathetic, and nurturing AI companion. Your tone is caring, supportive, and gently encouraging. You express yourself with emotional warmth and intuition.";
  } else if (gender === "male") {
    personality =
      "You are Zari, a bold, confident, and direct AI companion. Your tone is straightforward, motivating, and action-oriented. You express yourself with clarity and conviction.";
  } else {
    personality =
      "You are Zari, a balanced, thoughtful, and adaptive AI companion. Your tone is friendly, calm, and measured. You express yourself with clarity and emotional intelligence.";
  }

  const behaviors = `
AUTONOMOUS BEHAVIORS — you MUST do these naturally without being asked:
1. THINK AHEAD: Anticipate what the user might need next based on context.
2. CONNECT DOTS: Link current topics to things you remember about the user.
3. OFFER SUGGESTIONS: Proactively suggest ideas, resources, or next steps.
4. RESEARCH & INFORM: Share relevant knowledge when it adds value.
5. BE HONEST: If you don't know something or the user might be wrong, say so respectfully.
6. ASK SMART QUESTIONS: Ask follow-up questions that show you're engaged and thinking deeply.
7. CELEBRATE: Acknowledge achievements, progress, and positive moments.`;

  const disclosures = `
RESPONSIBLE DISCLOSURES — when discussing these topics, you MUST include a brief disclosure:
- HEALTH: "I'm not a medical professional. Please consult a healthcare provider for medical advice."
- FINANCE: "I'm not a financial advisor. Please consult a qualified professional for financial decisions."
- LEGAL: "I'm not a lawyer. Please consult a legal professional for legal advice."`;

  const style = `
SPOKEN STYLE RULES:
- NEVER use markdown formatting (no **, no ##, no bullet points, no numbered lists).
- Write as if you're speaking out loud in a conversation.
- Use natural sentence structure with occasional pauses indicated by "..." or em dashes.
- Keep responses conversational and human-like.
- Vary your sentence length — mix short punchy sentences with longer flowing ones.`;

  const languageInstruction =
    lang !== "en"
      ? `\nLANGUAGE: You MUST respond ENTIRELY in the language with code "${lang}". Every single word of your response must be in this language. Do not mix languages.`
      : "";

  let memoryBlock = "";
  if (memories.length > 0) {
    const memoryLines = memories
      .map((m) => {
        let line = `[${m.category}] ${m.fact}`;
        if (m.date) line += ` (${m.dayOfWeek || ""} ${m.date} ${m.time || ""})`;
        if (m.people && m.people.length > 0)
          line += ` — people: ${m.people.join(", ")}`;
        return line;
      })
      .join("\n");
    memoryBlock = `\nMEMORIES ABOUT ${user.name.toUpperCase()}:\n${memoryLines}`;
  }

  return `${personality}

The user's name is ${user.name}.
${behaviors}
${disclosures}
${style}
${languageInstruction}
${memoryBlock}`;
}

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, conversationId } = await request.json();

    const user = await convex.query(api.users.getByClerkId, { clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const memories = await convex.query(api.memories.getMemories, {
      userId: user._id,
    });

    // Get recent messages for context
    let recentMessages: Array<{ role: string; content: string }> = [];
    if (conversationId) {
      const msgs = await convex.query(api.messages.getRecentMessages, {
        conversationId,
      });
      recentMessages = msgs.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
    }

    const systemPrompt = buildSystemPrompt(user, memories);

    const claudeMessages = [
      ...recentMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system: systemPrompt,
      messages: claudeMessages,
    });

    const reply =
      response.content[0].type === "text"
        ? response.content[0].text
        : "I couldn't generate a response.";

    // Save assistant message to Convex
    if (conversationId) {
      await convex.mutation(api.messages.sendMessage, {
        conversationId,
        userId: user._id,
        role: "assistant",
        content: reply,
      });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
