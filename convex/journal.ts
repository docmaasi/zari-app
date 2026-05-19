import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assertOwnerByUserId } from "./security";

// Stale-after window: regenerate Zari's journal every 7 days.
const JOURNAL_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const getCached = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    const row = await ctx.db
      .query("zariJournal")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    if (!row) return null;
    const stale = Date.now() - row.generatedAt > JOURNAL_TTL_MS;
    return {
      entries: row.entries,
      generatedAt: row.generatedAt,
      seenInChatAt: row.seenInChatAt,
      stale,
    };
  },
});

export const setCached = mutation({
  args: {
    userId: v.id("users"),
    entries: v.string(),
  },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    const row = await ctx.db
      .query("zariJournal")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    if (row) {
      await ctx.db.patch(row._id, {
        entries: args.entries,
        generatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("zariJournal", {
        userId: args.userId,
        entries: args.entries,
        generatedAt: Date.now(),
      });
    }
  },
});

export const markSeenInChat = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    const row = await ctx.db
      .query("zariJournal")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    if (row) {
      await ctx.db.patch(row._id, { seenInChatAt: Date.now() });
    }
  },
});
