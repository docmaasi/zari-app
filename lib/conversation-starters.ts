interface StarterSet {
  starters: string[];
}

const startersByLang: Record<string, Record<string, StarterSet>> = {
  en: {
    female: {
      starters: [
        "I need someone to talk to",
        "Help me work through a decision",
        "I want to set a new goal",
        "Tell me something that'll make my day",
        "I'm feeling stressed today",
        "What should I do this weekend?",
      ],
    },
    male: {
      starters: [
        "Give me a reality check",
        "Help me plan my next move",
        "I need to solve a problem",
        "Push me to do something bold",
        "What's something I should know today?",
        "Help me think bigger",
      ],
    },
    neutral: {
      starters: [
        "How are you, Zari?",
        "Help me think through something",
        "I need advice on a situation",
        "Tell me something interesting",
        "I want to learn something new",
        "What should I focus on today?",
      ],
    },
  },
  es: {
    female: {
      starters: [
        "Necesito hablar con alguien",
        "Ayudame a tomar una decision",
        "Quiero fijar una nueva meta",
        "Estoy estresada hoy",
      ],
    },
    male: {
      starters: [
        "Dame una opinion honesta",
        "Ayudame a planear mi siguiente paso",
        "Necesito resolver un problema",
        "Motivame a hacer algo grande",
      ],
    },
    neutral: {
      starters: [
        "Hola Zari, como estas?",
        "Ayudame a pensar en algo",
        "Necesito un consejo",
        "Cuentame algo interesante",
      ],
    },
  },
};

export function getStarters(lang: string, gender: string): string[] {
  const langSet = startersByLang[lang] || startersByLang.en;
  const genderSet = langSet[gender] || langSet.neutral;
  // Pick 4 random starters
  const shuffled = [...genderSet.starters].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}
