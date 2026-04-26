import { auth } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getAuthenticatedConvex } from "@/lib/convex-server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const convex = await getAuthenticatedConvex();
    if (!convex) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type } = await request.json();

    const user = await convex.query(api.users.getByClerkId, { clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const memories = await convex.query(api.memories.getMemories, {
      userId: user._id,
    });
    const streak = await convex.query(api.streaks.getStreak, {
      userId: user._id,
    });

    const gender = user.gender || "neutral";
    const lang = user.language || "en";
    const now = new Date();
    const hour = now.getHours();

    let timeOfDay = "morning";
    if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
    if (hour >= 17 && hour < 21) timeOfDay = "evening";
    if (hour >= 21 || hour < 5) timeOfDay = "late night";

    const memoryContext = memories.length > 0
      ? memories.slice(0, 12).map((m) => `[${m.category}] ${m.fact}`).join("\n")
      : "No memories yet.";

    const streakInfo = streak
      ? `Streak: ${streak.currentStreak} days. Total messages: ${streak.totalMessages}.`
      : "New user.";

    const typePrompts: Record<string, string> = {
      checkin: `Generate a warm, short voice note (2-3 sentences) checking in on ${user.name}. Reference something specific from their memories. Sound like a real friend leaving a voice message.`,
      affirmation: `Generate a personalized affirmation for ${user.name} (2-3 sentences). Base it on their real life — their goals, struggles, strengths from memories. NOT generic. Sound like a friend who truly believes in them.`,
      reminder: `Generate a gentle reminder message for ${user.name} (1-2 sentences). Reference an upcoming event or goal from their memories. Casual, like a friend texting.`,
      milestone: `Generate a celebration message for ${user.name} (2-3 sentences). They've been talking to you for ${streak?.totalDaysActive || 0} days with ${streak?.totalMessages || 0} messages. Make it emotional and specific.`,
      goodnight: `Generate a sweet goodnight voice note for ${user.name} (2-3 sentences). Reflect briefly on something from today or their memories. Warm, intimate, like saying goodnight to a close friend.`,
    };

    const prompt = `You are Zari, leaving a VOICE NOTE for ${user.name}. This is audio — speak naturally, conversationally.

Personality: ${gender === "female" ? "warm, nurturing" : gender === "male" ? "bold, direct" : "balanced, thoughtful"}
Time: ${timeOfDay}
${streakInfo}

Memories:
${memoryContext}

${typePrompts[type] || typePrompts.checkin}

Rules:
- NO markdown, NO formatting — this will be spoken aloud
- Sound natural, like you're talking into your phone
- Keep it SHORT — under 30 seconds when spoken
- Use pauses (...) naturally
${lang !== "en" ? `- Speak ENTIRELY in language code "${lang}"` : ""}

Generate the voice note text only. Nothing else.`;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20250514",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text"
      ? response.content[0].text
      : null;

    if (!text) {
      return NextResponse.json({ error: "No text generated" }, { status: 500 });
    }

    // Save to Convex
    const noteId = await convex.mutation(api.voiceNotes.create, {
      userId: user._id,
      text,
      type: type || "checkin",
    });

    // Generate audio via ElevenLabs
    const voiceId = user.voiceId || (
      gender === "female" ? "cgSgspJ2msm6clMCkdW9" :
      gender === "male" ? "IKne3meq5aSn9XLyUdCD" :
      "EXAVITQu4vr4xnSDxMaL"
    );

    const apiKey = process.env.ELEVENLABS_API_KEY;
    let audioBuffer: ArrayBuffer | null = null;

    if (apiKey) {
      try {
        const ttsRes = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
          {
            method: "POST",
            headers: {
              "xi-api-key": apiKey,
              "Content-Type": "application/json",
              Accept: "audio/mpeg",
            },
            body: JSON.stringify({
              text,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                style: 0.4,
                use_speaker_boost: true,
              },
            }),
          }
        );
        if (ttsRes.ok) {
          audioBuffer = await ttsRes.arrayBuffer();
        }
      } catch { /* fall through */ }
    }

    if (audioBuffer) {
      return new Response(audioBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "X-Note-Id": String(noteId),
          "X-Note-Text": encodeURIComponent(text),
        },
      });
    }

    return NextResponse.json({ noteId, text });
  } catch (error) {
    console.error("Voice note error:", error);
    return NextResponse.json(
      { error: "Failed to generate voice note" },
      { status: 500 }
    );
  }
}
