/**
 * Server-side heuristics for blocking automated traffic.
 *
 * Catches: Playwright, Puppeteer, Selenium, PhantomJS, Headless Chrome,
 * curl/wget/python-requests, and known scrapers.
 *
 * Allows: known good bots (Googlebot, Bingbot, social link previews) — they
 * see the marketing pages but should never reach POST API endpoints.
 *
 * This is a heuristic layer, not a wall. It pairs with rate limiting and
 * honeypots so that even a UA-spoofing bot has to clear multiple gates.
 */

const AUTOMATION_UA = [
  /headlesschrome/i,
  /playwright/i,
  /puppeteer/i,
  /selenium/i,
  /webdriver/i,
  /phantomjs/i,
  /chromedriver/i,
  /geckodriver/i,
  /scrapy/i,
  /python-requests/i,
  /python-urllib/i,
  /aiohttp/i,
  /go-http-client/i,
  /\bcurl\//i,
  /\bwget\//i,
  /libwww-perl/i,
  /httpx/i,
  /okhttp/i,
  /node-fetch/i,
  /apache-httpclient/i,
];

const GOOD_BOTS = [
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /discordbot/i,
  /applebot/i,
];

export interface BotCheck {
  isBot: boolean;
  isGoodBot: boolean;
  reason?: string;
}

export function detectBot(userAgent: string | null): BotCheck {
  const ua = (userAgent || "").trim();
  if (!ua) return { isBot: true, isGoodBot: false, reason: "missing-ua" };
  if (ua.length < 10) return { isBot: true, isGoodBot: false, reason: "short-ua" };

  for (const re of GOOD_BOTS) {
    if (re.test(ua)) return { isBot: true, isGoodBot: true };
  }

  for (const re of AUTOMATION_UA) {
    if (re.test(ua)) {
      return { isBot: true, isGoodBot: false, reason: `automation:${re.source}` };
    }
  }

  return { isBot: false, isGoodBot: false };
}

/**
 * For routes where we want to BLOCK automation hard — never just warn.
 * Returns null if the request is OK, or a Response (403) to short-circuit.
 */
export function blockBotsOrPass(req: Request): Response | null {
  const ua = req.headers.get("user-agent");
  const check = detectBot(ua);
  if (check.isBot && !check.isGoodBot) {
    return new Response(
      JSON.stringify({ error: "Automated traffic blocked" }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "X-Block-Reason": check.reason || "bot",
        },
      }
    );
  }
  return null;
}
