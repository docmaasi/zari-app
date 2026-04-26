import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assertOwnerByUserId } from "./security";

export const record = mutation({
  args: {
    userId: v.id("users"),
    mood: v.string(),
  },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    const today = new Date().toISOString().split("T")[0];

    // One mood per day — update if exists
    const existing = await ctx.db
      .query("moodHistory")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("date"), today))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { mood: args.mood });
      return existing._id;
    }

    return await ctx.db.insert("moodHistory", {
      userId: args.userId,
      mood: args.mood,
      date: today,
      createdAt: Date.now(),
    });
  },
});

export const getLast30Days = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    return await ctx.db
      .query("moodHistory")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(30);
  },
});

export const getWeekSummary = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekStr = weekAgo.toISOString().split("T")[0];

    const moods = await ctx.db
      .query("moodHistory")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.gte(q.field("date"), weekStr))
      .collect();

    return moods;
  },
});
