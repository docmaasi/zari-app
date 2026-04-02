import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getStreak = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("streaks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const recordActivity = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0];
    const existing = await ctx.db
      .query("streaks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!existing) {
      return await ctx.db.insert("streaks", {
        userId: args.userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
        totalDaysActive: 1,
        firstChatDate: today,
        totalMessages: 1,
      });
    }

    // Already logged today
    if (existing.lastActiveDate === today) {
      await ctx.db.patch(existing._id, {
        totalMessages: existing.totalMessages + 1,
      });
      return existing._id;
    }

    // Check if yesterday — streak continues
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newStreak = 1;
    if (existing.lastActiveDate === yesterdayStr) {
      newStreak = existing.currentStreak + 1;
    }

    const newLongest = Math.max(newStreak, existing.longestStreak);

    await ctx.db.patch(existing._id, {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActiveDate: today,
      totalDaysActive: existing.totalDaysActive + 1,
      totalMessages: existing.totalMessages + 1,
    });

    return existing._id;
  },
});

export const getDaysSinceLastActive = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const streak = await ctx.db
      .query("streaks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    if (!streak) return null;

    const last = new Date(streak.lastActiveDate);
    const now = new Date();
    const diff = Math.floor(
      (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  },
});
