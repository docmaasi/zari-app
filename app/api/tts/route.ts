import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const DAILY_VOICE_CAP = 50; // max ElevenLabs messages per day per user
const ADMIN_EMAILS = ["docmaasi2@gmail.com"];

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, voiceId } = await request.json();
    if (!text || !voiceId) {
      return NextResponse.json(
        { error: "text and voiceId required" },
        { status: 400 }
      );
    }

    const user = await convex.query(api.users.getByClerkId, { clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check subscription for voice cap (ElevenLabs for everyone, cap differs)
    const subscription = await convex.query(
      api.subscriptions.getSubscription,
      { clerkId }
    );
    const isPlusUser = subscription?.status === "active";

    const isAdmin = ADMIN_EMAILS.includes(user.email);
    const voiceCap = isPlusUser ? 200 : 5; // Free: 5, Plus: 200, Admin: unlimited
    const voiceCount = await convex.query(
      api.subscriptions.getDailyVoiceCount,
      { userId: user._id }
    );
    if (!isAdmin && voiceCount >= voiceCap) {
      return NextResponse.json(
        {
          error: "voice_limit",
          message: isPlusUser
            ? "You've reached your voice limit for today. Come back tomorrow."
            : "Upgrade to Zari Plus for more voice messages with Zari.",
        },
        { status: 429 }
      );
    }

    // Call ElevenLabs API
    const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
    if (!elevenLabsKey) {
      return NextResponse.json(
        { error: "tts_not_configured", message: "Voice not available right now." },
        { status: 503 }
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": elevenLabsKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("ElevenLabs error:", errText);
      return NextResponse.json(
        { error: "tts_failed", message: "Voice generation failed." },
        { status: 500 }
      );
    }

    // Track usage
    await convex.mutation(api.subscriptions.incrementVoiceCount, {
      userId: user._id,
    });

    // Stream audio back to client
    const audioBuffer = await response.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
