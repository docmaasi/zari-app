const { withSentryConfig } = require("@sentry/nextjs");

// Strict transport: HSTS only meaningful over HTTPS (prod). Skipping it on
// localhost prevents Chrome from caching a hardcoded HTTPS preference for dev.
const isProd = process.env.NODE_ENV === "production";

// Content-Security-Policy: explicit allow-lists for the third parties Zari
// actually talks to. 'unsafe-inline' / 'unsafe-eval' kept on scripts because
// Clerk + Next dev hot-reload require it; in a future hardening pass we can
// move to nonce-based CSP.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self' https://*.clerk.accounts.dev https://*.clerk.com",
  "img-src 'self' data: blob: https://img.clerk.com https://*.clerk.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.com https://*.sentry.io https://browser.sentry-cdn.com",
  "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://*.clerk.accounts.dev https://*.clerk.com https://*.ingest.us.sentry.io https://*.ingest.sentry.io https://api.anthropic.com https://api.elevenlabs.io https://api.stripe.com",
  "media-src 'self' blob: https://api.elevenlabs.io",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(self), geolocation=(), interest-cohort=(), payment=(self)",
  },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Content-Security-Policy", value: csp },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply to every non-api response. API routes set their own CORS/cache
        // headers (chat streaming, file downloads) — we still get the rest via
        // the middleware response.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = withSentryConfig(nextConfig, {
  org: "smith-medical",
  project: "javascript-react",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
