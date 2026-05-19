import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { rateLimit, getClientIp, rlKey } from "@/lib/rate-limit";

/**
 * Public ElevenLabs TTS for the landing-page trial chat (unauthenticated).
 *
 * Defense in depth, since this endpoint can be called without a Clerk session:
 *   - IP-based rate limit (6/min) — matches guest-chat
 *   - Hard char cap (500) — trial replies are 2-3 sentences
 *   - Fixed voice pool (3 voices) — bots can't pump arbitrary voice ids
 *   - Audio is cached at the edge for an hour — same exact reply reuses
 *
 * Cost ceiling per IP per hour: ~6 calls/min x 60 x 500 chars = 180k chars.
 * Tweak by adjusting GUEST_TTS_LIMIT below.
 */

const GUEST_TTS_LIMIT = { max: 6, windowMs: 60_000 };
const MAX_GUEST_TTS_CHARS = 500;

// Hand-picked warm female voices — keep this tight so guests sample the
// signature Zari sound. The first one is the marketing demo voice.
const GUEST_VOICE_POOL = [
  "cgSgspJ2msm6clMCkdW9", // Playful & Bright
  "pFZP5JQG7iQjIQuC4Bku", // Velvety & Elegant
  "EXAVITQu4vr4xnSDxMaL", // Mature & Reassuring (neutral)
];

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = await rateLimit(
      rlKey("guest-tts", ip),
      GUEST_TTS_LIMIT.max,
      GUEST_TTS_LIMIT.windowMs
    );
    if (!rl.ok) {
      return NextResponse.json(
        { error: "rate_limited" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetIn / 1000)) } }
      );
    }

    const { text } = await request.json();
    if (typeof text !== "string" || text.length === 0) {
      return NextResponse.json({ error: "text required" }, { status: 400 });
    }
    if (text.length > MAX_GUEST_TTS_CHARS) {
      return NextResponse.json(
        { error: "text_too_long" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "tts_not_configured" },
        { status: 503 }
      );
    }

    // Pick a voice deterministically from the text hash so the same reply
    // gives the same voice on retry — feels consistent during the trial.
    const hash = Array.from(text).reduce(
      (acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0,
      0
    );
    const voiceId = GUEST_VOICE_POOL[hash % GUEST_VOICE_POOL.length];

    const response = await fetch(
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
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      Sentry.captureMessage("guest-tts upstream failure", {
        level: "warning",
        tags: { route: "guest-tts", status: String(response.status) },
        extra: { errText: errText.slice(0, 200) },
      });
      return NextResponse.json(
        { error: "tts_failed" },
        { status: 502 }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    Sentry.captureException(error, { tags: { route: "guest-tts" } });
    return NextResponse.json({ error: "tts_error" }, { status: 500 });
  }
}
