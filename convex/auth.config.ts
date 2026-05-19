// Clerk-Convex JWT integration.
//
// For full enforcement, the user must add a JWT template named "convex" in the
// Clerk Dashboard → JWT Templates that uses Convex as the audience and signs
// with the same Clerk instance referenced below. Until that template exists,
// `ctx.auth.getUserIdentity()` will return null and Convex functions fall back
// to legacy arg-trust mode (see convex/security.ts).
//
// Previously this hardcoded `https://brief-iguana-83.clerk.accounts.dev` —
// the DEVELOPMENT Clerk instance. Shipping a dev issuer to prod means
// real Clerk-signed tokens are rejected and every protected query falls
// back to the legacy arg-trust path (effectively no JWT enforcement).
// Now driven by env var: set it via `npx convex env set CLERK_JWT_ISSUER_DOMAIN
// https://clerk.zari.help` (or the prod Frontend API URL). The hardcoded dev
// domain is preserved as a fallback so local development keeps working until
// the env var is configured.
const CLERK_JWT_ISSUER_DOMAIN =
  process.env.CLERK_JWT_ISSUER_DOMAIN ??
  "https://brief-iguana-83.clerk.accounts.dev";

if (!process.env.CLERK_JWT_ISSUER_DOMAIN) {
  console.warn(
    "[convex.auth.config] CLERK_JWT_ISSUER_DOMAIN not set — falling back to the dev Clerk issuer. Set it with: `npx convex env set CLERK_JWT_ISSUER_DOMAIN https://<your-clerk-frontend-api>` before treating this deployment as production-secure.",
  );
}

export default {
  providers: [
    {
      domain: CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
