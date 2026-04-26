import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";

/**
 * Build a Convex HTTP client that carries the authenticated user's Clerk
 * JWT (template name "convex"). Required for any API route that calls
 * Convex functions guarded by assertOwnerBy*.
 *
 * Returns null when:
 * - There is no authenticated Clerk session, OR
 * - The "convex" Clerk JWT template is missing / token mint failed
 *
 * Callers should treat null as 401.
 */
export async function getAuthenticatedConvex(): Promise<ConvexHttpClient | null> {
  const { getToken } = await auth();
  const token = await getToken({ template: "convex" });
  if (!token) return null;
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  client.setAuth(token);
  return client;
}
