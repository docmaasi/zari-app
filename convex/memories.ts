import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addMemory = mutation({
  args: {
    userId: v.id("users"),
    category: v.string(),
    fact: v.string(),
    people: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Duplicate check
    const existing = await ctx.db
      .query("memories")
      .withIndex("by_user_category", (q) =>
        q.eq("userId", args.userId).eq("category", args.category)
      )
      .collect();

    const isDuplicate = existing.some(
      (m) => m.fact.toLowerCase() === args.fact.toLowerCase()
    );
    if (isDuplicate) return null;

    const now = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return await ctx.db.insert("memories", {
      userId: args.userId,
      category: args.category,
      fact: args.fact,
      people: args.people,
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().split(" ")[0].slice(0, 5),
      dayOfWeek: days[now.getDay()],
      timestamp: Date.now(),
    });
  },
});

export const getMemories = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("memories")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getByCategory = query({
  args: {
    userId: v.id("users"),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("memories")
      .withIndex("by_user_category", (q) =>
        q.eq("userId", args.userId).eq("category", args.category)
      )
      .collect();
  },
});

export const deleteMemory = mutation({
  args: { memoryId: v.id("memories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.memoryId);
  },
});

export const clearAll = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const memories = await ctx.db
      .query("memories")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const memory of memories) {
      await ctx.db.delete(memory._id);
    }
  },
});

export const getCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const memories = await ctx.db
      .query("memories")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return memories.length;
  },
});
