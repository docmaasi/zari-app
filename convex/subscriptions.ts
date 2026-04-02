import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Admin emails that always get full Plus access
const ADMIN_EMAILS = ["docmaasi2@gmail.com"];

export const getSubscription = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    if (!user) return null;

    // Admin override — full access always
    if (ADMIN_EMAILS.includes(user.email)) {
      return {
        plan: "plus_yearly",
        status: "active",
        expiresAt: null,
      };
    }

    return {
      plan: user.plan || "free",
      status: user.subscriptionStatus || "free",
      expiresAt: user.planExpiresAt,
    };
  },
});

export const updateSubscription = mutation({
  args: {
    stripeCustomerId: v.string(),
    subscriptionId: v.optional(v.string()),
    subscriptionStatus: v.string(),
    plan: v.string(),
    planExpiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_stripe_customer", (q) =>
        q.eq("stripeCustomerId", args.stripeCustomerId)
      )
      .first();
    if (!user) return null;

    // For cancellations, only cancel if the subscription ID matches
    // This prevents late webhooks from cancelling a newer subscription
    if (
      args.subscriptionStatus === "canceled" &&
      user.subscriptionId &&
      args.subscriptionId &&
      user.subscriptionId !== args.subscriptionId
    ) {
      return user._id; // Skip — this is an old subscription
    }

    await ctx.db.patch(user._id, {
      subscriptionId: args.subscriptionId,
      subscriptionStatus: args.subscriptionStatus,
      plan: args.plan,
      planExpiresAt: args.planExpiresAt,
    });
    return user._id;
  },
});

export const setStripeCustomerId = mutation({
  args: {
    clerkId: v.string(),
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    if (!user) return null;

    await ctx.db.patch(user._id, {
      stripeCustomerId: args.stripeCustomerId,
    });
    return user._id;
  },
});

export const getDailyMessageCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Use UTC midnight — not perfect for all timezones but consistent
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("role"), "user"),
          q.gte(q.field("createdAt"), startOfDay.getTime())
        )
      )
      .collect();

    return messages.length;
  },
});

export const getDailyVoiceCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0];
    const record = await ctx.db
      .query("voiceUsage")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId).eq("date", today)
      )
      .first();
    return record?.count || 0;
  },
});

export const incrementVoiceCount = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0];
    const record = await ctx.db
      .query("voiceUsage")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId).eq("date", today)
      )
      .first();

    if (record) {
      await ctx.db.patch(record._id, { count: record.count + 1 });
    } else {
      await ctx.db.insert("voiceUsage", {
        userId: args.userId,
        date: today,
        count: 1,
      });
    }
  },
});
