export interface LanguageConfig {
  code: string;
  name: string;
  flag: string;
  ttsLang: string;
  voiceKeywords: string[];
  greeting: string;
  ui: {
    talkTo: string;
    online: string;
    speaking: string;
    thinking: string;
    composing: string;
    howFeeling: string;
  };
}

export const languages: Record<string, LanguageConfig> = {
  en: {
    code: "en",
    name: "English",
    flag: "\ud83c\uddfa\ud83c\uddf8",
    ttsLang: "en-US",
    voiceKeywords: ["samantha", "karen", "daniel", "google us"],
    greeting: "Hey there! I'm Zari.",
    ui: {
      talkTo: "Talk to Zari",
      online: "Online",
      speaking: "Speaking...",
      thinking: "Thinking...",
      composing: "Composing...",
      howFeeling: "How are you feeling today?",
    },
  },
  es: {
    code: "es",
    name: "Espa\u00f1ol",
    flag: "\ud83c\uddea\ud83c\uddf8",
    ttsLang: "es-ES",
    voiceKeywords: ["monica", "jorge", "google espa\u00f1ol"],
    greeting: "\u00a1Hola! Soy Zari.",
    ui: {
      talkTo: "Habla con Zari",
      online: "En l\u00ednea",
      speaking: "Hablando...",
      thinking: "Pensando...",
      composing: "Componiendo...",
      howFeeling: "\u00bfC\u00f3mo te sientes hoy?",
    },
  },
  fr: {
    code: "fr",
    name: "Fran\u00e7ais",
    flag: "\ud83c\uddeb\ud83c\uddf7",
    ttsLang: "fr-FR",
    voiceKeywords: ["amelie", "thomas", "google fran\u00e7ais"],
    greeting: "Salut ! Je suis Zari.",
    ui: {
      talkTo: "Parle avec Zari",
      online: "En ligne",
      speaking: "Parle...",
      thinking: "R\u00e9fl\u00e9chit...",
      composing: "Compose...",
      howFeeling: "Comment tu te sens aujourd\u2019hui ?",
    },
  },
  ar: {
    code: "ar",
    name: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
    flag: "\ud83c\uddf8\ud83c\udde6",
    ttsLang: "ar-SA",
    voiceKeywords: ["maged", "google \u0639\u0631\u0628\u064a"],
    greeting: "\u0645\u0631\u062d\u0628\u0627\u064b! \u0623\u0646\u0627 \u0632\u0627\u0631\u064a.",
    ui: {
      talkTo: "\u062a\u062d\u062f\u062b \u0645\u0639 \u0632\u0627\u0631\u064a",
      online: "\u0645\u062a\u0635\u0644",
      speaking: "\u064a\u062a\u062d\u062f\u062b...",
      thinking: "\u064a\u0641\u0643\u0631...",
      composing: "\u064a\u0643\u062a\u0628...",
      howFeeling: "\u0643\u064a\u0641 \u062d\u0627\u0644\u0643 \u0627\u0644\u064a\u0648\u0645\u061f",
    },
  },
  hi: {
    code: "hi",
    name: "\u0939\u093f\u0928\u094d\u0926\u0940",
    flag: "\ud83c\uddee\ud83c\uddf3",
    ttsLang: "hi-IN",
    voiceKeywords: ["lekha", "google \u0939\u093f\u0928\u094d\u0926\u0940"],
    greeting: "\u0928\u092e\u0938\u094d\u0924\u0947! \u092e\u0948\u0902 \u0939\u0942\u0901 \u091c\u093c\u093e\u0930\u0940\u0964",
    ui: {
      talkTo: "\u091c\u093c\u093e\u0930\u0940 \u0938\u0947 \u092c\u093e\u0924 \u0915\u0930\u094b",
      online: "\u0911\u0928\u0932\u093e\u0907\u0928",
      speaking: "\u092c\u094b\u0932 \u0930\u0939\u0940 \u0939\u0948...",
      thinking: "\u0938\u094b\u091a \u0930\u0939\u0940 \u0939\u0948...",
      composing: "\u0932\u093f\u0916 \u0930\u0939\u0940 \u0939\u0948...",
      howFeeling: "\u0906\u091c \u0906\u092a \u0915\u0948\u0938\u0947 \u0939\u0948\u0902?",
    },
  },
  ur: {
    code: "ur",
    name: "\u0627\u0631\u062f\u0648",
    flag: "\ud83c\uddf5\ud83c\uddf0",
    ttsLang: "ur-PK",
    voiceKeywords: ["google \u0627\u0631\u062f\u0648"],
    greeting: "\u0633\u0644\u0627\u0645! \u0645\u06cc\u06ba \u0632\u0627\u0631\u06cc \u06c1\u0648\u06ba\u06d4",
    ui: {
      talkTo: "\u0632\u0627\u0631\u06cc \u0633\u06d2 \u0628\u0627\u062a \u06a9\u0631\u06cc\u06ba",
      online: "\u0622\u0646 \u0644\u0627\u0626\u0646",
      speaking: "\u0628\u0648\u0644 \u0631\u06c1\u06cc \u06c1\u0648\u06ba...",
      thinking: "\u0633\u0648\u0686 \u0631\u06c1\u06cc \u06c1\u0648\u06ba...",
      composing: "\u0644\u06a9\u06be \u0631\u06c1\u06cc \u06c1\u0648\u06ba...",
      howFeeling: "\u0622\u062c \u0622\u067e \u06a9\u06cc\u0633\u0627 \u0645\u062d\u0633\u0648\u0633 \u06a9\u0631 \u0631\u06c1\u06d2 \u06c1\u06cc\u06ba\u061f",
    },
  },
  zh: {
    code: "zh",
    name: "\u4e2d\u6587",
    flag: "\ud83c\udde8\ud83c\uddf3",
    ttsLang: "zh-CN",
    voiceKeywords: ["ting-ting", "google \u4e2d\u6587"],
    greeting: "\u4f60\u597d\uff01\u6211\u662fZari\u3002",
    ui: {
      talkTo: "\u548cZari\u804a\u5929",
      online: "\u5728\u7ebf",
      speaking: "\u8bf4\u8bdd\u4e2d...",
      thinking: "\u601d\u8003\u4e2d...",
      composing: "\u7f16\u5199\u4e2d...",
      howFeeling: "\u4eca\u5929\u611f\u89c9\u600e\u4e48\u6837\uff1f",
    },
  },
  pt: {
    code: "pt",
    name: "Portugu\u00eas",
    flag: "\ud83c\udde7\ud83c\uddf7",
    ttsLang: "pt-BR",
    voiceKeywords: ["luciana", "google portugu\u00eas"],
    greeting: "Oi! Eu sou a Zari.",
    ui: {
      talkTo: "Fale com Zari",
      online: "Online",
      speaking: "Falando...",
      thinking: "Pensando...",
      composing: "Compondo...",
      howFeeling: "Como voc\u00ea est\u00e1 se sentindo hoje?",
    },
  },
  de: {
    code: "de",
    name: "Deutsch",
    flag: "\ud83c\udde9\ud83c\uddea",
    ttsLang: "de-DE",
    voiceKeywords: ["anna", "google deutsch"],
    greeting: "Hallo! Ich bin Zari.",
    ui: {
      talkTo: "Sprich mit Zari",
      online: "Online",
      speaking: "Spricht...",
      thinking: "Denkt nach...",
      composing: "Verfasst...",
      howFeeling: "Wie f\u00fchlst du dich heute?",
    },
  },
  ja: {
    code: "ja",
    name: "\u65e5\u672c\u8a9e",
    flag: "\ud83c\uddef\ud83c\uddf5",
    ttsLang: "ja-JP",
    voiceKeywords: ["kyoko", "google \u65e5\u672c\u8a9e"],
    greeting: "\u3053\u3093\u306b\u3061\u306f\uff01Zari\u3067\u3059\u3002",
    ui: {
      talkTo: "Zari\u3068\u8a71\u3059",
      online: "\u30aa\u30f3\u30e9\u30a4\u30f3",
      speaking: "\u8a71\u3057\u3066\u3044\u308b...",
      thinking: "\u8003\u3048\u3066\u3044\u308b...",
      composing: "\u4f5c\u6210\u4e2d...",
      howFeeling: "\u4eca\u65e5\u306e\u6c17\u5206\u306f\uff1f",
    },
  },
  ko: {
    code: "ko",
    name: "\ud55c\uad6d\uc5b4",
    flag: "\ud83c\uddf0\ud83c\uddf7",
    ttsLang: "ko-KR",
    voiceKeywords: ["yuna", "google \ud55c\uad6d\uc5b4"],
    greeting: "\uc548\ub155! \ub098\ub294 Zari\uc57c.",
    ui: {
      talkTo: "Zari\uc640 \ub300\ud654",
      online: "\uc628\ub77c\uc778",
      speaking: "\ub9d0\ud558\ub294 \uc911...",
      thinking: "\uc0dd\uac01\ud558\ub294 \uc911...",
      composing: "\uc791\uc131 \uc911...",
      howFeeling: "\uc624\ub298 \uae30\ubd84\uc774 \uc5b4\ub54c?",
    },
  },
  tr: {
    code: "tr",
    name: "T\u00fcrk\u00e7e",
    flag: "\ud83c\uddf9\ud83c\uddf7",
    ttsLang: "tr-TR",
    voiceKeywords: ["yelda", "google t\u00fcrk\u00e7e"],
    greeting: "Merhaba! Ben Zari.",
    ui: {
      talkTo: "Zari ile konu\u015f",
      online: "\u00c7evrimi\u00e7i",
      speaking: "Konu\u015fuyor...",
      thinking: "D\u00fc\u015f\u00fcn\u00fcyor...",
      composing: "Yaz\u0131yor...",
      howFeeling: "Bug\u00fcn nas\u0131l hissediyorsun?",
    },
  },
  ru: {
    code: "ru",
    name: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439",
    flag: "\ud83c\uddf7\ud83c\uddfa",
    ttsLang: "ru-RU",
    voiceKeywords: ["milena", "google \u0440\u0443\u0441\u0441\u043a\u0438\u0439"],
    greeting: "\u041f\u0440\u0438\u0432\u0435\u0442! \u042f Zari.",
    ui: {
      talkTo: "\u041f\u043e\u0433\u043e\u0432\u043e\u0440\u0438 \u0441 Zari",
      online: "\u041e\u043d\u043b\u0430\u0439\u043d",
      speaking: "\u0413\u043e\u0432\u043e\u0440\u0438\u0442...",
      thinking: "\u0414\u0443\u043c\u0430\u0435\u0442...",
      composing: "\u041f\u0438\u0448\u0435\u0442...",
      howFeeling: "\u041a\u0430\u043a \u0442\u044b \u0441\u0435\u0431\u044f \u0447\u0443\u0432\u0441\u0442\u0432\u0443\u0435\u0448\u044c?",
    },
  },
  it: {
    code: "it",
    name: "Italiano",
    flag: "\ud83c\uddee\ud83c\uddf9",
    ttsLang: "it-IT",
    voiceKeywords: ["alice", "google italiano"],
    greeting: "Ciao! Sono Zari.",
    ui: {
      talkTo: "Parla con Zari",
      online: "Online",
      speaking: "Parla...",
      thinking: "Pensa...",
      composing: "Scrive...",
      howFeeling: "Come ti senti oggi?",
    },
  },
  sw: {
    code: "sw",
    name: "Kiswahili",
    flag: "\ud83c\uddf0\ud83c\uddea",
    ttsLang: "sw-KE",
    voiceKeywords: ["google kiswahili"],
    greeting: "Habari! Mimi ni Zari.",
    ui: {
      talkTo: "Ongea na Zari",
      online: "Mtandaoni",
      speaking: "Anazungumza...",
      thinking: "Anafikiria...",
      composing: "Anaandika...",
      howFeeling: "Unajisikiaje leo?",
    },
  },
  tl: {
    code: "tl",
    name: "Tagalog",
    flag: "\ud83c\uddf5\ud83c\udded",
    ttsLang: "fil-PH",
    voiceKeywords: ["google filipino"],
    greeting: "Kamusta! Ako si Zari.",
    ui: {
      talkTo: "Kausapin si Zari",
      online: "Online",
      speaking: "Nagsasalita...",
      thinking: "Nag-iisip...",
      composing: "Nagsusulat...",
      howFeeling: "Kumusta ang pakiramdam mo ngayon?",
    },
  },
};

export const languageList = Object.values(languages);

export function getLanguage(code: string): LanguageConfig {
  return languages[code] || languages.en;
}
