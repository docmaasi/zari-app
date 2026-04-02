import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "ZARI-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export const getOrCreateCode = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("referrals")
      .withIndex("by_referrer", (q) => q.eq("referrerId", args.userId))
      .first();

    if (existing) return existing.referralCode;

    const code = generateCode();
    await ctx.db.insert("referrals", {
      referrerId: args.userId,
      referralCode: code,
      status: "pending",
      createdAt: Date.now(),
    });
    return code;
  },
});

export const getReferralStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const referrals = await ctx.db
      .query("referrals")
      .withIndex("by_referrer", (q) => q.eq("referrerId", args.userId))
      .collect();

    const signedUp = referrals.filter(
      (r) => r.status === "signed_up" || r.status === "rewarded"
    ).length;
    const code = referrals[0]?.referralCode || null;

    return { code, totalReferred: signedUp, referrals };
  },
});

export const redeemReferral = mutation({
  args: {
    referralCode: v.string(),
    newUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const referral = await ctx.db
      .query("referrals")
      .withIndex("by_code", (q) =>
        q.eq("referralCode", args.referralCode)
      )
      .first();

    if (!referral) return { success: false, error: "Invalid code" };
    if (referral.referrerId === args.newUserId) {
      return { success: false, error: "Cannot refer yourself" };
    }

    await ctx.db.patch(referral._id, {
      referredUserId: args.newUserId,
      status: "signed_up",
    });

    return { success: true };
  },
});
