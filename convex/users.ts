import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assertOwnerByClerkId, assertOwnerByUserId } from "./security";

// Called only from the Clerk webhook (signature-verified) and from authenticated
// API routes — does not assert identity match because Clerk webhook has no JWT.
export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });
  },
});

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    await assertOwnerByClerkId(ctx, args.clerkId);
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

export const updatePreferences = mutation({
  args: {
    userId: v.id("users"),
    gender: v.optional(v.string()),
    language: v.optional(v.string()),
    mood: v.optional(v.string()),
    voiceEnabled: v.optional(v.boolean()),
    voiceId: v.optional(v.string()),
    orbColor: v.optional(v.string()),
    name: v.optional(v.string()),
    namePronunciation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    const { userId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, val]) => val !== undefined)
    );
    await ctx.db.patch(userId, filtered);
  },
});
