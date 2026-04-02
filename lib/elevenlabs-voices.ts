export interface ElevenLabsVoice {
  id: string;
  label: string;
  description: string;
  gender: "female" | "male" | "neutral";
  accent: string;
}

export const elevenLabsVoices: ElevenLabsVoice[] = [
  // Female (Warm personality) — all are "Zari"
  { id: "cgSgspJ2msm6clMCkdW9", label: "Zari — Playful & Bright", description: "Warm, upbeat, feels like your best friend", gender: "female", accent: "American" },
  { id: "pFZP5JQG7iQjIQuC4Bku", label: "Zari — Velvety & Elegant", description: "Smooth, refined, like a late-night conversation", gender: "female", accent: "British" },
  { id: "hpp4J3VqNfWAUOO0d1Us", label: "Zari — Polished & Warm", description: "Professional yet caring, like a trusted mentor", gender: "female", accent: "American" },
  { id: "FGY2WhTYpPnrIDTdsKH5", label: "Zari — Energetic & Quirky", description: "Fun, enthusiastic, keeps you smiling", gender: "female", accent: "American" },
  { id: "Xb7hH8MSUJpSbSDYk0k2", label: "Zari — Clear & Engaging", description: "Articulate, thoughtful, easy to follow", gender: "female", accent: "British" },

  // Male (Bold personality) — all are "Zari"
  { id: "IKne3meq5aSn9XLyUdCD", label: "Zari — Deep & Confident", description: "Strong presence, energetic, motivating", gender: "male", accent: "Australian" },
  { id: "cjVigY5qzO86Huf0OWal", label: "Zari — Smooth & Trustworthy", description: "Calm authority, like a wise older brother", gender: "male", accent: "American" },
  { id: "JBFqnCBsd6RMkjVDRZzb", label: "Zari — Warm Storyteller", description: "Captivating, draws you in, great for deep talks", gender: "male", accent: "British" },
  { id: "nPczCjzI2devNBz1zQrb", label: "Zari — Deep & Comforting", description: "Resonant, grounding, feels safe", gender: "male", accent: "American" },
  { id: "onwK4e9ZLuTAKqWW03F9", label: "Zari — Steady & Clear", description: "Measured, reliable, no-nonsense", gender: "male", accent: "British" },

  // Neutral (Balanced personality) — all are "Zari"
  { id: "EXAVITQu4vr4xnSDxMaL", label: "Zari — Mature & Reassuring", description: "Confident, calming, like a therapist you trust", gender: "neutral", accent: "American" },
  { id: "SAz9YHcvj6GT2YYXdXww", label: "Zari — Relaxed & Chill", description: "Easy-going, neutral, no pressure", gender: "neutral", accent: "American" },
  { id: "XrExE9yKIg1WjnnlVkGX", label: "Zari — Sharp & Insightful", description: "Knowledgeable, precise, cuts through noise", gender: "neutral", accent: "American" },
  { id: "pqHfZKP75CvOlQylNhV4", label: "Zari — Wise & Balanced", description: "Mature, thoughtful, like a life coach", gender: "neutral", accent: "American" },
  { id: "iP95p4xoKVk53GoZ742B", label: "Zari — Charming & Real", description: "Down-to-earth, genuine, easy to talk to", gender: "neutral", accent: "American" },
];

export function getVoicesForGender(gender: string): ElevenLabsVoice[] {
  const genderMap: Record<string, string> = {
    female: "female",
    male: "male",
    neutral: "neutral",
  };
  return elevenLabsVoices.filter((v) => v.gender === (genderMap[gender] || "neutral"));
}

export function getDefaultVoiceId(gender: string): string {
  const defaults: Record<string, string> = {
    female: "cgSgspJ2msm6clMCkdW9",
    male: "IKne3meq5aSn9XLyUdCD",
    neutral: "EXAVITQu4vr4xnSDxMaL",
  };
  return defaults[gender] || defaults.neutral;
}
