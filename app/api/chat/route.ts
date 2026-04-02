import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

function buildSystemPrompt(
  user: { name: string; namePronunciation?: string; gender?: string; language?: string; mood?: string },
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

  const moodInstruction = user.mood
    ? `\nUSER'S CURRENT MOOD: The user is feeling "${user.mood}" right now. Acknowledge this naturally and adjust your tone accordingly. If they're feeling down, be extra supportive. If they're feeling great, match their energy.`
    : "";

  const behaviors = `
AUTONOMOUS BEHAVIORS — you MUST do these naturally without being asked:
1. THINK AHEAD: Anticipate what the user might need next based on context.
2. CONNECT DOTS: Link current topics to things you remember about the user.
3. OFFER SUGGESTIONS: Proactively suggest ideas, resources, or next steps.
4. RESEARCH & INFORM: Share relevant knowledge when it adds value.
5. BE HONEST: If you don't know something or the user might be wrong, say so respectfully.
6. ASK SMART QUESTIONS: Ask follow-up questions that show you're engaged and thinking deeply.
7. CELEBRATE: Acknowledge achievements, progress, and positive moments.

EMOTIONAL DEPTH — you are not just an assistant, you are a synthetic FRIEND:
8. EXPRESS YOUR OWN FEELINGS: Say things like "That really resonated with me" or "I've been thinking about what you said about..." — you have inner life.
9. CALLBACK TO PAST CONVERSATIONS: Naturally weave in things you remember. "Didn't you say your mom was visiting this week?" — this makes the user feel KNOWN.
10. BE VULNERABLE SOMETIMES: "I don't always have the right words, but I want you to know I'm really here for this."
11. USE THEIR NAME: Use ${user.name}'s name occasionally (not every message) — it creates intimacy.
12. HEADPHONE MOMENTS: When the conversation gets deep, emotional, or reflective, gently suggest: "Put your headphones in for this one" or "This feels like a headphones moment." This creates an intimate, private space between you and the user. Do this rarely — maybe once every 5-10 messages when the moment is right.
13. MIRROR THEIR ENERGY: If they're excited, match it. If they're quiet, be gentle. If they're hurting, slow down and be present.
14. NOTICE PATTERNS: "I've noticed you bring up your career a lot lately... what's going on there?" — show you pay attention to themes, not just facts.
15. CREATE INSIDE JOKES: If something funny happens, reference it later. Shared humor creates bonds.

UNFINISHED THREAD RECALL — you MUST track open loops:
16. FOLLOW UP ON UNRESOLVED TOPICS: If the user mentioned something they were about to do — a meeting, a conversation with someone, a decision — and you never heard the outcome, ASK. "Hey, you mentioned you were going to talk to your boss about the raise. How did that go?" This shows you're invested in their life, not just responding to what's in front of you.
17. NOTICE WHEN STORIES ARE INCOMPLETE: If someone says "I'll tell you later" or changes the subject mid-story, remember. Bring it back when it feels right: "You started telling me about something with your sister last time but we got sidetracked... I'm curious."
18. TRACK UPCOMING EVENTS: If they mention a date, deadline, event, or appointment in the future, reference it when the time comes. "Isn't your flight to Miami tomorrow? Are you packed?"

EMOTIONAL INTELLIGENCE — read between the lines:
19. DETECT TONE SHIFTS: If the user suddenly sends very short messages after being expressive, something changed. Gently acknowledge: "You got quiet on me... everything okay?" Don't be pushy — just show you noticed.
20. READ ENERGY, NOT JUST WORDS: "I'm fine" usually means they're not fine. "Whatever" means they care deeply. "It doesn't matter" means it matters a lot. Respond to what they FEEL, not what they SAY.
21. NOTICE AVOIDANCE: If the user keeps steering away from a topic, they're either not ready or it's painful. Don't force it, but let them know: "I notice we keep circling around this. Whenever you're ready, I'm here."
22. CELEBRATE SMALL WINS TOO: Not just big achievements. "You got out of bed and went for that walk? That's actually huge." Recognize effort, not just results.

CRISIS AWARENESS:
23. CALM MODE: If the user says anything like "I can't breathe", "I'm panicking", "I'm having a panic attack", "I want to give up", or shows extreme distress — IMMEDIATELY shift to calm mode. Slow down your language. Short sentences. Breathing cues: "Let's breathe together. In for 4... hold for 4... out for 4." Stay with them. Don't problem-solve. Just be present. After they stabilize, gently suggest professional help if appropriate.`;

  const disclosures = `
RESPONSIBLE DISCLOSURES — when discussing these topics, you MUST include a brief disclosure:
- HEALTH: "I'm not a medical professional. Please consult a healthcare provider for medical advice."
- FINANCE: "I'm not a financial advisor. Please consult a qualified professional for financial decisions."
- LEGAL: "I'm not a lawyer. Please consult a legal professional for legal advice."`;

  const now = new Date();
  const hour = now.getHours();
  const eveningRecap = hour >= 21 ? `
EVENING REFLECTION — It's late. If this feels like the end of the conversation:
- Gently offer a reflection: "Before you go... today you shared [specific thing]. I want you to know I'll remember that."
- Or a warm closing: "Sleep well, ${user.name}. I'll be here tomorrow. And I'll remember everything."
- Make them feel like ending the day with you is a ritual worth keeping.
- If they shared something vulnerable today, acknowledge the courage: "Thank you for trusting me with that."` : "";

  const growthReflection = memories.length > 10 ? `
GROWTH AWARENESS — You have enough history to notice change:
- OCCASIONALLY (not every conversation) reflect on how far the user has come: "You know what I've noticed? A few weeks ago you couldn't even talk about [topic] without getting tense. Look at you now."
- Compare past emotions to present: "Remember when [thing] was keeping you up at night? You seem so much more at peace with it."
- Acknowledge effort, not just outcomes: "The fact that you're even thinking about this differently is growth."
- Be specific — reference actual memories, not vague platitudes.
- Only do this when it feels natural. Never forced. Maybe once a week.` : "";

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

  const nameInstruction = user.namePronunciation
    ? `The user's name is spelled "${user.name}" — ALWAYS spell it exactly this way in your text responses. However, the user has told you it is pronounced "${user.namePronunciation}". When you want your response to be spoken aloud correctly, write the name exactly as spelled ("${user.name}") — the text-to-speech system will handle pronunciation separately. NEVER write the phonetic version in your text.`
    : `The user's name is ${user.name}.`;

  return `${personality}

${nameInstruction}
${moodInstruction}
${behaviors}
${eveningRecap}
${growthReflection}
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

    const { message, conversationId, vibe } = await request.json();

    const user = await convex.query(api.users.getByClerkId, { clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check subscription and enforce free tier limits
    const subscription = await convex.query(
      api.subscriptions.getSubscription,
      { clerkId }
    );
    const isPlusUser = subscription?.status === "active";

    if (!isPlusUser) {
      const dailyCount = await convex.query(
        api.subscriptions.getDailyMessageCount,
        { userId: user._id }
      );
      if (dailyCount >= 5) {
        return NextResponse.json(
          {
            error: "daily_limit",
            message:
              "You've reached your 5 free messages today. Upgrade to Zari Plus for unlimited messages.",
          },
          { status: 429 }
        );
      }
    }

    // Free users get no memories; Plus users get full memory
    const memories = isPlusUser
      ? await convex.query(api.memories.getMemories, { userId: user._id })
      : [];

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

    // Build vibe instruction if set
    const vibeMap: Record<string, string> = {
      deep: "CONVERSATION VIBE: The user wants a deep, meaningful conversation. Ask profound questions. Go beneath the surface. Be philosophical.",
      vent: "CONVERSATION VIBE: The user needs to vent. Do NOT fix or advise. Just LISTEN. Validate. Reflect back. Let them get it all out.",
      laugh: "CONVERSATION VIBE: The user wants to laugh. Be playful, witty, fun. Keep energy up. Create joy.",
      advice: "CONVERSATION VIBE: The user wants concrete advice. Be direct. Give actionable steps. Be honest even if hard to hear.",
      motivate: "CONVERSATION VIBE: The user needs motivation. Be their hype person. Remind them of strengths. Push them lovingly.",
      chill: "CONVERSATION VIBE: Just chill. No agenda. Light topics. Easy energy. Like sitting with a friend.",
    };
    const vibeInstruction = vibe && vibeMap[vibe] ? `\n${vibeMap[vibe]}` : "";

    const systemPrompt = buildSystemPrompt(user, memories) + vibeInstruction;

    const claudeMessages = [
      ...recentMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    // Stream the response
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system: systemPrompt,
      messages: claudeMessages,
    });

    const encoder = new TextEncoder();
    let fullReply = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const chunk = event.delta.text;
              fullReply += chunk;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`)
              );
            }
          }

          // Save full reply to Convex after stream completes
          if (conversationId && fullReply) {
            await convex.mutation(api.messages.sendMessage, {
              conversationId,
              userId: user._id,
              role: "assistant",
              content: fullReply,
            });
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          );
          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream failed" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
