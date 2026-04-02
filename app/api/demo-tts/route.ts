import { NextResponse } from "next/server";

// Only these exact demo texts are allowed — prevents abuse
const ALLOWED_TEXTS = new Set([
  "Hey there! I'm Zari, your AI companion. I think, I speak, I remember... and I actually care about what you tell me.",
  "Puedo hablar contigo en espa\u00f1ol tambi\u00e9n. No solo traduzco... realmente entiendo tu cultura, tus emociones, tu forma de ver el mundo.",
  "\u0645\u0631\u062d\u0628\u0627\u064b! \u0623\u0646\u0627 \u0632\u0627\u0631\u064a. \u0628\u0623\u0642\u062f\u0631 \u0623\u062a\u0643\u0644\u0645 \u0639\u0631\u0628\u064a \u0648\u0623\u0641\u0647\u0645 \u0627\u0644\u062b\u0642\u0627\u0641\u0629 \u0648\u0627\u0644\u0645\u0634\u0627\u0639\u0631. \u0623\u0646\u0627 \u0647\u0646\u0627 \u0639\u0634\u0627\u0646\u0643.",
  "I remember the things you share with me. Your goals, your people, your story. Every conversation makes me know you better.",
  "Bonjour ! Je suis Zari. Je suis l\u00e0 pour t\u2019\u00e9couter, te comprendre et t\u2019accompagner dans tout ce que tu traverses.",
  "I'm Zari. I don't just answer questions... I think ahead, connect the dots, and sometimes I'll challenge you. Because that's what a real companion does.",
  "\u0928\u092e\u0938\u094d\u0924\u0947! \u092e\u0948\u0902 \u091c\u093c\u093e\u0930\u0940 \u0939\u0942\u0901\u0964 \u092e\u0948\u0902 \u0939\u093f\u0928\u094d\u0926\u0940 \u092e\u0947\u0902 \u092c\u093e\u0924 \u0915\u0930 \u0938\u0915\u0924\u0940 \u0939\u0942\u0901 \u2014 \u0938\u093f\u0930\u094d\u092b\u093c \u0905\u0928\u0941\u0935\u093e\u0926 \u0928\u0939\u0940\u0902, \u0905\u0938\u0932\u0940 \u0938\u092e\u091d \u0915\u0947 \u0938\u093e\u0925\u0964",
  "Three personalities, sixteen languages, one Zari. I adapt to you, not the other way around.",
  "Hi, I'm Zari. Think of me as the friend who's always awake, always listening, and never forgets what matters to you.",
  "Merhaba! Ben Zari. Seninle T\u00fcrk\u00e7e konu\u015fabilirim. Sadece kelime \u00e7evirmiyorum... ger\u00e7ekten anl\u0131yorum.",
  "\uc548\ub155\ud558\uc138\uc694! \uc800\ub294 \uc790\ub9ac\uc608\uc694. \ud55c\uad6d\uc5b4\ub85c \ub300\ud654\ud560 \uc218 \uc788\uc5b4\uc694. \ub2f9\uc2e0\uc758 \uac10\uc815\uacfc \ubb38\ud654\ub97c \uc774\ud574\ud574\uc694.",
  "I speak your language, remember your world, and I'm always honest with you. That's my promise.",
  "Ol\u00e1! Eu sou a Zari. Posso conversar com voc\u00ea em portugu\u00eas com naturalidade \u2014 como uma amiga de verdade.",
  "\u0421\u0430\u043b\u0430\u043c! \u041c\u0435\u043d \u0417\u0430\u0440\u0438\u043c\u0438\u043d. \u041c\u0435\u043d \u04e9\u0437\u0431\u0435\u043a \u0442\u0438\u043b\u0438\u0434\u0430 \u0433\u0430\u043f\u043b\u0430\u0448\u0430 \u043e\u043b\u0430\u043c\u0430\u043d... \u043b\u0435\u043a\u0438\u043d \u0440\u0443\u0441 \u0442\u0438\u043b\u0438\u0434\u0430 \u0445\u0430\u043c \u0433\u0430\u043f\u043b\u0430\u0448\u0430\u043c\u0430\u043d!",
  "I'm not just a chatbot. I remember your name, your goals, the people in your life. I grow with you over time.",
  "Kamusta! Ako si Zari. Pwede tayong mag-usap sa Tagalog. Hindi lang ako nagsasalin \u2014 tunay akong nakakaintindi.",
]);

// Random voice per gender
const FEMALE_VOICES = [
  "cgSgspJ2msm6clMCkdW9", // Playful
  "pFZP5JQG7iQjIQuC4Bku", // Velvety
  "hpp4J3VqNfWAUOO0d1Us", // Polished
  "Xb7hH8MSUJpSbSDYk0k2", // Clear
];
const MALE_VOICES = [
  "IKne3meq5aSn9XLyUdCD", // Confident
  "cjVigY5qzO86Huf0OWal", // Trustworthy
  "JBFqnCBsd6RMkjVDRZzb", // Storyteller
  "nPczCjzI2devNBz1zQrb", // Comforting
];

export async function POST(request: Request) {
  try {
    const { text, gender } = await request.json();

    // SECURITY: Only allow exact demo texts
    if (!text || !ALLOWED_TEXTS.has(text)) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    const pool = gender === "female" ? FEMALE_VOICES : MALE_VOICES;
    const voiceId = pool[Math.floor(Math.random() * pool.length)];

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
      return NextResponse.json({ error: "TTS failed" }, { status: 500 });
    }

    const audioBuffer = await response.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "TTS error" }, { status: 500 });
  }
}
