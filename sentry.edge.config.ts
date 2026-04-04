import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://3bf78caea4a7d0367a07f3e4812a8733@o4511160331075584.ingest.us.sentry.io/4511160459657216",

  // Performance monitoring
  tracesSampleRate: 1.0,

  // Only send errors in production
  enabled: process.env.NODE_ENV === "production",
});
