import { auth } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";
import { getAuthenticatedConvex } from "@/lib/convex-server";
import { elevenLabsVoices } from "@/lib/elevenlabs-voices";

const DAILY_VOICE_CAP = 50; // max ElevenLabs messages per day per user
const ADMIN_EMAILS = ["docmaasi2@gmail.com"];

// Authoritative allowlist of voice IDs this app may use. Built once at
// module load from the published Zari voice catalog so requests can't
// reach ElevenLabs with arbitrary (potentially premium-cloned) voice IDs
// that would bill the ElevenLabs account at unexpected rates.
const ALLOWED_VOICE_IDS = new Set(elevenLabsVoices.map((v) => v.id));

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

    const { text, voiceId } = await request.json();
    if (!text || !voiceId || typeof text !== "string" || typeof voiceId !== "string") {
      return NextResponse.json(
        { error: "text and voiceId required" },
        { status: 400 }
      );
    }

    // Voice-ID allowlist. Without this, an authenticated user can supply
    // any valid ElevenLabs voice ID (including premium cloned voices
    // billed at higher rates) and the server forwards it to
    // /v1/text-to-speech/${voiceId}, hitting the account's API key.
    if (!ALLOWED_VOICE_IDS.has(voiceId)) {
      return NextResponse.json(
        { error: "invalid_voice_id", message: "Unknown voice." },
        { status: 400 }
      );
    }

    // Cap on characters sent to ElevenLabs — prevents a single request burning
    // through credits with a multi-page payload.
    const MAX_TTS_CHARS = 1500;
    if (text.length > MAX_TTS_CHARS) {
      return NextResponse.json(
        {
          error: "text_too_long",
          message: `Voice messages are limited to ${MAX_TTS_CHARS} characters.`,
        },
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
