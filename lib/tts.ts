import { languages } from "./languages";

let currentUtterance: SpeechSynthesisUtterance | null = null;

function findBestVoice(
  lang: string,
  keywords: string[]
): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();

  // Try to match by keywords first
  for (const keyword of keywords) {
    const match = voices.find((v) =>
      v.name.toLowerCase().includes(keyword.toLowerCase())
    );
    if (match) return match;
  }

  // Fall back to language match
  const langMatch = voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
  if (langMatch) return langMatch;

  // Default voice
  return voices[0] || null;
}

export function speak(
  text: string,
  languageCode: string = "en",
  gender: string = "neutral",
  onEnd?: () => void
): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  stopSpeaking();

  const langConfig = languages[languageCode] || languages.en;
  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = langConfig.ttsLang;

  const voice = findBestVoice(langConfig.ttsLang, langConfig.voiceKeywords);
  if (voice) {
    utterance.voice = voice;
  }

  // Gender-based voice tuning
  switch (gender) {
    case "female":
      utterance.pitch = 1.15;
      utterance.rate = 1.0;
      break;
    case "male":
      utterance.pitch = 0.82;
      utterance.rate = 0.95;
      break;
    default:
      utterance.pitch = 1.05;
      utterance.rate = 1.0;
  }

  utterance.onend = () => {
    currentUtterance = null;
    onEnd?.();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    onEnd?.();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}
