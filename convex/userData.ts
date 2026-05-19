/**
 * Self-service data export. GDPR Article 20 (right to data portability).
 *
 * Account deletion is handled by Clerk's built-in <UserProfile />
 * component (rendered at /account).
 */

import { query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const USER_TABLES = [
  "conversations",
  "messages",
  "memories",
  "streaks",
  "voiceNotes",
  "reminders",
  "moodHistory",
  "pushSubscriptions",
  "voiceUsage",
] as const;

export const exportMyData = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user) throw new Error("User row not found");

    const data: Record<string, unknown[] | { error: string }> = {};
    for (const table of USER_TABLES) {
      data[table] = await safeRead(ctx, table, user._id);
    }

    return {
      exportedAt: new Date().toISOString(),
      userId: user._id,
      clerkId: identity.subject,
      email: identity.email ?? null,
      schemaVersion: "1.0",
      data,
    };
  },
});

type DbQuery = {
  query: (table: string) => {
    withIndex: (
      name: string,
      cb: (q: { eq: (col: string, val: Id<"users">) => unknown }) => unknown,
    ) => { collect: () => Promise<unknown[]> };
  };
};

async function safeRead(
  ctx: QueryCtx,
  table: string,
  userId: Id<"users">,
): Promise<unknown[] | { error: string }> {
  try {
    const db = ctx.db as unknown as DbQuery;
    return await db
      .query(table)
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  } catch (err) {
    return { error: err instanceof Error ? err.message : "read failed" };
  }
}
