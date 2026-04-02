"use client";

let currentAudio: HTMLAudioElement | null = null;

export async function speakElevenLabs(
  text: string,
  voiceId: string,
  onEnd?: () => void
): Promise<boolean> {
  try {
    stopElevenLabs();

    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voiceId }),
    });

    // If the API returns an error (not audio), fall back
    if (!res.ok) {
      return false;
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("audio")) {
      return false;
    }

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

export function stopElevenLabs(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}
