import { NextResponse } from "next/server";

// A subset of voices for the demo — rotated randomly
const DEMO_VOICES = [
  "cgSgspJ2msm6clMCkdW9", // Zari Playful (female)
  "IKne3meq5aSn9XLyUdCD", // Zari Confident (male)
  "EXAVITQu4vr4xnSDxMaL", // Zari Reassuring (neutral)
  "pFZP5JQG7iQjIQuC4Bku", // Zari Velvety (female)
  "JBFqnCBsd6RMkjVDRZzb", // Zari Storyteller (male)
];

// Simple rate limit: max 20 demo TTS calls per minute globally
let callCount = 0;
let resetTime = Date.now() + 60000;

export async function POST(request: Request) {
  try {
    // Rate limit
    if (Date.now() > resetTime) {
      callCount = 0;
      resetTime = Date.now() + 60000;
    }
    if (callCount >= 20) {
      return NextResponse.json(
        { error: "Demo limit reached" },
        { status: 429 }
      );
    }
    callCount++;

    const { text, gender } = await request.json();
    if (!text || text.length > 500) {
      return NextResponse.json({ error: "Invalid text" }, { status: 400 });
    }

    // Pick a random voice, biased by gender if provided
    const genderVoices: Record<string, string[]> = {
      female: ["cgSgspJ2msm6clMCkdW9", "pFZP5JQG7iQjIQuC4Bku"],
      male: ["IKne3meq5aSn9XLyUdCD", "JBFqnCBsd6RMkjVDRZzb"],
    };
    const pool = genderVoices[gender] || DEMO_VOICES;
    const voiceId = pool[Math.floor(Math.random() * pool.length)];

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "TTS not configured" },
        { status: 500 }
      );
    }

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
      return NextResponse.json(
        { error: "TTS failed" },
        { status: 500 }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "TTS error" },
      { status: 500 }
    );
  }
}
