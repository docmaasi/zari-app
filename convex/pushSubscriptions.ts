import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { assertOwnerByUserId } from "./security";

export const subscribe = mutation({
  args: {
    userId: v.id("users"),
    endpoint: v.string(),
    p256dh: v.string(),
    auth: v.string(),
  },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    // Check for existing subscription with same endpoint
    const existing = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const duplicate = existing.find((s) => s.endpoint === args.endpoint);
    if (duplicate) return duplicate._id;

    return await ctx.db.insert("pushSubscriptions", {
      userId: args.userId,
      endpoint: args.endpoint,
      p256dh: args.p256dh,
      auth: args.auth,
      createdAt: Date.now(),
    });
  },
});

export const unsubscribe = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    const subs = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const sub of subs) {
      await ctx.db.delete(sub._id);
    }
  },
});

export const getSubscriptions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await assertOwnerByUserId(ctx, args.userId);
    return await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Internal — listed via system-token API route. Returns Plus/trial users with
// push subs who haven't been pinged in the past 24h. The cron then picks who
// actually gets a message via Haiku and web-push.
export const listOutreachCandidates = query({
  args: { secret: v.string() },
  handler: async (ctx, args) => {
    if (args.secret !== process.env.CRON_SECRET) {
      throw new Error("Forbidden");
    }
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const subs = await ctx.db.query("pushSubscriptions").collect();
    const fresh = subs.filter(
      (s) => !s.lastNotifiedAt || s.lastNotifiedAt < cutoff
    );
    return fresh;
  },
});

export const markNotified = mutation({
  args: {
    secret: v.string(),
    subscriptionId: v.id("pushSubscriptions"),
  },
  handler: async (ctx, args) => {
    if (args.secret !== process.env.CRON_SECRET) {
      throw new Error("Forbidden");
    }
    await ctx.db.patch(args.subscriptionId, { lastNotifiedAt: Date.now() });
  },
});

export const deleteByEndpoint = mutation({
  args: {
    secret: v.string(),
    endpoint: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.secret !== process.env.CRON_SECRET) {
      throw new Error("Forbidden");
    }
    const subs = await ctx.db.query("pushSubscriptions").collect();
    for (const s of subs) {
      if (s.endpoint === args.endpoint) {
        await ctx.db.delete(s._id);
      }
    }
  },
});
