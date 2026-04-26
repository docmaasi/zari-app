import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assertOwnerByUserId, assertOwnerOfRecord } from "./security";

export const create = mutation({
  args: {
    userId: v.id("users"),
    text: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    return await ctx.db.insert("reminders", {
      userId: args.userId,
      text: args.text,
      date: args.date,
      time: args.time,
      completed: false,
      createdAt: Date.now(),
    });
  },
});

export const getUpcoming = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    const today = new Date().toISOString().split("T")[0];
    return await ctx.db
      .query("reminders")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId).gte("date", today)
      )
      .filter((q) => q.eq(q.field("completed"), false))
      .take(20);
  },
});

export const complete = mutation({
  args: { reminderId: v.id("reminders") },
  handler: async (ctx, args) => {
    const reminder = await ctx.db.get(args.reminderId);
    await assertOwnerOfRecord(ctx, reminder);
    await ctx.db.patch(args.reminderId, { completed: true });
  },
});
