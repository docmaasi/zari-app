import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://3bf78caea4a7d0367a07f3e4812a8733@o4511160331075584.ingest.us.sentry.io/4511160459657216",

  // Performance monitoring — sample 10% of transactions in production
  tracesSampleRate: 1.0,

  // Session replay — capture 10% of sessions, 100% on error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration(),
  ],

  // Only send errors in production
  enabled: process.env.NODE_ENV === "production",
});
