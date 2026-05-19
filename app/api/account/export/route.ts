import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";
import { getAuthenticatedConvex } from "@/lib/convex-server";
import { rateLimit, rlKey, LIMITS } from "@/lib/rate-limit";

// Returns a JSON dump of everything Zari has stored about the authenticated
// user — memories, moods, streaks, voice notes, reminders, journal cache,
// referral code, and the raw user record. GDPR/CCPA "right of access" play.
export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const rl = await rateLimit(
      rlKey("acct-export", clerkId),
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
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [memories, streak] = await Promise.all([
      convex.query(api.memories.getMemories, { userId: user._id }),
      convex.query(api.streaks.getStreak, { userId: user._id }),
    ]);

    const dump = {
      exportedAt: new Date().toISOString(),
      schemaVersion: 1,
      user: {
        name: user.name,
        email: user.email,
        personality: (user as { personality?: string }).personality || user.gender,
        language: user.language,
        mood: user.mood,
        voiceEnabled: user.voiceEnabled,
        voiceId: user.voiceId,
        namePronunciation: user.namePronunciation,
        createdAt: user.createdAt,
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus,
        ageConfirmedAt: (user as { ageConfirmedAt?: number }).ageConfirmedAt,
      },
      memories,
      streak,
    };

    return new NextResponse(JSON.stringify(dump, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="zari-data-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    Sentry.captureException(error, { tags: { route: "account-export" } });
    console.error("Account export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
