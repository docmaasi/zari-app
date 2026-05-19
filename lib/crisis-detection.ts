/**
 * Crisis detection for user input.
 *
 * Conservative pattern matching — false positives are acceptable because the
 * response (showing a resource banner alongside Zari's reply) is non-disruptive.
 * False negatives are the real risk; we err on the side of catching more.
 *
 * Returns the detected level so the client can render the correct resource.
 */

export type CrisisLevel = "none" | "self_harm" | "panic" | "abuse";

const SELF_HARM_PATTERNS = [
  /\bsuicid(e|al|ality)\b/i,
  /\bkill (myself|me)\b/i,
  /\bend (my|it all|my life|things)\b/i,
  /\bwant to die\b/i,
  /\bdon't want to (live|be here|exist)\b/i,
  /\b(can't|cannot) go on\b/i,
  /\bgive up on life\b/i,
  /\b(hurt|cut|harm)ing myself\b/i,
  /\bself[- ]harm/i,
  /\bno (reason|point) (to|in) liv(e|ing)\b/i,
  /\bbetter off (dead|without me|if i were gone)\b/i,
];

const PANIC_PATTERNS = [
  /\b(can'?t|cannot) breathe\b/i,
  /\bpanic(king| attack)\b/i,
  /\bheart (is )?racing\b/i,
  /\bhyperventilat/i,
  /\bdying (inside|right now)\b/i,
  /\b(losing|going out of) my mind\b/i,
];

const ABUSE_PATTERNS = [
  /\b(he|she|they|my (partner|boyfriend|girlfriend|husband|wife|dad|mom|parent)) (hit|hurt|abus|beat|rape)/i,
  /\bdomestic (violence|abuse)/i,
  /\bsexual(ly)? (assault|abuse|raped?)\b/i,
  /\bbeing (abused|raped|assaulted)/i,
];

export function detectCrisis(text: string): CrisisLevel {
  if (typeof text !== "string" || !text.trim()) return "none";
  const t = text.slice(0, 4000);
  if (SELF_HARM_PATTERNS.some((re) => re.test(t))) return "self_harm";
  if (ABUSE_PATTERNS.some((re) => re.test(t))) return "abuse";
  if (PANIC_PATTERNS.some((re) => re.test(t))) return "panic";
  return "none";
}

export const CRISIS_RESOURCES: Record<
  Exclude<CrisisLevel, "none">,
  {
    title: string;
    body: string;
    hotlines: Array<{ region: string; name: string; contact: string }>;
  }
> = {
  self_harm: {
    title: "You're not alone — please reach out",
    body: "I hear you, and I want you to talk to a real person who's trained for this moment. They're free, confidential, and available right now.",
    hotlines: [
      { region: "US", name: "988 Suicide & Crisis Lifeline", contact: "Call or text 988" },
      { region: "UK & Ireland", name: "Samaritans", contact: "Call 116 123" },
      { region: "Canada", name: "Talk Suicide Canada", contact: "Call 1-833-456-4566" },
      { region: "Global", name: "Find a hotline", contact: "findahelpline.com" },
    ],
  },
  panic: {
    title: "Let's breathe together",
    body: "What you're feeling will pass. Try a slow breath: in for 4, hold for 4, out for 6. If it keeps escalating, a crisis line can help.",
    hotlines: [
      { region: "US", name: "988 Lifeline", contact: "Call or text 988" },
      { region: "UK", name: "Samaritans", contact: "Call 116 123" },
    ],
  },
  abuse: {
    title: "You deserve to be safe",
    body: "What's happening to you is not your fault. Please reach out to a confidential advocate — they can help you plan what to do next.",
    hotlines: [
      { region: "US", name: "Domestic Violence Hotline", contact: "Call 1-800-799-7233 or text START to 88788" },
      { region: "US", name: "RAINN (sexual assault)", contact: "Call 1-800-656-4673" },
      { region: "UK", name: "Refuge", contact: "Call 0808 2000 247" },
    ],
  },
};
