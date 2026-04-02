import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const DAILY_VOICE_CAP = 50; // max ElevenLabs messages per day per user

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

    // Check subscription — ElevenLabs is Plus-only
    const subscription = await convex.query(
      api.subscriptions.getSubscription,
      { clerkId }
    );
    if (subscription?.status !== "active") {
      return NextResponse.json(
        { error: "plus_required", message: "ElevenLabs voices are a Plus feature." },
        { status: 403 }
      );
    }

    // Check daily voice cap
    const user = await convex.query(api.users.getByClerkId, { clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const voiceCount = await convex.query(
      api.subscriptions.getDailyVoiceCount,
      { userId: user._id }
    );
    if (voiceCount >= DAILY_VOICE_CAP) {
      return NextResponse.json(
        {
          error: "voice_limit",
          message: `You've used ${DAILY_VOICE_CAP} voice messages today. Zari will use browser voice for the rest of the day.`,
        },
        { status: 429 }
      );
    }

    // Call ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY!,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
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
