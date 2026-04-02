/**
 * Enhanced TTS with smarter voice selection.
 * Prioritizes premium, neural, and natural-sounding voices
 * over robotic default ones.
 */

// Premium voice keywords ranked by quality (highest first)
const PREMIUM_KEYWORDS = [
  "natural",
  "neural",
  "enhanced",
  "premium",
  "wavenet",
  "online", // Chrome "Online" voices are higher quality
];

// Known high-quality voices by platform
const PREFERRED_VOICES: Record<string, string[]> = {
  "en-US": [
    "Microsoft Aria Online",
    "Microsoft Jenny Online",
    "Microsoft Guy Online",
    "Google US English",
    "Samantha",
    "Karen",
    "Daniel",
  ],
  "en-GB": [
    "Microsoft Sonia Online",
    "Microsoft Ryan Online",
    "Google UK English Female",
  ],
  "es-ES": [
    "Microsoft Elvira Online",
    "Google español",
    "Monica",
  ],
  "fr-FR": [
    "Microsoft Denise Online",
    "Google français",
    "Amelie",
    "Thomas",
  ],
  "ar-SA": [
    "Microsoft Hamed Online",
    "Google العربية",
    "Maged",
  ],
  "hi-IN": [
    "Microsoft Swara Online",
    "Google हिन्दी",
  ],
  "pt-BR": [
    "Microsoft Francisca Online",
    "Google português do Brasil",
    "Luciana",
  ],
  "de-DE": [
    "Microsoft Katja Online",
    "Google Deutsch",
    "Anna",
  ],
  "ja-JP": [
    "Microsoft Nanami Online",
    "Google 日本語",
    "Kyoko",
  ],
  "ko-KR": [
    "Microsoft SunHi Online",
    "Google 한국의",
    "Yuna",
  ],
  "tr-TR": [
    "Microsoft Emel Online",
    "Google Türkçe",
  ],
  "ru-RU": [
    "Microsoft Svetlana Online",
    "Google русский",
  ],
  "it-IT": [
    "Microsoft Elsa Online",
    "Google italiano",
    "Alice",
  ],
  "zh-CN": [
    "Microsoft Xiaoxiao Online",
    "Google 中文",
    "Ting-Ting",
  ],
};

let voicesLoaded = false;
let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    cachedVoices = voices;
    voicesLoaded = true;
  }
  return cachedVoices;
}

function findBestVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  if (voices.length === 0) return null;

  const langBase = lang.split("-")[0];
  const preferred = PREFERRED_VOICES[lang] || [];

  // 1. Try preferred voices by exact name match
  for (const name of preferred) {
    const match = voices.find((v) =>
      v.name.toLowerCase().includes(name.toLowerCase())
    );
    if (match) return match;
  }

  // 2. Try premium/neural voices for this language
  const langVoices = voices.filter(
    (v) => v.lang.startsWith(langBase) || v.lang.startsWith(lang)
  );

  for (const keyword of PREMIUM_KEYWORDS) {
    const match = langVoices.find((v) =>
      v.name.toLowerCase().includes(keyword)
    );
    if (match) return match;
  }

  // 3. Prefer non-local (remote/online) voices — they're usually higher quality
  const remoteVoice = langVoices.find((v) => !v.localService);
  if (remoteVoice) return remoteVoice;

  // 4. Any voice for this language
  if (langVoices.length > 0) return langVoices[0];

  // 5. Fallback
  return voices[0] || null;
}

// Ensure voices are loaded
if (typeof window !== "undefined" && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function speakSmooth(
  text: string,
  lang: string = "en-US",
  gender: "female" | "male" | "neutral" | string = "neutral",
  onEnd?: () => void
): void {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();

  // Split long text into sentences for more natural delivery
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let currentIndex = 0;

  const speakNext = () => {
    if (currentIndex >= sentences.length) {
      onEnd?.();
      return;
    }

    const sentence = sentences[currentIndex].trim();
    if (!sentence) {
      currentIndex++;
      speakNext();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = lang;

    const voice = findBestVoice(lang);
    if (voice) utterance.voice = voice;

    // Gender-tuned but more natural parameters
    switch (gender) {
      case "female":
        utterance.pitch = 1.08; // Slightly higher, not cartoonish
        utterance.rate = 0.94; // Slightly slower for warmth
        break;
      case "male":
        utterance.pitch = 0.88; // Lower but not forced
        utterance.rate = 0.92; // Measured pace
        break;
      default:
        utterance.pitch = 1.0;
        utterance.rate = 0.93; // Slightly slower than default for naturalness
    }

    // Volume slightly below max to avoid distortion
    utterance.volume = 0.92;

    utterance.onend = () => {
      currentIndex++;
      // Small pause between sentences for naturalness
      if (currentIndex < sentences.length) {
        setTimeout(speakNext, 180);
      } else {
        onEnd?.();
      }
    };

    utterance.onerror = () => {
      currentIndex++;
      speakNext();
    };

    window.speechSynthesis.speak(utterance);
  };

  speakNext();
}

export function stopSmooth(): void {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();
}
