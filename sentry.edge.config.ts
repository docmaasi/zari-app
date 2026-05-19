import * as Sentry from "@sentry/nextjs";
import { scrubEvent } from "@/lib/sentry-scrub";

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  tracesSampleRate: 1.0,
  enabled: Boolean(dsn) && process.env.NODE_ENV === "production",
  beforeSend: (event) => scrubEvent(event),
});
