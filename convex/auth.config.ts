// Clerk-Convex JWT integration.
//
// For full enforcement, the user must add a JWT template named "convex" in the
// Clerk Dashboard → JWT Templates that uses Convex as the audience and signs
// with the same Clerk instance referenced below. Until that template exists,
// `ctx.auth.getUserIdentity()` will return null and Convex functions fall back
// to legacy arg-trust mode (see convex/security.ts).
export default {
  providers: [
    {
      domain: "https://brief-iguana-83.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
