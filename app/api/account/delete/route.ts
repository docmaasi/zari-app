import { auth, clerkClient } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";
import { getAuthenticatedConvex } from "@/lib/convex-server";
import { rateLimit, rlKey, LIMITS } from "@/lib/rate-limit";

// Permanently delete the user — Convex records first (memories, conversations,
// messages, streaks, etc), then the Clerk identity. Idempotent: if either side
// is already gone, we still return 200.
//
// Heavily rate-limited (3/min/user) — even though it's auth-gated, repeated
// hits are pure-cost and a clear malicious signal.
export async function POST() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const rl = await rateLimit(
      rlKey("acct-delete", clerkId),
      LIMITS.account.max,
      LIMITS.account.windowMs
    );
    if (!rl.ok) {
      return NextResponse.json(
        { error: "rate_limited" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetIn / 1000)) } }
      );
    }

    const convex = await getAuthenticatedConvex();
    if (!convex) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await convex.query(api.users.getByClerkId, { clerkId });
    if (user) {
      await convex.mutation(api.users.deleteAccount, { userId: user._id });
    }

    try {
      const client = await clerkClient();
      await client.users.deleteUser(clerkId);
    } catch (err) {
      Sentry.captureException(err, {
        tags: { route: "account-delete", phase: "clerk" },
      });
      console.error("Clerk user delete failed:", err);
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    Sentry.captureException(error, { tags: { route: "account-delete" } });
    console.error("Account delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
