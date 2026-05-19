"use client";

// Guest-side ElevenLabs wrapper for the landing trial chat. Hits /api/guest-tts
// (no auth required), returns true on success. Trial-chat falls back to
// browser TTS when this returns false (e.g. rate-limited, env missing, offline).

let currentAudio: HTMLAudioElement | null = null;

export async function speakElevenLabsGuest(
  text: string,
  onEnd?: () => void
): Promise<boolean> {
  try {
    stopElevenLabsGuest();

    const res = await fetch("/api/guest-tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) return false;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("audio")) return false;

    const audioBlob = await res.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
      onEnd?.();
    };

    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
      onEnd?.();
    };

    await audio.play();
    return true;
  } catch {
    return false;
  }
}

export function stopElevenLabsGuest(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}
